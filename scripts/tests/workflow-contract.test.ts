import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, chmod, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadTranslationWorkspace, translationPolicySha256ForPage } from "../translation/planner.ts";

const workflowPath = new URL("../../.github/workflows/ci.yml", import.meta.url);
const workflow = await readFile(workflowPath, "utf8");
const writerPath = new URL("../../.github/workflows/update-docs.yml", import.meta.url);
const designPath = new URL("../../docs/translation-design.md", import.meta.url);

for (const path of [
  "apps/web/scripts/generate-content.ts",
  "apps/web/tests/links.test.ts",
]) {
  test(`${path} derives its schedule from the unified writer`, async () => {
    const source = await readFile(new URL(`../../${path}`, import.meta.url), "utf8");
    assert.match(source, /\.github\/workflows\/update-docs\.yml/);
  });
}

test("active reader and maintainer sources do not reference deleted workflows", async () => {
  const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
  // Dated HANDOFF.md and docs/superpowers preserve historical implementation facts.
  const tracked = spawnSync("git", [
    "ls-files", "-z", "--", "apps", "scripts", "README.md", "docs/translation-design.md",
  ], { cwd: repositoryRoot, encoding: "utf8" });
  assert.equal(tracked.status, 0, tracked.stderr);
  const references: string[] = [];
  for (const path of tracked.stdout.split("\0").filter(Boolean)) {
    const source = await readFile(join(repositoryRoot, path), "utf8");
    if (/\.github\/workflows\/(?:sync-docs|translate-docs)\.yml/u.test(source)) {
      references.push(path);
    }
  }
  assert.deepEqual(references, [], "Active sources must reference an existing workflow");
});

test("README describes one durable checked update without volatile implementation details", async () => {
  const readme = await readFile(new URL("../../README.md", import.meta.url), "utf8");
  assert.match(readme, /\[打开 OpenAI API 中文文档\]\(https:\/\/www\.openai-api-chinese\.com\)/);
  assert.match(readme, /> 本项目不是 OpenAI 官方网站。涉及接口行为、价格、使用限制和安全要求时，请以 \[OpenAI 官方文档\]\(https:\/\/developers\.openai\.com\/api\/\) 为准。/);
  assert.match(readme, /英文同步和对应的中文翻译会放在同一个更新中/);
  assert.match(readme, /检查通过后自动合并/);
  assert.match(readme, /若翻译或检查失败，更新会停留在待处理状态，不会把未完成的中英文内容发布出去/);
  assert.doesNotMatch(readme, /等待审核|已有翻译 PR|维护者审核|TRANSLATION_PROVIDER|DEEPSEEK_API_KEY|MINIMAX_API_KEY|MiniMax|DeepSeek|docs\/en\/api\/|每轮最多|每批最多/);
});

test("translation design does not claim budgeted pages are published", async () => {
  const design = await readFile(designPath, "utf8");
  assert.match(design, /达到预算时正常结束，并将已完成改动提交并推送到 draft PR/);
  assert.doesNotMatch(design, /正常结束并发布已完成页面/);
});

test("unified writer is the only scheduled docs writer", async () => {
  const writer = await readFile(writerPath, "utf8");
  assert.match(writer, /^  schedule:$/m);
  assert.match(writer, /^  workflow_dispatch:$/m);
  assert.match(writer, /cron: "0 16 \* \* \*"/);
  assert.doesNotMatch(writer, /^  (?:push|pull_request|workflow_run):/m);
  assert.match(writer, /group: update-openai-docs/);
  assert.match(writer, /cancel-in-progress: false/);
  assert.doesNotMatch(writer, /--force(?:-with-lease)?|checkout -B|reset --hard/);
  for (const name of ["sync-docs.yml", "translate-docs.yml"]) {
    await assert.rejects(access(new URL(name, writerPath)), { code: "ENOENT" });
  }
  for (const name of await readdir(new URL("./", workflowPath))) {
    if (!name.endsWith(".yml")) continue;
    const source = await readFile(new URL(name, workflowPath), "utf8");
    assert.doesNotMatch(source, /automation\/(?:sync|translate)-openai-docs/, name);
    if (name !== "update-docs.yml") assert.doesNotMatch(source, /^  schedule:$/m, name);
  }
});

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

async function writerStep(name: string): Promise<string> {
  return yamlBlock(await readFile(writerPath, "utf8"), new RegExp(`^      - name: ${name}$`));
}

test("writer verifies trusted main and paths before exposing provider secrets", async () => {
  const writer = await readFile(writerPath, "utf8");
  assert.match(writer, /^  AUTO_MERGE_ROLLOUT: canary$/m);
  assert.match(writer, /^  UPDATE_BRANCH: automation\/update-openai-docs$/m);
  assert.match(writer, /^    if: github.ref == 'refs\/heads\/main'$/m);
  assert.match(writer, /^    environment: translation-production$/m);
  assert.match(writer, /contents: write\n  pull-requests: write\n  actions: write/);
  assert.match(await writerStep("Check out trusted main with history"), /ref: main/);
  assert.match(await writerStep("Install locked dependencies without lifecycle scripts"), /pnpm install --frozen-lockfile --ignore-scripts/);
  const verify = await writerStep("Verify trusted main before preparing the batch");
  for (const command of ["pnpm typecheck", "pnpm test", "pnpm translate:check"]) assert.ok(verify.includes(command));
  const translation = await writerStep("Translate the batch within workload and time budgets");
  assert.match(translation, /continue-on-error: true/);
  assert.match(translation, /pnpm translate:batch --/);
  assert.match(translation, /--result "\$RUNNER_TEMP\/translation-result.json"/);
  assert.match(translation, /--limit 100/);
  for (const name of ["DEEPSEEK_API_KEY", "MINIMAX_API_KEY"]) {
    assert.match(translation, new RegExp(`${name}: \\$\\{\\{ secrets\\.${name} \\}\\}`));
  }
  assert.doesNotMatch(writer.replace(translation, ""), /secrets\./);
  const status = await writerStep("Verify batch consistency and render the unified body");
  assert.match(status, /fromJSON\(steps.translate.outputs.provider_profile \|\| '\{\}'\)\.id/);
  assert.match(status, /fromJSON\(steps.translate.outputs.provider_profile \|\| '\{\}'\)\.model/);
  assert.doesNotMatch(status, /API_KEY|secrets\./);
  assert.ok(writer.indexOf("Verify trusted main before preparing") < writer.indexOf("Prepare the verified automation branch"));
  assert.ok(writer.indexOf("Prepare the verified automation branch") < writer.indexOf("Translate the batch within"));
  assert.match(await writerStep("Prepare the verified automation branch"), /check-paths/);
});

test("writer persists completed pages before validation and reports failures after the PR update", async () => {
  const writer = await readFile(writerPath, "utf8");
  assert.ok(writer.indexOf("Publish completed translations") < writer.indexOf("Verify batch consistency and render the unified body"));
  assert.ok(writer.indexOf("Create or update the unified pull request") < writer.indexOf("Report failure after preserving the draft pull request"));
  const sync = await writerStep("Synchronize English and publish the batch release");
  assert.match(sync, /pnpm docs:sync --/);
  assert.match(sync, /--release-output/);
  assert.match(sync, /git push origin HEAD:refs\/heads\/automation\/update-openai-docs/);
  assert.match(sync, /\[AI\] docs: 同步 OpenAI 官方英文文档/);
  const publish = await writerStep("Publish completed translations");
  assert.match(publish, /\[AI\] docs: 更新本轮 OpenAI 中文翻译/);
  assert.match(publish, /"push", "origin", "HEAD:refs\/heads\/automation\/update-openai-docs"/);
  assert.doesNotMatch(writer, /git add (?:\.|-A\s*$)/m);
  const status = await writerStep("Verify batch consistency and render the unified body");
  assert.match(status, /inspectDocsUpdateBatchWorkspace/);
  assert.match(status, /renderUnifiedPullRequestBody/);
  assert.match(status, /"docs:status"/);
  assert.match(status, /"translate:check"/);
  assert.match(status, /"check-paths"/);
  assert.match(status, /"rev-parse", "HEAD"/);
  assert.match(await writerStep("Report failure after preserving the draft pull request"), /exit 1/);
});

test("CI dispatch and auto merge require complete state and the canary opt-in", async () => {
  assert.doesNotMatch(workflow, /createWorkflowDispatch|update-docs\.yml/);
  const dispatch = await writerStep("Dispatch CI for the exact completed head");
  assert.match(dispatch, /if: .*steps.status.outputs.complete == 'true'/);
  assert.match(dispatch, /workflow_id: "ci.yml"/);
  assert.doesNotMatch(await readFile(writerPath, "utf8"), /workflow_id: "(?!ci\.yml")/);
  const autoMerge = await writerStep("Request squash auto merge for the unchanged completed head");
  assert.match(autoMerge, /if: .*steps.status.outputs.complete == 'true'/);
  assert.match(autoMerge, /env.AUTO_MERGE_ROLLOUT == 'enabled' \|\| inputs.enable_auto_merge == true/);
  assert.match(autoMerge, /enablePullRequestAutoMerge/);
  assert.match(autoMerge, /mergeMethod: SQUASH/);
  assert.doesNotMatch(autoMerge, /pulls\.merge|sleep|setTimeout/);
});

interface WriterPull {
  number: number;
  node_id: string;
  state: string;
  title: string;
  draft: boolean;
  user: { login: string };
  base: { ref: string };
  head: { ref: string; sha: string; repo: { full_name: string } };
  merged?: boolean;
  merge_commit_sha?: string | null;
}

function automationPull(overrides: Partial<WriterPull> = {}): WriterPull {
  return {
    number: 42, node_id: "PR_node", state: "open", title: expectedTitle,
    draft: true, user: { login: "github-actions[bot]" }, base: { ref: "main" },
    head: { ref: expectedHeadRef, sha: expectedHeadSha, repo: { full_name: "openai/docs" } },
    ...overrides,
  };
}

async function runWriterApiStep(name: string, options: {
  complete?: boolean;
  pull?: WriterPull;
  existing?: boolean;
  staleOnFetch?: number;
  expectedSha?: string;
  createFailure?: boolean;
  events?: Array<{ kind: string; data: Record<string, unknown> }>;
} = {}) {
  const events = options.events ?? [];
  let pull = structuredClone(options.pull ?? automationPull());
  let fetches = 0;
  const record = (kind: string, data: Record<string, unknown>) => events.push({ kind, data });
  const github = {
    paginate: async (_method: unknown, request: Record<string, unknown>) => {
      record("list", request);
      return options.existing === false ? [] : [pull];
    },
    rest: {
      pulls: {
        list: () => {},
        get: async (request: Record<string, unknown>) => {
          record("get", request);
          fetches++;
          if (options.staleOnFetch === fetches) pull.head.sha = "f".repeat(40);
          return { data: structuredClone(pull) };
        },
        create: async (request: Record<string, unknown>) => {
          record("create", request);
          if (options.createFailure) throw new Error("Transient PR creation failure");
          pull.draft = request.draft === true;
          return { data: structuredClone(pull) };
        },
        update: async (request: Record<string, unknown>) => {
          record("update", request);
          return { data: structuredClone(pull) };
        },
      },
      actions: {
        createWorkflowDispatch: async (request: Record<string, unknown>) => record("dispatch", request),
      },
    },
    graphql: async (query: string, variables: Record<string, unknown>) => {
      record("graphql", { query, ...variables });
      if (query.includes("convertPullRequestToDraft")) pull.draft = true;
      if (query.includes("markPullRequestReadyForReview")) pull.draft = false;
      return {};
    },
  };
  const script = yamlLiteral(await writerStep(name), /^          script: \|$/);
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const run = new AsyncFunction("github", "context", "core", "process", "require", script);
  await run(github, { repo: { owner: "openai", repo: "docs" } }, {
    setOutput: (key: string, value: unknown) => record("output", { key, value }),
    notice: () => {},
  }, { env: {
    PR_NUMBER: options.existing === false ? "" : "42", PULL_NUMBER: "42",
    PUSHED_HEAD_SHA: options.expectedSha ?? expectedHeadSha, EXPECTED_HEAD_SHA: options.expectedSha ?? expectedHeadSha,
    UPDATE_BRANCH: expectedHeadRef, BASE_BRANCH: "main", PR_TITLE: expectedTitle,
    BATCH_COMPLETE: String(options.complete ?? false), PR_BODY_PATH: "/temporary/body.md", SYNC_SUMMARY_PATH: "/temporary/summary.md",
  } }, (name: string) => {
    assert.equal(name, "node:fs/promises");
    return { readFile: async () => "required_complete=false\n本轮已翻译" };
  });
  return events;
}

test("existing ready PR becomes draft through GraphQL when the batch is incomplete", async () => {
  const events = await runWriterApiStep("Create or update the unified pull request", { pull: automationPull({ draft: false }) });
  assert.equal(events.filter((e) => e.kind === "update").length, 1);
  assert.ok(events.some((e) => e.kind === "graphql" && String(e.data.query).includes("convertPullRequestToDraft")));
  assert.ok(events.filter((e) => e.kind === "update").every((e) => !Object.hasOwn(e.data, "draft")));
  assert.ok(events.some((e) => e.kind === "update" && String(e.data.body).includes("required_complete=")));
});

test("only a complete draft is marked ready and newly created PRs start as drafts", async () => {
  for (const complete of [false, true]) {
    for (const draft of [false, true]) {
      const events = await runWriterApiStep("Create or update the unified pull request", { complete, pull: automationPull({ draft }) });
      assert.equal(events.some((e) => e.kind === "graphql" && String(e.data.query).includes("markPullRequestReadyForReview")), complete && draft);
    }
  }
  const events = await runWriterApiStep("Create or update the unified pull request", { existing: false });
  assert.deepEqual(events.find((e) => e.kind === "create")?.data, {
    owner: "openai", repo: "docs", base: "main", head: expectedHeadRef,
    title: expectedTitle, body: "required_complete=false\n本轮已翻译", draft: true,
  });
});

test("PR lifecycle rejects closed or foreign identities and refetches the pushed head", async () => {
  for (const pull of [automationPull({ state: "closed" }), automationPull({ title: "other" }), automationPull({ user: { login: "human" } })]) {
    await assert.rejects(runWriterApiStep("Create or update the unified pull request", { pull }), /identity|open|trusted/i);
  }
  await assert.rejects(runWriterApiStep("Create or update the unified pull request", { staleOnFetch: 2 }), /head/i);
});

test("CI dispatch sends exactly the recorded PR identity and refuses a changed head", async () => {
  const events = await runWriterApiStep("Dispatch CI for the exact completed head", { complete: true, pull: automationPull({ draft: false }) });
  assert.deepEqual(events.find((e) => e.kind === "dispatch")?.data, {
    owner: "openai", repo: "docs", workflow_id: "ci.yml", ref: expectedHeadRef,
    inputs: { automation_pr: "42", expected_head_sha: expectedHeadSha, expected_head_ref: expectedHeadRef, expected_title: expectedTitle },
  });
  const staleEvents: Array<{ kind: string; data: Record<string, unknown> }> = [];
  await assert.rejects(runWriterApiStep("Dispatch CI for the exact completed head", { staleOnFetch: 1, events: staleEvents }), /head/i);
  assert.equal(staleEvents.some((e) => e.kind === "dispatch"), false);
});

test("auto merge refetches the exact head immediately before requesting squash", async () => {
  const events = await runWriterApiStep("Request squash auto merge for the unchanged completed head", { pull: automationPull({ draft: false }) });
  const mutation = events.findIndex((e) => e.kind === "graphql");
  assert.equal(events[mutation - 1]?.kind, "get");
  assert.match(String(events[mutation]?.data.query), /enablePullRequestAutoMerge.*mergeMethod: SQUASH/s);
  assert.equal(events[mutation]?.data.expectedHeadOid, expectedHeadSha);
  await assert.rejects(runWriterApiStep("Request squash auto merge for the unchanged completed head", { staleOnFetch: 1 }), /head/i);
});

async function localWriterFixture(t: { after: (callback: () => Promise<void>) => void }) {
  const temporary = await mkdtemp(join(tmpdir(), "docs-writer-contract-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const root = join(temporary, "checkout");
  const remote = join(temporary, "origin.git");
  const runnerTemp = join(temporary, "runner");
  const bin = join(temporary, "bin");
  await Promise.all([mkdir(root), mkdir(runnerTemp), mkdir(bin)]);
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_AUTHOR_NAME: "Workflow test", GIT_AUTHOR_EMAIL: "workflow@example.com",
    GIT_COMMITTER_NAME: "Workflow test", GIT_COMMITTER_EMAIL: "workflow@example.com",
    PATH: `${bin}:${process.env.PATH}`, RUNNER_TEMP: runnerTemp,
    GITHUB_OUTPUT: join(runnerTemp, "step-output.txt"),
    REAL_CHECKER: fileURLToPath(new URL("../docs-update-pr.ts", import.meta.url)),
  };
  await writeFile(join(bin, "pnpm"), '#!/bin/sh\nif [ "$1" = "docs:sync" ] && [ -n "$SYNC_ARGS_LOG" ]; then printf "%s\\n" "$@" > "$SYNC_ARGS_LOG"; fi\ncase "$1" in docs:sync|translate:batch|docs:status|translate:check) exit 0;; esac\nif [ "$1" = "docs:update:check" ]; then shift 2; exec node "$REAL_CHECKER" "$@"; fi\nexit 99\n');
  await chmod(join(bin, "pnpm"), 0o755);
  const calls: Array<{ command: string; args: string[] }> = [];
  const output = (command: string, args: string[], ignoreReturnCode = false) => {
    calls.push({ command, args });
    const result = spawnSync(command, args, { cwd: root, env, encoding: "utf8" });
    if (result.error) throw result.error;
    if (result.status !== 0 && !ignoreReturnCode) throw new Error(`${command} ${args.join(" ")}: ${result.stderr || result.stdout}`);
    return { exitCode: result.status ?? 1, stderr: result.stderr, stdout: result.stdout };
  };
  const git = (...args: string[]) => output("git", args).stdout.trim();
  git("init", "--bare", remote);
  git("init", "-b", "main");
  git("remote", "add", "origin", remote);
  await mkdir(join(root, "docs/en"), { recursive: true });
  await mkdir(join(root, "docs/zh"), { recursive: true });
  await mkdir(join(root, "docs/updates"), { recursive: true });
  await mkdir(join(root, "scripts"));
  await writeFile(join(root, "package.json"), '{"type":"module"}\n');
  await writeFile(join(root, "docs/en/a.md"), "# Original\n");
  await writeFile(join(root, "docs/zh/a.md"), "# 原文\n");
  const sourceUrl = "https://developers.openai.com/api/docs/guides/a.md";
  await writeFile(join(root, "docs/en/.source-manifest.json"), JSON.stringify({
    generatedAt: "2026-09-06T00:00:00.000Z",
    pages: { [sourceUrl]: { localPath: "docs/en/a.md", sourceUrl, title: "A" } },
  }));
  await writeFile(join(root, "scripts/sync-pr-summary.ts"), await readFile(new URL("../sync-pr-summary.ts", import.meta.url)));
  git("add", ".");
  git("commit", "-m", "[AI] test: initial main");
  git("push", "origin", "main");
  const outputs: Record<string, string> = {};
  const failures: string[] = [];
  const runStep = async (name: string, pulls: WriterPull[] = [], extraEnv: Record<string, string> = {}) => {
    Object.assign(env, extraEnv);
    const script = yamlLiteral(await writerStep(name), /^          script: \|$/);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const run = new AsyncFunction("github", "context", "core", "process", "require", "exec", script);
    await run({
      paginate: async (_method: unknown, request: { state: string }) => request.state === "all" ? pulls : pulls.filter((pull) => pull.state === request.state),
      rest: { pulls: {
        list: () => {},
        get: async (request: { pull_number: number }) => {
          const pull = pulls.find((entry) => entry.number === request.pull_number);
          assert.ok(pull, `Missing fixture PR #${request.pull_number}`);
          return { data: pull };
        },
      } },
    },
      { repo: { owner: "openai", repo: "docs" } },
      { setOutput: (key: string, value: unknown) => { outputs[key] = String(value); }, setFailed: (message: string) => failures.push(message), notice: () => {} },
      { env: { ...env, UPDATE_BRANCH: expectedHeadRef, PR_TITLE: expectedTitle, TRUSTED_MAIN_SHA: git("rev-parse", "origin/main"), ...extraEnv }, cwd: () => root },
      createRequire(import.meta.url),
      {
        getExecOutput: async (command: string, args: string[], options?: { ignoreReturnCode?: boolean }) => output(command, args, options?.ignoreReturnCode),
        exec: async (command: string, args: string[]) => output(command, args).exitCode,
      });
  };
  const publishFeature = async (path: string, content: string, subject = "[AI] test: pending batch") => {
    git("checkout", "-b", expectedHeadRef);
    await writeFile(join(root, path), content);
    git("add", "--", path);
    git("commit", "-m", subject);
    const sha = git("rev-parse", "HEAD");
    git("push", "origin", expectedHeadRef);
    git("checkout", "main");
    git("branch", "-D", expectedHeadRef);
    const pull = automationPull();
    pull.head.sha = sha;
    return pull;
  };
  return { calls, env, failures, git, output, outputs, publishFeature, remote, root, runnerTemp, runStep };
}

test("continuation merges newer main only after validating the recorded PR and paths", async (t) => {
  const fixture = await localWriterFixture(t);
  const pull = await fixture.publishFeature("docs/en/a.md", "# Pending English\n");
  await writeFile(join(fixture.root, "main-only.txt"), "New trusted main\n");
  fixture.git("add", "main-only.txt");
  fixture.git("commit", "-m", "[AI] test: newer main");
  fixture.git("push", "origin", "main");
  assert.equal(fixture.output("git", ["merge-base", "--is-ancestor", "origin/main", `origin/${expectedHeadRef}`], true).exitCode, 1);
  fixture.calls.length = 0;
  await fixture.runStep("Prepare the verified automation branch", [pull]);
  assert.equal(fixture.git("rev-parse", "HEAD^2"), fixture.git("rev-parse", "origin/main"));
  assert.equal(fixture.outputs.pr_number, "42");
  const mergeIndex = fixture.calls.findIndex((call) => call.command === "git" && call.args[0] === "merge");
  const validateIndex = fixture.calls.findIndex((call) => call.command === "pnpm" && call.args.includes("check-paths"));
  const ancestorIndex = fixture.calls.findIndex((call) => call.command === "git" && call.args[0] === "merge-base");
  assert.ok(validateIndex < mergeIndex && mergeIndex < ancestorIndex);
  assert.equal(fixture.git("rev-parse", `origin/${expectedHeadRef}`), pull.head.sha);
});

test("continuation conflicts stop before publishing and disallowed code never gets checked out", async (t) => {
  for (const mode of ["conflict", "untrusted-path", "stale-head", "orphan"] as const) {
    const fixture = await localWriterFixture(t);
    const path = mode === "untrusted-path" ? "scripts/injected.js" : "docs/en/a.md";
    const pull = await fixture.publishFeature(path, "Branch changes\n");
    if (mode === "conflict") {
      await writeFile(join(fixture.root, "docs/en/a.md"), "Conflicting main\n");
      fixture.git("add", "docs/en/a.md");
      fixture.git("commit", "-m", "[AI] test: conflicting main");
      fixture.git("push", "origin", "main");
    }
    if (mode === "stale-head") pull.head.sha = "f".repeat(40);
    fixture.calls.length = 0;
    await assert.rejects(fixture.runStep("Prepare the verified automation branch", mode === "orphan" ? [] : [pull]));
    assert.equal(fixture.calls.some((call) => call.command === "git" && call.args[0] === "push"), false, mode);
    if (mode !== "conflict") assert.equal(fixture.git("branch", "--show-current"), "main", mode);
  }
});

test("English snapshot produces one release commit and an empty sync does not create a branch", async (t) => {
  for (const changed of [false, true]) {
    const fixture = await localWriterFixture(t);
    await fixture.runStep("Prepare the verified automation branch");
    if (changed) await writeFile(join(fixture.root, "docs/en/a.md"), "# Updated English\n");
    const run = yamlLiteral(await writerStep("Synchronize English and publish the batch release"), /^        run: \|$/);
    fixture.output("bash", ["-e", "-o", "pipefail", "-c", run]);
    const releasePath = (await readFile(join(fixture.runnerTemp, "release-path.txt"), "utf8")).trim();
    const release = JSON.parse(await readFile(releasePath, "utf8"));
    assert.deepEqual(release.modified.map((entry: { path: string }) => entry.path), changed ? ["docs/en/a.md"] : []);
    assert.equal(fixture.git("rev-list", "--count", "origin/main..HEAD"), changed ? "1" : "0");
    const tracked = fixture.git("diff", "--name-only", "origin/main...HEAD");
    assert.doesNotMatch(tracked, /translation-result|release-path/);
    if (changed) {
      assert.match(tracked, /docs\/updates\/2026-09-06T00-00-00-000Z.json/);
      assert.equal(fixture.git("log", "-1", "--format=%s"), "[AI] docs: 同步 OpenAI 官方英文文档");
    } else {
      assert.ok(releasePath.startsWith(fixture.runnerTemp));
      assert.equal(fixture.git("ls-remote", "--heads", "origin", `refs/heads/${expectedHeadRef}`), "");
    }
  }
});

test("completed translations are committed with a normal push and a concurrent remote head is preserved", async (t) => {
  for (const concurrent of [false, true]) {
    const fixture = await localWriterFixture(t);
    const pull = await fixture.publishFeature("docs/en/a.md", "# English batch\n");
    await fixture.runStep("Prepare the verified automation branch", [pull]);
    if (concurrent) {
      fixture.git("checkout", "-b", "test-concurrent");
      await writeFile(join(fixture.root, "docs/zh/a.md"), "# Concurrent translation\n");
      fixture.git("add", "docs/zh/a.md");
      fixture.git("commit", "-m", "[AI] test: concurrent writer");
      fixture.git("push", "origin", `HEAD:refs/heads/${expectedHeadRef}`);
      fixture.git("checkout", expectedHeadRef);
    }
    const remoteBefore = fixture.git("ls-remote", "--heads", "origin", `refs/heads/${expectedHeadRef}`);
    await writeFile(join(fixture.root, "docs/zh/a.md"), "# Completed translation\n");
    await writeFile(join(fixture.runnerTemp, "translation-result.json"), '{"complete":false}\n');
    if (concurrent) {
      await assert.rejects(fixture.runStep("Publish completed translations"), /rejected|non-fast-forward/);
      assert.equal(fixture.git("ls-remote", "--heads", "origin", `refs/heads/${expectedHeadRef}`), remoteBefore);
    } else {
      await fixture.runStep("Publish completed translations");
      assert.equal(fixture.outputs.has_changes, "true");
      assert.equal(fixture.outputs.head_sha, fixture.git("rev-parse", "HEAD"));
    }
    assert.equal(fixture.git("log", "-1", "--format=%s"), "[AI] docs: 更新本轮 OpenAI 中文翻译");
    assert.doesNotMatch(fixture.git("ls-tree", "-r", "--name-only", "HEAD"), /translation-result/);
  }
});

async function addTranslationWorkspace(fixture: Awaited<ReturnType<typeof localWriterFixture>>) {
  const root = fixture.root;
  const sourceUrl = "https://developers.openai.com/api/docs/guides/a.md";
  await mkdir(join(root, "scripts/translation"));
  for (const name of ["planner.ts", "provider-profile.ts"]) {
    await writeFile(join(root, "scripts/translation", name), await readFile(new URL(`../translation/${name}`, import.meta.url)));
  }
  await writeFile(join(root, "scripts/translation.config.json"), JSON.stringify({
    glossaryPath: "scripts/translation/glossary.json", promptPath: "scripts/translation/prompt.md", priorityPath: "scripts/translation/priority.json",
    provider: { apiKeyEnv: "MINIMAX_API_KEY", id: "minimax-cn", model: "MiniMax-M3", modelEnv: "MINIMAX_MODEL", providerEnv: "TRANSLATION_PROVIDER" },
    schemaVersion: 2, sourceManifestPath: "docs/en/.source-manifest.json", sourceRoot: "docs/en",
    targetLanguage: "zh-CN", targetRoot: "docs/zh", translationManifestPath: "docs/zh/.translation-manifest.json",
  }));
  await writeFile(join(root, "scripts/translation/glossary.json"), '{"schemaVersion":1,"preserve":[],"terms":{}}');
  await writeFile(join(root, "scripts/translation/priority.json"), '{"schemaVersion":1,"sourcePaths":[]}');
  await writeFile(join(root, "scripts/translation/prompt.md"), "Translate accurately.");
  const hashFile = async (path: string) => createHash("sha256").update(await readFile(join(root, path))).digest("hex");
  await writeFile(join(root, "docs/en/.source-manifest.json"), JSON.stringify({
    schemaVersion: 1, indexes: {}, generatedAt: "2026-09-06T00:00:00Z",
    pages: { [sourceUrl]: { localPath: "docs/en/a.md", section: "guides", sha256: await hashFile("docs/en/a.md"), sourceUrl, status: "active", title: "A" } },
  }));
  const releasePath = join(fixture.runnerTemp, "release.json");
  await writeFile(releasePath, JSON.stringify({
    added: [{ path: "docs/en/a.md", route: "/api/docs/guides/a", sourceUrl, title: "A" }],
    modified: [], removed: [], generatedAt: "2026-09-06T00:00:00Z", id: "2026-09-06T00-00-00-000Z",
  }));
  await writeFile(join(fixture.runnerTemp, "release-path.txt"), `${releasePath}\n`);
  const markCurrent = async (environment: NodeJS.ProcessEnv) => {
    const workspace = await loadTranslationWorkspace(root, "scripts/translation.config.json", environment);
    await writeFile(join(root, "docs/zh/.translation-manifest.json"), JSON.stringify({
      schemaVersion: 1, targetLanguage: "zh-CN", pages: { [sourceUrl]: {
        policySha256: translationPolicySha256ForPage(workspace, sourceUrl), reviewStatus: "machine",
        sourcePath: "docs/en/a.md", sourceSha256: await hashFile("docs/en/a.md"), sourceUrl,
        targetPath: "docs/zh/a.md", targetSha256: await hashFile("docs/zh/a.md"), translatedAt: "2026-09-06T00:00:00Z",
      } },
    }));
  };
  return { markCurrent };
}

test("translation exports only the resolved provider and model for explicit overrides and key inference", async (t) => {
  for (const entry of [
    { environment: { TRANSLATION_PROVIDER: "deepseek", DEEPSEEK_MODEL: "custom-deepseek", MINIMAX_API_KEY: "fixture-only" }, expected: { id: "deepseek", model: "custom-deepseek" } },
    { environment: { DEEPSEEK_API_KEY: "fixture-only" }, expected: { id: "deepseek", model: "deepseek-chat" } },
  ]) {
    const fixture = await localWriterFixture(t);
    await addTranslationWorkspace(fixture);
    Object.assign(fixture.env, {
      DEEPSEEK_API_KEY: "", MINIMAX_API_KEY: "", TRANSLATION_PROVIDER: "", DEEPSEEK_MODEL: "", MINIMAX_MODEL: "",
      ...entry.environment, GITHUB_OUTPUT: join(fixture.runnerTemp, "step-output.txt"),
    });
    const script = yamlLiteral(await writerStep("Translate the batch within workload and time budgets"), /^        run: \|$/);
    fixture.output("bash", ["-e", "-o", "pipefail", "-c", script]);
    const output = await readFile(fixture.env.GITHUB_OUTPUT!, "utf8");
    assert.deepEqual(JSON.parse(output.trim().replace(/^provider_profile=/, "")), entry.expected);
    assert.doesNotMatch(output, /fixture-only|API_KEY|apiKeyEnv/);
  }
});

test("batch verification distinguishes budget pauses from failures and accepts the resolved non-default policy", async (t) => {
  for (const state of ["complete", "budget", "failure", "missing-result", "lying-result"] as const) {
    const fixture = await localWriterFixture(t);
    const { markCurrent } = await addTranslationWorkspace(fixture);
    const environment = { TRANSLATION_PROVIDER: "deepseek", DEEPSEEK_MODEL: "custom-deepseek", MINIMAX_MODEL: "custom-deepseek" };
    if (state === "complete") await markCurrent(environment);
    fixture.git("add", ".");
    fixture.git("commit", "-m", "[AI] test: translation workspace");
    fixture.git("push", "origin", "main");
    if (state !== "missing-result") {
      await writeFile(join(fixture.runnerTemp, "translation-result.json"), JSON.stringify({
        schemaVersion: 1, complete: state === "complete" || state === "lying-result", issues: [], removed: [],
        translated: state === "complete" ? ["docs/en/a.md"] : [], stopReason: state === "budget" ? "character-budget" : null,
      }));
    }
    await fixture.runStep("Verify batch consistency and render the unified body", [], {
      ...environment, TRANSLATION_OUTCOME: state === "failure" ? "failure" : "success", PUSHED_HEAD_SHA: fixture.git("rev-parse", "HEAD"),
    });
    assert.equal(fixture.outputs.complete, String(state === "complete"), `${state}: ${fixture.failures.join("; ")}`);
    assert.equal(fixture.outputs.failed, String(state !== "complete" && state !== "budget"), state);
    const body = await readFile(join(fixture.runnerTemp, "unified-pr-body.md"), "utf8");
    assert.match(body, new RegExp(`required_complete=${state === "complete"}`));
    if (state === "budget") assert.match(body, /character-budget/);
    if (state === "failure") assert.match(body, /Translation failed/);
  }
});

test("large pruning requires an explicit typed manual opt-in and defaults to the sync thresholds", async (t) => {
  const writer = await readFile(writerPath, "utf8");
  const option = yamlBlock(writer, /^      allow_large_prune:$/);
  assert.match(option, /default: false/);
  assert.match(option, /type: boolean/);
  const sync = await writerStep("Synchronize English and publish the batch release");
  assert.match(sync, /ALLOW_LARGE_PRUNE: \$\{\{ github.event_name == 'workflow_dispatch' && inputs.allow_large_prune == true \}\}/);
  for (const [event, allowed] of [["schedule", ""], ["workflow_dispatch", "false"], ["workflow_dispatch", "true"]]) {
    const fixture = await localWriterFixture(t);
    Object.assign(fixture.env, { GITHUB_EVENT_NAME: event, ALLOW_LARGE_PRUNE: allowed, SYNC_ARGS_LOG: join(fixture.runnerTemp, "sync-args.txt") });
    await fixture.runStep("Prepare the verified automation branch");
    fixture.output("bash", ["-e", "-o", "pipefail", "-c", yamlLiteral(sync, /^        run: \|$/)]);
    const args = (await readFile(fixture.env.SYNC_ARGS_LOG!, "utf8")).trim().split("\n");
    assert.deepEqual(args, ["docs:sync", "--", "--prune", ...(allowed === "true" ? ["--allow-large-prune"] : [])], event);
  }
});

test("published English has a checked draft before translation while no-change runs can translate backlog locally", async () => {
  const writer = await readFile(writerPath, "utf8");
  const earlyDraft = await writerStep("Create or recover the draft before translation");
  const translation = await writerStep("Translate the batch within workload and time budgets");
  assert.ok(writer.indexOf("Synchronize English and publish") < writer.indexOf("Create or recover the draft before translation"));
  assert.ok(writer.indexOf("Create or recover the draft before translation") < writer.indexOf("Translate the batch within"));
  assert.match(earlyDraft, /if: .*steps.sync.outputs.has_changes == 'true'/);
  assert.match(translation, /if: .*steps.sync.outputs.has_changes != 'true' \|\| steps.draft.outputs.number != ''/);
  assert.match(earlyDraft, /draft: true/);
  assert.match(earlyDraft, /convertPullRequestToDraft/);
  assert.doesNotMatch(earlyDraft, /secrets\./);
  const events = await runWriterApiStep("Create or recover the draft before translation", { existing: false });
  assert.equal(events.find((event) => event.kind === "create")?.data.draft, true);
  assert.ok(events.some((event) => event.kind === "get"));
  await assert.rejects(runWriterApiStep("Create or recover the draft before translation", { staleOnFetch: 1 }), /head/i);
  await assert.rejects(runWriterApiStep("Create or recover the draft before translation", { createFailure: true, existing: false }), /Transient/);
});

function useBotIdentity(fixture: Awaited<ReturnType<typeof localWriterFixture>>) {
  Object.assign(fixture.env, {
    GIT_AUTHOR_NAME: "github-actions[bot]", GIT_COMMITTER_NAME: "github-actions[bot]",
    GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
    GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
  });
}

test("a second run recovers a canonical English branch after interrupted initial PR creation", async (t) => {
  const fixture = await localWriterFixture(t);
  useBotIdentity(fixture);
  await fixture.runStep("Prepare the verified automation branch");
  await writeFile(join(fixture.root, "docs/en/a.md"), "# New English\n");
  fixture.output("bash", ["-e", "-o", "pipefail", "-c", yamlLiteral(await writerStep("Synchronize English and publish the batch release"), /^        run: \|$/)]);
  const head = fixture.git("rev-parse", "HEAD");
  const pull = automationPull();
  pull.head.sha = head;
  await assert.rejects(runWriterApiStep("Create or recover the draft before translation", { existing: false, expectedSha: head, pull, createFailure: true }), /Transient/);
  fixture.git("checkout", "main");
  fixture.git("branch", "-D", expectedHeadRef);
  await fixture.runStep("Prepare the verified automation branch");
  assert.equal(fixture.git("rev-parse", "HEAD"), head);
  const recovered = await runWriterApiStep("Create or recover the draft before translation", { existing: false, expectedSha: head, pull });
  assert.equal(recovered.filter((event) => event.kind === "create").length, 1);
});

test("orphan recovery rejects foreign authors, subjects, paths, ancestry, and closed-unmerged history", async (t) => {
  for (const mode of ["author", "subject", "path", "ancestry", "closed", "foreign-history"] as const) {
    const fixture = await localWriterFixture(t);
    if (mode !== "author") useBotIdentity(fixture);
    const pull = await fixture.publishFeature(
      mode === "path" ? "scripts/untrusted.js" : "docs/en/a.md",
      "Pending changes\n", mode === "subject" ? "[AI] test: foreign subject" : "[AI] docs: 同步 OpenAI 官方英文文档",
    );
    if (mode === "ancestry") {
      await writeFile(join(fixture.root, "new-main.txt"), "New main\n");
      fixture.git("add", "new-main.txt");
      fixture.git("commit", "-m", "[AI] test: advance main");
      fixture.git("push", "origin", "main");
    }
    const history = mode === "closed" || mode === "foreign-history"
      ? [{ ...pull, state: "closed", merged: false, ...(mode === "foreign-history" ? { user: { login: "human" } } : {}) }]
      : [];
    fixture.calls.length = 0;
    await assert.rejects(fixture.runStep("Prepare the verified automation branch", history), mode);
    assert.equal(fixture.git("branch", "--show-current"), "main", mode);
    assert.equal(fixture.calls.some((call) => call.args[0] === "push"), false, mode);
  }
});

test("a retained squash-merged branch accepts a second batch through a normal merge and push", async (t) => {
  const fixture = await localWriterFixture(t);
  useBotIdentity(fixture);
  const pull = await fixture.publishFeature("docs/en/a.md", "# First batch\n", "[AI] docs: 同步 OpenAI 官方英文文档");
  fixture.git("merge", "--squash", `origin/${expectedHeadRef}`);
  fixture.git("commit", "-m", `${expectedTitle} (#42)`);
  const mergeSha = fixture.git("rev-parse", "HEAD");
  fixture.git("push", "origin", "main");
  const history = { ...pull, state: "closed", merged: true, merge_commit_sha: mergeSha };
  await fixture.runStep("Prepare the verified automation branch", [history]);
  assert.equal(fixture.git("rev-parse", "HEAD^2"), mergeSha);
  assert.equal(fixture.git("diff", "--name-only", "origin/main...HEAD"), "");
  await writeFile(join(fixture.root, "docs/en/a.md"), "# Second batch\n");
  fixture.output("bash", ["-e", "-o", "pipefail", "-c", yamlLiteral(await writerStep("Synchronize English and publish the batch release"), /^        run: \|$/)]);
  assert.equal(fixture.git("rev-parse", `origin/${expectedHeadRef}`), fixture.git("rev-parse", "HEAD"));
  assert.match(fixture.git("diff", "--name-only", "origin/main...HEAD"), /docs\/en\/a.md/);
  assert.equal(fixture.output("git", ["merge-base", "--is-ancestor", pull.head.sha, "HEAD"], true).exitCode, 0);
});

test("a retained branch already reachable from main fast-forwards without requiring auto-deletion", async (t) => {
  const fixture = await localWriterFixture(t);
  fixture.git("push", "origin", `HEAD:refs/heads/${expectedHeadRef}`);
  await writeFile(join(fixture.root, "new-main.txt"), "New main\n");
  fixture.git("add", "new-main.txt");
  fixture.git("commit", "-m", "[AI] test: advance main");
  fixture.git("push", "origin", "main");
  await fixture.runStep("Prepare the verified automation branch");
  assert.equal(fixture.git("rev-parse", "HEAD"), fixture.git("rev-parse", "origin/main"));
});

test("an orphan containing current main can recover after an older merged branch was deleted", async (t) => {
  const fixture = await localWriterFixture(t);
  useBotIdentity(fixture);
  const current = await fixture.publishFeature("docs/en/a.md", "# New batch\n", "[AI] docs: 同步 OpenAI 官方英文文档");
  const oldMerged = {
    ...current, state: "closed", merged: true, merge_commit_sha: fixture.git("rev-parse", "origin/main"),
    head: { ...current.head, sha: "f".repeat(40) },
  };
  await fixture.runStep("Prepare the verified automation branch", [oldMerged]);
  assert.equal(fixture.git("rev-parse", "HEAD"), current.head.sha);
});

test("no English diff still permits local backlog progress followed by a recoverable draft", async (t) => {
  const writer = await readFile(writerPath, "utf8");
  const checkpoint = await writerStep("Create the draft for a translation-only batch");
  assert.ok(writer.indexOf("Publish completed translations") < writer.indexOf("Create the draft for a translation-only batch"));
  assert.ok(writer.indexOf("Create the draft for a translation-only batch") < writer.indexOf("Verify batch consistency and render"));
  assert.match(checkpoint, /steps.publish.outputs.has_changes == 'true' && steps.draft.outputs.number == ''/);
  const fixture = await localWriterFixture(t);
  useBotIdentity(fixture);
  await fixture.runStep("Prepare the verified automation branch");
  fixture.output("bash", ["-e", "-o", "pipefail", "-c", yamlLiteral(await writerStep("Synchronize English and publish the batch release"), /^        run: \|$/)]);
  assert.equal(fixture.git("ls-remote", "--heads", "origin", `refs/heads/${expectedHeadRef}`), "");
  assert.match(await readFile(fixture.env.GITHUB_OUTPUT!, "utf8"), /has_changes=false/);
  await writeFile(join(fixture.root, "docs/zh/a.md"), "# Completed backlog translation\n");
  await fixture.runStep("Publish completed translations");
  const head = fixture.git("rev-parse", "HEAD");
  const pull = automationPull();
  pull.head.sha = head;
  const events = await runWriterApiStep("Create the draft for a translation-only batch", { existing: false, pull, expectedSha: head });
  assert.equal(events.find((event) => event.kind === "create")?.data.draft, true);
  fixture.git("checkout", "main");
  fixture.git("branch", "-D", expectedHeadRef);
  await fixture.runStep("Prepare the verified automation branch");
  assert.equal(fixture.git("rev-parse", "HEAD"), head);
});

test("maintainer guidance accurately describes first-page budget admission", async () => {
  const readme = await readFile(new URL("../../scripts/README.md", import.meta.url), "utf8");
  assert.match(readme, /首篇选中的页面即使预估超出批次、字符或时间预算也会启动/);
  assert.match(readme, /后续页面遵守这些预算/);
  assert.doesNotMatch(readme, /语义批次和字符预算始终生效/);
});
