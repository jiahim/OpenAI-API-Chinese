# Compaction

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Overview

To support long-running interactions, you can use compaction to reduce context
size while preserving state needed for subsequent turns.

Compaction helps you balance quality, cost, and latency as conversations grow.

## Server-side compaction

You can enable server-side compaction in a Responses create request
(`POST /responses` or `client.responses.create`) by setting
`context_management` with `compact_threshold`.

- When the rendered token count crosses the configured threshold, the server
  runs server-side compaction.
- No separate `/responses/compact` call is required in this mode.
- The response stream includes the encrypted compaction item.
- ZDR note: server-side compaction is ZDR-friendly when you set `store=false`
  on your Responses create requests.

The returned compaction item carries forward key prior state and reasoning into
the next run using fewer tokens. It is opaque and not intended to be
human-interpretable.

For stateless input-array chaining, append output items as usual. If you are
using `previous_response_id`, pass only the new user message each turn. In both
cases, the compaction item carries context needed for the next window.

Latency tip: After appending output items to the previous input items, you can
drop items that came before the most recent compaction item to keep requests
smaller and reduce long-tail latency. The latest compaction item carries the
necessary context to continue the conversation. If you use
`previous_response_id` chaining, do not manually prune.

## User journey

1. Call `/responses` as usual, but include `context_management` with
   `compact_threshold` to enable server-side compaction.
2. As the response streams, if the context size crosses the threshold, the server
   triggers a compaction pass, emits a compaction output item in the same stream,
   and prunes context before continuing inference.
3. Continue your loop with one pattern: stateless input-array chaining (append
   output, including compaction items, to your next input array) or
   `previous_response_id` chaining (pass only the new user message each turn and
   carry that ID forward).

<a id="server-side-compaction-user-flow"></a>

## Example user flow

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


## Standalone compact endpoint

For explicit control, use the
[standalone compact endpoint](https://developers.openai.com/api/reference/resources/responses/methods/compact) for
stateless compaction in long-running workflows.

This endpoint is fully stateless and ZDR-friendly.

You send a full context window (messages, tools, and other items), and the
endpoint returns a new compacted context window you can pass to your next
`/responses` call.

The returned compacted window includes an encrypted compaction item that carries
forward key prior state and reasoning using fewer tokens. It is opaque and not
intended to be human-interpretable.

Note: the compacted window generally contains more than just the compaction
item. It can also include retained items from the previous window.

Output handling: do not prune `/responses/compact` output. The returned window
is the canonical next context window, so pass it into your next `/responses`
call as-is.

### User journey for standalone compaction

1. Use `/responses` normally, sending input items that include user messages,
   assistant outputs, and tool interactions.
2. When your context window grows large, call `/responses/compact` to generate a
   new compacted context window. The window you send to `/responses/compact`
   must still fit within your model's context window.
3. For subsequent `/responses` calls, pass the returned compacted window
   (including the compaction item) as input instead of the full transcript.

<a id="standalone-compact-endpoint-user-flow"></a>

### Example user flow

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