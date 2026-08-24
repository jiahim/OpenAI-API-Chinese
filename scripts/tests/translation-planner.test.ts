import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  rm,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  buildTranslationStatusReport,
  classifyTranslationPage,
  mirroredTranslationPath,
} from "../translation/planner.ts";
import type {
  SourcePageSnapshot,
  TranslationPageRecord,
  TranslationPageState,
} from "../translation/types.ts";
import { parseCliOptions } from "../translate-docs.ts";

const SOURCE_URL = "https://developers.openai.com/api/docs/quickstart.md";
const SOURCE_PATH = "docs/en/api/docs/quickstart.md";
const TARGET_PATH = "docs/zh/api/docs/quickstart.md";
const SOURCE_CONTENT = "# Quickstart\n";
const SOURCE_HASH = sha256(SOURCE_CONTENT);
const TARGET_CONTENT = "# 快速开始\n";

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function sourcePage(
  overrides: Partial<SourcePageSnapshot> = {},
): SourcePageSnapshot {
  return {
    section: "guides",
    sha256: SOURCE_HASH,
    sourcePath: SOURCE_PATH,
    sourceUrl: SOURCE_URL,
    status: "active",
    ...overrides,
  };
}

function translationRecord(
  overrides: Partial<TranslationPageRecord> = {},
): TranslationPageRecord {
  return {
    policySha256: "b".repeat(64),
    reviewStatus: "machine",
    sourcePath: SOURCE_PATH,
    sourceSha256: SOURCE_HASH,
    sourceUrl: SOURCE_URL,
    targetPath: TARGET_PATH,
    targetSha256: sha256(TARGET_CONTENT),
    translatedAt: "2026-08-24T00:00:00Z",
    ...overrides,
  };
}

async function createFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "translation-planner-"));
  await mkdir(join(root, "docs/en"), { recursive: true });
  await mkdir(join(root, "docs/en/api/docs"), { recursive: true });
  await mkdir(join(root, "scripts/translation"), { recursive: true });
  await writeFile(
    join(root, "scripts/translation.config.json"),
    JSON.stringify({
      glossaryPath: "scripts/translation/glossary.zh-CN.json",
      promptPath: "scripts/translation/prompt.zh-CN.md",
      sourceManifestPath: "docs/en/.source-manifest.json",
      sourceRoot: "docs/en",
      targetLanguage: "zh-CN",
      targetRoot: "docs/zh",
      translationManifestPath: "docs/zh/.translation-manifest.json",
    }),
  );
  await writeFile(
    join(root, "scripts/translation/glossary.zh-CN.json"),
    JSON.stringify({ preserve: ["OpenAI"], schemaVersion: 1, terms: {} }),
  );
  await writeFile(
    join(root, "scripts/translation/prompt.zh-CN.md"),
    "translate accurately",
  );
  await writeFile(join(root, SOURCE_PATH), SOURCE_CONTENT);
  await writeSourceManifest(root, [sourcePage()]);
  return root;
}

async function writeSourceManifest(
  root: string,
  pages: SourcePageSnapshot[],
): Promise<void> {
  await writeFile(
    join(root, "docs/en/.source-manifest.json"),
    JSON.stringify({
      indexes: {},
      pages: Object.fromEntries(
        pages.map((page) => [
          page.sourceUrl,
          {
            localPath: page.sourcePath,
            section: page.section,
            sha256: page.sha256,
            sourceUrl: page.sourceUrl,
            status: page.status,
          },
        ]),
      ),
      schemaVersion: 1,
    }),
  );
}

async function writeTranslationManifest(
  root: string,
  pages: Record<string, TranslationPageRecord>,
): Promise<void> {
  await mkdir(join(root, "docs/zh"), { recursive: true });
  await writeFile(
    join(root, "docs/zh/.translation-manifest.json"),
    JSON.stringify({ pages, schemaVersion: 1, targetLanguage: "zh-CN" }),
  );
}

async function writeTarget(root: string, content = TARGET_CONTENT): Promise<void> {
  await mkdir(join(root, "docs/zh/api/docs"), { recursive: true });
  await writeFile(join(root, TARGET_PATH), content);
}

function classifiedState(input: {
  policySha256?: string;
  record?: TranslationPageRecord;
  source?: SourcePageSnapshot;
  targetSha256?: string;
}): TranslationPageState {
  return classifyTranslationPage({
    policySha256: input.policySha256 ?? "b".repeat(64),
    record: input.record,
    source: input.source ?? sourcePage(),
    targetSha256: input.targetSha256,
  });
}

test("mirroredTranslationPath preserves hierarchy and rejects unsafe paths", () => {
  assert.equal(
    mirroredTranslationPath(SOURCE_PATH, "docs/en", "docs/zh"),
    TARGET_PATH,
  );
  assert.throws(
    () => mirroredTranslationPath("docs/elsewhere/page.md", "docs/en", "docs/zh"),
    /必须位于 docs\/en 内/,
  );
  assert.throws(
    () => mirroredTranslationPath("docs/en/../secret.md", "docs/en", "docs/zh"),
    /必须位于 docs\/en 内/,
  );
  assert.throws(
    () => mirroredTranslationPath("docs/en/page.txt", "docs/en", "docs/zh"),
    /必须是 Markdown/,
  );
});

test("classifyTranslationPage covers every non-destructive state", () => {
  const record = translationRecord();
  const targetHash = record.targetSha256;
  assert.equal(classifiedState({}), "pending");
  assert.equal(classifiedState({ targetSha256: targetHash }), "untracked-target");
  assert.equal(classifiedState({ record }), "missing-target");
  assert.equal(
    classifiedState({ record, targetSha256: "c".repeat(64) }),
    "modified-target",
  );
  assert.equal(
    classifiedState({
      record,
      source: sourcePage({ sha256: "d".repeat(64) }),
      targetSha256: targetHash,
    }),
    "stale-source",
  );
  assert.equal(
    classifiedState({
      policySha256: "e".repeat(64),
      record,
      targetSha256: targetHash,
    }),
    "stale-policy",
  );
  assert.equal(classifiedState({ record, targetSha256: targetHash }), "current");
  assert.equal(
    classifiedState({
      record,
      source: sourcePage({ status: "removed" }),
      targetSha256: targetHash,
    }),
    "removed-source",
  );
});

test("buildTranslationStatusReport starts with pending and protects untracked targets", async () => {
  const root = await createFixture();
  try {
    let report = await buildTranslationStatusReport(root);
    assert.equal(report.entries.length, 1);
    assert.equal(report.entries[0]?.state, "pending");
    assert.equal(report.entries[0]?.targetPath, TARGET_PATH);

    await writeTarget(root);
    report = await buildTranslationStatusReport(root);
    assert.equal(report.entries[0]?.state, "untracked-target");
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("buildTranslationStatusReport detects current, stale policy, modified, and missing targets", async () => {
  const root = await createFixture();
  try {
    await writeTarget(root);
    const initial = await buildTranslationStatusReport(root);
    const record = translationRecord({ policySha256: initial.policySha256 });
    await writeTranslationManifest(root, { [SOURCE_URL]: record });

    let report = await buildTranslationStatusReport(root);
    assert.equal(report.entries[0]?.state, "current");

    await writeFile(
      join(root, "scripts/translation/prompt.zh-CN.md"),
      "changed policy",
    );
    report = await buildTranslationStatusReport(root);
    assert.equal(report.entries[0]?.state, "stale-policy");

    await writeTarget(root, "人工修改\n");
    report = await buildTranslationStatusReport(root);
    assert.equal(report.entries[0]?.state, "modified-target");

    await unlink(join(root, TARGET_PATH));
    report = await buildTranslationStatusReport(root);
    assert.equal(report.entries[0]?.state, "missing-target");
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("translation records without an active source remain visible as removed-source", async () => {
  const root = await createFixture();
  try {
    await writeSourceManifest(root, []);
    await writeTranslationManifest(root, { [SOURCE_URL]: translationRecord() });
    const report = await buildTranslationStatusReport(root);
    assert.equal(report.entries.length, 1);
    assert.equal(report.entries[0]?.state, "removed-source");
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("planner refuses dirty English sources and unsafe translation paths", async () => {
  const root = await createFixture();
  try {
    await writeFile(join(root, SOURCE_PATH), "本地脏改动\n");
    await assert.rejects(
      buildTranslationStatusReport(root),
      /与 source manifest SHA 不一致/,
    );

    await writeFile(join(root, SOURCE_PATH), SOURCE_CONTENT);
    await writeTranslationManifest(root, {
      [SOURCE_URL]: translationRecord({ targetPath: "docs/outside.md" }),
    });
    await assert.rejects(
      buildTranslationStatusReport(root),
      /targetPath 不符合镜像规则/,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("translation CLI parses filters without changing defaults", () => {
  assert.deepEqual(parseCliOptions(["status"]), {
    command: "status",
    configPath: "scripts/translation.config.json",
    matches: [],
    section: "all",
  });
  assert.deepEqual(
    parseCliOptions([
      "plan",
      "--",
      "--section",
      "guides",
      "--match",
      "QuickStart",
      "--limit",
      "5",
    ]),
    {
      command: "plan",
      configPath: "scripts/translation.config.json",
      limit: 5,
      matches: ["quickstart"],
      section: "guides",
    },
  );
  assert.throws(() => parseCliOptions(["translate"]), /plan 或 status/);
  assert.throws(
    () => parseCliOptions(["plan", "--limit", "0"]),
    /必须是正整数/,
  );
});
