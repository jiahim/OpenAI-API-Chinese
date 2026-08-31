# Realtime with tools

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

You can attach tools to a Realtime session so the model can look up data, take actions, or call services during a live conversation. Tool configuration uses the same event surface whether your client is using a [WebRTC data channel](https://developers.openai.com/api/docs/guides/realtime-webrtc) or a [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket).

Use function tools when your application should execute the tool and return the result. Use MCP tools or built-in connectors when the Realtime API should connect to a remote tool server for you.

## Choose a tool type

| Tool type                 | Use when                                                                             | Who executes it                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `function`                | Your application owns the business logic, approval checks, or private system access. | Your client or server receives a function call and returns `function_call_output`. |
| `mcp` with `server_url`   | You want the model to call tools exposed by a remote MCP server.                     | The Realtime API calls the remote MCP server.                                      |
| `mcp` with `connector_id` | You want to use a built-in connector such as Google Calendar.                        | The Realtime API calls the connector with the authorization you provide.           |

Add tools in **one of two places**:

- At the **session level** with `session.tools` in [`session.update`](https://developers.openai.com/api/reference/resources/realtime), if you want the tool available for the full session.
- At the **response level** with `response.tools` in [`response.create`](https://developers.openai.com/api/reference/resources/realtime), if you only need the tool for one turn.

## Configure a function tool

Function tools are the right default when the tool should run in your application. The model emits function call arguments, your code executes the action, and your code sends the result back with a `function_call_output` item.

Configure a function tool with session.update

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


When the model calls the function, listen for the function call item, run your application logic, then send the output back:

Send function call output

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


For a full event-by-event walkthrough of function calling, see [Managing conversations](https://developers.openai.com/api/docs/guides/realtime-conversations#function-calling).

## Configure an MCP tool

MCP tools are useful when the tool already exists behind a remote MCP server, or when you want to use an OpenAI-managed connector. Unlike function tools, MCP tools are executed by the Realtime API itself.

In Realtime, the MCP tool shape is:

- `type: "mcp"`
- `server_label`
- One of `server_url` or `connector_id`
- Optional `authorization` and `headers`
- Optional `allowed_tools`
- Optional `require_approval`
- Optional `server_description`

This example makes a docs MCP server available for the full session:

Configure an MCP tool with session.update

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


Built-in connectors use the same MCP tool shape, but pass `connector_id`
instead of `server_url`. For example, Google Calendar uses
`connector_googlecalendar`. In Realtime, use these built-in connectors for read
actions, such as searching or reading events or emails. Pass the user's OAuth
access token in `authorization`, and narrow the tool surface with
`allowed_tools` when possible:

Configure a Google Calendar connector

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


Remote MCP servers 
  **don't automatically receive the full conversation context**,
  but **they can see any data the model sends in a tool call**.
  **Keep the tool surface narrow** with `allowed_tools`,
  and require approval for any action you would not auto-run.

## Realtime MCP flow

Unlike Realtime `function` tools, remote MCP tools are **executed by the Realtime API itself**. **Your client doesn't run the remote tool** and return a `function_call_output`. Instead, your client configures access, listens for MCP lifecycle events, and optionally sends an approval response if the server asks for one.

A typical flow looks like this:

1. You send `session.update` or `response.create` with a `tools` entry whose `type` is `mcp`.
1. The server begins importing tools and emits `mcp_list_tools.in_progress`.
1. While listing is still in progress, the model can't call a tool that hasn't loaded yet. If you want to wait before starting a turn that depends on those tools, listen for [`mcp_list_tools.completed`](https://developers.openai.com/api/reference/resources/realtime). The [`conversation.item.done`](https://developers.openai.com/api/reference/resources/realtime) event whose `item.type` is `mcp_list_tools` shows which tool names were actually imported. If import fails, you will receive [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime).
1. The user speaks or sends text, and a response is created, either by your client or automatically by the session configuration.
1. If the model chooses an MCP tool, you will see `response.mcp_call_arguments.delta` and `response.mcp_call_arguments.done`.
1. **If approval is required**, the server adds a conversation item whose `item.type` is `mcp_approval_request`. Your client must answer it with an `mcp_approval_response` item.
1. Once the tool runs, you will see `response.mcp_call.in_progress`. On success, you will later receive a [`response.output_item.done`](https://developers.openai.com/api/reference/resources/realtime) event whose `item.type` is `mcp_call`; on failure, you will receive [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime). The assistant message item and `response.done` complete the turn.

This event handler covers the main checkpoints:

Listen for MCP events during a Realtime session

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


## Common failures

- [`mcp_list_tools.failed`](https://developers.openai.com/api/reference/resources/realtime): the Realtime API couldn't import tools from the remote server or connector. Check `server_url` or `connector_id`, authentication, server connectivity, and any `allowed_tools` names you specified.
- [`response.mcp_call.failed`](https://developers.openai.com/api/reference/resources/realtime): the model selected a tool, but the tool call didn't complete. Inspect the event payload and the later `mcp_call` item for MCP protocol, execution, or transport errors.
- `mcp_approval_request` with no matching `mcp_approval_response`: the tool call can't continue until your client explicitly approves or rejects it.
- A turn starts while `mcp_list_tools.in_progress` is still active: only tools that have already finished loading are eligible for that turn.
- A response uses `tool_choice: "required"` but no tools are currently available: the model has nothing eligible to call. Wait for `mcp_list_tools.completed`, confirm that at least one tool was imported, or use a different `tool_choice` for turns that don't require a tool.
- MCP tool definition validation fails before import starts: common causes are a duplicate `server_label` in the same `tools` array, setting both `server_url` and `connector_id`, omitting both of them on the initial session creation request, using an invalid `connector_id`, or sending both `authorization` and `headers.Authorization`. For connectors, don't send `headers.Authorization` at all.

## Approve or reject MCP tool calls

If a tool requires approval, the Realtime API inserts an `mcp_approval_request` item into the conversation. **To continue**, send a new [`conversation.item.create`](https://developers.openai.com/api/reference/resources/realtime) event whose `item.type` is `mcp_approval_response`.

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


If you reject the request, set `approve` to `false` and optionally include a `reason`.

## Use MCP for one response only

If MCP should **only be available for a single turn**, attach the same MCP tool object to `response.tools` instead of `session.tools`:

Add MCP tools on one response

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


This is useful when only one response needs external context, or when different turns should use different MCP servers.

## Reuse a previously defined server label

`server_label` is the stable handle for a tool definition in the current
Realtime session. After you define a server or connector once with
`server_label` plus `server_url` or `connector_id`, later `session.update` or
`response.create` events can reference only that same `server_label`, and the
Realtime API will reuse the earlier definition instead of requiring you to send
the full tool object again.

Reuse a previously defined connector

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


This reuse is session-scoped. If you start a new Realtime session, send the
full MCP definition again so the server can import its tool list.