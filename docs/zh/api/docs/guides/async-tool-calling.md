# 异步工具调用

> 完整的文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

异步工具调用允许模型在调用工具后继续工作，而无需等待该工具的结果。可用于提前启动耗时的查找请求、并行处理请求中相互独立的部分，以及在你的应用程序获得结果时立即提供结果。

## 异步工具的工作原理

普通的 [function call](https://developers.openai.com/api/docs/guides/function-calling) 会暂停模型的当前轮次，以等待工具响应。在函数或自定义工具定义上设置 `async: true` ，可以让模型在发出该调用后、在你的应用返回输出前继续工作。

你的应用仍然负责执行该工具。异步工具并不会把执行转移到 OpenAI 端或由其管理你的后台任务。
  该公司 or manage your background jobs.

这与 [后台模式](https://developers.openai.com/api/docs/guides/background)，不同，后台模式会以异步方式运行响应生成。异步工具调用则允许模型在你的应用运行工具的同时继续工作。

当一个任务完成后，在后续的 Responses 请求中包含其输出。使用原始的 API `call_id` 将结果与对应的调用进行匹配：

| 工具类型 | 调用项          | 输出项               |
| --------- | ------------------ | ------------------------- |
| 函数  | `function_call`    | `function_call_output`    |
| 自定义    | `custom_tool_call` | `custom_tool_call_output` |

## 调用异步工具

Add `async: true` 添加到工具定义中。对应的调用项会出现在 `response.output` 包含 `async: true`.

在后台运行一次天气查询

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const model = "gpt-6-astra";

const tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Read a demo weather snapshot for a city.",
    async: true,
    strict: true,
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
      additionalProperties: false,
    },
  },
];
async function getWeather(city) {
  const snapshots = {
    Paris: {
      city: "Paris",
      temperature_c: 22,
      condition: "Clear",
      source: "demo weather snapshot",
    },
  };
  if (typeof city !== "string" || !Object.hasOwn(snapshots, city)) {
    throw new Error(`No demo weather snapshot for ${city}.`);
  }
  return snapshots[city];
}
const instructions =
  "Start the weather lookup and answer the independent packing question " +
  "without waiting. Use the demo weather result when it arrives; never invent it.";

let response = await client.responses.create({
  model,
  tools,
  instructions,
  input:
    "Check the demo weather snapshot for Paris. Meanwhile, " +
    "list three essentials for any city trip.",
});

const call = response.output.find((item) => item.type === "function_call");
if (!call || call.name !== "get_weather") {
  throw new Error("The response did not include a weather call.");
}
const { city } = JSON.parse(call.arguments);
let latestResponseId = response.id;

// Calling an async function starts the application's job immediately.
const job = getWeather(city).catch((error) => ({ error: error.message }));
if (!call.async) {
  // Ordinary synchronous calls must finish before the model resumes.
  await job;
}
console.log(response.output);
// Independent work or conversation turns can happen here.
// Update latestResponseId after each continuation.
const result = await job;
response = await client.responses.create({
  model,
  tools,
  instructions,
  previous_response_id: latestResponseId,
  input: [
    {
      type: "function_call_output",
      call_id: call.call_id,
      output: JSON.stringify(result),
    },
  ],
});
latestResponseId = response.id;
console.log(response.output);
```

```python
import json
from concurrent.futures import ThreadPoolExecutor

from openai import OpenAI
from openai.types.responses import FunctionToolParam


def get_weather(city):
    # Demo data. Replace this function with your weather service.
    weather = {
        "Paris": {
            "city": "Paris",
            "temperature_c": 22,
            "condition": "Clear",
            "source": "demo weather snapshot",
        }
    }
    return weather[city]


worker = ThreadPoolExecutor()


def main():
    client = OpenAI()
    model = "gpt-6-astra"
    tools: list[FunctionToolParam] = [
        {
            "type": "function",
            "name": "get_weather",
            "description": "Read the demo weather snapshot for a city.",
            "async": True,
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string"}},
                "required": ["city"],
                "additionalProperties": False,
            },
        },
    ]

    instructions = (
        "Start the weather lookup and answer the independent packing "
        "question without waiting. Use the actual tool result when it "
        "arrives; never invent it. Identify the weather as demo data."
    )
    response = client.responses.create(
        model=model,
        tools=tools,
        instructions=instructions,
        input=(
            "Check the demo weather in Paris. Meanwhile, "
            "list three essentials for any city trip."
        ),
    )

    call = next(item for item in response.output if item.type == "function_call")
    arguments = json.loads(call.arguments)
    if call.name != "get_weather" or arguments != {"city": "Paris"}:
        raise ValueError("Expected a weather lookup for Paris")

    latest_response_id = response.id
    if call.async_:
        job = worker.submit(get_weather, **arguments)
        print(response.output_text)
        # Independent work or conversation turns can happen here.
        # Update latest_response_id after each continuation.
        result = job.result()
    else:
        result = get_weather(**arguments)

    response = client.responses.create(
        model=model,
        tools=tools,
        instructions=instructions,
        previous_response_id=latest_response_id,
        input=[
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result),
            },
        ],
    )
    print(response.output_text)


if __name__ == "__main__":
    try:
        main()
    finally:
        worker.shutdown(wait=True)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

type weatherArguments struct {
	City string `json:"city"`
}

type weatherSnapshot struct {
	City         string `json:"city"`
	TemperatureC int    `json:"temperature_c"`
	Condition    string `json:"condition"`
	Source       string `json:"source"`
}

func getWeather(city string) weatherSnapshot {
	// Demo data. Replace this function with your weather service.
	if city != "Paris" {
		panic("No demo weather snapshot for " + city)
	}
	return weatherSnapshot{
		City: city, TemperatureC: 22, Condition: "Clear", Source: "demo weather snapshot",
	}
}

func main() {
	client := openai.NewClient()
	ctx := context.Background()
	tool := responses.ToolParamOfFunction("get_weather", map[string]any{
		"type":                 "object",
		"properties":           map[string]any{"city": map[string]string{"type": "string"}},
		"required":             []string{"city"},
		"additionalProperties": false,
	}, true)
	tool.OfFunction.Description = openai.String("Read the demo weather snapshot for a city.")
	tool.OfFunction.Async = openai.Bool(true)
	tools := []responses.ToolUnionParam{tool}
	instructions := "Start the weather lookup and answer the independent packing question " +
		"without waiting. Use the actual tool result when it arrives; never invent it. " +
		"Identify the weather as demo data."
	response, err := client.Responses.New(ctx, responses.ResponseNewParams{
		Model:        "gpt-6-astra",
		Tools:        tools,
		Instructions: openai.String(instructions),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("Check the demo weather in Paris. Meanwhile, list three essentials for any city trip.")},
	})
	if err != nil {
		panic(err)
	}
	var call responses.ResponseFunctionToolCall
	for _, item := range response.Output {
		if item.Type == "function_call" && item.AsFunctionCall().Name == "get_weather" {
			call = item.AsFunctionCall()
			break
		}
	}
	if call.CallID == "" {
		panic("The response did not include a weather call.")
	}
	var arguments weatherArguments
	if err := json.Unmarshal([]byte(call.Arguments), &arguments); err != nil {
		panic(err)
	}
	latestResponseID := response.ID
	var result weatherSnapshot
	if call.Async {
		job := make(chan weatherSnapshot, 1)
		go func() { job <- getWeather(arguments.City) }()
		fmt.Println(response.OutputText())
		// Independent work or conversation turns can happen here.
		// Update latestResponseID after each continuation.
		result = <-job
	} else {
		result = getWeather(arguments.City)
	}
	output, err := json.Marshal(result)
	if err != nil {
		panic(err)
	}
	functionOutput := responses.ResponseInputItemParamOfFunctionCallOutput(string(output))
	functionOutput.OfFunctionCallOutput.CallID = openai.String(call.CallID)
	response, err = client.Responses.New(ctx, responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		Tools:              tools,
		Instructions:       openai.String(instructions),
		PreviousResponseID: openai.String(latestResponseID),
		Input:              responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{functionOutput}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFunctionToolCall;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

record WeatherArguments(String city) {}

record WeatherSnapshot(
    String city,
    @JsonProperty("temperature_c") int temperatureC,
    String condition,
    String source) {}

static WeatherSnapshot getWeather(String city) {
  // Demo data. Replace this function with your weather service.
  if (!city.equals("Paris")) {
    throw new IllegalArgumentException("No demo weather snapshot for " + city);
  }
  return new WeatherSnapshot(city, 22, "Clear", "demo weather snapshot");
}

FunctionTool tool =
    FunctionTool.builder()
        .name("get_weather")
        .description("Read the demo weather snapshot for a city.")
        .async(true)
        .strict(true)
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties", JsonValue.from(Map.of("city", Map.of("type", "string"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("city")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .build();
String instructions =
    "Start the weather lookup and answer the independent packing question without waiting. Use the actual tool result when it arrives; never invent it. Identify the weather as demo data.";
Response response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .addTool(tool)
                .instructions(instructions)
                .input(
                    "Check the demo weather in Paris. Meanwhile, list three essentials for any city trip.")
                .build());
ResponseFunctionToolCall call =
    response.output().stream()
        .flatMap(item -> item.functionCall().stream())
        .filter(item -> item.name().equals("get_weather"))
        .findFirst()
        .orElseThrow(
            () -> new IllegalStateException("The response did not include a weather call."));
WeatherArguments arguments = call.arguments(WeatherArguments.class);
String latestResponseId = response.id();
WeatherSnapshot result;
if (call.async().orElse(false)) {
  CompletableFuture<WeatherSnapshot> job =
      CompletableFuture.supplyAsync(() -> getWeather(arguments.city()));
  System.out.println(response.output());
  // Independent work or conversation turns can happen here.
  // Update latestResponseId after each continuation.
  result = job.join();
} else {
  result = getWeather(arguments.city());
}
response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .addTool(tool)
                .instructions(instructions)
                .previousResponseId(latestResponseId)
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofFunctionCallOutput(
                            ResponseInputItem.FunctionCallOutput.builder()
                                .callId(call.callId())
                                .output(new ObjectMapper().writeValueAsString(result))
                                .build())))
                .build());
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "json"
require "openai"

def get_weather(city)
  # Demo data. Replace this function with your weather service.
  raise "No demo weather snapshot for #{city}" unless city == "Paris"

  {
    city: city,
    temperature_c: 22,
    condition: "Clear",
    source: "demo weather snapshot"
  }
end

client = OpenAI::Client.new
tools = [
  OpenAI::Models::Responses::FunctionTool.new(
    name: "get_weather",
    description: "Read the demo weather snapshot for a city.",
    async: true,
    strict: true,
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
      additionalProperties: false
    }
  )
]
instructions = "Start the weather lookup and answer the independent packing question " \
  "without waiting. Use the actual tool result when it arrives; never invent it. " \
  "Identify the weather as demo data."
response = client.responses.create(
  model: "gpt-6-astra",
  tools: tools,
  instructions: instructions,
  input: "Check the demo weather in Paris. Meanwhile, list three essentials for any city trip."
)
call = response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall) && item.name == "get_weather"
end
unless call.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall)
  raise "The response did not include a weather call."
end

city = JSON.parse(call.arguments).fetch("city")
latest_response_id = response.id
result = if call.async
           job = Thread.new { get_weather(city) }
           puts(response.output_text)
           # Independent work or conversation turns can happen here.
           # Update latest_response_id after each continuation.
           job.value
         else
           get_weather(city)
         end
response = client.responses.create(
  model: "gpt-6-astra",
  tools: tools,
  instructions: instructions,
  previous_response_id: latest_response_id,
  input: [
    OpenAI::Models::Responses::ResponseInputItem::FunctionCallOutput.new(
      call_id: call.call_id,
      output: JSON.generate(result)
    )
  ]
)
puts(response.output_text)
```


响应可以同时包含异步调用和回复。如果在任务完成之前发生了其他对话轮次，更新 `latest_response_id` 以从最新的响应继续，同时保留原始工具 `call_id`.

若要更早地派发，可使用 [streaming](https://developers.openai.com/api/docs/guides/streaming-responses),在完整调用项到达时启动任务,同时继续读取响应。

## 添加等待工具

等待工具让模型自行决定何时需要获取待处理的结果。例如，模型可以发起两个价格查询请求，先去处理其他独立的任务，等到需要比较价格时再等待。

为每个异步工具添加一个 `task_handle` 参数。模型会为每次调用分配一个句柄，你的应用将其绑定到原始的API `call_id` 和正在运行的任务上。在整个对话过程中保持句柄唯一，包括已完成的任务和重复的查询请求。

将等待工具定义为普通的同步函数：省略 `async` 或将其设置为 `false`。其结构和行为由你的应用自行定义。 `wait_for_tasks` 不是 Responses 内置工具。

在请求的 `tools` 数组中使用这些定义：

```json
[
  {
    "type": "function",
    "name": "lookup_price",
    "async": true,
    "description": "Look up a product price in the background. Choose a fresh task_handle unique within this conversation, including completed tasks.",
    "strict": true,
    "parameters": {
      "type": "object",
      "properties": {
        "sku": { "type": "string" },
        "task_handle": { "type": "string" }
      },
      "required": ["sku", "task_handle"],
      "additionalProperties": false
    }
  },
  {
    "type": "function",
    "name": "wait_for_tasks",
    "description": "Wait for selected tasks whose results you need. Pass a nonempty list of distinct task_handles from your earlier lookup_price calls. Results arrive on their original calls; this tool returns status only. Do not wait again for results that have already arrived.",
    "strict": true,
    "parameters": {
      "type": "object",
      "properties": {
        "task_handles": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["task_handles"],
      "additionalProperties": false
    }
  }
]
```

### 注册每个任务

在处理依赖性的等待之前，先注册并启动每一次启动调用。调用可以一起到达，也可以跨多个响应到达。以下示例输出项展示了两次启动调用和一个依赖于这两者的等待调用：

```json
[
  {
    "type": "function_call",
    "name": "lookup_price",
    "async": true,
    "call_id": "call_widget",
    "arguments": "{\"sku\":\"WIDGET\",\"task_handle\":\"widget_price_1\"}"
  },
  {
    "type": "function_call",
    "name": "lookup_price",
    "async": true,
    "call_id": "call_gadget",
    "arguments": "{\"sku\":\"GADGET\",\"task_handle\":\"gadget_price_1\"}"
  },
  {
    "type": "function_call",
    "name": "wait_for_tasks",
    "call_id": "call_wait",
    "arguments": "{\"task_handles\":[\"widget_price_1\",\"gadget_price_1\"]}"
  }
]
```

你的应用注册表会将每个句柄绑定到其原始调用和正在运行的任务：

| 任务句柄      | 原始调用 ID | 作业                 |
| ---------------- | ---------------- | ------------------- |
| `widget_price_1` | `call_widget`    | WIDGET 价格查询 |
| `gadget_price_1` | `call_gadget`    | GADGET 价格查询 |

在整个对话期间保留该注册表，以防止已完成任务的句柄被重复使用。

### 在等待状态前返回结果

解析注册表中请求的句柄，仅等待这些作业。将每个新完成的结果按其原始顺序返回。 `call_id`，然后返回 wait 调用自身上的状态 `call_id`。该顺序使模型在恢复时能拿到结果。

例如，在下一个请求的输入中发送这些输出项 `input` 数组中。价格为示意性数字：

```json
[
  {
    "type": "function_call_output",
    "call_id": "call_widget",
    "output": "{\"task_handle\":\"widget_price_1\",\"price_cents\":1200,\"currency\":\"USD\"}"
  },
  {
    "type": "function_call_output",
    "call_id": "call_gadget",
    "output": "{\"task_handle\":\"gadget_price_1\",\"price_cents\":1500,\"currency\":\"USD\"}"
  },
  {
    "type": "function_call_output",
    "call_id": "call_wait",
    "output": "{\"status\":\"completed\",\"completed_task_handles\":[\"widget_price_1\",\"gadget_price_1\"]}"
  }
]
```

将 `previous_response_id` 设置为最新的响应 ID，并在延续请求中包含这些工具和指令。你的应用也可以在结果可用时立即交付，而无需 wait 调用。仅当模型下一步依赖于尚未到达的结果时，才使用 wait 工具。

## 兼容性

GPT-6 Astra 及更高版本模型支持异步工具调用。

异步执行适用于你应用中运行的函数和自定义工具，不适用于托管内置工具。请直接调用工具；不要为 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).

配置异步工具。在 [多智能体模式](https://developers.openai.com/api/docs/guides/responses-multi-agent)，下，不要将异步工具与并行工具调用结合使用。