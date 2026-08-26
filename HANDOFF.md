# Handoff：OpenAI 中文文档翻译库

> **给后续执行者：** 官方英文同步、自动中文翻译、PR 质量门禁和首轮生产验收均已闭环。当前重点是按高价值文档优先级积累中文内容并观察流水线稳定性；不要恢复旧 Python 翻译脚本，不要清洗 `docs/en`，也不要让自动任务覆盖未登记或人工修改的中文文件。

**更新时间：** 2026-08-26（Asia/Singapore）

## 1. 当前阶段结论

英文来源与中文翻译基础设施已经完成，当前进入内容积累阶段：

- 英文镜像：421 篇（guides=183、reference=238），0 个 removed。
- `main` Ruleset：`main-quality-gate`（ID `21281153`），enforcement=`active`，默认分支受保护，必须通过 PR 和 `Quality gate`，禁止删除与 force push，空 bypass。
- 翻译规划与 Markdown adapter PR #8 已合入；自动翻译 runner、DeepSeek profile、review/auto 流程和远端 workflow PR #9 已合入。
- 自动 PR 质量门禁修复 PR #12 已合入。
- 首轮生产自动翻译成功创建 PR #13，`Quality gate` 最终通过，PR 合入后的 `main` CI 也成功。
- 当前中文状态：10 current、411 pending；首篇 Agents quickstart 为 `reviewed`，自动生成的页面为 `machine`。
- 本地与远端仅 `translate:run`、`translate:auto` 会读取 `DEEPSEEK_API_KEY`；key 不进入仓库、日志、checkpoint 或 manifest。
- 核心文档优先级由 `scripts/translation/priority.zh-CN.json` 维护；同一状态内优先处理配置清单，stale/missing 维护任务仍先于 pending。
- `apps/web` 已实现 Vercel/Next.js 静态站：421 篇英文源页面都有结构化路由，414 篇直接渲染正文，7 篇超过 1 MB 的超大参考页使用轻量说明页；中文页面保持同构官网目录，当前 10 篇译文直接可读。

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
- 自动 commit、PR 标题和 PR 说明使用中文；自动 PR 标题以 `[AI] ` 开头，PR 说明按真实 Git 差异区分新增、修改和删除，并列出每个 `docs/en` 文件路径。
- 已存在的同步 PR 会在后续运行时刷新标题和说明，不会保留过期摘要。
- 当官方内容重新与 `main` 一致时，重置专用分支并关闭已经失效的同步 PR。
- 不直接 push `main`，因此门禁不需要机器人 bypass。
- Job 超时为 45 分钟。
- 仓库级指令使用 Codex 标准文件名 `AGENTS.md`；Codex commit 和 PR/MR 标题必须以 `[AI] ` 开头，人工版本使用 `[Human] `。`Quality gate` 会校验所有 PR 标题，并对 `codex/`、`automation/` 分支强制要求 `[AI] `。

仓库已在 **Settings → Actions → General → Workflow permissions** 启用 **Allow GitHub Actions to create and approve pull requests**。`GITHUB_TOKEN` 创建或更新 PR 时会产生 approval-required 的 `pull_request` 事件；维护者批准后，`ci.yml` 会运行固定名称的 `Quality gate` 并满足 `main` Ruleset。

### 2.5 中文翻译规划基础

设计文档：`docs/translation-design.md`。

- `docs/zh` 严格镜像 `docs/en` 的相对路径。
- `docs/zh/.translation-manifest.json` 记录源 SHA、目标 SHA、策略 SHA、翻译时间和 `machine/reviewed` 状态；首篇已登记为 `reviewed`。
- 翻译策略 SHA 由目标语言、提示词、术语表和 Markdown adapter 版本共同决定。
- 页面状态：`pending`、`stale-source`、`stale-policy`、`missing-target`、`untracked-target`、`modified-target`、`current`、`removed-source`。
- `untracked-target` 与 `modified-target` 会阻塞自动覆盖；`removed-source` 不自动删除中文译文。
- 规划前逐页核对英文磁盘 SHA 与 source manifest，拒绝翻译本地脏改动。
- 翻译配置使用 `schemaVersion: 2`；术语表、优先级和 translation manifest 使用各自的 `schemaVersion: 1`。所有配置拒绝未知字段，持久化路径和时间戳均严格校验。
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
- PR #8 合入时交付离线 adapter；PR #9 已在其上合入真实 Provider、首篇译文和 review 流程。

### 2.7 单篇执行器与批量自动翻译（已合入）

- `runner.ts` 复用 Planner 的同一份安全工作区快照，执行前再次核对英文 SHA 和可翻译状态。
- Easy Translate Core 负责批次、串行 checkpoint 和恢复；默认 batch=20、concurrency=1、max characters=4000。
- checkpoint 写入被忽略的 `.cache/translation-checkpoints/`，使用临时文件与原子 rename。
- 单元质量策略检查 preserve 术语、指定译法和占位符数量；Markdown adapter 在整篇 render 后继续检查结构、代码和 URL。
- 生产 Provider 会按最长匹配将 `preserve` 术语替换为批次内唯一占位符，模型返回后逐字恢复；质量策略仍会独立复核，避免术语保护只依赖提示词。
- 批次对格式、质量和可重试 Provider 错误最多重试 2 次，采用指数退避与 jitter；批次耗尽后页面等待约 10–12 秒并基于 checkpoint 额外恢复 1 次。认证、配置、路径和完整性错误不重试，日志包含页面、单元、原因和等待时间。
- 提交前重新加载工作区，拒绝竞态变化；按“先译文、后 manifest”写入。中断只会留下可检测并阻塞覆盖的 `untracked-target` 或 `modified-target`。
- `translate:simulate` 必须同时提供 `--match` 和 `--limit 1`，使用 Echo/Fake Provider，不写译文、manifest 或 checkpoint。
- 已接入 `@easy-translate/providers@0.1.0` 的 DeepSeek profile；默认模型 `deepseek-chat`，key 只读 `DEEPSEEK_API_KEY`。
- provider/model 已进入策略哈希，checkpoint 路径也绑定策略 SHA。`translate:run` 仍限定单篇，默认无写入，只有显式 `--commit` 才落盘。
- 多行官方导航卡片已纳入受限翻译范围；相邻正文和链接标签共享批次，减少行内链接拆分导致的语序问题。
- `translate:review` 只接受 `current` 或 `modified-target`，重新核对源、策略和 Markdown 受保护结构后登记人工版本的目标 SHA，并将状态提升为 `reviewed`。
- `translate:auto -- --limit 10` 按 `stale-source`、`stale-policy`、`missing-target`、`pending` 处理；同一状态内按 `scripts/translation/priority.zh-CN.json` 的核心文档顺序筛选，最后回退到稳定路径排序。每轮最多十篇，每篇都不超过 20,000 个源字符。
- `translate-docs.yml` 只检出 `main`，先跑离线门禁，再仅向 DeepSeek 步骤注入环境 secret；已有翻译 PR 时停止。它在英文合入后触发，并每天北京时间 01:00 补充运行。
- CI 已改用 `translate:check`，允许 pending/stale，但拒绝缺失、未登记或被修改而未 review 的目标文件。

### 2.8 Vercel 静态站与后续抽取

- 首个站点当前放在 `apps/web`，使用 Next.js `output: export`，本地静态产物位于 `apps/web/out`；Vercel Root Directory 为 `apps/web`，Output Directory 必须保持未覆盖并交由 Next.js Preset 自动检测。
- `Quality gate` 会独立安装 Web 子项目依赖，并运行内容生成、typecheck、lint、链接测试和完整静态构建。
- 构建器读取 source/translation manifest，并严格按两份官方 `llms.txt` 的分组和顺序生成导航；421 个 active 页面必须全部且仅出现一次。
- 421 篇英文 Markdown 全部生成静态路径；414 篇直接渲染正文，7 篇超过 1 MB 的事件/资源总表先保留轻量说明页，后续按结构拆分。中文译文沿用相同路径；中文尚未生成时仍保留结构化状态页，并优先链接本站英文原文。
- 官网文档内部链接转换为当前 locale 的本站路径；外部链接明确标识，原始 Markdown 不被修改。
- 首页和文档页突出 `developers.openai.com` 为权威来源，同时明确本项目是非官方社区镜像。
- Markdown 按页面在构建期读取，generated 文件只含约 421 页轻量元数据，不能把约 89 MiB 原文聚合到客户端 bundle。
- 当前先在单仓稳定真实站点；出现第二个非 OpenAI 翻译站后，再按 `docs/static-site-architecture.md` 的契约和里程碑抽取通用 core/theme/CLI。
- Node 测试固定使用 `--test-isolation=none`，规避 Node 24 子进程 IPC 偶发的 cloned data 反序列化失败；测试仍保持单并发。

## 3. 当前验证证据

2026-08-26 翻译规划、Markdown adapter、runner 与自动化验证：

- `pnpm typecheck`：通过。
- `pnpm test`：65/65 通过（包含 PR 标题门禁、planner、provider、runner、优先级配置与选择、review 结构保护及既有同步/adapter 测试）。
- `pnpm docs:status`：421 active、0 removed、89.0 MiB。
- `pnpm translate:check`：通过；10 current、411 pending，其他阻塞状态为 0。
- `pnpm translate:plan -- --limit 12`：按核心文档清单优先列出模型、API 概览、文本生成、流式输出、后台任务、Code Interpreter、生产最佳实践和 Realtime 文档。
- 定向测试覆盖路径/符号链接越界、八种状态及安全优先级、策略 stale、未登记/人工修改保护、源 SHA 脏改动拒绝、重复路径、manifest 时间/版本契约、术语冲突和 orphan 记录保留。
- Markdown adapter 定向测试覆盖恒等字节不变、标题/正文/列表/引用/表格、链接标签、图片 alt、代码/HTML/MDX/frontmatter/URL 保护、跨行容器标记、无效结果和区间篡改拒绝。
- Runner 定向测试覆盖无写入模拟、安全提交、checkpoint 中断恢复、批次耗尽后的页面恢复、阻塞状态、符号链接/非规范路径写入拒绝、术语和占位符保护。
- Provider 定向测试覆盖最长术语优先掩码和返回后的逐字恢复。
- `pnpm translate:simulate -- --match api/reference/overview.md --limit 1`：完成 115 个单元、5305 个字符的无 key 单篇闭环，写入为 0。
- 6 篇真实官方 guides/reference 样本（合计约 251 KiB，包含 MDX、表格与多语言代码）完成 prepare + 恒等 render，输出逐字节一致。
- CI 已增加完全离线的 `pnpm translate:check`。
- `apps/web` 的 link/structure 测试通过；Next.js 生产构建成功生成 851 个静态页面（首页、421×2 个语言路径、章节页、robots 和 sitemap）。

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

### 后续：部署并稳定真实站点，同时积累高价值中文内容

1. 将本轮定时任务稳定性修复通过 PR 合入，继续观察 3–5 轮自动同步与翻译，确认 Node 测试和 DeepSeek 质量门不再持续性失败。
2. 优先积累模型、Responses/Chat 概览、文本生成、流式输出、工具、Realtime、Agents 和生产最佳实践等中文页面；逐篇审核机器译文。
3. 稳定后根据模型成本、执行时长和审核负担评估是否继续调整单轮吞吐，同时保持单篇字符预算、单一待审核 PR 和完整性门禁。
4. 在 Vercel 创建/关联项目，Root Directory 设为 `apps/web`，设置正式 `NEXT_PUBLIC_SITE_ORIGIN`，用 PR Preview 验证后再从默认分支发布生产站。
5. 稳定导航、链接、SEO、产物体积和代表性大页面；出现第二个真实翻译站后再抽取通用生成器，不要提前复制当前目录形成两套实现。

## 5. 新任务开场指令

先阅读本文件、`docs/translation-design.md` 和 `docs/static-site-architecture.md`，再运行 `git status --short --branch`。不要清理现有改动，不要使用 `git reset --hard` 或 `git checkout --`。默认使用 TypeScript；`docs/en` 必须保持官方原文；站点改动集中在 `apps/web`，不能把 Markdown 聚合进客户端 bundle；任何远端代码变更只允许通过功能分支 PR 合入。
