# OpenAI 平台中的数据控制

> 完整文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾追加 `.md` 。

了解 OpenAI 如何使用你的数据，以及你如何控制其使用方式。

你的数据归你所有。自 2023 年 3 月 1 日起，发送至 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择加入并同意与我们共享数据）。

## OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 你使用平台时产生的日志，OpenAI 依赖这些日志来执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和相关协议，并减少有害的 AI 使用行为。
- **应用状态：** 由部分 API 功能持久化保存的数据，用于完成任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含部分客户内容，例如提示和响应，以及由该客户内容衍生的元数据，例如分类器输出。默认情况下，所有 API 功能使用都会生成滥用监控日志，并保留最长 30 天，除非法律要求更长的保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可以在获得以下控制项批准后，使其客户内容免于纳入这些滥用监控日志，但须遵守下述限制： [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制。目前，这些控制项须事先获得 OpenAI 的批准并接受附加要求。经批准的客户可在其 API 组织或项目中选择修改后的滥用监控或零数据保留。

启用修改后的滥用监控或零数据保留的客户须负责确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律下的任何审核与报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以详细了解这些产品并咨询资格要求。

### 修改后的滥用监控

修改后的滥用监控会在所有 API 端点上排除客户内容（极少数情况下的图像和文件输入除外，如下文所述），同时仍允许客户充分利用 OpenAI 平台的全部功能。 [below](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)) from abuse monitoring logs across all 接口 endpoints, while still allowing the customer to take advantage of the full capabilities of the 该公司 platform.

### Zero Data Retention

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会更改某些端点行为： `store` 参数用于 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为更改之外，下表中列为 Zero Data Retention 不符合资格的端点和功能仍可能存储应用状态，即使已启用 Zero Data Retention。

### Eyes Off

对于获批使用零数据留存或修改版滥用监控的客户，我们保留在提前书面通知受影响客户后，使特定客户的模型不再符合零数据留存或修改版滥用监控条件的权利。在此情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则该内容将不会被人工审阅。对于已签署 OpenAI 商业伙伴协议及医疗保健附录的客户，一旦你的组织 ID 配置了 Eyes Off，即使数据被留存，也可使用符合 BAA 条件的端点处理 PHI。

### 安全保留

对于获准使用零数据留存或修改后滥用监控的客户，如果我们合理认为有必要调查或预防严重风险活动，我们保留将特定客户的模型排除在零数据留存或修改后滥用监控范围之外的权利，并将提前书面通知受影响的客户。在此情况下，当我们使用这些模型时，对于我们的分类器检测出可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您协议的客户内容，我们可能会留存并进行人工审核。除此之外，客户的留存将不受影响。对于已签署 OpenAI 商业伙伴与医疗保健附录（BAA）的客户，在为您的组织 ID 配置安全留存后，即使数据会被留存，也可使用符合 BAA 资格的端点处理 PHI。

### 配置数据保留控制

当你的组织已获批使用数据保留控制后，你会在 **数据保留** 选项卡中看到相关功能，位置在 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该选项卡中，你可以在组织和项目两个层级配置数据保留控制。

- **组织级控制：** 在整个组织中选择零数据留存或修改后的滥用监控。
- **项目级控制：** 为每个项目，选择 `default` 以继承组织级设置，明确选择零数据留存或修改后的滥用监控，或选择 **None** 以禁用该项目的这些控制。

### 各端点的存储要求与保留控制

下表说明了各端点存储应用状态的情况。符合 Zero Data Retention 条件的端点不会保留任何客户内容用于应用状态，但仍受下方限制条款的约束。不符合 Zero Data Retention 条件的端点或能力在使用时可能会保留应用状态，即使你已经启用 Zero Data Retention。

| 端点                   | 用于训练的数据 | 滥用监控保留期 |  应用状态保留期   |  符合零数据保留条件  | 符合无人值守和安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/conversations`        |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/conversations/items`  |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
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
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                   否                   |

#### `/v1/chat/completions`

- 音频输出应用状态会存储 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 另请参阅 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量存储在 GPU 本地存储中作为应用状态。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 到 `in_memory` 时返回错误。对于 GPT-5.6 及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这里的最大应用状态保留时长。更多信息请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，否则 Responses API 默认具有 30 天的应用状态保留时长，或者在 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘约 10 分钟，以便支持轮询。对于使用 [修改后的滥用监控](#modified-abuse-monitoring)，的项目，包括增强型修改后的滥用监控，在以下情况下前台请求遵循标准保留时长： `store` 被省略或设置为 `true`. 后台响应仅在请求明确设置 `store=true`。时遵循标准保留期。如果 `store` 被省略或设置为 `false` 用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出应用状态会存储 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 另请参阅 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [remote MCP server tool](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）属于第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 以下使用的托管容器 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 在容器处于活动状态时，可能会将临时应用状态写入容器文件系统（由临时块存储支持）。容器数据会在容器到期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量存储在 GPU 本地存储中作为应用状态。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 到 `in_memory` 时返回错误。对于 GPT-5.6 及之后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是这里的最大应用状态保留时长。更多信息请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用 Zero Data Retention 时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于服务端压缩，在以下情况下不会保留任何数据 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 采用两种形态，包括本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态时保持可用，并在容器到期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或控制面板删除它们 30 天后从我们的服务器中删除。未通过 API 或控制面板删除的对象将无限期保留。

#### `/v1/images`

- 在使用以下 接口 时，图像生成与零数据保留兼容： `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 文件可以通过 API 或控制面板手动删除，也可以通过设置以下参数自动删除： `expires_after` 参数。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，会在处理过程中将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，然后再保留 30 天用于滥用监控。 `v1/videos` 目前对 MAM 或 ZDR 请求是被阻止的。如果你的组织已启用数据保留控制，请按照以下说明配置一个项目，将其保留设置为 **None** 如 [配置数据保留控制](#configuring-data-retention-controls) 中所述，使用 `/v1/videos` 配合该项目。

#### 图像和文件输入

图像和文件可以作为输入上传至 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图像和文件输入在提交时会扫描 CSAM 内容。如果分类器检测到潜在的 CSAM 内容，该图像将被保留以供人工审查，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或 Eyes Off。

#### Web Search

具有实时互联网访问的网页搜索不符合 HIPAA 要求，也无法被 BAA 覆盖。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在使用来自 ZDR 组织内启用了 ZDR 的项目的 API 密钥时，符合被 BAA 覆盖的条件。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的所在基础设施位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，以确认你是否有资格使用数据驻留控制。使用数据驻留端点的费用会收取 [10% 的溢价](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布且符合数据驻留条件的模型。

### 数据驻留是如何运作的？

当你的账号启用了数据驻留（data residency）后，你可以从下方列出的可用区域中，为你在账号中新创建的项目设置一个区域。如果使用下方列出的受支持的端点、模型和快照，则该项目相关的客户内容（按服务协议中的定义）将在所选区域内静态存储，前提是该端点为实现功能而需要数据持久化（例如 /v1/batches）。

如果你选择的支持区域（regional processing），具体见下方说明，服务也将在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，这些数据可能会在所选区域之外进行处理和存储。系统数据是指不包含客户内容的账号数据、元数据和使用数据，这些数据由服务收集并用于管理和运营服务，例如账号信息或直接访问服务的最终用户（例如你的员工）的档案、分析、使用统计、计费信息、支持请求和结构化输出架构。

### 子处理者与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便在所选的处理区域内完成 TLS 终止和 HTTPS 解密。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施所在位置而导致的在所选区域之外传输或存储客户内容；(2) 由 OpenAI 以外的各方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果您所选的区域不支持如下所述的区域处理，OpenAI 也可能在区域之外处理并临时存储客户内容，以提供相关服务。

### 非美国地区的其他要求

要将数据驻留应用于美国以外的任何区域，你必须获得滥用监控控制的批准，并签署一份修订后的保留条款（Modified Retention）。

选择阿拉伯联合酋长国区域需要获得额外批准。请联系 [sales](https://openai.com/contact-sales) 获取帮助。

### 如何使用数据驻留

数据驻留按项目在你API 组织内进行配置。

若要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域前缀为每个请求添加前缀。

#### 按请求选择处理区域

除了创建特定区域的项目外，你还可以通过使用带有来自具有 Global 地理位置的项目的 API 密钥的加前缀域名，为单个请求选择区域处理。

现有的资格和数据保留控制要求仍然适用。所选端点和模型也必须支持区域处理，如下表所示。

以下示例在 Global 项目中复用同一个客户端和同一把 API 密钥，分别用于 Global、US 和 EU 请求：

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


### 哪些模型和功能有资格获得数据驻留？

以下模型和 API 服务目前可在下方指定区域内使用数据驻留。

使用 **按区域支持** 来比较各区域能力并扩展每个区域内可用的服务。请使用 **API 端点、工具与模型支持** 获取完整的模型列表和详细的服务视图。支持区域存储并不意味着支持区域处理。

#### 按地区支持情况

下面列出完整且未筛选的区域支持表。每个服务的模型快照列于 **API 端点、工具与模型支持**。当区域处理仅支持部分快照时，该子集会包含在处理服务单元格中。

| 区域                     | 域名前缀       | 区域存储 | 区域处理 | 是否需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       是        |         是         |         否          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲（EEA + 瑞士） | `eu.api.openai.com` |       是        |         是         |       是\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 加拿大\*                   | `ca.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 日本\*                    | `jp.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 印度\*                    | `in.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 新加坡\*                | `sg.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 韩国\*              | `kr.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 英国\*           | `gb.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 阿联酋\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                         |

\* 这些区域的图像支持需要获得增强版零数据留存或增强版修改后滥用监控的批准。

\*\* 需要零数据留存、修改后滥用监控、闭眼或安全留存。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型与快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 区域处理快照例外                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | Audio            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | Batches          | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国: `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 阿拉伯联合酋长国: `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲(EEA + 瑞士) | 美国、欧洲(EEA + 瑞士)                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国: `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | 在使用 base64 文件上传时受支持。                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略约束。 |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理功能的地区，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供相应服务。

#### /v1/responses

- 在 EU 区域无法设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理功能的地区，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供相应服务。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求， `/v1/realtime`.

## 企业密钥管理 (EKM)

Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对在 OpenAI 上的客户内容进行加密。

配置完成后，EKM 将作用于在使用平台过程中创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成的更多信息，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud（GCP）和 Azure Key Vault 中使用外部账户自带密钥（BYOK）加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，以便与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些接口将返回错误。

- Assistants (/v1/assistants)
- 视觉微调