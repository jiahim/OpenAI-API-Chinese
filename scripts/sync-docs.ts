#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  FetchCoordinator,
  type FetchPolicy,
  type TextFetchResult,
} from "./fetch-coordinator.ts";

export type Section = "guides" | "reference";
type Command = "bootstrap" | "check" | "status" | "sync";

export interface DocsConfig extends FetchPolicy {
  concurrency: number;
  indexUrls: Record<Section, string>;
  manifestPath: string;
  sourceRoot: string;
}

export interface IndexEntry {
  description: string;
  localPath: string;
  section: Section;
  sourceUrl: string;
  title: string;
}

export interface SourcePageRecord extends IndexEntry {
  bytes: number;
  etag?: string;
  firstSeenAt: string;
  removedAt?: string;
  sha256: string;
  sourceLastModified?: string;
  sourceUpdatedAt: string;
  status: "active" | "removed";
}

interface SourceIndexRecord {
  bytes: number;
  etag?: string;
  localPath: string;
  sha256: string;
  sourceLastModified?: string;
  sourceUpdatedAt: string;
  sourceUrl: string;
}

interface SourceManifest {
  generatedAt?: string;
  indexes: Partial<Record<Section, SourceIndexRecord>>;
  pages: Record<string, SourcePageRecord>;
  schemaVersion: 1;
}

interface CliOptions {
  command: Command;
  configPath: string;
  help: boolean;
  limit?: number;
  matches: string[];
  prune: boolean;
  section: Section | "all";
}

type FetchResult = TextFetchResult;

interface IndexDownload {
  content: string;
  localPath: string;
}

interface PageDownload {
  content: string;
  entry: IndexEntry;
  fetchResult: FetchResult;
  ok: true;
  sha256: string;
}

interface PageDownloadError {
  entry: IndexEntry;
  error: Error;
  ok: false;
}

type DownloadResult = PageDownload | PageDownloadError;
type ChangeKind = "added" | "changed" | "local-missing" | "local-modified" | "unchanged";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CONFIG_PATH = "scripts/docs.config.json";
const INDEX_LINK_PATTERN =
  /^- \[([^\]]+)\]\((https:\/\/developers\.openai\.com\/api\/(?:docs|reference)\/[^)\s]+\.md)\)(?::\s*(.*))?\s*$/gm;

function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function pathInsideRepository(repositoryPath: string): string {
  const absolute = resolve(REPO_ROOT, repositoryPath);
  const fromRoot = relative(REPO_ROOT, absolute);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`)) {
    throw new Error(`路径必须位于仓库内：${repositoryPath}`);
  }
  return absolute;
}

export function mirroredRelativePath(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  if (url.protocol !== "https:" || url.hostname !== "developers.openai.com") {
    throw new Error(`不允许的文档来源：${sourceUrl}`);
  }
  if (
    !url.pathname.startsWith("/api/docs/") &&
    !url.pathname.startsWith("/api/reference/")
  ) {
    throw new Error(`不支持的 OpenAI Docs 路径：${sourceUrl}`);
  }
  if (!url.pathname.endsWith(".md") && !url.pathname.endsWith(".txt")) {
    throw new Error(`文档必须是 Markdown 或索引文本：${sourceUrl}`);
  }
  const relativePath = url.pathname.replace(/^\/+/, "");
  if (relativePath.split("/").some((part) => part === "..")) {
    throw new Error(`文档路径不能包含 ..：${sourceUrl}`);
  }
  return relativePath;
}

export function parseIndex(
  indexContent: string,
  section: Section,
  sourceRoot = "docs/en",
): IndexEntry[] {
  const expectedPrefix = section === "guides" ? "/api/docs/" : "/api/reference/";
  const entries: IndexEntry[] = [];
  const seen = new Set<string>();
  INDEX_LINK_PATTERN.lastIndex = 0;

  for (const match of indexContent.matchAll(INDEX_LINK_PATTERN)) {
    const title = match[1];
    const sourceUrl = match[2];
    if (!title || !sourceUrl || !new URL(sourceUrl).pathname.startsWith(expectedPrefix)) {
      continue;
    }
    if (seen.has(sourceUrl)) {
      continue;
    }
    seen.add(sourceUrl);
    entries.push({
      description: (match[3] ?? "").trim(),
      localPath: `${sourceRoot.replace(/\/+$/, "")}/${mirroredRelativePath(sourceUrl)}`,
      section,
      sourceUrl,
      title: title.trim(),
    });
  }
  return entries;
}

export function selectEntries(
  entries: IndexEntry[],
  matches: string[],
  limit?: number,
): IndexEntry[] {
  const foldedPatterns = matches.map((pattern) => pattern.toLocaleLowerCase());
  const selected = foldedPatterns.length
    ? entries.filter((entry) => {
        const fields = [entry.title, entry.sourceUrl, entry.localPath].map((value) =>
          value.toLocaleLowerCase(),
        );
        return foldedPatterns.some((pattern) => fields.some((field) => field.includes(pattern)));
      })
    : entries;
  return limit === undefined ? selected : selected.slice(0, limit);
}

export function buildPageRecord(
  entry: IndexEntry,
  content: string,
  fetched: Pick<FetchResult, "etag" | "lastModified">,
  previous: SourcePageRecord | undefined,
  observedAt: string,
): SourcePageRecord {
  const contentHash = sha256(content);
  const changed = !previous || previous.sha256 !== contentHash;
  const record: SourcePageRecord = {
    ...entry,
    bytes: Buffer.byteLength(content, "utf8"),
    firstSeenAt: previous?.firstSeenAt ?? observedAt,
    sha256: contentHash,
    sourceUpdatedAt: changed ? observedAt : previous.sourceUpdatedAt,
    status: "active",
  };
  const etag = fetched.etag ?? (changed ? undefined : previous?.etag);
  const sourceLastModified =
    fetched.lastModified ?? (changed ? undefined : previous?.sourceLastModified);
  if (etag) record.etag = etag;
  if (sourceLastModified) record.sourceLastModified = sourceLastModified;
  return record;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

async function loadConfig(configPath: string): Promise<DocsConfig> {
  const absolutePath = pathInsideRepository(configPath);
  const parsed = JSON.parse(await readFile(absolutePath, "utf8")) as Partial<DocsConfig>;
  if (
    !isPositiveInteger(parsed.concurrency) ||
    !isNonNegativeInteger(parsed.maxRetries) ||
    !isNonNegativeInteger(parsed.requestIntervalMinMs) ||
    !isNonNegativeInteger(parsed.requestIntervalMaxMs) ||
    !isPositiveInteger(parsed.requestTimeoutMs) ||
    !isPositiveInteger(parsed.retryBaseDelayMs) ||
    !isNonNegativeInteger(parsed.retryJitterMs) ||
    !isPositiveInteger(parsed.retryMaxDelayMs) ||
    !isPositiveInteger(parsed.vercelMitigationCooldownMs) ||
    typeof parsed.manifestPath !== "string" ||
    typeof parsed.sourceRoot !== "string" ||
    typeof parsed.indexUrls?.guides !== "string" ||
    typeof parsed.indexUrls.reference !== "string"
  ) {
    throw new Error(`配置格式无效：${configPath}`);
  }
  if (
    parsed.requestIntervalMinMs > parsed.requestIntervalMaxMs ||
    parsed.retryBaseDelayMs > parsed.retryMaxDelayMs
  ) {
    throw new Error(`配置等待区间无效：${configPath}`);
  }
  pathInsideRepository(parsed.manifestPath);
  pathInsideRepository(parsed.sourceRoot);
  return parsed as DocsConfig;
}

async function loadManifest(manifestPath: string): Promise<SourceManifest> {
  try {
    const parsed = JSON.parse(
      await readFile(pathInsideRepository(manifestPath), "utf8"),
    ) as SourceManifest;
    if (parsed.schemaVersion !== 1 || !parsed.pages || !parsed.indexes) {
      throw new Error(`不支持的 source manifest：${manifestPath}`);
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { indexes: {}, pages: {}, schemaVersion: 1 };
    }
    throw error;
  }
}

async function readFileOrUndefined(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

async function writeTextIfChanged(filePath: string, content: string): Promise<boolean> {
  const current = await readFileOrUndefined(filePath);
  if (current === content) return false;
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Math.random().toString(16).slice(2)}.tmp`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, filePath);
  return true;
}

export async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      const value = values[index];
      if (value === undefined) continue;
      results[index] = await mapper(value, index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () => worker()),
  );
  return results;
}

function stableManifest(manifest: SourceManifest): SourceManifest {
  const indexes: Partial<Record<Section, SourceIndexRecord>> = {};
  for (const section of ["guides", "reference"] as const) {
    const record = manifest.indexes[section];
    if (record) indexes[section] = record;
  }
  const pages = Object.fromEntries(
    Object.entries(manifest.pages).sort(([left], [right]) => left.localeCompare(right)),
  );
  const stable: SourceManifest = { indexes, pages, schemaVersion: 1 };
  if (manifest.generatedAt) stable.generatedAt = manifest.generatedAt;
  return stable;
}

function serializeManifest(manifest: SourceManifest): string {
  return `${JSON.stringify(stableManifest(manifest), null, 2)}\n`;
}

async function localChangeKind(
  record: SourcePageRecord | undefined,
  contentHash: string,
  localPath: string,
): Promise<ChangeKind> {
  if (!record || record.status === "removed") return "added";
  if (record.sha256 !== contentHash) return "changed";
  const localContent = await readFileOrUndefined(pathInsideRepository(localPath));
  if (localContent === undefined) return "local-missing";
  if (sha256(localContent) !== contentHash) return "local-modified";
  return "unchanged";
}

async function runSyncOrCheck(
  command: "check" | "sync",
  options: CliOptions,
  config: DocsConfig,
): Promise<number> {
  const observedAt = nowIso();
  const fetcher = new FetchCoordinator(config);
  const manifest = await loadManifest(config.manifestPath);
  const nextManifest: SourceManifest = {
    ...manifest,
    indexes: { ...manifest.indexes },
    pages: { ...manifest.pages },
  };
  const sections: Section[] =
    options.section === "all" ? ["guides", "reference"] : [options.section];
  const allEntries: IndexEntry[] = [];
  const indexDownloads: IndexDownload[] = [];
  let detectedChanges = 0;

  for (const section of sections) {
    const sourceUrl = config.indexUrls[section];
    console.log(`读取索引 [${section}] ${sourceUrl}`);
    const fetched = await fetcher.fetchText(sourceUrl);
    const indexHash = sha256(fetched.content);
    const localPath = `${config.sourceRoot.replace(/\/+$/, "")}/${mirroredRelativePath(sourceUrl)}`;
    const previous = manifest.indexes[section];
    const localContent = await readFileOrUndefined(pathInsideRepository(localPath));
    const indexChanged =
      !previous ||
      previous.sha256 !== indexHash ||
      localContent === undefined ||
      sha256(localContent) !== indexHash;
    if (indexChanged) detectedChanges += 1;

    const indexRecord: SourceIndexRecord = {
      bytes: Buffer.byteLength(fetched.content, "utf8"),
      localPath,
      sha256: indexHash,
      sourceUpdatedAt:
        !previous || previous.sha256 !== indexHash
          ? observedAt
          : previous.sourceUpdatedAt,
      sourceUrl,
    };
    const etag = fetched.etag ?? previous?.etag;
    const sourceLastModified = fetched.lastModified ?? previous?.sourceLastModified;
    if (etag) indexRecord.etag = etag;
    if (sourceLastModified) indexRecord.sourceLastModified = sourceLastModified;
    nextManifest.indexes[section] = indexRecord;
    indexDownloads.push({ content: fetched.content, localPath });

    const parsed = parseIndex(fetched.content, section, config.sourceRoot);
    console.log(`发现 ${parsed.length} 个 ${section} 页面`);
    allEntries.push(...parsed);
  }

  const selectedEntries = selectEntries(allEntries, options.matches, options.limit);
  console.log(`${command === "check" ? "检查" : "同步"} ${selectedEntries.length} 个页面`);
  const counters = new Map<ChangeKind, number>();

  const results = await mapConcurrent(
    selectedEntries,
    config.concurrency,
    async (entry): Promise<DownloadResult> => {
      try {
        const fetchResult = await fetcher.fetchText(entry.sourceUrl);
        return {
          content: fetchResult.content,
          entry,
          fetchResult,
          ok: true,
          sha256: sha256(fetchResult.content),
        };
      } catch (error) {
        return {
          entry,
          error: error instanceof Error ? error : new Error(String(error)),
          ok: false,
        };
      }
    },
  );

  let failures = 0;
  for (const result of results) {
    if (!result.ok) {
      failures += 1;
      console.error(`失败 ${result.entry.sourceUrl}: ${result.error.message}`);
      continue;
    }
    const previous = manifest.pages[result.entry.sourceUrl];
    const changeKind = await localChangeKind(
      previous,
      result.sha256,
      result.entry.localPath,
    );
    counters.set(changeKind, (counters.get(changeKind) ?? 0) + 1);
    if (changeKind !== "unchanged") detectedChanges += 1;
    nextManifest.pages[result.entry.sourceUrl] = buildPageRecord(
      result.entry,
      result.content,
      result.fetchResult,
      previous,
      observedAt,
    );
  }

  const pageSummary = [...counters.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([kind, count]) => `${kind}=${count}`)
    .join(" ");
  if (failures > 0) {
    console.log(`${pageSummary || "无页面"} removed=0 failed=${failures}`);
    console.error(
      `${command === "sync" ? "同步" : "检查"}中止：${failures} 个页面最终失败，未写入任何本轮结果。`,
    );
    return 2;
  }

  const fullSectionScan = options.matches.length === 0 && options.limit === undefined;
  let removed = 0;
  const removedPaths: string[] = [];
  if (fullSectionScan) {
    const currentUrls = new Set(allEntries.map((entry) => entry.sourceUrl));
    for (const [sourceUrl, previous] of Object.entries(manifest.pages)) {
      if (
        sections.includes(previous.section) &&
        previous.status === "active" &&
        !currentUrls.has(sourceUrl)
      ) {
        removed += 1;
        detectedChanges += 1;
        nextManifest.pages[sourceUrl] = {
          ...previous,
          removedAt: observedAt,
          status: "removed",
        };
        if (options.prune) removedPaths.push(previous.localPath);
      }
    }
  }

  if (command === "sync") {
    for (const download of indexDownloads) {
      await writeTextIfChanged(
        pathInsideRepository(download.localPath),
        download.content,
      );
    }
    for (const result of results) {
      if (!result.ok) continue;
      await writeTextIfChanged(
        pathInsideRepository(result.entry.localPath),
        result.content,
      );
    }
    for (const removedPath of removedPaths) {
      try {
        await unlink(pathInsideRepository(removedPath));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }

    const previousComparable = serializeManifest({
      ...manifest,
      generatedAt: manifest.generatedAt,
    });
    const candidateWithOldTimestamp: SourceManifest = {
      ...nextManifest,
      generatedAt: manifest.generatedAt,
    };
    if (serializeManifest(candidateWithOldTimestamp) !== previousComparable) {
      nextManifest.generatedAt = observedAt;
    } else {
      nextManifest.generatedAt = manifest.generatedAt;
    }
    await writeTextIfChanged(
      pathInsideRepository(config.manifestPath),
      serializeManifest(nextManifest),
    );
  }

  console.log(`${pageSummary || "无页面"} removed=${removed} failed=${failures}`);

  if (command === "check" && detectedChanges > 0) {
    console.log(`检测到 ${detectedChanges} 项官方或本地变化。`);
    return 1;
  }
  if (command === "check") console.log("英文文档镜像已是最新。");
  return 0;
}

async function runBootstrap(options: CliOptions, config: DocsConfig): Promise<number> {
  const observedAt = nowIso();
  const manifest = await loadManifest(config.manifestPath);
  const nextManifest: SourceManifest = {
    ...manifest,
    indexes: { ...manifest.indexes },
    pages: { ...manifest.pages },
  };
  const sections: Section[] =
    options.section === "all" ? ["guides", "reference"] : [options.section];
  const allEntries: IndexEntry[] = [];

  for (const section of sections) {
    const sourceUrl = config.indexUrls[section];
    const localPath = `${config.sourceRoot.replace(/\/+$/, "")}/${mirroredRelativePath(sourceUrl)}`;
    const content = await readFile(pathInsideRepository(localPath), "utf8");
    const contentHash = sha256(content);
    const previous = manifest.indexes[section];
    nextManifest.indexes[section] = {
      bytes: Buffer.byteLength(content, "utf8"),
      localPath,
      sha256: contentHash,
      sourceUpdatedAt:
        !previous || previous.sha256 !== contentHash
          ? observedAt
          : previous.sourceUpdatedAt,
      sourceUrl,
    };
    const parsed = parseIndex(content, section, config.sourceRoot);
    console.log(`从本地索引发现 ${parsed.length} 个 ${section} 页面`);
    allEntries.push(...parsed);
  }

  const selectedEntries = selectEntries(allEntries, options.matches, options.limit);
  let missing = 0;
  for (const entry of selectedEntries) {
    const content = await readFileOrUndefined(pathInsideRepository(entry.localPath));
    if (content === undefined) {
      missing += 1;
      console.error(`缺少本地文件 ${entry.localPath}`);
      continue;
    }
    nextManifest.pages[entry.sourceUrl] = buildPageRecord(
      entry,
      content,
      {},
      manifest.pages[entry.sourceUrl],
      observedAt,
    );
  }

  if (missing > 0) {
    console.error(`初始化中止：缺少 ${missing} 个索引页面。`);
    return 2;
  }

  const fullSectionScan = options.matches.length === 0 && options.limit === undefined;
  if (fullSectionScan) {
    const currentUrls = new Set(allEntries.map((entry) => entry.sourceUrl));
    for (const [sourceUrl, previous] of Object.entries(manifest.pages)) {
      if (
        sections.includes(previous.section) &&
        previous.status === "active" &&
        !currentUrls.has(sourceUrl)
      ) {
        nextManifest.pages[sourceUrl] = {
          ...previous,
          removedAt: observedAt,
          status: "removed",
        };
      }
    }
  }

  const previousComparable = serializeManifest({
    ...manifest,
    generatedAt: manifest.generatedAt,
  });
  const candidateWithOldTimestamp: SourceManifest = {
    ...nextManifest,
    generatedAt: manifest.generatedAt,
  };
  nextManifest.generatedAt =
    serializeManifest(candidateWithOldTimestamp) === previousComparable
      ? manifest.generatedAt
      : observedAt;
  await writeTextIfChanged(
    pathInsideRepository(config.manifestPath),
    serializeManifest(nextManifest),
  );
  console.log(`已从本地英文镜像初始化 ${selectedEntries.length} 个页面。`);
  return 0;
}

async function printStatus(config: DocsConfig): Promise<number> {
  const manifest = await loadManifest(config.manifestPath);
  const records = Object.values(manifest.pages);
  const active = records.filter((record) => record.status === "active");
  const removed = records.length - active.length;
  const guides = active.filter((record) => record.section === "guides").length;
  const reference = active.filter((record) => record.section === "reference").length;
  const bytes = active.reduce((sum, record) => sum + record.bytes, 0);
  console.log(`有效页面：${active.length}（guides=${guides}, reference=${reference}）`);
  console.log(`已移除记录：${removed}`);
  console.log(`英文 Markdown：${(bytes / 1024 / 1024).toFixed(1)} MiB`);
  console.log(`manifest 更新：${manifest.generatedAt ?? "尚未同步"}`);
  return 0;
}

function parsePositiveInteger(raw: string | undefined, flag: string): number {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} 必须是正整数`);
  }
  return parsed;
}

function parseCli(argv: string[]): CliOptions {
  const command = argv[0];
  if (
    command !== "bootstrap" &&
    command !== "check" &&
    command !== "status" &&
    command !== "sync"
  ) {
    return {
      command: "status",
      configPath: DEFAULT_CONFIG_PATH,
      help: true,
      matches: [],
      prune: false,
      section: "all",
    };
  }
  const options: CliOptions = {
    command,
    configPath: DEFAULT_CONFIG_PATH,
    help: false,
    matches: [],
    prune: false,
    section: "all",
  };
  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--prune") {
      options.prune = true;
    } else if (argument === "--config") {
      const value = argv[++index];
      if (!value) throw new Error("--config 缺少路径");
      options.configPath = value;
    } else if (argument === "--limit") {
      options.limit = parsePositiveInteger(argv[++index], "--limit");
    } else if (argument === "--match") {
      const value = argv[++index];
      if (!value) throw new Error("--match 缺少内容");
      options.matches.push(value);
    } else if (argument === "--section") {
      const value = argv[++index];
      if (value !== "all" && value !== "guides" && value !== "reference") {
        throw new Error("--section 必须是 all、guides 或 reference");
      }
      options.section = value;
    } else {
      throw new Error(`未知参数：${argument}`);
    }
  }
  if (options.command !== "sync" && options.prune) {
    throw new Error("--prune 只能与 sync 一起使用");
  }
  return options;
}

function printHelp(): void {
  console.log(`用法：node scripts/sync-docs.ts <command> [options]

命令：
  bootstrap  从现有 docs/en 镜像离线初始化 source manifest
  sync       同步官方 Markdown 到 docs/en 并更新 source manifest
  check      只检查官方或本地变化，不写文件；有变化时退出码为 1
  status     离线显示 manifest 摘要

选项：
  --section all|guides|reference
  --match TEXT       按标题、URL 或本地路径筛选，可重复
  --limit N          最多处理 N 页
  --prune            sync 时删除已从官方完整索引移除的本地页面
  --config PATH      配置路径，默认 scripts/docs.config.json
`);
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const options = parseCli(argv);
  if (options.help) {
    printHelp();
    return 0;
  }
  const config = await loadConfig(options.configPath);
  if (options.command === "status") return printStatus(config);
  if (options.command === "bootstrap") return runBootstrap(options, config);
  return runSyncOrCheck(options.command, options, config);
}

const entryPoint = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : undefined;
if (entryPoint === import.meta.url) {
  main().then(
    (exitCode) => {
      process.exitCode = exitCode;
    },
    (error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 2;
    },
  );
}
