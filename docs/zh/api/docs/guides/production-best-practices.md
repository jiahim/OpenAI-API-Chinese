# 生产环境最佳实践

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

本指南提供了一套全面的最佳实践，帮助你从原型过渡到生产环境。无论你是经验丰富的机器学习工程师还是刚入门的新手，本指南都能为你提供所需工具，帮助你在生产环境中成功运用该平台：从保障访问我们的API的安全，到设计能够应对高流量的稳健架构。请使用本指南来制定计划，尽可能平稳高效地部署你的应用程序。

如果你想进一步了解投入生产环境的最佳实践，请观看我们的开发者日演讲：

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

一旦你 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户，你可以在你的 [组织设置](https://platform.openai.com/settings/organization/general)中找到你的组织名称和 ID。组织名称是你的组织的标签，显示在用户界面中。组织 ID 是你的组织的唯一标识符，可用于 API 请求中。

属于多个组织的用户可以 [传递一个标头](https://developers.openai.com/api/reference/overview#authentication) 来指定某个 API 请求使用哪个组织。来自这些 API 请求的使用量将计入指定组织的配额。如果未提供标头，则 [默认组织](https://platform.openai.com/settings/organization/api-keys) 将被计费。你可以在你的 [用户设置](https://platform.openai.com/settings/organization/api-keys).

中更改你的默认组织。你可以从 [团队页面](https://platform.openai.com/settings/organization/team)邀请新成员加入你的组织。成员可以是 **读者** 或 **所有者**.

读者：

- 可以发起 API 请求。
- 可以查看基本组织信息。
- 除非另有说明，否则可以在组织中创建、更新和删除资源（如助手）。

拥有者：

- 拥有读者的所有权限。
- 可以修改账单信息。
- 可以管理组织内的成员。

### 管理账单限额

一旦你输入账单信息，OpenAI 会为你的组织设定一个批准的使用限额。你的配额限额将随着你在平台上的使用量增加以及你从 [用量层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 提升到另一个层级而自动增加。你可以在 [限额](https://platform.openai.com/settings/organization/limits) 页面的账户设置中查看当前的使用限额。

在 [限额](https://platform.openai.com/settings/organization/limits) 页面设置支出提醒，以便在使用超过一定金额时发送通知。要实施月度上限，请设置硬性支出限额。硬性支出限额会在跟踪支出达到限额时停止受影响的 API 流量，因此请先阅读 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits) 再在生产环境中启用。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面获取你在请求中将使用的 API 密钥。

这是一种相对直接的访问控制方式，但你必须警惕确保这些密钥的安全。避免在代码或公共仓库中暴露 API 密钥；相反，将它们存储在安全的位置。你应该使用环境变量或密钥管理服务将密钥暴露给你的应用程序，这样就不需要在代码库中硬编码它们。在我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

API 密钥使用情况可以在 [使用情况页面](https://platform.openai.com/usage) 上监控，一旦追踪已启用。如果你使用的是在 2023 年 12 月 20 日之前生成的 API 密钥，则默认情况下不会启用追踪。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)上启用后续追踪。所有在 2023 年 12 月 20 日之后生成的 API 密钥都已启用追踪。任何之前未追踪的使用情况将显示为 `Untracked` 在仪表板中。

### Staging 项目

随着规模扩大，你可能希望为预发布和生产环境创建独立的项目。你可以在控制台中创建这些项目，以便隔离开发和测试工作，从而避免意外干扰线上应用。你还可以限制用户对生产项目的访问权限，并为每个项目设置自定义的速率和支出限额。

## 扩展你的解决方案架构

在设计使用我们API的生产应用程序或服务时，重要的是要考虑如何扩展以满足流量需求。无论你选择哪家云服务提供商，都需要考虑几个关键领域：

- **水平扩展**：你可能希望水平扩展应用程序，以处理来自多个来源的请求。这可能涉及部署额外的服务器或容器来分担负载。如果选择这种扩展方式，请确保你的架构能够处理多个节点，并且已具备在节点之间平衡负载的机制。
- **垂直扩展**：另一种选择是垂直扩展应用程序，即为单个节点增加更多可用资源。这将涉及升级服务器的性能以处理额外的负载。如果选择这种扩展方式，请确保你的应用程序设计为能够充分利用这些额外资源。
- **缓存**：通过存储频繁访问的数据，你可以在无需重复调用我们的API的情况下提高响应时间。你的应用程序需要设计为尽可能使用缓存数据，并在添加新信息时使缓存失效。实现方式有多种。例如，你可以将数据存储在数据库、文件系统或内存缓存中，具体取决于哪种方式对你的应用程序最合适。
- **负载均衡**：最后，考虑负载均衡技术，以确保请求均匀分布到可用的服务器上。这可以是在服务器前使用负载均衡器，或使用 DNS 轮询。平衡负载有助于提高性能并减少瓶颈。

### 管理速率限制

使用我们的 API 时，理解并规划 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## 改善延迟

查看我们最新的指南： [延迟
  优化](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指请求被处理并返回响应所需的时间。在本节中，我们将讨论影响我们文本生成模型延迟的一些因素，并提供如何降低延迟的建议。

完成请求的延迟主要受两个因素影响：模型和生成的令牌数量。完成请求的生命周期如下：

- 最终用户到 API 的延迟
- 处理提示令牌的时间
- 采样/生成令牌的时间
- API 到最终用户的延迟



延迟的主要部分通常来自令牌生成步骤。

> **直观理解**：提示词令牌对完成调用的延迟影响很小。生成完成令牌所需的时间要长得多，因为令牌是一个接一个生成的。生成长度越长，由于每个令牌都需要生成，延迟就会累积增加。

### 影响延迟的常见因素及可能的缓解技术

现在我们已经了解了延迟的基础知识，接下来让我们看看各种可能影响延迟的因素，大致按影响从大到小排列。

#### 模型

我们的API提供不同级别的复杂度和通用性的模型。最强大的模型，如 `gpt-5.6`，可以生成更复杂和多样化的补全内容，但处理你的查询所需的时间也更长。
像 `gpt-5.6-terra` 和 `gpt-5.6-luna` 这样的模型可以生成更快、更便宜的响应，而 `gpt-5.6` 在需要应对复杂任务时是更强的默认选择。你可以选择最适合你的用例以及速度、成本和质量之间平衡的模型。

#### 完成令牌数量

请求大量生成的补全 tokens 可能会导致延迟增加：

- **降低最大令牌数**：对于生成令牌数量相近的请求，如果 `max_tokens` 参数较低，则延迟较低。
- **包含停止序列**：为防止生成不必要的令牌，可添加停止序列。例如，你可以使用停止序列生成具有特定项目数的列表。在这种情况下，通过使用 `11.` 作为停止序列，你可以生成仅包含10个项目的列表，因为当遇到 `11.` 时，生成将停止。 [阅读我们关于停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) 以获取更多关于如何实现此操作的上下文。
- **生成更少的完成结果**：在可能的情况下，降低 `n` 和 `best_of` 的值，其中 `n` 指为每个提示生成的完成结果数量，而 `best_of` 用于表示每个令牌对数概率最高的结果。

如果 `n` 和 `best_of` 都等于 1（这是默认值），则生成的 token 数量将最多等于 `max_tokens`.

如果 `n` （返回的完成数）或 `best_of` （生成以供考虑的完成数）被设置为 `> 1`，则每个请求将创建多个输出。在这里，你可以将生成的 token 数量视为 `[ max_tokens * max (n, best_of) ]`

#### 流式传输

设置 `stream: true` 在请求中设置流式输出后，模型会在生成 token 时立即开始返回，而不是等待完整 token 序列生成完毕。这并不会改变获取全部 token 所需的时间，但对于需要展示部分进度或将要停止生成的应用程序，它可以缩短首个 token 的获取时间。这可以带来更好的用户体验和 UX 改进，因此值得尝试使用流式输出。

#### 批处理

根据你的使用场景，批处理 _可能有助于_。如果你向同一端点发送多个请求，你可以 [批处理提示词](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) ，以便在同一请求中发送。这将减少你需要发出的请求数量。prompt 参数最多可以容纳 20 个独特的提示词。我们建议你测试此方法，看看是否有帮助。在某些情况下，你可能会增加生成的 token 数量，从而减慢响应时间。

## 管理成本

为监控你的成本，你可以在账户中设置 [通知阈值](https://platform.openai.com/settings/organization/limits) ，一旦超过某个使用阈值，你就会收到邮件提醒。使用 [用量追踪仪表板](https://platform.openai.com/settings/organization/usage) 监控当前及以往计费周期内的令牌使用情况。

### 文本生成

将原型投入生产所面临的挑战之一，是为运行应用程序的相关成本做预算。OpenAI 提供一种 [按量付费定价模式](https://openai.com/api/pricing/)，价格为每 1,000 个 token（约等于 750 个单词）。要估算成本，你需要预估 token 的使用量。考虑流量水平、用户与应用程序交互的频率以及你将处理的数据量等因素。

**一个思考降低成本的实用框架是：将成本视为 token 数量与每个 token 成本的函数。** 使用这个框架有两种降低成本的潜在途径。首先，你可以通过在某些任务中切换到较小的模型来降低每个 token 的成本，从而减少支出。或者，你可以尝试减少所需的 token 数量。有几种方法可以做到这一点，例如使用更短的提示词、 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或缓存常见的用户查询，这样就不需要重复处理它们。

你可以使用我们的交互式 [tokenizer 工具](https://platform.openai.com/tokenizer) 帮助你估算成本。API 和 playground 也会在响应中返回 token 数量。一旦你使用我们最强大的模型让一切正常运行，你可以看看其他模型是否能在更低的延迟和成本下产生相同的结果。在我们的 [token 使用帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型投入生产时，可能需要考虑制定 MLOps 策略。MLOps（机器学习运维）指的是管理机器学习模型端到端生命周期的过程，包括你可能使用我们的 API 进行微调的任何模型。在设计 MLOps 策略时，有多个方面需要考虑。这些包括

- 数据与模型管理：管理用于训练或微调模型的数据，并跟踪版本和变更。
- 模型监控：跟踪模型随时间的性能表现，并检测任何潜在问题或性能下降。
- 模型再训练：确保模型跟上数据变化或需求演进，并按需进行重新训练或微调。
- 模型部署：自动化将模型及相关产物部署到生产环境的过程。

思考应用程序的这些方面，将有助于确保你的模型长期保持相关性和良好性能。

## 安全与合规

在将原型投入生产环境时，你需要评估并处理可能适用于你应用程序的任何安全和合规要求。这将涉及检查你处理的数据、了解我们的API如何处理数据，以及确定你必须遵守哪些法规。我们的 [安全实践](https://www.openai.com/security) 和 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面、最新的文档。供参考，这里是我们的 [隐私政策](https://openai.com/privacy/) 和 [使用条款](https://openai.com/api/policies/terms/).

你需要考虑的一些常见领域包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护措施，如尽可能加密或匿名化。此外，你应遵循安全编码的最佳实践，例如输入净化和适当的错误处理。

### 安全最佳实践

使用我们的 API 创建应用时，请考虑我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) 以确保你的应用安全且成功。这些建议强调了广泛测试产品、主动解决潜在问题以及限制滥用机会的重要性。

## 业务考量

随着使用 AI 的项目从原型走向生产，考虑如何利用 AI 构建优秀的产品以及如何与核心业务相衔接变得至关重要。我们当然没有所有答案，但一个很好的起点是我们的开发者日上的演讲，我们在演讲中与一些客户深入探讨了这个问题：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>