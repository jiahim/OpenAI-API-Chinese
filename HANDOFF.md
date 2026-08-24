# Handoff：OpenAI 中文文档翻译库

> **给后续执行者：** 当前先完成官方英文镜像同步器的安全合入，再进入中文翻译流水线。不要恢复旧 Python 翻译脚本，不要清洗 `docs/en` 中的官方原文格式，也不要在缺少远端 CI 证据时直接合并到 `main`。

**更新时间：** 2026-08-24（Asia/Singapore）

## 1. 当前阶段结论

英文来源同步模块已经具备完整实现和本地验证，但尚未进入远端：

- 当前分支：`feat-auto-translate`。
- 数据抓取基线提交：`591898e`（`feat: 数据抓取模块`）。
- 当前分支在该提交之上包含同步安全加固、补充测试、文档修订和 PR CI；在查看具体 SHA 前应先运行 `git log -3 --oneline`。
- 远端默认分支 `main` 仍为 `efb1cac`。
- `feat-auto-translate` 尚未推送，远端尚无 PR 和 CI 运行证据。
- GitHub `main` 当前没有 Ruleset，`protected: false`。
- 英文镜像：418 篇，约 88.2 MiB，0 个 removed。
- TypeScript typecheck 通过，28 项测试通过。

中文生成、翻译提示词、术语策略和增量译文尚未实现。应先把英文同步基线通过 PR 合入，再设计翻译模块。

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
- 先运行 typecheck 和测试，再执行 `pnpm docs:sync --prune`。
- 只在 `docs/en/` 真实变化时提交。
- Job 超时为 45 分钟。

该工作流尚未在远端运行。当前设计会直接 push 所在分支；如果后续为 `main` 配置必须 PR 的 Ruleset，需要为机器人改为“自动创建更新 PR”或配置最小化 bypass，不能直接照搬 Easy Translate 的空 bypass 规则。

## 3. 当前验证证据

2026-08-24 本地验证：

- `pnpm typecheck`：通过。
- `pnpm test`：28/28 通过。
- `pnpm docs:status`：418 active、0 removed、88.2 MiB。
- 自有代码与配置（排除 `docs/en`、`docs/legacy`）的 `git diff --check`：通过。

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

### 必做：完成英文同步基线合入

1. 提交当前安全补丁、文档和 `.github/workflows/ci.yml`。
2. 推送 `feat-auto-translate`。
3. 创建 PR 到 `main`，等待远端 `Quality gate`。
4. CI 通过后再合并。
5. 根据定时同步策略配置远端门禁，避免阻断机器人更新。

### 后续：设计中文翻译流水线

英文同步基线合入后，再设计：

- `docs/en` 到中文译文目录的路径与 manifest 关系。
- Markdown AST/代码块/链接保护策略。
- 术语表、提示词版本和人工校对状态。
- 增量翻译、失败恢复、成本预算与并发限制。
- Easy Translate Core/Providers 的复用边界。
- 翻译质量检查、CI 和发布方式。

翻译模块属于新的架构阶段，实施前需要单独完成设计确认。

## 5. 新任务开场指令

先阅读本文件并运行 `git status --short --branch`。不要清理现有改动，不要使用 `git reset --hard` 或 `git checkout --`。先完成英文同步器的 PR、CI 和门禁闭环，再设计中文翻译流水线。默认使用 TypeScript；`docs/en` 必须保持官方原文，不做格式化或人工修正。
