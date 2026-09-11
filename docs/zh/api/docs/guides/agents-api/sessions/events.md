# 事件与条目

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

事件用于报告智能体运行过程中发生的事情。条目是之后可以检索到的已保存消息和工具调用。可使用事件实时更新应用，并使用条目展示其已保存的历史记录。






你的应用会发送输入事件来提交消息、取消轮次或返回工具结果。智能体则会发送事件，报告输出及会话的变化。详见 [运行并延续会话](https://developers.openai.com/api/docs/guides/agents-api/sessions) 以了解如何发送输入。




## 消费流

在发送工作之前订阅，以便你的应用能够接收该轮次的早期事件。传入你的 API 客户端、会话的会话 ID 和一个事件处理器：

流式会话事件

```javascript
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
        case "agent.session.turn.completed":
        case "agent.session.turn.failed":
        case "agent.session.turn.cancelled":
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
def stream_session(client: OpenAI, session_id: str, handle_event):
    with client.beta.agents.sessions.events.stream(session_id) as events:
        for event in events:
            handle_event(event)
            match event.type:
                case "agent.session.idle":
                    continue
                case "error":
                    raise RuntimeError(event.error.message)
                case (
                    "agent.session.turn.completed"
                    | "agent.session.turn.failed"
                    | "agent.session.turn.cancelled"
                ):
                    if event.turn.subagent_id is None:
                        return
    raise RuntimeError("Stream closed before a turn ended. Retrieve the saved state.")
```

```go
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
		case "agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled":
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
      if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        return;
      }
    }
    throw new IllegalStateException(
        "Stream closed before a turn ended. Retrieve the saved state.");
  }
}
```

```ruby
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
      when "agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"
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


该辅助函数将每个事件传递给你的处理器，然后检查常见的事件类型。它在 `agent.session.idle`，时继续，在 `error`，时引发，并在轮次完成、失败或取消时关闭。你的处理器决定如何显示输出以及如何处理结果。如果流在轮次结束之前关闭，该辅助函数将引发错误。请参阅 [恢复断开的流](#how-to-recover-a-disconnected-stream).




<details>
<summary>Send a message after subscribing</summary>

This version accepts a message and submits it after opening the stream:

Send and stream a message

```javascript
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
        case "agent.session.turn.completed":
        case "agent.session.turn.failed":
        case "agent.session.turn.cancelled":
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
                case (
                    "agent.session.turn.completed"
                    | "agent.session.turn.failed"
                    | "agent.session.turn.cancelled"
                ):
                    if event.turn.subagent_id is None:
                        return
    raise RuntimeError("Stream closed before a turn ended. Retrieve the saved state.")
```

```go
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
		case "agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled":
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
      if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        return;
      }
    }
    throw new IllegalStateException(
        "Stream closed before a turn ended. Retrieve the saved state.");
  }
}
```

```ruby
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
      when "agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"
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

使用事件的 `type` 来决定你的应用应该做什么：

- **显示文本：** 追加 `agent.session.turn.output_text.delta` 到相关的内容部分。当 `agent.session.turn.output_text.done` 到达时，用完整文本替换该部分。增量可能不存在。
- **追踪工作进度：** 会话、轮次和条目事件报告进度。请检查 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled` 以确定该轮次的结果。
- **提供所需的输入：** 在 `agent.session.requires_action`，时，检索该会话并检查 `required_actions`。你的代码可能需要返回函数结果或连接环境。

空闲的会话或已关闭的流本身并不代表成功。一个已完成的回合也不能保证所有工具都成功了。请检查 智能体 的输出。

使用 `item_id`, `output_index`，以及 `content_index` 将文本更新连接到同一个内容部分。例如，下面这些简化后的事件会更新同一个部分：

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

每个事件都有自己的 `event_id`。共享的 `item_id` 用于标识已保存的项，其中包含消息的内容、状态和阶段。参见 [检索已保存的工作](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).

请参阅 [流式事件参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/streaming-events) 了解所有事件类型和字段。这些流式事件不同于 [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks)。有关子智能体活动和命令归属，请参阅 [观察委托](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## 获取条目与轮次

使用你应用对话状态中的会话 ID 来检索已保存的工作：

- **会话项：** [列出项](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/items/methods/list) 以检索根 智能体在多个轮次中的消息和工具调用。
- **轮次：** [列出轮次](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/list) 以浏览该会话的工作内容。 [检索轮次](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) 通过 ID 以查看其状态、时间戳、用量和错误信息。
- **单个轮次的项：** 对于根 智能体轮次，按以下方式过滤会话项： `turn_id`。每个子智能体都有自己的 [项历史](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/items/methods/list) 以及一个 [按轮次的项端点](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/subagents/subresources/turns/subresources/items/methods/list).

列表端点一次返回一页结果。使用 SDK 分页辅助函数或 `after` 游标以获取更多结果。单个页面可能不包含某个回合的所有项。使用 `order: "asc"` 以从最旧到最新的顺序读取项。

## 如何恢复断开的流

流不会重放错过的事件。若要恢复应用的视图：

1. 打开新的流并缓冲传入的事件。
2. 在流保持连接的同时，检索会话及其已保存的项目。
3. 根据这些项目恢复本地状态，以项目 ID 作为键。
4. 使用以下方式应用已缓冲的项目更新： `item_id`。丢弃那些在检索到的历史记录中已达到最终状态的项目的更新。
5. 继续处理实时事件。

一个 `output_text.done` 事件可以用完整的文本替换临时文本缓冲区。已保存的项可让你恢复已完成的工作，但无法恢复你错过的每个中间事件。