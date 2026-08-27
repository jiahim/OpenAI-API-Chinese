# 快速入门

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

如果你想用最短的路径搭建一个可运行的基于 SDK 的 智能体，请使用本页。下面的示例在 JavaScript 和 Python 中使用相同的高层概念：定义一个 智能体，运行它，然后在你的 工作流 不断扩展时，添加工具和专门的 智能体。

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

从一个聚焦的智能体和单轮对话开始。SDK 会处理模型调用，并返回一个包含最终输出和运行历史的结果对象。

创建并运行一个智能体

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


你应该在终端中看到一个简洁的回答。一旦该循环跑通，就沿用同样的结构逐步添加能力，而不是一开始就设计一个大型多智能体架构。

## 将状态延续到下一轮

第一次运行的结果也决定了第二次回合应使用什么状态。

| 如果需要                                           | 起始方式                                                                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 在你的应用中保留完整历史             | `result.history` 使用 TypeScript 或 `result.to_input_list()` 使用 Python                         |
| 由 SDK 为你加载和保存历史             | 一次会话                                                                                                                                |
| 由 OpenAI 管理 延续 状态                  | 由服务端管理的 延续 ID                                                                                                         |
| 恢复因等待审批或中断而暂停的运行 | `result.state` 使用 TypeScript 或 `result.to_state()` 使用 Python，配合 `interruptions` |

交接之后，复用 `lastAgent` （TypeScript）或 `last_agent` （Python），以便在下一轮中保持该专家智能体的控制权。

## 为该智能体添加工具

你添加的第一个能力通常是函数工具或托管的 OpenAI 工具，例如网页搜索或文件搜索。

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


在需要托管工具、工具搜索或将 [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) 用作工具时，参考共享指南。智能体-as-tools。

## 添加专属 智能体

一个常见的下一步是将工作流拆分为多个专家智能体，并让路由器通过交接将任务委托给它们。

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

常规的 服务端 SDK 路径包含 追踪。首次运行成功后，打开 [追踪仪表板](https://platform.openai.com/traces) 以便在开始调优提示词之前检查模型调用、工具调用、交接和护栏。

## 下一步

首次运行成功后，继续阅读与下一个你想要添加的能力匹配的指南。



  [智能体定义



        在扩展工作流之前，先清晰地构建一个专家智能体。](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [使用工具



        添加工具、函数工具以及将智能体用作工具。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [运行智能体



        了解智能体循环、流式输出以及延续策略。](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [编排与交接



        决定何时应由专家智能体接管对话。](https://developers.openai.com/api/docs/guides/agents/orchestration)