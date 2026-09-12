# 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

智能体可以使用工具规划和完成任务，与其他智能体协作，并在多个步骤之间保持上下文。请根据你希望编排运行的位置以及应由谁来管理任务之间的状态，选择相应的运行时。

## 选择你的起点

| 你希望                                                                          | 从这里开始                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 使用由 OpenAI 管理的 Codex 工具运行 智能体                                | [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/quickstart)   |
| 在应用中使用可复用的 智能体、工具和 交接 控制 智能体 循环 | [Agents SDK](https://developers.openai.com/api/docs/guides/agents/quickstart)       |
| 直接处理模型响应并控制你的集成方式                      | [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) |
| 添加嵌入式聊天体验                                                      | [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)                    |

<a id="agents-sdk-vs-responses-api"></a>

<a id="compare-agent-runtimes"></a>

## 比较智能体运行时选项

|                          | 智能体 API                                                                      | Agents SDK                                                          | Responses API                                             |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| **用途**              | 适用于 OpenAI 负责管理 智能体 并保存其进度的长时间运行任务        | 在你的应用中构建带有自定义工具和工作流的 智能体 | 直接调用模型或从零开始构建一个 智能体 |
| 智能体 的运行环境     | OpenAI 运行托管的 Codex harness                                             | SDK 在你的应用内运行                                | 你的应用，可选托管编排      |
| 智能体 集成工作量 | 低                                                                             | 中                                                              | 高                                                      |
| 任务间的状态      | 已保存的会话配置、轮次和条目                                   | 你自己的存储和 SDK 会话，或 Responses 对话状态      | 手动维护历史、响应链或 Conversations       |
| 工具执行           | 服务连接工具、应用函数处理器，以及可选的沙盒 | 在你的应用中配置的工具和集成               | 托管工具以及你的应用所运行的工具              |
| 执行环境    | OpenAI 托管沙盒、自托管沙盒或不使用沙盒                       | 你的运行时和沙盒提供方集成                      | 你自己的执行环境                            |
| 从这里开始               | [智能体 API 概述](https://developers.openai.com/api/docs/guides/agents-api/overview)                     | [Agents SDK 概述](https://developers.openai.com/api/docs/guides/agents/sdk)                  | [Responses 指南](https://developers.openai.com/api/docs/guides/migrate-to-responses)  |

智能体 API 运行 Codex 框架并管理底层的智能体基础设施，让你专注于你的智能体所做的事情。它包括自动上下文压缩、多智能体编排、可编程工具调用以及对 MCP 服务器的支持。详见 [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture).

智能体开发工具包 Agents SDK 让你的应用程序能够控制部署、存储、审批和运行时集成。其运行器负责处理智能体循环和交接。详见 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents).




## 添加工具、技能和提示缓存

工具设计、可复用技能和提示缓存适用于各类 智能体 工作流。其配置方式和生命周期会因 API 而异。

- 从 [使用工具](https://developers.openai.com/api/docs/guides/tools) 开始，了解函数调用、MCP 以及托管能力。
- 阅读 [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 以了解使用 JavaScript 进行编排以及每个 API 的配置。
- 使用 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 了解可复用的指令以及受支持的加载机制。
- 阅读 [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 了解共享缓存行为，然后查看 [智能体 API observability and usage](https://developers.openai.com/api/docs/guides/agents-api/observability) 了解会话计费。

An 智能体 API 会话、一个 SDK 会话、一个 Responses 对话以及沙箱都是不同的资源。请遵循你所选运行时的状态管理与清理说明。