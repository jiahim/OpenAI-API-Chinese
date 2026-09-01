# Realtime with tools

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

你可以将工具附加到 Realtime 会话，这样模型就可以在实时对话中查询数据、执行操作或调用服务。无论你的客户端使用的是 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/realtime-webrtc) 还是 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket).

当你的应用需要自行执行工具并返回结果时，使用函数工具。当希望 Realtime API 为你连接到远程工具服务器时，使用 MCP 工具或内置连接器。

## Choose a tool type

| 工具类型                 | 使用场景                                                                             | 由谁执行                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `function`                | 你的应用拥有业务逻辑、审批检查或私有系统访问权限。 | 你的客户端或服务端收到函数调用后返回 `function_call_output`. |
| `mcp` 使用 `server_url`   | 你希望模型调用远程 MCP 服务器暴露的工具。                     | Realtime API 调用远程 MCP 服务器。                                      |
| `mcp` 使用 `connector_id` | 你希望使用内置连接器，例如 Google Calendar。                        | Realtime API 使用你提供的授权信息调用该连接器。           |

在以下两个位置之一添加工具 **one of two places**:

- 在 **会话级别** 使用 `session.tools` 在 [`session.update`](https://developers.openai.com/api/reference/resources/realtime),如果你希望该工具在整个会话中可用。
- 在 **响应级别** 使用 `response.tools` 在 [`response.create`](https://developers.openai.com/api/reference/resources/realtime),如果你仅在单轮对话中使用该工具。

## 配置函数工具

当工具需要在你的应用中运行时,函数工具是合适的默认选择。模型发出函数调用参数,你的代码执行相应操作,然后你的代码通过 `function_call_output` 将结果发送回去。

使用 session.update 配置函数工具

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

```ruby
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  tools: [{
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
  }],
  tool_choice: :auto
)
```


当模型调用该函数时,监听函数调用 item,执行你的应用逻辑,然后将输出发送回去:

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

```ruby
connection.conversation.items.create(
  type: :function_call_output,
  call_id: call_id,
  output: JSON.generate(status: "shipped", delivery_date: "2026-05-09")
)
connection.response.create(tool_choice: :none)
```


如需了解函数调用按事件的完整演练,请参阅 [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling).

## 配置 MCP 工具

当工具已经存在于远程 MCP 服务器后端，或者你希望使用 OpenAI 托管的连接器时，MCP 工具非常有用。与函数工具不同，MCP 工具由 Realtime API 自身执行。

在 Realtime 中，MCP 工具的格式为：

- `type: "mcp"`
- `server_label`
- One of `server_url` or `connector_id`
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

```ruby
connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  output_modalities: [:text],
  tools: [{
    type: :mcp,
    server_label: "openai_docs",
    server_url: "https://developers.openai.com/mcp",
    allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
    require_approval: :never
  }]
)
```


内置连接器使用相同的 MCP 工具结构，但传入 `connector_id`
而不是 `server_url`。例如，Google Calendar 使用
`connector_googlecalendar`。在 Realtime 中，将这些内置连接器用于读取
操作，例如搜索或读取事件或邮件。在
中传入用户的 OAuth `authorization`，访问令牌，并尽可能使用
`allowed_tools` 收窄工具范围：

配置 Google Calendar 连接器

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
        "model": "gpt-realtime-2.1",
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

```ruby
access_token = ENV.fetch("OPENAI_MCP_ACCESS_TOKEN")

connection.session.update(
  type: :realtime,
  model: "gpt-realtime-2.1",
  output_modalities: [:text],
  tools: [{
    type: :mcp,
    server_label: "google_calendar",
    connector_id: "connector_googlecalendar",
    authorization: access_token,
    allowed_tools: ["search_events", "read_event"],
    require_approval: :never
  }]
)
```


远程 MCP 服务器 
  **不会自动接收完整的对话上下文，**,
  但 **它们可以看到模型在工具调用中发送的任何数据**.
  **使用** 保持工具范围收窄， `allowed_tools`,
  并对任何你不希望自动执行的操作要求审批。

## Realtime MCP 流程

与 Realtime `function` 工具不同，远程 MCP 工具由 **Realtime API 本身执行**. **你的客户端不会运行远程工具** 并返回结果 `function_call_output`。相反，你的客户端会配置访问、监听 MCP 生命周期事件，并在服务器请求时（可选地）发送审批响应。

典型流程如下：

1. 你发送 `session.update` or `response.create` ，其中带有 `tools` 条目，其 `type` 为 `mcp`.
1. 服务端开始导入工具并发出 `mcp_list_tools.in_progress`.
1. 在列表生成仍在进行时，模型无法调用尚未加载的工具。如果你想在开始依赖这些工具的轮次之前进行等待，请监听 [`mcp_list_tools.completed`](https://developers.openai.com/api/reference/resources/realtime)。该 [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件的 `item.type` 为 `mcp_list_tools` 展示了实际导入了哪些工具名称。如果导入失败，你将收到 [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. 用户进行语音或文本输入，并创建一个响应，由你的客户端或根据会话配置自动完成。
1. 如果模型选择了一个 MCP 工具，你将看到 `response.mcp_call_arguments.delta` 和 `response.mcp_call_arguments.done`.
1. **如果需要审批**，服务端会添加一个会话项，其 `item.type` 为 `mcp_approval_request`。你的客户端必须使用一个 `mcp_approval_response` 项来响应它。
1. 工具运行后，你将看到 `response.mcp_call.in_progress`。成功后，你稍后将收到一个 [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件的 `item.type` 为 `mcp_call`；失败时，你将收到 [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. `response.done` 的响应可能会在其 MCP 调用完成之前到达。响应结束且其所有 MCP 调用都已完成后，请发送另一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，让模型使用结果并继续会话。如果模型进行额外的 MCP 调用，请重复此步骤。Realtime API 不会自动创建这些后续响应。

此事件处理程序会记录主要的 MCP 生命周期事件，但不会管理后续响应：

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
      input: [{
        type: :message,
        role: :user,
        content: [{
          type: :input_text,
          text: "Which Realtime API transport should browser clients use?"
        }]
      }],
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

- [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime): Realtime API 无法从远程服务器或连接器导入工具。请检查 `server_url` or `connector_id`、身份验证、服务器连接性以及任何 `allowed_tools` 中指定的名称。
- [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime): 模型选择了某个工具，但工具调用未完成。请检查事件负载以及后续的 `mcp_call` 项中的 MCP 协议、执行或传输错误。
- `mcp_approval_request` 未找到匹配的 `mcp_approval_response`: 工具调用无法继续，直到你的客户端明确批准或拒绝它。
- 当某个回合开始时，如果 `mcp_list_tools.in_progress` 仍处于活动状态：只有那些已经完成加载的工具才有资格参与该回合。
- 某个响应使用了 `tool_choice: "required"` ，但当前没有可用的工具：模型没有可以调用的对象。请等待 `mcp_list_tools.completed`，确认至少导入了一个工具，或为不需要工具的回合使用不同的 `tool_choice` 。
- MCP 工具定义在导入开始前校验失败：常见原因是同一 `server_label` 数组中出现重复的 `tools` ，或者同时设置了这两个 `server_url` 和 `connector_id`，或者在初始会话创建请求中都省略了它们，或者使用了无效的 `connector_id`，或者同时发送了这两者 `authorization` 和 `headers.Authorization`。对于连接器，请完全不要发送 `headers.Authorization` 。

## 批准或拒绝 MCP 工具调用

如果某个工具需要审批，Realtime API 会在对话中插入一个 `mcp_approval_request` item。 **若要继续**，请发送一个新的 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_approval_response`.

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

```ruby
approval_request_id = item.id

connection.conversation.items.create(
  type: :mcp_approval_response,
  id: "mcp_approval_#{approval_request_id}",
  approval_request_id: approval_request_id,
  approve: true
)
```


如果拒绝该请求，请将 `approve` 设置为 `false` ，并可选择性地包含一个 `reason`.

## 仅为单次响应使用 MCP

If MCP should **仅在单轮内可用**，请将同一个 MCP 工具对象附加到 `response.tools` 而不是 `session.tools`:

在单个 response 上添加 MCP 工具

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

```ruby
connection.response.create(
  output_modalities: [:text],
  input: [{
    type: :message,
    role: :user,
    content: [{
      type: :input_text,
      text: "Which Realtime API transport should browser clients use?"
    }]
  }],
  tools: [{
    type: :mcp,
    server_label: "openai_docs",
    server_url: "https://developers.openai.com/mcp",
    allowed_tools: ["search_openai_docs", "fetch_openai_doc"],
    require_approval: :never
  }]
)
```


当只有一个 response 需要外部上下文，或不同轮次需要使用不同的 MCP 服务器时，这非常有用。

## 复用先前定义的服务器标签

`server_label` 是当前会话中工具定义的稳定标识符
Realtime 会话。你使用
`server_label` plus `server_url` 或 `connector_id`，稍后 `session.update` 或
`response.create` 事件只能引用相同的 `server_label`，并且
Realtime API 将复用先前的定义，而无需你再次发送
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

```ruby
connection.response.create(
  output_modalities: [:text],
  input: [{
    type: :message,
    role: :user,
    content: [{type: :input_text, text: "Check my schedule this afternoon."}]
  }],
  tools: [{type: :mcp, server_label: "google_calendar"}]
)
```


此复用仅在当前会话内有效。如果你启动一个新的 Realtime 会话，请重新发送
完整的 MCP 定义，以便服务器能够导入其工具列表。