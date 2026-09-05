# MCP and Connectors

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

In addition to tools you make available to the model with [function calling](https://developers.openai.com/api/docs/guides/function-calling), you can give models new capabilities using **connectors** and **remote MCP servers**. These tools give the model the ability to connect to and control external services when needed to respond to a user's prompt. These tool calls can either be allowed automatically, or restricted with explicit approval required by you as the developer.

- **Connectors** are OpenAI-maintained MCP wrappers for popular services like Google Workspace or Dropbox, like the connectors available in [ChatGPT](https://chatgpt.com).
- **Remote MCP servers** can be any server on the public Internet that implements a remote [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) server.

This guide will show how to use both remote MCP servers and connectors to give the model access to new capabilities.

## Secure MCP Tunnel

If your MCP server is private, on-premises, or behind a firewall, use [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) to connect it to supported OpenAI products without exposing the server to the public internet. Download the latest public release from [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest).

## Quickstart

Check out the examples below to see how remote MCP servers and connectors work through the [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create). Both connectors and remote MCP servers can be used with the `mcp` built-in tool type.



Using remote MCP servers

    

        Remote MCP servers require a `server_url`. Depending on the server,
        you may also need an OAuth `authorization` parameter containing an
        access token.
    


    Using a remote MCP server in the Responses API

```bash
curl https://api.openai.com/v1/responses \ 
-H "Content-Type: application/json" \ 
-H "Authorization: Bearer $OPENAI_API_KEY" \ 
-d '{
  "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
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

  

  

    
Using connectors

    

        Connectors require a `connector_id` parameter, and an OAuth access
        token provided by your application in the `authorization` parameter.
    


    Using connectors in the Responses API

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
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



The API will return new items in the `output` array of the model response. If the model decides to use a Connector or MCP server, it will first make a request to list available tools from the server, which will create a `mcp_list_tools` output item. From the simple remote MCP server example above, it contains only one tool definition:

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

If the model decides to call one of the available tools from the MCP server, you will also find a `mcp_call` output which will show what the model sent to the MCP tool, and what the MCP tool sent back as output.

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

Read on in the guide below to learn more about how the MCP tool works, how to filter available tools, and how to handle tool call approval requests.

## How it works

The MCP tool (for both remote MCP servers and connectors) is available in the [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) in most recent models. Check MCP tool compatibility for your model [here](https://developers.openai.com/api/docs/models). When you're using the MCP tool, you only pay for [tokens](https://developers.openai.com/api/docs/pricing) used when importing tool definitions or making tool calls. There are no additional fees involved per tool call.

Below, we'll step through the process the API takes when calling an MCP tool.

### Step 1: Listing available tools

When you specify a remote MCP server in the `tools` parameter, the API will attempt to get a list of tools from the server. The Responses API works with remote MCP servers that support either the Streamable HTTP or the HTTP/SSE transport protocols.

If successful in retrieving the list of tools, a new `mcp_list_tools` output item will appear in the model response output. The `tools` property of this object will show the tools that were successfully imported.

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

As long as the `mcp_list_tools` item is present in the context of an API
  request, the API will not fetch a list of tools from the MCP server again at
  each turn in a [conversation](https://developers.openai.com/api/docs/guides/conversation-state). We
  recommend you keep this item in the model's context as part of every
  conversation or workflow execution to optimize for latency.

#### Filtering tools

Some MCP servers can have dozens of tools, and exposing many tools to the model can result in high cost and latency. If you're only interested in a subset of tools an MCP server exposes, you can use the `allowed_tools` parameter to only import those tools.

Constrain allowed tools

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
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


### Step 2: Calling tools

Once the model has access to these tool definitions, it may choose to call them depending on what's in the model's context. When the model decides to call an MCP tool, the API will make an request to the remote MCP server to call the tool and put its output into the model's context. This creates an `mcp_call` item which looks like this:

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

This item includes both the arguments the model decided to use for this tool call, and the `output` that the remote MCP server returned. All models can choose to make multiple MCP tool calls, so you may see several of these items generated in a single API request.

Failed tool calls will populate the error field of this item with MCP protocol errors, MCP tool execution errors, or general connectivity errors. The MCP errors are documented in the MCP spec [here](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#error-handling).

#### Approvals

By default, OpenAI will request your approval before any data is shared with a connector or remote MCP server. Approvals help you maintain control and visibility over what data is being sent to an MCP server. We highly recommend that you carefully review (and optionally log) all data being shared with a remote MCP server. A request for an approval to make an MCP tool call creates a `mcp_approval_request` item in the Response's output that looks like this:

```json
{
  "id": "mcpr_68a619e1d82c8190b50c1ccba7ad18ef0d2d23a86136d339",
  "type": "mcp_approval_request",
  "arguments": "{\"diceRollExpression\":\"2d4 + 1\"}",
  "name": "roll",
  "server_label": "dmcp"
}
```

You can then respond to this by creating a new Response object and appending an `mcp_approval_response` item to it.

Approving the use of tools in an API request

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
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


Here we're using the `previous_response_id` parameter to chain this new Response, with the previous Response that generated the approval request. But you can also pass back the [outputs from one response, as inputs into another](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state) for maximum control over what enter's the model's context.

If and when you feel comfortable trusting a remote MCP server, you can choose to skip the approvals for reduced latency. To do this, you can set the `require_approval` parameter of the MCP tool to an object listing just the tools you'd like to skip approvals for like shown below, or set it to the value `'never'` to skip approvals for all tools in that remote MCP server.

Never require approval for some tools

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
        never: {tool_names: ["ask_question", "read_wiki_structure"]}
      }
    }
  ]
)

puts(response.output_text)
```


## Authentication

Unlike the [example MCP server we used above](https://dash.deno.com/playground/dmcp-server), most other MCP servers require authentication. The most common scheme is an OAuth access token. Provide this token using the `authorization` field of the MCP tool:

Use Stripe MCP tool

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
  tools: [{
    type: :mcp,
    server_label: "stripe",
    server_url: "https://mcp.stripe.com",
    authorization: ENV.fetch("STRIPE_OAUTH_ACCESS_TOKEN")
  }]
)

puts(response.output_text)
```


To prevent the leakage of sensitive tokens, the Responses API does not store the value you provide in the `authorization` field. This value will also not be visible in the Response object created. Because of this, you must send the `authorization` value in every Responses API creation request you make.

## Connectors

The Responses API has built-in support for a limited set of connectors to third-party services. These connectors let you pull in context from popular applications, like Dropbox and Gmail, to allow the model to interact with popular services.

Connectors can be used in the same way as remote MCP servers. Both let an OpenAI model access additional third-party tools in an API request. However, instead of passing a `server_url` as you would to call a remote MCP server, you pass a `connector_id` which uniquely identifies a connector available in the API.

### Available connectors

- Dropbox: `connector_dropbox`
- Gmail: `connector_gmail`
- Google Calendar: `connector_googlecalendar`
- Google Drive: `connector_googledrive`
- Microsoft Teams: `connector_microsoftteams`
- Outlook Calendar: `connector_outlookcalendar`
- Outlook Email: `connector_outlookemail`
- SharePoint: `connector_sharepoint`

We prioritized services that don't have official remote MCP servers. GitHub, for instance, has an official MCP server you can connect to by passing `https://api.githubcopilot.com/mcp/` to the `server_url` field in the MCP tool.

### Authorizing a connector

In the `authorization` field, pass in an OAuth access token. OAuth client registration and authorization must be handled separately by your application.

For testing purposes, you can use Google's [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) to generate temporary access tokens that you can use in an API request.

To use the playground to test the connectors API functionality, start by entering:

```
https://www.googleapis.com/auth/calendar.events
```

This authorization scope will enable the API to read Google Calendar events. In the UI under "Step 1: Select and authorize APIs".

After authorizing the application with your Google account, you will come to "Step 2: Exchange authorization code for tokens". This will generate an access token you can use in an API request using the Google Calendar connector:

Use the Google Calendar connector

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
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
  model: "gpt-6-astra",
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


An MCP tool call from a Connector will look the same as an MCP tool call from a remote MCP server, using the `mcp_call` output item type. In this case, both the arguments to and the response from the Connector are JSON strings:

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

The available tools depend on which scopes your OAuth token has available to it. Expand the tables below to see what tools you can use when connecting to each application.



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




## Defer loading tools in an MCP server

If you are using [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search), you can defer loading the functions exposed by an MCP server until the model decides it needs them. To do this, set `defer_loading: true` on the MCP server tool definition.

When you defer loading an MCP server, the model can still use the MCP server's label and description to decide when to search it, but the individual function definitions are loaded only when needed. This can help reduce overall token usage, and it is most useful for MCP servers that expose large numbers of functions.

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


## Risks and safety

The MCP tool permits you to connect OpenAI models to external services. This is a powerful feature that comes with some risks.

For connectors, there is a risk of potentially sending sensitive data to OpenAI, or allowing models read access to potentially sensitive data in those services.

Remote MCP servers carry those same risks, but also have not been verified by OpenAI. These servers can allow models to access, send, and receive data, and take action in these services. All MCP servers are third-party services that are subject to their own terms and conditions.

If you come across a malicious MCP server, please report it to `security@openai.com`.

Below are some best practices to consider when integrating connectors and remote MCP servers.

#### Prompt injection

[Prompt injection](https://chatgpt.com/?prompt=what%20is%20prompt%20injection?) is an important security consideration in any LLM application, and is especially true when you give the model access to MCP servers and connectors which can access sensitive data or take action. Use these tools with appropriate caution and mitigations if the prompt for the model contains user-provided content.

#### Always require approval for sensitive actions

Use the available configurations of the `require_approval` and `allowed_tools` parameters to ensure that any sensitive actions require an approval flow.

#### URLs within MCP tool calls and outputs

It can be dangerous to request URLs or embed image URLs provided by tool call outputs either from connectors or remote MCP servers. Ensure that you trust the domains and services providing those URLs before embedding or otherwise using them in your application code.

#### Connecting to trusted servers

Pick official servers hosted by the service providers themselves (e.g. we recommend connecting to the Stripe server hosted by Stripe themselves on mcp.stripe.com, instead of a Stripe MCP server hosted by a third party). Because there aren't too many official remote MCP servers today, you may be tempted to use a MCP server hosted by an organization that doesn't operate that server and simply proxies request to that service via your API. If you must do this, be extra careful in doing your due diligence on these "aggregators", and carefully review how they use your data.

#### Log and review data being shared with third party MCP servers.

Because MCP servers define their own tool definitions, they may request for data that you may not always be comfortable sharing with the host of that MCP server. Because of this, the MCP tool in the Responses API defaults to requiring approvals of each MCP tool call being made. When developing your application, review the type of data being shared with these MCP servers carefully and robustly. Once you gain confidence in your trust of this MCP server, you can skip these approvals for more performant execution.

We also recommend logging any data sent to MCP servers. If you're using the Responses API with `store=true`, these data are already logged via the API for 30 days unless Zero Data Retention is enabled for your organization. You may also want to log these data in your own systems and perform periodic reviews on this to ensure data is being shared per your expectations.

Malicious MCP servers may include hidden instructions (prompt injections) designed to make OpenAI models behave unexpectedly. While OpenAI has implemented built-in safeguards to help detect and block these threats, it's essential to carefully review inputs and outputs, and ensure connections are established only with trusted servers.

MCP servers may update tool behavior unexpectedly, potentially leading to unintended or malicious behavior.

#### Implications on Zero Data Retention and Data Residency

The MCP tool is compatible with Zero Data Retention and Data Residency, but it's important to note that MCP servers are third-party services, and data sent to an MCP server is subject to their data retention and data residency policies.

In other words, if you're an organization with Data Residency in Europe, OpenAI will limit inference and storage of Customer Content to take place in Europe up until the point communication or data is sent to the MCP server. It is your responsibility to ensure that the MCP server also adheres to any Zero Data Retention or Data Residency requirements you may have. Learn more about Zero Data Retention and Data Residency [here](https://developers.openai.com/api/docs/guides/your-data).

## Usage notes

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