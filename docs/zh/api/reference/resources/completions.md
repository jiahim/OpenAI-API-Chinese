# 补全

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建补全

**post** `/completions`

根据提供的提示和参数创建完成内容。

返回一个完成对象；如果请求是流式的，则返回一系列完成对象。

### 请求体参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概览](/docs/models) 了解它们的描述。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概览](/docs/models) 了解它们的描述。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示，编码为字符串、字符串数组、令牌数组或令牌数组的数组。

  注意，<|endoftext|> 是模型在训练期间看到的文档分隔符，因此如果未指定提示，模型将像从新文档开头一样生成。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  生成 `best_of` 在服务端生成补全，并返回“最佳”（每个令牌对数概率最高的那个）。结果无法流式传输。

  与 `n`, `best_of` 一起使用时，控制候选补全的数量，而 `n` 指定返回多少个—— `best_of` 必须大于 `n`.

  **注意：** 由于此参数会生成大量补全，可能迅速消耗你的令牌配额。请谨慎使用，并确保为 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  在补全之外回显提示

- `frequency_penalty: optional number or null`

  -2.0 到 2.0 之间的数字。正值会根据新令牌在已有文本中的出现频率对其施加惩罚，降低模型逐字重复同一行的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `logit_bias: optional map[number] or null`

  修改指定令牌出现在补全中的可能性。

  接受一个 JSON 对象，该对象将令牌（由 GPT 分词器中的令牌 ID 指定）映射到从 -100 到 100 的关联偏置值。你可以使用此 [分词器工具](/tokenizer?view=bpe) 将文本转换为令牌 ID。从数学上讲，偏置会在采样前加到模型生成的 logits 上。具体效果因模型而异，但 -1 到 1 之间的值应会降低或增加被选中的可能性；-100 或 100 之类的值则应导致相应令牌被禁止或独占选中。

  例如，你可以传入 `{"50256": -100}` 以防止生成 <|endoftext|> 令牌。

- `logprobs: optional number or null`

  在 `logprobs` 上包含最可能的输出令牌的日志概率，以及所选令牌。例如，如果 `logprobs` 为 5，API 将返回最可能的 5 个令牌列表。API 总是会返回 `logprob` 采样令牌的，因此响应中最多可能有 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  可在补全中生成的最大 [令牌](/tokenizer) 数量。

  你的提示的令牌数加上 `max_tokens` 不能超过模型的上下文长度。 [示例 Python 代码](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 用于计数令牌。

- `n: optional number or null`

  为每个提示生成多少个补全。

  **注意：** 由于此参数会生成大量补全，可能迅速消耗你的令牌配额。请谨慎使用，并确保为 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据新标记是否出现在当前文本中对其进行惩罚，从而提高模型讨论新话题的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `seed: optional number or null`

  如已指定，我们的系统将尽力进行确定性采样，使具有相同 `seed` 和参数的重复请求应返回相同结果。

  不保证确定性，你应该参考 `system_fingerprint` 响应参数来监控后端的变化。

- `stop: optional string or array of string or null`

  不支持最新的推理模型 `o3` 和 `o4-mini`.

  最多 4 个序列，其中 API 将停止生成更多标记。
  返回的文本将不包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果设置，标记将以仅数据的 [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 形式发送，一旦可用即发送，流由 `data: [DONE]` 消息终止。 [示例 Python 代码](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅在你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    时才设置此项。为 true 时，将启用流混淆。流混淆会在
    流式增量事件的 `obfuscation` 字段中添加随机字符，以
    使负载大小标准化，作为缓解某些侧信道攻击的措施。
    这些混淆字段默认包含，但会给数据流增加少量
    开销。你可以将 `include_obfuscation` 设为
    如果你信任网络链路，可设为 false 以优化带宽，
    即你的应用程序与 OpenAI API 之间。

  - `include_usage: optional boolean`

    如果已设置，额外的数据块将在 `data: [DONE]`
    消息之前流式传输。该 `usage` 字段在此数据块中显示整个请求的令牌使用统计信息，
    并且 `choices` 字段将始终为空
    数组。

    所有其他数据块也将包含 `usage` 字段，但其值为 null
    。 **注意：** 如果流中断，你可能无法收到包含请求总令牌使用量的
    最终使用情况数据块。

- `suffix: optional string or null`

  插入文本完成后的后缀。

  此参数仅支持 `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  使用什么采样温度，范围在 0 到 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使输出更集中且更具确定性。

  我们通常建议调整此参数或 `top_p` 但不要同时调整两者。

- `top_p: optional number or null`

  这是另一种与温度采样不同的方法，称为核采样，模型考虑具有 top_p 概率质量的令牌结果。因此，0.1 表示仅考虑构成前 10% 概率质量的令牌。

  我们通常建议调整此参数或 `temperature` 但不要同时调整两者。

- `user: optional string`

  一个用于标识你的终端用户的唯一标识符，可帮助OpenAI监控和检测滥用行为。 [了解更多](/docs/guides/safety-best-practices#end-user-ids).

### 返回

- `Completion object { id, choices, created, 4 more }`

  表示来自API的补全响应。注意：流式和非流式响应对象具有相同的形状（与聊天端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选择列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供了停止序列，
      `length` 如果请求中指定的最大令牌数已达到，
      或者 `content_filter` 如果由于我们的内容过滤器标志而省略了内容。

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

    补全创建时的Unix时间戳（以秒为单位）。

  - `model: string`

    用于补全的模型。

  - `object: "text_completion"`

    对象类型，始终为"text_completion"

    - `"text_completion"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端更改可能影响确定性的时机。

  - `usage: optional CompletionUsage`

    补全请求的使用统计。

    - `completion_tokens: number`

      生成的补全中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示+补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，所需的令牌数
        出现在补全中的预测。

      - `audio_tokens: optional number`

        由模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        由模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，所需的令牌数
        未在补全中出现的预测。但与
        推理令牌一样，这些令牌仍然计入总
        补全令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        由模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示令牌数。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

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

### 无流式传输

```http
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_completion_model_id",
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
  "model": "VAR_completion_model_id",
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

### 流式传输

```http
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_completion_model_id",
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

  表示来自API的补全响应。注意：流式和非流式响应对象具有相同的形状（与聊天端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选择列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供了停止序列，
      `length` 如果请求中指定的最大令牌数已达到，
      或者 `content_filter` 如果由于我们的内容过滤器标志而省略了内容。

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

    补全创建时的Unix时间戳（以秒为单位）。

  - `model: string`

    用于补全的模型。

  - `object: "text_completion"`

    对象类型，始终为"text_completion"

    - `"text_completion"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端更改可能影响确定性的时机。

  - `usage: optional CompletionUsage`

    补全请求的使用统计。

    - `completion_tokens: number`

      生成的补全中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示+补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，所需的令牌数
        出现在补全中的预测。

      - `audio_tokens: optional number`

        由模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        由模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，所需的令牌数
        未在补全中出现的预测。但与
        推理令牌一样，这些令牌仍然计入总
        补全令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        由模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示令牌数。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

### 完成选择

- `CompletionChoice object { finish_reason, index, logprobs, text }`

  - `finish_reason: "stop" or "length" or "content_filter"`

    模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供了停止序列，
    `length` 如果请求中指定的最大令牌数已达到，
    或者 `content_filter` 如果由于我们的内容过滤器标志而省略了内容。

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

### 完成使用情况

- `CompletionUsage object { completion_tokens, prompt_tokens, total_tokens, 2 more }`

  补全请求的使用统计。

  - `completion_tokens: number`

    生成的补全中的令牌数。

  - `prompt_tokens: number`

    提示中的令牌数。

  - `total_tokens: number`

    请求中使用的令牌总数（提示+补全）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    补全中使用的令牌明细。

    - `accepted_prediction_tokens: optional number`

      使用预测输出时，所需的令牌数
      出现在补全中的预测。

    - `audio_tokens: optional number`

      由模型生成的音频输入令牌。

    - `reasoning_tokens: optional number`

      由模型为推理生成的令牌。

    - `rejected_prediction_tokens: optional number`

      使用预测输出时，所需的令牌数
      未在补全中出现的预测。但与
      推理令牌一样，这些令牌仍然计入总
      补全令牌，用于计费、输出和上下文窗口
      限制。

    - `text_tokens: optional number`

      由模型生成的文本输出令牌。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示中使用的令牌明细。

    - `audio_tokens: optional number`

      提示中存在的音频输入令牌。

    - `cache_write_tokens: optional number`

      写入缓存的未调整提示令牌数。

    - `cached_tokens: optional number`

      提示中存在的缓存令牌。

    - `image_tokens: optional number`

      提示中存在的图像输入令牌。

    - `text_tokens: optional number`

      提示中存在的文本输入令牌。
