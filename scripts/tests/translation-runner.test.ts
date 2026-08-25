import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  createEchoProvider,
  defineProvider,
  type TranslationProvider,
} from "@easy-translate/core";

import { loadTranslationWorkspace } from "../translation/planner.ts";
import {
  atomicWriteRepositoryFile,
  createTranslationQualityPolicy,
  reviewTranslationPage,
  runTranslationPage,
} from "../translation/runner.ts";
import type { MarkdownTranslationContext } from "../translation/markdown-adapter.ts";

const SOURCE_URL = "https://developers.openai.com/api/docs/quickstart.md";
const SOURCE_PATH = "docs/en/api/docs/quickstart.md";
const TARGET_PATH = "docs/zh/api/docs/quickstart.md";
const DEFAULT_SOURCE = "# Hello OpenAI\n\nRequest API data.\n";

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

async function createFixture(source = DEFAULT_SOURCE): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "translation-runner-"));
  await mkdir(join(root, "docs/en/api/docs"), { recursive: true });
  await mkdir(join(root, "scripts/translation"), { recursive: true });
  await writeFile(join(root, SOURCE_PATH), source);
  await writeFile(
    join(root, "docs/en/.source-manifest.json"),
    JSON.stringify({
      indexes: {},
      pages: {
        [SOURCE_URL]: {
          localPath: SOURCE_PATH,
          section: "guides",
          sha256: sha256(source),
          sourceUrl: SOURCE_URL,
          status: "active",
        },
      },
      schemaVersion: 1,
    }),
  );
  await writeFile(
    join(root, "scripts/translation.config.json"),
    JSON.stringify({
      glossaryPath: "scripts/translation/glossary.zh-CN.json",
      promptPath: "scripts/translation/prompt.zh-CN.md",
      provider: {
        apiKeyEnv: "DEEPSEEK_API_KEY",
        id: "deepseek",
        model: "deepseek-chat",
      },
      schemaVersion: 1,
      sourceManifestPath: "docs/en/.source-manifest.json",
      sourceRoot: "docs/en",
      targetLanguage: "zh-CN",
      targetRoot: "docs/zh",
      translationManifestPath: "docs/zh/.translation-manifest.json",
    }),
  );
  await writeFile(
    join(root, "scripts/translation/glossary.zh-CN.json"),
    JSON.stringify({
      preserve: ["OpenAI", "API"],
      schemaVersion: 1,
      terms: { Request: "请求" },
    }),
  );
  await writeFile(
    join(root, "scripts/translation/prompt.zh-CN.md"),
    "Translate accurately.",
  );
  return root;
}

function translatedProvider(): TranslationProvider<MarkdownTranslationContext> {
  return createEchoProvider((text) => {
    if (text === "Hello OpenAI") return "你好 OpenAI";
    if (text === "Request") return "请求";
    if (text === "Request API data.") return "请求 API 数据。";
    return text;
  });
}

test("runner simulates one page without writing a target or manifest", async () => {
  const root = await createFixture();
  try {
    const workspace = await loadTranslationWorkspace(root);
    const run = await runTranslationPage(workspace, SOURCE_URL, {
      commit: false,
      now: () => new Date("2026-08-24T12:00:00Z"),
      provider: translatedProvider(),
      useCheckpoint: false,
    });
    assert.equal(run.committed, false);
    assert.equal(run.rendered, "# 你好 OpenAI\n\n请求 API 数据。\n");
    assert.equal(run.record.translatedAt, "2026-08-24T12:00:00.000Z");
    await assert.rejects(readFile(join(root, TARGET_PATH)), /ENOENT/u);
    await assert.rejects(
      readFile(join(root, "docs/zh/.translation-manifest.json")),
      /ENOENT/u,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("runner commits the page first and a traceable manifest second", async () => {
  const root = await createFixture();
  try {
    const workspace = await loadTranslationWorkspace(root);
    const run = await runTranslationPage(workspace, SOURCE_URL, {
      commit: true,
      now: () => new Date("2026-08-24T12:00:00Z"),
      provider: translatedProvider(),
      useCheckpoint: false,
    });
    assert.equal(run.committed, true);
    assert.equal(await readFile(join(root, TARGET_PATH), "utf8"), run.rendered);
    const manifest = JSON.parse(
      await readFile(join(root, "docs/zh/.translation-manifest.json"), "utf8"),
    ) as { generatedAt: string; pages: Record<string, { targetSha256: string }> };
    assert.equal(manifest.generatedAt, "2026-08-24T12:00:00.000Z");
    assert.equal(manifest.pages[SOURCE_URL]?.targetSha256, sha256(run.rendered));

    const refreshed = await loadTranslationWorkspace(root);
    assert.equal(refreshed.entries[0]?.state, "current");
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("review adopts an intentional target edit and records reviewed status", async () => {
  const root = await createFixture();
  try {
    const workspace = await loadTranslationWorkspace(root);
    await runTranslationPage(workspace, SOURCE_URL, {
      commit: true,
      now: () => new Date("2026-08-24T12:00:00Z"),
      provider: translatedProvider(),
      useCheckpoint: false,
    });
    const reviewedContent = "# 你好 OpenAI\n\n人工审核后的请求 API 数据。\n";
    await writeFile(join(root, TARGET_PATH), reviewedContent);
    const modified = await loadTranslationWorkspace(root);
    assert.equal(modified.entries[0]?.state, "modified-target");
    const reviewed = await reviewTranslationPage(
      modified,
      SOURCE_URL,
      () => new Date("2026-08-24T13:00:00Z"),
    );
    assert.equal(reviewed.targetSha256, sha256(reviewedContent));
    const refreshed = await loadTranslationWorkspace(root);
    assert.equal(refreshed.entries[0]?.state, "current");
    assert.equal(refreshed.entries[0]?.record?.reviewStatus, "reviewed");
    assert.equal(
      refreshed.translationManifest.generatedAt,
      "2026-08-24T13:00:00.000Z",
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("review rejects manual edits that change protected Markdown structure", async () => {
  const root = await createFixture(
    "# Hello OpenAI\n\nRequest [API](https://example.com).\n",
  );
  try {
    const workspace = await loadTranslationWorkspace(root);
    await runTranslationPage(workspace, SOURCE_URL, {
      commit: true,
      provider: translatedProvider(),
      useCheckpoint: false,
    });
    const target = await readFile(join(root, TARGET_PATH), "utf8");
    await writeFile(
      join(root, TARGET_PATH),
      target.replace("https://example.com", "https://example.net"),
    );
    await assert.rejects(
      reviewTranslationPage(await loadTranslationWorkspace(root), SOURCE_URL),
      /改变了 Markdown 受保护结构/u,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("runner resumes from the last serialized checkpoint", async () => {
  const root = await createFixture("# One\n\nTwo.\n\nThree.\n");
  try {
    const workspace = await loadTranslationWorkspace(root);
    let firstCalls = 0;
    const interrupted = defineProvider<MarkdownTranslationContext>({
      async translateBatch(request) {
        firstCalls += 1;
        if (firstCalls === 2) throw new Error("simulated interruption");
        return request.items.map((item) => ({ id: item.id, text: item.text }));
      },
    });
    await assert.rejects(
      runTranslationPage(workspace, SOURCE_URL, {
        batchSize: 1,
        concurrency: 1,
        provider: interrupted,
        retry: 0,
      }),
      /simulated interruption/u,
    );

    let resumedCalls = 0;
    const resumed = defineProvider<MarkdownTranslationContext>({
      async translateBatch(request) {
        resumedCalls += 1;
        return request.items.map((item) => ({ id: item.id, text: item.text }));
      },
    });
    const run = await runTranslationPage(workspace, SOURCE_URL, {
      batchSize: 1,
      concurrency: 1,
      provider: resumed,
      retry: 0,
    });
    assert.equal(run.result.stats.fromCheckpointUnits, 1);
    assert.equal(resumedCalls, run.result.stats.uniqueUnits - 1);
    assert.equal(run.rendered, "# One\n\nTwo.\n\nThree.\n");
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test("runner blocks unsafe target states and repository symlink writes", async () => {
  const root = await createFixture();
  const outside = await mkdtemp(join(tmpdir(), "translation-runner-outside-"));
  try {
    await mkdir(join(root, "docs/zh/api/docs"), { recursive: true });
    await writeFile(join(root, TARGET_PATH), "人工译文\n");
    const workspace = await loadTranslationWorkspace(root);
    await assert.rejects(
      runTranslationPage(workspace, SOURCE_URL, {
        provider: translatedProvider(),
      }),
      /untracked-target 不允许自动翻译/u,
    );

    await symlink(outside, join(root, "unsafe"));
    await assert.rejects(
      atomicWriteRepositoryFile(root, "unsafe/page.md", "content", "测试文件"),
      /不能经过符号链接/u,
    );
    await assert.rejects(
      atomicWriteRepositoryFile(root, "docs/zh/../outside.md", "content", "测试文件"),
      /POSIX 相对路径/u,
    );
  } finally {
    await rm(root, { force: true, recursive: true });
    await rm(outside, { force: true, recursive: true });
  }
});

test("quality policy preserves glossary terms and placeholders", async () => {
  const policy = createTranslationQualityPolicy({
    preserve: ["OpenAI"],
    schemaVersion: 1,
    terms: { Request: "请求" },
  });
  const base = {
    item: {
      context: {} as MarkdownTranslationContext,
      id: "unit",
      text: "Request OpenAI for {{VALUE}} and $API_KEY",
    },
    plan: {
      document: { format: "markdown", id: "doc" },
      schemaVersion: 1 as const,
      units: [],
    },
    request: {
      items: [],
      targetLanguage: "zh-CN",
    },
  };
  assert.equal(
    await policy({
      ...base,
      translatedText: "请求 OpenAI 获取 {{VALUE}} 和 $API_KEY",
    }),
    undefined,
  );
  assert.equal(
    (
      await policy({
        ...base,
        translatedText: "请求系统获取 VALUE",
      })
    )?.issueCode,
    "translation.preserve_missing",
  );
  assert.equal(
    (
      await policy({
        ...base,
        translatedText: "请求 OpenAI 获取 {{OTHER}} 和 $API_KEY",
      })
    )?.issueCode,
    "translation.placeholder_changed",
  );
});
