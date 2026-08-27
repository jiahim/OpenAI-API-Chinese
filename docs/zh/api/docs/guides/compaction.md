# 压缩

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述

为了支持长时间运行的交互，你可以使用压缩来减少上下文
大小，同时保留后续轮次所需的状态。

随着对话的增长，压缩有助于你在质量、成本和延迟之间取得平衡。

## 服务端压缩

你可以在 Responses 创建请求中启用服务端压缩
(`POST /responses` 或 `client.responses.create`）通过设置
`context_management` 与 `compact_threshold`.

- 当渲染后的 token 数超过配置的阈值时，服务器
  会运行服务端压缩。
- 在此模式下，无需 `/responses/compact` 单独调用。
- 响应流中包含加密的压缩项。
- ZDR 说明：当你在 Responses 创建请求中设置 `store=false`
  时，服务端压缩对 ZDR 友好。

返回的压缩条目会将关键的先前的状态和推理延续到
下一次运行，同时使用更少的令牌。它是不透明的，并非用于
人工解读。

对于无状态输入数组链式调用，照常追加输出条目。如果你正在
使用 `previous_response_id`，每轮仅传递新的用户消息。在两种
情况下，压缩条目都会携带下一窗口所需的上下文。

延迟提示：在将输出条目追加到之前的输入条目后，你可以
丢弃最近一次压缩条目之前的条目，以保持请求
更小并减少长尾延迟。最新的压缩条目携带
继续对话所需的上下文。如果你使用
`previous_response_id` 链式调用，请勿手动修剪。

## 用户旅程

1. 调用 `/responses` 照常进行，但需包含 `context_management` 并配合
   `compact_threshold` 以启用服务端压缩。
2. 当响应流式传输时，若上下文大小超过阈值，服务器将
   触发一次压缩过程，在同一流中发出一个压缩输出项，
   并在继续推理前修剪上下文。
3. 继续你的循环，使用以下两种模式之一：无状态输入数组链式传递（将输出，
   包括压缩项，追加到你的下一个输入数组）或
   `previous_response_id` 链式传递（每轮仅传递新的用户消息，并
   向前携带该 ID）。

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

如需显式控制，请使用
[独立紧凑端点](https://developers.openai.com/api/reference/resources/responses/methods/compact) 进行
长时间运行工作流中的无状态压缩。

该端点完全无状态，且符合 ZDR 要求。

你发送完整的上下文窗口（消息、工具和其他项目），
端点返回一个新的压缩上下文窗口，你可以在下一次
`/responses` 调用时传入。

返回的压缩窗口包含一个加密的压缩项目，它携带
先前的关键状态和推理，并使用更少的令牌。它是透明的，且不
旨在供人类解读。

注意：压缩窗口通常包含的不仅仅是压缩
项目，还可能包含上一窗口中的保留项目。

输出处理：不要删减 `/responses/compact` 输出。返回的窗口
是规范的下一个上下文窗口，因此请将其原样传入下一次 `/responses`
调用。

### 独立压缩的用户旅程

1. 使用 `/responses` 时，可以正常发送包含用户消息、
   智能体输出和工具交互的输入项。
2. 当你的上下文窗口变得很大时，调用 `/responses/compact` 来生成一个
   新的压缩后的上下文窗口。发送给 `/responses/compact`
   的窗口仍必须适配于你模型的上下文窗口。
3. 对于后续的 `/responses` 调用，请将返回的压缩窗口
   （包括压缩项）作为输入，而不是完整的对话记录。

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