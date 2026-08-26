# 多智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 概述

多智能体让模型能够并行启动并协调子智能体，综合它们的工作以提供最终响应。这对于包含复杂任务、受益于并行工作委派的应用尤为有效，例如代码库探索、文档编写和实现。

多智能体作为一项测试版功能，适用于所有 GPT-5.6 模型。在应用中启用多智能体之前，请查看模型页面。

## 何时使用多智能体

任务通常可以划分为多个独立的工作部分，单个智能体会按顺序完成这些部分，但多个智能体能够并行处理这些部分。多智能体使根智能体能够将任务委托给多个并发完成工作的子智能体。这可以带来多种好处：

- **并行执行。** 独立的研究、分析或实现任务可以同时进行，从而加快执行速度。
- **聚焦的上下文。** 每个子智能体接收一个有界的任务并维护其自身的上下文，这减少了无关工作线之间上下文的干扰，并提高了性能。
- **模型导向的协调。** 根智能体可以创建子智能体，向它们发送附加信息，等待结果，并综合出最终答案，而无需你的应用实现编排。

多智能体编排在任务可以划分为具体且独立的工作流时最为有用，例如：

- 探索大型代码库的独立部分
- 比较多个提案、文档或假设
- 并行研究多个来源
- 实现独立组件或编写独立测试套件
- 并行调查失败的不同可能原因
- 同时探索问题的不同解决方案

请注意，添加子智能体可能会增加 token 使用量，并且对于依赖单一有序推理链、需要频繁写入共享可变状态或已被一个缓慢的外部操作主导的任务，可能不会有太大帮助。

| 当以下情况时使用多智能体                              | 当以下情况时优先使用单智能体                                 |
| ------------------------------------------------- | ----------------------------------------------------- |
| 工作可以拆分为独立、有界任务 | 每一步直接依赖上一步       |
| 独立的上下文有助于提升专注度                   | 任务足够小，可在一次简短运行中完成 |
| 并行探索可减少实际耗时   | 智能体会对同一可变资源产生竞争   |
| 比较独立发现可提高覆盖率  | 你需要固定的、确定性的执行图    |

## 快速开始

Python 和 JavaScript 示例使用 beta Responses SDK。对于 HTTP
  请求，请使用 `client.beta.responses` 并传递 `responses_multi_agent=v1` 作为
  该 `betas` 参数。对于原始 HTTP 请求和 WebSocket 连接，请传递
  `OpenAI-Beta: responses_multi_agent=v1` 在请求或连接标头中。
  项目模式可能在 Multi-智能体 处于测试阶段时发生变化。

在 Responses API 请求中启用 Multi-智能体，通过 `multi_agent.enabled`。当 `multi_agent.enabled` 为 `true`，时，根 智能体 可以生成子智能体树。子智能体共享请求的模型和可用工具，而 智能体 通过协作原语（如生成、消息传递和等待）进行协调（参见 [Multi-智能体 的工作原理](#how-multi-agent-works)）。根 智能体 负责综合子智能体的响应并提供最终响应。

使用子智能体审查拉取请求

```javascript
import OpenAI from "openai";

const client = new OpenAI();

async function reviewPullRequest(diff) {
  const response = await client.beta.responses.create({
    model: "gpt-5.6-sol",
    input:
      "Review the pull-request diff below with three agents: one for " +
      "correctness, one for security, and one for missing tests. " +
      "Reconcile duplicate or conflicting findings, then return a " +
      "prioritized review with file and line references.\n\n" +
      `<diff>\n${diff}\n</diff>`,
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3,
    },
    betas: ["responses_multi_agent=v1"],
  });

  return response.output
    .flatMap((item) =>
      item.type === "message" &&
      item.agent?.agent_name === "/root" &&
      item.phase === "final_answer"
        ? item.content
        : []
    )
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("");
}
```

```python
from openai import OpenAI

client = OpenAI()


def review_pull_request(diff: str) -> str:
    response = client.beta.responses.create(
        model="gpt-5.6-sol",
        input=(
            "Review the pull-request diff below with three agents: one for "
            "correctness, one for security, and one for missing tests. "
            "Reconcile duplicate or conflicting findings, then return a "
            "prioritized review with file and line references.\n\n"
            f"<diff>\n{diff}\n</diff>"
        ),
        multi_agent={
            "enabled": True,
            "max_concurrent_subagents": 3,
        },
        betas=["responses_multi_agent=v1"],
    )

    return "".join(
        part.text
        for item in response.output
        if (
            item.type == "message"
            and item.agent is not None
            and item.agent.agent_name == "/root"
            and item.phase == "final_answer"
        )
        for part in item.content
        if part.type == "output_text"
    )
```


`max_concurrent_subagents` 设置在整个 智能体 树中可以同时活跃的子智能体最大数量。它包含所有后代——子级、孙级和更深的子智能体——但不包括根 智能体。

API 对此设置没有固定上限。默认值为 `3`，这对大多数工作负载来说是推荐的。Multi-智能体 运行对树深度或一次运行中创建的子智能体总数也没有固定限制。

添加开发者消息以调整根模型何时应生成子智能体。此开发者消息是对根 智能体 和子智能体注入的说明的补充。

开发者消息的示例包括：

- “除非用户明确要求子智能体、委派或并行智能体工作，否则不要生成子智能体。”
- “主动多智能体委派已启用。当并行工作能显著提升速度或质量时，使用子智能体。”

## 多智能体如何运作

Responses API 为根智能体和子智能体提供托管编排操作及使用说明。根智能体被命名为 `/root`。生成的子智能体使用层级路径，例如：

```text
/root
├── /root/researcher
├── /root/reviewer
└── /root/reviewer/tester
```

多智能体模式对子智能体的总数或树深度没有固定限制。对于大多数任务，使用默认的 `max_concurrent_subagents` 值 `3`。此设置限制整个树中活跃子智能体轮次的数量，包括子节点和更深层的后代。

启用多智能体模式时，Responses API提供六个托管协作操作。你可能会在 `multi_agent_call` 条目中看到这些操作。你的应用程序不应执行这些操作或为其提交输出结果。

| 操作            | 用途                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `spawn_agent`     | 创建子智能体并分配其初始任务。                                 |
| `send_message`    | 为现有智能体排队消息，且不启动新的回合。             |
| `followup_task`   | 为现有非根智能体分配更多工作，并启动或恢复其回合。   |
| `wait_agent`      | 等待调用智能体邮箱中的更新。                             |
| `interrupt_agent` | 中断另一个智能体的活动回合而不删除其上下文。            |
| `list_agents`     | 返回当前智能体树、状态以及每个智能体的 `last_task_message`. |

处理开发者定义的工具调用的方式与未启用 Multi-智能体 时相同。树中的任何 智能体 都可能发出 `function_call`。你的应用必须执行该调用并提交匹配的 `function_call_output`.

请注意，树中的所有 智能体 都可以访问 API 请求的模型调用中配置的工具。

## 在 Responses API 中使用多智能体

### HTTP 与 WebSocket 性能

HTTP 和 WebSocket 支持相同的多智能体能力，但对于工具密集型或长时间运行的工作流，推荐使用 WebSocket。其持久连接使你的应用程序能够及时返回函数输出，从而减少延续开销，并让智能体减少等待时间。

使用 HTTP 时，当每个活动的智能体要么完成，要么暂停以等待客户端执行的函数调用时，响应即完成。然后，你的应用程序执行所有未完成的函数调用，并在新的Responses API请求中提交其输出，从而允许暂停的智能体继续执行。

使用 WebSocket 时，你的应用程序可以在每个函数输出可用时立即将其注入响应中，而无需等待当前响应完成。等待中的智能体可以立即恢复，同时其他智能体继续工作。这减少了协调延迟，并在智能体完成或请求工具的时间不同步时避免了额外的请求往返。

对于需要调用多个托管工具（如并行网页搜索）或函数调用较少的单请求工作流，HTTP 可能就足够了。对于大多数多智能体工作流，WebSocket 可能提供更低的延迟和更好的端到端性能。

#### HTTP 函数调用执行

![跨应用、Responses API 根节点以及三个子智能体的 HTTP 函数调用执行。](https://developers.openai.com/images/api/multi-agent/multi-agent-1.png)

#### WebSocket 函数调用执行

![WebSocket 函数调用在应用程序、Responses API 根节点以及三个子智能体中的执行。](https://developers.openai.com/images/api/multi-agent/multi-agent-2.png)

### HTTP

这些示例需要公开测试版 SDK 构建，这些构建暴露了测试版 Responses API。对于 HTTP 流式传输，调用 `client.beta.responses.create` 并传递 `responses_multi_agent=v1` 以及 `betas` 参数；这将启用测试版类型和自动补全。在 Python 中，从 `openai.types.beta` 导入测试版响应条目类型，以添加类型注解。

客户端代码示例：

处理 HTTP 流式工具调用

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const ROOT = "/root";
const proposals = {
  alpha: { estimated_weeks: 6, risk: "medium" },
  beta: { estimated_weeks: 8, risk: "low" },
};
/** @type {import("openai/resources/beta/responses").BetaTool[]} */
const tools = [
  {
    type: "function",
    name: "get_proposal",
    description:
      "Return details for a proposal that the agents should compare.",
    parameters: {
      type: "object",
      properties: {
        proposal: {
          type: "string",
          enum: ["alpha", "beta"],
        },
      },
      required: ["proposal"],
      additionalProperties: false,
    },
    strict: true,
  },
];
/**
 * @type {Array<
 *   import("openai/resources/beta/responses").BetaResponseInputItem |
 *   import("openai/resources/beta/responses").BetaResponseOutputItem
 * >}
 */
const history = [
  {
    role: "user",
    content: "Compare proposal alpha and proposal beta.",
  },
];

function agentName(item) {
  return item.agent?.agent_name ?? ROOT;
}

function processToolCall(name, argumentsJson) {
  if (name !== "get_proposal") {
    throw new Error(`Unknown tool: ${name}`);
  }
  const { proposal } = JSON.parse(argumentsJson);

  return JSON.stringify(proposals[proposal]);
}

while (true) {
  const outputItems = [];
  const pendingCalls = [];
  const itemAgents = new Map();

  const stream = await client.beta.responses.create({
    model: "gpt-5.6-sol",
    // Beta output items can be replayed as input on the next request.
    input:
      /** @type {import("openai/resources/beta/responses").BetaResponseInput} */ (
        history
      ),
    tools,
    store: false,
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3,
    },
    stream: true,
    betas: ["responses_multi_agent=v1"],
  });

  for await (const event of stream) {
    if (event.type === "response.output_item.added") {
      itemAgents.set(event.output_index, agentName(event.item));
    } else if (event.type === "response.output_text.delta") {
      const agent = itemAgents.get(event.output_index) ?? ROOT;
      const destination = agent === ROOT ? process.stdout : process.stderr;
      destination.write(
        agent === ROOT ? event.delta : `[${agent}] ${event.delta}`
      );
    } else if (event.type === "response.output_item.done") {
      outputItems.push(event.item);
      if (event.item.type === "function_call") {
        pendingCalls.push(event.item);
      }
    } else if (event.type === "response.completed") {
      console.error("\nUsage:", event.response.usage);
      break;
    } else if (
      event.type === "error" ||
      event.type === "response.failed" ||
      event.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(event));
    }
  }

  history.push(...outputItems);
  for (const call of pendingCalls) {
    history.push({
      type: "function_call_output",
      call_id: call.call_id,
      output: processToolCall(call.name, call.arguments),
    });
  }

  if (pendingCalls.length === 0) break;
}
```

```python
from __future__ import annotations

import json
import sys

from openai import OpenAI
from openai.types.beta import BetaResponseOutputItem

client = OpenAI()
ROOT = "/root"
PROPOSALS = {
    "alpha": {"estimated_weeks": 6, "risk": "medium"},
    "beta": {"estimated_weeks": 8, "risk": "low"},
}
tools = [
    {
        "type": "function",
        "name": "get_proposal",
        "description": "Return details for a proposal that the agents should compare.",
        "parameters": {
            "type": "object",
            "properties": {
                "proposal": {
                    "type": "string",
                    "enum": ["alpha", "beta"],
                }
            },
            "required": ["proposal"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]
history = [
    {
        "role": "user",
        "content": "Compare proposal alpha and proposal beta.",
    }
]


def agent_name(item: BetaResponseOutputItem) -> str:
    return item.agent.agent_name if item.agent else ROOT


def render_to_user(delta: str) -> None:
    print(delta, end="", flush=True)


def log_subagent_text(agent: str, delta: str) -> None:
    print(f"[{agent}] {delta}", end="", file=sys.stderr, flush=True)


def process_tool_call(name: str, arguments: str) -> str:
    if name != "get_proposal":
        raise ValueError(f"Unknown tool: {name}")
    parsed_arguments = json.loads(arguments)
    return json.dumps(PROPOSALS[parsed_arguments["proposal"]])


while True:
    output_items = []
    pending_calls = []
    item_agents: dict[int, str] = {}

    stream = client.beta.responses.create(
        model="gpt-5.6-sol",
        input=history,
        tools=tools,
        store=False,
        multi_agent={
            "enabled": True,
            "max_concurrent_subagents": 3,
        },
        stream=True,
        betas=["responses_multi_agent=v1"],
    )
    for event in stream:
        if event.type == "response.output_item.added":
            item_agents[event.output_index] = agent_name(event.item)
        elif event.type == "response.output_text.delta":
            agent = item_agents.get(event.output_index, ROOT)
            if agent == ROOT:
                render_to_user(event.delta)
            else:
                log_subagent_text(agent, event.delta)
        elif event.type == "response.output_item.done":
            output_items.append(event.item)
            if event.item.type == "function_call":
                # Handle function calls from both the root agent and subagents.
                pending_calls.append(event.item)
        elif event.type == "response.completed":
            print(f"\nUsage: {event.response.usage}", file=sys.stderr)
            break
        elif event.type in {
            "error",
            "response.failed",
            "response.incomplete",
        }:
            raise RuntimeError(event)

    history.extend(output_items)

    for call in pending_calls:
        history.append(
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": process_tool_call(call.name, call.arguments),
            }
        )

    if not pending_calls:
        break
```


如果一个或多个智能体调用开发者定义的函数，执行每个挂起的调用，并创建一个包含其输出的延续请求。

### WebSocket

在 WebSocket 模式下，当 智能体 调用开发者定义的函数时，在你的应用中执行该函数，并将结果通过 `response.inject` 事件发送到活动响应。等待中的 智能体 随后即可恢复，无需等待整个多 智能体 响应完成。

```json
{
  "type": "response.inject",
  "response_id": "resp_123",
  "input": [
    {
      "type": "function_call_output",
      "call_id": "call_123",
      "output": "{\"temperature\":72}"
    }
  ]
}
```

对于有效的 `response.inject` 请求，服务器会回复以下两种事件之一：

- `response.inject.created`：输入已通过验证并接受注入
- `response.inject.failed`：输入未被注入；请检查 `error.code`

```json
{
  "type": "response.inject.created",
  "sequence_number": 42,
  "response_id": "resp_123"
}
```

```json
{
  "type": "response.inject.failed",
  "sequence_number": 43,
  "response_id": "resp_123",
  "input": [
    {
      "type": "function_call_output",
      "call_id": "call_123",
      "output": "{\"temperature\":72}"
    }
  ],
  "error": {
    "code": "response_already_completed",
    "message": "Response 'resp_123' has already completed."
  }
}
```

如果请求不符合 `response.inject` schema，服务器会发送一个带有 status 的通用错误 `400` 并关闭 WebSocket 连接。修复请求并在发送另一个事件之前打开一个新的 WebSocket 连接。

Python beta SDK 通过以下方式暴露 WebSocket 模式 `client.beta.responses.connect`。TypeScript beta SDK 通过以下方式暴露它 `ResponsesWS`。传递 `OpenAI-Beta: responses_multi_agent=v1` 在连接头中；与 HTTP 流式传输不同，WebSocket 连接器尚不接受 `betas` 参数。

保存来自 `response.created` 事件的响应 ID，并将其包含在每次 `response.inject` 你为该响应发送的事件中。发送注入项后，继续从 WebSocket 读取，直到响应完成并且每个注入都已产生一个 `response.inject.created` 或 `response.inject.failed` 事件。

通过 WebSocket 注入工具输出

```javascript
import OpenAI from "openai";

import { ResponsesWS } from "openai/resources/beta/responses/ws";

const client = new OpenAI();
const proposals = {
  alpha: { estimated_weeks: 6, risk: "medium" },
  beta: { estimated_weeks: 8, risk: "low" },
};
const tools = [
  {
    type: "function",
    name: "get_proposal",
    description:
      "Return details for a proposal that the agents should compare.",
    parameters: {
      type: "object",
      properties: {
        proposal: {
          type: "string",
          enum: ["alpha", "beta"],
        },
      },
      required: ["proposal"],
      additionalProperties: false,
    },
    strict: true,
  },
];

function processToolCall(name, argumentsJson) {
  if (name !== "get_proposal") {
    throw new Error(`Unknown tool: ${name}`);
  }
  const { proposal } = JSON.parse(argumentsJson);

  return JSON.stringify(proposals[proposal]);
}

async function runMultiAgent(ws) {
  let previousResponseId;
  let pendingInput = [
    { role: "user", content: process.argv.slice(2).join(" ") },
  ];

  while (pendingInput.length > 0) {
    ws.send({
      type: "response.create",
      model: "gpt-5.6-sol",
      store: true,
      multi_agent: {
        enabled: true,
        max_concurrent_subagents: 3,
      },
      tools,
      input: pendingInput,
      previous_response_id: previousResponseId,
    });

    const nextInput = [];
    let completedResponseId;
    let responseId;
    let pendingInjections = 0;

    for await (const message of ws) {
      if (message.type === "error") throw message.error;
      if (message.type !== "message") continue;

      const event = message.message;
      if (event.type === "response.created") {
        responseId = event.response.id;
      } else if (
        event.type === "response.output_item.done" &&
        event.item.type === "function_call"
      ) {
        if (!responseId) {
          throw new Error("Received a function call before response.created");
        }
        pendingInjections += 1;
        ws.send({
          type: "response.inject",
          response_id: responseId,
          input: [
            {
              type: "function_call_output",
              call_id: event.item.call_id,
              output: processToolCall(event.item.name, event.item.arguments),
            },
          ],
        });
      } else if (event.type === "response.inject.created") {
        pendingInjections -= 1;
      } else if (event.type === "response.inject.failed") {
        pendingInjections -= 1;
        if (event.error.code !== "response_already_completed") {
          throw new Error(JSON.stringify(event.error));
        }
        nextInput.push(...event.input);
      } else if (event.type === "response.completed") {
        completedResponseId = event.response.id;
      } else if (
        event.type === "error" ||
        event.type === "response.failed" ||
        event.type === "response.incomplete"
      ) {
        throw new Error(JSON.stringify(event));
      }

      if (completedResponseId && pendingInjections === 0) break;
    }

    if (!completedResponseId) {
      throw new Error("Connection ended before response.completed");
    }
    if (nextInput.length === 0) return;

    previousResponseId = completedResponseId;
    pendingInput = nextInput;
  }
}

const ws = new ResponsesWS(client, {
  headers: { "OpenAI-Beta": "responses_multi_agent=v1" },
});

try {
  await runMultiAgent(ws);
} finally {
  ws.close();
}
```

```python
from __future__ import annotations

import json

from openai import OpenAI

client = OpenAI()
PROPOSALS = {
    "alpha": {"estimated_weeks": 6, "risk": "medium"},
    "beta": {"estimated_weeks": 8, "risk": "low"},
}
tools = [
    {
        "type": "function",
        "name": "get_proposal",
        "description": "Return details for a proposal that the agents should compare.",
        "parameters": {
            "type": "object",
            "properties": {
                "proposal": {
                    "type": "string",
                    "enum": ["alpha", "beta"],
                }
            },
            "required": ["proposal"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]


def process_tool_call(name: str, arguments: str) -> str:
    if name != "get_proposal":
        raise ValueError(f"Unknown tool: {name}")
    parsed_arguments = json.loads(arguments)
    return json.dumps(PROPOSALS[parsed_arguments["proposal"]])


def run_multi_agent(connection):
    previous_response_id: str | None = None
    pending_input: list[dict[str, object]] = [{"role": "user", "content": input()}]

    while pending_input:
        request = {
            "type": "response.create",
            "model": "gpt-5.6-sol",
            "store": True,
            "multi_agent": {"enabled": True},
            "tools": tools,
            "input": pending_input,
        }
        if previous_response_id is not None:
            request["previous_response_id"] = previous_response_id

        connection.send(request)

        next_input: list[dict[str, object]] = []
        completed_response = None
        response_id: str | None = None
        pending_injections = 0

        for event in connection:
            event_type = event.type

            if event_type == "response.created":
                response_id = event.response.id

            elif event_type == "response.output_item.done":
                item = event.item

                if item.type == "function_call":
                    if response_id is None:
                        raise RuntimeError(
                            "Received a function call before response.created"
                        )

                    output = {
                        "type": "function_call_output",
                        "call_id": item.call_id,
                        "output": process_tool_call(item.name, item.arguments),
                    }
                    pending_injections += 1

                    connection.send(
                        {
                            "type": "response.inject",
                            "response_id": response_id,
                            "input": [output],
                        }
                    )

            elif event_type == "response.inject.created":
                pending_injections -= 1

            elif event_type == "response.inject.failed":
                pending_injections -= 1

                if event.error.code != "response_already_completed":
                    raise RuntimeError(event.error)

                next_input.extend(item.model_dump(mode="json") for item in event.input)

            elif event_type == "response.completed":
                completed_response = event.response

            elif event_type in {
                "error",
                "response.failed",
                "response.incomplete",
            }:
                raise RuntimeError(event)

            if completed_response is not None and pending_injections == 0:
                break

        if completed_response is None:
            raise RuntimeError("Connection ended before response.completed")

        if not next_input:
            return completed_response

        previous_response_id = completed_response.id
        pending_input = next_input


with client.beta.responses.connect(
    extra_headers={"OpenAI-Beta": "responses_multi_agent=v1"},
) as connection:
    run_multi_agent(connection)
```


发送 `response.inject` 事件后，继续从 WebSocket 读取并处理确认：

- **`response.inject.created`**：函数输出已添加到当前响应中。继续读取该响应的事件。
- **`response.inject.failed` with `response_already_completed`**：响应在函数输出能够被添加之前已完成。获取 `input` 在失败事件中返回的内容，并将其发送到新的 `response.create` 请求中，该请求从已完成的响应继续。
- **`response.inject.failed` with `response_not_found`**：服务器无法找到由 `response_id`。标识的响应。确认你使用的是从 `response.created`.

单个Multi-智能体运行可能跨越多个Responses API请求。在HTTP中，当智能体调用开发人员定义的函数时，你的应用程序执行该函数并将输出提交到一个新的 `response.create` 调用中。通过WebSocket，你的应用程序则会将函数输出注入到活动响应中。

## 新的多智能体输出条目

多智能体响应可以包含三种额外的输出项类型：

- `multi_agent_call`: 记录一个托管智能体动作，例如 `spawn_agent`.
- `multi_agent_call_output`: 包含托管动作执行的结果。
- `agent_message`: 携带从智能体到另一个智能体的加密消息。

该 `call_id` 字段将每个 `multi_agent_call` 链接到其对应的 `multi_agent_call_output`.

每个项还包括一个 `agent` 属性。对于 `agent_message`, `agent.agent_name` 标识接收方 智能体。使用 `author` 和 `recipient` 来 追踪 消息方向。

当你的应用接收到 `multi_agent_call`，时，请勿将其作为函数调用执行或返回结果。Responses API 会执行托管操作并返回相应的 `multi_agent_call_output`。如果你的应用需要用于重放或 追踪，请同时保留这两项。

```json
[
  {
    "type": "multi_agent_call",
    "id": "mac_123",
    "call_id": "call_spawn_a",
    "action": "spawn_agent",
    "arguments": "{\"task_name\":\"agent_a\",\"fork_turns\":\"all\",\"message\":\"enc_...\"}",
    "agent": { "agent_name": "/root" }
  },
  {
    "type": "multi_agent_call_output",
    "id": "maco_123",
    "call_id": "call_spawn_a",
    "action": "spawn_agent",
    "output": [
      {
        "type": "output_text",
        "text": "{\"task_name\":\"/root/agent_a\"}",
        "annotations": [],
        "logprobs": []
      }
    ],
    "agent": { "agent_name": "/root" }
  },
  {
    "type": "agent_message",
    "id": "amsg_123",
    "author": "/root/agent_a",
    "recipient": "/root",
    "content": [
      {
        "type": "encrypted_content",
        "encrypted_content": "enc_..."
      }
    ],
    "agent": { "agent_name": "/root" }
  }
]
```

智能体 归属的 SSE 事件包含一个顶层 `agent` 属性。对于 `agent_message` 事件， `agent.agent_name` 标识接收方 智能体。响应生命周期事件（如 `response.created` 和 `response.completed` ）描述整体响应而非单个 智能体，因此它们不包括 `agent` 属性。

```json
{
  "type": "response.output_item.done",
  "agent": { "agent_name": "/root" },
  "item": {
    "type": "agent_message",
    "id": "amsg_123",
    "author": "/root/agent_a",
    "recipient": "/root",
    "content": [
      {
        "type": "encrypted_content",
        "encrypted_content": "enc_..."
      }
    ],
    "agent": { "agent_name": "/root" }
  }
}
```

## 限制

1. 压缩：
   1. 该 `/responses/compact` 当启用多智能体时，不支持该端点。
   2. 当 `multi_agent.enabled` 被设置为 `true`，时，即使请求未配置，也会隐式启用自动服务端压缩。 `context_management`。压缩独立应用于根智能体和每个子智能体，保留它们各自的上下文。用户仍可覆盖 `compact_threshold` 通过设置显式的 `context_management.compact_threshold` 在请求中。
2. `reasoning.summary` 在启用多智能体时不支持。
3. `max_tool_calls` 在启用多智能体时不支持。
4. `max_concurrent_subagents` 默认为 `3`，这是推荐设置。

## 提示词指南

当启用 Multi-智能体时，我们的系统会自动将这些指令作为新的开发者消息附加到根智能体和子智能体上。你无法编辑或移除这些指令，但应将你的开发者指令视为对这些自动注入指令的补充。

### 根智能体

````text
You are `/root`, the primary agent in a team of agents collaborating to fulfill the user's goals.

At the start of your turn, you are the active agent.
You can spawn sub-agents to handle subtasks, and those sub-agents can spawn their own sub-agents.
All agents in the team, including the agents that you can assign tasks to, are equally intelligent and capable, and have access to the same set of tools.

You can use `spawn_agent` to create a new agent, `followup_task` to give an existing agent a new task and trigger a turn, and `send_message` to pass a message to a running agent without triggering a turn.
Child agents can also spawn their own sub-agents.
You can decide how much context you want to propagate to your sub-agents with the `fork_turns` parameter.

You will receive messages in the form:
```
Message Type: MESSAGE | FINAL_ANSWER
Task name: <recipient>
Sender: <author>
Payload:
<payload text>
```
They may be addressed as to=/root

There are {max_concurrent_subagents + 1} available concurrency slots, meaning that up to {max_concurrent_subagents + 1} agents can be active at once, including you.
````

### 子代理

````text
You are an agent in a team of agents collaborating to complete a task.

You can spawn sub-agents to handle subtasks, and those sub-agents can spawn their own sub-agents. All agents in the team, including the agents that you can assign tasks to, are equally intelligent and capable, and have access to the same set of tools.

You can use `spawn_agent` to create a new agent, `followup_task` to give an existing agent a new task and trigger a turn, and `send_message` to pass a message to a running agent.
Child agents can also spawn their own sub-agents.

When you provide a response in the final channel, that content is immediately delivered back to your parent agent.

You will receive messages in the form:
```
Message Type: NEW_TASK | MESSAGE | FINAL_ANSWER
Task name: <recipient>
Sender: <author>
Payload:
<payload text>
```
You may also see them addressed as to=/root/..., which indicates your identity is /root/...

There are {max_concurrent_subagents + 1} available concurrency slots, meaning that up to {max_concurrent_subagents + 1} agents can be active at once, including you.
````

## 相关指南

- [函数调用](https://developers.openai.com/api/docs/guides/function-calling)
- [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)
- [压缩](https://developers.openai.com/api/docs/guides/compaction)