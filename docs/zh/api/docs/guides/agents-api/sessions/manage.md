# 管理会话

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

将会话 ID 与应用程序的数据存储一起保存。使用它可以检索会话的当前状态、处理来自智能体的请求，或删除该会话。




## 查找会话

列出项目中的会话以浏览历史工作。SDK 分页助手可获取更多页面：

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

检索某个会话以读取其状态、智能体配置、环境以及 `required_actions`。传入你的 API 客户端和该会话的会话 ID：

检索会话

```javascript
async function retrieveSession(client, sessionId) {
  return client.beta.agents.sessions.retrieve(sessionId);
}
```

```python
def retrieve_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.retrieve(session_id)
```

```go
func retrieveSession(ctx context.Context, client *openai.Client, sessionID string) (*openai.AgentSession, error) {
	return client.Beta.Agents.Sessions.Get(ctx, sessionID)
}
```

```java
public static AgentSession retrieveSession(OpenAIClient client, String sessionId) {
  return client
      .beta()
      .agents()
      .sessions()
      .retrieve(SessionRetrieveParams.builder().sessionId(sessionId).build());
}
```

```ruby
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


请参阅 [检索会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/retrieve) 以获取完整的响应 schema。

### 处理必需操作

状态为 `requires_action` 的会话需要你的应用先执行操作，然后工作才能继续。当你收到 `agent.session.requires_action`，时，请检索该会话并检查 `required_actions`:

- **`function_call`:** 运行由 `name` 标识的函数，传入其 `arguments`。使用该 action 的 `turn_id` 和 `call_id`。在同一会话中返回结果。参见 [Function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions#return-the-result).
- **`environment_connection`:** 连接由 `environment_id`。在同一会话中返回结果。参见 [Connect an environment](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

事件会告知你的应用何时进行检查。检索到的会话会告知它要做什么。在重启或流断开后，检索会话以查找待处理的操作。处理完这些操作后，继续跟踪事件以获取该轮次的结果。




有关已保存的消息、工具调用和轮次结果，请参阅 [获取条目和轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns)。若要识别是哪个 智能体 运行了某个命令，请参阅 [观察委托](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#observe-delegation).

## 删除会话

当你的应用不再需要某个会话时，可以将其删除。删除操作会将该会话从 API 中移除。物理清理可能会异步继续进行。

删除会话

```javascript
import OpenAI from "openai";

/**
 * @param {OpenAI} client
 * @param {string} sessionId
 */
async function deleteSession(client, sessionId) {
  return client.beta.agents.sessions.delete(sessionId);
}

const result = await deleteSession(new OpenAI(), process.env.OPENAI_SESSION_ID);
console.log(result);
```

```python
import os

from openai import OpenAI


def delete_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.delete(session_id)


if __name__ == "__main__":
    result = delete_session(OpenAI(), os.environ["OPENAI_SESSION_ID"])
    print(result.to_json())
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func deleteSession(ctx context.Context, client *openai.Client, sessionID string) (*openai.AgentSessionDeleted, error) {
	return client.Beta.Agents.Sessions.Delete(ctx, sessionID)
}

func main() {
	client := openai.NewClient()
	result, err := deleteSession(context.Background(), &client, os.Getenv("OPENAI_SESSION_ID"))
	if err != nil {
		panic(err)
	}
	fmt.Println(result)
}
```

```java
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
    var result = deleteSession(OpenAIOkHttpClient.fromEnv(), System.getenv("OPENAI_SESSION_ID"));
    System.out.println(result);
  }
}
```

```ruby
require "openai"

def delete_session(client, session_id)
  client.beta.agents.sessions.delete(session_id)
end

puts delete_session(OpenAI::Client.new, ENV.fetch("OPENAI_SESSION_ID"))
```

```bash
curl -X DELETE \
  "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


若要停止当前工作并保留对话， [取消当前轮次](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn)。请参阅 [删除会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/delete) 了解删除响应。