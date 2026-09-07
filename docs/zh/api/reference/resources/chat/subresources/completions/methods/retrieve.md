> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## 获取聊天补全

**get** `/chat/completions/{completion_id}`

获取已存储的聊天补全。只能获取通过
参数设置为 `store` 参数设置为 `true` 而创建的聊天补全。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可能有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该原因将 `stop` 如果模型到达了自然停止点或遇到提供的停止序列，
      `length` 如果达到了请求中指定的 token 上限数量，
      `content_filter` 如果内容因我们的内容过滤标记而被省略，
      `tool_calls` 如果模型调用了工具，或者 `function_call` （已弃用）如果模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解详情。

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

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在某些字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率列表。返回的条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在某些字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息的 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在某些字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` 如果该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率，如果它位于最可能的 20 个 token 之内。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率列表。返回的条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下，消息的注解，例如在使用
        [网页搜索工具时](/docs/guides/tools-web-search?api-mode=chat).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用 网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频响应的
        相关数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          在请求中指定。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮对话的 Unix 时间戳（以秒为单位）。
          在服务端不再可用于多轮对话的 Unix 时间戳（以秒为单位）。
          对话的 Unix 时间戳（以秒为单位）。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由以下字段替代 `tool_calls`。应调用的函数名称和参数，由模型生成。

        - `arguments: string`

          用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，也可能会生成你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，也可能会生成你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前仅支持 `function` 受支持。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

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

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过
    API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求
    了经审核的补全）。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，若输入被标记为属于该类别，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的评分所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到评分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 表示成功的审核结果。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      针对生成内容的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，若输入被标记为属于该类别，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的评分所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到评分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 表示成功的审核结果。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务等级。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务等级进行处理。除非另行配置，项目将使用 'default'。
    - 如果设置为 'default'，则请求将按所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务等级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=priority` 。 `service_tier=fast` 参数。响应中将显示 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数已设置时，响应体中将包含根据实际用于处理该请求的处理模式得出的 `service_tier` 值。此响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用的前后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成的补全中的令牌数量。

    - `prompt_tokens: number`

      提示中的令牌数量。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的令牌细分。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在补全里的令牌数量。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中未出现在补全里的令牌。但是，与
        推理令牌一样，这些令牌仍会计入用于计费、输出和上下文窗口限制的
        补全令牌总数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌细分。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

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
  "model": "gpt-6-astra",
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
