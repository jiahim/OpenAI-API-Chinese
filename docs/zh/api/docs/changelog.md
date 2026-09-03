# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

> OpenAI API 的最新功能与更新。

即将进行的弃用列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 2 日

更新

已更新 API 错误，以便应用能够区分流量增长过快与临时性的模型过载。

流量增长过快时，会返回 `429` 错误，对应的 `slow_down` 状态码。临时性的模型过载则返回 `503` 错误，对应的 `server_is_overloaded` 状态码。两种响应都可能会包含 `Retry-After`。当该响应头存在时，请至少按其指定的时间等待后再重试；若不存在，则使用指数退避策略。详见 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS（mTLS）](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 全面上线。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，并通过你所在组织的角色与权限进行访问控制。

### Aug 26

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 下线。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026-08-26 停用。请迁移到 Responses API 和 Conversations API，使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以为单个请求选择区域处理，只需在使用具有 Global 地理区域的项目中的 API 密钥时，使用带有前缀的域名即可。现有的资格、数据留存控制、端点和模型支持要求仍然适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现行的定价为输入 400 万美元每百万 token、输出 2000 万美元每百万 token，相比之前输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续至 2026-11-21。详情请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

发布了 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) ，位于 OpenAI API 平台。你可以追踪缓存命中率随时间的变化、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存令牌的细分，从而了解缓存效率并识别改进机会。可按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 的 Images API 和 Responses API 图像生成工具中提供预览。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。详细了解请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

宣布推出 Ultrafast 模式，这是面向 GPT-5.6 Sol 的全新 API 服务等级，处理速度最高可达 Standard 的 14 倍。目前以有限预览形式向部分客户提供。注册以接收 Ultrafast 模式的更新 [此处](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现已为获得批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以在明确授权的攻防任务中，将它们用于把安全发现推进到经过验证的修复环节。

对大多数防御性安全工作，请从 Daybreak Blue 开始。它可访问通用模型，例如 GPT-5.6 Sol，用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析与补丁验证。阅读全文 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独审批后才能使用的、面向特定用途训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) ，用于获得授权的漏洞复现、漏洞利用验证、渗透测试、红队演练和复杂系统分析。

这些模型需要单独的审批与配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### 8月6日

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，该快照指向 ChatGPT 中面向 Plus 和 Pro 用户开放的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境中的 API 使用，但你可以使用此模型测试聊天场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 8 月 5 日

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

Fast 模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。从今天起，超过 272K token 的长上下文提示词可以在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度比 Standard 层级快达 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在使用情况和成本仪表板中按 API key 筛选和分组数据 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [费用 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 还支持 API 密钥维度，用于以编程方式进行报告与分析。

## 2026年7月

### 7月30日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，GPT-5.6 Terra 的价格降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们同时推出 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) ，应用于 API，取代此前的 Priority Processing 服务。针对 GPT-5.6 Sol，Fast 模式现以两倍价格提供最高 2.5 倍于标准处理的速度。该变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### 7月 29日

功能

发布了官方 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API Platform 资源。

预置和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请和项目级速率限制。使用标准 Terraform 工作流审查和应用更改、导入现有资源，以及检测和协调配置漂移。从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转写以及已提交 Realtime 轮次的最终转写文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转写。

这两个模型都支持自由形式的转写上下文、关键词提示以及多种预期的输入语言。在 [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7月22日

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出限额。可设置月度上限，当跟踪的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。请使用支出提醒在流量中断前进行通知。详情请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

功能 · 模型: gpt-5.6-sol · 模型: gpt-5.6-terra · 模型: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model),包括 GPT-5.6 Sol 用于前沿能力、GPT-5.6 Terra 在智能和成本之间取得平衡,以及GPT-5.6 Luna 用于高效、大规模的工作负载。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理力度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，和 [多智能体编排现已在 Responses API 中提供 Beta 版](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像,并提供 `original` 或 `auto` 图像细节选项。

### Jul 6

特性 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，这是一款经过更新的实时推理模型，提升了字母数字识别、静音与噪声处理以及打断表现。同时还发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，这是一款更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` 快照，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境中的 API 使用，但你可以使用此模型测试聊天场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台发布了 Safety Usage Dashboard。Safety 面板根据以下内容展示被拦截的 Responses 请求 `safety_identifier` 请求中发送的用于识别最终用户的值。访问 [Safety 面板](https://platform.openai.com/usage/safety).

### 6月9日

功能 · API: v1/responses

网页搜索现在可以在常规文本结果之外同时返回图片结果。当你的应用需要来自网络且基于现实的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，可使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### Jun 4

功能 · 模型：omni-moderation-latest · API: v1/responses · API: v1/chat/completions

已在 Responses API 和 Chat Completions API 中新增审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中获取模型输入与生成输出的审核结果。

详见 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体构建器（智能体 Builder）。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### 6月2日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，而不再按完整的 20 分钟会话费率计费。底层的按分钟费率将保持不变。

此次更新旨在为较短会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 计费文档中查看当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现已通过兼容 OpenAI 的 Responses API 端点在 Amazon Bedrock 中可用。受支持的模型和功能因 AWS 区域而异。 [了解详情](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API：v1/responses · API：v1/chat/completions · API：v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而不是 `in_memory`，从而默认启用扩展提示缓存。 [了解详情](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境中的 API 使用，但你可以使用此模型测试聊天场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可以将外部签发的身份令牌交换为短期 OpenAI 访问令牌，而无需存储长期 API 密钥。

### May 26

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，可用于管理支出提醒、模型允许列表、数据保留设置以及 托管工具 权限，并支持查询精细化的账单明细项。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 以及 AgentKit）通过客户自托管的 `tunnel-client` 连接到私有或本地 MCP 服务器，而无需将这些服务器暴露到公网。

### May 19

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。若要配置它们，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5月12日

Update · Model: dall-e-2 · Model: dall-e-3 · API: v1/realtime

已弃用的 DALL·E 模型快照以及 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日在 API 中被弃用并移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或者 `gpt-image-1-mini` 取而代之的是。

Realtime API Beta 已于 2026/05/12 被弃用并从 API 中移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 和完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API: v1/responses

新增 `return_token_budget` 面向 Responses API 的 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research),可用于选择加入更长时间的 GPT-5+ 推理 网页搜索 运行，适用于高投入度的研究与评估工作负载。

### 5月7日

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，这是一款新的实时语音模型，支持为语音到语音 智能体 配置推理能力，并新增了 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文字。

已更新 [实时 接口 和音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专用的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转录，并将实时提示指南移至 [使用实时模型](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### 5月7日

功能

发布了 [适用于 Codex 的 OpenAI Developers 插件](https://developers.openai.com/learn/developers-codex-plugin)。这可帮助你借助 OpenAI Platform 访问和 OpenAI API 设置指南，在 Codex 中构建 AI 应用和 智能体。

### May 6

更新

更新后的 Agents SDK 现已支持 TypeScript,并内置了对沙箱 智能体 的支持以及开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5月5日

更新 · 模型：chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。建议使用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境 API 使用,但欢迎使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。详见 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

Feature · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，这是一个面向复杂专业工作的全新前沿模型，已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求，以应对受益于更多算力的更棘手问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、应用补丁、Skills、MCP 以及网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存。不支持内存中的提示缓存。
了解更多 [请参阅此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成和编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，可享受 50% 折扣。

### 4 月 15 日

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来全新功能，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源测试框架；以及
- 控制记忆的创建时机以及存储位置。

## 2026 年 3 月

### 3 月 17 日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 到 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带到更快、更高效的模型中，适用于高吞吐量工作负载；而 GPT-5.4 nano 针对简单的高吞吐量任务进行了优化，在这些场景中速度和成本最为关键。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · Model: gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 3 月 13 日

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个关于 `input_image` GPT-5.4 输入的小问题。部分图像理解用例现在可能会看到质量提升。无需执行任何操作。

### 3 月 12 日

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用的角色参考，最长生成时长可达 `20` 秒， `1080p` 输出用于 `sora-2-pro`、视频扩展，以及 Batch API 对 `POST /v1/videos`. `1080p` 生成任务的支持， `sora-2-pro` 按秒计费。了解更多 `$0.70` 。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` ，用于编辑现有视频。这将取代 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

特性 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已在 Chat Completions 和 Responses API 中推出，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 到 Responses API 中，用于需要更多算力的更难问题。

同时发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，该功能允许模型将大型工具集合延迟到运行时再加载，从而降低 token 使用量、保持缓存性能并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供 `computer` 用于基于截图的 UI 交互的工具。
- 100 万 token 的上下文窗口以及原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，可用于运行时间更长的 智能体 工作流。

### 3月3日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses · API: v1/chat/completions

扩展 `input_file` 支持更多文档、演示文稿、电子表格、代码和文本文件类型。了解详情 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API: v1/responses

已发布 `phase` 至 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读详情 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API: v1/responses

已发布 `gpt-5.3-codex` 至 Responses API。阅读详情 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API: v1/responses

为 Responses API 推出 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 接入 Realtime API。

已发布 `gpt-audio-1.5` 接入 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### Feb 10

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已在 GPT Image 模型中支持： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，和 `gpt-image-1-mini`.

### Feb 10

Update · Model: gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### Feb 10

功能 · API: v1/responses

已推出 [服务端 上下文压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，支持在 Responses API 中使用。

### Feb 10

功能 · API: v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 功能的支持，支持在 Responses API 中使用。Skills 同时支持本地执行和基于托管容器的执行。

### Feb 10

功能 · API: v1/responses

全新推出 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### Feb 9

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`），通过 `image_url` 或 `file_id` 引用而非 multipart 上传。

### 2 月 3 日

更新 · Model：gpt-5.2 · Model：gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在的运行速度提升了约 40%。模型和模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/)：一个开源规范，用于在原有的 OpenAI Responses API 之上构建多提供商、可互操作的 LLM 接口。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。阅读更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 添加了专用的 SIP IP 范围。 `sip.api.openai.com` 会进行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解详情](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### Jan 13

更新 · Model: gpt-realtime-mini · Model: gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 已指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · Model: sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 已指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · Model: gpt-4o-mini-tts · Model: gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 已指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### 1月9日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，该问题中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过以下方式进行的图像编辑中错误地使用了高保真度 `/v1/images/edits`，即使在 `fidelity` 被显式设置为 `low` （默认值）时也是如此。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### 12月16日

特性 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。了解更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持（面向符合条件的客户）。

### 12月11日

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，GPT-5 模型家族中最新旗舰模型。GPT-5.2 在以下方面相较此前的 GPT-5.1 有改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态，尤其是视觉
- 代码生成，尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新内容：新增 xhigh 推理强度等级、精炼的推理摘要，以及基于压缩的全新上下文管理。

### 12月11日

特性 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 进行的长时间对话，你可以使用该 `/responses/compact` 端点来压缩你每轮发送的上下文。

### Dec 4

Feature · Model：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长周期、智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

Realtime API 中新增了对 DTMF 按键的支持。现在，你在使用 Realtime 侧带连接时可以接收 DTMF 事件。详见 [相关文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 。

### Nov 13

特性 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，GPT-5 模型系列中全新的旗舰模型。GPT-5.1 在以下方面经过特别优化：

- 在无需过多思考时可获得更强的可控性与更快的响应
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用了一种新的 `none` 推理设置，以便在所需思考更少时更快地响应——这与之前 GPT-5 中的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定在你的组织和项目中谁能执行哪些操作——既可以通过 API，也可以在 Dashboard 中进行。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是为 Codex 或类似环境中的智能体编码任务而优化的 GPT-5.1 版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展提示缓存保留可使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存的工作原理是：当显存占满时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能特性 · 模型: gpt-oss-safeguard-120b · 模型: gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

已发布 [UK 数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，这是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力来更深入地思考，并提供始终更优的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，用于更具性价比的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，用于更具性价比的图像生成和编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，可使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型实现丰富、细腻且动态的视频生成与重混。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，可通过可视化方式创建自定义的多智能体工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals): 发布第三方模型支持。

已推出 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表将 API 访问限制为仅允许你指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API: v1/responses

新增了对将图片和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 的支持，在 Responses API 中。

### Sep 23

Feature · Model：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API: v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 为 Google 应用、Dropbox 等热门服务维护的 MCP 封装，可用于让模型读取存储在这些服务中的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，它允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看对比说明，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，和 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [推理强度](https://developers.openai.com/api/docs/guides/reasoning) 取值，以优化 GPT-5 模型（支持推理）的快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型传入自由形式的输入并从模型获取自由形式的输出。

## June, 2025

### Jun 27

功能

已推出对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing). 与 Standard 处理相比，Priority processing 可显著降低延迟并保持更稳定的延迟表现，同时保留按量付费的灵活性。

### 6 月 24 日

功能 · Model: o3-deep-research · Model: o3-deep-research-2025-06-26 · Model: o4-mini-deep-research · Model: o4-mini-deep-research-2025-06-26 · API: v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，针对深度分析与研究任务进行了优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [进行异步事件处理的支持。](https://developers.openai.com/api/docs/pricing) 降价并简化了 网页搜索 工具的定价。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API: v1/responses

[新可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台和 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现在可以引用在控制台中创建的模板，引用方式为 `prompt` 参数（使用 prompt `id`，可选 `version`）并提供动态 `variables` 内容，可以包含字符串、图像或文件输入。Chat Completions 不支持可复用的 prompt。 [了解详情](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6 月 10 日

Feature · Model: o3-pro · API: v1/responses · API: v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括 batch 和 flex 处理。

### Jun 4

Feature · API: v1/fine_tuning

新增使用 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 的微调支持，适用于以下模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，和 `gpt-4.1-nano-2025-04-14`.

### Jun 3

Feature · API: v1/chat/completions · API: v1/realtime

提供了新的模型快照 [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API: v1/responses

在 Responses API 中新增了对内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解有关工具的更多信息](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API: v1/responses · API: v1/chat/completions

新增了对在并行工具调用中使用非微调模型时为工具架构使用 `strict` 模式的支持。
新增了 [架构功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，的支持，包括对 `email` 进行字符串验证，以及为其他模式指定数值和数组的范围。

### 5 月 15 日

特性 · 模型：codex-mini-latest · API: v1/responses · API: v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对配合使用进行了优化 [Codex CLI](https://github.com/openai/codex).

### 5月7日

特性 · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

特性 · API: v1/images/generations · API: v1/images/edits

新增了图像生成模型， `gpt-image-1`。该模型为图像生成树立了新标准，具有更高的质量和指令遵循能力。

更新了图像生成与编辑接口，以支持该 `gpt-image-1` 模型特有的新参数。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编码、视觉推理任务和技术写作方面树立了新的标准。

推出了 Codex，即我们的代码生成 CLI 工具。

### 4 月 14 日

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，和 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型到 API。这些新模型在指令遵循、编码以及更大的上下文窗口（最高 1M tokens）方面有所改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `whisper-1` models 接口添加到 Audio API。

### Mar 19

功能 · 模型：o1-pro · API: v1/responses · API: v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多个新模型和工具，以及一个面向智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体与工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 发布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易使用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计将于 2026 年下线（在实现完全功能对等之后）。

### 3月3日

功能 · API: v1/fine_tuning/jobs

新增 `metadata` 字段支持到微调任务。

## 2025 年 2 月

### 2 月 27 日

特性 · 模型：GPT-4.5 · API: v1/chat/completions · API: v1/assistants · API: v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览版本——这是我们迄今为止最大、能力最强的聊天模型。GPT-4.5 具备高“情商”和对用户意图的理解能力，在创意任务和智能体规划方面表现更佳。

### 2 月 25 日

功能

已上线 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard). 此更新回应了用户对更多数据筛选器的需求，例如项目选择、日期选择器以及更细粒度的时间区间。同时也更好地支持跨不同产品和服务层级查看用量。

### Feb 5

功能

在欧洲推出数据驻留。阅读更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型:o3-mini · 模型:o3-mini-2025-01-31 · API:v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一款全新的小型推理模型，针对科学、数学和编码任务进行了优化。

### Jan 21

功能 · 模型：o1

扩展对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已推出 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理员 接口 密钥。

已更新 [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在用户被邀请加入组织的同时，以编程方式将其邀请到项目。

### Dec 17

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

为以下模型添加了新模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下功能添加了 WebRTC 连接方式 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 用于 o1 模型。注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出了基于 [直接偏好优化 (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出了适用于 Go 和 Java 的 beta 版 SDK。 [了解详情](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，应用于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已推出 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询各个 OpenAI API 的活动和支出。

## November, 2024

### 11 月 20 日

更新 · API：v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中的最新模型。

### Nov 4

功能 · API：v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，对于模型响应的大部分内容事先已知的情形，可显著降低延迟。这在仅对文档和代码文件进行少量修改后重新生成内容时尤为常见。

## 2024 年 10 月

### 10 月 30 日

Feature · Model: gpt-4o-realtime-preview · Model: gpt-4o-audio-preview · API: v1/chat/completions

在以下 接口 中新增了五种新的语音类型： [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [全新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 Chat Completions，同时支持音频输入和输出。它使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI 在旧金山举办的 DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime):使用 WebSockets 接口在你的应用中快速构建语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model):利用来自前沿大模型的输出，对低成本模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision):使用图像和文本对 GPT-4o 进行微调，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals):创建并运行自定义评估，衡量模型在特定任务上的表现。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching):对最近出现过的输入 token 提供折扣并加快处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit):在 Playground 中使用 Generate 按钮轻松生成提示词、函数定义和结构化输出 schema。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [全新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它同时支持图像和文本（针对部分类别），新增了两个仅限文本的危害类别，并提供了更准确的评分。

### Sep 12

功能 · 模型: o1-preview · 模型: o1-mini · API: v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning),通过强化学习训练的新一代大型语言模型,用于执行复杂推理任务。

## 2024 年 8 月

### 8 月 29 日

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API: v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以对最新的 GPT-4o 模型进行微调。

### Aug 15

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——此模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8月6日

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中的最新模型。

### Aug 1

更新

已推出 [管理与审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并通过审计日志监控变更。必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers),允许采用定制和无限计费方案的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已推出 [GPT-4o mini 的微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例下实现更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), 一款经济实惠的智能小模型，适合快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 可分块上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传入 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 来禁用，该 开发工具包 已发布 Beta 版。

### Jun 3

更新

新增对 [文件搜索 customizations](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### 5 月 15 日

更新

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对 [设置成本限制](https://platform.openai.com/settings/organization/general) 按项目为按量付费客户提供。

### 5月 13 日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### 5月9日

更新

新增对 [向 Assistants API 提供图片输入。](https://developers.openai.com/api/docs/assistants/migration)

### 5月7日

更新

新增对 [向 Batch API 提供微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 向 Chat Completions 和 Completions API 添加该参数。在使用流式传输时，设置此参数可使开发者访问用量统计信息。

### May 2

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中删除某个线程里的消息。

## April, 2024

### Apr 29

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API 中。

新增了 [Batch API 使用指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4 月 17 日

更新

推出了一系列 [对 Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的 文件搜索 工具（每个智能体最多支持 10,000 个文件）、新的 token 控制以及 tool choice 支持。

### 4 月 16 日

更新

引入了 [基于项目层级结构](https://platform.openai.com/settings/organization/general) 以按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目管理和费用限制（费用限制仅对企业客户可用）。

### 4 月 15 日

更新

已发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式发布

### Apr 4

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## February, 2024

### Feb 9

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 向 Audio API

### 2 月 1 日

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## January, 2024

### Jan 25

更新

发布了 Embedding V3 模型和更新的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## 2023年12月

### 12月20日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 用于在 Assistants API 中运行创建操作

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

已更改 [function 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 参数在工具调用上为可选

## 2023年11月

### 11月30日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### 11月6日

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [已更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，和 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

已弃用 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增 `max_tokens` 到 [内容审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
