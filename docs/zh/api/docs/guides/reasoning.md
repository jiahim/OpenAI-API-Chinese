# 推理模型

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

**推理模型** 在生成响应前会使用内部推理 token。这有助于模型进行规划、高效使用工具、检查替代方案、在模糊场景中恢复，以及解决更复杂的多步骤任务。推理模型在复杂问题求解、编程、科学推理和多步骤智能体工作流方面表现尤为出色。它们也是以下场景的最佳模型： [Codex CLI](https://github.com/openai/codex)，我们轻量级的编程 智能体。

大多数推理工作负载建议从 `gpt-6-astra` 开始。若追求更低成本，可考虑 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra)，或 [`gpt-5.6-luna`](https://developers.openai.com/api/docs/models/gpt-5.6-luna) 以获得最低成本和延迟。如果你使用的是 GPT-5.6 模型，请参阅 [reasoning mode](#reasoning-mode) 的 `pro` 选项。

**推理模型在 [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses)**。下表现更佳。虽然 Chat Completions API
  仍受支持，但通过
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


## 推理力度

该 `reasoning.effort` 参数引导模型在执行任务时进行多少思考。

支持的值因模型而异，可能包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`。较低的努力值优先考虑速度和较少的 token 使用，而较高的努力值会让模型更全面地思考，从而提供更高质量的回答。模型还会在不同推理努力值之间自适应推理，对简单任务使用更少的 token，对复杂任务则更深入地思考。

[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) 不支持 `none` 推理
  努力值。将 `reasoning.effort` （Responses）或 `reasoning_effort` （Chat
  Completions）设置为 `none` 会返回 HTTP 400。

请使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行函数
调用。Chat Completions 不支持使用 GPT-6 Astra 进行函数调用。

默认值同样因模型而异，并非通用。 `gpt-5.5` 默认为 `medium` 推理努力值。这是实现 `gpt-5.5`’在质量、可靠性和性能之间全面平衡的最佳起点。

| Effort   | 适用场景                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`   | 对延迟敏感且不会受益于任何推理或多链式工具调用的任务。对于对延迟敏感的使用场景， `gpt-5.5`，我们建议先从 `low` 开始尝试，再根据需要升级到 `none` 。<br /><br />常见用例包括语音、快速信息检索和分类。                                                 |
| `low`    | 在适度增加延迟的前提下进行高效推理。非常适合需要工具使用、规划、搜索或多步决策，同时在速度和成本之间寻求平衡的使用场景。<br /><br />常见用例包括数据分析、起草、以执行为导向的编码以及客服 / 聊天助手工作流。                                           |
| `medium` | 当质量和可靠性至关重要，且任务涉及规划、复杂推理和判断时使用。是大多数工作负载的默认配置，也是延迟、性能和成本帕累托曲线上一个良好平衡的点。<br /><br />常见用例包括智能体编码、研究、处理电子表格和幻灯片，以及委派长周期任务。 |
| `high`   | 用于困难推理、复杂调试、深度规划以及质量和智能比延迟更重要的关键任务。建议用于复杂工作流和智能体任务。<br /><br />常见用例包括智能体编码、长周期研究和知识工作。根据任务复杂度，评估 `medium` 和 `high`.     |
| `xhigh`  | 深度研究、异步工作流以及需要长时间运行的智能体任务。仅在你的评估表明能带来明显收益并足以抵消额外延迟和成本时使用。<br /><br />常见用例包括安全与代码审查、企业生产力、更深入的研究任务以及具有挑战性的编码工作流。                                             |
| `max`    | 针对最复杂任务的最大推理力度。如果你当前正在使用 `xhigh`，评估一下 `max` 是否能带来更强的性能                                                                                                                                                                                                                                 |

在延迟敏感型应用中，为了更快获得首个可见令牌（token），可以让模型先生成一段简短的前言，再继续进行更深入的推理。

某些模型仅支持其中一部分取值，因此请查阅相应的 [模型页面](https://developers.openai.com/api/docs/models) 后再选择设置。

## Reasoning mode

GPT-5.6 模型支持 `standard` 和 `pro` 推理模式，在 Responses API 中提供。 `standard` 是默认值。设置 `reasoning.mode` 为 `pro` 以处理需要更多模型工作且可接受更高延迟和 token 用量的困难任务。

推理模式和推理强度相互独立。模式用于选择标准或 pro 执行方式，而 `reasoning.effort` 用于控制模型在该模式下的推理量。如果省略 `reasoning.effort`,GPT-5.6 在两种模式下都默认为 `medium` 。

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


Pro 模式会汇总生成最终答案所执行的模型工作，并按所选模型的标准 [token 费率](https://developers.openai.com/api/docs/pricing)。计费。Pro 模式比标准模式执行更多模型工作，因此会增加 token 用量和成本。现有 Pro 模型 ID 保持其当前行为和定价不变。

## 推理工作原理

推理模型会引入 **reasoning tokens** 作为输入和输出 token 之外的补充。模型使用这些 reasoning tokens 来“思考”，拆解提示并考虑生成回复的多种方案。我们的推理模型（例如 `gpt-5.5` 和 `gpt-5.4` 支持交错思维，模型能够在思考前后及思考之间生成可见的输出 token，并能在工具调用之间进行思考。

对于 GPT-5.6 之前发布的模型，在多步对话中的默认行为是沿用每一步的输入和输出 token，而不会将之前轮次的推理渲染到下一次采样中。GPT-5.6 模型则默认会渲染之前轮次中可用的推理。请使用 `reasoning.context` 在支持的模型上选择相应的行为。

![包含当前轮次上下文的 reasoning tokens](https://cdn.openai.com/API/docs/images/context-window.png)

虽然 reasoning tokens 无法通过 API 查看，但它们仍会占用
  模型的上下文窗口空间，并按 [output
  tokens](https://openai.com/api/pricing).

## 控制成本

若要使用推理模型管理成本，你可以通过限制模型生成的令牌总数来实现，其中
包括推理令牌、可见输出令牌和不可见
格式设置令牌，方法是使用
[`max_output_tokens`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-max_output_tokens)
参数。请参阅 [输出令牌计数](https://developers.openai.com/api/docs/guides/token-counting#understand-output-token-counts) ，了解生成令牌如何反映在使用情况和输出限制中。

### 管理上下文窗口

在创建响应时，确保上下文窗口中有足够的空间来容纳推理 tokens，这一点很重要。根据问题的复杂度，模型可能生成从几百到几万个不等的推理 tokens。实际使用的推理 tokens 数量可以在 [响应对象的 usage 对象](https://developers.openai.com/api/reference/resources/responses)，中的 `output_tokens_details`:

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

上下文窗口长度可在 [模型参考页面](https://developers.openai.com/api/docs/models)，中找到，不同模型快照会有所不同。

### Allocating space for reasoning

如果生成的 token 达到上下文窗口限制或你 `max_output_tokens` 设置的值，你将收到一个 `status` 为 `incomplete` 和 `incomplete_details` 且 `reason` 设置为 `max_output_tokens`。的响应。这可能在生成任何可见的输出 token 之前就发生，意味着你可能会为输入和推理 token 付费，却收不到任何可见的响应。

为避免这种情况，请确保上下文窗口有足够的空间，或调高 `max_output_tokens` 的值。OpenAI 建议你在开始试验这些模型时，至少为推理和输出预留 25,000 个 token。随着你熟悉提示所需的推理 token 数量，可以相应地调整这一缓冲区大小。

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
  reasoning: {effort: :medium},
  input: prompt
)

if response.status == OpenAI::Responses::ResponseStatus::INCOMPLETE
  puts("Ran out of tokens")
  puts("Partial output: #{response.output_text}") unless response.output_text.empty?
end
```


## 跨调用保留推理

会话状态和推理状态用途不同。跨调用传递消息可为模型提供可见的会话历史。在支持的模型上，持久化的推理还允许模型将先前轮次中兼容的推理项渲染到下一轮上下文中。

持久化推理提供延续，但不会暴露模型的原始推理。推理项保持不透明，API 不会返回其推理文本。可通过设置 `reasoning.context` 来控制模型可以使用哪些可用的推理项：

该 [GPT-5.6 model family](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)
  支持
  `all_turns` 并默认使用它。早期模型默认使用
  `current_turn`。省略 `reasoning.context` 或将其设置为
  `auto` 以使用所选模型的默认值。

| 值          | 行为                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auto`         | 使用所选模型的默认值。省略 `reasoning.context` 与以下设置效果相同： `auto`.                            |
| `current_turn` | 使当前轮次的推理可用，但不会将更早轮次的推理渲染到下一个采样中。    |
| `all_turns`    | 将来自更早轮次且兼容的推理项渲染到下一个采样中。GPT-5.6 模型支持此值。 |

响应的 `reasoning.context` 字段包含实际生效的模式，可能是 `current_turn` 或 `all_turns`。请在每次响应中检查该字段，以确认模型所使用的模式。该设置不会创建原本不可用的推理条目。

`all_turns` 仅在请求能够访问更早的响应条目时才有效。可通过以下方式提供历史 `previous_response_id`：将响应附加到会话，或手动回放完整的响应历史。在首次请求时， `current_turn` 和 `all_turns` 行为相同，因为此时不存在更早的推理。

持久化的推理只能在同一模型族内复用。例如， `gpt-5.6-sol`, `gpt-5.6-terra`，以及 `gpt-5.6-luna` 之间可以互相复用推理，但推理不会在 GPT-5.6 与 GPT-5.5 模型族之间传递。

当你切换模型族时，API 会从模型上下文中省略不兼容的推理，即使 `reasoning.context` 为 `all_turns`.

### 使用已存储的响应继续推理

使用 `previous_response_id` 以实现最短的有状态集成：

通过上一响应保留推理

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


使用 `current_turn` 用于在回放模型不再需要的较旧响应条目时。那些推理条目可以保留在 API 负载中以保持连续性，但服务端不会将它们渲染到新样本中。这可以减少长时间运行的工作流的渲染上下文。

### 保留推理但不存储响应

当你在无状态模式下创建响应时，响应中的推理项默认包含 `output` 属性。无状态模式适用于以下情况： `encrypted_content` 属性（当你的组织使用 Zero Data Retention (ZDR) 时）。该 API 仍然接受旧版 `store` 为 `false` 或当你的组织使用 Zero Data Retention (ZDR) 时。该 接口 仍然接受旧版 `reasoning.encrypted_content` 值， `include` 为了兼容性，但并不要求必须传入。

以下请求在不指定的情况下返回加密后的推理内容： `include`:

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


响应中的推理项 `output` 数组将包含一个 `encrypted_content` 属性，其中包含你可以传递给后续调用的加密推理 token。

要使用 `all_turns` 且 `store: false`，请保留所有输出项，追加下一条用户消息，并重放完整历史记录：

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


### 在上下文中保留推理项

在进行 [function calling](https://developers.openai.com/api/docs/guides/function-calling) 与推理模型时,我们强烈建议你将上一次函数调用返回的所有推理项(以及函数的输出)一并回传。如果模型连续调用了多个函数,你应该回传所有的推理项、函数调用项和函数调用输出项,因为最后的 [Responses API](https://developers.openai.com/api/reference/resources/responses),我们强烈建议你将上一次函数调用返回的所有推理项(以及函数的输出)一并回传。如果模型连续调用了多个函数,你应该回传所有的推理项、函数调用项和函数调用输出项,因为最后的 `user` 消息。这可以让模型以最具 token 效率的方式继续其推理过程,从而产生更好的结果。

最简单的做法是将上一次响应中的所有推理项传入下一次响应。我们的系统会智能地忽略与你的函数无关的推理项,只保留上下文中相关的部分。你可以通过 `previous_response_id` 参数传入,也可以手动将上一次响应中的所有 [output](https://developers.openai.com/api/reference/resources/responses#responses/object-output) 项传入下一次响应的 [input](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-input) 中。

对于在传入下一次响应之前可能需要截断和优化上下文窗口部分内容的高级用例,只需确保最后一条用户消息和你的函数调用输出之间的所有项都原封不动地传入下一次响应。这将确保模型拥有所需的全部上下文。

查看 [本指南](https://developers.openai.com/api/docs/guides/conversation-state) 以详细了解手动上下文管理。

## 在对话中途更改推理方式

使用 `configuration_update` 以在处理困难工作时提高推理强度，或在常规跟进时降低推理强度。在响应之间添加更新，同时保持请求级别的 `reasoning.effort` 不变。这保留了原始的提示前缀，以用于 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).

配置更新仅由 GPT-6 Astra (`gpt-6-astra`) 在
  标准、单一智能体 模式下支持。它们仅更改推理强度。

在 HTTP Responses 请求或 WebSocket `input` 请求的 input 数组中、下一个用户消息之前添加以下项： `response.create` request:

```json
{
  "type": "configuration_update",
  "reasoning": {
    "effort": "high"
  }
}
```

例如，如果对话以请求级别 effort 开头 `low`，此更新会选择 `high` 用于下一次响应及后续响应，直到另一次更新将其覆盖。

为跟进提高推理强度

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


使用以下方式保留更新 `previous_response_id`，或在手动管理对话历史时 [按其原始位置重放它们](https://developers.openai.com/api/docs/guides/conversation-state#manually-manage-conversation-state)。响应的 `reasoning.effort` 继续报告请求级别的设置，而不是更新所选择的 effort。

不要将两个 `configuration_update` 项直接相邻地放在对话历史中；API 会拒绝相邻的更新。

不要将配置更新与自动压缩或自动截断合并使用。独立的 `/responses/compact` 端点也会拒绝包含这些更新的历史记录。

你仍然可以在 `compaction_trigger` 请求中包含一个 `/responses` 项来显式压缩历史。压缩之后，在下一条用户消息之前添加一个新的 `configuration_update` 并指定所需的 effort。

正常的提示缓存要求仍然适用。若要在响应运行期间发送用户指令，请使用 [中途引导](https://developers.openai.com/api/docs/guides/steering).

## Reasoning summaries

虽然我们不会暴露模型生成的原始推理令牌，但你可以通过以下方式查看模型推理的摘要： `summary` 参数。请参阅我们的 [模型文档](https://developers.openai.com/api/docs/models) 以了解哪些推理模型支持摘要。

不同的模型支持不同的推理摘要设置。例如，我们的 computer use 模型支持 `concise` 摘要器，而 o4-mini 支持 `detailed`。若要访问某个模型可用的最详细的摘要器，请将此参数的值设置为 `auto`. `auto` 将等同于 `detailed` （对于当前的大多数推理模型而言），但未来可能会有更细粒度的设置。

推理摘要输出是 `summary` 数组的一部分，位于 `reasoning` [输出项](https://developers.openai.com/api/reference/resources/responses#responses/object-output)。中。除非你明确选择包含推理摘要，否则该输出不会被包含进来。

下面的示例展示了如何发出一个包含推理摘要的 API 请求。

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
  reasoning: {effort: :low, summary: :auto}
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

在将摘要器与我们最新的推理模型配合使用之前，你可能需要
  完成 [组织
  验证](https://help.openai.com/en/articles/10910291-api-organization-verification)
  以确保安全部署。开始在 [平台
  设置页面](https://platform.openai.com/settings/organization/general).

## `phase` parameter

对于在 Responses API 中使用 GPT-5.5 和 GPT-5.4 的长时间运行或工具密集型工作流，使用 assistant 消息 `phase` 字段以避免提前停止和其他异常行为。
`phase` 在 API 级别是可选的，但 OpenAI 推荐使用它。可使用 `phase: "commentary"` 提供中间助手更新，例如工具调用前的开场白，以及 `phase: "final_answer"` 用于已完成答案。不要向 `phase` 用户消息添加。
使用 `previous_response_id` 通常是最简单的路径，因为会保留先前的助手状态。如果手动重放助手历史记录，请保留每个原始 `phase` 值。
缺失或丢失的 `phase` 可能导致这些工作流中的开场白被当作最终答案。有关特定模型的提示指南，请参阅 [提示 GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#prompting-best-practices).

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

在对推理模型进行提示时，请考虑这些差异。具备推理能力的 GPT-5 模型通常在以下场景下表现最佳：为其设定明确的目标、给出严格的约束，并提供明确的输出契约，同时不必规定每一个中间步骤。

- 向模型提供任务、约束条件和期望的输出格式。
- 处理 `reasoning.effort` 作为调节旋钮，而不是恢复质量的主要方式。
- 对于智能体或研究型工作流，明确什么情况算完成，以及模型应如何验证其工作。

有关使用推理模型时最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

### 提示词示例



Coding (refactoring)

    

OpenAI o-series 模型能够实现复杂的算法并生成代码。该提示要求 o1 根据一些特定的标准重构一个 React 组件。




  Refactor code

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


  

  

    
Coding (planning)

    

OpenAI o-series 模型同样擅长创建多步骤计划。该示例提示要求 o1 为完整解决方案创建一个文件系统结构，并附带实现预期用例的 Python 代码。




  Plan and create a Python project

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


  

  

    
STEM Research

    

OpenAI o-series 模型在 STEM 研究中表现卓越。要求支持基础研究任务的提示应当能取得出色的效果。




  Ask questions related to basic scientific research

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

使用推理模型处理真实场景的示例可在 [cookbook 中找到](https://developers.openai.com/cookbook).

[使用推理进行数据校验



      Evaluate a synthetic medical data set for discrepancies.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_data_validation)

[使用推理生成日常任务



      Use help center articles to generate actions that an agent could perform.](https://developers.openai.com/cookbook/examples/o1/using_reasoning_for_routine_generation)