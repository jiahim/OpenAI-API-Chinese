# Daytona

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/daytona) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/daytona) 示例，请参阅 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预配模式：

- **[Application-managed](#application-managed):** 按照本指南从你的应用程序启动和停止沙盒。
- **[Webhook-managed](#webhook-managed):** 部署一个处理程序，用于通过 OpenAI webhook 启动或重新连接沙盒。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 由 Webhook 管理

使用控制器来验证 OpenAI Webhook 投递和队列配置工作。将该控制器与运行每个会话执行器的 worker 沙箱分开。继续阅读 [部署并连接处理器](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 以注册端点和签名密钥。

处理 `environment_connection` 请求时启动或重新连接 worker，并在会话失败时释放它。显式配置 worker 和控制器的超时。停止空闲时的计算需要与传入工作协调的策略；请参阅 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## Application-managed

### 准备工作

你需要一个 OpenAI project API key、一个 Daytona API key，以及 Codex CLI 包。

设置 `DAYTONA_API_KEY` 并用于 `OPENAI_API_KEY` ，用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并将该密钥传入沙箱作为 `CODEX_API_KEY`.

### 1. 配置 Daytona 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Daytona SDK 或 API 创建一个配置好工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 时使用该环境 ID 和环境密钥。

执行器到 OpenAI 的连接是出站且长连接的，Daytona 的闲置追踪无法观察到该连接。请设置 `auto_stop_interval=0` ，以确保 智能体 运行时沙箱不会被停止，并配置一个生命周期上限，避免中断的运行使计算资源无限期占用。

在常规使用中，将 Codex 与 `ripgrep` 放入 Daytona 快照中，以便沙箱可以更快建立连接。

### 2. 运行会话

使用 HTTP 示例，位于 [运行会话并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 中，在 Daytona 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider sandbox。

在提交输入前启动 Sandbox。该轮次会等待环境连接，会话通过 `agent.session.environment.connected` 在事件流上报连接状态。

使用 `agent.session.turn.completed` 来标识一次成功的轮次。失败或已取消的轮次之后也可能出现 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证据。事件刚发生后立即检索会话，可能会短暂返回先前的状态。

## 参考

- 阅读 [Daytona 文档](https://www.daytona.io/docs/en/)
- 阅读 [Daytona Python SDK 参考](https://www.daytona.io/docs/en/python-sdk/)
- 阅读 [Daytona TypeScript SDK 参考](https://www.daytona.io/docs/en/typescript-sdk/)