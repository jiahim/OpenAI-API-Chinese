# Daytona

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/daytona) 以及 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/daytona) 示例，详见 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 以了解执行器设置和连接要求。

选择预置模式：

- **[由应用管理](#application-managed):** 按照本指南从你的应用启动和停止沙箱。
- **[由 Webhook 管理](#webhook-managed):** 部署一个处理程序，用于从 OpenAI webhook 启动或重新连接沙箱。

请参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## Webhook 管理

使用控制器来验证 OpenAI webhook 投递和队列置备是否正常工作。让该控制器与运行每个会话执行器的 worker 沙箱分离。遵循 [部署并连接一个处理器](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 以注册端点和签名密钥。

处理 `environment_connection` 请求时启动或重新连接 worker，并在会话失败时释放它。显式配置 worker 和控制器的超时。在空闲时停止计算需要一种与传入工作协调的策略；参见 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## 应用自行管理

### 开始之前

你需要一个 OpenAI 项目 API 密钥、一个 Daytona API 密钥，以及 Codex CLI 包。

设置 `OPENAI_API_KEY`，这是一个独立的受限 `OPENAI_EXECUTOR_API_KEY`，以及 `DAYTONA_API_KEY` 到你的环境变量中。向应用密钥授予 `api.agents.read` 以及 `api.agents.write` 以执行会话操作，并授予 `api.responses.write` 用于模型推理。添加 `api.vaults.read` 以及 `api.vaults.write` 如果你的应用管理保管库，则需添加。创建执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) ，并对两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行器密钥会进入沙箱。

### 1. 设置 Daytona 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Daytona SDK 或 API 创建一个具有已配置工作目录的隔离沙盒。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，传入该环境 ID 和受限的执行器密钥。

执行器到 OpenAI 的连接是出站且长连接的，Daytona 的不活跃追踪不会监测该连接。请设置 `auto_stop_interval=0` ，以确保 智能体 运行时沙盒不会被停止，并配置一个生命周期限制，使被中断的运行不会让计算资源无限期持续运行。

对于常规使用，请将 Codex 和 `ripgrep` 放入 Daytona 快照中，以便沙盒能够更快连接。

### 2. 运行会话

使用中的 HTTP 示例 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Daytona 执行器连接后发送输入并流式传输结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

在提交输入之前先启动沙箱。轮次会等待环境连接，会话通过以下方式报告连接状态： `agent.session.environment.connected` 事件流。

使用 `agent.session.turn.completed` 来标识一次成功的轮次。失败或已取消的轮次之后也可能会出现 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证据。在事件之后立即检索会话时，可能会短暂地返回先前的状态。

## 参考资料

- 阅读 [Daytona 文档](https://www.daytona.io/docs/en/)
- 阅读 [Daytona Python SDK 参考](https://www.daytona.io/docs/en/python-sdk/)
- 阅读 [Daytona TypeScript SDK 参考](https://www.daytona.io/docs/en/typescript-sdk/)