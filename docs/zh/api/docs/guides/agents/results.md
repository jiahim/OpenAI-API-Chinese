# 结果与状态

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

当你运行一个智能体时，结果不仅仅是最终答案。它还是交接边界、下一轮延续表面，以及运行暂停等待审查时的可恢复快照。

## 选择你所需的结果表面

大多数应用只需要一小部分结果属性：

| 如果需要                                          | 使用                                                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 向用户显示的最终答案                    | `finalOutput` in TypeScript 或 `final_output` in Python              |
| 本地可重放历史                           | `history` in TypeScript 或 `to_input_list()` in Python               |
| 通常应拥有下一轮对话的专家 | `lastAgent` in TypeScript 或 `last_agent` in Python                  |
| OpenAI 管理的响应链                     | `lastResponseId` in TypeScript 或 `last_response_id` in Python       |
| 待处理审批和可恢复的快照           | `interruptions` plus `state` in TypeScript 或 `to_state()` in Python |

这些是需要优先学习的指南级界面。更丰富的运行项、原始模型响应和详细诊断信息仍属于SDK文档和参考资料。

## 下一轮应携带的内容

以符合你的延续策略的方式使用结果：

- 如果你的应用拥有完整的本地历史记录，请复用 `history` （TypeScript）或 `to_input_list()` （Python）。
- 如果你使用的是会话，请继续传递同一会话，让 SDK 为你加载并持久化历史记录。
- 如果你使用的是服务端管理的 延续，仅传递新的用户输入并复用存储的 ID，而不是重放完整对话记录。
- 交接后，请复用 `lastAgent` （TypeScript）或 `last_agent` （Python），以便该专家在下一次交互中继续掌控。

## 被中断的运行返回状态，而非最终答案

审批流程是结果被有意保持不完整的主要情形。

- `finalOutput` 在 TypeScript 或 `final_output` 在 Python 中可以
  保持为空，因为运行尚未真正结束。
- `interruptions` 告诉你哪些待处理的工具调用需要做出决策。
- `state` 在 TypeScript 或 `to_state()` 在 Python 中是保存的
  快照，你在批准或拒绝那些
  条目后将其传回运行时。

当审查可能稍后进行而非在同一个请求中发生时，你序列化的正是这同一状态表面。

## 更丰富的条目与诊断表面

SDK 还为需要超越上述高级接口的应用程序提供了更丰富的运行项和诊断信息，包括项级工具和 交接 记录、原始模型响应、护栏 结果以及使用详情。

这些对于审计、自定义界面和深度调试很有用，但并非本网站上大多数开发者首先需要学习的内容。

## 后续步骤

一旦你知道了哪些结果层面很重要，接下来就继续阅读说明这些层面是如何生成或被检查的指南。



  [运行 智能体



        Connect result handling back to the runtime loop and continuation
      strategy.](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [护栏和人工审核



        了解暂停运行如何返回中断和可恢复状态。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
  [集成和可观测性



        当你需要检查更丰富的 工作流 记录时，请使用追踪。](https://developers.openai.com/api/docs/guides/agents/integrations-observability)