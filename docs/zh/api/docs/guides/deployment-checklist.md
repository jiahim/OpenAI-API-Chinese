# API 部署清单

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

| 目录                                                                        | 预期影响                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                 | 质量、成本、延迟、可靠性 |
| [选择 GPT-5.6 模型](#choose-a-gpt-56-model)                                | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                            | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter) | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                            | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                 | 质量、成本、延迟              |
| [使用多智能体并行工作](#use-multi-agent-for-parallel-work)         | 质量、成本、延迟              |
| [利用内置工具](#leverage-built-in-tools)                             | 质量                             |
| [利用上下文压缩](#leverage-compaction)                                     | 成本                                |
| [使用 `prompt_cache_key`](#use-promptcachekey)                                   | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | 质量、延迟                    |
| [刻意设置图像细节](#set-image-detail-intentionally)               | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                           | 安全性、可靠性                 |
| [使用 `background=True`](#use-backgroundtrue)                                    | 可恢复性                        |
| [使用 WebSocket 模式](#use-websocket-mode)                                       | 延迟                             |

## 使用 Responses API

**始终从** 使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。开始。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具的最佳方式，
支持有状态的工作流以及 智能体 功能。

## Choose a GPT-5.6 model

选择一个 [GPT-5.6 模型](https://developers.openai.com/api/docs/guides/latest-model) 来承担该工作负载，而不是将每个请求都路由到能力最强的层级。使用
来路由每个请求。可以使用 `gpt-5.6` 或
`gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 以获得更强的性能
且价格更低，以及 `gpt-5.6-luna` 以应对高效、大规模的工作负载。

在迁移时，请保留当前模型的工作负载角色和有效的
推理力度，作为首次对比的基准。在修改
提示或新增能力之前，先运行具有代表性的评估。对比任务成功率、延迟、
输入、输出、推理和缓存写入 token，以及每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在
回答之前应该进行多少思考。

对于 GPT-5.6 模型，支持的取值包括 `none`, `low`, `medium`, `high`,
`xhigh`，以及 `max`。默认值为 `medium`。较低的值速度更快，使用
更少的推理 token。较高的值为模型提供更多时间用于规划、
调试、综合分析以及多步权衡。

使用 `low` 当任务主要是抽取、路由、分类或
简单改写时。使用 `medium` 或 `high` 当模型需要诊断
问题、对比选项、撰写方案，或对代码进行推理时。使用 `xhigh` 或
`max` 仅当具有代表性的评估显示质量收益值得额外的
延迟和成本时。从 GPT-5.5 或 GPT-5.4 迁移时，先从当前的 effort 出发，
并将同一设置与低一档的 effort 进行比较。GPT-5.6 通常能够
在使用更少推理 token 的同时保持或提升质量，因此较低的
设置也可能降低延迟和成本。

对于以质量为先的最困难工作负载，还可以比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
standard mode at the same effort. Reasoning mode and effort are independent.
Pro mode can improve reliability by applying more model work before returning a
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

`text.verbosity` is the main lever for balancing brevity against completeness.
Use lower verbosity when the product needs a quick, compact answer, and higher
verbosity when the response needs richer explanation, clearer structure, or
complete context. Lower verbosity means fewer output tokens, so the model
generates less and returns output faster.

For coding, `medium` and `high` tend to produce longer, more organized output
with clearer structure. `low` keeps the answer tighter and more minimal.

GPT-5.6 tends to be more concise by default than GPT-5.5. When migrating, check
whether broad instructions like "Be concise" still help. In some cases, they may
make responses too brief. Keep them only when they still help, and prefer using
`text.verbosity` to control the default level of detail; then use the prompt to
specify required content, structure, and a more specific length, if applicable.

使用较低的 verbosity 以获得紧凑输出

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


## 设置 assistant `phase` 参数

`phase` 是对话历史中助手消息上的一个标签。它
用于向模型指示之前的助手消息是中间
的工作评论还是最终答案。使用 `phase: "commentary"` 来表示进度
更新、调用工具前的说明以及其他中间消息。使用
`phase: "final_answer"` 表示已完成的响应。

助手可能会这样表达：

助手评论消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


那不是答案，而是一条进度说明。之后，助手可能会这样说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具密集型工作流中非常有用，因为助手可能
在完成之前会生成可见的进度更新。当你将该历史记录发回
用于后续请求时，请对 `gpt-5.3-codex` 及更高版本的模型，
**保留并重新发送 `phase`** 助手消息上的相应字段，以便模型能够区分
进度更新与最终结果。这有助于减少过早停止，使
智能体更有可能一直延续到给出最终答案为止。

## 使用 `tool_search`

不要在每次请求中都加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)：添加
`{"type": "tool_search"}` 并对开销较大的工具定义进行标记，
`defer_loading: true`。模型便可在运行时按需加载所需的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判定它需要某个延迟加载的工具，它会运行工具搜索，仅在此时
才会将这些延迟加载的工具定义加载到上下文中。只有在那之后模型才会
调用它们。这样可以节省 token 并保持缓存性能。

有两种模式：

- **托管工具搜索** 是更简单的选项。当你已知
  该请求可能使用哪些工具时，可以使用它。
- **客户端执行的工具搜索** 适用于你的应用必须自行决定可使用哪些工具的场景，例如基于用户的租户、项目、权限或
  内部注册表。
  来决定可用工具。

**从 托管工具搜索开始** 除非你的应用确实需要自行控制
发现过程。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。这样
模型在几个清晰的分组之间做出选择，比在一长串扁平的
函数列表中挑选要容易得多。我们建议每个命名空间保持在约 10 个函数以内，
以获得最佳 token 效率和模型性能。

保持命名空间描述简短且具有区分度。将详细的
说明放在延迟工具定义中。避免把所有内容放进
一个庞大的命名空间。

对延迟工具使用 托管工具搜索

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


## 使用程序化工具调用

[Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让 GPT-5.6 编写 JavaScript 来调用符合条件的工具，并在托管运行时中减少它们的中间结果。在代码可以对大型工具结果进行过滤、连接、排序、去重、合并或校验的有界阶段中使用它，然后在将较小的结构化结果返回给模型之前。
intermediate results inside a hosted runtime. Use it for bounded stages where
code can filter, join, rank, remove duplicates, combine, or check large tool
results before returning a smaller structured result to the model.

Add the `programmatic_tool_calling` tool and opt in each eligible tool. Use
`allowed_callers: ["programmatic"]` for program-only tools, or use
`allowed_callers: ["direct", "programmatic"]` when the model may also call the
tool directly. Keep calls direct when each result may change the model's next
decision, an action requires approval, or the final answer must preserve
citations or native artifacts. Document tool return fields and error behavior so
the model can write a correct program without first inspecting a result.

Your tool loop must handle `program` and `program_output` items, as well as
program-issued `function_call` items and their `function_call_output` items.
Preserve each `call_id`, and copy the function call's `caller` 到其输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。正确的程序
结果仍然可能变成不完整的最终答案。比较任务成功率、
所需的证据、总 token 数、延迟和成本与使用直接工具调用的同一 工作流
。

## 使用多智能体实现并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 是 GPT-5.6 的一项功能，
它允许根 智能体 将独立工作流委托给子智能体并整合
它们的结果。当你能够将研究、分析或实现
拆分成具体的、有边界的任务（使用各自的上下文并行运行）时，可以使用此功能。

在请求中将 `multi_agent.enabled` 设置为 `true` 。对于 HTTP，请使用 beta 版
Responses SDK 以及 `client.beta.responses` ，并传入 `responses_multi_agent=v1`
中 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。Item 结构可能会在以下情况发生变化：
Multi-智能体 处于测试阶段。

对于短任务、每一步依赖于上一步的有序链，或写入同一可变资源的工作，优先使用单个 智能体。子智能体可能会增加
token 使用量，因此从默认的
开始， `max_concurrent_subagents` 的值为 `3`
并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以减少 延续 开销。

在启用 Multi-智能体 之前，请考虑其当前的限制：
`/responses/compact`, `reasoning.summary`，以及 `max_tool_calls` 不支持
。服务端会自动压缩根上下文以及每个
子智能体上下文。

## 利用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自行构建每个工具，而是可以让模型访问那些
在 Responses API 中开箱即用的工具。模型可以自行决定何时
使用它们。

OpenAI 持续增加更多原生工具，因此当内置工具适用时，
应优先选择它们来完成你的 工作流。当原生工具无法满足任务需求时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：在网页上搜索最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **代码解释器**：运行 Python 进行分析、数学运算、绘图和文件
  处理
- **Shell**：在托管容器或你自己的运行时中运行 shell 命令
- **Computer use**：通过截图、点击、键入和
  滚动来操作 UI
- **图像生成**：生成或编辑图像
- **MCP/连接器**：将模型连接到外部服务和工具
- **Skills**：附加可复用的指令包和工作流文件
- **Apply patch**：进行结构化的代码编辑

选择内置工具还有一个模型质量层面的原因。内置工具对
我们的后训练而言属于同分布，也就是说，模型经过了相关训练，且
围绕这些工具形态、行为和输出进行评估。使用内置工具时，
OpenAI 模型能支持更优的工具选择、更干净的执行过程，以及更少的
失败，优于使用新工具时的表现。

## 利用压缩

[压缩](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定模型在多轮对话中传递哪些信息。在
长时间运行的智能体中，问题不只是“我是否会触及上下文限制？”而是
旧消息、工具日志、重试和过时的细节会挤占模型真正需要的状态空间。
模型需要。

压缩为你提供了一种可控的方式来缩减上下文大小，同时保留后续
轮次所需的状态。在完成一个有意义的里程碑之后，比如结束调试阶段或
锁定根本原因，你可以压缩先前的上下文窗口，并从压缩后的输出继续。这让模型保持敏锐，因为下一
轮是围绕重要状态构建的，而非每一段中间推理、失败的命令和过时的推理分支。
下一轮建立在重要状态之上，而不是每一段中间推理、失败的命令和过时的推理分支。
推理分支。

有两种方式可以利用压缩：

- **让服务端处理**：如果使用 `previous_response_id`，请启用
  `context_management` 使用一个 `compact_threshold`。服务端会自动
  在对话过大时对其进行压缩。你只需继续发送
  最新的用户消息。
- **自行处理**：如果由你自行管理完整的输入数组，请调用
  `client.responses.compact()`。它会返回一个较小的上下文窗口。直接将该
  返回的输出用于下一次 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人工摘要，而是帮助模型继续的机器
状态。原样向前传递，然后追加下一条
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
input = compacted.output.dup
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

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 当请求复用相同的长前缀时，可自动降低延迟
和成本。对于高吞吐量工作流，
设置
[`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-prompt_cache_key)
对共享同一稳定前缀的请求保持一致。服务
端将该 key 与提示词前缀哈希结合，以便在
不改变模型输入的情况下把相似请求路由到同一缓存。请为
真正共享的前缀保持稳定的 key，选择一个粒度以避免将过多
流量发送到单个 key，并将每个 key 各前缀上的总流量保持在
大约每分钟 15 个请求。将更高吞吐量的流量拆分到更多 key
并使用稳定的映射。

GPT-5.6 引入了显式提示词缓存。隐式缓存仍然是
默认方式，但 GPT-5.6 模型及后续模型系列也支持显式
缓存断点和请求级缓存策略。在这些模型上，设置
`prompt_cache_key` 以为隐式缓存使用更可靠的匹配
以及显式断点。如果可变后缀位于稳定前缀之后，请在可复用边界处添加
一个显式 `prompt_cache_breakpoint` 。仅当请求应当仅使用你提供的断点而不使用任何隐式断点时，才设置
`prompt_cache_options.mode` 设置为 `explicit` 仅当请求应当仅使用
你提供的断点且不使用任何隐式断点时设置。更早的模型继续
仅使用自动提示缓存。

在 GPT-5.6 及后续模型系列上，缓存写入成本为未缓存输入
令牌费率的 1.25 倍。记录 `cached_tokens` and `cache_write_tokens`，然后
将写入量与后续缓存读取量进行比较，以衡量净成本并调整键的粒度和断点位置。
粒度与断点位置。

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

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-5.6",
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
  model: "gpt-5.6",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions: instructions,
  input: "Summarize the current escalation for the on-call lead."
)

puts(response.output_text)
```


## 使用 `reasoning.encrypted_content`

GPT-5.6 可以 [在跨调用的
调用之间保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。使用
`reasoning.context: "all_turns"` 当任务的目标、假设和优先级保持稳定时，请使用
。当先前推理已不再相关时，请使用 `current_turn` 当先前的推理已不再相关
且可能将模型锚定在过时的方法上时使用。如果你省略
`reasoning.context` 或将其设置为 `auto`，检查响应的
`reasoning.context` 字段以确认实际生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在存在较早的推理条目时才有效。使用 `previous_response_id`
用于存储的响应。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，启用加密的推理内容可以实现无状态的
交接。

默认情况下，响应输出中的推理条目会包含加密的推理内容。你可以
从每个推理条目的
属性中获取加密的推理内容。你的应用无需理解该 `encrypted_content` 值。它只需按原样保留每个推理条目，并在下一
轮中将其回传，以便模型可以使用它来延续工作流。
轮中将其回传，以便模型可以使用它来延续工作流。

在无状态轮次之间传递加密推理内容

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
history.concat(first.output)
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


## 有意识地设置图像细节级别

在 GPT-5.6 模型上， `detail` and `detail: "auto"` 缺失的图像采用与
相同的尺寸行为。 `original`。服务会保留输入尺寸，
但当图像任意一边超过 65,535 像素时，会被缩放至
符合该上限。若图像在缩放后仍超过 API 的
[30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements),
，接口 会直接拒绝，
而不会调整大小以适配该上限。较大的图像可能因此占用更多的输入 token，

并带来额外延迟。请根据任务 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
选择合适的策略：调整图像大小，在对细微 `low` 视觉细节要求不高时使用低分辨率，
或在进行标准的高保真图像理解时使用 `high` 高分辨率。在处理大型、密集、
`original` 对坐标敏感、OCR、本地化或视觉检查类任务时，
可使用更高分辨率，因为额外的细节有助于提升质量。部署前，
请测量最坏情况下的图像 token 用量和延迟。

## 发送安全标识符

如果你的应用服务个人最终用户，请随每个请求一起发送一个稳定的、
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
OpenAI 检测滥用行为，并为你的团队提供一种稳定的方式来
追踪 违反策略的行为。它还能降低某个用户的滥用行为影响整个组织访问的可能性。
disrupts access for your broader organization.

对用户名或电子邮件地址进行哈希处理，而不是直接发送可识别
信息。对于已注销的体验，请使用稳定的会话 ID。

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能耗时较长的
请求。与其保持客户端连接处于打开状态，不如让 API 启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。将其用于大型分析、长时间运行的工具调用，或需要状态
和重试行为的工作负载。

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


你可以将其与 `stream=True` 结合使用来获取进度事件，但第一个事件
的耗时可能比普通请求更长。

从用户界面的角度来看，后台模式表示：“任务正在运行；这是
当前状态；准备就绪后，结果将显示在此处。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的，
、工具调用密集型的工作流而设计，你可以通过保持一个持久连接，并在
需要时仅发送新的输入项加上 `previous_response_id`。来继续。对于
包含 20 次或更多工具调用的运行，这种方式在端到端上大约快 40%
。

**工作原理**：第一条消息看起来就像一个普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会以流式方式返回事件。如果
模型请求调用某个工具时，你的应用就会运行该工具。然后，无需发送新的
HTTP 请求，你在同一连接上再发送一个 `response.create` 事件，该事件同时携带
之前的 `previous_response_id` 内容和新增的条目。这就是延迟优势
的来源。在普通 HTTP 下，每次跟进都是一次全新的请求。而在 WebSocket 模式下，
连接保持打开状态，最近一次响应的状态也会在该连接
的内存中保持热度。当下一轮从该响应继续时，
后端需要完成的准备工作会更少。

如果你的工作流只是一次请求、一个回答，那么 **保持 HTTP**。如果你的
工作流 表现得像一个长时间运行的 智能体，请尝试 WebSocket 模式。

单个 WebSocket 连接一次只能处理一个进行中的响应，因此
并行工作需要多个连接。连接目前最长为 60
分钟。延续使用与 HTTP `previous_response_id` 模式相同的
语义，并附带一个针对最近响应的连接本地缓存。

注意：WebSocket 模式可与 ZDR 配合使用，因为你的数据不会存储到磁盘，
只存储在内存中。

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

Responses API 是构建更智能、更强大的 OpenAI 应用的基础。
其真正的优势在于：让开发者从一次性的提示转向持久化、可使用工具、具有上下文感知能力的工作流，使其能够适应
实际任务。
任务的复杂度。请遵循本指南，在实际
部署中获得更佳表现。