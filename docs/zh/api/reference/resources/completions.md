# Completions

> 完整文档索引请参见 [llms.txt](/llms.txt).可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## Create completion

**post** `/completions`

根据提供的提示和参数创建补全。

返回一个补全对象；如果请求以流式方式发送，则返回一系列补全对象。

### 请求体参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以使用 [列出模型](/api/reference/resources/models/methods/list) API 来查看所有可用的模型，或参阅我们的 [模型概述](/api/docs/models) 了解它们的描述。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以使用 [列出模型](/api/reference/resources/models/methods/list) API 来查看所有可用的模型，或参阅我们的 [模型概述](/api/docs/models) 了解它们的描述。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示，编码为字符串、字符串数组、token 数组或 token 数组的数组。

  注意 <|endoftext|> 是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将像从新文档开头一样生成内容。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  生成 `best_of` 补全 服务端 并返回“最佳”的一个（即每个 token 具有最高对数概率的那个）。结果无法以流式方式返回。

  与以下参数配合使用时 `n`, `best_of` 控制候选补全的数量，而 `n` 指定要返回的数量 —— `best_of` 必须大于 `n`.

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  除了补全内容外，回显输入的提示

- `frequency_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数值。正值会根据新 token 在文本中已有的出现频率对其进行惩罚，从而降低模型逐字重复相同内容的可能性。

  [查看有关频率和存在惩罚的更多信息。](/api/docs/guides/text)

- `logit_bias: optional map[number] or null`

  修改指定 token 出现在补全中的可能性。

  接受一个 JSON 对象，该对象将 token（由 GPT tokenizer 中的 token ID 指定）映射到 -100 到 100 之间的关联偏差值。你可以使用此 [tokenizer 工具](https://platform.openai.com/tokenizer?view=bpe) 将文本转换为 token ID。从数学上讲，该偏差会在采样之前添加到模型生成的 logits 中。具体效果因模型而异，但 -1 到 1 之间的值应会降低或提高被选中的可能性；类似 -100 或 100 这样的值则会导致禁用或唯一选择相关 token。

  例如，你可以传入 `{"50256": -100}` 以防止生成 <|endoftext|> token。

- `logprobs: optional number or null`

  在以下输出中包含对数概率 `logprobs` 最有可能的 token，以及所选 token。例如，如果 `logprobs` 为 5，API 将返回 5 个最可能 token 的列表。API 将始终返回 `logprob` 所采样 token 的对数概率，因此响应中最多可能有 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  completion 中可生成的最大 [token](https://platform.openai.com/tokenizer) 数量。

  你的 prompt 的 token 数加上 `max_tokens` 不能超过模型的上下文长度。 [用于计算 token 的](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) Python 代码示例。

- `n: optional number or null`

  为每个 prompt 生成多少个 completion。

  **注意：** 由于此参数会生成大量补全，可能会迅速消耗你的 token 配额。请谨慎使用，并确保你对 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据词元是否已出现在文本中对其进行惩罚，从而提高模型谈论新主题的可能性。

  [查看有关频率和存在惩罚的更多信息。](/api/docs/guides/text)

- `seed: optional number or null`

  如果指定，我们的系统将尽最大努力进行确定性采样，使得在相同 `seed` 和参数下重复发起的请求应返回相同的结果。

  无法保证确定性，你应参考 `system_fingerprint` 响应参数来监控后端的变化。

- `stop: optional string or array of string or null`

  最新的推理模型不支持该参数 `o3` 和 `o4-mini`.

  最多 4 个序列，当出现这些序列时 API 将停止生成更多词元。返回的
  文本不会包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果设置，词元将以纯数据的 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 形式在可用时发送，流以一条 `data: [DONE]` 消息终止。 [用于计算 token 的](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的相关选项。仅在设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    时使用。当值为 true 时，将启用流混淆。流混淆会在
    流式增量事件的某个 `obfuscation` 字段中添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    这些混淆字段默认会包含在内，但会给数据流带来少量
    额外开销。你可以将 `include_obfuscation` 设为
    如果你信任应用与 OpenAI API 之间的网络链路，则设为 false 以优化带宽
    你的应用与 该公司 接口 之间。

  - `include_usage: optional boolean`

    如果设置此项，将在消息前流式传输一个额外的分块 `data: [DONE]`
    。该 `usage` 字段显示整个请求的 token 使用统计信息
    ，而该 `choices` 字段将始终为空
    数组。

    所有其他分块也会包含一个 `usage` 字段，但取值为 null
    。 **注意：** 如果流被中断，你可能无法收到包含该请求
    总 token 使用量的最终使用情况分块。

- `suffix: optional string or null`

  插入文本补全之后的后缀。

  该参数仅支持 `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加聚焦和确定。

  我们通常建议修改此项或 `top_p` ，但不要同时修改两者。

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样（nucleus sampling），模型会考虑具有 top_p 概率质量的 token 结果。因此 0.1 表示仅考虑构成前 10% 概率质量的 token。

  我们通常建议修改此项或 `temperature` ，但不要同时修改两者。

- `user: optional string`

  用于标识你终端用户的唯一标识符，可帮助 OpenAI 监控并检测滥用行为。 [了解详情](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### Returns

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式响应和非流式响应对象具有相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示词生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成令牌的原因。该值为 `stop` 表示模型到达自然停止点或命中提供的停止序列，
      `length` 表示已达到请求中指定的最大令牌数，
      或者 `content_filter` 表示由于我们内容过滤器的标记而被省略了内容。

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

    此指纹表示模型运行所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解可能影响确定性的后端更改何时发生。

  - `usage: optional CompletionUsage`

    补全请求的使用情况统计信息。

    - `completion_tokens: number`

      生成的补全中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测词元。

      - `audio_tokens: optional number`

        模型生成的音频输入词元。

      - `reasoning_tokens: optional number`

        模型为推理生成的词元。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未在补全中出现的预测词元。不过，与
        推理词元一样，这些词元仍会计入用于计费、输出和上下文窗口
        限制的总补全词元数。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出词元。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的词元明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入词元。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示词元数。

      - `cached_tokens: optional number`

        提示中存在的已缓存词元。

      - `image_tokens: optional number`

        提示中存在的图像输入词元。

      - `text_tokens: optional number`

        提示中存在的文本输入词元。

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

### 无流式

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

## 域类型

### 完成

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式响应和非流式响应对象具有相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示词生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成令牌的原因。该值为 `stop` 表示模型到达自然停止点或命中提供的停止序列，
      `length` 表示已达到请求中指定的最大令牌数，
      或者 `content_filter` 表示由于我们内容过滤器的标记而被省略了内容。

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

    此指纹表示模型运行所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解可能影响确定性的后端更改何时发生。

  - `usage: optional CompletionUsage`

    补全请求的使用情况统计信息。

    - `completion_tokens: number`

      生成的补全中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测词元。

      - `audio_tokens: optional number`

        模型生成的音频输入词元。

      - `reasoning_tokens: optional number`

        模型为推理生成的词元。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未在补全中出现的预测词元。不过，与
        推理词元一样，这些词元仍会计入用于计费、输出和上下文窗口
        限制的总补全词元数。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出词元。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的词元明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入词元。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示词元数。

      - `cached_tokens: optional number`

        提示中存在的已缓存词元。

      - `image_tokens: optional number`

        提示中存在的图像输入词元。

      - `text_tokens: optional number`

        提示中存在的文本输入词元。

### 完成选项

- `CompletionChoice object { finish_reason, index, logprobs, text }`

  - `finish_reason: "stop" or "length" or "content_filter"`

    模型停止生成令牌的原因。该值为 `stop` 表示模型到达自然停止点或命中提供的停止序列，
    `length` 表示已达到请求中指定的最大令牌数，
    或者 `content_filter` 表示由于我们内容过滤器的标记而被省略了内容。

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

### 完成用量

- `CompletionUsage object { completion_tokens, prompt_tokens, total_tokens, 2 more }`

  补全请求的使用情况统计信息。

  - `completion_tokens: number`

    生成的补全中的令牌数。

  - `prompt_tokens: number`

    提示词中的令牌数。

  - `total_tokens: number`

    请求中使用的令牌总数（提示词 + 补全）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    补全中使用的令牌明细。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      出现在补全中的预测词元。

    - `audio_tokens: optional number`

      模型生成的音频输入词元。

    - `reasoning_tokens: optional number`

      模型为推理生成的词元。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未在补全中出现的预测词元。不过，与
      推理词元一样，这些词元仍会计入用于计费、输出和上下文窗口
      限制的总补全词元数。
      限制。

    - `text_tokens: optional number`

      模型生成的文本输出词元。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示中使用的词元明细。

    - `audio_tokens: optional number`

      提示中存在的音频输入词元。

    - `cache_write_tokens: optional number`

      写入缓存的未调整提示词元数。

    - `cached_tokens: optional number`

      提示中存在的已缓存词元。

    - `image_tokens: optional number`

      提示中存在的图像输入词元。

    - `text_tokens: optional number`

      提示中存在的文本输入词元。
