# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你可以如何掌控这些数据。

你的数据归你所有。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择将数据共享给我们）。

## 使用 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能会被存储为：

- **滥用监控日志：** 你使用平台时产生的日志，OpenAI 需据此强制执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和协议，并缓解 AI 的有害使用行为。
- **应用状态：** 由某些 API 功能持久化保存的数据，用于完成任务或请求。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和回复，以及由这些客户内容派生的元数据，例如分类器输出。默认情况下，所有 API 功能使用情况都会生成滥用监控日志，并保留最长 30 天，除非法律要求延长保留期，或为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在遵守下述限制的前提下，通过申请获得批准，将其客户内容排除在这些滥用监控日志之外： [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控件。目前，这些控件须经 OpenAI 事先批准并接受额外要求。已批准的客户可为其 API 组织或项目在修改后的滥用监控和零数据保留之间进行选择。

启用修改后的滥用监控或零数据保留的客户须负责确保其用户遵守 OpenAI 关于安全且负责任地使用 AI 的政策，并遵守适用法律规定的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 以了解有关这些产品的更多信息并咨询资格要求。

### 修改滥用行为监控

修改后的滥用监控会从所有 接口 端点的滥用监控日志中排除客户内容（在极少数情况下，图像和文件输入可能例外，详见 [下文](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍允许客户充分利用 API 平台的全部功能。OpenAI。

### Zero Data Retention

零数据留存以与修订后的滥用监控相同的方式将客户内容排除在滥用监控日志之外。

此外，零数据留存会改变某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求试图将该值设置为 `true`.

除了这些特定的行为变更之外，即使启用了零数据留存，下表中被标记为不符合零数据留存的端点和能力仍可能存储应用状态。

<a id="zero-data-retention-with-private-safety-processing"></a>

### ZDR with Private Safety Processing

[使用 Private Safety Processing 实现零数据保留](https://developers.openai.com/api/docs/guides/private-safety-processing) 使 OpenAI 能够在保留零数据保留保护的同时执行自动安全监控。本页所列的端点和功能限制仍然适用。

将 ZDR 与 PSP 一起使用的客户必须配置客户控制的存储，并满足 [ZDR with Private Safety Processing 指南](https://developers.openai.com/api/docs/guides/private-safety-processing).

<a id="eyes-off"></a>
<a id="private-retention-with-private-safety-processing"></a>

### 私有保留与私有安全处理（前称 Eyes Off）

对于获批零数据保留或修订滥用监控的客户，我们保留将特定客户的模型从零数据保留或修订滥用监控中取消资格的权力，并会提前书面通知受影响的客户。在此情形下，客户内容将以加密形式保留于 OpenAI 管控的基础设施中的滥用监控日志内，但除非适用法律要求，否则此类内容将被排除在人工审查之外。如需了解更多信息，请参阅 [《Private Safety Processing 技术白皮书》](https://openaiassets.blob.core.windows.net/$web/pdf/c7284810-2252-462f-803e-075b0c95bccb/psp-whitepaper.pdf#page=35).

对于已签署 OpenAI《业务伙伴协议与医疗保健附录》的客户，一旦你的组织 ID 配置了 Private Retention with Private Safety Processing，即可使用符合 BAA 资格的端点处理 PHI，即便数据被保留。本页所列端点和功能限制仍然适用。

### Safety Retention

对于获准使用零数据保留或修改后滥用监控的客户，如果我们合理认为有必要调查或预防严重风险活动，我们保留对特定客户的模型取消其零数据保留或修改后滥用监控资格的权利，并会事先以书面形式通知受影响的客户。在此情况下，当使用这些模型时，对于我们的分类器检测到可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您协议的客户内容，我们可能会保留并人工审核。除此之外，保留政策不受影响。对于已签署 OpenAI 业务伙伴与医疗保健附录的客户，一旦您的组织 ID 配置了安全保留，即使数据被保留，BAA 符合条件的端点也可用于处理 PHI。

### 配置数据保留控制

你的组织获得数据保留控制权限后，即可在以下位置看到一个 **Data Retention** 标签页： [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目两个层级配置数据保留控制。

- **组织级控制：** 在整个组织范围内选择零数据留存或修改后的滥用监控。
- **项目级控制：** 对于每个项目，选择 `default` 以继承组织级设置、明确选择零数据留存或修改后的滥用监控，或选择 **无** 以对该项目禁用这些控制。

### 各接口的存储要求与留存控制

下表说明了每个接口在何时存储应用状态。符合零数据留存条件的接口不会保留任何客户内容用于应用状态，但仍受下文所述限制的约束。不符合零数据留存条件的接口或能力在使用时可能会保留应用状态，即使你已启用零数据留存也是如此。

| Endpoint                   | 用于训练的数据 | 滥用监控数据保留期 |  应用状态保留期   |  符合零数据保留要求  | 符合带 PSP 的私有保留与安全保留要求 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |              是，限制见下文              |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |              是，限制见下文              |
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
| `/v1/files`                |           否           |          30 天           |        直到删除\*         |               否               |                            否                            |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/evals`                |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/batches`              |           否           |          30 天           |         直到删除          |               否               |                            否                            |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                            否                            |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                            否                            |
| `/v1/live/sessions`        |           否           |          30 天           |   无，若存储则为 30 天   |  是，限制见下文   |                            否                            |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                            否                            |

#### `/v1/chat/completions`

- 音频输出的应用状态会保留 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为某个组织启用零数据保留时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 另请参阅 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及后续模型系列， `prompt_cache_options.ttl` 控制的是最小缓存生命周期，而不是此最大应用状态保留期。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，Responses API 默认具有 30 天的应用状态保留期，或当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少保留 30 天。
- 当为某个组织启用零数据保留时， `store` 参数将始终被视为 `false`，即使请求试图将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘上大约 10 分钟，以便支持轮询。对于使用 [改进型滥用监测](#modified-abuse-monitoring)，的项目，包括增强型改进型滥用监测，当 `store` 被省略或设置为 `true`。后台响应仅在请求明确设置 `store=true`。时才会遵循标准保留期。如果 `store` 被省略或设置为 `false` 用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出的应用状态会保留 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 另请参阅 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）属于第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 所使用的托管容器 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 可能在容器处于活动状态时将临时应用程序状态写入容器文件系统（由临时块存储支持）。容器数据会在容器过期或被显式删除时被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及后续模型系列， `prompt_cache_options.ttl` 控制的是最小缓存生命周期，而不是此最大应用状态保留期。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用零数据保留时，所有查询对所有支持的模型使用扩展提示缓存。
- 对于服务端压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) ，提供两种形态：本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象，在你通过 API 或控制面板删除它们 30 天后，会从我们的服务器上删除。未通过 API 或控制面板删除的对象将被无限期保留。

#### `/v1/images`

- 使用以下方式时，图像生成兼容零数据保留 `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`, `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或控制面板手动删除文件，也可以通过设置以下 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### 历史视频 API 保留

在 2026 年 9 月 24 日下线之前，Videos API 文档规定生成视频的下载期限为 48 小时，随后保留 30 天用于违规监控。上述期限描述的是下线前文档中的政策，并不承诺下线后仍可下载。请参阅 [Videos API 下线通知](https://developers.openai.com/api/docs/deprecations#2026-03-24-sora-2-video-generation-models-and-videos-api).

#### 图像和文件输入

可以将图像和文件作为输入上传到 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。在提交时会对图像和文件输入进行 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，即使启用了零数据留存、修订后的滥用监控或与 PSP 的 Private 留存，图像也将被保留以供人工审核。

#### 网页搜索

带有实时互联网访问的网页搜索不符合 HIPAA 资格，也不受 BAA 覆盖。处于离线/仅缓存模式下的网页搜索（`external_web_access: false`）在使用来自 ZDR 组织内启用 ZDR 的项目的 API 密钥时，有资格受 BAA 覆盖。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览版变体（`web_search_preview`）会忽略此参数，表现如同 `external_web_access` is `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，可让你配置 OpenAI 用于提供服务的底层基础设施所在的位置。

联系我们的 [销售团队](https://openai.com/contact-sales) 团队，了解你是否有资格使用数据驻留控制。数据驻留端点将收取 [10% 的附加费用](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布的、符合数据驻留条件的模型。

### 数据驻留是如何运作的？

在你的账户上启用数据驻留后，你可以为你在账户中新创建的项目设置一个区域，区域可选自下方列出的可用区域。如果使用下方列出的受支持端点、模型和快照，则该项目中的客户内容（依据你服务协议中的定义）将在所选区域内静态存储，前提是相关端点需要数据持久化才能运行（例如 /v1/batches）。

如果你选择的区域支持区域处理（具体见下方说明），服务也将在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外被处理和存储。系统数据是指不包含客户内容的账户数据、元数据和使用数据，这些数据由服务收集并用于管理和运营服务，例如账户信息或直接访问服务的最终用户（例如你的员工）的资料、使用分析、使用统计、计费信息、支持请求以及结构化输出架构。

### 子处理商与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发往 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内进行。

### 局限性

数据驻留不适用于：(1) 因最终用户或客户的基础设施在访问服务时所处位置而导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的各方通过服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，例如系统数据。

如果你所选的区域不支持区域处理（如下所述），OpenAI 也可能在区域之外处理并临时存储客户内容，以提供服务。

### 非美国地区的额外要求

要在美国以外的任何区域使用数据驻留（data residency），你必须获得滥用监控控制（abuse monitoring controls）的批准，并签署一份修订后的保留条款（Modified Retention amendment）。

选择阿联酋区域需要额外审批。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目的请求，请按下表中定义的域前缀为每个请求添加前缀。

#### Select a processing region per request

作为创建区域特定项目的替代方案，你可以通过使用来自具有 Global 地理属性的项目的 API 密钥加上前缀的域名，为单个请求选择区域处理。

现有的资格和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

以下示例为 global、US 和 EU 请求复用同一个客户端和一个来自 Global 项目的 API 密钥：

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

以下模型和 API 服务现已可在下方指定区域实现数据驻留。

使用 **按区域查看支持情况** 来比较各区域的能力，并扩展每个区域可用的服务。使用 **API 端点、工具和模型支持** 查看完整的模型列表和详细的服务视图。支持区域存储并不意味着支持区域处理。

对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在 Responses 和 Chat Completions 的 Standard 处理下可用。

#### 按区域提供支持

下面是完整、未筛选的区域支持表。每个服务的模型快照列在 **API 端点、工具和模型支持**。中。当区域处理仅支持部分快照时，该子集会包含在 processing-services 单元格中。

| 区域                     | 域前缀       | 区域存储 | 区域处理 | 需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
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

\* 在这些区域的图像支持需要获得增强型零数据保留或增强型滥用监控修改版的批准。

\*\* 需要零数据保留、滥用监控修改版、PSP 私有保留或安全保留。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型及快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 区域处理快照例外                                                                                                                                                           | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`: 仅支持 Standard 处理                                                                                                                 | 对于 GPT-6 Sol 和 Luna,欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`: 仅支持 Standard 处理<br />阿拉伯联合酋长国: `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | 对于 GPT-6 Sol 和 Luna,欧盟数据驻留仅在 Standard 处理下可用。                       |
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
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)、阿拉伯联合酋长国 | `gpt-6-astra`, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 欧洲(EEA + 瑞士): `gpt-6-sol` 或 `gpt-6-luna`: 仅支持 Standard 处理<br />阿拉伯联合酋长国: `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | 对于 GPT-6 Sol 和 Luna,欧盟数据驻留仅在 Standard 处理下可用。                       |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | 与 base64 文件上传一起使用时受支持。                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略约束。 |
| `Scale Tier`                                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 无                                                                                                                                                                                              | —                                                                                                           |
| `Supported input modalities`                                         | Other            | 所有列出的区域                        | 美国、欧洲(EEA + 瑞士)                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无                                                                                                                                                                                              | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区使用时，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区使用时，可能需要 OpenAI 在该区域之外处理并临时存储客户内容，以提供服务。

#### /v1/live/sessions

GPT-Live 会话可使用零数据保留。启用零数据保留后， `store` 被视为 `false`，即使请求将其设置为 `true`.

默认禁用会话存储。对于启用了会话存储的项目， `store: true` 会保留已完成的会话录制 30 天，以便可以下载或用于启动分叉会话。已存储的会话及其索引会在 30 天后过期。录制下载和分叉需要允许持久化的数据策略，在零数据保留下不可用。

在分叉上设置 `store: false` 可阻止存储新会话；但不会删除源录制，也不会移除读取源录制所需的授权。API 未提供公共的已存储会话删除端点。

GPT-Live 支持美国和欧洲的数据驻留。委托的后端模型和工具有各自的数据控制方式；请查看本页中适用的端点和功能条目。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求,适用于 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥来加密你在 OpenAI 上的客户内容。

配置完成后，EKM 将应用于你在使用该平台期间创建的任何 [应用状态](#types-of-data-stored-with-the-openai-api) 。请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商集成。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud（GCP）和 Azure Key Vault 中通过外部账户使用自带密钥（BYOK）加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到上述受支持的云 KMS 提供商之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些接口将返回错误。

- Assistants (/v1/assistants)
- 视觉模型微调