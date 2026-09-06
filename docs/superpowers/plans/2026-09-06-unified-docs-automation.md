# Unified Docs Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two drifting documentation workflows with one fail-closed pipeline that synchronizes English, completes the required Chinese translations, opens one PR, dispatches its exact-head quality gate, and lets GitHub auto-merge it.

**Architecture:** A deterministic batch module turns the English diff into the required translation set and checks that set after translation. The writer workflow owns one automation branch and PR, while the read-only CI workflow validates an explicitly supplied PR number and head SHA; GitHub Rulesets remain the final merge gate.

**Tech Stack:** Node.js 24, TypeScript 5.9, Node test runner, pnpm 10, GitHub Actions YAML, `actions/github-script@v9`, GitHub REST and GraphQL APIs.

**Spec:** `docs/superpowers/specs/2026-09-06-unified-docs-automation-design.md`

## Global Constraints

- Use exactly one writer branch: `automation/update-openai-docs`.
- Use exactly one automation PR title: `[AI] docs: 同步并翻译 OpenAI 官方文档`.
- The writer listens only to `schedule` and `workflow_dispatch`; it never listens to `push` or `pull_request`.
- The CI workflow is read-only and never dispatches the writer.
- Continue using the default `GITHUB_TOKEN`; do not add a PAT or GitHub App credential.
- Never push directly to `main`, bypass `main-quality-gate`, or use force push/force-with-lease.
- A batch may merge only when every added/modified English page is `current`, every removed page has no target file or translation record, the changed-path allowlist passes, and the translated head is unchanged.
- Translation secrets are available only to the translation step through `translation-production`.
- Normal budget exhaustion leaves the single PR in draft with `required_complete=false`; a terminal page translation error also leaves it draft and fails the workflow.
- Do not enable auto-merge for the production automation PR until a real canary proves the dispatched `Quality gate` is attached to that PR's current head SHA and satisfies the Ruleset.
- AI-authored commits and PR titles start with `[AI] `.

---

## File Structure

- `scripts/docs-update-batch.ts`: validate the current sync release, prioritize required translations, clean removed translations, and report batch consistency.
- `scripts/translate-docs.ts`: add the `batch` command and structured result-file contract while preserving existing commands.
- `scripts/translation/runner.ts`: safely remove a translated target and its manifest record when its source is removed.
- `scripts/docs-update-pr.ts`: pure validation/state functions shared by the writer workflow and unit tests.
- `scripts/sync-pr-summary.ts`: emit the exact release file path and render one bilingual PR summary.
- `.github/workflows/update-docs.yml`: the only scheduled/manual writer.
- `.github/workflows/ci.yml`: read-only quality gate with a strict dispatched-PR preflight.
- `.github/workflows/sync-docs.yml`: delete after its behavior is composed into `update-docs.yml`.
- `.github/workflows/translate-docs.yml`: delete to remove the second writer and recursive `docs/en` trigger.
- `scripts/tests/docs-update-batch.test.ts`: batch parsing, ordering, removal, and consistency tests.
- `scripts/tests/docs-update-pr.test.ts`: PR provenance, path allowlist, state, and head-drift tests.
- `scripts/tests/workflow-contract.test.ts`: static trigger, permission, concurrency, dispatch, and no-force assertions.
- `scripts/tests/sync-pr-summary.test.ts`: release-result output and unified PR copy tests.
- `scripts/tests/translation-auto.test.ts`: end-to-end batch command tests for completion, budget stop, and terminal failure.
- `README.md`: stable reader-facing description of the unified automatic update behavior.
- `docs/translation-design.md`: maintainer-facing batch semantics and recovery contract.
- `package.json`: expose `translate:batch` and `docs:update:check` commands.

Spec coverage map: Task 2 handles 本轮删除 and consistency; Task 3 distinguishes 预算耗尽 from terminal failure; Tasks 4-6 enforce draft state, exact head SHA, 可信代码与密钥边界, and 防递归; Task 8 performs local release checks; Task 9 covers Allow auto-merge, 真实产品验收, staged activation, and 回滚.

### Task 1: Make the sync release an explicit batch artifact

**Files:**
- Modify: `scripts/sync-pr-summary.ts`
- Modify: `scripts/tests/sync-pr-summary.test.ts`

**Interfaces:**
- Consumes: existing `SyncDiffSummary`, `SyncRelease`, `renderSyncRelease(summary, manifest)`.
- Produces: `renderUnifiedPullRequestBody(summary: SyncDiffSummary, translation: BatchPullRequestStatus): string`, `writeReleasePath(outputPath: string, releasePath: string): Promise<void>`, `main()` option `--release-output PATH`, and a UTF-8 file containing the exact generated release path.

- [ ] **Step 1: Write failing tests for the explicit release output and stable bilingual summary**

```ts
test("unified PR body reports one batch and its translation readiness", () => {
  const body = renderUnifiedPullRequestBody(
    { added: ["docs/en/new.md"], modified: [], removed: [] },
    { complete: false, issues: ["pending:docs/en/new.md"], translated: [] },
  );
  assert.match(body, /同一批次/);
  assert.match(body, /required_complete=false/);
  assert.match(body, /pending:docs\/en\/new\.md/);
  assert.doesNotMatch(body, /维护者审核/);
});

test("release output points at the release written for this invocation", async () => {
  const root = await mkdtemp(join(tmpdir(), "sync-release-output-"));
  try {
    const resultPath = join(root, "release-path.txt");
    const releasePath = join(root, "2026-09-06T00-00-00-000Z.json");
    await writeReleasePath(resultPath, releasePath);
    assert.equal(await readFile(resultPath, "utf8"), `${releasePath}\n`);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
```

- [ ] **Step 2: Run the focused tests and confirm the new contract is absent**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/sync-pr-summary.test.ts`

Expected: FAIL because `renderUnifiedPullRequestBody` and `--release-output` do not exist.

- [ ] **Step 3: Add the exact status type, renderer, and CLI output option**

```ts
export interface BatchPullRequestStatus {
  complete: boolean;
  issues: string[];
  translated: string[];
}

export function renderUnifiedPullRequestBody(
  summary: SyncDiffSummary,
  translation: BatchPullRequestStatus,
): string {
  return [
    "## 本轮文档更新",
    "",
    "英文同步和对应中文翻译在同一批次、同一个 PR 中完成。",
    "",
    `- 新增英文：${summary.added.length}`,
    `- 修改英文：${summary.modified.length}`,
    `- 删除英文：${summary.removed.length}`,
    `- required_complete=${translation.complete}`,
    "",
    "## 当前阻塞项",
    "",
    ...(translation.issues.length ? translation.issues.map(markdownPath) : ["无。"]),
    "",
    "## 本轮已翻译",
    "",
    ...(translation.translated.length ? translation.translated.map(markdownPath) : ["无。"]),
    "",
    "只有本轮中英文一致且当前 head 的 `Quality gate` 通过后，GitHub 才会自动合并。",
    "",
  ].join("\n");
}
```

Extend `CliOptions` with `releaseOutputPath?: string`; accept `--release-output` only together with `--release-dir`; implement `writeReleasePath` as `await writeFile(outputPath, `${releasePath}\n`, "utf8")`; call it immediately after writing the release JSON.

- [ ] **Step 4: Run the focused tests**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/sync-pr-summary.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the batch artifact contract**

```bash
git add scripts/sync-pr-summary.ts scripts/tests/sync-pr-summary.test.ts
git commit -m "[AI] feat: expose documentation sync batch artifact"
```

### Task 2: Add safe removal and deterministic batch consistency

**Files:**
- Create: `scripts/docs-update-batch.ts`
- Create: `scripts/tests/docs-update-batch.test.ts`
- Modify: `scripts/translation/runner.ts`
- Modify: `scripts/tests/translation-runner.test.ts`

**Interfaces:**
- Consumes: `SyncRelease`, `TranslationPageInspection`, `TranslationWorkspaceSnapshot`, `loadTranslationWorkspace()`.
- Produces: `loadDocsUpdateBatch(path: string): Promise<SyncRelease>`, `requiredSourcePaths(batch: SyncRelease): string[]`, `inspectDocsUpdateBatch(batch: SyncRelease, entries: TranslationPageInspection[], existingTargetPaths?: ReadonlySet<string>): DocsUpdateBatchReport`, `inspectDocsUpdateBatchWorkspace(batch: SyncRelease, workspace: TranslationWorkspaceSnapshot): Promise<DocsUpdateBatchReport>`, and `removeTranslationPage(workspace: TranslationWorkspaceSnapshot, sourceUrl: string): Promise<TranslationRemovalResult>`.

```ts
export interface DocsUpdateBatchIssue {
  kind: "required-not-current" | "removed-record-present" | "removed-target-present";
  sourcePath: string;
  state?: TranslationPageState;
  targetPath: string;
}

export interface DocsUpdateBatchReport {
  complete: boolean;
  issues: DocsUpdateBatchIssue[];
  requiredSourcePaths: string[];
  removedSourcePaths: string[];
}

export interface TranslationRemovalResult {
  removedRecord: boolean;
  removedTarget: boolean;
  sourceUrl: string;
  targetPath: string;
}
```

- [ ] **Step 1: Write failing removal safety tests**

```ts
test("removal deletes a matching target and manifest record", async () => {
  const result = await removeTranslationPage(workspace, SOURCE_URL);
  assert.deepEqual(result, {
    removedRecord: true,
    removedTarget: true,
    sourceUrl: SOURCE_URL,
    targetPath: TARGET_PATH,
  });
  await assert.rejects(readFile(join(root, TARGET_PATH)), { code: "ENOENT" });
  assert.equal(manifest.pages[SOURCE_URL], undefined);
});

test("removal refuses a locally modified target", async () => {
  await writeFile(join(root, TARGET_PATH), "人工修改\n");
  await assert.rejects(removeTranslationPage(workspace, SOURCE_URL), /目标 SHA 不一致/);
});
```

- [ ] **Step 2: Run the runner tests and verify they fail for the missing function**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/translation-runner.test.ts`

Expected: FAIL because `removeTranslationPage` is not exported.

- [ ] **Step 3: Implement fail-closed removal in the runner**

Reload the workspace, require an entry whose `source?.status === "removed"` and whose source URL matches, reject a symlink/non-file target, compare any existing target content SHA to `record.targetSha256`, unlink only that exact file, remove only that source URL from a sorted manifest copy, and atomically rewrite the manifest. If both record and target are already absent, return both flags as `false` so retries are idempotent.

```ts
export async function removeTranslationPage(
  workspace: TranslationWorkspaceSnapshot,
  sourceUrl: string,
): Promise<TranslationRemovalResult> {
  const fresh = await loadTranslationWorkspace(workspace.repositoryRoot, workspace.configPath);
  const entry = fresh.entries.find((candidate) => candidate.source?.sourceUrl === sourceUrl);
  if (!entry?.source || entry.source.status !== "removed") {
    throw new Error(`英文来源未登记为 removed，拒绝删除译文：${sourceUrl}`);
  }
  const target = repositoryPath(fresh.repositoryRoot, entry.targetPath, "待删除中文译文");
  const targetContent = await readFile(target, "utf8").catch((error: unknown) => {
    if (isErrno(error, "ENOENT")) return undefined;
    throw error;
  });
  if (targetContent !== undefined && !entry.record) {
    throw new Error(`中文目标没有翻译记录，拒绝删除：${entry.targetPath}`);
  }
  if (targetContent !== undefined && sha256(targetContent) !== entry.record?.targetSha256) {
    throw new Error(`中文目标 SHA 不一致，拒绝删除：${entry.targetPath}`);
  }
  if (targetContent !== undefined) {
    await assertSafeExistingTarget(fresh.repositoryRoot, target, "待删除中文译文");
    await unlink(target);
  }
  if (entry.record) {
    const pages = { ...fresh.translationManifest.pages };
    delete pages[sourceUrl];
    const manifest = {
      ...fresh.translationManifest,
      pages: Object.fromEntries(
        Object.entries(pages).sort(([left], [right]) => left.localeCompare(right, "en")),
      ),
    };
    await atomicWriteRepositoryFile(
      fresh.repositoryRoot,
      fresh.config.translationManifestPath,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "中文 translation manifest",
    );
  }
  return {
    removedRecord: entry.record !== undefined,
    removedTarget: targetContent !== undefined,
    sourceUrl,
    targetPath: entry.targetPath,
  };
}
```

- [ ] **Step 4: Run the runner tests**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/translation-runner.test.ts`

Expected: PASS, including idempotence, modified-target refusal, and symlink refusal.

- [ ] **Step 5: Write failing batch parser and consistency tests**

```ts
test("required paths contain only added and modified Markdown pages", () => {
  assert.deepEqual(requiredSourcePaths(batch), ["docs/en/a.md", "docs/en/b.md"]);
});

test("batch consistency lists every non-current required page", () => {
  const report = inspectDocsUpdateBatch(batch, entries);
  assert.equal(report.complete, false);
  assert.deepEqual(report.issues.map((issue) => [issue.kind, issue.sourcePath, issue.state]), [
    ["required-not-current", "docs/en/a.md", "stale-source"],
  ]);
});

test("removed page blocks while either target or record remains", () => {
  assert.deepEqual(inspectDocsUpdateBatch(batch, entries).issues.map((issue) => issue.kind), [
    "removed-record-present",
    "removed-target-present",
  ]);
});
```

- [ ] **Step 6: Run the new batch tests and verify they fail**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/docs-update-batch.test.ts`

Expected: FAIL because `scripts/docs-update-batch.ts` does not exist.

- [ ] **Step 7: Implement strict release validation and consistency reporting**

`loadDocsUpdateBatch` must reject unknown keys, non-`docs/en/**/*.md` article paths, duplicate paths/source URLs across sections, invalid timestamps, and unsupported schema shapes. `requiredSourcePaths` returns a locale-sorted unique union of `added` and `modified`. `inspectDocsUpdateBatch` joins by `source.sourcePath`; required pages pass only with `state === "current"`; removed pages pass only when `record` is absent and `existingTargetPaths` does not contain the mirrored target. `inspectDocsUpdateBatchWorkspace` uses `lstat` on each removed target, rejects symlinks/non-files, builds that set, and calls the pure function.

- [ ] **Step 8: Run both focused test files**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/docs-update-batch.test.ts scripts/tests/translation-runner.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit removal and consistency behavior**

```bash
git add scripts/docs-update-batch.ts scripts/translation/runner.ts scripts/tests/docs-update-batch.test.ts scripts/tests/translation-runner.test.ts
git commit -m "[AI] feat: enforce documentation batch consistency"
```

### Task 3: Add the resumable required-first translation command

**Files:**
- Modify: `scripts/translate-docs.ts`
- Modify: `scripts/tests/translation-auto.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 2's `loadDocsUpdateBatch`, `requiredSourcePaths`, `inspectDocsUpdateBatchWorkspace`, and `removeTranslationPage`.
- Produces: CLI command `batch`, options `--release PATH` and `--result PATH`, and `TranslationBatchRunResult` JSON.

```ts
export interface TranslationBatchRunResult {
  complete: boolean;
  issues: DocsUpdateBatchIssue[];
  removed: string[];
  schemaVersion: 1;
  stopReason: AutomaticTranslationStopReason | null;
  translated: string[];
}
```

- [ ] **Step 1: Write failing CLI parser and required-first tests**

```ts
test("batch requires release and result paths", () => {
  assert.throws(() => parseCliOptions(["batch", "--limit", "100"]), /--release.*--result/);
});

test("required batch page runs before an older stale backlog page", async () => {
  const result = await runBatchFixture({ required: SECOND_SOURCE_PATH, characterBudget: 8 });
  assert.deepEqual(result.translated, [SECOND_SOURCE_PATH]);
  assert.equal(result.complete, true);
  assert.equal(await exists(join(root, SECOND_TARGET_PATH)), true);
});

test("budget stop writes an incomplete successful result", async () => {
  const result = await runBatchFixture({ required: [SOURCE_PATH, SECOND_SOURCE_PATH], characterBudget: 5 });
  assert.equal(result.complete, false);
  assert.equal(result.stopReason, "character-budget");
  assert.match(result.issues[0]?.sourcePath ?? "", /second-page/);
});
```

- [ ] **Step 2: Run the translation auto tests and confirm the new command fails**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/translation-auto.test.ts`

Expected: FAIL because `batch`, `--release`, and `--result` are unknown.

- [ ] **Step 3: Extend parsing without changing existing `auto` behavior**

Add `"batch"` to `Command`; add `releasePath?: string` and `resultPath?: string` to `CliOptions`. Require both options only for `batch`, allow the same `--limit 100`, `--max-batches`, `--max-characters`, and `--time-budget-minutes` budget flags as `auto`, and reject `--match`/`--commit` for `batch`.

- [ ] **Step 4: Implement required-first ordering and result persistence**

Extend the candidate comparator with a first sort key derived from a required-path map:

```ts
export function automaticTranslationCandidates(
  entries: TranslationPageInspection[],
  section: SourceSection | "all" = "all",
  prioritySourcePaths: readonly string[] = [],
  requiredSourcePaths: readonly string[] = [],
): TranslationPageInspection[];
```

For `batch()`: load the release; remove release `removed` entries first; load a fresh workspace; select required added/modified candidates before all backlog; reuse the existing workload budget and production retry policies; reload the workspace after translation; inspect batch consistency; atomically write the `TranslationBatchRunResult` to `--result`. A terminal provider/page error must still write a result with `complete:false`, then rethrow so the process exits non-zero. Budget exhaustion writes the incomplete result and exits zero.

- [ ] **Step 5: Add the package command**

```json
"translate:batch": "node --env-file-if-exists=.env scripts/translate-docs.ts batch"
```

- [ ] **Step 6: Run parser, ordering, budget, removal, and terminal-error tests**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/translation-auto.test.ts scripts/tests/docs-update-batch.test.ts`

Expected: PASS; the terminal-error fixture observes a rejected command and a persisted `complete:false` result.

- [ ] **Step 7: Run type checking**

Run: `pnpm typecheck`

Expected: exit 0.

- [ ] **Step 8: Commit the batch command**

```bash
git add package.json scripts/translate-docs.ts scripts/tests/translation-auto.test.ts
git commit -m "[AI] feat: translate required documentation changes first"
```

### Task 4: Encode the automation PR trust and state contract

**Files:**
- Create: `scripts/docs-update-pr.ts`
- Create: `scripts/tests/docs-update-pr.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: GitHub API data normalized by the workflow.
- Produces: `assertAutomationPullRequest(input: AutomationPullRequestInput): void`, `assertAllowedAutomationPaths(paths: readonly string[]): void`, `decideAutomationPhase(input: AutomationPhaseInput): AutomationPhase`, and CLI `check-pr`/`check-paths` JSON entry points.

```ts
export interface AutomationPullRequestInput {
  authorLogin: "github-actions[bot]";
  baseRef: "main";
  headRef: "automation/update-openai-docs";
  headSha: string;
  open: boolean;
  title: "[AI] docs: 同步并翻译 OpenAI 官方文档";
}

export type AutomationPhase = "blocked-draft" | "ready-for-ci";

export interface AutomationPhaseInput {
  batchComplete: boolean;
  headMatches: boolean;
  translationFailed: boolean;
}
```

- [ ] **Step 1: Write failing provenance, path, and state tests**

```ts
test("only generated documentation paths are allowed", () => {
  assert.doesNotThrow(() => assertAllowedAutomationPaths([
    "docs/en/a.md", "docs/zh/a.md", "docs/updates/batch.json",
  ]));
  assert.throws(() => assertAllowedAutomationPaths(["scripts/translate-docs.ts"]), /禁止路径/);
});

test("head drift blocks readiness", () => {
  assert.equal(decideAutomationPhase({ batchComplete: true, headMatches: false, translationFailed: false }), "blocked-draft");
});

test("only a complete unchanged batch is ready", () => {
  assert.equal(decideAutomationPhase({ batchComplete: true, headMatches: true, translationFailed: false }), "ready-for-ci");
});
```

- [ ] **Step 2: Run the focused tests and verify the module is absent**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/docs-update-pr.test.ts`

Expected: FAIL because `scripts/docs-update-pr.ts` does not exist.

- [ ] **Step 3: Implement exact validation and newline-delimited CLI outputs**

`assertAutomationPullRequest` rejects a closed PR, forked/unexpected head, wrong base, wrong title, wrong author, or non-40/64-hex head SHA. `assertAllowedAutomationPaths` accepts only `docs/en/**`, `docs/zh/**`, and `docs/updates/**`, rejects an empty/absolute/traversing path, and reports every rejected path. `decideAutomationPhase` returns `ready-for-ci` only for `{batchComplete:true, headMatches:true, translationFailed:false}`.

The CLI reads normalized JSON from a required `--input` path. `check-pr` prints `trusted=true`; `check-paths` prints `allowed=true`; invalid input exits non-zero with the deterministic validation message.

- [ ] **Step 4: Add the package command and run tests**

```json
"docs:update:check": "node scripts/docs-update-pr.ts"
```

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/docs-update-pr.test.ts && pnpm typecheck`

Expected: both commands exit 0.

- [ ] **Step 5: Commit the trust boundary**

```bash
git add package.json scripts/docs-update-pr.ts scripts/tests/docs-update-pr.test.ts
git commit -m "[AI] feat: validate documentation automation state"
```

### Task 5: Make CI dispatch verify the exact PR head

**Files:**
- Modify: `.github/workflows/ci.yml`
- Create: `scripts/tests/workflow-contract.test.ts`

**Interfaces:**
- Consumes: dispatched inputs `automation_pr`, `expected_head_sha`, `expected_head_ref`, `expected_title`.
- Produces: the existing required check named `Quality gate`, attached to the checked-out `expected_head_sha`, with read-only permissions.

- [ ] **Step 1: Write failing static workflow contract tests**

```ts
test("CI dispatch requires exact automation PR identity", async () => {
  const yaml = await readFile(".github/workflows/ci.yml", "utf8");
  for (const input of ["automation_pr", "expected_head_sha", "expected_head_ref", "expected_title"]) {
    assert.match(yaml, new RegExp(`${input}:\\n\\s+required: true`));
  }
  assert.match(yaml, /permissions:\n\s+contents: read/);
  assert.doesNotMatch(yaml, /contents: write|pull-requests: write|actions: write/);
  assert.match(yaml, /ref: \$\{\{ inputs\.expected_head_sha \|\| github\.sha \}\}/);
});
```

- [ ] **Step 2: Run the workflow test and verify required inputs are missing**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts`

Expected: FAIL on the first missing dispatch input.

- [ ] **Step 3: Add strict dispatch inputs and checkout**

```yaml
on:
  workflow_dispatch:
    inputs:
      automation_pr:
        description: Automation PR number
        required: true
        type: string
      expected_head_sha:
        description: Exact automation PR head SHA
        required: true
        type: string
      expected_head_ref:
        description: Exact automation branch
        required: true
        type: string
      expected_title:
        description: Exact automation PR title
        required: true
        type: string
```

Set checkout `ref` to `${{ inputs.expected_head_sha || github.sha }}`. Add a dispatch-only `actions/github-script` preflight before dependency installation: fetch PR number; require open state, `main` base, exact title, exact `automation/update-openai-docs` head ref, and `pull.head.sha === inputs.expected_head_sha`; require the checked-out `git rev-parse HEAD` to equal the same SHA. The step receives no secrets and the workflow retains only `contents: read`.

- [ ] **Step 4: Run the static contract and root CI commands**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts && pnpm typecheck && pnpm test`

Expected: 0 exits; test total is greater than the 113-test baseline.

- [ ] **Step 5: Commit dispatched CI preflight**

```bash
git add .github/workflows/ci.yml scripts/tests/workflow-contract.test.ts
git commit -m "[AI] feat: verify dispatched CI against the PR head"
```

### Task 6: Replace both writers with the unified fail-closed workflow

**Files:**
- Create: `.github/workflows/update-docs.yml`
- Delete: `.github/workflows/sync-docs.yml`
- Delete: `.github/workflows/translate-docs.yml`
- Modify: `scripts/tests/workflow-contract.test.ts`

**Interfaces:**
- Consumes: Tasks 1-5 CLI contracts and GitHub REST/GraphQL APIs.
- Produces: one serial writer, one branch, one draft/ready PR, one explicit CI dispatch, and one auto-merge request.

- [ ] **Step 1: Add failing topology and safety tests**

```ts
test("unified writer is the only scheduled docs writer", async () => {
  const writer = await readFile(".github/workflows/update-docs.yml", "utf8");
  assert.match(writer, /schedule:/);
  assert.match(writer, /workflow_dispatch:/);
  assert.doesNotMatch(writer, /^\s+push:/m);
  assert.doesNotMatch(writer, /^\s+pull_request:/m);
  assert.match(writer, /group: update-openai-docs/);
  assert.match(writer, /cancel-in-progress: false/);
  assert.doesNotMatch(writer, /--force(?:-with-lease)?/);
  await assert.rejects(access(".github/workflows/sync-docs.yml"), { code: "ENOENT" });
  await assert.rejects(access(".github/workflows/translate-docs.yml"), { code: "ENOENT" });
});
```

- [ ] **Step 2: Run the contract test and verify the old topology fails**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts`

Expected: FAIL because the new writer is absent and both old writers exist.

- [ ] **Step 3: Implement the trusted code and secret boundary（可信代码与密钥边界）**

Create `update-docs.yml` with `contents: write`, `pull-requests: write`, and `actions: write`; `concurrency.group: update-openai-docs`; and the existing midnight Asia/Shanghai cron `0 16 * * *`. Start from trusted `main`, install with `--frozen-lockfile --ignore-scripts`, and run `pnpm typecheck`, `pnpm test`, and `pnpm translate:check` before secrets.

Query an open PR for `automation/update-openai-docs`. If present, normalize its metadata to JSON and call `docs:update:check -- check-pr`; fetch its branch; require `origin/main` to be an ancestor; fast-forward or create a regular merge commit from `origin/main`; run `git diff --name-only origin/main...HEAD` through `check-paths`. If absent, require the remote branch to be absent or exactly equal to `origin/main`, then create it from `origin/main`. Never reset a divergent remote branch.

- [ ] **Step 4: Implement sync, batch translation, and incremental persistence**

Run `pnpm docs:sync -- --prune --allow-large-prune`; generate the release with `--release-output`; commit English/release changes as `[AI] docs: 同步 OpenAI 官方英文文档`; then run plain `git push origin HEAD:refs/heads/automation/update-openai-docs`. A concurrent remote change makes the normal fast-forward push fail, which is the desired fail-closed behavior. Run `pnpm translate:batch` in `translation-production`, with provider variables and API keys scoped only to that step and `continue-on-error: true`. Commit completed removals/translations as `[AI] docs: 更新本轮 OpenAI 中文翻译`; push again with the same plain fast-forward command.

Do not commit the temporary result JSON. After the translation step, run `pnpm docs:status`, `pnpm translate:check`, the batch consistency command, changed-path validation, and `git rev-parse HEAD` capture. A non-zero translation outcome records failure after the PR update; an incomplete budget result remains a successful workflow run.

- [ ] **Step 5: Implement one PR lifecycle and current-head dispatch**

Create or update the exact PR title and unified body from Task 1. Set `draft:true` for incomplete/failure state; use the GraphQL `markPullRequestReadyForReview` mutation only when complete. Immediately refetch the PR and require its head SHA equals the captured pushed SHA.

Only for complete state: dispatch `.github/workflows/ci.yml` with ref `automation/update-openai-docs` and the four exact inputs. Refetch the PR immediately before GraphQL `enablePullRequestAutoMerge`, require the head OID still equals the captured pushed SHA, and request squash auto-merge only when `env.AUTO_MERGE_ROLLOUT == 'enabled'` or the manual boolean input `enable_auto_merge` is true. The initial committed value is `AUTO_MERGE_ROLLOUT: canary`; this lets the real canary prove CI/Ruleset association before a follow-up PR changes it to `enabled`. Do not poll or manually merge. If translation failed, update the draft PR first and finish with `exit 1`.

- [ ] **Step 6: Delete the old writers and complete static assertions**

Delete both old workflow files. Extend the test to assert the writer dispatches only `ci.yml`, CI never dispatches `update-docs.yml`, secrets occur only in the named translation step, the writer uses `automation/update-openai-docs`, the initial rollout value is `canary`, auto-merge is guarded by the rollout/manual condition, and no workflow contains `automation/sync-openai-docs` or `automation/translate-openai-docs`.

- [ ] **Step 7: Run workflow contracts and complete repository checks**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts && pnpm typecheck && pnpm test && pnpm docs:status && pnpm translate:check`

Expected: all commands exit 0.

- [ ] **Step 8: Commit the unified writer**

```bash
git add .github/workflows/update-docs.yml .github/workflows/ci.yml .github/workflows/sync-docs.yml .github/workflows/translate-docs.yml scripts/tests/workflow-contract.test.ts
git commit -m "[AI] feat: unify documentation sync and translation"
```

### Task 7: Update durable reader and maintainer documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/translation-design.md`
- Test: `scripts/tests/workflow-contract.test.ts`

**Interfaces:**
- Consumes: the implemented workflow behavior.
- Produces: reader-facing long-lived wording and maintainer-facing operational facts.

- [ ] **Step 1: Add a failing README durability assertion**

```ts
test("README describes one automatic checked update without volatile article details", async () => {
  const readme = await readFile("README.md", "utf8");
  assert.match(readme, /英文同步和对应的中文翻译会放在同一个更新中/);
  assert.match(readme, /检查通过后自动合并/);
  assert.doesNotMatch(readme, /等待审核|已有翻译 PR|维护者审核/);
});
```

- [ ] **Step 2: Run the test and verify the old manual-review wording fails**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts`

Expected: FAIL because README still describes separate PRs and maintainer review.

- [ ] **Step 3: Replace only the workflow explanation in README**

Use durable copy that does not list article names, current counts, or provider-specific implementation details:

```markdown
这个项目会定期检查官方文档。发现变化时，英文同步和对应的中文翻译会放在同一个更新中；只有内容一致性和项目检查都通过后，这次更新才会自动合并。若翻译或检查失败，更新会停留在待处理状态，不会把未完成的中英文内容发布出去。
```

Keep the existing primary link to `https://www.openai-api-chinese.com` and the official-docs disclaimer unchanged.

- [ ] **Step 4: Update maintainer design facts**

In `docs/translation-design.md`, replace the old separate translation-PR section with the required-first batch rule, safe removal contract, structured result semantics, single draft PR continuation, dispatched exact-head CI, and no-force behavior. State that `translate:check` remains a structural gate and the batch check is the merge-readiness gate.

- [ ] **Step 5: Run documentation contract tests**

Run: `node --test --test-concurrency=1 --test-isolation=none scripts/tests/workflow-contract.test.ts && pnpm docs:status && pnpm translate:check`

Expected: all commands exit 0.

- [ ] **Step 6: Commit documentation**

```bash
git add README.md docs/translation-design.md scripts/tests/workflow-contract.test.ts docs/superpowers/specs/2026-09-06-unified-docs-automation-design.md docs/superpowers/plans/2026-09-06-unified-docs-automation.md
git commit -m "[AI] docs: document unified documentation automation"
```

### Task 8: Verify locally, open the implementation PR, and stage the canary

**Files:**
- Review: all files changed by Tasks 1-7
- No production setting changes in the local-verification steps

**Interfaces:**
- Consumes: the complete branch and repository Ruleset.
- Produces: a reviewable implementation PR; it does not yet prove production auto-merge behavior.

- [ ] **Step 1: Inspect the exact branch and change scope**

Run: `git status --short && git branch --show-current && git diff --stat origin/main...HEAD && git diff --name-only origin/main...HEAD`

Expected: branch is `codex/unified-docs-automation`; only files listed in this plan are changed; the worktree is clean after the documentation commit.

- [ ] **Step 2: Run the complete local quality gate**

Run: `pnpm typecheck && pnpm test && pnpm docs:status && pnpm translate:check && pnpm web:typecheck && pnpm web:lint && pnpm web:test && pnpm web:build`

Expected: every command exits 0; record the final test count and web build result in the PR body.

- [ ] **Step 3: Review workflow permissions and event topology from the final diff**

Run: `git diff origin/main...HEAD -- .github/workflows scripts/docs-update-batch.ts scripts/docs-update-pr.ts scripts/translate-docs.ts scripts/translation/runner.ts`

Expected: one writer, no push/pull-request trigger on the writer, read-only CI, secrets confined to translation, exact-head checks before dispatch/auto-merge, and no force push syntax.

- [ ] **Step 4: Push the feature branch and create the implementation PR after user authorization**

```bash
git push --set-upstream origin codex/unified-docs-automation
gh pr create \
  --base main \
  --head codex/unified-docs-automation \
  --title "[AI] feat: 统一文档同步与翻译自动化" \
  --body "统一英文同步和中文翻译为单一自动化 PR；加入本轮一致性门禁、精确 head CI 调度、失败续跑和 canary 自动合并开关。验证证据：附上本任务 Step 2 的测试数量与 web build 结果。"
```

Expected: one open implementation PR; do not merge it or enable repository auto-merge in this step.

- [ ] **Step 5: Verify the implementation PR's required checks without manual reruns**

Run: `gh pr checks codex/unified-docs-automation`

Expected: `Quality gate` completes successfully. If it fails, diagnose on the feature branch; do not bypass the Ruleset.

### Task 9: Enable the setting and perform real-product UAT

**Files:**
- No repository file edits unless UAT finds a defect

**Interfaces:**
- Consumes: merged implementation PR, GitHub repository settings, writer workflow, Ruleset, and deployment.
- Produces: evidence that the real unattended path works; only then may the production schedule and auto-merge request path remain active.

- [ ] **Step 1: Merge the implementation PR only after explicit user authorization**

Run: `gh pr merge codex/unified-docs-automation --squash --delete-branch=false`

Expected: PR merged through `main-quality-gate`; no direct push to `main`.

- [ ] **Step 2: Re-open GitHub settings in the built-in browser and obtain immediate confirmation before saving**

Navigate to `jiahim/OpenAI-API-Chinese` → Settings → General → Pull Requests. Recheck repository name, `Allow auto-merge` current value, `main-quality-gate`, and `translation-production` required reviewers. Present the exact pending change—enable only `Allow auto-merge`—and wait for the user's immediate confirmation before clicking Save.

- [ ] **Step 3: Enable only repository auto-merge**

Expected: `allow_auto_merge=true`; Ruleset still requires `Quality gate` with zero approving reviews; Environment still has no required reviewer. Record screenshots or API readback, but do not change any other repository setting.

- [ ] **Step 4: Start a manual canary with production auto-merge held back**

Keep the committed `AUTO_MERGE_ROLLOUT: canary` value and dispatch `update-docs.yml` with `enable_auto_merge: false`. Confirm exactly one `automation/update-openai-docs` branch and one draft/ready PR, and record its PR number and head SHA. A scheduled run during this phase may update the same PR and dispatch CI, but the rollout guard must prevent it from requesting auto-merge.

- [ ] **Step 5: Prove the dispatched quality gate is attached to the exact head**

Run: `gh pr view automation/update-openai-docs --json headRefOid,statusCheckRollup,isDraft,files`

Expected: `headRefOid` equals the dispatch input and the successful check named `Quality gate` reports that same commit; files are limited to `docs/en/**`, `docs/zh/**`, and `docs/updates/**`. If GitHub does not count this check for the Ruleset, keep auto-merge disabled and revise the CI dispatch design.

- [ ] **Step 6: Reconfirm the blocked draft evidence without inducing a production failure**

Run the Task 3 terminal-error and budget fixtures again and attach their command output to the implementation PR. Expected: budget exhaustion exits zero with `complete:false`; terminal provider failure persists `complete:false` and exits non-zero; the workflow contract proves neither state reaches the dispatch/auto-merge step. If a natural production batch later exhausts its budget, use that run to add real same-PR continuation evidence; do not deliberately corrupt production credentials or official source data.

- [ ] **Step 7: Allow the canary to auto-merge and inspect recursion behavior**

After the exact-head evidence passes, rerun the same workflow with `enable_auto_merge: true`; it must revalidate the unchanged PR head before requesting auto-merge. Expected: GitHub merges only after `Quality gate`; the `main` push starts only read-only CI; no new writer run, second sync PR, or second translation PR appears.

- [ ] **Step 8: Verify the deployed reader experience**

Open `https://www.openai-api-chinese.com`, locate one page from the canary's changed paths through site navigation, and verify both language routes render the merged head without broken navigation. This is observation only; do not hard-code the page into README.

- [ ] **Step 9: Activate unattended scheduled auto-merge with a follow-up PR**

Change only `AUTO_MERGE_ROLLOUT: canary` to `AUTO_MERGE_ROLLOUT: enabled`, update the static assertion, run `pnpm typecheck && pnpm test`, and create a PR titled `[AI] chore: 启用文档更新自动合并`. Merge it only after explicit user authorization and required checks. This code change, rather than an extra repository variable, activates auto-merge for scheduled runs.

- [ ] **Step 10: Close or register verification debt**

If all UAT evidence passes, leave the schedule active and record the workflow run, PR, head SHA, check run, merge commit, and deployment URL in the implementation PR. If any step fails, change the writer to manual-only or restore `AUTO_MERGE_ROLLOUT: canary` through a PR, leave the automation PR intact for diagnosis, and record: risk, owner, due point, and the exact evidence required to close the debt.
