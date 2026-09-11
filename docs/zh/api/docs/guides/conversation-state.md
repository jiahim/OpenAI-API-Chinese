# 对话状态

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页的 Markdown 版本。

OpenAI 提供了几种管理会话状态的方式，这对于在一次会话中的多条消息或多轮交互之间保留信息非常重要。


  在排查 GPT-5.5 将中间更新视为
    最终答案的情况时，请确认你的集成正确保留了 assistant 消息
    `phase` 字段。详见 [Phase
    参数](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter) 部分。


## 手动管理对话状态

虽然每次文本生成请求都是独立且无状态的，但你仍然可以通过将额外的消息作为参数提供给文本生成请求来实现 **多轮对话** 。考虑下面这个“敲敲门”的笑话示例：



  手动构建一段历史对话

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    { role: "user", content: "knock knock." },
    { role: "assistant", content: "Who's there?" },
    { role: "user", content: "Orange." },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {"role": "user", "content": "knock knock."},
        {"role": "assistant", "content": "Who's there?"},
        {"role": "user", "content": "Orange."},
    ],
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
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage("Knock knock.", responses.EasyInputMessageRoleUser),
				responses.ResponseInputItemParamOfMessage("Who's there?", responses.EasyInputMessageRoleAssistant),
				responses.ResponseInputItemParamOfMessage("Orange.", responses.EasyInputMessageRoleUser),
			},
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("Knock knock.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.ASSISTANT)
                        .content("Who's there?")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("Orange.")
                        .build())))
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

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [
        ResponseItem.CreateUserMessageItem("Knock knock."),
        ResponseItem.CreateAssistantMessageItem("Who's there?"),
        ResponseItem.CreateUserMessageItem("Orange."),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: :user,
      content: "Knock knock."
    },
    {
      role: :assistant,
      content: "Who's there?"
    },
    {
      role: :user,
      content: "Orange."
    }
  ]
)

puts(response.output_text)
```



通过交替使用 `user` 和 `assistant` 消息，你可以在一次模型请求中捕获对话的先前状态。

若要在不同生成响应之间手动共享上下文，请将模型上一次的响应输出作为输入，并将其追加到下一次请求中。

对于无状态的推理模型请求，请保留响应中 `output` 数组里的每一项。Responses API 默认返回加密的推理项。重放完整输出可以保持推理项和助手消息 `phase` 值的完整。支持持久化推理的模型可以使用 `reasoning.context: "all_turns"` 把前面轮次中可用的推理渲染到下一个样本中。参见 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).

在下面的示例中，我们让模型讲一个笑话，然后请求它再讲一个笑话。以这种方式将先前的响应追加到新请求中，有助于确保对话自然流畅，并保留先前交互的上下文。




  使用 Responses API 手动管理对话状态。

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const openai = new OpenAI();

/** @type {OpenAI.Responses.ResponseInput} */
let history = [
  {
    role: "user",
    content: "tell me a joke",
  },
];

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: history,
  store: false,
});

console.log(response.output_text);

// Add replayable output items, including reasoning items, to the history
history.push(...toResponseInputItems(response.output));

history.push({
  role: "user",
  content: "tell me another",
});

const secondResponse = await openai.responses.create({
  model: "gpt-6-astra",
  input: history,
  store: false,
});

console.log(secondResponse.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

history = [{"role": "user", "content": "tell me a joke"}]

response = client.responses.create(
    model="gpt-6-astra",
    input=history,
    store=False,
)

print(response.output_text)

# Add all response output items, including encrypted reasoning items, to the conversation
history += response.output

history.append({"role": "user", "content": "tell me another"})

second_response = client.responses.create(
    model="gpt-6-astra",
    input=history,
    store=False,
)

print(second_response.output_text)
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
	history := responses.ResponseInputParam{
		responses.ResponseInputItemParamOfMessage("tell me a joke", responses.EasyInputMessageRoleUser),
	}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: history},
		Store: openai.Bool(false),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())

	history = append(history, outputAsInput(first.Output)...)
	history = append(history, responses.ResponseInputItemParamOfMessage("tell me another", responses.EasyInputMessageRoleUser))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: history},
		Store: openai.Bool(false),
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
            .content("Tell me a joke.")
            .build()));

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .inputOfResponse(history)
                .store(false)
                .build());
first.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
first.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(history::add);
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Tell me another.")
            .build()));

client
    .responses()
    .create(
        ResponseCreateParams.builder()
            .model("gpt-6-astra")
            .inputOfResponse(history)
            .store(false)
            .build())
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
    ResponseItem.CreateUserMessageItem("Tell me a joke."),
];

CreateResponseOptions options = new("gpt-6-astra", history)
{
    StoredOutputEnabled = false,
    IncludedProperties =
    {
        IncludedResponseProperty.ReasoningEncryptedContent,
    },
};
ResponseResult first = await client.CreateResponseAsync(options);
Console.WriteLine(first.GetOutputText());

history.AddRange(first.OutputItems);
history.Add(ResponseItem.CreateUserMessageItem("Tell me another."));

options = new("gpt-6-astra", history)
{
    StoredOutputEnabled = false,
    IncludedProperties =
    {
        IncludedResponseProperty.ReasoningEncryptedContent,
    },
};
ResponseResult second = await client.CreateResponseAsync(options);
Console.WriteLine(second.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
history = [
  {
    role: :user,
    content: "Tell me a joke."
  }
]

first = client.responses.create(
  model: "gpt-6-astra",
  input: history,
  store: false
)
puts(first.output_text)

history.concat(first.output)
history << {
  role: :user,
  content: "Tell me another."
}

second = client.responses.create(
  model: "gpt-6-astra",
  input: history,
  store: false
)
puts(second.output_text)
```



## OpenAI API 用于对话状态

我们的 API 使对话状态的自动管理变得更加轻松，因此你无需在每次对话轮次中手动传入输入。





### 使用 Conversations API

该 [Conversations API](https://developers.openai.com/api/reference/resources/conversations/methods/create) 与 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 配合使用，以将会话状态持久化为一个具有独立持久标识符的长时间运行对象。创建会话对象后，你可以在不同的会话、设备或任务中持续使用它。

Conversations 存储条目（item），这些条目可以是消息、工具调用、工具输出以及其他数据。

  创建会话

```javascript
const conversation = await client.conversations.create();
```

```python
conversation = openai.conversations.create()
```

```go
conversation, err := client.Conversations.New(context.Background(), conversations.ConversationNewParams{})
if err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

var conversation = client.conversations().create();

System.out.println(conversation.id());
```

```ruby
conversation = client.conversations.create
```


在多轮交互中，你可以将该 `conversation` 传入后续响应，以持久化状态并在后续响应之间共享上下文，而无需将多个响应项串联在一起。

  使用 Conversations 与 Responses API 管理会话状态

```javascript
const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [{ role: "user", content: "What are the five Ds of dodgeball?" }],
  conversation: conversation.id,
});

console.log(response.output_text);
```

```python
response = openai.responses.create(
    model="gpt-6-astra",
    input=[{"role": "user", "content": "What are the 5 Ds of dodgeball?"}],
    conversation=conversation.id,
)
```

```go
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: "gpt-6-astra",
	Conversation: responses.ResponseNewParamsConversationUnion{
		OfString: openai.String(conversation.ID),
	},
	Input: responses.ResponseNewParamsInputUnion{
		OfString: openai.String("What are the five Ds of dodgeball?"),
	},
})
if err != nil {
	panic(err)
}
fmt.Println(response.OutputText())
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

var conversation = client.conversations().create();

var response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .conversation(conversation.id())
                .input("What are the five Ds of dodgeball?")
                .build());

response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
response = client.responses.create(
  model: "gpt-6-astra",
  conversation: conversation.id,
  input: "What are the five Ds of dodgeball?"
)

puts(response.output_text)
```


### 从上一个响应传递上下文

另一种管理对话状态的方式是通过 `previous_response_id` 参数在生成的响应之间共享上下文。该参数可让你将多个响应串联起来，创建线程化的对话。

  通过传递上一次响应的 ID 在多个轮次之间串联响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "tell me a joke",
  store: true,
});

console.log(response.output_text);

const secondResponse = await openai.responses.create({
  model: "gpt-6-astra",
  previous_response_id: response.id,
  input: [{ role: "user", content: "explain why this is funny." }],
  store: true,
});

console.log(secondResponse.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="tell me a joke",
)
print(response.output_text)

second_response = client.responses.create(
    model="gpt-6-astra",
    previous_response_id=response.id,
    input=[{"role": "user", "content": "explain why this is funny."}],
)
print(second_response.output_text)
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
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Tell me a joke."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(first.ID),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Explain why this is funny."),
		},
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
            ResponseCreateParams.builder().model("gpt-6-astra").input("Tell me a joke.").build());

first.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("Explain why this is funny.")
                .previousResponseId(first.id())
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
    "Tell me a joke."
);
Console.WriteLine(first.GetOutputText());

ResponseResult second = await client.CreateResponseAsync(
    "gpt-6-astra",
    "Explain why this is funny.",
    previousResponseId: first.Id
);
Console.WriteLine(second.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

first = client.responses.create(
  model: "gpt-6-astra",
  input: "Tell me a joke."
)
puts(first.output_text)

second = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: first.id,
  input: "Explain why this is funny."
)
puts(second.output_text)
```


在下面的示例中，我们让模型讲一个笑话。随后，我们让模型解释这个笑话为什么好笑，此时模型已具备所需的全部上下文，能够给出良好的回答。


  使用 Responses API 手动管理对话状态

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "tell me a joke",
  store: true,
});

console.log(response.output_text);

const secondResponse = await openai.responses.create({
  model: "gpt-6-astra",
  previous_response_id: response.id,
  input: [{ role: "user", content: "explain why this is funny." }],
  store: true,
});

console.log(secondResponse.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="tell me a joke",
)
print(response.output_text)

second_response = client.responses.create(
    model="gpt-6-astra",
    previous_response_id=response.id,
    input=[{"role": "user", "content": "explain why this is funny."}],
)
print(second_response.output_text)
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
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Tell me a joke."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(first.ID),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Explain why this is funny."),
		},
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
            ResponseCreateParams.builder().model("gpt-6-astra").input("Tell me a joke.").build());

first.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .input("Explain why this is funny.")
                .previousResponseId(first.id())
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
    "Tell me a joke."
);
Console.WriteLine(first.GetOutputText());

ResponseResult second = await client.CreateResponseAsync(
    "gpt-6-astra",
    "Explain why this is funny.",
    previousResponseId: first.Id
);
Console.WriteLine(second.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

first = client.responses.create(
  model: "gpt-6-astra",
  input: "Tell me a joke."
)
puts(first.output_text)

second = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: first.id,
  input: "Explain why this is funny."
)
puts(second.output_text)
```


#### `previous_response_id` 在 WebSocket 模式下

如果你使用 [Responses API 的 WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，延续 使用的语义与 HTTP 模式 `previous_response_id` 相同，但通过持久 socket 上的重复 `response.create` 事件实现。

连接本地缓存会在内存中保留最近的先前响应，以实现低延迟 延续。当你使用 `stream_id`，时，每个 lane 可以保留其最新响应； `previous_response_id` 仍控制 lineage，因此当某个响应仍可用时，新 lane 可以从另一条 lane 上的响应派生。如果无法解析未缓存的 ID，请发送一个将 `previous_response_id` 设置为 `null` 并传入完整输入上下文的新轮次。



  

##### 模型响应的数据保留


      Response objects are saved for 30 days by default. They can be viewed in the dashboard 
      [logs](https://platform.openai.com/logs?api=responses) page or 
      [retrieved](https://developers.openai.com/api/reference/resources/responses/methods/retrieve) via the API. 
      You can disable this behavior by setting `store` to `false`
      when creating a Response.

      Conversation objects and items in them are not subject to the 30 day TTL. Any response attached to a conversation will have its items persisted with no 30 day TTL.

      OpenAI does not use data sent via API to train our models without your explicit consent—[learn more](https://developers.openai.com/api/docs/guides/your-data).
  






即使在使用 `previous_response_id`，时，链中响应之前所有的输入令牌都会作为输入令牌计入 API 的计费。



## 管理上下文窗口

理解上下文窗口将帮助你成功创建线程化对话，并在模型交互之间管理状态。

该 **上下文窗口** 是指单个请求中可使用的最大 token 数量。该最大 token 数包括输入、输出和推理 token。要了解你模型的上下文窗口，请参阅 [模型详细信息](https://developers.openai.com/api/docs/models).

### 管理文本生成的上下文

随着输入变得更加复杂，或者对话中包含更多轮次，你需要同时考虑 **输出 token** 和 **上下文窗口** 限制。模型的输入和输出以 [**tokens**](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)，为单位计量，token 是通过对输入进行解析以分析其内容和意图，并将解析结果组装后生成合乎逻辑的输出。在一次文本生成请求的生命周期内，模型对 token 使用量有限制。

- **输出 tokens** 是模型在响应提示时生成的 tokens。每个模型有不同的 [输出 token 上限](https://developers.openai.com/api/docs/models)。例如， `gpt-4o-2024-08-06` 最多可以生成 16,384 个输出 tokens。
- 一个 **上下文窗口** 描述了输入和输出令牌总共可使用的令牌数（对于某些模型，还包括， [推理令牌](https://developers.openai.com/api/docs/guides/reasoning)）。请对照我们各模型的 [上下文窗口限制](https://developers.openai.com/api/docs/models) 进行比较。例如， `gpt-4o-2024-08-06` 的总上下文窗口为 128k 令牌。

如果你创建了一个较大的提示（通常是通过为模型添加额外的上下文、数据或示例），可能会超出模型分配的上下文窗口，从而导致输出被截断。

使用 [tokenizer 工具](https://platform.openai.com/tokenizer)（基于 [tiktoken 库](https://github.com/openai/tiktoken)，构建）来查看某段文本包含多少 token。



例如，向 API 发起请求时 [Responses API](https://developers.openai.com/api/reference/resources/responses) 使用支持推理的模型（例如 [o1 模型](https://developers.openai.com/api/docs/guides/reasoning)），下面的 token 计数将计入上下文窗口总量：

- 输入 token（你在 `input` 数组中包含的内容，用于 [Responses API](https://developers.openai.com/api/reference/resources/responses))
- 输出 token（模型针对你的提示生成的 token） 
- 推理 token（供模型用于规划响应的 token）


超出上下文窗口限制所生成的 token 可能会在 API 响应中被截断。

![上下文窗口可视化](https://cdn.openai.com/API/docs/images/context-window.png)

你可以使用以下工具估算消息将占用的 token 数量 [tokenizer 工具](https://platform.openai.com/tokenizer).

<a id="compaction-advanced"></a>

### 压缩

详细的压缩指南现已收录于
[压缩](https://developers.openai.com/api/docs/guides/compaction).

- 对于 `/responses` 使用 `context_management` 和 `compact_threshold`,请参阅
  [服务端压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction).
- 若需显式控制压缩,请参阅
  [独立 compact 端点](https://developers.openai.com/api/docs/guides/compaction#standalone-compact-endpoint)
  以及 [`/responses/compact` API 参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

## 后续步骤

如需更具体的示例和用例，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，或详细了解如何使用 API 扩展模型能力：

-   [通过结构化输出接收 JSON 响应](https://developers.openai.com/api/docs/guides/structured-outputs)
-   [通过函数调用扩展模型](https://developers.openai.com/api/docs/guides/function-calling)
-   [启用流式输出以获得实时响应](https://developers.openai.com/api/docs/guides/streaming-responses)
-   [构建一个可操作计算机的智能体](https://developers.openai.com/api/docs/guides/tools-computer-use)