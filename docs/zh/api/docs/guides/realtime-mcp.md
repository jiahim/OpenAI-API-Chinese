# 使用工具的实时 接口

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

你可以将工具附加到 Realtime 会话，使模型在实时对话期间能够查找数据、执行操作或调用服务。无论客户端使用的是 [WebRTC 数据通道](https://developers.openai.com/api/docs/guides/realtime-webrtc) 还是 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket).

当你的应用程序应执行工具并返回结果时，使用函数工具。当 Realtime API 应为你连接远程工具服务器时，使用 MCP 工具或内置连接器。

## 选择工具类型

| 工具类型                 | 使用场景                                                                             | 执行者                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `function`                | 你的应用拥有业务逻辑、审批检查或私有系统访问权限。 | 你的客户端或服务端接收函数调用并返回 `function_call_output`. |
| `mcp` 配合 `server_url`   | 你希望模型调用远程 MCP 服务器暴露的工具。                     | Realtime API 调用远程 MCP 服务器。                                      |
| `mcp` 配合 `connector_id` | 你希望使用内置连接器，如 Google Calendar。                        | Realtime API 使用你提供的授权调用连接器。           |

在以下两处之一 **添加工具**:

- 在 **会话级别** 使用 `session.tools` 中的 [`session.update`](https://developers.openai.com/api/reference/resources/realtime)，如果你希望该工具在整个会话期间可用。
- 在 **响应级别** 使用 `response.tools` 中的 [`response.create`](https://developers.openai.com/api/reference/resources/realtime)，如果你只需要该工具进行一次交互。

## 配置函数工具

当工具应在你的应用程序中运行时，函数工具是正确的默认选择。模型会发出函数调用参数，你的代码执行该操作，然后你的代码通过以下方式将结果发送回去： `function_call_output` 条目。

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


当模型调用该函数时，监听函数调用条目，运行你的应用程序逻辑，然后将输出发送回去：

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


如需函数调用的完整逐事件演练，请参阅 [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling).

## 配置 MCP 工具

当工具已存在于远程 MCP 服务器之后，或者当你希望使用 OpenAI 管理的连接器时，MCP 工具非常有用。与函数工具不同，MCP 工具由 Realtime API 本身执行。

在 Realtime 中，MCP 工具的形式为：

- `type: "mcp"`
- `server_label`
- 其中一个 `server_url` 或 `connector_id`
- 可选 `authorization` 和 `headers`
- 可选 `allowed_tools`
- 可选 `require_approval`
- 可选 `server_description`

此示例使文档 MCP 服务器在整个会话期间可用：

使用 session.update 配置一个 MCP 工具

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


内置连接器使用相同的 MCP 工具形状，但传递 `connector_id`
而非 `server_url`。例如，谷歌日历使用
`connector_googlecalendar`。在 Realtime 中，使用这些内置连接器执行读取
操作，例如搜索或读取事件或电子邮件。在以下位置传递用户的 OAuth
访问令牌 `authorization`，并尽可能通过以下方式缩小工具范围
`allowed_tools` ：

配置一个谷歌日历连接器

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


远程 MCP 服务器 
  **不会自动接收完整的对话上下文**,
  ，但 **它们可以看到模型在工具调用中发送的任何数据**.
  **保持工具范围狭窄** ，并 `allowed_tools`,
  要求对任何你不会自动运行的操作进行审批。

## Realtime MCP 流程

与 Realtime `function` 工具不同，远程 MCP 工具由 **Realtime API 自身执行**. **你的客户端不运行远程工具** 并返回 `function_call_output`。相反，你的客户端配置访问权限、监听 MCP 生命周期事件，并在服务器请求时可选地发送审批响应。

典型流程如下：

1. 你发送 `session.update` 或 `response.create` 带有一个 `tools` 条目，其 `type` 为 `mcp`.
1. 服务端开始导入工具并发出 `mcp_list_tools.in_progress`.
1. 当列表仍在进行中时，模型无法调用尚未加载的工具。如果你想在开始依赖于这些工具的回合之前等待，请监听 [`mcp_list_tools.completed`](https://developers.openai.com/api/reference/resources/realtime)。事件的 [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_list_tools` 显示实际导入的工具名称。如果导入失败，你将收到 [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. 用户说话或发送文本，然后由你的客户端或会话配置自动创建响应。
1. 如果模型选择了 MCP 工具，你将看到 `response.mcp_call_arguments.delta` 和 `response.mcp_call_arguments.done`.
1. **如果需要批准**，服务端会添加一个对话项，其 `item.type` 为 `mcp_approval_request`。你的客户端必须用一个 `mcp_approval_response` 项目来回答它。
1. 工具运行后，你将看到 `response.mcp_call.in_progress`。成功时，你稍后将收到一个 [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_call`；失败时，你将收到 [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime)。助手消息项和 `response.done` 完成该轮对话。

此事件处理器涵盖主要检查点：

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


## 常见故障

- [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime)：Realtime API 无法从远程服务器或连接器导入工具。检查 `server_url` 或 `connector_id`、身份验证、服务器连接以及任何 `allowed_tools` 你指定的名称。
- [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime)：模型选择了工具，但工具调用未完成。检查事件负载和后续的 `mcp_call` 项中的 MCP 协议、执行或传输错误。
- `mcp_approval_request` 没有匹配的 `mcp_approval_response`：工具调用只有在你客户端明确批准或拒绝后才能继续进行。
- 当 `mcp_list_tools.in_progress` 仍处于活动状态时开始一个回合：只有已加载完成的工具才可用于该回合。
- 某个响应使用 `tool_choice: "required"` 但当前没有可用工具：模型没有可调用的内容。等待 `mcp_list_tools.completed`，确认至少导入了一个工具，或使用不同的 `tool_choice` 来进行不需要工具的回合。
- MCP 工具定义验证在导入开始前失败：常见原因是同一 `server_label` 中存在重复的 `tools` 数组，同时设置了 `server_url` 和 `connector_id`，在初始会话创建请求中省略这两者，使用无效的 `connector_id`，或同时发送 `authorization` 以及 `headers.Authorization`。对于连接器，不要发送 `headers.Authorization` 。

## 批准或拒绝 MCP 工具调用

如果某个工具需要审批，Realtime API 会向对话中插入一个 `mcp_approval_request` 项目。 **要继续**，请发送一个新的 [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) 事件，其 `item.type` 为 `mcp_approval_response`.

批准 MCP 请求

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


如果你拒绝该请求，请将 `approve` 设为 `false` ，并可选地包含一个 `reason`.

## 仅对单次响应使用 MCP

如果 MCP 应 **仅在单轮中可用**，请将相同的 MCP 工具对象附加到 `response.tools` 而不是 `session.tools`:

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


当只有一个响应需要外部上下文，或不同轮次应使用不同的 MCP 服务器时，这很有用。

## 复用先前定义的服务端标签

`server_label` 是当前
Realtime 会话中工具定义的稳定句柄。只需使用
`server_label` plus `server_url` 或 `connector_id`，之后，后续的 `session.update` 或
`response.create` 事件只能引用同一个 `server_label`，且
Realtime API 将复用之前的定义，而无需再次发送
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


此复用仅限于会话范围。如果启动新的 Realtime 会话，则需发送
完整的 MCP 定义，以便服务器导入其工具列表。