# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023 年 3 月 1 日起，发送到 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 通过 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能会被存储为：

- **滥用监控日志：** 在使用平台过程中生成的日志，OpenAI 需要据此执行我们的 [使用政策](https://openai.com/policies/usage-policies) 以及相关协议，并缓解 AI 的有害使用。
- **应用状态：** 由部分 API 功能持久化保存的数据，用于完成任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及由该客户内容衍生的元数据，例如分类器输出。默认情况下，API 功能使用会生成滥用监控日志，并保留最多 30 天，除非法律要求延长保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在下述限制范围内，通过获得 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制项。目前，这些控制项需事先获得 OpenAI 批准并接受额外要求。已获批的客户可为其 API 组织或项目在 Modified Abuse Monitoring 与 Zero Data Retention 之间进行选择。

启用 Modified Abuse Monitoring 或 Zero Data Retention 的客户需负责确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律下的任何审核与报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以了解有关这些产品的更多信息并咨询资格要求。

### 改进的滥用监控

Modified Abuse Monitoring 会将客户内容（除极少数情况下下文所述的图像和文件输入外 [下方](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)）从所有 API 端点的滥用监控日志中排除，同时仍允许客户使用 OpenAI 平台的全部功能。

### Zero Data Retention

与 Modified Abuse Monitoring 一样，Zero Data Retention 会将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会改变某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为变化外，即使启用了 Zero Data Retention，下表中针对 Zero Data Retention Eligible 标记为“No”的端点及其功能仍可能存储应用程序状态。

<a id="zero-data-retention-with-private-safety-processing"></a>

### 使用私有安全处理的 ZDR

[使用 Private Safety Processing 实现零数据保留](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据保留保护的同时执行自动化安全监控。此页面列出的端点和功能限制仍然适用。

使用 PSP 启用 ZDR 的客户必须配置客户自主控制的存储，并满足 [ZDR 与 Private Safety Processing 指南](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### Private Retention with Private Safety Processing（前身为 Eyes Off）

对于已获批零数据留存或修订版滥用监控的客户，我们保留将特定客户的模型排除在零数据留存或修订版滥用监控之外的权利，并会事先以书面形式通知受影响的客户。在此情况下，客户内容将保留在 OpenAI 托管基础设施中加密的滥用监控日志中，但除非适用法律要求，否则此类内容不会用于人工审核。有关更多信息，请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署 OpenAI 商业伙伴与医疗保健附录的客户，一旦你的组织 ID 配置了具备 Private Safety Processing 的 Private Retention，即可使用符合 BAA 资格的端点处理 PHI，即使数据被保留。本页所列的端点和功能限制仍然适用。

### Safety Retention

对于获批零数据留存或修改后滥用监控的客户，如果为调查或防止严重风险活动而合理必要，我们会保留使某些模型对该等客户不符合零数据留存或修改后滥用监控条件的权利，并会事先以书面形式通知受影响的客户。在此情况下，当我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您协议时，我们可能会留存并人工审核该等模型下的客户内容。除此之外，留存不受影响。对于已签署 OpenAI 商业伙伴及医疗保健附加协议的客户，一旦您的组织 ID 配置了安全留存，符合 BAA 资格的端点即可用于处理 PHI，即使数据被留存亦如此。

### 配置数据保留控制

一旦你的组织获批使用数据保留控制功能，你将在 **数据保留** 标签页中看到 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目层级配置数据保留控制。

- **组织级控制：** 为你的整个组织选择 Zero Data Retention 或 Modified Abuse Monitoring。
- **项目级控制：** 对于每个项目，选择 `default` 以继承组织级设置，明确选择 Zero Data Retention 或 Modified Abuse Monitoring，或选择 **None** 以禁用该项目的这些控制。

### 各接口的存储要求与保留控制

下表说明了每个端点存储应用程序状态的情况。符合零数据保留条件的端点不会为应用程序状态保留任何客户内容，但须受以下限制。不符合零数据保留条件的端点或功能在使用时可能会保留应用程序状态，即使你已启用零数据保留。

| 端点                   | 用于训练的数据 | 滥用监控保留期 |  应用状态保留期   |  符合零数据保留条件  | 符合带 PSP 的私有保留和安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |              是，限制条件见下文              |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |              是，限制条件见下文              |
| `/v1/decisions`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |                   待确认                   |
| `/v1/conversations`        |           否           |       直至删除        |         直至删除          |               否               |                            否                            |
| `/v1/conversations/items`  |           否           |       直至删除        |         直至删除          |               否               |                            否                            |
| `/v1/chatkit/threads`      |           否           |       直至删除        |         直至删除          |               否               |                            否                            |
| `/v1/agents`               |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/assistants`           |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/threads`              |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/threads/messages`     |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/threads/runs`         |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/vector_stores`        |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制条件见下文 |                            否                            |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制条件见下文 |                            否                            |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/voices`         |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/files`                |           否           |          30 天           |        直至删除\*         |               否               |                            否                            |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/evals`                |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/batches`              |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/live/sessions`        |           否           |          30 天           |   无，或存储时保留 30 天   |  是，限制条件见下文   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |

#### `/v1/chat/completions`

- 音频输出应用状态会被存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 请参阅 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留时间。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文另有说明外，Responses API 默认拥有 30 天的应用状态保留期，或者当 `store` 参数被设置为 `true`。时也是如此。在这些情况下，响应数据将至少被存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘上大约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，前台请求在 `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。如果 `store` 被省略或设置为 `false` 对于后台请求，响应会在临时轮询期结束后被删除。
- 音频输出应用状态会被存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 请参阅 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [remote MCP server tool](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）搭配使用）属于第三方服务，发送到 MCP 服务器的数据需遵守其数据保留策略。
- 由 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器，可能会在容器处于活动状态时将临时应用状态写入容器文件系统（由临时块存储提供支持）。容器数据会在容器过期或被显式删除时一并删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留时间。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用 Zero Data Retention 时，所有查询都会对所有支持的模型使用扩展提示词缓存。
- 对于服务端压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 采用两种形态：本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据需遵守其数据保留策略。

#### `/v1/decisions`

默认情况下，滥用监控日志最多保留 30 天。符合条件的客户可以使用 Zero Data Retention，但须遵守以下限制。

- 提示缓存可能会将加密后的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，24 小时过期后即被清除。了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 请参阅 [图像和文件输入](#image-and-file-inputs) 以获取有关图像输入的 CSAM 留存例外。

Decisions API 在已签署的 OpenAI 业务伙伴协议与医疗保健附录下，可用于符合 HIPAA 的用途，但须满足适用的账户配置要求。

#### `/v1/assistants`, `/v1/threads`，并且 `/v1/vector_stores`

- 与 Assistants API 相关的对象在你通过 API 或控制台将其删除 30 天后，会从我们的服务器中删除。未通过 API 或控制台删除的对象将无限期保留。

#### `/v1/images`

- 使用以下功能时，图像生成符合零数据保留（Zero Data Retention）要求 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 文件可以通过 API 或控制台手动删除，也可以通过设置以下参数自动删除： `expires_after` 参数。查看 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### 历史视频 API 保留

在 2026 年 9 月 24 日停用之前，Videos API 文档规定生成视频的下载时限为 48 小时，随后保留 30 天用于滥用监测。这些期限描述的是停用前已记录在案的策略，并不承诺在停用后仍提供下载访问。请参阅 [Videos API 停用通知](https://developers.openai.com/api/docs/deprecations#2026-03-24-sora-2-video-generation-models-and-videos-api).

#### 图像和文件输入

可将图片和文件作为输入上传至 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。也可以将图片上传到 `/v1/decisions`。图片和文件输入在提交时会进行 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，该图片将被保留以供人工审核，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或 Private Retention with PSP。

#### 网页搜索

具有实时互联网访问的网页搜索不符合 HIPAA 资格，也不受 BAA 保障。仅在离线/仅缓存模式下运行的网页搜索（`external_web_access: false`）在使用来自启用了 ZDR 的组织内启用了 ZDR 的项目的 API 密钥时，才有资格受 BAA 保障。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，表现得如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的础设施所在的位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以确认你是否有资格使用数据驻留控制。使用数据驻留端点的 [10% 加价](https://developers.openai.com/api/docs/pricing) ，适用于在 2026 年 3 月 5 日或之后发布且有资格使用数据驻留的模型。

### 数据驻留是如何运作的？

在你的帐户上启用数据驻留后，你可以从下面列出的可用区域中，为在帐户中创建的新项目设置区域。如果你使用下面列出的受支持端点、模型和快照，则该项目的客户内容（定义见你的服务协议）将在静态存储时保存至所选区域，但以端点正常运行所需的数据持久化范围为限（例如 /v1/batches）。

如果你选择下面明确标明的支持区域处理的区域，服务还将在所选区域内对你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外处理和存储。系统数据是指不包含客户内容的帐户数据、元数据和使用数据，由服务收集并用于管理和运行服务，例如帐户信息或直接访问服务的终端用户资料（例如你的员工）、分析数据、使用统计、账单信息、支持请求和结构化输出架构。

### 子处理商与区域请求处理

OpenAI 使用 [子处理方](https://openai.com/policies/sub-processor-list/) 提供其服务。对于发送至 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) 以便 TLS 终止和 HTTPS 解密在所选处理区域内进行。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施的位置而在所选区域之外传输或存储客户内容；(2) 由 OpenAI 之外的各方通过本服务提供的产品、服务或内容；或 (3) 客户内容之外的任何数据，例如系统数据。

如果你所选区域不支持区域化处理（如下所述），OpenAI 也可能在区域之外处理并临时存储客户内容，以提供相应服务。

### 非美国地区的额外要求

要在美国以外的任何区域使用数据驻留，你必须获得滥用监控控制方面的批准，并签署《修订保留期》附录。

选择阿拉伯联合酋长国区域需要额外批准。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留按项目在你的 API Organization 中配置。

要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目发出的请求，请在每个请求中添加下表定义的域前缀。

#### Select a processing region per request

作为创建区域特定项目的替代方案，你可以为单个请求选择区域处理，方法是使用带有 API 密钥的前缀域，且该 接口 密钥来自一个具有 Global 地理位置的项目。

现有的资格和数据保留控制要求仍然适用。所选端点和模型也必须支持区域处理，如下表所示。

以下示例为 global、US 和 EU 请求复用一个客户端和一个来自 Global 项目的 API 密钥：

```python
from openai import OpenAI

client = OpenAI()

# No processing constraint.
response = client.responses.create(
    model="gpt-5.6-terra",
    input="Reply with OK.",
)
print(response.output_text)

# US processing and storage.
response = client.with_options(
    base_url="https://us.api.openai.com/v1",
).responses.create(
    model="gpt-5.6-terra",
    input="Reply with OK.",
)
print(response.output_text)

# EU processing and storage.
response = client.with_options(
    base_url="https://eu.api.openai.com/v1",
).responses.create(
    model="gpt-5.6-terra",
    input="Reply with OK.",
)
print(response.output_text)
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Reply with OK."
)
puts(response.output_text)

response = client.with_options(data_residency: :us).responses.create(
  model: "gpt-5.6-terra",
  input: "Reply with OK."
)
puts(response.output_text)

response = client.with_options(data_residency: :eu).responses.create(
  model: "gpt-5.6-terra",
  input: "Reply with OK."
)
puts(response.output_text)
```


### 哪些模型和功能符合数据驻留资格？

以下模型和 API 服务目前可在下方所列区域享受数据驻留。

使用 **按区域提供的支持** 来比较各区域的能力，并扩展每个区域可用的服务。使用 **API 端点、工具和模型支持** 以获取完整的模型列表和详细的服务视图。对区域存储的支持并不意味着对区域处理的支持。

Fast 模式为 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 提供欧盟数据驻留。Fast 模式在欧盟数据驻留下不适用于 GPT-6 Astra。GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 通过 Standard、Flex 和 Batch 处理支持欧盟数据驻留。 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 下的 GPT-6.1 Sol 支持美国和欧盟数据驻留以及全局处理。GPT-6 Astra Ultrafast 仅支持美国数据驻留和全局处理。

#### Support by region

以下是完整的、未经过筛选的区域支持表。每个服务的模型快照列在 **API 端点、工具和模型支持**。中。当区域处理仅支持部分快照时，该子集会包含在处理服务单元格中。

| 区域                     | 域前缀       | 区域存储 | 区域处理 | MAM 或 ZDR 必需 | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       是        |         是         |         否          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲 (EEA + 瑞士) | `eu.api.openai.com` |       是        |         是         |       是\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 加拿大\*                   | `ca.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 日本\*                    | `jp.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 印度\*                    | `in.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 新加坡\*                | `sg.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 韩国\*              | `kr.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 英国\*           | `gb.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 阿联酋\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                                                                       |

\* 这些区域的图像支持需要获得增强型零数据保留或增强型修订滥用监控的批准。

\*\* 需要零数据保留、修订滥用监控、带有 PSP 的私有保留或安全保留。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 区域处理快照例外                                                                    | 备注                                                                                                                                                                                                   |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 支持欧盟数据驻留，可使用 Standard、Flex 和 Batch 处理。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                                         |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿联酋： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | 快速模式支持 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 的欧盟数据驻留。GPT-6 Astra 在欧盟数据驻留下不支持快速模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。 |
| `/v1/decisions`                                                      | 决策        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-luna`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | 在所有受支持的 API 区域中可用。美国和欧洲（EEA + 瑞士）支持区域处理。提示缓存受下文保留期限制的约束。             |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 阿联酋： `text-embedding-3-large`                                                             | —                                                                                                                                                                                                       |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/fine_tuning/jobs`                                               | 微调      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/moderations`                                                    | 审核       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿联酋： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | 快速模式支持 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 的欧盟数据驻留。GPT-6 Astra 在欧盟数据驻留下不支持快速模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。 |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | 与 base64 文件上传一起使用时受支持。                                                                                                                                                           |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略约束。                                                                                             |
| `Scale Tier`                                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                                       |
| `Supported input modalities`                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                                       |



### Endpoint limitations

#### /v1/decisions

Decisions API 在所有受支持的 API 区域中均可用。区域处理在美国和欧洲（EEA + 瑞士）受支持。在某个区域可用并不意味着推理会在该区域执行。

- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理(region processing)的区域中，可能需要 OpenAI 在区域(Region)之外处理并临时存储客户内容，以提供服务。

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理(region processing)的区域中，可能需要 OpenAI 在区域(Region)之外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理(region processing)的区域中，可能需要 OpenAI 在区域(Region)之外处理并临时存储客户内容，以提供服务。

#### /v1/live/sessions

GPT-Live 会话符合零数据保留条件。启用零数据保留后， `store` 将被视为 `false`，即使请求将其设置为 `true`.

默认禁用会话存储。对于启用了会话存储的项目， `store: true` 会将已完成的会话录制保留 30 天，以便下载或用于启动派生会话。已存储的会话及其索引将在 30 天后过期。下载录制内容和派生会话需要数据策略允许持久化，且零数据保留不提供这些功能。

设置 `store: false` 进行派生会话会阻止存储新会话，但不会删除源录制内容，也不会移除读取它所需的授权。API 未提供公开的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具拥有各自的数据控制；请查看本页上适用的端点和功能条目。

#### /v1/realtime

追踪目前不符合 EU 数据驻留要求，针对 `/v1/realtime`.

## Enterprise Key Management (EKM)

企业密钥管理 (EKM) 允许你使用由自有外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 中的客户内容进行加密。

配置完成后，EKM 将适用于你在使用该平台期间创建的任何 [应用程序状态](#types-of-data-stored-with-the-openai-api) 。有关详细信息，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商集成。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户的自带密钥 (BYOK) 加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，以便与 OpenAI 配合使用。

EKM 不支持以下产品。在启用了 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants（/v1/assistants）
- 视觉微调