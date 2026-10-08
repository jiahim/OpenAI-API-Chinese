# 超高速模式

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

极速模式是 OpenAI API 中最快的服务层级。它广泛适用于 GPT-6 Astra 和 GPT-6.1 Sol，对于 GPT-5.6 Sol 提供 [预览访问](https://openai.com/index/previewing-ultrafast/) 。在速度优势足以抵消更高成本时使用它。

我们强烈推荐使用 [WebSockets](https://developers.openai.com/api/docs/guides/websocket-mode)，尤其适用于短时间内连续多次调用工具的智能体应用。如果没有持久连接，网络开销可能会抵消延迟优化带来的收益。

所有 API 用户均可为 GPT-6 Astra 和 GPT-6.1 Sol 使用超快速模式。
  超快速模式与 Standard 和 Fast 模式采用独立的速率限制。增加流量前，请查看你的
  组织限制。如果你的组织与 OpenAI 客户团队合作，请联系他们申请提高速率限制。
  如果你的组织有 该公司 客户团队，请联系他们申请更高的速率限制。

## 配置你的请求

Set `model` to `gpt-6-astra` or `gpt-6.1-sol` and `service_tier` to `ultrafast` in each `response.create` event.

Use Ultrafast across turns on one WebSocket

```javascript
// Install: npm install openai ws
// Set OPENAI_API_KEY in your environment.

import OpenAI from "openai";
import { ResponsesWS } from "openai/resources/responses/ws";

const client = new OpenAI();
const ws = new ResponsesWS(client);
let previousResponseId = null;

try {
  for (const input of [
    "Explain why the sky is blue in one sentence.",
    "Now explain why sunsets look red.",
  ]) {
    let completed = false;
    const events = ws.stream();
    ws.send({
      type: "response.create",
      model: "gpt-6-astra",
      service_tier: "ultrafast",
      previous_response_id: previousResponseId,
      input,
    });

    for await (const event of events) {
      if (event.type === "error") throw event.error;
      if (event.type !== "message") continue;
      const message = event.message;
      if (message.type === "response.output_text.delta") {
        process.stdout.write(message.delta);
      } else if (message.type === "response.completed") {
        previousResponseId = message.response.id;
        completed = true;
        console.log();
        break;
      } else if (
        message.type === "response.failed" ||
        message.type === "response.incomplete"
      ) {
        throw new Error(JSON.stringify(message));
      }
    }

    if (!completed) {
      throw new Error("Connection closed before the response finished.");
    }
  }
} finally {
  ws.close();
}
```

```python
# Install: pip install --upgrade "openai[realtime]"
# Set OPENAI_API_KEY in your environment.

from openai import OpenAI

client = OpenAI()
previous_response_id: str | None = None
prompts = [
    "Explain why the sky is blue in one sentence.",
    "Now explain why sunsets look red.",
]

with client.responses.connect() as connection:
    for prompt in prompts:
        connection.response.create(
            model="gpt-6-astra",
            service_tier="ultrafast",
            previous_response_id=previous_response_id,
            input=prompt,
        )
        for event in connection:
            if event.type == "response.output_text.delta":
                print(event.delta, end="", flush=True)
            elif event.type == "response.completed":
                previous_response_id = event.response.id
                print()
                break
            elif event.type in {"response.failed", "response.incomplete", "error"}:
                raise RuntimeError(event.to_json())
        else:
            raise RuntimeError("Connection closed before the response finished.")
```


The example streams two responses over the same connection. The second request sends the new prompt and passes the first response's ID as `previous_response_id`. Reuse the connection for later turns and tool results. See [Continue with incremental inputs](https://developers.openai.com/api/docs/guides/websocket-mode#continue-with-incremental-inputs).

## HTTP 替代方案

Ultrafast 也支持通过 SDK 发起 HTTP 请求。对于需要频繁调用工具的智能体应用，请使用持久的 WebSocket 连接，以降低请求之间的开销。

通过 HTTP 创建一个 Ultrafast 响应

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const response = await client.responses.create({
  model: "gpt-6-astra",
  service_tier: "ultrafast",
  input: "Explain why the sky is blue in one sentence.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="Explain why the sky is blue in one sentence.",
    service_tier="ultrafast",
)

print(response.output_text)
```

```go
client := openai.NewClient()
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
	Model:       "gpt-6-astra",
	ServiceTier: responses.ResponseNewParamsServiceTierUltrafast,
	Input:       responses.ResponseNewParamsInputUnion{OfString: openai.String("Explain why the sky is blue in one sentence.")},
})
if err != nil {
	panic(err)
}
fmt.Println(response.OutputText())
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Explain why the sky is blue in one sentence.")
        .serviceTier(ResponseCreateParams.ServiceTier.ULTRAFAST)
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  service_tier: :ultrafast,
  input: "Explain why the sky is blue in one sentence."
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Explain why the sky is blue in one sentence.",
    "service_tier": "ultrafast"
  }'
```


本示例会等待完整响应返回。若要边接收边显示输出，请启用 [流式传输](https://developers.openai.com/api/docs/guides/streaming-responses?api-mode=responses).

## 可用性

GPT-6.1 Sol 具有以下默认的 Ultrafast 令牌速率限制：

| API 使用层级 | 每分钟令牌数 (TPM) |
| -------------- | ----------------------- |
| Build          | 1,000,000               |
| Launch         | 4,000,000               |
| Grow           | 40,000,000              |

GPT-6 Astra 具有以下默认 Ultrafast 速率限制：

| API 使用层级 | 每分钟令牌数 (TPM) |
| -------------- | ----------------------- |
| Build          | 500,000                 |
| Launch         | 1,000,000               |
| Grow           | 5,000,000               |

请参阅 [超快模式定价表](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast) 了解输入、缓存输入、缓存写入以及输出价格。

GPT-6.1 Sol 的超快模式支持美国和欧盟的数据驻留以及全球处理。GPT-6 Astra 超快模式仅支持美国数据驻留和全球处理。