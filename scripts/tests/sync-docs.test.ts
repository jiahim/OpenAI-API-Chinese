import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
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

const FIXTURE_SOURCE_ROOT = "scripts/tests/fixtures/en";
const FIXTURE_CONFIG = "scripts/tests/fixtures/docs.config.json";

function guidesIndex(pageNames: string[]): string {
  return `${pageNames
    .map(
      (name) =>
        `- [${name}](https://developers.openai.com/api/docs/${name}.md): ${name}`,
    )
    .join("\n")}\n`;
}

function installGuidesFetch(indexContent: string): () => void {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url === "https://developers.openai.com/api/docs/llms.txt") {
      return new Response(indexContent);
    }
    const pageName = new URL(url).pathname.split("/").at(-1)?.replace(/\.md$/, "");
    return pageName
      ? new Response(`# ${pageName}\n`)
      : new Response("Not found", { status: 404 });
  };
  return () => {
    globalThis.fetch = originalFetch;
  };
}

async function resetFixtureSource(): Promise<void> {
  await rm(FIXTURE_SOURCE_ROOT, { force: true, recursive: true });
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
      "--section",
      "guides",
      "--config",
      "scripts/tests/fixtures/docs.config.json",
    ]);
    assert.equal(exitCode, 1);
    assert.deepEqual(requested, [
      "https://developers.openai.com/api/docs/llms.txt",
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
      "--section",
      "guides",
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

test("sync rejects an empty index without writing or pruning existing files", async () => {
  await resetFixtureSource();
  let restoreFetch = installGuidesFetch(guidesIndex(["quickstart"]));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    const trackedPaths = [
      `${FIXTURE_SOURCE_ROOT}/api/docs/llms.txt`,
      `${FIXTURE_SOURCE_ROOT}/api/docs/quickstart.md`,
      `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`,
    ];
    const before = await Promise.all(trackedPaths.map(readFileOrUndefined));

    restoreFetch();
    restoreFetch = installGuidesFetch("# Guides\n");
    const exitCode = await main([
      "sync",
      "--section",
      "guides",
      "--prune",
      "--config",
      FIXTURE_CONFIG,
    ]);

    assert.equal(exitCode, 2);
    assert.deepEqual(
      await Promise.all(trackedPaths.map(readFileOrUndefined)),
      before,
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

test("sync refuses an unexpectedly large prune without changing the mirror", async () => {
  await resetFixtureSource();
  let restoreFetch = installGuidesFetch(guidesIndex(["alpha", "beta", "gamma"]));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    const trackedPaths = [
      `${FIXTURE_SOURCE_ROOT}/api/docs/llms.txt`,
      `${FIXTURE_SOURCE_ROOT}/api/docs/alpha.md`,
      `${FIXTURE_SOURCE_ROOT}/api/docs/beta.md`,
      `${FIXTURE_SOURCE_ROOT}/api/docs/gamma.md`,
      `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`,
    ];
    const before = await Promise.all(trackedPaths.map(readFileOrUndefined));

    restoreFetch();
    restoreFetch = installGuidesFetch(guidesIndex(["alpha"]));
    const exitCode = await main([
      "sync",
      "--section",
      "guides",
      "--prune",
      "--config",
      FIXTURE_CONFIG,
    ]);

    assert.equal(exitCode, 2);
    assert.deepEqual(
      await Promise.all(trackedPaths.map(readFileOrUndefined)),
      before,
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

test("allow-large-prune permits an intentional large removal", async () => {
  await resetFixtureSource();
  let restoreFetch = installGuidesFetch(guidesIndex(["alpha", "beta", "gamma"]));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    restoreFetch();
    restoreFetch = installGuidesFetch(guidesIndex(["alpha"]));

    const exitCode = await main([
      "sync",
      "--section",
      "guides",
      "--prune",
      "--allow-large-prune",
      "--config",
      FIXTURE_CONFIG,
    ]).catch(() => 2);
    assert.equal(exitCode, 0);
    assert.equal(
      await readFileOrUndefined(`${FIXTURE_SOURCE_ROOT}/api/docs/alpha.md`),
      "# alpha\n",
    );
    assert.equal(
      await readFileOrUndefined(`${FIXTURE_SOURCE_ROOT}/api/docs/beta.md`),
      undefined,
    );
    assert.equal(
      await readFileOrUndefined(`${FIXTURE_SOURCE_ROOT}/api/docs/gamma.md`),
      undefined,
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

test("prune derives its deletion target from the validated source URL", async () => {
  await resetFixtureSource();
  const pageNames = Array.from({ length: 30 }, (_, index) => `page-${index}`);
  const removedPage = pageNames[0]!;
  const outsidePath = "scripts/tests/fixtures/do-not-delete.md";
  let restoreFetch = installGuidesFetch(guidesIndex(pageNames));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    const manifestPath = `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`;
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
      pages: Record<string, { localPath: string }>;
    };
    const removedUrl = `https://developers.openai.com/api/docs/${removedPage}.md`;
    manifest.pages[removedUrl]!.localPath = outsidePath;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    await writeFile(outsidePath, "keep me\n", "utf8");

    restoreFetch();
    restoreFetch = installGuidesFetch(guidesIndex(pageNames.slice(1)));
    assert.equal(
      await main([
        "sync",
        "--section",
        "guides",
        "--prune",
        "--config",
        FIXTURE_CONFIG,
      ]),
      0,
    );

    assert.equal(await readFileOrUndefined(outsidePath), "keep me\n");
    assert.equal(
      await readFileOrUndefined(
        `${FIXTURE_SOURCE_ROOT}/api/docs/${removedPage}.md`,
      ),
      undefined,
    );
  } finally {
    restoreFetch();
    await Promise.all([
      resetFixtureSource(),
      rm(outsidePath, { force: true }),
    ]);
  }
});

test("sync stops dequeuing pages after the first terminal download failure", async () => {
  await resetFixtureSource();
  const originalFetch = globalThis.fetch;
  const requested: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requested.push(url);
    if (url === "https://developers.openai.com/api/docs/llms.txt") {
      return new Response(guidesIndex(["alpha", "beta", "gamma"]));
    }
    if (url.endsWith("/alpha.md")) {
      return new Response("Not found", { status: 404 });
    }
    return new Response("# should not be requested\n");
  };

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      2,
    );
    assert.deepEqual(requested, [
      "https://developers.openai.com/api/docs/llms.txt",
      "https://developers.openai.com/api/docs/alpha.md",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    await resetFixtureSource();
  }
});

test("successful sync writes an exact mirror and repeated sync is idempotent", async () => {
  await resetFixtureSource();
  const restoreFetch = installGuidesFetch(guidesIndex(["alpha"]));
  const trackedPaths = [
    `${FIXTURE_SOURCE_ROOT}/api/docs/llms.txt`,
    `${FIXTURE_SOURCE_ROOT}/api/docs/alpha.md`,
    `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`,
  ];

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    const first = await Promise.all(trackedPaths.map(readFileOrUndefined));
    assert.deepEqual(first.slice(0, 2), [guidesIndex(["alpha"]), "# alpha\n"]);

    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    assert.deepEqual(
      await Promise.all(trackedPaths.map(readFileOrUndefined)),
      first,
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

test("partial sync never removes unselected active pages", async () => {
  await resetFixtureSource();
  const restoreFetch = installGuidesFetch(guidesIndex(["alpha", "beta"]));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    assert.equal(
      await main([
        "sync",
        "--section",
        "guides",
        "--match",
        "alpha",
        "--prune",
        "--config",
        FIXTURE_CONFIG,
      ]),
      0,
    );

    assert.equal(
      await readFileOrUndefined(`${FIXTURE_SOURCE_ROOT}/api/docs/beta.md`),
      "# beta\n",
    );
    const manifest = JSON.parse(
      await readFile(`${FIXTURE_SOURCE_ROOT}/.source-manifest.json`, "utf8"),
    ) as { pages: Record<string, { status: string }> };
    assert.equal(
      manifest.pages["https://developers.openai.com/api/docs/beta.md"]?.status,
      "active",
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

test("prune rejects a manifest page URL that targets the live index", async () => {
  await resetFixtureSource();
  const pageNames = Array.from({ length: 30 }, (_, index) => `page-${index}`);
  const restoreFetch = installGuidesFetch(guidesIndex(pageNames));

  try {
    assert.equal(
      await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
      0,
    );
    const manifestPath = `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`;
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
      pages: Record<string, Record<string, unknown>>;
    };
    const replacedUrl = `https://developers.openai.com/api/docs/${pageNames[0]}.md`;
    const forgedUrl = "https://developers.openai.com/api/docs/llms.txt";
    const forgedRecord = manifest.pages[replacedUrl]!;
    delete manifest.pages[replacedUrl];
    manifest.pages[forgedUrl] = {
      ...forgedRecord,
      localPath: `${FIXTURE_SOURCE_ROOT}/api/docs/llms.txt`,
      sourceUrl: forgedUrl,
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const trackedPaths = [
      `${FIXTURE_SOURCE_ROOT}/api/docs/llms.txt`,
      manifestPath,
    ];
    const before = await Promise.all(trackedPaths.map(readFileOrUndefined));

    const exitCode = await main([
      "sync",
      "--section",
      "guides",
      "--prune",
      "--config",
      FIXTURE_CONFIG,
    ]).catch(() => 0);
    assert.equal(exitCode, 2);
    assert.deepEqual(
      await Promise.all(trackedPaths.map(readFileOrUndefined)),
      before,
    );
  } finally {
    restoreFetch();
    await resetFixtureSource();
  }
});

for (const invalidPage of [
  { body: "", contentType: "text/markdown", label: "empty" },
  { body: "# mislabeled\n", contentType: "text/html", label: "HTML content-type" },
  {
    body: "# mislabeled\n",
    contentType: "application/xhtml+xml",
    label: "XHTML content-type",
  },
  {
    body: "<!doctype html><html>blocked</html>",
    contentType: "text/plain",
    label: "HTML document",
  },
]) {
  test(`sync rejects an ${invalidPage.label} page response body`, async () => {
    await resetFixtureSource();
    let restoreFetch = installGuidesFetch(guidesIndex(["alpha"]));

    try {
      assert.equal(
        await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
        0,
      );
      const trackedPaths = [
        `${FIXTURE_SOURCE_ROOT}/api/docs/alpha.md`,
        `${FIXTURE_SOURCE_ROOT}/.source-manifest.json`,
      ];
      const before = await Promise.all(trackedPaths.map(readFileOrUndefined));

      restoreFetch();
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (input) => {
        const url = String(input);
        if (url === "https://developers.openai.com/api/docs/llms.txt") {
          return new Response(guidesIndex(["alpha"]));
        }
        return new Response(invalidPage.body, {
          headers: { "content-type": invalidPage.contentType },
        });
      };
      restoreFetch = () => {
        globalThis.fetch = originalFetch;
      };

      assert.equal(
        await main(["sync", "--section", "guides", "--config", FIXTURE_CONFIG]),
        2,
      );
      assert.deepEqual(
        await Promise.all(trackedPaths.map(readFileOrUndefined)),
        before,
      );
    } finally {
      restoreFetch();
      await resetFixtureSource();
    }
  });
}
