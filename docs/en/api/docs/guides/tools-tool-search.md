# Tool search

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Tool search allows the model to dynamically search for and load tools into the model's context as needed. This allows you to avoid loading all tool definitions into the model's context up front and **may help reduce overall token usage and cost**. For optimal cost and latency, tool search is designed to **preserve the model’s cache**. When new tools are discovered by the model, they are injected at the end of the context window.

Only `gpt-5.4` and later models support `tool_search`.

To activate tool search, you must do two things:

1. Add `tool_search` as a tool in your `tools` array.
2. If you are using [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), mark the ones you want to defer with `defer_loading: true`. If you are using [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), set `defer_loading: true` on the MCP server tool definition.

### Use namespaces where possible

You can use tool search with deferred [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces), or [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), but we recommend using namespaces or MCP servers when possible. Our models have primarily been trained to search those surfaces, and token savings are usually more material there.

For namespaces, `defer_loading` applies to the functions inside the namespace, not to the namespace object itself.

At the start of a request, the model still sees the name and description of whatever is searchable. For a namespace or MCP server, that means the model sees only the namespace or server name and description at the beginning, without showing details of the individual functions contained within it until the tool search tool loads them. For an individual deferred function, the model still sees the function name and description, so in practice tool search is mostly deferring the parameter schema.

For maximum token savings, we recommend grouping deferred functions into namespaces or MCP servers with clear, high-level descriptions that give the model a strong overview of what is contained within them, so it can effectively search and load only the relevant functions. As a best practice, aim to keep each namespace to fewer than 10 functions for better token efficiency and model performance.

```json
{
    "tools": [
      {
// highlight-start:subtle
        "type": "namespace",
// highlight-end
        "name": "crm",
        "description": "CRM tools for customer lookup and order management.",
        "tools": [
          {
            "type": "function",
            "name": "list_open_orders",
            "description": "List open orders for a customer ID.",
// highlight-start:subtle
            "defer_loading": true,
// highlight-end
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
      },
      {
        "type": "tool_search"
      }
    ]
  }
```


Namespaces can have a mix of tools that are deferred and not deferred. Tools without `defer_loading: true` are callable immediately, while deferred tools in the same namespace are loaded through tool search.

### Tool search types

There are two ways to use tool search:

- **Hosted tool search:** OpenAI searches across the deferred tools you declared in the request and returns the loaded subset in the same response.
- **Client-executed tool search:** The model emits a `tool_search_call`, your application performs the lookup, and you return a matching `tool_search_output`.

Start with hosted tool search if the candidate tools are already known when
  you create the request. Use client-executed tool search when tool discovery
  depends on project state, tenant state, or another system your application
  controls.

## Hosted tool search

Hosted tool search is the simplest path when you already know the full inventory of [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces), or [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) you want the model to search. You declare them up front, add `{"type": "tool_search"}`, and let the API decide what to load.

Configure hosted tool search

```javascript
import OpenAI from "openai";

const client = new OpenAI();

/** @type {OpenAI.Responses.NamespaceTool} */
const crmNamespace = {
  type: "namespace",
  name: "crm",
  description: "CRM tools for customer lookup and order management.",
  tools: [
    {
      type: "function",
      name: "get_customer_profile",
      description: "Fetch a customer profile by customer ID.",
      parameters: {
        type: "object",
        properties: {
          customer_id: { type: "string" },
        },
        required: ["customer_id"],
        additionalProperties: false,
      },
    },
    {
      type: "function",
      name: "list_open_orders",
      description: "List open orders for a customer ID.",
      // highlight-start:subtle
      defer_loading: true,
      // highlight-end
      parameters: {
        type: "object",
        properties: {
          customer_id: { type: "string" },
        },
        required: ["customer_id"],
        additionalProperties: false,
      },
    },
  ],
};

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: "List open orders for customer CUST-12345.",
  // highlight-start:subtle
  tools: [crmNamespace, { type: "tool_search" }],
  // highlight-end
  parallel_tool_calls: false,
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

crm_namespace = {
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
                    "customer_id": {"type": "string"},
                },
                "required": ["customer_id"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "list_open_orders",
            "description": "List open orders for a customer ID.",
            # highlight-start:subtle
            "defer_loading": True,
            # highlight-end
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_id": {"type": "string"},
                },
                "required": ["customer_id"],
                "additionalProperties": False,
            },
        },
    ],
}

response = client.responses.create(
    model="gpt-6-astra",
    input="List open orders for customer CUST-12345.",
    tools=[
        crm_namespace,
        # highlight-start:subtle
        {"type": "tool_search"},
        # highlight-end
    ],
    parallel_tool_calls=False,
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
	parameters := map[string]any{
		"type":                 "object",
		"properties":           map[string]any{"customer_id": map[string]any{"type": "string"}},
		"required":             []string{"customer_id"},
		"additionalProperties": false,
	}
	namespace := responses.ToolParamOfNamespace(
		"CRM tools for customer lookup and order management.",
		"crm",
		[]responses.NamespaceToolToolUnionParam{
			{OfFunction: &responses.NamespaceToolToolFunctionParam{
				Name: "get_customer_profile", Description: openai.String("Fetch a customer profile by customer ID."), Parameters: parameters,
			}},
			{OfFunction: &responses.NamespaceToolToolFunctionParam{
				Name: "list_open_orders", Description: openai.String("List open orders for a customer ID."), DeferLoading: openai.Bool(true), Parameters: parameters,
			}},
		},
	)
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:             "gpt-6-astra",
		Input:             responses.ResponseNewParamsInputUnion{OfString: openai.String("List open orders for customer CUST-12345.")},
		Tools:             []responses.ToolUnionParam{namespace, {OfToolSearch: &responses.ToolSearchToolParam{}}},
		ParallelToolCalls: openai.Bool(false),
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
import com.openai.core.JsonValue;
import com.openai.models.responses.NamespaceTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolSearchTool;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("List open orders for customer CUST-12345.")
        .parallelToolCalls(false)
        .addTool(
            NamespaceTool.builder()
                .name("crm")
                .description("CRM tools for customer lookup and order management.")
                .addTool(
                    NamespaceTool.Tool.Function.builder()
                        .name("get_customer_profile")
                        .description("Fetch a customer profile by customer ID.")
                        .strict(true)
                        .parameters(
                            JsonValue.from(
                                Map.of(
                                    "type",
                                    "object",
                                    "properties",
                                    Map.of("customer_id", Map.of("type", "string")),
                                    "required",
                                    List.of("customer_id"),
                                    "additionalProperties",
                                    false)))
                        .build())
                .addTool(
                    NamespaceTool.Tool.Function.builder()
                        .name("list_open_orders")
                        .description("List open orders for a customer ID.")
                        .deferLoading(true)
                        .strict(true)
                        .parameters(
                            JsonValue.from(
                                Map.of(
                                    "type",
                                    "object",
                                    "properties",
                                    Map.of("customer_id", Map.of("type", "string")),
                                    "required",
                                    List.of("customer_id"),
                                    "additionalProperties",
                                    false)))
                        .build())
                .build())
        .addTool(ToolSearchTool.builder().execution(ToolSearchTool.Execution.SERVER).build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
parameters = {
  type: :object,
  properties: {customer_id: {type: :string}},
  required: ["customer_id"],
  additionalProperties: false
}
response = client.responses.create(
  model: "gpt-6-astra",
  input: "List open orders for customer CUST-12345.",
  parallel_tool_calls: false,
  tools: [
    {
      type: :namespace,
      name: "crm",
      description: "CRM tools for customer lookup and order management.",
      tools: [
        {
          type: :function,
          name: "get_customer_profile",
          description: "Fetch a customer profile by customer ID.",
          parameters: parameters
        },
        {
          type: :function,
          name: "list_open_orders",
          description: "List open orders for a customer ID.",
          defer_loading: true,
          parameters: parameters
        }
      ]
    },
    {type: :tool_search}
  ]
)

puts(response.output)
```


If the model decides it needs a deferred tool, the response includes two additional output items before the eventual function call:

- `tool_search_call`, which records the hosted search step.
- `tool_search_output`, which contains the loaded subset that becomes callable.

Hosted tool search response

```json
[
  {
    // highlight-start:subtle
    "type": "tool_search_call",
    // highlight-end
    "execution": "server",
    "call_id": null,
    "status": "completed",
    "arguments": {
      "paths": ["crm"]
    }
  },
  {
    // highlight-start:subtle
    "type": "tool_search_output",
    // highlight-end
    "execution": "server",
    "call_id": null,
    "status": "completed",
    "tools": [
      {
        "type": "namespace",
        "name": "crm",
        "description": "CRM tools for customer lookup and order management.",
        "tools": [
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
    ]
  },
  {
    "type": "function_call",
    "name": "list_open_orders",
    "namespace": "crm",
    "call_id": "call_abc123",
    "arguments": "{\"customer_id\":\"CUST-12345\"}"
  }
]
```


In hosted mode, `execution` is set to `server` and `call_id` is set to `null`.

For more complex tasks, the model can also load multiple namespaces or MCP servers in the same `tool_search_call`. For example, if it needs functions from different namespaces to complete one task, it may choose to search and load those surfaces together before making the subsequent function calls.

## Client-executed tool search

Client-executed tool search gives your application full control over how tool discovery works. This is useful when the available tools depend on information that is not practical to declare in the initial `tools` list.

Configure the `tool_search` tool with `execution: "client"` and a schema for the search arguments your application expects:

Configure client-executed tool search

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const firstResponse = await client.responses.create({
  model: "gpt-6-astra",
  input: "Find the shipping ETA tool first, then use it for order_42.",
  tools: [
    {
      type: "tool_search",
      // highlight-start:subtle
      execution: "client",
      // highlight-end
      description:
        "Find the project-specific tools needed to continue the task.",
      parameters: {
        type: "object",
        properties: {
          goal: { type: "string" },
        },
        required: ["goal"],
        additionalProperties: false,
      },
    },
  ],
  parallel_tool_calls: false,
});

const searchCall = firstResponse.output.find(
  (item) => item.type === "tool_search_call"
);

if (!searchCall) {
  throw new Error("The response did not include a tool search call.");
}

/** @type {OpenAI.Responses.Tool[]} */
const loadedTools = [
  {
    type: "function",
    name: "get_shipping_eta",
    description: "Look up shipping ETA details for an order.",
    defer_loading: true,
    parameters: {
      type: "object",
      properties: {
        order_id: { type: "string" },
      },
      required: ["order_id"],
      additionalProperties: false,
    },
    strict: true,
  },
];

/** @type {OpenAI.Responses.ResponseToolSearchOutputItemParam} */
const searchOutput = {
  type: "tool_search_output",
  execution: "client",
  call_id: searchCall.call_id,
  status: "completed",
  tools: loadedTools,
};

const secondResponse = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    ...firstResponse.output,
    // highlight-start:subtle
    searchOutput,
    // highlight-end
  ],
});

console.log(secondResponse.output);
```

```python
from openai import OpenAI

client = OpenAI()

first_response = client.responses.create(
    model="gpt-6-astra",
    input="Find the shipping ETA tool first, then use it for order_42.",
    tools=[
        {
            "type": "tool_search",
            # highlight-start:subtle
            "execution": "client",
            # highlight-end
            "description": "Find the project-specific tools needed to continue the task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "goal": {"type": "string"},
                },
                "required": ["goal"],
                "additionalProperties": False,
            },
        }
    ],
    parallel_tool_calls=False,
)

search_call = next(
    item for item in first_response.output if item.type == "tool_search_call"
)

loaded_tools = [
    {
        "type": "function",
        "name": "get_shipping_eta",
        "description": "Look up shipping ETA details for an order.",
        "defer_loading": True,
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
            },
            "required": ["order_id"],
            "additionalProperties": False,
        },
    }
]

second_response = client.responses.create(
    model="gpt-6-astra",
    input=[
        *first_response.output,
        {
            # highlight-start:subtle
            "type": "tool_search_output",
            # highlight-end
            "execution": "client",
            "call_id": search_call.call_id,
            "status": "completed",
            # highlight-start:subtle
            "tools": loaded_tools,
            # highlight-end
        },
    ],
)

print(second_response.output)
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
	searchTool := responses.ToolUnionParam{OfToolSearch: &responses.ToolSearchToolParam{
		Execution:   responses.ToolSearchToolExecutionClient,
		Description: openai.String("Find the project-specific tools needed to continue the task."),
		Parameters: map[string]any{
			"type":                 "object",
			"properties":           map[string]any{"goal": map[string]any{"type": "string"}},
			"required":             []string{"goal"},
			"additionalProperties": false,
		},
	}}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:             "gpt-6-astra",
		Input:             responses.ResponseNewParamsInputUnion{OfString: openai.String("Find the shipping ETA tool first, then use it for order_42.")},
		Tools:             []responses.ToolUnionParam{searchTool},
		ParallelToolCalls: openai.Bool(false),
	})
	if err != nil {
		panic(err)
	}

	callID := ""
	for _, item := range first.Output {
		if item.Type == "tool_search_call" {
			callID = item.CallID
			break
		}
	}
	if callID == "" {
		panic("the response did not include a tool search call")
	}
	loadedTool := responses.ToolParamOfFunction("get_shipping_eta", map[string]any{
		"type":                 "object",
		"properties":           map[string]any{"order_id": map[string]any{"type": "string"}},
		"required":             []string{"order_id"},
		"additionalProperties": false,
	}, true)
	loadedTool.OfFunction.Description = openai.String("Look up shipping ETA details for an order.")
	loadedTool.OfFunction.DeferLoading = openai.Bool(true)
	searchOutput := responses.ResponseInputItemParamOfToolSearchOutput([]responses.ToolUnionParam{loadedTool})
	searchOutput.OfToolSearchOutput.CallID = openai.String(callID)
	searchOutput.OfToolSearchOutput.Execution = responses.ResponseToolSearchOutputItemParamExecutionClient
	searchOutput.OfToolSearchOutput.Status = responses.ResponseToolSearchOutputItemParamStatusCompleted

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(first.ID),
		Input:              responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{searchOutput}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(second.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.ResponseToolSearchOutputItemParam;
import com.openai.models.responses.ToolSearchTool;
import java.util.List;
import java.util.Map;

ResponseCreateParams searchRequest =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Find the shipping ETA tool, then use it for order_42.")
        .parallelToolCalls(false)
        .addTool(
            ToolSearchTool.builder()
                .execution(ToolSearchTool.Execution.CLIENT)
                .description("Find the project tools needed to continue the task.")
                .parameters(
                    JsonValue.from(
                        Map.of(
                            "type",
                            "object",
                            "properties",
                            Map.of("goal", Map.of("type", "string")),
                            "required",
                            List.of("goal"),
                            "additionalProperties",
                            false)))
                .build())
        .build();

var search = client.responses().create(searchRequest);
var searchCall =
    search.output().stream()
        .flatMap(item -> item.toolSearchCall().stream())
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No tool search call returned"));

FunctionTool shippingTool =
    FunctionTool.builder()
        .name("get_shipping_eta")
        .description("Look up shipping details for an order.")
        .deferLoading(true)
        .strict(true)
        .parameters(
            FunctionTool.Parameters.builder()
                .putAdditionalProperty("type", JsonValue.from("object"))
                .putAdditionalProperty(
                    "properties", JsonValue.from(Map.of("order_id", Map.of("type", "string"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("order_id")))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
        .build();

var searchOutput =
    ResponseToolSearchOutputItemParam.builder()
        .callId(searchCall.callId().orElseThrow())
        .execution(ResponseToolSearchOutputItemParam.Execution.CLIENT)
        .status(ResponseToolSearchOutputItemParam.Status.COMPLETED)
        .addTool(shippingTool)
        .build();

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .previousResponseId(search.id())
                .inputOfResponse(List.of(ResponseInputItem.ofToolSearchOutput(searchOutput)))
                .build());

var loadedCalls =
    response.output().stream().flatMap(item -> item.functionCall().stream()).toList();
if (loadedCalls.isEmpty()) {
  throw new IllegalStateException("No loaded function call returned");
}
loadedCalls.forEach(call -> System.out.println(call.name() + "(" + call.arguments() + ")"));
```

```ruby
require "openai"

client = OpenAI::Client.new
search = client.responses.create(
  model: "gpt-6-astra",
  input: "Find the shipping ETA tool, then use it for order_42.",
  parallel_tool_calls: false,
  tools: [{
    type: :tool_search,
    execution: :client,
    description: "Find the project tools needed to continue the task.",
    parameters: {
      type: :object,
      properties: {goal: {type: :string}},
      required: ["goal"],
      additionalProperties: false
    }
  }]
)
call = search.output.find do |item|
  item.is_a?(OpenAI::Models::Responses::ResponseToolSearchCall)
end
unless call.is_a?(OpenAI::Models::Responses::ResponseToolSearchCall)
  raise "No tool search call returned"
end

response = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: search.id,
  input: [{
    type: :tool_search_output,
    call_id: call.call_id,
    execution: :client,
    status: :completed,
    tools: [{
      type: :function,
      name: "get_shipping_eta",
      description: "Look up shipping details for an order.",
      defer_loading: true,
      strict: true,
      parameters: {
        type: :object,
        properties: {order_id: {type: :string}},
        required: ["order_id"],
        additionalProperties: false
      }
    }]
  }]
)

function_calls = response.output.grep(
  OpenAI::Models::Responses::ResponseFunctionToolCall
)
raise "No loaded function call returned" if function_calls.empty?

function_calls.each do |function_call|
  puts("#{function_call.name}(#{function_call.arguments})")
end
```


On the first turn, the model emits a `tool_search_call` and stops there:

Client tool search call

```json
[
  {
    "type": "tool_search_call",
    "execution": "client",
    "call_id": "call_abc123",
    "status": "completed",
    "arguments": {
      "goal": "Find the shipping ETA tool for order_42."
    }
  }
]
```


Your application then performs the search and returns a `tool_search_output` with the tools it wants to load:

Return tool_search_output

```json
[
  {
    "type": "tool_search_output",
    "execution": "client",
    "call_id": "call_abc123",
    "status": "completed",
    "tools": [
      {
        "type": "function",
        "name": "get_shipping_eta",
        "description": "Look up shipping ETA details for an order.",
        "defer_loading": true,
        "parameters": {
          "type": "object",
          "properties": {
            "order_id": { "type": "string" }
          },
          "required": ["order_id"],
          "additionalProperties": false
        }
      }
    ]
  }
]
```


On the next turn, the loaded tool is callable like a normal function:

Loaded function call

```json
[
  {
    "type": "function_call",
    "name": "get_shipping_eta",
    "namespace": "get_shipping_eta",
    "call_id": "call_xyz456",
    "arguments": "{\"order_id\":\"order_42\"}"
  }
]
```


In client mode, `execution` is set to `client` and `call_id` is defined. Echo the same `call_id` from the `tool_search_call` in your `tool_search_output`.

## Advanced usage

### Keep namespace descriptions clear

Make namespace descriptions clear and descriptive of the use case, because the model relies on this description to decide when to load a subset of functions in that namespace. Avoid overly long descriptions. Instead, put richer detail in the deferred function descriptions that are loaded only when needed.

### Understand what gets loaded

`tool_search_output.tools` contains the list of tools that were dynamically loaded by the model. The model will be able to call any of these tools in future turns, so in client mode you do not need to load the same tool again across turns. Tools that were not listed as part of this array will not be available to the model. If you want to disable a loaded tool, you can remove it from the `tool_search_output` item where you define the loaded tool set, but note that changing the loaded tool set will break the model's cache from that point forward.

### Advanced injection patterns

Most integrations declare tools in the request's `tools` parameter. Client-executed tool search also supports more advanced patterns where your application returns tools that were not present in the original request. Treat this as an advanced workflow: validate the returned schemas carefully and only expose trusted tool definitions.

### Tool search and caching

All tools are loaded at the end of the model's context window. This holds true for both hosted tool search and client-executed tool search. This allows the model's cache to be preserved from one request to another, lowering overall costs and boosting speed.

### Add tools at a specific point in the input

For advanced workflows, you can use an `additional_tools` input item to make tools available at a specific point in the conversation. This is useful when your application loads tools outside the normal tool search flow or needs to preserve the ordering of tools added during a previous response.

Set `role` to `developer` and include the tools to add in the item's `tools` array:

```json
{
    "type": "additional_tools",
    "role": "developer",
    "tools": [
      {
        "type": "function",
        "name": "get_customer",
        "description": "Look up a customer by ID.",
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


Tools in an `additional_tools` item become available only after that item appears in the input. When you manually round-trip conversation items, preserve the item's position so the model sees the same tools at the same point in the conversation.

## Related guides

- Use [function calling](https://developers.openai.com/api/docs/guides/function-calling) to define callable functions and custom tools.
- Use [Using tools](https://developers.openai.com/api/docs/guides/tools) for the broader tool landscape across Responses.