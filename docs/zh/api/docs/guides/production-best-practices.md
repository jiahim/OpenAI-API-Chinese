# 生产环境最佳实践

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

本指南提供了一整套最佳实践，帮助你从原型过渡到生产环境。无论你是经验丰富的机器学习工程师，还是刚入门的爱好者，本指南都应为你提供在生产环境中成功部署平台所需的工具：从保护对 API 的访问，到设计能够应对高流量的稳健架构。请使用本指南制定计划，尽可能顺利、高效地部署你的应用。

如果你想进一步探索投入生产的最佳实践，请观看我们的 Developer Day 演讲：

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

登录 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户后，你可以在 [组织设置](https://platform.openai.com/settings/organization/general)。中找到组织名称和组织 ID。组织名称是显示在用户界面中的组织标签。组织 ID 是组织的唯一标识符，可在 API 请求中使用。

属于多个组织的用户可以 [通过请求头](https://developers.openai.com/api/reference/overview#authentication) 指定某个 API 请求所使用的组织。这些 API 请求的用量会计入所指定组织的配额。如果未提供请求头，则按 [默认组织](https://platform.openai.com/settings/organization/api-keys) 计费。你可以在 [用户设置](https://platform.openai.com/settings/organization/api-keys).

你可以从 [Team 页面](https://platform.openai.com/settings/organization/team)。邀请新成员加入你的组织。成员可以是 **读者** 或 **所有者**.

读者：

- 可以发起 API 请求。
- 可以查看基础的组织信息。
- 可以在组织中创建、更新和删除资源（例如 Assistants），除非另有说明。

所有者：

- 拥有读取者的所有权限。
- 可以修改账单信息。
- 可以管理组织内的成员。

### 管理账单限额

输入账单信息后，OpenAI 会为你的组织设置一个已批准的使用额度。随着你在平台上使用量的增加以及从一个 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 升级到另一个层级，你的配额上限会自动提升。你可以在账户设置的 [额度](https://platform.openai.com/settings/organization/limits) 页面查看当前的使用额度。

在 [额度](https://platform.openai.com/settings/organization/limits) 页面设置支出提醒，以便在使用量超过特定金额时收到通知。若要强制执行月度上限，请设置硬性支出限额。硬性支出限额会在追踪到的支出达到上限时停止受影响的 API 流量，因此请查阅 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits) 后再在生产环境中启用。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面以获取你在请求中使用的 API 密钥。

这是一种相对直接的访问控制方式，但你必须注意保护这些密钥的安全。避免在代码或公共代码仓库中暴露 API 密钥；请将它们存储在安全的位置。你应该使用环境变量或密钥管理服务将密钥暴露给应用，这样就不需要在代码库中硬编码它们。更多信息请阅读我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

我们强烈建议你在创建项目 API 密钥时设置过期日期，并建立定期的密钥轮换流程。在密钥过期之前，创建一个新的替换密钥，更新你的应用以使用它，并在验证替换密钥可用后撤销旧密钥。

管理员可以在组织或项目级别的 [平台设置](https://platform.openai.com/settings/organization/general)。中强制设置 API 密钥的最长有效期。新密钥必须在配置的期限内过期，以防止它们无限期有效。项目级别的限制不能超过组织级别的限制。

该 **API 密钥治理** 部分允许组织管理员和项目管理员限制可以创建的 API 密钥类型。管理员可以仅允许服务帐户密钥、仅允许用户拥有的项目密钥，或禁用所有新的 API 密钥创建。组织级别的限制始终优先：项目设置可以增加限制，但不能放宽组织级别的限制。这些控制仅适用于新密钥的创建；现有的 API 密钥不受影响。

API 密钥的使用情况可以在 [使用情况页面](https://platform.openai.com/usage) 上监控，前提是已启用追踪功能。如果你使用的是 2023 年 12 月 20 日之前生成的 API 密钥，则默认情况下不会启用追踪功能。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)。上启用后续追踪。所有在 2023 年 12 月 20 日之后生成的 API 密钥均已启用追踪功能。任何之前的未追踪使用情况都将显示为 `Untracked` 在仪表板中。

### Staging projects

随着业务规模扩大，你可能需要为预发布环境和生产环境分别创建项目。你可以在控制台中创建这些项目，从而隔离开发与测试工作，避免意外影响到线上应用。你还可以限制用户对生产项目的访问权限，并为每个项目设置自定义的速率和支出上限。

## 扩展你的解决方案架构

在设计使用我们的API的生产级应用或服务时，考虑如何进行扩展以满足流量需求非常重要。无论选择哪家云服务提供商，你都需要考虑以下几个关键方面：

- **横向扩展**：你可能希望通过横向扩展你的应用来应对来自多个来源的请求。这可能涉及部署额外的服务器或容器来分担负载。如果选择这种扩展方式，请确保你的架构被设计为支持多节点，并且你已具备在这些节点之间均衡负载的机制。
- **纵向扩展**：另一种选择是纵向扩展你的应用，即增强单个节点可用的资源。这将涉及升级服务器的能力以处理额外的负载。如果选择这种扩展方式，请确保你的应用被设计为能够利用这些额外的资源。
- **缓存**：通过存储频繁访问的数据，你可以在无需重复调用我们的API的情况下提升响应时间。你的应用需要被设计为尽可能使用缓存数据，并在添加新信息时使缓存失效。例如，你可以将数据存储在数据库、文件系统或内存缓存中，具体取决于哪种方式对你的应用最合适。
- **负载均衡**：最后，考虑使用负载均衡技术，以确保请求在你的可用服务器之间均匀分布。这可能涉及在服务器前端使用负载均衡器，或使用 DNS 轮询。均衡负载有助于提升性能并减少瓶颈。

### 管理速率限制

在使用我们的 API 时，了解并规划好 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## Improving latencies

请查看我们最新的 [延迟
  优化指南](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指请求被处理并返回响应所需的时间。在本节中，我们将讨论影响我们文本生成模型延迟的一些因素，并提供如何降低延迟的建议。

补全请求的延迟主要受两个因素影响：模型和生成的 token 数量。补全请求的生命周期如下所示：

- 终端用户到 API 的延迟
- 处理提示词 token 的时间
- 采样/生成 token 的时间
- API 到终端用户的延迟



大部分延迟通常来自 token 生成步骤。

> **直觉**: 提示词令牌对补全调用的延迟影响很小。生成补全令牌所需的时间要长得多，因为令牌是一次生成一个的。生成长度越长，由于每个令牌都需要生成，延迟会不断累积。

### 影响延迟的常见因素及可能的缓解方法

既然我们已经了解了延迟的基础知识，接下来让我们看看影响延迟的各种因素，大致按照影响从大到小的顺序排列。

#### Model

我们的 API 提供了不同复杂度和通用性的模型。最强大的模型，例如 `gpt-6-astra`，可以生成更复杂、更多样化的补全结果，但处理你的查询时也会更慢。
像 `gpt-5.6-terra` 这样的模型以及 `gpt-5.6-luna` 可以更快、更便宜地生成响应，而 `gpt-6-astra` 是处理复杂任务时能力更强的默认选择。你可以根据自己的用例以及对速度、成本和质量之间的权衡，选择最合适的模型。

#### 补全 token 数

请求生成大量 token 的补全可能会导致延迟增加：

- **降低 max tokens**:对于生成 token 数量相近的请求， `max_tokens` 参数值较低的请求延迟更短。
- **添加停止序列**:为避免生成不必要的 token，请添加停止序列。例如，你可以使用停止序列来生成具有特定条目数量的列表。在这种情况下，通过使用 `11.` 作为停止序列，你可以生成仅包含 10 个条目的列表，因为当出现 `11.` 时生成将停止。 [阅读有关停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) ，了解更多上下文。
- **生成更少的 completions**:尽可能降低 `n` 和 `best_of` 的值，其中 `n` 表示每个 prompt 生成的 completions 数量，而 `best_of` 用于表示每个 token 具有最高对数概率的结果。

如果 `n` 这样的模型以及 `best_of` （二者都为 1，即默认值）时，生成的 token 数量至多等于 `max_tokens`.

如果 `n` （返回的补全数量）或 `best_of` （为候选而生成的补全数量）设置为 `> 1`，则每个请求都会生成多个输出。此时，你可以将生成的 token 数量视为 `[ max_tokens * max (n, best_of) ]`

#### 流式输出

设置 `stream: true` 在请求中启用该参数后，模型会在 token 可用时立即开始返回它们，而不是等待完整 token 序列生成完毕。它不会改变获取所有 token 的总时间，但可以缩短首个 token 的返回时间，对于那些希望展示部分进度或需要中途停止生成的应用来说很有帮助。这种方式可以带来更好的用户体验和 UX 改进，因此值得在流式传输场景中进行试验。

#### Batching

根据你的使用场景，批处理 _可能会有帮助_。如果你要向同一端点发送多个请求，可以 [将提示批量打包](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) 在同一次请求中发送。这可以减少你需要发起的请求次数。prompt 参数最多可容纳 20 个不同的提示。建议你测试这种方法，看看它是否有帮助。在某些情况下，你最终可能会增加生成的 token 数量，从而延长响应时间。

## 管理成本

若要监控你的费用，你可以设置一个 [通知阈值](https://platform.openai.com/settings/organization/limits) 在你的账户中，以便在超过特定使用阈值时接收电子邮件提醒。使用 [使用情况跟踪仪表板](https://platform.openai.com/settings/organization/usage) ，以便监控当前和过去计费周期内的 token 使用情况。

### 文本生成

将原型投入生产的一个挑战是为运行你的应用所产生的成本做预算。OpenAI 提供按量付费的 [按量付费定价模式](https://openai.com/api/pricing/)，按每 1,000 个 token（约合 750 个单词）计费。要估算你的成本，你需要预估 token 使用量。请综合考虑流量水平、用户与应用交互的频率以及你将要处理的数据量等因素。

**思考降低成本时，一个有用的思路是将成本视为 token 数量与每个 token 成本的函数。** 借助这一框架，你可以通过两种方式降低成本。首先，你可以通过将部分任务切换到更小的模型来降低每个 token 的成本，从而减少开销。或者，你也可以尝试减少所需的 token 数量。你可以通过多种方式实现这一点，例如使用更短的提示， [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或缓存常见的用户查询以避免重复处理。

你可以使用我们的交互式 [tokenizer 工具](https://platform.openai.com/tokenizer) 来帮助你估算成本。API 和 playground 也会在响应中返回 token 计数。在使用我们最强大的模型成功运行之后，你可以查看其他模型能否在更低延迟和成本下产生相同的结果。详细了解请参阅我们的 [token 使用帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型投入生产环境时，可能需要考虑制定 MLOps 策略。MLOps（机器学习运维）指的是管理机器学习模型端到端生命周期的过程，包括你可能使用我们的API微调的任何模型。在设计 MLOps 策略时，请考虑以下几个方面：

- 数据与模型管理：管理用于训练或微调你的模型的数据，并跟踪版本和变更。
- 模型监控：随时间跟踪模型的性能，检测潜在的问题或退化情况。
- 模型再训练：确保模型与数据变化或不断演进的需求保持一致，并按需进行再训练或微调。
- 模型部署：将模型及相关制品部署到生产环境的过程自动化。

仔细考虑应用这些方面，将有助于确保你的模型长期保持相关性和良好表现。

## 安全与合规

当你将原型投入生产环境时，需要评估并解决可能适用于你应用的安全与合规要求。这包括审视你所处理的数据、了解我们的 API 如何处理数据，以及确定你必须遵守哪些法规。我们的 [安全实践](https://www.openai.com/security) 这样的模型以及 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面、最新的文档。供你参考，以下是我们的 [隐私政策](https://openai.com/privacy/) 这样的模型以及 [使用条款](https://openai.com/api/policies/terms/).

你可能需要考虑的一些常见领域包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护措施，例如在可能的情况下进行加密或匿名化。同时，你应当遵循安全编码的最佳实践，例如输入清理和正确的错误处理。

### 安全最佳实践

在使用我们的API创建应用程序时，请参考我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) ，以确保你的应用程序安全且成功。这些建议强调了广泛测试产品的重要性、主动解决潜在问题，以及限制滥用机会。

## 业务考量

随着使用 AI 的项目从原型走向生产，考虑如何用 AI 构建优秀的产品以及它如何与你核心业务相联系就变得非常重要。我们当然没有全部答案，但一个很好的起点是我们开发者日上的一次分享，在那里我们与一些客户一起深入探讨了这个话题：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>