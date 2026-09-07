# WebSocket 模式

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

Responses API 支持用于长时间运行、工具调用密集型工作流的 WebSocket 模式。除了降低延迟外, `stream_id` 还支持 WebSocket 多路复用:通过到的一条持久连接 `/v1/responses` 可以并行运行对话,并将现有对话分叉到新的流上。通过仅发送新的输入项以及 `previous_response_id`.

WebSocket 模式同时兼容零数据保留 (ZDR) 和 `store=false`.

## 为什么要使用 WebSocket 模式

当工作流涉及大量模型与工具之间的多轮往返（例如，智能体编码或包含重复工具调用的编排循环）时，WebSocket 模式最为适用。

由于连接保持打开状态，且每轮仅发送增量输入，WebSocket 模式可降低每轮延续开销，并在长链路中改善端到端延迟。对于包含 20 次以上工具调用的运行，端到端执行速度最高可提升约 40%。

## 连接并创建响应

使用以下命令安装 WebSocket 依赖 `pip install "openai[realtime]>=3.8.0"` （适用于 Python）或 `npm install openai@^7.10.0 ws` （适用于 JavaScript）。

在 WebSocket 模式下，每个轮次开始时由客户端发送一个 `response.create` 事件，其载荷与标准的 [Responses 创建请求体](https://developers.openai.com/api/reference/resources/responses/methods/create)，一致，只是不会使用 `stream` 和 `background` 等传输相关的字段。

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();

const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Find fizz_buzz()" }],
      },
    ],
    tools: [],
  });
  let completed = false;
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      completed = true;
      break;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  if (!completed)
    throw new Error("Connection closed before the response finished.");
} finally {
  ws.close();
}
```

```python
from openai import OpenAI

client = OpenAI()

with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model="gpt-6-astra",
        store=False,
        input=[
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": "Find fizz_buzz()"}],
            }
        ],
        tools=[],
    )
    for event in connection:
        if event.type == "response.completed":
            print(event.response.output_text)
            break
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
```


客户端可以通过发送 `response.create` 并附带 `generate: false`，可选地对请求状态进行预热。当你已经知道即将发送的工具、指令和/或自定义消息时，这非常有用。 `generate: false` 不会返回模型输出，但会准备请求状态，使下一次生成的轮次可以更快地启动。预热请求会返回一个响应 ID，你可以使用 `previous_response_id`，在响应链的后续轮次中继续链接。下一节将介绍如何使用 `previous_response_id` 和增量输入来延续会话。

## 使用增量输入继续

要在响应仍在运行时添加用户指令，请使用 [中途引导](https://developers.openai.com/api/docs/guides/steering)。引导会保留已完成的工作，并在一次延续中纳入新指令。请使用以下 `response.create` 模式来处理普通的轮次间延续和工具结果。

若要继续某个运行，请再发送一个 `response.create` 并附带：

- `previous_response_id` 设置为上一个响应 ID。
- `input` 仅包含新条目（例如，工具输出和下一条用户消息）。

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();
const model = "gpt-6-astra";
/** @type {OpenAI.Responses.FunctionTool[]} */
const tools = [
  {
    type: "function",
    name: "get_test_results",
    description: "Return a local demo test result.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
  },
];

/** @param {ResponsesWS} ws */
async function waitForResponse(ws) {
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      return message.response;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  throw new Error("Connection closed before the response finished.");
}

const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model,
    store: false,
    input: "Find the failing test and suggest a fix.",
    tools,
    tool_choice: { type: "function", name: "get_test_results" },
    parallel_tool_calls: false,
  });
  const first = await waitForResponse(ws);
  const call = first.output.find((item) => item.type === "function_call");
  if (!call || call.name !== "get_test_results") {
    throw new Error("Expected a get_test_results function call.");
  }
  const result = {
    test: "test_fizz_buzz",
    failure: 'Expected "FizzBuzz" for 15, got "Fizz".',
  };

  // Continue on the same socket with the actual response and tool-call IDs.
  ws.send({
    type: "response.create",
    stream_id: "main",
    model,
    store: false,
    previous_response_id: first.id,
    input: [
      {
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      },
      { role: "user", content: "Now optimize it." },
    ],
    tools,
    tool_choice: "none",
  });
  await waitForResponse(ws);
} finally {
  ws.close();
}
```

```python
import json

from openai import OpenAI
from openai.resources.responses.responses import ResponsesConnection
from openai.types.responses import FunctionToolParam, Response

client = OpenAI()
model = "gpt-6-astra"
tools: list[FunctionToolParam] = [
    {
        "type": "function",
        "name": "get_test_results",
        "description": "Read the demo test results.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
            "additionalProperties": False,
        },
        "strict": True,
    }
]


def get_test_results():
    # Demo data. Replace this function with your test runner.
    return {
        "test": "test_fizz_buzz",
        "failure": 'Expected "FizzBuzz" for 15, got "Fizz".',
    }


def wait_for_response(connection: ResponsesConnection) -> Response:
    for event in connection:
        if event.type == "response.completed":
            return event.response
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
    raise RuntimeError("Connection closed before the response finished.")


with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model=model,
        store=False,
        input="Find the failing test and suggest a fix.",
        tools=tools,
        tool_choice={"type": "function", "name": "get_test_results"},
        parallel_tool_calls=False,
    )
    response = wait_for_response(connection)
    call = next(item for item in response.output if item.type == "function_call")
    if call.name != "get_test_results" or json.loads(call.arguments) != {}:
        raise ValueError("Expected a get_test_results call with no arguments")

    # Continue on the same connection using the actual response and tool-call IDs.
    connection.response.create(
        stream_id="main",
        model=model,
        store=False,
        previous_response_id=response.id,
        input=[
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(get_test_results()),
            },
            {"role": "user", "content": "Now optimize it."},
        ],
        tools=tools,
        tool_choice="none",
    )
    print(wait_for_response(connection).output_text)
```


## 延续的工作原理

WebSocket 模式使用与 HTTP 模式相同的 `previous_response_id` 链式语义，但在活跃 socket 上增加了一条低延迟的延续路径。

在活跃的 WebSocket 连接上，服务会将最近的 previous-response 状态保存在一个连接本地的内存缓存中。当你使用 `stream_id`，时，每个 lane 会保留其最新的缓存响应，因此在该 lane 中从最新响应继续时速度很快，因为服务可以复用连接本地的状态。由于服务仅在内存中保留 previous-response 状态而不会写入磁盘，因此你可以以兼容 `store=false` 和 Zero Data Retention (ZDR) 的方式使用 WebSocket 模式。

如果某个 `previous_response_id` 不在内存缓存中，则行为取决于你是否存储响应：

- 在 `store=true`，下，服务可在可用时从持久化状态中水合旧的响应 ID。延续仍然可以工作，但会失去内存中的延迟优势。
- 在 `store=false` （包括 ZDR）下，没有持久化回退。如果该 ID 未缓存，则请求返回 `previous_response_not_found`.

如果同一通道的 延续 返回一个 `4xx` 或 `5xx`，服务端会从连接本地缓存中淘汰所引用的 `previous_response_id` 。返回错误的跨通道分叉会保留共享的父项，以便源通道可以继续执行。

## 压缩与创建新响应

如果使用压缩，则有两种不同的延续模式：

### 服务端压缩（`context_management`)

当你启用服务端压缩时（`context_management` 并附带 `compact_threshold`），压缩会在正常的 `/responses` 生成过程中进行。在 WebSocket 模式下，你可以像平常一样继续：发送下一个 `response.create` ，其中包含最新的 `previous_response_id` ，以及仅包含新增的输入项。

### 独立使用 `/responses/compact`

独立 [`/responses/compact` 端点](https://developers.openai.com/api/reference/resources/responses/methods/compact) 返回一个已压缩的新输入窗口，而非响应 ID。压缩完成后，使用该压缩后的窗口作为 `input` （加上后续的用户/工具条目）来在你的 WebSocket 连接上创建一个新响应。

省略 `previous_response_id` 或将其设置为 `null`。即可开启新的链。按原样传入压缩后的输出；不要裁剪返回的窗口。

```javascript
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

// Compact your current window with an HTTP request.
const compacted = await client.responses.compact({
  model: "gpt-6-astra",
  input: longInputItems,
});
const nextInput = toResponseInputItems(compacted.output);
nextInput.push({
  type: "message",
  role: "user",
  content: [{ type: "input_text", text: "Continue from here." }],
});

// Start a new response on the WebSocket using the compacted window.
const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model: "gpt-6-astra",
    store: false,
    input: nextInput,
    tools: [],
  });
  let completed = false;
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      completed = true;
      break;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  if (!completed)
    throw new Error("Connection closed before the response finished.");
} finally {
  ws.close();
}
```

```python
from typing import cast

from openai import OpenAI
from openai.types.responses import ResponseInputParam

# Compact your current window (HTTP call).
compacted = client.responses.compact(
    model="gpt-6-astra",
    input=long_input_items_array,
)
next_input = cast(
    ResponseInputParam,
    [item.to_dict() for item in compacted.output],
)
next_input.append(
    {
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "Continue from here."}],
    }
)

# Start a new response on the WebSocket using the compacted window.
with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model="gpt-6-astra",
        store=False,
        input=next_input,
        tools=[],
    )
    for event in connection:
        if event.type == "response.completed":
            print(event.response.output_text)
            break
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
```


## 并行运行对话

你可以使用以下参数在同一条连接上保持并行的对话 `stream_id` 参数。连续发送彼此独立的事件 `response.create` 事件，每个事件使用不同的 `stream_id` 取值。服务端可以在一条连接上并发运行这些事件。它们产生的事件可能会交错，因此请保持单一读取循环，并按照以下方式对每个事件进行路由 `stream_id`.

一个 `stream_id` 命名了一条 WebSocket 连接上的有序通道。请保持不同 `stream_id` 和 `previous_response_id` 相互独立：

- `stream_id` 控制事件的流向以及请求按先进先出顺序执行。
- `previous_response_id` 控制会话的继承关系。

这种分离解锁了两种有用的模式。

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

具有相同 `stream_id` 的请求保持先进先出且不重叠。具有不同 `stream_id` 值的请求可以并发运行。

### 每个连接的限制

- 一个连接在命名和默认通道中最多可以有 16 个活跃的、进行中的响应。该连接可继续接收更多 `response.create` 事件并将其排队，直到某个活跃响应结束。
- 一个连接最多接受 32 个不同的命名 `stream_id` 值。隐式的默认通道不计入此命名流数量限制。达到该限制后可复用现有 `stream_id` 或开启新的连接。

### 将会话分叉到一个新的流

要从已完成的响应分叉，请将其 ID 作为 `previous_response_id` 连同一个新的 `stream_id`。一起发送。在该响应仍然可用期间，新流会继承其上下文，而原始流可以继续运行。分叉开始后，两个分支可以使用不同的流 ID 并发运行。

在使用 `store=false` （包括 ZDR）时，跨通道分叉依赖于父响应仍保留在连接本地缓存中。如果在源通道推进或失败期间分叉进入队列，父响应可能在分叉开始前被驱逐，分叉将返回 `previous_response_not_found`。请等待分叉通道发出 `response.in_progress` 后再推进源通道，或将 `previous_response_id` 设置为 `null` 并重放完整的输入上下文。

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

复用 `stream_id` 而不带 `previous_response_id` 会开启一个新响应，而不会延续对话。

关键调用如下所示：

```text
# One socket, two independent conversations.
send_create(connection, "planner", "Draft a deployment plan.")
send_create(connection, "research", "List deployment risks.")

# Fork the planner response, then continue the original branch in parallel.
send_create(
    connection,
    "critic",
    "Find gaps in this plan.",
    previous_response_id=planner_response_id,
)
wait_for_in_progress(connection, "critic")
send_create(
    connection,
    "planner",
    "Add rollback steps.",
    previous_response_id=planner_response_id,
)
```

### 完整示例

并行运行对话，然后分叉其中一个

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();

/** @type {Map<string, string>} */
const latestResponseIdByLane = new Map();

/**
 * @param {ResponsesWS} ws
 * @param {string} streamId
 * @param {string} text
 * @param {string} [previousResponseId]
 */
function sendCreate(
  ws,
  streamId,
  text,
  previousResponseId = latestResponseIdByLane.get(streamId)
) {
  ws.send({
    type: "response.create",
    stream_id: streamId,
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    ],
    previous_response_id: previousResponseId,
  });
}

/** @param {ReturnType<ResponsesWS["stream"]>} events */
async function readMessage(events) {
  while (true) {
    const { value: event, done } = await events.next();
    if (done)
      throw new Error("Connection closed before all responses finished.");
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(
        `Lane ${message.stream_id} failed: ${JSON.stringify(message)}`
      );
    }
    return message;
  }
}

/** @param {ReturnType<ResponsesWS["stream"]>} events @param {Set<string>} expectedStreamIds */
async function drainUntilComplete(events, expectedStreamIds) {
  const remaining = new Set(expectedStreamIds);
  while (remaining.size > 0) {
    const message = await readMessage(events);
    const streamId = message.stream_id;
    if (!streamId || !remaining.has(streamId)) continue;
    if (message.type === "response.completed") {
      latestResponseIdByLane.set(streamId, message.response.id);
      remaining.delete(streamId);
    }
  }
}

/** @param {ReturnType<ResponsesWS["stream"]>} events @param {string} streamId */
async function waitForInProgress(events, streamId) {
  while (true) {
    const message = await readMessage(events);
    if (
      message.type === "response.in_progress" &&
      message.stream_id === streamId
    )
      return;
  }
}

const ws = new ResponsesWS(client);
// Keep one iterator so events stay queued while moving between phases.
const events = ws.stream();
try {
  // Run two independent conversations in parallel.
  sendCreate(
    ws,
    "planner",
    "Draft a deployment plan for a stateless API service."
  );
  sendCreate(
    ws,
    "research",
    "List common deployment risks for a stateless API service."
  );
  await drainUntilComplete(events, new Set(["planner", "research"]));

  // Fork the planner conversation and continue its original branch in parallel.
  const plannerResponseId = latestResponseIdByLane.get("planner");
  sendCreate(
    ws,
    "critic",
    "Find gaps in this deployment plan.",
    plannerResponseId
  );
  // Let the fork load its parent before advancing the original lane's cache.
  await waitForInProgress(events, "critic");
  sendCreate(
    ws,
    "planner",
    "Add rollback and monitoring steps to the plan.",
    plannerResponseId
  );
  await drainUntilComplete(events, new Set(["critic", "planner"]));
} finally {
  await events.return?.();
  ws.close();
}
```

```python
from openai import OpenAI
from openai.resources.responses.responses import ResponsesConnection

client = OpenAI()
latest_response_id_by_lane: dict[str, str] = {}


def send_create(
    connection: ResponsesConnection,
    stream_id: str,
    text: str,
    previous_response_id: str | None = None,
):
    if previous_response_id is None:
        previous_response_id = latest_response_id_by_lane.get(stream_id)
    connection.response.create(
        stream_id=stream_id,
        model="gpt-6-astra",
        store=False,
        input=[
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": text}],
            }
        ],
        previous_response_id=previous_response_id,
    )


def drain_until_complete(
    connection: ResponsesConnection, expected_stream_ids: set[str]
):
    completed: set[str] = set()
    for event in connection:
        stream_id = event.stream_id
        if event.type == "error" and stream_id is None:
            raise RuntimeError(f"Connection error: {event.to_json()}")
        if stream_id is None or stream_id not in expected_stream_ids:
            continue

        if event.type == "response.completed":
            latest_response_id_by_lane[stream_id] = event.response.id
            completed.add(stream_id)
            if completed == expected_stream_ids:
                return
        elif event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(f"Lane {stream_id} failed: {event.to_json()}")
    raise RuntimeError("Connection closed before all responses finished.")


def wait_for_in_progress(connection: ResponsesConnection, expected_stream_id: str):
    for event in connection:
        if event.type == "error" and event.stream_id is None:
            raise RuntimeError(f"Connection error: {event.to_json()}")
        if event.stream_id != expected_stream_id:
            continue
        if event.type == "response.in_progress":
            return
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(f"Lane {expected_stream_id} failed: {event.to_json()}")
    raise RuntimeError("Connection closed before the fork started.")


with client.responses.connect() as connection:
    # 1. Run two independent conversations in parallel.
    send_create(
        connection, "planner", "Draft a deployment plan for a stateless API service."
    )
    send_create(
        connection,
        "research",
        "List common deployment risks for a stateless API service.",
    )
    drain_until_complete(connection, {"planner", "research"})

    # 2. Fork the planner conversation and continue the original branch in parallel.
    planner_response_id = latest_response_id_by_lane["planner"]
    send_create(
        connection,
        "critic",
        "Find gaps in this deployment plan.",
        previous_response_id=planner_response_id,
    )
    # Let the fork bind its parent before advancing the original lane.
    wait_for_in_progress(connection, "critic")
    send_create(
        connection,
        "planner",
        "Add rollback and monitoring steps to the plan.",
        previous_response_id=planner_response_id,
    )
    drain_until_complete(connection, {"critic", "planner"})
```


一个 `stream_id` 必须为 1–256 个字符，且只能包含字母、数字、下划线（`_`）、连字符（`-`）和句点（`.`）。仅在 WebSocket `response.create` 事件中使用它；不要在 HTTP `POST /v1/responses`.

对于已命名的流，服务端事件会包含匹配的 `stream_id`，包括终止事件和请求范围内的错误。

如果省略 `stream_id`，请求将使用隐式默认通道，并且其事件不包含 `stream_id`。默认通道在其他方面遵循与已命名流相同的排序和并发规则。空字符串不是有效的 `stream_id`；请省略该字段以选择默认通道。

## 连接行为与限制

- 每个响应内的事件遵循现有的 Responses 流式事件模型。不同通道的事件可以交错出现。
- 相同 lane 的请求按 `stream_id` 先进先出顺序执行，且不会重叠。不同 lane 上的请求可以并发执行。
- 连接最长持续 60 分钟。达到上限时请重新连接。

## 重连与恢复

当连接关闭（或达到 60 分钟上限）时，每个通道的连接本地缓存都会消失。请新建一个 WebSocket 连接，并使用以下其中一种模式恢复各个通道：

1. 如果你存储了之前的响应（`store=true`) 并且拥有有效的响应 ID，可使用 `previous_response_id` 以及新的输入项来延续该链路。
2. 如果你无法延续某个链路（例如， `store=false`/ZDR 或 `previous_response_not_found`)，请通过将 `previous_response_id` 设置为 `null` （或省略它）并发送该链路下一轮的完整输入上下文来开启新的响应。
3. 如果你使用 `/responses/compact`，压缩了上下文，请将返回的压缩后窗口作为 `input` 该新响应的基础，然后追加最新的用户/工具项。

## 需要处理的错误

当服务端能够将错误关联到某个具名通道时，错误事件会包含 `stream_id`。在请求范围内的错误之后，其他通道可以继续执行。

`previous_response_not_found`

```json
{
  "type": "error",
  "status": 400,
  "stream_id": "main",
  "error": {
    "type": "invalid_request_error",
    "code": "previous_response_not_found",
    "message": "Previous response with id 'resp_abc' not found.",
    "param": "previous_response_id"
  }
}
```

`invalid_stream_id`

```json
{
  "type": "error",
  "status": 400,
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_stream_id",
    "message": "The 'stream_id' field must be a non-empty string with at most 256 characters and may only contain letters, numbers, underscores, hyphens, and periods.",
    "param": "stream_id"
  }
}
```

`websocket_stream_limit_reached`

```json
{
  "type": "error",
  "status": 400,
  "stream_id": "agent_33",
  "error": {
    "type": "invalid_request_error",
    "code": "websocket_stream_limit_reached",
    "message": "This WebSocket connection has reached its maximum number of distinct stream IDs (32). Reuse an existing stream_id or open a new WebSocket connection.",
    "param": "stream_id"
  }
}
```

`websocket_connection_limit_reached`

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "code": "websocket_connection_limit_reached",
    "message": "Responses websocket connection limit reached (60 minutes). Create a new websocket connection to continue."
  },
  "status": 400
}
```

## 相关指南

- [对话状态](https://developers.openai.com/api/docs/guides/conversation-state)
- [流式 API 响应](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Responses 流式事件参考](https://developers.openai.com/api/reference/resources/responses)
- [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events)