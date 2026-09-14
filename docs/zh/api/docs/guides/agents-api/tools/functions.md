# Functions

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

函数工具允许智能体调用你的应用代码。你定义该函数及其参数。智能体请求一次调用，你的代码返回结果，框架继续本轮对话。

你的处理程序可以运行在应用服务器、worker 或你控制的环境中。将环境附加到会话并不会自动在其中运行函数工具。




如果你使用 [响应接口Responses API](https://developers.openai.com/api/docs/guides/function-calling)，你可以复用已有的函数实现，并配合此处介绍的会话流程。




## 定义函数

在 `agent.tools` 配置时 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration)。时添加函数定义。为它命名、添加描述，并为其参数提供一个 JSON Schema：

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




## 处理必需操作

当 智能体 需要函数结果时，会话会发出 `agent.session.requires_action`。从以下来源读取待处理调用： `event.session.required_actions`。你还可以 [检索会话](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) 并读取 `session.required_actions` ，无需流式传输。

中的函数条目如下所示： `required_actions` 看起来像这样：

```json
{
  "type": "function_call",
  "turn_id": "turn_123",
  "call_id": "call_123",
  "name": "get_customer",
  "arguments": { "customer_id": "123" }
}
```

使用提供的参数运行指定的函数。使用 `required_actions` 判断哪些调用需要结果；仅会话历史中的 `function_call` 条目本身并不能确定存在待处理的结果。

## 返回结果

发送 `agent.session.input.tool_result` 到 [会话事件端点](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create)。复制 `turn_id` 和 `call_id` 从待处理操作中：

- 若成功，请设置 `success: true` 并提供 `output` 作为字符串或受支持的内容数组。将 JSON 对象序列化为字符串。
- 若出错，请设置 `success: false` 并提供一个 `error` 消息，供 智能体 使用。




对于每个待处理 `get_customer` 调用，运行你的查找并返回其结果。这里， `action` 是来自 `required_actions`:

返回函数结果

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


执行环境在收到所需结果后会继续该轮次。请参阅 [会话事件和条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 以查看该轮次的结果并获取其输出。

## 断开后恢复

检索会话以查找待处理操作。如果你已运行某个函数，请使用相同的 ID 提交其已保存的结果 `turn_id` 和 `call_id`.

对于有副作用的函数，应按会话、轮次和调用 ID 持久化存储其结果。如果执行可能已成功但未保存结果，请在再次运行该函数前检查其结果。




## 按需加载函数

函数默认会立即加载。若要延迟加载某个函数，请设置 `defer_loading: true` ，并在定义中包含 `{ "type": "tool_search" }` 包含 `agent.tools`。参见 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api) 获取完整示例。