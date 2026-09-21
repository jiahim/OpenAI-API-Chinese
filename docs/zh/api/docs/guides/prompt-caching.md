# Prompt caching

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

## 为什么提示缓存很重要

提示缓存会在请求共享相同的前缀时复用已有工作。这带来三个主要优势：

- **计算高效：** 避免重复计算模型已经处理过的提示前缀。
- **输入 token 更便宜：** 对于复用的 token，按模型降低后的缓存输入费率计费，最高可折扣 90%。
- **更快：** 减少在响应开始前处理输入所花费的时间。

提示缓存默认对受支持的 OpenAI 模型启用。使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提升缓存复用率。

智能体 API 模型调用使用与 Responses API 相同的提示缓存行为。在同一会话内复用上下文可以保留共享的提示前缀，但维持会话并不能保证一定命中缓存。参阅 [可观测性与使用](https://developers.openai.com/api/docs/guides/agents-api/observability) 了解会话用量字段和子智能体计费。

提示缓存的定价因模型而异。参阅 [API 定价](https://developers.openai.com/api/docs/pricing) 查看当前的缓存输入和缓存写入费率。缓存写入定价不是额外附加费用：输入 token 使用未缓存输入、缓存输入或缓存写入费率。

## 什么是 prompt cache？

模型在处理输入 token 时，必须计算称为键值（KV）状态的中间状态。这些状态使模型在处理新输入和生成输出 token 时能够回溯此前的 token。

提示缓存会为可复用的 **前缀**：保留这些状态：即提示开头未发生变化的 token。当后续请求具有相同的前缀并命中匹配的缓存条目时，模型可以复用已保存的状态，而无需重新处理这些 token。但模型仍需处理任何新增输入才能生成新的响应。

提示缓存存储的是键值（KV）张量，而非 token 本身。



向 ChatGPT 寻求更深入的讲解



OpenAI 会缓存模型已完整渲染的上下文，包括OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) ，其中包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及受支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

要复用缓存，整个已渲染前缀必须完全匹配。如果在某个断点之前内容或相关设置发生了变化，那么该变化之后的前缀将无法匹配已有的缓存条目。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



更改请求不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀，并且能够找到符合条件的中断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可能使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 会更改工具名称、描述、schema、顺序或工具相关的指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改关于在单轮中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 会添加输出格式相关指令以及所请求的 schema。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能会更改模型侧的推理指令。在支持的模型上，可使用 [configuration update](#change-reasoning-effort-without-rewriting-the-prefix) 来更改推理力度，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能会更改关于响应详情的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([Compaction](https://developers.openai.com/api/docs/guides/compaction)) | 会使用压缩后的上下文替换此前的对话内容，这可能导致从第一个被更改的 token 起无法复用前缀缓存。                                                                                   |





## 缓存的工作原理

一个 **缓存断点** 标志着 OpenAI 可保存到缓存并在后续请求中复用的提示前缀的结束。首次请求会将符合条件的前缀写入缓存，后续请求会从符合条件的断点向前回溯，查找可用的最长匹配缓存前缀，直到找到匹配项为止。

提示前缀必须达到模型的 **最小可缓存 token 长度** 后才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最小长度。最小可缓存提示长度为 1,024 个 token（适用于 GPT-5.6 及更高版本），更早模型的该长度因请求设置而异。请参阅 [模型对比](#summary-of-model-differences) 了解详情。

在满足最小可缓存 token 长度之后，你可以显式选择缓存断点的位置，也可以让 OpenAI 隐式选择其位置。可用选项因模型而异。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入成本是标准未缓存输入 token 价格的 1.25×。当你确定某个前缀会被复用时，这笔费用是值得的，因为后续读取仅需 0.1× 的价格。写入一次前缀并完整复用一次的成本是普通输入成本的 1.35×，相比之下，不使用缓存处理两次则为 2×。随着每次额外的缓存读取，节省的费用会不断累积：跨十次请求，一次写入加九次完整读取的成本为 2.15×，而不使用缓存则为 10×。

支持隐式和显式两种缓存方式，其中显式缓存可让你更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理需求，自行决定在何处放置缓存断点。

- 将 `prompt_cache_options.mode` 设置为 `explicit` ，以仅使用开发者选定的断点，并通过向输入消息中支持的内容块添加 `prompt_cache_breakpoint: { "mode": "explicit" }` 来标记每个所需的断点。
- 当未放置任何显式断点时，请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式可让你自行决定缓存写入的结束位置。最后一个选定断点之后的内容按未缓存的输入 token 费率处理，不会产生缓存写入费用，因此你可以避免写入不太可能被复用的易变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每个请求最多可创建四个缓存写入。
- `additional_tools` 输入项目前不接受 `prompt_cache_breakpoint`.

顶层 `instructions` 不能包含显式断点。若要标记可复用的开发者说明，请将它们放在 `input_text` 代码块中，该代码块位于一条开发者消息内。

**隐式模式：** OpenAI 默认选择断点位置，适用于大多数场景。

- 当 `prompt_cache_options.mode` 时 `implicit`，OpenAI 会在最近一条符合条件的消息末尾设置一个断点。符合条件的消息包括：
  - 用户消息
  - 连续的工具响应组中的最后一个工具响应
  - 最初的连续开发者消息组中的最后一个开发者消息。
- 你可以在不禁用隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽位中的一个，从而剩余三个可用的显式缓存写入槽位。







<a id="how-caching-works-earlier-models"></a>



### Earlier models



仅支持隐式缓存。OpenAI 会在以下位置设置隐式断点： [与模型相关的间隔处](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头开始计数。只有位于或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才有效。

报告的 `cached_tokens` 缓存命中的 token 数是通过从最后一个匹配的断点减去隐藏的系统 token，然后向下取整到 128 的最近倍数计算得出的。





### 前缀匹配的工作原理

OpenAI 仅依次遍历传入请求中的 **缓存查找边界** （见下文），从最长前缀到最短前缀，查找机器上已缓存的可匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个和最新 50 个显式断点。
- **隐式模式：** 前 2 个和最新 50 个显式断点、隐式断点、最多 20 个更早的可用消息结尾，以及初始连续开发者消息块的终点。这使得隐式模式可以复用一条此前消息处前缀，即使该处没有显式断点。

## 缓存生命周期

缓存条目不会被无限期存储。后续请求只能在缓存前缀的条目仍然可用时复用该缓存前缀，且复用前缀会刷新其生命周期，不会再次产生缓存写入费用。生命周期和保留设置 [取决于模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 来控制最小缓存生命周期。唯一支持的值， `30m`，也是默认值。缓存前缀在最近一次写入或复用后的 30 分钟内可被复用，不过 OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### Earlier models



使用 `prompt_cache_retention`，其支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟的不活动后失效，最长可达一小时。
- `24h`: 延长保留通常使条目可用约 30 分钟，并可保留长达 24 小时。

**保留默认值与零数据保留**

提示缓存可能会将加密的 key/value 张量作为应用状态存储在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，默认值取决于你所在组织的数据保留策略：

- Organizations _未_ 启用 Zero Data Retention 的组织默认为 `24h`.
- Organizations _使用_ 启用 Zero Data Retention 的组织默认为 `in_memory`.

在选择值之前，请先确认你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态存储在各个机器上，当流量超过每分钟 15 次请求时可能导致溢出路由。仅当请求到达持有匹配条目且该条目尚未过期的机器时，才能复用缓存前缀。因此，将请求路由到正确的机器对于缓存复用非常重要。

缓存不会跨组织共享，也无法在跨区域处理边界之间复用 [regional processing boundaries](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，指定模型的路由取决于以下因素：

- 当前机器负载与可用容量。
- 在隐藏的 OpenAI 内容之后的初始 token 的哈希值，包含工具定义（如果存在）。哈希的 token 数量因模型而异。
- 一个提供的 [`prompt_cache_key`](#prompt-cache-keys)，用于在不同请求组之间隔离缓存复用，并帮助优化 GPT-5.6 之前模型的缓存路由。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



在 GPT-5.6 之前的模型上，请使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 前缀用于共享可复用前缀的请求，以帮助将相关请求路由到同一缓存。对于繁忙的分组，目标是在使用每个密钥的所有前缀下总计每分钟约 15 个请求。通过稳定、确定性的映射将高流量请求分散到多个密钥之间。请将相关请求保留在同一个 `prompt_cache_key` 上，以便它们能够复用其缓存。密钥会影响路由，但不会将请求固定到某台机器上，也不能保证缓存命中。

在 GPT-5.6 及更高版本的模型上，OpenAI 会自动处理缓存路由；无需使用密钥来优化缓存。你可以使用不同的密钥来为应用中的不同客户或用户维护独立的缓存核算。

使用不同的密钥可以更清楚地解释每位客户或用户的已缓存令牌使用量和计费情况。例如，使用不同的密钥有助于防止跨用户的缓存命中探测行为：即通过提交候选提示并观察缓存命中情况，来推断匹配的内容是否曾被缓存。请参阅 [使用密钥实现独立的缓存核算](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## 模型差异摘要

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最近一条符合条件消息的末尾。          | 按规律的 2,048 token 间隔分布。                    | 按规律的、与模型相关的间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| `prompt_cache_key`         | 可选，用于单独的缓存核算              | 使用稳定的 key 来优化缓存路由                  | 使用稳定的 key 来优化缓存路由                                      |
| 可缓存的最小前缀   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 缓存 token 报告     | 精确的符合条件边界，不含隐藏 token    | 不含隐藏 token，并向下取整到 128 的倍数 | 不含隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取费用          | 非缓存输入 token 费率的 0.1×                  | 依模型而定的缓存输入费率                           | 依模型而定的缓存输入费率                                               |
| 缓存写入费用         | 非缓存输入 token 费率的 1.25×                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留时间取值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 距最近一次写入或复用至少 30 分钟 | 通常约 30 分钟，最长 24 小时                 | 通常在以下情况下不活跃 5 到 10 分钟： `in_memory`，或最长 24 小时（ `24h` |

<a id="extended-retention-models"></a>




\* Extended retention 由 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型,可缓存的最小输入长度会因请求设置而异,包括工具、图像、输出架构、推理投入度以及详细程度。



让 ChatGPT 帮我查找该请求的缓存最小长度



<a id="best-practices"></a>

## 如何优化提示词缓存

聚焦于 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates)，并选择缓存发生的位置。在 GPT-5.6 及更高版本上，使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要为客户单独核算缓存，也可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys) 。在 GPT-5.6 之前的模型上，使用稳定的 `prompt_cache_key` 来优化共享可复用前缀请求的缓存路由。



让 ChatGPT 优化我的提示词缓存





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史比仅缓存初始指令能节省更多输入令牌。请保留早期的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考材料放在最前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将这些内容放在末尾而非开头，或将它们移到后续的对话消息中。
- **保留对话历史。** 追加新消息而不是改写之前的对话轮次。摘要、 [压缩](#compaction-can-reduce-cache-reuse)，或上下文截断都可能改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理工作量。** 在 GPT-6 Astra 上，可以追加一个 `configuration_update` 输入项来在多次响应之间更改推理工作量，同时保持请求级别的 `reasoning.effort` 不变。这样可以保留原始前缀以复用缓存。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性限制。

保留断点之后不断变化的内容

```json
{
  "model": "gpt-5.6",
  "reasoning": { "effort": "low", "context": "all_turns" },
  "text": { "verbosity": "medium" },
  "prompt_cache_options": { "mode": "explicit" },
  "input": [
    {
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "Stable instructions and shared reference material...",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        }
      ]
    },
    {
      "role": "developer",
      "content": "Dynamic developer instructions, such as user-specific content and timestamps..."
    },
    {
      "role": "user",
      "content": "The user's current question..."
    }
  ]
}
```








<a id="change-reasoning-effort-without-rewriting-the-prefix"></a>



### 在不重写前缀的情况下更改推理强度



在受支持的 GPT-6 及更高版本模型上，追加一个 `configuration_update` 输入项以 [在对话过程中更改推理工作量](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) 同时保留先前缓存的前缀。保持顶层 `reasoning.effort` 为原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新将控制后续响应的推理工作量。例如，将此项追加到现有的 `input` 数组中以切换到 `high` 推理，用于后续请求：

要追加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 通过仅追加更新来管理工具



当你的应用在不同请求中需要不同的工具时，可以在保持工具定义稳定的前提下更改哪些工具可被调用，以保留可复用的前缀。

- **保持工具一致性。** 保留工具定义、顺序和架构。
- **针对单个请求禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设置为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可被调用,同时保持传入的 `tools` 列表稳定。
- **按需加载工具。** 使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 使用 `defer_loading: true` 以减少多轮对话早期请求中用于工具定义的输入 token。已发现的工具会追加到上下文末尾,从而保留前面可复用的内容。
- **保留工具加载历史记录。** 使用开发者角色的 [`additional_tools` 输入项](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 在对话线程中按照你应用的逻辑添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控件用于确定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你选择的边界。

- **自动放置断点。** 使用隐式缓存在最新符合条件的消息末尾放置断点。这对于向已有上下文追加内容的多轮会话很方便。
- **谨慎选择断点。** 在稳定内容末尾放置显式标记。使用仅显式模式，以避免为不断变化的后缀执行不必要的缓存写入。



> 图示：在仅显式模式下，工具和 schema 位于稳定的前缀和开发者消息以及断点 1 之前。一个分支在断点 2 之前添加了可变的开发者消息后缀和更多对话轮次，然后拆分为新的用户输入。另一个分支包含一个未被选中的可变后缀。每个分支最后一个被选中的断点之后的内容按未缓存输入费率计费，不产生缓存写入费用。









<a id="prewarm-the-cache"></a>



### 预热缓存



对于 GPT-5.6 及更高版本，请预先准备已知上下文，以缩短后续请求的首 token 延迟。例如，交互式应用可以在启动阶段、用户提出第一个问题之前，预先预热共享指令、工具定义或参考资料。

将 [`prompt_cache_options.prewarm`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_options%20%3E%20%28schema%29%20%3E%20%28property%29%20prewarm) 设置为 `true` 在 Responses API 请求中传入，以在不生成输出的情况下预热提示缓存。完成后，发送使用相同提示前缀且将 `prewarm` 省略或设置为 `false`.

预热缓存

```json
{
  "model": "gpt-5.6",
  "input": [
    {
      "role": "developer",
      "content": "Your app's shared instructions and reference material..."
    }
  ],
  "prompt_cache_options": {
    "prewarm": true
  }
}
```


发送后续请求

```json
{
  "model": "gpt-5.6",
  "input": [
    {
      "role": "developer",
      "content": "Your app's shared instructions and reference material..."
    },
    {
      "role": "user",
      "content": "The user's question..."
    }
  ]
}
```


注意：预热请求期间写入缓存的 token 将按标准缓存写入费率计费。





<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 按 key 区分缓存计量



在 GPT-5.6 及更高版本上，使用 `prompt_cache_key` 当你希望在应用程序内为不同的客户、用户或工作空间维护独立的缓存核算时，可以使用该字段。这样便于在每个组内解释已缓存 token 的使用情况和计费。该字段是可选的，在这些模型上优化缓存时无需使用它。

- **选择如何分隔缓存计量。** 为每个需要单独进行缓存计量的客户或用户分配一个不同的 key。例如， `support:customer_123` 和 `support:customer_456` 即使两个客户的请求包含相同的前缀，也要为其分别维护缓存计量。
- **确保每个分组内的 key 保持稳定。** 对同一客户的相关请求复用同一个 key。仅当某个会话或线程需要独立的缓存计量时，才为其生成新的 key。
- **始终如一地应用 key。** 在客户的请求中始终使用该客户的 key，以分别维护其缓存计量。这也有助于防止跨客户的缓存命中探测。

在 GPT-5.6 之前的模型上， `prompt_cache_key` 对于优化缓存命中率非常重要。对共享可复用前缀的请求使用稳定的键，有助于将它们路由到同一缓存。对于繁忙的分组，请遵循关于 [跨多个键分配流量的指南](#prompt-cache-keys).





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留策略



对于较旧的模型，建议设置 `prompt_cache_retention` 设置为 `"24h"` 以在模型和你的数据保留要求允许时延长保留时长。参见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 避开最小可缓存长度成本陷阱



如果许多请求复用相同的开发者指令和工具定义，但该共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences)，可以考虑缩短它，或者使用有用的、稳定的指令、示例或参考资料来扩展它。评估缓存复用是否能够抵消额外的输入 token 和任何缓存写入费用，并确保评估结果和行为保持稳定。

该图表重点展示了最小可缓存长度的成本陷阱：当前缀长度较短时，未缓存的成本可能高于扩展到最小可缓存 token 长度后的成本。

<a id="mathematical-details"></a>



#### 数学细节



仅考虑成本时，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并在之后每次请求中完全复用。以未缓存输入 token 当量计，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀成本更低。相等时两者成本相同。扩展更具优势的最短整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短到 $$M$$ 以下会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token。不存在普适的最大成本提示长度；交叉点取决于复用次数与定价。

例如，设 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，则交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更具成本优势。随着复用次数增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能获益；而 102 个或更少 token 的前缀在这些假设下永远不会获益。本比较未考虑性能、输出 token 以及未变化的请求成本。额外的未命中、写入或不同的模型费率会改变结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 跟踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，输入 token 数、延迟和实际成本。通过将缓存命中的 token 总数除以输入 token 总数来跟踪 token 缓存命中率，并按用户、工作区、日期或其他有用的维度对两个计数进行聚合。
- **计算输入成本。** 使用 `response.usage` 中的 token 数和模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用提示缓存仪表板。** 在 [Prompt Caching Dashboard](https://platform.openai.com/usage?usage_section=prompt-caching).

计算输入成本

```javascript
function calculateInputCost(
  usage,
  inputPricePerMillion,
  cacheInputMultiplier = 0.1,
  cacheWriteMultiplier = 1.25
) {
  const inputTokens = usage.input_tokens;
  const cachedTokens = usage.input_tokens_details.cached_tokens;
  const cacheWriteTokens = usage.input_tokens_details.cache_write_tokens;
  const ordinaryInputTokens = inputTokens - cachedTokens - cacheWriteTokens;

  const weightedInputTokens =
    ordinaryInputTokens +
    cachedTokens * cacheInputMultiplier +
    cacheWriteTokens * cacheWriteMultiplier;
  const inputCost = (weightedInputTokens * inputPricePerMillion) / 1_000_000;
  return inputCost;
}
```

```python
from openai.types.responses import ResponseUsage


def calculate_input_cost(
    usage: ResponseUsage,
    input_price_per_million: float,
    cache_input_multiplier: float = 0.1,
    cache_write_multiplier: float = 1.25,
) -> float:
    input_tokens = usage.input_tokens
    cached_tokens = usage.input_tokens_details.cached_tokens
    cache_write_tokens = usage.input_tokens_details.cache_write_tokens
    ordinary_input_tokens = input_tokens - cached_tokens - cache_write_tokens

    weighted_input_tokens = (
        ordinary_input_tokens
        + cached_tokens * cache_input_multiplier
        + cache_write_tokens * cache_write_multiplier
    )
    input_cost = weighted_input_tokens * input_price_per_million / 1_000_000
    return input_cost
```

```ruby
def calculate_input_cost(
  usage,
  input_price_per_million,
  cache_input_multiplier = 0.1,
  cache_write_multiplier = 1.25
)
  input_tokens = usage.input_tokens
  details = usage.input_tokens_details
  cached_tokens = details.cached_tokens
  cache_write_tokens = details.cache_write_tokens
  ordinary_input_tokens = input_tokens - cached_tokens - cache_write_tokens

  weighted_input_tokens = ordinary_input_tokens +
                          (cached_tokens * cache_input_multiplier) +
                          (cache_write_tokens * cache_write_multiplier)
  (weighted_input_tokens * input_price_per_million) / 1_000_000
end
```








<a id="migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later"></a>



### 将 prompt 缓存从早期模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 如果使用 `prompt_cache_key`，请保留现有值，以便为客户或用户保留独立的缓存计费。
- 替换 `prompt_cache_retention` 使用 `prompt_cache_options.ttl`.
- 确认可复用前缀符合模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` （当后续内容不值得写入时）。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟和总成本](#monitor-cache-performance) 迁移前后的变化。





## 示例

以下示例适用于 GPT-5.6 及更高版本的模型。



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM-as-a-Judge



考虑一个单轮 LLM 评判器，它用于判断一次已完成的交互是否显示出用户在与聊天机器人交互后感到满意的证据。每个请求使用相同的评分标准和带标签的少样本示例来评估不同的交互。

- **保留前缀：** 固定评分标准与示例置于最前，其合并长度刻意控制在略高于模型 [最小可缓存长度](#summary-of-model-differences)，的位置，使用有助于校准评判模型的材料。被评估的交互内容放在最后。
- **缓存模式与断点：** 启用仅显式缓存，并在固定评分标准与示例之后设置断点。被评估的用户–聊天机器人对话位于该断点之后，不写入缓存，从而避免对不太可能被复用的内容产生缓存写入费用。

一个遵循这些原则的部署示例报告称其 **token 缓存命中率达到约 70%**. 该图示展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用情况。

Responses API 单轮裁判请求

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_options": { "mode": "explicit" },
  "input": [
    {
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "Judge whether the completed interaction provides evidence that the user is satisfied. Return true or false. Full grading rubric and labeled few-shot examples...",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        }
      ]
    },
    {
      "role": "user",
      "content": "Completed interaction to evaluate..."
    }
  ]
}
```








<a id="multi-turn-agent"></a>



### 多轮 智能体



考虑一个多轮 智能体，它具有冗长且共享的开发者指令，并频繁调用工具。典型使用场景中，用户会同时运行多个该 智能体 的会话，并且经常会分叉这些线程。

- **保留前缀**:每轮都会追加新的消息、工具调用和结果，而不重写此前的上下文，因此可复用的前缀会随时间不断增长。
- **可选的提示缓存键：** 本示例使用 `agent_123_v1:user_456` 来为用户 456 维护独立的缓存账目，使其缓存的 token 用量和计费更易于解释。这也有助于防止跨用户的缓存命中探测。该键在该用户的会话以及与智能体的分支中保持一致。如果你的应用不需要这种区分，可以省略它。
- **隐式缓存模式：** 启用隐式缓存，以便最新的符合条件的用户或工具消息提供一个断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前可复用的前缀并提升分叉的缓存效率。

一个遵循这些原则的部署示例报告称其 **token 缓存命中率 >90%**. 该图示展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用情况。

Responses API 针对多轮 智能体 的请求

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "medium" },
  "prompt_cache_key": "agent_123_v1:user_456",
  "prompt_cache_options": { "mode": "implicit" },
  "tools": [
    {
      "type": "function",
      "name": "function_name",
      "description": "Function description",
      "parameters": { "...": "..." }
    }
  ],
  "input": [
    {
      "role": "developer",
      "content": "Stable developer instructions and reference material..."
    },
    { "role": "user", "content": "Can you do...?" },
    {
      "type": "function_call",
      "call_id": "call_123",
      "name": "function_name",
      "arguments": "..."
    },
    {
      "type": "function_call_output",
      "call_id": "call_123",
      "output": [
        {
          "type": "input_text",
          "text": "Tool result...",
          "prompt_cache_breakpoint": { "mode": "explicit" }
        }
      ]
    },
    { "role": "assistant", "content": "Assistant response..." },
    { "role": "user", "content": "Can you also do...?" }
  ]
}
```






<a id="troubleshooting"></a>

## 注意事项



<a id="a-shared-prefix-is-not-always-a-cached-prefix"></a>



### 共享前缀并不总是已缓存前缀



这种情况在 [从早期模型迁移到 GPT-5.6 或更高版本时](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 尤为常见，其原因是隐式缓存行为发生了变化。如果多个请求共享一个长前缀但后缀不同，仅以隐式方式缓存第一个完整请求，并不会让较短的共享前缀变得可复用。

假设每个请求中都有一个静态的开发者消息，后跟一个动态的用户消息。该请求会将动态内容写入缓存。在下一次请求中更改该动态内容时，无法匹配更长的已缓存前缀，而且静态内容之后也没有单独的断点。

在静态内容之后没有断点的情况下

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_options": { "mode": "implicit" },
  "input": [
    { "role": "developer", "content": "Static content..." },
    { "role": "user", "content": "Dynamic content..." }
  ]
}
```


要解决此问题，请在两个请求的静态内容之后都放置一个显式断点。第一个请求会写入可复用的前缀；即使后续请求中的动态内容发生变化，下一个请求也可以复用该前缀。下面的示例使用仅显式模式，以避免将动态内容写入缓存。

在静态内容之后设置断点的情况下

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_options": { "mode": "explicit" },
  "input": [
    {
      "role": "developer",
      "content": [{
        "type": "input_text",
        "text": "Static content...",
        "prompt_cache_breakpoint": { "mode": "explicit" }
      }]
    },
    { "role": "user", "content": "Dynamic content..." }
  ]
}
```








<a id="switching-to-explicit-only-mode-can-miss-an-implicit-cache-write"></a>



### 切换到仅显式模式可能会遗漏隐式缓存写入



假设请求 1 使用隐式模式，并通过用户消息的末尾缓存了一个前缀，然后后续的请求 2 保留该前缀，但切换到 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查其自身输入中的显式断点，因此它不会复用请求 1 中保存的隐式前缀（除非请求 2 中的某个显式断点与请求 1 中缓存的端点匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或者保持隐式模式启用，以便先前符合条件的消息结尾仍可作为查找候选项。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展一条消息可能会阻止其已缓存前缀的复用



即使两个请求都使用隐式模式，保留相同的初始 token 也并不总是足够。假设请求 1 以一条包含以下内容的用户消息结尾 `Content A`，然后后续的请求 2 将同一条消息扩展为 `Content A + Content B`。其后的旧端点 `Content A` 现在位于消息内部，而非其末尾。正如在 [前缀匹配的工作原理](#how-prefix-matching-works)，中所解释的，如果在该边界处没有显式的断点，请求 2 就不会复用在那里保存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

在对话结构允许的情况下，保留原始消息并追加一条新消息。否则，将可复用的文本保留在单独的内容块中，并在两个请求中该内容块之后放置一个显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有开发者消息都是自动隐式模式的缓存查找边界



在隐式模式下，连续开发者消息初始块之后的开发者消息不会自动作为缓存查找边界。在可复用的开发者消息末尾添加一个显式断点，以便在后续请求中保留该断点，这样 OpenAI 就可以检查是否存在匹配的缓存前缀。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 可缓存的最小长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能太短。请参考 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用前缀。更换模型时，请重复该检查，而不是假设先前模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可能会降低缓存复用率



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会将较早的对话上下文替换为更短的表示形式。这可能会改变前缀，因此压缩后的第一个请求即便在对话逻辑上保持不变，复用前一次缓存的比例也可能降低。

在可能的情况下保持可复用的指令和参考材料稳定，然后让后续轮次在压缩后的上下文上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 减少仍可能节省费用。





## 常见问题解答



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出令牌的方式。模型会使用缓存的前缀生成新响应，因此相同的请求并不能保证产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



否。目前暂不支持手动清除缓存。缓存条目会根据模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示会计入速率限制吗？



是的。缓存的输入 token 仍然计入每分钟 token 数限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 的计算方式。