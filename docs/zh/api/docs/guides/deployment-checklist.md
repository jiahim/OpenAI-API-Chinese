# API 部署清单

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

| 目录                                                                                                | 预期影响                     |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [使用 Responses API](#use-the-responses-api)                                                         | 质量、成本、延迟、可靠性 |
| [为工作负载选择模型](#choose-a-model-for-the-workload)                                     | 质量、成本、延迟              |
| [设置 `reasoning.effort`](#set-up-reasoningeffort)                                                    | 质量、成本、延迟              |
| [在对话中途更改推理力度](#change-reasoning-effort-mid-conversation)                   | 质量、成本、延迟              |
| [设置 `text.verbosity`](#set-up-textverbosity)                                                        | 质量、成本、延迟              |
| [设置助手 `phase` 参数](#set-up-the-assistant-phase-parameter)                         | 质量、成本                       |
| [使用 `tool_search`](#use-toolsearch)                                                                    | 成本、延迟                       |
| [使用程序化工具调用](#use-programmatic-tool-calling)                                         | 质量、成本、延迟              |
| [使用多 智能体 进行并行工作](#use-multi-agent-for-parallel-work)                                 | 质量、成本、延迟              |
| [使用异步工具调用](#use-async-tool-calling)                                                       | 延迟                             |
| [利用内置工具](#leverage-built-in-tools)                                                     | 质量                             |
| [利用压缩](#leverage-compaction)                                                             | 成本                                |
| [优化提示缓存](#optimize-prompt-caching)                                                     | 延迟、成本                       |
| [使用 `reasoning.encrypted_content`](#use-reasoningencryptedcontent)                                     | 质量、延迟                    |
| [有意识地设置图像细节](#set-image-detail-intentionally)                                       | 质量、成本、延迟              |
| [发送安全标识符](#send-a-safety-identifier)                                                   | 安全性、可靠性                 |
| [处理未对齐监控](#handle-misalignment-monitoring)                                       | 安全性、可靠性                 |
| [处理流量激增和模型过载](#handle-rapid-traffic-increases-and-model-overload) | 可靠性                         |
| [使用 `background=True`](#use-backgroundtrue)                                                            | 任务延续                     |
| [使用 WebSocket 模式](#use-websocket-mode)                                                               | 延迟                             |
| [使用回合中途引导](#use-mid-turn-steering)                                                         | 质量                             |

## 使用 Responses API

**始终从** 开始使用
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。它是 OpenAI 的旗舰级
API，是访问最新模型行为、内置工具、
有状态工作流以及 智能体 功能的最佳选择。

## 为此工作负载选择模型

评估 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra)
针对你的工作负载。使用 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以获得
最高能力， [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol) 用于要求严苛的
推理与编程任务，以及 [`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna) 用于
高效、可重复的工作。选择在代表性
任务上表现良好的模型，而不是将每个请求都路由到最强的模型。

迁移到 GPT-6 时，保留你当前模型的工作负载角色和
有效的推理强度（在受支持的范围内）。使用 Responses API 进行带工具的推理。
GPT-6 Astra 需要 Responses 才能调用工具；GPT-6 Sol 和 Luna
仅在 Chat Completions 中支持函数调用，且需配合 `reasoning_effort: "none"`.
当推理强度未设置 `none`，时，移除 `temperature`, `top_p`，并
`top_logprobs`；同时移除 `logprobs` 从 Chat Completions 请求中，
`message.output_text.logprobs` 从 Responses `include` array。使用 EU 数据
驻留时，请为全部三个模型使用 Standard 处理。参见
[模型迁移指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#migration-quickstart)
以获取其他兼容性检查。在更改提示或添加新的
能力之前，运行有代表性的评估。比较任务成功率、延迟、输入、输出、推理和
缓存写入 token，以及每个成功任务的成本。

## 设置 `reasoning.effort`

使用 `reasoning.effort` 来决定模型在回答前应进行多少思考
。

GPT-6 Astra、Sol 和 Luna 支持 `low`, `medium`, `high`, `xhigh`，并
`max`。Sol 和 Luna 还支持 `none`；Astra 不支持。较低的努力值更快，使用的
推理 token 更少。较高的努力值则为模型提供更多时间用于规划、
调试、综合分析以及多步权衡。

使用 `low` 当任务主要是提取、路由、分类或
常规改写时。使用 `medium` 或 `high` 当模型需要诊断
问题、比较选项、撰写计划或对代码进行推理时。使用 `xhigh` 或
`max` 仅当代表性评估显示质量提升值得额外的
延迟和成本时。从 `minimal`，或从 `none` 迁移到 GPT-6
Astra 时，从 `low` 开始并比较结果。否则，保留当前有效的
努力值，并针对你的质量、延迟和成本目标测试变更。

对于最看重质量的负载，也请对比
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 与
在相同 effort 下的 standard 模式进行对比。推理模式与 effort 是相互独立的。
Pro 模式通过在返回
单个最终答案前投入更多模型工作来提升可靠性，但会增加延迟和 token 用量。

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


## 在对话中途更改推理强度

对于标准、单智能体模式下的 GPT-6 模型，添加一个
[`configuration_update`](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)
输入项，放在下一条用户消息之前，以便在不同响应之间调整 effort。
保持请求级 `reasoning.effort` 不变，以便原始提示
前缀仍然可用于缓存。该更新将应用于下一次响应
，并持续生效，直到被另一次更新覆盖。配置更新无法
与自动压缩或截断组合使用，并且 `/responses/compact`
会拒绝包含它们的历史记录。若要压缩历史记录，请包含一个
`compaction_trigger` 项，并在之后添加一次新的更新。

## 设置 `text.verbosity`

`text.verbosity` 是在简洁性与完整性之间取得平衡的主要调节手段。
当产品需要快速、紧凑的回答时，使用较低的 verbosity；当响应需要
更丰富的解释、更清晰的结构或
完整上下文时，使用较高的 verbosity。较低的 verbosity 意味着输出 token 更少，因此模型
生成的内容更少，返回结果更快。

对于编码任务， `medium` 和 `high` 倾向于生成更长、结构更清晰的输出
，结构更清晰。 `low` 让回答更紧凑、更精简。

迁移时，请检查诸如“Be concise”这样的宽泛指令是否仍然有帮助。
优先使用 `text.verbosity` 来控制默认的详细程度，然后使用
提示来指定所需的内容、结构和长度。

提示还会影响质量、token 用量、成本和延迟。请查看
[最新模型的提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)
以及你的详细程度设置，包括其针对编码场景的测试与验证
指导，适用于智能体。

将详细程度调低以获得更精简的输出

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
向模型表明此前的助手消息是中间的
工作性评论还是最终答案。请使用 `phase: "commentary"` 表示进度
更新、调用工具前的说明以及其他中间消息。请使用
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


那不是最终答案，而是一条进度说明。之后，助手可能会说：

助手最终答案消息

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


这在长时间运行或工具调用密集的工作流中非常有用，因为助手可能会
在完成前产生可见的进度更新。当你在后续请求中把这段历史
发回时，对于 `gpt-5.3-codex` 及更高版本的模型，
**请在助手消息上保留并重新发送 `phase`** ，以便模型能够区分
进度更新和最终结果。这有助于减少提前停止，使
智能体 更有可能持续运行直至给出最终答案。

<a id="use-toolsearch" className="scroll-mt-[110px]"></a>

## 使用 `tool_search`

与其在每个请求中都加载完整的工具目录，不如使用
[工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)：为昂贵的工具定义添加
`{"type": "tool_search"}` 并标记为昂贵工具定义，然后
`defer_loading: true`。这样模型就可以在运行时按需加载所需的子集。
在请求开始时，模型只能看到搜索工具的名称和描述。如果
模型判断需要使用某个延迟工具，它会运行工具搜索，只有到那时
这些延迟工具的定义才会被加载到上下文中。也只有到那时模型才会
调用它们。这样既能节省 token，又能保持缓存性能。

工具搜索有两种模式：

- **托管工具搜索** 是更简单的选项。当你已经知道
  哪些工具可以用于该请求时，请使用它。
- **客户端执行的工具搜索** 适用于你的应用需要自行决定哪些工具可用的场景，例如基于用户的租户、项目、权限或
  根据用户的租户、项目、权限或
  内部注册表。

**从 托管工具 搜索开始** 除非你的应用确实需要自行控制
发现过程。

按用户意图对工具进行分组。尽可能使用命名空间或 MCP 服务器。这
样模型在几个清晰的分组之间做选择，比在一长串扁平列出的函数中
选择要更容易。我们建议每个命名空间下保持大约不超过 10 个函数，
以获得最佳的 token 效率和模型性能。

保持命名空间描述简短且具有区分度。详细的
说明放在延迟加载的工具定义中。避免把一切
都塞进一个巨大的命名空间。

将 托管工具 搜索与延迟加载的工具结合使用

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
让支持的模型编写 JavaScript 来调用符合条件的工具，并在托管运行时中缩减它们的中间结果。适用于那些可以用代码在将较小的结构化结果返回给模型之前对大型工具结果进行过滤、连接、排序、去重、合并或校验的有界阶段。
their intermediate results inside a hosted runtime. Use it for bounded stages where
code can filter, join, rank, remove duplicates, combine, or check large tool
results before returning a smaller structured result to the model.

添加 `programmatic_tool_calling` 工具并对每个符合条件的工具启用。对于仅限程序使用的工具，使用
`allowed_callers: ["programmatic"]` ，或者在模型也可能直接调用
`allowed_callers: ["direct", "programmatic"]` tool directly. Keep calls direct when each result may change the model's next
tool directly. Keep calls direct when each result may change the model's next
decision, an action requires approval, or the final answer must preserve
citations or native artifacts. Document tool return fields and error behavior so
the model can write a correct program without first inspecting a result.

你的工具循环必须处理 `program` 和 `program_output` 条目，以及
程序发出的 `function_call` 条目及其 `function_call_output` 条目。
保留每个 `call_id`, and copy the function call's `caller` 到其输出中，以便
该服务可以恢复正确的程序。

同时测试 `program_output` 以及最终的助手消息。一个正确的程序
结果仍可能成为不完整的最终答案。请对比任务成功率、
所需证据、总 token 数、延迟和成本，与使用直接工具调用的同一工作流进行对比。
使用直接工具调用。

## 使用多智能体处理并行工作

[Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让支持的模型，
（包括 GPT-6 模型）将独立的工作流委托给子智能体，并
对其结果进行整合。当你能够将研究、分析或实现拆分为
具体的、有边界的任务（这些任务使用各自独立的上下文并可并行运行）时，可使用该功能。

将 `multi_agent.enabled` 设为 `true` 。对于 HTTP，请使用 beta 版
Responses SDK，并使用 `client.beta.responses` 传入 `responses_multi_agent=v1`
在 `betas`. 对于原始 HTTP 或 WebSocket 连接，发送
`OpenAI-Beta: responses_multi_agent=v1`. 各项的 schema 可能会发生变化，而
Multi-智能体 仍处于测试阶段。

对于短任务、每一步都依赖前一步结果的有序链式工作，或写入同一可变资源的工作，
请优先使用单个 智能体。子智能体可能会增加
token 用量，因此请从默认 `max_concurrent_subagents` 值开始， `3`
并衡量端到端的质量、延迟和成本。对于工具密集型或长时间运行的
Multi-智能体 工作流，WebSocket 模式可以降低 延续 开销。

在启用 Multi-智能体 之前，请考虑其当前的限制：
`/responses/compact`, `reasoning.summary`，并 `max_tool_calls` 不支持
。服务端会自动压缩根上下文和每个
子智能体上下文。

## 使用异步工具调用

在 GPT-6 模型上，设置 `async: true` 在函数或自定义工具上当模型
可以在你的应用运行它的同时继续工作。尽早启动慢速工具调用，并
让模型处理独立工作。你的应用仍然会执行并
追踪该调用，然后在后续的 Responses 请求中通过
原始的 `call_id`。返回结果。异步执行不适用于内置工具或
编程式工具调用。在多智能体模式下，不要将异步工具与
并行工具调用结合使用。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)
了解完整流程。

## 使用内置工具

[内置工具](https://developers.openai.com/api/docs/guides/tools) 是 API 的原生能力。
无需自行构建每个工具，你可以让模型访问那些
已在 Responses API 中可直接使用的工具。模型随后可以决定何时
调用它们。

OpenAI 持续增加更多原生工具，因此当它们
适用于你的 工作流 时，优先从内置工具开始。当原生工具无法覆盖任务时，再构建自定义工具。
当前的内置工具及相关工具选项包括：

- **网页搜索**：在网页上搜索最新信息
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

模型质量是倾向于使用它们的另一个原因。内置工具
属于我们后训练分布范围内，这意味着模型围绕这些工具的形态、行为和输出进行了训练
和评估。使用内置工具时，
OpenAI 模型在工具选择、执行质量和失败率方面都优于使用新工具的情况，
且失败更少。

## 利用压缩

[Compaction](https://developers.openai.com/api/docs/guides/compaction) 是一种上下文工程工具，它
决定模型在多轮交互中向前传递哪些信息。在
长时间运行的 智能体 中，问题不仅仅是“我是否会触达上下文上限？”而是
旧消息、工具日志、重试记录以及过时的细节会挤占掉模型所需的
状态空间。

Compaction 为你提供了一种受控方式来缩减上下文规模，同时保留
后续轮次所需的状态。在完成一个重要里程碑之后，比如完成调试阶段或
定位到根本原因后，你可以压缩先前的上下文窗口
并从压缩后的输出继续推进。这能让模型保持敏锐，因为下一轮
围绕着重要状态构建，而不是包含每一处中间推理、
失败命令以及过时的推理分支。

你可以通过两种方式使用 compaction：

- **由服务端处理**：如果你使用 `previous_response_id`，请启用
  `context_management` 并设置一个 `compact_threshold`。服务端会自动
  在对话过长时对其进行压缩。你只需持续发送
  最新的用户消息。
- **自行处理**：如果你自行管理完整的输入数组，请调用
  `client.responses.compact()`。它会返回一个更小的上下文窗口。将该
  返回的输出直接用于下一次 `responses.create()` 调用。

**不要编辑压缩后的输出。** 它不是人类可读的摘要，而是机器
状态，帮助模型继续对话。请原样向下传递，然后添加下一条
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

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 当请求复用相同的长前缀时，会自动降低延迟
和成本。将稳定的指令、
示例和参考资料放在前面，后面再接动态的、
针对用户的内容。保持工具定义和顺序稳定，并在不重写
早期上下文的情况下追加新的对话轮次。

GPT-5.6 引入了显式的 prompt caching。隐式缓存仍是
默认方式，但 GPT-5.6 及更高版本的模型系列同时支持显式
缓存断点和请求级别的缓存策略。如果在稳定前缀之后
接的是会变化的后缀，请在可复用 `prompt_cache_breakpoint` 的边界处添加显式
`prompt_cache_options.mode` 设为 `explicit` 仅当请求应该只使用你提供
的断点而不使用任何隐式断点时再设置。更早的模型仍然
只使用自动 prompt caching。

在从 GPT-5.5 或更早版本迁移时，请将 `prompt_cache_retention` 与
`prompt_cache_options.ttl: "30m"`。参见 [prompt caching 模型
差异](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)
后再修改缓存设置。

在 GPT-5.6 及更高版本的模型系列上，缓存写入的成本是
uncached input token rate. Log `cached_tokens` 和 `cache_write_tokens`，然后
比较写入量与后续的缓存读取量，以衡量净成本并调整
断点位置。

使用稳定的 `prompt_cache_key` 为共享可复用前缀的请求，以
帮助将相关请求路由到同一缓存，并优化 GPT-5.6 之前模型上的缓存命中率。对于繁忙的群组，请遵循
跨多个密钥分配流量的 [指导
。](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).

在 GPT-5.6 及更高版本中， `prompt_cache_key` 是可选的：你无需使用它即可实现最佳
缓存命中率。你可以用它来为客户、用户或工作区维护独立的缓存核算。
这样可以更清晰地解释每个分组的缓存 token 用量和计费
情况。为每个客户分配一个独立的 key，
并在该客户的相关请求中保持其稳定。不同的 key 还有助于
防止跨客户的缓存命中探测。参见 [使用
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

包括 GPT-6 模型在内的受支持模型可以 [跨调用保留推理
calls](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls)。使用
`reasoning.context: "all_turns"` 当任务的目标、假设和
优先级保持稳定。可使用 `current_turn` 在先前的推理不再
相关，并可能使模型锚定于过时方法时。若省略
`reasoning.context` 或将其设置为 `auto`,请检查响应中的
`reasoning.context` 字段以确认实际模式。

[持久化推理](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
仅在早期推理项可用时才生效。使用 `previous_response_id`
来读取已存储的响应。如果你的 [零数据保留
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) 要求不允许
存储响应数据，密文推理内容可实现无状态的
交接。

响应输出中的推理项默认包含密文推理内容。
默认情况下，你可以从每个推理
项的 `encrypted_content` 属性中访问加密的推理内容。你的应用无需理解该
值，只需按原样保留每个推理项并在下一轮发送回去，
以便模型可以借此延续工作流。

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
较大的图像会消耗更多输入 token 并增加延迟。请查阅 [尺寸表
中列出的模型](https://developers.openai.com/api/docs/guides/images-vision#model-sizing-behavior)，并
在部署前测量所选模型的图像 token 使用量和限制。

选择 [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
用于该任务。调整图片大小，使用 `low` 在精细视觉细节不重要时使用，或使用
，或使用 `high` 以获得标准的高保真度图像理解。使用
`original` （在支持的情况下）用于大型、密集、坐标敏感、OCR、
定位或视觉检查类任务，这些任务中额外的细节可提升质量。
部署前测量最坏情况下的图像 token 数和延迟。

## 发送安全标识符

如果你的应用面向独立的最终用户，请在每个请求中附带一个稳定的，
保护隐私的
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
标识。这有助于 OpenAI 检测滥用行为，并为你的团队提供一种稳定的方式来
追踪违反策略的行为，同时也能降低单个用户的滥用影响整个组织访问的风险。
disrupts access for your broader organization.

应对用户的用户名或电子邮件地址进行哈希处理后再发送，而不是直接发送可识别
信息。对于已登出的使用场景，请使用稳定的会话 ID。

## 处理对齐偏差监控

对于 GPT-6 Astra 智能体 workflows，请规划好 [misalignment
monitoring](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果某个请求
返回 `403` 与 `misalignment_policy_violation`，请停止为该对话分发操作
，并且不要自动重试被阻止的 工作流。同时也要处理
流式传输过程中出现的错误，并检查可能已经执行的任何操作。
如果你的团队需要项目提醒，请 `safety.alert.created` 订阅；该
webhook 不会替代请求错误处理。请查阅指南，了解哪些
Responses 请求可以被自动停止。

## 应对流量激增和模型过载

检查 HTTP 状态码并 `error.code` 再选择恢复操作。一个
`429` 与 `slow_down` 表示请求速率增长过快：遵循
`Retry-After` （如果存在），降低流量，然后逐步增加请求。一个 `503` 与
`server_is_overloaded` 表示所请求的模型暂时过载：
遵循 `Retry-After` （如果存在），然后重试。如果缺少该响应头，请增大
重试延迟时间，并加入随机抖动，同时限制重试次数。计费、支出和
配额错误需要先处理再重试；不要把每个 `429` 都当作
临时速率限制。请参阅 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits#handle-rapid-traffic-increases-and-model-overload)
和 [错误代码](https://developers.openai.com/api/docs/guides/error-codes).

## 使用 `background=True`

使用 [`background=True`](https://developers.openai.com/api/docs/guides/background) 用于可能耗时
较长的请求。客户端连接不会保持打开，而是由 API 启动一个任务
并返回一个 ID。你的应用可以轮询该任务，直到它完成、失败或被
取消。它适用于大型分析、长时间运行的工具调用，或需要状态追踪
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


你可以将其与 `stream=True` 用于获取进度事件，但首个事件
可能比正常请求耗时更长。

从界面角度看，后台模式表示，“正在运行；这是
状态；准备好后结果会显示在这里。”

## 使用 WebSocket 模式

[WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode) 专为长时间运行的，
调用工具密集型工作流而设计，你可以保持持久连接打开，并通过
仅发送新的输入项以及 `previous_response_id`。来延续。对于
包含 20 次或更多工具调用的工作流，我们观察到端到端执行速度提升最多约 40% 的
效果。

**工作原理**：第一条消息看起来像一次普通的 Responses 请求，包含：
模型、指令、工具和用户输入。服务端会以流式方式返回事件。如果
模型请求调用工具时，你的应用会执行该工具。然后，你无需发起新的
HTTP 请求，而是通过同一连接再发送一个 `response.create` 事件，并在该事件中附带
之前的 `previous_response_id` 以及新的条目。延迟优势就来自这里
comes from. 在普通 HTTP 中，每次后续请求都是全新的请求。在 WebSocket 模式下，
连接保持打开状态，最近一次响应的状态在该连接上保持热缓存，
当下一轮从该响应继续时，
服务需要完成的准备工作更少。

如果你的工作流是一个请求、一个回答，那么 **保持 HTTP**。如果你的
工作流 表现为长时间运行的 智能体，请尝试 WebSocket 模式。

在同一连接上为并行的对话使用不同的 `stream_id` 值；
通过以下方式路由交错的事件 `stream_id`。一个连接最多支持 16 个活动的
响应，同一流束上的请求按顺序执行。连接最长持续
60 分钟。延续使用与 `previous_response_id` 相同的语义，
并为每个流束中的最新响应提供连接本地缓存。

注意：WebSocket 模式可与 ZDR 一起使用，因为你的数据不会存储到磁盘，
只存储在内存中。

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


## 使用中途引导

如果用户可能在 GPT-6 模型运行过程中追加需求，请使用 WebSocket
连接到 Responses API。发送 `response.steer` 当前响应的
ID 以及 `previous_response_id` 新的用户输入。继续读取事件以获取
该 延续； `response.steer.accepted` 表示该更新已排队。
这种引导方式不会改变已发送到你的应用的输出，也不会撤消已
启动的工具。参见 [中途引导](https://developers.openai.com/api/docs/guides/steering) 以获得
的事件流和工具结果处理。

## 最终要点

Responses API 是构建更智能、更强大的 OpenAI
应用的基石。其真正优势在于，它让开发者从一次性
提示，迈向可持久化、能够调用工具且具备上下文感知能力的工作流，从而灵活应对
各种复杂任务。遵循本指南，在实际
部署中获得更出色的表现。