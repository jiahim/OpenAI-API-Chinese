# 更新日志

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

> 该公司 OpenAI API 的最新功能与更新。

即将弃用的功能列在 [弃用页面](/api/docs/deprecations).

## 2026 年 9 月

### 9 月 3 日

特性 · 模型：gpt-6-astra · API: v1/responses · API: v1/chat/completions

已发布 [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)，我们最强大的模型，专为最艰巨的端到端任务而构建。

将 GPT-6 Astra 用于推理、编码、计算机使用、研究和文档创建。它结合这些能力，将复杂任务从初始请求推进到最终结果，过程中使用你提供的上下文和工具。

迁移时需要考虑的关键变更：

- GPT-6 Astra 不支持 `none` 推理力度级别。
- GPT-6 Astra 不支持自定义 `temperature` 或 `top_p` 值或对数概率（`logprobs`).
- 工具调用需要使用 Responses API。如果你在 Chat Completions 中使用工具，请参阅 [Responses 迁移指南](https://developers.openai.com/api/docs/guides/migrate-to-responses).
- [偏差监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 在受支持的 Responses API 请求中，会异步检查 智能体 工作期间的潜在问题。这些检查可能触发安全警报或停止对话以便审核。

从 [GPT-6 Astra 的使用指南](https://developers.openai.com/api/docs/guides/latest-model) 开始，了解相关能力、提示方法和迁移指导。可探索 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use) 用于浏览器和桌面工作流，并查看 [定价](https://developers.openai.com/api/docs/pricing) 了解可用的推理档位。

### 9 月 3 日

功能 · API: v1/responses

为 GPT-6 Astra 在 Responses API 中的长时间运行任务新增了相关控制项：

- [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling)：让模型在你的应用运行函数或自定义工具的同时继续工作，然后在结果可用时将其返回。
- [中途引导](https://developers.openai.com/api/docs/guides/steering)：在响应进行期间通过 WebSockets 发送额外指令，以便模型能够纳入修正或变化的需求。
- [在对话中途更改推理力度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation)：在保留已缓存提示前缀的同时，针对困难任务提升力度，或在常规跟进中降低力度。

### Sep 2

更新

更新了 API 错误，以便应用能够区分流量增长过快与临时性的模型过载。

流量增长过快时可能返回 `429` 错误，错误码为 `slow_down` ；临时性的模型过载则返回 `503` 错误，错误码为 `server_is_overloaded` 错误码。两种响应都可能包含 `Retry-After`。当存在该响应头时，请至少等待其指定的时间后再重试；如果缺失，请使用指数退避策略。请参阅 [错误码指南](https://developers.openai.com/api/docs/guides/error-codes) 和 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).

### Sep 1

更新

到 `api.openai.com` 的连接现在可以使用 IPv6。

## 2026 年 8 月

### 8 月 29 日

功能

[双向 TLS（mTLS）](https://developers.openai.com/api/docs/guides/mutual-tls) 和 [X.509 工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 已在 OpenAI API 全面可用。可直接在 [Platform 控制台](https://platform.openai.com/settings/organization/security)，中配置证书和 X.509 身份提供商，访问权限由你所在组织的角色和权限控制。

### 8月26日

更新 · 模型：whisper-1 · 模型：gpt-4o-transcribe · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-transcribe-diarize · API：v1/audio/transcriptions · API：v1/realtime

宣布弃用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `gpt-4o-transcribe-diarize`。这些模型将于 2027 年 2 月 26 日停用。请迁移至 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 或 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。请参阅 [转录指南](https://developers.openai.com/api/docs/guides/transcription) 和 [弃用页面](https://developers.openai.com/api/docs/deprecations).

Assistants API 已于 2026 年 8 月 26 日停用。请使用以下迁移指南迁移至 Responses API 和 Conversations API [迁移指南](https://developers.openai.com/api/docs/assistants/migration).

### Aug 21

功能

API 客户现在可以通过使用来自 Global 地理区域项目的 API 密钥并加上前缀域名，为单个请求选择区域处理。原有的资格、数据留存控制、端点和模型支持要求仍然适用。详情请参阅 [数据控制指南](https://developers.openai.com/api/docs/guides/your-data#select-a-processing-region-per-request).

### Aug 21

更新 · 模型：gpt-5.6-sol

GPT-5.6 Sol 现在每百万输入 token 的价格为 4 美元，每百万输出 token 的价格为 20 美元，输入价格下调 20%，输出价格下调 33%。GPT-5.6 Sol 的促销定价至少持续到 2026-11-21。详情请参阅 [价格详情](https://developers.openai.com/api/docs/pricing).

### 8月20日

功能

发布了 [Prompt Caching 控制面板](https://platform.openai.com/usage?usage_section=prompt-caching) 在 OpenAI API 平台上。可按时间跟踪缓存命中率、每次写入的缓存读取次数，以及缓存读取、缓存写入和未缓存 token 的分布，从而了解缓存效率并发现改进机会。可按模型和服务层级筛选指标。

### 8月20日

更新 · 模型：gpt-image-2 · 模型：gpt-image-2-2026-04-21 · API：v1/images/generations · API：v1/images/edits · API：v1/responses

透明背景现已面向 `gpt-image-2` 和 `gpt-image-2-2026-04-21` 在 Images API 和 Responses API 图像生成工具中开放预览。将 `background` 设置为 `transparent` 并使用 `png` 或 `webp` 输出； `jpeg` 不支持透明背景。了解更多请参阅 [图像生成指南](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output).

### Aug 13

公告

推出 Ultrafast 模式——这是一项面向 GPT-5.6 Sol 的全新 API 服务层级，处理速度最高可达 Standard 的 14 倍。目前以限量预览形式开放给部分客户使用。请点击此处注册以接收 Ultrafast 模式的最新动态 [这里](https://openai.com/form/ultrafast/).

### Aug 7

Feature · Model: gpt-5.6-cyber · Model: gpt-daybreak-red-latest · Model: gpt-daybreak-blue-latest · API: v1/responses

Daybreak 现在为已获批准的防御者提供两个访问层级：Daybreak Blue 和 Daybreak Red。你可以在明确授权的攻防场景中，将它们用于从安全发现到验证修复的整个过程。

对于大多数防御性安全工作，建议从 Daybreak Blue 开始。它提供对通用模型的访问，例如 GPT-5.6 Sol，可用于漏洞发现、安全代码审查、检测工程、事件响应、恶意软件分析和补丁验证。阅读更多 [这里](https://developers.openai.com/api/docs/models/gpt-daybreak-blue-latest).

Daybreak Red 提供单独审批的访问权限，可使用专门训练的模型，例如 [GPT-5.6 Cyber](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) ，用于已获授权的漏洞复现、漏洞利用验证、渗透测试、红队演练和复杂系统分析。

这些模型需要单独审批和配置。你可以申请加入 Daybreak 计划 [这里](https://openai.com/daybreak/)。更多定价详情 [这里](https://developers.openai.com/api/docs/pricing).

### 8 月 6 日

更新 · Model: chat-latest

更新了 **chat-latest** 快照，它指向 Plus 和 Pro 用户在 ChatGPT 中可用的最新模型。我们建议在生产环境中使用 [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 用于生产环境API 使用，但可以自由地使用此模型来测试对话场景的最新改进。底层模型快照会定期更新。了解更多 [这里](https://developers.openai.com/api/docs/models/chat-latest).

### 8月5日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna

Fast 模式现已支持 GPT-5.6 Sol、GPT-5.6 Terra 和 GPT-5.6 Luna 的长上下文请求。截至今日，超过 272K token 的长上下文提示词可在 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode)，中运行，速度比 Standard 档位最高快 2.5×。 [价格详情](https://developers.openai.com/api/docs/pricing).

### Aug 4

功能

客户现在可以在 [使用情况和成本仪表板](https://platform.openai.com/settings/organization/usage)。中按 API key 进行数据筛选和分组。 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage) 和 [成本 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs) 同样支持 API key 维度，用于程序化报告和分析。

## 2026年7月

### 7月30日

更新 · 模型：gpt-5.6-sol · 模型：gpt-5.6-terra · 模型：gpt-5.6-luna · API：v1/responses · API：v1/chat/completions

自 7 月 30 日起，GPT-5.6 Luna 的价格降低 80%，GPT-5.6 Terra 的价格降低 20%。详见 [价格详情](https://developers.openai.com/api/docs/pricing).

我们还在推出 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 中的 API，用于替代我们原先的 Priority Processing 服务。针对 GPT-5.6 Sol，Fast 模式现可提供比标准处理最高快 2.5 倍的速度，价格为标准处理的两倍。此次变更向后兼容：标记为 priority 的请求将自动使用 Fast 模式。

### 07-29

功能

发布了官方的 [OpenAI Terraform provider](https://developers.openai.com/api/docs/guides/terraform) 用于将 OpenAI API Platform 资源以基础设施即代码的方式进行管理。

通过它可以预配和管理项目、用户、群组、角色、访问权限分配、服务账户、证书、邀请以及项目级速率限制。使用标准 Terraform 工作流来审查和应用变更、导入已有资源，以及检测并协调配置漂移。可从 [Terraform Registry](https://registry.terraform.io/providers/openai/openai/latest).

### 7月 28 日

功能 · 模型：gpt-transcribe · 模型：gpt-live-transcribe · API：v1/audio/transcriptions · API：v1/realtime

已发布 [GPT Transcribe](https://developers.openai.com/api/docs/models/gpt-transcribe) 用于准确的文件转录以及已提交 Realtime 轮次的最终转录文本，以及 [GPT Live Transcribe](https://developers.openai.com/api/docs/models/gpt-live-transcribe) 用于低延迟流式转录。

两个模型都支持自由形式的转录上下文、关键词提示以及多种预期输入语言。在以下位置比较支持的输出和工作流： [转录指南](https://developers.openai.com/api/docs/guides/transcription).

### 7 月 22 日

功能

为 OpenAI API 平台上的组织和项目添加了硬性支出限额。设置每月上限，当追踪到的支出达到上限时，受影响的 API 请求将返回 `429` 错误。请使用支出提醒在流量被中断之前进行通知。更多信息请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits).

### 7 月 9 日

Feature · Model: gpt-5.6-sol · Model: gpt-5.6-terra · Model: gpt-5.6-luna · API: v1/responses · API: v1/chat/completions · API: v1/batch

发布了 [GPT-5.6 模型系列](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)，包括用于前沿能力的 GPT-5.6 Sol、用于在智能与成本之间取得平衡的 GPT-5.6 Terra，以及用于高效高吞吐量工作负载的 GPT-5.6 Luna。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.

GPT-5.6 新增 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [显式的提示缓存控制](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理， `max` 推理力度和 Pro 模式](https://developers.openai.com/api/docs/guides/reasoning)，以及 [针对 Responses API 的多智能体编排功能现已推出测试版](https://developers.openai.com/api/docs/guides/responses-multi-agent)。GPT-5.6 还接受原始分辨率的图像，可通过 `original` 或 `auto` 图像细节参数进行控制。

### 7月6日

功能 · 模型：gpt-realtime-2.1 · 模型：gpt-realtime-2.1-mini · API：v1/realtime

已发布 [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)，一款更新的实时推理模型，具备更出色的字母数字识别、静音与噪声处理以及打断行为表现。同时发布 [GPT-Realtime-2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)，一款更快、成本更低的蒸馏推理模型，适用于实时语音应用。

## 2026 年 6 月

### 6 月 24 日

更新 · Model: chat-latest

更新了 `chat-latest` 快照，指向当前在 ChatGPT 中使用的最新 Instant 模型。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境API 使用，但可以自由地使用此模型来测试对话场景的最新改进。底层模型快照会定期更新。了解更多 [这里](https://developers.openai.com/api/docs/models/chat-latest).

### Jun 23

功能

在 OpenAI API 平台上发布了安全使用情况仪表板。安全仪表板会根据请求中发送的值来识别最终用户，从而展示被拦截的 Responses 请求。 `safety_identifier` 如需了解相关信息，请访问 [安全仪表板](https://platform.openai.com/usage/safety).

### 6 月 9 日

功能 · API: v1/responses

网页搜索现在可以在常规文本结果之外同时返回图片结果。当你的应用需要当前或基于网页的视觉内容（例如商品照片、地标、地点、事件或视觉参考资料）时，可以使用图片搜索。详情请参阅 [网页搜索 guide](https://developers.openai.com/api/docs/guides/tools-web-search).

### 6月5日

更新

发布了重新设计的 OpenAI API 平台导航，请访问 [这里](https://platform.openai.com/login).

### 6月4日

功能 · 模型：omni-moderation-latest · API：v1/responses · API：v1/chat/completions

已为 Responses API 和 Chat Completions API 添加审核评分。在生成请求中传入 `moderation` 对象，即可在同一响应中获取模型输入和生成输出的审核结果。

详见 [审核指南](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 6月 3 日

更新

宣布弃用可复用的提示对象、Evals 平台以及智能体 Builder。请参阅 [弃用页面](https://developers.openai.com/api/docs/deprecations) 以了解停用时间表和迁移指南。

### Jun 2

更新

自 2026-06-02 起，符合条件的容器会话将按分钟计费，最低 5 分钟起步，不再按完整的 20 分钟会话费率计费。底层每分钟费率将保持不变。

此次更新旨在让较短会话的计费更加精细，并降低客户的实际成本。

你可以在我们的 [API 定价文档中查看当前内置工具的价格](https://developers.openai.com/api/docs/pricing#built-in-tools).

### 6月 1 日

功能 · 模型: gpt-5.4 · 模型: gpt-5.5 · API: v1/responses

OpenAI 模型现在可通过与 OpenAI 兼容的 Responses API 端点在 Amazon Bedrock 中使用。支持的模型和功能因 AWS 区域而异。 [了解详情](https://developers.openai.com/api/docs/guides/amazon-bedrock).

## 2026 年 5 月

### 5 月 29 日

更新 · API: v1/responses · API: v1/chat/completions · API: v1/batch

对于未启用 ZDR 的组织， `prompt_cache_retention` 现在默认为 `24h` 而非 `in_memory`，默认启用扩展提示缓存。 [了解详情](https://developers.openai.com/api/docs/guides/prompt-caching#extended-prompt-cache-retention).

### 5月28日

更新 · Model: chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) 用于生产环境API 使用，但可以自由地使用此模型来测试对话场景的最新改进。底层模型快照会定期更新。了解更多 [这里](https://developers.openai.com/api/docs/models/chat-latest).

### 5 月 26 日

功能

已发布 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation)。受信工作负载可以将外部颁发的身份令牌交换为短时OpenAI访问令牌，而无需存储长期有效的API密钥。

### 5 月 26 日

更新

新增 [管理 API](https://developers.openai.com/api/docs/guides/admin-apis) 功能，用于管理支出提醒、模型允许列表、数据保留设置以及托管工具权限，并查询细粒度的计费明细项。

### 5月19日

功能

已发布 [Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) 面向企业客户。Secure MCP Tunnel 支持 OpenAI 产品（包括 ChatGPT 网页版、Codex、Responses API 以及 AgentKit）通过客户自托管的方式连接到私有或本地 MCP 服务器 `tunnel-client` ，无需将这些服务器暴露在公共互联网上。

### 5月19日

更新

你现可管理多个 IP 白名单，并将每个白名单应用于项目级别或整个组织。前往以下位置进行配置： [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).

### May 12

更新 · 模型：dall-e-2 · 模型：dall-e-3 · API：v1/realtime

已弃用的 DALL·E 模型快照和 Realtime API Beta。

DALL·E 模型快照 `dall-e-2` 和 `dall-e-3` 已于 2026-05-12 弃用并从 API 中移除。我们建议使用 `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` 代替。

Realtime API Beta 已于 2026-05-12 弃用并从 API 中移除。如果你仍在使用 beta 接口，请迁移到已发布的 Realtime API。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以及完整的 [弃用页面](https://developers.openai.com/api/docs/deprecations).

### 5月11日

功能 · API: v1/responses

新增 `return_token_budget` 为 Responses API [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search#run-longer-web-research). 使用它可以选择启用更长时间的 GPT-5+ 推理 网页搜索 运行，适用于高投入度的研究和评估工作负载。

### 5 月 7 日

功能 · 模型：gpt-realtime-2 · 模型：gpt-realtime-translate · 模型：gpt-realtime-whisper · API：v1/realtime · API：v1/realtime/translations · API：v1/realtime/transcription_sessions

已发布 [GPT-Realtime-2](https://developers.openai.com/api/docs/models/gpt-realtime-2)，一款全新的实时语音模型，支持为语音到语音的智能体配置推理能力，并附带 [GPT-Realtime-Translate](https://developers.openai.com/api/docs/models/gpt-realtime-translate) 用于流式语音翻译，以及 [GPT-Realtime-Whisper](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 用于流式语音转文本。

更新了 [实时与音频指南](https://developers.openai.com/api/docs/guides/realtime)，新增了专用的 [实时翻译指南](https://developers.openai.com/api/docs/guides/realtime-translation)，更新了 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription) 用于流式转录，并将实时提示相关指导迁移到 [使用实时模型](https://developers.openai.com/api/docs/guides/realtime-models-prompting).

### 5 月 7 日

功能

发布了 [OpenAI Developers Codex 插件](https://developers.openai.com/learn/developers-codex-plugin)。它可以帮助你在 Codex 中构建 AI 应用和智能体，并获取 OpenAI Platform 访问权限以及 OpenAI API 配置指导。

### 5 月 6 日

更新

更新后的 Agents SDK 现已支持 TypeScript，并内置了对沙箱 智能体 的支持以及一个开源的 harness。了解详情 [这里](https://developers.openai.com/api/docs/guides/agents).

### May 5

更新 · Model: chat-latest

已发布 `chat-latest` 指向 ChatGPT 当前使用的最新 Instant 模型的快照。我们建议利用 [GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) 用于生产环境 API 使用，但你可以自由地使用此模型来测试我们在聊天用例方面的最新改进。底层模型快照会定期更新。了解更多 [这里](https://developers.openai.com/api/docs/models/chat-latest).

### May 4

更新

Admin API 现在已在面向 Node、Python、Go、Ruby 和 Java 的 OpenAI SDK 中受支持。参见 [Admin API 指南](https://developers.openai.com/api/docs/guides/admin-apis) 以获取设置说明和示例。

## 2026 年 4 月

### 4 月 24 日

特性 · 模型：gpt-5.5 · 模型：gpt-5.5-pro · API: v1/responses · API: v1/chat/completions · API: v1/batch

已发布 [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)，一款面向复杂专业工作的全新前沿模型，加入到 Chat Completions 和 Responses API 中，并发布了 [GPT-5.5 Pro](https://developers.openai.com/api/docs/models/gpt-5.5-pro) 用于 Responses API 请求，以处理那些能受益于更多算力的更难问题。

GPT-5.5 支持 1M token 上下文窗口、图像输入、结构化输出、函数调用、提示缓存、Batch、tool search、内置 computer use、托管 shell、apply patch、Skills、MCP 以及网页搜索。关键更新包括：
- 推理力度现在默认为 `medium`.
- 当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 [原始行为](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).
- GPT-5.5 的缓存仅支持扩展提示缓存，不支持内存提示缓存。
了解更多 [此处](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5#behavioral-changes).

### 4 月 21 日

功能 · 模型：gpt-image-2 · API: v1/images/generations · API: v1/images/edits · API: v1/batch

已发布 [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2)，一款用于图像生成与编辑的最先进图像生成模型。GPT Image 2 支持灵活的图像尺寸、高保真度的图像输入、基于 token 的图像定价，以及 Batch API 支持（享受 50% 折扣）。

### Apr 15

更新

更新了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 带来全新能力，包括：
- 在受控沙箱中运行 智能体；
- 检查和定制开源 harness；以及
- 控制记忆的创建时机和存储位置。

## 2026 年 3 月

### 3 月 17 日

Feature · Model: gpt-5.4-mini · Model: gpt-5.4-nano · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini) 和 [GPT-5.4 nano](https://developers.openai.com/api/docs/models/gpt-5.4-nano) 接入 Chat Completions 与 Responses API。GPT-5.4 mini 将 GPT-5.4 级别的能力带到更快、更高效的模型中，适用于高吞吐量工作负载；而 GPT-5.4 nano 针对速度与成本最关键的高吞吐量简单任务进行了优化。

GPT-5.4 mini 支持 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search), built-in [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)，以及 [compaction](https://developers.openai.com/api/docs/guides/compaction). GPT-5.4 nano supports compaction, but does not support tool search or computer use.

### 3 月 16 日

更新 · 模型：gpt-5.3-chat-latest

更新了 [gpt-5.3-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest) slug，用于指向 ChatGPT 当前使用的最新模型。

### 3月13日

修复 · 模型：gpt-5.4 · API: v1/responses · API: v1/chat/completions

更新了我们的图像编码器，以修复 `input_image` GPT-5.4 输入方面的一个小 bug。部分图像理解用例的质量可能因此得到改善，无需任何额外操作。

### 3 月 12 日

功能 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos · API：v1/videos/characters · API：v1/videos/extensions · API：v1/batch

扩展了 Sora API，新增可复用的角色引用、最长可达 `20` 秒的生成时长、 `1080p` 输出、 `sora-2-pro`、视频扩展以及对 API 的批量调用支持，可用于 `POST /v1/videos`. `1080p` 生成任务，按 `sora-2-pro` 每秒计费。了解更多 `$0.70` 每秒计费。了解更多 [这里](https://developers.openai.com/api/docs/guides/video-generation).

### 3 月 12 日

更新 · 模型：sora-2 · 模型：sora-2-pro · API：v1/videos/edits · API：v1/videos/{video_id}/remix

新增 `POST /v1/videos/edits` ，用于编辑已有视频。该功能将取代 `POST /v1/videos/{video_id}/remix`，后者将于 `6` 个月后弃用。了解更多 [这里](https://developers.openai.com/api/docs/guides/video-generation#edit-existing-videos).

### 3 月 5 日

功能 · 模型：gpt-5.4 · 模型：gpt-5.4-pro · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)，我们面向专业工作的最新前沿模型，已上线 Chat Completions 和 Responses API，并发布了 [GPT-5.4 Pro](https://developers.openai.com/api/docs/models/gpt-5.4-pro) 至 Responses API，用于可受益于更多算力的更难题。

同期发布：
- [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 在 Responses API 中，它允许模型将大型工具集延迟到运行时再加载，以减少 token 用量、保持缓存性能并改善延迟。
- 内置 [计算机使用](https://developers.openai.com/api/docs/guides/tools-computer-use) GPT-5.4 通过 Responses API 提供支持 `computer` 用于基于截图的 UI 交互的工具。
- 1M token 上下文窗口以及原生 [压缩](https://developers.openai.com/api/docs/guides/compaction) 支持，用于运行时间更长的 智能体 工作流。

### 3 月 3 日

功能 · 模型：gpt-5.3-chat-latest · API：v1/chat/completions · API：v1/responses

已发布 `gpt-5.3-chat-latest` 到 Chat Completions 和 Responses API。该模型指向 ChatGPT 当前使用的 GPT-5.3 Instant 快照。阅读更多 [这里](https://developers.openai.com/api/docs/models/gpt-5.3-chat-latest).

## 2026 年 2 月

### 2 月 24 日

功能 · API: v1/responses · API: v1/chat/completions

扩展 `input_file` 支持，可接受更多文档、演示文稿、电子表格、代码和文本文件类型。了解更多 [这里](https://developers.openai.com/api/docs/guides/file-inputs).

### 2 月 24 日

功能 · API: v1/responses

已发布 `phase` 到 Responses API。它将助手消息标记为中间评论（`commentary`）或最终答案（`final_answer`）。了解更多 [这里](https://developers.openai.com/api/docs/%3Chttps://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20easy_input_message%20%3E%20(schema)%20%3E%20(property)%20phase>).

### 2 月 24 日

功能 · 模型：gpt-5.3-codex · API: v1/responses

已发布 `gpt-5.3-codex` 到 Responses API。了解更多 [这里](https://developers.openai.com/api/docs/models/gpt-5.3-codex).

### 2月23日

功能 · API: v1/responses

已为 Responses API 上线 WebSocket 模式。了解详情 [这里](https://developers.openai.com/api/docs/guides/websocket-mode/).

### 2月23日

功能 · 模型：gpt-realtime-1.5 · 模型：gpt-audio-1.5 · API：v1/realtime · API：v1/chat/completions

已发布 [GPT-Realtime-1.5](https://developers.openai.com/api/docs/models/gpt-realtime-1.5) 到 Realtime API。

已发布 `gpt-audio-1.5` 到 Chat Completions API。阅读更多 [这里](https://developers.openai.com/api/docs/models/gpt-audio-1.5).

### 2 月 10 日

特性 · 模型：gpt-image-1.5 · 模型：gpt-image-1 · 模型：gpt-image-1-mini · 模型：chatgpt-image-latest · API：v1/batch

[Batch API](https://developers.openai.com/api/docs/guides/batch) 现已在 GPT Image 模型中受支持： `gpt-image-1.5`, `chatgpt-image-latest`, `gpt-image-1`，以及 `gpt-image-1-mini`.

### 2 月 10 日

更新 · 模型：gpt-5.2-chat-latest

更新了 [gpt-5.2-chat-latest](https://developers.openai.com/api/docs/models/gpt-5.2-chat-latest) slug，用于指向 ChatGPT 当前使用的最新模型。

### 2 月 10 日

功能 · API: v1/responses

已上线 [服务端 压缩](https://developers.openai.com/api/docs/guides/compaction#server-side-compaction) 功能，适用于 Responses API。

### 2 月 10 日

功能 · API: v1/responses

上线了对 [Skills](https://developers.openai.com/api/docs/guides/tools-skills) 的支持，在 Responses API 中可用。我们同时支持本地执行和基于托管容器的执行两种 Skills 方式。

### 2 月 10 日

功能 · API: v1/responses

推出了新的 [Hosted Shell](https://developers.openai.com/api/docs/guides/tools-shell#hosted-shell-quickstart) 工具，并支持容器中的网络功能。

### 2 月 9 日

功能 · 模型: gpt-image-1.5 · 模型: gpt-image-1 · 模型: gpt-image-1-mini · 模型: chatgpt-image-latest · API: v1/images/edits

新增对 `application/json` 请求的支持，该 `/v1/images/edits` 适用于 GPT 图像模型。JSON 请求使用 `images` (以及可选的 `mask`) 并通过 `image_url` 或 `file_id` 引用,而不是 multipart 上传。

### Feb 3

更新 · 模型: gpt-5.2 · 模型: gpt-5.2-codex

我们已为 API 客户优化了推理栈，并且 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2) 和 [GPT-5.2-Codex](https://platform.openai.com/docs/models/gpt-5.2-codex) 现在的运行速度提升了约 40%。模型及模型权重保持不变。

## 2026 年 1 月

### 1 月 15 日

公告

已公布 [Open Responses](https://www.openresponses.org/): 一个开源规范，用于构建基于原始 OpenAI Responses API 的多提供商、可互操作的 LLM 接口。

### 1 月 14 日

特性 · 模型：gpt-5.2-codex · API：v1/responses

已发布 `gpt-5.2-codex` 到 Responses API。GPT-5.2-Codex 是 GPT-5.2 针对 Codex 或类似环境中智能体编码任务优化的版本。了解更多 [这里](https://platform.openai.com/docs/models/gpt-5.2-codex).

### Jan 13

功能 · API：v1/realtime

为 Realtime API 新增了专用的 SIP IP 段。 `sip.api.openai.com` 负责 GeoIP 路由，并将 SIP 流量定向到最近的区域。 [了解详情](https://developers.openai.com/api/docs/guides/realtime-sip#dedicated-sip-ip-ranges).

### Jan 13

更新 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini

更新了 [`gpt-realtime-mini`](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [`gpt-audio-mini`](https://platform.openai.com/docs/models/gpt-audio-mini) slug 指向 2025-12-15 快照。如果你需要之前的模型快照，请使用 `gpt-realtime-mini-2025-10-06` 和 `gpt-audio-mini-2025-10-06`.

### Jan 13

更新 · 模型：sora-2

更新了 [sora-2](https://platform.openai.com/docs/models/sora-2) slug 指向 `sora-2-2025-12-08`。如果你需要之前的模型快照，请使用 `sora-2-2025-10-06`.

### Jan 13

更新 · 模型：gpt-4o-mini-tts · 模型：gpt-4o-mini-transcribe

更新了 `gpt-4o-mini-tts` 和 `gpt-4o-mini-transcribe` slug 指向 `2025-12-15` 快照。如果你需要之前的模型快照，请使用 `gpt-4o-mini-tts-2025-03-20` 和 `gpt-4o-mini-transcribe-2025-03-20`。我们目前推荐使用 `gpt-4o-mini-transcribe` 而非 `gpt-4o-transcribe` 以获得最佳效果。

### Jan 9

修复 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

修复了在以下情况下出现的问题： `gpt-image-1.5` 和 `chatgpt-image-latest` 在通过以下方式执行图像编辑时错误地使用了高保真度： `/v1/images/edits`，即使 `fidelity` 被显式设置为 `low` （默认值）。

## 2025 年 12 月

### 12 月 19 日

更新 · Model: gpt-image-1.5 · Model: chatgpt-image-latest

新增 `gpt-image-1.5` 和 `chatgpt-image-latest` 迁移到 Responses API 图像生成工具。

### Dec 16

功能 · 模型：gpt-image-1.5 · 模型：chatgpt-image-latest

已发布 [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) 和 [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest)，我们最新、最先进的图像生成模型。阅读更多 [这里](https://platform.openai.com/docs/guides/image-generation).

### Dec 15

功能 · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-4o-mini-transcribe · 模型：gpt-4o-mini-tts

发布了四个新的带日期音频快照。这些更新为实时、语音驱动的应用带来了可靠性、质量和语音保真度的改进。了解更多 [这里](https://developers.openai.com/blog/updates-audio-models).
- gpt-realtime-mini-2025-12-15
- gpt-audio-mini-2025-12-15
- gpt-4o-mini-transcribe-2025-12-15
- gpt-4o-mini-tts-2025-12-15

本次发布还包括支持 [自定义语音](https://platform.openai.com/docs/guides/text-to-speech#custom-voices) 面向符合条件的客户。

### 12 月 11 日

功能 · Model: gpt-5.2 · Model: gpt-5.2-chat-latest · API: v1/responses · API: v1/chat/completions

已发布 [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), 是 GPT-5 模型系列中最新旗舰模型。与上一代 GPT-5.1 相比,GPT-5.2 在以下方面有所改进:
- 通用智能
- 指令遵循
- 准确性与 token 效率
- 多模态——尤其是视觉
- 代码生成——尤其是前端 UI 创建
- API 中的工具调用与上下文管理
- 电子表格的理解与创建。

5.2 的新特性包括新增的 xhigh 推理力度级别、简洁的推理摘要，以及使用压缩实现的新上下文管理。

### 12 月 11 日

功能 · API: v1/responses/compact

已发布 [客户端压缩](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced)。对于与 Responses API 的长时间对话，你可以使用 `/responses/compact` 端点来缩减每次回合发送的上下文。

### 12月4日

Feature · Model: gpt-5.1-codex-max · API: v1/responses

已发布 `gpt-5.1-codex-max` 调用 Responses API。GPT-5.1-Codex 是我们最智能的编码模型，专为长周期、agentic 编码任务而优化。了解详情 [这里](https://platform.openai.com/docs/models/gpt-5.1-codex-max).

## 2025年11月

### 11月20日

功能 · API：v1/realtime

在 Realtime API 中新增对 DTMF 按键的支持。现在你可以在使用 Realtime 旁路连接时接收 DTMF 事件。详见 [相关文档](https://platform.openai.com/docs/api-reference/realtime-server-events/input_audio_buffer/dtmf_event_received) 了解更多信息。

### 11 月 13 日

功能 · 模型：gpt-5.1 · 模型：gpt-5.1-codex · 模型：gpt-5.1-chat-latest · 模型：gpt-5.1-codex-mini · API：v1/responses · API：v1/chat/completions

已发布 [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1)，GPT-5 模型家族中最新一代的旗舰模型。GPT-5.1 在以下方面经过了特别强化训练：

- 在所需思考较少时实现更强的可引导性和更快的响应
- 代码生成和编码相关用例
- 智能体工作流

请注意，GPT-5.1 默认采用一种新的 `none` reasoning 设置，可在所需思考量较少时提供更快的响应——与 GPT-5 中先前的 `medium` 默认设置不同。

### 11 月 13 日

功能

已发布 [增强型基于角色的访问控制 (RBAC)](https://platform.openai.com/docs/guides/rbac#page-top)。基于角色的访问控制 (RBAC) 让你可以决定组织内各项目和跨项目的成员能够执行哪些操作——既可以通过 API，也可以在 Dashboard 中进行。

### 11 月 13 日

功能 · 模型：gpt-5.1-codex · 模型：gpt-5.1-codex-mini · API：v1/responses

已发布 `gpt-5.1-codex` 和 `gpt-5.1-codex-mini` 到 Responses API。GPT-5.1-Codex 是针对 Codex 或类似环境中的智能体编码任务优化的 GPT-5.1 版本。了解更多 [这里](https://platform.openai.com/docs/models/gpt-5.1-codex).

### 11 月 13 日

功能

已发布 [扩展的提示缓存保留](https://platform.openai.com/docs/guides/prompt-caching#extended-prompt-cache-retention)。扩展的提示缓存保留使缓存的前缀保持更长时间的可用状态，最长可达 24 小时。扩展提示缓存的工作原理是，当显存占满后将键/值张量卸载到 GPU 本地存储，从而显著增加可用于缓存的存储容量。

## 2025 年 10 月

### 10 月 29 日

功能 · 模型：gpt-oss-safeguard-120b · 模型：gpt-oss-safeguard-20b

gpt-oss-safeguard-120b 和 gpt-oss-safeguard-20b 是基于 gpt-oss 构建的安全推理模型。了解更多 [这里](https://huggingface.co/collections/openai/gpt-oss-safeguard).

### Oct 24

功能

已发布 [企业密钥管理 (EKM)](https://platform.openai.com/docs/guides/your-data#enterprise-key-management-ekm)。企业密钥管理 (EKM) 允许你使用由你自己的外部密钥管理系统 (KMS) 管理的密钥，对你在 OpenAI 的客户内容进行加密。

### Oct 24

功能

已发布 [英国数据驻留](https://platform.openai.com/docs/guides/your-data#data-residency-controls).

### 10月6日

功能 · 模型：gpt-5-pro · 模型：gpt-realtime-mini · 模型：gpt-audio-mini · 模型：gpt-image-1-mini · 模型：sora-2 · 模型：sora-2-pro · API：v1/responses · API：v1/batch · API：v1/chat/completions · API：v1/videos · API：v1/realtime · API：v1/images/generations

在 OpenAI DevDay 上发布了多项新功能 [该公司 DevDay](https://openai.com/devday/):

已发布 [GPT-5 Pro](https://developers.openai.com/api/docs/models/gpt-5-pro)，它是 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5) 的一个版本，使用更多算力进行更深入的思考，从而持续提供更优质的答案。

已发布 [GPT-Realtime mini](https://developers.openai.com/api/docs/models/gpt-realtime-mini) 和 [gpt-audio-mini](https://developers.openai.com/api/docs/models/gpt-audio-mini) ，以提供更具性价比的语音对语音性能。

已发布 [gpt-image-1-mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini) 用于更具成本效益的图像生成与编辑。

已上线 [v1/videos](https://developers.openai.com/api/docs/guides/video-generation) 使用我们最新的 [Sora 2](https://developers.openai.com/api/docs/models/sora-2) 和 [Sora 2 Pro](https://developers.openai.com/api/docs/models/sora-2-pro) 模型，以实现丰富、细致且动态的视频生成与混剪。

已上线 [智能体 Builder](https://developers.openai.com/api/docs/guides/agent-builder) 以可视化方式创建自定义的多智能体工作流。

已上线 [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)，一个用于部署智能体的可嵌入聊天界面。

已发布 [追踪评估、数据集和提示优化工具](https://developers.openai.com/api/docs/guides/agent-evals).

[评估](https://developers.openai.com/api/docs/guides/evals)：发布第三方模型支持。

已上线 [服务健康仪表板](https://platform.openai.com/settings/organization/service-health).

### 10月1日

功能

已发布 [IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist). IP 允许列表功能将 API 访问限制为仅你指定的 IP 地址或地址段。

## 2025 年 9 月

### 9 月 26 日

功能 · API: v1/responses

新增支持将图像和文件作为 [工具调用输出](https://developers.openai.com/api/docs/docs/guides/function-calling#how-it-works) 在 Responses API 中。

### 9月23日

功能 · 模型：gpt-5-codex · API：v1/responses

发布专用模型 [gpt-5-codex](https://developers.openai.com/api/docs/models/gpt-5-codex)，专为与 [Codex CLI](https://github.com/openai/codex).

## 2025 年 8 月

### 8 月 28 日

功能 · API：v1/realtime

OpenAI Realtime API 现已正式发布。了解更多， [请参阅我们的 Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime).

### Aug 21

功能 · API: v1/responses

新增对 [连接器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 到 Responses API。连接器是 OpenAI 维护的 MCP 包装器，适用于 Google 应用、Dropbox 等热门服务，可用于为模型提供对这些服务中存储数据的读取访问权限。

### 8月20日

功能 · API：v1/conversations · API：v1/responses · API：v1/assistants

发布了 Conversations API，允许你使用 Responses API 创建和管理长时间运行的对话。详见 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 以查看对比，并了解如何从 Assistants API 集成迁移到 Responses 和 Conversations。

### Aug 7

功能 · API：v1/chat/completions · API：v1/responses

在 API 中发布了 GPT-5 系列模型，包括 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5), [`gpt-5-mini`](https://developers.openai.com/api/docs/models/gpt-5-mini)，以及 [`gpt-5-nano`](https://developers.openai.com/api/docs/models/gpt-5-nano).

引入了 `minimal` [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning) 取值，用于在支持推理的 GPT-5 模型中优化快速响应。

引入了 `custom` [tool call](https://developers.openai.com/api/docs/guides/function-calling#custom-tools) 类型，允许在工具调用时向模型输入自由格式的内容并从模型输出自由格式的内容。

## 2025 年 6 月

### 6 月 27 日

功能

上线了对 [优先级处理](https://platform.openai.com/docs/guides/priority-processing)。与标准处理相比，优先级处理可显著降低延迟并提供更稳定的延迟表现，同时保留按量付费的灵活性。

### 6 月 24 日

功能 · 模型：o3-deep-research · 模型：o3-deep-research-2025-06-26 · 模型：o4-mini-deep-research · 模型：o4-mini-deep-research-2025-06-26 · API：v1/responses

已发布 [o3-deep-research](https://developers.openai.com/api/docs/models/o3-deep-research) 和 [o4-mini-deep-research](https://developers.openai.com/api/docs/models/o4-mini-deep-research)，是我们 o 系列推理模型的深度研究变体，专为深度分析和研究任务而优化。更多信息请参阅 [深度研究指南](https://developers.openai.com/api/docs/guides/deep-research).

新增对异步事件处理的支持，通过 [webhooks](https://developers.openai.com/api/docs/guides/webhooks). [降低并简化定价](https://developers.openai.com/api/docs/pricing) 针对 网页搜索 工具。新增对 [网页搜索 工具](https://developers.openai.com/api/docs/guides/tools-web-search).

### Jun 13

功能 · API: v1/responses

[全新可复用提示词](https://developers.openai.com/chat/edit) 现已在仪表板中提供，并 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。中提供。通过 API，你现在可以引用在仪表板中创建的模板，方法是使用 `prompt` 参数（通过提示词 `id`，可选 `version`）并提供动态 `variables` ，其中可以包含字符串、图像或文件输入。Chat Completions 中暂不支持可复用提示词。 [了解详情](https://developers.openai.com/api/docs/guides/text?api-mode=responses#reusable-prompts).

### 6月10日

功能 · 模型：o3-pro · API：v1/responses · API：v1/batch

已发布 [o3-pro](https://developers.openai.com/api/docs/models/o3-pro)，这是 [o3](https://developers.openai.com/api/docs/models/o3) 推理模型的一个版本，通过使用更多算力来回答难题，从而获得更好的推理能力与一致性。 [o3 模型的价格也已降低](https://developers.openai.com/api/docs/pricing) ，覆盖所有 API 请求，包括 batch 和 flex 处理。

### 6月4日

功能 · API：v1/fine_tuning

为以下模型新增 [直接偏好优化](https://developers.openai.com/api/docs/guides/direct-preference-optimization) 微调支持 `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`，以及 `gpt-4.1-nano-2025-04-14`.

### 6月 3 日

功能 · API：v1/chat/completions · API：v1/realtime

为以下模型提供新的快照： [gpt-4o-audio-preview](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [gpt-4o-realtime-preview](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview)。已发布 [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

## 2025-5

### 5-20

功能 · API: v1/responses

新增对 Responses API 中新内置工具的支持，包括 [远程 MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 和 [代码解释器](https://developers.openai.com/api/docs/guides/tools-code-interpreter). [详细了解工具](https://developers.openai.com/api/docs/guides/tools).

### 5-20

功能 · API: v1/responses · API: v1/chat/completions

新增对使用 `strict` 模式（用于工具架构）的支持，可在并行工具调用场景下配合未微调模型使用。
新增 [架构功能](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses#supported-schemas)，包括对 `email` 及其他模式的字符串校验，以及为数字和数组指定范围。

### May 15

Feature · Model: codex-mini-latest · API: v1/responses · API: v1/chat/completions

已上线 [codex-mini-latest](https://developers.openai.com/api/docs/models/codex-mini-latest) 在 API 中，针对与以下 接口 的搭配使用进行了优化： [Codex CLI](https://github.com/openai/codex).

### 5 月 7 日

Feature · API: v1/fine-tuning · API: v1/responses · API: v1/chat/completions

上线了对 [强化微调](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)。了解可用的 [微调方法](https://developers.openai.com/api/docs/guides/model-optimization). [gpt-4.1-nano](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 现已支持微调。

## 2025 年 4 月

### 4 月 30 日

功能

上线了对 [增强的 API 预算提醒与自动充值限额](https://platform.openai.com/settings/organization/limits).

### 4月23日

功能 · API: v1/images/generations · API: v1/images/edits

新增了一个新的图像生成模型， `gpt-image-1`。该模型为图像生成树立了新的标准，具有更高的质量和指令遵循能力。

更新了图像生成和编辑接口，以支持 `gpt-image-1` 模型特有的新参数。

### Apr 16

功能 · API：v1/chat/completions · API：v1/responses

新增了两款 o-series 推理模型， `o3` 和 `o4-mini`。它们在数学、科学、编码、视觉推理任务以及技术写作方面树立了新标准。

推出了 Codex，即我们的代码生成 CLI 工具。

### 4 月 14 日

功能 · 模型：gpt-4.1 · 模型：gpt-4.1-mini · 模型：gpt-4.1-nano · API：v1/responses · API：v1/chat/completions · API：v1/fine_tuning

新增 [`gpt-4.1`](https://developers.openai.com/api/docs/models/gpt-4.1), [`gpt-4.1-mini`](https://developers.openai.com/api/docs/models/gpt-4.1-mini)，以及 [`gpt-4.1-nano`](https://developers.openai.com/api/docs/models/gpt-4.1-nano) 模型接入到 API。这些新模型在指令遵循、代码生成以及更长的上下文窗口（最高 1M tokens）方面都有改进。 `gpt-4.1` 和 `gpt-4.1-mini` 可用于监督微调。已宣布弃用 [`gpt-4.5-preview`](https://developers.openai.com/api/docs/deprecations).

## 2025年3月

### 3月20日

更新 · API：v1/audio

新增 `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及 `whisper-1` 模型到 Audio API。

### Mar 19

Feature · Model: o1-pro · API: v1/responses · API: v1/batch

已发布 [o1-pro](https://developers.openai.com/api/docs/models/o1-pro)，这是 [o1](https://developers.openai.com/api/docs/models/o1) 推理模型的一个版本，通过使用更多算力来回答难题，从而获得更好的推理能力与一致性。

### 3 月 11 日

功能 · 模型：gpt-4o-search-preview · 模型：gpt-4o-mini-search-preview · 模型：computer-use-preview · API：v1/chat/completions · API：v1/assistants · API：v1/responses

发布了多个新模型和工具，以及一个用于智能体工作流的新 API：
  - 发布了 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，这是一个用于创建和使用智能体与工具的新API。
  - 为 Responses API 发布了一组内置工具： [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search), [文件搜索](https://developers.openai.com/api/docs/guides/tools-file-search)，以及 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).
  - 发布了 [Agents SDK](https://developers.openai.com/api/docs/guides/agents)，这是一个用于设计、构建和部署智能体的编排框架。
  - 宣布推出新模型： `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
  - 宣布计划将所有 [Assistants API](https://developers.openai.com/api/docs/assistants/migration) 功能迁移到更易用的 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)，并预计于 2026 年下线 Assistants（在实现完全功能对等之后）。

### 3 月 3 日

功能 · API：v1/fine_tuning/jobs

新增 `metadata` 为微调任务提供字段支持。

## 2025 年 2 月

### 2 月 27 日

Feature · Model: GPT-4.5 · API: v1/chat/completions · API: v1/assistants · API: v1/batch

发布了 [GPT-4.5](https://developers.openai.com/api/docs/models/gpt-4-5)—的研究预览版——迄今为止我们规模最大、能力最强的对话模型。GPT-4.5 具备高“情商”，并能很好地理解用户意图，因此在创意任务和智能体规划方面表现出色。

### Feb 25

功能

推出了 [API 使用情况仪表板更新](https://help.openai.com/en/articles/10478918-api-usage-dashboard)。本次更新响应了对更多数据筛选器的需求，例如项目选择、日期选择器以及细粒度的时间区间。同时还更好地支持跨不同产品和服务层级查看用量。

### 2 月 5 日

功能

欧洲数据驻留功能上线。了解详情 [这里](https://platform.openai.com/docs/guides/your-data).

## 2025年1月

### 1月31日

Feature · Model: o3-mini · Model: o3-mini-2025-01-31 · API: v1/chat/completions

已上线 [o3-mini](https://developers.openai.com/api/docs/models/o3-mini),一个全新的小型推理模型，针对科学、数学和编码任务进行了优化。

### Jan 21

功能 · 模型：o1

扩展了对 [o1 模型](https://platform.openai.com/docs/models/o1)。的访问权限。o1 系列模型通过强化学习训练，能够执行复杂推理。

## 2024 年 12 月

### 12 月 18 日

功能

已上线 [Admin API Key Rotations](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys)，使客户能够以编程方式轮换其管理员 接口 密钥。

Updated [Admin API Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites)，使客户能够在将用户邀请加入组织的同时，以编程方式邀请他们加入项目。

### 12月17日

功能 · 模型：o1 · 模型：gpt-4o · 模型：gpt-4o-mini · API：v1/fine_tuning · API：v1/chat/completions · API：v1/realtime

新增模型： [o1](https://developers.openai.com/api/docs/models/o1), [gpt-4o-realtime](https://developers.openai.com/api/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](https://developers.openai.com/api/docs/models/gpt-4o-audio-preview) 和 [更多](https://developers.openai.com/api/docs/models).

为以下产品新增 WebRTC 连接方式： [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

新增 [`reasoning_effort` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-reasoning_effort) （适用于 o1 模型）。

新增 [`developer` 消息角色](https://developers.openai.com/api/reference/resources/chat#chat-create-messages) （适用于 o1 模型）。请注意，o1-preview 和 o1-mini 不支持 system 或 developer 消息。

推出基于以下方法的偏好微调： [Direct Preference Optimization (DPO)](https://developers.openai.com/api/docs/guides/model-optimization#preference).

发布 Go 和 Java 的 beta SDK。 [了解详情](https://developers.openai.com/api/docs/libraries).

新增 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 支持，用于 [Python SDK](https://github.com/openai/openai-python).

### 12月4日

功能

已上线 [使用情况 API](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage)，使客户能够以编程方式查询 OpenAI API 上的活动与支出。

## 2024 年 11 月

### 11月20日

更新 · API: v1/chat/completions

已发布 [gpt-4o-2024-11-20](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中我们最新的模型。

### 11 月 4 日

特性 · API：v1/chat/completions

已发布 [Predicted Outputs](https://developers.openai.com/api/docs/guides/predicted-outputs)，可显著降低模型响应的延迟，前提是响应的大部分内容事先已知。这在仅做少量改动重新生成文档和代码文件内容时最为常见。

## 2024 年 10 月

### 10 月 30 日

特性 · 模型：gpt-4o-realtime-preview · 模型：gpt-4o-audio-preview · API：v1/chat/completions

新增了五种新的语音类型，于 [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 和 [Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

### 10月17日

功能 · 模型：gpt-4o-audio-preview · API：v1/chat/completions

已发布 [全新 `gpt-4o-audio-preview` 模型](https://developers.openai.com/api/docs/guides/audio) 用于 Chat Completions，同时支持音频输入和输出。它使用与 [Realtime API](https://developers.openai.com/api/docs/guides/realtime).

### 10月1日

功能 · API：v1/realtime · API：v1/chat/completions · API：v1/fine_tuning

在 OpenAI DevDay 上发布了多项新功能 [在旧金山举办的 OpenAI DevDay](https://openai.com/devday/):

[Realtime API](https://developers.openai.com/api/docs/guides/realtime)：通过 WebSockets 接口，快速构建语音到语音体验并集成到你的应用中。

[模型蒸馏](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)：使用来自大型前沿模型的输出，对成本效益更高的模型进行微调的平台。

[图像微调](https://developers.openai.com/api/docs/guides/model-optimization#vision)：使用图像和文本对 GPT-4o 进行微调，以提升视觉能力。

[评估](https://developers.openai.com/api/docs/guides/evals)：创建并运行自定义评估，以衡量模型在特定任务上的表现。

[提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching)：对最近出现过的输入令牌提供折扣和更快的处理速度。

[在 playground 中生成](https://developers.openai.com/chat/edit)：在 playground 中使用 Generate 按钮轻松生成提示、函数定义和结构化输出 schema。

## 2024 年 9 月

### 9 月 26 日

功能 · 模型：omni-moderation-latest · API：v1/moderations

已发布 [全新 `omni-moderation-latest` moderation model](https://developers.openai.com/api/docs/guides/moderation),它支持图像和文本(对于部分类别),新增了两个仅文本的危害类别,并且得分更加准确。

### 9月12日

功能 · 模型：o1-preview · 模型：o1-mini · API：v1/chat/completions

已发布 [o1-preview 和 o1-mini](https://developers.openai.com/api/docs/guides/reasoning)，是通过强化学习训练以执行复杂推理任务的新型大语言模型。

## 2024 年 8 月

### 8 月 29 日

功能 · API：v1/assistants

Assistants API 现已支持 [包括 文件搜索 工具所使用的 文件搜索 结果，以及自定义排序行为](https://developers.openai.com/api/docs/assistants/migration#improve-file-search-result-relevance-with-chunk-ranking).

### 8月20日

功能 · 模型：gpt-4o · API：v1/fine_tuning

正式发布 [`gpt-4o-2024-08-06` 微调](https://developers.openai.com/api/docs/guides/model-optimization)——所有 API 用户现在都可以微调最新的 GPT-4o 模型。

### 8月 15 日

更新 · 模型：gpt-4o · API：v1/chat/completions

已发布 [动态模型 `chatgpt-4o-latest`](https://developers.openai.com/api/docs/models/chatgpt-4o-latest)——该模型将指向 ChatGPT 使用的最新 GPT-4o 模型。

### 8 月 6 日

更新

已上线 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)——模型输出现在能可靠地遵循开发者提供的 JSON Schema。

已发布 [gpt-4o-2024-08-06](https://developers.openai.com/api/docs/models/gpt-4o)，gpt-4o 系列中我们最新的模型。

### Aug 1

更新

已上线 [管理和审计日志 API](https://developers.openai.com/api/reference/overview)，允许客户以编程方式管理其组织，并使用审计日志监控变更。审计日志记录功能必须在 [设置](https://platform.openai.com/settings/organization/general).

## 2024 年 7 月

### 7 月 24 日

更新

已上线 [自助 SSO 配置](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers),允许采用自定义和无限计费的企业客户针对其所需的 IDP 设置身份验证。

### Jul 23

更新

已上线 [GPT-4o mini 微调](https://developers.openai.com/api/docs/guides/model-optimization)，可在特定用例下实现更高的性能。

### 7月 18 日

更新

已发布 [GPT-4o mini](https://developers.openai.com/api/docs/models/gpt-4o-mini),我们价格亲民的智能小模型,适用于快速、轻量级的任务。

### 7 月 17 日

更新

已发布 [Uploads](https://developers.openai.com/api/reference/resources/uploads) 以分块方式上传大文件。

## 2024 年 6 月

### 6 月 6 日

更新

[并行函数调用](https://developers.openai.com/api/docs/guides/function-calling#configure-parallel-function-calling) 可在 Chat Completions 和 Assistants API 中通过传入以下参数禁用： `parallel_tool_calls=false`.

[.NET SDK](https://developers.openai.com/api/docs/libraries#dotnet-library) 正式发布 Beta 版。

### 6月 3 日

更新

新增对 [文件搜索 自定义](https://developers.openai.com/api/docs/assistants/migration#customizing-file-search-settings).

## 2024 年 5 月

### May 15

更新

新增对 [归档项目](https://developers.openai.com/projects) 。只有组织所有者才能访问此功能。

新增对 [设置费用限额](https://platform.openai.com/settings/organization/general) ，适用于按量付费客户的每个项目。

### May 13

更新

已发布 [GPT-4o](https://developers.openai.com/api/docs/models/gpt-4o) 在 API 中。GPT-4o 是我们最快且最具性价比的旗舰模型。

### May 9

更新

新增对 [向 Assistants API 发送图片输入。](https://developers.openai.com/api/docs/assistants/migration)

### 5 月 7 日

更新

新增对 [向 Batch API 提交微调模型](https://developers.openai.com/api/docs/guides/batch#model-availability) .

### 5 月 6 日

更新

新增 [`stream_options: {"include_usage": true}`](https://developers.openai.com/api/reference/resources/chat#chat-create-stream_options) 参数添加到 Chat Completions 和 Completions API。设置该参数后，开发者在使用流式传输时可以获取使用情况统计信息。

### May 2

更新

新增 [一个新的端点](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/delete) 用于从 Assistants API 的线程中删除消息。

## 2024 年 4 月

### 4 月 29 日

更新

新增了一个 [函数调用选项 `tool_choice: "required"`](https://developers.openai.com/api/docs/guides/function-calling#function-calling-behavior) 到 Chat Completions 和 Assistants API 中。

新增了一篇 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch) 以及 Batch API 对 [embeddings 模型](https://developers.openai.com/api/docs/guides/batch#model-availability)

### Apr 17

更新

推出对 Assistants [API](https://developers.openai.com/api/docs/assistants/migration) ，的一系列更新，包括一个新的 文件搜索 工具，每个智能体最多支持 10,000 个文件，新增的令牌控制，以及对工具选择的支持。

### Apr 16

更新

引入了 [基于项目层级](https://platform.openai.com/settings/organization/general) 按项目组织工作，包括创建 [API 密钥](https://developers.openai.com/api/reference/overview) 并按项目管理速率和费用限制（费用限制仅适用于企业客户）的能力。

### Apr 15

更新

已发布 [Batch API](https://developers.openai.com/api/docs/guides/batch)

### 4月9日

更新

已发布 [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/models/gpt-4-turbo) 已在 API 中正式发布

### 4 月 4 日

更新

新增对 [seed](https://developers.openai.com/api/reference/resources/fine_tuning) 在微调 API 中

新增对 [checkpoints](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 在微调 API 中

新增对 [在创建 Run 时添加消息](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_messages) 在 Assistants API 中

### Apr 1

更新

新增对 [按 run_id 筛选 Messages](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/list#messages-listmessages-run_id) 在 Assistants API 中

## 2024 年 3 月

### 3 月 29 日

更新

新增对 [temperature](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-temperature) 和 [assistant 消息创建](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/messages/methods/create#messages-createmessage-role) 在 Assistants API 中

### 3 月 14 日

更新

新增对 [streaming](https://developers.openai.com/api/docs/assistants/migration) 在 Assistants API 中

## 2024 年 2 月

### 2 月 9 日

更新

新增 [`timestamp_granularities` 参数](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps) 到 Audio API

### Feb 1

更新

已发布 [gpt-3.5-turbo-0125，更新后的 GPT-3.5 Turbo 模型](https://developers.openai.com/api/docs/models/gpt-3-5-turbo)

## 2024年1月

### 1月25日

更新

发布了 Embedding V3 模型和更新后的 GPT-4 Turbo 预览版

新增 [`dimensions` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-dimensions) 到 Embeddings API

## 2023年12月

### 12月20日

更新

新增 [`additional_instructions` 参数](https://developers.openai.com/api/reference/resources/beta/subresources/threads/subresources/runs/methods/create#runs-createrun-additional_instructions) 在 Assistants API 中运行创建操作

### Dec 15

更新

新增 [`logprobs` 和 `top_logprobs` 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 到 Chat Completions API

### 12月14日

更新

已更改 [函数参数](https://developers.openai.com/api/reference/resources/chat#chat-create-tools) 工具调用中的参数设为可选

## 2023 年 11 月

### 11 月 30 日

更新

已发布 [OpenAI Deno SDK](https://deno.land/x/openai)

### 11 月 6 日

更新

已发布 [GPT-4 Turbo Preview](https://developers.openai.com/api/docs/models/gpt-4-turbo), [更新的 GPT-3.5 Turbo](https://developers.openai.com/api/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](https://developers.openai.com/api/docs/guides/images-vision), [Assistants API](https://developers.openai.com/api/docs/assistants/migration), [在 API 中使用 DALL·E 3](https://developers.openai.com/api/docs/models/dall-e-3)，以及 [文本转语音 API](https://developers.openai.com/api/docs/guides/text-to-speech)

弃用 Chat Completions `functions` 参数 [以支持 `tools`](https://developers.openai.com/api/reference/resources/chat#chat-create-tools)

已发布 [OpenAI Python SDK V1.0](https://developers.openai.com/api/docs/libraries#python-library)

## 2023 年 10 月

### 10 月 16 日

更新

新增 [`encoding_format` 参数](https://developers.openai.com/api/reference/resources/embeddings/methods/create#embeddings-create-encoding_format) 到 Embeddings API

新增 `max_tokens` 到 [Moderation models](https://developers.openai.com/api/docs/models/text-moderation-latest)

### 10月6日

更新

新增 [function calling support](https://developers.openai.com/api/docs/guides/model-optimization#fine-tuning-examples) 微调的 API
