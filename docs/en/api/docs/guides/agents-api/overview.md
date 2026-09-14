# Agents API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The Agents API gives your application access to the Codex harness through an OpenAI-managed API.

OpenAI manages sessions, orchestration, context compaction, and recovery while your application provides tools and chooses its execution environment.

Agents can operate in a sandbox where they can execute code, edit files, connect to MCP servers, and produce artifacts.

## Pricing

Model usage is billed at the selected model's [API rates](https://developers.openai.com/api/docs/pricing). OpenAI tools use their [standard rates](https://developers.openai.com/api/docs/pricing#built-in-tools), and OpenAI-hosted sandboxes use standard [container rates](https://developers.openai.com/api/docs/pricing#built-in-tools).

## Try an example

Try these complete examples:

- [Create and run a directory-tree script](https://developers.openai.com/api/docs/guides/agents-api/quickstart#1-run-a-task) in an OpenAI-hosted sandbox.
- [Compare release notes with subagents](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes) and combine their findings into one answer.

Explore complete applications:

- [Incident response agent](https://developers.openai.com/showcase/agents-api-sev-bot): investigate alerts and request approval for recovery actions.
- [Slack bot](https://developers.openai.com/showcase/agents-api-slack-bot): investigate requests using connected workplace tools.
- [Data analyst](https://developers.openai.com/showcase/agents-api-data-analyst): answer warehouse questions with read-only SQL.
- [GitHub issue investigator](https://developers.openai.com/showcase/agents-api-github-issues): reproduce reported bugs and share findings on GitHub.
- [Document reviewer](https://developers.openai.com/showcase/agents-api-document-review): review documents with policy skills and specialist agents.

## Core concepts

The Agents API is built around four main concepts:

- **Agent:** The model, instructions, tools, and MCP servers available to the agent.
- **Environment:** An optional sandbox or computer where the agent accesses files, loads skills, and runs commands.
- **Session:** A durable instance of an agent that works on tasks and responds to input.
- **Events and items:** The inputs sent to an agent and the output produced during a session.

### A session from start to finish

Start with an OpenAI-hosted sandbox in the [quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart):

1. **Create a session.** Configure the agent; OpenAI provisions its environment.
2. **Give it a task.** User input starts a turn of work once the environment is ready.
3. **Follow progress.** Stream output or use webhooks to learn when the agent finishes or needs input.
4. **Continue or steer.** Send another task to the same session, or guide the agent during its current turn.

With an OpenAI-hosted session, your application sends input and receives events, while OpenAI runs the agent and provisions and manages its sandbox. See [environment options](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings) for setup and limitations.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/overview-1-mobile.webp"
    width="680"
    height="1288"
  />
  <img src="https://developers.openai.com/images/api/agents-api/overview-1.webp"
    width="1400"
    height="552"
    alt="Your application starts sessions and receives events and output from the Agents API. OpenAI runs the managed Codex harness and provisions and manages its sandbox."
    loading="lazy"
  />
</picture>

## What the managed harness provides

The managed Codex harness supports:

- Running commands and code in a sandbox.
- Applying relevant skills and instructions.
- Connecting to external data through tools or MCP.
- Steering the agent while it works.
- Summarizing previous work to manage its context window.
- Breaking work into subtasks and delegating to subagents.
- Resuming a session where it left off.

Check the [quickstart prerequisites](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites) for API-key permissions and SDK setup. Configure these capabilities when you create a session:

Configure managed-harness capabilities

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
    tools: [
      { type: "programmatic_tool_calling" },
      {
        type: "mcp",
        server_label: "openai_docs",
        transport: {
          type: "http",
          server_url: "https://developers.openai.com/mcp",
        },
      },
      { type: "web_search" },
    ],
    multi_agent: { enabled: true, max_concurrent_subagents: 4 },
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/capabilities/skills"],
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup.",
        },
      ],
    },
  ],
});
console.log(session.id);
```

```python
from openai import OpenAI

client = OpenAI()

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
        "tools": [
            {"type": "programmatic_tool_calling"},
            {
                "type": "mcp",
                "server_label": "openai_docs",
                "transport": {
                    "type": "http",
                    "server_url": "https://developers.openai.com/mcp",
                },
            },
            {"type": "web_search"},
        ],
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 4},
    },
    environment={
        "type": "self_hosted",
        "workspace_directory": "/workspace",
        "capability_directories": ["/workspace/capabilities/skills"],
    },
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup.",
                }
            ],
        }
    ],
)
print(session.id)
```

```go
import (
	"context"
	"fmt"
	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
session, err := client.Beta.Agents.Sessions.New(ctx, openai.BetaAgentSessionNewParams{Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra"),
	Instructions: openai.String("Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful."),
	Tools: []openai.AgentToolParamUnion{openai.AgentToolParamUnion{OfParamProgrammaticToolCalling: &openai.AgentToolParamProgrammaticToolCalling{}},
		openai.AgentToolParamUnion{OfParamMcp: &openai.AgentToolParamMcp{ServerLabel: "openai_docs",
			Transport: openai.McpTransportParamUnion{OfParamHTTP: &openai.McpTransportParamHTTP{ServerURL: "https://developers.openai.com/mcp"}}}},
		openai.AgentToolParamUnion{OfParamWebSearch: &openai.AgentToolParamWebSearch{}}},
	MultiAgent: openai.MultiAgentConfigParam{Enabled: true,
		MaxConcurrentSubagents: openai.Int(4)}},
	Environment: openai.EnvironmentParamUnion{OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace",
		CapabilityDirectories: []string{"/workspace/capabilities/skills"}}},
	Input: openai.BetaAgentSessionNewParamsInputUnion{OfArrayOfInputMessages: []openai.AgentSessionInputMessageParam{openai.AgentSessionInputMessageParam{Content: []openai.InputContentParamUnion{openai.InputContentParamUnion{OfParamInputText: &openai.InputContentParamInputText{Text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."}}}}}}})
if err != nil {
	panic(err)
}
fmt.Println(session.ID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentToolParam;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.McpTransportParam;
import com.openai.models.beta.agents.MultiAgentConfigParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import java.util.List;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var session =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Use the OpenAI documentation MCP and web search to answer"
                                + " technical questions accurately. Delegate independent"
                                + " research tasks to subagents when useful.")
                        .addTool(AgentToolParam.ProgrammaticToolCalling.builder().build())
                        .addTool(
                            AgentToolParam.Mcp.builder()
                                .serverLabel("openai_docs")
                                .transport(
                                    McpTransportParam.Http.builder()
                                        .serverUrl("https://developers.openai.com/mcp")
                                        .build())
                                .build())
                        .addTool(AgentToolParam.WebSearch.builder().build())
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(4L)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .capabilityDirectories(List.of("/workspace/capabilities/skills"))
                        .build())
                .input(
                    "Research how to connect an MCP server to an OpenAI agent, check for recent"
                        + " updates, and summarize the recommended setup.")
                .build());
System.out.println(session.id());
```

```ruby
require "openai"

client = OpenAI::Client.new

session = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
    tools: [
      { type: "programmatic_tool_calling" },
      {
        type: "mcp",
        server_label: "openai_docs",
        transport: {
          type: "http",
          server_url: "https://developers.openai.com/mcp"
        }
      },
      { type: "web_search" }
    ],
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 4
    }
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/capabilities/skills"]
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."
        }
      ]
    }
  ]
)
puts session.id
```

```bash
curl -sS -X POST "https://api.openai.com/v1/agents/sessions" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
      "tools": [
        {
          "type": "programmatic_tool_calling"
        },
        {
          "type": "mcp",
          "server_label": "openai_docs",
          "transport": {
            "type": "http",
            "server_url": "https://developers.openai.com/mcp"
          }
        },
        {
          "type": "web_search"
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 4
      }
    },
    "environment": {
      "type": "self_hosted",
      "workspace_directory": "/workspace",
      "capability_directories": ["/workspace/capabilities/skills"]
    },
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."
          }
        ]
      }
    ]
  }'
```





For a runtime comparison, see the [Agents overview](https://developers.openai.com/api/docs/guides/agents#compare-agent-runtimes).

The Agents API retains session state so you can continue work across turns without
  rebuilding the conversation context. You can delete sessions and published
  artifacts when you no longer need them.
  The Agents API currently supports data residency only in the United States and
  does not support Zero Data Retention (ZDR). Choosing a self-hosted sandbox does
  not make the Agents API ZDR-eligible. See [Data controls
  in the OpenAI platform](https://developers.openai.com/api/docs/guides/your-data#storage-requirements-and-retention-controls-per-endpoint)
  for details on data residency and retention.