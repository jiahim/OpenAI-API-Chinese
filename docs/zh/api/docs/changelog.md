# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

> 介绍 OpenAI API 的最新功能和更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 10 日

功能

现在你可以在创建项目 API 密钥时设置过期时间。管理员还可以在 Platform 设置中按组织或项目级别强制设置最长密钥生命周期，要求新创建的密钥在所配置的限制内过期。参阅 [生产最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) ，获取关于密钥过期和轮换的指引。

### 9 月 10 日

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公开测试版。使用托管的 Codex harness 构建智能体，由 OpenAI 处理会话编排、上下文压缩和恢复。

使用持久化会话跨轮次延续工作、流式输出进度，并连接你自己的工具和 MCP 服务器。在 OpenAI 托管的沙箱中运行智能体，或连接来自你自己的基础设施或受支持提供方的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### 9 月 10 日

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式可用。构建全双工语音对话，使其能够在后端模型或智能体处理推理和工具的同时持续进行。

可使用 OpenAI 模型进行 Responses 委托，或使用客户端委托连接你自己的后端。语音会话费用为每分钟 $0.05，按秒计费；后端模型和工具的使用另行收费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示词编写](https://developers.openai.com/api/docs/guides/live-prompting)，和 [迁移指引](https://developers.openai.com/api/docs/guides/live-migration)。开始。参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解详情。

### 9月8日

功能 · API：v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已在 Responses API 中面向 GPT-5.6 及更高版本的支持模型正式发布。

对比先前响应的缓存复用情况，识别缓存未命中的原因，并参考故障排查指引以提升缓存复用率。

### 9月8日

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) ，可通过 Image API 以及 Responses API 的图像生成工具进行图像生成和编辑。

在对编辑精度要求最高的工作流中使用 Sunburst，或在需要快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### 9月8日

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已批准的内部生命科学研究正式开放。

标准定价为输入 token $5/1M、缓存输入 token $0.50/1M，输出 token $25/1M。计费自 2026 年 10 月 5 日起生效。详见 [定价](https://developers.openai.com/api/docs/pricing) 了解详情。

### Sep 3

Feature · Model: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，是我们目前能力最强的模型，专为最困难的端到端任务而打造。

你可以使用 GPT-6 Astra 完成推理、编码、计算机操作、研究和文档创建等任务。它能够结合这些能力，将复杂任务从初始请求推进到最终成果，充分利用你提供的上下文和工具。

迁移时需要考虑的主要变更：

- GPT-6 Astra 不支持 `none` 推理力度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果将工具与 Chat Completions 一起使用，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [失对齐监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，异步检查 智能体 工作期间可能存在的问题。检查可触发安全告警或暂停对话以供审核。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示与迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 以处理浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### Sep 3

功能 · API：v1/responses

在 Responses API 中为 GPT-6 Astra 的长时间运行任务新增了控制能力：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让模型在你的应用运行函数或自定义工具时继续工作，然后在结果可用时将其返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行中通过 WebSockets 发送额外指令，以便模型可以纳入更正或变化的需求。
- [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，针对困难工作提高推理强度，或在常规后续任务中降低推理强度。

### Sep 2

更新

已更新 API 错误信息，以便应用程序能够区分流量增长过快与临时性的模型过载。

流量增长过快可能返回 `429` 错误，并附带 `slow_down` 错误码。临时性的模型过载会返回 `503` 错误，并附带 `server_is_overloaded` 错误码。两种响应都可能包含 `Retry-After`。响应头。当该响应头存在时，请在重试前至少等待其指定的时间；如果缺失，请使用指数退避策略。请参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

连接到 `api.openai.com` 现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 已面向 OpenAI API 正式发布。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，访问权限由你所在组织的角色与权限进行控制。

### 8 月 26 日

更新 · Model：whisper-1 · Model：gpt-4o-transcribe · Model：gpt-4o-mini-transcribe · Model：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移到 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请使用以下迁移指南迁移到 Responses API 和 Conversations API [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### 8 月 21 日

功能

API 客户现在可以通过在请求中使用带有 Global 地域项目 API 密钥的前缀域，为单个请求选择区域处理。原有的资格、数据保留控制、端点和模型支持要求继续适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### 8 月 21 日

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在的价格为每百万输入 token 4 美元、每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。随时间追踪你的缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的分布情况，以了解你的缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景功能现已在预览版中提供，适用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 的 Images API 和 Responses API 图像生成工具。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式，这是面向 GPT-5.6 Sol 的全新API 服务层级，相比 Standard 处理速度最高可提升 14 倍。目前以限量预览形式向部分客户提供。注册以接收 Ultrafast 模式的最新动态 [点击此处](https://openai.com/form/ultrafast/).

### 8 月 7 日

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现在为已获批准的防御者提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以在明确授权的接入中，借助它们从安全发现走向经过验证的修复。

大多数防御性安全工作可从 Daybreak Blue 开始。它提供对通用模型的访问，例如用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证的 GPT-5.6 Sol。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供另行批准的对专用训练模型的访问，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已获授权的漏洞复现、漏洞利用验证、渗透测试、红队演练和复杂系统分析。

这些模型需要另行审批和资源调配。你可以申请加入 Daybreak 项目 [点击此处](https://openai.com/daybreak/)。有关定价的更多详情 [点击此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，该快照指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议在 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境的 API 使用，但你可以随时使用此模型来测试聊天场景的最新改进。底层模型快照会定期更新。了解更多信息 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现在支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今天，超过 272K tokens 的长上下文提示可在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，相比标准层级提速最高可达 2.5×。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在“使用情况”和“费用”面板中按 API key 对数据进行筛选和分组。 [使用情况和费用面板](https://platform.openai.com/settings/organization/usage)。 [Usage API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API key 这一维度，用于以编程方式进行报表和分析。

## July, 2026

### Jul 30

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，GPT-5.6 Terra 的价格降低 20%。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) （在 API 中），用于取代原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在以两倍的价格提供比标准处理快达 2.5 倍的速度。该变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

正式发布了 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于通过基础设施即代码的方式管理 OpenAI API Platform 资源。

可对项目、用户、群组、角色、访问权限分配、服务账号、证书、邀请以及项目级速率限制进行配置和管理。使用标准 Terraform 工作流来审核并应用变更、导入已有资源，以及检测并协调配置漂移。可从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转写和已提交 Realtime 轮次的最终转写文本， [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 以实现低延迟流式转录。

两个模型均支持自由格式的转录上下文、关键词提示以及多种预期输入语言。请在 [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7月22日

功能

为组织和项目在 OpenAI API 平台上增加了硬性支出限制。可设置月度上限，当已追踪支出达到上限时，受影响的 API 请求将返回 `429` 错误。可使用支出告警在流量被中断之前进行通知。详情请阅读 [支出限制指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于平衡智能与成本的 GPT-5.6 Terra，以及用于高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度，以及 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，和 [多智能体编排（Responses API Beta）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像， `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具备改进的字母数字识别、静音与噪声处理能力以及打断行为。同时还发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款面向实时语音应用的更快、成本更低的蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` snapshot，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 使用，但你可以随时使用此模型来测试聊天场景的最新改进。底层模型快照会定期更新。了解更多信息 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了 Safety Usage Dashboard。Safety 仪表板根据请求中发送的用于识别最终用户的值，显示被拦截的 Responses 请求 `safety_identifier` 请访问 [Safety 仪表板](https://platform.openai.com/usage/safety).

### 6月9日

功能 · API：v1/responses

网页搜索现在可以在返回常规文本结果的同时返回图片结果。当你的应用需要当前或基于网页的视觉内容（例如商品照片、地标、地点、活动或视觉参考）时，可以使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [点击此处](https://platform.openai.com/login).

### 6 月 4 日

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 新增审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中获取模型输入与生成输出的审核结果。

详情请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体 Builder。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解停用时间表与迁移指引。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，最低计费 5 分钟，而不再按完整的 20 分钟会话费率计费。底层每分钟费率保持不变。

此次更新旨在为较短的会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现可通过兼容 OpenAI 的 Responses API 端点在 Amazon Bedrock 中使用。支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` ，而非 `in_memory`，默认启用扩展提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot，它指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境的 API 使用，但你可以随时使用此模型来测试聊天场景的最新改进。底层模型快照会定期更新。了解更多信息 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可以用外部签发的身份令牌换取短期的 OpenAI 访问令牌，而无需存储长期有效的 API 密钥。

### May 26

更新

新增 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出告警、模型允许列表、数据保留设置以及 托管工具 权限，还能查询细粒度的计费明细项。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 允许受支持的 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 和 AgentKit）通过客户自行托管的 `tunnel-client` 连接到私有或本地部署的 MCP 服务器，而无需将这些服务器暴露到公网。

### May 19

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。若要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5月 12 日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 在 API 中弃用并移除。我们推荐使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 。

Realtime API Beta 已于 2026-05-12 在 API 中弃用并移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增 `return_token_budget` ：用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以启用更长的 GPT-5+ 推理 网页搜索 运行，适用于高投入度的研究与评估工作负载。

### May 7

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款适用于语音到语音 智能体 的全新实时语音模型，支持可配置推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文字。

已更新 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转录文本，并将实时提示工程相关内容移入 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。它可帮助你在 Codex 中构建 AI 应用和 智能体，并提供 OpenAI Platform 访问权限以及 OpenAI API 配置指引。

### May 6

更新

更新后的 Agents SDK 现已在 TypeScript 中可用，支持沙箱智能体并内置开源 harness。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/agents).

### May 5

更新 · 模型：chat-latest

已发布 `chat-latest` snapshot，它指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用场景，但你仍可使用此模型来测试我们在聊天用例上的最新改进。底层模型快照会定期更新。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

更新

Admin API 现已在 OpenAI 的 Node、Python、Go、Ruby 和 Java SDK 中得到支持。详见 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 获取配置说明与示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款用于复杂专业工作的全新前沿模型，已接入 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求中那些能从更多算力中受益的难题。

GPT-5.5 支持 100 万 token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置 computer use、托管 shell、apply patch、Skills、MCP 以及 网页搜索。主要更新包括：
- 推理工作量现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展提示缓存，不支持内存提示缓存。
了解详情 [请参阅此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

Feature · Model: gpt-image-2 · API: v1/images/generations · API: v1/images/edits · API: v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的前沿图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，并提供 50% 折扣。

### Apr 15

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) ，带来包括以下在内的新能力：
- 在受控的沙盒中运行智能体；
- 检查并定制开源 harness；以及
- 控制记忆创建的时间以及存储位置。

## 2026 年 3 月

### 3 月 17 日

Feature · Model: gpt-5.4-mini · Model: gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 到 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带到一个更快、更高效的模型中，适用于大规模工作负载，而 GPT-5.4 nano 则针对速度和成本最为关键的简单大规模任务进行了优化。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，和 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### 3月16日

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 3月13日

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了图像编码器，修复了一个小错误，该错误与 `input_image` GPT-5.4 中的输入有关。部分图像理解用例的质量可能会有所提升，无需任何操作。

### 3月12日

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用、最长可生成 `20` 秒的视频，并提供， `1080p` 分辨率输出、视频续写以及 Batch API 对 `sora-2-pro`，生成任务的支持 `POST /v1/videos`. `1080p` ， `sora-2-pro` 生成按 `$0.70` 每秒计费。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3月12日

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑已有视频。这将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们最新的用于专业工作的前沿模型，已在 Chat Completions 和 Responses API 中推出，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于需要更多算力的更难题。

同时发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) in the Responses API，允许模型将大型工具面延迟到运行时再加载，从而降低 token 使用量、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 支持，通过 Responses API 在 GPT-5.4 中实现 `computer` 用于基于截图的 UI 交互的工具。
- 100 万 token 的上下文窗口以及原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持，适用于长时间运行的 智能体工作流。

### Mar 3

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses · API: v1/chat/completions

扩展了 `input_file` 对更多文档、演示文稿、电子表格、代码和文本文件类型的支持。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 到 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [点击此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型: gpt-5.3-codex · API: v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2 月 23 日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2 月 23 日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2月10日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已在 GPT Image 模型中受支持： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，和 `gpt-image-1-mini`.

### 2月10日

更新 · 模型：gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 2月10日

功能 · API：v1/responses

已发布 [服务端 compaction](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) ，位于 Responses API 中。

### 2月10日

功能 · API：v1/responses

已发布对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，可在 Responses API 中使用。我们同时支持本地执行与基于托管容器的执行方式下的 Skills。

### 2月10日

功能 · API：v1/responses

已发布新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### 2 月 9 日

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

Added support for `application/json` requests on `/v1/images/edits` for GPT image models. JSON 请求使用 `images` (以及可选的 `mask`) 配合 `image_url` 或 `file_id` 引用，而非 multipart 上传。

### Feb 3

更新 · Model: gpt-5.2 · Model: gpt-5.2-codex

我们已为 API 客户优化了推理栈，并 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升了约 40%。模型及模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

发布 [Open Responses](https://www.openresponses.org/): 一个基于原始 OpenAI Responses API 构建的开源规范，用于构建多提供商、可互操作的 LLM 接口。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [点击此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

特性 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 段。 `sip.api.openai.com` 会执行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · Model: gpt-realtime-mini · Model: gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 的 slug 已指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · Model: sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) 的 slug 已指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · Model: gpt-4o-mini-tts · Model: gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 的 slug 已指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · 模型: gpt-image-1.5 · 模型: chatgpt-image-latest

修复了以下问题 `gpt-image-1.5` 和 `chatgpt-image-latest` 错误地在通过 `/v1/images/edits`，进行的图像编辑中使用了高保真度，即使在 `fidelity` 被明确设置为 `low` （默认值）时也是如此。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。了解更多 [点击此处](https://platform.openai.com/docs/guides/image-generation).

### 12 月 15 日

特性 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的改进。阅读更多 [点击此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持（面向符合条件的客户）。

### Dec 11

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，这是 GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相较此前的 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态，尤其是视觉
- 代码生成，尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新特性包括新增的 xhigh 推理力度级别、简洁的推理摘要以及基于压缩的全新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间会话，你可以使用 `/responses/compact` 端点在每次发送时缩减上下文。

### Dec 4

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 给 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长时程、智能体编码任务而优化。了解更多 [点击此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025年11月

### 11月20日

特性 · API：v1/realtime

新增对 Realtime API 中 DTMF 按键事件的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处的文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是 GPT-5 模型系列中最新一代的旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在无需深度思考时具备更强的可控性和更快的响应速度
- 代码生成与编码相关使用场景
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以便在所需思考较少时更快地响应——这与 GPT-5 之前的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 可让你决定谁可以在你的组织和项目中执行哪些操作——无论是通过 API 还是 Dashboard。

### Nov 13

特性 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多信息 [点击此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展提示缓存保留可使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存的工作原理是：当内存已满时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## October, 2025

### Oct 29

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [点击此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). 企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10 月 6 日

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在以下活动上发布了多项新功能： [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是以下模型的版本： [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) ，通过使用更多算力来更深入地思考，从而持续提供更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，提供更具性价比的语音对语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，提供更具性价比的图像生成与编辑能力。

已发布 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、细腻且动态的视频生成与重混。

已发布 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，可通过可视化方式创建自定义的多智能体工作流。

已发布 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

已发布 [追踪评估、数据集与提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals): 已发布第三方模型支持。

已发布 [服务健康仪表盘](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表将 API 访问限制为你指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增对将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中的支持。

### Sep 23

功能 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，为与 [Codex CLI](https://github.com/openai/codex).

## 2025年8月

### 8月28日

特性 · API：v1/realtime

OpenAI Realtime API 现已正式发布。在我们的 Realtime 接口 指南中了解详情 [在我们的 Realtime API 指南中了解详情](https://developers.openai.com/api/docs/guides/realtime).

### 8 月 21 日

功能 · API：v1/responses

Added support for [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 连接到 Responses API。连接器是 OpenAI 维护的 MCP 封装，支持 Google 应用、Dropbox 等流行服务，可用于让模型读取这些服务中存储的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，它允许你使用 Responses API 创建和管理长期会话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8 月 7 日

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，和 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，以便在 GPT-5 模型（支持推理）中优化快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入或从模型输出自由格式的内容。

## June, 2025

### Jun 27

功能

已发布对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing)。与 Standard 处理相比，Priority processing 在保持按量付费灵活性的同时，提供显著更低且更稳定的延迟。

### 6 月 24 日

特性 · 模型: o3-deep-research · 模型: o3-deep-research-2025-06-26 · 模型: o4-mini-deep-research · 模型: o4-mini-deep-research-2025-06-26 · API: v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的 deep research 变体，针对深度分析和研究任务进行了优化。了解更多，请参阅 [deep research guide](https://developers.openai.com/api/docs/guides/deep-research).

新增对通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [Reduced and simplified pricing](https://developers.openai.com/api/docs/pricing) ，针对 网页搜索 工具。已新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已可在仪表板中使用，并 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过 API，你现在可以引用在仪表板中创建的模板，方法是使用 `prompt` 参数（使用 prompt `id`，可选 `version`）并提供动态 `variables` ，该动态变量可以包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括 batch 和 flex 处理。

### 6 月 4 日

功能 · API：v1/fine_tuning

新增对以下模型的微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) ，适用于模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，和 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · API：v1/chat/completions · API：v1/realtime

为以下模型提供新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API：v1/responses

新增对 Responses API 中全新内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API: v1/responses · API: v1/chat/completions

新增对在并行工具调用中使用非微调模型时为工具 schema 指定 `strict` 模式的支持。
新增 [schema 功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 及其他模式的字符串校验，以及为数字和数组指定取值范围。

### 5 月 15 日

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已发布 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对以下用途进行了优化： [Codex CLI](https://github.com/openai/codex).

### May 7

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已发布对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已发布对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API: v1/images/generations · API: v1/images/edits

新增了图像生成模型， `gpt-image-1`。该模型为图像生成设立了新的标准,在质量和指令遵循方面均有提升。

更新了图像生成和编辑接口,以支持该 `gpt-image-1` 模型特有的新参数。

### Apr 16

功能 · API：v1/chat/completions · API：v1/responses

新增了两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编码、视觉推理任务以及技术写作方面树立了新的标准。

推出了 Codex，我们的代码生成命令行工具。

### 4 月 14 日

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，和 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型已发布至 API。这些新模型在指令遵循、代码能力方面有所改进，并提供了更大的上下文窗口（最高可达 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已公布 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，和 `whisper-1` 模型到音频 API。

### 3月19日

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多款新模型和工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，一个用于创建和使用智能体及工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移至更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计于 2026 年下线（届时将实现完全功能对等）。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 对微调作业的字段支持。

## 2025年2月

### 2月27日

Feature · Model: GPT-4.5 · API: v1/chat/completions · API: v1/assistants · API: v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——我们迄今为止最大、最强大的聊天模型。GPT-4.5 拥有更高的"情商"和对用户意图的理解，在创意任务和智能体规划方面表现更佳。

### 2 月 25 日

功能

推出了 [API 使用情况仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新响应了对更多数据筛选器的需求，例如项目选择、日期选择器和细粒度的时间间隔。同时也更好地支持跨不同产品和服务层级查看使用情况。

### 2 月 5 日

功能

在欧洲推出数据驻留。阅读更多 [点击此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

特性 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

已发布 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一款全新的小型推理模型，针对科学、数学和编程任务进行了优化。

### 1 月 21 日

特性 · 模型：o1

扩展对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问。o1 系列模型通过强化学习训练，能够执行复杂的推理任务。

## 2024 年 12 月

### 12 月 18 日

功能

已发布 [Admin API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其 admin api 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在将用户邀请加入组织的同时，以编程方式将他们邀请加入项目。

### 12 月 17 日

功能 · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

新增以下模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下接口新增了 WebRTC 连接方式 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 用于 o1 模型。请注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下方法的偏好微调 [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，集成于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已发布 [Usage API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询各 OpenAI API 的活动与支出。

## November, 2024

### 11月20日

更新 · API：v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### Nov 4

功能 · API: v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs),可以显著降低事先已知大部分内容的模型响应延迟。这在对文档和代码文件进行仅小幅修改的重新生成场景中最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增了五种新的语音类型， [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10 月 17 日

Feature · 模型: gpt-4o-audio-preview · API: v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于聊天补全，同时支持音频输入和输出。使用与相同的底层模型 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

Feature · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在以下活动上发布了多项新功能： [OpenAI 旧金山 DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime): 通过 WebSockets 接口在你的应用中快速构建语音到语音的体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): 使用来自大型前沿模型的输出，对高性价比的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision): 使用图像和文本微调 GPT-4o，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals): 创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching): 对近期出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit): 在 playground 中使用 Generate 按钮，轻松生成提示、函数定义和结构化输出 schema。

## September, 2024

### 9 月 26 日

Feature · Model: omni-moderation-latest · API: v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它同时支持图像和文本（部分类别支持文本），新增了两个仅限文本的伤害类别，并且评分更准确。

### Sep 12

Feature · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这是通过强化学习训练的新型大语言模型，用于执行复杂推理任务。

## August, 2024

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)—所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### Aug 15

Update · Model: gpt-4o · API: v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

已发布 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### Aug 1

更新

已发布 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志记录功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## July, 2024

### Jul 24

更新

已发布 [自助式 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费方案的 Enterprise 客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已发布 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，在特定用例下实现更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), 我们价格亲民的智能小型模型，适用于快速、轻量级任务。

### 7 月 17 日

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以通过传递参数在 Chat Completions 和 Assistants API 中禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 以 Beta 形式发布。

### Jun 3

更新

Added support for [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### 5 月 15 日

更新

Added support for [归档项目](https://developers.openai.com/projects) 。只有组织所有者可以访问此功能。

Added support for [设置费用限制](https://platform.openai.com/settings/organization/general) 针对按需付费客户的每个项目进行设置。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### May 9

更新

Added support for [向 Assistants API 发送的图像输入。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

Added support for [向 Batch API 提交微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数传递给 Chat Completions 和 Completions API。设置后，开发者在使用流式传输时可以获取用量统计信息。

### May 2

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 中的对话线程里删除一条消息。

## 2024年4月

### 4月29日

更新

新增了 [function calling 选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 至 Chat Completions 和 Assistants API 中。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出了一系列 [Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一个新的 文件搜索 工具（每个智能体最多支持 10,000 个文件）、新的 token 控制功能以及对 tool choice 的支持。

### Apr 16

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目维度管理速率和费用上限（费用上限仅对企业客户开放）。

### Apr 15

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式发布

### Apr 4

更新

Added support for [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

Added support for [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

Added support for [在创建 Run 时添加消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

Added support for [按 run_id 过滤 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## March, 2024

### Mar 29

更新

Added support for [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

Added support for [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## February, 2024

### 2 月 9 日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### 2 月 1 日

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布了 Embedding V3 模型以及更新后的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 用于 Embeddings API

## 2023年12月

### 12月20日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 用于在 Assistants API 中运行创建操作

### 12 月 15 日

更新

新增 [`logprobs` 和 `top_logprobs` parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### 12月14日

更新

更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数设为可选

## 2023 年 11 月

### 11 月 30 日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新后的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，和 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 用于 Embeddings API

新增 `max_tokens` 到 [审查模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10 月 6 日

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
