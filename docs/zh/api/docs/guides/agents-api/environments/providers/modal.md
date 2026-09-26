# Modal

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/modal/application_managed) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/modal/webhook_managed) 示例，参见 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预置模式：

- **[由应用管理](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[由 Webhook 管理](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理器，从 OpenAI Webhook 启动或重新连接沙箱。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

你需要一个 OpenAI 项目 API 密钥、一个 Modal token ID 和 secret，以及 Codex CLI 包。

使用 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并将仅该密钥作为 `CODEX_API_KEY`.

## 1. 配置 Modal 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Modal SDK 或 API 创建一个配置了工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 并传入该环境 ID 和环境密钥。

## 2. 运行会话

使用以下内容中的 HTTP 示例 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以在 Modal 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

## 参考资料

- 阅读 [Modal Sandbox 文档](https://modal.com/docs/guide/sandboxes)
- 阅读 [Modal Python SDK 参考](https://modal.com/docs/sdk/py/latest/Sandbox)
- 阅读 [Modal JavaScript/TypeScript SDK 参考](https://modal.com/docs/sdk/js/latest/Sandbox)