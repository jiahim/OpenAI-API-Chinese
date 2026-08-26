# Agents SDK

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

智能体是能够进行规划、调用工具、跨专家协作，并保持足够状态以完成多步骤工作的应用程序。

## 让第一个智能体运行起来

从 [Agents SDK 快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart) 开始，安装SDK、定义一个智能体并运行它。完成该步骤后，返回此处选择你的应用所需的下一个能力。

## 获取 Agents SDK

请访问 GitHub 仓库以获取更多示例、问题和特定语言的参考详情。



  [TypeScript SDK



        Open the TypeScript SDK repository on GitHub.](https://github.com/openai/openai-agents-js)
  [Python SDK



        Open the Python SDK repository on GitHub.](https://github.com/openai/openai-agents-python)



## 选择你的起点

| 如果你想                           | 从这里开始                                                                                                                                             | 原因                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 构建一个代码优先的智能体应用             | [快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart)                                                                                                       | 这是实现可用 SDK 集成的最短路径。                                        |
| 清晰定义一位专家            | [智能体定义](https://developers.openai.com/api/docs/guides/agents/define-agents)                                                                                             | 当你还在为单个智能体构建契约时，从这里开始。                         |
| 选择模型、默认设置和传输方式   | [模型和提供商](https://developers.openai.com/api/docs/guides/agents/models)                                                                                                 | 当模型选择、提供商设置或传输策略影响工作流时，使用此选项。        |
| 理解运行时循环和状态    | [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents)                                                                                               | 这里是智能体循环、流式处理和延续策略的所在之处。                     |
| 在基于容器的环境中运行工作 | [沙盒智能体](https://developers.openai.com/api/docs/guides/agents/sandboxes)                                                                                                    | 当智能体需要文件、命令、软件包、快照、挂载或提供商链接时，使用此选项。 |
| 设计专家的所有权              | [编排和交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                                                                                    | 当你需要多个智能体并必须决定谁负责回复时，请使用此选项。                 |
| 添加验证或人工审核           | [护栏和人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                            | 当工作流应在高风险操作继续前阻塞或暂停时，请使用此选项。                  |
| 了解运行返回什么            | [结果与状态](https://developers.openai.com/api/docs/guides/agents/results)                                                                                                   | 本页解释最终输出、可恢复状态和下一轮表面。                      |
| 添加托管工具、函数工具或 MCP | [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 和 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | 工具语义位于平台工具文档中；SDK特定的 MCP 和追踪在此处。        |
| 检查和改进运行                 | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 和 [评估智能体工作流](https://developers.openai.com/api/docs/guides/agent-evals)      | 首先使用追踪进行调试，然后进入评估循环。                               |
| 构建语音优先工作流             | [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents)                                                                                                          | 使用SDK的语音管道和实时智能体模式。                                      |

## 使用 SDK 构建

当你的服务器负责部署、工具实现、状态存储和审批决策，而 SDK 运行智能体循环并调用这些工具时，请使用 SDK 追踪。当你需要以下条件时，该路径是最佳选择：

- 使用 TypeScript 或 Python 编写的类型化应用程序代码
- 对工具、MCP 服务器和运行时行为的直接控制
- 自定义存储或服务端管理的对话策略
- 与现有产品逻辑或基础设施的紧密集成

一个典型的 SDK 阅读顺序是：

- 从 [快速开始](https://developers.openai.com/api/docs/guides/agents/quickstart) 开始，让一个工作流程在屏幕上运行。
- 使用 [智能体定义](https://developers.openai.com/api/docs/guides/agents/define-agents) 和 [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models) 来清晰地塑造一个专业智能体。
- 继续查看 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents), [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)，以及 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 随着工作流变得更加复杂。
- 使用 [结果与状态](https://developers.openai.com/api/docs/guides/agents/results) 和 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 当应用程序逻辑依赖运行对象或需要对行为有更深入的可见性时。

## Agents SDK 对比 Responses API

当你想要掌控循环时，使用 Responses API。当你希望 Agents SDK 来运行循环时，使用 SDK。

### 在以下情况下选择 Responses API：

- 你希望对模型交互、输出项、工具、状态和编排拥有直接控制权，无论工作流是单次调用还是多次调用。
- 你希望在应用程序中直接实现自定义工具路由、循环或分支逻辑。

在 [Responses 函数调用流程](https://developers.openai.com/api/docs/guides/function-calling#the-tool-calling-flow)，中，你的应用程序接收函数调用、执行函数、返回输出，并再次调用模型。

例如，一个 Responses API 工作流可能会搜索知识库并生成带引用的答案。

### 在以下情况下选择Agents SDK：

- 你希望 SDK 来管理智能体循环和重复性编排，例如重复的工具调用或分支。
- 不同的专家需要不同的指令、工具或策略。
- 你希望使用内置的会话、追踪、护栏或可恢复的审批流程。

该 [Agents SDK 运行器](https://developers.openai.com/api/docs/guides/agents/running-agents#the-agent-loop) 执行工具循环，在交接后切换智能体，并在运行完成或暂停等待审批时停止。

例如，Agents SDK 工作流可能调查支持请求，将其交给正确的专家，调用内部系统，请求退款审批，并记录结果。

### 比较 Responses API 与 Agents SDK

|                            | Responses API                                                                                                          | Agents SDK                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **最适合**               | 自定义模型驱动的功能和工作流                                                                            | 具有定义工具和重复编排模式的有界对话或事务性工作流                                                                                             |
| **核心抽象**       | 模型响应                                                                                                       | 智能体运行                                                                                                                                                                                        |
| **工具**                  | 平台工具、函数调用以及远程 [Model Context Protocol (MCP)](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)     | 附加到可复用智能体的平台工具，以及工具包装器、本地 MCP 连接和 [智能体作为工具](https://developers.openai.com/api/docs/guides/agents/orchestration#use-agents-as-tools-for-manager-style-workflows) |
| **工作流编排** | 你管理自定义循环和分支                                                                                  | SDK 提供智能体循环和生命周期                                                                                                                                                       |
| **多智能体工作流**  | 自行构建路由和委派                                                                                  | 内置的智能体即工具和 [交接](https://developers.openai.com/api/docs/guides/agents/orchestration#use-handoffs-for-delegated-ownership)                                                                                 |
| **状态**                  | 手动历史记录、响应链式处理或 [对话](https://developers.openai.com/api/docs/guides/conversation-state#using-the-conversations-api) | 相同的选项，以及 [SDK 会话和可恢复的运行状态](https://developers.openai.com/api/docs/guides/agents/running-agents#choose-one-conversation-strategy)                                                              |
| **安全与审批**   | 工具特定的审批；你构建更广泛的控制                                                                    | 输入、输出和工具 [护栏以及可恢复的审批流程](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                                    |
| **调试与追踪**  | 响应对象和 API 日志                                                                                          | [内置追踪](https://developers.openai.com/api/docs/guides/agents/integrations-observability#tracing) 跨模型调用、工具、智能体、护栏和交接                                                           |