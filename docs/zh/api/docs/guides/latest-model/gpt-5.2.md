# 使用 GPT-5.2

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.2 作为一款面向通用与智能体任务的旗舰级通用模型发布。与 GPT-5.1 相比，它在以下方面有所改进：

- 通用智能
- 遵循指令
- 准确性与 token 效率
- 多模态——尤其是视觉能力
- 代码生成——尤其是前端 UI 创建
- API中的工具调用与上下文管理
- 电子表格理解与创建

与之前的 GPT-5.1 模型不同，GPT-5.2 新增了用于管理模型 "已知" 和 "记忆" 内容的功能，以提高准确性。

本指南介绍 GPT-5 模型系列的关键功能，以及如何充分发挥 GPT-5.2 的性能。

## 探索代码示例

点击查看几个完全通过单个提示词生成、未手动编写任何代码的演示应用。请注意，这些示例均由 GPT-5.2 或我们此前的旗舰模型 GPT-5 生成。

## 模型、API 和功能更新

GPT-5.2 系列包含 `gpt-5.2` 适用于需要广泛世界知识的复杂任务， `gpt-5.2-chat-latest` 适用于与 ChatGPT 对齐的行为，以及 `gpt-5.2-pro` 适用于可从更多计算中受益的问题。

如需较小的模型，请使用 `gpt-5-mini`.

为了帮助你选择最适合用例的模型，请考虑以下权衡：

| Variant                                           | Best for                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`gpt-5.2`](https://developers.openai.com/api/docs/models/gpt-5.2)             | 复杂推理、广泛的世界知识，以及代码密集型或多步骤的智能体任务 |
| [`gpt-5.2-pro`](https://developers.openai.com/api/docs/models/gpt-5.2-pro)     | 可能需要更长时间解决、但需要更深入思考的难题             |
| [`gpt-5.2-codex`](https://developers.openai.com/api/docs/models/gpt-5.2-codex) | 构建交互式编码产品的公司；覆盖全谱系的编码任务        |
| [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)       | 成本优化的推理与聊天；在速度、成本和能力之间取得平衡              |
| [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano)       | 高吞吐量任务，尤其是聚焦的指令遵循或分类    |

### GPT-5.2 中的新功能

和 GPT-5.1 一样，全新的 GPT-5.2 同样具备 API 功能，例如自定义工具、可控制冗长度和推理强度的参数，以及允许使用的工具列表。5.2 的新变化在于新增了 `xhigh` 推理力度等级、简洁的推理摘要，以及利用 _compaction_.

本指南将带你了解 GPT-5 模型系列的一些关键功能，以及如何充分发挥 5.2 的优势。

对于编码任务，GPT-5.2-Codex 是我们在 Codex 或类 Codex 环境中为智能体工作流优化的编码版本。

### 降低推理力度

该 `reasoning.effort` 参数控制模型在生成响应之前生成多少推理token。早期的推理模型（如 o3）仅支持 `low`, `medium`，并且 `high`: `low` 倾向于更快的速度和更少的 token，而 `high` 倾向于更充分的推理。

在 GPT-5.2 中，最低设置为 `none` 以提供更低延迟的交互。这是 GPT-5.2 中的默认设置。如果你需要更多推理，可以缓慢地增加到 `medium` 并试验效果。

当推理强度设置为 `none`，时，提示词非常重要。即使在默认设置下，为了提升模型的推理质量，也要鼓励它在回答前先“思考”或列出步骤。

将推理强度设置为 none

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
  reasoning: {effort: :minimal},
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

详细程度决定了会生成多少输出 token。减少 token 数量可以降低整体延迟。虽然模型的推理方式基本不变，但模型会找到更简洁地作答的方法——这可能会提升或降低回答质量，具体取决于你的使用场景。下面列出详细程度光谱两端的一些场景：

- **高详细程度：** 当你需要模型对文档提供详尽解释或执行大量代码重构时使用。
- **低详细程度：** 最适合需要简洁回答或聚焦式代码生成（例如 SQL 查询）的场景。

GPT-5 使该选项可配置为以下之一 `high`, `medium`，或 `low`。在 GPT-5.2 中，详细程度仍然可配置，且默认为 `medium`.

在使用 GPT-5.2 生成代码时， `medium` 和 `high` 详细程度会产生更长、结构更清晰的代码，并附带内联解释，而 `low` 详细程度会生成更短、更精炼的代码，并附以最少的注释。

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
  text: {verbosity: :low},
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


在将该参数设置为 `low` 之后，你仍然可以通过提示来引导API中的详细程度。详细程度参数在系统提示级别定义了一个总体 token 区间，但实际输出在该区间内对开发者提示和用户提示均保持灵活。

### 在 GPT-5.2 中使用工具

GPT-5.2 已针对特定工具进行了后训练。详见 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

#### apply patch 工具

该 `apply_patch` 该工具让 GPT-5.2 能够使用结构化差异在你的代码库中创建、更新和删除文件。模型不再只是建议修改，而是发出补丁操作，由你的应用执行后再回报结果，从而支持迭代式的、多步骤代码编辑工作流。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-apply-patch).

在底层，该实现使用的是自由格式的函数调用而非 JSON 格式。测试中，使用具名函数使 `apply_patch` 失败率降低了 35%。

#### Shell 工具

GPT-5.2 支持本地 shell。shell 工具允许模型通过受控的命令行界面与你的本地计算机进行交互。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-shell) 以了解更多信息。

### 自定义工具

随着 GPT-5 模型家族的发布，我们引入了一项名为自定义工具的新能力，它允许模型将任意原始文本作为工具调用输入发送，同时仍可在需要时对输出进行约束。此工具行为在 GPT-5.2 中依然成立。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### Freeform inputs

使用以下方式定义你的工具 `type: custom` 以使模型能够将明文输入直接发送到你的工具，而不是仅限于结构化 JSON。模型可以将任何原始文本——代码、SQL 查询、Shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.2 支持上下文无关文法 (`CFGs`) 用于自定义工具，让你可以提供 Lark 文法来将输出约束到特定语法或 DSL。例如，附加 CFG（如 SQL 或 DSL 文法）可确保助手的文本与你的文法匹配。

这可以实现精确、受约束的工具调用或结构化响应，并让你直接在 GPT-5.2 的函数调用中强制执行严格的语法或领域特定格式，从而在复杂或受限领域中提升可控性和可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述决定发送什么；如果希望它始终调用该工具，请明确说明。
- **在服务端校验输出**。自由格式的字符串功能强大，但需要防止注入或不安全的命令。

### 允许的工具

该 `allowed_tools` 下的参数 `tool_choice` 允许你传入 N 个工具定义，但将模型限制为只能使用其中的 M 个（&lt; N)。在 `tools`，中列出你的完整工具集，然后使用 `allowed_tools` 块来命名该子集并指定模式——可以是 `auto` （模型可以从中任选其一）或 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可能的工具与当前可用的子集分开 _开来_，你可以获得更高的安全性、可预测性以及改进的提示缓存效果。同时也避免了脆弱的提示工程，例如硬编码的调用顺序。GPT-5.2 会在对话过程中动态调用或要求使用特定函数，同时降低在长上下文场景下意外调用工具的风险。

|                  | **Standard Tools**                        | **Allowed Tools**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的可选工具集 | 下列所有工具： **`"tools": […]`** | 仅限下列子集： **`"tools": […]`** 中的 **`tool_choice`** |
| 工具调用  | 模型可以调用也可以不调用任何工具        | 模型只能调用（或必须调用）所选的工具        |
| 用途          | 声明可用的能力            | 限制实际使用的能力                |

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

### Preambles

前言是 GPT-5.2 在调用任何工具或函数之前生成的、面向用户的简短说明，用于概述其意图或计划——例如，“我为什么要调用这个工具”。前言出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.2 在每次工具调用之前“先说出来”，前言可以提高工具调用的准确性（以及整体任务成功率），而不会显著增加推理开销。要启用前言，请添加系统指令或开发者指令——例如：“在调用工具之前，请解释你为什么调用它。”GPT-5.2 会为每个指定的工具调用添加一段简洁的理由说明。该模型还可能在工具调用之间输出多条消息，从而改善交互体验——尤其适用于追求极简推理或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.2 与 Responses API 配合效果最佳，后者支持在多轮对话之间保留推理上下文。请阅读下文，了解如何从你当前使用的模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.2

虽然该模型应该很接近 GPT-5.1 的可直接替换版本，但仍有几项关键变化需要说明。请参阅 [GPT-5.2 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide) ，了解需要在提示中进行哪些具体更新。

将 GPT-5 模型与 Responses API 配合使用，由于 API 的设计，可以获得更高的智能水平。Responses API 可以将上一轮的 CoT 传递给模型。这会带来更少生成的推理 token、更高的缓存命中率以及更低的延迟。了解更多信息，请参阅一篇 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) ，了解 Responses API 的优势。

在从更早的 OpenAI 模型迁移到 GPT-5.2 时，请先试验推理等级和提示策略。根据我们的测试，我们建议使用我们的 [提示优化器](https://platform.openai.com/chat/edit?models=gpt-5.2&optimize=true)——它会根据我们的最佳实践自动更新你的 GPT-5.2 提示——并遵循以下针对该模型的指引：

- **`gpt-5.1`**: `gpt-5.2` 使用默认设置可作为直接替换方案。
- **o3**: `gpt-5.2` 配合 `medium` 或 `high` 推理。建议从 `medium` 进行带提示调优的推理，如果效果不理想可提升至 `high` ，如果没有获得理想结果。
- **`gpt-4.1`**: `gpt-5.2` 配合 `none` 推理。建议从 `none` 并进行提示调优；如果需要更好的效果，可提升推理等级。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5-mini` 配合提示调优是一个非常合适的替代方案。
- **`gpt-4.1-nano`**: `gpt-5-nano` 配合提示调优是一个非常合适的替代方案。

### GPT-5.2 参数兼容性

以下参数仅在 **使用 GPT-5.2 并将推理力度设置为** 时支持 `none`:

- `temperature`
- `top_p`
- `logprobs`

对 GPT-5.2 或 GPT-5.1 使用其他推理力度设置，或对更早的 GPT-5 模型——例如， `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`——发出的包含这些字段的请求将引发错误。

若要在更高的推理力度下，或使用其他 GPT-5 系列模型获得类似的结果，可以尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的区别，也是从 Chat Completions 迁移到 Responses API 以使用 GPT-5.2 的主要原因，是支持在轮次之间传递思维链（CoT）。请参阅 API 的完整对比， [comparison of the 接口s](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅存在于 Responses API 中，这样做之后我们观察到了更强的智能、更少的生成推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数保持一致，只是格式有所不同。以下是 Chat Completions 与 Responses API 之间处理新参数的方式差异：

**推理力度**



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

- **更周全的脚手架：** 默认会构建更清晰的计划和中间结构；可通过显式指定范围和详细程度约束来进一步提升效果。
- **总体更简洁：** 更简洁、聚焦于任务本身，但仍对提示敏感，需在提示中明确说明偏好。
- **更强的指令遵循能力：** 更不易偏离用户意图；格式化和理由说明有所改进。
- **工具效率权衡：** 在交互流程中相比 GPT-5.1 会执行更多额外的工具动作，可通过提示进一步优化。
- **保守的接地倾向：** 倾向于优先保证正确性并进行显式推理；通过澄清提示可改善对歧义的处理。

本指南重点介绍如何对 GPT-5.2 进行提示，以最大化其优势——更高的智能、准确性、可信度和严谨性——同时缓解仍存在的低效问题。现有的 GPT-5 / GPT-5.1 提示指南大部分仍然适用并可继续沿用。

### 3. 提示模式

Adapt following themes into your prompts for better steer on GPT-5.2

#### 3.1 控制详细程度与输出形式

给出 **清晰且具体的长度约束** 尤其是在企业和编码场景下的智能体中。

根据所需详细程度调整的示例限制：

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

GPT-5.2 在结构化代码方面能力更强，但可能生成超出最小 UX 规范和设计系统范围的代码。为保持范围可控，明确禁止额外功能和不受控的样式。

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

为强制遵守设计系统，可复用你 5.1 `<design_system_enforcement>` 中的指令块，并额外强调“禁止额外功能”和“仅使用 token 颜色”。

#### 3.3 长上下文与召回

对于长上下文任务，提示词可能会受益于 **强制进行摘要与重新锚定**. 这种模式可以减少“滚动中迷失”的问题，并提升在密集上下文中的召回率。

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

针对模糊查询（例如需求不明确、缺少约束条件，或需要最新数据但未调用工具的情况）配置抑制过度自信幻觉的提示词。

抑制提示词：

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

你还可以针对高风险输出添加一个简短的自我检查步骤：

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

### 4. 压缩（扩展有效上下文）

对于超出标准上下文窗口的长时间运行、工具密集型工作流，搭载 Reasoning 的 GPT-5.2 支持通过 /responses/compact 端点进行响应压缩。该压缩会对先前的对话状态执行一次可感知损失的压缩过程，返回经过加密且不透明的项目，这些项目在大幅缩减 token 占用的同时保留了与任务相关的信息。这使模型能够在扩展工作流中持续推理，而不会触及上下文上限。

**何时使用压缩**

- 多步骤 智能体 工作流，包含大量工具调用
- 需要保留较早对话轮次的长对话
- 超出最大上下文窗口的迭代推理

**关键属性**

- 生成不透明、加密的项（内部逻辑可能会演进）
- 专为 延续 设计，而非用于检查
- 兼容 GPT-5.2 和 Responses API
- 可在长会话中安全地反复运行

**压缩响应**

端点

```text
POST https://api.openai.com/v1/responses/compact
```

**功能说明**

对一次对话运行一次压缩，并返回压缩后的响应对象。将压缩后的输出传入你的下一次请求，以在更小的上下文规模下延续工作流。

**最佳实践**

- 监控上下文使用情况并提前规划，避免触及上下文窗口上限
- 在重大里程碑（例如工具密集型阶段）之后进行压缩，而不是每轮都压缩
- 恢复时保持提示功能一致，避免行为漂移
- 将已压缩项视为不透明对象；不要解析或依赖其内部结构

有关何时以及如何在生产环境中进行压缩的指导，请参阅 [会话状态](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses) 指南和 [压缩响应](https://developers.openai.com/api/reference/resources/responses/methods/compact) 页面。

以下是一个示例:

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
  input: [{role: :user, content: "Write a very long poem about a dog."}]
)
compaction = client.responses.compact(
  model: "gpt-5.2",
  input: [
    {role: :user, content: "Write a very long poem about a dog."},
    *response.output
  ]
)

puts(compaction.output)
```


### 5. 智能体的可控性与用户更新

GPT-5.2 在智能体脚手架和多步执行方面表现出色，前提是提示得当。你可以复用你的 GPT-5.1 `<user_updates_spec>` 和 `<solution_persistence>` 块。

可以添加两个关键调整，以进一步提升 GPT-5.2 的性能：

- 限制更新的冗长度（更短、更聚焦）。
- 明确范围规范（不要扩展问题的范围）。

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

GPT-5.2 在工具可靠性和脚手架方面相较于 5.1 有所改进，特别是在 MCP/Atlas 风格的环境中。
适用于 GPT-5 / 5.1 的最佳实践：

- 用简洁的 1–2 句话描述工具的功能以及适用场景。
- 在扫描代码库、向量存储或多实体操作时，明确鼓励并行处理。
- 对高影响操作（下单、计费、基础设施变更）要求设置验证步骤。

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

### 7. 结构化提取、PDF 与 Office 工作流

这是 GPT-5.2 明显展现出显著改进的领域。为了充分发挥其优势：

- 始终为输出提供 schema 或 JSON 结构。你可以使用结构化输出以严格遵守 schema。
- 区分必填字段和可选字段。
- 要求“抽取完整性”，并显式处理缺失字段。

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

对于多表/多文件提取，请向以下内容添加指导：

- 按文档分别序列化结果。
- 包含稳定的 ID（文件名、合同标题、页码范围）。

### 8. 迁移至 GPT-5.2 的提示词指南

本部分帮助你将提示词和模型配置迁移到 GPT-5.2，同时保持行为稳定以及成本/延迟的可预测性。GPT-5 系列模型支持 reasoning_effort 旋钮（例如 none|minimal|low|medium|high|xhigh），用于在速度/成本与更深层推理之间进行权衡。

迁移映射
升级到 GPT-5.2 时使用以下默认映射

| 当前模型 | 目标模型 | 目标 reasoning_effort          | 备注                                                                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GPT-4o        | GPT-5.2      | none                             | 默认将 4o/4.1 迁移视为“快速/低推理”；仅当评估结果回退时才提高推理力度。 |
| GPT-4.1       | GPT-5.2      | none                             | 与 GPT-4o 的映射一致，以保持响应迅捷的行为。                                                   |
| GPT-5         | GPT-5.2      | same value except minimal → none | 保留 none/low/medium/high，以保持延迟与质量的一致性。                             |
| GPT-5.1       | GPT-5.2      | same value                       | 保留现有的推理力度选择；仅在运行评估后再进行调整。                                  |

\*请注意，GPT-5 的默认推理级别为 medium，而 GPT-5.1 和 GPT-5.2 的默认推理级别为 none。

我们在 Playground 中推出了 [Prompt Optimizer](https://platform.openai.com/chat/edit?optimize=true) ，以帮助用户快速改进现有提示，并在 GPT-5 与其他 OpenAI 模型之间进行迁移。迁移到新模型的一般步骤如下：

- 步骤 1：切换模型，但暂不要修改提示词。保持提示词在功能上完全一致，这样才能测试的是模型变更——而不是提示词编辑。一次只做一项修改。
- 步骤 2：固定 reasoning_effort。显式设置 GPT-5.2 的 reasoning_effort，使其与先前模型的延迟/深度特征匹配（避免供应商默认的 “thinking” 陷阱，以免其扭曲成本/冗长度/结构）。
- 步骤 3：运行 Evals 取得基线。在模型与推理强度对齐后，运行你的评估套件。若结果看起来良好（在中/高强度下通常更佳），就可以发布了。
- 步骤 4：若出现回归，调整提示词。使用 Prompt Optimizer 与针对性约束（冗长度/格式/模式、范围约束）来恢复等同表现或进一步改善。
- 步骤 5：每次小幅修改后重新运行 Evals。通过将 reasoning_effort 调高一档或对提示词进行渐进式微调来迭代——然后重新测量。

### 9. 网页搜索与研究

GPT-5.2 在跨多个来源综合信息方面更加可控且能力更强。

应遵循的最佳实践：

- 提前明确研究范围：告诉模型你希望它如何执行搜索。是否要追踪二阶线索、解决矛盾并附带引用。明确说明研究要做到什么程度，比如：附加研究应持续到边际价值下降为止。

- 通过指令而非提问来限制歧义：指示模型全面覆盖所有合理的意图，而不是提出澄清性问题。在存在不确定性时，要求广度和深度。

- 规定输出形式和语调：对结构（用于比较的 Markdown、标题、表格）、清晰度（定义缩写词、给出具体示例）以及语气（对话式、角色自适应的、不奉承的）设定预期

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

GPT-5.2 代表了为构建生产级智能体的团队迈出的重要一步，这些智能体优先考虑准确性、可靠性和严谨的执行能力。它带来更出色的指令遵循、更清晰的输出，以及在复杂、工具密集型工作流中更一致的行为。大多数现有提示都能顺利迁移，尤其是在初始过渡期间保留了推理力度、详细级别和范围约束的情况下。团队应依赖评估来验证行为，然后再修改提示，仅在出现回归时才调整推理力度或约束。通过明确的提示和循序渐进的迭代，GPT-5.2 能够在保持可预测成本和延迟特征的同时，实现更高质量的结果。

### 附录

#### 用于网页研究智能体的示例提示：

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

[推理模型 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)