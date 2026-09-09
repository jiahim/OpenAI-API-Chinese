# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

> OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 8 日

功能 · API：v1/responses

[提示词缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已面向 GPT-5.6 及后续受支持模型正式推出于 Responses API。

将缓存复用情况与先前响应进行比较，识别缓存未命中的原因，并按照故障排查指南改进缓存复用。

### 9 月 8 日

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 可通过图像 API 及 Responses API 的图像生成工具进行图像生成和编辑。

在编辑精度至关重要的工作流中使用 Sunburst，或使用 Flare 快速生成高质量的日常图像。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 代币费率。请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 3

特性 · 模型: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，是我们最强大的模型，专为最困难的端到端任务而构建。

将 GPT-6 Astra 用于推理、编码、计算机使用、研究和文档创建。它结合这些能力，使用你提供的上下文和工具，将复杂任务从初始请求推进到最终结果。

迁移时需要考虑的主要变更：

- GPT-6 Astra 不支持设置 `none` 推理力度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果将工具与 Chat Completions 一起使用，请遵循 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [不一致性监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在支持的 Responses API 请求中，异步检查 智能体 工作期间可能出现的问题。检查可触发安全警报或停止会话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解其能力、提示方法和迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 用于浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 以了解可用的推理档位。

### Sep 3

功能 · API：v1/responses

在 Responses API 中为基于 GPT-6 Astra 的长时间运行任务添加了新的控制选项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让你的应用在运行函数或自定义工具的同时，让模型继续工作，然后在结果就绪时返回这些结果。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：通过 WebSockets 在响应进行中发送额外指令，以便模型能够纳入更正或变化的需求。
- [在对话中途更改推理工作量](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，为困难任务增加工作量，或为常规跟进减少工作量。

### Sep 2

更新

更新了 API 错误，以便应用程序能够区分流量增长过快与临时性的模型过载。

流量增长过快时可能返回 `429` 错误，并附带 `slow_down` 代码。临时性的模型过载则返回 `503` 错误，并附带 `server_is_overloaded` 代码。两种响应都可能包含 `Retry-After`。当该响应头存在时，重试前至少等待其指定的时间；若缺失，则使用指数退避。请参阅 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### 9月 1日

更新

到 `api.openai.com` 的连接现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 中正式发布。你可以在 [Platform console](https://platform.openai.com/settings/organization/security)，中直接配置证书和 X.509 身份提供商，访问权限由你组织的角色和权限控制。

### Aug 26

Update · Model: whisper-1 · Model: gpt-4o-transcribe · Model: gpt-4o-mini-transcribe · Model: gpt-4o-transcribe-diarize · API: v1/audio/transcriptions · API: v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移到 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请使用以下迁移指南迁移到 Responses API 和 Conversations API [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以使用带有前缀的域，为单个请求选择区域处理，并使用来自具有 Global 地理设置的项目的 API 密钥。现有的资格、数据保留控制、端点和模型支持要求仍然适用。在 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现已调整为每百万输入令牌 4 美元、每百万输出令牌 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少在 2026 年 11 月 21 日之前有效。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

发布了 [Prompt Caching 仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching) ，在 OpenAI API 平台上。你可随时间追踪缓存命中率、每次写入的缓存读取数，以及缓存读取、缓存写入和未缓存 token 的分布，从而了解缓存效率并识别可改进之处。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已可用于预览， `gpt-image-2` 和 `gpt-image-2-2026-04-21` ，在 Images API 和 Responses API 图像生成工具中。设置 `background` 为 `transparent` ，并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。详细了解请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式——一种面向 GPT-5.6 Sol 的全新 API 服务层级，速度比 Standard 处理快至 14 倍。目前以限量预览形式向部分客户提供。点击此处注册以接收 Ultrafast 模式的最新动态 [此处](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获批准的防御方提供两级访问权限：Daybreak Blue 和 Daybreak Red。你可以使用它们在明确授权的任务中将安全发现转化为已验证的修复方案。

大多数防御性安全工作请从 Daybreak Blue 开始。它提供对通用模型（如 GPT-5.6 Sol）的访问，可用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析以及补丁验证。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经另行审批的访问权限，可使用经过专门训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已获授权的漏洞复现、利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要另行审批与配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### 8月6日

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，它指向 Plus 和 Pro 用户在 ChatGPT 中可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 进行生产 API 使用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现已在 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 上支持长上下文请求。从今天起，超过 272K token 的长上下文提示词可以在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，相比 Standard 层级速度提升最高可达 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。中按 API key 进行数据筛选和分组。 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API key 维度，便于进行程序化报告与分析。

## July, 2026

### Jul 30

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格下调 80%，GPT-5.6 Terra 的价格下调 20%。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) ，作为原 Priority Processing（优先处理）的替代方案。在 API 中，GPT-5.6 Sol 的 Fast 模式相比标准处理速度最高提升 2.5 倍，价格也翻倍。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于通过基础设施即代码的方式管理 OpenAI API Platform 资源。

配置并管理项目、用户、群组、角色、访问分配、服务账号、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流审阅并应用变更、导入现有资源，以及检测和协调配置漂移。从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录和已提交 Realtime 轮次的最终转录文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

两个模型都支持自由格式的转录上下文、关键词提示和多种预期的输入语言。在以下位置比较支持的输出和工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

已在 OpenAI API 平台上为组织和项目添加硬性支出限额。可设置每月上限，当追踪到的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。可使用支出告警在流量中断前进行通知。详情请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits).

### 7 月 9 日

功能 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions · API：v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括面向前沿能力的 GPT-5.6 Sol、在智能与成本之间取得平衡的 GPT-5.6 Terra，以及面向高吞吐量高效工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理、 `max` 推理强度与 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，和 [面向 Responses API 的多 智能体 编排功能（测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像，并提供 `original` 或 `auto` 图像细节参数。

### 7 月 6 日

特性 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，这是一款更新后的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款面向实时语音应用的更快、更低成本的蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` 快照，该快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 进行生产 API 使用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月23日

功能

在 OpenAI API 平台上发布了安全使用仪表板。安全仪表板根据请求中发送的值来显示被拦截的 Responses 请求，以识别最终用户。 `safety_identifier` 访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在可以与常规文本结果一同返回图片结果。当你的应用需要最新或来自网页的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，可使用图片搜索。更多信息请阅读 [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6 月 5 日

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### Jun 4

特性 · 模型: omni-moderation-latest · API: v1/responses · API: v1/chat/completions

为 Responses API 和 Chat Completions API 添加了审核分数。在生成请求中传入 `moderation` 对象，以便在同一次响应中同时获得模型输入和生成输出的审核结果。

详情请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体构建器。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解关停时间表与迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，而不是按完整的 20 分钟会话费率计费。底层每分钟费率保持不变。

此更新旨在为较短会话提供更精细的计费，并降低客户的实际成本。

你可以在我们的 [API 定价文档](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现可通过与 OpenAI 兼容的 Responses API 端点在 Amazon Bedrock 中使用。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而不是 `in_memory`，默认启用扩展的提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月 28 日

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，它指向当前 ChatGPT 中使用的最新 Instant 模型。建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 进行生产 API 使用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

已发布 [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation). 受信任的工作负载可以将外部签发的身份令牌交换为短期的 OpenAI 访问令牌，无需存储长期有效的 API 密钥。

### May 26

更新

新增 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，可用于管理支出告警、模型允许列表、数据保留设置和 托管工具 权限，并查询细粒度的计费明细项。

### 5月19日

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 为企业客户提供。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 和 AgentKit）通过客户自托管的 `tunnel-client` 连接到私有或本地 MCP 服务器，而无需将这些服务器暴露给公共互联网。

### 5月19日

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。若要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5 月 12 日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照以及 Realtime API 试用版。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日被弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 替代。

Realtime API 试用版已于 2026 年 5 月 12 日被弃用并从 API 中移除。如果你仍在使用试用版接口，请迁移到已正式发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### May 11

功能 · API：v1/responses

已为 响应接口 新增 `return_token_budget` 为 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research).可用于选择启用更长时间的 GPT-5+ 推理 网页搜索 运行,以应对高强度的研究与评估工作负载。

### May 7

特性 · 模型: gpt-realtime-2 · 模型: gpt-realtime-translate · 模型: gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款新的实时语音模型,支持对语音到语音智能体的可配置推理,同时推出了 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) ,用于流式语音翻译,以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) ,用于流式语音转文字。

已更新 [Realtime 和音频指南](https://developers.openai.com/api/docs/guides/realtime),新增了专门的 [Realtime 翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation),更新了 [Realtime 转录](https://developers.openai.com/api/docs/guides/realtime-transcription) ,用于流式转录,并将实时提示词相关指导移入 [使用实时模型](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### May 7

功能

发布了 [OpenAI Developers Codex 插件](https://developers.openai.com/learn/developers-codex-plugin)。这能帮助你在 Codex 中通过 OpenAI Platform 访问和 OpenAI API 配置指引构建 AI 应用和智能体。

### 5 月 6 日

更新

更新后的 Agents SDK 现已在 TypeScript 中提供，支持沙箱 智能体，并内置了开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### May 5

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，它指向当前 ChatGPT 中使用的最新 Instant 模型。建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境 API 场景,但你可以自由地使用此模型来测试我们在对话用例方面的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

更新

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。参见 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解安装步骤和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，面向复杂专业工作的全新前沿模型，已接入 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求中处理那些需要更多算力的难题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP，以及 网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存，不支持内存提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真度的图像输入、基于 token 的图像定价，以及享受 50% 折扣的 Batch API 支持。

### 4 月 15 日

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 新增了一系列新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源 harness；以及
- 控制何时创建记忆以及它们的存储位置。

## 2026 年 3 月

### 3 月 17 日

特性 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 与 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到了更快速、更高效的模型上，适用于大规模工作负载；而 GPT-5.4 nano 针对追求极致速度和成本的高量级简单任务进行了优化。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [压缩](https://developers.openai.com/api/docs/guides/compaction). GPT-5.4 nano 支持压缩，但不支持工具搜索或计算机使用。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug，用于指向 ChatGPT 当前使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

我们更新了图像编码器，以修复一个关于 `input_image` GPT-5.4 中输入的小缺陷。部分图像理解用例的质量可能会有所提升，无需任何额外操作。

### 3 月 12 日

功能 · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用，支持最长 `20` 秒的生成时长、 `1080p` 输出、 `sora-2-pro`、视频扩展，以及 Batch API 对 `POST /v1/videos`. `1080p` 生成任务的支持。 `sora-2-pro` 生成按 `$0.70` 每秒计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

已为 响应接口 新增 `POST /v1/videos/edits` 用于编辑现有视频。该接口将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

Feature · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4),我们面向专业工作的最新前沿模型,已在 Chat Completions 和 Responses API 中提供,并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 已在 Responses API 中提供,用于受益于更多算力的更难题。

同时发布:
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，它允许模型将大型工具集合延迟到运行时再加载，以降低 token 用量、保持缓存性能并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 为 GPT-5.4 提供支持 `computer` 用于基于截图的 UI 交互的工具。
- 支持 1M token 上下文窗口，并原生提供 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持更长时间运行的 智能体 workflows。

### Mar 3

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 适用于 Chat Completions 和 Responses API。该模型指向当前 ChatGPT 中使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses · API: v1/chat/completions

扩展 `input_file` 支持更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 到 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API: v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API：v1/responses

为 Responses API 推出 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，和 `gpt-image-1-mini`.

### 2 月 10 日

更新 · Model: gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug，用于指向 ChatGPT 当前使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

已上线 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，适用于 Responses API。

### 2 月 10 日

功能 · API：v1/responses

已上线对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 功能的支持，适用于 Responses API。我们在本地执行和基于托管容器的执行两种方式中均支持 Skills。

### 2 月 10 日

功能 · API：v1/responses

已上线全新的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器内的网络功能。

### Feb 9

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 GPT 图像模型的 `application/json` 请求支持。 `/v1/images/edits` JSON 请求使用 `images` （以及可选的 `mask`），并通过 `image_url` 或 `file_id` 引用替代 multipart 上传。

### Feb 3

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在的运行速度提升了约 40%。模型及模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

已公布 [Open Responses](https://www.openresponses.org/): 一个用于构建多提供商、可互操作的 LLM 接口的开源规范，建立在原始的 OpenAI Responses API 之上。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API: v1/realtime

为 Realtime API 添加了专用的 SIP IP 段。 `sip.api.openai.com` GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### Jan 13

更新 · Model: gpt-realtime-mini · Model: gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要先前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · Model: sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果需要先前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 指向 `2025-12-15` 快照。如果需要先前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，该问题中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过以下方式进行图像编辑时错误地使用了高保真度 `/v1/images/edits`，即使 `fidelity` 被显式设置为 `low` （默认值）。

## December, 2025

### Dec 19

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已为 响应接口 新增 `gpt-image-1.5` 和 `chatgpt-image-latest` to the Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。了解更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的改进。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，面向符合条件的客户。

### Dec 11

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，是 GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相较于之前的 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 在 API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新内容是新增的 xhigh 推理力度等级、更简洁的推理摘要，以及基于压缩的新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 进行的长对话，你可以使用 `/responses/compact` 端点来缩减每次请求发送的上下文。

### 12月4日

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长周期、agentic 编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API: v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处的文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · 模型: gpt-5.1 · 模型: gpt-5.1-codex · 模型: gpt-5.1-chat-latest · 模型: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，GPT-5 模型系列中的最新旗舰模型。GPT-5.1 在以下方面经过专门优化，表现出色：

- 在不需要深度思考时具有更强的可控性与更快的响应速度
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认启用一项新的 `none` 推理设置，以便在所需思考更少时提供更快响应——这与 GPT-5 中先前的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定在整个组织及各项目中谁能执行哪些操作——无论是通过 API 还是在控制台中。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 针对 Codex 或类似环境中的智能体编码任务优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展提示缓存保留可使缓存前缀保持有效更长时间，最长可达 24 小时。扩展提示缓存的工作原理是：当显存已满时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

已发布 [UK data residency](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，上发布了多项新功能， [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力进行更深入的思考，从而提供始终更优的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成与编辑。

已上线 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、细腻且动态的视频生成与再创作。

已上线 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于以可视化方式构建自定义的多智能体工作流。

已上线 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [追踪评估、数据集和提示词优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已上线 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表仅允许你指定的 IP 地址或地址段访问 API。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增支持将图片和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### 9 月 23 日

特性 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API: v1/realtime

OpenAI Realtime API 现已正式发布。了解更多信息 [请参阅 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对 GPT 图像模型的 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，用于 Google 应用、Dropbox 等流行服务，可让模型读取存储在这些服务中的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，和 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，以便在 GPT-5 模型（支持推理）中优化快速响应。

引入了 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入和从模型输出自由格式的内容。

## June, 2025

### Jun 27

功能

已上线对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing)。Priority processing 在保持按量付费灵活性的同时，相比 Standard processing 可显著降低延迟并提升稳定性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。更多信息请参阅 [deep research guide](https://developers.openai.com/api/docs/guides/deep-research).

新增对以下方式异步事件处理的支持： [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化了价格](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增对以下内容的支持： [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现在已在仪表板中提供，并且 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过 API，你现在可以通过 `prompt` 参数（使用提示词 `id`，可选 `version`）并提供动态 `variables` ，可包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，是 接口 的一个版本 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型，通过更多算力来更好地推理和保持一致性，以回答难题。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括 batch 和 flex 处理。

### Jun 4

功能 · API：v1/fine_tuning

新增微调支持，提供 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 功能，适用于这些模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，和 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · API：v1/chat/completions · API：v1/realtime

提供新的模型快照，供 [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。使用。发布了 [面向 TypeScript 的 Agents SDK](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API：v1/responses

在 Responses API 中新增对多个内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API: v1/responses · API: v1/chat/completions

新增对使用 `strict` 模式的支持，可在未经过微调的模型上使用并行工具调用时用于工具 schema。
新增 [schema 功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 及其他模式进行字符串校验，并为数字和数组指定取值范围。

### May 15

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已上线 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对以下用途进行了优化： [Codex CLI](https://github.com/openai/codex).

### May 7

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已上线对 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning). 了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现可进行微调。

## 2025年4月

### 4月30日

功能

已上线对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### 4 月 23 日

特性 · API: v1/images/generations · API: v1/images/edits

新增了图像生成模型， `gpt-image-1`。该模型为图像生成树立了新标准，具有更高的质量和指令遵循能力。

更新了图像生成与编辑接口，以支持该模型特有的新参数， `gpt-image-1` 。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增了两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编程、视觉推理任务以及技术写作方面树立了新的标准。

推出了 Codex——我们的代码生成 CLI 工具。

### Apr 14

功能 · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

已为 响应接口 新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，和 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入到 API。这些新模型具有更强的指令遵循能力、代码能力，并提供更大的上下文窗口（最高 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。同时宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

已为 响应接口 新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `whisper-1` 模型迁移到 Audio API。

### 3月19日

功能 · 模型: o1-pro · API: v1/responses · API: v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，是 接口 的一个版本 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型，通过更多算力来更好地推理和保持一致性，以回答难题。

### 3 月 11 日

特性 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多个新模型和工具，以及一个用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 发布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计于 2026 年停止使用（届时将实现完整的特性对等）。

### Mar 3

功能 · API：v1/fine_tuning/jobs

已为 响应接口 新增 `metadata` 字段对微调作业的支持。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——我们迄今为止规模最大、能力最强的对话模型。GPT-4.5 具备较高的“情商”和对用户意图的理解能力，因此在创意任务和智能体规划方面表现更佳。

### Feb 25

功能

已推出 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。本次更新回应了增加数据筛选器的需求，例如项目选择、日期选择器以及更细粒度的时间区间。同时也更好地支持跨不同产品和服务层级查看用量。

### Feb 5

功能

在欧洲推出数据驻留。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已上线 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，一款全新的小型推理模型，针对科学、数学和编码任务进行了优化。

### Jan 21

Feature · Model: o1

扩展了对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已上线 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理 api 密钥。

已更新 [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在用户被邀请加入组织的同时，以编程方式邀请他们加入项目。

### Dec 17

特性 · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

新增以下模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下接口新增了 WebRTC 连接方式： [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

已为 响应接口 新增 [`reasoning_effort` parameter](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

已为 响应接口 新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下方法的偏好微调： [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

已为 响应接口 新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，可通过以下方式使用： [Python SDK](https://github.com/openai/openai-python).

### 12月4日

功能

已上线 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，支持客户跨 OpenAI API 以编程方式查询活动与支出。

## November, 2024

### 11 月 20 日

更新 · API：v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，这是我们在 gpt-4o 系列中最新推出的模型。

### Nov 4

功能 · API：v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，可大幅降低事先已知大部分响应内容的模型响应延迟。这在仅对文档和代码文件的内容进行少量更改的重新生成场景中最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

在 Chat Completions API 中新增了五种新的语音类型 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [聊天补全接口](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 chat completions，支持音频输入和输出。使用与该模型相同的底层模型 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI DevDay（于旧金山举办）](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：使用 WebSockets 接口在你的应用中快速构建语音对语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用来自大型前沿模型的输出，对高性价比的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本对 GPT-4o 进行微调，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近见过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit)：使用 playground 中的生成按钮，轻松生成提示、函数定义和结构化输出架构。

## September, 2024

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它同时支持图像和文本（部分类别），新增了两个仅限文本的伤害类别，并提供了更准确的评分。

### 9月12日

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这是通过强化学习训练的新一代大型语言模型，可用于执行复杂的推理任务。

## August, 2024

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)—所有 API 用户现均可对最新的 GPT-4o 模型进行微调。

### 8月15日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 当前使用的最新 GPT-4o 模型。

### 8月6日

更新

已上线 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，这是我们在 gpt-4o 系列中最新推出的模型。

### Aug 1

更新

已上线 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，使客户能够以编程方式管理其组织，并通过审计日志监控变更。必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已上线 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许采用自定义和无限计费方案的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已上线 [GPT-4o mini 的微调](https://developers.openai.com/api/docs/guides/model-optimization),从而在特定用例上实现更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini),我们的智能小巧模型,价格亲民,适用于快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 用于分块上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可通过在 Chat Completions 和 Assistants API 中传递以下参数来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### Jun 3

更新

新增对 GPT 图像模型的 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### May 15

更新

新增对 GPT 图像模型的 [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对 GPT 图像模型的 [设置成本限制](https://platform.openai.com/settings/organization/general) ，按项目为按需付费的客户设置。

### 5月13日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且性价比最高的旗舰模型。

### 5月9日

更新

新增对 GPT 图像模型的 [向 Assistants API 输入图像。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增对 GPT 图像模型的 [向 Batch API 输入微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5 月 6 日

更新

已为 响应接口 新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 将参数传递给 Chat Completions 和 Completions API。设置后，开发者在使用流式传输时可以获取使用情况统计信息。

### May 2

更新

已为 响应接口 新增 [一个新的端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 中的线程里删除一条消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [嵌入模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4月17日

更新

推出了一系列 [对 Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的 文件搜索 工具（每个智能体最多支持 10,000 个文件）、新的 token 控制以及对 tool choice 的支持。

### 4 月 16 日

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目管理工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目设置速率和成本限制（成本限制仅对企业客户开放）。

### 4 月 15 日

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) in general availability in the API

### 4月4日

更新

新增对 GPT 图像模型的 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 GPT 图像模型的 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 GPT 图像模型的 [在创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### 4月1日

更新

新增对 GPT 图像模型的 [按 run_id 过滤 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## March, 2024

### Mar 29

更新

新增对 GPT 图像模型的 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [创建助手消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对 GPT 图像模型的 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024年2月

### Feb 9

更新

已为 响应接口 新增 [`timestamp_granularities` parameter](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布了 Embedding V3 模型和更新的 GPT-4 Turbo 预览版

已为 响应接口 新增 [`dimensions` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## December, 2023

### Dec 20

更新

已为 响应接口 新增 [`additional_instructions` parameter](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建

### 12月15日

更新

已为 响应接口 新增 [`logprobs` 以及 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数变为可选

## 2023年11月

### 11月30日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，和 [文字转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用 Chat Completions `functions` 参数 [改为使用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

已为 响应接口 新增 [`encoding_format` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

已为 响应接口 新增 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

已为 响应接口 新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
