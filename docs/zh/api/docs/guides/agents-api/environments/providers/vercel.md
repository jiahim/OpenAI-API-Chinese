# Vercel

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本文档。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/vercel) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/vercel) 示例，请参阅 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择一种配置模式：

- **[Application-managed](#before-you-begin):** 按照本指南从你的应用启动和停止沙盒。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，用于根据 OpenAI webhook 启动或重新连接沙盒。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

使用具有 Sandbox 访问权限的 Vercel 项目。Vercel Sandbox SDK 的认证方式取决于此应用程序的运行位置：

- **本地运行：** 设置 `VERCEL_TOKEN`, `VERCEL_TEAM_ID`，以及 `VERCEL_PROJECT_ID` 到你的环境中。
- **部署在 Vercel：** 使用 Vercel OIDC。

设置 `OPENAI_API_KEY` 用于应用请求，并使用单独的受限 `OPENAI_EXECUTOR_API_KEY` 用于沙箱注册。为应用密钥授予 `api.agents.read` 和 `api.agents.write` 用于会话操作的权限，以及 `api.responses.write` 用于模型推理的权限。添加 `api.vaults.read` 和 `api.vaults.write` （如果你的应用管理保管库）。创建执行者的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 并对两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行者密钥才会进入沙箱。

## 1. 设置 Vercel 环境

创建 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Vercel SDK 或 API 创建一个隔离的沙盒，并配置工作目录。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 并传入该环境 ID 和受限的执行器密钥。

对于常规使用，将 Codex 放入 Vercel 快照中，以便沙盒能够更快连接。

## 2. 运行会话

使用 HTTP 示例，请参阅 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Vercel 执行器连接后发送输入并流式返回结果。完成后， [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止提供方沙箱。

## 参考

- 阅读 [Vercel Sandbox 文档](https://vercel.com/docs/sandbox)
- 阅读 [Vercel Sandbox Python SDK 参考](https://vercel.com/docs/sandbox/python-sdk-reference)
- 阅读 [Vercel Sandbox JavaScript/TypeScript SDK 参考](https://vercel.com/docs/sandbox/sdk-reference)