# Webhooks

> 完整的文档索引请参见 [llms.txt](/llms.txt)。可以通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI [webhooks](http://chatgpt.com/?q=eli5+what+is+a+webhook?) 允许你实时接收 API 中事件的通知，例如批量任务完成、后台响应生成或微调任务结束。webhook 会按照 [Standard Webhooks 规范](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)。投递到由你控制的 HTTP 端点。完整的 webhook 事件列表可在 [API 参考](https://developers.openai.com/api/reference/resources/webhooks).

[API 参考中查看 webhook 事件



      View the full list of webhook events.](https://developers.openai.com/api/reference/resources/webhooks)

以下是一些能够接收来自 OpenAI 的 webhook 的简单服务器示例，具体针对 [`response.completed`](https://developers.openai.com/api/reference/resources/webhooks) 事件。

webhook 服务器

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


如需查看此类 webhook 的实际效果，你可以在 OpenAI 控制台中设置一个订阅了 `response.completed`，的 webhook 端点，然后向 API 发起请求， [以后台模式生成响应](https://developers.openai.com/api/docs/guides/background).

你也可以从 [webhook 设置页面](https://platform.openai.com/settings/project/webhooks).

使用示例数据触发测试事件

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


在本指南中，你将学习如何在控制台中创建 webhook 端点、编写 服务端 代码来处理它们，并验证传入请求确实来自 OpenAI。

## 创建 Webhook 端点

若要开始在服务器上接收 webhook 请求，请登录控制台并 [打开 webhook 设置页面](https://platform.openai.com/settings/project/webhooks)。Webhook 按项目进行配置。

点击“Create”（创建）按钮以新建一个 webhook 端点。你需要配置以下三项：

- 端点的名称（仅供你参考）。
- 指向你所控制服务器的公共 URL。
- 要订阅的一个或多个事件类型。当这些事件发生时，OpenAI 会向你指定的 URL 发送 HTTP POST 请求。

<img src="https://cdn.openai.com/API/images/webhook_config.png"
  alt="webhook endpoint edit dialog"
  width="450"
  style={{ margin: "16px 0" }}
/>

创建新的 webhook 后，你将获得一个签名密钥，用于对传入的 webhook 请求进行服务端验证。请妥善保存该值，后续将无法再次查看。

创建好 webhook 端点后，接下来需要设置一个服务端端点来处理这些传入的事件负载。

## 在服务器上处理 webhook 请求

当你订阅的事件发生时，你的 webhook URL 会收到类似下面的 HTTP POST 请求：

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

你的端点应当使用一个成功的（`2xx`）状态码快速响应这些传入的 HTTP 请求，以表示已成功接收。为避免超时，我们建议将所有非简单处理卸载到后台工作进程，使端点能够立即响应。
如果端点没有返回成功的（`2xx`）状态码，或在几秒内没有响应，webhook 请求将被重试。OpenAI 将在最长 72 小时内以指数退避持续尝试发送。请注意， `3xx` 重定向不会被跟随；它们会被视为失败，你应当更新端点以使用最终的目标 URL。

在极少数情况下，由于内部系统问题，OpenAI 可能会投递同一 webhook 事件的重复副本。你可以使用 `webhook-id` 头作为幂等键来进行去重。

### 本地测试 webhook

测试 webhook 需要一个可在公共互联网上访问的 URL。这可能会让开发变得棘手,因为你的本地开发环境很可能未对公共开放。以下几种方式可能会对你有帮助:

- [ngrok](https://ngrok.com/) 可以将你的 localhost 服务器暴露在公网 URL 上
- 云端开发环境，例如 [Replit](https://replit.com/), [GitHub Codespaces](https://github.com/features/codespaces), [Cloudflare Workers](https://workers.cloudflare.com/)，或 [v0 from Vercel](https://v0.dev/).

## 验证 webhook 签名

虽然你可以在不进行任何验证的情况下接收来自 OpenAI 的 webhook 事件并处理结果，但你应当验证传入请求确实来自 OpenAI，尤其是当你的 webhook 会在后端执行任何类型的操作时。与 webhook 请求一同发送的标头中包含可与 webhook 密钥配合使用的信息，用于验证该 webhook 是否源自 OpenAI。

当你在 OpenAI 仪表板中创建 webhook 端点时，你将获得一个签名密钥，应当将其作为环境变量配置在你的服务器中：

```
export OPENAI_WEBHOOK_SECRET="<your secret here>"
```

验证 webhook 签名最简单的方式是使用 `unwrap()` 官方 OpenAI SDK 帮助器中的：

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


或者，如有需要，你可以按照 [Standard Webhooks 规范中的描述](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#verifying-webhook-authenticity)

如果你丢失了签名密钥或不小心将其泄露，可以通过 [轮换签名密钥](https://platform.openai.com/settings/project/webhooks).