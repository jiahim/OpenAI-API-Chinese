# 运行并延续会话

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

会话会在时间推移中保留智能体的配置、对话和已保存的工作。复用同一个会话即可发送后续消息并继续工作。




## 会话与轮次

轮次是会话内一次完整的工作循环。向处于空闲状态的会话发送消息会开启新一轮。在进行中的轮次内发送消息，则会引导该轮次的方向。

轮次以异步方式运行。你的应用可以通过流式传输来跟踪进度，或通过 [webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).




## 开始任务

创建一个带有 智能体 配置和初始消息的会话 `input`。设置 `stream` 为 `true` ，以便在同一请求中接收第一轮的事件。

使用你的 [API 密钥和配置好的 SDK](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)，运行此示例以创建并运行脚本。OpenAI 会管理其环境：

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
events.withResultCollection();
try {
  for await (const event of events) {
    console.log(JSON.stringify(event));
  }
  const result = await events.finalResult();
  console.log(result.output_text);
  console.log("Session:", result.session_id);
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
    ).with_result_collection() as stream:
        for event in stream:
            print(event.to_json(indent=None), flush=True)
        result = stream.get_final_result()
    print(result.output_text)
    session_id = result.session_id
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
openai.BetaAgentSessionWithResultCollection(events)
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
	fmt.Println(event.RawJSON())
}
result, err := openai.BetaAgentSessionFinalResult(events)
if err != nil {
	panic(err)
}
fmt.Println(result.OutputText())
sessionID := result.SessionID()
fmt.Println("Session:", sessionID)
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import com.openai.services.beta.agents.AgentTurnResults;

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
  AgentTurnResults.withResultCollection(events);
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    System.out.println(json.writeValueAsString(event));
  }
  var result = AgentTurnResults.getFinalResult(events);
  System.out.println(result.outputText());
  String sessionId = result.sessionId();
  System.out.println(sessionId);
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
  events.with_result_collection
  events.each do |event|
    puts JSON.generate(event.to_h)
  end
  result = events.get_final_result
  puts result.output_text
  session_id = result.session_id
  puts "Session: #{session_id}"
ensure
  events.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "agent": {\n      "model": "gpt-6-astra",\n      "instructions": "Write clean code, run it, and report the actual output."\n    },\n    "environment": { "type": "openai_hosted" },\n    "input": "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",\n    "stream": true\n  }\'
```


存储该 `session_id` 以及应用的会话状态。用它来发送后续消息并检索该对话中已保存的内容。

参阅 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration) 了解可复用的 智能体 设置，以及 [架构](https://developers.openai.com/api/docs/guides/agents-api/architecture) 了解环境选择。包含 `environment.type: "none"` 的会话需要初始输入。 [Create session 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 列出了请求字段。

如果会话使用 Files API 附件，文件检查可能会返回带有
`files_api_rate_limit_exceeded`。的 HTTP 429。参阅 [Files API 速率限制](https://developers.openai.com/api/docs/guides/agents-api/errors#files-api-rate-limits)
的恢复步骤。

### 输入大小

智能体运行时接受最大 4 MiB（4,194,304 字节）的请求。请将你的 `input` 和输出 schema（`agent.text.format.schema`）总大小控制在此限制以内，并为 智能体 API 添加的元数据预留一些空间。上传到环境的文件遵循单独的文件 [文件大小限制](https://developers.openai.com/api/docs/guides/agents-api/environments/files#file-limits).




## 跟踪进度并处理结果

Events 会随着 智能体 的工作而报告输出和变化。请检查该轮的最终结果：完成、失败或取消。仅凭会话处于空闲状态并不代表该轮成功。

查找 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled`。同时也要检查 智能体 的输出：即使一轮已完成，也不能保证每个工具调用都成功了。

如果会话需要函数结果或环境连接，请获取并检查 `required_actions`。你的代码必须 [处理函数调用](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 或 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，以便工作能够继续。

参阅 [Events 与 Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 以了解事件类型与负载。






## 继续或引导工作

发送另一条 `agent.session.input.message` 到同一个会话。如果该智能体正在处理消息，则这条消息会引导当前回合。如果会话处于空闲状态，则会基于已有对话开启新回合。

同一个 [输入长度限制](#input-size) 同样适用于后续消息。

已保存的智能体更新仅对新会话生效。若要更改后续回合的模型、推理强度或服务等级，请， [更新其设置](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session).

使用该对话的会话 ID 发送输入。请订阅其 [事件流](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/stream) 在发送消息之前，以便你的应用能够接收到该回合的早期事件。

为每次逻辑消息提交创建一个幂等键。在发送输入之前先将其与消息一起保存。提交消息时使用已保存的键：

发送后续消息

```javascript
// Reuse the same submission key when retrying this message.
async function sendMessage(client, sessionId, text, submissionKey) {
  await client.beta.agents.sessions.events.create(sessionId, {
    "Idempotency-Key": submissionKey,
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
from uuid import uuid4


# Reuse the same submission key when retrying this message.
def send_message(
    client: OpenAI, session_id: str, text: str, submission_key: str
) -> None:
    client.beta.agents.sessions.events.create(
        session_id,
        idempotency_key=submission_key,
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


submission_key = str(uuid4())
# Save this key with the message before submitting it.
```

```go
// Reuse the same submission key when retrying this message.
func sendMessage(ctx context.Context, client *openai.Client, sessionID, text, submissionKey string) error {
	return client.Beta.Agents.Sessions.Events.New(ctx,
		sessionID,
		openai.BetaAgentSessionEventNewParams{
			IdempotencyKey: openai.String(submissionKey),
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
// Reuse the same submission key when retrying this message.
public static void sendMessage(
    OpenAIClient client, String sessionId, String text, String submissionKey) {
  client
      .beta()
      .agents()
      .sessions()
      .events()
      .create(
          EventCreateParams.builder()
              .sessionId(sessionId)
              .idempotencyKey(submissionKey)
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
# Reuse the same submission key when retrying this message.
def send_message(client, session_id, text, submission_key)
  client.beta.agents.sessions.events.create(
    session_id,
    idempotency_key: submission_key,
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
  -H "Idempotency-Key: $submission_key" \
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


通过 `Idempotency-Key` 请求头发送该密钥，并在自动重试时复用它。如果你的应用在超时或响应丢失后进行重试，请复用相同的密钥、会话 ID 和消息。即使消息文本完全相同，也要为每次不同的提交生成不同的密钥。

如需查看发送与流式传输的完整示例，请参阅 [Events 与 Items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#send-and-stream-a-task).






## 检索已保存的工作

事件展示实时进度。条目是已保存的消息和工具调用，包括已完成的响应。检索这些条目以显示之前的工作，或在一轮结束后检查结果：

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


参阅 [管理会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) 以检查会话状态和轮次结果。通过 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).




流不会重放错过的事件。断开连接后，检索会话及其保存的条目以恢复工作。参见 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream) 了解重连过程。

## 取消活动的轮次

当你希望 智能体 停止时，取消当前轮次。会话及其先前的工作仍然可用：

取消当前活动轮次

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