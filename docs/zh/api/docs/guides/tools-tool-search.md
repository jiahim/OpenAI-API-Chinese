# Tool search

> 完整文档索引请参阅 [llms.txt](/llms.txt). 页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

Tool search 允许模型根据需要动态搜索并将工具加载到模型的上下文中。这样可以避免预先将所有工具定义加载到模型的上下文中，并且 **有助于降低整体的 token 用量和成本**。为了在成本和延迟方面达到最佳效果，tool search 旨在 **保留模型的缓存**。当模型发现新工具时，这些工具会被注入到上下文窗口的末尾。

仅 `gpt-5.4` 及更高版本的模型支持 `tool_search`.

要启用 tool search，你需要完成两件事：

1. Add `tool_search` 作为工具添加到你的 `tools` 数组中。
2. 如果你使用的是 [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions)，请将需要延迟的工具标记为 `defer_loading: true`。如果你使用的是 [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，请在 MCP 服务器工具定义上设置 `defer_loading: true` 。

### 尽可能使用命名空间

你可以使用带延时的工具搜索（tool search）与延迟（deferred） [函数](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [命名空间](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces)，或 [MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，但我们建议尽可能使用命名空间或 MCP 服务器。我们的模型主要针对这些表面进行训练，并且在这些场景下的 token 节省通常更为可观。

对于命名空间， `defer_loading` 适用于命名空间内的函数，而不适用于命名空间对象本身。

在请求开始时，模型仍然可以看到所有可搜索内容的名称和描述。对于命名空间或 MCP 服务器来说，这意味着模型在开始时只能看到命名空间或服务器的名称与描述，而不会显示其内部各个函数的详细信息，直到工具搜索工具加载它们为止。对于单个延迟函数，模型仍然可以看到函数名称和描述，因此在实践中，工具搜索主要是在延迟参数 schema 的加载。

为了最大限度地节省 token，我们建议将延迟函数分组到具有清晰高层描述的命名空间或 MCP 服务器中，从而为模型提供其所含内容的整体概览，使其能够有效地搜索并仅加载相关函数。最佳实践是，尽量将每个命名空间中的函数控制在 10 个以下，以获得更好的 token 效率和模型性能。

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


命名空间可以混合包含延迟和非延迟的工具。未设置 `defer_loading: true` 的工具可以立即调用，而同一命名空间中的延迟工具则通过工具搜索加载。

### Tool search types

使用工具搜索有两种方式：

- **托管工具搜索：** OpenAI 会在请求中声明的延迟工具中进行搜索，并在同一响应中返回已加载的子集。
- **客户端执行的工具搜索：** 模型发出一个 `tool_search_call`，由你的应用执行查找，并返回一个匹配的 `tool_search_output`.

如果在你创建请求时候选工具已经确定，请从 托管工具 search 开始。
  当工具发现依赖于项目状态、租户状态或你的应用程序控制的
  其他系统时，请使用客户端执行的工具搜索。
  系统时使用客户端执行的工具搜索。

## 托管工具搜索

当你已经清楚想要模型搜索的完整工具清单时，托管工具搜索是最简单的途径。你可以预先声明这些工具，添加 [函数](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [命名空间](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces)，或 [MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) ，让 API 自行决定加载哪些。 `{"type": "tool_search"}`, and let the 接口 decide what to load.

配置 托管工具 搜索

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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model:             "gpt-5.6",
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
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


如果模型判定需要某个延迟加载的工具，响应会在最终函数调用之前包含两个额外的输出项：

- `tool_search_call`，用于记录托管搜索步骤。
- `tool_search_output`，其中包含已加载的、可被调用的子集。

托管工具搜索响应

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


在托管模式下， `execution` 被设置为 `server` 和 `call_id` 被设置为 `null`.

对于更复杂的任务，模型还可以在同一次 `tool_search_call`。中加载多个命名空间或 MCP 服务器。例如，如果它需要来自不同命名空间的函数来完成一项任务，可以选择先一起搜索并加载这些接口，然后再发起后续的函数调用。

## 客户端执行的工具搜索

客户端执行的工具搜索让你的应用可以完全掌控工具发现的方式。当可用工具依赖于在初始请求中不便声明的信息时，这种方式非常有用。 `tools` 列表。

使用以下方式配置该 `tool_search` 工具，并提供 `execution: "client"` 以及你的应用所期望的搜索参数 schema：

配置客户端执行的工具搜索

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const firstResponse = await client.responses.create({
  model: "gpt-5.6",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
    model="gpt-5.6",
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
		Model:             "gpt-5.6",
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
		Model:              "gpt-5.6",
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
        .model("gpt-5.6")
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
                .model("gpt-5.6")
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
  model: "gpt-5.6",
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
  model: "gpt-5.6",
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


在第一轮中，模型会发出一个 `tool_search_call` 并在此停止：

客户端工具搜索调用

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


然后你的应用执行搜索并返回 `tool_search_output` 其中包含它想要加载的工具：

返回 tool_search_output

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


在下一轮中，加载的工具可以像普通函数一样被调用：

已加载的函数调用

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


在客户端模式下， `execution` 被设置为 `client` 和 `call_id` 已定义。回显相同的 `call_id` 来自 `tool_search_call` 在你的 `tool_search_output`.

## 高级用法

### 保持命名空间描述清晰

让命名空间描述清晰并能体现其用例，因为模型依赖该描述来决定何时加载该命名空间中的函数子集。避免使用过长的描述，而是将更丰富的信息放在按需加载的延迟函数描述中。

### 了解加载的内容

`tool_search_output.tools` 包含模型动态加载的工具列表。模型将在后续轮次中能够调用这些工具中的任何一个，因此在客户端模式下，你无需在多轮之间重复加载同一工具。未作为此数组一部分列出的工具将对模型不可用。如果你想禁用某个已加载的工具，可以从定义已加载工具集的 `tool_search_output` 项中移除它，但请注意，更改已加载工具集将从该点开始破坏模型的缓存。

### 高级注入模式

大多数集成在请求的 `tools` 参数中声明工具。由客户端执行的工具搜索还支持更高级的模式，允许你的应用返回原始请求中未包含的工具。请将此视为高级 工作流：务必仔细校验返回的 schema，并且只暴露受信任的工具定义。

### 工具搜索与缓存

所有工具都会在模型的上下文窗口末尾加载。托管工具 搜索和客户端执行的工具搜索都遵循此规则。这样可以使模型的缓存在多次请求之间得以保留，从而降低成本并提升速度。

### 在输入中的特定位置添加工具

对于高级工作流，你可以使用 `additional_tools` 输入项，使工具在对话中的特定位置可用。当你的应用在常规工具搜索流程之外加载工具，或者需要保留上一次响应中添加工具的顺序时，这非常有用。

设置为 `role` 并将需要添加的工具放在该项的 `developer` 数组中： `tools` ：

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


包含在 `additional_tools` 项中的工具仅在该项出现在输入中之后才可用。当你手动往返传递对话项时，请保留该项的位置，以便模型在对话中的同一位置看到相同的工具。

## 相关指南

- 使用 [function calling](https://developers.openai.com/api/docs/guides/function-calling) 来定义可调用的函数和自定义工具。
- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools) 了解 Responses 中更广泛的工具生态。