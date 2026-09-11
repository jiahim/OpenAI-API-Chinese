# 管理会话

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

将会话 ID 与应用程序的数据存储一同保存。可使用该 ID 检索会话的当前状态、处理来自智能体的请求，或删除该会话。




## 查找会话

在你的项目中列出会话以浏览过往工作。SDK 分页辅助方法可获取更多页：

列出会话并获取下一页

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





## 检查会话

检索会话以读取其状态、智能体配置、环境，以及 `required_actions`。传入你的 API 客户端和该会话的 ID：

检索会话

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


参见 [检索会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) 以获取完整的响应模式。

### 处理必需操作

处于该状态的会话 `requires_action` 需要你的应用先执行操作，工作才能继续。当你收到 `agent.session.requires_action`，时，获取该会话并检查其中的每一项 `required_actions`:

- **`function_call`:** 运行由 `name` 使用其 `arguments`。标识的函数。在同一会话中使用该动作的 `turn_id` 和 `call_id`。返回结果。参见 [函数工具](https://developers.openai.com/api/docs/guides/agents-api/tools/functions#return-the-result).
- **`environment_connection`:** 连接由 `environment_id`。返回结果。参见 [连接环境](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

事件会告知你的应用何时检查，取回的会话则告诉它该做什么。重启或流断开后，取回会话以查找待处理操作。处理完这些操作后，继续跟踪事件以获取该轮的最终结果。




有关已保存消息、工具调用和轮次结果，请参阅 [获取条目与轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns)。若要识别哪个智能体执行了某条命令，请参阅 [观察委派](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## 删除会话

当你的应用不再需要某个会话时，删除该会话。删除操作会将其从 API 中移除。物理清理可能会异步继续进行。

删除会话

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

/**
 * @param {OpenAI} client
 * @param {string} sessionId
 */
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


若要停止当前工作并保留对话， [取消当前轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn)。请参阅 [删除会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/delete) 以了解删除响应。