# API 部署清单

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用多智能体实现并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用压缩](#leverage-compaction)                                     | 成本                                |
| [使用 `prompt_cache_key`](#use-promptcachekey)                                   | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [有意设置图像细节](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全性、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 可恢复性                        |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用 Responses API

**始终从** 开始
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。它是 OpenAI 的旗舰
API，也是访问最新模型行为、内置工具的最佳选择，
有状态工作流以及 智能体 功能。

## 选择 GPT-5.6 模型

选择一款 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 来承担该工作负载，而不是将每个请求都路由到能力最强的档位。使用
来承担该工作负载，而不是将每个请求都路由到能力最强的档位。使用 `gpt-5.6` 或
`gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 以获得强劲性能
且价格更低， `gpt-5.6-luna` 用于高效、大规模的工作负载。

迁移时，先保持当前模型的工作负载角色和有效
推理投入度进行首次对比。在更改提示词或添加新能力之前，
运行具有代表性的评估。对比任务成功率、延迟、
输入、输出、推理以及缓存写入 token 数量，以及每个成功任务的总成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应该进行多少思考
。

对于 GPT-5.6 模型，支持的值为 `none`, `low`, `medium`, `high`,
`xhigh`，和 `max`。默认值是 `medium`。较低的 effort 速度更快，且使用的
推理 token 更少。较高的 effort 会给模型更多时间进行规划、
调试、综合分析以及多步骤权衡。

使用 `low` 当任务主要是抽取、路由、分类或进行
简单改写时。使用 `medium` 或 `high` 当模型需要诊断某个
问题、比较选项、制定计划或对代码进行推理时。使用 `xhigh` 或
`max` 仅当代表性评估显示质量提升足以抵消
额外的延迟和成本时。从 GPT-5.5 或 GPT-5.4 迁移时，先从当前的 effort 开始，并将同一设置与低一级进行比较。GPT-5.6 通常
能够在使用更少推理 token 的情况下保持或提升质量，因此较低的
设置也可能降低延迟和成本。
设置也可能降低延迟和成本。

对于最困难的、质量优先的工作负载，还可以比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
standard mode at the same effort. Reasoning mode and effort are independent.
Pro 模式可以通过在返回单个最终答案之前应用更多模型工作来提高可靠性，但会增加延迟和 token 用量。
single final answer, but it increases latency and token usage.

为任务调整推理强度

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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:     "gpt-6-astra",
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
        .model("gpt-6-astra")
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
  model: "gpt-6-astra",
  reasoning: {effort: :xhigh, mode: :pro},
  input: prompt
)

puts(response.output_text)
```


## 设置 `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间取得平衡的主要调节手段。
当产品需要快速、紧凑的答案时使用较低的详细程度，当
响应需要更丰富的解释、更清晰的结构或
完整上下文时使用较高的详细程度。较低的详细程度意味着更少的输出 token，因此模型
生成的内容更少，输出更快。

对于编码任务， `medium` 和 `high` 往往会产生更长、更有条理的输出
，结构更清晰。 `low` 保持答案更紧凑、更精简。

GPT-5.6 默认往往比 GPT-5.5 更简洁。迁移时，请检查
像“保持简洁”这样的宽泛指令是否仍然有帮助。在某些情况下，它们可能
会使响应过于简短。仅在它们仍然有用时保留它们，并优先使用
`text.verbosity` 来控制默认的详细程度；然后在提示中
指定所需的内容、结构，以及更具体的长度（如果适用）。

为紧凑输出设置较低的详细程度

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
  model: "gpt-6-astra",
  text: { verbosity: "low" },
  input: incident,
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
  model: "gpt-6-astra",
  text: {verbosity: :low},
  input: incident
)

puts(response.output_text)
```


## 设置助手 `phase` 参数

`phase` 是对话历史中助手消息上的一个标签。它
用于向模型表明此前的助手消息是中间的
工作注释还是最终答案。请使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息。请使用
`phase: "final_answer"` 表示已完成的响应。

助手可能会这样说：

助手注释消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


那不是答案，而是一条进度备注。稍后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


在长时间运行或工具调用密集的工作流中，这种机制非常有用，因为助手可能
在完成之前生成可见的进度更新。当你将这些历史记录
在后续请求中原样发回给 `gpt-5.3-codex` 及更高版本模型时，
**请保留并重新发送 `phase`** 助手消息上的相应标记，以便模型能够区分
进度更新与最终结果。这有助于减少提前停止的情况，使
智能体更有可能一直运行直到给出最终答案。

## 使用 `tool_search`

不要在每个请求中都加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)：将
`{"type": "tool_search"}` 添加到上下文中，并将开销较大的工具定义标记为
`defer_loading: true`。模型随后可以在运行时按需加载所需子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判断需要某个延迟加载的工具，它会运行工具搜索，只有在那之后
这些延迟工具的定义才会被加载到上下文中。模型也只有在那之后才会
调用它们。这能节省 token 并保持缓存性能。

共有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  哪些工具可以用于该请求时，请使用它。
- **客户端执行的工具搜索** 适用于你的应用必须自行决定哪些
  工具可用的场景，例如基于用户的租户、项目、权限或
  内部注册表。

**从托管工具搜索开始** 除非你的应用确实需要控制
发现过程本身。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。这
样模型在几个清晰的组之间做选择，比在长长的扁平
函数列表中做选择更容易。建议每个命名空间下控制在约 10 个函数以内，
以获得最佳的 token 效率和模型性能。

保持命名空间描述简短且有区分度。将详细的
说明放在延迟加载的工具定义中。避免为所有内容
创建一个庞大的命名空间。

将托管工具搜索与延迟加载的工具结合使用

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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
  model: "gpt-6-astra",
  input: "Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.",
  tools: [billing, crm, {type: :tool_search}]
)

puts(response.output)
```


## 使用程序化工具调用

[程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时内归约它们的
中间结果。将其用于代码可以在返回更小的结构化结果给模型之前，对大型工具结果进行过滤、连接、排序、去重、合并或检查等有界阶段。
代码可以在返回更小的结构化结果给模型之前，对大型工具结果进行过滤、连接、排序、去重、合并或检查等有界阶段。
中间结果。在将更小的结构化结果返回给模型之前，将其用于代码可以过滤、连接、排序、去重、合并或检查大型工具结果的有界阶段。

添加 `programmatic_tool_calling` 工具，并为每个符合条件的工具启用。使用
`allowed_callers: ["programmatic"]` 用于仅程序调用的工具，或使用
`allowed_callers: ["direct", "programmatic"]` 当模型可能也会直接调用该
工具时。当每个结果都可能改变模型的下一个决策、某个操作需要审批，或者最终答案必须保留引用或原生制品时，请保持直接调用。
某个操作需要审批，或者最终答案必须保留引用或原生制品时，请保持直接调用。
引用或原生制品时，请保持直接调用。记录工具返回字段和错误行为，以便模型能够在不先检视结果的情况下编写正确的程序。
模型可以在不先检视结果的情况下编写正确的程序。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到其输出中，以便
该服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。正确的程序
结果仍可能成为不完整的最终答案。请将任务成功情况、
所需证据、总 token 数、延迟和成本与相同的 工作流 进行比较
使用直接工具调用的情况。

## 使用多智能体实现并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的特性，它
允许根 智能体 将独立的工作流委托给子智能体并汇总
它们的结果。当你能够将研究、分析或实现拆分为具体的、有边界的任务，且这些任务使用各自独立的上下文并能并行运行时，请使用它。
拆分成具体、有边界、彼此上下文隔离且可并行运行的任务。

设置 `multi_agent.enabled` 为 `true` 在请求中。对于 HTTP，使用 beta 版
Responses SDK，并传入 `client.beta.responses` 并传入 `responses_multi_agent=v1`
在 `betas`. 对于原始 HTTP 或 WebSocket 连接，发送
`OpenAI-Beta: responses_multi_agent=v1`. 项目结构可能会在
多智能体 处于测试阶段。

对于短任务，每一步都依赖上一步结果的有序链，或写入同一可变资源的任务，优先使用单个智能体。子智能体可能会增加
令牌用量，因此请从默认
值开始，并衡量端到端质量、延迟和成本。对于工具密集型或长时间运行的 `max_concurrent_subagents` 值为 `3`
，并衡量端到端质量、延迟和成本。对于工具密集型或长时间运行的
多智能体工作流，WebSocket 模式可以减少延续开销。

在启用多智能体之前，请先了解它当前的限制：
`/responses/compact`, `reasoning.summary`，和 `max_tool_calls` 不支持
。服务端会自动压缩根上下文以及每个
子智能体上下文。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自行构建每个工具，可以直接让模型使用
已在 Responses API 中开箱即用的工具，模型便可自行决定何时
调用它们。

OpenAI 持续推出更多原生工具，因此当它们能够满足需求时，优先使用内置工具；
当原生选项无法覆盖任务时，再构建自定义工具来适配你的 工作流。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网络以获取最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **Code interpreter**：运行 Python 进行分析、数学运算、绘图以及文件
  处理
- **Shell**：在托管容器或你自己的运行时中执行 shell 命令
- **Computer use**：通过截图、点击、输入和
  滚动来操作 UI
- **Image generation**：生成或编辑图像
- **MCP/connectors**：将模型连接到外部服务和工具
- **Skills**：附加可复用的指令包和工作流文件
- **Apply patch**：进行结构化的代码编辑

从模型质量角度来看，优先选择它们还有另一个原因。内置工具属于
我们后训练阶段的同分布工具，也就是说模型围绕这些工具的形态、行为
和输出进行训练和评估。使用内置工具时，
OpenAI 模型在工具选择、执行稳定性和失败率方面都比使用新工具时表现更好
。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具，它
决定了模型在多轮交互中向前传递哪些信息。在
长时间运行的智能体中，核心问题并不只是“我会不会撞上上下文限制？”而是
旧消息、工具日志、重试记录和过时的细节会挤占掉模型
真正需要的状态。

Compaction 提供了一种可控的方式来缩减上下文大小，同时保留
后续轮次所需的状态。在完成一个重要里程碑之后，比如结束
调试阶段或锁定根因之后，你可以压缩之前的窗口
并从压缩后的输出继续。这会让模型保持敏锐，因为
下一轮是围绕重要状态构建的，而不是堆叠每一段中间推理、
失败命令和过时的推理分支。

有两种使用 compaction 的方式：

- **让服务器处理**：如果你使用 `previous_response_id`，请启用
  `context_management` 配合一个 `compact_threshold`。服务器将在对话过大时自动
  压缩对话。你只需要持续发送
  最新的用户消息。
- **自行处理**：如果你自己管理完整的输入数组，请调用
  `client.responses.compact()`。它会返回一个较小的上下文窗口。在下一次
  调用时直接使用该返回输出。 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人工摘要，而是帮助模型继续的机器
状态。请将其原样向下传递，然后添加下一条
用户消息。

从压缩后的响应状态继续

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

// Full window collected from a long debugging session:
// user messages, assistant outputs, tool calls, and tool outputs.
const longWindow = sessionItems;

const compacted = await openai.responses.compact({
  model: "gpt-6-astra",
  input: longWindow,
});

const nextResponse = await openai.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
    input=long_window,
)

next_response = client.responses.create(
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
		Model: "gpt-6-astra",
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
                .model("gpt-6-astra")
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
            .model("gpt-6-astra")
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
  model: "gpt-6-astra",
  input: long_window
)
input = compacted.output.dup
input << {
  role: :user,
  content: "We found the bad cache invalidation path. Write the fix plan and the verification checklist."
}

response = client.responses.create(
  model: "gpt-6-astra",
  store: false,
  input: input
)

puts(response.output_text)
```


## 使用 `prompt_cache_key`

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 当请求复用相同的长前缀时，会自动降低延迟
和成本。对于高吞吐量的工作流，为共享相同稳定前缀的，
请求一致地设置
[`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-prompt_cache_key)
。服务将该 key 与提示前缀哈希结合，
以便在不改变模型输入的情况下将相似请求路由到
同一缓存。对于真正共享的前缀，请保持 key 稳定；
选择一种粒度，避免向单个 key 发送过多
流量，并将每个 key 各前缀上的总流量保持在
约每分钟 15 个请求。将更高吞吐量的流量通过稳定映射
拆分到更多的 key 上。

GPT-5.6 引入了显式提示缓存。隐式缓存仍是
默认行为，但 GPT-5.6 及后续模型系列也支持显式
缓存断点和请求级缓存策略。在这些模型上，请设置
`prompt_cache_key` 以在隐式缓存下获得更可靠的匹配
和显式断点。如果可变后缀位于稳定前缀之后，请在可复用的边界处添加
一个显式 `prompt_cache_breakpoint` ，仅在请求应当使用
`prompt_cache_options.mode` 为 `explicit` 且仅使用你提供的断点而不包含隐式断点时设置。早期模型会继续
你提供的断点并且不使用任何隐式断点时才设置。早期的模型会继续
以仅使用自动提示缓存。

在 GPT-5.6 模型及后续模型系列中，缓存写入费用为未缓存输入令牌费率
的 1.25 倍。请在日志 `cached_tokens` 和 `cache_write_tokens`，中查看，然后
将写入量与后续缓存读取量进行比较，以衡量净成本并调整键
粒度和断点位置。

将相关请求路由到同一个提示缓存

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const instructions = [
  "You are the support agent for Acme.",
  "Follow the Acme support policy and escalation rubric.",
  "Use the same tone, safety rules, and tool plan for each ticket.",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:          "gpt-6-astra",
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
        .model("gpt-6-astra")
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

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    PromptCacheKey = "tenant-acme-support-agent",
    Instructions = "Follow the Acme support policy and escalation rubric.",
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Summarize the current escalation for the on-call lead.")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
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
  model: "gpt-6-astra",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions: instructions,
  input: "Summarize the current escalation for the on-call lead."
)

puts(response.output_text)
```


## 使用 `reasoning.encrypted_content`

GPT-5.6 可以 [跨调用保留
推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls). 使用
`reasoning.context: "all_turns"` 当任务的目标、假设和优先级保持稳定时，使用
。当此前的推理已不再相关时，使用 `current_turn` 否则可能将模型锚定在过时的方法上
。如果省略
`reasoning.context` 或将其设置为 `auto`，检查响应的
`reasoning.context` 字段以确认生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在先前存在推理项时才有效。请使用 `previous_response_id`
来处理已存储的响应。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密推理内容可实现无状态的
交接。

响应输出中的推理项默认包含加密推理内容。你可以访问每个推理
项的
属性来获取加密推理内容。你的应用无需理解该 `encrypted_content` 值的含义。它只需按原样保留每个推理项，并在
下一轮中发送回去，这样模型就可以使用它来继续工作流。
在无状态轮次之间传递加密推理。

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
  model: "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:     "gpt-6-astra",
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
		Model:     "gpt-6-astra",
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
                .model("gpt-6-astra")
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
            .model("gpt-6-astra")
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
  model: "gpt-6-astra",
  store: false,
  reasoning: {effort: :medium, context: :current_turn},
  include: ["reasoning.encrypted_content"],
  input: history
)
history.concat(first.output)
history << {
  role: :user,
  content: "Now write the customer-facing explanation in plain English."
}

second = client.responses.create(
  model: "gpt-6-astra",
  store: false,
  reasoning: {effort: :medium, context: :all_turns},
  input: history
)

puts(second.output_text)
```


## 有意识地设置图片详细度

在 GPT-5.6 模型上，省略的图像 `detail` 和 `detail: "auto"` 使用与
相同的尺寸行为， `original`。服务会保留输入尺寸，
但任一边超过 65,535 像素的图像会被缩小到
该限制以内。如果图像仍然超出，API 会拒绝该图像，
[30,000 个 patch 的限制](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),
而不是调整其尺寸以适配。较大的图像会因此消耗更多输入 token
并增加延迟。

根据任务 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
选择合适的模型。可调整图像大小，在不需要 `low` 精细视觉细节时使用，或在需要
时使用 `high` 进行标准的高保真图像理解。对于较大、密集、
`original` 对坐标敏感、OCR、本地化或
需要视觉检查的任务，可保留
以利用额外细节提升质量。请在部署前测量最坏情况下的图像 token 数和延迟。

## 发送安全标识符

如果你的应用服务各个最终用户，请在每次请求时发送一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识符。这有助于 OpenAI 检测滥用行为，并为你的团队提供一个稳定的方式来
对违反策略的行为进行 追踪。这也能降低某个用户的滥用
影响整个组织访问的可能性。

对用户的用户名或电子邮件地址进行哈希处理，而不是发送可直接识别
身份的信息。对于已登出的场景，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能需要较长时间
才能完成的请求。API 不会保持客户端连接一直打开，而是启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。可用于大型分析、长时间的工具运行，或需要状态
和重试行为的工作。

运行并轮询后台响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

let job = await openai.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:      "gpt-6-astra",
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
        .model("gpt-6-astra")
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
  model: "gpt-6-astra",
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


你可以将其与 `stream=True` 结合使用以获取进度事件，但首个事件
可能比正常请求耗时更长。

从 UI 的角度来看，后台模式表示：“正在运行；这是
状态；准备就绪后，结果将显示在此处。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行、
调用工具密集的工作流而设计，你需要保持一个持久连接处于打开状态，然后
通过仅发送新的输入项来继续，以及 `previous_response_id`。对于
包含 20 次或更多工具调用的运行流程，这种方式端到端速度大约快 40%
。

**工作原理**：第一条消息看起来像一个普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会流式返回事件。如果
模型请求工具时，你的应用运行该工具。然后，你无需发送新的
HTTP 请求，而是在同一个 socket 上发送另一个 `response.create` 事件，其中包含
先前的 `previous_response_id` 和新的项。这就是延迟优势所在
来自。在普通 HTTP 中，每次后续请求都是全新的请求。在 WebSocket 模式下，
连接保持打开状态，并且该连接上最新的响应状态会保持在内存中保持就绪。
当下一轮从该响应继续进行时，
后端需要完成的设置工作更少。

如果你的工作流是一次请求、一次响应，那么 **保持 HTTP**。如果你的
工作流 表现得像长时间运行的 智能体，请尝试使用 WebSocket 模式。

单个 WebSocket 连接一次只能处理一个进行中的响应，因此
并行任务需要多个连接。连接目前最长为 60
分钟。延续（延续）使用与 HTTP `previous_response_id` 模式相同的语义，
并提供一个连接本地的最近响应缓存。

注意：WebSocket 模式可与 ZDR 配合使用，因为你的数据不会存储到磁盘，
只存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.

启动一个 Responses API WebSocket 会话

```javascript
import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const openai = new OpenAI();

const ws = new ResponsesWS(openai);

ws.on("event", (event) => {
  console.log(event.type);
  if (
    event.type === "response.completed" ||
    event.type === "response.failed" ||
    event.type === "response.incomplete"
  ) {
    ws.close();
  }
});
ws.on("error", (error) => {
  console.error(error);
  ws.close();
});

ws.send({
  type: "response.create",
  model: "gpt-6-astra",
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
});
```

```python
from openai import OpenAI

client = OpenAI()

with client.responses.connect() as connection:
    # Use the same typed parameters as client.responses.create(...).
    connection.response.create(
        model="gpt-6-astra",
        store=False,
        input=[
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
        tools=[test_log_tool, code_search_tool],
    )
    first_event = connection.recv()
    print(first_event.type)
```


## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基石。真正的优势在于，它让开发者从一次性
提示词转变为能够调用工具、具备上下文感知能力且可以适应
任务复杂性的持久化工作流。遵循本指南，了解如何在实际
部署中获得更高的性能。