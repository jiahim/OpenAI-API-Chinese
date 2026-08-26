# GPT Actions 库

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 目的

尽管对于 API 开发者来说，设置 GPT Actions 的工作量应远小于从头构建一个使用这些 API 的完整应用程序，但要让 GPT Actions 正常运行仍然需要进行一些设置。GPT Actions 库旨在为在常见应用程序上构建 GPT Actions 提供指导。

## 快速开始

如果你以前从未构建过操作，请先阅读 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) 以更好地理解操作的工作原理。

通常，本指南面向熟悉并能自如调用 API 调用的人群。如需调试帮助，请尝试向 ChatGPT 解释你的问题，并附上截图。

## 如何访问

[OpenAI Cookbook](https://developers.openai.com/cookbook) 有一个 [目录](https://developers.openai.com/cookbook/topic/chatgpt) ，其中收录了第三方应用程序和中间件应用。

### 第三方 Actions 手册

GPT Actions 可以直接与 HTTP 服务集成。GPT Actions 利用 SaaS API 将直接从 SaaS 提供商（如 [Google Drive](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_google_drive) 或 [Snowflake](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_snowflake_direct).

### Middleware Actions 操作手册

GPT Actions 可以受益于拥有中间件。它允许进行预处理、数据格式化、数据过滤，甚至连接到未通过 HTTP 暴露的端点（例如：数据库）。有多个中间件 cookbook 提供了示例实现路径的描述，例如 [Azure](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_azure_function), [GCP](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_google_cloud_function) 和 [AWS](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_aws_function).

## 向我们提供反馈

是否有你希望我们优先处理的集成？我们的集成中是否存在错误？请在 cookbook 页面的 GitHub 上提交 PR 或 issue，我们会查看。

## 为我们的库做贡献

如果你有兴趣为我们的库做贡献，请遵循以下指南，然后在 github 上提交 PR 供我们审查。总体而言，请遵循类似 [此示例 GPT 行动](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_bigquery).

指南 - 包含以下部分：

- 应用信息 - 描述第三方应用，并包含应用网站链接和API文档
- 自定义 GPT 指令 - 包含要纳入自定义 GPT 的准确指令
- OpenAPI架构 - 包含要在 GPT Action 中纳入的准确 OpenAPI架构
- 身份验证说明 - 对于 OAuth，包含确切的项目集（授权 URL、令牌 URL、作用域等）；还包括如何在应用程序中编写回调 URL 的说明（以及任何其他步骤）
- 常见问题与故障排除 - 用户可能遇到的常见陷阱是什么？在这里写下它们及解决方法

## 免责声明

此操作库旨在作为与 OpenAI 无法控制的第三方交互的指南。这些第三方可能会更改其 API 设置或配置，而 OpenAI 无法保证这些操作能永久有效。请将它们视为起点。

本指南面向开发人员以及熟悉编写 API 调用的人员。非技术用户可能会觉得这些步骤具有挑战性。