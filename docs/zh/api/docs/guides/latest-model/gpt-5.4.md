# 使用 GPT-5.4

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 概述

[GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) 作为面向专业工作的前沿模型已发布，覆盖 API 和 Codex。它帮助开发者分析复杂信息、构建生产级软件，并自动化多步骤工作流。

在 GPT-5.4 系列中， `gpt-5.4` 是适用于在软件工程、推理、写作和工具使用之间切换的工作流的通用模型。

本指南介绍 GPT-5 模型系列的主要特性，以及如何充分发挥 GPT-5.4 的能力。

## 新增内容

与之前的 GPT-5.2 模型相比，GPT-5.4 在以下方面有所改进：

- 代码编写、文档理解、工具使用与指令遵循
- 图像感知与多模态任务
- 长时间运行的任务执行与多步骤 智能体工作流
- 面向工具密集型工作负载的 Token 效率与端到端性能
- 面向难以定位信息的网页搜索与多源综合
- 客服、分析与财务等场景中以文档和电子表格为主的工作流

GPT-5.4 将 GPT-5.3-Codex 的编码能力带到了我们的旗舰前沿模型。开发者可以生成生产级代码、构建精美的前端 UI、遵循仓库特定的模式，并以更少的重试处理多文件变更。它还具备强大的开箱即用编码风格，因此团队可以减少在提示词调优上的时间投入。

对于智能体工作负载，GPT-5.4 缩短了多步轨迹的端到端耗时，并且通常使用更少的 token 和工具调用即可完成任务。这使得智能体响应更敏捷，并降低在 API 和 Codex 中大规模运行复杂工作流时的成本。

### GPT-5.4 中的新功能

与早期 GPT-5 模型一样，GPT-5.4 支持自定义工具、控制详细程度和推理能力的参数，以及允许的工具列表。GPT-5.4 还引入了多项新能力，让构建强大的智能体系统、在更大规模的信息上运行，以及执行更可靠的工作流变得更加容易：

- **`tool_search` 在 API 中：** GPT-5.4 通过使用延迟工具加载来改进更大工具生态系统的工具搜索。这使工具可被搜索，仅加载相关的定义，降低 token 使用量，并在实际部署中提升工具选择准确率。在 [工具搜索指南](https://developers.openai.com/api/docs/guides/tools-tool-search).
- **1M token 上下文窗口：** GPT-5.4 支持最高 1M token 的上下文窗口，便于在单个请求中分析整个代码库、长文档集合或扩展的 智能体 轨迹。详见 [1M 上下文窗口](#1m-context-window) 部分。
- **内置计算机使用：** GPT-5.4 是首个内置计算机使用能力的主流模型，使 智能体 能够直接与软件交互，在“构建-运行-验证-修复”循环中完成、验证和修复任务。详见 [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use).
- **原生上下文压缩支持：** GPT-5.4 是首个经过训练以支持上下文压缩的主流模型，可在保留关键上下文的同时支持更长的 智能体 轨迹。

## 模型、API 和功能更新

在该模型代系中， `gpt-5.4` 是适用于广泛任务和编程的通用模型。对于更困难的问题， `gpt-5.4-pro` 会使用更多算力来更长时间地思考，并给出更一致的答案。

如果需要更小、更快的版本，可以从 `gpt-5.4-mini` 或 `gpt-5.4-nano`.

若要帮助你挑选最契合自身用例的模型，可以参考以下权衡：

| 变体                                         | 适用场景                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4)           | 通用任务，包括复杂推理、广泛的世界知识，以及代码密集或多步骤的智能体任务 |
| [`gpt-5.4-pro`](https://developers.openai.com/api/docs/models/gpt-5.4-pro)   | 需要更长时间解决且需要更深层推理的难题                                               |
| [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | 高吞吐量的编码、计算机使用，以及仍需较强推理能力的智能体工作流                               |
| [`gpt-5.4-nano`](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | 速度与成本最重要的高吞吐量任务                                                               |

### 较低的推理投入度

该 `reasoning.effort` parameter controls how many reasoning tokens the model generates before producing a response. Earlier reasoning models like o3 supported only `low`, `medium`, and `high`: `low` favored speed and fewer tokens, while `high` favored more thorough reasoning.

GPT-5.2 and GPT-5.4 support `none` as their lowest reasoning effort for lower-latency interactions. It is the default setting for both models. If you need more thinking, slowly increase to `medium` and experiment with results.

With reasoning effort set to `none`, prompting is important. To improve the model's reasoning quality, even with the default settings, encourage it to "think" or outline its steps before answering.

Reasoning effort set to none

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


### Verbosity

详细程度决定了会生成多少输出 token。减少 token 数量可以降低整体延迟。虽然模型的推理方式基本保持不变，但模型会尝试以更简洁的方式作答——具体效果取决于你的使用场景，答案质量可能变好也可能变差。下面是详细程度两个极端的一些典型场景：

- **高详细程度：** 当你需要模型提供详尽的文档说明或执行大规模代码重构时使用。
- **低详细程度：** 最适合需要简洁答案或专注代码生成的场景，例如 SQL 查询。

GPT-5 将此选项设为可配置项之一， `high`, `medium`，或 `low`。使用 GPT-5.4 时，详细程度仍可配置且默认值为 `medium`.

当使用 GPT-5.4 生成代码时， `medium` 并且 `high` 冗长度级别会生成更长、结构更清晰的代码，并附带内联解释，而 `low` 冗长度则会生成更短、更简洁的代码，并附带最少的注释。

控制冗长度

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


即使在 API 中将其设为 `low` 后，你仍然可以通过提示来调整冗长度。冗长度参数在系统提示级别定义了一个通用的 token 范围，但实际输出在该范围内会根据开发者和用户的提示灵活调整。

#### 1M context window

1M token 上下文窗口随 GPT-5.4 一起推出，让你可以更轻松地在单个请求中分析整个代码库、长文档集合或较长的智能体运行轨迹。

我们对 272K tokens 以下和 272K tokens 以上的请求设有不同的标准定价，详情见 [定价文档](https://developers.openai.com/api/docs/pricing)。如果你使用 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，任何超过 272K tokens 的 prompt 都会自动按标准价格计费。

长上下文定价会与数据驻留和批处理等其他定价调整项叠加计算。

我们对 272K tokens 以下和 272K tokens 以上的请求设有不同的速率限制，详情见 [GPT-5.4 模型页面](https://developers.openai.com/api/docs/models/gpt-5.4).

## Using tools with GPT-5.4

GPT-5.4 已针对特定工具进行了后训练。详见 [工具文档](https://developers.openai.com/api/docs/guides/tools) 以获取更具体的指导。

### Computer use 工具

计算机使用让 GPT-5.4 能够通过检查截图并返回结构化操作来操作软件界面，供你的执行框架运行。它非常适合那些用户可以通过 UI 完成的浏览器或桌面工作流，例如浏览网站、填写表单，或验证某项更改是否真正生效。

请在隔离的浏览器或虚拟机中使用它，并对高风险操作保持人工参与。完整指南涵盖了内置的 Responses API 循环、自定义执行框架模式以及基于代码执行的设置方案。

[计算机使用指南



      Learn how to run the built-in computer tool safely and integrate it with
    your own harness.](https://developers.openai.com/api/docs/guides/tools-computer-use)

### 工具搜索工具

工具搜索让 GPT-5.4 将大量工具集合延迟到运行时再加载，使模型只载入所需的定义。当你拥有大量函数时，这一能力尤为有用， `namespaces`，或者拥有许多 MCP 工具，并希望降低 token 使用量、保持缓存性能并缩短延迟，而无需提前暴露所有 schema。

当候选工具在请求时已经确定时，使用 托管工具 search；当你的应用需要动态决定加载哪些工具时，使用客户端执行的工具搜索。完整指南还涵盖最佳实践，包括 `namespaces`, MCP 服务器和延迟加载。

[工具搜索指南



      Learn how to defer tool definitions and load the right subset at runtime.](https://developers.openai.com/api/docs/guides/tools-tool-search)

### 自定义工具

随着 GPT-5 模型家族的发布，我们引入了一项名为自定义工具的新能力，它允许模型将任意原始文本作为工具调用输入发送，同时在需要时仍可对输出施加约束。该工具行为在 GPT-5.4 中同样适用。

[函数调用指南



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### 自由格式输入

使用以下方式定义你的工具 `type: custom` 以使模型能够将明文输入直接发送到你的工具，而不仅限于结构化的 JSON。模型可以将任何原始文本——代码、SQL 查询、shell 命令、配置文件或长篇散文——直接发送到你的工具。

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### 约束输出

GPT-5.4 支持上下文无关文法（`CFGs`）用于自定义工具，可让你提供 Lark 文法以将输出约束到特定语法或 DSL。例如附加 CFG（如 SQL 或 DSL 文法）可确保助手的文本与你的文法匹配。

这使得精确、受约束的工具调用或结构化响应成为可能，并让你能够在 GPT-5.4 的函数调用中直接强制执行严格的语法或特定领域的格式，从而提升在复杂或受限领域中的可控性和可靠性。

#### 自定义工具的最佳实践

- **编写简洁、明确的工具描述。** 模型会根据你的描述选择要发送的内容；如果希望模型始终调用该工具，请明确说明。
- **在服务端验证输出**.自由格式的字符串功能强大，但需要设置防护措施以防止注入或不安全的命令。

### Allowed tools

该 `allowed_tools` parameter under `tool_choice` 让你传入 N 个工具定义，但限制模型只能使用其中 M 个（&lt; N）。在 `tools`，中列出你的完整工具集，然后使用一个 `allowed_tools` 块来指定该子集并明确模式——可以是 `auto` （模型可任选其中一个）也可以是 `required` （模型必须调用其中一个）。

[函数调用指南



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

通过将所有可用工具与 _当前_，可使用的子集分开，你能获得更高的安全性、可预测性以及更好的提示缓存效果。同时也能避免脆弱的提示工程，例如硬编码的调用顺序。GPT-5.4 能够在对话过程中动态调用或要求调用特定函数，同时降低在长上下文中出现意外工具调用的风险。

|                  | **标准工具**                        | **允许使用的工具**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 模型可访问范围 | 下列所有工具 **`"tools": […]`** | 仅限下列子集 **`"tools": […]`** 中的 **`tool_choice`** |
| 工具调用  | 模型可以选择调用任意工具        | 模型只能（或必须）调用所选工具        |
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

有关所有这些新功能的更详细概述，请参阅 [GPT-5.4 提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices).

### 前导内容

前言是 GPT-5.4 在调用任何工具或函数之前生成的简短、对用户可见的说明，概述其意图或计划——例如，“为什么要调用这个工具”。它们出现在思维链之后、实际工具调用之前，使模型的推理更易于理解和调试，同时支持精确的引导。

通过让 GPT-5.4 在每次工具调用前“边想边说”，前言可以在不增加推理开销的情况下提高工具调用准确性（以及整体任务成功率）。要启用前言，请添加系统或开发者指令，例如：“在调用工具之前，先解释为什么要调用它。”GPT-5.4 会为每个指定的工具调用添加简洁的理由。该模型还可能在工具调用之间输出多条消息，这可以增强交互体验——尤其适用于低推理或对延迟敏感的使用场景。

有关使用前言的更多信息，请参阅 [GPT-5 提示词 cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## 迁移快速入门

GPT-5.4 与 Responses API 配合使用效果最佳，该 接口 支持在多轮对话间保留推理上下文，从而提升性能。请阅读下文，了解如何从当前模型或 API 进行迁移。

### 从其他模型迁移到 GPT-5.4

使用 [OpenAI 文档
  技能](https://github.com/openai/skills/tree/main/skills/.system/openai-docs)
  在将现有提示或工作流迁移到 GPT-5.4 时使用它。它可在我们的
  公共技能仓库和 Codex 桌面应用中获取。

虽然该模型应可近乎直接替代 GPT-5.2，但仍有几项关键变化需要指出。详见 [GPT-5.4 的提示指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices) 以了解需要在提示中进行哪些具体更新。

使用 GPT-5 模型与 Responses API 时，由于 API 的设计，可以获得更强的智能。Responses API 可以将上一轮的思维链传递给模型。这会带来更少的推理 token、更高的缓存命中率以及更低的延迟。要了解更多信息，请参阅 [深入指南](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) ，了解 Responses API 的优势。

在从较旧的 OpenAI 模型迁移到 GPT-5.4 时，首先尝试不同的推理等级和提示策略。使用 [prompt optimizer](https://platform.openai.com/chat/edit?models=gpt-5.4&optimize=true) 根据当前最佳实践更新适用于 GPT-5.4 的提示，然后参考以下针对该模型的指南：

- **`gpt-5.2`**: `gpt-5.4` 默认设置下，它是可直接替换的模型。
- **o3**: `gpt-5.4` 配合 `medium` 或 `high` 推理。从 `medium` 配合提示调优进行推理开始，然后提升到 `high` 如果你没有获得想要的结果。
- **`gpt-4.1`**: `gpt-5.4` 配合 `none` 推理。从 `none` 并调优你的提示；如果需要更好的性能，可以提升。
- **`o4-mini` 或 `gpt-4.1-mini`**: `gpt-5.4-mini` 配合提示调优是非常好的替代方案。
- **`gpt-4.1-nano`**: `gpt-5.4-nano` 配合提示调优是非常好的替代方案。

### New `phase` parameter

对于长时间运行或工具密集型的 GPT-5.4 工作流，在Responses API中，请使用 assistant 消息 `phase` 字段，以避免提前停止和其他异常行为。

`phase` 在API层面是可选的，但我们强烈建议使用它。使用 `phase: "commentary"` 输出中间的 assistant 更新（例如工具调用前的开场白），并使用 `phase: "final_answer"` 输出最终完成的回答。请勿将 `phase` 添加到用户消息中。

如果你使用 `previous_response_id`，这通常是最简单的路径，因为
  之前的 assistant 状态会被保留。如果你要手动重放 assistant 历史，请，
  保留每个原始的 `phase` 值。

缺失或丢失的 `phase` 可能导致开场白被当作最终回答，
上述场景都会出现这种情况。更多指导和示例，请参阅 [GPT-5.4
提示词指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#phase-parameter).

往返 assistant 阶段值

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

以下参数 **仅在使用 GPT-5.4 且** reasoning effort 为以下值时支持 `none`:

- `temperature`
- `top_p`
- `logprobs`

对于 GPT-5.4 或 GPT-5.2，若 reasoning effort 设置为其他任何值，或对于较早的 GPT-5 模型（例如 `gpt-5`, `gpt-5-mini`，或 `gpt-5-nano`.

若要在更高的 reasoning effort 下，或使用其他 GPT-5 系列模型获得类似效果，请尝试以下替代参数：

- **推理深度：** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **输出详细程度：** `text: { verbosity: "low" | "medium" | "high" }`
- **输出长度：** `max_output_tokens`

### 从 Chat Completions 迁移到 Responses API

最大的差异，也是迁移到 GPT-5.4 的 Responses API 的主要原因，是支持在多轮之间传递思维链（CoT）。请参阅完整的 [两个 API 的对比](https://developers.openai.com/api/docs/guides/migrate-to-responses).

传递 CoT 仅在 Responses API 中可用，我们观察到这样做带来了更高的智能水平、更少的生成推理 token、更高的缓存命中率以及更低的延迟。大多数其他参数保持一致，但格式有所不同。下面是 Chat Completions 和 Responses API 之间处理新参数的差异：

**推理努力程度**



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




## 提示工程最佳实践

在排查 GPT-5.4 将中间更新视为
  最终答案的情况时，请验证你的集成正确保留了 assistant 消息 `phase`
  字段。详见 [Phase 参数](#phase-parameter) 部分。

### 了解 GPT-5.4 的行为

#### GPT-5.4 最擅长的场景

GPT-5.4 在以下领域尤其表现出色：

- 更强的个性与语气遵循能力，在长答案中漂移更少
- 智能体 工作流 的鲁棒性，更倾向于坚持多步骤工作、重试并端到端地完成 智能体 循环
- 证据丰富的综合能力，尤其在长上下文或多工具工作流中
- 在合约明确时，对模块化、基于技能以及块结构化提示词的指令遵循
- 在大型、繁杂或多文档输入上的长上下文分析
- 在保持工具调用准确性的同时进行批处理或并行工具调用
- 需要指令遵循、格式保真度以及更强自我验证能力的电子表格、财务和 Excel 工作流

#### 显式提示仍有帮助的场景

尽管具备上述优势，GPT-5.4 在一些反复出现的场景中仍然受益于更明确的指引：

- 会话早期上下文较少时的工具路由，此时工具选择可能不够可靠
- 需要显式检查前置条件和后续步骤的依赖感知型工作流
- 推理投入度的选择，更高投入度并非总是更好，正确的选择取决于任务形态而非直觉
- 需要严谨收集来源并保证引用一致性的研究类任务
- 需要在执行前进行验证的不可逆或高影响操作
- 终端或编码智能体环境中需要保持清晰工具边界的场景

这些模式是观察到的默认值，并非保证。请从能通过你评估的最小提示开始，并且仅在解决已测量的失败模式时才添加相应的模块。

### 使用核心提示词模式

#### 保持输出简洁且结构化

若要在 GPT-5.4 上提升 token 使用效率，应通过明确的输出契约来约束 verbosity 并强制结构化输出。在实际使用中，这与 `verbosity` 参数（Responses API 中的对应参数）形成额外的控制层，从而引导模型既控制输出篇幅，又规范输出结构。

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

#### 为落地执行设置明确的默认值

用户经常会在对话中途改变任务、格式或语气。为了让助手保持对齐，需要明确定义何时继续、何时询问，以及新的指令如何覆盖先前的默认设置。

可使用类似如下的默认执行策略：

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

明确指令的优先级：

```xml
<instruction_priority>
- User instructions override default style, tone, formatting, and initiative preferences.
- Safety, honesty, privacy, and permission constraints do not yield.
- If a newer user instruction conflicts with an earlier one, follow the newer instruction.
- Preserve earlier instructions that do not conflict.
</instruction_priority>
```

高优先级的开发者或系统指令始终具有约束力。

**指导原则：** 当指令在对话中途发生变化时，应将更新表达得明确、有范围且局部化。说明哪些内容发生了变化、哪些仍然适用，以及该变化是只影响下一轮还是影响整个对话的其余部分。

#### 处理对话过程中的指令更新

对于对话中途的更新，使用明确且范围受限的引导消息，说明：

1. 作用域
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

#### 在正确性依赖于工具调用时，使其保持持久化

使用明确的规则来确保工具使用充分、了解依赖关系且节奏适当，尤其是在后续操作依赖先前检索或验证的工作流中。一种常见失败模式是，因为正确的最终状态似乎显而易见，而跳过前置条件。

在会话初期，上下文仍较薄弱时，GPT-5.4 的工具路由可靠性可能较低。应提示模型执行前置条件检查、依赖关系检查和精确的工具意图判断。

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

这在最终操作依赖先前查找或检索步骤的工作流中尤其重要。最常见的失败模式之一是，因为预期的最终状态似乎显而易见，而跳过前置条件。

```xml
<dependency_checks>
- Before taking an action, check whether prerequisite discovery, lookup, or memory retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If the task depends on the output of a prior step, resolve that dependency first.
</dependency_checks>
```

当任务彼此独立且墙钟时间很重要时，提示模型采用并行处理。当依赖关系、歧义或不可逆操作比速度更重要时，提示模型采用顺序处理。

```xml
<parallel_tool_calling>
- When multiple retrieval or lookup steps are independent, prefer parallel tool calls to reduce wall-clock time.
- Do not parallelize steps that have prerequisite dependencies or where one result determines the next action.
- After parallel retrieval, pause to synthesize the results before making more calls.
- Prefer selective parallelism: parallelize independent evidence gathering, not speculative or redundant tool use.
</parallel_tool_calling>
```

#### 在长时任务中强制完成

对于多步骤工作流，常见的失败模式是执行不完整：模型在部分覆盖后即结束、遗漏批次中的某些项，或将空结果或窄域检索视为最终结果。当提示词定义了明确的完成规则和恢复行为时，GPT-5.4 会变得更加可靠。

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

对于检索结果常出现空、部分或噪声较多情况的工作流：

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

#### 在影响重大的操作前添加验证循环

当工作流 看似完成时，在返回答案或执行不可逆操作之前，添加一个轻量的验证步骤。这有助于在提交之前发现遗漏的需求、事实依据问题以及格式偏差。

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

对于会主动执行操作的智能体，添加一个简短的执行框架：

```xml
<action_safety>
- Pre-flight: summarize the intended action and parameters in 1-2 lines.
- Execute via tool.
- Post-flight: confirm the outcome and any validation that was performed.
</action_safety>
```

### 处理专业工作流

#### 为视觉和计算机使用明确选择图像细节

如果你的工作流依赖于视觉精度，请在提示或集成中指定图像 `detail` 清晰度级别，而不是依赖 `auto`。使用 `high` 进行标准的高保真图像理解。使用 `original` 处理大型、密集或对空间敏感度高的图像，尤其是 [计算机使用、定位、OCR 和点击精度任务](https://developers.openai.com/api/docs/guides/tools-computer-use) 以及未来的模型。仅在速度和成本比细节更重要时使用 `gpt-5.4` 。使用 `low` 仅在速度和成本比细节更重要时使用。有关图像清晰度级别的更多详情，请参阅 [图像与视觉指南](https://developers.openai.com/api/docs/guides/images-vision).

#### 将研究和引用限定在检索到的证据范围内

当引用质量很重要时，需要明确指出来源边界和格式要求。这有助于减少伪造引用、无依据的断言以及引用格式的偏差。

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

如果你的应用需要行内引用，就要求使用行内引用；如果需要脚注，就要求使用脚注。关键在于锁定格式，避免模型即兴生成无依据的引用。

#### Research 模式

将 GPT-5.4 推入一种纪律严明的研究模式。使用此模式处理研究、审查和综合任务。不要将其强加于短执行任务或简单的确定性转换。

```xml
<research_mode>
- Do research in 3 passes:
  1) Plan: list 3-6 sub-questions to answer.
  2) Retrieve: search each sub-question and follow 1-2 second-order leads.
  3) Synthesize: resolve contradictions and write the final answer with citations.
- Stop only when more searching is unlikely to change the conclusion.
</research_mode>
```

如果你的宿主环境使用特定的研究工具或需要提交步骤，请将此模式与宿主的最终化契约结合使用。

#### 限制严格的输出格式

对于 SQL、JSON 或其他对解析敏感的输出，告诉 GPT-5.4 只输出目标格式，并在完成前进行检查。

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

#### 在编码和终端智能体中保持工具边界清晰

在编码 智能体中，当 shell 访问和文件编辑的规则明确无歧义时，GPT-5.4 的表现会更好。当你开放诸如以下的工具时，这一点尤为重要 [Shell](https://developers.openai.com/api/docs/guides/tools-shell) 或 [应用补丁](https://developers.openai.com/api/docs/guides/tools-apply-patch).

#### 用户更新

GPT-5.4 擅长简短、以结果为导向的更新。复用 5.2 指南中的用户更新模式，但同时加入明确的完成与验证要求。

建议的更新规范：

```xml
<user_updates_spec>
- Only update the user when starting a new major phase or when something changes the plan.
- Each update: 1 sentence on outcome + 1 sentence on next step.
- Do not narrate routine tool calls.
- Keep the user-facing status short; keep the work exhaustive.
</user_updates_spec>
```

有关编码 智能体，请参阅下方的“编码任务的提示模式”部分，获取更具体的指导。

#### 编码任务的提示模式

**自主性与持久性**

GPT-5.4 在编码和工具使用任务上通常比早期主流模型更端到端地更彻底，因此你常常无需显式地提示“验证一切”。不过，对于高风险变更（例如生产环境、迁移或安全工作），仍需保留一条轻量级的验证条款。

```xml
<autonomy_and_persistence>
Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.

Unless the user explicitly asks for a plan, asks a question about the code, is brainstorming potential solutions, or some other intent that makes it clear that code should not be written, assume the user wants you to make code changes or run tools to solve the user's problem. In these cases, it's bad to output your proposed solution in a message, you should go ahead and actually implement the change. If you encounter challenges or blockers, you should attempt to resolve them yourself.
</autonomy_and_persistence>
```

**中间过程更新**

保持更新稀疏且高信噪比。在编码任务中，倾向于在关键节点进行更新。

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

**格式化**

GPT-5.4 默认倾向于使用更结构化的格式，并可能过度使用项目符号列表。如果你希望得到一份干净的最终回复，请显式约束列表形态。

```xml
Never use nested bullets. Keep lists flat (single level). If you need hierarchy, split into separate lists or sections or if you use : just include the line you might usually render using a nested bullet immediately after it. For numbered lists, only use the `1. 2. 3.` style markers (with a period), never `1)`.
```

**前端任务**

仅在需要额外的前端指导时使用此部分。

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

对于 bbox 任务，请明确说明坐标约定，并添加漂移测试。

```xml
<bbox_extraction_spec>
- Use the specified coordinate format exactly (for example [x1,y1,x2,y2] normalized 0..1).
- For each bbox, include: page, label, text snippet, confidence.
- Add a vertical-drift sanity check:
  - ensure bboxes align with the line of text (not shifted up or down).
- If dense layout, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### 运行时与 API 集成说明

对于长时间运行或重度依赖工具的智能体而言，运行时契约与提示词契约同样重要。

##### Phase 参数

对于 GPT-5.4， `gpt-5.3-codex`,以及更高版本的 Responses 模型,该 `phase` 字段可以
help in the small number of long-running or tool-heavy flows where preambles or
other intermediate assistant updates are mistaken for the final answer.

- `phase` 在 API 级别上是可选的，但强烈建议使用。虽然 服务端 可能进行尽力推断，但对 `phase` 进行显式的往返传输效果要严格更好。
- 使用 `phase` 用于长时间运行或重度依赖工具的 智能体，这类智能体可能会在工具调用之前或最终答案之前发出评论性内容。
- 保留 `phase` 以便在重放先前的助手消息项时，模型能够区分工作过程中的评论性内容和已完成的答案。在包含前言、与工具相关的更新，或同一回合中包含多条助手消息的多步流程中，这一点尤为重要。
- 不要将 `phase` 添加到用户消息中。
- 如果你使用 `previous_response_id`，这通常是最简单的路径，因为 OpenAI 通常可以在不手动重放助手消息项的情况下恢复先前的状态。
- 如果你自行重放助手历史记录，请保留原始的 `phase` 值。
- 缺失或丢弃 `phase` 可能导致前言被解释为最终答案，并降低这些多步任务上的表现。

#### 在长会话中保留行为

Compaction 可显著延长有效的上下文窗口，用户对话可以在多轮交互中持续进行，不会触及上下文限制或出现长上下文性能下降，智能体可以执行远超典型上下文窗口的超长轨迹，以完成长时间运行的复杂任务。

如果使用 [Compaction](https://developers.openai.com/api/docs/guides/compaction) ，在 Responses API 中，在主要里程碑后进行压缩，将压缩后的条目视为不透明状态，并保持压缩后的提示在功能上保持一致。该端点兼容 ZDR，并返回一个 `encrypted_content` 条目，你可以将其传入后续请求中。随着会话轮次增加，GPT-5.4 在更长、多轮对话中通常能保持更好的连贯性和可靠性，较少出现故障。

如需更多指导，请参阅 [`/responses/compact` API 参考](https://developers.openai.com/api/reference/resources/responses/methods/compact).

#### 控制面向客户工作流的个性

GPT-5.4 在将持久化个性与每次响应级别的写作控制分开后，可以被更有效地引导。这对面向客户的工作流（如邮件、支持回复、公告以及博客风格内容）尤其有用。

- **个性（持久）：** 设定整个会话的默认语气、详细程度和决策风格。
- **写作控制（每次响应）：** 为特定产物定义渠道、语域、格式和长度。
- **提醒：** 个性不应覆盖任务特定的输出要求。如果用户要求 JSON，则返回 JSON。

对于自然、高质量的文本生成，最高杠杆率的可控因素包括：

- 为模型设定清晰的角色。
- 明确语气和情感基调。
- 需要纯文本时，明确禁止使用格式。
- 使用严格的长度限制。

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

如果想直接复用现成的风格模式，可以参考 [提示词风格 Cookbook](https://developers.openai.com/cookbook/examples/gpt-5/prompt_personalities).

**专业备忘录模式**

对于备忘录、评审以及其他专业写作任务，泛泛的写作指令往往不够。这类工作流需要针对具体性、领域惯例、综合分析以及恰当的分寸感给出明确指导。

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

该模式尤其适用于法律、政策、研究以及面向高管的写作场景，其目标不仅是文笔流畅，更要做到严谨的综合分析并给出清晰的结论。

### 调优推理与迁移

#### 把推理强度当作最后一公里的微调旋钮

推理强度并非一刀切。应将其视为最后微调的旋钮，而非提升质量的主要手段。在许多情况下，更强的提示、清晰的输出契约和轻量的验证循环就能恢复团队原本希望通过更高推理设置获得的大部分性能。

推荐默认值：

- `none`：适用于快速、对成本敏感、对延迟敏感且模型无需进行思考的任务。
- `low`：适用于对延迟敏感的任务，少量思考即可带来显著的准确性提升，尤其是在复杂指令场景下表现良好。
- `medium` 或 `high`：仅保留给真正需要更强推理能力、且可以承受延迟和成本权衡的任务。根据任务从额外推理中获得的性能提升程度在它们之间进行选择。
- `xhigh`：除非你的评估显示明显收益，否则避免作为默认选项。它最适合长链路、需自主智能体介入的重推理任务，在这些场景下最大化智能水平比速度或成本更重要。

实际上，大多数团队应该默认使用 `none`, `low`，或 `medium` 区间。

从 `none` 开始用于执行密集型负载，例如 工作流 步骤、字段抽取、支持分流以及短结构化转换。

从 `medium` 或更高用于研究密集型负载，例如长上下文综合、多文档审阅、冲突解决以及策略撰写。使用 `medium` 配合精心编写的提示词，你可以挤出不少表现。

对于 GPT-5.4 负载， `none` 在动作选择和工具纪律任务上已经表现良好。如果你的负载依赖于细致的解读，比如隐含需求、歧义性或取消工具调用的恢复，那么请从 `low` 或 `medium` 开始。

在提升推理力度之前，先添加：

- `<completeness_contract>`
- `<verification_loop>`
- `<tool_persistence_rules>`

如果模型仍然显得过于字面化或止步于第一个看似合理的答案，请在提高推理力度之前加入主动性提示：

```xml
<dig_deeper_nudge>
- Don’t stop at the first plausible answer.
- Look for second-order issues, edge cases, and missing constraints.
- If the task is safety or accuracy critical, perform at least one verification step.
</dig_deeper_nudge>
```

#### 每次一处变更地将提示词迁移到 GPT-5.4

沿用 5.2 指南中“一次只改一处”的做法：先切换模型并固定 `reasoning_effort`，运行 evals，再迭代。

以下这些起点对许多迁移场景都很有效：

| 当前配置             | 建议的 GPT-5.4 起点            | 备注                                                               |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `gpt-5.2`                 | 匹配当前推理力度 | 先保留现有的延迟和质量特征，再进行调优。 |
| `gpt-5.3-codex`           | 匹配当前推理力度 | 对于编码工作流，保持推理力度不变。           |
| `gpt-4.1` 或 `gpt-4o`     | `none`                             | 保持快速响应行为，只有在评测出现回退时才上调。           |
| 研究密集型助手 | `medium` 或 `high`                 | 使用显式的研究多轮迭代与引用门控。               |
| 长时程智能体       | `medium` 或 `high`                 | 添加工具持久化与完整性核算。                   |

#### 面向的小模型指南 `gpt-5.4-mini` 与 `gpt-5.4-nano`

`gpt-5.4-mini` 并且 `gpt-5.4-nano` 具有较高的可调控性，但与更大的模型相比，它们不太会自行推断缺失的步骤、隐式消除歧义，或按你期望的方式组织输出，除非你直接指定这些行为。在实际使用中，针对较小模型的提示通常会更长一些，也会更明确一些。

**如何 `gpt-5.4-mini` 不同**

- `gpt-5.4-mini` 更加字面化，假设更少。
- 在任务结构清晰时表现强劲，但在处理隐式工作流和歧义时能力较弱。
- 默认情况下，它可能会通过追问来延续对话，除非你显式抑制该行为。

**提示工程 `gpt-5.4-mini`**

- 把关键规则放在最前面。
- 当工具使用或副作用很重要时，明确指定完整的执行顺序。
- 不要仅依赖 "you MUST"。使用结构化支架，如编号步骤、决策规则和明确的动作定义。
- 将“执行动作”与“汇报动作”分开。
- 展示正确的流程，而不仅仅是最终格式。
- 明确定义歧义处理行为：何时提问、放弃或继续。
- 直接指定输出封装：回答长度、是否追问、引用样式和章节顺序。
- 谨慎使用 `output nothing else`。更推荐使用范围明确的指令，例如 `after the final JSON, output nothing further`.

**提示工程 `gpt-5.4-nano`**

- 使用 `gpt-5.4-nano` 仅适用于范围狭窄、边界清晰的任务。
- 优先使用封闭式输出：标签、枚举、简短 JSON 或固定模板。
- 除非流程受到极严格约束，否则避免多步骤编排。
- 将模糊或需要大量规划的任务路由到更强的模型，而不是过度提示 `gpt-5.4-nano`.

**Good default pattern**

1. 任务
2. 关键规则
3. 准确的步骤顺序
4. 边界情况或澄清行为
5. 输出格式
6. 一个正确示例

**Avoid**

- 隐含的后续步骤
- 未明确的边界情况
- 仅用于工具工作流的架构提示
- 缺乏结构的通用指令

#### 网页搜索与深度研究

如果你要迁移的特别是研究智能体，请在提升推理强度之前先完成以下提示词更新：

- Add `<research_mode>`
- Add `<citation_rules>`
- Add `<empty_result_recovery>`
- Increase `reasoning_effort` 仅在修复提示后增加一档。

你可以从 5.2 research 代码块开始，然后根据需要叠加引用门控和终稿契约。

当任务需要多步骤证据收集、长上下文综合以及明确的提示契约时，GPT-5.4 表现尤其出色。在实践中，最高杠杆的提示变更包括：按任务形态选择推理 effort、定义精确的输出与引用格式、添加感知依赖的工具规则，以及明确完成标准。该模型在开箱即用时通常已经很强，但在提示中明确指定如何搜索、如何验证以及如何算作完成时最为可靠。

### 后续步骤

- 查看 [模型、API 和功能更新](#model-api-and-feature-updates) 了解模型能力、参数以及 API 兼容性详情。
- 阅读 [提示工程](https://developers.openai.com/api/docs/guides/prompt-engineering) 获取适用于各模型系列的更广泛提示策略。
- 阅读 [上下文压缩](https://developers.openai.com/api/docs/guides/compaction) 如果你正在 Responses API 中构建长时间运行的 GPT-5.4 会话。


## 延伸阅读

[GPT-5.3-Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.4 博客文章](https://openai.com/index/introducing-gpt-5-4/)

[GPT-5 前端指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 模型系列：新功能指南](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[推理模型 Cookbook](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Responses API 与 Chat Completions 对比](https://developers.openai.com/api/docs/guides/migrate-to-responses)