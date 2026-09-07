# Prompt caching

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

## 为什么提示缓存很重要

提示缓存会在多个请求共享相同提示前缀时复用已完成的工作。这带来三个主要好处：

- **计算高效：** 避免重复计算模型已处理过的提示前缀。
- **输入 tokens 更便宜：** 对复用的 tokens 按模型降低后的缓存输入费率计费，最高可享 90% 折扣。
- **更快：** 减少响应开始前处理输入所花费的时间。

Prompt caching 默认对支持的 OpenAI 模型启用。请使用 [Prompt Caching Dashboard](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控缓存读取命中率。

## 什么是提示缓存？

模型在处理输入 token 时会计算中间的键值（KV）状态。这些状态让模型在处理新输入并生成响应时，能够回溯先前的 token。

提示缓存会将这些状态保留下来，以便复用到前缀中。当后续请求拥有相同的前缀并命中缓存条目时，模型就可以复用已保存的状态，而无需再次处理这些 token。但模型仍需要处理任何新的输入，才能生成新的响应。

提示缓存存储的是键值（KV）张量，而不是 token 本身。



向 ChatGPT 寻求更深入的讲解



OpenAI 会缓存模型完整的渲染后上下文，其中包含 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

要复用缓存，完整的渲染后前缀必须完全匹配。如果在断点之前内容或相关设置发生了变化，那么该变化之后的前缀就无法命中已有的缓存条目。

### 哪些设置会影响缓存的前缀？



更改请求并不一定会丢弃现有的缓存条目。关键在于后续请求是否具有相同的前缀，并能找到符合条件的匹配断点。需要检查的主要设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可以使用不同的权重和缓存行为。                                                                                  |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或工具特定的指令。                                                                |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 可能会更改关于在单轮中调用多个工具的指令。                                                                                  |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令和所请求的架构。                                                                                          |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 请求级别的更改可能会改变推理指令。请参阅 [configuration updates](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation). |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 可能会更改关于响应详细程度的指令。                                                                                                     |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([Compaction](https://developers.openai.com/api/docs/guides/compaction)) | 将较早的对话内容替换为压缩后的上下文，这可能导致从第一个被更改的 token 之后无法复用。                         |





## 缓存的工作原理

一个 **缓存断点** 标记了 OpenAI 可以保存到缓存并在后续请求中复用的提示前缀的结束位置。第一个请求会将符合条件的提示前缀写入缓存，后续请求会在符合条件的断点中从后向前查找最长匹配的可用缓存前缀，直到找到匹配项。

提示前缀必须达到模型的 **最低可缓存 token 长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最低长度。GPT-5.6 及之后模型的最低可缓存提示长度为 1,024 个 token，比 GPT-5.6 更早的模型则为 2,048 个 token。对于某些早期模型，你偶尔也可能获得低于 2,048 个 token 的缓存命中。更多信息请参阅 [模型对比](#summary-of-model-differences) 了解其他差异。

在满足最低可缓存 token 长度后，你可以显式选择缓存断点的位置，也可以让 OpenAI 隐式地选择位置。可用选项取决于具体模型。



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入的费用是标准、未缓存的输入 token 价格的 1.25 倍。当某个前缀会被复用时，支付这笔费用是值得的，因为后续读取只需 0.1 倍该价格。写入一次前缀并完整复用一次的花费是其普通输入成本的 1.35 倍，相比之下，不使用缓存处理两次则需 2 倍。随着每次额外的缓存读取，节省的费用会持续增加：在十次请求中，一次写入加九次完整读取的总花费为 2.15 倍，而不使用缓存则为 10 倍。

系统同时支持隐式和显式缓存，其中显式缓存让你可以更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理策略，自行决定在何处放置缓存断点。

- 将 `prompt_cache_options.mode` 设置为 `explicit` ，以便仅使用开发者选定的断点，并通过将以下内容添加到输入消息中受支持的内容块来标记每个所需的断点 `prompt_cache_breakpoint: { "mode": "explicit" }` 。
- 当未放置任何显式断点时，请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式让你可以自行选择缓存写入的终止位置。最后一个选定断点之后的内容将按未缓存的输入 token 费率处理，且不产生缓存写入费用，因此你可以避免写入那些不太可能被复用的变动内容。
- 多个显式断点可以保留以不同速率变化的前缀。每次请求最多可创建四次缓存写入。
- 对于缓存读取，OpenAI 会考虑对话中最多最近的 50 个断点，并复用匹配到的最长缓存前缀。

顶层 `instructions` 不能包含显式断点。若要标记可复用的开发者指令，请将其放在 `input_text` 块内的开发者消息中。

**隐式模式：** OpenAI 开箱即用地选择适用于大多数用例的断点位置。

- 当 `prompt_cache_options.mode` 为 `implicit`，时，OpenAI 会在最新的符合条件消息的末尾设置一个断点。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽中的一个，从而保留三个可用的显式缓存写入槽。
- 隐式断点会通过最新的符合条件消息创建一个缓存写入。







### 早期的模型



仅支持隐式缓存。OpenAI 会在以下位置设置隐式断点 [模型相关的间隔处](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头开始计数。只有达到或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才有效。

已报告 `cached_tokens` 的计算方式是：从最后一个匹配的断点中减去隐藏的系统令牌，然后向下取整到最接近的 128 的倍数。





## 缓存生命周期

缓存条目不会永久存储。后续请求只能在条目仍然可用期间复用已缓存的前缀，并且复用该前缀会刷新其生命周期，不会再次产生缓存写入费用。生命周期和保留设置 [取决于所选模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 用于控制最小缓存生命周期。目前唯一支持的值， `30m`，也是默认值。缓存前缀在其最近一次写入或重用后 30 分钟内仍有资格被重用，尽管 OpenAI 可能会保留更长时间。





<a id="extended-prompt-cache-retention"></a>



### 早期的模型



使用 `prompt_cache_retention`，其支持的值取决于模型：

- `in_memory`: 条目通常在约 5 到 10 分钟的无活动后失效，最长可达一小时。
- `24h`: 延长保留通常使条目保持可用约 30 分钟，并可保留长达 24 小时。

**保留默认值与零数据保留**

提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。对于同时支持 `in_memory` 和 `24h`，的模型，默认值取决于你组织的数据保留策略：

- 组织 _未_ 启用 Zero Data Retention 时默认采用 `24h`.
- 组织 _使用_ 启用 Zero Data Retention 时默认采用 `in_memory`.

在选择值之前，请验证你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态存储在各台机器上,当流量超过每分钟 15 个请求时,可能导致溢出路由。请求只有到达持有未过期匹配条目的机器时,才能复用缓存前缀。因此,将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在组织之间共享,也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内,某个模型的路由取决于以下因素:

- 当前机器负载与可用容量。
- 在隐藏的 OpenAI 内容之后，初始 token 的哈希值，包含工具定义（如果存在）。被哈希的 token 数量因模型而异。
- 可选提供的 [`prompt_cache_key`](#prompt-cache-keys) 用于在高流量时段控制分组与分发，从而避免请求溢出到其他机器并因此导致缓存未命中。

<a id="prompt-cache-keys"></a>



### Prompt cache keys



当流量超过某台机器的可用容量时，请求可能会溢出到另一台机器。如果该机器没有匹配的缓存条目，则最初的溢出请求会产生一次缓存未命中。

设置 [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 以帮助具有相同前缀的请求访问同一缓存。密钥会影响路由；它们不会将请求固定到某台机器上，也不会保证缓存读取命中。请参阅 [如何优化提示缓存密钥](#prompt-cache-key-best-practices).





<a id="model-differences-at-a-glance"></a>

## 模型差异摘要

| 行为                   | GPT-5.6 及更高版本                                       | GPT-5.5 和 GPT-5.5 Pro                                            | 其他更早的模型                                                            |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最新的合格用户或工具消息末尾。 | 按规律的 2,048 token 间隔分布。                           | 按规律的、依赖模型的间隔分布。                                   |
| 显式断点       | 支持                                               | 不支持                                                      | 不支持                                                                   |
| 最小可缓存前缀   | 1,024 个可见输入 token                              | 2,048 个可见输入 token；部分模型可能缓存更短的前缀 | 2,048 个可见输入 token；部分模型可能缓存更短的前缀              |
| 缓存 token 报告     | 精确的合格边界，不包括隐藏 token        | 不包括隐藏 token，并向下取整到 128 的倍数        | 不包括隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取费用          | 未缓存输入 token 费率的 0.1 倍                      | 依赖模型的缓存输入费率                                  | 依赖模型的缓存输入费率                                               |
| 缓存写入费用         | 未缓存输入 token 价格的 1.25 倍                     | 无额外的缓存写入费用                                   | 无额外的缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                              | `prompt_cache_retention`                                           | `prompt_cache_retention`                                                        |
| 支持的保留时长值 | `"30m"`                                                 | `"24h"` 仅                                                       | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 最近一次写入或复用后至少 30 分钟     | 通常约 30 分钟，最长 24 小时                        | 通常闲置 5 到 10 分钟为 `in_memory`，或最长 24 小时为 `24h` |

<a id="extended-retention-models"></a>




\* 支持延长保留期的有 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




<a id="best-practices"></a>

## 如何优化提示缓存

重点在于 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#tools)，并理解三种主要的缓存控制。使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来选择缓存发生的位置，并使用 [`prompt_cache_key`](#prompt-cache-key-best-practices) 来帮助相关请求命中同一缓存。



Ask ChatGPT to optimize my prompt caching



<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史相比仅缓存初始指令可以节省更多输入 token。保留早期消息和工具结果，以便后续轮次能够复用完整的共享前缀。

- **保持前缀稳定。** 把稳定的开发者指令和共享参考材料放在最前面。如果开发者指令或共享材料中包含时间戳、用户特定内容或其他动态内容，请将它们放在末尾，而不是开头，或者移至后续的对话消息中。
- **保留对话历史。** 追加新消息而不是重写早期的对话轮次。摘要、压缩或上下文截断都可能改变前缀并重置缓存复用。
- **在不重写前缀的情况下更改推理努力程度。** 在 GPT-6 Astra 上，追加一个 `configuration_update` 输入项以在两次响应之间更改推理努力程度，同时保持请求级 `reasoning.effort` 不变。这会保留原始前缀以便复用缓存。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解相关示例和兼容性限制。

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






<a id="tools"></a>



### 以仅追加更新的方式管理工具



当你的应用在各个请求之间需要使用不同的工具时，可以更改可调用的工具，同时保持其定义稳定，以保留可复用的前缀。

- **保持工具一致。** 保留工具定义、顺序和结构。
- **在请求中禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设置为 `"none"` 而不是移除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可以被调用，同时保持提供的 `tools` 列表稳定。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 使用 `defer_loading: true` 以减少多轮对话早期请求中用于工具定义的输入 token。已发现的工具会追加到上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用开发者角色的 [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) 根据你的应用逻辑在对话中添加工具。





<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控制项用于确定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记一个由你选择的边界。

- **自动放置断点。** 使用隐式缓存在最新符合条件的消息末尾放置断点。这对于向现有上下文追加内容的多轮对话非常方便。
- **谨慎选择断点位置。** 在稳定内容的末尾放置显式标记。使用仅显式模式，以避免为不断变化的后缀执行不必要的缓存写入。



> 图示：在仅显式模式下，工具和模式位于稳定的开发者消息前缀和断点 1 之前。一个分支添加了一个可变的开发者后缀和更多对话轮次，然后到达断点 2，再拆分为新的用户输入。另一个分支具有一个未被选中的可变后缀。每个分支最后一个被选中断点之后的内容按未缓存输入费率计费，且不计缓存写入费用。







<a id="prompt-cache-key-best-practices"></a>



### 调整提示缓存键



- **对相关请求进行分组。** 将提示版本与稳定的用户、工作区、会话或线程 ID 组合起来，使其与你的应用复用上下文的方式相匹配。例如：
  - `prompt_name_v1:user_123` 对共享同一提示版本的同一用户相关请求进行分组。
  - `prompt_name_v1:session_456` 对同一会话内的请求进行分组。
  - `prompt_name_v1:workspace_acme:shard_3` 对工作区中一个稳定分片内的请求进行分组。
- **保持键的稳定性。** 在其前缀仍然有用期间复用该键；不要为每个请求都生成一个新键。
- **拆分繁忙的分组。** 如果某个分组流量很高且缓存读取命中数下降，请使用稳定且确定性的映射将其分散到更多的键上。将相关请求保持在同一分片内，以便它们能够复用其缓存。

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



### 配置缓存保留期限



对于较旧的模型，建议设置 `prompt_cache_retention` 为 `"24h"` 以延长保留时间，前提是模型和你的数据保留要求允许这样做。参见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



### 避开最小可缓存长度成本陷阱



如果许多请求复用了相同的开发者指令和工具定义，但该共享前缀低于模型的 [最小可缓存长度](#summary-of-model-differences),可以考虑将其缩短，或用有用且稳定的指令、示例或参考材料进行扩展。衡量缓存复用能否抵消额外的输入 token 和任何缓存写入费用，并确保评估结果和行为保持稳定。

该图表突出展示了最小可缓存长度带来的成本陷阱：当前缀较短时，其未缓存成本可能高于扩展到最小可缓存 token 长度时的成本。

#### 数学细节



仅从成本角度比较，令 $$M$$ 为最小可缓存长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取乘数，$$w$$ 为缓存写入乘数，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并在之后每个请求中完全复用。以未缓存输入 token 等价计算，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀成本更低。两者相等时成本相同。扩展更便宜的最短整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短至 $$M$$ 以下会失去缓存：在相同假设下，较短的未缓存前缀必须低于 $$L_{\mathrm{break\text{-}even}}$$，其成本才会低于缓存 $$M$$ 个 token。不存在普适的最大成本提示长度；临界点取决于复用率和定价。

例如，取 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$，临界点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求下，将至少 221 个 token 的原始前缀扩展到 1,024 个 token 更为划算。随着复用率上升，临界点趋近 102.4 个 token。103 个 token 的前缀至少需要 1,963 次请求才能获益；而在上述假设下，102 个或更少 token 的前缀永远不会获益。此比较未考虑性能、输出 token 以及不变的请求成本。额外的未命中、写入或不同的模型费率会改变结果。









<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际的缓存性能。** 追踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`,输入 token 数、延迟和实际成本。通过将总缓存 token 数除以总输入 token 数来计算 token 缓存命中率,并按用户、工作区、日或其他有用的分组汇总这两个计数。
- **计算输入成本。** 使用中的 token 数以及模型 `response.usage` 的每百万 token [价格](https://developers.openai.com/api/docs/pricing).
- **使用 Prompt Caching 仪表板。** 在中监控缓存命中率。 [Prompt Caching Dashboard](https://platform.openai.com/usage?usage_section=prompt-caching).

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








### 将提示缓存从早期模型迁移至 GPT-5.6 及更高版本



- 保留现有稳定的前缀。
- 保留现有 `prompt_cache_key` 取值。
- 替换 `prompt_cache_retention` 使用 `prompt_cache_options.ttl`.
- 确认可复用前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间会变化的内容，请在稳定前缀之后添加显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 当后续内容不值得写入时。
- 比较 `cached_tokens`, `cache_write_tokens`、延迟和迁移前后的总成本。





## 示例

<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 评审



考虑一个单轮 LLM 评判器，它用于判断一次已完成的交互中是否存在证据表明用户在与聊天机器人的交互后感到满意。每次请求都使用相同的评分标准和带标注的少样本示例来评估不同的交互。

- **保留前缀：** 固定的评分标准和示例放在最前面。它们合并后的长度被刻意控制在略高于模型的 [最小可缓存长度](#summary-of-model-differences),使用的内容有助于校准评判模型。被评估的交互放在最后。
- **提示缓存键：** 一个稳定的 `prompt_cache_key`,例如 `satisfaction_judge_v1`,将使用同一评分标准版本的请求归为一组。
- **缓存模式与断点：** 仅启用显式缓存,并在固定评分标准和示例之后设置一个断点。被评估的用户–聊天机器人对话位于该断点之后,不会被写入缓存,从而避免对不太可能被复用的内容收取缓存写入费用。

举例来说，采用这些原则的一次部署可能会实现 **约 70% 的 token 缓存命中率%**。这是一个假设的数字，并非实测的部署结果。实际的缓存命中率取决于你的上下文和应用使用情况。

用于单轮评判器的 Responses API 请求

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






<a id="customer-support-agent"></a>



### 多轮 智能体



设想一个多轮 智能体，它带有较长的共享开发者说明和频繁的工具调用。在典型使用中，用户会同时运行多个该 智能体 的会话，并经常对这些线程进行分叉。

- **保留前缀**：每一轮都会追加新消息、工具调用和结果，而不重写先前的上下文，因此可复用的前缀会随时间增长。
- **提示缓存键：** 该 `prompt_cache_key` 针对每个用户-智能体对定义，并在该用户与该 智能体 的各会话之间共享。例如， `agent_123_v1:user_456` 将用户 456 的会话以及与 智能体 123 的分支归为一组。当这些会话应共享同一可复用前缀时，会话 ID 和线程 ID 不计入该键。
- **隐式缓存模式：** 启用隐式缓存，以便由最近一条符合条件的用户消息或工具消息提供断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留先前的可复用前缀并提升分支时的缓存效率。

一个遵循这些原则的部署示例报告了 **token 缓存命中率 >90%**。该图示展示了一种可能的结果。实际的缓存命中率上限将取决于你自身的上下文和应用使用情况。

Responses API 针对多轮智能体的请求

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



### 共享前缀并不总是缓存前缀



在从早期模型迁移到 GPT-5.6 或更高版本时，这种现象尤为普遍，原因是隐式缓存行为发生了变化。如果多个请求共享一个长前缀但后缀不同，仅隐式缓存第一个完整请求并不能让较短的共享前缀可被复用。

设想在每个请求中都有一个静态开发者消息，后跟一个动态用户消息。该请求会透传写入这些动态内容。如果在下一个请求中修改这些动态内容，则不会匹配到更长的已缓存前缀，并且静态内容之后也没有单独的断点。

静态内容之后没有断点

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


若要修复，请在两个请求的静态内容之后放置一个显式断点。第一个请求会写入可复用的前缀；即使动态内容发生变化，下一个请求也可以复用它。本示例使用 explicit-only 模式，以避免将动态内容写入缓存。

静态内容之后带有断点

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








### 可缓存的最小长度因模型而异



在某个模型上符合缓存条件的前缀，在另一个模型上可能过短。请参阅 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来衡量可复用前缀。更换模型时，请重新执行该检查，而不是假设先前模型的阈值仍然适用。







### 压缩可以减少缓存复用



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会用更短的表示替换较早的对话上下文。这可能会改变前缀，因此压缩后的第一个请求即使在对话逻辑上保持不变，也可能减少对先前缓存的复用。

在可能的情况下保持可复用的指令和参考材料稳定，让后续轮次在压缩后的上下文基础上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入 token 的减少也仍可能节省费用。





## 常见问题



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会基于缓存的前缀生成新的响应，因此相同的请求并不一定会产生相同的输出。







### 我可以手动清除缓存吗？



否。当前不支持手动清除缓存。缓存条目会根据模型的 [缓存生命周期](#cache-lifetime) 和保留设置过期。







### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍然计入每分钟 token 数量限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 已计算完成。