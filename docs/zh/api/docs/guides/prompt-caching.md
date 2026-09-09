# Prompt caching

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

## 为什么提示缓存很重要

提示缓存会在请求共享相同的前缀提示时复用已有工作。这带来三个主要好处：

- **计算高效：** 避免重复计算模型已经处理过的提示前缀。
- **输入 token 更便宜：** 对复用的 token 按模型降低后的缓存输入费率付费，最高可享 90% 折扣。
- **更快：** 减少响应开始前处理输入所花费的时间。

受支持的 OpenAI 模型默认启用提示缓存。可使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 监控缓存读取命中率，并使用 [提示缓存诊断工具](https://developers.openai.com/api/docs/guides/prompt-caching/diagnostics) 诊断缓存未命中并提升缓存复用率。

## 什么是 prompt 缓存？

当模型处理输入 token 时，必须计算称为键值（KV）状态的中间状态。这些状态让模型在处理新输入并生成输出 token 时能够回溯到先前的 token。

提示缓存会为可复用的 **前缀**：保留这些状态：前缀即提示开头的未更改 token。当后续请求具有相同的前缀并找到匹配的缓存条目时，模型可以复用已保存的状态，而无需再次处理这些 token。但它仍然需要处理任何新的输入以生成新的响应。

提示缓存存储的是键值（KV）张量，而非 token 本身。



向 ChatGPT 寻求更深入的解释



OpenAI 会缓存模型的完整渲染上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求整个渲染前缀完全匹配。如果在某个断点之前内容或相关设置发生更改，则该断点之后的前缀将无法匹配现有缓存条目。

<a id="which-settings-affect-the-cached-prefix"></a>



### 哪些设置会影响缓存前缀？



更改请求并不一定会丢弃现有的缓存条目。关键在于后续请求是否具有相同的前缀，并且能够找到匹配的可用断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可以使用不同的权重和缓存行为。                                                                                                                                            |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具特定指令。                                                                                                                          |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能更改有关在同一轮次中调用多个工具的指令。                                                                                                                                            |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令以及所请求的架构。                                                                                                                                                    |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 可能更改模型端的推理指令。在支持的模型上，使用 [配置更新](#change-reasoning-effort-without-rewriting-the-prefix) 来更改推理力度，同时保留此前的前缀。 |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能更改有关响应详细程度的指令。                                                                                                                                                               |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 使用压缩后的上下文替换先前的对话内容，这可能会阻止从首次更改的 token 起进行复用。                                                                                   |





## 缓存工作原理

一个 **缓存断点** 标记了提示前缀的结尾，OpenAI 可以将其保存到缓存中，以便在后续请求中复用。第一次请求会将符合条件的前缀写入缓存，后续请求则会从可用的缓存前缀中寻找最长匹配项，依次从后向前遍历各个符合条件的断点，直到找到匹配项为止。

提示前缀必须满足模型的 **最小可缓存 token 长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入该最小值。最小可缓存提示长度在 GPT-5.6 及更高版本中为 1,024 个 token，在更早的模型中则因请求设置不同而有所差异。请参阅 [模型对比](#summary-of-model-differences) 了解详情。

在满足最小可缓存 token 长度之后，你可以选择显式地放置缓存断点，也可以让 OpenAI 隐式地选择断点位置。可用选项取决于具体的模型。



<a id="how-caching-works-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入的费用是标准、未缓存输入令牌费率的 1.25×。当你确定某个前缀会被复用时，值得承担这笔费用，因为后续读取只需该费率的 0.1×。写入一次前缀并完整复用一次的成本是其普通输入成本的 1.35×，而在不缓存的情况下处理两次则为 2×。节省的费用会随着每次额外的缓存读取而增加：在十次请求中，一次写入和九次完整读取的成本为 2.15×，而在不缓存的情况下则为 10×。

支持隐式和显式两种缓存方式，其中显式缓存可让你更精细地控制写入缓存的上下文。

**显式模式：** 你可以根据上下文管理需要，自行选择缓存断点的放置位置。

- 将 prompt_cache_key 设置 `prompt_cache_options.mode` 为 `explicit` 以仅使用开发者选择的断点，并通过将 `prompt_cache_breakpoint: { "mode": "explicit" }` 添加到输入消息内受支持的内容块来标记每个所需的断点。
- 当未放置任何显式断点时，请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式可让你选择缓存写入的结束位置。最后一个所选断点之后的内容按未缓存的输入 token 费率处理，不收取缓存写入费用，因此你可以避免写入不太可能被复用的可变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每次请求最多可创建四次缓存写入。
- `additional_tools` 输入项当前不接受 `prompt_cache_breakpoint`.

顶级 `instructions` 不能包含显式断点。若要标记可复用的开发者说明，请将它们放在 `input_text` 中，作为开发者消息内的一个代码块。

**隐式模式：** OpenAI 开箱即用地选择断点位置，适用于大多数场景。

- 当 `prompt_cache_options.mode` 时 `implicit`, OpenAI 会在最新的 eligible 消息末尾放置一个断点。Eligible 消息包括：
  - 用户消息
  - 连续一组工具响应中的最后一个工具响应
  - 初始连续一组开发者消息中的最后一个开发者消息。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽中的一个，从而剩余三个可用的显式缓存写入槽。







<a id="how-caching-works-earlier-models"></a>



### 早期模型



仅支持隐式缓存。OpenAI 会按模型相关 [的间隔](#summary-of-model-differences)，设置隐式断点，从隐藏的 OpenAI 系统消息开头开始计数。只有位于或超过最小可缓存长度（从隐藏上下文的末尾开始计数）的断点才有效。

报告的 `cached_tokens` 缓存命中 token 数通过从最后一个匹配的断点减去隐藏的系统 token 计算得出，然后再向下取整到最接近的 128 的倍数。





### 前缀匹配的原理

OpenAI 仅按从最长前缀到最短前缀的顺序，检查传入请求中的以下 **缓存查找边界** （见下文说明），以查找本机上已缓存的可用匹配前缀。

对于 GPT-5.6 及更高版本，传入请求中的缓存查找边界为：

- **仅显式模式：** 前 2 个以及最近 50 个显式断点。
- **隐式模式：** 前 2 个以及最近 50 个显式断点、隐式断点、最多 20 个更早的符合条件的消息结尾，以及初始连续开发者消息块末端。这让隐式模式可以复用此前缀，该前缀在没有显式断点的情况下止于更早的一条消息。

## 缓存生命周期

缓存条目不会被无限期存储。只有在其条目仍然可用时，后续请求才能复用缓存前缀，并且复用该前缀会刷新其生命周期，不会再产生一次缓存写入费用。生命周期和保留设置 [取决于所使用的模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



<a id="cache-lifetime-gpt-5-6-and-later"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 来控制最短缓存生命周期。唯一支持的值， `30m`，也是默认值。缓存前缀在其最近一次写入或复用后 30 分钟内保持可复用状态，但 OpenAI 可能保留更长时间。





<a id="extended-prompt-cache-retention"></a>



<a id="cache-lifetime-earlier-models"></a>



### 早期模型



使用 `prompt_cache_retention`，其支持的值取决于所使用的模型：

- `in_memory`: 条目通常在 5 到 10 分钟不活动后失效，最长不超过一小时。
- `24h`: 扩展保留通常使条目可用约 30 分钟，并可保留最长 24 小时。

**保留期限默认值与零数据保留**

Prompt caching 可能会将加密后的 key/value 张量作为应用状态存储在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，默认行为取决于你所在组织的数据保留策略：

- 组织 _未启用_ 默认采用零数据保留的组织 `24h`.
- 组织 _启用_ 默认采用零数据保留的组织 `in_memory`.

在选择保留期值之前，请先确认你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态保存在各台机器上，当流量超过每分钟 15 次请求时可能导致溢出路由。一个请求只有抵达一台持有匹配条目且该条目尚未过期的机器时，才能复用对应的缓存前缀。因此，将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在组织之间共享，也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，针对给定模型的路由取决于以下因素：

- 当前机器负载与可用容量。
- 隐藏 OpenAI 内容之后初始 token 的哈希值，如果存在工具定义，也会一并包含。被哈希的 token 数量因模型而异。
- 可选提供的 [`prompt_cache_key`](#prompt-cache-keys) ，用于在高流量期间控制请求的分组与分发，以降低请求溢出到其他机器从而导致缓存未命中的情况。



<a id="prompt-cache-keys"></a>



### Prompt cache keys



当流量超过单台机器的可用容量时，请求可能会溢出到其他机器。如果该机器没有匹配的缓存条目，则这次初始的溢出请求会产生一次缓存未命中。

设置 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 有助于让具有相同前缀的请求命中同一缓存。键会影响路由，但它们既不会将请求固定到某台机器，也无法保证缓存一定命中。详见 [如何调优提示缓存键](#tune-prompt-cache-keys).





<a id="model-differences-at-a-glance"></a>

## 模型差异摘要

| 行为                   | GPT-5.6 及更高版本                                   | GPT-5.5 和 GPT-5.5 Pro                                     | 其他更早的模型                                                            |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 隐式断点       | 在最近一条符合条件的消息末尾。          | 以固定的 2,048 token 间隔分布。                    | 以模型决定的固定间隔分布。                                   |
| 显式断点       | 支持                                           | 不支持                                               | 不支持                                                                   |
| 可缓存前缀的最小长度   | 1,024 个可见输入 token                          | 因请求设置而异                                  | 因请求设置而异                                                      |
| 已缓存 token 报告     | 精确的可见输入 token 边界（不含隐藏 token）    | 不含隐藏 token，并向下取整到 128 的整数倍 | 不含隐藏 token，并向下取整到 128 的整数倍                     |
| 缓存读取费用          | 未缓存输入 token 单价的 0.1 倍                  | 因模型而异的已缓存输入单价                           | 因模型而异的已缓存输入单价                                               |
| 缓存写入费用         | 为未缓存输入 token 费率的 1.25 倍                 | 无额外缓存写入费用                            | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                          | `prompt_cache_retention`                                    | `prompt_cache_retention`                                                        |
| 支持的保留值 | `"30m"`                                             | `"24h"` 仅                                                | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 最后一次写入或复用后至少 30 分钟 | 通常约 30 分钟，最长可达 24 小时                 | 通常在以下情况下无活动 5 到 10 分钟 `in_memory`，或最长可达 24 小时 `24h` |

<a id="extended-retention-models"></a>




\* 延长保留支持由 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




对于 GPT-5.6 之前的模型，最小可缓存输入长度因请求设置而异，包括工具、图像、输出模式、推理努力程度和详细程度。

<a id="best-practices"></a>

## 如何优化提示缓存

聚焦于 [保留对话历史](#preserve-conversation-history), [保持工具定义的稳定](#manage-tools-with-append-only-updates),并理解三种主要的缓存控制。使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来选择缓存发生的位置,并 [`prompt_cache_key`](#tune-prompt-cache-keys) 帮助相关请求命中同一缓存。



Ask ChatGPT to optimize my prompt caching





<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史比仅缓存初始指令能节省更多输入 token。保留早期的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考材料放在最前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将它们放在末尾而不是开头，或者移到后续的对话消息中。
- **保留对话历史。** 追加新消息而不是重写之前的轮次。摘要、 [compaction](#compaction-can-reduce-cache-reuse)，或上下文截断可能会改变前缀并重置缓存复用。
- **在不改写前缀的情况下更改推理力度。** 在 GPT-6 Astra 上，追加一个 `configuration_update` 输入项可以在不同响应之间更改推理力度，同时保持请求级别的 `reasoning.effort` 不变。这样可以保留原始前缀以供缓存复用。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 以了解示例和兼容性限制。

在断点之后持续更改内容

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



### 在不改写前缀的情况下更改推理努力程度



在受支持的 GPT-6 及更高版本模型上，可以追加一个 `configuration_update` 输入项到 [在对话过程中更改推理投入度](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) ，同时保留先前缓存的前缀。请将顶层 `reasoning.effort` 保持为其原始值，更改该设置可能会重写隐藏系统指令中的指令。

最新的配置更新会控制后续响应的推理投入度。例如，将以下项追加到现有的 `input` 数组中以切换至 `high` 用于后续请求的推理：

要追加到输入数组的项

```json
{
  "type": "configuration_update",
  "reasoning": { "effort": "high" }
}
```








<a id="manage-tools-with-append-only-updates"></a>



### 以仅追加更新的方式管理工具



当应用所需的工具因请求而异时，可以在保持工具定义稳定的前提下调整可调用的工具，以保留可复用的前缀。

- **保持工具一致。** 保留工具定义、顺序和 schema。
- **为单个请求禁用工具调用。** 将 prompt_cache_key 设置 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可被调用，同时保持所提供的 `tools` 列表稳定。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 启用 `defer_loading: true` 以减少多轮线程早期请求中花费在工具定义上的输入 token。被发现的工具会追加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用开发者角色的 [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你应用的逻辑，在线程中按需添加工具。







<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控件可决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式缓存或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你所选择的边界。

- **自动放置断点。** 使用隐式缓存在最新的符合条件消息末尾放置断点。这对于向现有上下文追加内容的多轮对话线程非常方便。
- **慎重选择断点。** 在稳定内容末尾放置显式标记。使用仅显式模式，以避免对不断变化的后缀进行不必要的缓存写入。



> 图示：在仅显式模式下，工具和 schema 位于稳定的开发者消息前缀和断点 1 之前。一条分支在断点 2 之前追加可变的开发者消息后缀和更多对话轮次，然后拆分为新的用户输入。另一条分支包含一个未被选中的可变后缀。每个分支最后一个所选断点之后的内容按未缓存输入费率计费，且不计缓存写入费用。









<a id="tune-prompt-cache-keys"></a>



### 调整提示缓存键



- **对相关请求进行分组。** 将提示版本与稳定的用户、工作区、会话或线程 ID 相结合，匹配你应用复用上下文的方式。例如：
  - `prompt_name_v1:user_123` 对共享一个提示版本的同一用户的相关请求进行分组。
  - `prompt_name_v1:session_456` 对同一会话内的请求进行分组。
  - `prompt_name_v1:workspace_acme:shard_3` 对工作区内一个稳定分片内的请求进行分组。
- **保持键的稳定性。** 只要键的前缀仍然有用，就复用它；不要为每个请求都生成新键。
- **拆分高负载分组。** 如果某个分组流量很高且缓存读取命中率下降，可使用稳定且确定的映射将其分布到更多键上。将相关请求保留在同一分片内，以便复用其缓存。

创建稳定的缓存键

```javascript
import { createHash } from "node:crypto";

const tenantId = "acme";
const sessionId = "session-42";
const promptVersion = "support-v3";
// Tune for peak traffic per tenant and reusable prompt group; monitor cache hits.
const shardCount = 16;

const digest = createHash("sha256")
  .update(`${tenantId}:${sessionId}`)
  .digest("hex");
const shard = Number.parseInt(digest.slice(0, 8), 16) % shardCount;
const promptCacheKey = `${promptVersion}:${tenantId}:shard-${shard}`;
```

```python
import hashlib

tenant_id = "acme"
session_id = "session-42"
prompt_version = "support-v3"
# Tune for peak traffic per tenant and reusable prompt group; monitor cache hits.
shard_count = 16

digest = hashlib.sha256(f"{tenant_id}:{session_id}".encode()).hexdigest()
shard = int(digest[:8], 16) % shard_count
prompt_cache_key = f"{prompt_version}:{tenant_id}:shard-{shard}"
```

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

String tenantId = "acme";
String sessionId = "session-42";
String promptVersion = "support-v3";
int shardCount = 16;

String digest =
    HexFormat.of()
        .formatHex(
            MessageDigest.getInstance("SHA-256")
                .digest((tenantId + ":" + sessionId).getBytes(StandardCharsets.UTF_8)));
long shard = Long.parseLong(digest.substring(0, 8), 16) % shardCount;
String promptCacheKey = promptVersion + ":" + tenantId + ":shard-" + shard;
```

```ruby
require "digest"

tenant_id = "acme"
session_id = "session-42"
prompt_version = "support-v3"
# Tune for peak traffic per tenant and reusable prompt group; monitor cache hits.
shard_count = 16

digest = Digest::SHA256.hexdigest("#{tenant_id}:#{session_id}")
shard = digest.slice(0, 8).to_s.to_i(16) % shard_count
prompt_cache_key = "#{prompt_version}:#{tenant_id}:shard-#{shard}"
```






<a id="choose-a-cache-lifetime"></a>



<a id="configure-cache-retention"></a>



### 配置缓存保留



对于更早的模型，请优先设置 `prompt_cache_retention` 为 `"24h"` ，以便在模型和你的数据保留要求允许时获得更长的保留时间。详见 [缓存生命周期](#cache-lifetime) 中关于受支持设置和默认值的内容。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



<a id="escape-the-minimum-cacheable-length-cost-trap"></a>



### 避开最小可缓存长度成本的陷阱



如果许多请求复用了相同的开发者指令和工具定义，但该共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences)，可以考虑缩短该前缀，或使用有用且稳定的指令、示例或参考材料对其进行扩展。衡量缓存复用能否抵消额外的输入 token 和任何缓存写入费用，并确保评估和行为保持稳定。

该图表突出了最小可缓存长度成本陷阱：较短的前缀长度在未缓存情况下可能比扩展到最小可缓存 token 长度的成本更高。

<a id="mathematical-details"></a>



#### 数学细节



仅从成本角度比较，设 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总次数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，且在后续每次请求中都被完全复用。以未缓存输入 token 当量计，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时应进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀成本更低。相等时两者成本相同。使扩展更便宜的最小整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短到 $$M$$ 以下会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token。不存在通用的最大成本提示长度；交叉点取决于复用情况和定价。

例如，当 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$ 时，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求中，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更为划算。随着复用的增加，交叉点趋近于 102.4 个 token。103 个 token 的前缀至少需要 1,963 次请求才能获益；在这些假设下，102 个或更少 token 的前缀则永远不会获益。该比较未考虑性能、输出 token 以及未变化的请求成本。额外的未命中、写入或不同的模型费率都会改变结论。











<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 追踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，包括输入 token 数、延迟和实际成本。通过将总缓存 token 数除以总输入 token 数来追踪 token 缓存命中率，并按用户、工作区、日期或其他有用的维度对这两个计数进行聚合。
- **计算输入成本。** 使用 `response.usage` 中的 token 数以及模型的 [每百万 token 价格](https://developers.openai.com/api/docs/pricing).
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

  weighted_input_tokens =
    ordinary_input_tokens +
    (cached_tokens * cache_input_multiplier) +
    (cache_write_tokens * cache_write_multiplier)
  (weighted_input_tokens * input_price_per_million) / 1_000_000
end
```








<a id="migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later"></a>



### 将提示缓存从早期模型迁移到 GPT-5.6 及更高版本



- 保留现有稳定的前缀。
- 保留现有 `prompt_cache_key` 值。
- 替换 `prompt_cache_retention` 启用 `prompt_cache_options.ttl`.
- 确认可复用的前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 当后续内容不值得写入时。
- [比较 `cached_tokens`, `cache_write_tokens`、延迟和总成本](#monitor-cache-performance) 迁移前后。





## 示例



<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 评分



考虑使用一个单轮 LLM 评判器，用于判断一次已完成的交互是否体现出用户在与聊天机器人互动后感到满意。每个请求都使用相同的评分标准（rubric）和带标签的少样本示例，来评估一次不同的交互。

- **保留此前缀：** 固定评分标准与示例放在最前面。它们的合并长度刻意保持在略高于模型 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准评判者的材料。被评估的交互放在最后。
- **提示缓存键：** 一个稳定的 `prompt_cache_key`，例如 `satisfaction_judge_v1`，使用相同评分标准版本对请求进行分组。
- **缓存模式与断点：** 已启用显式缓存（explicit-only caching），并在固定评分标准与示例之后设置断点。被评估的用户–聊天机器人对话位于该断点之后，不会写入缓存，从而避免对不太可能被复用的内容产生缓存写入费用。

采用这些原则的一次示例部署报告显示 **token 缓存命中率约为 70%**。该数据展示了一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用情况。

用于单轮裁判的 Responses API 请求

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_key": "satisfaction_judge_v1",
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



考虑一个多轮的 智能体，它拥有冗长且共享的开发者指令，并频繁调用工具。在典型使用场景中，用户常常会同时运行多个 智能体 会话，并且经常分叉这些线程。

- **保留前缀**: 每一轮都会追加新消息、工具调用和结果，而不会重写先前的上下文，因此可复用的前缀会随时间增长。
- **提示缓存键：** 该 `prompt_cache_key` 是为每个用户-智能体对定义的，并在该用户与 智能体 的会话之间共享。例如， `agent_123_v1:user_456` 会将用户 456 的会话和分支与 智能体 123 归为一组。当这些会话应当共享同一个可复用前缀时，会话 ID 和线程 ID 会排除在键之外。
- **隐式缓存模式：** 启用隐式缓存，以便最近的符合条件的用户或工具消息提供一个断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前可复用的前缀并提升分支的缓存效率。

采用这些原则的一次示例部署报告显示 **token cache-hit rate >90%**。该数据展示了一种可能的结果。实际的缓存命中率上限取决于你的上下文和应用使用情况。

Responses API request for a multi-turn 智能体

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



### 共享前缀并不总是缓存前缀



This is particularly prevalent when [从早期模型迁移到 GPT-5.6 或更高版本时](#migrate-prompt-caching-from-an-earlier-model-to-gpt-5-6-and-later) 由于隐式缓存行为的变化，这种情况尤其常见。如果请求共享一个长前缀但后缀不同，仅隐式缓存第一个完整请求并不会让较短的共享前缀可复用。

考虑在每个请求中使用固定的开发者消息后接动态用户消息。该请求会直接写入动态内容。在下一次请求中更改该内容不会匹配到更长的已缓存前缀，并且静态内容之后也没有单独的断点。

在没有静态内容断点的情况下

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_key": "prompt_name_v1",
  "prompt_cache_options": { "mode": "implicit" },
  "input": [
    { "role": "developer", "content": "Static content..." },
    { "role": "user", "content": "Dynamic content..." }
  ]
}
```


若要修复，请在两个请求的静态内容之后放置一个显式断点。第一个请求会写入可复用的前缀；即使动态内容发生变化，下一个请求也可以复用它。本示例使用仅显式模式，以避免将动态内容写入缓存。

在静态内容之后带有断点的情况下

```json
{
  "model": "gpt-5.6-sol",
  "reasoning": { "effort": "medium", "context": "all_turns" },
  "text": { "verbosity": "low" },
  "prompt_cache_key": "prompt_name_v1",
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



假设请求 1 使用隐式模式，并通过某个用户消息的末尾缓存了一个前缀，那么后续的请求 2 保留该前缀但切换为 `prompt_cache_options.mode: "explicit"`。如 [前缀匹配的工作原理](#how-prefix-matching-works)，中所述，请求 2 仅检查其自身输入中的显式断点，因此它不会复用请求 1 中保存的该隐式前缀（除非请求 2 中的某个显式断点与请求 1 中缓存的端点匹配）。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message] ▼

- Request 2: explicit-only mode. Does not hit cache.
  [Developer message][User message][Follow-up] ▼
```

要复用请求 1 的隐式前缀，请在请求 2 中匹配的内容块边界处放置一个显式断点，或者保持启用隐式模式，以便先前符合条件的消息结尾仍可作为查找候选项。







<a id="extending-a-message-can-prevent-reuse-of-its-cached-prefix"></a>



### 扩展消息可能会阻止其缓存前缀被复用



即使两个请求都使用隐式模式，仅保留相同的初始 token 也不一定足够。假设请求 1 以一条包含以下内容的用户消息结尾 `Content A`，然后后续的请求 2 将同一条消息扩展为 `Content A + Content B`。原来的端点在此之后 `Content A` 现在位于一条消息内部，而不是其末尾。正如在 [前缀匹配的工作原理](#how-prefix-matching-works)，中所解释的，如果没有在该边界处设置显式断点，请求 2 不会复用那里保存的前缀。

```text
▼ = breakpoint

- Request 1: implicit mode
  [Developer message][User message: Content A] ▼

- Request 2: implicit mode. Cannot reuse the prefix through Content A.
  [Developer message][User message: Content A + Content B] ▼
```

在对话结构允许的情况下，保留原始消息并改为追加一条新消息。否则，将可复用的文本放在单独的内容块中，并在两个请求中紧随其后放置一个显式断点。







<a id="not-all-developer-messages-are-automatic-implicit-mode-cache-lookup-boundaries"></a>



### 并非所有开发者消息都是自动隐式模式的缓存查找边界



在隐式模式下，初始连续开发者消息块之后的开发者消息不会作为自动缓存查找边界。在可复用的开发者消息末尾添加显式断点，以在后续请求中保留该断点，这样 OpenAI 就能检查是否存在匹配的前缀缓存。







<a id="minimum-cacheable-length-varies-by-model"></a>



### 可缓存的最小长度因模型而异



在一个模型上符合缓存条件的前缀，在另一个模型上可能太短。请查看 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用前缀。更换模型时，请重新执行该检查，而不是假设先前模型的阈值仍然适用。







<a id="compaction-can-reduce-cache-reuse"></a>



### 压缩可以减少缓存复用



[压缩](https://developers.openai.com/api/docs/guides/compaction) 会将较早的对话上下文替换为更短的表示。这可能改变前缀，因此压缩之后的第一次请求即便在逻辑上是同一段对话，复用到的先前缓存也可能会更少。

在可能的情况下保持可复用的指令和参考资料稳定，再让后续轮次在已压缩的上下文上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 减少仍然可以节省费用。





## 常见问题



<a id="does-prompt-caching-affect-output-generation"></a>



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会使用缓存的前缀生成新的响应，因此相同的请求并不保证产生相同的输出。







<a id="can-i-manually-clear-the-cache"></a>



### 我可以手动清除缓存吗？



不支持。当前暂未提供手动清除缓存的功能。缓存条目会根据模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







<a id="do-cached-prompts-count-toward-rate-limits"></a>



### 缓存的提示是否计入速率限制？



是的。缓存的输入令牌仍计入每分钟令牌数限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 已经计算完成。