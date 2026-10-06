# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

> OpenAI API 的最新功能和更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 10 月

### 10 月 6 日

功能 · 模型：gpt-6-luna · API：v1/decisions

已发布 [Decisions API](https://developers.openai.com/api/docs/guides/decisions) 测试版，支持 `gpt-6-luna`。将文本和图像转换为类型化答案的速度比 Responses API 快 10 倍。

### 10 月 6 日

更新

将 API 使用层级从五个简化为三个：Build、Launch 和 Grow。当组织的累计信用额度购买达到层级最低限额时，将自动升级。详情请参阅 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) ，了解每月使用限额以及如何查看每个模型的速率限制。

### 10月5日

功能

在API中添加了用于 HIPAA 合规支持的产内流程 [组织设置 > 常规](https://platform.openai.com/settings/organization/general)。符合资格的组织的管理员现在可以接受标准的商业伙伴协议（BAA），并为其组织启用 HIPAA 合规支持。请参阅 [帮助中心](https://help.openai.com/en/articles/8660679-getting-a-business-associate-agreement-for-the-openai-api) 了解资格、覆盖服务以及配置要求。

## 2026 年 9 月

### 9 月 29 日

功能

新增 [computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) 到 智能体 API。智能体 可以在 OpenAI 托管的浏览器中完成任务，网站访问授权和登录由你的应用处理。

### 9 月 29 日

功能 · 模型：gpt-6.1-sol · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (`gpt-6.1-sol`) 用于复杂的编程和专业工作，成本低于 GPT-6 Astra。

在输入 token 数最多 272K 的提示词上，每 1M token 的标准价格为：输入 $2，缓存输入 $0.10，缓存写入 $2.50，输出 $10。

GPT-6.1 Sol 还支持 [Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) （测试版）。在 Responses API 请求中，可以让模型将工作委托给子智能体。

使用 Responses API 进行工具调用。详见 [GPT-6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 了解推理设置，以及 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的处理层级。

### 9 月 29 日

功能 · 模型：gpt-6-astra · API: v1/responses

新增 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) （适用于 Responses API 中的 GPT-6 Astra）。使用 `gpt-6-astra` 配合 `service_tier: "ultrafast"` 以缩短生成输出 token 之间的时间。它面向 API 客户提供，受速率限制，适用于全局处理和 US 数据驻留。不支持 EU 和其他区域推理驻留。请参阅 [极速定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### Sep 25

修复 · Model: gpt-6-sol · Model: gpt-6-luna

修复了导致图片理解能力下降的图像编码缺陷，影响 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。此更新改善了 API 和 Codex 中视觉任务的结果，包括计算机使用。

如果你的用例涉及图像输入，建议重新运行评估，重试受此问题影响的工作流。

### Sep 22

Feature · Model: gpt-6-sol · Model: gpt-6-luna · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions APIs 生成文本。

提示中最多 272K 输入 token 的每 1M token 标准定价：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录中比较各项能力](https://developers.openai.com/api/docs/models)，并查看 [定价](https://developers.openai.com/api/docs/pricing) 中关于缓存写入、更长的 prompt以及其他处理层级的说明。

### 9月15日

功能

在组织和项目级别新增了 API 密钥创建的治理控制。管理员可以仅允许服务账号密钥、仅允许用户拥有的项目密钥，或禁止所有新 API 密钥的创建。组织级别的限制优先于项目设置，且现有 API 密钥不受影响。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### Sep 10

功能

你现可在创建项目 API 密钥时设置过期日期。管理员还可以在 Platform 设置中的组织或项目级别强制设定最长密钥有效期，要求新创建的密钥在所配置的限制内过期。参阅 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 获取有关密钥过期和轮换的指导。

### Sep 10

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 已进入公开测试阶段。你可以使用托管的 Codex harness 构建 智能体，同时由 OpenAI 处理会话编排、上下文压缩与恢复。

使用持久化会话跨轮次继续工作、流式传输进度，并连接你自己的工具和 MCP 服务器。可在 OpenAI 托管的沙箱中运行 智能体，或连接来自你自己基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### Sep 10

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。你可以构建全双工语音对话，在后端模型或 智能体 处理推理与工具调用的同时持续进行。

可使用 Responses 委托方式配合 OpenAI 模型，或使用客户端委托方式连接你自己的后端。语音会话费用为每分钟 0.05 美元，按秒计费；后端模型和工具调用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。开始。参阅 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 8

功能 · API：v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 Responses API 中正式发布，适用于 GPT-5.6 及更高版本的支持模型。

将缓存复用情况与上一次响应进行比较，识别缓存未命中的原因，并遵循故障排查指引来提升缓存复用率。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 可通过 Image API 和 Responses API 的图像生成工具进行图像生成与编辑。

当编辑精度最为关键的工作流时使用 Sunburst，或在追求快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`) 现已通过 [trusted-access 计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已获批的内部生命科学研究正式发布。

标准定价为输入 token 每 1M 5 美元、缓存输入 token 每 1M 0.50 美元、输出 token 每 1M 25 美元。计费自 2026 年 10 月 5 日起开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 3

Feature · Model: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最艰巨的端到端任务而构建。

将 GPT-6 Astra 用于推理、编程、计算机使用、研究和文档创建。它能够结合这些能力，将复杂任务从初始请求推进到最终成果，并利用你提供的上下文和工具。

迁移时需要考虑的关键变更：

- GPT-6 Astra 不支持 `none` 推理力度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请参考 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [错位监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，异步检查 智能体 工作期间的潜在问题。检查可能触发安全警报或停止对话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解功能、提示与迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 用于浏览器与桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理档位。

### Sep 3

功能 · API：v1/responses

在 Responses API 中为使用 GPT-6 Astra 处理长时间运行的任务新增了控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让模型在你的应用运行函数或自定义工具时继续工作，然后随着结果的可用即时返回。
- [中途转向](https://developers.openai.com/api/docs/guides/steering)：在响应进行中通过 WebSockets 发送额外指令，使模型能够纳入修正或变化的需求。
- [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，针对困难工作提高强度，或在常规后续任务中降低强度。

### Sep 2

更新

更新了 API 错误，使应用能够区分流量增长过快与暂时性的模型过载。

流量增长过快可能返回带有 `429` 代码的 `slow_down` 错误；暂时性的模型过载返回带有 `503` 代码的 `server_is_overloaded` 代码的错误。两种响应都可能包含 `Retry-After`。当响应头存在时，重试前至少等待其指定的时长；如果缺失，请使用指数退避。请参阅 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

Connections to `api.openai.com` 现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 中正式发布。你可以直接在 [Platform console](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，访问权限由你所在组织的角色和权限管理。

### Aug 26

Update · Model: whisper-1 · Model: gpt-4o-transcribe · Model: gpt-4o-mini-transcribe · Model: gpt-4o-transcribe-diarize · API: v1/audio/transcriptions · API: v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转写指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026 年 8 月 26 日停用。请按照迁移指南迁移到 Responses API 和 Conversations API [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以使用带有 API 密钥的前缀域名，为来自 Global 地理设置项目的单个请求选择区域处理。原有的资格、数据保留控制、端点和模型支持要求继续适用。详细了解请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在的价格为每百万输入 token 4 美元、每百万输出 token 20 美元，即输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [提示缓存管理仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。随时间跟踪你的缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存的令牌分布，以了解你的缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在预览版中可用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 图像生成工具中。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。在 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8 月 13 日

公告

推出 Ultrafast 模式，这是适用于 GPT-5.6 Sol 的全新 API 服务层级，处理速度最高可达 Standard 处理的 14 倍。目前以有限预览的形式向部分客户提供。在此处 [接收 Ultrafast 模式的最新动态](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现在为已获批的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们可在明确授权的参与中，从安全发现推进到经验证的修复。

大多数防御性安全工作可从 Daybreak Blue 开始。它提供对通用模型（例如 GPT-5.6 Sol）的访问，可用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经单独审批、对以下专用训练模型的访问，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于授权的漏洞复现、漏洞利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要单独审批和资源调配。你可以申请加入 Daybreak 项目 [接收 Ultrafast 模式的最新动态](https://openai.com/daybreak/)。更多定价详情 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

已更新 **chat-latest** 快照，该快照指向 ChatGPT 中 Plus 和 Pro 用户可用的最新模型。我们建议利用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境 API 使用场景，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将会定期更新。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

Fast 模式现在支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今天，超过 272K token 的长上下文提示可以在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度最高可达 Standard 档位的 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在按 API key 筛选和分组数据 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。该 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API key 维度，用于程序化报告与分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API: v1/responses · API: v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，GPT-5.6 Terra 的价格降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们同时推出 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 在 API 中，该等级取代了原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在以两倍价格提供最高 2.5 倍于标准处理的速度。此变化向后兼容，被标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API 平台资源。

对项目、用户、用户组、角色、访问权限分配、服务账号、证书、邀请以及项目级速率限制进行配置和管理。使用标准 Terraform 工作流来审查并应用更改、导入现有资源，以及检测和协调配置漂移。请通过以下位置安装该 provider： [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### 7月 28 日

Feature · Model: gpt-transcribe · Model: gpt-live-transcribe · API: v1/audio/transcriptions · API: v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录以及已提交 Realtime 轮次的最终转录文本,以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

两个模型都支持自由形式的转录上下文、关键词提示以及多种预期输入语言。可在以下位置比较支持的输出和工作流: [转写指南](https://developers.openai.com/api/docs/guides/transcription).

### 7 月 22 日

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出上限。设置每月上限，当追踪到的支出达到上限时，受影响的 API 请求将返回 `429` 错误。在流量被中断前，可以使用支出告警进行通知。更多信息请阅读 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括面向前沿能力的 GPT-5.6 Sol、兼顾智能与成本的 GPT-5.6 Terra，以及面向高吞吐高效负载的 GPT-5.6 Luna。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度与 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [多智能体编排（适用于 Responses API）现已进入测试阶段](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持按原始尺寸接收图像，并提供 `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，在字母数字识别、静音与噪声处理以及打断行为方面均有改进。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款面向实时语音应用的更快、更低成本的蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

已更新 `chat-latest` snapshot，它指向当前在 ChatGPT 中使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境 API 使用场景，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将会定期更新。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了安全使用仪表板。安全仪表板会根据以下条件显示被拦截的 Responses 请求： `safety_identifier` 请求中用于识别最终用户的值。请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在可以与常规文本结果一起返回图像结果。当你的应用需要当前或基于网络的视觉内容（例如产品照片、地标、地点、活动或视觉参考）时，可以使用图像搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/login).

### Jun 4

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 添加了审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中接收模型输入和生成输出的审核结果。

请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月3日

更新

宣布弃用可复用的提示对象、Evals 平台和智能体 Builder。参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 了解停用时间表和迁移指南。

### 6 月 2 日

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，且设有 5 分钟最低计费时长，不再按完整的 20 分钟会话费率计费。底层的每分钟费率将保持不变。

此次更新旨在为较短会话提供更精细的计费方式，并将降低客户的实际成本。

你可以在我们的 [API 定价文档中找到当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现已在 Amazon Bedrock 中通过兼容 OpenAI 的 Responses API 端点提供。可用模型与功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认使用 `24h` 代替 `in_memory`，默认开启扩展提示词缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · 模型：chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境 API 使用场景，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照将会定期更新。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

已发布 [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation). 受信任的工作负载可以将外部颁发的身份令牌交换为短期的 OpenAI 访问令牌，而无需存储长期有效的 API 密钥。

### May 26

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置和 托管工具 权限，以及查询细粒度的账单明细项目。

### May 19

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 让受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 以及 AgentKit）能够通过客户自托管的隧道连接到私有或本地部署的 MCP 服务器 `tunnel-client` ，而无需将这些服务器暴露在公共互联网上。

### May 19

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 被弃用并从 API 中移除。我们推荐使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 。

Realtime API Beta 已于 2026-05-12 被弃用并从 API 中移除。如果你仍在使用 Beta 接口，请迁移到已发布的 Realtime API。参见 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### May 11

功能 · API：v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可选择启用更长时间的 GPT-5+ 推理 网页搜索 运行，以应对高投入的研究和评估任务。

### May 7

特性 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款面向语音到语音 智能体 的全新实时语音模型，支持可配置推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

已更新 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，并更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以支持流式转录，还将实时提示词相关指导迁移到了 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

已发布 [OpenAI Developers Codex 插件](https://developers.openai.com/learn/developers-codex-plugin)。它帮助你在 Codex 中构建 AI 应用和 智能体，并提供 OpenAI Platform 访问权限与 OpenAI API 配置指导。

### May 6

更新

更新后的 Agents SDK 现已在 TypeScript 中可用，并内置支持沙箱 智能体 以及一个开源的 harness。了解更多信息 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用，但可以自由使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照将定期更新。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/chat-latest).

### 5月4日

更新

Admin API 现在已在适用于 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 以了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

特性 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的新一代前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于针对能从更多算力中受益的更困难问题的 Responses API 请求。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置计算机使用、托管 shell、应用补丁、Skills、MCP，以及 网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存，不支持内存中的提示缓存。
了解更多信息 [请参阅此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

Feature · Model: gpt-image-2 · API: v1/images/generations · API: v1/images/edits · API: v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持（享 50% 折扣）。

### Apr 15

更新

已更新 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) ，新增能力包括：
- 在受控的沙盒环境中运行智能体；
- 检查并定制开源 harness；以及
- 控制记忆的创建时机与存储位置。

## 2026年3月

### 3月17日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 到 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到一款更快、更高效的模型上，适合高吞吐量工作负载；而 GPT-5.4 nano 针对简单的高吞吐量任务进行了优化，在这些场景中速度和成本最为关键。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [上下文压缩](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持上下文压缩，但不支持工具搜索或计算机使用。

### Mar 16

更新 · Model: gpt-5.3-chat-latest

已更新 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个关于 `input_image` GPT-5.4 输入的小问题。部分图像理解用例的质量可能因此得到改善，无需采取任何操作。

### Mar 12

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用的角色参考、 `20` 最长可达， `1080p` 秒的更长生成时长， `sora-2-pro`，输出，以及 Batch API 对 `POST /v1/videos`. `1080p` 的支持。 `sora-2-pro` 上的生成按 `$0.70` 每秒计费。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/guides/video-generation).

### Mar 12

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` ，用于编辑已有视频。该接口将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3 月 5 日

特性 · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已加入 Chat Completions 和 Responses API，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) ，已加入 Responses API，用于受益于更多算力的更困难问题。

同步发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，模型可以推迟加载大型工具集合到运行时，从而降低 token 使用量、保持缓存性能并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供的 `computer` 工具，支持基于截屏的 UI 交互。
- 支持 1M token 上下文窗口以及原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，适用于运行时间更长的 智能体 workflows。

### Mar 3

功能 · 模型: gpt-5.3-chat-latest · API: v1/chat/completions · API: v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展了 `input_file` 对 Responses API 的支持，可处理更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 到 Responses API。它将助手消息标记为中间评注（`commentary`）或最终答案（`final_answer`）。阅读更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。阅读更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 至 Realtime API。

已发布 `gpt-audio-1.5` 至 Chat Completions API。阅读更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型：gpt-5.2-chat-latest

已更新 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

已发布 [服务端 compaction](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，支持在 Responses API 中使用。

### 2 月 10 日

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，支持在 Responses API 中使用。Skills 同时支持本地执行和基于托管容器的执行。

### 2 月 10 日

功能 · API：v1/responses

推出了新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，以及容器中的网络支持。

### Feb 9

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增了对 `application/json` 请求的支持， `/v1/images/edits` 面向 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`），并使用 `image_url` 或 `file_id` 引用，而非 multipart 上传。

### 2 月 3 日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了我们的推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型和模型权重均未更改。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/)：一个开源规范，用于构建基于原有 OpenAI Responses API 的多提供商、可互操作的 LLM 接口。

### Jan 14

特性 · 模型：gpt-5.2-codex · API：v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是针对 Codex 或类似环境中的智能体编码任务优化的 GPT-5.2 版本。了解更多 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

Feature · API: v1/realtime

为 Realtime API 添加了专用的 SIP IP 范围。 `sip.api.openai.com` 支持 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

Update · Model: gpt-realtime-mini · Model: gpt-audio-mini

已更新 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

Update · Model: sora-2

已更新 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

已更新 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 这些 slug 应指向 `2025-12-15` 快照。如果需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前建议使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，该问题中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在为通过 `/v1/images/edits`，进行的图像编辑错误地使用了高保真度，即使 `fidelity` 已明确设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

Update · Model: gpt-image-1.5 · Model: chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 至 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。阅读更多 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/docs/guides/image-generation).

### Dec 15

Feature · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-4o-mini-transcribe · Model: gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用提供了可靠性、质量和语音保真度的改进。阅读更多 [接收 Ultrafast 模式的最新动态](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，面向符合条件的客户。

### Dec 11

特性 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，是 GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相较于之前的 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性以及 token 效率
- 多模态，尤其是视觉
- 代码生成，尤其是前端界面创建
- 在 API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新内容是新增的 xhigh 推理力度等级、简洁的推理摘要，以及使用压缩实现的新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间运行对话，你可以使用 `/responses/compact` 端点来缩减每次轮次发送的上下文。

### Dec 4

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 调用 Responses API。GPT-5.1-Codex 是我们最智能的编程模型，针对长周期、智能体编程任务进行了优化。了解更多 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

Feature · API: v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处的文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，是 GPT-5 模型系列中全新的旗舰模型。GPT-5.1 在以下方面经过特别强化训练：

- 在不需要深度思考时可获得更强的可控性与更快的响应
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以便在所需思考量较少时给出更快的响应——这与之前 GPT-5 中的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强的基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定组织内和各项目中谁能执行哪些操作——既可通过 API，也可在 Dashboard 中进行。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 的一个版本，专为 Codex 或类似环境中的智能体编码任务而优化。了解更多 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留会延长缓存前缀的保持时间，最长可达 24 小时。扩展的提示缓存通过在内存不足时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## 2025年10月

### 10月29日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [接收 Ultrafast 模式的最新动态](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). 企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10 月 6 日

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力进行更深入的思考，从而提供始终更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，可获得性价比更高的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，可获得性价比更高的图像生成与编辑。

已发布 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，借助我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，可生成丰富、细致且动态的视频，并进行二次创作。

已发布 [智能体构建器](https://developers.openai.com/api/docs/guides/agent-builder) 用于以可视化方式创建自定义的多智能体工作流。

已发布 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

已发布 [Trace Evals、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：已发布第三方模型支持。

已发布 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能将 API 访问限制为你所指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增对将 image 和 file 作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 支持，该支持适用于 Responses API。

### Sep 23

功能 · 模型：gpt-5-codex · API：v1/responses

推出了专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

Feature · API: v1/realtime

OpenAI Realtime API 现已正式发布。了解详情 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增了对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，用于在模型需要读取这些服务中的数据时对接 Google 应用、Dropbox 等流行服务。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布 Conversations API，允许你使用 Responses API 创建和管理长期对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) ，查看并排对比以及如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

推出 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，以在支持推理的 GPT-5 模型中优化快速响应。

新增 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在调用工具时向模型传入自由格式输入并获取自由格式输出。

## June, 2025

### Jun 27

功能

已推出对 [Priority processing](https://platform.openai.com/docs/guides/priority-processing)。Priority processing 与 Standard processing 相比，可显著降低并稳定延迟，同时保持按需付费的灵活性。

### 6 月 24 日

Feature · Model: o3-deep-research · Model: o3-deep-research-2025-06-26 · Model: o4-mini-deep-research · Model: o4-mini-deep-research-2025-06-26 · API: v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，这些是 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增了对异步事件处理的支持，配套使用 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化定价](https://developers.openai.com/api/docs/pricing) ，适用于 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月13日

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台和 [Responses API中提供](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过API，你现在可以通过 `prompt` 参数引用在控制台创建的模板（包含一个提示词 `id`，以及可选的 `version`），并提供可以包含字符串、图像或文件输入的动态 `variables` 。Chat Completions 中不提供可复用提示词。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API: v1/responses · API: v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，使用更多算力来回答难题，从而获得更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### Jun 4

功能 · API: v1/fine_tuning

新增对以下模型使用 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 的微调支持 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月3日

功能 · API: v1/chat/completions · API: v1/realtime

为以下模型提供新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [适用于 TypeScript 的 Agents SDK](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

新增了对 Responses API 中新的内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解更多关于工具的信息](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

功能 · API: v1/responses · API: v1/chat/completions

新增了对在以下场景使用 `strict` 模式用于工具 schema 的支持，可在使用并行工具调用时配合未微调的模型。
新增了 [schema 功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括为以下内容提供字符串验证： `email` 以及其他模式，并为数字和数组指定范围。

### May 15

特性 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已发布 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 已在 API 中提供，针对以下场景进行了优化： [Codex CLI](https://github.com/openai/codex).

### May 7

特性 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已推出对 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已推出对 [增强版 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API: v1/images/generations · API: v1/images/edits

新增了一款图像生成模型， `gpt-image-1`。该模型在图像生成质量与指令遵循能力上树立了新标准。

已更新图像生成与编辑接口，以支持该模型特有的新参数 `gpt-image-1` 。

### 4月16日

功能 · API：v1/chat/completions · API：v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学与编程、视觉推理任务以及技术写作方面树立了新标准。

推出 Codex，我们的代码生成 CLI 工具。

### Apr 14

功能 · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) models 到 API 的接入。这些新模型在指令遵循、编码能力以及更长上下文窗口（最高可达 1M tokens）方面均有改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。同时公布了对 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型到 Audio API。

### Mar 19

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的一个版本，使用更多算力来回答难题，从而获得更好的推理能力和一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了若干新模型和工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体与工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布了将所有 Assistants API [Assistants 接口](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易使用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，的计划，预计 Assistants 将于 2026 年下线（在实现完全功能对等之后）。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 字段支持添加到微调任务。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——迄今为止我们最大且最强大的对话模型。GPT-4.5 具备高“情商”和对用户意图的理解能力，在创意任务和智能体规划方面表现更佳。

### 2 月 25 日

功能

发布了 [API 用量仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新响应了大家对于新增数据筛选功能的需求，例如项目选择、日期选择器以及更细粒度的时间区间。同时，对跨不同产品和服务层级查看用量数据也提供了更好的支持。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解更多 [接收 Ultrafast 模式的最新动态](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已发布 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，是一款针对科学、数学和编码任务进行了优化的全新小型推理模型。

### Jan 21

特性 · 模型：o1

扩展对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，可执行复杂推理。

## December, 2024

### Dec 18

功能

已发布 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理 api 密钥。

Updated [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在邀请用户加入组织的同时，将其以编程方式邀请至项目。

### 12月17日

功能 · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

新增模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 Realtime API 新增 WebRTC 连接方式 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 适用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 适用于 o1 模型。请注意，o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出使用 [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 支持，位于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已发布 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询各 OpenAI API 的活动与支出。

## 2024 年 11 月

### 11 月 20 日

更新 · API：v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，我们的 gpt-4o 系列最新模型。

### Nov 4

功能 · API：v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，可以在大量响应内容事先已知的情况下显著降低模型响应的延迟。这在仅对文档和代码文件进行小幅修改并重新生成内容时最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增五种新的语音类型， [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) ，用于聊天补全，同时支持音频输入和输出。使用与 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI 在旧金山举办的 DevDay](https://openai.com/devday/):

[Realtime 接口](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在你的应用中构建快速的语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出，对高性价比的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近见过的输入令牌提供折扣和更快的处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit)：使用 Generate 按钮在 Playground 中轻松生成提示、函数定义和结构化输出架构。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（适用于部分类别），新增了两个仅文本的危害类别，并提供更准确的评分。

### Sep 12

特性 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这些是新型的大型语言模型，通过强化学习训练以执行复杂的推理任务。

## 2024 年 8 月

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现在支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

GA 发布版本，适用于 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### Aug 15

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

已发布 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在可以可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，我们的 gpt-4o 系列最新模型。

### Aug 1

更新

已发布 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已发布 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费的 Enterprise 客户针对他们所需的 IDP 设置身份验证。

### 7月 23日

更新

已发布 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization),可为特定用例带来更高的性能。

### Jul 18

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，是我们面向快速、轻量级任务的经济型智能小模型。

### 7月17日

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传入 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 启动 Beta。

### 6月3日

更新

新增了对 [文件搜索 自定义项](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## May, 2024

### May 15

更新

新增了对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者可以访问此功能。

新增了对 [设置成本限制](https://platform.openai.com/settings/organization/general) ，按项目为按量付费客户提供。

### 5月13日

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### May 9

更新

新增了对 [向 Assistants API 输入图像。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增了对 [向 Batch API 输入微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 向 Chat Completions 和 Completions API 添加 stream_options 参数。设置该参数后，开发者在使用流式输出时可以获取使用情况统计。

### 5 月 2 日

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中从线程删除消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API 中。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [嵌入模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出了一系列 [Assistants API 更新](https://developers.openai.com/api/docs/assistants/migration) ，包括一款新的 文件搜索 工具，允许每个智能体最多支持 10,000 个文件，新增 token 控制，并支持工具选择。

### 4月16日

更新

新增 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目维度管理速率和成本限额（成本限额仅对企业客户开放）。

### Apr 15

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4月9日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) in general availability in the API

### 4 月 4 日

更新

新增了对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增了对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增了对 [在创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增了对 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增了对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [创建助手消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### 3 月 14 日

更新

新增了对 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### Feb 9

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## January, 2024

### Jan 25

更新

发布了 Embedding V3 模型和更新的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 至 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以便在 Assistants API 中运行创建操作

### Dec 15

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数变为可选

## 2023 年 11 月

### 11 月 30 日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [已更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [在 API 中使用 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文字转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 至 Embeddings API

新增 `max_tokens` 到 [Moderation models](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10 月 6 日

更新

新增 [function calling support](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到 Fine-tuning API
