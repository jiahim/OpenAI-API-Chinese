# E2B

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

请参阅 [由应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/e2b) 和 [由 webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/e2b) 示例，请参考 OpenAI Cookbook。

选择预配模式：

- **[Application-managed](#application-managed):** 你的应用直接创建并连接 E2B 沙箱。
- **[Webhook-managed](#webhook-managed):** 部署一个处理程序，用于从 OpenAI webhook 启动或重新连接沙箱。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

设置 `E2B_API_KEY` 并使用 `OPENAI_API_KEY` 用于应用请求。将 `OPENAI_EXECUTOR_API_KEY` 为某个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication),然后仅将该密钥作为以下参数传入沙箱: `CODEX_API_KEY`.

## Webhook 托管

实现一个控制器，用于验证 OpenAI Webhook，并为每个会话提供一个独立的 E2B worker。请参考 [部署并连接 handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 用于凭据、终端注册和签名验证。

持久化会话到沙箱的映射。在收到连接请求时，恢复已暂停的工作进程或替换已删除的工作进程。暂停会保留其文件；替换则不会。为控制器和工作进程设置运行超时，并在你停止使用控制器时移除 OpenAI webhook。

## 应用管理

使用 E2B SDK 或 API 从你的应用程序管理沙箱：

1. [Create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个隔离的 E2B 沙盒，并在其中安装 Codex CLI。
3. [Start the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，在沙盒中使用环境 ID 和环境密钥启动它。
4. 使用 [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) 发送输入并检查该轮（turn）的结果。
5. [Delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并在完成后停止 E2B 沙盒。

将沙箱生命周期与执行器命令的超时分开配置。没有超时的命令不会让已过期的沙箱继续运行。

## 参考文档

- 阅读 [E2B documentation](https://docs.e2b.dev/)
- 阅读 [E2B Python SDK](https://github.com/e2b-dev/E2B/tree/main/packages/python-sdk)
- 阅读 [E2B TypeScript SDK](https://github.com/e2b-dev/E2B/tree/main/packages/js-sdk)