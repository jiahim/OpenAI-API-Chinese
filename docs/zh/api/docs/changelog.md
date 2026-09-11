# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

> 了解 OpenAI API 的最新功能与更新。

即将弃用的项目列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 10 日

特性 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。可构建全双工语音会话，允许在后端模型或 智能体 处理推理和工具调用的同时继续进行。

使用 Responses 委派配合 OpenAI 模型，或使用客户端委派连接你自己的后端。语音会话费用为每分钟 $0.05，按秒计费；后端模型和工具调用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示](https://developers.openai.com/api/docs/guides/live-prompting)，和 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 8

功能 · API: v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 Responses API 中面向 GPT-5.6 及更高版本的支持模型正式上线。

对比上次响应的缓存复用情况，识别缓存未命中的原因，并参考故障排查指南提升缓存复用率。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API: v1/images · API: v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) ，可通过 Image API 以及 Responses API 的图像生成工具进行图像生成与编辑。

在编辑精度至关重要的工作流中使用 Sunburst，或在需要快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### 9 月 3 日

功能 · 模型：gpt-6-astra · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最困难的端到端任务而打造。

将 GPT-6 Astra 用于推理、编程、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求推进到最终结果，使用你提供的上下文和工具。

迁移时需要考虑的关键变更：

- GPT-6 Astra 不支持 `none` 推理 effort 等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果使用 Chat Completions 调用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [一致性监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在支持的 Responses API 请求中，异步检查 智能体 工作期间的潜在问题。检查可能触发安全告警，或暂停对话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示与迁移指导。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 以获取浏览器与桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理档位。

### 9 月 3 日

功能 · API: v1/responses

在 Responses API 中为 GPT-6 Astra 的长时间运行任务新增了控制能力：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：在你的应用运行函数或自定义工具时让模型继续工作，然后在结果可用时将其返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行过程中通过 WebSockets 发送额外指令，以便模型能够纳入更正或变化的需求。
- [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，为困难任务提高推理强度，或为常规跟进降低推理强度。

### Sep 2

更新

更新了 API 错误，使应用程序能够区分流量增长过快与临时性的模型过载。

流量增长过快时，可能返回带有 429 `429` 错误码的响应，而临时性的模型过载则返回带有 503 `slow_down` 错误码的响应。两种响应都可能包含 Retry-After `503` 错误码的响应，而临时性的模型过载则返回带有 503 `server_is_overloaded` 头字段。当该头字段存在时，重试前至少等待其指定的时间；如果不存在，则使用指数退避策略。请参阅 `Retry-After`。当该头字段存在时，重试前至少等待其指定的时间；如果不存在，则使用指数退避策略。请参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

连接至 `api.openai.com` 现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已面向 OpenAI API 全面开放。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，访问权限由你所在组织的角色和权限控制。

### Aug 26

Update · Model: whisper-1 · Model: gpt-4o-transcribe · Model: gpt-4o-mini-transcribe · Model: gpt-4o-transcribe-diarize · API: v1/audio/transcriptions · API: v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 关停。请迁移到 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026 年 8 月 26 日停用。请迁移到 Responses API 和 Conversations API，并使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用带有 API 密钥的前缀域，为单个请求选择区域处理，前提是该 接口 密钥来自具有 Global 地理设置的项目。现有的资格、数据保留控制、端点和模型支持要求仍然适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现已调整为每百万输入 token 4 美元、每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续至 2026 年 11 月 21 日。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。你可以跟踪缓存命中率随时间的变化、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的分布情况，从而了解缓存效率并发现可改进之处。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现在在以下接口中以预览版形式提供： `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 图像生成工具中。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。更多信息请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8月13日

公告

宣布推出 Ultrafast 模式，这是适用于 GPT-5.6 Sol 的全新 API 服务层级，运行速度最高可达 Standard 处理的 14 倍。目前仅向部分客户提供限量预览。注册以接收有关 Ultrafast 模式的更新 [此处](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型: gpt-5.6-cyber · 模型: gpt-daybreak-red-latest · 模型: gpt-daybreak-blue-latest · API: v1/responses

Daybreak 现为已获授权的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。可用于在明确授权的任务中将安全发现转化为已验证的修复。

大多数防御性安全工作可从 Daybreak Blue 入手。它提供对通用模型的访问，例如 GPT-5.6 Sol，可用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析以及补丁验证。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经另行审批的访问权限，可使用专门训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) ，用于经授权的漏洞复现、漏洞利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要另行审批与开通。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。定价更多详情 [此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) API，但可自由使用此模型测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

快速模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今日，超过 272K token 的长上下文提示可在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度最高可达 Standard 层的 2.5×。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。中按 API 密钥对数据进行筛选和分组。 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API 密钥维度，用于程序化报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 价格降低 80%，GPT-5.6 Terra 价格降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) ，它将在 API 中取代我们原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现以两倍的价格提供最高 2.5 倍的处理速度。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### 7 月 29 日

功能

发布了官方 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API Platform 资源。

配置并管理项目、用户、群组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审阅并应用更改、导入现有资源，以及检测并协调配置漂移。可从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转写以及已提交 Realtime 轮次的最终转写文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟的流式转写。

两个模型都支持自由形式的转写上下文、关键词提示以及多种预期输入语言。在此处比较支持的输出与工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台的组织和项目新增硬性支出上限。可设置月度上限，当受跟踪的支出达到该上限时，相关 API 请求将返回 `429` 错误。使用支出提醒可在流量中断前收到通知。更多信息请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

特性 · 模型: gpt-5.6-sol · 模型: gpt-5.6-terra · 模型: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于在智能与成本之间取得平衡的 GPT-5.6 Terra，以及面向高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式的提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度与 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，和 [面向 Responses API 的多智能体编排（测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持按原始尺寸接收图像，并提供 `original` 或 `auto` 图像细节参数。

### Jul 6

Feature · Model: gpt-realtime-2.1 · Model: gpt-realtime-2.1-mini · API: v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，这是一款更新的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时还发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，这是一款速度更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026年6月

### 6月24日

更新 · 模型：chat-latest

已更新 `chat-latest` 快照，该快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) API，但可自由使用此模型测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了安全使用仪表板。安全仪表板根据请求中发送的用于识别最终用户的值，来显示被拦截的 Responses 请求。 `safety_identifier` 请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API: v1/responses

网页搜索现在可以与常规文本结果一起返回图片结果。当你的应用需要最新或基于网络的视觉内容时（例如产品照片、地标、地点、活动或视觉参考），可使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了 OpenAI API 平台的全新导航设计，请访问 [此处](https://platform.openai.com/login).

### Jun 4

功能 · 模型：omni-moderation-latest · API: v1/responses · API: v1/chat/completions

已为 Responses API 和 Chat Completions API 新增审核评分。在生成请求中传递 `moderation` 对象，即可在同一响应中同时获得模型输入和生成输出的审核结果。

更多信息请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体 Builder。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解下线时间和迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，不再按完整的 20 分钟会话费率计费。底层的每分钟费率保持不变。

此次更新旨在为较短的会话提供更精细的计费方式，从而降低客户的实际成本。

你可以在我们的 [API 计费文档中查看当前内置工具的价格](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 现已在 Amazon Bedrock 中通过兼容 OpenAI 的 Responses API 端点提供。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API：v1/responses · API：v1/chat/completions · API：v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` ，而不是 `in_memory`，从而默认启用扩展的提示词缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) API，但可自由使用此模型测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 26 日

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可以使用外部签发的身份令牌换取短期 OpenAI 访问令牌，而无需存储长期 API 密钥。

### 5 月 26 日

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，可用于管理支出告警、模型允许列表、数据保留设置以及 托管工具 权限，并查询精细化的账单明细条目。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 让受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 以及 AgentKit）能够通过客户自托管的 `tunnel-client` 连接到私有或本地部署的 MCP 服务器，而无需将这些服务器暴露在公网上。

### May 19

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

Update · Model: dall-e-2 · Model: dall-e-3 · API: v1/realtime

已弃用 DALL·E 模型快照和 Realtime API 公开测试版。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 被弃用并从 API 中移除。建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 。

Realtime API 公开测试版已于 2026-05-12 被弃用并从 API 中移除。如果你仍在使用该 Beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5月11日

功能 · API: v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以开启更长时间的 GPT-5+ 推理 网页搜索 运行，适用于高强度的研究与评估工作负载。

### 5月7日

特性 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，这是一款全新的实时语音模型，可为语音到语音的智能体配置可定制的推理能力，同时还提供 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

已更新 [实时和音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转录，并将实时提示工程相关内容移入 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### 5月7日

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。它能帮助你在 Codex 中构建 AI 应用和智能体，并提供 OpenAI Platform 访问权限以及 OpenAI API 配置指导。

### 5月6日

更新

更新后的 Agents SDK 现已可用于 TypeScript，原生支持沙箱 智能体 并内置开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用,但你可以使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

更新

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，面向复杂专业工作的全新前沿模型，添加到 Chat Completions 和 Responses API 中，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求，以应对受益于更多算力的更棘手问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、apply patch、Skills、MCP 以及 网页搜索。主要更新包括：
- 推理力度现在默认设为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存。不支持内存中的提示缓存。
了解详情 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，享受 50% 折扣。

### 4 月 15 日

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来新功能，包括：
- 在受控沙箱中运行智能体；
- 检查并定制开源 harness；以及
- 控制记忆的创建时机与存储位置。

## 2026年3月

### 3月17日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 与 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带到一个更快、更高效的模型中，适用于高吞吐场景；而 GPT-5.4 nano 则针对简单的高吞吐任务进行了优化，在这些场景中，速度与成本最为关键。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### 3月16日

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个小错误，相关问题是 `input_image` 在 GPT-5.4 中的输入。某些图像理解用例现在可能会看到质量提升。无需任何操作。

### 3月 12日

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用的角色参考、长达 `20` 秒的生成、 `1080p` 分辨率输出、 `sora-2-pro`、视频扩展功能以及对 API 的批量支持，可处理 `POST /v1/videos`. `1080p` 生成任务，按 `sora-2-pro` 按秒计费。了解更多 `$0.70` 。 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3月 12日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` ，用于编辑已有视频。该接口将取代 `POST /v1/videos/{video_id}/remix`，后者将于 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3月5日

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已接入 Chat Completions 和 Responses API，并发布 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 到 Responses API，用于可受益于更多算力的更困难问题。

同步发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，它允许模型将大型工具面延迟到运行时再加载，以减少 token 使用量、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供 `computer` 基于屏幕截图的 UI 交互工具。
- 100 万 token 上下文窗口，以及面向长时间运行的原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持，用于更长时间的 智能体 工作流。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 接入 Chat Completions 和 Responses API。该模型指向当前 ChatGPT 中使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses · API：v1/chat/completions

已扩展 `input_file` 支持接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API: v1/responses

已发布 `phase` 到 Responses API。它会将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2月 23日

功能 · API: v1/responses

为 Responses API 推出了 WebSocket 模式。了解详情 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2月 23日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API: v1/realtime · API: v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2月 10日

功能 · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，和 `gpt-image-1-mini`.

### 2月 10日

更新 · Model: gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 2月 10日

功能 · API: v1/responses

推出 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能（位于 Responses API 中）。

### 2月 10日

功能 · API: v1/responses

推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持（位于 Responses API 中）。我们同时支持本地执行与基于托管容器的 Skills 执行。

### 2月 10日

功能 · API: v1/responses

推出新的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器联网。

### Feb 9

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增了对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` (以及可选的 `mask`) 与 `image_url` 或 `file_id` 引用，而无需进行 multipart 上传。

### 2月3日

更新 · Model: gpt-5.2 · Model: gpt-5.2-codex

我们已为 API 客户优化了推理栈，且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在的运行速度提升了约 40%。模型及模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

宣布 [Open Responses](https://www.openresponses.org/)：一个用于构建多提供商、可互操作 LLM 接口的开源规范，建立在最初的 OpenAI Responses API 之上。

### Jan 14

功能 · 模型：gpt-5.2-codex · API：v1/responses

已发布 `gpt-5.2-codex` 至 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。阅读更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 段。 `sip.api.openai.com` 启用 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 替代 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了以下问题： `gpt-image-1.5` 和 `chatgpt-image-latest` 在对图片进行编辑时错误地使用了高保真模式， `/v1/images/edits`，即使 `fidelity` 被明确设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### 12 月 16 日

功能 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。阅读更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，适用于符合条件的客户。

### Dec 11

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相比此前的 GPT-5.1 有所改进:
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 在 API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新内容包括新增的 xhigh 推理强度等级、精简的推理摘要以及基于压缩的全新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 进行的长时间会话，你可以使用该 `/responses/compact` 端点来压缩每次对话轮次所发送的上下文。

### 12 月 4 日

特性 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 至 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长时程、智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。现在，你可以在使用 Realtime 旁路连接时接收 DTMF 事件。参见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

Feature · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1), GPT-5 模型系列中的最新旗舰模型。GPT-5.1 经过专门训练，在以下方面尤为擅长：

- 在无需深度思考时实现更强的可控性和更快的响应
- 代码生成与编程类用例
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以在所需思考更少时提供更快的响应——这与之前 GPT-5 中的默认设置不同。 `medium` GPT-5 中的默认设置。

### Nov 13

功能

已发布 [增强的基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 让你可以决定谁能在整个组织和项目中执行哪些操作——无论是通过 API 还是在 Dashboard 中。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 至 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。详细了解 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留可使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展的提示缓存通过在内存已满时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### 10 月 24 日

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥来加密你在 OpenAI 的客户内容。

### 10 月 24 日

功能

已发布 [UK 数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力进行更深入的思考，从而持续提供更优的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，提供更具性价比的语音对语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，提供更具性价比的图像生成与编辑。

推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，借助我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、细腻且富有动态感的视频生成与混剪。

推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，以可视化方式创建自定义的多智能体工作流。

推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

推出 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能将 API 访问限制为你所指定的 IP 地址或地址段。

## September, 2025

### Sep 26

功能 · API: v1/responses

新增支持将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### Sep 23

Feature · Model: gpt-5-codex · API: v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex),专为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已全面上线。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API: v1/responses

新增了对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是由 OpenAI 维护的 MCP 封装，用于 Google 应用、Dropbox 等热门服务，可让模型读取这些服务中存储的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

已发布 Conversations API，它允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，和 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，可在支持推理的 GPT-5 模型中优化响应速度。

引入了 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型传入自由格式的输入并从模型获取自由格式的输出。

## 2025 年 6 月

### 6 月 27 日

功能

推出对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing)。与标准处理相比，优先级处理在保持按需付费灵活性的同时，提供了显著更低且更稳定的延迟。

### 6月24日

特性 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，即我们 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。在 [deep research 指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对异步事件处理的支持，配合 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [下调并简化定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API: v1/responses

[全新可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台中提供，并 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。借助 API，你现在可以通过 `prompt` 参数（使用一个提示词 `id`、可选的 `version`）并提供动态的 `variables` ，其中可以包含字符串、图像或文件输入。Chat Completions 中暂不支持可复用提示词。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，通过更多算力来回答难题，提供更好的推理能力与一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括 batch 和 flex 处理。

### Jun 4

功能 · API：v1/fine_tuning

为以下模型新增微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 。 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，和 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · APIAPI：v1/chat/completions · 接口：v1/realtime

以下模型提供新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API: v1/responses

新增对 Responses API 中新内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

功能 · API：v1/responses · API：v1/chat/completions

新增对在使用非微调模型进行并行工具调用时， `strict` 模式用于工具架构的支持。
新增了 [架构功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 和其他模式的字符串校验，以及为数字和数组指定范围。

### May 15

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 针对 API 中的代码任务进行了优化，可与 [Codex CLI](https://github.com/openai/codex).

### 5月7日

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

推出对 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。配合使用。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现可用于微调。

## 2025 年 4 月

### 4 月 30 日

功能

推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API: v1/images/generations · API: v1/images/edits

新增了一款图像生成模型, `gpt-image-1`。该模型在图像生成质量与指令遵循方面设立了新的标准。

更新了图像生成与编辑接口，以支持该模型 `gpt-image-1` 特有的新参数。

### Apr 16

功能 · API：v1/chat/completions · API：v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编码、视觉推理任务以及技术写作方面树立了新标准。

推出 Codex（我们的代码生成 CLI 工具）。

### Apr 14

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，和 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入 API。这些新模型在指令遵循、编码能力上有所提升，并具备更大的上下文窗口（最高可达 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 支持有监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `whisper-1` models 接口添加到音频 API。

### 3月19日

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的一个版本，通过更多算力来回答难题，提供更好的推理能力与一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多个新模型和工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的全新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 发布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计于 2026 年下线（在实现完全功能对等之后）。

### 3 月 3 日

Feature · API: v1/fine_tuning/jobs

新增 `metadata` 字段支持到微调作业。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览版本——这是我们迄今为止最大、能力最强的聊天模型。GPT-4.5 具备较高的“情商”（EQ）和对用户意图的理解能力，使其在创意任务和智能体规划方面表现更出色。

### 2 月 25 日

功能

已发布 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新回应了大家对更多数据筛选条件的诉求，例如项目选择、日期选择器以及更细粒度的时间区间。同时，对跨不同产品和服务层级查看用量也提供了更好的支持。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解详情 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini),一款全新的小型推理模型,针对科学、数学和编程任务进行了优化。

### Jan 21

功能 · 模型：o1

扩展对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，能够执行复杂的推理任务。

## 2024 年 12 月

### 12 月 18 日

功能

推出 [管理员 API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，允许客户以编程方式轮换其管理员 api 密钥。

已更新 [管理员 API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，允许客户在将用户邀请加入组织的同时，以编程方式将其邀请加入项目。

### Dec 17

Feature · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

为以下模型新增 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下 API 新增 WebRTC 连接方式 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出偏好微调，使用 [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

发布了适用于 Go 和 Java 的 SDK 测试版。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 支持，详情见 [Python SDK](https://github.com/openai/openai-python).

### 12 月 4 日

功能

推出 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够通过编程方式查询 OpenAI API 的活动与支出。

## 2024年11月

### 11 月 20 日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Nov 4

功能 · API：v1/chat/completions

已发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs)，可以大幅降低模型响应的延迟，前提是响应的绝大部分内容是预先已知的。这在重新生成仅做了少量修改的文档和代码文件内容时最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增了五种新的语音类型，位于 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

Feature · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于聊天补全，支持音频输入和输出。使用与 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

Feature · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI DevDay 旧金山](https://openai.com/devday/):

[Realtime 接口](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在你的应用中快速构建语音到语音的体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出微调高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit)：在 playground 中使用“生成”按钮轻松生成提示、函数定义和结构化输出架构。

## 2024 年 9 月

### Sep 26

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它同时支持图像和文本（仅适用于部分类别），支持两个新增的纯文本有害类别，并提供更准确的评分。

### Sep 12

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这些是通过强化学习训练的新型大型语言模型，用于执行复杂的推理任务。

## 2024 年 8 月

### 8 月 29 日

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API: v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8 月 15 日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Aug 1

更新

推出 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户通过 接口 以编程方式管理其组织，并使用审计日志监控变更。审计日志记录必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

推出 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费方案的企业客户针对其所需的 IDP 配置身份验证。

### 7 月 23 日

更新

推出 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例中实现更高的性能。

### 7 月 18 日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), 一款经济实惠的智能小模型，适用于快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分片方式上传大文件。

## 2024年6月

### 6月6日

更新

[Parallel function calling](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传入来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### Jun 3

更新

新增了对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024-05

### May 15

更新

新增了对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者可以访问此功能。

新增了对 [设置成本限制](https://platform.openai.com/settings/organization/general) ，针对按量付费客户按项目进行设置。

### 5 月 13 日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们速度最快且性价比最高的旗舰模型。

### 5 月 9 日

更新

新增了对 [输入图像给 Assistants API。](https://developers.openai.com/api/docs/assistants/migration)

### 5月7日

更新

新增了对 [微调模型至 Batch API](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5月6日

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数应用于 Chat Completions 和 Completions APIs。设置该参数后，开发者在使用流式传输时可获取用量统计信息。

### 5 月 2 日

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 的线程中删除消息。

## April, 2024

### Apr 29

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API 中。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出了一系列 [Assistants API 更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一款新的 文件搜索 工具，每个智能体最多支持 10,000 个文件，新增的 token 控制，以及对工具选择（tool choice）的支持。

### Apr 16

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) ，并按项目维度管理速率与成本限额（成本限额仅对企业客户开放）。

### 4 月 15 日

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式发布

### Apr 4

更新

新增了对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增了对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增了对 [创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### 4 月 1 日

更新

新增了对 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024年3月

### 3月29日

更新

新增了对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant 消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增了对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### Feb 9

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到音频 API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布了 Embedding V3 模型以及更新的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## December, 2023

### Dec 20

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以在 Assistants API 中运行创建操作

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 传递给 Chat Completions API

### 12月14日

更新

已更改 [function parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用上的参数为可选

## November, 2023

### Nov 30

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [在 API 中使用 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，和 [文字转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
