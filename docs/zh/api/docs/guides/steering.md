# Mid-turn steering

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

Mid-turn steering 让用户可以在响应完成前添加需求或改变方向。

Mid-turn steering 可通过 WebSocket 连接用于 GPT-6 模型系列
  的 Responses API。GPT-5.6 及更早模型不支持
  steering。

Steering 不会重写已经发送到应用的输出、撤销之前的操作，或取消已经开始的工具调用。

有关连接设置和常规传输行为，请参阅 [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)。有关确切的事件定义，请参阅 [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送一条引导消息

使用 `response.create`。启动响应。在收到其 `response.created` 事件后，发送 `response.steer` 在同一连接上，使用该响应的 ID 作为 `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

该事件仅接受 `type`, `previous_response_id`，和 `input`。将 `input` 设置为字符串或由支持的内容类型组成的非空用户消息数组。

API 使用 `response.steer.accepted`:

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

确认已排队输入。“已接受”表示输入已排队，并不代表模型已对其进行处理。除非 API 需要来自你应用的 [工具结果或审批](#return-tool-results-or-approval) ，否则它会自动使用你的更新创建一个新响应。

在创建此自动延续之前，服务端会先完成当前的输出项以及任何已在运行的托管工具工作。请持续读取事件以接收包含你更新的响应；不要再次发送 `response.create`.

如果 steer 中断了原始响应，该响应会以 `response.incomplete` 和 `incomplete_details.reason: "steered"`。结束。如果原始响应先正常完成，则它会保持其已完成状态，并且仍然可以拥有一次 steer 延续。

自动延续会继承原始请求的设置。Token 与工具调用限制分别作用于每个响应。

## 运行完整示例

.NET SDK 不提供 Responses WebSocket 客户端，因此本示例不提供 C# SDK 变体。

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


示例在第一个 `response.created` 事件之后发送更新。在你的应用中，当用户提供更新时再发送。使用 延续 的 ID 在其 `response.created` 事件到达后用于新的引导。

## 返回工具结果或审批

如果响应需要客户端工具结果或审批，API 会让该 steering 继续排队。在同一连接上继续执行你正常的工具或审批流程。

例如，原始响应可以通过调用以下内容来完成 `get_project_status`。以下 payload 仅展示相关字段：

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

原始响应完成后，API 会发送 `response.steer.pending` ，用于仍需要输入的已接受 steering。其 `required_input` 字段标识了 API 在应用更新前所需的工具结果或审批：

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

使用以下方式在同一连接上返回所需的输入 `response.create` ，并设置 `previous_response_id` 为 `resp_1`。不要重复已接受的 steering。一个明确的 `response.create` 会使用其自身的工具、指令和其他设置。

此 JSONC 示例中的注释标出了服务端添加排队更新的位置：

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

你无需等待 `response.steer.pending` 即可返回工具结果。如果服务端已经收到了匹配的 `response.create`，则可以在不先发送该通知的情况下继续执行。

## 处理故障和断开连接

`response.steer.failed` 表示 API 未通过引导应用输入，也不会在后续自动应用。该事件返回原始 `input` 和 `previous_response_id` 下的 `steer`，并附带一个 `error` 对象描述该失败。

按以下方式追踪已接受的提交 `steer.id`。后续的失败会复用同一 ID。

常见错误代码：

- `invalid_input`: 仅使用受支持的事件字段和用户消息输入。
- `steering_not_supported`: 模型、请求参数或两者可能与引导不兼容。
- `response_not_found`: 目标响应必须在同一 WebSocket 连接上仍然可用。
- `too_many_pending_steers`: 待处理的引导输入过多。使用 `response.create`；返回任何必需的工具结果或审批；否则，在提交更多引导之前，等待自动延续。请勿重新发送已被接受的引导。

已排队的引导输入仅存在于当前连接上，不会随原始响应一起存储。记录你发送的引导输入，并在回放之前将它们与响应事件及历史记录进行比较。不要假设挂起的引导输入在断开连接后仍然存在。参见 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).