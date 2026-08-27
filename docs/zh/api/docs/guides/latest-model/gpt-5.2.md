# 使用 GPT-5.2

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 引言

GPT-5.2 作为旗舰通用模型发布，适用于通用任务和智能体任务。与 GPT-5.1 相比，它改进了：

- 通用智能
- 指令遵循
- 准确性与Token效率
- 多模态能力——尤其是视觉
- 代码生成——尤其是前端用户界面创建
- API中的工具调用和上下文管理
- 电子表格的理解与创建

与之前的 GPT-5.1 模型不同，GPT-5.2 新增了管理模型“知道”和“记住”内容的功能，以提高准确性。

本指南介绍了 GPT-5 模型系列的主要功能，以及如何充分利用 GPT-5.2。

## 探索编码示例

点击浏览几个完全通过单个提示词生成、无需手写任何代码的演示应用。请注意，这些示例是由 GPT-5.2 或我们之前的旗舰模型 GPT-5 生成的。

## 模型、API 与功能更新

GPT-5.2 系列包含 `gpt-5.2` 用于需要广泛世界知识的复杂任务、 `gpt-5.2-chat-latest` 用于 ChatGPT 对齐行为，以及 `gpt-5.2-pro` 用于更能受益于更多计算的问题。

如需较小的模型，请使用 `gpt-5-mini`.

为帮助你选择最适合自己使用场景的模型，请考虑以下权衡：

| 变体                                           | 最适合                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`gpt-5.2`](https://developers.openai.com/api/docs/models/gpt-5.2)             | 复杂推理、广泛的世界知识，以及代码密集型或多步骤的智能体任务 |
| [`gpt-5.2-pro`](https://developers.openai.com/api/docs/models/gpt-5.2-pro)     | 可能耗时更长，但需要更深入思考的难题             |
| [`gpt-5.2-codex`](https://developers.openai.com/api/docs/models/gpt-5.2-codex) | 构建交互式编码产品的公司；全方位的编码任务        |
| [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)       | 成本优化的推理与聊天；平衡速度、成本与能力              |
| [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano)       | 高吞吐量任务，特别是聚焦的指令遵循或分类任务    |

### GPT-5.2 的新功能

与 GPT-5.1 一样，新的 GPT-5.2 具备 API 功能，如自定义工具、控制冗长度和推理的参数，以及允许的工具列表。5.2 的新增内容包括新的 `xhigh` 推理努力级别、简洁的推理摘要，以及使用 _压缩_.

的新上下文管理。本指南介绍了 GPT-5 模型系列的一些关键功能，以及如何充分利用 5.2。

对于编码任务，GPT-5.2-Codex 是我们为 Codex 或类似 Codex 环境中的智能体工作流优化的编码变体。

### 降低推理力度

该 `reasoning.effort` 参数控制模型在生成响应之前生成多少推理令牌。早期的推理模型如 o3 仅支持 `low`, `medium`，以及 `high`: `low` 偏好速度和较少的令牌，而 `high` 偏好更彻底的推理。

对于 GPT-5.2，最低设置为 `none` 以提供更低延迟的交互。这是 GPT-5.2 中的默认设置。如果你需要更多思考，请逐渐增加到 `medium` 并进行结果实验。

当推理努力设置为 `none`，时，提示非常重要。为了提高模型的推理质量，即使在默认设置下，也要鼓励其在回答之前“思考”或概述其步骤。

推理努力设置为 none

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


### 详细程度

冗长度决定了生成多少输出 token。降低 token 数量可减少整体延迟。虽然模型的推理方式大致保持不变，但模型会找到更简洁的答案方式——这可能会提升或降低答案质量，具体取决于你的使用场景。以下是冗长度谱系两端的几种场景：

- **高详细度：** 当你需要模型对文档提供详尽解释或进行广泛的代码重构时使用。
- **低详细度：** 最适合需要简洁回答或专注于代码生成（如 SQL 查询）的情况。

GPT-5 将该选项设为可通过以下之一配置 `high`, `medium`，或 `low`。使用 GPT-5.2 时，冗长程度仍可配置，默认为 `medium`.

使用 GPT-5.2 生成代码时， `medium` 和 `high` 的冗长级别会产生更长、更结构化、附带内联解释的代码，而 `low` 的冗长级别则生成更短、更简洁、注释更少的代码。

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


将其设置为 `low` 后，你仍可通过提示词引导冗长程度API。冗长参数在系统提示层定义了一个大致的 token 范围，但实际输出在该范围内对开发者和用户提示均保持灵活。

### 使用 GPT-5.2 工具

GPT-5.2 已针对特定工具进行了后训练。请参阅 [工具文档](https://developers.openai.com/api/docs/guides/tools) 获取更具体的指导。

#### 应用补丁工具

该 `apply_patch` 该工具让 GPT-5.2 使用结构化差异在你的代码库中创建、更新和删除文件。模型不仅提出编辑建议，还会生成补丁操作，由你的应用程序应用并随后反馈结果，从而实现迭代式的多步骤代码编辑工作流。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-apply-patch).

在底层，该实现使用自由形式的函数调用，而非 JSON 格式。在测试中，命名函数将 `apply_patch` 失败率降低了 35%。

#### Shell 工具

本地 shell 在 GPT-5.2 中得到支持。shell 工具允许模型通过受控的命令行界面与你的本地计算机交互。 [阅读文档](https://developers.openai.com/api/docs/guides/tools-shell) 以了解更多。

### 自定义工具

当 GPT-5 模型系列发布时，我们引入了一项名为自定义工具的新能力，它允许模型将任何原始文本作为工具调用输入发送，但仍可根据需要约束输出。这一工具行为在 GPT-5.2 中仍然成立。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### 自由格式输入

使用 `type: custom` 定义你的工具，以允许模型将纯文本输入直接发送到你的工具，而不仅限于结构化 JSON。模型可以将任何原始文本——代码、SQL 查询、shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.2 支持上下文无关文法（`CFGs`），用于自定义工具，让你提供 Lark 文法以将输出约束为特定语法或 DSL。附加 CFG（例如 SQL 或 DSL 文法）可确保助手的文本与你的文法匹配。

这能实现精确、受约束的工具调用或结构化响应，并让你直接在 GPT-5.2 的函数调用中强制严格的句法或领域特定格式，从而提升复杂或受约束领域的控制力和可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型根据你的描述决定发送什么；如果你希望它始终调用该工具，请明确说明。
- **在服务端验证输出**。自由格式字符串功能强大，但需要防护措施以防止注入或不安全的命令。

### 允许的工具

该 `allowed_tools` 下的参数 `tool_choice` 允许你传入 N 个工具定义，但将模型限制为仅使用其中 M 个（&lt; N)。在 `tools`，中列出你的完整工具集，然后使用 `allowed_tools` 块来指定子集并设置模式——要么 `auto` （模型可从中任选）要么 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可能的工具与可使用的子集分离 _如今_，你可以获得更高的安全性、可预测性以及改进的提示缓存。你还可以避免脆弱的提示工程，如硬编码的调用顺序。GPT-5.2 在对话过程中动态调用或要求特定函数，同时降低在长上下文中的意外工具使用风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的工具范围 | 下列所有工具 **`"tools": […]`** | 仅限下列子集 **`"tools": […]`** 中 **`tool_choice`** |
| 工具调用  | 模型可能调用也可能不调用任何工具        | 模型仅限调用（或必须调用）所选工具        |
| 目的          | 声明可用能力            | 限制实际使用的能力                |

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

有关所有这些新功能的更详细概述，请参阅 [配套食谱](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide).

### 序言

引言是 GPT-5.2 在调用任何工具或函数之前生成的简短、用户可见的说明，概述其意图或计划——例如，“我为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过在每次工具调用前让 GPT-5.2“大声思考”，引言提高了工具调用的准确性（以及整体任务成功率），而不会增加过多的推理开销。要启用引言，请添加系统或开发者指令——例如：“在调用工具之前，解释你为什么要调用它”。GPT-5.2 会为每个指定的工具调用添加简洁的理由说明。模型还可能在工具调用之间输出多条消息，这可以增强交互体验——尤其是对于极简推理或对延迟敏感的用例。

有关使用引言的更多信息，请参阅 [GPT-5 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.2 与 Responses API 配合使用效果最佳，它支持在对话轮次之间保留推理上下文。请阅读下文，从你当前的模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.2

虽然该模型应该可以作为 GPT-5.1 的直接替代品，但仍有一些关键变化需要注意。请参阅 [GPT-5.2 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5-2_prompting_guide) 了解在提示中需要做的具体更新。

由于 Responses API 的设计，使用 GPT-5 模型配合 API 能够提供更智能的体验。Responses API 可以将上一轮的思维链传递给模型，这有助于减少生成的推理令牌数量、提高缓存命中率，并降低延迟。要了解更多信息，请参阅一份 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) 了解 Responses API 的优势。

当从较旧的 OpenAI 模型迁移到 GPT-5.2 时，首先尝试不同的推理级别和提示策略。根据我们的测试，我们建议使用我们的 [提示优化器](https://platform.openai.com/chat/edit?models=gpt-5.2&optimize=true)——它会根据我们的最佳实践自动为 GPT-5.2 更新你的提示——并遵循以下针对模型的具体指导：

- **`gpt-5.1`**: `gpt-5.2` 配合默认设置是可无缝替换的选择。
- **o3**: `gpt-5.2` 搭配 `medium` 或 `high` 推理时，先使用 `medium` 通过提示调优进行推理，然后增加到 `high` 如果未获得满意的结果。
- **`gpt-4.1`**: `gpt-5.2` 搭配 `none` 推理时，先使用 `none` 并调整提示；如果需要更好的性能则增加。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5-mini` 通过提示调优是出色的替代方案。
- **`gpt-4.1-nano`**: `gpt-5-nano` 通过提示调优是出色的替代方案。

### GPT-5.2 参数兼容性

以下参数 **仅** 在使用 GPT-5.2 且推理力度设置为 `none`:

- `temperature`
- `top_p`
- `logprobs`

对 GPT-5.2 或 GPT-5.1 使用其他任何推理力度设置，或对更老的 GPT-5 模型的请求——例如， `gpt-5`, `gpt-5-mini`、或 `gpt-5-nano`——包含这些字段将引发错误。

要在推理力度设置更高或使用其他 GPT-5 系列模型时获得类似结果，请尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

从 Chat Completions 迁移到 Responses API 用于 GPT-5.2 的最大区别和主要原因是支持在轮次之间传递思维链（CoT）。请参阅完整的 [API 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅存在于 Responses API 中，我们观察到这样做带来了更高的智能水平、更少的生成推理 token、更高的缓存命中率和更低的延迟。大多数其他参数保持对等，尽管格式有所不同。以下是 Chat Completions 和 Responses API 之间新参数的不同处理方式：

**推理努力**



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




## 提示词最佳实践

### 2. 关键行为差异

**与上一代模型（如 GPT-5 和 GPT-5.1）相比，GPT-5.2 提供：**

- **更刻意的脚手架构建：** 默认生成更清晰的计划和中间结构；受益于明确的范围和详细程度约束。
- **总体详细程度较低：** 更简洁且以任务为中心，但仍对提示敏感，需在提示中明确表达偏好。
- **更强的指令遵循能力：** 更少偏离用户意图；改进的格式和推理呈现。
- **工具效率权衡：** 与 GPT-5.1 相比，在交互流程中采取更多工具操作，可通过提示进一步优化。
- **保守的接地偏见：** 倾向于优先考虑正确性和显式推理；通过澄清提示可改善模糊性处理。

本指南重点介绍如何提示 GPT-5.2 以最大化其优势——更高的智能、准确性、扎实性和纪律性——同时减少剩余的低效问题。现有的 GPT-5 / GPT-5.1 提示指南大部分仍然适用并继续有效。

### 3. 提示模式

将以下主题融入你的提示词中，以便更好地驾驭 GPT-5.2

#### 3.1 控制详细程度与输出形状

提供 **清晰且具体的长度限制** 尤其是在企业和编程智能体中。

示例：根据期望的详细程度进行调整：

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

#### 3.2 防止范围漂移（例如，前端任务中的用户体验/设计）

GPT-5.2 在结构化代码方面更强，但可能生成比最小 UX 规范和设计系统更多的代码。为保持在范围内，明确禁止额外功能和无节制的样式。

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

对于设计系统执行，复用你的 5.1 `<design_system_enforcement>` 块，但添加“无额外功能”和“仅使用令牌颜色”以加强强调。

#### 3.3 长上下文与召回

对于长上下文任务，提示可能受益于 **强制摘要和重新接地**。这种模式减少了“迷失在滚动中”的错误，并改善了对密集上下文的召回。

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

针对模糊查询（例如需求不明确、约束缺失，或需要新数据但未调用任何工具的问题）中的过度自信幻觉，配置提示词。

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

你还可以为高风险输出添加一个简短的自检步骤：

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

对于超出标准上下文窗口的长时运行、工具密集型工作流，GPT-5.2 with Reasoning 通过 /responses/compact 端点支持响应压缩。压缩会对先前的对话状态执行一次考虑损失的压缩过程，返回加密且不透明的条目，这些条目在保留任务相关信息的同时大幅减少令牌占用。这使得模型能够在扩展工作流中继续推理而不会触及上下文限制。

**何时使用压缩**

- 涉及多次工具调用的多步骤智能体流程
- 早期对话轮次必须保留的长对话
- 超出最大上下文窗口的迭代推理

**关键属性**

- 生成不透明、加密的项目（内部逻辑可能演变）
- 专为延续设计，而非用于检查
- 兼容 GPT-5.2 和Responses API
- 可在长时间会话中安全地重复运行

**压缩响应**

端点

```text
POST https://api.openai.com/v1/responses/compact
```

**功能说明**

对对话执行压缩操作，并返回压缩后的响应对象。将压缩后的输出传入你的下一个请求，以在减少上下文大小的情况下继续工作流。

**最佳实践**

- 监控上下文使用情况并提前规划，以避免触及上下文窗口限制
- 在重要里程碑之后（例如，工具密集阶段）进行压缩，而不是每轮都压缩
- 恢复时保持提示词功能上一致，以避免行为漂移
- 将压缩后的项目视为不透明；不要解析或依赖其内部细节

关于在生产环境中何时以及如何压缩的指导，请参阅 [对话状态](https://developers.openai.com/api/docs/guides/conversation-state?api-mode=responses) 指南和 [压缩响应](https://developers.openai.com/api/reference/resources/responses/methods/compact) 页面。

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
  input: [{role: :user, content: "Write a very long poem about a dog."}]
)
compaction = client.responses.compact(
  model: "gpt-5.2",
  input: [
    {role: :user, content: "Write a very long poem about a dog."},
    *response.output.map(&:to_h)
  ]
)

puts(compaction.output)
```


### 5. 智能体的可控性与用户更新

GPT-5.2 在提示得当的情况下，在智能体脚手架和多步骤执行方面表现强劲。你可以复用你的 GPT-5.1 `<user_updates_spec>` 和 `<solution_persistence>` 代码块。

可以加入两个关键调整，以进一步推动 GPT-5.2 的性能表现：

- 限制更新的详细程度（更简短、更聚焦）。
- 明确范围纪律（不要扩大问题解决范围）。

更新后的规范示例：

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

GPT-5.2 在工具可靠性和脚手架方面优于 5.1，尤其是在 MCP/Atlas 风格的环境中。
适用于 GPT-5 / 5.1 的最佳实践：

- 简洁描述工具：用1–2句话说明其功能及使用场景。
- 明确鼓励并行操作，适用于扫描代码库、向量存储或多实体操作。
- 对高影响操作（订单、计费、基础设施变更）要求进行验证步骤。

工具使用示例部分：

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

这是 GPT-5.2 明显展现出显著改进的领域。为了充分利用这一点：

- 始终为输出提供 schema 或 JSON 形状。你可以使用结构化输出以确保严格遵循 schema。
- 区分必填字段和可选字段。
- 要求“提取完整性”，并明确处理缺失字段。

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

对于多表/多文件提取，可添加以下指导：

- 分别序列化每个文档的结果。
- 包含一个稳定的 ID（文件名、合同标题、页面范围）。

### 8. GPT-5.2 提示词迁移指南

本节将帮助你迁移提示词和模型配置到 GPT-5.2，同时保持行为稳定以及成本/延迟可预测。GPT-5 类模型支持 reasoning_effort 旋钮（例如，none|minimal|low|medium|high|xhigh），用以权衡速度/成本与更深层次的推理。

迁移映射
升级到 GPT-5.2 时，请使用以下默认映射。

| 当前模型 | 目标模型 | 目标 reasoning_effort          | 备注                                                                                                 |
| ------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GPT-4o        | GPT-5.2      | none                             | 默认将 4o/4.1 迁移视为“快速/低推理强度”；仅在评估回归时才增加推理强度。 |
| GPT-4.1       | GPT-5.2      | none                             | 与 GPT-4o 映射相同，以保持响应迅速的行为。                                                   |
| GPT-5         | GPT-5.2      | 相同值，但 minimal → none | 保留 none/low/medium/high，以保持延迟/质量特性一致。                             |
| GPT-5.1       | GPT-5.2      | 相同值                       | 保留现有的推理强度选择；仅在运行评估后进行调�整。                                  |

\*请注意，GPT-5 的默认推理级别为 medium，而 GPT-5.1 和 GPT-5.2 的默认推理级别为 none。

我们在 [Prompt Optimizer](https://platform.openai.com/chat/edit?optimize=true) 中引入了该功能，以帮助用户快速改进现有提示词，并使其在 GPT-5 和其他 OpenAI 模型之间迁移。迁移到新模型的一般步骤如下：

- 第 1 步：切换模型，暂时不要修改提示词。保持提示词功能上完全一致，这样你测试的是模型变更——而非提示词编辑。每次只做一处更改。
- 第 2 步：固定 reasoning_effort。显式设置 GPT-5.2 的 reasoning_effort，使其匹配先前模型的延迟/深度配置（避免提供商默认的“思考”陷阱，以免扭曲成本/冗长度/结构）。
- 第 3 步：运行评估以建立基线。模型和 effort 对齐后，运行你的评估套件。如果结果良好（通常在中/高 effort 下表现更佳），即可准备发布。
- 第 4 步：若出现性能下降，则调整提示词。使用提示词优化器及有针对性的约束（冗长度/格式/架构、范围纪律）来恢复等效表现或加以改进。
- 第 5 步：每次小幅更改后重新运行评估。通过将 reasoning_effort 提升一档或逐步调整提示词进行迭代——然后重新测量。

### 9. 网页搜索与研究

GPT-5.2 在综合多个来源的信息方面更具可操控性和能力。

应遵循的最佳实践：

- 预先明确研究范围：告诉模型你希望如何进行搜索。是否追踪二级线索、解决矛盾并包含引用。明确说明要做到什么程度，例如：应继续进行附加研究，直到边际价值下降为止。

- 通过指令而非提问来约束歧义：指示模型全面覆盖所有可能的意图，不要提出澄清性问题。在存在不确定性时要求覆盖广度和深度。

- 规定输出形式和语气：设定结构预期（Markdown、标题、用于比较的表格）、清晰度预期（定义缩略词、提供具体示例）和语气预期（对话风格、适配个人风格、不谄媚）

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

GPT-5.2 代表了面向构建优先考虑准确性、可靠性和纪律性执行的生产级智能体的团队迈出的有意义的一步。它在复杂、工具密集的工作流中提供了更强的指令遵循、更干净的输出和更一致的行为。大多数现有提示词可以顺利迁移，尤其是在初始过渡期间保留推理力度、详细程度和范围约束的情况下。团队应依赖评估来验证行为，然后再进行提示词更改，仅在出现回归时调整推理力度或约束。通过明确的提示和审慎的迭代，GPT-5.2 可以在保持可预测的成本和延迟特征的同时，解锁更高质量的成果。

### 附录

#### 网页研究智能体的示例提示词：

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

[GPT-5.2-Codex 提示词指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.2 博客文章](https://openai.com/index/introducing-gpt-5-2/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型系列：新功能指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[推理模型 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)