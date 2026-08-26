# WebSocket 模式

> 完整的文档索引见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

Responses API 支持 WebSocket 模式，适用于长时间运行、工具调用密集的工作流。除了降低延迟， `stream_id` 还支持 WebSocket 多路复用：一个持久连接可 `/v1/responses` 并行运行多个对话，并可将现有对话分叉到新流上。每轮继续时只需发送新的输入项及 `previous_response_id`.

WebSocket 模式兼容零数据保留（ZDR）和 `store=false`.

## 为何使用 WebSocket 模式

当 工作流 涉及大量模型-工具往返（例如，代理编码或具有重复工具调用的编排循环）时，WebSocket 模式最为有用。

由于连接保持打开状态，且每轮仅发送增量输入，WebSocket 模式降低了每轮 延续 的开销，并改善了长链路的端到端延迟。对于包含 20 次以上工具调用的部署，我们观察到端到端执行速度最高可提升约 40%。

## 连接并创建回复

在 WebSocket 模式下，通过向客户端发送 `response.create` 事件来开启每一轮交互。其负载与常规的 [Responses 创建请求体](https://developers.openai.com/api/reference/resources/responses/methods/create)，相同，但传输特定字段如 `stream` 和 `background` 不会使用。

```python
from websocket import create_connection
import json
import os

ws = create_connection(
    "wss://api.openai.com/v1/responses",
    header=[
        f"Authorization: Bearer {os.environ['OPENAI_API_KEY']}",
    ],
)

ws.send(
    json.dumps(
        {
            "type": "response.create",
            "stream_id": "main",
            "model": "gpt-5.6",
            "store": False,
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Find fizz_buzz()"}],
                }
            ],
            "tools": [],
        }
    )
)
```


客户端可以选择通过发送 `response.create` 配合 `generate: false`。来提前预热请求状态。当你已经知道接下来一轮要发送的工具、指令和/或自定义消息时，这非常有用。 `generate: false` 不会返回模型输出，但会准备请求状态，使下一轮生成的交互可以更快开始。预热请求返回一个响应 ID，你可以通过它进行链接 `previous_response_id`，包括在响应链的后续轮次中。下一节将说明如何使用 `previous_response_id` 和增量输入继续会话。

## 使用增量输入继续

要延续一次运行，请发送另一个 `response.create` 使用：

- `previous_response_id` 设置为先前响应 ID。
- `input` 仅包含新项目（例如，工具输出和下一条用户消息）。

```python
ws.send(
    json.dumps(
        {
            "type": "response.create",
            "stream_id": "main",
            "model": "gpt-5.6",
            "store": False,
            "previous_response_id": "resp_123",
            "input": [
                {
                    "type": "function_call_output",
                    "call_id": "call_123",
                    "output": "tool result",
                },
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Now optimize it."}],
                },
            ],
            "tools": [],
        }
    )
)
```


## 延续的工作方式

WebSocket 模式使用与 HTTP 模式相同的 `previous_response_id` 链式语义，但在活动套接字上增加了低延迟的 延续 路径。

在活动的 WebSocket 连接上，服务会在连接本地的内存缓存中保留最近的先前响应状态。当你在 `stream_id`，时，每个通道会保留其最新的缓存响应，因此从该通道的最新响应继续处理会很快，因为服务可以重用连接本地的状态。由于服务仅在内存中保留先前响应状态且不写入磁盘，你可以使用与 `store=false` 和零数据保留（ZDR）兼容的方式使用 WebSocket 模式。

如果 `previous_response_id` 不在内存缓存中，行为取决于你是否存储响应：

- 使用 `store=true`，时，服务可能在可用时从持久化状态中补全较旧的响应 ID。延续仍可工作，但会失去内存中的延迟优势。
- 使用 `store=false` （包括 ZDR）时，没有持久化的回退。如果 ID 未被缓存，请求将返回 `previous_response_not_found`.

如果同车道延续返回一个 `4xx` 或 `5xx`，服务端会驱逐引用的 `previous_response_id` ，从连接本地缓存中。跨车道分叉如果返回错误，则保留共享父级，以便源车道可以继续。

## 压缩与创建新的响应

如果你正在使用压缩，那么有两种不同的延续模式：

### 服务端压缩（`context_management`)

当你启用服务端压缩（`context_management` 通过 `compact_threshold`），压缩会在正常 `/responses` 生成过程中进行。在 WebSocket 模式下，你按照通常的方式继续：发送下一条 `response.create` 并附带最新的 `previous_response_id` 以及仅新的输入项目。

### 独立 `/responses/compact`

独立 [`/responses/compact` 端点](https://developers.openai.com/api/reference/resources/responses/methods/compact) 返回一个新的压缩输入窗口，而非响应 ID。压缩后，在你的 WebSocket 连接上使用压缩后的窗口创建新的响应，作为 `input` （加上后续的用户/工具项）。

通过省略 `previous_response_id` 或将其设置为 `null`。来开启新链。直接传递压缩后的输出；不要修剪返回的窗口。

```python
# Compact your current window (HTTP call)
compacted = client.responses.compact(
    model="gpt-5.6",
    input=long_input_items_array,
)

# Start a new response on the WebSocket using the compacted window
ws.send(
    json.dumps(
        {
            "type": "response.create",
            "stream_id": "main",
            "model": "gpt-5.6",
            "store": False,
            "input": [
                *compacted.output,
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Continue from here."}],
                },
            ],
            "tools": [],
        }
    )
)
```


## 并行运行对话

你可以通过 `stream_id` 参数在同一连接上维持并行对话。发送独立的 `response.create` 事件需要连续发送，并带有不同的 `stream_id` 值。服务器可以在同一连接上并发运行它们。它们的事件可能会交错，因此保持一个读取循环，并根据 `stream_id`.

A `stream_id` 为单个 WebSocket 连接上的有序通道命名。保持 `stream_id` 和 `previous_response_id` 分开：

- `stream_id` 控制事件的去向以及哪些请求以先进先出的顺序运行。
- `previous_response_id` 控制对话的血统。

这种分离开启了两种有用的模式。

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

具有相同 `stream_id` 的请求保持先进先出且不重叠。具有不同 `stream_id` 值的请求可以并发运行。

### 每个连接的限制

- 一个连接在命名通道和默认通道上最多可以有 16 个进行中的响应。该连接会接受更多 `response.create` 事件并将其排队，直到有活动的响应完成。
- 一个连接最多接受 32 个不同的命名 `stream_id` 值。隐式的默认通道不计入此命名流限制。达到限制后，请复用现有的 `stream_id` 或打开新连接。

### 将对话分支到新流中

要从已完成的响应分支，请将其 ID 发送为 `previous_response_id` 并搭配新的 `stream_id`。虽然该响应仍然可用，但新流会继承其上下文，原始流可以继续运行。分叉开始后，两个分支可以并发运行，因为它们使用不同的流 ID。

使用 `store=false` （包括 ZDR）时，跨通道分叉取决于父响应保留在连接本地缓存中。如果分叉排队而源通道推进或失败，父响应可能在分叉开始前被逐出，分叉将返回 `previous_response_not_found`。等待分叉通道发出 `response.in_progress` 后再推进源通道，或使用 `previous_response_id` 设置为 `null` 进行重试并重放完整输入上下文。

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

重用 `stream_id` 而不带 `previous_response_id` 会开始一个新响应；它不会继续对话。

关键调用如下：

```text
# One socket, two independent conversations.
send_create("planner", "Draft a deployment plan.")
send_create("research", "List deployment risks.")

# Fork the planner response, then continue the original branch in parallel.
send_create(
    "critic",
    "Find gaps in this plan.",
    previous_response_id=planner_response_id,
)
send_create(
    "planner",
    "Add rollback steps.",
    previous_response_id=planner_response_id,
)
```

### 完整示例

并行运行多个对话，然后分叉其中一个

```python
import json
import os

from websocket import create_connection

ws = create_connection(
    "wss://api.openai.com/v1/responses",
    header=[f"Authorization: Bearer {os.environ['OPENAI_API_KEY']}"],
)

latest_response_id_by_lane = {}


def send_create(stream_id, text, previous_response_id=None):
    payload = {
        "type": "response.create",
        "stream_id": stream_id,
        "model": "gpt-5.6",
        "store": False,
        "input": [
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": text}],
            }
        ],
    }
    if previous_response_id is None:
        previous_response_id = latest_response_id_by_lane.get(stream_id)
    if previous_response_id:
        payload["previous_response_id"] = previous_response_id
    ws.send(json.dumps(payload))


def drain_until_complete(expected_stream_ids):
    completed = set()
    while completed != expected_stream_ids:
        event = json.loads(ws.recv())
        stream_id = event.get("stream_id")
        event_type = event.get("type")

        if event_type == "error" and stream_id is None:
            raise RuntimeError(f"connection error: {event}")
        if stream_id not in expected_stream_ids:
            continue

        if event_type == "response.completed":
            latest_response_id_by_lane[stream_id] = event["response"]["id"]
            completed.add(stream_id)
        elif event_type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(f"lane {stream_id} failed: {event}")


# 1. Run two independent conversations in parallel.
send_create("planner", "Draft a deployment plan for a stateless API service.")
send_create("research", "List common deployment risks for a stateless API service.")
drain_until_complete({"planner", "research"})

# 2. Fork the planner conversation and continue the original branch in parallel.
planner_response_id = latest_response_id_by_lane["planner"]
send_create(
    "critic",
    "Find gaps in this deployment plan.",
    previous_response_id=planner_response_id,
)
send_create(
    "planner",
    "Add rollback and monitoring steps to the plan.",
    previous_response_id=planner_response_id,
)
drain_until_complete({"critic", "planner"})

ws.close()
```


A `stream_id` 必须为 1–256 个字符，且只能包含字母、数字、下划线 (`_`)、连字符 (`-`) 和句点 (`.`)。仅在 WebSocket `response.create` 事件中使用；请勿将其包含在 HTTP `POST /v1/responses`.

对于命名流，服务器事件包括匹配的 `stream_id`，包括终止事件和请求范围内的错误。

如果省略 `stream_id`，则请求使用隐式默认通道，且其事件不包含 `stream_id`。默认通道在其他方面遵循与命名流相同的排序和并发规则。空字符串不是有效的 `stream_id`；省略该字段以选择默认通道。

## 连接行为与限制

- 每个响应中的事件遵循现有的 Responses 流式事件模型。来自不同通道的事件可以交错。
- 具有相同 `stream_id` 的请求按先入先出顺序执行，且不会重叠。不同通道上的请求可以并发执行。
- 连接最长持续 60 分钟。达到限制时重新连接。

## 重新连接并恢复

当连接关闭（或达到 60 分钟限制）时，其连接本地缓存会对每条通道消失。打开新的 WebSocket 连接，并使用以下模式之一恢复每条通道：

1. 如果你存储了先前的响应（`store=true`）且拥有有效的响应 ID，则使用 `previous_response_id` 和新的输入项继续该对话线。
2. 如果你无法继续对话线（例如， `store=false`/ZDR 或 `previous_response_not_found`），则通过设置 `previous_response_id` 为 `null` （或省略它）并发送该对话线下一轮的完整输入上下文来开始新响应。
3. 如果你使用 `/responses/compact`，压缩了上下文，则将返回的压缩窗口作为新响应的基础 `input` ，然后附加最新的用户/工具项。

## 需要处理的错误

当服务器可以将错误与具名通道关联时，错误事件会包含 `stream_id`。请求范围的错误发生后，其他通道可以继续执行。

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

- [会话状态](https://developers.openai.com/api/docs/guides/conversation-state)
- [流式 API 响应](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Responses 流式事件参考](https://developers.openai.com/api/reference/resources/responses)
- [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events)