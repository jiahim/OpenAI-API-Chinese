# Tool search

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

工具搜索允许模型根据需要动态搜索并将工具加载到模型的上下文中。这样你无需预先将所有工具定义加载到模型的上下文中，并且 **有助于降低整体 token 用量和成本**。为了在成本和延迟方面达到最佳效果，工具搜索旨在 **保留模型的缓存**。当模型发现新工具时，这些工具会被注入到上下文窗口的末尾。

在 Responses API 中，只有 `gpt-5.4` 及更高版本的模型支持 `tool_search`.

以下配置和示例使用 Responses API。关于基于会话的函数加载和自动 MCP 发现，请参阅 [智能体 API](#agents-api).

要在 Responses API 中启用工具搜索，你需要完成两件事：

1. Add `tool_search` 作为工具添加到你的 `tools` 数组中。
2. 如果你使用的是 [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions),用 `defer_loading: true`。标记你想要延后的项。如果你使用的是 [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp),在 MCP 服务器工具定义上设置 `defer_loading: true` 。

### 尽可能使用命名空间

你可以将工具搜索与延迟 [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces)，或者 [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，一起使用，但我们建议尽可能使用 namespaces 或 MCP servers。我们的模型主要针对这些场景进行训练，并且在这些场景下的 token 节省通常更为显著。

对于 namespaces， `defer_loading` 仅作用于命名空间内的函数，而不是命名空间对象本身。

在请求开始时，模型仍会看到所有可搜索内容的名称和描述。对于 namespace 或 MCP server，这意味着模型在开始时只会看到 namespace 或 server 的名称和描述，而不会显示其中所包含的各个函数的详细信息，直到工具搜索工具加载它们。对于单个延迟函数，模型仍会看到函数名称和描述，因此在实践中工具搜索主要是在延迟参数 schema。

为了最大限度地节省 token，我们建议将延迟函数归入 namespaces 或 MCP servers，并为它们提供清晰的高级描述，使模型能够充分了解其中所包含的内容，从而可以有效地搜索并仅加载相关函数。作为最佳实践，建议将每个 namespace 内的函数数量控制在 10 个以内，以获得更好的 token 效率和模型性能。

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


Namespaces 可以混合使用延迟和非延迟的工具。没有 `defer_loading: true` 的工具可以立即调用，而同一 namespace 中的延迟工具则通过工具搜索加载。

### 工具搜索类型

在两种工具搜索类型之间进行选择：

- **托管工具搜索：** OpenAI 会在你在请求中声明的延迟工具中进行搜索，并在同一响应中返回已加载的子集。
- **客户端执行的工具搜索：** 模型发出一个 `tool_search_call`，由你的应用程序执行查找，并返回一个匹配的 `tool_search_output`.

如果候选工具在创建请求时已经明确，请从托管工具搜索开始
  。当工具发现依赖于项目状态、租户状态或你的应用所控制的
  其他系统时，请使用由客户端执行的工具搜索
  。

## 托管工具搜索

当你已经知道希望模型搜索的完整工具清单时，托管工具搜索是最简单的途径。你可以预先声明它们，添加 [functions](https://developers.openai.com/api/docs/guides/function-calling#defining-functions), [namespaces](https://developers.openai.com/api/docs/guides/function-calling#defining-namespaces)，或者 [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) ，然后由 API 决定要加载哪些。 `{"type": "tool_search"}`，让 接口 决定要加载的内容。

配置 托管工具 搜索

```javascript
import OpenAI from "openai";

const client = new OpenAI();

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
  properties: { customer_id: { type: :string } },
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
    { type: :tool_search }
  ]
)

puts(response.output)
```


如果模型判定它需要一个延迟加载的工具，响应会在最终函数调用之前包含两个额外的输出项：

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


在托管模式下， `execution` 设置为 `server` 和 `call_id` 设置为 `null`.

对于更复杂的任务，模型还可以在同一个 `tool_search_call`。中加载多个命名空间或 MCP 服务器。例如，如果它需要来自不同命名空间的函数来完成一项任务，则可以选择在发起后续函数调用之前一起搜索并加载这些接口面。

## 客户端执行的工具搜索

客户端执行的工具搜索让你的应用可以完全掌控工具发现的方式。当你可用的工具取决于一些不切实际在初始 `tools` 列表中声明的信息时，这非常有用。

为该工具配置 `tool_search` 以及应用所需的搜索参数 schema： `execution: "client"` 以及应用所需的搜索参数 schema：

配置客户端执行的工具搜索

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

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
    ...toResponseInputItems(firstResponse.output),
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
  tools: [
    {
      type: :tool_search,
      execution: :client,
      description: "Find the project tools needed to continue the task.",
      parameters: {
        type: :object,
        properties: { goal: { type: :string } },
        required: ["goal"],
        additionalProperties: false
      }
    }
  ]
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
  input: [
    {
      type: :tool_search_output,
      call_id: call.call_id,
      execution: :client,
      status: :completed,
      tools: [
        {
          type: :function,
          name: "get_shipping_eta",
          description: "Look up shipping details for an order.",
          defer_loading: true,
          strict: true,
          parameters: {
            type: :object,
            properties: { order_id: { type: :string } },
            required: ["order_id"],
            additionalProperties: false
          }
        }
      ]
    }
  ]
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


然后你的应用执行该搜索，并返回一个 `tool_search_output` ，其中包含你希望加载的工具：

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


在下一轮中，已加载的工具可以像普通函数一样被调用：

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


在客户端模式下， `execution` 设置为 `client` 和 `call_id` 已定义。在你的 `call_id` 中原样回显 `tool_search_call` 即可。 `tool_search_output`.

## 高级用法

### 保持命名空间描述清晰

让命名空间的描述清晰且能体现其使用场景，因为模型会根据该描述来决定何时加载该命名空间中的子集函数。避免使用过长的描述；相反，应将更丰富的细节放在那些仅在需要时才会加载的延迟函数描述中。

### 了解加载的内容

`tool_search_output.tools` 包含模型动态加载的工具列表。模型将在后续轮次中能够调用这些工具中的任何一个，因此在客户端模式下，你无需在每轮重复加载相同的工具。未列在该数组中的工具对模型不可用。如果你想禁用已加载的工具，可以从定义已加载工具集的 item 中移除它，但请注意，更改已加载工具集将从该位置起中断模型的缓存。 `tool_search_output` item 中定义已加载工具集，但请注意，更改已加载工具集将从该位置起中断模型的缓存。

### Advanced injection patterns

大多数集成在请求的 `tools` 参数中声明工具。客户端执行的工具搜索也支持更高级的模式，即你的应用返回原始请求中不存在的工具。请将此视为高级的工作流：仔细校验返回的 schema，仅暴露可信的工具定义。

### 工具搜索与缓存

所有工具都会加载到模型上下文窗口的末尾。这对 托管工具 搜索和客户端执行的工具搜索都同样适用。这样可以使模型的缓存在不同请求之间得以保留，从而降低成本并提升速度。

### 在输入的特定位置添加工具

对于高级工作流，你可以使用一个 `additional_tools` 输入项，让工具在对话中的特定位置可用。当你的应用在常规工具搜索流程之外加载工具，或者需要保留上一次响应中添加的工具顺序时，这非常有用。

将 `role` 设置为 `developer` ，并在该项的 `tools` 数组中包含要添加的工具：

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


项中的工具仅在该输入项出现在输入中之后才可用。当你手动往返对话项时，请保留该项的位置，以便模型在对话中的同一点看到相同的工具。 `additional_tools` 项中的工具仅在该输入项出现在输入中之后才可用。当你手动往返对话项时，请保留该项的位置，以便模型在对话中的同一点看到相同的工具。

## 智能体 API

该 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 默认情况下会立即加载函数定义。要延迟加载所选函数,请在 `{ "type": "tool_search" }` 中 `agent.tools` 并设置 `defer_loading: true` on each function you want the 智能体 to discover on demand. Adding `tool_search` does not defer every function.

你的会话请求仍然提供完整的函数定义,包括其名称、描述和参数 schema。工具搜索改变的是该定义到达模型的时机。发现之后,你的应用程序照常处理函数调用并返回结果。详见 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 了解结果处理方式。

将 `OPENAI_API_KEY` 运行此示例前请先完成以下步骤:

仅在需要时加载函数工具

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const result = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    tools: [
      {
        type: "tool_search",
      },
      {
        type: "function",
        name: "lookup_account",
        description: "Find an account by its account number.",
        parameters: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
            },
          },
          required: ["account_id"],
          additionalProperties: false,
        },
        defer_loading: true,
      },
    ],
  },
  environment: {
    type: "none",
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Look up account 42.",
        },
      ],
    },
  ],
});
console.log(result.id);
```

```python
from openai import OpenAI

client = OpenAI()

result = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "tools": [
            {"type": "tool_search"},
            {
                "type": "function",
                "name": "lookup_account",
                "description": "Find an account by its account number.",
                "parameters": {
                    "type": "object",
                    "properties": {"account_id": {"type": "string"}},
                    "required": ["account_id"],
                    "additionalProperties": False,
                },
                "defer_loading": True,
            },
        ],
    },
    environment={"type": "none"},
    input=[
        {
            "role": "user",
            "content": [{"type": "input_text", "text": "Look up account 42."}],
        }
    ],
)
print(result.id)
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model: openai.String("gpt-6-astra"),
			Tools: []openai.AgentToolParamUnion{
				{OfParamToolSearch: &openai.AgentToolParamToolSearch{}},
				{
					OfParamFunction: &openai.AgentToolParamFunction{
						Name:        "lookup_account",
						Description: "Find an account by its account number.",
						Parameters: map[string]any{
							"type":                 "object",
							"properties":           map[string]any{"account_id": map[string]any{"type": "string"}},
							"required":             []any{"account_id"},
							"additionalProperties": false,
						},
						DeferLoading: openai.Bool(true),
					},
				},
			},
		},
		Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
		Input: openai.BetaAgentSessionNewParamsInputUnion{
			OfArrayOfInputMessages: []openai.AgentSessionInputMessageParam{
				{
					Content: []openai.InputContentParamUnion{
						{OfParamInputText: &openai.InputContentParamInputText{Text: "Look up account 42."}},
					},
				},
			},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result.ID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.beta.agents.AgentToolParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import java.util.List;
import java.util.Map;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .addToolToolSearch()
                        .addTool(
                            AgentToolParam.Function.builder()
                                .name("lookup_account")
                                .description("Find an account by its account number.")
                                .parameters(
                                    AgentToolParam.Function.Parameters.builder()
                                        .putAdditionalProperty("type", JsonValue.from("object"))
                                        .putAdditionalProperty(
                                            "properties",
                                            JsonValue.from(
                                                Map.of("account_id", Map.of("type", "string"))))
                                        .putAdditionalProperty(
                                            "required", JsonValue.from(List.of("account_id")))
                                        .putAdditionalProperty(
                                            "additionalProperties", JsonValue.from(false))
                                        .build())
                                .deferLoading(true)
                                .build())
                        .build())
                .environmentNone()
                .input("Look up account 42.")
                .build());
System.out.println(result.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    tools: [
      { type: "tool_search" },
      {
        type: "function",
        name: "lookup_account",
        description: "Find an account by its account number.",
        parameters: {
          type: "object",
          properties: { account_id: { type: "string" } },
          required: ["account_id"],
          additionalProperties: false
        },
        defer_loading: true
      }
    ]
  },
  environment: { type: "none" },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Look up account 42."
        }
      ]
    }
  ]
)
puts result.id
```


### 选择函数加载策略

| 策略         | 配置                                        | 适用场景                                                    | 权衡                                                                                 |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 预加载    | 省略 `defer_loading` 或将其设置为 `false`.           | 少量函数，或大多数任务所需的函数。 | 未使用的定义会占用上下文。更改定义可能会使已缓存的前缀失效。 |
| 延迟加载 | 设置 `defer_loading: true` 并包含 `tool_search`. | 大量函数目录，但每个任务只需要其中少量函数。   | 发现会增加一个步骤，并且依赖于能否找到相关工具。                          |

在智能体 API 会话中混合使用 eager 和 deferred 函数是被支持的，但通常不推荐这样做。为 deferred 函数设定清晰的名称和描述。在确定默认值之前，先使用有代表性的请求比较任务完成情况、输入 token 用量和延迟。

### MCP 和插件工具

当模型和提供商支持工具搜索时，MCP 工具会在 智能体 API 中使用自动发现。当存在可搜索的延迟工具时，运行时会延迟加载 MCP 工具并添加工具搜索。此规则适用于远程 MCP、执行器 MCP 以及由插件提供的 MCP 工具。

无需添加 `{ "type": "tool_search" }` 仅用于 MCP 工具或在 MCP 服务器上设置函数级 `defer_loading` 标志。请通过 [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp)。进行服务器配置。本指南前面介绍的 Responses API 配置不适用于 智能体 API MCP 服务器。

## 相关指南

- 使用 [function calling](https://developers.openai.com/api/docs/guides/function-calling) 来定义可调用的函数和自定义工具。
- 使用 [使用工具](https://developers.openai.com/api/docs/guides/tools) 了解 Responses 中更广泛的工具生态。