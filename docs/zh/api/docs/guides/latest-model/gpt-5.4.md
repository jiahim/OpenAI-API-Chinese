# 使用 GPT-5.4

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加以下内容即可获取文档页面的 Markdown 版本： `.md` 。

## 简介

[GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) 作为面向专业工作的前沿模型，已在 API 和 Codex 中发布。它能帮助开发者分析复杂信息、构建生产级软件并自动化多步骤工作流。

在 GPT-5.4 系列中， `gpt-5.4` 是面向跨软件工程、推理、写作与工具调用等工作流的通用模型。

本指南介绍 GPT-5 模型系列的关键特性，以及如何充分发挥 GPT-5.4 的能力。

## 新增功能

与之前的 GPT-5.2 模型相比，GPT-5.4 在以下方面有所改进：

- 编码、文档理解、工具使用与指令遵循
- 图像感知与多模态任务
- 长时任务执行与多步骤智能体工作流
- 在工具密集型工作负载上的 token 效率与端到端性能
- 用于查找困难信息的网页搜索与多源整合
- 客服、分析与财务领域中以文档和电子表格为主的重业务工作流

GPT-5.4 将 GPT-5.3-Codex 的编码能力带到了我们的旗舰前沿模型中。开发者可以生成生产级代码、打磨精致的前端 UI、遵循仓库专属模式，并以更少的重试处理多文件变更。它还具备强大的开箱即用编码个性，让团队在提示词调优上花费更少的时间。

在智能体工作负载方面，GPT-5.4 缩短了多步骤轨迹的端到端时间，并且通常以更少的 token 和工具调用完成任务。这使得 智能体 响应更敏捷，并降低了在 API 和 Codex 中大规模运行复杂工作流时的成本。

### GPT-5.4 中的新功能

与早期 GPT-5 模型一样，GPT-5.4 支持自定义工具、用于控制详细程度和推理的参数，以及允许使用的工具列表。GPT-5.4 还引入了多项新能力，使构建强大的智能体系统、操作更大规模信息以及运行更可靠的自动化工作流变得更加容易：

- **`tool_search` 在 API 中：** GPT-5.4 通过延迟工具加载改进了更大工具生态系统的工具搜索能力。这使得工具可被搜索，只加载相关的定义，降低 token 用量，并在实际部署中提升工具选择准确性。详情请参阅 [工具搜索指南](https://developers.openai.com/api/docs/guides/tools-tool-search).
- **1M token 上下文窗口：** GPT-5.4 支持最高 1M token 的上下文窗口，便于在单次请求中分析整个代码库、长文档集合或扩展的 智能体 轨迹。详情请参阅 [1M 上下文窗口](#1m-context-window) 章节。
- **内置计算机使用：** GPT-5.4 是首个内置计算机使用能力的主流模型，使 智能体 能够直接与软件交互，在构建-运行-验证-修复循环中完成、验证和修复任务。详情请参阅 [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use).
- **原生压缩支持：** GPT-5.4 是首个经过训练以支持压缩的主流模型，能够在保留关键上下文的同时支持更长的 智能体 轨迹。

## 模型、API 与功能更新

在此模型代次中， `gpt-5.4` 是适用于广泛任务和编码的通用模型。对于更困难的问题， `gpt-5.4-pro` 会使用更多算力进行更长时间的思考，并提供更一致的答案。

若需要更小、更快的变体，可以从 `gpt-5.4-mini` 或 `gpt-5.4-nano`.

着手。为了帮助你挑选最适合你用例的模型，可以参考以下取舍：

| 变体                                         | 适用场景                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4)           | 通用任务，包括复杂推理、广博的世界知识，以及代码密集或多步骤的智能体任务 |
| [`gpt-5.4-pro`](https://developers.openai.com/api/docs/models/gpt-5.4-pro)   | 可能需要更长时间解决且需要更深层次推理的难题                                               |
| [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | 高吞吐量的编码、计算机使用以及仍需强推理能力的智能体工作流                               |
| [`gpt-5.4-nano`](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | 追求速度与成本的高吞吐量任务                                                               |

### 降低推理强度

该 `reasoning.effort` 参数控制模型在生成响应之前产生的推理 token 数量。像 o3 这类较早的推理模型仅支持 `low`, `medium`，并且 `high`: `low` 倾向于更快的速度和更少的 token，而 `high` 倾向于更全面的推理。

GPT-5.2 和 GPT-5.4 支持将 `none` 作为它们最低的推理力度，用于实现更低延迟的交互。这也是这两个模型的默认设置。如果你需要更多的思考，请逐步调高到 `medium` 并进行试验。

当推理力度设置为 `none`，时，提示工程非常重要。为了提升模型的推理质量，即使使用默认设置，也要鼓励它先“思考”或先列出回答的步骤，再给出答案。

推理力度设置为 none

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

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-5.4",
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
  model: "gpt-5.4",
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
        "model": "gpt-5.4",
        "input": "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
        "reasoning": {
                "effort": "none"
        }
}'
```


### 详细程度

详细程度决定生成的输出 token 数量。降低 token 数量可以缩短整体延迟。虽然模型的推理方式基本不变，但模型会尝试以更简洁的方式回答——这可能会提升或降低回答质量，具体取决于你的使用场景。下面是详细程度光谱两端的几种场景：

- **高详细度：** 当你需要模型对文档提供详尽的解释或执行大量的代码重构时使用。
- **低详细度：** 最适合需要简洁回答或聚焦式代码生成（例如 SQL 查询）的场景。

GPT-5 使此选项可配置为以下之一 `high`, `medium`，或者 `low`。在 GPT-5.4 中，详细程度仍然可配置，默认值为 `medium`.

在使用 GPT-5.4 生成代码时， `medium` 并且 `high` 详细程度等级越高，生成的代码会更长且结构更清晰，并附带内联解释，而 `low` 详细程度则会生成更短、更简洁的代码，并附以极少的注释。

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
  "model": "gpt-5.4",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```


你仍然可以在 API 中将其设置为该值后，通过提示来引导详细程度。verbosity 参数在系统提示级别上定义了一个通用的 token 范围，但实际输出在该范围内对开发者和用户提示都具有灵活性。 `low` 在 接口 中将其设置为该值后，你仍然可以通过提示来引导详细程度。verbosity 参数在系统提示级别上定义了一个通用的 token 范围，但实际输出在该范围内对开发者和用户提示都具有灵活性。

#### 1M context window

1M token context window was introduced with GPT-5.4, making it easier to analyze entire codebases, long document collections, or extended 智能体 trajectories in a single request.

We have separate standard pricing for requests under 272K and over 272K tokens, available in the [pricing docs](https://developers.openai.com/api/docs/pricing). If you use [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode), any prompt above 272K tokens is automatically processed at standard rates.

Long context pricing stacks with other pricing modifiers such as data residency and batch.

We have different rate limits for requests under 272K tokens and over 272K tokens; this is available on the [GPT-5.4 model page](https://developers.openai.com/api/docs/models/gpt-5.4).

## 使用 GPT-5.4 调用工具

GPT-5.4 已针对特定工具进行了后训练。参阅 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

### Computer use 工具

Computer use 让 GPT-5.4 通过检查截图并返回供你的执行框架使用的结构化操作来操控软件界面。它非常适合那些由人能够通过 UI 完成任务的浏览器或桌面工作流，例如浏览网站、填写表单，或验证某项更改是否真正生效。

请在隔离的浏览器或虚拟机中使用它，并对高影响操作保持人在回路。完整指南涵盖了内置的 Responses API 循环、自定义执行框架模式以及基于代码执行的方案。

[Computer use 指南



      Learn how to run the built-in computer tool safely and integrate it with
    your own harness.](https://developers.openai.com/api/docs/guides/tools-computer-use)

### Tool search 工具

工具搜索允许 GPT-5.4 将大型工具集延迟到运行时再加载，以便模型只加载它需要的定义。当你有大量函数时，这最为有用， `namespaces`，或 MCP 工具，并且希望在不完全暴露每个 schema 的前提下降低 token 使用量、保持缓存性能并改善延迟。

当候选工具在请求时已经确定时，使用 托管工具 search；当你的应用需要动态决定加载哪些工具时，使用客户端执行的工具搜索。完整指南还涵盖了相关最佳实践，包括 `namespaces`、MCP 服务器以及延迟加载。

[Tool search guide



      Learn how to defer tool definitions and load the right subset at runtime.](https://developers.openai.com/api/docs/guides/tools-tool-search)

### 自定义工具

在 GPT-5 模型系列发布时，我们引入了一项名为自定义工具（custom tools）的新能力，它允许模型将任意原始文本作为工具调用输入发送，同时在需要时仍可约束输出。这一工具行为在 GPT-5.4 中依然适用。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### Freeform inputs

使用以下方式定义你的工具 `type: custom` 以使模型能够将明文输入直接发送到你的工具，而不是仅限于结构化的 JSON。模型可以将任何原始文本——代码、SQL 查询、shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.4 支持上下文无关文法 (`CFGs`) 用于自定义工具，让你可以提供 Lark 文法来将输出约束到特定语法或 DSL。例如附加 CFG（如 SQL 或 DSL 文法）可确保助手的文本与你的文法匹配。

这使你能够在 GPT-5.4 的函数调用中直接实现精确、受约束的工具调用或结构化响应，并强制执行严格的语法或特定领域格式，从而提升在复杂或受限领域中的可控性与可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述决定发送什么内容；如果希望模型始终调用该工具，请明确说明。
- **在服务端校验输出**。自由格式字符串功能强大，但需要防范注入或不安全命令的风险。

### Allowed tools

该 `allowed_tools` 下的参数 `tool_choice` 允许你传入 N 个工具定义，但将模型限制为仅使用其中 M 个（&lt; N）个。在 `tools`，中列出你的完整工具集，然后使用一个 `allowed_tools` 块来指定该子集并设定模式—— `auto` （模型可任选其中一个）或 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可用工具与当前可调用的子集分离开来 _，_，你可以获得更高的安全性、可预测性，以及改进的提示缓存效果。同时也避免了脆弱的提示工程，例如硬编码调用顺序。GPT-5.4 能够在对话中动态调用或要求使用特定函数，同时降低长上下文中意外调用工具的风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型可用的工具范围 | 下列所有工具 **`"tools": […]`** | 仅限下列子集 **`"tools": […]`** 中的 **`tool_choice`** |
| 工具调用  | 模型可调用也可不调用任何工具        | 模型仅限于（或必须调用）所选的工具        |
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

有关所有这些新功能的更详细概述，请参阅 [GPT-5.4 提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices).

### 前言

前言是 GPT-5.4 在调用任何工具或函数之前生成的简短、用户可见的说明，用于概述其意图或计划——例如“为什么要调用此工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.4 在每次工具调用前“边想边说”，前言可以在不显著增加推理开销的情况下提升工具调用准确性（以及整体任务成功率）。要启用前言，请添加系统或开发者指令——例如：“在调用工具之前，请说明你调用它的原因。” GPT-5.4 会为每个指定的工具调用添加简明的理由。模型还可能在工具调用之间输出多条消息，这可以增强交互体验——尤其是对于低推理或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.4 与 Responses API 配合使用效果最佳，该 接口 支持在多轮之间保留推理上下文以提升性能。请阅读下文，了解如何从当前模型或 API 迁移。

### 从其他模型迁移到 GPT-5.4

使用 [OpenAI 文档
  技能](https://github.com/openai/skills/tree/main/skills/.system/openai-docs)
  将现有提示词或工作流迁移到 GPT-5.4 时使用。它在我们的
  公开技能仓库和 Codex 桌面应用中可用。

虽然该模型应能接近即插即用地替换 GPT-5.2，但仍有一些关键变更需要注意。详见 [GPT-5.4 提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices) ，了解需要在提示词中做出的具体更新。

使用 GPT-5 模型配合 Responses API 可获得更强的智能，这得益于 API 的设计。Responses API 可以将上一轮的思维链传递给模型，从而减少生成的推理 token、提高缓存命中率并降低延迟。了解更多信息，请参阅 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) ，了解 Responses API 的优势。

从旧的 OpenAI 模型迁移到 GPT-5.4 时，建议先试验推理级别和提示策略。使用 [提示词优化工具](https://platform.openai.com/chat/edit?models=gpt-5.4&optimize=true) 根据当前最佳实践更新你针对 GPT-5.4 的提示词，然后参考以下针对该模型的指导：

- **`gpt-5.2`**: `gpt-5.4` 在默认设置下可以直接替换使用。
- **o3**: `gpt-5.4` 搭配 `medium` 或 `high` 推理。从 `medium` 结合提示调优进行推理,如果仍未达到理想效果,再提升到 `high` 如果你没有获得想要的结果。
- **`gpt-4.1`**: `gpt-5.4` 搭配 `none` 推理。从 `none` 并对你的提示进行调优；如果需要更好的效果,可以增大用量。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5.4-mini` 结合提示调优是非常合适的替代方案。
- **`gpt-4.1-nano`**: `gpt-5.4-nano` 结合提示调优是非常合适的替代方案。

### New `phase` parameter

对于 GPT-5.4 中长时间运行或工具密集型的工作流，在 Responses API 中，请使用 assistant 消息 `phase` 字段，以避免提前停止和其他异常行为。

`phase` 字段在 API 层面是可选的，但我们强烈建议使用它。可使用 `phase: "commentary"` 表示中间阶段的 assistant 更新（例如工具调用前的开场白），使用 `phase: "final_answer"` 表示最终完成的回答。不要添加 `phase` 到用户消息中。

如果你使用 `previous_response_id`，这通常是最简单的路径，因为
  之前的 assistant 状态会被保留。如果你手动重放 assistant 历史记录，
  请保留每个原始的 `phase` 取值。

缺失或丢失的 `phase` 可能导致开场白被当作最终回答
，从而影响这些工作流。如需更多指导和示例，请参阅 [GPT-5.4
提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#phase-parameter).

往返 assistant 阶段取值

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
  reasoning: { effort: :medium },
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```


### GPT-5.4 参数兼容性

以下参数仅在 **使用 GPT-5.4 时支持，且** 需将推理强度设置为 `none`:

- `temperature`
- `top_p`
- `logprobs`

当 reasoning effort 设置为其他值时，包含这些字段的请求会在 GPT-5.4 或 GPT-5.2 上报错；在较旧的 GPT-5 模型（如 `gpt-5`, `gpt-5-mini`，或者 `gpt-5-nano`.

若要在更高的 reasoning effort 设置下，或在另一个 GPT-5 系列模型上获得类似结果，可尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的区别，也是从 Chat Completions 迁移到 Responses API（用于 GPT-5.4）的主要原因，是支持在多轮之间传递思维链（CoT）。查看完整的 [API 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅在 Responses API 中可用，我们观察到这样做带来了更高的智能水平、更少的生成推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数保持一致，但格式有所不同。以下展示了 Chat Completions 与 Responses API 之间新参数的处理方式差异：

**推理力度**



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

在排查 GPT-5.4 将中间更新视为最终答复的情况时，请验证你的集成是否正确保留了 assistant 消息字段。
  assistant 消息字段。详见 `phase`
  详见 [Phase 参数](#phase-parameter) 。

### 了解 GPT-5.4 的行为

#### GPT-5.4 最擅长的场景

GPT-5.4 在以下领域尤其表现出色：

- 强烈的性格与语气一致性，在长篇回答中漂移更少
- 智能体式 工作流 的稳健性，更倾向于坚持多步骤工作、不断重试，并端到端地完成 智能体 循环
- 富含证据的综合分析，尤其是在长上下文或多工具的工作流中
- 在契约明确时，对模块化、基于技能和块结构化提示词的指令遵循能力
- 在大型、杂乱或多文档输入上的长上下文分析
- 在保持工具调用准确性的同时进行批处理或并行工具调用
- 需要遵循指令、保持格式保真度并进行更强自我验证的电子表格、金融和 Excel 工作流

#### 显式提示仍然有用的场景

即便具备上述优势，GPT-5.4 在一些反复出现的模式中仍受益于更明确的指引：

- 会话早期的低上下文工具路由，此时工具选择的可靠性可能较低
- 需要明确的前置条件和后续步骤检查的依赖感知型工作流
- 推理力度选择，更高的力度并不总是更好，正确的选择取决于任务形态而非直觉
- 需要规范的资料收集和一致引用的研究任务
- 在执行前需要验证的不可逆或高影响操作
- 必须保持清晰工具边界的终端或编码类智能体环境

这些模式是观察到的默认行为，并非保证。请从能通过你评测的最小提示开始，只有当某个块能修复一个被测量到的失败模式时，才添加该块。

### 使用核心提示词模式

#### 保持输出简洁且结构化

若要在 GPT-5.4 中提升 token 使用效率，可以通过明确的输出契约来限制 verbosity 并强制使用结构化输出。在实践中，这与 Responses API 中的相关 `verbosity` 参数一起充当额外的控制层，让你既可以控制模型的输出长度，也可以控制其输出结构。

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

#### 为后续执行设定明确的默认值

用户经常会在对话中途更改任务、格式或语气。为保持助手一致，需要明确定义何时继续、何时询问，以及较新的指令如何覆盖先前的默认设置。

使用类似这样的默认执行策略：

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

更高优先级的开发者或系统指令仍然有效。

**指引：** 当指令在对话中途发生变化时，需使更新显式、有范围且局部生效。说明哪些内容发生了变化、哪些仍然适用，以及该变化是影响下一轮还是影响整个对话的其余部分。

#### 处理对话过程中的指令更新

对于对话中途的更新，请使用明确且范围可控的引导消息，并说明：

1. 范围
2. 覆盖
3. 沿用

```text
<task_update>
For the next response only:
- Do not complete the task.
- Only produce a plan.
- Keep it to 5 bullets.

All earlier instructions still apply unless they conflict with this update.
</task_update>
```

如果任务本身发生了变化，请直接说明：

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

#### 当正确性依赖于工具调用时，使其保持持久化

使用明确的规则来保持工具使用的完整性、依赖感知和恰当节奏，尤其是在后续动作依赖早期检索或验证的工作流中。一种常见的失败模式是：因看似明确的最终状态而跳过前置步骤。

GPT-5.4 在会话初期、上下文仍然较少时，工具路由的可靠性可能较低。请在提示中明确要求前置步骤、依赖检查和精确的工具意图。

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

这对工作流尤为重要，因为最终动作取决于更早的查找或检索步骤。最常见的失败模式之一是跳过前置条件，因为预期的最终状态看起来显而易见。

```xml
<dependency_checks>
- Before taking an action, check whether prerequisite discovery, lookup, or memory retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If the task depends on the output of a prior step, resolve that dependency first.
</dependency_checks>
```

当工作相互独立且挂钟时间很重要时，提示采用并行；当依赖关系、歧义或不可逆操作比速度更重要时，提示采用顺序。

```xml
<parallel_tool_calling>
- When multiple retrieval or lookup steps are independent, prefer parallel tool calls to reduce wall-clock time.
- Do not parallelize steps that have prerequisite dependencies or where one result determines the next action.
- After parallel retrieval, pause to synthesize the results before making more calls.
- Prefer selective parallelism: parallelize independent evidence gathering, not speculative or redundant tool use.
</parallel_tool_calling>
```

#### Force completeness on long-horizon tasks

对于多步工作流，一种常见的失败模式是执行不完整：模型在仅完成部分覆盖后结束、遗漏批次中的项，或将空或狭窄的检索视为最终结果。当提示词明确定义完成规则和恢复行为时，GPT-5.4 会变得更加可靠。

可以通过顺序检索或并行检索来实现覆盖，但无论采用哪种方式，完成规则都应保持明确。

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

对于检索结果常出现空、部分或含噪声的工作流：

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

#### 在高影响操作前添加验证循环

当 工作流 看起来已完成时,在返回答案或执行不可逆操作之前,添加一个轻量的验证步骤。这有助于在提交之前发现遗漏的需求、事实依据问题以及格式偏差。

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

对于会主动采取行动的 智能体,添加一个简短的执行框架:

```xml
<action_safety>
- Pre-flight: summarize the intended action and parameters in 1-2 lines.
- Execute via tool.
- Post-flight: confirm the outcome and any validation that was performed.
</action_safety>
```

### 处理专用工作流

#### 为视觉和计算机使用明确选择图像细节

如果你的工作流依赖视觉精度，请在提示词或集成中明确指定图像 `detail` 级别，而不要依赖默认值 `auto`。使用 `high` 进行标准的高保真图像理解。使用 `original` 处理大型、密集或对空间敏感度的图像，特别是 [计算机使用、本地化、OCR 和点击精度任务](https://developers.openai.com/api/docs/guides/tools-computer-use) 基于 `gpt-5.4` 以及未来模型。仅当速度和成本比细节更重要时才使用 `low` 。有关图像细节级别的更多详情，请参阅 [图像与视觉指南](https://developers.openai.com/api/docs/guides/images-vision).

#### 将研究与引用锁定到已检索的证据

当引用质量至关重要时，应同时明确来源边界和格式要求。这有助于减少编造的引用、没有依据的论断以及引用格式的偏差。

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

如果你的应用需要行内引用，就要求行内引用；如果需要脚注，就要求脚注。关键在于锁定格式，防止模型自行编造没有依据的引用。

#### Research 模式

将 GPT-5.4 推入一种严谨的研究模式。对于研究、评审和综合任务，请使用该模式。不要将其强加于短小的执行任务或简单的确定性转换。

```xml
<research_mode>
- Do research in 3 passes:
  1) Plan: list 3-6 sub-questions to answer.
  2) Retrieve: search each sub-question and follow 1-2 second-order leads.
  3) Synthesize: resolve contradictions and write the final answer with citations.
- Stop only when more searching is unlikely to change the conclusion.
</research_mode>
```

如果你的宿主环境使用特定的研究工具或需要提交步骤，请将此模式与宿主的定稿协议结合使用。

#### Clamp strict output formats

对于 SQL、JSON 或其他对解析敏感的输出，需指示 GPT-5.4 仅输出目标格式，并在完成前进行校验。

```text
<structured_output_contract>
- Output only the requested format.
- Do not add prose or markdown fences unless they were requested.
- Validate that parentheses and brackets are balanced.
- Do not invent tables or fields.
- If required schema information is missing, ask for it or return an explicit error object.
</structured_output_contract>
```

如果需要提取文档区域或 OCR 框，请定义坐标系并添加漂移检查：

```text
<bbox_extraction_spec>
- Use the specified coordinate format exactly, such as [x1,y1,x2,y2] normalized to 0..1.
- For each box, include page, label, text snippet, and confidence.
- Add a vertical-drift sanity check so boxes stay aligned with the correct line of text.
- If the layout is dense, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 在编码和终端智能体中保持工具边界清晰

在编写代码类智能体时，当 shell 访问和文件编辑的规则明确无误时，GPT-5.4 的表现会更好。当你开放如下工具时，这一点尤为重要： [Shell](https://developers.openai.com/api/docs/guides/tools-shell) 或 [Apply patch](https://developers.openai.com/api/docs/guides/tools-apply-patch).

#### 用户更新

GPT-5.4 在简洁、面向结果的更新中表现良好。复用 5.2 指南中的 user-updates 模式，但要同时配以明确的完成和验证要求。

推荐更新规范：

```xml
<user_updates_spec>
- Only update the user when starting a new major phase or when something changes the plan.
- Each update: 1 sentence on outcome + 1 sentence on next step.
- Do not narrate routine tool calls.
- Keep the user-facing status short; keep the work exhaustive.
</user_updates_spec>
```

对于编码智能体，请参阅下文的“编码任务的提示模式”部分以获取更具体的指导。

#### 编码任务的提示模式

**自主性与持久性**

GPT-5.4 在编码和工具使用任务上通常比早期主流模型更加端到端地彻底，因此你常常无需显式地提示它“验证一切”。不过，对于影响较大的更改，例如生产环境、迁移或安全相关工作，仍需保留一条轻量的验证条款。

```xml
<autonomy_and_persistence>
Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.

Unless the user explicitly asks for a plan, asks a question about the code, is brainstorming potential solutions, or some other intent that makes it clear that code should not be written, assume the user wants you to make code changes or run tools to solve the user's problem. In these cases, it's bad to output your proposed solution in a message, you should go ahead and actually implement the change. If you encounter challenges or blockers, you should attempt to resolve them yourself.
</autonomy_and_persistence>
```

**中间过程更新**

保持更新稀疏且高信噪比。在编码任务中，优先在关键节点提供更新。

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

GPT-5.4 默认倾向于更结构化的格式，并可能过度使用项目符号列表。如果希望得到简洁的最终回复，请明确约束列表形式。

```xml
Never use nested bullets. Keep lists flat (single level). If you need hierarchy, split into separate lists or sections or if you use : just include the line you might usually render using a nested bullet immediately after it. For numbered lists, only use the `1. 2. 3.` style markers (with a period), never `1)`.
```

**前端任务**

仅当需要额外的前端指导时使用此设置。

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

对于 bbox 任务，请明确说明坐标系约定，并添加漂移测试。

```xml
<bbox_extraction_spec>
- Use the specified coordinate format exactly (for example [x1,y1,x2,y2] normalized 0..1).
- For each bbox, include: page, label, text snippet, confidence.
- Add a vertical-drift sanity check:
  - ensure bboxes align with the line of text (not shifted up or down).
- If dense layout, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 使用运行时和API集成注意事项

对于长时间运行或大量使用工具的智能体，运行时契约与提示词契约同样重要。

##### Phase 参数

对于 GPT-5.4， `gpt-5.3-codex`，以及后续的 Responses 模型，该 `phase` 字段可在
少量长时间运行或工具密集型的工作流提供帮助，在这类工作流中，开场白或
其他中间助手更新容易被误认为是最终答案。

- `phase` 在 API 层面是可选的，但强烈推荐使用。服务端可能进行尽力推断，但显式往返传输 `phase` 效果要好得多。
- 使用 `phase` 用于长时间运行或工具调用密集的 智能体，这些智能体可能会在工具调用之前或最终回答之前发出评论性内容。
- 保留 `phase` 以便在回放先前的助手消息项时，模型能够区分工作过程中的评论性内容和已完成的最终回答。这在包含前导说明、工具相关更新或同一轮中多条助手消息的多步骤流程中尤为重要。
- 不要将 `phase` 添加到用户消息中。
- 如果你使用 `previous_response_id`，这通常是最简单的路径，因为 OpenAI 通常能够在不手动回放助手消息项的情况下恢复先前的状态。
- 如果你自行回放助手历史记录，请保留原始的 `phase` 值。
- 缺失或丢失的 `phase` 可能导致前导说明被误解为最终回答，从而降低这些多步骤任务的表现。

#### 在长会话中保留行为

压缩可显著延长有效的上下文窗口，用户对话可以持续多轮而不会触及上下文限制或长上下文性能下降，智能体可以执行远超典型上下文窗口的超长轨迹，以应对长时间运行的复杂任务。

如果你正在使用 [压缩](https://developers.openai.com/api/docs/guides/compaction) 在 Responses API 中，在达成主要里程碑后进行压缩，将压缩后的条目视为不透明状态，并在压缩后保持提示在功能上完全一致。该端点兼容 ZDR，并返回一个 `encrypted_content` 项，你可以将其传入后续请求。随着会话延长，GPT-5.4 在更长的多轮对话中往往能保持更高的连贯性与可靠性，较少出现崩溃。

如需更多指导，请参阅 [`/responses/compact` API 参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

#### 控制面向客户的工作流的个性

当你将持续性人格与单次响应的写作控制分开时，GPT-5.4 可以更有效地被引导。这对于面向客户的工作流尤其有用，例如电子邮件、支持回复、公告和博客风格的内容。

- **Personality（持久）：** 设置整个会话中的默认语气、冗长度和决策风格。
- **写作控制（按响应）：** 为特定产物定义渠道、语域、格式和长度。
- **提醒：** personality 不应覆盖任务特定的输出要求。如果用户要求 JSON，则返回 JSON。

对于自然、高质量的文本生成，最具杠杆效应的控制项包括：

- 为模型设定清晰的角色设定。
- 指定表达渠道与情感基调。
- 当你需要纯文本时，明确禁止使用格式。
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

如需更多可直接复用的性格模式，请参阅 [Prompt Personalities cookbook](https://developers.openai.com/cookbook/examples/gpt-5/prompt_personalities).

**专业备忘录模式**

对于备忘录、评审以及其他专业写作任务，通用写作指引往往不够。这些工作流需要关于具体性、领域惯例、综合分析以及恰当确定性方面的明确指导。

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

该模式在法律、政策、研究以及面向高管的写作场景中尤为有用，因为这些场景的目标不仅是文笔流畅，而是严谨的综合分析与清晰的结论。

### 调优推理与迁移

#### 将推理强度视为最后一公里的微调旋钮

推理强度并非放之四海而皆准。请将其视为最后阶段的微调旋钮，而不是提升质量的主要手段。在许多情况下，更强的提示、清晰的输出契约以及轻量级的验证循环，往往就能恢复团队本想通过更高推理设置来获取的大部分性能。

推荐默认值：

- `none`: 适用于对速度、成本和延迟敏感的快速任务，模型无需进行思考。
- `low`: 适用于对延迟敏感的任务，少量思考即可带来明显的准确性提升，尤其是在复杂指令下效果更佳。
- `medium` 或 `high`: 仅限于确实需要更强推理能力且能够接受更高延迟和成本权衡的任务。根据任务从额外推理中获得的性能提升程度，在它们之间进行选择。
- `xhigh`: 除非你的评估显示有明显收益，否则不要作为默认选项。它最适合长时、智能体驱动、推理密集型的任务，在这些场景中最大化智能比速度或成本更重要。

在实践中，大多数团队应默认使用 `none`, `low`，或者 `medium` 区间。

从以下模型开始 `none` ，用于执行密集型工作负载，例如 工作流 步骤、字段提取、支持分流和短结构化转换。

从以下模型开始 `medium` 或更高，用于研究密集型工作负载，例如长上下文综合、多文档审阅、冲突解决和策略撰写。使用 `medium` 并搭配精心设计的提示词，你可以压榨出大量性能。

对于 GPT-5.4 工作负载， `none` 在动作选择和工具规范任务上已经能够表现良好。如果你的工作负载依赖细致解读，例如隐含需求、歧义或被取消工具调用的恢复，请从 `low` 或 `medium` 开始。

在提升推理强度之前，请先补充：

- `<completeness_contract>`
- `<verification_loop>`
- `<tool_persistence_rules>`

如果模型仍然显得过于字面化，或停在第一个看似合理的答案上，请在提高推理强度之前加入主动性提示：

```xml
<dig_deeper_nudge>
- Don’t stop at the first plausible answer.
- Look for second-order issues, edge cases, and missing constraints.
- If the task is safety or accuracy critical, perform at least one verification step.
</dig_deeper_nudge>
```

#### 每次一处更改：将提示迁移到 GPT-5.4

采用与 5.2 指南相同的“每次只改一项”原则：先切换模型，然后固定 `reasoning_effort`，运行评估，再迭代。

以下这些起点对许多迁移场景都行之有效：

| 当前设置             | 建议的 GPT-5.4 起始设置            | 备注                                                               |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `gpt-5.2`                 | 匹配当前的推理强度 | 先保持现有延迟和质量特征，再进行调整。 |
| `gpt-5.3-codex`           | 匹配当前的推理强度 | 对于编程工作流，保持相同的推理强度。           |
| `gpt-4.1` 或 `gpt-4o`     | `none`                             | 保持快速响应行为，仅在评估出现回退时再上调。           |
| 研究密集型助手 | `medium` 或 `high`                 | 使用显式的研究多轮检索与引用门控。               |
| 长时程 智能体       | `medium` 或 `high`                 | 添加工具持久化与完整性核算。                   |

#### 针对小模型的指南 `gpt-5.4-mini` 和 `gpt-5.4-nano`

`gpt-5.4-mini` 并且 `gpt-5.4-nano` 具有高度可引导性，但与更大的模型相比，它们不太可能自行推断缺失的步骤、隐式地消除歧义，或按你预期的方式组织输出，除非你明确指定该行为。在实际使用中，面向较小模型的提示通常要稍长一些，并且需要更加明确。

**如何 `gpt-5.4-mini` 有所不同**

- `gpt-5.4-mini` 更加字面化，做出的假设更少。
- 在任务结构清晰的场景下表现较强，但在处理隐式工作流和歧义时表现较弱。
- 默认情况下，除非你明确抑制该行为，否则它可能会通过追问来延续对话。

**提示工程 `gpt-5.4-mini`**

- 把关键规则放在最前面。
- 当工具使用或副作用至关重要时，指定完整的执行顺序。
- 不要仅依赖 “你必须”。使用结构化支撑，例如编号步骤、决策规则和明确的操作定义。
- 把 “执行操作” 与 “报告操作” 分开。
- 展示正确的流程，而不仅仅是最终格式。
- 明确定义歧义行为：何时提问、放弃或继续。
- 直接指定输出格式：答案长度、是否提出后续问题、引用样式以及章节顺序。
- 谨慎使用 `output nothing else`。更推荐使用范围明确的指令，例如 `after the final JSON, output nothing further`.

**提示工程 `gpt-5.4-nano`**

- 使用 `gpt-5.4-nano` 仅用于范围明确且边界清晰的任务。
- 优先使用封闭输出：标签、枚举、简短 JSON 或固定模板。
- 除非流程极其受限，否则避免多步骤编排。
- 将含糊或需要大量规划的任务路由到更强的模型，而不是过度提示 `gpt-5.4-nano`.

**推荐的默认模式**

1. 任务
2. 关键规则
3. 精确步骤顺序
4. 边界情况或澄清行为
5. 输出格式
6. 一个正确示例

**Avoid**

- 隐含的后续步骤
- 未明确的边界情况
- 用于工具工作流的仅架构提示
- 无结构的通用指令

#### 网页搜索与深度研究

如果你要迁移的恰好是研究类智能体，请在提高推理力度之前完成以下提示词更新：

- Add `<research_mode>`
- Add `<citation_rules>`
- Add `<empty_result_recovery>`
- Increase `reasoning_effort` one notch only after prompt fixes.

你可以从 5.2 research 块开始，然后根据需要加入引用门控和定稿契约。

GPT-5.4 在任务需要多步证据收集、长上下文综合以及显式提示契约时表现尤其出色。在实际应用中，杠杆最高的提示调整包括：按任务形态选择推理强度、定义精确的输出和引用格式、添加感知依赖的工具规则，以及明确完成标准。该模型通常开箱即用就很强，但当提示清楚地指定如何搜索、如何验证以及什么算作完成时，它最为可靠。

### 后续步骤

- 查阅 [模型、API 与功能更新](#model-api-and-feature-updates) ，了解模型能力、参数以及 API 兼容性详情。
- 阅读 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) ，获取适用于各模型系列的更广泛提示策略。
- 阅读 [压缩](https://developers.openai.com/api/docs/guides/compaction) ，适用于在 Responses API 中构建长时间运行的 GPT-5.4 会话。

## 延伸阅读

[GPT-5.3-Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.4 博文](https://openai.com/index/introducing-gpt-5-4/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型系列：新功能指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[推理模型 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)