> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 获取聊天补全

**获取** `/chat/completions/{completion_id}`

获取已存储的聊天补全。仅返回已创建
时将 `store` 参数设置为 `true` 的聊天补全。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项列表中的选项索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它在最可能的 20 个令牌之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置上，最可能的 token 及其对数概率列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它在最可能的 20 个令牌之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它在最可能的 20 个令牌之内。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置上，最可能的 token 及其对数概率列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        由模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
        [网页搜索工具时](/docs/guides/tools-web-search?api-mode=chat).

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

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        模型音频响应的相关数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          在请求中指定。

        - `expires_at: number`

          此音频响应的 Unix 时间戳（以秒为单位），用于指定该响应将
          在服务器上不再可访问，以便用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并由 `tool_calls`。替代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的、用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能会虚构出你的函数模式未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          由模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的、用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能会虚构出你的函数模式未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          由模型创建的自定义工具调用。

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

    可附加到对象的 16 个键值对集合。这可用于
    以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了经过审核的补全，则提供请求输入和生成输出的审核结果。
    提供了审核补全请求。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            产生此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于成功的审核结果。

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

      对生成的输出进行审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            产生此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于成功的审核结果。

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

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则将使用项目设置中配置的服务层级来处理请求。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则将使用所选模型的标准定价和性能来处理请求。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则将使用 Flex Processing 服务层级来处理请求。
    - 要选择 [快速模式](/api/docs/guides/fast-mode) 在请求级别，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` 无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包含 `service_tier` 基于实际用于处理请求的处理模式的值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时进行了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成中的令牌数量。

    - `prompt_tokens: number`

      提示中的令牌数量。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成中使用的令牌的细分。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成中的预测的令牌数量。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成中的预测。但是，与
        推理令牌一样，这些令牌仍计入总
        完成令牌中，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌的细分。

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
  "model": "gpt-4o-2024-08-06",
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
