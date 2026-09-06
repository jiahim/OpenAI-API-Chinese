# 英文文档同步器

`sync-docs.ts` 从 OpenAI Developers 的官方 `llms.txt` 索引发现 API guides 和 endpoint reference 页面，把逐页 Markdown 原样保存到 `docs/en/`，并通过 SHA-256 跟踪更新。

实现只负责英文文档的获取、校验和版本记录。

## 环境

- Node.js 24+
- pnpm 10+

```bash
pnpm install
pnpm typecheck
pnpm test
```

Node.js 24 可以直接执行此项目的可擦除 TypeScript 类型，因此运行同步器不需要预编译。

## 命令

```bash
pnpm docs:status
pnpm docs:check
pnpm docs:sync
```

- `bootstrap`：迁移专用；从现有 `docs/en/` 索引和 Markdown 离线建立 manifest，不下载或改写源文件。
- `status`：离线读取 manifest，汇总有效页面、已移除记录和英文 Markdown 大小。
- `check`：下载所选索引和页面进行比较，但不写文件。检测到官方变化、本地缺失或本地修改时退出码为 `1`；下载失败或安全校验失败时为 `2`。
- `sync`：先完整下载并验证本轮内容，全部成功后才更新英文文件及 manifest。重复同步相同内容不会刷新时间戳或产生无意义的 Git diff。

可直接调用脚本并筛选范围：

```bash
node scripts/sync-docs.ts check --section guides
node scripts/sync-docs.ts sync --match quickstart
node scripts/sync-docs.ts sync --section reference --limit 10
node scripts/sync-docs.ts sync --prune
node scripts/sync-docs.ts sync --prune --allow-large-prune
```

参数：

- `--section all|guides|reference`：限定栏目，默认全部。
- `--match TEXT`：按标题、官方 URL 或本地路径做不区分大小写的包含匹配，可重复。
- `--limit N`：最多处理 N 页。
- `--prune`：仅用于 `sync`；完整扫描时删除已从官方索引移除的本地文件，同时在 manifest 保留 removed 记录。
- `--allow-large-prune`：仅与 `sync --prune` 一起使用；明确允许超过自动安全阈值的大规模删除。
- `--config PATH`：使用其他配置文件。

使用 `--match` 或 `--limit` 的部分扫描不会判断页面是否已被官方移除，避免把未扫描页面误判为删除。

完整扫描会先验证索引：某个栏目没有解析出 Markdown 页面时立即中止；相较 manifest 的有效记录，单个栏目拟移除超过 20 页或 10% 时也会中止。定时任务和默认手动运行保留这些阈值，非空但截断的索引也不能绕过保护。确认这是官方的真实大规模调整后，维护者才可通过本地 `--allow-large-prune` 或手动工作流输入 `allow_large_prune=true` 明确放行。删除路径始终从经过验证的官方 URL 重新计算，并严格限制在 `sourceRoot` 内，manifest 中保存的历史 `localPath` 不具有删除权限。

## 网络策略

生产配置位于 `scripts/docs.config.json`：

- 最多并发 2 个页面任务；索引、页面和重试请求共享同一个全局请求调度器。
- 任意两个请求的启动间隔随机分布在 300–800ms。
- 网络错误、HTTP 429 和 5xx 最多重试 3 次，即最多尝试 4 次。
- 重试基础等待为 30、60、120 秒，额外加入 0–1 秒抖动；本地计算的等待最长 5 分钟。
- HTTP 429 的有效 `Retry-After` 优先级更高，支持秒数和 HTTP-date；服务端要求的等待不会被本地上限缩短。
- `HTTP 403` 且响应包含 `x-vercel-mitigated: deny` 时触发全局熔断：暂停所有新请求，冷却 5 分钟后仅由触发请求探测一次。再次收到相同拒绝时整轮失败。
- 400、401、404 等永久错误直接失败，不重试。
- 任一页面耗尽重试后停止派发新的页面任务；已经在执行的并发请求允许结束，但不会写入本轮结果。
- 页面正文为空、响应声明为 HTML/XHTML，或正文具有明显 HTML 文档头时视为失败，不会覆盖 Markdown 镜像。

同步采用“下载阶段—提交阶段”两阶段流程。索引校验失败或任一页面下载最终失败时，本轮不会写入索引、页面和 manifest，也不会执行 `--prune`。这保证索引异常和网络失败不会留下半轮同步结果。

提交阶段对单个文件使用临时文件加原子 rename，但不承诺多个文件之间具有数据库式事务性。如果磁盘写满、权限变化或进程在提交阶段被强制中断，应重新运行 `docs:status`、`docs:check` 或 `docs:sync` 完成核对和恢复。

等待、时钟、随机数和 fetch 均可在测试中注入，因此退避和熔断测试不会产生真实的长时间等待。

## 路径与链接策略

官方 URL 直接映射为本地路径：

```text
/api/docs/...      → docs/en/api/docs/...
/api/reference/... → docs/en/api/reference/...
```

脚本不会解析或改写页面正文中的链接。因此官方 Markdown 的相对链接关系不变，绝对外链也不会被擅自转换为本地链接。

## 来源 Manifest

`docs/en/.source-manifest.json` 记录英文来源状态。每条页面记录包含：

- `sourceUrl`、`localPath`、`section`、标题和索引描述；
- `sha256` 和 `bytes`；
- `firstSeenAt`、`sourceUpdatedAt`；
- 可用时记录官方响应的 `etag`、`sourceLastModified`；
- `active` 或 `removed` 状态。

## 统一文档更新工作流

`.github/workflows/update-docs.yml` 每天北京时间 00:00（UTC 16:00）串行运行，也支持从 `main` 手动触发。工作流先检出受信任的 `main`，使用 `--frozen-lockfile --ignore-scripts` 安装依赖，并运行类型检查、测试和 `translate:check`。只有完成可信分支及允许路径检查后，才会把 `translation-production` 环境中的 API key 注入翻译步骤。后续校验只接收解析后的供应商 ID 和模型名，以保持翻译策略 SHA 一致。

英文同步和对应中文翻译共用固定分支 `automation/update-openai-docs`，以及面向 `main`、标题为 `[AI] docs: 同步并翻译 OpenAI 官方文档` 的一个 PR。续跑时先验证已有 PR 的作者、标题、base/head 和记录的 SHA，再检查差异仅限 `docs/en/`、`docs/zh/`、`docs/updates/`，随后正常合入最新的已验证 `main`。没有打开 PR 的远端分支仅在安全条件下恢复：已经是 `main` 的祖先；或差异提交的作者、提交者和提交主题均属于规范机器人，且分支包含当前 `main`；或对应的规范历史 PR 已确认合并、其 merge commit 可从当前 `main` 到达。尚未进入 `main` 的提交仍须全部通过机器人身份和主题检查。匹配的手动关闭未合并 PR、外来分支、身份或 SHA 不符、合并冲突均停止并要求处理。保留的 squash-merged 分支会正常合入 `main` 后继续，无需依赖合并后自动删除分支；所有推送均为普通 fast-forward push，不使用 force push，不重置分叉分支，也不直接 push `main`。

每轮默认执行 `pnpm docs:sync --prune`；只有手动明确设置布尔输入 `allow_large_prune=true` 才追加 `--allow-large-prune`。记录本轮 release 并推送英文变化后，立即创建或恢复同一个 draft PR，确认身份、head 和 draft 状态后才进入带密钥的翻译步骤。若在首次 push 与建 PR 之间中断，下一轮按上述受限规则恢复，绝不接管手动关闭的 PR。然后用 `translate:batch` 优先处理 release 中新增和修改的文章，并清除已移除文章的对应中文文件与 manifest 记录。本轮必需页面优先于历史待翻译页面使用预算。已完成的中文页面和删除操作会先提交并推送；临时 result JSON 不会进入提交。

只有本轮新增和修改页面全部为 `current`、删除项的译文和记录均已清除，并且完整性与路径检查通过，PR 才会转为 ready。预算耗尽但本轮未完成时，任务正常结束并保留 draft PR；翻译或校验失败时，先更新 draft PR 的阻塞项和已完成页面，再将任务标为失败。没有英文变化且尚未发布分支时，仍会在本地推进历史积压，完成的译文提交推送后立即建立 draft，再做完整性校验；真正无变化时不会创建空 PR。已有 PR 可在后续运行中继续完成。

完整批次会按已推送的精确 head SHA 显式触发 `ci.yml`，并传递 PR 编号、SHA、分支和标题。初始 `AUTO_MERGE_ROLLOUT` 为 `canary`；只有后续启用 rollout，或维护者手动设置 `enable_auto_merge=true`，才会在重新核对同一 head 后请求 squash auto-merge。实际合入仍受当前 head 的 `Quality gate` 和 `main` Ruleset 约束。工作流不会轮询或直接合并 PR，整个 job 最长运行 210 分钟。

首次启用前，需要在仓库 **Settings → Actions → General → Workflow permissions** 勾选 **Allow GitHub Actions to create and approve pull requests**。自动合并还需要仓库启用 auto-merge，并通过真实 canary 确认当前 PR head 的 `Quality gate` 与 `main` Ruleset 正确关联；无需给机器人配置 bypass。

## 中文翻译规划

中文翻译基础配置位于 `translation.config.json`，提示词和术语表位于 `translation/`。状态、计划和模拟命令完全离线：

```bash
pnpm translate:status
pnpm translate:plan -- --section guides --match quickstart --limit 10
pnpm translate:simulate -- --match guides/agents/quickstart.md --limit 1
```

`translate:status` 根据英文 source manifest、中文 translation manifest、源/目标 SHA 和翻译策略 SHA 推导页面状态。`translate:plan` 列出下一轮可翻译页面，并把未登记的中文文件或 manifest 之外的人工修改标为 blocked，绝不自动覆盖。

`translate:simulate` 必须提供 `--match` 和 `--limit 1`，使用 Echo/Fake Provider 走完 Planner → Adapter → Core → Quality → Render，但不会读取 API key，也不会写入中文页面、manifest 或 checkpoint。

真实翻译预配置为 DeepSeek `deepseek-chat`。key 只从 `DEEPSEEK_API_KEY` 读取，不得写进仓库。`translate:run` 会自动加载仓库根目录下被 Git 忽略的 `.env`，也可以使用当前 shell 已导出的变量：

```bash
# .env
DEEPSEEK_API_KEY="你的 key"

# 或仅在当前 shell 中配置
export DEEPSEEK_API_KEY="你的 key"
pnpm translate:run -- --match guides/agents/quickstart.md --limit 1
# 上一步不写 docs/zh/manifest，但可能更新 Git 忽略的 checkpoint；人工检查后再显式落盘：
pnpm translate:run -- --match guides/agents/quickstart.md --limit 1 --commit
```

provider/model 会进入 `policySha256`；更换模型会把现有译文标记为 `stale-policy`。真实执行也严格限定单篇，只有 `--commit` 会写中文页面与 manifest。完整契约见 [`../docs/translation-design.md`](../docs/translation-design.md)。

人工润色已登记的译文后，状态会变为 `modified-target`。确认英文来源和翻译策略仍然有效后，用精确路径登记审核结果：

```bash
pnpm translate:review -- --match guides/agents/quickstart.md --limit 1
```

`translate:review` 只接受 `current` 或 `modified-target`，先重新比较英文与中文的 Markdown 受保护结构，再更新 manifest 中的目标 SHA 和 `reviewStatus=reviewed`；遇到代码/URL/结构变化、stale、缺失目标或未登记文件时拒绝收录。

## 翻译批处理与恢复

统一工作流调用 `pnpm translate:batch -- --release <本轮 release 路径> --result <临时 result 路径> --limit 100 --max-batches 2400 --max-characters 600000 --time-budget-minutes 140`。release 中的必需页面排在历史积压之前；其余候选按 `stale-source`、`stale-policy`、`missing-target`、`pending` 的状态顺序选择，同一状态内按 `translation/priority.zh-CN.json` 的 `sourcePaths` 排序，再按稳定路径回退。本地独立批处理可使用相同预算参数调用 `translate:auto`，`translate:plan` 可用于查看候选顺序。

每轮最多检查 100 篇，不限制整页源字符数；Markdown adapter 先生成可回填的语义单元，`easy-translate` 再按每批最多 20 个单元、4,000 个源字符调用模型，并在每个成功批次后保存 checkpoint。启动下一篇前，CLI 复用 `easy-translate` 的实际分批过程预估去重后的语义批次数和字符数，并结合已完成批次的实际平均耗时判断时间预算。首篇选中的页面即使预估超出批次、字符或时间预算也会启动；后续页面遵守这些预算，避免仅因预估预算造成永久饥饿。达到预算时正常结束，已完成改动保存在 PR 分支；本轮尚未完整时维持 draft 状态。

生产翻译采用分层恢复：术语表的 `preserve` 项在发送前按最长匹配包裹为唯一的成对保护标记，标记内保留可见原词；模型复制标记、去掉外壳或改写成对标记内文本时，返回后都会恢复原词，任何保护标记残留都会被拒绝。指定译法按完整单词或短语匹配，并忽略已整体保留的产品名，避免将 `Agent` 误匹配到 `Agents SDK`。当一个 Markdown 语义块被链接、图片、代码或换行拆成多个翻译单元时，术语表仍随完整批次发送给模型，但质量门不再要求每个片段各自包含目标术语，避免中文调整语序后被误判。每个批次对格式、质量、网络、限流、超时和服务端临时错误最多重试 2 次，并记录页面、单元、原因和退避时间；同一质量错误再次出现时提前终止。批次仍失败时，只有格式响应错误和可重试 Provider 错误会在等待 10–12 秒后从 checkpoint 做一次页面恢复，质量错误不再整页重试。认证失败、无效请求、配置、路径和仓库完整性错误不会重试。

CI 使用完全离线的 `translate:check` 验证 translation manifest；它允许尚未翻译或因英文更新而 stale 的页面存在，但拒绝 `missing-target`、`untracked-target` 和 `modified-target`。自动 PR 仍需通过 `Quality gate` 和 `main` Ruleset。
