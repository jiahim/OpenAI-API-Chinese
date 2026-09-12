# API 部署清单

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置 assistant `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用 Programmatic Tool Calling](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用 Multi-智能体 进行并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用 compaction](#leverage-compaction)                                     | 成本                                |
| [优化 prompt caching](#optimize-prompt-caching)                             | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [有意识地设置图像详细程度](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全性、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 恢复工作                       |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用 Responses API

**始终从** 使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。它是 OpenAI 的旗舰
API，也是访问最新模型行为、内置工具的最佳选择，
支持有状态的工作流以及 智能体 功能。

## 选择 GPT-5.6 模型

选择一款 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 来承担相应工作负载，而不是将每个请求都路由到最高性能层级。使用
来获得旗舰级能力，使用 `gpt-5.6` 或
`gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 以更低价格获得强劲性能，
以及 `gpt-5.6-luna` 用于高效的大批量工作负载。

迁移时，请保留当前模型的工作负载角色和有效的
推理投入度，用于首次对比。在更改提示词或新增能力之前，先运行具有代表性的评估。对比任务成功率、延迟、
输入、输出、推理和缓存写入令牌，以及每个成功任务的成本。
输入、输出、推理以及缓存写入令牌，以及每次成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

对于 GPT-5.6 模型，支持的值为 `none`, `low`, `medium`, `high`,
`xhigh`，以及 `max`。默认值为 `medium`。较低的 effort 更快，使用的
推理 token 也更少。较高的 effort 给模型更多时间进行规划、
调试、综合分析以及多步权衡。

使用 `low` 当任务主要是抽取、路由、分类或
例行改写时使用。使用 `medium` 或 `high` 当模型需要诊断
问题、比较方案、编写计划或对代码进行推理时。使用 `xhigh` 或
`max` 仅当代表性评估显示质量提升值得额外的
延迟和成本时。从 GPT-5.5 或 GPT-5.4 迁移时，先使用当前的
effort，并与低一档的相同设置进行比较。GPT-5.6 通常
能够在使用更少推理 token 的情况下保持或提升质量，因此较低的
设置也可能降低延迟和成本。

对于最困难的、追求质量优先的工作负载，还需比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
在相同 effort 下的标准模式。推理模式与 effort 相互独立。
Pro 模式通过在返回单个最终答案前投入更多模型算力，可以提升可靠性，但会增加延迟与 token 用量。
单个最终答案，但会增加延迟与 token 用量。

根据任务调整推理 effort

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

`text.verbosity` 是在简洁性与完整性之间进行平衡的主要调节手段。
当产品需要快速、紧凑的答案时使用较低 verbosity；当响应需要更丰富的解释、更清晰的结构或完整的上下文时使用较高 verbosity。
当响应需要更丰富的解释、更清晰的结构或完整的上下文时使用较高 verbosity。
完整上下文。较低的 verbosity 意味着更少的输出 token，因此模型生成的内容更少，输出更快。
生成的内容更少并更快地返回输出。

对于编程任务， `medium` 和 `high` 通常会产生更长、更有条理的输出
，结构更清晰。 `low` 则能让回答更紧凑、更精炼。

GPT-5.6 默认情况下往往比 GPT-5.5 更为简洁。在迁移时，请检查
像 “Be concise” 这类宽泛指令是否仍然有效。在某些情况下，它们可能会
导致回答过于简短。仅在它们仍然有帮助时保留使用，并优先使用
`text.verbosity` 来控制默认的详细程度；然后使用 prompt 来
在适用时指定所需的内容、结构以及更具体的长度。

设置较低 verbosity 以获得紧凑输出

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


## 设置助手 `phase` 参数

`phase` 是对话历史中助手消息上的一个标签。它
用于向模型指明之前的助手消息是中间
工作注解还是最终答案。使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息。使用
`phase: "final_answer"` 表示已完成响应。

助手可能会这样表述：

助手注解消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


这不是最终答案，而是一条进度备注。之后，助手可能会这样表述：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


在长时间运行或工具密集型工作流中，这种区分很有用，因为助手可能会
在完成之前产生可见的进度更新。当你在后续请求中把这段历史
回传给 `gpt-5.3-codex` 及更高版本的模型时，
**保留并重新发送 `phase`** 助手消息上的这一字段，模型便能区分
进度更新与最终结果。这有助于减少提前停止，使
智能体更有可能一直运行到给出最终答案。

## 使用 `tool_search`

不要在每次请求中加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` ，并将开销较大的工具定义标记为
`defer_loading: true`。模型随后可以在运行时按需加载所需的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判断需要某个延迟加载的工具，它就会运行工具搜索，只有
在那之后这些延迟工具的定义才会被加载到上下文中。只有在那之后模型才会
调用它们。这既节省了 token，又能保持缓存性能。

工具搜索有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  请求可能用到哪些工具时使用它。
- **客户端执行的工具搜索** 适用于需要由你的应用来决定可用工具
  的场景，例如基于用户的租户、项目、权限或
  内部注册表。

**从托管工具搜索开始** 除非你的应用确实需要自行控制
发现过程。

按用户意图对工具进行分组。尽量使用命名空间或 MCP 服务器。这
样模型在几个清晰的分组之间做选择，比在一长串平铺的
函数列表中做选择更容易。我们建议将每个命名空间下的函数控制在 10 个左右，
以获得最佳的 token 效率和模型性能。

保持命名空间描述简短且具有区分度。将详细的
说明放在延迟加载的工具定义中。避免把所有内容都放进一个庞大的
命名空间。

将托管工具搜索与延迟加载的工具结合使用

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

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
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时内缩减它们的
中间结果。将其用于代码可以过滤、连接、排序、去重、合并或检查大量工具的有限阶段，并在返回较小的结构化结果之前
结果给模型之前完成上述处理。
给模型之前完成上述处理。

添加该 `programmatic_tool_calling` 工具，并为每个符合条件的工具启用。使用
`allowed_callers: ["programmatic"]` 用于仅供程序使用的工具，或使用
`allowed_callers: ["direct", "programmatic"]` 当模型也可能直接调用该
工具时。当每次结果都可能改变模型的下一步决策、需要审批某项操作，或最终答案必须保留
引用或原生产物时，请保持直接调用。请记录工具的返回字段和错误行为，以便
模型可以在不先检查结果的情况下编写正确的程序。
模型可以在不先检查结果的情况下编写正确的程序。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。正确的程序
结果仍可能成为不完整的最终答案。比较任务成功率、
所需证据、总令牌数、延迟和成本，与相同的工作流
使用直接工具调用的情况进行对比。

## 使用多智能体实现并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的一项功能，它
允许一个根 智能体 将独立的工作流委派给子智能体，并对其结果进行综合
。当你可以将研究、分析或实现拆分为具体的、有边界的任务，并且这些任务
使用各自独立的上下文并行运行时，就可以使用它。

在请求中将 `multi_agent.enabled` 设置为 `true` 。对于 HTTP，使用 beta 版的
Responses SDK 并传入 `client.beta.responses` ，以启用 `responses_multi_agent=v1`
中， `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。项目模式可能更改，而
Multi-智能体 处于测试阶段。

对于短任务，首选单个 智能体，或使用有序链（每一步依赖
上一步），或写入同一可变资源的任务。子智能体可能会增加
token 使用量，因此请从默认 `max_concurrent_subagents` 值开始， `3`
并衡量端到端质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可降低 延续 开销。

在启用多智能体之前，请先了解它当前的限制：
`/responses/compact`, `reasoning.summary`，以及 `max_tool_calls` 不受
支持。服务端会自动压缩根上下文以及每个
子智能体上下文。

## 利用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自己构建每个工具，只需让模型访问这些工具
，这些工具已经可以在 Responses API 中正常工作。模型随后可以自行决定何时
使用它们。

OpenAI 不断增加更多原生工具，因此当内置工具
满足你的 工作流 时，优先从内置工具开始；当原生选项无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **工作流**: 搜索网页以获取最新信息
- **工作流**: 搜索已上传的文件或向量存储
- **代码解释器**: 运行 Python 进行分析、数学计算、绘图和文件
  处理
- **Shell**: 在托管容器或你自己的运行时中运行 shell 命令
- **Computer use**: 通过截图、点击、输入和
  滚动操作界面
- **图像生成**: 生成或编辑图像
- **MCP/connectors**: 将模型连接到外部服务和工具
- **Skills**: 附加可复用的指令包和工作流文件
- **Apply patch**: 进行结构化的代码编辑

模型质量是更倾向使用它们的另一个原因。内置工具
在我们的后训练中属于同分布，也就是说，模型围绕这些工具的形态、行为和输出进行了训练和评估。使用内置工具时，
OpenAI 模型在工具选择、执行质量和故障率方面都要优于使用新工具的情况。
该公司 models 支持更好的工具选择、更清晰的执行，以及更少的故障。
与使用新工具相比。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定了模型在多轮交互中需要向下传递哪些信息。在
长时间运行的 智能体中，核心问题不只是“我是否会触及上下文上限？”而
是旧消息、工具日志、重试记录和过时的细节会把模型所需的
状态挤占掉。

Compaction 为你提供了一种可控的方式来减小上下文规模，同时
保留后续轮次所需的状态。在完成一个重要里程碑之后，例如完成一个
调试阶段或锁定根本原因，你可以压缩之前的窗口
并从压缩后的输出继续。这会让模型保持敏锐，因为下
一轮是围绕重要状态构建的，而不是每一步中间的推理过程、
失败命令和过时的推理分支。

你可以通过两种方式使用 compaction：

- **让服务端自行处理**：如果你使用 `previous_response_id`，请开启
  `context_management` 并设置一个 `compact_threshold`。当对话过长时，服务端会自动
  对对话进行压缩。你只需持续发送最新的
  用户消息。
- **自行管理**：如果你自行管理完整的输入数组，可以调用
  `client.responses.compact()`。它会返回一个更小的上下文窗口。将该
  返回的输出直接用于下一次 `responses.create()` 调用。

**请勿编辑压缩后的输出。** 它不是人工摘要，而是帮助模型进行
延续的机器状态。请原样向前传递，然后添加下一条
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

## 优化提示词缓存

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 在请求复用相同长前缀时自动降低延迟
和成本。将稳定的指令、
示例和参考资料放在前面，后面跟上动态的、
与用户相关的内容。保持工具定义和顺序稳定，并追加新的对话
轮次，不要重写之前的上下文。

GPT-5.6 引入了显式 prompt 缓存。隐式缓存仍是
默认方式，但 GPT-5.6 及后续模型系列也支持显式
缓存断点和请求级别的缓存策略。如果易变的后缀出现在
稳定前缀之后，请在可复用的边界处添加一个显式 `prompt_cache_breakpoint` 断点。仅当请求应当
`prompt_cache_options.mode` 设置为 `explicit` 仅使用你提供的断点且不使用任何隐式断点时，才设置
该参数。之前的模型继续
只使用自动 prompt 缓存。

在 GPT-5.6 及后续模型系列上，缓存写入的成本是
未缓存输入 token 单价的 1.25×。记录 `cached_tokens` 和 `cache_write_tokens`，然后
将写入量与后续的缓存读取量进行比较，以衡量净成本并调整
断点位置。

使用稳定的 `prompt_cache_key` 用于那些共享可复用前缀的请求，以便将相关请求路由到同一个缓存中，并提升 GPT-5.6 之前模型上的缓存命中率。对于高负载组群，请遵循
帮助将相关请求路由到同一缓存，并优化缓存命中率
GPT-5.6 之前模型上的命中率。对于高负载组群，请遵循 [跨多个 key 分配流量的指南
跨更多 key 分配流量](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).

在 GPT-5.6 及更高版本上， `prompt_cache_key` 是可选的：你无需使用它也能实现最优
缓存命中率。你可以使用它来为不同的客户、用户或工作区维护独立的缓存核算，
这样便于向各方解释缓存 token 的使用与计费情况。为每个客户分配一个独立的 key，
并在该客户的相关请求中保持该 key 稳定。使用不同的 key 还能
帮助防止跨客户的缓存命中探测行为。请参阅
使用 [使用 key 进行独立的缓存核算
key](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

为某个客户维护独立的缓存核算

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

GPT-5.6 可以 [跨调用保留推理
调用](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。请在任务目标、假设和
`reasoning.context: "all_turns"` 当任务的目标、假设和
优先级保持稳定。当较早的推理不再相关、可能会使模型锚定在过时的方法上时，可使用 `current_turn` 当较早的推理不再
相关、可能会使模型锚定在过时的方法上时，可使用该字段。如果你省略
`reasoning.context` 或将其设置为 `auto`,请检查响应中的
`reasoning.context` 字段以确认实际生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在较早的推理项可用时才有效。对于已存储的响应，可使用 `previous_response_id`
。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，启用了加密推理内容即可实现无状态的
交接。

响应输出中的推理项默认包含加密的推理内容。你可以访问每个推理
项的加密推理内容，默认情况下该内容由服务端加密。你可以访问每个推理
项的 `encrypted_content` 属性。你的应用无需理解该
值，只需按原样保留每个推理项，并在下一轮发送回
，以便模型据此延续该工作流。

在无状态对话轮次之间传递加密推理内容

```javascript
import OpenAI from "openai";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";

const openai = new OpenAI();

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


## 刻意设置图像细节

在 GPT-5.6 模型上，省略图像 `detail` 和 `detail: "auto"` 使用相同的
尺寸调整行为， `original`。该服务会保留输入尺寸，
但任一边超过 65,535 像素的图像会被缩放至
符合该限制。API 会拒绝仍然超出
[30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),
的图像，而不是将其缩放以适配该上限。较大的图像可能会消耗更多输入 token，
并因此增加延迟。

根据任务 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
选择合适的设置。调整图像尺寸，当细节不重要时可使用 `low` 进行一般视觉理解，
当细节不重要时也可以使用 `high` 用于标准的高保真图像理解。对于较大、密集、对坐标敏感、OCR、定位或
`original` 需要视觉检查的任务，使用
，额外的细节可以提升质量。部署前请测量
最坏情况下的图像 token 数量和延迟。

## 发送安全标识符

如果你的应用服务于各个终端用户，请在每个请求中发送一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
以便 OpenAI 检测滥用行为，并为你的团队提供一种稳定的方式来
追踪 违反策略的情况。它还会降低某个用户的滥用行为影响整个组织访问的可能性。
disrupts access for your broader organization.

对用户的用户名或电子邮件地址进行哈希处理，而不是直接发送身份
信息。对于已登出的体验，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能需要
较长时间的请求。API 不会保持客户端连接一直打开，而是启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到任务完成、失败或被
取消。可将其用于大型分析、长时间运行的工具调用，或需要状态
和重试行为的任务。

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


你可以将其与 `stream=True` 结合使用以获取进度事件，但第一个事件
可能比普通请求耗时更长。

从 UI 的角度来看，后台模式表明：“任务正在运行；当前状态
如下；准备好后结果将显示在此处。”

## 使用 WebSocket 模式

[WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的、
大量工具调用的工作流而设计，你可以在其中保持一个持久连接开放，并通过
仅发送新的输入项来延续 `previous_response_id`。对于
包含 20 次或更多工具调用的运行，这种方式端到端速度大约快 40%
。

**工作原理**：第一条消息看起来像普通的 Responses 请求：
模型、指令、工具以及用户输入。服务端会以流式方式返回事件。如果
模型请求调用某个工具，你的应用就会执行该工具。然后，无需发起新的
HTTP 请求，你在同一 socket 上再发送一个 `response.create` 事件，其中包含
之前的 `previous_response_id` 和新的项。这就是延迟优势
的来源。在普通的 HTTP 中，每次跟进都是一次全新的请求。而在 WebSocket 模式下，
连接始终保持开放，该连接上最近一次响应的状态也保持在
内存中保持温热。当下一轮从该响应继续时，
后端需要完成的准备工作更少。

如果你的工作流是一次请求、一次回答，那么 **保持 HTTP**。如果你的
工作流 表现得像一个长时间运行的 智能体，请尝试 WebSocket 模式。

单个 WebSocket 连接一次只能处理一个进行中的响应，因此
并行任务需要多个连接。连接当前最长为 60
分钟。延续使用与 HTTP `previous_response_id` 相同的语义
模式，并对最近的响应使用连接本地缓存。

注意：WebSocket 模式可与 ZDR 配合使用，因为你的数据不会存储到磁盘，
只会存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install openai async-websocket`.

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
require "openai"
require "json"

def wait_for_response(connection)
  while (event = connection.receive)
    case event.type.to_s
    when "response.completed" then return event.response
    when "response.failed", "response.incomplete", "error"
      raise "Response failed: #{event.to_json}"
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

client = OpenAI::Client.new
Sync do |task|
  task.with_timeout(120) do
    client.responses.connect(request_options: { timeout: 10 }) do |connection|
      connection.response.create(
        stream_id: "main", model: "gpt-6-astra", store: false,
        input: [
          {
            role: "user",
            content: "Find the flaky test in this run, call the tools you need, and keep going until you can explain the root cause."
          }
        ],
        tools: [test_log_tool, code_search_tool]
      )
      puts(JSON.pretty_generate(wait_for_response(connection).output.map(&:to_h)))
    end
  end
end
```


## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基础。真正的优势在于，它让开发者从一次性的
提示转向持久、可使用工具且具备上下文感知能力的工作流，从而适应
任务的复杂性。遵循本指南，在实际
部署中实现更高的性能。