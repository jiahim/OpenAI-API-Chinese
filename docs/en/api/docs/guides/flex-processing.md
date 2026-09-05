# Flex processing

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Flex processing provides lower costs for [Responses](https://developers.openai.com/api/reference/resources/responses) or [Chat Completions](https://developers.openai.com/api/reference/resources/chat) requests in exchange for slower response times and occasional resource unavailability. It's ideal for non-production or lower priority tasks, such as model evaluations, data enrichment, and asynchronous workloads.

Tokens are [priced](https://developers.openai.com/api/docs/pricing) at [Batch API rates](https://developers.openai.com/api/docs/guides/batch), with additional discounts from [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

Flex processing is in beta with limited model availability. Supported models
  are listed on the [pricing page](https://developers.openai.com/api/docs/pricing?latest-pricing=flex).

## API usage

To use Flex processing, set the `service_tier` parameter to `flex` in your API request:


  Flex processing example

```javascript
import OpenAI from "openai";
const client = new OpenAI({
  timeout: 15 * 1000 * 60, // Increase default timeout to 15 minutes
});

const response = await client.responses.create(
  {
    model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:        "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    Model = "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    "model": "gpt-6-astra",
    "instructions": "List and describe all the metaphors used in this book.",
    "input": "<very long text of book here>",
    "service_tier": "flex"
  }'
```





#### API request timeouts

Due to slower processing speeds with Flex processing, request timeouts are more likely. Here are some considerations for handling timeouts:

- **Default timeout**: The default timeout is **10 minutes** when making API requests with an official OpenAI SDK. You may need to increase this timeout for lengthy prompts or complex tasks.
- **Configuring timeouts**: Each SDK will provide a parameter to increase this timeout. In the Python and JavaScript SDKs, this is `timeout` as shown in the code samples above.
- **Automatic retries**: The OpenAI SDKs automatically retry requests that result in a `408 Request Timeout` error code twice before throwing an exception.

## Resource unavailable errors

Flex processing may sometimes lack sufficient resources to handle your requests, resulting in a `429 Resource Unavailable` error code. **You will not be charged when this occurs.**

Consider implementing these strategies for handling resource unavailable errors:

- **Retry requests with exponential backoff**: Implementing exponential backoff is suitable for workloads that can tolerate delays and aims to minimize costs, as your request can eventually complete when more capacity is available. For implementation details, see [this cookbook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits?utm_source=chatgpt.com#retrying-with-exponential-backoff).

- **Retry requests with standard processing**: When receiving a resource unavailable error, implement a retry strategy with standard processing if occasional higher costs are worth ensuring successful completion for your use case. To do so, set `service_tier` to `auto` in the retried request, or remove the `service_tier` parameter to use the default mode for the project.