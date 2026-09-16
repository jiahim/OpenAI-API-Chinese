# 配置 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

智能体 配置定义了 智能体 的行为方式。你可以在创建会话时提供它，也可以保存它以供复用。会话承载对话和工作内容，而保存的 智能体 则承载可复用的设置。

## 定义智能体的行为

从模型和指令开始，然后添加你的任务所需的工具和控制项：

- **Model：** 执行工作的模型。
- **Instructions：** What the 智能体 should do and how it should behave.
- **Tools：** What actions the 智能体 can take, such as searching the web or calling your functions.
- **推理与输出：** 模型使用的推理量以及响应的格式和详细程度。

在创建会话时传入这些设置 `agent` 。本示例提供了一个模型、说明以及第一条用户消息：

为单个会话配置一个智能体

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


请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 了解配置字段和可接受的值。请参阅 [函数](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 和 [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 了解工具配置，以及 [多智能体](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) 了解任务委托。

## 跨会话复用 智能体

保存一个 智能体 以便在多个会话中复用其配置。只需创建一次，然后在每次启动会话时将其 ID 作为 `agent_id` 传入：

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


每个会话都有自己独立的对话和工作内容。参见 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 来列出、检索、更新或删除已保存的 智能体。凭据存储在 [保险库](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults)，中，与已保存的配置相互独立。

## 更新已保存的智能体

已保存的智能体更新仅适用于新的会话。每个会话在创建时会复制已保存的配置，并在后续轮次中保留这些设置。若要更改现有会话， [请更新其设置](#update-settings-for-an-existing-session).

更新已保存的智能体时：

- 省略的字段将保留其已保存的值。仅更改 `model` 将保留 `reasoning`, `service_tier`，而 `text`.
- 提供的对象会替换整个字段。提供 `reasoning` 仅包含 `effort` 也会清除已保存的 `summary`.
- `null` 则会重置接受该值的字段。例如， `reasoning: null` 可恢复模型的默认 effort。

在同一请求中更改或重置新模型不支持的任何设置。

## 覆盖单个会话的设置

同时包含 `agent_id` 和 `agent` 以便在创建会话时自定义已保存智能体的配置。会话在创建时从已保存的智能体复制被省略的设置，包括模型。

请将示例中的 `agent_123` 值替换为已保存智能体的 ID，然后再运行该示例：

在单个会话中覆盖智能体

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


覆盖仅作用于该会话。它们不会更改已保存的智能体或其他会话。提供的对象和数组会替换整个字段，而不会与已保存的值合并。例如，提供 `tools` 会替换已保存的工具列表。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 中的请求字段。

## 更新现有会话的设置

发送 `POST /v1/agents/sessions/{session_id}` 一个包含 `agent` 对象的请求以更改 `model`, `reasoning.effort`，或者 `service_tier` 单个会话的设置。这些设置在 beta 和 GA API 合约中可用。你可以在同一请求中更新 `metadata` 。

更改会应用于更新完成后发送的消息所开启的新轮次。已经在进行中的消息可以使用之前的设置。活跃的轮次会保留其设置，包括你发送引导消息时也是如此。会话会保留其对话历史。所选模型必须支持更新后的设置，否则更新会失败。

- 该 `agent` 并且 `reasoning` 对象会将提供的字段合并到当前设置中。未提供的字段保持不变，包括 reasoning summary。仅修改 `model` 会保留会话的 reasoning effort 和服务层级。
- `reasoning.effort: null` 会将 effort 重置为所选模型的默认值。
- `service_tier: null` 会恢复自动层级选择。
- 必须始终设置模型，因此不能提供 `model: null`。 `agent` 并且 `reasoning` 对象也会拒绝 `null`.
- `metadata` 会替换整个映射。省略它可保留元数据，或传入 `null` 或 `{}` 以清除它。

例如，下面的请求会更改推理强度，并让 API 自动选择服务等级：

```json
{
  "agent": {
    "reasoning": { "effort": "low" },
    "service_tier": null
  }
}
```

更新会话不会更改已保存的 智能体 或其他会话。之后对已保存 智能体 的更新不会更改该会话。

你无法更新 `reasoning.summary`, `text`, `tools`, `instructions`，或者 `multi_agent` 通过此端点更改这些设置。请创建一个新会话来更改这些设置。

## 环境设置

设置 `environment` 会话创建时的 `agent` 它决定了 智能体 在哪里运行命令以及如何处理文件。












选择 `none`, `openai_hosted`，或者 `self_hosted`. [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 说明了何时使用每个选项以及由谁管理环境。

对于 OpenAI 托管的环境，配置任务所需的包、初始文件和网络访问。你可以在多个会话之间复用环境模板。对于自托管环境，请准备好你的计算资源以及 [连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 查看环境字段以及 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) for skills, plugins, and templates. See [会话产物](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解如何在执行后保留你希望保留的文件。