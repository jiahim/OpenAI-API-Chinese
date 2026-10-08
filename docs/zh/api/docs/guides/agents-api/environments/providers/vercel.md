# Vercel

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [由应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/vercel/application_managed) 和 [由 webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/vercel/webhook_managed) 示例，请参考 OpenAI Cookbook。

请参阅 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预置模式：

- **[Application-managed](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，用于从 OpenAI webhook 启动或重新连接沙箱。

请参阅 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

使用一个已开启 Sandbox 访问权限的 Vercel 项目。Vercel Sandbox SDK 的认证方式取决于该应用的运行环境：

- **本地运行：** 设置 `VERCEL_TOKEN`, `VERCEL_TEAM_ID`，以及 `VERCEL_PROJECT_ID` 放入你的环境变量中。
- **部署在 Vercel：** 请使用 Vercel OIDC。

使用 `OPENAI_API_KEY` 进行应用请求。将 `OPENAI_EXECUTOR_API_KEY` 设置为 [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥作为以下参数传入沙箱： `CODEX_API_KEY`.

## 1. 配置 Vercel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Vercel SDK 或 API 创建一个配置了工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，传入该环境 ID 和环境密钥。

在常规使用中，将 Codex 放入 Vercel 快照，以便沙箱能够更快连接。

## 2. 运行会话

使用 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 中的 HTTP 示例，在 Vercel 执行器连接后发送输入并流式传输结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止提供商沙箱。

## 参考资料

- 阅读 [Vercel Sandbox 文档](https://vercel.com/docs/sandbox)
- 阅读 [Vercel Sandbox Python SDK 参考](https://vercel.com/docs/sandbox/python-sdk-reference)
- 阅读 [Vercel Sandbox JavaScript/TypeScript SDK 参考](https://vercel.com/docs/sandbox/sdk-reference)