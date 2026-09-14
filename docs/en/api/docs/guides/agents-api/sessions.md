# Run and continue sessions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

A session keeps an agent's configuration, conversation, and saved work over time. Reuse the same session to send follow-up messages and continue the work.




## Sessions and turns

A turn is one cycle of work within a session. A message sent to an idle session starts a new turn. A message sent during an active turn steers that turn.

Turns run asynchronously. Your application can follow progress through streaming or receive session state changes through [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).




## Start work

Create a session with an agent configuration and initial `input`. Set `stream` to `true` to receive events from the first turn in the same request.

With your [API key and SDK configured](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites), run this example to create and run a script. OpenAI manages its environment:

Create a session and stream its first turn

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output.",
  },
  environment: { type: "openai_hosted" },
  input:
    "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
  stream: true,
});
try {
  for await (const event of events) {
    console.log(JSON.stringify(event));
  }
} finally {
  events.controller.abort();
}
```

```python
from openai import OpenAI

with OpenAI() as client:
    with client.beta.agents.sessions.create(
        agent={
            "model": "gpt-6-astra",
            "instructions": "Write clean code, run it, and report the actual output.",
        },
        environment={"type": "openai_hosted"},
        input="Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
        stream=True,
    ) as events:
        for event in events:
            print(event.to_json(indent=None), flush=True)
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{
	Agent: openai.BetaAgentSessionNewParamsAgent{
		Model:        openai.String("gpt-6-astra"),
		Instructions: openai.String("Write clean code, run it, and report the actual output."),
	},
	Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{}},
	Input: openai.BetaAgentSessionNewParamsInputUnion{
		OfString: openai.String("Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."),
	},
})
defer events.Close()
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
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
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client
        .beta()
        .agents()
        .sessions()
        .createStreaming(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions("Write clean code, run it, and report the actual output.")
                        .build())
                .environment(EnvironmentParam.OpenAIHosted.builder().build())
                .input(
                    "Create tree.py, a Python script that prints a readable tree of the files"
                        + " in the current directory. Run it and show me the output.")
                .build())) {
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    System.out.println(json.writeValueAsString(event));
  }
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.create_streaming(
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output."
  },
  environment: { type: "openai_hosted" },
  input: "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."
)
begin
  events.each do |event|
    puts JSON.generate(event.to_h)
  end
ensure
  events.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "agent": {\n      "model": "gpt-6-astra",\n      "instructions": "Write clean code, run it, and report the actual output."\n    },\n    "environment": { "type": "openai_hosted" },\n    "input": "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",\n    "stream": true\n  }\'
```


Store the `session_id` with your application's conversation state. Use it to send follow-up messages and retrieve saved work for that conversation.

See [Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) for reusable agent settings and [Architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture) for environment choices. Sessions with `environment.type: "none"` require initial input. The [Create session reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) lists the request fields.




## Follow progress and handle outcomes

Events report output and changes as the agent works. Check the turn's outcome: completion, failure, or cancellation. An idle session alone does not mean the turn succeeded.

Look for `agent.session.turn.completed`, `agent.session.turn.failed`, or `agent.session.turn.cancelled`. Inspect the agent's output too: a completed turn does not guarantee every tool succeeded.

If the session needs a function result or an environment connection, retrieve it and inspect `required_actions`. Your code must [handle the function call](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) or [connect the environment](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) so work can continue.

See [Events and Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for event types and payloads.






## Continue or steer the work

Send another `agent.session.input.message` to the same session. If the agent is working, the message steers the active turn. If the session is idle, it starts a new turn with the existing conversation.

Use the conversation's session ID to send input. Subscribe to its [event stream](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/stream) before sending the message so your application receives the turn's early events.

Pass your API client, session ID, and message to a function in your application:

Send a follow-up message

```javascript
// Pass your saved session ID and message to this helper.
async function sendMessage(client, sessionId, text) {
  await client.beta.agents.sessions.events.create(sessionId, {
    events: [
      {
        type: "agent.session.input.message",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text,
              },
            ],
          },
        ],
      },
    ],
  });
}
```

```python
# Pass your saved session ID and message to this helper.
def send_message(client: OpenAI, session_id: str, text: str) -> None:
    client.beta.agents.sessions.events.create(
        session_id,
        events=[
            {
                "type": "agent.session.input.message",
                "input": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": text,
                            }
                        ],
                    }
                ],
            }
        ],
    )
```

```go
// Pass your saved session ID and message to this helper.
func sendMessage(ctx context.Context, client *openai.Client, sessionID, text string) error {
	return client.Beta.Agents.Sessions.Events.New(ctx,
		sessionID,
		openai.BetaAgentSessionEventNewParams{
			Events: []openai.AgentSessionInputParamUnion{
				{
					OfParamAgentSessionInputMessage: &openai.AgentSessionInputParamAgentSessionInputMessage{
						Input: []openai.AgentSessionInputMessageParam{
							{
								Content: []openai.InputContentParamUnion{
									{
										OfParamInputText: &openai.InputContentParamInputText{Text: text},
									},
								},
							},
						},
					},
				},
			},
		})
}
```

```java
// Pass your saved session ID and message to this helper.
public static void sendMessage(OpenAIClient client, String sessionId, String text) {
  client
      .beta()
      .agents()
      .sessions()
      .events()
      .create(
          EventCreateParams.builder()
              .sessionId(sessionId)
              .addEvent(
                  AgentSessionInputParam.AgentSessionInputMessage.builder()
                      .addInput(
                          AgentSessionInputMessageParam.builder()
                              .addInputTextContent(text)
                              .build())
                      .build())
              .build());
}
```

```ruby
# Pass your saved session ID and message to this helper.
def send_message(client, session_id, text)
  client.beta.agents.sessions.events.create(
    session_id,
    events: [
      {
        type: "agent.session.input.message",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: text
              }
            ]
          }
        ]
      }
    ]
  )
end
```

```bash
curl \
  "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "type": "agent.session.input.message",
        "input": [
          {
            "role": "user",
            "content": [
              {
                "type": "input_text",
                "text": "List the files in the current directory."
              }
            ]
          }
        ]
      }
    ]
  }'
```


For a combined send-and-stream example, see [Events and Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#send-and-stream-a-task).






## Retrieve saved work

Events show live progress. Items are the saved messages and tool calls, including completed responses. Retrieve them to display previous work or inspect results after a turn ends:

Retrieve session items

```javascript
// Pass your saved session ID to this helper.
async function listItems(client, sessionId) {
  return client.beta.agents.sessions.items.list(sessionId, {
    order: "asc",
    limit: 100,
  });
}
```

```python
# Pass your saved session ID to this helper.
def list_items(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.items.list(session_id, order="asc", limit=100)
```

```go
// Pass your saved session ID to this helper.
func listItems(ctx context.Context, client *openai.Client, sessionID string) (*pagination.CursorPage[openai.AgentSessionItemUnion], error) {
	return client.Beta.Agents.Sessions.Items.List(ctx,
		sessionID,
		openai.BetaAgentSessionItemListParams{
			Order: "asc",
			Limit: openai.Int(100),
		})
}
```

```java
// Pass your saved session ID to this helper.
public static ItemListPage listItems(OpenAIClient client, String sessionId) {
  return client
      .beta()
      .agents()
      .sessions()
      .items()
      .list(
          ItemListParams.builder()
              .sessionId(sessionId)
              .order(ItemListParams.Order.of("asc"))
              .limit(100L)
              .build());
}
```

```ruby
# Pass your saved session ID to this helper.
def list_items(client, session_id)
  client.beta.agents.sessions.items.list(
    session_id,
    order: "asc",
    limit: 100
  )
end
```

```bash
curl \
  "https://api.openai.com/v1/agents/sessions/$session_id/items?order=asc&limit=100" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


See [Managing sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) to inspect session state and turn outcomes. Retrieve files through [Files and artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files).




Streams do not replay missed events. After a disconnect, retrieve the session and its saved items to recover the work. See [Recover a disconnected stream](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream) for the reconnection procedure.

## Cancel an active turn

Cancel the current turn when you want the agent to stop. The session and its previous work remain available:

Cancel the active turn

```javascript
// Pass your saved session ID to this helper.
async function cancelTurn(client, sessionId) {
  await client.beta.agents.sessions.events.create(sessionId, {
    events: [{ type: "agent.session.input.cancel" }],
  });
}
```

```python
# Pass your saved session ID to this helper.
def cancel_turn(client: OpenAI, session_id: str) -> None:
    client.beta.agents.sessions.events.create(
        session_id, events=[{"type": "agent.session.input.cancel"}]
    )
```

```go
// Pass your saved session ID to this helper.
func cancelTurn(ctx context.Context, client *openai.Client, sessionID string) error {
	return client.Beta.Agents.Sessions.Events.New(ctx,
		sessionID,
		openai.BetaAgentSessionEventNewParams{
			Events: []openai.AgentSessionInputParamUnion{
				{OfParamAgentSessionInputCancel: &openai.AgentSessionInputParamAgentSessionInputCancel{}},
			},
		})
}
```

```java
// Pass your saved session ID to this helper.
public static void cancelTurn(OpenAIClient client, String sessionId) {
  client
      .beta()
      .agents()
      .sessions()
      .events()
      .create(
          EventCreateParams.builder()
              .sessionId(sessionId)
              .addEventAgentSessionInputCancel()
              .build());
}
```

```ruby
# Pass your saved session ID to this helper.
def cancel_turn(client, session_id)
  client.beta.agents.sessions.events.create(
    session_id,
    events: [{ type: "agent.session.input.cancel" }]
  )
end
```

```bash
curl "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"agent.session.input.cancel"}]}'
```