# 推理模型

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需各文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

**推理模型** 在生成响应之前会使用内部推理 token。这有助于模型进行规划、有效地使用工具、检查替代方案、从歧义中恢复，并解决更困难的多步骤任务。推理模型在复杂问题求解、编码、科学推理以及多步骤智能体工作流方面表现尤为出色。它们也是以下场景的最佳模型： [Codex CLI](https://github.com/openai/codex)，我们轻量级的编码智能体。

从以下模型开始 `gpt-6-astra` 用于大多数推理工作负载。如果希望降低成本，可考虑 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，或 [`gpt-5.6-luna`](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以获得最低的成本和延迟。如果你使用的是 GPT-5.6 模型，请参阅 [推理模式](#reasoning-mode) 中的 `pro` 选项。

**推理模型与 [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses)**。配合使用效果更佳。虽然 Chat Completions API
  仍然受支持，但通过
  使用 Responses 可以获得更好的模型智能和性能。

## 开始使用推理

调用 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 并指定你的推理模型和推理力度：

在 Responses API 中使用推理模型

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;

const response = await openai.responses.create({
  model: "gpt-6-astra",
  reasoning: { effort: "low" },
  input: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

response = client.responses.create(
    model="gpt-6-astra",
    reasoning={"effort": "low"},
    input=[{"role": "user", "content": prompt}],
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
	prompt := `Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.`

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Reasoning: responses.ReasoningParam{
			Effort: responses.ReasoningEffortLow,
		},
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
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
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;

String prompt =
    """
    Write a bash script that takes a matrix represented as a string with format
    '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
    """
        .strip();

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input(prompt)
        .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
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

string prompt =
    """
    Write a bash script that takes a matrix represented as a string with format
    '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
    """;
CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.Low,
    },
};
options.InputItems.Add(ResponseItem.CreateUserMessageItem(prompt));

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
prompt = <<~PROMPT
  Write a bash script that takes a matrix represented as a string with format
  '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
PROMPT

response = client.responses.create(
  model: "gpt-6-astra",
  reasoning: { effort: :low },
  input: prompt
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "reasoning": {"effort": "low"},
    "input": [
      {
        "role": "user",
        "content": "Write a bash script that takes a matrix represented as a string with format \"[1,2],[3,4],[5,6]\" and prints the transpose in the same format."
      }
    ]
  }'
```


## Reasoning effort

该 `reasoning.effort` 参数引导模型在执行任务时的思考深度。

支持的值取决于具体模型，可能包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`。较低的努力值优先考虑速度和更低的 token 使用量，而在较高的努力值下，模型会思考得更充分以输出更高质量的回答。模型还会在不同推理努力值之间自适应地分配推理资源，对简单任务使用更少的 token，对复杂任务则进行更深入的思考。

[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) 不支持 `none` reasoning
  effort。设置 `reasoning.effort` （Responses）或 `reasoning_effort` （Chat
  Completions）为 `none` 会返回 HTTP 400。

请使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行函数
调用。Chat Completions 不支持在 GPT-6 Astra 上进行函数调用。

默认值同样取决于具体模型，而非通用。 `gpt-5.5` 默认为 `medium` 推理努力值。这是体验 `gpt-5.5`’在质量、可靠性和性能之间最佳平衡的推荐起点。

| Effort   | 适用场景                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`   | 对延迟敏感且无法受益于任何推理或多链式工具调用的任务。针对对延迟敏感的使用场景，我们建议先从 `gpt-5.5`，开始尝试，必要时再切换到 `low` （如果需要）。 `none` 。<br /><br />常见使用场景包括语音、快速信息检索和分类。                                                 |
| `low`    | 在适度增加延迟的情况下提供高效推理。适合需要工具使用、规划、搜索或多步骤决策的场景，同时兼顾速度和成本。<br /><br />常见使用场景包括数据分析、起草、面向执行的编码，以及客户支持/聊天助手工作流。                                           |
| `medium` | 当质量和可靠性至关重要，且任务涉及规划、复杂推理与判断时使用。是大多数工作负载的默认配置，并在延迟、性能和成本的帕累托曲线上达到良好平衡。<br /><br />常见使用场景包括智能体式编码、研究、处理电子表格与幻灯片，以及委派长周期任务。 |
| `high`   | 高难度推理、复杂调试、深度规划，以及质量和智能比延迟更重要的关键任务。推荐用于复杂工作流和智能体任务。<br /><br />常见使用场景包括智能体式编码、长周期研究，以及知识工作。根据任务复杂度，建议同时评估 `medium` 和 `high`.     |
| `xhigh`  | 深度研究、异步工作流以及需要长时间运行的智能体任务。仅当你的评估显示其能带来明显收益且值得额外的延迟和成本时再使用。<br /><br />常见使用场景包括安全与代码审查、企业生产力、更深度的研究任务，以及具有挑战性的编码工作流。                                             |
| `max`    | 为最复杂的任务提供最大程度的推理。如果你当前正在使用 `xhigh`，请评估 `max` 是否能带来更强的性能                                                                                                                                                                                                                                 |

在延迟敏感的应用中，为了更快获得首个可见词元，可以让模型先生成一段简短的前言，再继续进行更深入的推理。

部分模型仅支持这些取值中的子集，因此请查看相关的 [模型页面](https://developers.openai.com/api/docs/models) 后再选择相应设置。

## Reasoning mode

GPT-5.6 模型支持 `standard` 和 `pro` 推理模式（在 Responses API 中）。 `standard` 为默认模式。设置 `reasoning.mode` 为 `pro` 适用于需要更多模型工作且可接受更高延迟和 token 用量的困难任务。

推理模式和推理强度彼此独立。模式用于选择标准或 pro 执行方式，而 `reasoning.effort` 则控制模型在该模式下应用的推理程度。如果你省略 `reasoning.effort`,GPT-5.6 默认在两种模式下都使用 `medium` 。

使用 pro 推理模式

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "reasoning": {
      "mode": "pro",
      "effort": "medium"
    },
    "input": "Review this database migration plan and identify potential failure modes."
  }'
```


Pro 模式会汇总为生成最终答案所执行的模型工作，并按所选模型的标准 [token 费率](https://developers.openai.com/api/docs/pricing)。对这些 token 计费。Pro 模式相比标准模式会执行更多模型工作，从而增加 token 用量和成本。现有 Pro 模型 ID 保持其当前行为和定价不变。

## 推理工作原理

推理模型引入了 **推理 tokens** ，作为输入和输出 tokens 之外的补充。这些模型使用这些推理 tokens 来“思考”，拆解提示并考虑生成回复的多种方法。我们的推理模型（例如 API 平台上的 GPT-5.6 和 o-series 模型）支持交错思考，即模型能够在思考前后以及之间生成可见的输出 tokens，并且能够在工具调用之间进行思考。 `gpt-5.5` 和 `gpt-5.4` 支持交错思考，其中模型能够在思考前后以及之间生成可见的输出 tokens，并能够在工具调用之间进行思考。

对于 GPT-5.6 之前发布的模型，在多步对话中的默认行为是保留每一步的输入和输出 tokens，而不会将先前回合的推理内容渲染到下一次采样中。GPT-5.6 模型则默认会渲染先前回合中可用的推理内容。可使用 `reasoning.context` 在支持的模型上选择任一行为。

![包含当前回合上下文的推理 tokens](https://cdn.openai.com/API/docs/images/context-window.png)

虽然推理 tokens 无法通过 接口 查看，但它们仍然占用
  模型的上下文窗口空间，并按 [输出
  tokens](https://openai.com/api/pricing).

## 控制成本

要控制推理模型的成本，你可以通过设置
参数来限制模型生成的总令牌数，包括推理令牌、可见的输出令牌以及不可见的
格式令牌。详见
[`max_output_tokens`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-max_output_tokens)
参数。参见 [输出令牌计数](https://developers.openai.com/api/docs/guides/token-counting#understand-output-token-counts) 了解生成的令牌如何体现在用量和输出限制中的详细信息。

### 管理上下文窗口

在创建响应时，确保上下文窗口中有足够的空间用于推理 tokens 非常重要。根据问题的复杂度，模型可能生成从几百到数万个不等的推理 tokens。实际使用的推理 tokens 数量可在 [响应对象的 usage 对象](https://developers.openai.com/api/reference/resources/responses)，中查看，字段位于 `output_tokens_details`:

```json
{
  "usage": {
    "input_tokens": 75,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 1186,
    "output_tokens_details": {
      "reasoning_tokens": 1024
    },
    "total_tokens": 1261
  }
}
```

上下文窗口长度可在 [模型参考页面](https://developers.openai.com/api/docs/models)，中查看，不同模型快照会有所差异。

### Allocating space for reasoning

如果生成的 token 达到上下文窗口上限或你设置的 `max_output_tokens` 值，你会收到一个带有 `status` 的 `incomplete` 和 `incomplete_details` 为 `reason` 设置为 `max_output_tokens`。的响应。这种情况可能发生在产生任何可见输出 token 之前，意味着你可能为输入和推理 token 付费，却没有收到可见的响应。

为避免这种情况，请确保上下文窗口有足够空间，或调高 `max_output_tokens` 值。OpenAI 建议在开始试验这些模型时，至少为推理和输出预留 25,000 个 token。当你熟悉提示所需的推理 token 数量后，可以相应调整这个缓冲区大小。

处理不完整的响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;

const response = await openai.responses.create({
  model: "gpt-6-astra",
  reasoning: { effort: "medium" },
  input: [
    {
      role: "user",
      content: prompt,
    },
  ],
  max_output_tokens: 300,
});

if (
  response.status === "incomplete" &&
  response.incomplete_details.reason === "max_output_tokens"
) {
  console.log("Ran out of tokens");
  if (response.output_text?.length > 0) {
    console.log("Partial output:", response.output_text);
  } else {
    console.log("Ran out of tokens during reasoning");
  }
}
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

response = client.responses.create(
    model="gpt-6-astra",
    reasoning={"effort": "medium"},
    input=[{"role": "user", "content": prompt}],
    max_output_tokens=300,
)

if (
    response.status == "incomplete"
    and response.incomplete_details.reason == "max_output_tokens"
):
    print("Ran out of tokens")
    if response.output_text:
        print("Partial output:", response.output_text)
    else:
        print("Ran out of tokens during reasoning")
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
	prompt := `Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.`

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:           "gpt-6-astra",
		MaxOutputTokens: openai.Int(300),
		Reasoning: responses.ReasoningParam{
			Effort: responses.ReasoningEffortMedium,
		},
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
		},
	})
	if err != nil {
		panic(err)
	}

	if response.Status == responses.ResponseStatusIncomplete {
		fmt.Println("Ran out of tokens")
		if text := response.OutputText(); text != "" {
			fmt.Println("Partial output:", text)
		}
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStatus;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input(
            "Write a bash script that takes a matrix represented as a string with format "
                + "'[1,2],[3,4],[5,6]' and prints the transpose in the same format.")
        .maxOutputTokens(300)
        .reasoning(Reasoning.builder().effort(ReasoningEffort.MEDIUM).build())
        .build();

var response = client.responses().create(params);
if (response.status().filter(ResponseStatus.INCOMPLETE::equals).isPresent()
    && response
        .incompleteDetails()
        .flatMap(Response.IncompleteDetails::reason)
        .filter(Response.IncompleteDetails.Reason.MAX_OUTPUT_TOKENS::equals)
        .isPresent()) {
  System.out.println("Ran out of tokens");
  response.output().stream()
      .flatMap(item -> item.message().stream())
      .flatMap(message -> message.content().stream())
      .flatMap(content -> content.outputText().stream())
      .forEach(text -> System.out.println("Partial output: " + text.text()));
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    MaxOutputTokenCount = 300,
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.Medium,
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a bash script that transposes a matrix.")
);

ResponseResult response = await client.CreateResponseAsync(options);
if (
    response.Status == ResponseStatus.Incomplete
    && response.IncompleteStatusDetails?.Reason == ResponseIncompleteStatusReason.MaxOutputTokens
)
{
    Console.WriteLine("The response ended before all output tokens were generated.");
    string partialOutput = response.GetOutputText();
    Console.WriteLine(
        string.IsNullOrWhiteSpace(partialOutput)
            ? "Ran out of tokens during reasoning."
            : $"Partial output: {partialOutput}"
    );
}
else if (
    response.Status == ResponseStatus.Incomplete
    && response.IncompleteStatusDetails?.Reason == ResponseIncompleteStatusReason.ContentFilter
)
{
    Console.WriteLine("The response was interrupted by the content filter.");
}
else if (response.Status == ResponseStatus.Completed)
{
    Console.WriteLine(response.GetOutputText());
}
else
{
    throw new InvalidOperationException($"The response ended with status: {response.Status}");
}
```

```ruby
require "openai"

client = OpenAI::Client.new
prompt = <<~PROMPT
  Write a bash script that takes a matrix represented as a string with format
  '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
PROMPT

response = client.responses.create(
  model: "gpt-6-astra",
  max_output_tokens: 300,
  reasoning: { effort: :medium },
  input: prompt
)

if response.status == OpenAI::Responses::ResponseStatus::INCOMPLETE
  puts("Ran out of tokens")
  puts("Partial output: #{response.output_text}") unless response.output_text.empty?
end
```


## 在调用之间保留推理过程

对话状态和推理状态用途不同。跨调用传递消息可为模型提供可见的对话历史。在支持的模型上，持久化的推理还可以让模型将早期轮次中兼容的推理项渲染到下一段上下文中。

持久化的推理提供延续性，但不会暴露模型的原始推理。推理项仍然是不透明的，API 不会返回其推理文本。可设置 `reasoning.context` 以控制模型可使用的可用推理项：

该 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)
  支持
  `all_turns` 并默认使用它。较早的模型默认为
  `current_turn`。省略 `reasoning.context` 或将其设置为
  `auto` 以使用所选模型的默认值。

| 值          | 行为                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auto`         | 使用所选模型的默认值。省略 `reasoning.context` 的效果与 `auto`.                            |
| `current_turn` | 使当前轮次的推理可用，但不会将更早轮次的推理渲染到下一个采样中。    |
| `all_turns`    | 将更早轮次中可用且兼容的推理项渲染到下一个采样中。GPT-5.6 模型支持此值。 |

响应的 `reasoning.context` 字段包含实际使用的模式，为 `current_turn` 或 `all_turns`。请在每次响应时检查此字段以确认模型使用的模式。该设置不会创建原本不可用的推理项。

`all_turns` 仅在请求可以访问较早的响应项时才有效。使用 `previous_response_id`，将响应附加到对话中，或手动重放完整的响应历史。在首次请求时， `current_turn` 和 `all_turns` 行为相同，因为此时不存在较早的推理。

持久化的推理只能在同一模型系列内复用。例如， `gpt-5.6-sol`, `gpt-5.6-terra`，以及 `gpt-5.6-luna` 可以互相复用彼此的推理，但推理不会在 GPT-5.6 和 GPT-5.5 系列之间传递。

当你切换模型系列时，API 会从模型的上下文中省略不兼容的推理，即使在 `reasoning.context` 为 `all_turns`.

### 使用存储的响应继续推理

使用 `previous_response_id` 实现最短的有状态集成：

在 响应接口 中保留之前的推理

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const first = await client.responses.create({
  model: "gpt-5.6",
  input: "Inspect this repository and identify the likely bug.",
  reasoning: { context: "current_turn" },
});

const second = await client.responses.create({
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "Now patch the bug and explain the change.",
  reasoning: { context: "all_turns" },
});

console.log(second.output_text);
```

```python
from openai import OpenAI

client = OpenAI()
model = "gpt-5.6"

first = client.responses.create(
    model=model,
    input="Inspect this repository and identify the likely bug.",
    reasoning={"context": "current_turn"},
)

second = client.responses.create(
    model=model,
    previous_response_id=first.id,
    input="Now patch the bug and explain the change.",
    reasoning={"context": "all_turns"},
)

print(second.output_text)
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
	model := "gpt-5.6"

	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: model,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Inspect this repository and identify the likely bug."),
		},
		Reasoning: responses.ReasoningParam{
			Context: responses.ReasoningContextCurrentTurn,
		},
	})
	if err != nil {
		panic(err)
	}

	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              model,
		PreviousResponseID: openai.String(first.ID),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Now patch the bug and explain the change."),
		},
		Reasoning: responses.ReasoningParam{
			Context: responses.ReasoningContextAllTurns,
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
import com.openai.core.JsonValue;
import com.openai.models.Reasoning;
import com.openai.models.responses.ResponseCreateParams;

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
                .input("Inspect this repository and identify the likely bug.")
                .reasoning(
                    Reasoning.builder()
                        .putAdditionalProperty("context", JsonValue.from("current_turn"))
                        .build())
                .build());

var second =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
                .input("Now patch the bug and explain the change.")
                .previousResponseId(first.id())
                .reasoning(
                    Reasoning.builder()
                        .putAdditionalProperty("context", JsonValue.from("all_turns"))
                        .build())
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
  input: "Inspect this repository and identify the likely bug.",
  reasoning: { context: :current_turn }
)

second = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "Now patch the bug and explain the change.",
  reasoning: { context: :all_turns }
)

puts(second.output_text)
```


使用 `current_turn` 当重放模型已不再需要的旧响应条目时，可以省略较旧推理条目。这些推理条目可以保留在 API 有效负载中以保持连续性，但服务不会将它们渲染到新样本中。这可以减少长时间运行工作流的已渲染上下文。

### 在不使用存储响应的情况下保留推理

当你在无状态模式下创建响应时，响应中 `output` 数组里的推理项默认包含一个 `encrypted_content` 属性。无状态模式适用于 `store` 为 `false` 或当你的组织使用零数据保留 (ZDR) 时。API 仍然接受旧版 `reasoning.encrypted_content` 值的 `include` 参数以保持兼容，但并不要求传入该值。

以下请求在不指定的情况下返回加密的推理内容： `include`:

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "store": false,
    "reasoning": {"effort": "medium"},
    "input": "What is the weather like today?",
    "tools": [ ... function config here ... ]
  }'
```


中的推理项 `output` 数组将包含一个 `encrypted_content` 属性，其中包含可传递给后续调用的加密推理 token。

要使用 `all_turns` 为 `store: false`，请保留每个输出项，追加下一条用户消息，并重放完整的对话历史：

保留推理而不存储响应

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const client = new OpenAI();

/** @type {OpenAI.Responses.ResponseInput} */
const history = [
  {
    role: "user",
    content: "Inspect this repository and identify the likely bug.",
  },
];

const first = await client.responses.create({
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: { context: "current_turn" },
});

// Keep replayable output, including encrypted reasoning and assistant phase.
history.push(...toResponseInputItems(first.output));
history.push({
  role: "user",
  content: "Now patch the bug and explain the change.",
});

const second = await client.responses.create({
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: { context: "all_turns" },
});

console.log(second.output_text);
```

```python
from openai import OpenAI

client = OpenAI()
model = "gpt-5.6"

history = [
    {
        "role": "user",
        "content": "Inspect this repository and identify the likely bug.",
    }
]

first = client.responses.create(
    model=model,
    store=False,
    input=history,
    reasoning={"context": "current_turn"},
)

# Keep every output item, including encrypted reasoning and assistant phase.
history.extend(item.model_dump() for item in first.output)
history.append(
    {
        "role": "user",
        "content": "Now patch the bug and explain the change.",
    }
)

second = client.responses.create(
    model=model,
    store=False,
    input=history,
    reasoning={"context": "all_turns"},
)

print(second.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	history := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Inspect this repository and identify the likely bug.", responses.EasyInputMessageRoleUser),
	}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
		Reasoning: shared.ReasoningParam{Context: shared.ReasoningContextCurrentTurn},
	})
	if err != nil {
		panic(err)
	}
	history = append(history, outputAsInput(first.Output)...)
	history = append(history, responses.ResponseInputItemParamOfMessage(
		"Now patch the bug and explain the change.",
		responses.EasyInputMessageRoleUser,
	))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
		Reasoning: shared.ReasoningParam{Context: shared.ReasoningContextAllTurns},
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
import com.openai.models.Reasoning;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var history = new ArrayList<ResponseInputItem>();
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Inspect this repository and identify the likely bug.")
            .build()));

var first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-5.6")
                .inputOfResponse(history)
                .store(false)
                .reasoning(
                    Reasoning.builder()
                        .putAdditionalProperty("context", JsonValue.from("current_turn"))
                        .build())
                .build());
first.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(history::add);
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Now patch the bug and explain the change.")
            .build()));

client
    .responses()
    .create(
        ResponseCreateParams.builder()
            .model("gpt-5.6")
            .inputOfResponse(history)
            .store(false)
            .reasoning(
                Reasoning.builder()
                    .putAdditionalProperty("context", JsonValue.from("all_turns"))
                    .build())
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
history = [
  {
    role: :user,
    content: "Inspect this repository and identify the likely bug."
  }
]

first = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: { context: :current_turn }
)
history.concat(first.output)
history << {
  role: :user,
  content: "Now patch the bug and explain the change."
}

second = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: { context: :all_turns }
)

puts(second.output_text)
```


### 将推理项保留在上下文中

在进行 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 并使用推理模型时,我们强烈建议你将上次函数调用返回的所有推理项(除了函数的输出之外)一并传回。如果模型连续调用多个函数,你应该传回所有推理项、函数调用项和函数调用输出项,因为最后一条 [Responses API](https://developers.openai.com/api/reference/resources/responses), we highly recommend you pass back any reasoning items returned with the last function call (in addition to the output of your function). If the model calls multiple functions consecutively, you should pass back all reasoning items, function call items, and function call output items, since the last `user` 消息可以让模型继续其推理过程,以最高效的 token 使用方式产生更好的结果。

最简单的做法是将上一次响应中的所有推理项传入下一次请求。我们的系统会智能地忽略与你的函数无关的推理项,只保留与上下文相关的部分。你可以通过 `previous_response_id` 参数传入之前响应中的推理项,或者手动传入所有 [输出](https://developers.openai.com/api/reference/resources/responses#responses/object-output) 将来自先前响应的 items 传入新的 [input](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-input) 中。

对于你可能需要在传递给下一个响应之前截断和优化上下文窗口部分的高级用例，只需确保在最后一个用户消息和你的函数调用输出之间的所有 items 原样传递给下一个响应。这样可以确保模型拥有所需的全部上下文。

查看 [本指南](https://developers.openai.com/api/docs/guides/conversation-state) 了解有关手动上下文管理的更多信息。

## 在对话中途更改推理方式

使用 `configuration_update` 以提高处理困难任务时的推理投入，或降低处理常规追问时的推理投入。在响应之间添加该更新，同时保持请求级别的 `reasoning.effort` 设置不变。这可以保留原始的提示词前缀，以便进行 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching).

配置更新仅由 GPT-6 Astra（`gpt-6-astra`）在
  标准、单智能体模式下提供，仅更改推理 effort。

在下一条用户消息之前，在 HTTP Responses 请求或 WebSocket `input` 请求的 `response.create` 数组中添加以下项：

```json
{
  "type": "configuration_update",
  "reasoning": {
    "effort": "high"
  }
}
```

例如，如果对话以请求级别的 effort 开始 `low`，此更新将选择 `high` 用于下一次响应及后续响应，直到另一次更新将其覆盖。

在追问中提高推理 effort

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const model = "gpt-6-astra";

const first = await client.responses.create({
  model,
  reasoning: { effort: "low" },
  input: "Draft a database migration plan.",
});

const next = await client.responses.create({
  model,
  reasoning: { effort: "low" },
  previous_response_id: first.id,
  input: [
    { type: "configuration_update", reasoning: { effort: "high" } },
    {
      role: "user",
      content: "Analyze the failure modes and propose rollback steps.",
    },
  ],
});
console.log(next.output_text);
```

```python
from openai import OpenAI

client = OpenAI()
model = "gpt-6-astra"

response = client.responses.create(
    model=model,
    reasoning={"effort": "low"},
    input="Draft a database migration plan.",
    store=True,
)
print(response.output_text)

response = client.responses.create(
    model=model,
    previous_response_id=response.id,
    reasoning={"effort": "low"},
    input=[
        {
            "type": "configuration_update",
            "reasoning": {"effort": "high"},
        },
        {
            "role": "user",
            "content": "Analyze the failure modes and propose rollback steps.",
        },
    ],
    store=True,
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
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	ctx := context.Background()
	first, err := client.Responses.New(ctx, responses.ResponseNewParams{
		Store:     openai.Bool(true),
		Model:     "gpt-6-astra",
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortLow},
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String("Draft a database migration plan.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(first.OutputText())
	response, err := client.Responses.New(ctx, responses.ResponseNewParams{
		Model:              "gpt-6-astra",
		PreviousResponseID: openai.String(first.ID),
		// Keep the original request-level setting; the item updates the conversation.
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortLow},
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			{OfConfigurationUpdate: &responses.ResponseConfigurationUpdateItemParam{
				Reasoning: responses.ResponseConfigurationUpdateItemParamReasoning{Effort: shared.ReasoningEffortHigh},
			}},
			responses.ResponseInputItemParamOfMessage("Analyze the failure modes and propose rollback steps.", responses.EasyInputMessageRoleUser),
		}},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseConfigurationUpdateItemParam;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

Response first =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .store(true)
                .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
                .input("Draft a database migration plan.")
                .build());
Response response =
    client
        .responses()
        .create(
            ResponseCreateParams.builder()
                .model("gpt-6-astra")
                .previousResponseId(first.id())
                // Keep the original request-level setting; the item updates the conversation.
                .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
                .inputOfResponse(
                    List.of(
                        ResponseInputItem.ofConfigurationUpdate(
                            ResponseConfigurationUpdateItemParam.builder()
                                .reasoning(
                                    ResponseConfigurationUpdateItemParam.Reasoning.builder()
                                        .effort(ReasoningEffort.HIGH)
                                        .build())
                                .build()),
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.USER)
                                .content(
                                    "Analyze the failure modes and propose rollback steps.")
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
first = client.responses.create(
  model: "gpt-6-astra",
  store: true,
  reasoning: OpenAI::Models::Reasoning.new(effort: :low),
  input: "Draft a database migration plan."
)
puts(first.output_text)
response = client.responses.create(
  model: "gpt-6-astra",
  previous_response_id: first.id,
  # Keep the original request-level setting; the item updates the conversation.
  reasoning: OpenAI::Models::Reasoning.new(effort: :low),
  input: [
    OpenAI::Models::Responses::ResponseConfigurationUpdateItemParam.new(
      reasoning: OpenAI::Models::Responses::ResponseConfigurationUpdateItemParam::Reasoning.new(
        effort: :high
      )
    ),
    OpenAI::Models::Responses::EasyInputMessage.new(
      role: :user,
      content: "Analyze the failure modes and propose rollback steps."
    )
  ]
)
puts(response.output_text)
```


使用 `previous_response_id`，保留更新，或者在手动管理对话历史时 [将其在原始位置重放](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state)。响应的 `reasoning.effort` 仍然报告请求级别的设置，而不是由该更新选择的 effort。

不要将两个 `configuration_update` 项直接相邻放置在对话历史中；API 会拒绝相邻的更新。

不要将配置更新与自动压缩或自动截断结合使用。独立的 `/responses/compact` 端点同样会拒绝包含这些更新的历史记录。

你仍然可以通过在请求中包含 `compaction_trigger` 项来显式压缩历史记录。压缩后，请在下一条用户消息之前添加一个具有所需 effort 的 `/responses` 请求。压缩后，请在下一条用户消息之前添加一个具有所需 effort 的 `configuration_update` 的新条目。

常规的 prompt 缓存要求仍然适用。若要在响应运行期间发送用户指令，请使用 [中途引导](https://developers.openai.com/api/docs/guides/steering).

## 推理摘要

虽然我们不会暴露模型输出的原始推理令牌，但你可以通过以下参数查看模型的推理摘要： `summary` 参数。请参阅我们的 [模型文档](https://developers.openai.com/api/docs/models) ，以查看哪些推理模型支持摘要。

不同的模型支持不同的推理摘要设置。例如，我们的 computer use 模型支持 `concise` 摘要器，而 o4-mini 支持 `detailed`。要访问某模型可用的最详细的摘要器，请将此参数的值设置为 `auto`. `auto` ，对当前大多数推理模型而言等同于 `detailed` ，但未来可能会提供更细粒度的设置。

推理摘要输出是 `summary` 输出项中 `reasoning` [数组的一部分](https://developers.openai.com/api/reference/resources/responses#responses/object-output)。除非你明确选择包含推理摘要，否则该输出不会包含在内。

下面的示例展示了如何发出包含推理摘要的 API 请求。

在 API 响应中包含推理摘要

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: "What is the capital of France?",
  reasoning: {
    effort: "low",
    summary: "auto",
  },
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="What is the capital of France?",
    reasoning={"effort": "low", "summary": "auto"},
)

print(response.output)
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
			OfString: openai.String("What is the capital of France?"),
		},
		Reasoning: responses.ReasoningParam{
			Effort:  responses.ReasoningEffortLow,
			Summary: responses.ReasoningSummaryAuto,
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("What is the capital of France?")
        .reasoning(
            Reasoning.builder()
                .effort(ReasoningEffort.LOW)
                .summary(Reasoning.Summary.AUTO)
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.reasoning().stream())
    .flatMap(reasoning -> reasoning.summary().stream())
    .forEach(summary -> System.out.println(summary.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.Low,
        ReasoningSummaryVerbosity = ResponseReasoningSummaryVerbosity.Auto,
    },
};
options.InputItems.Add(ResponseItem.CreateUserMessageItem("What is the capital of France?"));

ResponseResult response = await client.CreateResponseAsync(options);
foreach (ReasoningResponseItem reasoning in response.OutputItems.OfType<ReasoningResponseItem>())
{
    Console.WriteLine(reasoning.GetSummaryText());
}
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: "What is the capital of France?",
  reasoning: {
    effort: :low,
    summary: :auto
  }
)

puts(response.output)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": "What is the capital of France?",
    "reasoning": {
        "effort": "low",
        "summary": "auto"
    }
  }'
```


此 API 请求将返回一个输出数组，其中包含一条助手消息以及模型在生成该响应时的推理摘要。

```json
[
  {
    "id": "rs_6876cf02e0bc8192b74af0fb64b715ff06fa2fcced15a5ac",
    "type": "reasoning",
    "summary": [
      {
        "type": "summary_text",
        "text": "**Answering a simple question**\n\nI\u2019m looking at a straightforward question: the capital of France is Paris. It\u2019s a well-known fact, and I want to keep it brief and to the point. Paris is known for its history, art, and culture, so it might be nice to add just a hint of that charm. But mostly, I\u2019ll aim to focus on delivering a clear and direct answer, ensuring the user gets what they\u2019re looking for without any extra fluff."
      }
    ]
  },
  {
    "id": "msg_6876cf054f58819284ecc1058131305506fa2fcced15a5ac",
    "type": "message",
    "status": "completed",
    "content": [
      {
        "type": "output_text",
        "annotations": [],
        "logprobs": [],
        "text": "The capital of France is Paris."
      }
    ],
    "role": "assistant"
  }
]
```

在将摘要器与我们最新的推理模型配合使用之前，你可能需要完成
  组织 [验证
  。](https://help.openai.com/en/articles/10910291-api-organization-verification)
  以确保安全部署。在平台设置页面开始使用验证 [platform
  settings page](https://platform.openai.com/settings/organization/general).

## `phase` parameter

对于在 Responses API 中使用 GPT-5.5 和 GPT-5.4 的长时间运行或工具密集型工作流，请使用 assistant 消息 `phase` 字段以避免提前停止和其他异常行为。
`phase` 字段在 API 层面是可选的，但 OpenAI 建议使用它。可使用 `phase: "commentary"` 提供中间的助手更新（例如工具调用前的开场白），并使用 `phase: "final_answer"` 给出最终答案。不要将 `phase` 添加到用户消息中。
使用 `previous_response_id` 通常是最简单的做法，因为先前的助手状态会被保留。如果手动重放助手历史记录，请保留每个原始的 `phase` 值。
缺失或丢失的 `phase` 在这些工作流中可能导致开场白被当作最终答案。有关特定模型的提示指南，请参阅 [提示 GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#prompting-best-practices).

### 往返助手阶段值

往返助手阶段值

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "assistant",
      phase: "commentary",
      content:
        "I’ll inspect the logs and then summarize root cause and remediation.",
    },
    {
      role: "assistant",
      phase: "final_answer",
      content: "Root cause: cache invalidation race.",
    },
    {
      role: "user",
      content: "Great—now give me a rollout-safe fix plan.",
    },
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
        {
            "role": "assistant",
            "phase": "commentary",
            "content": "I’ll inspect the logs and then summarize root cause and remediation.",
        },
        {
            "role": "assistant",
            "phase": "final_answer",
            "content": "Root cause: cache invalidation race.",
        },
        {
            "role": "user",
            "content": "Great—now give me a rollout-safe fix plan.",
        },
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
	commentary := responses.ResponseInputItemParamOfMessage(
		"I’ll inspect the logs and then summarize root cause and remediation.",
		responses.EasyInputMessageRoleAssistant,
	)
	commentary.OfMessage.Phase = responses.EasyInputMessagePhaseCommentary
	finalAnswer := responses.ResponseInputItemParamOfMessage(
		"Root cause: cache invalidation race.",
		responses.EasyInputMessageRoleAssistant,
	)
	finalAnswer.OfMessage.Phase = responses.EasyInputMessagePhaseFinalAnswer
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			commentary,
			finalAnswer,
			responses.ResponseInputItemParamOfMessage("Great—now give me a rollout-safe fix plan.", responses.EasyInputMessageRoleUser),
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
                        .role(EasyInputMessage.Role.ASSISTANT)
                        .phase(EasyInputMessage.Phase.COMMENTARY)
                        .content(
                            "I'll inspect the logs and then summarize root cause and remediation.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.ASSISTANT)
                        .phase(EasyInputMessage.Phase.FINAL_ANSWER)
                        .content("Root cause: cache invalidation race.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("Great—now give me a rollout-safe fix plan.")
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
  model: "gpt-6-astra",
  input: [
    {
      role: :assistant,
      phase: :commentary,
      content: "I'll inspect the logs and then summarize root cause and remediation."
    },
    {
      role: :assistant,
      phase: :final_answer,
      content: "Root cause: cache invalidation race."
    },
    {
      role: :user,
      content: "Great—now give me a rollout-safe fix plan."
    }
  ]
)

puts(response.output_text)
```


## 提示建议

在向推理模型发出提示时，请考虑这些差异。具备推理能力的 GPT-5 模型通常在以下情况下效果最佳：给出清晰的目标、严格的约束以及明确的输出契约，同时不必规定每一个中间步骤。

- 为模型提供任务、约束条件和期望的输出格式。
- 将 `reasoning.effort` 视为调节旋钮，而非恢复质量的主要手段。
- 对于智能体类或研究密集型工作流，需明确“完成”的定义以及模型应如何验证其工作。

有关使用推理模型最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

### Prompt examples



编码（重构）

    

OpenAI o-series 模型能够实现复杂算法并生成代码。此提示要求 o1 根据某些特定标准重构一个 React 组件。




  重构代码

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
Instructions:
- Given the React component below, change it so that nonfiction books have red
  text.
- Return only the code in your reply
- Do not include any additional formatting, such as markdown code blocks
- For formatting, use four space tabs, and do not allow any lines of code to
  exceed 80 columns

const books = [
  { title: 'Dune', category: 'fiction', id: 1 },
  { title: 'Frankenstein', category: 'fiction', id: 2 },
  { title: 'Moneyball', category: 'nonfiction', id: 3 },
];

export default function BookList() {
  const listItems = books.map(book =>
    <li>
      {book.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
`.trim();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Instructions:
- Given the React component below, change it so that nonfiction books have red
  text.
- Return only the code in your reply
- Do not include any additional formatting, such as markdown code blocks
- For formatting, use four space tabs, and do not allow any lines of code to
  exceed 80 columns

const books = [
  { title: 'Dune', category: 'fiction', id: 1 },
  { title: 'Frankenstein', category: 'fiction', id: 2 },
  { title: 'Moneyball', category: 'nonfiction', id: 3 },
];

export default function BookList() {
  const listItems = books.map(book =>
    <li>
      {book.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
"""

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": prompt,
        }
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
	prompt := `Instructions:
- Given the React component below, change it so that nonfiction books have red text.
- Return only the code in your reply.
- Do not include any additional formatting, such as markdown code blocks.

const books = [
  { title: 'Dune', category: 'fiction', id: 1 },
  { title: 'Frankenstein', category: 'fiction', id: 2 },
  { title: 'Moneyball', category: 'nonfiction', id: 3 },
];`

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
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

String prompt =
    """
    Instructions:
    - Given the React component below, change it so that nonfiction books have red text.
    - Return only the code in your reply.
    - Do not include any additional formatting, such as markdown code blocks.

    const books = [
    { title: 'Dune', category: 'fiction', id: 1 },
    { title: 'Frankenstein', category: 'fiction', id: 2 },
    { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];
    """
        .strip();

ResponseCreateParams params =
    ResponseCreateParams.builder().model("gpt-6-astra").input(prompt).build();

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

string prompt =
    """
    Instructions:
    - Given the React component below, make nonfiction book titles red.
    - Return only the updated component code in your reply.
    - Do not include any additional formatting, such as markdown code blocks.
    - For formatting, use four space tabs, and do not allow any lines of code to
      exceed 80 columns.

    const books = [
      { title: 'Dune', category: 'fiction', id: 1 },
      { title: 'Frankenstein', category: 'fiction', id: 2 },
      { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
      const listItems = books.map(book =>
        <li>
          {book.title}
        </li>
      );

      return (
        <ul>{listItems}</ul>
      );
    }
    """;
ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [ResponseItem.CreateUserMessageItem(prompt)]
);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
prompt = <<~PROMPT
  Instructions:
  - Given the React component below, change it so that nonfiction books have red text.
  - Return only the code in your reply.
  - Do not include any additional formatting, such as markdown code blocks.

  const books = [
    { title: 'Dune', category: 'fiction', id: 1 },
    { title: 'Frankenstein', category: 'fiction', id: 2 },
    { title: 'Moneyball', category: 'nonfiction', id: 3 },
  ];
PROMPT

response = client.responses.create(
  model: "gpt-6-astra",
  input: prompt
)

puts(response.output_text)
```


  

  

    
编码（规划）

    

OpenAI o-series 模型同样擅长制定多步骤规划。此示例提示要求 o1 为完整解决方案创建文件系统结构，并附上实现所需用例的 Python 代码。




  规划并创建一个 Python 项目

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
I want to build a Python app that takes user questions and looks
them up in a database where they are mapped to answers. If there
is close match, it retrieves the matched answer. If there isn't,
it asks the user to provide an answer and stores the
question/answer pair in the database. Make a plan for the directory
structure you'll need, then return each file in full. Only supply
your reasoning at the beginning and end, not throughout the code.
`.trim();

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
I want to build a Python app that takes user questions and looks
them up in a database where they are mapped to answers. If there
is close match, it retrieves the matched answer. If there isn't,
it asks the user to provide an answer and stores the
question/answer pair in the database. Make a plan for the directory
structure you'll need, then return each file in full. Only supply
your reasoning at the beginning and end, not throughout the code.
"""

response = client.responses.create(
    model="gpt-6-astra",
    input=[
        {
            "role": "user",
            "content": prompt,
        }
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
	prompt := `I want to build a Python app that takes user questions and looks them up
in a database where they are mapped to answers. If there is a close match, it
retrieves the matched answer. If there is not, it asks the user to provide an
answer and stores the question/answer pair in the database. Make a plan for the
directory structure you will need, then return each file in full.`

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
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

String prompt =
    """
    I want to build a Python app that looks up user questions in a database where
    they are mapped to answers. If there is a close match, it retrieves the answer.
    Otherwise, it asks the user for an answer and stores the question and answer.
    Plan the directory structure, then return each file in full.
    """
        .strip();

ResponseCreateParams params =
    ResponseCreateParams.builder().model("gpt-6-astra").input(prompt).build();

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

string prompt =
    """
    I want to build a Python app that looks up user questions in a database where
    they are mapped to answers. If there is a close match, it retrieves the answer.
    Otherwise, it asks the user for an answer and stores the question and answer.
    Plan the directory structure, then return each file in full.
    Only supply your reasoning at the beginning and end, not throughout the code.
    """;
ResponseResult response = await client.CreateResponseAsync("gpt-6-astra", prompt);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
prompt = <<~PROMPT
  I want to build a Python app that looks up user questions in a database where
  they are mapped to answers. If there is a close match, it retrieves the answer.
  Otherwise, it asks the user for an answer and stores the question and answer.
  Plan the directory structure, then return each file in full.
PROMPT

response = client.responses.create(
  model: "gpt-6-astra",
  input: prompt
)

puts(response.output_text)
```


  

  

    
STEM 研究

    

OpenAI o-系列模型在 STEM 研究中表现出色。要求支持基础研究任务的提示词通常会得到理想结果。




  提出与基础科学研究相关的问题

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
What are three compounds we should consider investigating to
advance research into new antibiotics? Why should we consider
them?
`;

const response = await openai.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
What are three compounds we should consider investigating to
advance research into new antibiotics? Why should we consider
them?
"""

response = client.responses.create(
    model="gpt-6-astra", input=[{"role": "user", "content": prompt}]
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
	prompt := `What are three compounds we should consider investigating to advance
research into new antibiotics? Why should we consider them?`

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
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

String prompt =
    """
    What are three compounds we should consider investigating to advance research
    into new antibiotics? Why should we consider them?
    """
        .strip();

ResponseCreateParams params =
    ResponseCreateParams.builder().model("gpt-6-astra").input(prompt).build();

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

string prompt =
    """
    What are three compounds we should investigate to advance research into
    new antibiotics? Why should we consider them?
    """;
ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [ResponseItem.CreateUserMessageItem(prompt)]
);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
prompt = <<~PROMPT
  What are three compounds we should consider investigating to advance research
  into new antibiotics? Why should we consider them?
PROMPT

response = client.responses.create(
  model: "gpt-6-astra",
  input: prompt
)

puts(response.output_text)
```



## 用例示例

一些使用推理模型解决实际用例的示例可以在 [Cookbook](https://developers.openai.com/cookbook).

[将推理用于数据校验



      Evaluate a synthetic medical data set for discrepancies.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_data_validation)

[将推理用于例程生成



      Use help center articles to generate actions that an agent could perform.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_routine_generation)