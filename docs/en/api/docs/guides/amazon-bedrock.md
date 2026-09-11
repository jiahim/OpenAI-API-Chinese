# OpenAI models in Amazon Bedrock

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Amazon Bedrock runs supported OpenAI models on AWS-managed infrastructure.
Use this guide to compare [OpenAI API feature support](#responses-api-feature-availability)
and connect with the OpenAI SDK. For deployment configuration, use the
[AWS documentation](#availability-and-operations) linked from this page.

Model capabilities and API compatibility determine what your application can
  do. AWS manages model access, regional availability, routing, billing, and
  operational controls for your Bedrock deployment.

## How Bedrock availability works

OpenAI models are available through two Amazon Bedrock endpoints:
`bedrock-runtime` and `bedrock-mantle`. Both support the OpenAI-compatible
Responses and Chat Completions APIs for supported models, but their feature
coverage differs.

Choose your endpoint based on the capabilities your application needs. For
example, hosted web search currently requires Mantle. See the
[endpoint differences](#endpoint-differences) on this page and the AWS [endpoint comparison](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints.html) for Bedrock-specific capabilities and endpoint selection.

GPT-6 Astra is available through Bedrock Runtime and through Mantle in
  `us-west-2` (Oregon). The examples in this guide use GPT-5.6 Sol in
  `us-east-2`; select Astra's supported Region before changing the model.

For access and setup, see the AWS [GPT-6 Astra announcement](https://aws.amazon.com/blogs/machine-learning/take-on-your-most-ambitious-work-with-gpt-6-astra-on-amazon-bedrock/) and [Runtime endpoint instructions](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html).

## Make Responses API requests

These examples use the OpenAI SDK with the Mantle endpoint. Select the AWS
Region and model ID for your deployment:

- Client libraries with a Bedrock provider derive a regional Mantle base URL
  from the AWS Region. The JavaScript, Python, Go, and Java providers use
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1` for this guide's
  `us-east-2` examples. The Ruby examples configure this `/openai/v1`
  endpoint directly because the provider's default `/v1` route doesn't
  support this model.
- Use a Bedrock model ID with the `openai.` prefix, such as
  `openai.gpt-5.6-sol`.

The examples use `openai.gpt-5.6-sol` in `us-east-2`. For Runtime, follow the AWS [Responses API endpoint instructions](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) to select the base URL and inference profile. Do not reuse a Mantle model ID
without checking the Runtime requirements.

The following example uses a Bedrock API key stored as
`AWS_BEARER_TOKEN_BEDROCK`. See [Amazon Bedrock API keys](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) for information about generating and using a Bedrock API key.

Install the optional Java Bedrock provider before using either Java example:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java-bedrock</artifactId>
  <version>4.57.0</version>
</dependency>
```

Send a Responses API request through Amazon Bedrock

```javascript
import OpenAI from "openai";
import { bedrock } from "openai/providers/bedrock";

const client = new OpenAI({
  provider: bedrock({
    region: "us-east-2",
    apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
  }),
});

const response = await client.responses.create({
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure.",
});

console.log(response.output_text);
```

```python
import os

from openai import OpenAI
from openai.providers import bedrock

client = OpenAI(
    provider=bedrock(
        region="us-east-2",
        api_key=os.environ["AWS_BEARER_TOKEN_BEDROCK"],
    )
)

response = client.responses.create(
    model="openai.gpt-5.6-sol",
    input="Write a haiku about cloud infrastructure.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/bedrock"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client, err := bedrock.NewClient(context.Background(), bedrock.Config{
		AWSRegion: "us-east-2",
		APIKey:    os.Getenv("AWS_BEARER_TOKEN_BEDROCK"),
	})
	if err != nil {
		panic(err)
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "openai.gpt-5.6-sol",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a haiku about cloud infrastructure."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.BedrockOpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

public final class AmazonBedrockCreateResponseExample {
  private AmazonBedrockCreateResponseExample() {}

  public static void main(String[] args) {
    OpenAIClient client =
        BedrockOpenAIOkHttpClient.builder()
            .awsRegion("us-east-2")
            .apiKey(System.getenv("AWS_BEARER_TOKEN_BEDROCK"))
            .build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("openai.gpt-5.6-sol")
            .input("Write a haiku about cloud infrastructure.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(text -> System.out.println(text.text()));
  }
}
```

```csharp
using System.ClientModel;
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("AWS_BEARER_TOKEN_BEDROCK")!;
ResponsesClient client = new(
    new ApiKeyCredential(key),
    new ResponsesClientOptions
    {
        Endpoint = new Uri("https://bedrock-mantle.us-east-2.api.aws/openai/v1"),
    }
);

CreateResponseOptions options = new()
{
    Model = "openai.gpt-5.6-sol",
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a haiku about cloud infrastructure.")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new(
  provider: OpenAI::Providers.bedrock(
    region: "us-east-2",
    base_url: "https://bedrock-mantle.us-east-2.api.aws/openai/v1",
    api_key: ENV.fetch("AWS_BEARER_TOKEN_BEDROCK")
  )
)

response = client.responses.create(
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure."
)

puts(response.output_text)
```

```bash
curl "https://bedrock-mantle.us-east-2.api.aws/openai/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AWS_BEARER_TOKEN_BEDROCK" \
  -d '{
    "model": "openai.gpt-5.6-sol",
    "input": "Write a haiku about cloud infrastructure."
  }'
```


For long-running applications, prefer the standard AWS credential chain instead
of a static bearer token. The JavaScript, Python, Go, Java, and Ruby SDK
providers resolve fresh AWS credentials and sign each request attempt with
SigV4. The chain can include credentials configured with `aws login`, shared
profiles, workload roles, and instance or container credentials.

Install optional dependencies for AWS credential-chain examples before using
this path:

```shell
npm install @aws-sdk/credential-provider-node @smithy/hash-node @smithy/signature-v4
pip install 'openai[bedrock]'
go get github.com/openai/openai-go/v3/bedrock
bundle add aws-sdk-core
```

The .NET SDK doesn't currently expose an equivalent Bedrock provider or AWS
SigV4 authentication policy. Use a Bedrock API key with .NET, or send a signed
HTTP request through an AWS-supported client when your application requires the
AWS credential chain.

Send a request with AWS-managed Bedrock credentials

```javascript
import OpenAI from "openai";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { bedrock } from "openai/providers/bedrock/aws";

const client = new OpenAI({
  provider: bedrock({
    region: "us-east-2",
    endpoint: "mantle",
    credentialProvider: defaultProvider(),
  }),
});

const response = await client.responses.create({
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI
from openai.providers import bedrock

client = OpenAI(
    provider=bedrock(
        region="us-east-2",
        api_key=None,
    )
)

response = client.responses.create(
    model="openai.gpt-5.6-sol",
    input="Write a haiku about cloud infrastructure.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/bedrock"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	awsConfig, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}

	client, err := bedrock.NewClient(context.Background(), bedrock.Config{
		AWSRegion:              "us-east-2",
		AWSCredentialsProvider: awsConfig.Credentials,
	})
	if err != nil {
		panic(err)
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "openai.gpt-5.6-sol",
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a haiku about cloud infrastructure."),
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.BedrockOpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;

public final class AmazonBedrockCreateResponseWithAwsCredentialsExample {
  private AmazonBedrockCreateResponseWithAwsCredentialsExample() {}

  public static void main(String[] args) {
    OpenAIClient client =
        BedrockOpenAIOkHttpClient.builder()
            .awsRegion("us-east-2")
            .awsCredentialsProvider(DefaultCredentialsProvider.create())
            .build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("openai.gpt-5.6-sol")
            .input("Write a haiku about cloud infrastructure.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(text -> System.out.println(text.text()));
  }
}
```

```ruby
require "openai"

client = OpenAI::Client.new(
  provider: OpenAI::Providers.bedrock(
    region: "us-east-2",
    base_url: "https://bedrock-mantle.us-east-2.api.aws/openai/v1",
    api_key: nil
  )
)

response = client.responses.create(
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure."
)

puts(response.output_text)
```


## Responses API feature availability

Use this matrix to identify differences from the OpenAI API. Availability is
specific to the model and endpoint; a supported API does not imply support for
every tool or response mode.

| Capability                | OpenAI API                    | Amazon Bedrock                |
| ------------------------- | ----------------------------- | ----------------------------- |
| Text generation           | Available                     | Available                     |
| Image input               | Available                     | Available                     |
| File input                | Available                     | Available                     |
| Structured outputs        | Available                     | Available                     |
| Function calling          | Available                     | Available                     |
| Asynchronous tool calling | Available on supported models | Not available                 |
| Streaming responses       | Available                     | Available                     |
| WebSocket connections     | Available                     | Not available                 |
| Mid-turn steering         | Available on supported models | Not available                 |
| Context window            | Model-dependent               | Model-dependent               |
| Reasoning effort          | Available                     | Available                     |
| Reasoning updates         | Available on supported models | Not available                 |
| Pro mode                  | Available on supported models | Not available                 |
| Persisted reasoning       | Available on supported models | Available on supported models |
| Prompt caching            | Available                     | Available                     |
| Programmatic Tool Calling | Available on supported models | Not available                 |
| Multi-agent               | Beta on supported models      | Not available                 |
| Custom tools              | Available                     | Available                     |
| Client-side `tool_search` | Available                     | Available                     |
| Hosted web search         | Available                     | Mantle only                   |
| Hosted file search        | Available                     | Not available                 |
| Computer use              | Available                     | Available                     |
| Shell tool                | Available                     | Not available                 |
| Image generation tool     | Available                     | Not available                 |
| Remote MCP servers        | Available                     | Not available                 |

Asynchronous tool calling (`async: true`) and reasoning updates
(`configuration_update` input items) are not supported on Amazon Bedrock.
Mid-turn steering requires WebSockets and is not available through either
Bedrock endpoint.

Client-side `tool_search` is distinct from hosted tools and remote MCP server
support. Hosted web search is available through Mantle; hosted file search and
remote MCP servers are unavailable.

Computer use is available on Runtime and Mantle for supported models. Your
application executes computer actions and returns results to the model; this
capability does not require a Bedrock-hosted execution environment.

On Amazon Bedrock, GPT-5.4 and GPT-5.5 support a 1-million-token context window;
GPT-5.6 Sol, Terra, Luna, and GPT-6 Astra support 1,050,000 tokens. Check the AWS [OpenAI model cards](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html) for model-specific limits.

### Endpoint differences

These Responses API differences apply when choosing between Runtime and Mantle:

| Capability                             | Bedrock Runtime                  | Mantle                                                                      |
| -------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| GPT-6 Astra                            | Available                        | Available in `us-west-2` (Oregon)                                           |
| Computer use                           | Available on supported models    | Available on supported models                                               |
| Streaming responses                    | Available                        | Available                                                                   |
| Background mode (`background: true`)   | Not available                    | Available, subject to [data retention settings](#data-access-and-retention) |
| Hosted web search                      | Not available                    | Available on supported models                                               |
| Continuing with `previous_response_id` | Include `model` on every request | The model can be inherited from the previous response                       |

Runtime requires `model` even when you supply `previous_response_id`. Background
mode is separate from streaming and does not describe asynchronous function
calling. Use the AWS [Responses API documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) for the complete endpoint contract. For web search permissions and
configuration, see the AWS [web search guide](https://docs.aws.amazon.com/bedrock/latest/userguide/web-search.html).

## Availability and operations

AWS maintains the deployment options and availability for Amazon Bedrock. Use
these references to select and configure your deployment:

| AWS-managed concern                           | AWS documentation                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model IDs and supported APIs                  | [OpenAI model cards](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)                                                                                                                                                                                    |
| Model and endpoint availability by AWS Region | [Model availability](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html) and [endpoint availability](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints-region-availability.html) |
| Geographic and global request routing         | [Cross-Region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)                                                                                                                                                                            |
| Account quotas and increase requests          | [Amazon Bedrock quotas](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)                                                                                                                                                                                             |

An AWS Region is not an OpenAI data residency jurisdiction. If your workload has
location requirements, review the destination Regions of your inference profile
and the applicable AWS terms, not only the Region in your endpoint URL.

## Data access and retention

Amazon Bedrock uses separate controls for operator access and data retention:

- **Zero operator access (ZOA)** means AWS operators have no technical mechanism
  to sign in to Mantle's underlying compute systems or access customer data
  there. See the AWS [ZOA design](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/).
- **Zero data retention (ZDR)** means AWS does not write request or response data
  to durable storage when the effective retention mode is `none`.

Setting `store: false` does not guarantee ZDR. For Responses API requests with an
effective retention mode of `none`, AWS rejects `store: true`, and background
mode is unavailable.

For OpenAI models in Amazon Bedrock, AWS does not share request or response
content with OpenAI when the effective retention mode is `default` or `none`.
Use the AWS [data retention documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) for available modes, eligibility, and account or project configuration. See [Amazon Bedrock abuse detection](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html) for model-specific retention requirements and exceptions.

If AWS detects apparent CSAM in an image input, AWS may move the flagged input
  or output outside the ZOA environment and store and review it only to
  determine whether it is CSAM. AWS may also file a report with national
  authorities.

## Authentication and operations

Your AWS administrator controls account, model, and feature access. Use the AWS [API key documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) for credential creation and lifecycle, and the [IAM documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html) for identities and permissions. The OpenAI SDK examples on this page show how to
supply those credentials; they do not configure AWS permissions.

## Pricing

Amazon Bedrock usage is billed through AWS. Bedrock pricing in commercial regions
matches OpenAI direct pricing for equivalent services. Note that using a
region-specific service in Bedrock will be priced at the same rate as Regional
processing in the OpenAI API. Amazon commercial terms apply to Bedrock usage.

See [API pricing](https://developers.openai.com/api/docs/pricing) for direct OpenAI API pricing. For Bedrock
rates, supported service tiers, and billing options, use [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/) and the applicable model card.

## Next steps

For setup in ChatGPT Work and Codex, see
[Use ChatGPT Work and Codex with Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock).