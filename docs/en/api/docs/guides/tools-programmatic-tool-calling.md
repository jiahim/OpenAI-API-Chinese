# Programmatic Tool Calling

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Programmatic Tool Calling lets a model write and run JavaScript that coordinates the tools in a Responses API request. A program can call tools in parallel, use loops and conditions, and keep intermediate results in the hosted runtime. This is useful when a task needs a sequence of related tool calls or needs to process large tool outputs before returning a result.

Your application decides whether Programmatic Tool Calling is available and which eligible tools the model can call directly, from a program, or either way. It continues to run any client-owned tool calls.

Check the [model page](https://developers.openai.com/api/docs/models) before enabling Programmatic Tool Calling.

## Understand the runtime environment

OpenAI runs each generated program in a fresh, isolated V8 runtime. The runtime supports JavaScript with top-level `await`, but it does not provide Node.js, package installation, direct network access, a general-purpose filesystem, subprocess execution, a console, or persistent JavaScript state between program executions. Programs can interact with external systems only through tools enabled in the request and can emit output with `text(...)` or `image(...)`.

Programmatic Tool Calling supports Zero Data Retention (ZDR) workflows without requiring a persistent code-execution container. ZDR must be enabled for the organization or project; setting `store: false` enables stateless continuation but does not enable ZDR by itself. Eligibility and retention depend on the complete request, including its model, tools, and third-party services; see [data controls](https://developers.openai.com/api/docs/guides/your-data).

## Choose when to use Programmatic Tool Calling

Use Programmatic Tool Calling when a stage has predictable control flow and code can return a smaller structured result. Use direct tool calling when one call is sufficient, each result requires fresh model judgment, or the work requires approval or preservation of citations or native artifacts.

| Task shape                                                                                       | Recommended mode                                                                                                     |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| A single lookup or action                                                                        | Use direct tool calling.                                                                                             |
| Several results that code can filter, join, rank, remove duplicates from, aggregate, or validate | Use Programmatic Tool Calling when the program can return a smaller structured result.                               |
| Dependent calls with predictable data flow                                                       | Use Programmatic Tool Calling when code can derive later arguments and the limits and failure behavior are explicit. |
| Adaptive search or semantic evaluation                                                           | Use direct tool calling when each result should influence the model's next decision.                                 |
| Writes or approval-sensitive actions                                                             | Use direct tool calling by default to preserve a clear authorization boundary.                                       |
| Final citation or native artifact validation                                                     | Use direct tool calling unless the program preserves the native output and validates every required item.            |

## Configure Programmatic Tool Calling

Add the `programmatic_tool_calling` hosted tool to the request. Then set `allowed_callers` on each eligible tool that the program can invoke.

Enable Programmatic Tool Calling

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


`allowed_callers` controls how the model can invoke a tool:

| Value                        | Behavior                                                |
| ---------------------------- | ------------------------------------------------------- |
| Omitted or `["direct"]`      | The model can call the tool directly.                   |
| `["programmatic"]`           | Only code in a `program` item can call the tool.        |
| `["direct", "programmatic"]` | The model can call the tool directly or from a program. |

`parameters` describes the function arguments. When a function returns predictable structured data, `output_schema` describes the JSON object encoded in its `function_call_output.output` string. Define both so generated JavaScript can use the returned fields reliably.

### Supported tools

The following tool types support `allowed_callers: ["programmatic"]`:

- `function` and `custom`
- `mcp`
- `apply_patch`
- Local and hosted `shell`
- `code_interpreter`

For MCP tools, the tool's `require_approval` policy can pause the program until you approve the call.

For OpenAI-hosted tools, review the tool's data-retention and security guidance before enabling it in a program.

### Combine with tool search

[Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) runs as a top-level Responses API tool, not from inside generated JavaScript. Function, custom, and MCP tools with `defer_loading: true` are not initially available to a program. After the model loads a matching tool, a later program can invoke it through `tools.*` when its `allowed_callers` includes `"programmatic"`. An already-running program cannot invoke tool search, so the model must load deferred tools before starting a program that needs them.

## Guide routing when both modes are available

When your application lets the model call a function directly or from a program, assign each route to a specific workflow stage. Generic instructions such as "use Programmatic Tool Calling efficiently" don't identify the intended boundary. For example:

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

Here is an example of how to use this template:

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

For workflows that need both modes, define one handoff and avoid switching routes or repeating work. If a safe fallback exists, define it once and limit its retries.

## Understand program response items

Each API call still returns the standard [Responses API object](https://developers.openai.com/api/reference/resources/responses/methods/create). Programmatic Tool Calling doesn't introduce a separate response envelope. When the model uses Programmatic Tool Calling, the response's `output` array can contain:

- A `program` item containing the generated JavaScript, a `call_id`, and an opaque `fingerprint` used to resume or replay the program.
- A `function_call` item made by the program. It has its own `call_id`, which your application uses to return the function result. Its `caller.caller_id` matches the program's `call_id`.
- A `program_output` item containing the program's final result and status. Its `call_id` matches the program's `call_id`, and its `status` is `completed` or `incomplete`.

These are separate top-level items in `response.output`; the `caller` field records their execution relationship.

For example, a program can pause while your application runs `get_inventory` and `get_demand`:

Program and nested function calls

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


These examples show only the relevant items from `response.output`; they omit the surrounding standard Responses object. After your application returns the nested function results, a later response can contain the complete `program_output` item:

Program output

```json
{
  "type": "program_output",
  "id": "prog_out_123",
  "call_id": "call_prog_123",
  "result": "{\\"sku\\":\\"sku_123\\",\\"available_units\\":42,\\"requested_units\\":31,\\"shortage_units\\":0}",
  "status": "completed"
}
```


The JSON string in `program_output.result` follows the program result shape from your instructions. The surrounding `program_output` item follows the API contract shown above. These are separate contracts. A final `message` can arrive with the program output or in a later response, so continue until you receive that message.

OpenAI runs the model-generated JavaScript in the hosted runtime. Your application executes returned client-owned function calls; it does not execute the generated JavaScript.

Return the function result as a `function_call_output`. Copy `caller` from the function call without changing it. The service uses that value to resume the correct program.

## Continue after client-owned function calls

A program can pause more than once as it reaches client-owned tools. Continue until the response contains a final assistant message:

1. Send the request with the hosted tool and functions that allow programmatic calls.
1. Run every returned client-owned function call.
1. Return each function result with the original `call_id` and `caller`.
1. Handle an incomplete response before continuing.
1. If the response contains no pending `function_call` items and no final `message` item, continue from that response. With `store: false`, replay its output items; for a stored response, use `previous_response_id`.
1. Stop when the response contains a final `message` item. Read `response.output_text` or the message's refusal content.

The following example uses `store: false`, preserves every response item, and returns each function result to the program:

Run a programmatic tool-calling loop

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const implementations = {
  get_inventory: async ({ sku }) => ({ sku, available_units: 42 }),
  get_demand: async ({ sku }) => ({ sku, requested_units: 31 }),
};

/** @type {OpenAI.Responses.Tool[]} */
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

/** @type {OpenAI.Responses.ResponseInput} */
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

  // Preserve every output item, including program and reasoning items.
  input.push(...response.output);

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
      return /** @type {const} */ ({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
        // Preserve caller so the runtime can resume the correct program.
        caller: call.caller,
      });
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
  {sku: sku, available_units: 42}
end

def get_demand(sku:)
  {sku: sku, requested_units: 31}
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
      properties: {sku: {type: :string}},
      required: ["sku"],
      additionalProperties: false
    },
    output_schema: {
      type: :object,
      properties: {
        sku: {type: :string},
        available_units: {type: :number}
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
      properties: {sku: {type: :string}},
      required: ["sku"],
      additionalProperties: false
    },
    output_schema: {
      type: :object,
      properties: {
        sku: {type: :string},
        requested_units: {type: :number}
      },
      required: %w[sku requested_units],
      additionalProperties: false
    },
    allowed_callers: [:programmatic],
    strict: true
  },
  {type: :programmatic_tool_calling}
]
input = [{role: :user, content: "Compare inventory with demand for sku_123."}]

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


When you store responses, you can continue from `previous_response_id` instead of resending all earlier response items. Send the new `function_call_output` items as the next input. With `store: false`, replay the complete sequence in order, including every `program`, reasoning, function-call, function-call-output, and `program_output` item.

For stateless reasoning-model requests, replay every returned reasoning item. Each item includes `encrypted_content` by default. See [conversation state](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) for the general stateless pattern.

## Design tools for programs

- Return structured, compact data that JavaScript can inspect without parsing prose.
- Use `output_schema` to define each tool's expected return fields and types, and document its error behavior. If the return shape isn't known in advance, keep the tool direct so the model can inspect the result.
- Define the exact program result shape and required evidence. Return a clear structured failure when the program can't produce a valid result.
- Make function calls idempotent when possible. A retry or replay shouldn't repeat an unsafe side effect.
- Check arguments and permissions for each call in your application, even when it comes from a hosted program.
- Give tools specific names and descriptions so the model can compose them correctly.
- Require application-level approval before high-impact actions, regardless of the caller.

{/* vale Vale.Terms = NO */}

## Evaluate Programmatic Tool Calling

Programmatic Tool Calling can reduce the amount of intermediate tool output added to model context, but the effect depends on the task and tool responses. Start with direct tool calling as a baseline, then compare both approaches on representative tasks.

Define the final-answer quality bar and required evidence before measuring efficiency. Evaluate token use and tool calls alongside correctness, completeness, and evidence coverage, and make any accepted quality tradeoff explicit.

{/* vale Vale.Terms = YES */}

Measure:

- Final-answer correctness, completeness, and evidence coverage.
- Input and total tokens, end-to-end latency, and cost.
- Model turns, tool calls, retries, and recovery behavior.
- Safety outcomes, especially for side effects and approval requirements.
- Whether the route that ran matched the intended workflow stage.

## Related guides

- Use [function calling](https://developers.openai.com/api/docs/guides/function-calling) to define client-owned functions.
- Use [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) to defer large tool definitions until a model needs them.
- Use [conversation state](https://developers.openai.com/api/docs/guides/conversation-state) to continue stored or stateless Responses API requests.
- Review [data controls](https://developers.openai.com/api/docs/guides/your-data) before choosing a storage mode.