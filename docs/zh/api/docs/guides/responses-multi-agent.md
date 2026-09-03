# 多智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt). 你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 概述

Multi-智能体 允许模型并行启动并协调子智能体，综合它们的工作以给出最终响应。对于涉及代码库探索、文档编写和实现等需要并行任务委派的复杂任务应用，这一机制尤其有效。

Multi-智能体 作为一项测试版功能，在所有 GPT-5.6 模型中均可使用。在你的应用中启用 Multi-智能体 之前，请查看模型页面。

## 何时使用多智能体

任务通常可以划分为独立的工作模块，这些模块由单个智能体依次完成，但多个智能体能够并行处理。多智能体架构允许一个根智能体将任务委派给多个并发工作的子智能体。这可以带来多重优势：

- **并行执行。** 独立的研究、分析或实现任务可以同时进行，从而加快执行速度。
- **聚焦的上下文。** 每个子智能体接收一个有界的任务并维护自己的上下文，这可以减少不相关工作线之间的上下文干扰并提升性能。
- **模型主导的协调。** 根智能体可以创建子智能体、向它们发送额外信息、等待结果并综合出最终答案，而无需你的应用来实现编排逻辑。

多智能体编排最适用于任务可以被划分为具体的、相互独立的工作流的场景，例如：

- 并行探索大型代码库的不同部分
- 并行比较多个方案、文档或假设
- 并行研究多个来源
- 并行实现独立组件或编写独立的测试套件
- 并行调查失败可能的不同原因
- 并行探索解决同一问题的不同方法

请注意，添加子智能体会增加 token 使用量，并且对于依赖单一有序推理链、需要频繁写入共享可变状态，或者已经由某个较慢的外部操作主导的任务，可能并不会带来明显收益。

| 在以下情况下使用多智能体                              | 在以下情况下优先使用单个智能体                                 |
| ------------------------------------------------- | ----------------------------------------------------- |
| 工作可以拆分为有界限的独立任务 | 每个步骤都直接依赖前一步骤       |
| 分离上下文有助于提升专注度                   | 任务足够小，可以在一次短运行内完成 |
| 并行探索可以缩短挂钟时间   | 多个智能体 会争抢同一可变资源   |
| 比较独立得出的发现可以提升覆盖度  | 你需要固定且确定性的执行图    |

## 快速入门

Python 和 JavaScript 示例使用 beta 版 Responses SDK。对于 HTTP
  请求，请使用 `client.beta.responses` 并传入 `responses_multi_agent=v1` 参数。对于原始 HTTP 请求和 WebSocket 连接，请在请求或连接头中传入
  该 `betas` 。
  `OpenAI-Beta: responses_multi_agent=v1` 。
  Multi-智能体 处于 beta 阶段时，条目 schema 可能会发生变化。

在 Responses API 请求中通过 `multi_agent.enabled`。启用 Multi-智能体。当 `multi_agent.enabled` 为 `true`，时，根 智能体 就可以生成一个子智能体树。子智能体共享请求的模型和可用工具，而 智能体 通过生成、消息传递和等待等协作原语进行协作（参见 [Multi-智能体 的工作原理](#how-multi-agent-works)）。根 智能体 负责综合子智能体的响应并提供最终响应。

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


`max_concurrent_subagents` 设置整个 智能体 树中可同时处于活动状态的子智能体数量的上限。它包括所有后代——子级、孙级以及更深层级的子智能体——但不包括根 智能体。

API 对此设置没有固定的硬性上限。默认值为 `3`，建议大多数工作负载使用此值。Multi-智能体 运行对树深度或单次运行中创建的子智能体总数也没有固定限制。

添加开发者消息以调整根模型何时应生成子智能体。此开发者消息是对为根 智能体 和子智能体注入的指令的补充。

开发者消息示例包括：

- "除非用户明确要求使用子智能体、委派或并行智能体工作，否则不要派生子智能体。"
- "主动的多智能体委派已启用。当并行工作能够显著提升速度或质量时，请使用子智能体。"

## 多智能体工作原理

Responses API 为根智能体和子智能体模型提供托管编排操作及相关使用说明。根智能体命名为 `/root`。生成的子智能体使用如下层级路径：

```text
/root
├── /root/researcher
├── /root/reviewer
└── /root/reviewer/tester
```

多智能体对子智能体总数或树的深度不设固定上限。对于大多数任务，使用默认的 `max_concurrent_subagents` 值 `3`。该设置会限制整个树中（包括子级及更深的后代）的活动子智能体轮次数。

启用多智能体模式后，Responses API 提供六项托管协作操作。你可能会看到这些操作以 `multi_agent_call` 项的形式出现。你的应用程序不应执行这些操作，也无需为其提交输出。

| Action            | Purpose                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `spawn_agent`     | 创建一个子智能体并为其分配初始任务。                                 |
| `send_message`    | 为现有智能体排入一条消息，但不开启新一轮。             |
| `followup_task`   | 为现有非根智能体分配更多工作，并开始或继续其新一轮。   |
| `wait_agent`      | 等待调用方智能体邮箱中的更新。                             |
| `interrupt_agent` | 中断另一个智能体正在进行的轮次，但不删除其上下文。            |
| `list_agents`     | 返回当前智能体树、状态以及每个智能体的 `last_task_message`. |

处理开发者自定义的工具调用的方式与未启用 Multi-智能体 时相同。树中的任何 智能体 都可以发出 `function_call`。你的应用程序必须执行该调用，并提交一个匹配的 `function_call_output`.

请注意，树中的所有 智能体 都可以访问 API 请求的模型调用中配置的工具。

## 在 Responses API 中使用多 智能体

### HTTP 与 WebSocket 性能对比

HTTP 和 WebSocket 支持相同的 Multi-智能体 能力，但对于工具密集型或长时间运行的智能体工作流，建议使用 WebSocket。其持久连接允许你的应用在函数输出可用时立即返回，从而减少延续开销，并让智能体花费更少的时间等待。

使用 HTTP 时，响应会在每个活跃智能体完成或暂停以等待客户端执行的函数调用后结束。然后你的应用会执行所有未完成的函数调用，并在新的Responses API请求中提交它们的输出，从而使暂停的智能体能够恢复。

使用 WebSocket 时，你的应用可以在函数输出可用时立即将其注入响应，无需等待当前响应完成。处于等待中的智能体可以立即恢复，而其他智能体则继续工作。当智能体在不同时间完成或请求工具时，这能减少协调延迟并避免额外的请求往返。

对于需要调用多个托管工具（例如并行网页搜索）的工作流，或函数调用较少的单请求工作流，HTTP 可能已经足够。但对于大多数 Multi-智能体工作流，WebSocket 更有可能提供更低的延迟和更好的端到端性能。

#### HTTP function call execution

![在应用、Responses API 根节点以及三个子智能体之间的 HTTP 函数调用执行。](https://developers.openai.com/images/api/multi-agent/multi-agent-1.png)

#### WebSocket 函数调用执行

![跨整个应用、Responses API 根以及三个子智能体的 WebSocket 函数调用执行。](https://developers.openai.com/images/api/multi-agent/multi-agent-2.png)

### HTTP

这些示例需要暴露 beta SDK 构建以及 beta Responses API。对于 HTTP 流式传输，调用 `client.beta.responses.create` 并传入 `responses_multi_agent=v1` 时附带 `betas` 参数；这会启用 beta 类型和自动补全。在 Python 中，从 `openai.types.beta` 导入 beta response item 类型用于添加类型注解。

客户端代码示例：

处理 HTTP 流式传输工具调用

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


如果有一个或多个 智能体 调用开发者定义的函数，请执行所有待处理的调用，并创建一个包含其输出的 延续 请求。

### WebSocket

在 WebSocket 模式下，当 智能体 调用开发者定义的函数时，在你的应用中执行该函数，并通过一个 `response.inject` 事件将其结果发送到当前响应中。处于等待状态的 智能体 随后可以继续执行，无需等待整个多 智能体 响应完成。

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

对于一个有效的 `response.inject` 请求，服务器会回复以下两种事件之一：

- `response.inject.created`: 输入已通过校验并接受注入
- `response.inject.failed`: 输入未被注入；请检查 `error.code`

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

如果请求不符合 `response.inject` 模式，服务端会发送一个通用错误响应，状态码为 `400` ，并关闭 WebSocket 连接。请修正请求，然后开启一个新的 WebSocket 连接，再发送其他事件。

Python 测试版 SDK 通过 `client.beta.responses.connect`。暴露 WebSocket 模式。TypeScript 测试版 SDK 通过 `ResponsesWS`。暴露该模式。在连接头中传入 `OpenAI-Beta: responses_multi_agent=v1` ；与 HTTP 流式响应不同，WebSocket 连接器目前还不接受 `betas` 参数。

从 `response.created` 事件中保存响应 ID，并在该响应的每个 `response.inject` 事件中包含该 ID。发送注入项后，继续从 WebSocket 读取，直到响应完成，并且每个注入项都已生成 `response.inject.created` 或 `response.inject.failed` 事件。

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

- **`response.inject.created`**: 函数输出已添加到当前响应中。请继续读取该响应的事件流。
- **`response.inject.failed` 并附上 `response_already_completed`**: 响应在函数输出添加之前就已完成。请获取失败事件中 `input` 返回的 ID，并将其发送到一个新的 `response.create` 请求中，从已完成的响应继续执行。
- **`response.inject.failed` 并附上 `response_not_found`**: 服务端无法找到由 `response_id`。指定的响应。请确认你使用的是从 `response.created`.

单次 Multi-智能体 运行可能跨越多个 Responses API 请求。通过 HTTP，当 智能体 调用开发者定义的函数时，你的应用程序会执行该函数，并在新的 `response.create` 调用中提交其输出。通过 WebSocket 时，你的应用程序改为将该函数输出注入到当前进行中的 response 中。

## 新的多智能体输出项

多智能体响应可以包含另外三种输出项类型：

- `multi_agent_call`：记录一项托管的 Multi-智能体 操作，例如 `spawn_agent`.
- `multi_agent_call_output`：包含某项托管操作的执行结果。
- `agent_message`：携带从一个 智能体 到另一个智能体的加密消息。

该 `call_id` field 字段将每个 `multi_agent_call` 链接到对应的 `multi_agent_call_output`.

每一项还包含一个 `agent` 属性。对于一个 `agent_message`, `agent.agent_name` 用于标识接收方 智能体。使用 `author` 和 `recipient` 来 追踪 消息方向。

当你的应用程序收到一个 `multi_agent_call`，时，不要将其作为函数调用执行或回传结果。Responses API 会执行该托管动作并返回相应的 `multi_agent_call_output`。如果你的应用程序需要它们用于回放或 追踪，请同时保留这两项。

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

归属 智能体 的 SSE 事件包含一个顶层 `agent` 属性。对于一个 `agent_message` 事件， `agent.agent_name` 用于标识接收方 智能体。响应生命周期事件（例如 `response.created` 和 `response.completed` ）描述的是整个响应而非单个 智能体，因此它们不包含 `agent` 属性。

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

1. Compaction:
   1. 该 `/responses/compact` endpoint is not supported when Multi-智能体 is enabled.
   2. When `multi_agent.enabled` is set to `true`, automatic 服务端 compaction is enabled implicitly, even if the request does not configure `context_management`. Compaction is applied independently to the root 智能体 and each subagent, preserving their separate contexts. Users can still override `compact_threshold` by setting an explicit `context_management.compact_threshold` in the request.
2. `reasoning.summary` is not supported when Multi-智能体 is enabled.
3. `max_tool_calls` is not supported when Multi-智能体 is enabled.
4. `max_concurrent_subagents` defaults to `3`, which is the recommended setting.

## 提示词指南

启用多智能体（Multi-智能体）后,我们的系统会自动将这些指令作为一条新的开发者消息追加到根智能体和子智能体中。你无法编辑或删除这些指令,但应将你的开发者指令组织成对这些自动注入指令的补充。

### 根智能体 智能体

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

### 子智能体

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