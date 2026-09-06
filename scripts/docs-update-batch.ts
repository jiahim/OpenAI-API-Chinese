import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, posix, relative, resolve, sep } from "node:path";

import type { SyncRelease, SyncReleaseEntry } from "./sync-pr-summary.ts";
import { mirroredTranslationPath } from "./translation/planner.ts";
import type {
  TranslationPageInspection,
  TranslationPageState,
  TranslationWorkspaceSnapshot,
} from "./translation/types.ts";

const RELEASE_KEYS = ["added", "generatedAt", "id", "modified", "removed"];
const RELEASE_ENTRY_KEYS = ["path", "route", "sourceUrl", "title"];
const TRANSLATION_PAGE_STATES = new Set<TranslationPageState>([
  "current",
  "missing-target",
  "modified-target",
  "pending",
  "removed-source",
  "stale-policy",
  "stale-source",
  "untracked-target",
]);

export interface DocsUpdateBatchIssue {
  kind:
    | "required-not-current"
    | "removed-record-present"
    | "removed-target-present";
  sourcePath: string;
  state?: TranslationPageState;
  targetPath: string;
}

export interface DocsUpdateBatchReport {
  complete: boolean;
  issues: DocsUpdateBatchIssue[];
  requiredSourcePaths: string[];
  removedSourcePaths: string[];
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} 必须是对象。`);
  }
  return value as Record<string, unknown>;
}

function assertKnownKeys(
  object: Record<string, unknown>,
  keys: readonly string[],
  label: string,
): void {
  const known = new Set(keys);
  const unexpected = Object.keys(object).filter((key) => !known.has(key));
  if (unexpected.length) {
    throw new Error(`${label} 包含未知字段：${unexpected.sort().join("、")}`);
  }
}

function requiredString(
  object: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = object[key];
  if (typeof value !== "string" || !value.trim() || value !== value.trim()) {
    throw new Error(`${label}.${key} 必须是非空字符串。`);
  }
  return value;
}

function normalizedRepositoryPath(value: string, label: string): string {
  if (
    isAbsolute(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    value.endsWith("/") ||
    posix.normalize(value) !== value ||
    value === "." ||
    value === ".." ||
    value.startsWith("../")
  ) {
    throw new Error(`${label} 必须是仓库内的 POSIX 相对路径：${value}`);
  }
  return value;
}

function docsArticlePath(value: string, label: string): string {
  const path = normalizedRepositoryPath(value, label);
  if (!/^docs\/en\/.+\.md$/u.test(path)) {
    throw new Error(`${label} 必须是 docs/en 下的 Markdown 文章路径：${value}`);
  }
  return path;
}

function officialMarkdownUrl(value: string, label: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} 必须是官方 Markdown sourceUrl：${value}`);
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "developers.openai.com" ||
    url.port ||
    url.username ||
    url.password ||
    !url.pathname.endsWith(".md") ||
    url.search ||
    url.hash ||
    url.href !== value
  ) {
    throw new Error(`${label} 必须是官方 Markdown sourceUrl：${value}`);
  }
  return url;
}

function releaseTimestamp(value: string): { canonical: string; value: string } {
  const canonical = Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : undefined;
  const normalizedInput = !value.includes(".")
    ? value.replace(/Z$/u, ".000Z")
    : value;
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value) ||
    canonical !== normalizedInput
  ) {
    throw new Error(`同步批次.generatedAt 必须是有效 UTC ISO 8601 时间：${value}`);
  }
  return { canonical, value };
}

function parseReleaseEntry(raw: unknown, label: string): SyncReleaseEntry {
  const object = asObject(raw, label);
  assertKnownKeys(object, RELEASE_ENTRY_KEYS, label);
  const path = docsArticlePath(
    requiredString(object, "path", label),
    `${label}.path`,
  );
  const route = requiredString(object, "route", label);
  const sourceUrl = requiredString(object, "sourceUrl", label);
  const source = officialMarkdownUrl(sourceUrl, `${label}.sourceUrl`);
  const expectedRoute = source.pathname
    .replace(/\.md$/u, "")
    .replace(/\/$/u, "");
  if (route !== expectedRoute) {
    throw new Error(`${label}.route 与 sourceUrl 不一致：${route}`);
  }
  return {
    path,
    route,
    sourceUrl,
    title: requiredString(object, "title", label),
  };
}

function parseReleaseEntries(raw: unknown, label: string): SyncReleaseEntry[] {
  if (!Array.isArray(raw)) throw new Error(`${label} 必须是数组。`);
  return raw.map((value, index) => parseReleaseEntry(value, `${label}[${index}]`));
}

function validateDocsUpdateBatch(raw: unknown): SyncRelease {
  const object = asObject(raw, "同步批次");
  assertKnownKeys(object, RELEASE_KEYS, "同步批次");
  const timestamp = releaseTimestamp(
    requiredString(object, "generatedAt", "同步批次"),
  );
  const id = requiredString(object, "id", "同步批次");
  const expectedId = timestamp.canonical.replace(/[.:]/gu, "-");
  if (id !== expectedId) {
    throw new Error(`同步批次.id 与 generatedAt 不一致：${id}`);
  }
  const batch: SyncRelease = {
    added: parseReleaseEntries(object.added, "同步批次.added"),
    generatedAt: timestamp.value,
    id,
    modified: parseReleaseEntries(object.modified, "同步批次.modified"),
    removed: parseReleaseEntries(object.removed, "同步批次.removed"),
  };
  const pathOwners = new Map<string, string>();
  const sourceUrlOwners = new Map<string, string>();
  for (const [section, entries] of [
    ["added", batch.added],
    ["modified", batch.modified],
    ["removed", batch.removed],
  ] as const) {
    for (const entry of entries) {
      const pathOwner = pathOwners.get(entry.path);
      if (pathOwner) {
        throw new Error(
          `同步批次 path 重复：${entry.path}（${pathOwner}、${section}）`,
        );
      }
      pathOwners.set(entry.path, section);
      const sourceUrlOwner = sourceUrlOwners.get(entry.sourceUrl);
      if (sourceUrlOwner) {
        throw new Error(
          `同步批次 sourceUrl 重复：${entry.sourceUrl}（${sourceUrlOwner}、${section}）`,
        );
      }
      sourceUrlOwners.set(entry.sourceUrl, section);
    }
  }
  return batch;
}

export async function loadDocsUpdateBatch(path: string): Promise<SyncRelease> {
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`同步批次不是有效 JSON：${path}`, { cause: error });
    }
    throw error;
  }
  return validateDocsUpdateBatch(raw);
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) =>
    left.localeCompare(right, "en"),
  );
}

export function requiredSourcePaths(batch: SyncRelease): string[] {
  const validated = validateDocsUpdateBatch(batch);
  return sortedUnique([
    ...validated.added.map((entry) => entry.path),
    ...validated.modified.map((entry) => entry.path),
  ]);
}

function removedSourcePaths(batch: SyncRelease): string[] {
  return sortedUnique(batch.removed.map((entry) => entry.path));
}

function defaultTargetPath(sourcePath: string): string {
  return sourcePath.replace(/^docs\/en\//u, "docs/zh/");
}

function inspectionEntriesBySourcePath(
  entries: TranslationPageInspection[],
): Map<string, TranslationPageInspection> {
  if (!Array.isArray(entries)) {
    throw new Error("翻译页面检查结果必须是数组。");
  }
  const bySourcePath = new Map<string, TranslationPageInspection>();
  for (const [index, entry] of entries.entries()) {
    const object = asObject(entry, `翻译页面检查结果[${index}]`);
    if (
      typeof object.state !== "string" ||
      !TRANSLATION_PAGE_STATES.has(object.state as TranslationPageState)
    ) {
      throw new Error(`翻译页面检查结果[${index}].state 无效。`);
    }
    const targetPath = normalizedRepositoryPath(
      requiredString(object, "targetPath", `翻译页面检查结果[${index}]`),
      `翻译页面检查结果[${index}].targetPath`,
    );
    const sourceObject =
      object.source === undefined
        ? undefined
        : asObject(object.source, `翻译页面检查结果[${index}].source`);
    const recordObject =
      object.record === undefined
        ? undefined
        : asObject(object.record, `翻译页面检查结果[${index}].record`);
    const sourcePath = sourceObject
      ? docsArticlePath(
          requiredString(
            sourceObject,
            "sourcePath",
            `翻译页面检查结果[${index}].source`,
          ),
          `翻译页面检查结果[${index}].source.sourcePath`,
        )
      : recordObject
        ? docsArticlePath(
            requiredString(
              recordObject,
              "sourcePath",
              `翻译页面检查结果[${index}].record`,
            ),
            `翻译页面检查结果[${index}].record.sourcePath`,
          )
        : undefined;
    if (!sourcePath) continue;
    if (bySourcePath.has(sourcePath)) {
      throw new Error(`翻译页面检查结果的 sourcePath 重复：${sourcePath}`);
    }
    bySourcePath.set(sourcePath, {
      ...entry,
      state: object.state as TranslationPageState,
      targetPath,
    });
  }
  return bySourcePath;
}

function validatedExistingTargetPaths(
  paths: ReadonlySet<string>,
): ReadonlySet<string> {
  const validated = new Set<string>();
  for (const path of paths) {
    if (typeof path !== "string") {
      throw new Error("已有中文目标路径必须是字符串。");
    }
    validated.add(normalizedRepositoryPath(path, "已有中文目标路径"));
  }
  return validated;
}

export function inspectDocsUpdateBatch(
  batch: SyncRelease,
  entries: TranslationPageInspection[],
  existingTargetPaths?: ReadonlySet<string>,
): DocsUpdateBatchReport {
  const validatedBatch = validateDocsUpdateBatch(batch);
  const bySourcePath = inspectionEntriesBySourcePath(entries);
  const required = requiredSourcePaths(validatedBatch);
  const removed = removedSourcePaths(validatedBatch);
  const targets = validatedExistingTargetPaths(
    existingTargetPaths ?? new Set(entries.map((entry) => entry.targetPath)),
  );
  const issues: DocsUpdateBatchIssue[] = [];
  for (const sourcePath of required) {
    const entry = bySourcePath.get(sourcePath);
    if (entry?.state !== "current") {
      issues.push({
        kind: "required-not-current",
        sourcePath,
        state: entry?.state,
        targetPath: entry?.targetPath ?? defaultTargetPath(sourcePath),
      });
    }
  }
  for (const sourcePath of removed) {
    const entry = bySourcePath.get(sourcePath);
    const targetPath = entry?.targetPath ?? defaultTargetPath(sourcePath);
    if (entry?.record) {
      issues.push({ kind: "removed-record-present", sourcePath, targetPath });
    }
    if (targets.has(targetPath)) {
      issues.push({ kind: "removed-target-present", sourcePath, targetPath });
    }
  }
  return {
    complete: issues.length === 0,
    issues,
    removedSourcePaths: removed,
    requiredSourcePaths: required,
  };
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

export async function inspectDocsUpdateBatchWorkspace(
  batch: SyncRelease,
  workspace: TranslationWorkspaceSnapshot,
): Promise<DocsUpdateBatchReport> {
  const validatedBatch = validateDocsUpdateBatch(batch);
  const bySourcePath = inspectionEntriesBySourcePath(workspace.entries);
  const root = await realpath(resolve(workspace.repositoryRoot));
  const existingTargetPaths = new Set<string>();
  for (const sourcePath of removedSourcePaths(validatedBatch)) {
    const targetPath =
      bySourcePath.get(sourcePath)?.targetPath ??
      mirroredTranslationPath(
        sourcePath,
        workspace.config.sourceRoot,
        workspace.config.targetRoot,
      );
    const target = resolve(
      root,
      normalizedRepositoryPath(targetPath, "待检查中文译文"),
    );
    assertInsideRoot(root, target, "待检查中文译文");
    try {
      const stat = await lstat(target);
      if (stat.isSymbolicLink() || !stat.isFile()) {
        throw new Error(`待检查中文译文不能是符号链接或非文件：${target}`);
      }
      assertInsideRoot(root, await realpath(target), "待检查中文译文");
      existingTargetPaths.add(targetPath);
    } catch (error) {
      if (!isErrno(error, "ENOENT")) throw error;
    }
  }
  return inspectDocsUpdateBatch(
    validatedBatch,
    workspace.entries,
    existingTargetPaths,
  );
}
