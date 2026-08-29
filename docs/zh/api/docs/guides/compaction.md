# 压缩

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述

为了支持长时间运行的交互，你可以使用压缩来减少上下文
大小，同时保留后续轮次所需的状态。

随着对话增长，压缩可帮助你平衡质量、成本和延迟。

## 服务端压缩

你可以在 Responses 创建请求中启用服务端压缩
(`POST /responses` 或 `client.responses.create`)通过设置
`context_management` 使用 `compact_threshold`.

- 当渲染后的 token 数量超过配置的阈值时，服务端
  会执行 服务端 压缩。
- 无需单独 `/responses/compact` 在此模式下发起调用。
- 响应流中会包含加密的压缩条目。
- ZDR 说明：当你将 服务端 压缩设置为 `store=false`
  在 Responses 创建请求中时，该压缩对 ZDR 友好。

返回的压缩条目会将先前关键状态和推理带入
下一次运行，且使用的 token 更少。该条目是不透明的，无需
人工解读。

对于无状态的输入数组链接，照常追加输出条目。如果你
使用 `previous_response_id`，则每次只传入新的用户消息。在这两种
情况下，压缩条目都会承载下一个窗口所需的上下文。

延迟提示：在将输出条目追加到先前的输入条目之后，你可以
丢弃最近压缩条目之前的条目，以保持请求
体积更小并降低长尾延迟。最新压缩条目承载着
继续对话所需的必要上下文。如果你使用
`previous_response_id` 链接，请勿手动裁剪。

## 用户旅程

1. 像往常一样调用 `/responses` ，但传入 `context_management` ，并附带
   `compact_threshold` 以启用服务端压缩。
2. 在响应流式传输过程中，如果上下文大小超过阈值，服务端
   会触发一次压缩过程，在同一流中输出一个压缩输出项，
   并在继续推理前裁剪上下文。
3. 用统一模式延续你的循环：无状态输入数组链式调用（将
   输出（包括压缩项）追加到下一次输入数组），或者
   `previous_response_id` 链式调用（每轮只传入新的用户消息，并
   在后续轮次中传递该 ID）。

<a id="server-side-compaction-user-flow"></a>

## 示例用户流程

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


## 独立紧凑端点

如需进行显式控制，请使用
[独立的 compact 接口](https://developers.openai.com/api/reference/resources/responses/methods/compact) 在长时间运行的工作流中进行
无状态的上下文压缩。

该接口完全无状态且兼容 ZDR。

你发送一个完整的上下文窗口（消息、工具以及其他项），该
接口会返回一个新的已压缩上下文窗口，你可以将其传递给下一次
`/responses` 调用。

返回的已压缩窗口包含一个加密的压缩项，该项使用更少的 token
携带先前的关键状态与推理信息。它是不透明的，并不需要
人类可读。

注意：已压缩的窗口通常不仅仅包含压缩
项，它还可以包含来自上一个窗口的保留项。

输出处理：不要裁剪 `/responses/compact` 输出。返回的窗口
是规范的下一次上下文窗口，因此请将其原样传递给下一次 `/responses`
调用。

### 独立压缩的用户旅程

1. 使用 `/responses` 正常方式，发送的输入项包含用户消息、
   助手输出和工具交互。
2. 当你的上下文窗口变大时，调用 `/responses/compact` 来生成一个
   新的压缩后上下文窗口。你发送给 `/responses/compact`
   的内容仍必须适合你模型的上下文窗口。
3. 对于后续的 `/responses` 调用，传入返回的压缩后窗口
   （包含压缩项）作为输入，而不是完整的对话记录。

<a id="standalone-compact-endpoint-user-flow"></a>

### 示例用户流程

```python
# Full window collected from prior turns
long_input_items_array = [{"role": "user", "content": "Plan a trip to Kyoto."}]

# 1) Compact the current window
compacted = client.responses.compact(
    model="gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
		Model: "gpt-5.6",
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
                .model("gpt-5.6")
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
            .model("gpt-5.6")
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
  model: "gpt-5.6",
  input: long_input
)
next_input = [
  *compaction.output,
  {type: :message, role: :user, content: "Add restaurant recommendations."}
]
response = client.responses.create(
  model: "gpt-5.6",
  input: next_input,
  store: false
)
puts(response.output_text)
```