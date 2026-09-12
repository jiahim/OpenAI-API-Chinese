# OpenAI 平台中的数据控制

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 来获取。

了解 OpenAI 如何使用你的数据，以及你可以如何控制这些数据。

数据归你所有。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 使用 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能以以下形式存储：

- **滥用监控日志：** 你在平台使用时生成的日志，对于OpenAI执行我们的 [使用政策](https://openai.com/policies/usage-policies) 及协议并减少 AI 的有害使用是必需的。
- **应用状态：** 由某些API功能持久化保存的数据，用于完成任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从该客户内容衍生的元数据（例如分类器输出）。默认情况下，滥用监控日志会针对所有 API 功能使用情况生成，并保留最多 30 天，另有法律规定或为合理保护我们的服务或任何第三方免受伤害所必需的更长期限除外。

符合条件的客户可在遵守下列限制的前提下，通过获批加入 [零数据保留](#zero-data-retention) 或 [修改后滥用监控](#modified-abuse-monitoring) 控制项，将其客户内容从这些滥用监控日志中排除。目前，这些控制项需经 OpenAI 事先批准并接受额外要求后方可使用。已获批的客户可为其 API 组织或项目在修改后滥用监控与零数据保留之间进行选择。

启用修改后滥用监控或零数据保留的客户有责任确保其用户遵守 OpenAI 安全且负责任地使用 AI 的政策，并遵守适用法律规定的任何审核与报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以详细了解这些产品并咨询资格要求。

### 修改后的滥用监控

Modified Abuse Monitoring 将客户内容（如个别情况下的图像和文件输入，详见 [下文](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)) 从所有 API 端点的滥用监控日志中排除，同时仍允许客户使用 OpenAI 平台的全部能力。

### Zero Data Retention

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会更改某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求试图将该值设置为 `true`.

除了这些特定的行为更改之外，即使启用了 Zero Data Retention，下表中标记为不符合 Zero Data Retention 资格的端点和功能仍可能存储应用程序状态。

### Eyes Off

对于获批零数据留存或改进型滥用监控的客户，我们保留将特定客户的模型排除在零数据留存或改进型滥用监控之外的权利，并将提前以书面形式通知受影响的客户。在这种情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则此类内容将被排除在人工审查之外。对于已签署 OpenAI 商业伙伴协议与医疗保健附录的客户，一旦为你的组织 ID 开通 Eyes Off，符合 BAA 条件的端点即可用于处理 PHI，即使数据被留存也是如此。

### 安全留存

对于已获准使用零数据保留或修订版滥用监控的客户，如果我们合理认为有必要调查或防范严重风险活动，我们保留针对特定客户使相关模型不再符合零数据保留或修订版滥用监控条件的权利，并会事先以书面形式通知受影响的客户。在此情况下，当使用这些模型时，若我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或贵方协议，我们可能会保留并人工审查该客户内容。除此情况外，保留政策不会受到影响。对于已签署 OpenAI 商业伙伴协议（Business Associate）及医疗保健附录的客户，一旦你的组织 ID 配置了安全保留（Safety Retention），即可使用符合 BAA 资格的端点处理 PHI，即使数据被保留。

### 配置数据保留控制

在你的组织获得数据保留控制权限后，你会在 **数据保留** 标签页中看到它，位置在 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目两个层级配置数据保留控制。

- **组织级控制：** 在整个组织范围内选择零数据留存或修改后的滥用监控。
- **项目级控制：** 针对每个项目，选择 `default` 以继承组织级设置，明确选择零数据留存或修改后的滥用监控，或选择 **无** 以禁用该项目的这些控制。

### 各接口的存储要求与保留控制

下表说明了每个端点何时存储应用状态。符合零数据保留资格的端点不会保留任何客户内容用于应用状态，但仍受下文所述限制的约束。不符合零数据保留资格的端点或能力在使用时可能会保留应用状态，即使你已启用零数据保留也是如此。

| Endpoint                   | 用于训练的数据 | 滥用监控保留期 |  应用状态保留期   |  符合零数据保留  | 符合 Eyes Off 与安全保留 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/conversations`        |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/conversations/items`  |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/agents`               |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/assistants`           |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads`              |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/messages`     |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/runs`         |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/vector_stores`        |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制条件见下文 |                   否                   |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制条件见下文 |                   否                   |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/files`                |           否           |          30 天           |        直到删除\*         |               否               |                   否                   |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/evals`                |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/batches`              |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/live/sessions`        |           否           |          30 天           |   无，如存储则为 30 天   |  是，存在以下限制   |                   否                   |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                   否                   |

#### `/v1/chat/completions`

- 音频输出的应用状态会存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为某个组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这一最长应用状态保留时长。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，Responses API 默认拥有 30 天的应用状态保留周期，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为某个组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘约 10 分钟，以便支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，当 `store` 被省略或设置为 `true`。仅当请求显式设置 `store=true`。如果 `store` 被省略或设置为 `false` 用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）是第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 由以下使用的托管容器 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 在容器处于活动状态时，可能会将临时应用状态写入容器文件系统（由临时块存储支持）。当容器过期或被显式删除时，容器数据会被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这一最长应用状态保留时长。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当未为组织启用零数据保留时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于 服务端 压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 采用两种形态，即本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，并 `/v1/vector_stores`

- 与 Assistants API 相关的对象会通过 API 或仪表板删除后 30 天从我们的服务器中删除。未通过 API 或仪表板删除的对象将被无限期保留。

#### `/v1/images`

- 使用以下模型时，图像生成兼容零数据保留： `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`,以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或仪表板手动删除文件，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，在处理过程中会将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，随后保留 30 天用于滥用监控。 `v1/videos` 目前被 MAM 或 ZDR 请求阻止。如果你的组织已启用数据保留控制，请配置一个项目，将其保留设置设为 **无** ，如 [配置数据保留控制](#configuring-data-retention-controls) 中所述，以便使用 `/v1/videos` 与该项目配合。

#### 图像和文件输入

图像和文件可以作为输入上传到 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。提交时会对图像和文件输入进行 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，即使启用了 Zero Data Retention、Modified Abuse Monitoring 或 Eyes Off，该图像也会被保留以供人工审核。

#### Web Search

网页搜索（带有实时互联网访问）不符合 HIPAA 要求，也不受 BAA 覆盖。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在与来自 ZDR 启用的项目（位于 ZDR 组织内）的 API 密钥一起使用时，符合被 BAA 覆盖的条件。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览版变体（`web_search_preview`）会忽略此参数，其行为如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，可用于配置 OpenAI 用于提供服务的所在基础设施的位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) 团队，了解您是否有资格使用数据驻留控制。使用数据驻留端点会收取 [10% 的加价](https://developers.openai.com/api/docs/pricing) 费用，适用于在 2026-03-05 或之后发布且符合数据驻留条件的模型。

### 数据驻留是如何运作的？

当你的账号启用数据驻留后，你可以为你账号下创建的新项目设置一个地区，设置时可以从下方列出的可用地区中选择。如果你使用下方列出的受支持端点、模型和快照，则该项目下的客户内容（依据你所签署的服务协议中的定义）将在所选地区静态存储，前提是该端点需要数据持久化才能正常运行（例如 /v1/batches）。

如果你选择的是下方明确标注支持区域处理（regional processing）的地区，服务还会在所选地区内对你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选地区之外进行处理和存储。系统数据是指由服务收集、用于管理和运营服务、并且不包含客户内容的账号数据、元数据和使用数据，例如账号信息或直接访问服务的最终用户（例如你的员工）的资料、分析数据、使用统计、计费信息、支持请求以及结构化输出 schema。

### 子处理商与区域请求处理

OpenAI 使用 [子处理者](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内进行。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施在访问服务时的所在地而导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的各方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果您所选的区域不支持区域化处理（详见下文），OpenAI 也可能在区域之外处理并临时存储客户内容，以提供服务。

### 非美国地区的额外要求

若要将数据驻留用于美国以外的任何区域，你必须获得滥用监控控制审批，并签署一份经修订的保留条款修正案。

选择阿拉伯联合酋长国区域需要额外审批。请联系 [sales](https://openai.com/contact-sales) 获取协助。

### 如何使用数据驻留

数据驻留按项目在 API 组织内进行配置。

若要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域前缀为每个请求添加前缀。

#### 为每个请求选择处理区域

除了创建特定区域的项项目之外，你也可以通过使用带有前缀的域名，对单个请求选择区域处理，并使用来自 Global 地理区域的项项目的 API 密钥。

现有的资格要求与数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

下面的示例在 Global 项项目中复用同一个客户端和 API 密钥，分别用于 Global、US 和 EU 请求：

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

以下模型和API 服务目前可在下方指定区域使用数据驻留。

使用 **按区域分类的支持** 来比较各区域的能力，并扩展每个区域中可用的服务。使用 **API 端点、工具和模型支持** 获取完整的模型列表以及详细的服务视图。支持区域存储并不意味着支持区域处理。

#### 按地区提供支持

以下是完整的、未经过滤的区域支持表。每个服务的模型快照列在 **API 端点、工具和模型支持**。中。当区域处理仅支持部分快照时，该子集包含在 processing-services 单元格中。

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
| 阿联酋\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                                           | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                                                  |

\* 这些区域中的图像支持需要获得增强型零数据保留或增强型滥用监控修订版的审批。

\*\* 需要零数据保留、滥用监控修订版、 Eyes Off 或安全保留。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型与快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 区域处理快照例外                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | Audio            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | Batches          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | Supported when used with base64 file uploads.                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | MCP servers are third-party services. Data sent to an MCP server is subject to its data residency policies. |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国区域无法设置 store=true。
- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- 无法在 EU 区域设置 background=True。
- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/live/sessions

GPT-Live 会话可启用零数据保留（Zero Data Retention）。启用零数据保留后， `store` 将被视为 `false`，即使请求将其设置为 `true`.

会话存储默认处于禁用状态。对于启用了会话存储的项目， `store: true` 会保留已完成的会话录制 30 天，以便下载或用于启动一个分支会话。已存储的会话及其索引会在 30 天后过期。录制内容的下载和分支需要允许持久化的数据策略，并且在使用 Zero Data Retention 时不可用。

设置 `store: false` 在 fork 上开启该设置可阻止新会话的存储；但不会删除源录制，也不会移除读取该录制所需的授权。API 不提供公开的已存储会话删除接口。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具各自具备独立的数据控制方式；请参阅本页中相关接口和功能的说明。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求 `/v1/realtime`.

## Enterprise Key Management (EKM)

企业密钥管理（Enterprise Key Management，EKM）允许你使用由你自己的外部密钥管理系统（Key Management System，KMS）托管的密钥，对 OpenAI 上的客户内容进行加密。

配置完成后，EKM 将应用于你在使用该平台期间创建的任意 [应用状态](#types-of-data-stored-with-the-openai-api) 。请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商集成。

### EKM 限制

OpenAI 支持通过 AWS KMS、Google Cloud（GCP）和 Azure Key Vault 中的外部账户进行自带密钥（BYOK）加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，以便与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些接口将返回错误。

- Assistants (/v1/assistants)
- 视觉微调