# Vercel

> 完整文档索引请参见 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用 Vercel Sandbox 运行一个 智能体 API 会话。

请参阅 [自部署沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预置模式：

- **[应用管理](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook 管理](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理器，从 OpenAI 的 webhook 启动或重新连接沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

使用一个具有 Sandbox 访问权限的 Vercel 项目。该 Vercel Sandbox SDK 的认证方式取决于此应用程序的运行位置：

- **本地运行：** set `VERCEL_TOKEN`, `VERCEL_TEAM_ID`，以及 `VERCEL_PROJECT_ID` 到你的环境变量中。
- **部署在 Vercel 上：** 使用 Vercel OIDC。

设置 `OPENAI_API_KEY` 用于应用请求，以及一个单独的受限 `OPENAI_EXECUTOR_API_KEY` 用于沙箱注册。为应用密钥授予 `api.agents.read` 和 `api.agents.write` 用于会话操作，以及 `api.responses.write` 用于模型推理。如果你的应用管理保管库，请添加 `api.vaults.read` 和 `api.vaults.write` 。创建执行者的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) ，并为两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行者密钥会进入沙箱。

## 1. 设置 Vercel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Vercel SDK 或 API 创建一个配置了工作目录的隔离沙盒。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 时使用该环境 ID 和受限的执行器密钥。

对于常规使用，请将 Codex 放入 Vercel 快照中，以便沙盒可以更快连接。

## 2. 运行会话

使用 “Run and continue sessions” 中的 HTTP 示例 [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以在 Vercel executor 连接后发送输入并流式返回结果。完成后， [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

## 参考资料

- 阅读 [Vercel Sandbox 文档](https://vercel.com/docs/sandbox)
- 阅读 [Vercel Sandbox Python SDK 参考](https://vercel.com/docs/sandbox/python-sdk-reference)
- 阅读 [Vercel Sandbox JavaScript/TypeScript SDK 参考](https://vercel.com/docs/sandbox/sdk-reference)