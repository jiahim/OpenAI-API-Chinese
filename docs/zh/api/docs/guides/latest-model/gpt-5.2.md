# 使用 GPT-5.2

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.2 作为面向通用与智能体任务的旗舰通用模型发布。相比 GPT-5.1，它在以下方面有所改进：

- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 工具调用与 API 中的上下文管理
- 电子表格的理解与创建

与之前的 GPT-5.1 模型不同，GPT-5.2 提供了用于管理模型“已知”和“记忆”内容的新功能，以提升准确性。

本指南介绍 GPT-5 模型系列的关键功能，以及如何充分发挥 GPT-5.2 的能力。

## 浏览代码示例

点击浏览一些完全由单个提示生成、且未手写任何代码的演示应用。请注意，这些示例要么由 GPT-5.2 生成，要么由我们之前的旗舰模型 GPT-5 生成。

## 模型、API 和功能更新

GPT-5.2 系列包含 `gpt-5.2` 用于需要广泛世界知识的复杂任务， `gpt-5.2-chat-latest` 用于与 ChatGPT 对齐的行为，以及 `gpt-5.2-pro` 用于受益于更多算力的问题。

如果需要更小的模型，请使用 `gpt-5-mini`.

为了帮助你挑选最适合用例的模型，请考虑以下权衡：

| 变体                                           | 最适合                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`gpt-5.2`](https://developers.openai.com/api/docs/models/gpt-5.2)             | 复杂推理、广泛的世界知识，以及代码密集或多步骤的智能体任务 |
| [`gpt-5.2-pro`](https://developers.openai.com/api/docs/models/gpt-5.2-pro)     | 需要更长时间解决、但要求更深思考的难题             |
| [`gpt-5.2-codex`](https://developers.openai.com/api/docs/models/gpt-5.2-codex) | 构建交互式编码产品的公司；覆盖全谱系的编码任务        |
| [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)       | 成本优化的推理与对话；在速度、成本和能力之间取得平衡              |
| [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano)       | 高吞吐量任务，尤其是聚焦的指令遵循或分类    |

### GPT-5.2 中的新功能

与 GPT-5.1 类似，新的 GPT-5.2 同样提供了 API 功能，例如自定义工具、可控制详细程度和推理强度的参数，以及一个允许使用的工具列表。5.2 的全新特性是一个新的 `xhigh` 推理强度等级、简洁的推理摘要，以及利用以下方式实现的新上下文管理： _压缩_.

本指南将介绍 GPT-5 模型系列的一些关键特性，以及如何充分发挥 5.2 的优势。

对于编码任务，GPT-5.2-Codex 是我们面向 Codex 或类似 Codex 环境中的智能体工作流所优化的编码变体。

### 较低推理力度

该 `reasoning.effort` 参数用于控制模型在生成响应之前生成的推理 token 数量。早期的推理模型（如 o3）仅支持 `low`, `medium`，并且 `high`: `low` 倾向于更快的速度和更少的 token，而 `high` 倾向于更充分的推理。

在 GPT-5.2 中，最低设置是 `none` ，以提供更低延迟的交互。这是 GPT-5.2 中的默认设置。如果需要更多思考，可以逐步提升到 `medium` 并进行实验。

当推理力度设置为 `none`，时，提示非常重要。为了提升模型的推理质量，即使使用默认设置，也应鼓励它在回答之前先“思考”或列出步骤。

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


### 详细程度

详细程度决定了生成的输出 token 数量。减少 token 数量可以降低整体延迟。虽然模型的推理方式基本保持不变，但模型会找到更简洁的回答方式——这可能会根据你的用例改善或降低回答质量。以下是详细程度两个极端场景下的一些示例：

- **高详细度：** 在你需要模型提供详尽的文档解释或执行大规模代码重构时使用。
- **低详细度：** 最适合需要简洁回答或聚焦式代码生成的场景，例如 SQL 查询。

GPT-5 将此选项设为可配置项之一，包括 `high`, `medium`，或 `low`。在 GPT-5.2 中，冗长程度仍然可配置，默认值为 `medium`.

使用 GPT-5.2 生成代码时， `medium` 和 `high` 冗长程度会生成更长、结构更清晰的代码，并附带内联说明，而 `low` 冗长程度则会生成更短、更简洁的代码，仅附带极少的注释。

控制冗长程度

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


在将冗长程度设置为 `low` 后，你仍然可以通过提示语在 API 中对其进行引导。冗长程度参数在系统提示层面定义了一个通用的 token 范围，但实际输出在该范围内会同时响应开发者提示和用户提示。

### 将工具与 GPT-5.2 配合使用

GPT-5.2 已针对特定工具进行了后训练。详见 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

#### apply patch 工具

该 `apply_patch` 工具让 GPT-5.2 能够使用结构化差异在你的代码库中创建、更新和删除文件。模型不只是建议编辑，而是发出补丁操作，由你的应用执行后再回报结果，从而支持迭代式、多步骤的代码编辑工作流。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-apply-patch).

在底层，该实现使用的是自由格式函数调用而非 JSON 格式。经测试，使用具名函数后， `apply_patch` 失败率降低了 35%。

#### Shell tool

GPT-5.2 支持本地 shell。Shell 工具允许模型通过受控的命令行界面与你的本地计算机进行交互。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-shell) 了解更多。

### 自定义工具

当 GPT-5 模型系列发布时，我们引入了一项名为自定义工具的新能力，它允许模型将任何原始文本作为工具调用输入发送，同时仍可在需要时对输出进行约束。这一工具行为在 GPT-5.2 中依然成立。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### Freeform inputs

通过以下方式定义你的工具 `type: custom` 以允许模型将明文输入直接发送到你的工具，而不是仅限于结构化的 JSON。模型可以将任何原始文本（代码、SQL 查询、shell 命令、配置文件或长篇散文）直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.2 支持上下文无关文法（`CFGs`），可用于自定义工具，让你提供 Lark 文法以将输出约束到特定语法或 DSL。例如，附加 CFG（如 SQL 或 DSL 文法）可确保助手文本与你的文法一致。

这使得精确、受约束的工具调用或结构化响应成为可能，并让你直接在 GPT-5.2 的函数调用中强制执行严格的语法或领域特定格式，从而在复杂或受约束的场景中提升可控性与可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述决定发送什么；如果希望始终调用该工具，请明确说明。
- **在服务端验证输出**。自由格式字符串功能强大，但需要防范注入或不安全命令的风险。

### Allowed tools

该 `allowed_tools` parameter under `tool_choice` 可以让你传入 N 个工具定义，但限制模型只能使用其中的 M 个（&lt; N）个。在 `tools`，中列出你的完整工具集，然后使用一个 `allowed_tools` 块来指定该子集并设定模式——可以是 `auto` （模型可从这些工具中任选其一），也可以是 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可选工具与当前可用的子集分开 _处理_，你可以获得更高的安全性、可预测性以及更好的提示缓存效果。同时也避免了脆弱的提示工程，例如硬编码的调用顺序。GPT-5.2 能够在对话中间动态调用或要求使用特定函数，同时降低在长上下文下意外调用工具的风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的能力范围 | 下所列的全部工具 **`"tools": […]`** | 仅其中的子集 **`"tools": […]`** 中 **`tool_choice`** |
| 工具调用  | 模型可调用任意工具，也可不调用        | 模型被限制（或必须）调用所选工具        |
| 用途          | 声明可用的能力            | 限制实际可调用的能力                |

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

### 前导

前言是 GPT-5.2 在调用任何工具或函数之前生成的简短、面向用户的说明，用于概述其意图或计划——例如“为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，让模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.2 在每次工具调用前“边想边说”，前言可以提升工具调用准确率（以及整体任务成功率），同时不会显著增加推理开销。若要启用前言，请添加系统或开发者指令，例如：“在调用工具之前，先解释你为什么要调用它。”GPT-5.2 会为每个指定的工具调用添加简明的理由。模型还可能在工具调用之间输出多条消息，从而提升交互体验——尤其适合对推理要求较低或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.2 与 Responses API 配合使用时效果最佳，后者支持在多轮之间保留推理上下文。请阅读下文，了解如何从你当前使用的模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.2

虽然该模型应该可以非常接近 GPT-5.1 的直接替代品，但仍有一些关键变化需要指出。请参阅 [GPT-5.2 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide) 了解需要在你的提示中做出的具体更新。

使用 GPT-5 系列模型配合 Responses API 可以借助 API 的设计获得更高的智能水平。Responses API 可以将上一轮的思维链传递给模型。这会带来更少的推理 token、更高的缓存命中率以及更低的延迟。要了解更多，请参阅关于 Responses API 优势的 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) 。

从旧版 OpenAI 模型迁移到 GPT-5.2 时，建议从推理级别和提示策略开始试验。根据我们的测试，我们推荐使用我们的 [提示优化器](https://platform.openai.com/chat/edit?models=gpt-5.2&optimize=true)——它会根据我们的最佳实践自动为 GPT-5.2 更新你的提示——并遵循以下针对该模型的指导：

- **`gpt-5.1`**: `gpt-5.2` 在默认设置下可直接作为替代品使用。
- **o3**: `gpt-5.2` 配合 `medium` 或 `high` 推理。从 `medium` 推理配合提示调优开始，如果效果不理想再提升到 `high` 。
- **`gpt-4.1`**: `gpt-5.2` 配合 `none` 推理。从 `none` 并对你的提示进行调优；如果需要更好的性能，可提升到。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5-mini` 配合提示调优是很好的替代方案。
- **`gpt-4.1-nano`**: `gpt-5-nano` 配合提示调优是很好的替代方案。

### GPT-5.2 参数兼容性

以下参数 **仅支持** 在使用 GPT-5.2 且将推理力度设置为 `none`:

- `temperature`
- `top_p`
- `logprobs`

对 GPT-5.2 或 GPT-5.1 使用任何其他推理力度设置，或对更早的 GPT-5 模型（例如， `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`）发出的请求如果包含这些字段将引发错误。

若要在更高的推理力度下，或在另一个 GPT-5 系列模型上获得类似的结果，可以尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的区别，也是从 Chat Completions 迁移到 Responses API 以使用 GPT-5.2 的主要原因，是对跨轮次传递思维链（CoT）的支持。查看完整的 [API 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅在 Responses API 中可用，并且我们观察到这样做带来了更强的智能、更少的生成推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数保持对等，只是格式有所不同。以下是 Chat Completions 与 Responses API 之间新参数处理方式的差异：

**推理强度**



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

### 2. 主要行为差异

**与上一代模型（例如 GPT-5 和 GPT-5.1）相比，GPT-5.2 在以下方面有所提升：**

- **更加审慎的脚手架：** 默认情况下构建更清晰的计划与中间结构；得益于明确的作用域与详略约束。
- **总体上更简洁：** 更简洁、更聚焦任务，但仍对提示敏感，需要在提示中明确表达偏好。
- **更强的指令遵循能力：** 更少偏离用户意图；格式与理由阐述有所改进。
- **工具效率权衡：** 在交互流程中相比 GPT-5.1 会执行额外的工具动作，可通过提示进一步优化。
- **保守的真实性倾向：** 倾向于追求正确性与显式推理；通过澄清提示可改善歧义处理。

本指南聚焦于如何对 GPT-5.2 进行提示，以最大化其优势 —— 更高的智能、准确性、扎实度和规范性 —— 同时缓解其仍存在的低效之处。现有针对 GPT-5 / GPT-5.1 的提示指南在很大程度上仍然适用。

### 3. 提示词模式

在提示中适配以下主题，以便更好地引导 GPT-5.2

#### 3.1 控制详细程度与输出形状

提供 **清晰且具体的长度约束** 尤其是在企业和编码场景下的智能体中。

根据期望的详细程度调整示例 clamp：

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

#### 3.2 防止范围漂移（例如前端任务中的 UX / 设计）

GPT-5.2 在结构化代码方面更强，但可能会生成超出最小化 UX 规范和设计系统范围的代码。为了保持在范围内，明确禁止额外的功能和不受控的样式。

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

为了强制执行设计系统，请复用你的 5.1 `<design_system_enforcement>` 代码块，并添加 “no extra features” 和 “tokens-only colors” 以进一步强调。

#### 3.3 长上下文与召回

对于长上下文任务，提示词可能会受益于 **强制摘要和重新基于上下文**。这种模式可以减少“滚动中迷失”的错误，并提高在密集上下文中的召回率。

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

为模糊查询（例如需求不明确、缺少约束条件，或需要新数据但未调用任何工具的提问）下的过度自信幻觉配置提示词。

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

你也可以为高风险输出添加一个简短的自我检查步骤：

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

### 4. 压缩（延长有效上下文）

对于超过标准上下文窗口的长时间运行、工具密集型工作流，GPT-5.2 在启用 Reasoning 后，可通过 /responses/compact 端点支持响应压缩。该压缩会对先前的对话状态执行一次有损感知的压缩过程，并返回经过加密且不透明的项目（item），这些项目在大幅减少 token 占用的同时保留了与任务相关的信息。这使得模型能够在跨扩展工作流进行推理时不会触达上下文上限。

**何时使用压缩**

- 包含多次工具调用的多步骤智能体工作流
- 需要保留较早轮次的长对话
- 超出最大上下文窗口的迭代推理

**关键属性**

- 生成不透明且加密的条目（内部逻辑可能演变）
- 专为延续而设计，而非用于检查
- 兼容 GPT-5.2 和Responses API
- 可在长时间会话中安全重复运行

**压缩响应**

Endpoint

```text
POST https://api.openai.com/v1/responses/compact
```

**What it does**

Runs a compaction pass over a conversation and returns a compacted response object. Pass the compacted output into your next request to continue the 工作流 with reduced context size.

**Best practices**

- 监控上下文使用情况并提前规划，避免触达上下文窗口上限
- 在重大里程碑（例如工具密集阶段）后进行压缩，而非每轮都压缩
- 恢复时保持提示在功能上完全一致，以避免行为漂移
- 将压缩后的内容视为不透明对象；不要解析或依赖其内部结构

有关何时以及如何在生产环境中进行压缩的指导，请参阅 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses) 指南以及 [压缩 Response](https://developers.openai.com/api/reference/resources/responses/methods/compact) 页面。

以下是一个示例：

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


### 5. 智能体的可引导性与用户更新

GPT-5.2 在智能体脚手架与多步骤执行方面表现强劲，前提是提示得当。你可以复用你的 GPT-5.1 `<user_updates_spec>` 和 `<solution_persistence>` blocks。

可以添加两个关键的调整，以进一步提升 GPT-5.2 的性能：

- 限制更新的详细程度（更简短、更聚焦）。
- 明确范围约束（不要扩大问题覆盖面）。

示例更新规范：

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

GPT-5.2 在工具可靠性和脚手架方面相较 5.1 有所提升，尤其是在 MCP/Atlas 类环境中。
适用于 GPT-5 / 5.1 的最佳实践：

- 简明扼要地描述工具：使用 1–2 句话说明它们的功能和适用场景。
- 在扫描代码库、向量存储或多实体操作时，明确鼓励并行执行。
- 对高风险操作（订单、计费、基础设施变更）要求进行验证步骤。

示例工具使用章节：

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

### 7. 结构化抽取、PDF 与 Office 工作流

这是一个 GPT-5.2 明显展现出显著改进的领域。为了充分发挥它的能力：

- 始终为输出提供 schema 或 JSON 结构。可以使用结构化输出以严格遵循 schema。
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

- 按文档分别序列化结果。
- 包含一个稳定的 ID（文件名、合同标题、页码范围）。

### 8. 迁移至 GPT-5.2 的 Prompt 指南

本部分可帮助你在保持行为稳定以及成本/延迟可预测的前提下，将提示词和模型配置迁移到 GPT-5.2。GPT-5 类模型支持 reasoning_effort 旋钮（例如 none|minimal|low|medium|high|xhigh），用于在速度/成本与更深层次的推理之间进行权衡。

迁移映射
升级到 GPT-5.2 时，请使用以下默认映射

| 当前模型 | 目标模型 | 目标 reasoning_effort          | 备注                                                                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GPT-4o        | GPT-5.2      | none                             | 默认将 4o/4.1 迁移视为“快速/低推理深度”；仅在评估结果回退时再提高推理深度。 |
| GPT-4.1       | GPT-5.2      | none                             | 与 GPT-4o 相同的映射，以保持响应的即时性。                                                   |
| GPT-5         | GPT-5.2      | 相同取值，但 minimal 映射为 none | 保留 none/low/medium/high，以保持延迟与质量特征的一致性。                             |
| GPT-5.1       | GPT-5.2      | 相同取值                       | 保留现有的推理深度选择；仅在运行评估后再做调整。                                  |

\*注意，GPT-5 的默认推理级别为 medium，而 GPT-5.1 和 GPT-5.2 的默认推理级别为 none。

我们推出了 [Prompt Optimizer](https://platform.openai.com/chat/edit?optimize=true) ，可在 Playground 中帮助用户快速优化现有提示，并在 GPT-5 与其他 OpenAI 模型之间进行迁移。迁移到新模型的一般步骤如下：

- Step 1: 切换模型，先不要改动提示词。保持提示词在功能上完全一致，这样你测试的是模型变更本身，而不是提示词的修改。每次只改一处。
- Step 2: 固定 reasoning_effort。显式设置 GPT-5.2 的 reasoning_effort，使其匹配之前模型的延迟/深度特征（避免服务商默认的“thinking”陷阱导致成本/输出量/结构出现偏差）。
- Step 3: 运行 Evals 建立基线。在模型与 effort 对齐之后，运行你的评测套件。如果结果看起来不错（在中/高 effort 下常常更优），就可以准备发布了。
- Step 4: 如果出现回归，微调提示词。使用 Prompt Optimizer 以及针对性约束（输出量/格式/Schema、范围纪律）来恢复对齐或进一步改进。
- Step 5: 每次小幅改动后重新运行 Evals。可以将 reasoning_effort 调高一档，或者对提示词进行增量微调，然后再次测量。

### 9. 网页搜索与研究

GPT-5.2 在跨多个来源综合信息方面更具可引导性和能力。

应遵循的最佳实践：

- 预先指定研究范围：告诉模型你希望它如何执行搜索。是否需要追踪次级线索、解决矛盾并附上引用。明确说明研究要深入到什么程度，例如：附加研究应一直继续，直到边际价值下降为止。

- 通过指令而非提问来限制模糊性：指示模型全面覆盖所有合理的意图，而不要提出澄清性问题。在存在不确定性时，要求广度与深度兼具。

- 规定输出形式与语气：对结构（Markdown、标题、用于对比的表格）、清晰度（定义缩写词、给出具体示例）和风格（对话式、随角色调整、非奉承）设定预期

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

GPT-5.2 对于构建生产级智能体的团队而言是重要的一步，这些团队优先关注准确性、可靠性以及严谨的执行。它带来更强的指令遵循能力、更干净的输出，以及在复杂、工具密集型工作流中更一致的行为。大多数现有提示都能顺利迁移，尤其是在初始过渡期间保留推理强度、详细程度和范围约束的情况下。团队应依靠评估来验证行为，然后再修改提示，仅当出现回退时才调整推理强度或约束。通过明确的提示和循序渐进的迭代，GPT-5.2 能够在保持可预测的成本和延迟特征的同时，实现更高质量的结果。

### 附录

#### 面向网页研究的智能体的示例提示词：

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

[Responses API 与 Chat Completions 的比较](https://developers.openai.com/api/docs/guides/migrate-to-responses)