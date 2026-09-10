# OpenAI 平台中的数据控制

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 通过 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 你在使用平台过程中产生的日志，OpenAI 需要这些日志来执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和协议，并减少有害的 AI 使用行为。
- **应用状态：** 部分 API 功能为完成任务或请求而持久保存的数据。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从该客户内容衍生的元数据（例如分类器输出）。默认情况下，滥用监控日志会针对所有 API 功能的使用生成，并保留最多 30 天，除非法律要求更长的保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在遵守下文所述限制的前提下，通过获批成为 [Zero Data Retention](#zero-data-retention) 或 [Modified Abuse Monitoring](#modified-abuse-monitoring) 控件的用户，将其客户内容从这些滥用监控日志中排除。目前，这些控件需事先获得 OpenAI 的批准并接受额外要求。已获批准的客户可为其 API 组织或项目在 Modified Abuse Monitoring 与 Zero Data Retention 之间进行选择。

启用 Modified Abuse Monitoring 或 Zero Data Retention 的客户负责确保其用户遵守 OpenAI 关于安全、负责任地使用 AI 的政策，并遵守适用法律规定的任何内容审核与报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以了解有关这些产品的更多信息并咨询资格要求。

### 修改后的滥用监控

修改后的滥用监控会在所有 API 端点的滥用监控日志中排除客户内容（少数情况下的图像和文件输入除外，如 [下方](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)）所述），同时仍允许客户充分利用 OpenAI 平台的全部能力。

### Zero Data Retention

Zero Data Retention 以与 Modified Abuse Monitoring 相同的方式，将客户内容排除在滥用监控日志之外。

此外，Zero Data Retention 会更改某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为更改外，下表中标记为不符合 Zero Data Retention 资格的端点和功能，即使启用了 Zero Data Retention，仍可能存储应用状态。

### Eyes Off

对于获批零数据留存或修改后滥用监控的客户，我们保留按事先书面通知受影响客户的方式，使模型对特定客户不再适用零数据留存或修改后滥用监控的权利。在此情况下，客户内容将被保留在滥用监控日志中，但该等内容将被排除在人工审查之外，除非适用法律要求。对于已签署 OpenAI 商业伙伴协议与医疗保健附录的客户，一旦你的组织 ID 配置 Eyes Off，即使数据被留存，也可使用符合 BAA 条件的端点处理 PHI。

### 安全保留

对于获准使用零数据保留或修改后滥用监控的客户，如果我们合理认为有必要调查或防止严重风险活动，我们保留针对特定客户将模型从零数据保留或修改后滥用监控中排除的权利，并会提前书面通知受影响的客户。在此情况下，当我们使用这些模型时，对于我们的分类器检测到可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您协议的的客户内容，我们可能会保留并人工审查。否则保留将不受影响。对于已签署 OpenAI 业务关联方与医疗保健附录的客户，一旦您的组织 ID 配置了安全保留，即使数据被保留，也可使用符合 BAA 资格的端点来处理 PHI。

### 配置数据保留控制项

当你的组织获批启用数据保留控制后，你将在 **数据保留** 标签页中看到该选项，位置在 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织级别和项目级别配置数据保留控制。

- **组织级控制：** 在整个组织范围内选择零数据留存或修订后的滥用监控。
- **项目级控制：** 针对每个项目，选择 `default` 以继承组织级设置、显式选择零数据留存或修订后的滥用监控，或者选择 **None** 以禁用该项目的这些控制。

### 各端点的存储要求与保留控制

下表指明了每个接口会在何时存储应用状态。符合 Zero Data Retention 资格的接口不会保留任何客户内容用于应用状态，但受下文所述限制的约束。不符合 Zero Data Retention 资格的接口或能力在使用时可能会保留应用状态，即使你已启用 Zero Data Retention。

| 端点                   | 用于训练的数据 | 滥用监控保留期限 |  应用状态保留期限   |  符合零数据保留条件  | 符合 Eyes Off 与安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无,例外情况见下文 | 符合,限制条件见下文 |     符合,限制条件见下文     |
| `/v1/responses`            |           否           |          30 天           | 无,例外情况见下文 | 符合,限制条件见下文 |     符合,限制条件见下文     |
| `/v1/conversations`        |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/conversations/items`  |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/assistants`           |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads`              |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/messages`     |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/runs`         |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/vector_stores`        |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 符合,限制条件见下文 |                   否                   |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 符合,限制条件见下文 |                   否                   |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/files`                |           否           |          30 天           |        直至删除\*         |               否               |                   否                   |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/evals`                |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/batches`              |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                   否                   |

#### `/v1/chat/completions`

- 音频输出的应用状态会保存 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为某个组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及以后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是最长应用状态保留周期。了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文另有说明外，Responses API 的应用状态保留期默认为 30 天，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为某个组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘约 10 分钟，以便支持轮询。对于使用 [修订后的滥用监控](#modified-abuse-monitoring)，的项目，包括增强版修订后的滥用监控，在以下情况下的前台请求遵循标准保留期： `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。如果 `store` 被省略或设置为 `false` 用于后台请求，响应将在临时轮询期结束后被删除。
- 音频输出的应用状态会保存 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）属于第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 由 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器可能会在容器处于活动状态时，将临时应用状态写入容器文件系统（由临时块存储提供支持）。容器数据将在容器到期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及以后的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是最长应用状态保留周期。了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当未为组织启用零数据保留时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于 服务端 压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 提供两种形式，包括本地执行和基于托管容器的执行。托管 Skills 遵循与托管 Shell 相同的容器生命周期：挂载的 Skills 和容器文件在容器处于活动状态期间保持可用，并在容器到期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或仪表板删除它们 30 天后从我们的服务器上删除。未通过 API 或仪表板删除的对象将被无限期保留。

#### `/v1/images`

- 在使用 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，时，图像生成与零数据保留兼容，并且 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或仪表板手动删除文件，也可以通过设置 `expires_after` 参数自动删除文件。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，在处理过程中会将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，之后再保留 30 天用于滥用监测。 `v1/videos` 目前被 MAM 或 ZDR 请求屏蔽。如果你的组织已启用数据保留控制，请按照 **None** 中所述，将项目的保留设置配置为 [配置数据保留控制](#configuring-data-retention-controls) 以使用 `/v1/videos` 该项目。

#### 图像和文件输入

图像和文件可以作为输入上传至 `/v1/responses` （包括在使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图像和文件输入在提交时会经过 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，即使已启用 Zero Data Retention、Modified Abuse Monitoring 或 Eyes Off，该图像仍将被保留以供人工审核。

#### 网页搜索

具有实时联网能力的网页搜索不符合 HIPAA 要求，也无法纳入 BAA 范围。以离线/仅缓存模式（`external_web_access: false`）使用时，如果使用的是来自 ZDR 组织内已启用 ZDR 的项目的 API 密钥，则可以被纳入 BAA 范围。本 HIPAA/BAA 指引仅适用于 Responses API `web_search` 工具。注意：预览版本（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` 为 `true`。我们推荐使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，可用于配置 OpenAI 用于提供服务的础设施所在区域。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，以确认你是否有资格使用数据驻留控制。使用数据驻留端点会产生 [10% 的溢价](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日或之后发布且符合数据驻留条件的模型。

### 数据驻留机制是如何运作的？

当你的账户启用了数据驻留（data residency）时，你可以从下方列出的可用区域中为你账户下创建的新项目设置一个区域。如果你使用下方列出的受支持端点、模型和快照，那么该项目你的客户内容（按服务协议中的定义）在所选区域内静态存储，前提是端点需要数据持久化才能正常运行（例如 /v1/batches）。

如果你选择了下方明确标识的、支持区域处理的区域，服务还会在所选区域内对你的客户内容执行推理。

数据驻留不适用于系统数据，相关信息可能会在所选区域之外被处理和存储。系统数据是指由服务收集、用于管理和运营服务、不包含客户内容的账户数据、元数据和用量数据，例如账户信息或直接访问服务的终端用户（例如你的员工）的资料、分析、用量统计、计费信息、支持请求以及结构化输出 schema。

### 分包处理者与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送到 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便在所选的处理区域内完成 TLS 终止和 HTTPS 解密。

### 限制

数据驻留不适用于：(1) 因最终用户或客户基础设施在访问服务时所处位置而导致的客户内容在所选区域之外的任何传输或存储；(2) OpenAI 以外的其他方通过本服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果你所选的区域不支持区域处理，如下所述，OpenAI 也可能在区域之外处理并临时存储客户内容，以提供服务。

### 非美国地区的额外要求

要在美国以外的任何区域使用数据驻留，你必须获得滥用监控控制方面的批准，并签署一份修改后的保留条款修正案。

选择阿拉伯联合酋长国区域需要额外的批准。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留按项目在你的 API Organization 内进行配置。

若要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域前缀为每个请求添加前缀。

#### 为每个请求选择处理区域

作为创建区域专属项目的替代方案，你也可以通过使用带有前缀的域名，配合来自具有 Global 地理位置的项目的 API 密钥，为单个请求选择区域处理。

现有的资格要求和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

下面的示例对 global、US 和 EU 请求复用了同一个客户端和来自 Global 项目的 API 密钥：

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

以下模型和 API 服务目前可在下方指定区域进行数据驻留。

使用 **区域支持情况** 来比较各区域的可用能力，并查看每个区域所提供的服务。使用 **API 端点、工具及模型支持情况** 查看完整的模型列表及详细服务视图。对区域存储的支持并不代表对区域处理的支持。

#### 按区域提供支持

以下是完整、未经过滤的区域支持表。每个服务的模型快照列在 **API 端点、工具及模型支持情况**。中。当区域处理仅支持快照的子集时，该子集包含在处理服务单元中。

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

\* 这些区域的图像支持需要批准启用增强型 Zero Data Retention 或增强型 Modified Abuse Monitoring。

\*\* 需要 Zero Data Retention、Modified Abuse Monitoring、Eyes Off 或 Safety Retention。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 区域处理快照例外情况                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | Batches          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | 在与 base64 文件上传一起使用时支持。                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略约束。 |
| `Scale Tier`                                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 无                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供相关服务。

#### /v1/responses

- 无法在欧盟地区设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供相关服务。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 中的客户内容进行加密。

配置完成后，EKM 会应用于你在使用平台期间创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户的自带密钥 (BYOK) 加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到支持的云 KMS 提供商之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants (/v1/assistants)
- 视觉微调