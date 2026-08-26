# Webhooks

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 获取。

OpenAI [webhooks](http://chatgpt.com/?q=eli5+what+is+a+webhook?) 允许你接收关于 API 中事件（例如批处理完成、后台响应生成或微调作业完成）的实时通知。Webhooks 按照 [标准 Webhooks 规范](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)。传递到你控制的 HTTP 端点。完整的 webhook 事件列表可以在 [API 参考](https://developers.openai.com/api/reference/resources/webhooks).

[API webhook 事件参考



      View the full list of webhook events.](https://developers.openai.com/api/reference/resources/webhooks)

以下是能够从 OpenAI 接收 webhooks 的简单服务器示例，特别是用于 [`response.completed`](https://developers.openai.com/api/reference/resources/webhooks) 事件。

Webhooks 服务器

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


要实际查看此类 webhook，你可以在 OpenAI 仪表板中设置一个订阅了 `response.completed`，的 webhook 端点，然后向 [生成后台响应](https://developers.openai.com/api/docs/guides/background).

发出 API 请求。你还可以从 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks).

使用示例数据触发测试事件。

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-5.6",
  "input": "Write a very long novel about otters in space.",
  "background": true
}'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5.6",
  input: "Write a very long novel about otters in space.",
  background: true,
});

console.log(resp.status);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5.6",
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
		Model:      "gpt-5.6",
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
        .model("gpt-5.6")
        .input("Write a detailed market analysis.")
        .background(true)
        .build();

var response = client.responses().create(params);
System.out.println(response.status().orElseThrow());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Write a detailed market analysis.",
  background: true
)

puts(response.status)
```


在本指南中，你将学习如何在仪表板中创建 webhook 端点、设置服务端代码来处理它们，并验证入站请求确实来自 OpenAI。

## 创建 Webhook 端点

要开始在服务器上接收 webhook 请求，请登录仪表板并 [打开 webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。Webhooks 按项目配置。

点击“创建”按钮以创建新的 webhook 端点。你需要配置三件事：

- 端点的名称（仅供你参考）。
- 指向你控制的服务器的公开 URL。
- 要订阅的一种或多种事件类型。当这些事件发生时，OpenAI 将向指定的 URL 发送 HTTP POST 请求。

<img src="https://cdn.openai.com/API/images/webhook_config.png"
  alt="webhook endpoint edit dialog"
  width="450"
  style={{ margin: "16px 0" }}
/>

创建新的 webhook 后，你将收到一个签名密钥，用于服务端验证传入的 webhook 请求。请保存此值以备后续使用，因为你将无法再次查看它。

创建 webhook 端点后，你接下来需要设置一个服务端端点来处理传入的事件负载。

## 在服务器上处理 webhook 请求

当你订阅的事件发生时，你的 webhook URL 将收到一个类似这样的 HTTP POST 请求：

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

你的端点应尽快对这些传入的 HTTP 请求做出成功（`2xx`）状态码响应，以表示成功接收。为避免超时，我们建议将任何非平凡的處理过程卸载到后台工作线程，以便端点能立即响应。
如果端点未返回成功（`2xx`）状态码，或无响应超过几秒钟，webhook 请求将被重试。OpenAI 将在最多 72 小时内以指数退避方式持续尝试投递。请注意， `3xx` 不会跟随重定向；重定向会被视为失败，你的端点应更新为使用最终的目標 URL。

在极少数情况下，由于内部系统问题，OpenAI 可能会投递同一 webhook 事件的多份副本。你可以使用 `webhook-id` 标头作为幂等键进行去重。

### 在本地测试 webhook

测试 webhooks 需要一个在公共互联网上可访问的 URL。这可能会让开发变得棘手，因为你的本地开发环境通常不对外公开。以下几种选项可能会有所帮助：

- [ngrok](https://ngrok.com/) 可以在公共 URL 上暴露你的 localhost 服务器
- 云开发环境，如 [Replit](https://replit.com/), [GitHub Codespaces](https://github.com/features/codespaces), [Cloudflare Workers](https://workers.cloudflare.com/)，或 [来自 Vercel 的 v0](https://v0.dev/).

## 验证 Webhook 签名

虽然你可以在不进行任何验证的情况下接收来自OpenAI的webhook事件并处理结果，但你应该验证传入的请求确实来自OpenAI，特别是当你的webhook会在后端执行任何操作时。webhook请求附带的头部信息包含可用于结合webhook签名密钥来验证webhook确实来自OpenAI的数据。

当你在OpenAI控制台中创建webhook端点时，你会获得一个签名密钥，应将其作为环境变量在你的服务器上提供：

```
export OPENAI_WEBHOOK_SECRET="<your secret here>"
```

验证webhook签名最简单的方式是使用官方OpenAI SDK辅助工具的 `unwrap()` 方法：

使用OpenAI SDK进行签名验证

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


签名也可以使用 [Standard Webhooks 库](https://github.com/standard-webhooks/standard-webhooks/tree/main?tab=readme-ov-file#reference-implementations):

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


另外，如有需要，你也可以自行实现签名验证， [如 Standard Webhooks 规范所述](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#verifying-webhook-authenticity)

如果你丢失或意外泄露了签名密钥，你可以通过 [轮换签名密钥](https://platform.openai.com/settings/project/webhooks).