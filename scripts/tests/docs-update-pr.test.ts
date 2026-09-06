import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import {
  assertAllowedAutomationPaths,
  assertAutomationPullRequest,
  decideAutomationPhase,
} from "../docs-update-pr.ts";

const trustedPullRequest = {
  authorLogin: "github-actions[bot]",
  baseRef: "main",
  headRef: "automation/update-openai-docs",
  headSha: "a".repeat(40),
  open: true,
  title: "[AI] docs: 同步并翻译 OpenAI 官方文档",
};

test("only the exact automation pull request provenance is trusted", () => {
  assert.doesNotThrow(() => assertAutomationPullRequest(trustedPullRequest));
  assert.doesNotThrow(() =>
    assertAutomationPullRequest({
      ...trustedPullRequest,
      headSha: "0123456789abcdef".repeat(4),
    }),
  );

  const rejected: Array<[string, Record<string, unknown>, RegExp]> = [
    ["author", { authorLogin: "dependabot[bot]" }, /PR 作者/],
    ["base", { baseRef: "release" }, /PR base/],
    ["head", { headRef: "someone:update-openai-docs" }, /PR head/],
    ["sha", { headSha: "not-a-sha" }, /PR head SHA/],
    ["state", { open: false }, /打开状态/],
    ["title", { title: "[AI] docs: update" }, /PR 标题/],
  ];
  for (const [name, override, message] of rejected) {
    assert.throws(
      () => assertAutomationPullRequest({ ...trustedPullRequest, ...override }),
      message,
      name,
    );
  }
});

test("runtime pull request fields fail closed on wrong primitive types", () => {
  for (const override of [
    { authorLogin: true },
    { baseRef: true },
    { headRef: true },
    { headSha: true },
    { open: "true" },
    { title: true },
  ]) {
    assert.throws(() =>
      assertAutomationPullRequest(
        { ...trustedPullRequest, ...override } as unknown as Parameters<
          typeof assertAutomationPullRequest
        >[0],
      ),
    );
  }
});

test("only generated documentation paths are allowed", () => {
  assert.doesNotThrow(() =>
    assertAllowedAutomationPaths([
      "docs/en/a.md",
      "docs/zh/a.md",
      "docs/updates/batch.json",
    ]),
  );

  assert.throws(
    () =>
      assertAllowedAutomationPaths([
        "scripts/translate-docs.ts",
        "",
        "/docs/en/a.md",
        "docs/en/../scripts/a.ts",
      ]),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(
        error.message,
        "禁止路径：scripts/translate-docs.ts、、/docs/en/a.md、docs/en/../scripts/a.ts",
      );
      return true;
    },
  );
});

test("head drift blocks readiness", () => {
  assert.equal(
    decideAutomationPhase({
      batchComplete: true,
      headMatches: false,
      translationFailed: false,
    }),
    "blocked-draft",
  );
});

test("only a complete unchanged batch is ready", () => {
  assert.equal(
    decideAutomationPhase({
      batchComplete: true,
      headMatches: true,
      translationFailed: false,
    }),
    "ready-for-ci",
  );

  for (const input of [
    { batchComplete: false, headMatches: true, translationFailed: false },
    { batchComplete: true, headMatches: false, translationFailed: false },
    { batchComplete: true, headMatches: true, translationFailed: true },
  ]) {
    assert.equal(decideAutomationPhase(input), "blocked-draft");
  }
});

async function withInputFile(
  value: unknown,
  run: (path: string) => void,
): Promise<void> {
  const root = await mkdtemp(join(tmpdir(), "docs-update-pr-"));
  try {
    const path = join(root, "input.json");
    await writeFile(path, JSON.stringify(value));
    run(path);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
}

const cliPath = resolve("scripts/docs-update-pr.ts");

test("check-pr CLI prints a newline-delimited trusted output", async () => {
  await withInputFile(trustedPullRequest, (path) => {
    const result = spawnSync(
      process.execPath,
      [cliPath, "--", "check-pr", "--input", path],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "trusted=true\n");
    assert.equal(result.stderr, "");
  });
});

test("check-paths CLI validates normalized JSON and reports failures", async () => {
  await withInputFile(["docs/en/a.md", "docs/zh/a.md"], (path) => {
    const result = spawnSync(
      process.execPath,
      [cliPath, "--", "check-paths", "--input", path],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "allowed=true\n");
  });

  await withInputFile(["README.md"], (path) => {
    const result = spawnSync(
      process.execPath,
      [cliPath, "check-paths", "--input", path],
      { encoding: "utf8" },
    );
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "禁止路径：README.md\n");
  });
});

test("CLI requires the documented command and input option", () => {
  const missingInput = spawnSync(process.execPath, [cliPath, "check-pr"], {
    encoding: "utf8",
  });
  assert.notEqual(missingInput.status, 0);
  assert.equal(missingInput.stderr, "缺少必需参数：--input PATH。\n");

  const unknownCommand = spawnSync(process.execPath, [cliPath, "other"], {
    encoding: "utf8",
  });
  assert.notEqual(unknownCommand.status, 0);
  assert.equal(
    unknownCommand.stderr,
    "命令必须是 check-pr 或 check-paths。\n",
  );
});
