# Assistants migration guide

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).




We're moving from the Assistants API to the new [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) for a simpler and more flexible mental model.

Responses are simpler—send input items and get output items back. With the Responses API, you also get better performance and new features like [deep research](https://developers.openai.com/api/docs/guides/deep-research), [MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), and [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use). This change also lets you manage conversations instead of passing back `previous_response_id`.

### What's changed?

<table>
  <thead>
    <tr>
      <th>Before</th>
      <th>Now</th>
      <th>Why?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`Assistants`</td>
      <td>`Prompts`</td>
      <td>
        Prompts hold configuration (model, tools, instructions) and are easier
        to version and update
      </td>
    </tr>
    <tr>
      <td>`Threads`</td>
      <td>`Conversations`</td>
      <td>Streams of items instead of just messages</td>
    </tr>
    <tr>
      <td>`Runs`</td>
      <td>`Responses`</td>
      <td>
        Responses send input items or use a conversation object and receive
        output items; tool call loops are explicitly managed
      </td>
    </tr>
    <tr>
      <td>`Run steps`</td>
      <td>`Items`</td>
      <td>
        Generalized objects—can be messages, tool calls, outputs, and more
      </td>
    </tr>
  </tbody>
</table>

## From assistants to prompts

Assistants were persistent API objects that bundled model choice, instructions, and tool declarations—created and managed entirely through the API. Their replacement, prompts, can only be created in the dashboard, where you can version them as you develop your product.

### Why this is helpful

- **Portability and versioning**: You can snapshot, review, diff, and roll back prompt specs. You can also version a prompt, so your code can just point the latest version.
- **Separation of concerns**: Your application code now handles orchestration (history pruning, tool loop, retries) while your prompt focuses on high‑level behavior and constraints (system guidance, tool availability, structured output schema, temperature defaults).
- **Realtime compatibility**: The same prompt configuration can be reused when you connect through the Realtime API, giving you a single definition of behavior across chat, streaming, and low‑latency interactive sessions.
- **Tool and output consistency**: Using prompts, every Responses or Realtime session you start inherits a consistent contract because prompts encapsulate tool schemas and structured output expectations.

### Practical migration steps

1. Identify each existing Assistant’s _instruction + tool_ bundle.
2. In the dashboard, recreate that bundle as a named prompt.
3. Store the prompt ID (or its exported spec) in source control so application code can refer to a stable identifier.
4. During rollout, run A/B tests by swapping prompt IDs—no need to create or delete assistant objects programmatically.

Think of a prompt as a **versioned behavioral profile** to plug into either Responses or Realtime API.

---

## From threads to conversations

A thread was a collection of messages stored server-side. Threads could _only_ store messages. Conversations store items, which can include messages, tool calls, tool outputs, and other data.

### Request example

#### Python

#### Go

### Response example



#### Thread object

```json
{
  "id": "thread_CrXtCzcyEQbkAcXuNmVSKFs1",
  "object": "thread",
  "created_at": 1752855924,
  "metadata": {
    "user_id": "peter_le_fleur"
  },
  "tool_resources": {}
}
```

#### Conversation object

```json
{
	"id": "conv_68542dc602388199a30af27d040cefd4087a04b576bfeb24",
	"object": "conversation",
	"created_at": 1752855924,
	"metadata": {
		"user_id": "peter_le_fleur"
	}
}
```



---

## From runs to responses

Runs were asynchronous processes that executed against threads. See the example below. Responses are simpler: provide a set of input items to execute, and get a list of output items back.

Responses are designed to be used alone, but you can also use them with prompt and conversation objects for storing context and configuration.

### Request example

#### Python

#### Go

### Response example



#### Run object

```json
{
  "id": "run_FKIpcs5ECSwuCmehBqsqkORj",
  "assistant_id": "asst_8fVY45hU3IM6creFkVi5MBKB",
  "cancelled_at": null,
  "completed_at": 1752857327,
  "created_at": 1752857322,
  "expires_at": null,
  "failed_at": null,
  "incomplete_details": null,
  "instructions": null,
  "last_error": null,
  "max_completion_tokens": null,
  "max_prompt_tokens": null,
  "metadata": {},
  "model": "gpt-4.1",
  "object": "thread.run",
  "parallel_tool_calls": true,
  "required_action": null,
  "response_format": "auto",
  "started_at": 1752857324,
  "status": "completed",
  "thread_id": "thread_CrXtCzcyEQbkAcXuNmVSKFs1",
  "tool_choice": "auto",
  "tools": [],
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "usage": {
    "completion_tokens": 130,
    "prompt_tokens": 34,
    "total_tokens": 164,
    "prompt_token_details": {
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0
    }
  },
  "temperature": 1.0,
  "top_p": 1.0,
  "tool_resources": {},
  "reasoning_effort": null
}
```

#### Response object

```json
{
  "id": "resp_687a7b53036c819baad6012d58b39bcb074adcd9e24850fc",
  "created_at": 1752857427,
  "conversation": {
    "id": "conv_689667905b048191b4740501625afd940c7533ace33a2dab"
  },
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "metadata": {},
  "model": "gpt-5.5",
  "object": "response",
  "output": [
    {
      "id": "msg_687a7b542948819ba79e77e14791ef83074adcd9e24850fc",
      "content": [
        {
          "annotations": [],
          "text": "The \"5 Ds of Dodgeball\" are a humorous set of rules made famous by the 2004 comedy film **\"Dodgeball: A True Underdog Story.\"** In the movie, dodgeball coach Patches O’Houlihan teaches these basics to his team. The **5 Ds** are:\n\n1. **Dodge**\n2. **Duck**\n3. **Dip**\n4. **Dive**\n5. **Dodge** (yes, dodge is listed twice for emphasis!)\n\nIn summary:  \n> **“If you can dodge a wrench, you can dodge a ball!”**\n\nThese 5 Ds are not official competitive rules, but have become a fun and memorable pop culture reference for the sport of dodgeball.",
          "type": "output_text",
          "logprobs": []
        }
      ],
      "role": "assistant",
      "status": "completed",
      "type": "message"
    }
  ],
  "parallel_tool_calls": true,
  "temperature": 1.0,
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "background": false,
  "max_output_tokens": null,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "generate_summary": null,
    "summary": null
  },
  "service_tier": "scale",
  "status": "completed",
  "text": {
    "format": {
      "type": "text"
    }
  },
  "truncation": "disabled",
  "usage": {
    "input_tokens": 17,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 150,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 167
  },
  "user": null,
  "max_tool_calls": null,
  "store": true,
  "top_logprobs": 0
}
```



---

## Migrating your integration

Follow the migration steps below to move from the Assistants API to the Responses API, without losing any feature support.

### 1. Create prompts from your assistants

1. Identify the most important assistant objects in your application.
1. Find these in the dashboard and click `Create prompt`.

This will create a prompt object out of each existing assistant object.

Reusable prompt objects are also being deprecated. If you use this migration
  path, review the [prompts deprecation
  timeline](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) before adopting
  prompt objects in a long-lived integration.

### 2. Move new user chats over to conversations and responses

We will not provide an automated tool for migrating Threads to Conversations. Instead, we recommend migrating new user threads onto conversations and migrating older ones as necessary.

Here's an example for how you might backfill a thread:

```python
import os

from openai import OpenAI

openai = OpenAI()
messages = []
thread_id = os.environ["OPENAI_THREAD_ID"]

for page in openai.beta.threads.messages.list(
    thread_id=thread_id, order="asc"
).iter_pages():
    messages += page.data

items = []
for m in messages:
    item = {"role": m.role}
    item_content = []

    for content in m.content:
        match content.type:
            case "text":
                item_content_type = "input_text" if m.role == "user" else "output_text"
                item_content += [
                    {"type": item_content_type, "text": content.text.value}
                ]
            case "image_url":
                item_content += [
                    {
                        "type": "input_image",
                        "image_url": content.image_url.url,
                        "detail": content.image_url.detail,
                    }
                ]

    item |= {"content": item_content}
    items.append(item)

# create a conversation with your converted items
conversation = openai.conversations.create(items=items)
```

```ruby
require "openai"

client = OpenAI::Client.new
thread_id = ENV.fetch("OPENAI_THREAD_ID")
messages = client.beta.threads.messages.list(thread_id, order: :asc)
items = []
messages.auto_paging_each do |message|
  content = message.content.filter_map do |part|
    case part
    when OpenAI::Models::Beta::Threads::TextContentBlock
      type = if message.role == OpenAI::Models::Beta::Threads::Message::Role::USER
        :input_text
      else
        :output_text
      end
      {type: type, text: part.text.value}
    when OpenAI::Models::Beta::Threads::ImageURLContentBlock
      {
        type: :input_image,
        image_url: part.image_url.url,
        detail: part.image_url.detail
      }
    end
  end
  items << {role: message.role, content: content}
end
conversation = client.conversations.create(
  items: items
)
puts(conversation.id)
```


## Comparing full examples

Here are a few examples of integrations using both the Assistants API and the Responses API so you can see how they compare.

### User chat app



Assistants API

```python
threads_by_session: dict[str, str] = {}


@app.post("/messages")
async def message(message: Message):
    thread_id = threads_by_session.get(message.session_id)
    if thread_id is None:
        thread_id = openai.beta.threads.create().id
        threads_by_session[message.session_id] = thread_id

    openai.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message.content,
    )

    run = openai.beta.threads.runs.create(
        assistant_id=os.environ["OPENAI_ASSISTANT_ID"],
        thread_id=thread_id,
    )
    while run.status in ("queued", "in_progress"):
        await asyncio.sleep(1)
        run = openai.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id,
        )

    messages = openai.beta.threads.messages.list(
        order="desc",
        limit=1,
        thread_id=thread_id,
    )

    return {"content": messages.data[0].content}
```

```ruby
require "openai"

client = OpenAI::Client.new
assistant_id = ENV.fetch("OPENAI_ASSISTANT_ID")
threads_by_session = {}

handle_message = lambda do |session_id:, content:|
  thread_id = threads_by_session[session_id]
  unless thread_id
    thread_id = client.beta.threads.create.id
    threads_by_session[session_id] = thread_id
  end

  client.beta.threads.messages.create(
    thread_id,
    role: :user,
    content: content
  )
  run = client.beta.threads.runs.create(
    thread_id,
    assistant_id: assistant_id
  )
  while [:queued, :in_progress].include?(run.status)
    sleep(1)
    run = client.beta.threads.runs.retrieve(run.id, thread_id: thread_id)
  end

  messages = client.beta.threads.messages.list(
    thread_id,
    order: :desc,
    limit: 1
  )
  {content: messages.data&.first&.content}
end

puts(handle_message.call(
  session_id: "example-session",
  content: "What are the five Ds of dodgeball?"
))
```


  

  

    
Responses API

```python
conversations_by_session: dict[str, str] = {}


@app.post("/messages")
async def message(message: Message):
    conversation_id = conversations_by_session.get(message.session_id)
    if conversation_id is None:
        conversation_id = openai.conversations.create().id
        conversations_by_session[message.session_id] = conversation_id

    response = openai.responses.create(
        prompt={"id": os.environ["OPENAI_PROMPT_ID"]},
        input=[{"role": "user", "content": message.content}],
        conversation=conversation_id,
    )

    return {"content": response.output_text}
```

```ruby
require "openai"

client = OpenAI::Client.new
conversations_by_session = {}

handle_message = lambda do |session_id:, content:|
  conversation_id = conversations_by_session[session_id]
  unless conversation_id
    conversation_id = client.conversations.create.id
    conversations_by_session[session_id] = conversation_id
  end

  response = client.responses.create(
    prompt: {id: ENV.fetch("OPENAI_PROMPT_ID")},
    input: [{role: :user, content: content}],
    conversation: conversation_id
  )
  {content: response.output_text}
end

puts(handle_message.call(
  session_id: "example-session",
  content: "What are the five Ds of dodgeball?"
))
```