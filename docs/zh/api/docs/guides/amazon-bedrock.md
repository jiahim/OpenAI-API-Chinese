# OpenAI on Amazon Bedrock

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取对应页面的 Markdown 版本文档。

Amazon Bedrock 在 AWS 托管的基础设施上运行受支持的 OpenAI 模型。
参考本指南以对比 [OpenAI API 功能支持情况](#responses-api-feature-availability)
并使用 OpenAI SDK 进行连接。有关部署配置，请参阅本页链接的
[AWS 文档](#availability-and-operations) 。

模型能力和 API 兼容性决定了你的应用可以做什么。AWS 负责管理你的 Bedrock 部署中的模型访问、区域可用性、路由、计费和
  运维控制。AWS 负责管理模型访问、区域可用性、路由、计费以及
  针对你的 Bedrock 部署的运维控制。

## Bedrock 可用性的工作原理

OpenAI 模型通过两个 Amazon Bedrock 端点提供：
`bedrock-runtime` 和 `bedrock-mantle`。两者均支持与 OpenAI 兼容的
Responses 和 Chat Completions API（适用于受支持的模型），但功能
覆盖范围不同。

根据你的应用所需的能力选择端点。例
如，托管 网页搜索 目前需要使用 Mantle。有关详情，请参阅本页
[的端点差异](#endpoint-differences) ，以及 AWS 的 [端点对比](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints.html) ，了解 Bedrock 特有的功能与端点选择。

[GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6
  Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) 可通过 Bedrock Runtime 获取，也可通过 Mantle 在
  （弗吉尼亚北部）使用。 `us-east-1` （弗吉尼亚北部）获取。 [GPT-6
  Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) 可通过 Bedrock Runtime 获取，也可通过 Mantle 在
  （弗吉尼亚北部）使用。 `us-west-2` （俄勒冈）获取。本指南中的示例使用 GPT-5.6
  Terra 中 `us-east-2`；请在更改模型前选择支持的区域。

有关访问和设置，请参阅 AWS [模型端点可用性](https://docs.aws.amazon.com/bedrock/latest/userguide/models-endpoint-availability.html) 和 [运行时端点说明](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html).

## 发起 Responses API 请求

这些示例使用 OpenAI SDK 并配合 Mantle 端点。请选择你部署所在的 AWS
区域和模型 ID：

- 带有 Bedrock provider 的客户端库会从 AWS 区域派生出一个区域性的 Mantle 基础 URL
  来自 AWS 区域。JavaScript、Python、Go 和 Java provider 使用
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1` 用于本指南的
  `us-east-2` 示例。Ruby 示例直接配置该 `/openai/v1`
  endpoint，因为该 provider 的默认 `/v1` 路由不支持
  此模型。
- 使用带有 `openai.` 前缀的 Bedrock 模型 ID。对于 GPT-6 Sol 和 Luna，
  使用 `openai.gpt-6-sol` 或 `openai.gpt-6-luna` 在 `us-east-1`.

示例使用 `openai.gpt-5.6-terra` 在 `us-east-2`。要试用 GPT-6 Sol 或 Luna，
请同时更改模型 ID 和 Region。对于 Ruby，还需更新
显式 `base_url`。中的 Region。在 Bedrock Runtime 上，使用美国推理配置文件
ID `us.openai.gpt-6-sol` 和 `us.openai.gpt-6-luna`，或全局 ID
`global.openai.gpt-6-sol` 和 `global.openai.gpt-6-luna`。请遵循 AWS [Responses API 端点说明](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) 以选择 Runtime 基础 URL 和推理配置文件。

以下示例使用存储为
`AWS_BEARER_TOKEN_BEDROCK`。的 Bedrock API 密钥。请参阅 [Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) 了解如何生成和使用 Bedrock API 密钥。

在使用任一 Java 示例之前，请先安装可选的 Java Bedrock 提供程序：

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java-bedrock</artifactId>
  <version>4.57.0</version>
</dependency>
```

通过 Amazon Bedrock 发送 Responses API 请求

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
  model: "openai.gpt-5.6-terra",
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
    model="openai.gpt-5.6-terra",
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
		Model: "openai.gpt-5.6-terra",
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
            .model("openai.gpt-5.6-terra")
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
    Model = "openai.gpt-5.6-terra",
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
  model: "openai.gpt-5.6-terra",
  input: "Write a haiku about cloud infrastructure."
)

puts(response.output_text)
```

```bash
curl "https://bedrock-mantle.us-east-2.api.aws/openai/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AWS_BEARER_TOKEN_BEDROCK" \
  -d '{
    "model": "openai.gpt-5.6-terra",
    "input": "Write a haiku about cloud infrastructure."
  }'
```


对于长时间运行的应用程序，建议使用标准的 AWS 凭证链，而
非静态 bearer 令牌。JavaScript、Python、Go、Java 和 Ruby SDK
提供程序会解析最新的 AWS 凭证，并为每次请求
SigV4。该链可以包含通过以下方式配置的凭据： `aws login`，共享
配置文件、工作负载角色以及实例或容器凭据。

在使用 AWS credential-chain 示例之前，请先安装可选依赖项
此路径：

```shell
npm install @aws-sdk/credential-provider-node @smithy/hash-node @smithy/signature-v4
pip install 'openai[bedrock]'
go get github.com/openai/openai-go/v3/bedrock
bundle add aws-sdk-core
```

.NET SDK 目前未公开等效的 Bedrock provider 或 AWS
SigV4 身份验证策略。请在 .NET 中使用带 Bedrock API key，或在应用需要时通过 AWS 支持的客户端发送已签名的
HTTP 请求来使用
AWS 凭证链。

使用 AWS 托管的 Bedrock 凭证发送请求

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
  model: "openai.gpt-5.6-terra",
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
    model="openai.gpt-5.6-terra",
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
		Model: "openai.gpt-5.6-terra",
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
            .model("openai.gpt-5.6-terra")
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
  model: "openai.gpt-5.6-terra",
  input: "Write a haiku about cloud infrastructure."
)

puts(response.output_text)
```


## Responses API 功能可用性

使用此对照表识别与 OpenAI API 的差异。可用性因
模型和端点而异；某个受支持的 API 并不意味着支持
所有工具或响应模式。

| 能力                | OpenAI API                    | Amazon Bedrock                |
| ------------------------- | ----------------------------- | ----------------------------- |
| 文本生成           | 可用                     | 可用                     |
| 图像输入               | 可用                     | 可用                     |
| 文件输入                | 可用                     | 可用                     |
| 结构化输出        | 可用                     | 可用                     |
| 函数调用          | 可用                     | 可用                     |
| 异步工具调用 | 在支持的模型上可用 | 不可用                 |
| 流式响应       | 可用                     | 可用                     |
| WebSocket 连接     | 可用                     | 不可用                 |
| 轮内引导         | 在支持的模型上可用 | 不可用                 |
| 上下文窗口            | 因模型而异               | 因模型而异               |
| 推理力度          | 可用                     | 可用                     |
| 推理更新         | 在支持的模型上可用 | 不可用                 |
| Pro 模式                  | 在支持的模型上可用 | 不可用                 |
| 持久化推理       | 在支持的模型上可用 | 在支持的模型上可用 |
| 提示缓存            | 可用                     | 可用                     |
| 可编程工具调用 | 在支持的模型上可用 | 不可用                 |
| 多智能体               | 在支持的模型上提供 Beta      | 不可用                 |
| 自定义工具              | 可用                     | 可用                     |
| 客户端 `tool_search` | 可用                     | 可用                     |
| 托管网页搜索         | 可用                     | 仅限 Mantle                   |
| 托管文件搜索        | 可用                     | 不可用                 |
| 计算机使用              | 可用                     | 可用                     |
| Shell 工具                | 可用                     | 不可用                 |
| 图像生成工具     | 可用                     | 不可用                 |
| 远程 MCP 服务器        | 可用                     | 不可用                 |

异步工具调用 (`async: true`) 和推理更新
(`configuration_update` 输入项）在 Amazon Bedrock 上不受支持。
中途引导需要 WebSockets，并且无法通过任何
Bedrock 端点使用。

客户端 `tool_search` 功能不同于托管工具和远程 MCP 服务器
支持。托管的网页搜索可通过 Mantle 使用；托管的文件搜索和
远程 MCP 服务器不可用。

计算机使用支持 Runnable 及 Mantle 上的可用模型。你的
应用执行计算机操作并将结果返回给模型；该
能力不需要 Bedrock 托管的执行环境。

在 Amazon Bedrock 上，GPT-5.4 和 GPT-5.5 支持 100 万 token 的上下文窗口；
GPT-5.6 Sol、Terra、Luna 和 GPT-6 Astra 支持 1,050,000 token。请查阅 AWS [OpenAI 模型卡片](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html) 了解具体模型的限制。

### 端点差异

这些 Responses API 差异适用于在 Runtime 和 Mantle 之间进行选择时：

| 能力                             | Bedrock Runtime                  | Mantle                                                                      |
| -------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| GPT-6 Astra                            | 可用                        | 在以下区域可用 `us-west-2` （俄勒冈州）                                           |
| GPT-6 Sol 和 GPT-6 Luna               | 美国和全球         | 在以下区域可用 `us-east-1` （弗吉尼亚北部）                                      |
| 计算机使用                           | 在支持的模型上可用    | 在支持的模型上可用                                               |
| 流式响应                    | 可用                        | 可用                                                                   |
| 后台模式（`background: true`)   | 不可用                    | 可用，受 [数据保留设置](#data-access-and-retention) |
| 托管网页搜索                      | 不可用                    | 在支持的模型上可用                                               |
| 继续使用 `previous_response_id` | 包含 `model` 在每次请求中 | 模型可继承自上一次响应                       |

运行时需要 `model` 即使你提供了 `previous_response_id`。后台
模式与流式传输相互独立，并不描述异步函数
调用。完整的端点契约请参阅 AWS [Responses API 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) 关于 网页搜索 权限与
配置，请参阅 AWS [网页搜索 指南](https://docs.aws.amazon.com/bedrock/latest/userguide/web-search.html).

## 可用性与运维

AWS 负责维护 Amazon Bedrock 的部署选项与可用性。使用
以下参考信息来选择并配置你的部署：

| AWS-managed concern                           | AWS documentation                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 模型 ID 和支持的API                  | [OpenAI 模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)                                                                                                                                                                                    |
| 按 AWS 区域划分的模型和端点可用性 | [模型可用性](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html) 和 [端点可用性](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints-region-availability.html) |
| 地理和全局请求路由         | [跨区域推理](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)                                                                                                                                                                            |
| 账户配额和提升请求          | [Amazon Bedrock 配额](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)                                                                                                                                                                                             |

AWS 区域不是 OpenAI 数据驻留管辖区域。如果你的工作负载具有
location requirements, review the destination Regions of your inference profile
以及适用的 AWS 条款，而不仅仅是你的端点 URL 中的区域。

## 数据访问与保留

Amazon Bedrock 对操作员访问和数据保留使用单独的控制：

- **零操作员访问 (ZOA)** 意味着 AWS 操作员没有任何技术手段
  登录到 Mantle 的底层计算系统或访问那里的客户数据
  。请参阅 AWS [ZOA 设计](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/).
- **零数据留存 (ZDR)** 意味着当有效留存模式为
  时，AWS 不会将请求或响应数据写入持久化存储 `none`.

设置 `store: false` 并不能保证 ZDR。对于具有以下有效保留模式的 Responses API 请求，AWS 会拒绝
有效保留模式为 `none`，时，AWS 会拒绝 `store: true`，且后台
模式不可用。

对于 Amazon Bedrock 中的 OpenAI 模型，当有效保留模式为
时，AWS 不会与 OpenAI 共享请求或响应内容 `default` 或 `none`.
请参阅 AWS 的 [数据保留文档](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) ，了解可用的模式、资格条件以及账户或项目配置。另请参阅 [Amazon Bedrock 滥用检测](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html) ，了解针对特定模型的保留要求和例外情况。

如果 AWS 在图像输入中检测到疑似 CSAM，AWS 可能将被标记的输入
  或输出移出 ZOA 环境，并仅出于
  判定其是否为 CSAM 的目的进行存储和审查。AWS 也可能向国家
  主管部门提交报告。

## 身份验证与操作

你的 AWS 管理员控制账户、模型和功能访问权限。请参阅 AWS [API 密钥文档](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) 了解凭证创建与生命周期管理，以及 [IAM 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html) 用于身份和权限。本页面上的 OpenAI SDK 示例展示了如何
提供这些凭证；它们不配置 AWS 权限。

## 定价

Amazon Bedrock 的使用费用由 AWS 计费。商业区域的 Bedrock 定价
与 OpenAI 对应服务的直接定价一致。请注意，在 Bedrock 中使用
特定区域的服务时，其定价与 OpenAI API 中的 Regional
处理价格相同。Bedrock 的使用适用 Amazon 的商业条款。

请参阅 [API 定价](https://developers.openai.com/api/docs/pricing) 直接 OpenAI API 定价请参考。Bedrock 的
费率、支持的服务等级和计费选项，请使用 [Amazon Bedrock 定价](https://aws.amazon.com/bedrock/pricing/) 和相应的模型卡。

## Bedrock Managed 智能体

有关 AWS 上的托管 智能体会话，请参阅
[Bedrock 托管 智能体](https://developers.openai.com/api/docs/guides/agents-api/bedrock-managed-agents).

## 后续步骤

如需在 ChatGPT Work 和 Codex 中进行设置,请参阅
[通过 Amazon Bedrock 使用 ChatGPT Work 和 Codex](https://developers.openai.com/codex/amazon-bedrock).