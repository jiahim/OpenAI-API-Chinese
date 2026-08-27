import assert from "node:assert/strict";
import test from "node:test";

import {
  parseNameStatus,
  renderSyncRelease,
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

test("renderSyncRelease keeps article changes and resolves page metadata", () => {
  const release = renderSyncRelease(
    {
      added: ["docs/en/api/docs/new.md", "docs/en/api/docs/llms.txt"],
      modified: ["docs/en/.source-manifest.json", "docs/en/api/docs/changed.md"],
      removed: ["docs/en/api/docs/removed.md"],
    },
    {
      generatedAt: "2026-08-27T00:49:10Z",
      pages: {
        new: {
          localPath: "docs/en/api/docs/new.md",
          sourceUrl: "https://developers.openai.com/api/docs/new.md",
          title: "New page",
        },
        changed: {
          localPath: "docs/en/api/docs/changed.md",
          sourceUrl: "https://developers.openai.com/api/docs/changed.md",
          title: "Changed page",
        },
        removed: {
          localPath: "docs/en/api/docs/removed.md",
          sourceUrl: "https://developers.openai.com/api/docs/removed.md",
          title: "Removed page",
        },
      },
    },
  );

  assert.equal(release.id, "2026-08-27T00-49-10-000Z");
  assert.deepEqual(release.added.map((entry) => entry.title), ["New page"]);
  assert.deepEqual(release.modified.map((entry) => entry.route), [
    "/api/docs/changed",
  ]);
  assert.deepEqual(release.removed.map((entry) => entry.title), [
    "Removed page",
  ]);
});
