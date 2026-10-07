# 使用工具

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取对应文档页面的 Markdown 版本。

在生成模型响应或构建智能体时，你可以使用内置工具、函数调用、程序化工具调用、工具搜索以及远程 MCP 服务器来扩展能力。这些能力让模型可以搜索网页、从你的文件中检索、在运行时加载延迟加载的工具定义、调用你自己的函数、以 JavaScript 编排工具调用，或访问第三方服务。仅 `gpt-5.4` 及更高版本模型支持 `tool_search`.

根据你的运行时选择集成方式：在 [Responses API 请求](#usage-in-the-api)，中配置工具，在 [智能体 API 智能体](#agents-api)，中配置，或在 [Agents SDK 定义](#usage-in-the-agents-sdk)。中配置。工具的可用性、配置和调用处理取决于具体的集成方式。下面的示例使用 Responses API。



网页搜索

    Include web search results for the model response

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?"
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-6-astra",
        "tools": [{"type": "web_search"}],
        "input": "what was a positive news story from today?"
}'
```

```bash
openai responses create \
  --model gpt-6-astra \
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
string vectorStoreId = "<vector_store_id>";
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateFileSearchTool([vectorStoreId])
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
  model: "gpt-6-astra",
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

  

  

    
函数调用

    Call your own function

```javascript
import OpenAI from "openai";
const client = new OpenAI();

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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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

ResponseResult response = await client.CreateResponseAsync(options);
foreach (ResponseItem outputItem in response.OutputItems)
{
    if (outputItem is FunctionCallResponseItem functionCall)
    {
        Console.WriteLine(
            $"{functionCall.FunctionName}({functionCall.FunctionArguments})"
        );
    }
    else if (outputItem is MessageResponseItem message)
    {
        foreach (ResponseContentPart content in message.Content)
        {
            if (content.Kind == ResponseContentPartKind.OutputText)
            {
                Console.WriteLine(content.Text);
            }
            else if (content.Kind == ResponseContentPartKind.Refusal)
            {
                Console.WriteLine(content.Refusal);
            }
        }
    }
}
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
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: "What is the weather like in Paris today?"
    }
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
    "model": "gpt-6-astra",
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
  "model": "gpt-6-astra",
    "tools": [
      {
        "type": "mcp",
        "server_label": "openai_docs",
        "server_description": "Search and read the public OpenAI documentation.",
        "server_url": "https://developers.openai.com/mcp",
        "require_approval": "never"
      }
    ],
    "input": "Search the OpenAI docs for Responses API streaming and return the relevant links."
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-6-astra",
  tools: [
    {
      type: "mcp",
      server_label: "openai_docs",
      server_description: "Search and read the public OpenAI documentation.",
      server_url: "https://developers.openai.com/mcp",
      require_approval: "never",
    },
  ],
  input:
    "Search the OpenAI docs for Responses API streaming and return the relevant links.",
});

console.log(resp.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-6-astra",
    tools=[
        {
            "type": "mcp",
            "server_label": "openai_docs",
            "server_description": "Search and read the public OpenAI documentation.",
            "server_url": "https://developers.openai.com/mcp",
            "require_approval": "never",
        },
    ],
    input="Search the OpenAI docs for Responses API streaming and return the relevant links.",
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
	tool := responses.ToolParamOfMcp("openai_docs")
	tool.OfMcp.ServerDescription = openai.String("Search and read the public OpenAI documentation.")
	tool.OfMcp.ServerURL = openai.String("https://developers.openai.com/mcp")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("never")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Search the OpenAI docs for Responses API streaming and return the relevant links.")},
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
        .model("gpt-6-astra")
        .input(
            "Search the OpenAI docs for Responses API streaming and return the relevant links.")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("openai_docs")
                .serverDescription("Search and read the public OpenAI documentation.")
                .serverUrl("https://developers.openai.com/mcp")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "openai_docs",
        serverUri: new Uri("https://developers.openai.com/mcp"),
        toolCallApprovalPolicy: DefaultMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Search the OpenAI docs for Responses API streaming and return the relevant links."));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-6-astra",
  tools: [
    {
      type: "mcp",
      server_label: "openai_docs",
      server_description: "Search and read the public OpenAI documentation.",
      server_url: "https://developers.openai.com/mcp",
      require_approval: "never"
    }
  ],
  input: "Search the OpenAI docs for Responses API streaming and return the relevant links."
)

puts(response.output_text)
```



## 可用工具

以下是 OpenAI 平台中可用工具的概览——选择其中一项以获取进一步的用法指导。

[函数调用



      Call custom code to give the model access to additional data and
    capabilities.](https://developers.openai.com/api/docs/guides/function-calling)

[网页搜索



      Include data from the Internet in model response generation.](https://developers.openai.com/api/docs/guides/tools-web-search)

[远程 MCP 服务器



      Give the model access to new capabilities via Model Context Protocol (MCP)
    servers.](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)

[Skills



      Upload and reuse versioned skill bundles in hosted shell environments.](https://developers.openai.com/api/docs/guides/tools-skills)

[Shell



      Run shell commands in hosted containers or in your own local runtime.](https://developers.openai.com/api/docs/guides/tools-shell)

[Computer use



      Create agentic workflows that enable a model to control a computer
    interface.](https://developers.openai.com/api/docs/guides/tools-computer-use)

[图像生成



      Generate or edit images using GPT Image.](https://developers.openai.com/api/docs/guides/tools-image-generation)

[文件搜索



      Search the contents of uploaded files for context when generating a
    response.](https://developers.openai.com/api/docs/guides/tools-file-search)

[Tool search



      Dynamically load relevant tools into the model’s context to optimize token
    usage.](https://developers.openai.com/api/docs/guides/tools-tool-search)

[Programmatic Tool Calling



      Let models compose and run JavaScript that orchestrates tool calls.](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)

## API 中的用法

在向 [模型响应] [model response](https://developers.openai.com/api/reference/resources/responses/methods/create)，发起请求以生成响应时，你通常通过在 tools 参数中指定配置来启用工具访问。每个工具都有其独特的配置要求——请参阅 `tools` tools 参数中指定配置来启用工具访问。每个工具都有其独特的配置要求——请参阅 [Available tools](#available-tools) 部分中的详细说明。

根据提供的 [prompt](https://developers.openai.com/api/docs/guides/text)，模型会自动决定是否使用已配置的工具。例如，如果你的 prompt 请求的内容超出了模型的训练截止日期，并且已启用网页搜索，模型通常会调用网页搜索工具来获取相关的最新信息。

一些高级工作流也可以在交互过程中加载更多工具定义。例如， [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 可以延迟加载函数定义，直到模型决定需要它们为止。

你可以通过在 接口 请求中设置 tool_choice `tool_choice` 参数来显式控制或引导此行为， [in the API request](https://developers.openai.com/api/reference/resources/responses/methods/create).

## 智能体 API

该 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 为你运行 智能体 循环。在以下位置配置工具 `agent.tools`，在应用中处理函数调用，并在工具需要执行环境时连接沙箱。

请参阅 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 以调用应用代码， [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 以连接工具服务器，以及 [沙箱配置](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings) ，了解需要执行环境的工具。 [编程式工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling#agents-api) 默认处于启用状态。 [Skills](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) 通过沙箱的能力目录发现。

## 在 Agents SDK 中的使用

在 Agents SDK 中，工具语义保持不变，但相关配置被移入 智能体 定义和 工作流 设计中，而非单个 Responses API 请求。

- 当需要某个专家自己调用时，将托管工具、函数工具或托管 MCP 工具直接挂载到该智能体上。
- 当需要由管理者掌控面向用户的回复时，将专家作为工具暴露出来。
- 即使 SDK 对工具决策进行建模，也请在运行时中保留 shell、apply patch 和 computer-use 编排框架。

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


将专家智能体暴露为工具

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


使用 [智能体 definitions](https://developers.openai.com/api/docs/guides/agents/define-agents) 当你正在构建单个专家智能体时， [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) 当工具影响所有权时， [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) 当工具影响审批时，以及 [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability#mcp) 当能力来自 MCP 时。