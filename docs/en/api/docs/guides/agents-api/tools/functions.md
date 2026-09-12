# Functions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Function tools let an agent call your application code. You define the function and its arguments. The agent requests a call, your code returns a result, and the harness continues the turn.

Your handler can run in an application server, a worker, or an environment you control. Attaching an environment to a session does not automatically run function tools there.




If you use [function calling in the Responses API](https://developers.openai.com/api/docs/guides/function-calling), you can reuse your function implementation with the session flow described here.




## Define a function

Add a function definition to `agent.tools` when you [configure the agent](https://developers.openai.com/api/docs/guides/agents-api/configuration). Give it a name, a description, and a JSON Schema for its arguments:

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




## Handle required actions

When the agent needs a function result, the session emits `agent.session.requires_action`. Read the pending calls from `event.session.required_actions`. You can also [retrieve the session](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) and read `session.required_actions` without streaming.

A function entry in `required_actions` looks like this:

```json
{
  "type": "function_call",
  "turn_id": "turn_123",
  "call_id": "call_123",
  "name": "get_customer",
  "arguments": { "customer_id": "123" }
}
```

Run the named function with the supplied arguments. Use `required_actions` to decide which calls need results; a `function_call` item in session history alone does not establish that a result is pending.

## Return the result

Send `agent.session.input.tool_result` to the [session events endpoint](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create). Copy `turn_id` and `call_id` from the pending action:

- For success, set `success: true` and supply `output` as a string or a supported content array. Serialize JSON objects to strings.
- For an error, set `success: false` and supply an `error` message that the agent can use.




For each pending `get_customer` call, run your lookup and return its result. Here, `action` is the entry from `required_actions`:

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


The harness continues the turn after it receives the required results. Follow [session events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) to check the turn's outcome and retrieve its output.

## Recover after a disconnect

Retrieve the session to find pending actions. If you already ran a function, submit its saved result with the same `turn_id` and `call_id`.

For functions with side effects, store results durably by session, turn, and call ID. If execution might have succeeded but no result was saved, check the outcome before running the function again.




## Load functions on demand

Functions load eagerly by default. To defer a function, set `defer_loading: true` on its definition and include `{ "type": "tool_search" }` in `agent.tools`. See [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api) for a complete example.