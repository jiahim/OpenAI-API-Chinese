# 更新日志

> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

> 涵盖 OpenAI API 的最新功能与更新。

即将弃用的项目列在 [弃用页面](/api/docs/deprecations).

## 2026 年 10 月

### 10 月 7 日

更新 · 模型：chat-latest

更新了 **chat-latest** 快照，它指向 ChatGPT 上面向 Plus、Pro、Business 和 Enterprise 用户的最新模型。我们建议将 [GPT-6 模型系列](https://developers.openai.com/api/docs/guides/latest-model) 用于正式 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/chat-latest).

### 10月6日

功能 · 模型：gpt-6-luna · API：v1/decisions

已发布 [Decisions API](https://developers.openai.com/api/docs/guides/decisions) ，目前为测试版，相较于 Responses API，可将文本和图像转换为类型化答案，速度提升 10 倍 `gpt-6-luna`。Turn text and images into typed answers 10x faster than the 响应接口.

### 10月6日

更新

将 API 使用层级从五档简化为三档：Build、Launch 和 Grow。当组织的累计信用额度购买量达到层级最低限额时，将自动升级。详见 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) ，了解每月使用限额以及如何查看每个模型的速率限制。

### Oct 5

功能

在 API 中新增了用于 HIPAA 合规支持的in-product 流程 [组织设置 > 常规](https://platform.openai.com/settings/organization/general)。符合条件的组织的管理员现在可以接受标准的商业伙伴协议 (BAA)，并为其组织启用 HIPAA 合规支持。请参阅 [帮助中心](https://help.openai.com/en/articles/8660679-getting-a-business-associate-agreement-for-the-openai-api) 以了解资格、覆盖服务以及配置要求。

## 2026 年 9 月

### 9 月 29 日

功能

新增 [computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) 到 智能体 API。智能体 可以在 OpenAI 托管的浏览器中完成任务，网站访问审批和登录由你的应用处理。

### 9 月 29 日

功能 · 模型：gpt-6.1-sol · API：v1/responses · API：v1/chat/completions

发布 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (`gpt-6.1-sol`），以低于 GPT-6 Astra 的成本完成复杂编程和专业工作。

对于最多 272K 输入 token 的提示，每 1M token 的标准价格为：输入 $2，缓存输入 $0.10，缓存写入 $2.50，输出 $10。

GPT-6.1 Sol 还支持 [Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) （测试版）。让模型在一次 Responses API 请求中把工作委派给子智能体。

使用 Responses API 进行工具调用。详见 [GPT-6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6-astra#gpt-61-sol) 了解推理设置，以及 [定价](https://developers.openai.com/api/docs/pricing) 中可用的处理层级。

### 9 月 29 日

功能 · 模型：gpt-6-astra · API：v1/responses

新增 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) ，适用于 Responses API 中的 GPT-6 Astra。使用 `gpt-6-astra` 配合 `service_tier: "ultrafast"` 以缩短生成输出 token 之间的时间。它面向 API 客户提供，受速率限制，并采用全球处理与US数据驻留。不支持 EU 及其他区域推理驻留。参见 [极速定价](https://developers.openai.com/api/docs/pricing?latest-pricing=ultrafast).

### Sep 25

修复 · 模型: gpt-6-sol · 模型: gpt-6-luna

修复了影响以下模型图像理解的图像编码缺陷 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)。此次更新改进了 API 和 Codex 中视觉任务的结果，包括计算机使用。

如果你的用例涉及图像输入，建议重新运行评估，并重试受该问题影响的工作流。

### 9 月 22 日

Feature · Model: gpt-6-sol · Model: gpt-6-luna · API: v1/responses · API: v1/chat/completions

发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`) 和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions API 生成文本。

每 1M tokens 的标准定价，输入 tokens 最多为 272K 的提示：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 以了解缓存写入、更长的提示和其他处理层级。

### Sep 15

功能

在组织级和项目级新增了 API 密钥创建治理控制。管理员可以仅允许服务账户密钥、仅允许用户拥有的项目密钥，或禁用所有新的 API 密钥创建。组织级限制优先于项目设置，现有 API 密钥不受影响。详情请参阅 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### 9月 10日

功能

你现在可以在创建项目 API 密钥时设置过期日期。管理员还可以在 Platform 设置中的组织或项目层级强制设置最长密钥有效期，要求新创建的密钥必须在配置的期限内过期。参见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 了解密钥过期与轮换的指导。

### 9月 10日

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 已进入公开测试版。使用托管的 Codex harness 构建 智能体，同时由 OpenAI 处理会话编排、上下文压缩和恢复。

使用持久化会话跨轮次继续工作、流式输出进度，并接入你自己的工具和 MCP 服务器。在 OpenAI 托管的沙箱中运行 智能体，或连接来自你自己的基础设施或受支持提供商的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### 9月 10日

特性 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 已在 API 中正式发布。构建可在后端模型或 智能体 处理推理和工具调用的同时持续进行的语音会话。

使用 Responses 委托接入一个 OpenAI 模型，或使用客户端委托连接你自己的后端。语音会话费用为每分钟 0.05 美元，按秒计费；后端模型和工具调用另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。开始。参见 [定价](https://developers.openai.com/api/docs/pricing) 。

### Sep 8

功能 · API: v1/responses

[提示缓存诊断](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 已在 Responses API 中面向 GPT-5.6 及更高版本的受支持模型正式发布。

将缓存复用情况与先前响应进行对比，找出缓存未命中的原因，并参考故障排查指南提升缓存复用率。

### Sep 8

功能 · 模型: gpt-image-2.5-sunburst · 模型: gpt-image-2.5-flare · API: v1/images · API: v1/responses

发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) 通过 Image API 和 Responses API 图像生成工具进行图像生成与编辑。

在编辑精度至关重要的场景中使用 Sunburst，或在需要快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 计费。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### Sep 8

功能 · 模型: gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）已通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已获批准的生命科学内部研究正式发布。

标准价格为输入 token 每 1M $5、缓存输入 token 每 1M $0.50、输出 token 每 1M $25。计费自 2026 年 10 月 5 日开始。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### 9月3日

功能 · 模型:gpt-6-astra · API:v1/responses · API:v1/chat/completions

发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra),我们能力最强的模型，专为最困难的端到端任务打造。

将 GPT-6 Astra 用于推理、编码、计算机使用、研究和文档创建。它结合这些能力，将复杂的任务从初始请求推进到最终结果，过程中使用你提供的上下文和工具。

迁移时需要考虑的关键变更:

- GPT-6 Astra 不支持设置 `none` 推理力度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果使用 Chat Completions 调用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [偏差监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，对 智能体 工作期间可能出现的问题进行异步检查。这些检查可以触发安全提醒或暂停对话以便审核。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解其能力、提示方法和迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 用于浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### 9月3日

功能 · API: v1/responses

在 Responses API 中新增了使用 GPT-6 Astra 处理长时间运行任务的控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让模型在你的应用运函数或自定义工具时继续工作，然后在结果就绪后将其返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行期间通过 WebSockets 发送额外指令，让模型能够融入修正或变更后的需求。
- [在对话中途调整推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，为困难任务提高强度，或为常规后续任务降低强度。

### 9月 2日

更新

已更新 API 错误，以便应用能够区分流量增长过快与临时性的模型过载。

流量增长过快时会返回包含 `429` 错误码的 `slow_down` 错误。临时性的模型过载则返回包含 `503` 错误码的 `server_is_overloaded` 错误码的响应。两种响应都可能包含 `Retry-After`。当响应头存在时，重试前至少等待其指定的时长；若缺失，请采用指数退避策略。详见 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

到 `api.openai.com` 的连接现在可以使用 IPv6。

## 2026年8月

### 8月29日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已面向 OpenAI API 全面开放。直接在 [Platform console](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，访问权限由你所在组织的角色和权限控制。

### Aug 26

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027/02/26 下线。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 将于 2026 年 8 月 26 日停用。请使用 Responses API 和 Conversations API 迁移到 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### 8月21日

功能

API 客户现在可以通过使用带有前缀域的 API 密钥并选择来自 Global 地域项目的密钥，为单个请求选择区域处理。现有资格、数据留存控制、端点和模型支持要求仍然适用。更多信息请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### 8月21日

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现已调整为每百万输入 token 4 美元、每百万输出 token 20 美元，相比之前输入价格降低 20%、输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。随时间追踪你的缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的细分情况，以了解缓存效率并识别改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在预览版中可用于 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 的 Images API 以及 Responses API 图像生成工具。设置 `background` 为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多，请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式，这是一项面向 GPT-5.6 Sol 的全新 API 服务层级，速度最高可达 Standard 处理的 14 倍。目前仅向特定客户提供限量预览。注册以接收 Ultrafast 模式的最新动态 [请参阅此处](https://openai.com/form/ultrafast/).

### Aug 7

Feature · Model: gpt-5.6-cyber · Model: gpt-daybreak-red-latest · Model: gpt-daybreak-blue-latest · API: v1/responses

Daybreak 现在为已获批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。使用它们在明确授权的任务中从安全发现推进到经验证的修复。

大多数防御性安全工作从 Daybreak Blue 开始。它提供对通用模型（例如 GPT-5.6 Sol）的访问，用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。阅读更多 [请参阅此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独获批的访问权限，可使用专门训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于已授权的漏洞复现、利用验证、渗透测试、红队行动以及复杂系统分析。

这些模型需要单独的审批与配置。你可以申请加入 Daybreak 项目 [请参阅此处](https://openai.com/daybreak/)。有关定价的更多详情 [请参阅此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

更新了 **chat-latest** 快照，指向 ChatGPT Plus 和 Pro 用户可用的最新模型。我们建议利用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于正式 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现已在 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 上支持长上下文请求。截至今天，超过 272K tokens 的长上下文提示可在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度最高可达标准层的 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [Usage and Costs 仪表板](https://platform.openai.com/settings/organization/usage)。中按 API key 过滤和分组数据。API [接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [Costs API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 也支持 API key 维度，用于编程化报告与分析。

## 2026 年 7 月

### 7 月 30 日

Update · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的成本下降 80%，GPT-5.6 Terra 的成本下降 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 功能，作为原 Priority Processing 服务的替代方案，适用于 API。对于 GPT-5.6 Sol，Fast 模式的速度现在最高可达标准处理的 2.5 倍，相应价格为标准处理的 2 倍。此变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API 平台资源作为基础设施即代码进行管理。

配置和管理项目、用户、组、角色、访问分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用更改、导入现有资源，以及检测和协调配置漂移。从以下位置安装提供程序： [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### 7 月 28 日

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转写以及已提交 Realtime 轮次的最终转写文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转写。

两个模型均支持自由形式的转写上下文、关键词提示和多种预期输入语言。在以下页面中比较支持的输出与工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7月22日

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出上限。设置每月上限，当跟踪到的支出达到该上限时，受影响的 API 请求将返回错误。 `429` 使用支出提醒可在流量被中断之前收到通知。更多信息请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

功能 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于平衡智能与成本的 GPT-5.6 Terra，以及用于高效大规模工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增了 [编程式工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理力度以及 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [智能体多智能体编排功能已在 Responses API 中进入测试阶段](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还可以接受原始尺寸的图像，并使用 `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具有改进的字母数字识别、静音与噪声处理以及打断行为。同时发布的还有 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，这是一款更快、成本更低的实时语音应用蒸馏推理模型。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

更新了 `chat-latest` snapshot，指向当前在 ChatGPT 中使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于正式 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/chat-latest).

### 6月 23 日

功能

在 OpenAI API 平台上发布了安全使用仪表板。安全仪表板根据 `safety_identifier` 请求中发送的用于识别最终用户的值来展示被拦截的 Responses 请求。请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### 6月9日

功能 · API: v1/responses

网页搜索现在可以在返回常规文本结果的同时返回图像结果。当你的应用需要基于当前或网络来源的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，可使用图像搜索。详情请参阅 [网页搜索 guide](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，请访问 [请参阅此处](https://platform.openai.com/login).

### Jun 4

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 添加审核分数。在生成请求中传入 `moderation` 对象，即可在同一次响应中获取模型输入和生成输出的审核分值。

更多信息请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Jun 3

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体构建器。详见 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以获取停用时间表与迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按每分钟计费，且最低计费时长为 5 分钟，而不是按完整的 20 分钟会话费率计费。底层的每分钟费率将保持不变。

此次更新旨在让较短会话的计费更加精细，并将降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前内置工具的价格](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

功能 · 模型：gpt-5.4 · 模型：gpt-5.5 · API：v1/responses

OpenAI 模型现已在 Amazon Bedrock 中通过兼容 OpenAI 的 Responses API 端点提供。受支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` ，而不是 `in_memory`，默认启用扩展提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

发布 `chat-latest` 指向当前 ChatGPT 中使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于正式 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

发布 [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation). 受信任的工作负载可以将外部颁发的身份令牌交换为短时 OpenAI 访问令牌，而无需存储长期 API 密钥。

### May 26

更新

新增了 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置以及 托管工具 权限，并查询细粒度的计费明细项。

### May 19

功能

发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 允许包括 ChatGPT web、Codex、Responses API 以及 AgentKit 在内的受支持 OpenAI 产品通过客户自托管的 `tunnel-client` 隧道连接到私有或本地部署的 MCP 服务器，而无需将这些服务器暴露给公共互联网。

### May 19

更新

现在你可以管理多个 IP 允许列表，并将每个列表应用于项目级别或整个组织。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### 5月12日

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照以及 Realtime API 公开测试版。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 被弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API 公开测试版已于 2026-05-12 被弃用并从 API 中移除。如果你仍在使用测试版接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### May 11

功能 · API: v1/responses

新增 `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以为高投入研究和评估工作负载开启更长的 GPT-5+ 推理 网页搜索 运行。

### 5月7日

特性 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款面向语音到语音 智能体 的全新实时语音模型，支持可配置的推理，以及 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

更新了 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 以处理流式转录，并将实时提示词指导移至 [使用实时模型](https://developers.openai.com/api/docs/guides/voice-prompting).

### 5月7日

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。这可以帮助你在 Codex 中构建 AI 应用和 智能体，并获取 OpenAI Platform 访问权限以及 OpenAI API 配置指导。

### May 6

更新

更新后的 Agents SDK 现已支持 TypeScript，并内置对沙箱 智能体 的支持以及一个开源 harness。了解更多 [请参阅此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

发布 `chat-latest` 指向当前 ChatGPT 中使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用，但你可以使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照会定期更新。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

更新

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置说明和示例。

## 2026 年 4 月

### 4 月 24 日

特性 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的全新前沿模型，已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) ，用于 Responses API 请求，以处理能从更多算力中受益的更棘手问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置 computer use、托管 shell、apply patch、Skills、MCP 以及 网页搜索。主要更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展的提示缓存，不支持内存中的提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### Apr 21

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真度的图像输入、基于 token 的图像定价，以及 Batch API 支持，可享受 50% 的折扣。

### 4 月 15 日

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 并新增了以下功能：
- 在受控沙箱中运行 智能体；
- 检查并自定义开源 harness；以及
- 控制记忆的创建时机以及存储位置。

## 2026 年 3 月

### 3 月 17 日

Feature · Model: gpt-5.4-mini · Model: gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 至 Chat Completions 和 Responses API。GPT-5.4 mini 将 GPT-5.4 系列的能力带到了更快、更高效的模型上，适合高吞吐量工作负载，而 GPT-5.4 nano 则针对简单的高吞吐量任务进行了优化，在这些场景中速度和成本最为重要。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search)、内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持 compaction，但不支持 tool search 或 computer use。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) 指向 ChatGPT 当前使用的最新模型的 slug。

### Mar 13

修复 · 模型：gpt-5.4 · API：v1/responses · API：v1/chat/completions

更新了我们的图像编码器，修复了一个小问题，该问题与 `input_image` GPT-5.4 中的输入相关。部分图像理解用例现在可能会看到质量提升。无需任何操作。

### 3月12日

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用的角色参考、时长最长可达 `20` 秒的生成、 `1080p` 输出、视频扩展功能，以及支持 `sora-2-pro`，生成的 Batch API。 `POST /v1/videos`. `1080p` 生成按 `sora-2-pro` 每秒 `$0.70` 计费。了解更多信息 [请参阅此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3月12日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` 用于编辑现有视频。该功能将替代 `POST /v1/videos/{video_id}/remix`，该接口将于 `6` 个月后弃用。了解更多信息 [请参阅此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### Mar 5

特性 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，面向专业工作的最新前沿模型已上线 Responses API 和 Chat Completions，同时发布 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于可受益于更多算力的更复杂难题。

同步发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，模型可以将大型工具集合延迟到运行时再加载，从而降低 token 使用量、保持缓存性能，并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 通过 Responses API 在 GPT-5.4 中支持 `computer` 基于截图的 UI 交互工具。
- 100 万 token 上下文窗口以及原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持，适用于长时间运行的 智能体工作流。

### 3 月 3 日

功能 · 模型: gpt-5.3-chat-latest · API: v1/chat/completions · API: v1/responses

发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前正在使用的 GPT-5.3 Instant 快照。了解更多 [请参阅此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses

扩展了 `input_file` 对 Responses API 的支持，以接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [请参阅此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API: v1/responses

发布 `phase` 对 Responses API 的支持。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [请参阅此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

发布 `gpt-5.3-codex` 对 Responses API 的支持。阅读更多 [请参阅此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API: v1/responses

为 Responses API 推出 WebSocket 模式。了解更多 [请参阅此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [请参阅此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现在支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

Update · Model: gpt-5.2-chat-latest

更新了 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) 指向 ChatGPT 当前使用的最新模型的 slug。

### 2 月 10 日

功能 · API: v1/responses

已上线 [服务端 compaction](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) ，支持 Responses API。

### 2 月 10 日

功能 · API: v1/responses

已上线对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，现已在 Responses API 中提供。Skills 同时支持本地执行和基于托管容器的执行。

### 2 月 10 日

功能 · API: v1/responses

已上线全新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器内的网络访问。

### Feb 9

Feature · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

Added support for `application/json` requests on `/v1/images/edits` for GPT image models. JSON requests use `images` (and optional `mask`) with `image_url` 或 `file_id` references instead of multipart uploads.

### 2月3日

更新 · Model: gpt-5.2 · Model: gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型与模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/)：一个面向构建多提供商、可互操作 LLM 接口的开源规范，构建于原有的 OpenAI Responses API 之上。

### Jan 14

功能 · 模型：gpt-5.2-codex · API：v1/responses

发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 的一个版本，针对 Codex 或类似环境中的智能体编码任务进行了优化。了解更多 [请参阅此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 地址段。 `sip.api.openai.com` 执行 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新了 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 别名指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

更新了 [sora-2](https://platform.openai.com/docs/models/sora-2) 别名指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 别名指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前建议使用 `gpt-4o-mini-transcribe` 代替 `gpt-4o-transcribe` 以获得最佳效果。

### 1 月 9 日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，该问题中 `gpt-image-1.5` 和 `chatgpt-image-latest` 错误地在以下场景中对图像编辑使用了高保真模式： `/v1/images/edits`，即使在 `fidelity` 被显式设置为 `low` （默认值）时也是如此。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### Dec 16

Feature · Model: gpt-image-1.5 · Model: chatgpt-image-latest

发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。了解更多 [请参阅此处](https://platform.openai.com/docs/guides/image-generation).

### 12 月 15 日

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的提升。了解更多 [请参阅此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

此次发布还包括对 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 的支持，适用于符合条件的客户。

### 12月11日

功能 · 模型：gpt-5.2 · 模型：gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，这是 GPT-5 模型系列中最新一代的旗舰模型。GPT-5.2 在以下方面相较于前代 GPT-5.1 有显著改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新内容是一个新的 xhigh 推理努力程度、简洁的推理摘要和使用压缩的新增上下文管理。

### 12月11日

功能 · API: v1/responses/compact

发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 的长时间运行的对话，你可以使用 `/responses/compact` 端点来压缩你随每个回合发送的上下文。

### Dec 4

Feature · Model: gpt-5.1-codex-max · API: v1/responses

发布 `gpt-5.1-codex-max` to the Responses API。GPT-5.1-Codex 是我们最智能的编码模型，针对长时长的智能体编码任务进行了优化。了解更多 [请参阅此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

在 Realtime API 中新增了对 DTMF 按键事件的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [相关文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，这是 GPT-5 系列中最新的旗舰模型。GPT-5.1 经过专门训练，尤其擅长以下方面：

- 在无需大量思考时具备更强的可控性和更快的响应速度
- 代码生成与编码相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用一项新的 `none` 推理设置，以在所需思考较少时提供更快的响应——这与之前 GPT-5 中的 `medium` 默认设置不同。

### Nov 13

功能

发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定在你的组织和项目中谁能执行哪些操作——无论是通过 API 还是 Dashboard。

### Nov 13

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是 GPT-5.1 针对 Codex 或类似环境中的智能体编码任务优化的一个版本。了解更多 [请参阅此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留可使缓存的前缀保持更长时间，最长可达 24 小时。扩展的提示缓存通过在显存已满时将键/值张量卸载到 GPU 本地存储来工作，从而显著增加可用于缓存的存储容量。

## October, 2025

### Oct 29

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。阅读更多 [请参阅此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 可让你使用由你外部密钥管理系统 (KMS) 管理的密钥，在 OpenAI 加密你的客户内容。

### Oct 24

功能

发布 [UK data residency](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10月6日

特性 · 模型: gpt-5-pro · 模型: gpt-realtime-mini · 模型: gpt-audio-mini · 模型: gpt-image-1-mini · 模型: sora-2 · 模型: sora-2-pro · API: v1/responses · API: v1/batch · API: v1/chat/completions · API: v1/videos · API: v1/realtime · API: v1/images/generations

在以下活动发布了多项新特性 [OpenAI DevDay](https://openai.com/devday/):

发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是以下模型的 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的版本，使用更多算力进行更深入的思考，从而提供始终如一的更优答案。

发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，提供更具性价比的语音到语音性能。

发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，提供更具性价比的图像生成与编辑。

已上线 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，借助我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，实现丰富、细腻、动态的视频生成与再创作。

已上线 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) 用于可视化创建自定义多智能体工作流。

已上线 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

发布 [Trace Evals、Datasets 和 Prompt Optimization 工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已上线 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

发布 [IP 白名单](https://platform.openai.com/settings/organization/security/ip-allowlist)。IP 白名单功能仅允许你指定的 IP 地址或地址段访问 API。

## 2025 年 9 月

### 9 月 26 日

功能 · API: v1/responses

新增了对将图片和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中的支持。

### 9 月 23 日

Feature · Model: gpt-5-codex · API: v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，为配合 [Codex CLI](https://github.com/openai/codex).

## 2025年8月

### 8月28日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。在我们的 Realtime API 指南中了解更多 [指南](https://developers.openai.com/api/docs/guides/realtime).

### 8月21日

功能 · API: v1/responses

Added support for [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API 的连接器。连接器是 OpenAI 维护的 MCP 封装，用于 Google 应用、Dropbox 等流行服务，可让模型读取这些服务中存储的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，它允许你使用 Responses API 创建和管理长时间运行的对话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看并排对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 值，以便在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时使用自由格式的输入和输出。

## June, 2025

### Jun 27

功能

已上线对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing)。与标准处理相比，优先级处理可提供显著更低且更稳定的延迟，同时保持按量付费的灵活性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是 o 系列推理模型的深度研究变体，针对深度分析和研究任务进行了优化。详情请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化定价](https://developers.openai.com/api/docs/pricing) 对 网页搜索 工具的支持。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API: v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已可在控制台中使用，并且 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。通过 API，你现在可以通过 `prompt` 参数（传入一个提示词 `id`，可选的 `version`）并提供动态 `variables` ，其中可以包含字符串、图像或文件输入。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### Jun 10

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，该版本的 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### Jun 4

功能 · API: v1/fine_tuning

新增以下模型的微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) ，支持的模型包括 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### Jun 3

功能 · API：v1/chat/completions · API：v1/realtime

以下模型新增了模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API: v1/responses

在 Responses API 中新增对新的内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解更多关于工具的信息](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API：v1/responses · API：v1/chat/completions

新增支持使用 `strict` 工具架构的模式，配合未微调的模型使用并行工具调用时。
新增了 [架构功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 以及其他模式的字符串验证，并指定数字和数组的范围。

### May 15

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已上线 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) in the API, optimized for use with the [Codex CLI](https://github.com/openai/codex).

### 5月7日

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

已上线对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已上线对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

特性 · API：v1/images/generations · API：v1/images/edits

新增了一个图像生成模型， `gpt-image-1`。该模型为图像生成树立了新标准，具有更高的质量和指令遵循能力。

更新了图像生成和编辑接口，以支持该模型特有的新参数 `gpt-image-1` 。

### 4月16日

功能 · API：v1/chat/completions · API：v1/responses

新增两款全新的 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编程、视觉推理任务以及技术写作方面树立了全新标准。

推出 Codex，我们的代码生成命令行工具。

### Apr 14

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型已发布至 API。这些新模型在指令遵循、编码以及更大上下文窗口（最高可达 1M tokens）方面均有改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API: v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型至 Audio API。

### Mar 19

特性 · 模型：o1-pro · API：v1/responses · API：v1/batch

发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，该版本的 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型使用更多算力来回答难题，具有更好的推理能力和一致性。

### Mar 11

Feature · Model: gpt-4o-search-preview · Model: gpt-4o-mini-search-preview · Model: computer-use-preview · API: v1/chat/completions · API: v1/assistants · API: v1/responses

发布了多款新模型和工具，以及一个用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为Responses API发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布了新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 Assistants API [Assistants 接口](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易使用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，Assistants 预计将于 2026 年下线（在实现完全功能对等之后）。

### 3 月 3 日

功能 · API: v1/fine_tuning/jobs

新增 `metadata` 字段支持到微调任务。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览版——我们迄今为止最大且能力最强的聊天模型。GPT-4.5 具备高“情商”并能理解用户意图，使其在创意任务和智能体规划方面表现更佳。

### Feb 25

功能

推出了 [API 用量仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此次更新响应了添加更多数据筛选条件（例如项目选择、日期选择器和细粒度时间区间）的请求，并进一步支持跨不同产品和服务层级查看用量。

### Feb 5

功能

在欧洲推出数据驻留功能。了解更多 [请参阅此处](https://platform.openai.com/docs/guides/your-data).

## 2025 年 1 月

### 1 月 31 日

功能 · 模型: o3-mini · 模型: o3-mini-2025-01-31 · API: v1/chat/completions

已上线 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini),一个针对科学、数学和编码任务优化的小型推理模型。

### Jan 21

Feature · Model: o1

扩展了对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，可执行复杂推理。

## 2024年12月

### 12月18日

功能

已上线 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，允许客户以编程方式轮换其 admin api 密钥。

Updated [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，允许客户在被邀请加入组织的同时，以编程方式邀请用户加入项目。

### Dec 17

Feature · Model: o1 · Model: gpt-4o · Model: gpt-4o-mini · API: v1/fine_tuning · API: v1/chat/completions · API: v1/realtime

新增模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下 API 新增 WebRTC 连接方式 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` parameter](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) 以用于 o1 模型。

新增 [`developer` message role](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) 以用于 o1 模型。请注意 o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下方法的偏好微调 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出 Go 和 Java 的 beta SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

新增 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 支持 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已上线 [接口](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 各方面的活动和支出。

## November, 2024

### 11 月 20 日

更新 · API：v1/chat/completions

发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### Nov 4

功能 · API：v1/chat/completions

发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs)，可以大幅降低预先已知大部分响应内容的模型响应延迟。这种情况最常见于仅对文档和代码文件进行少量更改后重新生成内容时。

## 2024 年 10 月

### 10 月 30 日

Feature · Model: gpt-4o-realtime-preview · Model: gpt-4o-audio-preview · API: v1/chat/completions

在以下接口中新增了五种新的语音类型： [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10 月 17 日

特性 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

发布 [全新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 Chat Completions，支持音频输入和输出。与 [Realtime 接口](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

特性 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在以下活动发布了多项新特性 [OpenAI DevDay 旧金山](https://openai.com/devday/):

[Realtime 接口](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在你的应用中构建快速的语音转语音体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): 使用大型前沿模型的输出对成本效益更高的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision): 使用图像和文本对 GPT-4o 进行微调，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals): 创建并运行自定义评估，以衡量模型在特定任务上的性能。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching): 对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit): 使用 playground 中的生成按钮，轻松生成提示、函数定义和结构化输出架构。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

发布 [全新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它支持图像和文本（部分类别），新增两个仅限文本的危害类别，同时分数更准确。

### Sep 12

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，这些是通过强化学习训练、用于执行复杂推理任务的新型大语言模型。

## 2024 年 8 月

### 8月29日

功能 · API: v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API: v1/fine_tuning

GA 发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)—所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8 月 15 日

更新 · 模型：gpt-4o · API：v1/chat/completions

发布 [的动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### Aug 6

更新

已上线 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中的最新模型。

### Aug 1

更新

已上线 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志监控变更。审计日志记录必须在以下位置启用 [设置](https://platform.openai.com/settings/organization/general).

## 2024年7月

### 7月24日

更新

已上线 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许使用自定义和无限计费的企业客户针对他们所需的 IDP 设置身份验证。

### Jul 23

更新

已上线 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，为特定用例实现更高的性能。

### 7月18日

更新

发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini),我们经济实惠的智能小模型,适用于快速、轻量级的任务。

### Jul 17

更新

发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以在 Chat Completions 和 Assistants API 中通过传入以下参数来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 已在 Beta 中推出。

### Jun 3

更新

Added support for [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### May 15

更新

Added support for [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

Added support for [设置成本限额](https://platform.openai.com/settings/organization/general) 按项目为按量付费客户进行设置。

### May 13

更新

发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) in the API。GPT-4o 是我们最快且最具性价比的旗舰模型。

### 5月9日

更新

Added support for [向 Assistants API 发送的图像输入。](https://developers.openai.com/api/docs/assistants/migration)

### 5月7日

更新

Added support for [向 Batch API 提交微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数传递给 Chat Completions 和 Completions API。设置该参数后，开发者可以在使用流式传输时获取使用情况统计。

### 5 月 2 日

更新

新增 [一个新接口](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中删除线程里的消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 至 Chat Completions 和 Assistants API。

新增 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出了一系列 [Assistants API 更新](https://developers.openai.com/api/docs/assistants/migration) ,包括一个新的文件搜索工具,每个智能体最多支持 10,000 个文件、新的令牌控制以及工具选择支持。

### 4月16日

更新

引入了 [基于项目的层级结构](https://platform.openai.com/settings/organization/general) 用于按项目组织工作,包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 以及按项目管理速率和成本限额(成本限额仅对企业客户开放)的能力。

### 4 月 15 日

更新

发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4 月 9 日

更新

发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式发布

### Apr 4

更新

Added support for [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

Added support for [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

Added support for [创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

Added support for [按 run_id 过滤 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

Added support for [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### 3月14日

更新

Added support for [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### Feb 9

更新

新增 [`timestamp_granularities` parameter](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布 Embedding V3 模型以及更新的 GPT-4 Turbo 预览版

新增 [`dimensions` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) to the Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

新增 [`additional_instructions` parameter](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 用于在 Assistants API 中运行创建操作

### 12 月 15 日

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### Dec 14

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用上的参数设为可选

## 2023 年 11 月

### 11 月 30 日

更新

发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### Nov 6

更新

发布 [GPT-4 Turbo 预览版](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [在 API 中使用 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文字转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

已弃用 Chat Completions `functions` 参数 [改为使用 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023年10月

### 10月16日

更新

新增 [`encoding_format` parameter](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) to the Embeddings API

新增 `max_tokens` 到 [Moderation 模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10月6日

更新

新增 [function calling 支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
