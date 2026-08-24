# Agent definitions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An agent is the core unit of an SDK-based workflow. It packages a model, instructions, and optional runtime behavior such as tools, guardrails, MCP servers, handoffs, and structured outputs.

## What belongs on an agent

Use agent configuration for decisions that are intrinsic to that specialist:

| Property                                                                                                          | Use it for                                                  | Read next                                                                                |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `name`                                                                                                            | Human-readable identity in traces and tool/handoff surfaces | This page                                                                                |
| `instructions`                                                                                                    | The job, constraints, and style for that agent              | This page                                                                                |
| `prompt`                                                                                                          | Stored prompt configuration for Responses-based runs        | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `model` and model settings                                                                                        | Choosing the model and tuning behavior                      | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                   |
| `tools`                                                                                                           | Capabilities the agent can call directly                    | [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)                            |
| `handoffDescription` in TypeScript or `handoff_description` in Python | Hinting when another agent should delegate here             | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `handoffs`                                                                                                        | Delegating to another agent                                 | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                      |
| `outputType` in TypeScript or `output_type` in Python                 | Returning structured output instead of plain text           | This page                                                                                |
| Guardrails and approvals                                                                                          | Validation, blocking, and review flows                      | [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)              |
| MCP servers and hosted MCP tools                                                                                  | Attaching MCP-backed capabilities                           | [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) |

## Start with one focused agent

Define the smallest agent that can own a clear task. Add more agents only when you need separate ownership, different instructions, different tool surfaces, or different approval policies.

Define a single agent

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


## Shape instructions, handoffs, and outputs

Three configuration choices deserve extra care:

- Start with static `instructions`. When the guidance depends on the current user, tenant, or runtime context, switch to a dynamic instructions callback instead of stitching strings together at the call site.
- Keep `handoffDescription` in TypeScript or `handoff_description` in Python short and concrete so routing agents know when to pick this specialist.
- Use `outputType` in TypeScript or `output_type` in Python when downstream code needs typed data rather than free-form prose.

Return structured output

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


Use `prompt` when you want to reference a stored prompt configuration from the Responses API instead of embedding the entire system prompt in code.

## Keep local context separate from model context

The SDK lets you pass application state and dependencies into a run without sending them to the model. Use this for data like authenticated user info, database clients, loggers, and helper functions.

Pass local context to tools

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


The important boundary is:

- Conversation history is what the model sees.
- Run context is what your code sees.

If the model needs a fact, put it in instructions, input, retrieval, or a tool. If only your runtime needs it, keep it in local context.

## When to split one agent into several

Split an agent when one specialist shouldn't own the full reply or when separate capabilities are materially different. Common reasons are:

- A specialist needs a different tool or MCP surface.
- A specialist needs a different approval policy or guardrail.
- One branch of the workflow needs a different model or output style.
- You want explicit routing in traces rather than a single large prompt.

## Next steps

Once one specialist is defined cleanly, move to the guide that matches the next design question.



  [Models and providers



        Choose models, defaults, and transport strategy for this agent.](https://developers.openai.com/api/docs/guides/agents/models)
  [Using tools



        Add capabilities the agent can call directly.](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [Orchestration and handoffs



        Choose how specialists collaborate once one agent is no longer enough.](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [Running agents



        Understand the runtime loop, state, and streaming behavior.](https://developers.openai.com/api/docs/guides/agents/running-agents)