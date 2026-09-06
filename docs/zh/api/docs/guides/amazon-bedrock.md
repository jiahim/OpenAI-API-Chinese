# Amazon Bedrock 中的 OpenAI 模型

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

Amazon Bedrock 通过 AWS 托管的基础设施提供受支持的 OpenAI 模型
。当你的组织希望将采购、身份、区域控制以及相关的云上运维
保留在 AWS 中时，这种部署路径会很有用。
AWS 中。

Amazon Bedrock 的可用性与 OpenAI API 不同。在部署之前，请确认你
  工作负载所支持的模型、AWS 区域、功能集以及计费方式。
  部署。

## Bedrock 可用性的工作原理

Amazon Bedrock 中的OpenAI 模型通过 AWS 托管的部署路径运行，并提供
Responses API 对受支持模型和能力的兼容性。
你的应用仍然使用 OpenAI 模型行为，但周边
云控制平面（包括账户访问、区域可用性和
计费）由 AWS 负责。

在以下场景中使用 Bedrock：

- AWS 原生采购与计费。
- AWS 托管的身份、访问与账户控制。
- 面向具有云区域
  需求的客户，在受支持的 AWS 区域部署。

当你需要最广泛的功能覆盖、最新的第一方平台能力，或 OpenAI API 中不可用的功能时，请直接使用
最新的第一方平台能力，或 Bedrock 中不可用的功能时
Bedrock。

## 发起 Responses API 请求

要通过 Amazon Bedrock 发送 OpenAI SDK 请求，请将客户端配置为
你的部署所对应的 AWS 区域和模型 ID：

- 带有 Bedrock provider 的客户端库会从 AWS 区域派生出一个区域性的 Mantle base URL
  。JavaScript、Python、Go 和 Java provider 在本指南的示例中
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1` 使用了这一 URL。
  `us-east-2` 示例。Ruby 示例则直接配置该 `/openai/v1`
  endpoint，因为该 provider 的默认 `/v1` 路由不支持该模型
  时，需要直接配置 SDK 端点，因为 .NET 开发工具包 未包含 Bedrock 提供方
  该提供方不包含 Bedrock。
- 使用带有此前缀的 Bedrock 模型 ID，例如 `openai.` 此前缀，例如
  `openai.gpt-5.6-sol`.

本示例使用 `openai.gpt-5.6-sol` 位于 `us-east-2`。请使用受支持的模型与
AWS 区域组合来部署你的 Bedrock。

下面的示例使用一个存储为
`AWS_BEARER_TOKEN_BEDROCK`。的 Bedrock API 密钥。参见
[Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)
了解如何生成和使用 Bedrock API 密钥。每个示例都会
将环境中的令牌传递给对应语言的 Bedrock 提供方，或者
对于 .NET，传递给区域 OpenAI 兼容端点。.NET SDK 目前
尚未包含 Bedrock 提供方。

在使用任一 Java 示例之前，请先安装可选的 Java Bedrock 提供方：

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


对于长时间运行的应用程序，建议使用标准的 AWS 凭证链，
而不是静态的 bearer 令牌。JavaScript、Python、Go、Java 和 Ruby SDK 的
提供方会解析最新的 AWS 凭证，并使用
SigV4 对每个请求进行签名。该凭证链可以包含通过 `aws login`，配置的凭证、共享
配置文件、工作负载角色以及实例或容器凭证。

在使用 AWS 凭证链示例之前，请先安装可选依赖：
此路径：

```shell
npm install @aws-sdk/credential-provider-node @smithy/hash-node @smithy/signature-v4
pip install 'openai[bedrock]'
go get github.com/openai/openai-go/v3/bedrock
bundle add aws-sdk-core
```

.NET SDK 当前未提供等效的 Bedrock 提供程序或 AWS
SigV4 身份验证策略。在 .NET 中使用 Bedrock API 密钥，或在应用程序需要时通过 AWS 支持的客户端发送签名
HTTP 请求
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


## 可用性与运维

可用性取决于 AWS 区域和模型。首发支持范围比
OpenAI API 更有限，因此请查看 [各 AWS 区域
的模型支持情况](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
，然后再进行部署。

Amazon Bedrock 在受支持的 AWS 区域中提供与 Responses API 兼容的推理，用于受支持的 OpenAI
模型。AWS 负责身份验证、账户访问、
采购与计费。

AWS 区域是物理部署位置，与 OpenAI 的数据
驻留司法管辖区不同。有驻留要求的团队应
评估 Bedrock 区域本身及相应的 AWS 条款。

## 数据访问与保留

Amazon Bedrock 使用相互独立的控制来分别管理操作员访问与数据保留：

- **[零操作员访问（ZOA）](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/)**
  意味着 AWS 操作员没有任何技术手段登录到 Mantle 的
  底层计算系统或访问客户数据，包括推理
  提示和补全。
- **[零数据保留（ZDR）](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html)**
  意味着当有效保留模式为
  时，AWS 不会将模型输入或输出写入持久化存储。 `none`.

对于 Amazon Bedrock 中的 OpenAI 模型，当有效保留模式为时，AWS 不会与 OpenAI 共享请求或响应
内容与 该公司 共享请求或响应 `default` 或 `none`.

[配置 Bedrock 数据
保留](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html#data-retention-configuration)
（适用于你的 AWS 账户或项目）。

在 `default` 保留模式下，保留行为取决于模型和请求
设置。对于特定的 OpenAI GPT 模型，AWS 会保留被分类器标记的流量
最长 30 天，用于自动化离线滥用检测。Responses API 请求
默认使用 `store: true` 。AWS 会保留响应（包括其输入和
输出）30 天，以便你可以在后续请求中检索或引用它。
请参阅 [Amazon Bedrock 滥用
检测](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html)
，了解当前的模型列表和保留详情。

如果你需要对需要保留的模型获得完整的 ZDR，请联系你的 AWS
客户经理以讨论资格。AWS 会针对每个账户评估 ZDR 访问权限
和模型。如果 AWS 批准访问权限，请确认 `none` 出现在模型的
`allowed_modes`，然后将账户或项目的保留模式设置为 `none`.
设置 `store: false` 不能保证 ZDR。当生效的保留模式
为 `none`，时，AWS 会拒绝 `store: true`，且后台模式不可用。

如果 AWS 在图像输入中检测到疑似 CSAM，AWS 可以将标记的输入
  或输出移出 ZOA 环境，并仅为判断其是否属于 CSAM 而进行存储和审查。AWS 还可能向国家
  主管部门提交报告。
  主管部门。

## Responses API 功能可用性

Amazon Bedrock 支持通过 Responses API 提供的部分能力
通过 OpenAI API。下表描述的功能可用性截至
以下日期。它不包括临时可用性和服务状态。

以下信息反映了截至 2026/07/13 的功能可用性。
  模型和区域的可用性也可能会变化。如需了解最新信息，请参阅
  该 [Amazon Bedrock 中 OpenAI 模型的 AWS 文档
  Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)
  和 [各 AWS 区域
  的模型支持情况](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html).

| 能力                | OpenAI API                    | Amazon Bedrock                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| 文本生成           | 可用                     | 可用                                         |
| 图像输入               | 可用                     | 可用                                         |
| 文件输入                | 可用                     | 支持的文件类型可用                |
| 结构化输出        | 可用                     | 可用                                         |
| 函数调用          | 可用                     | 可用                                         |
| 流式响应       | 可用                     | 可用                                         |
| WebSocket 连接     | 可用                     | 不可用                                     |
| 上下文窗口            | 取决于模型               | GPT-5.4 和 GPT-5.5 为 272,000 tokens            |
| 上下文窗口            | 取决于模型               | GPT-5.6 Sol、Terra 和 Luna 为 1,050,000 tokens |
| 推理强度          | 可用                     | 可用，包括 `max` 支持模型上的    |
| Pro 模式                  | 在支持的模型上可用 | 不可用                                     |
| 持久化推理       | 在支持的模型上可用 | 在支持的模型上可用                     |
| 提示词缓存            | 可用                     | 在支持的模型上进行隐式和显式缓存 |
| 可编程工具调用 | 在支持的模型上可用 | 不可用                                     |
| 多智能体               | 在支持的模型上提供 Beta      | 不可用                                     |
| 自定义工具              | 可用                     | 可用                                         |
| 客户端 `tool_search` | 可用                     | 可用                                         |
| 托管网页搜索         | 可用                     | 可用                                         |
| 托管文件搜索        | 可用                     | 不可用                                     |
| 计算机使用              | 可用                     | 不可用                                     |
| Shell 工具                | 可用                     | 不可用                                     |
| 图像生成工具     | 可用                     | 不可用                                     |
| 远程 MCP 服务器        | 可用                     | 不可用                                     |
| 服务等级             | 在支持的地区可用     | 仅按需推理                          |

客户端 `tool_search` 与托管工具和远程 MCP 服务器
支持不同。托管的网页搜索在 Amazon Bedrock 上可用，但托管文件
搜索和远程 MCP 服务器不可用。

GPT-5.4 和 GPT-5.5 在 Amazon Bedrock 上具有 272,000 个 token 的上下文窗口。
GPT-5.6 Sol、Terra 和 Luna 具有 1,050,000 个 token 的上下文窗口。Amazon
Bedrock 会拒绝超出相应模型限制的请求。有关各模型当前的限制，请参阅 AWS
模型卡。

将功能对等视为与工作负载相关的特性。如果你的应用依赖
某个特定工具、响应模式或服务层级，请在
提交到该部署路径之前，通过 Bedrock 测试该行为。

## 身份验证与操作

Amazon Bedrock 使用 AWS 托管的访问控制。由你的 AWS 管理员控制
哪些账户、角色或临时凭证可以访问受支持的模型
部署。具体的身份验证流程取决于你所在组织使用的 Bedrock 配置
。

为 AWS 自主运行的运维检查做好规划，例如：

- 账户和模型访问配置。
- 区域特定部署审批。
- 临时凭证或令牌有效期。
- AWS 配额、日志和支持工作流。

## 定价

AWS 会开具 Amazon Bedrock 用量的账单。Bedrock 专属定价可能与直接
OpenAI API 定价不同，包括区域处理溢价或其他 AWS 特有的
商业条款。

请参阅 [API 定价](https://developers.openai.com/api/docs/pricing) 以获取直接的 OpenAI API 定价。Bedrock 定价请参阅 AWS 为你计划使用的 Bedrock 部署所发布的
定价资料，
。

## 后续步骤

- 在 Amazon Bedrock 中确认你支持的模型和 AWS 区域。
- 验证你的工作负载所需的 API 特性。
- 在上线前比较 Bedrock 定价与直接 API 定价。
- 如需在 ChatGPT Work 和 Codex 中进行设置,请参阅
  [将 ChatGPT Work 和 Codex 与 Amazon Bedrock 配合使用](https://developers.openai.com/codex/amazon-bedrock).