# 事件与条目

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 获取。

事件用于报告智能体运行过程中发生的事情。条目是稍后可以检索的已保存消息和工具调用。可使用事件实时更新你的应用，并使用条目展示其保存的历史记录。






你的应用通过发送输入事件来提交消息、取消回合或返回工具结果。智能体则会发送事件，用于报告输出及会话状态的变化。详见 [运行并继续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以了解如何发送输入。




## 消费流

在发送工作之前订阅，这样你的应用就能接收该轮的早期事件。传入你的 API 客户端、会话的会话 ID 以及一个事件处理器：

流式会话事件

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


该助手将每个事件传递给处理器，并检查常见的事件类型。然后在 `agent.session.idle` 时继续，并在根轮次完成时返回。如果根轮次失败或被取消、会话或环境失败，或收到一个 `error` 事件，则会抛出错误。子智能体轮次事件不会结束流。你的处理器决定如何展示输出；调用方处理来自该助手的错误。如果流在轮次结束前关闭，该助手会抛出错误。参见 [恢复断开的流](#how-to-recover-a-disconnected-stream).




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








## 处理更新

使用事件的 `type` 来决定你的应用应该执行的操作：

- **显示文本：** 将增量 `agent.session.turn.output_text.delta` 追加到相关的内容片段。当 `agent.session.turn.output_text.done` 到达时，将该片段替换为其完整文本。增量可能为空。
- **追踪进度：** 会话、轮次和条目事件会报告进度。检查 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled` 以确定轮次的结果。
- **提供所需输入：** 在 `agent.session.requires_action`，时，获取会话并检查 `required_actions`。你的代码可能需要返回函数结果或连接环境。

空闲的会话或已关闭的流本身并不代表成功。一个已完成的回合也不保证每个工具都执行成功。请检查智能体的输出。

使用 `item_id`, `output_index`，以及 `content_index` 将文本更新连接到同一个内容部分。例如，下面这些简化的事件会更新同一个部分：

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

每个事件都有自己的 `event_id`。共享的 `item_id` 用于标识已保存的项，其中包含消息的内容、状态和阶段。请参阅 [检索已保存的工作](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).

请参阅 [流式事件参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/streaming-events) 以了解所有事件类型和字段。这些流事件与 [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks)。不同。有关子智能体活动和命令归属，请参阅 [观察委托](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## 获取项目和对话轮次

使用你应用对话状态中的会话 ID 来检索已保存的工作：

- **会话条目：** [列出条目](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/items/methods/list) 以跨轮次检索根 智能体 的消息和工具调用。
- **轮次：** [列出轮次](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/list) 以浏览会话的工作内容。 [检索轮次](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) 按 ID 检查其状态、时间戳、使用情况和错误。
- **单个轮次的条目：** 对于根 智能体 轮次，按 `turn_id`。筛选会话条目。每个子智能体都有其自己的 [条目历史](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/items/methods/list) 以及一个 [按轮次条目接口](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/turns/subresources/items/methods/list).

列表接口一次返回一页。使用 SDK 分页助手或 `after` 游标获取更多结果。单次返回的页面可能未包含该轮的全部条目。使用 `order: "asc"` 按从旧到新的顺序读取条目。

## 如何恢复断开的流

流不会重放错过的事件。要恢复你应用的视图：

1. 打开一个新的流并缓冲传入的事件。
2. 在流保持连接的同时，检索会话及其已保存的项。
3. 根据这些项，按项 ID 为键恢复你的本地状态。
4. 使用以下方式应用已缓冲的项更新 `item_id`。丢弃那些在检索到的历史记录中已达到最终状态的项的更新。
5. 继续处理实时事件。

一个 `output_text.done` 事件可以用完整的文本替换临时文本缓冲区。已保存的条目可让你恢复已完成的工作，但不能恢复你错过的每个中间事件。