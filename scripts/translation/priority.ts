import { posix } from "node:path";

import { readTranslationWorkspaceFile } from "./planner.ts";
import type { TranslationWorkspaceSnapshot } from "./types.ts";

export interface TranslationPriorityConfig {
  schemaVersion: 1;
  sourcePaths: string[];
}

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("翻译优先级配置必须是对象。");
  }
  return value as Record<string, unknown>;
}

function validateSourcePath(value: unknown, sourceRoot: string): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== value.trim() ||
    value.includes("\\") ||
    value.includes("\0") ||
    posix.normalize(value) !== value ||
    !value.startsWith(`${sourceRoot}/`) ||
    posix.extname(value) !== ".md"
  ) {
    throw new Error(`翻译优先级 sourcePath 无效：${String(value)}`);
  }
  return value;
}

export function parseTranslationPriorityConfig(
  raw: unknown,
  sourceRoot: string,
): TranslationPriorityConfig {
  const object = asObject(raw);
  const unexpected = Object.keys(object).filter(
    (key) => key !== "schemaVersion" && key !== "sourcePaths",
  );
  if (unexpected.length) {
    throw new Error(`翻译优先级配置包含未知字段：${unexpected.sort().join("、")}`);
  }
  if (object.schemaVersion !== 1) {
    throw new Error("翻译优先级配置.schemaVersion 必须是 1。");
  }
  if (!Array.isArray(object.sourcePaths) || object.sourcePaths.length === 0) {
    throw new Error("翻译优先级配置.sourcePaths 必须是非空数组。");
  }

  const sourcePaths = object.sourcePaths.map((value) =>
    validateSourcePath(value, sourceRoot),
  );
  if (new Set(sourcePaths).size !== sourcePaths.length) {
    throw new Error("翻译优先级配置.sourcePaths 不能包含重复路径。");
  }
  return { schemaVersion: 1, sourcePaths };
}

export async function loadTranslationPriorityConfig(
  workspace: TranslationWorkspaceSnapshot,
): Promise<TranslationPriorityConfig> {
  const content = await readTranslationWorkspaceFile(
    workspace,
    workspace.config.priorityPath,
    "翻译优先级配置",
  );
  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error("翻译优先级配置不是有效 JSON。", { cause: error });
  }
  return parseTranslationPriorityConfig(parsed, workspace.config.sourceRoot);
}
