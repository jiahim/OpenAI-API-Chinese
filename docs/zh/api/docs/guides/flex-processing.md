# 灵活处理

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

Flex 处理为 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 请求提供更低成本，但响应时间更慢，且资源偶有不可用。它非常适合非生产环境或低优先级任务，例如模型评估、数据增强和异步工作负载。

Token 按 [定价](https://developers.openai.com/api/docs/pricing) 为 [Batch API 费率](https://developers.openai.com/api/docs/guides/batch)，并可通过 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching).

Flex 处理目前处于测试阶段，支持的模型有限。支持的模型
  列在 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=flex).

## API 使用

要使用 Flex 处理，请将 `service_tier` 参数设置为 `flex` 在你的 API 请求中：


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

由于 Flex 处理速度较慢，请求超时的可能性更大。以下是处理超时的一些注意事项：

- **默认超时**：默认超时时间为 **10分钟** ，当使用官方APIOpenAI SDK发起请求时。对于冗长的提示或复杂的任务，你可能需要增加此超时时间。
- **配置超时**：每个SDK都会提供一个参数来增加此超时时间。在Python和JavaScript SDK中，这是通过 `timeout` 实现的，如上面的代码示例所示。
- **自动重试**：OpenAI SDK会自动重试导致 `408 Request Timeout` 错误码的请求两次，然后才抛出异常。

## 资源不可用错误

灵活处理有时可能缺乏足够的资源来处理你的请求，导致 `429 Resource Unavailable` 错误代码。 **发生这种情况时不会向你收费。**

考虑实施以下策略来处理资源不可用错误：

- **使用指数退避重试请求**：对于可以容忍延迟的工作负载，实现指数退避是合适的，旨在最小化成本，因为当有更多容量可用时，你的请求最终可以完成。有关实现细节，请参阅 [本食谱](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits?utm_source=chatgpt.com#retrying-with-exponential-backoff).

- **使用标准处理重试请求**：当收到资源不可用错误时，如果偶尔较高的成本对于确保你的用例成功完成是值得的，则实施带有标准处理的重试策略。为此，设置 `service_tier` 为 `auto` 在重试的请求中，或移除 `service_tier` 参数以使用项目的默认模式。