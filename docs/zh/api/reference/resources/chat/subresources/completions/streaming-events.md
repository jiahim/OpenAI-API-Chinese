# Chat Completions 流式事件

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取相应页面的 Markdown 版本文档。

实时流式输出 Chat Completions。通过服务端发送事件，接收模型返回的补全分块。
通过服务端发送事件接收模型返回的补全分块。
[了解详情](https://developers.openai.com/api/docs/guides/streaming-responses).

<a id="chat.completion.chunk"></a>

## chat.completion.chunk

表示基于所提供的输入、由模型返回的聊天补全响应的流式分块
。
[了解详情](https://developers.openai.com/api/docs/guides/streaming-responses).

### Schema

Schema name: `CreateChatCompletionStreamResponse`

- `id: string`

  聊天补全的唯一标识符。每个分块具有相同的 ID。

- `choices: array of object { delta, index, finish_reason, logprobs }`

  聊天补全选择的列表。如果 `n` 大于 1，则可以包含多个元素。对于
  最后一个分块，如果你设置了 `stream_options: {"include_usage": true}`.

  - `delta: object { audio, content, function_call, 3 more }`

    由流式模型响应生成的聊天补全增量。
    流式音频可能以部分更新的形式到达，其中包含 ID、base64 数据，或
    转录文本。最终的音频更新仅包含其过期时间戳。

    - `audio: optional object { id, data, expires_at, transcript }`

      部分音频响应。音频分块可能包含 ID、base64 数据，或
      转录文本；最终的音频更新仅包含其过期时间戳。

      - `id: optional string`

        此音频响应的唯一标识符。

      - `data: optional string`

        由模型生成的 Base64 编码音频字节，格式为
        请求中指定的格式。

      - `expires_at: optional number`

        该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（以秒为单位）。
        不再可用于多轮对话的 Unix 时间戳（以秒为单位）。

      - `transcript: optional string`

        此音频分块的转录文本。

    - `content: optional string or null`

      分块消息的内容。

    - `function_call: optional object { arguments, name }`

      已弃用，已由 `tool_calls`。取代。模型生成的应被调用的函数的名称和参数。

      - `arguments: optional string`

        调用该函数所使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中验证这些参数。

      - `name: optional string`

        要调用的函数的名称。

    - `refusal: optional string or null`

      由模型生成的拒绝消息。

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

          调用该函数所使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中验证这些参数。

        - `name: optional string`

          要调用的函数的名称。

      - `type: optional "function"`

        工具的类型。目前，仅支持 `function` 。

        - `"function"`

  - `index: number`

    在选项列表中该选项的索引。

  - `finish_reason: optional "stop" or "length" or "tool_calls" or 2 more or null`

    模型停止生成 token 的原因。当模型遇到自然停止点或提供的停止序列时，将为 `stop` ；当达到请求中指定的最大 token 数时，将为，
    `length` ；当因内容过滤器标记而被省略内容时，将为，
    `content_filter` 。
    `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
    从最终音频更新中省略，仅包含 `delta.audio.expires_at`.

    - `"stop"`

    - `"length"`

    - `"tool_calls"`

    - `"content_filter"`

    - `"function_call"`

  - `logprobs: optional object { content, refusal }  or null`

    该选项的对数概率信息。

    - `content: array of ChatCompletionTokenLogprob or null`

      包含对数概率信息的消息内容 token 列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 tokens 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率，如果它位于概率最高的 20 个 tokens 之内。否则，值 `-9999.0` 用于表示该 token 极不可能出现。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于请求的 `top_logprobs`.

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 tokens 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率，如果它位于概率最高的 20 个 tokens 之内。否则，值 `-9999.0` 用于表示该 token 极不可能出现。

    - `refusal: array of ChatCompletionTokenLogprob or null`

      包含对数概率信息的消息拒绝 token 列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 tokens 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率，如果它位于概率最高的 20 个 tokens 之内。否则，值 `-9999.0` 用于表示该 token 极不可能出现。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于请求的 `top_logprobs`.

- `created: number`

  聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

- `model: string`

  用于生成补全的模型。

- `object: "chat.completion.chunk"`

  对象类型，始终为 `chat.completion.chunk`.

  - `"chat.completion.chunk"`

- `moderation: optional object { input, output }  or null`

  请求输入和生成输出的审核结果。当请求了带审核的补全时，
  出现在审核分块上。

  - `input: object { model, results, type }  or object { code, message, type }`

    针对请求输入的审核。

    - `ModerationResults object { model, results, type }`

      针对请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果的列表。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的得分反映了输入的哪些模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到得分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，过去始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误信息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

  - `output: object { model, results, type }  or object { code, message, type }`

    对所生成输出的审核。

    - `ModerationResults object { model, results, type }`

      针对请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果的列表。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的得分反映了输入的哪些模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到得分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，过去始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误信息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

- `obfuscation: optional string`

  用于将流式分块大小归一化的混淆字符串，添加作为
  对某些侧信道攻击的缓解措施。该字段默认包含，在以下情况下省略
  时省略 `stream_options.include_obfuscation` 用于 `false`.

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则该请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
  - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为 '[Flex 弹性处理](https://developers.openai.com/api/docs/guides/flex-processing)'，那么该请求将使用 Flex Processing 服务层级进行处理。
  - 要开启 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 在请求级别，请包含 `service_tier=fast` 或 `service_tier=priority` 参数用于 Responses 或 Chat Completions。响应将显示 `service_tier=priority` 无论你是否在请求中指定 `service_tier=fast` 或 `priority` 在你的请求中。
  - 未设置时，默认行为为 'auto'。

  当 `service_tier` 参数被设置时，响应体将根据实际用于处理该请求的处理模式包含相应的 `service_tier` 值。该响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `system_fingerprint: optional string`

  该指纹表示模型所运行的后端配置。
  可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

- `usage: optional CompletionUsage or null`

  一个可选字段，仅当你在请求中设置
  `stream_options: {"include_usage": true}` 时才会出现。当出现时，它
  包含一个 null 值 **，除了最后一个分块之外** ，其中包含整个请求的
  token 使用统计信息。

  **注意：** 如果流被中断或取消，你可能不会
  收到包含整个请求总 token 使用量的最终使用情况分块
  。

  - `completion_tokens: number`

    生成的补全中的 token 数。

  - `prompt_tokens: number`

    提示中的 token 数。

  - `total_tokens: number`

    请求中使用的 token 总数（提示 + 补全）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    补全中使用的 token 细分。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      在 completion 中出现的预测内容的 token 数。

    - `audio_tokens: optional number`

      模型生成的音频输入 token。

    - `reasoning_tokens: optional number`

      模型用于推理的 token。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未在 completion 中出现的预测内容。不过，与
      推理 token 一样，这些 token 仍会计入用于计费、
      输出和上下文窗口的 completion token
      总数限制。

    - `text_tokens: optional number`

      模型生成的文本输出 token。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    prompt 中所使用的 token 明细。

    - `audio_tokens: optional number`

      prompt 中存在的音频输入 token。

    - `cache_write_tokens: optional number`

      写入缓存的、未调整的 prompt token 数。

    - `cached_tokens: optional number`

      prompt 中存在的已缓存 token。

    - `image_tokens: optional number`

      prompt 中存在的图像输入 token。

    - `text_tokens: optional number`

      prompt 中存在的文本输入 token。

### 示例

```json
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}],"obfuscation":"r4N7vQ2m"}
```
