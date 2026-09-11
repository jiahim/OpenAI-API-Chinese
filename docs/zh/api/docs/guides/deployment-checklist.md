# API 部署检查清单

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾添加 `.md` 。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用多 智能体 处理并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用压缩](#leverage-compaction)                                     | 成本                                |
| [优化提示缓存](#optimize-prompt-caching)                             | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [有意识地设置图像细节](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全性、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 可恢复性                        |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用 Responses API

**始终从** 开始使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。入手。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具的最佳途径，
支持有状态工作流和 智能体 功能。

## 选择 GPT-5.6 模型

选择一个 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 来匹配该工作负载，而不是将每个请求路由到能力最强的层级。使用
来匹配该工作负载，而不是将每个请求路由到能力最强的层级。使用 `gpt-5.6` 或
`gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 以获得强劲性能
以更低的价格，以及 `gpt-5.6-luna` 用于高效、大规模的工作负载。

迁移时，为首次对比保留当前模型的工作负载角色和有效
推理强度。在更改提示或添加新能力之前运行有代表性的评估。对比任务成功率、
延迟、输入、输出、推理和缓存写入 token，以及每个成功任务的成本。
输入、输出、推理和缓存写入 token，以及每个成功任务的成本。

## Set up `reasoning.effort`

使用 `reasoning.effort` 来决定模型在
回答之前应进行多少思考。

对于 GPT-5.6 模型，支持的值为 `none`, `low`, `medium`, `high`,
`xhigh`，和 `max`。默认为 `medium`。较低的 effort 更快且使用
更少的推理 token。较高的 effort 让模型有更多时间进行规划、
调试、合成和多步权衡。

使用 `low` 适用于任务主要是抽取、路由、分类或
简单改写的场景。使用 `medium` 或 `high` 适用于模型需要诊断
问题、比较选项、撰写方案或对代码进行推理的场景。使用 `xhigh` 或
`max` 仅在具有代表性的评估显示质量提升值得付出
额外的延迟和成本时使用。从 GPT-5.5 或 GPT-5.4 迁移时，从当前的 effort 开始，
并将相同设置与低一档的设置进行比较。GPT-5.6 通常
能够在使用更少推理 token 的情况下保持或提升质量，因此较低的
设置也可能降低延迟和成本。

对于对质量要求最高的负载，还应将
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
在相同推理投入度下的标准模式。推理模式与投入度相互独立。
Pro 模式通过在返回单一最终答案之前投入更多模型工作来提升可靠性，但会增加延迟和 token 用量。
延迟和 token 用量。

根据任务调整推理投入度

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
  reasoning: {
    effort: :xhigh,
    mode: :pro
  },
  input: prompt
)

puts(response.output_text)
```


## Set up `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间进行平衡的主要调节手段。
当产品需要快速、紧凑的答案时，使用较低的详细度；当回答需要更丰富的解释、更清晰的结构或
完整的上下文时，使用较高的详细度。较低的详细度意味着更少的输出 token，模型
生成的文本更少，返回结果更快。
生成的文本更少，返回结果更快。

对于编码， `medium` 和 `high` 往往会产生更长、组织更清晰的输出
，结构也更清晰。 `low` 使回答更紧凑、更精简。

GPT-5.6 默认通常比 GPT-5.5 更简洁。迁移时，请检查
像 “Be concise” 这类宽泛指令是否仍然有帮助。在某些情况下，它们可能会
使回答过于简短。仅当它们仍然有帮助时保留它们，并优先使用
`text.verbosity` 来控制默认的详细程度；然后使用提示来
指定所需的内容、结构，以及更具体的长度（如果适用）。

设置较低的详细度以获得紧凑的输出

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
  text: { verbosity: :low },
  input: incident
)

puts(response.output_text)
```


## 设置 assistant `phase` 参数

`phase` 是会话历史中助手消息上的一个标签。它
用于向模型表明之前的助手消息是中间
的工作注释还是最终答案。请使用 `phase: "commentary"` 来表示进度
更新、调用工具前的说明以及其他中间消息。请使用
`phase: "final_answer"` 来表示已完成的响应。

助手可能会这样说：

助手注释消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


这不是最终答案，而是一条进度备注。随后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具调用密集的工作流中非常有用，因为助手可能
在完成之前会产生可见的进度更新。当你将该历史记录
在后续请求中发回给 `gpt-5.3-codex` 及更高版本的模型时，请，
**保留并重新发送 `phase`** 助手消息上的该标签，以便模型能够区分
进度更新和最终结果。这有助于减少提前停止，让
智能体更有可能继续运行直至得到最终答案。

## 使用 `tool_search`

不要在每次请求中都加载完整的工具目录，而是使用
[tool search](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` 并将开销较大的工具定义标记为
`defer_loading: true`。模型随后可以在运行时按需加载所需的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判断自己需要某个延迟加载的工具，它会运行 tool search，只有在此之后
这些延迟加载的工具定义才会被加载到上下文中。直到那时，模型才会
调用它们。这既能节省 token，又能保持缓存性能。

有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  哪些工具可以用于该请求时使用它。
- **客户端执行的工具搜索** 适用于你的应用必须自行决定可用
  工具的场景，例如根据用户的租户、项目、权限或
  内部注册表来决定。

**从托管工具搜索开始** 除非你的应用确实需要自行控制
发现过程。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。对模型而言，
在几个清晰的分组之间做选择，比在一长串扁平的函数列表中挑选要容易得多。
我们建议每个命名空间保持在约 10 个函数以内，
以获得最佳的 token 效率和模型性能。

保持命名空间描述简洁且具有区分度。把详细的
说明放在延迟加载的工具定义内部。避免把所有内容都放进
同一个巨型命名空间。

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
          properties: { argument => { type: "string" } },
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
  tools: [billing, crm, { type: :tool_search }]
)

puts(response.output)
```


## 使用编程式工具调用

[Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时内归约它们的
中间结果。可将其用于有界的阶段，让代码可以在向模型返回更小的结构化结果之前，
对大型工具结果进行过滤、连接、排序、去重、合并或校验。
面向模型返回较小的结构化结果。

添加该 `programmatic_tool_calling` 工具，并为每个符合条件的工具选择加入。使用
`allowed_callers: ["programmatic"]` 用于仅供程序使用的工具，或使用
`allowed_callers: ["direct", "programmatic"]` 当模型也可能直接调用该
工具时。当每次结果都可能改变模型的下一步决策、需要审批某个动作，或最终答案必须保留
引用或原生工件时，请保持直接调用。文档化工具返回字段和错误行为，以便
模型能够编写正确的程序，而无需先检查结果。
你的工具循环必须处理。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到其输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。正确的程序
结果仍可能变成不完整的最终答案。对比任务成功率、
所需证据、总 token 数、延迟和成本，并与相同的工作流对比
使用直接工具调用的情况。

## 使用 Multi-智能体 并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的功能，可
让一个根 智能体 将独立的工作流委派给子智能体并整合
它们的结果。当你能够将研究、分析或实现
拆分为具体的、有边界的任务，并使用各自的上下文并行运行时，请使用它。

在请求中将 `multi_agent.enabled` 设置为 `true` 。对于 HTTP，请使用 beta 版本的
Responses SDK，配合 `client.beta.responses` 并传入 `responses_multi_agent=v1`
参数 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。在 Multi-智能体
处于 beta 阶段时，Item 结构可能会发生变化。

对于短任务、每一步依赖前一步的有序链，或写入同一可变资源的工作，请优先使用单个 智能体。子智能体可能
会增加 token 用量，因此请从默认的
值（ `max_concurrent_subagents` ） `3`
开始，并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以降低 延续 开销。

在启用 Multi-智能体 之前，请考虑其当前的限制：
`/responses/compact`, `reasoning.summary`，和 `max_tool_calls` 暂不支持
。服务端会自动压缩根上下文以及每个
子智能体上下文。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自行构建每个工具，而是可以让模型访问
那些已在 Responses API 中可直接使用的工具。然后模型可以自行决定何时
使用它们。

OpenAI 不断新增更多原生工具，因此当内置工具满足需求时，
请优先使用它们来适配你的 工作流。当原生选项无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**: 搜索网页以获取最新信息
- **文件搜索**: 搜索已上传的文件或向量存储
- **代码解释器**: 运行 Python 进行分析、数学计算、绘图以及文件
  处理
- **Shell**: 在托管容器或你自己的运行时中运行 shell 命令
- **Computer use**: 通过截图、点击、键入和滚动操作界面
  滚动
- **图像生成**: 生成或编辑图像
- **MCP/连接器**: 将模型连接到外部服务和工具
- **Skills**: 附加可复用的指令包和 工作流 文件
- **Apply patch**: 进行结构化的代码编辑

出于模型质量的考虑，也更推荐使用内置工具。内置工具
属于我们后训练分布内（in-distribution）的工具，也就是说模型是围绕这些工具的形态、行为和输出进行训练和
评估的。使用内置工具时，
OpenAI 模型在工具选择、执行效果和失败率方面优于新增工具。
failures than with new tools.

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定了模型在多轮对话中需要向前传递哪些信息。在
长时间运行的智能体中，问题不只是“我是否会触及上下文限制”，而
是那些旧消息、工具日志、重试以及过时的细节会挤占掉模型所
需的状态。

Compaction 为你提供了一种受控的方式来缩减上下文规模，同时保留后续
轮次所需的状态。在完成一个具有意义的里程碑之后，比如结束调试
阶段或缩小到某个根因，你可以对先前的上下文窗口进行压缩，然后
从压缩后的输出继续。这样可以让模型保持敏锐，因为下一轮的构建
围绕的是重要的状态，而不是每一步中间推理、失败，
的命令和过时的推理分支。

有两种方式可以利用 compaction：

- **让服务端处理**: 如果你使用 `previous_response_id`，请启用
  `context_management` ，并设置一个 `compact_threshold`。当对话过长时，服务端会自动
  压缩对话。你只需要持续发送最新的
  用户消息。
- **自行处理**: 如果你自行管理完整的输入数组，请调用
  `client.responses.compact()`。它会返回一个更小的上下文窗口。直接将返回的输出用于下一次
  调用即可。 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人工摘要，而是帮助模型继续生成的机器
状态。请将其原样向前传递，然后再添加下一条
用户消息。

从压缩后的响应状态继续

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

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
    // Preserve replayable compacted items.
    ...toResponseInputItems(compacted.output),
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


<a id="use-promptcachekey"></a>

<a id="separate-prompts-with-promptcachekey"></a>

## 优化提示缓存

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 可在请求复用同一长前缀时自动降低延迟
和成本。将稳定的指令、
示例和参考资料放在最前面,然后再放置动态的
用户相关内容。保持工具定义和顺序稳定,并在不重写
前面上下文的情况下追加新的对话轮次。

GPT-5.6 引入了显式提示缓存。隐式缓存仍是
默认方式,但 GPT-5.6 及后续模型系列也支持显式
缓存断点和请求级缓存策略。如果可变的后缀
位于稳定前缀之后,请在可复用边界处添加一个显式 `prompt_cache_breakpoint` ,仅在请求应只使用你提供的断点且不使用隐式断点时设置
`prompt_cache_options.mode` 设置为 `explicit` 仅为请求应仅使用你提供的断点且不使用隐式断点时设置
,并且不包含隐式断点时使用。早期的模型则继续
仅使用自动提示缓存。

在 GPT-5.6 及后续模型系列上,缓存写入的成本为
未缓存输入 token 价格的 1.25 倍。请记录 `cached_tokens` 和 `cache_write_tokens`,然后
将写入量与后续的缓存读取量进行比较,以衡量净成本并调整
断点位置。

使用可选的 `prompt_cache_key` 以维护针对
客户、用户或工作区的独立缓存核算。这有助于更清晰地解释每个分组的缓存 token 使用量和计费
情况。为每个客户分配一个独立的密钥，并
在该客户的所有相关请求中保持密钥稳定。独立的密钥还有助于
防止跨客户的缓存命中探测。参见 [使用
密钥进行独立的缓存核算](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

为单个客户维护独立的缓存核算

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

GPT-5.6 可以在 [跨调用保留
推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。当任务的
`reasoning.context: "all_turns"` 目标、假设和优先级保持稳定时使用
。当先前的 `current_turn` 推理已不再相关且可能会使模型锚定于过时的方法时使用
。如果省略
`reasoning.context` 或将其设置为 `auto`，请检查响应中的
`reasoning.context` 字段以确认实际生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在存在较早的推理项时可用。使用 `previous_response_id`
用于存储响应。如果你的 [Zero Data Retention
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密推理内容支持无状态的
交接。

响应输出中的推理项默认包含加密推理内容。
你可以从每个推理项的
属性访问加密推理内容。你的应用不需要理解该 `encrypted_content` 属性。
值。它只需按原样保留每个推理项，并在下一轮中将其回传，
以便模型可以基于它继续工作流。

在无状态轮次之间传递加密推理

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

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

history.push(...toResponseInputItems(first.output));
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
  reasoning: {
    effort: :medium,
    context: :current_turn
  },
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
  reasoning: {
    effort: :medium,
    context: :all_turns
  },
  input: history
)

puts(second.output_text)
```


## 有意识地设置图像细节

在 GPT-5.6 模型上，省略的图片 `detail` 和 `detail: "auto"` 使用与
相同的尺寸行为 `original`。服务会保留输入尺寸，
但任一边超过 65,535 像素的图片会被缩小以
满足该限制。API 会拒绝仍然超过
[30,000 个 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),
的图片，而不是将其缩放至符合上限。较大的图片因此可能会占用更多输入 token 并
增加延迟。

请根据任务 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
进行选择。调整图片尺寸，在不需要精细 `low` 视觉细节时使用，或在
需要时使用 `high` 进行标准的高保真图片理解。在图片较大、内容密集、
`original` 对坐标敏感、OCR、本地化或
视觉检查等任务中保留 ，额外的细节有助于提升质量。在部署前请测量
最坏情况下的图片 token 和延迟。

## Send a safety identifier

如果你的应用面向独立的最终用户，请在每个请求中发送一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识符，以便 OpenAI 检测滥用行为，并为你的团队提供一种稳定的
方式来 追踪 违规政策。它还能降低某个用户的滥用
行为影响整个组织访问的可能性。

对用户的用户名或电子邮件地址进行哈希处理，而不是直接发送可识别
信息。对于未登录的使用场景，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于处理可能需要
较长时间的请求。API 不会保持客户端连接一直打开，而是启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。可用于大规模分析、长时间的工具运行，或需要状态
与重试行为的工作。

运行并轮询后台响应

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

const openai = new OpenAI();
const logBundleFileId = "file_123";

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
# Replace the illustrative IDs and URLs below with your own resource values.
from openai import OpenAI
import time

client = OpenAI()
log_bundle_file_id = "file_123"

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
      container: {
        type: :auto,
        file_ids: ["file_abc123"]
      }
    }
  ]
)

while [:queued, :in_progress].include?(job.status)
  sleep(2)
  job = client.responses.retrieve(job.id)
end

puts(job.output_text)
```


你可以将它与 `stream=True` 结合用于进度事件，但首个事件
可能比普通请求耗时更长。

从 UI 角度来看，后台模式表示：“正在运行；当前
状态如下；准备就绪后，结果将在此处显示。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行、
工具调用密集的工作流而设计，你需要保持一个长连接并
通过仅发送新的输入项来继续， `previous_response_id`。对于
具有 20 次或更多工具调用的运行，这种方式端到端速度快约 40%
。

**工作原理**：第一条消息看起来像一个普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会以事件流形式返回。如果
模型请求调用工具时，你的应用会运行该工具。然后，无需发送新的
HTTP 请求，你在同一个 socket 上发送另一个 `response.create` 事件，其中包含
上一次的 `previous_response_id` 以及新的 item。延迟优势正是由此而来。在普通 HTTP 中，每
次后续请求都是一次全新的请求。而在 WebSocket 模式下，
连接保持打开，该连接上最近一次的响应状态也会保留在内存
中。当下一轮从该响应继续时，后端需要完成的初始化工作更少。
后端需要完成的初始化工作更少。

如果你的工作流只是一次请求、一次回答，那么 **保持使用 HTTP**。如果你的
工作流 表现为长时间运行的 智能体，请尝试 WebSocket 模式。

单个 WebSocket 连接一次只能处理一个进行中的响应，因此
并行工作需要多个连接。连接目前最长为 60
分钟。延续沿用与 HTTP `previous_response_id` 模式相同的语义，并通过连接级缓存保存最近的响应。
模式，并通过连接级缓存保存最近的响应。

注意：WebSocket 模式兼容 ZDR，因为你的数据不会写入磁盘，
仅存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install async-websocket`.

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

```ruby
require "async"
require "async/http/endpoint"
require "async/websocket/client"
require "json"

def wait_for_response(connection)
  while (message = connection.read)
    event = JSON.parse(message.to_str)
    case event.fetch("type")
    when "response.completed" then return event.fetch("response")
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{JSON.generate(event)}"
    end
  end
  raise "Connection closed before the response finished"
end

test_log_tool = {
  type: "function",
  name: "search_test_logs",
  description: "Search test logs.",
  parameters: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
    additionalProperties: false
  },
  strict: true
}
code_search_tool = {
  type: "function",
  name: "search_code",
  description: "Search source code.",
  parameters: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
    additionalProperties: false
  },
  strict: true
}

endpoint = Async::HTTP::Endpoint.parse("wss://api.openai.com/v1/responses", timeout: 10, alpn_protocols: ["http/1.1"])
headers = { "Authorization" => "Bearer #{ENV.fetch("OPENAI_API_KEY")}" }
Sync do |task|
  task.with_timeout(120) do
    Async::WebSocket::Client.connect(endpoint, headers: headers) do |connection|
      connection.write(
        JSON.generate(
          type: "response.create", stream_id: "main", model: "gpt-6-astra", store: false,
          input: [
            {
              role: "user",
              content: "Find the flaky test in this run, call the tools you need, and keep going until you can explain the root cause."
            }
          ],
          tools: [test_log_tool, code_search_tool]
        )
      )
      connection.flush
      puts(JSON.pretty_generate(wait_for_response(connection).fetch("output")))
    end
  end
end
```


## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基础。真正的优势在于，它让开发者可以从一次性的
提示转变为持久化、可使用工具且具备上下文感知能力的工作流，从而适应不同的
任务复杂度。按照本指南操作，可在实际部署中获得更高的性能
。