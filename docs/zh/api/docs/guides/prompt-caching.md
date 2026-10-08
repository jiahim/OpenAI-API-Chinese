# Prompt caching

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 为什么 prompt 缓存很重要

提示缓存会在请求共享相同的提示前缀时复用已有工作。这带来三个主要好处：

- **计算高效：** 避免重复计算模型已经处理过的提示前缀。
- **更低的输入 token 价格：** 对复用的 token 按模型降低后的缓存输入费率计费，最高可享 95% 折扣。
- **更快：** 减少响应开始前处理输入所花费的时间。

对于支持的 OpenAI 模型，提示缓存默认处于启用状态。使用 [提示缓存仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching) 可以监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提升缓存复用率。

智能体 API 模型调用使用与 Responses API 相同的提示缓存行为。在同一会话中复用上下文可以保留共享的提示前缀，但维持会话并不能保证命中缓存。参见 [可观测性与用量](https://developers.openai.com/api/docs/guides/agents-api/observability) 了解会话用量字段与子智能体核算方式。

提示缓存价格因模型而异。参见 [API 价格](https://developers.openai.com/api/docs/pricing) 了解当前的缓存输入与缓存写入费率。缓存写入价格并非附加费用：输入令牌将按未缓存输入、缓存输入或缓存写入费率计费。

## 什么是提示缓存？

当模型处理输入 token 时，必须计算称为键值（KV）状态的中间状态。这些状态让模型在处理新输入和生成输出 token 时可以回溯到较早的 token。

提示缓存会为可复用的前缀保留该状态 **前缀**：即提示词开头保持不变的 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型可以复用已保存的状态，而无需再次处理这些 token。它仍需处理任何新输入以生成新的响应。

提示缓存存储的是键值（KV）张量，而不是 token 本身。



请向 ChatGPT 寻求更深入的解释



OpenAI 会缓存模型的完整渲染上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) ，其中包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及受支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求整个渲染前缀完全匹配。如果在某断点之前内容或相关设置发生变化，则该变化之后的前缀无法与现有缓存条目匹配。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



更改请求并不一定会丢弃现有的缓存条目。关键在于后续请求是否具有相同的前缀，并能找到符合条件的匹配断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可以使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具相关的指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改关于在单轮中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的架构。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可以更改模型侧的推理指令。在支持的模型上，使用 [配置更新](#change-reasoning-effort-without-rewriting-the-prefix) 以更改推理强度，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可以更改关于响应详情的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 用压缩后的上下文替换此前的对话内容，这可能导致从第一个被更改的 token 之后无法再复用。                                                                                   |





## 缓存的工作原理

一个 **缓存断点** 标记了一个提示前缀的结束位置，OpenAI 可以将其保存到缓存中并在后续请求中复用。首次请求会将符合条件的前缀写入缓存，后续请求会查找可用的最长匹配缓存前缀，沿着符合条件的断点向后回溯，直到找到匹配项。

提示前缀必须满足模型的 **最小可缓存 token 长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最小值。GPT-5.6 及之后模型的最小可缓存提示长度为 1,024 个 token，更早模型则根据请求设置有所不同。详情参见 [模型对比](#summary-of-model-differences) 。

在满足最小可缓存 token 长度后，你可以显式选择缓存断点的放置位置，也可以让 OpenAI 隐式选择其位置。可用选项取决于模型。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 and later



对于 GPT-5.6 及更高版本，缓存写入费用为标准、未缓存输入 token 费率的 1.25 倍。在大多数此类模型上，后续读取费用为该费率的 0.1 倍，而在 [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)。上为 0.05 倍。在 0.1× 读取费率下，写入一次前缀并完整复用一次的成本是其普通输入成本的 1.35×，而在不使用缓存的情况下处理两次的成本为 2×。在十次请求中，一次写入和九次完整读取在该费率下的成本为 2.15×，而在不使用缓存的情况下为 10×。

支持隐式和显式两种缓存方式，其中显式缓存让你可以更精细地控制写入缓存的上下文。

**显式模式：** 你可以根据上下文管理需要，自行选择放置缓存断点的位置。

- 将 `prompt_cache_options.mode` 设置为 `explicit` 以仅使用开发者选择的断点，并通过将 `prompt_cache_breakpoint: { "mode": "explicit" }` 添加到输入消息中受支持的内容块来标记每个所需断点。
- 当未放置显式断点时，请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式可让你选择缓存写入结束的位置。最后一个所选断点之后的内容将按未缓存的输入 token 费率处理，不收取缓存写入费用，因此你可以避免写入那些不太可能被复用的可变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每个请求最多可创建四次缓存写入。
- `additional_tools` 输入项当前不接受 `prompt_cache_breakpoint`.

顶层 `instructions` 不能包含显式断点。若要标记可复用的开发者说明，请将其放入 `input_text` 中，作为开发者消息里的一个块。

**隐式模式：** OpenAI 开箱即用地选择断点位置，适用于大多数用例。

- 当 `prompt_cache_options.mode` 为 `implicit`，时，OpenAI 会在最新的符合条件消息末尾设置一个断点。符合条件的消息包括：
  - 用户消息
  - 连续成组的工具响应中的最后一个工具响应
  - 初始连续开发者消息组中的最后一个开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；隐式断点会占用四个缓存写入槽中的一个，因此还剩三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### Earlier models



仅支持隐式缓存。OpenAI 会在以下位置放置隐式断点： [按模型决定的间隔](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头起计算。只有达到或超过最小可缓存长度（从隐藏上下文末尾起计算）的断点才有效。

报告的 `cached_tokens` 缓存长度通过从最后一个匹配的断点减去隐藏的系统 token，然后向下取整到 128 的最近倍数来计算。





### 前缀匹配的工作原理

OpenAI 仅逐步检查传入请求中的 **缓存查找边界** （下文将作说明），从最长前缀到最短前缀，查找机器上已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式断点模式：** 前 2 个和最近 50 个显式断点。
- **隐式模式：** 前 2 个和最近 50 个显式断点、隐式断点、最多 20 个较早的符合条件的消息结尾，以及初始连续开发者消息块的终点。这使得隐式模式可以复用一条以前的消息结尾的前缀，而无需在该处使用显式断点。

## 缓存生命周期

缓存条目不会无限期保留。后续请求只有在条目仍然可用时才能复用缓存的前缀，并且复用前缀会刷新其生命周期，但不会再次产生缓存写入费用。生命周期和保留设置 [取决于所使用的模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 and later



使用 `prompt_cache_options.ttl` 用于控制最小缓存生命周期。当前唯一支持的值， `30m`，也是默认值。缓存前缀在其最近一次写入或复用后 30 分钟内仍可被复用，尽管 OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### Earlier models



使用 `prompt_cache_retention`，其支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟不活动后失效，最长可达一小时。
- `24h`: 延长保留通常使条目可用约 30 分钟，最长可保留 24 小时。

**保留默认值与零数据保留**

提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，其默认值取决于你所在组织的数据保留策略：

- Organizations _未启用_ Zero Data Retention 的组织默认采用 `24h`.
- Organizations _启用_ Zero Data Retention 的组织默认采用 `in_memory`.

在选择值之前，请先验证你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态存储在各个机器上，当流量超过 15 requests per minute 时可能导致溢出路由。请求只有在抵达持有未过期匹配条目的机器时，才能复用缓存前缀。因此，将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在组织之间共享，也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，针对特定模型的路由取决于以下因素：

- 当前机器负载和可用容量。
- 隐藏的 OpenAI 内容之后初始 token 的哈希值，包含工具定义（如果存在）。哈希的 token 数量因模型而异。
- 一个提供的 [`prompt_cache_key`](#prompt-cache-keys)，用于在不同请求组之间隔离缓存复用，并有助于优化 GPT-5.6 之前模型的缓存路由。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



在 GPT-5.6 之前的模型上，请使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 用于共享可复用前缀的请求，以帮助将相关请求路由到同一缓存。对于繁忙分组，总体目标是在使用每个 key 的所有前缀上达到每分钟约 15 个请求。使用稳定且确定性的映射将更高流量的请求拆分到多个 key 上。将相关请求保持在相同的 `prompt_cache_key` 上，以便它们可以复用其缓存。Key 影响路由；它们不会将请求固定到某台机器，也不保证缓存命中。

在 GPT-5.6 及更高版本上，OpenAI 会自动处理缓存路由；该 key 不是优化缓存所必需的。你可以使用单独的 key 来为应用中的不同客户或用户维护独立的缓存核算。

使用单独的 key 可以更轻松地解释每个客户或用户的缓存 token 使用情况和计费。例如，单独的 key 有助于防止跨用户的缓存命中探测：提交候选提示并观察缓存命中，以了解之前是否缓存了匹配的内容。请参阅 [使用 key 进行独立的缓存核算](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## 模型差异摘要

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最新符合条件消息的末尾。          | 按规则的 2,048 token 间隔分布。                    | 按模型决定的规则间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| `prompt_cache_key`         | 可选，用于独立的缓存核算              | 使用稳定的 key 以优化缓存路由                  | 使用稳定的 key 以优化缓存路由                                      |
| 最小可缓存前缀   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 缓存 token 报告     | 精确的符合条件边界，不含隐藏 token    | 不含隐藏 token，并向下取整为 128 的倍数 | 不含隐藏 token，并向下取整为 128 的倍数                     |
| 缓存读取计费          | 0.1× 未缓存输入（GPT-6.1 Sol 为 0.05×）         | 模型相关的缓存输入费率                           | 模型相关的缓存输入费率                                               |
| 缓存写入费用         | 为未缓存输入 token 费率的 1.25×                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留时长取值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 自最近一次写入或复用起至少 30 分钟 | 通常约 30 分钟，最长可达 24 小时                 | 通常 5 到 10 分钟未活动 `in_memory`，最长可达 24 小时（针对 `24h` |

<a id="extended-retention-models"></a>




\* Extended retention is supported by `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，可缓存的最小输入长度因请求设置而异，包括工具、图像、输出架构、推理力度和详细程度。



Ask ChatGPT to find the cache minimum for my request



<a id="best-practices"></a>

## 如何优化提示词缓存

关注 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates)，以及选择缓存发生的位置。在 GPT-5.6 及更高版本上，使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要对不同客户进行独立的缓存核算，也可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys) 。在 GPT-5.6 之前的模型上，使用稳定的 `prompt_cache_key` 来为共享可复用前缀的请求优化缓存路由。



让 ChatGPT 优化我的提示缓存





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史可以比仅缓存初始指令节省更多的输入令牌。保留早期的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考资料放在最前面。如果开发者指令或共享资料中包含时间戳、用户特定内容或其他动态内容，请将其放在末尾而不是开头，或将其移到后续对话消息中。
- **保留对话历史。** 追加新消息而不是重写较早的轮次。摘要、 [压缩](#compaction-can-reduce-cache-reuse)，或上下文截断都可能改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理努力程度。** 在 GPT-6 模型上，追加一个 `configuration_update` 输入条目以在各个响应之间更改推理努力程度，同时保持请求级 `reasoning.effort` 不变。这可以保留原始前缀以供缓存复用。请参阅 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性限制。

在断点之后持续更改内容

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



### 在不改写前缀的情况下更改推理力度



在受支持的 GPT-6 及更高版本的模型上，追加一个 `configuration_update` 输入项以 [在对话过程中更改推理努力程度](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) ，同时保留先前的已缓存前缀。保持顶层 `reasoning.effort` 为原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新将控制后续响应的推理努力程度。例如，将此输入项追加到现有的 `input` 数组中以切换到 `high` 推理，用于后续请求：

追加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 通过仅追加更新管理工具



当你的应用所需的工具因请求而异时，可在保持工具定义稳定的前提下调整哪些工具可以被调用，从而保留可复用的前缀。

- **保持工具的一致性。** 保留工具定义、顺序和 schema。
- **在一次请求中禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设置为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 在保持所提供的 `tools` 列表稳定的同时，限制哪些工具可被调用。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 启用 `defer_loading: true` 以减少在多轮线程早期请求中用于工具定义的输入 token。发现的工具会附加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史记录。** 使用 developer 角色的 [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你应用的逻辑，在线程中动态添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控制项决定缓存断点的放置位置： `prompt_cache_options.mode` 用于选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 用于标记你自行选择的边界。

- **自动放置断点。** 使用隐式缓存在最近一条符合条件的消息末尾放置断点。这对于向现有上下文追加内容的多轮会话非常方便。
- **有目的地选择断点。** 在稳定内容末尾放置显式标记。使用仅显式模式，避免对变化的后缀进行不必要的缓存写入。



> 图示：在仅显式模式下，工具与模式位于稳定的开发者消息前缀和断点 1 之前。其中一个分支添加了可变的开发者后缀以及断点 2 之前更多的对话轮次，然后拆分为新的用户输入。另一个分支具有一个未被选中的可变后缀。每个分支最后一个已选断点之后的内容按未缓存输入费率计费，且不计缓存写入费用。









<a id="prewarm-the-cache"></a>



### 预热缓存



对于 GPT-5.6 及更高版本，请提前准备已知上下文，以缩短后续请求的首 token 延迟。例如，交互式应用可以在启动期间、用户提出第一个问题之前，预热共享指令、工具定义或参考资料。

设置 [`prompt_cache_options.prewarm`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_options%20%3E%20%28schema%29%20%3E%20%28property%29%20prewarm) 为 `true` 在 Responses API 请求中设为该值，可在不生成输出的情况下预热 prompt 缓存。完成后，在保持相同 prompt 前缀并将 `prewarm` 省略或设为 `false`.

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


注意：预热请求期间写入缓存的 token 按标准缓存写入费率计费。





<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 使用密钥分离缓存计量



在 GPT-5.6 及更高版本上，使用 `prompt_cache_key` 当你希望为应用中的客户、用户或工作区分别维护独立的缓存核算时，可使用该参数。这有助于更清晰地解释每个分组内的缓存 token 用量与计费。该键为可选项，对于在这些模型上优化缓存并非必需。

- **选择如何区分缓存计费。** 为每个需要独立缓存计费的客户或用户分配一个不同的 key。例如，可以为客户 A 和客户 B， `support:customer_123` 和 `support:customer_456` 分别维护各自的缓存计费，即使他们的请求包含相同的前缀也是如此。
- **在每个组内保持 key 的稳定。** 对同一客户的相关请求复用同一个 key。仅当某个会话或线程需要独立的缓存计费时，才为其生成单独的 key。
- **保持 key 使用的一致性。** 在客户的请求中使用其对应的 key，以保持独立的缓存计费。这也有助于防止跨客户的缓存命中探测。

在 GPT-5.6 之前的模型上， `prompt_cache_key` 对于优化缓存命中率非常重要。请为共享可复用前缀的请求使用稳定的键，以帮助将其路由到同一缓存。对于流量较大的分组，请遵循关于 [将流量分散到更多键的指导](#prompt-cache-keys).





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留



对于较早期的模型，建议设置 `prompt_cache_retention` 为 `"24h"` 以延长保留期限，前提是模型与你的数据保留要求允许这样做。参见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 规避最小可缓存长度带来的成本陷阱



如果许多请求复用了相同的开发者指令和工具定义，但该共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences)，可以考虑缩短它，或者用有用且稳定的指令、示例或参考资料进行扩展。评估缓存复用带来的收益是否能抵消新增的输入 token 以及任何缓存写入费用，并确保评估结果与行为保持稳定。

该图表突出展示了最小可缓存长度的成本陷阱：当前缀较短时，未缓存的成本可能反而高于扩展到最小可缓存 token 长度后的成本。

<a id="mathematical-details"></a>



#### 数学细节



仅从成本角度比较，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并在后续每个请求中被完全复用。以未缓存输入 token 等价计算，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；而当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀的成本更低。当二者相等时，成本相同。使扩展更便宜的最小整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短到 $$M$$ 以下就会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token 的方案。不存在普适的最大成本 prompt 长度；交叉点取决于复用次数与定价。

例如，采用常见的缓存读取费率，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更便宜。随着复用次数增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能受益；而在上述假设下，102 个或更少 token 的前缀永远不会受益。该比较未考虑性能、输出 token 以及未变的请求成本。额外的未命中、写入或不同的模型费率都会改变结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 追踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，输入 token 数量、延迟和实际成本。通过将缓存 token 总数除以输入 token 总数来追踪 token 缓存命中率，并按用户、工作空间、天或其他有用的分组聚合这两个计数。
- **计算输入成本。** 使用 `response.usage` 中的 token 数量以及模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用提示缓存仪表板。** 在 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching).

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

```go
func calculateInputCost(usage responses.ResponseUsage, pricePerMillion, cacheInputMultiplier, cacheWriteMultiplier float64) float64 {
	ordinary := usage.InputTokens - usage.InputTokensDetails.CachedTokens - usage.InputTokensDetails.CacheWriteTokens
	weighted := float64(ordinary) + float64(usage.InputTokensDetails.CachedTokens)*cacheInputMultiplier + float64(usage.InputTokensDetails.CacheWriteTokens)*cacheWriteMultiplier
	return weighted * pricePerMillion / 1_000_000
}
```

```java
import com.openai.models.responses.ResponseUsage;

static double calculateInputCost(
    ResponseUsage usage,
    double pricePerMillion,
    double cacheInputMultiplier,
    double cacheWriteMultiplier) {
  long cached = usage.inputTokensDetails().cachedTokens();
  long written = usage.inputTokensDetails().cacheWriteTokens();
  long ordinary = usage.inputTokens() - cached - written;
  return (ordinary + cached * cacheInputMultiplier + written * cacheWriteMultiplier)
      * pricePerMillion
      / 1_000_000;
}
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



### 将提示缓存从早期模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 如果使用 `prompt_cache_key`，保留现有值以为不同的客户或用户保留独立的缓存计量。
- 替换 `prompt_cache_retention` 启用 `prompt_cache_options.ttl`.
- 确认可复用前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间会变化的内容，请在稳定前缀之后添加一个显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 在后续内容不值得写入的情况下。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟以及总成本](#monitor-cache-performance) 迁移前后的变化。





## 示例

以下示例适用于 GPT-5.6 及更高版本的模型。



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 评判



考虑一个单轮的 LLM 评判器，它用于判断一次已完成的交互是否显示出用户在与聊天机器人交互后感到满意的证据。每个请求使用相同的评分标准（rubric）和带标注的少样本示例来评估一次不同的交互。

- **保留前缀：** 固定的评分标准和示例放在最前面，二者合并后的长度刻意略高于模型的 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准裁判模型的内容。被评估的交互放在最后。
- **缓存模式与断点：** 启用仅显式缓存，并在固定的评分标准和示例之后设置断点。被评估的用户与聊天机器人对话位于该断点之后，不会写入缓存，从而避免对不太可能被复用的内容产生缓存写入费用。

使用这些原则的一个示例部署报告了 **约 70% 的 token 缓存命中率%**. 该图展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用情况。

用于单轮评判的 Responses API 请求

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



### 多轮 智能体



考虑一个具有较长且共享的开发者指令和频繁工具调用的多轮智能体。典型用法中，用户会同时运行多个会话与该智能体交互，并且经常对线程进行分叉。

- **保留前缀**:每一轮都会追加新的消息、工具调用和结果，而不重写先前的上下文，因此可复用的前缀会随着时间不断增长。
- **可选的提示缓存键：** 此示例使用 `agent_123_v1:user_456` 来为用户 456 维持独立的缓存账目，便于解释其缓存的 token 用量与计费。这也有助于防止跨用户的缓存命中探测。该键在该用户的会话中以及与智能体的分支之间保持不变。如果你的应用不需要这种区分，可以省略该键。
- **隐式缓存模式：** 启用隐式缓存，以便最新的符合条件的用户或工具消息提供一个断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前可复用的前缀，并提升分支场景下的缓存效率。

使用这些原则的一个示例部署报告了 **token 缓存命中率 >90%**. 该图展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用情况。

Responses API 多轮 智能体 请求

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



### 相同前缀并不总是表示缓存前缀



这种情况在 [从早期模型迁移到 GPT-5.6 或更高版本时尤为常见](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 原因是隐式缓存行为发生了变化。如果多个请求共享一个较长的前缀，但后缀不同，仅隐式缓存第一个完整请求并不会让较短的共享前缀可被复用。

想象一下，每个请求中都有一段固定的开发者消息，后跟一段动态的用户消息。该请求会将动态内容写入缓存。在下一个请求中修改这段动态内容时，无法匹配到之前那个更长的已缓存前缀，并且静态内容之后也没有单独的断点。

未在静态内容之后设置断点

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


若要解决此问题，请在两个请求的静态内容之后显式设置断点。第一个请求会写入可复用的前缀；即使后续请求中的动态内容发生变化，也可以复用该前缀。下面的示例使用仅显式模式，以避免将动态内容写入缓存。

在静态内容之后设置断点

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



### 切换到仅显式模式可能会错过隐式缓存写入



假设请求 1 使用隐式模式并缓存了到某条用户消息末尾的前缀，那么后续的请求 2 保留该前缀但切换到 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查其自身输入中的显式断点，因此它不会复用请求 1 中已保存的该隐式前缀（除非请求 2 中的某个显式断点与请求 1 中的缓存端点匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置显式断点，或保持启用隐式模式，以便先前符合条件的消息末尾仍可作为查找候选。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展消息可能会阻止其缓存前缀的复用



即便两个请求都使用隐式模式，仅保留相同的初始 token 也不一定足够。假设请求 1 以一条用户消息结尾，该消息包含 `Content A`，随后请求 2 将同一条消息扩展为 `Content A + Content B`。原来的端点在 `Content A` 之后现在位于一条消息内部，而非其末尾。正如在 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，如果在该边界处没有显式断点，请求 2 就不会复用那里保存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

在对话结构允许的情况下，保留原始消息并改为追加一条新消息。否则，将可复用的文本放在一个独立的内容块中，并在两个请求中该内容块之后放置一个显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有开发者消息都会自动作为隐式模式的缓存查找边界



在隐式模式下，连续的开发者消息块之后出现的开发者消息不会作为自动缓存查找的分界线。在可复用的开发者消息末尾添加一个显式断点，以在后续请求中保留该断点，这样 OpenAI 就能检查是否存在匹配的缓存前缀。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 最小可缓存长度因模型而异



在一个模型上符合缓存条件的前缀，在另一个模型上可能过短。请查看 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用的前缀。更换模型后，请重复上述检查，而不是假设先前模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可能会降低缓存复用率



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会将先前的对话上下文替换为更短的表示形式。这可能会改变前缀，因此即使对话在逻辑上相同，压缩（compaction）之后的第一次请求可能会复用到更少的先前缓存。

在可能的情况下，保持可复用的指令和参考资料稳定不变，然后让后续的轮次在压缩后的上下文基础上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 更少仍可能省钱。





## 常见问题



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型使用缓存的前缀生成新的响应，因此相同的请求不一定产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



否。目前尚不支持手动清除缓存。缓存项会依据模型的 [缓存生命周期](#cache-lifetime) 和保留设置而过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍然计入每分钟 token 限制。提示缓存不会改变如何应用 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 的计算方式。