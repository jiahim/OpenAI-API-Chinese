# Reasoning models

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面提供 Markdown 版本，可在页面 URL 末尾追加 `.md` 以获取该版本。

**推理模型** 会在生成回复之前使用内部推理 token。这有助于模型进行规划、有效使用工具、审视各种方案、在模糊情境中恢复思路，以及解决更复杂的多步骤任务。推理模型在复杂问题求解、编程、科学推理以及多步骤智能体工作流方面表现尤为出色。它们也是以下场景的最佳模型： [Codex CLI](https://github.com/openai/codex)，我们轻量级的编码智能体。

从开始 `gpt-6-astra` 入手，可应对大多数推理工作负载。若希望降低成本，可考虑使用 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，或者 [`gpt-5.6-luna`](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以获得最低的成本和延迟。如果你使用的是 GPT-5.6 模型，请参阅 [推理模式](#reasoning-mode) 中的相关 `pro` 选项。

**推理模型在使用 [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses)**。时效果更佳。虽然 Chat Completions API
  仍然受支持，但通过
  使用 Responses 也能获得更强的模型智能和性能。

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

该 `reasoning.effort` 参数用于指导模型在执行任务时思考的深度。

支持的值因模型而异，可能包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`。较低的 effort 倾向于更快的速度和更少的 token 使用，而在较高的 effort 下，模型会思考得更完整，以提供更高质量的回复。模型还会在不同推理 effort 之间自适应地推理，对简单任务使用更少的 token，对复杂任务思考得更深入。

[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) 不支持 `none` reasoning
  effort。将 `reasoning.effort` （Responses）或 `reasoning_effort` （Chat
  Completions）设置为 `none` 会返回 HTTP 400。

请使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行函数
调用。Chat Completions 不支持 GPT-6 Astra 的函数调用。

默认值同样因模型而异，并非通用。 `gpt-5.5` 默认为 `medium` reasoning effort。这是使用 `gpt-5.5`’完整质量、可靠性和性能平衡的最佳起点。

| 投入度   | 适用场景                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`   | 适用于对延迟敏感、且不需要推理或多步链式工具调用的任务。对于对延迟敏感的使用场景，推荐先尝试 `gpt-5.5`，如果需要再切换到 `low` 。 `none` 。<br /><br />常见用例包括语音、快速信息检索和分类。                                                 |
| `low`    | 以适度的延迟增加实现高效的推理。非常适合需要使用工具、规划、搜索或多步决策，同时兼顾速度和成本的使用场景。<br /><br />常见用例包括数据分析、起草、以执行为导向的编码以及客服 / 聊天助手工作流。                                           |
| `medium` | 当质量和可靠性至关重要，且任务涉及规划、复杂推理和判断时使用。是大多数工作负载的默认配置，也是延迟、性能和成本帕累托曲线上一个均衡的点。<br /><br />常见用例包括智能体编码、研究、处理电子表格和幻灯片，以及委托长周期任务。 |
| `high`   | 适用于困难推理、复杂调试、深度规划以及质量和智能比延迟更重要的关键任务。推荐用于复杂工作流和智能体任务。<br /><br />常见用例包括智能体编码、长周期研究以及知识工作。根据任务的复杂度，请同时评估 `medium` 和 `high`.     |
| `xhigh`  | 深度研究、异步工作流以及需要长时间运行的智能体任务。仅在你的评估显示能带来明确收益、足以抵消额外延迟和成本时使用。<br /><br />常见用例包括安全审计和代码审查、企业生产力、更深入的研究任务以及具有挑战性的编码工作流。                                             |
| `max`    | 为你最复杂的任务提供最大推理能力。如果你目前正在使用 `xhigh`，请评估 `max` 是否能带来更强的性能                                                                                                                                                                                                                                 |

对于对延迟敏感的应用，如果希望更快获得首个可见 token，可以让模型在继续深入推理之前先生成一段简短的前言。

某些模型仅支持这些取值的一个子集，请在选择之前查阅相关的 [模型页面](https://developers.openai.com/api/docs/models) 后再进行设置。

## 推理模式

GPT-5.6 和 GPT-6 模型支持 `standard` 和 `pro` reasoning 模式（在 Responses API 中）。 `standard` 是默认模式。将 `reasoning.mode` 设置为 `pro` 用于那些需要更多模型工作、且可以接受更高延迟和 token 用量的困难任务。

reasoning 模式和 reasoning effort 是相互独立的。模式用于选择 standard 或 pro 执行，而 `reasoning.effort` 控制模型在该模式下应用的 reasoning 程度。如果省略 `reasoning.effort`,GPT-5.6 在两种模式下默认使用 `medium` 。GPT-6 Sol 和 Luna 同样默认使用 `medium` reasoning effort。

使用 pro reasoning 模式

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


Pro 模式会将为生成最终答案而执行的模型工作进行汇总，并按所选模型的标准 [token 费率](https://developers.openai.com/api/docs/pricing)。对这些 token 进行计费。Pro 模式比 standard 模式执行更多模型工作，从而增加 token 用量和成本。现有 Pro 模型 ID 保持其当前行为和定价不变。

## 推理的工作原理

推理模型除了输入和输出 token 外，还会引入 **推理 token** 。模型使用这些推理 token 来“思考”，拆解提示并考虑生成响应的多种方式。我们的推理模型（例如 `gpt-5.5` 和 `gpt-5.4` ）支持交错思考，模型能够在思考前后生成可见的输出 token，并能在工具调用之间进行思考。

对于 GPT-5.6 之前发布的模型，在多步对话中的默认行为是保留每一步的输入和输出 token，但不会将前几轮的推理渲染到下一次采样中。而 GPT-5.6 模型则默认会渲染前几轮可用的推理。可使用 `reasoning.context` 在支持的模型上选择上述任一行为。

![包含当前轮次上下文的推理 token](https://cdn.openai.com/API/docs/images/context-window.png)

虽然推理 token 无法通过 API 直接查看，但它们仍然占用
  模型的上下文窗口空间，并按 [输出
  token](https://openai.com/api/pricing).

## 控制成本

若要控制推理模型的成本，你可以通过设置
参数来限制模型生成的总 token 数，包括推理 token、可见输出 token 以及非可见
格式化 token。详见
[`max_output_tokens`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-max_output_tokens)
参数。详见 [输出 token 计数](https://developers.openai.com/api/docs/guides/token-counting#understand-output-token-counts) ，了解生成 token 如何体现在用量和输出限制中的详细信息。

### 管理上下文窗口

在创建响应时，必须确保上下文窗口中有足够的空间用于推理 tokens。根据问题的复杂度，模型可能生成几百到几万个不等的推理 tokens。使用的推理 tokens 的确切数量可在响应对象的 [usage 对象](https://developers.openai.com/api/reference/resources/responses)，中查看，字段为 `output_tokens_details`:

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

上下文窗口长度可在 [模型参考页](https://developers.openai.com/api/docs/models)，中查看，不同模型快照会有所不同。

### 为推理分配空间

如果生成的 token 达到上下文窗口限制或你 `max_output_tokens` 设置的值，你将收到一个包含 `status` 为 `incomplete` 和 `incomplete_details` 其中 `reason` 设置为 `max_output_tokens`。的响应。这可能在产生任何可见的输出 token 之前就已发生，这意味着你可能会为输入和推理 token 付费，却没有收到可见的响应。

为避免这种情况，请确保上下文窗口有足够的空间，或调整 `max_output_tokens` 的值为更大的数字。OpenAI 建议在开始试验这些模型时，至少为推理和输出预留 25,000 个 token。当你熟悉提示所需的推理 token 数量后，可以相应地调整此缓冲区。

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


## 在多次调用间保留推理过程

对话状态和推理状态用途不同。在调用之间传递消息，会为模型提供可见的对话历史。在支持推理持久化的模型上，持久化的推理还可以让模型将先前轮次中兼容的推理项渲染到其下一轮上下文中。

持久化的推理提供延续性，但不会暴露模型的原始推理。推理项仍然是不透明的，API 不会返回其推理文本。可设置 `reasoning.context` 来控制模型可使用的可用推理项：

该 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)
  支持
  `all_turns` 并默认使用它。早期模型默认使用
  `current_turn`。省略 `reasoning.context` 或将其设置为
  `auto` 以使用所选模型的默认值。

| 值          | 行为                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auto`         | 使用所选模型的默认值。省略 `reasoning.context` 的效果等同于 `auto`.                            |
| `current_turn` | 使当前轮次的推理可用，但不会将之前轮次的推理渲染到下一个采样中。    |
| `all_turns`    | 将之前轮次中可用且兼容的推理项渲染到下一个采样中。GPT-5.6 模型支持该值。 |

响应的 `reasoning.context` 字段包含生效的模式，取值为 `current_turn` 或 `all_turns`。请在每次响应中检查此字段，以确认模型使用的是哪种模式。该设置不会创建原本就不可用的推理项。

`all_turns` 仅在请求可以访问先前的响应项时才有效。可使用 `previous_response_id`，将响应附加到对话中，或手动重放完整的响应历史记录。在首次请求时， `current_turn` 和 `all_turns` 行为相同，因为不存在先前的推理。

持久化推理只能在同一模型系列内复用。例如， `gpt-5.6-sol`, `gpt-5.6-terra`，以及 `gpt-5.6-luna` 可以相互复用对方的推理，但推理不会在 GPT-5.6 和 GPT-5.5 系列之间传递。

当你切换模型系列时，API 会从模型上下文中省略不兼容的推理，即使 `reasoning.context` 为 `all_turns`.

### 使用已存储的响应继续推理

使用 `previous_response_id` 以实现最短的有状态集成：

保留先前响应的推理

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


使用 `current_turn` 用于回放模型不再需要的较旧响应项时。这些推理项可以保留在 API 负载中以保持连续性，但服务不会将其渲染到新样本中。这可以减少长时间运行工作流的已渲染上下文。

### 在不使用存储响应的情况下保留推理

当你在无状态模式下创建响应时，响应中的推理条目默认会包含一个 `output` 属性。无状态模式适用于以下情况： `encrypted_content` 属性，或当你的组织使用零数据保留 (ZDR) 时。API 出于兼容性仍然接受 `store` 为 `false` 或当你的组织使用零数据保留 (ZDR) 时。接口 出于兼容性仍然接受 `reasoning.encrypted_content` 字段中的旧版 `include` 值，但并不要求必须提供该值。

以下请求在不指定 `include`:

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


数组中的推理条目会包含一个 `output` 属性的情况下，返回加密的推理内容。 `encrypted_content` 属性，其中包含你可以传递给后续调用的加密推理 tokens。

若要使用 `all_turns` 其中 `store: false`，请保留所有输出条目，追加下一条用户消息，并重放完整的对话历史：

在不存储响应的情况下保留推理

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const client = new OpenAI();

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


### 在上下文中保留推理项

在使用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 配合推理模型时， [Responses API](https://developers.openai.com/api/reference/resources/responses)，时，我们强烈建议你将上一次函数调用返回的所有推理项一并回传（除了你的函数输出之外）。如果模型连续调用了多个函数，你应该回传所有推理项、函数调用项和函数调用输出项，因为上一条 `user` 消息之后的内容对后续调用仍然相关。这样可以让模型以更省 token 的方式继续推理，从而获得更好的结果。

最简单的做法是将上一次响应中的所有推理项直接传入下一次响应。系统会智能地忽略与你的函数无关的推理项，只保留与当前上下文相关的部分。你可以通过 `previous_response_id` 参数回传之前响应中的推理项，也可以手动将所有 [输出](https://developers.openai.com/api/reference/resources/responses#responses/object-output) 项传入下一次响应的 [输入](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-input) 中。

对于需要在传递给下一次响应之前对上下文窗口进行截断和优化的进阶用法，只要确保最后一条用户消息与你的函数调用输出之间的所有项都原样传入下一次响应即可。这样能保证模型拥有所需的全部上下文。

查看 [本指南](https://developers.openai.com/api/docs/guides/conversation-state) 了解更多关于手动上下文管理的信息。

## 在对话中途更改推理

使用 `configuration_update` 为困难任务增加推理投入，或为常规后续任务减少推理投入。在各次响应之间添加该更新，同时保持请求级别 `reasoning.effort` 不变。这样既保留了用于 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

GPT-6 模型系列在标准，
  、单智能体 模式下支持配置更新。这些更新仅更改推理投入。

在下一个用户消息之前，将以下项添加到 `input` HTTP Responses 请求的 input 数组或 WebSocket `response.create` 请求中：

```json
{
  "type": "configuration_update",
  "reasoning": {
    "effort": "high"
  }
}
```

例如，如果对话以请求级别的 effort `low`，开头，则此更新会为 `high` 下一次响应以及后续响应选择对应 effort，直到被另一次更新覆盖。

为后续任务增加推理投入

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


通过 `previous_response_id`，保留更新，或在 [手动管理对话历史记录时](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state)。按原顺序重放它们。响应的 `reasoning.effort` 仍会报告请求级别的设置，而不是该更新所选择的 effort。

请勿将两个 `configuration_update` 项直接相邻地放在对话历史记录中；API 会拒绝相邻的更新。

请勿将配置更新与自动压缩或自动截断组合使用。独立的 `/responses/compact` endpoint 同样会拒绝包含这些更新的历史记录。

你仍然可以通过在请求中包含一个 `compaction_trigger` 项来显式压缩历史记录。请求中包含一个 `/responses` 项即可显式压缩历史。压缩完成后，在下一条用户消息之前添加一个新的 `configuration_update` ，并指定所需的 effort。

常规的 prompt 缓存要求仍然适用。若要在响应运行期间发送用户指令，请使用 [中途引导](https://developers.openai.com/api/docs/guides/steering).

## 推理摘要

虽然我们不会公开模型输出的原始推理 token，但你可以使用以下参数查看模型推理的摘要： `summary` 参数。详见我们的 [模型文档](https://developers.openai.com/api/docs/models) ，查看哪些推理模型支持摘要。

不同的模型支持不同的推理摘要设置。例如，我们的 computer use 模型支持 `concise` 摘要器，而 o4-mini 支持 `detailed`。要访问某模型可用的最详细的摘要器，请将该参数的值设置为 `auto`. `auto` ，这在大多数当前推理模型中等价于 `detailed` ，但未来可能会提供更细粒度的设置。

推理摘要输出是 `summary` 响应中 `reasoning` [输出项](https://developers.openai.com/api/reference/resources/responses#responses/object-output)。的一部分。除非你明确选择包含推理摘要，否则输出中不会包含此项。

下面的示例演示了如何发起一个包含推理摘要的 API 请求。

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


这个 API 请求将返回一个 output 数组，其中同时包含助手消息和模型生成该响应时的推理摘要。

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

在将摘要器与我们最新的推理模型一起使用之前，你可能需要完成
  组织 [验证
  验证](https://help.openai.com/en/articles/10910291-api-organization-verification)
  以确保安全部署。在 [平台
  设置页面](https://platform.openai.com/settings/organization/general).

## `phase` parameter

对于使用 GPT-5.5 和 GPT-5.4 的 Responses API 中的长时间运行或工具密集型工作流，使用 assistant 消息 `phase` 字段来避免提前停止和其他异常行为。
`phase` 在 API 层级是可选的，但 OpenAI 建议使用它。使用 `phase: "commentary"` 用于中间的 assistant 更新，例如工具调用前的开场白，并 `phase: "final_answer"` 用于最终回答。不要向 `phase` 用户消息中添加。
使用 `previous_response_id` 通常是最简单的路径，因为之前的 assistant 状态会被保留。如果手动重放 assistant 历史记录，请保留每个原始 `phase` 值。
缺失或被丢弃的 `phase` 可能导致这些工作流中的开场白被当作最终答案。有关针对特定模型的提示指导，请参阅 [提示 GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#prompting-best-practices).

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

在对推理模型进行提示时,请考虑这些差异。具备推理能力的 GPT-5 模型通常在你给出明确目标、严格约束以及明确的输出契约(而不是规定每一个中间步骤)时表现最佳。

- 向模型提供任务、约束条件以及期望的输出格式。
- 将 `reasoning.effort` 视作一个调节旋钮，而不是恢复质量的主要手段。
- 对于智能体类或研究密集型的工作流，需要明确界定“完成”的标准以及模型应如何验证其工作成果。

有关使用推理模型时最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

### 提示词示例



编程（重构）

    

OpenAI o-series 模型能够实现复杂算法并生成代码。该提示要求 o1 根据一些特定标准重构一个 React 组件。




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


  

  

    
编程（规划）

    

OpenAI o-series 模型同样擅长创建多步骤规划。该示例提示要求 o1 为完整解决方案创建文件系统结构，并附带实现所需用例的 Python 代码。




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

    

OpenAI o-series 模型在 STEM 研究中表现出色。寻求支持基础研究任务的提示应能产生出色的结果。




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

一些在实际场景中使用推理模型的示例可以在 [cookbook 中找到](https://developers.openai.com/cookbook).

[使用推理进行数据验证



      Evaluate a synthetic medical data set for discrepancies.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_data_validation)

[使用推理生成例程



      Use help center articles to generate actions that an agent could perform.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_routine_generation)