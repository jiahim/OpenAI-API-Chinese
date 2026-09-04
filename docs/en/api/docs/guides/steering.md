# Mid-turn steering

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Mid-turn steering lets users add requirements or change direction without waiting for a response to finish.

Mid-turn steering is available with GPT-6 Astra (`gpt-6-astra`) over a
  WebSocket connection to the Responses API. GPT-5.6 and earlier models do not
  support steering.

Steering does not rewrite output already sent to your application, undo earlier actions, or cancel tools that have already started.

For connection setup and general transport behavior, see [WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode). For exact event definitions, see the [Responses WebSocket events reference](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## Send a steering message

Start a response with `response.create`. After receiving its `response.created` event, send `response.steer` on the same connection, using that response's ID as `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

The event accepts only `type`, `previous_response_id`, and `input`. Set `input` to a string or a nonempty array of user messages with supported content types.

The API acknowledges queued input with `response.steer.accepted`:

```json
{
  "type": "response.steer.accepted",
  "sequence_number": 4,
  "steer": {
    "id": "steer_0123456789abcdef0123456789abcdef",
    "previous_response_id": "resp_1"
  }
}
```

Acceptance means the input is queued, not that the model has acted on it. The API automatically creates a new response with your update unless it needs a [tool result or approval](#return-tool-results-or-approval) from your application.

Before creating this automatic continuation, the server finishes the current output item and any hosted tool work already running. Keep reading events to receive the response with your update; do not send another `response.create`.

If steering interrupts the original response, it ends with `response.incomplete` and `incomplete_details.reason: "steered"`. If the original response finishes normally first, it keeps its completed status and can still have a steering continuation.

Automatic continuations inherit the original request settings. Token and tool-call limits apply separately to each response.

## Run a complete example

Update a project plan while it runs

```javascript
// Set OPENAI_API_KEY before running this example.
// Install the SDK and WebSocket transport: npm install openai ws

import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();
const ws = new ResponsesWS(client, {
  handshakeTimeout: 10_000,
});
let initialResponseId = "";
let successorResponseId = "";
let timeout;

try {
  const output = await new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for the steered response."));
      ws.close();
    }, 120_000);
    ws.once("error", reject);
    ws.once("close", () => {
      reject(
        new Error("Connection closed before the steered response finished.")
      );
    });
    ws.on("event", (event) => {
      try {
        if (event.type === "response.created") {
          if (!initialResponseId) {
            initialResponseId = event.response.id;
            // Simulate a user adding instructions while the response runs.
            ws.send({
              type: "response.steer",
              previous_response_id: initialResponseId,
              input:
                "Keep the scope small enough for one developer to finish in two weeks.",
            });
          } else {
            successorResponseId = event.response.id;
          }
        } else if (
          ["response.steer.failed", "response.failed", "error"].includes(
            event.type
          )
        ) {
          reject(new Error(JSON.stringify(event)));
        } else if (
          event.type === "response.incomplete" &&
          (event.response.id !== initialResponseId ||
            event.response.incomplete_details?.reason !== "steered")
        ) {
          reject(new Error(JSON.stringify(event)));
        } else if (
          event.type === "response.completed" &&
          event.response.id === successorResponseId
        ) {
          let text = "";
          for (const item of event.response.output) {
            if (item.type !== "message") continue;
            for (const part of item.content) {
              if (part.type === "output_text") text += part.text;
            }
          }
          resolve(text);
        }
        // Acceptance only queues the input. Keep reading past the first response.
      } catch (error) {
        reject(error);
      }
    });
    ws.send({
      type: "response.create",
      model: "gpt-6-astra",
      reasoning: { effort: "medium" },
      input: "Draft a project plan for building a task-tracking app.",
    });
  });
  console.log(output);
} finally {
  clearTimeout(timeout);
  ws.close();
}
```

```python
import asyncio

from openai import AsyncOpenAI


async def main():
    client = AsyncOpenAI()
    initial_response_id = None
    successor_response_id = None

    async with client.responses.connect() as connection, asyncio.timeout(120):
        await connection.response.create(
            model="gpt-6-astra",
            reasoning={"effort": "medium"},
            input="Draft a project plan for building a task-tracking app.",
        )
        async for event in connection:
            if event.type == "response.created":
                if initial_response_id is None:
                    initial_response_id = event.response.id
                    # Simulate a user adding instructions while the response runs.
                    await connection.response.steer(
                        previous_response_id=initial_response_id,
                        input="Keep the scope small enough for one developer to finish in two weeks.",
                    )
                else:
                    successor_response_id = event.response.id
            elif event.type in {"response.steer.failed", "response.failed", "error"}:
                raise RuntimeError(event.to_json())
            elif event.type == "response.incomplete":
                response = event.response
                if (
                    response.id != initial_response_id
                    or response.incomplete_details is None
                    or response.incomplete_details.reason != "steered"
                ):
                    raise RuntimeError(event.to_json())
            elif (
                event.type == "response.completed"
                and event.response.id == successor_response_id
            ):
                print(event.response.output_text)
                return
            # Acceptance only queues the input. Keep reading past the first response.
        raise RuntimeError("Connection closed before the steered response finished.")


asyncio.run(main())
```

```csharp
using System.Net.WebSockets;
using System.Text.Json;

// Set OPENAI_API_KEY before running this example.
// ClientWebSocket is built in; no extra package is required.

using ClientWebSocket socket = new();
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
socket.Options.SetRequestHeader("Authorization", $"Bearer {key}");
Uri endpoint = new("wss://api.openai.com/v1/responses");

using CancellationTokenSource timeout = new(TimeSpan.FromSeconds(120));
await socket.ConnectAsync(endpoint, timeout.Token);
string? initialResponseId = null;
string? successorResponseId = null;

await SendAsync(new
{
    type = "response.create",
    model = "gpt-6-astra",
    reasoning = new { effort = "medium" },
    input = "Draft a project plan for building a task-tracking app.",
});

while (true)
{
    using JsonDocument message = await ReceiveAsync();
    JsonElement data = message.RootElement;
    string? eventType = data.GetProperty("type").GetString();
    if (eventType == "response.created")
    {
        string? responseId = data.GetProperty("response").GetProperty("id").GetString();
        if (initialResponseId is null)
        {
            initialResponseId = responseId;
            // Simulate a user adding instructions while the response runs.
            await SendAsync(new
            {
                type = "response.steer",
                previous_response_id = initialResponseId,
                input = "Keep the scope small enough for one developer to finish in two weeks.",
            });
        }
        else
        {
            successorResponseId = responseId;
        }
    }
    else if (eventType is "response.steer.failed" or "response.failed" or "error")
    {
        throw new InvalidOperationException(data.GetRawText());
    }
    else if (eventType == "response.incomplete")
    {
        JsonElement response = data.GetProperty("response");
        if (response.GetProperty("id").GetString() != initialResponseId
            || !response.TryGetProperty("incomplete_details", out JsonElement details)
            || !details.TryGetProperty("reason", out JsonElement reason)
            || reason.GetString() != "steered")
        {
            throw new InvalidOperationException(data.GetRawText());
        }
    }
    else if (eventType == "response.completed"
        && data.GetProperty("response").GetProperty("id").GetString() == successorResponseId)
    {
        foreach (JsonElement item in data.GetProperty("response").GetProperty("output").EnumerateArray())
        {
            if (item.GetProperty("type").GetString() != "message") continue;
            foreach (JsonElement part in item.GetProperty("content").EnumerateArray())
            {
                if (part.GetProperty("type").GetString() == "output_text")
                {
                    Console.Write(part.GetProperty("text").GetString());
                }
            }
        }
        Console.WriteLine();
        break;
    }
    // Acceptance only queues the input. Keep reading past the first response.
}

async Task SendAsync<T>(T data)
{
    byte[] bytes = JsonSerializer.SerializeToUtf8Bytes(data);
    await socket.SendAsync(bytes.AsMemory(), WebSocketMessageType.Text, true, timeout.Token);
}

async Task<JsonDocument> ReceiveAsync()
{
    using MemoryStream message = new();
    byte[] buffer = new byte[8192];
    ValueWebSocketReceiveResult result;
    do
    {
        result = await socket.ReceiveAsync(buffer.AsMemory(), timeout.Token);
        if (result.MessageType == WebSocketMessageType.Close)
        {
            throw new InvalidOperationException(
                "Connection closed before the steered response finished.");
        }
        message.Write(buffer, 0, result.Count);
    } while (!result.EndOfMessage);
    message.Position = 0;
    return await JsonDocument.ParseAsync(message, cancellationToken: timeout.Token);
}
```


The example sends the update after the first `response.created` event. In your application, send it when a user supplies an update. Use the continuation's ID for new steering once its `response.created` event arrives.

## Return tool results or approval

If the response needs a client tool result or approval, the API keeps the steering queued. Continue your normal tool or approval flow on the same connection.

For example, the original response can complete with a call to `get_project_status`. The following payloads show only the relevant fields:

```json
{
  "type": "response.completed",
  "response": {
    "id": "resp_1",
    "status": "completed",
    "output": [
      {
        "type": "function_call",
        "call_id": "call_project",
        "name": "get_project_status",
        "arguments": "{\"project\":\"task-tracker\"}"
      }
    ]
  }
}
```

After the original response completes, the API sends `response.steer.pending` for accepted steering that still needs input. Its `required_input` field identifies the tool results or approvals the API needs before it can apply the update:

```json
{
  "type": "response.steer.pending",
  "sequence_number": 12,
  "steer": {
    "id": "steer_0123456789abcdef0123456789abcdef",
    "previous_response_id": "resp_1"
  },
  "reason": "waiting_for_required_input",
  "required_input": [
    {
      "type": "function_call_output",
      "call_id": "call_project",
      "name": "get_project_status"
    }
  ]
}
```

Return the required input with `response.create` on the same connection, setting `previous_response_id` to `resp_1`. Do not repeat the accepted steering. An explicit `response.create` uses its own tools, instructions, and other settings.

The comments in this JSONC example show where the server adds the queued update:

```jsonc
{
  "type": "response.create",
  "model": "gpt-6-astra",
  "previous_response_id": "resp_1",
  "input": [
    // The server implicitly prepends your accepted steer here:
    // "Keep the scope small enough for one developer to finish in two weeks."
    {
      "type": "function_call_output",
      "call_id": "call_project",
      "output": "Design is complete. Development has not started.",
    },
    {
      "role": "user",
      "content": "Show me the updated plan before starting any work.",
    },
  ],
}
```

You do not need to wait for `response.steer.pending` before returning tool results. If the server has already received a matching `response.create`, it can proceed without sending this notification first.

## Handle failures and disconnects

`response.steer.failed` means the API did not apply the input through steering and will not apply it automatically later. The event returns the original `input` and `previous_response_id` under `steer`, with an `error` object describing the failure.

Track accepted submissions by `steer.id`. A later failure uses the same ID.

Common error codes:

- `invalid_input`: Use only the supported event fields and user message input.
- `steering_not_supported`: The model, request parameters, or both may be incompatible with steering.
- `response_not_found`: The target response must still be available on the same WebSocket connection.
- `too_many_pending_steers`: Too much steering input is pending. Return any required tool results or approvals using `response.create`; otherwise, wait for the automatic continuation before submitting more. Do not resend already accepted steering.

Queued steering input exists only on the current connection; it isn't stored with the original response. Record the steering inputs you send, and compare them with response events and history before replaying them. Do not assume pending steering survived the disconnect. See [WebSocket recovery guidance](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).