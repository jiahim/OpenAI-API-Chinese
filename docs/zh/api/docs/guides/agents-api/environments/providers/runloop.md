# Runloop

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed 示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/runloop) ，位于 OpenAI Cookbook 中。

本指南使用 **application-managed** 配置：由你的应用启动 Devbox、连接其执行器，并在完成后将其关闭。详见 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以了解生命周期行为。

## 准备工作

使用 Runloop SDK 或 API 管理 Devbox，并使用 HTTP 请求管理智能体 API 会话。

设置 `RUNLOOP_API_KEY`, `OPENAI_API_KEY`，以及一个独立的受限 `OPENAI_EXECUTOR_API_KEY`。OpenAI 密钥必须具有相同的所有者、组织和项目。只有执行者密钥会进入 Devbox。请参阅 [执行者身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## Application-managed

1. [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 并保存其环境 ID。
2. 使用会话的工作目录创建一个 Runloop Devbox，并在其中安装 Codex CLI。
3. [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) 在后台运行，并提供环境 ID 和受限的执行器密钥。
4. [发送输入并检查结果](https://developers.openai.com/api/docs/guides/agents-api/sessions)。对于文件任务，在工作区中创建 `brief.txt` ，并让 智能体 将迁移计划写入 `plan.md`.
5. 检查轮次是否完成，取回所需文件，然后关闭 Devbox 并 [删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session).

使用有界的设置和执行超时,并设置 Devbox 生命周期限制作为应用意外退出时的后备方案。如果你需要后续对话轮次,请保持会话和 Devbox 处于活跃状态。每个会话使用一个预配所有者;不要将预配 webhook 处理程序附加到由你的应用直接管理的会话。

## 参考

- 阅读 [Runloop 文档](https://docs.runloop.ai/)
- 阅读 [Runloop Python SDK](https://runloopai.github.io/api-client-python/)
- 阅读 [Runloop TypeScript SDK](https://runloopai.github.io/api-client-ts/stable/)