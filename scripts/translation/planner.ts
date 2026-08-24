import { createHash } from "node:crypto";
import { lstat, readFile, realpath } from "node:fs/promises";
import { dirname, isAbsolute, posix, relative, resolve, sep } from "node:path";

import type {
  SourcePageSnapshot,
  SourcePageStatus,
  SourceSection,
  TranslationConfig,
  TranslationGlossary,
  TranslationManifest,
  TranslationPageInspection,
  TranslationPageRecord,
  TranslationPageState,
  TranslationReviewStatus,
  TranslationStatusReport,
} from "./types.ts";

const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
export const MARKDOWN_ADAPTER_POLICY_VERSION = "markdown-source-ranges-v1";

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} 必须是对象。`);
  }
  return value as Record<string, unknown>;
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

function optionalIsoTimestamp(
  object: Record<string, unknown>,
  key: string,
  label: string,
): string | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  const canonical =
    typeof value === "string" && Number.isFinite(Date.parse(value))
      ? new Date(value).toISOString()
      : undefined;
  const normalizedInput =
    typeof value === "string" && !value.includes(".")
      ? value.replace(/Z$/u, ".000Z")
      : value;
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value) ||
    canonical !== normalizedInput
  ) {
    throw new Error(`${label}.${key} 必须是 UTC ISO 8601 时间。`);
  }
  return value;
}

function requiredIsoTimestamp(
  object: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = optionalIsoTimestamp(object, key, label);
  if (value === undefined) {
    throw new Error(`${label}.${key} 必须是 UTC ISO 8601 时间。`);
  }
  return value;
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

function requiredSha256(
  object: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = requiredString(object, key, label);
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(`${label}.${key} 必须是 SHA-256。`);
  }
  return value;
}

function repositoryPath(repositoryRoot: string, value: string): string {
  if (isAbsolute(value)) throw new Error(`仓库路径不能是绝对路径：${value}`);
  const absolute = resolve(repositoryRoot, value);
  const fromRoot = relative(repositoryRoot, absolute);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`)) {
    throw new Error(`路径必须位于仓库内：${value}`);
  }
  return absolute;
}

function normalizedRepositoryPath(value: string, label: string): string {
  if (
    !value ||
    isAbsolute(value) ||
    value.includes("\\") ||
    value.includes("\0") ||
    value.endsWith("/")
  ) {
    throw new Error(`${label} 必须是仓库内的 POSIX 相对路径：${value}`);
  }
  const normalized = posix.normalize(value);
  if (
    normalized !== value ||
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`${label} 必须是仓库内的 POSIX 相对路径：${value}`);
  }
  return normalized.replace(/\/$/u, "");
}

function pathInsideRoot(root: string, filePath: string, label: string): string {
  const normalizedRoot = normalizedRepositoryPath(root, `${label} root`);
  const normalizedFile = normalizedRepositoryPath(filePath, label);
  const prefix = normalizedRoot + "/";
  if (!normalizedFile.startsWith(prefix)) {
    throw new Error(`${label} 必须位于 ${normalizedRoot} 内：${filePath}`);
  }
  return normalizedFile.slice(prefix.length);
}

export function mirroredTranslationPath(
  sourcePath: string,
  sourceRoot: string,
  targetRoot: string,
): string {
  const relativePath = pathInsideRoot(sourceRoot, sourcePath, "英文页面路径");
  if (posix.extname(relativePath) !== ".md") {
    throw new Error(`英文页面必须是 Markdown：${sourcePath}`);
  }
  const normalizedTargetRoot = normalizedRepositoryPath(
    targetRoot,
    "中文根目录",
  );
  return posix.join(normalizedTargetRoot, relativePath);
}

function parseConfig(raw: unknown): TranslationConfig {
  const object = asObject(raw, "翻译配置");
  assertKnownKeys(
    object,
    [
      "glossaryPath",
      "promptPath",
      "schemaVersion",
      "sourceManifestPath",
      "sourceRoot",
      "targetLanguage",
      "targetRoot",
      "translationManifestPath",
    ],
    "翻译配置",
  );
  if (object.schemaVersion !== 1) {
    throw new Error("翻译配置.schemaVersion 必须是 1。");
  }
  const config: TranslationConfig = {
    glossaryPath: normalizedRepositoryPath(
      requiredString(object, "glossaryPath", "翻译配置"),
      "翻译配置.glossaryPath",
    ),
    promptPath: normalizedRepositoryPath(
      requiredString(object, "promptPath", "翻译配置"),
      "翻译配置.promptPath",
    ),
    schemaVersion: 1,
    sourceManifestPath: normalizedRepositoryPath(
      requiredString(object, "sourceManifestPath", "翻译配置"),
      "翻译配置.sourceManifestPath",
    ),
    sourceRoot: normalizedRepositoryPath(
      requiredString(object, "sourceRoot", "翻译配置"),
      "翻译配置.sourceRoot",
    ),
    targetLanguage: requiredString(object, "targetLanguage", "翻译配置"),
    targetRoot: normalizedRepositoryPath(
      requiredString(object, "targetRoot", "翻译配置"),
      "翻译配置.targetRoot",
    ),
    translationManifestPath: normalizedRepositoryPath(
      requiredString(object, "translationManifestPath", "翻译配置"),
      "翻译配置.translationManifestPath",
    ),
  };

  pathInsideRoot(
    config.sourceRoot,
    config.sourceManifestPath,
    "英文 source manifest",
  );
  pathInsideRoot(
    config.targetRoot,
    config.translationManifestPath,
    "翻译 manifest",
  );
  if (
    config.sourceRoot === config.targetRoot ||
    config.sourceRoot.startsWith(config.targetRoot + "/") ||
    config.targetRoot.startsWith(config.sourceRoot + "/")
  ) {
    throw new Error("英文根目录和中文根目录不能相同或互相嵌套。");
  }
  return config;
}

function validateGlossary(raw: unknown): TranslationGlossary {
  const glossary = asObject(raw, "中文术语表");
  assertKnownKeys(glossary, ["preserve", "schemaVersion", "terms"], "中文术语表");
  if (glossary.schemaVersion !== 1) {
    throw new Error("中文术语表.schemaVersion 必须是 1。");
  }
  if (
    !Array.isArray(glossary.preserve) ||
    glossary.preserve.some(
      (value) =>
        typeof value !== "string" || !value.trim() || value !== value.trim(),
    )
  ) {
    throw new Error("中文术语表.preserve 必须是非空字符串数组。");
  }
  const terms = asObject(glossary.terms, "中文术语表.terms");
  for (const [source, target] of Object.entries(terms)) {
    if (
      !source.trim() ||
      source !== source.trim() ||
      typeof target !== "string" ||
      !target.trim() ||
      target !== target.trim()
    ) {
      throw new Error("中文术语表.terms 的 key 和 value 必须是非空字符串。");
    }
  }
  const preserve = glossary.preserve as string[];
  if (new Set(preserve).size !== preserve.length) {
    throw new Error("中文术语表.preserve 不能包含重复项。");
  }
  const conflicts = preserve.filter((term) => Object.hasOwn(terms, term));
  if (conflicts.length) {
    throw new Error(`中文术语表的 preserve 与 terms 冲突：${conflicts.sort().join("、")}`);
  }
  return {
    preserve: [...preserve].sort(),
    schemaVersion: 1,
    terms: Object.fromEntries(
      Object.entries(terms)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([source, target]) => [source, target as string]),
    ),
  };
}

function parseSourceManifest(raw: unknown): SourcePageSnapshot[] {
  const manifest = asObject(raw, "英文 source manifest");
  if (manifest.schemaVersion !== 1) {
    throw new Error("英文 source manifest.schemaVersion 必须是 1。");
  }
  const pages = asObject(manifest.pages, "英文 source manifest.pages");
  const snapshots: SourcePageSnapshot[] = [];

  for (const [sourceUrl, rawPage] of Object.entries(pages)) {
    const label = `英文页面 ${sourceUrl}`;
    const page = asObject(rawPage, label);
    if (requiredString(page, "sourceUrl", label) !== sourceUrl) {
      throw new Error(`${label} 的 key 与 sourceUrl 不一致。`);
    }
    const section = requiredString(page, "section", label);
    if (section !== "guides" && section !== "reference") {
      throw new Error(`${label}.section 无效：${section}`);
    }
    const status = requiredString(page, "status", label);
    if (status !== "active" && status !== "removed") {
      throw new Error(`${label}.status 无效：${status}`);
    }
    snapshots.push({
      section: section as SourceSection,
      sha256: requiredSha256(page, "sha256", label),
      sourcePath: requiredString(page, "localPath", label),
      sourceUrl,
      status: status as SourcePageStatus,
    });
  }

  return snapshots.sort((left, right) =>
    left.sourcePath.localeCompare(right.sourcePath, "en"),
  );
}

function parseTranslationRecord(
  raw: unknown,
  sourceUrl: string,
): TranslationPageRecord {
  const label = `中文翻译记录 ${sourceUrl}`;
  const record = asObject(raw, label);
  assertKnownKeys(
    record,
    [
      "policySha256",
      "reviewStatus",
      "sourcePath",
      "sourceSha256",
      "sourceUrl",
      "targetPath",
      "targetSha256",
      "translatedAt",
    ],
    label,
  );
  if (requiredString(record, "sourceUrl", label) !== sourceUrl) {
    throw new Error(`${label} 的 key 与 sourceUrl 不一致。`);
  }
  const reviewStatus = requiredString(record, "reviewStatus", label);
  if (reviewStatus !== "machine" && reviewStatus !== "reviewed") {
    throw new Error(`${label}.reviewStatus 无效：${reviewStatus}`);
  }
  return {
    policySha256: requiredSha256(record, "policySha256", label),
    reviewStatus: reviewStatus as TranslationReviewStatus,
    sourcePath: normalizedRepositoryPath(
      requiredString(record, "sourcePath", label),
      `${label}.sourcePath`,
    ),
    sourceSha256: requiredSha256(record, "sourceSha256", label),
    sourceUrl,
    targetPath: normalizedRepositoryPath(
      requiredString(record, "targetPath", label),
      `${label}.targetPath`,
    ),
    targetSha256: requiredSha256(record, "targetSha256", label),
    translatedAt: requiredIsoTimestamp(record, "translatedAt", label),
  };
}

function emptyTranslationManifest(targetLanguage: string): TranslationManifest {
  return { pages: {}, schemaVersion: 1, targetLanguage };
}

function parseTranslationManifest(
  raw: unknown,
  targetLanguage: string,
): TranslationManifest {
  const manifest = asObject(raw, "中文 translation manifest");
  assertKnownKeys(
    manifest,
    ["generatedAt", "pages", "schemaVersion", "targetLanguage"],
    "中文 translation manifest",
  );
  if (manifest.schemaVersion !== 1) {
    throw new Error("中文 translation manifest.schemaVersion 必须是 1。");
  }
  if (requiredString(manifest, "targetLanguage", "中文 translation manifest") !== targetLanguage) {
    throw new Error(`中文 translation manifest 的目标语言必须是 ${targetLanguage}。`);
  }
  const pages = asObject(manifest.pages, "中文 translation manifest.pages");
  const parsedPages = Object.fromEntries(
      Object.entries(pages).map(([sourceUrl, value]) => [
        sourceUrl,
        parseTranslationRecord(value, sourceUrl),
      ]),
    );
  const targetOwners = new Map<string, string>();
  for (const [sourceUrl, record] of Object.entries(parsedPages)) {
    const owner = targetOwners.get(record.targetPath);
    if (owner) {
      throw new Error(
        `中文 translation manifest 的 targetPath 重复：${record.targetPath}（${owner}、${sourceUrl}）`,
      );
    }
    targetOwners.set(record.targetPath, sourceUrl);
  }
  return {
    generatedAt: optionalIsoTimestamp(
      manifest,
      "generatedAt",
      "中文 translation manifest",
    ),
    pages: parsedPages,
    schemaVersion: 1,
    targetLanguage,
  };
}

function assertPathInsideRepository(
  repositoryRoot: string,
  realFilePath: string,
  label: string,
): void {
  const fromRoot = relative(repositoryRoot, realFilePath);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error(`${label} 的符号链接不能指向仓库外：${realFilePath}`);
  }
}

async function readRepositoryFile(
  repositoryRoot: string,
  filePath: string,
  label: string,
): Promise<string> {
  const realFilePath = await realpath(filePath);
  assertPathInsideRepository(repositoryRoot, realFilePath, label);
  return readFile(realFilePath, "utf8");
}

async function assertMissingPathStaysInsideRepository(
  repositoryRoot: string,
  filePath: string,
  label: string,
): Promise<void> {
  try {
    await lstat(filePath);
    throw new Error(`${label} 是无法解析的符号链接：${filePath}`);
  } catch (error) {
    if (
      !(
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT"
      )
    ) {
      throw error;
    }
  }

  let ancestor = dirname(filePath);
  while (true) {
    try {
      const realAncestor = await realpath(ancestor);
      assertPathInsideRepository(repositoryRoot, realAncestor, label);
      return;
    } catch (error) {
      if (
        !(
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "ENOENT"
        )
      ) {
        throw error;
      }
      const parent = dirname(ancestor);
      if (parent === ancestor) throw error;
      ancestor = parent;
    }
  }
}

async function readJson(
  repositoryRoot: string,
  filePath: string,
  label: string,
): Promise<unknown> {
  let content: string;
  try {
    content = await readRepositoryFile(repositoryRoot, filePath, label);
  } catch (error) {
    throw new Error(`无法读取${label}：${filePath}`, { cause: error });
  }
  try {
    return JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error(`${label}不是有效 JSON：${filePath}`, { cause: error });
  }
}

async function readOptionalTranslationManifest(
  repositoryRoot: string,
  filePath: string,
  targetLanguage: string,
): Promise<TranslationManifest> {
  try {
    return parseTranslationManifest(
      JSON.parse(
        await readRepositoryFile(
          repositoryRoot,
          filePath,
          "中文 translation manifest",
        ),
      ) as unknown,
      targetLanguage,
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      await assertMissingPathStaysInsideRepository(
        repositoryRoot,
        filePath,
        "中文 translation manifest",
      );
      return emptyTranslationManifest(targetLanguage);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`中文 translation manifest 不是有效 JSON：${filePath}`, {
        cause: error,
      });
    }
    throw error;
  }
}

async function fileSha256(
  repositoryRoot: string,
  filePath: string,
  label: string,
): Promise<string | undefined> {
  try {
    return sha256(await readRepositoryFile(repositoryRoot, filePath, label));
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      await assertMissingPathStaysInsideRepository(
        repositoryRoot,
        filePath,
        label,
      );
      return undefined;
    }
    throw error;
  }
}

export function classifyTranslationPage(input: {
  policySha256: string;
  record?: TranslationPageRecord | undefined;
  source: SourcePageSnapshot;
  targetSha256?: string | undefined;
}): TranslationPageState {
  const { policySha256, record, source, targetSha256 } = input;
  if (source.status === "removed") return "removed-source";
  if (!record) return targetSha256 ? "untracked-target" : "pending";
  if (!targetSha256) return "missing-target";
  if (targetSha256 !== record.targetSha256) return "modified-target";
  if (source.sha256 !== record.sourceSha256) return "stale-source";
  if (policySha256 !== record.policySha256) return "stale-policy";
  return "current";
}

export async function buildTranslationStatusReport(
  repositoryRoot: string,
  configPath = "scripts/translation.config.json",
): Promise<TranslationStatusReport> {
  const root = await realpath(resolve(repositoryRoot));
  const config = parseConfig(
    await readJson(root, repositoryPath(root, configPath), "翻译配置"),
  );
  const sourcePages = parseSourceManifest(
    await readJson(
      root,
      repositoryPath(root, config.sourceManifestPath),
      "英文 source manifest",
    ),
  );
  const translationManifest = await readOptionalTranslationManifest(
    root,
    repositoryPath(root, config.translationManifestPath),
    config.targetLanguage,
  );
  const prompt = await readRepositoryFile(
    root,
    repositoryPath(root, config.promptPath),
    "翻译提示词",
  );
  if (!prompt.trim()) throw new Error("翻译提示词不能为空。");
  const glossaryContent = await readRepositoryFile(
    root,
    repositoryPath(root, config.glossaryPath),
    "中文术语表",
  );
  let parsedGlossary: unknown;
  try {
    parsedGlossary = JSON.parse(glossaryContent) as unknown;
  } catch (error) {
    throw new Error("中文术语表不是有效 JSON。", { cause: error });
  }
  const glossary = validateGlossary(parsedGlossary);
  const policySha256 = sha256(
    JSON.stringify({
      adapter: MARKDOWN_ADAPTER_POLICY_VERSION,
      glossary,
      prompt,
      targetLanguage: config.targetLanguage,
    }),
  );

  const sourceByUrl = new Map(sourcePages.map((page) => [page.sourceUrl, page]));
  const sourcePathOwners = new Map<string, string>();
  for (const source of sourcePages) {
    const normalizedSourcePath = pathInsideRoot(
      config.sourceRoot,
      source.sourcePath,
      "英文页面路径",
    );
    const owner = sourcePathOwners.get(normalizedSourcePath);
    if (owner) {
      throw new Error(
        `英文 source manifest 的 localPath 重复：${source.sourcePath}（${owner}、${source.sourceUrl}）`,
      );
    }
    sourcePathOwners.set(normalizedSourcePath, source.sourceUrl);
  }
  for (const record of Object.values(translationManifest.pages)) {
    const expectedTargetPath = mirroredTranslationPath(
      record.sourcePath,
      config.sourceRoot,
      config.targetRoot,
    );
    if (record.targetPath !== expectedTargetPath) {
      throw new Error(`中文翻译记录的 targetPath 不符合镜像规则：${record.sourceUrl}`);
    }
  }
  const entries: TranslationPageInspection[] = [];
  for (const source of sourcePages) {
    const targetPath = mirroredTranslationPath(
      source.sourcePath,
      config.sourceRoot,
      config.targetRoot,
    );
    const record = translationManifest.pages[source.sourceUrl];
    if (record) {
      if (record.sourcePath !== source.sourcePath) {
        throw new Error(`中文翻译记录的 sourcePath 与英文 manifest 不一致：${source.sourceUrl}`);
      }
    }
    if (source.status === "active") {
      const localSourceSha256 = await fileSha256(
        root,
        repositoryPath(root, source.sourcePath),
        "英文页面",
      );
      if (!localSourceSha256) {
        throw new Error(`英文页面文件不存在：${source.sourcePath}`);
      }
      if (localSourceSha256 !== source.sha256) {
        throw new Error(`英文页面文件与 source manifest SHA 不一致：${source.sourcePath}`);
      }
    }
    const targetSha256 = await fileSha256(
      root,
      repositoryPath(root, targetPath),
      "中文页面",
    );
    entries.push({
      record,
      source,
      state: classifyTranslationPage({
        policySha256,
        record,
        source,
        targetSha256,
      }),
      targetPath,
    });
  }

  for (const [sourceUrl, record] of Object.entries(translationManifest.pages)) {
    if (sourceByUrl.has(sourceUrl)) continue;
    entries.push({ record, state: "removed-source", targetPath: record.targetPath });
  }

  return {
    entries: entries.sort((left, right) =>
      left.targetPath.localeCompare(right.targetPath, "en"),
    ),
    policySha256,
    targetLanguage: config.targetLanguage,
  };
}
