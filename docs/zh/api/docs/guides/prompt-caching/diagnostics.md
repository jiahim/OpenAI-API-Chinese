# 提示缓存诊断

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

提示缓存诊断有助于解释为什么某个请求复用的 token 比预期更少。将请求与较早的响应进行对比，以找出模型、工具、设置或输入中妨碍复用的变化。

诊断信息适用于 GPT-5.6 及更高版本的受支持模型，可在 Responses API 中获取。使用它们来排查单个请求，并使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控整个应用中的缓存性能。

<a id="compare-with-an-earlier-response"></a>

## 工作原理

提示缓存诊断会把你当前的请求与一次较早的响应进行比较，帮助解释为什么某个预期的提示前缀没有被复用。前缀是提示开头的内容。复用要求前缀精确匹配，且请求设置兼容，包括模型、服务等级和工具。

1. **选择一个基线响应。** 使用同一组织最近的一次已完成响应，其前缀是你期望当前请求复用的内容，例如上一次对话轮次。
2. **请求比较。** 将 `prompt_cache_options.comparison_response_id` 设为基线响应的 `id`.
3. **读取结果。** 检查 `prompt_cache_diagnostics` 当前响应。如果诊断显示缓存未命中，结果中会包含原因以帮助你排查。使用 `usage.input_tokens_details.cached_tokens` 来衡量实际的缓存复用情况。

设置 `comparison_response_id` 仅请求诊断信息。它不会加载先前的对话，也不会改变缓存行为。当前请求仍然可以复用来自其他请求的匹配缓存条目。

### 使用示例

以下示例发送两个具有相同模型、指令和输入的请求，但将某个函数工具的名称从 `get_time` 改为 `get_date`。第二个请求将缓存复用情况与第一个请求进行比较。

在 `support-policy.txt`。中使用你自己的策略文档。可复用前缀必须满足模型的 [最小可缓存长度](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences),即 GPT-5.6 及更高版本为 1,024 tokens。

比较两次响应之间的提示缓存复用情况

```python
from pathlib import Path

from openai import OpenAI

client = OpenAI()
policy = Path("support-policy.txt").read_text()  # At least 1,024 tokens.

first = client.responses.create(
    model="gpt-6-astra",
    instructions=policy,
    input="Reply with exactly OK.",
    tools=[{"type": "function", "name": "get_time"}],
)

second = client.responses.create(
    model="gpt-6-astra",
    instructions=policy,
    input="Reply with exactly OK.",
    tools=[{"type": "function", "name": "get_date"}],
    prompt_cache_options={"comparison_response_id": first.id},
)

diagnostics = second.prompt_cache_diagnostics
if diagnostics is not None and diagnostics.type == "cache_miss":
    print(diagnostics.reason)
    print(diagnostics.comparison_reusable_tokens)
    print(diagnostics.cache_missed_tokens)
```


如果工具变更导致未命中,结果可能如下所示。Token 数量会随输入而变化。

```json
{
  "prompt_cache_diagnostics": {
    "type": "cache_miss",
    "reason": "tools_changed",
    "comparison_reusable_tokens": 5629,
    "cache_missed_tokens": 5629
  }
}
```

为了保持复用,请在请求之间保持工具定义和顺序不变。参见 [使用仅追加更新来管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).

### 多轮对话

若要比较连续的轮次，请保存每个已完成响应的 `id` ，并在下一个请求中将其作为 `comparison_response_id` 传入 `prompt_cache_options` 。在第一轮中省略比较 ID。

测试修复方案时，请将比较 ID 保持设置为基线响应。

### 流式传输

当 `stream=True`，请读取 `prompt_cache_diagnostics` 中的 `event.response` 字段，其 [`response.completed` event](https://developers.openai.com/api/reference/resources/responses/streaming-events#response.completed).

## 理解响应

阅读 `prompt_cache_diagnostics.type` 以确定比较结果。




| 类型                            | 含义                                                                                                                                                        | 处理建议                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `cache_hit`                     | 未检测到针对该比较的缓存未命中。                                                                                                                 | 检查 `usage.input_tokens_details.cached_tokens` 以衡量实际的复用情况。                         |
| `cache_miss`                    | 存在差异导致无法复用预期的前缀。结果包含 `reason` 和 `cache_missed_tokens`。还可能包含 `comparison_reusable_tokens`. | 在 [修复缓存未命中](#fix-a-cache-miss).                       |
| `comparison_response_not_found` | 该比较响应没有可用的诊断记录，可能是缺失或已过期。                                                            | 从同一组织中选择另一个近期已完成的响应。                              |
| `unavailable`                   | 比较无法得出明确结果，或该模型不支持诊断。                                                               | 确认模型是否支持，并尝试另一次近期比较。你仍然可以正常使用该响应。 |




### 解读 token 计数

一个 `cache_hit` 表示对比时未检测到缓存未命中。新输入仍可能需要处理。例如，一个包含 2,500 个输入 token 的请求可以报告 `cache_hit` 当它复用对比响应的 2,000 token 前缀并处理 500 个新 token 时。

对于 `cache_miss`:

- `comparison_reusable_tokens`,在。表示比较响应可复用前缀的原始 token 数。
- `cache_missed_tokens` 估计其中有多少 token 未被复用。

这些诊断计数可能与用量计数不同。请使用当前响应的 usage 字段来衡量报告的缓存复用和计费。

## 修复缓存未命中

使用 `prompt_cache_diagnostics.reason` 在以下表格中查找缓存未命中的原因和建议的修复方法。

某些更改（例如切换模型或压缩对话）是有意为之。即使这些更改会降低缓存复用率，你也可以选择保留它们。




| 原因                     | 变更内容                                                                                                                                        | 如何提升复用率                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model_changed`            | 请求由不同的模型处理，例如由于路由、A/B 测试或回退机制选择了另一个模型。                            | 检查模型选择以避免意外的切换。对于预期共享缓存前缀的请求使用同一个模型。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                 |
| `prompt_cache_key_changed` | 请求之间提供的 key 发生了变化。这可能会在没有实际缓存未命中的情况下报告为缓存未命中 `usage` ，而不发生实际的缓存未命中。                  | 省略 `prompt_cache_key` ，除非你的应用需要为不同客户或用户单独统计缓存。如果你使用了 key，请在每个组内保持 key 稳定。参见 [使用 key 进行单独的缓存统计](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).                                                                                                                                                 |
| `service_tier_changed`     | 处理该请求所用的服务层级发生了变化。                                                                                               | 对预期共享前缀的请求保持服务层级一致。检查返回的 `service_tier`，它可能与请求值不同。参见 [`service_tier`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20service_tier%20%3E%20%28schema%29) 以了解支持的值和行为。 |
| `tools_changed`            | 工具被添加、移除或重新排序，或者它们的描述、schema 或配置发生了变化。                                                  | 保持工具定义和顺序稳定。使用 `tool_choice: "none"` 来禁用工具，或者 `allowed_tools` 来限制哪些工具可以运行而不改变提供的工具列表。参见 [通过仅追加更新来管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).                                                                                                                      |
| `text_format_changed`      | 输出格式或其架构发生了更改。                                                                                                            | 保持 `text.format` 并保持架构一致，前提是所需的输出结构未发生变化。参见 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).                                                                                                                                                                                                                                                               |
| `reasoning_effort_changed` | 推理力度发生了变化。                                                                                                                       | 在受支持的 GPT-6 及更高模型上，追加一个 `configuration_update` 输入项以 [在对话过程中更改推理力度](https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses#change-reasoning-mid-conversation) 同时保留先前已缓存的前缀。<br />在较旧的模型上，请保持 `reasoning.effort` 在计划共享前缀的请求之间保持一致。                                                       |
| `verbosity_changed`        | 响应详细程度发生了变化。                                                                                                                     | 保持 `text.verbosity` 在计划共享前缀的请求之间保持一致。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                                                      |
| `context_compacted`        | 压缩替换了先前的对话内容。                                                                                                   | 保留稳定的指令，让后续轮次在压缩后的上下文上构建。对比总输入成本：即使缓存复用率较低，输入令牌更少仍可能节省费用。参见 [压缩](https://developers.openai.com/api/docs/guides/compaction).                                                                                                                                                                                               |
| `input_changed`            | 先前的输入发生了变化，例如指令中包含时间戳或请求 ID，或者之前的消息被编辑、重排或删除。 | 将变化的内容移到可重用前缀及其缓存断点之后。保留先前的消息和工具结果，并追加新的轮次。参见 [保留对话历史](https://developers.openai.com/api/docs/guides/prompt-caching#preserve-conversation-history).                                                                                                                                                                            |




## 确认改进效果

完成更改后：

1. 发送另一个代表性请求，并与预期的基线进行比较。
2. 检查诊断结果中是否仍有任何差异。
3. 比较 `cached_tokens`, `cache_write_tokens`,以及在多个请求中的总成本。

请参阅 [监控缓存性能](https://developers.openai.com/api/docs/guides/prompt-caching#monitor-cache-performance) 以获取使用指标与成本计算。

## 定价与速率限制

提示缓存诊断不产生额外费用，也不会单独计入速率限制。对 Responses API 的任何额外基线请求或重试请求都会正常计费，并计入速率限制。

## Zero Data Retention

提示缓存诊断与零数据保留兼容。OpenAI 不会为该功能存储原始提示或模型输出。诊断记录包含配置元数据、token 数估算值以及用于比较缓存敏感内容的哈希值。这些记录的作用域限定在组织内，会在短时间后失效，并且仅用于解释提示缓存命中或未命中的情况。

设置 `comparison_response_id` 不会检索或保留先前响应的内容。详见 [数据控制](https://developers.openai.com/api/docs/guides/your-data) ，了解 OpenAI 的数据控制方式。

## 限制

- 诊断功能在 GPT-5.6 及更高版本支持的模型的 Responses API 中提供。
- 诊断记录会在较短时间后过期。过期记录会返回 `comparison_response_not_found`，即使响应仍可通过 API 获取。
- 诊断会报告首个分类的原因。解决该原因后，重复对比以检查是否存在其他原因。
- 诊断功能是尽力而为的，可能无法对每一次未命中进行分类。 `unavailable` 结果不会指示命中或未命中，当比较尚未就绪时会返回该结果。
- 诊断功能绝不会阻塞或失败你的请求，也不会改变模型生成输出的方式。