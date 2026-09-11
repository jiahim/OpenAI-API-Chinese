# 配置 智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

智能体配置定义了智能体的行为方式。你可以在创建会话时提供它，也可以保存它以便重复使用。会话负责保存对话和工作内容，而已保存的智能体则用于存放可复用的设置。

## 定义智能体的行为

从模型和指令开始，然后根据任务需要添加工具和控件：

- **Model:** 执行工作的模型。
- **Instructions:** 智能体 应执行的任务以及应具备的行为方式。
- **Tools:** 智能体 可执行的操作，例如搜索网页或调用你的函数。
- **Reasoning and output:** 模型使用的推理量以及响应的格式和详细程度。

在创建会话时传入这些设置 `agent` 。本示例提供了一个模型、指令以及第一条用户消息：

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


请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 了解配置字段和可接受的值。请参阅 [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 与 [MCP connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 了解工具设置， [多智能体](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) 了解任务委派。

## 跨会话复用智能体

保存一个智能体以跨会话复用其配置。只需创建一次，然后在每次启动会话时将其 ID 作为 `agent_id` 传入：

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


每个会话拥有独立的对话和工作内容。请参阅 [智能体 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents) 以列出、获取、更新或删除已保存的智能体。凭据存放在 [vaults](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults)，中，与保存的配置分开。

## 为单个会话覆盖设置

同时包含 `agent_id` 与 `agent` 来自定义使用已保存智能体的会话。会话会继承省略的设置，包括模型。

设为 `OPENAI_AGENT_ID` 已保存智能体的 ID 后再运行本示例：

在单个会话中覆盖智能体

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const agentId = process.env.OPENAI_AGENT_ID;
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
import os
from openai import OpenAI

client = OpenAI()

agent_id = os.environ["OPENAI_AGENT_ID"]
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
import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		AgentID:     openai.String(os.Getenv("OPENAI_AGENT_ID")),
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
                .agentId(System.getenv("OPENAI_AGENT_ID"))
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
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent_id: ENV.fetch("OPENAI_AGENT_ID"),
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


覆盖仅对该会话生效，不会更改已保存的智能体或其他会话。提供的对象和数组会整体替换该字段，而不是与已保存的值合并。例如，提供 `tools` 会替换已保存的工具列表。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 了解请求字段。

## 环境设置

设为 `environment` 与 `agent` 时确定的。它决定智能体在何处运行命令并处理文件。












选择 `none`, `openai_hosted`，或者 `self_hosted`. [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 说明了何时使用每种选项以及由谁管理环境。

对于 OpenAI 托管的环境，配置任务所需的软件包、初始文件和网络访问。你可以跨多个会话复用同一环境模板。对于自托管环境，请准备好你的计算资源，并 [连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 以了解环境字段，以及 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) 以了解技能、插件和模板。参见 [会话产物](https://developers.openai.com/api/docs/guides/agents-api/environments/files) ，了解你要在执行后保留的文件。