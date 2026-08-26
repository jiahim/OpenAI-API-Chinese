# API 部署检查清单

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用多智能体进行并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用压缩](#leverage-compaction)                                     | 成本                                |
| [使用 `prompt_cache_key`](#use-promptcachekey)                                   | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [有意设置图像细节](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全性、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 可恢复性                        |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用Responses API

**始终从** 使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具、
有状态工作流和 智能体 功能的最佳方式。

## 选择 GPT-5.6 模型

为工作负载选择 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model) ，而不是将
每个请求都路由到能力最强的层级。使用 `gpt-5.6` 或
`gpt-5.6-sol` 用于前沿能力， `gpt-5.6-terra` 用于以更低价格
实现强劲性能，以及 `gpt-5.6-luna` 用于高效的高容量工作负载。

迁移时，在首次对比中保持当前模型的工作负载角色和有效
推理力度。在更改提示词或添加新功能之前，运行代表性评估。
比较任务成功率、延迟、
输入、输出、推理和缓存写入令牌，以及每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

对于 GPT-5.6 模型，支持的值有 `none`, `low`, `medium`, `high`,
`xhigh`，和 `max`。默认值为 `medium`。较低的 effort 运行更快，并消耗
更少的推理令牌。较高的 effort 给模型更多时间进行规划、
调试、综合和多方权衡。

当任务主要是提取、路由、分类或 `low` 简单重写时，使用
。当模型需要诊断 `medium` 或 `high` 问题、比较选项、制定计划或推理代码时，使用
。仅当代表性评估显示质量提升能证明 `xhigh` 或
`max` 额外延迟和成本合理时，才使用
。从 GPT-5.5 或 GPT-5.4 迁移时，从当前的
effort 开始，并将相同设置与低一级进行比较。GPT-5.6 通常能
以更少的推理令牌保持或提高质量，因此较低的
此设置也可能降低延迟和成本。

对于要求最高的质量优先工作负载，还要比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
相同努力程度下的标准模式。推理模式与努力程度相互独立。
专业模式在返回单一最终答案前应用更多模型工作，可提升可靠性，
但会增加延迟和令牌用量。

针对任务调整推理努力程度

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = [
  "Our CI job started failing after a dependency bump.",
  "",
  "Error:",
  "TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'",
  "",
  "Identify the likeliest root cause and the smallest safe fix.",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "xhigh", mode: "pro" },
  input: prompt,
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Our CI job started failing after a dependency bump.

Error:
TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'

Identify the likeliest root cause and the smallest safe fix.
"""

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "xhigh", "mode": "pro"},
    input=prompt,
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	prompt := strings.Join([]string{
		"Our CI job started failing after a dependency bump.",
		"",
		"Error:",
		"TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'",
		"",
		"Identify the likeliest root cause and the smallest safe fix.",
	}, "\n")
	reasoning := shared.ReasoningParam{Effort: shared.ReasoningEffortXhigh}
	reasoning.SetExtraFields(map[string]any{"mode": "pro"})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Reasoning: reasoning,
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String(prompt)},
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
import com.openai.core.JsonValue;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Our CI job started failing after a dependency bump. Error: TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'. Identify the likeliest root cause and the smallest safe fix.")
        .reasoning(
            Reasoning.builder()
                .effort(ReasoningEffort.XHIGH)
                .putAdditionalProperty("mode", JsonValue.from("pro"))
                .build())
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
prompt = <<~PROMPT
  Our CI job started failing after a dependency bump.

  Error:
  TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'

  Identify the likeliest root cause and the smallest safe fix.
PROMPT

response = client.responses.create(
  model: "gpt-5.6",
  reasoning: {effort: :xhigh, mode: :pro},
  input: prompt
)

puts(response.output_text)
```


## 设置 `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间取得平衡的主要手段。
当产品需要快速、简洁的回答时，使用较低的详细程度；而当
响应需要更丰富的解释、更清晰的结构或
完整的上下文时，使用较高的详细程度。较低的详细程度意味着较少的输出 token，因此模型
生成的内容更少，返回输出的速度也更快。

对于编码任务， `medium` 和 `high` 往往会产生更长、更有条理的输出，
结构也更清晰。 `low` 则让回答更紧凑、更精炼。

GPT-5.6 在默认情况下往往比 GPT-5.5 更简洁。迁移时，请检查
诸如“要简洁”之类的宽泛指令是否仍然有效。在某些情况下，它们可能
会让响应过于简短。仅在它们仍然有效时才保留，并优先使用
`text.verbosity` 来控制默认的详细程度；然后使用提示词来
指定所需的内容、结构以及更具体的长度（如果适用）。

为紧凑输出设置较低详细程度

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const incident = [
  "Summarize this incident for the next on-call engineer.",
  "- checkout latency spiked from 220 ms to 4.8 s",
  "- only us-east-1 was affected",
  "- rollback is complete",
  "- likely trigger: cache stampede after deploy",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  text: { verbosity: "low" },
  input: incident,
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    text={"verbosity": "low"},
    input="""
    Summarize this incident for the next on-call engineer.
    - checkout latency spiked from 220 ms to 4.8 s
    - only us-east-1 was affected
    - rollback is complete
    - likely trigger: cache stampede after deploy
    """,
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	incident := strings.Join([]string{
		"Summarize this incident for the next on-call engineer.",
		"- checkout latency spiked from 220 ms to 4.8 s",
		"- only us-east-1 was affected",
		"- rollback is complete",
		"- likely trigger: cache stampede after deploy",
	}, "\n")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Text:  responses.ResponseTextConfigParam{Verbosity: "low"},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(incident)},
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
import com.openai.models.responses.ResponseTextConfig;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Summarize this incident for the next on-call engineer: checkout latency spiked from 220 ms to 4.8 s, only us-east-1 was affected, rollback is complete, and the likely trigger was a cache stampede.")
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
incident = <<~INCIDENT
  Summarize this incident for the next on-call engineer.
  - checkout latency spiked from 220 ms to 4.8 s
  - only us-east-1 was affected
  - rollback is complete
  - likely trigger: cache stampede after deploy
INCIDENT

response = client.responses.create(
  model: "gpt-5.6",
  text: {verbosity: :low},
  input: incident
)

puts(response.output_text)
```


## 设置助手 `phase` 参数

`phase` 是对话历史中助手消息上的一个标签。它
向模型表明先前的助手消息是中间
过程注释还是最终答案。使用 `phase: "commentary"` 用于进度
更新、工具调用前的说明以及其他中间消息。使用
`phase: "final_answer"` 用于最终响应。

助手可能会说类似这样的话：

助手过程注释消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


这不是答案，而是一条进度说明。之后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具密集的工作流中非常有用，助手可能
在完成之前产生可见的进度更新。当你在后续请求中发送该历史
用于 `gpt-5.3-codex` 及以后模型时，
**在助手消息上保留并重新发送 `phase`** ，以便模型能够区分
进度更新和最终结果。这有助于减少提前停止，使
智能体更有可能持续运行直至得出最终答案。

## 使用 `tool_search`

不要将完整工具目录加载到每个请求中，请改用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)：
`{"type": "tool_search"}` 并用
`defer_loading: true`。标记昂贵的工具定义。这样模型就可以在运行时加载它需要的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型决定需要延迟工具，它会运行工具搜索，并且只有那时
延迟工具的定义才会加载到上下文中。只有在那时模型才会
调用它们。这样可以节省令牌并保持缓存性能。

有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  请求中可能有哪些工具时使用它。
- **客户端执行工具搜索** 适用于你的应用必须决定哪些
  工具可用的情况，例如基于用户的租户、项目、权限或
  内部注册表。

**先从托管工具搜索开始** 除非你的应用确实需要控制
发现本身。

按用户意图对工具进行分组。在可行时使用命名空间或 MCP 服务器。这
会让模型更容易在几个清晰的分组之间做出选择，而不是面对一长串扁平的
函数列表。我们建议将每个命名空间保持在约 10 个函数以内，
以获得最佳的令牌效率和模型性能。

保持命名空间描述简短且具有区分性。将详细的
指令放在延迟工具定义中。避免为所有内容创建一个巨大的
命名空间。

将托管工具搜索与延迟工具结合使用

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

/** @type {OpenAI.Responses.Tool} */
const billingNamespace = {
  type: "namespace",
  name: "billing",
  description: "Billing tools for invoices, payments, taxes, and credits.",
  tools: [
    {
      type: "function",
      name: "lookup_invoice",
      description:
        "Look up invoice state, taxes, credits, and payment attempts.",
      parameters: {
        type: "object",
        properties: {
          invoice_id: { type: "string" },
        },
        required: ["invoice_id"],
        additionalProperties: false,
      },
      strict: true,
      defer_loading: true,
    },
  ],
};

/** @type {OpenAI.Responses.Tool} */
const crmNamespace = {
  type: "namespace",
  name: "crm",
  description:
    "CRM tools for account ownership, plans, health, and payment history.",
  tools: [
    {
      type: "function",
      name: "get_account",
      description: "Fetch account owner, plan, health, and payment history.",
      parameters: {
        type: "object",
        properties: {
          account_id: { type: "string" },
        },
        required: ["account_id"],
        additionalProperties: false,
      },
      strict: true,
      defer_loading: true,
    },
  ],
};

const response = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Find the right billing tool and explain why invoice INV-1043 still " +
    "shows overdue after a payment yesterday.",
  tools: [billingNamespace, crmNamespace, { type: "tool_search" }],
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

billing_namespace = {
    "type": "namespace",
    "name": "billing",
    "description": "Billing tools for invoices, payments, taxes, and credits.",
    "tools": [
        {
            "type": "function",
            "name": "lookup_invoice",
            "description": "Look up invoice state, taxes, credits, and payment attempts.",
            "parameters": {
                "type": "object",
                "properties": {
                    "invoice_id": {"type": "string"},
                },
                "required": ["invoice_id"],
                "additionalProperties": False,
            },
            "strict": True,
            "defer_loading": True,
        }
    ],
}

crm_namespace = {
    "type": "namespace",
    "name": "crm",
    "description": "CRM tools for account ownership, plans, health, and payment history.",
    "tools": [
        {
            "type": "function",
            "name": "get_account",
            "description": "Fetch account owner, plan, health, and payment history.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string"},
                },
                "required": ["account_id"],
                "additionalProperties": False,
            },
            "strict": True,
            "defer_loading": True,
        }
    ],
}

response = client.responses.create(
    model="gpt-5.6",
    input=(
        "Find the right billing tool and explain why invoice INV-1043 still "
        "shows overdue after a payment yesterday."
    ),
    tools=[billing_namespace, crm_namespace, {"type": "tool_search"}],
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
	billing := namespaceTool(
		"billing",
		"Billing tools for invoices, payments, taxes, and credits.",
		"lookup_invoice",
		"Look up invoice state, taxes, credits, and payment attempts.",
		"invoice_id",
	)
	crm := namespaceTool(
		"crm",
		"CRM tools for account ownership, plans, health, and payment history.",
		"get_account",
		"Fetch account owner, plan, health, and payment history.",
		"account_id",
	)
	toolSearch := responses.ToolUnionParam{OfToolSearch: &responses.ToolSearchToolParam{}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(
			"Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.",
		)},
		Tools: []responses.ToolUnionParam{billing, crm, toolSearch},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}

func namespaceTool(namespace, namespaceDescription, name, description, argument string) responses.ToolUnionParam {
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			argument: map[string]any{"type": "string"},
		},
		"required":             []string{argument},
		"additionalProperties": false,
	}
	function := responses.NamespaceToolToolFunctionParam{
		Name: name, Description: openai.String(description), Parameters: parameters, Strict: openai.Bool(true), DeferLoading: openai.Bool(true),
	}
	return responses.ToolParamOfNamespace(
		namespaceDescription,
		namespace,
		[]responses.NamespaceToolToolUnionParam{{OfFunction: &function}},
	)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.NamespaceTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolSearchTool;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.")
        .addTool(
            namespace(
                "billing",
                "Billing tools for invoices, payments, taxes, and credits.",
                "lookup_invoice",
                "Look up invoice state, taxes, credits, and payment attempts.",
                "invoice_id"))
        .addTool(
            namespace(
                "crm",
                "CRM tools for account ownership, plans, health, and payment history.",
                "get_account",
                "Fetch account owner, plan, health, and payment history.",
                "account_id"))
        .addTool(ToolSearchTool.builder().execution(ToolSearchTool.Execution.SERVER).build())
        .build();

client.responses().create(params).output().forEach(System.out::println);

private static NamespaceTool namespace(
    String name,
    String description,
    String function,
    String functionDescription,
    String argument) {
  return NamespaceTool.builder()
      .name(name)
      .description(description)
      .addTool(
          NamespaceTool.Tool.Function.builder()
              .name(function)
              .description(functionDescription)
              .deferLoading(true)
              .strict(true)
              .parameters(
                  JsonValue.from(
                      Map.of(
                          "type",
                          "object",
                          "properties",
                          Map.of(argument, Map.of("type", "string")),
                          "required",
                          List.of(argument),
                          "additionalProperties",
                          false)))
              .build())
      .build();
}
```

```ruby
require "openai"

def namespace_tool(name, description, function_name, function_description, argument)
  {
    type: :namespace,
    name: name,
    description: description,
    tools: [
      {
        type: :function,
        name: function_name,
        description: function_description,
        defer_loading: true,
        strict: true,
        parameters: {
          type: "object",
          properties: {argument => {type: "string"}},
          required: [argument],
          additionalProperties: false
        }
      }
    ]
  }
end

client = OpenAI::Client.new
billing = namespace_tool(
  "billing",
  "Billing tools for invoices, payments, taxes, and credits.",
  "lookup_invoice",
  "Look up invoice state, taxes, credits, and payment attempts.",
  "invoice_id"
)
crm = namespace_tool(
  "crm",
  "CRM tools for account ownership, plans, health, and payment history.",
  "get_account",
  "Fetch account owner, plan, health, and payment history.",
  "account_id"
)

response = client.responses.create(
  model: "gpt-5.6",
  input: "Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.",
  tools: [billing, crm, {type: :tool_search}]
)

puts(response.output)
```


## 使用编程工具调用

[编程式工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时中减少它们的
中间结果。适用于有界阶段，其中
代码可以在向模型返回较小的结构化结果之前，对大量工具结果进行过滤、连接、排序、去重、合并或检查
。在返回给模型的较小结构化结果之前，先进行这些操作。

添加 `programmatic_tool_calling` 工具，并为每个符合条件的工具选择启用。使用
`allowed_callers: ["programmatic"]` 用于仅程序工具，或使用
`allowed_callers: ["direct", "programmatic"]` 当模型也可以直接调用
工具时。当每个结果可能改变模型的下一步决策、操作需要审批或最终答案必须保留引用或原生工件时，保持直接调用。文档化工具返回字段和错误行为，以便
模型能够在不首先检查结果的情况下编写正确的程序。您的工具循环必须处理
项，以及程序发出的
项及其。

以及 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并将函数调用的 `caller` 复制到其输出中，以便
服务能够恢复正确的程序。

同时测试 `program_output` 和最终的助手消息。正确的程序
结果仍可能成为不完整的最终答案。将任务成功率、
所需证据、总令牌数、延迟和成本与相同的 工作流 进行比较
使用直接工具调用。

## 使用多智能体进行并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的一项功能，
允许根智能体将独立工作流委托给子智能体，并综合
其结果。当你可以将研究、分析或实现工作拆分
为具体、有界的任务，且这些任务使用独立上下文并并行运行时，可使用此功能。

在请求中设置 `multi_agent.enabled` 为 `true` 。对于 HTTP，请使用 beta 版
Responses SDK 并配合 `client.beta.responses` ，传递 `responses_multi_agent=v1`
中的 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。条目模式可能会在
Multi-智能体处于测试阶段时发生变化。

对于短期任务、每一步都依赖上一步结果的顺序链，或写入同一可变资源的工作，
更倾向于使用单个智能体。子智能体可能增加
token 用量，因此请从默认的 `max_concurrent_subagents` 值 `3`
开始，并衡量端到端的质量、延迟和成本。对于工具密集或长时间运行的
Multi-智能体工作流，WebSocket 模式可以减少延续开销。

在启用多智能体之前，请考虑其当前的限制：
`/responses/compact`, `reasoning.summary`，以及 `max_tool_calls` 不受
支持。服务器会自动压缩根上下文以及每个
子智能体上下文。

## 利用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你不必自己构建每个工具，可以让模型访问
已在 Responses API 中可用的工具。模型即可自行决定何时
使用它们。

OpenAI 会持续增加更多原生工具，因此在适用场景中优先使用内置工具
来适配你的 工作流。当原生选项无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网页以获取最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **代码解释器**：运行 Python 进行分析、数学、图表和文件
  处理
- **Shell**：在托管容器或你自己的运行时中运行 shell 命令
- **计算机使用**：通过屏幕截图、点击、键入和
  滚动来操作 UI
- **图像生成**：生成或编辑图像
- **MCP/连接器**：将模型连接到外部服务和工具
- **技能**：附加可重用的指令包和 工作流 文件
- **应用补丁**：进行结构化代码编辑

还有一个涉及模型质量的原因也支持优先使用它们。内置工具处于
我们后训练中的分布内，意味着模型是围绕这些工具形态、行为和输出
进行训练和评估的。使用内置工具时，
OpenAI 模型相比新工具能实现更好的工具选择、更干净的执行，以及更少的
失败。

## 利用压缩

[压缩](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定模型在多轮对话中携带哪些信息。在
长时间运行的 智能体中，问题不仅仅是“我会达到上下文限制吗？”它
还在于旧消息、工具日志、重试和陈旧的细节会挤掉模型所需的
状态。

压缩提供了一种受控的方式来减小上下文大小，同时保留
后续轮次所需的状态。在完成一个有意义的里程碑后（例如结束
一个调试阶段或缩小根本原因范围），你可以压缩之前的窗口
并从压缩后的输出继续。这能让模型保持敏锐，因为
下一轮是围绕重要状态构建的，而不是每一个中间推理、
失败的命令和过时的推理分支。

利用压缩有两种方式：

- **让服务器处理**：如果你使用 `previous_response_id`，启用
  `context_management` 并设置 `compact_threshold`。当对话过大时，服务器将自动
  压缩对话。你只需持续发送
  最新的用户消息。
- **自行处理**：如果你自己管理完整的输入数组，请调用
  `client.responses.compact()`。它会返回一个更小的上下文窗口。将那个
  返回的输出直接用于下一次 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人类摘要，而是机器
状态，用于帮助模型继续。请原样传递，然后添加下一条
用户消息。

从压缩后的响应状态继续

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

// Full window collected from a long debugging session:
// user messages, assistant outputs, tool calls, and tool outputs.
const longWindow = sessionItems;

const compacted = await openai.responses.compact({
  model: "gpt-5.6",
  input: longWindow,
});

const nextResponse = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  input: [
    ...compacted.output, // Use compact output as-is.
    {
      type: "message",
      role: "user",
      content:
        "We found the bad cache invalidation path. Write the fix plan " +
        "and the verification checklist.",
    },
  ],
});

console.log(nextResponse.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

# Full window collected from a long debugging session:
# user messages, assistant outputs, tool calls, and tool outputs.
long_window = session_items

compacted = client.responses.compact(
    model="gpt-5.6",
    input=long_window,
)

next_response = client.responses.create(
    model="gpt-5.6",
    store=False,
    input=[
        *compacted.output,  # Use compact output as-is.
        {
            "type": "message",
            "role": "user",
            "content": (
                "We found the bad cache invalidation path. Write the fix plan "
                "and the verification checklist."
            ),
        },
    ],
)

print(next_response.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	longWindow := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Find the cache invalidation bug in this debugging session.", responses.EasyInputMessageRoleUser),
	}
	compacted, err := client.Responses.Compact(context.Background(), responses.ResponseCompactParams{
		Model: "gpt-5.6",
		Input: responses.ResponseCompactParamsInputUnion{OfResponseInputItemArray: longWindow},
	})
	if err != nil {
		panic(err)
	}
	input := append(outputAsInput(compacted.Output),
		responses.ResponseInputItemParamOfMessage(
			"We found the bad cache invalidation path. Write the fix plan and the verification checklist.",
			responses.EasyInputMessageRoleUser,
		),
	)
	nextResponse, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Store: openai.Bool(false),
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(nextResponse.OutputText())
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCompactParams;
import com.openai.models.responses.ResponseCompactionItemParam;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var compacted =
    client
        .responses()
        .compact(
            ResponseCompactParams.builder()
                .model("gpt-5.6")
                .input("Find the cache invalidation bug in this debugging session.")
                .build());
var input = new ArrayList<ResponseInputItem>();
for (var item : compacted.output()) {
  item.message().map(ResponseInputItem::ofResponseOutputMessage).ifPresent(input::add);
  item.reasoning().map(ResponseInputItem::ofReasoning).ifPresent(input::add);
  item.compaction()
      .map(
          value ->
              ResponseInputItem.ofCompaction(
                  ResponseCompactionItemParam.builder()
                      .id(value.id())
                      .encryptedContent(value.encryptedContent())
                      .build()))
      .ifPresent(input::add);
}
input.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content(
                "We found the bad cache invalidation path. Write the fix plan and the verification checklist.")
            .build()));

client
    .responses()
    .create(
        ResponseCreateParams.builder()
            .model("gpt-5.6")
            .inputOfResponse(input)
            .store(false)
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
long_window = [
  {
    role: :user,
    content: "Find the cache invalidation bug in this debugging session."
  }
]

compacted = client.responses.compact(
  model: "gpt-5.6",
  input: long_window
)
input = compacted.output.map(&:to_h)
input << {
  role: :user,
  content: "We found the bad cache invalidation path. Write the fix plan and the verification checklist."
}

response = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: input
)

puts(response.output_text)
```


## 使用 `prompt_cache_key`

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 可自动降低延迟
和成本，当请求复用相同的长前缀时。对于高容量工作流，
设置
[`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-prompt_cache_key)
对共享相同稳定前缀的请求保持一致。服务
将该键与提示词前缀哈希结合，以帮助将相似请求路由到
相同的缓存，而不改变模型输入。保持键稳定以用于
真正共享的前缀，选择一种粒度，避免向单个键发送过多
流量，并将每个键的前缀总流量保持在
约每分钟15个请求。通过稳定的映射，将更高流量的流量分散到更多键上
。

GPT-5.6引入了显式提示缓存。隐式缓存仍然是
默认方式，但GPT-5.6模型及后来的模型系列也支持显式
缓存断点和请求级缓存策略。在这些模型上，设置
`prompt_cache_key` 以使用更可靠的匹配，适用于隐式缓存
和显式断点。如果变化的后缀跟在稳定前缀之后，请在可复用边界添加
一个显式 `prompt_cache_breakpoint` 。设置
`prompt_cache_options.mode` 为 `explicit` 仅当请求应只使用
你提供的断点，且无隐式断点。较早的模型继续
仅使用自动提示缓存。

在 GPT-5.6 模型及更高版本的模型系列中，缓存写入成本为未缓存输入令牌费率的 1.25 倍。
记录 `cached_tokens` 与 `cache_write_tokens`，然后
将写入量与后续缓存读取量进行比较，以衡量净成本并调整键
粒度和断点位置。

将相关请求路由到同一提示缓存

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const instructions = [
  "You are the support agent for Acme.",
  "Follow the Acme support policy and escalation rubric.",
  "Use the same tone, safety rules, and tool plan for each ticket.",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions,
  input: "Summarize the current escalation for the on-call lead.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

instructions = """
You are the support agent for Acme.
Follow the Acme support policy and escalation rubric.
Use the same tone, safety rules, and tool plan for each ticket.
"""

response = client.responses.create(
    model="gpt-5.6",
    prompt_cache_key="tenant-acme-support-agent",
    instructions=instructions,
    input="Summarize the current escalation for the on-call lead.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	instructions := strings.Join([]string{
		"You are the support agent for Acme.",
		"Follow the Acme support policy and escalation rubric.",
		"Use the same tone, safety rules, and tool plan for each ticket.",
	}, "\n")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:          "gpt-5.6",
		PromptCacheKey: openai.String("tenant-acme-support-agent"),
		Instructions:   openai.String(instructions),
		Input:          responses.ResponseNewParamsInputUnion{OfString: openai.String("Summarize the current escalation for the on-call lead.")},
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

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .instructions(
            "You are the support agent for Acme.\n"
                + "Follow the Acme support policy and escalation rubric.\n"
                + "Use the same tone, safety rules, and tool plan for each ticket.")
        .input("Summarize the current escalation for the on-call lead.")
        .promptCacheKey("tenant-acme-support-agent")
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
instructions = <<~INSTRUCTIONS
  You are the support agent for Acme.
  Follow the Acme support policy and escalation rubric.
  Use the same tone, safety rules, and tool plan for each ticket.
INSTRUCTIONS

response = client.responses.create(
  model: "gpt-5.6",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions: instructions,
  input: "Summarize the current escalation for the on-call lead."
)

puts(response.output_text)
```


## 使用 `reasoning.encrypted_content`

GPT-5.6 可以 [跨
调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。当
`reasoning.context: "all_turns"` 任务的目标、假设和
优先级保持稳定时，使用 `current_turn` 。当之前的推理不再
相关，且可能将模型锚定在过时的方法上时，使用
`reasoning.context` 。如果省略 `auto`，或将其设置为
`reasoning.context` ，请检查响应的。

[字段以确认有效模式。持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅当先前的推理项可用时才有效。使用 `previous_response_id`
进行存储的响应。如果你的 [零数据保留
（ZDR）](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密推理内容可实现无状态的
交接。

响应输出中的推理项默认包含加密推理内容，
默认情况。你可以从每个推理
条目的 `encrypted_content` 属性中访问加密的推理内容。你的应用无需理解该
值。它只需按原样保留每个推理条目，并在下一轮将其发送回去
，以便模型利用它继续工作流。

在无状态轮次之间传递加密推理

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

/** @type {OpenAI.Responses.ResponseInput} */
const history = [
  {
    role: "user",
    content: "Investigate why invoice INV-1043 has mismatched tax totals.",
  },
];

const first = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  reasoning: { effort: "medium", context: "current_turn" },
  input: history,
});

history.push(...first.output);
history.push({
  role: "user",
  content: "Now write the customer-facing explanation in plain English.",
});

const second = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  reasoning: { effort: "medium", context: "all_turns" },
  input: history,
});

console.log(second.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

history = [
    {
        "role": "user",
        "content": "Investigate why invoice INV-1043 has mismatched tax totals.",
    }
]

first = client.responses.create(
    model="gpt-5.6",
    store=False,
    reasoning={"effort": "medium", "context": "current_turn"},
    input=history,
)

history.extend(item.model_dump(exclude={"status"}) for item in first.output)
history.append(
    {
        "role": "user",
        "content": "Now write the customer-facing explanation in plain English.",
    }
)

second = client.responses.create(
    model="gpt-5.6",
    store=False,
    reasoning={"effort": "medium", "context": "all_turns"},
    input=history,
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
		responses.ResponseInputItemParamOfMessage("Investigate why invoice INV-1043 has mismatched tax totals.", responses.EasyInputMessageRoleUser),
	}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortMedium, Context: shared.ReasoningContextCurrentTurn},
		Include:   []responses.ResponseIncludable{responses.ResponseIncludableReasoningEncryptedContent},
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
	})
	if err != nil {
		panic(err)
	}
	history = append(history, outputAsInput(first.Output)...)
	history = append(history, responses.ResponseInputItemParamOfMessage(
		"Now write the customer-facing explanation in plain English.",
		responses.EasyInputMessageRoleUser,
	))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortMedium, Context: shared.ReasoningContextAllTurns},
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
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
import com.openai.models.responses.ResponseIncludable;
import com.openai.models.responses.ResponseInputItem;
import java.util.ArrayList;

var history = new ArrayList<ResponseInputItem>();
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Investigate why invoice INV-1043 has mismatched tax totals.")
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
                        .effort(com.openai.models.ReasoningEffort.MEDIUM)
                        .putAdditionalProperty("context", JsonValue.from("current_turn"))
                        .build())
                .addInclude(ResponseIncludable.of("reasoning.encrypted_content"))
                .build());
first.output().stream()
    .map(item -> JsonValue.from(item).convert(ResponseInputItem.class))
    .forEach(history::add);
history.add(
    ResponseInputItem.ofEasyInputMessage(
        EasyInputMessage.builder()
            .role(EasyInputMessage.Role.USER)
            .content("Now write the customer-facing explanation in plain English.")
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
                    .effort(com.openai.models.ReasoningEffort.MEDIUM)
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
  {
    role: :user,
    content: "Investigate why invoice INV-1043 has mismatched tax totals."
  }
]

first = client.responses.create(
  model: "gpt-5.6",
  store: false,
  reasoning: {effort: :medium, context: :current_turn},
  include: ["reasoning.encrypted_content"],
  input: history
)
history.concat(first.output.map(&:to_h))
history << {
  role: :user,
  content: "Now write the customer-facing explanation in plain English."
}

second = client.responses.create(
  model: "gpt-5.6",
  store: false,
  reasoning: {effort: :medium, context: :all_turns},
  input: history
)

puts(second.output_text)
```


## 有意设置图像细节

在 GPT-5.6 模型上，省略图像 `detail` 和 `detail: "auto"` 使用与
相同的大小调整行为 `original`。服务会保留输入尺寸
而不是将图像调整到补丁预算或像素尺寸限制。大
图像可能使用更多输入标记，并因此增加延迟。

选择 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
以适合任务。调整图像大小，使用 `low` 当精细视觉细节不
重要时，或使用 `high` 进行标准的高保真图像理解。保留
`original` 用于大型、密集、坐标敏感、OCR、定位或
视觉检查任务，其中额外细节可提高质量。在部署前测量
最坏情况下的图像标记和延迟。

## 发送安全标识符

如果你的应用为单个最终用户提供服务，请在每次请求中发送一个稳定、
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识。它有助于OpenAI检测滥用，并为你的团队提供一种稳定的方式来
追踪策略违规。这也降低了单个用户滥用
影响你更广泛组织访问权限的可能性。

对用户的用户名或电子邮件地址进行哈希处理，而不是发送可识别
信息。对于未登录的体验，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 处理可能耗时
较长的请求。与其保持客户端连接打开，API 会启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或
被取消。适用于大型分析、长时间工具运行或需要状态
和重试行为的工作。

运行并轮询后台响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

let job = await openai.responses.create({
  model: "gpt-5.6",
  background: true,
  store: false,
  input: "Analyze this large log bundle and cluster the primary failure modes.",
  tools: [
    {
      type: "code_interpreter",
      container: {
        type: "auto",
        file_ids: [logBundleFileId],
      },
    },
  ],
});

while (["queued", "in_progress"].includes(job.status)) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  job = await openai.responses.retrieve(job.id);
}

console.log(job.output_text);
```

```python
from openai import OpenAI
import time

client = OpenAI()

job = client.responses.create(
    model="gpt-5.6",
    background=True,
    store=False,
    input="Analyze this large log bundle and cluster the primary failure modes.",
    tools=[
        {
            "type": "code_interpreter",
            "container": {
                "type": "auto",
                "file_ids": [log_bundle_file_id],
            },
        }
    ],
)

while job.status in {"queued", "in_progress"}:
    time.sleep(2)
    job = client.responses.retrieve(job.id)

print(job.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfCodeInterpreter(responses.ToolCodeInterpreterContainerCodeInterpreterContainerAutoParam{
		FileIDs: []string{"file_abc123"},
	})
	job, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-5.6",
		Background: openai.Bool(true),
		Store:      openai.Bool(false),
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("Analyze this large log bundle and cluster the primary failure modes.")},
		Tools:      []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	for job.Status == responses.ResponseStatusQueued || job.Status == responses.ResponseStatusInProgress {
		time.Sleep(2 * time.Second)
		job, err = client.Responses.Get(context.Background(), job.ID, responses.ResponseGetParams{})
		if err != nil {
			panic(err)
		}
	}
	fmt.Println(job.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStatus;
import com.openai.models.responses.Tool;

String fileId = "file_abc123";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Analyze this large log bundle and cluster the primary failure modes.")
        .background(true)
        .store(false)
        .addCodeInterpreterTool(
            Tool.CodeInterpreter.Container.CodeInterpreterToolAuto.builder()
                .addFileId(fileId)
                .build())
        .build();

var response = client.responses().create(params);
while (response.status().filter(ResponseStatus.QUEUED::equals).isPresent()
    || response.status().filter(ResponseStatus.IN_PROGRESS::equals).isPresent()) {
  Thread.sleep(1000);
  response = client.responses().retrieve(response.id());
}
if (response.status().filter(ResponseStatus.COMPLETED::equals).isEmpty()) {
  throw new IllegalStateException(
      "Research ended with status: " + response.status().orElseThrow());
}

response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new

job = client.responses.create(
  model: "gpt-5.6",
  background: true,
  store: false,
  input: "Analyze this large log bundle and cluster the primary failure modes.",
  tools: [
    {
      type: :code_interpreter,
      container: {type: :auto, file_ids: ["file_abc123"]}
    }
  ]
)

while [:queued, :in_progress].include?(job.status)
  sleep(2)
  job = client.responses.retrieve(job.id)
end

puts(job.output_text)
```


你可以将其与 `stream=True` 结合以获取进度事件，但第一个事件
可能比普通请求耗时更长。

从 UI 角度看，后台模式表示，“此操作正在运行；这里是
状态；结果就绪后会显示在这里。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行、
大量工具调用的工作流设计，你保持持久连接开启，
通过仅发送新的输入项以及 `previous_response_id`。来继续。对于
包含20次或更多工具调用的部署，这种方法大约快40%
端到端。

**工作原理**：第一条消息看起来像正常的 Responses 请求：
模型、指令、工具和用户输入。服务器流式返回事件。如果
模型请求工具，你的应用运行该工具。然后，不是发送新的
HTTP 请求，而是在同一连接上发送另一个 `response.create` 事件，其中包含
之前的 `previous_response_id` 和新项。这就是延迟优势
的来源。在普通 HTTP 中，每次后续请求都是全新请求。在 WebSocket 模式中，
连接保持开启，最近一次响应状态在该连接上保持活跃
在内存中。当下一次轮次从该响应继续时，
后端需要做的初始化工作更少。

如果你的 工作流是一个请求对应一个回答，那么 **保持 HTTP**。如果你的
工作流的行为类似于长时间运行的智能体，请尝试 WebSocket 模式。

单个 WebSocket 连接一次处理一个进行中的响应，因此
并行工作需要多个连接。连接目前最多持续 60
分钟。延续使用与 `previous_response_id` HTTP 相同的
语义，并带有最近响应的连接本地缓存。

注意：WebSocket 模式适用于 ZDR，因为你的数据不会存储到磁盘，
仅存储在内存中。

默认的 Python 示例使用 `websocket-client` (`pip install
websocket-client`）。JavaScript 示例使用 `ws` (`npm install ws`).

启动 Responses API WebSocket 会话

```javascript
import OpenAI from "openai";
import WebSocket from "ws";

const openai = new OpenAI();

const ws = new WebSocket("wss://api.openai.com/v1/responses", {
  headers: {
    Authorization: "Bearer " + openai.apiKey,
  },
});

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "response.create",
      model: "gpt-5.6",
      store: false,
      input: [
        {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Find the flaky test in this run, call the tools you need, " +
                "and keep going until you can explain the root cause.",
            },
          ],
        },
      ],
      tools: [testLogTool, codeSearchTool],
    })
  );
});

ws.on("message", (data) => {
  const firstEvent = JSON.parse(data.toString());
  console.log(firstEvent.type);
});
```

```python
from openai import OpenAI
from websocket import create_connection
import json

client = OpenAI()

ws = create_connection(
    "wss://api.openai.com/v1/responses",
    header=[f"Authorization: Bearer {client.api_key}"],
)

# Same request body you would send to client.responses.create(...).
ws.send(
    json.dumps(
        {
            "type": "response.create",
            "model": "gpt-5.6",
            "store": False,
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "Find the flaky test in this run, call the tools "
                                "you need, and keep going until you can explain "
                                "the root cause."
                            ),
                        }
                    ],
                }
            ],
            "tools": [test_log_tool, code_search_tool],
        }
    )
)

first_event = json.loads(ws.recv())
print(first_event["type"])
```


## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基础。真正的优势在于，它让开发者能够从一次性
提示转向持久化、使用工具、感知上下文的工作流，这些工作流能够适应
任务的复杂性。按照本指南操作，你将看到在实际部署中更高的性能
表现。