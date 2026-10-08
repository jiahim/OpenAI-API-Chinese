# Webhooks

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI [webhooks](http://chatgpt.com/?q=eli5+what+is+a+webhook?) 允许你接收关于 API 中事件的实时通知，例如批量任务完成、后台响应生成完成或微调任务结束。Webhook 会按照 [Standard Webhooks 规范](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)，发送到你控制的 HTTP 端点。完整的 webhook 事件列表可在 [API 参考](https://developers.openai.com/api/reference/resources/webhooks).

若要接收某个 API 项目的偏差监控通知，请参阅 [接收项目安全提醒](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts).

若要接收组织级别针对安全标识符的警告与停用通知，请参阅 [安全强制执行通知](https://developers.openai.com/api/docs/guides/safety-enforcement).

对于 智能体 API 会话，请参阅 [会话 webhook](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) ，了解会话事件和恢复模式。webhook 接收方的端点设置、签名验证与投递相关指引请参考本页内容。

[API webhook 事件参考



      View the full list of webhook events.](https://developers.openai.com/api/reference/resources/webhooks)

下面是一些能够接收来自 OpenAI 的 webhook 的服务器示例，特别针对 [`response.completed`](https://developers.openai.com/api/reference/resources/webhooks) 事件。

对于 Ruby 示例，请使用以下命令安装所需依赖：
`gem install openai webrick`，然后设置 `OPENAI_API_KEY` 和
`OPENAI_WEBHOOK_SECRET`.

Webhook 服务器

```javascript
import OpenAI from "openai";
import express from "express";

const app = express();
const client = new OpenAI({ webhookSecret: process.env.OPENAI_WEBHOOK_SECRET });

// Don't use express.json() because signature verification needs the raw text body
app.use(express.text({ type: "application/json" }));

app.post("/webhook", async (req, res) => {
  try {
    const event = await client.webhooks.unwrap(req.body, req.headers);

    if (event.type === "response.completed") {
      const response_id = event.data.id;
      const response = await client.responses.retrieve(response_id);
      const output_text = response.output
        .filter((item) => item.type === "message")
        .flatMap((item) => item.content)
        .filter((contentItem) => contentItem.type === "output_text")
        .map((contentItem) => contentItem.text)
        .join("");

      console.log("Response output:", output_text);
    }
    res.status(200).send();
  } catch (error) {
    if (error instanceof OpenAI.InvalidWebhookSignatureError) {
      console.error("Invalid signature", error);
      res.status(400).send("Invalid signature");
    } else {
      throw error;
    }
  }
});

app.listen(8000, () => {
  console.log("Webhook server is running on port 8000");
});
```

```python
import os
from openai import OpenAI, InvalidWebhookSignatureError
from flask import Flask, request, Response

app = Flask(__name__)
client = OpenAI(webhook_secret=os.environ["OPENAI_WEBHOOK_SECRET"])


@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        # with webhook_secret set above, unwrap will raise an error if the signature is invalid
        event = client.webhooks.unwrap(request.data, request.headers)

        if event.type == "response.completed":
            response_id = event.data.id
            response = client.responses.retrieve(response_id)
            print("Response output:", response.output_text)

        return Response(status=200)
    except InvalidWebhookSignatureError as e:
        print("Invalid signature", e)
        return Response("Invalid signature", status=400)


if __name__ == "__main__":
    app.run(port=8000)
```

```ruby
require "openai"
require "webrick"

client = OpenAI::Client.new(
  webhook_secret: ENV.fetch("OPENAI_WEBHOOK_SECRET")
)

server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: Integer(ENV.fetch("OPENAI_WEBHOOK_PORT", "8000")),
  Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN),
  AccessLog: []
)
response_workers = []

server.mount_proc("/webhook") do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end

  headers = request.header.transform_values(&:first)
  event = client.webhooks.unwrap(request.body, headers)

  if event.is_a?(OpenAI::Models::Webhooks::ResponseCompletedWebhookEvent)
    response_workers.select!(&:alive?)
    response_workers << Thread.new(event.data.id) do |response_id|
      completed_response = client.responses.retrieve(response_id)
      puts "Response output: #{completed_response.output_text}"
    end
  end

  response.status = 200
  response.body = "ok"
rescue OpenAI::Errors::InvalidWebhookSignatureError, ArgumentError => error
  warn "Invalid signature: #{error.message}"
  response.status = 400
  response.body = "Invalid signature"
ensure
  server.shutdown if ENV["OPENAI_WEBHOOK_EXIT_AFTER_REQUEST"] == "1"
end

Signal.trap("INT") { server.shutdown }
port = server.listeners.first.addr[1]
puts "Webhook server listening on http://127.0.0.1:#{port}/webhook"
$stdout.flush
server.start
response_workers.each(&:join)
```


要查看像这样的实际 webhook 示例，你可以在 OpenAI 控制台中设置一个订阅到以下事件的 webhook 端点 `response.completed`，然后向以下地址发起 API 请求以 [在后台模式下生成响应](https://developers.openai.com/api/docs/guides/background).

你也可以通过以下页面使用示例数据触发测试事件 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks).

生成后台响应

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-6-astra",
  "input": "Write a very long novel about otters in space.",
  "background": true
}'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true,
});

console.log(resp.status);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-6-astra",
    input="Write a very long novel about otters in space.",
    background=True,
)

print(resp.status)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		Background: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a very long novel about otters in space."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Write a detailed market analysis.")
        .background(true)
        .build();

var response = client.responses().create(params);
System.out.println(response.status().orElseThrow());
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    BackgroundModeEnabled = true,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a very long novel about otters in space.")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.Status);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Write a detailed market analysis.",
  background: true
)

puts(response.status)
```


在本指南中，你将学习如何在控制台中创建 webhook 端点、设置 服务端 代码来处理它们，并验证入站请求确实来自 OpenAI。

## 创建 Webhook 端点

若要开始在你服务器上接收项目 webhook 请求，请登录 dashboard [打开 webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。本章节的配置针对项目端点。如需了解组织级安全事件，请参阅 [安全强制执行通知](https://developers.openai.com/api/docs/guides/safety-enforcement).

点击 "Create" 按钮创建新的 webhook 端点。你需要配置以下三项：

- 端点名称（仅供参考）。
- 一个你自行控制的服务器的公共 URL。
- 一个或多个要订阅的事件类型。当这些事件发生时，OpenAI 将向指定 URL 发送 HTTP POST 请求。

<img src="https://cdn.openai.com/API/images/webhook_config.png"
  alt="webhook endpoint edit dialog"
  width="450"
  style={{ margin: "16px 0" }}
/>

创建新的 webhook 后，你将获得一个签名密钥，用于对传入的 webhook 请求进行服务端验证。请妥善保存此值，因为之后将无法再次查看。

创建好 webhook 端点后，接下来你需要设置一个服务端端点来处理这些传入的事件载荷。

## 在服务端处理 webhook 请求

当你订阅的事件发生时，你的 webhook URL 将收到类似如下的 HTTP POST 请求：

```
POST https://yourserver.com/webhook
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52
webhook-timestamp: 1750287078
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=
{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "response.completed",
  "created_at": 1750287018,
  "data": { "id": "resp_abc123" }
}
```

你的端点应当使用成功（`2xx`）状态码快速响应这些传入的 HTTP 请求，以表示已成功接收。为避免超时，我们建议将所有非即时处理任务交给后台工作进程，使端点能够立即响应。
如果端点未返回成功（`2xx`）状态码，或在数秒内未作出响应，webhook 请求将被重试。OpenAI 将在最长 72 小时内以指数退避策略持续尝试发送。请注意， `3xx` 不会被跟随；它们将被视为失败，并且你需要更新端点以使用最终的目标 URL。

在极少数情况下，由于内部系统问题，OpenAI 可能会发送同一 webhook 事件的重复副本。你可以使用 `webhook-id` 响应头作为幂等键来去重。

### 在本地测试 Webhook

测试 webhook 需要一个可在公网上访问的 URL。由于你的本地开发环境通常不会对外开放，这会让开发变得有些棘手。以下几种方案可能会有所帮助：

- [ngrok](https://ngrok.com/) 它可以将你的 localhost 服务器暴露在一个公共 URL 上
- 云开发环境，例如 [Replit](https://replit.com/), [GitHub Codespaces](https://github.com/features/codespaces), [Cloudflare Workers](https://workers.cloudflare.com/)，或 [Vercel 的 v0](https://v0.dev/).

## 验证 Webhook 签名

虽然你可以在不进行任何验证的情况下接收来自 OpenAI 的 Webhook 事件并处理结果，但你应当验证传入请求确实来自 OpenAI，特别是当你的 Webhook 会在后端执行任何类型的操作时。与 Webhook 请求一同发送的标头包含可与 Webhook 密钥结合使用的信息，用于验证该 Webhook 来自 OpenAI。

当你在 OpenAI 仪表板中创建 Webhook 端点时，你会获得一个签名密钥，你应当把它作为环境变量提供给你的服务器：

```
export OPENAI_WEBHOOK_SECRET="<your secret here>"
```

验证 Webhook 签名的最简单方式是使用官方的 `unwrap()` OpenAI SDK 辅助工具中的：

使用 OpenAI SDK 进行签名验证

```javascript
const client = new OpenAI();
const webhook_secret = process.env.OPENAI_WEBHOOK_SECRET;
if (!webhook_secret) throw new Error("Set OPENAI_WEBHOOK_SECRET.");

// will throw if the signature is invalid
const event = await client.webhooks.unwrap(
  req.body,
  req.headers,
  webhook_secret
);
```

```python
import os

from flask import request
from openai import OpenAI

client = OpenAI()
webhook_secret = os.environ["OPENAI_WEBHOOK_SECRET"]

# will raise if the signature is invalid
event = client.webhooks.unwrap(
    request.data,
    request.headers,
    secret=webhook_secret,
)
```

```go
// Verify the original bytes, before any JSON parsing.
event, err := client.Webhooks.Unwrap(body, r.Header)
if err != nil {
	http.Error(w, "Invalid webhook", http.StatusBadRequest)
	return
}
fmt.Println(event.Type)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.core.http.Headers;
import com.openai.models.webhooks.UnwrapWebhookEvent;
import com.openai.models.webhooks.WebhookVerificationParams;

// Your HTTP framework supplies the original request bytes and headers.
// Load secret from OPENAI_WEBHOOK_SECRET in your application.
// Reject InvalidWebhookSignatureException (invalid signature or timestamp)
// and IllegalArgumentException (missing required headers).
public static UnwrapWebhookEvent verifyWebhook(
    OpenAIClient client, byte[] body, Headers headers, String secret) {
  return client
      .webhooks()
      .unwrap(
          WebhookVerificationParams.builder()
              .payload(body)
              .headers(headers)
              .secret(secret)
              .build());
}
```

```ruby
require "openai"
require "webrick"

client = OpenAI::Client.new(
  api_key: ENV.fetch("OPENAI_API_KEY"),
  webhook_secret: ENV.fetch("OPENAI_WEBHOOK_SECRET")
)
server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: Integer(ENV.fetch("OPENAI_WEBHOOK_PORT", "8000")),
  Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN),
  AccessLog: []
)

server.mount_proc("/webhook") do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end

  headers = request.header.transform_values(&:first)
  event = client.webhooks.unwrap(request.body, headers)
  puts "Verified webhook event: #{event.type}"

  response.status = 200
  response.body = "ok"
rescue OpenAI::Errors::InvalidWebhookSignatureError, ArgumentError
  response.status = 400
  response.body = "Invalid signature"
ensure
  server.shutdown if ENV["OPENAI_WEBHOOK_EXIT_AFTER_REQUEST"] == "1"
end

Signal.trap("INT") { server.shutdown }
port = server.listeners.first.addr[1]
puts "Webhook server listening on http://127.0.0.1:#{port}/webhook"
$stdout.flush
server.start
```


也可以使用 [Standard Webhooks 库](https://github.com/standard-webhooks/standard-webhooks/tree/main?tab=readme-ov-file#reference-implementations):

使用 Standard Webhooks 库进行签名验证

```rust
use standardwebhooks::Webhook;

let webhook_secret = std::env::var("OPENAI_WEBHOOK_SECRET").expect("OPENAI_WEBHOOK_SECRET not set");
let wh = Webhook::new(webhook_secret);
wh.verify(webhook_payload, webhook_headers).expect("Webhook verification failed");
```

```php
$webhook_secret = getenv("OPENAI_WEBHOOK_SECRET");
$wh = new \StandardWebhooks\Webhook($webhook_secret);
$wh->verify($webhook_payload, $webhook_headers);
```


或者，如果需要，你也可以按照 Standard Webhooks 规范中的描述自行实现 [签名验证](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#verifying-webhook-authenticity)

如果你遗失了签名密钥或不小心泄露了它，可以通过 [轮换签名密钥](https://platform.openai.com/settings/project/webhooks).