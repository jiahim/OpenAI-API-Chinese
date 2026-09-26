# Daytona

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取对应页面的 Markdown 版本。

请参阅 [应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/daytona/application_managed) 和 [Webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/daytona/webhook_managed) 示例，请参见 OpenAI Cookbook。

请参阅 [自托管沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，了解执行器设置和连接要求。

选择预配模式：

- **[Application-managed](#application-managed):** 按照本指南从你的应用中启动和停止沙箱。
- **[Webhook-managed](#webhook-managed):** 部署一个处理程序，从 OpenAI Webhook 启动或重连沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## Webhook-managed

使用控制器来验证 OpenAI webhook 投递与队列准备工作，并将该控制器与运行每个会话执行器的 worker 沙箱分离。参考 [部署并连接一个 handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 以注册端点和签名密钥。

Handle `environment_connection` 请求时启动或重连 worker，并在会话失败时将其释放。显式配置 worker 和控制器的超时时间。在空闲时停止计算需要一项与传入工作负载协调的策略；请参阅 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## Application-managed

### 准备工作

你需要一个 OpenAI 项目 API 密钥、一个 Daytona API 密钥以及 Codex CLI 包。

设置 `DAYTONA_API_KEY` 并用于 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥传入沙箱中作为 `CODEX_API_KEY`.

### 1. 设置 Daytona 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Daytona SDK 或 API 创建一个配置了工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，并传入该环境 ID 和环境密钥。

执行器到 OpenAI 的连接是出站且长生命周期的，Daytona 的闲置跟踪不会观察到它。请设置 `auto_stop_interval=0` ，以免沙箱在 智能体 工作时被停止，并配置一个生命周期上限，以防中断的运行让计算资源无限期地保持运行。

对于常规使用，请将 Codex 和 `ripgrep` 放入 Daytona 快照中，以便沙箱能够更快地建立连接。

### 2. 运行会话

使用中的 HTTP 示例 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以在 Daytona 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

在提交输入之前启动 Sandbox。该轮次会等待环境连接，并通过 `agent.session.environment.connected` 在事件流上报告连接状态。

使用 `agent.session.turn.completed` 来标识一轮成功的执行。失败或被取消的轮次之后也可能出现 `agent.session.idle`，因此不要将空闲会话视为该轮成功的证据。在事件之后立即检索会话可能会短暂地返回之前的状态。

## 参考

- 阅读 [Daytona 文档](https://www.daytona.io/docs/en/)
- 阅读 [Daytona Python SDK 参考](https://www.daytona.io/docs/en/python-sdk/)
- 阅读 [Daytona TypeScript SDK 参考](https://www.daytona.io/docs/en/typescript-sdk/)