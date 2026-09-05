# 生产环境最佳实践

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

本指南提供了一套全面的最佳实践，帮助你从原型阶段过渡到生产阶段。无论你是经验丰富的机器学习工程师，还是刚入门的爱好者，本指南都应能为你提供成功将平台投入生产环境所需的工具：从保护对我们 API 的访问，到设计能够应对高流量的稳健架构。请使用本指南来帮助你制定尽可能顺畅且高效的应用部署计划。

如果你想进一步探索进入生产阶段的最佳实践，请观看我们的 Developer Day 演讲：

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

登录 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户后，可以在 [组织设置](https://platform.openai.com/settings/organization/general)。中找到你的组织名称和组织 ID。组织名称是组织在用户界面中显示的标签。组织 ID 是组织的唯一标识符，可在 API 请求中使用。

属于多个组织的用户可以 [通过传递请求头](https://developers.openai.com/api/reference/overview#authentication) 来指定某次 API 请求所使用的组织。这些 API 请求所产生的用量会计入指定组织的配额。如果未提供请求头，则会使用 [默认组织](https://platform.openai.com/settings/organization/api-keys) 计费。你可以在 [用户设置](https://platform.openai.com/settings/organization/api-keys).

你可以从 [Team 页面](https://platform.openai.com/settings/organization/team)。邀请新成员加入你的组织。成员可以是 **阅读者** 或 **所有者**.

阅读者：

- 可以发起 API 请求。
- 可以查看组织的基本信息。
- 可以在组织内创建、更新和删除资源（例如 Assistants），除非另有说明。

Owners:

- 拥有读者的所有权限。
- 可以修改账单信息。
- 可以管理组织内的成员。

### 管理账单限额

在你输入账单信息后，OpenAI 会为你的组织设置一个已批准的使用额度。你的配额限制会随着你在平台上使用量的增加以及从一个 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 升级到另一个而自动提升。你可以在账户设置中的 [限额](https://platform.openai.com/settings/organization/limits) 页面查看你当前的使用额度。

在 [限额](https://platform.openai.com/settings/organization/limits) 页面上设置消费提醒，以便在使用量超过特定金额时发送通知。要强制设置月度上限，可以设置硬性消费上限。硬性消费上限会在追踪到的消费达到上限时停止受影响的 API 流量，因此在生产环境中启用之前，请查看 [消费上限指南](https://developers.openai.com/api/docs/guides/spend-limits) 。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面以获取你将在请求中使用的 API 密钥。

这是一种相对直接的访问控制方式，但你必须时刻注意保护这些密钥的安全。请避免在代码或公开代码仓库中暴露 API 密钥；请将它们存放在安全的位置。你应当通过环境变量或密钥管理服务将密钥暴露给应用程序，这样就无需在代码库中硬编码它们。更多信息请阅读我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

API 密钥的使用情况可在 [使用情况页面](https://platform.openai.com/usage) 上进行监控，前提是已启用追踪。如果你使用的是 2023 年 12 月 20 日之前生成的 API 密钥，则默认不会启用追踪。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)。上启用后续追踪。2023 年 12 月 20 日之后生成的所有 API 密钥都已启用追踪。此前任何未追踪的使用情况将在仪表板中显示为 `Untracked` 。

### Staging projects

随着规模扩大，你可能希望为预发布和生产环境创建独立的项目。你可以在仪表板中创建这些项目，以便隔离开发与测试工作，避免意外影响线上应用。你还可以限制用户对生产项目的访问，并为每个项目设置自定义的速率与支出限制。

## 扩展你的解决方案架构

在为使用我们的 API 的生产环境应用或服务进行设计时，需要考虑如何扩展以满足流量需求。无论选择哪家云服务提供商，你都需要关注以下几个关键方面：

- **水平扩展**：你可能希望对应用进行水平扩展，以应对来自多个来源的请求。这可能涉及部署额外的服务器或容器来分担负载。如果你选择这种扩展方式，请确保你的架构经过设计，能够处理多个节点，并且具备在这些节点之间平衡负载的机制。
- **垂直扩展**：另一种选择是对应用进行垂直扩展，即为单个节点增加可用资源。这将涉及升级服务器的能力以处理额外的负载。如果你选择这种扩展方式，请确保你的应用经过设计，能够充分利用这些额外的资源。
- **缓存**：通过存储频繁访问的数据，你可以在不需要重复调用我们的API的情况下提高响应时间。你的应用需要经过设计，尽可能使用缓存数据，并在添加新信息时使缓存失效。有几种不同的实现方式，例如，你可以根据应用的具体需求，将数据存储在数据库、文件系统或内存缓存中。
- **负载均衡**：最后，考虑使用负载均衡技术，确保请求在可用的服务器之间均匀分配。这可能涉及在服务器前端使用负载均衡器，或使用 DNS 轮询。负载均衡有助于提升性能并减少瓶颈。

### 管理速率限制

在使用我们的 API 时，了解并规划以下事项非常重要： [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## 降低延迟

查看我们最新的 [延迟
  优化](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指处理请求并返回响应所需的时间。在本节中，我们将讨论影响文本生成模型延迟的一些因素，并提供降低延迟的建议。

补全请求的延迟主要受两个因素影响：模型和生成的 token 数量。补全请求的生命周期如下：

- 终端用户到 API 的延迟
- 处理提示词 token 的时间
- 采样/生成 token 的时间
- API 到终端用户的延迟



大部分延迟通常来自 token 生成步骤。

> **直觉**: 提示词 token 只会为补全调用增加极少的延迟。生成补全 token 的时间要长得多，因为 token 是一次生成一个的。生成长度越长，由于每个 token 都需要生成，延迟会不断累积。

### 影响延迟的常见因素及可能的缓解技巧

既然我们已经了解了延迟的基础知识，下面就来看看影响延迟的各种因素，大致按影响从大到小排序。

#### Model

我们的 API 提供了不同复杂度和通用程度的模型。最强大的模型，例如 `gpt-6-astra`，能够生成更复杂、更多样化的补全结果，但处理你的查询时也会花费更长时间。
诸如 `gpt-5.6-terra` 和 `gpt-5.6-luna` 这样的模型能够以更快、更便宜的方式生成 Responses，而 `gpt-6-astra` 在处理复杂任务需要更多余量时，是更稳妥的默认选择。你可以根据自己的用例以及对速度、成本和质量之间的权衡，选择最合适的模型。

#### 补全 token 数

请求生成大量 token 的补全可能会导致延迟增加：

- **降低 max tokens**：对于 token 生成量相近的请求，参数值更低的 `max_tokens` 参数产生的延迟更小。
- **添加停止序列**：为防止生成多余的 token，可以添加停止序列。例如，你可以使用停止序列来生成包含特定数量条目的列表。在这种情况下，通过使用 `11.` 作为停止序列，你只能生成包含 10 个条目的列表，因为当遇到 `11.` 时，补全将停止。 [阅读关于停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) 以了解更多关于如何实现这一点的背景信息。
- **生成更少的补全**：尽可能降低 `n` 和 `best_of` 的值，其中 `n` 表示为每个提示生成的补全数量，而 `best_of` 用于表示每个 token 具有最高对数概率的结果。

如果 `n` 和 `best_of` 两者都等于 1（默认值），那么生成的 token 数最多等于 `max_tokens`.

如果 `n` （返回的补全数量）或 `best_of` （为候选生成的补全数量）设置为 `> 1`，每个请求将创建多个输出。这里，你可以将生成的 token 数视为 `[ max_tokens * max (n, best_of) ]`

#### 流式传输

Setting `stream: true` 在请求中设置该参数会使模型一旦有可用 token 就立即开始返回，而不是等待完整 token 序列生成完毕。它不会改变获取所有 token 所需的时间，但会缩短首个 token 的返回时间，适用于需要展示部分进度或即将停止生成的应用。这可以带来更好的用户体验和 UX 改进，因此值得通过流式输出进行试验。

#### 批处理

根据你的使用场景，批处理 _可能会有所帮助_。如果你要向同一个端点发送多个请求，可以 [将提示词批量发送](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) ，在同一次请求中一并处理。这样可以减少你需要发起的请求次数。prompt 参数最多可容纳 20 个不同的提示词。建议你测试一下这种方法，看看是否有效。在某些情况下，你可能会增加生成的 token 数量，从而拖慢响应速度。

## 管理成本

若要监控你的费用，你可以在账户中设置一个 [通知阈值](https://platform.openai.com/settings/organization/limits) ，在超出特定使用阈值后通过电子邮件接收提醒。可使用 [使用情况跟踪面板](https://platform.openai.com/settings/organization/usage) 来监控当前和过往计费周期内的 token 使用情况。

### 文本生成

将原型投入生产环境所面临的挑战之一，是为运行应用程序的相关成本做好预算。OpenAI 提供按使用量付费的 [定价模式](https://openai.com/api/pricing/)，价格按每 1,000 个 token 计算（大致相当于 750 个单词）。要估算成本，你需要预测 token 使用量。请考虑流量水平、用户与应用程序交互的频率，以及要处理的数据量等因素。

**思考如何降低成本时，一个实用的框架是将成本视为 token 数量与每个 token 成本的函数。** 利用这一框架，可通过两种潜在途径降低成本。首先，你可以通过针对部分任务切换到更小的模型来降低每个 token 的成本。另一种方法是尝试减少所需的 token 数量。你可以通过多种方式实现这一点，例如使用更短的提示词， [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或缓存常见的用户查询，避免重复处理。

你可以试用我们的交互式 [分词工具](https://platform.openai.com/tokenizer) 来估算成本。API 和 playground 也会在响应中返回 token 计数。当你使用我们最强大的模型跑通后，可以尝试用其他模型是否能在更低延迟和更低成本下产出相同的结果。详细了解请参阅我们的 [token 使用帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型投入生产时，可能需要考虑制定 MLOps 策略。MLOps（机器学习运维）指的是对机器学习模型（包括你可能使用我们的API进行微调的模型）的端到端生命周期进行管理的过程。在设计 MLOps 策略时需要考虑多个方面，包括

- 数据和模型管理：管理用于训练或微调模型的数据，并跟踪版本和变更。
- 模型监控：随时间跟踪模型的性能，检测潜在的问题或退化。
- 模型再训练：确保模型跟上数据变化或不断演进的需求，并按需进行再训练或微调。
- 模型部署：自动化地将模型及相关构件部署到生产环境的过程。

对应用程序的这些方面进行思考，有助于确保你的模型在长期内保持相关性并表现良好。

## 安全与合规

当你将原型推进到生产环境时，需要评估并解决可能适用于你应用的任何安全和合规要求。这包括审视你所处理的数据、理解我们的API如何处理数据，以及确定你必须遵守哪些法规。我们的 [安全实践](https://www.openai.com/security) 和 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面、最新的文档。供你参考，以下是我们的 [隐私政策](https://openai.com/privacy/) 和 [使用条款](https://openai.com/api/policies/terms/).

你需要考虑的一些常见领域包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护措施，例如在可行的情况下进行加密或匿名化。此外，你应遵循安全编码的最佳实践，例如输入净化和适当的错误处理。

### 安全最佳实践

在使用我们的API构建应用时，请参考我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) 以确保你的应用安全可靠。这些建议着重强调了对产品进行全面测试的重要性，以及主动应对潜在问题、限制滥用可能性的必要性。

## 业务考量

随着使用 AI 的项目从原型走向生产，考虑如何用 AI 构建优秀的产品以及它如何与你的核心业务关联起来变得非常重要。我们当然没有所有答案，但一个很好的起点是我们 Developer Day 上的一次演讲，在那次演讲中我们与一些客户深入探讨了这一点：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>