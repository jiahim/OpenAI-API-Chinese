# 迁移到 Responses API

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

该 [Responses API](https://developers.openai.com/api/reference/resources/responses) 是我们的新API原语，是 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 的演进，为你的集成带来了更高的简洁性和强大的智能体原语。

**虽然 Chat Completions 仍受支持，但所有新项目均推荐使用 Responses。**

## 关于 Responses API 的介绍

Responses API 是一个用于构建强大、智能体类应用（智能体-like applications）的统一接口。它包含：

- 内置工具，例如 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search), [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use), [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter)，以及 [远程 MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).
- 无缝的多轮交互，允许你传递之前的响应以获得更高准确率的推理结果。
- 对文本和图像的原生多模态支持。

## Responses 的优势

与 Chat Completions 相比，Responses API 具有多项优势：

- **更好的性能**：在 Responses 中使用推理模型（如 GPT-5）时，相比 Chat Completions，模型的智能程度会更高。我们的内部评估显示，在相同提示和设置下，SWE-bench 成绩提升了 3%。
- **默认支持智能体**：Responses API 是一个智能体循环，允许模型在一次 `web_search`, `image_generation`, `file_search`, `code_interpreter`，调用多个工具，如远程 MCP 服务器，以及你自己的自定义函数，所有这些都在一个 API 请求的范围内完成。
- **更低的成本**：由于缓存利用率提高，结果成本更低（内部测试中，相比 Chat Completions 提升了 40% 至 80%）。
- **状态化上下文**：使用 `store: true` 来维护回合间的状态，保留回合间的推理和工具上下文。
- **灵活的输入**：传入字符串作为输入或消息列表；使用 instructions 进行系统级指导。
- **加密推理**：可选择退出状态化，同时仍受益于高级推理。
- **面向未来**：为即将推出的模型做好了准备。




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

了解 Responses API 与 Chat Completions API 在特定场景下的对比。

#### 消息与条目

两者 API 都能轻松地从我们的模型生成输出。对 Chat completions 的调用输入和结果是 _Messages_，数组，而
Responses API 使用 _Items_。Item 是多种类型的联合，代表了
模型动作的各种可能性。 `message` 是一种 Item 类型， `function_call` 或 `function_call_output`。也是。与 Chat Completions Message 不同，在那里
许多关注点被捆绑在一个对象中，Items 彼此独立，更好地代表了模型上下文的基本单元。

此外，Chat Completions 可以返回多个并行生成，作为 `choices`，使用 `n` 参数。在 Responses 中，我们移除了这个参数，只保留一个生成。

当你从 Responses API 收到响应时，字段略有不同。
而不是 `message`，你会收到一个类型化的 `response` 对象，它有自己 `id`.
Responses 默认被存储。对于新账户，Chat completions 默认被存储。
要禁用存储，当使用任一 API 时，设置 `store: false`.

你从这些 API 接收回的对象会略有不同。在 Chat Completions 中，你会收到一个
`choices`，数组，每个包含一个 `message`。在 Responses 中，你会收到一个标记为“Items”的数组 `output`.



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

- 响应默认存储。新账号的聊天补全默认存储。要在这两个 API 中禁用存储，请设置 `store: false`.
- [推理](https://developers.openai.com/api/docs/guides/reasoning) 模型在 Responses API 中有更丰富的体验，包括 [改进的工具使用](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)。从 GPT-5.4 开始，Chat Completions 不支持使用 `reasoning_effort` 以外的值进行工具调用 `none`.
- Structured Outputs API 的形状不同。而不是 `response_format`，使用 `text.format` 在 Responses 中。更多信息请参阅 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 指南。
- 函数调用 API 的形状不同，无论是请求中的函数配置，还是响应中返回的函数调用。完整差异见 [函数调用指南](https://developers.openai.com/api/docs/guides/function-calling).
- Responses SDK 有一个 `output_text` 辅助功能，而 Chat Completions SDK 没有。
- 在 Chat Completions 中，对话状态必须手动管理。Responses API 与 [Conversations API](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses#using-the-conversations-api) 兼容，支持持久对话，或者能够传递 `previous_response_id` 以轻松将 Responses 链接在一起。

## 从 Chat Completions 迁移

将迁移视为三项相关更改：向 `/v1/responses`，发送请求，从类型化 `output` 数组读取输出，并选择你的应用程序如何在轮次之间传递状态。

### 1. 更新生成端点

首先，将你的生成端点从 `post /v1/chat/completions` 更新为 `post /v1/responses`.

如果你未使用函数或多模态输入，简单的消息输入在这两个 API 之间是兼容的：

复用简单消息输入

```javascript
/** @type {OpenAI.ChatCompletionMessageParam[] & OpenAI.Responses.ResponseInput} */
const context = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Hello!" },
];

const completion = await client.chat.completions.create({
  model: "gpt-5.6",
  messages: context,
});

const response = await client.responses.create({
  model: "gpt-5.6",
  input: context,
});
```

```python
context = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
]

completion = client.chat.completions.create(model="gpt-5.6", messages=context)

response = client.responses.create(model="gpt-5.6", input=context)
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
		Model: "gpt-5.6",
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
		Model: "gpt-5.6",
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
                .model("gpt-5.6")
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
                .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new
messages = [
  {role: :system, content: "You are a helpful assistant."},
  {role: :user, content: "Hello!"}
]

completion = client.chat.completions.create(
  model: "gpt-5.6",
  messages: messages
)
puts(completion.choices.fetch(0).message.content)

response = client.responses.create(
  model: "gpt-5.6",
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
    \"model\": \"gpt-5.6\",
    \"messages\": $INPUT
  }"

curl -s https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "{
    \"model\": \"gpt-5.6\",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
        .addSystemMessage("You are a helpful assistant.")
        .addUserMessage("Hello!")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new

completion = client.chat.completions.create(
  model: "gpt-5.6",
  messages: [
    {role: :system, content: "You are a helpful assistant."},
    {role: :user, content: "Hello!"}
  ]
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
      "model": "gpt-5.6",
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
  model: "gpt-5.6",
  instructions: "You are a helpful assistant.",
  input: "Hello!",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6", instructions="You are a helpful assistant.", input="Hello!"
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
		Model:        "gpt-5.6",
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
        .model("gpt-5.6")
        .input("Hello!")
        .instructions("You are a helpful assistant.")
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
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
      "model": "gpt-5.6",
      "instructions": "You are a helpful assistant.",
      "input": "Hello!"
  }'
```



### 2. 将消息映射到条目

聊天补全接口 使用 `messages` 同时作为输入和输出。响应接口 使用 `input` 和 `output` 类型化 Item 数组。A `message` 是一种 Item 类型，与诸如 `reasoning`, `function_call`，等 Item 并列，以及 `function_call_output`.

| Chat Completions 概念      | Responses 映射                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `messages[]`                  | `input`，作为字符串或输入项数组                                                        |
| 系统或开发者指导  | 顶层 `instructions`，或在需要保留现有对话记录时使用兼容的消息项 |
| 用户消息                  | 包含以下内容的输入消息项 `role: "user"`                                                              |
| 助手消息             | 响应中的输出消息项 `response.output`；将其传回 `input` 如果你手动管理状态      |
| 工具或函数调用         | 一个 `function_call` 输出项                                                                          |
| 工具或函数结果       | 一个 `function_call_output` 通过以下方式链接到调用的输入项 `call_id`                                  |
| 多次生成与 `n` | 在 Responses 中不可用；如需多个候选输出，请分别发起请求              |

当你只需要最终文本时，使用SDK `output_text` 辅助功能。当你的流程使用推理、工具或多模态输出时，迭代 `response.output` 并根据每个项目处理 `type`.

### 3. 更新多轮对话

如果你的应用中有多轮对话，请更新你的上下文逻辑。响应接口 为你提供了三种常见的状态管理选项：

- 使用 `previous_response_id` 当你希望OpenAI管理先前的响应上下文时。每次请求都重新发送稳定的 `instructions` ，因为 `previous_response_id` 不会继承上一个响应的顶层 `instructions`.
- 传递之前的 `output` 项目回到下一个请求，当你需要自己管理或裁剪上下文时。
- 使用 [Conversations API](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses#using-the-conversations-api) 当你需要持久的对话对象时。



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
  model: "gpt-5.6",
  messages,
});

messages = messages.concat([res1.choices[0].message]);
messages.push({ role: "user", content: "And its population?" });

const res2 = await client.chat.completions.create({
  model: "gpt-5.6",
  messages,
});
```

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
]
res1 = client.chat.completions.create(model="gpt-5.6", messages=messages)

messages += [res1.choices[0].message]
messages += [{"role": "user", "content": "And its population?"}]

res2 = client.chat.completions.create(model="gpt-5.6", messages=messages)
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

	first, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{Model: "gpt-5.6", Messages: messages})
	if err != nil {
		panic(err)
	}
	messages = append(messages, openai.AssistantMessage(first.Choices[0].Message.Content), openai.UserMessage("And its population?"))

	second, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{Model: "gpt-5.6", Messages: messages})
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
        .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new
messages = [
  {role: :system, content: "You are a helpful assistant."},
  {role: :user, content: "What is the capital of France?"}
]

first = client.chat.completions.create(
  model: "gpt-5.6",
  messages: messages
)
messages << {role: :assistant, content: first.choices.fetch(0).message.content}
messages << {role: :user, content: "And its population?"}

second = client.chat.completions.create(
  model: "gpt-5.6",
  messages: messages
)

puts(second.choices.fetch(0).message.content)
```


  

  

    
Responses

    With Responses, you can manually pass outputs from one response into the
    input of another.
    Multi-turn conversation

```javascript
/** @type {OpenAI.Responses.ResponseInput} */
let context = [{ role: "user", content: "What is the capital of France?" }];

const res1 = await client.responses.create({
  model: "gpt-5.6",
  input: context,
});

// Append the first response’s output to context
context = context.concat(res1.output);

// Add the next user message
context.push({ role: "user", content: "And its population?" });

const res2 = await client.responses.create({
  model: "gpt-5.6",
  input: context,
});
```

```python
context = [{"role": "user", "content": "What is the capital of France?"}]
res1 = client.responses.create(
    model="gpt-5.6",
    input=context,
)

# Append the first response's output to context
context += res1.output

# Add the next user message
context += [{"role": "user", "content": "And its population?"}]

res2 = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: contextItems},
	})
	if err != nil {
		panic(err)
	}
	contextItems = append(contextItems, outputAsInput(first.Output)...)
	contextItems = append(contextItems, responses.ResponseInputItemParamOfMessage("And its population?", responses.EasyInputMessageRoleUser))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
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
            ResponseCreateParams.builder().model("gpt-5.6").inputOfResponse(history).build());
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
    .create(ResponseCreateParams.builder().model("gpt-5.6").inputOfResponse(history).build())
    .output()
    .stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
context = [{role: :user, content: "What is the capital of France?"}]

first = client.responses.create(
  model: "gpt-5.6",
  input: context
)
context.concat(first.output.map(&:to_h))
context << {role: :user, content: "And its population?"}

second = client.responses.create(
  model: "gpt-5.6",
  input: context
)

puts(second.output_text)
```

    You can also use `previous_response_id` to reference the previous response
    and create response chains or forks.
    Multi-turn conversation

```javascript
const res1 = await client.responses.create({
  model: "gpt-5.6",
  input: "What is the capital of France?",
  store: true,
});

const res2 = await client.responses.create({
  model: "gpt-5.6",
  input: "And its population?",
  previous_response_id: res1.id,
  store: true,
});
```

```python
res1 = client.responses.create(
    model="gpt-5.6", input="What is the capital of France?", store=True
)

res2 = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
		Store: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is the capital of France?")},
	})
	if err != nil {
		panic(err)
	}

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
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
                .model("gpt-5.6")
                .input("What is the capital of France?")
                .store(true)
                .build());

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new

first = client.responses.create(
  model: "gpt-5.6",
  input: "What is the capital of France?",
  store: true
)

second = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "And its population?",
  store: true
)

puts(second.output_text)
```



即使使用 `previous_response_id`，API中链内所有响应之前的输入令牌仍按输入令牌计费。

### 4. 决定何时使用有状态性

响应默认会被存储。对于新账户，聊天补全会话默认会被存储。要在任一 API 中禁用存储，请设置 `store: false`.

某些组织，例如有零数据保留 (ZDR) 要求的组织，由于合规或数据保留政策，无法以有状态方式使用 Responses API。为支持这些情况，OpenAI 提供加密推理项目，让你在保持 工作流 无状态的同时仍能受益于推理项目。

要禁用有状态性但仍利用推理功能，请执行以下操作：

- 设置 `store: false` 在 [store 字段中](https://developers.openai.com/api/reference/resources/responses/methods/create#responses_create-store).
- 保存并重放每个返回的推理项。每个项都包含 `encrypted_content` 默认情况下，当你创建响应时。

随后，API 将返回推理令牌的加密版本，你可以像传递常规推理条目一样，在后续请求中将其传回。
对于 ZDR 组织，OpenAI 会强制 `store: false` 自动执行。当请求包含 `encrypted_content`，时，它会在内存中被解密，用于生成下一个响应，然后被安全丢弃。任何新生成的推理令牌都会立即被加密并返回给你，确保不会持久化任何中间状态。

### 5. 更新函数定义和输出

在 Chat Completions 与 Responses 之间，函数的定义方式存在两个细微但值得注意的差异。

1. 在 Chat Completions 中，函数定义采用外部标记。在 Responses 中，它们采用内部标记。
2. 在 Chat Completions 中，函数默认是非严格的。在 Responses 中，省略 `strict` 会尝试严格模式；如果架构无法兼容，Responses 会回退到非严格、尽力而为的函数调用，并返回解析后的工具及 `strict: false`。为了在 Responses 中明确保持非严格行为，请设置 `strict: false`.

右侧的 Responses API 函数示例在功能上等同于左侧的 Chat Completions 示例。



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



#### 遵循函数调用最佳实践

在 Responses 中，工具调用及其输出是两种不同类型的条目，它们通过 `call_id`。进行关联。参见
该 [函数调用文档](https://developers.openai.com/api/docs/guides/function-calling#function-tool-example) 以了解函数调用在 Responses 中如何工作的更多细节。

### 6. 更新结构化输出定义

在 Responses API 中，结构化输出的定义已从 `response_format` 移动到 `text.format`:



Chat Completions

    Structured Outputs

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model:           "gpt-5.6",
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
        .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new
schema = {
  type: "object",
  properties: {
    name: {type: "string", minLength: 1},
    age: {type: "number", minimum: 0, maximum: 130}
  },
  required: ["name", "age"],
  additionalProperties: false
}

completion = client.chat.completions.create(
  model: "gpt-5.6",
  reasoning_effort: :medium,
  messages: [{role: :user, content: "Jane, 54 years old"}],
  response_format: {
    type: :json_schema,
    json_schema: {name: "person", strict: true, schema: schema}
  }
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-5.6",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new
schema = {
  type: "object",
  properties: {
    name: {type: "string", minLength: 1},
    age: {type: "number", minimum: 0, maximum: 130}
  },
  required: ["name", "age"],
  additionalProperties: false
}

response = client.responses.create(
  model: "gpt-5.6",
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
  "model": "gpt-5.6",
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

Chat Completions 流式返回带有 `delta` 字段的增量块。Responses 流式使用类型化服务器发送事件。更新流消费者，使其根据每个事件的 `type` 进行分支，并处理你的 UI 或编排层所需的事件。

对于文本流式传输，请监听以下事件：

- `response.created`
- `response.output_text.delta`
- `response.completed`
- `error`

函数调用流也可能发出诸如 `response.function_call_arguments.delta` 和 `response.function_call_arguments.done`. 参见 [Responses 流式指南](https://developers.openai.com/api/docs/guides/streaming-responses?api-mode=responses) 和 [Responses 流式事件参考](https://developers.openai.com/api/reference/resources/responses).

### 8. 升级到原生工具

如果你的应用有可以受益于 OpenAI 原生 [工具](https://developers.openai.com/api/docs/guides/tools)，的用例，你可以更新你的工具调用来使用 OpenAI 的开箱即用工具。



聊天补全

    With Chat Completions, you cannot use OpenAI-hosted tools natively and have
    to write your own tool integration.
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
    {role: :system, content: "You are a helpful assistant."},
    {role: :user, content: "Who is the current president of France?"}
  ],
  functions: [
    {
      name: "web_search",
      description: "Search the web for information",
      parameters: {
        type: "object",
        properties: {query: {type: "string"}},
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

  

  

    
响应

    With Responses, you can specify the tools that you want the model to use.
    Web search tool

```javascript
const answer = await client.responses.create({
  model: "gpt-5.6",
  input: "Who is the current president of France?",
  tools: [{ type: "web_search" }],
});

console.log(answer.output_text);
```

```python
answer = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
        .input("Who is the current president of France?")
        .addTool(WebSearchTool.builder().type(WebSearchTool.Type.WEB_SEARCH).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "Who is the current president of France?",
  tools: [{type: :web_search}]
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "input": "Who is the current president of France?",
    "tools": [{"type": "web_search"}]
  }'
```



### 9. 检查常见迁移错误

将代码从 Chat Completions 迁移到 Responses 时，请注意以下问题：

- 读取 `choices[0].message.content` 而不是 `response.output_text` 或 `response.output`.
- 将每个 `output` 条目视为消息。推理、工具和函数调用是单独的 Item 类型。
- 在手动将上下文延续到下一个响应时，丢弃推理、函数调用或函数调用输出项。
- 发送函数结果时缺少匹配的 `call_id`.
- 使用 `response_format` 在 Responses 请求中而不是 `text.format`.
- 在未处理类型化 Responses 事件的情况下，复用 Chat Completions 流式块处理程序。
- 假设 `previous_response_id` 会免除先前上下文的计费。响应链中先前的输入 token 仍按输入 token 计费。

## 增量发布检查清单

Chat Completions 仍受支持，因此你可以一次迁移一个用户流程。

- [ ] 从简单的文本生成流程开始。
- [ ] 更新端点、请求体和输出处理。
- [ ] 决定该流程是否使用 `previous_response_id`, 手动 Item 重放，或 Conversations API。
- [ ] 如果流程是无状态或 ZDR，添加 `store: false` 并在推理上下文需要跨轮次延续时包含加密的推理项。
- [ ] 迁移函数定义，并验证函数调用输出包含正确的 `call_id`.
- [ ] 将 Structured Outputs 架构从 `response_format` 迁移到 `text.format`.
- [ ] 更新流式消费者以处理类型化的 Responses 事件。
- [ ] 在 工作流 适用时，用 OpenAI 托管的工具替换自定义编排。
- [ ] 在将更多流量路由到 Responses 之前，比较行为、延迟、token 使用和错误。

我们建议随着时间的推移将所有工作流迁移到 Responses API，以利用最新的 OpenAI 功能和改进。

## 助手 API

基于开发者对 [Assistants API](https://developers.openai.com/api/reference/resources/beta/subresources/assistants) 测试版的反馈，我们已将关键改进整合到 Responses API 中，使其更灵活、更快速且更易用。Responses API 代表了在 OpenAI 上构建 智能体 的未来方向。

现在，Responses API 中具有类似 Assistant 和类似 Thread 的对象。了解更多信息，请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration)。自 2025 年 8 月 26 日起，我们开始弃用 Assistants API，终止日期为 2026 年 8 月 26 日。