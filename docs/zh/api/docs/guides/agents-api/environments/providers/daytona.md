# Daytona

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

使用 Daytona 沙箱运行一次 智能体 API 会话。

请参阅 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预配模式：

- **[Application-managed](#application-managed):** 按照本指南从你的应用中启动和停止沙箱。
- **[Webhook-managed](#webhook-managed):** 部署一个处理器，通过 OpenAI webhook 启动或重新连接沙箱。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## Webhook 托管

使用控制器来验证 OpenAI webhook 投递与队列准备工作。让该控制器与运行每个会话执行器的 worker 沙箱保持分离。然后按照 [部署并连接处理器](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) 注册端点和签名密钥。

处理 `environment_connection` 请求，通过启动或重新连接 worker，并在会话失败时将其释放。显式配置 worker 和控制器的超时时间。在空闲时停止计算需要与传入任务协同的策略，请参阅 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## 应用管理

### 开始之前

你需要 OpenAI 项目 API 密钥、一个 Daytona API 密钥以及 Codex CLI 包。

设置 `OPENAI_API_KEY`，一个独立的受限 `OPENAI_EXECUTOR_API_KEY`，以及 `DAYTONA_API_KEY` 到你的环境中。授予该应用密钥 `api.agents.read` 和 `api.agents.write` 用于会话操作，以及 `api.responses.write` 用于模型推理。添加 `api.vaults.read` 和 `api.vaults.write` 如果你的应用管理 vault，则还需添加。创建执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 并对两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行器密钥会进入沙箱。

### 1. 设置 Daytona 环境

创建 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Daytona SDK 或 API 创建一个具有已配置工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，并使用该环境 ID 与受限执行器密钥。

执行器与 OpenAI 的连接是出站且长连接的，Daytona 的非活动跟踪无法观测到它。请设置 `auto_stop_interval=0` ，使 智能体 正在工作时沙箱不会被停止，并配置生命周期限制，以免中断的运行导致计算资源无限期占用。

在常规使用中，将 Codex 与 `ripgrep` 放入 Daytona 快照中，以便沙箱能够更快地连接。

### 2. 运行会话

使用 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以在 Daytona 执行器连接后发送输入并流式传输结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止提供商沙盒。

在提交输入前启动沙盒。回合会等待环境连接，会话通过 `agent.session.environment.connected` 上报连接状态。

使用 `agent.session.turn.completed` 来标识一个成功的回合。失败或被取消的回合之后也会出现 `agent.session.idle`，因此不要把处于空闲状态的会话当作回合成功的证据。事件之后立即检索会话可能会短暂地返回先前的状态。

## 参考文档

- 阅读 [Daytona 文档](https://www.daytona.io/docs/en/)
- 阅读 [Daytona Python SDK 参考](https://www.daytona.io/docs/en/python-sdk/)
- 阅读 [Daytona TypeScript SDK 参考](https://www.daytona.io/docs/en/typescript-sdk/)