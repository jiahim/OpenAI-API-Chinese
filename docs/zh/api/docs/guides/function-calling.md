# Function calling

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

**Function calling** （也称为 **tool calling**）为 OpenAI 模型提供了一种强大而灵活的方式来与外部系统对接，并访问其训练数据之外的数据。本指南介绍如何将模型连接到由你的应用提供的数据和操作。我们将展示如何使用函数工具（由 JSON schema 定义）以及可处理自由格式文本输入和输出的自定义工具。

对于 智能体 API 会话，请使用 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 来注册函数并处理会话操作请求。本指南中的示例展示的是 Responses API 和 Chat Completions 集成。

如果你的应用包含大量函数或较大的 schema，可以将函数调用与 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 结合使用，以延迟加载不常用的工具，仅在模型需要时再加载它们。仅 `gpt-5.4` 及更高版本的模型支持 `tool_search`.

GPT-6 Astra 和 [GPT-6.1
  Sol](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 要求使用
  Responses API 进行工具调用。Chat Completions 示例使用 GPT-5.6
  Terra，并将推理功能禁用。请参阅 [migration
  guide](https://developers.openai.com/api/docs/guides/migrate-to-responses) 来更新现有的
  集成。

## 工作原理

我们先了解几个关于工具调用的关键术语。在对工具调用形成统一的术语认知之后,我们会通过一些实际示例向你演示其用法。



### 工具 - 我们赋予模型的功能



一个 **function** 或 **tool** 在抽象意义上指的是我们告知模型可以使用的某项功能。当模型针对提示生成回复时，它可能判断需要使用某个 tool 提供的数据或功能来完成提示中的指令。

你可以让模型使用能够完成下列用途的 tool：

- 获取指定位置的今日天气
- 访问指定用户 ID 的账户详情
- 为丢失的订单发起退款

或者任何其他你希望模型在响应提示时能够知道或执行的内容。

当我们使用提示向模型发出 API 请求时，可以包含一个模型可以考虑使用的工具列表。例如，如果我们希望模型能够回答世界上某个地方的当前天气问题，可以为其提供一个 `get_weather` 接受 `location` 作为参数的工具。







### 工具调用 - 模型使用工具的请求



一个 **function call** 或 **tool call** 指的是我们从模型获取的一种特殊响应，当模型检查提示词后，认为需要调用我们提供给它的某个工具才能遵循提示词中的指令时，就会产生这种响应。

如果模型在一次 API 请求中收到类似“巴黎的天气怎么样？”这样的提示词，它可能会针对 `get_weather` 工具发出一次 tool call，并将 `Paris` 作为 `location` 参数传入。







### 工具调用输出 - 我们为模型生成的输出



一个 **function call output** 或 **tool call output** 指的是工具使用模型工具调用的输入所生成的响应。工具调用输出可以是结构化的 JSON 或纯文本，并且应包含对特定模型工具调用的引用（在 `call_id` 在后续示例中引用）。
为了完成我们的天气示例：

- 模型可以访问一个 `get_weather` **tool** ，该工具接受 `location` 作为参数。
- 面对像“巴黎的天气怎么样？”这样的提示时，模型会返回一个 **工具调用** ，其中包含一个值为 `location` 的参数。 `Paris`
- 该 **工具调用输出** 可能返回一个 JSON 对象（例如， `{"temperature": "25", "unit": "C"}`，表示当前温度为 25 度）， [图像内容](https://developers.openai.com/api/docs/guides/images-vision)，或 [文件内容](https://developers.openai.com/api/docs/guides/file-inputs).

然后，我们将所有工具定义、原始提示、模型的工具调用以及工具调用输出一起发回模型，最终得到类似以下的文本响应：

```
The weather in Paris today is 25C.
```







### 函数与工具



- 函数是一种由 JSON schema 定义的特定工具。函数定义允许模型将数据传递给你的应用，你的代码可以在此访问数据或执行模型建议的操作。
- 除了函数工具之外，还有自定义工具（本文将介绍），它们支持自由文本的输入和输出。
- OpenAI 平台还提供了 [内置工具](https://developers.openai.com/api/docs/guides/tools)。这些工具使模型能够 [搜索网页](https://developers.openai.com/api/docs/guides/tools-web-search), [运行代码](https://developers.openai.com/api/docs/guides/tools-code-interpreter)、访问 [MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，的功能，以及执行更多操作。





### 工具调用流程

工具调用是你的应用与模型之间通过 OpenAI API 进行的多步对话。工具调用流程包含五个高层步骤：

1. 使用模型可能调用的工具向模型发起请求
1. 接收来自模型的工具调用
1. 在应用端使用工具调用的输入执行代码
1. 使用工具输出向模型发起第二次请求
1. 接收来自模型的最终响应（或更多工具调用）

![Function Calling Diagram Steps](https://cdn.openai.com/API/docs/images/function-calling-diagram-steps.png)

使用 Responses 时，你的应用可以根据任务需要为任意数量的工具调用延续此流程。如果你希望使用一个围绕该循环封装常见编排逻辑的框架，请参阅 [how the Responses API compares with the Agents SDK](https://developers.openai.com/api/docs/guides/agents#agents-sdk-vs-responses-api).

## 函数工具示例

让我们看一个针对以下函数的端到端工具调用流程，该函数用于获取 `get_horoscope` 某个星座的每日运势。



  完整的工具调用示例

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const openai = new OpenAI();

// 1. Define a list of callable tools for the model

const tools = [
  {
    type: "function",
    name: "get_horoscope",
    description: "Get today's horoscope for an astrological sign.",
    parameters: {
      type: "object",
      properties: {
        sign: {
          type: "string",
          description: "An astrological sign like Taurus or Aquarius",
        },
      },
      required: ["sign"],
      additionalProperties: false,
    },
    strict: true,
  },
];

function getHoroscope(sign) {
  return `${sign}: Next Tuesday you will befriend a baby otter.`;
}

// Create a running input list we will add to over time

let input = [
  { role: "user", content: "What is my horoscope? I am an Aquarius." },
];

// 2. Prompt the model with tools defined
let response = await openai.responses.create({
  model: "gpt-6-astra",
  tools,
  input,
});

// Preserve model output for the next turn
input.push(...toResponseInputItems(response.output));

for (const item of response.output) {
  if (item.type !== "function_call") continue;

  if (item.name === "get_horoscope") {
    // 3. Execute the function logic for get_horoscope
    const { sign } = JSON.parse(item.arguments);
    const horoscope = getHoroscope(sign);

    // 4. Provide function call results to the model
    input.push({
      type: "function_call_output",
      call_id: item.call_id,
      output: horoscope,
    });
  }
}

console.log("Final input:");
console.log(JSON.stringify(input, null, 2));

response = await openai.responses.create({
  model: "gpt-6-astra",
  instructions: "Respond only with a horoscope generated by a tool.",
  tools,
  input,
});

// 5. The model should be able to give a response!
console.log("Final output:");
console.log(response.output_text);
```

```python
from openai import OpenAI
import json

client = OpenAI()

# 1. Define a list of callable tools for the model
tools = [
    {
        "type": "function",
        "name": "get_horoscope",
        "description": "Get today's horoscope for an astrological sign.",
        "parameters": {
            "type": "object",
            "properties": {
                "sign": {
                    "type": "string",
                    "description": "An astrological sign like Taurus or Aquarius",
                },
            },
            "required": ["sign"],
        },
    },
]


def get_horoscope(sign):
    return f"{sign}: Next Tuesday you will befriend a baby otter."


# Create a running input list we will add to over time
input_list = [{"role": "user", "content": "What is my horoscope? I am an Aquarius."}]

# 2. Prompt the model with tools defined
response = client.responses.create(
    model="gpt-6-astra",
    tools=tools,
    input=input_list,
)

# Save function call outputs for subsequent requests
input_list += response.output

for item in response.output:
    if item.type == "function_call":
        if item.name == "get_horoscope":
            # 3. Execute the function logic for get_horoscope
            sign = json.loads(item.arguments)["sign"]
            horoscope = get_horoscope(sign)

            # 4. Provide function call results to the model
            input_list.append(
                {
                    "type": "function_call_output",
                    "call_id": item.call_id,
                    "output": horoscope,
                }
            )

print("Final input:")
print(input_list)

response = client.responses.create(
    model="gpt-6-astra",
    instructions="Respond only with a horoscope generated by a tool.",
    tools=tools,
    input=input_list,
)

# 5. The model should be able to give a response!
print("Final output:")
print(response.model_dump_json(indent=2))
print("\n" + response.output_text)
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

func main() {
	client := openai.NewClient()
	tool := horoscopeResponseTool()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is my horoscope? I am an Aquarius.")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}

	var functionOutput responses.ResponseInputItemUnionParam
	for _, output := range response.Output {
		if output.Type != "function_call" {
			continue
		}
		call := output.AsFunctionCall()
		if call.Name != "get_horoscope" {
			continue
		}
		var arguments struct {
			Sign string `json:"sign"`
		}
		if err := json.Unmarshal([]byte(call.Arguments), &arguments); err != nil {
			panic(err)
		}
		functionOutput = responses.ResponseInputItemParamOfFunctionCallOutput(getHoroscope(arguments.Sign))
		functionOutput.OfFunctionCallOutput.CallID = openai.String(call.CallID)
	}
	if functionOutput.OfFunctionCallOutput == nil {
		panic("the model did not call get_horoscope")
	}

	response, err = client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(response.ID),
		Instructions:       openai.String("Respond only with a horoscope generated by a tool."),
		Input:              responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{functionOutput}},
		Tools:              []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}

func horoscopeResponseTool() responses.ToolUnionParam {
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"sign": map[string]any{"type": "string", "description": "An astrological sign like Taurus or Aquarius"},
		},
		"required":             []string{"sign"},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction("get_horoscope", parameters, true)
	tool.OfFunction.Description = openai.String("Get today's horoscope for an astrological sign.")
	return tool
}

func getHoroscope(sign string) string {
	return fmt.Sprintf("%s: Next Tuesday you will befriend a baby otter.", sign)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;
import java.util.Map;

FunctionTool horoscope =
    FunctionTool.builder()
        .name("get_horoscope")
        .description("Get today's horoscope for an astrological sign.")
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties",
                    JsonValue.from(
                        Map.of(
                            "sign",
                            Map.of(
                                "type", "string",
                                "description",
                                    "An astrological sign like Taurus or Aquarius"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("sign")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .strict(true)
        .build();

var firstResponse =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("What is my horoscope? I am an Aquarius.")
                .addTool(horoscope)
                .build());

var functionCall =
    firstResponse.output().stream()
        .flatMap(item -> item.functionCall().stream())
        .filter(call -> call.name().equals("get_horoscope"))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("The model did not call get_horoscope"));

record HoroscopeArguments(String sign) {}

String sign = functionCall.arguments(HoroscopeArguments.class).sign();
ResponseCreateParams followUp =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .instructions("Respond only with a horoscope generated by a tool.")
        .previousResponseId(firstResponse.id())
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofFunctionCallOutput(
                    ResponseInputItem.FunctionCallOutput.builder()
                        .callId(functionCall.callId())
                        .output(sign + ": Embrace an unexpected opportunity today.")
                        .build())))
        .addTool(horoscope)
        .build();

client.responses().create(followUp).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "json"
require "openai"

client = OpenAI::Client.new
tools = [
  {
    type: :function,
    name: "get_horoscope",
    description: "Get today's horoscope for an astrological sign.",
    parameters: {
      type: :object,
      properties: { sign: { type: :string } },
      required: ["sign"],
      additionalProperties: false
    },
    strict: true
  }
]

first_response = client.responses.create(
  model: "gpt-6-astra",
  input: "What is my horoscope? I am an Aquarius.",
  tools: tools
)
function_call = first_response.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall) &&
    item.name == "get_horoscope"
end
unless function_call.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall)
  raise "The model did not call get_horoscope"
end

arguments = JSON.parse(function_call.arguments, symbolize_names: true)
sign = arguments.fetch(:sign)
response = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: first_response.id,
  input: [
    {
      type: :function_call_output,
      call_id: function_call.call_id,
      output: "#{sign}: Embrace an unexpected opportunity today."
    }
  ],
  tools: tools
)

puts(response.output_text)
```



请注意，对于像 GPT-5 或 o4-mini 这样的推理模型，
  模型响应中返回的、带有工具调用的任何推理项也必须与工具
  调用输出一起传回。

## 定义函数

函数通常在每个 `tools` API 请求的参数中声明。配合 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，你的应用也可以在交互后续阶段再加载延迟函数。无论采用哪种方式，每个可调用函数都使用相同的 schema 结构。函数定义具有以下属性：

| 字段         | 说明                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| `type`        | 应始终为 `function`                                                |
| `name`        | 函数的名称（例如， `get_weather`)                                |
| `description` | 有关何时及如何使用该函数的详细信息                                     |
| `parameters`  | [JSON 架构](https://json-schema.org/) 定义函数的输入参数 |
| `strict`      | 是否对该函数调用强制启用严格模式                            |

下面是一个函数定义的示例，用于 `get_weather` function

```json
{
  "type": "function",
  "name": "get_weather",
  "description": "Retrieves current weather for the given location.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and country e.g. Bogotá, Colombia"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Units the temperature will be returned in."
      }
    },
    "required": ["location", "units"],
    "additionalProperties": false
  },
  "strict": true
}
```

由于 `parameters` 由一个 [JSON schema](https://json-schema.org/),你可以利用它的许多丰富特性,例如属性类型、枚举、描述、嵌套对象和递归对象。

## 定义命名空间

使用命名空间按域对相关工具进行分组，例如 `crm`, `billing`，或 `shipping`。命名空间有助于组织相似的工具，当模型必须在服务于不同系统或用途的工具之间进行选择时（例如一个搜索工具用于你的 CRM，另一个用于你的工单系统），命名空间尤为有用。

```json
{
  "type": "namespace",
  "name": "crm",
  "description": "CRM tools for customer lookup and order management.",
  "tools": [
    {
      "type": "function",
      "name": "get_customer_profile",
      "description": "Fetch a customer profile by customer ID.",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" }
        },
        "required": ["customer_id"],
        "additionalProperties": false
      }
    },
    {
      "type": "function",
      "name": "list_open_orders",
      "description": "List open orders for a customer ID.",
      "defer_loading": true,
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" }
        },
        "required": ["customer_id"],
        "additionalProperties": false
      }
    }
  ]
}
```

## Tool search

如果需要让模型访问庞大的工具生态，你可以借助 `tool_search`。来延迟加载部分或全部工具。该 `tool_search` 工具允许模型搜索相关工具，将其加入模型上下文，然后使用它们。只有 `gpt-5.4` 及更高版本的模型支持该功能。请阅读 [工具搜索指南](https://developers.openai.com/api/docs/guides/tools-tool-search) 以了解更多信息。



### 定义函数的最佳实践

1. **编写清晰、详细的函数名称、参数说明和指令。**
   - **明确描述函数的用途以及每个参数** （及其格式）的含义，以及输出所表示的内容。
   - **使用系统提示来描述何时（以及何时不）使用每个函数。** 通常，告知模型 _究竟_ 该做什么。
   - **包含示例和边界情况**，尤其要纠正反复出现的失败。（**注意：** 添加示例可能会降低 [推理模型](https://developers.openai.com/api/docs/guides/reasoning).)
   - **对于延迟加载的工具，将详细指导放在函数描述中，并保持命名空间描述简洁。** 命名空间帮助模型选择要加载的内容；函数描述帮助模型正确使用已加载的工具。

1. **应用软件工程最佳实践。**
   - **使函数可预测且符合直觉**. ([最小意外原则](https://en.wikipedia.org/wiki/Principle_of_least_astonishment))
   - **使用枚举** 和对象结构来防止无效状态。例如， `toggle_light(on: bool, off: bool)` 允许无效调用。
   - **通过实习生测试。** 只根据你给模型的内容，实习生/人类能否正确使用该函数？（如果不能，他们会问你哪些问题？请把答案补充到提示中。）

1. **把负担从模型转移到代码上，尽可能用代码实现。**
   - **不要让模型填写你已经知道的参数。** 例如，如果你已经有一个 `order_id` 基于先前的菜单时，不要包含 `order_id` 参数。请改为定义 `submit_refund()` （无参数），并在代码中传递 `order_id` 。
   - **合并那些总是按顺序调用的函数。** 例如，如果你始终调用 `mark_location()` 后 `query_location()`，只需将标记逻辑移入查询函数调用即可。

1. **保持初始可用函数的数量较少，以提高准确率。**
   - **评估你的性能** 在不同函数数量下的表现。
   - **目标是让单个轮次开始时可用的函数少于 20 个** ，不过这只是一个软性建议。
   - **使用工具搜索** 来推迟工具集中较大或不常用的部分，而不是一次性全部暴露出来。

1. **利用 OpenAI 资源。**
   - **生成并迭代函数模式** 在 [Playground](https://platform.openai.com/playground).
   - **考虑 [fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization) 以提高函数调用准确率** ，适用于大量函数或复杂任务。（[cookbook](https://developers.openai.com/cookbook/examples/fine_tuning_for_function_calling))

### Token 用量

在底层，函数会以模型已训练过的语法被注入到系统消息中。这意味着可调用的函数定义会计入模型的上下文限制，并按输入 token 计费。如果你遇到 token 上限问题，建议限制预先加载的函数数量、尽量缩短描述，或者使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 以按需延迟加载工具。

也可以使用 [微调](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 来减少使用的 token 数量，如果你的工具规范中定义了大量函数的话。

## 处理函数调用

当模型调用函数时，你必须执行该函数并返回结果。由于模型响应可能包含零个、一个或多个调用，最佳实践是假设存在多个调用。



响应 `output` 数组包含一个具有 `type` 值为 `function_call`。的条目。每个具有 `call_id` （稍后用于提交函数结果）的条目， `name`，以及 JSON 编码的 `arguments`.

包含多个函数调用的示例响应

```json
[
    {
        "id": "fc_12345xyz",
        "call_id": "call_12345xyz",
        "type": "function_call",
        "name": "get_weather",
        "arguments": "{\"location\":\"Paris, France\"}"
    },
    {
        "id": "fc_67890abc",
        "call_id": "call_67890abc",
        "type": "function_call",
        "name": "get_weather",
        "arguments": "{\"location\":\"Bogotá, Colombia\"}"
    },
    {
        "id": "fc_99999def",
        "call_id": "call_99999def",
        "type": "function_call",
        "name": "send_email",
        "arguments": "{\"to\":\"bob@email.com\",\"body\":\"Hi bob\"}"
    }
]
```


如果你正在使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，你也可能会看到 `tool_search_call` 和 `tool_search_output` 项出现在 `function_call`。之前。一旦函数被加载，按照此处展示的相同方式处理函数调用。

执行函数调用并追加结果

```javascript
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

input.push(...toResponseInputItems(response.output));

for (const toolCall of response.output) {
  if (toolCall.type !== "function_call") {
    continue;
  }

  const name = toolCall.name;
  const args = JSON.parse(toolCall.arguments);

  const result = await callFunction(name, args);
  input.push({
    type: "function_call_output",
    call_id: toolCall.call_id,
    output: result.toString(),
  });
}
```

```python
input_messages += response.output

for tool_call in response.output:
    if tool_call.type != "function_call":
        continue

    name = tool_call.name
    args = json.loads(tool_call.arguments)

    result = call_function(name, args)
    input_messages.append(
        {
            "type": "function_call_output",
            "call_id": tool_call.call_id,
            "output": json.dumps(result),
        }
    )
```

```go
input = append(input, responseOutputAsInput(response.Output)...)

for _, output := range response.Output {
	if output.Type != "function_call" {
		continue
	}
	toolCall := output.AsFunctionCall()
	var arguments functionArguments
	if err := json.Unmarshal([]byte(toolCall.Arguments), &arguments); err != nil {
		panic(err)
	}
	result, err := callFunction(toolCall.Name, arguments)
	if err != nil {
		panic(err)
	}
	toolOutput := responses.ResponseInputItemParamOfFunctionCallOutput(result)
	toolOutput.OfFunctionCallOutput.CallID = openai.String(toolCall.CallID)
	input = append(input, toolOutput)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

response.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(input::add);
response.output().stream()
    .flatMap(item -> item.functionCall().stream())
    .forEach(
        call -> {
          String result;
          if (call.name().equals("get_weather")) {
            record Coordinates(double latitude, double longitude) {}

            Coordinates coordinates = call.arguments(Coordinates.class);
            result =
                JsonValue.from(
                        Map.of(
                            "latitude", coordinates.latitude(),
                            "longitude", coordinates.longitude(),
                            "temperature_c", 18))
                    .toString();
          } else if (call.name().equals("send_email")) {
            record Email(String to, String body) {}

            Email message = call.arguments(Email.class);
            result = JsonValue.from(Map.of("to", message.to(), "status", "sent")).toString();
          } else {
            throw new IllegalArgumentException("Unknown function: " + call.name());
          }
          var output =
              ResponseInputItem.ofFunctionCallOutput(
                  ResponseInputItem.FunctionCallOutput.builder()
                      .callId(call.callId())
                      .output(result)
                      .build());
          input.add(output);
          System.out.println(call.callId() + " " + result);
        });
```

```ruby
input.concat(response.output)

response.output.each do |tool_call|
  next unless tool_call.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall)

  arguments = JSON.parse(tool_call.arguments)
  result = call_function(tool_call.name, arguments)

  input << {
    type: :function_call_output,
    call_id: tool_call.call_id,
    output: JSON.generate(result)
  }
end
```



在上面的示例中，我们有一个假设性的 `call_function` 来路由每个调用。下面是一个可能的实现：

执行函数调用并追加结果

```javascript
const callFunction = async (name, args) => {
  if (name === "get_weather") {
    return getWeather(args.latitude, args.longitude);
  }
  if (name === "send_email") {
    return sendEmail(args.to, args.body);
  }
  throw new Error(`Unknown function: ${name}`);
};
```

```python
def call_function(name, args):
    if name == "get_weather":
        return get_weather(**args)
    if name == "send_email":
        return send_email(**args)
    raise ValueError(f"Unknown function: {name}")
```

```go
func callFunction(name string, arguments functionArguments) (string, error) {
	switch name {
	case "get_weather":
		return getWeather(arguments.Location), nil
	case "send_email":
		return sendEmail(arguments.To, arguments.Body), nil
	default:
		return "", fmt.Errorf("unknown function: %s", name)
	}
}
```

```ruby
def call_function(name, arguments)
  case name
  when "get_weather"
    FunctionCallingExample.get_weather(
      arguments.fetch("latitude"),
      arguments.fetch("longitude")
    )
  when "send_email"
    FunctionCallingExample.send_email(
      arguments.fetch("to"),
      arguments.fetch("body")
    )
  else
    raise ArgumentError, "Unknown function: #{name}"
  end
end
```


### 格式化结果

你在 `function_call_output` 消息中传入的结果通常应为字符串，格式由你自行决定（JSON、错误码、纯文本等）。模型会根据需要解读该字符串。

对于返回图像或文件的函数，你可以传入 [图像或文件对象数组](https://developers.openai.com/api/reference/resources/responses/methods/create#responses_create-input-input_item_list-item-function_tool_call_output-output) 来代替字符串。

如果你的函数没有返回值（例如， `send_email`），请返回一个表示成功或失败的字符串，例如 `"success"`.

### 将结果整合到响应中



在将结果附加到你的 `input`，后，你可以将它们发回模型以获取最终响应。

将结果发回模型

```javascript
const response = await openai.responses.create({
  model: "gpt-6-astra",
  input,
  tools,
});
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    input=input_messages,
    tools=responses_tools,
)

print(response.output_text)
```

```go
response, err = client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: "gpt-6-astra",
	Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
	Tools: tools,
})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFunctionToolCall;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;
import java.util.Map;

FunctionTool weather =
    FunctionTool.builder()
        .name("get_weather")
        .description("Get the weather for a city.")
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties", JsonValue.from(Map.of("city", Map.of("type", "string"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("city")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .strict(true)
        .build();

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("What is the weather like in Paris?")
                        .build()),
                ResponseInputItem.ofFunctionCall(
                    ResponseFunctionToolCall.builder()
                        .callId("call_weather")
                        .name("get_weather")
                        .arguments("{\"city\":\"Paris\"}")
                        .build()),
                ResponseInputItem.ofFunctionCallOutput(
                    ResponseInputItem.FunctionCallOutput.builder()
                        .callId("call_weather")
                        .output("{\"city\":\"Paris\",\"temperature_c\":18}")
                        .build())))
        .addTool(weather)
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
input = [
  {
    role: :user,
    content: "What is the weather like in Paris?"
  },
  {
    type: :function_call,
    call_id: "call_weather",
    name: "get_weather",
    arguments: '{"city":"Paris"}'
  },
  {
    type: :function_call_output,
    call_id: "call_weather",
    output: '{"city":"Paris","temperature_c":18}'
  }
]
tools = [
  {
    type: :function,
    name: "get_weather",
    description: "Get the weather for a city",
    parameters: {
      type: :object,
      properties: { city: { type: :string } },
      required: ["city"],
      additionalProperties: false
    },
    strict: true
  }
]
response = client.responses.create(
  model: "gpt-6-astra",
  input: input,
  tools: tools
)

puts(response.output_text)
```



最终响应

```json
"It's about 15°C in Paris, 18°C in Bogotá, and I've sent that email to Bob."
```


## 其他配置

### 工具选择

默认情况下，模型将决定何时使用工具以及使用多少工具。你可以通过以下参数强制指定特定行为 `tool_choice` 参数。

1. **自动：** (_默认_) 调用零个、一个或多个函数。 `tool_choice: "auto"`
1. **必需：** 调用一个或多个函数。
   `tool_choice: "required"`
1. **强制函数：** 恰好调用一个指定的函数。
   `tool_choice: {"type": "function", "name": "get_weather"}`
1. **允许的工具：** 将模型可以进行的工具调用限制为
   模型可用工具的子集。

**使用场景 `allowed_tools`**

如果你希望配置一个 `allowed_tools` 列表，以便仅在模型请求中开放部分工具，同时又不修改传入的工具列表，从而最大化地利用
在多次模型请求中开放部分工具的子集，而不修改你传入的工具列表，从而充分利用 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

```json
"tool_choice": {
    "type": "allowed_tools",
    "mode": "auto",
    "tools": [
        { "type": "function", "name": "get_weather" },
        { "type": "function", "name": "search_docs" }
    ]
  }
}
```

你也可以将 `tool_choice` 设置为 `"none"` 以模拟不传入任何函数时的行为。

当你使用工具搜索时， `tool_choice` 仍然适用于当前轮次中可调用的工具。这在你加载了部分工具子集，并希望将模型约束在该子集内时最为有用。

### 并行函数调用

在以 GPT-5 开头的支持模型上，函数可以并行调用
  当 [内置工具](https://developers.openai.com/api/docs/guides/tools) 也可用时。内置
  工具不能包含在并行函数调用批次中。

模型可以选择在单次轮次中调用多个函数。你可以通过设置 `parallel_tool_calls` 设置为 `false`，来防止这种情况，这可确保只调用零个或一个工具。

**注意：** 目前，如果你正在使用微调模型，并且模型在一次轮次中调用多个函数，那么 [严格模式](#strict-mode) 将在这些调用中被禁用。

**针对 `gpt-4.1-nano-2025-04-14`:** 此版本的 `gpt-4.1-nano` 有时可能包含对同一工具的多个工具调用（如果启用了并行工具调用）。建议在使用此版本时禁用此功能。

### Strict mode

设置 `strict` 设置为 `true` 将确保函数调用可靠地遵循函数架构，而不仅仅是尽力而为。我们建议始终启用严格模式。

在底层，严格模式通过利用我们的 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 功能来工作，因此会带来一些要求：

1. `additionalProperties` 必须设置为 `false` 针对 中的每个对象 `parameters`.
1. 中的所有字段 `properties` 必须标记为 `required`.

你可以通过添加 `null` 来标记可选字段，格式为 `type` 选项（见下方示例）。

如果你发送 `strict: true` 并且你的架构不满足上述要求，
请求将被拒绝，并返回关于缺失约束的详细信息。如果
你省略 `strict`，默认值取决于 API：Responses 请求将
在可能的情况下尝试将你的架构规范化（normalize）为严格模式，并在架构
无法被规范化时回退到非严格模式下的尽力而为（best-effort）函数调用
兼容 strict 模式。当发生回退时，响应工具会显示
`strict: false`。Chat Completions 请求默认仍然是非 strict 的。若要在 Responses 中退出 strict 模式并保持非 strict 的尽力而为型函数调用，请明确设置
关闭 strict 模式，在 Responses 中保持非 strict、尽力而为型函数调用，请显式设置
为 `strict: false`.





Strict 模式已启用

```json
{
    "type": "function",
    "name": "get_weather",
    "description": "Retrieves current weather for the given location.",
    //highlight-start
    "strict": true,
    //highlight-end
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "City and country e.g. Bogotá, Colombia"
            },
            "units": {
                //highlight-start
                "type": ["string", "null"],
                //highlight-end
                "enum": ["celsius", "fahrenheit"],
                "description": "Units the temperature will be returned in."
            }
        },
        //highlight-start
        "required": ["location", "units"],
        "additionalProperties": false
        //highlight-end
    }
}
```

  

  

    
Strict 模式已禁用

```json
{
    "type": "function",
    "name": "get_weather",
    "description": "Retrieves current weather for the given location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "City and country e.g. Bogotá, Colombia"
            },
            "units": {
                //highlight-start
                "type": "string",
                //highlight-end
                "enum": ["celsius", "fahrenheit"],
                "description": "Units the temperature will be returned in."
            }
        },
        //highlight-start
        "required": ["location"],
        //highlight-end
    }
}
```





在
  [playground](https://platform.openai.com/playground) 中生成的所有架构都启用了 strict 模式。

虽然我们建议你启用 strict 模式，但它存在一些限制：

1. JSON schema 的部分特性不受支持。（参见 [支持的 schema](https://developers.openai.com/api/docs/guides/structured-outputs?context=with_parse#supported-schemas).)

特别针对微调模型：

1. Schema 会在首次请求时进行额外的处理（之后会缓存）。如果你的 Schema 在每次请求时都不同，可能会导致更高的延迟。
2. Schema 会出于性能考虑进行缓存，并且不符合 [零数据保留](https://developers.openai.com/api/docs/models#how-we-use-your-data).

## 流式传输



流式传输可用于通过展示模型在填充参数时调用了哪个函数来呈现进度，甚至可以实时显示参数。

流式函数调用的工作方式类似于流式常规响应：你需要设置 `stream` 设置为 `true` 并获取不同的 `event` 对象。

流式函数调用

```javascript
import { OpenAI } from "openai";

const openai = new OpenAI();

const tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Get current temperature for provided coordinates in celsius.",
    parameters: {
      type: "object",
      properties: {
        latitude: { type: "number" },
        longitude: { type: "number" },
      },
      required: ["latitude", "longitude"],
      additionalProperties: false,
    },
    strict: true,
  },
];

const stream = await openai.responses.create({
  model: "gpt-6-astra",
  input: [{ role: "user", content: "What's the weather like in Paris today?" }],
  tools,
  stream: true,
  store: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```python
from openai import OpenAI

client = OpenAI()

tools = [
    {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and country e.g. Bogotá, Colombia",
                }
            },
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

stream = client.responses.create(
    model="gpt-6-astra",
    input=[{"role": "user", "content": "What's the weather like in Paris today?"}],
    tools=tools,
    stream=True,
)

for event in stream:
    print(event)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"location": map[string]any{"type": "string", "description": "City and country e.g. Bogotá, Colombia"},
		},
		"required":             []string{"location"},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction("get_weather", parameters, true)
	stream := client.Responses.NewStreaming(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What's the weather like in Paris today?")},
		Tools: []responses.ToolUnionParam{tool},
	})
	for stream.Next() {
		fmt.Println(stream.Current().Type)
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;
import java.util.List;
import java.util.Map;

FunctionTool weather =
    FunctionTool.builder()
        .name("get_weather")
        .description("Get the weather for a city.")
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties", JsonValue.from(Map.of("city", Map.of("type", "string"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("city")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .strict(true)
        .build();
ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is the weather in Paris?")
        .addTool(weather)
        .build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream()
      .forEach(
          event -> {
            System.out.println(event);
            event
                .outputItemAdded()
                .ifPresent(added -> System.out.println("response.output_item.added: " + added));
            event
                .functionCallArgumentsDelta()
                .ifPresent(
                    delta ->
                        System.out.println("response.function_call_arguments.delta: " + delta));
          });
}
```

```ruby
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(
  model: "gpt-6-astra",
  input: "What is the weather in Paris?",
  tools: [
    {
      type: :function,
      name: "get_weather",
      description: "Get the weather for a city",
      parameters: {
        type: :object,
        properties: { city: { type: :string } },
        required: ["city"],
        additionalProperties: false
      },
      strict: true
    }
  ]
)

stream.each { |event| puts(event.type) }
```


输出事件

```json
{"type":"response.output_item.added","response_id":"resp_1234xyz","output_index":0,"item":{"type":"function_call","id":"fc_1234xyz","call_id":"call_1234xyz","name":"get_weather","arguments":""}}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"{\""}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"location"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"\":\""}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"Paris"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":","}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":" France"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"\"}"}
{"type":"response.function_call_arguments.done","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"arguments":"{\"location\":\"Paris, France\"}"}
{"type":"response.output_item.done","response_id":"resp_1234xyz","output_index":0,"item":{"type":"function_call","id":"fc_1234xyz","call_id":"call_1234xyz","name":"get_weather","arguments":"{\"location\":\"Paris, France\"}"}}
```


不过，你不是在将分块聚合为单个 `content` 字符串，而是在将分块聚合为一个已编码的 `arguments` JSON 对象。

当模型调用一个或多个函数时，会为每个函数调用发出一个类型为 `response.output_item.added` 的事件，其中包含以下字段：

| 字段          | 说明                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `response_id`  | 该函数调用所属响应的 id                                                     |
| `output_index` | 响应中输出项的索引。这表示响应中的各个函数调用。 |
| `item`         | 包含 call_id 字段的进行中函数调用项 `name`, `arguments` 和 `id` 字段                        |

随后你将收到一系列类型为 `response.function_call_arguments.delta` 的事件，其中包含 `delta` 的 `arguments` 字段。这些事件包含以下字段：

| 字段          | 说明                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `response_id`  | 该函数调用所属响应的 id                                                     |
| `item_id`      | 该增量所属函数调用项的 id                                                   |
| `output_index` | 响应中输出项的索引。这表示响应中的各个函数调用。 |
| `delta`        | 该字段的增量 `arguments` 字段。                                                                          |

以下是演示如何将各个 `delta`聚合成最终 `tool_call` 对象的代码片段。

累积 tool_call 增量

```javascript
const finalToolCalls = {};

for await (const event of stream) {
  if (
    event.type === "response.output_item.added" &&
    event.item.type === "function_call"
  ) {
    finalToolCalls[event.output_index] = event.item;
  } else if (event.type === "response.function_call_arguments.delta") {
    const index = event.output_index;

    if (finalToolCalls[index]) {
      finalToolCalls[index].arguments += event.delta;
    }
  }
}
```

```python
final_tool_calls = {}

for event in stream:
    if event.type == "response.output_item.added":
        final_tool_calls[event.output_index] = event.item
    elif event.type == "response.function_call_arguments.delta":
        index = event.output_index

        if final_tool_calls[index]:
            final_tool_calls[index].arguments += event.delta
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"location": map[string]any{"type": "string"},
		},
		"required":             []string{"location"},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction("get_weather", parameters, true)
	stream := client.Responses.NewStreaming(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("What's the weather like in Paris today?"),
		},
		Tools: []responses.ToolUnionParam{tool},
	})

	finalToolCalls := map[int64]responses.ResponseFunctionToolCall{}
	for stream.Next() {
		event := stream.Current()
		if event.Type == "response.output_item.added" && event.Item.Type == "function_call" {
			finalToolCalls[event.OutputIndex] = event.Item.AsFunctionCall()
		}
		if event.Type == "response.function_call_arguments.delta" {
			finalToolCall, ok := finalToolCalls[event.OutputIndex]
			if !ok {
				continue
			}
			finalToolCall.Arguments += event.Delta
			finalToolCalls[event.OutputIndex] = finalToolCall
		}
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
	fmt.Println(finalToolCalls)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFunctionToolCall;
import com.openai.models.responses.ResponseStreamEvent;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

FunctionTool weather =
    FunctionTool.builder()
        .name("get_weather")
        .description("Get the weather for a city.")
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties", JsonValue.from(Map.of("location", Map.of("type", "string"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .strict(true)
        .build();
ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is the weather in Paris?")
        .addTool(weather)
        .build();

Map<Long, ResponseFunctionToolCall> toolCalls = new LinkedHashMap<>();
try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream()
      .forEach(
          event -> {
            event
                .outputItemAdded()
                .ifPresent(
                    added ->
                        added
                            .item()
                            .functionCall()
                            .ifPresent(call -> toolCalls.put(added.outputIndex(), call)));
            event
                .functionCallArgumentsDelta()
                .ifPresent(
                    delta ->
                        toolCalls.computeIfPresent(
                            delta.outputIndex(),
                            (ignored, call) ->
                                call.toBuilder()
                                    .arguments(call.arguments() + delta.delta())
                                    .build()));
          });
}
toolCalls.values().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(
  model: "gpt-6-astra",
  input: "What is the weather in Paris?",
  tools: [
    {
      type: :function,
      name: "get_weather",
      parameters: {
        type: :object,
        properties: { location: { type: :string } },
        required: ["location"],
        additionalProperties: false
      },
      strict: true
    }
  ]
)

final_tool_calls = {}
stream.each do |event|
  case event
  when OpenAI::Models::Responses::ResponseOutputItemAddedEvent
    item = event.item
    next unless item.is_a?(OpenAI::Models::Responses::ResponseFunctionToolCall)

    final_tool_calls[event.output_index] = {
      id: item.id,
      call_id: item.call_id,
      name: item.name,
      type: item.type,
      arguments: item.arguments.dup
    }
  when OpenAI::Models::Responses::ResponseFunctionCallArgumentsDeltaEvent
    tool_call = final_tool_calls[event.output_index]
    tool_call[:arguments] << event.delta if tool_call
  end
end

puts(final_tool_calls.sort.to_h.values)
```


Accumulated final_tool_calls[0]

```json
{
    "type": "function_call",
    "id": "fc_1234xyz",
    "call_id": "call_2345abc",
    "name": "get_weather",
    "arguments": "{\"location\":\"Paris, France\"}"
}
```


当模型完成函数调用后，会发出类型为 `response.function_call_arguments.done` 的事件。该事件包含完整的函数调用，其中包含以下字段：

| 字段          | 说明                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `response_id`  | 该函数调用所属响应的 id                                                     |
| `output_index` | 响应中输出项的索引。这表示响应中的各个函数调用。 |
| `item`         | 包含以下内容的函数调用条目 `name`, `arguments` 和 `id` 字段。                                   |



## 自定义工具

自定义工具的工作方式与基于 JSON schema 的函数工具大体相同。但你无需向模型提供关于工具所需输入的明确指令，模型可以将任意字符串作为输入传回给你的工具。这对于避免不必要地将响应包装在 JSON 中，或对响应应用自定义语法（详见下文）非常有用。

以下代码示例展示了如何创建一个自定义工具，它期望接收一段包含 Python 代码的文本字符串作为响应。

自定义工具调用示例

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: "Use the code_exec tool to print hello world to the console.",
  tools: [
    {
      type: "custom",
      name: "code_exec",
      description: "Executes arbitrary Python code.",
    },
  ],
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="Use the code_exec tool to print hello world to the console.",
    tools=[
        {
            "type": "custom",
            "name": "code_exec",
            "description": "Executes arbitrary Python code.",
        }
    ],
)
print(response.output)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfCustom("code_exec")
	tool.OfCustom.Description = openai.String("Executes arbitrary Python code.")

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the code_exec tool to print hello world to the console.")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.CustomTool;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Use code_exec to print hello world.")
        .addTool(
            CustomTool.builder()
                .name("code_exec")
                .description("Executes arbitrary Python code.")
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Use code_exec to print hello world.",
  tools: [
    {
      type: :custom,
      name: "code_exec",
      description: "Executes arbitrary Python code."
    }
  ]
)

puts(response.output)
```


和之前一样， `output` 数组中将包含模型生成的工具调用。只不过这一次，工具调用的输入以纯文本形式给出。

```json
[
  {
    "id": "rs_6890e972fa7c819ca8bc561526b989170694874912ae0ea6",
    "type": "reasoning",
    "content": [],
    "summary": []
  },
  {
    "id": "ctc_6890e975e86c819c9338825b3e1994810694874912ae0ea6",
    "type": "custom_tool_call",
    "status": "completed",
    "call_id": "call_aGiFQkRWSWAIsMQ19fKqxUgb",
    "input": "print(\"hello world\")",
    "name": "code_exec"
  }
]
```

### Context-free grammars

一个 [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) (CFG) 是一组用于定义如何在特定格式中生成有效文本的规则。对于自定义工具，你可以提供一个 CFG 来约束模型针对该自定义工具的文本输入。

你可以在配置自定义工具时使用 `grammar` 参数提供自定义 CFG。目前，我们在定义语法时支持两种 CFG 语法形式： `lark` 和 `regex`.

#### Lark CFG

Lark 无上下文文法示例

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const grammar = `
start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: " "
ADD: "+"
MUL: "*"
%import common.INT
`;

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: "Use the math_exp tool to add four plus four.",
  tools: [
    {
      type: "custom",
      name: "math_exp",
      description: "Creates valid mathematical expressions",
      format: {
        type: "grammar",
        syntax: "lark",
        definition: grammar,
      },
    },
  ],
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

grammar = """
start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: " "
ADD: "+"
MUL: "*"
%import common.INT
"""

response = client.responses.create(
    model="gpt-6-astra",
    input="Use the math_exp tool to add four plus four.",
    tools=[
        {
            "type": "custom",
            "name": "math_exp",
            "description": "Creates valid mathematical expressions",
            "format": {
                "type": "grammar",
                "syntax": "lark",
                "definition": grammar,
            },
        }
    ],
)
print(response.output)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	grammar := `start: expr
expr: term (SP ADD SP term)* -> add
| term
term: factor (SP MUL SP factor)* -> mul
| factor
factor: INT
SP: " "
ADD: "+"
MUL: "*"
%import common.INT`
	tool := responses.ToolParamOfCustom("math_exp")
	tool.OfCustom.Description = openai.String("Creates valid mathematical expressions")
	tool.OfCustom.Format = shared.CustomToolInputFormatParamOfGrammar(grammar, "lark")

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the math_exp tool to add four plus four.")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.CustomToolInputFormat;
import com.openai.models.responses.CustomTool;
import com.openai.models.responses.ResponseCreateParams;

String grammar =
    """
    start: expr
    expr: term (SP ADD SP term)*
    term: INT
    SP: " "
    ADD: "+"
    %import common.INT
    """;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Use math_exp to add four plus four.")
        .addTool(
            CustomTool.builder()
                .name("math_exp")
                .description("Creates valid mathematical expressions.")
                .format(
                    CustomToolInputFormat.Grammar.builder()
                        .syntax(CustomToolInputFormat.Grammar.Syntax.LARK)
                        .definition(grammar)
                        .build())
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
grammar = <<~LARK
  start: expr
  expr: term (SP ADD SP term)*
  term: INT
  SP: " "
  ADD: "+"
  %import common.INT
LARK
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Use math_exp to add four plus four.",
  tools: [
    {
      type: :custom,
      name: "math_exp",
      description: "Creates valid mathematical expressions.",
      format: {
        type: :grammar,
        syntax: :lark,
        definition: grammar
      }
    }
  ]
)

puts(response.output)
```


然后，工具的输出应当符合你定义的 Lark CFG：

```json
[
  {
    "id": "rs_6890ed2b6374819dbbff5353e6664ef103f4db9848be4829",
    "type": "reasoning",
    "content": [],
    "summary": []
  },
  {
    "id": "ctc_6890ed2f32e8819daa62bef772b8c15503f4db9848be4829",
    "type": "custom_tool_call",
    "status": "completed",
    "call_id": "call_pmlLjmvG33KJdyVdC4MVdk5N",
    "input": "4 + 4",
    "name": "math_exp"
  }
]
```

文法使用以下语法的一种变体来指定： [Lark](https://lark-parser.readthedocs.io/en/stable/index.html)。模型采样通过 [LLGuidance](https://github.com/guidance-ai/llguidance/blob/main/docs/syntax.md)。进行约束。Lark 的部分功能不受支持：

- 词法分析器正则中的环视
- 惰性修饰符（`*?`, `+?`, `??`）在词法分析器正则中
- 终结符的优先级
- 模板
- 导入（除内置 `%import` common 之外）
- `%declare`s

我们推荐使用 [Lark IDE](https://www.lark-parser.org/ide/) 来试验自定义语法。

<a id="keep-grammars-simple"></a>

### 限制语法复杂度

将语法限制为你的工具所需的规则和模式。如果语法过于复杂，OpenAI API 可能会返回错误，因此在使用前请确保所需的语法与 API 兼容。

Lark 语法可能难以做到尽善尽美。复杂度较低的语法通常最稳定，而复杂的语法往往需要在语法定义本身、提示词和工具描述上反复迭代，以确保模型不会偏离预期分布。

### 正确与错误的模式

正确（单一、有界的终结符）：

```
start: SENTENCE
SENTENCE: /[A-Za-z, ]*(the hero|a dragon|an old man|the princess)[A-Za-z, ]*(fought|saved|found|lost)[A-Za-z, ]*(a treasure|the kingdom|a secret|his way)[A-Za-z, ]*\./
```

请勿这样做（在多个规则/终结符之间拆分）。这种做法试图让规则在终结符之间划分自由文本。词法分析器会贪婪地匹配这些自由文本片段，你会失去控制：

```
start: sentence
sentence: /[A-Za-z, ]+/ subject /[A-Za-z, ]+/ verb /[A-Za-z, ]+/ object /[A-Za-z, ]+/
```

小写规则并不会影响终结符如何从输入中切分——只有终结符定义才会。当你需要“锚点之间的自由文本”时，将其定义为单个大型正则终结符，这样词法分析器就能按你期望的结构精确匹配一次。

### 终端与规则

Lark 使用 terminals 作为词法分析器标记（按惯例， `UPPERCASE`），使用 rules 作为解析器产生式（按惯例， `lowercase`）。要在受支持的子集内工作并避免意外，最实用的方法是保持语法清晰、避免不必要的复杂性，并使用 terminals 和 rules 明确分离关注点。

terminals 使用的正则语法是 [Rust regex crate 语法](https://docs.rs/regex/latest/regex/#syntax)，而不是 Python 的 `re` [模块](https://docs.python.org/3/library/re.html).

### 核心要点与最佳实践

**词法分析器在解析器之前运行**

终结符由词法分析器匹配（采用贪婪 / 最长匹配优先策略），随后才会应用任何 CFG 文法规则逻辑。如果你试图通过把一个终结符拆到多条规则中以“塑造”它，词法分析器无法被这些规则引导——它只能由终结符正则表达式引导。

**从自由文本片段中切分文本时，优先使用单一终结符**

如果你需要识别嵌入在任意文本中的模式（例如，在锚点之间夹杂“任意内容”的自然语言），应将其表达为单一终结符。不要试图把自由文本的终结符与解析器规则交织在一起：贪婪的词法分析器不会尊重你预期的边界，而且模型很可能偏离分布。

**使用规则来组合离散的 token**

当你把明确分隔的终结符（数字、关键字、标点）组合成更大结构时，规则是理想工具。但它们不适合用来约束两个终结符之间的“中间内容”。

**让终结符保持聚焦、有界且自包含**

优先使用明确的字符类和有界量词（`{0,10}`，避免无界的 `*` ）。如果需要“到句号为止的任意文本”，更推荐形如 `/[^.\n]{0,10}*\./` 而非 `/.+\./` ，以避免失控增长。

**用规则组合 token，而不是操纵正则表达式内部行为**

良好的规则用法示例：

```
start: expr
NUMBER: /[0-9]+/
PLUS: "+"
MINUS: "-"
expr: term (("+"|"-") term)*
term: NUMBER
```

**显式处理空白字符**

不要依赖开放式的 `%ignore` 指令。使用无界 ignore 指令可能导致文法过于复杂，并且/或者导致模型偏离分布。在允许出现空白的位置，更推荐穿插使用明确的终结符。

### 故障排除

- 如果 API 因为语法过于复杂而拒绝，请简化规则和终结符，并移除无界的 `%ignore`情况。
- 如果自定义工具被传入意外的 token 调用，确认终结符没有重叠；检查贪心词法分析器。
- 当模型出现“分布外”漂移时（表现为模型生成过长或重复的输出，语法上有效但语义上是错误的）：
  - 收紧语法。
  - 迭代提示词（添加 few-shot 示例）和工具描述（解释语法并指示模型进行推理以符合语法）。
  - 尝试更高的推理力度（例如，从 medium 提升到 high）。

#### Regex CFG

Regex 上下文无关文法示例

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const grammar =
  "^(?P<month>January|February|March|April|May|June|July|August|September|October|November|December)\\s+(?P<day>\\d{1,2})(?:st|nd|rd|th)?\\s+(?P<year>\\d{4})\\s+at\\s+(?P<hour>0?[1-9]|1[0-2])(?P<ampm>AM|PM)$";

const response = await client.responses.create({
  model: "gpt-6-astra",
  input:
    "Use the timestamp tool to save a timestamp for August 7th 2025 at 10AM.",
  tools: [
    {
      type: "custom",
      name: "timestamp",
      description: "Saves a timestamp in date + time in 24-hr format.",
      format: {
        type: "grammar",
        syntax: "regex",
        definition: grammar,
      },
    },
  ],
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

grammar = r"^(?P<month>January|February|March|April|May|June|July|August|September|October|November|December)\s+(?P<day>\d{1,2})(?:st|nd|rd|th)?\s+(?P<year>\d{4})\s+at\s+(?P<hour>0?[1-9]|1[0-2])(?P<ampm>AM|PM)$"

response = client.responses.create(
    model="gpt-6-astra",
    input="Use the timestamp tool to save a timestamp for August 7th 2025 at 10AM.",
    tools=[
        {
            "type": "custom",
            "name": "timestamp",
            "description": "Saves a timestamp in date + time in 24-hr format.",
            "format": {
                "type": "grammar",
                "syntax": "regex",
                "definition": grammar,
            },
        }
    ],
)
print(response.output)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	grammar := `^(?P<month>January|February|March|April|May|June|July|August|September|October|November|December)\s+(?P<day>\d{1,2})(?:st|nd|rd|th)?\s+(?P<year>\d{4})\s+at\s+(?P<hour>0?[1-9]|1[0-2])(?P<ampm>AM|PM)$`
	tool := responses.ToolParamOfCustom("timestamp")
	tool.OfCustom.Description = openai.String("Saves a timestamp in date and time format.")
	tool.OfCustom.Format = shared.CustomToolInputFormatParamOfGrammar(grammar, "regex")

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the timestamp tool to save a timestamp for August 7th 2025 at 10AM.")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.CustomToolInputFormat;
import com.openai.models.responses.CustomTool;
import com.openai.models.responses.ResponseCreateParams;

String grammar =
    "^(January|February|March|April|May|June|July|August|September|October|November|December) "
        + "\\d{1,2}(st|nd|rd|th)? \\d{4} at (0?[1-9]|1[0-2])(AM|PM)$";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Use timestamp to save August 7th 2025 at 10AM.")
        .addTool(
            CustomTool.builder()
                .name("timestamp")
                .description("Saves a timestamp in date and time format.")
                .format(
                    CustomToolInputFormat.Grammar.builder()
                        .syntax(CustomToolInputFormat.Grammar.Syntax.REGEX)
                        .definition(grammar)
                        .build())
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
grammar = "^(January|February|March|April|May|June|July|August|September|October|November|December) \\d{1,2}(st|nd|rd|th)? \\d{4} at (0?[1-9]|1[0-2])(AM|PM)$"
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Use timestamp to save August 7th 2025 at 10AM.",
  tools: [
    {
      type: :custom,
      name: "timestamp",
      description: "Saves a timestamp in date and time format.",
      format: {
        type: :grammar,
        syntax: :regex,
        definition: grammar
      }
    }
  ]
)

puts(response.output)
```


然后，工具的输出应符合你定义的 Regex CFG：

```json
[
  {
    "id": "rs_6894f7a3dd4c81a1823a723a00bfa8710d7962f622d1c260",
    "type": "reasoning",
    "content": [],
    "summary": []
  },
  {
    "id": "ctc_6894f7ad7fb881a1bffa1f377393b1a40d7962f622d1c260",
    "type": "custom_tool_call",
    "status": "completed",
    "call_id": "call_8m4XCnYvEmFlzHgDHbaOCFlK",
    "input": "August 7th 2025 at 10AM",
    "name": "timestamp"
  }
]
```

与 Lark 语法一样，正则表达式使用 [Rust regex crate 语法](https://docs.rs/regex/latest/regex/#syntax)，而不是 Python 的 `re` [模块](https://docs.python.org/3/library/re.html).

Regex 的某些特性不受支持：

- Lookarounds
- 惰性修饰符（`*?`, `+?`, `??`)

### 核心要点与最佳实践

**模式必须放在同一行**

如果需要在输入中匹配换行符，请使用转义序列 `\n`。请勿使用 verbose/extended 模式，该模式允许模式跨多行匹配。

**请将正则表达式作为普通模式字符串提供**

不要用 `//`.