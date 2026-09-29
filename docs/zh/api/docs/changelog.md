# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

> OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## September, 2026

### Sep 29

功能

新增 [计算机使用](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) 到 智能体 API。智能体 可以在 OpenAI 托管的浏览器中完成任务，网站访问审批和登录由你的应用处理。

### Sep 29

功能 · 模型：gpt-6.1-sol · API：v1/responses · API：v1/chat/completions

发布 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (`gpt-6.1-sol`），面向复杂编码和专业工作，成本低于 GPT-6 Astra。

对于输入 token 不超过 272K 的提示，标准定价（每 1M tokens）为：输入 $2，缓存输入 $0.10，缓存写入 $2.50，输出 $10。

GPT-6.1 Sol 也支持 [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) （测试版）。让模型在单个 Responses API 请求中将工作委派给子智能体。

使用 Responses API 进行工具调用。参见 [GPT-6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 了解推理设置，参见 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的处理层级。

### Sep 29

功能 · 模型：gpt-6-astra · API：v1/responses

新增 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) ，适用于 Responses API 中的 GPT-6 Astra。使用 `gpt-6-astra` 使用 `service_tier: "ultrafast"` 以缩短生成输出 token 之间的时间间隔。它面向 API 客户提供，受速率限制，并支持全球处理与美国数据驻留。不支持欧盟及其他地区推理驻留。详见 [极速推理定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### Sep 25

修复 · 模型: gpt-6-sol · 模型: gpt-6-luna

修复了图像编码中的一个 bug，该问题会降低 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。的图像理解能力。此次更新改善了在 API 和 Codex 中视觉任务（包括计算机使用）的效果。

如果你的用例涉及图像输入，建议重新运行评估，并重试受此问题影响的工作流。

### 9月 22日

特性 · 模型：gpt-6-sol · 模型：gpt-6-luna · API：v1/responses · API：v1/chat/completions

发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions API 生成文本。

输入 token 数不超过 272K 的提示的标准价格为每 1M tokens：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较各项能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解缓存写入、更长的提示以及其他处理层级。

### 9月15日

功能

在组织和项目级别新增了 API 密钥创建治理控制。管理员可以仅允许服务账号密钥、仅允许用户拥有的项目密钥，或禁用所有新增 API 密钥的创建。组织级别的限制优先于项目设置，已有的 API 密钥不受影响。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### Sep 10

功能

现在你可以在创建项目 API 密钥时设置过期时间。管理员还可以在 Platform 设置中的组织或项目级别强制设定最长密钥生命周期，要求新创建的密钥在配置的期限内过期。详见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 了解有关密钥过期与轮换的指引。

### Sep 10

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公测版。借助托管的 Codex 执行环境构建 智能体，由 OpenAI 负责会话编排、上下文压缩和恢复。

使用持久化会话跨轮次延续工作、实时推送进度，并接入你自己的工具和 MCP 服务器。在 OpenAI 托管的沙箱中运行 智能体，或连接来自你自己的基础设施或受支持提供方的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### Sep 10

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中正式发布。可构建全双工语音会话，在后端模型或 智能体 处理推理和工具的同时继续对话。

使用 Responses 委托接入 OpenAI 模型，或使用客户端委托接入你自己的后端。语音会话费用为每分钟 0.05 美元，按秒计费；后端模型和工具使用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指引](https://developers.openai.com/api/docs/guides/live-migration)。开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 8

功能 · API：v1/responses

[Prompt Cache 诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 Responses API 中正式上线，适用于 GPT-5.6 及更高版本的受支持模型。

将缓存复用情况与上一次响应进行比较，识别缓存未命中的原因，并参考故障排查指引来提升缓存复用率。

### Sep 8

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 通过 Image API 和 Responses API 的图像生成工具，用于图像生成与编辑。

在对编辑精度要求最高的工作流中选择 Sunburst，或在需要快速、高质量的日常图像生成时选择 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）已通过 [trusted-access 计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 正式上线，供已获批的内部生命科学研究使用。

标准价格为输入 token 每百万 5 美元、缓存输入 token 每百万 0.50 美元、输出 token 每百万 25 美元。计费自 2026-10-05 起开始。请参阅 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 3

Feature · Model: gpt-6-astra · API: v1/responses · API: v1/chat/completions

发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最艰巨的端到端任务而构建。

将 GPT-6 Astra 用于推理、编码、计算机使用、研究和文档创建。它将这些能力结合起来，利用你提供的上下文和工具，将复杂任务从初始请求推进到最终结果。

迁移时需要考虑的主要变更：

- GPT-6 Astra 不支持 `none` 推理投入级别。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [错位监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在支持的 Responses API 请求中，异步检查 智能体 工作期间可能出现的问题。检查可触发安全警报或暂停对话以供审核。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示与迁移指南。探索 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) 获取浏览器与桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理档位。

### Sep 3

功能 · API：v1/responses

在 Responses API 中为 GPT-6 Astra 的长时间运行任务新增了控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：在你的应用运行函数或自定义工具时，让模型继续工作，然后在结果可用时返回它们。
- [回合中引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行中通过 WebSockets 发送额外的指令，以便模型能够纳入更正或变化的需求。
- [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，对困难任务提高强度，或对例行后续任务降低强度。

### Sep 2

更新

更新了 API 错误，使应用能够区分流量增长过快和暂时性的模型过载。

流量增长过快可能会返回带有 `429` 错误码的 `slow_down` 错误。暂时性的模型过载会返回带有 `503` 错误码的 `server_is_overloaded` 错误码的响应。两种响应都可能包含 `Retry-After`。当响应头存在时，至少等待其指定的时间后再重试。如果缺失，请使用指数退避策略。参见 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### 9 月 1 日

更新

到 `api.openai.com` 的连接现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 已面向 OpenAI API 正式发布。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，并通过组织的角色与权限控制访问。

### 8 月 26 日

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [transcription guide](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026 年 8 月 26 日停用。请迁移到 Responses API 以及 Conversations API，使用 [migration guide](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用来自 Global 地理位置项目的 API 密钥并加上前缀域名，为单个请求选择区域处理。现有的资格、数据保留控制、端点和模型支持要求仍然适用。在下方了解更多信息： [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现已调整为每百万输入 token 4 美元、每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续至 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上查看。追踪缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的分布情况，以了解缓存效率并识别改进机会。可按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景功能现已在以下功能中提供预览版： `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 以及 Responses API 图像生成工具中。设置 `background` 以 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。详细了解请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式，这是 GPT-5.6 Sol 的全新 API 服务层级，速度最高可达 Standard 处理的 14 倍。目前面向部分客户提供限量预览。注册以接收 Ultrafast 模式的最新动态 [此处](https://openai.com/form/ultrafast/).

### 8 月 7 日

特性 · 模型：gpt-5.6-cyber · 模型：gpt-daybreak-red-latest · 模型：gpt-daybreak-blue-latest · API：v1/responses

Daybreak 现为已获授权的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。可在明确授权的委托中，将它们用于从安全发现到经过验证的修复这一过程。

大多数防御性安全工作请从 Daybreak Blue 开始。它提供对通用模型（如 GPT-5.6 Sol）的访问，可用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。了解更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供经另行审批的访问权限，可使用专为相关任务训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已获授权的漏洞复现、利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要另行审批和配置。你可以申请加入 Daybreak 项目 [此处](https://openai.com/daybreak/)。有关定价的更多详情 [此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

更新了 **chat-latest** 快照，该快照指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 进行生产 API 调用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 8 月 5 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

Fast 模式现在为 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 提供长上下文请求支持。从今天起，超过 272K token 的长上下文提示词可在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，下运行，速度比 Standard 档位最高快 2.5×。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在“用量与成本”面板中按 API 键对数据进行筛选和分组 [用量与成本面板](https://platform.openai.com/settings/organization/usage)。 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API key 维度，用于程序化报告与分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

从 7 月 30 日起，GPT-5.6 Luna 的费用降低 80%，GPT-5.6 Terra 的费用降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) ，该功能已在 API 中推出，取代了原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现在以两倍的价格提供最高 2.5 倍于标准处理的速度。此更改向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

正式发布 [OpenAI Terraform 提供商](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API 平台资源以基础设施即代码的方式进行管理。

配置和管理项目、用户、群组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审阅和应用更改、导入现有资源，以及检测和协调配置漂移。可从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转录以及已提交 Realtime 轮次的最终转录文本，配合 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 实现低延迟流式转录。

两个模型都支持自由形式的转录上下文、关键词提示以及多种预期的输入语言。可在 [transcription guide](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出限制。可设置月度上限，当追踪到的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。使用支出告警可在流量中断前收到通知。详情请参阅 [支出限制指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

特性 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6),包括用于前沿能力的 GPT-5.6 Sol、用于在智能与成本之间取得平衡的 GPT-5.6 Terra,以及面向高效大规模工作负载的 GPT-5.6 Luna。该 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式的提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理, `max` 推理强度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [Responses API 中处于测试阶段的多智能体编排](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像,并提供 `original` 或 `auto` 图像细节参数。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，在字母数字识别、静音与噪声处理以及打断行为方面有所改进。同时发布 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款面向实时语音应用的更快、成本更低的蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

更新了 `chat-latest` snapshot, which points to the latest Instant model currently used in ChatGPT. We recommend leveraging [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 进行生产 API 调用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月 23 日

功能

在 OpenAI API 平台上发布了 Safety Usage Dashboard。Safety 仪表板会根据 `safety_identifier` 请求中发送的用于识别最终用户的值来显示被拦截的 Responses 请求。请访问 [Safety 仪表板](https://platform.openai.com/usage/safety).

### Jun 9

功能 · API：v1/responses

网页搜索现在可以与常规文本结果一同返回图片结果。当你的应用需要当前或基于网络的视觉内容（例如商品照片、地标、地点、事件或视觉参考）时，可以使用图片搜索。详情请参阅 [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### 6月4日

Feature · Model：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 添加审核分数。在生成请求中传入 `moderation` 对象后，你将在同一次响应中收到模型输入与生成输出两者的审核结果。

了解更多，请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月3日

更新

宣布了可复用提示对象、Evals 平台以及智能体 Builder 的弃用计划。详见 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费（最低 5 分钟），不再按完整的 20 分钟会话费率计费。底层每分钟费率保持不变。

此次更新旨在为较短会话提供更细粒度的计费，从而降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型: gpt-5.4 · 模型: gpt-5.5 · API: v1/responses

OpenAI 模型现已通过兼容 OpenAI 的 Responses API 端点在 Amazon Bedrock 中可用。受支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026年5月

### 5月29日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而非 `in_memory`，默认启用扩展的提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · 模型：chat-latest

发布 `chat-latest` 快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 进行生产 API 调用，但你也可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation). 可信工作负载可以使用外部签发的身份令牌换取短期 OpenAI 访问令牌，而无需存储长期 API 密钥。

### May 26

更新

新增了 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型许可列表、数据保留设置以及 托管工具 权限，并支持查询细粒度的计费明细项。

### 5 月 19 日

功能

发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) for enterprise customers. Secure MCP Tunnel lets supported OpenAI products including ChatGPT web, Codex, Responses API, and AgentKit connect to private or on-prem MCP servers through a customer-hosted `tunnel-client` without exposing those servers to the public internet.

### 5 月 19 日

更新

你现在可以管理多个 IP 白名单，并在项目级别或整个组织范围内应用每个白名单。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5 月 12 日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026 年 5 月 12 日在 API 中弃用并移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 来代替。

Realtime API Beta 已于 2026 年 5 月 12 日在 API 中弃用并移除。如果你仍在使用 Beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 和完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5 月 11 日

功能 · API：v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可为高强度研究与评测负载启用更长的 GPT-5+ 推理 网页搜索 运行。

### 5月 7 日

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款全新的实时语音模型，支持面向语音到语音智能体的可配置推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

更新了 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专用的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 用于流式转录，并将实时提示词指导移至 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### 5月 7 日

功能

已发布 [OpenAI Developers Codex 插件](https://developers.openai.com/learn/developers-codex-plugin)。借助 OpenAI Platform 访问权限和 OpenAI API 配置指导，帮助你在 Codex 中构建 AI 应用和智能体。

### May 6

更新

更新后的 Agents SDK 现已支持 TypeScript，并内置对沙箱智能体的支持以及一个开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

发布 `chat-latest` 快照指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境 API 使用，但你可以使用此模型来测试我们在聊天场景下的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月 4日

更新

管理 API 现已在适用于 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [管理 API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解安装说明和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的全新前沿模型，已在 Chat Completions 和 Responses API 中推出，并发布 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) 用于 Responses API 请求中，以应对需要更多算力的更困难问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP，以及 网页搜索。关键更新包括：
- 推理工作量现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展提示缓存，不支持内存提示缓存。
了解更多 [请点击此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成和编辑的最先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，可享 50% 折扣。

### Apr 15

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 新增功能，包括：
- 在受控沙盒中运行 智能体；
- 检查并定制开源 harness；以及
- 控制记忆的创建时机和存储位置。

## 2026 年 3 月

### 3 月 17 日

功能 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) ，包括 Chat Completions 与 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到一款更快、更高效的模型中，适用于大规模调用场景；而 GPT-5.4 nano 则针对追求极致速度和成本的简单大规模任务进行了优化。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) 指向当前在 ChatGPT 中使用的最新模型的 slug。

### 3月13日

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了图像编码器，以修复一个与 `input_image` GPT-5.4 输入相关的小错误。部分图像理解场景的质量可能因此有所提升，无需任何额外操作。

### 3 月 12 日

功能 · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

扩展了 Sora API，新增可复用的角色引用，最长生成时长可达 `20` 秒， `1080p` 分辨率输出， `sora-2-pro`、视频扩展功能，以及 Batch API 对 `POST /v1/videos`. `1080p` 生成任务的支持， `sora-2-pro` 按 `$0.70` 每秒计费。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑已有视频。这将取代 `POST /v1/videos/{video_id}/remix`，后者将在 `6` 个月后弃用。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们面向专业工作的最新前沿模型，已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于受益于更多算力的更棘手问题。

同步发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，让模型在运行时再延迟加载大型工具列表，从而降低 token 使用量、保持缓存性能，并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中提供 `computer` 基于截图的 UI 交互工具。
- 支持 1M token 的上下文窗口，以及原生的 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，适用于运行时间更长的 智能体 工作流。

### Mar 3

特性 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展了 `input_file` 对 Responses API 的支持，以接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

发布 `phase` 至 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

发布 `gpt-5.3-codex` 至 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2 月 23 日

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2 月 23 日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · Model: gpt-5.2-chat-latest

更新了 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) 指向当前在 ChatGPT 中使用的最新模型的 slug。

### 2 月 10 日

功能 · API：v1/responses

已推出 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能（位于 Responses API）。

### 2 月 10 日

功能 · API：v1/responses

已在 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) Responses API 中推出 Skills 支持，同时支持本地执行和基于托管容器的执行。

### 2 月 10 日

功能 · API：v1/responses

已推出新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### 2月 9日

特性 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/images/edits

新增对 `application/json` 请求的支持， `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`），配合 `image_url` 或 `file_id` 引用，而非 multipart 上传。

### 2 月 3 日

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升了约 40%。模型与模型权重保持不变。

## January, 2026

### Jan 15

公告

已发布 [Open Responses](https://www.openresponses.org/)：一个用于构建多提供商、可互操作的 LLM 接口的开源规范，基于原始的 OpenAI Responses API 构建。

### Jan 14

功能 · 模型：gpt-5.2-codex · API: v1/responses

发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是为 Codex 或类似环境中的智能体编码任务优化的 GPT-5.2 版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API: v1/realtime

为 Realtime API 新增了专用 SIP IP 段。 `sip.api.openai.com` 会进行 GeoIP 路由，并将 SIP 流量导向最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新了 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 已指向 2025-12-15 快照。如果需要使用模型快照，使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

更新了 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 已指向 `sora-2-2025-12-08`。如果需要使用模型快照，使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 已指向 `2025-12-15` 快照。如果需要使用模型快照，使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前建议使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

修复了以下问题： `gpt-image-1.5` 和 `chatgpt-image-latest` 此前在通过 `/v1/images/edits`，进行图像编辑时错误地使用了高保真，即使 `fidelity` 被显式设置为 `low` (默认值)。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

Feature · Model: gpt-image-1.5 · Model: chatgpt-image-latest

发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。阅读更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12月15日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个带日期的新音频快照。这些更新为实时语音驱动的应用带来了可靠性、质量和语音保真度的改进。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，面向符合条件的客户。

### Dec 11

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API：v1/responses · API：v1/chat/completions

发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，它是 GPT-5 模型系列中全新的旗舰模型。GPT-5.2 在以下方面相较于之前的 GPT-5.1 有改进：
- 通用智能
- 指令遵循
- 准确性和 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 工具调用与 API 中的上下文管理
- 电子表格的理解与创建。

5.2 的新内容是一个新的 xhigh 推理力度等级、简洁的推理摘要，以及使用压缩的全新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 的长时间运行的对话，你可以使用 `/responses/compact` 端点来压缩你在每一轮发送的上下文。

### Dec 4

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长周期、智能体编码任务而优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API: v1/realtime

在 Realtime API 中新增了对 DTMF 按键的支持。你现在可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 以获取更多信息。

### Nov 13

Feature · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1), GPT-5 模型家族中最新旗舰模型。GPT-5.1 在以下方面经过专门训练，表现尤为出色：

- 在无需大量思考时可引导响应方向并更快回复
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` 推理设置，以便在所需思考更少时获得更快的响应——这与 GPT-5 中之前的 `medium` 默认设置不同。

### Nov 13

功能

发布 [增强型基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 让你可以决定组织内和各项目中谁能执行哪些操作——无论是通过 API 还是在 Dashboard 中。

### Nov 13

特性 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 针对 Codex 或类似环境中智能体编码任务优化的版本。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

发布 [扩展提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展提示缓存保留使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。扩展提示缓存的工作原理是：在内存已满时将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025年10月

### 10月29日

Feature · Model: gpt-oss-safeguard-120b · Model: gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). 企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对 OpenAI 上的客户内容进行加密。

### Oct 24

功能

发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### Oct 6

Feature · Model: gpt-5-pro · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-image-1-mini · Model: sora-2 · Model: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在以下活动上发布了多项新功能 [OpenAI DevDay](https://openai.com/devday/):

发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，这是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，通过更多算力进行更深度的思考，从而提供始终更优的答案。

发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音到语音性能。

发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) 以实现更具性价比的图像生成与编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) 通过我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，获得丰富、细腻、富有动感的视频生成与重混能力。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) 以可视化方式创建自定义的多智能体工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已推出 [服务健康仪表盘](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能可将 API 访问限制为你指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增支持将图片和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### Sep 23

特性 · 模型：gpt-5-codex · API：v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，为配合 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API: v1/realtime

OpenAI Realtime API 现已正式发布。在我们的 Realtime API 指南中了解更多 [请参阅 Realtime 接口 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 封装，适用于 Google 应用、Dropbox 等流行服务，可用于授予模型对这些服务中存储的数据的读取权限。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，它允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [migration guide](https://developers.openai.com/api/docs/assistants/migration) 以查看对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8 月 7 日

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort（推理力度）](https://developers.openai.com/api/docs/guides/reasoning) 取值，以便在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [tool call（工具调用）](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入以及从模型输出自由格式的内容。

## 2025 年 6 月

### 6 月 27 日

功能

已在 [Priority processing](https://platform.openai.com/docs/guides/priority-processing). Priority processing 相比 Standard processing 可显著降低延迟并保持更稳定，同时保留按量付费的灵活性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。详细了解请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对异步事件处理的支持， [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [调整并简化了定价](https://developers.openai.com/api/docs/pricing) 适用于 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[全新可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台和 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现在可以通过 `prompt` 参数（配合提示词 `id`，可选 `version`）引用在控制台创建的模板，并提供动态 `variables` ，其中可包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，该模型的版本 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### 6月4日

功能 · API：v1/fine_tuning

新增对以下模型进行微调的支持 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 的模型 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月3日

功能 · API：v1/chat/completions · API：v1/realtime

以下模型的新快照已可用 [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布 [Agents SDK 的 TypeScript 版本](https://openai.github.io/openai-agents-js).

## 2025年5月

### 5月20日

功能 · API：v1/responses

在 Responses API 中新增了对内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5月20日

特性 · API：v1/responses · API：v1/chat/completions

新增了对以下功能的支持 `strict` 在使用非微调模型进行并行工具调用时使用的工具 schema 模式。
新增了 [schema 特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对以下内容的字符串校验： `email` 以及其他模式，并为数字和数组指定范围。

### 5月15日

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，为以下场景进行了优化 [Codex CLI](https://github.com/openai/codex).

### 5月 7 日

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已在 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning). 了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已在 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API：v1/images/generations · API：v1/images/edits

新增了一个图像生成模型， `gpt-image-1`。该模型为图像生成树立了新的标准，在质量和指令遵循方面都有所提升。

更新了图像生成和编辑接口，以支持该 `gpt-image-1` 模型特有的新参数。

### 4 月 16 日

功能 · API：v1/chat/completions · API：v1/responses

新增了两个 o 系列推理模型， `o3` 和 `o4-mini`。它们为数学、科学、编程、视觉推理任务以及技术写作树立了新标准。

推出了 Codex，我们的代码生成 CLI 工具。

### Apr 14

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入到 API。这些新模型在指令遵循、编码能力以及上下文窗口（最大可达 100 万 tokens）方面均有提升。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。同时宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型已迁移至 Audio API。

### Mar 19

功能 · 模型：o1-pro · API：v1/responses · API：v1/batch

发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，该模型的版本 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型使用更多算力来回答难题，具有更好的推理能力和一致性。

### Mar 11

Feature · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了几款新模型和工具，以及一个新的用于智能体工作流的 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计于 2026 年下线（在实现完全功能对等之后）。

### Mar 3

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 字段对微调作业的支持。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 GPT-4.5 的研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——迄今为止我们最大、最强大的对话模型。GPT-4.5 拥有更高的“情商”（EQ）和对用户意图的理解能力，在创意任务和智能体规划方面表现更出色。

### 2 月 25 日

功能

推出了 [API 使用情况仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此更新响应了关于新增数据筛选器（例如项目选择、日期选择器和细粒度时间区间）的需求。同时更好地支持跨不同产品和服务层级查看用量。

### Feb 5

功能

在欧洲推出数据驻留功能。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一款全新小型推理模型，针对科学、数学和编码任务进行了优化。

### Jan 21

Feature · Model: o1

扩展对 [o1 model](https://platform.openai.com/docs/models/o1)。o1 系列模型通过强化学习训练，能够执行复杂的推理。

## 2024 年 12 月

### 12 月 18 日

功能

已推出 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，允许客户以编程方式轮换其管理 接口 密钥。

Updated [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，允许客户在用户被邀请加入组织的同时，以编程方式邀请用户加入项目。

### 12月17日

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增以下模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 Realtime API 新增 WebRTC 连接方式 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) ，适用于 o1 模型。

新增 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) ，适用于 o1 模型。注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下技术的偏好微调： [直接偏好优化 (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出适用于 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 支持，新增于 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已推出 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 的活动与支出。

## November, 2024

### 11 月 20 日

更新 · API: v1/chat/completions

发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### 11月4日

特性 · API: v1/chat/completions

发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，可在响应的大部分内容事先已知的情况下显著降低模型响应的延迟。这在仅对文档和代码文件的内容进行少量修改后重新生成时最为常见。

## 2024 年 10 月

### 10 月 30 日

功能 · Model: gpt-4o-realtime-preview · Model: gpt-4o-audio-preview · API: v1/chat/completions

在 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### Oct 17

Feature · Model: gpt-4o-audio-preview · API: v1/chat/completions

发布 [新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) ：用于 Chat Completions，同时支持音频输入和输出。它使用与 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

Feature · API: v1/realtime · API: v1/chat/completions · API: v1/fine_tuning

在以下活动上发布了多项新功能 [OpenAI 旧金山 DevDay](https://openai.com/devday/):

[Realtime 接口](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在应用中构建快速的语音交互体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用大型前沿模型的输出微调出高性价比模型的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本微调 GPT-4o，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近出现过的输入 token 提供折扣和更快的处理速度。

[在 Playground 中生成](https://developers.openai.com/chat/edit)：在 Playground 中使用 Generate 按钮轻松生成提示、函数定义和结构化输出架构。

## September, 2024

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

发布 [新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（部分类别），支持两个仅文本的新型危害类别，并且具有更准确的评分。

### Sep 12

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这些是经过强化学习训练、用于执行复杂推理任务的新型大语言模型。

## August, 2024

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### Aug 15

更新 · 模型：gpt-4o · API：v1/chat/completions

发布 [用于的动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在可以可靠地遵循开发者提供的 JSON Schema。

发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### Aug 1

更新

已推出 [管理和审计日志 APIs](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控更改。审计日志记录必须在 [settings](https://platform.openai.com/settings/organization/general).

## July, 2024

### Jul 24

更新

已推出 [self-serve SSO configuration](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers),允许使用自定义和无限额计费的 Enterprise 客户针对其所需的 IDP 设置身份验证。

### 7 月 23 日

更新

已推出 [GPT-4o mini 的微调](https://developers.openai.com/api/docs/guides/model-optimization)，在特定用例下实现更高的性能。

### 7 月 18 日

更新

发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)，我们价格亲民的智能小模型，适用于快速、轻量级的任务。

### 7月17日

更新

发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以通过传递参数在 Chat Completions 和 Assistants API 中禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### 6月3日

更新

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024年5月

### 5月15日

更新

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者可以访问此功能。

新增对 [设置费用限制](https://platform.openai.com/settings/organization/general) ，按项目为按量付费客户提供。

### 5月 13 日

更新

发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) in the API. GPT-4o is our fastest and most affordable flagship model.

### 5月 9 日

更新

新增对 [向 Assistants API 发送的图像输入。](https://developers.openai.com/api/docs/assistants/migration)

### 5月 7 日

更新

新增对 [向 Batch API 提交微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数添加到 Chat Completions 和 Completions API 中。设置该参数后，开发者在使用流式传输时可以访问用量统计信息。

### 5 月 2 日

更新

新增 [新接口](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中删除线程里的消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API 中。

新增了 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型的支持](https://developers.openai.com/api/docs/guides/batch#model-availability)

### 4月 17日

更新

推出了一系列 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) ，更新，包括一个新的 文件搜索 工具，允许每个助手最多处理 10,000 个文件，新增 token 控制功能，并支持工具选择。

### 4 月 16 日

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) ，用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目分别管理速率和成本限额（成本限额仅对企业客户可用）。

### Apr 15

更新

发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4月 9 日

更新

发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 全面上线于 API

### Apr 4

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [在创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 筛选 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### 2月 9日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## January, 2024

### Jan 25

更新

发布了 Embedding V3 模型以及更新的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 至 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 以在 Assistants API 中运行创建

### 12月15日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 传递到 Chat Completions API

### Dec 14

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 参数，以允许工具调用中的实参可选

## 2023 年 11 月

### 11 月 30 日

更新

发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新后的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [改用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 至 Embeddings API

新增 `max_tokens` 到 [审核模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### Oct 6

更新

新增 [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
