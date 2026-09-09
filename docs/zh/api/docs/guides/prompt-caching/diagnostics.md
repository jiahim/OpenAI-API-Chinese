# Prompt cache diagnostics

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

提示缓存诊断有助于解释请求复用的 token 数为何少于预期。将一个请求与更早的响应进行对比，找出模型、工具、设置或输入中导致无法复用的变化。

诊断功能在 GPT-5.6 及更高版本的受支持模型的 Responses API 中提供。使用它们来排查单个请求，并使用 [提示缓存仪表板](https://platform.openai.com/usage?usage_section=prompt-caching) 来监控整个应用中的缓存性能。

<a id="compare-with-an-earlier-response"></a>

## 工作原理

提示缓存诊断会将你当前的请求与早前的响应进行比较，以帮助解释为何预期的提示前缀未被复用。前缀是提示开头的内容。复用要求前缀完全匹配，并且请求设置兼容，包括模型、服务层级和工具。

1. **选择一个基线响应。** 使用同一组织中你预期当前请求会复用前缀的最近已完成响应，例如上一轮对话。
2. **请求一次比较。** 将 `prompt_cache_options.comparison_response_id` 设置为基线响应的 `id`.
3. **查看结果。** 检查 `prompt_cache_diagnostics` 在当前响应上的情况。如果诊断信息指出一次缓存未命中，结果会包含一条原因以便你排查。使用 `usage.input_tokens_details.cached_tokens` 来衡量实际的缓存复用情况。

Setting `comparison_response_id` 仅请求诊断信息。它不会加载先前的对话，也不会改变缓存行为。当前请求仍可复用来自其他请求的匹配缓存条目。

### 使用示例

以下示例发送两个使用相同模型、指令和输入的请求，但将一个函数工具的名称从 `get_time` 改为 `get_date`。第二个请求会与第一个请求比较缓存复用情况。

在 `support-policy.txt`。中使用你自己的策略文档。可复用的前缀必须满足模型的 [最小可缓存长度](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，GPT-5.6 及以后为 1,024 个 token。

比较响应之间的提示缓存复用情况

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


如果工具变更导致未命中，结果可能如下所示。token 计数会随输入而变化。

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

若要保持复用，请在请求之间保持工具定义和顺序不变。请参阅 [以仅追加方式管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).

### 多轮对话

若要比较连续的轮次，请保存每个已完成响应的 `id` ，并在下次请求时将其作为 `comparison_response_id` 传入 `prompt_cache_options` 。在第一轮请省略比较 ID。

在测试修复时，请将比较 ID 保持设置为基线响应。

### 流式传输

当 `stream=True`，时，读取 `prompt_cache_diagnostics` 从 `event.response` 在 [`response.completed` 事件](https://developers.openai.com/api/reference/resources/responses/streaming-events#response.completed).

## 理解响应

阅读 `prompt_cache_diagnostics.type` 以确定比较结果。




| Type                            | 含义                                                                                                                                                        | 处理建议                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `cache_hit`                     | 未检测到针对该对比的缓存未命中。                                                                                                                 | 查看 `usage.input_tokens_details.cached_tokens` 以衡量实际复用情况。                         |
| `cache_miss`                    | 存在差异导致无法复用预期前缀。结果包含 `reason` 和 `cache_missed_tokens`。它可能还包含 `comparison_reusable_tokens`. | 在 [修复缓存未命中](#fix-a-cache-miss).                       |
| `comparison_response_not_found` | 对比响应没有可用的诊断记录，可能缺失或已过期。                                                            | 从同一组织中重新选择另一条最近已完成的响应。                              |
| `unavailable`                   | 对比未能得出明确结论，或该模型不支持诊断。                                                               | 确认模型支持情况并尝试另一条最近的对比。你仍然可以正常使用该响应。 |




### 解读 token 数量

一个 `cache_hit` 意味着在比较中未检测到缓存未命中。新输入仍然可能需要处理。例如，一个包含 2,500 个输入 token 的请求可以报告 `cache_hit` 当它复用比较响应的 2,000 token 前缀并处理 500 个新 token 时。

对于一个 `cache_miss`:

- `comparison_reusable_tokens`若存在该字段，则为对比响应可复用前缀的原始 token 数。
- `cache_missed_tokens` 用于估算其中未被复用的 token 数。

这些诊断计数可能与使用量计数不同。请使用当前响应的 usage 字段来衡量实际的缓存命中率和计费情况。

## 修复缓存未命中

使用 `prompt_cache_diagnostics.reason` 在以下表格中查找缓存未命中的原因及建议的修复方法。

某些更改（例如切换模型或压缩对话）是有意为之。即使它们会降低缓存复用率，你也可以选择保留这些更改。




| 原因                     | 发生了什么变化                                                                                                                                        | 如何提升缓存复用率                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model_changed`            | 请求由另一个模型处理，例如由于路由、A/B 测试或回退机制选择了其他模型。                            | 检查模型选择是否存在非预期的切换。对于本应共享同一缓存前缀的请求，请使用相同的模型。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                 |
| `prompt_cache_key_changed` | 密钥在请求之间发生了变化，例如其中包含了唯一的请求 ID 或时间戳。                                                 | 为相关请求选择一个稳定的密钥，并在前缀仍然可复用期间持续复用它。参见 [调整提示缓存密钥](https://developers.openai.com/api/docs/guides/prompt-caching#tune-prompt-cache-keys).                                                                                                                                                                                                                                               |
| `service_tier_changed`     | 用于处理请求的服务层级发生了变化。                                                                                               | 对于预期共享同一前缀的请求，请保持服务层级一致。检查返回的 `service_tier`,它可能与请求值不同。参见 [`service_tier`](https://developers.openai.com/api/reference/resources/responses/methods/create#%28resource%29%20responses%20%3E%20%28method%29%20create%20%3E%20%28params%29%200.non_streaming%20%3E%20%28param%29%20service_tier%20%3E%20%28schema%29) ,以了解支持的值和行为。 |
| `tools_changed`            | 工具被添加、移除或重新排序，或者其描述、schema 或配置发生了变化。                                                  | 保持工具定义和顺序的稳定。使用 `tool_choice: "none"` 以禁用工具，或 `allowed_tools` 在不改写工具列表的前提下限制可运行工具的范围。参见 [使用仅追加更新来管理工具](https://developers.openai.com/api/docs/guides/prompt-caching#manage-tools-with-append-only-updates).                                                                                                                      |
| `text_format_changed`      | 输出格式或其 schema 发生了变化。                                                                                                            | 保持 `text.format` 并在所需输出结构未发生变化时保持 schema 一致。参见 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs).                                                                                                                                                                                                                                                               |
| `reasoning_effort_changed` | 推理力度发生了变化。                                                                                                                       | 保持 `reasoning.effort` 在旨在共享前缀的请求之间保持一致。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                                                    |
| `verbosity_changed`        | 响应详尽程度发生了变化。                                                                                                                     | 保持 `text.verbosity` 在旨在共享前缀的请求之间保持一致。参见 [影响缓存的设置](https://developers.openai.com/api/docs/guides/prompt-caching#which-settings-affect-the-cached-prefix).                                                                                                                                                                                                                                      |
| `context_compacted`        | 压缩替换了此前的对话内容。                                                                                                   | 保留稳定的指令，让后续轮次在压缩后的上下文上构建。比较总的输入成本：即使缓存复用率更低，输入 token 减少仍可能省钱。参见 [压缩](https://developers.openai.com/api/docs/guides/compaction).                                                                                                                                                                                               |
| `input_changed`            | 此前的输入发生了变化，例如因为指令中包含时间戳或请求 ID，或先前的消息被编辑、重排或删除。 | 将可变内容移至可复用前缀及其缓存断点之后。保留此前的消息和工具结果，并追加新的轮次。参见 [保留对话历史](https://developers.openai.com/api/docs/guides/prompt-caching#preserve-conversation-history).                                                                                                                                                                            |




## 确认改进效果

完成修改后：

1. 发送另一个代表性请求，并将其与预期基线进行比较。
2. 检查诊断结果中是否仍有差异。
3. 对比 `cached_tokens`, `cache_write_tokens`,以及若干请求的总成本。

参阅 [监控缓存性能](https://developers.openai.com/api/docs/guides/prompt-caching#monitor-cache-performance) 了解用量指标和成本计算。

## 定价与速率限制

提示缓存诊断不产生额外费用，也不会单独计入速率限制。任何对 Responses API 的额外基线或重试请求都会正常计费，并计入速率限制。

## Zero Data Retention

提示词缓存诊断与零数据保留兼容。OpenAI 不会为此功能存储原始提示词或模型输出。诊断记录包含配置元数据、令牌计数估算值以及用于比较缓存敏感内容的哈希值。这些记录的范围限定在该组织内，在短时间后失效，并且仅用于解释提示词缓存的命中或未命中情况。

Setting `comparison_response_id` 不会检索或保留之前响应的内容。详见 [你的数据](https://developers.openai.com/api/docs/guides/your-data) 中的 OpenAI 数据控制选项。

## 局限性

- 诊断信息适用于 GPT-5.6 及更高版本支持的模型中的 Responses API。
- 诊断记录会在较短时间后过期。过期记录会返回 `comparison_response_not_found`，即使响应仍可通过 API 获取。
- 诊断会报告首个分类出的原因。解决该原因后，再次执行比较以检查是否存在其他原因。
- 诊断是尽力而为的，可能无法对每次未命中进行分类。 `unavailable` 结果不表示命中或未命中，会在比较尚未就绪时返回。
- 诊断绝不会阻塞或导致你的请求失败，也不会改变模型生成输出的方式。