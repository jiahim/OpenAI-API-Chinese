# OpenAI 平台中的数据控制

> 如需查看完整的文档索引，请参见 [llms.txt](/llms.txt)。各个文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

了解 OpenAI 如何使用你的数据，以及你如何控制它。

你的数据就是你的数据。自 2023 年 3 月 1 日起，发送给 OpenAI API 的数据不会用于训练或改进 OpenAI 模型（除非你明确选择与我们共享数据）。

## 使用 OpenAI API 存储的数据类型

使用 OpenAI API 时，数据可能存储为：

- **滥用监控日志：** 你使用平台所产生的日志，OpenAI 需要这些日志来执行我们的 [使用政策](https://openai.com/policies/usage-policies) 和协议，并减轻 AI 的有害使用。
- **应用状态：** 从部分 API 功能中持久化的数据，用于完成任务或请求。

## 滥用监控的数据保留控制

滥用监控日志可能包含某些客户内容，如提示和响应，以及从该客户内容派生的元数据，如分类器输出。默认情况下，滥用监控日志会针对所有API功能使用生成，并保留最多30天，除非法律要求更长的保留期，或为保护我们的服务或任何第三方免受损害而合理必要。

符合条件的客户在获得以下批准后，可能会将其客户内容排除在这些滥用监控日志之外，但需遵守以下限制： [零数据保留](#zero-data-retention) 或 [修改后滥用监控](#modified-abuse-monitoring) 控制。目前，这些控制需事先获得OpenAI的批准并接受额外要求。获批客户可在其API组织或项目中选择“修改后滥用监控”或“零数据保留”。

启用“修改后滥用监控”或“零数据保留”的客户有责任确保其用户遵守OpenAI关于安全负责任使用AI的政策，并遵守适用法律下的任何审核和报告要求。

请联系我们的 [销售团队](https://openai.com/contact-sales) 了解有关这些产品的更多信息并咨询资格事宜。

### 改进的滥用监控

修改后的滥用监控会将客户内容（极少数情况下的图像和文件输入除外，如下所述） [排除在](https://developers.openai.com/api/docs/guides/your-data#image-and-file-inputs)）所有 API 端点的滥用监控日志之外，同时仍允许客户充分利用 OpenAI 平台的全部功能。

### 零数据保留

零数据保留以与修改后的滥用监控相同的方式，将客户内容排除在滥用监控日志之外。

此外，零数据保留会改变某些端点行为： `store` 参数 `/v1/responses` 和 `v1/chat/completions` 将始终被视为 `false`，即使请求尝试将该值设置为 `true`.

除了这些特定的行为变化外，下表中列为“不符合零数据保留条件”的端点和功能可能仍会存储应用程序状态，即使已启用零数据保留。

### Eyes Off

对于已获准使用零数据保留或改良滥用监控的客户，我们保留使特定客户的模型不符合零数据保留或改良滥用监控资格的权利，并会提前书面通知受影响的客户。在此情况下，客户内容将保留在滥用监控日志中，但除非适用法律要求，否则此类内容将不会用于人工审查。对于已签署OpenAI业务伙伴协议及医疗附件（Business Associate and Healthcare Addendum）的客户，一旦你的组织ID已配置为“Eyes Off”，符合BAA条件的端点即可用于处理受保护健康信息（PHI），即使数据被保留也是如此。

### Safety Retention

对于获批零数据留存或修改版滥用监控的客户，我们保留将模型认定为不适用于特定客户的零数据留存或修改版滥用监控的权利，前提是合理必要的或因调查或预防严重风险活动所需，并提前书面通知受影响客户。在此情况下，对于使用这些模型时我们的分类器检测到可能违反我们的 [使用政策](https://openai.com/policies/usage-policies/) 或您的协议的客户内容，我们可能会留存并进行人工审核。否则留存不会受到影响。对于已签署 OpenAI 业务伙伴及医疗保健附件的客户，一旦您的组织 ID 配置了安全留存，符合 BAA 条件的端点可用于处理 PHI，即使数据被留存。

### 配置数据保留控制

一旦你的组织获批启用数据保留控制，你将看到 **Data Retention** 标签页，位于 [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention)。中。在该标签页中，你可以在组织和项目两个层面配置数据保留控制。

- **组织级控制：** 为你的整个组织选择“零数据保留”或“修改后的滥用监控”。
- **项目级控制：** 对于每个项目，选择 `default` 来继承组织级设置，显式选择“零数据保留”或“修改后的滥用监控”，或选择 **None** 以禁用该项目的这些控制。

### 各端点的存储要求与保留控制

下表说明了每个端点何时存储应用程序状态。符合零数据保留条件的端点不保留任何客户内容作为应用程序状态，但受限于以下限制。不符合零数据保留条件的端点或功能在使用时可能会保留应用程序状态，即使你已启用零数据保留。

| 端点                   | 用于训练的数据 | 滥用监控保留期 |  应用程序状态保留期   |  符合零数据保留条件  | 符合 Eyes Off 和安全保留条件 |
| -------------------------- | :--------------------: | :------------------------: | :----------------------------: | :----------------------------: | :------------------------------------: |
| `/v1/chat/completions`     |           无           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |     是，限制见下文     |
| `/v1/responses`            |           无           |          30 天           | 无，例外情况见下文 | 是，限制见下文 |     是，限制见下文     |
| `/v1/conversations`        |           无           |       直到删除        |         直到删除          |               无               |                   否                   |
| `/v1/conversations/items`  |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/chatkit/threads`      |           否           |       直到删除        |         直到删除          |               否               |                   否                   |
| `/v1/assistants`           |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads`              |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/threads/messages`     |           否           |          30 天           |         直到删除为止          |               否               |                   否                   |
| `/v1/threads/runs`         |           否           |          30 天           |         直到删除为止          |               否               |                   否                   |
| `/v1/threads/runs/steps`   |           否           |          30 天           |         直到删除为止          |               否               |                   否                   |
| `/v1/vector_stores`        |           否           |          30 天           |         直到删除为止          |               否               |                   否                   |
| `/v1/images/generations`   |           否           |          30 天           |              无              | 是，限制见下文 |                   否                   |
| `/v1/images/edits`         |           否           |          30 天           |              无              | 是，限制见下文 |                   否                   |
| `/v1/embeddings`           |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/audio/transcriptions` |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/translations`   |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/audio/speech`         |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/files`                |           否           |          30 天           |        直至删除\*         |               否               |                   否                   |
| `/v1/fine_tuning/jobs`     |           否           |          30 天           |         直至删除          |               否               |                   否                   |
| `/v1/evals`                |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/batches`              |           否           |          30 天           |         直到删除          |               否               |                   否                   |
| `/v1/moderations`          |           否           |            无            |              无              |              是               |                   否                   |
| `/v1/completions`          |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/realtime`             |           否           |          30 天           |              无              |              是               |                   否                   |
| `/v1/videos`               |           否           |          30 天           |              无              |               否               |                   否                   |

#### `/v1/chat/completions`

- 音频输出的应用状态会保存 1 小时，以实现 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 当组织启用了零数据保留时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 有关更多信息，请参阅 [图像和文件输入](#image-and-file-inputs).
- 提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。此数据存储在本地 GPU 机器上，在 24 小时过期后不会保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 为 `in_memory` 会返回错误。对于 GPT-5.6 及更高版本的模型系列， `prompt_cache_options.ttl` 控制最小缓存生命周期，而非此最大应用状态保留期限。要了解更多信息，请参阅 [提示缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

- 除下文所述外，Responses API 默认具有 30 天的应用状态保留期，或当 `store` 参数设置为 `true`。时。在这些情况下，响应数据将至少存储 30 天。
- 当组织启用了零数据保留时， `store` 参数将始终被视为 `false`，即使请求尝试将该值设置为 `true`.
- 后台模式会将响应数据存储到磁盘约 10 分钟，以便进行轮询。对于使用 [增强版滥用监控](#modified-abuse-monitoring)（包括增强版滥用监控）的项目，前台请求采用标准保留策略，当 `store` 省略或设置为 `true`。时。后台响应仅在请求显式设置 `store=true`。后，才遵循标准保留期。如果 `store` 省略或设置为 `false` 对于后台请求，响应将在临时轮询期结束后删除。
- 音频输出的应用状态会存储 1 小时，以支持 [多轮对话](https://developers.openai.com/api/docs/guides/audio).
- 参见 [图像和文件输入](#image-and-file-inputs).
- MCP 服务器（与 [远程 MCP 服务器工具](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)）一起使用）是第三方服务，发送到 MCP 服务器的数据受其数据保留政策约束。
- 由 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter) 使用的托管容器在容器活动期间可能会将临时应用状态写入容器文件系统（由临时块存储支持）。容器数据将在容器过期或被显式删除时删除。
- 提示词缓存可能会将加密的键/值张量作为应用程序状态存储在 GPU 本地存储中。这些数据保存在本地 GPU 机器上，在 24 小时到期后不会保留。对于 `gpt-5.5` 和 `gpt-5.5-pro`，设置 `prompt_cache_retention` 为 `in_memory` 会返回错误。对于 GPT-5.6 模型及以后的模型系列， `prompt_cache_options.ttl` 控制的是最小缓存生命周期，而非此最大应用状态保留期限。要了解更多信息，请参阅 [提示词缓存指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention).
- 当组织未启用零数据保留时，所有查询都会对所有受支持的模型使用扩展提示词缓存。
- 对于 服务端压缩，当 `store="false"`.
- 我们支持 [技能](https://developers.openai.com/api/docs/guides/tools-skills) 以两种形式提供，包括本地执行和托管容器执行。托管技能遵循与托管 shell 相同的容器生命周期：挂载的技能和容器文件在容器活动期间保持可用，并在容器到期或被删除时被丢弃。
- 通过网络连接传输到第三方服务的数据受其数据保留政策的约束。

#### `/v1/assistants`, `/v1/threads`，以及 `/v1/vector_stores`

- 与 Assistants API 相关的对象在您通过 API 或仪表板删除后 30 天会从我们的服务器中删除。未通过 API 或仪表板删除的对象将被无限期保留。

#### `/v1/images`

- 使用图片生成功能时，兼容零数据保留政策 `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`，以及 `gpt-image-1-mini`.

#### `/v1/files`

- 文件可以通过 API 或仪表板手动删除，也可以通过设置以下参数自动删除： `expires_after` 参数。详见 [此处](https://developers.openai.com/api/reference/resources/files/methods/create#files_create-expires_after) 以了解更多信息。

#### `/v1/videos`

- 该 `v1/videos` API 包含一个 工作流，在处理过程中将数据保存到磁盘，并保留 48 小时以供调用者下载生成的视频，之后为滥用监控再保留 30 天。 `v1/videos` 目前对 MAM 或 ZDR 请求阻止。如果您的组织启用了数据保留控制，请配置一个项目，并将其保留设置设为 **None** ，如 [配置数据保留控制](#configuring-data-retention-controls) 中所述，以使用 `/v1/videos` 配合该项目。

#### 图像和文件输入

图像和文件可以作为输入上传到 `/v1/responses` （包括使用计算机使用工具时）， `/v1/chat/completions`，以及 `/v1/images`。图像和文件输入在提交时会扫描是否有 CSAM 内容。如果分类器检测到潜在的 CSAM 内容，则图像将被保留以供人工审查，即使启用了零数据保留、修改后的滥用监控或眼睛关闭也是如此。

#### 网页搜索

具有实时互联网访问权限的网页搜索不符合 HIPAA 资格，且不受 BAA 覆盖。离线/仅缓存模式下的网页搜索（`external_web_access: false`）在配合 ZDR 组织内启用了 ZDR 的项目中的 API 密钥使用时，有资格受 BAA 覆盖。此 HIPAA/BAA 指南仅适用于 Responses API `web_search` 工具。注意：预览变体（`web_search_preview`）会忽略此参数，行为如同 `external_web_access` 为 `true`。我们建议使用 `web_search`.

## 数据驻留控制

数据驻地控制是一个项目配置选项，允许你配置 OpenAI 用于提供服务的设施位置。

请联系我们的 [销售团队](https://openai.com/contact-sales) ，查看你是否符合使用数据驻地控制的条件。数据驻地端点将收取 [10% 上浮费用](https://developers.openai.com/api/docs/pricing) ，适用于2026年3月5日及之后发布且符合数据驻地条件的模型。

### 数据驻留如何工作？

当你的账户启用了数据驻留功能时，你可以从下面列出的可用区域中为你账户中创建的新项目设置一个区域。如果你使用下面列出的受支持的端点、模型和快照，则该项目的客户内容（如你的服务协议中所定义）将在所选区域中静态存储，存储程度以满足端点需要数据持久化才能运行的要求为准（例如 /v1/batches）。

如果你选择的区域支持区域处理（如下文特别指明），服务也将在所选区域对你的客户内容执行推理。

数据驻留不适用于系统数据，系统数据可能在所选区域之外处理和存储。系统数据是指不包含客户内容的账户数据、元数据和用法数据，这些数据由服务收集并用于管理和运营服务，例如直接访问服务的终端用户（如你的员工）的账户信息或配置文件、分析数据、使用统计、计费信息、支持请求以及结构化输出模式。

### 子处理方与区域请求处理

OpenAI 使用 [子处理器](https://openai.com/policies/sub-processor-list/) 来提供服务。对于发送至 `us.api.openai.com` 或 `eu.api.openai.com`，的请求，OpenAI 使用 [Cloudflare Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) ，以便 TLS 终止和 HTTPS 解密在所选的处理区域内进行。

### 局限性

数据驻留不适用于：（1）最终用户或客户的基建设施在访问服务时，导致客户内容在选定区域之外的任何传输或存储；（2）通过服务提供的除OpenAI之外的其他方的产品、服务或内容；或（3）除客户内容以外的任何数据，例如系统数据。

如果您选定的区域不支持下文所述区域化处理，OpenAI也可能在区域外处理和临时存储客户内容，以提供服务。

### 非美国地区的额外要求

要将数据驻留用于美国以外的任何区域，你必须获得滥用监控控制的批准，并签署修改后的保留修正案。

选择阿拉伯联合酋长国区域需要额外批准。联系 [销售](https://openai.com/contact-sales) 以获得帮助。

### 如何使用数据驻留

数据驻留是按项目在你的API组织内配置的。

要为区域存储配置数据驻留，请在创建新项目时从下拉菜单中选择适当的区域。

对于配置了数据驻留的项目的请求，请在每次请求中添加下表中定义的域前缀。

#### 按请求选择处理区域

作为创建区域特定项目的替代方案，你可以通过使用带有来自全球地理项目的API密钥的前缀域，为单个请求选择区域处理。

现有的资格和数据保留控制要求仍然适用。所选端点和模型还必须支持区域处理，如下表所示。

以下示例复用一个客户端和一个来自全球项目的API密钥，用于全球、美国和欧盟的请求：

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


### 哪些模型和功能符合数据驻留要求？

以下模型和 API 服务目前符合下方指定区域的数据驻留要求。

使用 **按区域支持情况** 比较区域能力，并扩展每个区域可用的服务。使用 **API 端点、工具和模型支持** 查看完整的模型列表和详细的服务视图。区域存储支持并不表示区域处理支持。

#### 按区域提供的支持

完整的、未经筛选的区域支持表如下。每项服务的模型快照列于 **API 端点、工具和模型支持**。当区域处理仅支持部分快照时，该子集将包含在处理服务单元格中。

| 地区                     | 域名前缀       | 区域存储 | 区域处理 | 需要 MAM 或 ZDR | 支持的模式             | 存储服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 处理服务                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
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
| 阿拉伯联合酋长国\*     | `ae.api.openai.com` |       是        |         是         |         是         | 文本、音频、语音、图像   | `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech`<br />`/v1/batches`<br />`/v1/chat/completions`<br />`/v1/embeddings`<br />`/v1/files`<br />`/v1/fine_tuning/jobs`<br />`/v1/images/edits`<br />`/v1/images/generations`<br />`/v1/moderations`<br />`/v1/responses`<br />`/v1/responses File Search`<br />`/v1/responses Web Search`<br />`/v1/vector_stores`<br />`Code Interpreter tool`<br />`File Search`<br />`File Uploads`<br />`Remote MCP server tool`<br />`Scale Tier`<br />`Structured Outputs (excluding schema)`<br />`Supported input modalities`                                                                                                                  | `/v1/chat/completions` (`gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)<br />`/v1/embeddings` (`text-embedding-3-large`)<br />`/v1/responses` (`gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`)                                                                                                                                                                                                                                                                                                                                                                                         |

\* 在这些地区使用图像支持需获准启用增强型零数据保留或增强型修改滥用监控。

\*\* 需要零数据保留、修改滥用监控、Eyes Off 或安全保留。

#### API 端点、工具与模型支持

| 端点或功能                                                  | 服务          | 存储区域                           | 处理区域                                              | 支持的模型和快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 区域处理快照例外情况                                                                    | 备注                                                                                                       |
| -------------------------------------------------------------------- | ---------------- | ----------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/v1/audio/transcriptions, /v1/audio/translations, /v1/audio/speech` | 音频            | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `tts-1`, `whisper-1`, `gpt-4o-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/batches`                                                        | 批处理          | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 无                                                                                                       | —                                                                                                           |
| `/v1/chat/completions`                                               | 聊天补全 | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）、阿拉伯联合酋长国 | `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-2025-08-07`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-mini-2025-01-31`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125`                                                                                                                                      | 阿拉伯联合酋长国： `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11`                           | —                                                                                                           |
| `/v1/embeddings`                                                     | 嵌入       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）、阿联酋 | `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 阿联酋： `text-embedding-3-large`                                                             | —                                                                                                           |
| `/v1/evals`                                                          | Evals            | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/files`                                                          | 文件            | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/fine_tuning/jobs`                                               | 微调      | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 无                                                                                                       | —                                                                                                           |
| `/v1/images/edits`                                                   | 图像           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/images/generations`                                             | 图像           | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `gpt-image-2`, `gpt-image-1`, `gpt-image-1.5`, `gpt-image-1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 无                                                                                                       | —                                                                                                           |
| `/v1/moderations`                                                    | 审核       | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `omni-moderation-latest`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime`                                                       | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime`, `gpt-realtime-1.5`, `gpt-realtime-mini`, `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/transcription_sessions`                                | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-whisper`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 无                                                                                                       | —                                                                                                           |
| `/v1/realtime/translations`                                          | 实时         | 美国、欧洲（EEA + 瑞士） | 美国、欧洲（EEA + 瑞士）                       | `gpt-realtime-translate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 无                                                                                                       | —                                                                                                           |
| `/v1/responses`                                                      | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）、阿拉伯联合酋长国 | `gpt-5.5-pro-2026-04-23`, `gpt-5.4-pro-2026-03-05`, `gpt-5.2-pro-2025-12-11`, `gpt-5-pro-2025-10-06`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5-2025-08-07`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-5.2-2025-12-11`, `gpt-5.1-2025-11-13`, `gpt-5-mini-2025-08-07`, `gpt-5-nano-2025-08-07`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, `gpt-4.1-nano-2025-04-14`, `o3-2025-04-16`, `o4-mini-2025-04-16`, `o1-pro`, `o1-pro-2025-03-19`, `o3-mini-2025-01-31`, `o1-2024-12-17`, `gpt-4o-2024-11-20`, `gpt-4o-2024-08-06`, `gpt-4o-mini-2024-07-18`, `gpt-4-turbo-2024-04-09`, `gpt-4-0613`, `gpt-3.5-turbo-0125` | 阿拉伯联合酋长国： `gpt-5.5-pro-2026-04-23`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.2-2025-12-11` | —                                                                                                           |
| `/v1/responses File Search`                                          | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/responses Web Search`                                           | Responses        | 所有列出的区域                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `/v1/vector_stores`                                                  | 向量存储    | 所有列出的区域                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `Code Interpreter tool`                                              | 工具            | 所有列出的地区                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `File Search`                                                        | 工具            | 所有列出的地区                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | —                                                                                                           |
| `File Uploads`                                                       | 文件            | 所有列出的地区                        | 无                                                            | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 无                                                                                                       | 与 base64 文件上传一起使用时支持。                                                               |
| `Remote MCP server tool`                                             | 工具            | 所有列出的地区                        | 美国、欧洲（欧洲经济区 + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | MCP 服务器是第三方服务。发送到 MCP 服务器的数据受其数据驻留政策约束。 |
| `Scale Tier`                                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `Structured Outputs (excluding schema)`                              | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | 服务级支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | None                                                                                                       | —                                                                                                           |
| `Supported input modalities`                                         | 其他            | 所有列出的区域                        | 美国、欧洲（EEA + 瑞士）                       | `Text`, `Image`, `Audio/Voice`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | None                                                                                                       | —                                                                                                           |



### 端点限制

#### /v1/chat/completions

- 无法在非美国区域设置 store=true。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的区域，OpenAI 可能需要在区域之外处理和临时存储客户内容以提供服务。

#### /v1/responses

- 无法在欧盟地区设置 background=True。
- [扩展提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention) 在不支持区域处理的地区，OpenAI可能需要在该区域之外处理和临时存储客户内容以提供服务。

#### /v1/realtime

追踪目前不符合欧盟数据驻留要求， `/v1/realtime`.

## 企业密钥管理（EKM）

企业密钥管理（EKM）允许你使用由你自己的外部密钥管理系统（KMS）管理的密钥，对你在 OpenAI 的客户内容进行加密。

配置后，EKM 适用于任何 [应用程序状态](#types-of-data-stored-with-the-openai-api) 在你使用平台期间创建的内容。有关 EKM 的工作原理以及如何与你的 KMS 提供商集成的更多信息，请参阅 [EKM 帮助中心文章](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) 。

### EKM 限制

OpenAI 支持使用 AWS KMS、Google Cloud (GCP) 和 Azure Key Vault 中的外部账户进行自带密钥 (BYOK) 加密。如果你的组织使用不同的密钥管理服务，这些密钥需要同步到受支持的云 KMS 提供商之一，才能与 OpenAI 一起使用。

EKM 不支持以下产品。在启用 EKM 的项目中尝试使用这些端点将返回错误。

- 助手 (/v1/assistants)
- 视觉微调