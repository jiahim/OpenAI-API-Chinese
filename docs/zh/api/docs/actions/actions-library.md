# GPT 操作库

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

## 目的

虽然对于 API 开发者来说，设置 GPT Actions 的工作量应远小于从头开始使用这些 API 构建整个应用程序，但要让 GPT Actions 运行起来仍需一些设置。GPT Actions 库旨在为在常见应用程序上构建 GPT Actions 提供指导。

## 快速开始

如果你从未构建过 action，请先阅读 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) ，以更好地理解 action 的工作原理。

一般来说，本指南面向熟悉并擅长调用 API 的人群。如需调试帮助，请尝试向 ChatGPT 解释你的问题，并附上截图。

## 如何访问

[OpenAI Cookbook](https://developers.openai.com/cookbook) 包含一个 [目录](https://developers.openai.com/cookbook/topic/chatgpt) 其中收录了第三方应用和中间件应用。

### 第三方 Actions 烹饪书

GPT Actions 可以直接与 HTTP 服务集成。直接利用 SaaS API 的 GPT Actions 将直接向 SaaS 提供商（如）进行身份验证并请求资源 [Google Drive](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_google_drive) 或 [Snowflake](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_snowflake_direct).

### 中间件操作手册

GPT Actions 可以通过中间件受益。它允许进行预处理、数据格式化、数据过滤，甚至连接到未通过 HTTP 暴露的端点（例如数据库）。有多个中间件食谱（cookbook）描述了示例实现路径，例如 [Azure](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_azure_function), [GCP](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_google_cloud_function) 和 [AWS](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_middleware_aws_function).

## 向我们提供反馈

有你希望我们优先考虑的集成吗？我们的集成是否存在错误？请在 cookbook 页面的 GitHub 上提交 PR 或 issue，我们会查看。

## 为我们的库做出贡献

如果你有兴趣为我们的库做出贡献，请遵循以下指南，然后在 GitHub 上提交 PR 供我们审阅。总的来说，请遵循与以下类似的模板： [这个示例 GPT Action](https://developers.openai.com/cookbook/examples/chatgpt/gpt_actions_library/gpt_action_bigquery).

指南 - 包括以下部分：

- 应用程序信息 - 描述第三方应用程序，并包含应用程序网站和API文档的链接
- 自定义GPT指令 - 包含要纳入自定义GPT的确切指令
- OpenAPI架构 - 包含要纳入GPT操作的确切OpenAPI架构
- 身份验证说明 - 对于OAuth，包含确切的项目集（授权URL、令牌URL、范围等）；同时包含如何在应用程序中编写回调URL的说明（以及任何其他步骤）
- 常见问题解答和故障排除 - 用户可能遇到的常见陷阱是什么？请在此处写出并附上解决方法

## 免责声明

此操作库旨在作为与 OpenAI 无法控制的第三方交互的指南。这些第三方可能会更改其 API 设置或配置，OpenAI 无法保证这些操作能永久有效。请将它们视为起点。

本指南面向开发人员以及熟悉编写 API 调用的人员。非技术人员可能会觉得这些步骤具有挑战性。