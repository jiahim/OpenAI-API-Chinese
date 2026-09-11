# 提示缓存诊断

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

提示缓存诊断有助于解释为什么某个请求复用的令牌少于预期。对比当前请求与更早的响应，识别模型、工具、设置或输入中阻止复用的更改。

GPT-5.6 及更高版本支持的模型在 Responses API 中提供诊断功能。使用它们排查单个请求，并使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控整个应用的缓存性能。

<a id="compare-with-an-earlier-response"></a>

## 工作原理

提示缓存诊断会对比你当前的请求与早先的响应，以帮助你理解为何某个预期的提示前缀未被复用。前缀指的是提示开头的内容。复用要求前缀完全匹配，且请求设置（包括模型、服务层级和工具）必须兼容。

1. **选择一个基线响应。** 使用同一组织中你预期当前请求会复用其前缀的最近已完成响应，例如上一轮对话。
2. **请求对比。** 将 `prompt_cache_options.comparison_response_id` 设置为基线响应的 `id`.
3. **读取结果。** 检查 `prompt_cache_diagnostics` 在当前响应上的结果。如果诊断信息识别出缓存未命中，结果中会包含原因以帮助你进行调查。使用 `usage.input_tokens_details.cached_tokens` 来衡量实际的缓存复用情况。

设置 `comparison_response_id` 仅请求诊断信息。它不会加载此前的对话，也不会改变缓存行为。当前请求仍可复用其他请求中匹配的缓存条目。

### 使用示例

以下示例发送两个请求，这两个请求使用相同的模型、指令和输入，但将函数工具的名称从 `get_time` 更改为 `get_date`。第二个请求会比较与第一个请求之间的缓存复用情况。

在 `support-policy.txt`。中使用你自己的策略文档。可复用的前缀必须满足模型的 [最小可缓存长度](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，GPT-5.6 及更高版本的长度为 1,024 个 token。

比较响应之间的提示词缓存复用情况

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


如果工具更改导致未命中，结果可能如下所示。Token 数量会随输入而变化。

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

为保持复用，请在请求之间保持工具定义和顺序不变。请参阅 [使用仅追加更新管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).

### 多轮对话

若要对比连续的多轮对话，请保存每个已完成响应的 `id` ，并在下次请求时将其作为 `comparison_response_id` 传入 `prompt_cache_options` 。在第一轮中省略比对 ID。

测试修复方案时，请将比对 ID 保持为基线响应。

### 流式传输

当 `stream=True`，时，从 `prompt_cache_diagnostics` 中的 `event.response` 字段读取 [`response.completed` 事件](https://developers.openai.com/api/reference/resources/responses/streaming-events#response.completed).

## 理解响应

阅读 `prompt_cache_diagnostics.type` 以确定比较结果。




| 类型                            | 含义                                                                                                                                                        | 操作建议                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `cache_hit`                     | 未检测到比较的缓存未命中。                                                                                                                 | 检查 `usage.input_tokens_details.cached_tokens` 以衡量实际复用情况。                         |
| `cache_miss`                    | 存在差异导致无法复用预期前缀。结果包含 `reason` 和 `cache_missed_tokens`。还可能包含 `comparison_reusable_tokens`. | 在以下位置查找原因和建议的修复方法： [修复缓存未命中](#fix-a-cache-miss).                       |
| `comparison_response_not_found` | 比较响应没有可用的诊断记录。可能缺失或已过期。                                                            | 从同一组织中选择另一个最近完成的响应。                              |
| `unavailable`                   | 比较无法得出明确结论，或模型不支持诊断。                                                               | 确认模型支持并尝试另一个最近的比较。你仍然可以正常使用该响应。 |




### 解读 token 数

一个 `cache_hit` 表示比对未检测到缓存未命中。新输入仍可能需要处理。例如，一个包含 2,500 个输入 token 的请求可以报告 `cache_hit` ，当它复用比对响应的 2,000 token 前缀并处理 500 个新 token 时。

对于一个 `cache_miss`:

- `comparison_reusable_tokens`，如果存在，表示对比响应可复用前缀的原始 token 数。
- `cache_missed_tokens` 估计其中有多少 token 未被复用。

这些诊断计数可能与用量计数不同。请使用当前响应的 usage 字段来衡量已报告的缓存复用与计费情况。

## 修复缓存未命中

使用 `prompt_cache_diagnostics.reason` 在下表中查找缓存未命中的原因及建议的修复方法。

某些更改（例如切换模型或压缩对话）是有意为之。即使这些更改会降低缓存重用率，你也可以选择保留它们。




| 原因                     | 发生了什么变化                                                                                                                                        | 如何提升复用                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model_changed`            | 由不同的模型处理了该请求，例如由于路由、A/B 测试或回退机制选择了其他模型。                            | 检查模型选择，避免发生意外的切换。对于预期共享同一缓存前缀的请求，使用相同的模型。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                 |
| `prompt_cache_key_changed` | 请求之间所提供的 key 发生了变化。这可能在响应中报告为缓存未命中 `usage` ，但实际并未发生物理缓存未命中。                  | 省略 `prompt_cache_key` ，除非你的应用需要为不同客户或用户分别进行缓存核算。如果使用 key，请在每个分组内保持 key 稳定。参见 [使用 key 进行独立的缓存核算](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys).                                                                                                                                                 |
| `service_tier_changed`     | 用于处理该请求的服务层级发生了变化。                                                                                               | 对于预期共享同一前缀的请求，保持服务层级一致。检查返回的 `service_tier`，它可能与请求的值不同。参见 [`service_tier`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20service_tier%20%3E%20%28schema%29) 以了解所支持的值及其行为。 |
| `tools_changed`            | 工具被添加、移除或重新排序，或其描述、schema 或配置发生了变化。                                                  | 保持工具定义和顺序稳定。使用 `tool_choice: "none"` 来禁用工具，或使用 `allowed_tools` 来限制可在不更改所提供工具列表的情况下运行哪些工具。参见 [通过仅追加更新来管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).                                                                                                                      |
| `text_format_changed`      | 输出格式或其 schema 发生了变化。                                                                                                            | 保留 `text.format` 在所需的输出结构未变化时，保持 schema 一致。请参阅 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).                                                                                                                                                                                                                                                               |
| `reasoning_effort_changed` | 推理强度发生了变化。                                                                                                                       | 保留 `reasoning.effort` 在旨在共享前缀的请求之间保持一致。请参阅 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                                                    |
| `verbosity_changed`        | 响应详尽程度发生了变化。                                                                                                                     | 保留 `text.verbosity` 在旨在共享前缀的请求之间保持一致。请参阅 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                                                      |
| `context_compacted`        | 压缩替换了更早的对话内容。                                                                                                   | 保留稳定的指令，让后续轮次在压缩后的上下文上构建。可比较总输入成本：即使缓存复用率降低，输入 token 减少仍可能节省费用。请参阅 [压缩](https://developers.openai.com/api/docs/guides/compaction).                                                                                                                                                                                               |
| `input_changed`            | 更早的输入发生了变化，例如指令中包含时间戳或请求 ID，或先前的消息被编辑、重排或移除。 | 将变化的内容移到可复用前缀及其缓存断点之后。保留先前的消息和工具结果，并追加新的轮次。请参阅 [保留对话历史](https://developers.openai.com/api/docs/guides/prompt-caching#preserve-conversation-history).                                                                                                                                                                            |




## 确认改进效果

完成修改后：

1. 发送另一个具有代表性的请求，并与预期基线进行比较。
2. 检查诊断结果中是否仍存在任何差异。
3. 对比 `cached_tokens`, `cache_write_tokens`,以及在多个请求中的总成本。

参见 [监控缓存性能](https://developers.openai.com/api/docs/guides/prompt-caching#monitor-cache-performance) 以查看用量指标和成本计算。

## 价格与速率限制

提示缓存诊断不会产生额外费用，也不会单独计入速率限制。任何发往 Responses API 的额外基线请求或重试请求都会正常计费，并计入速率限制。

## Zero Data Retention

提示缓存诊断与零数据保留兼容。OpenAI 不会为此功能存储原始提示或模型输出。诊断记录包含配置元数据、token 计数估算值以及用于比较缓存敏感内容的哈希值。这些记录限定在组织范围内，仅在短时间后过期，并且仅用于解释提示缓存的命中或未命中。

设置 `comparison_response_id` 不会检索或持久化先前响应的内容。参见 [你的数据](https://developers.openai.com/api/docs/guides/your-data) 了解 OpenAI 的数据控制方式。

## 限制

- 诊断信息在 Responses API 中可用于 GPT-5.6 及更高版本的受支持模型。
- 诊断记录会在较短时间后过期。过期记录会返回 `comparison_response_not_found`，即使响应仍然可通过该 API 获取。
- 诊断仅报告首个已分类的原因。请先解决该原因，然后重复对比以检查是否存在其他原因。
- 诊断是尽力而为的，可能无法对每一次未命中进行分类。 `unavailable` 结果不表示命中或未命中，会在对比尚未就绪时返回。
- 诊断绝不会阻塞或使你的请求失败，也不会改变模型生成输出的方式。