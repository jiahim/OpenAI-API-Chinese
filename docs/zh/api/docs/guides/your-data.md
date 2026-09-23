# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何进行控制。

你的数据归你所有。自 2023-03-01 起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 使用 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 使用平台时生成的日志，对于 OpenAI 执行我们的 [使用政策](https://openai.com/policies/usage-policies) 及协议并减少 AI 的滥用情况是必要的。
- **应用状态：** 为完成某项任务或请求而从部分 API 功能中持久化保存的数据。

## 滥用监测的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从该客户内容派生的元数据，例如分类器的输出。默认情况下，滥用监控日志会针对所有 API 功能使用情况生成，并保留最长 30 天，除非法律要求更长的保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在遵守下列限制的前提下，通过获批启用 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制，将其客户内容从这些滥用监控日志中排除。目前，这些控制须事先获得 OpenAI 的批准并接受额外要求。经批准的客户可为其 API 组织或项目在修改后的滥用监控与零数据保留之间进行选择。

启用修改后的滥用监控或零数据保留的客户负责确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律项下的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以详细了解这些方案并咨询资格要求。

### 修改后的滥用监控

Modified Abuse Monitoring 会从所有 接口 端点的滥用监控日志中排除客户内容（在极少数情况下，图像和文件输入除外，详见下文 [下文](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍允许客户使用 API 的全部功能以及整个 OpenAI 平台的能力。

### Zero Data Retention

Zero Data Retention 与 Modified Abuse Monitoring 一样，将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会改变某些端点的行为： `store` 参数在 `/v1/responses` 和 `v1/chat/completions` 中将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为变更外，下表中被标记为 Zero Data Retention Eligible 为 No 的端点和功能仍可能存储应用状态，即使已启用 Zero Data Retention。

### 通过 Private Safety Processing 实现零数据保留

[Zero Data Retention with Private Safety Processing](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据留存保护的同时执行自动安全监控。本页所列的端点和功能限制仍然适用。

使用 Zero Data Retention with Private Safety Processing 的客户必须配置客户可控存储，并满足 [Zero Data Retention with Private Safety Processing (PSP) guide](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### 使用私有保留与私有安全处理（前称 Eyes Off）

对于获得零数据留存或修改后的滥用监测批准的客户，我们保留将特定客户的模型排除在零数据留存或修改后的滥用监测之外的权利，我们会提前书面通知受影响的客户。在此情况下，客户内容将保留在OpenAI管理的基础设施内的加密滥用监测日志中，但除非适用法律要求，否则该内容将被排除在人工审查之外。更多信息，请参阅 [Private Safety Processing 技术白皮书](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署OpenAI商业伙伴及医疗保健附录的客户，在为你的组织 ID 配置具备 Private Safety Processing 的 Private Retention 后，即使数据被留存，BAA 适用的端点也可用于处理 PHI。本页面列出的端点和功能限制仍然适用。

### 安全保留

对于获准使用零数据保留或修改后滥用监控的客户，如果我们合理认为有必要调查或防范严重风险活动，我们保留针对特定客户使相关模型不再符合零数据保留或修改后滥用监控条件的权利，并会提前书面通知受影响的客户。在此情况下，当使用这些模型时，如果我们内部的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您的协议，我们可能会保留这些客户内容并进行人工审核。否则保留策略不受影响。对于已签署 OpenAI 商业伙伴及医疗保健附录的客户，一旦为您的组织 ID 配置了安全保留，即使数据被保留，符合 BAA 条件的端点也可用于处理 PHI。

### 配置数据保留控制

在你的组织获得数据保留控制功能批准后，你将在 **数据保留** 标签页中看到 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention). 从该标签页中，你可以在组织层级和项目层级配置数据保留控制。

- **组织级控制：** 在整个组织中选择零数据保留 (Zero Data Retention) 或修改后的滥用监控 (Modified Abuse Monitoring)。
- **项目级控制：** 为每个项目选择 `default` 以继承组织级设置，明确选择零数据保留 (Zero Data Retention) 或修改后的滥用监控 (Modified Abuse Monitoring)，或选择 **None** 以对该项目禁用这些控制。

### 每个接口的存储要求和保留控制

下表说明了每个接口在哪些情况下会存储应用状态。符合零数据保留资格的接口不会保留任何客户的应用状态内容，但仍受下文所述限制的约束。不符合零数据保留资格的接口或能力在使用时可能会保留应用状态，即使你已启用零数据保留也是如此。

| Endpoint                   | Data used for training | Abuse monitoring retention |  Application state retention   |  Zero Data Retention eligible  | Private Retention with PSP and Safety Retention eligible |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，存在限制，详见下文 |              是，存在限制，详见下文              |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，存在限制，详见下文 |              是，存在限制，详见下文              |
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
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，存在限制，详见下文 |                            否                            |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，存在限制，详见下文 |                            否                            |
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
| `/v1/live/sessions`        |           否           |          30 天           |   无，若存储则为 30 天   |  是，存在限制，详见下文   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                            否                            |

#### `/v1/chat/completions`

- 音频输出的应用状态会保存 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 用于控制最小缓存生命周期，而不是此最大应用状态保留时长。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文另有说明外，Responses API 默认具有 30 天的应用状态保留期，或当 `store` 参数设置为 `true`。时，响应数据将至少存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘约 10 分钟，以便进行轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强型 Modified Abuse Monitoring，在 `store` 被省略或设置为 `true`。仅当请求明确设置 `store=true`。如果 `store` 被省略或设置为 `false` 对于后台请求，响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会保存 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [remote MCP server tool](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）属于第三方服务，发送至 MCP 服务器的数据遵循其数据保留策略。
- 由以下功能使用的托管容器 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 在容器处于活动状态期间，可能会将临时应用状态写入容器文件系统（由临时块存储提供支持）。容器数据会在容器到期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及之后的模型系列， `prompt_cache_options.ttl` 用于控制最小缓存生命周期，而不是此最大应用状态保留时长。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用零数据保留时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于服务端压缩，不会保留任何数据，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 提供两种形式，分别是本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间保持可用，并在容器到期或被删除时被丢弃。
- 通过网络连接传输至第三方服务的数据遵循其数据保留策略。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或控制面板删除它们 30 天后从我们的服务器上删除。未通过 API 或控制面板删除的对象将被无限期保留。

#### `/v1/images`

- 使用以下方式时，图像生成符合零数据保留要求 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或控制面板手动删除文件，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，会在处理过程中将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，之后再保留 30 天用于滥用监控。 `v1/videos` 目前对 MAM 或 ZDR 请求被阻止。如果你的组织已启用数据保留控制，请配置一个项目，将其保留设置设为 **None** ，详见 [配置数据保留控制](#configuring-data-retention-controls) ，以使用 `/v1/videos` 该项目。

#### 图像和文件输入

可以将图像和文件作为输入上传至 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，并且 `/v1/images`。图像和文件输入在提交时会经过 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，该图像将被保留以供人工审核，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或 Private Retention with PSP。

#### 网页搜索

具有实时互联网访问的网页搜索不符合 HIPAA 要求，且不在 BAA 覆盖范围内。仅在离线/仅缓存模式下使用网页搜索（`external_web_access: false`）时，如果配合来自启用 ZDR 的组织内 ZDR 项目的 API 密钥使用，则有资格纳入 BAA 覆盖范围。此 HIPAA/BAA 指引仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的所在基础架构位置。

请联系我们 [销售团队](https://openai.com/contact-sales) 以确认你是否有资格使用数据驻留控制。使用数据驻留端点将收取 [10% 的附加费用](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布且符合数据驻留资格的模型。

### 数据驻留机制是如何运作的？

当你的账户启用了数据驻留功能时，你可以为你在账户中创建的新项目设置一个区域，可选的区域如下所列。如果你使用下方列出的受支持的端点、模型和快照，该项目的客户内容（定义见你的服务协议）将在所选区域静态存储，前提是该端点需要数据持久化才能运行（例如 /v1/batches）。

如果你选择的支持区域处理的区域（具体如下方所示），服务还将在所选区域内对你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外进行处理和存储。系统数据是指不包含客户内容的账户数据、元数据和使用数据，这些数据由服务收集并用于管理和运营服务，例如直接访问服务的终端用户（例如你的员工）的账户信息或档案、分析、使用统计、账单信息、支持请求和结构化输出架构。

### 子处理方与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便在所选的处理区域内完成 TLS 终止和 HTTPS 解密。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施在访问服务时的所在地而导致客户内容在所选区域之外的任何传输或存储；(2) 通过服务由 OpenAI 以外的各方提供的产品、服务或内容；或 (3) 客户内容之外的任何数据，例如系统数据。

如果你所选的区域不支持区域处理（详见下文），OpenAI 也可能在区域之外处理并临时存储客户内容，以提供服务。

### 非美国地区的额外要求

若要在美国以外的任何区域使用数据驻留（data residency），你必须获得滥用监控控制（abuse monitoring controls）的批准，并签署一份修改后的保留期（Modified Retention）修订协议。

选择阿拉伯联合酋长国区域需要额外的审批。请联系 [sales](https://openai.com/contact-sales) 获取协助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目的请求，请按照下表定义的域名前缀，为每个请求添加该前缀。

#### Select a processing region per request

除了创建特定区域的请求外，你还可以通过使用来自具有 Global 地理属性的项目中的 API 密钥配合此前缀域名，为单个请求选择区域化处理。

现有的资格和数据留存控制要求仍然适用。所选端点和模型也必须支持区域化处理，如下表所示。

以下示例在 Global 项目中复用同一个客户端和 API 密钥，分别用于 Global、US 和 EU 请求：

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


### 哪些模型和功能支持数据驻留？

以下模型和 API 服务在下方指定区域目前支持数据驻留。

使用 **各区域支持情况** 来比较各区域的能力，并扩展每个区域可用的服务。使用 **API 端点、工具和模型支持** 查看完整的模型列表和详细的服务视图。支持区域存储并不意味着支持区域处理。

对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Responses 和 Chat Completions 的 Standard 处理下可用。

#### 按地区提供支持

下面是完整、未经过滤的区域支持表。每个服务的模型快照列于 **API 端点、工具和模型支持**.当区域处理仅支持快照的子集时,该子集包含在处理服务单元格中。

| 区域                     | 域前缀       | 区域存储 | 区域处理 | 是否需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
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

\* 这些区域的图像支持需要获得"增强型 Zero Data Retention"或"增强型 Modified Abuse Monitoring"的批准。

\*\* 需要 Zero Data Retention、Modified Abuse Monitoring、带 PSP 的 Private Retention 或 Safety Retention。

#### API 端点、工具和模型支持

| 接口或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 区域处理快照例外                                                                                                                                                           | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲 (EEA + 瑞士)： `gpt-6-sol` 或 `gpt-6-luna`: 仅 Standard 处理                                                                                                                 | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)、阿联酋 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 欧洲 (EEA + 瑞士)： `gpt-6-sol` 或 `gpt-6-luna`: 仅 Standard 处理<br />阿联酋： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)、阿联酋 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 阿联酋： `text-embedding-3-large`                                                                                                                                                    | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲 (EEA + 瑞士) | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/live/sessions`                                                  | GPT-Live         | 美国、欧洲 (EEA + 瑞士) | 美国、欧洲 (EEA + 瑞士)                       | `gpt-live-1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲 (EEA + 瑞士) | 美国、欧洲 (EEA + 瑞士)                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲 (EEA + 瑞士) | 美国、欧洲 (EEA + 瑞士)                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲 (EEA + 瑞士) | 美国、欧洲 (EEA + 瑞士)                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)、阿联酋 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲 (EEA + 瑞士)： `gpt-6-sol` 或 `gpt-6-luna`: 仅 Standard 处理<br />阿联酋： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | 对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | Supported when used with base64 file uploads.                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | MCP servers are third-party services. Data sent to an MCP server is subject to its data residency policies. |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | Service-level support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲 (EEA + 瑞士)                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                                                                                                              | —                                                                                                           |



### Endpoint limitations

#### /v1/chat/completions

- 无法在非美国地区设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在区域外处理并临时存储客户内容以提供服务。

#### /v1/responses

- 无法在 EU 区域设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在区域外处理并临时存储客户内容以提供服务。

#### /v1/live/sessions

GPT-Live 会话符合零数据保留条件。启用零数据保留后， `store` 将被视为 `false`，即使请求将其设置为 `true`.

会话存储默认处于禁用状态。对于已启用会话存储的项目， `store: true` 会将已完成的会话录制保留 30 天，以便下载或用于启动分叉会话。已存储的会话及其索引会在 30 天后过期。录制下载和分叉需要允许持久化的数据策略，并且在 Zero Data Retention 下不可用。

Setting `store: false` 在分叉上设置可阻止存储新会话；它不会删除源录制，也不会移除读取该录制所需的授权。API 不提供公共的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具有各自的数据控制方式；请查看本页中适用的端点和功能条目。

#### /v1/realtime

追踪目前不符合 EU 数据驻留要求 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) 允许你使用由你自己的外部 Key Management System (KMS) 管理的密钥，对 OpenAI 中的客户内容进行加密。

配置完成后，EKM 会应用于你在使用该平台期间创建的任何 [application state](#types-of-data-stored-with-the-openai-api) 。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成的更多信息，请参阅 [EKM help center article](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户的 BYOK（自带密钥）加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，以便与 OpenAI 一起使用。

EKM 不支持以下产品。在启用了 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants (/v1/assistants)
- Vision 微调