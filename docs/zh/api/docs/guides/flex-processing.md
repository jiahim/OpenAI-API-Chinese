# Flex processing

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页的 Markdown 版本。

Flex 处理以更慢的响应速度和偶尔的资源不可用为代价，为 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 请求提供更低的成本。它非常适合非生产环境或较低优先级的任务，例如模型评估、数据丰富和异步工作负载。

Token 按 [Batch API 费率](https://developers.openai.com/api/docs/pricing) 定价 [Batch 接口 rates](https://developers.openai.com/api/docs/guides/batch)，并可通过 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

Flex 处理目前为测试版，模型可用性有限。受支持的模型
  列于 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=flex).

## API 使用情况

要使用 Flex 处理，请将 `service_tier` 参数设置为 `flex` ，在你的 API 请求中：


  Flex 处理示例

```javascript
import OpenAI from "openai";
const client = new OpenAI({
  timeout: 15 * 1000 * 60, // Increase default timeout to 15 minutes
});

const response = await client.responses.create(
  {
    model: "gpt-5.6",
    instructions: "List and describe all the metaphors used in this book.",
    input: "<very long text of book here>",
    service_tier: "flex",
  },
  { timeout: 15 * 1000 * 60 }
);

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI(
    # increase default timeout to 15 minutes (from 10 minutes)
    timeout=900.0
)

# you can override the max timeout per request as well
response = client.with_options(timeout=900.0).responses.create(
    model="gpt-5.6",
    instructions="List and describe all the metaphors used in this book.",
    input="<very long text of book here>",
    service_tier="flex",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient(option.WithRequestTimeout(15 * time.Minute))
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-5.6",
		Instructions: openai.String("List and describe all the metaphors used in this book."),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("<very long text of book here>")},
		ServiceTier:  responses.ResponseNewParamsServiceTierFlex,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import java.time.Duration;

client = client.withOptions(options -> options.timeout(Duration.ofMinutes(15)));

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("<very long text of book here>")
        .instructions("List and describe all the metaphors used in this book.")
        .serviceTier(ResponseCreateParams.ServiceTier.FLEX)
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using System.ClientModel;
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClientOptions clientOptions = new() { NetworkTimeout = TimeSpan.FromMinutes(15) };
ResponsesClient client = new(new ApiKeyCredential(key), clientOptions);

CreateResponseOptions options = new()
{
    Model = "gpt-5.6",
    Instructions = "List and describe all the metaphors used in this book.",
    ServiceTier = ResponseServiceTier.Flex,
};
options.InputItems.Add(ResponseItem.CreateUserMessageItem("<very long text of book here>"));

using CancellationTokenSource timeout = new(TimeSpan.FromMinutes(15));
ResponseResult response = await client.CreateResponseAsync(options, timeout.Token);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new(timeout: 900.0)

response = client.responses.create(
  model: "gpt-5.6",
  service_tier: :flex,
  instructions: "List and describe all the metaphors used in this book.",
  input: "<very long text of book here>"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "instructions": "List and describe all the metaphors used in this book.",
    "input": "<very long text of book here>",
    "service_tier": "flex"
  }'
```





#### API 请求超时

由于 Flex 处理的处理速度较慢，请求超时更容易出现。以下是处理超时的一些注意事项：

- **Default timeout**：默认超时时间为 **10 分钟** ，适用于使用官方 API 和 OpenAI SDK 发起的请求。对于较长的提示或复杂任务，你可能需要增大此超时时间。
- **配置超时时间**：每个 SDK 都会提供用于增大该超时时间的参数。在 Python 和 JavaScript SDK 中，该参数为 `timeout` ，如上方代码示例所示。
- **自动重试**：OpenAI SDK 会对返回 `408 Request Timeout` 错误码的请求自动重试两次，之后再抛出异常。

## 资源不可用错误

Flex 处理有时可能缺乏足够的资源来处理你的请求，从而导致 `429 Resource Unavailable` 错误代码。 **发生这种情况时不会向你收取费用。**

考虑实施以下策略来处理资源不可用错误：

- **使用指数退避策略重试请求**：实现指数退避策略适用于可以容忍延迟的工作负载，并且有助于降低成本，因为当有更多可用容量时，你的请求最终可以完成。如需实现细节，请参阅 [此 Cookbook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits?utm_source=chatgpt.com#retrying-with-exponential-backoff).

- **使用标准处理方式重试请求**：在收到资源不可用错误时，如果你的用例值得为了确保成功完成而偶尔承担更高的成本，可以采用标准处理的重试策略。为此，请在重试请求中将 `service_tier` 设置为 `auto` ，或者移除 `service_tier` 参数以使用该项目的默认模式。