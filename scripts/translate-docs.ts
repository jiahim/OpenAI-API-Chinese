#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createEchoProvider } from "@easy-translate/core";

import {
  loadTranslationWorkspace,
  readTranslationWorkspaceFile,
} from "./translation/planner.ts";
import {
  reviewTranslationPage,
  runTranslationPage,
} from "./translation/runner.ts";
import { createConfiguredProvider } from "./translation/provider.ts";
import { loadTranslationPriorityConfig } from "./translation/priority.ts";
import type { MarkdownTranslationContext } from "./translation/markdown-adapter.ts";
import type {
  SourceSection,
  TranslationPageInspection,
  TranslationPageState,
  TranslationWorkspaceSnapshot,
} from "./translation/types.ts";

type Command =
  | "auto"
  | "check"
  | "plan"
  | "review"
  | "run"
  | "simulate"
  | "status";

interface CliOptions {
  command: Command;
  commit: boolean;
  configPath: string;
  limit?: number | undefined;
  matches: string[];
  section: SourceSection | "all";
}

type SourcedTranslationPageInspection = TranslationPageInspection & {
  source: NonNullable<TranslationPageInspection["source"]>;
};

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CONFIG_PATH = "scripts/translation.config.json";
const AUTO_MAX_SOURCE_CHARACTERS = 20_000;
const AUTO_PAGE_LIMIT = 10;
const TRANSLATABLE_STATES = new Set<TranslationPageState>([
  "missing-target",
  "pending",
  "stale-policy",
  "stale-source",
]);
const BLOCKED_STATES = new Set<TranslationPageState>([
  "modified-target",
  "untracked-target",
]);

function parsePositiveInteger(value: string | undefined, option: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${option} 必须是正整数。`);
  }
  return parsed;
}

export function parseCliOptions(argv: string[]): CliOptions {
  const command = argv[0];
  if (
    command !== "auto" &&
    command !== "check" &&
    command !== "plan" &&
    command !== "review" &&
    command !== "run" &&
    command !== "simulate" &&
    command !== "status"
  ) {
    throw new Error("命令必须是 auto、check、plan、review、run、simulate 或 status。");
  }

  const options: CliOptions = {
    command,
    commit: false,
    configPath: DEFAULT_CONFIG_PATH,
    matches: [],
    section: "all",
  };
  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") {
      continue;
    } else if (argument === "--commit") {
      options.commit = true;
    } else if (argument === "--config") {
      const value = argv[++index];
      if (!value) throw new Error("--config 缺少路径。");
      options.configPath = value;
    } else if (argument === "--limit") {
      options.limit = parsePositiveInteger(argv[++index], "--limit");
    } else if (argument === "--match") {
      const value = argv[++index];
      if (!value?.trim()) throw new Error("--match 缺少关键词。");
      options.matches.push(value.toLowerCase());
    } else if (argument === "--section") {
      const value = argv[++index];
      if (value !== "all" && value !== "guides" && value !== "reference") {
        throw new Error("--section 必须是 all、guides 或 reference。");
      }
      options.section = value;
    } else {
      throw new Error(`未知参数：${argument}`);
    }
  }
  if (
    (options.command === "check" || options.command === "status") &&
    (options.limit !== undefined ||
      options.matches.length > 0 ||
      options.section !== "all" ||
      options.commit)
  ) {
    throw new Error(
      `--limit、--match、--section 和 --commit 不适用于 ${options.command} 命令。`,
    );
  }
  if (options.commit && options.command !== "run") {
    throw new Error("--commit 仅适用于 run 命令。");
  }
  if (
    (options.command === "review" ||
      options.command === "simulate" ||
      options.command === "run") &&
    (options.limit !== 1 || options.matches.length === 0)
  ) {
    throw new Error(`${options.command} 必须同时提供 --match 和 --limit 1。`);
  }
  if (
    options.command === "auto" &&
    (options.limit !== AUTO_PAGE_LIMIT ||
      options.matches.length > 0 ||
      options.commit)
  ) {
    throw new Error(
      `auto 必须提供 --limit ${AUTO_PAGE_LIMIT}，且不允许 --match 或 --commit。`,
    );
  }
  return options;
}

function countStates(entries: TranslationPageInspection[]): Map<TranslationPageState, number> {
  const counts = new Map<TranslationPageState, number>();
  for (const entry of entries) {
    counts.set(entry.state, (counts.get(entry.state) ?? 0) + 1);
  }
  return counts;
}

function printStatus(entries: TranslationPageInspection[], policySha256: string): void {
  const counts = countStates(entries);
  console.log(`翻译页面：${entries.length}`);
  for (const state of [
    "current",
    "pending",
    "stale-source",
    "stale-policy",
    "missing-target",
    "untracked-target",
    "modified-target",
    "removed-source",
  ] satisfies TranslationPageState[]) {
    console.log(`${state}=${counts.get(state) ?? 0}`);
  }
  console.log(`policy=${policySha256}`);
}

export function assertTranslationIntegrity(
  entries: TranslationPageInspection[],
): void {
  const unsafe = entries.filter((entry) =>
    new Set<TranslationPageState>([
      "missing-target",
      "modified-target",
      "untracked-target",
    ]).has(entry.state),
  );
  if (unsafe.length) {
    throw new Error(
      `中文翻译完整性检查失败：${unsafe
        .map((entry) => `${entry.state}:${entry.targetPath}`)
        .join("、")}`,
    );
  }
}

const AUTO_STATE_PRIORITY: Readonly<Record<TranslationPageState, number>> = {
  "stale-source": 0,
  "stale-policy": 1,
  "missing-target": 2,
  pending: 3,
  current: 4,
  "modified-target": 4,
  "removed-source": 4,
  "untracked-target": 4,
};

export function automaticTranslationCandidates(
  entries: TranslationPageInspection[],
  section: SourceSection | "all" = "all",
  prioritySourcePaths: readonly string[] = [],
): TranslationPageInspection[] {
  return entries
    .filter(
      (entry) =>
        TRANSLATABLE_STATES.has(entry.state) &&
        (section === "all" || entry.source?.section === section),
    )
    .sort(translationCandidateComparator(prioritySourcePaths));
}

function translationCandidateComparator(
  prioritySourcePaths: readonly string[],
): (
  left: TranslationPageInspection,
  right: TranslationPageInspection,
) => number {
  const sourcePriority = new Map(
    prioritySourcePaths.map((sourcePath, index) => [sourcePath, index]),
  );
  return (left, right) =>
    AUTO_STATE_PRIORITY[left.state] - AUTO_STATE_PRIORITY[right.state] ||
    (sourcePriority.get(left.source?.sourcePath ?? "") ??
      Number.MAX_SAFE_INTEGER) -
      (sourcePriority.get(right.source?.sourcePath ?? "") ??
        Number.MAX_SAFE_INTEGER) ||
    left.targetPath.localeCompare(right.targetPath, "en");
}

function selectedEntries(
  entries: TranslationPageInspection[],
  options: CliOptions,
  prioritySourcePaths: readonly string[] = [],
): TranslationPageInspection[] {
  const selected = matchingEntries(entries, options)
    .filter(
      (entry) =>
        TRANSLATABLE_STATES.has(entry.state) || BLOCKED_STATES.has(entry.state),
    )
    .sort(translationCandidateComparator(prioritySourcePaths));
  return options.limit === undefined ? selected : selected.slice(0, options.limit);
}

function matchingEntries(
  entries: TranslationPageInspection[],
  options: CliOptions,
): TranslationPageInspection[] {
  const selected = entries.filter((entry) => {
    if (
      options.section !== "all" &&
      entry.source?.section !== options.section
    ) {
      return false;
    }
    if (!options.matches.length) return true;
    const haystack = [
      entry.source?.sourceUrl,
      entry.source?.sourcePath,
      entry.targetPath,
    ]
      .filter((value): value is string => Boolean(value))
      .join("\n")
      .toLowerCase();
    return options.matches.every((match) => haystack.includes(match));
  });
  return selected;
}

function printPlan(entries: TranslationPageInspection[]): void {
  let translatable = 0;
  let blocked = 0;
  for (const entry of entries) {
    const disposition = TRANSLATABLE_STATES.has(entry.state) ? "translate" : "blocked";
    if (disposition === "translate") translatable += 1;
    else blocked += 1;
    console.log(
      `${disposition}\t${entry.state}\t${entry.source?.sourcePath ?? "-"}\t${entry.targetPath}`,
    );
  }
  console.log(`计划：可翻译=${translatable} 阻塞=${blocked} 总计=${entries.length}`);
}

function simulateProvider(workspace: TranslationWorkspaceSnapshot) {
  return createEchoProvider<MarkdownTranslationContext>((text) => {
    let translated = text;
    for (const [source, target] of Object.entries(workspace.glossary.terms)) {
      translated = translated.split(source).join(target);
    }
    return translated;
  });
}

async function simulate(
  workspace: TranslationWorkspaceSnapshot,
  options: CliOptions,
): Promise<void> {
  const entries = selectedEntries(workspace.entries, options);
  if (entries.length !== 1 || !entries[0]?.source) {
    throw new Error(`simulate 必须且只能匹配 1 篇可翻译页面，当前为 ${entries.length} 篇。`);
  }
  if (!TRANSLATABLE_STATES.has(entries[0].state)) {
    throw new Error(`页面状态 ${entries[0].state} 阻塞模拟执行。`);
  }
  const run = await runTranslationPage(
    workspace,
    entries[0].source.sourceUrl,
    {
      commit: false,
      provider: simulateProvider(workspace),
      useCheckpoint: false,
    },
  );
  console.log(`模拟页面：${run.sourceUrl}`);
  console.log(`source=${entries[0].source.sourcePath}`);
  console.log(`target=${run.targetPath}`);
  console.log(`units=${run.result.stats.uniqueUnits}`);
  console.log(`characters=${run.result.stats.characters}`);
  console.log("写入：否（simulate 不创建译文或 manifest）");
}

async function run(
  workspace: TranslationWorkspaceSnapshot,
  options: CliOptions,
): Promise<void> {
  const entries = selectedEntries(workspace.entries, options);
  if (entries.length !== 1 || !entries[0]?.source) {
    throw new Error(`run 必须且只能匹配 1 篇可翻译页面，当前为 ${entries.length} 篇。`);
  }
  if (!TRANSLATABLE_STATES.has(entries[0].state)) {
    throw new Error(`页面状态 ${entries[0].state} 阻塞真实翻译。`);
  }
  const result = await runTranslationPage(workspace, entries[0].source.sourceUrl, {
    commit: options.commit,
    provider: createConfiguredProvider(workspace.config.provider),
  });
  console.log(`翻译页面：${result.sourceUrl}`);
  console.log(`provider=${workspace.config.provider.id}`);
  console.log(`model=${workspace.config.provider.model}`);
  console.log(`source=${entries[0].source.sourcePath}`);
  console.log(`target=${result.targetPath}`);
  console.log(`units=${result.result.stats.uniqueUnits}`);
  console.log(`characters=${result.result.stats.characters}`);
  console.log(`写入：${result.committed ? "是（译文及 manifest）" : "否（未提供 --commit）"}`);
}

async function auto(
  workspace: TranslationWorkspaceSnapshot,
  options: CliOptions,
): Promise<void> {
  const priority = await loadTranslationPriorityConfig(workspace);
  const selected: Array<{
    entry: SourcedTranslationPageInspection;
    sourceCharacters: number;
  }> = [];
  for (const entry of automaticTranslationCandidates(
    workspace.entries,
    options.section,
    priority.sourcePaths,
  )) {
    if (!entry.source) continue;
    const source = await readTranslationWorkspaceFile(
      workspace,
      entry.source.sourcePath,
      "自动翻译英文页面",
    );
    if (source.length <= AUTO_MAX_SOURCE_CHARACTERS) {
      selected.push({
        entry: { ...entry, source: entry.source },
        sourceCharacters: source.length,
      });
      if (selected.length === options.limit) break;
      continue;
    }
    console.log(
      `跳过超出自动预算的页面：${entry.source.sourcePath} (${source.length} > ${AUTO_MAX_SOURCE_CHARACTERS})`,
    );
  }
  if (selected.length === 0) {
    console.log("自动翻译：没有符合状态与字符预算的页面。");
    return;
  }
  const provider = createConfiguredProvider(workspace.config.provider);
  for (const [index, selection] of selected.entries()) {
    const result = await runTranslationPage(
      workspace,
      selection.entry.source.sourceUrl,
      {
        commit: true,
        provider,
        useCheckpoint: false,
      },
    );
    console.log(`自动翻译页面：${result.sourceUrl}`);
    console.log(`page=${index + 1}/${selected.length}`);
    console.log(`state=${selection.entry.state}`);
    const priorityIndex = priority.sourcePaths.indexOf(
      selection.entry.source.sourcePath,
    );
    console.log(`priority=${priorityIndex >= 0 ? priorityIndex + 1 : "fallback"}`);
    console.log(`source=${selection.entry.source.sourcePath}`);
    console.log(`target=${result.targetPath}`);
    console.log(`sourceCharacters=${selection.sourceCharacters}`);
    console.log(`units=${result.result.stats.uniqueUnits}`);
    console.log(`characters=${result.result.stats.characters}`);
    console.log("写入：是（译文及 manifest，reviewStatus=machine）");
  }
  console.log(`自动翻译完成：translated=${selected.length}`);
}

async function review(
  workspace: TranslationWorkspaceSnapshot,
  options: CliOptions,
): Promise<void> {
  const entries = matchingEntries(workspace.entries, options);
  if (entries.length !== 1 || !entries[0]?.source) {
    throw new Error(`review 必须且只能匹配 1 篇已登记页面，当前为 ${entries.length} 篇。`);
  }
  const result = await reviewTranslationPage(
    workspace,
    entries[0].source.sourceUrl,
  );
  console.log(`审核页面：${result.sourceUrl}`);
  console.log(`target=${result.targetPath}`);
  console.log(`targetSha256=${result.targetSha256}`);
  console.log("reviewStatus=reviewed");
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const options = parseCliOptions(argv);
  const workspace = await loadTranslationWorkspace(
    REPOSITORY_ROOT,
    options.configPath,
  );
  if (options.command === "auto") {
    await auto(workspace, options);
    return 0;
  }
  if (options.command === "review") {
    await review(workspace, options);
    return 0;
  }
  if (options.command === "run") {
    await run(workspace, options);
    return 0;
  }
  if (options.command === "simulate") {
    await simulate(workspace, options);
    return 0;
  }
  if (options.command === "check" || options.command === "status") {
    printStatus(workspace.entries, workspace.policySha256);
    if (options.command === "check") {
      assertTranslationIntegrity(workspace.entries);
      await loadTranslationPriorityConfig(workspace);
      console.log("中文翻译完整性：通过");
    }
    return 0;
  }
  const priority = await loadTranslationPriorityConfig(workspace);
  printPlan(selectedEntries(workspace.entries, options, priority.sourcePaths));
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
