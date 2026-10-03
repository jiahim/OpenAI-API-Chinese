# E2B

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 来获取。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/e2b/application_managed) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/e2b/webhook_managed) 示例请见 OpenAI Cookbook。

选择一种预配模式：

- **[由应用管理](#application-managed):** 由你的应用直接创建并连接 E2B 沙盒。
- **[由 Webhook 管理](#webhook-managed):** 部署一个处理器，从 OpenAI webhook 启动或重新连接沙盒。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

设置 `E2B_API_KEY` 并使用 `OPENAI_API_KEY` 用于应用请求。将 `OPENAI_EXECUTOR_API_KEY` 为某个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，然后仅将该密钥作为 `CODEX_API_KEY`.

## Webhook 托管

实现一个控制器，用于验证 OpenAI Webhook 并为每个会话配置一个独立的 E2B 工作节点。请遵循 [部署并连接处理器](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 以完成凭据配置、端点注册和签名验证。

持久化会话与沙箱的映射关系。当收到连接请求时，恢复已暂停的工作节点或替换已删除的工作节点。暂停会保留其文件；替换则不会。为控制器和工作节点设置运行超时，并在停止使用控制器时移除 OpenAI Webhook。

## Application-managed

使用 E2B SDK 或 API 从你的应用程序管理沙箱：

1. [Create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个隔离的 E2B 沙箱，并在其中安装 Codex CLI。
3. [Start the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在沙箱中，使用环境 ID 和环境密钥启动执行器。
4. 使用 [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) 来发送输入并查看该轮的输出结果。
5. [Delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并在完成后停止 E2B 沙箱。

单独配置沙箱生命周期与执行器命令的超时时间。没有超时的命令不会让已过期的沙箱保持运行。

## 参考

- 阅读 [E2B 文档](https://docs.e2b.dev/)
- 阅读 [E2B Python SDK](https://github.com/e2b-dev/E2B/tree/main/packages/python-sdk)
- 阅读 [E2B TypeScript SDK](https://github.com/e2b-dev/E2B/tree/main/packages/js-sdk)