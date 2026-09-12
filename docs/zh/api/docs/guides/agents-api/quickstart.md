# 智能体 API 快速入门

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

构建一个能够编写代码的编程助手 `tree.py`，运行它，并展示目录树。OpenAI 管理 智能体、其对话以及它运行所在的沙箱。

## 前置条件

创建 [应用 API 密钥](https://platform.openai.com/api-keys) 在你的 OpenAI Platform 项目中。并授予 `api.agents.read` 和 `api.agents.write` 权限用于会话操作，以及 `api.responses.write` 权限用于模型推理，然后导出它：

```bash
export OPENAI_API_KEY="your-api-key"
```

将此密钥保留在 智能体 的沙箱之外。参见 [OpenAI 托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#configure-the-sandbox) 了解沙箱配置和限制。

请求需要 `OpenAI-Beta: agents=v1` 请求头。OpenAI SDK 会自动添加该请求头
  ；使用 cURL 时请显式添加。

## 1. 运行一个任务

选择一种语言，安装 OpenAI SDK，然后运行示例。SDK 示例使用 `beta.agents` 命名空间。该请求会创建一个会话、提交任务并流式输出进度。



Python


安装或更新 Python SDK：

```bash
pip install --upgrade openai
```

将示例保存为 `quickstart.py`:

创建并运行 tree.py

```python
from openai import OpenAI

with OpenAI() as client:
    with client.beta.agents.sessions.create(
        agent={
            "model": "gpt-6-astra",
            "instructions": "Write clean code, run it, and report the actual output.",
        },
        environment={"type": "openai_hosted"},
        input="Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
        stream=True,
    ) as events:
        for event in events:
            print(event.to_json(indent=None), flush=True)
```


在终端中运行：

```bash
python quickstart.py
```

  


  

    
JavaScript


安装 JavaScript SDK：

```bash
npm install openai
```

将示例保存为 `quickstart.mjs`:

创建并运行 tree.py

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output.",
  },
  environment: { type: "openai_hosted" },
  input:
    "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
  stream: true,
});
try {
  for await (const event of events) {
    console.log(JSON.stringify(event));
  }
} finally {
  events.controller.abort();
}
```


在终端中运行：

```bash
node quickstart.mjs
```

  


  

    
Go


在一个新目录中创建一个 Go 模块并安装 SDK：

```bash
go mod init agents-quickstart
go get github.com/openai/openai-go/v3@latest
```

将示例保存为 `main.go`:

创建并运行 tree.py

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
events := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{
	Agent: openai.BetaAgentSessionNewParamsAgent{
		Model:        openai.String("gpt-6-astra"),
		Instructions: openai.String("Write clean code, run it, and report the actual output."),
	},
	Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{}},
	Input: openai.BetaAgentSessionNewParamsInputUnion{
		OfString: openai.String("Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."),
	},
})
defer events.Close()
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
	fmt.Println(event.RawJSON())
}
if err := events.Err(); err != nil {
	panic(err)
}
```


在终端中运行：

```bash
go run .
```

  


  

    
Java


将 OpenAI SDK 添加到你的 Maven 项目的 `pom.xml`:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>${apiReferencePackageVersions.java}</version>
</dependency>
```


将示例保存为 `src/main/java/AgentsApiSessionsStreamConversationExample.java`:

创建并运行 tree.py

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.beta.agents.AgentSessionEvent;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
try (StreamResponse<AgentSessionEvent> events =
    client
        .beta()
        .agents()
        .sessions()
        .createStreaming(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions("Write clean code, run it, and report the actual output.")
                        .build())
                .environment(EnvironmentParam.OpenAIHosted.builder().build())
                .input(
                    "Create tree.py, a Python script that prints a readable tree of the files"
                        + " in the current directory. Run it and show me the output.")
                .build())) {
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    System.out.println(json.writeValueAsString(event));
  }
}
```


在终端中运行：

```bash
mvn compile exec:java -Dexec.mainClass=AgentsApiSessionsStreamConversationExample
```

  


  

    
Ruby


安装 Ruby SDK：

```bash
gem install openai
```

将示例保存为 `quickstart.rb`:

创建并运行 tree.py

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
events = client.beta.agents.sessions.create_streaming(
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output."
  },
  environment: { type: "openai_hosted" },
  input: "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output."
)
begin
  events.each do |event|
    puts JSON.generate(event.to_h)
  end
ensure
  events.close
end
```


在终端中运行：

```bash
ruby quickstart.rb
```

  


  

    
cURL


在终端中使用 cURL，无需安装 SDK：

创建并运行 tree.py

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "agent": {\n      "model": "gpt-6-astra",\n      "instructions": "Write clean code, run it, and report the actual output."\n    },\n    "environment": { "type": "openai_hosted" },\n    "input": "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",\n    "stream": true\n  }\'
```


  


## 2. 跟进进度

终端会显示流式事件。SDK 示例会输出 JSON；cURL 则显示原始事件流。成功运行后，智能体 会创建 `tree.py`，并执行该文件，然后报告包含该文件的目录树。其他文件和输出取决于沙箱环境。

查找 `agent.session.turn.completed`，然后检查 智能体 报告的执行结果。完成一个回合并不代表每个工具都成功执行。以 `turn.failed`, `turn.cancelled`，或 `session.failed` 结尾的事件表示失败或被取消； `agent.session.idle` 单独出现并不代表成功。如果流提前断开， [检索该会话及其已保存的项](https://developers.openai.com/api/docs/guides/agents-api/sessions#how-to-recover-a-disconnected-stream) 后再重试。

## 3. 继续会话

保存从事件中获取的 `session_id` 。使用它来 [发送后续](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) 例如“向 `tree.py`，中添加一个最大深度选项，运行它，并把输出展示给我”。在发送后续输入之前打开事件流，以免错过早期事件。




## 4. 清理

保留会话以用于更多任务，或在完成后将其删除。 [保存所需文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 。

将示例中的说明性 `sess_123` 值替换为你保存的会话 ID。

  

    
Python

    Delete the session

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI


def delete_session(client: OpenAI, session_id: str):
    return client.beta.agents.sessions.delete(session_id)


if __name__ == "__main__":
    result = delete_session(OpenAI(), "sess_123")
    print(result.to_json())
```

  

  

    
JavaScript

    Delete the session

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

async function deleteSession(client, sessionId) {
  return client.beta.agents.sessions.delete(sessionId);
}

const result = await deleteSession(new OpenAI(), "sess_123");
console.log(result);
```

  

  

    
Go

    Delete the session

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

  

  

    
Java

    Delete the session

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

  

  

    
Ruby

    Delete the session

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

def delete_session(client, session_id)
  client.beta.agents.sessions.delete(session_id)
end

puts delete_session(OpenAI::Client.new, "sess_123")
```

  

  

    
cURL

    Delete the session

```bash
curl -X DELETE "https://api.openai.com/v1/agents/sessions/sess_123" \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY"
```



## 下一步

- [浏览示例应用](https://developers.openai.com/api/docs/guides/agents-api/overview#try-an-example).
- [配置 OpenAI 托管的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)：添加软件包和输入文件，控制网络访问，并下载制品。
- [与子智能体比较发布说明](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes).
- [处理文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).
- [选择环境](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings),或 [连接你自己的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).