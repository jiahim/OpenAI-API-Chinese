# 文档数据

此目录将来源数据与历史译文分开保存：

- `en/`：由 TypeScript 同步器获取的 OpenAI 官方英文 Markdown。
- `en/.source-manifest.json`：页面来源、官方路径、SHA-256、字节数、首次发现时间、源内容更新时间和移除状态。
- `zh/`：后续由翻译流水线生成的简体中文 Markdown；路径严格镜像 `en/`，未登记或人工修改的文件不会被自动覆盖。
- `zh/.translation-manifest.json`：记录源/目标 SHA、翻译策略 SHA 和人工校对状态；在首篇译文完成前不会创建。
- `legacy/`：项目早期的手工中文译文与配套图片，只作历史归档，不由同步器更新。

`en/` 内部按官方 URL 路径镜像。同步过程不重写 Markdown 链接：相对链接保持相对，外部链接保持原始地址。

同步与检查方法见 [`scripts/README.md`](../scripts/README.md)。
中文翻译架构与状态机见 [`translation-design.md`](translation-design.md)。
