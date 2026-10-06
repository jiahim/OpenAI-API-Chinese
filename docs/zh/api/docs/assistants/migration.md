# Assistants 迁移指南

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

Assistants API 已于 2026 年 8 月 26 日正式下线，不再可用。请改用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行新的集成。




感谢所有使用过 Assistants API 的用户。我们感谢大家构建的一切以及一路走来的反馈。

请参考本指南，将你的集成迁移到 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses).

Responses 更简单——发送输入项即可获得输出项。使用 Responses API，你还将获得更出色的性能，以及全新功能，例如 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)。此次变更还让你可以管理会话，而无需回传 `previous_response_id`.

### 有哪些变化？

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

## 从 assistants 到 prompts

Assistants 是持久化的 API 对象，将模型选择、指令和工具声明捆绑在一起——完全通过 API 创建和管理。它的替代品 prompts 只能在仪表板中创建，你可以在仪表板中随着产品的开发对它们进行版本管理。

### 为什么这很有用

- **可移植性与版本管理**：你可以对 prompt 规范进行快照、审查、对比和回滚。你还可以对 prompt 进行版本管理，这样你的代码只需指向最新版本即可。
- **关注点分离**：你的应用代码现在负责处理编排（历史裁剪、工具循环、重试），而你的 prompt 则专注于高层行为与约束（系统指引、工具可用性、结构化输出 schema、temperature 默认值）。
- **Realtime 兼容性**：当你通过 Realtime API 连接时，可以复用同一份 prompt 配置，从而在对话、流式传输和低延迟交互会话中拥有统一的行为定义。
- **工具与输出的一致性**：通过使用 prompts，你启动的每个 Responses 或 Realtime 会话都会继承一致的契约，因为 prompts 封装了工具 schema 和结构化输出预期。

### 实用的迁移步骤

1. 识别每个现有 Assistant 的 _指令 + 工具_ 组合。
2. 在仪表板中，将该组合重建为一个命名提示。
3. 将提示 ID（或其导出规范）存入源代码管理，以便应用代码可以引用稳定的标识符。
4. 在发布期间，通过交换提示 ID 来运行 A/B 测试——无需以编程方式创建或删除 assistant 对象。

把提示词看作一个 **可版本化的行为配置** ，接入到 Responses 或 Realtime API 中。

---

## 从线程到对话

线程是一组存储在 服务端的消息。线程只能 _只能_ 存储消息。对话会存储条目，其中可以包括消息、工具调用、工具输出以及其他数据。

### 请求示例

#### Python



#### Thread 对象

```python
thread = openai.beta.threads.create(
    messages=[{"role": "user", "content": "what are the 5 Ds of dodgeball?"}],
    metadata={"user_id": "peter_le_fleur"},
)
```

#### Conversation 对象

```python
conversation = openai.conversations.create(
    items=[{"role": "user", "content": "what are the 5 Ds of dodgeball?"}],
    metadata={"user_id": "peter_le_fleur"},
)
```



#### Go



#### Thread 对象 (Go)

```go
thread, err := client.Beta.Threads.New(context.Background(), openai.BetaThreadNewParams{
	Messages: []openai.BetaThreadNewParamsMessage{{
		Role: "user",
		Content: openai.BetaThreadNewParamsMessageContentUnion{
			OfString: openai.String("what are the 5 Ds of dodgeball?"),
		},
	}},
	Metadata: shared.Metadata{"user_id": "peter_le_fleur"},
})
if err != nil {
	panic(err)
}
```

#### Conversation 对象 (Go)

```go
conversation, err := client.Conversations.New(context.Background(), conversations.ConversationNewParams{
	Items: []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("what are the 5 Ds of dodgeball?", responses.EasyInputMessageRoleUser),
	},
	Metadata: shared.Metadata{"user_id": "peter_le_fleur"},
})
if err != nil {
	panic(err)
}
```



#### JavaScript



#### Thread 对象 (JavaScript)

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const thread = await client.beta.threads.create({
  messages: [{ role: "user", content: "what are the 5 Ds of dodgeball?" }],
  metadata: { user_id: "peter_le_fleur" },
});
console.log(thread.id);
```

#### Conversation 对象 (JavaScript)

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const conversation = await client.conversations.create({
  items: [{ role: "user", content: "What are the five Ds of dodgeball?" }],
  metadata: { user_id: "peter_le_fleur" },
});

console.log(conversation.id);
```



### 响应示例



#### Thread 对象

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

#### Conversation 对象

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

## 从 runs 到 responses

Runs 是针对线程执行的异步进程。请参阅下方示例。Responses 更简单：提供一组输入项，然后获取返回的输出项列表。

Responses 被设计为可单独使用，但你也可以结合 prompt 和 conversation 对象一起使用，以存储上下文和配置。

### 请求示例

#### Python



#### Run object

```python
# Replace the illustrative IDs and URLs below with your own resource values.
import time

from openai import OpenAI

openai = OpenAI()
thread_id = "thread_123"
assistant_id = "asst_123"

run = openai.beta.threads.runs.create(
    thread_id=thread_id,
    assistant_id=assistant_id,
)

while run.status in ("queued", "in_progress"):
    time.sleep(1)
    run = openai.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
```

#### Response object

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

openai = OpenAI()
conversation_id = "conv_123"

response = openai.responses.create(
    model="gpt-6-astra",
    input=[{"role": "user", "content": "What are the 5 Ds of dodgeball?"}],
    conversation=conversation_id,
)
```



#### Go



#### Run object (Go)

```go
run, err := client.Beta.Threads.Runs.New(context.Background(), "thread_abc123", openai.BetaThreadRunNewParams{
	AssistantID: "asst_abc123",
})
if err != nil {
	panic(err)
}
for run.Status == openai.RunStatusQueued || run.Status == openai.RunStatusInProgress {
	time.Sleep(time.Second)
	run, err = client.Beta.Threads.Runs.Get(context.Background(), "thread_abc123", run.ID)
	if err != nil {
		panic(err)
	}
}
```

#### Response object (Go)

```go
_, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: "gpt-6-astra",
	Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
		responses.ResponseInputItemParamOfMessage("What are the 5 Ds of dodgeball?", responses.EasyInputMessageRoleUser),
	}},
	Conversation: responses.ResponseNewParamsConversationUnion{OfString: openai.String("conv_abc123")},
})
if err != nil {
	panic(err)
}
```



#### JavaScript



#### Run object (JavaScript)

```javascript
import { setTimeout } from "node:timers/promises";
import OpenAI from "openai";

const client = new OpenAI();
// Replace these illustrative IDs with your own resources.
const threadId = "thread_123";
const assistantId = "asst_123";
let run = await client.beta.threads.runs.create(threadId, {
  assistant_id: assistantId,
});
while (run.status === "queued" || run.status === "in_progress") {
  await setTimeout(1000);
  run = await client.beta.threads.runs.retrieve(run.id, {
    thread_id: threadId,
  });
}
console.log(run.status);
```

#### Response object (JavaScript)

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

const client = new OpenAI();
const conversationId = "conv_123";

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [{ role: "user", content: "What are the five Ds of dodgeball?" }],
  conversation: conversationId,
});

console.log(response.output_text);
```



### 响应示例



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

## 迁移你的集成

按照下面的迁移步骤，从 Assistants API 迁移到 Responses API，不会丢失任何功能支持。

### 1. Create prompts from your assistants

1. 确定你应用中最重要的助手对象。
1. 在仪表板中找到它们并点击 `Create prompt`.

这会将每个现有的助手对象转换为提示对象。

可复用的提示对象也即将被弃用。如果你使用此迁移
  路径，请查看 [prompts deprecation
  timeline](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 再决定是否在长期集成中采用
  提示对象。

### 2. 将新的用户聊天迁移到 conversations 和 responses

使用 Conversations API 和 Responses API 开启新对话。若需保留更早的对话历史，请使用你的应用已存储的消息。

下方示例展示了在停用前如何迁移会话历史。Assistants API 中用于获取会话消息的调用已不再可用；请改用已存储的消息。

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

openai = OpenAI()
messages = []
thread_id = "thread_123"

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
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
thread_id = "thread_123"
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
      {
        type: type,
        text: part.text.value
      }
    when OpenAI::Models::Beta::Threads::ImageURLContentBlock
      {
        type: :input_image,
        image_url: part.image_url.url,
        detail: part.image_url.detail
      }
    end
  end
  items << {
    role: message.role,
    content: content
  }
end
conversation = client.conversations.create(
  items: items
)
puts(conversation.id)
```


## 比较完整示例

以下是同时使用 Assistants API 和 Responses API 的几个集成示例，方便你了解两者的对比。

### 用户聊天应用



Assistants API

```python
# Replace the illustrative IDs and URLs below with your own resource values.
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

    example_assistant_id = "asst_123"
    run = openai.beta.threads.runs.create(
        assistant_id=example_assistant_id,
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
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
assistant_id = "asst_123"
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
  { content: messages.data&.first&.content }
end

puts(
  handle_message.call(
    session_id: "example-session",
    content: "What are the five Ds of dodgeball?"
  )
)
```


  

  

    
Responses API

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import express from "express";
import OpenAI from "openai";

const app = express();
const client = new OpenAI();
const conversationsBySession = new Map();

app.use(express.json());

app.post("/messages", async (request, response) => {
  const { content, session_id: sessionId } = request.body ?? {};
  if (
    typeof content !== "string" ||
    !content.trim() ||
    typeof sessionId !== "string" ||
    !sessionId.trim()
  ) {
    response.status(400).json({
      error: "content and session_id must be non-empty strings.",
    });
    return;
  }

  let conversationIdPromise = conversationsBySession.get(sessionId);

  if (!conversationIdPromise) {
    conversationIdPromise = client.conversations
      .create()
      .then((conversation) => conversation.id)
      .catch((error) => {
        conversationsBySession.delete(sessionId);
        throw error;
      });
    conversationsBySession.set(sessionId, conversationIdPromise);
  }
  const conversationId = await conversationIdPromise;

  const promptId = "pmpt_123";

  const result = await client.responses.create({
    prompt: { id: promptId },
    input: [{ role: "user", content }],
    conversation: conversationId,
  });

  response.json({ content: result.output_text });
});

app.listen(Number(process.env.OPENAI_EXAMPLE_PORT ?? 8000), "127.0.0.1");
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
conversations_by_session: dict[str, str] = {}


@app.post("/messages")
async def message(message: Message):
    conversation_id = conversations_by_session.get(message.session_id)
    if conversation_id is None:
        conversation_id = openai.conversations.create().id
        conversations_by_session[message.session_id] = conversation_id

    example_prompt_id = "pmpt_123"
    response = openai.responses.create(
        prompt={"id": example_prompt_id},
        input=[{"role": "user", "content": message.content}],
        conversation=conversation_id,
    )

    return {"content": response.output_text}
```

```go
func main() {
	client := openai.NewClient()
	server := &http.Server{
		Addr:              "127.0.0.1:8000",
		Handler:           newChatHandler(client),
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}

func newChatHandler(client openai.Client) http.Handler {
	var mutex sync.Mutex
	type sessionConversation struct {
		ready        chan struct{}
		id           string
		err          error
		responseSlot chan struct{}
	}
	conversationsBySession := map[string]*sessionConversation{}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /messages", func(w http.ResponseWriter, r *http.Request) {
		var message struct {
			Content   string `json:"content"`
			SessionID string `json:"session_id"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&message); err != nil || strings.TrimSpace(message.Content) == "" || strings.TrimSpace(message.SessionID) == "" {
			http.Error(w, "content and session_id must be non-empty strings", 400)
			return
		}
		// A demo session map. Bind session IDs to authenticated users in your application.
		mutex.Lock()
		session, exists := conversationsBySession[message.SessionID]
		if !exists {
			session = &sessionConversation{ready: make(chan struct{}), responseSlot: make(chan struct{}, 1)}
			conversationsBySession[message.SessionID] = session
		}
		mutex.Unlock()
		if !exists {
			go func() {
				// Creation belongs to the shared session, not the first HTTP request.
				ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
				defer cancel()
				conversation, err := client.Conversations.New(ctx, conversations.ConversationNewParams{})
				session.err = err
				if err == nil {
					session.id = conversation.ID
				}
				mutex.Lock()
				if err != nil {
					delete(conversationsBySession, message.SessionID)
				}
				close(session.ready)
				mutex.Unlock()
			}()
		}
		select {
		case <-r.Context().Done():
			http.Error(w, "Request cancelled", http.StatusRequestTimeout)
			return
		case <-session.ready:
		}
		if session.err != nil {
			http.Error(w, "Could not create conversation", http.StatusInternalServerError)
			return
		}
		// Serialize responses within this conversation; waiting requests can cancel.
		select {
		case session.responseSlot <- struct{}{}:
			defer func() { <-session.responseSlot }()
		case <-r.Context().Done():
			http.Error(w, "Request cancelled", http.StatusRequestTimeout)
			return
		}
		if r.Context().Err() != nil {
			http.Error(w, "Request cancelled", http.StatusRequestTimeout)
			return
		}
		// Replace this illustrative stored prompt ID with your prompt.
		result, err := client.Responses.New(r.Context(), responses.ResponseNewParams{
			Prompt: responses.ResponsePromptParam{
				ID: "pmpt_123",
			},
			Input: responses.ResponseNewParamsInputUnion{
				OfString: openai.String(message.Content),
			},
			Conversation: responses.ResponseNewParamsConversationUnion{
				OfString: openai.String(session.id),
			},
		})
		if err != nil || result.Status != responses.ResponseStatusCompleted {
			http.Error(w, "Could not create response", 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(map[string]string{
			"content": result.OutputText(),
		}); err != nil {
			log.Print(err)
		}
	})
	return mux
}
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
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
    prompt: { id: "pmpt_123" },
    input: [
      {
        role: :user,
        content: content
      }
    ],
    conversation: conversation_id
  )
  { content: response.output_text }
end

puts(
  handle_message.call(
    session_id: "example-session",
    content: "What are the five Ds of dodgeball?"
  )
)
```