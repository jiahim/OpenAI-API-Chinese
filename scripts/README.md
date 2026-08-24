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

完整扫描会先验证索引：某个栏目没有解析出 Markdown 页面时立即中止；相较 manifest 的有效记录，单个栏目拟移除超过 20 页或 10% 时也会中止。确认这是官方的真实大规模调整后，维护者才能通过 `--allow-large-prune` 明确放行。删除路径始终从经过验证的官方 URL 重新计算，并严格限制在 `sourceRoot` 内，manifest 中保存的历史 `localPath` 不具有删除权限。

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

## 定时任务

`.github/workflows/sync-docs.yml` 每周运行完整同步和 `--prune`，通过测试后只提交 `docs/en/` 的真实变化。Job 最长运行 45 分钟，避免上游持续故障或异常 `Retry-After` 无限占用执行器。
