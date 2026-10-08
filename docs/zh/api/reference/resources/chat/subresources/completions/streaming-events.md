# Chat Completions 流式事件

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 后追加 `.md` 以获取文档页面的 Markdown 版本。

以流式方式实时获取 Chat Completions。接收模型返回的补全分块
，并通过服务器发送事件传输。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

<a id="chat.completion.chunk"></a>

## chat.completion.chunk

表示模型根据所提供的输入返回的聊天完成响应的流式分块
。
[了解更多](https://developers.openai.com/api/docs/guides/streaming-responses).

### 架构

Schema name: `CreateChatCompletionStreamResponse`

- `id: string`

  聊天补全的唯一标识符。每个分块的 ID 相同。

- `choices: array of object { delta, index, finish_reason, logprobs }`

  聊天补全选项列表。如果 `n` 大于 1，则可以包含多个元素。对于
  最后一个分块也可以为空，如果你设置了 `stream_options: {"include_usage": true}`.

  - `delta: object { audio, content, function_call, 3 more }`

    由流式模型响应生成的聊天补全增量。
    流式音频可能以部分更新的形式到达，其中包含 ID、base64 数据或
    转录文本。最后一次音频更新仅包含其过期时间戳。

    - `audio: optional object { id, data, expires_at, transcript }`

      部分音频响应。音频分块可能包含 ID、base64 数据或
      转录文本；最后一次音频更新仅包含其过期时间戳。

      - `id: optional string`

        此音频响应的唯一标识符。

      - `data: optional string`

        模型生成的 base64 编码音频字节，采用以下格式
        在请求中指定。

      - `expires_at: optional number`

        此音频响应在服务器上无法再访问的 Unix 时间戳（秒），
        之后将无法再用于多轮对话。

      - `transcript: optional string`

        此音频分块的转录文本。

    - `content: optional string or null`

      分块消息的内容。

    - `function_call: optional object { arguments, name }`

      已弃用，由以下内容替代： `tool_calls`。由模型生成的、应调用的函数名称和参数。

      - `arguments: optional string`

        调用函数所需的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，可能会产生函数架构中未定义的参数。调用函数前，请在代码中验证这些参数。

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

          调用函数所需的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，可能会产生函数架构中未定义的参数。调用函数前，请在代码中验证这些参数。

        - `name: optional string`

          要调用的函数名称。

      - `type: optional "function"`

        工具的类型。目前仅支持 `function` 。

        - `"function"`

  - `index: number`

    选项列表中该选项的索引。

  - `finish_reason: optional "stop" or "length" or "tool_calls" or 2 more or null`

    模型停止生成 token 的原因。当模型遇到自然停止点或 `stop` 提供的停止序列时，原因将为 stop；
    `length` 当达到请求中指定的最大 token 数时，原因将为 length；
    `content_filter` 当内容因我们的内容过滤器标记而被省略时，原因将为 content_filter。
    `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
    在最终音频更新中省略，仅包含 `delta.audio.expires_at`.

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

        一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示、必须合并其字节表示才能生成正确文本表示的场合中非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率（如果它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置上最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示、必须合并其字节表示才能生成正确文本表示的场合中非常有用。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（如果它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

    - `refusal: array of ChatCompletionTokenLogprob or null`

      包含对数概率信息的消息拒绝 token 列表。

      - `token: string`

        该 token。

      - `bytes: array of number or null`

        一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示、必须合并其字节表示才能生成正确文本表示的场合中非常有用。可以为 `null` 如果该 token 没有字节表示。

      - `logprob: number`

        该 token 的对数概率（如果它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `top_logprobs: array of object { token, bytes, logprob }`

        在该 token 位置上最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

- `created: number`

  聊天补全创建时的 Unix 时间戳（以秒为单位）。每个块具有相同的时间戳。

- `model: string`

  用于生成补全的模型。

- `object: "chat.completion.chunk"`

  对象类型，始终为 `chat.completion.chunk`.

  - `"chat.completion.chunk"`

- `moderation: optional object { input, output }  or null`

  请求输入和生成输出的内容审核结果。在请求了经过审核的补全时，
  出现在审核块中。

  - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

    对请求输入的审核。

    - `ModerationResults object { model, results, type }`

      请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          反映每个类别得分的输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到得分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，曾始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试进行内容审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

  - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

    对生成输出的审核。

    - `ModerationResults object { model, results, type }`

      请求输入或生成输出的成功审核结果。

      - `model: string`

        用于生成结果的审核模型。

      - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

        审核结果列表。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          反映每个类别得分的输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到得分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，曾始终为 `moderation_result` ，表示成功的审核结果。

          - `"moderation_result"`

      - `type: "moderation_results"`

        对象类型，始终为 `moderation_results`.

        - `"moderation_results"`

    - `Error object { code, message, type }`

      尝试进行内容审核时产生的错误。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

      - `type: "error"`

        对象类型，始终为 `error`.

        - `"error"`

- `obfuscation: optional string`

  添加的混淆字符串，用于规范化流式数据块的大小，作为针对某些侧信道攻击的
  缓解措施。默认包含此字段，但在以下情况下省略：
  默认包含，并在以下情况下省略： `stream_options.include_obfuscation` 为 `false`.

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理请求的处理类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，项目将使用 'default'。
  - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](https://developers.openai.com/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
  - 如需启用 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) ，请在请求层面包含 Responses 或 Chat Completions 的 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在请求中。
  - 未设置时，默认行为为 'auto'。

  当设置 `service_tier` 参数时，响应体将根据实际用于处理该请求的处理模式返回对应的 `service_tier` 值。该响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `system_fingerprint: optional string`

  此指纹表示模型运行所使用后端配置的特征值。
  可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

- `usage: optional CompletionUsage or null`

  一个可选字段，仅当你在请求中设置
  `stream_options: {"include_usage": true}` 时才会出现。出现时，它
  包含一个 null 值 **，最后一个分块除外，该分块包含** 整个请求的
  词元用量统计信息。

  **注意：** 如果流被中断或取消，你可能不会
  收到包含
  总词元用量的最后一个用量分块。

  - `completion_tokens: number`

    生成的补全中所使用的词元数量。

  - `prompt_tokens: number`

    提示中所使用的词元数量。

  - `total_tokens: number`

    请求中使用的词元总数（提示 + 补全）。

  - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

    补全中所使用词元的明细。

    - `accepted_prediction_tokens: optional number`

      使用 Predicted Outputs 时，completion 中出现的
      prediction 的 token 数量。

    - `audio_tokens: optional number`

      模型生成的音频输入 token。

    - `reasoning_tokens: optional number`

      模型生成的用于推理的 token。

    - `rejected_prediction_tokens: optional number`

      使用 Predicted Outputs 时，completion 中出现的
      prediction 中未出现在 completion 中的部分。但是，与
      推理 token 一样，这些 token 仍会计入总
      completion token，用于计费、输出和上下文窗口
      限制。

    - `text_tokens: optional number`

      模型生成的文本输出 token。

  - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

    prompt 中使用的 token 明细。

    - `audio_tokens: optional number`

      prompt 中存在的音频输入 token。

    - `cache_write_tokens: optional number`

      写入缓存的未调整的 prompt token 数量。

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
