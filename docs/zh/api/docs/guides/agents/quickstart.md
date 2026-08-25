# 快速入门

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

如需以最短路径构建一个可运行的基于 SDK 的智能体，请阅读本页。以下 JavaScript 和 Python 示例采用相同的高级概念：定义智能体、运行智能体，然后随着工作流扩展添加工具和专家智能体。

## 安装 SDK

创建项目、安装 SDK 并设置你的 API 密钥。



创建 API 密钥






```bash
# JavaScript
npm install @openai/agents zod

# Python
pip install openai-agents

export OPENAI_API_KEY=sk-...
```

## 创建并运行你的第一个智能体

先从一个职责明确的智能体和一轮对话开始。SDK 会处理模型调用，并返回一个包含最终输出和运行历史的结果对象。

创建并运行智能体

```javascript
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "History tutor",
  instructions: "You answer history questions clearly and concisely.",
  model: "gpt-5.6",
});

const result = await run(agent, "When did the Roman Empire fall?");
console.log(result.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner

agent = Agent(
    name="History tutor",
    instructions="You answer history questions clearly and concisely.",
    model="gpt-5.6",
)


async def main() -> None:
    result = await Runner.run(agent, "When did the Roman Empire fall?")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


你应该会在终端中看到简洁的答案。一旦该循环正常工作，保持相同的结构，并逐步增加功能，而不是一开始就设计大型多智能体方案。

## 将状态延续到下一轮

第一次运行的结果也是你决定第二轮应使用什么状态的依据。

| 如果你想                                           | 从这里开始                                                                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 在应用中保留完整历史记录             | `result.history`（TypeScript）或 `result.to_input_list()`（Python）                         |
| 让 SDK 自动加载并保存历史记录             | 一个会话                                                                                                                                |
| 让 OpenAI 管理延续状态                  | 服务端管理的延续 ID                                                                                                         |
| 恢复因审批或中断而暂停的运行 | `result.state`（TypeScript）或 `result.to_state()`（Python），并配合 `interruptions` |

完成交接后，如果该专家智能体应继续掌控流程，请在下一轮复用 TypeScript 中的 `lastAgent` 或 Python 中的 `last_agent`。

## 为智能体添加工具

你添加的第一个功能通常是函数工具或 OpenAI 托管工具，例如网页搜索或文件搜索。

添加函数工具

```javascript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const historyFunFact = tool({
  name: "history_fun_fact",
  description: "Return a short history fact.",
  parameters: z.object({}),
  async execute() {
    return "Sharks are older than trees.";
  },
});

const agent = new Agent({
  name: "History tutor",
  instructions:
    "Answer history questions clearly. Use history_fun_fact when it helps.",
  tools: [historyFunFact],
});

const result = await run(
  agent,
  "Tell me something surprising about ancient life on Earth."
);

console.log(result.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner, function_tool


@function_tool
def history_fun_fact() -> str:
    """Return a short history fact."""
    return "Sharks are older than trees."


agent = Agent(
    name="History tutor",
    instructions="Answer history questions clearly. Use history_fun_fact when it helps.",
    tools=[history_fun_fact],
)


async def main() -> None:
    result = await Runner.run(
        agent,
        "Tell me something surprising about ancient life on Earth.",
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


如果需要使用托管工具、工具搜索或将智能体作为工具，请参阅通用的 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 指南。

## 添加专家智能体

一个常见的后续步骤是将工作流拆分为多个专家，并让路由器通过交接将任务委托给它们。

路由到专家智能体

```javascript
import { Agent, run } from "@openai/agents";

const historyTutor = new Agent({
  name: "History tutor",
  instructions: "Answer history questions clearly and concisely.",
});

const mathTutor = new Agent({
  name: "Math tutor",
  instructions: "Explain math step by step and include worked examples.",
});

const triageAgent = Agent.create({
  name: "Homework triage",
  instructions: "Route each homework question to the right specialist.",
  handoffs: [historyTutor, mathTutor],
});

const result = await run(
  triageAgent,
  "Who was the first president of the United States?"
);

console.log(result.finalOutput);
console.log(result.lastAgent?.name);
```

```python
import asyncio

from agents import Agent, Runner

history_tutor = Agent(
    name="History tutor",
    handoff_description="Specialist for history questions.",
    instructions="Answer history questions clearly and concisely.",
)

math_tutor = Agent(
    name="Math tutor",
    handoff_description="Specialist for math questions.",
    instructions="Explain math step by step and include worked examples.",
)

triage_agent = Agent(
    name="Homework triage",
    instructions="Route each homework question to the right specialist.",
    handoffs=[history_tutor, math_tutor],
)


async def main() -> None:
    result = await Runner.run(
        triage_agent,
        "Who was the first president of the United States?",
    )
    print(result.final_output)
    print(result.last_agent.name)


if __name__ == "__main__":
    asyncio.run(main())
```


## 尽早检查追踪

常规的服务端 SDK 流程包含追踪功能。首次运行成功后，请先打开 [追踪仪表盘](https://platform.openai.com/traces)，检查模型调用、工具调用、交接和护栏，再开始调整提示词。

## 后续步骤

首次运行成功后，继续阅读与你接下来要添加的功能相匹配的指南。



  [智能体定义



        先清晰定义一个专家智能体，再扩展工作流。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [使用工具



        添加托管工具、函数工具和作为工具的智能体。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [运行智能体



        了解智能体循环、流式处理和延续策略。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [编排与交接



        决定专家智能体何时接管对话。](https://developers.openai.com/api/docs/guides/agents/orchestration)
