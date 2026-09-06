import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowPath = new URL("../../.github/workflows/ci.yml", import.meta.url);
const workflow = await readFile(workflowPath, "utf8");

function yamlBlock(source: string, startPattern: RegExp): string {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => startPattern.test(line));
  if (start === -1) {
    assert.fail(`Missing YAML block matching ${startPattern}`);
  }

  const startLine = lines[start];
  if (startLine === undefined) {
    assert.fail(`Missing YAML block matching ${startPattern}`);
  }
  const indentation = startLine.match(/^ */)?.[0].length ?? 0;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line === undefined) {
      break;
    }
    if (
      line.trim() !== "" &&
      (line.match(/^ */)?.[0].length ?? 0) <= indentation
    ) {
      break;
    }
    end += 1;
  }
  return lines.slice(start, end).join("\n");
}

function yamlLiteral(source: string, startPattern: RegExp): string {
  const block = yamlBlock(source, startPattern);
  const lines = block.split("\n");
  const firstLine = lines[0];
  if (firstLine === undefined) {
    assert.fail(`Missing YAML literal matching ${startPattern}`);
  }
  const indentation = (firstLine.match(/^ */)?.[0].length ?? 0) + 2;
  return lines
    .slice(1)
    .map((line) => line.slice(indentation))
    .join("\n")
    .trimEnd();
}

test("CI dispatch requires exact automation PR identity", () => {
  const dispatch = yamlBlock(workflow, /^  workflow_dispatch:\s*$/);
  for (const input of [
    "automation_pr",
    "expected_head_sha",
    "expected_head_ref",
    "expected_title",
  ]) {
    const inputBlock = yamlBlock(
      dispatch,
      new RegExp(`^      ${input}:\\s*$`),
    );
    assert.match(inputBlock, /^        required: true$/m, input);
    assert.match(inputBlock, /^        type: string$/m, input);
  }
});

test("CI keeps its ordinary main triggers and required check name", () => {
  for (const event of ["push", "pull_request"]) {
    const trigger = yamlBlock(workflow, new RegExp(`^  ${event}:\\s*$`));
    assert.match(trigger, /^    branches:\s*\n      - main$/m, event);
  }

  const qualityJob = yamlBlock(workflow, /^  quality:\s*$/);
  assert.match(qualityJob, /^    name: Quality gate$/m);
});

test("CI grants only read access to repository contents", () => {
  const permissions = yamlBlock(workflow, /^permissions:\s*$/);
  assert.deepEqual(
    permissions
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    ["permissions:", "contents: read"],
  );
});

test("CI checks out the dispatched head SHA and keeps event checkouts unchanged", () => {
  const checkout = yamlBlock(
    workflow,
    /^      - name: Check out repository\s*$/,
  );
  assert.match(checkout, /^        uses: actions\/checkout@v\d+$/m);
  assert.match(
    checkout,
    /^          ref: \$\{\{ inputs\.expected_head_sha \|\| github\.sha \}\}$/m,
  );
});

test("CI runs a secret-free dispatch preflight before every install", () => {
  const qualityJob = yamlBlock(workflow, /^  quality:\s*$/);
  const checkoutIndex = qualityJob.indexOf("- name: Check out repository");
  const preflightIndex = qualityJob.indexOf(
    "- name: Verify dispatched pull request",
  );
  const firstInstallIndex = qualityJob.indexOf("- name: Install pnpm");
  assert.ok(checkoutIndex >= 0);
  assert.ok(preflightIndex > checkoutIndex);
  assert.ok(firstInstallIndex > preflightIndex);

  const preflight = yamlBlock(
    qualityJob,
    /^      - name: Verify dispatched pull request\s*$/,
  );
  assert.match(
    preflight,
    /^        if: github\.event_name == 'workflow_dispatch'$/m,
  );
  assert.match(preflight, /^        uses: actions\/github-script@v\d+$/m);
  assert.doesNotMatch(preflight, /secrets\./);

  const expectedEnvironment = [
    ["AUTOMATION_PR", "automation_pr"],
    ["EXPECTED_HEAD_SHA", "expected_head_sha"],
    ["EXPECTED_HEAD_REF", "expected_head_ref"],
    ["EXPECTED_TITLE", "expected_title"],
  ];
  for (const [environmentName, inputName] of expectedEnvironment) {
    assert.match(
      preflight,
      new RegExp(
        `^          ${environmentName}: \\$\\{\\{ inputs\\.${inputName} \\}\\}$`,
        "m",
      ),
      environmentName,
    );
  }
});

const expectedHeadSha = "0123456789abcdef0123456789abcdef01234567";
const expectedTitle = "[AI] docs: 同步并翻译 OpenAI 官方文档";
const expectedHeadRef = "automation/update-openai-docs";

function dispatchedPreflightScript(): string {
  const preflight = yamlBlock(
    workflow,
    /^      - name: Verify dispatched pull request\s*$/,
  );
  return yamlLiteral(preflight, /^          script: \|\s*$/);
}

async function executeDispatchedPreflight(options?: {
  checkedOutSha?: string;
  contextSha?: string;
  env?: Partial<Record<string, string>>;
  pull?: {
    base: { ref: string };
    head: { ref: string; sha: string };
    state: string;
    title: string;
  };
}): Promise<{
  execCalls: Array<{ args: string[]; command: string }>;
  githubRequests: Array<Record<string, unknown>>;
}> {
  const pull = options?.pull ?? {
    base: { ref: "main" },
    head: { ref: expectedHeadRef, sha: expectedHeadSha },
    state: "open",
    title: expectedTitle,
  };
  const githubRequests: Array<Record<string, unknown>> = [];
  const github = {
    rest: {
      pulls: {
        get: async (request: Record<string, unknown>) => {
          githubRequests.push(request);
          return { data: pull };
        },
      },
    },
  };
  const execCalls: Array<{ args: string[]; command: string }> = [];
  const exec = {
    getExecOutput: async (command: string, args: string[]) => {
      execCalls.push({ args, command });
      return {
        exitCode: 0,
        stderr: "",
        stdout: `${options?.checkedOutSha ?? expectedHeadSha}\n`,
      };
    },
  };
  const environment = {
    AUTOMATION_PR: "42",
    EXPECTED_HEAD_REF: expectedHeadRef,
    EXPECTED_HEAD_SHA: expectedHeadSha,
    EXPECTED_TITLE: expectedTitle,
    ...options?.env,
  };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const run = new AsyncFunction(
    "github",
    "context",
    "exec",
    "process",
    dispatchedPreflightScript(),
  );
  await run(
    github,
    {
      repo: { owner: "openai", repo: "docs" },
      sha: options?.contextSha ?? expectedHeadSha,
    },
    exec,
    { env: environment },
  );
  return { execCalls, githubRequests };
}

test("dispatch preflight accepts only the exact open automation PR head", async () => {
  assert.deepEqual(await executeDispatchedPreflight(), {
    execCalls: [{ args: ["rev-parse", "HEAD"], command: "git" }],
    githubRequests: [{ owner: "openai", pull_number: 42, repo: "docs" }],
  });

  const trustedPull = {
    base: { ref: "main" },
    head: { ref: expectedHeadRef, sha: expectedHeadSha },
    state: "open",
    title: expectedTitle,
  };
  const rejected: Array<
    [
      string,
      Parameters<typeof executeDispatchedPreflight>[0],
      RegExp,
    ]
  > = [
    ["closed PR", { pull: { ...trustedPull, state: "closed" } }, /open/i],
    [
      "wrong base",
      { pull: { ...trustedPull, base: { ref: "release" } } },
      /base/i,
    ],
    [
      "wrong title",
      { pull: { ...trustedPull, title: "[AI] docs: other" } },
      /title/i,
    ],
    [
      "matching noncanonical input and PR titles",
      {
        env: { EXPECTED_TITLE: "[AI] docs: other" },
        pull: { ...trustedPull, title: "[AI] docs: other" },
      },
      /expected title/i,
    ],
    [
      "wrong PR head ref",
      { pull: { ...trustedPull, head: { ...trustedPull.head, ref: "other" } } },
      /head ref/i,
    ],
    [
      "wrong expected head ref",
      { env: { EXPECTED_HEAD_REF: "automation/other" } },
      /head ref/i,
    ],
    [
      "wrong PR head SHA",
      { pull: { ...trustedPull, head: { ...trustedPull.head, sha: "f".repeat(40) } } },
      /head sha/i,
    ],
    [
      "wrong checked-out SHA",
      { checkedOutSha: "e".repeat(40) },
      /checked.out sha/i,
    ],
    [
      "wrong dispatch event SHA",
      { contextSha: "d".repeat(40) },
      /event sha/i,
    ],
    ["invalid PR number", { env: { AUTOMATION_PR: "42x" } }, /PR number/i],
  ];

  for (const [name, options, error] of rejected) {
    await assert.rejects(executeDispatchedPreflight(options), error, name);
  }
});
