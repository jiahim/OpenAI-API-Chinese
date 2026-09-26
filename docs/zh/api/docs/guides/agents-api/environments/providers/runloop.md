# Runloop

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

请参阅 [应用托管示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/runloop/application_managed) 的 OpenAI Cookbook。

本指南使用 **应用托管** 预配：由你的应用启动 Devbox，连接其执行器，并在完成后将其关闭。有关生命周期行为，请参阅 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 。

## 开始之前

使用 Runloop SDK 或 API 来管理 Devbox，并使用 HTTP 请求来管理 智能体 API 会话。

设置 `RUNLOOP_API_KEY` 并使用 `OPENAI_API_KEY` 用于应用请求。设置 `OPENAI_EXECUTOR_API_KEY` 为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)，并仅将该密钥作为 `CODEX_API_KEY`.

## Application-managed

1. [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个 Runloop Devbox，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在后台运行，并提供环境 ID 和环境密钥。
4. [发送输入并检查结果](https://developers.openai.com/api/docs/guides/agents-api/sessions)。对于文件任务，请在工作区中创建 `brief.txt` ，并让 智能体将迁移计划写入 `plan.md`.
5. 确认该轮次已完成，检索所需的任何文件，然后关闭 Devbox 并 [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session).

使用有界的设置和执行超时，并为 Devbox 设置一个生命周期上限作为兜底，以应对你的应用意外退出的情况。如果需要进行后续对话，请保持会话和 Devbox 处于活跃状态。每个会话只使用一个配置所有者；不要将配置 webhook 处理器附加到你的应用直接管理的会话上。

## 参考

- 阅读 [Runloop 文档](https://docs.runloop.ai/)
- 阅读 [Runloop Python SDK](https://runloopai.github.io/api-client-python/)
- 阅读 [Runloop TypeScript SDK](https://runloopai.github.io/api-client-ts/stable/)