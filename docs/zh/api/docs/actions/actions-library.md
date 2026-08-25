# GPT 操作库

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 目的

虽然对于 API 开发者来说，设置 GPT Actions 的工作量应远少于从头开始构建使用这些 API 的完整应用，但仍需一些设置才能使 GPT Actions 启动并运行。GPT Actions 库旨在为基于常见应用构建 GPT Actions 提供指导。

## 开始使用

如果你之前从未构建过 action，请先阅读 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) ，以更好地了解 action 的工作方式。

通常，本指南面向熟悉并习惯调用 API 的人员。如需调试帮助，请尝试向 ChatGPT 解释你的问题，并附上屏幕截图。

## 如何访问

[OpenAI Cookbook](https://developers.openai.com/cookbook) 有一个 [目录](https://developers.openai.com/cookbook/topic/chatgpt) 包含第三方应用程序和中间件应用。

### 第三方 Actions 食谱

GPT Actions 可直接与 HTTP 服务集成。利用 SaaS API 的 GPT Actions 将直接向 SaaS 提供商进行身份验证并请求资源，例如 [Google Drive](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_google_drive) 或 [Snowflake](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_snowflake_direct).

### 中间件操作手册

GPT Actions 可以受益于中间件的使用。它允许进行预处理、数据格式化、数据过滤，甚至连接到未通过 HTTP 暴露的端点（例如数据库）。多个中间件手册描述了示例实现路径，例如 [Azure](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_azure_function), [GCP](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_google_cloud_function) 和 [AWS](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_aws_function).

## 给我们反馈

有你希望我们优先处理的集成吗？我们的集成中存在错误吗？请在 cookbook 页面的 github 上提交 PR 或 issue，我们会查看。

## 为我们的库做贡献

如果你有兴趣为我们的库做贡献，请遵循以下指南，然后在 GitHub 上提交 PR 供我们审阅。一般来说，请遵循类似 [此示例 GPT 操作](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_bigquery).

指南——包括以下部分：

- 应用程序信息——描述第三方应用程序，并包含应用网站和 API 文档的链接
- 自定义 GPT 指令——包含要纳入自定义 GPT 的确切指令
- OpenAPI 架构——包含要纳入 GPT 操作的确切 OpenAPI 架构
- 身份验证说明——对于 OAuth，包含确切的项目集（授权 URL、令牌 URL、范围等）；还包括如何在应用程序中编写回调 URL 的说明（以及任何其他步骤）
- 常见问题解答与故障排除——用户可能遇到的常见陷阱有哪些？请在此处写出并附上解决方法

## 免责声明

此操作库旨在作为与 OpenAI 无法控制的第三方交互的指南。这些第三方可能会更改其 API 设置或配置，且 OpenAI 无法保证这些操作将永久有效。请将它们视为起点。

本指南面向开发者以及熟悉编写 API 调用的人群。非技术用户可能会觉得这些步骤具有挑战性。