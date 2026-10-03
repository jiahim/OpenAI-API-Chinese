# Blaxel

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/blaxel/application_managed) 和 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/blaxel/webhook_managed) 示例请见 OpenAI Cookbook。

参阅 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解执行器设置和连接要求。

选择一种置备模式：

- **[Application-managed](#before-you-begin):** 按照本指南在应用中启动和停止沙箱。
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** 部署一个处理程序，从 OpenAI webhook 启动或重新连接沙箱。

参阅 [沙盒生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较这两种模式。

## 准备工作

你需要一个 OpenAI 项目 API 密钥、一个 Blaxel API 密钥及工作区，以及 Codex CLI 包。

设置 `BL_API_KEY` 和 `BL_WORKSPACE`，并使用 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥作为 `CODEX_API_KEY`.

在预置代码中选择沙箱区域。使用 `us-was-1` 如果你需要下方智能体 Drive 持久化选项。

## 1. 设置 Blaxel 环境

创建一个 [自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。使用 Blaxel SDK 或 API 创建一个隔离沙盒，并配置好工作目录。在沙盒中安装 Codex CLI，然后 [启动其执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) ，传入该环境 ID 和环境密钥。

Blaxel Node 镜像使用 Alpine Linux，因此请安装 `ripgrep` 时使用 `apk`。将环境密钥作为 `CODEX_API_KEY` 仅传递给执行器进程。设置 `keep_alive=True` 以防止执行器运行时沙盒缩减到零。受限的设置、执行器和沙盒超时可以避免被放弃的资源无限期运行。

对于常规使用，请构建一个已预装 Codex 和 `ripgrep` 的 Blaxel 镜像，以便沙盒可以更快连接。

## 2. 运行会话

使用其中的 HTTP 示例 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 在 Blaxel 执行器连接后发送输入并流式返回结果。完成后， [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 沙箱。

在提交输入前先启动沙箱。轮次会等待环境连接，并通过 `agent.session.environment.connected` 在事件流中报告连接状态。

使用 `agent.session.turn.completed` 来标识一次成功的轮次。失败或被取消的轮次之后也可能出现 `agent.session.idle`，因此不要将空闲会话视为轮次成功的证明。

## 可选：在会话之间持久化文件

使用 [Blaxel 智能体 Drive](https://docs.blaxel.ai/Agent-drive/Overview) 以在沙箱和会话之间保留文件。在每个沙箱中挂载相同的 drive 即可共享文件；智能体 Drive 需要指定 `us-was-1` 区域，且不会传输对话历史或会话状态。

## 参考资料

- 阅读 [Blaxel Sandbox 文档](https://docs.blaxel.ai/Sandboxes/Overview)
- 阅读 [Blaxel Python SDK](https://docs.blaxel.ai/sdk-reference/sdk-python)
- 阅读 [Blaxel TypeScript SDK](https://docs.blaxel.ai/sdk-reference/sdk-ts)