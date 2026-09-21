# 程序化工具调用

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

Programmatic Tool Calling 让模型能够编写并运行 JavaScript 以协调其工具。程序可以并行调用工具，使用循环和条件判断，并在托管运行时中保留中间结果。当任务需要一系列相关的工具调用，或者需要在返回结果前处理大量工具输出时，这非常有用。

在 Responses API 中，你的应用决定是否启用 Programmatic Tool Calling，以及哪些符合条件的工具可以被模型直接从程序中调用，或以两种方式调用。它会继续运行任何由客户端拥有的工具调用。 [智能体 API](#agents-api) 默认启用 Programmatic Tool Calling，并为你管理 智能体 循环。

请查阅 [模型页面](https://developers.openai.com/api/docs/models) 后再启用 Programmatic Tool Calling。

## 了解运行时环境

OpenAI 在一个全新且隔离的 V8 运行时中运行每个生成的程序。该运行时支持带有顶层 `await`，的 JavaScript，但不提供 Node.js、包安装、直接的网络访问、通用的文件系统、子进程执行、控制台，也不支持程序执行之间的持久化 JavaScript 状态。程序只能通过请求中启用的工具与外部系统交互，并可通过 `text(...)` 或 `image(...)`.

对于 Responses API 请求，Programmatic Tool Calling 支持零数据保留（ZDR）工作流，无需持久的代码执行容器。必须在组织或项目中启用 ZDR；设置 `store: false` 可启用无状态的 延续，但本身并不启用 ZDR。资格与保留取决于完整的请求内容，包括其模型、工具和第三方服务；请参阅 [数据控制](https://developers.openai.com/api/docs/guides/your-data).

## 选择何时使用程序化工具调用

当某个阶段具有可预测的控制流，并且代码可以返回更小的结构化结果时，使用程序化工具调用。当单次调用即可完成、每次结果都需要新的模型判断，或工作需要审批或保留引用或原生工件时，使用直接工具调用。

| 任务形态                                                                                       | 推荐模式                                                                                                     |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 单次查询或单次操作                                                                        | 使用直接工具调用。                                                                                             |
| 代码可进行筛选、连接、排序、去重、聚合或校验的多条结果 | 当程序能返回更小的结构化结果时，使用程序化工具调用。                               |
| 具有可预测数据流的依赖调用                                                       | 当代码能够推导出后续参数，且限制和失败行为明确时，使用程序化工具调用。 |
| 自适应搜索或语义评估                                                           | 当每个结果都应影响模型的下一项决策时，使用直接工具调用。                                 |
| 写入操作或对审批敏感的操作                                                             | 默认使用直接工具调用，以保持清晰的授权边界。                                       |
| 最终引用或原生产物校验                                                     | 除非程序能保留原生输出并校验每个必需项，否则使用直接工具调用。            |

## 配置程序化工具调用

对于 Responses API，在请求中添加 `programmatic_tool_calling` 托管工具。然后设置 `allowed_callers` ，以指明程序可以调用哪些符合条件的工具。

启用程序化工具调用

```json
[
  {
    "type": "function",
    "name": "get_inventory",
    "description": "Return an object with sku (string) and available_units (number).",
    "parameters": {
      "type": "object",
      "properties": {
        "sku": { "type": "string" }
      },
      "required": ["sku"],
      "additionalProperties": false
    },
    "output_schema": {
      "type": "object",
      "properties": {
        "sku": { "type": "string" },
        "available_units": { "type": "number" }
      },
      "required": ["sku", "available_units"],
      "additionalProperties": false
    },
    "allowed_callers": ["programmatic"]
  },
  {
    "type": "programmatic_tool_calling"
  }
]
```


`allowed_callers` 控制模型可以如何调用工具：

| Value                        | Behavior                                                |
| ---------------------------- | ------------------------------------------------------- |
| Omitted or `["direct"]`      | 模型可以直接调用该工具。                   |
| `["programmatic"]`           | 仅限位于 `program` 项中的代码可以调用该工具。        |
| `["direct", "programmatic"]` | 模型可以直接或通过程序调用该工具。 |

`parameters` 描述函数参数。当函数返回可预测的结构化数据时， `output_schema` 描述其中编码的 JSON 对象 `function_call_output.output` 字符串。同时定义两者，以便生成的 JavaScript 能够可靠地使用返回的字段。

### 支持的工具

以下工具类型支持 `allowed_callers: ["programmatic"]`:

- `function` 和 `custom`
- `mcp`
- `apply_patch`
- 本地和托管 `shell`
- `code_interpreter`

对于 MCP 工具，该工具的 `require_approval` 策略可以暂停程序，直到你批准该调用。

对于 OpenAI 托管的工具，请在程序中启用前查看该工具的数据保留和安全指南。

### 与工具搜索结合使用

[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 作为顶级 Responses API 工具运行，而不是从生成的 JavaScript 内部运行。带有 `defer_loading: true` 的 Function、自定义和 MCP 工具初始时不可用于程序。模型加载匹配的工具后，后续程序可以通过 `tools.*` 在其 `allowed_callers` 包含 `"programmatic"`。时调用它。已在运行的程序无法调用工具搜索，因此模型必须在启动需要它们的程序之前加载延迟工具。

## 在两种模式都可用时引导路由选择

当你的应用让模型直接或从程序中调用函数时，需要将每条路由分配到具体的 工作流 阶段。像“高效地使用程序化工具调用”这样的通用指令无法明确意图边界。例如：

```text
<tool_orchestration>
Use Programmatic Tool Calling for [bounded stage] using only [eligible tools].
Run independent calls concurrently when safe. Use only documented tool input
and output fields.

Process and reduce the intermediate results, then emit exactly [program result shape],
including the evidence needed for the final answer.

Stop when [condition] is met. Retry transient failures at most [R] times.
Do not repeat completed calls or perform side-effecting actions. If a required
result is still missing, return a clear structured failure.

Use direct tool calls for [semantic judgment, approval, or final validation].
</tool_orchestration>
```

下面是如何使用此模板的示例：

```text
<tool_orchestration>
Use Programmatic Tool Calling to compare inventory with demand for sku_123
using only get_inventory and get_demand. Run both calls concurrently. Use
only documented tool input and output fields.

Process and reduce the intermediate results, then emit exactly one JSON object
with sku, available_units, requested_units, and shortage_units, where
shortage_units is max(requested_units - available_units, 0). Include
available_units and requested_units as evidence for the calculation.

Stop when both tool results contain the required fields. Retry transient
failures at most 1 time. Do not repeat completed calls or perform
side-effecting actions. If a required result is still missing, return a clear
structured failure.

Use direct tool calls only for approval before any inventory-changing action.
</tool_orchestration>
```

对于需要同时使用两种模式的交接工作流，定义一次并避免切换路由或重复执行。若存在安全的回退方案，定义一次并限制其重试次数。

## 了解程序响应项

每次 API 调用仍然会返回标准的 [Responses API 对象](https://developers.openai.com/api/reference/resources/responses/methods/create)。程序化工具调用不会引入额外的响应包装。当模型使用程序化工具调用时，响应中的 `output` 数组可以包含：

- 一个 `program` 包含所生成 JavaScript 的 item，以及一个 `call_id`，以及一个不透明的 `fingerprint` ，用于恢复或重放该程序。
- 一个 `function_call` 由该程序生成的 item。它拥有自己的 `call_id`，你的应用程序使用它来返回函数结果。它的 `caller.caller_id` 与该程序的 `call_id`.
- 一个 `program_output` 包含该程序最终结果和状态的 item。它的 `call_id` 与该程序的 `call_id`，以及它的 `status` 为 `completed` 或 `incomplete`.

这些是 `response.output`；中各自独立的顶层条目， `caller` 字段记录了它们的执行关系。

例如，程序可以在你的应用运行 `get_inventory` 时暂停， `get_demand`:

程序与嵌套函数调用

```json
[
  {
    "type": "program",
    "id": "prog_123",
    "call_id": "call_prog_123",
    "code": "const [stock, demand] = await Promise.all([tools.get_inventory({ sku: 'sku_123' }), tools.get_demand({ sku: 'sku_123' })]); text(JSON.stringify({ sku: stock.sku, available_units: stock.available_units, requested_units: demand.requested_units, shortage_units: Math.max(demand.requested_units - stock.available_units, 0) }));",
    "fingerprint": "opaque_replay_state"
  },
  {
    "type": "function_call",
    "id": "fc_123",
    "call_id": "call_inventory_123",
    "name": "get_inventory",
    "arguments": "{\\"sku\\":\\"sku_123\\"}",
    "caller": {
      "type": "program",
      "caller_id": "call_prog_123"
    }
  },
  {
    "type": "function_call",
    "id": "fc_456",
    "call_id": "call_demand_123",
    "name": "get_demand",
    "arguments": "{\\"sku\\":\\"sku_123\\"}",
    "caller": {
      "type": "program",
      "caller_id": "call_prog_123"
    }
  }
]
```


这些示例仅展示 `response.output`；中的相关条目；它们省略了外层的标准 Responses 对象。在你的应用返回嵌套的函数结果之后，后续的响应可以包含完整的 `program_output` 条目：

程序输出

```json
{
  "type": "program_output",
  "id": "prog_out_123",
  "call_id": "call_prog_123",
  "result": "{\\"sku\\":\\"sku_123\\",\\"available_units\\":42,\\"requested_units\\":31,\\"shortage_units\\":0}",
  "status": "completed"
}
```


中的 JSON 字符串遵循 `program_output.result` 来自你指令的程序结果结构。外层的 `program_output` 条目遵循上文展示的 API 约定。这是两套独立的约定。最终的 `message` 可以随程序输出一起返回，也可以在后续响应中到达，因此请持续处理，直到收到该消息。

OpenAI 在托管运行时中执行模型生成的 JavaScript。你的应用执行返回的、由客户端拥有的函数调用；它不会执行生成的 JavaScript。

将函数结果以 `function_call_output`。形式返回。原样复制函数调用中的 `caller` ，不要修改。服务会使用该值来恢复正确的程序。

## 在客户端拥有的函数调用之后继续

当程序到达客户端拥有的工具时，可能会暂停多次。请继续，直到响应中包含最终的助手消息：

1. 使用 托管工具 以及支持程序化调用的函数发送请求。
1. 运行所有返回的客户端自有函数调用。
1. 将每个函数结果与原始 `call_id` 和 `caller`.
1. 在继续之前处理未完成的响应。
1. 如果响应不包含未处理的 `function_call` 项且没有最终的 `message` 项，则从该响应继续。对于 `store: false`，重放其输出项；对于已存储的响应，使用 `previous_response_id`.
1. 当响应包含最终的 `message` 项时停止。读取 `response.output_text` 或该消息的拒绝内容。

以下示例使用 `store: false`，保留每个响应项，并将每个函数结果返回给程序：

运行程序化工具调用循环

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const client = new OpenAI();

const implementations = {
  get_inventory: async ({ sku }) => ({ sku, available_units: 42 }),
  get_demand: async ({ sku }) => ({ sku, requested_units: 31 }),
};

const tools = [
  {
    type: "function",
    name: "get_inventory",
    description:
      "Return an object with sku (string) and available_units (number).",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
      additionalProperties: false,
    },
    output_schema: {
      type: "object",
      properties: {
        sku: { type: "string" },
        available_units: { type: "number" },
      },
      required: ["sku", "available_units"],
      additionalProperties: false,
    },
    allowed_callers: ["programmatic"],
    strict: true,
  },
  {
    type: "function",
    name: "get_demand",
    description:
      "Return an object with sku (string) and requested_units (number).",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
      additionalProperties: false,
    },
    output_schema: {
      type: "object",
      properties: {
        sku: { type: "string" },
        requested_units: { type: "number" },
      },
      required: ["sku", "requested_units"],
      additionalProperties: false,
    },
    allowed_callers: ["programmatic"],
    strict: true,
  },
  { type: "programmatic_tool_calling" },
];

const input = [
  {
    role: "user",
    content: "Compare inventory with demand for sku_123.",
  },
];

while (true) {
  const response = await client.responses.create({
    model: "YOUR_MODEL_ID",
    store: false,
    input,
    tools,
  });

  if (response.status !== "completed") {
    throw new Error(`Response ended with status ${response.status}`);
  }

  // Preserve replayable output, including program and reasoning items.
  input.push(...toResponseInputItems(response.output));

  const calls = response.output.filter((item) => item.type === "function_call");

  if (calls.length === 0) {
    const message = response.output.find((item) => item.type === "message");
    if (message) {
      const refusal = message.content.find((part) => part.type === "refusal");
      console.log(response.output_text || refusal?.refusal || "");
      break;
    }
    continue;
  }

  const outputs = await Promise.all(
    calls.map(async (call) => {
      const run = implementations[call.name];
      if (!run) throw new Error(`Unknown tool: ${call.name}`);

      const result = await run(JSON.parse(call.arguments));
      return {
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
        // Preserve caller so the runtime can resume the correct program.
        caller: call.caller,
      };
    })
  );

  input.push(...outputs);
}
```

```python
import json

from openai import OpenAI

client = OpenAI()
model = "gpt-6-astra"


def get_inventory(sku):
    return {"sku": sku, "available_units": 42}


def get_demand(sku):
    return {"sku": sku, "requested_units": 31}


implementations = {
    "get_inventory": get_inventory,
    "get_demand": get_demand,
}

tools = [
    {
        "type": "function",
        "name": "get_inventory",
        "description": "Return an object with sku (string) and available_units (number).",
        "parameters": {
            "type": "object",
            "properties": {"sku": {"type": "string"}},
            "required": ["sku"],
            "additionalProperties": False,
        },
        "output_schema": {
            "type": "object",
            "properties": {
                "sku": {"type": "string"},
                "available_units": {"type": "number"},
            },
            "required": ["sku", "available_units"],
            "additionalProperties": False,
        },
        "allowed_callers": ["programmatic"],
    },
    {
        "type": "function",
        "name": "get_demand",
        "description": "Return an object with sku (string) and requested_units (number).",
        "parameters": {
            "type": "object",
            "properties": {"sku": {"type": "string"}},
            "required": ["sku"],
            "additionalProperties": False,
        },
        "output_schema": {
            "type": "object",
            "properties": {
                "sku": {"type": "string"},
                "requested_units": {"type": "number"},
            },
            "required": ["sku", "requested_units"],
            "additionalProperties": False,
        },
        "allowed_callers": ["programmatic"],
    },
    {"type": "programmatic_tool_calling"},
]

input_items = [
    {
        "role": "user",
        "content": "Compare inventory with demand for sku_123.",
    }
]

while True:
    response = client.responses.create(
        model=model,
        store=False,
        input=input_items,
        tools=tools,
    )

    if response.status != "completed":
        raise RuntimeError(f"Response ended with status {response.status}")

    # Preserve every output item, including program and reasoning items.
    input_items.extend(item.model_dump(exclude_none=True) for item in response.output)

    calls = [item for item in response.output if item.type == "function_call"]
    if not calls:
        message = next(
            (item for item in response.output if item.type == "message"), None
        )
        if message:
            refusal = next(
                (part.refusal for part in message.content if part.type == "refusal"),
                "",
            )
            print(response.output_text or refusal)
            break
        continue

    for call in calls:
        run = implementations.get(call.name)
        if run is None:
            raise ValueError(f"Unknown tool: {call.name}")

        result = run(**json.loads(call.arguments))
        input_items.append(
            {
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result),
                # Preserve caller so the runtime can resume the correct program.
                "caller": call.caller.model_dump() if call.caller else None,
            }
        )
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

type toolArguments struct {
	SKU string `json:"sku"`
}

func main() {
	client := openai.NewClient()
	input := responses.ResponseInputParam{
		responses.ResponseInputItemParamOfMessage(
			"Compare inventory with demand for sku_123.",
			responses.EasyInputMessageRoleUser,
		),
	}
	tools := []responses.ToolUnionParam{
		functionTool(
			"get_inventory",
			"Return an object with sku (string) and available_units (number).",
			"available_units",
		),
		functionTool(
			"get_demand",
			"Return an object with sku (string) and requested_units (number).",
			"requested_units",
		),
		programmaticTool(),
	}

	for {
		response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
			Model: "gpt-6-astra",
			Store: openai.Bool(false),
			Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
			Tools: tools,
		})
		if err != nil {
			panic(err)
		}
		if response.Status != "completed" {
			panic(fmt.Errorf("response ended with status %s", response.Status))
		}

		// Preserve every output item, including program and reasoning items.
		input = append(input, outputAsInput(response.Output)...)

		calls := functionCalls(response.Output)
		if len(calls) == 0 {
			if text, ok := finalMessageText(response); ok {
				fmt.Println(text)
				break
			}
			continue
		}

		for _, call := range calls {
			result, err := runTool(call.Name, call.Arguments)
			if err != nil {
				panic(err)
			}
			output, err := json.Marshal(result)
			if err != nil {
				panic(err)
			}

			toolOutput := responses.ResponseInputItemParamOfFunctionCallOutput(string(output))
			toolOutput.OfFunctionCallOutput.CallID = openai.String(call.CallID)
			caller := call.Caller.AsProgram()
			if caller.CallerID == "" {
				panic("function call is missing its program caller")
			}
			// Preserve caller so the runtime can resume the correct program.
			toolOutput.OfFunctionCallOutput.Caller.OfProgram =
				&responses.ResponseInputItemFunctionCallOutputCallerProgramParam{
					CallerID: caller.CallerID,
				}
			input = append(input, toolOutput)
		}
	}
}

func functionTool(name, description, resultField string) responses.ToolUnionParam {
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"sku": map[string]any{"type": "string"},
		},
		"required":             []string{"sku"},
		"additionalProperties": false,
	}
	outputSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"sku":       map[string]any{"type": "string"},
			resultField: map[string]any{"type": "number"},
		},
		"required":             []string{"sku", resultField},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction(name, parameters, true)
	tool.OfFunction.Description = openai.String(description)
	tool.OfFunction.AllowedCallers = []string{"programmatic"}
	tool.OfFunction.OutputSchema = outputSchema
	return tool
}

func programmaticTool() responses.ToolUnionParam {
	tool := responses.NewToolProgrammaticToolCallingParam()
	return responses.ToolUnionParam{OfProgrammaticToolCalling: &tool}
}

func outputAsInput(
	output []responses.ResponseOutputItemUnion,
) []responses.ResponseInputItemUnionParam {
	input := make([]responses.ResponseInputItemUnionParam, 0, len(output))
	for _, item := range output {
		var converted responses.ResponseInputItemUnion
		if err := json.Unmarshal([]byte(item.RawJSON()), &converted); err != nil {
			panic(err)
		}
		input = append(input, converted.ToParam())
	}
	return input
}

func functionCalls(
	output []responses.ResponseOutputItemUnion,
) []responses.ResponseFunctionToolCall {
	calls := make([]responses.ResponseFunctionToolCall, 0)
	for _, item := range output {
		if item.Type == "function_call" {
			calls = append(calls, item.AsFunctionCall())
		}
	}
	return calls
}

func finalMessageText(response *responses.Response) (string, bool) {
	for _, item := range response.Output {
		if item.Type != "message" {
			continue
		}
		text := response.OutputText()
		if text != "" {
			return text, true
		}
		for _, content := range item.AsMessage().Content {
			if content.Type == "refusal" {
				return content.AsRefusal().Refusal, true
			}
		}
		return "", true
	}
	return "", false
}

func runTool(name, argumentsJSON string) (map[string]any, error) {
	var arguments toolArguments
	if err := json.Unmarshal([]byte(argumentsJSON), &arguments); err != nil {
		return nil, fmt.Errorf("parse %s arguments: %w", name, err)
	}

	switch name {
	case "get_inventory":
		return map[string]any{"sku": arguments.SKU, "available_units": 42}, nil
	case "get_demand":
		return map[string]any{"sku": arguments.SKU, "requested_units": 31}, nil
	default:
		return nil, fmt.Errorf("unknown tool: %s", name)
	}
}
```

```ruby
require "json"
require "openai"

client = OpenAI::Client.new

def get_inventory(sku:)
  {
    sku: sku,
    available_units: 42
  }
end

def get_demand(sku:)
  {
    sku: sku,
    requested_units: 31
  }
end

implementations = {
  "get_inventory" => method(:get_inventory),
  "get_demand" => method(:get_demand)
}
tools = [
  {
    type: :function,
    name: "get_inventory",
    description: "Return an object with sku (string) and available_units (number).",
    parameters: {
      type: :object,
      properties: { sku: { type: :string } },
      required: ["sku"],
      additionalProperties: false
    },
    output_schema: {
      type: :object,
      properties: {
        sku: { type: :string },
        available_units: { type: :number }
      },
      required: %w[sku available_units],
      additionalProperties: false
    },
    allowed_callers: [:programmatic],
    strict: true
  },
  {
    type: :function,
    name: "get_demand",
    description: "Return an object with sku (string) and requested_units (number).",
    parameters: {
      type: :object,
      properties: { sku: { type: :string } },
      required: ["sku"],
      additionalProperties: false
    },
    output_schema: {
      type: :object,
      properties: {
        sku: { type: :string },
        requested_units: { type: :number }
      },
      required: %w[sku requested_units],
      additionalProperties: false
    },
    allowed_callers: [:programmatic],
    strict: true
  },
  { type: :programmatic_tool_calling }
]
input = [
  {
    role: :user,
    content: "Compare inventory with demand for sku_123."
  }
]

loop do
  response = client.responses.create(
    model: "gpt-6-astra",
    store: false,
    input: input,
    tools: tools
  )
  unless response.status == OpenAI::Responses::ResponseStatus::COMPLETED
    raise "Response ended with status #{response.status}"
  end

  # Preserve every output item, including program and reasoning items.
  input.concat(response.output)
  calls = response.output.grep(OpenAI::Models::Responses::ResponseFunctionToolCall)

  if calls.empty?
    message = response.output.find do |item|
      item.is_a?(OpenAI::Models::Responses::ResponseOutputMessage)
    end
    next unless message.is_a?(OpenAI::Models::Responses::ResponseOutputMessage)

    refusal = message.content.find do |content|
      content.is_a?(OpenAI::Models::Responses::ResponseOutputRefusal)
    end
    text = response.output_text
    if text.empty? &&
       refusal.is_a?(OpenAI::Models::Responses::ResponseOutputRefusal)
      text = refusal.refusal
    end
    puts(text)
    break
  end

  calls.each do |call|
    implementation = implementations.fetch(call.name) do
      raise ArgumentError, "Unknown tool: #{call.name}"
    end
    result = implementation.call(**JSON.parse(call.arguments, symbolize_names: true))
    output = {
      type: :function_call_output,
      call_id: call.call_id,
      output: JSON.generate(result)
    }
    # Preserve caller so the runtime can resume the correct program.
    output[:caller] = call.caller_.to_h if call.caller_
    input << output
  end
end
```


存储响应后，你可以从 `previous_response_id` 继续，而无需重新发送所有先前的响应项。发送新的 `function_call_output` 项作为下一个输入。使用 `store: false`，时，按顺序重放完整序列，包括每个 `program`、推理、函数调用、函数调用输出以及 `program_output` 项。

对于无状态的推理模型请求，重放每个返回的推理项。每个项默认包含 `encrypted_content` 。参见 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) 了解通用的无状态模式。

## 为程序设计工具

- 返回结构化、紧凑的数据，便于 JavaScript 检查而无需解析散文。
- 使用 `output_schema` 来定义每个工具的预期返回字段和类型，并记录其错误行为。如果返回形状事先未知，请保持工具的直接性，以便模型可以检查结果。
- 定义准确的程序结果形状和所需证据。当程序无法产生有效结果时，返回清晰的、结构化的失败信息。
- 尽可能使函数调用具备幂等性。重试或重放不应重复不安全的副作用。
- 在你的应用中检查每次调用的参数和权限，即使它来自托管程序。
- 为工具提供明确的名称和描述，以便模型能够正确地组合它们。
- 无论调用者是谁，都需在影响重大的操作之前要求应用层审批。

## 评估程序化工具调用

Programmatic Tool Calling 可以减少添加到模型上下文中的中间工具输出量，但实际效果取决于任务和工具响应。先以直接工具调用为基线，然后在具有代表性的任务上对比两种方法。

在衡量效率之前，先确定最终答案的质量标准和所需证据。在评估 token 使用量和工具调用次数的同时，也要评估正确性、完整性和证据覆盖度，并对任何被接受的质量取舍予以明确说明。

衡量指标：

- 最终答案的正确性、完整性和证据覆盖度。
- 输入和总 token 数、端到端延迟以及成本。
- 模型轮次、工具调用、重试和恢复行为。
- 安全结果，特别是副作用和审批要求。
- 实际运行的路径是否匹配预期的工作流阶段。

## 智能体 API

在 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview)，Programmatic Tool Calling 在 OpenAI 管理的 智能体 运行框架中执行，且默认启用。该框架为 智能体 提供一个 `exec` 工具，并使其已有工具在生成的 JavaScript 中可用。你无需将这些工具包装为命令行程序，也无需在沙箱中安装它们。

若要禁用 Programmatic Tool Calling，请在 `agent.tools`:

```json
{
  "type": "programmatic_tool_calling",
  "enabled": false
}
```

省略该条目或其 `enabled` 字段，则 Programmatic Tool Calling 保持启用。仅含类型的条目， `{ "type": "programmatic_tool_calling" }`，同样会保持其启用。上文所述的 `allowed_callers` 配置以及 Responses 延续 循环介绍了与 Responses API 的集成方式。

Programmatic Tool Calling 同样适用于仅包含对话的会话，配合 `environment.type` 设置为 `none`. 在沙盒中运行的 Bash、执行器 MCP 以及其他工具仍然需要 [execution environment](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

在 JavaScript 中编排工具并不会改变工具的运行位置。shell 调用会在沙盒中执行命令；JavaScript 运行时本身不会启动系统进程。执行器 MCP 仍然使用沙盒，函数工具仍然调用你的应用服务器。智能体 会处理它们的结果，然后再决定哪些内容进入模型上下文。

参考上述路由指南来确定哪些 工作流 阶段应使用代码。请参阅 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 时暂停， [MCP connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 了解 智能体 API 配置和调用处理方式。

## 相关指南

- 使用 [function calling](https://developers.openai.com/api/docs/guides/function-calling) 以定义客户端自有函数。
- 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 以在模型需要时再延迟加载大型工具定义。
- 使用 [conversation state](https://developers.openai.com/api/docs/guides/conversation-state) 以继续存储或无状态的 Responses API 请求。
- 查看 [data controls](https://developers.openai.com/api/docs/guides/your-data) 以选择存储模式之前。