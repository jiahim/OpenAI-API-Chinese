# Flex 处理

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

Flex 处理以更低的成本提供 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 请求，但响应时间会更慢，且资源偶尔不可用。它非常适合非生产或优先级较低的任务，例如模型评估、数据富集和异步工作负载。

Tokens 的 [定价](https://developers.openai.com/api/docs/pricing) 为 [Batch API 费率](https://developers.openai.com/api/docs/guides/batch)，并可叠加 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

Flex 处理目前处于测试阶段，支持的模型有限。支持的模型
  列于 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=flex).

## API 用量

要使用 Flex 处理，请在 `service_tier` 参数设置为 `flex` 在你的 API 请求中：


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

由于 Flex 处理速度较慢，请求更容易超时。以下是处理超时的一些注意事项：

- **默认超时**：使用官方 **10 分钟** 在使用官方 OpenAI SDK 发起 API 请求时生效。对于较长的提示或复杂的任务，你可能需要增大该超时值。
- **配置超时时间**：每个 SDK 都会提供用于延长该超时时间的参数。在 Python 和 JavaScript SDK 中，该参数为 `timeout` ，如上述代码示例所示。
- **自动重试**：OpenAI SDK 会在抛出异常前自动重试返回 `408 Request Timeout` 错误码的请求两次。

## 资源不可用错误

Flex 处理有时可能因资源不足而无法处理你的请求，从而导致 `429 Resource Unavailable` 错误代码。 **发生这种情况时不会向你收取费用。**

可以考虑采用以下策略来处理资源不可用错误：

- **使用指数退避重试请求**：实现指数退避适用于能够容忍延迟的工作负载，旨在将成本降至最低，因为当有更多可用容量时，你的请求最终可以完成。有关实现细节，请参阅 [此 cookbook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits?utm_source=chatgpt.com#retrying-with-exponential-backoff).

- **使用标准处理重试请求**：当收到资源不可用错误时，如果为了确保用例成功完成而偶尔产生更高成本是可以接受的，请使用标准处理实现重试策略。为此，请在重试请求中将 `service_tier` 设置为 `auto` ，或移除该 `service_tier` 参数以使用项目的默认模式。