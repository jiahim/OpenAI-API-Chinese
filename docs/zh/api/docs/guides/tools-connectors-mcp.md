# MCP 与连接器

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可在页面 URL 后附加 `.md` 获得。

除了你通过 [函数调用](https://developers.openai.com/api/docs/guides/function-calling)，向模型提供的工具之外，你还可以使用 **连接器** 和 **远程 MCP 服务器**。赋予模型新能力。这些工具让模型在响应用户提示时能够连接到并控制外部服务。这些工具调用可以自动允许，也可以由你作为开发者明确批准来限制。

- **连接器** 是 OpenAI 维护的 MCP 包装器，用于 Google Workspace 或 Dropbox 等热门服务，类似于 [ChatGPT](https://chatgpt.com).
- **远程 MCP 服务器** 可以是公共互联网上任何实现了远程 [模型上下文协议](https://modelcontextprotocol.io/introduction) （MCP）的服务器。

本指南将演示如何使用远程 MCP 服务器和连接器，为模型提供新能力的访问权限。

## 安全 MCP 隧道

如果你的 MCP 服务器是私有的、本地部署的或位于防火墙之后，请使用 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 将其连接到受支持的 OpenAI 产品，而无需将服务器暴露到公共互联网。从以下位置下载最新的公开版本： [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest).

## 快速开始

请查看下面的示例，了解远程 MCP 服务器和连接器如何通过 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。工作。连接器和远程 MCP 服务器都可以与 `mcp` 内置工具类型一起使用。



使用远程 MCP 服务器

    

        Remote MCP servers require a `server_url`. Depending on the server,
        you may also need an OAuth `authorization` parameter containing an
        access token.
    


    Using a remote MCP server in the Responses API

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


    It is very important that developers trust any remote MCP server they use with
        the Responses API. A malicious server can exfiltrate sensitive data from
        anything that enters the model's context. Carefully review the 
        **Risks and Safety** section below before using this tool.

  

  

    
使用连接器

    

        Connectors require a `connector_id` parameter, and an OAuth access
        token provided by your application in the `authorization` parameter.
    


    Using connectors in the Responses API

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-5.6",
    "tools": [
      {
        "type": "mcp",
        "server_label": "Dropbox",
        "connector_id": "connector_dropbox",
        "authorization": "<oauth access token>",
        "require_approval": "never"
      }
    ],
    "input": "Summarize the Q2 earnings report."
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
      server_label: "Dropbox",
      connector_id: "connector_dropbox",
      authorization: "<oauth access token>",
      require_approval: "never",
    },
  ],
  input: "Summarize the Q2 earnings report.",
});

console.log(resp.output_text);
```

```python
import os

from openai import OpenAI

client = OpenAI()
connector_authorization = os.environ["OPENAI_CONNECTOR_AUTHORIZATION"]

resp = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "mcp",
            "server_label": "Dropbox",
            "connector_id": "connector_dropbox",
            "authorization": connector_authorization,
            "require_approval": "never",
        },
    ],
    input="Summarize the Q2 earnings report.",
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
	tool := responses.ToolParamOfMcp("Dropbox")
	tool.OfMcp.ConnectorID = "connector_dropbox"
	tool.OfMcp.Authorization = openai.String("<oauth access token>")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("never")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Summarize the Q2 earnings report.")},
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

String oauthAccessToken = "<oauth access token>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Summarize the Q2 earnings report.")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("Dropbox")
                .connectorId(Tool.Mcp.ConnectorId.of("connector_dropbox"))
                .authorization(oauthAccessToken)
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

string dropboxToken =
    Environment.GetEnvironmentVariable("DROPBOX_OAUTH_ACCESS_TOKEN")!;
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "Dropbox",
        connectorId: McpToolConnectorId.Dropbox,
        authorizationToken: dropboxToken,
        toolCallApprovalPolicy: GlobalMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Summarize the Q2 earnings report.")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Summarize the Q2 earnings report.",
  tools: [{
    type: :mcp,
    server_label: "Dropbox",
    connector_id: "connector_dropbox",
    authorization: "<oauth access token>",
    require_approval: :never
  }]
)

puts(response.output_text)
```



API 将在模型响应中返回新项目 `output` 数组。如果模型决定使用连接器或 MCP 服务器，它将首先向服务器发出请求以列出可用工具，这将创建一个 `mcp_list_tools` 输出项目。从上面的简单远程 MCP 服务器示例来看，它只包含一个工具定义：

```json
{
  "id": "mcpl_68a6102a4968819c8177b05584dd627b0679e572a900e618",
  "type": "mcp_list_tools",
  "server_label": "dmcp",
  "tools": [
    {
      "annotations": null,
      "description": "Given a string of text describing a dice roll...",
      "input_schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "diceRollExpression": {
            "type": "string"
          }
        },
        "required": ["diceRollExpression"],
        "additionalProperties": false
      },
      "name": "roll"
    }
  ]
}
```

如果模型决定调用 MCP 服务器上的某个可用工具，你还会找到一个 `mcp_call` 输出，其中将显示模型发送给 MCP 工具的内容，以及 MCP 工具作为输出返回的内容。

```json
{
  "id": "mcp_68a6102d8948819c9b1490d36d5ffa4a0679e572a900e618",
  "type": "mcp_call",
  "approval_request_id": null,
  "arguments": "{\"diceRollExpression\":\"2d4 + 1\"}",
  "error": null,
  "name": "roll",
  "output": "4",
  "server_label": "dmcp"
}
```

请继续阅读下面的指南，了解 MCP 工具的工作方式、如何筛选可用工具，以及如何处理工具调用审批请求。

## 工作原理

MCP 工具（适用于远程 MCP 服务器和连接器）可在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 的最新模型中使用。请检查你的模型的 MCP 工具兼容性 [此处](https://developers.openai.com/api/docs/models)。当你使用 MCP 工具时，仅需支付 [tokens](https://developers.openai.com/api/docs/pricing) 在导入工具定义或调用工具时产生的费用。每次工具调用不涉及额外费用。

下面，我们将逐步介绍 API 在调用 MCP 工具时执行的过程。

### 第 1 步：列出可用工具

当你在 `tools` 参数中指定远程 MCP 服务器时，API 将尝试从服务器获取工具列表。Responses API 支持支持 Streamable HTTP 或 HTTP/SSE 传输协议的远程 MCP 服务器。

如果成功获取工具列表，一个新的 `mcp_list_tools` 输出项将出现在模型响应的输出中。 `tools` 该对象的属性将显示成功导入的工具。

```json
{
  "id": "mcpl_68a6102a4968819c8177b05584dd627b0679e572a900e618",
  "type": "mcp_list_tools",
  "server_label": "dmcp",
  "tools": [
    {
      "annotations": null,
      "description": "Given a string of text describing a dice roll...",
      "input_schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "diceRollExpression": {
            "type": "string"
          }
        },
        "required": ["diceRollExpression"],
        "additionalProperties": false
      },
      "name": "roll"
    }
  ]
}
```

只要 `mcp_list_tools` 项存在于 API
  请求的上下文中，API 将不会再次从 MCP 服务器获取工具列表，在
  每轮 [对话](https://developers.openai.com/api/docs/guides/conversation-state)。中。我们
  建议你将此项保留在模型上下文中，作为每次
  对话或 工作流 执行的一部分，以优化延迟。

#### 过滤工具

某些 MCP 服务器可能包含数十个工具，向模型暴露过多工具可能导致高成本和高延迟。如果你只对 MCP 服务器暴露的工具子集感兴趣，可以使用 `allowed_tools` 参数仅导入这些工具。

限制允许的工具

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
        "require_approval": "never",
        "allowed_tools": ["roll"]
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
      allowed_tools: ["roll"],
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
            "allowed_tools": ["roll"],
        }
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
	tool.OfMcp.AllowedTools = responses.ToolMcpAllowedToolsUnionParam{OfMcpAllowedTools: []string{"roll"}}

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
import java.util.List;

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
                .allowedToolsOfMcp(List.of("roll"))
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
        allowedTools: new McpToolFilter() { ToolNames = { "roll" } },
        toolCallApprovalPolicy: GlobalMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Roll 2d4+1"));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "Roll 2d4+1",
  tools: [
    {
      type: :mcp,
      server_label: "dmcp",
      server_description: "A Dungeons and Dragons MCP server to assist with dice rolling.",
      server_url: "https://dmcp-server.deno.dev/mcp",
      require_approval: :never,
      allowed_tools: ["roll"]
    }
  ]
)

puts(response.output_text)
```


### 第 2 步：调用工具

一旦模型可以访问这些工具定义，它可能会根据模型上下文中的内容选择调用这些工具。当模型决定调用 MCP 工具时，API 将向远程 MCP 服务器发出请求以调用该工具，并将其输出放入模型的上下文中。这会创建一个 `mcp_call` 看起来像这样的条目：

```json
{
  "id": "mcp_68a6102d8948819c9b1490d36d5ffa4a0679e572a900e618",
  "type": "mcp_call",
  "approval_request_id": null,
  "arguments": "{\"diceRollExpression\":\"2d4 + 1\"}",
  "error": null,
  "name": "roll",
  "output": "4",
  "server_label": "dmcp"
}
```

该条目既包含模型决定为此工具调用使用的参数，也包含 `output` 远程 MCP 服务器返回的结果。所有模型都可以选择进行多次 MCP 工具调用，因此你可能会在单个 API 请求中看到生成多个这样的条目。

失败的工具调用会用 MCP 协议错误、MCP 工具执行错误或一般连接错误填充此条目的错误字段。MCP 错误在 MCP 规范中有文档说明， [此处](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#error-handling).

#### 批准

默认情况下，OpenAI 会在任何数据与连接器或远程 MCP 服务器共享之前请求你的批准。批准有助于你保持对发送到 MCP 服务器的数据的控制和可见性。我们强烈建议你仔细审查（并可选地记录）与远程 MCP 服务器共享的所有数据。请求批准进行 MCP 工具调用会在 Response 的输出中创建一个 `mcp_approval_request` 项，如下所示：

```json
{
  "id": "mcpr_68a619e1d82c8190b50c1ccba7ad18ef0d2d23a86136d339",
  "type": "mcp_approval_request",
  "arguments": "{\"diceRollExpression\":\"2d4 + 1\"}",
  "name": "roll",
  "server_label": "dmcp"
}
```

然后，你可以通过创建新的 Response 对象并附加一个 `mcp_approval_response` 项来响应此请求。

在 API 请求中批准工具的使用

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
        "require_approval": "always",
      }
    ],
    "previous_response_id": "resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",
    "input": [{
      "type": "mcp_approval_response",
      "approve": true,
      "approval_request_id": "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa"
    }]
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
      require_approval: "always",
    },
  ],
  previous_response_id: "resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",
  input: [
    {
      type: "mcp_approval_response",
      approve: true,
      approval_request_id:
        "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",
    },
  ],
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
            "require_approval": "always",
        }
    ],
    previous_response_id="resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",
    input=[
        {
            "type": "mcp_approval_response",
            "approve": True,
            "approval_request_id": "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",
        }
    ],
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
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("always")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
		PreviousResponseID: openai.String("resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa"),
		Tools:              []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMcpApprovalResponse("mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa", true),
		}},
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
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.Tool;
import java.util.List;

String responseId = "resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa";

String approvalRequestId = "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            ResponseCreateParams.Input.ofResponse(
                List.of(
                    ResponseInputItem.ofMcpApprovalResponse(
                        ResponseInputItem.McpApprovalResponse.builder()
                            .approvalRequestId(approvalRequestId)
                            .approve(true)
                            .build()))))
        .previousResponseId(responseId)
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("dmcp")
                .serverDescription("A Dungeons and Dragons MCP server.")
                .serverUrl("https://dmcp-server.deno.dev/mcp")
                .requireApproval(Tool.Mcp.RequireApproval.McpToolApprovalSetting.ALWAYS)
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
        toolCallApprovalPolicy: GlobalMcpToolCallApprovalPolicy.AlwaysRequireApproval
    )
);

// STEP 1: Create a response that requests tool-call approval.
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Roll 2d4+1"));
ResponseResult response1 = await client.CreateResponseAsync(options);

McpToolCallApprovalRequestItem approvalRequest =
    response1.OutputItems.OfType<McpToolCallApprovalRequestItem>().Single();

// STEP 2: Approve the tool call and get the final response.
options.PreviousResponseId = response1.Id;
options.InputItems.Clear();
options.InputItems.Add(
    ResponseItem.CreateMcpApprovalResponseItem(approvalRequest.Id, approved: true)
);
ResponseResult response2 = await client.CreateResponseAsync(options);

Console.WriteLine(response2.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: "resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",
  input: [{
    type: :mcp_approval_response,
    approval_request_id: "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",
    approve: true
  }],
  tools: [{
    type: :mcp,
    server_label: "dmcp",
    server_url: "https://dmcp-server.deno.dev/mcp",
    server_description: "A Dungeons and Dragons MCP server.",
    require_approval: :always
  }]
)

puts(response.output_text)
```


这里我们使用 `previous_response_id` 参数将这个新的 Response 与生成批准请求的前一个 Response 链接起来。但你也可以将 [一个响应的输出作为另一个响应的输入](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) ，以便最大程度地控制进入模型上下文的内容。

如果你觉得可以信任远程 MCP 服务器，可以选择跳过批准以减少延迟。为此，你可以将 MCP 工具的 `require_approval` 参数设置为一个对象，列出你希望跳过批准的仅限工具，如下所示，或者将其设置为值 `'never'` 以跳过该远程 MCP 服务器中所有工具的批准。

某些工具永远不需要批准

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-5.6",
    "tools": [
      {
        "type": "mcp",
        "server_label": "deepwiki",
        "server_url": "https://mcp.deepwiki.com/mcp",
        "require_approval": {
          "never": {
            "tool_names": ["ask_question", "read_wiki_structure"]
          }
        }
      }
    ],
    "input": "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"
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
      server_label: "deepwiki",
      server_url: "https://mcp.deepwiki.com/mcp",
      require_approval: {
        never: {
          tool_names: ["ask_question", "read_wiki_structure"],
        },
      },
    },
  ],
  input:
    "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",
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
            "server_label": "deepwiki",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "require_approval": {
                "never": {"tool_names": ["ask_question", "read_wiki_structure"]}
            },
        },
    ],
    input="What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",
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
	tool := responses.ToolParamOfMcp("deepwiki")
	tool.OfMcp.ServerURL = openai.String("https://mcp.deepwiki.com/mcp")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{
		OfMcpToolApprovalFilter: &responses.ToolMcpRequireApprovalMcpToolApprovalFilterParam{
			Never: responses.ToolMcpRequireApprovalMcpToolApprovalFilterNeverParam{
				ToolNames: []string{"ask_question", "read_wiki_structure"},
			},
		},
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?")},
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
        .input("What transport protocols does the 2025-03-26 version of the MCP spec support?")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("deepwiki")
                .serverUrl("https://mcp.deepwiki.com/mcp")
                .requireApproval(
                    Tool.Mcp.RequireApproval.McpToolApprovalFilter.builder()
                        .never(
                            Tool.Mcp.RequireApproval.McpToolApprovalFilter.Never.builder()
                                .addToolName("ask_question")
                                .addToolName("read_wiki_structure")
                                .build())
                        .build())
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
        serverLabel: "deepwiki",
        serverUri: new Uri("https://mcp.deepwiki.com/mcp"),
        toolCallApprovalPolicy: new CustomMcpToolCallApprovalPolicy
        {
            ToolsNeverRequiringApproval = new McpToolFilter
            {
                ToolNames = { "ask_question", "read_wiki_structure" },
            },
        }
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"
    )
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "What transport protocols does the 2025-03-26 version of the MCP spec support?",
  tools: [
    {
      type: :mcp,
      server_label: "deepwiki",
      server_url: "https://mcp.deepwiki.com/mcp",
      require_approval: {
        never: {tool_names: ["ask_question", "read_wiki_structure"]}
      }
    }
  ]
)

puts(response.output_text)
```


## 身份验证

与 [上面使用的示例 MCP 服务器](https://dash.deno.com/playground/dmcp-server)，不同，大多数其他 MCP 服务器都需要身份验证。最常见的方案是 OAuth 访问令牌。使用 `authorization` 字段提供此令牌给 MCP 工具：

使用 Stripe MCP 工具

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-5.6",
    "input": "Create a payment link for $20",
    "tools": [
      {
        "type": "mcp",
        "server_label": "stripe",
        "server_url": "https://mcp.stripe.com",
        "authorization": "$STRIPE_OAUTH_ACCESS_TOKEN"
      }
    ]
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5.6",
  input: "Create a payment link for $20",
  tools: [
    {
      type: "mcp",
      server_label: "stripe",
      server_url: "https://mcp.stripe.com",
      authorization: "$STRIPE_OAUTH_ACCESS_TOKEN",
    },
  ],
});

console.log(resp.output_text);
```

```python
import os
from openai import OpenAI

client = OpenAI()
authorization = os.environ["STRIPE_OAUTH_ACCESS_TOKEN"]

resp = client.responses.create(
    model="gpt-5.6",
    input="Create a payment link for $20",
    tools=[
        {
            "type": "mcp",
            "server_label": "stripe",
            "server_url": "https://mcp.stripe.com",
            "authorization": authorization,
        }
    ],
)

print(resp.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	authorization := os.Getenv("STRIPE_OAUTH_ACCESS_TOKEN")
	if authorization == "" {
		panic("STRIPE_OAUTH_ACCESS_TOKEN is required")
	}
	client := openai.NewClient()
	tool := responses.ToolParamOfMcp("stripe")
	tool.OfMcp.ServerURL = openai.String("https://mcp.stripe.com")
	tool.OfMcp.Authorization = openai.String(authorization)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Create a payment link for $20")},
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

String stripeAccessToken = System.getenv("STRIPE_OAUTH_ACCESS_TOKEN");

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Create a payment link for $20.")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("stripe")
                .serverUrl("https://mcp.stripe.com")
                .authorization(stripeAccessToken)
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

string authToken =
    Environment.GetEnvironmentVariable("STRIPE_OAUTH_ACCESS_TOKEN")!;
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "stripe",
        serverUri: new Uri("https://mcp.stripe.com"),
        authorizationToken: authToken
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Create a payment link for $20")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Create a payment link for $20.",
  tools: [{
    type: :mcp,
    server_label: "stripe",
    server_url: "https://mcp.stripe.com",
    authorization: ENV.fetch("STRIPE_OAUTH_ACCESS_TOKEN")
  }]
)

puts(response.output_text)
```


为防止敏感令牌泄露，Responses API 不会存储你在 `authorization` 字段中提供的值。此值也不会在创建的 Response 对象中可见。因此，你必须在每次 `authorization` 创建请求中发送 Responses API 所需的。

## 连接器

Responses API 内置支持一组有限的第三方服务连接器。这些连接器让你能够从流行的应用中拉取上下文，如 Dropbox 和 Gmail，使模型能够与常用服务进行交互。

连接器的使用方式与远程 MCP 服务器相同。两者都允许 OpenAI 模型在 API 请求中访问额外的第三方工具。不过，除了传递 `server_url` （如同调用远程 MCP 服务器那样），你还需传递一个 `connector_id` ，它用于唯一标识 API 中可用的一个连接器。

### 可用连接器

- Dropbox： `connector_dropbox`
- Gmail： `connector_gmail`
- Google Calendar： `connector_googlecalendar`
- Google Drive： `connector_googledrive`
- Microsoft Teams： `connector_microsoftteams`
- Outlook Calendar： `connector_outlookcalendar`
- Outlook Email： `connector_outlookemail`
- SharePoint： `connector_sharepoint`

我们优先支持没有官方远程 MCP 服务器的服务。例如，GitHub 有一个官方 MCP 服务器，你可以通过传递 `https://api.githubcopilot.com/mcp/` 到 MCP 工具中的 `server_url` 字段来连接。

### 授权连接器

在 `authorization` 字段中，传入一个 OAuth 访问令牌。OAuth 客户端注册和授权必须由你的应用单独处理。

出于测试目的，你可以使用 Google 的 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) 来生成临时访问令牌，以便在 API 请求中使用。

要使用该 Playground 测试连接器的 API 功能，请先输入：

```
https://www.googleapis.com/auth/calendar.events
```

此授权范围将使 API 能够读取 Google 日历事件。在界面中的“步骤 1：选择并授权 API”下操作。

使用你的 Google 账户授权应用后，你将进入“步骤 2：交换授权码以获取令牌”。这将生成一个访问令牌，你可以在使用 Google 日历连接器的 API 请求中使用它：

使用 Google 日历连接器

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [
      {
        "type": "mcp",
        "server_label": "google_calendar",
        "connector_id": "connector_googlecalendar",
        "authorization": "ya29.A0AS3H6...",
        "require_approval": "never"
      }
    ],
    "input": "What is on my Google Calendar for today?"
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
      server_label: "google_calendar",
      connector_id: "connector_googlecalendar",
      authorization: "ya29.A0AS3H6...",
      require_approval: "never",
    },
  ],
  input: "What's on my Google Calendar for today?",
});

console.log(resp.output_text);
```

```python
import os
from openai import OpenAI

client = OpenAI()
authorization = os.environ["GOOGLE_CALENDAR_OAUTH_ACCESS_TOKEN"]

resp = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "mcp",
            "server_label": "google_calendar",
            "connector_id": "connector_googlecalendar",
            "authorization": authorization,
            "require_approval": "never",
        },
    ],
    input="What's on my Google Calendar for today?",
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
	tool := responses.ToolParamOfMcp("google_calendar")
	tool.OfMcp.ConnectorID = "connector_googlecalendar"
	tool.OfMcp.Authorization = openai.String("<oauth access token>")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("never")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What's on my Google Calendar for today?")},
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

String oauthAccessToken = "<oauth access token>";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What's on my Google Calendar for today?")
        .addTool(
            Tool.Mcp.builder()
                .serverLabel("google_calendar")
                .connectorId(Tool.Mcp.ConnectorId.of("connector_googlecalendar"))
                .authorization(oauthAccessToken)
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

string authToken =
    Environment.GetEnvironmentVariable("GOOGLE_CALENDAR_OAUTH_ACCESS_TOKEN")!;
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "google_calendar",
        connectorId: McpToolConnectorId.GoogleCalendar,
        authorizationToken: authToken,
        toolCallApprovalPolicy: GlobalMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What's on my Google Calendar for today?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "What's on my Google Calendar for today?",
  tools: [{
    type: :mcp,
    server_label: "google_calendar",
    connector_id: "connector_googlecalendar",
    authorization: "<oauth access token>",
    require_approval: :never
  }]
)

puts(response.output_text)
```


来自连接器的 MCP 工具调用看起来与来自远程 MCP 服务器的 MCP 工具调用相同，使用 `mcp_call` 输出项类型。在这种情况下，连接器的参数和响应都是 JSON 字符串：

```json
{
  "id": "mcp_68a62ae1c93c81a2b98c29340aa3ed8800e9b63986850588",
  "type": "mcp_call",
  "approval_request_id": null,
  "arguments": "{\"time_min\":\"2025-08-20T00:00:00\",\"time_max\":\"2025-08-21T00:00:00\",\"timezone_str\":null,\"max_results\":50,\"query\":null,\"calendar_id\":null,\"next_page_token\":null}",
  "error": null,
  "name": "search_events",
  "output": "{\"events\": [{\"id\": \"2n8ni54ani58pc3ii6soelupcs_20250820\", \"summary\": \"Home\", \"location\": null, \"start\": \"2025-08-20T00:00:00\", \"end\": \"2025-08-21T00:00:00\", \"url\": \"https://www.google.com/calendar/event?eid=Mm44bmk1NGFuaTU4cGMzaWk2c29lbHVwY3NfMjAyNTA4MjAga3doaW5uZXJ5QG9wZW5haS5jb20&ctz=America/Los_Angeles\", \"description\": \"\\n\\n\", \"transparency\": \"transparent\", \"display_url\": \"https://www.google.com/calendar/event?eid=Mm44bmk1NGFuaTU4cGMzaWk2c29lbHVwY3NfMjAyNTA4MjAga3doaW5uZXJ5QG9wZW5haS5jb20&ctz=America/Los_Angeles\", \"display_title\": \"Home\"}], \"next_page_token\": null}",
  "server_label": "Google_Calendar"
}
```

### 每个连接器中的可用工具

可用的工具取决于你的 OAuth 令牌可用的作用域。展开下面的表格，查看连接到每个应用程序时可以使用哪些工具。

Dropbox

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`search`</td>
      <td>Search Dropbox for files that match a query</td>
      <td>files.metadata.read, account_info.read</td>
    </tr>
    <tr>
      <td>`fetch`</td>
      <td>Fetch a file by path with optional raw download</td>
      <td>files.content.read</td>
    </tr>
    <tr>
      <td>`search_files`</td>
      <td>Search Dropbox files and return results</td>
      <td>files.metadata.read, account_info.read</td>
    </tr>
    <tr>
      <td>`fetch_file`</td>
      <td>Retrieve a file's text or raw content</td>
      <td>files.content.read, account_info.read</td>
    </tr>
    <tr>
      <td>`list_recent_files`</td>
      <td>Return the most recently modified files accessible to the user</td>
      <td>files.metadata.read, account_info.read</td>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Retrieve the Dropbox profile of the current user</td>
      <td>account_info.read</td>
    </tr>
  </table>

Gmail

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Return the current Gmail user's profile</td>
      <td>userinfo.email, userinfo.profile</td>
    </tr>
    <tr>
      <td>`search_emails`</td>
      <td>Search Gmail for emails matching a query or label</td>
      <td>gmail.modify</td>
    </tr>
    <tr>
      <td>`search_email_ids`</td>
      <td>Retrieve Gmail message IDs matching a search</td>
      <td>gmail.modify</td>
    </tr>
    <tr>
      <td>`get_recent_emails`</td>
      <td>Return the most recently received Gmail messages</td>
      <td>gmail.modify</td>
    </tr>
    <tr>
      <td>`read_email`</td>
      <td>Fetch a single Gmail message including its body</td>
      <td>gmail.modify</td>
    </tr>
    <tr>
      <td>`batch_read_email`</td>
      <td>Read multiple Gmail messages in one call</td>
      <td>gmail.modify</td>
    </tr>
  </table>

Google Calendar

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Return the current Calendar user's profile</td>
      <td>userinfo.email, userinfo.profile</td>
    </tr>
    <tr>
      <td>`search`</td>
      <td>Search Calendar events within an optional time window</td>
      <td>calendar.events</td>
    </tr>
    <tr>
      <td>`fetch`</td>
      <td>Get details for a single Calendar event</td>
      <td>calendar.events</td>
    </tr>
    <tr>
      <td>`search_events`</td>
      <td>Look up Calendar events using filters</td>
      <td>calendar.events</td>
    </tr>
    <tr>
      <td>`read_event`</td>
      <td>Read a Google Calendar event by ID</td>
      <td>calendar.events</td>
    </tr>
  </table>

Google Drive

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Return the current Drive user's profile</td>
      <td>userinfo.email, userinfo.profile</td>
    </tr>
    <tr>
      <td>`list_drives`</td>
      <td>List shared drives accessible to the user</td>
      <td>drive.readonly</td>
    </tr>
    <tr>
      <td>`search`</td>
      <td>Search Drive files using a query</td>
      <td>drive.readonly</td>
    </tr>
    <tr>
      <td>`recent_documents`</td>
      <td>Return the most recently modified documents</td>
      <td>drive.readonly</td>
    </tr>
    <tr>
      <td>`fetch`</td>
      <td>Download the content of a Drive file</td>
      <td>drive.readonly</td>
    </tr>
  </table>

Microsoft Teams

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`search`</td>
      <td>Search Microsoft Teams chats and channel messages</td>
      <td>Chat.Read, ChannelMessage.Read.All</td>
    </tr>
    <tr>
      <td>`fetch`</td>
      <td>Fetch a Teams message by path</td>
      <td>Chat.Read, ChannelMessage.Read.All</td>
    </tr>
    <tr>
      <td>`get_chat_members`</td>
      <td>List the members of a Teams chat</td>
      <td>Chat.Read</td>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Return the authenticated Teams user's profile</td>
      <td>User.Read</td>
    </tr>
  </table>

Outlook Calendar

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`search_events`</td>
      <td>Search Outlook Calendar events with date filters</td>
      <td>Calendars.Read</td>
    </tr>
    <tr>
      <td>`fetch_event`</td>
      <td>Retrieve details for a single event</td>
      <td>Calendars.Read</td>
    </tr>
    <tr>
      <td>`fetch_events_batch`</td>
      <td>Retrieve multiple events in one call</td>
      <td>Calendars.Read</td>
    </tr>
    <tr>
      <td>`list_events`</td>
      <td>List calendar events within a date range</td>
      <td>Calendars.Read</td>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Retrieve the current user's profile</td>
      <td>User.Read</td>
    </tr>
  </table>

Outlook Email

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Return profile info for the Outlook account</td>
      <td>User.Read</td>
    </tr>
    <tr>
      <td>`list_messages`</td>
      <td>Retrieve Outlook emails from a folder</td>
      <td>Mail.Read</td>
    </tr>
    <tr>
      <td>`search_messages`</td>
      <td>Search Outlook emails with optional filters</td>
      <td>Mail.Read</td>
    </tr>
    <tr>
      <td>`get_recent_emails`</td>
      <td>Return the most recently received emails</td>
      <td>Mail.Read</td>
    </tr>
    <tr>
      <td>`fetch_message`</td>
      <td>Fetch a single email by ID</td>
      <td>Mail.Read</td>
    </tr>
    <tr>
      <td>`fetch_messages_batch`</td>
      <td>Retrieve multiple emails in one request</td>
      <td>Mail.Read</td>
    </tr>
  </table>

Sharepoint

<table>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Scopes</th>
    </tr>
    <tr>
      <td>`get_site`</td>
      <td>Resolve a SharePoint site by hostname and path</td>
      <td>Sites.Read.All</td>
    </tr>
    <tr>
      <td>`search`</td>
      <td>Search SharePoint/OneDrive documents by keyword</td>
      <td>Sites.Read.All, Files.Read.All</td>
    </tr>
    <tr>
      <td>`list_recent_documents`</td>
      <td>Return recently accessed documents</td>
      <td>Files.Read.All</td>
    </tr>
    <tr>
      <td>`fetch`</td>
      <td>Fetch content from a Graph file download URL</td>
      <td>Files.Read.All</td>
    </tr>
    <tr>
      <td>`get_profile`</td>
      <td>Retrieve the current user's profile</td>
      <td>User.Read</td>
    </tr>
  </table>

## 延迟加载 MCP 服务器中的工具

如果你正在使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，你可以推迟加载 MCP 服务器暴露的函数，直到模型决定需要它们为止。为此，请设置 `defer_loading: true` 在 MCP 服务器工具定义上。

当你推迟加载 MCP 服务器时，模型仍然可以使用 MCP 服务器的标签和描述来决定何时搜索它，但各个函数的定义仅在需要时才加载。这有助于减少总体令牌使用量，并且对于暴露大量函数的 MCP 服务器最为有用。

```json
{
    "type": "mcp",
    "server_label": "dmcp",
    "server_description": "A Dungeons and Dragons MCP server to assist with dice rolling.",
    "server_url": "https://dmcp-server.deno.dev/mcp",
// highlight-start:subtle
    "defer_loading": true,
// highlight-end
    "require_approval": "never"
}
```


## 风险与安全

MCP 工具允许你将 OpenAI 模型连接到外部服务。这是一个强大的功能，但也伴随一些风险。

对于连接器，存在将敏感数据发送给 OpenAI，或允许模型读取这些服务中潜在敏感数据的风险。

远程 MCP 服务器同样存在这些风险，但它们尚未经过 OpenAI 验证。这些服务器可能允许模型访问、发送和接收数据，并在这些服务中执行操作。所有 MCP 服务器都是第三方服务，受其自身条款和条件约束。

如果你遇到恶意的 MCP 服务器，请向以下地址报告： `security@openai.com`.

以下是集成连接器和远程 MCP 服务器时需要考虑的一些最佳实践。

#### 提示词注入

[提示注入](https://chatgpt.com/?prompt=what%20is%20prompt%20injection?) 是任何 LLM 应用程序中的重要安全考量，当模型可访问 MCP 服务器和连接器，从而可能访问敏感数据或执行操作时尤为如此。如果模型提示包含用户提供的内容，请谨慎使用这些工具并采取适当的缓解措施。

#### 始终要求对敏感操作进行审批

使用可用的 `require_approval` 和 `allowed_tools` 参数配置，确保任何敏感操作都需要审批流程。

#### MCP 工具调用和输出中的 URL

请求由连接器或远程 MCP 服务器提供的工具调用输出中的 URL，或嵌入其中的图片 URL，可能存在风险。在嵌入或以其他方式在应用程序代码中使用这些 URL 之前，请确保你信任提供这些 URL 的域名和服务。

#### 连接到受信任的服务器

选择由服务提供商自己托管的官方服务器（例如，我们建议连接到 Stripe 自己在 mcp.stripe.com 上托管的 Stripe 服务器，而不是由第三方托管的 Stripe MCP 服务器）。因为目前官方远程 MCP 服务器不多，你可能会倾向于使用由不运营该服务器的组织托管的 MCP 服务器，该组织仅通过你的API将请求代理到该服务。如果必须这样做，请对这些“聚合器”进行格外仔细的尽职调查，并仔细审查他们如何使用你的数据。

#### 记录并审查与第三方 MCP 服务器共享的数据。

由于 MCP 服务器定义自己的工具定义，它们可能会请求你未必愿意与该 MCP 服务器的主机共享的数据。因此，Responses API 中的 MCP 工具默认要求对每次 MCP 工具调用进行批准。在开发应用程序时，仔细且全面地审查与这些 MCP 服务器共享的数据类型。一旦你对该 MCP 服务器的信任建立了信心，可以跳过这些批准以获得更高的执行性能。

我们还建议记录发送到 MCP 服务器的任何数据。如果你使用Responses API配合 `store=true`，这些数据已通过API记录 30 天，除非你的组织启用了零数据保留。你可能还希望在自己的系统中记录这些数据，并定期审查以确保数据按照你的预期进行共享。

恶意的 MCP 服务器可能包含隐藏指令（提示注入），旨在使OpenAI模型产生意外行为。虽然OpenAI已实施内置安全措施以帮助检测和阻止这些威胁，但仔细审查输入和输出，并确保仅与可信服务器建立连接仍然至关重要。

MCP 服务器可能会意外更新工具行为，可能导致意外或恶意的行为。

#### 对零数据保留和数据驻留的影响

MCP 工具与零数据保留和数据驻留兼容，但需要注意的是，MCP 服务器是第三方服务，发送到 MCP 服务器的数据受其数据保留和数据驻留政策的约束。

换言之，如果你是数据驻留在欧洲的组织，OpenAI 将限制客户内容的推理和存储，使其在欧洲进行，直到通信或数据发送到 MCP 服务器。你有责任确保 MCP 服务器也遵守你可能有的任何零数据保留或数据驻留要求。了解更多关于零数据保留和数据驻留的信息 [此处](https://developers.openai.com/api/docs/guides/your-data).

## 使用说明

<table>
  <tbody>

 

<tr>
  <th>API Availability</th>
  <th>Rate limits</th>
  <th>Notes</th>
</tr>

<tr>
<td>


    [Responses](https://developers.openai.com/api/reference/resources/responses)




    [Chat Completions](https://developers.openai.com/api/reference/resources/chat)




    [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants)


</td>
<td style={{"maxWidth": "150px"}}>
**Tier 1**

200 RPM

**Tier 2 and 3**

1000 RPM

**Tier 4 and 5**

2000 RPM

</td>
<td style={{"maxWidth": "150px"}}>
[Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) 

[ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data)
</td>
</tr>

</tbody>
</table>