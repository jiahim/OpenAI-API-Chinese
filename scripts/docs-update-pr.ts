#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { isAbsolute, posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const AUTOMATION_AUTHOR = "github-actions[bot]";
const AUTOMATION_BASE_REF = "main";
const AUTOMATION_HEAD_REF = "automation/update-openai-docs";
const AUTOMATION_TITLE = "[AI] docs: 同步并翻译 OpenAI 官方文档";

export interface AutomationPullRequestInput {
  authorLogin: string;
  baseRef: string;
  headRef: string;
  headSha: string;
  open: boolean;
  title: string;
}

export type AutomationPhase = "blocked-draft" | "ready-for-ci";

export interface AutomationPhaseInput {
  batchComplete: boolean;
  headMatches: boolean;
  translationFailed: boolean;
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} 必须是对象。`);
  }
  return value as Record<string, unknown>;
}

export function assertAutomationPullRequest(
  input: AutomationPullRequestInput,
): void {
  const value = asObject(input, "PR 输入");
  if (value.authorLogin !== AUTOMATION_AUTHOR) {
    throw new Error(`PR 作者必须是 ${AUTOMATION_AUTHOR}。`);
  }
  if (value.baseRef !== AUTOMATION_BASE_REF) {
    throw new Error(`PR base 必须是 ${AUTOMATION_BASE_REF}。`);
  }
  if (value.headRef !== AUTOMATION_HEAD_REF) {
    throw new Error(`PR head 必须是 ${AUTOMATION_HEAD_REF}。`);
  }
  if (
    typeof value.headSha !== "string" ||
    !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/iu.test(value.headSha)
  ) {
    throw new Error("PR head SHA 必须是 40 或 64 位十六进制字符串。");
  }
  if (value.open !== true) {
    throw new Error("PR 必须处于打开状态。");
  }
  if (value.title !== AUTOMATION_TITLE) {
    throw new Error(`PR 标题必须是 ${AUTOMATION_TITLE}。`);
  }
}

function isAllowedAutomationPath(path: string): boolean {
  if (
    !path ||
    isAbsolute(path) ||
    /^[A-Za-z]:[\\/]/u.test(path) ||
    path.includes("\\") ||
    path.includes("\0") ||
    posix.normalize(path) !== path
  ) {
    return false;
  }
  return /^(?:docs\/en|docs\/zh|docs\/updates)\/.+/u.test(path);
}

export function assertAllowedAutomationPaths(paths: readonly string[]): void {
  if (!Array.isArray(paths)) throw new Error("路径输入必须是数组。");
  const rejected = paths.filter(
    (path) => typeof path !== "string" || !isAllowedAutomationPath(path),
  );
  if (rejected.length) {
    throw new Error(`禁止路径：${rejected.map(String).join("、")}`);
  }
}

export function decideAutomationPhase(
  input: AutomationPhaseInput,
): AutomationPhase {
  return input.batchComplete === true &&
    input.headMatches === true &&
    input.translationFailed === false
    ? "ready-for-ci"
    : "blocked-draft";
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`输入不是有效 JSON：${path}`, { cause: error });
    }
    throw error;
  }
}

function inputPath(argv: readonly string[]): string {
  const optionIndex = argv.indexOf("--input");
  const path = optionIndex >= 0 ? argv[optionIndex + 1] : undefined;
  if (!path || path.startsWith("--")) {
    throw new Error("缺少必需参数：--input PATH。");
  }
  return path;
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const args = argv[0] === "--" ? argv.slice(1) : argv;
  const command = args[0];
  if (command !== "check-pr" && command !== "check-paths") {
    throw new Error("命令必须是 check-pr 或 check-paths。");
  }
  const input = await readJson(inputPath(args));
  if (command === "check-pr") {
    assertAutomationPullRequest(input as AutomationPullRequestInput);
    console.log("trusted=true");
    return;
  }
  assertAllowedAutomationPaths(input as readonly string[]);
  console.log("allowed=true");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
