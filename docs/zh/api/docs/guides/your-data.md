# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

了解 OpenAI 如何使用你的数据，以及你可以如何控制它。

你的数据归你所有。自 2023-03-01 起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 通过 OpenAI API 存储的数据类型

在使用 OpenAI API 时,数据可能会被存储为:

- **滥用监控日志：** 你在使用平台时产生的日志，OpenAI 需要据此执行我们的 [使用政策](https://openai.com/policies/usage-policies) 与协议，并缓解有害的 AI 使用行为。
- **应用状态：** 部分 API 功能为完成任务或请求而持久化保存的数据。

## 用于滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，例如提示和响应，以及从这些客户内容派生的元数据，例如分类器输出。默认情况下，会针对所有 API 功能的使用生成滥用监控日志，并保留最长 30 天，除非法律要求更长的保留期，或者更长的保留期是保护我们的服务或任何第三方免受伤害所合理必要的。

符合条件的客户可以通过获得以下批准，在遵守下方限制的前提下，将其客户内容排除在这些滥用监控日志之外： [Zero Data Retention](#zero-data-retention) 或 [Modified Abuse Monitoring](#modified-abuse-monitoring) 控制。目前，这些控制需事先获得 OpenAI 的批准并满足额外要求。已获批准的客户可以为其 API 组织或项目在 Modified Abuse Monitoring 或 Zero Data Retention 之间进行选择。

启用 Modified Abuse Monitoring 或 Zero Data Retention 的客户负责确保其用户遵守 OpenAI 安全且负责任地使用 AI 的政策，并遵守适用法律下的任何审核和报告要求。

联系我们的 [销售团队](https://openai.com/contact-sales) 了解有关这些产品的更多信息并咨询资格要求。

### Modified Abuse Monitoring

Modified Abuse Monitoring 将客户内容（如以下 [所述](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)）所述的罕见情况下的图像和文件输入除外）从所有 API 端点的滥用监控日志中排除，同时仍允许客户使用 OpenAI 平台的全部功能。

### Zero Data Retention

零数据留存与修改后的滥用监控一样，将客户内容排除在滥用监控日志之外。

此外，零数据留存会更改某些端点行为： `store` 参数（针对 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了上述特定行为更改外，下表中被标记为不符合零数据留存资格的端点和功能仍可能存储应用状态，即使已启用零数据留存也是如此。

### Eyes Off

对于已获批零数据保留或模型滥用监控豁免的客户，我们保留针对特定客户使相关模型不再适用于零数据保留或模型滥用监控豁免的权利，并会提前书面通知受影响的客户。在此情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则此类内容不会用于人工审阅。对于已签署 OpenAI 商业伙伴与医疗健康附录的客户，一旦您的组织 ID 配置了 Eyes Off，即使数据被保留，符合 BAA 条件的端点也可用于处理 PHI。

### 安全留存

对于已获批零数据保留或修改后滥用监控的客户，如果为调查或防止严重风险活动而合理必要时，我们保留使某些模型对这些特定客户不再符合零数据保留或修改后滥用监控条件的权利，并将事先书面通知受影响的客户。在此情况下，当使用这些模型时，对于我们的分类器检测到可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您的协议的内容，我们可能会保留并人工审查客户内容。否则保留政策不受影响。对于已签署 OpenAI 商业伙伴及医疗保健附录的客户，一旦您的组织 ID 配置了安全保留，即使数据被保留，符合 BAA 条件的端点也可用于处理 PHI。

### 配置数据保留控制项

在你的组织获得数据保留控制功能的批准后，你会在 **数据保留** 标签页中看到，位置在 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目级别配置数据保留控制功能。

- **组织级控制：** 在整个组织范围内选择零数据留存或修改后的滥用监控。
- **项目级控制：** 为每个项目选择 `default` 以继承组织级别的设置，明确选择 Zero Data Retention 或 Modified Abuse Monitoring，或选择 **None** 以禁用该项目的这些控件。

### 各接口的存储要求和留存控制

下表说明了在每个端点上何时存储应用状态。符合零数据保留资格的端点不会保留任何客户内容用于应用状态，但仍受下述限制约束。不符合零数据保留资格的端点或能力在使用过程中可能会保留应用状态，即使你已经启用零数据保留也是如此。

| Endpoint                   | Data used for training | Abuse monitoring retention |  Application state retention   |  Zero Data Retention eligible  | Eyes Off and Safety Retention eligible |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           No           |          30 days           | None, see below for exceptions | Yes, see below for limitations |     Yes, see below for limitations     |
| `/v1/responses`            |           No           |          30 days           | None, see below for exceptions | Yes, see below for limitations |     Yes, see below for limitations     |
| `/v1/conversations`        |           No           |       Until deleted        |         Until deleted          |               No               |                   No                   |
| `/v1/conversations/items`  |           No           |       Until deleted        |         Until deleted          |               No               |                   No                   |
| `/v1/chatkit/threads`      |           No           |       Until deleted        |         Until deleted          |               No               |                   No                   |
| `/v1/assistants`           |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/threads`              |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/threads/messages`     |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/threads/runs`         |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/threads/runs/steps`   |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/vector_stores`        |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/images/generations`   |           No           |          30 days           |              None              | Yes, see below for limitations |                   No                   |
| `/v1/images/edits`         |           No           |          30 days           |              None              | Yes, see below for limitations |                   No                   |
| `/v1/embeddings`           |           No           |          30 days           |              None              |              Yes               |                   No                   |
| `/v1/audio/transcriptions` |           No           |            None            |              None              |              Yes               |                   No                   |
| `/v1/audio/translations`   |           No           |            None            |              None              |              Yes               |                   No                   |
| `/v1/audio/speech`         |           No           |          30 days           |              None              |              Yes               |                   No                   |
| `/v1/files`                |           No           |          30 days           |        Until deleted\*         |               No               |                   No                   |
| `/v1/fine_tuning/jobs`     |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/evals`                |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/batches`              |           No           |          30 days           |         Until deleted          |               No               |                   No                   |
| `/v1/moderations`          |           No           |            None            |              None              |              Yes               |                   No                   |
| `/v1/completions`          |           No           |          30 days           |              None              |              Yes               |                   No                   |
| `/v1/realtime`             |           No           |          30 days           |              None              |              Yes               |                   No                   |
| `/v1/videos`               |           No           |          30 days           |              None              |               No               |                   No                   |

#### `/v1/chat/completions`

- 音频输出应用状态会存储 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像与文件输入](#image-and-file-inputs).
- 提示缓存可能将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 及更高版本的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是此最长应用状态保留时长。如需了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，Responses API 默认具有 30 天的应用状态保留期，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式将响应数据存储到磁盘约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，前台请求在 `store` 被省略或设置为 `true`。后台响应仅在请求显式设置 `store=true`。时才会遵循标准保留期。如果 `store` 被省略或设置为 `false` 用于后台请求，则响应会在临时轮询期结束后被删除。
- 音频输出应用状态会存储 1 小时，以便支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像与文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）是第三方服务，发送到 MCP 服务器的数据受其数据保留策略约束。
- 由 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [Code Interpreter](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器可能会在容器处于活动状态时将临时应用状态写入容器文件系统（由临时块存储支持）。容器数据会在容器过期或被显式删除时被删除。
- 提示缓存可能将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时过期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 及更高版本的模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而不是此最长应用状态保留时长。如需了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用零数据保留时，所有查询都会对所有支持的模型使用扩展提示缓存。
- 对于 服务端 压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 时，提供两种形态：本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留策略约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象在你通过 API 或控制面板删除它们 30 天后，会从我们的服务器上删除。通过 API 或控制面板未删除的对象将被无限期保留。

#### `/v1/images`

- 在使用 `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，时，图像生成与零数据保留兼容，并且 `gpt-image-1-mini`.

#### `/v1/files`

- 可以通过 API 或控制面板手动删除文件，也可以通过设置 `expires_after` 参数自动删除文件。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，在处理过程中会将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，随后保留 30 天用于滥用监控。 `v1/videos` 目前被 MAM 或 ZDR 请求阻止。如果你的组织已启用数据保留控制，请按照 **None** 中的说明，配置一个将其保留设置设为 [配置数据保留控制](#configuring-data-retention-controls) 的项目，以便在该项目中使用 `/v1/videos` 。

#### 图像与文件输入

图像和文件可以作为输入上传到 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。提交时会对图像和文件输入进行 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，即使已启用零数据留存 (Zero Data Retention)、修订后的滥用监控 (Modified Abuse Monitoring) 或 Eyes Off，该图像也会被保留以供人工审核。

#### Web Search

具有实时互联网访问的网页搜索不符合 HIPAA 资格，也不在 BAA 覆盖范围内。处于离线/仅缓存模式的网页搜索（`external_web_access: false`）在使用来自 ZDR 组织内启用了 ZDR 的项目的 API 密钥时，有资格获得 BAA 覆盖。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览版变体（`web_search_preview`）会忽略此参数，其行为如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，允许你配置 OpenAI 用于提供服务的基础设施所在的位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) 团队，确认你是否符合使用数据驻留控制的条件。使用数据驻留端点的将收取 [10% 附加费](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日及之后发布的、符合数据驻留条件的模型。

### 数据驻留是如何运作的？

当你的账号启用了数据驻留功能时，你可以为你账号中新建的项目设置一个区域，可选区域见下方列表。如果使用下方列出的受支持端点、模型和快照，该项目的客户内容（定义见你的服务协议）将在所选区域静态存储，前提是相关端点需要持久化数据才能运行（例如 /v1/batches）。

如果你选择的区域支持区域化处理（具体见下方标识），相应服务也会在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，相关信息可能会在所选区域之外进行处理和存储。系统数据是指不含客户内容的账号数据、元数据和使用数据，这些数据由服务收集并用于管理和运行服务，例如直接访问服务的最终用户（例如你的员工）的账号信息或档案、分析信息、使用统计、计费信息、支持请求以及结构化输出模式。

### 子处理者与区域请求处理

OpenAI 使用 [sub-processors](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发往 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内完成。

### 限制

数据驻留不适用于：(1) 由于最终用户或客户在访问服务时所使用的基础设施所在地而导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的各方提供的产品、服务或内容；或 (3) 客户内容之外的任何数据，例如系统数据。

如果您所选的区域不支持区域处理（如下所述），OpenAI 也可能会在该区域之外处理并临时存储客户内容，以提供相应服务。

### 非美国地区的其他要求

若要将数据驻留设置为美国以外的任何区域，你必须获得滥用监控控制的批准，并签署一份修订后的保留条款。

选择阿拉伯联合酋长国区域需要额外审批。请联系 [sales](https://openai.com/contact-sales) 以获取帮助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉列表中选择相应的区域。

对于已配置数据驻留的项目的请求，请按照下表定义的域前缀为每个请求添加该前缀。

#### Select a processing region per request

除了创建区域专属项目外，你也可以对单个请求选择区域处理，方法是使用带有 API key 前缀域名的请求，且该 接口 key 来自一个地理区域为 Global 的项目。

现有的资格要求与数据保留控制要求仍然适用。所选端点和模型也必须支持区域处理，如下表所示。

下面的示例复用了同一个客户端和来自 Global 项目的 API key，分别用于 Global、US 和 EU 请求：

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

以下模型和 API 服务目前可在下方指定区域享受数据驻留支持。

使用 **各区域支持情况** 比较各区域的能力，并查看每个区域可用的服务。使用 **API 端点、工具和模型支持** 获取完整模型列表以及详细的服务视图。区域存储支持并不代表区域处理支持。

#### 按地区提供支持

完整且未经过滤的区域支持表如下。每个服务的模型快照列在 **API 端点、工具和模型支持**。中。当区域处理仅支持部分快照时，该子集会包含在处理服务单元格中。

| 地区                     | 域名前缀       | 区域存储 | 区域处理 | 需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       Yes        |         Yes         |         No          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲（EEA + 瑞士） | `eu.api.openai.com` |       Yes        |         Yes         |       Yes\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 加拿大\*                   | `ca.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 日本\*                    | `jp.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 印度\*                    | `in.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 新加坡\*                | `sg.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 韩国\*              | `kr.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 英国\*           | `gb.api.openai.com` |       Yes        |         No          |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 阿拉伯联合酋长国\*     | `ae.api.openai.com` |       Yes        |         Yes         |         Yes         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                         |

\* 这些区域的图像支持需要获得增强型零数据保留或增强型修改后滥用监控的批准。

\*\* 需要零数据保留、修改后滥用监控、Eyes Off 或安全保留。

#### API 端点、工具和模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 区域处理快照例外                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | None                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | None                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿联酋： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 阿联酋： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | None                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | 微调      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | None                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | 图像           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | None                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | 图像           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | None                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | Moderation       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | None                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | None                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`, `gpt-live-transcribe`, `gpt-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | None                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | Realtime         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | None                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿联酋： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | Vector stores    | 所有列出的区域                        | None                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `File Search`                                                        | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | None                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | 在使用 base64 文件上传时受支持。                                                               |
| `Remote MCP server tool`                                             | Tools            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据须遵守其数据驻留策略。 |
| `Scale Tier`                                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | None                                                                                                       | —                                                                                                           |



### Endpoint limitations

#### /v1/chat/completions

- 在非美国地区无法设置 store=true。
- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能要求 OpenAI 在区域外处理并临时存储客户内容，以提供服务。

#### /v1/responses

- 无法在 EU 区域设置 background=True。
- [扩展提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能要求 OpenAI 在区域外处理并临时存储客户内容，以提供服务。

#### /v1/realtime

追踪目前在以下方面尚不符合欧盟数据驻留要求 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management（EKM）允许你使用由你自己的外部密钥管理系统（KMS）管理的密钥来加密你在 OpenAI 的客户内容。

配置完成后，EKM 会应用于你在使用该平台期间创建的任何 [application state](#types-of-data-stored-with-the-openai-api) 。更多信息请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) ，了解 EKM 的工作原理以及如何与你的 KMS 提供商进行集成。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中通过外部账户使用自带密钥 (BYOK) 加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到支持的云 KMS 提供商之一，以便与 OpenAI 一起使用。

EKM 不支持以下产品。在已启用 EKM 的项目中尝试使用这些接口将返回错误。

- Assistants (/v1/assistants)
- 视觉模型微调