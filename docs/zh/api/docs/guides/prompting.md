# 提示工程

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

**提示** 是向模型提供输入的过程。你的输出质量往往取决于你提示模型的能力。

## 概述

提示工程既是一门艺术，也是一门科学。OpenAI提供了一些策略和API设计决策，帮助你构建有效的提示词，并从模型中获得一致的良好结果。我们鼓励你进行实验。

## 提示工具与技巧

- **[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching)**：复用稳定的提示词前缀，在缓存命中时降低延迟和输入 token 成本
- **[提示词工程](https://developers.openai.com/api/docs/guides/prompt-engineering)**：学习构建提示词的策略、技术和工具

## 优化你的提示词

- 将整体语气或角色指导放在系统消息中；将任务相关的细节和示例保留在用户消息中。
- 将少样本示例合并为简洁的 YAML 风格或项目符号块，以便团队能够快速浏览和更新。
- 用清晰的文件夹名称映射你的项目结构，以便团队成员快速定位提示。
- 每次发布时运行你的提示测试和评估案例；早期发现问题比在生产环境中修复更为经济。

## 应用程序中的提示词

将提示词视为应用程序代码。将提示词内容存储在命名模块中，使用类型化函数参数构建动态部分，并在与产品行为相同的拉取请求中审查提示词更改。

OpenAI 正在废弃 API 中的可重用提示词对象。提示词创建将
  从 2026 年 6 月 3 日起不再强调，并且 `v1/prompts` 计划于
  2026 年 11 月 30 日关闭。参见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前
  时间线。

对于新工作，不要创建可重用提示词对象。而是：

- 将每个生产提示词保存在代码管理、版本化的辅助工具中，例如 `prompts/supportReply.ts`.
- 用类型化函数参数或经过验证的输入对象替换提示词变量。
- 直接将生成的 messages 传递给 [Responses API](https://developers.openai.com/api/docs/guides/text?api-mode=responses) 通过 `input` 和 `instructions`.
- 使用测试、代表性夹具和随部署流程运行的评估检查，覆盖提示词变更。
- 使用 git 历史、PR 审查、发布标签和功能标志来审查、发布、比较和回滚提示词变更。

如果你已在 API 请求中使用提示语 ID 或提示语版本，请遵循 [迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将这些提示语移至代码中。

## 后续步骤

当你在提示词方面感到有信心时，不妨查看以下指南和资源。

[文本生成



      Learn how to prompt a model to generate text.](https://developers.openai.com/api/docs/guides/text)

[优化更好的提示词



      Learn about OpenAI's prompt engineering tools and techniques.](https://developers.openai.com/api/docs/guides/prompt-engineering)