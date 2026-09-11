# 运行并延续会话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

会话用于在多次交互中保留智能体的配置、对话记录和已保存的工作内容。复用同一会话即可发送后续消息，继续相关工作。




## 会话与轮次

回合是会话内的一次工作循环。向空闲会话发送的消息会开启新回合。在进行中的回合内发送的消息会引导该回合。

回合以异步方式运行。你的应用可以通过流式传输来跟踪进度，或通过 [webhook](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).




## Start work

使用 智能体 配置和初始消息创建一个会话 `input`。设置 `stream` 为 `true` 以在同一个请求中接收第一轮的事件。

配置好你的 [API 密钥和 SDK 后](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)，运行以下示例以创建并执行一个脚本。OpenAI 会管理其环境：

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


存储 `session_id` 以及你应用的对话状态。使用它发送后续消息并检索该对话中保存的内容。

请参阅 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration) 了解可复用的 智能体 设置，以及 [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 了解环境选择。包含 `environment.type: "none"` 的会话需要初始输入。 [Create session 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 列出了请求字段。




## 追踪进度并处理结果

Events 会随着 智能体 的运行而上报输出和变化。检查该轮的结果：完成、失败或取消。仅凭空闲会话本身并不能说明该轮已成功。

查找 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled`。同时检查 智能体 的输出：完成的轮次并不保证每个工具都成功了。

如果会话需要函数结果或环境连接，请获取它并检查 `required_actions`。你的代码必须 [处理函数调用](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 或 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，以便工作可以继续进行。

请参阅 [事件与条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 中了解事件类型和负载。






## 延续或引导工作

再次发送 `agent.session.input.message` 到同一会话。如果智能体正在处理消息，则该消息会引导当前进行中的轮次。如果会话处于空闲状态，它会基于现有对话开启新一轮次。

使用该会话的会话 ID 来发送输入。订阅其 [事件流](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/stream) 之后再发送消息，这样你的应用就能收到该轮次的早期事件。

将你的 API 客户端、会话 ID 和消息传递给应用中的某个函数：

发送后续消息

```javascript
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


有关发送并流式接收的合并示例，请参阅 [事件与条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#send-and-stream-a-task).






## 检索已保存的工作

事件展示实时进度。条目（Items）是已保存的消息和工具调用，包括已完成的响应。检索它们以在回合结束后展示先前的工作或查看结果：

检索会话条目

```javascript
async function listItems(client, sessionId) {
  return client.beta.agents.sessions.items.list(sessionId, {
    order: "asc",
    limit: 100,
  });
}
```

```python
def list_items(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.items.list(session_id, order="asc", limit=100)
```

```go
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


请参阅 [管理会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) 以查看会话状态和回合结果。通过 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).




流不会重放错过的事件。断开连接后，请检索会话及其已保存的条目以恢复工作。参阅 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream) 了解重连步骤。

## 取消一个进行中的轮次

当你希望 智能体 停止时，取消当前轮次。会话及其之前的工作仍然可用：

取消活动轮次

```javascript
async function cancelTurn(client, sessionId) {
  await client.beta.agents.sessions.events.create(sessionId, {
    events: [{ type: "agent.session.input.cancel" }],
  });
}
```

```python
def cancel_turn(client: OpenAI, session_id: str) -> None:
    client.beta.agents.sessions.events.create(
        session_id, events=[{"type": "agent.session.input.cancel"}]
    )
```

```go
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