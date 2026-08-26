#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const AI_TITLE_PREFIX = "[AI] ";
const HUMAN_TITLE_PREFIX = "[Human] ";
const AI_BRANCH_PREFIXES = ["automation/", "codex/"] as const;

function isAiBranch(headRef: string): boolean {
  return AI_BRANCH_PREFIXES.some((prefix) => headRef.startsWith(prefix));
}

export function pullRequestTitleError(
  title: string,
  headRef: string,
): string | undefined {
  if (isAiBranch(headRef) && !title.startsWith(AI_TITLE_PREFIX)) {
    return `AI 分支 ${headRef} 的 PR 标题必须以 ${AI_TITLE_PREFIX.trimEnd()} 开头。`;
  }
  if (
    !title.startsWith(AI_TITLE_PREFIX) &&
    !title.startsWith(HUMAN_TITLE_PREFIX)
  ) {
    return `PR 标题必须以 ${AI_TITLE_PREFIX.trimEnd()} 或 ${HUMAN_TITLE_PREFIX.trimEnd()} 开头。`;
  }
  return undefined;
}

export function checkPullRequestTitle(
  title = process.env.PR_TITLE ?? "",
  headRef = process.env.PR_HEAD_REF ?? "",
): void {
  if (!title) throw new Error("缺少 PR_TITLE。");
  if (!headRef) throw new Error("缺少 PR_HEAD_REF。");
  const error = pullRequestTitleError(title, headRef);
  if (error) throw new Error(error);
  console.log(`PR 标题校验通过：${title}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    checkPullRequestTitle();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
