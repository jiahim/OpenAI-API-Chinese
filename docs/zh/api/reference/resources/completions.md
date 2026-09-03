# Completions

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 创建补全

**post** `/completions`

根据提供的提示和参数创建补全。

返回一个补全对象，如果请求为流式传输，则返回一个补全对象序列。

### 请求体参数

- `model: string or "gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

  要使用的模型 ID。你可以前往 [模型列表](/docs/api-reference/models/list) API 查看所有可用模型,也可以参阅 [模型概述](/docs/models) 了解相关描述。

  - `string`

  - `"gpt-3.5-turbo-instruct" or "davinci-002" or "babbage-002"`

    要使用的模型 ID。你可以前往 [模型列表](/docs/api-reference/models/list) API 查看所有可用模型,也可以参阅 [模型概述](/docs/models) 了解相关描述。

    - `"gpt-3.5-turbo-instruct"`

    - `"davinci-002"`

    - `"babbage-002"`

- `prompt: string or array of string or array of number or array of array of number or null`

  用于生成补全的提示,可以编码为字符串、字符串数组、token 数组或 token 数组的数组。

  注意 <|endoftext|> 是模型在训练过程中看到的文档分隔符,因此如果未指定提示,模型将像从一篇新文档的开头一样继续生成。

  - `string`

  - `array of string`

  - `array of number`

  - `array of array of number`

- `best_of: optional number or null`

  在服务端生成 `best_of` 多个补全,并返回“最佳”的那一个(即每个 token 具有最高对数概率的那个)。结果无法以流式方式返回。

  当与 `n`, `best_of` 配合使用时,用于控制候选补全的数量,而 `n` 用于指定返回多少个—— `best_of` 必须大于 `n`.

  **注意:** 由于该参数会生成大量补全,因此可能会迅速消耗你的 token 配额。请谨慎使用,并确保为 `max_tokens` 和 `stop`.

- `echo: optional boolean or null`

  除了补全内容外,回显输入的提示

- `frequency_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新 token 在文本中已出现的频率对其进行惩罚,从而降低模型逐字重复相同内容的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `logit_bias: optional map[number] or null`

  修改指定 token 出现在补全中的可能性。

  接受一个 JSON 对象，将 token（按其在 GPT 分词器中的 token ID 指定）映射到 -100 到 100 之间的关联偏置值。你可以使用该 [分词器工具](/tokenizer?view=bpe) 将文本转换为 token ID。从数学上讲，该偏置会在模型采样前加到模型生成的 logits 上。确切效果会因模型而异，但 -1 到 1 之间的值会降低或提高被选中的可能性；像 -100 或 100 这样的值则会导致相关 token 被禁止或被唯一选中。

  例如，你可以传入 `{"50256": -100}` 来阻止生成该 token。

- `logprobs: optional number or null`

  在 `logprobs` 最可能的输出 token 上包含对数概率，以及所选 token 的对数概率。例如，如果 `logprobs` 为 5，API 将返回最可能的 5 个 token 的列表。API 将始终返回所采样 token 的 `logprob` ，因此响应中最多可有 `logprobs+1` 个元素。

  的最大值为 `logprobs` 5。

- `max_tokens: optional number or null`

  可在补全中生成的最大 [token](/tokenizer) 数。

  你的提示的 token 数加上 `max_tokens` 不能超过模型的上下文长度。 [用于统计 token 的 Python 示例代码](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 。

- `n: optional number or null`

  每个提示要生成多少个补全。

  **注意:** 由于该参数会生成大量补全,因此可能会迅速消耗你的 token 配额。请谨慎使用,并确保为 `max_tokens` 和 `stop`.

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据新词元是否已出现在文本中对其进行惩罚，从而增加模型谈论新主题的可能性。

  [查看有关频率和存在惩罚的更多信息。](/docs/guides/text-generation)

- `seed: optional number or null`

  如果指定，我们的系统将尽最大努力进行确定性采样，使得使用相同的 `seed` 和参数的重复请求返回相同的结果。

  确定性无法保证，你可以参考 `system_fingerprint` response 参数以监控后端的变化。

- `stop: optional string or array of string or null`

  最新的推理模型不支持此功能 `o3` 和 `o4-mini`.

  最多 4 个 API 将停止生成更多词元的序列。
  返回的文本不会包含停止序列。

  - `string`

  - `array of string`

- `stream: optional boolean or null`

  是否流式返回部分进度。如果设置，词元将以仅含数据的 [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) 的形式在可用时发送，流由一个 `data: [DONE]` message 终止。 [用于统计 token 的 Python 示例代码](https://cookbook.openai.com/examples/how_to_stream_completions).

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当你在设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时才设置此参数。开启后，流混淆将启用。流混淆会向
    流式增量事件上的某个字段添加 `obfuscation` 随机字符，以规范化
    负载大小，作为对某些侧信道攻击的缓解措施。
    默认会包含这些混淆字段，但会给数据流带来少量
    开销。你可以将 `include_obfuscation` 设置为
    如果信任应用程序之间的网络链路，可将其设为 false 以优化带宽
    应用程序与 OpenAI API 之间。

  - `include_usage: optional boolean`

    如果设置此项，将会在消息之前流式传输一个额外的分块 `data: [DONE]`
    。该 `usage` 字段会显示令牌使用情况统计信息
    ，涵盖整个请求，而 `choices` 字段将始终为空
    数组。

    所有其他分块也会包含一个 `usage` 字段，但该字段为 null
    值。 **注意：** 如果流式传输中断，你可能无法收到包含整个请求令牌使用总量的
    最终使用情况分块。

- `suffix: optional string or null`

  插入文本完成后出现的后缀。

  此参数仅支持 `gpt-3.5-turbo-instruct`.

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使输出更集中、更确定。

  通常建议修改此项或 `top_p` ，但不要同时修改两者。

- `top_p: optional number or null`

  一种称为核采样的温度采样替代方法，模型会考虑概率质量排名前 top_p 的令牌结果。因此，0.1 表示仅考虑组成概率质量前 10% 的令牌。

  通常建议修改此项或 `temperature` ，但不要同时修改两者。

- `user: optional string`

  用于表示你最终用户的唯一标识符，可帮助 OpenAI 监控并检测滥用行为。 [了解更多](/docs/guides/safety-best-practices#end-user-ids).

### Returns

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式和非流式响应对象共享相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值将是 `stop` 如果模型遇到了自然停止点或提供的停止序列，
      `length` 如果达到了请求中指定的最大 token 数，
      或者 `content_filter` 如果由于我们内容过滤器的标记导致内容被省略。

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

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

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

        使用 Predicted Outputs 时，
        出现在补全中的预测。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测。但是，与
        推理 token 一样，这些 token 仍然计入用于
        计费、输出和上下文窗口的总补全 token 数中
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中出现的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示 token 数量。

      - `cached_tokens: optional number`

        提示中出现的已缓存 token。

      - `image_tokens: optional number`

        提示中出现的图像输入 token。

      - `text_tokens: optional number`

        提示中出现的文本输入 token。

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

### Completion

- `Completion object { id, choices, created, 4 more }`

  表示来自 API 的补全响应。注意：流式和非流式响应对象共享相同的结构（与 chat 端点不同）。

  - `id: string`

    补全的唯一标识符。

  - `choices: array of CompletionChoice`

    模型为输入提示生成的补全选项列表。

    - `finish_reason: "stop" or "length" or "content_filter"`

      模型停止生成 token 的原因。该值将是 `stop` 如果模型遇到了自然停止点或提供的停止序列，
      `length` 如果达到了请求中指定的最大 token 数，
      或者 `content_filter` 如果由于我们内容过滤器的标记导致内容被省略。

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

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

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

        使用 Predicted Outputs 时，
        出现在补全中的预测。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测。但是，与
        推理 token 一样，这些 token 仍然计入用于
        计费、输出和上下文窗口的总补全 token 数中
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中出现的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示 token 数量。

      - `cached_tokens: optional number`

        提示中出现的已缓存 token。

      - `image_tokens: optional number`

        提示中出现的图像输入 token。

      - `text_tokens: optional number`

        提示中出现的文本输入 token。

### Completion Choice

- `CompletionChoice object { finish_reason, index, logprobs, text }`

  - `finish_reason: "stop" or "length" or "content_filter"`

    模型停止生成 token 的原因。该值将是 `stop` 如果模型遇到了自然停止点或提供的停止序列，
    `length` 如果达到了请求中指定的最大 token 数，
    或者 `content_filter` 如果由于我们内容过滤器的标记导致内容被省略。

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

- `CompletionUsage object { completion_tokens, prompt_tokens, total_tokens, 2 more }`

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

      使用 Predicted Outputs 时，
      出现在补全中的预测。

    - `audio_tokens: optional number`

      模型生成的音频输入 token。

    - `reasoning_tokens: optional number`

      模型为推理生成的 token。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未出现在补全中的预测。但是，与
      推理 token 一样，这些 token 仍然计入用于
      计费、输出和上下文窗口的总补全 token 数中
      限制。

    - `text_tokens: optional number`

      模型生成的文本输出 token。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示中使用的 token 明细。

    - `audio_tokens: optional number`

      提示中出现的音频输入 token。

    - `cache_write_tokens: optional number`

      写入缓存的未经调整的提示 token 数量。

    - `cached_tokens: optional number`

      提示中出现的已缓存 token。

    - `image_tokens: optional number`

      提示中出现的图像输入 token。

    - `text_tokens: optional number`

      提示中出现的文本输入 token。
