# 配置 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

智能体配置定义了智能体的行为方式。你可以在创建会话时提供它，也可以保存它以便重复使用。会话承载对话与工作内容，而保存的智能体则承载可复用的设置。

## 定义 智能体 的行为

从模型和指令入手，再按任务需要添加工具和控件：

- **模型：** 执行任务的模型。
- **指令：** 智能体应当执行的任务以及它的行为方式。
- **工具：** 智能体可以执行的操作，例如搜索网页或调用你的函数。
- **推理与输出：** 模型使用的推理量，以及响应的格式和详细程度。

在创建会话时传入这些设置 `agent` 。下面的示例提供了模型、指令以及首条用户消息：

为单个会话配置一个 智能体

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions: "Answer the user clearly and concisely.",
  },
  environment: {
    type: "none",
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "What can you help with?",
        },
      ],
    },
  ],
});

console.log(session);
```

```python
from openai import OpenAI

client = OpenAI()

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Answer the user clearly and concisely.",
    },
    environment={"type": "none"},
    input=[
        {
            "role": "user",
            "content": [{"type": "input_text", "text": "What can you help with?"}],
        }
    ],
)
print(session.to_json())
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model:        openai.String("gpt-6-astra"),
			Instructions: openai.String("Answer the user clearly and concisely."),
		},
		Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
		Input: openai.BetaAgentSessionNewParamsInputUnion{
			OfArrayOfInputMessages: []openai.AgentSessionInputMessageParam{
				{
					Content: []openai.InputContentParamUnion{
						{
							OfParamInputText: &openai.InputContentParamInputText{Text: "What can you help with?"},
						},
					},
				},
			},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions("Answer the user clearly and concisely.")
                        .build())
                .environmentNone()
                .input("What can you help with?")
                .build());
System.out.println(result);
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Answer the user clearly and concisely."
  },
  environment: { type: "none" },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "What can you help with?"
        }
      ]
    }
  ]
)
puts result
```


请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 以了解配置字段和取值。关于设置，请参阅 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions), [Computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use), [MCP connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp)，或 [Multi-智能体 delegation](https://developers.openai.com/api/docs/guides/agents-api/multi-agent).

### Configuration size

将你的指令和工具配置合并后的大小保持在 4 MiB（4,194,304 字节）以下，并预留一些空间给 智能体 API 元数据。如果会话启动因该配置过大而失败，请创建一个新会话，并使用更小的指令和工具配置。

上传到该环境的文件遵循单独的 [文件限制](https://developers.openai.com/api/docs/guides/agents-api/environments/files#file-limits).

## 在多个会话中复用同一个智能体

保存一个 智能体 以便在多个会话之间复用其配置。只需创建一次，然后在启动每个会话时将其 ID 作为 `agent_id` 传入：

复用 智能体

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const agent = await client.beta.agents.create({
  model: "gpt-6-astra",
  instructions: "Answer technical questions accurately.",
  reasoning: {
    summary: "auto",
  },
});
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: "none" },
  input: "Explain how an agent connects to an MCP server.",
});
console.log(session);
```

```python
from openai import OpenAI

client = OpenAI()
agent = client.beta.agents.create(
    model="gpt-6-astra",
    instructions="Answer technical questions accurately.",
    reasoning={"summary": "auto"},
    timeout=360,
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "none"},
    input="Explain how an agent connects to an MCP server.",
)
print(session.to_json())
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
agent, err := client.Beta.Agents.New(ctx,
	openai.BetaAgentNewParams{
		Model:        "gpt-6-astra",
		Instructions: openai.String("Answer technical questions accurately."),
		Reasoning:    openai.AgentReasoningParam{Summary: "auto"},
	})
if err != nil {
	panic(err)
}
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		AgentID:     openai.String(agent.ID),
		Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
		Input:       openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Explain how an agent connects to an MCP server.")},
	})
if err != nil {
	panic(err)
}
fmt.Println(result)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentCreateParams;
import com.openai.models.beta.agents.AgentReasoningParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var agent =
    client
        .beta()
        .agents()
        .create(
            AgentCreateParams.builder()
                .model("gpt-6-astra")
                .instructions("Answer technical questions accurately.")
                .reasoning(
                    AgentReasoningParam.builder()
                        .summary(AgentReasoningParam.Summary.of("auto"))
                        .build())
                .build());
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agentId(agent.id())
                .environmentNone()
                .input("Explain how an agent connects to an MCP server.")
                .build());
System.out.println(result);
```

```ruby
require "openai"

client = OpenAI::Client.new
agent = client.beta.agents.create(
  model: "gpt-6-astra",
  instructions: "Answer technical questions accurately.",
  reasoning: { summary: "auto" }
)
result = client.beta.agents.sessions.create(
  agent_id: agent.id,
  environment: { type: "none" },
  input: "Explain how an agent connects to an MCP server."
)
puts result
```


每个会话都有各自的对话与工作内容。请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 来列出、获取、更新或删除已保存的 智能体。凭据保存在 [vaults](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults)，中，与保存的配置相互独立。

## 更新已保存的智能体

已保存的智能体更新仅对新会话生效。每个会话在创建时会复制已保存的配置，并在后续轮次中保留这些设置。若要更改现有会话， [更新其设置](#update-settings-for-an-existing-session).

更新已保存的智能体时：

- 省略的字段将保留其已保存的值。仅更改 `model` 时会保留原值 `reasoning`, `service_tier`，以及 `text`.
- 提供的对象将替换整个字段。仅提供 `reasoning` 也会清除 `effort` 已保存的内容 `summary`.
- `null` 会重置接受它的字段。例如， `reasoning: null` 会将模型的推理努力程度恢复为默认值。

在同一请求中更改或重置新模型不支持的任何设置。

## 为单个会话覆盖设置

同时包含 `agent_id` 和 `agent` 以在创建会话时自定义已保存的智能体配置。创建会话时，会从已保存的智能体中复制未提供的设置（包括模型）。

运行此示例前，将示例中的 `agent_123` 值替换为已保存的智能体的 ID：

为单个会话覆盖智能体

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";
const client = new OpenAI();

const agentId = "agent_123";
const session = await client.beta.agents.sessions.create({
  agent_id: agentId,
  agent: {
    instructions: "Answer this question in one concise paragraph.",
  },
  environment: {
    type: "none",
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Explain how an agent connects to an MCP server.",
        },
      ],
    },
  ],
});

console.log(session);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
from openai import OpenAI

client = OpenAI()

agent_id = "agent_123"
session = client.beta.agents.sessions.create(
    agent_id=agent_id,
    agent={"instructions": "Answer this question in one concise paragraph."},
    environment={"type": "none"},
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Explain how an agent connects to an MCP server.",
                }
            ],
        }
    ],
)
print(session.to_json())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		AgentID:     openai.String("agent_123"),
		Agent:       openai.BetaAgentSessionNewParamsAgent{Instructions: openai.String("Answer this question in one concise paragraph.")},
		Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
		Input: openai.BetaAgentSessionNewParamsInputUnion{
			OfArrayOfInputMessages: []openai.AgentSessionInputMessageParam{
				{
					Content: []openai.InputContentParamUnion{
						{
							OfParamInputText: &openai.InputContentParamInputText{Text: "Explain how an agent connects to an MCP server."},
						},
					},
				},
			},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result)
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agentId("agent_123")
                .agent(
                    SessionCreateParams.Agent.builder()
                        .instructions("Answer this question in one concise paragraph.")
                        .build())
                .environmentNone()
                .input("Explain how an agent connects to an MCP server.")
                .build());
System.out.println(result);
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent_id: "agent_123",
  agent: { instructions: "Answer this question in one concise paragraph." },
  environment: { type: "none" },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Explain how an agent connects to an MCP server."
        }
      ]
    }
  ]
)
puts result
```


覆盖仅对当前会话生效，不会更改已保存的智能体或其他会话。提供的对象和数组会替换整个字段，而不是与已保存的值合并。例如，提供 `tools` 将替换已保存的工具列表。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 以了解请求字段。

## 更新现有会话的设置

发送 `POST /v1/agents/sessions/{session_id}` 一个 `agent` 对象以更改 `model`, `reasoning.effort`，或 `service_tier` 设置，该设置仅在单个会话内生效。这些设置在 beta 和 GA API 合约中可用。你可以在同一请求中更新 `metadata` 。

更改会应用于更新完成后发送的消息所开启的新轮次。已在传输中的消息仍可使用先前的设置。活跃的轮次会保留其设置，包括当你发送引导消息时。会话会保留其对话历史。所选模型必须支持更新后的设置，否则更新会失败。

- 该 `agent` 和 `reasoning` 对象时,会将提供的字段合并到当前设置中。未提供的字段保持不变，包括 reasoning summary。仅更改 `model` 会保留会话的 reasoning effort 和服务层级。
- `reasoning.effort: null` 会将 effort 重置为所选模型的默认值。
- `service_tier: null` 会恢复自动层级选择。
- 必须始终设置一个模型，因此不能提供 `model: null`。 `agent` 和 `reasoning` 对象也会拒绝 `null`.
- `metadata` 会替换整个映射。省略该字段可保留元数据，或者传入 `null` 或 `{}` 以清空它。

例如，以下请求会更改推理强度，并让 API 自动选择服务等级：

```json
{
  "agent": {
    "reasoning": { "effort": "low" },
    "service_tier": null
  }
}
```

更新某个会话不会更改已保存的 智能体 或其他会话。之后对已保存 智能体 的更新也不会更改该会话。

你无法通过此接口更新 `reasoning.summary`, `text`, `tools`, `instructions`，或 `multi_agent` 这些设置。请创建一个新会话来更改这些设置。

## 环境设置

在创建会话时设置 `environment` ，它与 `agent` 配合使用，用于决定智能体在何处运行命令以及处理文件。












选择 `none`, `openai_hosted`，或 `self_hosted`. [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 说明何时使用每个选项以及由谁管理环境。

对于OpenAI托管环境， [选择容器规格](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#choose-a-container-size) 并配置任务所需的软件包、初始文件和网络访问。你可以在多个会话中复用同一个环境模板。对于自托管环境，请准备好你的计算资源，并 [连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 环境字段，请参阅 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) 中的技能、插件和模板。请参阅 [会话产物](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解执行后需要保留的文件。