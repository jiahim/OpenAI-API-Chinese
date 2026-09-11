# Mid-turn steering

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

Mid-turn steering 让用户能够在响应完成之前追加需求或调整方向。

Mid-turn steering 可在 GPT-6 Astra（`gpt-6-astra`）上通过
  到 Responses API 的 WebSocket 连接使用。GPT-5.6 及更早的模型不支持
  steering。

Steering 不会重写已经发送到应用的输出、撤销先前执行的操作，也无法取消已经开始运行的工具。

关于连接建立方式和通用传输行为，请参阅 [WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode)。关于具体的事件定义，请参阅 [Responses WebSocket events reference](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送引导消息

使用以下方式开启一个响应 `response.create`。收到其 `response.created` 事件后，发送 `response.steer` ，使用该响应的 ID 作为 `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

该事件仅接受 `type`, `previous_response_id`，以及 `input`。设置 `input` 为字符串或包含支持内容类型的用户消息的非空数组。

该 API 通过 `response.steer.accepted`:

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

接受意味着输入已排队，而非模型已对其进行处理。API 会自动创建一个包含你更新的新响应，除非它需要来自你应用的 [工具结果或审批](#return-tool-results-or-approval) 。

在创建此自动 延续之前，服务端会完成当前的输出项以及任何正在运行的 托管工具工作。继续读取事件以接收包含你更新的响应；请勿再发送 `response.create`.

如果转向打断了原始响应，它会以 `response.incomplete` 和 `incomplete_details.reason: "steered"`。结束。如果原始响应先正常完成，则会保持其已完成状态，并且仍然可以有一个转向 延续。

自动延续会继承原始请求的设置。令牌和工具调用限制分别适用于每个响应。

## 运行完整示例

在运行项目计划时更新它

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

```ruby
require "async"
require "async/http/endpoint"
require "async/websocket/client"
require "json"

endpoint = Async::HTTP::Endpoint.parse("wss://api.openai.com/v1/responses", timeout: 10, alpn_protocols: ["http/1.1"])
headers = { "Authorization" => "Bearer #{ENV.fetch("OPENAI_API_KEY")}" }
Sync do |task|
  task.with_timeout(120) do
    Async::WebSocket::Client.connect(endpoint, headers: headers) do |connection|
      connection.write(
        JSON.generate(
          type: "response.create", model: "gpt-6-astra", reasoning: { effort: "medium" },
          input: "Draft a project plan for building a task-tracking app."
        )
      )
      connection.flush
      state = {}
      while (message = connection.read)
        event = JSON.parse(message.to_str)
        response = event["response"]
        case event.fetch("type")
        when "response.created"
          if !state[:initial_id]
            state[:initial_id] = response.fetch("id")
            connection.write(
              JSON.generate(
                type: "response.steer", previous_response_id: state[:initial_id],
                input: "Keep the scope small enough for one developer to finish in two weeks."
              )
            )
            connection.flush
          else
            state[:successor_id] = response.fetch("id")
          end
        when "response.steer.failed", "response.failed", "error"
          raise "Steering failed: #{JSON.generate(event)}"
        when "response.incomplete"
          unless response.fetch("id") == state[:initial_id] && response.dig("incomplete_details", "reason") == "steered"
            raise "Response incomplete: #{JSON.generate(event)}"
          end
        when "response.completed"
          next unless state[:successor_id] && response.fetch("id") == state[:successor_id]

          response.fetch("output").each do |item|
            next unless item["type"] == "message"

            item.fetch("content").each { |part| puts(part.fetch("text")) if part["type"] == "output_text" }
          end
          state[:completed] = true
          break
        end
      end
      raise "Connection closed before the steered response finished" unless state[:completed]
    end
  end
end
```


示例在第一个事件之后发送更新。在你的应用中，当用户提供更新时再发送。延续的 ID 用于新方向 `response.created` 延续's ID for new steering once its `response.created` 事件到达后。

## 返回工具结果或批准

如果响应需要客户端工具结果或审批，API 会保持操控指令处于排队状态。在同一连接上继续你正常的工具或审批流程。

例如，原始响应可以以对 `get_project_status`。的调用完成。以下载荷仅展示相关字段：

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

原始响应完成后，API 会发送 `response.steer.pending` ，用于仍需要输入的已接受操控指令。其 `required_input` 字段标识 API 在应用更新之前所需要的工具结果或审批：

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

在同一连接上通过 `response.create` 返回所需输入，并将 `previous_response_id` 设置为 `resp_1`。不要重复已接受的操控指令。一次明确的 `response.create` 使用其自身的工具、指令和其他设置。

此 JSONC 示例中的注释指明了服务端添加排队更新的位置：

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

你在返回工具结果之前无需等待 `response.steer.pending` 。如果服务端已经收到匹配的 `response.create`，它可以先不发送该通知直接继续。

## 处理失败与连接中断

`response.steer.failed` 意味着 API 没有将输入通过引导处理，也不会在之后自动应用它。该事件会返回原始的 `input` 和 `previous_response_id` 于 `steer`，下，并附带一个 `error` 描述失败的对象。

通过以下方式跟踪已接受的提交： `steer.id`。后续失败将使用相同的 ID。

常见错误代码：

- `invalid_input`: 仅使用支持的事件字段和用户消息输入。
- `steering_not_supported`: 模型、请求参数或两者可能与 steering 不兼容。
- `response_not_found`: 目标响应必须仍可在同一 WebSocket 连接上获取。
- `too_many_pending_steers`: 待处理的 steering 输入过多。使用 `response.create`；返回任何必需的工具结果或审批；否则请等待自动的延续，然后再提交更多 steering。请勿重新发送已被接受的 steering。

排队中的引导输入仅存在于当前连接上；它不会随原始响应一起存储。请记录你发送的引导输入，并在重放之前将它们与响应事件和历史记录进行比较。不要假设挂起的引导输入在断开连接后仍然保留。参阅 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).