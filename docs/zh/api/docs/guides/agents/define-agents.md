# 智能体定义

> 查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

智能体是基于 SDK 的工作流的核心单元。它封装了模型、指令以及可选运行时行为，例如工具、护栏、MCP 服务器、交接和结构化输出。

## 智能体中应包含什么

使用智能体配置来做出该专家固有的决策：

| 属性                                                                                                          | 用于                                                  | 阅读下一步                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `name`                                                                                                            | 在追踪和工具/交接界面中的人类可读身份标识 | 本页                                                                                |
| `instructions`                                                                                                    | 该智能体的任务、约束和风格              | 本页                                                                                |
| `prompt`                                                                                                          | 基于 Responses API 运行的存储提示配置        | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `model` 以及模型设置                                                                                        | 选择模型并调整行为                      | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `tools`                                                                                                           | 智能体可直接调用的能力                    | [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)                            |
| `handoffDescription` 在 TypeScript 或 `handoff_description` 在 Python 中 | 提示何时应由另一个智能体在此委托             | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `handoffs`                                                                                                        | 委托给另一个智能体                                 | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `outputType` 使用 TypeScript 或 `output_type` 使用 Python                 | 返回结构化输出而非纯文本           | 此页面                                                                                |
| 护栏与审批                                                                                          | 验证、阻塞和审查流程                      | [护栏与人工审查](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)              |
| MCP 服务器与托管 MCP 工具                                                                                  | 附加由 MCP 支持的能力                           | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) |

## 从一个专注的智能体开始

定义最精简的智能体，使其能明确拥有一个任务。仅当你需要独立的职责、不同的指令、不同的工具面或不同的审批策略时，才添加更多智能体。

定义单一智能体

```javascript
import { Agent, tool } from "@openai/agents";
import { z } from "zod";

const getWeather = tool({
  name: "get_weather",
  description: "Return the weather for a given city.",
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
    return `The weather in ${city} is sunny.`;
  },
});

const agent = new Agent({
  name: "Weather bot",
  instructions: "You are a helpful weather bot.",
  model: "gpt-5.6",
  tools: [getWeather],
});
```

```python
from agents import Agent, function_tool


@function_tool
def get_weather(city: str) -> str:
    """Return the weather for a given city."""
    return f"The weather in {city} is sunny."


agent = Agent(
    name="Weather bot",
    instructions="You are a helpful weather bot.",
    model="gpt-5.6",
    tools=[get_weather],
)
```


## 塑造指令、交接和输出

三个配置选项需要格外注意：

- 从静态 `instructions`。开始。当指导依赖于当前用户、租户或运行时上下文时，切换到动态指令回调，而不是在调用点拼接字符串。
- 保持 `handoffDescription` 中的 TypeScript 或 `handoff_description` 中的 Python 简短具体，以便路由智能体知道何时选择这个专家。
- 使用 `outputType` 中的 TypeScript 或 `output_type` 中的 Python，当下游代码需要类型化数据而非自由形式的散文时。

返回结构化输出

```javascript
import { Agent, run } from "@openai/agents";
import { z } from "zod";

const calendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const agent = new Agent({
  name: "Calendar extractor",
  instructions: "Extract calendar events from text.",
  outputType: calendarEvent,
});

const result = await run(agent, "Dinner with Priya and Sam on Friday.");

console.log(result.finalOutput);
```

```python
import asyncio

from pydantic import BaseModel

from agents import Agent, Runner


class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]


agent = Agent(
    name="Calendar extractor",
    instructions="Extract calendar events from text.",
    output_type=CalendarEvent,
)


async def main() -> None:
    result = await Runner.run(
        agent,
        "Dinner with Priya and Sam on Friday.",
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


当你想 `prompt` 从 Responses API 引用已存储的提示词配置，而不是在代码中嵌入整个系统提示词时使用。

## 保持本地上下文与模型上下文分离

SDK允许你将应用状态和依赖项传入运行，而无需将它们发送给模型。请将此用于已验证的用户信息、数据库客户端、记录器和辅助函数等数据。

将本地上下文传递给工具

```javascript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const fetchUserAge = tool({
  name: "fetch_user_age",
  description: "Return the age of the current user.",
  parameters: z.object({}),
  // TypeScript users can type this as RunContext<{ name: string; uid: number }>.
  async execute(_args, runContext) {
    return `User ${runContext?.context.name} is 47 years old`;
  },
});

const agent = new Agent({
  name: "Assistant",
  tools: [fetchUserAge],
});

const result = await run(agent, "What is the age of the user?", {
  context: { name: "John", uid: 123 },
});

console.log(result.finalOutput);
```

```python
import asyncio
from dataclasses import dataclass

from agents import Agent, RunContextWrapper, Runner, function_tool


@dataclass
class UserInfo:
    name: str
    uid: int


@function_tool
async def fetch_user_age(wrapper: RunContextWrapper[UserInfo]) -> str:
    """Fetch the age of the current user."""
    return f"The user {wrapper.context.name} is 47 years old."


agent = Agent[UserInfo](
    name="Assistant",
    tools=[fetch_user_age],
)


async def main() -> None:
    result = await Runner.run(
        agent,
        "What is the age of the user?",
        context=UserInfo(name="John", uid=123),
    )
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


重要的边界是：

- 对话历史是模型所看到的内容。
- 运行上下文是你的代码所看到的内容。

如果模型需要某个事实，将其放入指令、输入、检索或工具中。如果只有你的运行时需要它，则将其保存在本地上下文中。

## 何时将一个智能体拆分为多个

当某个专家不应负责完整回复，或不同能力存在实质性差异时，可将智能体拆分。常见原因包括：

- 专家需要不同的工具或 MCP 表面。
- 专家需要不同的审批策略或护栏。
- 工作流的一个分支需要不同的模型或输出风格。
- 你希望在追踪中显式路由，而不是使用单个大提示。

## 后续步骤

一旦清晰定义了一个专家智能体，就继续阅读与下一个设计问题匹配的指南。



  [模型与提供商



        为此智能体选择模型、默认设置和传输策略。](https://developers.openai.com/api/docs/guides/agents/models)
  [使用工具



        添加智能体可直接调用的能力。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [编排与交接



        当单个智能体不再够用时，选择专家智能体之间的协作方式。](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [运行智能体



        了解运行时循环、状态和流式行为。](https://developers.openai.com/api/docs/guides/agents/running-agents)