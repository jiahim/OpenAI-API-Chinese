# 更新日志

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

> OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026年8月

### 8月21日

功能

API 客户现在可以通过使用项目所属地理区域为全局地域的 API 密钥及前缀域名，为单个请求选择区域处理。现有的资格要求、数据保留控制、端点和模型支持要求仍然适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### 8月21日

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现价为每百万输入令牌 4 美元，每百万输出令牌 20 美元，输入定价降低 20%，输出定价降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8月20日

功能

已在 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 上于 OpenAI API 平台发布。跟踪你的缓存命中率随时间的变化、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的细分，以了解你的缓存效率并识别改进机会。按模型和服务层级筛选指标。

### 8月20日

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在预览版中可用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 及 Responses API 图像生成工具中。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8月13日

公告

已公布 Ultrafast 模式，这是 GPT-5.6 Sol 的一个新的 API 服务层级，比标准处理快高达 14 倍。目前仅向选定客户提供有限预览。注册以接收 Ultrafast 模式的更新 [此处的链接](https://openai.com/form/ultrafast/).

### 8月7日

特性 · 模型：gpt-5.6-cyber · 模型：daybreak-red-latest · 模型：daybreak-blue-latest · API：v1/responses

Daybreak 现在为已批准的防御者提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们可以在明确授权的参与中，从安全发现转向经过验证的修复。

从 Daybreak Blue 开始处理大多数防御性安全工作。它提供对通用模型的访问，例如 GPT-5.6 Sol，用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。了解更多 [此处](https://developers.openai.com/api/docs/models/daybreak-blue-latest).

Daybreak Red 提供对经过单独批准访问的专用训练模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于授权的漏洞复现、漏洞验证、渗透测试、红队演练和复杂系统分析。

这些模型需要单独批准和配置。你可以申请加入 Daybreak 计划 [此处](https://openai.com/daybreak/)。有关定价的更多详情 [此处](https://developers.openai.com/api/docs/pricing).

### 8月6日

更新 · 模型：chat-latest

更新了 **chat-latest** 快照，该快照指向 ChatGPT 中 Plus 和 Pro 用户可用的最新模型。我们建议利用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产 API 使用，但你可以随意使用此模型来测试聊天用例的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 8 月 5 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

快速模式现支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。自今日起，超过 272K token 的长上下文提示可在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度比标准层级快达 2.5 倍。查看 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8月4日

功能

客户现在可以在API密钥的 [使用量和成本仪表板](https://platform.openai.com/settings/organization/usage)。中筛选和分组数据。此外， [使用量API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持按API密钥维度进行编程报告和分析。

## 2026年7月

### 7月30日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自7月30日起，GPT-5.6 Luna 成本降低80%，而 GPT-5.6 Terra 成本降低20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 在 API 中，取代了原有的优先处理服务。对于 GPT-5.6 Sol，快速模式现在比标准处理速度快达 2.5 倍，价格为两倍。此变更向后兼容：标记为优先的请求将自动使用快速模式。

### 7月29日

功能

发布了官方 [OpenAI Terraform 提供程序](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API 平台资源作为基础设施即代码进行管理。

预配和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，以及检测和协调配置漂移。从 [Terraform 注册表](https://registry.terraform.io/providers/openai/openai/latest).

### 7月28日

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于准确的音频转录和已提交 Realtime 轮次的最终转录文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

这两个模型都支持自由形式的转录上下文、关键词提示和多种预期的输入语言。在 [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7月22日

功能特性

为OpenAI API平台上的组织和项目增加了硬性支出限制。设置月度上限，当跟踪的支出达到限制时，受影响的API请求将返回 `429` 错误。在流量中断之前，使用支出提醒进行通知。更多信息请参阅 [支出限制指南](https://developers.openai.com/api/docs/guides/spend-limits).

### 7月9日

功能 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions · API：v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model)，包括用于前沿能力的 GPT-5.6 Sol、用于智能与成本平衡的 GPT-5.6 Terra，以及用于高效高吞吐工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理努力和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [多智能体编排（Responses API 测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还接受原始尺寸的图像，支持 `original` 或 `auto` 图像细节。

### 7月6日

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，改进了字母数字识别、静音和噪音处理以及中断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款更快、成本更低的蒸馏推理模型，专为实时语音应用设计。

## 2026年6月

### 6月24日

更新 · 模型：chat-latest

更新了 `chat-latest` 快照，该快照指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议在生产环境中使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 进行 API 用途，但你可以随意使用此模型来测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月23日

功能

在 OpenAI API 平台上发布了安全使用仪表盘。该安全仪表盘展示基于 `safety_identifier` 请求中用于识别终端用户的值而被阻止的 Responses 请求。访问 [安全仪表盘](https://platform.openai.com/usage/safety).

### 6月9日

功能特性 · API：v1/responses

网页搜索现在可以返回与常规文本结果一同出现的图片结果。当你的应用程序需要最新或基于网络的视觉效果（如产品照片、地标、地点、活动或视觉参考）时，请使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月5日

更新

发布了 OpenAI API 平台的重新设计导航，请访问 [此处](https://platform.openai.com/login).

### 6月4日

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

在 Responses API 和 Chat Completions API 中新增了审核分数。在生成请求中传入一个 `moderation` 对象，即可在同一响应中同时收到针对模型输入和生成输出的审核结果。

了解更多请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月3日

更新

宣布弃用可复用提示对象、Evals 平台和 智能体构建器。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解关闭时间线和迁移指南。

### 6月2日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费时长为 5 分钟，而非按完整的 20 分钟会话费率计费。底层每分钟费率保持不变。

此更新旨在让较短会话的计费更精细，并将降低客户的实际成本。

您可以在我们的 [API 定价文档中查看当前内置工具的定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### 6月1日

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现已在亚马逊云科技 Bedrock 中通过兼容 OpenAI 的 Responses API 端点提供。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026年5月

### 5月29日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认 `24h` 而非 `in_memory`，默认启用扩展提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · 模型：chat-latest

已发布 `chat-latest` 一个指向 ChatGPT 当前使用的最新 Instant 模型的快照。我们建议 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境 API 使用，但欢迎使用此模型测试聊天场景的最新改进。底层模型快照将定期更新。阅读更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月26日

功能

发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信任的工作负载可以将外部签发的身份令牌交换为短期 OpenAI 访问令牌，而无需存储长期 API 密钥。

### 5月26日

更新

新增 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置和托管工具权限，以及查询细粒度账单明细项。

### 5月19日

功能特性

发布时间：2025-06-12 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户推出。Secure MCP Tunnel 允许受支持的 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 和 AgentKit）通过客户托管的 `tunnel-client` 连接到私有或本地部署的 MCP 服务器，而无需将这些服务器暴露到公共互联网。

### 5月19日

更新

你现在可以管理多个 IP 允许列表，并在项目级别或整个组织范围内应用每一个。要配置它们，请前往 [设置 > 安全 > IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5月12日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 替代。

Realtime API Beta 已于 2026 年 5 月 12 日弃用并从 API 中移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。参见 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5月11日

功能 · API：v1/responses

新增 `return_token_budget` 用于 Responses API 的 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可选择启用更长的 GPT-5+ 推理 网页搜索 运行，适用于高强度研究和评估工作负载。

### 5月7日

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款支持可配置推理的新型实时语音模型，用于语音到语音的智能体，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译和 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

更新了 [Realtime 与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [Realtime 翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，刷新了 [Realtime 转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 用于流式转录，并将实时提示指导迁移至 [使用实时模型](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### 5月7日

功能

发布了 [OpenAI Developers 插件（适用于 Codex）](https://developers.openai.com/learn/developers-codex-plugin)。这将帮助你在 Codex 中构建 AI 应用和智能体，并获取 OpenAI 平台访问权限和 OpenAI API 设置指南。

### 5月6日

更新

更新后的Agents SDK现已在 TypeScript 中可用，支持沙盒智能体及内置的开源工具。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5月5日

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，该快照指向 ChatGPT 中当前使用的最新 Instant 模型。我们建议在 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 中进行生产 API 使用，但你可以随意使用此模型来测试我们对聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月4日

更新

Admin APIs 现已受 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 支持。请参阅 [Admin APIs 指南](https://developers.openai.com/api/docs/guides/admin-apis) 获取设置说明和示例。

## 2026年4月

### 4月24日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一个面向复杂专业工作的新前沿模型，已加入 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求，以解决需要更多计算资源的难题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、应用补丁、Skills、MCP 和 网页搜索。主要更新包括：
- 推理努力现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展提示缓存，不支持内存提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### 4月21日

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成和编辑的最先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及可享受 50% 折扣的 Batch API 支持。

### 4月15日

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 新增功能，包括：
- 在受控沙箱中运行智能体；
- 检查并定制开源工具集；以及
- 控制记忆何时创建以及存储在哪里。

## 2026年3月

### 3月17日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 已加入 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带入更快速、更高效的模型中，适用于高吞吐量工作负载，而 GPT-5.4 nano 则针对速度和成本最为重要的简单高吞吐量任务进行了优化。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [延续](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持延续，但不支持工具搜索或计算机使用。

### 3月16日

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) 的 slug，使其指向 ChatGPT 当前使用的最新模型。

### 3月13日

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个关于 `input_image` GPT-5.4 输入的小问题。某些图像理解用例现在可能会看到质量提升。无需采取任何操作。

### 3月12日

功能 · 模型: sora-2 · 模型: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，支持可复用的角色引用、更长的生成时长，最长可达 `20` 秒， `1080p` 输出 `sora-2-pro`、视频扩展和 Batch API 支持，用于 `POST /v1/videos`. `1080p` 生成， `sora-2-pro` 按 `$0.70` 每秒计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3月12日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

已新增 `POST /v1/videos/edits` 用于编辑现有视频。这将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [请点击此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3月5日

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，现已推出到 Chat Completions 和 Responses API，同时发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，以应对需要更多计算资源的难题。

同时发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 位于 Responses API 中，它允许模型将大型工具表面延迟到运行时，以减少令牌使用、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中得到支持 `computer` 用于基于截图的 UI 交互工具。
- 1M 令牌上下文窗口和原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持运行时间更长的 智能体 工作流。

### 3月3日

功能 · 模型: gpt-5.3-chat-latest · API: v1/chat/completions · API: v1/responses

于 `gpt-5.3-chat-latest` 发布至 Chat Completions 和 Responses API。该模型指向当前 ChatGPT 中使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026年2月

### 2月24日

功能 · API：v1/responses · API：v1/chat/completions

扩展了 `input_file` 对更多文档、演示文稿、电子表格、代码和文本文件类型的支持。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2月24日

功能 · API：v1/responses

已发布 `phase` 到Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。了解更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2月24日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 至Responses API。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2月23日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2月23日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 至实时 API。

已发布 `gpt-audio-1.5` 至 Chat Completions API。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2月10日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持用于 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2月10日

更新 · 模型：gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) 的标识符，使其指向 ChatGPT 中当前使用的最新模型。

### 2月10日

功能 · API：v1/responses

已发布 [服务端压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 于 Responses API 中。

### 2月10日

功能 · API: v1/responses

推出了对 [技能](https://developers.openai.com/api/docs/guides/tools-skills) 在 Responses API 中的支持。我们支持本地执行和托管容器执行两种方式的技能。

### 2月10日

功能 · API：v1/responses

推出了一个新的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，以及容器内联网支持。

### 2月9日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 `application/json` 请求的支持 `/v1/images/edits` 用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）配合 `image_url` 或 `file_id` 引用，而非多部分上传。

### 2月3日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为API客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在的运行速度快约 40%。模型和模型权重未变。

## 2026年1月

### 1月15日

公告

已宣布 [Open Responses](https://www.openresponses.org/)：一个开源规范，用于构建基于原始 OpenAI Responses API 的多提供商、可互操作 LLM 接口。

### 1月14日

功能 · 模型：gpt-5.2-codex · API：v1/responses

发布于 `gpt-5.2-codex` Responses API。GPT-5.2-Codex 是 GPT-5.2 的一个版本，专为 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### 1月13日

功能 · API：v1/realtime

为 Realtime API 增加了专用 SIP IP 范围。 `sip.api.openai.com` 进行 GeoIP 路由，并将 SIP 流量定向到最近区域。 [了解更多](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### 1月13日

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已将 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 的 slugs 更新指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### 1月13日

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) 的 slug 以指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### 1月13日

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 的 slug 以指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而不是 `gpt-4o-transcribe` 以获得最佳效果。

### 1月9日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过 `/v1/images/edits`，进行图像编辑时错误地使用高保真度的问题，即使 `fidelity` 被明确设置为 `low` （默认值）。

## 2025年12月

### 12月19日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已添加 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具中。

### 12月16日

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。了解更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的改进。了解更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，适用于符合条件的客户。

### 12月11日

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，GPT-5 模型系列中最新旗舰模型。GPT-5.2 相比之前 GPT-5.1 在以下方面有所改进：
- 通用智能
- 指令遵循
- 准确性与令牌效率
- 多模态能力——尤其是视觉
- 代码生成——尤其是前端界面创建
- 在API中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 中的新功能包括新的 xhigh 推理力度级别、简洁的推理摘要，以及使用压缩进行的新上下文管理。

### 12月11日

功能 · API：v1/responses/compact

已发布 [客户端侧压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 进行的长时间对话，你可以使用 `/responses/compact` 端点来缩减每轮发送的上下文。

### 12月4日

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 至Responses API。GPT-5.1-Codex 是我们面向长周期智能体编码任务优化的最智能编码模型。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025年11月

### 11月20日

功能 · API：v1/realtime

在 Realtime API 中增加了对 DTMF 按键的支持。现在，在使用 Realtime 边带连接时，你可以接收 DTMF 事件。参见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 以了解更多信息。

### 11月13日

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是GPT-5模型系列中最新的旗舰模型。GPT-5.1经过训练，尤其擅长：

- 在需要较少思考时提供更强的可控性和更快的响应
- 代码生成和编码用例
- 智能体工作流

请注意，GPT-5.1 默认采用新的 `none` 推理设置，以便在不需要太多思考时更快响应——这与之前的 `medium` GPT-5 默认设置不同。

### 11月13日

功能

发布 [增强的基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 让你可以通过 API 和仪表盘决定谁可以在你的组织和项目中执行哪些操作。

### 11月13日

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

发布于 `gpt-5.1-codex` 并 `gpt-5.1-codex-mini` 应用于Responses API。GPT-5.1-Codex 是 GPT-5.1 针对 Codex 或类似环境中智能体编码任务进行优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### 11月13日

功能

发布时间 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention). 扩展提示缓存保留使缓存的上下文前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存通过在内存满时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## 2025年10月

### 10月29日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### 10月24日

功能

发布时间 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm)。企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥对 OpenAI 中的客户内容进行加密。

### 10月24日

功能

发布时间 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10月6日

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

发布了多项新功能。发布了 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)， [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多计算资源进行更深入的思考，并提供始终更优质的答案。发布了。

GPT-Realtime mini [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以提供更具成本效益的语音到语音性能。发布了。

gpt-image-1-mini [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以提供更具成本效益的图像生成和编辑。推出。

v1/videos [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，用于使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型。

推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于可视化创建自定义的多智能体工作流。

推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

推出 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### 10月1日

功能

发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表将 API 访问限制为你指定的 IP 地址或范围。

## 2025年9月

### 9月26日

功能 · API：v1/responses

新增支持图片和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### 9月23日

功能 · 模型：gpt-5-codex · API：v1/responses

已推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为与以下工具配合使用而构建和优化 [Codex CLI](https://github.com/openai/codex).

## 2025年8月

### 8月28日

功能 · API：v1/realtime

OpenAI Realtime API 现已全面可用。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### 8月21日

功能特性 · API：v1/responses

新增了对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 的Responses API支持。连接器是OpenAI维护的 MCP 包装器，适用于 Google apps、Dropbox 等常用服务，可用于让模型读取存储在这些服务中的数据。

### 8月20日

功能 · API: v1/conversations · API: v1/responses · API: v1/assistants

发布了 Conversations API，允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8月7日

功能 · API: v1/chat/completions · API: v1/responses

在API中发布了GPT-5系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [推理努力](https://developers.openai.com/api/docs/guides/reasoning) 值，以优化GPT-5模型（支持推理）中的快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，该类型允许在工具调用时提供自由格式的输入和输出。

## 2025年6月

### 6月27日

功能

已推出对 [优先处理](https://platform.openai.com/docs/guides/priority-processing)。的支持。与标准处理相比，优先处理可显著降低延迟并提高一致性，同时保留按需付费的灵活性。

### 6月24日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，我们 o 系列推理模型的深度研究变体，专为深层分析和研究任务优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增了对异步事件处理的支持，通过 [Webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降价并简化了定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增了对 [网页搜索工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已可在仪表板及 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中使用。通过 API，你现在可以在仪表板创建的模板中引用 `prompt` 参数（附带提示词 `id`、可选 `version`）并提供动态 `variables` 输入，可包含字符串、图片或文件输入。可复用提示词不适用于 Chat Completions。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，它使用更多计算资源来回答难题，提供更好的推理和一致性。 [o3 模型的价格也降低了](https://developers.openai.com/api/docs/pricing) 所有 API 请求，包括批处理和弹性处理。

### 6月4日

功能 · API：v1/fine_tuning

新增了微调支持，使用 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 用于模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月3日

功能 · API：v1/chat/completions · API：v1/realtime

新的模型快照可用于 [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。已发布 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

在 Responses API 中新增了对新内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解有关工具的更多信息](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

功能 · API: v1/responses · API: v1/chat/completions

新增了对使用 `strict` 模式作为工具模式的支持，适用于与未微调模型进行并行工具调用。
新增了 [模式特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括字符串验证，针对 `email` 及其他模式，以及对数字和数组指定范围。

### 5月15日

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已发布 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对与 [Codex CLI](https://github.com/openai/codex).

### 5月7日

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

现已支持 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已可用于微调。

## 2025年4月

### 4月30日

功能

已推出对 [增强版 API 预算提醒和自动充值限额的支持](https://platform.openai.com/settings/organization/limits).

### 4月23日

功能 · API：v1/images/generations · API：v1/images/edits

新增了一个图像生成模型， `gpt-image-1`。该模型为图像生成设立了新标准，提升了质量和指令遵循能力。

更新了图像生成和编辑端点，以支持针对 `gpt-image-1` 模型的新参数。

### 4月16日

功能 · API: v1/chat/completions · API: v1/responses

新增了两个 o 系列推理模型， `o3` 以及 `o4-mini`. 它们为数学、科学、编码、视觉推理任务和技术写作树立了新标准。

推出了 Codex，我们的代码生成 CLI 工具。

### 4月14日

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型加入API。这些新模型改进了指令遵循、编码能力，并提供更大的上下文窗口（最多 1M 个词元）。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型至 Audio API。

### 3月19日

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，一个 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的版本，使用更多计算来处理难题，以提供更好的推理和一致性。

### 3月11日

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了若干新模型、新工具，以及一个用于智能体工作流的新API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体和工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants) 功能整合到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计于 2026 年停用（在实现全面功能对等之后）。

### 3月3日

功能 · API：v1/fine_tuning/jobs

添加了 `metadata` 字段支持到微调作业。

## 2025年2月

### 2月27日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览——这是我们迄今最大、能力最强的聊天模型。GPT-4.5 的高“情商”和对用户意图的理解，使其在创意任务和智能体规划方面表现更佳。

### 2月25日

功能

推出了 [API 用量仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此更新回应了用户对额外数据筛选器的需求，如项目选择、日期选择器和更细粒度的时间间隔。此外，还更好地支持了在不同产品和服务层级之间查看用量。

### 2月5日

功能

推出欧洲数据驻留功能。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025年1月

### 1月31日

功能 · 模型: o3-mini · 模型: o3-mini-2025-01-31 · API: v1/chat/completions

已发布 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，一个针对科学、数学和编程任务优化的新型小型推理模型。

### 1月21日

功能 · 模型：o1

扩展访问 [o1 模型](https://platform.openai.com/docs/models/o1)。o1 系列模型通过强化学习进行训练，以执行复杂推理。

## 2024年12月

### 12月18日

功能

已发布 [管理员 API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理员 api 密钥。

已更新 [管理员 API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在邀请用户加入组织的同时，以编程方式邀请用户加入项目。

### 12月17日

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 以及 [更多](https://developers.openai.com/api/docs/models).

为 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 用于 o1 模型。

新增 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持系统或开发者消息。

推出使用以下方法的偏好微调 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的测试版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [实时API](https://developers.openai.com/api/docs/guides/realtime) 中的支持 [Python SDK](https://github.com/openai/openai-python).

### 12月4日

功能

已推出 [使用 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 的活动与支出情况。

## 2024年11月

### 11月20日

更新 · API: v1/chat/completions

发布于 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中我们最新的模型。

### 11月4日

功能特性 · API：v1/chat/completions

发布于 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，它可大幅降低模型响应的延迟，适用于响应内容很大部分可预先知晓的场景。这在仅需对文档和代码文件内容进行小幅修改后重新生成的场景中最为常见。

## 2024年10月

### 10月30日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

在 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10月17日

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于聊天补全，支持音频输入和输出。使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### 10月1日

功能 · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在旧金山举行的 [OpenAI DevDay 上发布了多项新功能](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：使用 WebSockets 接口在应用中构建快速的语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出，微调出高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的性能。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对近期见过的输入令牌提供折扣和更快的处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit)：使用 Generate 按钮，在 Playground 中轻松生成提示词、函数定义和结构化输出模式。

## 2024年9月

### 9月26日

功能 · 模型: omni-moderation-latest · API: v1/moderations

已发布 [新的 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，同时支持图像和文本（针对部分类别），新增两个仅文本的有害类别，并提供了更准确的评分。

### 9月12日

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

发布于 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，新一代大型语言模型，通过强化学习训练以执行复杂的推理任务。

## 2024年8月

### 8月29日

功能 · API：v1/assistants

Assistants API 现在支持 [包括由文件搜索工具使用的文件搜索结果，以及自定义排名行为](https://developers.openai.com/api/docs/assistants/tools/file-search#improve-file-search-result-relevance-with-chunk-ranking).

### 8月20日

功能 · 模型：gpt-4o · API：v1/fine_tuning

GA 发布， [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)—所有 API 用户现在都可以对最新的 GPT-4o 模型进行微调。

### 8月15日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [用于 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—的动态模型——此模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8月6日

更新

发布 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，这是我们 gpt-4o 系列中的最新模型。

### 8 月 1 日

更新

已推出 [管理和审计日志 APIs](https://developers.openai.com/api/reference/overview)，使客户能够以编程方式管理其组织，并通过审计日志监控变更。审计日志记录必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024年7月

### 7月24日

更新

推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，使采用自定义和无限计费的企业客户能够针对其所需的 IDP 设置认证。

### 7月23日

更新

已推出 [GPT-4o mini 的微调](https://developers.openai.com/api/docs/guides/model-optimization)，为特定用例实现了更高性能。

### 7月18日

更新

发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，这是我们经济实惠且智能的小型模型，适用于快速、轻量级任务。

### 7月17日

更新

已发布 [上传](https://developers.openai.com/api/reference/resources/uploads) 以分多个部分上传大文件。

## 2024年6月

### 6月6日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 在 Chat Completions 和 Assistants API 中可以通过传递来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 已进入 Beta 版发布。

### 6月3日

更新

添加了对 [文件搜索自定义的支持](https://developers.openai.com/api/docs/assistants/tools/file-search#customizing-file-search-settings).

## 2024年5月

### 5月15日

更新

新增支持 [归档项目](https://developers.openai.com/projects) 。仅组织所有者可以访问此功能。

新增支持 [设置成本限制](https://platform.openai.com/settings/organization/general) ，按项目为即用即付客户提供。

### 5月13日

更新

发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 于 API 中推出。GPT-4o 是我们最快且最具性价比的旗舰模型。

### 5月9日

更新

新增了对 [助手 API 的图像输入支持。](https://developers.openai.com/api/docs/assistants/migration)

### 5月7日

更新

为 Batch API 添加了 [微调模型支持](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5月6日

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数至 Chat Completions 和 Completions APIs。设置该参数可在使用流式传输时向开发者提供使用统计信息。

### 5月2日

更新

新增 [一个端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) ，用于在智能体 API 中从线程删除消息。

## 2024年4月

### 4月29日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants APIs。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [嵌入模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4月17日

更新

推出了一系列 [对 Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括新增的 文件搜索 工具，每个助手最多支持 10,000 个文件、新的令牌控制以及对工具选择的支持。

### 4月16日

更新

引入 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 用于按项目组织工作，包括创建 [API 密钥的](https://developers.openai.com/api/reference/overview) 能力，并按项目管理速率和成本限制（成本限制仅对企业客户可用）。

### 4月15日

更新

发布 [批处理 API](https://developers.openai.com/api/docs/guides/batch)

### 4月9日

更新

发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式推出

### 4月4日

更新

新增了对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 的支持，位于微调API中

新增了对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 的支持，位于微调API中

新增了对 [创建 Run 时添加消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 的支持，位于 Assistants API中

### 4月1日

更新

新增支持 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024年3月

### 3月29日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中的支持

### 3月14日

更新

新增支持 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024年2月

### 2月9日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到音频API

### 2月1日

更新

发布 [gpt-3.5-turbo-0125，一个更新的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024年1月

### 1月25日

更新

发布了嵌入 V3 模型和更新的 GPT-4 Turbo 预览版

为 Embeddings API 添加了 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 参数

## 2023年12月

### 12月20日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以在智能体 API 中创建运行

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 至 Chat Completions API

### 12月14日

更新

更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 使工具调用中的参数可选

## 2023年11月

### 11月30日

更新

发布于 [OpenAI Deno SDK](https://deno.land/x/openai)

### 11月6日

更新

发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新了GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [DALL·E 3 in the API](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [text-to-speech API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [转而使用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023年10月

### 10月16日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 至 Embeddings API

新增 `max_tokens` 至 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10月6日

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 至微调 API
