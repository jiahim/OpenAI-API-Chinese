# Modal

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/modal) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/modal) 示例，参见 OpenAI Cookbook。

请参阅 [自托管沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预配模式：

- **[应用管理](#before-you-begin):** 按照本指南从你的应用中启动和停止沙箱。
- **[Webhook 管理](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，可通过 OpenAI webhook 启动或重新连接沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

你需要 OpenAI 项目的 API 密钥、一个 Modal token ID 和 secret，以及 Codex CLI 包。

设置 `OPENAI_API_KEY` 用于应用请求，以及另一个受限的 `OPENAI_EXECUTOR_API_KEY` 用于沙箱注册。为该应用密钥授予 `api.agents.read` 和 `api.agents.write` 用于会话操作，以及 `api.responses.write` 用于模型推理。添加 `api.vaults.read` 和 `api.vaults.write` 如果你的应用管理保管库，则添加。创建执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 并对这两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行器密钥会进入沙箱。

## 1. 设置 Modal 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Modal SDK 或 API 创建一个已配置工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 并使用该环境 ID 和受限的执行器密钥。

## 2. 运行会话

使用 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Modal 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙盒。

## 参考

- 阅读 [Modal Sandbox 文档](https://modal.com/docs/guide/sandboxes)
- 阅读 [Modal Python SDK 参考](https://modal.com/docs/sdk/py/latest/Sandbox)
- 阅读 [Modal JavaScript/TypeScript SDK 参考](https://modal.com/docs/sdk/js/latest/Sandbox)