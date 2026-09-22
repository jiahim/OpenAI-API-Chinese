# 更新日志

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

> 关于 OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 22 日

功能 · 模型：gpt-6-sol · 模型：gpt-6-luna · API：v1/responses · API：v1/chat/completions

已发布 [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) (`gpt-6-sol`）和 [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) (`gpt-6-luna`).

这些推理模型接受文本和图像输入，并通过 Responses 和 Chat Completions API 生成文本。

提示词输入 token 数不超过 272K 时的每 1M tokens 标准定价：

- GPT-6 Sol：输入 $2，缓存输入 $0.20，输出 $10。
- GPT-6 Luna：输入 $0.10，缓存输入 $0.01，输出 $0.50。

在 [模型目录](https://developers.openai.com/api/docs/models)，中比较能力，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解缓存写入、更长提示以及其他处理层级的费用。

### Sep 15

功能

在组织级别和项目级别新增了 API 密钥创建治理控制。管理员可以仅允许服务帐户密钥、仅允许用户拥有的项目密钥,或禁用所有新的 API 密钥创建。组织级别的限制优先于项目设置,已有的 API 密钥不受影响。详情请参阅 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 。

### Sep 10

功能

你可以在创建项目 API 密钥时设置过期时间。管理员还可以在 Platform 设置中按组织或项目层级强制设置最大密钥有效期，要求新创建的密钥必须在配置的限制内过期。参见 [生产环境最佳实践](https://developers.openai.com/api/docs/guides/production-best-practices#api-keys) 了解密钥过期和轮换的指南。

### Sep 10

功能

已发布 [智能体 API](https://developers.openai.com/api/docs/guides/agents-api/overview) 公共测试版。使用托管的 Codex 运行框架构建 智能体，由 OpenAI 负责会话编排、上下文压缩和恢复。

借助持久会话跨多个回合继续工作、流式传输进度，并接入你自己的工具和 MCP 服务器。在 OpenAI 托管的沙箱中运行 智能体，或连接来自你自己的基础设施或受支持提供方的沙箱。

从 [智能体 API 快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart).

### Sep 10

功能 · 模型：gpt-live-1 · API：v1/live/sessions

[GPT-Live 1](https://developers.openai.com/api/docs/models/gpt-live-1) 现已在 API 中全面上线。构建可由后端模型或 智能体 同步处理推理和工具调用的全双工语音会话。

使用 Responses 委托并搭配 OpenAI 模型，或使用客户端委托连接你自己的后端。语音会话费用为每分钟 $0.05，按秒计费；后端模型和工具使用量另行计费。

从 [GPT-Live](https://developers.openai.com/api/docs/guides/live), [提示指南](https://developers.openai.com/api/docs/guides/live-prompting)，以及 [迁移指南](https://developers.openai.com/api/docs/guides/live-migration)。参见 [定价](https://developers.openai.com/api/docs/pricing) 。

### 9 月 8 日

功能 · API：v1/responses

[Prompt Cache Diagnostics](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 现已在 Responses API 中面向 GPT-5.6 及更高版本支持的模型正式发布。

将缓存复用情况与上一次响应进行对比，识别缓存未命中的原因，并参考故障排查指南提升缓存复用率。

### 9 月 8 日

功能 · 模型：gpt-image-2.5-sunburst · 模型：gpt-image-2.5-flare · API：v1/images · API：v1/responses

已发布 [GPT Image 2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) 和 [GPT Image 2.5 Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) ，可通过 Image API 和 Responses API 的图像生成工具进行图像生成与编辑。

在编辑精度要求最高的工作流中使用 Sunburst，或在追求快速、高质量的日常图像生成时使用 Flare。两个模型均支持新的 `xhigh` 和 `max` 质量设置，并采用 GPT Image 2 的 token 费率。详见 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation) 和 [定价](https://developers.openai.com/api/docs/pricing#image-generation).

### 9 月 8 日

功能 · 模型：gpt-rosalind-research

GPT-Rosalind（`gpt-rosalind-research`）现已通过 [可信访问计划](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) 面向已获批准的生命科学内部研究正式发布。

标准定价为输入 token 每 1M 5 美元、缓存输入 token 每 1M 0.50 美元、输出 token 每 1M 25 美元，计费自 2026 年 10 月 5 日起生效。详见 [定价](https://developers.openai.com/api/docs/pricing) 。

### 9月3日

功能 · 模型: gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最困难的端到端任务而构建。

将 GPT-6 Astra 用于推理、编程、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求一路完成到最终结果，使用你提供的上下文和工具。

迁移时需要考虑的关键变更：

- GPT-6 Astra 不支持 `none` 推理强度等级。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [偏差监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在支持的 Responses API 请求中，异步检查 智能体 工作期间可能存在的问题。检查可能会触发安全告警或停止会话以供审查。

从 [使用 GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) 了解能力、提示和迁移指南。探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 获取浏览器和桌面工作流，并参阅 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理层级。

### 9月3日

功能 · API：v1/responses

在 Responses API 中为 GPT-6 Astra 的长时间运行任务新增了控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让模型在应用程序运行函数或自定义工具时继续工作，然后在结果可用时将其返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行期间通过 WebSockets 发送额外指令，以便模型能够纳入更正或变化的需求。
- [在对话中途更改推理努力程度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，对困难任务提高努力程度，或对常规跟进任务降低努力程度。

### 9 月 2 日

更新

更新了 API 错误，使应用程序能够区分流量增长过快与暂时的模型过载。

流量增长过快会返回 `429` 错误，并带有 `slow_down` 代码。暂时的模型过载会返回 `503` 错误，并带有 `server_is_overloaded` 代码。两种响应都可能包含 `Retry-After`。当响应头存在时，重试前至少等待其指定的时间。如果缺失，则使用指数退避。参阅 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

连接 `api.openai.com` 现在可以使用 IPv6。

## 2026年8月

### 8月29日

功能

[Mutual TLS (mTLS)](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 现已在 OpenAI API 中正式可用。可直接在 [Platform console](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供方，访问权限由你所在组织的角色和权限控制。

### 8月26日

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027-02-26 停用。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026-08-26 停用。请按照迁移至 Responses API 和 Conversations API 的 [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用带有来自具有 Global 地理设置的项目中 API 密钥的前缀域，为单个请求选择区域处理。现有的资格、数据保留控制、端点和模型支持要求仍然适用。详情请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现已调整为每百万输入 token 4 美元、每百万输出 token 20 美元，输入价格降低 20%，输出价格降低 33%。GPT-5.6 Sol 的促销定价至少持续到 2026-11-21。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### Aug 20

功能

已发布 [Prompt Caching 仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上查看。你可以跟踪一段时间内的缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的细分，从而了解缓存效率并发现改进机会。按模型和服务层级筛选指标。

### Aug 20

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已在以下功能中提供预览： `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 的图像生成工具中提供。设置 `background` 以 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。在 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### 8 月 13 日

公告

推出 Ultrafast 模式，这是面向 GPT-5.6 Sol 的全新 API 服务层级，处理速度最高可达 Standard 处理的 14 倍。目前仅向部分客户提供限量预览。请在此处注册以接收 Ultrafast 模式的更新 [此处](https://openai.com/form/ultrafast/).

### 8 月 7 日

Feature · Model: gpt-5.6-cyber · Model: gpt-daybreak-red-latest · Model: gpt-daybreak-blue-latest · API: v1/responses

Daybreak 现在为已获批准的防御方提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以使用它们，在明确授权的参与中从安全发现转向经过验证的修复。

从 Daybreak Blue 开始，适用于大多数防御性安全工作。它提供对通用模型的访问，例如用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证的 GPT-5.6 Sol。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独批准的、对专用训练模型的访问，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) 用于经授权的漏洞复现、漏洞利用验证、渗透测试、红队演练以及复杂系统分析。

这些模型需要单独审批与配置。你可以申请加入 Daybreak 计划 [此处](https://openai.com/daybreak/)。有关定价的更多详情 [此处](https://developers.openai.com/api/docs/pricing).

### Aug 6

更新 · 模型：chat-latest

更新了 **chat-latest** 快照，该快照指向 ChatGPT 上 Plus 和 Pro 用户可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Aug 5

更新 · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna

快速模式现已在 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 上支持长上下文请求。从今天起，超过 272K tokens 的长上下文提示可在 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，相比 Standard 档位速度提升可达 2.5 倍。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

### 8 月 4 日

功能

客户现在可以按 API 键在 [用量和成本仪表板](https://platform.openai.com/settings/organization/usage)。中筛选和分组数据。该 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API 键维度，以便进行程序化报告和分析。

## 2026 年 7 月

### 7 月 30 日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，而 GPT-5.6 Terra 的价格降低 20%。详见 [定价详情](https://developers.openai.com/api/docs/pricing).

我们还推出了 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) （位于 API 中），用于替代原有的 Priority Processing 服务。对于 GPT-5.6 Sol，Fast 模式现可提供比标准处理最高快 2.5 倍的速度，价格为标准处理的两倍。该变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### Jul 29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于以基础设施即代码的方式管理 OpenAI API 平台资源。

配置和管理项目、用户、组、角色、访问权限分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用变更、导入现有资源，以及检测和协调配置漂移。从以下位置安装该 provider： [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### Jul 28

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于精确的文件转写以及已提交 Realtime 轮次的最终转录文本，配合 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟的流式转写。

两个模型都支持自由格式的转写上下文、关键词提示以及多种预期输入语言。在以下位置比较支持的输出和工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### Jul 22

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出上限。设置每月上限，当追踪到的支出达到该上限时，受影响的 API 请求将返回 `429` 错误。可使用支出告警在流量中断之前进行通知。详细信息请参阅 [支出上限指南](https://developers.openai.com/api/docs/guides/spend-limits).

### Jul 9

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于平衡智能与成本的 GPT-5.6 Terra，以及用于高吞吐量高效负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理、 `max` 推理力度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [针对 Responses API 处于测试阶段的多 智能体编排](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还支持以原始尺寸接收图像，并附带 `original` 或 `auto` 图像细节。

### Jul 6

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API: v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具有改进的字母数字识别、静音和噪音处理以及打断行为。同时发布了 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款更快、成本更低的蒸馏推理模型，用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · 模型：chat-latest

更新了 `chat-latest` 快照，它指向当前 ChatGPT 中使用的最新 Instant 模型。我们建议使用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了 Safety 使用仪表盘。Safety 仪表盘基于以下内容显示被拦截的 Responses 请求 `safety_identifier` 请求中发送的用于识别最终用户的值。请访问 [Safety 仪表盘](https://platform.openai.com/usage/safety).

### 6月9日

功能 · API：v1/responses

网页搜索现在可以在常规文本结果之外返回图片结果。当你的应用需要当前或基于网络的视觉内容（例如商品照片、地标、地点、事件或视觉参考）时，可以使用图片搜索。更多信息请参阅 [网页搜索 指南](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 5

更新

发布了重新设计的 OpenAI API 平台导航，访问 [此处](https://platform.openai.com/login).

### 6月4日

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已在 Responses API 和 Chat Completions API 中新增审核评分。在生成请求中传入 `moderation` 对象，即可在同一次响应中同时获取模型输入与生成输出的审核结果。

更多信息请参阅 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月 3 日

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体构建器。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### Jun 2

更新

自 2026 年 6 月 2 日起，符合条件的容器会话将按分钟计费，且设有 5 分钟的最低计费时长，不再按整 20 分钟的会话费率计费。底层每分钟费率保持不变。

此次更新旨在为较短的会话提供更精细的计费方式，并降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前的内置工具定价](https://developers.openai.com/api/docs/pricing#built-in-tools).

### Jun 1

Feature · Model: gpt-5.4 · Model: gpt-5.5 · API: v1/responses

OpenAI 模型现已通过与 OpenAI 兼容的 Responses API 端点在 Amazon Bedrock 中可用。受支持的模型和功能因 AWS 区域而异。 [了解更多](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API：v1/responses · API：v1/chat/completions · API：v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而不是 `in_memory`，默认启用扩展提示缓存。 [了解更多](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### May 28

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产 API 场景，但你可以使用此模型来测试聊天用例的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### May 26

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信任的工作负载可以将外部签发的身份令牌交换为短时的 OpenAI 访问令牌，而无需存储长期有效的 API 密钥。

### May 26

更新

新增 [Admin API](https://developers.openai.com/api/docs/guides/admin-apis) 能力，用于管理支出提醒、模型允许列表、数据保留设置和 托管工具 权限，以及查询细粒度的账单明细项。

### 5月19日

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 可让受支持的 OpenAI 产品（包括 ChatGPT web、Codex、Responses API 以及 AgentKit）通过客户自行托管的 `tunnel-client` 连接私有或本地部署的 MCP 服务器，而无需将这些服务器暴露在公网上。

### 5月19日

更新

你现在可以管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。要进行配置，请前往 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API 试用版。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026/5/12 被弃用并从 API 中移除。我们推荐使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 替代。

Realtime API 试用版已于 2026/5/12 被弃用并从 API 中移除。如果你仍在使用试用接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### May 11

功能 · API：v1/responses

Added `return_token_budget` 用于 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research)。使用它可以启用更长的 GPT-5+ 推理 网页搜索 运行，以应对高投入度的研究和评估工作负载。

### 5 月 7 日

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款面向语音到语音 智能体 的全新实时语音模型，支持可配置推理，同时推出 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

更新了 [Realtime and audio guide](https://developers.openai.com/api/docs/guides/realtime)，新增了专门的 [Realtime translation guide](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) 用于流式转录，并将实时提示词指南迁移至 [Using realtime models](https://developers.openai.com/api/docs/guides/voice-prompting).

### 5 月 7 日

功能

已发布 [OpenAI Developers plugin for Codex](https://developers.openai.com/learn/developers-codex-plugin)。它可以帮助你在 Codex 中借助 OpenAI 平台访问以及 OpenAI API 配置指引，构建 AI 应用和 智能体。

### May 6

更新

更新后的 Agents SDK 现已在 TypeScript 中提供，支持沙箱 智能体，并内置开源 harness。了解更多 [此处](https://developers.openai.com/api/docs/guides/agents).

### 5 月 5 日

更新 · 模型：chat-latest

已发布 `chat-latest` 快照，指向 ChatGPT 当前使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境的 API 使用场景,但你可以使用此模型测试我们在聊天用例方面的最新改进。底层模型快照会定期更新。了解更多 [此处](https://developers.openai.com/api/docs/models/chat-latest).

### 5月4日

更新

Admin API 现已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中得到支持。请参阅 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 了解设置步骤和示例。

## 2026 年 4 月

### 4 月 24 日

功能 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API：v1/responses · API：v1/chat/completions · API：v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，面向复杂专业工作的全新前沿模型，现已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) 用于 Responses API 请求，处理能从更多算力中受益的更棘手问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、工具搜索、内置 computer use、托管 shell、apply patch、Skills、MCP 以及 网页搜索。关键更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅适用于扩展提示缓存。不支持内存中的提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### 4 月 21 日

功能 · 模型：gpt-image-2 · API：v1/images/generations · API：v1/images/edits · API：v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成和编辑的最先进的图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真图像输入、基于 token 的图像定价，以及 Batch API 支持，可享受 50% 折扣。

### 4月15日

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 新增了多项能力，包括：
- 在受控沙箱中运行 智能体；
- 检查并定制开源 harness；以及
- 控制记忆创建的时间及其存储位置。

## 2026 年 3 月

### 3 月 17 日

特性 · 模型：gpt-5.4-mini · 模型：gpt-5.4-nano · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 到 Chat Completions 和 Responses API。GPT-5.4 mini 为大批量工作负载带来了 GPT-5.4 级别的能力，同时模型更快、更高效；GPT-5.4 nano 则面向速度与成本最为关键的简单大批量任务进行了优化。

GPT-5.4 mini 支持 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search)，内置 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [上下文压缩](https://developers.openai.com/api/docs/guides/compaction)。GPT-5.4 nano 支持上下文压缩，但不支持工具搜索或计算机使用。

### Mar 16

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 3 月 13 日

修复 · 模型: gpt-5.4 · API: v1/responses · API: v1/chat/completions

更新了我们的图像编码器，以修复 `input_image` GPT-5.4 中输入处理方面的一个小问题。某些图像理解用例的质量现在可能会有所提升，无需任何额外操作。

### 3 月 12 日

功能 · Model: sora-2 · Model: sora-2-pro · API: v1/videos · API: v1/videos/characters · API: v1/videos/extensions · API: v1/batch

通过可复用的角色引用、可生成更长时长（最长可达API `20` 秒）的视频，扩展了 Sora 接口， `1080p` 输出， `sora-2-pro`、视频扩展以及 Batch API 对 `POST /v1/videos`. `1080p` 生成的支持。 `sora-2-pro` 的计费为 `$0.70` /秒。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · Model: sora-2 · Model: sora-2-pro · API: v1/videos/edits · API: v1/videos/{video_id}/remix

Added `POST /v1/videos/edits` 用于编辑已有视频。该接口将取代 `POST /v1/videos/{video_id}/remix`，后者将于 接口 弃用，弃用时间为 `6` 个月后。了解更多 [此处](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3月5日

Feature · Model: gpt-5.4 · Model: gpt-5.4-pro · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，这是我们面向专业工作的最新前沿模型，已在 Chat Completions 和 Responses API 中提供，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于可通过更多算力受益的更棘手问题。

同时发布：
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 通过 Responses API 实现，可让模型将大型工具面延迟到运行时再加载，从而降低令牌用量、保持缓存性能并改善延迟。
- 内置 [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 支持，通过 Responses API 在 GPT-5.4 中提供 `computer` 工具，用于基于截图的 UI 交互。
- 提供 1M 令牌上下文窗口，以及面向更长任务智能体工作流的原生 [Compaction](https://developers.openai.com/api/docs/guides/compaction) 支持。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 添加到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API：v1/responses

扩展的 `input_file` 对 Responses API 的支持，可接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [此处](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API：v1/responses

已发布 `phase` 至 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。阅读更多 [此处](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API：v1/responses

已发布 `gpt-5.3-codex` 至 Responses API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### Feb 23

功能 · API：v1/responses

为 Responses API 推出了 WebSocket 模式。了解更多 [此处](https://developers.openai.com/api/docs/guides/websocket-mode/).

### Feb 23

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [此处](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

功能 · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已支持 GPT Image 模型： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · Model: gpt-5.2-chat-latest

更新了 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug 指向 ChatGPT 当前使用的最新模型。

### 2 月 10 日

功能 · API：v1/responses

已推出 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，位于 Responses API 中。

### 2 月 10 日

功能 · API：v1/responses

已推出对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 功能的支持，可在 Responses API 中使用。Skills 同时支持本地执行和基于托管容器的执行。

### 2 月 10 日

功能 · API：v1/responses

推出全新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器联网。

### Feb 9

特性 · Model: gpt-image-1.5 · Model: gpt-image-1 · Model: gpt-image-1-mini · Model: chatgpt-image-latest · API: v1/images/edits

新增了对 `application/json` 请求的支持， `/v1/images/edits` 面向 GPT 图像模型。JSON 请求使用 `images` （以及可选的 `mask`）并通过 `image_url` 或 `file_id` 引用来代替 multipart 上传。

### Feb 3

更新 · 模型：gpt-5.2 · 模型：gpt-5.2-codex

我们已为 API 客户优化了推理栈， [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在运行速度提升约 40%。模型和模型权重未发生变化。

## 2026 年 1 月

### 1 月 15 日

公告

已发布 [Open Responses](https://www.openresponses.org/): 一个开源规范，用于在原有的 OpenAI Responses API 之上构建多提供商、可互操作的 LLM 接口。

### Jan 14

Feature · Model: gpt-5.2-codex · API: v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中的智能体编码任务优化的版本。阅读更多 [此处](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 段。 `sip.api.openai.com` 执行 GeoIP 路由，并将 SIP 流量引导至最近的区域。 [了解更多](https://developers.openai.com/api/docs/guides/voice-sip?voice-api=realtime#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新了 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) 指向 2025-12-15 快照。如果需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

更新了 [sora-2](https://platform.openai.com/docs/models/sora-2) 指向 `sora-2-2025-12-08`。如果需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` 指向 `2025-12-15` 快照。如果需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前建议使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### 1 月 9 日

修复 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

修复了一个问题，其中 `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过以下方式进行图像编辑时错误地使用了高保真度： `/v1/images/edits`，即使 `fidelity` 被明确设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

更新 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

Added `gpt-image-1.5` 和 `chatgpt-image-latest` 到 Responses API 图像生成工具。

### 12 月 16 日

特性 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新且最先进的图像生成模型。阅读更多 [此处](https://platform.openai.com/docs/guides/image-generation).

### 12 月 15 日

功能 · Model: gpt-realtime-mini · Model: gpt-audio-mini · Model: gpt-4o-mini-transcribe · Model: gpt-4o-mini-tts

发布了四个带有日期标注的全新音频快照。这些更新为实时语音驱动的应用带来了可靠性、质量和语音保真度的提升。阅读更多 [此处](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括对以下功能的支持 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 面向符合条件的客户。

### Dec 11

Feature · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2)，GPT-5 模型系列中最新旗舰模型。GPT-5.2 在以下方面较前代 GPT-5.1 有所改进：
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- 工具调用与API中的上下文管理
- 电子表格的理解与创建。

5.2 的新特性包括新的 xhigh 推理努力等级、简洁的推理摘要，以及使用压缩的新上下文管理。

### Dec 11

功能 · API：v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced). 对于使用 Responses API 的长时间对话，你可以使用 `/responses/compact` 端点来缩减你每次发送的上下文。

### Dec 4

功能 · 模型：gpt-5.1-codex-max · API：v1/responses

已发布 `gpt-5.1-codex-max` 到 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，针对长时程、智能体编码任务进行了优化。了解更多 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025 年 11 月

### 11 月 20 日

功能 · API：v1/realtime

Realtime API 新增对 DTMF 按键的支持。你现在可以在使用 Realtime 旁路连接时接收 DTMF 事件。请参阅 [此处文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### Nov 13

功能 · Model: gpt-5.1 · Model: gpt-5.1-codex · Model: gpt-5.1-chat-latest · Model: gpt-5.1-codex-mini · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，这是 GPT-5 模型系列中全新的旗舰模型。GPT-5.1 在以下方面经过特别训练，表现尤为出色：

- 在无需深度思考时可引导输出方向并获得更快响应
- 代码生成与编程相关用例
- 智能体工作流

请注意，GPT-5.1 默认启用新的 `none` 推理设置，以便在无需过多思考时更快地响应——这与之前 GPT-5 中的 `medium` 默认设置不同。

### Nov 13

功能

已发布 [增强型基于角色的访问控制（RBAC）](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制（RBAC）让你可以决定在你的组织和项目中谁能做什么——既可以通过 API，也可以在 Dashboard 中进行。

### Nov 13

特性 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是针对 Codex 或类似环境中的智能体编码任务进行优化的 GPT-5.1 版本。详细了解 [此处](https://platform.openai.com/docs/models/gpt-5.1-codex).

### Nov 13

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留会使缓存前缀保持更长时间的激活状态，最长可达 24 小时。扩展提示缓存的工作原理是：当内存已满时，将键 / 值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · Model: gpt-oss-safeguard-120b · Model: gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [此处](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [Enterprise Key Management (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm). Enterprise Key Management (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥来加密 OpenAI 上的客户内容。

### Oct 24

功能

已发布 [UK data residency](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10月6日

特性 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 [OpenAI DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，这是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，它使用更多算力进行更深入的思考，从而提供始终更出色的回答。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以实现更具性价比的语音到语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) ，以实现更具性价比的图像生成和编辑。

已推出 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) ，用于使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型生成丰富、细致且富有动态感的视频并进行再创作。

已推出 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) ，用于以可视化方式创建自定义的多智能体工作流。

已推出 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个可嵌入的聊天界面，用于部署智能体。

已发布 [Trace Evals、Datasets 和 Prompt Optimization 工具](https://developers.openai.com/api/docs/guides/agent-evals).

[Evals](https://developers.openai.com/api/docs/guides/evals)：已发布第三方模型支持。

已推出 [服务健康仪表盘](https://platform.openai.com/settings/organization/service-health).

### Oct 1

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能会将API的访问权限限制为你所指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API：v1/responses

新增支持将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### Sep 23

Feature · Model: gpt-5-codex · API: v1/responses

推出专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为与 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。在我们的 Realtime API [指南中了解更多信息](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API：v1/responses

新增了对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 包装器，可用于 Google 应用、Dropbox 等常用服务，使模型能够读取这些服务中存储的数据。

### Aug 20

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，允许你创建和管理与 Responses API 的长期会话。请参阅 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看对比并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### 8 月 7 日

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

推出了 `minimal` [推理力度](https://developers.openai.com/api/docs/guides/reasoning) 取值，以在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [工具调用](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入自由格式的内容并获取自由格式的输出。

## 2025 年 6 月

### 6 月 27 日

功能

已推出对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing)。与标准处理相比，优先级处理在保持按量付费灵活性的同时，显著降低了延迟并使其更加稳定。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [deep research 指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降价并简化定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具的。已添加对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API：v1/responses

[新的可复用提示词](https://developers.openai.com/chat/edit) 现已在控制台以及 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现可通过 `prompt` 参数（在提示词中 `id`，可选的 `version`）引用在控制台创建的模板， `variables` 并提供可包含字符串、图像或文件输入的动态内容。可复用提示词在 Chat Completions 中不可用。 [了解更多](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

特性 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。 [o3 模型的价格也已下调](https://developers.openai.com/api/docs/pricing) ，适用于所有 API 请求，包括批处理和 flex 处理。

### 6月4日

特性 · API：v1/fine_tuning

新增对以下模型的微调支持： [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 。适用于以下模型： `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月 3 日

特性 · API：v1/chat/completions · API：v1/realtime

为以下模型提供新的模型快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。发布了 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025 年 5 月

### 5 月 20 日

功能 · API：v1/responses

为 Responses API 中的新增内置工具提供支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [了解更多关于工具的信息](https://developers.openai.com/api/docs/guides/tools).

### 5 月 20 日

功能 · API：v1/responses · API：v1/chat/completions

新增对以下功能的支持 `strict` 在非微调模型上使用并行工具调用时，工具架构所采用的模式。
新增 [架构特性](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 以及其他模式的字符串验证，以及为数字和数组指定范围。

### 5 月 15 日

功能 · 模型：codex-mini-latest · API：v1/responses · API：v1/chat/completions

已推出 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，为配合以下用途进行了优化： [Codex CLI](https://github.com/openai/codex).

### 5 月 7 日

功能 · API：v1/fine-tuning · API：v1/responses · API：v1/chat/completions

已推出对 [reinforcement fine-tuning](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

已推出对 [增强型 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### Apr 23

功能 · API: v1/images/generations · API: v1/images/edits

新增了图像生成模型， `gpt-image-1`。该模型在图像生成方面树立了新标准，具有更出色的质量和指令遵循能力。

更新了图像生成和编辑接口，以支持该模型特有的新参数， `gpt-image-1` 模型。

### Apr 16

功能 · API：v1/chat/completions · API：v1/responses

新增两款 o 系列推理模型， `o3` 和 `o4-mini`。它们在数学、科学和编程、视觉推理任务以及技术写作方面树立了新的标准。

推出 Codex，我们的代码生成 CLI 工具。

### Apr 14

Feature · Model: gpt-4.1 · Model: gpt-4.1-mini · Model: gpt-4.1-nano · API: v1/responses · API: v1/chat/completions · API: v1/fine_tuning

Added [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) models to the API。这些新模型具有更强的指令遵循能力、更好的编码能力，以及更大的上下文窗口（最高可达 1M token）。 `gpt-4.1` 和 `gpt-4.1-mini` 已可用于监督微调。宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025 年 3 月

### 3 月 20 日

更新 · API：v1/audio

Added `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型到 Audio API。

### Mar 19

特性 · 模型：o1-pro · API：v1/responses · API：v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的版本，使用更多算力来回答难题，具有更好的推理能力和一致性。

### Mar 11

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多款新模型和新工具，以及用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体及工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，预计将在 2026 年下线 Assistants（前提是实现完整的特性对等）。

### 3 月 3 日

功能 · API：v1/fine_tuning/jobs

Added `metadata` 字段支持添加到微调任务。

## 2025 年 2 月

### 2 月 27 日

功能 · 模型：GPT-4.5 · API：v1/chat/completions · API：v1/assistants · API：v1/batch

发布了研究预览版 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)——我们迄今为止最大、最强大的对话模型。GPT-4.5 具备高“情商”以及对用户意图的理解，在创意任务和智能体规划方面表现更出色。

### Feb 25

功能

已推出 [API 使用情况仪表盘更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。此更新响应了用户对更多数据筛选条件的需求，例如项目筛选、日期选择器以及更细粒度的时间区间。本次更新还更好地支持跨不同产品和服务层级查看用量数据。

### 2 月 5 日

功能

在欧洲推出数据驻留。了解更多 [此处](https://platform.openai.com/docs/guides/your-data).

## January, 2025

### Jan 31

功能 · 模型：o3-mini · 模型：o3-mini-2025-01-31 · API：v1/chat/completions

已推出 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini)，这是一款针对科学、数学和编码任务优化的小型推理模型。

### Jan 21

特性 · 模型：o1

扩展访问 [o1 模型](https://platform.openai.com/docs/models/o1)。o1 系列模型通过强化学习训练以执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已推出 [Admin API 密钥轮换](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理 接口 密钥。

已更新 [Admin API 邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在邀请用户加入组织的同时，以编程方式邀请他们加入项目。

### Dec 17

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增以下模型 [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

Added [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) （适用于 o1 模型）。

Added [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) （适用于 o1 模型）。注意，o1-preview 和 o1-mini 不支持系统或开发者消息。

推出基于 [直接偏好优化（DPO）](https://developers.openai.com/api/docs/guides/model-optimization#preference).

推出了 Go 和 Java 的 beta 版 SDK。 [了解更多](https://developers.openai.com/api/docs/libraries).

Added [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，现已在 [Python SDK](https://github.com/openai/openai-python).

### Dec 4

功能

已推出 [用量 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，中提供，使客户能够以编程方式查询 OpenAI API 上的活动与消费情况。

## 2024 年 11 月

### 11 月 20 日

更新 · API：v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中我们最新的模型。

### Nov 4

功能 · API: v1/chat/completions

已发布 [预测输出](https://developers.openai.com/api/docs/guides/predicted-outputs)，可显著降低模型响应的延迟，前提是响应的绝大部分内容事先已知。这种情况最常见于重新生成文档和代码文件的内容，且仅进行少量修改。

## 2024 年 10 月

### 10 月 30 日

功能 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

在Chat Completions API中新增了五种语音类型 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [聊天补全接口](https://developers.openai.com/api/docs/guides/audio).

### 10 月 17 日

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [最新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 chat completions，支持音频输入和输出。使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### Oct 1

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 [OpenAI 在旧金山举办的 DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口在你的应用中快速构建语音到语音的体验。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model): 使用来自前沿大型模型的输出，针对成本效益高的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision): 使用图像和文本对 GPT-4o 进行微调，以提升视觉能力。

[Evals](https://developers.openai.com/api/docs/guides/evals): 创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching): 对最近出现过的输入令牌提供折扣与更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit): 在 playground 中使用 Generate 按钮，轻松生成提示词、函数定义以及结构化输出架构。

## September, 2024

### 9 月 26 日

特性 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [最新 `omni-moderation-latest` 审核模型](https://developers.openai.com/api/docs/guides/moderation)，它同时支持图像和文本（部分类别），新增两个仅限文本的伤害类别，并且评分更加准确。

### Sep 12

Feature · Model: o1-preview · Model: o1-mini · API: v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，是通过强化学习训练的新型大语言模型，可用于执行复杂推理任务。

## 2024 年 8 月

### 8月29日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### Aug 20

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### Aug 15

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型， `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)—该模型将指向 ChatGPT 当前使用的最新 GPT-4o 模型。

### Aug 6

更新

已推出 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)—模型输出现在能够可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中我们最新的模型。

### Aug 1

更新

已推出 [管理与审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织并使用审计日志来追踪变更。必须在 [设置](https://platform.openai.com/settings/organization/general).

## July, 2024

### Jul 24

更新

已推出 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers)，允许采用自定义和无限计费的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已推出 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，从而在特定用例下实现更高的性能。

### 7月 18 日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini), 一款经济实用的智能小模型，适用于快速、轻量级的任务。

### Jul 17

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可以通过在 Chat Completions 和 Assistants API 中传递以下参数来禁用 `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 在 Beta 中发布。

### 6月 3 日

更新

新增了对 [文件搜索 自定义配置](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### 5 月 15 日

更新

新增了对 [归档项目](https://developers.openai.com/projects) 。仅组织所有者可访问此功能。

新增了对 [设置成本限制](https://platform.openai.com/settings/organization/general) ，针对按量付费客户按项目进行设置。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### May 9

更新

新增了对 [向 Assistants API 输入图像。](https://developers.openai.com/api/docs/assistants/migration)

### 5 月 7 日

更新

新增了对 [将微调模型接入 Batch API](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### May 6

更新

Added [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数用于 Chat Completions 和 Completions API。设置该参数后，开发者在使用流式传输时即可获取用量统计信息。

### May 2

更新

Added [一个新端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于在 Assistants API 中从线程里删除消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 用于 Chat Completions 和 Assistants APIs。

新增了一篇 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型的支持](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出了一系列 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) ，更新，包括一个新的 文件搜索 工具，每个智能体最多可支持 10,000 个文件，新增了 token 控制以及工具选择（tool choice）支持。

### Apr 16

更新

引入了 [基于项目层级](https://platform.openai.com/settings/organization/general) 用于按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目设置速率与费用上限的能力（费用上限仅对企业客户开放）。

### 4月15日

更新

已发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### Apr 9

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 在 API 中正式发布

### Apr 4

更新

新增了对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增了对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增了对 [创建 Run 时添加 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### 4 月 1 日

更新

新增了对 [按 run_id 过滤消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增了对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [助手消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### Mar 14

更新

新增了对 [流式传输](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### Feb 9

更新

Added [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024 年 1 月

### 1 月 25 日

更新

发布了 Embedding V3 模型以及更新后的 GPT-4 Turbo 预览版

Added [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 用于 Embeddings API

## 2023 年 12 月

### 12 月 20 日

更新

Added [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建操作

### 12 月 15 日

更新

Added [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 传递给 Chat Completions API

### 12 月 14 日

更新

Changed [function parameters](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) argument on a tool call to be optional

## November, 2023

### Nov 30

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### 11 月 6 日

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [API 中的 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用了 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

Added [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 用于 Embeddings API

Added `max_tokens` 到 [Moderation 模型](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10月6日

更新

Added [函数调用支持](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 到微调 API
