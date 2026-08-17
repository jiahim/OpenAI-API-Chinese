# Advanced integrations with ChatKit

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

When you need full control—custom authentication, data residency, on‑prem deployment, or bespoke agent orchestration—you can run ChatKit on your own infrastructure. Use OpenAI's advanced self‑hosted option to use your own server and customized ChatKit.

Agent Builder-hosted ChatKit workflows are in a transition window. For new
  ChatKit apps, build on your own server-side agent implementation with the
  ChatKit SDKs and the Agents SDK. See [ChatKit transition guidance
  →](https://developers.openai.com/api/docs/guides/chatkit)

## Run ChatKit on your own infrastructure

At a high level, an advanced ChatKit integration is a process of building your own ChatKit server and adding widgets to build out your chat surface. You'll use OpenAI APIs and your ChatKit server to build a custom chat powered by OpenAI models.

![OpenAI-hosted ChatKit](https://cdn.openai.com/API/docs/images/self-hosted.png)

## Set up your ChatKit server

Follow the [server guide on GitHub](https://github.com/openai/chatkit-python/blob/main/docs/server.md) to learn how to handle incoming requests, run tools, and
stream results back to the client. The snippets below highlight the main components.

### 1. Install the server package

```bash
pip install openai-chatkit
```

### 2. Implement a server class

`ChatKitServer` drives the conversation. Override `respond` to stream events whenever a
user message or client tool output arrives. Helpers like `stream_agent_response` connect
the server to the Agents SDK.

```python
class MyChatKitServer(ChatKitServer[RequestContext]):
    async def respond(
        self,
        thread: ThreadMetadata,
        input: UserMessageItem | ClientToolCallOutputItem | None,
        context: RequestContext,
    ) -> AsyncIterator[Event]:
        items_page = await self.store.load_thread_items(
            thread.id,
            after=None,
            limit=20,
            order="desc",
            context=context,
        )
        input_items = await simple_to_agent_input(list(reversed(items_page.data)))
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )
        result = Runner.run_streamed(
            assistant_agent,
            input_items,
            context=agent_context,
        )
        async for event in stream_agent_response(agent_context, result):
            yield event
```


### 3. Expose the endpoint

Use your framework of choice to forward HTTP requests to the server instance. For
example, with FastAPI:

```python
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse

app = FastAPI()
data_store = MemoryStore()
server = MyChatKitServer(data_store)


@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    result = await server.process(await request.body(), {})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")
```


### 4. Establish data store contract

Implement `chatkit.store.Store` to persist threads, messages, and files using your
preferred database. For local development, you can use an in-memory `Store`
implementation. For production, use durable storage and consider storing the models as
JSON blobs so library updates can evolve the schema without migrations.

### 5. Provide file store contract

Provide a `FileStore` implementation if you support uploads. ChatKit works with direct
uploads (the client POSTs the file to your endpoint) or two-phase uploads (the client
requests a signed URL, then uploads to cloud storage). Expose previews to support inline
thumbnails and handle deletions when threads are removed.

### 6. Trigger client tools from the server

Client tools must be registered both in the client options and on your agent. Use
`ctx.context.client_tool_call` to enqueue a call from an Agents SDK tool.

```python
@function_tool(description_override="Add an item to the user's todo list.")
async def add_to_todo_list(ctx: RunContextWrapper[AgentContext], item: str) -> None:
    ctx.context.client_tool_call = ClientToolCall(
        name="add_to_todo_list",
        arguments={"item": item},
    )


assistant_agent = Agent[AgentContext](
    model="gpt-5.6",
    name="Assistant",
    instructions="You are a helpful assistant",
    tools=[add_to_todo_list],
    tool_use_behavior=StopAtTools(stop_at_tool_names=[add_to_todo_list.name]),
)
```


### 7. Use thread metadata and state

Use `thread.metadata` to store server-side state such as the previous Responses API run
ID or custom labels. Metadata is not exposed to the client but is available in every
`respond` call.

### 8. Get tool status updates

Long-running tools can stream progress to the UI with `ProgressUpdateEvent`. ChatKit
replaces the progress event with the next assistant message or widget output.

### 9. Using server context

Pass a custom context object to `server.process(body, context)` to enforce permissions or
propagate user identity through your store and file store implementations.

## Add inline interactive widgets

Widgets let agents surface rich UI inside the chat surface. Use them for cards, forms,
text blocks, lists, and other layouts. The helper `stream_widget` can render a widget
immediately or stream updates as they arrive.

```python
async def respond(
    self,
    thread: ThreadMetadata,
    input: UserMessageItem | ClientToolCallOutputItem | None,
    context: RequestContext,
) -> AsyncIterator[Event]:
    widget = Card(
        children=[
            Text(
                id="description",
                value="Generated summary",
            )
        ]
    )
    async for event in stream_widget(
        thread,
        widget,
        generate_id=lambda item_type: self.store.generate_item_id(
            item_type, thread, context
        ),
    ):
        yield event
```


ChatKit ships with a wide set of widget nodes (cards, lists, forms, text, buttons, and
more). See [widgets guide on GitHub](https://github.com/openai/chatkit-python/blob/main/docs/widgets.md) for all components, props, and
streaming guidance.

See the [Widget Builder](https://widgets.chatkit.studio/) to explore and create widgets in an interactive UI.

## Use actions

Actions let the ChatKit UI trigger work without sending a user message. Attach an
`ActionConfig` to any widget node that supports it—buttons, selects, and other controls
can stream new thread items or update widgets in place. When a widget lives inside a
`Form`, ChatKit includes the collected form values in the action payload.

On the server, implement the `action` method on `ChatKitServer` to process the payload
and optionally stream additional events. You can also handle actions on the client by
setting `handler="client"` and responding in JavaScript before forwarding follow-up
work to the server.

See the [actions guide on GitHub](https://github.com/openai/chatkit-python/blob/main/docs/actions.md) for patterns like chaining actions, creating
strongly typed payloads, and coordinating client/server handlers.

## Resources

Use the following resources and reference to complete your integration.

### Design resources

- Download [OpenAI Sans Variable](https://drive.google.com/file/d/10-dMu1Oknxg3cNPHZOda9a1nEkSwSXE1/view?usp=sharing).
- Duplicate the file and customize components for your product.

### Events reference

ChatKit emits `CustomEvent` instances from the Web Component. Listen for lifecycle events and read payload data from `event.detail`:

```javascript
chatkit.addEventListener("chatkit.error", (event) => {
  console.error(event.detail.error);
});

chatkit.addEventListener("chatkit.response.start", () => {
  console.log("Response started");
});

chatkit.addEventListener("chatkit.response.end", () => {
  console.log("Response ended");
});

chatkit.addEventListener("chatkit.thread.change", (event) => {
  console.log("Active thread:", event.detail.threadId);
});

chatkit.addEventListener("chatkit.log", (event) => {
  console.log(event.detail.name, event.detail.data);
});
```


### Options reference

| Option          | Type                       | Description                                                | Default        |
| --------------- | -------------------------- | ---------------------------------------------------------- | -------------- |
| `apiURL`        | `string`                   | Endpoint that implements the ChatKit server protocol.      | _required_     |
| `fetch`         | `typeof fetch`             | Override fetch calls (for custom headers or auth).         | `window.fetch` |
| `theme`         | `"light" \| "dark"`        | UI theme.                                                  | `"light"`      |
| `initialThread` | `string \| null`           | Thread to open on mount; `null` shows the new thread view. | `null`         |
| `clientTools`   | `Record<string, Function>` | Client-executed tools exposed to the model.                |                |
| `header`        | `object \| boolean`        | Header configuration or `false` to hide the header.        | `true`         |
| `newThreadView` | `object`                   | Customize greeting text and starter prompts.               |                |
| `messages`      | `object`                   | Configure message features (feedback, annotations, etc.).  |                |
| `composer`      | `object`                   | Control attachments, entity tags, and placeholder text.    |                |
| `entities`      | `object`                   | Callbacks for entity lookup, click handling, and previews. |                |

### Plain-text aliases

- "light" | "dark"
- string | null
- object | boolean