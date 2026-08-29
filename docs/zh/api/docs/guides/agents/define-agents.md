# 智能体定义

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

智能体 是基于 SDK 的 工作流 的核心单元。它封装了模型、指令，以及可选的运行时行为，例如工具、护栏、MCP 服务器、交接和结构化输出。

## 智能体应包含什么

使用 智能体 配置来做出该专家特有的决策：

| Property                                                                                                          | Use it for                                                  | Read next                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `name`                                                                                                            | 在追踪和工具/交接界面中可读的标识 | This page                                                                                |
| `instructions`                                                                                                    | 该 智能体 的任务、约束和风格              | This page                                                                                |
| `prompt`                                                                                                          | 基于 Responses 的运行的已存储提示配置        | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `model` 以及模型设置                                                                                        | 选择模型并调整行为                      | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `tools`                                                                                                           | 智能体 可直接调用的能力                    | [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)                            |
| `handoffDescription` 在 TypeScript 中，或 `handoff_description` 在 Python 中 | 提示何时应由另一个 智能体 委派到此处             | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `handoffs`                                                                                                        | 委派给另一个 智能体                                 | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `outputType` 在 TypeScript 中，或 `output_type` 在 Python 中                 | 返回结构化输出而非纯文本           | This page                                                                                |
| Guardrails and approvals                                                                                          | 校验、拦截与审批流程                      | [护栏与人工审核](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)              |
| MCP 服务器与托管 MCP 工具                                                                                  | 附加 MCP 支持的能力                           | [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) |

## 从一个聚焦的智能体开始

定义能够承担明确任务的最小智能体。仅在需要独立所有权、不同指令、不同工具范围或不同审批策略时，才添加更多智能体。

定义单个智能体

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


## 调整指令、交接和输出

三个配置选项需要格外注意：

- 从静态提示开始 `instructions`。当提示内容依赖当前用户、租户或运行时上下文时，应改用动态提示回调，而不是在调用处拼接字符串。
- 保持 `handoffDescription` 在 TypeScript 或 `handoff_description` 中的内容简短具体，让路由智能体知道何时选用该专家。
- 使用 `outputType` 在 TypeScript 或 `output_type` （Python）当下游代码需要类型化数据而非自由文本时。

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


使用 `prompt` 当你希望从 Responses API 中引用已存储的提示配置，而不是将完整的系统提示嵌入代码时，可以使用它。

## 将本地上下文与模型上下文分开

SDK 允许你在不将其发送给模型的情况下，将应用状态和依赖项传入运行。可用于经过身份验证的用户信息、数据库客户端、日志记录器和辅助函数等数据。

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

- 会话历史是模型看到的内容。
- 运行上下文是你的代码看到的内容。

如果模型需要某个事实，请将其放入 instructions、input、检索内容或工具中。如果仅你的运行时需要它，请保留在本地上下文中。

## 何时将一个智能体拆分为多个

当某个智能体不应独自负责完整回复，或各项能力存在明显差异时，可以拆分智能体。常见的拆分原因包括：

- 某个智能体需要不同的工具或 MCP 接口。
- 某个智能体需要不同的审批策略或护栏。
- 工作流的某个分支需要不同的模型或输出风格。
- 你希望在追踪中显式路由，而不是使用单个大型提示。

## 后续步骤

一旦清晰地定义了一个专家，就继续查看与下一个设计问题匹配的指南。



  [模型与提供商



        为此智能体选择模型、默认值和传输策略。](https://developers.openai.com/api/docs/guides/agents/models)
  [使用工具



        添加智能体可以直接调用的能力。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [编排与交接



        当单个智能体不再够用时，选择专家之间的协作方式。](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [运行智能体



        了解运行时循环、状态和流式传输行为。](https://developers.openai.com/api/docs/guides/agents/running-agents)