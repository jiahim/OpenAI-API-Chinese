# 使用工具

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

当生成模型响应或构建智能体时，你可以使用内置工具、函数调用、程序化工具调用、工具搜索和远程 MCP 服务器来扩展能力。这些功能使模型能够搜索网页、从你的文件中检索内容、在运行时加载延迟定义的工具、调用你自己的函数、用 JavaScript 组合工具调用，或访问第三方服务。仅 `gpt-5.4` 及更高版本的模型支持 `tool_search`.



网页搜索

    Include web search results for the model response

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)
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
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{
			responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch),
		},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What was a positive news story from today?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What was a positive news story from today?")
        .addTool(WebSearchTool.builder().type(WebSearchTool.Type.WEB_SEARCH).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(ResponseTool.CreateWebSearchTool());
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What was a positive news story from today?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  tools: [{type: "web_search"}],
  input: "What was a positive news story from today?"
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "tools": [{"type": "web_search"}],
        "input": "what was a positive news story from today?"
}'
```

```bash
openai responses create \
  --model gpt-5.6 \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
tools:
  - type: web_search
input: What was a positive news story from today?
YAML
```

  

  

    
文件搜索

    Search your files in a response

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"],
    },
  ],
});
console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="What is deep research by OpenAI?",
    tools=[{"type": "file_search", "vector_store_ids": ["<vector_store_id>"]}],
)
print(response)
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
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is deep research by OpenAI?")},
		Tools: []responses.ToolUnionParam{responses.ToolParamOfFileSearch([]string{"<vector_store_id>"})},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;

String vectorStoreId = "<vector_store_id>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What is deep research by OpenAI?")
        .addFileSearchTool(List.of(vectorStoreId))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateFileSearchTool(["<vector_store_id>"])
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  input: "What is deep research by OpenAI?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: ["<vector_store_id>"]
    }
  ]
)

puts(response)
```

  

  

    
工具搜索

    Load deferred tools at runtime

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

  

  

    
函数调用

    Call your own function

```javascript
import OpenAI from "openai";
const client = new OpenAI();

/** @type {OpenAI.Responses.Tool[]} */
const tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Get current temperature for a given location.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City and country e.g. Bogotá, Colombia",
        },
      },
      required: ["location"],
      additionalProperties: false,
    },
    strict: true,
  },
];

const response = await client.responses.create({
  model: "gpt-5.6",
  input: [
    { role: "user", content: "What is the weather like in Paris today?" },
  ],
  tools,
});

console.log(response.output[0]);
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
        "strict": True,
    },
]

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {"role": "user", "content": "What is the weather like in Paris today?"},
    ],
    tools=tools,
)

print(response.output[0].to_json())
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
			"location": map[string]any{
				"type":        "string",
				"description": "City and country e.g. Bogotá, Colombia",
			},
		},
		"required":             []string{"location"},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction("get_weather", parameters, true)
	tool.OfFunction.Description = openai.String("Get current temperature for a given location.")

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage("What is the weather like in Paris today?", responses.EasyInputMessageRoleUser),
		}},
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
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What is the weather like in Paris today?")
        .addTool(
            FunctionTool.builder()
                .name("get_weather")
                .description("Get current temperature for a given location.")
                .parameters(
                    FunctionTool.Parameters.builder()
                        .putAdditionalProperty("type", JsonValue.from("object"))
                        .putAdditionalProperty(
                            "properties",
                            JsonValue.from(
                                Map.of(
                                    "location",
                                    Map.of(
                                        "type", "string",
                                        "description",
                                            "City and country e.g. Bogotá, Colombia"))))
                        .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                        .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                        .build())
                .strict(true)
                .build())
        .build();

client.responses().create(params).output().forEach(System.out::println);
```

```csharp
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using OpenAI.Responses;
#pragma warning disable CA1869
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateFunctionTool(
        functionName: "get_weather",
        functionDescription: "Get current temperature for a given location.",
        functionParameters: BinaryData.FromString(
            """
            {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and country e.g. Bogotá, Colombia"
                    }
                },
                "required": ["location"],
                "additionalProperties": false
            }
            """
        ),
        strictModeEnabled: true
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What is the weather like in Paris today?")
);

ResponseResult response = client.CreateResponse(options);
Console.WriteLine(
    JsonSerializer.Serialize(
        response.OutputItems[0],
        new JsonSerializerOptions
        {
            TypeInfoResolver = new DefaultJsonTypeInfoResolver(),
        }
    )
);
```

```ruby
require "openai"

openai = OpenAI::Client.new

tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Get current temperature for a given location.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City and country e.g. Bogotá, Colombia"
        }
      },
      required: ["location"],
      additionalProperties: false
    },
    strict: true
  }
]

response = openai.responses.create(
  model: "gpt-5.6",
  input: [
    {role: "user", content: "What is the weather like in Paris today?"}
  ],
  tools: tools
)

puts(response.output.fetch(0).to_json)
```

```bash
curl -X POST https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {"role": "user", "content": "What is the weather like in Paris today?"}
    ],
    "tools": [
      {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City and country e.g. Bogotá, Colombia"
            }
          },
          "required": ["location"],
          "additionalProperties": false
        },
        "strict": true
      }
    ]
  }'
```

  

  

    
远程 MCP

    Call a remote MCP server

```bash
curl https://api.openai.com/v1/responses \ 
-H "Content-Type: application/json" \ 
-H "Authorization: Bearer $OPENAI_API_KEY" \ 
-d '{
  "model": "gpt-5.6",
    "tools": [
      {
        "type": "mcp",
        "server_label": "dmcp",
        "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
        "server_url": "https://dmcp-server.deno.dev/mcp",
        "require_approval": "never"
      }
    ],
    "input": "Roll 2d4+1"
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description:
        "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/mcp",
      require_approval: "never",
    },
  ],
  input: "Roll 2d4+1",
});

console.log(resp.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "mcp",
            "server_label": "dmcp",
            "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
            "server_url": "https://dmcp-server.deno.dev/mcp",
            "require_approval": "never",
        },
    ],
    input="Roll 2d4+1",
)

print(resp.output_text)
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
	tool := responses.ToolParamOfMcp("dmcp")
	tool.OfMcp.ServerDescription = openai.String("A Dungeons and Dragons MCP server to assist with dice rolling.")
	tool.OfMcp.ServerURL = openai.String("https://dmcp-server.deno.dev/mcp")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("never")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Roll 2d4+1")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.Tool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Roll 2d4+1")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("dmcp")
                .serverDescription(
                    "A Dungeons and Dragons MCP server to assist with dice rolling.")
                .serverUrl("https://dmcp-server.deno.dev/mcp")
                .requireApproval(Tool.Mcp.RequireApproval.McpToolApprovalSetting.NEVER)
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "dmcp",
        serverUri: new Uri("https://dmcp-server.deno.dev/mcp"),
        toolCallApprovalPolicy: GlobalMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Roll 2d4+1"));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  tools: [
    {
      type: "mcp",
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/mcp",
      require_approval: "never"
    }
  ],
  input: "Roll 2d4+1"
)

puts(response.output_text)
```



## 可用工具

以下是 OpenAI 平台中可用工具的概览——选择其中一个以获取使用指南。

[函数调用



      Call custom code to give the model access to additional data and
    capabilities.](https://developers.openai.com/api/docs/guides/function-calling)

[网页搜索



      Include data from the Internet in model response generation.](https://developers.openai.com/api/docs/guides/tools-web-search)

[远程 MCP 服务器



      Give the model access to new capabilities via Model Context Protocol (MCP)
    servers.](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)

[技能



      Upload and reuse versioned skill bundles in hosted shell environments.](https://developers.openai.com/api/docs/guides/tools-skills)

[Shell



      Run shell commands in hosted containers or in your own local runtime.](https://developers.openai.com/api/docs/guides/tools-shell)

[计算机使用



      Create agentic workflows that enable a model to control a computer
    interface.](https://developers.openai.com/api/docs/guides/tools-computer-use)

[图像生成



      Generate or edit images using GPT Image.](https://developers.openai.com/api/docs/guides/tools-image-generation)

[文件搜索



      Search the contents of uploaded files for context when generating a
    response.](https://developers.openai.com/api/docs/guides/tools-file-search)

[工具搜索



      Dynamically load relevant tools into the model’s context to optimize token
    usage.](https://developers.openai.com/api/docs/guides/tools-tool-search)

[编程工具调用



      Let models compose and run JavaScript that orchestrates tool calls.](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)

## 在 API 中的使用

当请求生成 [模型响应](https://developers.openai.com/api/reference/resources/responses/methods/create)，时，你通常通过在 `tools` 参数中指定配置来启用工具访问。每个工具都有其独特的配置要求——请参阅 [可用工具](#available-tools) 部分获取详细说明。

根据提供的 [提示](https://developers.openai.com/api/docs/guides/text)，模型会自动决定是否使用已配置的工具。例如，如果你的提示请求的信息超出了模型的训练截止日期，且网页搜索已启用，模型通常会调用网页搜索工具来检索相关的最新信息。

一些高级工作流还可以在交互过程中加载更多工具定义。例如， [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 可以推迟函数定义，直到模型决定需要它们。

你可以通过设置 `tool_choice` 参数 [来显式控制或引导此行为，在API请求中](https://developers.openai.com/api/reference/resources/responses/methods/create).

## 在 Agents SDK 中的使用

在 Agents SDK 中，工具语义保持不变，但接线方式移入 智能体 定义和 工作流 设计中，而非单个 Responses API 请求。

- 当某个专家智能体需要自行调用工具时，直接在该智能体上附加托管工具、函数工具或托管 MCP 工具。
- 当经理需要保持对面向用户回复的控制时，将专家作为工具暴露。
- 即使SDK建模了工具决策，也要在运行时中保留 shell、apply patch 和 computer-use 工具环境。

将本地逻辑封装为函数工具

```javascript
import { tool } from "@openai/agents";
import { z } from "zod";

const getWeatherTool = tool({
  name: "get_weather",
  description: "Get the weather for a given city.",
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
    return `The weather in ${city} is sunny.`;
  },
});
```

```python
from agents import function_tool


@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is sunny."
```


将专家能力暴露为工具

```javascript
import { Agent } from "@openai/agents";

const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a concise summary of the supplied text.",
});

const mainAgent = new Agent({
  name: "Research assistant",
  tools: [
    summarizer.asTool({
      toolName: "summarize_text",
      toolDescription: "Generate a concise summary of the supplied text.",
    }),
  ],
});
```

```python
from agents import Agent

summarizer = Agent(
    name="Summarizer",
    instructions="Generate a concise summary of the supplied text.",
)

main_agent = Agent(
    name="Research assistant",
    tools=[
        summarizer.as_tool(
            tool_name="summarize_text",
            tool_description="Generate a concise summary of the supplied text.",
        )
    ],
)
```


在 [智能体 定义](https://developers.openai.com/api/docs/guides/agents/define-agents) 中塑造单个专家时， [编排与交接](https://developers.openai.com/api/docs/guides/agents/orchestration) 在工具影响所有权时， [护栏与人工审查](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 在工具影响审批时，以及 [集成与可观测性](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) 在能力来源于 MCP 时。