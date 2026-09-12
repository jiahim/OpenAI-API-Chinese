# Multi-智能体

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

Multi-智能体 让一个 智能体 将任务委派给子智能体。每个子智能体拥有自己的上下文，可以与其他子智能体并行工作。主 智能体 协调它们的工作并合并它们的结果。

## 何时使用子智能体

将独立任务交给子智能体处理，例如审阅不同的文档或调查失败的不同原因。每个任务都要给出明确的问题和预期结果。

将简短任务和存在依赖关系的步骤保留在主智能体中。智能体如果编辑相同的文件，必须协调彼此的更改。




## 启用多智能体编排

Set `agent.multi_agent.enabled` to `true` 当你创建会话时。运行时会提供用于创建、发送消息、等待和中断子智能体的工具。你无需自行声明这些工具。




下面的示例让两个子智能体分别审阅不同的发布说明，然后合并它们的结论。该示例不需要任何环境或已配置的工具：

比较发布说明

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
    multi_agent: { enabled: true, max_concurrent_subagents: 2 },
  },
  environment: { type: "none" },
  input:
    "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
  stream: true,
});
for await (const event of events) {
  console.log(JSON.stringify(event));
}
```

```python
from openai import OpenAI

client = OpenAI()

with client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 2},
    },
    environment={"type": "none"},
    input="Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
    stream=True,
) as events:
    for event in events:
        print(event.model_dump_json())
```

```go
import (
	"context"
	"fmt"
	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra"),
	Instructions: openai.String("Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details."),
	MultiAgent: openai.MultiAgentConfigParam{Enabled: true,
		MaxConcurrentSubagents: openai.Int(2)}},
	Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
	Input:       openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.")}})
defer events.Close()
for events.Next() {
	fmt.Println(events.Current().RawJSON())
}
if err := events.Err(); err != nil {
	panic(err)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.MultiAgentConfigParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
try (var events =
    client
        .beta()
        .agents()
        .sessions()
        .createStreaming(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Delegate each release to a separate subagent. Ask each to extract"
                                + " customer-visible changes and required migration steps using"
                                + " only its release notes. Wait for both results, then combine"
                                + " them into one release summary with release labels. Do not"
                                + " invent missing details.")
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(2L)
                                .build())
                        .build())
                .environmentNone()
                .input(
                    "Release A: Search now supports filtering by date. Existing queries"
                        + " continue to work. Release B: The export endpoint now returns a"
                        + " download URL instead of file bytes. Update clients to fetch that"
                        + " URL.")
                .build())) {
  events.stream().forEach(System.out::println);
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new

events = client.beta.agents.sessions.create_streaming(
  agent: {
    model: "gpt-6-astra",
    instructions: "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 2
    }
  },
  environment: { type: "none" },
  input: "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL."
)
begin
  events.each { |event| puts JSON.generate(event.to_h) }
ensure
  events.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Delegate each release to a separate subagent. Ask each to extract customer-visible changes and required migration steps using only its release notes. Wait for both results, then combine them into one release summary with release labels. Do not invent missing details.",
      "multi_agent": { "enabled": true, "max_concurrent_subagents": 2 }
    },
    "environment": { "type": "none" },
    "input": "Release A: Search now supports filtering by date. Existing queries continue to work. Release B: The export endpoint now returns a download URL instead of file bytes. Update clients to fetch that URL.",
    "stream": true
  }'
```


With `environment.type: "none"`, include the initial `input` in the create request. Setting `stream: true` also streams the first turn. See [会话事件与条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 了解流处理与恢复方式。

### 并发设置

`max_concurrent_subagents` 限制同时运行的子智能体数量。默认值为 `6`，不包括协调者。启用委托时设置一个正整数。

若要禁用委托，请省略 `multi_agent`，或将其设置为 `enabled` to `false` 并省略该限制。这些设置在创建会话时生效。对已存储的 智能体 所做的更改会应用于新会话。

## 使用环境

当智能体需要文件或命令执行时， [添加一个环境](https://developers.openai.com/api/docs/guides/agents-api/architecture)。协调器与子智能体共享其文件系统。创建子智能体不会创建另一个环境。

此示例在你的环境中创建一个用于工作的会话：

使用你自己的环境启用委派

```javascript
const result = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3,
    },
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
  },
});
```

```python
result = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 3},
    },
    environment={"type": "self_hosted", "workspace_directory": "/workspace"},
)
```

```go
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model:        openai.String("gpt-6-astra"),
			Instructions: openai.String("Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings."),
			MultiAgent: openai.MultiAgentConfigParam{
				Enabled:                true,
				MaxConcurrentSubagents: openai.Int(3),
			},
		},
		Environment: openai.EnvironmentParamUnion{
			OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace"},
		},
	})
if err != nil {
	panic(err)
}
```

```java
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Prepare release notes from the repository. Have one subagent"
                                + " identify customer-visible changes and another check"
                                + " migration guides and examples, then combine their"
                                + " findings.")
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(3L)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .build())
                .build());
```

```ruby
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 3
    }
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace"
  }
)
```

```bash
curl https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Prepare release notes from the repository. Have one subagent identify customer-visible changes and another check migration guides and examples, then combine their findings.",
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 3
      }
    },
    "environment": {
      "type": "self_hosted",
      "workspace_directory": "/workspace"
    }
  }'
```


将返回的会话 ID 和环境 ID 存储在你的应用中。 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)，然后 [发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) 以开始工作。

### 子智能体可用的工具

子智能体会继承已配置的 MCP 工具及其凭据和允许工具列表，以及 网页搜索 设置。它们也可以使用环境中的文件和命令行工具。子智能体不支持 [函数工具](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).

## Observe delegation

该 [会话事件流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 上报子智能体活动:

- `agent.session.subagent.created` 提供新的子智能体的 ID。
- `agent.session.turn.item.added` 和 `agent.session.turn.item.done` 汇报协调动作。其项类型包括 `create_subagent_call`, `send_subagent_input_call`, `wait_for_subagents_call`，以及 `interrupt_subagent_call`.

执行环境会执行这些动作。create 或 wait 动作完成并不意味着子智能体已完成其任务。在 create 条目上， `agent_id` 用于标识请求子智能体的智能体。




协调条目可以省略消息内容。一个 `agent_message` 条目在可用时包含智能体间智能体文本，但流不提供完整的对话记录。




请阅读主智能体的响应以获取合并结果。使用 [保存的条目和回合](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns) 来检查先前的工作，包括每个子智能体的历史记录。

### 属性命令

给定一个命令项及其会话 ID，检索该命令的轮次，以识别运行该命令的智能体。该轮次的 `subagent_id` 对应于 `null` 主智能体。

识别运行某个命令的智能体

```javascript
// Use the saved session ID and command execution item from your application.
const turn = await client.beta.agents.sessions.turns.retrieve(
  command.turn_id,
  { session_id: sessionId }
);
console.log(turn.subagent_id);
```

```python
# Use the saved session ID and command execution item from your application.
turn = client.beta.agents.sessions.turns.retrieve(
    command.turn_id, session_id=session_id
)
print(turn.subagent_id)
```

```go
// Use the saved session ID and command execution item from your application.
turn, err := client.Beta.Agents.Sessions.Turns.Get(ctx, sessionID, item.TurnID)
if err != nil {
	panic(err)
}
fmt.Println(turn.SubagentID)
```

```java
// Use the saved session ID and command execution item from your application.
var turn =
    client
        .beta()
        .agents()
        .sessions()
        .turns()
        .retrieve(
            TurnRetrieveParams.builder()
                .sessionId(sessionId)
                .turnId(command.turnId())
                .build());
System.out.println(turn.subagentId());
```

```ruby
# Use the saved session ID and command execution item from your application.
turn = client.beta.agents.sessions.turns.retrieve(item.turn_id, session_id: session_id)
puts turn.subagent_id
```