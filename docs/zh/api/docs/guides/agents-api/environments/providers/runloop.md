# Runloop

> 完整的文档索引请参见 [llms.txt](/llms.txt)。每个页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

在 OpenAI 运行 智能体 并维护会话状态的同时，在 Runloop Devbox 中执行代码并处理文件。

本指南使用 **application-managed** 配置：由你的应用启动 Devbox、连接其执行器，并在完成后将其关闭。详情参见 [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解生命周期行为。

## 准备工作

使用 Runloop SDK 或 API 来管理 Devbox，并使用 HTTP 请求来管理 智能体 API 会话。

设置 `RUNLOOP_API_KEY`, `OPENAI_API_KEY`，以及一个独立的受限 `OPENAI_EXECUTOR_API_KEY`。OpenAI 密钥必须具有相同的所有者、组织和项目。只有执行器密钥才能进入 Devbox。请参阅 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## 应用管理

1. [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用该会话的工作目录创建一个 Runloop Devbox，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在后台启动它，并传入环境 ID 和受限的执行器密钥。
4. [发送输入并查看结果](https://developers.openai.com/api/docs/guides/agents-api/sessions)。对于文件任务，在工作区中创建 `brief.txt` 文件，并要求该智能体将迁移计划写入 `plan.md`.
5. 检查该轮次是否完成，检索你需要的任何文件，然后关闭 Devbox 并 [删除该会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session).

使用有限的设置和执行超时,并设置 Devbox 生命周期限制作为后备,以防你的应用程序意外退出。如果需要后续对话,请保持会话和 Devbox 处于活跃状态。每个会话使用一个配置所有者;不要将配置 webhook 处理器附加到你的应用程序直接管理的会话上。

## 参考

- Read [Runloop documentation](https://docs.runloop.ai/)
- Read [Runloop Python SDK](https://runloopai.github.io/api-client-python/)
- Read [Runloop TypeScript SDK](https://runloopai.github.io/api-client-ts/stable/)