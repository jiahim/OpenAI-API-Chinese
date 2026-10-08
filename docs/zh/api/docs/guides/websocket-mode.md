# WebSocket Mode

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

Responses API支持用于长时间运行、工具调用密集型工作流的 WebSocket 模式。除了降低延迟之外， `stream_id` 它还支持 WebSocket 多路复用：只需一条到 `/v1/responses` 的持久连接，即可并行运行多个会话，并将已有会话分叉到新的流上。继续每一轮时，只需发送新的输入项以及 `previous_response_id`.

WebSocket 模式兼容 Zero Data Retention（ZDR）和 `store=false`.

## 为什么使用 WebSocket 模式

当工作流涉及大量模型与工具之间的往返交互（例如，智能体编码或带有重复工具调用的编排循环）时，WebSocket 模式最为适用。

由于连接保持打开状态，并且每一轮只发送增量输入，WebSocket 模式降低了每轮延续开销，并改善了长链路上的端到端延迟。对于具有 20 次以上工具调用的运行，我们观察到端到端执行速度最高可加快约 40%。

## 连接并创建响应

使用以下命令安装 WebSocket 依赖 `pip install "openai[realtime]>=3.8.0"` 安装 Python 版本， `npm install openai@^7.10.0 ws` 安装 JavaScript 版本，或 `gem install openai async-websocket` 安装 Ruby 版本。

对于 Go，请运行 `go get github.com/openai/openai-go/v3@v3.73.0`.
对于 Java，请添加 Maven 依赖 `com.openai:openai-java:4.78.0`.
这些 Go 和 Java SDK 版本提供原生的 Responses WebSocket 支持。

在 WebSocket 模式下，每个回合开始时由客户端发送一个 `response.create` 事件。该载荷与普通的 [Responses create 请求体](https://developers.openai.com/api/reference/resources/responses/methods/create)，相同，只是不会使用 `stream` 和 `background` 等传输相关的字段。

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();

const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: "Find fizz_buzz()" }],
      },
    ],
    tools: [],
  });
  let completed = false;
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      completed = true;
      break;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  if (!completed)
    throw new Error("Connection closed before the response finished.");
} finally {
  ws.close();
}
```

```python
from openai import OpenAI

client = OpenAI()

with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model="gpt-6-astra",
        store=False,
        input=[
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": "Find fizz_buzz()"}],
            }
        ],
        tools=[],
    )
    for event in connection:
        if event.type == "response.completed":
            print(event.response.output_text)
            break
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
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
	Store: openai.Bool(false),
	Input: responses.ResponsesClientEventResponseCreateInputUnionParam{
		OfString: openai.String("Find fizz_buzz()"),
	},
	StreamID: openai.String("main"),
	Tools:    []responses.ToolUnionParam{},
}); err != nil {
	log.Fatal(err)
}
response, err := conn.FinalResponse(ctx)
if err != nil {
	log.Fatal(err)
}
if response.Status != responses.ResponseStatusCompleted {
	log.Fatalf("Response ended with status %s", response.Status)
}
fmt.Println(response.OutputText())
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.*;
import java.util.*;

try (var conn = client.responses().connect()) {
  conn.send(
      ResponsesClientEvent.ofResponseCreate(
          ResponsesClientEvent.ResponseCreate.builder()
              .model("gpt-6-astra")
              .store(false)
              .input("Find fizz_buzz()")
              .streamId("main")
              .tools(List.of())
              .build()));
  var response = conn.finalResponse();
  if (response.status().filter(ResponseStatus.COMPLETED::equals).isEmpty())
    throw new IllegalStateException(
        "Response ended with status " + response.status().orElse(null));
  response.output().stream()
      .flatMap(item -> item.message().stream())
      .flatMap(message -> message.content().stream())
      .flatMap(content -> content.outputText().stream())
      .forEach(text -> System.out.println(text.text()));
}
```

```ruby
require "async"
require "openai"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: [
          {
            role: "user",
            content: "Find fizz_buzz()"
          }
        ], tools: []
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


客户端可以选择性地通过发送 `response.create` 与 `generate: false`。来预热请求状态。当你已经知道即将发送的工具、指令和/或自定义消息时，这非常有用。 `generate: false` 不会返回模型输出，但会准备请求状态，以便下一个生成的回合可以更快启动。预热请求会返回一个响应 ID，你可以在后续回合（包括响应链中的更晚回合）中通过 `previous_response_id`，来基于该 ID 继续会话。下一节将介绍如何使用 `previous_response_id` 和增量输入来继续会话。

## 使用增量输入继续

要在响应仍在进行时添加用户指令，请使用 [轮中引导](https://developers.openai.com/api/docs/guides/steering)。引导会保留已完成的工作，并将新指令包含在一个延续中。请使用以下 `response.create` 模式来处理普通的轮间延续和工具结果。

若要继续运行，请发送另一个 `response.create` ，其中包含：

- `previous_response_id` 设置为上一个响应 ID。
- `input` 仅包含新的项目（例如，工具输出和下一条用户消息）。

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();
const model = "gpt-6-astra";

const tools = [
  {
    type: "function",
    name: "get_test_results",
    description: "Return a local demo test result.",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
  },
];

async function waitForResponse(ws) {
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      return message.response;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  throw new Error("Connection closed before the response finished.");
}

const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model,
    store: false,
    input: "Find the failing test and suggest a fix.",
    tools,
    tool_choice: { type: "function", name: "get_test_results" },
    parallel_tool_calls: false,
  });
  const first = await waitForResponse(ws);
  const call = first.output.find((item) => item.type === "function_call");
  if (!call || call.name !== "get_test_results") {
    throw new Error("Expected a get_test_results function call.");
  }
  const result = {
    test: "test_fizz_buzz",
    failure: 'Expected "FizzBuzz" for 15, got "Fizz".',
  };

  // Continue on the same socket with the actual response and tool-call IDs.
  ws.send({
    type: "response.create",
    stream_id: "main",
    model,
    store: false,
    previous_response_id: first.id,
    input: [
      {
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      },
      { role: "user", content: "Now optimize it." },
    ],
    tools,
    tool_choice: "none",
  });
  await waitForResponse(ws);
} finally {
  ws.close();
}
```

```python
import json

from openai import OpenAI
from openai.resources.responses.responses import ResponsesConnection
from openai.types.responses import FunctionToolParam, Response

client = OpenAI()
model = "gpt-6-astra"
tools: list[FunctionToolParam] = [
    {
        "type": "function",
        "name": "get_test_results",
        "description": "Read the demo test results.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
            "additionalProperties": False,
        },
        "strict": True,
    }
]


def get_test_results():
    # Demo data. Replace this function with your test runner.
    return {
        "test": "test_fizz_buzz",
        "failure": 'Expected "FizzBuzz" for 15, got "Fizz".',
    }


def wait_for_response(connection: ResponsesConnection) -> Response:
    for event in connection:
        if event.type == "response.completed":
            return event.response
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
    raise RuntimeError("Connection closed before the response finished.")


with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model=model,
        store=False,
        input="Find the failing test and suggest a fix.",
        tools=tools,
        tool_choice={"type": "function", "name": "get_test_results"},
        parallel_tool_calls=False,
    )
    response = wait_for_response(connection)
    call = next(item for item in response.output if item.type == "function_call")
    if call.name != "get_test_results" or json.loads(call.arguments) != {}:
        raise ValueError("Expected a get_test_results call with no arguments")

    # Continue on the same connection using the actual response and tool-call IDs.
    connection.response.create(
        stream_id="main",
        model=model,
        store=False,
        previous_response_id=response.id,
        input=[
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(get_test_results()),
            },
            {"role": "user", "content": "Now optimize it."},
        ],
        tools=tools,
        tool_choice="none",
    )
    print(wait_for_response(connection).output_text)
```

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
defer cancel()
client := openai.NewClient()
tools := []responses.ToolUnionParam{
	{
		OfFunction: &responses.FunctionToolParam{
			Name:        "get_test_results",
			Description: openai.String("Return a local demo test result."),
			Parameters: map[string]any{
				"type":                 "object",
				"properties":           map[string]any{},
				"additionalProperties": false,
			},
			Strict: openai.Bool(true),
		},
	},
}
conn, err := client.Responses.Connect(ctx, responses.ResponseConnectionOptions{})
if err != nil {
	log.Fatal(err)
}
defer conn.Close()
if err := conn.Create(ctx, responses.ResponsesClientEventResponseCreateParam{
	Model: "gpt-6-astra",
	Store: openai.Bool(false),
	Input: responses.ResponsesClientEventResponseCreateInputUnionParam{
		OfString: openai.String("Find the failing test and suggest a fix."),
	},
	StreamID:          openai.String("main"),
	Tools:             tools,
	ParallelToolCalls: openai.Bool(false),
	ToolChoice: responses.ResponsesClientEventResponseCreateToolChoiceUnionParam{
		OfFunctionTool: &responses.ToolChoiceFunctionParam{
			Name: "get_test_results",
		},
	},
}); err != nil {
	log.Fatal(err)
}
first, err := conn.FinalResponse(ctx)
if err != nil {
	log.Fatal(err)
}
if first.Status != responses.ResponseStatusCompleted {
	log.Fatalf("Response ended with status %s", first.Status)
}
var callID string
for _, item := range first.Output {
	if item.Type == "function_call" && item.Name == "get_test_results" {
		callID = item.CallID
		break
	}
}
if callID == "" {
	log.Fatal("Expected a get_test_results function call")
}
// The result is a local demo fixture; carry the real response and call IDs.
result := `{"test":"test_fizz_buzz","failure":"Expected FizzBuzz for 15, got Fizz."}`
if err := conn.Create(ctx, responses.ResponsesClientEventResponseCreateParam{
	Model:              "gpt-6-astra",
	StreamID:           openai.String("main"),
	Store:              openai.Bool(false),
	PreviousResponseID: openai.String(first.ID),
	Tools:              tools,
	ToolChoice: responses.ResponsesClientEventResponseCreateToolChoiceUnionParam{
		OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsNone),
	},
	Input: responses.ResponsesClientEventResponseCreateInputUnionParam{
		OfResponse: &responses.ResponseInputParam{
			{
				OfFunctionCallOutput: &responses.ResponseInputItemFunctionCallOutputParam{
					CallID: openai.String(callID),
					Output: responses.ResponseInputItemFunctionCallOutputOutputUnionParam{
						OfString: openai.String(result),
					},
				},
			},
			responses.ResponseInputItemParamOfMessage("Now optimize it.", responses.EasyInputMessageRoleUser),
		},
	},
}); err != nil {
	log.Fatal(err)
}
response, err := conn.FinalResponse(ctx)
if err != nil {
	log.Fatal(err)
}
if response.Status != responses.ResponseStatusCompleted {
	log.Fatalf("Response ended with status %s", response.Status)
}
fmt.Println(response.OutputText())
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.*;
import java.util.*;

var tool =
    FunctionTool.builder()
        .name("get_test_results")
        .description("Return a local demo test result.")
        .strict(true)
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty("properties", JsonValue.from(Map.of()))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .build();
try (var conn = client.responses().connect()) {
  conn.send(
      ResponsesClientEvent.ofResponseCreate(
          ResponsesClientEvent.ResponseCreate.builder()
              .model("gpt-6-astra")
              .store(false)
              .input("Find the failing test and suggest a fix.")
              .streamId("main")
              .addTool(tool)
              .parallelToolCalls(false)
              .toolChoice(ToolChoiceFunction.builder().name("get_test_results").build())
              .build()));
  var first = conn.finalResponse();
  if (first.status().filter(ResponseStatus.COMPLETED::equals).isEmpty())
    throw new IllegalStateException(
        "Response ended with status " + first.status().orElse(null));
  var call =
      first.output().stream()
          .flatMap(item -> item.functionCall().stream())
          .filter(item -> item.name().equals("get_test_results"))
          .findFirst()
          .orElseThrow(() -> new IllegalStateException("Expected get_test_results call"));
  // Use the real response and call IDs with a local demo result.
  var result =
      "{\"test\":\"test_fizz_buzz\",\"failure\":\"Expected FizzBuzz for 15, got Fizz.\"}";
  conn.send(
      ResponsesClientEvent.ofResponseCreate(
          ResponsesClientEvent.ResponseCreate.builder()
              .model("gpt-6-astra")
              .streamId("main")
              .store(false)
              .previousResponseId(first.id())
              .addTool(tool)
              .toolChoice(ToolChoiceOptions.NONE)
              .inputOfResponse(
                  List.of(
                      ResponseInputItem.ofFunctionCallOutput(
                          ResponseInputItem.FunctionCallOutput.builder()
                              .callId(call.callId())
                              .output(result)
                              .build()),
                      ResponseInputItem.ofEasyInputMessage(
                          EasyInputMessage.builder()
                              .role(EasyInputMessage.Role.USER)
                              .content("Now optimize it.")
                              .build())))
              .build()));
  var response = conn.finalResponse();
  if (response.status().filter(ResponseStatus.COMPLETED::equals).isEmpty())
    throw new IllegalStateException(
        "Response ended with status " + response.status().orElse(null));
  response.output().stream()
      .flatMap(item -> item.message().stream())
      .flatMap(message -> message.content().stream())
      .flatMap(content -> content.outputText().stream())
      .forEach(text -> System.out.println(text.text()));
}
```

```ruby
require "async"
require "openai"
require "json"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

tools = [
  {
    type: "function",
    name: "get_test_results",
    description: "Read the demo test results.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    strict: true
  }
]

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: "Find the failing test and suggest a fix.", tools: tools,
        tool_choice: {
          type: "function",
          name: "get_test_results"
        }, parallel_tool_calls: false
      )
      response = wait_for_response(connection)
      call = response.output.grep(OpenAI::Responses::ResponseFunctionToolCall).first
      unless call && call.name == "get_test_results" && JSON.parse(call.arguments) == {}
        raise "Expected a get_test_results call with no arguments"
      end

      # Demo data. Replace this with your test runner.
      result = {
        test: "test_fizz_buzz",
        failure: 'Expected "FizzBuzz" for 15, got "Fizz".'
      }
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        previous_response_id: response.id,
        input: [
          {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.generate(result)
          },
          {
            role: "user",
            content: "Now optimize it."
          }
        ],
        tools: tools, tool_choice: "none"
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


## 延续的工作原理

WebSocket 模式使用与 HTTP 模式相同的 `previous_response_id` 链接语义，但会在当前 socket 上提供一条延迟更低的延续路径。

在活跃的 WebSocket 连接上，服务会将最近的上一响应状态保存在该连接本地的内存缓存中。当你使用 `stream_id`，时，每个 lane 会各自保留其最新的缓存响应，因此在该 lane 中基于最新响应继续生成时会更快，因为服务可以复用该连接本地的状态。由于服务仅在内存中保留上一响应状态而不会写入磁盘，因此你可以以与 `store=false` 以及 Zero Data Retention（ZDR，零数据保留）兼容的方式使用 WebSocket 模式。

如果某个 `previous_response_id` 不在内存缓存中，行为取决于你是否存储响应：

- 使用 `store=true`,该服务可以在可用时从持久化状态中恢复较旧的响应 ID。延续仍然可以工作,但会失去内存中的延迟优势。
- 使用 `store=false` (包括 ZDR),则没有持久化回退。如果该 ID 未被缓存,请求会返回 `previous_response_not_found`.

如果同一通道的 延续 返回一个 `4xx` 或 `5xx`，服务端会从连接本地缓存中逐出被引用的 `previous_response_id` 。跨通道分叉在返回错误时会保留共享的父项，以便源通道可以继续。

## 压缩与创建新响应

如果使用压缩，则有两种不同的延续模式：

### 服务端压缩 (`context_management`)

当你启用服务端压缩（`context_management` 与 `compact_threshold`），压缩会在正常的 `/responses` 生成过程中进行。在 WebSocket 模式下，你按往常一样继续：发送下一个 `response.create` 并附上最新的 `previous_response_id` ，且仅包含新增的输入项。

### Standalone `/responses/compact`

独立 [`/responses/compact` endpoint](https://developers.openai.com/api/reference/resources/responses/methods/compact) 接口返回一个新的压缩后的输入窗口，而不是响应 ID。压缩后，使用该压缩后的窗口在 WebSocket 连接上创建一个新的响应，作为 `input` （以及后续的用户/工具项）。

通过省略 `previous_response_id` 或将其设置为 `null`。来开启一个新链。直接传入压缩后的输出即可；不要裁剪返回的窗口。

```javascript
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

// Compact your current window with an HTTP request.
const compacted = await client.responses.compact({
  model: "gpt-6-astra",
  input: longInputItems,
});
const nextInput = toResponseInputItems(compacted.output);
nextInput.push({
  type: "message",
  role: "user",
  content: [{ type: "input_text", text: "Continue from here." }],
});

// Start a new response on the WebSocket using the compacted window.
const ws = new ResponsesWS(client);
try {
  ws.send({
    type: "response.create",
    stream_id: "main",
    model: "gpt-6-astra",
    store: false,
    input: nextInput,
    tools: [],
  });
  let completed = false;
  for await (const event of ws) {
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (message.type === "response.output_text.delta") {
      process.stdout.write(message.delta);
    } else if (message.type === "response.completed") {
      completed = true;
      break;
    } else if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(JSON.stringify(message));
    }
  }
  if (!completed)
    throw new Error("Connection closed before the response finished.");
} finally {
  ws.close();
}
```

```python
from typing import cast

from openai import OpenAI
from openai.types.responses import ResponseInputParam

# Compact your current window (HTTP call).
compacted = client.responses.compact(
    model="gpt-6-astra",
    input=long_input_items_array,
)
next_input = cast(
    ResponseInputParam,
    [item.to_dict() for item in compacted.output],
)
next_input.append(
    {
        "type": "message",
        "role": "user",
        "content": [{"type": "input_text", "text": "Continue from here."}],
    }
)

# Start a new response on the WebSocket using the compacted window.
with client.responses.connect() as connection:
    connection.response.create(
        stream_id="main",
        model="gpt-6-astra",
        store=False,
        input=next_input,
        tools=[],
    )
    for event in connection:
        if event.type == "response.completed":
            print(event.response.output_text)
            break
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(event.to_json())
```

```ruby
require "async"
require "openai"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
    end
  end
  raise "Connection closed before the response finished"
end

client = OpenAI::Client.new
compacted = client.responses.compact(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: "Find the failing test."
    }
  ]
)
next_input = compacted.output.map(&:to_h)
next_input << {
  role: :user,
  content: "Continue from here."
}

Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: next_input, tools: []
      )
      puts(wait_for_response(connection).output_text)
    end
  end
end
```


## 并行运行对话

你可以在同一连接上通过 `stream_id` 参数来维持并发会话。请使用不同的 `response.create` 值将彼此独立的事件连续发送。 `stream_id` 服务器可以在同一连接上并发运行这些事件。这些事件可以交错出现,因此请保持单一的读取循环,并根据 `stream_id`.

一个 `stream_id` 在同一 WebSocket 连接上指定一条有序的通道。请将 `stream_id` 和 `previous_response_id` 保持分开:

- `stream_id` 控制事件的流向以及哪些请求按先进先出顺序运行。
- `previous_response_id` 控制对话的归属关系。

这种分离带来了两种有用的模式。

```text
one WebSocket connection
├─ stream_id="planner"   draft a deployment plan
└─ stream_id="research"  list deployment risks
```

具有相同 `stream_id` 的请求保持先进先出，且不会重叠。具有不同 `stream_id` 值的请求可以并发执行。

### 每个连接的限制

- 一个连接在命名通道和默认通道上最多可同时拥有 16 个进行中的响应。该连接会接受更多 `response.create` 事件并将其排队，直到某个进行中的响应结束。
- 一个连接最多接受 32 个不同的命名 `stream_id` 值。隐式的默认通道不计入此命名流限制。达到限制后可复用现有的 `stream_id` 或打开新连接。

### 将对话分叉到新的流

若要从已完成的响应分支，请将其 ID 作为 `previous_response_id` 与新的 `stream_id`。一起发送。在该响应仍然有效期间，新流会继承其上下文，并且原始流可以继续进行。分叉开始后，两个分支可以使用不同的流 ID 并发运行。

使用 `store=false` （包括 ZDR）时，跨通道分叉依赖于父级保留在连接本地缓存中。如果分叉在源通道推进或失败时排队，父级可能在分叉开始前被驱逐，并且分叉会返回 `previous_response_not_found`。等待分叉通道发出 `response.in_progress` 后再推进源通道，或重试时将 `previous_response_id` 设置为 `null` 并重放完整输入上下文。

```text
main:   resp_1 ──▶ resp_2 ──▶ resp_3
                       ╲
critic:                 resp_4 ──▶ resp_5
```

复用 `stream_id` 而未提供 `previous_response_id` 会启动一个新响应，而不是延续会话。

关键调用示例如下：

```text
# One socket, two independent conversations.
send_create(connection, "planner", "Draft a deployment plan.")
send_create(connection, "research", "List deployment risks.")

# Fork the planner response, then continue the original branch in parallel.
send_create(
    connection,
    "critic",
    "Find gaps in this plan.",
    previous_response_id=planner_response_id,
)
wait_for_in_progress(connection, "critic")
send_create(
    connection,
    "planner",
    "Add rollback steps.",
    previous_response_id=planner_response_id,
)
```

### 完整示例

并行运行对话，然后分叉一个

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();

const latestResponseIdByLane = new Map();

function sendCreate(
  ws,
  streamId,
  text,
  previousResponseId = latestResponseIdByLane.get(streamId)
) {
  ws.send({
    type: "response.create",
    stream_id: streamId,
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    ],
    previous_response_id: previousResponseId,
  });
}

async function readMessage(events) {
  while (true) {
    const { value: event, done } = await events.next();
    if (done)
      throw new Error("Connection closed before all responses finished.");
    if (event.type === "error") throw event.error;
    if (event.type !== "message") continue;
    const message = event.message;
    if (
      message.type === "response.failed" ||
      message.type === "response.incomplete"
    ) {
      throw new Error(
        `Lane ${message.stream_id} failed: ${JSON.stringify(message)}`
      );
    }
    return message;
  }
}

async function drainUntilComplete(events, expectedStreamIds) {
  const remaining = new Set(expectedStreamIds);
  while (remaining.size > 0) {
    const message = await readMessage(events);
    const streamId = message.stream_id;
    if (!streamId || !remaining.has(streamId)) continue;
    if (message.type === "response.completed") {
      latestResponseIdByLane.set(streamId, message.response.id);
      remaining.delete(streamId);
    }
  }
}

async function waitForInProgress(events, streamId) {
  while (true) {
    const message = await readMessage(events);
    if (
      message.type === "response.in_progress" &&
      message.stream_id === streamId
    )
      return;
  }
}

const ws = new ResponsesWS(client);
// Keep one iterator so events stay queued while moving between phases.
const events = ws.stream();
try {
  // Run two independent conversations in parallel.
  sendCreate(
    ws,
    "planner",
    "Draft a deployment plan for a stateless API service."
  );
  sendCreate(
    ws,
    "research",
    "List common deployment risks for a stateless API service."
  );
  await drainUntilComplete(events, new Set(["planner", "research"]));

  // Fork the planner conversation and continue its original branch in parallel.
  const plannerResponseId = latestResponseIdByLane.get("planner");
  sendCreate(
    ws,
    "critic",
    "Find gaps in this deployment plan.",
    plannerResponseId
  );
  // Let the fork load its parent before advancing the original lane's cache.
  await waitForInProgress(events, "critic");
  sendCreate(
    ws,
    "planner",
    "Add rollback and monitoring steps to the plan.",
    plannerResponseId
  );
  await drainUntilComplete(events, new Set(["critic", "planner"]));
} finally {
  await events.return?.();
  ws.close();
}
```

```python
from openai import OpenAI
from openai.resources.responses.responses import ResponsesConnection

client = OpenAI()
latest_response_id_by_lane: dict[str, str] = {}


def send_create(
    connection: ResponsesConnection,
    stream_id: str,
    text: str,
    previous_response_id: str | None = None,
):
    if previous_response_id is None:
        previous_response_id = latest_response_id_by_lane.get(stream_id)
    connection.response.create(
        stream_id=stream_id,
        model="gpt-6-astra",
        store=False,
        input=[
            {
                "type": "message",
                "role": "user",
                "content": [{"type": "input_text", "text": text}],
            }
        ],
        previous_response_id=previous_response_id,
    )


def drain_until_complete(
    connection: ResponsesConnection, expected_stream_ids: set[str]
):
    completed: set[str] = set()
    for event in connection:
        stream_id = event.stream_id
        if event.type == "error" and stream_id is None:
            raise RuntimeError(f"Connection error: {event.to_json()}")
        if stream_id is None or stream_id not in expected_stream_ids:
            continue

        if event.type == "response.completed":
            latest_response_id_by_lane[stream_id] = event.response.id
            completed.add(stream_id)
            if completed == expected_stream_ids:
                return
        elif event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(f"Lane {stream_id} failed: {event.to_json()}")
    raise RuntimeError("Connection closed before all responses finished.")


def wait_for_in_progress(connection: ResponsesConnection, expected_stream_id: str):
    for event in connection:
        if event.type == "error" and event.stream_id is None:
            raise RuntimeError(f"Connection error: {event.to_json()}")
        if event.stream_id != expected_stream_id:
            continue
        if event.type == "response.in_progress":
            return
        if event.type in {"response.failed", "response.incomplete", "error"}:
            raise RuntimeError(f"Lane {expected_stream_id} failed: {event.to_json()}")
    raise RuntimeError("Connection closed before the fork started.")


with client.responses.connect() as connection:
    # 1. Run two independent conversations in parallel.
    send_create(
        connection, "planner", "Draft a deployment plan for a stateless API service."
    )
    send_create(
        connection,
        "research",
        "List common deployment risks for a stateless API service.",
    )
    drain_until_complete(connection, {"planner", "research"})

    # 2. Fork the planner conversation and continue the original branch in parallel.
    planner_response_id = latest_response_id_by_lane["planner"]
    send_create(
        connection,
        "critic",
        "Find gaps in this deployment plan.",
        previous_response_id=planner_response_id,
    )
    # Let the fork bind its parent before advancing the original lane.
    wait_for_in_progress(connection, "critic")
    send_create(
        connection,
        "planner",
        "Add rollback and monitoring steps to the plan.",
        previous_response_id=planner_response_id,
    )
    drain_until_complete(connection, {"critic", "planner"})
```

```ruby
require "async"
require "openai"
require "json"

def send_create(connection, stream_id, text, previous_response_id = nil)
  payload = {
    stream_id: stream_id,
    model: "gpt-6-astra",
    store: false,
    input: [
      {
        role: "user",
        content: text
      }
    ]
  }
  payload[:previous_response_id] = previous_response_id if previous_response_id
  connection.response.create(**payload)
end

def read_event(connection)
  event = connection.receive or raise "Connection closed before all responses finished"
  if ["response.failed", "response.incomplete", "error"].include?(event.type.to_s)
    raise "Response failed: #{event.to_json}"
  end

  event
end

def drain_responses(connection, lanes, latest_ids)
  remaining = lanes.dup
  until remaining.empty?
    event = read_event(connection)
    next unless event.type.to_s == "response.completed"

    lane = event.stream_id
    next unless remaining.include?(lane)

    latest_ids[lane] = event.response.id
    remaining.delete(lane)
  end
end

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      latest_ids = {}
      send_create(connection, "planner", "Draft a deployment plan for a stateless API service.")
      send_create(connection, "research", "List common deployment risks for a stateless API service.")
      drain_responses(connection, ["planner", "research"], latest_ids)
      parent_id = latest_ids.fetch("planner")
      send_create(connection, "critic", "Find gaps in this deployment plan.", parent_id)
      # Let the fork load its parent before advancing the original lane's cache.
      loop do
        event = read_event(connection)
        break if event.type.to_s == "response.in_progress" && event.stream_id == "critic"
      end
      send_create(connection, "planner", "Add rollback and monitoring steps.", parent_id)
      drain_responses(connection, ["critic", "planner"], latest_ids)
      puts(JSON.generate(latest_ids))
    end
  end
end
```


一个 `stream_id` 必须为 1–256 个字符，且只能包含字母、数字、下划线（`_`）、连字符（`-`）和句点（`.`）。仅在 WebSocket `response.create` 事件中使用它；不要在 HTTP `POST /v1/responses`.

对于已命名的流，服务端事件会包含匹配的 `stream_id`，包括终止事件和请求作用域错误。

如果省略 `stream_id`，则请求使用隐式的默认通道，并且其事件不包含 `stream_id`。默认通道在其他方面遵循与已命名流相同的排序和并发规则。空字符串不是有效的 `stream_id`；省略该字段以选择默认通道。

## 连接行为与限制

- 每个响应内的事件遵循现有的 Responses 流式事件模型。不同通道的事件可以交错。
- 具有相同 `stream_id` 按先进先出顺序运行，且不会重叠。不同通道上的请求可以并发运行。
- 连接最长持续 60 分钟。达到上限时请重新连接。

## 重新连接与恢复

当连接关闭（或达到 60 分钟上限）时，所有 lane 的连接本地缓存都会消失。请打开一个新的 WebSocket 连接，并使用以下任一模式来恢复每个 lane：

1. 如果你存储了先前的 response (`store=true`) 并拥有有效的 response ID，使用 `previous_response_id` 以及新的输入项来延续该会话线路。
2. 如果你无法延续某个会话线路（例如， `store=false`/ZDR 或 `previous_response_not_found`: 使用零号指令恢复}),通过设置 `previous_response_id` 为 `null` (或省略它) 并发送该会话线路下一轮的完整输入上下文,来开启新的 response。
3. 如果你使用 `/responses/compact`，压缩了上下文，将返回的压缩窗口作为该新 response 的基础 `input` ，然后追加最新的用户/工具项消息。

## 需要处理的错误

当服务端可以将错误关联到某个具名通道时，错误事件会包含 `stream_id`。其他通道在请求范围内的错误之后可以继续执行。

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