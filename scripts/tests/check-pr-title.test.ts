import assert from "node:assert/strict";
import test from "node:test";

import { pullRequestTitleError } from "../check-pr-title.ts";

test("Codex and automation branches require the AI pull request prefix", () => {
  assert.equal(
    pullRequestTitleError("[AI] fix: 修复任务", "codex/fix-task"),
    undefined,
  );
  assert.equal(
    pullRequestTitleError("[AI] docs: 自动同步", "automation/sync-docs"),
    undefined,
  );
  assert.match(
    pullRequestTitleError("[Human] fix: 修复任务", "codex/fix-task") ?? "",
    /必须以 \[AI\] 开头/,
  );
});

test("other branches accept explicit AI or Human pull request prefixes", () => {
  assert.equal(
    pullRequestTitleError("[AI] feat: 自动变更", "feature/automation"),
    undefined,
  );
  assert.equal(
    pullRequestTitleError("[Human] feat: 人工变更", "feature/manual"),
    undefined,
  );
  assert.match(
    pullRequestTitleError("feat: 缺少来源标记", "feature/manual") ?? "",
    /\[AI\].*\[Human\]/,
  );
});
