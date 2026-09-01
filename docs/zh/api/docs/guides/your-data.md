# OpenAI 平台中的数据控制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后附加 `.md` 来获取文档页面的 Markdown 版本。

了解 OpenAI 如何使用你的数据，以及你如何进行控制。

你的数据归你所有。自 2023 年 3 月 1 日起，发送至 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 通过 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能以以下形式存储：

- **滥用监控日志：** 你使用平台时生成的日志，OpenAI 为执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和协议以及减轻有害的 AI 使用所必需。
- **应用状态：** 为完成某项任务或请求而由某些 API 功能持久保存的数据。

## 滥用监控的数据保留控制

滥用监控日志可能包含特定的客户内容，例如提示和响应，以及从这些客户内容衍生的元数据，例如分类器的输出。默认情况下，API 功能的所有使用都会生成滥用监控日志，并保留最长 30 天，除非法律要求更长的保留期，或者为保护我们的服务或任何第三方免受伤害而合理必要。

符合条件的客户可在遵守下述限制的前提下，通过获得批准的 [零数据保留](#zero-data-retention) 或 [修改后的滥用监控](#modified-abuse-monitoring) 控制，将客户内容从这些滥用监控日志中排除。目前，这些控制需事先获得 OpenAI 的批准并接受额外要求。已获批准的客户可为其 API 组织或项目在修改后的滥用监控与零数据保留之间选择其一。

启用修改后的滥用监控或零数据保留的客户有责任确保其用户遵守 OpenAI 的安全与负责任使用 AI 的政策，并遵守适用法律下的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，以详细了解这些方案并咨询申请资格。

### 改进后的滥用行为监控

修改后的滥用监控会从所有 API 端点的滥用监控日志中排除客户内容（除少数情况下的图像和文件输入外，如下所述 [下文](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)），同时仍允许客户充分利用 OpenAI 平台的全部功能。

### Zero Data Retention

零数据留存以与 Modified Abuse Monitoring 相同的方式将客户内容排除在滥用监控日志之外。

此外，零数据留存会更改某些端点的行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为更改外，即使启用了零数据留存，下表中标记为不符合零数据留存资格的端点和功能仍可能存储应用程序状态。

### Eyes Off

对于获批使用零数据留存或修改后滥用监控的客户，我们保留针对特定客户使模型不符合零数据留存或修改后滥用监控条件的权利，并将提前书面通知受影响的客户。在这种情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则此类内容将被排除在人工审核之外。对于已签署 OpenAI 商业伙伴及医疗保健附录的客户，一旦你的组织 ID 配置为 Eyes Off，即使数据被留存，也可使用符合 BAA 资格的端点处理 PHI。

### 安全保留

对于获得零数据保留或修改后滥用监控批准的客户，如果我们合理认为有必要调查或防止严重风险活动，我们保留使特定客户的模型不再符合零数据保留或修改后滥用监控条件的权利，并会提前书面通知受影响的客户。在这种情况下，当我们使用这些模型时，若我们的分类器检测到客户内容可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或你的协议。否则保留策略不受影响。对于已签署 OpenAI 商业伙伴协议与医疗保健附录的客户，一旦你的组织 ID 配置了安全保留功能，符合 BAA 条件的端点即可用于处理 PHI，即使数据被保留。

### 配置数据保留控制

当你的组织获得数据保留控制的使用批准后，你会在 **Data Retention** 标签页中看到它，位置在 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。在该标签页中，你可以在组织和项目级别配置数据保留控制。

- **组织级控制：** 为整个组织选择零数据留存或修订后的滥用监控。
- **项目级控制：** 为每个项目选择 `default` 以继承组织级设置，明确选择零数据留存或修订后的滥用监控，或选择 **无** 以对该项目禁用这些控制。

### 各接口的存储要求与保留控制

下表列出了每个接口会在何时存储应用状态。符合零数据保留（Zero Data Retention）条件的接口不会保留任何客户内容用于应用状态，但仍受下文所述限制的约束。不符合零数据保留条件的接口或能力在启用零数据保留的情况下被使用时，仍可能保留应用状态。

| 端点                   | 用于训练的数据 | 滥用监控保留期 |  应用状态保留期   |  符合零数据保留条件  | 符合 Eyes Off 与安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/responses`            |           否           |          30 天           | 无，例外情况见下文 | 是，限制条件见下文 |     是，限制条件见下文     |
| `/v1/conversations`        |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/conversations/items`  |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直至删除        |         直至删除          |               否               |                   否                   |
| `/v1/assistants`           |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads`              |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/messages`     |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/runs`         |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/vector_stores`        |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制条件见下文 |                   否                   |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制条件见下文 |                   否                   |
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

- 音频输出应用状态会存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 参见 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及后续模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而非此最长应用状态保留期。若要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除非下文另有说明，Responses API 默认具有 30 天的应用状态保留期，或者当 `store` 参数设置为 `true`。时也是如此。在这些情况下，响应数据将至少存储 30 天。
- 当为组织启用 Zero Data Retention 时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘大约 10 分钟，以支持轮询。对于使用 [Modified Abuse Monitoring](#modified-abuse-monitoring)，的项目，包括增强版 Modified Abuse Monitoring，在以下情况下前台请求遵循标准保留期 `store` 被省略或设置为 `true`。后台响应仅在请求明确设置 `store=true`。时遵循标准保留期。如果 `store` 被省略或设置为 `false` 用于后台请求，响应将在临时轮询期结束后被删除。
- 音频输出应用状态会存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）属于第三方服务，发送到 MCP 服务器的数据适用其各自的数据保留策略。
- 由 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器在容器处于活动状态期间，可能会将临时应用状态写入容器文件系统（由临时块存储提供支持）。当容器过期或被显式删除时，容器数据将被删除。
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。这些数据存储在本地 GPU 机器上，并在 24 小时到期后不再保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，将 `prompt_cache_retention` 设置为 `in_memory` 会返回错误。对于 GPT-5.6 模型及后续模型系列， `prompt_cache_options.ttl` 控制的是最短缓存生命周期，而非此最长应用状态保留期。若要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用 Zero Data Retention 时，所有查询都会对所有受支持的模型使用扩展提示缓存。
- 对于 服务端压缩，当 `store="false"`.
- 我们支持 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 提供两种形态：本地执行和基于托管容器的执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器处于活动状态期间保持可用，并在容器过期或被删除时被丢弃。
- 通过网络连接传输给第三方服务的数据适用其各自的数据保留策略。

#### `/v1/assistants`, `/v1/threads`，并且 `/v1/vector_stores`

- 与 Assistants API 相关的对象会在你通过 API 或仪表板删除它们 30 天后从我们的服务器上删除。未通过 API 或仪表板删除的对象将无限期保留。

#### `/v1/images`

- 在使用以下模型时，图像生成兼容零数据保留（Zero Data Retention）： `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 文件可以通过 API 或仪表板手动删除，也可以通过设置 `expires_after` 参数自动删除。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 以了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，它在处理过程中会将数据保存到磁盘，并保留 48 小时以便调用方下载生成的视频，然后再保留 30 天用于滥用监控。 `v1/videos` 目前被阻止用于 MAM 或 ZDR 请求。如果你的组织已启用数据保留控制，请按照 **无** 中所述，将项目配置为 [配置数据保留控制](#configuring-data-retention-controls) ，以便在 `/v1/videos` 项目中使用。

#### 图像和文件输入

可以将图像和文件作为输入上传至 `/v1/responses` （包括使用 Computer Use 工具时）， `/v1/chat/completions`，以及 `/v1/images`。图像和文件输入在提交时会经过 CSAM 内容扫描。如果分类器检测到潜在的 CSAM 内容，该图像将被保留以供人工审核，即使已启用零数据留存、修订后的滥用监控或 Eyes Off。

#### 网页搜索

具有实时互联网访问的网页搜索不符合 HIPAA 资格，也不受 BAA 保障。在离线/仅缓存模式下使用网页搜索（`external_web_access: false`）在配合 ZDR 组织内启用 ZDR 项目的 API 密钥使用时，可纳入 BAA 保障范围。此 HIPAA/BAA 指引仅适用于 Responses API `web_search` 工具。注意：预览版变体（`web_search_preview`) 会忽略此参数，表现如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻留控制是一项项目配置选项，可用于配置 该公司 OpenAI 用于提供服务的所在区域。

请联系我们的 [销售团队](https://openai.com/contact-sales) 团队，了解你是否符合使用数据驻留控制的资格。使用数据驻留端点会收取 [10% 的附加费用](https://developers.openai.com/api/docs/pricing) ，适用于 2026 年 3 月 5 日当天或之后发布且符合数据驻留条件的模型。

### 数据驻留是如何工作的？

在你的账户上启用数据驻留后，你可以为在账户中新建的项目从下方列出的可用区域中选择一个区域。如果你使用下方列出的受支持端点、模型和快照，那么该项目的客户内容（按你服务协议中的定义）在所选区域内静态存储，以满足端点运行所需的数据持久化要求（例如 /v1/batches）。

如果你选择的区域支持区域处理（如下方特别说明），服务也会在所选区域内为你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能会在所选区域之外进行处理和存储。系统数据是指不含客户内容的账户数据、元数据和使用数据，这些数据由服务收集并用于管理和运营服务，例如账户信息或直接访问服务的最终用户（例如你的员工）的资料、分析、使用统计、计费信息、支持请求和结构化输出模式。

### 子处理者与区域请求处理

OpenAI 使用 [子处理方](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发往 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密发生在所选的处理区域内。

### 局限性

数据驻留不适用于：(1) 终端用户或客户的接入基础设施所在位置导致客户内容在所选区域之外的任何传输或存储；(2) 由 OpenAI 以外的其他方通过本服务提供的产品、服务或内容；或 (3) 客户内容以外的任何数据，如系统数据。

如果您选择的区域不支持区域化处理（如下文所述），OpenAI 也可能在该区域之外处理并临时存储客户内容，以提供服务。

### 非美国地区的额外要求

要在美国以外的任何地区使用数据驻留，你必须获得滥用监控控制的批准，并签署修订后的保留条款修正案。

选择阿拉伯联合酋长国地区需要额外的批准。请联系 [sales](https://openai.com/contact-sales) 寻求帮助。

### 如何使用数据驻留

数据驻留是在你的 API 组织内按项目配置的。

若要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择相应的区域。

对于已配置数据驻留的项目的请求，请按照下表定义的域名前缀添加到每个请求中。

#### Select a processing region per request

除了创建区域专属项目外，你也可以使用带有前缀的域名，对来自 Global 区域项目的 API 密钥的单个请求选择区域处理。

现有的资格和数据保留控制要求仍然适用。所选的端点和模型也必须支持区域处理，如下表所示。

下面的示例在 Global 项目中复用同一个客户端和同一个 API 密钥，分别用于 Global、US 和 EU 请求：

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

以下模型和 API 服务目前可在下方指定区域使用数据驻留。

使用 **按区域划分的支持情况** 比较各区域的能力，并扩展每个区域中可用的服务。使用 **API 端点、工具和模型支持** 获取完整的模型列表和详细的服务视图。区域存储支持并不意味着区域处理支持。

#### 各地区支持情况

下面给出完整的、未经过滤的区域支持表。每个服务的模型快照列于 **API 端点、工具和模型支持**。当区域处理仅支持部分快照时，该子集会包含在处理服务单元中。

| 区域                     | 域名前缀       | 区域存储 | 区域处理 | 是否需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | ------------------- | :--------------: | :-----------------: | :-----------------: | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 美国              | `us.api.openai.com` |       是        |         是         |         否          | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 欧洲（欧洲经济区 + 瑞士） | `eu.api.openai.com` |       是        |         是         |       是\*\*       | 文本、音频、语音、图像\* | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/evals`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/realtime`<br />`/v1/realtime/transcription_sessions`<br />`/v1/realtime/translations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`Code Interpreter tool`<br />`File Search`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities` |
| 澳大利亚\*                | `au.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 加拿大\*                   | `ca.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 日本\*                    | `jp.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 印度\*                    | `in.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 新加坡\*                | `sg.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 韩国\*              | `kr.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 英国\*           | `gb.api.openai.com` |       是        |         否          |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | 无                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 阿联酋\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                         |

\* 这些区域的图像支持需要获得增强型零数据留存或增强型修改后滥用监控的批准。

\*\* 需要零数据留存、修改后滥用监控、Eyes Off 或安全留存。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型与快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 区域处理快照例外情况                                                                    | 说明                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | Chat Completions | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | Embeddings       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 阿拉伯联合酋长国： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | Fine-tuning      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | Images           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | 审核       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿拉伯联合酋长国 | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | 向量存储    | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | 工具            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | 工具            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | Files            | 所有列出的区域                        | 无                                                            | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | 在使用 base64 文件上传时受支持。                                                               |
| `Remote MCP server tool`                                             | 工具            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留策略约束。 |
| `Scale Tier`                                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级别支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 在非美国区域无法设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在区域外处理并临时存储客户内容，以提供相应服务。

#### /v1/responses

- 无法在 EU 区域设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域中，可能需要 OpenAI 在区域外处理并临时存储客户内容，以提供相应服务。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求,适用于 `/v1/realtime`.

## Enterprise Key Management (EKM)

Enterprise Key Management（EKM）允许你使用由你自己的外部密钥管理系统（KMS）管理的密钥对OpenAI 中的客户内容进行加密。

配置完成后，EKM 将应用于任何 [application state](#types-of-data-stored-with-the-openai-api) 。参见 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 了解有关 EKM 工作原理以及如何与你的 KMS 提供商集成的更多信息。

### EKM 限制

OpenAI 支持在 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中使用外部账户自带密钥（BYOK）加密。如果你的组织使用其他密钥管理服务，则需要将这些密钥同步到受支持的云 KMS 提供商之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在启用了 EKM 的项目中尝试使用这些端点将返回错误。

- Assistants (/v1/assistants)
- 视觉微调