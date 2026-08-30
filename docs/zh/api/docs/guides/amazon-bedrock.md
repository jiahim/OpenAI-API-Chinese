# Amazon Bedrock 中的 OpenAI 模型

> 如需查看完整文档索引,请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Amazon Bedrock 通过 AWS 托管的基础设施提供受支持的 OpenAI 模型。
当你的组织希望将采购、身份、区域控制以及相关云运维保留在
AWS 中时，这种部署路径非常有用。
AWS 中。

Amazon Bedrock 的可用性与 OpenAI API 不同。在部署之前，请确认你所使用工作负载支持的模型、AWS 区域、功能集和计费方式。
  在部署之前，请确认你所使用工作负载支持的模型、AWS 区域、功能集和计费方式。
  署之前，请确认你所使用工作负载支持的模型、AWS 区域、功能集和计费方式。

## Bedrock 可用性的工作原理

Amazon Bedrock 中的 OpenAI 模型通过由 AWS 管理的部署路径运行，并提供针对所支持模型与能力的
Responses API 兼容性。
你的应用仍使用 OpenAI 的模型行为，但相关的云控制平面由 AWS 负责，
其中包括账户访问、区域可用性以及
计费。

在以下场景下使用 Bedrock：

- AWS 原生的采购与计费。
- 由 AWS 管理的身份、访问和账户控制。
- 面向有云位置要求客户的受支持 AWS 区域部署
  部署。

当你需要最广泛的功能覆盖、最新的第一方平台能力，或 OpenAI API 中独有但 Bedrock 未提供的功能时，请直接使用该 接口。
最新的第一方平台能力，或 Bedrock 中未提供的功能。
Bedrock。

## 发起 Responses API 请求

要通过 Amazon Bedrock 发送 OpenAI SDK 请求，请使用支持 Bedrock 的 SDK
客户端，并选择你的部署所使用的 AWS 区域和模型 ID：

- 实例化 `BedrockOpenAI` 而不是默认 `OpenAI` 客户端。该客户端
  会从 AWS 区域推导出对应的 Mantle 基础 URL。
- 本指南中的示例使用 `us-east-2`，它解析为
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1`.
- 使用带有 `openai.` 前缀的 Bedrock 模型 ID，例如
  `openai.gpt-5.6-sol`.

本示例使用 `openai.gpt-5.6-sol` 位于 `us-east-2`。请为你的 Bedrock 部署使用支持的模型与
AWS 区域组合。

以下示例使用以
`AWS_BEARER_TOKEN_BEDROCK`。形式存储的 Bedrock API key。有关生成和使用 Bedrock API key 的信息，请参阅 接口。API 从你的环境中读取该
[Amazon Bedrock 接口 key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)
令牌。SDK 从你的环境中读取该
令牌。

通过 Amazon Bedrock 发送 Responses API 请求

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


对于长时间运行的应用程序，请传入一个 token provider，而不是固定的 API
key。SDK 会在每次请求前调用该 provider。AWS token-generator
包会在当前 key 有效时返回缓存的短期 key，并在
需要时生成新的 key。它们使用 AWS 凭证链，该链可以
包含通过 `aws login`.

为你的 SDK 安装 token-generator 包：

```shell
npm install @aws/bedrock-token-generator
pip install aws-bedrock-token-generator
```

使用可刷新的 Bedrock 凭证发送请求

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


## 可用性与运维

可用性取决于 AWS 区域和模型。初始上线范围比
OpenAI API 更有限，因此请查看 [各 AWS
区域](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
的模型支持情况，然后再进行部署。

Amazon Bedrock 在支持的 AWS 区域内为支持的 Responses API 模型提供与 OpenAI 兼容的推理服务。AWS 负责管理身份验证、账户访问、
采购和计费。
AWS 区域是物理部署位置，与 OpenAI 数据。

驻留司法管辖区不同。有驻留要求的团队应评估 Bedrock 区域本身
及其对应的 AWS 条款。
Bedrock 区域本身以及对应的 AWS 条款。

## 数据访问与保留

Amazon Bedrock 对运维访问和数据保留使用相互独立的控制：

- **[零运维访问（Zero operator access，ZOA）](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/)**
  意味着 AWS 运维人员没有任何技术手段登录 Mantle 的
  底层算力系统或访问客户数据，包括推理
  提示与补全。
- **[零数据留存（Zero data retention，ZDR）](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html)**
  意味着当生效的留存模式为
  时，AWS 不会将模型的输入或输出写入持久化存储。 `none`.

对于 Amazon Bedrock 中的 OpenAI 模型，当有效保留模式为
时，AWS 不会与 OpenAI 共享请求或响应内容。 `default` 或 `none`.

[配置 Bedrock 数据
保留](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html#data-retention-configuration)
，用于你的 AWS 账户或项目。

在 `default` 保留模式下，保留取决于模型和请求
设置。对于特定的 OpenAI GPT 模型，AWS 会保留被分类器标记的流量
最多 30 天，用于自动化离线滥用检测。Responses API 请求默认
使用 `store: true` 。AWS 会保留响应（包括其输入和
输出）30 天，以便你检索或在后续请求中引用。
请参阅 [Amazon Bedrock 滥用
检测](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html)
，了解当前的模型列表和保留详情。

如果你需要对需要保留的模型获得完整的 ZDR，请联系你的 AWS
账户经理以讨论资格。AWS 会针对每个账户
和模型评估 ZDR 访问权限。如果 AWS 批准访问，请确认 `none` 出现在模型的
`allowed_modes`，然后将账户或项目的保留模式设置为 `none`.
设置 `store: false` 不能保证 ZDR。当生效保留模式
为 `none`，时，AWS 会拒绝 `store: true`，并且后台模式不可用。

如果 AWS 在图像输入中检测到疑似 CSAM，AWS 可以将被标记的输入
  或输出移出 ZOA 环境，并仅出于
  目的对其进行存储和审查，以确定其是否为 CSAM。AWS 还可以向国家
  主管部门提交报告。

## Responses API 功能可用性

Amazon Bedrock 支持 Responses API 中可用的部分功能
通过 OpenAI API 提供。下表描述了截至以下日期的功能可用性
。该表不包含临时可用性和服务状态信息。

以下信息反映了截至 2026 年 7 月 13 日的功能可用性。
  模型和区域可用性也可能发生变化。有关最新信息，请参阅
  该 [AWS 文档中关于 Amazon Bedrock 中的 OpenAI 模型
  Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)
  与 [各 AWS
  区域](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html).

| 能力                | OpenAI API                    | Amazon Bedrock                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| 文本生成           | 可用                     | 可用                                         |
| 图像输入               | 可用                     | 可用                                         |
| 文件输入                | 可用                     | 适用于支持的文件类型                |
| 结构化输出        | 可用                     | 可用                                         |
| 函数调用          | 可用                     | 可用                                         |
| 流式响应       | 可用                     | 可用                                         |
| WebSocket 连接     | 可用                     | 不可用                                     |
| 上下文窗口            | 取决于模型               | GPT-5.4 和 GPT-5.5 为 272,000 tokens            |
| 上下文窗口            | 取决于模型               | GPT-5.6 Sol、Terra 和 Luna 为 1,050,000 tokens |
| 推理力度          | 可用                     | 可用，包括 `max` 在支持的模型上    |
| Pro 模式                  | 在支持的模型上可用 | 不可用                                     |
| 持久化推理       | 在支持的模型上可用 | 在支持的模型上可用                     |
| 提示词缓存            | 可用                     | 在支持的模型上进行隐式和显式缓存 |
| 可编程工具调用 | 在支持的模型上可用 | 不可用                                     |
| 多智能体               | 在支持的模型上提供 Beta 版      | 不可用                                     |
| 自定义工具              | 可用                     | 可用                                         |
| 客户端 `tool_search` | 可用                     | 可用                                         |
| 托管网页搜索         | 可用                     | 可用                                         |
| 托管文件搜索        | 可用                     | 不可用                                     |
| 计算机使用              | 可用                     | 不可用                                     |
| Shell 工具                | 可用                     | 不可用                                     |
| 图像生成工具     | 可用                     | 不可用                                     |
| 远程 MCP 服务器        | 可用                     | 不可用                                     |
| 服务等级             | 在支持的情况下可用     | 仅按需推理                          |

客户端 `tool_search` 区别于托管工具和远程 MCP 服务器
支持。Amazon Bedrock 提供托管网页搜索，但托管文件
搜索和远程 MCP 服务器不可用。

GPT-5.4 和 GPT-5.5 在 Amazon Bedrock 上拥有 272,000 token 的上下文窗口。
GPT-5.6 Sol、Terra 和 Luna 拥有 1,050,000 token 的上下文窗口。Amazon
Bedrock 会拒绝超出适用模型限制的请求。请参阅 AWS
模型卡了解当前特定于模型的限制。

请将功能对等视为与工作负载相关。如果你的应用依赖
特定工具、响应模式或服务层级，请在
确定部署路径之前通过 Bedrock 验证该行为。

## 身份验证与操作

Amazon Bedrock 使用 AWS 托管的访问控制。你的 AWS 管理员控制
哪些账户、角色或临时凭证可以访问受支持的模型
部署。具体的认证流程取决于你的组织所使用的 Bedrock 配置
方式。

请规划 AWS 自有的运营检查，例如：

- 账户和模型访问配置。
- 特定区域的部署审批。
- 临时凭证或令牌的有效期。
- AWS 配额、日志和支持工作流。

## 定价

AWS 会向用户收取 Amazon Bedrock 的使用费用。Bedrock 专属定价可能与直接的
OpenAI API 定价不同，包括区域处理溢价或其他 AWS 专属的
商业条款。

请参阅 [API 定价](https://developers.openai.com/api/docs/pricing) 以获取直接的 OpenAI API 定价。关于 Bedrock
定价，请参阅你计划使用的 Bedrock 部署所对应的 AWS 定价资料。
。

## Next steps

- 在 Amazon Bedrock 中确认你支持的模型和 AWS 区域。
- 验证你的工作负载所需的 API 特性。
- 在上线前对比 Bedrock 定价和直接 API 定价。
- 如需在 ChatGPT Work 和 Codex 中进行设置，请参阅
  [将 ChatGPT Work 和 Codex 与 Amazon Bedrock 结合使用](https://developers.openai.com/codex/amazon-bedrock).