# 生产环境最佳实践

> 完整文档索引请参阅 [llms.txt](/llms.txt). 在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

本指南提供了一套全面的最佳实践，帮助你从原型阶段过渡到生产阶段。无论你是经验丰富的机器学习工程师，还是刚入门的爱好者，本指南都应为你提供在生产环境中成功运用该平台所需的工具：从保障对 API 的访问，到设计能够应对高流量的稳健架构。请使用本指南来制定尽可能顺畅且高效的应用部署计划。

如果你希望进一步探索生产部署方面的最佳实践，请查看我们的 Developer Day 演讲：

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

一旦你 [登录](https://platform.openai.com/login) 到你的 OpenAI 账户，你就可以在 [组织设置](https://platform.openai.com/settings/organization/general)。中找到你的组织名称和组织 ID。组织名称是你的组织的标签，显示在用户界面中。组织 ID 是你的组织的唯一标识符，可用于 API 请求中。

属于多个组织的用户可以 [传递一个请求头](https://developers.openai.com/api/reference/overview#authentication) 来指定某个 API 请求使用的组织。这些 API 请求的用量将计入指定组织的配额。如果未提供请求头，则 [默认组织](https://platform.openai.com/settings/organization/api-keys) 将被计费。你可以在 [用户设置](https://platform.openai.com/settings/organization/api-keys).

中从 [团队页面](https://platform.openai.com/settings/organization/team)。邀请新成员加入你的组织。成员可以是 **读者** 或 **所有者**.

读者：

- 可以发起 API 请求。
- 可以查看组织的基本信息。
- 可以在组织中创建、更新和删除资源（例如 Assistants），除非另有说明。

Owners:

- 拥有读者的所有权限。
- 可以修改账单信息。
- 可以管理组织内的成员。

### 管理账单限额

在填写账单信息后，OpenAI 会为你的组织设定一个已批准的用量上限。当你在平台上的使用量增加并从一个 [使用层级](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 升级到另一个层级时，你的配额上限会自动提升。你可以在账户设置中的 [限额](https://platform.openai.com/settings/organization/limits) 页面查看当前的用量上限。

在 [限额](https://platform.openai.com/settings/organization/limits) 页面设置支出告警，以便在使用量超过指定金额时发送通知。若要设置月度上限，请配置硬性支出限额。硬性支出限额会在跟踪到的支出达到上限时停止受影响的 API 流量，请在生产环境启用前阅读 [支出限额指南](https://developers.openai.com/api/docs/guides/spend-limits) 。

### API 密钥

OpenAI API 使用 API 密钥进行身份验证。请访问你的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 页面获取你在请求中要使用的 API 密钥。

这是一种相对直接的访问控制方式，但你必须时刻注意保护这些密钥的安全。避免在代码或公共代码仓库中泄露 API 密钥；请将它们存放在安全的位置。你应该通过环境变量或密钥管理服务将密钥暴露给应用，这样就无需在代码库中硬编码它们。更多内容请阅读我们的 [API 密钥安全最佳实践](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

我们强烈建议你在创建项目 API 密钥时设置过期日期，并建立定期的密钥轮换流程。在密钥到期之前，创建一个新的密钥、更新你的应用以使用它，并在确认新密钥可用后撤销旧密钥。

管理员可以在 [平台设置](https://platform.openai.com/settings/organization/general)。中按组织或项目级别强制设置 API 密钥的最长有效期。新密钥必须在配置的限制内过期，以防止其无限期有效。项目级别的限制不能超过组织级别的限制。

该 **API 密钥治理** 部分允许管理员限制可创建的 API 密钥类型。管理员可以只允许服务账号密钥、只允许用户拥有的项目密钥，或禁止所有新 API 密钥的创建。组织级别的限制始终优先：项目设置可以增加限制，但不能放宽组织级别的限制。这些控制仅适用于新密钥的创建；现有的 API 密钥不受影响。

API key 的使用情况可以在以下页面进行监控： [使用情况页面](https://platform.openai.com/usage) 上监控 API 密钥的使用情况。如果你使用的是 2023 年 12 月 20 日之前生成的 接口 密钥，则默认情况下不会启用追踪。你可以在 [API 密钥管理仪表板](https://platform.openai.com/api-keys)。上启用后续追踪。在 2023 年 12 月 20 日之后生成的所有 API 密钥均已启用追踪。任何之前未追踪的使用情况将在仪表板中显示为 `Untracked` 。

### Staging projects

随着业务扩展，你可能希望为预发布环境和生产环境分别创建项目。你可以在仪表板中创建这些项目，从而隔离开发与测试工作，避免意外影响线上应用。你还可以限制用户对生产项目的访问，并为每个项目设置自定义的速率和消费上限。

## 扩展你的解决方案架构

在设计使用我们的 API 的生产环境应用或服务时，考虑如何扩展以满足流量需求非常重要。无论选择哪家云服务提供商，你都需要考虑以下几个关键方面：

- **横向扩容**: 你可能希望横向扩展你的应用，以应对来自多个来源的请求。这可能涉及部署额外的服务器或容器来分担负载。如果选择这种扩容方式，请确保你的架构设计能够处理多个节点，并且你已建立相应的机制在这些节点之间均衡负载。
- **纵向扩容**: 另一种选择是纵向扩展你的应用，即提升单个节点可用的资源。这需要升级服务器的能力以应对额外负载。如果选择这种扩容方式，请确保你的应用设计能够利用这些额外资源。
- **缓存**: 通过存储频繁访问的数据，你可以在无需反复调用我们的 API 的情况下提升响应速度。你的应用需要尽可能使用缓存数据，并在新增信息时使缓存失效。例如，你可以将数据存储在数据库、文件系统或内存缓存中，取决于哪种方式最适合你的应用。
- **负载均衡**: 最后，考虑使用负载均衡技术，确保请求在你可用的服务器之间均匀分布。这可以包括在服务器前端使用负载均衡器，或使用 DNS 轮询。均衡负载有助于提升性能并减少瓶颈。

### 压缩请求体

若要减少上传大小，请在调用时 `zstd` 时使用 `POST /v1/responses`。压缩 JSON 请求体。设置 `Content-Encoding: zstd` 并保持 `Content-Type: application/json`.

```bash
zstd -3 -c request.json > request.json.zst

curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Content-Encoding: zstd" \
  --data-binary @request.json.zst
```

API 会在处理请求前解压请求体。压缩可减少网络传输的字节数，但不会改变 token 使用量或模型上下文限制。

压缩后和压缩前的请求体大小都不得超过 128 MiB。压缩后的请求体大小也不得超过压缩前大小的 100 倍。超出这些限制的请求将返回 HTTP `413`。API 针对无效或不完整的 `400` 数据返回 HTTP `zstd` 。其他请求限制仍然适用。

### 压缩 WebSocket 消息

[Responses API WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode) 支持 `permessage-deflate` 在 `wss://api.openai.com/v1/responses`。此 WebSocket 扩展使用 DEFLATE 来减小消息大小。请在连接前在 WebSocket 客户端的压缩设置中启用它。

### 管理速率限制

在使用我们的 API 时，了解并规划好以下内容非常重要： [速率限制](https://developers.openai.com/api/docs/guides/rate-limits).

## Improving latencies

查看我们最新的 [延迟
  优化](https://developers.openai.com/api/docs/guides/latency-optimization).

延迟是指处理请求并返回响应所花费的时间。在本节中，我们将讨论影响文本生成模型延迟的一些因素，并提供减少延迟的建议。

补全请求的延迟主要受两个因素影响：模型和生成的 token 数量。补全请求的生命周期如下：

- 终端用户到 API 的延迟
- 处理提示词 token 的时间
- 采样/生成 token 的时间
- API 到终端用户的延迟



延迟通常主要来自 token 生成步骤。

> **Intuition**: 提示词元对补全调用的延迟影响较小。生成补全词元的时间要长得多，因为词元是逐个生成的。生成长度越长，由于每个词元都需要生成，延迟会不断累积。

### 影响延迟的常见因素及可能的缓解技术

我们已经了解了延迟的基础知识，接下来看看影响延迟的各种因素，大致按影响从大到小排序。

#### 模型

我们的 API 提供了多种复杂度与通用性各异的模型。其中能力最强的模型（例如 `gpt-6-astra`）能够生成更复杂、更多样的补全结果，但处理你的查询所需的时间也更长。
诸如 `gpt-5.6-terra` 和 `gpt-5.6-luna` 等模型可以更快、更低成本地生成 Responses，而 `gpt-6-astra` 在复杂任务需要更高余量时是更强的默认选择。你可以根据自己的用例以及速度、成本和质量之间的取舍来选择最合适的模型。

#### 补全 token 数量

请求生成大量 token 的补全可能会导致延迟增加：

- **降低 max tokens**：对于生成 token 数量相近的请求，max_tokens 参数较低的请求延迟更小。 `max_tokens` 参数会带来更低的延迟。
- **添加停止序列**：为了避免生成多余的 token，请添加停止序列。例如，你可以使用停止序列来生成具有特定数量条目的列表。在本例中，通过使用 `11.` 作为停止序列，你只能生成包含 10 个条目的列表，因为当遇到 `11.` 时生成就会停止。 [阅读关于停止序列的帮助文章](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) ，了解更多相关上下文。
- **生成更少的 completions**：在可能的情况下，调低 `n` 和 `best_of` 的值，其中 `n` 表示为每个 prompt 生成的 completions 数量，而 `best_of` 用于表示每个 token 具有最高对数概率的结果。

如果 `n` 和 `best_of` 两者都等于 1（默认值），则生成的 token 数量最多等于 `max_tokens`.

如果 `n` （返回的 completions 数量）或 `best_of` （为候选而生成的 completions 数量）被设置为 `> 1`，每个请求将创建多个输出。这里，你可以将生成的 token 数量视为 `[ max_tokens * max (n, best_of) ]`

#### Streaming

Setting `stream: true` 在请求中开启该选项后，模型一旦生成 token 就立即返回，而不是等待完整 token 序列生成完毕。它不会改变获取全部 token 的总耗时，但能缩短首个 token 的返回时间，适用于需要展示部分生成进度或随时终止生成的场景。对于追求更佳用户体验的应用而言，启用流式输出是一项有价值的 UX 改进，值得一试。

#### Batching

根据你的使用场景，批处理 _可能会有所帮助_。如果你向同一端点发送多个请求，可以 [将提示批量发送](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) 到同一个请求中。这将减少你需要发起的请求数量。prompt 参数最多可容纳 20 个不同的提示。建议你测试一下这种方法，看看是否有效。在某些情况下，你最终可能会增加生成的 token 数量，从而降低响应速度。

## 管理成本

若要监控你的费用，你可以设置一个 [通知阈值](https://platform.openai.com/settings/organization/limits) ，在你的账户中，以便在超过特定使用阈值时收到邮件提醒。请使用 [使用情况追踪仪表板](https://platform.openai.com/settings/organization/usage) 以监控当前及过往计费周期内的 token 使用情况。

### 文本生成

将原型投入生产时面临的挑战之一是为运行应用的各项成本做预算。OpenAI 提供 [按量付费定价模式](https://openai.com/api/pricing/)，按每 1,000 个 token（约合 750 个词）计费。要估算成本，你需要预测 token 使用量。需要考虑的因素包括流量规模、用户与应用交互的频率，以及你将处理的数据量。

**一个有助于思考如何降低成本的有用框架是：将成本视为 token 数量与每个 token 成本的函数。** 借助这个框架，你可以通过两种方式降低成本。首先，你可以通过在某些任务上切换到更小的模型来降低每个 token 的成本，从而减少开支。或者，你可以尝试减少所需的 token 数量。你可以通过多种方式实现这一点，例如使用更短的提示、 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型，或对常见的用户查询进行缓存，以免重复处理。

你可以通过我们提供的交互式 [tokenizer 工具](https://platform.openai.com/tokenizer) 来帮助估算成本。API 和 playground 也会在响应中返回 token 计数。在你使用我们最强大的模型让一切正常运行之后，你可以看看其他模型能否以更低的延迟和成本产生相同的结果。在我们的 [token 使用帮助文章](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps 策略

当你将原型投入生产时，可能需要考虑制定一个 MLOps 策略。MLOps（机器学习运维）指的是管理机器学习模型端到端生命周期的过程，包括你可能正在使用我们的 API 进行微调的任何模型。在设计 MLOps 策略时，请考虑以下几个方面：

- 数据与模型管理：管理用于训练或微调模型的数据，并跟踪版本和变更。
- 模型监控：持续跟踪模型性能，及时发现潜在问题或性能下降。
- 模型再训练：确保模型能够跟上数据变化或不断演进的需求，必要时重新训练或对其进行微调。
- 模型部署：将模型及相关构件自动化地部署到生产环境。

仔细思考应用的这些方面，将有助于确保你的模型长期保持相关性和良好性能。

## 安全与合规

当你的原型进入生产阶段时，你需要评估并应对可能适用于你应用的安全与合规要求。这包括审视你所处理的数据、了解我们的 API 如何处理数据，以及确定你必须遵守的法规。我们的 [安全实践](https://www.openai.com/security) 和 [信任与合规门户](https://trust.openai.com/) 提供了我们最全面且最新的文档。供你参考,这是我们的 [隐私政策](https://openai.com/privacy/) 和 [使用条款](https://openai.com/api/policies/terms/).

一些你通常需要考虑的方面包括数据存储、数据传输和数据保留。你可能还需要实施数据隐私保护，例如在可能的情况下进行加密或匿名化。此外，你应遵循安全编码的最佳实践，例如输入清理和适当的错误处理。

### 安全最佳实践

当使用我们的 API 创建应用时，请参考我们的 [安全最佳实践](https://developers.openai.com/api/docs/guides/safety-best-practices) 以确保你的应用安全且成功。这些建议重点强调了广泛测试产品、积极主动地解决潜在问题以及限制误用机会的重要性。

## 商业考量

随着使用 AI 的项目从原型走向生产，考虑如何使用 AI 构建出色的产品以及这如何反哺你的核心业务变得十分重要。我们当然没有所有答案，但一个很好的起点是我们在 Developer Day 上的一次演讲，在那次演讲中我们与一些客户一起深入探讨了这个问题：

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>