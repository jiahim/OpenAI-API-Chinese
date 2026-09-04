# Async tool calling

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Async tool calling lets the model continue working after it calls a tool, without waiting for that tool's result. Use it to start slow lookup requests early, answer independent parts of a request, and provide results when your application has them.

## How async tools work

A normal [function call](https://developers.openai.com/api/docs/guides/function-calling) pauses the model's turn to wait for a tool response. Set `async: true` on a function or custom tool definition to let the model continue working after issuing that call, before your application returns the output.

Your application still executes the tool. Async tools don't move execution to
  OpenAI or manage your background jobs.

This differs from [Background mode](https://developers.openai.com/api/docs/guides/background), which runs response generation asynchronously. Async tool calling lets the model continue working while your application runs a tool.

When a job finishes, include its output in a later Responses request. Use the original API `call_id` to match the result to its call:

| Tool type | Call item          | Output item               |
| --------- | ------------------ | ------------------------- |
| Function  | `function_call`    | `function_call_output`    |
| Custom    | `custom_tool_call` | `custom_tool_call_output` |

## Call an async tool

Add `async: true` to the tool definition. The corresponding call items in `response.output` include `async: true`.

Run a weather lookup in the background

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const model = "gpt-6-astra";

/** @type {OpenAI.Responses.FunctionTool[]} */
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

  {city: city, temperature_c: 22, condition: "Clear", source: "demo weather snapshot"}
end

client = OpenAI::Client.new
tools = [OpenAI::Models::Responses::FunctionTool.new(
  name: "get_weather",
  description: "Read the demo weather snapshot for a city.",
  async: true,
  strict: true,
  parameters: {
    type: "object",
    properties: {city: {type: "string"}},
    required: ["city"],
    additionalProperties: false
  }
)]
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
  input: [OpenAI::Models::Responses::ResponseInputItem::FunctionCallOutput.new(
    call_id: call.call_id,
    output: JSON.generate(result)
  )]
)
puts(response.output_text)
```


The response can contain both the async call and an answer. If other conversation turns happen before the job finishes, update `latest_response_id` to continue from the latest response while keeping the original tool `call_id`.

For earlier dispatch with [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), start the job when its complete call item arrives while you continue consuming the response.

## Add a wait tool

A wait tool lets the model choose when it needs a pending result. For example, it can launch two price lookup requests, work on something independent, and wait only when it's ready to compare prices.

Add a `task_handle` argument to each async tool. The model assigns a handle to each call, and your application binds it to the original API `call_id` and the running job. Keep handles unique throughout the conversation, including completed tasks and repeated lookup requests.

Define the wait tool as an ordinary synchronous function: omit `async` or set it to `false`. Its schema and behavior belong to your application. `wait_for_tasks` isn't a built-in Responses tool.

Use these definitions in the request's `tools` array:

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

### Register each job

Register and start each launch before processing a dependent wait. Calls can arrive together or across responses. The following illustrative output items show two launches and a wait that depends on both:

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

Your application's registry binds each handle to its original call and running job:

| Task handle      | Original call ID | Job                 |
| ---------------- | ---------------- | ------------------- |
| `widget_price_1` | `call_widget`    | WIDGET price lookup |
| `gadget_price_1` | `call_gadget`    | GADGET price lookup |

Keep the registry for the entire conversation to prevent reuse of a completed task's handle.

### Deliver results before wait status

Resolve the requested handles in the registry and await only those jobs. Return each newly completed result on its original `call_id`, then return status on the wait call's own `call_id`. This order gives the model the results when it resumes.

For example, send these output items in the next request's `input` array. The prices are illustrative:

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

Set `previous_response_id` to the latest response ID, and include the tools and instructions in the continuation request. Your application can also deliver results as they become available, without a wait call. Only use the wait tool when the model's next step depends on results that haven't arrived.

## Compatibility

Async tool calling is supported by GPT-6 Astra and later models.

Async execution applies to function and custom tools that your application runs. It doesn't apply to hosted built-in tools. Use direct tool calls; don't configure async tools for [programmatic tool calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).

In [Multi-agent mode](https://developers.openai.com/api/docs/guides/responses-multi-agent), don't combine async tools with parallel tool calls.