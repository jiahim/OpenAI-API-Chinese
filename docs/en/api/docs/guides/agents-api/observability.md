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

Every session exposes an event stream that shows what the agent is doing in real time. Set `OPENAI_API_KEY` and replace the illustrative session ID in these examples with your saved session ID:

Follow live session events

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.events.stream("sess_123");
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
# Replace the illustrative IDs and URLs below with your own resource values.
from openai import OpenAI

client = OpenAI()
session_id = "sess_123"
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
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, "sess_123")
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
// Replace the illustrative IDs and URLs below with your own resource values.
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client.beta().agents().sessions().events().streamStreaming("sess_123")) {
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
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.events.stream_streaming("sess_123")
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
  "https://api.openai.com/v1/agents/sessions/sess_123/events?stream=true"
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
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = "sess_123";
const items = await client.beta.agents.sessions.items.list(sessionId, {
  order: "asc",
  limit: 100,
});
console.log(items.data);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
from openai import OpenAI

client = OpenAI()

session_id = "sess_123"
items = client.beta.agents.sessions.items.list(session_id, order="asc", limit=100)
print(items.to_json())
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
result, err := client.Beta.Agents.Sessions.Items.List(ctx,
	"sess_123",
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
// Replace the illustrative IDs and URLs below with your own resource values.
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
                .sessionId("sess_123")
                .order(ItemListParams.Order.of("asc"))
                .limit(100L)
                .build());
System.out.println(result.items());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.items.list(
  "sess_123",
  order: "asc",
  limit: 100
)
puts result.data
```

```bash
curl \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  "https://api.openai.com/v1/agents/sessions/sess_123/items?order=asc&limit=100"
```


## Inspect turns and identify delegated commands

Session turns are available through the public API. Use the `turn_id` from a command item with your saved session ID. The cURL example requires `jq`:

Identify delegated command execution

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = "sess_123";
const turns = await client.beta.agents.sessions.turns.list(sessionId, {
  limit: 20,
  order: "desc",
});
console.log(turns.data);
const turnId = "turn_123";
const turn = await client.beta.agents.sessions.turns.retrieve(turnId, {
  session_id: sessionId,
});
console.log(turn.subagent_id);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
from openai import OpenAI

client = OpenAI()

session_id = "sess_123"
turns = client.beta.agents.sessions.turns.list(session_id, limit=20, order="desc")
print(turns.to_json())
turn_id = "turn_123"
turn = client.beta.agents.sessions.turns.retrieve(turn_id, session_id=session_id)
print(turn.subagent_id)
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
result, err := client.Beta.Agents.Sessions.Turns.List(ctx,
	"sess_123",
	openai.BetaAgentSessionTurnListParams{
		Limit: openai.Int(20),
		Order: "desc",
	})
if err != nil {
	panic(err)
}
fmt.Println(result.Data)
turn, err := client.Beta.Agents.Sessions.Turns.Get(ctx,
	"sess_123",
	"turn_123")
if err != nil {
	panic(err)
}
fmt.Println(turn.SubagentID)
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
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
                .sessionId("sess_123")
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
            TurnRetrieveParams.builder().turnId("turn_123").sessionId("sess_123").build());
System.out.println(turn.subagentId());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.turns.list(
  "sess_123",
  limit: 20,
  order: "desc"
)
puts result.data
turn = client.beta.agents.sessions.turns.retrieve(
  "turn_123",
  session_id: "sess_123"
)
puts turn.subagent_id
```

```bash
curl "https://api.openai.com/v1/agents/sessions/sess_123/turns?limit=20&order=desc" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

curl "https://api.openai.com/v1/agents/sessions/sess_123/turns/turn_123" \
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