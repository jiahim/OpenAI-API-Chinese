# Agents SDK

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

智能体 可以使用工具规划和完成任务，与其他 智能体 协作，并在多个步骤之间保持上下文。

## 运行你的第一个智能体

从 [Agents SDK 快速入门](https://developers.openai.com/api/docs/guides/agents/quickstart) 开始，安装 SDK，定义一个 智能体，并运行它。完成这些后，返回此处选择你的应用所需的下一个能力。

## 获取 Agents SDK

访问 GitHub 仓库以获取更多示例、问题反馈以及特定语言的参考细节。



  [TypeScript SDK



        Open the TypeScript SDK repository on GitHub.](https://github.com/openai/openai-agents-js)
  [Python SDK



        Open the Python SDK repository on GitHub.](https://github.com/openai/openai-agents-python)



## 选择你的起点

| 如果你想                            | 从这里开始                                                                                                                                             | 原因                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 构建以代码为先的智能体应用              | [快速开始](https://developers.openai.com/api/docs/guides/agents/quickstart)                                                                                                       | 这是通往可用 SDK 集成的最短路径。                                        |
| 清晰地定义一个专家             | [智能体 定义](https://developers.openai.com/api/docs/guides/agents/define-agents)                                                                                             | 当你仍在为一个 智能体 规划契约时，从这里开始。                         |
| 选择模型、默认值和传输方式    | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                                                                                 | 当模型选择、提供商配置或传输策略影响 工作流 时使用此文档。        |
| 理解运行时循环与状态     | [运行 智能体](https://developers.openai.com/api/docs/guides/agents/running-agents)                                                                                               | 这里涵盖 智能体 循环、流式输出以及 延续 策略。                     |
| 在基于容器的环境中运行任务 | [沙箱 智能体](https://developers.openai.com/api/docs/guides/agents/sandboxes)                                                                                                    | 当 智能体 需要文件、命令、软件包、快照、挂载或提供商链接时使用此文档。 |
| 设计专家分工               | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                                                                                    | 当你需要多个 智能体 并必须决定由谁负责回复时，请使用此选项。                 |
| 添加校验或人工审核            | [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                            | 当 工作流 应在有风险的工作继续之前阻塞或暂停时，请使用此选项。                  |
| 了解运行的返回内容             | [结果与状态](https://developers.openai.com/api/docs/guides/agents/results)                                                                                                   | 本页介绍最终输出、可恢复的状态以及下一轮的接口。                      |
| 添加托管工具、函数工具或 MCP  | [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 与 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | 工具语义位于平台工具文档中；SDK 专属的 MCP 与 追踪 在此处。        |
| 检查并改进运行                  | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) 与 [评估 智能体 工作流](https://developers.openai.com/api/docs/guides/agent-evals)      | 先使用追踪进行调试，再进入评估循环。                               |
| 构建以语音为先的 工作流              | [语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents)                                                                                                          | 使用 SDK 语音管道与实时 智能体 模式。                                        |

## 使用 SDK 构建

当你的服务器负责部署、工具实现、状态存储和审批决策，而 SDK 负责运行 智能体 循环并调用这些工具时，请使用 SDK track。这种方式最适合以下场景：

- TypeScript 或 Python 中的类型化应用代码
- 对工具、MCP 服务器和运行时行为的直接控制
- 自定义存储或由服务端管理的对话策略
- 与现有产品逻辑或基础设施的深度集成

一个典型的 SDK 读取顺序是：

- 从 [快速开始](https://developers.openai.com/api/docs/guides/agents/quickstart) 入手，先在屏幕上跑通一次。
- 使用 [智能体定义](https://developers.openai.com/api/docs/guides/agents/define-agents) 和 [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models) ，干净地塑造一个专家角色。
- 继续阅读 [运行智能体](https://developers.openai.com/api/docs/guides/agents/running-agents), [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)，以及 [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) ，随着工作流变得日益复杂。
- 使用 [结果与状态](https://developers.openai.com/api/docs/guides/agents/results) 和 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability) ，当应用逻辑依赖运行对象或需要更深入地洞察行为时。

<a id="compare-agent-runtimes"></a>

## 比较 智能体 运行时选项

使用 [智能体 概览](https://developers.openai.com/api/docs/guides/agents#compare-agent-runtimes) 来比较 Agents SDK、智能体 API 和 Responses API。Agents SDK 在你的应用中运行；智能体 API 在 OpenAI 的服务中运行托管 harness。