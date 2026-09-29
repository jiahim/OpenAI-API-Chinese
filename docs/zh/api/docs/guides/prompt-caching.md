# Prompt caching

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

## 为什么提示缓存很重要

提示缓存会在请求共享相同提示前缀时复用已完成的工作。这带来三个主要好处：

- **计算高效：** 避免重新计算模型已处理过的提示前缀。
- **更低的输入 token 成本：** 对复用的 token 按模型降低后的缓存输入费率计费，折扣最高可达 95%。
- **更快：** 减少响应开始前处理输入所花费的时间。

对于受支持的 OpenAI 模型，默认启用提示缓存。使用 [提示缓存面板](https://platform.openai.com/usage?usage_section=prompt-caching) 监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提高缓存复用率。

智能体 API 模型调用使用与 Responses API 相同的提示缓存行为。在会话内复用上下文可以保留公共的提示前缀，但维持会话并不能保证一定命中缓存。详见 [可观测性与用量](https://developers.openai.com/api/docs/guides/agents-api/observability) ，了解会话用量字段与子智能体核算方式。

提示缓存的定价因模型而异。详见 [API 定价](https://developers.openai.com/api/docs/pricing) 了解当前的缓存输入与缓存写入费率。缓存写入费并非附加费用：输入 token 按未缓存输入、缓存输入或缓存写入费率计费。

## 什么是 prompt cache？

当模型处理输入 token 时，必须计算称为键值（KV）状态的中间状态。这些状态让模型在处理新输入和生成输出 token 时能够回顾此前的 token。

提示缓存会保留该状态，以便在可复用的 **前缀**：中重复使用：也就是提示开头未发生改变的 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型可以复用已保存的状态，而无需再次处理这些 token。它仍然需要处理任何新输入以生成新的响应。

提示缓存存储的是键值（KV）张量，而不是 token 本身。



向 ChatGPT 请求更深入的解释



OpenAI 会缓存模型的完整渲染上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 其中包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及受支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

复用缓存要求整个渲染前缀完全匹配。如果在某个断点之前内容或相关设置发生变化，那么该变化之后的前缀就无法匹配已有的缓存条目。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响已缓存的前缀？



修改请求并不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀，并能找到符合条件的匹配断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可以使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具特定指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能更改关于在单轮中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的架构。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能更改模型端的推理指令。在支持的模型上，使用一次 [configuration update](#change-reasoning-effort-without-rewriting-the-prefix) 来更改推理力度，同时保留先前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能更改关于响应详细程度的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([Compaction](https://developers.openai.com/api/docs/guides/compaction)) | 将早期对话内容替换为压缩后的上下文，这可能导致从第一个被更改的 token 起无法复用。                                                                                   |





## 缓存的工作原理

一个 **cache breakpoint** 标记 OpenAI 可保存到缓存并在后续请求中复用的提示前缀的结束位置。第一个请求会将符合条件的前缀写入缓存，后续请求会查找可用的最长匹配缓存前缀，从符合条件的断点处向前回溯，直到找到匹配项为止。

一个提示前缀必须达到模型的 **最小可缓存令牌长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的令牌不计入此最小值。GPT-5.6 及之后模型的最小可缓存提示长度为 1,024 个令牌，更早模型的该长度会因请求设置而异。请参阅 [模型对比](#summary-of-model-differences) 了解详情。

在达到最小可缓存令牌长度后，你可以显式选择放置缓存断点的位置，也可以让 OpenAI 隐式选择其位置。可用选项取决于模型。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 and later



对于 GPT-5.6 及更高版本，缓存写入的成本是标准、未缓存输入 token 价格的 1.25 倍。在大多数此类模型上，后续读取的成本为该价格的 0.1 倍，而在 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)。上为 0.05 倍。在 0.1 倍的读取价格下，一次写入前缀并完整复用一次的成本是其普通输入成本的 1.35 倍，相比之下，不使用缓存处理两次的成本为 2 倍。在十次请求中，一次写入加九次完整读取在该价格下的成本为 2.15 倍，而不使用缓存则为 10 倍。

支持隐式和显式缓存，其中显式缓存让你可以更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理需求，自行决定缓存断点的位置。

- Set `prompt_cache_options.mode` to `explicit` 以仅使用开发者选定的断点，并通过将 `prompt_cache_breakpoint: { "mode": "explicit" }` 添加到输入消息中受支持的内容块来标记每个所需的断点。
- 当未放置显式断点时，请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式可让你选择缓存写入的结束位置。最后一个选定断点之后的内容按未缓存的输入 token 费率处理，且不收取缓存写入费用，因此你可以避免写入不太可能被复用的变化内容。
- 多个显式断点可以保留以不同速率变化的前缀。每个请求最多可以创建四次缓存写入。
- `additional_tools` 输入项当前不接受 `prompt_cache_breakpoint`.

顶层 `instructions` 不能包含显式断点。若要标记可复用的开发者指令，请将它们放在 `input_text` 代码块内的开发者消息中。

**隐式模式：** OpenAI 会开箱即用地选择断点位置，适合大多数使用场景。

- 当 `prompt_cache_options.mode` 为 `implicit`，时，OpenAI 会在最近一条符合条件的消息末尾放置一个断点。符合条件的消息包括：
  - 用户消息
  - 连续一组工具响应中的最后一个工具响应
  - 初始连续一组开发者消息中的最后一个开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽中的一个，因此剩余三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### Earlier models



仅支持隐式缓存。OpenAI 在以下位置设置隐式断点： [按模型依赖的间隔](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头开始计数。只有达到或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才有效。

已报告 `cached_tokens` 的长度是通过从最后一个匹配的断点减去隐藏的系统 token，然后向下取整到 128 的最近倍数计算得出。





### 前缀匹配的工作原理

OpenAI 只会依次遍历传入请求中的 **缓存查找边界** （下文解释），从最长前缀到最短前缀，寻找机器上已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个和最近 50 个显式断点。
- **隐式模式：** 前 2 个和最近 50 个显式断点、隐式断点、最多 20 个更早的合格消息结尾，以及初始连续开发者消息块的终点。这让隐式模式能够在没有显式断点的情况下，复用以更早消息结尾的前缀。

## 缓存生命周期

缓存条目不会被无限期存储。后续请求只能在缓存条目仍可用时复用已缓存的前缀，并且复用该前缀会刷新其生命周期，且不会再次产生缓存写入费用。生命周期和保留设置 [取决于模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 and later



使用 `prompt_cache_options.ttl` 用于控制最短缓存生命周期。目前唯一支持的值， `30m`，也是默认值。已缓存的前缀在其最近一次写入或复用之后的 30 分钟内仍可被复用，尽管 OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### Earlier models



使用 `prompt_cache_retention`，其支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟的不活动期内保持有效，最长可达一小时。
- `24h`: 延长保留通常使条目在约 30 分钟内可用，并可保留长达 24 小时。

**保留期默认值与零数据保留**

提示缓存可能将加密的 key/value 张量作为应用状态存放在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，其默认值取决于你所在组织的数据保留策略：

- Organizations _未启用_ Zero Data Retention 的组织默认为 `24h`.
- Organizations _使用_ Zero Data Retention 的组织默认为 `in_memory`.

在选择值之前，请先确认你的模型和组织可用的留存策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态保存在单台机器上，当每分钟请求数超过 15 时可能导致溢出路由。只有当请求到达持有未过期且匹配的缓存条目的机器时，才能复用该缓存前缀。因此，将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在组织之间共享，也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，特定模型的路由取决于：

- 当前的机器负载和可用容量。
- 隐藏的 OpenAI 内容之后初始 token 的哈希值，包括工具定义（如果存在）。哈希的 token 数量因模型而异。
- 一个提供的 [`prompt_cache_key`](#prompt-cache-keys)，用于在不同请求组之间分离缓存复用，并有助于在 GPT-5.6 之前的模型上优化缓存路由。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



在 GPT-5.6 之前的模型上，请使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 用于共享可复用前缀的请求，以帮助将相关请求路由到同一缓存。对于繁忙的分组，目标是在使用每个密钥的所有前缀上总共每分钟约 15 个请求。通过稳定、确定性的映射将较高流量的流量分散到多个密钥上。请将相关请求保持在同一 `prompt_cache_key` 上，以便它们能够复用其缓存。密钥会影响路由，但它们不会将请求固定到某台机器，也无法保证缓存命中。

在 GPT-5.6 及更高版本上，OpenAI 会自动处理缓存路由；该密钥并非优化缓存所必需。你可以使用单独的密钥来为应用中的客户或用户维护独立的缓存计费。

使用单独的密钥可以让每个客户或用户的缓存 token 用量与计费更易于说明。例如，单独的密钥有助于防止跨用户的缓存命中探测：提交候选提示并观察缓存命中，以了解匹配的内容是否先前已被缓存。参见 [使用密钥进行独立的缓存计费](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## 模型差异概览

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最新符合条件消息的末尾。          | 按规律的 2,048 token 间隔分布。                    | 按规律的、视模型而定的间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| `prompt_cache_key`         | 可选，用于单独的缓存核算              | 使用稳定的 key 以优化缓存路由                  | 使用稳定的 key 以优化缓存路由                                      |
| 最小可缓存前缀   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 缓存 token 上报     | 精确的符合条件边界，不包含隐藏 token    | 不包含隐藏 token，并向下取整到 128 的倍数 | 不包含隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取费用          | 0.1× 未缓存输入（GPT-6.1 Sol 为 0.05×）         | 模型相关的缓存输入费率                           | 模型相关的缓存输入费率                                               |
| 缓存写入费用         | 未缓存输入 token 费率的 1.25×                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 在最近一次写入或复用后至少 30 分钟 | 通常约 30 分钟，最长可达 24 小时                 | 通常闲置 5 到 10 分钟， `in_memory`，或最长 24 小时， `24h` |

<a id="extended-retention-models"></a>




\* Extended retention 由以下对象支持 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，可缓存的最小输入长度因请求设置而异，包括工具、图像、输出架构、推理强度和冗长度。



让 ChatGPT 查找我请求的缓存最小值



<a id="best-practices"></a>

## 如何优化提示词缓存

重点关注 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates),并选择缓存发生的位置。在 GPT-5.6 及更高版本上,使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要为客户单独核算缓存,还可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys) 。在 GPT-5.6 之前的模型上,使用稳定的 `prompt_cache_key` 来为共享可复用前缀的请求优化缓存路由。



Ask ChatGPT to optimize my prompt caching





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，重复使用不断增长的对话历史可以节省比仅缓存初始指令更多的输入 token。保留早期的消息和工具结果，以便后续轮次能够复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考材料放在最前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将它们放在末尾而不是开头，或移至后续对话消息中。
- **保留对话历史。** 追加新消息，而非重写先前的轮次。摘要、 [compaction](#compaction-can-reduce-cache-reuse)，或上下文截断可能会改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理力度。** 在 GPT-6 模型上，追加一个 `configuration_update` 输入项以在两次响应之间更改推理力度，同时保持请求级 `reasoning.effort` 不变。这可以保留原始前缀以供缓存复用。请参阅 [Change reasoning mid-conversation](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 获取示例和兼容性限制。

在断点之后持续更新内容

```json
{
  "model": "gpt-6.1-sol",
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



在受支持的 GPT-6 及更高版本模型上，可以附加一个 `configuration_update` 输入项来 [在对话过程中更改推理工作量](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) ，同时保留先前缓存的前缀。保持顶层 `reasoning.effort` 保持其原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新会控制后续响应的推理工作量。例如，将以下项附加到现有的 `input` 数组中以切换为 `high` 推理，以用于后续请求：

要附加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 通过仅追加更新管理工具



当应用所需的工具在请求之间有所变化时，可以更改哪些工具可调用，同时保持它们的定义稳定，从而保留可复用的前缀。

- **保持工具的一致性。** 保留工具定义、顺序和模式。
- **在某个请求中禁用工具使用。** Set [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) to `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 限制哪些工具可被调用，同时保持所提供列表的稳定性。 `tools` 列表保持稳定。
- **按需加载工具。** 使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 使用 `defer_loading: true` 在多轮会话的早期请求中，用于减少工具定义所消耗的输入 token。已发现的工具会追加到上下文末尾，并保留先前可复用的内容。
- **保留工具加载历史。** 使用开发者角色的 [`additional_tools` 输入项](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 在会话中根据应用的逻辑添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本上，有两个控制项决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记由你自行选择的边界。

- **自动放置断点。** 使用隐式缓存在最新符合条件的消息末尾放置断点。这对于向现有上下文追加内容的多轮会话非常方便。
- **谨慎选择断点。** 在稳定内容的末尾放置显式标记。使用仅显式模式，以避免为不断变化的后缀执行不必要的缓存写入。



> 图示：在 explicit-only 模式下，工具和 schema 先于一个稳定的开发者消息前缀和断点 1。其中一个分支添加一个可变的开发者后缀以及更多对话轮次后到达断点 2，然后拆分为新的用户输入；另一个分支则带有未选中的可变后缀。每个分支最后选中断点之后的内容按未缓存输入费率计费，且不收取缓存写入费用。









<a id="prewarm-the-cache"></a>



### 预热缓存



对于 GPT-5.6 及更高版本，请预先准备已知上下文，以缩短后续请求的首 token 延迟。例如，交互式应用可以在启动期间、用户提出第一个问题之前，预热共享的指令、工具定义或参考材料。

设置 [`prompt_cache_options.prewarm`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_options%20%3E%20%28schema%29%20%3E%20%28property%29%20prewarm) 为 `true` in a Responses API request to prepare the prompt cache without generating output. Once it completes, send your actual request with the same prompt prefix and `prewarm` 省略或设置为 `false`.

预热缓存

```json
{
  "model": "gpt-6.1-sol",
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
  "model": "gpt-6.1-sol",
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


注意：预热请求中写入缓存的 token 按标准缓存写入费率计费。





<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 使用 key 区分缓存计量



On GPT-5.6 and later, use `prompt_cache_key` when you want to maintain separate cache accounting for customers, users, or workspaces within your application. This can make cached token usage and billing easier to explain within each group. The key is optional and is not needed to optimize caching on these models.

- **选择如何区分缓存计费。** 为每个需要单独缓存计费的客户或用户分配一个不同的 key。例如， `support:customer_123` 和 `support:customer_456` 即使两个客户的请求包含相同的前缀，也要为其分别维护独立的缓存计费。
- **保持每个分组的 key 稳定不变。** 在同一客户的相关请求之间复用同一个 key。仅当某个会话或线程需要独立的缓存计费时，才为其生成新的 key。
- **一致地应用 key。** 在客户的所有请求中使用该客户的 key，以维护独立的缓存计费。这也有助于防止跨客户的缓存命中探测。

在 GPT-5.6 之前的模型上， `prompt_cache_key` 对于优化缓存命中率很重要。对于共享可复用前缀的请求，请使用稳定的 key 以帮助将它们路由到同一个缓存。对于请求量较大的分组，请遵循 [在更多 key 之间分散流量的指南](#prompt-cache-keys).





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留策略



对于较早的模型，建议设置 `prompt_cache_retention` 为 `"24h"` 以在模型和你的数据保留要求允许时延长保留时间。详见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 避开最小可缓存长度成本陷阱



如果许多请求重复使用相同的开发者指令和工具定义，但这些共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences)，请考虑将其缩短，或加入有用且稳定的指令、示例或参考材料来扩展它。衡量缓存复用能否抵消额外输入 token 和任何缓存写入费用，并确保评估结果与行为保持稳定。

该图突出了最小可缓存长度成本陷阱：较短的前缀长度在不缓存时可能比扩展到最小可缓存 token 长度花费更高。

<a id="mathematical-details"></a>



#### 数学细节



仅做成本对比时，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，写入一次，并且在后续每次请求中都被完全复用。以未缓存输入 token 等价计，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时应当扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀成本更低。在相等时两者成本相同。扩展更便宜的最小整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反过来，将可缓存前缀缩短到 $$M$$ 以下就会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才低于缓存 $$M$$ 个 token。并不存在一个普适的“最高成本提示长度”；交叉点取决于复用情况和定价。

例如，采用常用的缓存读取费率，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，则交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更为划算。随着复用次数增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能获益；而 102 个或更少 token 的前缀在这些假设下永远不能获益。该比较未考虑性能、输出 token 以及未变动的请求成本。额外的未命中、写入或不同的模型费率都会改变该结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 跟踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，输入 token 计数、延迟和实际成本。通过将总缓存 token 数除以总输入 token 数来跟踪 token 缓存命中率，并按用户、工作区、天或其他有用的分组汇总这两个计数。
- **计算输入成本。** 使用 `response.usage` 中的 token 计数以及该模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用提示词缓存仪表板。** 在 [提示词缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching).

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



### 将提示缓存从更早的模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 如果你使用 `prompt_cache_key`，请保留现有值，以便为客户或用户维持独立的缓存计费。
- 替换 `prompt_cache_retention` 使用 `prompt_cache_options.ttl`.
- 确认可复用前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在不同请求之间变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` （当后续内容不值得写入时）。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟和总成本](#monitor-cache-performance) 迁移前后的变化。





## 示例

以下示例适用于 GPT-5.6 及更高版本的模型。



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 评判



考虑一个单轮 LLM 评判器，用于判断一次已完成的交互中是否存在证据表明用户在与聊天机器人交互后感到满意。每次请求都使用相同的评分标准（rubric）和带标注的少样本示例，对一次不同的交互进行评估。

- **保留此前缀：** 固定评分量表与示例排在最前，组合后的长度被刻意保持在模型的 [最小可缓存长度](#summary-of-model-differences)，附近，使用有助于校准评分者的素材。被评估的交互放在最后。
- **缓存模式与断点：** 已启用仅显式缓存，并在固定评分标准和示例之后设置断点。被评估的用户—聊天机器人对话位于该断点之后，不会写入缓存，从而避免对不太可能被复用内容产生缓存写入费用。

一个遵循这些原则的示例部署报告了 **约 70% 的 token 缓存命中率%**。该数据仅展示一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用方式。

Responses API 单轮裁判请求

```json
{
  "model": "gpt-6.1-sol",
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



### 多轮智能体



考虑一个多轮 智能体，它具有较长且共享的开发者指令，并频繁调用工具。在典型使用中，用户会同时运行多个与该 智能体 的会话，并且经常分叉这些线程。

- **保留前缀**：每一轮都会追加新的消息、工具调用和结果，而不会重写先前的上下文，因此可复用的前缀会随着时间增长。
- **可选的提示缓存键：** 本示例使用 `agent_123_v1:user_456` 来为用户 456 维护独立的缓存账目，便于解释其缓存的令牌用量和计费。这也有助于防止跨用户的缓存命中探测。该键在该用户的会话以及与智能体的分支中保持不变。如果你的应用不需要这种区分，可以省略它。
- **隐式缓存模式：** 启用隐式缓存，由最近一条符合条件的用户消息或工具消息作为断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前可复用的前缀并提升分支时的缓存效率。

一个遵循这些原则的示例部署报告了 **token 缓存命中率 >90%**。该数据仅展示一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用方式。

用于多轮 智能体 的 Responses API 请求

```json
{
  "model": "gpt-6.1-sol",
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



### 共享前缀并不总是缓存前缀



这种情况在以下场景中尤为常见： [从早期模型迁移到 GPT-5.6 或更高版本时](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 由于隐式缓存行为发生了变化。如果多个请求共享一个较长前缀但后缀不同，仅以隐式方式缓存第一个完整请求并不会使较短的共享前缀可被复用。

设想每次请求中，静态的开发者消息之后都跟随一条动态的用户消息。该请求会直接写入动态内容。在下一次请求中修改这部分内容时，无法匹配到之前缓存的较长前缀，并且静态内容之后也没有额外的断点。

静态内容之后没有断点

```json
{
  "model": "gpt-6.1-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_options": { "mode": "implicit" },
  "input": [
    { "role": "developer", "content": "Static content..." },
    { "role": "user", "content": "Dynamic content..." }
  ]
}
```


若要修复，请在两个请求的静态内容之后显式放置一个断点。第一个请求会写入可复用的前缀；即便后续请求中的动态内容发生变化，也仍然可以复用此前写入的前缀。下面的示例使用仅显式模式，以避免将动态内容写入缓存。

静态内容之后带有断点

```json
{
  "model": "gpt-6.1-sol",
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



### 切换到显式独占模式可能会遗漏隐式缓存写入



假设请求 1 使用隐式模式并缓存了直到某条用户消息结尾的前缀，那么后续的请求 2 在保留该前缀的同时切换为 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查其自身输入中的显式断点，因此它不会复用请求 1 中已保存的该隐式前缀（除非请求 2 中的某个显式断点与请求 1 中被缓存的端点相匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或保持启用隐式模式，以便先前符合条件的消息结尾仍可作为查找候选项。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展消息可能会阻止其缓存前缀被复用



即使两个请求都使用隐式模式，仅保留相同的初始 tokens 也不一定足够。假设请求 1 以一条包含 `Content A`，的用户消息结束，那么后续的请求 2 将同一条消息扩展为 `Content A + Content B`。原先在 `Content A` 之后的端点现在位于消息内部，而非其末尾。正如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，若在该边界处没有显式断点，请求 2 就不会复用在那里保存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

在对话结构允许的情况下，应保留原始消息并追加一条新消息；否则，将可复用的文本保留在单独的内容块中，并在两个请求中该内容块之后放置一个显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有开发者消息都是自动隐式模式的缓存查找边界



在隐式模式下,初始连续开发者消息块之后的开发者消息不会自动作为缓存查找边界。在可复用的开发者消息末尾添加一个显式断点,以便在后续请求中保留该断点,使 OpenAI 能够查找匹配的缓存前缀。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 最小可缓存长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能过短。请检查 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用的前缀。在更换模型时，请重新执行该检查，而不是假设原模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可能会降低缓存复用率



[压缩](https://developers.openai.com/api/docs/guides/compaction) 会用更短的表示替换之前的对话上下文。这可能会改变前缀，因此压缩之后的第一次请求即使在逻辑上与之前的对话相同，能复用的缓存也可能更少。

尽量保持可复用的指令和参考资料的稳定，让后续轮次基于压缩后的上下文继续展开。比较压缩前后的总输入成本：即使缓存命中率下降，输入 token 减少也仍然可以节省费用。





## 常见问题



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会使用缓存的前缀生成新的响应，因此相同的请求不一定会产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



不支持手动清理缓存。缓存条目会按照模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示词会计入速率限制吗？



是的。缓存的输入 token 仍然计入每分钟 token 限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 的计算方式。