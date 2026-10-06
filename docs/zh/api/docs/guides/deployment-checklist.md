# API 部署清单

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

| 目录                                                                                                | 预期影响                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                                         | 质量、成本、延迟、可靠性 |
| [为工作负载选择模型](#choose-a-model-for-the-workload)                                     | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                                                    | 质量、成本、延迟              |
| [在对话中途更改推理强度](#change-reasoning-effort-mid-conversation)                   | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                                        | 质量、成本、延迟              |
| [设置 assistant `phase` 参数](#set-up-the-assistant-phase-parameter)                         | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                                                    | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                                         | 质量、成本、延迟              |
| [使用 Multi-智能体 处理并行工作](#use-multi-agent-for-parallel-work)                                 | 质量、成本、延迟              |
| [使用异步工具调用](#use-async-tool-calling)                                                       | 延迟                             |
| [利用内置工具](#leverage-built-in-tools)                                                     | 质量                             |
| [利用压缩](#leverage-compaction)                                                             | 成本                                |
| [优化提示缓存](#optimize-prompt-caching)                                                     | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)                                     | 质量、延迟                    |
| [有意识地设置图像细节](#set-image-detail-intentionally)                                       | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                                                   | 安全性、可靠性                 |
| [处理偏差监控](#handle-misalignment-monitoring)                                       | 安全性、可靠性                 |
| [应对流量激增和模型过载](#handle-rapid-traffic-increases-and-model-overload) | 可靠性                         |
| [使用 `background=True`](#use-backgroundtrue)                                                            | 任务连续性                     |
| [使用 WebSocket 模式](#use-websocket-mode)                                                               | 延迟                             |
| [使用中途引导](#use-mid-turn-steering)                                                         | 质量                             |

## 使用 Responses API

**始终从** 使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。开始。它是 OpenAI 的旗舰
API，也是访问最新模型行为、内置工具的最佳途径，
支持有状态工作流和 智能体 功能。

## 选择适合该工作负载的模型

评估 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
针对你的工作负载。使用 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以获得最高的
能力， [`gpt-6.1-sol`](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 用于复杂的
编码和专业工作，成本低于 Astra，并且
[`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna) 用于
高效、可重复的工作。选择在代表性任务上表现良好的模型，
而不是把每个请求都路由到能力最强的模型。

迁移到 GPT-6 时，保留你当前模型的工作负载角色和
在支持的情况下的有效推理努力度。使用 Responses API 进行带工具的推理。GPT-6 Astra 和
GPT-6.1 Sol [GPT-6.1 Sol](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol)
要求使用 Responses 进行工具调用；GPT-6 Sol 和 GPT-6 Luna 在 Chat Completions 中仅支持函数
调用，且仅在 `reasoning_effort: "none"`.
当推理努力度未设置时 `none`，时，移除 `temperature`, `top_p`，并且
`top_logprobs`；同时移除 `logprobs` 从 Chat Completions 请求和
`message.output_text.logprobs` 来自 Responses 的 `include` 数组。请检查
[数据驻留资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency)
以在选择模型或处理层级之前确认。可参阅
[模型迁移指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#migration-quickstart)
了解其他兼容性检查。在更改提示或新增能力之前，运行具有代表性的评估。
比较任务成功率、延迟、输入、输出、推理以及
缓存写入 token 数和每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 支持 `low`, `medium`,
`high`, `xhigh`，并且 `max`。GPT-6 Sol 和 GPT-6 Luna 还支持 `none`；GPT-6
Astra 和 GPT-6.1 Sol 不支持。较低的努力值速度更快，使用的
推理 token 更少。较高的努力值能让模型有更多时间进行规划、
调试、综合分析以及多步权衡。

使用 `low` ，当任务主要是抽取、路由、分类或
常规改写时。使用 `medium` 或 `high` ，当模型需要诊断
问题、比较选项、制定计划或对代码进行推理时。使用 `xhigh` 或
`max` ，仅当具有代表性的评估显示质量提升值得额外
的延迟和成本时。当从 `minimal`，或从 `none` 迁移到 GPT-6
Astra 或 GPT-6.1 Sol 时，从 `low` 开始并比较结果。否则，保留
你当前的有效 effort，并针对你的质量、延迟，
和成本目标测试变更。

对于最难的、以质量为先的工作负载，还可在相同 effort 下对比
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
标准模式的差异。推理模式与 effort 相互独立。
Pro 模式通过在返回单个最终答案之前应用更多模型工作来提升可靠性，
但会增加延迟和 token 使用量。

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


## 在对话中途更改推理努力程度

对于标准、单一智能体模式下的 GPT-6 模型，请在下一条用户消息前添加一个
[`configuration_update`](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)
输入项，以在两次响应之间调整 effort。
保持请求级别的 `reasoning.effort` 不变，使原始提示词前缀仍可被缓存命中。该更新对下一次响应生效，
前缀仍可被缓存命中。该更新对下一次响应生效，
并持续生效，直到被另一次更新覆盖。配置更新无法
与自动压缩或截断组合使用，遇到包含它们的历史会 `/responses/compact`
拒绝。若需压缩历史，请加入一条
`compaction_trigger` 项，并在之后添加一次新的更新。

## 设置 `text.verbosity`

`text.verbosity` 是平衡简洁性与完整性的主要调节手段。
当产品需要快速、紧凑的答案时使用较低的 verbosity，而当响应需要
更丰富的解释、更清晰的结构或完整上下文时，使用较高的 verbosity。
较低的 verbosity 意味着更少的输出 token，因此模型生成的内容更少、返回结果更快。
生成的内容更少，返回输出更快。

在编程场景下， `medium` 和 `high` 通常会生成更长、结构更清晰的输出
并具有更清晰的结构。 `low` 则让回答更紧凑、更精炼。

迁移时，请检查类似“保持简洁”这类笼统的指令是否仍然有帮助。
建议使用 `text.verbosity` 控制默认的详细程度，然后使用
提示词指定所需的内容、结构和长度。

提示词还会影响质量、token 使用量、成本和延迟。请参阅
[最新模型提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)
结合你的详细程度设置一起查看，包括其针对编码智能体的测试与验证
指南。

设置较低的详细程度以获得更精简的输出

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


## 设置 assistant `phase` parameter

`phase` 是对话历史中助手消息上的一个标签。它
用于向模型指示先前的助手消息是中间
的工作说明还是最终答案。使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息。使用
`phase: "final_answer"` 表示已完成的响应。

助手可能会说类似这样的话：

助手说明消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


这不是答案，而是一条进度备注。之后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具密集型工作流中非常有用，因为助手可能
在完成之前产生可见的进度更新。当你将该历史记录发回
作为后续请求时，对于 `gpt-5.3-codex` 及更高版本的模型，
**请保留并重新发送 `phase`** 助手消息上的该字段，以便模型能够区分
进度更新与最终结果。这有助于减少提前停止，使
智能体更有可能持续运行直到给出最终答案。

<a id="use-toolsearch" className="scroll-mt-[110px]"></a>

## 使用 `tool_search`

与其在每次请求时都加载完整的工具目录，不如使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` 并把开销较大的工具定义标记为
`defer_loading: true`。模型随后就可以在运行时按需加载它需要的子集。
在请求开始时，模型只能看到搜索工具的名称和说明。如果
模型判断需要某个延迟加载的工具，它会运行工具搜索，
这些延迟加载的工具定义才会被加载到上下文中。然后模型
才会调用它们。这能节省 token 并保持缓存性能。

工具搜索有两种模式：

- **Hosted tool search** 是更简单的选项。当你已经知道
  该请求可能使用哪些工具时，请使用它。
- **Client-executed tool search** 适用于你的应用必须自行决定可使用哪些工具的情形，例如基于用户租户、项目、权限，或
  基于用户租户、项目、权限，或
  内部注册表来决定可用工具。

**从 托管工具 搜索开始** 除非你的应用确实需要控制
发现过程本身。

按用户意图对工具分组。尽量使用命名空间或 MCP 服务器。这样
模型在少数清晰的分组之间进行选择，比在一长串平铺的
函数列表中挑选更容易。我们建议将每个命名空间控制在约 10 个函数以内，
以获得最佳的 token 效率和模型表现。

保持命名空间描述简短且具有区分度。将详细
说明放在延迟加载的工具定义中。避免为所有内容
使用一个庞大的命名空间。

将 托管工具 搜索与延迟加载的工具一起使用

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


## 使用程序化工具调用

[Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
让支持的模型编写 JavaScript 来调用符合条件的工具，并在托管运行时内缩减它们的中间结果。
用于代码可以过滤、连接、排序、去重、合并或检查大型工具结果的有限阶段，
然后再将较小的结构化结果返回给模型。
在将较小的结构化结果返回给模型之前。

添加该 `programmatic_tool_calling` 工具，并逐个启用符合条件的工具。使用
`allowed_callers: ["programmatic"]` 用于仅程序使用的工具，或者使用
`allowed_callers: ["direct", "programmatic"]` 当模型也可能直接调用该
工具直接调用。当每个结果都可能改变模型的下一步决策、需要批准某个操作，或者
最终答案必须保留引用或原生产物时，请保持直接调用。请记录工具返回字段和错误行为，
以便模型无需先检查结果就能编写正确的程序。
模型无需先检查结果即可编写正确的程序。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到它的输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 和最终的助手消息。正确的程序
结果仍然可能变成不完整的最终答案。将任务是否成功、
所需证据、总 token 数、延迟和成本，与使用直接工具调用的同一工作流
进行比较。

## 使用 Multi-智能体 实现并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让受支持的模型，
（包括 GPT-6 模型）将独立的工作流委托给子智能体，并
综合它们的结果。当你能够将研究、分析或实现拆分为具体的、有界的任务，使它们使用各自独立的上下文并行运行时，可以使用它。
为具体的、有界的任务，让它们使用各自独立的上下文并行运行。

在请求中将 `multi_agent.enabled` 设为 `true` 。对于 HTTP，请使用 beta 版
Responses SDK，配合 `client.beta.responses` 并传入 `responses_multi_agent=v1`
参数 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。当 Multi-智能体 处于 beta 阶段时，条目模式可能会发生变化。
Multi-智能体 处于 beta 阶段时，条目模式可能会发生变化。

对于短任务、每一步依赖上一步结果的有序链式任务，以及写入同一可变资源的工作，建议优先使用单个 智能体。子智能体会增加
令牌使用量，因此请从默认
令牌使用量，因此请从默认 `max_concurrent_subagents` 值开始 `3`
并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以降低 延续 的开销。

在启用 Multi-智能体 之前，请先了解它当前的限制：
`/responses/compact`, `reasoning.summary`，并且 `max_tool_calls` 不支持
。服务器会自动压缩根上下文以及每个
子智能体上下文。

## 使用异步工具调用

在 GPT-6 模型上，将 `async: true` 设置在某个函数或自定义工具上，这样模型在
你的应用执行该工具期间仍可继续运行。尽早启动耗时较长的工具调用，并
让模型处理独立的工作。你的应用仍然会执行并
追踪该调用，然后在后续的 Responses 请求中返回结果，并在
该请求中附带原始的 `call_id`。异步执行不适用于内置工具或
编程式工具调用。在多智能体模式下，不要将异步工具与
并行工具调用混用。参阅 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)
了解完整流程。

## 利用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自行构建每个工具，而是可以让模型使用
已经在 Responses API 中可直接运行的工具。模型随后可以自行决定何时
使用它们。

OpenAI 不断增加更多原生工具，因此当它们
符合你的 工作流 时，优先使用内置工具。当原生选项无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网络上的最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **Code interpreter**：运行 Python 进行分析、数学计算、图表和文件
  处理
- **Shell**：在托管容器或你自己的运行时中运行 shell 命令
- **Computer use**：通过截图、点击、键入和
  滚动操作 UI
- **Image generation**：生成或编辑图像
- **MCP/connectors**：将模型连接到外部服务和工具
- **Skills**：附加可复用的指令包和工作流文件
- **Apply patch**：进行结构化的代码编辑

模型质量是倾向于使用它们的另一个原因。内置工具
在我们的后训练中属于同分布，也就是说，模型的训练和评估都围绕这些工具的形态、行为和输出展开。使用内置工具时,
模型在工具选择、执行干净程度以及失败率方面都表现更优,
OpenAI 模型在工具选择、执行整洁度和失败率方面都优于使用新工具的情况。
失败率都低于使用新工具的情况。

## 利用压缩

[压缩](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定模型在多轮对话中要向前传递哪些信息。在
长时间运行的智能体中，问题不仅仅是“我是否会撞上上下文限制？”而是
旧消息、工具日志、重试和过时的细节挤占了模型所需的状态
。

压缩为你提供了一种受控方式来缩减上下文大小，同时保留
后续轮次所需的状态。在一个有意义的里程碑之后，例如完成
调试阶段或缩小根因范围，你可以压缩之前的上下文窗口，
并从压缩后的输出继续。这让模型保持敏锐，原因是
下一轮构建在重要状态之上，而不是每次中间的推理、
失败的命令和过时的推理分支。

你可以通过两种方式使用压缩：

- **让服务端处理**：如果你使用 `previous_response_id`，请开启
  `context_management` 并设置 `compact_threshold`。服务端会在对话过长时自动
  压缩对话。你只需继续发送
  最新的用户消息。
- **自行处理**：如果你自行管理完整的输入数组，请调用
  `client.responses.compact()`，它会返回一个更小的上下文窗口。在下一次
  调用中直接使用返回的 `responses.create()` 输出。

**不要编辑压缩后的输出。** 它不是人工摘要，而是帮助模型继续的机器
状态。原样向前传递，然后添加下一条
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

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 在请求复用相同的长前缀时自动降低延迟
和成本。将稳定的指令、
示例和参考资料放在前面，然后是动态的、用户相关的
内容。保持工具定义和顺序稳定，并追加新的对话
轮次，不要改写更早的上下文。

GPT-5.6 引入了显式 prompt caching。隐式缓存仍然是
默认行为，但 GPT-5.6 及更新模型系列也支持显式
缓存断点和请求级缓存策略。如果可变的后缀出现在
稳定的前缀之后，请在可复用边界处添加显式 `prompt_cache_breakpoint` 。仅在请求应当仅使用
`prompt_cache_options.mode` 设为 `explicit` 你提供的断点而不使用任何隐式断点时设置
。更早的模型继续仅使用自动 prompt caching。
自动 prompt caching。

从 GPT-5.5 或更早版本迁移时，请替换 `prompt_cache_retention` 与
`prompt_cache_options.ttl: "30m"`。请参阅 [prompt caching 模型
差异](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)
，然后再更改缓存设置。

在 GPT-5.6 及更新模型系列上，缓存写入的成本是
未缓存输入 token 费率。记录 `cached_tokens` 和 `cache_write_tokens`，然后
将写入量与后续缓存读取量进行比较，以衡量净成本并调整
断点位置。

使用稳定的 `prompt_cache_key` 用于将共享可复用前缀的请求
路由到同一缓存，以优化在
GPT-5.6 之前的模型上的缓存命中率。对于繁忙的分组，请遵循 [关于分发的指引
跨更多密钥分配流量](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).

在 GPT-5.6 及更高版本上， `prompt_cache_key` 是可选的：你可以在不使用它的前提下实现最佳的
缓存命中率。你可以使用它来为不同的客户、用户或工作区维护独立的缓存核算
，从而更容易解释每个分组的缓存令牌使用与计费
情况。为每个客户分配一个不同的 key，并
在该客户的相关请求之间保持该 key 的稳定。使用不同的 key 还能
防止跨客户探测缓存命中。参见 [使用
key 实现独立的缓存核算](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

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


<a id="use-reasoningencryptedcontent" className="scroll-mt-[110px]"></a>

## 使用 `reasoning.encrypted_content`

支持的模型（包括 GPT-6 模型）可以 [跨调用保留推理
calls](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。当任务的目标、假设和
`reasoning.context: "all_turns"` 优先级保持稳定时使用。当较早的推理不再
优先级保持稳定时使用。当较早的推理不再 `current_turn` 相关且可能将模型锚定在过时的方法上时使用。如果省略
或将其设置为
`reasoning.context` ，请检查响应的 `auto`，字段以确认实际生效的模式。
`reasoning.context` 字段以确认实际生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在存在较早的推理条目时才有效。对存储的响应使用 `previous_response_id`
。如果你的 [零数据保留
（ZDR）](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密的推理内容支持无状态的
交接。

响应输出中的推理条目默认包含加密的推理内容。
默认情况下。你可以访问每个推理项中加密的推理内容
的 `encrypted_content` 属性。你的应用不需要理解该
值。它只需按原样保留每个推理项，并在下次轮
次中发送回去，以便模型可以使用它来延续工作流。

在无状态轮次之间传递加密推理

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


## 有意识地设置图片细节

Image `detail` 默认为 `auto`,其尺寸行为取决于模型。
较大的图像会消耗更多输入 token 并增加延迟。请参阅 [尺寸表
以了解所列模型](https://developers.openai.com/api/docs/guides/images-vision#model-sizing-behavior)，并且
在部署前,使用所选模型测量图像 token 用量和限制。

为任务选择 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
,调整图像大小,在不需要精细视觉细节时使用 `low` 时使用,或在需要标准高保真图像理解时使用
时使用,或在需要标准高保真图像理解时使用 `high` 进行标准高保真图像理解。在支持的情况下,对大型、密集、对坐标敏感、OCR、
`original` 等大型、密集、对坐标敏感、OCR、
定位或视觉检查任务使用更高额分辨率,因为额外的细节能提升质量。
在部署前测量最坏情况下的图像 token 和延迟。

## 发送安全标识符

如果你的应用面向个人最终用户，请在每个请求中附带一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识符。这有助于 OpenAI 检测滥用行为，并为你的团队提供一个稳定的方式来
追踪 策略违规情况。它还能降低单个用户的滥用行为带来的
从而对更广泛的组织的访问造成干扰。

改为对用户的用户名或电子邮件地址进行哈希处理，而不是直接发送个人
信息。对于已登出体验，请使用稳定的会话 ID。

## 处理错位监控

对于 GPT-6 Astra 智能体工作流，请规划好 [失配
监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果某个请求
返回 `403` 与 `misalignment_policy_violation`，请停止为该对话分派操作，并且不要自动重试被阻止的工作流。同时也要处理
流式传输过程中的错误，并审查可能已经执行的任何操作。
订阅。
订阅 `safety.alert.created` 如果你的团队需要项目告警，
webhook 不能替代请求错误处理。请查看指南，了解哪些
Responses 请求可以被自动停止。

## 应对流量激增和模型过载

检查 HTTP 状态码并 `error.code` 再选择恢复操作。A
`429` 与 `slow_down` 表示请求速率增长过快：遵循
`Retry-After` （若存在），降低流量，然后逐步增加。A `503` 与
`server_is_overloaded` 表示请求的模型暂时过载：
遵循 `Retry-After` （若存在），然后重试。如果该 header 缺失，请以指数退避加抖动的方式增加
重试延迟，并限制重试次数。计费、额度与
配额类错误需先处理后再重试；不要将每次 `429` 视为一次
临时速率限制。参见 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits#handle-rapid-traffic-increases-and-model-overload)
和 [错误代码](https://developers.openai.com/api/docs/guides/error-codes).

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) ，用于可能耗时较长
的请求。与其保持客户端连接打开，API 会启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直至其完成、失败或被
取消。适用于大规模分析、长时间运行的工具调用，或需要状态查询
和重试行为的场景。

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


你可以将其与 `stream=True` 用于接收进度事件，但首条事件
的返回时间可能比普通请求更长。

从 UI 角度来看，后台模式表示：“正在运行；这是
当前状态；结果就绪后将在此处显示。”

## 使用 WebSocket 模式

[WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行、
工具调用密集的工作流而设计，你需要保持一个持久连接，然后
通过仅发送新的输入项和 `previous_response_id`。来继续。对于
包含 20 次或更多工具调用的工作流，我们观察到端到端执行速度最高可提升约 40%
。

**工作原理**：第一条消息看起来就像普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会以流式方式返回事件。如果
模型请求调用工具时，你的应用会运行该工具。然后，你无需发送新的
HTTP 请求，而是发送另一个 `response.create` 事件到同一个套接字，其中包含
之前的 `previous_response_id` 以及新的条目。这就是延迟优势的来源。在普通的 HTTP 中，每次后续操作都是全新的请求。而在 WebSocket 模式下，
连接保持打开状态，最新的响应状态在该连接上也保持热缓存，
连接保持打开，最新的响应状态在该连接上保持热缓存，
内存中。当下一轮从该响应继续时，服务
需要完成的准备工作更少。

如果你的工作流是一个请求、一个回答，那么 **保持 HTTP**。如果你的
工作流表现为长时间运行的智能体，请尝试 WebSocket 模式。

对同一连接上的并行对话使用不同的 `stream_id` 值；
按 `stream_id`。路由交错的事件。一个连接最多支持 16 个活跃的
响应，同一流上的请求按顺序执行。连接最长持续
60 分钟。延续使用与 `previous_response_id` HTTP 模式相同的
语义，并带有每个流中最新响应的连接本地缓存。

注意：WebSocket 模式可与 ZDR 一起使用，因为你的数据不会存储到磁盘，
仅存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install openai async-websocket`.

对于 Go，运行 `go get github.com/openai/openai-go/v3@v3.70.0`.
对于 Java，添加 Maven 依赖 `com.openai:openai-java:4.75.1`.
这些 Go 和 Java SDK 版本提供原生的 Responses WebSocket 支持。

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

```go
tools := []responses.ToolUnionParam{}
for _, name := range []string{
	"search_test_logs",
	"search_code",
} {
	tools = append(tools, responses.ToolUnionParam{
		OfFunction: &responses.FunctionToolParam{
			Name:        name,
			Description: openai.String("Search for a query."),
			Parameters: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"query": map[string]any{
						"type": "string",
					},
				},
				"required": []string{
					"query",
				},
				"additionalProperties": false,
			},
			Strict: openai.Bool(true),
		},
	})
}
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
defer cancel()
client := openai.NewClient()
conn, err := client.Responses.Connect(ctx, responses.ResponseConnectionOptions{})
if err != nil {
	log.Fatal(err)
}
defer conn.Close()
if err := conn.Create(ctx, responses.ResponsesClientEventResponseCreateParam{
	Model: "gpt-6-astra",
	Store: openai.Bool(false),
	Input: responses.ResponsesClientEventResponseCreateInputUnionParam{
		OfString: openai.String("Find the flaky test in this run, call the tools you need, and keep going until you can explain the root cause."),
	},
	Tools: tools,
}); err != nil {
	log.Fatal(err)
}
response, err := conn.FinalResponse(ctx)
if err != nil {
	log.Fatal(err)
}
if response.Status != responses.ResponseStatusCompleted {
	log.Fatalf("Response ended with status %s", response.Status)
}
output := make([]json.RawMessage, 0, len(response.Output))
for _, item := range response.Output {
	output = append(output, json.RawMessage(item.RawJSON()))
}
if err := json.NewEncoder(os.Stdout).Encode(output); err != nil {
	log.Fatal(err)
}
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.*;
import java.util.*;

var tools = new ArrayList<Tool>();
for (var name : List.of("search_test_logs", "search_code"))
  tools.add(
      Tool.ofFunction(
          FunctionTool.builder()
              .name(name)
              .description("Search for a query.")
              .strict(true)
              .parameters(
                  FunctionTool.Parameters.builder()
                      .putAdditionalProperty("type", JsonValue.from("object"))
                      .putAdditionalProperty(
                          "properties",
                          JsonValue.from(Map.of("query", Map.of("type", "string"))))
                      .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                      .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                      .build())
              .build()));

try (var conn = client.responses().connect()) {
  conn.send(
      ResponsesClientEvent.ofResponseCreate(
          ResponsesClientEvent.ResponseCreate.builder()
              .model("gpt-6-astra")
              .store(false)
              .input(
                  "Find the flaky test in this run, call the tools you need, and keep going until you can explain the root cause.")
              .tools(tools)
              .build()));
  var response = conn.finalResponse();
  if (response.status().filter(ResponseStatus.COMPLETED::equals).isEmpty())
    throw new IllegalStateException(
        "Response ended with status " + response.status().orElse(null));
  System.out.println(response.output());
}
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


## 使用中途引导

如果用户可能在 GPT-6 模型运行期间添加需求，请使用 WebSocket
连接到 Responses API。发送 `response.steer` 时附带当前活跃响应的
ID 以及 `previous_response_id` 新的用户输入。继续读取用于
该 延续 的事件； `response.steer.accepted` 表示该更新已加入队列。
转向不会改变已发送到应用或已开始撤销工具的输出。
请参阅 [mid-turn steering](https://developers.openai.com/api/docs/guides/steering) 以获得最高的
了解事件流和工具结果处理。

## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基石。其真正的优势在于，它使开发者能够从一次性的
提示转向持久、可使用工具、具备上下文感知的工作流，从而适应各种
复杂任务。请按照本指南操作，以便在实际部署中获得更出色的
性能表现。