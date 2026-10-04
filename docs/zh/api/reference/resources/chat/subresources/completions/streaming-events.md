# Chat Completions 流式事件

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

实时流式聊天补全。通过服务端发送事件接收模型返回的补全分块。
返回的分块。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

<a id="chat.completion.chunk"></a>

## chat.completion.chunk

表示根据所提供的输入由模型返回的聊天补全响应的流式分块
。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

### Schema

Schema 名称： `CreateChatCompletionStreamResponse`

- `id: string`

  聊天补全的唯一标识符。每个分块具有相同的 ID。

- `choices: array of object { delta, finish_reason, index, logprobs }`

  聊天补全选项列表。如果 `n` 大于 1，则可以包含多个元素。如果设置为
  ，最后一个分块也可以为空。 `stream_options: {"include_usage": true}`.

  - `delta: object { content, function_call, refusal, 2 more }`

    由流式模型响应生成的聊天补全增量。
    流式音频可能以包含 ID、base64 数据或
    转录文本的部分更新形式到达。最终的音频更新仅包含其过期时间戳。

    - `content: optional string or null`

      分块消息的内容。

    - `function_call: optional object { arguments, name }`

      已弃用，由 `tool_calls`。替代。应被调用的函数的名称和参数，由模型生成。

      - `arguments: optional string`

        用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能产生未在你的函数 schema 中定义的参数。在调用函数之前，请在代码中验证这些参数。

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

          用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能产生未在你的函数 schema 中定义的参数。在调用函数之前，请在代码中验证这些参数。

        - `name: optional string`

          要调用的函数的名称。

      - `type: optional "function"`

        工具的类型。目前，仅支持 `function` 。

        - `"function"`

  - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

    模型停止生成 token 的原因。如果模型遇到自然停止点或提供了停止序列，则为 `stop` ；如果达到了请求中指定的最大 token 数，则为，
    `length` 。
    `content_filter` 如果内容因我们的内容过滤器的标记而被省略，
    `tool_calls` 如果模型调用了工具，或者 `function_call` （已弃用）如果模型调用了函数。
    从最终音频更新中省略，其中仅包含 `delta.audio.expires_at`.

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

      包含消息内容 token 及其对数概率信息的列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        此 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在此 token 位置上最可能的 token 及其对数概率的列表。条目数可能少于请求的 `top_logprobs`.

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          此 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

    - `refusal: array of ChatCompletionTokenLogprob or null`

      包含消息拒绝 token 及其对数概率信息的列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        此 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在此 token 位置上最可能的 token 及其对数概率的列表。条目数可能少于请求的 `top_logprobs`.

- `created: number`

  聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

- `model: string`

  用于生成补全的模型。

- `object: "chat.completion.chunk"`

  对象类型，始终为 `chat.completion.chunk`.

  - `"chat.completion.chunk"`

- `moderation: optional object { input, output }  or null`

  请求输入和生成输出的审核结果。当请求经过审核的补全时出现
  于审核分块中。

  - `input: object { model, results, type }  or object { code, message, type }`

    请求输入的审核结果。

    - `ModerationResults object { model, results, type }`

      针对请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          审核类别到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试进行审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

  - `output: object { model, results, type }  or object { code, message, type }`

    对生成内容的审核结果。

    - `ModerationResults object { model, results, type }`

      针对请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          审核类别到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试进行审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

- `obfuscation: optional string`

  添加的混淆字符串，用于将流式分块的大小标准化，以此缓解
  某些侧信道攻击。该字段默认包含，当
  为 `stream_options.include_obfuscation` 时省略 `false`.

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则该请求将使用项目设置中配置的服务层级进行处理。除非另行配置，项目将使用 'default'。
  - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](https://developers.openai.com/api/docs/guides/flex-processing)'，则请求将通过 Flex Processing 服务层级进行处理。
  - 若要在请求级别启用 [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入对应的 `service_tier=fast` 参数或 `service_tier=priority` 参数。响应中将显示 service_tier `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` 参数或 `priority` 。
  - 当未设置时，默认行为为 'auto'。

  当设置 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式返回对应的 service_tier 值。该响应值可能与参数中设置的值不同。 `service_tier` 值。此响应值可能与该参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `system_fingerprint: optional string`

  该指纹表示模型运行所使用的基础配置。
  可与 `seed` 请求参数配合使用，以了解何时发生了可能影响确定性的后端更改。

- `usage: optional CompletionUsage or null`

  这是一个可选字段，仅当你在请求中设置
  `stream_options: {"include_usage": true}` 时才会出现。如果存在，它
  包含一个 null 值 **除了最后一个分块** 其中包含
  整个请求的 token 使用情况统计。

  **注意：** 如果流被中断或取消，你可能不会
  接收到包含请求总 token 使用量的最终使用情况分块，
  请求。

  - `completion_tokens: number`

    生成补全内容中的 token 数。

  - `prompt_tokens: number`

    提示中的 token 数。

  - `total_tokens: number`

    请求中使用的 token 总数（提示 + 完成）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    完成中使用的 token 明细。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      出现在完成中的预测 token 数。

    - `audio_tokens: optional number`

      模型生成的音频输入 token。

    - `reasoning_tokens: optional number`

      模型为推理生成的 token。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，
      未出现在完成中的预测 token。但是，与
      推理 token 一样，这些 token 仍计入用于计费、
      输出和上下文窗口的完成 token
      限制中。

    - `text_tokens: optional number`

      模型生成的文本输出 token。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    提示词中使用的 token 明细。

    - `audio_tokens: optional number`

      提示词中存在的音频输入 token。

    - `cache_write_tokens: optional number`

      写入缓存的、未经过调整的提示词 token 数量。

    - `cached_tokens: optional number`

      提示词中存在的已缓存 token。

    - `image_tokens: optional number`

      提示词中存在的图像输入 token。

    - `text_tokens: optional number`

      提示词中存在的文本输入 token。

### 示例

```json
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}],"obfuscation":"r4N7vQ2m"}
```
