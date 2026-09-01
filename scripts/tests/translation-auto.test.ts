import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import {
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

const REPOSITORY_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const SOURCE_URL = "https://developers.openai.com/api/docs/long-page.md";
const SOURCE_PATH = "docs/en/api/docs/long-page.md";
const TARGET_PATH = "docs/zh/api/docs/long-page.md";

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
