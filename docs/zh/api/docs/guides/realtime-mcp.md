# Realtime with tools

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取相应文档页面的 Markdown 版本。

你可以将工具挂载到 Realtime 会话，让模型在实时对话中查找数据、执行操作或调用服务。无论你的客户端使用的是 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 还是 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime).

当你的应用需要自行执行工具并返回结果时，使用函数工具；当希望 Realtime API 为你连接到远程工具服务器时，使用 MCP 工具或内置连接器。

## 选择工具类型

| 工具类型                 | 使用场景                                                                             | 由谁执行                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `function`                | 你的应用负责业务逻辑、审批检查或私有系统访问。 | 你的客户端或服务端收到函数调用并返回 `function_call_output`. |
| `mcp` 使用 `server_url`   | 你希望模型调用远程 MCP 服务器所暴露的工具。                     | Realtime API 调用远程 MCP 服务器。                                      |
| `mcp` 使用 `connector_id` | 你希望使用内置连接器，例如 Google Calendar。                        | Realtime API 使用你提供的授权调用该连接器。           |

Add tools in **one of two places**:

- 在 **会话级别** 使用 `session.tools` 于 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)，如果你希望该工具在整个会话期间可用。
- 在 **响应级别** 使用 `response.tools` 于 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)，如果你仅在单次轮次中需要该工具。

## 配置函数工具

当工具需要在你的应用中运行时，函数工具是合适的默认选择。模型发出函数调用参数，由你的代码执行相应操作，再通过一个 `function_call_output` 条目。

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


当模型调用该函数时，监听函数调用条目，运行你的应用逻辑，然后将输出发回：

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


有关函数调用逐事件的完整演示，请参阅 [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling).

## 配置 MCP 工具

当工具已存在于远程 MCP 服务端之后，或当你希望使用 OpenAI 托管的连接器时，MCP 工具非常有用。与函数工具不同，MCP 工具由 Realtime API 自身执行。

在 Realtime 中，MCP 工具的结构如下：

- `type: "mcp"`
- `server_label`
- 其中一个 `server_url` 或 `connector_id`
- 可选 `authorization` 和 `headers`
- 可选 `allowed_tools`
- 可选 `require_approval`
- 可选 `server_description`

本示例在整个会话期间提供一个可用的文档 MCP 服务器：

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


内置连接器使用相同的 MCP 工具形式，但传递的是 `connector_id`
而不是 `server_url`。例如，Google Calendar 使用的是
`connector_googlecalendar`。在 Realtime 中，使用这些内置连接器来执行读取操作，例如搜索或读取事件或邮件。请将用户的 OAuth
访问令牌传入
中，并尽可能使用 `authorization`，来缩小工具面：
`allowed_tools` 时：

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
  但 **它们可以看到模型在工具调用中发送的任何数据。**.
  **使用** 保持工具面精简， `allowed_tools`,
  并对任何你不希望自动运行的操作要求审批。

## 实时 MCP 流程

与 Realtime `function` 工具不同，远程 MCP 工具由 **Realtime API 本身执行**. **你的客户端不会运行远程工具** 并返回结果 `function_call_output`。相反，你的客户端负责配置访问、监听 MCP 生命周期事件，并在服务器请求审批时可选地发送审批响应。

典型流程如下：

1. 你发送 `session.update` 或 `response.create` ，其中包含一个 `tools` 条目，其 `type` 为 `mcp`.
1. 服务端开始导入工具并发出 `mcp_list_tools.in_progress`.
1. 在列示仍在进行时，模型无法调用尚未加载完成的工具。如果你想在开始依赖这些工具的轮次之前等待，请监听 [`mcp_list_tools.completed`](https://developers.openai.com/api/reference/resources/realtime)。该 [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_list_tools` 显示了实际导入的工具名称。如果导入失败，你将收到 [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. 用户说话或发送文本，并创建一个响应，该响应由你的客户端或会话配置自动创建。
1. 如果模型选择了 MCP 工具，你将看到 `response.mcp_call_arguments.delta` 和 `response.mcp_call_arguments.done`.
1. **如果需要审批**，服务端会添加一个 conversation 条目，其 `item.type` 为 `mcp_approval_request`。你的客户端必须使用一个 `mcp_approval_response` 条目来应答。
1. 工具运行后，你将看到 `response.mcp_call.in_progress`。成功后，你稍后将收到一个 [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_call`；失败时，你将收到 [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. `response.done` 用于响应的 MCP 调用结果可能在其 MCP 调用完成之前到达。响应完成且其所有 MCP 调用都结束后，发送另一个 [`response.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，让模型使用这些结果并继续对话。如果模型进行了额外的 MCP 调用，请重复此步骤。Realtime API 不会自动创建这些后续响应。

此事件处理程序用于记录主要的 MCP 生命周期事件；它并不管理后续响应：

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


## 常见故障

- [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime): Realtime API 无法从远程服务器或连接器导入工具。请检查 `server_url` 或 `connector_id`、身份验证、服务器连接，以及你指定的任何 `allowed_tools` 名称。
- [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime): 模型选择了一个工具，但该工具调用未能完成。请检查事件载荷以及后续的 `mcp_call` 项，查看是否存在 MCP 协议、执行或传输错误。
- `mcp_approval_request` 且没有匹配的 `mcp_approval_response`: 在你的客户端明确批准或拒绝之前，工具调用无法继续。
- 当某个回合开始时仍有 `mcp_list_tools.in_progress` 处于激活状态：只有已经完成加载的工具才有资格参与该回合。
- 某个响应使用了 `tool_choice: "required"` 但当前没有可用工具：模型没有可以调用的合格工具。请等待 `mcp_list_tools.completed`，确认至少有一个工具已被导入，或使用不同的 `tool_choice` 来执行不需要工具的回合。
- 在导入开始前 MCP 工具定义校验失败：常见原因包括在同一个 `server_label` 数组中存在重复的 `tools` ，同时设置了 `server_url` 和 `connector_id`，在初始会话创建请求中均未填写这两项，使用了无效的 `connector_id`，或同时发送了 `authorization` 和 `headers.Authorization`。对于连接器，请勿发送 `headers.Authorization` 。

## 批准或拒绝 MCP 工具调用

如果某个工具需要审批，Realtime API 会向会话中插入一项 `mcp_approval_request` 内容。 **若要继续**，请发送一个 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_approval_response`.

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


如果你拒绝该请求，将 `approve` 设置为 `false` 并可选择性地附带一个 `reason`.

## 仅为单次响应使用 MCP

如果 MCP 应 **仅在单个回合内可用**,请将相同的 MCP 工具对象附加到 `response.tools` 而不是 `session.tools`:

在单个响应中添加 MCP 工具

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


当只有一个响应需要外部上下文,或不同回合应使用不同的 MCP 服务器时,这非常有用。

## 复用先前定义的服务器标签

`server_label` 是当前
Realtime 会话中某个工具定义的稳定句柄。在你使用
`server_label` 加 `server_url` 或 `connector_id`，定义一次服务端或连接器后，后续 `session.update` 或
`response.create` 事件只能引用同一个 `server_label`，并且
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


这种复用仅在当前会话范围内生效。如果你开启一个新的 Realtime 会话，请再次发送
完整的 MCP 定义，以便服务端导入其工具列表。