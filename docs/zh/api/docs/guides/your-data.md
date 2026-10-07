# OpenAI 平台中的数据控制

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 与 OpenAI API 一起存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 因你使用本平台而生成的日志，OpenAI 需据此执行我们的 [使用政策](https://openai.com/policies/usage-policies) 及相关协议，并缓解有害使用 AI 的情况。
- **应用状态：** 由部分 API 功能持久化保存的数据，用于完成任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从这些客户内容衍生的元数据，例如分类器的输出。默认情况下，滥用监控日志会针对所有 API 功能使用生成，并保留最长 30 天，除非法律要求更长的保留期，或者为了合理保护我们的服务或任何第三方免受伤害而有必要保留更长时间。

符合条件的客户可让其客户内容不纳入这些滥用监控日志，但须遵守以下限制，方法是申请获批 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制。目前，这些控制需事先获得 OpenAI 的批准并接受额外要求。已获批准的客户可为其 API 组织或项目在修改后的滥用监控和零数据保留之间选择。

启用修改后的滥用监控或零数据保留的客户有责任确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律规定的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以了解这些产品的更多信息并咨询资格要求。

### 修改后的滥用监控

修改版滥用监控会从所有 API 端点的滥用监控日志中排除客户内容（如以下部分所述，少数情况下的图像和文件输入除外 [如下所述](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍然允许客户充分利用 OpenAI 平台的全部功能。

### Zero Data Retention

零数据保留同样会将客户内容排除在滥用监控日志之外，这与修改后的滥用监控方式一致。

此外，零数据保留还会改变某些端点的行为： `store` 参数中的 `/v1/responses` 与 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将其值设为 `true`.

除了上述特定的行为变化外，即使启用了零数据保留，下表中标记为不符合零数据保留资格的端点和功能仍可能存储应用状态。

<a id="zero-data-retention-with-private-safety-processing"></a>

### ZDR with Private Safety Processing

[通过私有安全处理实现零数据保留](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据保留保护的同时执行自动化安全监控。本页列出的端点和功能限制仍然适用。

在 PSP 模式下使用 ZDR 的客户必须配置客户可控的存储，并满足 [ZDR 与私有安全处理指南](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### 私有保留与私有安全处理（前称 Eyes Off）

对于获批零数据留存或修改后滥用监控的客户，我们保留针对特定客户将模型排除在零数据留存或修改后滥用监控之外的权利，并将提前书面通知受影响的客户。在这种情况下，客户内容将保留在OpenAI管理的基础设施中加密的滥用监控日志中，但除非适用法律要求，否则这些内容将被排除在人工审核之外。更多信息，请参阅 [《Private Safety Processing 技术白皮书》](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署OpenAI《商业伙伴与医疗保健附录》的客户，在为您的组织 ID 配置好带有 Private Safety Processing 的 Private Retention 后，即使数据被保留，也可以使用符合 BAA 资格的端点处理 PHI。本页面列出的端点和功能限制仍然适用。

### 安全保留

对于已获批零数据留存或修改后滥用监控的客户，如果我们合理认为有必要调查或防止严重风险活动，我们保留使某些模型对该等客户不再符合零数据留存或修改后滥用监控条件的权利，并会事先以书面形式通知受影响的客户。在此情况下，当我们使用这些模型时，如果我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或你的协议，我们可能会留存该等内容并进行人工审核。除此之外，留存不会受到影响。对于已签署 OpenAI 商业伙伴协议和医疗保健附录的客户，一旦你的组织 ID 配置了安全留存，即使数据被留存，BAA 适用的端点也可用于处理 PHI。

### 配置数据保留控制

在你的组织获批数据保留控制功能后，你会在 **数据保留** 标签页中看到它，位于 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目两个层级配置数据保留控制。

- **组织级控制：** 在整个组织中选择零数据留存或修改后的滥用监控。
- **项目级控制：** 针对每个项目，选择 `default` 以继承组织级设置、明确选择零数据留存或修改后的滥用监控，或选择 **无** 以对该项目禁用这些控制。

### 各接口的存储要求与保留期控制

下表说明了每个端点何时存储应用状态。符合零数据保留（Zero Data Retention）资格的端点在以下限制条件下不会保留任何客户内容用于应用状态。不符合零数据保留资格的端点或功能在使用时可能会保留应用状态，即使你已启用零数据保留也是如此。

| 端点                   | 用于训练的数据 | 滥用监控保留期限 |  应用状态保留期限   |  符合零数据保留条件  | 符合带 PSP 和安全保留的私有保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |              是，限制见下文              |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |              是，限制见下文              |
| `/v1/decisions`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |                   待确认                   |
| `/v1/conversations`        |           否           |       直到删除        |         直到删除          |               否               |                            否                            |
| `/v1/conversations/items`  |           否           |       直到删除        |         直到删除          |               否               |                            否                            |
| `/v1/chatkit/threads`      |           否           |       直到删除        |         直到删除          |               否               |                            否                            |
| `/v1/agents`               |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/assistants`           |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/threads`              |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/threads/messages`     |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/threads/runs`         |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/vector_stores`        |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制见下文 |                            否                            |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制见下文 |                            否                            |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/voices`         |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/files`                |           否           |          30 天           |        直到删除\*         |               否               |                            否                            |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/evals`                |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/batches`              |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/live/sessions`        |           否           |          30 天           |   无，或存储时为 30 天   |  是，存在以下限制   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |

#### `/v1/chat/completions`

- 音频输出的应用状态会保留 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，在 24 小时到期后不会保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留期。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文另有说明外，Responses API 默认具有 30 天的应用状态保留期，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少保存 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘上大约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，当 `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。时遵循标准保留期。如果 `store` 被省略或设置为 `false` 用于后台请求，响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会保留 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）是第三方服务，发送到 MCP 服务器的数据遵循其各自的数据保留策略。
- 由 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器可能会在容器处于活动状态时将临时应用状态写入容器文件系统（由临时块存储提供支持）。容器数据会在容器到期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，在 24 小时到期后不会保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留期。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用 Zero Data Retention 时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于 服务端 压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 提供两种形态：本地执行和基于托管容器的执行。托管 Skills 遵循与托管 shell 相同的容器生命周期：挂载的 Skills 和容器文件在容器处于活动状态期间保持可用，并在容器到期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据遵循其各自的数据保留策略。

#### `/v1/decisions`

默认情况下，滥用监控日志最多保留 30 天。符合条件的客户可以使用零数据保留（Zero Data Retention），但须遵守下述限制。

- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 参见 [图像和文件输入](#image-and-file-inputs) ，了解针对图像输入的 CSAM 保留例外情况。

Decisions API 适用于 HIPAA 使用场景，但前提是已签署 OpenAI 商业伙伴与医疗保健附录，并满足相关账户配置要求。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或控制面板删除它们 30 天后从我们的服务器上删除。未通过 API 或控制面板删除的对象将被无限期保留。

#### `/v1/images`

- 图像生成在使用以下服务时兼容零数据保留 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，时，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 文件可以通过 API 或控制面板手动删除，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### 历史视频 API 保留

在 2026 年 9 月 24 日停服之前，Videos API 文档规定已生成视频的下载期限为 48 小时，随后保留 30 天用于滥用监控。上述时限描述的是停服前已记录的政策，并不承诺停服后仍提供下载访问。详见 [Videos API 停服通知](https://developers.openai.com/api/docs/deprecations#2026-03-24-sora-2-video-generation-models-and-videos-api).

#### 图像和文件输入

可以将图片和文件作为输入上传到 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图片也可以上传到 `/v1/decisions`。图片和文件输入在提交时会被扫描是否存在 CSAM 内容。如果分类器检测到潜在的 CSAM 内容，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或带有 PSP 的 Private Retention，该图片也会被保留以供人工审核。

#### 网页搜索

具有实时互联网访问的网页搜索不符合 HIPAA 资格，且不受 BAA 覆盖。仅限离线/缓存模式的网页搜索（`external_web_access: false`）在通过 ZDR 组织内启用 ZDR 的项目使用 API 密钥时，可由 BAA 覆盖。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，其行为如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的相关基础设施所在区域。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以确认你是否有资格使用数据驻留控制。数据驻留相关端点会收取一定的 [10% 上调](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布且符合数据驻留要求的模型。

### 数据驻留是如何运作的？

当你的账号启用了数据驻留（data residency）后，你可以为你账号中新创建的项目设置一个区域，从下列可选区域中选择。如果你使用下文列出的受支持端点、模型和快照，你该项目下的客户内容（按你的服务协议中的定义）将在所选区域内静态存储，前提是相关端点为实现其功能而需要持久化数据（例如 /v1/batches）。

如果你选择的下文明确标识的支持区域处理（regional processing）的区域，服务也将在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外进行处理和存储。系统数据指不包含客户内容的账号数据、元数据和使用数据，这些数据由服务收集并用于管理和运营服务，例如账号信息或直接访问服务的最终用户（例如你的员工）的资料、分析信息、使用统计、计费信息、支持请求以及结构化输出 schema。

### 子处理方与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便在所选的处理区域内完成 TLS 终止和 HTTPS 解密。

### 局限性

数据驻留不适用于以下情况：(1) 终端用户或客户的基础设施在访问服务时因其所处位置而导致的客户内容的传输或存储超出所选区域；(2) 由 OpenAI 之外的第三方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果您所选的区域不支持区域处理（如下所述），OpenAI 也可能会在区域之外处理并临时存储客户内容，以提供相应服务。

### 非美国地区的额外要求

若要在美国以外的任何区域使用数据驻留，你必须获得滥用监控管控的批准，并签署修订版留存条款附录。

选择阿拉伯联合酋长国区域需要额外的审批。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下方表格中的定义，在每个请求中添加域名前缀。

#### 为每个请求选择处理区域

作为创建特定区域项目的替代方案，你也可以对单个请求选择区域处理，方法是使用来自 Global 区域项目的 API key 访问带前缀的域名。

现有的资格要求和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

下面的示例为 global、US 和 EU 请求复用了同一个客户端和来自 Global 项目的 API key：

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

以下模型和 API 服务目前支持在下方指定区域进行数据驻留。

使用 **按区域查看支持情况** 来比较各区域的能力并查看每个区域可用的服务。使用 **API 端点、工具和模型支持** 查看完整的模型列表和详细的服务视图。区域存储支持并不意味着区域处理支持。

GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 在欧盟数据驻留下不支持 Fast 模式。GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 在欧盟数据驻留下支持 Standard、Flex 和 Batch 处理。 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 仅支持美国数据驻留和全球处理，不支持欧盟或其他非美国的区域处理端点。

#### 按地区提供支持

以下是完整的、未经过滤的区域支持表。每个服务的模型快照列在 **API 端点、工具和模型支持**。中。当区域处理仅支持部分快照时，该子集包含在 processing-services 单元格中。

| 地区                     | 域名前缀       | 区域存储 | 区域处理 | 是否需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       是        |         是         |         否          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲（EEA + 瑞士） | `eu.api.openai.com` |       是        |         是         |       是\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 加拿大\*                   | `ca.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 日本\*                    | `jp.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 印度\*                    | `in.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 新加坡\*                | `sg.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 韩国\*              | `kr.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 英国\*           | `gb.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 阿拉伯联合酋长国\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/decisions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                                                                       |

\* 这些区域的图像支持需要获得增强型 Zero Data Retention 或增强型 Modified Abuse Monitoring 的批准。

\*\* 需要 Zero Data Retention、Modified Abuse Monitoring、带 PSP 的 Private Retention 或 Safety Retention。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 区域处理快照例外                                                                    | 备注                                                                                                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 通过 Standard、Flex 和 Batch 处理支持欧盟数据驻留。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                             |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna 在欧盟数据驻留下不可使用 Fast 模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                               |
| `/v1/decisions`                                                      | Decisions        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-luna`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | 在所有受支持的 API 区域中可用。区域处理在美国和欧洲（EEA + 瑞士）受支持。提示缓存受下文保留期限制的约束。 |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna 在欧盟数据驻留下不可使用 Fast 模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                               |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | Supported when used with base64 file uploads.                                                                                                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | MCP servers are third-party services. Data sent to an MCP server is subject to its data residency policies.                                                                                 |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                           |



### 端点限制

#### /v1/decisions

Decisions API 在所有受支持的 API 区域中均可用。区域处理在美国和欧洲（EEA + 瑞士）受支持。在某个区域可用并不表示推理在该区域执行。

- [Extended prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能要求 OpenAI 在该区域之外处理并临时存储客户内容，以提供相应服务。

#### /v1/chat/completions

- 无法在非美国地区设置 store=true。
- [Extended prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能要求 OpenAI 在该区域之外处理并临时存储客户内容，以提供相应服务。

#### /v1/responses

- [Extended prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能要求 OpenAI 在该区域之外处理并临时存储客户内容，以提供相应服务。

#### /v1/live/sessions

GPT-Live 会话可使用零数据保留。在启用零数据保留后， `store` 被视为 `false`，即使请求将其设置为 `true`.

会话存储默认处于禁用状态。对于已启用会话存储的项目， `store: true` 会将已完成的会话录制保留 30 天，以便下载或用于启动一个分叉会话。已存储的会话及其索引会在 30 天后过期。录制下载和分叉需要允许持久化的数据策略，在 Zero Data Retention 下不可用。

设置 `store: false` 为 on a fork 可阻止存储新会话；但不会删除源录制，也不会移除读取该录制所需的授权。API 不提供公开的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具有各自的数据控制方式；请查阅本页中相应的端点和功能条目。

#### /v1/realtime

追踪目前尚不符合欧盟数据驻留要求， `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) 允许你使用你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

配置完成后，EKM 会应用于你在使用该平台时创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成的更多信息，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户实现自带密钥 (BYOK) 加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供方之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants (/v1/assistants)
- 视觉模型微调