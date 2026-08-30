# 编排与交接

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Multi-智能体 workflows are useful when specialists should own different parts of the job. The first design choice is deciding who owns the final user-facing answer at each branch of the 工作流.

## 选择编排模式

| 模式         | 使用场景                                                                   | 行为                             |
| --------------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| 交接        | 应由某个专家智能体接管该工作分支的对话    | 控制权移交给该专家智能体    |
| 智能体作为工具 | 应由一个管理者持续掌控，并将专家作为受限能力调用 | 管理者保持对回复的所有权 |

## 使用交接来委派所有权

当应由某个专家完全主导下一轮回复、而非仅仅在幕后提供协助时，交给交接是最直接的方案。

通过交接进行委派

```javascript
import { Agent, handoff } from "@openai/agents";

const billingAgent = new Agent({ name: "Billing agent" });
const refundAgent = new Agent({ name: "Refund agent" });

const triageAgent = Agent.create({
  name: "Triage agent",
  handoffs: [billingAgent, handoff(refundAgent)],
});
```

```python
from agents import Agent, handoff

billing_agent = Agent(name="Billing agent")
refund_agent = Agent(name="Refund agent")

triage_agent = Agent(
    name="Triage agent",
    handoffs=[billing_agent, handoff(refund_agent)],
)
```


保持路由层级的清晰可读：

- 为每个智能体分配一个明确且范围有限的职责。
- 在 `handoffDescription` TypeScript 中或 `handoff_description` 中保持 Python 的指令简洁、具体。
- 仅在下一个分支确实需要不同的指令、工具或策略时才进行拆分。

在更高级的用法中，交接 也可以携带结构化元数据或经过筛选的历史记录。这些具体的 API 会在 SDK 文档中介绍，因为接线方式因语言而异。

## 将 智能体 用作管理者式工作流的工具

使用 `agent.asTool()` 在 TypeScript 中，或 `agent.as_tool()` 在 Python 中，当主智能体应继续负责最终答复并将这些专家作为辅助工具调用时。

将专家作为工具调用

```javascript
import { Agent } from "@openai/agents";

const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a concise summary of the supplied text.",
});

const mainAgent = new Agent({
  name: "Research assistant",
  tools: [
    summarizer.asTool({
      toolName: "summarize_text",
      toolDescription: "Generate a concise summary of the supplied text.",
    }),
  ],
});
```

```python
from agents import Agent

summarizer = Agent(
    name="Summarizer",
    instructions="Generate a concise summary of the supplied text.",
)

main_agent = Agent(
    name="Research assistant",
    tools=[
        summarizer.as_tool(
            tool_name="summarize_text",
            tool_description="Generate a concise summary of the supplied text.",
        )
    ],
)
```


在以下情况下，这通常是更合适的选择：

- 由管理器综合得出最终答案
- 专家正在执行有界任务，例如摘要或分类
- 你希望拥有一个稳定的外部工作流，并在其中嵌套专家调用，而不是进行所有权交接

## 仅在合约变更时添加专家

尽可能从一个智能体开始。只有在实质性改善能力隔离、策略隔离、提示清晰度或追踪可读性时，才添加专门的智能体。

过早拆分会产生更多的提示、更多的追踪和更多的审批界面，却未必让工作流变得更好。

## 下一步

一旦所有权模式清晰，就继续阅读涵盖相邻运行时或状态问题的指南。



  [智能体定义



        细化每个专家的指令、工具和输出契约。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [运行智能体



        了解交接和工具在运行中的行为方式。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [结果与状态



        See how 
      `lastAgent` in TypeScript or `last_agent` in Python 
      and resumable state affect the next turn.](https://developers.openai.com/api/docs/guides/agents/results)