#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { buildTranslationStatusReport } from "./translation/planner.ts";
import type {
  SourceSection,
  TranslationPageInspection,
  TranslationPageState,
} from "./translation/types.ts";

type Command = "plan" | "status";

interface CliOptions {
  command: Command;
  configPath: string;
  limit?: number | undefined;
  matches: string[];
  section: SourceSection | "all";
}

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_CONFIG_PATH = "scripts/translation.config.json";
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
  if (command !== "plan" && command !== "status") {
    throw new Error("命令必须是 plan 或 status。");
  }

  const options: CliOptions = {
    command,
    configPath: DEFAULT_CONFIG_PATH,
    matches: [],
    section: "all",
  };
  for (let index = 1; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") {
      continue;
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
    options.command === "status" &&
    (options.limit !== undefined ||
      options.matches.length > 0 ||
      options.section !== "all")
  ) {
    throw new Error("--limit、--match 和 --section 仅适用于 plan 命令。");
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

function selectedEntries(
  entries: TranslationPageInspection[],
  options: CliOptions,
): TranslationPageInspection[] {
  const selected = entries.filter((entry) => {
    if (!TRANSLATABLE_STATES.has(entry.state) && !BLOCKED_STATES.has(entry.state)) {
      return false;
    }
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
  return options.limit === undefined ? selected : selected.slice(0, options.limit);
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

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const options = parseCliOptions(argv);
  const report = await buildTranslationStatusReport(
    REPOSITORY_ROOT,
    options.configPath,
  );
  if (options.command === "status") {
    printStatus(report.entries, report.policySha256);
    return 0;
  }
  printPlan(selectedEntries(report.entries, options));
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
