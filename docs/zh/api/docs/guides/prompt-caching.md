# 提示缓存

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

## 为什么提示缓存很重要

提示缓存会在请求共享相同的前缀时复用之前的计算结果。这带来三个主要优势：

- **计算高效：** 避免重新计算模型已经处理过的前缀。
- **输入 token 更便宜：** 对复用的 token 适用模型的缓存输入折扣价，折扣最高可达 90%。
- **速度更快：** 减少响应开始前处理输入所花费的时间。

对于受支持的 OpenAI 模型，默认启用提示缓存。请使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控缓存读取命中率。

## 什么是提示缓存？

模型在处理输入 token 时，会计算中间的键值（KV）状态。这些状态让模型在处理新输入并生成响应时，能够回溯到先前的 token。

提示缓存会为可复用的前缀保留这些状态。当后续请求具有相同的前缀并命中匹配的缓存条目时，模型可以复用已保存的状态，而无需重新处理这些 token。它仍然需要处理任何新增的输入才能生成新的响应。

提示缓存存储的是键值（KV）张量，而不是 token 本身。



向 ChatGPT 寻求更深入的讲解



OpenAI 会缓存模型的完整渲染上下文，包括 OpenAI 提供的指令、 [开发者消息](https://developers.openai.com/api/docs/guides/prompt-engineering#message-roles-and-instruction-following), [工具定义](https://developers.openai.com/api/docs/guides/function-calling)，以及 [对话历史](https://developers.openai.com/api/docs/guides/conversation-state) 其中包含 [文本](https://developers.openai.com/api/docs/guides/text), [图像](https://developers.openai.com/api/docs/guides/images-vision), [文档](https://developers.openai.com/api/docs/guides/file-inputs)，以及支持的 [音频](https://developers.openai.com/api/docs/guides/audio).

缓存复用要求整个渲染前缀完全匹配。如果在断点之前内容或相关设置发生了更改，那么该断点之后的前缀就无法匹配现有的缓存条目。

### 哪些设置会影响缓存前缀？



修改请求并不一定会丢弃已有的缓存条目。关键在于后续请求是否具有相同的前缀，并且能否找到符合条件的匹配断点。主要需要检查的设置包括：

| 设置                                                                                                                                                                                                                                                                             | 影响                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [`model`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20model%20%3E%20%28schema%29)                                                                       | 不同的模型可以使用不同的权重和缓存行为。                                                          |
| [`tools`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20tools%20%3E%20%28schema%29)                                                                       | 更改工具名称、描述、架构、顺序或特定工具的指令。                                        |
| [`parallel_tool_calls`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20parallel_tool_calls%20%3E%20%28schema%29)                                           | 会更改有关在一轮中调用多个工具的指令。                                                          |
| [`text.format`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29) ([结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs))      | 添加输出格式指令以及所请求的架构。                                                                  |
| [`reasoning.effort`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20reasoning%20%3E%20%28schema%29)                                                        | 会更改模型端的推理指令。                                                                              |
| [`text.verbosity`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20text%20%3E%20%28schema%29)                                                               | 会更改关于响应详情的指令。                                                                             |
| [`context_management`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20context_management%20%3E%20%28schema%29) ([压缩](https://developers.openai.com/api/docs/guides/compaction)) | 用压缩后的上下文替换先前的对话内容，这可能导致从第一个被更改的 token 之后的部分无法复用。 |





## 缓存的工作原理

一个 **缓存断点** 标记提示前缀的结束位置，OpenAI 可以将其保存到缓存中并在后续请求中复用。第一次请求会将符合条件的前缀写入缓存，后续请求会查找可用的最长匹配缓存前缀，从符合条件的断点开始向前回溯，直到找到匹配项为止。

提示前缀必须达到模型的 **最小可缓存 token 长度** 才能被缓存。OpenAI 提供的隐藏系统内容中的 token 不计入此最小长度。GPT-5.6 及之后模型的最小可缓存提示长度为 1,024 个 token，早于 GPT-5.6 的模型则为 2,048 个 token。对于某些较早的模型，你偶尔可能会在 2,048 token 以下命中缓存。有关其他差异，请参阅 [模型对比](#summary-of-model-differences) 。

在满足最小可缓存 token 长度之后，你可以显式选择缓存断点的放置位置，也可以让 OpenAI 隐式选择其位置。可用选项取决于具体的模型。



### GPT-5.6 及更高版本



对于 GPT-5.6 及更高版本，缓存写入费用为标准、未缓存输入 token 价格的 1.25×。当一个前缀会被复用时，支付这笔费用是值得的，因为后续读取只需该价格的 0.1×。写入一次前缀并完整复用一次的成本是其普通输入成本的 1.35×，而不使用缓存处理两次则为 2×。每增加一次缓存读取，节省的费用都会增加：在十次请求中，一次写入加九次完整读取的成本为 2.15×，而不使用缓存则为 10×。

系统同时支持隐式缓存和显式缓存，其中显式缓存让你可以更精细地控制哪些上下文被写入缓存。

**显式模式：** 你可以根据上下文管理需求，自行选择放置缓存断点的位置。

- 将 `prompt_cache_options.mode` 设置为 `explicit` ，即可仅使用开发者选择的断点，并通过将 `prompt_cache_breakpoint: { "mode": "explicit" }` 添加到输入消息中的受支持内容块来标记每个所需的断点。
- 当未放置任何显式断点时，该请求不会使用提示缓存，也不会创建缓存写入。
- 仅显式模式允许你选择缓存写入的结束位置。最后一个所选断点之后的内容按未缓存的输入令牌费率处理，不产生缓存写入费用，因此你可以避免写入不太可能被重复使用的易变内容。
- 多个显式断点可以保留以不同速率变化的前缀。每次请求最多可以创建四次缓存写入。
- 对于缓存读取，OpenAI 会考虑对话中最多最近的 50 个断点，并复用匹配到的最长缓存前缀。

顶层 `instructions` 不能包含显式断点。若需标记可复用的开发者指令，请将其放在开发者消息中的 `input_text` 代码块中。

**隐式模式：** OpenAI 会自动选择开箱即用、适用于大多数用例的断点位置。

- 当 `prompt_cache_options.mode` 时 `implicit`，OpenAI 会把断点放在最近一条符合条件的消息末尾。
- 你可以在不关闭隐式断点的情况下添加显式断点；一个隐式断点会占用四个缓存写入槽中的一个，以保留三个可用的显式缓存写入槽。
- 隐式断点会通过最近一条符合条件的消息创建缓存写入。







### Earlier models



仅支持隐式缓存。OpenAI 在以下位置放置隐式断点 [与模型相关的间隔处](#summary-of-model-differences)，从隐藏的 OpenAI 系统消息开头开始计数。只有达到或超过最小可缓存长度（从隐藏上下文末尾开始计数）的断点才有资格被缓存。

Reported `cached_tokens` 是通过从最后一个匹配的断点减去隐藏的系统 token，然后向下取整到 128 的最接近倍数来计算的。





## 缓存生命周期

缓存条目不会永久存储。后续请求只能在条目仍可用的这段时间内复用其缓存前缀；复用前缀会刷新其生命周期，且不会再次产生缓存写入费用。生命周期与保留设置 [取决于所使用模型](#summary-of-model-differences).

<a id="prompt-cache-retention"></a>



### GPT-5.6 及更高版本



使用 `prompt_cache_options.ttl` 用于控制最短缓存生命周期。唯一支持的值， `30m`，也是默认值。已缓存的前缀在最近一次写入或重用后的 30 分钟内仍可被重用，但 OpenAI 可以保留更长时间。





<a id="extended-prompt-cache-retention"></a>



### Earlier models



使用 `prompt_cache_retention`，其支持的值取决于所使用的模型：

- `in_memory`: 条目通常在约 5 到 10 分钟不活动后失效，最长可达一小时。
- `24h`: 延长保留通常使条目可用约 30 分钟，并可保留长达 24 小时。

**保留期默认值与零数据保留**

提示缓存可能会将加密的键/值张量作为应用状态存储在 GPU 本地存储中。对于同时支持以下两项的模型 `in_memory` 并且 `24h`，默认值取决于你所在组织的数据保留策略：

- Organizations _without_ Zero Data Retention enabled default to `24h`.
- Organizations _with_ Zero Data Retention enabled default to `in_memory`.

在选择值之前，请先确认你的模型和组织可用的保留策略。





<a id="where-caching-happens-and-how-long-it-lasts"></a>

<a id="cache-location-and-duration"></a>

<a id="cache-location-and-lifetime"></a>

## 缓存位置

缓存状态保存在单台机器上，当流量超过每分钟 15 次请求时可能导致溢出路由。仅当请求抵达持有未过期匹配条目的机器时，才能复用其缓存前缀。因此，将请求路由到正确的机器对于缓存复用至关重要。

缓存不会在组织之间共享，也无法跨 [区域处理边界](https://developers.openai.com/api/docs/guides/your-data#data-residency-controls).

OpenAI 会自动处理路由。在同一组织和处理区域内，特定模型的路由取决于：

- 当前机器负载与可用容量。
- 在隐藏的 OpenAI 内容之后,对初始 token 计算得到的哈希值,包含工具定义(如果存在)。哈希的 token 数量因模型而异。
- 可选提供的 [`prompt_cache_key`](#prompt-cache-keys) 用于在高流量期间控制分组与分发,从而缓解请求溢出到其他机器并由此导致的缓存未命中。

<a id="prompt-cache-keys"></a>



### Prompt cache keys



当流量超过某台机器的可用容量时，请求可能会溢出到另一台机器。如果该机器没有匹配的缓存条目，那么这次最初的溢出请求将产生一次缓存未命中。

Set [`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20prompt_cache_key%20%3E%20%28schema%29) 以帮助具有相同前缀的请求命中同一缓存。键会影响路由，但它们不会将请求固定到某台机器，也无法保证缓存读取命中。详见 [如何调整 prompt 缓存键](#prompt-cache-key-best-practices).





<a id="model-differences-at-a-glance"></a>

## 模型差异概述

| 行为                   | GPT-5.6 及更高版本                                       | GPT-5.5 和 GPT-5.5 Pro                                            | 其他更早的模型                                                            |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 隐式断点       | 位于最近一条符合条件的用户消息或工具消息的末尾。 | 按固定的 2,048 token 间隔分布。                           | 按固定的、与模型相关的间隔分布。                                   |
| 显式断点       | 支持                                               | 不支持                                                      | 不支持                                                                   |
| 最小可缓存前缀   | 1,024 个可见输入 token                              | 2,048 个可见输入 token；某些模型可能缓存更短的前缀 | 2,048 个可见输入 token；某些模型可能缓存更短的前缀              |
| 缓存 token 报告     | 精确的符合条件边界，不包含隐藏 token        | 不包含隐藏 token，并向下取整到 128 的倍数        | 不包含隐藏 token，并向下取整到 128 的倍数                     |
| 缓存读取计费          | 未缓存输入 token 费率的 0.1×                      | 与模型相关的缓存输入费率                                  | 与模型相关的缓存输入费率                                               |
| 缓存写入费用         | 未缓存输入令牌费率的 1.25×                     | 无额外缓存写入费用                                   | 无额外缓存写入费用                                                |
| 缓存生命周期控制     | `prompt_cache_options.ttl`                              | `prompt_cache_retention`                                           | `prompt_cache_retention`                                                        |
| 支持的保留时长值 | `"30m"`                                                 | `"24h"` 仅                                                       | `"in_memory"` 或 `"24h"`<sup>[\*](#extended-retention-models)</sup>             |
| 缓存生命周期             | 自最近一次写入或复用起至少 30 分钟     | 通常约为 30 分钟，最长可达 24 小时                        | 通常闲置 5 到 10 分钟（针对 `in_memory`），或最长 24 小时（针对 `24h` |

<a id="extended-retention-models"></a>




\* 扩展保留功能由 `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4`, `gpt-5.2`, `gpt-5.1-codex-max`, `gpt-5.1`, `gpt-5.1-codex`, `gpt-5.1-codex-mini`, `gpt-5.1-chat-latest`, `gpt-5`, `gpt-5-codex`，以及 `gpt-4.1`.




<a id="best-practices"></a>

## 如何优化提示词缓存

重点关注 [保留对话历史](#preserve-conversation-history), [保持工具定义稳定](#tools)，并了解三种主要的缓存控制。使用 [`prompt_cache_options.mode` 和 `prompt_cache_breakpoint`](#choose-a-caching-mode) 来选择发生缓存的位置，并使用 [`prompt_cache_key`](#prompt-cache-key-best-practices) 来帮助相关请求访问同一缓存。



让 ChatGPT 优化我的提示词缓存



<a id="preserve-conversation-history"></a>



### 保留对话历史



在多轮应用中，复用不断增长的对话历史可以节省比仅缓存初始指令更多的输入 token。请保留早期的消息和工具结果，以便后续轮次可以复用完整的共享前缀。

- **保持前缀稳定。** 将稳定的开发者指令和共享参考资料放在前面。如果开发者指令或共享材料包含时间戳、特定于用户的内容或其他动态内容，请将它们放在末尾而不是开头，或移到后续对话消息中。
- **保留对话历史记录。** 追加新消息，而不是重写之前的对话轮次。摘要、压缩或上下文截断可能会改变前缀，并重置缓存复用。

Keep changing content after the breakpoint

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



### 通过仅追加更新管理工具



当应用所需的工具随请求变化时，可在保持工具定义不变的情况下更改可调用的工具，以保留可复用的前缀。

- **保持工具一致。** 保留工具定义、顺序和模式。
- **为某个请求禁用工具使用。** 将 [`tool_choice`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 设置为 `"none"` 而不是直接删除工具定义。
- **仅启用选定的工具。** 使用 [`allowed_tools`](https://developers.openai.com/api/docs/guides/function-calling#tool-choice) 来限制哪些工具可被调用，同时保持所提供 `tools` 列表的稳定性。
- **按需加载工具。** 使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) with `defer_loading: true` 以减少多轮对话早期请求里用于工具定义的输入 token。被发现的工具会追加在上下文末尾，从而保留先前可复用的内容。
- **保留工具加载历史。** 使用 developer 角色的 [`additional_tools` input item](https://developers.openai.com/api/docs/guides/tools-tool-search#add-tools-at-a-specific-point-in-the-input) ，根据你应用的逻辑在对话过程中动态添加工具。





<a id="choose-a-caching-mode"></a>



### 选择缓存模式



在 GPT-5.6 及更高版本中，有两个控件用于决定缓存断点的放置位置： `prompt_cache_options.mode` 选择隐式或仅显式缓存，以及 `prompt_cache_breakpoint` 标记你选择的边界。

- **自动放置断点。** 使用隐式缓存，在最近一条符合条件消息的末尾放置断点。这对于向现有上下文追加内容的多轮会话很方便。
- **有意识地选择断点。** 在稳定内容的末尾放置显式标记。使用仅显式模式，以避免为不断变化的后缀进行不必要的缓存写入。



> 示意图：在仅显式模式下，工具与 schema 位于稳定的开发者消息前缀和断点 1 之前。一个分支添加一个可变的开发者后缀和更多对话轮次，然后到达断点 2，之后再拆分为新的用户输入。另一个分支有一个未被选中的可变后缀。每个分支的最后一个选定断点之后的内容按未缓存输入费率计费，不产生缓存写入费用。







<a id="prompt-cache-key-best-practices"></a>



### 调整提示缓存键



- **对相关请求进行分组。** 将 prompt 版本与稳定的用户、工作区、会话或会话线 ID 组合使用，匹配你的应用复用上下文的方式。例如：
  - `prompt_name_v1:user_123` 将共享同一 prompt 版本的同一用户的相关请求分组。
  - `prompt_name_v1:session_456` 对单个会话内的请求进行分组。
  - `prompt_name_v1:workspace_acme:shard_3` 对工作区中一个稳定分片内的请求进行分组。
- **保持键的稳定性。** 只要前缀仍然有用就复用该键，不要为每个请求都生成新键。
- **拆分繁忙的分组。** 如果某个分组流量很高且缓存读取命中率下降，请使用稳定且确定性的映射将其分散到更多键上。将相关请求保留在同一分片中，以便它们能复用该分片的缓存。

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






<a id="choose-a-cache-lifetime"></a>



### 配置缓存保留



对于较早的模型，建议设置 `prompt_cache_retention` 为 `"24h"` ，以便在模型和你的数据保留要求允许时获得更长的保留时间。详见 [缓存生命周期](#cache-lifetime) 了解支持的设置和默认值。





<a id="a-shared-prefix-just-below-the-caching-minimum"></a>



### 避开最低可缓存长度成本的陷阱



如果许多请求复用了相同的开发者指令和工具定义，但该共享前缀未达到模型的 [最小可缓存长度](#summary-of-model-differences)，可以考虑缩短该前缀，或在其中补充有用的、稳定的指令、示例或参考材料。衡量缓存复用是否能抵消额外的输入 token 与任何缓存写入费用，并确保评估结果与行为保持稳定。

该图表凸显了最小可缓存长度带来的成本陷阱：较短的前缀长度所产生的未缓存成本，可能高于扩展到最小可缓存 token 长度所产生的成本。

#### 数学细节



仅从成本角度比较，设 $$M$$ 为可缓存的最小长度，$$L < M$$ 为原始前缀长度，$$r$$ 为缓存读取倍率，$$w$$ 为缓存写入倍率，$$N$$ 为请求总数。假设扩展后的前缀恰好为 $$M$$ 个 token，仅写入一次，并且在后续每次请求中都被完全复用。以未缓存输入 token 当量计，保留原始前缀的成本为 $$N \times L$$，而扩展前缀的成本为 $$M \left[w + (N - 1)r\right]$$。盈亏平衡的原始长度为：

$$
L_{\mathrm{break\text{-}even}} = M\left(r + \frac{w-r}{N}\right)
$$

当 $$L > L_{\mathrm{break\text{-}even}}$$ 时进行扩展；当 $$L < L_{\mathrm{break\text{-}even}}$$ 时，保留较短前缀的成本更低。相等时，两者成本相同。使得扩展更便宜的最小的整 token 长度为 $$\left\lfloor L_{\mathrm{break\text{-}even}} \right\rfloor + 1$$。反之，将可缓存前缀缩短到 $$M$$ 以下会失去缓存：在相同假设下，较短的未缓存前缀必须小于 $$L_{\mathrm{break\text{-}even}}$$，其成本才低于缓存 $$M$$ 个 token。不存在普适的最大成本提示长度，交叉点取决于复用情况和定价。

例如，当 $$M = 1{,}024$$、$$r = 0.1$$、$$w = 1.25$$ 时，交叉点为 $$102.4 + \frac{1{,}177.6}{N}$$ 个 token。在 10 次请求的场景下，将不少于 221 个 token 的原始前缀扩展到 1,024 个 token 更划算。随着复用次数增加，交叉点趋近 102.4 个 token。103 个 token 的前缀至少需要 1,963 次请求才能获益；在这些假设下，102 个或更少 token 的前缀永远不会获益。此比较未考虑性能、输出 token 以及未变化的请求成本。额外的未命中、写入或不同的模型费率都会改变这一结果。









<a id="monitor-cache-performance"></a>



### 监控缓存性能



- **衡量实际缓存性能。** 跟踪 `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`，包括输入令牌数量、延迟和实际成本。通过将总缓存令牌数除以总输入令牌数来计算令牌缓存命中率，并可按用户、工作区、日期或其他有用的分组汇总这两个计数。
- **计算输入成本。** 使用中的令牌计数 `response.usage` 以及模型的 [每百万令牌价格](https://developers.openai.com/api/docs/pricing).
- **使用提示缓存仪表板。** 在以下位置监控缓存命中率： [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching).

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








### 将提示缓存从早期模型迁移到 GPT-5.6 及更高版本



- 保留现有的稳定前缀。
- 保留现有的 `prompt_cache_key` 取值。
- 替换 `prompt_cache_retention` with `prompt_cache_options.ttl`.
- 确认可复用前缀满足模型的 [最小可缓存长度](#summary-of-model-differences).
- 如果默认断点包含在请求之间会变化的内容，请在稳定前缀之后添加一个显式断点。
- 使用 `prompt_cache_options.mode: "explicit"` 当后续内容不值得写入时。
- 比较 `cached_tokens`, `cache_write_tokens`,以及迁移前后的延迟和总成本。





## 示例

<a id="single-turn-llm-as-a-judge"></a>



### 单轮 LLM 作为裁判



考虑一个单轮 LLM 评判器，它用于判断一次已完成的交互是否表明用户在与聊天机器人的交互后感到满意。每次请求都使用相同的评分量表和带标注的少样本示例来评估不同的交互。

- **保留前缀：** 固定的评分标准和示例排在最前面。它们的合并长度被刻意保持在刚好高于模型的 [最小可缓存长度](#summary-of-model-differences)，使用有助于校准评分模型的内容。被评估的交互放在最后。
- **Prompt 缓存键：** 一个稳定的 `prompt_cache_key`,例如 `satisfaction_judge_v1`,将使用相同评分标准版本的请求归为一组。
- **缓存模式与断点：** 启用仅显式缓存,并在固定的评分标准和示例之后设置一个断点。被评估的用户与聊天机器人的对话位于该断点之后,不会写入缓存,从而避免对不太可能被复用的内容产生缓存写入费用。

举例来说，采用上述原则的部署可能可以达到 **约 70% 的 token 缓存命中率%**。这是一个假设数字，而非实测的部署结果。实际缓存命中率取决于你的上下文和应用使用方式。

Responses API 单轮评判请求

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



设想一个多轮 智能体，它具有冗长且共享的开发人员指令，并频繁调用工具。典型场景下，用户会同时运行多个会话，并经常分叉这些会话中的 智能体 线程。

- **保留前缀**：每一轮都会追加新的消息、工具调用和结果，而不重写较早的上下文，因此可复用的前缀会随时间不断增长。
- **Prompt 缓存键：** 该 `prompt_cache_key` 会针对每个用户-智能体对进行定义，并在该用户与智能体的所有会话之间共享。例如， `agent_123_v1:user_456` 会将用户 456 的会话以及与 智能体 123 的分叉归为一组。当这些会话应当共享同一个可复用前缀时，会话 ID 和 thread ID 不会包含在该键中。
- **隐式缓存模式：** 启用隐式缓存，以便由最近的符合条件的用户或工具消息提供一个断点。
- **显式断点：** 在每个工具结果之后添加一个断点，以保留较早的可复用前缀并提升分叉的缓存效率。

采用这些原则的一次示例部署报告了 **token 缓存命中率 >90%**。该数据展示了一种可能的结果。实际缓存命中率上限将取决于你自己的上下文和应用使用情况。

Responses API 请求，用于多轮 智能体

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



### 共享前缀并不总是缓存前缀



在从早期模型迁移到 GPT-5.6 或更高版本时，这种情况尤其常见，原因是隐式缓存行为发生了变化。如果多个请求共享一个较长的前缀但后缀不同，仅隐式缓存第一个完整请求并不能让较短的共享前缀被复用。

考虑在每个请求中，一个固定的开发者消息后面跟着一个动态的用户消息。该请求会直接写入动态内容。在下一次请求中修改该内容无法匹配更长的已缓存前缀，并且静态内容之后也不存在单独的断点。

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


要修复此问题，请在两个请求的静态内容之后放置一个显式断点。第一个请求写入可复用的前缀；即使动态内容发生变化，下一个请求也可以复用该前缀。本示例使用纯显式模式，避免将动态内容写入缓存。

在静态内容之后设置断点

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



在某个模型上满足缓存条件的前缀，在另一个模型上可能过短。请检查该 [模型对比](#summary-of-model-differences) 并使用你实际使用的模型和设置来测量可复用前缀。更换模型时，请重新执行该检查，不要假设之前模型的阈值仍然适用。







### 压缩可能会降低缓存复用率



[Compaction](https://developers.openai.com/api/docs/guides/compaction) 会使用更短的表示替换早期的对话上下文。这可能会改变前缀，因此即使对话在逻辑上相同，压缩后的第一个请求复用的前序缓存可能也会更少。

尽可能让可重复使用的指令和参考资料保持稳定，再让后续轮次在压缩后的上下文上继续构建。对比压缩前后的总输入成本：即使缓存命中率下降，输入令牌减少仍能节省费用。





## 常见问题



### 提示缓存会影响输出生成吗？



不会。提示缓存不会改变模型生成输出 token 的方式。模型会使用缓存的前缀生成新响应，因此相同的请求不保证产生相同的输出。







### 我可以手动清除缓存吗？



不，目前无法手动清除缓存。缓存条目的有效期取决于模型的 [缓存生命周期](#cache-lifetime) 和保留设置。







### 缓存的提示词是否计入速率限制？



是的。缓存的输入 token 仍会计入每分钟 token 数限制。提示缓存不会改变 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 计算得出。