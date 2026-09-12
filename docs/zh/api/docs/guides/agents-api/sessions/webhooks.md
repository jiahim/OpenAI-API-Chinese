# Session webhooks

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用 webhook 响应会话状态变更，无需保持事件流处于打开状态。Webhook 处理器可以 [启动或重新连接沙箱计算](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes)、更新你的应用，或触发工作流。

## 支持的事件

| 事件                           | 触发时机                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `agent.session.created`         | 会话已创建。                                                                 |
| `agent.session.action_required` | 会话需要函数结果、初始环境连接或重新连接。 |
| `agent.session.in_progress`     | 会话开始处理一轮对话。                                                 |
| `agent.session.idle`            | 会话空闲，可以接收更多输入。                                         |
| `agent.session.failed`          | 会话进入失败状态。                                                    |

一个 `agent.session.action_required` event 包含会话 ID 以及
`required_action.type` 的 `function_call` 或 `environment_connection`.

```json
{
  "type": "agent.session.action_required",
  "data": {
    "id": "sess_abc123",
    "required_action": { "type": "function_call" }
  }
}
```

检索该会话并查看 `required_actions` 以获取调用 ID、参数或
环境 ID。Webhook 不包含这些详细信息。

## 设置 Webhook

遵循共享的 [webhook 设置指南](https://developers.openai.com/api/docs/guides/webhooks#creating-webhook-endpoints) 创建一个端点并选择 智能体 API 事件。请妥善保存该端点的签名密钥，用于 [签名验证](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures).

## 接收事件

每当订阅的事件发生时，OpenAI 会发送一个已签名的 HTTP POST 请求：

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1750287018,
  "type": "agent.session.created",
  "data": {
    "id": "sess_abc123",
    "environment_id": "ccarenv_abc123",
    "environment_type": "self_hosted",
    "connect": {
      "remote_url": "https://api.openai.com/v1/agents/api"
    }
  }
}
```




在配置沙箱之前，检索会话的当前状态。参见 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks).

### 启动执行器

对于自托管会话， `agent.session.created` 包含启动执行器所需的环境 ID 和连接 URL。将 `ENVIRONMENT_ID` 设置为 `data.environment_id` 并 `REMOTE_URL` 设置为 `data.connect.remote_url`。这与会话中作为 `environment.remote_url` 返回的 URL 相同。请保存这两个值并在重连时复用：

```bash
CODEX_API_KEY="$OPENAI_ENVIRONMENT_KEY" \
codex exec-server \
  --remote "$REMOTE_URL" \
  --environment-id "$ENVIRONMENT_ID"
```

使用 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 作为 `CODEX_API_KEY`。请将你的应用 API 密钥保存在环境之外。

## 验证并处理事件

设置 `OPENAI_API_KEY` 并 `OPENAI_WEBHOOK_SECRET`. 对于 Python，请安装 `fastapi`, `uvicorn`，以及 `openai`. 对于 JavaScript，请安装 `express` 并 `openai`.

处理器会验证签名并监听 8000 端口。设置 `PORT` 以更改端口。在生产环境中， [将较慢的任务加入队列](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks).

Webhook 处理器

```javascript
import express from "express";
import OpenAI from "openai";

const app = express();
const webhooks = new OpenAI({
  webhookSecret: process.env.OPENAI_WEBHOOK_SECRET,
});

app.post(
  "/webhooks/openai",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body.toString("utf8");
    try {
      await webhooks.webhooks.verifySignature(payload, request.headers);
    } catch {
      response.status(400).send("Invalid signature");
      return;
    }
    const event = JSON.parse(payload);
    if (event.type === "agent.session.idle") {
      const session = await webhooks.beta.agents.sessions.retrieve(
        event.data.id
      );
      console.log("session idle event:", session.id);
    } else {
      console.log("session event:", event.type, event.data.id);
    }
    response.sendStatus(200);
  }
);

app.listen(Number(process.env.PORT ?? 8000));
```

```python
import json
import os

import uvicorn
from fastapi import FastAPI, Request, Response
from openai import AsyncOpenAI, InvalidWebhookSignatureError

app = FastAPI()
webhooks = AsyncOpenAI(webhook_secret=os.environ["OPENAI_WEBHOOK_SECRET"])


@app.post("/webhooks/openai")
async def handle_webhook(request: Request):
    payload = await request.body()
    try:
        webhooks.webhooks.verify_signature(payload=payload, headers=request.headers)
    except (InvalidWebhookSignatureError, ValueError):
        return Response("Invalid signature", status_code=400)

    event = json.loads(payload)
    if event["type"] == "agent.session.idle":
        session_id = event["data"]["id"]
        session = await webhooks.beta.agents.sessions.retrieve(session_id, timeout=10)
        print("session idle event:", session.id)
    else:
        print("session event:", event["type"], event["data"]["id"])
    return Response(status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, port=int(os.environ.get("PORT", "8000")))
```

```go
import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/openai/openai-go/v3"
)

client := openai.NewClient()
http.HandleFunc("/webhooks/openai", func(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}
	if err := client.Webhooks.VerifySignature(body, r.Header); err != nil {
		http.Error(w, "Invalid signature", http.StatusBadRequest)
		return
	}
	var event struct {
		Type string `json:"type"`
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &event); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	if event.Type == "agent.session.idle" {
		session, err := client.Beta.Agents.Sessions.Get(r.Context(), event.Data.ID)
		if err != nil {
			http.Error(w, "Could not retrieve session", http.StatusInternalServerError)
			return
		}
		fmt.Println("session idle event:", session.ID)
	} else {
		fmt.Println("session event:", event.Type, event.Data.ID)
	}
	w.WriteHeader(http.StatusOK)
})
port := os.Getenv("PORT")
if port == "" {
	port = "8000"
}
if err := http.ListenAndServe(":"+port, nil); err != nil {
	panic(err)
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.Headers;
import com.openai.errors.InvalidWebhookSignatureException;
import com.openai.models.webhooks.WebhookVerificationParams;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8000"));
var server = HttpServer.create(new InetSocketAddress(port), 0);
server.createContext(
    "/webhooks/openai",
    exchange -> {
      try (exchange) {
        if (!exchange.getRequestMethod().equals("POST")) {
          exchange.sendResponseHeaders(405, -1);
          return;
        }
        String payload =
            new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        try {
          client
              .webhooks()
              .verifySignature(
                  WebhookVerificationParams.builder()
                      .payload(payload)
                      .headers(Headers.builder().putAll(exchange.getRequestHeaders()).build())
                      .build());
        } catch (InvalidWebhookSignatureException e) {
          exchange.sendResponseHeaders(400, -1);
          return;
        }
        var event = json.readTree(payload);
        if (event.path("type").asText().equals("agent.session.idle")) {
          var session =
              client
                  .beta()
                  .agents()
                  .sessions()
                  .retrieve(event.path("data").path("id").asText());
          System.out.println("session idle event: " + session.id());
        } else {
          System.out.println(
              "session event: "
                  + event.path("type").asText()
                  + " "
                  + event.path("data").path("id").asText());
        }
        exchange.sendResponseHeaders(200, -1);
      }
    });
server.start();
```

```ruby
require "openai"
require "webrick"
require "json"

client = OpenAI::Client.new
server = WEBrick::HTTPServer.new(Port: Integer(ENV.fetch("PORT", "8000")))
server.mount_proc "/webhooks/openai" do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end
  payload = request.body
  begin
    client.webhooks.verify_signature(payload, request.header.transform_values(&:first))
  rescue OpenAI::Errors::InvalidWebhookSignatureError
    response.status = 400
    response.body = "Invalid signature"
    next
  end
  event = JSON.parse(payload)
  if event["type"] == "agent.session.idle"
    session = client.beta.agents.sessions.retrieve(event.fetch("data").fetch("id"))
    puts "session idle event: #{session.id}"
  else
    puts "session event: #{event["type"]} #{event.dig("data", "id")}"
  end
  response.status = 200
end
trap("INT") { server.shutdown }
server.start
```


## 环境连接事件

当初始或后续输入需要断开连接的自托管执行器时，API 会添加一项 `environment_connection` 必需操作。它会发出 `agent.session.action_required` **，然后开始等待** 连接建立。

请检索该会话，并确认它 `required_actions` 仍然在请求连接。然后使用 `session.environment.id` 并 `session.environment.remote_url`。启动该执行器。此 webhook 不包含 `connect.remote_url`。如果执行器在等待超时之前就已连接，API 会清除该必需操作，并在无需客户端重新提交的情况下继续该提交。

API 最多会等待五分钟来建立连接。在该等待期间，后续输入请求可以保持打开状态。请相应地配置客户端和代理的超时时间。 `agent.session.in_progress` 仅确认执行已开始，并不表示 API 正在等待连接。

如果等待超时，该提交将失败。初始输入可能会异步失败，并使会话停留在 `failed`。状态。连接等待并不提供持久的输入队列。进程崩溃或客户端断开可能需要进行重试。

## 会话与轮次结果

`agent.session.idle` 表示会话已准备好接收更多输入，并不表示其上一轮已成功。请检查该轮的状态或观察 `agent.session.turn.completed`, `agent.session.turn.failed`,或者 `agent.session.turn.cancelled` 会话流上的情况。已完成的轮次仍可能包含失败的工具调用。请检查工具结果以及智能体的最终响应。

`agent.session.failed` 报告的是失败的会话，而非每一轮次的失败。删除会话没有对应的 webhook，也不会停止提供方的计算。