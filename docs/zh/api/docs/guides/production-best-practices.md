# 生产环境最佳实践

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

本指南提供了一套全面的最佳实践，帮助你从原型阶段过渡到生产阶段。无论你是经验丰富的机器学习工程师，还是刚入门的爱好者，本指南都应能为你提供在生产环境中成功运行该平台所需的工具：从保护对我们 API 的访问权限，到设计能够处理高流量的健壮架构。使用本指南可帮助你制定尽可能顺畅且高效的部署计划。

如果你希望进一步探索投入生产环境的最佳实践，请观看我们的 Developer Day 演讲：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/XGJNo8TpuVA?si=mvYm3Un23iHnlXcg"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## 设置你的组织

当你 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户后，你可以在你的 [组织设置](https://platform.openai.com/settings/organization/general)。中找到组织名称和 ID。组织名称是组织的标签，会显示在用户界面中。组织 ID 是组织的唯一标识符，可用于 API 请求。

属于多个组织的用户可以 [传递一个请求头](https://developers.openai.com/api/reference/overview#authentication) 来指定某个 API 请求使用哪个组织。这些 API 请求的用量会计入指定组织的配额。如果未提供请求头，则会使用 [默认组织](https://platform.openai.com/settings/organization/api-keys) 计费。你可以在你的 [用户设置](https://platform.openai.com/settings/organization/api-keys).

中更改默认组织。你可以从 [Team 页面](https://platform.openai.com/settings/organization/team)。邀请新成员加入你的组织。成员可以是 **读者** 或 **所有者**.

读者：

- 可以发起 API 请求。
- 可以查看组织的基本信息。
- 可以在组织中创建、更新和删除资源（如 Assistants），除非另有说明。

所有者：

- 拥有所有读者权限。
- 可以修改账单信息。
- 可以管理组织内的成员。

### 管理账单限额

输入结算信息后，OpenAI 会为你的组织设置一个已批准的使用额度。随着你在平台上的使用量增长并从一个 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 升至更高级别，你的额度上限会自动提升。你可以前往账户设置中的 [额度](https://platform.openai.com/settings/organization/limits) 页面查看当前的使用额度。

在该 [额度](https://platform.openai.com/settings/organization/limits) 页面上设置支出提醒，以便在使用量超过指定美元金额时发送通知。若要强制实施每月上限，请设置硬性支出限额。当受追踪的支出达到限额时，硬性支出限额会停止受影响的 API 流量，因此在生产环境中启用之前请参阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits) 。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面以获取你在请求中使用的 API 密钥。

这是一种相对直接的访问控制方式，但你必须谨慎保护这些密钥。避免在代码或公共代码仓库中泄露 API 密钥；应将它们存放在安全的位置。你应通过环境变量或密钥管理服务将密钥暴露给应用程序，这样就不必在代码库中硬编码它们。有关更多信息，请阅读我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

我们强烈建议你在创建项目 API 密钥时设置过期日期，并建立定期轮换密钥的流程。在密钥过期之前，创建一个新密钥，将你的应用程序更新为使用新密钥，并在确认新密钥可用后撤销旧密钥。

管理员可以在 [平台设置](https://platform.openai.com/settings/organization/general)。中按组织或项目级别强制设置最大 API 密钥有效期。新密钥必须在配置的期限内过期，以防止其无限期有效。项目限制不得超过组织限制。

API 密钥的使用情况可以在 [使用情况页面](https://platform.openai.com/usage) 上进行监控，前提是已启用追踪功能。如果你使用的是 2023 年 12 月 20 日之前生成的 API 密钥，则默认情况下不会启用追踪功能。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)。上启用后续追踪。在 2023 年 12 月 20 日之后生成的所有 API 密钥都已启用追踪功能。任何先前未追踪的使用记录将在仪表板中显示为 `Untracked` 。

### Staging projects

随着规模扩大，你可能需要为预发布和生产环境分别创建项目。你可以在仪表板中创建这些项目，以便隔离开发和测试工作，避免误改线上应用。你还可以限制用户对生产项目的访问权限，并为每个项目设置自定义的速率和额度限制。

## 扩展你的解决方案架构

在为生产环境中使用我们 API 的应用程序或服务进行设计时，需要考虑如何扩展以应对流量需求。无论选择哪家云服务提供商，你都需要考虑以下几个关键方面：

- **横向扩展**:你可能希望对应用进行横向扩展，以应对来自多个来源的请求。这可能涉及部署额外的服务器或容器来分担负载。如果选择这种扩展方式，请确保你的架构能够处理多个节点，并且已建立相应的机制来在各节点之间均衡负载。
- **纵向扩展**:另一种选择是对应用进行纵向扩展，也就是增强单个节点可用的资源。这涉及升级服务器的能力以处理额外的负载。如果选择这种扩展方式，请确保你的应用能够利用这些额外的资源。
- **缓存**:通过存储频繁访问的数据，你可以在无需重复调用我们的 API 的情况下提升响应速度。你的应用需要尽可能使用缓存数据，并在新增信息时使缓存失效。例如，你可以根据应用的实际需求，将数据存储在数据库、文件系统或内存缓存中。
- **负载均衡**:最后，考虑使用负载均衡技术，确保请求均匀分布到你可用的服务器上。这可能涉及在服务器前端使用负载均衡器，或使用 DNS 轮询。负载均衡有助于提升性能并减少瓶颈。

### 管理速率限制

在使用我们的API时，了解并规划好以下事项非常重要： [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## Improving latencies

查看我们最新的 [延迟
  优化](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指处理请求并返回响应所需的时间。在本节中，我们将讨论影响文本生成模型延迟的一些因素，并提供减少延迟的建议。

补全请求的延迟主要受两个因素影响：模型和生成的 token 数量。补全请求的生命周期如下：

- 终端用户到 API 的延迟
- 提示词令牌的处理时间
- 令牌的采样/生成时间
- API 到终端用户的延迟



大部分延迟通常来自令牌生成步骤。

> **直觉**:提示词令牌对补全调用的延迟影响很小。生成补全令牌所需的时间要长得多，因为令牌是一次生成一个的。更长的生成长度会因为每个令牌都需要生成而累积延迟。

### 影响延迟的常见因素及可能的缓解技术

既然我们已经了解了延迟的基本概念，接下来让我们看看各种可能影响延迟的因素，大致按影响从大到小排序。

#### 模型

我们的 API 提供了不同复杂度与通用性的模型。最强大的模型，例如 `gpt-6-astra`，能够生成更复杂、更多样化的补全结果，但处理查询所需的时间也相对更长。
而像 `gpt-5.6-terra` 并且 `gpt-5.6-luna` 可以更快、更低成本地生成 Responses,而 `gpt-6-astra` 在复杂任务需要更高上限时是更强的默认选择。你可以根据自己的用例,以及速度、成本和质量之间的权衡,选择最合适的模型。

#### 补全 token 数

请求生成大量 token 的补全可能会导致延迟增加：

- **降低 max tokens**：对于生成 token 数量相近的请求，那些具有较低 `max_tokens` 参数的请求延迟更低。
- **添加停止序列**：若要避免生成不必要的 token，可以添加一个停止序列。例如，你可以使用停止序列来生成具有特定数量的列表项。在这种情况下，通过使用 `11.` 作为停止序列，你只能生成 10 个列表项，因为当达到 `11.` 时，生成将停止。 [阅读关于停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) ，了解如何实现这一点的更多上下文。
- **生成更少的 completions**：在可能的情况下，降低 `n` 和 `best_of` 的值，其中 `n` 指的是为每个 prompt 生成的 completion 数量，而 `best_of` 用于表示每个 token 具有最高对数概率的结果。

如果 `n` 并且 `best_of` 都等于 1（即默认值），那么生成的令牌数量上限为 `max_tokens`.

如果 `n` （返回的补全数量）或 `best_of` （生成的候选补全数量）设置为 `> 1`，则每个请求都会生成多个输出。此时，可将生成的令牌数量视为 `[ max_tokens * max (n, best_of) ]`

#### 流式传输

Setting `stream: true` 在请求中设置 stream 可让模型在生成首个 token 时立即开始返回，而不是等到整段 token 序列生成完毕。它不会改变获取所有 token 的总耗时，但会缩短首个 token 的返回时间，适用于希望展示部分进度或提前停止生成的应用。这可以带来更好的用户体验和 UX 改进，值得在流式输出方面进行试验。

#### Batching

根据你的用例，批处理 _可能会有所帮助_。如果你向同一端点发送多个请求，可以 [将多个提示批量组合](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) 在同一请求中发送。这将减少你需要发起的请求数量。prompt 参数最多可容纳 20 个不同的提示。建议你试用此方法并查看效果。在某些情况下，你最终可能会增加生成的 token 数量，从而拖慢响应速度。

## 管理成本

若要监控你的费用，你可以在账户中设置 [通知阈值](https://platform.openai.com/settings/organization/limits) ，在超出特定使用阈值后通过邮件提醒你。使用 [使用情况跟踪仪表板](https://platform.openai.com/settings/organization/usage) 可监控当前和过往计费周期内的 token 使用量。

### 文本生成

将原型投入生产时面临的挑战之一是为运行应用的成本做预算。OpenAI 提供了一种 [按使用量付费的定价模式](https://openai.com/api/pricing/)，按每 1,000 个 token（约等于 750 个单词）计费。要估算成本，你需要预估 token 使用量。需要考虑诸如流量水平、用户与应用交互的频率以及你将要处理的数据量等因素。

**思考降低成本时，一个有用的框架是将成本视为 token 数量与每个 token 成本的函数。** 使用这个框架，你可以通过两种方式来降低成本。首先，你可以通过将某些任务切换到更小的模型来降低每个 token 的成本，从而减少开销。或者，你也可以尝试减少所需的 token 数量。你可以通过多种方式实现这一点，例如使用更短的提示， [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或缓存常见的用户查询以避免重复处理。

你可以使用我们的交互式 [tokenizer 工具](https://platform.openai.com/tokenizer) 来帮助你估算成本。API 和 playground 也会在响应中返回 token 计数。在你用我们最强大的模型让一切正常运行后，你可以看看其他模型是否能够以更低的延迟和成本产生相同的结果。在我们的 [token 使用量帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型推进到生产环境时，可能需要考虑制定一套 MLOps 策略。MLOps（机器学习运维）是指管理机器学习模型端到端生命周期的过程，包括你可能使用我们的 API 微调的模型。在设计 MLOps 策略时，请考虑以下几个方面：

- 数据和模型管理：管理用于训练或微调模型的数据，并追踪版本与变更。
- 模型监控：追踪模型在一段时间内的表现，并检测潜在的问题或性能下降。
- 模型再训练：确保模型随数据变化或需求演进而保持更新，并按需进行再训练或微调。
- 模型部署：将模型及相关构件部署到生产环境的过程自动化。

仔细考虑你应用的这些方面，将有助于确保你的模型长期保持相关性并表现良好。

## 安全与合规

当你将原型投入生产环境时，你需要评估并解决可能适用于你应用的任何安全和合规要求。这将涉及检查你正在处理的数据、了解我们的 API 如何处理数据，并确定你必须遵守哪些法规。我们的 [安全实践](https://www.openai.com/security) 并且 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面且最新的文档。供你参考，这是我们的 [隐私政策](https://openai.com/privacy/) 并且 [使用条款](https://openai.com/api/policies/terms/).

你需要考虑的一些常见领域包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护，例如在可能的情况下进行加密或匿名化。此外，你应遵循安全编码的最佳实践，例如输入清理和适当的错误处理。

### 安全最佳实践

当你使用我们的 API 创建应用时，请参考我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) 以确保你的应用安全可靠。这些建议强调了进行全面测试、积极应对潜在问题以及减少滥用机会的重要性。

## 业务考量

随着使用 AI 的项目从原型走向生产，考虑如何用 AI 构建优秀产品以及如何将其与你的核心业务相结合变得非常重要。我们当然没有所有答案，但一个很好的起点是我们 Developer Day 上的一次演讲，在那次演讲中我们与一些客户深入探讨了这个问题：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>