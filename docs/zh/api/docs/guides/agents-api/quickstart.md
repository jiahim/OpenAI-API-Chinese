# 智能体 API 快速入门

> 完整文档索引请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

构建一个编码助手，它能够编写 `tree.py`、运行代码，并展示目录树。OpenAI 负责管理智能体、其对话以及运行所用的沙箱。

## 前置条件

在你的 OpenAI Platform 项目中创建一个 [application API 密钥](https://platform.openai.com/api-keys) ，并授予 `api.agents.read` 会话操作权限，以及 `api.agents.write` 用于模型推理，然后导出它： `api.responses.write` 。将此密钥保存在 智能体 沙箱外部。

```bash
export OPENAI_API_KEY="your-api-key"
```

有关沙箱配置和限制，请参阅 [OpenAI-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#configure-the-sandbox) 。请求需要。

请求头。OpenAI SDK 会自动添加它； `OpenAI-Beta: agents=v1` 使用 cURL 时请显式包含。
  使用 cURL 时请显式包含该请求头。

## 1. 运行任务

选择语言，安装 OpenAI SDK，然后运行示例。SDK 示例使用 `beta.agents` 命名空间。该请求会创建一个会话，提交任务，并以流式方式返回进度。



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
    ).with_result_collection() as stream:
        for event in stream:
            print(event.to_json(indent=None), flush=True)
        result = stream.get_final_result()
    print(result.output_text)
    session_id = result.session_id
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
events.withResultCollection();
try {
  for await (const event of events) {
    console.log(JSON.stringify(event));
  }
  const result = await events.finalResult();
  console.log(result.output_text);
  console.log("Session:", result.session_id);
} finally {
  events.controller.abort();
}
```


在终端中运行：

```bash
node quickstart.mjs
```

  


  

    
Go


在新的目录下创建一个 Go 模块并安装 SDK：

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
openai.BetaAgentSessionWithResultCollection(events)
if events.Err() != nil {
	panic(events.Err())
}
for events.Next() {
	event := events.Current()
	fmt.Println(event.RawJSON())
}
result, err := openai.BetaAgentSessionFinalResult(events)
if err != nil {
	panic(err)
}
fmt.Println(result.OutputText())
sessionID := result.SessionID()
fmt.Println("Session:", sessionID)
```


在终端中运行：

```bash
go run .
```

  


  

    
Java


将 OpenAI SDK 添加到你的 Maven 项目中 `pom.xml`:

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
import com.openai.services.beta.agents.AgentTurnResults;

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
  AgentTurnResults.withResultCollection(events);
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    System.out.println(json.writeValueAsString(event));
  }
  var result = AgentTurnResults.getFinalResult(events);
  System.out.println(result.outputText());
  String sessionId = result.sessionId();
  System.out.println(sessionId);
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
  events.with_result_collection
  events.each do |event|
    puts JSON.generate(event.to_h)
  end
  result = events.get_final_result
  puts result.output_text
  session_id = result.session_id
  puts "Session: #{session_id}"
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


  


**不需要沙箱？** 将 `environment.type` 设置为 `none` 适用于无需运行命令或处理本地文件即可回答问题或调用外部工具的 智能体
  回答问题或调用外部工具，而无需运行命令或处理
  本地文件。 [了解
  更多](https://developers.openai.com/api/docs/guides/agents-api/architecture#start-without-an-environment).

## 2. 跟踪进度

终端会显示流式事件。SDK 示例会打印 JSON；cURL 会显示原始事件流。在成功运行时，智能体 会创建 `tree.py`，执行它，并报告包含该文件的目录树。其他文件和输出取决于沙箱。

查找 `agent.session.turn.completed`，然后检查 智能体 报告的执行结果。一个已完成的回合并不能保证每个工具都成功。以 `turn.failed`, `turn.cancelled`，或 `session.failed` 结尾的事件表示失败或被取消； `agent.session.idle` 单独出现并不代表成功。如果流提前断开， [检索会话及其已保存的条目](https://developers.openai.com/api/docs/guides/agents-api/sessions#how-to-recover-a-disconnected-stream) 后再重试。

## 3. 继续会话

保存 `session_id` 事件，以便用它 [发送后续请求](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) ，例如“给 `tree.py`，添加一个最大深度选项，运行它，然后把输出展示给我。”在发送后续输入之前打开事件流，这样你就不会错过早期事件。




## 4. 清理

保留会话以执行更多任务，或者在完成时将其删除。 [保存所需的文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 的请求。

将示例中的占位 session_id `sess_123` 值替换为你保存的会话 ID。

  

    
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

- [探索示例应用](https://developers.openai.com/api/docs/guides/agents-api/overview#try-an-example).
- [配置 OpenAI 托管的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)：添加包和输入文件，控制网络访问，并下载制品。
- [将发布说明与子智能体进行比较](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes).
- [处理文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files).
- [选择环境](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings)，或 [连接你自己的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).