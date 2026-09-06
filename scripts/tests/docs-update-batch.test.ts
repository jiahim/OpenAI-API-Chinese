import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  inspectDocsUpdateBatch,
  inspectDocsUpdateBatchWorkspace,
  loadDocsUpdateBatch,
  requiredSourcePaths,
} from "../docs-update-batch.ts";
import type { SyncRelease, SyncReleaseEntry } from "../sync-pr-summary.ts";
import type {
  TranslationPageInspection,
  TranslationWorkspaceSnapshot,
} from "../translation/types.ts";

function releaseEntry(path: string): SyncReleaseEntry {
  const slug = path.slice("docs/en/".length, -".md".length);
  return {
    path,
    route: `/${slug}`,
    sourceUrl: `https://developers.openai.com/${slug}.md`,
    title: slug,
  };
}

function release(overrides: Partial<SyncRelease> = {}): SyncRelease {
  return {
    added: [],
    generatedAt: "2026-09-06T00:00:00Z",
    id: "2026-09-06T00-00-00-000Z",
    modified: [],
    removed: [],
    ...overrides,
  };
}

function inspection(
  sourcePath: string,
  state: TranslationPageInspection["state"],
  options: { record?: boolean; status?: "active" | "removed" } = {},
): TranslationPageInspection {
  const item = releaseEntry(sourcePath);
  const targetPath = sourcePath.replace(/^docs\/en\//u, "docs/zh/");
  const source = {
    section: "guides" as const,
    sha256: "a".repeat(64),
    sourcePath,
    sourceUrl: item.sourceUrl,
    status: options.status ?? "active",
  };
  return {
    ...(options.record
      ? {
          record: {
            policySha256: "b".repeat(64),
            reviewStatus: "machine" as const,
            sourcePath,
            sourceSha256: source.sha256,
            sourceUrl: source.sourceUrl,
            targetPath,
            targetSha256: "c".repeat(64),
            translatedAt: "2026-09-06T00:00:00Z",
          },
        }
      : {}),
    source,
    state,
    targetPath,
  };
}

async function withBatchFile(
  value: unknown,
  run: (path: string) => Promise<void>,
): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "docs-update-batch-"));
  try {
    const path = join(root, "release.json");
    await writeFile(path, JSON.stringify(value));
    await run(path);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
}

test("required paths contain only added and modified Markdown pages", () => {
  const batch = release({
    added: [releaseEntry("docs/en/b.md")],
    modified: [releaseEntry("docs/en/a.md")],
    removed: [releaseEntry("docs/en/removed.md")],
  });

  assert.deepEqual(requiredSourcePaths(batch), ["docs/en/a.md", "docs/en/b.md"]);
});

test("batch consistency lists every non-current required page", () => {
  const batch = release({
    added: [releaseEntry("docs/en/b.md")],
    modified: [releaseEntry("docs/en/a.md")],
  });
  const entries = [
    inspection("docs/en/a.md", "stale-source"),
    inspection("docs/en/b.md", "current"),
  ];

  const report = inspectDocsUpdateBatch(batch, entries);

  assert.equal(report.complete, false);
  assert.deepEqual(
    report.issues.map((issue) => [issue.kind, issue.sourcePath, issue.state]),
    [["required-not-current", "docs/en/a.md", "stale-source"]],
  );
  assert.deepEqual(report.requiredSourcePaths, ["docs/en/a.md", "docs/en/b.md"]);
  assert.deepEqual(report.removedSourcePaths, []);
});

test("a required page missing from workspace is not current", () => {
  const batch = release({ added: [releaseEntry("docs/en/a.md")] });

  assert.deepEqual(inspectDocsUpdateBatch(batch, []).issues, [
    {
      kind: "required-not-current",
      sourcePath: "docs/en/a.md",
      state: undefined,
      targetPath: "docs/zh/a.md",
    },
  ]);
});

test("removed page blocks while either target or record remains", () => {
  const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
  const entries = [
    inspection("docs/en/removed.md", "removed-source", {
      record: true,
      status: "removed",
    }),
  ];

  assert.deepEqual(
    inspectDocsUpdateBatch(batch, entries).issues.map((issue) => issue.kind),
    ["removed-record-present", "removed-target-present"],
  );
});

test("removed page is complete only when its record and target are absent", () => {
  const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
  const entries = [
    inspection("docs/en/removed.md", "removed-source", { status: "removed" }),
  ];

  const report = inspectDocsUpdateBatch(batch, entries, new Set());

  assert.equal(report.complete, true);
  assert.deepEqual(report.issues, []);
  assert.deepEqual(report.removedSourcePaths, ["docs/en/removed.md"]);
});

test("explicit target presence blocks a removed page without a record", () => {
  const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
  const entries = [
    inspection("docs/en/removed.md", "removed-source", { status: "removed" }),
  ];

  assert.deepEqual(
    inspectDocsUpdateBatch(
      batch,
      entries,
      new Set(["docs/zh/removed.md"]),
    ).issues,
    [
      {
        kind: "removed-target-present",
        sourcePath: "docs/en/removed.md",
        targetPath: "docs/zh/removed.md",
      },
    ],
  );
});

test("loadDocsUpdateBatch accepts the exact release contract", async () => {
  const batch = release({
    added: [releaseEntry("docs/en/a.md")],
    modified: [releaseEntry("docs/en/b.md")],
    removed: [releaseEntry("docs/en/c.md")],
  });
  await withBatchFile(batch, async (path) => {
    assert.deepEqual(await loadDocsUpdateBatch(path), batch);
  });
});

test("loadDocsUpdateBatch rejects unknown keys at every level", async () => {
  await withBatchFile({ ...release(), unexpected: true }, async (path) => {
    await assert.rejects(loadDocsUpdateBatch(path), /未知字段/u);
  });
  await withBatchFile(
    {
      ...release(),
      added: [{ ...releaseEntry("docs/en/a.md"), unexpected: true }],
    },
    async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path), /未知字段/u);
    },
  );
});

test("loadDocsUpdateBatch rejects unsupported release shapes", async () => {
  const cases: unknown[] = [
    null,
    [],
    { ...release(), added: {} },
    { ...release(), modified: [null] },
    { ...release(), removed: ["docs/en/a.md"] },
    { ...release(), id: 1 },
    { ...release(), generatedAt: null },
    { ...release(), added: [{ ...releaseEntry("docs/en/a.md"), title: "" }] },
    { ...release(), added: [{ ...releaseEntry("docs/en/a.md"), route: 1 }] },
  ];
  for (const value of cases) {
    await withBatchFile(value, async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path));
    });
  }
});

test("loadDocsUpdateBatch rejects invalid timestamps and mismatched ids", async () => {
  for (const batch of [
    release({ generatedAt: "not-a-time" }),
    release({ generatedAt: "2026-02-30T00:00:00Z" }),
    release({ generatedAt: "2026-09-06T08:00:00+08:00" }),
    release({ id: "another-batch" }),
  ]) {
    await withBatchFile(batch, async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path), /时间|id/u);
    });
  }
});

test("loadDocsUpdateBatch rejects paths outside docs/en Markdown articles", async () => {
  for (const path of [
    "docs/zh/a.md",
    "docs/en/a.txt",
    "docs/en/../a.md",
    "/docs/en/a.md",
    "docs\\en\\a.md",
  ]) {
    await withBatchFile(
      release({ added: [{ ...releaseEntry("docs/en/a.md"), path }] }),
      async (batchPath) => {
        await assert.rejects(
          loadDocsUpdateBatch(batchPath),
          /Markdown|path|路径/u,
        );
      },
    );
  }
});

test("loadDocsUpdateBatch rejects invalid source URLs and routes", async () => {
  for (const entry of [
    { ...releaseEntry("docs/en/a.md"), sourceUrl: "not-a-url" },
    {
      ...releaseEntry("docs/en/a.md"),
      sourceUrl: "http://developers.openai.com/a.md",
    },
    {
      ...releaseEntry("docs/en/a.md"),
      sourceUrl: "https://example.com/a.md",
    },
    {
      ...releaseEntry("docs/en/a.md"),
      sourceUrl: "https://developers.openai.com/a.md?x=1",
    },
    { ...releaseEntry("docs/en/a.md"), route: "/different" },
  ]) {
    await withBatchFile(release({ added: [entry] }), async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path), /sourceUrl|route|URL/u);
    });
  }
});

test("loadDocsUpdateBatch rejects duplicate paths and source URLs across sections", async () => {
  const samePath = releaseEntry("docs/en/a.md");
  await withBatchFile(
    release({ added: [samePath], modified: [{ ...samePath }] }),
    async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path), /path 重复/u);
    },
  );

  const sameUrl = releaseEntry("docs/en/a.md");
  await withBatchFile(
    release({
      added: [sameUrl],
      removed: [
        {
          ...releaseEntry("docs/en/b.md"),
          sourceUrl: sameUrl.sourceUrl,
          route: sameUrl.route,
        },
      ],
    }),
    async (path) => {
      await assert.rejects(loadDocsUpdateBatch(path), /sourceUrl 重复/u);
    },
  );
});

test("requiredSourcePaths validates runtime batch values fail closed", () => {
  const invalid = release({
    added: [{ ...releaseEntry("docs/en/a.md"), path: "../outside.md" }],
  });
  assert.throws(() => requiredSourcePaths(invalid), /Markdown|path|路径/u);
});

function workspaceAt(
  repositoryRoot: string,
  entries: TranslationPageInspection[],
): TranslationWorkspaceSnapshot {
  return {
    config: {
      glossaryPath: "scripts/translation/glossary.zh-CN.json",
      priorityPath: "scripts/translation/priority.zh-CN.json",
      promptPath: "scripts/translation/prompt.zh-CN.md",
      provider: {
        apiKeyEnv: "DEEPSEEK_API_KEY",
        id: "deepseek",
        model: "deepseek-chat",
      },
      schemaVersion: 2,
      sourceManifestPath: "docs/en/.source-manifest.json",
      sourceRoot: "docs/en",
      targetLanguage: "zh-CN",
      targetRoot: "docs/zh",
      translationManifestPath: "docs/zh/.translation-manifest.json",
    },
    configPath: "scripts/translation.config.json",
    entries,
    glossary: { preserve: [], schemaVersion: 1, terms: {} },
    policySha256: "d".repeat(64),
    prompt: "Translate accurately.",
    repositoryRoot,
    reviewNotes: { pages: {}, schemaVersion: 1 },
    targetLanguage: "zh-CN",
    translationManifest: {
      pages: {},
      schemaVersion: 1,
      targetLanguage: "zh-CN",
    },
  };
}

test("workspace consistency detects an existing removed target with lstat", async () => {
  const root = await mkdtemp(join(tmpdir(), "docs-update-workspace-"));
  try {
    await mkdir(join(root, "docs/zh"), { recursive: true });
    await writeFile(join(root, "docs/zh/removed.md"), "译文\n");
    const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
    const entries = [
      inspection("docs/en/removed.md", "removed-source", { status: "removed" }),
    ];

    assert.deepEqual(
      (await inspectDocsUpdateBatchWorkspace(batch, workspaceAt(root, entries)))
        .issues,
      [
        {
          kind: "removed-target-present",
          sourcePath: "docs/en/removed.md",
          targetPath: "docs/zh/removed.md",
        },
      ],
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("workspace consistency preserves a custom target mapping without an inspection entry", async () => {
  const root = await mkdtemp(join(tmpdir(), "docs-update-workspace-"));
  try {
    await mkdir(join(root, "translations/zh"), { recursive: true });
    await writeFile(join(root, "translations/zh/removed.md"), "译文\n");
    const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
    const workspace = workspaceAt(root, []);
    workspace.config.targetRoot = "translations/zh";

    assert.deepEqual(
      (await inspectDocsUpdateBatchWorkspace(batch, workspace)).issues,
      [
        {
          kind: "removed-target-present",
          sourcePath: "docs/en/removed.md",
          targetPath: "translations/zh/removed.md",
        },
      ],
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("workspace consistency refuses symlink and non-file removed targets", async () => {
  for (const targetKind of ["symlink", "directory"] as const) {
    const root = await mkdtemp(join(tmpdir(), "docs-update-workspace-"));
    const outside = await mkdtemp(join(tmpdir(), "docs-update-outside-"));
    try {
      await mkdir(join(root, "docs/zh"), { recursive: true });
      const target = join(root, "docs/zh/removed.md");
      if (targetKind === "symlink") {
        await symlink(join(outside, "missing.md"), target);
      } else {
        await mkdir(target);
      }
      const batch = release({ removed: [releaseEntry("docs/en/removed.md")] });
      const entries = [
        inspection("docs/en/removed.md", "removed-source", {
          status: "removed",
        }),
      ];

      await assert.rejects(
        inspectDocsUpdateBatchWorkspace(batch, workspaceAt(root, entries)),
        /符号链接或非文件/u,
      );
    } finally {
      await rm(root, { force: true, recursive: true });
      await rm(outside, { force: true, recursive: true });
    }
  }
});
