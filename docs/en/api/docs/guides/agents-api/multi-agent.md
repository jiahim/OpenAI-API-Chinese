# Multi-agent

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Multi-agent lets an agent delegate tasks to subagents. Each subagent has its own context and can work in parallel with the others. The main agent coordinates their work and combines their results.

## When to use subagents

Use subagents for independent tasks, such as reviewing separate documents or investigating different causes of a failure. Give each task a clear question and expected result.

Keep short tasks and dependent steps in the main agent. Agents that edit the same files must coordinate their changes.




## Enable multi-agent orchestration

Set `agent.multi_agent.enabled` to `true` when you create a session. The harness supplies tools to create, message, wait for, and interrupt subagents. You do not declare these tools yourself.




This example asks two subagents to review separate release notes, then combines their findings. It needs no environment or configured tools:

Compare release notes

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
    multi_agent: { enabled: true, max_concurrent_subagents: 2 },
  },
  environment: { type: "none" },
  input:
    "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
  stream: true,
});
for await (const event of events) {
  console.log(JSON.stringify(event));
}
```

```python
from openai import OpenAI

client = OpenAI()

with client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 2},
    },
    environment={"type": "none"},
    input="Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
    stream=True,
) as events:
    for event in events:
        print(event.model_dump_json())
```

```go
import (
	"context"
	"fmt"
	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra"),
	Instructions: openai.String("Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details."),
	MultiAgent: openai.MultiAgentConfigParam{Enabled: true,
		MaxConcurrentSubagents: openai.Int(2)}},
	Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
	Input:       openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.")}})
defer events.Close()
for events.Next() {
	fmt.Println(events.Current().RawJSON())
}
if err := events.Err(); err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.MultiAgentConfigParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
try (var events =
    client
        .beta()
        .agents()
        .sessions()
        .createStreaming(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Delegate each release to a separate subagent. Ask each to extract"
                                + " customer-visible changes and required migration steps using"
                                + " only its release notes. Wait for both results, then combine"
                                + " them into one release summary with release labels. Do not"
                                + " invent missing details.")
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(2L)
                                .build())
                        .build())
                .environmentNone()
                .input(
                    "Release A: Search now supports filtering by date. Existing queries"
                        + " continue to work. Release B: The export endpoint now returns a"
                        + " download URL instead of file bytes. Update clients to fetch that"
                        + " URL.")
                .build())) {
  events.stream().forEach(System.out::println);
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new

events = client.beta.agents.sessions.create_streaming(
  agent: {
    model: "gpt-6-astra",
    instructions: "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 2
    }
  },
  environment: { type: "none" },
  input: "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL."
)
begin
  events.each { |event| puts JSON.generate(event.to_h) }
ensure
  events.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
      "multi_agent": { "enabled": true, "max_concurrent_subagents": 2 }
    },
    "environment": { "type": "none" },
    "input": "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
    "stream": true
  }'
```


With `environment.type: "none"`, include the initial `input` in the create request. Setting `stream: true` also streams the first turn. See [Session events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for stream handling and recovery.

### Concurrency settings

`max_concurrent_subagents` limits how many subagents can run at once. The default is `6`, excluding the coordinator. Set a positive integer when delegation is enabled.

To disable delegation, omit `multi_agent`, or set `enabled` to `false` and omit the limit. These settings apply at session creation. Changes to a stored agent apply to new sessions.

## Use an environment

When agents need files or command execution, [add an environment](https://developers.openai.com/api/docs/guides/agents-api/architecture). The coordinator and subagents share its filesystem. Creating a subagent does not create another environment.

This example creates a session for work in your own environment:

Enable delegation with your own environment

```javascript
const result = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3,
    },
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
  },
});
```

```python
result = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 3},
    },
    environment={"type": "self_hosted", "workspace_directory": "/workspace"},
)
```

```go
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model:        openai.String("gpt-6-astra"),
			Instructions: openai.String("Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings."),
			MultiAgent: openai.MultiAgentConfigParam{
				Enabled:                true,
				MaxConcurrentSubagents: openai.Int(3),
			},
		},
		Environment: openai.EnvironmentParamUnion{
			OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace"},
		},
	})
if err != nil {
	panic(err)
}
```

```java
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
                        .instructions(
                            "Prepare release notes from the repository. Have one subagent"
                                + " identify customer-visible changes and another check"
                                + " migration guides and examples, then combine their"
                                + " findings.")
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(3L)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .build())
                .build());
```

```ruby
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3
    }
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace"
  }
)
```

```bash
curl https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 3
      }
    },
    "environment": {
      "type": "self_hosted",
      "workspace_directory": "/workspace"
    }
  }'
```


Store the returned session and environment IDs in your application. [Connect the environment](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted), then [send input](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) to start work.

### Tools available to subagents

Subagents inherit configured MCP tools, their credentials and allowed tools, and web search settings. They can also use the environment's files and command-line tools. Subagents do not support [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).

## Observe delegation

The [session event stream](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) reports subagent activity:

- `agent.session.subagent.created` provides the new subagent's ID.
- `agent.session.turn.item.added` and `agent.session.turn.item.done` report coordination actions. Their item types include `create_subagent_call`, `send_subagent_input_call`, `wait_for_subagents_call`, and `interrupt_subagent_call`.

The harness executes these actions. A completed create or wait action does not mean the subagent finished its task. On a create item, `agent_id` identifies the agent that requested the subagent.




Coordination items can omit message content. An `agent_message` item contains inter-agent text when available, but the stream does not provide a full conversation transcript.




Read the main agent's response for the combined result. Use [saved items and turns](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns) to inspect prior work, including each subagent's history.

### Attribute commands

Given a command item and its session ID, retrieve the command's turn to identify the agent that ran it. The turn's `subagent_id` is `null` for the main agent.

Identify the agent that ran a command

```javascript
// Use the saved session ID and command execution item from your application.
const turn = await client.beta.agents.sessions.turns.retrieve(
  command.turn_id,
  { session_id: sessionId }
);
console.log(turn.subagent_id);
```

```python
# Use the saved session ID and command execution item from your application.
turn = client.beta.agents.sessions.turns.retrieve(
    command.turn_id, session_id=session_id
)
print(turn.subagent_id)
```

```go
// Use the saved session ID and command execution item from your application.
turn, err := client.Beta.Agents.Sessions.Turns.Get(ctx, sessionID, item.TurnID)
if err != nil {
	panic(err)
}
fmt.Println(turn.SubagentID)
```

```java
// Use the saved session ID and command execution item from your application.
var turn =
    client
        .beta()
        .agents()
        .sessions()
        .turns()
        .retrieve(
            TurnRetrieveParams.builder()
                .sessionId(sessionId)
                .turnId(command.turnId())
                .build());
System.out.println(turn.subagentId());
```

```ruby
# Use the saved session ID and command execution item from your application.
turn = client.beta.agents.sessions.turns.retrieve(item.turn_id, session_id: session_id)
puts turn.subagent_id
```