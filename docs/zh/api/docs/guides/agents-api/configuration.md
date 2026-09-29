# 配置智能体

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

智能体配置定义了智能体的行为方式。你可以在创建会话时提供它，也可以保存它以便重复使用。会话承载对话和工作内容，而保存的智能体则保存可复用的设置。

## 定义智能体的行为

从模型和指令开始，然后根据你的任务需要添加工具和控件：

- **Model:** 执行工作的模型。
- **Instructions:** 智能体 应执行的任务及其行为方式。
- **Tools:** 智能体 可执行的操作，例如网页搜索或调用你的函数。
- **Reasoning and output:** 模型使用的推理量以及回复的格式和详细程度。

在创建会话时传入这些设置 `agent` 。此示例提供了一个模型、指令以及第一条用户消息：

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


请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 以了解配置字段和值。相关设置请参阅 [函数](https://developers.openai.com/api/docs/guides/agents-api/tools/functions), [计算机使用](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use), [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp)，或 [多智能体委派](https://developers.openai.com/api/docs/guides/agents-api/multi-agent).

## 跨会话复用智能体

保存一个 智能体 以便在各个会话中复用其配置。只需创建一次，然后在启动每个会话时将其 ID 作为 `agent_id` 传入：

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


每个会话都有自己的对话和工作。请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 来列出、获取、更新或删除已保存的 智能体。凭据存储在 [vaults](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults)，中，与已保存的配置分离。

## 更新已保存的智能体

已保存的智能体更新仅对新会话生效。每个会话在创建时都会复制已保存的配置，并在后续轮次中保留这些设置。要修改现有会话， [请更新其设置](#update-settings-for-an-existing-session).

更新已保存的智能体时：

- 省略的字段保留其已保存的值。仅更改 `model` 会保留 `reasoning`, `service_tier`，以及 `text`.
- 提供的对象会替换整个字段。仅提供 `reasoning` 时同样会清除已保存的 `effort` 也会清除已保存的 `summary`.
- `null` 会重置接受它的字段。例如， `reasoning: null` 可恢复模型的默认 effort。

在同一请求中更改或重置新模型不支持的任何设置。

## 覆盖单个会话的设置

同时包含 `agent_id` 和 `agent` 创建会话以自定义已保存的智能体配置。会话在创建时会从已保存的智能体复制未提供的设置，包括模型。

将示例中的 `agent_123` 值替换为已保存的智能体的 ID，然后再运行此示例：

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


覆盖仅作用于该会话，不会更改已保存的智能体或其他会话。提供的对象和数组会替换整个字段，而不是与已保存的值合并。例如，提供 `tools` 会替换已保存的工具列表。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 了解请求字段。

## 更新现有会话的设置

发送 `POST /v1/agents/sessions/{session_id}` 一个 `agent` 对象以更改 `model`, `reasoning.effort`，或 `service_tier` 的设置，单个会话内生效。这些设置在 beta 和正式版 API 合约中可用。你可以在同一请求中更新 `metadata` 。

更改仅适用于更新完成后发送的消息所开启的新轮次。已在传输中的消息仍会沿用之前的设置。进行中的轮次会保留其原有设置，包括你在发送引导消息时也是如此。单会话保留其对话历史。所选模型必须支持更新后的设置，否则更新将失败。

- 该 `agent` 和 `reasoning` 对象会将提供的字段合并到当前设置中。未提供的字段保持不变，包括推理摘要。仅更改 `model` 会保留会话的推理强度和服务层级。
- `reasoning.effort: null` 会将推理强度重置为所选模型的默认值。
- `service_tier: null` 会恢复自动层级选择。
- 模型必须始终设置，因此不能提供 `model: null`。 `agent` 和 `reasoning` 对象也会拒绝 `null`.
- `metadata` 会替换整个映射。省略它以保留元数据，或传入 `null` 或 `{}` 以清除它。

例如，下面的请求会更改推理强度，并让 API 自动选择服务等级：

```json
{
  "agent": {
    "reasoning": { "effort": "low" },
    "service_tier": null
  }
}
```

更新会话不会更改已保存的 智能体 或其他会话。之后对已保存 智能体 的更新也不会更改该会话。

你无法通过此端点更新 `reasoning.summary`, `text`, `tools`, `instructions`，或 `multi_agent` 。若要更改这些设置，请新建一个会话。

## 环境设置

设置 `environment` 在创建会话时 `agent` 。它决定了 智能体 在哪里运行命令以及处理文件。












选择 `none`, `openai_hosted`，或 `self_hosted`. [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 说明何时使用每个选项以及由谁管理环境。

对于 OpenAI 托管的环境， [选择容器大小](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#choose-a-container-size) 并配置任务所需的包、初始文件和网络访问。你可以在多个会话之间复用环境模板。对于自托管环境，请准备好你的计算资源，并 [连接一个执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 获取环境字段，并参阅 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) 了解技能、插件和模板。请参阅 [会话制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解执行后需要保留的文件。