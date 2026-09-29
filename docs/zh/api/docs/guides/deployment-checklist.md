# API 部署清单

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

| 目录                                                                                                | 预期影响                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                                         | 质量、成本、延迟、可靠性 |
| [为工作负载选择模型](#choose-a-model-for-the-workload)                                     | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                                                    | 质量、成本、延迟              |
| [在对话中途更改推理强度](#change-reasoning-effort-mid-conversation)                   | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                                        | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter)                         | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                                                    | 成本、延迟                       |
| [使用可编程工具调用](#use-programmatic-tool-calling)                                         | 质量、成本、延迟              |
| [使用多 智能体 实现并行工作](#use-multi-agent-for-parallel-work)                                 | 质量、成本、延迟              |
| [使用异步工具调用](#use-async-tool-calling)                                                       | 延迟                             |
| [利用内置工具](#leverage-built-in-tools)                                                     | 质量                             |
| [利用上下文压缩](#leverage-compaction)                                                             | 成本                                |
| [优化提示缓存](#optimize-prompt-caching)                                                     | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)                                     | 质量、延迟                    |
| [有意识地设置图像细节](#set-image-detail-intentionally)                                       | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                                                   | 安全、可靠性                 |
| [处理目标偏差监控](#handle-misalignment-monitoring)                                       | 安全、可靠性                 |
| [应对流量激增与模型过载](#handle-rapid-traffic-increases-and-model-overload) | 可靠性                         |
| [使用 `background=True`](#use-backgroundtrue)                                                            | 任务延续                     |
| [使用 WebSocket 模式](#use-websocket-mode)                                                               | 延迟                             |
| [使用回合中途引导](#use-mid-turn-steering)                                                         | 质量                             |

## 使用 Responses API

**始终从** 开始使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。入手。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具、有状态工作流以及智能体功能的最佳选择，
它支持状态化的 智能体 能力。

## 为该工作负载选择模型

评估 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
以适配你的工作负载。使用 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以获得最高能力，使用
用于以低于 Astra 的成本完成复杂编码与专业工作，使用， [`gpt-6.1-sol`](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 用于复杂
编码与专业工作，成本低于 Astra，并使用
[`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna) 用于
高效、可重复的工作。选择在代表性任务上表现良好的模型，而不是将每个请求都路由到能力最强的模型。
。

迁移到 GPT-6 时，请保留当前模型的工作负载角色，并在受支持的情况下保留有效的推理强度。使用 Responses API 进行带工具的推理。GPT-6 Astra 和
迁移到 GPT-6 时，请保留当前模型的工作负载角色以及受支持的有效推理强度。使用 响应接口 进行带工具的推理。
GPT-6 Astra 和 [GPT-6.1 Sol](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol)
要求使用 Responses 进行工具调用；GPT-6 Sol 和 GPT-6 Luna 仅在 Chat Completions 中支持函数调用，且需要
支持。 `reasoning_effort: "none"`.
当推理强度未设置 `none`，时，请移除 `temperature`, `top_p`，以及
`top_logprobs`；同时移除 `logprobs` 来自 Chat Completions 请求以及
`message.output_text.logprobs` 来自 Responses `include` 数组。检查
[数据驻留资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency)
在选择模型或处理层级之前。参阅
[模型迁移指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#migration-quickstart)
了解其他兼容性检查。在更改提示或添加新的
能力之前运行具有代表性的评估。对比任务成功率、延迟、输入、输出、推理以及
缓存写入 token，以及每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 支持 `low`, `medium`,
`high`, `xhigh`，以及 `max`。GPT-6 Sol 和 GPT-6 Luna 也支持 `none`；GPT-6
Astra 和 GPT-6.1 Sol 不支持。较低的 effort 速度更快，使用的
推理 tokens 更少。较高的 effort 为模型提供更多时间进行规划、
调试、合成和多步权衡。

使用 `low` 用于任务主要是提取、路由、分类或
常规改写时。使用 `medium` 或 `high` 用于模型需要诊断
问题、比较选项、制定计划或推理代码时。使用 `xhigh` 或
`max` 仅当代表性评估显示质量提升值得额外的
延迟和成本时。从 `minimal`，或从 `none` 迁移到 GPT-6
Astra 或 GPT-6.1 Sol 时，从 `low` 开始并比较结果。否则，保留
你当前的实际投入度，并针对你的质量、延迟，
和成本目标测试变更。

对于最困难的、质量优先的工作负载，还可以比较
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
相同投入度下的标准模式。推理模式和投入度彼此独立。
Pro 模式可以通过在返回单一最终答案之前应用更多模型工作来提升可靠性，
但会增加延迟和 token 用量。

针对任务调整推理投入度

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


## 在对话过程中更改推理力度

对于处于标准、单智能体模式的 GPT-6 模型，请在下一条用户消息之前添加一个
[`configuration_update`](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)
输入项，以在两次响应之间调整 effort。
保持请求级别的 `reasoning.effort` 不变，以便原始提示
前缀仍然有资格被缓存。该更新会作用于下一次响应
，并一直持续，直到被另一次更新覆盖。配置更新无法
与自动压缩或截断组合使用，且 `/responses/compact`
会拒绝包含它们的历史记录。若要压缩历史记录，请包含一个
`compaction_trigger` 项，然后在之后添加一次新的更新。

## 设置 `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间进行平衡的主要调节手段。
当产品需要快速、紧凑的答案时，使用较低的 verbosity；而当响应需要更丰富的解释、更清晰的结构或
完整的上下文时，使用较高的 verbosity。较低的 verbosity 意味着输出 token 更少，因此模型
生成的内容更少，返回结果也更快。
生成的内容更少并更快地返回输出。

对于编码场景， `medium` 和 `high` 往往会产生更长、结构更清晰的输出
，并具备更清晰的结构。 `low` 则会让答案更紧凑、更精简。

在迁移时，请检查诸如“Be concise”这类笼统指令是否仍然有帮助。
建议优先使用 `text.verbosity` 来控制默认的详细程度,然后使用
提示词来指定所需的内容、结构和长度。

提示词还会影响质量、token 用量、成本和延迟。请参阅
[最新模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)
中的内容,结合你的详细程度设置一起使用,其中也包括针对编码
智能体的测试与验证指导。智能体。

设置较低的详细程度以获得简洁输出

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
用于向模型指示先前的助手消息是中间
工作性的评论还是最终答案。请使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息。请使用
`phase: "final_answer"` 表示已完成响应。

助手可能会这样说：

助手评论消息

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


这不是最终答案，而是一条进度说明。随后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具调用密集的工作流中非常有用，因为助手可能
会在完成之前产生可见的进度更新。当你将该历史
连同后续请求一起发回 `gpt-5.3-codex` 及后续模型时，
**请保留并在助手消息上重新发送 `phase`** ，以便模型能够区分
进度更新与最终结果。这有助于减少提前停止，使
智能体更有可能一直延续到给出最终答案。

<a id="use-toolsearch" className="scroll-mt-[110px]"></a>

## 使用 `tool_search`

不要在每个请求中加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` 并使用
`defer_loading: true`。标记开销较大的工具定义。然后模型可以在运行时按需加载所需子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型决定需要某个延迟加载工具，它会运行工具搜索，只有在此之后
这些延迟加载的工具定义才会被加载到上下文中。模型也只会在此之后
调用它们。这样既节省了 token，又保留了缓存性能。

工具搜索有两种模式：

- **托管工具搜索** 是更简单的选项。当你已知请求可能用到哪些工具时，使用它。
  哪些工具可以用于该请求。
- **客户端执行的工具搜索** 适用于你的应用必须自行决定可用工具的
  情况，例如基于用户的租户、项目、权限或
  内部注册表。

**从 托管工具 搜索开始** 除非你的应用确实需要自行控制
发现流程本身。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。这样模型
在几个清晰的分组之间做出选择比在一长串扁平化的函数列表中选择更容易，
我们建议将每个命名空间控制在约 10 个函数以内，以获得最佳的 token 效率和模型表现。
以达到最佳的 token 效率和模型性能。

保持命名空间描述简短且有区分度。把详细的
说明放在延迟工具的定义中。避免为所有内容创建
一个庞大的命名空间。

结合延迟工具使用 托管工具 搜索

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
让受支持的模型编写调用符合条件的工具的 JavaScript，并在托管运行时中缩减它们的中间结果。可用于在返回更小的结构化结果给模型之前，用代码对大型工具结果进行过滤、连接、排序、去重、合并或校验的有限阶段。
它们的中间结果会保留在托管运行时中。适用于需要在将更小的结构化结果返回给模型之前，用代码对大型工具结果进行过滤、连接、排序、去重、合并或校验的有界阶段。
结果。
在将更小的结构化结果返回给模型之前，可以用代码对大型工具结果进行过滤、连接、排序、去重、合并或校验。

添加该 `programmatic_tool_calling` 工具，并为每个符合条件的工具启用。可用于仅限程序的工具，或在模型也可能直接调用
`allowed_callers: ["programmatic"]` 仅供程序使用的工具，或在模型也可能直接调用该工具时使用
`allowed_callers: ["direct", "programmatic"]` 当模型也可能直接调用该工具时使用
工具时使用。当每个结果都可能改变模型的下一个决策、需要用户批准某个操作，或者最终答案必须保留
引文或原生工件时，请保持直接调用。
或原生工件时，请保持直接调用。
以便模型能够在不先检查结果的情况下编写正确的程序。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到其输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。正确的程序
结果仍然可能变成不完整的最终答案。将任务完成情况、
所需的证据、总 token 数、延迟和成本与相同的 工作流 进行对比
使用直接工具调用。

## 使用 Multi-智能体 并行处理工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让受支持的模型，
（包括 GPT-6 模型）能够把独立的工作流委托给子智能体
并汇总它们的结果。当你需要把研究、分析或实现拆分成具体
的、有边界的任务，且这些任务各自使用独立的上下文并行执行时，可以使用它。

在请求中 `multi_agent.enabled` 设置 `true` 。对于 HTTP，请使用 beta 版的
Responses SDK，传入 `client.beta.responses` ，并在 `responses_multi_agent=v1`
中传入 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。Multi-智能体 处于 beta 阶段时，item schema 可能会发生变化。
Multi-智能体 处于 beta 阶段时，item schema 可能会发生变化。

对于短任务、各步骤依赖前一步结果的有序链路，或者写入同一可变资源的工作，建议使用单个 智能体。子智能体会增
加 token 消耗，因此请从默认
值开始，并衡量端到端的质量、延迟和成本。 `max_concurrent_subagents` 的默认值为 `3`
，并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以降低 延续 开销。

在启用 Multi-智能体 之前，请先考虑其当前的限制：
`/responses/compact`, `reasoning.summary`，以及 `max_tool_calls` 不受支持
。服务器会自动压缩根上下文和每个
子智能体上下文。

## 使用异步工具调用

在 GPT-6 模型上，设置 `async: true` 在函数或自定义工具上，当模型
可以在你的应用运行它的同时继续工作时。尽早启动慢速工具调用，并
让模型处理独立工作。你的应用仍然会执行并
追踪该调用，然后在后续 Responses 请求中通过
original `call_id`。返回结果。异步执行不适用于内置工具或
编程工具调用。在多智能体模式下，请勿将异步工具与
并行工具调用结合使用。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)
了解完整流程。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自行构建每个工具，只需让模型访问那些
已在 Responses API 中可直接使用的工具即可。模型随后可以自行决定何时
调用它们。

OpenAI 持续新增更多原生工具，因此当内置工具
契合你的 工作流 时，优先使用内置工具。当原生工具无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网页以获取最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **代码解释器**：运行 Python 进行分析、数学计算、图表和文件
  处理
- **Shell**：在托管容器或你自己的运行时中执行 shell 命令
- **计算机使用**：通过截图、点击、键入和
  滚动操作界面
- **图像生成**：生成或编辑图像
- **MCP/连接器**：将模型连接到外部服务和工具
- **技能**：附加可复用的指令包和工作流文件
- **应用补丁**：进行结构化代码编辑

模型质量是优先选择它们的另一个原因。内置工具
属于我们后训练的数据分布之内，也就是说，模型围绕这些工具的形态、行为和输出进行训练
和评估。使用内置工具时，
OpenAI 模型能够更好地选择工具、执行更干净，并且相比使用新工具时
出现更少的失败。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定模型在多轮对话中带哪些信息继续。在
长时间运行的智能体中，问题不仅仅是“我会不会撞上上下文窗口上限？”而是
旧消息、工具日志、重试和过期的细节会把模型真正
需要的状态挤掉。

Compaction 提供了一种受控的方式来缩减上下文大小，同时
保留后续轮次所需的信息。在完成一个有意义的关键节点之后——比如
调试阶段结束或定位到根因——你可以对先前的窗口进行压缩
，然后从压缩后的输出继续。这能让模型保持敏锐，因为
下一轮是基于关键状态构建的，而不是每一步推理、
失败的命令和过时的推理分支。

你可以通过两种方式使用 compaction：

- **让服务器来处理**：如果你使用 `previous_response_id`，请启用
  `context_management` 并设置一个 `compact_threshold`。服务器会自动
  在对话过长时进行压缩。你只需要继续发送
  最新的用户消息。
- **自行处理**：如果你自己管理完整的输入数组，可以调用
  `client.responses.compact()`，它会返回一个更小的上下文窗口。将返回的
  输出直接用于下一次 `responses.create()` 调用。

**请勿编辑压缩后的输出。** 它不是人类摘要，而是用于帮助模型进行
延续的机器状态。请将其原样前传，然后附加下一条
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

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 在请求复用相同的长前缀时会自动降低延迟
和成本。将稳定的指令、
示例和参考资料放在前面,后面再跟上动态的、针对用户的内容
。保持工具定义和顺序稳定,并在末尾追加新的对话
轮次,不要重写之前的上下文。

GPT-5.6 引入了显式提示缓存。隐式缓存仍然是
默认方式,但 GPT-5.6 及以后的模型系列也支持显式
缓存断点和请求级缓存策略。如果存在变化的后缀
位于稳定前缀之后,请在可复用的边界处添加显式 `prompt_cache_breakpoint` 在可复用的边界处设置。
`prompt_cache_options.mode` 设置 `explicit` 仅当请求只应使用你提供的断点、不使用任何隐式断点时,才进行设置。早期模型继续
的断点而不使用任何隐式断点时,才进行设置。早期模型继续
仅使用自动提示缓存。

从 GPT-5.5 或更早版本迁移时,请替换 `prompt_cache_retention` 与
`prompt_cache_options.ttl: "30m"`,然后参见 [提示缓存模型
差异](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)
后再更改缓存设置。

在 GPT-5.6 及以后的模型系列上,缓存写入的成本是
未缓存输入 token 费率。记录 `cached_tokens` 和 `cache_write_tokens`，然后
将写入量与后续的缓存读取量进行比较，以衡量净成本并优化
断点位置。

对共享可复用前缀的请求使用稳定的 `prompt_cache_key` ，以帮助将相关请求路由到同一缓存，并优化
GPT-5.6 之前的模型上的缓存命中率。对于请求量较大的分组，请遵循
模型上的缓存命中率。对于请求量较大的分组，请遵循将流量分散到更多 key 的 [指导
。](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).

在 GPT-5.6 及更高版本上， `prompt_cache_key` 是可选的：即使不使用它，你也可以实现最佳
缓存命中率。你可以使用它来为不同客户、用户或工作区维护独立的缓存核算。
这样可以更轻松地解释每个分组的已缓存 token 用量和计费情况。
为每个客户分配一个唯一的 key，并在该客户的所有相关请求中保持其稳定。
独立的 key 也有助于防止跨客户的缓存命中探测。请参阅
。 [使用
key 进行独立的缓存核算](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

为客户维护独立的缓存核算

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
calls](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。当任务的
`reasoning.context: "all_turns"` 目标、假设和优先级保持稳定时，使用
。当此前的推理已不再 `current_turn` 相关，并可能使模型锚定于过时方法时，使用
。如果省略
`reasoning.context` 或将其设置为 `auto`，请检查响应的
`reasoning.context` 字段以确认生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在存在较早的推理项时才有效。请使用 `previous_response_id`
来存储响应。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，加密的推理内容可实现无状态的
交接。

响应输出中的推理项默认包含加密的推理内容。
默认值。你可以从每个推理
项的 `encrypted_content` 属性中访问加密的推理内容。你的应用无需理解该
值。它只需按原样保留每个推理项，并在下一轮中将其回传，
以便模型可以基于它继续 工作流。

在无状态对话轮次之间传递加密推理

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


## 有意设置图片详细程度

Image `detail` 默认为 `auto`,其尺寸行为取决于模型。
较大的图像会消耗更多输入 token 并增加延迟。请参阅 [尺寸表
以查看所列模型的信息](https://developers.openai.com/api/docs/guides/images-vision#model-sizing-behavior)，以及
在部署前使用所选模型测量图像 token 消耗量和限制。

选择 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
以适配任务。调整图像大小,在不需要 `low` 精细视觉细节时使用
,或者使用 `high` 进行标准的高保真图像理解。在支持的情况下,使用
`original` 处理大型、密集、对坐标敏感、OCR、
本地化或视觉检查等任务,因为额外的细节可以提升质量。
在部署前测量最坏情况下的图像 token 消耗和延迟。

## 发送安全标识符

如果你的应用面向各个最终用户，请在每次请求中发送一个稳定的，
隐私保护
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
。这有助于 OpenAI 检测滥用行为，并为你的团队提供一种稳定的方式来
对 追踪 的行为进行追踪，同时也能降低单个用户的滥用行为
影响更广泛组织访问的可能性。

请对用户的用户名或电子邮件地址进行哈希处理，而不是直接发送可识别
的信息。对于已登出的体验，请使用稳定的会话 ID。

## 处理偏差监测

对于 GPT-6 Astra 的智能体智能体工作流，请规划 [misalignment
监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果某个请求
返回 `403` 与 `misalignment_policy_violation`，请停止为该会话分发操作，
并且不要自动重试被拦截的工作流工作流。同时处理
流式传输期间的错误，并审查可能已经执行的任何操作。
订阅 `safety.alert.created` ，如果你的团队需要项目警报；该
webhook 不能替代请求错误处理。请查阅指南，了解哪些
Responses 请求可以自动停止。

## 应对流量激增与模型过载

检查 HTTP 状态和 `error.code` 后再选择恢复操作。A
`429` 与 `slow_down` 表示请求速率上升过快：请遵循
`Retry-After` （若存在），降低流量，然后逐步增加。A `503` 与
`server_is_overloaded` 表示所请求的模型暂时过载：
遵循 `Retry-After` （若存在），然后重试。如果该头部缺失，
请以指数退避加抖动的方式增加重试间隔并限制重试次数。计费、额度和
配额错误需要在重试前处理；不要将每个 `429` 都视为
临时速率限制。参见 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits#handle-rapid-traffic-increases-and-model-overload)
和 [错误码](https://developers.openai.com/api/docs/guides/error-codes).

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能耗时较长的请求。API 不会保持客户端连接
一直打开，而是启动一个任务并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。适用于大规模分析、长时间运行的工具调用或需要状态和重试行为的工作。
取消。适用于大规模分析、长时间运行的工具调用或需要状态
和重试行为的工作。

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


你可以将其与 `stream=True` 用于进度事件，但首个事件
的耗时可能比普通请求更长。

从 UI 角度来看，后台模式表示：“正在运行；这是
状态；结果准备好后会显示在这里。”

## 使用 WebSocket 模式

[WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的，
工具调用密集型工作流而设计，你可以保持一个持久连接并
通过仅发送新的输入项以及 `previous_response_id`。来继续。对于
workflows with 20 or more tool calls, we have seen up to roughly 40% faster
end-to-end execution.

**How this works**: The first message will look like a normal Responses request:
model, instructions, tools, and user input. The server streams events back. If
模型请求调用工具时，你的应用会运行该工具。随后，无需再发起新的
HTTP 请求，你只需在同一 socket 上再发送一个 `response.create` 事件，其中包含
先前的 `previous_response_id` 以及新增的条目。延迟优势正来源于此。
来自哪里。在普通 HTTP 中，每次后续请求都是一次全新的请求。在 WebSocket 模式下，
连接保持打开状态，最近一次响应的状态在该连接上保持热缓存，
保存在内存中。当下一轮对话从该响应继续时，
服务需要做的准备工作更少。

如果你的工作流是一问一答的形式，那么 **保持 HTTP**。如果你的
工作流 表现得像长时间运行的智能体，可以尝试使用 WebSocket 模式。

使用不同的 `stream_id` 值来处理同一连接上的并发会话；
按以下方式路由交错的事件 `stream_id`。一个连接最多支持 16 个并发的
响应，而同一流上的请求会按顺序执行。连接最长持续
60 分钟。延续使用与 `previous_response_id` 相同的语义
HTTP 模式，并为每个流中的最新响应提供本地缓存。

注意：WebSocket 模式可与 ZDR 配合使用，因为你的数据不会被存储到磁盘，
只会存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install openai async-websocket`.

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
连接到 Responses API。发送 `response.steer` 时附带当前响应的
ID 以及 `previous_response_id` 新的用户输入。继续读取事件以获取
延续； `response.steer.accepted` 表示该更新已排队。
Steering 不会改变已发送到你的应用的输出，也不会撤销已
启动的工具。请参阅 [mid-turn steering](https://developers.openai.com/api/docs/guides/steering) 以获得最高能力，使用
了解事件流和工具结果的处理方式。

## 总结要点

Responses API 是构建更智能、更强大的 OpenAI 应用的基础。
它真正的优势在于让开发者从一次性提示转向持久、可使用工具、具备上下文感知的工作流，这些工作流能够适应
不同场景的需求。
任务的复杂度。请遵循本指南，在实际
部署中取得更高性能。