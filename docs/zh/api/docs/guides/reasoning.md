# Reasoning models

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取 Markdown 格式的文档页面。

**推理模型** 如 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 会在生成回复前使用内部推理 token。这有助于模型进行规划、有效地使用工具、检查备选方案、消除歧义，并解决更困难的多步任务。推理模型在复杂问题求解、编程、科学推理以及多步智能体工作流方面表现尤为出色。它们也是以下场景的最佳模型： [Codex CLI](https://github.com/openai/codex)，我们轻量级的编程智能体。

从 `gpt-5.6` 开始可以应对大多数推理负载。如果你需要面向更具挑战性问题、可承受更高延迟的最高智能 API 选项，请在 Responses API 中使用 [`gpt-5.6-sol`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) ，并设置 `reasoning.mode` 为 `pro`。若要降低成本，可以考虑 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，或 [`gpt-5.6-luna`](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以获得最低的成本和延迟。

**推理模型配合 [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses)**。使用时效果更佳。虽然 Chat Completions API
  仍然受支持，但
  使用 Responses 可以获得更强的模型智能和性能。

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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
    Model = "gpt-5.6",
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
  model: "gpt-5.6",
  reasoning: {effort: :low},
  input: prompt
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
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

该 `reasoning.effort` 参数用于引导模型在执行任务时思考的程度。

支持的值取决于具体模型，可包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`。较低的努力值偏向更快的速度和更少的 token 使用，而在较高的努力值下，模型会思考得更完整，从而提供更高质量的响应。模型还会在不同推理努力下自适应地调整思考深度，对简单任务使用更少的 token，对复杂任务进行更深入的思考。

默认值同样取决于模型，而不是统一的。 `gpt-5.5` 默认为 `medium` 推理努力。这是使用 `gpt-5.5`’在质量、可靠性和性能方面取得最佳平衡的起点。

| Effort   | 最佳适用场景                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`   | 对延迟敏感且无需推理或多链工具调用的任务。对于对延迟敏感的使用场景，建议从 `gpt-5.5`，开始尝试，必要时再切换到 `low` ，如果需要的话。 `none` 如果需要。<br /><br />常见用例包括语音、快速信息检索和分类。                                                 |
| `low`    | 高效推理，延迟略有增加。适合需要使用工具、规划、搜索或多步骤决策的使用场景，同时在速度和成本之间取得平衡。<br /><br />常见用例包括数据分析、起草、面向执行的编码，以及客户支持 / 聊天助手工作流。                                           |
| `medium` | 当质量和可靠性至关重要，且任务涉及规划、复杂推理和判断时使用。是大多数工作负载的默认配置，在延迟、性能和成本的帕累托曲线上是一个良好的平衡点。<br /><br />常见用例包括智能体编码、研究、处理电子表格与幻灯片，以及委派长周期任务。 |
| `high`   | 硬推理、复杂调试、深度规划，以及质量与智能比延迟更重要的的高价值任务。推荐用于复杂工作流和智能体任务。<br /><br />常见用例包括智能体编码、长周期研究和知识工作。根据任务的复杂度，评估两者 `medium` 和 `high`.     |
| `xhigh`  | 深度研究、需要长时间运行的异步工作流和智能体任务。仅在你的评估显示出能够证明额外延迟与成本合理性的明显收益时使用。<br /><br />常见用例包括安全与代码审查、企业生产力、更深度的研究任务，以及具有挑战性的编码工作流。                                             |
| `max`    | 针对最复杂任务的最大推理能力。如果你当前正在使用 `xhigh`,评估是否 `max` 能带来更强的性能                                                                                                                                                                                                                                 |

在对延迟敏感的应用程序中，为了更快获得首个可见 token，可以让模型先生成一段简短的引导语，再继续进行更深入的推理。

某些模型仅支持这些取值中的一个子集，因此请查阅相关 [模型页面](https://developers.openai.com/api/docs/models) 后再选择相应设置。

## Reasoning mode

GPT-5.6 模型支持 `standard` 和 `pro` 推理模式，在 Responses API 中使用。 `standard` 是默认值。将 `reasoning.mode` 设置为 `pro` 适用于需要更多模型工作、且能够容忍更高延迟和 token 消耗的困难任务。

推理模式和推理力度彼此独立。模式选择 standard 或 pro 执行，而 `reasoning.effort` 控制模型在该模式下应用的推理量。如果省略 `reasoning.effort`，GPT-5.6 在两种模式下均默认为 `medium` 。

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


Pro 模式汇总了为生成最终答案而执行的模型工作，并按所选模型的标准 [token 费率](https://developers.openai.com/api/docs/pricing)。对这些 token 计费。Pro 模式执行的模型工作量比 standard 模式更多，因此会增加 token 消耗和成本。现有的 Pro 模型 ID 保持其当前行为和定价不变。

## 推理的工作原理

推理模型会引入 **推理 tokens** ，作为输入和输出 tokens 之外的补充。模型使用这些推理 tokens 来“思考”，拆解提示并考虑生成回复的多种方式。我们的推理模型（例如 `gpt-5.5` 和 `gpt-5.4` 支持交错思考（interleaved thinking），模型能够在思考之前和思考之间生成可见的输出 tokens，并且能够在工具调用之间进行思考。

对于 GPT-5.6 之前发布的模型，在多步对话中的默认行为是延续每一步的输入和输出 tokens，而不会将之前轮次的推理渲染进下一次采样。GPT-5.6 模型则默认会将可用的之前轮次推理渲染出来。可使用 `reasoning.context` 在支持的模型上选择这两种行为之一。

![当前轮次上下文中的推理 tokens](https://cdn.openai.com/API/docs/images/context-window.png)

虽然推理 tokens 无法通过 API 查看，但它们仍然会占用
  模型的上下文窗口空间，并按 [输出
  tokens](https://openai.com/api/pricing).

### 管理上下文窗口

在创建响应时，确保上下文窗口中有足够空间用于推理 tokens，这一点很重要。模型可能根据问题的复杂性生成从几百到数万个不等的推理 tokens。实际使用的推理 tokens 数量可以在响应对象的 [usage 对象](https://developers.openai.com/api/reference/resources/responses)，中的 `output_tokens_details`:

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

上下文窗口长度可在 [模型参考页面](https://developers.openai.com/api/docs/models)，中找到，并且会因模型快照不同而有所差异。

### 控制成本

若要使用推理模型管理成本，你可以通过以下方式限制模型生成的总 token 数
，包括推理 token、可见的输出 token 以及不可见的
格式 token，方法是使用
[`max_output_tokens`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-max_output_tokens)
parameter. See [output token counts](https://developers.openai.com/api/docs/guides/token-counting#understand-output-token-counts) 有关生成的 token 如何体现在用量和输出限制中的详细信息。

### 为推理分配空间

如果生成的令牌达到上下文窗口上限或你设置的 `max_output_tokens` 值，你将收到一个 `status` 为 `incomplete` 和 `incomplete_details` 的响应 `reason` 为 `max_output_tokens`。这种情况可能发生在产生任何可见输出令牌之前，这意味着你可能会为输入和推理令牌付费，却没有收到可见的响应。

为避免这种情况，请确保上下文窗口有足够的空间，或将 `max_output_tokens` 值调高。OpenAI 建议你在开始试验这些模型时，为推理和输出预留至少 25,000 个令牌。随着你熟悉提示所需的推理令牌数量，你可以相应地调整该缓冲区大小。

处理不完整的响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;

const response = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model:           "gpt-5.6",
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
        .model("gpt-5.6")
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
    Model = "gpt-5.6",
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
  model: "gpt-5.6",
  max_output_tokens: 300,
  reasoning: {effort: :medium},
  input: prompt
)

if response.status == OpenAI::Responses::ResponseStatus::INCOMPLETE
  puts("Ran out of tokens")
  puts("Partial output: #{response.output_text}") unless response.output_text.empty?
end
```


### 在上下文中保留推理项

在使用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 时，如果你使用的是推理模型， [Responses API](https://developers.openai.com/api/reference/resources/responses)，我们强烈建议你将上一次函数调用返回的所有推理项一并传回（除了函数调用的输出之外）。如果模型连续调用了多个函数，你应当将所有推理项、函数调用项和函数调用输出项一并传回，因为最后一个 `user` 消息之前的所有项都关系到函数调用。我们的系统会智能地忽略与你的函数调用无关的推理项，只保留与当前函数调用相关的推理项，以最高效地利用 token。

最简单的做法是：将上一次响应中的所有推理项都传入下一次响应。我们的系统会智能地忽略与你的函数无关的推理项，只保留上下文中相关的那些。你可以通过 `previous_response_id` 参数传入推理项，也可以手动将上一次响应中的所有 [输出](https://developers.openai.com/api/reference/resources/responses#responses/object-output) 项传入新的响应的 [input](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-input) 中。

在需要在传入下一次响应之前对上下文窗口进行截断或优化的高级用例中，只需确保最后一个用户消息和你的函数调用输出之间的所有项都原封不动地传递到下一次响应。这将确保模型拥有它所需的全部上下文。

请查看 [本指南](https://developers.openai.com/api/docs/guides/conversation-state) ，以详细了解如何进行手动上下文管理。

## 在调用之间保留推理

会话状态和推理状态用途不同。跨调用传递消息会向模型提供可见的会话历史。在支持的模型上，持久化的推理还可以让模型将早期轮次中兼容的推理项渲染到下一段上下文中。

持久化推理提供延续性，但不会暴露模型的原始推理过程。推理项仍然是不透明的，API 不会返回它们的推理文本。可设置 `reasoning.context` 来控制模型可以使用的可用推理项：

该 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model) 支持
  `all_turns` 并且默认使用它。较早的模型默认使用
  `current_turn`。省略 `reasoning.context` 或将其设置为
  `auto` 以使用所选模型的默认值。

| 值          | 行为                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auto`         | 使用所选模型的默认值。省略 `reasoning.context` 的效果等同于 `auto`.                            |
| `current_turn` | 使当前轮次的推理可用,但不会将更早轮次的推理渲染到下一个样本中。    |
| `all_turns`    | 将更早轮次中可用且兼容的推理项渲染到下一个样本中。GPT-5.6 模型支持此值。 |

响应的 `reasoning.context` 字段包含实际生效的模式，取值为 `current_turn` 或 `all_turns`。请在每次响应时检查该字段，以确认模型使用的是哪种模式。该设置不会产生原本不可用的推理项。

`all_turns` 仅在请求可以访问之前的响应项时才有效。请使用 `previous_response_id`，将响应附加到对话中，或手动重放完整的响应历史。在首次请求时， `current_turn` 和 `all_turns` 表现相同，因为之前没有推理内容。

持久化推理只能在同一模型系列内复用。例如， `gpt-5.6-sol`, `gpt-5.6-terra`，以及 `gpt-5.6-luna` 之间可以互相复用彼此的推理，但推理不会在 GPT-5.6 和 GPT-5.5 系列之间传递。

当你切换模型系列时，API 会从模型上下文中省略不兼容的推理，即使 `reasoning.context` 为 `all_turns`.

### 使用存储的响应继续推理

使用 `previous_response_id` 实现最短的有状态集成：

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
  reasoning: {context: :current_turn}
)

second = client.responses.create(
  model: "gpt-5.6",
  previous_response_id: first.id,
  input: "Now patch the bug and explain the change.",
  reasoning: {context: :all_turns}
)

puts(second.output_text)
```


使用 `current_turn` 用于在回放模型不再需要的较旧响应项时。这些推理项可以保留在 API payload 中以维持连续性，但服务不会将它们渲染到新样本中。这可以减少长时间运行工作流的渲染上下文。

### 保留推理，不存储响应

在无状态模式下创建响应时，响应中的推理项默认会包含一个 `output` 属性。无状态模式适用于以下情况： `encrypted_content` 属性，或者当你的组织使用零数据保留 (ZDR) 时。API 仍然接受旧的 `store` 为 `false` 或当你的组织使用零数据保留 (ZDR) 时。接口 仍然接受旧的 `reasoning.encrypted_content` 值以保持兼容 `include` 性，但并不要求必须传入。

以下请求在未指定的情况下返回加密后的推理内容 `include`:

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "store": false,
    "reasoning": {"effort": "medium"},
    "input": "What is the weather like today?",
    "tools": [ ... function config here ... ]
  }'
```


数组中的推理项会包含一个 `output` 属性，其中包含加 `encrypted_content` 密的推理令牌，你可以将其传递给后续调用。

要使用 `all_turns` 的响应 `store: false`，请保留每个输出项，追加下一条用户消息，并重放完整的历史记录：

在不存储响应的情况下保留推理

```javascript
import OpenAI from "openai";

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

// Keep every output item, including encrypted reasoning and assistant phase.
history.push(...first.output);
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
  {role: :user, content: "Inspect this repository and identify the likely bug."}
]

first = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: {context: :current_turn}
)
history.concat(first.output)
history << {role: :user, content: "Now patch the bug and explain the change."}

second = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: history,
  reasoning: {context: :all_turns}
)

puts(second.output_text)
```


## 推理摘要

虽然我们不会暴露模型输出的原始推理令牌，但你可以通过以下参数查看模型推理的摘要： `summary` 。请参阅我们的 [模型文档](https://developers.openai.com/api/docs/models) 以查看哪些推理模型支持摘要。

不同的模型支持不同的推理摘要设置。例如，我们的 computer use 模型支持 `concise` 摘要器，而 o4-mini 支持 `detailed`。要访问某个模型可用的最详细的摘要器，请将该参数的值设置为 `auto`. `auto` ，其效果等同于 `detailed` ，目前对于大多数推理模型而言如此，但未来可能会提供更细粒度的设置。

推理摘要输出是 `summary` 输出项中 `reasoning` [数组](https://developers.openai.com/api/reference/resources/responses#responses/object-output)。的一部分。除非你显式选择包含推理摘要，否则该输出不会被包含在内。

下面的示例展示了如何发出包含推理摘要的 API 请求。

在 API 响应中包含推理摘要

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
    Model = "gpt-5.6",
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
  model: "gpt-5.6",
  input: "What is the capital of France?",
  reasoning: {effort: :low, summary: :auto}
)

puts(response.output)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "input": "What is the capital of France?",
    "reasoning": {
        "effort": "low",
        "summary": "auto"
    }
  }'
```


此 API 请求将返回一个输出数组，其中既包含助手消息，也包含模型在生成该响应时的推理摘要。

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
  以确保安全部署。前往 [平台
  设置页面](https://platform.openai.com/settings/organization/general).

## `phase` parameter

在 Responses API 中使用 GPT-5.5 和 GPT-5.4 处理长时间运行或工具密集型工作流时，请使用 assistant 消息 `phase` 字段以避免提前停止和其他异常行为。
`phase` 在 API 层面是可选的，但 OpenAI 推荐使用它。可用于 `phase: "commentary"` 中间 assistant 更新，例如工具调用前的开场白，以及 `phase: "final_answer"` 用于已完成答案的。不要将 `phase` 添加到用户消息中。
使用 `previous_response_id` 通常是最简单的做法，因为之前的 assistant 状态会被保留。如果手动重放 assistant 历史记录，请保留每个原始 `phase` 值。
缺失或丢失的 `phase` 可能导致这些工作流中的开场白被当作最终答案。有关针对特定模型的提示指导，请参阅 [GPT-5.5 提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#prompting-best-practices).

### 往返助手阶段值

往返助手阶段值

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
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

在对推理模型进行提示时,请考虑这些差异。具备推理能力的 GPT-5 模型通常在你为它设定清晰的目标、明确的约束以及明确的输出契约、同时不去规定每一个中间步骤时,表现最佳。

- 向模型说明任务、约束条件以及期望的输出格式。
- 将其视为 `reasoning.effort` 一个调节参数，而不是恢复质量的主要手段。
- 对于智能体类或研究密集型工作流，明确什么算作完成，以及模型应如何验证其工作。

有关使用推理模型时最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

### 提示词示例



编码（重构）

    

OpenAI o-series 模型能够实现复杂算法并生成代码。此提示要求 o1 根据特定标准重构一个 React 组件。




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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
    ResponseCreateParams.builder().model("gpt-5.6").input(prompt).build();

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
    "gpt-5.6",
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
  model: "gpt-5.6",
  input: prompt
)

puts(response.output_text)
```


  

  

    
编码（规划）

    

OpenAI o-series 模型同样擅长创建多步骤计划。此示例提示要求 o1 为完整解决方案创建一个文件系统结构，以及实现所需用例的 Python 代码。




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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
    ResponseCreateParams.builder().model("gpt-5.6").input(prompt).build();

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
ResponseResult response = await client.CreateResponseAsync("gpt-5.6", prompt);

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
  model: "gpt-5.6",
  input: prompt
)

puts(response.output_text)
```


  

  

    
STEM 研究

    

OpenAI o-series 模型在 STEM 研究中表现出色。支持基础研究任务的提示通常会取得良好的效果。




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
  model: "gpt-5.6",
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
    model="gpt-5.6", input=[{"role": "user", "content": prompt}]
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
		Model: "gpt-5.6",
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
    ResponseCreateParams.builder().model("gpt-5.6").input(prompt).build();

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
    "gpt-5.6",
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
  model: "gpt-5.6",
  input: prompt
)

puts(response.output_text)
```



## 用例示例

一些使用推理模型解决实际应用场景的示例可以在 [cookbook](https://developers.openai.com/cookbook).

[使用推理进行数据校验



      Evaluate a synthetic medical data set for discrepancies.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_data_validation)

[使用推理生成例程



      Use help center articles to generate actions that an agent could perform.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_routine_generation)