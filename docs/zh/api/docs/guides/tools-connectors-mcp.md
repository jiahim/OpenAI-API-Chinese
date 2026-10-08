# MCP servers

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

除了你通过 [函数调用](https://developers.openai.com/api/docs/guides/function-calling)，提供给模型的工具外，你还可以使用 **远程 MCP 服务器** 或 **安全 MCP 隧道**。为模型赋予新能力。这些工具使模型能够在需要时连接并控制外部服务来响应用户的提示。这些工具调用既可以被自动允许，也可以受到限制，要求你作为开发者进行明确批准。

- **远程 MCP 服务器** 可以是公共互联网上实现了远程的任意服务器 [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) 服务器。

- **Secure MCP Tunnel** 可在不将其暴露给公共互联网的情况下连接本地或私有 MCP 服务器。

本指南介绍如何将 MCP 工具与 Responses API 配合使用。内置连接器仍受现有模型支持；请参阅 [旧版连接器](#connectors) 了解弃用策略与兼容性示例。对于 智能体 API 会话，请参阅 [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp)，其中涵盖来自托管服务或你的沙箱的连接。

## Secure MCP Tunnel

如果你的 MCP 服务器是私有的、本地部署的或位于防火墙后面，请使用 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 将其连接到受支持的 OpenAI 产品，而无需将服务器暴露在公共互联网上。从 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest).

## 快速开始

使用 `mcp` 工具类型在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。设置 `server_url` 用于远程 MCP 服务器，或者使用 `tunnel_id` 通过以下方式访问本地 MCP 服务器 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)。根据服务器的不同，你可能还需要在以下位置提供 OAuth 访问令牌 `authorization` 参数。

下面的示例使用公共 [OpenAI Docs MCP 服务器](https://developers.openai.com/resources/docs-mcp) 来查找关于流式 Responses API 输出的相关文档。该服务器提供只读文档工具，无需身份验证。此示例在此次公共文档查询中跳过了工具调用审批；在共享敏感数据时请使用审批。

在 Responses API 中使用远程 MCP 服务器

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


开发人员务必信任他们与
  一起使用的任何远程 MCP 服务器 —— Responses API。恶意服务器可能会从
  任何进入模型上下文的内容中窃取敏感数据。在使用此工具之前，请仔细阅读以下 
  **风险与安全** 部分。

API 将在模型响应的 `output` 数组中返回新项。如果模型决定使用某个 MCP 服务器，它将首先向服务器发出列出可用工具的请求，这将会创建一个 `mcp_list_tools` 输出项。下面这个示例输出仅展示了搜索工具，并对其描述进行了简化处理。该服务器还提供了其他文档工具。

```json
{
  "id": "mcpl_68a6102a4968819c8177b05584dd627b0679e572a900e618",
  "type": "mcp_list_tools",
  "server_label": "openai_docs",
  "tools": [
    {
      "annotations": {
        "readOnlyHint": true,
        "destructiveHint": false
      },
      "description": "Search the public OpenAI documentation.",
      "input_schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "minLength": 1
          },
          "limit": {
            "type": "integer",
            "minimum": 1,
            "maximum": 50
          },
          "cursor": {
            "type": "string"
          }
        },
        "required": ["query"]
      },
      "name": "search_openai_docs"
    }
  ]
}
```

如果模型决定调用 MCP 服务器中可用的工具之一，你还会找到一个 `mcp_call` output，其中会显示模型发送给 MCP 工具的内容，以及 MCP 工具作为输出发回的内容。

```json
{
  "id": "mcp_68a6102d8948819c9b1490d36d5ffa4a0679e572a900e618",
  "type": "mcp_call",
  "approval_request_id": null,
  "arguments": "{\"query\":\"Responses API streaming\",\"limit\":1}",
  "error": null,
  "name": "search_openai_docs",
  "output": "{\"hits\":[{\"url\":\"https://developers.openai.com/api/docs/guides/streaming-responses\"}]}",
  "server_label": "openai_docs"
}
```

请继续阅读下面的指南，详细了解 MCP 工具的工作原理、如何筛选可用工具以及如何处理工具调用审批请求。

## 工作原理

MCP 工具可在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 大多数近期模型中使用。请查看你的模型的 MCP 工具兼容性 [此处](https://developers.openai.com/api/docs/models)。使用 MCP 工具时，你只需为 [tokens](https://developers.openai.com/api/docs/pricing) 导入工具定义或发起工具调用时所使用的 tokens 付费，每次工具调用不收取额外费用。

下面，我们将逐步演示 API 在调用 MCP 工具时所经历的整个过程。

### Step 1: Listing available tools

当你在 `tools` 参数中指定远程 MCP 服务器时，API 将尝试从该服务器获取工具列表。Responses API 支持与使用 Streamable HTTP 或 HTTP/SSE 传输协议的远程 MCP 服务器配合使用。

如果成功获取到工具列表，模型响应输出中将出现一个新的 `mcp_list_tools` 输出项。该对象的 `tools` 属性将显示已成功导入的工具。下面的示例片段仅展示了搜索工具，且其描述已缩短。

```json
{
  "id": "mcpl_68a6102a4968819c8177b05584dd627b0679e572a900e618",
  "type": "mcp_list_tools",
  "server_label": "openai_docs",
  "tools": [
    {
      "annotations": {
        "readOnlyHint": true,
        "destructiveHint": false
      },
      "description": "Search the public OpenAI documentation.",
      "input_schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "minLength": 1
          },
          "limit": {
            "type": "integer",
            "minimum": 1,
            "maximum": 50
          },
          "cursor": {
            "type": "string"
          }
        },
        "required": ["query"]
      },
      "name": "search_openai_docs"
    }
  ]
}
```

只要 `mcp_list_tools` 项出现在 API 的上下文中
  request, the API will not fetch a list of tools from the MCP server again at
  each turn in a [conversation](https://developers.openai.com/api/docs/guides/conversation-state)。我们
  建议你将此项保留在模型的上下文中，作为每次
  conversation 或 工作流 执行的一部分，以优化延迟。

#### 过滤工具

一些 MCP 服务器可能包含数十个工具，向模型暴露过多工具会导致较高的成本和延迟。如果你只关心 MCP 服务器暴露的工具子集，可以使用 `allowed_tools` 参数仅导入这些工具。本示例仅导入 `search_openai_docs` 以查找文档链接。

限制允许的工具

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
        "require_approval": "never",
        "allowed_tools": ["search_openai_docs"]
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
      allowed_tools: ["search_openai_docs"],
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
            "allowed_tools": ["search_openai_docs"],
        }
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
	tool.OfMcp.AllowedTools = responses.ToolMcpAllowedToolsUnionParam{OfMcpAllowedTools: []string{"search_openai_docs"}}

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
import java.util.List;

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
                .allowedToolsOfMcp(List.of("search_openai_docs"))
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
        allowedTools: new McpToolFilter() { ToolNames = { "search_openai_docs" } },
        toolCallApprovalPolicy: DefaultMcpToolCallApprovalPolicy.NeverRequireApproval
    )
);
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Search the OpenAI docs for Responses API streaming and return the relevant links."));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "Search the OpenAI docs for Responses API streaming and return the relevant links.",
  tools: [
    {
      type: :mcp,
      server_label: "openai_docs",
      server_description: "Search and read the public OpenAI documentation.",
      server_url: "https://developers.openai.com/mcp",
      require_approval: :never,
      allowed_tools: ["search_openai_docs"]
    }
  ]
)

puts(response.output_text)
```


### 第 2 步：调用工具

一旦模型能够访问这些工具定义，它可能会根据模型上下文中的内容选择调用它们。当模型决定调用一个 MCP 工具时，API 会向远程 MCP 服务器发起请求以调用该工具，并将其输出放入模型的上下文中。这会生成一个 `mcp_call` 条目。为简洁起见，下面的示例输出省略了搜索结果的元数据：

```json
{
  "id": "mcp_68a6102d8948819c9b1490d36d5ffa4a0679e572a900e618",
  "type": "mcp_call",
  "approval_request_id": null,
  "arguments": "{\"query\":\"Responses API streaming\",\"limit\":1}",
  "error": null,
  "name": "search_openai_docs",
  "output": "{\"hits\":[{\"url\":\"https://developers.openai.com/api/docs/guides/streaming-responses\"}]}",
  "server_label": "openai_docs"
}
```

该条目既包含模型为本次工具调用决定使用的参数，也包含远程 MCP 服务器返回的 `output` 。所有模型都可以选择发起多个 MCP 工具调用，因此你可能在单个 API 请求中看到若干个这样的条目。

失败的工具调用会使用 MCP 协议错误、MCP 工具执行错误或一般连接错误来填充此条目的 error 字段。MCP 错误的说明见 MCP 规范 [此处](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#error-handling).

#### 审批

默认情况下，OpenAI 会在任何数据被共享到连接器或远程 MCP 服务器之前请求你的批准。审批机制可以帮助你保持对所共享数据的控制和可见性。我们强烈建议你仔细检查（并可选择性地记录）所有与远程 MCP 服务器共享的数据。若要试用审批流程，请运行快速入门示例，并将 `require_approval` 设置为 `"always"` 而不是 `"never"`。调用 MCP 工具的审批请求会在 Response 的输出中生成一个 `mcp_approval_request` 条目。以下示例用于演示：

```json
{
  "id": "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",
  "type": "mcp_approval_request",
  "arguments": "{\"query\":\"Responses API streaming\",\"limit\":1}",
  "name": "search_openai_docs",
  "server_label": "openai_docs"
}
```

在批准之前，请检查所请求的工具及其参数。然后，你可以通过创建一个新的 Response 对象并向其追加一个 `mcp_approval_response` 条目来作出响应。请将以下示例中用于演示的 response 和 approval-request ID 替换为你自己的请求所返回的 ID。.NET 示例从其初始响应中获取这些 ID。每次审批仅适用于一次工具调用；以相同方式处理后续的审批请求即可。

在 API 请求中批准工具的使用

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
        "require_approval": "always"
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
  model: "gpt-6-astra",
  tools: [
    {
      type: "mcp",
      server_label: "openai_docs",
      server_description: "Search and read the public OpenAI documentation.",
      server_url: "https://developers.openai.com/mcp",
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
    model="gpt-6-astra",
    tools=[
        {
            "type": "mcp",
            "server_label": "openai_docs",
            "server_description": "Search and read the public OpenAI documentation.",
            "server_url": "https://developers.openai.com/mcp",
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
	tool := responses.ToolParamOfMcp("openai_docs")
	tool.OfMcp.ServerDescription = openai.String("Search and read the public OpenAI documentation.")
	tool.OfMcp.ServerURL = openai.String("https://developers.openai.com/mcp")
	tool.OfMcp.RequireApproval = responses.ToolMcpRequireApprovalUnionParam{OfMcpToolApprovalSetting: openai.String("always")}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
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
        .model("gpt-6-astra")
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
                .serverLabel("openai_docs")
                .serverDescription("Search and read the public OpenAI documentation.")
                .serverUrl("https://developers.openai.com/mcp")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "openai_docs",
        serverUri: new Uri("https://developers.openai.com/mcp"),
        toolCallApprovalPolicy: DefaultMcpToolCallApprovalPolicy.AlwaysRequireApproval
    )
);

// Step 1: Create a response that requests tool-call approval.
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Search the OpenAI docs for Responses API streaming and return the relevant links."));
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
  model: "gpt-6-astra",
  previous_response_id: "resp_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",
  input: [
    {
      type: :mcp_approval_response,
      approval_request_id: "mcpr_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",
      approve: true
    }
  ],
  tools: [
    {
      type: :mcp,
      server_label: "openai_docs",
      server_url: "https://developers.openai.com/mcp",
      server_description: "Search and read the public OpenAI documentation.",
      require_approval: :always
    }
  ]
)

puts(response.output_text)
```


这里我们使用 `previous_response_id` 参数将此新 Response 与生成审批请求的上一个 Response 进行链接。但你也可以传回 [将一个响应的输出作为另一个响应的输入](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) ，从而最大程度地控制进入模型上下文的内容。

当你认为可以信任某个远程 MCP 服务器时，可以选择跳过审批以降低延迟。为此，你可以将该 MCP 工具的 `require_approval` 参数设置为一个对象，其中仅列出你希望跳过审批的工具（如下所示），或者将其设置为 `'never'` 值，以跳过该远程 MCP 服务器中所有工具的审批。

不为某些工具要求审批

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
  input: "What transport protocols does the 2025-03-26 version of the MCP spec support?",
  tools: [
    {
      type: :mcp,
      server_label: "deepwiki",
      server_url: "https://mcp.deepwiki.com/mcp",
      require_approval: {
        never: { tool_names: ["ask_question", "read_wiki_structure"] }
      }
    }
  ]
)

puts(response.output_text)
```


## 身份验证

该 [OpenAI Docs MCP 服务器](https://developers.openai.com/resources/docs-mcp) 不需要身份验证。其他 MCP 服务器可能需要身份验证。最常见的方案是 OAuth 访问令牌。使用 MCP 工具的 `authorization` 字段提供此令牌：

使用 Stripe MCP 工具

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
  input: "Create a payment link for $20.",
  tools: [
    {
      type: :mcp,
      server_label: "stripe",
      server_url: "https://mcp.stripe.com",
      authorization: ENV.fetch("STRIPE_OAUTH_ACCESS_TOKEN")
    }
  ]
)

puts(response.output_text)
```


为防止敏感令牌泄漏，Responses API 不会存储你在 `authorization` 字段中提供的值。该值也不会显示在创建的 Response 对象中。因此，你必须在每次发起 Responses API 创建请求时都发送该值。 `authorization` 字段中提供的值。该值也不会显示在创建的 Response 对象中。因此，你必须在每次发起 响应接口 创建请求时都发送该值。

<a id="connectors"></a>

## Legacy connectors

`connector_id` 已针对 2026 年 9 月 1 日之后发布的模型弃用，
  2026。请使用 `server_url` 以连接到远程 MCP 服务器，或 
  `tunnel_id` 以通过以下方式连接到本地 MCP 服务器： 
  [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)。现有
  模型保留连接器支持。本节中的示例使用
  `gpt-5.2`，其早于该截止日期。

Responses API 内置支持一组有限的第三方服务连接器。这些连接器可让你从热门应用（如 Dropbox 和 Gmail）拉取上下文，使模型能够与这些热门服务进行交互。

连接器的使用方式与远程 MCP 服务器相同。两者都允许 OpenAI 模型在 API 请求中访问其他第三方工具。但是，调用远程 MCP 服务器时需要传入 `server_url` ，而连接器则需要传入 `connector_id` ，用于唯一标识 API 中可用的某个连接器。

连接器需要由你的应用程序在 `authorization` 参数。

将旧版连接器与 GPT-5.2 配合使用

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-5.2",
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
  model: "gpt-5.2",
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
    model="gpt-5.2",
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
		Model: "gpt-5.2",
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
        .model("gpt-5.2")
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

CreateResponseOptions options = new() { Model = "gpt-5.2" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "Dropbox",
        connectorId: McpToolConnectorId.Dropbox,
        authorizationToken: dropboxToken,
        toolCallApprovalPolicy: DefaultMcpToolCallApprovalPolicy.NeverRequireApproval
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
  model: "gpt-5.2",
  input: "Summarize the Q2 earnings report.",
  tools: [
    {
      type: :mcp,
      server_label: "Dropbox",
      connector_id: "connector_dropbox",
      authorization: "<oauth access token>",
      require_approval: :never
    }
  ]
)

puts(response.output_text)
```


### Available connectors

- Dropbox: `connector_dropbox`
- Gmail: `connector_gmail`
- Google Calendar: `connector_googlecalendar`
- Google Drive: `connector_googledrive`
- Microsoft Teams: `connector_microsoftteams`
- Outlook Calendar: `connector_outlookcalendar`
- Outlook Email: `connector_outlookemail`
- SharePoint: `connector_sharepoint`

我们优先考虑那些没有官方远程 MCP 服务器的服务。例如，GitHub 有一个官方 MCP 服务器，你可以通过将其传入 `https://api.githubcopilot.com/mcp/` 字段来连接， `server_url` 字段位于 MCP 工具中。

### 授权连接器

在 `authorization` 字段中传入 OAuth 访问令牌。OAuth 客户端注册和授权必须由你的应用单独处理。

出于测试目的，你可以使用 Google 的 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) 以生成临时访问令牌，你可以在 API 请求中使用它们。

若要使用 playground 测试连接器的 API 功能，请先输入：

```
https://www.googleapis.com/auth/calendar.events
```

此授权范围将允许该 API 读取 Google 日历事件。在界面中的 “Step 1: Select and authorize APIs” 下进行操作。

使用你的 Google 账户授权应用后，你将进入 **第 2 步：将授权码交换为令牌**。这会生成一个访问令牌，你可以在使用 Google 日历连接器的 API 请求中使用它：

使用 Google 日历连接器

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
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
  model: "gpt-5.2",
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
    model="gpt-5.2",
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
		Model: "gpt-5.2",
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
        .model("gpt-5.2")
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

CreateResponseOptions options = new() { Model = "gpt-5.2" };
options.Tools.Add(
    ResponseTool.CreateMcpTool(
        serverLabel: "google_calendar",
        connectorId: McpToolConnectorId.GoogleCalendar,
        authorizationToken: authToken,
        toolCallApprovalPolicy: DefaultMcpToolCallApprovalPolicy.NeverRequireApproval
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
  model: "gpt-5.2",
  input: "What's on my Google Calendar for today?",
  tools: [
    {
      type: :mcp,
      server_label: "google_calendar",
      connector_id: "connector_googlecalendar",
      authorization: "<oauth access token>",
      require_approval: :never
    }
  ]
)

puts(response.output_text)
```


来自连接器的 MCP 工具调用与来自远程 MCP 服务器的 MCP 工具调用看起来相同，使用的是 `mcp_call` 输出项类型。在这种情况下，发送给连接器的参数和来自连接器的响应都是 JSON 字符串：

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

### 每个连接器中可用的工具

可用的工具取决于你的 OAuth 令牌所拥有的作用域。展开下面的表格，查看连接到每个应用程序时可以使用的工具。



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




## 在 MCP 服务器中延迟加载工具

如果你正在使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，你可以延迟加载 MCP 服务器暴露的函数，直到模型决定需要它们时再加载。为此，请在 MCP 服务器工具定义上设置 `defer_loading: true` 。

当你延迟加载 MCP 服务器时，模型仍然可以使用该 MCP 服务器的标签和描述来决定何时搜索它，但各个函数定义仅在需要时才会被加载。这有助于降低整体 token 使用量，对于暴露大量函数的 MCP 服务器尤为有用。

```json
{
    "type": "mcp",
    "server_label": "openai_docs",
    "server_description": "Search and read the public OpenAI documentation.",
    "server_url": "https://developers.openai.com/mcp",
// highlight-start:subtle
    "defer_loading": true,
// highlight-end
    "require_approval": "never"
}
```


## 风险与安全

MCP 工具允许你将 OpenAI 模型连接到外部服务。这是一个强大的功能，但同时也带来了一些风险。

对于连接器，存在可能会将敏感数据发送给 OpenAI 的风险，或者允许模型对这些服务中可能敏感的数据进行读取访问的风险。

远程 MCP 服务器也存在同样的风险，但尚未经过 OpenAI 验证。这些服务器可以允许模型在这些服务中访问、发送和接收数据，并执行操作。所有 MCP 服务器均为第三方服务，需遵守其各自的条款和条件。

如果你发现恶意的 MCP 服务器，请向以下地址举报： `security@openai.com`.

以下是在集成连接器和远程 MCP 服务器时可以考虑的一些最佳实践。

#### Prompt injection

[Prompt injection](https://chatgpt.com/?prompt=what%20is%20prompt%20injection?) 是任何 LLM 应用中重要的安全考量,当你让模型访问可能读取敏感数据或执行操作的 MCP 服务器和连接器时,这一点尤为关键。如果提供给模型的提示中包含用户提供的内容,请谨慎使用这些工具,并采取适当的防护措施。

#### 始终要求对敏感操作进行审批

使用可用的配置项中的 `require_approval` 和 `allowed_tools` 参数，确保任何敏感操作都需要审批流程。

#### MCP 工具调用与输出中的 URL

直接请求来自连接器或远程 MCP 服务的工具调用输出所提供的 URL，或将其嵌入图片 URL，可能是危险的。在将此类 URL 嵌入应用代码或以其他方式使用之前，请确保你信任提供这些 URL 的域和服务。

#### 连接到受信任的服务器

选择由服务提供商自身托管的官方服务器（例如，我们建议你连接到 Stripe 官方托管的 Stripe 服务器，地址为 `mcp.stripe.com`，而不是由第三方托管的 Stripe MCP 服务器）。由于目前官方远程 MCP 服务器数量不多，你可能会倾向于使用由并非实际运营该服务器的组织托管，并通过你的 API 将请求代理到该服务的 MCP 服务器。如果你必须这样做，请在尽职调查时格外谨慎，仔细审查这些“聚合服务”如何使用你的数据。

#### 记录并审查与第三方 MCP 服务器共享的数据。

由于 MCP 服务器自行定义其工具定义，它们可能会请求一些你未必愿意与该 MCP 服务器宿主共享的数据。因此，Responses API 中的 MCP 工具默认要求对每次 MCP 工具调用进行审批。在开发你的应用时，请仔细且充分地审查与这些 MCP 服务器共享的数据类型。一旦你对 MCP 服务器建立了信任，便可以跳过这些审批以降低执行延迟。

我们还建议你记录所有发送给 MCP 服务器的数据。如果你使用的是 Responses API 且 `store=true`，这些数据已会通过 API 记录 30 天，除非你的组织启用了零数据保留（Zero Data Retention）。你也可以考虑在自己的系统内记录这些数据，并定期审查，以确保数据共享符合你的预期。

恶意 MCP 服务器可能包含隐藏指令（提示词注入），意图诱导 OpenAI 模型产生异常行为。尽管 OpenAI 已内置安全防护来帮助检测并拦截此类威胁，仍必须仔细审查输入与输出，并确保仅与受信任的服务器建立连接。

MCP 服务器可能会意外更新工具行为，从而导致意外或恶意的行为。

#### 对零数据保留和数据驻留的影响

MCP 工具与零数据保留和数据驻留兼容，但需要注意的是，MCP 服务器是第三方服务，发送到 MCP 服务器的数据需遵守其数据保留和数据驻留策略。

换句话说，如果你的组织在欧洲使用数据驻留，OpenAI 会将客户内容的推理和存储限制在欧洲境内，直到数据被发送至 MCP 服务器为止。你需要自行负责确保 MCP 服务器也遵守你所要求的任何零数据保留或数据驻留要求。了解更多关于零数据保留和数据驻留的信息 [此处](https://developers.openai.com/api/docs/guides/your-data).

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
**Build**

1000 RPM

**Launch and Grow**

2000 RPM

</td>
<td style={{"maxWidth": "150px"}}>
[Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) 

[ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data)
</td>
</tr>

</tbody>
</table>