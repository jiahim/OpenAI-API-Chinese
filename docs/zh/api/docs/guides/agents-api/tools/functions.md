# Functions

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

函数工具让智能体可以调用你的应用代码。你需要定义函数及其参数。由智能体发起调用，你的代码返回结果，然后框架继续这一轮交互。

你的处理函数可以运行在应用服务器、worker 进程或你自行控制的环境中。将环境附加到会话并不会自动在其中运行函数工具。




如果使用 [Responses API 中的函数调用](https://developers.openai.com/api/docs/guides/function-calling)，你可以复用已有的函数实现，并沿用本文介绍的会话流程。




## 定义一个函数

向 `agent.tools` 中添加函数定义，当你 [配置该 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration)。为其指定名称、描述以及参数的 JSON Schema：

```json
{
  "type": "function",
  "name": "get_customer",
  "description": "Look up a customer by ID.",
  "parameters": {
    "type": "object",
    "properties": { "customer_id": { "type": "string" } },
    "required": ["customer_id"],
    "additionalProperties": false
  }
}
```




## 处理必需的操作

当智能体需要函数结果时，会话会发出 `agent.session.requires_action`。从等函数中读取待处理调用 `event.session.required_actions`。你也可以 [检索该会话](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) 并读取 `session.required_actions` ，无需使用流式传输。

等函数中的条目 `required_actions` 如下所示：

```json
{
  "type": "function_call",
  "turn_id": "turn_123",
  "call_id": "call_123",
  "name": "get_customer",
  "arguments": { "customer_id": "123" }
}
```

使用提供的参数运行指定函数。使用等函数 `required_actions` 来判断哪些调用需要结果；仅凭会话历史中的等函数条目 `function_call` 无法确定存在待处理结果。

## Return the result

发送 `agent.session.input.tool_result` 到 [session events 端点](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create)。复制 `turn_id` 和 `call_id` 从待处理操作中：

- 成功后，设置 `success: true` 并提供 `output` 作为字符串或受支持的内容数组。将 JSON 对象序列化为字符串。
- 对于错误，设置 `success: false` 并提供一个 `error` 供智能体使用的 message。




对每个待处理 `get_customer` call，运行你的查找并返回其结果。这里， `action` 是来自 `required_actions`:

Return a function result

```javascript
const result = {
  turn_id: action.turn_id,
  call_id: action.call_id,
};
let outcome;

outcome = {
  success: true,
  output: JSON.stringify(getCustomer(action.arguments)),
};

await client.beta.agents.sessions.events.create(sessionId, {
  events: [
    { type: "agent.session.input.tool_result", ...result, ...outcome },
  ],
});
```

```python
import json

action = action.to_dict()

result = {
    "type": "agent.session.input.tool_result",
    "turn_id": action["turn_id"],
    "call_id": action["call_id"],
}

output = get_customer(action["arguments"])
result.update(success=True, output=json.dumps(output))

client.beta.agents.sessions.events.create(session_id, events=[result])
```

```go
result := openai.AgentSessionInputParamAgentSessionInputToolResult{
	TurnID: action.TurnID,
	CallID: action.CallID,
}

arguments := action.Arguments.(map[string]any)
customerID := arguments["customer_id"].(string)
var customer any
if customerID == "123" {
	customer = map[string]any{"name": "Example Customer", "plan": "pro"}
}
output, err := json.Marshal(map[string]any{"found": customer != nil, "customer": customer})
if err != nil {
	panic(err)
}
result.Success = true
result.Output = openai.AgentFunctionCallOutputParamUnion{OfString: openai.String(string(output))}

err = client.Beta.Agents.Sessions.Events.New(ctx, session.ID, openai.BetaAgentSessionEventNewParams{
	Events: []openai.AgentSessionInputParamUnion{{OfParamAgentSessionInputToolResult: &result}},
})
if err != nil {
	panic(err)
}
```

```java
var json = new JsonMapper();

var result =
    AgentSessionInputParam.AgentSessionInputToolResult.builder()
        .turnId(action.turnId())
        .callId(action.callId());
var arguments = json.valueToTree(action._arguments());

boolean found = arguments.path("customer_id").asText().equals("123");
var output = json.createObjectNode().put("found", found);
if (found)
  output.putObject("customer").put("name", "Example Customer").put("plan", "pro");
else output.putNull("customer");
result.success(true).output(json.writeValueAsString(output));

client
    .beta()
    .agents()
    .sessions()
    .events()
    .create(
        EventCreateParams.builder()
            .sessionId(sessionId)
            .addEvent(result.build())
            .build());
```

```ruby
require "json"

result = {
  type: "agent.session.input.tool_result",
  turn_id: action.turn_id,
  call_id: action.call_id
}
arguments = action.arguments

customer_id = arguments[:customer_id] || arguments["customer_id"]
customer = (customer_id == "123") ? {
  name: "Example Customer",
  plan: "pro"
} : nil
result[:success] = true
result[:output] = JSON.generate(found: !customer.nil?, customer: customer)

client.beta.agents.sessions.events.create(session.id, events: [result])
```


测试运行在收到所需结果后会继续该轮。关注 [会话事件和条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 以检查该轮的结果并获取其输出。

### 结果大小

如果 API 因工具结果过大而拒绝，请将其压缩到 4 MiB（4,194,304 字节）以下，并为 智能体 API 的元数据留出一些空间。然后使用相同的 `turn_id` 和 `call_id` 在调用仍处于等待状态时。

## 断开连接后恢复

检索会话以查找待处理操作。如果你已经运行了某个函数，请使用相同的 `turn_id` 和 `call_id`.

对于具有副作用的函数，请按会话、轮次和调用 ID 持久化保存其结果。如果执行可能已成功但未保存结果，请在再次运行该函数之前检查其执行结果。




## 按需加载函数

函数默认会立即加载。若要延迟加载函数，请设置 `defer_loading: true` 在其定义中，并包含 `{ "type": "tool_search" }` 中 `agent.tools`。请参阅 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api) 查看完整示例。