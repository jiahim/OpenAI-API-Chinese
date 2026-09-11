# Blaxel

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用 Blaxel 沙箱运行 智能体 API 会话。

请参阅 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择预置模式：

- **[Application-managed](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个用于从 OpenAI webhook 启动或重连沙箱的处理程序。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 开始之前

你需要 OpenAI 项目 API 密钥、Blaxel API 密钥和工作区，以及 Codex CLI 包。

设置 `OPENAI_API_KEY`，一个独立的受限 `OPENAI_EXECUTOR_API_KEY`, `BL_API_KEY`，以及 `BL_WORKSPACE` 到你的环境中。授予应用密钥 `api.agents.read` 和 `api.agents.write` 用于会话操作，以及 `api.responses.write` 用于模型推理。添加 `api.vaults.read` 和 `api.vaults.write` ，如果你的应用管理 vault。创建执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) ，并为两个密钥使用相同的组织、项目和用户或服务账号。只有受限的执行器密钥会进入沙箱。在你的预置代码中选择沙箱区域。使用 `us-was-1` 如果你需要下面的 智能体 Drive 持久化选项。

## 1. 设置 Blaxel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Blaxel SDK 或 API 创建一个具有已配置工作目录的隔离沙盒。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，传入该环境 ID 和受限的 executor 密钥。

Blaxel Node 镜像使用 Alpine Linux，因此安装 `ripgrep` 时使用 `apk`。将受限的 executor 密钥作为 `CODEX_API_KEY` 仅传递给 executor 进程。设置 `keep_alive=True` 以防止在 executor 运行期间沙盒缩容为零。有界的 setup、executor 和 sandbox 超时可防止被遗弃的资源无限期运行。

对于常规使用，请构建一个已安装 Codex 和 `ripgrep` 的 Blaxel 镜像，以便沙盒能够更快连接。

## 2. 运行会话

使用中的 HTTP 示例 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) ，在 Blaxel 执行器连接后发送输入并流式返回结果。完成后， [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

在提交输入之前启动沙箱。该轮次会等待环境连接，会话通过 `agent.session.environment.connected` 在事件流中报告连接状态。

使用 `agent.session.turn.completed` 来标识一次成功的轮次。一次失败或被取消的轮次之后也可能是 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证据。

## 可选：在会话之间保留文件

使用 [Blaxel 智能体 Drive](https://docs.blaxel.ai/Agent-drive/Overview) 以在沙盒和会话之间保留文件。在每个沙盒中挂载同一个 drive 以共享文件；智能体 Drive 需要 `us-was-1` region,且不会传输对话历史或会话状态。

## 参考

- 阅读 [Blaxel Sandbox 文档](https://docs.blaxel.ai/Sandboxes/Overview)
- 阅读 [Blaxel Python SDK](https://docs.blaxel.ai/sdk-reference/sdk-python)
- 阅读 [Blaxel TypeScript SDK](https://docs.blaxel.ai/sdk-reference/sdk-ts)