# Handoff：OpenAI 中文文档翻译库

> **给后续执行者：** 官方英文镜像、自动同步 PR、中文差异摘要、稳定 CI 和 `main` Ruleset 已全部闭环。当前在 `codex/translation-foundation` 建设中文翻译流水线；不要恢复旧 Python 翻译脚本，不要清洗 `docs/en`，也不要让自动任务覆盖未登记或人工修改的中文文件。

**更新时间：** 2026-08-24（Asia/Singapore）

## 1. 当前阶段结论

英文来源基础设施已经完成，中文翻译进入规划基础阶段：

- PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/3`。
- 合并提交：`8f32e86`（`Merge pull request #3 from jiahim/feat-auto-translate`）。
- PR #3 的 `Quality gate` 已成功；合并后的本地 `main` 也完成 typecheck、测试和 manifest 状态复验。
- 自动同步 PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/4`。
- 自动同步合并提交：`ee93ed0`（`Merge pull request #4 from jiahim/codex/auto-sync-pr`）。
- 测试稳定性 PR：`https://github.com/jiahim/OpenAI-API-Chinese/pull/5`；合并提交：`db395f6`。
- 测试文件保留进程隔离并通过 `--test-concurrency=1` 串行执行；PR 与合并后的 `main` CI 均成功。
- Actions 已允许 `GITHUB_TOKEN` 创建 PR。首次同步验收 run `32710251773` 成功，自动创建 PR #6，并显式触发成功的 `Quality gate` run `32710653491`。
- 自动同步 PR #6 已以中文标题、分类统计和完整文件路径合入；合并提交：`70f28d7`。
- 英文镜像：421 篇（guides=183、reference=238），0 个 removed。
- `main` Ruleset：`main-quality-gate`（ID `21281153`），enforcement=`active`，默认分支受保护，必须通过 PR 和 `Quality gate`，禁止删除与 force push，空 bypass。
- 当前分支：`codex/translation-foundation`；当前隔离工作树：`.worktrees/codex-translation-foundation`。
- 当前基础切片已实现翻译配置、策略哈希、manifest contract、非破坏性状态机以及只读 `translate:status` / `translate:plan`。

真实模型调用、Markdown adapter、中文译文落盘和自动翻译 PR 尚未实现。当前基础切片明确不读取 API key、不调用模型，也不创建 `docs/zh`。

## 2. 已完成能力

### 2.1 目录与来源数据

- 旧版手工中文文档及图片已迁移到 `docs/legacy/`。
- 官方英文 Markdown 镜像位于 `docs/en/`。
- 来源索引：
  - `https://developers.openai.com/api/docs/llms.txt`
  - `https://developers.openai.com/api/reference/llms.txt`
- guides：183 篇。
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

### 2.5 中文翻译规划基础

设计文档：`docs/translation-design.md`。

- `docs/zh` 严格镜像 `docs/en` 的相对路径。
- `docs/zh/.translation-manifest.json` 将记录源 SHA、目标 SHA、策略 SHA、翻译时间和 `machine/reviewed` 状态；首篇译文完成前不创建。
- 翻译策略 SHA 由目标语言、提示词、术语表和 Markdown adapter 版本共同决定。
- 页面状态：`pending`、`stale-source`、`stale-policy`、`missing-target`、`untracked-target`、`modified-target`、`current`、`removed-source`。
- `untracked-target` 与 `modified-target` 会阻塞自动覆盖；`removed-source` 不自动删除中文译文。
- 规划前逐页核对英文磁盘 SHA 与 source manifest，拒绝翻译本地脏改动。
- Easy Translate Core/Providers 负责通用执行能力；本仓库只负责 Markdown、路径、manifest、术语和文档级增量。

## 3. 当前验证证据

2026-08-24 翻译规划基础验证：

- `pnpm typecheck`：通过。
- `pnpm test`：38/38 通过。
- `pnpm docs:status`：421 active、0 removed、89.0 MiB。
- `pnpm translate:status`：421 pending，其他状态为 0；没有创建 `docs/zh`。
- `pnpm translate:plan -- --section guides --match quickstart --limit 5`：正确选择 2 篇 quickstart 页面。
- 定向测试覆盖路径越界、八种状态、策略 stale、未登记/人工修改保护、源 SHA 脏改动拒绝和 orphan 记录保留。
- CI 已增加完全离线的 `pnpm translate:status`。

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

### 必做：合入翻译规划基础

1. 完成 `codex/translation-foundation` 的完整测试、typecheck、状态命令和 workflow 语法验证。
2. 仅推送该功能分支并通过 PR 合入 `main`；不得直接 push `main`。

### 后续：Markdown adapter 与本地执行器

1. 实现基于源位置的 Markdown 文本提取/还原，确保代码、链接目标、HTML/MDX、表格和标记不被重写。
2. 接入已发布的 `@easy-translate/core@0.3.0` 与 `@easy-translate/providers@0.1.0`，实现单篇 checkpoint 和文档级原子提交。
3. 增加结构、保护标记、代码块、链接和术语质量检查。
4. 先对少量 guides 做人工验收，再扩展批量翻译和自动 PR。

## 5. 新任务开场指令

先阅读本文件和 `docs/translation-design.md`，再运行 `git status --short --branch`。不要清理现有改动，不要使用 `git reset --hard` 或 `git checkout --`。默认使用 TypeScript；`docs/en` 必须保持官方原文；任何远端代码变更只允许通过功能分支 PR 合入。
