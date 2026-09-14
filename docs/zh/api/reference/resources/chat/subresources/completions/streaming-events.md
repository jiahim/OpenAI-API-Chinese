# Chat Completions 流式事件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 获取文档页面的 Markdown 版本。

实时流式调用 Chat Completions。使用服务端发送事件接收模型返回的补全分块
。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

<a id="chat.completion.chunk"></a>

## chat.completion.chunk

表示 chat completion 响应返回的流式分块
由模型根据所提供的输入生成。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

### Schema

Schema name: `CreateChatCompletionStreamResponse`

- `id: string`

  对话补全的唯一标识符。每个数据块具有相同的 ID。

- `choices: array of object { delta, finish_reason, index, logprobs }`

  对话补全选项列表。当 n `n` 大于 1 时可以包含多个元素。如果你设置了 stream: false
  最后一个数据块也可能为空。 `stream_options: {"include_usage": true}`.

  - `delta: object { content, function_call, refusal, 2 more }`

    由流式模型响应生成的对话补全增量。

    - `content: optional string or null`

      数据块消息的内容。

    - `function_call: optional object { arguments, name }`

      已弃用，由 tool_calls `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

      - `arguments: optional string`

        调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

      - `name: optional string`

        要调用的函数名称。

    - `refusal: optional string or null`

      模型生成的拒绝消息。

    - `role: optional "developer" or "system" or "user" or 2 more`

      此消息作者的角色。

      - `"developer"`

      - `"system"`

      - `"user"`

      - `"assistant"`

      - `"tool"`

    - `tool_calls: optional array of object { index, id, function, type }`

      - `index: number`

      - `id: optional string`

        工具调用的 ID。

      - `function: optional object { arguments, name }`

        - `arguments: optional string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: optional string`

          要调用的函数名称。

      - `type: optional "function"`

        工具的类型。目前，仅支持 function `function` 。

        - `"function"`

  - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

    模型停止生成 token 的原因。如果模型遇到自然停止点或提供了停止序列，该值将为 stop； `stop` 如果达到请求中指定的最大 token 数，该值将为 length；
    `length` 如果因内容过滤器标记而省略内容，该值将为 content_filter；
    `content_filter` 如果模型调用了工具，该值将为 tool_calls，
    `tool_calls` 或 function_call（已弃用）。 `function_call` (已弃用) 如果模型调用了函数。

    - `"stop"`

    - `"length"`

    - `"tool_calls"`

    - `"content_filter"`

    - `"function_call"`

  - `index: number`

    该选项在选项列表中的索引。

  - `logprobs: optional object { content, refusal }  or null`

    该选项的对数概率信息。

    - `content: array of ChatCompletionTokenLogprob or null`

      包含对数概率信息的消息内容 token 列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        一个整数列表，表示该 token 的 UTF-8 字节表示。当某个字符由多个 token 表示时，需要将它们的字节表示组合起来才能生成正确的文本表示。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率(如果它位于最可能的 20 个 token 之内)。否则,值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置处,最可能的 token 及其对数概率的列表。条目数量可能少于请求的 `top_logprobs`.

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。当某个字符由多个 token 表示时，需要将它们的字节表示组合起来才能生成正确的文本表示。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率(如果它位于最可能的 20 个 token 之内)。否则,值 `-9999.0` 用于表示该 token 出现的可能性极低。

    - `refusal: array of ChatCompletionTokenLogprob or null`

      包含对数概率信息的消息拒绝 token 列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        一个整数列表，表示该 token 的 UTF-8 字节表示。当某个字符由多个 token 表示时，需要将它们的字节表示组合起来才能生成正确的文本表示。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率(如果它位于最可能的 20 个 token 之内)。否则,值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置处,最可能的 token 及其对数概率的列表。条目数量可能少于请求的 `top_logprobs`.

- `created: number`

  创建该聊天补全时的 Unix 时间戳(以秒为单位)。每个分块具有相同的时间戳。

- `model: string`

  用于生成补全的模型。

- `object: "chat.completion.chunk"`

  对象类型,始终为 `chat.completion.chunk`.

  - `"chat.completion.chunk"`

- `moderation: optional object { input, output }  or null`

  请求输入和生成输出的审核结果。当请求了已审核补全时出现
  在审核分块上。

  - `input: object { model, results, type }  or object { code, message, type }`

    请求输入的审核结果。

    - `ModerationResults object { model, results, type }`

      请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          一个将审核类别映射到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的得分反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          一个将审核类别映射到得分的字典。

        - `flagged: boolean`

          一个布尔值，指示内容是否被任何类别标记。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，对于成功的审核结果始终为 `moderation_result` 。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型,始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型,始终为 `error`.

        - `"error"`

  - `output: object { model, results, type }  or object { code, message, type }`

    对生成输出的审核。

    - `ModerationResults object { model, results, type }`

      请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          一个将审核类别映射到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的得分反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          一个将审核类别映射到得分的字典。

        - `flagged: boolean`

          一个布尔值，指示内容是否被任何类别标记。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，对于成功的审核结果始终为 `moderation_result` 。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型,始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型,始终为 `error`.

        - `"error"`

- `obfuscation: optional string`

  添加的混淆字符串，用于将流式分块的大小归一化，作为针对某些侧信道攻击的缓解措施。该字段默认包含，在
  为
  时被省略。 `stream_options.include_obfuscation` is `false`.

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
  - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](https://developers.openai.com/api/docs/guides/flex-processing)'，那么该请求将使用 Flex Processing 服务层级进行处理。
  - 要在请求级别启用 [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) ，请为 Responses 或 Chat Completions 添加 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
  - 未设置时，默认行为为 'auto'。

  当设置了 `service_tier` 参数时，响应体将包含根据实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `system_fingerprint: optional string`

  此指纹表示模型运行所使用的后端配置。
  可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

- `usage: optional CompletionUsage or null`

  一个可选字段，仅当你在请求中设置了
  `stream_options: {"include_usage": true}` 时才会出现。如果出现，它
  包含一个空值， **除了最后一个数据块** 包含
  整个请求的 token 使用统计。

  **注意：** 如果流被中断或取消，你可能无法
  收到包含请求总 token 使用量的最终 usage 分片，
  即整个请求的 token 使用情况。

  - `completion_tokens: number`

    生成的 completion 中的 token 数。

  - `prompt_tokens: number`

    提示词中的 token 数。

  - `total_tokens: number`

    请求中使用的 token 总数（提示词 + completion）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    completion 中使用的 token 明细。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      出现在 completion 中的预测 token 数。

    - `audio_tokens: optional number`

      模型生成的音频输入 token 数。

    - `reasoning_tokens: optional number`

      模型为推理生成的 token 数。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未出现在 completion 中的预测 token 数。但是，与
      推理 token 一样，这些 token 仍计入总
      completion token 中，用于计费、输出和上下文窗口
      限制。

    - `text_tokens: optional number`

      模型生成的文本输出 token 数。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示词中使用的 token 明细。

    - `audio_tokens: optional number`

      提示词中包含的音频输入 token 数。

    - `cache_write_tokens: optional number`

      写入缓存的、未经过调整的提示 token 数量。

    - `cached_tokens: optional number`

      提示中已缓存的 token。

    - `image_tokens: optional number`

      提示中的图像输入 token。

    - `text_tokens: optional number`

      提示中的文本输入 token。

### 示例

```json
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}],"obfuscation":"r4N7vQ2m"}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}],"obfuscation":"p9K3xT6w"}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}],"obfuscation":""}
```
