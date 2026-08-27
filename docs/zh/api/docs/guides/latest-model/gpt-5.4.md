# 使用 GPT-5.4

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 简介

[GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) 作为一款前沿模型发布，适用于API和 Codex 中的专业工作。它帮助开发者分析复杂信息、构建生产级软件，并自动化多步骤工作流。

在 GPT-5.4 这一代模型中， `gpt-5.4` 是适用于在软件工程、推理、写作和工具使用之间切换的工作流的通用模型。

本指南涵盖了 GPT-5 模型系列的关键特性，以及如何充分利用 GPT-5.4。

## 新增内容

与之前的 GPT-5.2 模型相比，GPT-5.4 在以下方面有所改进：

- 编码、文档理解、工具使用和指令遵循
- 图像感知和多模态任务
- 长时间运行的任务执行和多步骤智能体工作流
- 令牌效率和工具密集型工作负载的端到端性能
- 网页搜索和多源综合，用于查找难以定位的信息
- 客户服务、分析和金融领域中文档密集型和电子表格密集型业务工作流

GPT-5.4 将 GPT-5.3-Codex 的编码能力带入我们的旗舰前沿模型。开发者可以生成生产级代码、构建精美的前端 UI、遵循仓库特定模式，并以更少的重试次数处理多文件变更。它还具备强大的开箱即用编码风格，因此团队可以减少在提示词调优上花费的时间。

对于智能体工作负载，GPT-5.4 减少了多步轨迹的端到端时间，并且通常以更少的 token 和工具调用来完成任务。这使得 智能体 响应更迅速，并降低了在 API 和 Codex 中大规模运行复杂工作流的成本。

### GPT-5.4 的新功能

与早期的 GPT-5 模型一样，GPT-5.4 支持自定义工具、控制详细程度和推理的参数，以及允许的工具列表。GPT-5.4 还引入了多项功能，使得构建强大的 智能体系统、处理更大规模的信息以及运行更可靠的自动化工作流变得更加容易：

- **`tool_search` 在 API 中：** GPT-5.4 通过使用延迟工具加载，改进了更大工具生态系统的工具搜索。这使得工具可搜索，只加载相关定义，减少令牌使用量，并在实际部署中提高工具选择准确性。了解更多，请参阅 [工具搜索指南](https://developers.openai.com/api/docs/guides/tools-tool-search).
- **1M 令牌上下文窗口：** GPT-5.4 支持高达 1M 令牌的上下文窗口，使得在单个请求中分析整个代码库、长文档集合或扩展的 智能体 轨迹更加容易。更多信息请参阅 [1M 上下文窗口](#1m-context-window) 部分。
- **内置计算机使用：** GPT-5.4 是首款具有内置计算机使用功能的主流模型，使 智能体 能够直接与软件交互，在构建-运行-验证-修复循环中完成、验证和修复任务。了解更多，请参阅 [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use).
- **原生压缩支持：** GPT-5.4 是首款经过训练以支持压缩的主流模型，使得更长的 智能体 轨迹成为可能，同时保留关键上下文。

## 模型、API与功能更新

在此模型代际中， `gpt-5.4` 是适用于广泛任务和编码的通用模型。对于更困难的问题， `gpt-5.4-pro` 会使用更多计算资源进行更长时间的思考，并提供更一致的答案。

对于更小、更快的变体，可以从 `gpt-5.4-mini` 或 `gpt-5.4-nano`.

开始。为帮助你选择最适合自身用例的模型，请考虑以下权衡：

| 变体                                         | 最适合                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4)           | 通用任务，包括复杂推理、广泛的世界知识，以及代码密集型或多步骤的智能体任务 |
| [`gpt-5.4-pro`](https://developers.openai.com/api/docs/models/gpt-5.4-pro)   | 可能需要更长时间解决且需要更深层推理的难题                                               |
| [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | 高量编码、计算机使用，以及仍需强大推理能力的智能体工作流                               |
| [`gpt-5.4-nano`](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | 速度和成本最为重要的大吞吐量任务                                                               |

### 降低推理力度

该 `reasoning.effort` 参数控制模型在生成响应之前生成多少推理 token。早期的推理模型（如 o3）仅支持 `low`, `medium`，而 `high`: `low` 偏向速度和更少的 token，而 `high` 偏向更全面的推理。

GPT-5.2 和 GPT-5.4 支持 `none` 作为最低推理力度，以用于低延迟交互。这是两个模型的默认设置。如果你需要更多思考，请逐渐增加到 `medium` 并试验结果。

当推理力度设置为 `none`，时，提示很重要。即使使用默认设置，也鼓励模型在回答之前“思考”或概述其步骤，以提高推理质量。

推理力度设置为无

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.4",
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
    model="gpt-5.4",
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
		Model:     "gpt-5.4",
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
        .model("gpt-5.4")
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
  model: "gpt-5.4",
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
        "model": "gpt-5.4",
        "input": "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
        "reasoning": {
                "effort": "none"
        }
}'
```


### 详细程度

冗长程度决定了生成多少输出令牌。减少令牌数量可降低总体延迟。虽然模型的推理方式基本保持不变，但模型会找到更简洁的回答方式——这根据你的使用场景，可能会提高或降低回答质量。以下是冗长程度谱系两端的几种场景：

- **高详细度：** 当你需要模型对文档提供详尽解释或进行大规模代码重构时使用。
- **低详细度：** 最适合需要简洁回答或重点明确的代码生成的场景，例如 SQL 查询。

GPT-5 使此选项可作为以下之一进行配置： `high`, `medium`，或 `low`。使用 GPT-5.4 时，详细程度仍可配置，默认值为 `medium`.

使用 GPT-5.4 生成代码时， `medium` 和 `high` 详细程度级别会产生更长、结构更清晰的代码，并带有内联解释，而 `low` 详细程度则产生更短、更简洁的代码，注释最少。

控制详细程度

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.4",
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
    model="gpt-5.4",
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
		Model: "gpt-5.4",
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
        .model("gpt-5.4")
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
  model: "gpt-5.4",
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
  "model": "gpt-5.4",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```


你仍然可以在设置为 `low` 后通过提示来引导详细程度。API 中的 verbosity 参数在系统提示级别定义了一个通用的 token 范围，但实际输出在该范围内可灵活适应开发者和用户提示。

#### 1M 上下文窗口

1M token 上下文窗口随 GPT-5.4 引入，使得在单次请求中分析整个代码库、长文档集合或扩展的 智能体轨迹变得更加容易。

我们对低于 272K 和高于 272K token 的请求有单独的标准定价，详见 [定价文档](https://developers.openai.com/api/docs/pricing)。如果你使用 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，任何超过 272K token 的提示词将自动按标准费率处理。

长上下文定价与其他定价修饰符（如数据驻留和批处理）叠加。

我们对低于 272K token 和高于 272K token 的请求有不同的速率限制；这在 [GPT-5.4 模型页面](https://developers.openai.com/api/docs/models/gpt-5.4).

## 将工具与 GPT-5.4 结合使用

GPT-5.4 已在特定工具上进行过后期训练。请参阅 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

### 计算机使用工具

计算机使用功能让 GPT-5.4 通过检查屏幕截图并返回结构化操作供你的执行环境执行，从而通过用户界面操作软件。它非常适合浏览器或桌面工作流，在这些场景中，一个人可以通过 UI 完成任务，例如浏览网站、填写表单或验证更改是否真正生效。

请在隔离的浏览器或虚拟机中使用它，并对高风险操作保持人工参与。完整指南涵盖了内置的 Responses API 循环、自定义执行环境模式以及基于代码执行的设置。

[计算机使用指南



      Learn how to run the built-in computer tool safely and integrate it with
    your own harness.](https://developers.openai.com/api/docs/guides/tools-computer-use)

### 工具搜索工具

工具搜索让 GPT-5.4 将大型工具面延迟到运行时处理，使模型仅加载所需的定义。当你拥有许多函数时，这最为有用， `namespaces`，或 MCP 工具，并希望减少令牌使用、保持缓存性能并改善延迟，而无需提前暴露所有模式。

当候选工具在请求时已知时，使用 托管工具搜索；当你的应用程序需要动态决定加载内容时，使用客户端执行的工具搜索。完整指南还涵盖了最佳实践，包括 `namespaces`、MCP 服务器和延迟加载。

[工具搜索指南



      Learn how to defer tool definitions and load the right subset at runtime.](https://developers.openai.com/api/docs/guides/tools-tool-search)

### 自定义工具

当 GPT-5 模型系列发布时，我们引入了一种名为自定义工具的新能力，它允许模型将任何原始文本作为工具调用输入发送，但仍可根据需要限制输出。这种工具行为在 GPT-5.4 中仍然如此。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### 自由格式输入

使用以下方式定义你的工具 `type: custom` ，以允许模型直接将纯文本输入发送到你的工具，而不仅限于结构化 JSON。模型可以将任何原始文本——代码、SQL 查询、shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.4 支持上下文无关文法（`CFGs`）用于自定义工具，让你可以提供 Lark 文法来将输出约束为特定语法或 DSL。附加 CFG（例如 SQL 或 DSL 文法）可确保助手的文本符合你的文法。

这可以实现精确、受约束的工具调用或结构化响应，并让你直接在 GPT-5.4 的函数调用中强制实施严格的句法或领域特定格式，从而提高对复杂或受限领域的控制力和可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型根据你的描述选择要发送的内容；如果你希望它始终调用该工具，请明确说明。
- **在服务端验证输出**。自由格式字符串功能强大，但需要针对注入或不安全命令采取防护措施。

### 允许的工具

该 `allowed_tools` 参数位于 `tool_choice` 让你传递 N 个工具定义，但限制模型仅使用其中 M（&lt; N）个。在 `tools`，中列出你的完整工具集，然后使用 `allowed_tools` 块来指定子集并设置模式——要么 `auto` （模型可任选其一）要么 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可能的工具与可使用的子集分离 _现在_，你可以获得更高的安全性、可预测性以及改进的提示缓存。你还避免了脆弱的提示工程，例如硬编码的调用顺序。GPT-5.4 在对话中动态调用或要求特定函数，同时降低了在长上下文中意外使用工具的风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的适用范围 | 下列所有工具 **`"tools": […]`** | 仅限以下子集 **`"tools": […]`** 中 **`tool_choice`** |
| 工具调用  | 模型可能调用或不调用任何工具        | 模型限制为（或必须）调用所选工具        |
| 用途          | 声明可用能力            | 限制实际使用的能力                |

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

有关所有这些新功能的更详细概述，请参阅 [GPT-5.4 提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices).

### 前言

前言是 GPT-5.4 在调用任何工具或函数之前生成的简短、用户可见的解释，概述其意图或计划——例如，“我为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.4 在每次工具调用前“大声思考”，前言提升了工具调用准确性（以及整体任务成功率），而不会增加推理开销。要启用前言，请添加一条系统或开发者指令——例如：“在调用工具之前，解释你为什么要调用它。” GPT-5.4 会为每个指定的工具调用添加简洁的理由。模型还可能在工具调用之间输出多条消息，这可以增强交互体验——尤其是对于最小推理或延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词烹饪书](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.4 与 Responses API 搭配使用效果最佳，该 接口 支持在轮次之间保留推理上下文以提升性能。请阅读下文，从你当前的模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.4

使用 [OpenAI 文档
  技能](https://github.com/openai/skills/tree/main/skills/.system/openai-docs)
  当将现有提示词或工作流迁移到 GPT-5.4 时。它可在我们的
  公共技能库和 Codex 桌面应用中使用。

虽然该模型应接近 GPT-5.2 的直接替代品，但仍有一些关键变化需要指出。请参阅 [GPT-5.4 的提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices) 了解需要对提示词进行的具体更新。

使用 Responses API 使用 GPT-5 模型，由于 API 设计，可提供更高的智能。Responses API 可将上一轮的 CoT 传递给模型。这导致生成的推理令牌更少，缓存命中率更高，延迟更低。要了解更多信息，请参阅 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) 关于 Responses API 的优势。

从较旧的 OpenAI 模型迁移到 GPT-5.4 时，首先尝试使用推理级别和提示词策略进行实验。使用 [提示词优化器](https://platform.openai.com/chat/edit?models=gpt-5.4&optimize=true) 根据当前最佳实践更新 GPT-5.4 的提示词，然后遵循以下模型特定指南：

- **`gpt-5.2`**: `gpt-5.4` 使用默认设置时，可作为直接替代品。
- **o3**: `gpt-5.4` 搭配 `medium` 或 `high` 推理。从 `medium` 推理开始，通过提示调整，然后提升至 `high` 如果你未获得预期结果。
- **`gpt-4.1`**: `gpt-5.4` 搭配 `none` 推理。从 `none` 开始并调整提示；若需更好性能可提升。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5.4-mini` 通过提示调整是很好的替代方案。
- **`gpt-4.1-nano`**: `gpt-5.4-nano` 通过提示调整是很好的替代方案。

### 新增 `phase` 参数

对于 Responses API 中长期运行或工具繁重的 GPT-5.4 流程，请使用助手消息 `phase` 字段以避免提前停止和其他异常行为。

`phase` 在 API 级别是可选的，但我们强烈建议使用它。使用 `phase: "commentary"` 用于中间助手更新（如工具调用前的序言），以及 `phase: "final_answer"` 用于最终答案。不要向用户消息添加 `phase` 。

如果你使用 `previous_response_id`，那通常是最简单的路径，因为
  先前的助手状态会被保留。如果手动重放助手历史，
  需保留每个原始 `phase` 值。

缺失或丢弃 `phase` 可能导致序言在这些工作流中被视为最终答案
。更多指导和建议示例，请参阅 [GPT-5.4
提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#phase-parameter).

往返助手阶段值

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.4",
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
    model="gpt-5.4",
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
		Model: "gpt-5.4",
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
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.4")
        .input("Explain the bug and propose a fix.")
        .reasoning(Reasoning.builder().effort(ReasoningEffort.MEDIUM).build())
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
  model: "gpt-5.4",
  reasoning: {effort: :medium},
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```


### GPT-5.4 参数兼容性

以下参数 **仅支持** 当使用 GPT-5.4 且推理深度设置为 `none`:

- `temperature`
- `top_p`
- `logprobs`

包含这些字段的请求在 GPT-5.4 或 GPT-5.2 使用任何其他推理深度设置时，或对于较旧的 GPT-5 模型（例如 `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`.

如需在更高推理深度设置或其他 GPT-5 系列模型上获得类似效果，请尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的区别，也是从 Chat Completions 迁移到 Responses API 以用于 GPT-5.4 的主要原因，是支持在轮次之间传递思维链（CoT）。请参阅完整的 [API 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

仅在 Responses API 中存在传递 CoT 的功能，并且我们观察到这样做带来了更高的智能、更少的推理令牌生成、更高的缓存命中率和更低的延迟。大多数其他参数仍然保持对等，尽管格式有所不同。以下是新参数在 Chat Completions 和 Responses API 之间的不同处理方式：

**推理努力**



Responses API

    Generate response with reasoning effort set to none

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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

在排查 GPT-5.4 将中间更新视为
  最终答案的问题时，请验证你的集成是否正确保留了助手消息中的 `phase`
  字段。参见 [Phase 参数](#phase-parameter) 了解详情。

### 了解 GPT-5.4 的行为

#### GPT-5.4 的优势所在

GPT-5.4 在这些领域往往表现尤为出色：

- 性格鲜明且严格遵守语气要求，在长回答中漂移更少
- 智能体工作流的稳健性，更倾向于坚持多步骤工作、重试，并端到端完成智能体循环
- 证据丰富的综合能力，尤其是在长上下文或多工具工作流中
- 在模块化、基于技能和块结构的提示中，当契约明确时，能够遵循指令
- 对大规模、杂乱或多文档输入的长期上下文分析
- 批处理或并行工具调用，同时保持工具调用准确性
- 需要指令遵循、格式保真度和更强自我验证的电子表格、财务和 Excel 工作流

#### 显式提示仍有帮助的场景

即使具备这些优势，GPT-5.4 在几个反复出现的模式中仍需更明确的指导：

- 会话早期低上下文的工具路由，此时工具选择可能不太可靠
- 需要显式前置条件和下游步骤检查的依赖感知工作流
- 推理强度选择，更高的强度并非总是更好，正确的选择取决于任务形态而非直觉
- 需要严格来源收集和一致引用的研究任务
- 执行前需要验证的不可逆或高影响操作
- 终端或编码智能体环境，工具边界必须保持清晰

这些模式是观察到的默认行为，而非保证。从能通过你的评估的最小提示词开始，仅在修复已测得的失败模式时才添加阻断内容。

### 使用核心提示模式

#### 保持输出紧凑且有结构

为提高 GPT-5.4 的令牌效率，通过明确的输出契约来约束冗长程度并强制结构化输出。在实践中，这作为额外的控制层，与 `verbosity` 参数配合使用（位于 Responses API 中），使你可以同时引导模型书写的篇幅及其输出结构。

```xml
<output_contract>
- Return exactly the sections requested, in the requested order.
- If the prompt defines a preamble, analysis block, or working section, do not treat it as extra output.
- Apply length limits only to the section they are intended for.
- If a format is required (JSON, Markdown, SQL, XML), output only that format.
</output_contract>

<verbosity_controls>
- Prefer concise, information-dense writing.
- Avoid repeating the user's request.
- Keep progress updates brief.
- Do not shorten the answer so aggressively that required evidence, reasoning, or completion checks are omitted.
</verbosity_controls>
```

#### 为后续执行设置明确的默认值

用户经常会在对话中途改变任务、格式或语气。为了让助手保持一致，请定义明确的规则，说明何时继续、何时提问，以及较新的指令如何覆盖较早的默认设置。

使用如下默认继续执行策略：

```xml
<default_follow_through_policy>
- If the user’s intent is clear and the next step is reversible and low-risk, proceed without asking.
- Ask permission only if the next step is:
  (a) irreversible,
  (b) has external side effects (for example sending, purchasing, deleting, or writing to production), or
  (c) requires missing sensitive information or a choice that would materially change the outcome.
- If proceeding, briefly state what you did and what remains optional.
</default_follow_through_policy>
```

明确指令优先级：

```xml
<instruction_priority>
- User instructions override default style, tone, formatting, and initiative preferences.
- Safety, honesty, privacy, and permission constraints do not yield.
- If a newer user instruction conflicts with an earlier one, follow the newer instruction.
- Preserve earlier instructions that do not conflict.
</instruction_priority>
```

优先级更高的开发者或系统指令仍然具有约束力。

**指导原则：** 当指令在对话中途发生变化时，请使更新明确、限定范围且局部化。说明哪些内容已更改、哪些仍然适用，以及该更改是影响下一轮对话还是影响整个对话的其余部分。

#### 处理对话中途的指令更新

对于对话中途的更新，请使用明确、有范围的引导消息，具体说明：

1. 范围
2. 覆盖
3. 延续

```text
<task_update>
For the next response only:
- Do not complete the task.
- Only produce a plan.
- Keep it to 5 bullets.

All earlier instructions still apply unless they conflict with this update.
</task_update>
```

如果任务本身发生变化，请直接说明：

```text
<task_update>
The task has changed.
Previous task: complete the workflow.
Current task: review the workflow and identify risks only.

Rules for this turn:
- Do not execute actions.
- Do not call destructive tools.
- Return exactly:
  1. Main risks
  2. Missing information
  3. Recommended next step
</task_update>
```

#### 当正确性依赖于工具使用时，使工具使用具有持久性

使用明确的规则来确保工具使用彻底、感知依赖关系且节奏适当，尤其是在后续操作依赖于先前检索或验证的工作流中。一个常见的失败模式是，因为正确的最终状态看起来显而易见而跳过前置步骤。

GPT-5.4 在会话初期上下文仍然单薄时，工具路由的可靠性可能较低。请提示前置条件、依赖检查以及确切的工具意图。

```xml
<tool_persistence_rules>
- Use tools whenever they materially improve correctness, completeness, or grounding.
- Do not stop early when another tool call is likely to materially improve correctness or completeness.
- Keep calling tools until:
  (1) the task is complete, and
  (2) verification passes (see <verification_loop>).
- If a tool returns empty or partial results, retry with a different strategy.
</tool_persistence_rules>
```

这对于最终操作取决于先前查找或检索步骤的工作流尤为重要。最常见的失败模式之一就是，因为预期的最终状态看起来显而易见而跳过前置步骤。

```xml
<dependency_checks>
- Before taking an action, check whether prerequisite discovery, lookup, or memory retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If the task depends on the output of a prior step, resolve that dependency first.
</dependency_checks>
```

当工作相互独立且实际用时很重要时，提示并行处理。当依赖关系、歧义性或不可逆操作比速度更重要时，提示按顺序处理。

```xml
<parallel_tool_calling>
- When multiple retrieval or lookup steps are independent, prefer parallel tool calls to reduce wall-clock time.
- Do not parallelize steps that have prerequisite dependencies or where one result determines the next action.
- After parallel retrieval, pause to synthesize the results before making more calls.
- Prefer selective parallelism: parallelize independent evidence gathering, not speculative or redundant tool use.
</parallel_tool_calling>
```

#### 对长周期任务强制完整性

对于多步骤工作流，常见的失败模式是执行不完整：模型在部分覆盖后即结束，遗漏批次中的项目，或将空结果或狭窄的检索视为最终结果。当提示词定义明确的完成规则和恢复行为时，GPT-5.4 变得更加可靠。

覆盖可以通过顺序或并行检索实现，但无论哪种方式，完成规则都应保持明确。

```xml
<completeness_contract>
- Treat the task as incomplete until all requested items are covered or explicitly marked [blocked].
- Keep an internal checklist of required deliverables.
- For lists, batches, or paginated results:
  - determine expected scope when possible,
  - track processed items or pages,
  - confirm coverage before finalizing.
- If any item is blocked by missing data, mark it [blocked] and state exactly what is missing.
</completeness_contract>
```

对于空结果、部分结果或噪声检索常见的工作流：

```xml
<empty_result_recovery>
If a lookup returns empty, partial, or suspiciously narrow results:
- do not immediately conclude that no results exist,
- try at least one or two fallback strategies,
  such as:
  - alternate query wording,
  - broader filters,
  - a prerequisite lookup,
  - or an alternate source or tool,
- Only then report that no results were found, along with what you tried.
</empty_result_recovery>
```

#### 在影响较大的操作之前添加验证循环

当工作流看起来已完成时，在返回答案或采取不可逆操作之前，添加一个轻量的验证步骤。这有助于在提交前发现需求遗漏、依据问题和格式偏差。

```xml
<verification_loop>
Before finalizing:
- Check correctness: does the output satisfy every requirement?
- Check grounding: are factual claims backed by the provided context or tool outputs?
- Check formatting: does the output match the requested schema or style?
- Check safety and irreversibility: if the next step has external side effects, ask permission first.
</verification_loop>
```

```xml
<missing_context_gating>
- If required context is missing, do NOT guess.
- Prefer the appropriate lookup tool when the missing context is retrievable; ask a minimal clarifying question only when it is not.
- If you must proceed, label assumptions explicitly and choose a reversible action.
</missing_context_gating>
```

对于主动采取行动的智能体，添加一个简短的执行框架：

```xml
<action_safety>
- Pre-flight: summarize the intended action and parameters in 1-2 lines.
- Execute via tool.
- Post-flight: confirm the outcome and any validation that was performed.
</action_safety>
```

### 处理专业化工作流

#### 为视觉和计算机使用明确选择图像细节

如果你的 工作流 依赖于视觉精度，请在提示或集成中指定图像 `detail` 级别，而不是依赖 `auto`。使用 `high` 进行标准的高保真图像理解。使用 `original` 处理大型、密集或空间敏感的图像，尤其是 [计算机使用、定位、OCR 和点击准确度任务](https://developers.openai.com/api/docs/guides/tools-computer-use) 在 `gpt-5.4` 和未来的模型上。当速度和成本比细节更重要时，才使用 `low` 。有关图像细节级别的更多信息，请参阅 [“图像与视觉”指南](https://developers.openai.com/api/docs/guides/images-vision).

#### 将研究和引用锁定到检索到的证据

当引文质量至关重要时，应明确制定源边界和格式要求。这有助于减少虚构引用、未经支持的声明及引文格式漂移。

```xml
<citation_rules>
- Only cite sources retrieved in the current workflow.
- Never fabricate citations, URLs, IDs, or quote spans.
- Use exactly the citation format required by the host application.
- Attach citations to the specific claims they support, not only at the end.
</citation_rules>
```

```xml
<grounding_rules>
- Base claims only on provided context or tool outputs.
- If sources conflict, state the conflict explicitly and attribute each side.
- If the context is insufficient or irrelevant, narrow the answer or say you cannot support the claim.
- If a statement is an inference rather than a directly supported fact, label it as an inference.
</grounding_rules>
```

如果你的应用要求行内引文，则要求行内引文。如果要求脚注，则要求脚注。关键在于锁定格式，防止模型即兴生成未经验证的引用。

#### 研究模式

将GPT-5.4推入纪律性研究模式。对于研究、审查和综合任务使用此模式。不要将其强制用于短期执行任务或简单的确定性转换。

```xml
<research_mode>
- Do research in 3 passes:
  1) Plan: list 3-6 sub-questions to answer.
  2) Retrieve: search each sub-question and follow 1-2 second-order leads.
  3) Synthesize: resolve contradictions and write the final answer with citations.
- Stop only when more searching is unlikely to change the conclusion.
</research_mode>
```

如果你的宿主环境使用特定的研究工具或要求提交步骤，请将此模式与宿主的最终化契约结合。

#### 限制严格输出格式

对于 SQL、JSON 或其他对解析敏感的输出，指示 GPT-5.4 仅生成目标格式，并在完成前进行检查。

```text
<structured_output_contract>
- Output only the requested format.
- Do not add prose or markdown fences unless they were requested.
- Validate that parentheses and brackets are balanced.
- Do not invent tables or fields.
- If required schema information is missing, ask for it or return an explicit error object.
</structured_output_contract>
```

如果正在提取文档区域或 OCR 框，请定义坐标系并添加漂移检查：

```text
<bbox_extraction_spec>
- Use the specified coordinate format exactly, such as [x1,y1,x2,y2] normalized to 0..1.
- For each box, include page, label, text snippet, and confidence.
- Add a vertical-drift sanity check so boxes stay aligned with the correct line of text.
- If the layout is dense, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 在编码和终端智能体中保持工具边界明确

在编写 智能体 代码时，当 shell 访问和文件编辑的规则明确无误时，GPT-5.4 表现更好。这一点在您公开此类工具时尤为重要： [Shell](https://developers.openai.com/api/docs/guides/tools-shell) 或 [Apply patch](https://developers.openai.com/api/docs/guides/tools-apply-patch).

#### 用户更新

GPT-5.4 在简短、基于结果的更新方面表现出色。沿用 5.2 指南中的用户更新模式，但需配合明确的完成与验证要求。

推荐的更新规格：

```xml
<user_updates_spec>
- Only update the user when starting a new major phase or when something changes the plan.
- Each update: 1 sentence on outcome + 1 sentence on next step.
- Do not narrate routine tool calls.
- Keep the user-facing status short; keep the work exhaustive.
</user_updates_spec>
```

有关编码智能体，请参阅下文“编码任务的提示模式”部分以获取更具体的指导。

#### 编码任务的提示模式

**自主性与持久性**

GPT-5.4 在编码和工具使用任务上通常比早期主线模型更全面端到端，因此你往往不需要明确提示“验证一切”。尽管如此，对于生产、迁移或安全等高影响变更，仍需保留简明的验证条款。

```xml
<autonomy_and_persistence>
Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.

Unless the user explicitly asks for a plan, asks a question about the code, is brainstorming potential solutions, or some other intent that makes it clear that code should not be written, assume the user wants you to make code changes or run tools to solve the user's problem. In these cases, it's bad to output your proposed solution in a message, you should go ahead and actually implement the change. If you encounter challenges or blockers, you should attempt to resolve them yourself.
</autonomy_and_persistence>
```

**中间更新**

保持更新稀疏且高信号。在编码任务中，更倾向于在关键点进行更新。

```xml
<user_updates_spec>
- Intermediary updates go to the `commentary` channel.
- User updates are short updates while you are working. They are not final answers.
- Use 1-2 sentence updates to communicate progress and new information while you work.
- Do not begin responses with conversational interjections or meta commentary. Avoid openers such as acknowledgements ("Done -", "Got it", or "Great question") or similar framing.
- Before exploring or doing substantial work, send a user update explaining your understanding of the request and your first step. Avoid commenting on the request or starting with phrases such as "Got it" or "Understood."
- Provide updates roughly every 30 seconds while working.
- When exploring, explain what context you are gathering and what you learned. Vary sentence structure so the updates do not become repetitive.
- When working for a while, keep updates informative and varied, but stay concise.
- When work is substantial, provide a longer plan after you have enough context. This is the only update that may be longer than 2 sentences and may contain formatting.
- Before file edits, explain what you are about to change.
- While thinking, keep the user informed of progress without narrating every tool call. Even if you are not taking actions, send frequent progress updates rather than going silent, especially if you are thinking for more than a short stretch.
- Keep the tone of progress updates consistent with the assistant's overall personality.
</user_updates_spec>
```

**格式**

GPT-5.4 通常默认采用更结构化的格式，可能过度使用项目符号列表。若希望最终响应干净整洁，请明确约束列表形状。

```xml
Never use nested bullets. Keep lists flat (single level). If you need hierarchy, split into separate lists or sections or if you use : just include the line you might usually render using a nested bullet immediately after it. For numbered lists, only use the `1. 2. 3.` style markers (with a period), never `1)`.
```

**前端任务**

仅当额外的前端指导有用时才使用此功能。

```xml
<frontend_tasks>
When doing frontend design tasks, avoid generic, overbuilt layouts.

Use these hard rules:
- One composition: The first viewport must read as one composition, not a dashboard, unless it is a dashboard.
- Brand first: On branded pages, the brand or product name must be a hero-level signal, not just nav text or an eyebrow. No headline should overpower the brand.
- Brand test: If the first viewport could belong to another brand after removing the nav, the branding is too weak.
- Full-bleed hero only: On landing pages and promotional surfaces, the hero image should usually be a dominant edge-to-edge visual plane or background. Do not default to inset hero images, side-panel hero images, rounded media cards, tiled collages, or floating image blocks unless the existing design system clearly requires them.
- Hero budget: The first viewport should usually contain only the brand, one headline, one short supporting sentence, one CTA group, and one dominant image. Do not place stats, schedules, event listings, address blocks, promos, "this week" callouts, metadata rows, or secondary marketing content there.
- No hero overlays: Do not place detached labels, floating badges, promo stickers, info chips, or callout boxes on top of hero media.
- Cards: Default to no cards. Never use cards in the hero unless they are the container for a user interaction. If removing a border, shadow, background, or radius does not hurt interaction or understanding, it should not be a card.
- One job per section: Each section should have one purpose, one headline, and usually one short supporting sentence.
- Real visual anchor: Imagery should show the product, place, atmosphere, or context.
- Reduce clutter: Avoid pill clusters, stat strips, icon rows, boxed promos, schedule snippets, and competing text blocks.
- Use motion to create presence and hierarchy, not noise. Ship 2-3 intentional motions for visually led work, and prefer Framer Motion when it is available.

Exception: If working within an existing website or design system, preserve the established patterns, structure, and visual language.
</frontend_tasks>
```

```xml
<terminal_tool_hygiene>
- Only run shell commands via the terminal tool.
- Never "run" tool names as shell commands.
- If a patch or edit tool exists, use it directly; do not attempt it in bash.
- After changes, run a lightweight verification step such as ls, tests, or a build before declaring the task done.
</terminal_tool_hygiene>
```

#### 文档本地化与 OCR 框

对于 bbox 任务，请明确坐标约定并添加漂移测试。

```xml
<bbox_extraction_spec>
- Use the specified coordinate format exactly (for example [x1,y1,x2,y2] normalized 0..1).
- For each bbox, include: page, label, text snippet, confidence.
- Add a vertical-drift sanity check:
  - ensure bboxes align with the line of text (not shifted up or down).
- If dense layout, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 使用运行时与API集成说明

对于长时间运行或重度使用工具的智能体，运行时契约与提示词契约同等重要。

##### 阶段参数

对于 GPT-5.4、 `gpt-5.3-codex`，以及后续的 Responses 模型， `phase` 该字段可以
在少数长流程或工具密集的流程中提供帮助，避免前言或
其他中间助手更新被误认为最终答案。

- `phase` 在 API 级别是可选的，但强烈推荐。服务端可能存在尽力而为的推断，但显式往返 `phase` 明显更好。
- 使用 `phase` 适用于长期运行或工具密集型的 智能体，它们可能在工具调用前或最终答案前发出评论。
- 保留 `phase` 在重放之前的助手消息时，以便模型能够区分工作评论和最终答案。这在包含前言、工具相关更新或同一轮中多条助手消息的多步流程中最为重要。
- 不要添加 `phase` 到用户消息中。
- 如果你使用 `previous_response_id`，那通常是最简单的路径，因为 OpenAI 通常能够恢复之前的状态，而无需手动重放助手消息。
- 如果你自己重放助手历史，保留原始的 `phase` 值。
- 缺失或丢弃 `phase` 可能导致前言被解释为最终答案，从而降低这些多步任务的性能。

#### 在长时间会话中保持行为

压缩可解锁显著更长的有效上下文窗口，用户对话可在不触及上下文限制或长上下文性能下降的情况下持续多轮，智能体也可以执行远超典型上下文窗口的超长轨迹，适用于长时间运行的复杂任务。

如果你正在使用 [压缩](https://developers.openai.com/api/docs/guides/compaction) ，请在Responses API中在主要里程碑之后进行压缩，将压缩后的条目视为不透明状态，并确保压缩后提示词在功能上保持一致。该端点兼容 ZDR，并返回一个 `encrypted_content` 条目，你可以在后续请求中传入。GPT-5.4 在更长、多轮对话中往往能保持更高的连贯性和可靠性，随着会话增长，故障更少。

更多指导，请参阅 [`/responses/compact` API参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

#### 面向客户工作流的个性控制

当你将持久的个性与逐条回复的写作控制分开时，GPT-5.4 可以被更有效地引导。这对于面向客户的工作流尤其有用，例如电子邮件、支持回复、公告和博客风格的内容。

- **个性（持久）：** 设定整个会话中的默认语气、详细程度和决策风格。
- **写作控制（每次响应）：** 定义特定工件的渠道、语域、格式和长度。
- **提醒：** 个性不应覆盖特定任务的输出要求。如果用户要求 JSON，则返回 JSON。

对于自然、高质量的文本，最具杠杆作用的控制项是：

- 给模型一个清晰的人设。
- 指明渠道和情感基调。
- 当你想要散文时，明确禁止格式化。
- 使用硬性长度限制。

```xml
<personality_and_writing_controls>
- Persona: <one sentence>
- Channel: <Slack | email | memo | PRD | blog>
- Emotional register: <direct/calm/energized/etc.> + "not <overdo this>"
- Formatting: <ban bullets/headers/markdown if you want prose>
- Length: <hard limit, e.g. <=150 words or 3-5 sentences>
- Default follow-through: if the request is clear and low-risk, proceed without asking permission.
</personality_and_writing_controls>
```

如需更多可直接套用的个性模式，请参阅 [Prompt Personalities cookbook](https://developers.openai.com/cookbook/examples/gpt-5/prompt_personalities).

**专业备忘录模式**

对于备忘录、评审及其他专业写作任务，通用写作指令往往不够充分。此类工作流受益于关于具体性、领域规范、综合归纳和校准确定性的明确指导。

```xml
<memo_mode>
- Write in a polished, professional memo style.
- Use exact names, dates, entities, and authorities when supported by the record.
- Follow domain-specific structure if one is requested.
- Prefer precise conclusions over generic hedging.
- When uncertainty is real, tie it to the exact missing fact or conflicting source.
- Synthesize across documents rather than summarizing each one independently.
</memo_mode>
```

此模式在法律、政策、研究和面向高管的写作中尤其有用，其目标不仅是行文流畅，更在于有条理的综合分析和清晰的结论。

### 调整推理与迁移

#### 将推理强度视为最后一公里的旋钮

推理强度并非放之四海而皆准。应将其视为最后阶段的调优旋钮，而非提升质量的主要手段。在许多情况下，更强的提示词、清晰的输出契约和轻量级验证循环，能够恢复团队可能试图通过更高推理设置来获取的大部分性能。

推荐默认值：

- `none`：最适合快速、对成本敏感、对延迟敏感的任务，此时模型无需思考。
- `low`：适用于对延迟敏感的任务，少量思考即可带来有意义的准确性提升，尤其是在指令复杂的情况下。
- `medium` 或 `high`：仅用于真正需要更强推理能力且能承受延迟和成本权衡的任务。根据任务从额外推理中获得的性能提升程度，在它们之间进行选择。
- `xhigh`：除非评估显示有明显优势，否则避免将其作为默认选择。它最适合长时间、智能体型、推理密集型的任务，此时最大智能比速度或成本更重要。

在实践中，大多数团队应默认使用 `none`, `low`，或 `medium` 范围。

从 `none` 开始，适用于执行密集型工作负载，如工作流步骤、字段提取、支持分类和短结构化转换。

从 `medium` 或更高版本开始，适用于研究密集型工作负载，如长上下文综合、多文档审阅、冲突解决和策略撰写。通过 `medium` 和精心设计的提示，你可以挖掘出大量性能。

对于GPT-5.4工作负载， `none` 在动作选择和工具纪律任务上已经表现良好。如果你的工作负载依赖于细微解释，如隐式需求、歧义或取消工具调用恢复，请从 `low` 或 `medium` 开始。

在增加推理努力之前，首先添加：

- `<completeness_contract>`
- `<verification_loop>`
- `<tool_persistence_rules>`

如果模型仍然感觉过于字面或停留在第一个看似合理的答案，在提高推理努力之前，添加一个主动性推动：

```xml
<dig_deeper_nudge>
- Don’t stop at the first plausible answer.
- Look for second-order issues, edge cases, and missing constraints.
- If the task is safety or accuracy critical, perform at least one verification step.
</dig_deeper_nudge>
```

#### 逐步将提示词迁移到 GPT-5.4

采用与 5.2 指南相同的单次变更纪律：先切换模型，固定 `reasoning_effort`，运行评估，然后迭代。

以下起点适用于许多迁移：

| 当前设置             | 建议的 GPT-5.4 起点            | 备注                                                               |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `gpt-5.2`                 | 匹配当前的推理投入 | 首先保持现有的延迟和质量特征，然后再进行调整。 |
| `gpt-5.3-codex`           | 匹配当前的推理投入 | 对于编码工作流，保持相同的推理投入。           |
| `gpt-4.1` 或 `gpt-4o`     | `none`                             | 保持快速响应行为，仅在评估结果退化时增加投入。           |
| 研究密集型智能体 | `medium` 或 `high`                 | 使用明确的多轮研究流程和引用门控。               |
| 长时间运行的智能体       | `medium` 或 `high`                 | 添加工具持久化和完整性核算。                   |

#### 小模型使用指南 `gpt-5.4-mini` 和 `gpt-5.4-nano`

`gpt-5.4-mini` 并且 `gpt-5.4-nano` 非常易于操控，但相对于较大模型，它们更不容易推断缺失步骤、隐式解决歧义，或按照你的意图打包输出，除非你直接指定该行为。实践中，针对较小模型的提示词往往更长且更明确。

**How `gpt-5.4-mini` differs**

- `gpt-5.4-mini` 更直接，且做出的假设更少。
- 当任务结构清晰时，它表现强劲，但在隐式工作流和歧义处理方面较弱。
- 默认情况下，它可能会通过后续问题来保持对话继续，除非你明确抑制该行为。

**提示词编写 `gpt-5.4-mini`**

- 将关键规则放在前面。
- 当工具使用或副作用很重要时，明确完整的执行顺序。
- 不要仅依赖“你必须”。使用结构化支架，如编号步骤、决策规则和明确的操作定义。
- 区分“执行操作”和“报告操作”。
- 展示正确的流程，而不仅仅是最终格式。
- 明确定义模糊行为的处理方式：何时询问、放弃或继续。
- 直接指定包装方式：答案长度、是否提出后续问题、引用风格和章节顺序。
- 小心处理 `output nothing else`。优先选择范围限制的指令，例如 `after the final JSON, output nothing further`.

**提示词 `gpt-5.4-nano`**

- 请仅将 `gpt-5.4-nano` 用于狭窄且界限明确的任务。
- 优先选择封闭输出：标签、枚举、简短 JSON 或固定模板。
- 除非流程受到严格限制，否则避免多步骤编排。
- 对于模糊或规划繁重的任务，应路由到更强的模型，而非过度提示。 `gpt-5.4-nano`.

**良好的默认模式**

1. 任务
2. 关键规则
3. 精确步骤顺序
4. 边界情况或澄清行为
5. 输出格式
6. 一个正确示例

**避免**

- 隐含的后续步骤
- 未指定的边界情况
- 仅含模式的工具工作流提示
- 无结构的通用指令

#### 网页搜索和深度研究

如果你特别在迁移研究智能体，请在增加推理努力之前进行这些提示更新：

- 添加 `<research_mode>`
- 添加 `<citation_rules>`
- 添加 `<empty_result_recovery>`
- 增加 `reasoning_effort` 仅在提示修复后提升一个级别。

你可以从 5.2 研究模块入手，然后根据需要加入引用门控和完成契约。

当任务需要多步骤证据收集、长上下文综合和明确的提示词契约时，GPT-5.4 表现尤为出色。实践中，最高杠杆的提示词调整包括根据任务形态选择推理力度、定义精确的输出和引用格式、添加依赖感知的工具规则，以及将完成标准明确化。该模型通常开箱即用表现强大，但当提示词明确指定如何搜索、如何验证以及什么算完成时，其表现最为可靠。

### 后续步骤

- 查看 [模型、API和功能更新](#model-api-and-feature-updates) 了解模型能力、参数和API兼容性详情。
- 阅读 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) 了解适用于不同模型家族的更广泛的提示策略。
- 阅读 [压缩](https://developers.openai.com/api/docs/guides/compaction) 如果你正在Responses API中构建长时间运行的 GPT-5.4 会话。


## 延伸阅读

[GPT-5.3-Codex 提示词指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.4 博客文章](https://openai.com/index/introducing-gpt-5-4/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型系列：新特性指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[推理模型烹饪书](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)