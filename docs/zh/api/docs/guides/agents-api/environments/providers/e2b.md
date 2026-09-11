# E2B

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/e2b) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/e2b) 示例，请参阅 OpenAI Cookbook。

选择预配模式：

- **[应用管理](#application-managed):** 你的应用直接创建并连接 E2B 沙箱。
- **[Webhook 管理](#webhook-managed):** 部署一个处理器，用于通过 OpenAI webhook 启动或重新连接沙箱。

参见 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

Set `E2B_API_KEY`, `OPENAI_API_KEY`, and a separate restricted `OPENAI_EXECUTOR_API_KEY`. Keep the application key outside the worker sandbox. The executor key must match the session owner's organization, project, and user or service account. See [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## Webhook-managed

实现一个控制器，用于验证 OpenAI webhook，并为每个会话启动一个独立的 E2B worker。部署并连接 [一个 handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) ，用于完成凭据获取、端点注册和签名验证。

持久化会话与沙箱之间的映射关系。在收到连接请求时，恢复已暂停的 worker，或替换已被删除的 worker。暂停会保留其文件，而替换则不会。为控制器和 workers 设置运行超时，并在你停止使用该控制器时移除 OpenAI webhook。

## 应用管理

在你的应用中使用 E2B SDK 或 API 来管理沙箱：

1. [创建一个自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个隔离的 E2B 沙箱，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，使用环境 ID 和受限的执行器密钥在沙箱中启动。
4. 使用 [运行和继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 来发送输入并检查该轮的结果。
5. [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) ，并在完成后停止 E2B 沙箱。

单独配置沙盒生命周期与执行器命令的超时。没有设置超时的命令不会让已过期的沙盒继续运行。

## 参考资料

- 阅读 [E2B documentation](https://docs.e2b.dev/)
- 阅读 [E2B Python SDK](https://github.com/e2b-dev/E2B/tree/main/packages/python-sdk)
- 阅读 [E2B TypeScript SDK](https://github.com/e2b-dev/E2B/tree/main/packages/js-sdk)