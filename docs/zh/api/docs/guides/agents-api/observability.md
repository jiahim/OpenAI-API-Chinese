# 可观测性与用量

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾追加 `.md` 。

跟踪实时智能体活动、检查已完成的工作，并查看详细的轮次追踪：

1. 你可以在 Platform 控制台中查看会话日志。
2. 你可以通过会话的事件和保存的历史记录跟踪整个会话。
3. 你可以检查各个轮次并识别委派执行的命令。
4. 你可以检查根 智能体 和子智能体轮次中记录的 token 用量。

## 在仪表板中查看会话

前往 [platform.openai.com/logs?api=智能体](https://platform.openai.com/logs?api=agents) 并打开 **智能体** 标签页。

按会话 ID 搜索以检查其轮次、工具调用和子智能体。

使用 [追踪指南](https://developers.openai.com/api/docs/guides/agents-api/tracing) 在仪表板中检查已记录的模型响应、工具调用和子智能体活动。追踪检索和外部 追踪 导出器不属于公开测试版 API 的一部分。

## 跟踪事件并检查会话历史

每个会话都会暴露一个事件流，用于实时显示智能体正在执行的操作。设置 `OPENAI_API_KEY` 并将示例中的示例会话 ID 替换为你保存的会话 ID：

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


该流在空闲事件期间保持打开，以免错过已排队的工作。按下 **Ctrl+C** 可停止监听。

会话运行期间，你将看到类似以下的事件：

```text
agent.session.environment.connected
agent.session.turn.created
agent.session.turn.in_progress
agent.session.turn.item.added
agent.session.turn.output_text.delta
agent.session.turn.completed
agent.session.idle
```

若要查看已经发生的工作，请获取该会话的已保存条目：

查看已保存的会话条目

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


## 检查轮次并识别已委托的命令

会话轮次可通过公开的 API 获取。使用 `turn_id` 通过命令项以及你保存的会话 ID 获取。cURL 示例需要 `jq`:

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

命令项包含 `turn_id`。检索该轮次并读取 `subagent_id` 以识别运行该命令的委托 智能体。一个 `null` subagent ID 用于标识根 智能体 的工作。命令输出的截断不会上报。

## 检查一轮对话追踪

使用 Platform 控制台查看已完成的轮次及其智能体活动。
详细的追踪检索无法通过普通的项目API密钥进行。控制台追踪端点需要单独开通，并且不是面向客户提供的
支持的客户API。

轮次资源包含尽力而为的 `usage` 以及用于标识已委派工作的 `subagent_id` 。用量在未知时可能为 `null` ，并可能发生变化。请参阅 [检查子智能体令牌用量](#inspect-subagent-token-usage).

若要为 shell 命令归属用量，请通过其命令项的
`turn_id`，获取对应的轮次，然后检查 `turn.subagent_id`。客户API不会指明
命令输出是否被截断。

## 模型使用量与费用

一个智能体在完成任务时可能会进行多次模型调用。每次调用都遵循模型的 [token 定价](https://developers.openai.com/api/docs/pricing) 和 [提示缓存规则](https://developers.openai.com/api/docs/guides/prompt-caching), 如 Responses API 中所述。请估算完成任务所需的全部调用的成本。

### 哪些因素会影响成本？

每次模型调用可能会消耗：

- **输入 token 数：** 智能体指令、工具定义、对话历史、用户输入、文件或图像，以及工具结果。
- **缓存的输入 token 数：** 来自匹配提示前缀的复用输入，按模型的缓存输入费率计费。
- **输出 token 数：** 生成的文本、工具调用参数和推理。

推理 token 按输出 token 计费。

子智能体也可以发起模型调用。查看它们记录的 [轮次用量](#inspect-subagent-token-usage) 并与根智能体 的工作一起，用于排查模型成本。

在核算成本时，请同时考虑根智能体 和子智能体的工作，包括重试，以及任何适用的工具、沙箱计算资源和第三方服务费用。对于采用缓存写入定价的模型，将输入写入缓存也会产生费用。下面的 智能体 API 用量字段没有单独暴露缓存写入次数，因此在适用该定价时无法据此确定准确的模型费用。

### Prompt caching

智能体会在同一个会话中向前传递上下文。当连续的模型调用共享相同的前缀时，提示缓存可以复用其先前的处理结果。模型会生成新的回复；缓存并不会重放旧的回答。维持会话并不能保证一定命中缓存。是否复用取决于前缀是否匹配以及模型的缓存资格和生命周期规则。

在可行的情况下保持初始指令和工具定义的稳定，并将新的任务细节放入后续消息中。使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api)，时，发现到的定义会添加到对话末尾，从而保留先前的内容以便复用缓存。详见 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 中关于模型特定规则的说明。

较高的缓存输入占比并不能反映对整体任务成本的节省。缓存输入仍会计费，并且重复调用可能会处理大量历史内容。请在满足应用所需质量和延迟的前提下，对比完成相同任务时的成本。

### 了解 token 用量

会话和回合资源提供尽力而为的 `usage`。可能会出现 `null` 未知的情况，并且已记录的计数可能会在账单数据到达时发生变化。缺少用量记录并不代表零用量。这些计数并非最终账单。

一个已记录的用量对象包含以下 token 类别：

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

在此示例中，智能体处理了 5,000 个输入 token，并生成了 900 个输出 token。在输入 token 中，有 1,500 个来自缓存。在输出 token 中，有 200 个是推理 token。

缓存的 token 包含在 `input_tokens`，中，推理 token 包含在 `output_tokens`.

### 查看子智能体的 token 用量

列出或检索 [会话轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-session-turns) 并检查每个轮次的 `usage`。该字段 `subagent_id` 标识子智能体；对于根智能体轮次， `null` 为空。当 `has_more` 为 `true`，时，传入 `last_id` 作为 `after` 配合相同的 `order` 来读取剩余的轮次。

使用量为尽力而为：在未知时可能为 `null` ，且记录的值可能会变化。你也可以在智能体的 智能体 仪表板中检查每个智能体记录的使用量。 [追踪仪表板](https://developers.openai.com/api/docs/guides/agents-api/tracing#token-usage).