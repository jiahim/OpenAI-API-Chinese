# 提示工程

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

**提示** 是为模型提供输入的过程。输出质量通常取决于你对模型的提示效果。

## 概述

提示工程既是一门艺术，也是一门科学。OpenAI 提供了一些策略和 API 设计决策，帮助你构建有效的提示，并从模型中获得稳定的高质量结果。我们鼓励你多加尝试。

## 提示工具与技术

- **[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)**: 复用稳定的提示前缀，以在缓存命中时降低延迟和输入 token 成本
- **[Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)**: 学习构造提示的策略、技巧和工具

## 优化你的提示词

- 将整体语气或角色指引放在系统消息中；将任务相关的细节和示例放在用户消息中。
- 将 few-shot 示例合并为简洁的 YAML 风格或项目符号块，便于团队浏览和更新。
- 使用清晰的文件夹名称映射项目结构，方便团队成员快速定位提示词。
- 每次发布时都运行提示词测试和评估用例；尽早发现问题比在生产环境中修复成本更低。

## Prompts 中的应用

把提示当作应用代码来对待。将提示内容存放在命名的模块中，使用带类型的函数参数构建动态段，并在同一个拉取请求中与所支持的产品行为一起评审提示变更。

OpenAI 正在废弃 API 中可复用的提示对象。提示创建将
  自 2026-06-03 起被弱化， `v1/prompts` 并计划于
  2026-11-30 关停。参见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前
  时间表。

对于新的工作，请不要创建可复用的提示对象，而是：

- 将每个生产提示保存在代码管理的、版本化的辅助函数中，例如 `prompts/supportReply.ts`.
- 将提示变量替换为带类型的函数参数或经过校验的输入对象。
- 将生成的消息直接传递给 [Responses API](https://developers.openai.com/api/docs/guides/text?api-mode=responses) 通过 `input` 和 `instructions`.
- 用测试、具有代表性的固定数据以及与部署流程同步运行的评估检查来覆盖提示变更。
- 使用 git 历史、PR 评审、发布标签和功能开关来审阅、发布、对比和回滚提示变更。

如果你已经在 API 请求中使用了提示词 ID 或提示词版本，请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将这些提示词迁移到代码中。

## 后续步骤

当你对提示词有信心时，可以查阅以下指南和资源。

[文本生成



      Learn how to prompt a model to generate text.](https://developers.openai.com/api/docs/guides/text)

[编写更好的提示词



      Learn about OpenAI's prompt engineering tools and techniques.](https://developers.openai.com/api/docs/guides/prompt-engineering)