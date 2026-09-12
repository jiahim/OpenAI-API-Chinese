# Mid-turn steering

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

中途引导让用户可以新增需求或改变方向，而无需等待响应完成。

中途引导适用于 GPT-6 Astra（`gpt-6-astra`）通过
  与 Responses API 的 WebSocket 连接实现。GPT-5.6 及更早的模型不支持
  引导。

引导不会重写已发送到应用的输出、撤销先前的操作，或取消已启动的工具。

有关连接建立和通用传输行为，请参阅 [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)。有关确切的事件定义，请参阅 [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送引导消息

使用以下方式发起响应 `response.create`。在收到其 `response.created` 事件后，在同一连接上发送 `response.steer` ，并将该响应的 ID 用作 `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

该事件仅接受 `type`, `previous_response_id`，以及 `input`。将 `input` 设置为字符串或包含受支持内容类型的非空用户消息数组。

API 通过 `response.steer.accepted`:

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

接受意味着输入已排队，而不是模型已对其进行处理。除非需要来自你的应用的工具结果或审批，否则 API 会自动使用你的更新创建一个新响应。 [工具结果或审批](#return-tool-results-or-approval) 来自你的应用。

在创建此自动 延续 之前，服务端会完成当前的输出项以及任何正在运行的 托管工具 工作。继续读取事件以接收包含你更新的响应；请勿再次发送 `response.create`.

如果引导操作中断了原始响应，它会以 `response.incomplete` 以及 `incomplete_details.reason: "steered"`。结束。如果原始响应先正常完成，则会保持其完成状态，并且仍然可以具有引导 延续。

自动延续会继承原始请求的设置。Token 和工具调用限制分别适用于每个响应。

## 运行完整示例

.NET SDK 没有提供 Responses WebSocket 客户端，因此本示例不提供 C# SDK 变体。

在项目计划运行期间更新它

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
require "openai"

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        model: "gpt-6-astra", reasoning: { effort: "medium" },
        input: "Draft a project plan for building a task-tracking app."
      )
      state = {}
      while (event = connection.receive)
        case event
        when OpenAI::Responses::ResponseCreatedEvent
          response = event.response
          if !state[:initial_id]
            state[:initial_id] = response.id
            connection.send_event(
              type: "response.steer", previous_response_id: state[:initial_id],
              input: "Keep the scope small enough for one developer to finish in two weeks."
            )
          else
            state[:successor_id] = response.id
          end
        when OpenAI::Responses::ResponseSteerFailedEvent, OpenAI::Responses::ResponseFailedEvent, OpenAI::Responses::ResponsesServerEvent::ResponseWsError
          raise "Steering failed: #{event.to_json}"
        when OpenAI::Responses::ResponseIncompleteEvent
          response = event.response
          unless response.id == state[:initial_id] && response.incomplete_details&.reason.to_s == "steered"
            raise "Response incomplete: #{event.to_json}"
          end
        when OpenAI::Responses::ResponseCompletedEvent
          response = event.response
          next unless state[:successor_id] && response.id == state[:successor_id]

          puts(response.output_text)
          state[:completed] = true
          break
        end
      end
      raise "Connection closed before the steered response finished" unless state[:completed]
    end
  end
end
```


该示例在第一次 `response.created` 事件之后发送更新。在你的应用中，可在用户提供更新时发送。使用该 延续 的 ID 在其 `response.created` 事件到达后进行新的引导。

## 返回工具结果或审批

如果响应需要客户端工具结果或审批，API 会保留排队中的引导指令。请在同一连接上继续正常的工具或审批流程。

例如，原始响应可以通过以下调用完成 `get_project_status`。以下载荷仅展示相关字段：

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

在原始响应完成后，API 会发送 `response.steer.pending` 用于仍需输入的已接受引导指令。其 `required_input` 字段标识了 API 在应用更新前需要的工具结果或审批：

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

使用以下方式返回所需输入： `response.create` 在同一连接上，并设置 `previous_response_id` to `resp_1`。不要重复已被接受的引导。一次显式的 `response.create` 使用其自身的工具、指令和其他设置。

此 JSONC 示例中的注释展示了服务端在哪里添加已排队的更新：

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

你无需等待 `response.steer.pending` 再返回工具结果。如果服务端已收到匹配的 `response.create`，则可以先不发送此通知直接继续。

## 处理失败和断开连接

`response.steer.failed` 表示 API 没有通过 steering 处理该输入，也不会稍后自动应用它。该事件返回原始 `input` 以及 `previous_response_id` 下的 `steer`，并附带一个 `error` 对象，描述失败原因。

通过 `steer.id`。跟踪已接受的提交。后续失败会使用相同的 ID。

常见错误代码：

- `invalid_input`: 仅使用受支持的事件字段和用户消息输入。
- `steering_not_supported`: 模型、请求参数或两者可能与 steering 不兼容。
- `response_not_found`: 目标响应仍必须在同一个 WebSocket 连接上可用。
- `too_many_pending_steers`: 等待处理的 steering 输入过多。使用 `response.create`；返回所有必需的工具结果或审批；否则，请等待自动的延续后再提交更多内容。请勿重新发送已被接受的 steering。

队列中的引导输入仅存在于当前连接中，不会随原始响应一起存储。请记录你发送的引导输入，并在重放前将其与响应事件和历史记录进行比较。不要假设挂起的引导在断开后仍然存在。详见 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).