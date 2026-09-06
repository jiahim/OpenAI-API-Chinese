import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

import { parseCliOptions } from "../translate-docs.ts";

const REPOSITORY_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const SOURCE_URL = "https://developers.openai.com/api/docs/long-page.md";
const SOURCE_PATH = "docs/en/api/docs/long-page.md";
const TARGET_PATH = "docs/zh/api/docs/long-page.md";
const SECOND_SOURCE_URL = "https://developers.openai.com/api/docs/second-page.md";
const SECOND_SOURCE_PATH = "docs/en/api/docs/second-page.md";
const SECOND_TARGET_PATH = "docs/zh/api/docs/second-page.md";

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

async function createCliFixture(source: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "translation-auto-"));
  await mkdir(join(root, "scripts"), { recursive: true });
  await cp(
    join(REPOSITORY_ROOT, "scripts/translate-docs.ts"),
    join(root, "scripts/translate-docs.ts"),
  );
  await cp(
    join(REPOSITORY_ROOT, "scripts/translation"),
    join(root, "scripts/translation"),
    { recursive: true },
  );
  await cp(
    join(REPOSITORY_ROOT, "scripts/docs-update-batch.ts"),
    join(root, "scripts/docs-update-batch.ts"),
  );
  await symlink(join(REPOSITORY_ROOT, "node_modules"), join(root, "node_modules"));
  await mkdir(join(root, "docs/en/api/docs"), { recursive: true });
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
      priorityPath: "scripts/translation/priority.zh-CN.json",
      promptPath: "scripts/translation/prompt.zh-CN.md",
      provider: {
        apiKeyEnv: "DEEPSEEK_API_KEY",
        id: "deepseek",
        model: "deepseek-chat",
      },
      reviewNotesPath: "scripts/translation/review-notes.zh-CN.json",
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
    JSON.stringify({ preserve: [], schemaVersion: 1, terms: {} }),
  );
  await writeFile(
    join(root, "scripts/translation/priority.zh-CN.json"),
    JSON.stringify({ schemaVersion: 1, sourcePaths: [SOURCE_PATH] }),
  );
  await writeFile(
    join(root, "scripts/translation/prompt.zh-CN.md"),
    "Translate accurately.",
  );
  await writeFile(
    join(root, "scripts/translation/review-notes.zh-CN.json"),
    JSON.stringify({ pages: {}, schemaVersion: 1 }),
  );
  return root;
}

function releaseEntry(sourcePath: string) {
  const sourceUrl =
    sourcePath === SOURCE_PATH ? SOURCE_URL : SECOND_SOURCE_URL;
  const pathname = new URL(sourceUrl).pathname;
  return {
    path: sourcePath,
    route: pathname.replace(/\.md$/u, ""),
    sourceUrl,
    title: sourcePath,
  };
}

async function exists(path: string): Promise<boolean> {
  return access(path).then(
    () => true,
    () => false,
  );
}

interface BatchFixtureOptions {
  characterBudget: number;
  providerFailure?: boolean;
  removed?: string[];
  required?: string | string[];
}

interface BatchFixtureRun {
  error: unknown;
  exitCode: number | undefined;
  providerCalls: number;
  removedTargetExistedAtProviderCall: boolean | undefined;
  result: {
    complete: boolean;
    issues: Array<{ sourcePath: string }>;
    removed: string[];
    schemaVersion: number;
    stopReason: string | null;
    translated: string[];
  };
  root: string;
}

async function withBatchFixture(
  options: BatchFixtureOptions,
  verify: (run: BatchFixtureRun) => Promise<void> | void,
): Promise<void> {
  const root = await createCliFixture("# First\n");
  await addSecondPage(root, "# Second\n");
  const required =
    typeof options.required === "string"
      ? [options.required]
      : (options.required ?? []);
  const removed = options.removed ?? [];
  const releasePath = join(root, "release.json");
  const resultPath = join(root, ".tmp/translation-result.json");
  await writeFile(
    releasePath,
    JSON.stringify({
      added: required.map(releaseEntry),
      generatedAt: "2026-09-06T00:00:00Z",
      id: "2026-09-06T00-00-00-000Z",
      modified: [],
      removed: removed.map(releaseEntry),
    }),
  );

  if (removed.length > 0) {
    const manifestPath = join(root, "docs/en/.source-manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    for (const sourcePath of removed) {
      const sourceUrl = releaseEntry(sourcePath).sourceUrl;
      manifest.pages[sourceUrl].status = "removed";
    }
    await writeFile(manifestPath, JSON.stringify(manifest));
    await mkdir(join(root, "docs/zh/api/docs"), { recursive: true });
    const target = "# Existing translation\n";
    await writeFile(join(root, TARGET_PATH), target);
    await writeFile(
      join(root, "docs/zh/.translation-manifest.json"),
      JSON.stringify({
        pages: {
          [SOURCE_URL]: {
            policySha256: "b".repeat(64),
            reviewStatus: "machine",
            sourcePath: SOURCE_PATH,
            sourceSha256: sha256("# First\n"),
            sourceUrl: SOURCE_URL,
            targetPath: TARGET_PATH,
            targetSha256: sha256(target),
            translatedAt: "2026-09-06T00:00:00Z",
          },
        },
        schemaVersion: 1,
        targetLanguage: "zh-CN",
      }),
    );
  }

  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.DEEPSEEK_API_KEY;
  let providerCalls = 0;
  let removedTargetExistedAtProviderCall: boolean | undefined;
  globalThis.fetch = (async (_input, init) => {
    providerCalls += 1;
    if (removed.includes(SOURCE_PATH)) {
      removedTargetExistedAtProviderCall = await exists(join(root, TARGET_PATH));
    }
    if (options.providerFailure) {
      return Response.json(
        { error: { message: "fixture provider failure" } },
        { status: 401 },
      );
    }
    const request = JSON.parse(String(init?.body));
    const user = JSON.parse(request.messages[1].content);
    return Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              translations: user.items.map(
                (item: { id: string; text: string }) => ({
                  id: item.id,
                  text: item.text === "First" ? "第一" : "第二",
                }),
              ),
            }),
          },
        },
      ],
    });
  }) as typeof fetch;
  process.env.DEEPSEEK_API_KEY = "test-secret";

  try {
    const moduleUrl = `${pathToFileURL(join(root, "scripts/translate-docs.ts")).href}?${randomUUID()}`;
    const translationCli = await import(moduleUrl);
    let exitCode: number | undefined;
    let error: unknown;
    try {
      exitCode = await translationCli.main([
        "batch",
        "--config",
        "scripts/translation.config.json",
        "--release",
        releasePath,
        "--result",
        resultPath,
        "--limit",
        "100",
        "--max-batches",
        "100",
        "--max-characters",
        String(options.characterBudget),
        "--time-budget-minutes",
        "140",
      ]);
    } catch (caught) {
      error = caught;
    }
    const result = JSON.parse(await readFile(resultPath, "utf8"));
    await verify({
      error,
      exitCode,
      providerCalls,
      removedTargetExistedAtProviderCall,
      result,
      root,
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) {
      delete process.env.DEEPSEEK_API_KEY;
    } else {
      process.env.DEEPSEEK_API_KEY = originalApiKey;
    }
    await rm(root, { force: true, recursive: true });
  }
}

test("batch requires release and result paths", () => {
  assert.throws(
    () => parseCliOptions(["batch", "--limit", "100"]),
    /--release.*--result/u,
  );
});

test("batch rejects auto-incompatible selection and commit options", () => {
  assert.throws(
    () =>
      parseCliOptions([
        "batch",
        "--release",
        "release.json",
        "--result",
        "result.json",
        "--limit",
        "100",
        "--match",
        "page",
      ]),
    /--match/u,
  );
  assert.throws(
    () =>
      parseCliOptions([
        "batch",
        "--release",
        "release.json",
        "--result",
        "result.json",
        "--limit",
        "100",
        "--commit",
      ]),
    /--commit/u,
  );
});

test("required batch page runs before an older stale backlog page", async () => {
  await withBatchFixture(
    { characterBudget: 8, required: SECOND_SOURCE_PATH },
    async ({ error, exitCode, providerCalls, result, root }) => {
      assert.equal(error, undefined);
      assert.equal(exitCode, 0);
      assert.equal(providerCalls, 1);
      assert.deepEqual(result.translated, [SECOND_SOURCE_PATH]);
      assert.equal(result.complete, false);
      assert.equal(result.stopReason, "character-budget");
      assert.equal(await exists(join(root, SECOND_TARGET_PATH)), true);
      assert.equal(await exists(join(root, TARGET_PATH)), false);
    },
  );
});

test("budget stop writes an incomplete successful result", async () => {
  await withBatchFixture(
    {
      characterBudget: 5,
      required: [SOURCE_PATH, SECOND_SOURCE_PATH],
    },
    ({ error, exitCode, result }) => {
      assert.equal(error, undefined);
      assert.equal(exitCode, 0);
      assert.equal(result.complete, false);
      assert.equal(result.stopReason, "character-budget");
      assert.match(result.issues[0]?.sourcePath ?? "", /second-page/u);
    },
  );
});

test("batch removes released pages before inspecting completion", async () => {
  await withBatchFixture(
    { characterBudget: 5, removed: [SOURCE_PATH] },
    async ({
      error,
      exitCode,
      providerCalls,
      removedTargetExistedAtProviderCall,
      result,
      root,
    }) => {
      assert.equal(error, undefined);
      assert.equal(exitCode, 0);
      assert.equal(providerCalls, 1);
      assert.equal(removedTargetExistedAtProviderCall, false);
      assert.deepEqual(result.removed, [SOURCE_PATH]);
      assert.equal(result.complete, true);
      assert.equal(await exists(join(root, TARGET_PATH)), false);
      const manifest = JSON.parse(
        await readFile(join(root, "docs/zh/.translation-manifest.json"), "utf8"),
      );
      assert.equal(manifest.pages[SOURCE_URL], undefined);
    },
  );
});

test("terminal page error persists an incomplete result before rejection", async () => {
  await withBatchFixture(
    {
      characterBudget: 100,
      providerFailure: true,
      required: SOURCE_PATH,
    },
    ({ error, exitCode, result }) => {
      assert.match(error instanceof Error ? error.message : "", /最终失败/u);
      assert.equal(exitCode, undefined);
      assert.equal(result.complete, false);
      assert.equal(result.stopReason, null);
      assert.deepEqual(result.translated, []);
      assert.equal(result.schemaVersion, 1);
      assert.equal(result.issues[0]?.sourcePath, SOURCE_PATH);
    },
  );
});

async function addSecondPage(root: string, source: string): Promise<void> {
  await writeFile(join(root, SECOND_SOURCE_PATH), source);
  const manifestPath = join(root, "docs/en/.source-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.pages[SECOND_SOURCE_URL] = {
    localPath: SECOND_SOURCE_PATH,
    section: "guides",
    sha256: sha256(source),
    sourceUrl: SECOND_SOURCE_URL,
    status: "active",
  };
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(
    join(root, "scripts/translation/priority.zh-CN.json"),
    JSON.stringify({
      schemaVersion: 1,
      sourcePaths: [SOURCE_PATH, SECOND_SOURCE_PATH],
    }),
  );
}

test("auto translates a page larger than 20,000 characters through semantic batches", async () => {
  const source = `# Hello\n\n\`\`\`text\n${"x".repeat(21_000)}\n\`\`\`\n`;
  const root = await createCliFixture(source);
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.DEEPSEEK_API_KEY;
  let providerCalls = 0;
  globalThis.fetch = (async () => {
    providerCalls += 1;
    return Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              translations: [
                { id: "markdown-1-2-7", text: "你好" },
              ],
            }),
          },
        },
      ],
    });
  }) as typeof fetch;
  process.env.DEEPSEEK_API_KEY = "test-secret";

  try {
    const moduleUrl = `${pathToFileURL(join(root, "scripts/translate-docs.ts")).href}?${randomUUID()}`;
    const translationCli = await import(moduleUrl);
    const exitCode = await translationCli.main([
      "auto",
      "--config",
      "scripts/translation.config.json",
      "--limit",
      "100",
    ]);
    const translated = await readFile(join(root, TARGET_PATH), "utf8").catch(
      () => undefined,
    );

    assert.equal(exitCode, 0);
    assert.equal(providerCalls, 1);
    assert.equal(translated, source.replace("Hello", "你好"));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) {
      delete process.env.DEEPSEEK_API_KEY;
    } else {
      process.env.DEEPSEEK_API_KEY = originalApiKey;
    }
    await rm(root, { force: true, recursive: true });
  }
});

test("auto stops cleanly before a second page exceeds its semantic budget", async () => {
  const root = await createCliFixture("# First\n");
  await addSecondPage(root, "# Second\n");
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.DEEPSEEK_API_KEY;
  let providerCalls = 0;
  globalThis.fetch = (async (_input, init) => {
    providerCalls += 1;
    const request = JSON.parse(String(init?.body));
    const user = JSON.parse(request.messages[1].content);
    return Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              translations: user.items.map((item: { id: string; text: string }) => ({
                id: item.id,
                text: item.text === "First" ? "第一" : "第二",
              })),
            }),
          },
        },
      ],
    });
  }) as typeof fetch;
  process.env.DEEPSEEK_API_KEY = "test-secret";

  try {
    const moduleUrl = `${pathToFileURL(join(root, "scripts/translate-docs.ts")).href}?${randomUUID()}`;
    const translationCli = await import(moduleUrl);
    const exitCode = await translationCli.main([
      "auto",
      "--config",
      "scripts/translation.config.json",
      "--limit",
      "100",
      "--max-batches",
      "100",
      "--max-characters",
      "5",
      "--time-budget-minutes",
      "140",
    ]);
    const firstTarget = await readFile(join(root, TARGET_PATH), "utf8");
    const secondTarget = await readFile(join(root, SECOND_TARGET_PATH), "utf8").catch(
      () => undefined,
    );

    assert.equal(exitCode, 0);
    assert.equal(providerCalls, 1);
    assert.equal(firstTarget, "# 第一\n");
    assert.equal(secondTarget, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) {
      delete process.env.DEEPSEEK_API_KEY;
    } else {
      process.env.DEEPSEEK_API_KEY = originalApiKey;
    }
    await rm(root, { force: true, recursive: true });
  }
});
