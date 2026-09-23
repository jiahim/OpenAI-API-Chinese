# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会被用于训练或改进 OpenAI 模型（除非你明确选择加入以与我们共享数据）。

## OpenAI API 中存储的数据类型

使用 OpenAI API 时，数据可能以以下形式存储：

- **滥用监控日志：** 你在使用平台过程中产生的日志，是 OpenAI 执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和相关协议、缓解 AI 有害使用所必需的。
- **应用状态：** 由某些 API 功能持久化保存的数据，用于完成相应任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从该客户内容衍生的元数据，例如分类器的输出。默认情况下，滥用监控日志会针对所有 API 功能的使用生成，并保留最长 30 天，除非法律要求更长的保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可依据下方限制，将其客户内容从这些滥用监控日志中排除，方法是申请批准获得 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制。目前，这些控制须经 OpenAI 事先批准并接受额外要求方可使用。获得批准的客户可为其 API 组织或项目选择采用修改后的滥用监控或零数据保留。

启用修改后的滥用监控或零数据保留的客户须负责确保其用户遵守 OpenAI 安全且负责任地使用 AI 的政策，并遵守适用法律规定的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以详细了解这些方案并咨询资格条件。

### 修改后的滥用监控

Modified Abuse Monitoring 会将客户内容（除少数情况下的图像和文件输入外，如下所述） [下方](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)）从所有 API 端点的滥用监控日志中排除，同时仍允许客户充分利用 OpenAI 平台的全部功能。

### Zero Data Retention

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会改变某些端点的行为： `store` 参数 `/v1/responses` 以及 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为变更之外，即使启用了 Zero Data Retention，下表中标为 Zero Data Retention Eligible 为 No 的端点和功能仍可能存储应用程序状态。

### 通过 Private Safety Processing 实现零数据保留

[零数据保留与私有安全处理](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据保留保护的同时执行自动化安全监控。本页所列的端点和功能限制仍然适用。

使用零数据保留与私有安全处理的客户必须配置客户可控的存储，并满足以下文档中所述的其他技术和运营要求： [零数据保留与私有安全处理 (PSP) 指南](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### 私有保留与私有安全处理（前称 Eyes Off）

对于获批零数据留存或修改版滥用监控的客户，我们保留针对特定客户使相关模型不再符合零数据留存或修改版滥用监控条件的权利，并会提前以书面形式通知受影响的客户。在此情况下，客户内容将保留在 OpenAI 托管的基础设施中的加密滥用监控日志中，但除非适用法律要求，否则此类内容不会被人审查。更多信息，请参阅附录 A 中的 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署 OpenAI 业务关联方与医疗保健附录的客户，在为你的组织 ID 配置具备 Private Safety Processing 的 Private Retention 后，即便数据被留存，符合 BAA 条件的端点也可用于处理 PHI。本页所列的端点和功能限制仍然适用。

### 安全保留

对于已获批零数据保留或滥用监控修改的客户，如果我们合理认为有必要调查或防止严重风险活动，我们保留针对特定客户使模型不符合零数据保留或滥用监控修改的权利，且会提前以书面形式通知受影响的客户。在此情况下，当使用这些模型时，若我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您的协议，我们可能会保留并人工审核客户内容。否则，保留不会受到影响。对于已签署 OpenAI 商业伙伴与医疗保健附录的客户，一旦您的组织 ID 配置了安全保留，即使数据被保留，BAA 适用的端点也可用于处理 PHI。

### 配置数据保留控制

在所在组织获批数据保留控制权限后，你会看到 **Data Retention** 选项卡位于 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention). 在该标签页中，你可以在组织和项目两个层级配置数据保留控制。

- **组织级控制：** 在整个组织中选择零数据留存或修改后的滥用监控。
- **项目级控制：** 针对每个项目，选择 `default` 以继承组织级设置，明确选择零数据留存或修改后的滥用监控，或选择 **None** 以禁用该项目的这些控制。

### 各接口的存储要求与保留控制

下表指明了每个端点何时存储应用状态。符合 Zero Data Retention 资格的端点不会保留任何客户内容用于应用状态，但仍受以下限制的约束。若使用不具备 Zero Data Retention 资格的端点或功能，即便你已启用 Zero Data Retention，也可能保留应用状态。

| 端点                   | 用于训练的数据 | 滥用监控保留期 |  应用状态保留期   |  符合零数据保留资格  | 符合带 PSP 的私有保留与安全保留资格 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |              是，限制条件见下文              |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |              是，限制条件见下文              |
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
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制条件见下文 |                            否                            |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制条件见下文 |                            否                            |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/files`                |           否           |          30 天           |        直到删除\*         |               否               |                            否                            |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/evals`                |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/batches`              |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/live/sessions`        |           否           |          30 天           |   无，若存储则为 30 天   |  是，存在以下限制   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                            否                            |

#### `/v1/chat/completions`

- 音频输出的应用状态会保存 1 小时，以便启用 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用零数据保留（Zero Data Retention）时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 及更高版本的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留期。了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非另有说明，Responses API 的应用状态默认保留期为 30 天，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为组织启用零数据保留（Zero Data Retention）时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘上约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，当前台请求处于 `store` 被省略或设置为 `true`。仅当请求显式设置 `store=true`。如果 `store` 被省略或设置为 `false` 用于后台请求，响应将在临时轮询期结束后被删除。
- 音频输出的应用状态会保存 1 小时，以便启用 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用时为第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 以下托管容器使用的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 在容器处于活动状态期间，可能会将临时应用程序状态写入容器文件系统（由临时块存储提供支持）。容器数据会在容器过期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 及更高版本的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这个最长应用状态保留期。了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当未为组织启用零数据保留时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于服务端压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 采用两种形式，本地执行和基于托管容器的执行。托管 Skills 遵循与托管 shell 相同的容器生命周期：挂载的 Skills 和容器文件在容器处于活动状态期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象在通过 API 或仪表板删除后 30 天内会从我们的服务器上删除。未通过 API 或仪表板删除的对象将被无限期保留。

#### `/v1/images`

- 在使用以下参数时，图像生成与零数据保留兼容 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或仪表板手动删除文件，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，会在处理过程中将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，随后为进行滥用监控而保留 30 天。 `v1/videos` 目前被 MAM 或 ZDR 请求阻止。如果你的组织启用了数据保留控制，请按照 **None** 中所述，将项目配置为 [配置数据保留控制](#configuring-data-retention-controls) ，以便将该项目与 `/v1/videos` 一起使用。

#### 图像和文件输入

图像和文件可以作为输入上传到 `/v1/responses` （包括在使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`.图像和文件输入在提交时会被扫描以检测 CSAM 内容。如果分类器检测到潜在的 CSAM 内容，图像将被保留以供人工审核，即使已启用零数据留存、修改后的滥用监控或带 PSP 的私有留存也是如此。

#### 网页搜索

带实时联网访问的网页搜索不符合 HIPAA 资格，也不在 BAA 覆盖范围内。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在配合来自启用了 ZDR 的项目中 ZDR 组织内的 API 密钥使用时，可被 BAA 覆盖。此 HIPAA/BAA 指引仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，其行为如同 `external_web_access` 被 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，可让你配置 OpenAI 用于提供服务的所在基础设施位置。

请联系我们 [销售团队](https://openai.com/contact-sales) ，查看你是否符合使用数据驻留控制的资格。数据驻留端点的费用将上浮 [10%](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布且符合数据驻留条件的模型。

### 数据驻留是如何运作的？

在账号上启用数据驻留后，你可以从下方列出的可用区域中，为在该账号中创建的新项目设置一个区域。如果你使用下方列出的受支持端点、模型和快照，那么该项目下的你的客户内容（定义见你的服务协议）将在所选区域内静态存储，前提是端点需要持久化数据才能运行（例如 /v1/batches）。

如果你选择的区域特别标识为支持区域处理（如下方所列），服务也会在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，相关信息可能会在所选区域之外被处理和存储。系统数据是指不包含客户内容的账号数据、元数据和使用数据，这些数据由服务收集并用于管理和运行服务，例如账号信息或直接访问服务的最终用户（例如你的员工）的档案、分析、使用统计、计费信息、支持请求和结构化输出架构。

### 子处理者与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内进行。

### 局限性

数据驻留不适用于：(1) 由于最终用户或客户的基础设施在访问服务时的位置而导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的各方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果您所选的区域不支持区域化处理（如下所述），OpenAI 也可能在区域之外处理和临时存储客户内容，以提供服务。

### 非美国地区的额外要求

要在美国以外的任何区域使用数据驻留，你必须获得滥用监控控制方面的批准，并签署一份修改后的保留条款修订协议。

选择阿拉伯联合酋长国区域需要额外的批准。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留是按项目在您的 API 组织内配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域前缀为每个请求添加前缀。

#### Select a processing region per request

除了创建特定区域的项目外，你还可以对单个请求选择区域处理，只需对来自 Global 地理位置项目的 API 密钥使用带前缀的域名即可。

现有的资格要求与数据保留控制要求仍然适用。所选端点和模型也必须支持区域处理，如下表所示。

以下示例为 global、US 和 EU 请求复用同一个客户端和来自 Global 项目的 API 密钥：

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


### 哪些模型和功能有资格使用数据驻留？

以下模型和 API 服务目前可在下方指定区域实现数据驻留。

使用 **各区域支持情况** 比较各区域的可用能力，并查看每个区域提供的服务。使用 **API 端点、工具与模型支持** 查看完整的模型列表及详细服务说明。区域存储支持并不意味着同时支持区域处理。

对于 GPT-6 Sol 和 Luna，EU 数据驻留仅在使用 Standard 处理（适用于 Responses 和 Chat Completions）时可用。

#### 按地区提供支持

以下是完整的、未经过滤的区域支持表。每个服务的模型快照列在 **API 端点、工具与模型支持**。中。当区域处理仅支持部分快照时，该子集会包含在处理服务单元格中。

| 区域                     | 域名前缀       | 区域存储 | 区域处理 | 需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       是        |         是         |         否          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲（EEA + 瑞士） | `eu.api.openai.com` |       是        |         是         |       是\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/live/sessions`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 加拿大\*                   | `ca.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 日本\*                    | `jp.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 印度\*                    | `in.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 新加坡\*                | `sg.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 韩国\*              | `kr.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 英国\*           | `gb.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 阿拉伯联合酋长国\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                                                  |

\* 这些区域中的图像支持需要获得增强型 Zero Data Retention 或增强型 Modified Abuse Monitoring 的审批。

\*\* 需要 Zero Data Retention、Modified Abuse Monitoring、带 PSP 的 Private Retention 或 Safety Retention。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型及快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 区域处理快照例外                                                                                                                                                           | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`:仅 Standard 处理                                                                                                                 | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`:仅 Standard 处理<br />阿拉伯联合酋长国: `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 阿拉伯联合酋长国: `text-embedding-3-large`                                                                                                                                                    | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`:仅 Standard 处理<br />阿拉伯联合酋长国: `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | 在使用 base64 文件上传时受支持。                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略的约束。 |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                                                                                                              | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 无法在非美国区域设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在区域之外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在区域之外处理并临时存储客户内容，以提供服务。

#### /v1/live/sessions

GPT-Live 会话符合零数据保留（Zero Data Retention）条件。启用零数据保留后， `store` 会被视为 `false`，即使请求将其设置为 `true`.

默认禁用会话存储。对于启用了会话存储的项目， `store: true` 会将已完成的会话录制保留 30 天，以便下载或用于启动分叉会话。已存储的会话及其索引会在 30 天后过期。录制下载和分叉需要允许持久化的数据策略，在零数据保留下不可用。

在分叉会话上设置 `store: false` 可阻止新会话的存储；但不会删除源录制，也不会移除读取该录制所需的授权。API 未提供公开的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具有各自的数据控制方式；请查阅本页上相应的端点和功能条目。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) 允许你使用你自己的外部密钥管理系统 (KMS) 所管理的密钥，对 OpenAI 的客户内容进行加密。

配置完成后，EKM 将应用于你使用平台期间创建的所有 [应用状态](#types-of-data-stored-with-the-openai-api) 。请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商集成。

### EKM 限制

OpenAI 支持通过外部账户使用自带密钥 (BYOK) 加密，支持的密钥管理服务包括 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault。如果你的组织使用的是其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在启用了 EKM 的项目中尝试调用这些接口将返回错误。

- Assistants (/v1/assistants)
- 视觉微调