# Manage sessions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Store each session ID with your application's data store. Use it to retrieve the session's current state, handle requests from the agent, or delete the session.




## Find sessions

List sessions in your project to browse previous work. SDK pagination helpers retrieve additional pages:

List sessions and retrieve the next page

```javascript
import OpenAI from "openai";

const client = new OpenAI();
let page = await client.beta.agents.sessions.list({ limit: 20 });
console.log(page.data);
if (page.hasNextPage()) {
  page = await page.getNextPage();
  console.log(page.data);
}
```

```python
from openai import OpenAI

client = OpenAI()
page = client.beta.agents.sessions.list(limit=20)
print(page.to_json())
if page.has_next_page():
    page = page.get_next_page()
    print(page.to_json())
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.List(ctx,
	openai.BetaAgentSessionListParams{Limit: openai.Int(20)})
if err != nil {
	panic(err)
}
fmt.Println(result.Data)
if result.HasMore {
	result, err = result.GetNextPage()
	if err != nil {
		panic(err)
	}
	fmt.Println(result.Data)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.sessions.SessionListParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client.beta().agents().sessions().list(SessionListParams.builder().limit(20L).build());
System.out.println(result.items());
if (result.hasNextPage()) {
  result = result.nextPage();
  System.out.println(result.items());
}
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.list(limit: 20)
puts result.data
if result.next_page?
  result = result.next_page
  puts result.data
end
```

```bash
page=$(curl -sS --fail-with-body "https://api.openai.com/v1/agents/sessions?limit=20&order=desc" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY")
after=$(printf '%s' "$page" | jq -r 'select(.has_more) | .last_id // empty')

if [ -n "$after" ]; then
  curl --get "https://api.openai.com/v1/agents/sessions" \
    -H "OpenAI-Beta: agents=v1" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    --data-urlencode "after=$after" \
    --data-urlencode "limit=20"
fi
```





## Inspect a session

Retrieve a session to read its status, agent configuration, environment, and `required_actions`. Pass your API client and the conversation's session ID:

Retrieve a session

```javascript
// Pass your saved session ID to this helper.
async function retrieveSession(client, sessionId) {
  return client.beta.agents.sessions.retrieve(sessionId);
}
```

```python
# Pass your saved session ID to this helper.
def retrieve_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.retrieve(session_id)
```

```go
// Pass your saved session ID to this helper.
func retrieveSession(ctx context.Context, client *openai.Client, sessionID string) (*openai.AgentSession, error) {
	return client.Beta.Agents.Sessions.Get(ctx, sessionID)
}
```

```java
// Pass your saved session ID to this helper.
public static AgentSession retrieveSession(OpenAIClient client, String sessionId) {
  return client
      .beta()
      .agents()
      .sessions()
      .retrieve(SessionRetrieveParams.builder().sessionId(sessionId).build());
}
```

```ruby
# Pass your saved session ID to this helper.
def retrieve_session(client, session_id)
  client.beta.agents.sessions.retrieve(session_id)
end
```

```bash
curl \
  "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


See the [Retrieve session reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) for the full response schema.

### Handle required actions

A session with status `requires_action` needs your application to act before work can continue. When you receive `agent.session.requires_action`, retrieve the session and inspect each entry in `required_actions`:

- **`function_call`:** Run the function identified by `name` with its `arguments`. Return the result on the same session using the action's `turn_id` and `call_id`. See [Function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions#return-the-result).
- **`environment_connection`:** Connect the environment identified by `environment_id`. See [Connect an environment](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

The event tells your application when to check. The retrieved session tells it what to do. After a restart or stream disconnect, retrieve the session to find pending actions. After handling them, continue following events for the turn's outcome.




For saved messages, tool calls, and turn outcomes, see [Fetch items and turns](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns). To identify which agent ran a command, see [Observe delegation](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## Delete a session

Delete a session when your application no longer needs it. Deletion removes the session from the API. Physical cleanup may continue asynchronously.

Delete a session

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

async function deleteSession(client, sessionId) {
  return client.beta.agents.sessions.delete(sessionId);
}

const result = await deleteSession(new OpenAI(), "sess_123");
console.log(result);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI


def delete_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.delete(session_id)


if __name__ == "__main__":
    result = delete_session(OpenAI(), "sess_123")
    print(result.to_json())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func deleteSession(ctx context.Context, client *openai.Client, sessionID string) (*openai.AgentSessionDeleted, error) {
	return client.Beta.Agents.Sessions.Delete(ctx, sessionID)
}

func main() {
	client := openai.NewClient()
	result, err := deleteSession(context.Background(), &client, "sess_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(result)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentSessionDeleted;
import com.openai.models.beta.agents.sessions.SessionDeleteParams;

public final class AgentsApiSessionsDeleteSessionExample {
  public static AgentSessionDeleted deleteSession(OpenAIClient client, String sessionId) {
    return client
        .beta()
        .agents()
        .sessions()
        .delete(SessionDeleteParams.builder().sessionId(sessionId).build());
  }

  public static void main(String[] args) {
    var result = deleteSession(OpenAIOkHttpClient.fromEnv(), "sess_123");
    System.out.println(result);
  }
}
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

def delete_session(client, session_id)
  client.beta.agents.sessions.delete(session_id)
end

puts delete_session(OpenAI::Client.new, "sess_123")
```

```bash
curl -X DELETE \
  "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


To stop current work and keep the conversation, [cancel the active turn](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn). See the [Delete session reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/delete) for the deletion response.