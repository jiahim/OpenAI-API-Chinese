# 运行并延续会话

> 完整文档索引请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

会话会在一段时间内保持智能体的配置、对话和已保存的工作。复用同一个会话即可发送后续消息并继续该工作。




## 会话与轮次

轮次（turn）是会话内一次完整的工作循环。向处于空闲状态的会话发送消息会开启一个新轮次。在处于活动状态的轮次内发送消息则会对该轮次进行引导。

轮次以异步方式运行。你的应用可以通过流式传输来跟踪进度，或通过 [webhook](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).




## 开始工作

使用 智能体 配置和初始输入创建一个会话 `input`。设置 `stream` 为 `true` 以在同一次请求中接收第一轮的事件。

使用你的 [API 密钥和 SDK 配置](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)，运行此示例以创建并运行一个脚本。由 OpenAI 管理其环境：

创建一个会话并流式传输其第一轮

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


存储该 `session_id` 以及你应用的会话状态。使用它发送后续消息并检索该会话的已保存工作。

请参阅 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration) 了解可复用的 智能体 设置，以及 [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 了解环境选择。带有 `environment.type: "none"` 的会话需要初始输入。该 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 列出了请求字段。




## 跟进进度并处理结果

事件会在 智能体 运行过程中持续输出并发生变化。请检查该轮的结果：成功完成、失败或被取消。仅凭会话处于空闲状态并不能说明该轮已成功。

查找 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled`。同时检查 智能体 的输出：即使某一轮已完成，也不代表每个工具调用都成功了。

如果会话需要某个函数结果或环境连接，请获取并检查 `required_actions`。你的代码必须 [处理函数调用](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 或 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，以便工作可以继续进行。

请参阅 [事件与条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) ，了解事件类型与负载。






## 继续或调整工作方向

再发送一条 `agent.session.input.message` 到同一个会话。如果智能体正在运行，这条消息会引导当前轮次；如果会话空闲，则会用既有对话开启新的一轮。

已保存的智能体更新只会作用于新会话。要修改本会话后续轮次的模型、推理强度或服务层级，请， [更新其设置](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session).

使用对话的会话 ID 发送输入，并订阅其 [事件流](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/stream) 在发送消息之前订阅，以便你的应用能够接收到该轮次中的早期事件。

将你的API 客户端、会话 ID 和消息传给应用中的函数：

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


有关发送与流式接收的合并示例，请参阅 [事件与条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#send-and-stream-a-task).






## Retrieve saved work

事件显示实时进度。条目是已保存的消息和工具调用，包括已完成的响应。检索它们以显示之前的工作，或在回合结束后检查结果：

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


请参阅 [管理会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) 以检查会话状态和回合结果。通过 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).




流不会重放错过的事件。断开连接后，检索会话及其已保存的条目以恢复工作。参见 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream) 了解重连过程。

## 取消正在进行的轮次

当你希望 智能体 停止时，取消当前轮次。会话及其之前的工作仍然可用：

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