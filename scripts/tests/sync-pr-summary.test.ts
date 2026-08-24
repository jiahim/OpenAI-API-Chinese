import assert from "node:assert/strict";
import test from "node:test";

import {
  parseNameStatus,
  renderSyncPullRequestBody,
} from "../sync-pr-summary.ts";

test("parseNameStatus separates and sorts added, modified, and removed files", () => {
  const summary = parseNameStatus(
    [
      "M",
      "docs/en/zeta.md",
      "A",
      "docs/en/new.md",
      "D",
      "docs/en/removed.md",
      "M",
      "docs/en/alpha.md",
      "",
    ].join("\0"),
  );

  assert.deepEqual(summary, {
    added: ["docs/en/new.md"],
    modified: ["docs/en/alpha.md", "docs/en/zeta.md"],
    removed: ["docs/en/removed.md"],
  });
});

test("parseNameStatus rejects unexpected statuses instead of hiding changes", () => {
  assert.throws(
    () => parseNameStatus("R100\0docs/en/renamed.md\0"),
    /不支持的 Git 文件状态：R100/,
  );
});

test("renderSyncPullRequestBody uses Chinese sections and lists every path", () => {
  const body = renderSyncPullRequestBody({
    added: ["docs/en/api/docs/new.md"],
    modified: ["docs/en/.source-manifest.json", "docs/en/api/docs/changed.md"],
    removed: [],
  });

  assert.match(body, /新增文件：1/);
  assert.match(body, /修改文件：2/);
  assert.match(body, /删除文件：0/);
  assert.match(body, /## 新增文件（1）/);
  assert.match(body, /`docs\/en\/api\/docs\/new\.md`/);
  assert.match(body, /## 修改文件（2）/);
  assert.match(body, /`docs\/en\/\.source-manifest\.json`/);
  assert.match(body, /`docs\/en\/api\/docs\/changed\.md`/);
  assert.match(body, /## 删除文件（0）\n\n无。/);
  assert.match(body, /仅在 `Quality gate` 通过后合入/);
});
