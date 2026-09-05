# Webhooks

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI [webhooks](http://chatgpt.com/?q=eli5+what+is+a+webhook?) 允许你实时接收关于 API 中事件的通知，例如批量任务完成、后台响应生成或微调作业结束时。Webhook 会按照 [Standard Webhooks 规范](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)，递送至你控制的 HTTP 端点。完整的 webhook 事件列表可在 [API 参考](https://developers.openai.com/api/reference/resources/webhooks).

若要接收 API 项目的偏差监控通知，请参阅 [接收项目安全警报](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts).

[API 中 webhook 事件的参考



      View the full list of webhook events.](https://developers.openai.com/api/reference/resources/webhooks)

以下是能够接收来自 OpenAI 的 webhook 的简单服务器示例，专用于 [`response.completed`](https://developers.openai.com/api/reference/resources/webhooks) 事件。

对于 Ruby 示例，使用
`gem install openai webrick`，安装所需的依赖，然后设置 `OPENAI_API_KEY` 和
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


要查看此类 webhook 的实际效果，你可以在 OpenAI 控制台中设置一个订阅了 `response.completed`，的 webhook 端点，然后发起一个 API 请求以 [以后台模式生成响应](https://developers.openai.com/api/docs/guides/background).

你也可以从 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks).

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


在本指南中，你将学习如何在仪表板中创建 webhook 端点，设置服务端代码来处理它们，并验证传入请求确实来自OpenAI。

## 创建 Webhook 端点

要开始在你的服务器上接收 webhook 请求，请登录控制台并 [打开 webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。Webhook 按项目配置。

点击“Create”按钮以创建一个新的 webhook 端点。你需要配置三项内容：

- 端点的名称（仅供你参考）。
- 指向你控制的服务器的公共 URL。
- 要订阅的一个或多个事件类型。当这些事件发生时，OpenAI 会向指定的 URL 发送 HTTP POST 请求。

<img src="https://cdn.openai.com/API/images/webhook_config.png"
  alt="webhook endpoint edit dialog"
  width="450"
  style={{ margin: "16px 0" }}
/>

创建新的 webhook 后，你将获得一个签名密钥，用于对传入的 webhook 请求进行 服务端 验证。请妥善保存该值，后续将无法再次查看。

创建好 webhook 端点后，接下来需要设置一个 服务端 端点来处理这些传入的事件负载。

## 在服务器上处理 webhook 请求

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

你的端点应该使用成功的（`2xx`）状态码快速响应这些传入的 HTTP 请求，以表明已成功接收。为避免超时，我们建议将任何非平凡的处理任务卸载到后台工作进程，以便端点能够立即响应。
如果端点没有返回成功的（`2xx`）状态码，或在几秒内没有响应，webhook 请求将被重试。OpenAI 将以指数退避的方式持续尝试投递长达 72 小时。请注意， `3xx` 重定向不会被跟随；它们被视为失败，你应该更新你的端点以使用最终的目标 URL。

在极少数情况下，由于内部系统问题，OpenAI 可能会投递同一 webhook 事件的重复副本。你可以使用 `webhook-id` 请求头作为幂等键来进行去重。

### 在本地测试 webhook

测试 webhook 需要一个可在公共互联网上访问的 URL。这可能会让开发变得有些棘手，因为你的本地开发环境通常不对外开放。以下几种方案或许能帮上忙：

- [ngrok](https://ngrok.com/) 可以将你的 localhost 服务器暴露在公网 URL 上
- 云端开发环境，例如 [Replit](https://replit.com/), [GitHub Codespaces](https://github.com/features/codespaces), [Cloudflare Workers](https://workers.cloudflare.com/)，或 [Vercel 的 v0](https://v0.dev/).

## 验证 webhook 签名

虽然你可以在不进行任何验证的情况下接收来自 OpenAI 的 webhook 事件并处理结果，但建议验证传入的请求确实来自 OpenAI，尤其是当你的 webhook 会在后端执行任何类型的操作时。与 webhook 请求一同发送的请求头中包含可与 webhook 密钥结合使用的信息，用于验证该 webhook 来源于 OpenAI。

当你在 OpenAI 控制台中创建 webhook 端点时，系统会提供一个签名密钥，你应当将其作为环境变量配置在你的服务器上：

```
export OPENAI_WEBHOOK_SECRET="<your secret here>"
```

验证 webhook 签名最简单的方式是使用官方 OpenAI SDK 辅助库中的 `unwrap()` 方法：

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


此外，如果需要，你也可以自行实现签名验证， [如 Standard Webhooks 规范中所述](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#verifying-webhook-authenticity)

如果你丢失了签名密钥或不小心将其泄露，可以通过 [轮换签名密钥](https://platform.openai.com/settings/project/webhooks).