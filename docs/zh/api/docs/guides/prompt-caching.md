# Prompt caching

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 为什么 prompt 缓存很重要

提示缓存会在多个请求共享相同的前缀时复用已有工作。这带来三个主要好处：

- **计算高效：** 避免重复计算模型已经处理过的提示前缀。
- **输入 token 更便宜：** 对复用的 token 按模型较低的缓存输入费率计费，最高可享 90% 折扣。
- **更快：** 减少响应开始前处理输入所花费的时间。

提示缓存默认在支持的 OpenAI 模型上启用。使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提升缓存复用率。

智能体 API 模型调用使用与 Responses API 相同的提示缓存行为。在同一会话内复用上下文可以保留共享的提示前缀，但维持会话并不保证缓存命中。详见 [可观测性与使用](https://developers.openai.com/api/docs/guides/agents-api/observability) 中关于会话使用字段与子智能体计费的内容。

提示缓存价格因模型而异。详见 [API 价格](https://developers.openai.com/api/docs/pricing) 以了解当前的缓存输入与缓存写入费率。缓存写入定价不是额外附加费用：输入 token 按未缓存输入、缓存输入或缓存写入费率计费。

## 什么是提示缓存？

当模型处理输入 token 时，必须计算中间状态，也就是键值（KV）状态。这些状态让模型在处理新输入和生成输出 token 时能够回溯到之前的 token。

提示缓存会为可复用的 **前缀**：保留这些状态：即提示开头未发生变化的 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型就可以复用已保存的状态，而无需再次处理这些 token。但它仍然需要处理任何新的输入才能生成新的响应。

提示缓存存储的是键值（KV）张量，而非 token 本身。



向 ChatGPT 寻求更深入的讲解



OpenAI 会缓存模型完整渲染后的上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 中包含的 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及受支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求完整渲染后的前缀完全匹配。如果在某个断点之前内容或相关设置发生了变化，则该断点之后的前缀无法匹配现有的缓存条目。

<a id="cache-affecting-settings"></a>



<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



修改请求并不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀并能找到匹配的断点。主要需要检查的设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可能使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具相关的指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改关于在单次轮次中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的架构。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能会更改模型端的推理指令。在支持的模型上，可使用 [configuration update](#change-reasoning-effort-without-rewriting-the-prefix) 来更改推理力度，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能会更改关于响应详情的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 用压缩后的上下文替换此前的对话内容，这可能导致从首个被更改的令牌起无法复用先前的缓存。                                                                                   |





## 缓存的工作原理

一个 **缓存断点** 标志着 OpenAI 可保存到缓存并在后续请求中复用的提示前缀的结束位置。首次请求会将符合条件的前缀写入缓存，后续请求会查找可用的最长匹配缓存前缀，从符合条件的断点向前回溯，直至找到匹配项。

提示前缀必须达到该模型的 **最小可缓存令牌长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的令牌不计入此最小值。GPT-5.6 及以后模型的最小可缓存提示长度为 1,024 个令牌，更早模型则因请求设置而异。详情请参阅 [模型对比](#summary-of-model-differences) 。

在满足最小可缓存令牌长度之后，你可以显式选择缓存断点的放置位置，或让 OpenAI 隐式选择其位置。可用选项因模型而异。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入的费用是标准、未缓存输入 token 价格的 1.25×。当你确定某个前缀会被复用时，这笔开销是值得的，因为后续读取只需支付该价格的 0.1×。写入某个前缀一次并完整复用一次的总成本是其普通输入成本的 1.35×，而不使用缓存处理两次则是 2×。随着每次额外的缓存读取，节省的费用会持续增加：在十次请求中，一次写入加九次完整读取的成本为 2.15×，而不使用缓存则是 10×。

同时支持隐式和显式缓存，其中显式缓存可以让你更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理需求自行选择放置缓存断点的位置。

- 将 `prompt_cache_options.mode` 设置为 `explicit` ，以仅使用开发者选定的断点，并通过在输入消息内的支持内容块中添加 `prompt_cache_breakpoint: { "mode": "explicit" }` 来标记每个所需的断点。
- 当未放置任何显式断点时，请求不会使用 prompt 缓存，也不会创建缓存写入。
- 显式模式允许你自行选择缓存写入的结束位置。最后一个选定断点之后的内容将按未缓存的输入 token 费率处理，且不计缓存写入费用，因此你可以避免写入那些可能不会被复用的易变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每次请求最多可创建四次缓存写入。
- `additional_tools` 输入项目前不接受 `prompt_cache_breakpoint`.

顶层 `instructions` 中不能包含显式断点。若要标记可复用的开发者指令，请将它们放在开发者消息内的某个 `input_text` 代码块中。

**隐式模式：** OpenAI 开箱即用地选择断点位置，适用于大多数用例。

- 当 `prompt_cache_options.mode` 为 `implicit`，OpenAI 会在最后一条符合条件的消息末尾放置一个断点。符合条件的消息包括：
  - 用户消息
  - 连续的一组工具响应中的最后一条工具响应
  - 初始连续开发者消息组中的最后一条开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽中的一个，从而保留三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### 早期模型



仅支持隐式缓存。OpenAI 在以下位置放置隐式断点： [模型相关间隔处](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头开始计数。只有位于或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才符合条件。

报告的 `cached_tokens` 缓存值是通过从最后一个匹配的断点减去隐藏的系统 token，然后向下取整到 128 的最近倍数计算得出的。





### 前缀匹配的工作原理

OpenAI 仅依次遍历传入请求中的 **缓存查找边界** (将在下文中说明)，从最长前缀到最短前缀，查找机器上已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个和最近 50 个显式断点。
- **隐式模式：** 前 2 个和最近 50 个显式断点、隐式断点、最多 20 个较早的符合条件的消息结尾，以及初始连续 developer 消息块的终点。这使得隐式模式能够复用一条此前没有显式断点的、较早消息处结束的此前消息前缀。

## 缓存生命周期

缓存条目不会被永久存储。后续请求只能在缓存条目仍然可用时复用已缓存的前缀，并且复用前缀会刷新其生命周期，而不会再次产生缓存写入费用。生命周期和保留设置 [取决于模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 用于控制最短缓存生命周期。当前唯一支持的值， `30m`，也是默认值。缓存前缀在其最近一次写入或复用后 30 分钟内可继续被复用，OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### 早期模型



使用 `prompt_cache_retention`，支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟的不活动后失效，最多保留一小时。
- `24h`: 延长保留通常使条目保持可用约 30 分钟，并可保留长达 24 小时。

**Retention defaults and Zero Data Retention**

Prompt caching may store encrypted key/value tensors in GPU-local storage as application state. For models that support both `in_memory` and `24h`, the default depends on your organization's data retention policy:

- Organizations _未_ 启用 Zero Data Retention 的默认 `24h`.
- Organizations _启用_ 启用 Zero Data Retention 的默认 `in_memory`.

在选择值之前，请先核实你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态存放在各个机器上,当流量超过每分钟 15 个请求时,可能导致溢出路由。请求只有在抵达持有未过期匹配条目的机器时,才能复用缓存前缀。因此,将请求路由到正确的机器对缓存复用至关重要。

缓存不会在组织之间共享,也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内,某个模型的路由取决于:

- 当前的机器负载和可用容量。
- 对隐藏的 OpenAI 内容之后初始 token 的哈希值，若包含工具定义也会一并纳入。哈希的 token 数量因模型而异。
- 提供的 [`prompt_cache_key`](#prompt-cache-keys)，用于在不同请求组之间隔离缓存复用，并有助于在 GPT-5.6 之前的模型上优化缓存路由。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



在 GPT-5.6 之前的模型上，请使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) ，用于共享可复用前缀的请求，以帮助将相关请求路由到同一个缓存。对于繁忙分组，目标是在使用每个 key 的所有前缀上每分钟总共约 15 个请求。通过使用稳定、确定性的映射，将更高流量的请求分配到多个 key。请将相关请求保留在同一个 `prompt_cache_key` ，以便它们可以复用其缓存。Key 影响路由；它们不会将请求固定到某台机器，也不保证缓存命中。

在 GPT-5.6 及更高版本上，OpenAI 会自动处理缓存路由；不需要使用 key 来优化缓存。你可以使用不同的 key 来为应用内的客户或用户分别维护缓存计费。

使用不同的 key 可以更轻松地解释每个客户或用户的缓存 token 使用量和计费。例如，不同的 key 有助于防止跨用户的缓存命中探测：即提交候选提示并观察缓存命中情况，以推断之前是否缓存了匹配的内容。详见 [使用 key 分离缓存计费](#separate-prompts-with-cache-keys).





<a id="model-differences-at-a-glance"></a>

## Summary of model differences

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最近一条符合条件消息的末尾。          | 按规则的 2,048 token 间隔分布。                    | 按规则的、与模型相关的间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| `prompt_cache_key`         | 用于独立缓存计费的可选项              | 使用稳定 key 来优化缓存路由                  | 使用稳定 key 来优化缓存路由                                      |
| 可缓存前缀的最小长度   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 已缓存 token 报告     | 精确的符合条件边界，不包含隐藏 token    | 不包含隐藏 token，并向下取整到 128 的倍数 | 不包含隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取费用          | 0.1× 未缓存输入 token 的费率                  | 依模型而定的缓存输入费率                           | 依模型而定的缓存输入费率                                               |
| 缓存写入费用         | 1.25× 未缓存输入 token 的费率                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 最近一次写入或复用后至少 30 分钟 | 通常约 30 分钟，最长可达 24 小时                 | 通常非活动 5 到 10 分钟 `in_memory`，或最长可达 24 小时 `24h` |

<a id="extended-retention-models"></a>




\* 扩展保留由以下模型支持 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，可缓存的最小输入长度会随请求设置而变化，包括工具、图像、输出架构、推理力度和冗长度。



让 ChatGPT 查找我请求的缓存最小值



<a id="best-practices"></a>

## 如何优化提示缓存

关注 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#manage-tools-with-append-only-updates)，以及选择缓存发生的位置。在 GPT-5.6 及更高版本上，使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来控制缓存断点。如果你的应用需要为客户分别核算缓存，还可以使用可选的 [`prompt_cache_key`](#separate-prompts-with-cache-keys) 。在 GPT-5.6 之前的模型上，使用稳定的 `prompt_cache_key` 来为共享可复用前缀的请求优化缓存路由。



让 ChatGPT 优化我的提示缓存





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史可以节省比仅缓存初始指令更多的输入 token。保留早期的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 把稳定的开发者指令和共享参考资料放在最前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将它们放在末尾而不是开头，或将它们移到后续对话消息中。
- **保留对话历史。** 追加新消息而不是重写之前的对话轮次。摘要、 [压缩](#compaction-can-reduce-cache-reuse)，或上下文截断都可能改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理力度。** 在 GPT-6 Astra 上，可以追加一个 `configuration_update` 输入项，在响应之间更改推理力度的同时保持请求级别 `reasoning.effort` 不变。这样可以保留原始前缀以便复用缓存。请参阅 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性限制。

在断点之后保持持续变化的内容

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



### 在不改写前缀的前提下更改推理力度



在支持的 GPT-6 及更高模型上，追加一个 `configuration_update` 输入项到 [在对话过程中更改推理强度](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) 同时保留之前缓存的前缀。保持顶层 `reasoning.effort` 为其原始值，因为更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新将控制后续响应的推理强度。例如，将此项追加到现有 `input` 数组中以切换到 `high` 后续请求的推理：

追加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```






<a id="tools"></a>



<a id="manage-tools-with-append-only-updates"></a>



### 通过仅追加更新来管理工具



当应用所需的工具因请求而异时，可在保持工具定义稳定的前提下更改可调用的工具，以保留可复用的前缀缓存。

- **保持工具的一致性。** 保留工具定义、顺序与 schema。
- **在请求中禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设置为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可被调用，同时保持所提供的 `tools` 列表稳定。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 启用 `defer_loading: true` 以减少多轮对话早期请求中用于工具定义的输入 token。已发现的工具会追加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用 developer-role [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你的应用逻辑在线程中添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控件决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你自行选择的边界。

- **自动放置断点。** 使用隐式缓存，在最近一条符合条件的消息末尾放置断点。这对于在现有上下文后追加内容的多轮对话非常方便。
- **谨慎选择断点。** 在稳定内容的末尾放置显式标记。使用仅显式模式，以避免为不断变化的后缀执行不必要的缓存写入。



> 图示：在仅显式缓存模式下，工具和 schema 位于一个稳定的前缀部分，并在开发者消息前缀之前结束断点 1。其中一个分支在断点 2 之前添加了一个可变的开发者消息后缀以及更多对话轮次，然后拆分出新的用户输入。另一个分支包含一个未被选中的可变后缀。每个分支最后一个被选中断点之后的内容将按未缓存的输入费率计费，且不产生缓存写入费用。







<a id="prompt-cache-key-best-practices"></a>

<a id="tune-prompt-cache-keys"></a>

<a id="separate-prompts-with-cache-keys"></a>



<a id="separate-cache-accounting-with-keys"></a>



### 使用密钥分别统计缓存用量



在 GPT-5.6 及更高版本上，使用 `prompt_cache_key` 当你希望在应用内为不同的客户、用户或工作空间维护独立的缓存核算时，可以使用该密钥。它能让每个分组下的缓存 token 使用和计费更容易解释。该密钥是可选的，在这些模型上优化缓存时并不需要它。

- **选择如何区分缓存计费。** 为每个需要单独统计缓存用量（缓存计费）的客户或用户分配一个不同的 key。例如， `support:customer_123` 和 `support:customer_456` 为两个客户分别统计缓存用量，即使他们的请求包含相同的前缀也是如此。
- **保持每个分组内的 key 稳定不变。** 对同一客户的相关请求复用同一个 key。只有当某个会话或线程需要独立的缓存计费时，才为其生成新的 key。
- **始终如一地应用 key。** 在客户的请求中统一使用该客户的 key，以维持独立的缓存计费。这也有助于防止跨客户的缓存命中探测。

在 GPT-5.6 之前的模型上， `prompt_cache_key` 对于优化缓存命中率非常重要。为共享可复用前缀的请求使用稳定的键，有助于将它们路由到同一缓存。对于请求量较大的分组，请遵循关于 [跨更多键分配流量的指引](#prompt-cache-keys).





<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留



对于更早的模型，建议设置 `prompt_cache_retention` 为 `"24h"` 用于在模型与你的数据保留要求允许的情况下延长保留时间。详见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 规避可缓存最小长度成本陷阱



如果许多请求复用了相同的开发者指令和工具定义,但该共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences),请考虑缩短它或使用有用的、稳定指令、示例或参考材料进行扩展。衡量缓存复用是否能抵消额外的输入 token 和任何缓存写入费用,并确保评估和行为保持稳定。

该图表突出显示了最小可缓存长度的成本陷阱,其中较短的前缀长度相比扩展到最小可缓存 token 长度反而会产生更多未缓存的成本。

<a id="mathematical-details"></a>



#### 数学细节



若仅比较成本，令 $$M$$ 为可缓存的最小长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为总请求次数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并且在之后每次请求中都得到完全复用。以未缓存输入 token 等价计算，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时保留较短前缀成本更低。在相等的情况下，两种成本相同。扩展更便宜的最小的完整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反过来，将可缓存前缀压缩到 $$M$$ 以下则会丧失缓存：在相同假设下，较短的未缓存前缀必须降到 $$L_{\mathrm{break\text{-}even}}$$ 以下，才比缓存 $$M$$ 个 token 更划算。不存在通用的最大成本 prompt 长度；交叉点取决于复用率和定价。

例如，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求的场景下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更划算。随着复用率提高，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次总请求才能获益；在这些假设下，102 个或更少 token 的前缀永远不会获益。此比较未考虑性能、输出 token 以及未变化部分的请求成本。额外的未命中、写入或不同的模型费率都会改变结果。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 追踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，输入 token 数、延迟和实际成本。通过将缓存命中 token 总数除以输入 token 总数来计算 token 缓存命中率，并按用户、工作空间、日期或其他有意义的维度汇总这两个计数。
- **计算输入成本。** 使用 `response.usage` 中的 token 数以及模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
- **使用提示缓存仪表板。** 在 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching).

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



### 将 prompt caching 从更早的模型迁移到 GPT-5.6 及更高版本



- 保留现有稳定的前缀。
- 如果你使用 `prompt_cache_key`,请保留现有值,以便为客户或用户保留独立的缓存计量。
- 替换 `prompt_cache_retention` 启用 `prompt_cache_options.ttl`.
- 确认可复用的前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在不同请求之间变化的内容,请在稳定前缀之后添加一个显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` ,当后续内容不值得写入时。
- [比较 `cached_tokens`, `cache_write_tokens`,迁移前后的延迟和总成本](#monitor-cache-performance) 。





## 示例

以下示例适用于 GPT-5.6 及更高版本的模型。



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 作为评判者



考虑一个单轮 LLM 评判器，它用于判断一段已完成的对话是否显示出用户在与聊天机器人交互后感到满意的证据。每次请求都使用相同的评分量表和带标签的少样本示例来评估不同的交互。

- **保留前缀：** 固定的评分标准和示例放在前面。它们的合并长度刻意保持在刚好超过模型的 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准评判者的材料。待评估的交互放在最后。
- **缓存模式和断点：** 已启用仅显式缓存，并在固定的评分标准和示例之后设置断点。待评估的用户–聊天机器人对话位于该断点之后，不会写入缓存，从而避免对不太可能被重复使用的内容产生缓存写入费用。

一个采用这些原则的部署示例报告了 **约 70% 的 token 缓存命中率%**。该数字展示了一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用方式。

Responses API 单轮评判请求

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



### 多轮智能体



考虑一个多轮智能体，它具有冗长的共享开发者指令并频繁调用工具。典型场景中，用户会同时运行多个与该智能体的会话，并经常对线程进行分叉。

- **保留前缀**：每一轮都会追加新的消息、工具调用和结果，而不会重写先前的上下文，因此可复用的前缀会随时间不断增长。
- **可选的 prompt 缓存键：** 本示例使用 `agent_123_v1:user_456` 为用户 456 单独维护缓存核算，便于解释其缓存 token 用量与计费，同时也有助于防止跨用户的缓存命中探测。该键在该用户的会话中以及与 智能体的分支中保持不变。如果你的应用不需要这种区分，可以省略它。
- **隐式缓存模式：** 启用隐式缓存后，最新的符合条件的用户或工具消息会充当断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前可复用的前缀，并提升分叉时的缓存效率。

一个采用这些原则的部署示例报告了 **token cache-hit rate >90%**。该数字展示了一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用方式。

用于多轮 智能体 的 Responses API 请求

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

## 常见陷阱



<a id="a-shared-prefix-is-not-always-a-cached-prefix"></a>



### 共享前缀并不总是缓存前缀



这种情况在 [从早期模型迁移到 GPT-5.6 或更高版本时](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 尤为常见,因为隐式缓存行为发生了变化。如果请求共享一个长前缀但后缀不同,仅隐式缓存第一个完整请求并不会让较短的那个共享前缀可被复用。

设想在每个请求中放置一条固定的开发者消息和一条动态的用户消息。该请求会直接透传这些动态内容。若在下一条请求中修改这些内容,将无法匹配到此前缓存的较长前缀,并且在静态内容之后也没有独立的断点。

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


若要修复，请在两个请求中的静态内容之后放置一个显式断点。第一个请求写入可复用的前缀；即使后续动态内容发生变化，下一个请求也可以复用它。此示例使用仅显式模式，以避免将动态内容写入缓存。

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



假设请求 1 使用隐式模式并缓存了一个一直延伸到某条用户消息末尾的前缀，那么后续的请求 2 保留该前缀但切换到 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查其自身输入中的显式断点，因此它不会复用请求 1 中保存的该隐式前缀（除非请求 2 中的某个显式断点与请求 1 中缓存的端点匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

若要复用请求 1 中的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或者保持隐式模式启用，以便先前的符合条件的消息结尾仍可作为查找候选。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展一条消息可能会导致无法复用其已缓存的前缀



即使两个请求都使用隐式模式，仅保留相同的初始 token 也不一定足够。假设请求 1 以一条包含 `Content A`，的用户消息结束，那么后续的请求 2 会将这条消息扩展为 `Content A + Content B`。原先的端点（在 `Content A` 之后）现在位于一条消息内部，而不是处于消息的末尾。正如在 [前缀匹配的工作原理](#how-prefix-matching-works)，中所解释的，如果在该边界处没有显式的断点，请求 2 就不会复用此前已缓存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

当对话结构允许时，保留原始消息并追加一条新消息。否则，将可复用的文本单独放在一个内容块中，并在两个请求中该内容块之后放置一个显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有开发者消息都会自动作为隐式模式缓存查找的边界



在隐式模式下，连续的开发者消息初始块之后的开发者消息不会成为自动的缓存查找边界。在可复用的开发者消息末尾添加一个显式断点，以便在后续请求中保留该断点，这样 OpenAI 就能检查是否存在匹配的缓存前缀。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 可缓存的最小长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能过短。请查看 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用前缀。更换模型时，请重新进行该检查，而不是假设之前模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可以减少缓存复用



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会用更短的表示替换先前的对话上下文。这会改变前缀，因此即使在逻辑上是同一段对话，紧随压缩之后的首次请求可复用的先前缓存也可能会减少。

尽量让可复用的指令和参考资料保持稳定，然后再让后续轮次在压缩后的上下文上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 减少也仍然可以节省费用。





## 常见问题解答



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会基于缓存的前缀生成新响应，因此相同的请求并不保证产生完全相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



否。目前不支持手动清除缓存。缓存条目会根据模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍会计入每分钟 token 限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 的计算方式。