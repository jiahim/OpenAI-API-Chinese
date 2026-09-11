# 使用 GPT-5.4

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

[GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) 作为面向专业工作的前沿模型发布于 API 和 Codex。它帮助开发者分析复杂信息、构建生产级软件，并自动化多步工作流。

在 GPT-5.4 代际中， `gpt-5.4` 是在软件开发、推理、写作和工具使用之间切换的工作流的通用模型。

本指南介绍 GPT-5 模型系列的关键特性，以及如何充分发挥 GPT-5.4 的能力。

## 新增内容

相较于之前的 GPT-5.2 模型，GPT-5.4 在以下方面有所改进：

- 编程、文档理解、工具使用和指令遵循
- 图像感知和多模态任务
- 长时间运行的任务执行和多步骤 智能体工作流
- 在工具密集型工作负载下的 token 效率和端到端性能
- 针对难以查找信息的网页搜索和多源综合
- 客服、分析和财务领域中以文档和电子表格为主的工作流

GPT-5.4 将 GPT-5.3-Codex 的编码能力带到了我们的旗舰前沿模型中。开发者可以生成生产级代码、构建精致的前端 UI、遵循仓库特有的模式，并以更少的重试处理多文件变更。它还具备出色的开箱即用编码特性，使团队在提示调优上花费的时间更少。

在智能体工作负载方面，GPT-5.4 缩短了多步轨迹的端到端时间，并且通常以更少的 token 和工具调用完成任务。这使得 智能体 响应更快，并降低了在 API 和 Codex 中大规模运行复杂工作流 的成本。

### GPT-5.4 中的新功能

与早期 GPT-5 模型一样，GPT-5.4 支持自定义工具、可控制输出详细程度和推理强度的参数，以及允许使用的工具列表。GPT-5.4 还引入了多项能力，使构建强大的智能体系统、基于更大规模的信息进行操作，以及运行更可靠的自动化工作流变得更加容易：

- **`tool_search` 在 API 中：** GPT-5.4 通过使用延迟工具加载来改进对更大工具生态系统的工具搜索。这使工具可被搜索，仅加载相关定义，减少 token 使用量，并在实际部署中提升工具选择准确度。详情请参阅 [工具搜索指南](https://developers.openai.com/api/docs/guides/tools-tool-search).
- **1M token 上下文窗口：** GPT-5.4 支持最高 1M token 的上下文窗口，便于在单次请求中分析整个代码库、长文档集合或较长的 智能体 轨迹。更多信息请参阅 [1M 上下文窗口](#1m-context-window) 部分。
- **内置计算机使用：** GPT-5.4 是首个具备内置计算机使用能力的主流模型，使 智能体 能够直接与软件交互，在“构建—运行—验证—修复”循环中完成任务、验证并修复问题。详情请参阅 [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use).
- **原生压缩支持：** GPT-5.4 是首个经过训练以支持压缩功能的主流模型，可在保留关键上下文的同时支持更长的 智能体 轨迹。

## Model、API 与功能更新

在此模型代际中， `gpt-5.4` 是面向广泛任务和编程的通用模型。对于更困难的问题， `gpt-5.4-pro` 会使用更多算力进行更长时间的思考，从而给出更稳定的回答。

如果需要更小、更快的版本，可以从 `gpt-5.4-mini` 或 `gpt-5.4-nano`.

着手。为了帮助你挑选最适合用例的模型，请考虑以下权衡：

| Variant                                         | Best for                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4)           | 通用任务，包括复杂推理、广泛的世界知识，以及代码密集型或多步骤智能体任务 |
| [`gpt-5.4-pro`](https://developers.openai.com/api/docs/models/gpt-5.4-pro)   | 可能需要更长时间解决且需要更深层推理的难题                                               |
| [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | 高吞吐量编码、计算机使用以及仍需要强大推理能力的智能体工作流                               |
| [`gpt-5.4-nano`](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | 速度和成本最重要的高吞吐量任务                                                               |

### 较低的推理力度

该 `reasoning.effort` 参数控制模型在生成响应之前生成多少推理 tokens。像 o3 这样的早期推理模型仅支持 `low`, `medium`，并且 `high`: `low` 倾向于更快和更少的 tokens，而 `high` 倾向于更深入的推理。

GPT-5.2 和 GPT-5.4 支持 `none` 作为其最低推理力度，用于低延迟交互。这是两个模型的默认设置。如果你需要更多思考，可以缓慢提升到 `medium` 并试验结果。

当推理力度设置为 `none`，时，提示工程很重要。为了提高模型的推理质量，即使使用默认设置，也要鼓励它在回答前先“思考”或列出步骤。

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

详细程度决定了生成的输出 token 数量。减少 token 数量会降低整体延迟。虽然模型的推理方式基本保持不变，但模型会找到更简洁的作答方式——这可能会根据你的用例提升或降低答案质量。以下是详细程度光谱两端的几种场景：

- **高详细度：** 当你需要模型对文档提供详尽的解释或执行大规模代码重构时使用。
- **低详细度：** 最适合需要简洁回答或聚焦的代码生成（例如 SQL 查询）的场景。

GPT-5 将此选项设为以下之一 `high`, `medium`，或 `low`。在 GPT-5.4 中，详尽程度仍然可配置，默认值为 `medium`.

使用 GPT-5.4 生成代码时， `medium` 和 `high` 详尽程度会生成更长、结构更清晰的代码并附带内联解释，而 `low` 详尽程度会生成更短、更简洁的代码，并附带最少的说明。

控制详尽程度

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


在将详尽程度设置为 `low` 后，你仍然可以通过提示来引导 API 中的输出。详尽程度参数在系统提示层面定义了一个通用的 token 范围，但实际输出在该范围内对开发者提示和用户提示都具有灵活性。

#### 1M context window

1M token 上下文窗口随 GPT-5.4 一起推出，便于在单个请求中分析整个代码库、长文档集合或延长的 智能体 轨迹。

我们对 272K tokens 以下和 272K tokens 以上的请求分别设有标准定价，详情请参阅 [定价文档](https://developers.openai.com/api/docs/pricing)。如果你使用 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，任何超过 272K tokens 的 prompt 将自动按标准费率处理。

长上下文定价可与其他定价调整项（如数据驻留和批处理）叠加。

我们对 272K tokens 以下和 272K tokens 以上的请求设置了不同的速率限制；详情可在 [GPT-5.4 模型页面](https://developers.openai.com/api/docs/models/gpt-5.4).

## 将工具与 GPT-5.4 配合使用

GPT-5.4 已针对特定工具进行了后训练。参见 [tools 文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

### Computer use tool

Computer use 让 GPT-5.4 通过检查屏幕截图并返回供你的执行环境运行的结构化操作来操作软件界面。它非常适合那些用户可以通过 UI 完成任务的工作流，例如浏览网站、填写表单或验证某项更改是否真的生效。

请在隔离的浏览器或虚拟机中使用它，并在执行高风险操作时保持人工参与。完整指南涵盖了内置的 Responses API 循环、自定义执行环境模式以及基于代码执行的设置方法。

[Computer use 指南



      Learn how to run the built-in computer tool safely and integrate it with
    your own harness.](https://developers.openai.com/api/docs/guides/tools-computer-use)

### 工具搜索工具

Tool search 让 GPT-5.4 将大型工具集合推迟到运行时再加载，从而使模型只加载它需要的定义。当你有大量函数时，这一特性尤为有用， `namespaces`，或 MCP 工具，并希望在不预先暴露每个 schema 的情况下降低 token 使用量、保持缓存性能并改善延迟。

当候选工具在请求时已经确定时，使用 托管工具 search；当你的应用需要动态决定要加载哪些工具时，使用客户端执行的 tool search。完整指南还涵盖了针对 `namespaces`、MCP 服务器以及延迟加载的最佳实践。

[Tool search guide



      Learn how to defer tool definitions and load the right subset at runtime.](https://developers.openai.com/api/docs/guides/tools-tool-search)

### 自定义工具

GPT-5 模型系列发布时，我们引入了一项名为自定义工具的新能力，它允许模型将任意原始文本作为工具调用输入，同时在需要时仍可约束输出。该工具行为在 GPT-5.4 中依然成立。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### Freeform inputs

使用以下方式定义你的工具 `type: custom` 以使模型能够直接将明文输入发送到你的工具，而不是仅限于结构化 JSON。模型可以将任何原始文本——代码、SQL 查询、Shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 限制输出

GPT-5.4 支持自定义工具的上下文无关文法 (`CFGs`)，让你可以提供一份 Lark 文法，将输出约束为特定语法或 DSL。附加 CFG（例如 SQL 或 DSL 文法）可确保助手生成的文本符合你的文法。

这使得工具调用或结构化响应更加精确、受控，并允许你在 GPT-5.4 的函数调用中直接强制执行严格的语法或特定领域的格式，从而提升在复杂或受限领域下的可控性与可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述决定要发送什么；如果希望它始终调用该工具，请明确说明。
- **在服务端验证输出**。自由格式字符串虽然强大，但需要防范注入或不安全的命令。

### Allowed tools

该 `allowed_tools` 参数 `tool_choice` 允许你传入 N 个工具定义，但将模型限制为只能使用其中的 M 个（&lt; N）个。在 `tools`，中列出你的完整工具包，然后使用一个 `allowed_tools` 块来指定该子集并指定模式——可以是 `auto` （模型可以从中任选一个）或者 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可能的工具与 _当前_，可用的子集分开，你将获得更高的安全性、可预测性以及更好的提示缓存效果。同时也避免了脆弱的提示工程，例如硬编码的调用顺序。GPT-5.4 能够在对话中间动态调用或要求特定函数，同时降低在长上下文中发生意外工具调用的风险。

|                  | **标准工具**                        | **允许的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型的能力范围 | 下列所有工具 **`"tools": […]`** | 仅限以下子集 **`"tools": […]`** 中的 **`tool_choice`** |
| 工具调用  | 模型可能调用也可能不调用任何工具        | 模型仅限于（或必须调用）所选工具        |
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

### Preambles

前言是 GPT-5.4 在调用任何工具或函数之前生成的简短、面向用户的解释，用于概述其意图或计划——例如“我为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确引导。

通过让 GPT-5.4 在每次工具调用前“边想边说”，前言可以在不增加推理开销的情况下提高工具调用准确性（以及整体任务成功率）。要启用前言，请添加系统或开发者指令——例如：“在调用工具之前，解释你为什么要调用它。”GPT-5.4 会为每个指定的工具调用添加简洁的说明。模型还可能在工具调用之间输出多条消息，这可以增强交互体验——尤其适用于低推理或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.4 与 Responses API 配合使用效果最佳，该 接口 支持在多轮之间保留推理上下文以提升性能。请阅读下文，了解如何从你当前使用的模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.4

使用 [OpenAI 文档
  技能](https://github.com/openai/skills/tree/main/skills/.system/openai-docs)
  来将现有提示词或工作流迁移到 GPT-5.4。该技能可在我们的
  公共技能仓库和 Codex 桌面应用中获取。

虽然该模型应能近乎直接替代 GPT-5.2，但仍有一些关键变化需要留意。详见 [GPT-5.4 提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices) 以了解需要在提示词中进行的具体更新。

使用 GPT-5 系列模型配合 Responses API 可以凭借该 API 的设计获得更强的智能。Responses API 可将上一轮的思维链传递给模型，从而减少生成的推理 token、提高缓存命中率并降低延迟。更多信息，请参阅 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) ，了解 Responses API 的优势。

从较旧的 OpenAI 模型迁移到 GPT-5.4 时，建议先试验推理强度和提示词策略。可使用 [提示词优化器](https://platform.openai.com/chat/edit?models=gpt-5.4&optimize=true) 根据当前最佳实践更新适用于 GPT-5.4 的提示词，然后参考以下针对该模型的指南：

- **`gpt-5.2`**: `gpt-5.4` 使用默认设置时，它是即插即用的替代方案。
- **o3**: `gpt-5.4` 搭配 `medium` 或 `high` reasoning。先从 `medium` reasoning 配合提示调优开始，再提升到 `high` ，如果你没有获得想要的结果。
- **`gpt-4.1`**: `gpt-5.4` 搭配 `none` reasoning。先从 `none` 并对你的提示进行调优；如果需要更好的效果，可以提高。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5.4-mini` 配合提示调优是一个不错的替代方案。
- **`gpt-4.1-nano`**: `gpt-5.4-nano` 配合提示调优是一个不错的替代方案。

### New `phase` parameter

对于长时间运行或工具调用密集的 GPT-5.4 Responses API 流程，使用 assistant 消息 `phase` 字段可以避免提前停止和其他异常行为。

`phase` 在 API 层面是可选的，但我们强烈建议你使用。使用 `phase: "commentary"` 表示中间阶段的助手更新（例如工具调用前的开场白），并使用 `phase: "final_answer"` 表示已完成的回答。不要向 `phase` 用户消息中添加它。

如果你使用 `previous_response_id`，通常是最简单的方案，因为
  会保留之前的助手状态。如果你手动重放助手历史记录，
  请保留每个原始 `phase` 值。

缺失或丢失的 `phase` 可能导致开场白被当作最终回答处理
。更多指导和示例，请参阅 [GPT-5.4
提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#phase-parameter).

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
  reasoning: { effort: :medium },
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```


### GPT-5.4 参数兼容性

以下参数 **仅在** 使用 GPT-5.4 且将推理强度设置为时支持 `none`:

- `temperature`
- `top_p`
- `logprobs`

包含这些字段的请求将在以下情况下报错：GPT-5.4 或 GPT-5.2 使用其他推理强度设置，或者其他较旧的 GPT-5 模型（例如 `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`.

若要在更高推理强度设置下，或使用其他 GPT-5 系列模型获得类似结果，可以尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

从 Chat Completions 迁移到 Responses API（用于 GPT-5.4）的最大区别，也是迁移的主要原因是支持在多轮之间传递思维链（CoT）。请参阅完整的 [两个 API 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

CoT 的传递仅存在于 Responses API 中，我们观察到这样做带来了更高的智能水平、更少生成的推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数仍然保持一致，只是格式有所不同。下面介绍 Chat Completions 与 Responses API 之间新参数的处理差异：

**推理努力度**



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



**冗长度**



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

当排查 GPT-5.4 将中间更新视为
  最终答案的情况时，请验证你的集成是否正确保留了 assistant 消息 `phase`
  字段。详见 [Phase 参数](#phase-parameter) 。

### 了解 GPT-5.4 的行为

#### GPT-5.4 的优势所在

GPT-5.4 在以下领域往往表现尤为出色：

- 在长答案中保持强烈的个性和语气，且漂移更少
- 智能体 工作流 的稳健性，更倾向于坚持多步工作、重试并端到端地完成 智能体 循环
- 证据丰富的综合分析，尤其是在长上下文或多工具工作流中
- 在契约明确时，对模块化、基于技能和块结构提示的指令遵循
- 针对大型、杂乱或多文档输入的长上下文分析
- 在保持工具调用准确性的同时，进行批量或并行的工具调用
- 需要指令遵循、格式保真度和更强自我验证的电子表格、金融和 Excel 工作流

#### 显式提示仍然有帮助的场景

尽管有上述优势，GPT-5.4 在一些反复出现的模式中仍需要更明确的指引：

- 会话早期工具上下文较少、工具选择可靠性可能较低的场景
- 需要明确检查前置依赖和后续步骤的依赖感知型工作流
- 推理强度的选择，更高的强度并不总是更好，正确的选择取决于任务形态而非直觉
- 需要严格收集来源并保持引用一致的研究类任务
- 执行前需要校验的不可逆或高影响操作
- 必须保持清晰工具边界的终端或编码智能体环境

这些模式是观察到的默认值，并非保证。请从能通过评估的最小提示开始，仅当某些模块能修复已测得的失败模式时再添加它们。

### 使用核心提示模式

#### 保持输出简洁且结构化

为了提升 GPT-5.4 的 token 使用效率，应限制其输出详尽程度，并通过清晰的输出契约强制结构化输出。在实际应用中，这会作为一个额外的控制层，与 `verbosity` 参数（Responses API 中）协同工作，使你既能引导模型输出多少内容，也能引导模型如何组织输出。

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

用户经常在对话中途更改任务、格式或语气。为了让助手保持一致，需要明确定义何时继续、何时询问，以及后续指令如何覆盖先前的默认设置。

使用类似这样的默认跟进策略：

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

更高优先级的开发者或系统指令仍然具有约束力。

**指南：** 当指令在对话中途发生变化时，需将更新表达得明确、有范围且局部生效。说明哪些内容发生了变化、哪些仍然适用，以及该变化是仅影响下一轮还是影响后续整个对话。

#### 处理对话过程中的指令更新

对于对话中途的更新，使用明确且范围可控的引导消息，并说明：

1. Scope
2. Override
3. Carry forward

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

#### 在正确性依赖工具使用时，使其保持持久化

使用明确的规则来确保工具调用既彻底、考虑依赖关系，又节奏得当，特别是在后续操作依赖于早期检索或验证的工作流中。一个常见的失败模式是：因为预期的终态似乎显而易见，而跳过前置步骤。

GPT-5.4 在会话初期、上下文尚浅时，对工具路由的选择可能不太可靠。应当提示其执行前置步骤、检查依赖关系，并明确工具的调用意图。

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

这一点在最终操作依赖于早期查询或检索步骤的工作流中尤为重要。最常见的失败模式之一是：因为预期的终态似乎显而易见，而跳过前置步骤。

```xml
<dependency_checks>
- Before taking an action, check whether prerequisite discovery, lookup, or memory retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If the task depends on the output of a prior step, resolve that dependency first.
</dependency_checks>
```

当任务相互独立且挂钟时间很重要时，应提示采用并行执行。当依赖关系、模糊性或不可逆操作比速度更重要时，应提示采用顺序执行。

```xml
<parallel_tool_calling>
- When multiple retrieval or lookup steps are independent, prefer parallel tool calls to reduce wall-clock time.
- Do not parallelize steps that have prerequisite dependencies or where one result determines the next action.
- After parallel retrieval, pause to synthesize the results before making more calls.
- Prefer selective parallelism: parallelize independent evidence gathering, not speculative or redundant tool use.
</parallel_tool_calling>
```

#### 在长时任务上强制保持完整

对于多步工作流，一种常见的失败模式是执行不完整：模型在部分覆盖后就停止，遗漏批次中的项目，或将空检索或窄检索视为最终结果。当提示词定义了明确的完成规则和恢复行为时，GPT-5.4 会变得更加可靠。

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

对于经常出现空检索、部分检索或噪声检索的工作流：

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

一旦 工作流 看起来已经完成，在返回答案或执行不可逆操作之前，添加一个轻量的验证步骤。这有助于在提交前捕获需求遗漏、事实依据问题以及格式偏差。

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

对于 智能体，如果它们会主动执行操作，请添加一个简短的执行框架：

```xml
<action_safety>
- Pre-flight: summarize the intended action and parameters in 1-2 lines.
- Execute via tool.
- Post-flight: confirm the outcome and any validation that was performed.
</action_safety>
```

### 处理专业化工作流

#### 为视觉与计算机使用显式选择图像细节

如果你的工作流依赖视觉精度，请在提示词或集成中指定图像 `detail` 级别，而不是依赖 `auto`。使用 `high` 进行标准的高保真图像理解。使用 `original` 处理大型、密集或对空间敏感度的图像，尤其是 [computer use、本地化、OCR 和点击精度任务](https://developers.openai.com/api/docs/guides/tools-computer-use) 上 `gpt-5.4` 以及未来模型使用 `low` 仅在速度和成本比细节更重要时使用。有关图像细节级别的更多详细信息，请参阅 [图像与视觉指南](https://developers.openai.com/api/docs/guides/images-vision).

#### 将研究与引用锁定至检索到的证据

当引用质量很重要时，应同时明确来源边界和格式要求。这有助于减少虚构引用、缺乏依据的说法以及引用格式的偏差。

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

如果你的应用要求内联引用，就要求内联引用。如果它要求脚注，就要求脚注。关键在于锁定格式，防止模型临时拼凑出没有依据的引用。

#### Research 模式

将 GPT-5.4 推入一种受约束的研究模式。将其用于研究、审阅和综合任务。不要将其强行用于短执行任务或简单的确定性转换。

```xml
<research_mode>
- Do research in 3 passes:
  1) Plan: list 3-6 sub-questions to answer.
  2) Retrieve: search each sub-question and follow 1-2 second-order leads.
  3) Synthesize: resolve contradictions and write the final answer with citations.
- Stop only when more searching is unlikely to change the conclusion.
</research_mode>
```

如果你的宿主环境使用特定的研究工具或要求提交步骤，请将其与宿主的终结化契约结合使用。

#### 限制严格的输出格式

对于 SQL、JSON 或其他对解析敏感的输出，请告诉 GPT-5.4 仅输出目标格式，并在完成前进行检查。

```text
<structured_output_contract>
- Output only the requested format.
- Do not add prose or markdown fences unless they were requested.
- Validate that parentheses and brackets are balanced.
- Do not invent tables or fields.
- If required schema information is missing, ask for it or return an explicit error object.
</structured_output_contract>
```

如果要提取文档区域或 OCR 框，请定义坐标系并添加漂移检查：

```text
<bbox_extraction_spec>
- Use the specified coordinate format exactly, such as [x1,y1,x2,y2] normalized to 0..1.
- For each box, include page, label, text snippet, and confidence.
- Add a vertical-drift sanity check so boxes stay aligned with the correct line of text.
- If the layout is dense, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 在编程与终端智能体中保持工具边界明确

在编写代码类智能体时，如果 shell 访问和文件编辑的规则明确无误，GPT-5.4 的表现会更好。当你暴露出以下工具时，这一点尤为重要： [Shell](https://developers.openai.com/api/docs/guides/tools-shell) 或 [Apply patch](https://developers.openai.com/api/docs/guides/tools-apply-patch).

#### 用户更新

GPT-5.4 在简短的、基于结果的更新中表现良好。可以复用 5.2 指南中的用户更新模式，但需要与明确的完成和验证要求配合使用。

推荐的更新规范：

```xml
<user_updates_spec>
- Only update the user when starting a new major phase or when something changes the plan.
- Each update: 1 sentence on outcome + 1 sentence on next step.
- Do not narrate routine tool calls.
- Keep the user-facing status short; keep the work exhaustive.
</user_updates_spec>
```

对于编码 智能体 任务，请参阅下方“编码任务的提示模式”部分以获取更具体的指导。

#### 编码任务的提示模式

**自主性与持久性**

GPT-5.4 在编码和工具使用任务上通常比早期的主流模型更加全面，因此你往往不需要显式地使用 “verify everything” 之类的提示。不过，对于生产环境、迁移或安全相关等高风险改动，请保留一条轻量的验证条款。

```xml
<autonomy_and_persistence>
Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.

Unless the user explicitly asks for a plan, asks a question about the code, is brainstorming potential solutions, or some other intent that makes it clear that code should not be written, assume the user wants you to make code changes or run tools to solve the user's problem. In these cases, it's bad to output your proposed solution in a message, you should go ahead and actually implement the change. If you encounter challenges or blockers, you should attempt to resolve them yourself.
</autonomy_and_persistence>
```

**中间过程更新**

保持更新稀疏且高信号。在编码任务中，优先在关键节点提供更新。

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

GPT-5.4 常常默认使用更结构化的格式，并可能过度使用无序列表。如果希望最终回复干净简洁，请明确限制列表的形态。

```xml
Never use nested bullets. Keep lists flat (single level). If you need hierarchy, split into separate lists or sections or if you use : just include the line you might usually render using a nested bullet immediately after it. For numbered lists, only use the `1. 2. 3.` style markers (with a period), never `1)`.
```

**前端任务**

仅在需要额外的前端指导时使用此节。

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

#### 文档本地化与 OCR 框选

对于 bbox 任务，需明确说明坐标系约定，并添加漂移测试。

```xml
<bbox_extraction_spec>
- Use the specified coordinate format exactly (for example [x1,y1,x2,y2] normalized 0..1).
- For each bbox, include: page, label, text snippet, confidence.
- Add a vertical-drift sanity check:
  - ensure bboxes align with the line of text (not shifted up or down).
- If dense layout, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 运行时及 API 集成注意事项

对于长时间运行或工具密集型的智能体，运行时契约与提示词契约同样重要。

##### Phase 参数

对于 GPT-5.4， `gpt-5.3-codex`，以及之后的 Responses 模型， `phase` 字段可以
在少数长时间运行或工具密集型的工作流中发挥作用，这些工作流中开场白或其他
中间助手更新会被误认为是最终答案。

- `phase` 在 API 级别是可选的，但强烈建议使用。服务端 可能存在尽力推断，但显式往返传输 `phase` 明显更好。
- 对 `phase` 长时间运行或工具密集型的 智能体 使用，这些智能体在工具调用之前或最终答案之前可能会发出解说内容。
- 在重放 `phase` 先前的助手项时保留，以便模型能够区分工作解说和已完成答案。这在具有前导内容、工具相关更新或同一轮中多条助手消息的多步骤流程中最为重要。
- 不要向用户 `phase` 消息添加。
- 如果使用 `previous_response_id`，这通常是最简单的路径，因为 OpenAI 通常无需手动重放助手项即可恢复先前的状态。
- 如果自行重放助手历史记录，请保留原始 `phase` 值。
- 缺失或丢失的 `phase` 可能导致前导内容被误解为最终答案，并降低这些多步骤任务上的表现。

#### 在长会话中保留行为

压缩可显著延长有效的上下文窗口，使用户对话能够在多轮交互中持续进行，而不会触达上下文限制或出现长上下文性能下降，同时让智能体能够执行远超典型上下文窗口的极长轨迹，从而胜任长时间运行的复杂任务。

如果你正在使用 [压缩](https://developers.openai.com/api/docs/guides/compaction) 在 Responses API 中，在关键里程碑后进行压缩，将压缩后的项视为不透明状态，并保持压缩后的提示在功能上保持一致。该端点兼容 ZDR，并返回一个 `encrypted_content` 条目，你可以将其传入后续请求。随着会话轮次增加，GPT-5.4 在长多轮对话中通常能保持更高的连贯性与可靠性，较少出现崩溃。

更多指引，请参阅 [`/responses/compact` API 参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

#### 面向客户工作流的人格控制

GPT-5.4 在将持久性人格与逐响应的写作控制分离时，可以被更有效地引导。这在面向客户的工作流（例如邮件支持回复、公告和博客风格内容）中尤其有用。

- **Personality（持续生效）：** 在整个会话中设定默认的语气、详细程度和决策风格。
- **写作控制（每次响应）：** 为特定产物定义渠道、语域、格式和长度。
- **提醒：** personality 不应覆盖任务特定的输出要求。如果用户要求 JSON，请返回 JSON。

对于自然、高质量的文本，最高杠杆率的可控因素包括：

- 为模型设定清晰的人设。
- 明确渠道与情感表达基调。
- 当你想要散文式输出时，明确禁止使用格式。
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

如需可直接借鉴的更多人格模式，请参阅 [提示人格 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/prompt_personalities).

**专业备忘录模式**

对于备忘录、评审以及其他专业写作任务来说，常规的写作指引往往不够。这些工作流需要针对具体性、领域惯例、综合分析以及恰当的确定性给出明确指导。

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

该模式特别适用于法律、政策、研究以及面向高管层级的写作，因为这些场景的目标不仅是流畅表达，还要进行有约束的综合分析并得出清晰的结论。

### 调优推理与迁移

#### 将推理强度视为最后一公里的调节旋钮

推理强度并非放之四海而皆准。应将其视为最后的微调旋钮，而非提升质量的主要手段。在许多情况下，更强的提示、清晰的输出约定以及轻量级验证循环，往往能恢复团队原本希望通过更高推理设置获得的绝大部分性能。

推荐的默认值：

- `none`: 适合对延迟和成本敏感、追求速度且无需模型思考的任务。
- `low`: 适合对延迟敏感的任务，少量思考即可带来明显的准确率提升，尤其是面对复杂指令时。
- `medium` 或 `high`: 仅保留给确实需要更强推理能力、并且能够承受其延迟和成本权衡的任务。可根据任务能从额外推理中获得的性能提升在它们之间选择。
- `xhigh`: 不要作为默认选项，除非你的评估显示出明显收益。它最适合长链路、智能体式、推理密集型任务，这些场景下最高智能水平比速度和成本更重要。

实际上，大多数团队应默认使用 `none`, `low`，或 `medium` 区间。

从 `none` 开始用于执行密集型工作负载，例如 工作流 步骤、字段抽取、支持分诊以及短结构化转换。

从 `medium` 或更高用于研究密集型工作负载，例如长上下文综合、多文档审阅、冲突解决以及策略撰写。使用 `medium` 搭配精心设计的提示词，你可以榨出大量性能。

对于 GPT-5.4 工作负载， `none` 在动作选择和工具规范性任务上已经能表现良好。如果你的工作负载依赖于细微解读，例如隐含需求、歧义性或已取消工具调用的恢复，请从 `low` 或 `medium` 开始。

在提高推理强度之前，先添加：

- `<completeness_contract>`
- `<verification_loop>`
- `<tool_persistence_rules>`

如果模型仍显得过于字面化，或停留在第一个看似合理的答案上，请在提升推理强度之前加入主动性提示：

```xml
<dig_deeper_nudge>
- Don’t stop at the first plausible answer.
- Look for second-order issues, edge cases, and missing constraints.
- If the task is safety or accuracy critical, perform at least one verification step.
</dig_deeper_nudge>
```

#### 每次一个变更地将提示词迁移到 GPT-5.4

采用与 5.2 指南相同的“一次只改一处”的纪律：先切换模型，再固定参数 `reasoning_effort`，运行评估，然后迭代。

这些起点对许多迁移都很有效：

| 当前设置             | 建议的 GPT-5.4 起点            | 备注                                                               |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `gpt-5.2`                 | 匹配当前的推理力度 | 首先保持现有的延迟和质量表现，再进行调整。 |
| `gpt-5.3-codex`           | 匹配当前的推理力度 | 对于编码工作流，保持相同的推理力度。           |
| `gpt-4.1` 或 `gpt-4o`     | `none`                             | 保持响应迅速的行为，仅在评估指标下滑时才提高。           |
| 重研究的助手 | `medium` 或 `high`                 | 使用明确的多轮研究流程和引用把关。               |
| 长时程 智能体       | `medium` 或 `high`                 | 添加工具持久化与完备性核算。                   |

#### 小模型指南 `gpt-5.4-mini` 和 `gpt-5.4-nano`

`gpt-5.4-mini` 和 `gpt-5.4-nano` 具有高度的可引导性，但与更大的模型相比，它们不太可能推断缺失的步骤、隐式消解歧义，或者按你期望的方式组织输出，除非你直接明确指定这些行为。在实践中，针对较小模型的提示通常会更长一些，也更明确一些。

**如何 `gpt-5.4-mini` 不同**

- `gpt-5.4-mini` 更加字面化，且假设更少。
- 在任务结构清晰时表现强劲，但在处理隐式工作流和歧义时较弱。
- 默认情况下，除非你显式抑制该行为，否则它可能会尝试通过追问来延续对话。

**提示工程 `gpt-5.4-mini`**

- 将关键规则放在最前面。
- 在涉及工具使用或副作用时，指定完整的执行顺序。
- 不要只依赖“你 MUST”这样的措辞。应使用结构化支架，例如编号步骤、决策规则以及明确的操作定义。
- 将“执行操作”与“报告操作”分开。
- 展示正确的流程，而不仅仅是最终格式。
- 明确定义歧义处理行为：何时提问、何时放弃、何时继续。
- 直接指定输出格式：回答长度、是否提出追问、引用样式以及章节顺序。
- 谨慎使用 `output nothing else`。对于作用域受限的指令，应优先选择诸如 `after the final JSON, output nothing further`.

**提示工程 `gpt-5.4-nano`**

- 对 `gpt-5.4-nano` 仅用于范围狭窄且边界明确的任务。
- 优先使用封闭式输出：标签、枚举、简短 JSON 或固定模板。
- 除非流程极为受限，否则不要进行多步骤编排。
- 将存在歧义或需要大量规划的任务交给更强的模型，而不是过度堆砌提示 `gpt-5.4-nano`.

**良好的默认模式**

1. 任务
2. 关键规则
3. 精确步骤顺序
4. 边界情况或澄清行为
5. 输出格式
6. 一个正确的示例

**避免**

- 隐含的后续步骤
- 未指定的边界情况
- 仅用于工具工作流的 Schema 提示
- 缺乏结构的通用指令

#### 网页搜索与深度研究

如果你是迁移 智能体 的研究类智能体，请在提高推理力度之前进行以下提示更新：

- 添加 `<research_mode>`
- 添加 `<citation_rules>`
- 添加 `<empty_result_recovery>`
- 提高 `reasoning_effort` 仅在修正提示后提升一档。

你可以从 5.2 研究模块开始,然后根据需要叠加引用把关和定稿契约。

当任务需要多步证据收集、长上下文综合以及明确的提示契约时,GPT-5.4 表现尤为出色。在实践中,收益最高的提示调整包括:按任务形态选择推理力度、定义精确的输出和引用格式、添加感知依赖的工具规则,以及明确完成标准。模型在开箱即用时通常已经很强,但只有当提示清晰说明如何搜索、如何验证以及什么算作完成时,它的表现才最为可靠。

### 后续步骤

- 查看 [Model、API 与功能更新](#model-api-and-feature-updates) 了解模型能力、参数以及 API 兼容性详情。
- 阅读 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) ，了解跨模型系列适用的更广泛的提示策略。
- 阅读 [压缩](https://developers.openai.com/api/docs/guides/compaction) ，适用于在 Responses API 中构建长时间运行的 GPT-5.4 会话。


## 延伸阅读

[GPT-5.3-Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.4 博文](https://openai.com/index/introducing-gpt-5-4/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型家族：新特性指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[推理模型 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)