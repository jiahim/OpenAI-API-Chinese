# OpenAI API 中文文档

本项目已从早期手工维护方式迁移为可自动维护的文档仓库。官方英文 Markdown 同步与可追溯、可增量恢复的中文翻译 PR 流水线均已闭环，当前按核心文档优先级持续积累中文内容。

> `docs/en/` 是官方英文内容的镜像，不是本项目原创内容。接口行为、价格、限制和安全要求请始终以 [OpenAI API 文档](https://developers.openai.com/api/) 为准。

## 目录结构

```text
.
├── scripts/
│   ├── sync-docs.ts          # 英文文档发现、同步和更新检查
│   ├── translate-docs.ts     # 中文翻译状态和增量计划
│   ├── fetch-coordinator.ts  # 全局限速、重试和熔断
│   ├── docs.config.json      # 来源与网络策略配置
│   └── translation/          # 翻译规划、提示词、术语表和优先级
├── docs/
│   ├── en/                   # 提交到 Git 的官方英文 Markdown 镜像
│   │   ├── api/docs/
│   │   ├── api/reference/
│   │   └── .source-manifest.json
│   ├── zh/                   # 简体中文 Markdown 镜像与翻译 manifest
│   └── legacy/               # 早期手工中文译文及图片归档
└── .github/workflows/
    ├── ci.yml                # PR、main 与手动触发的质量门禁
    ├── sync-docs.yml         # 每天检查并创建官方更新 PR
    └── translate-docs.yml    # 受预算约束的批量自动翻译 PR
```

英文文件严格按照官网 URL 的路径保存。例如：

```text
https://developers.openai.com/api/docs/quickstart.md
→ docs/en/api/docs/quickstart.md
```

同步器不会修改 Markdown 正文，因此相对链接保持原有相对关系，外部链接也保留官方原始地址。

## 使用

需要 Node.js 24 和 pnpm：

```bash
pnpm install
pnpm docs:bootstrap
pnpm docs:status
pnpm docs:check
pnpm docs:sync
pnpm translate:status
pnpm translate:check
pnpm translate:plan -- --section guides --match quickstart --limit 10
pnpm translate:simulate -- --match guides/agents/quickstart.md --limit 1
```

- `docs:bootstrap`：迁移时从已落盘的 `docs/en/` 离线初始化 manifest；不会联网或修改 Markdown。
- `docs:status`：离线查看已跟踪页面数量和数据量。
- `docs:check`：联网检查官方内容或本地镜像是否变化，不写文件；有变化时退出码为 `1`。
- `docs:sync`：以低并发和全局限速联网同步 Markdown；本轮全部下载成功后才更新文件和 `docs/en/.source-manifest.json`。

完整同步会拒绝空索引和异常大幅删除。超过自动安全阈值的 prune 必须由维护者使用 `--allow-large-prune` 明确确认；定时任务不会自动绕过这道保护。

维护细节和筛选参数见 [`scripts/README.md`](scripts/README.md)，文档目录说明见 [`docs/README.md`](docs/README.md)。

## 自动更新

GitHub Actions 每天北京时间 00:00 读取官方 `llms.txt` 索引、运行测试并同步英文 Markdown。只有 `docs/en/` 相对 `main` 实际发生变化时，机器人分支 `automation/sync-openai-docs` 才会创建或更新 PR；机器人不会直接写入 `main`。自动 PR 仍须在维护者批准工作流运行后通过 `Quality gate`，并由维护者审核合并。

中文翻译 Action 在英文变更合入 `main` 后立即运行，并每天北京时间 01:00 补充执行。它只检出受信任的 `main`，从 `translation-production` 环境读取 `DEEPSEEK_API_KEY`，每轮最多翻译十篇页面，每篇不超过 20,000 个源字符，并通过 `automation/translate-openai-docs` 创建一个 PR。已有翻译 PR 等待审核时不会继续调用模型。自动选择先按 stale/missing 状态维护既有译文，再在同一状态内按 `scripts/translation/priority.zh-CN.json` 的核心文档顺序处理，未列入清单的页面保持稳定路径排序。

仓库必须在 **Settings → Actions → General → Workflow permissions** 中启用 **Allow GitHub Actions to create and approve pull requests**。`main` 的 Ruleset 可以因此保持空 bypass，并要求所有更新通过 PR 和 `Quality gate`。

`translate:status` 离线汇总全部页面的增量状态，`translate:check` 额外拒绝目标文件缺失、未登记或与 manifest 不一致；`translate:plan` 按自动队列优先级只读列出下一轮可翻译或阻塞的页面。`translate:simulate` 使用 Echo/Fake Provider 执行无 key、无写入闭环。`translate:run` 用于本地精确单篇翻译，`translate:auto` 为远端按优先级选择最多十篇受预算约束的页面；人工润色后用 `translate:review` 收录目标 SHA 并标记 `reviewed`。完整翻译设计见 [`docs/translation-design.md`](docs/translation-design.md)。静态网站作为核心中文内容形成后的下一阶段推进。

## 许可证与内容归属

项目代码见 [`LICENSE`](LICENSE)。OpenAI 文档内容及商标权利归其各自权利人所有。
