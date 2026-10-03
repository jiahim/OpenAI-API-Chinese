# 可观测性与使用情况

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

跟踪实时的智能体活动，检查已完成的工作，并审阅详细的轮次追踪：

1. 你可以在 Platform 控制台中查看会话日志。
2. 你可以通过事件和保存的历史记录跟踪会话。
3. 你可以查看各个回合，并识别委派的命令执行。
4. 你可以查看根智能体和子智能体回合中记录的 token 使用情况。

## 在仪表板中查看会话

前往 [platform.openai.com/logs?api=智能体](https://platform.openai.com/logs?api=agents) 并打开 **智能体** 标签页。

按 ID 搜索会话，以查看其对话轮次、工具调用和子智能体。

参考 [追踪指南](https://developers.openai.com/api/docs/guides/agents-api/tracing) 在仪表板中查看已记录的模型响应、工具调用和子智能体活动，或 [导出会话追踪](https://developers.openai.com/api/docs/guides/agents-api/tracing#export-session-traces) 通过公共 API 导出为 OTLP JSON。

## 跟踪事件并查看会话历史

每个会话都会公开一个事件流，用于实时显示智能体正在执行的操作。设置 `OPENAI_API_KEY` 并将示例中的示例性会话 ID 替换为你已保存的会话 ID：

跟踪实时会话事件

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


即使在空闲事件期间，流也会保持打开，以便你不会错过已排队的工作。按下 **Ctrl+C** 即可停止监听。

会话运行时，你会看到类似以下的事件：

```text
agent.session.environment.connected
agent.session.turn.created
agent.session.turn.in_progress
agent.session.turn.item.added
agent.session.turn.output_text.delta
agent.session.turn.completed
agent.session.idle
```

若要查看已经完成的工作，可检索该会话已保存的条目：

检查已保存的会话条目

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


## 检视回合并识别已委派的命令

会话轮次可通过公共 API 获取。使用 `turn_id` 通过你保存的会话 ID 获取命令项的内容。cURL 示例需要 `jq`:

识别委托的命令执行

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


使用返回的 `last_id` 作为下一页的 `after` 值，当 `has_more` 为 `true`.

命令项包含 `turn_id`。检索该轮次并读取 `subagent_id` 以识别运行该命令的委托智能体。一个 `null` 子智能体 ID 用于识别根智能体工作。不会报告命令输出的截断情况。

## 检查一轮对话追踪

使用 Platform 控制台查看已完成的轮次及其 智能体 活动。
若要通过公共 API 获取已记录的追踪，请使用 [session 追踪 导出端点](https://developers.openai.com/api/docs/guides/agents-api/tracing#export-session-traces) 配合项目 API 密钥调用。控制台 追踪 端点与受支持的客户 API 相互独立。

Turn 资源包含尽力提供的 `usage` 以及一个 `subagent_id` 用于标识已委托的工作。相关用量可在未知时 `null` 且可能会发生变化。详见 [检查子智能体令牌用量](#inspect-subagent-token-usage).

若要归因某个 shell 命令，可通过其命令项的
`turn_id`，获取对应的轮次，然后查看 `turn.subagent_id`。客户 API 不会指明
命令输出是否被截断。

## 错误与恢复

请参阅 [错误处理与恢复](https://developers.openai.com/api/docs/guides/agents-api/errors) 以检查失败情况，
选择恢复策略并安全地重试。

## 模型使用量与费用

一个智能体在完成任务时可能会进行多次模型调用。每次调用都遵循模型的 [token 定价](https://developers.openai.com/api/docs/pricing) 和 [提示缓存规则](https://developers.openai.com/api/docs/guides/prompt-caching)，与 Responses API 一致。请估算完成任务所需的所有调用的成本。

### 哪些因素会影响成本？

每次模型调用可能会消耗：

- **输入 token：** 智能体 指令、工具定义、对话历史、用户输入、文件或图像，以及工具结果。
- **缓存输入 token：** 由匹配的前缀 prompt 复用而来的输入，按模型的缓存输入费率计费。
- **输出 token：** 生成的文本、工具调用参数以及推理。

推理令牌按输出令牌计费。

子智能体也可以发起模型调用。检查它们记录的 [轮次用量](#inspect-subagent-token-usage) ，以便在排查模型成本时与根智能体的工作一起分析。

核算根智能体和子智能体的工作（包括重试），以及任何适用的工具、沙盒算力和第三方服务费用。对于采用缓存写入定价的模型，将输入写入缓存也会产生费用。下方的 智能体 API 用量字段并未单独暴露缓存写入次数，因此在适用该定价时无法据此确定准确的模型费用。

### Prompt caching

智能体会在一个会话内将上下文向后传递。当连续模型调用共享相同的前缀提示时，提示缓存可以复用其早期处理结果。模型会生成新的回复；缓存并不会回放旧答案。维护会话并不能保证命中缓存。是否复用取决于前缀是否匹配，以及模型的缓存资格与生命周期规则。

在可行的情况下保持初始指令和工具定义的稳定，并将新任务细节放在后续消息中。使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api)，时，发现到的定义会被添加到对话末尾，从而保留先前的内容以便复用缓存。参见 [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 了解特定模型的规则。

较高的缓存输入占比并不能反映在整个任务成本上的节省程度。缓存输入仍会计费，并且重复调用可能会处理大量历史记录。请根据你的应用所需的生成质量和延迟，比较完成相同任务时的成本。

### 了解 token 使用情况

会话和轮次资源会尽力提供 `usage`。它可能 `null` 时表示未知，且记录的计数可能随着核算数据到达而发生变化。缺少用量记录并不代表用量为零。这些计数并非最终账单。

记录的用量对象包含以下 token 类别：

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

在此示例中，智能体 处理了 5,000 个输入 token 并生成了 900 个输出 token。在输入 token 中，有 1,500 个来自缓存。在输出 token 中，有 200 个是推理 token。

缓存 token 已包含在 `input_tokens`，中，推理 token 已包含在 `output_tokens`.

### 检查子智能体的令牌用量

列出或检索 [会话轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-session-turns) 并检查每个轮次的 `usage`。 `subagent_id` 标识子智能体；对于根 `null` root-智能体 轮次为 `has_more` 为 `true`，传入 `last_id` 作为 `after` 并使用相同的 `order` 以读取剩余的轮次。

用量为尽力而为：在未知时可能为 `null` ，并且记录的值可能会变化。你也可以在智能体仪表板中检查每个智能体的记录用量 [追踪 仪表板](https://developers.openai.com/api/docs/guides/agents-api/tracing#token-usage).