# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾附加 `.md` 可获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023 年 3 月 1 日起，发送到 OpenAI API 的数据不会被用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 你使用平台时生成的日志，OpenAI 需要据此执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和相关协议，并减轻 AI 的有害使用行为。
- **应用状态：** 为完成某项任务或请求而由某些 API 功能持久化保存的数据。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及由该客户内容衍生的元数据（例如分类器输出）。默认情况下，滥用监控日志会针对所有 API 功能的使用而生成，并保留最长 30 天，除非法律要求更长的保留期，或者为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在符合下文所述限制的前提下，通过获批 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制选项，将其客户内容从这些滥用监控日志中排除。目前，这些控制选项须经 OpenAI 事先批准并接受额外要求后方可使用。已获批准的客户可为其 API 组织或项目在修改后的滥用监控和零数据保留之间进行选择。

启用修改后的滥用监控或零数据保留的客户有责任确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律下的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 了解有关这些产品的更多信息并咨询资格要求。

### 修改后的滥用监控

Modified Abuse Monitoring 会从所有 API 端点的滥用监控日志中排除客户内容（如下所述的极少数情况下的图像和文件输入除外） [如下](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍允许客户充分利用 OpenAI 平台的全部能力。

### Zero Data Retention

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会改变某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为变化外，下表中标记为 Zero Data Retention Eligible 为 No 的端点和功能仍可能存储应用状态，即使已启用 Zero Data Retention。

<a id="zero-data-retention-with-private-safety-processing"></a>

### ZDR 与私有安全处理

[使用 Private Safety Processing 实现零数据保留](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据保留保护的同时执行自动化安全监控。此页面上列出的端点和功能限制仍然适用。

将 ZDR 与 PSP 一起使用的客户必须配置客户控制的存储，并满足 [ZDR 与 Private Safety Processing 指南](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### 私有保留与私有安全处理（前称 Eyes Off）

对于获准采用零数据留存或修改后的滥用监控的客户，我们保留针对特定客户使模型不符合零数据留存或修改后的滥用监控条件的权利，并会事先以书面形式通知受影响的客户。在此情况下，客户内容将保留在 OpenAI 托管基础设施中的加密滥用监控日志里，但除非适用法律要求，否则这些内容将被排除在人工审查之外。更多信息，请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署 OpenAI 商业伙伴协议及医疗健康附录的客户，在你的组织 ID 配置了 Private Retention with Private Safety Processing 后，即使数据被留存，符合 BAA 条件的端点也可用于处理 PHI。本页所列的端点和功能限制仍然适用。

### 安全保留

对于已获准采用零数据留存或经修订的滥用监测的客户，我们保留在合理必要情况下将特定客户的模型取消零数据留存或经修订的滥用监测资格的权利，以调查或防止严重风险活动，并会提前书面通知受影响的客户。在此情况下，当使用这些模型时，我们可能会留存并人工审查我们的分类器检测为可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或你的协议。否则不会影响保留。对于已签署 OpenAI 商业伙伴与医疗保健附录的客户，一旦你的组织 ID 配置了安全保留，即使数据被保留，符合同附录（BAA）资格的端点也可用于处理 PHI。

### 配置数据保留控制

当你的组织获得数据保留控制功能的使用批准后，你会在 **Data Retention** 标签页中看到 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织层级和项目层级配置数据保留控制。

- **组织级控制：** 在整个组织中选择 Zero Data Retention 或 Modified Abuse Monitoring。
- **项目级控制：** 针对每个项目，选择 `default` 以继承组织级设置，明确选择 Zero Data Retention 或 Modified Abuse Monitoring，或选择 **None** 以禁用该项目的这些控制。

### 各接口的存储要求与保留控制

下表说明了在每个端点上何时会存储应用状态。符合零数据保留资格的端点不会保留任何客户内容用于应用状态，但仍受以下限制约束。不符合零数据保留资格的端点或能力在使用时可能会保留应用状态，即使你已启用零数据保留。

| 端点                   | 用于训练的数据 | 滥用监控保留期限 |  应用状态保留期限   |  符合零数据保留条件  | 符合带 PSP 与安全保留的私有保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无,详见下文的例外情况 | 是,详见下文的限制条件 |              是,详见下文的限制条件              |
| `/v1/responses`            |           否           |          30 天           | 无,详见下文的例外情况 | 是,详见下文的限制条件 |              是,详见下文的限制条件              |
| `/v1/decisions`            |           否           |          30 天           | 无,详见下文的例外情况 | 是,详见下文的限制条件 |                   待确认                   |
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
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是,详见下文的限制条件 |                            否                            |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是,详见下文的限制条件 |                            否                            |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/files`                |           否           |          30 天           |        直至删除\*         |               否               |                            否                            |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/evals`                |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/batches`              |           否           |          30 天           |         直至删除          |               否               |                            否                            |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/live/sessions`        |           否           |          30 天           |   无,若存储则为 30 天   |  是,具体限制见下文   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |

#### `/v1/chat/completions`

- 音频输出的应用状态会保留 1 小时以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- Prompt caching 可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 为 `in_memory` 会返回错误。对于 GPT-5.6 模型及以后的模型家族， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是最长应用状态保留期。要了解更多信息，请参阅 [prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文另有说明外，Responses API 默认具有 30 天的应用状态保留期，或当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少保留 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式将响应数据存储到磁盘约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强型 Modified Abuse Monitoring，前台请求在以下情况下遵循标准保留期 `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。时遵循标准保留期。如果 `store` 被省略或设置为 `false` 适用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会保留 1 小时以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）配合使用）属于第三方服务，发送到 MCP 服务器的数据将遵循其数据保留策略。
- 使用的托管容器 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 可能会在容器处于活动状态时将临时应用状态写入容器文件系统（由临时块存储提供支持）。容器数据会在容器过期或被显式删除时一并删除。
- Prompt caching 可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 为 `in_memory` 会返回错误。对于 GPT-5.6 模型及以后的模型家族， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是最长应用状态保留期。要了解更多信息，请参阅 [prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当未为组织启用零数据保留时，所有查询都会对所有受支持的模型使用扩展提示缓存。
- 对于服务端压缩，不会保留任何数据，前提是 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的两种形态：本地执行和基于托管容器的执行。托管 Skills 遵循与托管 shell 相同的容器生命周期：挂载的 Skills 和容器文件在容器活动期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据将遵循其数据保留策略。

#### `/v1/decisions`

默认情况下，滥用监控日志最多保留 30 天。符合条件的客户可以使用零数据保留（Zero Data Retention），但需遵守以下限制。

- 提示词缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。如需了解更多信息，请参阅 [prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 参见 [图像和文件输入](#image-and-file-inputs) 关于图像输入的 CSAM 保留例外。

Decisions API 在已签署的 OpenAI 商业伙伴与医疗保健附录下符合 HIPAA 使用要求，但须满足适用的账户配置要求。

#### `/v1/assistants`, `/v1/threads`, 以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或仪表板删除它们 30 天后从我们的服务器中删除。通过 API 或仪表板未删除的对象将被无限期保留。

#### `/v1/images`

- 图像生成在使用以下方式时与零数据保留兼容 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，时，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或仪表板手动删除文件，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### 历史视频 API 保留策略

在 2026 年 9 月 24 日关停之前，Videos API 文档规定下载生成视频的时限为 48 小时，随后保留 30 天用于滥用监控。这些期限描述的是关停前文档中所记录的政策，并不承诺在关停之后仍提供下载访问。请参阅 [Videos API 关停通知](https://developers.openai.com/api/docs/deprecations#2026-03-24-sora-2-video-generation-models-and-videos-api).

#### 图像和文件输入

图片和文件可以作为输入上传到 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图片也可以上传到 `/v1/decisions`。提交时会扫描图片和文件输入中的 CSAM 内容。如果分类器检测到潜在的 CSAM 内容，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或带有 PSP 的 Private Retention，该图片也会被保留以供人工审核。

#### 网页搜索

带实时联网访问的网页搜索不符合 HIPAA 资格，也不受 BAA 覆盖。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在配合来自 ZDR 组织内已启用 ZDR 项目的 API 密钥使用时，可受 BAA 覆盖。本 HIPAA/BAA 指引仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` 为 `true`。我们推荐使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的相关基础设施所在的位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，以确认你是否符合使用数据驻留控制的资格。使用数据驻留端点的请求将收取 [10% 的附加费用](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日当天或之后发布且支持数据驻留的模型。

### 数据驻留是如何运作的？

当你在你的账户上启用数据驻留时，你可以为你账户中新建的项目从下方列出的可用区域中选择一个区域。如果使用下方列出的受支持端点、模型和快照，那么该项目中的客户内容（按你服务协议中的定义）在端点为实现功能（例如 /v1/batches）而需要数据持久化的范围内，将在所选区域静态存储。

如果你选择了一个明确支持区域化处理的区域（如下方特别标明），服务也会在所选区域为你执行客户内容的推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外进行处理和存储。系统数据是指不含客户内容的账户数据、元数据和使用数据，服务收集这些数据并用于管理和运营服务，例如直接访问服务的终端用户（比如你的员工）的账户信息或资料、分析数据、使用统计、计费信息、支持请求以及结构化输出 schema。

### 子处理者与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发往 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密发生在所选的处理区域内。

### 限制

数据驻留不适用于以下情形：(1) 因终端用户或客户的基础设施在访问服务时的所在地而导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的各方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果您所选区域不支持区域化处理（如下所述），OpenAI 也可能在区域之外处理并临时存储客户内容，以提供相应服务。

### 非美国地区的其他要求

要将数据驻留用于美国以外的任何区域，你必须获得滥用监控控制的批准，并执行修改后的保留条款修正案。

选择阿拉伯联合酋长国区域需要额外的批准。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留是在你的 API Organization 内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目，请在每个请求中添加下表所定义的域前缀。

#### Select a processing region per request

除了创建区域专属项目外，你也可以对单个请求选择区域处理，方法是使用带有前缀的域名，以及来自 Global 地域项目的 API 密钥。

现有的资格要求和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

以下示例复用一个客户端以及来自 Global 项目的 API 密钥，分别用于 Global、US 和 EU 请求：

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

以下模型和 API 服务目前可在下方指定区域使用数据驻留。

使用 **按区域支持** 来比较各区域的能力并扩展每个区域可用的服务。使用 **API 端点、工具和模型支持** 可查看完整的模型列表和详细的服务视图。区域存储支持并不意味着区域处理支持。

GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna 在 EU 数据驻留下不可用 Fast 模式。GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 在 Standard、Flex 和 Batch 处理下支持 EU 数据驻留。 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 仅支持 US 数据驻留和全球处理，不支持 EU 或其他非 US 区域处理端点。

#### 各地区支持情况

下面是完整且未筛选的区域支持表。每个服务的模型快照列在 **API 端点、工具和模型支持**。当区域处理仅支持快照的子集时，该子集包含在 processing-services 单元格中。

| 区域                     | 域前缀       | 区域存储 | 区域处理 | 需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
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

\* 这些区域的图像支持需要获得增强版 Zero Data Retention 或增强版 Modified Abuse Monitoring 的审批。

\*\* 需要 Zero Data Retention、Modified Abuse Monitoring、带 PSP 的 Private Retention，或 Safety Retention。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型与快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 区域处理快照例外情况                                                                    | 备注                                                                                                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/batches`                                                        | 批量          | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 在 Standard、Flex 和 Batch 处理方式下支持欧盟数据驻留。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                             |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna 在欧盟数据驻留下不可用 Fast 模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                               |
| `/v1/decisions`                                                      | Decisions        | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-luna`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | 在所有支持的 API 区域中可用。区域处理在美国和欧洲（EEA + 瑞士）受支持。Prompt caching 受下文保留期限制。 |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | 微调      | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna 在欧盟数据驻留下不可用 Fast 模式。GPT-6.1 Sol 仅支持美国和欧盟数据驻留。                               |
| `/v1/responses File Search`                                          | Responses        | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | 在与 base64 文件上传一起使用时受支持。                                                                                                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略的约束。                                                                                 |
| `Scale Tier`                                                         | 其他            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                       | —                                                                                                                                                                                           |
| `Supported input modalities`                                         | 其他            | 所有列出区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                                                                                                           |



### Endpoint limitations

#### /v1/decisions

Decisions API 在所有受支持的 API 区域可用。美国和欧洲（EEA + 瑞士）支持区域处理。在某区域可用并不代表推理也在该区域进行。

- [Extended prompt 缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在该区域之外处理并临时存储客户内容以提供服务。

#### /v1/chat/completions

- 在非美国区域不能设置 store=true。
- [Extended prompt 缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在该区域之外处理并临时存储客户内容以提供服务。

#### /v1/responses

- [Extended prompt 缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在该区域之外处理并临时存储客户内容以提供服务。

#### /v1/live/sessions

GPT-Live 会话符合零数据保留的资格。启用零数据保留后， `store` 将被视为 `false`，即使某个请求将其设置为 `true`.

会话存储默认处于禁用状态。对于启用了会话存储的项目， `store: true` 会保留已完成的会话录制 30 天，以便可以下载或用于启动分叉会话。已存储的会话及其索引将在 30 天后过期。录制下载和分叉功能需要允许持久化的数据策略，在 Zero Data Retention 下不可用。

设置 `store: false` 在 fork 上操作不会阻止存储新会话，也不会删除源录制或移除读取该录制所需的授权。API 未提供公开的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具有各自的数据控制方式；请查看本页上适用的端点和功能条目。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求， `/v1/realtime`.

## 企业密钥管理 (EKM)

Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥来加密在 OpenAI 上的客户内容。

配置完成后，EKM 会应用于你在使用平台期间创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商集成。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户进行自带密钥 (BYOK) 加密。如果你的组织使用其他密钥管理服务，这些密钥需要同步到某个受支持的云 KMS 提供商，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants (/v1/assistants)
- 视觉微调