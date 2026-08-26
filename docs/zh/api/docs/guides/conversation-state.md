# 对话状态

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

OpenAI 提供了几种管理对话状态的方式，这对于在对话中的多条消息或多个轮次之间保留信息非常重要。


  当排查 GPT-5.5 将中间更新视为
    最终答案的情况时，请验证你的集成是否正确保留了助手消息的
    `phase` 字段。详见 [阶段
    参数](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter) ，了解详情。


## 手动管理对话状态

虽然每个文本生成请求都是独立且无状态的，但你仍然可以通过 **多轮对话** ，即向文本生成请求提供额外的消息作为参数来实现。考虑一个敲门笑话：



  手动构建过去的对话

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {role: :user, content: "Knock knock."},
    {role: :assistant, content: "Who's there?"},
    {role: :user, content: "Orange."}
  ]
)

puts(response.output_text)
```



通过交替使用 `user` 和 `assistant` 消息，你可以在一次请求中捕获对话的先前状态。

要手动在生成的响应之间共享上下文，请将模型之前的响应输出作为输入，并将该输入附加到你的下一个请求中。

对于无状态的推理模型请求，请保留响应中的每个 `output` 数组项。Responses API默认返回加密的推理项。重放完整输出可保持推理项和助手 `phase` 值不变。支持持久化推理的模型可以使用 `reasoning.context: "all_turns"` ，将之前轮次中可用的推理结果渲染到下一个样本中。参见 [跨调用保留推理结果](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).

在以下示例中，我们要求模型讲一个笑话，然后请求再讲一个。以这种方式将之前的响应附加到新请求中，有助于确保对话自然，并保留之前交互的上下文。




  使用Responses API手动管理对话状态。

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
  model: "gpt-5.6",
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
  model: "gpt-5.6",
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
    model="gpt-5.6",
    input=history,
    store=False,
)

print(response.output_text)

# Add all response output items, including encrypted reasoning items, to the conversation
history += response.output

history.append({"role": "user", "content": "tell me another"})

second_response = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
		Model: "gpt-5.6",
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
                .model("gpt-5.6")
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
            .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new
history = [{role: :user, content: "Tell me a joke."}]

first = client.responses.create(
  model: "gpt-5.6",
  input: history,
  store: false
)
puts(first.output_text)

history.concat(first.output.map(&:to_h))
history << {role: :user, content: "Tell me another."}

second = client.responses.create(
  model: "gpt-5.6",
  input: history,
  store: false
)
puts(second.output_text)
```



## OpenAI API 用于对话状态

我们的 API 可更轻松地自动管理对话状态，因此你无需在每轮对话中手动传入输入。





### 使用对话 API

该 [对话 API](https://developers.openai.com/api/reference/resources/conversations/methods/create) 可与 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 配合使用，以将对话状态持久化为具有自身持久标识符的长期运行对象。创建对话对象后，你可以跨会话、设备或作业持续使用它。

对话存储条目，这些条目可以是消息、工具调用、工具输出和其他数据。

  创建对话

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


在多轮交互中，你可以将 `conversation` 传入后续响应，以持久化状态并在后续响应之间共享上下文，而无需将多个响应条目链接在一起。

  使用对话和 Responses API 管理对话状态

```python
response = openai.responses.create(
    model="gpt-5.6",
    input=[{"role": "user", "content": "What are the 5 Ds of dodgeball?"}],
    conversation=conversation.id,
)
```

```go
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model: "gpt-5.6",
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
                .model("gpt-5.6")
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
  model: "gpt-5.6",
  conversation: conversation.id,
  input: "What are the five Ds of dodgeball?"
)

puts(response.output_text)
```


### 传递上一响应中的上下文

另一种管理对话状态的方式是通过 `previous_response_id` 参数跨生成的响应共享上下文。此参数允许你链式连接响应并创建线程化对话。

  通过传递之前的响应 ID 来跨轮次链式连接响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: "tell me a joke",
  store: true,
});

console.log(response.output_text);

const secondResponse = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
    input="tell me a joke",
)
print(response.output_text)

second_response = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Tell me a joke."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
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
            ResponseCreateParams.builder().model("gpt-5.6").input("Tell me a joke.").build());

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
                .model("gpt-5.6")
                .input("Explain why this is funny.")
                .previousResponseId(first.id())
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
  input: "Tell me a joke."
)
puts(first.output_text)

second = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "Explain why this is funny."
)
puts(second.output_text)
```


在以下示例中，我们要求模型讲一个笑话。另外，我们要求模型解释为什么它有趣，模型拥有所有必要的上下文来提供良好的响应。


  使用 Responses API 手动管理对话状态

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  input: "tell me a joke",
  store: true,
});

console.log(response.output_text);

const secondResponse = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
    input="tell me a joke",
)
print(response.output_text)

second_response = client.responses.create(
    model="gpt-5.6",
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
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Tell me a joke."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
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
            ResponseCreateParams.builder().model("gpt-5.6").input("Tell me a joke.").build());

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
                .model("gpt-5.6")
                .input("Explain why this is funny.")
                .previousResponseId(first.id())
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
  input: "Tell me a joke."
)
puts(first.output_text)

second = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "Explain why this is funny."
)
puts(second.output_text)
```


#### `previous_response_id` 在 WebSocket 模式下

如果你正在使用 [Responses API的 WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，延续使用与 HTTP 模式相同的 `previous_response_id` 语义，但通过持续套接字以重复事件方式 `response.create` 传递。

连接本地缓存会在内存中保留最近的先前响应，以实现低延迟的延续。当你使用 `stream_id`，时，每个通道可以保留其最新响应； `previous_response_id` 仍控制血统，因此新通道可以从另一通道的响应分叉，而该响应仍可用。如果无法解析未缓存的 ID，请发送新回合并将 `previous_response_id` 设置为 `null` 并传递完整的输入上下文。



  模型响应的数据保留

响应对象默认保存 30 天。它们可以在仪表板的日志 
      [日志](https://platform.openai.com/logs?api=responses) 页面或通过 
      [检索](https://developers.openai.com/api/reference/resources/responses/methods/retrieve) API查看。 
      你可以通过将 `store` 设置为 `false`
      来禁用此行为，在创建 Response 时。

      Conversation objects and items in them are not subject to the 30 day TTL. Any response attached to a conversation will have its items persisted with no 30 day TTL.

      OpenAI does not use data sent via API to train our models without your explicit consent—[learn more](https://developers.openai.com/api/docs/guides/your-data).




即使使用 `previous_response_id`，链中响应的所有先前输入令牌在API中均作为输入令牌计费。



## 管理上下文窗口

理解上下文窗口将帮助你成功创建线程化对话，并在模型交互之间管理状态。

该 **上下文窗口** 是单个请求中可使用的最大令牌数。此最大令牌数包括输入、输出和推理令牌。要了解你的模型的上下文窗口，请参阅 [模型详情](https://developers.openai.com/api/docs/models).

### 管理文本生成的上下文

随着你的输入变得更加复杂，或者你在对话中包含更多轮次，你需要同时考虑 **输出令牌** 和 **上下文窗口** 的限制。模型输入和输出按 [**令牌**](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)，计量，这些令牌从输入中解析出来以分析其内容和意图，并组装以生成逻辑输出。在文本生成请求的生命周期内，模型对令牌使用有限制。

- **输出令牌** 是模型响应提示时生成的令牌。每个模型的 [输出令牌限制](https://developers.openai.com/api/docs/models)。都有所不同。例如， `gpt-4o-2024-08-06` 最多可以生成 16,384 个输出令牌。
- 一个 **上下文窗口** 描述了可用于输入和输出令牌（以及某些模型的， [推理令牌](https://developers.openai.com/api/docs/guides/reasoning)）的总令牌数。比较我们的模型的 [上下文窗口限制](https://developers.openai.com/api/docs/models) 。例如， `gpt-4o-2024-08-06` 的上下文窗口总大小为 128k 令牌。

如果你创建了一个大型提示词（通常是通过为模型添加额外的上下文、数据或示例），你可能会超过模型的上下文窗口限制，这可能导致输出被截断。

使用 [分词器工具](https://platform.openai.com/tokenizer)（基于 [tiktoken 库](https://github.com/openai/tiktoken)，构建）来查看特定文本字符串包含多少个令牌。



例如，当向 API 发出请求时，使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) 并启用推理模型，例如 [o1 模型](https://developers.openai.com/api/docs/guides/reasoning)，以下令牌计数将计入上下文窗口总数：

- 输入 tokens（你包含在 `input` 数组中的输入内容，用于 [Responses API](https://developers.openai.com/api/reference/resources/responses))
- 输出 tokens（针对你的提示生成的 tokens） 
- 推理 tokens（模型用于规划响应所使用的 tokens）


超过上下文窗口限制生成的令牌可能会在 API 响应中被截断。

![上下文窗口可视化](https://cdn.openai.com/API/docs/images/context-window.png)

你可以使用 [令牌生成工具](https://platform.openai.com/tokenizer).

<a id="compaction-advanced"></a>

### 压缩

详细的压缩指导现位于
[Compaction](https://developers.openai.com/api/docs/guides/compaction).

- 对于 `/responses` 与 `context_management` 以及 `compact_threshold`，参见
  [服务端压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction).
- 如需显式控制压缩，请参阅
  [独立压缩端点](https://developers.openai.com/api/docs/guides/compaction#standalone-compact-endpoint)
  以及 [`/responses/compact` API参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

## 后续步骤

如需更多具体示例和用例，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，或进一步了解如何使用API扩展模型能力：

-   [使用 Structured Outputs 接收 JSON 响应](https://developers.openai.com/api/docs/guides/structured-outputs)
-   [通过函数调用扩展模型](https://developers.openai.com/api/docs/guides/function-calling)
-   [启用流式传输以支持实时响应](https://developers.openai.com/api/docs/guides/streaming-responses)
-   [构建一个可以使用计算机的智能体](https://developers.openai.com/api/docs/guides/tools-computer-use)