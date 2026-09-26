> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## Create completion

**post** `/completions`

根据提供的提示和参数创建补全。

返回一个补全对象；若请求以流式方式发送，则返回一系列补全对象。

### 请求体参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以使用 [列出模型](/api/reference/resources/models/methods/list) API 来查看所有可用模型，或参阅我们的 [模型概述](/api/docs/models) 了解相关说明。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以使用 [列出模型](/api/reference/resources/models/methods/list) API 来查看所有可用模型，或参阅我们的 [模型概述](/api/docs/models) 了解相关说明。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示，可以编码为字符串、字符串数组、token 数组或 token 数组的数组。

  请注意， 是模型在训练时看到的文档分隔符，因此如果未指定提示，模型将如同从新文档开头一样生成。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  在服务端 `best_of` 生成补全 服务端 并返回“最佳”结果（即每个 token 具有最高对数概率的那一个）。结果无法以流式方式返回。

  与 `n`, `best_of` 配合使用时，控制候选补全的数量， `n` 指定要返回的数量—— `best_of` 必须大于 `n`.

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保为 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  除了补全内容外，回显提示

- `frequency_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新 token 在已有文本中的出现频率对其进行惩罚，从而降低模型逐字重复相同内容的可能性。

  [查看关于频率和存在惩罚的更多信息。](/api/docs/guides/text)

- `logit_bias: optional map[number] or null`

  修改指定 token 在补全中出现的可能性。

  接受一个 JSON 对象，该对象将 token（在 GPT tokenizer 中以其 token ID 指定）映射到 -100 到 100 之间的关联偏差值。你可以使用此 [tokenizer 工具](https://platform.openai.com/tokenizer?view=bpe) 将文本转换为 token ID。从数学上讲，该偏差会在采样前加到模型生成的 logits 上。具体效果因模型而异，但介于 -1 和 1 之间的值应会降低或提高被选中的可能性；类似 -100 或 100 的值应会导致禁用或独占选中相应 token。

  例如，你可以传入 `{"50256": -100}` 来防止生成相应 token。

- `logprobs: optional number or null`

  在 `logprobs` 最可能的输出 token 上包含对数概率，以及所选 token 的对数概率。例如，如果 `logprobs` 为 5，API 将返回 5 个最可能 token 的列表。API 将始终返回所采样 token 的 `logprob` ，因此响应中最多可能包含 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  在补全中可以生成的最大 [token 数](https://platform.openai.com/tokenizer) 。

  你的提示词的 token 数量加上 `max_tokens` 不能超过模型的上下文长度。 [用于计算 token 的 Python 示例代码](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 。

- `n: optional number or null`

  为每个提示词生成的补全数量。

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保为 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新 token 是否出现在已有文本中对它们进行惩罚，从而提高模型谈论新主题的可能性。

  [查看关于频率和存在惩罚的更多信息。](/api/docs/guides/text)

- `seed: optional number or null`

  如果指定此参数，我们的系统将尽最大努力进行确定性采样，使得使用相同 `seed` 和参数发起的重复请求返回相同的结果。

  无法保证确定性，你需要参考 `system_fingerprint` response 参数来监控后端的变化。

- `stop: optional string or array of string or null`

  最新的推理模型不支持此参数 `o3` 和 `o4-mini`.

  最多 4 个序列，当 API 遇到这些序列时会停止生成更多 token。
  返回的文本不会包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果设置，token 将以 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 的形式在可用时立即发送，流的结尾由一个 `data: [DONE]` 消息标识。 [用于计算 token 的 Python 示例代码](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当你设置了 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时才会启用流混淆。流混淆会在
    字段中添加随机字符，作用于 `obfuscation` 流式 delta 事件上的
    字段，以均衡 payload 大小，作为对某些侧信道攻击的缓解措施。
    默认会包含这些混淆字段，但会给数据流带来少量
    开销。你可以将 `include_obfuscation` 设置为
    如果你信任应用与 OpenAI API 之间的网络链路，可设为 false 以优化带宽，
    你的应用和 该公司 接口 之间。

  - `include_usage: optional boolean`

    如果设置了该参数，会在之前额外流式传输一个包含 `data: [DONE]`
    message. The `usage` 字段显示该分块的 token 使用统计信息
    用于整个请求，并且 `choices` 字段将始终是一个空
    数组。

    所有其他数据块也将包含一个 `usage` 字段，但值为 null
    值。 **注意：** 如果流被中断，你可能无法收到包含请求总 token 使用量的
    最终 usage 数据块。

- `suffix: optional string or null`

  插入文本补全之后的后缀。

  仅在以下模型中支持该参数： `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加聚焦和确定。

  我们通常建议更改此参数或 `top_p` 其中之一，而不是同时修改两者。

- `top_p: optional number or null`

  作为带温度采样的替代方案，称为核采样（nucleus sampling），模型会考虑概率质量最高的 top_p 个 token 的结果。因此 0.1 表示仅考虑概率质量排名前 10% 的 token。

  我们通常建议更改此参数或 `temperature` 其中之一，而不是同时修改两者。

- `user: optional string`

  用于表示你最终用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### 返回值

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式响应和非流式响应对象具有相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型针对输入提示生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到了自然停止点或提供了停止序列，
      `length` 表示达到了请求中指定的最大 token 数，
      或者 `content_filter` 表示由于内容过滤器标记而被省略了内容。

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

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成的补全中的 token 数。

    - `prompt_tokens: number`

      提示中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全内容中的预测。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全内容中的预测。不过，和
        推理 token 一样，这些 token 仍然会计入总
        补全 token 中，用于计费、输出和上下文窗口
        的限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用 token 的明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示词 token 数量。

      - `cached_tokens: optional number`

        提示词中存在的已缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

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
  "model": "gpt-3.5-turbo-instruct",
  "system_fingerprint": "fp_44709d6fcb"
}
```
