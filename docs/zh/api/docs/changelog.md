# 更新日志

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取 Markdown 版本的文档页面。

> 了解 OpenAI API 的最新功能和更新。

即将进行的弃用已在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 15 日

功能

在组织和项目级别新增了 API 密钥创建治理控制。管理员可以仅允许服务帐户密钥、仅允许用户拥有的项目密钥，或禁止创建任何新的 API 密钥。组织级别的限制优先于项目设置，并且现有的 API 密钥不受影响。详见 [生产最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 以了解详情。

### Sep 10

功能

现在你可以在创建项目 API 密钥时设置过期时间。管理员还可以在平台设置中的组织或项目级别强制设置最长密钥有效期，要求新创建的密钥必须在配置的期限内过期。参阅 [生产最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 获取关于密钥过期与轮换的指引。

### Sep 10

功能

发布了 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公共测试版。你可以使用托管的 Codex 执行环境构建 智能体，而会话编排、上下文压缩与恢复由 OpenAI 处理。

使用持久化会话在多轮之间延续工作、流式输出进度，并连接你自己的工具与 MCP 服务器。可以在 OpenAI 托管的沙箱中运行 智能体，也可以接入来自你自己的基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### Sep 10

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。你可以构建全双工语音会话，在后端模型或 智能体 处理推理与工具调用的同时继续进行对话。

你可以使用 Responses 委托搭配 OpenAI 模型，或使用客户端委托来连接你自己的后端。语音会话价格为每分钟 $0.05，按秒计费；后端模型与工具使用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指引](https://developers.openai.com/api/docs/guides/live-migration)。参阅 [定价](https://developers.openai.com/api/docs/pricing) 以了解详情。

### Sep 8

功能 · API：v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已在 Responses API 中面向 GPT-5.6 及更高版本受支持模型正式发布。

对比与上一次响应的缓存复用情况，识别缓存未命中的原因，并参考故障排查指引来提升缓存复用率。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) ，可通过 Image API 以及 Responses API 的图像生成工具进行图像生成与编辑。

当工作流最看重编辑精度时选择 Sunburst，或在需要快速、高质量的日常图像生成时选择 Flare。两个模型均支持新增的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现已通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向经批准的生命科学内部研究正式开放。

标准定价为每 1M 输入 token 5 美元，每 1M 缓存输入 token 0.50 美元，每 1M 输出 token 25 美元。计费自 2026 年 10 月 5 日起生效。详见 [定价](https://developers.openai.com/api/docs/pricing) 以了解详情。

### 9月 3 日

特性 · 模型：gpt-6-astra · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最困难的端到端任务而构建。

将 GPT-6 Astra 用于推理、编程、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求推进到最终成果，全程使用你提供的上下文和工具。

迁移时需要考虑的关键变化：

- GPT-6 Astra 不支持设置 `none` 推理强度级别。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [失序监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 会在受支持的 Responses API 请求中，异步检查 智能体 工作期间的潜在问题。检查可能会触发安全告警，或暂停对话以便审核。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示词和迁移指导。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 获取浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理档位。

### 9月 3 日

功能 · API：v1/responses

在Responses API中为使用 GPT-6 Astra 的长时间运行任务新增了控制选项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让你的应用在运行函数或自定义工具的同时让模型继续工作，然后在结果可用时返回它们。
- [回合中引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行中通过 WebSockets 发送额外指令，以便模型能够纳入更正或变化的需求。
- [在对话过程中调整推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，对困难任务提高推理强度，或在常规跟进中降低推理强度。

### Sep 2

更新

更新了 API 错误，以便应用程序能够区分流量增长过快与临时性的模型过载。

流量增长过快时，会返回带有 `429` 错误码的 `slow_down` 错误；而临时性的模型过载会返回 `503` 错误码的 `server_is_overloaded` 错误码的错误。两种响应都可能包含 `Retry-After`。当存在该响应头时，重试前至少等待其指定的时间；如果没有该响应头，则使用指数退避策略。请参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

连接到 `api.openai.com` 现可使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS（mTLS）](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 正式发布。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供者，访问权限由你所在组织的角色和权限控制。

### Aug 26

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移到 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转写指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请迁移到 Responses API 和 Conversations API，使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用带有 Global 地理区域项目下 API 密钥的前缀域，为单个请求选择区域处理。原有的资格、数据保留控制、端点和模型支持要求继续适用。在中了解详情： [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在每百万输入 token 收费 4 美元，每百万输出 token 收费 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

发布了 [Prompt Caching 仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。跟踪缓存命中率随时间的变化、每次写入的缓存读取数，以及缓存读取、缓存写入和未缓存 token 的明细，从而了解缓存效率并发现改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在以下 接口 中提供预览版： `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 的图像生成工具中。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多信息，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式，这是面向 GPT-5.6 Sol 的全新 API 服务层级，处理速度最高可达 Standard 处理的 14 倍。目前以限量预览形式向部分客户提供。注册以接收 Ultrafast 模式的最新动态 [此处](https://openai.com/form/ultrafast/).

### 8 月 7 日

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获授权的防御方提供两个访问层级：Daybreak Blue 与 Daybreak Red。你可以在获得明确授权的作业中，借助这两个层级从安全发现推进到经过验证的修复。

大多数防御性安全工作建议从 Daybreak Blue 入手。它可用于访问通用模型，例如用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证的 GPT-5.6 Sol。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经过单独审批的访问权限，可用于专用训练模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已获授权的漏洞复现、漏洞利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要单独的审批和资源配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，该快照指向 ChatGPT 中面向 Plus 和 Pro 用户所提供的最新模型。我们推荐在生产环境中使用 API [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 以满足生产环境 接口 用量需求，但你也可以自由使用该模型来测试聊天场景下的最新改进。底层模型快照将会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 8 月 5 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

快速模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今天，超过 272K token 的长上下文提示可以在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度比标准层级最高快 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在“使用情况和费用”仪表板中按 API 密钥对数据进行过滤和分组 [使用情况和费用仪表板](https://platform.openai.com/settings/organization/usage)。 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [费用 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API 密钥维度，用于以编程方式进行报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 的价格下调 80%，GPT-5.6 Terra 的价格下调 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 中推出了 API，用于替代我们的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在以两倍的价格提供高达 2.5× 的标准处理速度。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### 7 月 29 日

功能

正式发布了 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API Platform 资源以基础设施即代码的方式进行管理。

对项目、用户、组、角色、访问分配、服务账号、证书、邀请和项目级速率限制进行置备与管理。使用标准 Terraform 工作流来审查和应用更改、导入已有资源，并检测与调和配置漂移。可从以下位置安装该 provider: [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录以及已提交 Realtime 轮次的最终转录文本，配合 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 实现低延迟流式转录。

这两个模型都支持自由格式的转录上下文、关键词提示以及多种预期的输入语言。可在 [转写指南](https://developers.openai.com/api/docs/guides/transcription).

### 7 月 22 日

功能

已为组织与项目在 OpenAI API 平台上添加硬性支出上限。当受追踪支出达到上限时，设置月度上限会导致受影响的 API 请求返回 `429` 错误。在流量中断前可使用支出提醒进行通知。详细了解请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

功能 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括面向前沿能力的 GPT-5.6 Sol、兼顾智能与成本的 GPT-5.6 Terra，以及面向高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [针对 Responses API 的多智能体编排已进入测试阶段](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还可以按原始尺寸接收图像，并支持 `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，是一款更新的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时发布 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，这是一款更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` snapshot，它指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 以满足生产环境 接口 用量需求，但你也可以自由使用该模型来测试聊天场景下的最新改进。底层模型快照将会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月23日

功能

在 OpenAI API 平台上发布了安全使用情况仪表板。安全仪表板基于请求中发送的值来显示被拦截的 Responses 请求，用于识别最终用户 `safety_identifier` 访问 [安全仪表板](https://platform.openai.com/usage/safety).

### 6 月 9 日

功能 · API：v1/responses

网页搜索现在可以与常规文本结果一起返回图片结果。当你的应用需要当前或基于网络的视觉内容时（例如商品照片、地标、地点、活动或视觉参考），可以使用图片搜索。更多信息请参阅 [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6 月 5 日

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### 6月4日

功能 · Model: omni-moderation-latest · API: v1/responses · API: v1/chat/completions

已将审核评分添加到 Responses API 和 Chat Completions API。在生成请求中传入 `moderation` 对象，即可在同一响应中同时获取模型输入与生成输出的审核结果。

详细了解请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示词对象、Evals 平台和智能体构建器。有关下线时间表和迁移指南，请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解下线时间表和迁移指南。

### 6月2日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，而不是按完整的 20 分钟会话费率计费。底层的每分钟费率将保持不变。

此次更新旨在为较短会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 定价文档中找到当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

特性 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现已在 Amazon Bedrock 中通过兼容 OpenAI 的 Responses API 端点提供。支持的模型和特性因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

Update · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现默认采用 `24h` ，而不再是 `in_memory`，从而默认启用扩展的提示词缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · 模型：chat-latest

已发布 `chat-latest` 快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 以满足生产环境 接口 用量需求，但你也可以自由使用该模型来测试聊天场景下的最新改进。底层模型快照将会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 26 日

功能

已发布 [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可将外部签发的身份令牌交换为短时 OpenAI 访问令牌，无需存储长期 API 密钥。

### 5 月 26 日

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出告警、模型允许列表、数据保留设置和 托管工具 权限,并支持查询细粒度账单明细。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 以及 AgentKit）通过客户自托管的方式连接到私有或本地 MCP 服务器 `tunnel-client` ，而无需将这些服务器暴露在公共互联网上。

### May 19

更新

现在你可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。若要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 被弃用并从 API 中移除。建议使用 `gpt-image-2`, `gpt-image-1`，或者 `gpt-image-1-mini` 来替代。

Realtime API Beta 已于 2026-05-12 被弃用并从 API 中移除。如果你仍在使用 Beta 接口，请迁移至已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增了 `return_token_budget` 适用于 Responses API 的 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以为高投入度的研究和评估工作负载启用更长时间的 GPT-5+ 推理 网页搜索 运行。

### 5月7日

Feature · Model: gpt-realtime-2 · Model: gpt-realtime-translate · Model: gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款用于语音到语音 智能体 的全新实时语音模型，支持可配置的推理，同时推出了 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

已更新 [Realtime and audio guide](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [Realtime translation guide](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转写，并将实时提示词相关指南迁移至 [Using realtime models](https://developers.openai.com/api/docs/guides/voice-prompting).

### 5月7日

功能

发布了 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。它可以帮助你在 Codex 中构建 AI 应用和 智能体，并提供 OpenAI Platform 访问以及 OpenAI API 配置指引。

### May 6

更新

更新后的 Agents SDK 现已支持 TypeScript，并支持沙箱 智能体，同时内置开源测试运行环境。了解详情 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` 快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 适用于生产环境中的 API 使用，但你可以使用此模型测试我们在聊天用例方面的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

现在 OpenAI 针对 Node、Python、Go、Ruby 和 Java 的 SDK 已支持 Admin API。请参阅 [Admin APIs 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的全新前沿模型，接入 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) 用于 Responses API 请求，以应对可受益于更多算力的更难题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP 以及网页搜索。关键更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存，不支持内存提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### 4 月 21 日

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的前沿图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持（享 50% 折扣）。

### 4 月 15 日

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来全新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并自定义开源 harness；以及
- 控制记忆的创建时机和存储位置。

## 2026 年 3 月

### 3 月 17 日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 支持 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带到了更快、更高效的模型上，适合高吞吐量工作负载，而 GPT-5.4 nano 则针对简单的高吞吐量任务进行了优化，在这些场景下速度和成本最为关键。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### 3 月 16 日

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向当前在 ChatGPT 中使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，以修复以下方面的一个小 bug： `input_image` GPT-5.4 中的输入问题。部分图像理解用例的质量可能因此得到改善。无需执行任何操作。

### 3 月 12 日

特性 · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用、最长可生成 `20` 秒的视频、 `1080p` 输出、视频扩展，以及 Batch API 对 `sora-2-pro`，生成任务的支持。 `POST /v1/videos`. `1080p` 任务按 `sora-2-pro` 每秒计费。了解更多 `$0.70` 每秒计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增了 `POST /v1/videos/edits` ，用于编辑已有视频。该功能将取代 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

特性 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) ，用于可在更多算力下受益的更困难问题，已上线 Responses API。

同时发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，模型可以将大型工具集合延迟到运行时再加载，从而降低 token 使用量、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供支持 `computer` 工具，用于基于截图的 UI 交互。
- 100 万 token 的上下文窗口以及原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持，以应对持续时间更长的 智能体 工作流。

### Mar 3

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 提供至 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展了 `input_file` 对 Responses API 的支持，可接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 为 Responses API 添加对分层推理摘要的支持。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 至 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2 月 23 日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2 月 23 日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 接入 Realtime API。

已发布 `gpt-audio-1.5` 接入 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型：gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向当前在 ChatGPT 中使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

已推出 [服务端压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能（位于 Responses API 中）。

### 2 月 10 日

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持（位于 Responses API 中）。我们同时支持本地执行和基于托管容器的执行方式下的 Skills。

### 2 月 10 日

功能 · API：v1/responses

已推出新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### 2月 9 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对以下请求的支持： `application/json` 上的请求 `/v1/images/edits` ，适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`），配合 `image_url` 或 `file_id` 引用，不再使用 multipart 上传。

### Feb 3

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型和模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/): an open-source spec for building multi-provider, interoperable LLM interfaces built on top of the original OpenAI Responses API.

### 1 月 14 日

功能 · 模型：gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用 SIP IP 段。 `sip.api.openai.com` 进行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 指向 2025-12-15 快照。如需使用先前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) 指向 `sora-2-2025-12-08`。如需使用先前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 指向 `2025-12-15` 快照。如需使用先前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了以下问题： `gpt-image-1.5` 和 `chatgpt-image-latest` 在为通过 `/v1/images/edits`，进行的图像编辑错误地使用了高保真度，即使 `fidelity` 被显式设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型: gpt-image-1.5 · 模型: chatgpt-image-latest

新增了 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。了解更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12 月 15 日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。了解更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，面向符合条件的客户。

### Dec 11

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), GPT-5 模型家族中最新旗舰模型。相较于此前的 GPT-5.1，GPT-5.2 在以下方面有所改进：
- 通用智能
- 指令遵循
- 准确性以及 token 使用效率
- 多模态——尤其是视觉能力
- 代码生成——尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新特性包括新增的 xhigh 推理力度等级、简洁的推理摘要以及使用压缩的新上下文管理。

### Dec 11

功能 · API: v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间运行的对话，你可以使用该 `/responses/compact` 端点来压缩你每次发送的上下文。

### 12月4日

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 向 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，针对长时程、智能体编码任务进行了优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键事件的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 以了解更多信息。

### Nov 13

Feature · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是 GPT-5 模型家族中最新的旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在无需深度思考时可获得更高的可控性和更快的响应
- 代码生成和编码类使用场景
- 智能体工作流

请注意，GPT-5.1 默认采用新的 `none` 推理设置，以便在所需思考量较少时更快地响应——这与之前 `medium` GPT-5 的默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你能够决定组织与项目中谁能执行哪些操作——无论是通过 API 还是在控制台中。

### Nov 13

特性 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留可使已缓存的前缀保持更长时间，最长可达 24 小时。扩展的提示缓存通过在内存已满时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是在 gpt-oss 基础上构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### 10月24日

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用自有外部密钥管理系统（KMS）管理的密钥，对 OpenAI 上的客户内容进行加密。

### 10月24日

功能

已发布 [UK data residency](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

特性 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，上发布了多项新功能，这是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，通过使用更多算力进行更深入的思考，从而持续提供更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音对语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成与编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，借助我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、细腻且动态的视频生成与重混。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，通过可视化方式构建自定义的多 智能体 工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

已发布 [追踪评估、数据集与提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：已发布第三方模型支持。

已推出 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### 10月1日

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表功能可将 API 访问限制为仅限你指定的 IP 地址或地址段。

## 2025年9月

### 9月26日

功能 · API：v1/responses

新增了对将 image 和 file 作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 的支持，该支持在 Responses API 中提供。

### 9月23日

功能 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

The OpenAI Realtime API 现已全面可用。在我们的 Realtime API guide 中了解更多信息 [在我们的 Realtime 接口 guide 中了解更多信息](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对以下请求的支持： [connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。Connectors 是 OpenAI 维护的 MCP 包装器，可用于 Google 应用、Dropbox 等流行服务，让模型能够读取存储在这些服务中的数据。

### Aug 20

功能 · API: v1/conversations · API: v1/responses · API: v1/assistants

发布了 Conversations API，允许你创建和管理与 Responses API 的长时间对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并列对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8 月 7 日

功能 · API: v1/chat/completions · API: v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，以在 GPT-5 模型（支持推理）中优化快速响应。

引入了 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在进行工具调用时向模型输入自由格式内容并从模型获取自由格式输出。

## 2025 年 6 月

### 6 月 27 日

功能

已推出对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing)。Priority processing 在保持按量付费灵活性的同时，显著降低了延迟并提升了稳定性，相较于 Standard processing 表现更优。

### 6 月 24 日

功能 · Model：o3-deep-research · Model：o3-deep-research-2025-06-26 · Model：o4-mini-deep-research · Model：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，这是我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [deep research guide](https://developers.openai.com/api/docs/guides/deep-research).

新增对异步事件处理的支持，通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [调整并简化了定价](https://developers.openai.com/api/docs/pricing) ，适用于 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台和 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现在可以引用在控制台中创建的模板，方法是使用 `prompt` 参数（传入一个提示词 `id`，以及可选的 `version`），并提供动态 `variables` ，其中可以包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，它是 o3 的一个版本， [o3](https://developers.openai.com/api/docs/models/o3) 推理模型，使用更多算力以更出色的推理能力和一致性来回答难题。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### 6月4日

功能 · API：v1/fine_tuning

已为以下模型新增微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) （适用于这些模型） `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · API：v1/chat/completions · API：v1/realtime

以下模型新增模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [适用于 TypeScript 的 Agents SDK](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API：v1/responses

在 Responses API 中新增了对内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API：v1/responses · API：v1/chat/completions

新增了对使用 `strict` 模式的支持，适用于使用未微调模型进行并行工具调用时的工具架构。
新增了 [架构特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 以及其他模式的字符串校验，以及为数字和数组指定范围。

### 5 月 15 日

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对配合以下功能使用进行了优化： [Codex CLI](https://github.com/openai/codex).

### 5月7日

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [fine-tuning 方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API：v1/images/generations · API：v1/images/edits

新增了新的图像生成模型， `gpt-image-1`。该模型在图像生成方面树立了新标准，具有更高的质量和指令遵循能力。

更新了图像生成和编辑接口，以支持该模型特有的新参数 `gpt-image-1` 。

### Apr 16

功能 · API: v1/chat/completions · API: v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们为数学、科学、编码、视觉推理任务以及技术写作树立了新标准。

推出 Codex，我们的代码生成命令行工具。

### Apr 14

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增了 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入 API。这些新模型在指令遵循、代码能力以及上下文窗口（最大 1M tokens）方面均有提升。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API: v1/audio

新增了 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` models 到 Audio API。

### Mar 19

特性 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，它是 o3 的一个版本， [o1](https://developers.openai.com/api/docs/models/o1) 推理模型，使用更多算力以更出色的推理能力和一致性来回答难题。

### Mar 11

Feature · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多款新模型和新工具，以及面向智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，一个用于创建和使用智能体和工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，并预计在 2026 年（实现完全功能对等之后）停用 Assistants。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增了 `metadata` 字段对微调作业的支持。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——迄今为止我们最大且能力最强的聊天模型。GPT-4.5 具备高“情商”与对用户意图的理解，使其在创意任务和智能体规划方面表现更佳。

### 2 月 25 日

功能

已发布 [API 用量仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。本次更新响应了对更多数据筛选器的需求，例如项目选择、日期选择器和细粒度的时间间隔。它还更好地支持跨不同产品和服务层级查看用量。

### 2月 5日

功能

在欧洲推出数据驻留。阅读更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，一款为科学、数学和编程任务优化的全新小型推理模型。

### Jan 21

功能 · 模型：o1

扩展对 [o1 model](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练以执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已推出 [Admin API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其 admin 接口 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在邀请用户加入组织的同时，以编程方式将其邀请至项目。

### 12月17日

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增了以下模型： [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下接口新增了 WebRTC 连接方式： [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增了 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

新增了 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出了使用以下方法的偏好微调： [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

发布了 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增了 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，新增于 [Python SDK](https://github.com/openai/openai-python).

### 12月4日

功能

已推出 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 的活动和支出情况。

## November, 2024

### 11 月 20 日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Nov 4

Feature · API：v1/chat/completions

已发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs),可显著降低模型响应的延迟,适用于大部分响应内容事先已知的场景。这种情况最常见于仅对文档和代码文件进行少量修改后重新生成内容。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增了五种新的语音类型，位于 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新版 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 聊天补全接口，支持音频输入与输出。该模型与下方模型使用同一基础模型： [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### 10月1日

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI 旧金山开发者日](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口，在你的应用中快速构建语音到语音的交互体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用前沿大模型的输出，对高性价比模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对近期出现过的输入令牌提供折扣和更快的处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit)：在 Playground 中通过 Generate 按钮，轻松生成提示词、函数定义和结构化输出 schema。

## 2024 年 9 月

### 9月26日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [新版 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（针对部分类别），新增了两个纯文本的有害类别，并提供了更准确的评分。

### Sep 12

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这是通过强化学习训练的新一代大型语言模型，用于执行复杂推理任务。

## 2024-08

### 8 月 29 日

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API: v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8 月 15 日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 当前使用的最新 GPT-4o 模型。

### Aug 6

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，这是 gpt-4o 系列中的最新模型。

### Aug 1

更新

已推出 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志记录功能必须在 [settings](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许采用自定义和不限量计费模式的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已推出 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，为特定用例带来更高的性能。

### 7月18日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), 我们一款经济实惠的智能小模型，用于快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可通过传递参数在 Chat Completions 和 Assistants API 中禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### Jun 3

更新

新增对以下请求的支持： [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### 5 月 15 日

更新

新增对以下请求的支持： [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对以下请求的支持： [设置费用限额](https://platform.openai.com/settings/organization/general) ，按项目为按量付费客户设置费用限额。

### 5月13日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### 5 月 9 日

更新

新增对以下请求的支持： [向 Assistants API 提供图像输入。](https://developers.openai.com/api/docs/assistants/migration)

### 5月7日

更新

新增对以下请求的支持： [向 Batch API 提供微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增了 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 向 Chat Completions 和 Completions API 的参数。设置该参数后，开发者在使用流式传输时可以获取用量统计信息。

### 5 月 2 日

更新

新增了 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 的某个 thread 中删除一条消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 和面向 embeddings 模型的 Batch API 支持 [embeddings models](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4 月 17 日

更新

推出了一系列 [Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的文件搜索工具，每个智能体最多支持 10,000 个文件，新增的 token 控制，以及对工具选择（tool choice）的支持。

### Apr 16

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目维度管理速率和成本限制的能力（成本限制仅对企业客户可用）。

### 4 月 15 日

更新

已发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式发布

### Apr 4

更新

新增对以下请求的支持： [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对以下请求的支持： [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对以下请求的支持： [在创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对以下请求的支持： [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024年3月

### 3月29日

更新

新增对以下请求的支持： [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant 消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对以下请求的支持： [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### 2月 9 日

更新

新增了 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 调用 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024年1月

### 1月25日

更新

发布了 Embedding V3 模型以及更新后的 GPT-4 Turbo 预览版

新增了 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## December, 2023

### Dec 20

更新

新增了 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建操作

### 12 月 15 日

更新

新增了 [`logprobs` 以及 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

Changed [function parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) argument on a tool call to be optional

## November, 2023

### Nov 30

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新后的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [DALL·E 3 中的 API](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [text-to-speech API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [改为使用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增了 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增了 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增了 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
