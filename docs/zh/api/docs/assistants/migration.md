# Assistants 迁移指南

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在 Responses API 实现功能对齐后，我们已弃用 Assistants API。它将于 2026 年 8 月 26 日关闭。请遵循 [迁移指南](https://developers.openai.com/platform/assistants/migration) 更新你的集成。 [了解更多](https://platform.openai.com/docs/guides/migrate-to-responses).




我们正在从 Assistants API 迁移到新的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) ，以获得更简单、更灵活的思维模型。

响应更简单——发送输入项并取回输出项。使用 Responses API，你还能获得更好的性能和新功能，例如 [深度研究](https://developers.openai.com/api/docs/guides/deep-research), [MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)，以及 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use)。这一变更还让你可以管理对话，而无需来回传递 `previous_response_id`.

### 有什么变化？

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

## 从助手到提示词

助手曾是持久的 API 对象，捆绑了模型选择、指令和工具声明——完全通过 API 创建和管理。其替代品提示词只能在仪表板中创建，你可以在开发产品时对它们进行版本管理。

### 为什么这很有帮助

- **可移植性与版本管理**：你可以对提示词规格进行快照、审查、差异比较和回滚。你也可以对提示词进行版本管理，这样你的代码只需指向最新版本。
- **关注点分离**：你的应用代码现在负责编排（历史记录修剪、工具循环、重试），而你的提示词则专注于高级行为和约束（系统指导、工具可用性、结构化输出模式、温度默认值）。
- **实时兼容性**：当你通过 Realtime API 连接时，可以重用相同的提示词配置，这样在聊天、流式传输和低延迟交互会话中就有了统一的行为定义。
- **工具与输出一致性**：使用提示词，你启动的每个 Responses 或 Realtime 会话都会继承一致的契约，因为提示词封装了工具模式和结构化输出期望。

### 实际的迁移步骤

1. 识别每个现有助手的 _指令 + 工具_ 捆绑包。
2. 在仪表盘中，将该捆绑包重新创建为命名提示词。
3. 将提示词 ID（或其导出的规范）存储在源代码管理中，以便应用程序代码可以引用稳定标识符。
4. 在发布期间，通过交换提示词 ID 进行 A/B 测试——无需以编程方式创建或删除助手对象。

将提示词视为一个可插拔的 **版本化行为配置** ，用于接入 Responses 或 Realtime API。

---

## 从线程到对话

线程是服务端存储的消息集合。线程只能 _存储_ 消息。会话存储条目，条目可包含消息、工具调用、工具输出及其他数据。

### 请求示例

#### Python

#### Go

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

## 从运行到响应

Runs 是针对线程执行的异步过程。请参见下面的示例。Responses 更简单：提供一组要执行的输入项，并返回输出项列表。

Responses 设计为可单独使用，但你也可以将其与提示（prompt）和对话（conversation）对象一起使用，以存储上下文和配置。

### 请求示例

#### Python

#### Go

### 响应示例



#### 运行对象

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

#### 响应对象

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

按照下面的迁移步骤，从 Assistants API 迁移到 Responses API，同时不丢失任何功能支持。

### 1. 根据你的智能体创建提示词

1. 识别你的应用程序中最重要的助手对象。
1. 在仪表板中找到这些对象，然后点击 `Create prompt`.

这将根据每个现有的助手对象创建一个提示词对象。

可复用的提示词对象也正在被弃用。如果你使用此迁移
  路径，请查看 [提示词弃用
  时间线](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 在采用
  长期集成中的提示词对象之前。

### 2. 将新用户聊天迁移到对话和响应

我们不会提供将线程迁移到对话的自动化工具。相反，我们建议将新的用户线程迁移到对话中，并在必要时迁移较旧的线程。

以下是一个你可能如何回填线程的示例：

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


## 比较完整示例

以下是一些同时使用 Assistants API 和 Responses API 的集成示例，以便你了解它们的对比情况。

### 用户聊天应用



助手 API

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