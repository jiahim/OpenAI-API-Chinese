# Handoff：OpenAI 中文文档翻译库

> **给后续执行者：** 官方英文镜像、自动同步 PR、中文差异摘要、稳定 CI、`main` Ruleset、翻译规划基础和 Markdown adapter 已合入。当前在 `codex/local-translation-runner` 建设单篇执行闭环；不要恢复旧 Python 翻译脚本，不要清洗 `docs/en`，也不要让自动任务覆盖未登记或人工修改的中文文件。

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
- 翻译规划与 Markdown adapter PR #8 已合入；合并提交：`adb5b96`，`Quality gate` 成功。
- 当前分支：`codex/local-translation-runner`；当前隔离工作树：`.worktrees/codex-local-translation-runner`。
- 当前本地切片新增单篇 runner、checkpoint 恢复、术语/占位符质量策略、安全原子写入，以及完全不落盘的 `translate:simulate`。

自动翻译 PR 已在当前分支实现但尚未合入。当前分支已通过 DeepSeek `deepseek-chat` 生成首篇 quickstart，并在人工润色后用 `translate:review` 登记为 `reviewed`。只有 `translate:run` 与 `translate:auto` 会读取 `DEEPSEEK_API_KEY` 并调用模型；key 未进入仓库。

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

- 每天 16:00 UTC（北京时间 00:00）运行，也支持手动触发。
- 基于 `main` 创建或更新固定分支 `automation/sync-openai-docs`。
- 每次都从受信任的 `main` 重建该分支；专用分支更新使用 `--force-with-lease`，不会运行分支自身修改过的脚本。
- 先运行 typecheck 和测试，再执行 `pnpm docs:sync --prune`。
- 只在 `docs/en/` 相对 `main` 真实变化时推送分支。
- 创建或复用面向 `main` 的同步 PR；维护者批准工作流运行后，由标准 `pull_request` CI 上报 `Quality gate`。
- 自动 commit、PR 标题和 PR 说明使用中文；PR 说明按真实 Git 差异区分新增、修改和删除，并列出每个 `docs/en` 文件路径。
- 已存在的同步 PR 会在后续运行时刷新标题和说明，不会保留过期摘要。
- 当官方内容重新与 `main` 一致时，重置专用分支并关闭已经失效的同步 PR。
- 不直接 push `main`，因此门禁不需要机器人 bypass。
- Job 超时为 45 分钟。

仓库已在 **Settings → Actions → General → Workflow permissions** 启用 **Allow GitHub Actions to create and approve pull requests**。`GITHUB_TOKEN` 创建或更新 PR 时会产生 approval-required 的 `pull_request` 事件；维护者批准后，`ci.yml` 会运行固定名称的 `Quality gate` 并满足 `main` Ruleset。

### 2.5 中文翻译规划基础

设计文档：`docs/translation-design.md`。

- `docs/zh` 严格镜像 `docs/en` 的相对路径。
- `docs/zh/.translation-manifest.json` 记录源 SHA、目标 SHA、策略 SHA、翻译时间和 `machine/reviewed` 状态；首篇已登记为 `reviewed`。
- 翻译策略 SHA 由目标语言、提示词、术语表和 Markdown adapter 版本共同决定。
- 页面状态：`pending`、`stale-source`、`stale-policy`、`missing-target`、`untracked-target`、`modified-target`、`current`、`removed-source`。
- `untracked-target` 与 `modified-target` 会阻塞自动覆盖；`removed-source` 不自动删除中文译文。
- 规划前逐页核对英文磁盘 SHA 与 source manifest，拒绝翻译本地脏改动。
- 翻译配置使用 `schemaVersion: 1`；配置、术语表和 translation manifest 拒绝未知字段，持久化路径和时间戳均严格校验。
- source/target 路径必须唯一且保持规范 POSIX 形式；读取时拒绝通过符号链接逃逸仓库，未来写入器仍须复用同等的父目录安全检查。
- 术语表按语义内容计算策略 SHA，单纯调整 JSON 排版、terms 键顺序或 preserve 顺序不会让全部译文误判为 stale。
- Easy Translate Core/Providers 负责通用执行能力；本仓库只负责 Markdown、路径、manifest、术语和文档级增量。

### 2.6 Markdown adapter（已合入）

- 实现文件：`scripts/translation/markdown-adapter.ts`；fixture：`scripts/tests/markdown-adapter.test.ts`。
- 真实对齐 `@easy-translate/core@0.3.0` 的 `DocumentAdapter`、`TranslationPlan` 和 `TranslationResult` 类型；没有复制引擎或 Provider 逻辑。
- 使用 mdast/micromark 官方包解析 GFM、frontmatter 和 MDX，按 AST source offset 抽取并倒序回填，绝不 stringify 整篇文档。
- 翻译单元带 `heading/body/table/list/quote` 和 `text/link-label/image-alt` 上下文；链接标签和图片 alt 可翻译，URL、title、代码、HTML/MDX、frontmatter、自动链接、HTML 注释、转义与字符实体不进入翻译单元。
- MDX 禁用缩进代码且拒绝 CommonMark 角括号自动链接；适配器用第二棵 CommonMark AST 保护 fenced/indented code，并对自动链接和 HTML 注释做保持 offset 的等长解析掩码。
- render 严格检查 source hash、adapter policy、区间、单元全集、空/多行/控制字符，并在回填后重解析、比较受保护结构签名；恒等翻译测试要求字节级不变。
- PR #8 合入时只交付了离线 adapter；本地当前分支已在其上完成真实 Provider、首篇译文和 review 流程。

### 2.7 本地单篇执行器（当前分支）

- `runner.ts` 复用 Planner 的同一份安全工作区快照，执行前再次核对英文 SHA 和可翻译状态。
- Easy Translate Core 负责批次、串行 checkpoint 和恢复；默认 batch=20、concurrency=1、max characters=4000。
- checkpoint 写入被忽略的 `.cache/translation-checkpoints/`，使用临时文件与原子 rename。
- 单元质量策略检查 preserve 术语、指定译法和占位符数量；Markdown adapter 在整篇 render 后继续检查结构、代码和 URL。
- 提交前重新加载工作区，拒绝竞态变化；按“先译文、后 manifest”写入。中断只会留下可检测并阻塞覆盖的 `untracked-target` 或 `modified-target`。
- `translate:simulate` 必须同时提供 `--match` 和 `--limit 1`，使用 Echo/Fake Provider，不写译文、manifest 或 checkpoint。
- 已接入 `@easy-translate/providers@0.1.0` 的 DeepSeek profile；默认模型 `deepseek-chat`，key 只读 `DEEPSEEK_API_KEY`。
- provider/model 已进入策略哈希，checkpoint 路径也绑定策略 SHA。`translate:run` 仍限定单篇，默认无写入，只有显式 `--commit` 才落盘。
- 多行官方导航卡片已纳入受限翻译范围；相邻正文和链接标签共享批次，减少行内链接拆分导致的语序问题。
- `translate:review` 只接受 `current` 或 `modified-target`，重新核对源、策略和 Markdown 受保护结构后登记人工版本的目标 SHA，并将状态提升为 `reviewed`。
- `translate:auto -- --limit 1` 优先处理 stale，再处理 pending；每轮一篇并跳过超过 20,000 个源字符的页面。
- `translate-docs.yml` 只检出 `main`，先跑离线门禁，再仅向 DeepSeek 步骤注入环境 secret；已有翻译 PR 时停止。它在英文合入后触发，并每天北京时间 01:00 补充运行。
- CI 已改用 `translate:check`，允许 pending/stale，但拒绝缺失、未登记或被修改而未 review 的目标文件。

## 3. 当前验证证据

2026-08-25 翻译规划、Markdown adapter、runner 与自动化验证：

- `pnpm typecheck`：通过。
- `pnpm test`：58/58 通过（包含 planner、provider、runner、自动选择、review 结构保护与既有同步/adapter 测试）。
- `pnpm docs:status`：421 active、0 removed、89.0 MiB。
- `pnpm translate:status`：1 current、420 pending，其他状态为 0；首篇 current 记录为 `reviewed`。
- `pnpm translate:plan -- --section guides --match quickstart --limit 5`：正确选择 2 篇 quickstart 页面。
- 定向测试覆盖路径/符号链接越界、八种状态及安全优先级、策略 stale、未登记/人工修改保护、源 SHA 脏改动拒绝、重复路径、manifest 时间/版本契约、术语冲突和 orphan 记录保留。
- Markdown adapter 定向测试覆盖恒等字节不变、标题/正文/列表/引用/表格、链接标签、图片 alt、代码/HTML/MDX/frontmatter/URL 保护、跨行容器标记、无效结果和区间篡改拒绝。
- Runner 定向测试覆盖无写入模拟、安全提交、checkpoint 中断恢复、阻塞状态、符号链接/非规范路径写入拒绝、术语和占位符保护。
- `pnpm translate:simulate -- --match guides/agents/quickstart.md --limit 1`：完成 53 个单元、2403 个字符的无 key 单篇闭环，写入为 0。
- 6 篇真实官方 guides/reference 样本（合计约 251 KiB，包含 MDX、表格与多语言代码）完成 prepare + 恒等 render，输出逐字节一致。
- CI 已增加完全离线的 `pnpm translate:check`。

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

### 后续：合入首篇自动化 PR

1. 提交当前 runner、DeepSeek profile、review/auto 流程、远端 workflow 和首篇已审核译文，通过 PR 合入。
2. 合入后手动触发一次 `Translate Chinese docs`，验证 Environment secret、自动分支和 PR 闭环。
3. 保持单篇预算运行一段时间后，再评估是否扩大批量；89 MiB 英文镜像的全量多次 AST 解析不进入常规 CI。

## 5. 新任务开场指令

先阅读本文件和 `docs/translation-design.md`，再运行 `git status --short --branch`。不要清理现有改动，不要使用 `git reset --hard` 或 `git checkout --`。默认使用 TypeScript；`docs/en` 必须保持官方原文；任何远端代码变更只允许通过功能分支 PR 合入。
