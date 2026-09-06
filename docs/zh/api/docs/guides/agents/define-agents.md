# 智能体 定义

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

智能体是基于 SDK 的 工作流的核心单元。它将模型、指令以及可选的运行时行为（如工具、护栏、MCP 服务器、交接和结构化输出）打包在一起。

## 智能体上应当包含哪些内容

将仅与该专家本身相关的决策交由智能体配置处理：

| 属性                                                                                                          | 用途                                                  | 下一步阅读                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `name`                                                                                                            | 在追踪和工具/交接界面中的人类可读标识 | 本页                                                                                |
| `instructions`                                                                                                    | 该智能体的任务、约束与风格              | 本页                                                                                |
| `prompt`                                                                                                          | 基于 Responses 的运行所使用的存储提示配置        | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `model` 以及模型设置                                                                                        | 选择模型并调优行为                      | [模型与提供商](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `tools`                                                                                                           | 智能体可直接调用的能力                    | [使用工具](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)                            |
| `handoffDescription` （在 TypeScript 中）或 `handoff_description` （在 Python 中） | 提示何时应由其他智能体委派到此处             | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `handoffs`                                                                                                        | 委派给另一个智能体                                 | [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `outputType` （在 TypeScript 中）或 `output_type` （在 Python 中）                 | 返回结构化输出而非纯文本           | 本页                                                                                |
| 护栏与审批                                                                                          | 验证、拦截与审核流程                      | [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)              |
| MCP 服务器与托管 MCP 工具                                                                                  | 附加由 MCP 支持的能力                           | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) |

## 从一个专注的智能体开始

定义可以拥有明确任务的最小智能体。只有在需要独立所有权、不同的指令、不同的工具集合或不同的审批策略时，才添加更多智能体。

定义一个智能体

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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
    tools=[get_weather],
)
```


## 塑造指令、交接与输出

有三个配置选项需要格外注意：

- 从静态 `instructions`。入手。当指导内容依赖于当前用户、租户或运行时上下文时，改用动态 instructions 回调，而不是在调用处拼接字符串。
- 保持 `handoffDescription` 在 TypeScript 中 `handoff_description` 或 Python 中简短具体，让负责路由的智能体知道何时应选择该专家。
- 使用 `outputType` 在 TypeScript 中 `output_type` （在 Python 中）当下游代码需要强类型数据而非自由形式的文本时使用。

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


使用 `prompt` 当你想要从 Responses API 中引用已存储的提示配置，而不是在代码中嵌入完整的系统提示时。

## 将本地上下文与模型上下文分开

SDK 允许你在不将应用状态和依赖发送给模型的情况下将其传入运行中。可用于传入经过身份验证的用户信息、数据库客户端、日志记录器以及辅助函数等数据。

向工具传递本地上下文

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

- 对话历史是模型看到的内容。
- 运行上下文是你的代码看到的内容。

如果模型需要某个事实，请将其放入 instructions、input、检索结果或工具中。如果只有你的运行时需要它，则将其保留在本地上下文中。

## 何时将一个智能体拆分为多个

当单个专家不应负责完整回复，或当各个能力存在实质性差异时，拆分一个智能体。常见原因包括：

- 专业智能体需要不同的工具或 MCP 界面。
- 专业智能体需要不同的审批策略或 护栏。
- 工作流的一个分支需要使用不同的模型或输出风格。
- 你希望在追踪中进行显式路由，而不是使用单个大型提示。

## 后续步骤

清晰定义好一个智能体后，参考与下一个设计问题匹配的指南。



  [模型与提供商



        为该 智能体 选择模型、默认值以及传输策略。](https://developers.openai.com/api/docs/guides/agents/models)
  [使用工具



        添加该 智能体 可以直接调用的能力。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [编排与交接



        当单个 智能体 已无法满足需求时，选择智能体之间的协作方式。](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [运行 智能体



        了解运行时循环、状态以及流式行为。](https://developers.openai.com/api/docs/guides/agents/running-agents)