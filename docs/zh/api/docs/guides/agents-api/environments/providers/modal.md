# Modal

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/modal) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/modal) 示例，请参阅 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预配模式：

- **[Application-managed](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，通过 OpenAI webhook 启动或重新连接沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

你需要一个 OpenAI 项目 API 密钥、一个 Modal token ID 和 secret，以及 Codex CLI 包。

使用 `OPENAI_API_KEY` 处理应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥传入沙箱作为 `CODEX_API_KEY`.

## 1. 配置 Modal 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Modal SDK 或 API 创建一个具有已配置工作目录的隔离沙盒。在该沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，并传入该环境 ID 和环境密钥。

## 2. 运行会话

使用其中的 HTTP 示例 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 可在 Modal 执行器连接后发送输入并流式返回结果。完成后， [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙盒。

## 参考

- 阅读 [Modal Sandbox 文档](https://modal.com/docs/guide/sandboxes)
- 阅读 [Modal Python SDK 参考](https://modal.com/docs/sdk/py/latest/Sandbox)
- 阅读 [Modal JavaScript/TypeScript SDK 参考](https://modal.com/docs/sdk/js/latest/Sandbox)