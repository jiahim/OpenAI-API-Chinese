# 迁移到 Responses API

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

该 [Responses API](https://developers.openai.com/api/reference/resources/responses) 是我们全新的 API 原语，是 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 的演进，为你的集成带来更简洁的体验和强大的智能体原语。

**虽然 Chat Completions 仍然受支持，但推荐在新项目中使用 Responses。**

## 关于 Responses API

Responses API 是一个用于构建强大的智能体类应用的统一接口。它包含：

- 内置工具，例如 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search), [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [code interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter)，和 [remote MCPs](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
- 支持多轮对话，可以传入之前的响应，从而获得更准确的推理结果。
- 原生支持文本和图像的多模态输入。

## Responses 的优势

Responses API 相较于 Chat Completions 具有以下几个优势：

- **更佳性能**：使用 GPT-5 等推理模型配合 Responses，相比 Chat Completions 能带来更好的模型智能表现。我们的内部评测显示，在相同的提示词和设置下，SWE-bench 提升了 3%。
- **默认具备智能体能力**：Responses API 是一个智能体循环，允许模型在单次请求中调用多个工具，例如 `web_search`, `image_generation`, `file_search`, `code_interpreter`，远程 MCP 服务器，以及你自己的自定义函数，都可以在一次 API 请求范围内完成。
- **更低的成本**：得益于改进的缓存利用率，成本更低（内部测试中相比 Chat Completions 提升了 40% 至 80%）。
- **有状态的上下文**：使用 `store: true` 在不同轮次之间维护状态，跨轮次保留推理和工具上下文。
- **灵活的输入**：可以传入字符串形式的输入或消息列表；使用 instructions 提供系统级别的指引。
- **加密的推理**：在受益于高级推理的同时，可以选择关闭有状态特性。
- **面向未来**：为未来的模型做好了准备。




| 能力        | Chat Completions API  | Responses API         |
| ------------------- | --------------------- | --------------------- |
| 文本生成     | | |
| 音频               | | 即将推出           |
| 视觉              | | |
| 结构化输出  | | |
| 函数调用    | | |
| 网页搜索          | | |
| 文件搜索         | | |
| 计算机使用        | | |
| 代码解释器    | | |
| MCP                 | | |
| 图像生成    | | |
| 推理摘要 | | |




### 示例

了解 Responses API 在特定场景下与 Chat Completions API 的对比。

#### 消息与条目

这两个 API 都能让我们方便地基于模型生成输出。Chat completions 的调用输入和结果都是一个 _Messages_，而
Responses API 使用 _Items_。Item 是一个多种类型的联合，涵盖了模型可能执行的各种操作。
A `message` 是 Item 的一种类型， `function_call` 或者 `function_call_output`。也是。与 Chat Completions 中的 Message 不同——
在 Message 中多种语义被糅合在同一个对象里——Item 之间彼此独立，能更准确地表示模型上下文的基本单元。

此外，Chat Completions 可以通过 `choices`，参数返回多个并行的生成结果 `n` 。在 Responses 中，我们移除了该参数，每次调用只会返回一个生成结果。



  Chat Completions API

```python
from openai import OpenAI

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-6-astra",
    messages=[
        {
            "role": "user",
            "content": "Write a one-sentence bedtime story about a unicorn.",
        }
    ],
)

print(completion.choices[0].message.content)
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: [
    {
      role: :user,
      content: "Write a one-sentence bedtime story about a unicorn."
    }
  ]
)
puts(completion.choices.fetch(0).message.content)
```

  Responses API

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="Write a one-sentence bedtime story about a unicorn.",
)

print(response.output_text)
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Write a one-sentence bedtime story about a unicorn."
)
puts(response.output_text)
```




当你从 Responses API 拿到响应时，返回字段会略有不同。
它不再返回 `message`，而是返回一个带类型的 `response` 对象，该对象拥有自己的 `id`.
响应默认会被存储。新账号的聊天补全默认也会被存储。
若要在使用任意 API 时禁用存储，请设置 `store: false`.

你从这些 API 收到的对象会略有不同。在 Chat Completions 中，你会收到一个由
`choices`，组成的数组，每个元素包含一个 `message`。在 Responses 中，你会收到一个标记为 `output`.



#### Chat Completions API

```json
{
    "id": "chatcmpl-C9EDpkjH60VPPIB86j2zIhiR8kWiC",
    "object": "chat.completion",
    "created": 1756315657,
    "model": "gpt-5.5",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "Under a blanket of starlight, a sleepy unicorn tiptoed through moonlit meadows, gathering dreams like dew to tuck beneath its silver mane until morning.",
          "refusal": null,
          "annotations": []
        },
        "finish_reason": "stop"
      }
    ],
    ...
}
```

#### Responses API

```json
{
    "id": "resp_68af4030592c81938ec0a5fbab4a3e9f05438e46b5f69a3b",
    "object": "response",
    "created_at": 1756315696,
    "model": "gpt-5.5",
    "output": [
      {
        "id": "rs_68af4030baa48193b0b43b4c2a176a1a05438e46b5f69a3b",
        "type": "reasoning",
        "content": [],
        "summary": []
      },
      {
        "id": "msg_68af40337e58819392e935fb404414d005438e46b5f69a3b",
        "type": "message",
        "status": "completed",
        "content": [
          {
            "type": "output_text",
            "annotations": [],
            "logprobs": [],
            "text": "Under a quilt of moonlight, a drowsy unicorn wandered through quiet meadows, brushing blossoms with her glowing horn so they sighed soft lullabies that carried every dreamer gently to sleep."
          }
        ],
        "role": "assistant"
      }
    ],
    ...
}
```



### 其他差异

- Responses 默认会被存储。新账号的 Chat completions 默认会被存储。若要在任一 API 中禁用存储，请设置 `store: false`.
- [推理](https://developers.openai.com/api/docs/guides/reasoning) 模型在 Responses API 中拥有更丰富的体验，支持 [更强大的工具调用](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)。从 GPT-5.4 开始，Chat Completions 不支持使用 `reasoning_effort` 以外的取值进行工具调用 `none`.
- Structured Outputs API 的结构有所不同。请改用 `response_format`，在 Responses 中使用 `text.format` 。更多信息请参阅 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 指南。
- 函数调用 API 的结构有所不同，无论是请求中的函数配置，还是响应中回传的函数调用。完整差异请参阅 [函数调用指南](https://developers.openai.com/api/docs/guides/function-calling).
- Responses SDK 提供了一个 `output_text` 辅助方法，而 Chat Completions SDK 没有该方法。
- 在 Chat Completions 中，会话状态需要手动管理。Responses API 与 [Conversations API](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses#using-the-conversations-api) 兼容，可用于持久化会话，也支持传入 `previous_response_id` 以轻松串联多个 Responses。

## 从 Chat Completions 迁移

将迁移视为三项相关变更：将请求发送到 `/v1/responses`，从类型化 `output` 数组中读取输出，并选择应用在多轮之间传递状态的方式。

### 1. 更新生成端点

首先将生成端点从 `post /v1/chat/completions` 更新为 `post /v1/responses`.

如果未使用函数或多模态输入，简单的消息输入在两者之间是兼容的：API

复用简单的消息输入

```javascript
/** @type {OpenAI.ChatCompletionMessageParam[] & OpenAI.Responses.ResponseInput} */
const context = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Hello!" },
];

const completion = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages: context,
});

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: context,
});
```

```python
context = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
]

completion = client.chat.completions.create(model="gpt-6-astra", messages=context)

response = client.responses.create(model="gpt-6-astra", input=context)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage("You are a helpful assistant."),
			openai.UserMessage("Hello!"),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage("You are a helpful assistant.", responses.EasyInputMessageRoleSystem),
			responses.ResponseInputItemParamOfMessage("Hello!", responses.EasyInputMessageRoleUser),
		}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

var completion =
    client
        .chat()
        .completions()
        .create(
            ChatCompletionCreateParams.builder()
                .model("gpt-6-astra")
                .addSystemMessage("You are a helpful assistant.")
                .addUserMessage("Hello!")
                .build());
completion.choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.SYSTEM)
                                .content("You are a helpful assistant.")
                                .build()),
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.USER)
                                .content("Hello!")
                                .build())))
                .build());
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Chat;
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";

ChatClient chat = new(model, key);

ChatCompletion completion = await chat.CompleteChatAsync(
    [
        new SystemChatMessage("You are a helpful assistant."),
        new UserChatMessage("Hello!"),
    ]
);
Console.WriteLine(completion.Content[0].Text);

ResponsesClient responses = new(key);

ResponseResult response = await responses.CreateResponseAsync(
    model,
    [
        ResponseItem.CreateSystemMessageItem("You are a helpful assistant."),
        ResponseItem.CreateUserMessageItem("Hello!"),
    ]
);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
messages = [
  {
    role: :system,
    content: "You are a helpful assistant."
  },
  {
    role: :user,
    content: "Hello!"
  }
]

completion = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: messages
)
puts(completion.choices.fetch(0).message.content)

response = client.responses.create(
  model: "gpt-6-astra",
  input: messages
)
puts(response.output_text)
```

```bash
INPUT='[
  { "role": "system", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Hello!" }
]'

curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "{
    \"model\": \"gpt-6-astra\",
    \"messages\": $INPUT
  }"

curl -s https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "{
    \"model\": \"gpt-6-astra\",
    \"input\": $INPUT
  }"
```




Chat Completions

    With Chat Completions, you create a `messages` array and read the model text
    from `completion.choices[0].message.content`.
    Generate text from a model

```javascript
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" },
  ],
});
console.log(completion.choices[0].message.content);
```

```python
from openai import OpenAI

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-6-astra",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
)
print(completion.choices[0].message.content)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()

	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-6-astra",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage("You are a helpful assistant."),
			openai.UserMessage("Hello!"),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-6-astra")
        .addSystemMessage("You are a helpful assistant.")
        .addUserMessage("Hello!")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

ChatCompletion completion = await client.CompleteChatAsync(
    [
        new SystemChatMessage("You are a helpful assistant."),
        new UserChatMessage("Hello!"),
    ]
);

Console.WriteLine(completion.Content[0].Text);
```

```ruby
require "openai"

client = OpenAI::Client.new

completion = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: [
    {
      role: :system,
      content: "You are a helpful assistant."
    },
    {
      role: :user,
      content: "Hello!"
    }
  ]
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
      "model": "gpt-6-astra",
      "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
      ]
  }'
```


  

  

    
Responses

    With Responses, you can separate `instructions` and `input` at the top level
    and read generated text from `response.output_text`.
    Generate text from a model

```javascript
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.responses.create({
  model: "gpt-6-astra",
  instructions: "You are a helpful assistant.",
  input: "Hello!",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra", instructions="You are a helpful assistant.", input="Hello!"
)
print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-6-astra",
		Instructions: openai.String("You are a helpful assistant."),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("Hello!")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Hello!")
        .instructions("You are a helpful assistant.")
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    Instructions = "You are a helpful assistant.",
};
options.InputItems.Add(ResponseItem.CreateUserMessageItem("Hello!"));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  instructions: "You are a helpful assistant.",
  input: "Hello!"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
      "model": "gpt-6-astra",
      "instructions": "You are a helpful assistant.",
      "input": "Hello!"
  }'
```



### 2. 将消息映射到 Items

Chat Completions 使用 `messages` 作为输入和输出。Responses 使用 `input` 和 `output` 类型化 Item 数组。一个 `message` 是一种 Item 类型，与其他 Item 一同存在，例如 `reasoning`, `function_call`，以及 `function_call_output`.

| Chat Completions 概念      | Responses 映射                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `messages[]`                  | `input`，作为字符串或输入 Item 数组                                                        |
| 系统或开发者指引  | 顶层 `instructions`，或在你需要保留已有对话记录时使用兼容的消息 Item |
| 用户消息                  | 包含以下内容的输入消息 Item `role: "user"`                                                              |
| 助手消息             | 中的输出消息 Item `response.output`；将其传回 `input` ，如果你手动管理状态      |
| 工具或函数调用         | 一个 `function_call` 输出 Item                                                                          |
| 工具或函数结果       | 一个 `function_call_output` 与调用关联的输入 Item，其中包含 `call_id`                                  |
| 包含以下内容的多次生成 `n` | 在 Responses 中不可用；如需多个候选输出，请分别发起请求              |

当你只需要最终文本时，使用 SDK `output_text` 辅助方法。当你的流程涉及推理、工具或多模态输出时，请迭代处理 `response.output` 并根据其类型处理每个 Item `type`.

### 3. 更新多轮对话

如果你的应用中存在多轮对话，请更新你的上下文逻辑。Responses 提供了三种常见的状态管理选项：

- 使用 `previous_response_id` 当希望由 OpenAI 管理先前响应的上下文时使用。每次请求都要重新发送稳定的 `instructions` ，因为 `previous_response_id` 不会延续上一次响应的顶层 `instructions`.
- 传递之前的 `output` 项到下一次请求中，当你需要自行管理或裁剪上下文时使用。
- 使用 [Conversations API](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses#using-the-conversations-api) 当你需要持久的会话对象时使用。



Chat Completions

    In Chat Completions, you store the transcript and send the accumulated
    `messages` array on each request.
    Multi-turn conversation

```javascript
/** @type {OpenAI.ChatCompletionMessageParam[]} */
let messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is the capital of France?" },
];
const res1 = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages,
});

messages = messages.concat([res1.choices[0].message]);
messages.push({ role: "user", content: "And its population?" });

const res2 = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages,
});
```

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
]
res1 = client.chat.completions.create(model="gpt-6-astra", messages=messages)

messages += [res1.choices[0].message]
messages += [{"role": "user", "content": "And its population?"}]

res2 = client.chat.completions.create(model="gpt-6-astra", messages=messages)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage("You are a helpful assistant."),
		openai.UserMessage("What is the capital of France?"),
	}

	first, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{Model: "gpt-6-astra", Messages: messages})
	if err != nil {
		panic(err)
	}
	messages = append(messages, openai.AssistantMessage(first.Choices[0].Message.Content), openai.UserMessage("And its population?"))

	second, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{Model: "gpt-6-astra", Messages: messages})
	if err != nil {
		panic(err)
	}
	fmt.Println(second.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

var params =
    ChatCompletionCreateParams.builder()
        .model("gpt-6-astra")
        .addSystemMessage("You are a helpful assistant.")
        .addUserMessage("What is the capital of France?")
        .build();
var first = client.chat().completions().create(params);

var second =
    client
        .chat()
        .completions()
        .create(
            params.toBuilder()
                .addAssistantMessage(first.choices().get(0).message().content().orElseThrow())
                .addUserMessage("And its population?")
                .build());
second.choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

List<ChatMessage> messages =
[
    new SystemChatMessage("You are a helpful assistant."),
    new UserChatMessage("What is the capital of France?"),
];
ChatCompletion first = await client.CompleteChatAsync(messages);

messages.Add(new AssistantChatMessage(first));
messages.Add(new UserChatMessage("And its population?"));
ChatCompletion second = await client.CompleteChatAsync(messages);

Console.WriteLine(second.Content[0].Text);
```

```ruby
require "openai"

client = OpenAI::Client.new
messages = [
  {
    role: :system,
    content: "You are a helpful assistant."
  },
  {
    role: :user,
    content: "What is the capital of France?"
  }
]

first = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: messages
)
messages << {
  role: :assistant,
  content: first.choices.fetch(0).message.content
}
messages << {
  role: :user,
  content: "And its population?"
}

second = client.chat.completions.create(
  model: "gpt-6-astra",
  messages: messages
)

puts(second.choices.fetch(0).message.content)
```


  

  

    
Responses

    With Responses, you can manually pass outputs from one response into the
    input of another.
    Multi-turn conversation

```javascript
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

/** @type {OpenAI.Responses.ResponseInput} */
let context = [{ role: "user", content: "What is the capital of France?" }];

const res1 = await client.responses.create({
  model: "gpt-6-astra",
  input: context,
});

// Append the first response’s output to context
context = context.concat(toResponseInputItems(res1.output));

// Add the next user message
context.push({ role: "user", content: "And its population?" });

const res2 = await client.responses.create({
  model: "gpt-6-astra",
  input: context,
});
```

```python
context = [{"role": "user", "content": "What is the capital of France?"}]
res1 = client.responses.create(
    model="gpt-6-astra",
    input=context,
)

# Append the first response's output to context
context += res1.output

# Add the next user message
context += [{"role": "user", "content": "And its population?"}]

res2 = client.responses.create(
    model="gpt-6-astra",
    input=context,
)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	contextItems := responses.ResponseInputParam{
		responses.ResponseInputItemParamOfMessage("What is the capital of France?", responses.EasyInputMessageRoleUser),
	}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: contextItems},
	})
	if err != nil {
		panic(err)
	}
	contextItems = append(contextItems, outputAsInput(first.Output)...)
	contextItems = append(contextItems, responses.ResponseInputItemParamOfMessage("And its population?", responses.EasyInputMessageRoleUser))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: contextItems},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(second.OutputText())
}

func outputAsInput(output []responses.ResponseOutputItemUnion) []responses.ResponseInputItemUnionParam {
	input := make([]responses.ResponseInputItemUnionParam, 0, len(output))
	for _, item := range output {
		var converted responses.ResponseInputItemUnion
		if err := json.Unmarshal([]byte(item.RawJSON()), &converted); err != nil {
			panic(err)
		}
		input = append(input, converted.ToParam())
	}
	return input
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var history = new ArrayList<ResponseInputItem>();
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("What is the capital of France?")
            .build()));

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder().model("gpt-6-astra").inputOfResponse(history).build());
first.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(history::add);
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("And its population?")
            .build()));

client
    .responses()
    .create(ResponseCreateParams.builder().model("gpt-6-astra").inputOfResponse(history).build())
    .output()
    .stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

List<ResponseItem> history =
[
    ResponseItem.CreateUserMessageItem("What is the capital of France?"),
];

ResponseResult first = await client.CreateResponseAsync("gpt-6-astra", history);
history.AddRange(first.OutputItems);
history.Add(ResponseItem.CreateUserMessageItem("And its population?"));

ResponseResult second = await client.CreateResponseAsync("gpt-6-astra", history);
Console.WriteLine(second.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
context = [
  {
    role: :user,
    content: "What is the capital of France?"
  }
]

first = client.responses.create(
  model: "gpt-6-astra",
  input: context
)
context.concat(first.output)
context << {
  role: :user,
  content: "And its population?"
}

second = client.responses.create(
  model: "gpt-6-astra",
  input: context
)

puts(second.output_text)
```

    You can also use `previous_response_id` to reference the previous response
    and create response chains or forks.
    Multi-turn conversation

```javascript
const res1 = await client.responses.create({
  model: "gpt-6-astra",
  input: "What is the capital of France?",
  store: true,
});

const res2 = await client.responses.create({
  model: "gpt-6-astra",
  input: "And its population?",
  previous_response_id: res1.id,
  store: true,
});
```

```python
res1 = client.responses.create(
    model="gpt-6-astra", input="What is the capital of France?", store=True
)

res2 = client.responses.create(
    model="gpt-6-astra",
    input="And its population?",
    previous_response_id=res1.id,
    store=True,
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Store: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is the capital of France?")},
	})
	if err != nil {
		panic(err)
	}

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		Store:              openai.Bool(true),
		PreviousResponseID: openai.String(first.ID),
		Input:              responses.ResponseNewParamsInputUnion{OfString: openai.String("And its population?")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(second.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("What is the capital of France?")
                .store(true)
                .build());

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("And its population?")
                .previousResponseId(first.id())
                .store(true)
                .build());
second.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

ResponseResult first = await client.CreateResponseAsync(
    "gpt-6-astra",
    "What is the capital of France?"
);
ResponseResult second = await client.CreateResponseAsync(
    "gpt-6-astra",
    "And its population?",
    previousResponseId: first.Id
);

Console.WriteLine(second.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

first = client.responses.create(
  model: "gpt-6-astra",
  input: "What is the capital of France?",
  store: true
)

second = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: first.id,
  input: "And its population?",
  store: true
)

puts(second.output_text)
```



即使使用 `previous_response_id`，链中响应之前的所有输入令牌都会作为输入令牌计费 API。

### 4. 决定何时使用有状态

默认会存储响应。新账户默认也会存储 Chat Completions。要在任意 API 中禁用存储，请设置 `store: false`.

部分组织（例如具有零数据保留 (ZDR) 要求的组织）由于合规性或数据保留策略，无法以有状态方式使用 Responses API。为支持这些场景，OpenAI 提供了加密的推理项，使你能够在保持 工作流 无状态的同时仍受益于推理项。

要禁用有状态但仍利用推理能力：

- 在 `store: false` 的 [store 字段](https://developers.openai.com/api/reference/resources/responses/methods/create#responses_create-store).
- 保留并回放每个返回的推理项。每个项包含 `encrypted_content` 时默认启用。

然后 API 会返回加密后的推理令牌，你可以在后续请求中像普通的推理项一样传回。
对于 ZDR 组织，OpenAI 会强制执行 `store: false` 这一过程是自动的。当请求包含 `encrypted_content`，时，它会在内存中解密，用于生成下一个响应，然后被安全地丢弃。任何新的推理令牌都会立即被加密并返回给你，确保不会保留任何中间状态。

### 5. 更新函数定义和输出

Chat Completions 与 Responses 在函数定义方式上有两处虽然细微但值得注意的区别。

1. 在 Chat Completions 中，函数定义采用外部标记（externally tagged）。在 Responses 中，它们采用内部标记（internally tagged）。
2. 在 Chat Completions 中，函数默认采用非严格模式。在 Responses 中，省略 `strict` 会尝试使用严格模式；如果该模式无法与 schema 兼容，Responses 会回退到非严格、尽力而为的函数调用，并以 `strict: false`。返回已解析的工具。若要在 Responses 中显式保持非严格行为，请设置 `strict: false`.

右侧的 Responses API 函数示例在功能上与左侧的 Chat Completions 示例等价。



#### Chat Completions API

```json
{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Determine weather in my location",
      "strict": true,
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string"
          }
        },
        "additionalProperties": false,
        "required": [
          "location"
        ]
      }
    }
}
```

#### Responses API

```json
{
    "type": "function",
    "name": "get_weather",
    "description": "Determine weather in my location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string"
        }
      },
      "additionalProperties": false,
      "required": [
        "location"
      ]
    }
}
```



#### 遵循函数调用的最佳实践

在 Responses 中，工具调用及其输出是两种不同类型的 Item，它们通过一个 `call_id`。进行关联。详见
该 [函数调用文档](https://developers.openai.com/api/docs/guides/function-calling#function-tool-example) ，了解 Responses 中函数调用工作原理的更多细节。

### 6. 更新 Structured Outputs 定义

在 Responses API 中，Structured Outputs 的定义已从 `response_format` 更新为 `text.format`:



Chat Completions

    Structured Outputs

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-6-astra",
  messages: [
    {
      role: "user",
      content: "Jane, 54 years old",
    },
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "person",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
          },
          age: {
            type: "number",
            minimum: 0,
            maximum: 130,
          },
        },
        required: ["name", "age"],
        additionalProperties: false,
      },
    },
  },
  reasoning_effort: "medium",
});
```

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-6-astra",
    messages=[
        {
            "role": "user",
            "content": "Jane, 54 years old",
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "person",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "minLength": 1},
                    "age": {"type": "number", "minimum": 0, "maximum": 130},
                },
                "required": ["name", "age"],
                "additionalProperties": False,
            },
        },
    },
    reasoning_effort="medium",
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"name": map[string]any{"type": "string", "minLength": 1},
			"age":  map[string]any{"type": "number", "minimum": 0, "maximum": 130},
		},
		"required":             []string{"name", "age"},
		"additionalProperties": false,
	}

	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:           "gpt-6-astra",
		ReasoningEffort: openai.ReasoningEffortMedium,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage("Jane, 54 years old"),
		},
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &shared.ResponseFormatJSONSchemaParam{JSONSchema: shared.ResponseFormatJSONSchemaJSONSchemaParam{
				Name: "person", Strict: openai.Bool(true), Schema: schema,
			}},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.ReasoningEffort;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.util.List;
import java.util.Map;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-6-astra")
        .reasoningEffort(ReasoningEffort.MEDIUM)
        .addUserMessage("Jane, 54 years old")
        .putAdditionalBodyProperty(
            "response_format",
            JsonValue.from(
                Map.of(
                    "type",
                    "json_schema",
                    "json_schema",
                    Map.of(
                        "name",
                        "person",
                        "strict",
                        true,
                        "schema",
                        Map.of(
                            "type",
                            "object",
                            "properties",
                            Map.of(
                                "name",
                                Map.of("type", "string", "minLength", 1),
                                "age",
                                Map.of("type", "number", "minimum", 0, "maximum", 130)),
                            "required",
                            List.of("name", "age"),
                            "additionalProperties",
                            false)))))
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-6-astra";
ChatClient client = new(model, key);

BinaryData schema = BinaryData.FromString(
    """
    {
      "type": "object",
      "properties": {
        "name": { "type": "string", "minLength": 1 },
        "age": { "type": "number", "minimum": 0, "maximum": 130 }
      },
      "required": ["name", "age"],
      "additionalProperties": false
    }
    """
);
ChatCompletionOptions options = new()
{
    ReasoningEffortLevel = ChatReasoningEffortLevel.Medium,
    ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
        "person",
        schema,
        jsonSchemaIsStrict: true
    ),
};

ChatCompletion completion = await client.CompleteChatAsync(
    [new UserChatMessage("Jane, 54 years old")],
    options
);

Console.WriteLine(completion.Content[0].Text);
```

```ruby
require "openai"

client = OpenAI::Client.new
schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1
    },
    age: {
      type: "number",
      minimum: 0,
      maximum: 130
    }
  },
  required: ["name", "age"],
  additionalProperties: false
}

completion = client.chat.completions.create(
  model: "gpt-6-astra",
  reasoning_effort: :medium,
  messages: [
    {
      role: :user,
      content: "Jane, 54 years old"
    }
  ],
  response_format: {
    type: :json_schema,
    json_schema: {
      name: "person",
      strict: true,
      schema: schema
    }
  }
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-6-astra",
  "messages": [
    {
      "role": "user",
      "content": "Jane, 54 years old"
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "person",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
          },
          "age": {
            "type": "number",
            "minimum": 0,
            "maximum": 130
          }
        },
        "required": [
          "name",
          "age"
        ],
        "additionalProperties": false
      }
    }
  },
  "reasoning_effort": "medium"
}'
```

  

  

    
Responses

    Structured Outputs

```javascript
const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "Jane, 54 years old",
  text: {
    format: {
      type: "json_schema",
      name: "person",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
          },
          age: {
            type: "number",
            minimum: 0,
            maximum: 130,
          },
        },
        required: ["name", "age"],
        additionalProperties: false,
      },
    },
  },
});
```

```python
response = client.responses.create(
    model="gpt-6-astra",
    input="Jane, 54 years old",
    text={
        "format": {
            "type": "json_schema",
            "name": "person",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "minLength": 1},
                    "age": {"type": "number", "minimum": 0, "maximum": 130},
                },
                "required": ["name", "age"],
                "additionalProperties": False,
            },
        }
    },
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"name": map[string]any{"type": "string", "minLength": 1},
			"age":  map[string]any{"type": "number", "minimum": 0, "maximum": 130},
		},
		"required":             []string{"name", "age"},
		"additionalProperties": false,
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Jane, 54 years old")},
		Text: responses.ResponseTextConfigParam{Format: responses.ResponseFormatTextConfigUnionParam{
			OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{Name: "person", Schema: schema, Strict: openai.Bool(true)},
		}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseFormatTextJsonSchemaConfig;
import com.openai.models.responses.ResponseTextConfig;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Jane, 54 years old")
        .text(
            ResponseTextConfig.builder()
                .format(
                    ResponseFormatTextJsonSchemaConfig.builder()
                        .name("person")
                        .strict(true)
                        .schema(
                            ResponseFormatTextJsonSchemaConfig.Schema.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of(
                                            "name",
                                            Map.of("type", "string", "minLength", 1),
                                            "age",
                                            Map.of(
                                                "type", "number", "minimum", 0, "maximum",
                                                130))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("name", "age")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

BinaryData schema = BinaryData.FromString(
    """
    {
      "type": "object",
      "properties": {
        "name": { "type": "string", "minLength": 1 },
        "age": { "type": "number", "minimum": 0, "maximum": 130 }
      },
      "required": ["name", "age"],
      "additionalProperties": false
    }
    """
);
CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    TextOptions = new ResponseTextOptions
    {
        TextFormat = ResponseTextFormat.CreateJsonSchemaFormat(
            "person",
            schema,
            jsonSchemaIsStrict: true
        ),
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Jane, 54 years old")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1
    },
    age: {
      type: "number",
      minimum: 0,
      maximum: 130
    }
  },
  required: ["name", "age"],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-6-astra",
  input: "Jane, 54 years old",
  text: {
    format: {
      type: :json_schema,
      name: "person",
      strict: true,
      schema: schema
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-6-astra",
  "input": "Jane, 54 years old",
  "text": {
    "format": {
      "type": "json_schema",
      "name": "person",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
          },
          "age": {
            "type": "number",
            "minimum": 0,
            "maximum": 130
          }
        },
        "required": [
          "name",
          "age"
        ],
        "additionalProperties": false
      }
    }
  }
}'
```



### 7. 更新流式消费者

Chat Completions 流式接口会按增量分块返回，其中包含一个 `delta` 字段。Responses 流式接口使用类型化的服务端发送事件。请更新流消费者，根据每个事件的 `type` 进行分支处理，并按你的 UI 或编排层所需的方式处理事件。

对于文本流式接口，请监听以下类型的事件：

- `response.created`
- `response.output_text.delta`
- `response.completed`
- `error`

函数调用流也可以发出诸如 `response.function_call_arguments.delta` 和 `response.function_call_arguments.done`。等事件。请参阅 [流式 Responses 指南](https://developers.openai.com/api/docs/guides/streaming-responses?api-mode=responses) 和 [Responses 流事件参考](https://developers.openai.com/api/reference/resources/responses).

### 8. 升级到原生工具

如果你的应用有适合使用 OpenAI 原生 [工具](https://developers.openai.com/api/docs/guides/tools)，你可以直接更新你的工具调用来使用 OpenAI 的工具。



Chat Completions

    With Chat Completions, you cannot use OpenAI-hosted tools natively and have
    to write your own tool integration.
    This example uses GPT-5.6 because GPT-6 Astra requires the Responses API
    for tool calling.
    Web search tool

```javascript
async function web_search(query) {
  const res = await fetch(`https://api.example.com/search?q=${query}`);
  const data = await res.json();
  return data.results;
}

const completion = await client.chat.completions.create({
  model: "gpt-5.6",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Who is the current president of France?" },
  ],
  functions: [
    {
      name: "web_search",
      description: "Search the web for information",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  ],
});
```

```python
import requests


def web_search(query):
    r = requests.get(f"https://api.example.com/search?q={query}")
    return r.json().get("results", [])


completion = client.chat.completions.create(
    model="gpt-5.6",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who is the current president of France?"},
    ],
    functions=[
        {
            "name": "web_search",
            "description": "Search the web for information",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        }
    ],
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: "gpt-5.6",
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage("You are a helpful assistant."),
			openai.UserMessage("Who is the current president of France?"),
		},
		Functions: []openai.ChatCompletionNewParamsFunction{{
			Name:        "web_search",
			Description: openai.String("Search the web for information"),
			Parameters: map[string]any{
				"type":       "object",
				"properties": map[string]any{"query": map[string]any{"type": "string"}},
				"required":   []string{"query"},
			},
		}},
		ReasoningEffort: shared.ReasoningEffortNone,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.FunctionParameters;
import com.openai.models.ReasoningEffort;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.util.List;
import java.util.Map;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6")
        .reasoningEffort(ReasoningEffort.NONE)
        .addSystemMessage("You are a helpful assistant.")
        .addUserMessage("Who is the current president of France?")
        .addFunction(
            ChatCompletionCreateParams.Function.builder()
                .name("web_search")
                .description("Search the web for information")
                .parameters(
                    FunctionParameters.builder()
                        .putAdditionalProperty("type", JsonValue.from("object"))
                        .putAdditionalProperty(
                            "properties",
                            JsonValue.from(Map.of("query", Map.of("type", "string"))))
                        .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                        .build())
                .build())
        .build();

client.chat().completions().create(params).choices().stream()
    .map(choice -> choice.message())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new

completion = client.chat.completions.create(
  model: "gpt-5.6",
  reasoning_effort: :none,
  messages: [
    {
      role: :system,
      content: "You are a helpful assistant."
    },
    {
      role: :user,
      content: "Who is the current president of France?"
    }
  ],
  functions: [
    {
      name: "web_search",
      description: "Search the web for information",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"]
      }
    }
  ]
)

puts(completion.choices.fetch(0).message)
```

```bash
curl https://api.example.com/search \
  -G \
  --data-urlencode "q=your+search+term" \
  --data-urlencode "key=$SEARCH_API_KEY"\
```

  

  

    
Responses

    With Responses, you can specify the tools that you want the model to use.
    Web search tool

```javascript
const answer = await client.responses.create({
  model: "gpt-6-astra",
  input: "Who is the current president of France?",
  tools: [{ type: "web_search" }],
});

console.log(answer.output_text);
```

```python
answer = client.responses.create(
    model="gpt-6-astra",
    input="Who is the current president of France?",
    tools=[{"type": "web_search"}],
)

print(answer.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Who is the current president of France?")},
		Tools: []responses.ToolUnionParam{
			responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Who is the current president of France?")
        .addTool(WebSearchTool.builder().type(WebSearchTool.Type.WEB_SEARCH).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new() { Model = "gpt-6-astra" };
options.Tools.Add(ResponseTool.CreateWebSearchTool());
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Who is the current president of France?")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "Who is the current president of France?",
  tools: [{ type: :web_search }]
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Who is the current president of France?",
    "tools": [{"type": "web_search"}]
  }'
```



### 9. 检查常见的迁移错误

将代码从 Chat Completions 迁移到 Responses 时，请留意以下问题：

- 读取 `choices[0].message.content` 而不是 `response.output_text` 或 `response.output`.
- 将每一个 `output` 条目视为一条消息。推理、工具和函数调用都是独立的 Item 类型。
- 在手动将上下文延续到下一次响应时，丢弃推理、函数调用或函数调用输出 Item。
- 发送函数结果时缺少匹配的 `call_id`.
- 使用 `response_format` 在 Responses 请求中，而不是 `text.format`.
- 复用 Chat Completions 流式分块处理代码，而不处理类型化的 Responses 事件。
- 假设 `previous_response_id` 会免除先前上下文的计费。响应链中之前的输入 token 仍会作为输入 token 计费。

## 渐进式上线检查清单

Chat Completions 仍受支持，因此你可以一次迁移一个用户流程。

- [ ] 从一个简单的文本生成工作流开始。
- [ ] 更新端点、请求体和输出处理逻辑。
- [ ] 决定该工作流使用 `previous_response_id`、手动 Item 回放，还是 Conversations API。
- [ ] 如果工作流是无状态的或 ZDR，请添加 `store: false` ，并在需要跨轮次延续推理上下文时包含加密的推理项。
- [ ] 迁移函数定义，并验证函数调用输出是否包含正确的 `call_id`.
- [ ] 将 Structured Outputs 模式从 `response_format` 迁移到 `text.format`.
- [ ] 更新流式消费方以处理类型化的 Responses 事件。
- [ ] 用 OpenAI 托管工具替换合适的自定义编排，以适配 工作流。
- [ ] 在将更多流量路由到 Responses 之前，对比行为、延迟、token 使用量和错误。

我们建议随着时间推移将所有工作流迁移到 Responses API，以利用最新的 OpenAI 功能和改进。

## Assistants API

根据来自 [Assistants API](https://developers.openai.com/api/reference/resources/beta/subresources/assistants) beta 的开发者反馈，我们将关键改进整合进了 Responses API，以提升其灵活性、运行速度与易用性。Responses API 代表了在 OpenAI 上构建智能体的未来方向。

Assistants API 已于 2026 年 8 月 26 日正式下线，且不再可用。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以将你的集成更新到 Responses API。