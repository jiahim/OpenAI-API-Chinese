# Handoff：OpenAI 中文文档翻译库

> **给后续执行者：** 官方英文镜像同步器、自动同步 PR 和稳定的质量门已经完成首次远端验收。当前先合入中文同步摘要改造并刷新自动同步 PR #6，再配置 `main` Ruleset。不要恢复旧 Python 翻译脚本，也不要清洗 `docs/en` 中的官方原文格式。

**更新时间：** 2026-08-24（Asia/Singapore）

## 1. 当前阶段结论

英文来源同步模块与自动同步 PR 工作流均已合入远端：

- PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/3`。
- 合并提交：`8f32e86`（`Merge pull request #3 from jiahim/feat-auto-translate`）。
- PR #3 的 `Quality gate` 已成功；合并后的本地 `main` 也完成 typecheck、测试和 manifest 状态复验。
- 自动同步 PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/4`。
- 自动同步合并提交：`ee93ed0`（`Merge pull request #4 from jiahim/codex/auto-sync-pr`）。
- 测试稳定性 PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/5`；合并提交：`db395f6`。
- 测试文件保留进程隔离并通过 `--test-concurrency=1` 串行执行；PR 与合并后的 `main` CI 均成功。
- Actions 已允许 `GITHUB_TOKEN` 创建 PR。首次同步验收 run `32710251773` 成功，自动创建 PR #6，并显式触发成功的 `Quality gate` run `32710653491`。
- 自动同步 PR #6 当前包含 421 篇官方页面：新增 3 篇、内容更新 98 篇、删除 0 篇；尚未合入 `main`。
- 当前中文摘要改造分支：`codex/chinese-sync-summary`；当前隔离工作树：`.worktrees/codex-chinese-sync-summary`。
- GitHub `main` 在 PR #3 合并前没有 Ruleset；完成自动同步 PR 的远端验收后再设置门禁。
- 英文镜像：418 篇，约 88.2 MiB，0 个 removed。
- TypeScript typecheck 通过，28 项测试通过。

中文生成、翻译提示词、术语策略和增量译文尚未实现。中文同步摘要、PR #6 合入和 Ruleset 是进入翻译模块设计前的最后一组基础设施步骤。

## 2. 已完成能力

### 2.1 目录与来源数据

- 旧版手工中文文档及图片已迁移到 `docs/legacy/`。
- 官方英文 Markdown 镜像位于 `docs/en/`。
- 来源索引：
  - `https://developers.openai.com/api/docs/llms.txt`
  - `https://developers.openai.com/api/reference/llms.txt`
- guides：180 篇。
- reference：238 篇。
- `.source-manifest.json` 记录 URL、本地路径、栏目、哈希、大小、来源时间、active/removed 状态。

URL 按官方路径直接映射，不修改 Markdown 正文：

```text
https://developers.openai.com/api/docs/guides/images-vision.md
→ docs/en/api/docs/guides/images-vision.md
```

### 2.2 TypeScript 同步器

核心文件：

- `scripts/sync-docs.ts`
- `scripts/fetch-coordinator.ts`
- `scripts/docs.config.json`
- `scripts/tests/fetch-coordinator.test.ts`
- `scripts/tests/sync-docs.test.ts`

命令：

```bash
pnpm docs:bootstrap
pnpm docs:status
pnpm docs:check
pnpm docs:sync
pnpm typecheck
pnpm test
```

同步器支持：

- bootstrap、status、check、sync 和完整扫描 prune。
- `--section`、`--match`、`--limit`、`--prune`。
- 低并发、全局请求间隔、网络/429/5xx 重试和 `Retry-After`。
- Vercel `403 + x-vercel-mitigated: deny` 全局熔断。
- 下载阶段全部成功后才进入文件提交阶段。
- 部分扫描不会判断 removed，也不会 prune 未扫描页面。
- 页面失败后停止派发新的页面请求。

### 2.3 删除与响应安全

代码审查后补齐以下保护：

- 空索引或无法解析出 Markdown 页面的索引直接中止。
- 单个栏目拟移除超过 20 页或 10% 时自动中止。
- 真实的大规模删除必须显式使用 `--allow-large-prune`。
- prune 不信任 manifest 的历史 `localPath`，而是从受验证的官方 `.md` URL 重新计算。
- manifest key 必须等于记录内 `sourceUrl`，URL 路径必须匹配记录栏目。
- 删除目标必须严格位于 `sourceRoot`，且不能与本轮索引或有效页面冲突。
- 空白页面、HTML/XHTML 响应或明显 HTML 文档正文不会覆盖 Markdown 镜像。

提交阶段对单个文件使用临时文件和原子 rename，但多个文件之间不承诺数据库式事务性。磁盘写满、权限变化或进程被强制中断后，应重新运行 status/check/sync 核对恢复。

### 2.4 自动同步工作流

工作流：`.github/workflows/sync-docs.yml`。

- 每周一 03:17 UTC 运行，也支持手动触发。
- 基于 `main` 创建或更新固定分支 `automation/sync-openai-docs`。
- 每次都从受信任的 `main` 重建该分支；专用分支更新使用 `--force-with-lease`，不会运行分支自身修改过的脚本。
- 先运行 typecheck 和测试，再执行 `pnpm docs:sync --prune`。
- 只在 `docs/en/` 相对 `main` 真实变化时推送分支。
- 创建或复用面向 `main` 的同步 PR，并显式 dispatch 该分支的 `Quality gate`。
- 自动 commit、PR 标题和 PR 说明使用中文；PR 说明按真实 Git 差异区分新增、修改和删除，并列出每个 `docs/en` 文件路径。
- 已存在的同步 PR 会在后续运行时刷新标题和说明，不会保留过期摘要。
- 当官方内容重新与 `main` 一致时，重置专用分支并关闭已经失效的同步 PR。
- 不直接 push `main`，因此门禁不需要机器人 bypass。
- Job 超时为 45 分钟。

仓库已在 **Settings → Actions → General → Workflow permissions** 启用 **Allow GitHub Actions to create and approve pull requests**。`GITHUB_TOKEN` 创建或更新 PR 时会产生 approval-required 的 `pull_request` 事件，因此 `ci.yml` 会把该事件隔离为非门禁 job；同步工作流随后使用允许递归触发的 `workflow_dispatch` 在自动化分支上运行真正的 `Quality gate`。

## 3. 当前验证证据

2026-08-24 中文摘要改造验证：

- `pnpm typecheck`：通过。
- `pnpm test`：31/31 通过。
- `pnpm docs:status`：418 active、0 removed、88.2 MiB。
- workflow YAML、全部 shell block 和内嵌 GitHub Script 语法：通过。
- 使用远端 `automation/sync-openai-docs` 的真实差异演练：新增 3、修改 100（包含 manifest 等管理文件）、删除 0，共 103 个文件；生成 PR 正文约 5.8 KiB。
- `git diff --check`：通过。

不要对完整 `docs/en` 使用格式化器或以 `git diff --check` 作为质量门。官方原文包含尾随空格和形似冲突标记的正文，镜像策略要求保持原样。

测试覆盖：

- 重试、jitter、`Retry-After`、并发和全局请求间隔。
- Vercel 全局熔断和永久错误。
- URL 路径映射与索引解析。
- 下载失败零写入。
- 空索引和异常大规模删除拒绝。
- 显式大规模 prune、真实删除和越界删除防护。
- 活跃索引冲突防护。
- 页面失败后停止派发。
- 成功同步、幂等重复运行和部分扫描保留。
- 空白/HTML 响应拒绝。

## 4. 下一步

### 必做：合入中文摘要并完成门禁

1. 推送 `codex/chinese-sync-summary` 并通过 PR 合入 `main`。
2. 再次手动运行 **Sync official English docs**，让现有 PR #6 自动刷新为中文标题、分类统计和完整文件路径，并重新通过显式 dispatch 的 `Quality gate`。
3. 检查并合入自动同步 PR #6，确认合并后的 `main` CI 成功。
4. 为 `main` 配置 Ruleset：必须通过 PR、必须通过 `Quality gate`、禁止 force push、空 bypass。

### 后续：设计中文翻译流水线

门禁闭环后，再设计：

- `docs/en` 到中文译文目录的路径与 manifest 关系。
- Markdown AST/代码块/链接保护策略。
- 术语表、提示词版本和人工校对状态。
- 增量翻译、失败恢复、成本预算与并发限制。
- Easy Translate Core/Providers 的复用边界。
- 翻译质量检查、CI 和发布方式。

翻译模块属于新的架构阶段，实施前需要单独完成设计确认。

## 5. 新任务开场指令

先阅读本文件并运行 `git status --short --branch`。不要清理现有改动，不要使用 `git reset --hard` 或 `git checkout --`。先合入中文同步摘要、刷新并合入 PR #6、配置 `main` Ruleset，再设计中文翻译流水线。默认使用 TypeScript；`docs/en` 必须保持官方原文，不做格式化或人工修正。
