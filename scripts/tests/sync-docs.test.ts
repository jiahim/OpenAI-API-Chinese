import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildPageRecord,
  main,
  mirroredRelativePath,
  parseIndex,
  selectEntries,
  sha256,
  type IndexEntry,
} from "../sync-docs.ts";

async function readFileOrUndefined(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

test("mirroredRelativePath preserves the official URL hierarchy", () => {
  assert.equal(
    mirroredRelativePath("https://developers.openai.com/api/docs/guides/images.md"),
    "api/docs/guides/images.md",
  );
  assert.equal(
    mirroredRelativePath("https://developers.openai.com/api/reference/resources/models.md"),
    "api/reference/resources/models.md",
  );
});

test("mirroredRelativePath rejects non-official and unsupported sources", () => {
  assert.throws(
    () => mirroredRelativePath("https://example.com/api/docs/guide.md"),
    /不允许的文档来源/,
  );
  assert.throws(
    () => mirroredRelativePath("https://developers.openai.com/cookbook/guide.md"),
    /不支持的 OpenAI Docs 路径/,
  );
});

test("parseIndex discovers, de-duplicates, and mirrors pages", () => {
  const index = [
    "# Guides",
    "- [Quickstart](https://developers.openai.com/api/docs/quickstart.md): Start here",
    "- [Quickstart duplicate](https://developers.openai.com/api/docs/quickstart.md): Duplicate",
    "- [Reference](https://developers.openai.com/api/reference/models.md): Wrong section",
  ].join("\n");

  assert.deepEqual(parseIndex(index, "guides"), [
    {
      description: "Start here",
      localPath: "docs/en/api/docs/quickstart.md",
      section: "guides",
      sourceUrl: "https://developers.openai.com/api/docs/quickstart.md",
      title: "Quickstart",
    },
  ]);
});

test("selectEntries applies case-insensitive matching before the limit", () => {
  const entries: IndexEntry[] = [
    {
      description: "",
      localPath: "docs/en/api/docs/quickstart.md",
      section: "guides",
      sourceUrl: "https://developers.openai.com/api/docs/quickstart.md",
      title: "Quickstart",
    },
    {
      description: "",
      localPath: "docs/en/api/docs/images.md",
      section: "guides",
      sourceUrl: "https://developers.openai.com/api/docs/images.md",
      title: "Image generation",
    },
  ];

  assert.deepEqual(selectEntries(entries, ["IMAGE"], 1), [entries[1]]);
});

test("buildPageRecord changes sourceUpdatedAt only when source content changes", () => {
  const entry: IndexEntry = {
    description: "Start here",
    localPath: "docs/en/api/docs/quickstart.md",
    section: "guides",
    sourceUrl: "https://developers.openai.com/api/docs/quickstart.md",
    title: "Quickstart",
  };
  const first = buildPageRecord(entry, "first", {}, undefined, "2026-08-16T00:00:00Z");
  const unchanged = buildPageRecord(
    entry,
    "first",
    {},
    first,
    "2026-08-17T00:00:00Z",
  );
  const changed = buildPageRecord(
    entry,
    "second",
    {},
    unchanged,
    "2026-08-18T00:00:00Z",
  );

  assert.equal(first.sha256, sha256("first"));
  assert.equal(unchanged.firstSeenAt, first.firstSeenAt);
  assert.equal(unchanged.sourceUpdatedAt, first.sourceUpdatedAt);
  assert.equal(changed.sourceUpdatedAt, "2026-08-18T00:00:00Z");
});

test("check fetches official indexes and pages without writing", async () => {
  const originalFetch = globalThis.fetch;
  const requested: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requested.push(url);
    if (url === "https://developers.openai.com/api/docs/llms.txt") {
      return new Response(
        "- [Quickstart](https://developers.openai.com/api/docs/quickstart.md): Start here\n",
      );
    }
    if (url === "https://developers.openai.com/api/reference/llms.txt") {
      return new Response("# Reference\n");
    }
    if (url === "https://developers.openai.com/api/docs/quickstart.md") {
      return new Response("# Quickstart\n\n[External](https://example.com)\n");
    }
    return new Response("Not found", { status: 404 });
  };

  try {
    const exitCode = await main([
      "check",
      "--config",
      "scripts/tests/fixtures/docs.config.json",
    ]);
    assert.equal(exitCode, 1);
    assert.deepEqual(requested, [
      "https://developers.openai.com/api/docs/llms.txt",
      "https://developers.openai.com/api/reference/llms.txt",
      "https://developers.openai.com/api/docs/quickstart.md",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sync does not write indexes, pages, or manifest after a page failure", async () => {
  const originalFetch = globalThis.fetch;
  const localPaths = [
    "scripts/tests/fixtures/en/api/docs/llms.txt",
    "scripts/tests/fixtures/en/api/reference/llms.txt",
    "scripts/tests/fixtures/en/api/docs/quickstart.md",
    "scripts/tests/fixtures/en/.source-manifest.json",
  ];
  const before = await Promise.all(localPaths.map(readFileOrUndefined));

  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url === "https://developers.openai.com/api/docs/llms.txt") {
      return new Response(
        "- [Quickstart](https://developers.openai.com/api/docs/quickstart.md): Start here\n",
      );
    }
    if (url === "https://developers.openai.com/api/reference/llms.txt") {
      return new Response("# Reference\n");
    }
    return new Response("Not found", { status: 404 });
  };

  try {
    const exitCode = await main([
      "sync",
      "--config",
      "scripts/tests/fixtures/docs.config.json",
    ]);
    assert.equal(exitCode, 2);
    const after = await Promise.all(localPaths.map(readFileOrUndefined));
    assert.deepEqual(after, before);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
