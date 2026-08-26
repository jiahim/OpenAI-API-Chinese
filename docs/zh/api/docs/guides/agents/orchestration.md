# 编排与交接

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

当不同专业角色应各自负责任务的不同部分时，多智能体工作流非常有用。首要的设计决策是确定在工作流的每个分支中，由谁负责最终面向用户的回答。

## 选择编排模式

| 模式         | 使用场景                                                                   | 效果                             |
| --------------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| 交接        | 由专家接管该工作分支的对话    | 控制权移交给专家智能体    |
| 作为工具的智能体 | 由管理者保持控制，将专家作为有界能力调用 | 管理者保留回复的所有权 |

## 使用交接进行委托所有权管理

交接是最清晰的适用场景，即应由某个专家负责下一个响应，而不仅仅是在后台提供帮助。

使用交接进行委派

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


保持路由界面清晰易读：

- 给每个专家分配一个狭窄的职责。
- 保持 `handoffDescription` 用 TypeScript 或 `handoff_description` 用 Python 编写时简短具体。
- 仅当下一个分支确实需要不同的指令、工具或策略时才进行拆分。

在高级场景中，交接也可以携带结构化元数据或过滤后的历史记录。那些确切的 API 保留在 SDK 文档中，因为它们的配置方式因语言而异。

## 将智能体用作工具，实现管理器风格的工作流

使用 `agent.asTool()` 在 TypeScript 中或 `agent.as_tool()` 在 Python 中，当主智能体应负责最终答案并调用专家作为助手时。

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


在以下情况下，这通常是更好的选择：

- 经理应综合出最终答案
- 专家正在执行有界任务，如摘要或分类
- 你希望有一个稳定的外部工作流，嵌套专家调用，而不是交接所有权

## 仅当契约发生变化时才添加专家

只要可以，就从单个智能体开始。只有当专家能显著改善能力隔离、策略隔离、提示清晰度或追踪可读性时，才添加专家。

过早拆分会产生更多提示、更多追踪和更多审批面，却不一定会让工作流变得更好。

## 后续步骤

一旦所有权模式明确，继续阅读涵盖相邻运行时或状态问题的指南。



  [智能体定义



        细化每个专家的指令、工具和输出契约。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [运行智能体



        了解交接和工具在运行中的行为。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [结果与状态



        See how 
      `lastAgent` in TypeScript or `last_agent` in Python 
      and resumable state affect the next turn.](https://developers.openai.com/api/docs/guides/agents/results)