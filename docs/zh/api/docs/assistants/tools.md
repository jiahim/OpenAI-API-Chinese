# Assistants API 工具

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

在 Responses API 实现功能对等后,我们已弃用 Assistants API。它将于 2026-08-26 停止服务。请参阅 [迁移指南](https://developers.openai.com/platform/assistants/migration) 以更新你的集成。 [了解更多信息](https://platform.openai.com/docs/guides/migrate-to-responses).

## 概述

使用 Assistants API 创建的智能体可以配备工具，从而执行更复杂的任务或与你的应用交互。
我们为智能体提供了内置工具，但你也可以使用 Function Calling 定义自己的工具来扩展它们的能力。

Assistants API 目前支持以下工具：



文件搜索



      Built-in RAG tool to process and search through files




Code Interpreter



      Write and run python code, process files and diverse data




Function Calling



      Use your own custom functions to interact with your application



## 后续步骤

- 请参阅 API 参考以 [提交工具输出](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/submit_tool_outputs)
- 使用我们的 [快速入门应用](https://github.com/openai/openai-assistants-quickstart)