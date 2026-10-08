# Realtime with tools

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。如需文档页面的 Markdown 版本，可在页面 URL 末尾附加 `.md` 。

你可以在 Realtime 会话中挂载工具，以便模型在实时对话中查询数据、执行操作或调用服务。无论你的客户端使用的是 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 还是 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime).

当你的应用需要自行执行工具并返回结果时，使用函数工具。当希望 Realtime API 为你连接到远程工具服务器时，使用 MCP 工具。

## 选择工具类型

| 工具类型                 | 使用场景                                                                             | 执行方                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `function`                | 你的应用负责业务逻辑、审批检查或私有系统访问。 | 你的客户端或服务端接收函数调用并返回 `function_call_output`. |
| `mcp` with `server_url`   | 你希望模型调用远程 MCP 服务器所提供的工具。                     | Realtime API 调用远程 MCP 服务器。                                      |
| `mcp` with `connector_id` | 你在现有模型上使用旧版内置连接器。                          | Realtime API 使用你提供的授权调用该连接器。           |

添加工具 **两处之一**:

- 在 **会话级别** 使用 `session.tools` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)，如果你希望该工具在整个会话中可用。
- 在 **响应级别** 使用 `response.tools` 在 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)，如果你只需要该工具在单轮中使用。

## 配置函数工具

当工具应在你的应用中运行时，函数工具是合适的默认选择。模型会发出函数调用参数，你的代码执行该操作，然后通过 `function_call_output` 将结果发送回去。

通过 session.update 配置函数工具

```javascript
const event = {
  type: "session.update",
  session: {
    type: "realtime",
    model: "gpt-realtime-2.1",
    tools: [
      {
        type: "function",
        name: "lookup_order",
        description: "Look up an order by its order number.",
        parameters: {
          type: "object",
          properties: {
            order_number: {
              type: "string",
              description: "The customer-facing order number.",
            },
          },
          required: ["order_number"],
        },
      },
    ],
    tool_choice: "auto",
  },
};

ws.send(JSON.stringify(event));
```

```python
event = {
    "type": "session.update",
    "session": {
        "type": "realtime",
        "model": "gpt-realtime-2.1",
        "tools": [
            {
                "type": "function",
                "name": "lookup_order",
                "description": "Look up an order by its order number.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "order_number": {
                            "type": "string",
                            "description": "The customer-facing order number.",
                        }
                    },
                    "required": ["order_number"],
                },
            }
        ],
        "tool_choice": "auto",
    },
}

ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.core.JsonValue;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import java.util.List;
import java.util.Map;

connection.send(
    RealtimeClientEvent.ofSessionUpdate(
        SessionUpdateEvent.builder()
            .session(
                RealtimeSessionCreateRequest.builder()
                    .model("gpt-realtime-2.1")
                    .addTool(
                        RealtimeFunctionTool.builder()
                            .type(RealtimeFunctionTool.Type.FUNCTION)
                            .name("lookup_order")
                            .description("Look up an order by its order number.")
                            .parameters(
                                JsonValue.from(
                                    Map.of(
                                        "type",
                                        "object",
                                        "properties",
                                        Map.of(
                                            "order_number",
                                            Map.of(
                                                "type",
                                                "string",
                                                "description",
                                                "The customer-facing order number.")),
                                        "required",
                                        List.of("order_number"))))
                            .build())
                    .toolChoice(com.openai.models.responses.ToolChoiceOptions.AUTO)
                    .build())
            .build()));
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

await session.SendCommandAsync(new RealtimeClientCommandSessionUpdate(new RealtimeConversationSessionOptions
{
    Model = "gpt-realtime-2.1",
    Tools =
    {
        new RealtimeFunctionTool("lookup_order")
        {
            FunctionDescription = "Look up an order by its order number.",
            FunctionParameters = BinaryData.FromObjectAsJson(new { type = "object", properties = new { order_number = new { type = "string", description = "The customer-facing order number." } }, required = (string[])["order_number"] })
        }
    },
    ToolChoice = RealtimeDefaultToolChoice.Auto
}), timeout.Token);
```

```ruby
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  tools: [
    {
      type: :function,
      name: "lookup_order",
      description: "Look up an order by its order number.",
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The customer-facing order number."
          }
        },
        required: ["order_number"]
      }
    }
  ],
  tool_choice: :auto
)
```


当模型调用该函数时，监听函数调用 item、运行你的应用逻辑，然后将输出发送回去：

发送函数调用输出

```javascript
const event = {
  type: "conversation.item.create",
  item: {
    type: "function_call_output",
    call_id: functionCall.call_id,
    output: JSON.stringify({
      status: "shipped",
      delivery_date: "2026-05-09",
    }),
  },
};

ws.send(JSON.stringify(event));
ws.send(JSON.stringify({ type: "response.create" }));
```

```python
event = {
    "type": "conversation.item.create",
    "item": {
        "type": "function_call_output",
        "call_id": function_call["call_id"],
        "output": json.dumps(
            {
                "status": "shipped",
                "delivery_date": "2026-05-09",
            }
        ),
    },
}

ws.send(json.dumps(event))
ws.send(json.dumps({"type": "response.create"}))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.core.JsonValue;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import com.openai.models.responses.ToolChoiceFunction;
import com.openai.models.responses.ToolChoiceOptions;
import java.util.Map;

static void sendFunctionCallOutput(RealtimeConnection connection, String callId)
    throws Exception {
  send(
      connection,
      RealtimeClientEvent.ofConversationItemCreate(
          ConversationItemCreateEvent.builder()
              .item(
                  RealtimeConversationItemFunctionCallOutput.builder()
                      .callId(callId)
                      .output("{\"status\":\"shipped\",\"delivery_date\":\"2026-05-09\"}")
                      .build())
              .build()));
  send(
      connection,
      RealtimeClientEvent.ofResponseCreate(
          ResponseCreateEvent.builder()
              .response(
                  RealtimeResponseCreateParams.builder()
                      .metadata(
                          RealtimeResponseCreateParams.Metadata.builder()
                              .putAdditionalProperty(
                                  "topic", JsonValue.from("lookup_order_followup"))
                              .build())
                      .toolChoice(ToolChoiceOptions.NONE)
                      .build())
              .build()));
}

// Retry only explicit admission rejections; these guarantee nothing was sent.
private static void send(RealtimeConnection connection, RealtimeClientEvent event)
    throws Exception {
  long deadline = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(5);
  while (true) {
    try {
      connection.send(event);
      return;
    } catch (com.openai.core.http.WebSocketWriteNotAttempted.Busy busy) {
      if (System.nanoTime() >= deadline) throw busy;
      Thread.sleep(10);
    }
  }
}
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

internal static async Task SendFunctionCallOutputAsync(RealtimeSessionClient session, string callId, CancellationToken cancellationToken)
{
    string output = System.Text.Json.JsonSerializer.Serialize(new { status = "shipped", delivery_date = "2026-05-09" });
    await session.SendCommandAsync(new RealtimeClientCommandConversationItemCreate(new RealtimeFunctionCallOutputItem(callId, output)), cancellationToken);
    await session.SendCommandAsync(new RealtimeClientCommandResponseCreate
    {
        ResponseOptions = new()
        {
            Metadata = new Dictionary<string, BinaryData> { ["topic"] = BinaryData.FromObjectAsJson("lookup_order_followup") },
            ToolChoice = RealtimeDefaultToolChoice.None
        }
    }, cancellationToken);
}
```

```ruby
connection.conversation.items.create(
  type: :function_call_output,
  call_id: call_id,
  output: JSON.generate(status: "shipped", delivery_date: "2026-05-09")
)
connection.response.create(tool_choice: :none)
```


如需按事件逐个讲解函数调用的完整流程，请参阅 [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling).

## 配置 MCP 工具

当工具已部署在远程 MCP 服务器后端，或现有模型使用旧版内置连接器时，MCP 工具非常有用。与函数工具不同，MCP 工具由 Realtime API 自身执行。

在 Realtime 中，MCP 工具的格式为：

- `type: "mcp"`
- `server_label`
- One of `server_url` 或 `connector_id`
- 可选 `authorization` 和 `headers`
- 可选 `allowed_tools`
- 可选 `require_approval`
- 可选 `server_description`

此示例在整个会话期间提供一个 docs MCP 服务器：

使用 session.update 配置 MCP 工具

```javascript
const event = {
  type: "session.update",
  session: {
    type: "realtime",
    model: "gpt-realtime-2.1",
    output_modalities: ["text"],
    tools: [
      {
        type: "mcp",
        server_label: "openai_docs",
        server_url: "https://developers.openai.com/mcp",
        allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
        require_approval: "never",
      },
    ],
  },
};

ws.send(JSON.stringify(event));
```

```python
event = {
    "type": "session.update",
    "session": {
        "type": "realtime",
        "model": "gpt-realtime-2.1",
        "output_modalities": ["text"],
        "tools": [
            {
                "type": "mcp",
                "server_label": "openai_docs",
                "server_url": "https://developers.openai.com/mcp",
                "allowed_tools": ["search_openai_docs", "fetch_openai_doc"],
                "require_approval": "never",
            }
        ],
    },
}

ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import java.util.List;

connection.send(
    RealtimeClientEvent.ofSessionUpdate(
        SessionUpdateEvent.builder()
            .session(
                RealtimeSessionCreateRequest.builder()
                    .model("gpt-realtime-2.1")
                    .addOutputModality(RealtimeSessionCreateRequest.OutputModality.TEXT)
                    .addTool(
                        RealtimeToolsConfigUnion.Mcp.builder()
                            .serverLabel("openai_docs")
                            .serverUrl("https://developers.openai.com/mcp")
                            .allowedToolsOfMcp(
                                List.of("search_openai_docs", "fetch_openai_doc"))
                            .requireApproval(
                                RealtimeToolsConfigUnion.Mcp.RequireApproval
                                    .McpToolApprovalSetting.NEVER)
                            .build())
                    .build())
            .build()));
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

await session.SendCommandAsync(new RealtimeClientCommandSessionUpdate(new RealtimeConversationSessionOptions
{
    Model = "gpt-realtime-2.1",
    OutputModalities =
    {
        RealtimeOutputModality.Text
    },
    Tools =
    {
        new RealtimeMcpTool("openai_docs", new Uri("https://developers.openai.com/mcp"))
        {
            AllowedTools = new()
            {
                ToolNames =
                {
                    "search_openai_docs",
                    "fetch_openai_doc"
                }
            },
            ToolCallApprovalPolicy = RealtimeDefaultMcpToolCallApprovalPolicy.NeverRequireApproval
        }
    }
}), timeout.Token);
```

```ruby
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  output_modalities: [:text],
  tools: [
    {
      type: :mcp,
      server_label: "openai_docs",
      server_url: "https://developers.openai.com/mcp",
      allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
      require_approval: :never
    }
  ]
)
```


### 旧版连接器

`connector_id` 已对 2026 年 9 月 1 日之后发布的模型弃用，
  2026。请使用 `server_url` 连接到远程 MCP 服务器，或使用 
  `tunnel_id` 通过 
  [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)。连接到本地 MCP 服务器。现有
  模型仍保留连接器支持。下面的示例使用
  `gpt-realtime-1.5`，该模型早于该截止日期。

内置连接器使用相同的 MCP 工具形式，但传入 `connector_id`
而不是 `server_url`。例如，Google Calendar 使用
`connector_googlecalendar`。在 Realtime 中,将这些内置连接器用于读取
操作（例如搜索或读取事件或邮件）。将用户的 OAuth
访问令牌传入 `authorization`，并尽可能使用
`allowed_tools` 缩小工具范围：

配置 Google Calendar 连接器

```javascript
const event = {
  type: "session.update",
  session: {
    type: "realtime",
    model: "gpt-realtime-1.5",
    output_modalities: ["text"],
    tools: [
      {
        type: "mcp",
        server_label: "google_calendar",
        connector_id: "connector_googlecalendar",
        authorization: "<google-oauth-access-token>",
        allowed_tools: ["search_events", "read_event"],
        require_approval: "never",
      },
    ],
  },
};

ws.send(JSON.stringify(event));
```

```python
import os

connector_authorization = os.environ["OPENAI_CONNECTOR_AUTHORIZATION"]

event = {
    "type": "session.update",
    "session": {
        "type": "realtime",
        "model": "gpt-realtime-1.5",
        "output_modalities": ["text"],
        "tools": [
            {
                "type": "mcp",
                "server_label": "google_calendar",
                "connector_id": "connector_googlecalendar",
                "authorization": connector_authorization,
                "allowed_tools": ["search_events", "read_event"],
                "require_approval": "never",
            }
        ],
    },
}

ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import java.util.List;

connection.send(
    RealtimeClientEvent.ofSessionUpdate(
        SessionUpdateEvent.builder()
            .session(
                RealtimeSessionCreateRequest.builder()
                    .model("gpt-realtime-1.5")
                    .addOutputModality(RealtimeSessionCreateRequest.OutputModality.TEXT)
                    .addTool(
                        RealtimeToolsConfigUnion.Mcp.builder()
                            .serverLabel("google_calendar")
                            .connectorId(
                                RealtimeToolsConfigUnion.Mcp.ConnectorId
                                    .CONNECTOR_GOOGLECALENDAR)
                            .authorization(System.getenv("OPENAI_CONNECTOR_AUTHORIZATION"))
                            .allowedToolsOfMcp(List.of("search_events", "read_event"))
                            .requireApproval(
                                RealtimeToolsConfigUnion.Mcp.RequireApproval
                                    .McpToolApprovalSetting.NEVER)
                            .build())
                    .build())
            .build()));
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

await session.SendCommandAsync(new RealtimeClientCommandSessionUpdate(new RealtimeConversationSessionOptions
{
    Model = "gpt-realtime-1.5",
    OutputModalities =
    {
        RealtimeOutputModality.Text
    },
    Tools =
    {
        new RealtimeMcpTool("google_calendar", RealtimeMcpToolConnectorId.GoogleCalendar)
        {
            AuthorizationToken = Environment.GetEnvironmentVariable("OPENAI_CONNECTOR_AUTHORIZATION")!,
            AllowedTools = new()
            {
                ToolNames =
                {
                    "search_events",
                    "read_event"
                }
            },
            ToolCallApprovalPolicy = RealtimeDefaultMcpToolCallApprovalPolicy.NeverRequireApproval
        }
    }
}), timeout.Token);
```

```ruby
access_token = ENV.fetch("OPENAI_MCP_ACCESS_TOKEN")

connection.session.update(
  type: :realtime,
  model: "gpt-realtime-1.5",
  output_modalities: [:text],
  tools: [
    {
      type: :mcp,
      server_label: "google_calendar",
      connector_id: "connector_googlecalendar",
      authorization: access_token,
      allowed_tools: ["search_events", "read_event"],
      require_approval: :never
    }
  ]
)
```


远程 MCP 服务器 
  **不会自动接收完整的对话上下文，**,
  但 **它们可以看到模型在工具调用中发送的任何数据**.
  **保持工具接口精简** 并对 `allowed_tools`,
  任何你不会自动执行的操作要求审批。

## Realtime MCP flow

与 Realtime `function` 工具不同，远程 MCP 工具由 **Realtime API 本身执行**. **。你的客户端并不直接运行远程工具** 并返回 `function_call_output`。结果。相反，你的客户端负责配置访问权限、监听 MCP 生命周期事件，并在服务器请求批准时按需发送批准响应。

典型的流程如下：

1. 你发送 `session.update` 或 `response.create` 包含一个 `tools` 条目，该条目的 `type` 为 `mcp`.
1. 服务端开始导入工具并发送 `mcp_list_tools.in_progress`.
1. 在列表仍在进行时，模型无法调用尚未加载完成的工具。如果你希望在开始依赖这些工具的轮次之前等待加载，请监听 [`mcp_list_tools.completed`](https://developers.openai.com/api/reference/resources/realtime)。该 [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件的 `item.type` 为 `mcp_list_tools` 显示了实际导入的工具名称。如果导入失败，你将收到 [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. 用户说话或发送文本，随后会创建一个响应，该响应可以由你的客户端创建，也可以由会话配置自动创建。
1. 如果模型选择了 MCP 工具，你将看到 `response.mcp_call_arguments.delta` 和 `response.mcp_call_arguments.done`.
1. **如果需要审批**，服务端会添加一个会话项，其 `item.type` 为 `mcp_approval_request`。你的客户端必须使用一个 `mcp_approval_response` 项来回复。
1. 工具运行后，你将看到 `response.mcp_call.in_progress`。成功时，你稍后会收到一个 [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件的 `item.type` 为 `mcp_call`；失败时，你会收到 [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. `response.done` ，因为某个 response 的事件可能在其 MCP 调用完成之前到达。response 完成且其所有 MCP 调用都已结束后，发送另一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，让模型使用这些结果并继续会话。如果模型发起额外的 MCP 调用，请重复此步骤。Realtime API 不会自动创建这些后续 response。

该事件处理函数记录主要的 MCP 生命周期事件，但不会管理后续响应：

在 Realtime 会话期间监听 MCP 事件

```javascript
function parseRealtimeEvent(rawMessage) {
  if (typeof rawMessage === "string") {
    return JSON.parse(rawMessage);
  }

  if (typeof rawMessage?.data === "string") {
    return JSON.parse(rawMessage.data);
  }

  return JSON.parse(rawMessage.toString());
}

function getOutputText(item) {
  if (item.type !== "message") return "";

  return (item.content ?? [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("");
}

ws.on("message", (rawMessage) => {
  const event = parseRealtimeEvent(rawMessage);

  switch (event.type) {
    case "mcp_list_tools.in_progress":
      console.log("Listing MCP tools for item:", event.item_id);
      break;

    case "mcp_list_tools.completed":
      console.log("MCP tool listing complete for item:", event.item_id);
      break;

    case "mcp_list_tools.failed":
      console.error("MCP tool listing failed for item:", event.item_id);
      break;

    case "conversation.item.done":
      if (event.item.type === "mcp_list_tools") {
        const names = event.item.tools.map((tool) => tool.name).join(", ");
        console.log(`MCP tools ready on ${event.item.server_label}: ${names}`);
      }

      if (event.item.type === "mcp_approval_request") {
        console.log(
          "Approval required for:",
          event.item.name,
          event.item.arguments
        );
      }
      break;

    case "response.mcp_call_arguments.done":
      console.log("Final MCP call arguments:", event.arguments);
      break;

    case "response.mcp_call.in_progress":
      console.log("Running MCP tool for item:", event.item_id);
      break;

    case "response.mcp_call.failed":
      console.error("MCP tool call failed for item:", event.item_id);
      break;

    case "response.output_item.done":
      if (event.item.type === "mcp_call") {
        console.log(
          `MCP output from ${event.item.server_label}.${event.item.name}:`,
          event.item.output
        );
      }

      if (event.item.type === "message") {
        console.log("Assistant:", getOutputText(event.item));
      }
      break;

    case "response.done":
      console.log("Realtime turn complete.");
      break;
  }
});
```

```python
def on_message(ws, message):
    event = json.loads(message)
    event_type = event["type"]

    if event_type == "mcp_list_tools.in_progress":
        print("Listing MCP tools for item:", event["item_id"])
        return

    if event_type == "mcp_list_tools.completed":
        print("MCP tool listing complete for item:", event["item_id"])
        return

    if event_type == "mcp_list_tools.failed":
        print("MCP tool listing failed for item:", event["item_id"])
        return

    if event_type == "conversation.item.done":
        item = event["item"]

        if item["type"] == "mcp_list_tools":
            names = ", ".join(tool["name"] for tool in item["tools"])
            print(f"MCP tools ready on {item['server_label']}: {names}")
            return

        if item["type"] == "mcp_approval_request":
            print("Approval required for:", item["name"], item["arguments"])
            return

    if event_type == "response.mcp_call_arguments.done":
        print("Final MCP call arguments:", event["arguments"])
        return

    if event_type == "response.mcp_call.in_progress":
        print("Running MCP tool for item:", event["item_id"])
        return

    if event_type == "response.mcp_call.failed":
        print("MCP tool call failed for item:", event["item_id"])
        return

    if event_type == "response.output_item.done":
        item = event["item"]

        if item["type"] == "mcp_call":
            print(
                f"MCP output from {item['server_label']}.{item['name']}:",
                item.get("output"),
            )
            return

        if item["type"] == "message":
            text_parts = [
                part["text"]
                for part in item.get("content", [])
                if part["type"] == "output_text"
            ]
            print("Assistant:", "".join(text_parts))
            return

    if event_type == "response.done":
        print("Realtime turn complete.")
```

```ruby
connection.each do |event|
  case event
  when OpenAI::Realtime::McpListToolsInProgress
    puts("Listing MCP tools for item: #{event.item_id}")
  when OpenAI::Realtime::McpListToolsFailed
    warn("MCP tool listing failed for item: #{event.item_id}")
    break
  when OpenAI::Realtime::McpListToolsCompleted
    puts("MCP tools ready for item: #{event.item_id}")
    connection.response.create(
      output_modalities: [:text],
      input: [
        {
          type: :message,
          role: :user,
          content: [
            {
              type: :input_text,
              text: "Which Realtime API transport should browser clients use?"
            }
          ]
        }
      ],
      tool_choice: :required
    )
  when OpenAI::Realtime::ConversationItemDone
    item = event.item
    case item
    when OpenAI::Realtime::RealtimeMcpListTools
      names = item.tools.map(&:name).join(", ")
      puts("MCP tools ready on #{item.server_label}: #{names}")
    when OpenAI::Realtime::RealtimeMcpApprovalRequest
      puts("Approval required for: #{item.name} #{item.arguments}")
    end
  when OpenAI::Realtime::ResponseMcpCallArgumentsDone
    puts("Final MCP call arguments: #{event.arguments}")
  when OpenAI::Realtime::ResponseMcpCallInProgress
    puts("Running MCP tool for item: #{event.item_id}")
  when OpenAI::Realtime::ResponseMcpCallCompleted
    puts("MCP tool call completed: #{event.item_id}")
  when OpenAI::Realtime::ResponseMcpCallFailed
    warn("MCP tool call failed: #{event.item_id}")
    break
  when OpenAI::Realtime::ResponseOutputItemDoneEvent
    item = event.item
    case item
    when OpenAI::Realtime::RealtimeMcpToolCall
      puts("MCP output from #{item.server_label}.#{item.name}: #{item.output}")
    when OpenAI::Realtime::RealtimeConversationItemAssistantMessage
      text = item.content.filter_map do |content|
        content.text if content.type == :output_text
      end.join
      puts("Assistant: #{text}")
    end
  when OpenAI::Realtime::RealtimeErrorEvent
    warn("Realtime API error: #{event.error.message}")
    break
  when OpenAI::Realtime::ResponseDoneEvent
    puts("Realtime turn complete.")
    break
  end
end
```


## 常见失败

- [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime): Realtime API 无法从远程服务器或连接器导入工具。请检查 `server_url` 或 `connector_id`、身份认证、服务器连通性以及任何 `allowed_tools` 名称是否正确。
- [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime): 模型选择了某个工具，但该工具调用未完成。请检查事件负载和后续的 `mcp_call` 项中是否存在 MCP 协议、执行或传输错误。
- `mcp_approval_request` 没有匹配的 `mcp_approval_response`: 工具调用无法继续，直到你的客户端显式批准或拒绝它。
- 当一个回合开始时， `mcp_list_tools.in_progress` 仍处于活动状态：该回合中只有已经完成加载的工具才有资格被调用。
- 某个响应使用了 `tool_choice: "required"` 但当前没有可用工具：模型没有可调用的对象。请等待 `mcp_list_tools.completed`，确认至少导入了一个工具，或对不需要工具的回合使用其他 `tool_choice` 。
- MCP 工具定义在导入开始前校验失败：常见原因包括同一 `server_label` 中存在重复的 `tools` 数组，同时设置了 `server_url` 和 `connector_id`，在初始会话创建请求中同时省略两者，使用了无效的 `connector_id`，或同时发送了 `authorization` 和 `headers.Authorization`。对于连接器，请勿发送 `headers.Authorization` 。

## 批准或拒绝 MCP 工具调用

如果某个工具需要审批，Realtime API 会在对话中插入一个 `mcp_approval_request` 条目。 **要继续执行**，请发送一个新的 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_approval_response`.

Approve an MCP request

```javascript
function approveMcpRequest(approvalRequestId) {
  const event = {
    type: "conversation.item.create",
    item: {
      id: `mcp_approval_${approvalRequestId}`,
      type: "mcp_approval_response",
      approval_request_id: approvalRequestId,
      approve: true,
    },
  };

  ws.send(JSON.stringify(event));
}
```

```python
# Use the ID from the received MCP approval-request item.
def approve_mcp_request(ws, approval_request_id):
    event = {
        "type": "conversation.item.create",
        "item": {
            "id": f"mcp_approval_{approval_request_id}",
            "type": "mcp_approval_response",
            "approval_request_id": approval_request_id,
            "approve": True,
        },
    }

    ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import com.openai.models.responses.ToolChoiceOptions;

// Replace https://mcp.example.com/mcp with your company's MCP server URL.

static void approveMcpRequest(RealtimeConnection connection, String approvalRequestId)
    throws Exception {
  send(
      connection,
      RealtimeClientEvent.ofConversationItemCreate(
          ConversationItemCreateEvent.builder()
              .item(
                  RealtimeMcpApprovalResponse.builder()
                      .id("mcp_approval_" + approvalRequestId)
                      .approvalRequestId(approvalRequestId)
                      .approve(true)
                      .build())
              .build()));
}

// Retry only explicit admission rejections; these guarantee nothing was sent.
private static void send(RealtimeConnection connection, RealtimeClientEvent event)
    throws Exception {
  long deadline = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(5);
  while (true) {
    try {
      connection.send(event);
      return;
    } catch (com.openai.core.http.WebSocketWriteNotAttempted.Busy busy) {
      if (System.nanoTime() >= deadline) throw busy;
      Thread.sleep(10);
    }
  }
}
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002
// Replace https://mcp.example.com/mcp with your company's MCP server URL.

internal static async Task ApproveMcpRequestAsync(RealtimeSessionClient session, string approvalRequestId, CancellationToken cancellationToken)
{
    await session.SendCommandAsync(new RealtimeClientCommandConversationItemCreate(new RealtimeMcpToolCallApprovalResponseItem(approvalRequestId, true)
    {
        Id = $"mcp_approval_{approvalRequestId}"
    }), cancellationToken);
}
```

```ruby
# Use the ID from the received MCP approval-request item.
approval_request_id = item.id

connection.conversation.items.create(
  type: :mcp_approval_response,
  id: "mcp_approval_#{approval_request_id}",
  approval_request_id: approval_request_id,
  approve: true
)
```


如果你拒绝该请求，请将 `approve` 设置为 `false` ，并可选择性地包含一个 `reason`.

## 仅对一个响应使用 MCP

如果 MCP 应该 **仅在单次回合内可用**，请将同一个 MCP 工具对象附加到 `response.tools` 而不是 `session.tools`:

在单个响应上添加 MCP 工具

```javascript
const event = {
  type: "response.create",
  response: {
    output_modalities: ["text"],
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Which transport should I use for browser clients in the Realtime API?",
          },
        ],
      },
    ],
    tools: [
      {
        type: "mcp",
        server_label: "openai_docs",
        server_url: "https://developers.openai.com/mcp",
        allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
        require_approval: "never",
      },
    ],
  },
};

ws.send(JSON.stringify(event));
```

```python
event = {
    "type": "response.create",
    "response": {
        "output_modalities": ["text"],
        "input": [
            {
                "type": "message",
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Which transport should I use for browser clients in the Realtime API?",
                    }
                ],
            }
        ],
        "tools": [
            {
                "type": "mcp",
                "server_label": "openai_docs",
                "server_url": "https://developers.openai.com/mcp",
                "allowed_tools": ["search_openai_docs", "fetch_openai_doc"],
                "require_approval": "never",
            }
        ],
    },
}

ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import java.util.List;

connection.send(
    RealtimeClientEvent.ofResponseCreate(
        ResponseCreateEvent.builder()
            .response(
                RealtimeResponseCreateParams.builder()
                    .metadata(
                        RealtimeResponseCreateParams.Metadata.builder()
                            .putAdditionalProperty(
                                "topic", com.openai.core.JsonValue.from("mcp_initial"))
                            .build())
                    .addOutputModality(RealtimeResponseCreateParams.OutputModality.TEXT)
                    .addInput(
                        RealtimeConversationItemUserMessage.builder()
                            .addContent(
                                RealtimeConversationItemUserMessage.Content.builder()
                                    .type(
                                        RealtimeConversationItemUserMessage.Content.Type
                                            .INPUT_TEXT)
                                    .text(
                                        "Which transport should I use for browser clients in the Realtime API?")
                                    .build())
                            .build())
                    .addTool(
                        RealtimeResponseCreateMcpTool.builder()
                            .serverLabel("openai_docs")
                            .serverUrl("https://developers.openai.com/mcp")
                            .allowedToolsOfMcp(
                                List.of("search_openai_docs", "fetch_openai_doc"))
                            .requireApproval(
                                RealtimeResponseCreateMcpTool.RequireApproval
                                    .McpToolApprovalSetting.NEVER)
                            .build())
                    .build())
            .build()));
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

await session.SendCommandAsync(new RealtimeClientCommandResponseCreate
{
    ResponseOptions = new()
    {
        Metadata = new Dictionary<string, BinaryData> { ["topic"] = BinaryData.FromObjectAsJson("mcp_initial") },
        OutputModalities =
        {
            RealtimeOutputModality.Text
        },
        InputItems =
        {
            RealtimeItem.CreateUserMessageItem("Which transport should I use for browser clients in the Realtime API?")
        },
        Tools =
        {
            new RealtimeMcpTool("openai_docs", new Uri("https://developers.openai.com/mcp"))
            {
                AllowedTools = new()
                {
                    ToolNames =
                    {
                        "search_openai_docs",
                        "fetch_openai_doc"
                    }
                },
                ToolCallApprovalPolicy = RealtimeDefaultMcpToolCallApprovalPolicy.NeverRequireApproval
            }
        }
    }
}, timeout.Token);
```

```ruby
connection.response.create(
  output_modalities: [:text],
  input: [
    {
      type: :message,
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Which Realtime API transport should browser clients use?"
        }
      ]
    }
  ],
  tools: [
    {
      type: :mcp,
      server_label: "openai_docs",
      server_url: "https://developers.openai.com/mcp",
      allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
      require_approval: :never
    }
  ]
)
```


当你只需要为单个响应提供外部上下文，或者不同回合需要使用不同的 MCP 服务器时，这种方式非常有用。

## 复用先前定义的 server label

`server_label` 是当前 Realtime 会话中工具定义的稳定句柄。在你使用
定义一次服务器或连接器之后，
`server_label` 加上 `server_url` 或 `connector_id`，后续的 `session.update` 或
`response.create` 事件只能引用相同的 `server_label`，并且 Realtime
Realtime API 会复用先前的定义，而无需你再次发送
完整的工具对象。

复用先前定义的连接器

```javascript
const event = {
  type: "response.create",
  response: {
    output_modalities: ["text"],
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Check my schedule for this afternoon.",
          },
        ],
      },
    ],
    // Reuses the google_calendar connector defined earlier in this session.
    tools: [
      {
        type: "mcp",
        server_label: "google_calendar",
      },
    ],
  },
};

ws.send(JSON.stringify(event));
```

```python
event = {
    "type": "response.create",
    "response": {
        "output_modalities": ["text"],
        "input": [
            {
                "type": "message",
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Check my schedule for this afternoon.",
                    }
                ],
            }
        ],
        # Reuses the google_calendar connector defined earlier in this session.
        "tools": [
            {
                "type": "mcp",
                "server_label": "google_calendar",
            }
        ],
    },
}

ws.send(json.dumps(event))
```

```java
import com.openai.client.okhttp.OkHttpClient;
import com.openai.core.ClientOptions;
import com.openai.helpers.RealtimeConnection;
import com.openai.helpers.RealtimeWebSocketOptions;
import com.openai.models.realtime.*;
import java.util.List;

send(
    connection,
    RealtimeClientEvent.ofResponseCreate(
        ResponseCreateEvent.builder()
            .response(
                RealtimeResponseCreateParams.builder()
                    .metadata(
                        RealtimeResponseCreateParams.Metadata.builder()
                            .putAdditionalProperty(
                                "topic", com.openai.core.JsonValue.from("mcp_initial"))
                            .build())
                    .addOutputModality(RealtimeResponseCreateParams.OutputModality.TEXT)
                    .addInput(
                        RealtimeConversationItemUserMessage.builder()
                            .addContent(
                                RealtimeConversationItemUserMessage.Content.builder()
                                    .type(
                                        RealtimeConversationItemUserMessage.Content.Type
                                            .INPUT_TEXT)
                                    .text("Check my schedule for this afternoon.")
                                    .build())
                            .build())
                    .addTool(
                        RealtimeResponseCreateMcpTool.builder()
                            .serverLabel("google_calendar")
                            .build())
                    .build())
            .build()));

// Retry only explicit admission rejections; these guarantee nothing was sent.
private static void send(RealtimeConnection connection, RealtimeClientEvent event)
    throws Exception {
  long deadline = System.nanoTime() + java.util.concurrent.TimeUnit.SECONDS.toNanos(5);
  while (true) {
    try {
      connection.send(event);
      return;
    } catch (com.openai.core.http.WebSocketWriteNotAttempted.Busy busy) {
      if (System.nanoTime() >= deadline) throw busy;
      Thread.sleep(10);
    }
  }
}
```

```csharp
using OpenAI.Realtime;

#pragma warning disable OPENAI002

await session.SendCommandAsync(new RealtimeClientCommandResponseCreate
{
    ResponseOptions = new()
    {
        Metadata = new Dictionary<string, BinaryData> { ["topic"] = BinaryData.FromObjectAsJson("mcp_initial") },
        OutputModalities =
        {
            RealtimeOutputModality.Text
        },
        InputItems =
        {
            RealtimeItem.CreateUserMessageItem("Check my schedule for this afternoon.")
        },
        Tools =
        {
            new RealtimeMcpTool
            {
                ServerLabel = "google_calendar"
            }
        }
    }
}, timeout.Token);
```

```ruby
connection.response.create(
  output_modalities: [:text],
  input: [
    {
      type: :message,
      role: :user,
      content: [
        {
          type: :input_text,
          text: "Check my schedule this afternoon."
        }
      ]
    }
  ],
  tools: [
    {
      type: :mcp,
      server_label: "google_calendar"
    }
  ]
)
```


这种复用是会话级别的。如果你开启一个新的 Realtime 会话，请重新发送
完整的 MCP 定义，以便服务器能够导入其工具列表。