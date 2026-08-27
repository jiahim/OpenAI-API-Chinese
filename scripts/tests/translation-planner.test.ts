import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  TranslationErrorCode,
  TranslationProviderError,
  TranslationResponseError,
} from "@easy-translate/core";

import {
  buildTranslationStatusReport,
  classifyTranslationPage,
  mirroredTranslationPath,
} from "../translation/planner.ts";
import type {
  SourcePageSnapshot,
  TranslationPageInspection,
  TranslationPageRecord,
  TranslationPageState,
} from "../translation/types.ts";
import {
  assertTranslationIntegrity,
  automaticTranslationCandidates,
  createProductionBatchRetryPolicy,
  parseCliOptions,
  shouldRetryProductionPage,
} from "../translate-docs.ts";
import { parseTranslationPriorityConfig } from "../translation/priority.ts";

const SOURCE_URL = "https://developers.openai.com/api/docs/quickstart.md";
const SOURCE_PATH = "docs/en/api/docs/quickstart.md";
const TARGET_PATH = "docs/zh/api/docs/quickstart.md";
const SOURCE_CONTENT = "# Quickstart\n";
const SOURCE_HASH = sha256(SOURCE_CONTENT);
const TARGET_CONTENT = "# 快速开始\n";

test("production retries one targeted correction but stops repeated quality failures", () => {
  const quality = new TranslationResponseError(
    TranslationErrorCode.ResponseQualityRejected,
    "必须保留术语：API",
    {
      details: {
        issueCode: "translation.preserve_missing",
        unitId: "markdown-54-4751-4880",
      },
    },
  );
  const otherQuality = new TranslationResponseError(
    TranslationErrorCode.ResponseQualityRejected,
    "必须保留术语：SDK",
    {
      details: {
        issueCode: "translation.preserve_missing",
        unitId: "markdown-55-4881-4900",
      },
    },
  );
  const malformed = new TranslationResponseError(
    TranslationErrorCode.ResponseInvalidContainer,
    "invalid JSON",
  );
  const network = new TranslationProviderError(
    TranslationErrorCode.ProviderNetwork,
    "network failure",
    { retryable: true },
  );
  const policy = createProductionBatchRetryPolicy();

  assert.equal(policy.shouldRetry?.(quality, 0), true);
  assert.equal(policy.shouldRetry?.(quality, 1), false);
  assert.equal(policy.shouldRetry?.(otherQuality, 1), true);
  assert.equal(policy.shouldRetry?.(malformed, 0), true);
  assert.equal(policy.shouldRetry?.(network, 0), true);
  assert.equal(shouldRetryProductionPage(quality), false);
  assert.equal(shouldRetryProductionPage(malformed), true);
  assert.equal(shouldRetryProductionPage(network), true);
});

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
      priorityPath: "scripts/translation/priority.zh-CN.json",
      promptPath: "scripts/translation/prompt.zh-CN.md",
      reviewNotesPath: "scripts/translation/review-notes.zh-CN.json",
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
  await writeFile(
    join(root, "scripts/translation/review-notes.zh-CN.json"),
    JSON.stringify({ pages: {}, schemaVersion: 1 }),
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
    /必须是仓库内的 POSIX 相对路径/,
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
      source: sourcePage({ sha256: "d".repeat(64), status: "removed" }),
      targetSha256: "c".repeat(64),
    }),
    "removed-source",
  );
  assert.equal(
    classifiedState({
      record,
      source: sourcePage({ sha256: "d".repeat(64) }),
      targetSha256: "c".repeat(64),
    }),
    "modified-target",
  );
  assert.equal(
    classifiedState({
      record,
      source: sourcePage({ sha256: "d".repeat(64) }),
    }),
    "missing-target",
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

test("planner requires a versioned config and keeps the source manifest under sourceRoot", async () => {
  const root = await createFixture();
  const configPath = join(root, "scripts/translation.config.json");
  const baseConfig = {
    glossaryPath: "scripts/translation/glossary.zh-CN.json",
    priorityPath: "scripts/translation/priority.zh-CN.json",
    promptPath: "scripts/translation/prompt.zh-CN.md",
    reviewNotesPath: "scripts/translation/review-notes.zh-CN.json",
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
  };
  try {
    await writeFile(configPath, JSON.stringify({ ...baseConfig, schemaVersion: 3 }));
    await assert.rejects(buildTranslationStatusReport(root), /schemaVersion 必须是 2/);

    await writeFile(
      configPath,
      JSON.stringify({
        ...baseConfig,
        sourceManifestPath: "scripts/source-manifest.json",
      }),
    );
    await assert.rejects(
      buildTranslationStatusReport(root),
      /英文 source manifest 必须位于 docs\/en 内/,
    );

    await writeFile(
      configPath,
      JSON.stringify({ ...baseConfig, unexpected: true }),
    );
    await assert.rejects(buildTranslationStatusReport(root), /包含未知字段：unexpected/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("planner rejects duplicate persisted paths and invalid manifest timestamps", async () => {
  const root = await createFixture();
  try {
    await writeSourceManifest(root, [
      sourcePage(),
      sourcePage({ sourceUrl: "https://developers.openai.com/api/docs/duplicate.md" }),
    ]);
    await assert.rejects(
      buildTranslationStatusReport(root),
      /localPath 重复/,
    );

    await writeSourceManifest(root, [sourcePage()]);
    await writeTranslationManifest(root, {
      [SOURCE_URL]: translationRecord({ translatedAt: "2026-02-30T00:00:00Z" }),
    });
    await assert.rejects(
      buildTranslationStatusReport(root),
      /translatedAt 必须是 UTC ISO 8601 时间/,
    );

    await writeTranslationManifest(root, {
      [SOURCE_URL]: translationRecord(),
      "https://developers.openai.com/api/docs/other.md": translationRecord({
        sourceUrl: "https://developers.openai.com/api/docs/other.md",
      }),
    });
    await assert.rejects(
      buildTranslationStatusReport(root),
      /targetPath 重复/,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("planner canonicalizes glossary ordering and rejects ambiguous glossary rules", async () => {
  const root = await createFixture();
  try {
    const glossaryPath = join(root, "scripts/translation/glossary.zh-CN.json");
    await writeFile(
      glossaryPath,
      JSON.stringify({
        preserve: ["OpenAI", "API"],
        schemaVersion: 1,
        terms: { endpoint: "端点", request: "请求" },
      }),
    );
    const first = await buildTranslationStatusReport(root);
    await writeFile(
      glossaryPath,
      JSON.stringify({
        terms: { request: "请求", endpoint: "端点" },
        schemaVersion: 1,
        preserve: ["API", "OpenAI"],
      }, null, 2),
    );
    const reordered = await buildTranslationStatusReport(root);
    assert.equal(reordered.policySha256, first.policySha256);

    await writeFile(
      glossaryPath,
      JSON.stringify({
        preserve: ["OpenAI"],
        schemaVersion: 1,
        terms: { OpenAI: "开放人工智能" },
      }),
    );
    await assert.rejects(buildTranslationStatusReport(root), /preserve 与 terms 冲突/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("planner includes the non-sensitive provider profile in policy identity", async () => {
  const root = await createFixture();
  try {
    const configPath = join(root, "scripts/translation.config.json");
    const original = JSON.parse(await readFile(configPath, "utf8")) as Record<
      string,
      unknown
    >;
    const first = await buildTranslationStatusReport(root);
    await writeFile(
      configPath,
      JSON.stringify({
        ...original,
        provider: {
          apiKeyEnv: "DEEPSEEK_API_KEY",
          id: "deepseek",
          model: "deepseek-reasoner",
        },
      }),
    );
    const changed = await buildTranslationStatusReport(root);
    assert.notEqual(changed.policySha256, first.policySha256);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("planner rejects repository paths that escape through symbolic links", async () => {
  const root = await createFixture();
  const outside = await mkdtemp(join(tmpdir(), "translation-outside-"));
  try {
    const promptPath = join(root, "scripts/translation/prompt.zh-CN.md");
    const outsidePrompt = join(outside, "prompt.md");
    await writeFile(outsidePrompt, "outside prompt");
    await unlink(promptPath);
    await symlink(outsidePrompt, promptPath);
    await assert.rejects(buildTranslationStatusReport(root), /符号链接不能指向仓库外/);

    await unlink(promptPath);
    await writeFile(promptPath, "translate accurately");
    await symlink(outside, join(root, "docs/zh"));
    await assert.rejects(buildTranslationStatusReport(root), /符号链接不能指向仓库外/);

    await writeSourceManifest(root, []);
    await assert.rejects(
      buildTranslationStatusReport(root),
      /符号链接不能指向仓库外/,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
    await rm(outside, { force: true, recursive: true });
  }
});

test("translation CLI parses filters without changing defaults", () => {
  assert.deepEqual(parseCliOptions(["status"]), {
    command: "status",
    commit: false,
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
      commit: false,
      configPath: "scripts/translation.config.json",
      limit: 5,
      matches: ["quickstart"],
      section: "guides",
    },
  );
  assert.throws(
    () => parseCliOptions(["translate"]),
    /auto、check、plan、review、run、simulate 或 status/,
  );
  assert.throws(
    () => parseCliOptions(["plan", "--limit", "0"]),
    /必须是正整数/,
  );
  assert.throws(
    () => parseCliOptions(["status", "--match", "quickstart"]),
    /不适用于 status/,
  );
  assert.deepEqual(
    parseCliOptions(["simulate", "--match", "quickstart", "--limit", "1"]),
    {
      command: "simulate",
      commit: false,
      configPath: "scripts/translation.config.json",
      limit: 1,
      matches: ["quickstart"],
      section: "all",
    },
  );
  assert.throws(
    () => parseCliOptions(["simulate", "--match", "quickstart"]),
    /--limit 1/,
  );
  assert.deepEqual(
    parseCliOptions(["run", "--match", "quickstart", "--limit", "1", "--commit"]),
    {
      command: "run",
      commit: true,
      configPath: "scripts/translation.config.json",
      limit: 1,
      matches: ["quickstart"],
      section: "all",
    },
  );
  assert.throws(() => parseCliOptions(["run", "--match", "quickstart"]), /--limit 1/);
  assert.throws(() => parseCliOptions(["plan", "--commit"]), /仅适用于 run/);
  assert.deepEqual(
    parseCliOptions(["review", "--match", "quickstart", "--limit", "1"]),
    {
      command: "review",
      commit: false,
      configPath: "scripts/translation.config.json",
      limit: 1,
      matches: ["quickstart"],
      section: "all",
    },
  );
  assert.deepEqual(parseCliOptions(["check"]), {
    command: "check",
    commit: false,
    configPath: "scripts/translation.config.json",
    matches: [],
    section: "all",
  });
  assert.deepEqual(parseCliOptions(["auto", "--limit", "10"]), {
    command: "auto",
    commit: false,
    configPath: "scripts/translation.config.json",
    limit: 10,
    matches: [],
    section: "all",
  });
  assert.throws(() => parseCliOptions(["auto"]), /--limit 10/u);
  assert.throws(
    () => parseCliOptions(["auto", "--limit", "10", "--match", "page"]),
    /不允许 --match/u,
  );
  assert.throws(() => parseCliOptions(["auto", "--limit", "1"]), /--limit 10/u);
});

test("automatic selection prioritizes stale work and integrity rejects target drift", () => {
  const base: Pick<TranslationPageInspection, "targetPath"> = {
    targetPath: "docs/zh/pending.md",
  };
  const entries: TranslationPageInspection[] = [
    { ...base, state: "pending" },
    { ...base, state: "stale-policy", targetPath: "docs/zh/policy.md" },
    { ...base, state: "stale-source", targetPath: "docs/zh/source.md" },
    { ...base, state: "modified-target", targetPath: "docs/zh/modified.md" },
  ];
  assert.deepEqual(
    automaticTranslationCandidates(entries).map((entry) => entry.state),
    ["stale-source", "stale-policy", "pending"],
  );
  assert.throws(
    () => assertTranslationIntegrity(entries),
    /modified-target:docs\/zh\/modified\.md/u,
  );
  assert.doesNotThrow(() => assertTranslationIntegrity(entries.slice(0, 3)));
});

test("automatic selection uses curated source order within the same state", () => {
  const fallback = sourcePage({
    sourcePath: "docs/en/api/docs/fallback.md",
    sourceUrl: "https://developers.openai.com/api/docs/fallback.md",
  });
  const preferred = sourcePage({
    sourcePath: "docs/en/api/docs/preferred.md",
    sourceUrl: "https://developers.openai.com/api/docs/preferred.md",
  });
  const stale = sourcePage({
    sourcePath: "docs/en/api/docs/stale.md",
    sourceUrl: "https://developers.openai.com/api/docs/stale.md",
  });
  const entries: TranslationPageInspection[] = [
    { source: fallback, state: "pending", targetPath: "docs/zh/api/docs/fallback.md" },
    {
      source: preferred,
      state: "pending",
      targetPath: "docs/zh/api/docs/preferred.md",
    },
    { source: stale, state: "stale-source", targetPath: "docs/zh/api/docs/stale.md" },
  ];

  assert.deepEqual(
    automaticTranslationCandidates(entries, "all", [preferred.sourcePath]).map(
      (entry) => entry.source?.sourcePath,
    ),
    [stale.sourcePath, preferred.sourcePath, fallback.sourcePath],
  );
});

test("translation priority config validates canonical unique source paths", () => {
  assert.deepEqual(
    parseTranslationPriorityConfig(
      {
        schemaVersion: 1,
        sourcePaths: ["docs/en/api/docs/quickstart.md"],
      },
      "docs/en",
    ),
    {
      schemaVersion: 1,
      sourcePaths: ["docs/en/api/docs/quickstart.md"],
    },
  );
  assert.throws(
    () =>
      parseTranslationPriorityConfig(
        {
          schemaVersion: 1,
          sourcePaths: [
            "docs/en/api/docs/quickstart.md",
            "docs/en/api/docs/quickstart.md",
          ],
        },
        "docs/en",
      ),
    /不能包含重复路径/u,
  );
  assert.throws(
    () =>
      parseTranslationPriorityConfig(
        { schemaVersion: 1, sourcePaths: ["docs/outside.md"] },
        "docs/en",
      ),
    /sourcePath 无效/u,
  );
  assert.throws(
    () =>
      parseTranslationPriorityConfig(
        {
          schemaVersion: 1,
          sourcePaths: ["docs/en/api/docs/quickstart.md"],
          unexpected: true,
        },
        "docs/en",
      ),
    /包含未知字段：unexpected/u,
  );
});
