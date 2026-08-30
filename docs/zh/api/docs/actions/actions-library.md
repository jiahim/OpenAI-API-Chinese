# GPT Actions library

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

## 用途

虽然相较于从零开始构建使用这些 API 的完整应用，GPT Actions 对 API 开发者的搭建工作量已大幅减少，但要启动并运行 GPT Actions 仍需要一些配置。GPT Actions 资料库旨在为在常见应用上构建 GPT Actions 提供指导。

## 入门指南

如果你从未构建过 action，请先阅读 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) ，以便更好地了解 action 的工作原理。

一般来说，本指南面向熟悉并能够自如调用 API 的用户。如果需要调试帮助，请尝试向 ChatGPT 描述你遇到的问题，并附上截图。

## 访问方式

[OpenAI Cookbook](https://developers.openai.com/cookbook) 提供了一个 [目录](https://developers.openai.com/cookbook/topic/chatgpt) ，其中收录了第三方应用程序和中间件应用。

### 第三方 Actions  cookbook

GPT Actions 可以直接与 HTTP 服务集成。直接利用 SaaS API 的 GPT Actions 将直接从 SaaS 提供商（例如 [Google Drive](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_google_drive) 或 [Snowflake](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_snowflake_direct).

### Middleware Actions cookbook

GPT Actions 可以从中间件中受益。它允许预处理、数据格式化、数据过滤，甚至连接到未通过 HTTP 暴露的端点（例如：数据库）。多个中间件 cookbook 可用于描述示例实现路径，例如 [Azure](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_azure_function), [GCP](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_google_cloud_function) 和 [AWS](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_aws_function).

## 向我们反馈

有没有希望我们优先支持的集成？我们的集成里有没有错误？请在 cookbook 页面的 GitHub 上提交 PR 或 issue，我们会查看。

## 为我们的文档库做贡献

如果你有兴趣为我们的库做出贡献，请遵循以下指南，然后在 github 中提交 PR 以供我们审阅。通常，遵循类似于 [这个 GPT Action 示例](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_bigquery).

指南 - 包含以下章节：

- Application Information - 描述第三方应用，并附上应用网站链接以及 API 文档
- Custom GPT Instructions - 包含要在 Custom GPT 中包含的精确指令
- OpenAPI Schema - 包含要在 GPT Action 中包含的精确 OpenAPI schema
- Authentication Instructions - 对于 OAuth，包含精确的项目集（授权 URL、token URL、scope 等）；同时包含如何在应用中编写回调 URL 的说明（以及其他步骤）
- FAQ and Troubleshooting - 用户可能遇到的常见问题有哪些？在此列出以及对应的解决方法

## 免责声明

此 Actions 库旨在作为与不受 OpenAI 控制的第三方交互的指南。这些第三方可能会更改其 API 设置或配置，且 OpenAI 无法保证这些 Actions 将永久有效。请将其视为一个起点。

本指南面向具备编写 API 调用经验的开发者和相关人员。非技术用户可能会觉得这些步骤具有挑战性。