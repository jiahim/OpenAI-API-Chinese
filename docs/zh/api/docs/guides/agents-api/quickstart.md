# 智能体 API 快速入门

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

构建一个编码助手，它能编写 `tree.py`，运行它，并显示目录树。OpenAI 管理 智能体，管理它的对话，以及它工作的沙箱。

## 前提条件

创建一个 [应用程序 API 密钥](https://platform.openai.com/api-keys) 在你的 OpenAI Platform 项目中。授予 `api.agents.read` 以及 `api.agents.write` 用于会话操作，以及 `api.responses.write` 用于模型推理权限，然后导出：

```bash
export OPENAI_API_KEY="your-api-key"
```

将此密钥保留在 智能体 的沙箱之外。另请参阅 [OpenAI 托管的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#configure-the-sandbox) 了解沙箱配置和限制。

请求需要 `OpenAI-Beta: agents=v1` 请求头。OpenAI SDK 会自动添加它
  使用 cURL 时需显式添加。

## 1. 运行任务

选择一种语言，安装 OpenAI SDK，然后运行示例。SDK 示例使用 `beta.agents` 命名空间。该请求创建一个会话，提交一个任务，并流式传输进度。



Python


安装或更新 Python SDK：

```bash
pip install --upgrade openai
```

将示例另存为 `quickstart.py`:

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


在你的终端中运行它：

```bash
python quickstart.py
```

  


  

    
JavaScript


安装 JavaScript SDK：

```bash
npm install openai
```

将示例另存为 `quickstart.mjs`:

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


在你的终端中运行它：

```bash
node quickstart.mjs
```

  


  

    
Go


在新目录中，创建一个 Go 模块并安装 SDK：

```bash
go mod init agents-quickstart
go get github.com/openai/openai-go/v3@latest
```

将示例另存为 `main.go`:

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


在你的终端中运行它：

```bash
go run .
```

  


  

    
Java


将 OpenAI SDK 添加到 Maven 项目的 `pom.xml`:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>${apiReferencePackageVersions.java}</version>
</dependency>
```


将示例另存为 `src/main/java/AgentsApiSessionsStreamConversationExample.java`:

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


在你的终端中运行它：

```bash
mvn compile exec:java -Dexec.mainClass=AgentsApiSessionsStreamConversationExample
```

  


  

    
Ruby


安装 Ruby SDK：

```bash
gem install openai
```

将示例另存为 `quickstart.rb`:

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


在你的终端中运行它：

```bash
ruby quickstart.rb
```

  


  

    
cURL


在你的终端中使用 cURL，无需安装 SDK：

创建并运行 tree.py

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "agent": {\n      "model": "gpt-6-astra",\n      "instructions": "Write clean code, run it, and report the actual output."\n    },\n    "environment": { "type": "openai_hosted" },\n    "input": "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",\n    "stream": true\n  }\'
```


  


**不需要沙箱？** 将 `environment.type` 设置为 `none` 适用于那些智能体，这些智能体
  用于回答问题或调用外部工具，而无需运行命令或处理
  本地文件。 [了解
  详情](https://developers.openai.com/api/docs/guides/agents-api/architecture#start-without-an-environment).

## 2. 跟踪进度

终端会显示流式事件。SDK 示例会输出 JSON；cURL 显示原始事件流。在成功运行时，智能体 会创建 `tree.py`、执行，并报告包含该文件的目录树。其他文件和输出取决于沙箱。

查找 `agent.session.turn.completed`，然后查看 智能体 报告的执行结果。回合已完成并不代表每个工具都成功。以 `turn.failed`, `turn.cancelled`，或 `session.failed` 结尾的事件表示失败或取消； `agent.session.idle` 单独出现并不意味着成功。如果流提前断开， [检索该会话及其已保存的条目](https://developers.openai.com/api/docs/guides/agents-api/sessions#how-to-recover-a-disconnected-stream) 后再重试。

## 3. 继续该会话

保存从事件中获取的 `session_id` 。使用它来 [发送后续](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) ，例如“给 `tree.py`，添加一个最大深度选项，运行它，并把输出展示给我”。在发送后续输入之前先打开事件流，以免错过早期事件。




## 4. 清理

保留会话以用于更多任务，或在完成后将其删除。 [保存你需要的文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 。

替换示例中 `sess_123` 的占位值为你保存的会话 ID。

  

    
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



## Next steps

- [浏览示例应用](https://developers.openai.com/api/docs/guides/agents-api/overview#try-an-example).
- [配置 OpenAI 托管的沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)：添加包和输入文件，控制网络访问，并下载制品。
- [使用子智能体比较发布说明](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes).
- [处理文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).
- [选择环境](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings)，或 [连接你自己的沙盒](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).