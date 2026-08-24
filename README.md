# OpenAI API 中文文档

本项目正在从早期手工维护方式迁移为可自动维护的文档仓库。本阶段只负责两件事：归档旧版中文文档，以及使用 TypeScript 获取并跟踪 OpenAI 官方英文 Markdown。

> `docs/en/` 是官方英文内容的镜像，不是本项目原创内容。接口行为、价格、限制和安全要求请始终以 [OpenAI API 文档](https://developers.openai.com/api/) 为准。

## 目录结构

```text
.
├── scripts/
│   ├── sync-docs.ts          # 英文文档发现、同步和更新检查
│   ├── fetch-coordinator.ts  # 全局限速、重试和熔断
│   └── docs.config.json      # 来源与网络策略配置
├── docs/
│   ├── en/                   # 提交到 Git 的官方英文 Markdown 镜像
│   │   ├── api/docs/
│   │   ├── api/reference/
│   │   └── .source-manifest.json
│   └── legacy/               # 早期手工中文译文及图片归档
└── .github/workflows/
    ├── ci.yml                # PR、main 与手动触发的质量门禁
    └── sync-docs.yml         # 每周检查并创建官方更新 PR
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
```

- `docs:bootstrap`：迁移时从已落盘的 `docs/en/` 离线初始化 manifest；不会联网或修改 Markdown。
- `docs:status`：离线查看已跟踪页面数量和数据量。
- `docs:check`：联网检查官方内容或本地镜像是否变化，不写文件；有变化时退出码为 `1`。
- `docs:sync`：以低并发和全局限速联网同步 Markdown；本轮全部下载成功后才更新文件和 `docs/en/.source-manifest.json`。

完整同步会拒绝空索引和异常大幅删除。超过自动安全阈值的 prune 必须由维护者使用 `--allow-large-prune` 明确确认；定时任务不会自动绕过这道保护。

维护细节和筛选参数见 [`scripts/README.md`](scripts/README.md)，文档目录说明见 [`docs/README.md`](docs/README.md)。

## 自动更新

GitHub Actions 每周读取官方 `llms.txt` 索引、运行测试并同步英文 Markdown。只有 `docs/en/` 相对 `main` 实际发生变化时，机器人分支 `automation/sync-openai-docs` 才会创建或更新 PR；机器人不会直接写入 `main`。自动 PR 会显式触发 `Quality gate`，仍需维护者审核并合并。

仓库必须在 **Settings → Actions → General → Workflow permissions** 中启用 **Allow GitHub Actions to create and approve pull requests**。`main` 的 Ruleset 可以因此保持空 bypass，并要求所有更新通过 PR 和 `Quality gate`。

本阶段不包含中文文档生成或静态网站生成。

## 许可证与内容归属

项目代码见 [`LICENSE`](LICENSE)。OpenAI 文档内容及商标权利归其各自权利人所有。
