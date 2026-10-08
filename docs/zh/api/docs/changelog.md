# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

> 涵盖 OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 10 月

### 10 月 8 日

功能 · 模型：gpt-6.1-sol · API：v1/responses

新增 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 适用于 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 在 Responses API 中。使用 `gpt-6.1-sol` 可 `service_tier: "ultrafast"` 以缩短生成输出令牌之间的耗时。该功能向所有 API 用户开放，受速率限制，提供全球处理以及美国和欧盟的数据驻留。详见 [极速模式定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### 10月7日

更新 · 模型：chat-latest

更新后的 **chat-latest** 快照，它指向 ChatGPT Plus、Pro、Business 和 Enterprise 用户可用的最新模型。我们建议在生产环境中使用 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model) API，但你也可以使用此模型测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Oct 6

特性 · 模型：gpt-6-luna · API：v1/decisions

发布了 [Decisions API](https://developers.openai.com/api/docs/guides/decisions) 的 beta 版本，它可以将文本和图像转换为类型化答案，速度比 Responses API 快 10 倍。 `gpt-6-luna`。它可以将文本和图像转换为类型化答案，速度比 响应接口 快 10 倍。

### Oct 6

更新

将 API 用量层级从五档简化为三档：Build、Launch 和 Grow。当组织的累计信用购买额达到层级最低要求时，将自动升级。详见 [用量层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 以了解每月用量限制以及如何查看各模型的速率限制。

### 10 月 5 日

功能

新增产品内流程以支持 HIPAA 合规：API [组织设置 > 常规](https://platform.openai.com/settings/organization/general)。符合条件的组织管理员现在可以接受标准《业务伙伴协议》(BAA)，并为其组织启用 HIPAA 合规支持。请参阅 [帮助中心](https://help.openai.com/en/articles/8660679-getting-a-business-associate-agreement-for-the-openai-api) 了解资格条件、涵盖的服务以及配置要求。

## 2026 年 9 月

### 9 月 29 日

功能

新增 [computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) 到 智能体 API。智能体 可以在 OpenAI 托管的浏览器中完成任务，网站访问授权和登录由你的应用处理。

### 9 月 29 日

功能 · 模型：gpt-6.1-sol · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (`gpt-6.1-sol`）用于复杂的编程和专业工作，成本低于 GPT-6 Astra。

每 1M tokens 的标准定价适用于输入 tokens 不超过 272K 的提示：输入 $2、缓存输入 $0.10、缓存写入 $2.50、输出 $10。

GPT-6.1 Sol 还支持 [Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) （测试版）。让模型在一次 Responses API 请求中将工作委派给子智能体。

使用 Responses API 进行工具调用。参见 [GPT-6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 了解推理设置，以及 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的处理层级。

### 9 月 29 日

功能 · 模型：gpt-6-astra · API：v1/responses

新增 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 用于在 Responses API 中使用 GPT-6 Astra。请使用 `gpt-6-astra` 可 `service_tier: "ultrafast"` 以减少生成输出 tokens 之间的时间。它面向 API 客户提供，受速率限制约束，采用全球处理及美国数据驻留。不支持欧盟及其他区域推理驻留。详见 [极速模式定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### 9 月 25 日

修复 · 模型：gpt-6-sol · 模型：gpt-6-luna

修复了一个图像编码问题，该问题降低了 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。的图像理解能力。此次更新改进了 API 和 Codex 在视觉任务（包括计算机使用）上的结果。

如果你的使用场景涉及图像输入，我们建议重新运行评估，并重试受此问题影响的工作流。

### 9 月 22 日

功能 · 模型：gpt-6-sol · 模型：gpt-6-luna · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions API 生成文本。

针对输入 token 数不超过 272K 的提示词，每 1M token 的标准定价为：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较各项能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 的缓存写入、更长提示和其他处理层级的定价。

### Sep 15

功能

在组织与项目级别新增了 API 密钥创建治理控制。管理员可以仅允许服务账号密钥、仅允许用户拥有的项目密钥，或禁止所有新的 API 密钥创建。组织级限制优先于项目设置，且现有 API 密钥不受影响。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 以了解详情。

### 9 月 10 日

功能

现在你可以在创建项目 API 密钥时设置过期日期。管理员也可以在平台设置中按组织或项目层级强制设置最长密钥有效期，要求新创建的密钥必须在配置的限制内过期。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 获取有关密钥过期与轮换的指导。

### 9 月 10 日

功能

发布了 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 已进入公开测试版。在 OpenAI 负责会话编排、上下文压缩与恢复的同时，你可以使用托管的 Codex 运行框架构建 智能体。

使用持久化会话跨轮次延续工作、流式传输进度，并连接你自己的工具和 MCP 服务器。在 OpenAI 托管的沙箱中运行 智能体，或连接来自你自己的基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### 9 月 10 日

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。构建可在后端模型或 智能体 处理推理与工具调用的同时持续进行的全双工语音对话。

使用 Responses 委托方式连接 OpenAI 模型，或使用客户端委托方式连接你自己的后端。语音会话按秒计费，每分钟 0.05 美元；后端模型与工具调用费用另行收取。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。详见 [定价](https://developers.openai.com/api/docs/pricing) 以了解详情。

### Sep 8

功能 · API：v1/responses

[Prompt Cache 诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已在 Responses API 中正式发布，适用于 GPT-5.6 及更高版本的受支持模型。

将缓存复用情况与上一次响应进行对比，定位缓存未命中的原因，并参考故障排查指引来提升缓存复用率。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 通过 Image API 以及 Responses API 的图像生成工具进行图像生成与编辑。

如果你的工作流对编辑精度要求最高，可选择 Sunburst；如果需要快速、高质量的日常图像生成，可选择 Flare。两个模型都支持新增的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现已通过 [trusted-access 计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 正式发布，面向已获批的内部生命科学研究使用。

标准价格为输入 token 每 1M 5 美元、缓存输入 token 每 1M 0.50 美元、输出 token 每 1M 25 美元。计费自 2026 年 10 月 5 日起生效。详见 [定价](https://developers.openai.com/api/docs/pricing) 以了解详情。

### Sep 3

Feature · Model: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra),我们最强大的模型，专为最困难的端到端任务而打造。

将 GPT-6 Astra 用于推理、编码、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求推进到最终结果，使用你提供的上下文和工具。

迁移时需要考虑的主要变化：

- GPT-6 Astra 不支持该 `none` 推理 effort 等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果将工具与 Chat Completions 配合使用，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [偏差监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，异步检查 智能体 工作期间可能出现的问题。这些检查可以触发安全提醒或暂停对话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解功能、提示和迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 用于浏览器和桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### Sep 3

功能 · API：v1/responses

在 Responses API 中新增了使用 GPT-6 Astra 处理长时间运行任务的控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling):让模型在你的应用运行函数或自定义工具时继续工作，然后在结果可用时返回它们。
- [中途引导](https://developers.openai.com/api/docs/guides/steering):在响应进行过程中通过 WebSockets 发送额外指令，以便模型能够纳入修正或变化的需求。
- [在对话中途更改推理工作量](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation):在保留缓存的提示前缀的同时，为困难工作提高工作量，或为常规后续工作降低工作量。

### Sep 2

更新

更新了 API 错误，以便应用能够区分流量增长过快与暂时性的模型过载。

流量增长过快可能返回 `429` 错误，并附带 `slow_down` 错误码。暂时性的模型过载会返回 `503` 错误，并附带 `server_is_overloaded` 错误码。两种响应都可能包含 `Retry-After`。当存在该响应头时，请至少按其指定的时间等待后再重试。如果缺失，请使用指数退避策略。参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

连接 `api.openai.com` 现在可以使用 IPv6。

## August, 2026

### Aug 29

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已面向 OpenAI API 全面开放。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，访问权限由你所在组织的角色和权限控制。

### 8月26日

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日关闭。迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请迁移到 Responses API 和 Conversations API，方法是使用 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用带有前缀域的 API 密钥，为单个请求选择区域处理，前提是该密钥所属项目启用了 Global 地理位置。现有资格、数据留存控制、端点和模型支持要求仍然适用。详情请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在的价格为每百万输入 token $4、每百万输出 token $20，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8月20日

功能

发布了 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。跟踪缓存命中率随时间的变化、每次写入对应的缓存读取次数，以及缓存读取、缓存写入和未缓存令牌的细分数据，以了解缓存效率并找出改进机会。按模型和服务层级筛选指标。

### 8月20日

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已提供预览版，适用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 图像生成工具中。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。在以下位置了解更多信息： [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式，这是为 GPT-5.6 Sol 提供的一项新的 API 服务等级，其处理速度比 Standard 最高快 14 倍。目前以有限预览的形式向部分客户提供。注册以接收 Ultrafast 模式的更新 [此处](https://openai.com/form/ultrafast/).

### Aug 7

功能 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获批的防御者提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以在明确授权的参与中，借助它们将安全发现推进到经验证的修复。

对于大多数防御性安全工作，请从 Daybreak Blue 开始。它提供对通用模型的访问，例如用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证的 GPT-5.6 Sol。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独审批的、面向特定用途训练的模型访问，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已获授权的漏洞复现、漏洞利用验证、渗透测试、红队演练及复杂系统分析。

这些模型需要另行审批与配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。更多定价详情 [此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

更新后的 **chat-latest** snapshot，它指向 ChatGPT Plus 和 Pro 用户可用的最新模型。我们建议利用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) API，但你也可以使用此模型测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · 模型: gpt-5.6-sol · 模型: gpt-5.6-terra · 模型: gpt-5.6-luna

Fast 模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今日,超过 272K token 的长上下文提示可以在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行,速度比 Standard 层级快高达 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [使用量和成本仪表板](https://platform.openai.com/settings/organization/usage)。中按 API 密钥筛选和分组数据。使用 [量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持按 API 密钥维度进行程序化报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，GPT-5.6 Terra 的价格降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还在推出 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 功能（在 API 中提供），用于替代原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在的处理速度最高可达标准处理的 2.5 倍，相应价格为标准处理的两倍。此次变更向后兼容：带有 priority 标记的请求将自动使用 Fast 模式。

### 7月29日

功能

发布了官方 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API Platform 资源。

配置和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，以及检测和协调配置偏差。从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### 7 月 28 日

Feature · Model: gpt-transcribe · Model: gpt-live-transcribe · API: v1/audio/transcriptions · API: v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于准确的文件转写以及已提交 Realtime 轮次的最终转写文本，并提供 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转写。

两个模型均支持自由形式的转写上下文、关键词提示以及多种预期输入语言。可在 [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出限额。可设置月度上限，当受跟踪的支出达到该上限时，相关 API 请求将返回 `429` 错误。在流量中断前可使用支出提醒进行通知。详细内容请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

特性 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

发布了 [GPT-5.6 模型家族](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括面向前沿能力的 GPT-5.6 Sol、兼顾智能与成本的 GPT-5.6 Terra，以及面向高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理强度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [针对 Responses API 的多 智能体 编排（测试版）](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像，并通过 `original` 或 `auto` 图像细节参数控制。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时发布 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

更新后的 `chat-latest` 快照，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) API，但你也可以使用此模型测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6 月 23 日

功能

在 OpenAI API 平台上线了安全使用情况仪表板。安全仪表板根据以下内容显示被阻止的 Responses 请求： `safety_identifier` 请求中发送的用于标识终端用户的值。请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在除了常规文本结果外，还可以返回图片结果。当你的应用需要最新视觉内容或基于网络的视觉素材时，例如产品照片、地标、地点、活动或视觉参考，请使用图片搜索。更多信息请阅读 [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### 6月4日

Feature · Model: omni-moderation-latest · API: v1/responses · API: v1/chat/completions

已在 Responses API 和 Chat Completions API 中添加审核评分。在生成请求中传入 `moderation` 对象，即可在同一次响应中同时获得模型输入和生成输出的审核结果。

详情请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示词对象、Evals 平台以及智能体 Builder。查看 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解下线时间表和迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，且最低计费时长为 5 分钟，而不是按整个 20 分钟会话费率计费。每分钟的基础费率将保持不变。

此次更新旨在为较短的会话提供更细粒度的计费，并降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前的托管工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现已可通过 Amazon Bedrock 的兼容 Responses API 端点使用，OpenAI 支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认 `24h` 替代 `in_memory`，默认启用扩展提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，指向当前 ChatGPT 所使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) API，但你也可以使用此模型测试聊天用例的最新改进。底层模型快照将定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 26 日

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信的工作负载可以将外部签发的身份令牌交换为短期的 OpenAI 访问令牌，而无需存储长期有效的 API 密钥。

### 5 月 26 日

更新

新增 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 能力，用于管理支出告警、模型允许列表、数据保留设置以及 托管工具 权限，并支持查询精细化的账单明细项。

### 5 月 19 日

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 为企业客户提供。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT Web、Codex、Responses API 以及 AgentKit）通过客户自行托管的 `tunnel-client` 连接至私有或本地 MCP 服务器，而无需将这些服务器暴露至公网。

### 5 月 19 日

更新

现在，你可以管理多个 IP 白名单，并将每个白名单应用到项目级别或整个组织。若要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API Beta 已于 2026 年 5 月 12 日弃用并从 API 中移除。如果你仍在使用 Beta 接口，请迁移至已正式发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以选择加入更长时间的 GPT-5+ 推理 网页搜索 运行，以应对高投入度的研究和评估工作负载。

### May 7

特性 · 模型: gpt-realtime-2 · 模型: gpt-realtime-translate · 模型: gpt-realtime-whisper · API: v1/realtime · API: v1/realtime/translations · API: v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款专为语音到语音 智能体 提供可配置推理能力的新实时语音模型，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) ，用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) ，用于流式语音转文字。

更新后的 [Realtime 与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 用于流式转录内容，并将实时提示工程相关指导迁移到了 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### May 7

功能

发布了 [OpenAI 面向 Codex 的开发者插件](https://developers.openai.com/learn/developers-codex-plugin)。这可以帮助你在 Codex 中借助 OpenAI 平台访问权限以及 OpenAI API 配置指引来构建 AI 应用和 智能体。

### 5 月 6 日

更新

更新后的 Agents SDK 现已在 TypeScript 中可用，支持沙箱 智能体 并内置开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### May 5

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，指向当前 ChatGPT 所使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) for production API usage, but feel free to use this model to test our latest improvements for chat use cases. The underlying model snapshot will be regularly updated. Read more [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 4 日

更新

Admin API 现在已在适用于 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置说明和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求，以应对受益于更多算力的更棘手问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP 以及 网页搜索。关键更新包括：
- 推理工作量现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原有行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存。不支持内存提示缓存。
了解详情 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### 4月21日

Feature · Model: gpt-image-2 · API: v1/images/generations · API: v1/images/edits · API: v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，可享受 50% 折扣。

### 4 月 15 日

更新

更新后的 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来新的能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源 harness；以及
- 控制记忆的创建时机与存储位置。

## 2026年3月

### 3月17日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力引入更快速、更高效的模型中，适合高容量工作负载；GPT-5.4 nano 则针对简单的高容量任务进行了优化，在这些任务中，速度和成本最为关键。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [压缩](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持压缩，但不支持工具搜索或计算机使用。

### 3月16日

更新 · 模型：gpt-5.3-chat-latest

更新后的 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个关于以下方面的小 bug： `input_image` GPT-5.4 中的输入。一些图像理解用例的质量可能会有所提升。无需任何操作。

### Mar 12

Feature · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色参考、最长 `20` 秒的， `1080p` 输出、 `sora-2-pro`，视频扩展，以及 Batch API 对 `POST /v1/videos`. `1080p` 生成的支持。 `sora-2-pro` 按每秒 `$0.70` 计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### Mar 12

Update · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑现有视频。这将替换 `POST /v1/videos/{video_id}/remix`，该接口将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

Feature · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们面向专业工作的最新前沿模型，已在 Chat Completions 和 Responses API 中推出，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于受益于更多算力的更复杂问题。

同步发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，它允许模型将大型工具集合延迟到运行时再加载，从而减少令牌用量、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 为 GPT-5.4 提供支持 `computer` 用于基于屏幕截图的 UI 交互的工具。
- 100 万令牌上下文窗口和原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持运行时间更长的智能体工作流。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展 `input_file` 对 Responses API 的支持，使其能够接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 到 Responses API。它会将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。了解更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2 月 23 日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2 月 23 日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[批量 API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型：gpt-5.2-chat-latest

更新后的 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

推出 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) ，用于 Responses API。

### 2 月 10 日

功能 · API：v1/responses

推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 在 Responses API 中的支持。我们同时支持本地执行和基于托管容器的 Skills 执行。

### 2 月 10 日

功能 · API：v1/responses

推出新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器联网。

### 2月9日

功能 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）结合 `image_url` 或 `file_id` 引用，而非 multipart 上传。

### 2月3日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们为 API 客户优化了推理栈， [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 运行速度现在提升了约 40%。模型和模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

宣布 [Open Responses](https://www.openresponses.org/)：这是一项开源规范，用于在最初的 OpenAI Responses API 之上构建支持多提供商、可互操作的 LLM 接口。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 至 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中的智能体编码任务优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### 1 月 13 日

功能 · API：v1/realtime

为 Realtime API 添加了专用 SIP IP 范围。 `sip.api.openai.com` 会进行 GeoIP 路由，并将 SIP 流量导向最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### 1 月 13 日

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新后的 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 指向 2025-12-15 快照的 slug。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### 1 月 13 日

更新 · 模型：sora-2

更新后的 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### 1 月 13 日

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新后的 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 指向以下快照的 slug： `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### 1 月 9 日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，该问题中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在为图像编辑错误地使用了高保真度（high fidelity），即使在 `/v1/images/edits`，被显式设置为 `fidelity` 已被显式设置为 `low` （默认值）时也是如此。

## December, 2025

### Dec 19

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### 12月16日

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。阅读更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

此次发布还支持 [自定义声音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) ，适用于符合条件的客户。

### Dec 11

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，GPT-5 模型系列中最新旗舰模型。GPT-5.2 在以下方面相比之前的 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格理解与创建。

5.2 中的新增内容包括新的 xhigh 推理强度级别、简洁的推理摘要，以及使用压缩进行的新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于使用 Responses API 的长时间对话，你可以使用该 `/responses/compact` 端点来缩减你每轮发送的上下文。

### Dec 4

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长时序、代理式编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。你现在可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### 11月 13 日

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，GPT-5 模型系列中全新的旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在无需深度思考时可引导且响应更快
- 代码生成与编码场景
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以便在所需思考量较少时更快地响应——这与之前的 `medium` GPT-5 中的默认设置不同。

### 11月 13 日

功能

已发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定组织内和各项目中谁能执行哪些操作——既可通过 API 进行，也可在 Dashboard 中进行。

### 11月 13 日

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是针对 Codex 或类似环境中的智能体编码任务优化的 GPT-5.1 版本。详细了解 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### 11月 13 日

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留使已缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存的工作原理是：当内存已满时，将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm)。企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，在 OpenAI 上加密客户内容。

### Oct 24

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，上发布了多项新功能，它是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多计算资源进行更深入的思考，并持续提供更出色的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，提供更具成本效益的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，提供更具成本效益的图像生成和编辑。

推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，利用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、精细且动态的视频生成和重新混合。

推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) 用于可视化创建自定义多智能体工作流。

推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit),一个可嵌入的聊天界面,用于部署智能体。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals):已发布第三方模型支持。

推出 [服务健康仪表盘](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 允许列表会将 API 访问限制为仅允许你指定的 IP 地址或范围。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增了对将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中的支持。

### Sep 23

Feature · Model: gpt-5-codex · API: v1/responses

发布了专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式推出。了解更多 [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 与 Responses API。连接器是由 OpenAI 维护的 MCP 封装，可对接 Google 应用、Dropbox 等常用服务，使模型能够读取这些服务中存储的数据。

### 8月20日

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，可用于通过 Responses API 创建和管理长期对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) ，了解并排对比以及如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [推理强度](https://developers.openai.com/api/docs/guides/reasoning) 值，用于优化支持推理的 GPT-5 模型的快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，支持在工具调用时向模型提供自由格式输入以及从模型获取自由格式输出。

## June, 2025

### Jun 27

功能

推出对 [优先处理](https://platform.openai.com/docs/guides/priority-processing)。优先处理与标准处理相比可提供显著更低且更稳定的延迟，同时保留按量付费的灵活性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，我们 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增了对使用 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化了定价](https://developers.openai.com/api/docs/pricing) 适用于 网页搜索 工具。新增了对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[新的可重用提示词](https://developers.openai.com/chat/edit) 现已可在控制面板中使用，并且可以 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过API，你现在可以使用 `prompt` 参数（带有提示词 `id`、可选 `version`）并提供动态 `variables` ，其中可以包含字符串、图像或文件输入。可重用提示词不支持 Chat Completions。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

特性 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，一个版本的 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型，使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### 6月4日

特性 · API：v1/fine_tuning

新增针对以下模型的微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 适用于这些模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### Jun 3

特性 · API：v1/chat/completions · API：v1/realtime

新模型快照可用于 [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

在 Responses API 中新增了对新的内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [进一步了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

功能 · API：v1/responses · API：v1/chat/completions

新增了对以下功能的支持： `strict` 在使用非微调模型进行并行工具调用时，为工具架构设置模式。
新增 [架构功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对以下内容的字符串验证： `email` ，以及其他模式，并为数字和数组指定范围。

### May 15

功能 · 模型: codex-mini-latest · API: v1/responses · API: v1/chat/completions

推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，专为 [Codex CLI](https://github.com/openai/codex).

### May 7

功能 · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [fine-tuning methods](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已可用于微调。

## 2025年4月

### 4月30日

功能

推出对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API：v1/images/generations · API：v1/images/edits

新增了一款图像生成模型， `gpt-image-1`。该模型为图像生成设立了新标准，提升了质量和指令遵循能力。

更新了图像生成和编辑端点，以支持该 `gpt-image-1` 模型特有的新参数。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增了两个全新的 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学和编程、视觉推理任务以及技术写作方面树立了新的标准。

推出了 Codex，我们的代码生成 CLI 工具。

### Apr 14

功能 · 模型: gpt-4.1 · 模型: gpt-4.1-mini · 模型: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型已接入到 API。这些新模型在指令遵循、编码以及上下文窗口（最大可达 1M tokens）方面均有所改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型到 Audio API。

### Mar 19

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，一个版本的 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型，使用更多算力来回答难题，具有更好的推理能力和一致性。

### 3月11日

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多个新模型和工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses),这是一个用于创建和使用智能体及工具的新API。
  - 为Responses API发布了一组内置工具: [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，和 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents),这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型: `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移至更易使用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses),预计将于 2026 年下线 Assistants(在实现完整功能对等之后)。

### 3 月 3 日

特性 · API：v1/fine_tuning/jobs

新增 `metadata` 字段对微调任务的支持。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——我们迄今为止最大、最强的聊天模型。GPT-4.5 拥有更高的“情商”和对用户意图的理解，在创意任务和智能体规划方面表现更出色。

### Feb 25

功能

推出的 [API 使用情况仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新满足了用户对更多数据筛选条件的需求，例如项目选择、日期选择器和细粒度时间间隔。同时，查看不同产品和服务层级使用情况的功能也得到了改进。

### Feb 5

功能

在欧洲推出数据驻留。阅读更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，一款针对科学、数学和编程任务优化的小型推理模型。

### Jan 21

功能 · 模型：o1

扩展对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

推出 [Admin API Key Rotations（管理员 接口 密钥轮换）](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理员 接口 密钥。

已更新 [Admin API Invites（管理员 接口 邀请）](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在将用户邀请到组织的同时，以编程方式将其邀请到项目。

### Dec 17

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

为以下模型新增支持 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下版本新增了 WebRTC 连接方式 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 用于 o1 模型。注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下技术的偏好微调 [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，集成于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

推出 [量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 的活动和支出。

## 2024 年 11 月

### 11 月 20 日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中的最新模型。

### Nov 4

功能 · API：v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，对于响应内容大部分预先已知的模型响应，可显著降低延迟。这最常用于仅做少量更改时重新生成文档和代码文件的内容。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

在 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10 月 17 日

特性 · 模型: gpt-4o-audio-preview · API: v1/chat/completions

已发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) ，用于聊天补全，支持音频输入和输出。使用与之前相同的底层模型。 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

特性 · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在 [OpenAI 旧金山 DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime): 使用 WebSockets 接口在你的应用中构建快速的语音到语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): 使用大型前沿模型的输出对高性价比模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision): 使用图像和文本微调 GPT-4o 以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals): 创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching): 对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit): 使用“生成”按钮轻松在 playground 中生成提示词、函数定义和结构化输出架构。

## 2024 年 9 月

### 9 月 26 日

Feature · Model: omni-moderation-latest · API: v1/moderations

已发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，支持图像和文本（适用于部分类别），支持两个新的纯文本危害类别，并提供更准确的评分。

### 9 月 12 日

特性 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，是采用强化学习训练、用于执行复杂推理任务的新型大语言模型。

## 2024年8月

### Aug 29

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，并支持自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### 8月20日

功能 · 模型: gpt-4o · API: v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8月15日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型，用于 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在能可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，我们 gpt-4o 系列中的最新模型。

### 8 月 1 日

更新

推出 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户通过编程方式管理其组织并使用审计日志监控更改。审计日志记录功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

推出 [对 GPT-4o mini 进行微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例中实现更高效能。

### 7月18日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，我们的高性价比智能小模型，适用于快速、轻量的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以便分块上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传入以下方式禁用： `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 以 Beta 形式推出。

### Jun 3

更新

新增对 [文件搜索自定义项](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### May 15

更新

新增对 [归档项目](https://developers.openai.com/projects) 。仅组织所有者可以使用此功能。

新增对 [设置费用限额](https://platform.openai.com/settings/organization/general) ，针对按需付费客户按项目进行设置。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 中通过 API 使用。GPT-4o 是我们最快、价格最亲民的旗舰模型。

### 5 月 9 日

更新

新增对 [图像输入到 Assistants API。](https://developers.openai.com/api/docs/assistants/migration)

### May 7

更新

新增对 [微调模型到 Batch API](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5 月 6 日

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数到 Chat Completions 和 Completions APIs。设置后，开发者在使用流式传输时即可获取用量统计信息。

### May 2

更新

新增 [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中从会话里删除消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

引入了一系列 [对 Assistants API 的更新](https://developers.openai.com/api/docs/assistants/migration) ，包括全新的 文件搜索 工具（每个智能体最多支持 10,000 个文件）、新的 token 控制，以及对工具选择（tool choice）的支持。

### 4 月 16 日

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目管理速率和成本限额（成本限额仅对企业客户开放）。

### 4 月 15 日

更新

已发布 [批量 API](https://developers.openai.com/api/docs/guides/batch)

### 4月 9日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式发布

### 4 月 4 日

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [在创建 Run 时添加消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024年3月

### 3月29日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant message creation](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### 2月9日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### 2月1日

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024年1月

### 1月25日

更新

发布了 Embedding V3 模型以及更新后的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 至 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以在 Assistants API 中运行创建操作

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 以调用 Chat Completions API

### 12月14日

更新

Changed [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) argument on a tool call to be optional

## 2023年11月

### 11月30日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## October, 2023

### Oct 16

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 至 Embeddings API

新增 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
