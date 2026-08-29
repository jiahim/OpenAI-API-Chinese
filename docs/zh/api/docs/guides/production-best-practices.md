# 生产环境最佳实践

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

本指南提供了一套全面的最佳实践，帮助你从原型阶段过渡到生产阶段。无论你是经验丰富的机器学习工程师，还是刚刚入门的爱好者，本指南都会为你提供在生产环境中成功运用该平台所需的工具：包括从保护对我们 API 的访问，到设计能够应对高流量的强大架构。请使用本指南帮助你尽可能平稳、高效地规划应用的部署。

如果你想进一步探索上线的最佳实践，请查看我们的 Developer Day 演讲：

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

一旦你 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户，你可以在你的 [组织设置](https://platform.openai.com/settings/organization/general)。中找到组织名称和组织 ID。组织名称是显示在用户界面中的组织标签。组织 ID 是你组织的唯一标识符，可用于 API 请求中。

属于多个组织的用户可以 [传递一个请求头](https://developers.openai.com/api/reference/overview#authentication) 来指定某个 API 请求所使用的组织。这些 API 请求的用量将计入所指定组织的配额。如果未提供请求头，则由 [默认组织](https://platform.openai.com/settings/organization/api-keys) 计费。你可以在你的 [用户设置](https://platform.openai.com/settings/organization/api-keys).

你可以在 [团队页面](https://platform.openai.com/settings/organization/team)。中邀请新成员加入你的组织。成员可以是 **阅读者** 或 **所有者**.

阅读者：

- 可以发起 API 请求。
- 可以查看基本组织信息。
- 可以在组织中创建、更新和删除资源（例如 Assistants），除非另有说明。

Owners:

- 拥有阅读者的全部权限。
- 可以修改计费信息。
- 可以在组织内管理成员。

### 管理账单限额

输入账单信息后，OpenAI 会为你的组织设置一个已批准的使用额度。你的配额上限会随着你在平台上使用量的增加以及从一个 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 升级到另一个而自动提升。你可以在账户设置中的 [额度](https://platform.openai.com/settings/organization/limits) 页面查看你当前的使用额度。

在 [额度](https://platform.openai.com/settings/organization/limits) 页面设置消费提醒，以便在用量超过特定金额时发送通知。若要强制设置月度上限，请设置硬性消费上限。当追踪到的消费达到上限时，硬性消费上限会停止受影响的 API 流量，因此请先阅读 [消费上限指南](https://developers.openai.com/api/docs/guides/spend-limits) 再在生产环境中启用。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面以获取你将在请求中使用的 API 密钥。

这是一种相对直接的控制访问方式，但你必须谨慎保护这些密钥。避免在代码或公共代码仓库中暴露 API 密钥；请将它们存放在安全的位置。你应该使用环境变量或密钥管理服务将密钥暴露给应用程序，这样就无需在代码库中硬编码它们。在我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

API 密钥的使用情况可以在 [使用情况页面](https://platform.openai.com/usage) 上启用追踪后进行监控。如果你使用的是 2023 年 12 月 20 日之前生成的 API 密钥，则默认不会启用追踪。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)。上为后续使用启用追踪。在 2023 年 12 月 20 日之后生成的所有 API 密钥均已启用追踪。任何此前未追踪的使用情况将显示为 `Untracked` 在仪表板中。

### Staging 项目

随着规模扩大，你可能需要为预发环境和生产环境创建独立的项目。你可以在仪表盘中创建这些项目，从而隔离开发与测试工作，避免意外影响线上应用。你还可以限制用户对生产项目的访问权限，并按项目设置自定义速率限制和支出限制。

## 扩展你的解决方案架构

在设计使用我们的 API 的生产级应用或服务时，重要的是要考虑如何扩展以满足流量需求。无论选择哪家云服务提供商，你都需要考虑以下几个关键方面：

- **水平扩展**：你可以将应用水平扩展，以适应来自多个源的请求。这可能需要部署额外的服务器或容器来分摊负载。如果选择这种扩展方式，请确保你的架构设计能够处理多个节点，并具备在节点之间平衡负载的机制。
- **垂直扩展**：另一种方式是垂直扩展应用，即增强单个节点可用的资源。这需要升级服务器的能力以应对额外的负载。如果选择这种扩展方式，请确保你的应用经过相应设计，以充分利用这些额外的资源。
- **缓存**：通过存储频繁访问的数据，你可以在无需反复调用我们的API的情况下提升响应速度。你的应用需要设计为尽可能使用缓存数据，并在新信息加入时使缓存失效。你可以通过几种不同的方式来实现这一点。例如，你可以根据应用的实际需求，将数据存储在数据库、文件系统或内存缓存中。
- **负载均衡**：最后，考虑使用负载均衡技术，确保请求在你可用的服务器之间均匀分布。这可以通过在服务器前端使用负载均衡器，或使用 DNS 轮询来实现。均衡负载有助于提升性能并减少瓶颈。

### 管理速率限制

在使用我们的 API 时，理解和规划以下内容非常重要： [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## Improving latencies

请参阅我们关于 [延迟
  优化](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指从发出请求到收到响应所花费的时间。在本节中，我们将讨论影响文本生成模型延迟的一些因素，并提供降低延迟的建议。

补全请求的延迟主要受两个因素影响：模型和生成的 token 数量。补全请求的生命周期如下：

- 终端用户到 API 延迟
- 处理提示词 token 所需时间
- 采样/生成 token 所需时间
- API 到终端用户延迟



大部分延迟通常来自 token 生成步骤。

> **直观理解**: 提示词元为补全调用增加的延迟非常小。生成补全词元所需的时间要长得多，因为词元是一次生成一个的。更长的生成长度会因每个词元的生成而累积延迟。

### 影响延迟的常见因素及可能的缓解技术

我们已经了解了延迟的基础知识，接下来看看影响延迟的各种因素，大致按影响力从高到低排序。

#### Model

我们的 API 提供了多种不同复杂度和通用性的模型。最强大的模型，例如 `gpt-5.6`，可以生成更复杂、更丰富的补全内容，但处理你的请求所需的时间也更长。
诸如 `gpt-5.6-terra` 和 `gpt-5.6-luna` 等模型可以以更快的速度和更低的成本生成 Responses，而 `gpt-5.6` 在处理复杂任务时，如果需要更大的余量，则是更稳妥的默认选择。你可以根据自己的使用场景，以及在速度、成本和质量之间的权衡，选择最合适的模型。

#### 完成 token 数量

请求生成大量 token 的补全可能会导致延迟增加：

- **降低 max tokens**：对于 token 生成量相近的请求，参数值较低的 `max_tokens` 参数会带来更低的延迟。
- **使用停止序列**：为了避免生成多余的 token，可以添加停止序列。例如，你可以使用停止序列来生成具有特定数量的列表项。在这种情况下，通过使用 `11.` 作为停止序列，你可以只生成包含 10 项的列表，因为当达到 `11.` 时生成会停止。 [阅读我们关于停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) 以了解更多相关背景。
- **减少生成数量**：尽可能降低 `n` 和 `best_of` 的值，其中 `n` 表示每个提示要生成的补全数量，而 `best_of` 用于表示每个 token 具有最高对数概率的结果。

如果 `n` 和 `best_of` 两者都等于 1（即默认值），那么生成的 token 数量最多为 `max_tokens`.

如果 `n` （返回的补全数量），或 `best_of` （为候选而生成的补全数量）被设置为 `> 1`，每个请求将生成多个输出。这里，你可以将生成的 token 数量视为 `[ max_tokens * max (n, best_of) ]`

#### 流式传输

Setting `stream: true` in a request makes the model start returning tokens as soon as they are available, instead of waiting for the full sequence of tokens to be generated. It does not change the time to get all the tokens, but it reduces the time for first token for an application where we want to show partial progress or are going to stop generations. This can be a better user experience and a UX improvement so it’s worth experimenting with streaming.

#### 批处理

根据你的使用场景，批处理 _可能会有帮助_。如果你向同一端点发送多个请求，可以将提示 [批量合并](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) 到同一个请求中发送。这将减少你需要发起的请求数量。prompt 参数最多可包含 20 个不同的提示。我们建议你测试这种方法，看看是否有效。在某些情况下，你最终可能会增加生成的 token 数量，从而拖慢响应速度。

## 管理成本

若要监控费用，你可以在账户中设置一个 [通知阈值](https://platform.openai.com/settings/organization/limits) ，在超出一定使用量阈值时通过邮件接收提醒。可以使用 [用量跟踪仪表板](https://platform.openai.com/settings/organization/usage) 监控当前计费周期及过往计费周期内的 token 使用情况。

### 文本生成

将原型投入生产时面临的挑战之一，是为运行你的应用所产生的费用做好预算。OpenAI 提供 [按量付费定价模型](https://openai.com/api/pricing/)，按每 1,000 个 token 计价（大约相当于 750 个单词）。要估算费用，你需要预测 token 的使用量。考虑诸如流量水平、用户与应用交互的频率，以及你将要处理的数据量等因素。

**一个有用的思考框架是：将费用视为 token 数量与每个 token 成本的函数。** 使用这个框架降低费用有两个潜在途径。首先，你可以通过为某些任务切换到更小的模型来降低每个 token 的成本，从而减少费用。或者，你也可以尝试减少所需的 token 数量。你可以通过几种方式来实现这一点，例如使用更短的提示、 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或者缓存常见的用户查询，以免它们被重复处理。

你可以使用我们的交互式 [分词工具](https://platform.openai.com/tokenizer) 来帮助你估算费用。API 和 playground 也会在响应中返回 token 计数。在你使用我们最强的模型让一切正常运行后，你可以看看其他模型是否能以更低的延迟和成本产生相同的结果。在我们的 [token 使用情况帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型推向生产环境时，可能需要考虑制定一项 MLOps 策略。MLOps（机器学习运维）指的是管理机器学习模型端到端生命周期的过程，包括你可能正在使用我们的 API 进行微调的任何模型。在设计 MLOps 策略时，有多个方面需要考虑，包括

- 数据与模型管理：管理用于训练或微调模型的数据，并跟踪版本与变更。
- 模型监控：持续跟踪模型的性能，及时发现潜在问题或性能下降。
- 模型再训练：确保模型能够跟上数据变化或不断演进的需求，并按需进行再训练或微调。
- 模型部署：将模型及相关产物自动化地部署到生产环境。

思考清楚上述这些方面，将有助于确保你的模型长期保持相关性与良好表现。

## 安全与合规

当你将原型推进到生产环境时，你需要评估并处理可能适用于你的应用的任何安全和合规要求。这涉及检查你所处理的数据、了解我们的 API 如何处理数据，以及确定你必须遵守哪些法规。我们的 [安全实践](https://www.openai.com/security) 和 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面、最新的文档。供你参考，以下是我们的 [隐私政策](https://openai.com/privacy/) 和 [使用条款](https://openai.com/api/policies/terms/).

你需要考虑的一些常见领域包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护措施，例如在可能的情况下进行加密或匿名化。此外，你应遵循安全编码的最佳实践，例如输入清理和适当的错误处理。

### 安全最佳实践

使用我们的 API 创建应用时，请参考我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) 以确保你的应用安全可靠。这些建议强调了广泛测试产品、主动解决潜在问题以及限制滥用机会的重要性。

## 业务考量

随着使用 AI 的项目从原型走向生产，考虑如何用 AI 构建出色的产品，以及这如何与你的核心业务相挂钩，就变得非常重要。我们当然无法给出所有答案，但一个很好的起点是我们在 Developer Day 上的一场分享，我们与一些客户一起深入探讨了这个话题：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>