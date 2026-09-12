# Assistants 迁移指南

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

Assistants API 已于 2026-08-26 正式停用，无法继续使用。请使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 完成新的集成。




感谢所有使用过 Assistants API 的用户。非常感谢你构建的一切以及一路走来的反馈。

请参考本指南将你的集成迁移至 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses).

Responses 更简洁——发送输入项即可获取输出项。使用 Responses API 还能获得更佳的性能以及以下新功能： [深度研究](https://developers.openai.com/api/docs/guides/deep-research), [MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，以及 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use)。这一变更也让你可以管理会话，而无需回传 `previous_response_id`.

### 发生了什么变化？

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

## 从 Assistants 到提示词

Assistants 是持久化的 API 对象，将模型选择、指令和工具声明捆绑在一起——完全通过 API 创建和管理。它们的替代方案 prompts 只能在仪表板中创建，你可以在那里随着产品的开发对其进行版本管理。

### 为什么这很有帮助

- **可移植性与版本管理**：你可以对 prompt 规格进行快照、审阅、对比和回滚。你还可以对 prompt 进行版本管理，这样你的代码只需指向最新版本即可。
- **关注点分离**：你的应用代码现在负责处理编排逻辑（历史裁剪、工具循环、重试），而你的 prompt 则专注于高层行为和约束（系统指引、工具可用性、结构化输出 schema、温度默认值）。
- **Realtime 兼容性**：当你通过 Realtime API 进行连接时，可以复用同一份 prompt 配置，从而在对话、流式传输和低延迟交互会话之间获得统一的行为定义。
- **工具与输出一致性**：使用 prompt 后，你启动的每一个 Responses 或 Realtime 会话都会继承一致的契约，因为 prompt 封装了工具 schema 和结构化输出预期。

### 实用的迁移步骤

1. 识别每个现有智能体的 _指令 + 工具_ 组合。
2. 在仪表板中，将该组合重建为一个命名的提示词。
3. 将提示词 ID（或其导出的规范）存入源代码管理，以便应用代码能够引用稳定的标识符。
4. 在灰度过程中，通过切换提示词 ID 进行 A/B 测试——无需以编程方式创建或删除智能体对象。

把提示词视为一个 **可版本化、用于描述行为特征的配置文件** ，以接入 Responses 或 Realtime API。

---

## 从线程到对话

会话线程是一组存储在 服务端的消息。会话线程只能 _只能_ 存储消息。对话存储的是项（item），其中可以包含消息、工具调用、工具输出以及其他数据。

### 请求示例

#### Python

#### Go

### 响应示例



#### 线程对象

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

#### 对话对象

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

## 从 run 到 response

Run 是针对线程执行的异步进程。请参阅下面的示例。Responses 更简单：提供一组输入项来执行，并返回一组输出项。

Responses 被设计为可单独使用，但你也可以将其与 prompt 和 conversation 对象配合使用，以存储上下文和配置。

### 请求示例

#### Python

#### Go

### 响应示例



#### Run 对象

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

#### Response 对象

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

按照以下迁移步骤，可以从 Assistants API 迁移到 Responses API，且不会失去任何功能支持。

### 1. 基于你的助手创建提示

1. 识别应用中最重要的智能体对象。
1. 在仪表板中找到这些对象并点击 `Create prompt`.

这会基于每个现有的助手对象创建一个 prompt 对象。

可复用的 prompt 对象也即将被弃用。如果你使用此迁移
  方式，请查看 [prompts 弃用
  时间表](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 后再决定是否在长期集成中采用
  prompt 对象。

### 2. 将新的用户聊天迁移到 conversations 和 responses

使用 Conversations API 和 Responses API 开启新聊天。若需保留此前的对话历史，请使用你的应用程序中已存储的消息。

下面的示例展示了在停用前如何迁移线程历史。Assistants API 中用于获取线程消息的调用已不再可用；请改用你已存储的消息。

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


## 对比完整示例

下面是一些同时使用 Assistants API 和 Responses API 的集成示例，方便你了解二者的差异。

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