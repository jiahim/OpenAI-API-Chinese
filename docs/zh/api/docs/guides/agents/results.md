# 结果与状态

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

当你运行一个智能体时，结果不仅仅是最终答案。它还包括交接边界、下一个回合的延续面，以及当一次运行暂停等待审核时的可恢复快照。

## 选择你需要的结果界面

大多数应用只需要一小部分结果属性：

| 如果你需要                                          | 使用                                                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 向用户展示的最终答案                    | `finalOutput` 使用 TypeScript，或 `final_output` 使用 Python              |
| 本地可回放历史记录                           | `history` 使用 TypeScript，或 `to_input_list()` 使用 Python               |
| 通常应在下一轮主导对话的专家智能体 | `lastAgent` 使用 TypeScript，或 `last_agent` 使用 Python                  |
| OpenAI 托管的响应链                     | `lastResponseId` 使用 TypeScript，或 `last_response_id` 使用 Python       |
| 待处理审批与可恢复快照           | `interruptions` 加上 `state` 使用 TypeScript，或 `to_state()` 使用 Python |

这些是你需要首先学习的使用指南层面的接口。更丰富的运行项、原始模型响应以及详细的诊断信息仍应查阅 SDK 文档和参考资料。

## 带入下一轮的上下文

以匹配你的延续策略的方式使用结果：

- 如果你的应用拥有完整的本地历史记录，请复用 `history` 在 TypeScript 中或 `to_input_list()` 在 Python 中。
- 如果使用 session，请保持传入相同的 session，让 SDK 为你加载并持久化历史记录。
- 如果使用服务端管理的 延续，只需传入新的用户输入，并复用已存储的 ID，而不是重放整个对话记录。
- 在交接之后，保留 `lastAgent` 在 TypeScript 中或 `last_agent` （在 Python 中），以便该专家智能体在下一轮继续掌控对话。

## 中断的运行返回状态，而非最终答案

审批流是结果故意不完整的主要用例。

- `finalOutput` 在 TypeScript 中或 `final_output` 在 Python 中可以
  保持为空，因为该运行实际上还未结束。
- `interruptions` 会告诉你哪些待处理的工具调用需要做出决策。
- `state` 在 TypeScript 中或 `to_state()` 在 Python 中是保存的
  快照，你需要在批准或拒绝这些
  项之后将其传回运行时。

同一状态面也是你在审查可能稍后（而非在同一请求中）发生时需要序列化的内容。

## 更丰富的项目和诊断界面

SDK 还对外暴露了更丰富的运行条目与诊断信息，适用于需要超出上述高层接口的应用场景。这包括条目级的工具和交接记录、原始模型响应、护栏结果，以及用量详情。

这些对于审计、自定义界面和深度调试非常有用，但并不需要成为大多数开发者在本站首先学习的内容。

## 下一步

确定哪些结果呈现层重要之后，请继续阅读相关指南，了解这些呈现层是如何生成或检查的。



  [运行智能体



        Connect result handling back to the runtime loop and continuation
      strategy.](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [护栏与人工审核



        了解暂停的运行如何返回中断以及可恢复的状态。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
  [集成与可观测性



        当你需要查看更丰富的工作流记录时，请使用追踪。](https://developers.openai.com/api/docs/guides/agents/integrations-observability)