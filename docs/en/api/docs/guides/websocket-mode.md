# WebSocket Mode

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The Responses API supports a WebSocket mode for long-running, tool-call-heavy workflows. Beyond lowering latency, `stream_id` enables WebSocket multiplexing: one persistent connection to `/v1/responses` can run parallel conversations and fork an existing conversation onto a new stream. Continue each turn by sending only new input items plus `previous_response_id`.

WebSocket mode is compatible with both Zero Data Retention (ZDR) and `store=false`.

## Why use WebSocket mode

WebSocket mode is most useful when a workflow involves many model-tool round trips (for example, agentic coding or orchestration loops with repeated tool calls).

Because the connection stays open and each turn sends only incremental input, WebSocket mode reduces per-turn continuation overhead and improves end-to-end latency across long chains. For rollouts with 20+ tool calls, we have seen up to roughly 40% faster end-to-end execution.

## Connect and create responses

In WebSocket mode, start each turn by sending a `response.create` event from the client. The payload mirrors the normal [Responses create body](https://developers.openai.com/api/reference/resources/responses/methods/create), except that transport-specific fields like `stream` and `background` are not used.

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


Clients can optionally warm up request state by sending `response.create` with `generate: false`. This is useful when you already know the tools, instructions, and/or custom messages you plan to send with an upcoming turn. `generate: false` does not return a model output, but prepares request state so the next generated turn can start faster. The warmup request returns a response ID that you can chain from with `previous_response_id`, including on later turns in a response chain. The next section explains how to continue a session using `previous_response_id` and incremental inputs.

## Continue with incremental inputs

To continue a run, send another `response.create` with:

- `previous_response_id` set to the prior response ID.
- `input` containing only new items (for example, tool outputs and the next user message).

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


## How continuation works

WebSocket mode uses the same `previous_response_id` chaining semantics as HTTP mode, but it adds a lower-latency continuation path on the active socket.

On an active WebSocket connection, the service keeps recent previous-response state in a connection-local in-memory cache. When you use `stream_id`, each lane keeps its latest cached response, so continuing from the latest response in that lane is fast because the service can reuse connection-local state. Because the service retains previous-response state only in memory and does not write it to disk, you can use WebSocket mode in a way that is compatible with `store=false` and Zero Data Retention (ZDR).

If a `previous_response_id` is not in the in-memory cache, behavior depends on whether you store responses:

- With `store=true`, the service may hydrate older response IDs from persisted state when available. Continuation can still work, but it loses the in-memory latency benefit.
- With `store=false` (including ZDR), there is no persisted fallback. If the ID is uncached, the request returns `previous_response_not_found`.

If a same-lane continuation returns a `4xx` or `5xx`, the service evicts the referenced `previous_response_id` from the connection-local cache. A cross-lane fork that returns an error preserves the shared parent so the source lane can continue.

## Compaction and creating new responses

If you are using compaction, there are two different continuation patterns:

### Server-side compaction (`context_management`)

When you enable server-side compaction (`context_management` with `compact_threshold`), compaction happens during normal `/responses` generation. In WebSocket mode, you continue the same way you normally do: send the next `response.create` with the latest `previous_response_id` and only new input items.

### Standalone `/responses/compact`

The standalone [`/responses/compact` endpoint](https://developers.openai.com/api/reference/resources/responses/methods/compact) returns a new compacted input window, not a response ID. After compaction, create a new response on your WebSocket connection using the compacted window as `input` (plus the next user/tool items).

Start a new chain by omitting `previous_response_id` or setting it to `null`. Pass the compacted output as-is; do not prune the returned window.

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


## Run conversations in parallel

You can maintain parallel conversations on the same connection using the `stream_id` parameter. Send independent `response.create` events back-to-back with different `stream_id` values. The server can run them concurrently on one connection. Their events can interleave, so keep one reader loop and route each event by `stream_id`.

A `stream_id` names an ordered lane on one WebSocket connection. Keep `stream_id` and `previous_response_id` separate:

- `stream_id` controls where events go and which requests run in first-in, first-out order.
- `previous_response_id` controls conversation lineage.

That separation unlocks two useful patterns.

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

Requests with the same `stream_id` stay first-in, first-out and do not overlap. Requests with different `stream_id` values can run concurrently.

### Limits per connection

- A connection can have up to 16 active, in-flight responses across named and default lanes. The connection accepts more `response.create` events and queues them until an active response finishes.
- A connection accepts up to 32 distinct named `stream_id` values. The implicit default lane does not count toward this named-stream limit. Reuse an existing `stream_id` or open a new connection after reaching the limit.

### Fork a conversation onto a new stream

To branch from a completed response, send its ID as `previous_response_id` with a new `stream_id`. While that response remains available, the new stream inherits its context, and the original stream can keep going. After the fork starts, both branches can run concurrently because they use different stream IDs.

With `store=false` (including ZDR), a cross-lane fork depends on the parent remaining in the connection-local cache. If the fork queues while the source lane advances or fails, the parent can be evicted before the fork starts, and the fork returns `previous_response_not_found`. Wait for the fork lane to emit `response.in_progress` before advancing the source lane, or retry with `previous_response_id` set to `null` and replay full input context.

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

Reusing a `stream_id` without `previous_response_id` starts a new response; it does not continue the conversation.

The key calls look like this:

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

### Complete example

Run parallel conversations, then fork one

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


A `stream_id` must be 1–256 characters and can contain only letters, numbers, underscores (`_`), hyphens (`-`), and periods (`.`). Use it only in WebSocket `response.create` events; do not include it in HTTP `POST /v1/responses`.

For named streams, server events include the matching `stream_id`, including terminal events and request-scoped errors.

If you omit `stream_id`, the request uses an implicit default lane, and its events do not include `stream_id`. The default lane otherwise follows the same ordering and concurrency rules as named streams. An empty string is not a valid `stream_id`; omit the field to select the default lane.

## Connection behavior and limits

- Events within each response follow the existing Responses streaming event model. Events from different lanes can interleave.
- Requests with the same `stream_id` run in first-in, first-out order and don't overlap. Requests on different lanes can run concurrently.
- Connections last up to 60 minutes. Reconnect at the limit.

## Reconnect and recover

When a connection closes (or hits the 60-minute limit), its connection-local cache disappears for every lane. Open a new WebSocket connection and recover each lane with one of these patterns:

1. If you stored a prior response (`store=true`) and have a valid response ID, continue that lane with `previous_response_id` and new input items.
2. If you cannot continue a lane (for example, `store=false`/ZDR or `previous_response_not_found`), start a new response by setting `previous_response_id` to `null` (or omitting it) and send the full input context for that lane's next turn.
3. If you compacted context with `/responses/compact`, use the returned compacted window as the base `input` for that new response, then append the latest user/tool items.

## Errors to handle

When the server can associate an error with a named lane, the error event includes `stream_id`. Other lanes can continue after a request-scoped error.

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

## Related guides

- [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state)
- [Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Responses streaming events reference](https://developers.openai.com/api/reference/resources/responses)
- [Responses WebSocket events reference](https://developers.openai.com/api/reference/resources/responses/websocket-events)