# 使用 GPT-5.2

> 完整的文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.2 作为面向通用任务和智能体任务的旗舰模型发布。相比 GPT-5.1，它在以下方面有所改进：

- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端界面创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建

与之前的 GPT-5.1 模型不同，GPT-5.2 提供了用于管理模型“已知”和“记忆”内容的新功能，以提高准确性。

本指南涵盖 GPT-5 模型系列的关键特性，以及如何充分发挥 GPT-5.2 的性能。

## 探索代码示例

点击浏览一些仅凭单个提示就完整生成的示例应用，无需手动编写任何代码。请注意，这些示例要么由 GPT-5.2 生成，要么由我们之前的旗舰模型 GPT-5 生成。

## Model、API 和功能更新

GPT-5.2 系列包含 `gpt-5.2` 用于需要广泛世界知识的复杂任务， `gpt-5.2-chat-latest` 用于与 ChatGPT 对齐的行为，以及 `gpt-5.2-pro` 用于受益于更多算力的问题。

如需更小的模型，请使用 `gpt-5-mini`.

为了帮助你挑选最适合用例的模型，请考虑以下权衡：

| 变体                                           | 最适用于                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`gpt-5.2`](https://developers.openai.com/api/docs/models/gpt-5.2)             | 复杂推理、广泛的世界知识，以及代码密集或多步骤的智能体任务 |
| [`gpt-5.2-pro`](https://developers.openai.com/api/docs/models/gpt-5.2-pro)     | 可能需要更长求解时间但要求更深思考的难题             |
| [`gpt-5.2-codex`](https://developers.openai.com/api/docs/models/gpt-5.2-codex) | 构建交互式编码产品的公司；覆盖全谱系的编码任务        |
| [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)       | 成本优化的推理和对话；在速度、成本和能力之间取得平衡              |
| [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano)       | 高吞吐量任务，尤其是聚焦的指令遵循或分类    |

### GPT-5.2 中的新功能

与 GPT-5.1 一样，全新的 GPT-5.2 同样提供自定义工具、可控制详细程度与推理强度的参数以及允许使用的工具列表等 API 功能。5.2 的全新特性是一项新的 `xhigh` 推理强度等级、简洁的推理摘要，以及通过 _压缩_.

本指南将介绍 GPT-5 模型系列的一些关键特性，以及如何充分发挥 5.2 的优势。

对于编码任务，GPT-5.2-Codex 是我们在 Codex 或类 Codex 环境中面向智能体工作流的编码优化版本。

### 较低的推理力度

该 `reasoning.effort` 参数控制模型在生成响应之前生成的推理 token 数量。早期的推理模型（如 o3）仅支持 `low`, `medium`，并且 `high`: `low` 更倾向于速度和更少的 token，而 `high` 倾向于更充分的推理。

在 GPT-5.2 中，最低设置为 `none` 以提供更低延迟的交互。这是 GPT-5.2 中的默认设置。如果你需要更多思考，可以缓慢提升至 `medium` 并试验结果。

当推理力度设置为 `none`，时，提示工程很重要。为了提升模型的推理质量，即使使用默认设置，也应鼓励它先“思考”或先列出步骤再作答。

推理力度设置为 none

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.2",
  input:
    "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none",
  },
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.2",
    input="Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
    reasoning={"effort": "none"},
)

print(response)
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
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.2",
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String("Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?")},
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortNone},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
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
        .model("gpt-5.2")
        .input("Explain the bug and propose a fix.")
        .reasoning(Reasoning.builder().effort(ReasoningEffort.NONE).build())
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

CreateResponseOptions options = new()
{
    Model = "gpt-5.2",
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.None,
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?"
    )
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.2",
  reasoning: { effort: :minimal },
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-type: application/json' \
  --data '{
        "model": "gpt-5.2",
        "input": "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
        "reasoning": {
                "effort": "none"
        }
}'
```


### Verbosity

冗长度决定了生成的输出 token 数量。减少 token 数量可以降低整体延迟。虽然模型的推理方式基本保持不变，但模型会找到更简洁的方式来回答——这可能会提升或降低回答质量，具体取决于你的使用场景。以下是冗长度光谱两端的几种场景：

- **高详细度：** 在需要模型对文档提供详尽解释或进行大量代码重构时使用。
- **低详细度：** 最适合需要简洁回答或聚焦式代码生成的场景，例如 SQL 查询。

GPT-5 将此选项设为可配置，可选择 `high`, `medium`，或 `low`。在 GPT-5.2 中，详细程度仍然可配置，默认值为 `medium`.

使用 GPT-5.2 生成代码时， `medium` 和 `high` 详细程度会生成更长、结构更清晰的代码并附带内联解释，而 `low` 详细程度则会生成更短、更简洁的代码，仅含极少说明。

控制详细程度

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.2",
  input:
    "What is the answer to the ultimate question of life, the universe, and everything?",
  text: {
    verbosity: "low",
  },
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.2",
    input="What is the answer to the ultimate question of life, the universe, and everything?",
    text={"verbosity": "low"},
)

print(response)
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
		Model: "gpt-5.2",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is the answer to the ultimate question of life, the universe, and everything?")},
		Text:  responses.ResponseTextConfigParam{Verbosity: responses.ResponseTextConfigVerbosityLow},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseTextConfig;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.2")
        .input("Explain the bug and propose a fix.")
        .text(ResponseTextConfig.builder().verbosity(ResponseTextConfig.Verbosity.LOW).build())
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
  model: "gpt-5.2",
  text: { verbosity: :low },
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-type: application/json' \
  --data '{
  "model": "gpt-5.2",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```


即使将详细程度设置为 `low` ，你仍然可以通过提示语在 API 中引导详细程度。详细程度参数在系统提示层面定义了一个通用的 token 范围，但实际输出在该范围内对开发者和用户提示都保持灵活。

### 在 GPT-5.2 中使用工具

GPT-5.2 已针对特定工具进行了后训练。参见 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

#### apply patch 工具

该 `apply_patch` 该工具让 GPT-5.2 能够使用结构化差异在你的代码库中创建、更新和删除文件。模型不再仅仅建议编辑，而是发出补丁操作，由你的应用执行后再回报结果，从而支持迭代式、多步骤的代码编辑工作流。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-apply-patch).

在底层，此实现使用了自由格式函数调用而非 JSON 格式。在测试中，使用具名函数将 `apply_patch` 失败率降低了 35%。

#### Shell 工具

GPT-5.2 支持本地 shell。shell 工具允许模型通过受控的命令行界面与你的本地计算机进行交互。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-shell) 了解更多信息。

### 自定义工具

随着 GPT-5 模型系列的发布，我们引入了一项名为自定义工具（custom tools）的新能力，它允许模型将任意原始文本作为工具调用输入发送，同时在需要时仍可约束输出。该工具行为在 GPT-5.2 中依然成立。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### 自由格式输入

使用以下方式定义你的工具 `type: custom` 以使模型能够将明文输入直接发送到你的工具，而不仅限于结构化 JSON。模型可以将任何原始文本——代码、SQL 查询、shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.2 支持上下文无关文法（`CFGs`），可用于自定义工具，让你提供 Lark 文法以将输出限制为特定语法或 DSL。例如，附加 CFG（如 SQL 或 DSL 文法）可确保助手生成的文本与你的文法匹配。

这使得工具调用或结构化响应能够精确、受约束，并让你在 GPT-5.2 的函数调用中直接强制执行严格的语法或领域特定格式，从而提升在复杂或受限场景下的可控性与可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述决定发送什么内容；如果你希望它始终调用该工具，请明确说明。
- **在服务端验证输出**。自由格式字符串虽然强大，但需要防范提示注入或不安全命令的风险。

### Allowed tools

该 `allowed_tools` 下的参数 `tool_choice` 允许你传入 N 个工具定义，但将模型限制为仅使用其中的 M 个（&lt; N）个。在 `tools`，中列出你的完整工具包，然后使用 `allowed_tools` 块来指定该子集并设定模式——可以是 `auto` （模型可以从这些工具中任选其一），也可以是 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可能的工具与当前可用的子集分开 _现在_，你可以获得更高的安全性、可预测性，并改进提示缓存效果。你还可以避免脆弱的提示工程，例如硬编码的调用顺序。GPT-5.2 能在对话中动态调用或要求特定函数，同时降低在长上下文中意外调用工具的风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的能力范围 | 下列所列的全部工具 **`"tools": […]`** | 仅限下列的子集 **`"tools": […]`** 中 **`tool_choice`** |
| 工具调用  | 模型可调用也可不调用任何工具        | 模型被限定（或被要求）只能调用所选的工具        |
| 用途          | 声明可用的能力            | 限制实际会使用的能力                |

```json
{
  "tool_choice": {
    "type": "allowed_tools",
    "mode": "auto",
    "tools": [
      { "type": "function", "name": "get_weather" },
      { "type": "function", "name": "search_docs" }
    ]
  }
}
```

有关所有这些新功能的更详细概述，请参阅 [配套 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide).

### 前言

前言是 GPT-5.2 在调用任何工具或函数之前生成的简短、面向用户的说明，用于概述其意图或计划——例如“为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.2 在每次工具调用前“边想边说”，前言可以提高工具调用的准确性（以及整体任务成功率），而不会增加推理开销。若要启用前言，请添加系统或开发者指令——例如：“在调用工具之前，先解释你为什么要调用它。”GPT-5.2 会为每个指定的工具调用添加简洁的理由说明。模型还可能在工具调用之间输出多条消息，从而提升交互体验——尤其适用于低推理或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.2 与 Responses API 配合效果最佳，该 接口 支持在多轮对话之间保留推理上下文。请阅读下文，了解如何从当前模型或 API 迁移过来。

### 从其他模型迁移到 GPT-5.2

虽然该模型应可作为 GPT-5.1 的近似直接替代品，但仍有一些关键变化需要指出。请参阅 [GPT-5.2 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide) ，了解需要在提示中做出的具体更新。

将 GPT-5 模型与 Responses API 配合使用，由于 API 的设计，能够获得更强的智能表现。Responses API 可以将上一轮的 CoT 传递给模型。这会带来更少的推理 token 生成、更高的缓存命中率以及更低的延迟。要了解更多信息，请参阅一篇 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) ，了解 Responses API 的优势。

从较旧的 OpenAI 模型迁移到 GPT-5.2 时，建议从尝试不同的推理强度和提示策略开始。根据我们的测试，建议使用我们的 [提示优化器](https://platform.openai.com/chat/edit?models=gpt-5.2&optimize=true)——它会根据我们的最佳实践自动为 GPT-5.2 更新你的提示——并遵循以下针对该模型的指引：

- **`gpt-5.1`**: `gpt-5.2` 在默认设置下旨在作为直接替代品。
- **o3**: `gpt-5.2` 配合 `medium` 或 `high` 推理。从 `medium` 结合提示调优的推理开始,然后提升到 `high` 如果未获得预期结果。
- **`gpt-4.1`**: `gpt-5.2` 配合 `none` 推理。从 `none` 并调优你的提示;如果需要更好的性能则增加。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5-mini` 结合提示调优是很好的替代方案。
- **`gpt-4.1-nano`**: `gpt-5-nano` 结合提示调优是很好的替代方案。

### GPT-5.2 参数兼容性

以下参数 **仅在** 使用 GPT-5.2 且将推理 effort 设置为 `none`:

- `temperature`
- `top_p`
- `logprobs`

对 GPT-5.2 或 GPT-5.1 使用任何其他推理 effort 设置，或对更早的 GPT-5 模型——例如， `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`——发起的请求如果包含这些字段将报错。

若要在更高的推理 effort 设置下，或在另一个 GPT-5 系列模型上获得类似效果，请尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的区别，也是从 Chat Completions 迁移到 Responses API 以使用 GPT-5.2 的主要原因，在于支持在多个回合之间传递思维链（CoT）。请参阅完整 [的 API 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅在 Responses API 中支持，我们观察到这样做带来了更高的智能水平、更少的生成推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数保持一致，但格式有所不同。下面介绍 Chat Completions 与 Responses API 之间处理新参数的方式差异：

**推理努力程度**



Responses API

    Generate response with reasoning effort set to none

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "input": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  "reasoning": {
    "effort": "none"
  }
}'
```

  

  

    
Chat Completions

    Generate response with reasoning effort set to none

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "messages": [
    {
      "role": "user",
      "content": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?"
    }
  ],
  "reasoning_effort": "none"
}'
```



**详细程度**



Responses API

    Control verbosity

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```

  

  

    
Chat Completions

    Control verbosity

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "messages": [
    {
      "role": "user",
      "content": "What is the answer to the ultimate question of life, the universe, and everything?"
    }
  ],
  "verbosity": "low"
}'
```



**自定义工具**



Responses API

    Custom tool call

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "input": "Use the code_exec tool to calculate the area of a circle with radius equal to the number of r letters in blueberry",
  "tools": [
    {
      "type": "custom",
      "name": "code_exec",
      "description": "Executes arbitrary Python code"
    }
  ]
}'
```

  

  

    
Chat Completions

    Custom tool call

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.2",
  "messages": [
    {
      "role": "user",
      "content": "Use the code_exec tool to calculate the area of a circle with radius equal to the number of r letters in blueberry"
    }
  ],
  "tools": [
    {
      "type": "custom",
      "custom": {
        "name": "code_exec",
        "description": "Executes arbitrary Python code"
      }
    }
  ]
}'
```



## 提示工程最佳实践

### 2. 关键行为差异

**与前代模型（例如 GPT-5 和 GPT-5.1）相比，GPT-5.2 带来了以下改进：**

- **更审慎的脚手架：** 默认情况下会构建更清晰的规划与中间结构；得益于明确的范围与冗长度约束。
- **通常更低的冗长度：** 更简洁、更聚焦于任务，但仍然对提示敏感，需要在提示中明确表达偏好。
- **更强的指令遵循：** 更少偏离用户意图；格式化和理由阐述有所改进。
- **工具效率权衡：** 在交互流程中相比 GPT-5.1 会执行额外的工具动作，可通过提示进一步优化。
- **保守的落地倾向：** 倾向于优先保证正确性与显式推理；通过澄清提示可改善歧义处理。

本指南侧重于如何通过提示词充分发挥 GPT-5.2 的优势 —— 更高的智能、准确性、扎实度和纪律性 —— 同时缓解其仍然存在的低效问题。现有针对 GPT-5 / GPT-5.1 的提示词指南大体仍然适用，并可直接沿用。

### 3. 提示模式

将以下主题适配到你的提示中，以便更好地引导 GPT-5.2

#### 3.1 控制详细程度与输出形态

给出 **清晰且具体的长度约束** 尤其是在企业和编码场景下的智能体中。

示例：根据期望的详细程度调整 clamp：

```text
<output_verbosity_spec>
- Default: 3–6 sentences or ≤5 bullets for typical answers.
- For simple “yes/no + short explanation” questions: ≤2 sentences.
- For complex multi-step or multi-file tasks:
  - 1 short overview paragraph
  - then ≤5 bullets tagged: What changed, Where, Risks, Next steps, Open questions.
- Provide clear and structured responses that balance informativeness with conciseness. Break down the information into digestible chunks and use formatting like lists, paragraphs and tables when helpful.
- Avoid long narrative paragraphs; prefer compact bullets and short sections.
- Do not rephrase the user’s request unless it changes semantics.
</output_verbosity_spec>
```

#### 3.2 防止范围漂移（例如，前端任务中的 UX / 设计）

GPT-5.2 在结构化代码方面更强，但可能会生成超出最小 UX 规范和设计系统所需的更多代码。为保持范围，请明确禁止额外功能和不受控的样式。

```text
<design_and_scope_constraints>
- Explore any existing design systems and understand it deeply.
- Implement EXACTLY and ONLY what the user requests.
- No extra features, no added components, no UX embellishments.
- Style aligned to the design system at hand.
- Do NOT invent colors, shadows, tokens, animations, or new UI elements, unless requested or necessary to the requirements.
- If any instruction is ambiguous, choose the simplest valid interpretation.
</design_and_scope_constraints>
```

为了加强设计系统的执行，重复使用你的 5.1 `<design_system_enforcement>` 代码块，并加上“no extra features”和“tokens-only colors”以进一步强调。

#### 3.3 长上下文与回忆

对于长上下文任务，提示词可以从以下方式中受益 **强制摘要与重新接地**。这种模式可以减少“滚动中迷失”类错误，并提升对密集上下文的召回效果。

```text
<long_context_handling>
- For inputs longer than ~10k tokens (multi-chapter docs, long threads, multiple PDFs):
  - First, produce a short internal outline of the key sections relevant to the user’s request.
  - Re-state the user’s constraints explicitly (e.g., jurisdiction, date range, product, team) before answering.
  - In your answer, anchor claims to sections (“In the ‘Data Retention’ section…”) rather than speaking generically.
- If the answer depends on fine details (dates, thresholds, clauses), quote or paraphrase them.
</long_context_handling>
```

#### 3.4 处理歧义与幻觉风险

针对模糊查询（例如需求不明确、缺少约束条件，或需要新数据但未调用任何工具的问题）中的过度自信幻觉，配置相应的提示词。

缓解提示词：

```text
<uncertainty_and_ambiguity>
- If the question is ambiguous or underspecified, explicitly call this out and:
  - Ask up to 1–3 precise clarifying questions, OR
  - Present 2–3 plausible interpretations with clearly labeled assumptions.
- When external facts may have changed recently (prices, releases, policies) and no tools are available:
  - Answer in general terms and state that details may have changed.
- Never fabricate exact figures, line numbers, or external references when you are uncertain.
- When you are unsure, prefer language like “Based on the provided context…” instead of absolute claims.
</uncertainty_and_ambiguity>
```

你还可以为高风险输出添加一个简短的自我检查步骤：

```text
<high_risk_self_check>
Before finalizing an answer in legal, financial, compliance, or safety-sensitive contexts:
- Briefly re-scan your own answer for:
  - Unstated assumptions,
  - Specific numbers or claims not grounded in context,
  - Overly strong language (“always,” “guaranteed,” etc.).
- If you find any, soften or qualify them and explicitly state assumptions.
</high_risk_self_check>
```

### 4. 压缩 (扩展有效上下文)

对于超出标准上下文窗口的长时间运行、工具密集型工作流，支持 Reasoning 的 GPT-5.2 可通过 /responses/compact 端点进行响应压缩。压缩会对先前的对话状态执行一次具备感知损失的压缩过程，返回经过加密、不透明的消息项，在保留任务相关信息的同时大幅缩减 token 占用。这使得模型能够在扩展工作流中持续进行推理，而不会触及上下文限制。

**何时使用压缩**

- 包含大量工具调用的多步智能体工作流
- 需要保留较早轮次的长对话
- 超出最大上下文窗口的迭代推理

**关键属性**

- 生成不透明且已加密的项（内部逻辑可能会演进）
- 设计用于延续，而非供检查
- 与 GPT-5.2 和Responses API兼容
- 可在长时间会话中安全地重复运行

**压缩响应**

端点

```text
POST https://api.openai.com/v1/responses/compact
```

**功能说明**

对一次对话运行压缩流程，并返回一个已压缩的响应对象。将压缩后的输出传入下一次请求，以在缩减上下文大小的同时工作流。

**最佳实践**

- 监控上下文使用情况并提前规划，以避免触及上下文窗口限制
- 在重大里程碑（例如工具密集阶段）之后进行压缩，而不是每轮都压缩
- 恢复时保持提示在功能上完全一致，以避免行为漂移
- 将压缩后的内容视为不透明对象；不要解析其内部结构或依赖其内部实现

如需了解在生产环境中压缩对话的时机与方式，请参阅 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses) 指南与 [压缩响应](https://developers.openai.com/api/reference/resources/responses/methods/compact) 页面。

下面是一个示例：

```python
from openai import OpenAI
import json


client = OpenAI()


response = client.responses.create(
    model="gpt-5.2",
    input=[
        {
            "role": "user",
            "content": "write a very long poem about a dog.",
        },
    ],
)


output_json = [msg.model_dump() for msg in response.output]


# Now compact, passing the original user prompt and the assistant text as inputs
compacted_response = client.responses.compact(
    model="gpt-5.2",
    input=[
        {
            "role": "user",
            "content": "write a very long poem about a dog.",
        },
        output_json[0],
    ],
)


print(json.dumps(compacted_response.model_dump(), indent=2))
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCompactParams;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var input = new ArrayList<ResponseInputItem>();
input.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Write a very long poem about a dog.")
            .build()));
var response =
    client
        .responses()
        .create(ResponseCreateParams.builder().model("gpt-5.2").inputOfResponse(input).build());
response.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(input::add);
var compacted =
    client
        .responses()
        .compact(
            ResponseCompactParams.builder()
                .model("gpt-5.2")
                .inputOfResponseInputItems(input)
                .build());
System.out.println(compacted.output());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.2",
  input: [
    {
      role: :user,
      content: "Write a very long poem about a dog."
    }
  ]
)
compaction = client.responses.compact(
  model: "gpt-5.2",
  input: [
    {
      role: :user,
      content: "Write a very long poem about a dog."
    },
    *response.output
  ]
)

puts(compaction.output)
```


### 5. 智能体的可控性与用户更新

GPT-5.2 在智能体脚手架和多步执行方面表现强劲，前提是提示得当。你可以复用 GPT-5.1 的 `<user_updates_spec>` 和 `<solution_persistence>` 代码块。

可以加入两项关键调整，进一步提升 GPT-5.2 的性能：

- 限制更新内容的措辞长度（更简短、更聚焦）。
- 明确范围规范（不要扩大问题覆盖面）。

已更新的示例规范：

```text
<user_updates_spec>
- Send brief updates (1–2 sentences) only when:
  - You start a new major phase of work, or
  - You discover something that changes the plan.
- Avoid narrating routine tool calls (“reading file…”, “running tests…”).
- Each update must include at least one concrete outcome (“Found X”, “Confirmed Y”, “Updated Z”).
- Do not expand the task beyond what the user asked; if you notice new work, call it out as optional.
</user_updates_spec>
```

### 6. 工具调用与并行

GPT-5.2 在工具可靠性和脚手架方面相较 5.1 有所改进，尤其是在 MCP/Atlas 风格的环境中。
适用于 GPT-5 / 5.1 的最佳实践：

- 简洁描述工具：用 1–2 句话说明它们的功能以及何时使用。
- 在扫描代码库、向量存储或多实体操作时，明确鼓励并行处理。
- 对高影响操作（订单、计费、基础设施变更）要求进行验证步骤。

示例工具使用部分：

```text
<tool_usage_rules>
- Prefer tools over internal knowledge whenever:
  - You need fresh or user-specific data (tickets, orders, configs, logs).
  - You reference specific IDs, URLs, or document titles.
- Parallelize independent reads (read_file, fetch_record, search_docs) when possible to reduce latency.
- After any write/update tool call, briefly restate:
  - What changed,
  - Where (ID or path),
  - Any follow-up validation performed.
</tool_usage_rules>
```

### 7. 结构化提取、PDF 和 Office 工作流

这是 GPT-5.2 显著改进的一个方面。要充分发挥其优势：

- 始终为输出提供 schema 或 JSON 结构。你可以使用结构化输出来严格遵循 schema。
- 区分必填字段和可选字段。
- 要求“提取完整性”，并显式处理缺失字段。

示例：

```text
<extraction_spec>
You will extract structured data from tables/PDFs/emails into JSON.

- Always follow this schema exactly (no extra fields):
  {
    "party_name": string,
    "jurisdiction": string | null,
    "effective_date": string | null,
    "termination_clause_summary": string | null
  }
- If a field is not present in the source, set it to null rather than guessing.
- Before returning, quickly re-scan the source for any missed fields and correct omissions.
</extraction_spec>
```

对于多表/多文件提取，请添加以下指导：

- 对每个文档的结果单独序列化。
- 包含一个稳定的 ID（文件名、合同标题、页码范围）。

### 8. GPT-5.2 提示词迁移指南

本节帮助你将提示和模型配置迁移到 GPT-5.2，同时保持行为稳定且成本/延迟可预期。GPT-5 系列模型支持 reasoning_effort 旋钮（例如 none|minimal|low|medium|high|xhigh），用于在速度/成本与更深层推理之间进行权衡。

迁移映射
升级到 GPT-5.2 时，请使用以下默认映射

| 当前模型 | 目标模型 | 目标 reasoning_effort          | 备注                                                                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GPT-4o        | GPT-5.2      | none                             | 默认将 4o/4.1 的迁移视为“快速/低推理量”；仅在评估结果回退时才提高推理量。 |
| GPT-4.1       | GPT-5.2      | none                             | 与 GPT-4o 的映射相同，以保持响应迅速的特性。                                                   |
| GPT-5         | GPT-5.2      | 相同取值，仅 minimal 映射为 none | 保留 none/low/medium/high，以保持延迟与质量表现一致。                             |
| GPT-5.1       | GPT-5.2      | 相同取值                       | 保留现有的推理量选择；仅在运行评估后再调整。                                  |

\*请注意，GPT-5 的默认推理等级为 medium，GPT-5.1 和 GPT-5.2 的默认推理等级为 none。

我们在 Playground 中推出了 [Prompt Optimizer](https://platform.openai.com/chat/edit?optimize=true) ，以帮助用户快速改进现有提示，并将其迁移到 GPT-5 及其他 OpenAI 模型。迁移到新模型的一般步骤如下：

- 第 1 步：切换模型，但先不要更改提示词。保持提示词在功能上完全一致，这样你测试的是模型变更，而不是提示词编辑。每次只改动一处。
- 第 2 步：固定 reasoning_effort。显式设置 GPT-5.2 的 reasoning_effort，以匹配先前模型的时延/深度特征（避免提供商默认的 “thinking” 陷阱，否则会扭曲成本、冗长度和结构）。
- 第 3 步：运行 Evals 获取基线。在模型与 effort 对齐后，运行你的评测套件。如果结果看起来不错（在 medium/high 时通常更佳），就可以发布了。
- 第 4 步：如果出现回归，则调整提示词。使用 Prompt Optimizer 与针对性约束（冗长度/格式/模式、范围纪律）来恢复同等水平或进一步改善。
- 第 5 步：每次小幅改动后重新运行 Evals。每次迭代要么将 reasoning_effort 提升一档，要么对提示词进行增量微调——然后重新测量。

### 9. 网页搜索与研究

GPT-5.2 在跨多源信息合成方面更具可控性，也更强大。

建议遵循以下最佳实践：

- 预先指定研究范围：告诉模型你希望如何执行搜索。是否要追踪二阶线索、解决矛盾并附上引用。明确说明要深入到何种程度，例如：额外研究应持续到边际价值下降为止。

- 通过指令而非提问来约束模糊性：指示模型全面覆盖所有可能的意图，不要提出澄清性问题。在存在不确定性时，要求兼具广度与深度。

- 规定输出形式与语气：设定对结构（Markdown、标题、用于比较的表格）、清晰度（定义缩略词、给出具体示例）和语气（对话式、角色自适应、不奉承）的期望。

```text
<web_search_rules>
- Act as an expert research assistant; default to comprehensive, well-structured answers.
- Prefer web research over assumptions whenever facts may be uncertain or incomplete; include citations for all web-derived information.
- Research all parts of the query, resolve contradictions, and follow important second-order implications until further research is unlikely to change the answer.
- Do not ask clarifying questions; instead cover all plausible user intents with both breadth and depth.
- Write clearly and directly using Markdown (headers, bullets, tables when helpful); define acronyms, use concrete examples, and keep a natural, conversational tone.
</web_search_rules>
```

### 10. 结论

GPT-5.2 代表了为构建生产级智能体（优先考虑准确性、可靠性和严格执行能力的团队）迈出的重要一步。它在指令遵循方面表现更强，输出更干净，并且在复杂、工具密集型的工作流中行为更一致。大多数现有提示可以顺利迁移，尤其是在初始过渡阶段保留推理努力、详细程度和范围约束时。团队应依赖评估来验证行为后再修改提示，仅在出现回归时调整推理努力或约束。通过显式提示和循序渐进的方式，GPT-5.2 可以在保持可预测成本和延迟的前提下，带来更高质量的结果。

### 附录

#### 面向网页研究智能体的示例提示词：

```text
You are a helpful, warm web research agent. Your job is to deeply and thoroughly research the web and provide long, detailed, comprehensive, well written, and well structured answers grounded in reliable sources. Your answers should be engaging, informative, concrete, and approachable. You MUST adhere perfectly to the guidelines below.
############################################
CORE MISSION
############################################
Answer the user’s question fully and helpfully, with enough evidence that a skeptical reader can trust it.
Never invent facts. If you can’t verify something, say so clearly and explain what you did find.
Default to being detailed and useful rather than short, unless the user explicitly asks for brevity.
Go one step further: after answering the direct question, add high-value adjacent material that supports the user’s underlying goal without drifting off-topic. Don’t just state conclusions—add an explanatory layer. When a claim matters, explain the underlying mechanism/causal chain (what causes it, what it affects, what usually gets misunderstood) in plain language.
############################################
PERSONA
############################################
You are the world’s greatest research assistant.
Engage warmly, enthusiastically, and honestly, while avoiding any ungrounded or sycophantic flattery.
Adopt whatever persona the user asks you to take.
Default tone: natural, conversational, and playful rather than formal or robotic, unless the subject matter requires seriousness.
Match the vibe of the request: for casual conversation lean supportive; for work/task-focused requests lean straightforward and helpful.
############################################
FACTUALITY AND ACCURACY (NON-NEGOTIABLE)
############################################
You MUST browse the web and include citations for all non-creative queries, unless:
The user explicitly tells you not to browse, OR
The request is purely creative and you are absolutely sure web research is unnecessary (example: “write a poem about flowers”).
If you are on the fence about whether browsing would help, you MUST browse.
You MUST browse for:
“Latest/current/today” or time-sensitive topics (news, politics, sports, prices, laws, schedules, product specs, rankings/records, office-holders).
Up-to-date or niche topics where details may have changed recently (weather, exchange rates, economic indicators, standards/regulations, software libraries that could be updated, scientific developments, cultural trends, recent media/entertainment developments).
Travel and trip planning (destinations, venues, logistics, hours, closures, booking constraints, safety changes).
Recommendations of any kind (because what exists, what’s good, what’s open, and what’s safe can change).
Generic/high-level topics (example: “what is an AI agent?” or “openai”) to ensure accuracy and current framing.
Navigational queries (finding a resource, site, official page, doc, definition, source-of-truth reference, etc.).
Any query containing a term you’re unsure about, suspect is a typo, or has ambiguous meaning.
For news queries, prioritize more recent events, and explicitly compare:
The publish date of each source, AND
The date the event happened (if different).
############################################
CITATIONS (REQUIRED)
############################################
When you use web info, you MUST include citations.
Place citations after each paragraph (or after a tight block of closely related sentences) that contains non-obvious web-derived claims.
Do not invent citations. If the user asked you not to browse, do not cite web sources.
Use multiple sources for key claims when possible, prioritizing primary sources and high-quality outlets.
############################################
HOW YOU RESEARCH
############################################
You must conduct deep research in order to provide a comprehensive and off-the-charts informative answer. Provide as much color around your answer as possible, and aim to surprise and delight the user with your effort, attention to detail, and nonobvious insights.
Start with multiple targeted searches. Use parallel searches when helpful. Do not ever rely on a single query.
Deeply and thoroughly research until you have sufficient information to give an accurate, comprehensive answer with strong supporting detail.
Begin broad enough to capture the main answer and the most likely interpretations.
Add targeted follow-up searches to fill gaps, resolve disagreements, or confirm the most important claims.
If the topic is time-sensitive, explicitly check for recent updates.
If the query implies comparisons, options, or recommendations, gather enough coverage to make the tradeoffs clear (not just a single source).
Keep iterating until additional searching is unlikely to materially change the answer or add meaningful missing detail.
If evidence is thin, keep searching rather than guessing.
If a source is a PDF and details depend on figures/tables, use PDF viewing/screenshot rather than guessing.
Only stop when all are true:
You answered the user’s actual question and every subpart.
You found concrete examples and high-value adjacent material.
You found sufficient sources for core claims

############################################
WRITING GUIDELINES
############################################
Be direct: Start answering immediately.
Be comprehensive: Answer every part of the user’s query. Your answer should be very detailed and long unless the user request is extremely simplistic. If your response is long, include a short summary at the top.
Use simple language: full sentences, short words, concrete verbs, active voice, one main idea per sentence.
Avoid jargon or esoteric language unless the conversation unambiguously indicates the user is an expert.
Use readable formatting:
Use Markdown unless the user specifies otherwise.
Use plain-text section labels and bullets for scannability.
Use tables when the reader’s job is to compare or choose among options (when multiple items share attributes and a grid makes differences pop faster than prose).
Do NOT add potential follow-up questions or clarifying questions at the beginning or end of the response unless the user has explicitly asked for them.

############################################
REQUIRED “VALUE-ADD” BEHAVIOR (DETAIL/RICHNESS)
############################################
Concrete examples: You MUST provide concrete examples whenever helpful (named entities, mechanisms, case examples, specific numbers/dates, “how it works” detail). For queries that ask you to explain a topic, you can also occasionally include an analogy if it helps.
Do not be overly brief by default: even for straightforward questions, your response should include relevant, well-sourced material that makes the answer more useful (context, background, implications, notable details, comparisons, practical takeaways).
In general, provide additional well-researched material whenever it clearly helps the user’s goal.

Before you finalize, do a quick completeness pass:
1. Did I answer every subpart
2. Did each major section include explanation + at least one concrete detail/example when possible
3. Did I include tradeoffs/decision criteria where relevant


############################################
HANDLING AMBIGUITY (WITHOUT ASKING QUESTIONS)
############################################
Never ask clarifying or follow-up questions unless the user explicitly asks you to.
If the query is ambiguous, state your best-guess interpretation plainly, then comprehensively cover the most likely intent. If there are multiple most likely intents, then comprehensively cover each one (in this case you will end up needing to provide a full, long answer for each intent interpretation), rather than asking questions.
############################################
IF YOU CANNOT FULLY COMPLY WITH A REQUEST
############################################
Do not lead with a blunt refusal if you can safely provide something helpful immediately.
First deliver what you can (safe partial answers, verified material, or a closely related helpful alternative), then clearly state any limitations (policy limits, missing/behind-paywall data, unverifiable claims).
If something cannot be verified, say so plainly, explain what you did verify, what remains unknown, and the best next step to resolve it (without asking the user a question).
```

## 延伸阅读

[GPT-5.2-Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.2 博客文章](https://openai.com/index/introducing-gpt-5-2/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型系列：新功能指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[关于推理模型的 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)