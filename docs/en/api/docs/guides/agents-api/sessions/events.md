# Events and items

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Events report what happens as an agent works. Items are the saved messages and tool calls you can retrieve later. Use events to update your application in real time and items to display its saved history.






Your application sends input events to submit messages, cancel turns, or return tool results. The agent sends events that report output and changes to the session. See [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) for sending input.




## Consume a stream

Subscribe before sending work so your application receives the turn's early events. Pass your API client, the conversation's session ID, and an event handler:

Stream session events

```javascript
// Pass your saved session ID to this helper.
async function streamSession(client, sessionId, handleEvent) {
  const events = await client.beta.agents.sessions.events.stream(sessionId);
  try {
    for await (const event of events) {
      await handleEvent(event);
      switch (event.type) {
        case "agent.session.idle":
          continue;
        case "error":
          throw new Error(event.error.message);
        case "agent.session.failed":
        case "agent.session.environment.failed":
          throw new Error(`Agent lifecycle failure: ${event.type}`);
        case "agent.session.turn.failed":
          if (event.turn.subagent_id === null) {
            throw new Error(
              `${event.type}: ${event.turn.error?.message ?? ""}`
            );
          }
          break;
        case "agent.session.turn.cancelled":
          if (event.turn.subagent_id === null) {
            throw new Error("The agent turn was cancelled");
          }
          break;
        case "agent.session.turn.completed":
          if (event.turn.subagent_id === null) return;
          break;
      }
    }
    throw new Error(
      "Stream closed before a turn ended. Retrieve the saved state."
    );
  } finally {
    events.controller.abort();
  }
}
```

```python
# Pass your saved session ID to this helper.
def stream_session(client: OpenAI, session_id: str, handle_event):
    with client.beta.agents.sessions.events.stream(session_id) as events:
        for event in events:
            handle_event(event)
            match event.type:
                case "agent.session.idle":
                    continue
                case "error":
                    raise RuntimeError(event.error.message)
                case "agent.session.failed" | "agent.session.environment.failed":
                    raise RuntimeError(f"Agent lifecycle failure: {event.type}")
                case "agent.session.turn.failed":
                    if event.turn.subagent_id is None:
                        detail = event.turn.error.message if event.turn.error else ""
                        raise RuntimeError(f"{event.type}: {detail}")
                case "agent.session.turn.cancelled":
                    if event.turn.subagent_id is None:
                        raise RuntimeError("The agent turn was cancelled")
                case "agent.session.turn.completed":
                    if event.turn.subagent_id is None:
                        return
    raise RuntimeError("Stream closed before a turn ended. Retrieve the saved state.")
```

```go
// Pass your saved session ID to this helper.
func streamSession(ctx context.Context, client *openai.Client, sessionID string, handleEvent func(openai.AgentSessionEventUnion)) error {
	events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, sessionID)
	defer events.Close()
	for events.Next() {
		event := events.Current()
		handleEvent(event)
		switch event.Type {
		case "agent.session.idle":
			continue
		case "error":
			return fmt.Errorf("agent error: %s", event.RawJSON())
		case "agent.session.failed", "agent.session.environment.failed":
			return fmt.Errorf("agent lifecycle failure: %s", event.RawJSON())
		case "agent.session.turn.failed", "agent.session.turn.cancelled":
			if event.Turn.SubagentID == "" {
				return fmt.Errorf("agent turn did not complete: %s", event.RawJSON())
			}
		case "agent.session.turn.completed":
			if event.Turn.SubagentID == "" {
				return nil
			}
		}
	}
	if err := events.Err(); err != nil {
		return err
	}
	return fmt.Errorf("stream closed before a turn ended; retrieve the saved state")
}
```

```java
// Pass your saved session ID to this helper.
public static void streamSession(
    OpenAIClient client, String sessionId, Consumer<AgentSessionEvent> handleEvent) {
  try (StreamResponse<AgentSessionEvent> events =
      client.beta().agents().sessions().events().streamStreaming(sessionId)) {
    var iterator = events.stream().iterator();
    while (iterator.hasNext()) {
      var event = iterator.next();
      handleEvent.accept(event);
      if (event.idle().isPresent()) {
        continue;
      }
      if (event.error().isPresent()) {
        throw new IllegalStateException("Agent error: " + event);
      }
      if (event.failed().isPresent() || event.environmentFailed().isPresent()) {
        throw new IllegalStateException("Agent lifecycle failure: " + event);
      }
      if (event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        throw new IllegalStateException("Agent turn did not complete: " + event);
      }
      if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        return;
      }
    }
    throw new IllegalStateException(
        "Stream closed before a turn ended. Retrieve the saved state.");
  }
}
```

```ruby
# Pass your saved session ID to this helper.
def stream_session(client, session_id, &handle_event)
  events = client.beta.agents.sessions.events.stream_streaming(session_id)
  begin
    events.each do |event|
      handle_event.call(event)
      case event.type.to_s
      when "agent.session.idle"
        next
      when "error"
        raise event.error.message
      when "agent.session.failed", "agent.session.environment.failed"
        raise "Agent lifecycle failure: #{event.type}"
      when "agent.session.turn.failed"
        raise "#{event.type}: #{event.turn.error&.message}" if event.turn.subagent_id.nil?
      when "agent.session.turn.cancelled"
        raise "The agent turn was cancelled" if event.turn.subagent_id.nil?
      when "agent.session.turn.completed"
        return nil if event.turn.subagent_id.nil?
      end
    end
    raise "Stream closed before a turn ended. Retrieve the saved state."
  ensure
    events.close
  end
end
```

```bash
curl -N \
  "https://api.openai.com/v1/agents/sessions/$session_id/events?stream=true" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Accept: text/event-stream"
```


The helper passes each event to your handler, then checks common event types. It continues on `agent.session.idle` and returns when the root turn completes. It raises an error if the root turn fails or is cancelled, the session or environment fails, or an `error` event arrives. Subagent turn events do not end the stream. Your handler decides how to display output; the caller handles errors from the helper. If the stream closes before a turn ends, the helper raises an error. See [Recover a disconnected stream](#how-to-recover-a-disconnected-stream).




<details>
<summary>Send a message after subscribing</summary>

This version accepts a message and submits it after opening the stream:

Send and stream a message

```javascript
// Pass your saved session ID and message to this helper.
async function sendAndStream(client, sessionId, text, handleEvent) {
  const events = await client.beta.agents.sessions.events.stream(sessionId);
  try {
    await client.beta.agents.sessions.events.create(sessionId, {
      events: [
        {
          type: "agent.session.input.message",
          input: [{ role: "user", content: [{ type: "input_text", text }] }],
        },
      ],
    });
    for await (const event of events) {
      await handleEvent(event);
      switch (event.type) {
        case "agent.session.idle":
          continue;
        case "error":
          throw new Error(event.error.message);
        case "agent.session.failed":
        case "agent.session.environment.failed":
          throw new Error(`Agent lifecycle failure: ${event.type}`);
        case "agent.session.turn.failed":
          if (event.turn.subagent_id === null) {
            throw new Error(
              `${event.type}: ${event.turn.error?.message ?? ""}`
            );
          }
          break;
        case "agent.session.turn.cancelled":
          if (event.turn.subagent_id === null) {
            throw new Error("The agent turn was cancelled");
          }
          break;
        case "agent.session.turn.completed":
          if (event.turn.subagent_id === null) return;
          break;
      }
    }
    throw new Error(
      "Stream closed before a turn ended. Retrieve the saved state."
    );
  } finally {
    events.controller.abort();
  }
}
```

```python
# Pass your saved session ID and message to this helper.
def send_and_stream(client: OpenAI, session_id: str, text, handle_event):
    with client.beta.agents.sessions.events.stream(session_id) as events:
        client.beta.agents.sessions.events.create(
            session_id,
            events=[
                {
                    "type": "agent.session.input.message",
                    "input": [
                        {
                            "role": "user",
                            "content": [{"type": "input_text", "text": text}],
                        }
                    ],
                }
            ],
        )
        for event in events:
            handle_event(event)
            match event.type:
                case "agent.session.idle":
                    continue
                case "error":
                    raise RuntimeError(event.error.message)
                case "agent.session.failed" | "agent.session.environment.failed":
                    raise RuntimeError(f"Agent lifecycle failure: {event.type}")
                case "agent.session.turn.failed":
                    if event.turn.subagent_id is None:
                        detail = event.turn.error.message if event.turn.error else ""
                        raise RuntimeError(f"{event.type}: {detail}")
                case "agent.session.turn.cancelled":
                    if event.turn.subagent_id is None:
                        raise RuntimeError("The agent turn was cancelled")
                case "agent.session.turn.completed":
                    if event.turn.subagent_id is None:
                        return
    raise RuntimeError("Stream closed before a turn ended. Retrieve the saved state.")
```

```go
// Pass your saved session ID and message to this helper.
func sendAndStream(ctx context.Context, client *openai.Client, sessionID string, text string, handleEvent func(openai.AgentSessionEventUnion)) error {
	events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, sessionID)
	defer events.Close()
	if err := events.Err(); err != nil {
		return err
	}
	err := client.Beta.Agents.Sessions.Events.New(ctx,
		sessionID,
		openai.BetaAgentSessionEventNewParams{
			Events: []openai.AgentSessionInputParamUnion{
				{
					OfParamAgentSessionInputMessage: &openai.AgentSessionInputParamAgentSessionInputMessage{
						Input: []openai.AgentSessionInputMessageParam{
							{
								Content: []openai.InputContentParamUnion{
									{
										OfParamInputText: &openai.InputContentParamInputText{
											Text: text,
										},
									},
								},
							},
						},
					},
				},
			},
		})
	if err != nil {
		return err
	}
	for events.Next() {
		event := events.Current()
		handleEvent(event)
		switch event.Type {
		case "agent.session.idle":
			continue
		case "error":
			return fmt.Errorf("agent error: %s", event.RawJSON())
		case "agent.session.failed", "agent.session.environment.failed":
			return fmt.Errorf("agent lifecycle failure: %s", event.RawJSON())
		case "agent.session.turn.failed", "agent.session.turn.cancelled":
			if event.Turn.SubagentID == "" {
				return fmt.Errorf("agent turn did not complete: %s", event.RawJSON())
			}
		case "agent.session.turn.completed":
			if event.Turn.SubagentID == "" {
				return nil
			}
		}
	}
	if err := events.Err(); err != nil {
		return err
	}
	return fmt.Errorf("stream closed before a turn ended; retrieve the saved state")
}
```

```java
// Pass your saved session ID and message to this helper.
public static void sendAndStream(
    OpenAIClient client, String sessionId, String text, Consumer<AgentSessionEvent> handleEvent) {
  try (StreamResponse<AgentSessionEvent> events =
      client.beta().agents().sessions().events().streamStreaming(sessionId)) {
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
    var iterator = events.stream().iterator();
    while (iterator.hasNext()) {
      var event = iterator.next();
      handleEvent.accept(event);
      if (event.idle().isPresent()) {
        continue;
      }
      if (event.error().isPresent()) {
        throw new IllegalStateException("Agent error: " + event);
      }
      if (event.failed().isPresent() || event.environmentFailed().isPresent()) {
        throw new IllegalStateException("Agent lifecycle failure: " + event);
      }
      if (event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        throw new IllegalStateException("Agent turn did not complete: " + event);
      }
      if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        return;
      }
    }
    throw new IllegalStateException(
        "Stream closed before a turn ended. Retrieve the saved state.");
  }
}
```

```ruby
# Pass your saved session ID and message to this helper.
def send_and_stream(client, session_id, text, &handle_event)
  events = client.beta.agents.sessions.events.stream_streaming(session_id)
  begin
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
    events.each do |event|
      handle_event.call(event)
      case event.type.to_s
      when "agent.session.idle"
        next
      when "error"
        raise event.error.message
      when "agent.session.failed", "agent.session.environment.failed"
        raise "Agent lifecycle failure: #{event.type}"
      when "agent.session.turn.failed"
        raise "#{event.type}: #{event.turn.error&.message}" if event.turn.subagent_id.nil?
      when "agent.session.turn.cancelled"
        raise "The agent turn was cancelled" if event.turn.subagent_id.nil?
      when "agent.session.turn.completed"
        return nil if event.turn.subagent_id.nil?
      end
    end
    raise "Stream closed before a turn ended. Retrieve the saved state."
  ensure
    events.close
  end
end
```


</details>








## Handle updates

Use the event's `type` to decide what your application should do:

- **Display text:** Append `agent.session.turn.output_text.delta` to the relevant content part. When `agent.session.turn.output_text.done` arrives, replace that part with its complete text. Deltas may be absent.
- **Track work:** Session, turn, and item events report progress. Check for `agent.session.turn.completed`, `agent.session.turn.failed`, or `agent.session.turn.cancelled` to determine the turn's outcome.
- **Provide required input:** On `agent.session.requires_action`, retrieve the session and inspect `required_actions`. Your code may need to return a function result or connect an environment.

An idle session or a closed stream alone does not establish success. A completed turn also does not guarantee that every tool succeeded. Inspect the agent's output.

Use `item_id`, `output_index`, and `content_index` to connect text updates to the same content part. For example, these abbreviated events update one part:

```json
{
  "type": "agent.session.turn.output_text.delta",
  "item_id": "msg_789",
  "output_index": 0,
  "content_index": 0,
  "delta": "Acme competes"
}
```

```json
{
  "type": "agent.session.turn.output_text.done",
  "item_id": "msg_789",
  "output_index": 0,
  "content_index": 0,
  "text": "Acme competes on price and distribution."
}
```

Each event has its own `event_id`. The shared `item_id` identifies the saved item, which includes the message's content, status, and phase. See [Retrieve saved work](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).

See the [streaming events reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/streaming-events) for all event types and fields. These stream events are distinct from [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks). For subagent activity and command attribution, see [Observe delegation](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## Fetch items and turns

Use the session ID from your application's conversation state to retrieve saved work:

- **Session items:** [List items](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/items/methods/list) to retrieve the root agent's messages and tool calls across turns.
- **Turns:** [List turns](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/list) to browse the session's work. [Retrieve a turn](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) by ID to inspect its status, timestamps, usage, and error.
- **Items from one turn:** For a root-agent turn, filter session items by `turn_id`. Each subagent has its own [item history](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/items/methods/list) and a [per-turn items endpoint](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/turns/subresources/items/methods/list).

List endpoints return one page at a time. Use SDK pagination helpers or the `after` cursor to retrieve more results. A single page may not contain every item for a turn. Use `order: "asc"` to read items from oldest to newest.

## How to recover a disconnected stream

Streams do not replay missed events. To restore your application's view:

1. Open a new stream and buffer incoming events.
2. Retrieve the session and its saved items while the stream stays connected.
3. Restore your local state from those items, keyed by item ID.
4. Apply buffered item updates using `item_id`. Discard updates for items that already reached their final state in the retrieved history.
5. Resume handling live events.

An `output_text.done` event can replace a temporary text buffer with the complete text. Saved items let you recover completed work, but not every intermediate event you missed.