import { createHash, randomUUID } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  realpath,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  posix,
  relative,
  resolve,
  sep,
} from "node:path";

import {
  translatePlan,
  type TranslationCheckpoint,
  type TranslationProvider,
  type TranslationQualityPolicy,
  type TranslationResult,
} from "@easy-translate/core";

import {
  markdownDocumentAdapter,
  type MarkdownTranslationContext,
} from "./markdown-adapter.ts";
import {
  loadTranslationWorkspace,
  readTranslationWorkspaceFile,
} from "./planner.ts";
import type {
  TranslationGlossary,
  TranslationManifest,
  TranslationPageRecord,
  TranslationWorkspaceSnapshot,
} from "./types.ts";

const TRANSLATABLE_STATES = new Set([
  "missing-target",
  "pending",
  "stale-policy",
  "stale-source",
]);
const PLACEHOLDER_PATTERN =
  /\$\{[A-Z][A-Z\d_]*\}|\$[A-Z][A-Z\d_]*|\{\{[^{}\r\n]+\}\}|%[difso]/gu;

export interface TranslationPageRunOptions {
  batchSize?: number | undefined;
  commit?: boolean | undefined;
  concurrency?: number | undefined;
  maxBatchCharacters?: number | undefined;
  now?: (() => Date) | undefined;
  provider: TranslationProvider<MarkdownTranslationContext>;
  retry?: number | undefined;
  useCheckpoint?: boolean | undefined;
}

export interface TranslationPageRunResult {
  checkpointPath: string;
  committed: boolean;
  record: TranslationPageRecord;
  rendered: string;
  result: TranslationResult;
  sourceUrl: string;
  targetPath: string;
}

export interface TranslationPageReviewResult {
  reviewStatus: "reviewed";
  sourceUrl: string;
  targetPath: string;
  targetSha256: string;
}

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function isErrno(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function assertInsideRoot(root: string, candidate: string, label: string): void {
  const fromRoot = relative(root, candidate);
  if (
    fromRoot === ".." ||
    fromRoot.startsWith(`..${sep}`) ||
    isAbsolute(fromRoot)
  ) {
    throw new Error(`${label} 必须位于仓库内：${candidate}`);
  }
}

function repositoryPath(root: string, path: string, label: string): string {
  if (
    !path ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path.includes("\0") ||
    path.endsWith("/") ||
    posix.normalize(path) !== path ||
    path === "." ||
    path === ".." ||
    path.startsWith("../")
  ) {
    throw new Error(`${label} 必须是仓库内的 POSIX 相对路径：${path}`);
  }
  const absolute = resolve(root, path);
  assertInsideRoot(root, absolute, label);
  return absolute;
}

async function ensureSafeDirectory(
  root: string,
  directory: string,
  label: string,
): Promise<void> {
  assertInsideRoot(root, directory, label);
  const relativeDirectory = relative(root, directory);
  let current = root;
  for (const segment of relativeDirectory.split(sep).filter(Boolean)) {
    current = join(current, segment);
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        throw new Error(`${label} 不能经过符号链接或非目录：${current}`);
      }
    } catch (error) {
      if (!isErrno(error, "ENOENT")) throw error;
      await mkdir(current);
      const stat = await lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        throw new Error(`${label} 创建后不是安全目录：${current}`);
      }
    }
  }
  assertInsideRoot(root, await realpath(directory), label);
}

async function assertSafeExistingTarget(
  root: string,
  target: string,
  label: string,
): Promise<void> {
  try {
    const stat = await lstat(target);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw new Error(`${label} 不能覆盖符号链接或非文件：${target}`);
    }
    assertInsideRoot(root, await realpath(target), label);
  } catch (error) {
    if (!isErrno(error, "ENOENT")) throw error;
  }
}

export async function atomicWriteRepositoryFile(
  repositoryRoot: string,
  path: string,
  content: string,
  label: string,
): Promise<void> {
  const root = await realpath(resolve(repositoryRoot));
  const target = repositoryPath(root, path, label);
  const parent = dirname(target);
  await ensureSafeDirectory(root, parent, label);
  await assertSafeExistingTarget(root, target, label);
  const realParent = await realpath(parent);
  assertInsideRoot(root, realParent, label);
  const temporary = join(
    realParent,
    `.${basename(target)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
    await rename(temporary, target);
  } catch (error) {
    try {
      await unlink(temporary);
    } catch (cleanupError) {
      if (!isErrno(cleanupError, "ENOENT")) throw cleanupError;
    }
    throw error;
  }
}

function checkpointPath(sourceUrl: string, policySha256: string): string {
  return `.cache/translation-checkpoints/${sha256(`${sourceUrl}\n${policySha256}`)}.json`;
}

function parseCheckpoint(raw: unknown, path: string): TranslationCheckpoint {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(`Checkpoint 必须是对象：${path}`);
  }
  const object = raw as Record<string, unknown>;
  const unexpected = Object.keys(object).filter(
    (key) =>
      ![
        "documentId",
        "instructions",
        "schemaVersion",
        "sourceLanguage",
        "targetLanguage",
        "translations",
      ].includes(key),
  );
  if (unexpected.length) {
    throw new Error(`Checkpoint 包含未知字段：${unexpected.sort().join("、")}`);
  }
  if (
    object.schemaVersion !== 1 ||
    typeof object.documentId !== "string" ||
    !object.documentId ||
    typeof object.targetLanguage !== "string" ||
    !object.targetLanguage ||
    !Array.isArray(object.translations)
  ) {
    throw new Error(`Checkpoint 契约无效：${path}`);
  }
  const translations = object.translations.map((value, index) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error(`Checkpoint translations[${index}] 无效：${path}`);
    }
    const item = value as Record<string, unknown>;
    const itemUnexpected = Object.keys(item).filter(
      (key) => !["id", "sourceText", "translatedText"].includes(key),
    );
    if (itemUnexpected.length) {
      throw new Error(
        `Checkpoint translations[${index}] 包含未知字段：${itemUnexpected
          .sort()
          .join("、")}`,
      );
    }
    if (
      typeof item.id !== "string" ||
      !item.id ||
      typeof item.sourceText !== "string" ||
      typeof item.translatedText !== "string" ||
      !item.translatedText.trim()
    ) {
      throw new Error(`Checkpoint translations[${index}] 契约无效：${path}`);
    }
    return {
      id: item.id,
      sourceText: item.sourceText,
      translatedText: item.translatedText,
    };
  });
  const checkpoint: TranslationCheckpoint = {
    documentId: object.documentId,
    schemaVersion: 1,
    targetLanguage: object.targetLanguage,
    translations,
  };
  if (typeof object.instructions === "string") {
    checkpoint.instructions = object.instructions;
  } else if (object.instructions !== undefined) {
    throw new Error(`Checkpoint.instructions 无效：${path}`);
  }
  if (typeof object.sourceLanguage === "string") {
    checkpoint.sourceLanguage = object.sourceLanguage;
  } else if (object.sourceLanguage !== undefined) {
    throw new Error(`Checkpoint.sourceLanguage 无效：${path}`);
  }
  return checkpoint;
}

async function readOptionalCheckpoint(
  workspace: TranslationWorkspaceSnapshot,
  path: string,
): Promise<TranslationCheckpoint | undefined> {
  const absolute = repositoryPath(workspace.repositoryRoot, path, "Checkpoint");
  try {
    const realFile = await realpath(absolute);
    assertInsideRoot(workspace.repositoryRoot, realFile, "Checkpoint");
    return parseCheckpoint(
      JSON.parse(await readFile(realFile, "utf8")) as unknown,
      path,
    );
  } catch (error) {
    if (isErrno(error, "ENOENT")) return undefined;
    if (error instanceof SyntaxError) {
      throw new Error(`Checkpoint 不是有效 JSON：${path}`, { cause: error });
    }
    throw error;
  }
}

function sortedTokens(content: string): string[] {
  return [...content.matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[0])
    .sort();
}

export function createTranslationQualityPolicy(
  glossary: TranslationGlossary,
): TranslationQualityPolicy<MarkdownTranslationContext> {
  return ({ item, translatedText }) => {
    if (!translatedText.trim()) {
      return {
        issueCode: "translation.empty",
        message: "译文不能为空。",
        retryInstruction: "必须返回非空译文。",
      };
    }
    for (const term of glossary.preserve) {
      if (item.text.includes(term) && !translatedText.includes(term)) {
        return {
          issueCode: "translation.preserve_missing",
          message: `必须保留术语：${term}`,
          retryInstruction: `原样保留 ${term}。`,
        };
      }
    }
    for (const [source, target] of Object.entries(glossary.terms)) {
      if (item.text.includes(source) && !translatedText.includes(target)) {
        return {
          issueCode: "translation.term_missing",
          message: `术语 ${source} 必须翻译为 ${target}。`,
          retryInstruction: `使用指定术语：${source} → ${target}。`,
        };
      }
    }
    const sourceTokens = sortedTokens(item.text);
    const targetTokens = sortedTokens(translatedText);
    if (JSON.stringify(sourceTokens) !== JSON.stringify(targetTokens)) {
      return {
        issueCode: "translation.placeholder_changed",
        message: "译文改变了占位符。",
        retryInstruction: "逐字保留所有占位符及其数量。",
      };
    }
    return undefined;
  };
}

function instructionsForWorkspace(workspace: TranslationWorkspaceSnapshot): string {
  return `${workspace.prompt.trim()}\n\n术语表：\n${JSON.stringify(
    workspace.glossary,
    null,
    2,
  )}`;
}

function stableManifest(
  manifest: TranslationManifest,
  record: TranslationPageRecord,
  generatedAt: string,
): TranslationManifest {
  return {
    generatedAt,
    pages: Object.fromEntries(
      Object.entries({ ...manifest.pages, [record.sourceUrl]: record }).sort(
        ([left], [right]) => left.localeCompare(right, "en"),
      ),
    ),
    schemaVersion: 1,
    targetLanguage: manifest.targetLanguage,
  };
}

export async function commitTranslationPage(
  workspace: TranslationWorkspaceSnapshot,
  record: TranslationPageRecord,
  rendered: string,
): Promise<void> {
  const fresh = await loadTranslationWorkspace(
    workspace.repositoryRoot,
    workspace.configPath,
  );
  const entry = fresh.entries.find(
    (candidate) => candidate.source?.sourceUrl === record.sourceUrl,
  );
  if (
    !entry?.source ||
    !TRANSLATABLE_STATES.has(entry.state) ||
    entry.source.sha256 !== record.sourceSha256 ||
    entry.source.sourcePath !== record.sourcePath ||
    entry.targetPath !== record.targetPath ||
    fresh.policySha256 !== record.policySha256
  ) {
    throw new Error(`提交前翻译工作区已变化，拒绝写入：${record.sourceUrl}`);
  }
  const manifest = stableManifest(
    fresh.translationManifest,
    record,
    record.translatedAt,
  );
  await atomicWriteRepositoryFile(
    workspace.repositoryRoot,
    record.targetPath,
    rendered,
    "中文译文",
  );
  await atomicWriteRepositoryFile(
    workspace.repositoryRoot,
    workspace.config.translationManifestPath,
    JSON.stringify(manifest, null, 2) + "\n",
    "中文 translation manifest",
  );
}

export async function reviewTranslationPage(
  workspace: TranslationWorkspaceSnapshot,
  sourceUrl: string,
  now: () => Date = () => new Date(),
): Promise<TranslationPageReviewResult> {
  const fresh = await loadTranslationWorkspace(
    workspace.repositoryRoot,
    workspace.configPath,
  );
  const entry = fresh.entries.find(
    (candidate) => candidate.source?.sourceUrl === sourceUrl,
  );
  if (!entry?.source || !entry.record) {
    throw new Error(`找不到可审核的已登记译文：${sourceUrl}`);
  }
  if (entry.state !== "current" && entry.state !== "modified-target") {
    throw new Error(`页面状态 ${entry.state} 不允许登记人工审核：${sourceUrl}`);
  }
  if (
    entry.record.sourceSha256 !== entry.source.sha256 ||
    entry.record.policySha256 !== fresh.policySha256
  ) {
    throw new Error(`英文来源或翻译策略已变化，拒绝登记人工审核：${sourceUrl}`);
  }
  const target = await readTranslationWorkspaceFile(
    fresh,
    entry.targetPath,
    "待审核中文译文",
  );
  const source = await readTranslationWorkspaceFile(
    fresh,
    entry.source.sourcePath,
    "待审核英文来源",
  );
  const [preparedSource, preparedTarget] = await Promise.all([
    markdownDocumentAdapter.prepare({
      content: source,
      id: entry.source.sourceUrl,
      sourceHash: entry.source.sha256,
    }),
    markdownDocumentAdapter.prepare({
      content: target,
      id: entry.targetPath,
    }),
  ]);
  if (
    preparedSource.formatState.structureSignature !==
    preparedTarget.formatState.structureSignature
  ) {
    throw new Error(`人工译文改变了 Markdown 受保护结构，拒绝登记审核：${sourceUrl}`);
  }
  const targetSha256 = sha256(target);
  const record: TranslationPageRecord = {
    ...entry.record,
    reviewStatus: "reviewed",
    targetSha256,
  };
  const manifest = stableManifest(
    fresh.translationManifest,
    record,
    now().toISOString(),
  );
  await atomicWriteRepositoryFile(
    fresh.repositoryRoot,
    fresh.config.translationManifestPath,
    JSON.stringify(manifest, null, 2) + "\n",
    "中文 translation manifest",
  );
  return {
    reviewStatus: "reviewed",
    sourceUrl,
    targetPath: entry.targetPath,
    targetSha256,
  };
}

export async function runTranslationPage(
  workspace: TranslationWorkspaceSnapshot,
  sourceUrl: string,
  options: TranslationPageRunOptions,
): Promise<TranslationPageRunResult> {
  const entry = workspace.entries.find(
    (candidate) => candidate.source?.sourceUrl === sourceUrl,
  );
  if (!entry?.source) throw new Error(`找不到可翻译英文页面：${sourceUrl}`);
  if (!TRANSLATABLE_STATES.has(entry.state)) {
    throw new Error(`页面状态 ${entry.state} 不允许自动翻译：${sourceUrl}`);
  }
  const source = await readTranslationWorkspaceFile(
    workspace,
    entry.source.sourcePath,
    "英文页面",
  );
  if (sha256(source) !== entry.source.sha256) {
    throw new Error(`英文页面 SHA 在执行前发生变化：${entry.source.sourcePath}`);
  }
  const prepared = await markdownDocumentAdapter.prepare({
    content: source,
    id: entry.source.sourceUrl,
    sourceHash: entry.source.sha256,
  });
  const path = checkpointPath(entry.source.sourceUrl, workspace.policySha256);
  const useCheckpoint = options.useCheckpoint ?? true;
  const instructions = instructionsForWorkspace(workspace);
  const result = await translatePlan(prepared.plan, {
    batchSize: options.batchSize ?? 20,
    checkpoint: useCheckpoint
      ? await readOptionalCheckpoint(workspace, path)
      : undefined,
    concurrency: options.concurrency ?? 1,
    instructions,
    maxBatchCharacters: options.maxBatchCharacters ?? 4_000,
    onCheckpoint: useCheckpoint
      ? async (checkpoint) =>
          atomicWriteRepositoryFile(
            workspace.repositoryRoot,
            path,
            JSON.stringify(checkpoint, null, 2) + "\n",
            "Checkpoint",
          )
      : undefined,
    provider: options.provider,
    qualityPolicy: createTranslationQualityPolicy(workspace.glossary),
    retry: options.retry ?? 2,
    sourceLanguage: "en",
    targetLanguage: workspace.targetLanguage,
  });
  const rendered = await markdownDocumentAdapter.render(
    prepared.formatState,
    result,
  );
  const translatedAt = (options.now ?? (() => new Date()))().toISOString();
  const record: TranslationPageRecord = {
    policySha256: workspace.policySha256,
    reviewStatus: "machine",
    sourcePath: entry.source.sourcePath,
    sourceSha256: entry.source.sha256,
    sourceUrl: entry.source.sourceUrl,
    targetPath: entry.targetPath,
    targetSha256: sha256(rendered),
    translatedAt,
  };
  const commit = options.commit ?? false;
  if (commit) await commitTranslationPage(workspace, record, rendered);
  return {
    checkpointPath: path,
    committed: commit,
    record,
    rendered,
    result,
    sourceUrl: entry.source.sourceUrl,
    targetPath: entry.targetPath,
  };
}
