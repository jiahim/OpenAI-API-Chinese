# API 部署清单

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用多智能体处理并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用上下文压缩](#leverage-compaction)                                     | 成本                                |
| [优化提示缓存](#optimize-prompt-caching)                             | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [主动设置图像细节](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 可恢复性                        |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用 Responses API

**始终从** 开始使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具的最佳途径，支持，
有状态工作流以及 智能体 功能。

## 选择 GPT-5.6 模型

选择一款 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 来承载相应的工作负载，而不是将每个请求都路由到能力最强的层级。可使用
来实现旗舰级能力，使用 `gpt-5.6` 或
`gpt-5.6-sol` 来获得旗舰能力， `gpt-5.6-terra` 以更低价格获得强大性能，
以及 `gpt-5.6-luna` 来高效处理大规模工作负载。

迁移时，请在首次对比中保留当前模型的工作负载角色和有效的
推理投入程度。在更改提示词或添加新能力之前，运行具有代表性的评估，对比任务成功率、延迟、
输入、输出、推理与缓存写入 token，以及每个成功任务的开销。
输入、输出、推理与缓存写入 token，以及每个成功任务的开销。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

对于 GPT-5.6 模型，支持的取值为 `none`, `low`, `medium`, `high`,
`xhigh`，和 `max`。默认值为 `medium`。较低的努力程度更快，并且使用
更少的推理 tokens。较高的努力程度会让模型有更多时间进行规划、
调试、综合权衡以及多步取舍。

使用 `low` 当任务主要是抽取、路由、分类，或进行
简单改写时。使用 `medium` 或 `high` 当模型需要诊断
问题、比较方案、撰写计划，或对代码进行推理时。使用 `xhigh` 或
`max` 仅当具有代表性的评估显示质量提升足以抵消
额外延迟和成本时。从 GPT-5.5 或 GPT-5.4 迁移时，先从
当前的努力程度开始，并将该设置与低一档进行比较。GPT-5.6 通常
能够以更少的推理 tokens 保持或提升质量，因此较低的
设置也可能降低延迟和成本。

对于最困难的、优先考虑质量的工作负载，还可以比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
在相同 effort 下的 standard 模式。推理模式与 effort 相互独立。
Pro 模式通过在返回单一最终答案之前投入更多模型工作量来提升可靠性，
但会增加延迟和 token 用量。

针对任务调整推理 effort

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


## 设置 `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间进行平衡的主要手段。
当产品需要快速、紧凑的答案时，使用较低的 verbosity；当响应需要
更丰富的解释、更清晰的结构或完整的上下文时，使用较高的 verbosity。
较低的 verbosity 意味着输出 token 更少，因此模型生成的内容更少，
返回输出的速度更快。

对于编码任务， `medium` 与 `high` 往往会产生更长、结构更清晰的输出
结构也更清晰。 `low` 使答案更紧凑、更精简。

GPT-5.6 默认情况通常比 GPT-5.5 更简洁。迁移时，请检查
像“Be concise”这类宽泛指令是否仍然有效。在某些情况下，它们可能
使响应过于简短。仅在它们仍然有帮助时保留，并优先使用
`text.verbosity` 来控制默认的细节程度；然后在 prompt 中
指定所需的内容、结构以及（如适用）更具体的长度。

为紧凑输出设置较低的 verbosity

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

`phase` 是对话历史中助手消息上的一个标签。它
用于向模型表明先前的助手消息是中间
过程性注释还是最终答案。请使用 `phase: "commentary"` 表示进度
更新、调用工具前的备注以及其他中间消息。请使用
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


那不是答案，而是一条进度说明。之后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


在长时间运行或工具调用密集的工作流中，这非常有用，因为助手可能
在完成之前会产生可见的进度更新。当你将该历史
记录随后续请求发回给 `gpt-5.3-codex` 及更高版本的模型时，
**请保留并在助手消息上重新发送 `phase`** ，以便模型能够区分
进度更新和最终结果。这有助于减少提前停止，让
智能体 更有可能一直执行直到给出最终答案。

## 使用 `tool_search`

不要在每个请求中都加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` 并将开销较大的工具定义标记为
`defer_loading: true`。模型随后就可以在运行时按需加载它所需的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判断需要某个延迟工具，它就会运行工具搜索，只有在那之后
这些延迟工具的定义才会被加载到上下文中。也只有在那之后，模型才会
调用它们。这可以节省令牌并保持缓存性能。

有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  该请求可能使用哪些工具时，可使用它。
- **客户端执行的工具搜索** 适用于应用必须动态决定可用工具的场景，例如
  根据用户的租户、项目、权限或
  内部注册表来决定。

**从 托管工具 搜索开始** 除非你的应用确实需要自行控制
发现机制。

按用户意图对工具进行分组。尽量使用命名空间或 MCP 服务器。让
模型在几个清晰的分组之间进行选择，比在一长串扁平
的函数列表中选择要容易得多。我们建议每个命名空间保持在大约 10 个函数以内，
以获得最佳的 token 效率和模型性能。

保持命名空间描述简洁且具有区分度。将详细的
说明放在延迟加载的工具定义中。避免为所有内容
使用一个庞大的命名空间。

将 托管工具 搜索与延迟加载的工具结合使用

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


## 使用程序化工具调用

[Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时内归约它们的
中间结果。将其用于代码可以对大体积工具结果进行过滤、连接、排序、去重、合并或校验等有界阶段，
然后再向模型返回更小的结构化结果。
然后再向模型返回更小的结构化结果。

添加该 `programmatic_tool_calling` 工具，并为每个符合条件的工具选择启用。对于仅供程序使用的工具，可使用
`allowed_callers: ["programmatic"]` ；当模型可能直接调用该
`allowed_callers: ["direct", "programmatic"]` 工具时，可使用另一选项。每个结果都可能影响模型下一步
决策、需要审批某个操作，或最终答案必须保留引用或原生产物时，请保持直接调用。请在文档中记录工具返回字段和错误行为，
以便模型能够编写正确的程序，而无需先检查结果。
以便模型能够编写正确的程序，而无需先检查结果。
以便模型能够编写正确的程序，而无需先检查结果。

你的工具循环必须处理 `program` 与 `program_output` 条目，以及
程序发出的 `function_call` 条目及其对应的 `function_call_output` 条目。
请保留每个 `call_id`，并复制函数调用的 `caller` 到它的输出中，以便
服务能够恢复正确的程序。

同时测试 `program_output` 和最终的助手消息。即使是正确的程序
结果仍可能变成不完整的最终答案。请将任务成功率、
所需证据、总 token 数、延迟和成本与同一个工作流进行比较
直接调用工具的情况下的对比。

## 使用多智能体并行处理工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的一项功能，
允许根 智能体 将独立的工作流委托给子智能体并整合
它们的结果。当你可以将研究、分析或实现拆分为具体的、有边界的任务，
并让这些任务使用各自的上下文并行运行时，可使用它。

在请求中 `multi_agent.enabled` 将 `true` 设置为。对于 HTTP，请使用 beta 版
Responses SDK 中的 `client.beta.responses` ，并传入 `responses_multi_agent=v1`
。对于原始 `betas`。HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。在 Multi-智能体
处于 beta 阶段期间，Item schema 可能会发生变化。

对于短任务、上一步依赖下一步的顺序链，或写入同一可变资源的工作，请优先使用单个 智能体。子智能体可能会
增加 token 用量，因此从默认的
值 `max_concurrent_subagents` 开始， `3`
并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以减少 延续 开销。

在启用多智能体之前，请先了解其当前的限制：
`/responses/compact`, `reasoning.summary`，和 `max_tool_calls` 不支持
。服务端会自动压缩根上下文以及每个
子智能体上下文。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自己构建每个工具，而是可以让模型访问那些
已经在 Responses API 内部可用的工具。这样模型就可以自行决定何时
调用它们。

OpenAI 仍在不断添加更多原生工具，因此当内置工具
契合你的 工作流 时，应优先使用它们；只有当原生工具无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网页以获取最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **代码解释器**：运行 Python 以进行分析、数学运算、绘图和文件
  处理
- **Shell**：在托管容器或你自己的运行时中运行 Shell 命令
- **计算机使用**：通过截图、点击、键入和
  滚动操作界面
- **图像生成**：生成或编辑图像
- **MCP/连接器**：将模型连接到外部服务和工具
- **技能**：附加可复用的指令包和 工作流 文件
- **应用补丁**：进行结构化的代码编辑

选择它们还有一个模型质量层面的原因。内置工具
属于我们后训练分布的一部分，也就是说模型的训练和评估都围绕
这些工具的形态、行为和输出展开。使用内置工具时，
OpenAI 模型能实现更好的工具选择、更顺畅的执行，以及更少的
失败情况，相较于使用新工具而言。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具，它
决定了模型在多轮交互中传递哪些信息。在
长时间运行的智能体中，问题不仅仅是“我是否会触及上下文限制？”而是
旧消息、工具日志、重试以及过时的细节挤占了模型真正需要的
状态。

Compaction 提供了一种可控的方式来缩减上下文规模，同时保留
后续轮次所需的状态。在完成某个重要里程碑之后，例如结束
调试阶段或定位到根本原因后，你可以压缩先前的窗口
并从压缩后的输出继续。这能保持模型的敏锐度，因为下一
轮的构建围绕重要状态展开，而非每一步中间推理、
失败命令以及过时的推理分支。

利用 compaction 有两种方式：

- **让服务端处理**：如果你使用 `previous_response_id`，请开启
  `context_management` 配合一个 `compact_threshold`。服务端会自动
  在对话过长时压缩对话。你只需持续发送
  最新的用户消息。
- **自行处理**：如果你自行管理完整的输入数组，请调用
  `client.responses.compact()`，它会返回一个更小的上下文窗口。直接将该
  返回的输出用于下一次 `responses.create()` 调用。

**不要修改压缩后的输出。** 它不是人工摘要，而是用于帮助模型继续对话的机器
状态。请将其原样向下传递，然后追加下一条
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

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 可在请求复用相同的前缀时自动降低时延和成本
和成本。把稳定的指令、示例和参考资料放在最前面,再接上动态的、
与用户相关的内容。保持工具定义和顺序的稳定,并在追加新的对话
轮次时不要重写先前的上下文。
上下文。

GPT-5.6 引入了显式的 prompt caching。隐式 caching 仍然是
默认行为,但 GPT-5.6 模型以及后续模型系列也支持显式
cache breakpoint 以及请求级别的缓存策略。如果稳定前缀之后紧跟
会变化的后缀,请在该可复用的边界处添加一个显式 `prompt_cache_breakpoint` 。仅在需要让请求只使用你提供的
`prompt_cache_options.mode` 将 `explicit` breakpoint 并且不使用任何隐式 breakpoint 时,才设置
。更早的模型仍然只能使用自动的 prompt caching。
prompt caching。

在 GPT-5.6 模型以及后续模型系列上,cache 写入的费用是
未缓存输入 token 费率的 1.25×。请记录 `cached_tokens` 与 `cache_write_tokens`,然后
将写入量与后续的 cache 读取量进行比较,以衡量净成本并调整
breakpoint 的位置。

使用可选的 `prompt_cache_key` 以针对
客户、用户或工作区维护独立的缓存计费。这样可以更容易地解释每个分组的缓存 token 用量与计费情况。
为每个客户分配一个唯一密钥，并在该客户相关请求之间保持其稳定。
独立的密钥也有助于防止跨客户的缓存命中探测。参见
使用密钥实现独立的缓存计费 [使用
密钥实现独立的缓存计费](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

为客户维护独立的缓存计费

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

GPT-5.6 可以 [在多次调用之间保留推理
调用](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。当任务的目标、假设和
`reasoning.context: "all_turns"` 优先级保持稳定时使用
。当先前的推理不再 `current_turn` 相关并可能使模型锚定在过时的方法上时使用
。如果省略
`reasoning.context` 或将其设置为 `auto`，请检查响应中的
`reasoning.context` 字段以确认实际生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在存在先前的推理项时生效。可使用 `previous_response_id`
来存储响应。如果你的 [Zero Data Retention
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密的推理内容可以实现无状态的
交接。

响应输出中的推理项默认包含加密的推理内容。
你可以从每个推理项的
属性访问加密的推理内容。你的应用无需理解该 `encrypted_content` 值。它只需按原样保留每个推理项，并在下一轮中将其发送回
去，以便模型能够继续该 工作流。
模型，以便模型能够使用它来继续该 工作流。

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


## 有意识地设置图片细节

在 GPT-5.6 模型上，omitted image `detail` 与 `detail: "auto"` 使用与
相同的尺寸处理行为 `original`。服务会保留输入尺寸，
但任何一边超过 65,535 像素的图片会被缩小
以符合该限制。如果图片仍超出，API 会直接拒绝
[30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),
，而不会将其缩放到该限制内。较大的图片会消耗更多输入 token，
并因此增加延迟。

根据任务 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
进行选择。可调整图片大小， `low` 在不需要精细视觉细节时使用，
或在需要 `high` 标准高保真图片理解时使用。对于大型、密集、
`original` 对坐标敏感的 OCR、本地化或
视觉检查类任务，使用更精细的模式可提升质量。在上线前
测量最坏情况下的图片 token 消耗与延迟。

## 发送安全标识符

如果你的应用服务于单个终端用户，请在每个请求中发送一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识符。它帮助 OpenAI 检测滥用行为，并为你的团队提供一种稳定的方式来
追踪 追踪 策略的情况。它还能降低某个用户的滥用行为
干扰更广泛组织访问的可能性。

对用户的用户名或电子邮件地址进行哈希处理，而不是直接发送可识别
信息。对于已登出的体验，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能耗时较长的
请求。API 不会一直保持客户端连接，而是启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。适用于大型分析、长时间的工具运行，或需要状态
和重试行为的任务。

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


你可以将其与 `stream=True` 结合使用以获取进度事件，但首个事件
可能比普通请求耗时更长。

从 UI 的角度来看，后台模式表示：“正在运行；这里
是状态；准备就绪后，结果将显示在此处。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的，
、调用工具密集型的工作流而设计，你可以在其中保持一个持久连接打开，并通过
仅发送新的输入项来延续 `previous_response_id`。对于
包含 20 次或以上工具调用的运行，这种方式在端到端性能上大约快 40%
。

**工作原理**：第一条消息看起来像一个普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会以流式方式返回事件。如果
模型请求使用某个工具时，你的应用会运行该工具。然后，你无需发送新的
HTTP 请求，而是在同一个 socket 上再发送一个 `response.create` 事件，其中包含
先前的 `previous_response_id` 响应项以及新的响应项。这就是延迟优势的
来源。在普通 HTTP 中，每次后续交互都是一次新的请求。而在 WebSocket 模式下，
连接保持打开状态，该连接上最近一次响应的状态也保持热备在内存中。当下一轮从
该响应继续时，后端需要完成的初始化工作更少。
无需进行重复的握手与解析。

如果你的 工作流 只是“一次请求、一次回答”，那么 **keep HTTP**。如果你的
工作流 行为类似长时间运行的 智能体，请尝试 WebSocket 模式。

单个 WebSocket 连接一次只能处理一个进行中的响应，因此
并行任务需要多个连接。连接当前最长为 60
分钟。延续使用的 `previous_response_id` 语义与 HTTP
模式相同，并附带一个连接本地的最近响应缓存。

注意：WebSocket 模式可与 ZDR 配合使用，因为你的数据不会存储到磁盘，
仅存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install async-websocket`.

启动 Responses API WebSocket 会话

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

Responses API 是构建更智能、更强大的 OpenAI 应用的基石。
它的真正优势在于让开发者从一次性的提示转向可适应各种场景的、持久化的、能使用工具的、具备上下文感知能力的工作流。
（无内容）
complexity of the task. Follow this guide to see higher performance in real
deployments.