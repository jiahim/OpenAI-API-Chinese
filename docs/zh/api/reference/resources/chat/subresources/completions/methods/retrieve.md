> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后面追加 `.md` 即可获取该页面的 Markdown 版本。

## 获取聊天补全

**get** `/chat/completions/{completion_id}`

获取已存储的 Chat Completions。仅返回已使用
参数创建的 `store` 参数设置为 `true` 的 Chat Completions。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据所提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可能包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值将为 `stop` （如果模型遇到自然停止点或提供了停止序列），
      `length` （如果达到了请求中指定的最大 token 数），
      `content_filter` （如果由于内容过滤器的标记而省略了内容），
      `tool_calls` （如果模型调用了工具），或 `function_call` （已废弃，如果模型调用了函数）。
      请参阅 [模型规范](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的场景中很有用。如果该 token 没有字节表示，则可以为 `null` 。

        - `logprob: number`

          此 token 的对数概率（如果它位于最可能的 20 个 token 之内）。否则，值 `-9999.0` 用于表示该令牌极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          该令牌位置最可能的令牌及其对数概率列表。条目的数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的场景中很有用。如果该 token 没有字节表示，则可以为 `null` 。

          - `logprob: number`

            此 token 的对数概率（如果它位于最可能的 20 个 token 之内）。否则，值 `-9999.0` 用于表示该令牌极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝令牌列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。在字符由多个 token 表示且必须组合其字节表示以生成正确文本表示的场景中很有用。如果该 token 没有字节表示，则可以为 `null` 。

        - `logprob: number`

          此 token 的对数概率（如果它位于最可能的 20 个 token 之内）。否则，值 `-9999.0` 用于表示该令牌极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          该令牌位置最可能的令牌及其对数概率列表。条目的数量可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的一次聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        适用于消息的注释，例如使用
        [网页搜索工具](/docs/guides/tools-web-search?api-mode=chat).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求音频输出模态，则此对象包含
        模型音频响应的相关数据。 [了解详情](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定。

        - `expires_at: number`

          Unix 时间戳（以秒为单位），表示该音频响应在多轮对话中将
          无法再从服务端访问的时间点。
          不再可访问的时间。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数所使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，也可能会编造你函数 schema 中未定义的参数。在调用函数之前，请务必在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数所使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，也可能会编造你函数 schema 中未定义的参数。在调用函数之前，请务必在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了
    审核补全）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 表示成功的内容审核结果。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试内容审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 表示成功的内容审核结果。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试内容审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则将使用项目设置中配置的服务层级来处理请求。除非另行配置，项目将使用 'default'。
    - 如果设置为 'default'，则将使用所选模型的标准定价和性能来处理请求。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则将使用 Flex Processing 服务层级来处理请求。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=priority` 。 `service_tier=fast` 参数。响应中将显示 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数已设置时，响应体将包含根据实际用于处理该请求的处理模式得出的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    补全请求的使用情况统计。

    - `completion_tokens: number`

      生成的补全内容中的 token 数。

    - `prompt_tokens: number`

      提示中的 token 数。

    - `total_tokens: number`

      该请求使用的总 token 数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在补全内容中的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中未出现在补全内容中的 token 数。但是，与
        推理 token 一样，这些 token 仍计入计费、输出和上下文窗口的
        总补全 token 数中，用于
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `compute_units: optional number or null`

      该请求的计算单元。目前可用时为 null。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示词 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

### 示例

```http
curl https://api.openai.com/v1/chat/completions/$COMPLETION_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
        "content": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ],
        "refusal": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ]
      },
      "message": {
        "content": "content",
        "refusal": "refusal",
        "role": "assistant",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "end_index": 0,
              "start_index": 0,
              "title": "title",
              "url": "https://example.com"
            }
          }
        ],
        "audio": {
          "id": "id",
          "data": "data",
          "expires_at": 0,
          "transcript": "transcript"
        },
        "function_call": {
          "arguments": "arguments",
          "name": "name"
        },
        "tool_calls": [
          {
            "id": "id",
            "function": {
              "arguments": "arguments",
              "name": "name"
            },
            "type": "function"
          }
        ]
      }
    }
  ],
  "created": 0,
  "model": "model",
  "object": "chat.completion",
  "metadata": {
    "foo": "string"
  },
  "moderation": {
    "input": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    },
    "output": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    }
  },
  "service_tier": "auto",
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

### 示例

```http
curl https://api.openai.com/v1/chat/completions/chatcmpl-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "chat.completion",
  "id": "chatcmpl-abc123",
  "model": "gpt-5.6-sol",
  "created": 1738960610,
  "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
  "tool_choice": null,
  "usage": {
    "total_tokens": 31,
    "completion_tokens": 18,
    "prompt_tokens": 13
  },
  "seed": 4944116822809979520,
  "top_p": 1.0,
  "temperature": 1.0,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0,
  "system_fingerprint": "fp_50cad350e4",
  "input_user": null,
  "service_tier": "default",
  "tools": null,
  "metadata": {},
  "choices": [
    {
      "index": 0,
      "message": {
        "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
        "role": "assistant",
        "tool_calls": null,
        "function_call": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ],
  "response_format": null
}
```
