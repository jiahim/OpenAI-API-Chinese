# 压缩

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 概述

为了支持长时间运行的交互，你可以使用压缩来减少上下文
大小，同时保留后续轮次所需的状态。

随着对话增长，压缩可帮助你平衡质量、成本和延迟。

## 服务端压缩

你可以在 Responses create 请求中启用 服务端 compaction
(`POST /responses` 或 `client.responses.create`)，设置
`context_management` 为 `compact_threshold`.

- 当渲染后的 token 数量超过配置的阈值时，服务端
  会运行 服务端 压缩（compaction）。
- 在此模式下，无需 `/responses/compact` 额外调用。
- 响应流中包含加密的压缩条目。
- ZDR 说明：当你为 Responses 创建请求设置 `store=false`
  时，服务端 压缩对 ZDR 友好。

返回的压缩项会将先前关键状态和推理延续到
下一次运行，且使用的 token 更少。它是不透明的，不用于
人类阅读理解。

对于无状态的输入数组链式调用，按常规方式追加输出项。如果你正在
使用 `previous_response_id`，则每轮只传入新的用户消息。在这两种情况下，压缩项都会
携带下一个上下文窗口所需的内容。

延迟建议：在将输出项追加到先前的输入项之后，你可以
丢弃最近一个压缩项之前的条目，以使请求体积更小、降低长尾延迟。最新
的压缩项会携带继续对话所需的必要上下文。如果你使用
链式调用，请勿手动裁剪。
`previous_response_id` 链式调用，请勿手动裁剪。

## 用户旅程

1. 像往常一样调用 `/responses` ，但需要传入 `context_management` ，并
   `compact_threshold` 启用 服务端压缩。
2. 当响应流式返回时，如果上下文大小超过阈值，服务端会
   触发一次压缩过程，并在同一条流中输出一个压缩输出项，
   然后在继续推理前裁剪上下文。
3. 使用一种模式继续你的循环：无状态的输入数组链接（将
   输出（包括压缩项）追加到你的下一个输入数组中），或者
   `previous_response_id` 链接（每轮只传入新的用户消息，并
   将该 ID 一并传递下去）。

<a id="server-side-compaction-user-flow"></a>

## 用户流程示例

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const client = new OpenAI();

/** @type {import("openai/resources/responses/responses").ResponseInput} */
const conversation = [
  {
    type: "message",
    role: "user",
    content: "Let's begin a long coding task.",
  },
];

const response = await client.responses.create({
  model: "gpt-5.3-codex",
  input: conversation,
  store: false,
  context_management: [{ type: "compaction", compact_threshold: 200_000 }],
});

conversation.push(...toResponseInputItems(response.output));
console.log(response.output_text);
```

```python
conversation = [
    {
        "type": "message",
        "role": "user",
        "content": "Let's begin a long coding task.",
    }
]

while keep_going:
    response = client.responses.create(
        model="gpt-5.3-codex",
        input=conversation,
        store=False,
        context_management=[{"type": "compaction", "compact_threshold": 200000}],
    )

    conversation.extend(response.output)

    conversation.append(
        {
            "type": "message",
            "role": "user",
            "content": get_next_user_input(),
        }
    )
```

```go
package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	conversation := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Let's begin a long coding task.", responses.EasyInputMessageRoleUser),
	}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
			Model: "gpt-5.3-codex",
			Store: openai.Bool(false),
			Input: responses.ResponseNewParamsInputUnion{OfInputItemList: conversation},
			ContextManagement: []responses.ResponseNewParamsContextManagement{{
				Type: "compaction", CompactThreshold: openai.Int(200000),
			}},
		})
		if err != nil {
			panic(err)
		}
		conversation = append(conversation, outputAsInput(response.Output)...)
		fmt.Println(response.OutputText())
		if !scanner.Scan() {
			break
		}
		conversation = append(conversation,
			responses.ResponseInputItemParamOfMessage(scanner.Text(), responses.EasyInputMessageRoleUser),
		)
	}
	if err := scanner.Err(); err != nil {
		panic(err)
	}
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
import java.util.List;
import java.util.Map;

var conversation = new ArrayList<ResponseInputItem>();
conversation.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Let's begin a long coding task.")
            .build()));

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.3-codex")
        .inputOfResponse(conversation)
        .store(false)
        .putAdditionalBodyProperty(
            "context_management",
            JsonValue.from(List.of(Map.of("type", "compaction", "compact_threshold", 200000))))
        .build();

var response = client.responses().create(params);
response.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(conversation::add);
conversation.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Now implement the next step.")
            .build()));

client
    .responses()
    .create(params.toBuilder().inputOfResponse(conversation).build())
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
conversation = [{
  type: :message,
  role: :user,
  content: "Let's begin a long coding task."
}]

response = client.responses.create(
  model: "gpt-5.3-codex",
  input: conversation,
  store: false,
  context_management: [{type: :compaction, compact_threshold: 200_000}]
)
conversation.concat(response.output)
conversation << {
  type: :message,
  role: :user,
  content: "Now implement the next step."
}
next_response = client.responses.create(
  model: "gpt-5.3-codex",
  input: conversation,
  store: false,
  context_management: [{type: :compaction, compact_threshold: 200_000}]
)
puts(next_response.output_text)
```


## 独立的紧凑端点

如需显式控制，可使用
[独立的 compact 接口](https://developers.openai.com/api/reference/resources/responses/methods/compact) 在
长时间运行的智能体工作流中进行无状态压缩。

该接口完全无状态，且兼容 ZDR。

你发送一个完整的上下文窗口（消息、工具以及其他项），该接口
会返回一个压缩后的新上下文窗口，你可以将其传递给下一次
`/responses` 调用。

返回的压缩窗口包含一个加密的压缩项，用于以更少的 token
传递先前的关键状态和推理。该项是不透明的，
不应被人类解读。

注意：压缩后的窗口通常不只包含压缩项
本身，也可能包含上一个窗口中保留的项。

输出处理：不要裁剪 `/responses/compact` 输出。返回的窗口
就是规范的下一上下文窗口，因此请将其原样传入下一次 `/responses`
调用。

### 独立压缩的用户旅程

1. 使用 `/responses` 按常规方式发送包含用户消息、
   助手输出和工具交互的输入项。
2. 当上下文窗口变大时，调用 `/responses/compact` 以生成一个
   新的压缩后上下文窗口。你发送给 `/responses/compact`
   的窗口仍必须符合模型的上下文窗口限制。
3. 对于后续的 `/responses` 调用，将返回的压缩后窗口
   （包括压缩项）作为输入传递，而不是传递整个会话记录。

<a id="standalone-compact-endpoint-user-flow"></a>

### 用户流程示例

```javascript
import OpenAI from "openai";

const client = new OpenAI();

/** @type {import("openai/resources/responses/responses").ResponseInput} */
const conversation = [{ role: "user", content: "Plan a trip to Kyoto." }];

const compacted = await client.responses.compact({
  model: "gpt-6-astra",
  input: conversation,
});

/** @type {import("openai/resources/responses/responses").ResponseInput} */
const nextInput = [
  ...compacted.output.map(
    (item) =>
      /** @type {import("openai/resources/responses/responses").ResponseInputItem} */ (
        item
      )
  ),
  { role: "user", content: "Add two more days to the itinerary." },
];

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: nextInput,
  store: false,
});

console.log(response.output_text);
```

```python
# Full window collected from prior turns
long_input_items_array = [{"role": "user", "content": "Plan a trip to Kyoto."}]

# 1) Compact the current window
compacted = client.responses.compact(
    model="gpt-6-astra",
    input=long_input_items_array,
)

# 2) Start the next turn by appending a new user message
next_input = [
    *compacted.output,  # Use compact output as-is
    {
        "type": "message",
        "role": "user",
        "content": user_input_message(),
    },
]

next_response = client.responses.create(
    model="gpt-6-astra",
    input=next_input,
    store=False,  # Keep the flow ZDR-friendly
)
```

```go
package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	longInputItems := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Plan a trip to Kyoto.", responses.EasyInputMessageRoleUser),
	}
	compacted, err := client.Responses.Compact(context.Background(), responses.ResponseCompactParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseCompactParamsInputUnion{OfResponseInputItemArray: longInputItems},
	})
	if err != nil {
		panic(err)
	}
	scanner := bufio.NewScanner(os.Stdin)
	if !scanner.Scan() {
		return
	}
	nextInput := append(outputAsInput(compacted.Output),
		responses.ResponseInputItemParamOfMessage(scanner.Text(), responses.EasyInputMessageRoleUser),
	)
	nextResponse, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Store: openai.Bool(false),
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: nextInput},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(nextResponse.OutputText())
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCompactParams;
import com.openai.models.responses.ResponseCompactionItemParam;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var compacted =
    client
        .responses()
        .compact(
            ResponseCompactParams.builder()
                .model("gpt-6-astra")
                .input("Plan a trip to Kyoto.")
                .build());
var input = new ArrayList<ResponseInputItem>();
for (var item : compacted.output()) {
  item.message().map(ResponseInputItem::ofResponseOutputMessage).ifPresent(input::add);
  item.reasoning().map(ResponseInputItem::ofReasoning).ifPresent(input::add);
  item.compaction()
      .map(
          value ->
              ResponseInputItem.ofCompaction(
                  ResponseCompactionItemParam.builder()
                      .id(value.id())
                      .encryptedContent(value.encryptedContent())
                      .build()))
      .ifPresent(input::add);
}
input.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Add restaurant recommendations.")
            .build()));

client
    .responses()
    .create(
        ResponseCreateParams.builder()
            .model("gpt-6-astra")
            .inputOfResponse(input)
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
long_input = [{role: :user, content: "Plan a trip to Kyoto."}]
compaction = client.responses.compact(
  model: "gpt-6-astra",
  input: long_input
)
next_input = [
  *compaction.output,
  {type: :message, role: :user, content: "Add restaurant recommendations."}
]
response = client.responses.create(
  model: "gpt-6-astra",
  input: next_input,
  store: false
)
puts(response.output_text)
```