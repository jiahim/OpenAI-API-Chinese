# Amazon Bedrock 中的 OpenAI 模型

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

Amazon Bedrock 通过 AWS 托管的 OpenAI 使受支持的模型可用
基础设施。当你的组织希望
将采购、身份、区域控制及相关云操作保留在
AWS 中时，此部署路径非常有用。

Amazon Bedrock 的可用性与 OpenAI API 不同。在部署前，请确认工作负载所支持的
  模型、AWS 区域、功能集和定价路径，
  然后再部署。

## Bedrock 可用性如何运作

OpenAI 模型在 Amazon Bedrock 中通过 AWS 管理的部署路径运行，
对支持的模型和能力提供Responses API兼容性。
你的应用仍然使用OpenAI模型行为，但 AWS 负责周边的
云控制平面，包括账户访问、区域可用性和
计费。

在以下情况下使用 Bedrock：

- AWS 原生采购与计费。
- AWS 托管身份、访问与账户控制。
- 在受支持的 AWS 区域中部署，适用于有云位置
  要求的客户。

当需要最广泛的功能覆盖时，请直接使用 OpenAI API，以获得
最新的第一方平台能力，或使用在
Bedrock 中不可用的功能。

## 发起 Responses API 请求

要通过 Amazon Bedrock 发送 OpenAI SDK 请求，请使用支持 Bedrock 的 SDK
客户端，并选择部署的 AWS 区域和模型 ID：

- 实例化 `BedrockOpenAI` 而不是默认的 `OpenAI` 客户端。该客户端
  会根据 AWS 区域推导出区域性的 Mantle 基础 URL。
- 本指南中的示例使用 `us-east-2`，它解析为
  `https://bedrock-mantle.us-east-2.api.aws/openai/v1`.
- 使用带 `openai.` 前缀的 Bedrock 模型 ID，例如
  `openai.gpt-5.6-sol`.

此示例使用 `openai.gpt-5.6-sol` 中的 `us-east-2`。请使用受支持的模型与
AWS 区域的组合，以用于你的 Bedrock 部署。

以下示例使用 API 密钥，该密钥以
`AWS_BEARER_TOKEN_BEDROCK`。存储。请参阅
[Amazon Bedrock API 密钥](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)
了解如何生成和使用 Bedrock API 密钥。SDK 会从你的环境中读取
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


对于长时间运行的应用程序，请传递令牌提供程序，而不是静态的 API
密钥。SDK 会在每次请求前调用提供程序。AWS 令牌生成器
包在当前密钥有效时返回缓存的短期密钥，并在需要时
生成新密钥。它们使用 AWS 凭证链，该链可以
包括通过 `aws login`.

为你的 SDK 安装令牌生成器包：

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


## 可用性与操作

可用性取决于 AWS 区域和模型。初始推出范围更
受限，与 OpenAI API 相比，因此请检查 [AWS 的模型支持
区域](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html)
在推出之前。

Amazon Bedrock 为受支持的 Responses API 兼容推理提供支持，适用于受支持的 OpenAI
模型，在受支持的 AWS 区域中。AWS 管理认证、账户访问、
采购和计费。

AWS 区域是物理部署位置，与 OpenAI 数据
驻留管辖区不同。有驻留要求的团队应评估
Bedrock 区域本身及相应的 AWS 条款。

## 数据访问与保留

Amazon Bedrock 对操作者访问和数据保留使用独立的控制：

- **[零操作员访问 (ZOA)](https://aws.amazon.com/blogs/machine-learning/exploring-the-zero-operator-access-design-of-mantle/)**
  指 AWS 操作员没有技术机制登录 Mantle 的
  底层计算系统或访问客户数据，包括推理
  提示和完成。
- **[零数据保留 (ZDR)](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html)**
  指 AWS 在
  有效保留模式为 `none`.

对于 Amazon Bedrock 中的 OpenAI 模型，当有效保留模式为时，AWS 不会与 OpenAI 共享请求或响应
内容 `default` 或 `none`.

[配置 Bedrock 数据
保留](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html#data-retention-configuration)
为你的 AWS 账户或项目。

在 `default` 保留模式下，保留取决于模型和请求
设置。对于特定的 OpenAI GPT 模型，AWS 会保留分类器标记的流量
最多 30 天，用于自动离线滥用检测。Responses API 请求
默认使用 `store: true` 。AWS 保留响应，包括其输入和
输出，为期 30 天，以便你稍后检索或引用它。
请参阅 [Amazon Bedrock 滥用
检测](https://docs.aws.amazon.com/bedrock/latest/userguide/abuse-detection.html)
了解当前的模型列表和保留详情。

如果你需要对需要保留的模型获得完整的 ZDR，请联系你的 AWS
账户经理讨论资格。AWS 会评估每个账户
和模型的 ZDR 访问权限。如果 AWS 批准访问，请确认 `none` 出现在模型的
`allowed_modes`，然后将账户或项目的保留模式设置为 `none`.
设置 `store: false` 不保证 ZDR。当有效保留模式
为 `none`，AWS 拒绝 `store: true`，且后台模式不可用。

如果 AWS 在图像输入中检测到疑似 CSAM，AWS 可能会将标记的输入
  或输出移出 ZOA 环境，并且仅存储和审查该内容以
  确定其是否为 CSAM。AWS 也可能向国家
  当局提交报告。

## Responses API 功能可用性

Amazon Bedrock 支持 Responses API 的可用功能子集，
这些功能通过 OpenAI API 提供。下表描述了截至
以下日期的功能可用性。它不包括临时可用性和服务状态。

以下信息代表截至 2026 年 7 月 13 日的功能可用性。
  模型和区域的可用性也可能发生变化。有关最新信息，请参阅
  Amazon [中关于 OpenAI 模型的 AWS 文档
  Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html)
  以及 [AWS 对模型的支持
  区域](https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html).

| 功能                | OpenAI API                    | Amazon Bedrock                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------- |
| 文本生成           | 可用                     | 可用                                         |
| 图像输入               | 可用                     | 可用                                         |
| 文件输入                | 可用                     | 支持的文件类型可用                |
| 结构化输出        | 可用                     | 可用                                         |
| 函数调用          | 可用                     | 可用                                         |
| 流式响应       | 可用                     | 可用                                         |
| WebSocket 连接     | 可用                     | 不可用                                     |
| 上下文窗口            | 取决于模型               | GPT-5.4 和 GPT-5.5 为 272,000 个令牌            |
| 上下文窗口            | 取决于模型               | GPT-5.6 Sol、Terra 和 Luna 为 1,050,000 个令牌 |
| 推理努力          | 可用                     | 可用，包括 `max` 在支持的模型上    |
| Pro 模式                  | 在支持的模型上可用 | 不可用                                     |
| 持久化推理       | 在支持的模型上可用 | 在支持的模型上可用                     |
| 提示缓存            | 可用                     | 在支持的模型上隐式和显式缓存 |
| 编程工具调用 | 在支持的模型上可用 | 不可用                                     |
| 多智能体               | 在支持的模型上为测试版      | 不可用                                     |
| 自定义工具              | 可用                     | 可用                                         |
| 客户端 `tool_search` | 可用                     | 可用                                         |
| 托管网页搜索         | 可用                     | 可用                                         |
| 托管文件搜索        | 可用                     | 不可用                                     |
| 计算机使用              | 可用                     | 不可用                                     |
| Shell 工具                | 可用                     | 不可用                                     |
| 图像生成工具     | 可用                     | 不可用                                     |
| 远程 MCP 服务器        | 可用                     | 不可用                                     |
| 服务层级             | 在支持的区域内可用     | 仅支持按需推理                          |

客户端 `tool_search` 与托管工具和远程 MCP 服务器
支持不同。托管 网页搜索在 Amazon Bedrock 上可用，但托管文件
搜索和远程 MCP 服务器不可用。

GPT-5.4 和 GPT-5.5 在 Amazon Bedrock 上具有 272,000 token 的上下文窗口。
GPT-5.6 Sol、Terra 和 Luna 具有 1,050,000 token 的上下文窗口。Amazon
Bedrock 会拒绝超过适用模型限制的请求。请参阅 AWS
模型卡片以了解当前模型特定的限制。

将功能对等视为特定于工作负载。如果你的应用依赖
特定的工具、响应模式或服务层级，请在承诺部署路径之前通过
Bedrock 测试该行为。

## 身份验证与操作

Amazon Bedrock 使用 AWS 管理的访问控制。你的 AWS 管理员控制
哪些账户、角色或临时凭证可以访问受支持的模型
部署。确切的认证流程取决于你的组织使用的 Bedrock 配置
。

规划 AWS 所有的运营检查，例如：

- 账户与模型访问配置。
- 区域特定的部署审批。
- 临时凭证或令牌的有效性。
- AWS 配额、日志记录和支持工作流。

## 定价

AWS 按 Amazon Bedrock 的使用量计费。Bedrock 的专用定价可能与直接
OpenAI API 定价不同，包括区域处理溢价或其他 AWS 特定的
商业条款。

有关直接 [API 定价](https://developers.openai.com/api/docs/pricing) ，请参见OpenAI API。对于 Bedrock 的
定价，请使用为你要使用的 Bedrock 部署发布的 AWS 定价资料
。

## 后续步骤

- 在 Amazon Bedrock 中确认你支持的模型和 AWS 区域。
- 验证你的工作负载所需的确切 API 功能。
- 启动前比较 Bedrock 定价和直接 API 定价。
- 如需在 ChatGPT Work 和 Codex 中进行设置，请参阅
  [将 ChatGPT Work 和 Codex 与 Amazon Bedrock 结合使用](https://developers.openai.com/codex/amazon-bedrock).