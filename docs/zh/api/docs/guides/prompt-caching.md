# Prompt caching

> 如需查看完整文档索引,请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 为什么提示缓存很重要

提示词缓存在请求共享相同的前缀时会复用已有工作。这带来三个主要好处：

- **计算高效：** 避免重新计算模型已经处理过的提示前缀。
- **输入 token 价格更低：** 按模型降低后的缓存输入价格支付被重复使用的 token 费用，最高可享 90% 折扣。
- **更快：** 减少响应开始前处理输入所花费的时间。

支持的 OpenAI 模型默认启用提示缓存。使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提升缓存复用率。

智能体 API 模型调用使用与 Responses API 相同的提示缓存行为。在会话中复用上下文可以保留共享的提示前缀，但维持会话并不保证缓存命中。详见 [可观测性与用量](https://developers.openai.com/api/docs/guides/agents-api/observability) ，了解会话用量字段和子智能体核算。

提示缓存定价因模型而异。详见 [API 定价](https://developers.openai.com/api/docs/pricing) ，了解当前的缓存输入和缓存写入费率。缓存写入定价不是附加费用：输入 token 使用未缓存输入、缓存输入或缓存写入费率。

## 什么是提示缓存？

当模型处理输入 token 时，必须计算称为键值（KV）状态的中间状态。这些状态使模型在处理新输入和生成输出 token 时能够回溯到先前的 token。

提示缓存会保留该状态以便可复用的 **前缀**：即提示开头未发生变化的 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型可以复用已保存的状态，而无需再次处理这些 token。它仍需要处理任何新的输入以生成新的响应。

提示缓存存储的是键值（KV）张量，而非 token 本身。



向 ChatGPT 寻求更深入的讲解



OpenAI 会缓存模型完整渲染后的上下文，其中包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求整个渲染前缀完全匹配。如果在某个断点之前内容或相关设置发生变化，则该变化之后的前缀无法匹配现有缓存条目。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



修改请求并不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀，并能找到符合条件的匹配断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可能使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、模式、排序或工具特定的指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改关于在一个轮次中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的模式。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能会更改模型端的推理指令。在支持的模型上，使用 [配置更新](#change-reasoning-effort-without-rewriting-the-prefix) 来更改 effort，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能会更改关于响应详细程度的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 将较早的对话内容替换为压缩后的上下文，这可能会从第一个被更改的 token 起阻止复用。                                                                                   |





## 缓存的工作原理

一个 **缓存断点** 标记 OpenAI 可保存到缓存并在后续请求中复用的提示前缀的结束位置。首次请求会将符合条件的前缀写入缓存，后续请求会从符合条件的断点开始向前回溯，查找可用的最长匹配缓存前缀，直到找到匹配项为止。

提示前缀必须满足该模型的 **最小可缓存 token 长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最小值。对于 GPT-5.6 及更高版本，最小可缓存提示长度为 1,024 个 token；对于更早的模型，则因请求设置而异。请参阅 [模型对比](#summary-of-model-differences) 了解详情。

在满足最小可缓存 token 长度之后，你可以选择显式放置缓存断点的位置，或者让 OpenAI 隐式选择其位置。可用选项取决于模型。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入费用是标准未缓存输入 token 价格的 1.25 倍。当你确定某个前缀会被复用时，这笔开销是值得的，因为后续读取只需支付该价格的 0.1 倍。写入一次前缀并完整复用一次的花费是其普通输入成本的 1.35 倍，而在不启用缓存的情况下处理两次则需要 2 倍。每多一次缓存读取，节省的费用就越大：在十次请求中，一次写入加九次完整读取的总花费为 2.15 倍，而不使用缓存则为 10 倍。

隐式缓存和显式缓存均受支持，其中显式缓存在写入哪些上下文到缓存方面为你提供更高的可控性。

**显式模式：** 你可以根据上下文管理需求，自行选择放置缓存断点的位置。

- Set `prompt_cache_options.mode` to `explicit` 以仅使用开发者选择的断点，并通过将 `prompt_cache_breakpoint: { "mode": "explicit" }` 添加到输入消息内受支持的内容块来标记每个所需断点。
- 当未放置任何显式断点时，该请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式可让你选择缓存写入的结束位置。最后一个所选断点之后的内容按未缓存的输入 token 费率处理，不收取缓存写入费用，因此你可以避免写入不太可能被复用的变化内容。
- 多个显式断点可以保留以不同速率变化的前缀。每次请求最多可创建四个缓存写入。
- `additional_tools` input items 当前不接受 `prompt_cache_breakpoint`.

顶层 `instructions` 不能包含显式断点。若要标记可复用的开发者指令，请将它们放入 `input_text` 开发者消息中的。

**隐式模式：** OpenAI 会开箱即用地选择断点位置，这些位置适用于大多数用例。

- 当 `prompt_cache_options.mode` 为 `implicit`，时，OpenAI 会在最后一条符合条件的消息末尾设置一个断点。符合条件的消息包括：
  - 用户消息
  - 连续成组的工具响应中的最后一条工具响应
  - 初始连续开发者消息组中的最后一条开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽之一，从而剩余三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### Earlier models



仅支持隐式缓存。OpenAI 会在以下位置设置隐式断点 [由模型决定的间隔处](#summary-of-model-differences),该间隔从隐藏的 OpenAI 系统消息开头开始计数。只有位于或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才有效。

上报的 `cached_tokens` 缓存命中是通过从最后一个匹配的断点中减去隐藏的系统 tokens,然后向下取整到最接近的 128 的倍数来计算的。





### 前缀匹配的原理

OpenAI 仅会演示 **缓存查找边界** （下文将作说明）按从最长前缀到最短前缀的顺序，在传入请求中查找机器上已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个和最近 50 个显式断点。
- **隐式模式：** 前 2 个和最近 50 个显式断点、隐式断点、最多 20 个更早的合格消息结尾，以及初始连续开发者消息块的端点。这允许隐式模式复用以更早消息结尾为前缀的部分，而该处无需显式断点。

## 缓存生命周期

缓存条目不会无限期存储。后续请求仅在其条目仍然可用时才能复用缓存的前缀，并且复用该前缀会刷新其生命周期，不会再次产生缓存写入费用。生命周期和保留设置 [取决于所使用的模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 用于控制最小缓存生命周期。当前唯一支持的值， `30m`，也是默认值。缓存前缀在其最近一次写入或重用后 30 分钟内仍可被复用，不过 OpenAI 可能保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### Earlier models



使用 `prompt_cache_retention`，其支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟的不活动后失效，最长可达一小时。
- `24h`: 扩展保留通常使条目在约 30 分钟内可用，最长可保留 24 小时。

**保留期限默认值与零数据保留**

Prompt caching 可能将加密的 key/value 张量存储在 GPU 本地存储中作为应用状态。对于同时支持 `in_memory` 和 `24h`，的模型，默认值取决于你所在组织的数据保留策略：

- 组织 _未启用_ 零数据保留功能默认为 `24h`.
- 组织 _启用_ 零数据保留功能默认为 `in_memory`.

在选择值之前，请先验证你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态保存在各台机器上，当流量超过每分钟 15 个请求时，可能导致溢出路由。只有当请求到达持有匹配且未过期条目的机器时，才能复用缓存前缀。因此，将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在各个组织之间共享，也不能跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，针对特定模型的路由取决于：

- 当前机器负载和可用容量。
- 在隐藏的 OpenAI 内容之后（包括存在工具定义时）的初始 token 的哈希值。哈希的 token 数量因模型而异。
- 一个提供的 [`prompt_cache_key`](#prompt-cache-keys)，用于在请求组之间区分缓存复用，并有助于在 GPT-5.6 之前的模型上优化缓存路由。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



在 GPT-5.6 之前的模型上，使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 来标记共享可复用前缀的请求，以便将相关请求路由到同一缓存。对于使用量较大的分组，请将所有前缀的整体请求量控制在每个密钥每分钟约 15 次左右。对于更高流量的请求，请通过稳定的确定性映射将流量分散到多个密钥上。请将相关请求保持在同一 `prompt_cache_key` ，以便它们能够复用其缓存。密钥会影响路由，但不会将请求固定到某台机器上，也无法保证一定会命中缓存。

在 GPT-5.6 及之后的模型上，OpenAI 会自动处理缓存路由；无需通过密钥来优化缓存。你可以使用不同的密钥来分别统计应用内不同客户或用户的缓存使用情况。

使用不同的密钥可以更清晰地分别核算和计费每个客户或用户的已缓存 token 使用情况。例如，独立的密钥有助于防止跨用户探测缓存命中：通过提交候选提示并观察缓存命中情况来推断之前是否缓存过匹配内容。参见 [使用密钥分离缓存核算](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## 模型差异摘要

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最新符合条件的消息末尾。          | 按规则的 2,048 个 token 间隔分布。                    | 按规则的、与模型相关的间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| `prompt_cache_key`         | 用于单独的缓存核算（可选）              | 使用稳定的 key 来优化缓存路由                  | 使用稳定的 key 来优化缓存路由                                      |
| 最小可缓存前缀   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 缓存 token 上报     | 精确的符合条件边界，不含隐藏 token    | 排除隐藏 token，并向下取整到 128 的倍数 | 排除隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取计费          | 未缓存输入 token 费率的 0.1 倍                  | 模型相关的缓存输入费率                           | 模型相关的缓存输入费率                                               |
| 缓存写入费用         | 未缓存输入 token 费率的 1.25 倍                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 自最近一次写入或复用起至少 30 分钟 | 通常约 30 分钟，最长 24 小时                 | 通常闲置 5 到 10 分钟 `in_memory`，或最长 24 小时 `24h` |

<a id="extended-retention-models"></a>




\* Extended retention is supported by `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，可缓存的最小输入长度因请求设置而异，包括工具、图像、输出架构、推理力度和冗长度。



Ask ChatGPT to find the cache minimum for my request



<a id="best-practices"></a>

## 如何优化提示词缓存

聚焦于 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates)，以及选择缓存发生的位置。在 GPT-5.6 及更高版本上，使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要对客户进行单独的缓存核算，还可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys) 。在 GPT-5.6 之前的模型上，使用稳定的 `prompt_cache_key` 来优化共享可复用前缀请求的缓存路由。



Ask ChatGPT to optimize my prompt caching





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史比仅缓存初始指令能节省更多输入 token。请保留较早的消息和工具结果，以便后续轮次能够复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考材料放在前面。如果开发者指令或共享材料包含时间戳、用户特定内容或其他动态内容，请将它们放在后面而不是开头，或将它们移到后续对话消息中。
- **保留对话历史。** 追加新消息，而不是重写之前的轮次。摘要、 [compaction](#compaction-can-reduce-cache-reuse)，或上下文截断可能会改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理强度。** 在 GPT-6 模型上，追加一个 `configuration_update` 输入项以在各响应之间更改推理强度，同时保持请求级别的 `reasoning.effort` 不变。这会保留原始前缀以便复用缓存。示例和兼容性限制请参阅 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 。

在断点之后持续改变内容

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



### 在不重写前缀的情况下更改推理力度



在受支持的 GPT-6 及更高版本的模型上，追加一个 `configuration_update` 输入项以 [在对话过程中更改推理强度](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) 同时保留之前缓存的前缀。保持顶层的 `reasoning.effort` 为其原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新控制后续响应的推理强度。例如，将以下项追加到现有的 `input` 数组中以切换到 `high` 推理用于后续请求:

要追加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 以仅追加更新管理工具



当你的应用在不同请求之间所需的工具不同时，可以改变哪些工具可被调用，同时保持工具定义稳定，以保留可复用的前缀。

- **保持工具的一致性。** 保留工具定义、顺序和 schema。
- **为某个请求禁用工具使用。** Set [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) to `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可以被调用，同时保持提供的 `tools` 列表保持稳定。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 启用 `defer_loading: true` 以减少多轮线程早期请求中用于工具定义的输入 token。被发现的工具会追加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用 developer 角色的 [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你应用的逻辑在线程中添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控制项用于决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你所选择的边界。

- **自动放置断点。** 使用隐式缓存在最新符合条件的消息末尾放置断点。这对于向现有上下文追加内容的多轮会话非常方便。
- **谨慎选择断点。** 在稳定内容的末尾放置显式标记。使用仅显式模式，避免对易变后缀进行不必要的缓存写入。



> 图示：在仅显式模式下，工具和架构位于稳定的前缀（开发者消息）之前，断点 1 也位于此位置。其中一条分支在断点 2 之前添加一个可变开发者后缀以及更多对话轮次，然后再拆分为新的用户输入；另一条分支具有一个未被选中的可变后缀。每条分支最后所选断点之后的内容按未缓存输入费率计费，不产生缓存写入费用。









<a id="prewarm-the-cache"></a>



### 预热缓存



对于 GPT-5.6 及更高版本，提前准备好已知上下文，以缩短后续请求的首 token 到达时间。例如，交互式应用可以在启动期间——即用户提出第一个问题之前——预热共享的指令、工具定义或参考资料。

将 [`prompt_cache_options.prewarm`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_options%20%3E%20%28schema%29%20%3E%20%28property%29%20prewarm) 设置为 `true` ，以便在Responses API 请求中准备提示缓存而不生成输出。完成后，发送具有相同提示前缀的实际请求，并将 `prewarm` 省略或设置为 `false`.

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


注意：预热请求期间写入缓存的 token 按标准缓存写入费率计费。





<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 使用键分离缓存计量



在 GPT-5.6 及更高版本上，使用 `prompt_cache_key` 当你希望在应用内为不同的客户、用户或工作区维护独立的缓存核算时，使用此功能。这样可以更轻松地解释每个分组内的已缓存 token 用量与计费。该键为可选项，在这些模型上优化缓存时不需要它。

- **选择如何区分缓存计费。** 为每个需要单独缓存计费的客户或用户分配一个唯一的 key。例如， `support:customer_123` 和 `support:customer_456` 即使请求包含相同的前缀，也可以为两个客户维护独立的缓存计费。
- **保持每个分组内的 key 稳定。** 对同一客户的相关请求复用相同的 key。只有当会话或线程需要独立的缓存计费时，才为其生成新的 key。
- **始终如一地应用 key。** 在客户的所有请求中使用该客户的 key，以维持独立的缓存计费。这也有助于防止跨客户的缓存命中探测。

在 GPT-5.6 之前的模型上, `prompt_cache_key` 对于优化缓存命中率非常重要。对于共享可复用前缀的请求,请使用稳定的 key 以帮助将它们路由到同一个缓存。对于流量较大的分组,请遵循 [跨更多 key 分发流量的指南](#prompt-cache-keys).





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留



对于更早的模型，建议设置 `prompt_cache_retention` 设置为 `"24h"` 以延长保留时长，前提是模型和你的数据保留要求允许。请参阅 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 规避最小可缓存长度成本陷阱



如果许多请求复用了相同的开发者指令和工具定义，但该共享前缀低于模型的 [minimum cacheable length](#summary-of-model-differences),考虑缩短它,或用有用的、稳定的指令、示例或参考资料来扩展它。衡量缓存复用是否能够抵消额外的输入令牌以及任何缓存写入费用,并确保评估和行为保持稳定。

该图表突出显示了最短可缓存长度成本陷阱,在该陷阱中,较短的 prefix 长度可能比扩展到最短可缓存令牌长度产生更多未缓存成本。

<a id="mathematical-details"></a>



#### 数学细节



若仅比较成本，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取乘子，$$w$$ 为缓存写入乘子，$$N$$ 为总请求数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并在之后每次请求中完全复用。以未缓存输入 token 当量计算，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时应进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀的成本更低。两者相等时，成本相同。扩展更具成本优势的最小整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短至低于 $$M$$ 会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token。不存在通用的最大成本提示词长度；交叉点取决于复用率和定价。

例如，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求中，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更为划算。随着复用次数增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能获益；在这些假设下，102 个或更少 token 的前缀永远不会获益。此比较未考虑性能、输出 token 以及不变的请求成本。额外的未命中、写入或不同的模型费率都会改变结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 跟踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，输入 token 数、延迟和实际成本。通过将缓存的 token 总数除以输入 token 总数来计算 token 缓存命中率，并按用户、工作区、天或其他有用的维度汇总这两个计数。
- **计算输入成本。** 使用 `response.usage` 中的 token 计数以及模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用提示缓存仪表板。** 在 [Prompt Caching Dashboard](https://platform.openai.com/usage?usage_section=prompt-caching).

Calculate input cost

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



### 将提示缓存从更早的模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 如果使用 `prompt_cache_key`，请保留现有值，以保持客户或用户的独立缓存核算。
- 替换 `prompt_cache_retention` 启用 `prompt_cache_options.ttl`.
- 确认可复用前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间会发生变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 当后续内容不值得写入时。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟和总成本](#monitor-cache-performance) 迁移前后的变化。





## 示例

以下示例适用于 GPT-5.6 及更高版本的模型。



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 作为裁判



考虑一个单轮 LLM 判定器，它判断一次已完成的对话交互是否显示出用户在与聊天机器人交互后感到满意的证据。每次请求都使用相同的评分标准和带标签的少样本示例来评估不同的交互。

- **保留前缀：** 固定的评分标准和示例放在最前面。它们的总长度被刻意保持在模型略高于 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准评分模型的内容。被评估的交互内容放在最后。
- **缓存模式和断点：** 启用了仅显式缓存，并在固定的评分标准和示例之后设置断点。被评估的用户与聊天机器人对话位于该断点之后，不会写入缓存，从而避免对不太可能被复用的内容产生缓存写入费用。

一个遵循这些原则的部署示例报告称其 **token 缓存命中率约为 70%**。该数据展示的是一种可能的结果，实际的缓存命中率上限将取决于你的上下文和应用使用情况。

Responses API 单轮 judge 请求

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



考虑一个具有较长且共享的开发者指令和频繁工具调用的多轮智能体。典型使用中，用户会同时运行多个智能体会话，并且经常需要分叉线程。

- **保留前缀**:每轮都会追加新的消息、工具调用和结果，而不会改写先前的上下文，因此可复用的前缀会随时间增长。
- **可选的提示缓存键:** 本示例使用 `agent_123_v1:user_456` 为用户 456 维护独立的缓存核算，使其缓存的 token 使用量和计费更易于说明。这也有助于防止跨用户的缓存命中探测。该键在该用户的会话以及与 智能体 的分支之间保持不变。如果你的应用不需要这种区分，可以省略它。
- **隐式缓存模式:** 启用隐式缓存，以便最新的符合条件的用户消息或工具消息提供一个断点。
- **显式断点:** 在每个工具结果之后添加一个断点，以保留先前的可复用前缀，并提升分支的缓存效率。

一个遵循这些原则的部署示例报告称其 **token cache-hit rate >90%**。该数据展示的是一种可能的结果，实际的缓存命中率上限将取决于你的上下文和应用使用情况。

Responses API 多轮 智能体 请求

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



### 共享前缀并不总是表示已缓存的前缀



这种情况在 [从早期模型迁移到 GPT-5.6 或更高版本时](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 尤为常见，原因在于隐式缓存行为发生了变化。如果多个请求共享一段较长的前缀但后缀不同，仅隐式缓存首个完整请求并不能让那段较短的共享前缀被复用。

设想每个请求中都有一段固定的开发者消息，后面跟着一段动态的用户消息。该请求会把动态内容写入缓存。在下一次请求中更改该动态内容时，无法匹配更长的已缓存前缀，并且静态内容之后也没有单独的断点。

未在静态内容之后设置断点

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


要解决此问题，请在两个请求的静态内容之后都显式放置一个断点。首个请求会写入可复用的前缀；下一次请求即使动态内容发生变化，也可以复用该前缀。此示例使用仅显式模式，以避免将动态内容写入缓存。

在静态内容之后设置断点

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



假设请求 1 使用隐式模式，并缓存了到某条用户消息结尾的前缀，那么后续的请求 2 会保留该前缀，但会切换为 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 只检查其自身输入中的显式断点，因此不会复用请求 1 中已保存的该隐式前缀（除非请求 2 中的某个显式断点恰好与请求 1 中被缓存的终点相匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或者保持启用隐式模式，以便先前符合条件的消息结尾仍可作为查找候选。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展消息可能会阻止其缓存前缀被复用



即使两个请求都使用隐式模式，仅保留相同的初始 token 也不一定足够。假设请求 1 以一条用户消息结尾，内容为 `Content A`，然后后续的请求 2 将同一条消息扩展为 `Content A + Content B`。在此之后的旧断点 `Content A` 现在位于消息内部，而不是其末尾。正如在 [前缀匹配的工作原理](#how-prefix-matching-works)，中所解释的，如果没有在该边界处设置显式断点，请求 2 就不会复用此前已保存的前缀缓存。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

当对话结构允许时，请保留原始消息并改为追加一条新消息；否则，将可复用的文本放在独立的内容块中，并在两个请求中都在其之后放置显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有 developer 消息都会自动充当隐式模式的缓存查找边界



在隐式模式下，初始连续开发者消息块之后的开发者消息不会自动构成缓存查找边界。在可复用的开发者消息末尾添加显式断点，以便在后续请求中保留该断点，使 OpenAI 能够检查是否存在匹配的前缀缓存。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 可缓存的最小长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能过短。请检查 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来衡量可复用的前缀。更换模型时，请重复该检查，而不是假设先前模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可能会降低缓存复用率



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会用更短的表示替换此前的对话上下文。这会改变前缀,因此即使对话在逻辑上相同,压缩后第一个请求能复用的先前缓存可能会减少。

尽可能让可复用的指令和参考资料保持稳定,然后让后续轮次基于压缩后的上下文继续构建。对比压缩前后的总输入成本:即使缓存命中率下降,输入 token 减少也能节省费用。





## 常见问题



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会使用缓存的前缀生成新响应，因此相同的请求不保证产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



目前不支持手动清除缓存。缓存条目会根据模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍会计入每分钟 token 限制。提示缓存不会改变以下方式： [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 会被计算。