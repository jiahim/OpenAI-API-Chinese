# WebSocket Mode

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

Responses API支持用于长时间运行、工具调用密集型工作流的 WebSocket 模式。除了降低延迟之外， `stream_id` 还支持 WebSocket 多路复用：通过一条到 `/v1/responses` 的持久连接，可以并行运行多个对话，并将已有对话分叉到新的流上。每个回合只需发送新增的输入项以及 `previous_response_id`.

WebSocket 模式兼容零数据保留 (ZDR) 和 `store=false`.

## 为什么要使用 WebSocket 模式

当 工作流 涉及大量模型与工具之间的往返调用时（例如智能体编码或需要反复调用工具的编排循环），WebSocket 模式最为适用。

由于连接保持打开状态，且每一轮只发送增量输入，WebSocket 模式能够降低每轮 延续 的开销，并改善长链路下的端到端延迟。在包含 20 次以上工具调用的运行场景中，我们观察到端到端执行速度最高可提升约 40%。

## 连接并创建响应

在 WebSocket 模式下，每一轮开始时由客户端发送一个 `response.create` 事件。该负载与普通的 [Responses create 请求体](https://developers.openai.com/api/reference/resources/responses/methods/create)，一致，只是像 `stream` 和 `background` 这类传输相关的字段不会被使用。

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


客户端可以通过发送 `response.create` 来可选地预热请求状态， `generate: false`。并在请求中附带相关字段。当你已经知道即将发送的轮次中要使用的工具、指令和/或自定义消息时，这非常有用。 `generate: false` 不会返回模型输出，但会准备好请求状态，以便下一轮生成可以更快开始。预热请求会返回一个响应 ID，你可以使用 `previous_response_id`，链接该 ID，包括在响应链后续的轮次中。下一节将介绍如何使用 `previous_response_id` 和增量输入来继续一个会话。

## 使用增量输入继续

若要延续一次运行，请发送另一个 `response.create` ，参数如下：

- `previous_response_id` 设置为上一条响应 ID。
- `input` 仅包含新项（例如，工具输出和下一条用户消息）。

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


## 延续的工作原理

WebSocket 模式使用与 HTTP 模式相同的 `previous_response_id` 链接语义,但它在活动 socket 上增加了一条更低延迟的延续路径。

在活动的 WebSocket 连接上,服务会将最近的 previous-response 状态保存在一个连接本地的内存缓存中。当你使用 `stream_id`，时,每个 lane 会保留其最新的缓存响应,因此在该 lane 中从最新响应继续会非常快,因为服务可以复用连接本地的状态。由于服务仅在内存中保留 previous-response 状态而不会将其写入磁盘,因此你可以以兼容 `store=false` 和 Zero Data Retention (ZDR) 的方式使用 WebSocket 模式。

如果一个 `previous_response_id` 不在内存缓存中,行为取决于你是否存储响应:

- 使用 `store=true`,服务可在可用时从持久化状态中水合较旧的响应 ID。延续仍然有效,但会失去内存中的延迟优势。
- 使用 `store=false` (包括 ZDR),不存在持久化回退。如果该 ID 未被缓存,请求将返回 `previous_response_not_found`.

如果同一通道的延续返回 a `4xx` 或 `5xx`，服务会从连接本地缓存中淘汰所引用的 `previous_response_id` 。返回错误的跨通道分叉会保留共享父项，以便源通道可以继续执行。

## 压缩与创建新响应

如果你正在使用压缩，则有两种不同的延续模式：

### 服务端压缩 (`context_management`)

当你启用服务端压缩（`context_management` 来可选地预热请求状态， `compact_threshold`）时，压缩会在正常的 `/responses` 生成过程中进行。在 WebSocket 模式下，你仍然按照平时的方式继续操作：发送下一个 `response.create` ，附带最新的 `previous_response_id` 以及仅包含新的输入项。

### Standalone `/responses/compact`

独立 [`/responses/compact` endpoint](https://developers.openai.com/api/reference/resources/responses/methods/compact) 返回一个已压缩的新输入窗口，而不是响应 ID。压缩后，在你的 WebSocket 连接上使用压缩后的窗口创建一个新响应 `input` （以及后续的用户/工具项）。

通过省略 `previous_response_id` 或将其设置为 `null`。来开启新链路。直接传入压缩后的输出，不要裁剪返回的窗口。

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

你可以使用以下参数在同一连接上维持并行的对话 `stream_id` 参数。发送独立的 `response.create` 事件，使其以不同的 `stream_id` 值连续返回。服务器可以在同一连接上并发运行它们。它们的事件可能会交错，因此请保持单个读取循环，并按以下方式路由每个事件： `stream_id`.

一个 `stream_id` 为单个 WebSocket 连接上的有序通道命名。请将以下两项保持 `stream_id` 和 `previous_response_id` 分开：

- `stream_id` 控制事件去向以及哪些请求按先进先出顺序执行。
- `previous_response_id` 控制会话的归属关系。

这种分离解锁了两种有用的模式。

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

具有相同 `stream_id` 的请求保持先进先出且不会重叠。具有不同 `stream_id` 值的请求可以并发运行。

### Limits per connection

- 一个连接可以在命名和默认通道上同时拥有最多 16 个处于活动状态、进行中的响应。连接接受更多 `response.create` 事件并将其放入队列，直到活动的响应完成。
- 一个连接最多接受 32 个不同的命名 `stream_id` 值。隐式默认通道不计入此命名流限制。达到限制后，复用现有 `stream_id` 或打开一个新连接。

### 将对话分叉到新流

要从已完成的响应分支时，将其 ID 作为 `previous_response_id` 与新的 `stream_id`。一起发送。只要该响应仍然可用，新流就会继承其上下文，而原始流可以继续进行。分支开始后，两条分支可以并发运行，因为它们使用不同的流 ID。

使用 `store=false` （包括 ZDR）时，跨通道分支依赖于父节点保持在连接本地缓存中。如果在源通道推进或失败时分支进入排队，父节点可能在分支开始前被逐出，分支将返回 `previous_response_not_found`。在推进源通道之前，等待分支通道发出 `response.in_progress` ，或使用 `previous_response_id` 设置为 `null` 进行重试，并重放完整的输入上下文。

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

重用 `stream_id` 而不使用 `previous_response_id` 会启动一个新响应，不会延续对话。

关键调用如下所示：

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

并行运行对话，然后分叉其中一条

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


一个 `stream_id` 长度必须为 1–256 个字符，且只能包含字母、数字、下划线（`_`）、连字符（`-`）和句点（`.`）。仅在 WebSocket `response.create` 事件中使用它；不要在 HTTP `POST /v1/responses`.

对于命名流，服务端事件包含匹配的 `stream_id`，包括终止事件和请求范围内的错误。

如果省略 `stream_id`，则请求使用一个隐式的默认通道，其事件不包含 `stream_id`。默认通道在其他方面遵循与命名流相同的排序和并发规则。空字符串不是有效的 `stream_id`；请省略该字段以选择默认通道。

## 连接行为与限制

- 每个响应内的事件遵循现有的 Responses 流式事件模型。不同通道上的事件可以交错出现。
- 具有相同 `stream_id` 的请求按先进先出顺序运行，并且不会重叠。不同通道上的请求可以并发运行。
- 连接最长持续 60 分钟。在达到上限时请重新连接。

## 重连与恢复

当连接关闭（或达到 60 分钟限制）时，该连接的本地缓存会针对每个通道一并消失。可使用以下任一模式新建 WebSocket 连接并恢复每个通道：

1. 如果你存储了之前的响应（`store=true`）并拥有有效的响应 ID，请使用 `previous_response_id` 以及新的输入项来延续该分支。
2. 如果你无法延续某个分支（例如， `store=false`/ZDR 或 `previous_response_not_found`: `previous_response_id` 设置为 `null` （或省略该字段），并将该分支下一轮所需的完整输入上下文一并发送。
3. 如果你使用 `/responses/compact`，对上下文进行了压缩，请将返回的压缩窗口作为 `input` 新响应的基础，然后追加最新的用户/工具项。

## 需要处理的错误

当服务端能将错误关联到某个具名通道时，错误事件包含 `stream_id`。其他通道在请求范围内的错误后仍可继续。

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