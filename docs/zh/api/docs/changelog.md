# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

> 该公司 OpenAI API 的最新功能与更新。

即将进行的弃用项列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 25 日

修复 · 模型：gpt-6-sol · 模型：gpt-6-luna

修复了图像编码中导致图像理解能力下降的问题，影响 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。此次更新提升了 API 和 Codex 在视觉任务（包括计算机使用）上的表现。

如果你的用例涉及图像输入，建议重新运行评估并重试受此问题影响的工作流。

### Sep 22

功能 · 模型：gpt-6-sol · 模型：gpt-6-luna · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions API 生成文本。

输入 token 最多 272K 的提示的标准定价（每 1M token）：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较各模型的能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 信息，了解缓存写入、更长提示以及其他处理层级的费用。

### 9月15日

功能

在组织和项目级别新增了 API 密钥创建管控功能。管理员可设置为仅允许服务账号密钥、仅允许用户拥有的项目密钥，或禁止所有新 API 密钥的创建。组织级别的限制优先于项目设置，且现有的 API 密钥不受影响。详见 [生产最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### 9月10日

功能

你现在可以在创建项目 API 密钥时设置过期时间。管理员还可以在 Platform 设置中按组织或项目级别强制设置最大密钥生命周期，要求新创建的密钥必须在配置的期限内过期。详见 [生产最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 以获取密钥过期与轮换的指引。

### 9月10日

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公开测试版。使用托管的 Codex 执行环境构建智能体，由 OpenAI 负责会话编排、上下文压缩与恢复。

使用持久会话跨轮次继续工作、流式传输进度，并连接你自己的工具和 MCP 服务器。可以在 OpenAI 托管的沙箱中运行智能体，也可以连接你自己基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### 9月10日

特性 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 全面上线。构建可在后端模型或智能体处理推理和工具调用的同时持续进行的全双工语音对话。

使用 Responses 委托方式配合 OpenAI 模型，或使用客户端委托方式连接你自己的后端。语音会话费用为 $0.05 每分钟，按秒计费；后端模型和工具使用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指引](https://developers.openai.com/api/docs/guides/live-migration)。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 8

功能 · API：v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 Responses API 中面向 GPT-5.6 及更高版本的受支持模型正式发布。

对比先前响应中的缓存复用情况，明确缓存未命中的原因，并按照故障排查指引改进缓存复用。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 现可通过 Image API 和 Responses API 的图像生成工具用于图像生成与编辑。

在对编辑精度要求最高的工作流中使用 Sunburst，或在需要快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。参见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现已通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已批准的生命科学内部研究正式开放。

标准定价为每 1M 输入 token 5 美元、每 1M 缓存输入 token 0.50 美元、每 1M 输出 token 25 美元。计费自 2026 年 10 月 5 日开始。参见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 3

特性 · 模型：gpt-6-astra · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最艰难的端到端任务而构建。

使用 GPT-6 Astra 进行推理、编程、计算机操作、研究与文档创建。它结合这些能力，将复杂任务从初始请求推进到最终成果，全程利用你提供的上下文和工具。

迁移时需要考虑的关键变化：

- GPT-6 Astra 不支持 `none` reasoning effort 档位。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或 log probabilities（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请遵循 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [偏离监测](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，会异步检查 智能体 工作期间的潜在问题。这些检查可能触发安全告警，或暂停某个会话以便审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示和迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 以处理浏览器和桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### Sep 3

功能 · API：v1/responses

为 GPT-6 Astra 的长时间运行任务新增了控制能力，集成于 Responses API 中：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling):让你的应用在运行函数工具或自定义工具的同时让模型继续工作，然后随结果可用逐步返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering):在响应进行过程中通过 WebSockets 发送额外指令，让模型能够纳入修正或变化的需求。
- [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation):在保留已缓存提示前缀的同时，对困难任务提高强度，或对例行跟进降低强度。

### 9月2日

更新

更新了 API 错误，使应用能够区分流量增长过快与临时性的模型过载。

流量增长过快可能返回 `429` 错误，错误码为 `slow_down` 。临时模型过载返回 `503` 错误，错误码为 `server_is_overloaded` 错误。两种响应都可能包含 `Retry-After`。当存在该响应头时，重试前至少等待其指定的时长；若缺失，请使用指数退避。参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

与 `api.openai.com` 的连接现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 中正式发布。你可以直接在 [平台控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，访问权限由你所在组织的角色和权限控制。

### 8 月 26 日

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 关停。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转写指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请迁移至 Responses API 和 Conversations API，方法是使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过在 API key 前添加域名前缀（使用来自 Global 地域项目的密钥）来为单个请求选择区域化处理。现有的资格、数据保留控制、端点和模型支持要求仍然适用。详情请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 的输入价格现为每百万 token 4 美元，输出价格为每百万 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) on the OpenAI API 平台上。跟踪缓存命中率随时间的变化、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的分布，以了解你的缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在以下 接口 的预览版中提供 `gpt-image-2` 和 `gpt-image-2-2026-04-21` in the Images API 和 Responses API 图像生成工具中，设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

宣布推出 Ultrafast 模式，这是一项面向 GPT-5.6 Sol 的全新 API 服务层级，速度比标准处理快多达 14 倍。该模式以限量预览形式向部分客户提供。请注册以接收 Ultrafast 模式的更新 [此处](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现已为已获批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以使用它们，在明确授权的测试中，将安全发现推进到经验证的修复。

在大多数防御性安全工作中，建议从 Daybreak Blue 入手。它提供对通用模型（例如 GPT-5.6 Sol）的访问，用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经单独批准的对专用训练模型的访问，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已授权的漏洞复现、利用验证、渗透测试、红队演练和复杂系统分析。

这些模型需要单独批准和配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### 8 月 6 日

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，它指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境的 API 调用，但你可以随意使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

Fast 模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今日，超过 272K tokens 的长上下文提示可在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度最高可比 Standard 层级快 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [用量与费用仪表板](https://platform.openai.com/settings/organization/usage)。中按 API key 筛选和分组数据。API [用量 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [费用 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API key 维度，用于以编程方式进行报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格降低了 80%，GPT-5.6 Terra 的价格降低了 20%。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还在推出 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 在 API 中，它取代了我们原有的 Priority Processing 产品。对于 GPT-5.6 Sol，Fast 模式现在可提供比标准处理快至 2.5 倍的速度，价格为标准处理的两倍。此更改向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API Platform 资源。

配置和管理项目、用户、群组、角色、访问分配、服务账号、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，以及检测和协调配置偏差。可从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

Feature · Model: gpt-transcribe · Model: gpt-live-transcribe · API: v1/audio/transcriptions · API: v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于准确的文件转录以及已提交 Realtime 轮次的最终转录文本， [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

两个模型均支持自由形式的转录上下文、关键词提示以及多种预期输入语言。在此处比较支持的输出与工作流： [转写指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出限制。设置月度上限，当追踪到的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。可以使用支出告警在流量中断之前进行通知。更多信息请参阅 [支出限制指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

特性 · 模型: gpt-5.6-sol · 模型: gpt-5.6-terra · 模型: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型家族](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于平衡智能与成本的 GPT-5.6 Terra，以及用于高效大批量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [面向 Responses API 的多智能体编排（测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像， `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具有改进的字母数字识别、静音和噪声处理以及打断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款速度更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` snapshot, which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 调用，但你可以随意使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了安全使用情况面板。安全面板会基于请求中发送的 `safety_identifier` 用于识别最终用户的值来展示被拦截的 Responses 请求。请访问 [安全面板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在可以与常规文本结果一同返回图片结果。当你的应用需要基于当前或网络的可视化内容（例如产品照片、地标、地点、活动或视觉参考）时，可以使用图片搜索。更多信息请参阅 [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，请访问 [此处](https://platform.openai.com/login).

### Jun 4

Feature · Model: omni-moderation-latest · API: v1/responses · API: v1/chat/completions

在 Responses API 和 Chat Completions API 中新增了审核评分。在生成请求中传入 `moderation` 对象，即可在同一次响应中同时获取模型输入和生成输出的审核结果。

了解更多请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月3日

更新

宣布弃用可复用的提示词对象、Evals 平台以及智能体构建器。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解下线时间表与迁移指南。

### 6月2日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，而不再按整个 20 分钟会话费率计费。底层的每分钟费率保持不变。

此次更新旨在为较短会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 计费文档中查看当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能特性 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现已通过兼容 OpenAI 的 Responses API 端点在 Amazon Bedrock 中可用。支持的模型和功能因 AWS 区域而异。 [了解详情](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026年5月

### 5月29日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而非 `in_memory`，默认启用扩展的提示缓存。 [了解详情](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 调用，但你可以随意使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月26日

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation). 受信任的工作负载可以使用外部颁发的身份令牌换取短时 OpenAI 访问令牌，无需存储长期 API 密钥。

### 5月26日

更新

新增了 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，可用于管理支出提醒、模型白名单、数据保留设置和 托管工具 权限，以及查询细粒度计费明细。

### May 19

功能

已发布 [安全 MCP 隧道](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 为企业客户提供。安全 MCP 隧道使受支持的 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 以及 AgentKit）能够通过客户自主托管的代理连接到私有或本地部署的 MCP 服务器 `tunnel-client` 而无需将这些服务器暴露到公共互联网。

### May 19

更新

你现在可以管理多个 IP 白名单，并将其分别应用于项目层级或整个组织。若要配置它们，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日被弃用并从 API 中移除。我们推荐使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API Beta 已于 2026 年 5 月 12 日被弃用并从 API 中移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### May 11

功能 · API：v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可选择启用更长的 GPT-5+ 推理 网页搜索 运行，适用于高投入度的研究和评估工作负载。

### May 7

Feature · Model: gpt-realtime-2 · Model: gpt-realtime-translate · Model: gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一个全新的实时语音模型，支持为语音到语音智能体配置推理功能，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) （用于流式语音翻译）和 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) （用于流式语音转文本）。

已更新 [Realtime 和音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) ，用于流式转录文本，并将实时提示指南整合到 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。这可以帮助你在 Codex 中借助 OpenAI Platform 访问和 OpenAI API 配置指引来构建 AI 应用和智能体。

### May 6

更新

更新后的 Agents SDK 现已可在 TypeScript 中使用，支持沙盒 智能体 并内置开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境 API 使用，但你可以使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照将定期更新。了解更多信息 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

Admin API 现已在适用于 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。详见 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 以了解设置说明和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，面向复杂专业工作的新前沿模型，已接入 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求中处理能受益于更多算力的更困难问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、apply patch、Skills、MCP 以及网页搜索。关键更新包括：
- Reasoning effort now defaults to `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时,模型现在使用 [原有行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展 prompt 缓存,不支持内存中的 prompt 缓存。
了解详情 [here](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一个用于图像生成和编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，并提供 50% 的折扣。

### Apr 15

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来全新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并自定义开源 harness；以及
- 控制记忆的创建时机与存储位置。

## 2026年3月

### 3月17日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到一款更快、更高效的模型中，适合高吞吐量工作负载；而 GPT-5.4 nano 则针对简单的高吞吐量任务进行了优化，在这些场景中速度和成本最为关键。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向当前 ChatGPT 中使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

我们更新了图像编码器以修复一个关于 `input_image` GPT-5.4 输入的小问题。部分图像理解用例的质量可能因此提升，无需任何额外操作。

### 3 月 12 日

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用，生成长度最长可达 `20` 秒， `1080p` 输出， `sora-2-pro`，视频扩展功能，以及 Batch API 对 `POST /v1/videos`. `1080p` 生成任务的支持， `sora-2-pro` 按秒计费。了解更多 `$0.70` 。 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑已有视频。该功能将取代 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3月5日

Feature · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) ，该模型已在 Responses API 中提供，适用于受益于更多算力的更复杂问题。

同时发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，让模型将大型工具面延迟到运行时再加载，从而减少 token 使用量、保持缓存性能，并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供 `computer` 工具，用于基于截图的 UI 交互。
- 1M token 上下文窗口以及原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，适用于运行时间更长的 智能体 工作流。

### Mar 3

Feature · Model: gpt-5.3-chat-latest · API: v1/chat/completions · API: v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026年2月

### 2月24日

功能 · API：v1/responses

扩展 `input_file` 对 Responses API 的支持，以接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多信息 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2月24日

功能 · API：v1/responses

已发布 `phase` 到 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2月24日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2月 23 日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2月 23 日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

Update · Model: gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向当前 ChatGPT 中使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

已发布 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，支持于 Responses API。

### 2 月 10 日

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，现已可在 Responses API 中使用，同时支持本地执行和基于容器的托管执行两种方式。

### 2 月 10 日

功能 · API：v1/responses

已发布全新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并新增容器网络支持。

### 2 月 9 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`），使用 `image_url` 或 `file_id` 引用而非 multipart 上传。

### 2 月 3 日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 的运行速度现在提升了约 40%。模型和模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

已公布 [Open Responses](https://www.openresponses.org/):一个用于在原有 OpenAI Responses API 之上构建多提供商、可互操作 LLM 接口的开源规范。

### 1 月 14 日

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### 1月13日

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 范围。 `sip.api.openai.com` 执行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解详情](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### 1月13日

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### 1月13日

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### 1月13日

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### 1 月 9 日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，其中 `gpt-image-1.5` 和 `chatgpt-image-latest` 通过以下途径对图像编辑错误地使用了高保真度： `/v1/images/edits`，即使 `fidelity` 被显式设置为 `low` （默认值）。

## 2025年12月

### 12月19日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

功能 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest),我们最新且最先进的图像生成模型。了解更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的改进。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

此次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持,适用于符合条件的客户。

### 12 月 11 日

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，这是 GPT-5 模型系列中最新一代的旗舰模型。GPT-5.2 在以下方面较前代 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 使用效率
- 多模态，尤其是视觉
- 代码生成，尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新特性包括新增的 xhigh 推理努力级别、简洁的推理摘要，以及使用压缩的全新上下文管理。

### 12 月 11 日

功能 · API: v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间对话，你可以使用 `/responses/compact` 端点来缩减你每次发送的上下文。

### Dec 4

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长时序智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025年11月

### 11月20日

功能 · API：v1/realtime

Realtime API 新增了对 DTMF 按键事件的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [相关文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，GPT-5 模型系列中全新的旗舰模型。GPT-5.1 经过训练，特别擅长以下方面：

- 在无需较多思考时可引导性和更快的响应
- 代码生成和编程相关用例
- 智能体工作流

注意，GPT-5.1 默认启用新的 `none` reasoning 设置，以在所需思考量较少时提供更快的响应——这与 GPT-5 中之前的默认设置不同。 `medium` 。

### Nov 13

功能

已发布 [增强的基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定组织内和各项目中谁能执行哪些操作——无论是通过 API 还是在 Dashboard 中。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是针对 Codex 或类似环境中的智能体编码任务优化的 GPT-5.1 版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展提示缓存保留可让缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存的工作原理是：在内存已满时将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025年10月

### 10月29日

特性 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). 企业密钥管理 (EKM) 允许你使用由你自有的外部密钥管理系统 (KMS) 管理的密钥，对你在 OpenAI 的客户内容进行加密。

### Oct 24

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

功能 · 模型: gpt-5-pro · 模型: gpt-realtime-mini · 模型: gpt-audio-mini · 模型: gpt-image-1-mini · 模型: sora-2 · 模型: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在以下活动发布了多项新功能 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro),它是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的其中一个版本，使用更多算力进行更深入的思考，从而持续提供更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音对语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成与编辑。

已发布 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，用于使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型进行丰富、细致且动态的视频生成和再创作。

已发布 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于通过可视化方式创建自定义的多智能体工作流。

已发布 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已发布 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能仅允许你指定的 IP 地址或地址段访问 API。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增支持将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 传入 Responses API。

### Sep 23

功能 · 模型：gpt-5-codex · API：v1/responses

推出了专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为与 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，支持 Google 应用、Dropbox 等热门服务，可用于授予模型对这些服务中所存储数据的读取权限。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布 Conversations API，允许你创建和管理与 Responses API 的长会话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

推出 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 值，以在支持推理的 GPT-5 模型中优化快速响应。

引入 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入和从模型输出自由格式的内容。

## 2025 年 6 月

### 6 月 27 日

功能

已推出对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing). 相比 Standard 处理，Priority processing 在保持按需付费灵活性的同时，可显著降低延迟并使其更加稳定。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，即我们 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对以下方式实现异步事件处理的支持： [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降价并简化定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增对以下功能的支持： [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已可在仪表板和 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中使用。通过 API，你现在可以通过 `prompt` 参数（通过提示词 `id`，可选的 `version`）引用在仪表板中创建的模板，并提供可包含字符串、图像或文件输入的动态 `variables` 。Chat Completions 中不提供可复用提示词。 [了解详情](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，通过更多算力来回答困难问题，从而获得更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### Jun 4

功能 · API：v1/fine_tuning

新增了对以下模型使用 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 进行微调的支持 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月3日

功能 · API：v1/chat/completions · API：v1/realtime

为以下模型提供新的快照版本： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [适用于 TypeScript 的 Agents SDK](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API：v1/responses

新增对 Responses API 中新内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解有关工具的更多信息](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API：v1/responses · API：v1/chat/completions

新增对使用以下模式的支持 `strict` 在将并行工具调用与非微调模型配合使用时，用于工具 schema 的模式。
新增了 [schema 特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对以下内容的字符串验证： `email` 以及其他模式，并为数字和数组指定范围。

### 5 月 15 日

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已发布 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对配合使用进行了优化 [Codex CLI](https://github.com/openai/codex).

### May 7

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已推出对 [强化学习微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025年4月

### 4月30日

功能

已推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### 4 月 23 日

特性 · API: v1/images/generations · API: v1/images/edits

新增了一款图像生成模型， `gpt-image-1`。该模型为图像生成树立了新标准，在画质和指令遵循方面都有所提升。

更新了图像生成与编辑接口，以支持该模型特有的新参数 `gpt-image-1` 。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增了两个 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学与编程、视觉推理任务以及技术写作方面树立了新的标准。

推出了 Codex——我们的代码生成命令行工具。

### 4 月 14 日

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) models 接入 API。这些新模型在指令遵循、代码生成方面有所改进，并具备更大的上下文窗口（最高 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 均可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型已接入音频 API。

### Mar 19

功能 · 模型：o1-pro · API: v1/responses · API: v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的一个版本，通过更多算力来回答困难问题，从而获得更好的推理能力和一致性。

### 3 月 11 日

功能 · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多款新模型和工具，并提供了一个用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 的功能迁移到更易使用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计将于 2026 年下线（达成完整功能对等之后）。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 为微调任务添加的字段支持。

## 2025年2月

### 2月27日

Feature · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了以下模型的研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——我们迄今为止最大且能力最强的对话模型。GPT-4.5 的高“情商”和对用户意图的理解使其在创意任务和智能体规划方面表现更佳。

### Feb 25

功能

推出了 [API 用量仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。本次更新响应了对更多数据筛选条件的需求，例如项目选择、日期选择器以及细粒度的时间区间。同时，更好地支持跨不同产品和服务层级查看用量。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已发布 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini),一款专为科学、数学和编码任务优化的小型推理模型。

### Jan 21

功能 · 模型：o1

扩展访问 [o1 模型](https://platform.openai.com/docs/models/o1)。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024年12月

### 12月18日

功能

已发布 [Admin API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其 admin api 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在用户被邀请加入组织的同时，以编程方式将其邀请加入项目。

### Dec 17

功能 · 模型: o1 · 模型: gpt-4o · 模型: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

新增模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

新增 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持系统或开发者消息。

推出基于 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出适用于 Go 和 Java 的 beta 版 SDK。 [了解详情](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持位于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已发布 [用量 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 上的活动与消费情况。

## November, 2024

### 11月20日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o),我们 gpt-4o 系列中的最新模型。

### 11 月 4 日

功能 · API：v1/chat/completions

已发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs)，可显著降低模型响应的延迟，前提是响应的绝大部分内容事先已知。这在仅对文档和代码文件做小幅改动后重新生成内容时最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

在 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

Feature · Model: gpt-4o-audio-preview · API: v1/chat/completions

已发布 [new `gpt-4o-audio-preview` model](https://developers.openai.com/api/docs/guides/audio) for chat completions, which supports both audio inputs and outputs. Uses the same underlying model as the [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

Feature · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在以下活动发布了多项新功能 [OpenAI DevDay in San Francisco](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime): Build fast speech-to-speech experiences into your applications using a WebSockets interface.

[Model distillation](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出来微调高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本来微调 GPT-4o，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，衡量模型在特定任务上的表现。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit)：在 playground 中使用 Generate 按钮轻松生成提示词、函数定义和结构化输出模式。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [new `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，支持图像和文本（部分类别），新增两个仅文本的危害类别，并且得分更加准确。

### Sep 12

Feature · Model: o1-preview · Model: o1-mini · API: v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning),通过强化学习训练、用于执行复杂推理任务的新型大型语言模型。

## 2024年8月

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8月15日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8 月 6 日

更新

已发布 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在可以可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o),我们 gpt-4o 系列中的最新模型。

### 8 月 1 日

更新

已发布 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户通过编程方式管理其组织并使用审计日志监控变更。审计日志记录功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已发布 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许采用自定义和无限计费模式的企业客户针对其所需的 IDP 设置身份验证。

### 7 月 23 日

更新

已发布 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例上实现更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，一款价格亲民的智能化小模型，适用于快速、轻量的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 用于分块上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传递 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### 6月3日

更新

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### 5 月 15 日

更新

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者可以访问此功能。

新增对 [设置成本限制](https://platform.openai.com/settings/organization/general) ，按项目为按量付费客户提供。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快、最实惠的旗舰模型。

### May 9

更新

新增对 [向 Assistants API 发送图片输入。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增对 [向 Batch API 提交微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数添加到 Chat Completions 和 Completions API 中。设置该参数后，开发者在使用流式传输时即可获取用量统计信息。

### May 2

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 中的对话线程里删除一条消息。

## 2024年4月

### 4月29日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

引入了一系列 [Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ,包括一个新的 文件搜索 工具,每个智能体最多支持 10,000 个文件、全新的 token 控制,以及对工具选择的支持。

### 4 月 16 日

更新

引入 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 用于按项目组织工作,包括创建 [API 密钥的功能](https://developers.openai.com/api/reference/overview) ,以及按项目维度管理速率和成本上限(成本上限仅对企业客户开放)。

### Apr 15

更新

已发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式发布

### Apr 4

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [adding Messages when creating a Run](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 过滤 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant message creation](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### 3月14日

更新

新增对 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## February, 2024

### 2 月 9 日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024年1月

### 1月25日

更新

发布了 embedding V3 模型和更新的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建操作

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数为可选

## 2023 年 11 月

### 11 月 30 日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [updated GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [DALL·E 3 in the API](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [text-to-speech API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增 `max_tokens` 至 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 至微调 API
