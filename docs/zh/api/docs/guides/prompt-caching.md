# Prompt caching

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 为什么 prompt 缓存很重要

提示缓存会在请求共享相同的前缀时复用已有工作。这带来三个主要优势：

- **Compute-efficient:** 避免重复计算模型已经处理过的提示前缀。
- **Cheaper input tokens:** 对复用 token 按模型缓存输入的优惠费率计费，最高可减免 90%。
- **Faster:** 减少响应开始前处理输入所花费的时间。

对于受支持的 OpenAI 模型，提示缓存默认处于启用状态。可使用 [提示缓存仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 来诊断缓存未命中并提升缓存复用率。

智能体 API 模型调用所使用的提示缓存行为与 Responses API 一致。在同一会话内复用上下文可以保留共享的提示前缀，但仅维持会话并不能保证一定命中缓存。详见 [可观测性与使用情况](https://developers.openai.com/api/docs/guides/agents-api/observability) 中关于会话使用字段与子智能体计费说明的内容。

## 什么是提示缓存？

当模型处理输入 token 时，必须计算被称为键值（KV）状态的中间状态。这些状态让模型在处理新输入并生成输出 token 时，能够回溯到先前的 token。

提示缓存会将该状态保留为可复用的 **前缀**：即提示开头保持不变的 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型可以复用已保存的状态，而无需再次处理这些 token。但它仍需要处理任何新输入才能生成新的响应。

提示缓存存储的是键值（KV）张量，而非 token 本身。



向 ChatGPT 寻求更深入的解释



OpenAI 会缓存模型完整渲染后的上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 其中包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，和受支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求完整渲染的前缀完全匹配。如果在某个断点之前内容或相关设置发生变化，则该变化之后的前缀无法与现有缓存条目匹配。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



修改请求不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀，并且能否找到符合条件的匹配断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可能使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具特定的指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改有关在单轮中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的架构。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能会更改模型端的推理指令。在支持的模型上，使用 [配置更新](#change-reasoning-effort-without-rewriting-the-prefix) 来更改推理力度，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能会更改有关响应详细程度的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 使用压缩后的上下文替换此前的对话内容，可能导致从首个发生更改的 token 之后无法复用。                                                                                   |





## 缓存的工作原理

一个 **缓存断点** 标记提示前缀的结束位置，OpenAI 可以将其保存到缓存中并在后续请求中复用。首次请求会将符合条件的前缀写入缓存，后续请求会查找可用的最长匹配缓存前缀，从符合条件的断点向后回溯，直到找到匹配项。

提示前缀必须达到模型的 **最小可缓存 token 长度** 后才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最小值。GPT-5.6 及更高模型的最小可缓存提示长度为 1,024 个 token，更早的模型则因请求设置而异。详见 [模型对比](#summary-of-model-differences) 页面。

满足最小可缓存 token 长度后，你可以选择显式放置缓存断点的位置，或者让 OpenAI 隐式选择其位置。可用选项取决于具体模型。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入成本为标准、未缓存输入 token 价格的 1.25×。当你确认某个前缀会被复用时，支付这笔费用是值得的，因为后续读取仅需 0.1× 的价格。写入一次前缀并完整复用一次的成本是其普通输入成本的 1.35×，相比之下不进行缓存而处理两次则为 2×。每次额外的缓存读取都会进一步增加节省：跨十次请求而言，一次写入加九次完整读取的成本为 2.15×，而不使用缓存则为 10×。

支持隐式和显式两种缓存方式，其中显式缓存可让你更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理需求，自行决定在何处放置缓存断点。

- 将 `prompt_cache_options.mode` 设为 `explicit` ，即可仅使用开发者选择的断点，并通过在输入消息中的受支持内容块内添加 `prompt_cache_breakpoint: { "mode": "explicit" }` 来标记每个所需的断点。
- 如果未放置任何显式断点，则请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式允许你选择缓存写入的结束位置。最后一个所选断点之后的内容按未缓存的输入 token 费率处理，不会产生缓存写入费用，因此你可以避免写入那些不太可能被复用的易变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每个请求最多可以创建四次缓存写入。
- `additional_tools` 输入项目前不接受 `prompt_cache_breakpoint`.

顶级 `instructions` 不能包含显式断点。要标记可复用的开发者指令，请将它们放在 `input_text` 块内的开发者消息中。

**隐式模式：** OpenAI 默认即可选择适合大多数用例的断点位置。

- 当 `prompt_cache_options.mode` 时 `implicit`, OpenAI 会在最新一条符合条件的消息末尾设置一个断点。符合条件的消息包括:
  - 用户消息
  - 连续一组工具响应中的最后一条工具响应
  - 初始连续一组开发者消息中的最后一条开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；隐式断点会占用四个缓存写入槽中的一个，因此还剩三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### 早期模型



仅支持隐式缓存。OpenAI 将隐式断点放置在 [模型相关的间隔处](#summary-of-model-differences), 该间隔从隐藏的 OpenAI 系统消息开头算起。只有位于或超过最小可缓存长度（从隐藏上下文末尾算起）处的断点才符合条件。

报告的 `cached_tokens` 缓存令牌数通过从最后一个匹配的断点中减去隐藏的系统令牌数,然后向下取整到最接近的 128 的倍数计算得出。





### 前缀匹配的工作原理

OpenAI 仅介绍了 **缓存查找边界** （下文将介绍）按从最长前缀到最短前缀的顺序在传入请求中查找本机已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个和最近 50 个显式断点。
- **隐式模式：** 前 2 个和最近 50 个显式断点、隐式断点、最多 20 个较早的符合条件的消息结尾，以及初始连续 developer 消息块的端点。这使得隐式模式能够复用前缀，该前缀在较早的消息处结束而此处没有显式断点。

## 缓存生命周期

缓存条目不会无限期存储。只有在该条目仍然可用时，后续请求才能复用缓存的前缀，并且复用前缀会在不产生额外缓存写入费用的情况下刷新其生命周期。生命周期和保留设置 [取决于所使用的模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 控制最小缓存生命周期。唯一支持的值， `30m`，也是默认值。缓存的前缀在最近一次写入或复用后 30 分钟内仍然可被复用，不过 OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### 早期模型



使用 `prompt_cache_retention`，支持的值因模型而异：

- `in_memory`: 条目通常在约 5 到 10 分钟的不活动后失效，最长可达一小时。
- `24h`: 扩展保留通常使条目可用约 30 分钟，最多可保留 24 小时。

**保留策略默认值与零数据保留**

提示缓存可能会将加密后的键/值张量作为应用状态存储在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，默认行为取决于你所在组织的数据保留策略：

- Organizations _未启用_ Zero Data Retention 的组织默认 `24h`.
- Organizations _启用_ Zero Data Retention 的组织默认 `in_memory`.

在选择保留策略值之前，请先确认你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态保存在各台机器上，当流量超过每分钟 15 次请求时，可能导致溢出路由。请求只有在到达持有未过期匹配条目的机器时，才能复用缓存前缀。因此，将请求路由到正确的机器对缓存复用非常重要。

缓存不会在组织之间共享，也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，指定模型的路由取决于以下因素：

- 当前的机器负载与可用容量。
- 隐藏的 OpenAI 内容之后初始 token 的哈希值，包含工具定义（若存在）。被哈希的 token 数量因模型而异。
- 一个可选的 [`prompt_cache_key`](#prompt-cache-keys)，用于在不同请求分组之间隔离缓存复用。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



[`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 是一个可选的控件，用于在你的应用内为不同客户或用户维护独立的缓存计量。OpenAI 会自动处理缓存路由；在正常缓存场景下，你可以省略该键。

使用不同的键可以更清晰地解释每个客户或用户的缓存 token 用量与计费。例如，不同的键有助于防止跨用户进行缓存命中探测：即提交候选提示并观察缓存命中，以推断匹配内容是否已被缓存。详见 [使用键实现独立的缓存计量](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## Summary of model differences

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最新可纳入消息的末尾。          | 按固定的 2,048 token 间隔分布。                    | 按固定的、依模型而定的间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| 最小可缓存前缀   | 1,024 个可见输入 token                          | 随请求设置而异                                  | 随请求设置而异                                                      |
| 缓存 token 报告     | 精确的可纳入边界，不含隐藏 token    | 不含隐藏 token,并向下取整到 128 的倍数 | 不含隐藏 token,并向下取整到 128 的倍数                     |
| 缓存读取费用          | 未缓存输入 token 单价的 0.1×                  | 依模型而定的缓存输入单价                           | 依模型而定的缓存输入单价                                               |
| 缓存写入费用         | 未缓存输入 token 价格的 1.25 倍                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留时长取值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 最近一次写入或复用后至少 30 分钟 | 通常约 30 分钟，最长 24 小时                 | 通常为 5 到 10 分钟不活跃（针对 `in_memory`），或最长 24 小时（针对 `24h` |

<a id="extended-retention-models"></a>




\* 扩展保留受以下模型支持 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，可缓存的最小输入长度会因请求设置而异，包括工具、图片、输出架构、推理力度和详细程度。



让 ChatGPT 查找我的请求的最小缓存长度



<a id="best-practices"></a>

## 如何优化提示词缓存

重点在于 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates)，并选择缓存发生的位置。使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要为不同客户分别进行缓存核算，还可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys).



Ask ChatGPT to optimize my prompt caching





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史比仅缓存初始指令能节省更多输入 token。保留较早的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考材料放在前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将其放在末尾而不是开头，或移至后续对话消息中。
- **保留对话历史。** 追加新消息而不是重写早期的轮次。摘要、 [compaction](#compaction-can-reduce-cache-reuse)，或上下文截断都可能改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理力度。** 在 GPT-6 Astra 上，可以追加一个 `configuration_update` 输入项来在多次响应之间更改推理力度，同时保持请求级别的 `reasoning.effort` 不变。这保留了原始前缀以便缓存复用。请参阅 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 中的示例和兼容性限制。

在断点之后继续修改内容

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



### 在不重写前缀的前提下更改推理工作量



在受支持的 GPT-6 及更高版本模型上，可附加一个 `configuration_update` 输入项以 [在对话过程中更改推理工作量，同时保留先前已缓存的前缀。](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) 请将顶层的 `reasoning.effort` 保持为其原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新将控制后续响应的推理工作量。例如，将以下项附加到现有的 `input` 数组中，即可为后续请求切换为 `high` 推理：

要附加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 使用仅追加更新管理工具



当你的应用所需的工具因请求而异时，保留可复用的前缀，仅切换哪些工具可被调用，而保持工具定义本身不变。

- **保持工具一致性。** 保留工具定义、顺序和 schema。
- **为某个请求禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可以被调用，同时保持所提供 `tools` 列表的稳定。
- **按需加载工具。** 使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 启用 `defer_loading: true` 以减少多轮对话早期请求中用于工具定义的输入 token。已发现的工具会追加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用 developer 角色 [`additional_tools` 输入项](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你的应用逻辑在线程中添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控件决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你选择的边界。

- **自动放置断点。** 使用隐式缓存在最新符合条件的消息末尾放置断点。这对于在已有上下文后追加内容的多轮对话十分方便。
- **有意识地选择断点。** 在稳定内容的末尾放置显式标记。使用仅显式模式，避免为不断变化的后缀写入不必要的缓存。



> 图示：在仅显式模式下，工具和 schema 位于稳定的前缀之前，然后到达断点 1。其中一个分支会添加可变的开发者后缀和更多对话轮次，再到达断点 2，然后拆分为新的用户输入。另一个分支包含一个未被选中的可变后缀。每个分支最后一个被选中断点之后的内容，按未缓存输入费率计费，不收取缓存写入费用。







<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 按 Key 分离缓存计量



使用 `prompt_cache_key` 当你想在应用内为不同客户、用户或工作空间分别维护缓存计数时，这会很有用。这样可以更轻松地解释每个分组内的缓存 token 使用与计费情况。key 是可选的，启用缓存优化时并不需要它。

- **选择如何分离缓存计费。** 为每个需要独立缓存计费的客户或用户分配一个不同的 key。例如， `support:customer_123` 以及 `support:customer_456` 即使两个客户的请求包含相同的前缀，也为它们维护独立的缓存计费。
- **确保 key 在每个组内保持稳定。** 对同一客户的相关请求复用相同的 key。只有在某个会话或线程需要自己的缓存计费时，才为其生成新的 key。
- **一致地应用 key。** 在客户的请求中复用该客户的 key，以维护独立的缓存计费。这也有助于防止跨客户的缓存命中探测。





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留



对于较旧的模型，建议设置 `prompt_cache_retention` 为 `"24h"` 以便在模型和你的数据保留要求允许的情况下延长保留时间。参见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 避开最小可缓存长度成本陷阱



如果许多请求复用相同的开发者指令和工具定义，但该共享前缀长度低于模型的 [minimum cacheable length](#summary-of-model-differences),考虑缩短该前缀,或向其中补充有用且稳定的指令、示例或参考材料。同时衡量缓存复用所带来的收益能否抵消额外的输入 token 以及任何缓存写入费用,并确保评估结果与行为保持稳定。

该图表重点展示了最小可缓存长度这一成本陷阱:较短的前缀长度可能比扩展至最小可缓存 token 长度产生更多未缓存开销。

<a id="mathematical-details"></a>



#### 数学细节



仅从成本角度比较，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并在之后每次请求中被完整复用。以未缓存输入 token 等价量计算，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀的成本更低。相等时两者成本相同。使得扩展更便宜的最小整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短到 $$M$$ 以下会丧失缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token。不存在通用的最大成本提示词长度；交叉点取决于复用情况与定价。

例如，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更为划算。随着复用增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能获益；在这些假设下，102 个或更少 token 的前缀永远不会获益。此比较未考虑性能、输出 token 以及未变的请求成本。额外的未命中、写入或不同的模型费率会改变该结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 记录 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`、输入 token 数量、延迟以及实际成本。通过将总缓存 token 数除以总输入 token 数来计算 token 缓存命中率，并按用户、工作区、天或其他有用的维度对两个计数进行聚合。
- **计算输入成本。** 使用 `response.usage` 中的 token 数量和模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用 Prompt Caching 仪表盘。** 在 [Prompt Caching 仪表盘](https://platform.openai.com/usage?usage_section=prompt-caching).

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



### 将提示缓存从早期模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 如果使用 `prompt_cache_key`，请保留现有值，以保持客户或用户各自的缓存计费独立。
- 替换 `prompt_cache_retention` 启用 `prompt_cache_options.ttl`.
- 确认可复用的前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 当后续内容不值得写入时。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟和总成本](#monitor-cache-performance) 迁移前后的差异。





## 示例



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 作为评判



考虑一个单轮 LLM 评判器，它用于判断一次已完成的对话中是否有证据表明用户在与聊天机器人交互后感到满意。每次请求都使用相同的评分标准和带标签的少样本示例来评估不同的交互。

- **保留前缀：** 固定的评分标准和示例放在最前面。它们的合并长度故意保持在模型 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准裁判的素材。被评估的交互放在最后。
- **缓存模式与断点：** 仅显式缓存已启用,并在固定评分标准与示例之后设置一个断点。被评估的用户–聊天机器人对话位于该断点之后,不会被写入缓存,从而避免对不太可能被复用的内容收取缓存写入费用。

一个采用这些原则的部署案例报告称 **令牌缓存命中率约为 70%**。该数字展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用方式。

用于单轮评判的Responses API请求

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



考虑一个多轮 智能体，其开发者指令较长且共享，工具调用频繁。典型使用场景中，用户会同时运行多个该 智能体 会话，并且经常会分叉这些会话线程。

- **保留前缀**：每一轮都会追加新的消息、工具调用和结果，而不重写先前的上下文，因此可复用的前缀会随着时间增长。
- **可选的提示缓存键：** 本示例使用 `agent_123_v1:user_456` 来为用户 456 维护独立的缓存核算，使其缓存的 token 用量和计费更容易说明。这也有助于防止跨用户的缓存命中探测。该键在该用户的会话和使用 智能体 的分叉中保持一致。如果你的应用不需要这种隔离，可以省略它。
- **隐式缓存模式：** 启用隐式缓存，以便最新的符合条件的用户或工具消息提供一个断点。
- **显式断点：** 在每个工具结果之后添加断点，以保留先前可复用的前缀，并提升分叉的缓存效率。

一个采用这些原则的部署案例报告称 **token 缓存命中率 >90%**。该数字展示了一种可能的结果。实际的缓存命中率上限将取决于你的上下文和应用使用方式。

多轮智能体的 Responses API 请求

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



### 共享前缀并不总是被缓存的前缀



这种情况在 [从早期模型迁移到 GPT-5.6 或更高版本时尤为常见](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) ，原因是隐式缓存行为发生了变化。如果请求共享一个较长的前缀但后缀不同，那么仅隐式缓存第一个完整请求并不能让较短的共享前缀可被复用。

设想在每个请求中都有一个静态的开发者消息，后跟一个动态的用户消息。该请求会直接写入动态内容。在下一次请求中更改该动态内容时，无法匹配更长的已缓存前缀，并且在静态内容之后也没有单独的断点。

在静态内容之后没有断点

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


若要修复，请在两个请求中静态内容之后放置一个显式断点。第一个请求会写入可复用的前缀；下一个请求即使动态内容发生变化也能复用它。本示例使用仅显式模式，以避免将动态内容写入缓存。

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



假设请求 1 使用隐式模式，并通过某个用户消息的末尾缓存了一段前缀，那么后续请求 2 保留该前缀但切换到 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查自身输入中的显式断点，因此它不会复用请求 1 中保存的那段隐式前缀（除非请求 2 中的某个显式断点正好与请求 1 中缓存的端点匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或保持隐式模式启用，以便先前符合条件的消息结尾仍可作为查找候选项。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展消息可能会阻止其缓存前缀被复用



即使两个请求都使用隐式模式，仅保留相同的初始 token 也不一定足够。假设请求 1 以一条包含 `Content A`，的用户消息结束，而后续的请求 2 将同一条消息扩展为 `Content A + Content B`。 `Content A` 之后的旧端点现在位于一条消息内部，而不是其末尾。如 [前缀匹配的工作原理](#how-prefix-matching-works)，所述，如果在该边界处没有显式断点，请求 2 就不会复用那里已保存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

如果对话结构允许，请保留原始消息并改为追加一条新消息。否则，请将可复用的文本保留在独立的内容块中，并在两个请求中该内容块之后放置显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有 developer 消息都会自动作为隐式模式的缓存查找边界



在隐式模式下，连续的初始开发者消息块之后的开发者消息不会作为自动缓存查找边界。若要保留该断点以便后续请求中复用，请在可复用的开发者消息末尾添加显式断点，这样 OpenAI 就能检查是否存在匹配的前缀缓存。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 可缓存的最小长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能过短。请检查 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来衡量可复用前缀。更换模型时，请重新进行上述检查，而不是假设原模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可能会降低缓存复用率



[压缩](https://developers.openai.com/api/docs/guides/compaction) 会用更短的表示替换先前的对话上下文。这可能会改变前缀，因此压缩之后的第一个请求即使在对话逻辑上相同，也可能较少复用之前的缓存。

尽可能保持可复用的指令和参考资料稳定，让后续轮次在压缩后的上下文上构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 更少仍可能省钱。





## 常见问题



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出令牌的方式。模型使用缓存的前缀生成新响应，因此相同的请求并不能保证产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



否。目前不提供手动清除缓存的功能。缓存项会根据模型的 [缓存生命周期](#cache-lifetime) 与保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍计入每分钟 token 限制。Prompt caching 并不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 的计算方式。