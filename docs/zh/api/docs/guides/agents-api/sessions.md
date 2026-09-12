# 运行并延续会话

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

会话用于在长时间跨度内保留智能体的配置、对话和已保存的工作。复用同一个会话即可发送后续消息并继续工作。




## 会话与轮次

一轮是会话内的一次工作循环。向空闲会话发送消息会开启新一轮。在活跃轮次中发送消息则会引导该轮。

轮次以异步方式运行。你的应用可以通过流式传输来跟踪进度，或通过 [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).




## 开始工作

使用 智能体 配置和初始输入创建一个会话 `input`。将 `stream` 设置为 `true` ，以便在同一请求中接收第一轮的事件。

配置好你的 [API 密钥和 SDK 后](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)，运行此示例以创建并运行脚本。OpenAI 管理其环境：

创建会话并流式传输其第一轮

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


将会话 ID 与你应用的对话状态一起存储。 `session_id` 使用它来发送后续消息并检索该对话中保存的内容。

参见 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration) ，了解可复用的 智能体 设置，以及 [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 了解环境选择。带有 `environment.type: "none"` 的会话需要提供初始输入。 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 列出了请求字段。




## 跟踪进度并处理结果

Events 会随着 智能体 的运行而输出并变化。请检查本轮的结果：完成、失败或取消。仅凭会话处于空闲状态并不意味着本轮执行成功。

查找 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled`。同时检查 智能体 的输出：本轮完成并不保证每个工具调用都成功。

如果会话需要函数结果或环境连接，请获取它并检查 `required_actions`。你的代码必须 [处理函数调用](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 或 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，以便工作可以继续。

参见 [Events 与 Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) ，了解事件类型与负载。






## 延续或调整工作方向

发送另一条消息 `agent.session.input.message` 到同一个会话。如果 智能体 正在工作，该消息会引导当前的轮次。如果会话处于空闲状态，则会基于已有对话开启一个新的轮次。

使用该会话的会话 ID 来发送输入。订阅其 [事件流](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/stream) 后再发送消息，这样你的应用就能接收到该轮次早期的事件。

将你的 API 客户端、会话 ID 和消息传递给应用中的一个函数：

发送后续消息

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


如需查看发送与流式传输的组合示例，请参阅 [Events 与 Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#send-and-stream-a-task).






## Retrieve saved work

事件展示实时进度。条目是已保存的消息和工具调用，包括已完成的响应。检索它们以显示之前的工作或在轮次结束后检查结果：

检索会话条目

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


参见 [管理会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) 来检查会话状态和轮次结果。通过以下方式检索文件 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).




流不会重放错过的事件。断开连接后，检索会话及其已保存的条目以恢复工作。参见 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream) 了解重连步骤。

## 取消活动的轮次

当你希望 智能体停止时，取消当前轮次。会话及其先前的工作仍然可用：

取消当前轮次

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