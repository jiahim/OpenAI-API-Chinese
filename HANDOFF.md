# Handoff：英文文档同步器

更新时间：2026-08-17（Asia/Singapore）

## 本阶段范围

本阶段只处理：

1. 旧版手工中文文档迁移；
2. 使用 TypeScript 获取、保存和检查 OpenAI API 官方英文 Markdown；
3. 通过定时任务更新英文镜像和来源 manifest。

不在本阶段实现：中文生成、翻译模型、提示词、OpenAI API Key、静态网站或部署。

## 已完成

### 目录迁移

- 旧版中文文档及图片已经整体迁移到 `docs/legacy/`，共 26 个文件。
- 原目录 `API参考/`、`指引/`、`其他/`、`image/` 在 Git 中表现为删除，新目录目前是未跟踪文件；尚未执行 Git stage 或 commit。

### 英文原文镜像

- 来源索引：
  - `https://developers.openai.com/api/docs/llms.txt`
  - `https://developers.openai.com/api/reference/llms.txt`
- 本地根目录：`docs/en/`
- guides：180 篇；reference：238 篇；合计 418 篇 Markdown。
- `docs/en/` 总计 421 个文件：418 个 `.md`、2 个 `llms.txt`、1 个 `.source-manifest.json`，约 89 MB。
- 完整性检查结果：索引内缺失 0、空文件 0、manifest 哈希不一致 0。
- 当前英文文件于 2026-08-17 15:31–15:32（+08:00）成功拉取。

URL 路径直接映射为本地路径，例如：

```text
https://developers.openai.com/api/docs/guides/images-vision.md
→ docs/en/api/docs/guides/images-vision.md
```

同步器不修改 Markdown 正文，因此相对链接保持原有相对关系，外部链接保持官方原始地址。

### TypeScript 同步器

核心文件：

- `scripts/sync-docs.ts`
- `scripts/fetch-coordinator.ts`
- `scripts/docs.config.json`
- `scripts/tests/fetch-coordinator.test.ts`
- `scripts/tests/sync-docs.test.ts`
- `scripts/tests/fixtures/docs.config.json`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`

命令：

```bash
pnpm docs:bootstrap  # 从现有 docs/en 离线初始化 manifest
pnpm docs:status     # 离线查看 manifest 摘要
pnpm docs:check      # 联网比较，不写文件；有变化时退出码 1
pnpm docs:sync       # 联网同步英文 Markdown 和 manifest
pnpm typecheck
pnpm test
```

`sync --prune` 在完整扫描中删除官方索引已经移除的本地文件，并在 manifest 保留 removed 记录。使用 `--match` 或 `--limit` 时不会判断移除，避免误删未扫描页面。

### Manifest

文件：`docs/en/.source-manifest.json`

每个页面记录：

- `sourceUrl`、`localPath`、`section`、标题和描述；
- `sha256`、`bytes`；
- `firstSeenAt`、`sourceUpdatedAt`；
- 可用时记录 `etag`、`sourceLastModified`；
- `active` 或 `removed` 状态。

重复执行 `pnpm docs:bootstrap` 已验证不会产生 manifest 变化。

### 定时任务

工作流：`.github/workflows/sync-docs.yml`

- 每周一 03:17 UTC，即新加坡时间 11:17；
- 使用 Node.js 24 和 pnpm；
- 先执行 typecheck 和测试；
- 再执行 `pnpm docs:sync --prune`；
- 只有 `docs/en/` 发生变化才提交；
- 尚未在 GitHub Actions 上实际运行，需要确认仓库 Actions 写权限和分支保护允许机器人 push。

## 已处理风险：Vercel 403

在英文镜像成功拉取后，再次运行完整同步时，第一个 guides 索引请求就收到：

```text
HTTP 403
x-vercel-mitigated: deny
```

随后用 `curl`、默认 User-Agent 和浏览器 User-Agent 单独访问仍为 403。浏览器代理仍能读取官方索引。现有证据更符合 Vercel 对当前出口 IP 的临时风控，不能证明单个请求或 TypeScript 请求头有问题；前一轮并发拉取 418 页可能是诱因。

同步器现在通过 `scripts/fetch-coordinator.ts` 统一协调索引、页面和重试请求：

- 默认并发 2；全局请求启动间隔 300–800ms；
- 网络错误、429 和 5xx 最多重试 3 次，基础等待 30/60/120 秒，加入 0–1 秒抖动，本地上限 5 分钟；
- 429 支持秒数和 HTTP-date 两种 `Retry-After`，服务端等待不会被本地上限缩短；
- `403 + x-vercel-mitigated: deny` 触发所有 worker 共享的全局熔断，冷却 5 分钟后只探测一次；再次拒绝则整轮失败；
- 400、401、404 等永久错误不重试；
- 日志区分网络错误、HTTP 状态、重试次数、下一次等待、熔断和最终失败。

同步流程已经拆成下载和提交两个阶段。索引或任一页面最终失败时，不写入本轮索引、页面和 manifest，也不执行 prune。

测试注入 fetch、clock、sleep 和 random，不会真实等待 30/60/120 秒或 5 分钟。目前覆盖退避、jitter、等待上限、`Retry-After`、并发上限、全局请求间隔、Vercel 熔断、永久错误和失败零写入。

### 后续可选优化

ETag/Last-Modified 条件请求可以显著减少每周重复下载约 89 MB，但可与本次退避/限流改造分开实现，避免扩大任务范围。

## 当前验证结果

最近一次本地验证：

- TypeScript typecheck：通过；
- Node test：16 个测试全部通过；
- manifest：418 个 active、0 个 removed；
- guides/reference：180/238；
- 缺失文件：0；
- 空文件：0；
- SHA-256 不一致：0；
- `git diff --check`：通过。

## 工作区注意事项

- 当前工作区包含本次迁移和新同步器的大量未提交改动。
- 不要清理或覆盖这些改动，不要使用 `git reset --hard` 或 `git checkout --`。
- Python 翻译脚本、配置、测试和旧翻译工作流已经删除；不要在下一阶段恢复。
- 后续继续修改前应先阅读本文件，并检查 `git status --short`，避免覆盖本阶段未提交改动。
