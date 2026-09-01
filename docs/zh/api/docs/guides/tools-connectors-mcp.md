# MCP and Connectors

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获得该页面的 Markdown 版本。

除了通过 [函数调用](https://developers.openai.com/api/docs/guides/function-calling)，向模型提供的工具外，你还可以使用 **连接器** 和 **远程 MCP 服务器**. 这些工具使模型能够在需要响应用户提示时连接并控制外部服务。这些工具调用既可以被自动允许，也可以被限制为由作为开发者的你显式批准。

- **连接器** 是 OpenAI 维护的 MCP 包装器，用于 Google Workspace 或 Dropbox 等常用服务，类似于 [ChatGPT](https://chatgpt.com).
- **远程 MCP 服务器** 可以是公共互联网上实现远程 [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) 服务器的任意服务器。

本指南将展示如何使用远程 MCP 服务器和连接器，使模型能够访问新的能力。

## Secure MCP Tunnel

如果你的 MCP 服务器是私有的、本地部署的，或者位于防火墙之后，请使用 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 来将其连接到受支持的 OpenAI 产品，而无需将服务器暴露在公共互联网上。可从以下地址下载最新的公开版本： [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest).

## 快速入门

查看下面的示例，了解远程 MCP 服务器和连接器如何通过 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。工作。连接器和远程 MCP 服务器都可以与 `mcp` 内置工具类型一起使用。



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



API 会在模型响应的 `output` 数组中返回新的项。如果模型决定使用连接器或 MCP 服务器，它会先发起一次请求以列出服务器中可用的工具，这会创建一个 `mcp_list_tools` 输出项。在上面的简单远程 MCP 服务器示例中，它只包含一个工具定义：

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

如果模型决定调用 MCP 服务器中某个可用的工具，你还会找到一个 `mcp_call` 输出，它会展示模型发送给 MCP 工具的内容，以及 MCP 工具作为输出返回的内容。

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

请继续阅读下面的指南，了解 MCP 工具的工作原理、如何过滤可用工具，以及如何处理工具调用审批请求。

## 工作原理

MCP 工具（适用于远程 MCP 服务器和连接器）可在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 的最新模型中使用。请在此处查看你模型的 MCP 工具兼容性 [此处](https://developers.openai.com/api/docs/models)。使用 MCP 工具时，你只需为 [令牌](https://developers.openai.com/api/docs/pricing) 付费，即导入工具定义或发起工具调用时使用的令牌。每次工具调用不会产生额外费用。

下面，我们将逐步介绍 API 在调用 MCP 工具时所执行的流程。

### 第 1 步：列出可用的工具

当你在 `tools` 参数中指定远程 MCP 服务器时，API 将尝试从服务器获取工具列表。Responses API 支持使用 Streamable HTTP 或 HTTP/SSE 传输协议的远程 MCP 服务器。

如果成功获取到工具列表，则会在模型响应输出中出现一个新的 `mcp_list_tools` 输出项。该对象的 `tools` 属性将显示已成功导入的工具。

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

只要该 `mcp_list_tools` 项存在于 API 的上下文中
  request，API 不会在每次对话轮次时再次从 MCP 服务器获取工具列表，
  而是在 [conversation](https://developers.openai.com/api/docs/guides/conversation-state)。我们建议你在每个
  conversation 或
  工作流 execution 中始终保留此项到模型上下文里，以优化延迟。

#### 过滤工具

一些 MCP 服务器可能包含数十个工具，向模型暴露过多工具会导致较高的成本和延迟。如果只关心 MCP 服务器所暴露工具的一个子集，可以使用 `allowed_tools` 参数仅导入这些工具。

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


### 步骤 2：调用工具

一旦模型获得了这些工具的定义，它可能会根据模型上下文中的内容选择调用它们。当模型决定调用一个 MCP 工具时，API 会向远程 MCP 服务器发起请求以调用该工具，并将其输出放入模型的上下文中。这会产生一条类似于下方的 `mcp_call` 条目：

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

该条目既包含模型决定用于本次工具调用的参数，也包含远程 MCP 服务器返回的 `output` 结果。所有模型都可以选择发起多次 MCP 工具调用，因此在单次 API 请求中你可能会看到多条这样的条目。

失败的工具调用会在该条目的 error 字段中填充 MCP 协议错误、MCP 工具执行错误或一般的连接错误。MCP 错误在 MCP 规范中有所记录 [此处](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#error-handling).

#### Approvals

默认情况下，OpenAI 会在任何数据被共享到连接器或远程 MCP 服务器之前请求你的批准。批准机制可以帮助你保持对发送到 MCP 服务器的数据的可见性和控制权。我们强烈建议你仔细审查（并视情况记录）所有与远程 MCP 服务器共享的数据。请求批准以发起 MCP 工具调用时，会在 Response 的输出中创建一个 `mcp_approval_request` item，类似于：

```json
{
  "id": "mcpr_68a619e1d82c8190b50c1ccba7ad18ef0d2d23a86136d339",
  "type": "mcp_approval_request",
  "arguments": "{\"diceRollExpression\":\"2d4 + 1\"}",
  "name": "roll",
  "server_label": "dmcp"
}
```

然后你可以通过创建一个新的 Response 对象并向其中追加一个 `mcp_approval_response` item 来进行回应。

在 API 请求中批准使用工具

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

// Step 1: Create a response that requests tool-call approval.
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Roll 2d4+1"));
ResponseResult response1 = await client.CreateResponseAsync(options);

McpToolCallApprovalRequestItem approvalRequest =
    response1.OutputItems.OfType<McpToolCallApprovalRequestItem>().Single();

// Step 2: Approve the tool call and get the final response.
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


这里我们使用 `previous_response_id` 参数将此新的 Response 与生成批准请求的前一个 Response 链接起来。但你也可以将一个 Response 的 [输出作为另一个的输入传递，](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) 以最大程度地控制进入模型上下文的内容。

如果你觉得可以信任某个远程 MCP 服务器，可以选择跳过批准以降低延迟。为此，你可以将 MCP 工具的 `require_approval` 参数设置为一个对象，仅列出你希望跳过批准的工具，如下所示；或者将其设置为值 `'never'` ，以跳过该远程 MCP 服务器中所有工具的批准。

从不要求某些工具的批准

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


## Authentication

与上面的 [示例 MCP 服务器不同](https://dash.deno.com/playground/dmcp-server)，大多数其他 MCP 服务器都需要身份验证。最常见的方案是 OAuth 访问令牌。请使用 MCP 工具的 `authorization` 字段提供该令牌：

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


为防止敏感令牌泄露，Responses API 不会存储你在 `authorization` 字段中提供的值。该值也不会出现在所创建的 Response 对象中。因此，你必须在每次发起 `authorization` 请求时都传入 Responses API 值。

## Connectors

Responses API 内置了对部分第三方服务连接器的支持。这些连接器可让你从流行的应用（如 Dropbox 和 Gmail）中拉取上下文，从而让模型能够与这些常用服务进行交互。

连接器的使用方式与远程 MCP 服务器相同。二者都允许 OpenAI 模型在 API 请求中访问其他第三方工具。不过，与之不同的是，你传递的是 `server_url` （而不是像调用远程 MCP 服务器时那样传递），而是传递一个 `connector_id` ，用于唯一标识 API 中可用的连接器。

### 可用的连接器

- Dropbox: `connector_dropbox`
- Gmail: `connector_gmail`
- Google Calendar: `connector_googlecalendar`
- Google Drive: `connector_googledrive`
- Microsoft Teams: `connector_microsoftteams`
- Outlook Calendar: `connector_outlookcalendar`
- Outlook Email: `connector_outlookemail`
- SharePoint: `connector_sharepoint`

我们优先选择那些没有官方远程 MCP server 的服务。例如，GitHub 拥有一个官方 MCP server，你可以通过将 `https://api.githubcopilot.com/mcp/` 传入到 MCP 工具的 `server_url` 字段来连接它。

### 授权连接器

在 `authorization` 字段中传入 OAuth 访问令牌。OAuth 客户端注册和授权必须由你的应用单独处理。

出于测试目的，你可以使用 Google 的 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) 来生成可在 API 请求中使用的临时访问令牌。

若要使用 playground 来测试连接器 API 功能，请先输入：

```
https://www.googleapis.com/auth/calendar.events
```

此授权范围将允许 API 读取 Google 日历事件。在界面中的“Step 1: Select and authorize APIs”部分进行设置。

使用你的 Google 账户授权该应用后，你将进入“Step 2: Exchange authorization code for tokens”。这将生成一个访问令牌，你可以在使用 Google Calendar 连接器的 API 请求中使用它：

使用 Google Calendar 连接器

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


来自连接器的 MCP 工具调用与来自远程 MCP 服务器的 MCP 工具调用形式相同，均使用 `mcp_call` output 输出项类型。在这种情况下，传入连接器的参数以及连接器返回的响应均为 JSON 字符串：

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

### Available tools in each connector

可用的工具取决于你的 OAuth 令牌所拥有的作用域。请展开下表，查看连接到每个应用程序时可以使用的工具。



#### Dropbox


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






#### Gmail


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






#### Google Calendar


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






#### Google Drive


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






#### Microsoft Teams


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






#### Outlook Calendar


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






#### Outlook Email


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






#### Sharepoint


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




## 在 MCP 服务端中延迟加载工具

如果你使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，你可以延迟加载 MCP 服务器暴露的函数，直到模型决定需要它们为止。为此，请在 MCP 服务器工具定义中设置 `defer_loading: true` 。

当你延迟加载 MCP 服务器时，模型仍然可以使用该 MCP 服务器的标签和描述来决定何时搜索它，但各个函数定义仅在需要时才被加载。这有助于降低整体 token 使用量，对于暴露大量函数的 MCP 服务器尤其有用。

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

MCP 工具允许你将 OpenAI 模型连接到外部服务。这是一项强大功能，但也带来了一些风险。

对于连接器，存在可能将敏感数据发送给 OpenAI 的风险，或者允许模型对这些服务中潜在的敏感数据进行读取访问。

远程 MCP 服务器也存在上述同样的风险，此外它们尚未经过 OpenAI 的验证。这些服务器允许模型访问、发送和接收数据，并在这些服务中执行操作。所有 MCP 服务器均为第三方服务，须遵守其各自的条款和条件。

如果你发现恶意的 MCP 服务器，请向我们举报 `security@openai.com`.

下面列出了一些在集成连接器和远程 MCP 服务器时值得参考的最佳实践。

#### Prompt injection

[Prompt injection](https://chatgpt.com/?prompt=what%20is%20prompt%20injection?) 是任何 LLM 应用中一项重要的安全考量，在当你让模型访问能够访问敏感数据或执行操作的 MCP 服务器和连接器时，这一点尤为关键。如果提供给模型的提示词包含用户提供的内容，请谨慎使用这些工具并采取相应的缓解措施。

#### 始终要求对敏感操作的审批

使用所提供的 `require_approval` 和 `allowed_tools` 参数，以确保任何敏感操作都需要经过审批流程。

#### MCP 工具调用和输出中的 URL

请求来自连接器或远程 MCP 服务器的工具调用输出中的 URL，或将这些图片 URL 嵌入到应用中，可能会带来危险。在将其嵌入到应用代码中或以其他方式使用之前，请确保你信任提供这些 URL 的域和服务。

#### 连接到受信任的服务器

选择由服务提供商官方托管的服务器（例如，我们建议连接到由 Stripe 官方托管的 mcp.stripe.com 上的 Stripe 服务器，而不是由第三方托管的 Stripe MCP 服务器）。由于目前官方远程 MCP 服务器数量不多，你可能会倾向于使用由某个并不实际运营该服务器的组织所托管的 MCP 服务器，它只是通过你的API将请求代理到该服务。如果必须这样做，请在尽职调查时格外谨慎，并仔细审查他们如何使用你的数据。

#### 记录并审查与第三方 MCP 服务器共享的数据。

由于 MCP 服务器自行定义其工具定义，它们可能会请求一些你未必始终愿意与该 MCP 服务器的宿主共享的数据。因此，Responses API 中的 MCP 工具默认要求对每次 MCP 工具调用进行审批。在开发你的应用时，请仔细且充分地审查与这些 MCP 服务器共享的数据类型。一旦你对该 MCP 服务器建立充分信任，便可跳过这些审批，以获得更高的执行性能。

我们还建议记录所有发送给 MCP 服务器的数据。如果你正在使用 Responses API 并且 `store=true`，所在组织未启用 Zero Data Retention，则这些数据已通过 API 保留 30 天。你也可以在自己的系统中记录这些数据，并定期审查，以确保数据的共享方式符合你的预期。

恶意 MCP 服务器可能包含旨在使 OpenAI 模型表现异常的隐藏指令（提示注入）。虽然 OpenAI 已实施内置的防护措施来帮助检测和拦截这些威胁，但你仍必须仔细审查输入和输出，并确保仅与可信的服务器建立连接。

MCP 服务器可能意外地更新工具行为，从而可能导致意外或恶意的行为。

#### 对零数据留存和数据驻留的影响

MCP 工具兼容零数据留存和数据驻留，但需要注意的是，MCP 服务器属于第三方服务，发送到 MCP 服务器的数据将适用其各自的数据留存和数据驻留策略。

换句话说，如果你的组织在欧洲启用了数据驻留，OpenAI 会将客户内容的推理和存储限制在欧洲境内，直到数据或通信被发送到 MCP 服务器为止。你有责任确保 MCP 服务器同样遵守你可能存在的任何零数据留存或数据驻留要求。详细了解零数据留存和数据驻留 [此处](https://developers.openai.com/api/docs/guides/your-data).

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