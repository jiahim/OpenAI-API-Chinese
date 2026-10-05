# 更新日志

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

> OpenAI API 的最新功能与更新。

即将进行的弃用项列在 [弃用页面](/api/docs/deprecations).

## 2026 年 10 月

### 10 月 5 日

功能

在 API 中新增 HIPAA 合规支持的产品内流程 [组织设置 > 常规](https://platform.openai.com/settings/organization/general)。符合条件的组织的管理员现在可以接受标准《商业伙伴协议》(BAA)，并为其组织启用 HIPAA 合规支持。有关资格、覆盖服务以及配置要求，请参阅 [帮助中心](https://help.openai.com/en/articles/8660679-getting-a-business-associate-agreement-for-the-openai-api) 。

## 2026 年 9 月

### 9 月 29 日

功能

新增了 [computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) 到 智能体 API。智能体 可以在由 OpenAI 托管的浏览器中完成任务，网站访问授权和登录由你的应用处理。

### 9 月 29 日

特性 · 模型：gpt-6.1-sol · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (`gpt-6.1-sol`），用于复杂的编程和专业工作，成本低于 GPT-6 Astra。

对于输入 token 数最多 272K 的提示，标准定价为每 1M token：输入 $2、缓存输入 $0.10、缓存写入 $2.50、输出 $10。

GPT-6.1 Sol 还支持 [Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) （测试版）。让模型在单个 Responses API 请求中将工作委派给子智能体。

使用 Responses API 进行工具调用。参见 [GPT-6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 了解推理设置，以及 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的处理层级。

### 9 月 29 日

特性 · 模型：gpt-6-astra · API：v1/responses

新增了 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 适用于 Responses API 中的 GPT-6 Astra。使用 `gpt-6-astra` 配合 `service_tier: "ultrafast"` 以减少生成输出 token 之间的时间。它面向 API 客户提供，受速率限制，采用全球处理和美国数据驻留。不支持欧盟及其他区域推理驻留。请参阅 [超快定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### 9月25日

修复 · 模型：gpt-6-sol · 模型：gpt-6-luna

修复了影响图像理解的图像编码缺陷，问题出现在 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。本次更新改善了它们在 API 和 Codex 中的视觉任务表现，包括计算机使用场景。

如果你的使用场景涉及图像输入，建议重新运行评估，并重试受此问题影响的工作流。

### Sep 22

功能 · 模型: gpt-6-sol · 模型: gpt-6-luna · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions APIs 生成文本。

输入 token 数最多为 272K 的提示，每 1M token 的标准定价：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较各项能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 以了解缓存写入、更长提示以及其他处理层级的相关说明。

### Sep 15

功能

在组织和项目级别新增了 API 密钥创建管控。管理员可以仅允许服务账号密钥、仅允许用户拥有的项目密钥，或禁用所有新增的 API 密钥创建。组织级限制优先于项目设置，且不会影响现有的 API 密钥。详情请参阅 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### Sep 10

功能

你可以在创建项目 API 密钥时设置过期时间。管理员也可以在 Platform 设置中的组织或项目级别强制设置密钥的最大生命周期，要求新创建的密钥必须在配置的时限内过期。请参阅 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 了解有关密钥过期与轮换的指导。

### Sep 10

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公开测试版。使用托管的 Codex 工具链构建 智能体，由 OpenAI 处理会话编排、上下文压缩与恢复。

使用持久化会话跨轮次延续工作、实时输出进度，并接入你自己的工具和 MCP 服务器。可以在 OpenAI 托管的沙箱中运行 智能体，也可以接入来自你自己的基础设施或受支持提供商的沙箱。

请从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### Sep 10

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。构建可在后端模型或 智能体 处理推理和工具调用的同时持续进行的全双工语音对话。

可以使用 Responses 委托配合 OpenAI 模型，或使用客户端委托接入你自己的后端。语音会话费用为每分钟 0.05 美元，按秒计费；后端模型和工具调用另行计费。

请从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。开始。请参阅 [定价](https://developers.openai.com/api/docs/pricing) 。

### 9月 8 日

功能 · API：v1/responses

[Prompt Cache Diagnostics](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 GPT-5.6 及更高版本支持的模型上，通过 Responses API 正式发布。

与上一次响应比较缓存复用情况，识别缓存未命中的原因，并按照故障排查指引来提高缓存复用率。

### 9月 8 日

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 可通过 Image API 以及 Responses API 的图像生成工具进行图像生成与编辑。

在编辑精度至关重要的场景下使用 Sunburst，而在追求快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。参见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### 9月 8 日

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现已通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已获批的内部生命科学研究正式开放。

标准定价为输入 token 5 美元/百万，缓存输入 token 0.50 美元/百万，输出 token 25 美元/百万。计费自 2026/10/5 起开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### 9 月 3 日

功能 · 模型：gpt-6-astra · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最艰巨的端到端工作而构建。

使用 GPT-6 Astra 进行推理、解释代码、计算机使用、研究和文档创建。它结合这些能力，从初始请求到最终结果，承载复杂任务，使用你提供的上下文和工具。

迁移时需要考虑的主要变更：

- GPT-6 Astra 不支持 `none` 推理 effort 等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [错位监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的Responses API 请求中，异步检查智能体 工作期间的潜在问题。检查可触发安全警报或停止对话以供审查。

请从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解功能、提示与迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 获取浏览器和桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### 9 月 3 日

功能 · API：v1/responses

在 Responses API 中为 GPT-6 Astra 的长时间运行任务新增了以下控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling):让模型在应用程序运行函数或自定义工具的同时继续工作,然后在结果可用时返回它们。
- [中途引导](https://developers.openai.com/api/docs/guides/steering):在响应进行中通过 WebSockets 发送额外指令,以便模型可以纳入更正或变化的需求。
- [在对话过程中更改推理力度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation):在保留缓存的提示前缀的同时,为困难工作增加力度,或为常规跟进降低力度。

### 9 月 2 日

更新

更新了 API 错误，以便应用程序能够区分流量增长过快与临时性的模型过载。

流量增长过快会返回 `429` 错误，并带有 `slow_down` 错误码。临时性的模型过载会返回 `503` 错误，并带有 `server_is_overloaded` 错误码。两种响应都可能包含 `Retry-After`。当该响应头存在时，重试前至少等待其所指定的时长；若不存在，则采用指数退避策略。详见 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### 9 月 1 日

更新

连接到 `api.openai.com` 现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 已在 OpenAI API 上正式发布。你可以直接在 [Platform console](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，并通过组织的角色和权限控制访问。

### Aug 26

Update · Model: whisper-1 · Model: gpt-4o-transcribe · Model: gpt-4o-mini-transcribe · Model: gpt-4o-transcribe-diarize · API: v1/audio/transcriptions · API: v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 下线。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请使用 Responses API 和 Conversations API 进行迁移，详见 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用带有 Global 地理位置项目下 API 密钥的前缀域，为单个请求选择区域处理。原有的资格、数据留存控制、端点和模型支持要求继续适用。详情请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现定价为每百万输入 token 4 美元、每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续至 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [提示词缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。持续追踪你的缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存令牌的细分情况，以了解缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 的 Images API 和 Responses API 图像生成工具中提供预览支持。将 `background` 设置为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8月13日

公告

推出了 Ultrafast 模式，这是面向 GPT-5.6 Sol 的全新 API 服务层级，处理速度最高可达 Standard 处理的 14 倍。目前面向部分客户提供限量预览。注册以接收有关 Ultrafast 模式的更新 [点击此处](https://openai.com/form/ultrafast/).

### Aug 7

特性 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们可以在明确授权的参与中从安全发现推进到经过验证的修复。

大多数防御性安全工作请从 Daybreak Blue 开始。它可用于访问通用模型，例如 GPT-5.6 Sol，以进行漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析以及补丁验证。了解更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经过单独审批的访问权限，可使用专门训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于获得授权的漏洞复现、漏洞利用验证、渗透测试、红队行动以及复杂系统分析。

这些模型需要单独审批与配置。你可以申请加入 Daybreak 项目 [点击此处](https://openai.com/daybreak/)。更多定价详情 [点击此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，该快照指向 ChatGPT 中 Plus 和 Pro 用户可用的最新模型。我们建议在生产 API 场景中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) ，但你也可以自由使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。了解更多 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### 8月5日

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现在支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今日，超过 272K token 的长上下文提示可以在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度比标准层级最高快 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在“使用情况和成本”仪表板中按 API 键对数据进行筛选和分组， [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。“使用情况 API” [使用情况 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API 键维度，用于以编程方式进行报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API: v1/responses · API: v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 价格降低 80%，GPT-5.6 Terra 价格降低 20%。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 在 API 中，该功能取代了我们原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在以两倍的价格提供最高 2.5 倍于标准处理的速度。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform 提供程序](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API 平台资源。

配置和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准的 Terraform 工作流来审查和应用更改、导入现有资源，以及检测和调和配置漂移。从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录以及已提交 Realtime 轮次的最终转录文本，并且 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

这两个模型都支持自由形式的转录上下文、关键词提示以及多种预期的输入语言。在以下位置比较支持的输出和工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7月22日

功能

为 OpenAI API 平台的组织和项目添加了硬性支出限额。设置月度上限，当已追踪的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。请使用支出告警在流量被中断前进行通知。更多信息请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits).

### 7 月 9 日

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6),包括用于前沿能力的 GPT-5.6 Sol、用于平衡智能与成本的 GPT-5.6 Terra,以及用于高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由至 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [多智能体编排已在 Responses API 中进入测试阶段](https://developers.openai.com/api/docs/guides/responses-multi-agent).GPT-5.6 还支持以图像原始尺寸接收图像,并提供 `original` 或 `auto` 图像细节选项。

### Jul 6

Feature · Model: gpt-realtime-2.1 · Model: gpt-realtime-2.1-mini · API: v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款经过更新的实时推理模型，在字母数字识别、静音与噪声处理以及打断行为方面有所改进。同时发布 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款速度更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` 快照，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) ，但你也可以自由使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。了解更多 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月23日

功能

已在 OpenAI API 平台上发布安全使用仪表盘。安全仪表盘会展示基于以下情况而被拦截的 Responses 请求： `safety_identifier` 请求中所传入的用于标识最终用户的字段值。请访问 [Safety dashboard](https://platform.openai.com/usage/safety).

### 6月9日

功能 · API：v1/responses

网页搜索现在可以同时返回图片结果和普通文本结果。当你的应用需要最新的或基于网页的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，可以使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月5日

更新

为 OpenAI API 平台发布了重新设计的导航，请访问 [点击此处](https://platform.openai.com/login).

### Jun 4

特性 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

在 Responses API 和 Chat Completions API 中新增了审核评分。在生成请求中传入 moderation `moderation` 对象，即可在同一次响应中获取模型输入和生成输出两者的审核结果。

详情请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可重复使用的提示对象、Evals 平台以及智能体 Builder。参见 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，每次会话最低计费 5 分钟，而不是按整段 20 分钟会话费率计费。每分钟的费率保持不变。

此次更新旨在让较短会话的计费更加精细，并降低客户的实际成本。

你可以在我们的 [API定价文档中查看当前的内置工具价格](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API: v1/responses

OpenAI 模型现已通过与 OpenAI 兼容的 Responses API 端点在 Amazon Bedrock 中可用。受支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` ，而不是 `in_memory`，从而默认启用扩展的提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` 快照指向 ChatGPT 中当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) ，但你也可以自由使用此模型来测试对话场景的最新改进。底层模型快照将定期更新。了解更多 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月 26 日

功能

已发布 [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation). 受信任的工作负载可以将外部颁发的身份令牌兑换为短期 OpenAI 访问令牌，而无需存储长期 API 密钥。

### 5月 26 日

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置以及 托管工具 权限，并支持查询细粒度的计费明细项目。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 为企业客户提供。Secure MCP Tunnel 允许受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 和 AgentKit）通过客户自主托管的 `tunnel-client` 方式连接到私有或本地部署的 MCP 服务器，而无需将这些服务器暴露在公共互联网上。

### May 19

更新

现在，你可以管理多个 IP 白名单，并在项目级别或整个组织范围内应用每个白名单。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5 月 12 日

更新 · Model: dall-e-2 · Model: dall-e-3 · API: v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日被弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API Beta 已于 2026 年 5 月 12 日被弃用并从 API 中移除。如果你仍在使用该 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增了 `return_token_budget` 适用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。用于选择加入更长时间的 GPT-5+ 推理 网页搜索 运行，适用于高投入度的研究和评估工作负载。

### May 7

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款适用于语音到语音场景、可配置推理能力的新型实时语音模型，专为智能体打造，并附带 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

已更新 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了一份专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以提供流式转录文本，并将实时提示相关指导迁移到了 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。它帮助你在 Codex 中构建 AI 应用和智能体，并提供 OpenAI Platform 访问权限以及 OpenAI API 配置指导。

### May 6

更新

更新后的 Agents SDK 现已支持 TypeScript，并内置对沙箱 智能体 的支持以及开源 harness。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/agents).

### May 5

更新 · 模型：chat-latest

已发布 `chat-latest` 快照指向 ChatGPT 中当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产 API 场景，但你仍可使用此模型来测试我们在聊天用例上的最新改进。底层模型快照将定期更新。了解更多 [点击此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

Node、Python、Go、Ruby 和 Java 的 API 已在 OpenAI SDK 中支持管理端 接口。请参阅 [管理端 API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解配置说明和示例。

## 2026年4月

### 4月24日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业任务的前沿模型，并将其引入 Chat Completions 和 Responses API，同时发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，适用于那些需要更多算力来处理的更困难问题的 Responses API 请求。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示词缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP 以及 网页搜索。主要更新包括：
- Reasoning effort 现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原有行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展提示缓存，不支持内存提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，可享 50% 折扣。

### 4 月 15 日

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来了多项新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并自定义开源 harness；以及
- 控制何时创建记忆以及存储位置。

## March, 2026

### Mar 17

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到一个更快、更高效的模型，适用于高吞吐量工作负载；而 GPT-5.4 nano 针对速度与成本最为关键的简单高吞吐量任务进行了优化。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [压缩](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持压缩，但不支持工具搜索和计算机使用。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) 指向 ChatGPT 当前使用的最新模型的 slug。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，以修复一个与 GPT-5.4 输入相关的小问题。 `input_image` 在 GPT-5.4 中，某些图像理解用例的质量可能会有所提升。无需任何额外操作。

### 3 月 12 日

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用角色引用、最长生成时长 `20` 秒、 `1080p` 输出、 `sora-2-pro`、视频扩展功能，以及对 `POST /v1/videos`. `1080p` 生成任务的 Batch API 支持， `sora-2-pro` 按每秒 `$0.70` 计费。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增了 `POST /v1/videos/edits` 用于编辑现有视频。这将替代 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月后弃用。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3 月 5 日

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于受益于更多算力的更难题型。

同步发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，模型可以将大型工具面延迟到运行时再加载，从而减少 token 使用量、保持缓存性能，并降低延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供支持 `computer` 工具，用于基于截图的 UI 交互。
- 100 万 token 的上下文窗口，以及原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，用于运行时间更长的 智能体 工作流。

### Mar 3

特性 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展了 `input_file` 对 Responses API 的支持，可接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 对 Responses API。它将助手消息标记为中间评论（`commentary`)或最终答案（`final_answer`)。阅读更多 [点击此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 对 Responses API。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [点击此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [点击此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · 模型: gpt-image-1.5 · 模型: gpt-image-1 · 模型: gpt-image-1-mini · 模型: chatgpt-image-latest · API: v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型: gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) 指向 ChatGPT 当前使用的最新模型的 slug。

### 2 月 10 日

功能 · API：v1/responses

已推出 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，适用于 Responses API。

### 2 月 10 日

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，适用于 Responses API。我们同时支持 Skills 的本地执行和基于托管容器的执行。

### 2 月 10 日

功能 · API：v1/responses

推出了全新的 [托管 Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，以及对容器内联网功能的支持。

### 2 月 9 日

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

新增对 `application/json` 请求的支持 `/v1/images/edits` ，适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）配合 `image_url` 或 `file_id` 引用，而非 multipart 上传。

### Feb 3

更新 · Model: gpt-5.2 · Model: gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型和模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

已宣布 [Open Responses](https://www.openresponses.org/)：一个基于原始 OpenAI Responses API 构建的开源规范，用于构建多提供商、可互操作的 LLM 接口。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。了解更多 [点击此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### 1 月 13 日

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 段。 `sip.api.openai.com` 进行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### 1 月 13 日

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### 1 月 13 日

更新 · 模型：sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### 1 月 13 日

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### 1 月 9 日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，其中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过以下方式进行图像编辑时错误地使用了高保真度： `/v1/images/edits`，即使在 `fidelity` 被明确设置为 `low` （默认值）时也是如此。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增了 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。阅读更多 [点击此处](https://platform.openai.com/docs/guides/image-generation).

### Dec 15

功能 · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-4o-mini-transcribe · Model: gpt-4o-mini-tts

发布了四个新的带日期的音频快照。这些更新为实时、语音驱动的应用程序带来了可靠性、质量和语音保真度的改进。了解更多 [点击此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包含对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，面向符合条件的客户。

### 12 月 11 日

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，是 GPT-5 模型系列中最新旗舰模型。GPT-5.2 在以下方面相较此前的 GPT-5.1 有所提升：
- 通用智能
- 指令遵循
- 准确性和 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- API 中的工具调用和上下文管理
- 电子表格的理解与创建。

5.2 的新内容包括新的 xhigh 推理强度等级、简洁的推理摘要，以及使用压缩进行的新上下文管理。

### 12 月 11 日

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 进行的长时间对话，你可以使用 `/responses/compact` 端点来缩减每次轮次发送的上下文。

### Dec 4

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，针对长时序、agentic 编码任务进行了优化。了解更多 [点击此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。在使用 Realtime 旁路连接时，你现在可以接收 DTMF 事件。详见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

Feature · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是 GPT-5 模型系列中全新的旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在不需要深度思考时具有更强的可控性和更快的响应速度
- 代码生成与编码相关用例
- 智能体工作流

请注意，GPT-5.1 默认启用了一种新的 `none` 推理设置，可在需要较少思考时更快地响应——这与 GPT-5 中之前的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 让你能够跨组织和项目决定谁可以执行哪些操作——无论是通过 API 还是 Dashboard。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 接入 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [点击此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留可让已缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展的提示缓存通过在内存耗尽时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [点击此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用由你自己的外部 Key Management System (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

已发布 [UK 数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，即 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，通过更多算力进行更深入的思考，从而始终提供更优的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成与编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，可通过我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型生成丰富、细致且动态的视频并对视频进行重混。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于以可视化方式创建自定义的多智能体工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：已发布第三方模型支持。

已推出 [服务运行状况仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表功能用于将 API 访问限制为仅限你指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增对将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中的支持。

### Sep 23

特性 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，支持 Google 应用、Dropbox 等常用服务，可用于授予模型对这些服务中存储数据的读取权限。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，它允许你通过 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并列对比，了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [推理努力程度](https://developers.openai.com/api/docs/guides/reasoning) 取值，用于在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入和从模型输出自由格式的内容。

## 2025 年 6 月

### 6 月 27 日

功能

已推出对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing)。与 Standard 处理相比，优先级处理可显著降低延迟并使其更加稳定，同时保持按需付费的灵活性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对使用 网页搜索 的异步事件处理支持 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降价并简化定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具的定价。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现在可在仪表板中使用，并且可通过 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过 API，你现在可以通过 `prompt` 参数（带有 prompt `id`、可选的 `version`）提供动态 `variables` ，其中可以包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

功能 · 模型：o3-pro · API: v1/responses · API: v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，它是 o3 的一个版本 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型，通过更多算力来回答难题，从而获得更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，覆盖所有 API 请求，包括 batch 和 flex 处理。

### Jun 4

功能 · API: v1/fine_tuning

新增对这些模型的 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 微调支持 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · API: v1/chat/completions · API: v1/realtime

为以下模型提供新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。已发布 [TypeScript 版 Agents SDK](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

在 Responses API 中新增了对内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

特性 · API：v1/responses · API：v1/chat/completions

新增了对使用 `strict` 模式来定义工具 schema 的支持，适用于使用非微调模型进行并行工具调用的场景。
新增了 [schema 功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 的字符串校验以及其他模式，并支持为数字和数组指定范围。

### May 15

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对 [Codex CLI](https://github.com/openai/codex).

### May 7

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [fine-tuning 方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已可用于微调。

## 2025年4月

### 4月30日

功能

已推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API：v1/images/generations · API：v1/images/edits

新增了新的图像生成模型， `gpt-image-1`。该模型在图像生成方面树立了新标准，具有更高的质量与指令遵循能力。

更新了图像生成与编辑接口，以支持该模型专有的新参数 `gpt-image-1` 。

### Apr 16

功能 · API：v1/chat/completions · API：v1/responses

新增了两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编码、视觉推理任务以及技术写作方面树立了新标准。

推出了 Codex——我们的代码生成 CLI 工具。

### Apr 14

功能 · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增了 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入到 API。这些新模型在指令遵循、编程能力方面有所提升，并且拥有更大的上下文窗口（最高可达 1M tokens）。 `gpt-4.1` 和 `gpt-4.1-mini` 支持监督微调。并宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API: v1/audio

新增了 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型到 Audio API。

### Mar 19

Feature · Model：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，它是 o3 的一个版本 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型，通过更多算力来回答难题，从而获得更好的推理能力和一致性。

### 3 月 11 日

Feature · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多个新模型和工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移至更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，预计 Assistants 将于 2026 年（实现完全功能对等之后）停止服务。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增了 `metadata` 字段支持添加到微调任务中。

## 2025 年 2 月

### 2 月 27 日

Feature · Model: GPT-4.5 · API: v1/chat/completions · API: v1/assistants · API: v1/batch

发布了研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——迄今为止我们最大且能力最强的聊天模型。GPT-4.5 具备出色的“情商”和对用户意图的理解，在创意任务和智能体规划方面表现更佳。

### Feb 25

功能

推出了 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新响应了对更多数据筛选条件的需求，例如项目选择、日期选择器以及更细粒度的时间间隔。同时也更好地支持跨不同产品和服务层级查看用量。

### Feb 5

功能

在欧洲推出数据驻留。了解更多 [点击此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一个新的小型推理模型，针对科学、数学和编程任务进行了优化。

### Jan 21

功能 · 模型：o1

扩大对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024年12月

### 12月18日

功能

已推出 [管理 API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理 接口 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在用户被邀请加入组织的同时，通过编程方式将其邀请到项目。

### Dec 17

特性 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

为以下模型新增了模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下功能新增了 WebRTC 连接方式 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增了 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 用于 o1 模型。

新增了 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 用于 o1 模型。注意 o1-preview 和 o1-mini 不支持系统或开发者消息。

推出使用以下方法的偏好微调 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增了 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已推出 [使用情况 接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 各接口的活动和支出。

## 2024 年 11 月

### 11 月 20 日

Update · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o), our newest model in the gpt-4o series.

### Nov 4

功能 · API：v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，当模型响应的绝大部分内容事先已知时，该功能可显著降低延迟。这在重新生成文档和代码文件内容、且仅需少量改动时最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型: gpt-4o-realtime-preview · 模型: gpt-4o-audio-preview · API: v1/chat/completions

新增了五种语音类型， [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 chat completions，同时支持音频输入和输出。使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI DevDay in San Francisco](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在你的应用中快速构建语音到语音的体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用来自大型前沿模型的输出，微调高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit)：在 playground 中使用 Generate 按钮轻松生成提示、函数定义和结构化输出 schema。

## September, 2024

### 9 月 26 日

特性 · 模型: omni-moderation-latest · API: v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（针对部分类别），新增两个仅文本的危害类别，并且分数更加准确。

### 9 月 12 日

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这些是使用强化学习训练的新型大型语言模型，用于执行复杂的推理任务。

## August, 2024

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8 月 15 日

更新 · 模型: gpt-4o · API: v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o), our newest model in the gpt-4o series.

### Aug 1

更新

已推出 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## July, 2024

### Jul 24

更新

已推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费的 Enterprise 客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已推出 [GPT-4o mini 的微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例中实现更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), our affordable an intelligent small model for fast, lightweight tasks.

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## June, 2024

### Jun 6

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以通过传递参数在 Chat Completions 和 Assistants API 中禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### Jun 3

更新

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### May 15

更新

新增对 [归档项目](https://developers.openai.com/projects) 。仅组织所有者可以访问此功能。

新增对 [设置费用上限](https://platform.openai.com/settings/organization/general) 按项目级别为按量付费用户设置。

### 5月13日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快、最实惠的旗舰模型。

### May 9

更新

新增对 [向 Assistants API 输入图像。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增对 [向 Batch API 输入经微调的模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增了 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 向 Chat Completions 和 Completions API 添加 stream_options 参数。设置该参数后，开发者在使用流式传输时可以访问使用情况统计信息。

### 5 月 2 日

更新

新增了 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中删除线程里的消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) ，可用于 Chat Completions 和 Assistants API。

新增了 [Batch API 使用指南](https://developers.openai.com/api/docs/guides/batch) ，以及 Batch API 对 [嵌入模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4 月 17 日

更新

推出了一系列 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) ，更新，包括新的 文件搜索 工具，每个助手最多支持 10,000 个文件，新增 token 控制以及工具选择支持。

### Apr 16

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 以便按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目管理速率和成本限制（成本限制仅对企业客户开放）。

### 4 月 15 日

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### Apr 9

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已正式发布 API

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

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant message creation](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## February, 2024

### 2 月 9 日

更新

新增了 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## January, 2024

### Jan 25

更新

发布了 Embedding V3 模型以及更新版 GPT-4 Turbo 预览版

新增了 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增了 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建

### Dec 15

更新

新增了 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用上的参数为可选

## November, 2023

### Nov 30

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### 11 月 6 日

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [updated GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [DALL·E 3 in the API](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [text-to-speech API](https://developers.openai.com/api/docs/guides/text-to-speech)

已弃用 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023年10月

### 10月16日

更新

新增了 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增了 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增了 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调API
