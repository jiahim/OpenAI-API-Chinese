# Configuring Agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An agent configuration defines how the agent behaves. You can supply it when creating a session or save it for reuse. The session holds the conversation and work, while the saved agent holds reusable settings.

## Define the agent's behavior

Start with the model and instructions, then add the tools and controls your task needs:

- **Model:** Which model does the work.
- **Instructions:** What the agent should do and how it should behave.
- **Tools:** What actions the agent can take, such as searching the web or calling your functions.
- **Reasoning and output:** How much reasoning the model uses and the format and detail of its responses.

Pass these settings in `agent` when you create a session. This example supplies a model, instructions, and the first user message:

Configure an agent for one session

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


See the [Agents API reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents) for configuration fields and accepted values. See [Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) and [MCP connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) for tool setup, and [Multi-agent](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) for delegation.

## Reuse an agent across sessions

Save an agent to reuse its configuration across sessions. Create it once, then pass its ID as `agent_id` when starting each session:

Reuse an agent

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


Each session has its own conversation and work. See the [Agents API reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents) to list, retrieve, update, or delete saved agents. Credentials stay in [vaults](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults), separate from the saved configuration.

## Override settings for one session

Include both `agent_id` and `agent` to customize a session that uses a saved agent. The session inherits omitted settings, including the model.

Replace the illustrative `agent_123` value with the saved agent's ID before running this example:

Override an agent for one session

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


Overrides apply only to that session. They do not change the saved agent or other sessions. Supplied objects and arrays replace the entire field rather than merging with the saved value. For example, supplying `tools` replaces the saved tool list.

See the [Create session reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) for request fields.

## Environment settings

Set `environment` alongside `agent` when creating a session. It determines where the agent runs commands and works with files.












Choose `none`, `openai_hosted`, or `self_hosted`. [Architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture) explains when to use each option and who manages the environment.

For an OpenAI-hosted environment, configure the packages, initial files, and network access the task needs. You can reuse an environment template across sessions. For a self-hosted environment, prepare your compute and [connect an executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

See the [Create session reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) for environment fields and [Plugins](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) for skills, plugins, and templates. See [Session artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files) for files you want to keep after execution.