# OpenAI 平台中的数据控制

> 完整的文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 即可。

了解 OpenAI 如何使用你的数据，以及你可以如何进行控制。

你的数据归你所有。自 2023 年 3 月 1 日起，发送到 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 通过 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 你在使用平台时产生的日志，OpenAI 需要这些日志来执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和相关协议，并减少 AI 的有害使用。
- **应用状态：** 某些 API 功能为完成任务或请求而持久保存的数据。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含特定的客户内容，例如提示和响应，以及从这些客户内容中衍生的元数据，例如分类器的输出。默认情况下，所有 API 功能使用都会生成滥用监控日志，并保留最长 30 天，除非法律要求延长保留期，或为保护我们的服务或任何第三方免受伤害而合理需要延长保留期。

符合条件的客户可在遵守下文限制的前提下，通过申请获批 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制，将其客户内容排除在这些滥用监控日志之外。目前，这些控制需事先获得 OpenAI 的批准，并接受额外的条件。已获批准的客户可为其 API 组织或项目在修改后的滥用监控与零数据保留之间进行选择。

启用修改后的滥用监控或零数据保留的客户应负责确保其用户遵守 OpenAI 安全和负责任地使用 AI 的政策，并遵守适用法律下的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，以详细了解这些方案并咨询资格条件。

### Modified Abuse Monitoring

经修改的滥用监控会从所有 API 端点的滥用监控日志中排除客户内容（如罕见情况下的图像和文件输入，具体见 [下文](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍允许客户使用 OpenAI 平台的全部功能。

### 零数据保留

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会更改某些端点的行为： `store` 参数对应 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求试图将该值设置为 `true`.

除了这些特定的行为更改外，下表中被列为不符合 Zero Data Retention 资格的端点和功能可能仍会存储应用状态，即使已启用 Zero Data Retention。

### Eyes Off

对于获得零数据留存或改进版滥用监控批准的客户，我们保留根据事先书面通知受影响客户的方式，使特定客户的模型不符合零数据留存或改进版滥用监控条件的权利。在此情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则该等内容将不被人工审阅。对于已签署 OpenAI 商业伙伴与医疗保健附录的客户，一旦你的组织 ID 配置 Eyes Off 后，符合 BAA 条件的端点可用于处理 PHI，即使数据被保留。

### 安全保留

对于获批采用零数据保留或修改版滥用监控的客户，如果我们合理认为有必要调查或预防严重风险活动，我们保留将特定客户的特定模型排除在零数据保留或修改版滥用监控范围之外的权利，并会事先书面通知受影响的客户。在这种情况下，当使用这些模型时，如果我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或你签署的协议，我们可以保留这些客户内容并进行人工审核。否则，保留政策不会受到影响。对于已签署 OpenAI 业务关联方与医疗保健附录的客户，在为你的组织 ID 启用安全保留后，即使数据被保留，也可使用符合 BAA 资格的端点来处理 PHI。

### 配置数据保留控制

一旦你的组织获批使用数据保留控制功能，你将在 **数据保留** 标签页中看到，该标签页位于 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目级别配置数据保留控制。

- **组织级控制：** 在整个组织中选择 Zero Data Retention 或 Modified Abuse Monitoring。
- **项目级控制：** 对于每个项目，选择 `default` 以继承组织级设置，明确选择 Zero Data Retention 或 Modified Abuse Monitoring，或选择 **None** 以禁用该项目的这些控制。

### 每个接口的存储要求和留存控制

下表指明了每个接口在何时存储应用状态。符合零数据留存资格的接口不会为应用状态保留任何客户内容，但受以下限制约束。不符合零数据留存资格的接口或能力在使用时可能会保留应用状态，即便你已启用零数据留存也是如此。

| Endpoint                   | 用于训练的数据 | 滥用监控保留 |  应用状态保留   |  符合零数据保留条件  | 符合 Eyes Off 与安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |     是，限制见下文     |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |     是，限制见下文     |
| `/v1/conversations`        |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/conversations/items`  |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/assistants`           |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads`              |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/messages`     |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/runs`         |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/vector_stores`        |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制见下文 |                   否                   |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制见下文 |                   否                   |
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
| `/v1/live/sessions`        |           否           |          30 天           |   无；若存储则为 30 天   |  是，存在以下限制   |                   否                   |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                   否                   |

#### `/v1/chat/completions`

- 音频输出的应用状态会保留 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- Prompt caching 可能将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是此最长应用状态保留期。了解更多信息，请参阅 [prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，Responses API 的应用状态默认保留 30 天，或当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘大约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，当 `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。时遵循标准保留期。如果 `store` 被省略或设置为 `false` 适用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会保留 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）是第三方服务，发送给 MCP 服务器的数据受其数据保留策略约束。
- 以下托管容器所使用的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 在容器处于活动状态时，可能会将临时应用状态写入容器文件系统（由临时块存储支持）。当容器过期或被显式删除时，容器数据也会被删除。
- Prompt caching 可能将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是此最长应用状态保留期。了解更多信息，请参阅 [prompt caching 指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当未为组织启用零数据保留时，所有查询都会对所有支持的模型使用扩展的提示词缓存。
- 对于服务端压缩， `store="false"`.
- 我们支持 [技能](https://developers.openai.com/api/docs/guides/tools-skills) 的两种形态，即本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态时保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或控制面板删除它们 30 天后从我们的服务器上删除。通过 API 或控制面板未删除的对象将被无限期保留。

#### `/v1/images`

- 在使用以下模式时，图像生成与零数据保留兼容： `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或控制面板手动删除文件，也可以通过设置 `expires_after` 参数自动删除文件。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，会在处理时将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，随后保留 30 天用于滥用监控。 `v1/videos` 目前对 MAM 或 ZDR 请求被阻止。如果你的组织已启用数据保留控制，请配置一个项目，将其保留设置设为 **None** ，如 [配置数据保留控制](#configuring-data-retention-controls) 中所述，以使用 `/v1/videos` 配合该项目。

#### 图像与文件输入

可将图像和文件作为输入上传至 `/v1/responses` （包括在使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图像和文件输入在提交时会接受 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，该图像将被保留以供人工审核，即使已启用零数据留存 (Zero Data Retention)、修订后的滥用监控 (Modified Abuse Monitoring) 或 Eyes Off 也是如此。

#### 网页搜索

具有实时互联网访问的网页搜索不符合 HIPAA 要求，也无法纳入 BAA 覆盖范围。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在 ZDR 组织内使用 ZDR 启用项目的 API 密钥时，符合纳入 BAA 覆盖的条件。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` 等于 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的所在地区。

联系我们的 [销售团队](https://openai.com/contact-sales) 以了解你是否有资格使用数据驻留控制。使用数据驻留端点的费用将上调 [10%](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布且有资格使用数据驻留的模型。

### 数据驻留是如何运作的？

当你的账号启用了数据驻留（data residency）后，你可以为你账号中新建的项目选择一个区域，可选区域见下方列表。如果你使用下方列出的受支持端点、模型和快照，则该项目下的客户内容（定义见你的服务协议）将在所选区域内静态存储，但仅限于端点为实现其功能所需的数据持久化范围（例如 /v1/batches）。

如果你选择的区域支持区域化处理（具体见下方说明），服务也会在所选区域内对你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外进行处理和存储。系统数据是指不含客户内容的账号数据、元数据和使用数据，这些数据由服务收集并用于管理和运行服务，例如账号信息或直接访问服务的最终用户（例如你的员工）的档案、分析、使用统计、计费信息、支持请求以及结构化输出 schema。

### 子处理者与区域请求处理

OpenAI 使用 [子处理者](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内进行。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施在访问服务时的所在地而导致客户内容在所选区域之外的任何传输或存储；(2) 通过服务由 OpenAI 以外的各方提供的产品、服务或内容；或 (3) 客户内容之外的任何数据，例如系统数据。

如果您选择的区域不支持区域处理（如下所述），OpenAI 也可能在区域之外处理和临时存储客户内容，以提供相应服务。

### 非美国地区的其他要求

要将数据驻留与美国以外的任何区域配合使用，你必须获得滥用监控控制的批准，并签署一份修改后的保留期限修正案。

选择阿拉伯联合酋长国区域需要额外的审批。请联系 [sales](https://openai.com/contact-sales) 以获取协助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域名前缀添加到每个请求中。

#### Select a processing region per request

除了创建特定区域的智能体之外，你还可以通过使用来自具有 Global 地理设置的智能体的 API 密钥配合前缀域名的方式，为单个请求选择区域处理。

现有的资格要求和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

以下示例针对 global、US 和 EU 请求，复用了同一个客户端以及来自 Global 智能体的 API 密钥：

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


### 哪些模型和功能符合数据驻留的条件？

以下模型和 API 服务目前可在下方指定的数据驻留区域使用。

使用 **按区域支持情况** 以比较各区域的可用能力并扩展每个区域提供的服务。使用 **API 端点、工具和模型支持** 以获取完整的模型列表和详细的服务视图。区域存储的支持并不意味着区域处理也受支持。

#### 按地区提供支持

完整的、未经过筛选的区域支持表如下。每个服务的模型快照列于 **API 端点、工具和模型支持**。当区域处理仅支持部分快照时，该子集包含在处理服务单元格中。

| 地区                     | 域名前缀       | 区域存储 | 区域处理 | 是否需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
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

\* 这些区域的图像支持需要获得增强型零数据保留或增强型修改后滥用监控的批准。

\*\* 需要零数据保留、修改后滥用监控、Eyes Off 或安全保留。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型及快照版本                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 区域处理快照例外情况                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | Batches          | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（欧洲经济区 + 瑞士） | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲（欧洲经济区 + 瑞士） | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（欧洲经济区 + 瑞士） | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（欧洲经济区 + 瑞士） | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（欧洲经济区 + 瑞士） | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | Supported when used with base64 file uploads.                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | MCP servers are third-party services. Data sent to an MCP server is subject to its data residency policies. |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能要求 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- 无法在欧盟地区设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能要求 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/live/sessions

GPT-Live 会话符合零数据保留的资格。启用零数据保留后， `store` 将被视为 `false`，即使请求将其设置为 `true`.

会话存储默认处于禁用状态。对于启用了会话存储的项目， `store: true` 会将已完成的会话录音保留 30 天，以便下载或用于开启一个分支会话。已存储的会话及其索引会在 30 天后过期。录音下载和分支功能需要允许持久化的数据策略，在 Zero Data Retention 下不可用。

设置 `store: false` 为 on 的分支会话不会存储新会话，但不会删除源录音，也不会移除读取该录音所需的授权。该 API 未提供公开的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。受委托的后端模型和工具各自拥有独立的数据控制方式；请参阅本页中相应的端点和功能条目。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求 `/v1/realtime`.

## 企业密钥管理 (EKM)

Enterprise Key Management (EKM) 允许你使用你自己的外部密钥管理系统 (KMS) 来加密 OpenAI 的客户内容。

配置完成后，EKM 会应用于你使用平台过程中创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成的更多信息，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud（GCP）和 Azure Key Vault 中使用外部账户的自带密钥（BYOK）加密。如果你的组织使用的是其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，以便与 OpenAI 一起使用。

EKM 不支持以下产品。尝试在已启用 EKM 的项目中使用这些端点将返回错误。

- Assistants (/v1/assistants)
- 视觉模型微调