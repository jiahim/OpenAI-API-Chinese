# Observability and usage

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Track live agent activity, inspect completed work, and review detailed turn traces:

1. You can view the session logs in the Platform dashboard.
2. You can follow the session through its events and saved history.
3. You can inspect turns and identify delegated command execution.
4. You can inspect recorded token usage for root-agent and subagent turns.

## View the session in the dashboard

Go to [platform.openai.com/logs?api=agents](https://platform.openai.com/logs?api=agents) and open the **Agents** tab.

Search for a session by ID to inspect its turns, tool calls, and subagents.

Use the [Tracing guide](https://developers.openai.com/api/docs/guides/agents-api/tracing) to inspect recorded model responses, tool calls, and subagent activity in the dashboard. Trace retrieval and external trace exporters are not part of the public beta API.

## Follow events and inspect session history

Every session exposes an event stream that shows what the agent is doing in real time. Set `OPENAI_API_KEY` and `SESSION_ID` before running these examples:

Follow live session events

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.events.stream(
  process.env.SESSION_ID
);
try {
  for await (const event of events) {
    if (
      [
        "agent.session.turn.failed",
        "agent.session.turn.cancelled",
        "agent.session.failed",
        "agent.session.environment.failed",
        "error",
      ].includes(event.type)
    ) {
      throw new Error(`Agent lifecycle failure: ${event.type}`);
    }
    console.log(JSON.stringify(event));
  }
} finally {
  events.controller.abort();
}
```

```python
import os
from openai import OpenAI

client = OpenAI()
session_id = os.environ["SESSION_ID"]
with client.beta.agents.sessions.events.stream(session_id) as events:
    for event in events:
        if event.type in {
            "agent.session.turn.failed",
            "agent.session.turn.cancelled",
            "agent.session.failed",
            "agent.session.environment.failed",
            "error",
        }:
            raise RuntimeError(f"Agent lifecycle failure: {event.type}")
        print(event.to_json(indent=None))
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
events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, os.Getenv("SESSION_ID"))
defer events.Close()
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
	switch event.Type {
	case "agent.session.turn.failed", "agent.session.turn.cancelled", "agent.session.failed", "agent.session.environment.failed", "error":
		panic(event.RawJSON())
	}
	fmt.Println(event.RawJSON())
}
if err := events.Err(); err != nil {
	panic(err)
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client.beta().agents().sessions().events().streamStreaming(System.getenv("SESSION_ID"))) {
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    if (event.turnFailed().isPresent()
        || event.turnCancelled().isPresent()
        || event.failed().isPresent()
        || event.environmentFailed().isPresent()
        || event.error().isPresent()) {
      throw new IllegalStateException("Agent failed: " + event);
    }
    System.out.println(json.writeValueAsString(event));
  }
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.events.stream_streaming(ENV.fetch("SESSION_ID"))
begin
  events.each do |event|
    case event.type.to_s
    when "agent.session.turn.failed", "agent.session.turn.cancelled", "agent.session.failed", "agent.session.environment.failed", "error"
      raise "Agent failed: #{event.to_h}"
    end
    puts JSON.generate(event.to_h)
  end
ensure
  events.close
end
```

```bash
curl -N \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Accept: text/event-stream" \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/events?stream=true"
```


The stream stays open across idle events so you don't miss queued work. Press **Ctrl+C** to stop watching.

As the session runs, you’ll see events such as:

```text
agent.session.environment.connected
agent.session.turn.created
agent.session.turn.in_progress
agent.session.turn.item.added
agent.session.turn.output_text.delta
agent.session.turn.completed
agent.session.idle
```

To inspect work that has already happened, retrieve the session’s saved items:

Inspect saved session items

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = process.env.SESSION_ID;
const items = await client.beta.agents.sessions.items.list(sessionId, {
  order: "asc",
  limit: 100,
});
console.log(items.data);
```

```python
import os
from openai import OpenAI

client = OpenAI()

session_id = os.environ["SESSION_ID"]
items = client.beta.agents.sessions.items.list(session_id, order="asc", limit=100)
print(items.to_json())
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
result, err := client.Beta.Agents.Sessions.Items.List(ctx,
	os.Getenv("SESSION_ID"),
	openai.BetaAgentSessionItemListParams{
		Order: "asc",
		Limit: openai.Int(100),
	})
if err != nil {
	panic(err)
}
fmt.Println(result.Data)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.sessions.items.ItemListParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .items()
        .list(
            ItemListParams.builder()
                .sessionId(System.getenv("SESSION_ID"))
                .order(ItemListParams.Order.of("asc"))
                .limit(100L)
                .build());
System.out.println(result.items());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.items.list(
  ENV.fetch("SESSION_ID"),
  order: "asc",
  limit: 100
)
puts result.data
```

```bash
curl \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/items?order=asc&limit=100"
```


## Inspect turns and identify delegated commands

Session turns are available through the public API. Set `TURN_ID` from a command item in addition to `OPENAI_API_KEY` and `SESSION_ID`. The cURL example requires `jq`:

Identify delegated command execution

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = process.env.SESSION_ID;
const turns = await client.beta.agents.sessions.turns.list(sessionId, {
  limit: 20,
  order: "desc",
});
console.log(turns.data);
const turnId = process.env.TURN_ID;
const turn = await client.beta.agents.sessions.turns.retrieve(turnId, {
  session_id: sessionId,
});
console.log(turn.subagent_id);
```

```python
import os
from openai import OpenAI

client = OpenAI()

session_id = os.environ["SESSION_ID"]
turns = client.beta.agents.sessions.turns.list(session_id, limit=20, order="desc")
print(turns.to_json())
turn_id = os.environ["TURN_ID"]
turn = client.beta.agents.sessions.turns.retrieve(turn_id, session_id=session_id)
print(turn.subagent_id)
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
result, err := client.Beta.Agents.Sessions.Turns.List(ctx,
	os.Getenv("SESSION_ID"),
	openai.BetaAgentSessionTurnListParams{
		Limit: openai.Int(20),
		Order: "desc",
	})
if err != nil {
	panic(err)
}
fmt.Println(result.Data)
turn, err := client.Beta.Agents.Sessions.Turns.Get(ctx,
	os.Getenv("SESSION_ID"),
	os.Getenv("TURN_ID"))
if err != nil {
	panic(err)
}
fmt.Println(turn.SubagentID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.sessions.turns.TurnListParams;
import com.openai.models.beta.agents.sessions.turns.TurnRetrieveParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .turns()
        .list(
            TurnListParams.builder()
                .sessionId(System.getenv("SESSION_ID"))
                .limit(20L)
                .order(TurnListParams.Order.of("desc"))
                .build());
System.out.println(result.items());
var turn =
    client
        .beta()
        .agents()
        .sessions()
        .turns()
        .retrieve(
            TurnRetrieveParams.builder()
                .turnId(System.getenv("TURN_ID"))
                .sessionId(System.getenv("SESSION_ID"))
                .build());
System.out.println(turn.subagentId());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.turns.list(
  ENV.fetch("SESSION_ID"),
  limit: 20,
  order: "desc"
)
puts result.data
turn = client.beta.agents.sessions.turns.retrieve(
  ENV.fetch("TURN_ID"),
  session_id: ENV.fetch("SESSION_ID")
)
puts turn.subagent_id
```

```bash
curl "https://api.openai.com/v1/agents/sessions/$SESSION_ID/turns?limit=20&order=desc" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

curl "https://api.openai.com/v1/agents/sessions/$SESSION_ID/turns/$TURN_ID" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.subagent_id'
```


Use the returned `last_id` as the next page's `after` value when `has_more` is `true`.

Command items contain `turn_id`. Retrieve that turn and read `subagent_id` to identify the delegated agent that ran the command. A `null` subagent ID identifies root-agent work. Command-output truncation is not reported.

## Inspect a turn trace

Use the Platform dashboard to inspect a completed turn and its agent activity.
Detailed trace retrieval is not available through an ordinary project API key. Dashboard trace endpoints require separate access and are not a
supported customer API.

Turn resources include best-effort `usage` and a `subagent_id` that identifies delegated work. Usage can be `null` when unknown and may change. See [Inspect subagent token usage](#inspect-subagent-token-usage).

To attribute a shell command, retrieve the turn identified by its command item's
`turn_id`, then inspect `turn.subagent_id`. The customer API does not indicate
whether command output was truncated.

## Model usage and cost

An agent may make several model calls while completing a task. Each call follows the model's [token pricing](https://developers.openai.com/api/docs/pricing) and [prompt-caching rules](https://developers.openai.com/api/docs/guides/prompt-caching), as in the Responses API. Estimate cost across all calls needed to complete the task.

### What contributes to cost?

Each model call can consume:

- **Input tokens:** agent instructions, tool definitions, conversation history, user input, files or images, and tool results.
- **Cached input tokens:** input reused from a matching prompt prefix, billed at the model's cached-input rate.
- **Output tokens:** generated text, tool-call arguments, and reasoning.

Reasoning tokens are billed as output tokens.

Subagents can also make model calls. Inspect their recorded [turn usage](#inspect-subagent-token-usage) alongside root-agent work when investigating model costs.

Account for root-agent and subagent work, including retries, plus any applicable tool, sandbox compute, and third-party service charges. For models with cache-write pricing, writing input to the cache also has a cost. The Agents API usage fields below do not expose a separate cache-write count, so they cannot determine the exact model charge when that pricing applies.

### Prompt caching

Agents carry context forward within a session. When successive model calls share the same prompt prefix, prompt caching can reuse its earlier processing. The model generates a new response; caching does not replay an old answer. Maintaining a session does not guarantee a cache hit. Reuse depends on a matching prefix and the model's cache eligibility and lifetime rules.

Keep initial instructions and tool definitions stable where practical, and put new task details in follow-up messages. With [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api), discovered definitions are added at the end of the conversation, preserving earlier content for cache reuse. See [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) for model-specific rules.

A high cached-input percentage does not measure savings on the total task cost. Cached input is still billed, and repeated calls can process a large history. Compare the cost of completing the same task at the quality and latency your application needs.

### Understand token usage

Session and turn resources expose best-effort `usage`. It can be `null` when unknown, and recorded counts may change as accounting arrives. Missing usage does not mean zero usage. These counts are not a final bill.

A recorded usage object contains these token categories:

```json
{
  "input_tokens": 5000,
  "input_tokens_details": {
    "cached_tokens": 1500
  },
  "output_tokens": 900,
  "output_tokens_details": {
    "reasoning_tokens": 200
  },
  "total_tokens": 5900
}
```

In this example, the agent processed 5,000 input tokens and generated 900 output tokens. Of the input tokens, 1,500 were cached. Of the output tokens, 200 were reasoning tokens.

Cached tokens are included in `input_tokens`, and reasoning tokens are included in `output_tokens`.

### Inspect subagent token usage

List or retrieve [session turns](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-session-turns) and inspect each turn's `usage`. The `subagent_id` identifies the subagent; it is `null` for root-agent turns. When `has_more` is `true`, pass `last_id` as `after` with the same `order` to read the remaining turns.

Usage is best-effort: it can be `null` when unknown, and recorded values may change. You can also inspect each agent's recorded usage in the [tracing dashboard](https://developers.openai.com/api/docs/guides/agents-api/tracing#token-usage).