# E2B

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需 Markdown 版本的文档页面，可在页面 URL 后追加 `.md` 来获取。

在 OpenAI 运行 智能体 并维护会话状态的同时，在 E2B 中运行沙箱工具。

选择预配模式：

- **[Application-managed](#application-managed):** 由你的应用直接创建并连接 E2B 沙箱。
- **[Webhook-managed](#webhook-managed):** 部署一个处理器，用于根据 OpenAI 的 webhook 启动或重连沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

Set `E2B_API_KEY`, `OPENAI_API_KEY`，以及一个单独的受限 `OPENAI_EXECUTOR_API_KEY`。请将应用密钥保存在 worker 沙箱之外。执行器密钥必须与会话所有者的组织、项目以及用户或服务账号匹配。参见 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## Webhook-managed

实现一个控制器，验证 OpenAI webhook，并为每个会话启动一个独立的 E2B worker。请参阅 [部署并连接 handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 以获取凭据、端点注册和签名验证的相关说明。

持久化会话与沙箱的映射关系。当收到连接请求时，恢复已暂停的 worker，或替换已删除的 worker。暂停会保留其文件；替换则不会。为 controller 和 worker 设置运行时长超时，并在停止使用 controller 时移除 OpenAI webhook。

## Application-managed

使用 E2B SDK 或 API 从你的应用中管理沙箱：

1. [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个隔离的 E2B 沙箱，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在沙箱中，使用环境 ID 和受限的执行器密钥启动执行器。
4. 使用 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以发送输入并检查本轮执行的结果。
5. [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并在完成后停止该 E2B 沙箱。

将沙盒生命周期与执行器命令的超时分开配置。没有超时的命令不会让已过期的沙盒继续运行。

## 参考资料

- 阅读 [E2B documentation](https://docs.e2b.dev/)
- 阅读 [E2B Python SDK](https://github.com/e2b-dev/E2B/tree/main/packages/python-sdk)
- 阅读 [E2B TypeScript SDK](https://github.com/e2b-dev/E2B/tree/main/packages/js-sdk)