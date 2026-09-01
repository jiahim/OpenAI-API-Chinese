# 更新日志

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

> 该公司 OpenAI API 的最新功能与更新。

即将进行的弃用列在 [弃用页面](/api/docs/deprecations).

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS（mTLS）](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 全面可用。你可以直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供者，访问权限由你所在组织的角色和权限控制。

### Aug 26

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 停用。请迁移到 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请迁移到 Responses API 与 Conversations API 并使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以为单个请求选择区域处理，只需使用来自 Global 地理的项目中的 API 密钥，并配上相应的前缀域名即可。现有的资格、数据保留控制、端点和模型支持要求仍然适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在的价格为每百万输入 token 4 美元，每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。跟踪你的缓存命中率随时间的变化情况、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的细分情况，以了解你的缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在以下场景中提供预览 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 图像生成工具中。将 `background` 设置为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。在以下位置了解更多信息： [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8 月 13 日

公告

宣布推出 Ultrafast 模式，这是 API 中的一项新服务层级，专为 GPT-5.6 Sol 设计，处理速度最高可达 Standard 模式的 14 倍。目前以限量预览形式向特定客户开放。注册以接收 Ultrafast 模式的最新动态 [此处](https://openai.com/form/ultrafast/).

### 8月7日

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现在为获得批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们可在明确授权的参与中，将安全发现推进到经验证的修复。

对于大多数防御性安全工作，请从 Daybreak Blue 开始。它提供对通用模型的访问，例如 GPT-5.6 Sol，用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独批准的、面向专门训练模型的访问权限，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已授权的漏洞复现、漏洞利用验证、渗透测试、红队演练和复杂系统分析。

这些模型需要单独的批准和资源配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### 8 月 6 日

更新 · 模型：chat-latest

已更新 **chat-latest** snapshot，它指向面向 Plus 和 Pro 用户的 ChatGPT 中可用的最新模型。我们建议使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境的 API 调用，但你可以自由地使用该模型来测试聊天用例的最新改进。其底层模型快照将会定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。从今天起，超过 272K tokens 的长上下文提示可以在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度比标准层最高快 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8 月 4 日

功能

客户现在可以在 [用量和费用仪表板](https://platform.openai.com/settings/organization/usage)。中按 API 键对数据进行筛选和分组。API [用量 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [费用 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API 键维度，便于以编程方式生成报表和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 的价格下调 80%，GPT-5.6 Terra 的价格下调 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 功能（在 API 中），用于替代原有的 Priority Processing 服务。针对 GPT-5.6 Sol，Fast 模式现在可在标准处理速度基础上提供最高 2.5 倍的提速，定价为标准处理的两倍。该变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### 7月29日

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API 平台资源作为基础设施即代码进行管理。

配置和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，并检测和协调配置漂移。从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### 7 月 28 日

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于准确转录文件，以及为已提交的 Realtime 轮次生成最终转录文本，并支持 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

这两个模型均支持自由格式转录上下文、关键词提示以及多种预期输入语言。支持的输出和工作流比较请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台的组织和项目新增硬性支出上限。设置月度上限，当追踪到的支出达到上限时，受影响的 API 请求将返回 `429` 错误。使用支出提醒，在流量中断之前接收通知。更多信息请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

特性 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model)，包括面向前沿能力的 GPT-5.6 Sol、在智能与成本之间取得平衡的 GPT-5.6 Terra，以及面向高吞吐高效工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度与 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [面向 Responses API 的多智能体编排（测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持按原始尺寸接收图像，同时提供 `original` 或 `auto` 图像细节选项。

### 7月6日

Feature · Model: gpt-realtime-2.1 · Model: gpt-realtime-2.1-mini · API: v1/realtime

发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款速度更快、成本更低的实时语音应用蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` snapshot，它指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 调用，但你可以自由地使用该模型来测试聊天用例的最新改进。其底层模型快照将会定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

已在 OpenAI API 平台上发布安全使用仪表板。安全仪表板会根据请求中发送的用于识别最终用户的值，显示被阻止的 Responses 请求。 `safety_identifier` 请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

特性 · API: v1/responses

网页搜索现在可以与常规文本结果一起返回图像结果。当你的应用需要当前或基于网络的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，请使用图像搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新日志

发布了重新设计的 OpenAI API 平台导航，请访问 [此处](https://platform.openai.com/login).

### Jun 4

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 添加审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中同时获得模型输入和生成输出的审核结果。

了解更多，请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新日志

宣布弃用可复用的提示对象、Evals 平台以及 智能体 Builder。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### Jun 2

更新日志

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费时长为 5 分钟，而不再按完整的 20 分钟会话费率计费。底层每分钟费率保持不变。

此次更新旨在为较短会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 定价文档中找到当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现已通过兼容 OpenAI 的 Responses API 端点在 Amazon Bedrock 中可用。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而非 `in_memory`，默认启用扩展的提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

发布 `chat-latest` 指向当前 ChatGPT 中使用的最新 Instant 模型的快照。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 调用，但你可以自由地使用该模型来测试聊天用例的最新改进。其底层模型快照将会定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可以使用外部颁发的身份令牌换取短期的 OpenAI 访问令牌，无需存储长期 API 密钥。

### May 26

更新日志

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 用于管理支出提醒、模型许可名单、数据保留设置以及托管工具权限的能力，并可查询细粒度的账单明细项。

### May 19

功能

发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 以及 AgentKit）通过客户自托管的方式连接私有或本地部署的 MCP 服务器 `tunnel-client` 而无需将这些服务器暴露在公共互联网上。

### May 19

更新日志

现在你可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。若要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照以及 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日被弃用并从 API 中移除。建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API Beta 已于 2026 年 5 月 12 日被弃用并从 API 中移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

特性 · API: v1/responses

新增 `return_token_budget` 了适用于 Responses API 的 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。可用于选择启用更长时间的 GPT-5+ 推理网页搜索运行，以满足高强度研究和评估工作负载的需求。

### 5 月 7 日

特性 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款面向语音到语音智能体的全新实时语音模型，支持可配置推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

已更新 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专属的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转录，并将实时提示词相关指导移入 [使用实时模型](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### 5 月 7 日

功能

已发布 [OpenAI Developers 适用于 Codex 的插件](https://developers.openai.com/learn/developers-codex-plugin)。这可帮助你在 Codex 中借助 OpenAI Platform 访问和 OpenAI API 设置指引来构建 AI 应用和智能体。

### May 6

更新日志

更新后的 Agents SDK 现已提供 TypeScript 版本，支持沙箱 智能体 并内置开源 harness。了解更多信息 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

发布 `chat-latest` 指向当前 ChatGPT 中使用的最新 Instant 模型的快照。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用，但你可以自由使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月4日

更新日志

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

特性 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的全新前沿模型，已加入 Chat Completions 和 Responses API，并上线了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，面向 Responses API 中那些能从更多算力中受益的更困难问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、hosted shell、apply patch、Skills、MCP，以及 网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存功能仅适用于扩展提示缓存。不支持内存提示缓存。
了解更多信息 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及享有 50% 折扣的 Batch API 支持。

### 4 月 15 日

更新日志

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 新增了多项能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源 harness；以及
- 控制记忆的创建时机和存储位置。

## 2026 年 3 月

### 3 月 17 日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 和 Responses API。GPT-5.4 mini 以更快、更高效的模型形态带来 GPT-5.4 级别的能力，适用于高吞吐量的工作负载；而 GPT-5.4 nano 则针对简单的高吞吐量任务进行了优化，在这些场景中，速度和成本最为关键。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) 指向当前 ChatGPT 所用最新模型的 slug。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

我们更新了图像编码器，修复了以下方面的一个小 bug： `input_image` GPT-5.4 中的输入处理。某些图像理解用例现在可能会获得质量提升。无需任何操作。

### Mar 12

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用、最长可达以下时长的生成： `20` 秒，以及， `1080p` 输出、 `sora-2-pro`、视频扩展功能，并提供 Batch API 对 `POST /v1/videos`. `1080p` 生成的计费按 `sora-2-pro` 支持，按 `$0.70` /秒计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### Mar 12

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑已有视频。该接口将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3 月 5 日

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们面向专业工作的最新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 到 Responses API，用于需要更多算力的更棘手问题。

同时发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，模型可在运行时再加载大型工具集，从而减少 token 使用量、保持缓存性能并降低延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供支持 `computer` 用于基于截图进行 UI 交互的工具。
- 支持 100 万 token 上下文窗口，并原生支持 [压缩](https://developers.openai.com/api/docs/guides/compaction) 适用于长时间运行的 智能体 工作流。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

发布 `gpt-5.3-chat-latest` 到 Chat Completions 和Responses API。该模型指向当前 ChatGPT 中使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses · API: v1/chat/completions

扩展了 `input_file` 对更多文档、演示文稿、电子表格、代码和文本文件类型的支持。了解详情 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

特性 · API: v1/responses

发布 `phase` 在 Responses API 中。它将助手消息标记为中间评论（`commentary`) 或最终回答（`final_answer`)。阅读详情 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API: v1/responses

发布 `gpt-5.3-codex` 到 Responses API。阅读详情 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

特性 · API: v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 添加到 Realtime API。

发布 `gpt-audio-1.5` 添加到 Chat Completions API。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现在支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型：gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) 指向当前 ChatGPT 所用最新模型的 slug。

### 2 月 10 日

特性 · API: v1/responses

已上线 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，位于 Responses API 中。

### 2 月 10 日

特性 · API: v1/responses

已上线对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，可在 Responses API 中使用。我们在本地执行和基于容器的托管执行两种方式下均支持 Skills。

### 2 月 10 日

特性 · API: v1/responses

已上线全新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### 2月9日

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

新增对 `application/json` 请求的支持，适用于 `/v1/images/edits` 上的 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）配合 `image_url` 或 `file_id` 引用，而不是 multipart 上传。

### 2月 3 日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈， [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型及其权重未发生变化。

## January, 2026

### Jan 15

公告

已公布 [Open Responses](https://www.openresponses.org/): an open-source spec for building multi-provider, interoperable LLM interfaces built on top of the original OpenAI Responses API.

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是为 Codex 或类似环境中的智能体编码任务而优化的 GPT-5.2 版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用 SIP IP 段。 `sip.api.openai.com` 它会进行 GeoIP 路由，并将 SIP 流量引导至最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 的 slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) 的 slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 的 slug 指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` ，以获得最佳效果。

### Jan 9

修复 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

修复了一个问题，其中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过 `/v1/images/edits`，进行图像编辑时错误地使用了高保真度，即使 `fidelity` 被明确设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

Update · Model: gpt-image-1.5 · Model: chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### 12月16日

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。阅读更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12 月 15 日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

此次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 面向符合条件的客户开放。

### Dec 11

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相较前代 GPT-5.1 有改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 工具调用与API中的上下文管理
- 电子表格的理解与创建。

5.2 的新增内容包括新的 xhigh 推理强度级别、简洁的推理摘要，以及使用压缩技术实现的新上下文管理。

### Dec 11

功能 · API: v1/responses/compact

发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间对话，你可以使用该 `/responses/compact` 端点来缩小每轮发送的上下文。

### Dec 4

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长时长的智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## November, 2025

### Nov 20

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。请参阅 [相关文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### 11月 13日

特性 · 模型: gpt-5.1 · 模型: gpt-5.1-codex · 模型: gpt-5.1-chat-latest · 模型: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1), GPT-5 模型系列中全新的旗舰模型。GPT-5.1 经过训练,在以下方面尤为擅长:

- 在所需思考较少时可引导输出并获得更快响应
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认启用一种新的 `none` 推理设置，以便在所需思考较少时更快地响应——这与 GPT-5 中之前的 `medium` 默认设置不同。

### 11月 13日

功能

发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定组织及项目中谁能执行哪些操作——既可以通过 API，也可以在 Dashboard 中进行。

### 11月 13日

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，专为 Codex 或类似环境中的智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### 11月 13日

功能

发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留可使缓存的前缀保持更长时间，最长可达 24 小时。扩展提示缓存的工作原理是：当内存已满时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · Model: gpt-oss-safeguard-120b · Model: gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm)。企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥来加密你在 OpenAI 的客户内容。

### Oct 24

功能

发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在 DevDay 上发布了几项新功能 [OpenAI DevDay](https://openai.com/devday/):

发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，这是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力进行更深入的思考，从而提供始终更优的答案。

发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音对话性能。

发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成与编辑。

已上线 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，以通过我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型实现丰富、细腻且动态的视频生成与再创作。

已上线 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于通过可视化方式创建自定义的多智能体工作流。

已上线 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已上线 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表功能仅允许你指定的 IP 地址或地址段访问 API。

## 2025 年 9 月

### 9 月 26 日

特性 · API: v1/responses

新增对将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### 9月23日

Feature · Model: gpt-5-codex · API: v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

特性 · API: v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，用于 Google 应用、Dropbox 等流行服务，可让模型读取这些服务中存储的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，允许你使用 Responses API 创建和管理长时间对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) ，查看并排对比并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8月7日

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

推出了 `minimal` [推理努力程度](https://developers.openai.com/api/docs/guides/reasoning) 取值，以在 GPT-5 模型（支持推理）中优化快速响应。

引入 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时使用自由格式的输入和输出。

## June, 2025

### Jun 27

功能

已上线对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing)。Priority processing 在保持按量付费灵活性的同时，显著降低并稳定了延迟，相较 Standard processing 优势明显。

### 6 月 24 日

Feature · Model: o3-deep-research · Model: o3-deep-research-2025-06-26 · Model: o4-mini-deep-research · Model: o4-mini-deep-research-2025-06-26 · API: v1/responses

发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。详情请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对异步事件处理的支持，详见 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化了定价](https://developers.openai.com/api/docs/pricing) ，适用于 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

特性 · API: v1/responses

[新的可复用提示](https://developers.openai.com/chat/edit) 现已在仪表板和 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现在可以通过 `prompt` 参数引用在仪表板中创建的模板（带有提示 `id`，可选 `version`），并提供动态 `variables` ，其中可包含字符串、图像或文件输入。可复用提示在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

Feature · Model: o3-pro · API: v1/responses · API: v1/batch

发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，使用更多算力来回答难题，具有更出色的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批量和 flex 处理。

### Jun 4

Feature · API: v1/fine_tuning

为以下模型新增了 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 的微调支持 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### Jun 3

Feature · API: v1/chat/completions · API: v1/realtime

为以下模型提供了新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

特性 · API: v1/responses

为 Responses API 中新的内置工具添加了支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API: v1/responses · API: v1/chat/completions

新增了对使用 `strict` 模式的支持，可在非微调模型上使用并行工具调用时用于工具架构。
新增了 [架构特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 以及其他模式的字符串校验，并可为数字和数组指定取值范围。

### May 15

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已上线 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对以下用途进行了优化 [Codex CLI](https://github.com/openai/codex).

### 5 月 7 日

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已上线对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [fine-tuning methods](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已上线对 [增强的 API 预算告警与自动充值限额](https://platform.openai.com/settings/organization/limits).

### 4 月 23 日

功能 · API: v1/images/generations · API: v1/images/edits

新增了一个图像生成模型， `gpt-image-1`。该模型为图像生成设立了新标准，具备更出色的质量与指令遵循能力。

更新了图像生成与编辑接口，以支持该模型 `gpt-image-1` 特有的新参数。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学和编程、视觉推理任务以及技术写作方面树立了新的标准。

发布了 Codex，我们的代码生成命令行工具。

### 4 月 14 日

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入 API。这些新模型在指令遵循、编码以及更大上下文窗口（最高 1M tokens）方面均有改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## March, 2025

### Mar 20

更新 · API: v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型接口已迁移至 Audio API。

### Mar 19

特性 · 模型：o1-pro · API：v1/responses · API：v1/batch

发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的一个版本，使用更多算力来回答难题，具有更出色的推理能力和一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多个新模型和新工具，以及面向智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体与工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计将于 2026 年下线（实现完全功能对等之后）。

### 3 月 3 日

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 字段支持至微调任务。

## 2025 年 2 月

### 2 月 27 日

特性 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——迄今为止我们最大且能力最强的对话模型。GPT-4.5 较高的“情商”和对用户意图的理解使其在创意任务和智能体规划方面表现更佳。

### 2 月 25 日

功能

推出了 [API 用量仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新响应了对更多数据筛选条件的请求，例如项目选择、日期选择器以及更细粒度的时间区间。同时还更好地支持跨不同产品和服务层级查看用量。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## January, 2025

### Jan 31

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已上线 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一款针对科学、数学和编程任务优化的全新小型推理模型。

### Jan 21

功能 · 模型：o1

扩展了对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已上线 [Admin API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，允许客户以编程方式轮换其 admin 接口 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，允许客户在邀请用户加入组织的同时，以编程方式将他们邀请到项目。

### Dec 17

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增模型： [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 添加了 WebRTC 连接方式，适用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出了使用 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

的偏好微调。推出了适用于 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 在 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已上线 [用量 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，中新增支持，使客户能够以编程方式查询 OpenAI API 各方面的活动与支出。

## November, 2024

### Nov 20

Update · API: v1/chat/completions

发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中最新推出的模型。

### 11月 4日

功能 · API: v1/chat/completions

发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs)，可显著降低响应中有大量内容事先已知的模型响应延迟。这种情况在仅对文档和代码文件进行小幅改动后重新生成内容时最为常见。

## 2024年10月

### 10月30日

Feature · Model: gpt-4o-realtime-preview · Model: gpt-4o-audio-preview · API: v1/chat/completions

在以下位置新增了五种语音类型 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10月17日

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

发布 [全新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于聊天补全，同时支持音频输入和输出。使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 DevDay 上发布了几项新功能 [OpenAI 旧金山 DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：使用 WebSockets 接口在应用中构建快速的语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出微调高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o 以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对近期出现过的输入 token 提供折扣和更快的处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit)：在 Playground 中使用生成按钮轻松生成提示词、函数定义和结构化输出架构。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

发布 [全新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，该模型同时支持图像和文本（针对部分类别），并新增了两个仅文本的危害类别，且评分更准确。

### Sep 12

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，是新型的大语言模型，通过强化学习训练，可执行复杂的推理任务。

## 2024 年 8 月

### 8 月 29 日

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API: v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)—所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8 月 15 日

更新 · 模型：gpt-4o · API：v1/chat/completions

发布 [的动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8 月 6 日

更新日志

已上线 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中最新推出的模型。

### Aug 1

更新日志

已上线 [管理与审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志必须在 [settings](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新日志

已上线 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，使采用自定义或无限量计费方案的企业客户能够针对其所需的 IDP 设置身份验证。

### Jul 23

更新日志

已上线 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization),可为特定用例带来更高的性能。

### 7月18日

更新日志

发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，一款经济实惠的智能小模型，适用于快速、轻量的任务。

### Jul 17

更新日志

发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新日志

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传递来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 以 Beta 形式发布。

### Jun 3

更新日志

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### May 15

更新日志

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对 [设置成本限制](https://platform.openai.com/settings/organization/general) 按项目为按量付费客户提供。

### May 13

更新日志

发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 可在 API 中使用。GPT-4o 是我们最快且性价比最高的旗舰模型。

### 5 月 9 日

更新日志

新增对 [image inputs to the Assistants API。](https://developers.openai.com/api/docs/assistants/migration)

### 5 月 7 日

更新日志

新增对 [fine-tuned models to the Batch API](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新日志

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) parameter to the Chat Completions and Completions APIs。设置该参数后，开发者在使用流式传输时可以访问使用情况统计信息。

### 5月 2日

更新日志

新增 [a new endpoint](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 的线程中删除消息。

## 2024 年 4 月

### 4 月 29 日

更新日志

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 至 Chat Completions 和 Assistants API。

新增了 [Batch API 使用指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [嵌入模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新日志

引入了一系列 [Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的 文件搜索 工具，每个助手支持最多 10,000 个文件、新的 token 控制以及 tool choice 支持。

### 4 月 16 日

更新日志

引入 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目维度管理速率和成本限额（成本限额仅对企业客户开放）。

### 4 月 15 日

更新日志

发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新日志

发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式可用

### Apr 4

更新日志

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新日志

新增对 [按 run_id 筛选 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## March, 2024

### Mar 29

更新日志

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant message creation](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新日志

新增对 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### 2月9日

更新日志

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新日志

发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新日志

发布了 Embedding V3 模型和更新后的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 至 Embeddings API

## December, 2023

### Dec 20

更新日志

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建操作

### 12 月 15 日

更新日志

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新日志

Changed [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数设为可选

## November, 2023

### Nov 30

更新日志

发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新日志

发布 [GPT-4 Turbo 预览版](https://developers.openai.com/api/docs/models/gpt-4-turbo), [已更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

已弃用 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023年10月

### 10月16日

更新日志

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 至 Embeddings API

新增 `max_tokens` 至 [Moderation models](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新日志

新增 [function calling support](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 至微调 API
