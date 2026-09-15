# Runloop

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed 示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/runloop) （位于 OpenAI Cookbook 中）。

本指南使用 **application-managed** 配置方式：由你的应用启动 Devbox、连接其 executor，并在结束时关闭它。详见 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以了解生命周期行为。

## 准备工作

使用 Runloop SDK 或 API 来管理 Devbox，并使用 HTTP 请求来管理 智能体 API 会话。

设置 `RUNLOOP_API_KEY` 并使用 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥作为传入 Devbox `CODEX_API_KEY`.

## Application-managed

1. [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个 Runloop Devbox，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在后台启动，并传入环境 ID 和环境密钥。
4. [发送输入并检查结果](https://developers.openai.com/api/docs/guides/agents-api/sessions)。对于文件任务，在 `brief.txt` 工作区中创建文件，并让智能体将迁移方案写入该文件。 `plan.md`.
5. 检查该轮次是否已完成，检索你需要的任何文件，然后关闭 Devbox 并 [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session).

使用有界（bounded）的设置和执行超时，并设置一个 Devbox 生命周期上限作为兜底，以防你的应用意外退出。如果你需要后续回合（turn），请保持会话和 Devbox 处于活跃状态。每个会话使用一个预配（provisioning）所有者；不要将预配 webhook 处理器附加到你的应用直接管理的会话上。

## 参考文档

- 阅读 [Runloop 文档](https://docs.runloop.ai/)
- 阅读 [Runloop Python SDK](https://runloopai.github.io/api-client-python/)
- 阅读 [Runloop TypeScript SDK](https://runloopai.github.io/api-client-ts/stable/)