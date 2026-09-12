# Blaxel

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来访问。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/blaxel) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/blaxel) 示例，见 OpenAI Cookbook。

请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择一种配置模式：

- **[Application-managed](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个用于从 OpenAI webhook 启动或重连沙箱的处理器。

请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

你需要一个 OpenAI 项目 API 密钥、一个 Blaxel API 密钥和工作区，以及 Codex CLI 包。

设置 `OPENAI_API_KEY`，一个独立的受限 `OPENAI_EXECUTOR_API_KEY`, `BL_API_KEY`，以及 `BL_WORKSPACE` 在你的环境中。为应用密钥授予 `api.agents.read` 和 `api.agents.write` 用于会话操作的权限，外加 `api.responses.write` 用于模型推理。添加 `api.vaults.read` 和 `api.vaults.write` 如果你的应用管理 vault。创建执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 并对两个密钥使用相同的组织、项目以及用户或服务账号。只有受限的执行器密钥会进入沙箱。在你的预置代码中选择沙箱区域。如果需要使用下方的 智能体 Drive 持久化选项，请使用 `us-was-1` 。

## 1. 设置 Blaxel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Blaxel SDK 或 API 创建一个配置了工作目录的隔离沙箱。在沙箱中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 时使用该环境 ID 以及受限的执行器密钥。

Blaxel Node 镜像基于 Alpine Linux，因此请安装 `ripgrep` 使用 `apk`。将受限的执行器密钥作为 `CODEX_API_KEY` 仅传递给执行器进程。将 `keep_alive=True` 设为防止沙箱在执行器运行期间缩容至零。有界的设置、执行器和沙箱超时可防止被遗弃的资源无限期运行。

在常规使用中，构建一个已预装 Codex 和 `ripgrep` 的 Blaxel 镜像，以便沙箱可以更快连接。

## 2. 运行会话

使用中的 HTTP 示例 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Blaxel 执行器连接后发送输入并流式传输结果。完成后， [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

在提交输入之前启动沙箱。轮次会等待环境连接，会话通过 `agent.session.environment.connected` 在事件流中上报连接情况。

使用 `agent.session.turn.completed` 来标识成功的轮次。失败或取消的轮次之后也可能出现 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证据。

## 可选：在会话之间持久化文件

使用 [Blaxel 智能体 Drive](https://docs.blaxel.ai/Agent-drive/Overview) 以便在沙箱和会话之间保留文件。在每个沙箱中挂载同一个驱动器即可共享文件；智能体 Drive 要求使用相同的 `us-was-1` 区域，并且不会传输对话历史或会话状态。

## 参考

- 阅读 [Blaxel Sandbox 文档](https://docs.blaxel.ai/Sandboxes/Overview)
- 阅读 [Blaxel Python SDK](https://docs.blaxel.ai/sdk-reference/sdk-python)
- 阅读 [Blaxel TypeScript SDK](https://docs.blaxel.ai/sdk-reference/sdk-ts)