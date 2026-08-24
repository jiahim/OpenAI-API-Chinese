# OpenAI models in Amazon Bedrock

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Amazon Bedrock makes supported OpenAI models available through AWS-managed
infrastructure. This deployment path is useful when your organization wants to
keep procurement, identity, regional controls, and related cloud operations in
AWS.

Amazon Bedrock availability differs from the OpenAI API. Confirm the supported
  model, AWS Region, feature set, and pricing path for your workload before you
  deploy.

## How Bedrock availability works

OpenAI models in Amazon Bedrock run through an AWS-managed deployment path with
Responses API compatibility for supported models and capabilities.
Your application still uses OpenAI model behavior, but AWS owns the surrounding
cloud control plane, including account access, regional availability, and
billing.

Use Bedrock when you need:

- AWS-native procurement and billing.
- AWS-managed identity, access, and account controls.
- Deployment in supported AWS Regions for customers with cloud-location
  requirements.

Use the OpenAI API directly when you need the broadest feature coverage, the
latest first-party platform capabilities, or functionality unavailable in
Bedrock.

## Make Responses API requests

To send OpenAI SDK requests through Amazon Bedrock, use the Bedrock-aware SDK
client and select the AWS Region and model ID for your deployment:

- Instantiate `BedrockOpenAI` instead of the default `OpenAI` client. The client
  derives the regional Mantle base URL from the AWS Region.
- This guide's examples use `us-east-2`, which resolves to
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1`.
- Use a Bedrock model ID with the `openai.` prefix, such as
  `openai.gpt-5.6-sol`.

This example uses `openai.gpt-5.6-sol` in `us-east-2`. Use a supported model and
AWS Region combination for your Bedrock deployment.

The following example uses a Bedrock API key stored as
`AWS_BEARER_TOKEN_BEDROCK`. See
[Amazon Bedrock API keys](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)
for information about generating and using a Bedrock API key. The SDK reads the
token from your environment.

Send a Responses API request through Amazon Bedrock

```javascript
import { BedrockOpenAI } from "openai";

const client = new BedrockOpenAI({
  awsRegion: "us-east-2",
});

const response = await client.responses.create({
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure.",
});

console.log(response.output_text);
```

```python
from openai import BedrockOpenAI

client = BedrockOpenAI(aws_region="us-east-2")

response = client.responses.create(
    model="openai.gpt-5.6-sol",
    input="Write a haiku about cloud infrastructure.",
)

print(response.output_text)
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


For long-running applications, pass a token provider instead of a static API
key. The SDK calls the provider before each request. The AWS token-generator
packages return a cached short-term key when the current key is valid and
generate a new key when needed. They use the AWS credential chain, which can
include credentials configured with `aws login`.

Install the token-generator package for your SDK:

```shell
npm install @aws/bedrock-token-generator
pip install aws-bedrock-token-generator
```

Send a request with refreshable Bedrock credentials

```javascript
import { getTokenProvider } from "@aws/bedrock-token-generator";
import { BedrockOpenAI } from "openai";

const client = new BedrockOpenAI({
  awsRegion: "us-east-2",
  bedrockTokenProvider: getTokenProvider(),
});

const response = await client.responses.create({
  model: "openai.gpt-5.6-sol",
  input: "Write a haiku about cloud infrastructure.",
});

console.log(response.output_text);
```

```python
from aws_bedrock_token_generator import provide_token
from openai import BedrockOpenAI

client = BedrockOpenAI(
    aws_region="us-east-2",
    bedrock_token_provider=provide_token,
)

response = client.responses.create(
    model="openai.gpt-5.6-sol",
    input="Write a haiku about cloud infrastructure.",
)

print(response.output_text)
```


## Availability and operations

Availability depends on AWS Region and model. The initial launch scope is more
limited than the OpenAI API, so check [model support by AWS
Region](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
before rollout.

Amazon Bedrock provides Responses API-compatible inference for supported OpenAI
models in supported AWS Regions. AWS manages authentication, account access,
procurement, and billing.

AWS Regions are physical deployment locations, which differ from OpenAI data
residency jurisdictions. Teams with residency requirements should evaluate the
Bedrock Region itself and the corresponding AWS terms.

## Data access and retention

Amazon Bedrock uses separate controls for operator access and data retention:

- **[Zero operator access (ZOA)](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/)**
  means AWS operators have no technical mechanism to sign in to Mantle's
  underlying compute systems or access customer data, including inference
  prompts and completions.
- **[Zero data retention (ZDR)](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html)**
  means AWS does not write model inputs or outputs to durable storage when the
  effective retention mode is `none`.

For OpenAI models in Amazon Bedrock, AWS does not share request or response
content with OpenAI when the effective retention mode is `default` or `none`.

[Configure Bedrock data
retention](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html#data-retention-configuration)
for your AWS account or project.

Under the `default` retention mode, retention depends on the model and request
settings. For specific OpenAI GPT models, AWS retains classifier-flagged traffic
for up to 30 days for automated offline abuse detection. Responses API requests
use `store: true` by default. AWS retains the response, including its input and
output, for 30 days so you can retrieve it or reference it in a later request.
See [Amazon Bedrock abuse
detection](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html)
for the current model list and retention details.

If you need full ZDR for a model that requires retention, contact your AWS
account manager to discuss eligibility. AWS evaluates ZDR access for each account
and model. If AWS approves access, confirm that `none` appears in the model's
`allowed_modes`, then set the account or project retention mode to `none`.
Setting `store: false` does not guarantee ZDR. When the effective retention mode
is `none`, AWS rejects `store: true`, and background mode is unavailable.

If AWS detects apparent CSAM in an image input, AWS may move the flagged input
  or output outside the ZOA environment and store and review it only to
  determine whether it is CSAM. AWS may also file a report with national
  authorities.

## Responses API feature availability

Amazon Bedrock supports a subset of Responses API capabilities available
through the OpenAI API. This table describes feature availability as of the
date below. It excludes transient availability and service status.

The information below represents feature availability as of July 13, 2026.
  Model and Region availability can also change. For the latest information, see
  the [AWS documentation for OpenAI models in Amazon
  Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)
  and [model support by AWS
  Region](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html).

| Capability                | OpenAI API                    | Amazon Bedrock                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| Text generation           | Available                     | Available                                         |
| Audio input               | Available                     | Not available                                     |
| Image input               | Available                     | Available                                         |
| File input                | Available                     | Available for supported file types                |
| Structured outputs        | Available                     | Available                                         |
| Function calling          | Available                     | Available                                         |
| Streaming responses       | Available                     | Available                                         |
| WebSocket connections     | Available                     | Not available                                     |
| Context window            | Model-dependent               | 272,000 tokens for GPT-5.4 and GPT-5.5            |
| Context window            | Model-dependent               | 1,050,000 tokens for GPT-5.6 Sol, Terra, and Luna |
| Reasoning effort          | Available                     | Available, including `max` on supported models    |
| Pro mode                  | Available on supported models | Not available                                     |
| Persisted reasoning       | Available on supported models | Available on supported models                     |
| Prompt caching            | Available                     | Implicit and explicit caching on supported models |
| Programmatic Tool Calling | Available on supported models | Not available                                     |
| Multi-agent               | Beta on supported models      | Not available                                     |
| Custom tools              | Available                     | Available                                         |
| Client-side `tool_search` | Available                     | Available                                         |
| Hosted web search         | Available                     | Available                                         |
| Hosted file search        | Available                     | Not available                                     |
| Computer use              | Available                     | Not available                                     |
| Shell tool                | Available                     | Not available                                     |
| Image generation tool     | Available                     | Not available                                     |
| Remote MCP servers        | Available                     | Not available                                     |
| Service tiers             | Available where supported     | On-demand inference only                          |

Client-side `tool_search` is distinct from hosted tools and remote MCP server
support. Hosted web search is available on Amazon Bedrock, but hosted file
search and remote MCP servers are unavailable.

GPT-5.4 and GPT-5.5 have a 272,000-token context window on Amazon Bedrock.
GPT-5.6 Sol, Terra, and Luna have a 1,050,000-token context window. Amazon
Bedrock rejects requests that exceed the applicable model limit. See the AWS
model cards for current model-specific limits.

Treat feature parity as workload-specific. If your application depends on a
specific tool, response mode, or service tier, test that behavior through
Bedrock before you commit to the deployment path.

## Authentication and operations

Amazon Bedrock uses AWS-managed access controls. Your AWS administrator controls
which accounts, roles, or temporary credentials can reach the supported model
deployment. The exact authentication flow depends on the Bedrock configuration
your organization uses.

Plan for AWS-owned operational checks such as:

- Account and model access configuration.
- Region-specific deployment approval.
- Temporary credential or token validity.
- AWS quota, logging, and support workflows.

## Pricing

AWS bills Amazon Bedrock usage. Bedrock-specific pricing can differ from direct
OpenAI API pricing, including regional processing premiums or other AWS-specific
commercial terms.

See [API pricing](https://developers.openai.com/api/docs/pricing) for direct OpenAI API pricing. For Bedrock
pricing, use the AWS pricing materials published for the Bedrock deployment you
plan to use.

## Next steps

- Confirm your supported model and AWS Region in Amazon Bedrock.
- Verify the exact API features your workload needs.
- Compare Bedrock pricing and direct API pricing before launch.
- For setup in ChatGPT Work and Codex, see
  [Use ChatGPT Work and Codex with Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock).