# OpenAI models in Amazon Bedrock

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Amazon Bedrock 在 AWS 托管的基础设施上运行受支持的 OpenAI 模型。
使用本指南来比较 [OpenAI API 功能支持](#responses-api-feature-availability)
并与 OpenAI SDK 集成。请使用本页链接的
[AWS 文档](#availability-and-operations) 进行部署配置。

模型能力和 API 兼容性决定了你的应用可以
  做什么。AWS 为你的 Bedrock 部署管理模型访问、区域可用性、路由、计费和
  运维控制。

## Bedrock 可用性的工作原理

OpenAI 模型可通过两个 Amazon Bedrock 端点获取：
`bedrock-runtime` 和 `bedrock-mantle`。两者都支持与 OpenAI 兼容的
Responses 和 Chat Completions API，但其功能
覆盖范围有所不同。

请根据应用所需的能力选择端点。例
如，托管 网页搜索 目前需要使用 Mantle。请参阅本页的
[端点差异](#endpoint-differences) 以及 AWS 的 [端点对比](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints.html) ，了解 Bedrock 特定功能和端点选择。

GPT-6 Astra 可通过 Bedrock Runtime 以及 Mantle 在
  `us-west-2` （俄勒冈州）获取。本指南中的示例使用 GPT-5.6 Sol 在
  `us-east-2`；在更改模型之前，请选择 Astra 支持的区域。

有关访问和设置，请参阅 AWS 的 [GPT-6 Astra 公告](https://aws.amazon.com/blogs/machine-learning/take-on-your-most-ambitious-work-with-gpt-6-astra-on-amazon-bedrock/) 和 [Runtime 端点说明](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html).

## 发起 Responses API 请求

这些示例使用 OpenAI SDK 与 Mantle 端点。请选择你的部署所使用的 AWS
区域和模型 ID：

- 带有 Bedrock 提供商的客户端库会根据 AWS 区域派生出一个区域性的 Mantle 基础 URL
  根据 AWS 区域派生。JavaScript、Python、Go 和 Java 提供商使用
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1` 用于本指南的
  `us-east-2` 示例。Ruby 示例直接配置此 `/openai/v1`
  端点，因为提供商的默认 `/v1` 路由不支持
  此模型。
- 使用带有 `openai.` 前缀的 Bedrock 模型 ID，例如
  `openai.gpt-5.6-sol`.

示例使用 `openai.gpt-5.6-sol` 在 `us-east-2`。对于 Runtime，请遵循 AWS [Responses API 端点说明](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) 来选择 base URL 和 inference profile。请勿在未检查 Runtime 要求的情况下重复使用 Mantle 模型 ID
。

以下示例使用一个存储为
`AWS_BEARER_TOKEN_BEDROCK`。的 Bedrock API 密钥。请参阅 [Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) ，了解如何生成和使用 Bedrock API 密钥。

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


对于长时间运行的应用，更推荐使用标准的 AWS 凭证链，而不是静态 bearer 令牌。JavaScript、Python、Go、Java 和 Ruby SDK
of a static bearer token. The JavaScript, Python, Go, Java, and Ruby 开发工具包
提供程序会解析最新的 AWS 凭证，并使用
SigV4 对每次请求尝试进行签名。该凭证链可以包含通过以下方式配置的凭证： `aws login`、共享
配置文件、工作负载角色以及实例或容器凭证。

在使用此路径之前，请先为 AWS 凭证链示例安装可选依赖：
此路径：

```shell
npm install @aws-sdk/credential-provider-node @smithy/hash-node @smithy/signature-v4
pip install 'openai[bedrock]'
go get github.com/openai/openai-go/v3/bedrock
bundle add aws-sdk-core
```

.NET SDK 目前尚未提供等效的 Bedrock 提供商或 AWS
SigV4 身份验证策略。在 .NET 中使用 Bedrock API 密钥，或者在应用程序需要时通过 AWS 支持的客户端发送已签名的
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


## Responses API 功能可用性

使用此矩阵来识别与 OpenAI API 之间的差异。可用性
取决于具体的模型和端点；支持某个 API 并不意味着支持
所有工具或响应模式。

| 功能                | OpenAI API                    | Amazon Bedrock                |
| ------------------------- | ----------------------------- | ----------------------------- |
| 文本生成           | 可用                     | 可用                     |
| 图像输入               | 可用                     | 可用                     |
| 文件输入                | 可用                     | 可用                     |
| 结构化输出        | 可用                     | 可用                     |
| 函数调用          | 可用                     | 可用                     |
| 异步工具调用 | 在支持的模型上可用 | 不可用                 |
| 流式响应       | 可用                     | 可用                     |
| WebSocket 连接     | 可用                     | 不可用                 |
| 回合中途引导         | 在支持的模型上可用 | 不可用                 |
| 上下文窗口            | 取决于模型               | 取决于模型               |
| 推理努力程度          | 可用                     | 可用                     |
| 推理更新         | 在支持的模型上可用 | 不可用                 |
| Pro 模式                  | 在支持的模型上可用 | 不可用                 |
| 持久化推理       | 在支持的模型上可用 | 在支持的模型上可用 |
| 提示缓存            | 可用                     | 可用                     |
| 程序化工具调用 | 在支持的模型上可用 | 不可用                 |
| Multi-智能体               | 在支持的模型上提供 Beta      | 不可用                 |
| 自定义工具              | 可用                     | 可用                     |
| 客户端 `tool_search` | 可用                     | 可用                     |
| 托管网页搜索         | 可用                     | 仅 Mantle                   |
| 托管文件搜索        | 可用                     | 不可用                 |
| 计算机使用              | 可用                     | 可用                     |
| Shell 工具                | 可用                     | 不可用                 |
| 图像生成工具     | 可用                     | 不可用                 |
| 远程 MCP 服务器        | 可用                     | 不可用                 |

异步工具调用（`async: true`）和推理更新
(`configuration_update` 输入项）在 Amazon Bedrock 上不受支持。
轮次中途引导需要 WebSockets，不能通过任何一个
Bedrock 端点使用。

客户端 `tool_search` 与托管工具和远程 MCP 服务器
支持不同。托管的网页搜索通过 Mantle 提供；托管的文件搜索以及
远程 MCP 服务器不可用。

Computer use 在 Runtime 和 Mantle 上对支持的模型可用。你的
应用执行计算机操作并将结果返回给模型；此
功能不需要 Bedrock 托管的执行环境。

在 Amazon Bedrock 上，GPT-5.4 和 GPT-5.5 支持 100 万 token 的上下文窗口；
GPT-5.6 Sol、Terra、Luna 和 GPT-6 Astra 支持 1,050,000 tokens。请查阅 AWS [OpenAI 模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html) 以了解特定模型的限制。

### 端点差异

这些 Responses API 差异适用于在 Runtime 与 Mantle 之间进行选择时：

| 功能                             | Bedrock Runtime                  | Mantle                                                                      |
| -------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| GPT-6 Astra                            | 可用                        | 可用区域 `us-west-2` （俄勒冈州）                                           |
| 计算机使用                           | 在支持的模型上可用    | 在支持的模型上可用                                               |
| 流式响应                    | 可用                        | 可用                                                                   |
| 后台模式（`background: true`)   | 不可用                    | 可用，但受 [数据保留设置](#data-access-and-retention) |
| 托管网页搜索                      | 不可用                    | 在支持的模型上可用                                               |
| 继续使用 `previous_response_id` | 包含 `model` 在每次请求中 | 模型可继承自上一次响应                       |

运行时需要 `model` 即使你提供了 `previous_response_id`。后台
模式与流式传输是分开的，它并不描述异步函数
调用。请参阅 AWS [Responses API 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) 以获取完整的端点契约。关于 网页搜索 权限和
配置，请参阅 AWS [网页搜索 指南](https://docs.aws.amazon.com/bedrock/latest/userguide/web-search.html).

## 可用性与运维

AWS 负责维护 Amazon Bedrock 的部署选项和可用性。请使用
以下参考来选择并配置你的部署：

| AWS 托管的关注点                           | AWS 文档                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 模型 ID 与支持的 API                  | [OpenAI 模型卡片](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)                                                                                                                                                                                    |
| 按 AWS 区域划分的模型和端点可用性 | [模型可用性](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html) 和 [端点可用性](https://docs.aws.amazon.com/bedrock/latest/userguide/endpoints-region-availability.html) |
| 地理与全局请求路由         | [跨区域推理](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)                                                                                                                                                                            |
| 账户配额与提升请求          | [Amazon Bedrock 配额](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)                                                                                                                                                                                             |

AWS 区域不是 OpenAI 数据驻留司法管辖范围。如果你的工作负载有
位置要求，请查看推理配置文件的目标区域
以及适用的 AWS 条款，而不仅仅看你的端点 URL 中的区域。

## 数据访问与保留

Amazon Bedrock 对操作员访问和数据保留使用单独的控制措施：

- **零运维访问（ZOA）** 意味着 AWS 运维人员没有任何技术手段
  登录到 Mantle 的底层计算系统或访问其中的客户数据
  。请参阅 AWS [ZOA 设计](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/).
- **零数据保留（ZDR）** 意味着当有效保留模式为
  时，AWS 不会将请求或响应数据写入持久化存储 `none`.

设置 `store: false` 并不能保证 ZDR。对于使用 Responses API 且有效保留模式为
的请求，AWS 会拒绝 `none`,且 background `store: true`，模式不可用。
模式不可用。

对于 Amazon Bedrock 中的 OpenAI 模型，当有效保留模式为
时，AWS 不会与 OpenAI 共享请求或响应内容 `default` 或 `none`.
请参阅 AWS [数据保留文档](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) ，了解可用的模式、资格条件以及账户或项目配置。参见 [Amazon Bedrock 滥用检测](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html) ，了解针对特定模型的保留要求和例外情况。

如果 AWS 在图像输入中检测到疑似 CSAM，AWS 可能将标记的输入
  或输出移出 ZOA 环境，并仅出于判断其是否为 CSAM 的目的进行存储和审查。
  AWS 还可能向相关国家主管部门
  提交报告。

## 身份验证与操作

你的 AWS 管理员控制账户、模型和功能访问权限。使用 AWS [API 密钥文档](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) 了解凭证的创建与生命周期管理，以及 [IAM 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html) 了解身份与权限相关的内容。本页面中的 OpenAI SDK 示例展示了如何
提供这些凭证；它们不会配置 AWS 权限。

## 定价

Amazon Bedrock 的用量通过 AWS 计费。商业区域的 Bedrock 定价
与 OpenAI 针对同等服务的直接定价一致。请注意，使用
Bedrock 中的区域特定服务时，定价与 OpenAI API 的区域处理相同。Beck
rock 用量适用 Amazon 商业条款。

参见 [API 定价](https://developers.openai.com/api/docs/pricing) ，查看直接的 OpenAI API 定价。Bedrock
的价格、支持的服务等级和计费选项，请参阅 [Amazon Bedrock 定价](https://aws.amazon.com/bedrock/pricing/) 以及适用的模型卡。

## 后续步骤

在 ChatGPT Work 和 Codex 中的设置，请参阅
[将 ChatGPT Work 和 Codex 与 Amazon Bedrock 配合使用](https://developers.openai.com/codex/amazon-bedrock).