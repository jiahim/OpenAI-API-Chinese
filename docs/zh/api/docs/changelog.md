# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

> OpenAI API 的最新功能与更新。

即将进行的弃用列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 10 日

功能

你可以在创建项目 API 密钥时设置过期时间。管理员还可以在平台设置中的组织或项目层级强制设置最长密钥有效期，要求新创建的密钥在配置的期限内过期。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) ，获取关于密钥过期与轮换的指导。

### 9 月 10 日

功能

发布了 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公开测试版。使用托管的 Codex 编排器构建智能体，由 OpenAI 处理会话编排、上下文压缩与恢复。

使用持久化会话在多轮间延续工作、实时推送进度，并接入你自己的工具与 MCP 服务器。可在 OpenAI 托管的沙箱中运行智能体，也可接入来自你自己的基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### 9 月 10 日

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 已在 API 中正式发布。构建可在后端模型或智能体处理推理与工具调用时持续进行的全双工语音对话。

可使用 OpenAI 模型进行 Responses 委托，或使用客户端委托接入你自己的后端。语音会话费用为每分钟 0.05 美元，按秒计费；后端模型与工具使用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，和 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 了解详情。

### 9月8日

功能 · API：v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已在 GPT-5.6 及更高版本的 Responses API 中正式发布。

将缓存复用情况与上一次响应进行对比，识别缓存未命中的原因，并参考故障排查指南以提升缓存复用率。

### 9月8日

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 通过 Image API 以及 Responses API 的图像生成工具，可用于图像生成与编辑。

在编辑精度最关键的工作流中使用 Sunburst，或在追求快速、高质量的日常图像生成时使用 Flare。两个模型均支持新增的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的令牌费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 3

功能 · 模型: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最困难的端到端任务而打造。

使用 GPT-6 Astra 进行推理、编码、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求推进到最终完成结果，借助你提供的上下文和工具。

迁移时需要考虑的主要变化：

- GPT-6 Astra 不支持该 `none` 推理力度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果要在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [不一致监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，异步检查 智能体 工作期间的潜在异常。检查可能触发安全警报或暂停对话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解其能力、提示与迁移指南。探索 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 以支持浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 以了解可用的推理层级。

### Sep 3

功能 · API：v1/responses

在 Responses API 中为使用 GPT-6 Astra 的长时间运行任务新增了相关控制选项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让你的应用在运行函数或自定义工具的同时让模型继续工作，然后按可用情况返回结果。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行期间通过 WebSockets 发送额外指令，使模型能够纳入修正或变化的需求。
- [在对话过程中更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，为困难工作提高强度，或为常规跟进降低强度。

### Sep 2

更新

更新了 API 错误，以便应用能够区分流量增长过快与临时性的模型过载。

流量增长过快可能会返回带有 `429` 错误码的响应，而 `slow_down` 错误码对应临时性的模型过载。 `503` 错误码的响应，而 `server_is_overloaded` 错误码。两种响应都可能包含 `Retry-After`。当响应头存在时，重试前请至少等待其指定的时长；如果缺失，请使用指数退避策略。参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### 9 月 1 日

更新

到 `api.openai.com` 的连接现在可以使用 IPv6 了。

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 中全面可用。你可以直接在 [平台控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，访问权限由你组织的角色和权限控制。

### Aug 26

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `gpt-4o-transcribe-diarize`。这些模型将于 2027/02/26 下线，请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转写指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026 年 8 月 26 日停用。请迁移到 Responses API 和 Conversations API，并使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### 8月 21 日

功能

API 客户现在可以通过使用带有 API 密钥的前缀域，为单个请求选择区域处理，前提是该密钥所属的项目具有 Global 地理属性。现有的资格、数据保留控制、端点和模型支持要求继续适用。详细了解请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### 8月 21 日

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 的输入价格现为每百万 token 4 美元，输出价格为每百万 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少在 2026 年 11 月 21 日之前有效。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

发布了 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。跟踪你的缓存命中率、每次写入的缓存读取数，以及缓存读取、缓存写入和未缓存 token 的分布情况，以了解缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在预览版中提供，适用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 的 Images API 和 Responses API 图像生成工具。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多请查看 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8月13日

公告

宣布推出 Ultrafast 模式，这是 GPT-5.6 Sol 的全新 API 服务层级，其运行速度比 Standard 处理模式最高快 14 倍。已向部分客户提供限量预览版。注册以接收 Ultrafast 模式的最新动态 [在此处](https://openai.com/form/ultrafast/).

### Aug 7

特性 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获批的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们可在明确授权的委托中，从安全发现推进到经验证的修复。

大多数防御性安全工作请从 Daybreak Blue 入手。它提供对通用模型的访问，例如用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证的 GPT-5.6 Sol。了解详情 [在此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独审批的访问，可用于专用训练模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已授权的漏洞复现、漏洞利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要单独审批与配置。你可以申请加入 Daybreak 项目 [在此处](https://openai.com/daybreak/)。更多定价详情 [在此处](https://developers.openai.com/api/docs/pricing).

### 8月6日

更新 · 模型：chat-latest

更新了 **chat-latest** snapshot，它指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议利用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境 API 使用，但你可自由使用此模型测试聊天的最新改进。底层模型快照将定期更新。了解更多 [在此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

Fast 模式现在为 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 支持长上下文请求。截至今日，超过 272K tokens 的长上下文提示可以在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度最高可达 Standard 层的 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8 月 4 日

功能

客户现在可以按 API key 在 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。中筛选和分组数据。API [Usage 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API key 维度，用于以编程方式进行报告和分析。

## 2026年7月

### 7月30日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的成本降低 80%，GPT-5.6 Terra 的成本降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 在 API 中，它取代了我们原先的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现以两倍价格提供比标准处理快至 2.5 倍的速度。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API Platform 资源作为基础设施即代码进行管理。

配置和管理项目、用户、群组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，以及检测并协调配置漂移。可从以下位置安装该 provider： [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

特性 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录以及已提交 Realtime 轮次的最终转录文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 实现低延迟流式转录。

两个模型都支持自由格式的转录上下文、关键词提示以及多种可预期的输入语言。请在对比支持的输出与工作流。 [转写指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出上限。可设置月度上限，当跟踪到的支出达到上限时，受影响的 API 请求将返回 `429` 错误。建议使用支出告警，以便在流量中断前收到通知。详情请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### 7月9日

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6),包括面向前沿能力的 GPT-5.6 Sol、兼顾智能与成本的 GPT-5.6 Terra,以及面向高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理, `max` 推理强度与 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，和 [多智能体编排(智能体)现已在 Responses API 中提供 Beta 版本](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还可按原始尺寸接收图像,并支持 `original` 或 `auto` 图像细节控制。

### 7 月 6 日

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具备改进的字母数字识别、静音与噪声处理以及打断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，这是一款面向实时语音应用的更快、低成本蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

更新了 `chat-latest` snapshot，它指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境 API 使用，但你可自由使用此模型测试聊天的最新改进。底层模型快照将定期更新。了解更多 [在此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了安全使用仪表板。安全仪表板根据以下条件显示被拦截的 Responses 请求 `safety_identifier` 请求中发送的用于识别最终用户的值。请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在可以在常规文本结果之外返回图片结果。当你的应用需要当前或基于网络的视觉内容（例如产品图片、地标、地点、事件或视觉参考）时，可使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月5日

更新

发布了重新设计的 OpenAI API 平台导航，访问 [在此处](https://platform.openai.com/login).

### Jun 4

特性 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

在 Responses API 和 Chat Completions API 中新增了审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中同时获取模型输入和生成输出的审核结果。

请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6 月 3 日

更新

宣布废弃可复用的提示对象、Evals 平台以及 智能体 Builder。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解停用时间表和迁移指南。

### 6 月 2 日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将改为按分钟计费（最低 5 分钟），而不是按完整的 20 分钟会话费率计费。基础分钟费率保持不变。

此次更新旨在让较短会话的计费更加精细，并降低用户的实际成本。

你可以在我们的 [API定价文档中找到当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现可通过 Amazon Bedrock 上兼容 OpenAI 的 Responses API 端点使用。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而非 `in_memory`，默认启用扩展的提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5 月 28 日

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境 API 使用，但你可自由使用此模型测试聊天的最新改进。底层模型快照将定期更新。了解更多 [在此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月26日

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信任的工作负载可以将外部签发的身份令牌交换为短期的 OpenAI 访问令牌，而无需存储长期的 API 密钥。

### 5月26日

更新

新增 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置以及 托管工具 权限，还可以查询细粒度的计费明细项。

### 5月19日

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 让受支持的 OpenAI 产品（包括 ChatGPT Web、Codex、Responses API 以及 AgentKit）能够通过客户自托管的方式连接到私有或本地部署的 MCP 服务器 `tunnel-client` 而无需将这些服务器暴露在公共互联网上。

### 5月19日

更新

现在你可以管理多个 IP 白名单，并将每个白名单应用到项目层级或整个组织。配置方法：前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5 月 12 日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照以及 Realtime API 公开测试版。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日被弃用并从 API 中移除。建议改用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 。

Realtime API 公开测试版已于 2026 年 5 月 12 日被弃用并从 API 中移除。如果你仍在使用该测试版接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增 `return_token_budget` 适用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以为高强度的研究与评估工作负载启用更长时间的 GPT-5+ 推理 网页搜索 调用。

### May 7

特性 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款用于语音到语音 智能体 的全新实时语音模型，支持可配置推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) ，用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) ，用于流式语音转文本。

更新了 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) ，用于流式转录，并将实时提示工程指南移至 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

发布了 [OpenAI 面向 Codex 的开发者插件](https://developers.openai.com/learn/developers-codex-plugin)。它帮助你在 Codex 中借助 OpenAI Platform 访问和 OpenAI API 设置指引，构建 AI 应用和 智能体。

### 5 月 6 日

更新

更新后的 Agents SDK 现已在 TypeScript 中可用，原生支持沙箱 智能体 以及内置的开源 harness。了解更多 [在此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot 指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产API环境，但你仍可使用此模型测试我们在聊天场景下的最新改进。底层模型快照将定期更新。了解更多 [在此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

Admin APIs 现在已在适用于 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中支持。详见 [Admin APIs 指南](https://developers.openai.com/api/docs/guides/admin-apis) 中的设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款用于复杂专业工作的新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求中那些受益于更多算力的难题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、应用补丁、Skills、MCP，以及 网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原有行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅在扩展提示缓存下生效，不支持内存中的提示缓存。
了解详情 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

特性 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，并提供 50% 折扣。

### Apr 15

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来全新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源 harness；以及
- 控制何时创建记忆以及存储位置。

## 2026 年 3 月

### 3 月 17 日

Feature · Model: gpt-5.4-mini · Model: gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) to the Chat Completions and Responses API.GPT-5.4 mini 将 GPT-5.4 级别的能力带到了更快、更高效的模型中，适用于高吞吐量工作负载，而 GPT-5.4 nano 则针对速度和成本最为关键的简单高吞吐量任务进行了优化。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 3 月 13 日

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了图像编码器，修复了一个小问题： `input_image` GPT-5.4 在某些输入上存在问题。一些图像理解用例的质量可能因此得到改善，无需任何额外操作。

### Mar 12

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用、最长 `20` 秒的更长生成时长、 `1080p` 输出、视频扩展功能，以及对 `sora-2-pro`，的 Batch API 支持。在 `POST /v1/videos`. `1080p` 上生成的 `sora-2-pro` 按 `$0.70` 每秒计费。了解更多 [在此处](https://developers.openai.com/api/docs/guides/video-generation).

### Mar 12

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑已有视频。这将取代 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月内弃用。了解更多 [在此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们面向专业工作的最新前沿模型，已加入 Chat Completions 和 Responses API，并发布 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，以应对能从更多算力中受益的更难题型。

同时发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中提供，它允许模型将大型工具集合推迟到运行时再加载，从而降低 token 使用量、保持缓存性能并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 为 GPT-5.4 提供 `computer` 工具，支持基于截图的 UI 交互。
- 1M token 的上下文窗口和原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，用于运行时间更长的智能体工作流。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [在此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

Feature · API: v1/responses · API: v1/chat/completions

扩展 `input_file` 支持以接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [在此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 向 Responses API 添加了 summary 参数。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [在此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

Feature · Model: gpt-5.3-codex · API: v1/responses

已发布 `gpt-5.3-codex` 向 Responses API 添加了 summary 参数。阅读更多 [在此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API：v1/responses

为 Responses API 推出 WebSocket 模式。了解详情 [在此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [在此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### Feb 10

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，和 `gpt-image-1-mini`.

### Feb 10

更新 · 模型：gpt-5.2-chat-latest

更新了 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### Feb 10

功能 · API：v1/responses

已推出 [服务端 上下文压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，适用于 Responses API。

### Feb 10

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，可在 Responses API 中使用。我们同时支持本地执行和基于托管容器的 Skills 执行。

### Feb 10

功能 · API：v1/responses

推出全新的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器联网。

### Feb 9

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

新增对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）结合 `image_url` 或 `file_id` 引用方式，而非 multipart 上传。

### Feb 3

更新 · Model: gpt-5.2 · Model: gpt-5.2-codex

我们已为 API 客户优化了推理栈， [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型及模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/)：一个构建多提供商、可互操作的 LLM 接口的开源规范，基于原始的 OpenAI Responses API 构建。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。阅读更多 [在此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用 SIP IP 段。 `sip.api.openai.com` 通过 GeoIP 路由，将 SIP 流量引导至最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新了 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 的 slug 已指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

更新了 [sora-2](https://platform.openai.com/docs/models/sora-2) 的 slug 已指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 的 slug 已指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前建议使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

Fix · Model: gpt-image-1.5 · Model: chatgpt-image-latest

修复了一个错误：在 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过 `/v1/images/edits`，进行图像编辑时错误地使用了高保真度，即使 `fidelity` 被显式设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

更新 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。了解更多 [在此处](https://platform.openai.com/docs/guides/image-generation).

### Dec 15

特性 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [在此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

此次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，适用于符合条件的客户。

### Dec 11

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), GPT-5 模型家族中全新的旗舰模型。GPT-5.2 在以下方面较此前的 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 在 API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 版本的新增内容包括：全新的 xhigh 推理力度等级、简洁的推理摘要，以及通过压缩实现的全新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长对话，你可以使用 `/responses/compact` 端点来压缩每一轮发送的上下文。

### 12月4日

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长周期、智能体编码任务而优化。了解更多 [在此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

新增了对 Realtime API 中 DTMF 按键事件的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 以了解更多信息。

### Nov 13

功能 · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是 GPT-5 模型系列中最新的旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在无需大量思考时具有更强的可操控性和更快的响应速度
- 代码生成和编码相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以便在所需思考更少的情况下更快地响应——与 GPT-5 之前的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强的基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你能够决定组织内和各项目中谁可以执行哪些操作——无论是通过 API 还是在 Dashboard 中。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，专为 Codex 或类似环境中的智能体编码任务进行了优化。了解详情 [在此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留使缓存的前缀保持有效的时间更长，最长可达 24 小时。扩展提示缓存的工作原理是：当显存不足时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

特性 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解详情 [在此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### 10 月 24 日

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm)。企业密钥管理 (EKM) 允许你使用由你自有的外部密钥管理系统 (KMS) 管理的密钥来加密 OpenAI 上的客户内容。

### 10 月 24 日

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10月 6日

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在以下活动上发布了多项新功能： [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是以下模型的更高算力版本： [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) ，通过投入更多算力进行更深入的思考，从而持续提供更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，用于更具性价比的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，用于更具性价比的图像生成和编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，用于使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型进行丰富、细致且动态的视频生成与再创作。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于以可视化方式创建自定义的多智能体工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals):已发布第三方模型支持。

已推出 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表仅允许你指定的 IP 地址或地址段访问 API。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增对将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 的支持（位于 Responses API 中）。

### 9 月 23 日

特性 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为与 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### 8月 21 日

功能 · API：v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，适用于 Google 应用、Dropbox 等流行服务，可用于让模型读取这些服务中存储的数据。

### Aug 20

功能 · API: v1/conversations · API: v1/responses · API: v1/assistants

发布了 Conversations API，允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 查看对比并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API: v1/chat/completions · API: v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，和 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

推出了 `minimal` [推理努力程度](https://developers.openai.com/api/docs/guides/reasoning) 参数值，以在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入和从模型输出自由格式的内容。

## 2025年6月

### 6月27日

功能

已推出对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing). 优先级处理在保持按需付费灵活性的同时，提供了显著更低且更稳定的延迟，相比标准处理而言。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

通过以下方式新增了对异步事件处理的支持： [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化了定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增了对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API：v1/responses

[全新可复用提示词](https://developers.openai.com/chat/edit) 现已在仪表板中提供，并通过 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。对外开放。通过 API，你现在可以通过 `prompt` 参数引用在仪表板中创建的模板（使用一个提示 `id`，可选的 `version`）并提供动态的 `variables` ，其中可以包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API: v1/responses · API: v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，它是 o3 的一个版本， [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的版本，通过使用更多算力来更好地推理并提升一致性，从而回答困难问题。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括 batch 和 flex 处理。

### Jun 4

功能 · API: v1/fine_tuning

新增对以下模型的支持 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 的模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，和 `gpt-4.1-nano-2025-04-14`.

### 6 月 3 日

特性 · API: v1/chat/completions · API: v1/realtime

可用的新模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。已发布 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

为 Responses API 新增对内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解更多关于工具的信息](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

Feature · API: v1/responses · API: v1/chat/completions

新增对使用 `strict` 模式为工具 schema 的支持，可在使用非微调模型进行并行工具调用时使用。
新增 [schema 功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 等模式的字符串校验，以及为数字和数组指定范围。

### 5 月 15 日

Feature · Model：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对配合以下方式使用进行了优化 [Codex CLI](https://github.com/openai/codex).

### May 7

Feature · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API: v1/images/generations · API: v1/images/edits

新增了一个图像生成模型， `gpt-image-1`。该模型为图像生成树立了新标准，在生成质量和指令遵循能力上均有提升。

更新了图像生成和编辑接口，以支持该模型特有的新参数， `gpt-image-1` 。

### Apr 16

功能 · API: v1/chat/completions · API: v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学与编程、视觉推理任务以及技术写作方面树立了新的标杆。

推出 Codex——我们的代码生成 CLI 工具。

### Apr 14

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，和 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) models to the API。这些新模型在指令遵循、编码方面有所改进，并具备更大的上下文窗口（最高可达 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API: v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `whisper-1` 模型到音频 API。

### Mar 19

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，它是 o3 的一个版本， [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的版本，通过使用更多算力来更好地推理并提升一致性，从而回答困难问题。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多个新模型和工具，以及面向智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，并预计于 2026 年下线 Assistants（实现全面功能对等之后）。

### 3 月 3 日

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 对微调作业的字段支持。

## 2025 年 2 月

### 2 月 27 日

特性 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览版——这是我们迄今为止最大且能力最强的聊天模型。GPT-4.5 具备高“情商”和对用户意图的理解，在创意任务和智能体规划方面表现更佳。

### Feb 25

功能

已上线 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。本次更新响应了对更多数据筛选的需求，例如项目选择、日期选择器以及更细粒度的时间区间。同时也更好地支持跨不同产品和服务层级查看用量。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解更多 [在此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，一款针对科学、数学和编码任务优化的全新小型推理模型。

### Jan 21

功能 · 模型：o1

扩展访问 [o1 模型](https://platform.openai.com/docs/models/o1)。o1 系列模型通过强化学习训练以执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已推出 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其 admin 接口 密钥。

更新于 [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在用户被邀请加入组织的同时以编程方式将其邀请到项目。

### 12月17日

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 Realtime API 新增 WebRTC 连接方式 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

新增 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出使用 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出适用于 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 支持 [Python SDK](https://github.com/openai/openai-python).

### 12月4日

功能

已推出 [Usage 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 各处的活动与支出。

## 2024 年 11 月

### 11 月 20 日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Nov 4

功能 · API: v1/chat/completions

已发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs),它能显著降低模型响应的延迟，前提是大部分响应内容事先已知。这种情况最常见于在仅做小幅修改的情况下重新生成文档和代码文件的内容。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增了五种新的语音类型，位于 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10月17日

功能 · 模型: gpt-4o-audio-preview · API: v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 chat completions，同时支持音频输入和输出。使用与上述相同的底层 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在以下活动上发布了多项新功能： [OpenAI 旧金山 DevDay](https://openai.com/devday/):

[Realtime 接口](https://developers.openai.com/api/docs/guides/realtime): 使用 WebSockets 接口在你的应用中快速构建语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): 一个平台，可使用大型前沿模型的输出来微调高性价比模型。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision): 使用图像和文本微调 GPT-4o，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals): 创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching): 对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit): 在 playground 中使用 Generate 按钮轻松生成提示、函数定义和结构化输出架构。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（部分类别支持文本），新增两个仅文本的危害类别，并且评分更加准确。

### Sep 12

Feature · Model: o1-preview · Model: o1-mini · API: v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这是通过强化学习训练的新型大型语言模型，用于执行复杂推理任务。

## 2024 年 8 月

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，并自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8月15日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8月6日

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Aug 1

更新

已推出 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志记录必须在 [settings](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已推出 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义及无限计费的企业客户针对其所需的 IDP 配置身份验证。

### Jul 23

更新

已推出 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，可在特定用例下实现更高的性能。

### 7 月 18 日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，我们价格亲民且智能的小模型，适用于快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分段方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传递 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中推出。

### 6 月 3 日

更新

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## May, 2024

### 5 月 15 日

更新

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对 [设置成本限制](https://platform.openai.com/settings/organization/general) ，针对按需付费客户按项目进行设置。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 中的API。GPT-4o 是我们最快且最具性价比的旗舰模型。

### 5 月 9 日

更新

新增对 [向 Assistants API 提供图像输入。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增对 [向 Batch API 提供微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5 月 6 日

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 将参数传递给 Chat Completions 和 Completions API。设置该参数后，开发者在使用流式传输时可以访问用量统计信息。

### May 2

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 的线程中删除一条消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API。

新增了 [Batch API 使用指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

引入了一系列 [Assistants API 更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的 文件搜索 工具，每个智能体最多可支持 10,000 个文件，新增了 token 控制以及 tool choice 支持。

### Apr 16

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 以便按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目维度管理速率和费用上限的能力（费用上限仅对企业客户开放）。

### Apr 15

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4月9日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式发布

### 4 月 4 日

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [在创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 过滤 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [创建助手消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### 3 月 14 日

更新

新增对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024-02

### Feb 9

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 向 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布了 V3 嵌入模型并更新了 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以在 Assistants API 中运行创建操作

### Dec 15

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

Changed [function parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) argument on a tool call to be optional

## 2023年11月

### 11月30日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新后的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [通过 API 使用 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，和 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10月 6日

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
