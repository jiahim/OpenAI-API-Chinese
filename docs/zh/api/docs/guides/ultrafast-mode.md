# 极速模式

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Ultrafast 模式是 OpenAI API 中最快的服务等级。它已面向 GPT-6 Astra 全面开放，并 [提供预览访问](https://openai.com/index/previewing-ultrafast/) 权限（适用于 GPT-5.6 Sol）。当速度值得更高的成本时使用它。

我们强烈推荐 [WebSockets](https://developers.openai.com/api/docs/guides/websocket-mode)，尤其是对于需要连续进行多次工具调用的智能体应用。如果没有持久连接，网络开销可能会降低延迟带来的收益。

GPT-6 Astra 的 Ultrafast 模式目前对所有 API 用户开放，但有 [较低
  速率限制](#availability)。如果你的组织与 OpenAI 账户
  团队合作，请联系他们申请更高的速率限制或 GPT-5.6
  Sol 的预览访问权限。

## 配置你的请求

将 `model` 设置为 `gpt-6-astra` 并在每个 `service_tier` 设置为 `ultrafast` 中 `response.create` 事件中。

在同一 WebSocket 上跨多轮使用 Ultrafast

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


该示例在同一连接上流式输出两个响应。第二个请求发送新的提示，并将第一个响应的 ID 作为 `previous_response_id`。传入。在后续轮次和工具结果中复用该连接。参见 [使用增量输入继续](https://developers.openai.com/api/docs/guides/websocket-mode#continue-with-incremental-inputs).

## HTTP 替代方案

Ultrafast 也支持通过 SDK 发送 HTTP 请求。对于需要频繁调用工具的智能体应用，建议使用持久的 WebSocket 连接以降低请求间的开销。

通过 HTTP 创建 Ultrafast 响应

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


本示例会等待完整响应生成。若要边生成边输出，请启用 [流式传输](https://developers.openai.com/api/docs/guides/streaming-responses?api-mode=responses).

## 可用性

GPT-6 Astra 默认的 Ultrafast 速率限制如下：

| API 使用层级 | 每分钟令牌数（TPM） |
| -------------- | ----------------------- |
| 层级 1–3      | 500,000                 |
| 层级 4         | 1,000,000               |
| 层级 5         | 5,000,000               |

请参阅 [Ultrafast 定价表](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast) 以了解输入、缓存输入、缓存写入和输出的价格。

Ultrafast 仅支持美国数据驻留和全球处理，不支持欧盟或其他非美国区域处理端点。