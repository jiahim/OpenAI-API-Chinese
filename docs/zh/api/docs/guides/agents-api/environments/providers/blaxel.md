# Blaxel

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

参见 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/blaxel) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/blaxel) 示例，详见 OpenAI Cookbook。

参见 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置与连接要求。

选择一种置备模式：

- **[应用管理](#before-you-begin):** 按照本指南从你的应用启动和停止沙箱。
- **[Webhook 管理](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，从 OpenAI webhook 启动或重新连接沙箱。

参见 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较两种模式。

## 开始之前

你需要一个 OpenAI 项目 API 密钥、一个 Blaxel API 密钥和工作区，以及 Codex CLI 包。

设置 `BL_API_KEY` 和 `BL_WORKSPACE`，并用于 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并且只将该密钥作为 `CODEX_API_KEY`.

在预配代码中选择沙箱区域。使用 `us-was-1` ，如果你需要下方的 智能体 Drive 持久化选项。

## 1. 设置 Blaxel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Blaxel SDK 或 API 创建一个具有已配置工作目录的隔离沙盒。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，并传入该环境 ID 和环境密钥。

Blaxel Node 镜像基于 Alpine Linux，因此请安装 `ripgrep` 时使用 `apk`。将环境密钥作为 `CODEX_API_KEY` 仅传递给执行器进程。设置 `keep_alive=True` 以防止执行器运行时沙盒缩容到零。有界设置、执行器和沙盒超时可防止被遗弃的资源无限期运行。

对于常规使用，请构建一个已包含 Codex 和 `ripgrep` 的 Blaxel 镜像，以便沙盒可以更快建立连接。

## 2. 运行会话

使用中的 HTTP 示例 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Blaxel 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider sandbox。

在提交输入之前启动 sandbox。该轮次会等待环境连接，并通过 `agent.session.environment.connected` 在事件流上报告连接状态。

使用 `agent.session.turn.completed` 来标识成功的轮次。失败或被取消的轮次之后也可能出现 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证据。

## 可选：在会话之间持久化文件

使用 [Blaxel 智能体 Drive](https://docs.blaxel.ai/Agent-drive/Overview) 以在沙盒和会话之间保留文件。在每个沙盒中挂载同一个 drive 以共享文件；智能体 Drive 要求使用相同的 `us-was-1` region，且不会传输对话历史或会话状态。

## 参考

- 阅读 [Blaxel Sandbox 文档](https://docs.blaxel.ai/Sandboxes/Overview)
- 阅读 [Blaxel Python SDK](https://docs.blaxel.ai/sdk-reference/sdk-python)
- 阅读 [Blaxel TypeScript SDK](https://docs.blaxel.ai/sdk-reference/sdk-ts)