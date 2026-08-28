import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { loadTranslationWorkspace } from "../../../scripts/translation/planner.ts";

interface SourcePageRecord {
  bytes: number;
  description: string;
  localPath: string;
  section: "guides" | "reference";
  sourceUrl: string;
  sourceUpdatedAt: string;
  status: "active" | "removed";
  title: string;
}

interface SourceManifest {
  generatedAt: string;
  pages: Record<string, SourcePageRecord>;
}

interface TranslationPageRecord {
  reviewStatus: "machine" | "reviewed";
  sourcePath: string;
  sourceUrl: string;
  targetPath: string;
  translatedAt: string;
}

interface TranslationManifest {
  generatedAt: string;
  pages: Record<string, TranslationPageRecord>;
}

interface NavigationEntry {
  description: string;
  route: string;
  sourceUrl: string;
  title: string;
  translationState: TranslationContentState;
}

interface NavigationGroup {
  entries: NavigationEntry[];
  externalEntries: Array<{
    description: string;
    sourceUrl: string;
    title: string;
  }>;
  title: string;
}

interface ContentRecord {
  bytes: number;
  contentPath: string;
  description: string;
  locale: "en" | "zh";
  reviewStatus: "machine" | "reviewed" | "source";
  route: string;
  section: "guides" | "reference";
  sourceUrl: string;
  sourceUpdatedAt: string;
  title: string;
  translatedAt?: string;
  translationState?: TranslationContentState;
}

type TranslationContentState =
  | "current"
  | "pending"
  | "stale-policy"
  | "stale-source";

interface SyncReleaseEntry {
  path: string;
  route: string;
  sourceUrl: string;
  title: string;
}

interface SyncReleaseRecord {
  added: SyncReleaseEntry[];
  generatedAt: string;
  id: string;
  modified: SyncReleaseEntry[];
  removed: SyncReleaseEntry[];
}

interface TranslationStatusSummary {
  current: number;
  pending: number;
  removedSource: number;
  stale: number;
  stalePolicy: number;
  staleSource: number;
  totalActive: number;
}

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function safeRepositoryPath(relativePath: string): string {
  const absolutePath = resolve(repositoryRoot, relativePath);
  if (!absolutePath.startsWith(repositoryRoot + sep)) {
    throw new Error(`文档路径越界：${relativePath}`);
  }
  return absolutePath;
}

function routeFromSourceUrl(sourceUrl: string): string {
  const source = new URL(sourceUrl);
  if (source.hostname !== "developers.openai.com") {
    throw new Error(`不支持的文档来源：${sourceUrl}`);
  }
  return source.pathname.replace(/\.md$/u, "").replace(/\/$/u, "");
}

function firstHeading(markdown: string, fallback: string): string {
  return markdown.match(/^#\s+(.+)$/mu)?.[1]?.trim() || fallback;
}

function beijingScheduleFromWorkflow(workflow: string): string {
  const cron = /^\s*- cron:\s*["']?(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+\*["']?\s*$/mu.exec(
    workflow,
  );
  if (!cron?.[1] || !cron[2]) {
    throw new Error("无法从同步工作流读取每日检查计划");
  }
  const minute = Number(cron[1]);
  const utcHour = Number(cron[2]);
  if (minute > 59 || utcHour > 23) {
    throw new Error(`同步工作流 cron 无效：${cron[0].trim()}`);
  }
  const beijingHour = (utcHour + 8) % 24;
  return `每天 ${String(beijingHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} · 北京时间`;
}

function navigationGroups(
  index: string,
  catalogByRoute: Map<string, NavigationEntry>,
): NavigationGroup[] {
  const groups: NavigationGroup[] = [];
  let current: NavigationGroup | undefined;

  for (const rawLine of index.split(/\r?\n/u)) {
    const heading = /^##\s+(.+)$/u.exec(rawLine);
    if (heading?.[1]) {
      current = { title: heading[1].trim(), entries: [], externalEntries: [] };
      groups.push(current);
      continue;
    }

    const entry = /^- \[([^\]]+)\]\((https:\/\/developers\.openai\.com\/[^)]+)\)(?::\s*(.+))?$/u.exec(
      rawLine,
    );
    if (!entry?.[1] || !entry[2] || !current) continue;
    const route = routeFromSourceUrl(entry[2]);
    const catalogEntry = catalogByRoute.get(route);
    if (!catalogEntry) {
      current.externalEntries.push({
        title: entry[1].trim(),
        description: entry[3]?.trim() || "",
        sourceUrl: entry[2],
      });
      continue;
    }
    current.entries.push({
      ...catalogEntry,
      title: entry[1].trim(),
      description: entry[3]?.trim() || catalogEntry.description,
    });
  }

  return groups.filter(
    (group) => group.entries.length > 0 || group.externalEntries.length > 0,
  );
}

async function main(): Promise<void> {
  const updatesRoot = resolve(repositoryRoot, "docs/updates");
  const [sourceManifest, translationManifest, translationWorkspace, docsIndex, referenceIndex, syncWorkflow, updateFiles] = await Promise.all([
    readFile(resolve(repositoryRoot, "docs/en/.source-manifest.json"), "utf8").then(
      (value) => JSON.parse(value) as SourceManifest,
    ),
    readFile(resolve(repositoryRoot, "docs/zh/.translation-manifest.json"), "utf8").then(
      (value) => JSON.parse(value) as TranslationManifest,
    ),
    loadTranslationWorkspace(
      repositoryRoot,
      "scripts/translation.config.json",
      { NODE_ENV: process.env.NODE_ENV ?? "production" },
    ),
    readFile(resolve(repositoryRoot, "docs/en/api/docs/llms.txt"), "utf8"),
    readFile(resolve(repositoryRoot, "docs/en/api/reference/llms.txt"), "utf8"),
    readFile(resolve(repositoryRoot, ".github/workflows/sync-docs.yml"), "utf8"),
    readdir(updatesRoot).catch((error: unknown) => {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }),
  ]);

  const translationStateCounts = new Map<string, number>();
  for (const entry of translationWorkspace.entries) {
    translationStateCounts.set(
      entry.state,
      (translationStateCounts.get(entry.state) ?? 0) + 1,
    );
  }
  const unsafeTranslationStates = [
    "missing-target",
    "modified-target",
    "untracked-target",
  ] as const;
  const unsafeTranslationPages = unsafeTranslationStates.reduce(
    (total, state) => total + (translationStateCounts.get(state) ?? 0),
    0,
  );
  if (unsafeTranslationPages > 0) {
    throw new Error(
      `中文翻译状态存在 ${unsafeTranslationPages} 个完整性问题，拒绝生成首页统计。`,
    );
  }
  const staleSource = translationStateCounts.get("stale-source") ?? 0;
  const stalePolicy = translationStateCounts.get("stale-policy") ?? 0;
  const translationStatus: TranslationStatusSummary = {
    current: translationStateCounts.get("current") ?? 0,
    pending: translationStateCounts.get("pending") ?? 0,
    removedSource: translationStateCounts.get("removed-source") ?? 0,
    stale: staleSource + stalePolicy,
    stalePolicy,
    staleSource,
    totalActive: translationWorkspace.entries.length -
      (translationStateCounts.get("removed-source") ?? 0),
  };
  if (
    translationStatus.current +
      translationStatus.pending +
      translationStatus.stale !==
    translationStatus.totalActive
  ) {
    throw new Error("首页翻译状态未覆盖全部有效英文页面。");
  }

  const translationStateBySourceUrl = new Map<string, TranslationContentState>();
  for (const entry of translationWorkspace.entries) {
    if (!entry.source || entry.source.status !== "active") continue;
    if (
      entry.state !== "current" &&
      entry.state !== "pending" &&
      entry.state !== "stale-policy" &&
      entry.state !== "stale-source"
    ) {
      throw new Error(`英文页面存在无法展示的翻译状态：${entry.source.sourceUrl}`);
    }
    translationStateBySourceUrl.set(entry.source.sourceUrl, entry.state);
  }

  const syncReleases = await Promise.all(
    updateFiles
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => readFile(resolve(updatesRoot, fileName), "utf8").then(
        (value) => JSON.parse(value) as SyncReleaseRecord,
      )),
  );
  syncReleases.sort((left, right) => right.generatedAt.localeCompare(left.generatedAt));

  const catalog = Object.values(sourceManifest.pages)
    .filter((page) => page.status === "active")
    .map((page) => ({
      route: routeFromSourceUrl(page.sourceUrl),
      title: page.title,
      description: page.description,
      section: page.section,
      sourceUrl: page.sourceUrl,
      sourceUpdatedAt: page.sourceUpdatedAt,
      contentPath: page.localPath,
      bytes: page.bytes,
      translationState: translationStateBySourceUrl.get(page.sourceUrl) ?? "pending",
    }))
    .sort((left, right) => left.route.localeCompare(right.route));

  const catalogByRoute = new Map(
    catalog.map((entry) => [entry.route, entry] as const),
  );
  const navigationSections = [
    {
      key: "guides",
      route: "/api/docs",
      title: "Documentation",
      description: "Guides and conceptual documentation for building with the OpenAI API.",
      groups: navigationGroups(docsIndex, catalogByRoute),
    },
    {
      key: "reference",
      route: "/api/reference",
      title: "API reference",
      description: "Endpoint and resource reference for the OpenAI API.",
      groups: navigationGroups(referenceIndex, catalogByRoute),
    },
  ] as const;

  const structuredRouteCount = navigationSections.reduce(
    (sectionTotal, section) => sectionTotal + section.groups.reduce(
      (groupTotal, group) => groupTotal + group.entries.length,
      0,
    ),
    0,
  );
  if (structuredRouteCount !== catalog.length) {
    const structuredRoutes = new Set(
      navigationSections.flatMap((section) =>
        section.groups.flatMap((group) => group.entries.map((entry) => entry.route)),
      ),
    );
    const missingRoutes = catalog
      .filter((entry) => !structuredRoutes.has(entry.route))
      .map((entry) => entry.route);
    throw new Error(
      `官网导航未覆盖全部有效页面：${structuredRouteCount}/${catalog.length}。缺少：${missingRoutes.join(", ")}`,
    );
  }

  const documents: ContentRecord[] = catalog.map((page) => ({
    locale: "en",
    route: page.route,
    title: page.title,
    description: page.description,
    contentPath: page.contentPath,
    bytes: page.bytes,
    section: page.section,
    sourceUrl: page.sourceUrl,
    sourceUpdatedAt: page.sourceUpdatedAt,
    reviewStatus: "source",
  }));
  for (const page of Object.values(translationManifest.pages)) {
    const catalogPage = sourceManifest.pages[page.sourceUrl];
    if (!catalogPage || catalogPage.status !== "active") continue;
    const route = routeFromSourceUrl(page.sourceUrl);
    const chinese = await readFile(safeRepositoryPath(page.targetPath), "utf8");
    documents.push({
      locale: "zh",
      route,
      title: firstHeading(chinese, catalogPage.title),
      // Chinese page metadata must come from an explicitly translated field.
      // Never infer it from article body text, which would duplicate and reorder content.
      description: "",
      contentPath: page.targetPath,
      bytes: Buffer.byteLength(chinese, "utf8"),
      section: catalogPage.section,
      sourceUrl: page.sourceUrl,
      sourceUpdatedAt: catalogPage.sourceUpdatedAt,
      translatedAt: page.translatedAt,
      translationState: translationStateBySourceUrl.get(page.sourceUrl) ?? "pending",
      reviewStatus: page.reviewStatus,
    });
  }
  documents.sort((left, right) =>
    `${left.route}:${left.locale}`.localeCompare(`${right.route}:${right.locale}`),
  );

  const output =
    "// Generated by scripts/generate-content.ts. Do not edit manually.\n\n" +
    `export const sourceGeneratedAt = ${JSON.stringify(sourceManifest.generatedAt)};\n` +
    `export const translationGeneratedAt = ${JSON.stringify(translationManifest.generatedAt)};\n` +
    `export const sourceCheckSchedule = ${JSON.stringify(beijingScheduleFromWorkflow(syncWorkflow))};\n` +
    `export const translationStatus = ${JSON.stringify(translationStatus, null, 2)} as const;\n` +
    `export const syncReleases = ${JSON.stringify(syncReleases, null, 2)} as const;\n` +
    `export const documentCatalog = ${JSON.stringify(catalog, null, 2)} as const;\n` +
    `export const navigationSections = ${JSON.stringify(navigationSections, null, 2)} as const;\n` +
    `export const generatedDocuments = ${JSON.stringify(documents, null, 2)} as const;\n`;
  const outputPath = resolve(webRoot, "generated/documents.ts");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");
  console.log(
    `Generated ${documents.length} content records and ${structuredRouteCount} structured routes.`,
  );
}

await main();
