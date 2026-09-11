# 可观测性与用量

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

追踪实时智能体活动、检查已完成的工作，并审阅详细的轮次追踪：

1. 你可以在 Platform 仪表盘中查看会话日志。
2. 你可以通过其事件和保存的历史记录跟踪会话。
3. 你可以检视轮次并识别委托的命令执行。
4. 你可以检视根智能体和子智能体轮次中记录的 token 用量。

## 在仪表板中查看该会话

前往 [platform.openai.com/logs?api=智能体](https://platform.openai.com/logs?api=agents) 并打开 **智能体** 标签页。

按会话 ID 搜索，以查看其轮次、工具调用和子智能体。

请参阅 [追踪指南](https://developers.openai.com/api/docs/guides/agents-api/tracing) ，在仪表板中查看记录的模型响应、工具调用和子智能体活动。追踪检索和外部 追踪 导出器不属于公开测试版 API 的一部分。

## 跟踪事件并查看会话历史

每个会话都会公开一个事件流，用于实时显示智能体正在执行的操作。请先设置 `OPENAI_API_KEY` 和 `SESSION_ID` 再运行这些示例：

跟踪实时会话事件

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.events.stream(
  process.env.SESSION_ID
);
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
import os
from openai import OpenAI

client = OpenAI()
session_id = os.environ["SESSION_ID"]
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
import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, os.Getenv("SESSION_ID"))
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
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client.beta().agents().sessions().events().streamStreaming(System.getenv("SESSION_ID"))) {
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
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.events.stream_streaming(ENV.fetch("SESSION_ID"))
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
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/events?stream=true"
```


该流在空闲事件期间保持打开，这样你就不会错过已排队的工作。按下 **Ctrl+C** 即可停止监听。

在会话运行过程中，你将看到类似以下的事件：

```text
agent.session.environment.connected
agent.session.turn.created
agent.session.turn.in_progress
agent.session.turn.item.added
agent.session.turn.output_text.delta
agent.session.turn.completed
agent.session.idle
```

若要检查已经发生的工作，请检索该会话保存的项目：

检查保存的会话项目

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = process.env.SESSION_ID;
const items = await client.beta.agents.sessions.items.list(sessionId, {
  order: "asc",
  limit: 100,
});
console.log(items.data);
```

```python
import os
from openai import OpenAI

client = OpenAI()

session_id = os.environ["SESSION_ID"]
items = client.beta.agents.sessions.items.list(session_id, order="asc", limit=100)
print(items.to_json())
```

```go
import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.Items.List(ctx,
	os.Getenv("SESSION_ID"),
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
                .sessionId(System.getenv("SESSION_ID"))
                .order(ItemListParams.Order.of("asc"))
                .limit(100L)
                .build());
System.out.println(result.items());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.items.list(
  ENV.fetch("SESSION_ID"),
  order: "asc",
  limit: 100
)
puts result.data
```

```bash
curl \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  "https://api.openai.com/v1/agents/sessions/$SESSION_ID/items?order=asc&limit=100"
```


## 检查回合并识别已委托的命令

会话轮次可通过公共 API 获取。设置 `TURN_ID` 来自 command 项以及 `OPENAI_API_KEY` 和 `SESSION_ID`。cURL 示例需要 `jq`:

识别委托的命令执行

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const sessionId = process.env.SESSION_ID;
const turns = await client.beta.agents.sessions.turns.list(sessionId, {
  limit: 20,
  order: "desc",
});
console.log(turns.data);
const turnId = process.env.TURN_ID;
const turn = await client.beta.agents.sessions.turns.retrieve(turnId, {
  session_id: sessionId,
});
console.log(turn.subagent_id);
```

```python
import os
from openai import OpenAI

client = OpenAI()

session_id = os.environ["SESSION_ID"]
turns = client.beta.agents.sessions.turns.list(session_id, limit=20, order="desc")
print(turns.to_json())
turn_id = os.environ["TURN_ID"]
turn = client.beta.agents.sessions.turns.retrieve(turn_id, session_id=session_id)
print(turn.subagent_id)
```

```go
import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.Turns.List(ctx,
	os.Getenv("SESSION_ID"),
	openai.BetaAgentSessionTurnListParams{
		Limit: openai.Int(20),
		Order: "desc",
	})
if err != nil {
	panic(err)
}
fmt.Println(result.Data)
turn, err := client.Beta.Agents.Sessions.Turns.Get(ctx,
	os.Getenv("SESSION_ID"),
	os.Getenv("TURN_ID"))
if err != nil {
	panic(err)
}
fmt.Println(turn.SubagentID)
```

```java
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
                .sessionId(System.getenv("SESSION_ID"))
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
            TurnRetrieveParams.builder()
                .turnId(System.getenv("TURN_ID"))
                .sessionId(System.getenv("SESSION_ID"))
                .build());
System.out.println(turn.subagentId());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.turns.list(
  ENV.fetch("SESSION_ID"),
  limit: 20,
  order: "desc"
)
puts result.data
turn = client.beta.agents.sessions.turns.retrieve(
  ENV.fetch("TURN_ID"),
  session_id: ENV.fetch("SESSION_ID")
)
puts turn.subagent_id
```

```bash
curl "https://api.openai.com/v1/agents/sessions/$SESSION_ID/turns?limit=20&order=desc" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"

curl "https://api.openai.com/v1/agents/sessions/$SESSION_ID/turns/$TURN_ID" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.subagent_id'
```


使用返回的 `last_id` 作为下一页的 `after` 值，当 `has_more` 为 `true`.

Command 项包含 `turn_id`。检索该轮次并读取 `subagent_id` 以识别运行该命令的委托智能体。一个 `null` subagent ID 用于标识根 智能体 工作。Command-output 截断不会被报告。

## 检查一个回合追踪

使用 Platform 控制面板检查已完成的轮次及其智能体活动。
详细的追踪检索无法通过普通的项目 API 密钥进行。控制面板追踪端点需要单独访问权限，并且不属于
受支持的客户API。

Turn 资源包含尽力而为的 `usage` 以及一个 `subagent_id` 用于标识委派工作。用量可以 `null` 未知时为 null，且可能会变化。参见 [检查子智能体的 token 用量](#inspect-subagent-token-usage).

若要归属某个 shell 命令的用量，请通过其命令项的
`turn_id`，检索对应的 turn，然后检查 `turn.subagent_id`。客户API 不会指明
命令输出是否被截断。

## 模型使用情况与费用

一个智能体在完成任务时可能会进行多次模型调用。每次调用都遵循模型的 [token 定价](https://developers.openai.com/api/docs/pricing) 和 [提示缓存规则](https://developers.openai.com/api/docs/guides/prompt-caching)，与 Responses API 中的规则一致。估算完成任务所需的所有调用的成本。

### 哪些因素会影响费用？

每次模型调用可能会消耗：

- **输入 token：** 智能体 指令、工具定义、对话历史、用户输入、文件或图像，以及工具结果。
- **缓存输入 token：** 来自匹配提示前缀的复用输入，按模型的缓存输入费率计费。
- **输出 token：** 生成的文本、工具调用参数，以及推理。

推理 token 按输出 token 计费。

子智能体也可以发起模型调用。在调查模型成本时，可同时查看它们记录的 [轮次用量](#inspect-subagent-token-usage) 与根智能体的工作情况。

核算根智能体和子智能体的工作，包括重试，以及任何适用的工具、沙箱算力和第三方服务费用。对于采用缓存写入定价的模型，将输入写入缓存也会产生费用。下方的智能体 API 使用情况字段并未公开单独的缓存写入计数，因此在适用该定价时无法据此确定确切的模型费用。

### Prompt caching

智能体会在一个会话内将上下文向前传递。当连续多次的模型调用共享相同的前缀提示时，提示缓存可以复用先前的处理结果。模型会生成新的响应；缓存并不会重放旧的回答。维护一个会话并不保证一定命中缓存。能否复用取决于前缀是否匹配，以及模型的缓存资格和生命周期规则。

在可行的情况下，保持初始指令和工具定义稳定，将新的任务细节放在后续消息中。使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api)，时，发现的定义会添加到对话末尾，从而保留先前的内容以便复用缓存。参见 [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 以了解特定于模型的规则。

较高的缓存输入百分比并不能衡量整个任务成本的节省程度。缓存输入仍然会计费，并且重复调用可能会处理大量的历史内容。请以你的应用所需的质量和延迟，对比完成同一任务的成本。

### 了解 token 用量

Session 和 turn 资源提供尽力而为的 `usage`。当未知时可能为 `null` ，并且随着计费数据的到达，已记录的计数可能会变化。缺少用量并不代表用量为零。这些计数并非最终账单。

已记录的用量对象包含以下 token 类别：

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

在此示例中，智能体 处理了 5,000 个输入 token 并生成了 900 个输出 token。在输入 token 中，有 1,500 个是缓存 token。在输出 token 中，有 200 个是推理 token。

缓存 token 包含在 `input_tokens`，中，推理 token 包含在 `output_tokens`.

### 检查子智能体的令牌用量

列出或检索 [会话轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-session-turns) 并检查每个轮次的 `usage`。其中 `subagent_id` 标识子智能体；对于根 `null` 智能体轮次，则为 `has_more` 为 `true`，时，传入 `last_id` 作为 `after` 并使用相同的 `order` 以读取剩余轮次。

用量统计是尽力而为的：当未知时可能为 `null` ，且记录的值可能会变化。你也可以在每个智能体的已记录用量中查看，方法是在 [追踪 仪表板](https://developers.openai.com/api/docs/guides/agents-api/tracing#token-usage).