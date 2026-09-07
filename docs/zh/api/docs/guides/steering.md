# Mid-turn steering

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

中途引导允许用户在响应完成前补充需求或改变方向。

中途引导可在 GPT-6 Astra（`gpt-6-astra`）上通过
  到 Responses API 的 WebSocket 连接使用。GPT-5.6 及更早模型不
  支持引导。

引导不会重写已经发送到应用端的输出、撤销先前的操作，或取消已经启动的工具。

有关连接设置和通用传输行为，请参阅 [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)。具体事件定义请参阅 [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送引导消息

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

Before creating this automatic 延续, the server finishes the current output item and any 托管工具 work already running. Keep reading events to receive the response with your update; do not send another `response.create`.

If steering interrupts the original response, it ends with `response.incomplete` and `incomplete_details.reason: "steered"`. If the original response finishes normally first, it keeps its completed status and can still have a steering 延续.

Automatic continuations inherit the original request settings. Token and tool-call limits apply separately to each response.

## 运行完整示例

在运行时更新项目计划

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


该示例在第一个 `response.created` 事件之后发送更新。在你的应用中，当用户提供更新时发送。在新的延续事件到达后，使用其 ID 进行新的引导 `response.created` 事件到达后。

## 返回工具结果或审批

如果响应需要客户端工具结果或审批，API 会让转向指令继续排队。在同一连接上继续你正常的工具或审批流程。

例如，原始响应可以通过调用 `get_project_status`。来完成。下面的 payload 只展示相关字段：

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

在原始响应完成后，API 会发送 `response.steer.pending` ，用于仍需要输入的已接受转向指令。其 `required_input` 字段标识 API 在应用该更新前所需要的工具结果或审批：

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

通过 `response.create` 在同一连接上返回所需输入，并将 `previous_response_id` 设为 `resp_1`。不要重复已接受的转向指令。一次显式的 `response.create` 会使用其自己的工具、指令和其他设置。

本 JSONC 示例中的注释标出了服务端添加排队更新的位置：

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

在返回工具结果之前，你无需等待 `response.steer.pending` 。如果服务端已经收到匹配的 `response.create`，它可以直接继续，而无需先发送此通知。

## 处理故障与断连

`response.steer.failed` 意味着 API 未对该输入应用引导（steering），后续也不会自动应用。该事件会返回原始的 `input` and `previous_response_id` 在 `steer`，下，并附带一个 `error` 对象，用于描述失败情况。

按以下方式追踪已接受的提交： `steer.id`。后续失败将使用相同的 ID。

常见错误代码：

- `invalid_input`：仅使用支持的事件字段和用户消息输入。
- `steering_not_supported`：模型、请求参数或两者可能与 steering 不兼容。
- `response_not_found`：目标响应必须仍可在同一 WebSocket 连接上访问。
- `too_many_pending_steers`：有过多的 steering 输入处于待处理状态。使用以下方式返回任何必需的工具结果或批准 `response.create`；否则，请在提交更多内容之前等待自动 延续。请勿重新发送已被接受的 steering。

排队的引导输入仅存在于当前连接中，不会随原始响应一起存储。请记录你发送的引导输入，并在重放前将其与响应事件及历史记录进行比较。不要假设挂起的引导输入在断开连接后仍然有效。参见 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).