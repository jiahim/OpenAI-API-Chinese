# API 部署清单

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾添加 `.md` 。

| 目录                                                                                                | 预期影响                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                                         | 质量、成本、延迟、可靠性 |
| [为工作负载选择模型](#choose-a-model-for-the-workload)                                     | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                                                    | 质量、成本、延迟              |
| [在对话中途更改推理工作量](#change-reasoning-effort-mid-conversation)                   | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                                        | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter)                         | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                                                    | 成本、延迟                       |
| [使用可编程工具调用](#use-programmatic-tool-calling)                                         | 质量、成本、延迟              |
| [使用多 智能体 处理并行工作](#use-multi-agent-for-parallel-work)                                 | 质量、成本、延迟              |
| [使用异步工具调用](#use-async-tool-calling)                                                       | 延迟                             |
| [利用内置工具](#leverage-built-in-tools)                                                     | 质量                             |
| [利用上下文压缩](#leverage-compaction)                                                             | 成本                                |
| [优化提示词缓存](#optimize-prompt-caching)                                                     | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)                                     | 质量、延迟                    |
| [有意识地设置图像细节](#set-image-detail-intentionally)                                       | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                                                   | 安全性、可靠性                 |
| [处理偏差监控](#handle-misalignment-monitoring)                                       | 安全性、可靠性                 |
| [应对流量激增和模型过载](#handle-rapid-traffic-increases-and-model-overload) | 可靠性                         |
| [使用 `background=True`](#use-backgroundtrue)                                                            | 任务延续                     |
| [使用 WebSocket 模式](#use-websocket-mode)                                                               | 延迟                             |
| [使用回合中途引导](#use-mid-turn-steering)                                                         | 质量                             |

## 使用 Responses API

**始终从** 使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。开始。它是 OpenAI 的旗舰
API，是访问最新模型行为、内置工具、
有状态工作流和智能体功能的最佳选择。

## 为工作负载选择模型

评估 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
针对你的工作负载。使用 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 获得最高的
能力， [`gpt-6.1-sol`](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 用于复杂的
编码和专业工作，成本低于 Astra，以及
[`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna) 用于
高效、可重复的工作。选择在代表性任务上表现良好的模型，
而不是将每个请求都路由到能力最强的模型。

在迁移到 GPT-6 时，保留你当前模型的工作负载角色和
有效的推理投入（如支持）。使用 Responses API 进行带工具的推理。
GPT-6 Astra 和 [GPT-6.1 Sol](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol)
要求使用 Responses 进行工具调用；GPT-6 Sol 和 GPT-6 Luna 仅在 Chat Completions 中支持函数
调用，配合 `reasoning_effort: "none"`.
当推理投入未 `none`，指定时，移除 `temperature`, `top_p`，以及
`top_logprobs`；同时移除 `logprobs` 来自 Chat Completions 请求以及
`message.output_text.logprobs` 来自 Responses `include` 数组。请查看
[数据驻留资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency)
后再选择模型或处理层级。参阅
[模型迁移指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#migration-quickstart)
以进行其他兼容性检查。在更改提示或添加新
能力之前，运行具有代表性的评估。比较任务成功率、延迟、输入、输出、推理与
缓存写入 token 数，以及每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答之前应进行多少思考
。

GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 支持 `low`, `medium`,
`high`, `xhigh`，以及 `max`。GPT-6 Sol 和 GPT-6 Luna 还支持 `none`；GPT-6
Astra 和 GPT-6.1 Sol 则不支持。较低的 effort 更快且使用的
推理 token 更少。较高的 effort 会给模型更多时间进行规划、
调试、综合以及多步权衡。

使用 `low` 当任务主要是抽取、路由、分类或
常规改写时。使用 `medium` 或 `high` 当模型需要诊断
问题、比较方案、编写计划或对代码进行推理时。使用 `xhigh` 或
`max` 仅当具有代表性的评估表明质量提升值得
额外的延迟和成本时。从 `minimal`，或从 `none` 迁移到 GPT-6
Astra 或 GPT-6.1 Sol 时，从 `low` 开始并比较结果。否则，保留
你当前的有效投入度，并针对你的质量、延迟，
和成本目标测试变更效果。

对于最困难的、质量优先型工作负载，还应将推理模式
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
相同投入度下的标准模式进行比较。推理模式和投入度彼此独立。
Pro 模式通过在返回单个最终答案前应用更多的模型工作来提升可靠性，
但会增加延迟和令牌用量。

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


## 在对话中途更改推理努力程度

对于处于标准单智能体模式的 GPT-6 模型，在下一条用户消息之前添加一个
[`configuration_update`](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)
输入项，以在两次响应之间更改 effort。
保持请求级别的 `reasoning.effort` 不变，以便原始提示前缀仍然符合缓存条件。此次更新将应用于下一次响应
前缀仍然符合缓存条件。此次更新将应用于下一次响应
并持续生效，直到被另一次更新覆盖。配置更新无法
与自动压缩或截断组合使用，并 `/responses/compact`
拒绝包含它们的历史记录。若要压缩历史记录，请添加一个
`compaction_trigger` 项，并在其后添加新的更新。

## 设置 `text.verbosity`

`text.verbosity` 是在简洁性和完整性之间进行平衡的主要手段。
当产品需要快速、紧凑的答案时，使用较低的 verbosity；当响应需要更丰富的解释、
更清晰的结构时，使用较高的 verbosity；当响应需要更丰富的解释、
完整的上下文时，使用较高的 verbosity。较低的 verbosity 意味着更少的输出 token，因此模型
生成的内容更少，输出返回更快。

对于编码任务， `medium` 和 `high` 往往会产生更长、更有组织的输出
且结构更清晰。 `low` 则保持答案更紧凑、更精简。

迁移时，请检查类似“简洁明了”这样的宽泛指令是否仍然有帮助。
优先使用 `text.verbosity` 来控制默认的详细程度，然后使用
提示来指定所需的内容、结构和长度。

提示还会影响质量、token 使用量、成本和延迟。请结合你的详细程度设置查看
[最新模型的提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)
，包括其针对编码 智能体 的测试与验证指南。
guidance for coding 智能体.

为精简输出设置较低的详细程度

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

`phase` 是会话历史中助手消息上的一个标签。它
向模型表明此前的助手消息是中间
工作评论还是最终答案。请使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息；使用
`phase: "final_answer"` 表示已完成的响应。

助手可能会这样说：

助手评论消息

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


在长时间运行或大量调用工具的工作流中这非常有用，因为助手可能
在完成之前会产生可见的进度更新。当你将该历史
随后续请求一同传回给 `gpt-5.3-codex` 及更高版本模型时，
**请保留并在助手消息上重新发送 `phase`** ，以便模型能够区分
进度更新和最终结果。这有助于减少提前停止，使
智能体更有可能一直继续直到给出最终答案。

<a id="use-toolsearch" className="scroll-mt-[110px]"></a>

## 使用 `tool_search`

不要在每个请求中都加载完整的工具目录，而是使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search): 添加
`{"type": "tool_search"}` 并将开销较大的工具定义标记为
`defer_loading: true`。模型就可以在运行时按需加载它所需的子集。
在请求开始时，模型只能看到搜索工具的名称和说明。如果
模型判定它需要一个延迟加载的工具，它就会运行工具搜索，只有在那时
那些延迟工具的定义才会被加载到上下文中。也只有在那时模型才会
调用它们。这可以节省 token 并保持缓存性能。

工具搜索有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  哪些工具可能可用于该请求时，可以使用它。
- **客户端执行的工具搜索** 适用于你的应用需要自行决定可用工具
  的情况，例如根据用户的租户、项目、权限或
  内部注册表来决定。

**从 托管工具搜索开始** 除非你的应用确实需要自己控制
发现过程。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。这
样模型在几个清晰的分组之间做选择，比在一长串扁平的
函数列表中更容易选择。我们建议每个命名空间下的函数数量控制在 10 个左右
以获得最佳的 token 效率和模型性能。

保持命名空间描述简短且有区分度。将详细的
说明放在延迟加载的工具定义中。避免创建一个大而全的
命名空间来涵盖所有内容。

将 托管工具搜索与延迟加载的工具一起使用

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
让支持的模型编写调用符合条件的工具的 JavaScript，并在托管运行时中归约
它们的中间结果。可用于以下有界的阶段：在将较小
的结构化结果返回给模型之前，代码可以过滤、连接、排序、去重、合并或检查大量工具
结果。

添加该 `programmatic_tool_calling` 工具并为每个符合条件的工具选择启用。对于
`allowed_callers: ["programmatic"]` 仅限程序的工具，可使用
`allowed_callers: ["direct", "programmatic"]` ；当模型也可能直接调用该
工具时，可使用。当每个结果都可能改变模型的下一步
决策、需要审批某个操作，或者最终答案必须保留
引用或原生产物时，请保持直接调用。请记录工具返回字段和错误行为，以便
模型能够在不先检查结果的情况下编写正确的程序。

你的工具循环必须处理 `program` 和 `program_output` 项，以及
程序发出的 `function_call` 项及其 `function_call_output` 项。
保留每个 `call_id`，并复制函数调用的 `caller` 到它的输出中，以便
服务可以恢复正确的程序。

同时测试 `program_output` 和最终的助手消息。正确的程序
结果仍然可能变成不完整的最终答案。比较任务是否成功、
所需的证据、总 token 数、延迟和成本，与使用直接工具调用的同一工作流进行对比
直接工具调用。

## 使用 Multi-智能体 并行处理工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让受支持的模型，
（包括 GPT-6 模型）将独立的工作流委托给子智能体，并
综合它们的结果。当你能够将研究、分析或实现拆分为具体的、
有明确边界的任务，分别使用独立的上下文并并行执行时，可使用它。

在请求中将 `multi_agent.enabled` 设置为 `true` 。对于 HTTP，请使用 beta 版
Responses SDK 并 `client.beta.responses` 传入 `responses_multi_agent=v1`
参数。 `betas`。对于原始 HTTP 或 WebSocket 连接，请发送
`OpenAI-Beta: responses_multi_agent=v1`。当 Multi-智能体 处于 beta 阶段时，
Item 结构可能会发生变化。

对于短任务、各步骤依赖上一步结果的有序链，或写入同一可变资源的
工作，请优先使用单个 智能体。子智能体可能会增加
token 用量，因此请从默认 `max_concurrent_subagents` 值 `3`
开始，并衡量端到端质量、延迟和成本。对于工具调用密集或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以减少 延续 开销。

在启用多智能体之前，请注意它当前的限制：
`/responses/compact`, `reasoning.summary`，以及 `max_tool_calls` 不支持
。服务端会自动压缩根上下文以及每个子
智能体上下文。

## 使用异步工具调用

在 GPT-6 模型上，设置 `async: true` 为函数或自定义工具，以允许模型
在你的应用程序执行该工具时持续工作。尽早启动慢速工具调用，并
让模型处理独立的工作。你的应用仍然会执行并
追踪该调用，然后在后续的 Responses 请求中使用相同的
original `call_id`。返回结果。异步执行不适用于内置工具或
程序化工具调用。在多智能体模式下，不要将异步工具与
并行工具调用结合使用。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)
了解完整流程。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
你无需自己构建每个工具，而是可以让模型访问那些
已经在 Responses API 中可用的工具。模型随后可以自行决定何时
使用它们。

OpenAI 不断推出更多原生工具，因此在适用时优先从内置工具开始，
以契合你的 工作流。当原生工具无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：搜索网页以获取最新信息
- **文件搜索**：搜索已上传的文件或向量存储
- **Code interpreter**：运行 Python 进行分析、数学计算、绘图和文件
  处理
- **Shell**：在托管容器或你自己的运行时中运行 shell 命令
- **Computer use**：通过截图、点击、输入和
  滚动操作界面
- **Image generation**：生成或编辑图像
- **MCP/connectors**：将模型连接到外部服务和工具
- **Skills**：附加可复用的指令包和工作流文件
- **Apply patch**：进行结构化的代码编辑

模型质量是优先选择它们的另一个原因。内置工具
在我们的后训练中属于同分布，也就是说模型围绕这些工具的形态、行为和输出进行训练与评估。使用内置工具时，
OpenAI 模型能够实现更好的工具选择、更干净的执行以及更少的，
该公司 模型能够实现更好的工具选择、更干净的执行以及更少的
失败情况，相比使用新工具时效果更佳。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具：它
决定模型在多个对话轮次中向前传递哪些信息。在
长时间运行的 智能体 中，问题不仅仅是“我是否会触及上下文限制？”而
是旧消息、工具日志、重试以及过时的细节会把模型所需的
状态挤占掉。

Compaction 为你提供了一种受控的方式来缩减上下文大小，同时保留
后续对话轮次所需的状态。在完成一个具有意义的里程碑（例如完成
调试阶段或定位根本原因）之后，你可以压缩先前的上下文窗口，
并从压缩后的输出继续。这能让模型保持敏锐，因为
下一轮是基于重要状态构建的，而不是每一次中间的推理、
失败的命令以及过时的推理分支。

你可以通过两种方式使用 compaction：

- **由服务端处理**：如果使用 `previous_response_id`，请开启
  `context_management` 并设置 `compact_threshold`。服务端会自动
  在对话过大时压缩对话内容。你只需继续发送
  最新的用户消息。
- **自行处理**：如果你自己管理完整的输入数组，调用
  `client.responses.compact()`。它会返回一个更小的上下文窗口。直接使用该
  返回值进行下一次 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人工摘要，而是用于帮助模型延续的机器
状态。请将其原样向前传递，然后添加下一条
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

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 在请求复用相同的长前缀时自动降低延迟
和成本。先放置稳定的指令、
示例和参考资料，再放置动态的、用户特定的
内容。保持工具定义和顺序稳定，并追加新的对话
轮次而不重写先前的上下文。

GPT-5.6 引入了显式 prompt caching。隐式缓存仍为
默认值，但 GPT-5.6 模型及之后的模型系列也支持显式
缓存断点和请求级缓存策略。如果在稳定前缀之后还有
会变化的后缀，请在可复用的边界处添加一个显式 `prompt_cache_breakpoint` 。仅当请求应当仅使用
`prompt_cache_options.mode` 设置为 `explicit` 你提供的断点而不使用任何隐式断点时设置
。更早的模型继续
仅使用自动 prompt caching。

从 GPT-5.5 或更早版本迁移时，请替换 `prompt_cache_retention` 与
`prompt_cache_options.ttl: "30m"`。请参阅 [prompt caching 模型
差异](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)
后再更改缓存设置。

在 GPT-5.6 模型及之后的模型系列上，缓存写入费用为输入
uncached input token rate. Log `cached_tokens` 和 `cache_write_tokens`, then
compare write volume with later cache reads to measure net cost and tune
breakpoint placement。

Use a stable `prompt_cache_key` for requests that share a reusable prefix to
help route related requests to the same cache and optimize cache hit rates on
models before GPT-5.6. For busy groups, follow the [guidance for distributing
traffic across more keys](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).

On GPT-5.6 and later, `prompt_cache_key` is optional: you can achieve optimal
cache hit rates without it. You can use it to maintain separate cache accounting
for customers, users, or workspaces. This can make cached token usage and billing
easier to explain for each group. Assign a distinct key to each customer and
keep it stable across that customer's related requests. Separate keys also help
prevent cache-hit probing across customers. See [Separate cache accounting with
keys](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).

Maintain separate cache accounting for a customer

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

包括 GPT-6 模型在内的受支持模型可以 [跨调用保留推理
能力](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。使用
`reasoning.context: "all_turns"` 当任务的目标、假设和
优先级保持稳定。请使用 `current_turn` ，适用于先前的推理已不再
相关、可能会将模型锚定在过时方法上的情形。如果省略
`reasoning.context` 或将其设置为 `auto`，请检查响应的
`reasoning.context` 字段以确认生效的模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在已有早期推理项时有效。请使用 `previous_response_id`
来存储响应。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许存储响应数据，则加密的推理内容可实现无状态的
存储响应数据，加密的推理内容可实现无状态的
交接。

响应输出中的推理项默认包含加密的推理内容
default。你可以从每个推理项的
属性中访问加密的推理内容。 `encrypted_content` 属性访问加密后的推理内容。你的应用无需理解该
值。它只需原样保留每个推理项，并在下一轮对话时将其回传，
以便模型能够使用它来继续 工作流。

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


## 有意识地设置图像细节

Image `detail` 默认为 `auto`，其尺寸行为取决于模型。
较大的图像会占用更多输入 token 并增加延迟。请参阅 [尺寸表
了解所列模型](https://developers.openai.com/api/docs/guides/images-vision#model-sizing-behavior)，以及
在部署前衡量所选模型的图像 token 用量和限制。

选择 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
以适配任务。调整图像尺寸，对于不需要 `low` 精细视觉细节的场景可使用
，或对于 `high` 标准的高保真图像理解使用
`original` ；在支持的情况下，对于密集且，
需要坐标敏感的 OCR、定位或目视检查等任务，更高的细节能提升效果时可使用。
在部署前衡量最坏情况下的图像 token 用量和延迟。

## 发送安全标识符

如果你的应用服务的是单个终端用户，请在每个请求中一并发送一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识符。它有助于 OpenAI 检测滥用行为，并为你的团队提供一个稳定的方式
来 追踪 违规行为。它还能降低某个用户的滥用行为影响其他用户的可能性。
干扰更广泛组织的访问。

对用户的用户名或电子邮件地址进行哈希处理，而不是发送可识别
信息。对于已注销体验，请使用稳定的会话 ID。

## 处理对齐偏差监控

对于 GPT-6 Astra 智能体 工作流，请规划好 [misalignment
监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果某个请求
返回 `403` 与 `misalignment_policy_violation`，请停止为该会话分发动作，
并且不要自动重试被阻止的 工作流。同时也要处理
流式传输过程中的错误，并检查可能已经执行过的任何动作。
如果你的团队需要项目告警，请订阅 `safety.alert.created` ；该 webhook 并不替代请求错误处理。请参阅指南，了解哪些
Responses 请求可以被自动停止。
Responses 请求可以被自动停止。

## 应对流量激增和模型过载

检查 HTTP 状态并 `error.code` 再选择恢复操作。A
`429` 与 `slow_down` 表示请求速率上升过快：请遵循
`Retry-After` （若存在），降低流量，然后逐步恢复。A `503` 与
`server_is_overloaded` 表示所请求的模型暂时过载：
请遵循 `Retry-After` （若存在），然后重试。如果该标头缺失，请
按指数退避加抖动的方式增加重试延迟，并限制重试次数。账单、额度和
配额错误需要在重试前进行处理；不要将每个 `429` 都当作
临时的速率限制。另请参阅 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits#handle-rapid-traffic-increases-and-model-overload)
和 [错误代码](https://developers.openai.com/api/docs/guides/error-codes).

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能耗时
较长的请求。API 不会保持客户端连接持续打开，而是启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。可将其用于大规模分析、长时间运行的工具调用，或需要状态
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


你还可以将其与 `stream=True` 用于获取进度事件，但第一个事件
可能比普通请求耗时更长。

从 UI 角度来看，后台模式表示：“任务正在运行；当前状态如下，
结果就绪后会显示在此处。”

## 使用 WebSocket 模式

[WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的，
、大量工具调用的工作流而设计，你可以在其中保持持久连接，
并通过仅发送新的输入项来 `previous_response_id`。继续。对于
具有 20 次或更多工具调用的工作流，我们观察到端到端执行速度最高可提升约 40%。
端到端执行速度最高可提升约 40%。

**工作原理**：第一条消息看起来像一个普通的 Responses 请求：
模型、指令、工具和用户输入。服务端会以事件形式流式返回。如果
模型请求调用工具时，你的应用会运行该工具。然后，无需发送新的
HTTP 请求，而是在同一 socket 上发送另一个 `response.create` 事件，并附上
之前的 `previous_response_id` 和新的 item。这就是延迟优势
的来源。在普通 HTTP 中，每次后续操作都是一个全新的请求。而在 WebSocket 模式下，
连接保持打开，该连接上最近一次响应的状态保持在
内存中处于热状态。当下一轮从该响应继续时，
服务需要做的准备工作更少。

如果你的工作流只是一次请求、一次应答，那么 **保持 HTTP**。如果你的
工作流 表现得像一个长时间运行的 智能体,可以尝试使用 WebSocket 模式。

针对同一连接上的并发对话使用不同的 `stream_id` 值;
通过以下字段路由交错事件 `stream_id`。一个连接最多支持 16 个处于活动状态的
响应,而同一流上的请求按顺序执行。连接最长可持续
60 分钟。延续使用的语义与 `previous_response_id` HTTP 模式相同,并带有
用于缓存每个流中最新响应的连接本地缓存。

注意:WebSocket 模式可与 ZDR 一起使用,因为你的数据不会被持久化到磁盘,
只会存储在内存中。

Python 示例使用 `pip install "openai[realtime]>=3.8.0"`.
JavaScript 示例使用 `npm install openai@^7.10.0 ws`.
Ruby 示例使用 `gem install openai async-websocket`.

对于 Go,运行 `go get github.com/openai/openai-go/v3@v3.73.0`.
对于 Java,添加 Maven 依赖 `com.openai:openai-java:4.78.0`.
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

如果用户可以在 GPT-6 模型工作期间添加需求，请使用 WebSocket
连接到 Responses API。请发送 `response.steer` 时附带当前响应的
ID 以及新的用户输入。继续读取事件以获取 `previous_response_id` 以及新的用户输入。继续读取事件以获取
该 延续； `response.steer.accepted` 表示该更新已加入队列。
steering 不会改变已发送到你的应用的输出，也无法撤销已开始执行的工具调用。
请参阅 [mid-turn steering](https://developers.openai.com/api/docs/guides/steering) 获得最高的
以了解事件流和工具结果的处理方式。

## 最后的总结

Responses API 是构建更智能、更强大的 OpenAI
应用的基础。它的真正优势在于让开发者从一次性提示转向可持久化、调用工具且具备上下文感知的工作流，从而能够适应不同的
场景和需求。
任务的复杂度。遵循本指南，在实际部署中实现更高性能。
部署中。