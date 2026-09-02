> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 创建补全

**post** `/completions`

根据提供的提示和参数创建一个补全。

返回一个补全对象，如果请求是流式的，则返回一个补全对象序列。

### 正文参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用的模型，或参阅我们的 [模型概述](/docs/models) 了解它们的说明。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用的模型，或参阅我们的 [模型概述](/docs/models) 了解它们的说明。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示，可以编码为字符串、字符串数组、token 数组或 token 数组的数组。

  注意 <|endoftext|> 是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将如同从新文档开头开始一样进行生成。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  在 `best_of` 端服务端生成补全，并返回“最佳”的一个（每个 token 具有最高对数概率的那个）。结果无法以流式返回。

  与 `n`, `best_of` 一起使用时，用于控制候选补全的数量，而 `n` 指定要返回的数量 —— `best_of` 必须大于 `n`.

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  除补全外，还回显提示

- `frequency_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数值。正值会根据新 token 截至目前在文本中已出现的频率对其进行惩罚，从而降低模型逐字重复相同内容的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `logit_bias: optional map[number] or null`

  修改指定 token 出现在补全中的可能性。

  接受一个 JSON 对象，用于将词元（通过其在 GPT 分词器中的词元 ID 指定）映射到 -100 到 100 之间的关联偏置值。你可以使用这个 [分词器工具](/tokenizer?view=bpe) 将文本转换为词元 ID。从数学上讲，该偏置会在采样之前添加到模型生成的 logits 上。不同模型的具体效果会有所不同，但 -1 到 1 之间的值应会降低或提高被选中的可能性；像 -100 或 100 这样的值应会导致相应词元被禁止或被唯一选中。

  例如，你可以传入 `{"50256": -100}` 以防止  词元被生成。

- `logprobs: optional number or null`

  在 `logprobs` 最可能的输出词元以及所选词元上包含对数概率。例如，如果 `logprobs` 为 5，API 将返回一个包含 5 个最可能词元的列表。API 将始终返回所采样词元的 `logprob` ，因此响应中最多可能有 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  可在完成中生成的最大 [词元](/tokenizer) 数。

  你的提示的词元数加上 `max_tokens` 不能超过模型的上下文长度。 [用于计算词元的 Python 示例代码](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 。

- `n: optional number or null`

  为每个提示生成的完成数。

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数值。正值会根据新 token 是否已在迄今为止的文本中出现来对其进行惩罚，从而提高模型谈论新主题的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `seed: optional number or null`

  如果指定，我们的系统将尽最大努力进行确定性采样，使得在相同参数下重复发起的请求 `seed` 应返回相同的结果。

  无法保证完全确定性，你可以参考 `system_fingerprint` 响应参数来监测后端的变化。

- `stop: optional string or array of string or null`

  最新的推理模型不支持该参数 `o3` 和 `o4-mini`.

  最多 4 个序列，当出现这些序列时，API 将停止生成更多 token。
  返回的文本不会包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果启用，token 将以仅含数据的 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 在数据可用时，流以一条 `data: [DONE]` 消息结束。 [用于计算词元的 Python 示例代码](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅在你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时，将启用流混淆。流混淆会向流式增量事件上的
    字段添加随机字符，以 `obfuscation` 规整负载大小，作为针对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含在内，但会给数据流带来少量。
    开销。你可以将
    设置为 `include_obfuscation` 以
    如果信任你的应用与 OpenAI API 之间的网络链路，则可设为 false 以优化带宽。
    你的应用与 该公司 接口 之间的。

  - `include_usage: optional boolean`

    如果设置，则会在之前流式传输一个额外的分块 `data: [DONE]`
    消息。该分块的 `usage` 字段会显示整个请求的 token 使用统计信息，
    整个请求的 token 使用情况，并且该 `choices` 字段将始终为空
    数组。

    所有其他分块也会包含一个 `usage` 字段，但其值为 null
    值。 **注意：** 如果流被中断，你可能无法收到包含该请求总 token 用量的
    最后一个用量数据块。

- `suffix: optional string or null`

  插入文本补全之后的后缀。

  此参数仅受支持于 `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加集中和确定。

  我们通常建议更改此参数或 `top_p` ，但不要同时更改两者。

- `top_p: optional number or null`

  一种替代的温度采样方法，称为核采样，其中模型会考虑具有 top_p 概率质量的 token 的结果。因此 0.1 表示仅考虑构成前 10% 概率质量的 token。

  我们通常建议更改此参数或 `temperature` ，但不要同时更改两者。

- `user: optional string`

  用于表示你终端用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。 [了解更多](/docs/guides/safety-best-practices#end-user-ids).

### Returns

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式和非流式响应对象共享相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型针对输入提示所生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值将 `stop` 如果模型遇到了自然停止点或提供了停止序列，
      `length` 如果达到了请求中指定的最大 token 数，
      或者 `content_filter` 如果由于我们内容过滤器的标记而省略了内容。

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

    创建补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于补全的模型。

  - `object: "text_completion"`

    对象类型，始终为 "text_completion"

    - `"text_completion"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用后端配置。

    可与以下请求参数结合使用， `seed` 以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成的补全中的 token 数。

    - `prompt_tokens: number`

      提示中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，下面的 token 数
        completion 中出现的预测 token。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型用于推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，下面的 token 数
        未在 completion 中出现的预测 token。然而，与
        推理 token 一样，这些 token 仍会计入用于计费、输出和上下文窗口
        的 total completion tokens 中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `compute_units: optional number or null`

      请求的计算单元。当前可用时为 null。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

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

#### 响应

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

### 非流式

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

#### 响应

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

### 流式

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

#### 响应

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
