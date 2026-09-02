# Completions

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建补全

**post** `/completions`

根据提供的提示和参数创建补全。

返回一个补全对象，如果请求是流式的，则返回一系列补全对象。

### 请求体参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概述](/docs/models) 了解相关描述。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概述](/docs/models) 了解相关描述。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示（prompt），可以编码为字符串、字符串数组、token 数组或 token 数组的数组。

  注意，是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将如同从一篇新文档的开头开始生成。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  服务端 `best_of` 生成补全并返回“最佳”结果（即每个 token 具有最高对数概率的那一个）。结果无法以流式方式返回。服务端。

  与 `n`, `best_of` 配合使用时，它控制候选补全的数量，而 `n` 指定要返回多少个 – `best_of` 必须大于 `n`.

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  除了补全内容外，将提示一同回显

- `frequency_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新 token 在已有文本中出现的频率对其进行惩罚，从而降低模型逐字重复相同内容的可能性。

  [查看关于频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `logit_bias: optional map[number] or null`

  修改指定 token 在补全中出现的可能性。

  接受一个 JSON 对象，将 token（通过 GPT 分词器中的 token ID 指定）映射到 -100 到 100 之间的关联偏差值。可以使用此 [分词器工具](/tokenizer?view=bpe) 将文本转换为 token ID。数学上，偏差会在采样之前被加到模型生成的 logits 上。具体影响会因模型而异，但介于 -1 到 1 之间的值会降低或增加被选中的可能性；像 -100 或 100 这样的值会导致禁用或独占选择相应的 token。

  例如，可以传入 `{"50256": -100}` 来阻止生成 token。

- `logprobs: optional number or null`

  在以下输出中包含对数概率： `logprobs` 最可能的输出 token，以及所选 token。例如，如果 `logprobs` 为 5，API 将返回 5 个最可能 token 的列表。API 将始终返回所采样 token 的 `logprob` ，因此响应中最多可以有 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  可在补全中生成的最大 [token 数](/tokenizer) 。

  你的 prompt 的 token 数加上 `max_tokens` 不能超过模型的上下文长度。 [用于计算 token 的示例 Python 代码](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 。

- `n: optional number or null`

  每个 prompt 要生成的补全数。

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新 token 是否已在文本中出现对其进行惩罚，从而提高模型谈论新主题的可能性。

  [查看关于频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `seed: optional number or null`

  如果指定，我们的系统将尽最大努力进行确定性采样，使得在相同 `seed` 和参数下重复请求应返回相同的结果。

  无法保证完全确定性，你可以查阅 `system_fingerprint` 响应参数以监控后端的变化。

- `stop: optional string or array of string or null`

  最新的推理模型不支持该参数 `o3` 和 `o4-mini`.

  最多 4 个序列，当遇到这些序列时 API 将停止生成更多 token。返回的
  文本将不包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果启用，token 将以纯数据的形式作为 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 随着数据变得可用而发送，流以一个 `data: [DONE]` 消息结束。 [用于计算 token 的示例 Python 代码](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    如果为 true，将启用流混淆。流混淆会向流式 delta 事件的
    字段添加随机字符， `obfuscation` 以规范化负载大小，作为针对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会增加少量。
    到数据流的开销。你可以将
    设置为 `include_obfuscation` 为
    false 时可在信任你的应用与
    OpenAI API 之间网络链路的情况下优化带宽。

  - `include_usage: optional boolean`

    若设置，则在 `data: [DONE]`
    消息之前还会流式传出一个额外的数据块。该 `usage` 字段显示整个请求的 token 使用统计信息，
    字段对应整个请求， `choices` 字段始终为空
    数组。

    所有其他数据块也会包含一个 `usage` 字段，但其值为
    null。 **注意：** 如果流被中断，你可能无法收到
    包含整个请求总 token 使用量的最终使用情况数据块。

- `suffix: optional string or null`

  插入文本补全之后的后缀。

  该参数仅支持 `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加聚焦和确定。

  我们通常建议修改此参数或 `top_p` ，但不要同时修改两者。

- `top_p: optional number or null`

  一种采用温度采样的替代方案，称为核采样（nucleus sampling），即模型考虑具有 top_p 概率质量的 token 结果。所以 0.1 表示仅考虑构成前 10% 概率质量的 token。

  我们通常建议修改此参数或 `temperature` ，但不要同时修改两者。

- `user: optional string`

  用于标识你最终用户的唯一 ID，可以帮助 OpenAI 监控和检测滥用行为。 [了解更多](/docs/guides/safety-best-practices#end-user-ids).

### Returns

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式和非流式响应对象共享相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值为 `stop` ，如果模型遇到了自然停止点或提供的停止序列；
      `length` ，如果达到了请求中指定的最大 token 数；
      或 `content_filter` ，如果由于我们的内容过滤器标记而省略了内容。

      - `"stop"`

      - `"length"`

      - `"content_filter"`

    - `index: number`

    - `logprobs: object { text_offset, token_logprobs, tokens, top_logprobs }  or null`

      - `text_offset: optional array of number`

      - `token_logprobs: optional array of number`

      - `tokens: optional array of string`

      - `top_logprobs: optional array of map[number]`

    - `text: string`

  - `created: number`

    补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于补全的模型。

  - `object: "text_completion"`

    对象类型，始终为 "text_completion"

    - `"text_completion"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时的后端配置。

    可与 `seed` 请求参数结合使用，以了解可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成的补全中的 token 数。

    - `prompt_tokens: number`

      提示中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 细分。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全结果中的预测 token。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全结果中的预测 token。但是,与推理 token 类似,
        这些 token 仍会计入用于计费、输出和上下文窗口的总
        补全 token 中,用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `compute_units: optional number or null`

      请求所用的计算单元。目前可用时为 null。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### 示例

```http
curl https://api.openai.com/v1/completions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-3.5-turbo-instruct",
          "prompt": "This is a test.",
          "max_tokens": 16,
          "n": 1,
          "suffix": "test.",
          "temperature": 1,
          "top_p": 1,
          "user": "user-1234"
        }'
```

#### Response

```json
{
  "id": "id",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "logprobs": {
        "text_offset": [
          0
        ],
        "token_logprobs": [
          0
        ],
        "tokens": [
          "string"
        ],
        "top_logprobs": [
          {
            "foo": 0
          }
        ]
      },
      "text": "text"
    }
  ],
  "created": 0,
  "model": "model",
  "object": "text_completion",
  "system_fingerprint": "system_fingerprint",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0,
      "text_tokens": 0
    },
    "compute_units": 0,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cache_write_tokens": 0,
      "cached_tokens": 0,
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 无流式输出

```http
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo-instruct",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0
  }'
```

#### Response

```json
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "gpt-3.5-turbo-instruct",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
```

### 流式输出

```http
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo-instruct",
    "prompt": "Say this is a test",
    "max_tokens": 7,
    "temperature": 0,
    "stream": true
  }'
```

#### Response

```json
{
  "id": "cmpl-7iA7iJjj8V2zOkCGvWF2hAkDWBQZe",
  "object": "text_completion",
  "created": 1690759702,
  "choices": [
    {
      "text": "This",
      "index": 0,
      "logprobs": null,
      "finish_reason": null
    }
  ],
  "model": "gpt-3.5-turbo-instruct"
  "system_fingerprint": "fp_44709d6fcb",
}
```

## Domain Types

### Completion

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式和非流式响应对象共享相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值为 `stop` ，如果模型遇到了自然停止点或提供的停止序列；
      `length` ，如果达到了请求中指定的最大 token 数；
      或 `content_filter` ，如果由于我们的内容过滤器标记而省略了内容。

      - `"stop"`

      - `"length"`

      - `"content_filter"`

    - `index: number`

    - `logprobs: object { text_offset, token_logprobs, tokens, top_logprobs }  or null`

      - `text_offset: optional array of number`

      - `token_logprobs: optional array of number`

      - `tokens: optional array of string`

      - `top_logprobs: optional array of map[number]`

    - `text: string`

  - `created: number`

    补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于补全的模型。

  - `object: "text_completion"`

    对象类型，始终为 "text_completion"

    - `"text_completion"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时的后端配置。

    可与 `seed` 请求参数结合使用，以了解可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成的补全中的 token 数。

    - `prompt_tokens: number`

      提示中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 细分。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全结果中的预测 token。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全结果中的预测 token。但是,与推理 token 类似,
        这些 token 仍会计入用于计费、输出和上下文窗口的总
        补全 token 中,用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `compute_units: optional number or null`

      请求所用的计算单元。目前可用时为 null。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### Completion Choice

- `CompletionChoice object { finish_reason, index, logprobs, text }`

  - `finish_reason: "stop" or "length" or "content_filter"`

    模型停止生成 token 的原因。该值为 `stop` ，如果模型遇到了自然停止点或提供的停止序列；
    `length` ，如果达到了请求中指定的最大 token 数；
    或 `content_filter` ，如果由于我们的内容过滤器标记而省略了内容。

    - `"stop"`

    - `"length"`

    - `"content_filter"`

  - `index: number`

  - `logprobs: object { text_offset, token_logprobs, tokens, top_logprobs }  or null`

    - `text_offset: optional array of number`

    - `token_logprobs: optional array of number`

    - `tokens: optional array of string`

    - `top_logprobs: optional array of map[number]`

  - `text: string`

### Completion Usage

- `CompletionUsage object { completion_tokens, prompt_tokens, total_tokens, 3 more }`

  补全请求的使用统计信息。

  - `completion_tokens: number`

    生成的补全中的 token 数。

  - `prompt_tokens: number`

    提示中的 token 数。

  - `total_tokens: number`

    请求中使用的总 token 数（提示 + 补全）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    补全中使用的 token 细分。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      出现在补全结果中的预测 token。

    - `audio_tokens: optional number`

      由模型生成的音频输入 token。

    - `reasoning_tokens: optional number`

      由模型生成的用于推理的 token。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未出现在补全结果中的预测 token。但是,与推理 token 类似,
      这些 token 仍会计入用于计费、输出和上下文窗口的总
      补全 token 中,用于计费、输出和上下文窗口
      限制。

    - `text_tokens: optional number`

      由模型生成的文本输出 token。

  - `compute_units: optional number or null`

    请求所用的计算单元。目前可用时为 null。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示中使用的 token 明细。

    - `audio_tokens: optional number`

      提示中存在的音频输入 token。

    - `cache_write_tokens: optional number`

      写入缓存的未经调整的提示 token 数量。

    - `cached_tokens: optional number`

      提示中存在的已缓存 token。

    - `image_tokens: optional number`

      提示中存在的图像输入 token。

    - `text_tokens: optional number`

      提示中存在的文本输入 token。
