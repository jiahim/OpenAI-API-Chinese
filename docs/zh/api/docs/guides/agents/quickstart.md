# 快速开始

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

当你想要找到一条构建可运行的 SDK 智能体的最短路径时，请使用此页面。以下示例在 JavaScript 和 Python 中使用了相同的高级概念：定义一个智能体，运行它，然后随着工作流的增长添加工具和专家智能体。

## 安装 SDK

创建一个项目，安装 SDK，并设置你的 API 密钥。



创建 API 密钥






```bash
# JavaScript
npm install @openai/agents zod

# Python
pip install openai-agents

export OPENAI_API_KEY=sk-...
```

## 创建并运行你的第一个智能体

从一个聚焦的智能体和一轮对话开始。SDK 处理模型调用，并返回一个包含最终输出及运行历史的结果对象。

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


你应在终端中看到简洁的回答。一旦该循环运行正常，保持相同的结构，逐步增加功能，而不是一开始就设计复杂的多智能体架构。

## 将状态带入下一轮

第一次运行的结果也是你决定第二轮应使用什么作为状态的依据。

| 如果你想要                                           | 从以下开始                                                                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 在应用程序中保留完整历史记录             | `result.history` 使用 TypeScript 或 `result.to_input_list()` 使用 Python                         |
| 让 SDK 为你加载并保存历史记录             | 一个会话                                                                                                                                |
| 让 OpenAI 管理延续状态                  | 服务端管理的延续 ID                                                                                                         |
| 恢复因审批或中断而暂停的运行 | `result.state` 使用 TypeScript 或 `result.to_state()` 使用 Python，连同 `interruptions` |

在交接之后，复用 `lastAgent` 在 TypeScript 中，或 `last_agent` 在 Python 中用于下一轮，当该专家应保持控制时。

## 为智能体提供工具

你添加的第一个能力通常是函数工具或托管OpenAI工具，如网页搜索或文件搜索。

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


当你需要托管工具、工具搜索或智能体作为工具时，请使用共享的 [工具使用](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 指南。

## 添加专家智能体

常见的下一步是将工作流拆分为多个专家，并让路由器通过交接将任务委派给它们。

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

正常的服务端 SDK 路径包含追踪。一旦首次运行成功，打开 [追踪仪表盘](https://platform.openai.com/traces) 以在开始调整提示词之前检查模型调用、工具调用、交接和护栏。

## 后续步骤

首个运行成功后，继续阅读与你想要添加的下一项能力相匹配的指南。



  [智能体定义



        在扩展工作流之前，先将一个专家智能体清晰地塑造好。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [使用工具



        添加托管工具、函数工具以及将智能体用作工具。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [运行智能体



        了解智能体循环、流式传输和延续策略。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [编排与交接



        决定专家智能体应何时接管对话。](https://developers.openai.com/api/docs/guides/agents/orchestration)