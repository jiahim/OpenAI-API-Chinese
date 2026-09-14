# WebSocket Mode

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

Responses API 支持用于长时间运行、工具调用密集型工作流的 WebSocket 模式。除了降低延迟外， `stream_id` 还支持 WebSocket 多路复用：单条到 的持久连接 `/v1/responses` 可以并行运行多个会话，并将现有会话分叉到新的流上。每个回合只需发送新的输入项以及 `previous_response_id`.

WebSocket 模式兼容 Zero Data Retention (ZDR) 和 `store=false`.

## 为什么要使用 WebSocket 模式

当某个工作流涉及大量模型与工具之间的往返调用（例如，智能体编程或包含重复工具调用的编排循环）时，WebSocket 模式最为有用。

由于连接保持打开状态，并且每一轮只发送增量输入，WebSocket 模式降低了每轮延续开销，并在长链路中改善了端到端延迟。对于包含 20 次以上工具调用的运行，我们观察到端到端执行速度可加快约 40%。

## 连接并创建响应

使用以下命令安装 WebSocket 依赖： `pip install "openai[realtime]>=3.8.0"` 适用于 Python， `npm install openai@^7.10.0 ws` 适用于 JavaScript，或 `gem install openai async-websocket` 适用于 Ruby。

在 WebSocket 模式下，每一轮开始时由客户端发送一个 `response.create` 事件。其负载与普通的 [Responses 创建请求体](https://developers.openai.com/api/reference/resources/responses/methods/create)，一致，但不会使用诸如 `stream` 和 `background` 等传输相关的字段。

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

```ruby
require "async"
require "openai"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: [
          {
            role: "user",
            content: "Find fizz_buzz()"
          }
        ], tools: []
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


客户端可以选择通过发送 `response.create` 并附带 `generate: false`。来预先准备请求状态。当你已经知道即将到来的轮次中计划发送的工具、指令和/或自定义消息时，这会很有用。 `generate: false` 不会返回模型输出，但会预先准备请求状态，从而让下一轮生成的开始更快。预热请求会返回一个响应 ID，你可以使用该 ID 通过 `previous_response_id`，进行链式调用，包括在响应链的后续轮次中也是如此。下一节将介绍如何使用 `previous_response_id` 和增量输入来延续会话。

## 使用增量输入继续

要在响应仍在进行时添加用户指令，请使用 [回合中引导](https://developers.openai.com/api/docs/guides/steering)。引导会保留已完成的工作，并在 延续 中包含新的指令。请参考以下 `response.create` 模式来处理普通的回合间 延续 和工具结果。

要继续一次运行，请再发送一次 `response.create` ，其中包含：

- `previous_response_id` 设置为上一个响应 ID。
- `input` 仅包含新增项（例如，工具输出和下一条用户消息）。

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();
const model = "gpt-6-astra";

const tools = [
  {
    type: "function",
    name: "get_test_results",
    description: "Return a local demo test result.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
  },
];

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

```ruby
require "async"
require "openai"
require "json"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

tools = [
  {
    type: "function",
    name: "get_test_results",
    description: "Read the demo test results.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    strict: true
  }
]

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: "Find the failing test and suggest a fix.", tools: tools,
        tool_choice: {
          type: "function",
          name: "get_test_results"
        }, parallel_tool_calls: false
      )
      response = wait_for_response(connection)
      call = response.output.grep(OpenAI::Responses::ResponseFunctionToolCall).first
      unless call && call.name == "get_test_results" && JSON.parse(call.arguments) == {}
        raise "Expected a get_test_results call with no arguments"
      end

      # Demo data. Replace this with your test runner.
      result = {
        test: "test_fizz_buzz",
        failure: 'Expected "FizzBuzz" for 15, got "Fizz".'
      }
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        previous_response_id: response.id,
        input: [
          {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.generate(result)
          },
          {
            role: "user",
            content: "Now optimize it."
          }
        ],
        tools: tools, tool_choice: "none"
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


## 延续的工作原理

WebSocket 模式使用与 HTTP 模式相同的 `previous_response_id` 链接语义，但在活跃 socket 上增加了一条更低延迟的 延续 路径。

在活跃的 WebSocket 连接上，服务会在一个连接本地的内存缓存中保留最近的 previous-response 状态。当你使用 `stream_id`，时，每个 lane 都会保留其最新的缓存响应，因此在该 lane 中从最新响应继续会很快，因为服务可以复用连接本地的状态。由于服务只在内存中保留 previous-response 状态而不会写入磁盘，你可以以兼容 `store=false` 和 Zero Data Retention（ZDR）的方式使用 WebSocket 模式。

如果某个 `previous_response_id` 不在内存缓存中，则行为取决于你是否存储了响应：

- 使用 `store=true`，时，服务可能会在可用时从持久化状态中恢复较早的响应 ID。延续仍然可以工作，但会失去内存中的延迟优势。
- 使用 `store=false` （包括 ZDR）时，则不存在持久化回退。如果该 ID 未被缓存，请求将返回 `previous_response_not_found`.

如果同车道的 延续返回一个 `4xx` 或 `5xx`,服务会从连接本地缓存中淘汰所引用的 `previous_response_id` 。返回错误的跨车道分叉会保留共享的父级,以便源车道可以继续。

## 压缩与创建新响应

如果你正在使用压缩功能，则存在两种不同的 延续 模式：

### 服务端压缩（`context_management`)

当你启用服务端压缩（`context_management` 并附带 `compact_threshold`），压缩会在正常的 `/responses` 生成过程中进行。在 WebSocket 模式下，你继续按通常的方式操作即可：发送下一个 `response.create` ，其中附带最新的 `previous_response_id` ，并且只包含新的输入项。

### 独立运行 `/responses/compact`

独立 [`/responses/compact` 端点](https://developers.openai.com/api/reference/resources/responses/methods/compact) 返回一个新的压缩输入窗口，而不是响应 ID。压缩完成后，在你的 WebSocket 连接上使用压缩后的窗口作为 `input` （加上后续的用户/工具项）。

省略 `previous_response_id` 或将其设置为 `null`。即可启动新的链。直接传入压缩后的输出，不要对返回的窗口进行裁剪。

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

```ruby
require "async"
require "openai"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

client = OpenAI::Client.new
compacted = client.responses.compact(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: "Find the failing test."
    }
  ]
)
next_input = compacted.output.map(&:to_h)
next_input << {
  role: :user,
  content: "Continue from here."
}

Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: next_input, tools: []
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


## 并行运行对话

你可以在同一连接上使用 `stream_id` 参数来维持并行对话。使用不同的 `response.create` 值连续发送独立的事件。 `stream_id` 服务器可以在同一连接上并发运行它们。它们的事件可能会交错，因此请保持一个读取循环，并根据 `stream_id`.

一个 `stream_id` 为一条 WebSocket 连接上的有序通道命名。请保持 `stream_id` 和 `previous_response_id` 相互独立：

- `stream_id` 控制事件的流向，以及请求按先进先出顺序运行。
- `previous_response_id` 控制对话的血缘关系。

这种分离解锁了两种有用的模式。

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

具有相同 `stream_id` 的请求保持先进先出，且不会重叠。具有不同 `stream_id` 值的请求可以并发执行。

### 每个连接的限制

- 一个连接最多可以同时拥有 16 个在途响应，分布在具名和默认通道中。连接会继续接收更多 `response.create` 事件并将其排队，直到某个进行中的响应结束。
- 一个连接最多接受 32 个不同的具名 `stream_id` 值。隐式的默认通道不计入此具名流限制。达到限制后，请复用现有 `stream_id` 的连接，或打开一个新连接。

### 将对话分叉到新流

若要从已完成的响应分叉，请将其 ID 作为 `previous_response_id` 配合新的 `stream_id`。发送。只要该响应仍然可用，新流就会继承其上下文，而原始流可以继续运行。分叉开始后，由于两个分支使用不同的流 ID，它们可以并发执行。

使用 `store=false` （包括 ZDR）时，跨 lane 分叉依赖父响应保留在连接本地缓存中。如果在源 lane 推进或失败时，分叉进入排队，父响应可能在分叉开始前被逐出，此时分叉会返回 `previous_response_not_found`。在推进源 lane 之前，请等待分叉 lane 发出 `response.in_progress` ，或者将 `previous_response_id` 设置为 `null` 并重放完整的输入上下文后重试。

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

复用不附带 `stream_id` 的 `previous_response_id` 会启动一个新的响应，而不是延续当前会话。

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

并行运行多个对话，然后从其中一个分叉

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();

const latestResponseIdByLane = new Map();

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

```ruby
require "async"
require "openai"
require "json"

def send_create(connection, stream_id, text, previous_response_id = nil)
  payload = {
    stream_id: stream_id,
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        role: "user",
        content: text
      }
    ]
  }
  payload[:previous_response_id] = previous_response_id if previous_response_id
  connection.response.create(**payload)
end

def read_event(connection)
  event = connection.receive or raise "Connection closed before all responses finished"
  if ["response.failed", "response.incomplete", "error"].include?(event.type.to_s)
    raise "Response failed: #{event.to_json}"
  end

  event
end

def drain_responses(connection, lanes, latest_ids)
  remaining = lanes.dup
  until remaining.empty?
    event = read_event(connection)
    next unless event.type.to_s == "response.completed"

    lane = event.stream_id
    next unless remaining.include?(lane)

    latest_ids[lane] = event.response.id
    remaining.delete(lane)
  end
end

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      latest_ids = {}
      send_create(connection, "planner", "Draft a deployment plan for a stateless API service.")
      send_create(connection, "research", "List common deployment risks for a stateless API service.")
      drain_responses(connection, ["planner", "research"], latest_ids)
      parent_id = latest_ids.fetch("planner")
      send_create(connection, "critic", "Find gaps in this deployment plan.", parent_id)
      # Let the fork load its parent before advancing the original lane's cache.
      loop do
        event = read_event(connection)
        break if event.type.to_s == "response.in_progress" && event.stream_id == "critic"
      end
      send_create(connection, "planner", "Add rollback and monitoring steps.", parent_id)
      drain_responses(connection, ["critic", "planner"], latest_ids)
      puts(JSON.generate(latest_ids))
    end
  end
end
```


一个 `stream_id` 必须为 1–256 个字符，且只能包含字母、数字、下划线（`_`）、连字符（`-`）和句点（`.`）。仅在 WebSocket `response.create` 事件中使用它；不要在 HTTP `POST /v1/responses`.

对于命名流，服务端事件会包含匹配的 `stream_id`，包括终止事件和请求范围内的错误。

如果你省略 `stream_id`，该请求会使用一个隐式的默认通道，其事件不包含 `stream_id`。默认通道在其他方面遵循与命名流相同的排序和并发规则。空字符串不是有效的 `stream_id`；请省略该字段以选择默认通道。

## 连接行为与限制

- 每个响应内的事件遵循现有的 Responses 流式事件模型。不同 lane 的事件可以交错出现。
- 具有相同 `stream_id` 的请求按先进先出顺序运行，且不会重叠。不同 lane 上的请求可以并发运行。
- 连接最长持续 60 分钟。达到上限时需重新连接。

## 重连与恢复

当某个连接关闭（或达到 60 分钟上限）时，其连接本地缓存会从所有通道中消失。请新建一个 WebSocket 连接，并使用以下任一模式来恢复每个通道：

1. 如果你存储了先前的响应（`store=true`）并拥有有效的响应 ID，请使用 `previous_response_id` 以及新的输入项延续该通道。
2. 如果你无法延续某个通道（例如， `store=false`/ZDR 或 `previous_response_not_found`），请通过将 `previous_response_id` 设置为 `null` （或省略它）来开启新响应，并为该通道的下一轮发送完整的输入上下文。
3. 如果你使用 `/responses/compact`，压缩了上下文，请将返回的压缩窗口作为该新响应的基础， `input` 然后追加最新的用户/工具项。

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