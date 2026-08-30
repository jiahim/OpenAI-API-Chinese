# Agents SDK

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

智能体 是能够规划任务、调用工具、跨专家协作，并保持足够状态以完成多步工作的应用程序。

## 运行你的第一个智能体

从 [Agents SDK 快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart) 开始，安装 SDK，定义一个智能体，并运行它。确认无误后，返回此处为你的应用选择下一项所需能力。

## 获取 Agents SDK

请使用 GitHub 仓库获取更多示例、问题反馈以及针对特定语言的参考细节。



  [TypeScript SDK



        Open the TypeScript SDK repository on GitHub.](https://github.com/openai/openai-agents-js)
  [Python SDK



        Open the Python SDK repository on GitHub.](https://github.com/openai/openai-agents-python)



## 选择你的起点

| 如果你想                           | 从这里开始                                                                                                                                             | 原因                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 以代码优先的方式构建一个 智能体 应用             | [快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart)                                                                                                       | 这是通往可运行的 SDK 集成的最短路径。                                        |
| 清晰地定义一个专家            | [智能体 定义](https://developers.openai.com/api/docs/guides/agents/define-agents)                                                                                             | 当你还在为单个 智能体 设计接口契约时，从这里开始。                         |
| 选择模型、默认值和传输方式   | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                                                                                 | 当模型选择、提供商设置或传输策略影响 工作流 时，使用本文档。        |
| 理解运行时循环与状态    | [运行 智能体](https://developers.openai.com/api/docs/guides/agents/running-agents)                                                                                               | 这里介绍了 智能体 循环、流式输出以及 延续 策略。                     |
| 在基于容器的环境中运行任务 | [沙箱化 智能体](https://developers.openai.com/api/docs/guides/agents/sandboxes)                                                                                                    | 当 智能体 需要文件、命令、软件包、快照、挂载或提供商连接时，使用本文档。 |
| 设计专家职责划分              | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                                                                                    | 当你需要多个 智能体，并且必须决定由谁负责回复时，使用该功能。                 |
| 添加校验或人工审核           | [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                            | 当 工作流 应该在高风险工作继续之前进行拦截或暂停时，使用该功能。                  |
| 了解一次运行会返回什么            | [结果与状态](https://developers.openai.com/api/docs/guides/agents/results)                                                                                                   | 本页介绍最终输出、可恢复的状态以及下一轮的接口。                      |
| 添加工具、函数工具或 MCP | [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 和 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | 工具语义位于平台工具文档中；SDK-specific MCP 与 追踪 位于此处。        |
| 检查并改进运行                 | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 和 [评估 智能体 工作流](https://developers.openai.com/api/docs/guides/agent-evals)      | 先使用追踪进行调试，然后再进入评估循环。                               |
| 构建一个以语音为先的 工作流             | [语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents)                                                                                                          | 使用 SDK 的语音流水线与实时 智能体 模式。                                      |

## 使用 SDK 进行构建

当你的服务端负责部署、工具实现、状态存储和审批决策时，使用 SDK 追踪模式，而 SDK 则运行 智能体 循环并调用这些工具。当你有以下需求时，这种路径是最佳选择：

- 使用 TypeScript 或 Python 编写的类型化应用代码
- 对工具、MCP 服务器和运行时行为的直接控制
- 自定义存储或服务端管理的会话策略
- 与现有产品逻辑或基础设施的深度集成

典型的 SDK 阅读顺序为：

- 从 [快速开始](https://developers.openai.com/api/docs/guides/agents/quickstart) 入手，让一次可运行的流程在屏幕上跑通。
- 使用 [智能体定义](https://developers.openai.com/api/docs/guides/agents/define-agents) 和 [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models) 清晰地塑造一个专家。
- 接下来进入 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents), [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)，以及 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) ，以应对工作流日趋复杂的情况。
- 使用 [结果与状态](https://developers.openai.com/api/docs/guides/agents/results) 和 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当应用逻辑依赖于运行对象或需要更深入地洞察行为时使用。

## Agents SDK vs. Responses API

当你希望自主控制执行循环时，请使用 Responses API；当你希望由 SDK 来运行流程时，请使用 Agents SDK。

### 选择 Responses API 的场景

- 你希望直接控制模型交互、输出项、工具、状态和编排，无论 工作流 只调用一次还是多次。
- 你希望在应用中直接实现自定义工具路由、循环或分支。

在 [Responses function-calling flow](https://developers.openai.com/api/docs/guides/function-calling#the-tool-calling-flow)，你的应用会收到函数调用，执行这些函数，返回它们的输出，然后再次调用模型。

例如，一个 Responses API 工作流可能会搜索知识库并生成带引用的回答。

### 在以下情况选择 Agents SDK

- 你希望 SDK 来管理 智能体 循环以及重复出现的编排工作，例如反复调用工具或进行分支判断。
- 不同的专家角色需要不同的指令、工具或策略。
- 你希望内置会话、追踪、护栏或可恢复的审批流程。

该 [Agents SDK runner](https://developers.openai.com/api/docs/guides/agents/running-agents#the-agent-loop) 执行工具循环，在交接后切换智能体，并在运行完成或暂停等待审批时停止。

例如，一个Agents SDK工作流可能会调查一个支持请求，将其移交给正确的专员，调用内部系统，请求批准退款，并记录结果。

### 比较 Responses API 与 Agents SDK

|                            | Responses API                                                                                                          | Agents SDK                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **最适合**               | 自定义模型驱动的功能和工作流                                                                            | 具有明确工具和可复用编排模式的有界对话或事务型工作流                                                                                             |
| **核心抽象**       | 一次模型响应                                                                                                       | 一次智能体运行                                                                                                                                                                                        |
| **工具**                  | 平台工具、函数调用以及远程 [模型上下文协议 (MCP)](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)     | 附加到可复用智能体的平台工具，以及工具封装、本地 MCP 连接和 [智能体作为工具](https://developers.openai.com/api/docs/guides/agents/orchestration#use-agents-as-tools-for-manager-style-workflows) |
| **工作流编排** | 你自行管理自定义循环和分支                                                                                  | SDK 提供 智能体 循环和生命周期                                                                                                                                                       |
| **多智能体工作流**  | 自行构建路由与委派                                                                                  | 内置的智能体作为工具，以及 [交接](https://developers.openai.com/api/docs/guides/agents/orchestration#use-handoffs-for-delegated-ownership)                                                                                 |
| **状态**                  | 手动历史记录、响应链，或 [Conversations](https://developers.openai.com/api/docs/guides/conversation-state#using-the-conversations-api) | 上述同样的选项，以及 [SDK会话和可恢复的运行状态](https://developers.openai.com/api/docs/guides/agents/running-agents#choose-one-conversation-strategy)                                                              |
| **安全与审批**   | 针对具体工具的审批；更广泛的控制由你自行构建                                                                    | 针对输入、输出与工具的 [护栏，以及可恢复的审批流程](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                                    |
| **调试与追踪**  | 响应对象与API日志                                                                                          | [内置追踪](https://developers.openai.com/api/docs/guides/agents/integrations-observability#tracing) 覆盖模型调用、工具、智能体、护栏和交接                                                           |