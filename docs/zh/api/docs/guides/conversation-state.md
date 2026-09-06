# 对话状态

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

OpenAI 提供几种方式来管理对话状态，这对于在一次对话的多个消息或轮次之间保留信息非常重要。


  在排查 GPT-5.5 将中间更新视为
    最终答案的情况时，请验证你的集成正确保留了 assistant 消息
    `phase` 字段。详见 [Phase
    参数](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter) 。


## 手动管理对话状态

虽然每次文本生成请求都是独立且无状态的，但你仍然可以实现 **多轮对话** 只需将额外的消息作为参数提供给文本生成请求即可。举个例子，一个“敲敲门”的笑话：



  手动构建历史对话

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
    {role: :user, content: "Knock knock."},
    {role: :assistant, content: "Who's there?"},
    {role: :user, content: "Orange."}
  ]
)

puts(response.output_text)
```



通过交替使用 `user` 和 `assistant` 消息，你可以在一次请求中捕获对话的先前状态。

若要在多次生成的回复之间手动共享上下文，请将模型先前的回复输出作为输入，并将其追加到下一次请求中。

对于无状态的推理模型请求，请保留响应中 `output` 数组里的每一项。Responses API 默认返回加密的推理项。重放完整的输出可保持推理项和助手 `phase` 值的完整性。支持持久化推理的模型可以使用 `reasoning.context: "all_turns"` 将之前轮次中可用的推理渲染到下一次采样中。详见 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).

在下面的示例中，我们让模型讲一个笑话，然后再请求它讲另一个笑话。以这种方式将先前的回复追加到新请求中，有助于让对话感觉自然并保留之前交互的上下文。




  使用 Responses API 手动管理对话状态。

```javascript
import OpenAI from "openai";

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

// Add all response output items, including reasoning items, to the history
history.push(...response.output);

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
history = [{role: :user, content: "Tell me a joke."}]

first = client.responses.create(
  model: "gpt-6-astra",
  input: history,
  store: false
)
puts(first.output_text)

history.concat(first.output)
history << {role: :user, content: "Tell me another."}

second = client.responses.create(
  model: "gpt-6-astra",
  input: history,
  store: false
)
puts(second.output_text)
```



## OpenAI API（用于会话状态）

我们的 API 可以更轻松地自动管理对话状态，因此你无需在每次对话轮次中手动传递输入。





### 使用 Conversations API

该 [会话 API](https://developers.openai.com/api/reference/resources/conversations/methods/create) 与 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 配合使用，将对话状态作为具有自身持久标识符的长期运行对象进行持久化。创建会话对象后，你可以在不同会话、设备或任务中持续使用它。

会话会存储条目，这些条目可以是消息、工具调用、工具输出以及其他数据。

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


在多轮交互中，你可以将 `conversation` 传入后续响应中，以持久化状态并在后续响应之间共享上下文，而无需将多个响应条目串联起来。

  使用会话和 Responses API 管理对话状态

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


### 从上一响应传递上下文

管理对话状态的另一种方式是通过以下参数在多个生成的回复之间共享上下文 `previous_response_id` 参数。使用该参数可以将多个回复串联起来，形成一次线程化的对话。

  通过传入上一次回复的 ID，在多个轮次之间串联回复

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


在下面的示例中，我们让模型讲一个笑话。随后，我们再请模型解释这个笑话为什么有趣，模型此时已具备所需的全部上下文，能够给出良好的回复。


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

如果你使用的是 [the Responses API WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode),延续 使用与 HTTP 模式相同的 `previous_response_id` 语义，但通过一个持久化 socket 并以重复事件的方式实现。 `response.create` 事件。

连接级本地缓存会将最近的先前响应保存在内存中，以便实现低延迟的延续。当你使用 `stream_id`，时，每个 lane 可以保留其最新的响应； `previous_response_id` 仍然控制着 lineage，因此新的 lane 可以从另一个 lane 上的某个响应 fork 出来，只要该响应仍然可用。如果无法解析一个未缓存的 ID，请发送一个将 `previous_response_id` 设为 `null` 的新回合，并传入完整的输入上下文。



  

##### 模型响应的数据保留


      Response objects are saved for 30 days by default. They can be viewed in the dashboard 
      [logs](https://platform.openai.com/logs?api=responses) page or 
      [retrieved](https://developers.openai.com/api/reference/resources/responses/methods/retrieve) via the API. 
      You can disable this behavior by setting `store` to `false`
      when creating a Response.

      Conversation objects and items in them are not subject to the 30 day TTL. Any response attached to a conversation will have its items persisted with no 30 day TTL.

      OpenAI does not use data sent via API to train our models without your explicit consent—[learn more](https://developers.openai.com/api/docs/guides/your-data).
  






即使在使用 `previous_response_id`, 链中响应的所有先前输入令牌都会作为输入令牌计入 API 的费用。



## 管理上下文窗口

理解上下文窗口将帮助你成功创建线程化的对话，并在模型交互之间管理状态。

该 **context window** 是单个请求中可使用的最大 token 数。该最大 token 数包含输入、输出和推理 token。要了解模型的上下文窗口，请参阅 [模型详情](https://developers.openai.com/api/docs/models).

### 管理文本生成的上下文

随着你的输入变得更复杂，或者你在对话中加入更多的轮次，你需要同时考虑 **输出 token** 和 **context window** 的限制。模型的输入和输出以 [**tokens**](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)，为单位进行计量，这些 token 通过解析输入来分析其内容和意图，并被组合起来以生成符合逻辑的输出。模型在单次文本生成请求的生命周期内对 token 使用量有限制。

- **Output tokens** 是模型根据提示生成的 token。每个模型对 [输出 token 的上限不同](https://developers.openai.com/api/docs/models)。例如， `gpt-4o-2024-08-06` 最多可以生成 16,384 个输出 token。
- 一个 **上下文窗口** 指输入和输出 token 合计所能使用的 token 总数（对于部分模型，还包括， [推理 token](https://developers.openai.com/api/docs/guides/reasoning)）。请比较我们各模型的 [上下文窗口上限](https://developers.openai.com/api/docs/models) 。例如， `gpt-4o-2024-08-06` 的总上下文窗口为 128k token。

如果你构造一个较大的提示——通常是通过为模型加入额外的上下文、数据或示例——可能会超出模型分配的上下文窗口限制，从而导致输出被截断。

使用 [tokenizer 工具](https://platform.openai.com/tokenizer)，该工具基于 [tiktoken 库](https://github.com/openai/tiktoken)，构建，可以查看一段文本中包含多少个 token。



例如，向API发起请求时 [Responses API](https://developers.openai.com/api/reference/resources/responses) 使用支持推理的模型，例如 [o1 模型](https://developers.openai.com/api/docs/guides/reasoning)，以下 token 计数将计入上下文窗口总数：

- 输入 tokens（你在 `input` 数组中提供的 [Responses API](https://developers.openai.com/api/reference/resources/responses))
- 输出 tokens（针对你的提示生成的 tokens） 
- 推理 tokens（由模型用于规划响应）


超出上下文窗口限制的令牌可能会在 API 响应中被截断。

![上下文窗口可视化](https://cdn.openai.com/API/docs/images/context-window.png)

你可以使用以下方法估算你的消息将使用的令牌数量 [tokenizer 工具](https://platform.openai.com/tokenizer).

<a id="compaction-advanced"></a>

### 压缩

详细的压缩指南现已移至
[Compaction](https://developers.openai.com/api/docs/guides/compaction).

- 有关 `/responses` 配合 `context_management` 和 `compact_threshold`，请参阅
  [服务端压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction).
- 如需进行显式的压缩控制，请参阅
  [独立的 compact 端点](https://developers.openai.com/api/docs/guides/compaction#standalone-compact-endpoint)
  以及 [`/responses/compact` API 参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

## 下一步

如需更具体的示例和用例，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook),或详细了解如何使用 API 扩展模型能力:

-   [通过 Structured Outputs 获取 JSON 响应](https://developers.openai.com/api/docs/guides/structured-outputs)
-   [通过函数调用扩展模型能力](https://developers.openai.com/api/docs/guides/function-calling)
-   [启用流式输出以获得实时响应](https://developers.openai.com/api/docs/guides/streaming-responses)
-   [构建可操作计算机的 智能体](https://developers.openai.com/api/docs/guides/tools-computer-use)