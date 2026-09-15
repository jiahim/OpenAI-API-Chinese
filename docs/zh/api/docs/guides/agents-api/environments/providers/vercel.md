# Vercel

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/vercel) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/vercel) OpenAI Cookbook 中的示例。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预置模式：

- **[应用管理](#before-you-begin):** 按照本指南从你的应用中启动和停止沙盒。
- **[Webhook 管理](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，通过 OpenAI 的 webhook 启动或重新连接沙盒。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

使用具有 Sandbox 访问权限的 Vercel 项目。Vercel Sandbox SDK 的身份验证方式取决于此应用程序的运行环境：

- **Running locally:** set `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` in your environment.
- **Deployed on Vercel:** use Vercel OIDC.

使用 `OPENAI_API_KEY` 发起应用请求。将 `OPENAI_EXECUTOR_API_KEY` 设置为某个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication),然后仅将该密钥作为 `CODEX_API_KEY`.

## 1. 配置 Vercel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Vercel SDK 或 API 在已配置的工作目录下创建一个隔离沙盒。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，传入该环境 ID 和环境密钥。

在常规使用中，将 Codex 放入 Vercel 快照，以便沙盒可以更快连接。

## 2. 运行会话

使用 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 中的 HTTP 示例，在 Vercel 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider sandbox。

## 参考

- 阅读 [Vercel Sandbox 文档](https://vercel.com/docs/sandbox)
- 阅读 [Vercel Sandbox Python SDK 参考](https://vercel.com/docs/sandbox/python-sdk-reference)
- 阅读 [Vercel Sandbox JavaScript/TypeScript SDK 参考](https://vercel.com/docs/sandbox/sdk-reference)