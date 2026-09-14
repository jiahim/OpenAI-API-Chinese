# 配置 智能体

> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

一个智能体配置定义了智能体的行为方式。你可以在创建会话时提供它，或将其保存以供复用。会话负责承载对话与工作内容，而已保存的智能体则保存可复用的设置。

## 定义智能体的行为

从模型和指令开始，然后根据你的任务添加所需的工具和控件：

- **Model：** 负责执行工作的模型。
- **Instructions：** 智能体 应执行的任务以及应遵循的行为方式。
- **Tools：** 智能体 可执行的操作，例如网页搜索或调用你的函数。
- **Reasoning and output：** 模型使用的推理量以及响应的格式和详细程度。

在创建会话时传入这些设置 `agent` 。此示例提供一个模型、指令和第一条用户消息：

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


请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 了解配置字段和可接受的值。请参阅 [函数](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 和 [MCP 连接](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 了解工具设置，以及 [多智能体](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) 了解委托。

## 跨会话复用智能体

保存一个智能体以在多个会话之间复用其配置。只需创建一次，然后在每次启动会话时将其 ID 作为 `agent_id` 传入：

复用智能体

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


每个会话拥有独立的对话和工作内容。参见 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 以列出、获取、更新或删除已保存的智能体。凭据保存在 [保险库](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults)，中，与保存的配置分开存放。

## 覆盖单个会话的设置

同时传入 `agent_id` 和 `agent` 以自定义使用已保存 智能体 的会话。会话会继承未提供的设置，包括模型。

将示例中的 `agent_123` 值替换为已保存 智能体 的 ID，然后再运行此示例：

为单个会话覆盖 智能体

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


覆盖仅作用于该会话。它们不会更改已保存的 智能体 或其他会话。提供的对象和数组会整体替换该字段，而不是与已保存的值合并。例如，提供 `tools` 会替换已保存的工具列表。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 以了解请求字段。

## 环境设置

设置 `environment` 与 `agent` 在创建会话时。它决定智能体运行命令以及处理文件的位置。












选择 `none`, `openai_hosted`，或 `self_hosted`. [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 说明了何时使用每个选项以及由谁来管理环境。

对于OpenAI托管环境，配置任务所需的包、初始文件和网络访问。你可以在多个会话之间复用环境模板。对于自托管环境，准备好你的计算资源，并 [连接一个执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 有关环境字段的信息，请参阅 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) 中了解技能、插件和模板。详见 [会话产物](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解执行后需要保留的文件。