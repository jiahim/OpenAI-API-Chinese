# Mid-turn steering

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加以下内容获取文档页面的 Markdown 版本： `.md` 以访问页面 URL。

Mid-turn steering 让用户无需等待当前响应完成，即可新增需求或调整方向。

Mid-turn steering 适用于 GPT-6 Astra（`gpt-6-astra`），通过与 Responses API 的 WebSocket 连接提供。GPT-5.6 及更早模型不支持该能力。
  WebSocket 连接接入 响应接口。GPT-5.6 及更早模型不
  支持 steering。

Steering 不会重写已经发送到你的应用的输出、撤销先前的操作，也不会取消已经启动的工具。

有关连接建立和常规传输行为，请参阅 [WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode)。有关确切的事件定义，请参阅 [Responses WebSocket events reference](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送引导消息

使用以下方式启动一个响应 `response.create`。在收到其 `response.created` 事件后，在 `response.steer` 同一连接上发送，使用该响应的 ID 作为 `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

该事件仅接受 `type`, `previous_response_id`,以及 `input`。将 `input` 设置为字符串或包含支持内容类型的用户消息的非空数组。

API 通过以下方式确认已排队的输入 `response.steer.accepted`:

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

接受仅表示输入已排队，并不代表模型已对其进行处理。除非需要来自你应用的工具结果或审批，否则 API 会自动使用你的更新创建一个新的响应 [工具结果或审批](#return-tool-results-or-approval) 来自你的应用。

在创建这个自动 延续 之前，服务端会完成当前的输出项以及任何已在运行的 托管工具 工作。继续读取事件以接收包含你更新的响应；不要再次发送 `response.create`.

如果引导操作中断了原始响应，它会以 `response.incomplete` 和 `incomplete_details.reason: "steered"`。结束。如果原始响应先正常完成，则会保持其已完成状态，并且仍然可以拥有一个引导 延续。

自动延续会继承原始请求的设置。Token 和工具调用限制分别作用于每个响应。

## 运行完整示例

.NET SDK 未提供 Responses WebSocket 客户端，因此本示例没有可用的 C# SDK 变体。

在项目计划运行时更新它

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


该示例在第一个 `response.created` 事件之后发送更新。在你的应用中，当用户提供更新时再发送。新的引导消息使用该 延续 的 ID，一旦收到其 `response.created` 事件。

## 返回工具结果或审批

如果响应需要客户端工具结果或批准，API 会保持引导指令排队。在同一连接上继续执行你常规的工具或批准流程。

例如，原始响应可以通过调用 `get_project_status`。来完成。下面的载荷仅展示相关字段：

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

在原始响应完成后，API 会发送 `response.steer.pending` ，用于仍需要输入的已接受引导指令。其 `required_input` 字段标识了在应用更新之前 API 需要的工具结果或批准：

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

在同一连接上通过 `response.create` 返回所需输入，并设置 `previous_response_id` 为 `resp_1`。不要重复已接受的引导指令。显式的 `response.create` 使用其自己的工具、指令和其他设置。

此 JSONC 示例中的注释展示了服务器添加排队更新的位置：

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

你无需等待 `response.steer.pending` 即可返回工具结果。如果服务器已经收到匹配的 `response.create`，它可以不先发送此通知就直接继续。

## 处理失败与断开连接

`response.steer.failed` 表示 API 未通过引导处理输入，并且在之后也不会自动应用它。该事件返回原始 `input` 和 `previous_response_id` 下方的 `steer`，字段,并附带一个 `error` 用于描述失败原因的对象。

可通过以下方式跟踪已接受的提交： `steer.id`。后续失败会使用相同的 ID。

常见错误代码:

- `invalid_input`：仅使用支持的事件字段和用户消息输入。
- `steering_not_supported`：模型、请求参数或两者可能与引导不兼容。
- `response_not_found`：目标响应必须仍然在同一个 WebSocket 连接上可用。
- `too_many_pending_steers`：待处理的引导输入过多。使用 `response.create`；返回所有必需的工具结果或审批；否则，请在提交更多内容之前等待自动延续。请勿重新发送已被接受的引导。

排队的 steering 输入仅存在于当前连接中,不会与原始响应一同存储。请记录你发送的 steering 输入,并在重放之前将其与响应事件和历史记录进行比对。不要假设挂起的 steering 在断开连接后仍然存在。参见 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).