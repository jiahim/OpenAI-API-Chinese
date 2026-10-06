# 中途引导

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

Mid-turn steering 允许用户在回复完成前追加需求或改变方向。

Mid-turn steering 可通过 WebSocket 连接到
  Responses API 在 GPT-6 模型系列上使用。GPT-5.6 及更早的模型不支持
  steering。

Steering 不会重写已经发送到应用的输出，也不会撤销已执行的操作或取消已启动的工具。

有关连接设置和常规传输行为，请参阅 [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)。如需准确的事件定义，请参阅 [Responses WebSocket 事件参考](https://developers.openai.com/api/reference/resources/responses/websocket-events).

## 发送引导消息

以 `response.create`。开始一个响应。收到其 `response.created` 事件后，发送 `response.steer` 事件，在同一连接上，并使用该响应的 ID 作为 `previous_response_id`:

```json
{
  "type": "response.steer",
  "previous_response_id": "resp_1",
  "input": "Keep the scope small enough for one developer to finish in two weeks."
}
```

该事件仅接受 `type`, `previous_response_id`，和 `input`。将 `input` 设置为字符串或包含受支持内容类型的用户消息非空数组。

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

接受意味着输入已排队，而非模型已对其进行处理。除非需要来自你应用的API 会根据你的更新自动创建一个新响应 [工具结果或审批](#return-tool-results-or-approval) 。

在创建该自动 延续 之前，服务器会完成当前的输出项以及任何已运行的 托管工具 工作。请持续读取事件以接收包含你更新的响应；请勿再发送 `response.create`.

如果引导打断了原始响应，它将以 `response.incomplete` 和 `incomplete_details.reason: "steered"`。结束。如果原始响应先正常完成，则保留其已完成状态，并且仍可具有一个引导 延续。

自动延续会继承原始请求的设置。Token 和工具调用限制分别作用于每个响应。

## 运行完整示例

.NET SDK 没有提供 Responses WebSocket 客户端，因此此示例不提供 C# SDK 变体。

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

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
defer cancel()
client := openai.NewClient()
conn, err := client.Responses.Connect(ctx, responses.ResponseConnectionOptions{})
if err != nil {
	log.Fatal(err)
}
defer conn.Close()
if err := conn.Create(ctx, responses.ResponsesClientEventResponseCreateParam{
	Model: "gpt-6-astra",
	Reasoning: shared.ReasoningParam{
		Effort: shared.ReasoningEffortMedium,
	},
	Store: openai.Bool(false),
	Input: responses.ResponsesClientEventResponseCreateInputUnionParam{
		OfString: openai.String("Draft a project plan for building a task-tracking app."),
	},
}); err != nil {
	log.Fatal(err)
}
initialID, successorID := "", ""
for {
	event, err := conn.Recv(ctx)
	if err != nil {
		log.Fatal(err)
	}
	switch event.Type {
	case "response.created":
		id := event.OfResponsesServerEventResponseWsCreated.Response.ID
		if initialID == "" {
			initialID = id
			err := conn.Send(ctx, responses.ResponsesClientEventUnionParam{
				OfResponseSteer: &responses.ResponseSteerEventParam{
					PreviousResponseID: id,
					Input: responses.ResponseSteerInputUnionParam{
						OfString: openai.String("Keep the scope small enough for one developer to finish in two weeks."),
					},
				},
			})
			if err != nil {
				log.Fatal(err)
			}
		} else {
			successorID = id
		}
	case "response.steer.failed", "response.failed", "error":
		log.Fatal(event.RawJSON())
	case "response.incomplete":
		r := event.OfResponsesServerEventResponseWsIncomplete.Response
		if r.ID != initialID || r.IncompleteDetails.Reason != "steered" {
			log.Fatal(event.RawJSON())
		}
	case "response.completed":
		r := event.OfResponsesServerEventResponseWsCompleted.Response
		if successorID != "" && r.ID == successorID {
			fmt.Println(r.OutputText())
			return
		}
	}
	// Steering acceptance only queues input. Wait for the successor to complete.
}
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.*;
import java.util.*;

long deadline = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(120);
try (var conn =
    client.async().responses().connect().get(10, java.util.concurrent.TimeUnit.SECONDS)) {
  conn.send(
      ResponsesClientEvent.ofResponseCreate(
          ResponsesClientEvent.ResponseCreate.builder()
              .model("gpt-6-astra")
              .reasoning(
                  com.openai.models.Reasoning.builder()
                      .effort(com.openai.models.ReasoningEffort.MEDIUM)
                      .build())
              .store(false)
              .input("Draft a project plan for building a task-tracking app.")
              .build()));
  String initialId = null, successorId = null;
  while (true) {
    var event =
        conn.receive()
            .get(
                Math.max(1, deadline - System.nanoTime()),
                java.util.concurrent.TimeUnit.NANOSECONDS);
    if (event.responseCreated().isPresent()) {
      var id = event.responseCreated().orElseThrow().response().id();
      if (initialId == null) {
        initialId = id;
        conn.send(
            ResponsesClientEvent.ofResponseSteer(
                ResponseSteerEvent.builder()
                    .previousResponseId(id)
                    .input(
                        "Keep the scope small enough for one developer to finish in two weeks.")
                    .build()));
      } else {
        successorId = id;
      }
    } else if (event.responseSteerFailed().isPresent()
        || event.responseFailed().isPresent()
        || event.error().isPresent()) {
      throw new IllegalStateException(event.toString());
    } else if (event.responseIncomplete().isPresent()) {
      var response = event.responseIncomplete().orElseThrow().response();
      if (!response.id().equals(initialId)
          || !response
              .incompleteDetails()
              .flatMap(Response.IncompleteDetails::reason)
              .map(r -> r.toString().equals("steered"))
              .orElse(false)) throw new IllegalStateException(event.toString());
    } else if (event.responseCompleted().isPresent()
        && event.responseCompleted().orElseThrow().response().id().equals(successorId)) {
      event.responseCompleted().orElseThrow().response().output().stream()
          .flatMap(item -> item.message().stream())
          .flatMap(message -> message.content().stream())
          .flatMap(content -> content.outputText().stream())
          .forEach(text -> System.out.println(text.text()));
      break;
    }
    // Acceptance only queues input; follow the successor through completion.
  }
} finally {
  client.close();
}
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


该示例在收到第一个 `response.created` 事件后发送更新。在你的应用中，当用户提供更新时再发送。在该 延续 的事件到达后，使用该 延续 的 ID 进行新的引导 `response.created` 事件到达后。

## Return tool results or approval

如果响应需要客户端工具结果或审批，API 会将引导指令保持在队列中。请在同一连接上继续执行常规的工具或审批流程。

例如，原始响应可以通过调用以下内容来完成： `get_project_status`。以下载荷仅展示相关字段：

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

原始响应完成后，API 会发送 `response.steer.pending` ，用于仍需要输入的已接受引导指令。其 `required_input` 字段标识了 API 在应用更新之前所需的工具结果或审批：

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

在同一连接上使用以下命令返回所需的输入： `response.create` 并设置 `previous_response_id` 以 `resp_1`。不要重复已接受的引导。一次明确的 `response.create` 交接使用各自的工具、指令和其他设置。

本 JSONC 示例的注释显示了服务端在何处添加排队的更新：

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

你无需等待 `response.steer.pending` 即可返回工具结果。如果服务端已收到匹配的 `response.create`，则无需先发送此通知即可继续。

## 处理失败和断开连接

`response.steer.failed` 表示 API 没有对输入应用引导，也不会稍后自动应用它。该事件返回原始 `input` 和 `previous_response_id` 在 `steer`，下，附带一个 `error` 对象描述失败信息。

通过 `steer.id`。跟踪已接受的提交。后续失败使用相同的 ID。

常见错误代码：

- `invalid_input`: 仅使用支持的事件字段和用户消息输入。
- `steering_not_supported`: 模型、请求参数或两者可能与引导不兼容。
- `response_not_found`: 目标响应必须仍可在同一 WebSocket 连接上使用。
- `too_many_pending_steers`: 待处理的引导输入过多。使用以下方式返回任何必需的工具结果或审批： `response.create`；否则，请在提交更多内容之前等待自动的延续。请勿重新发送已被接受的引导。

排队的引导输入仅存在于当前连接中，不会随原始响应一起存储。记录你发送的引导输入，并在重放前将它们与响应事件及历史记录进行比较。请勿假定挂起的引导在断开后仍然存在。参见 [WebSocket 恢复指南](https://developers.openai.com/api/docs/guides/websocket-mode#reconnect-and-recover).