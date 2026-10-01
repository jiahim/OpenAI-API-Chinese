> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 即可。

## 获取聊天补全

**get** `/chat/completions/{completion_id}`

获取已存储的 Chat Completions。仅返回使用
参数创建的 `store` 参数设置为 `true` 的 Chat Completions。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可能包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值可能为 `stop` （如果模型遇到自然停止点或提供的停止序列）、
      `length` （如果达到了请求中指定的 token 上限）、
      `content_filter` （如果因内容过滤器标记而省略了内容）、
      `tool_calls` （如果模型调用了工具）或 `function_call` （已废弃，如果模型调用了函数）。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          一个整数列表，表示该 token 的 UTF-8 字节表示。当字符由多个 token 表示并且必须组合它们的字节表示才能生成正确的文本表示时非常有用。在没有该 token 的字节表示时，该值可能为 `null` 。

        - `logprob: number`

          该 token 的对数概率，前提是它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上出现概率最高的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            一个整数列表，表示该 token 的 UTF-8 字节表示。当字符由多个 token 表示并且必须组合它们的字节表示才能生成正确的文本表示时非常有用。在没有该 token 的字节表示时，该值可能为 `null` 。

          - `logprob: number`

            该 token 的对数概率，前提是它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          一个整数列表，表示该 token 的 UTF-8 字节表示。当字符由多个 token 表示并且必须组合它们的字节表示才能生成正确的文本表示时非常有用。在没有该 token 的字节表示时，该值可能为 `null` 。

        - `logprob: number`

          该 token 的对数概率，前提是它位于最可能的 20 个 token 之内。否则，该值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上出现概率最高的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用时消息的注解，例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用 网页搜索 时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式
          如请求中指定。

        - `expires_at: number`

          该音频响应的 Unix 时间戳（秒），表示该响应将在此时间
          之后无法再在服务端上访问，以用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，已替换为 `tool_calls`。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会臆造你的函数 schema 中未定义的参数。在调用函数之前，请在代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会臆造你的函数 schema 中未定义的参数。在调用函数之前，请在代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              由模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储关于该对象的附加信息，并通过 API 或控制台查询对象。
    以结构化格式存储关于该对象的附加信息，并通过 接口 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出（若请求了审核补全）的审核结果。
    请求输入与生成输出（若请求了审核补全）的审核结果。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入进行的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功内容审核结果。

        - `model: string`

          用于生成结果的内容审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          内容审核结果列表。

          - `categories: map[boolean]`

            从内容审核类别到布尔值的字典；若输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从内容审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成该结果的内容审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于成功的内容审核结果。

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

      针对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功内容审核结果。

        - `model: string`

          用于生成结果的内容审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          内容审核结果列表。

          - `categories: map[boolean]`

            从内容审核类别到布尔值的字典；若输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从内容审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成该结果的内容审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于成功的内容审核结果。

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

    - 如果设置为 'auto'，则该请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` parameter is set, the response body will include the `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    This fingerprint represents the backend configuration that the model runs with.

    Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.

  - `usage: optional CompletionUsage`

    Usage statistics for the completion request.

    - `completion_tokens: number`

      Number of tokens in the generated completion.

    - `prompt_tokens: number`

      Number of tokens in the prompt.

    - `total_tokens: number`

      Total number of tokens used in the request (prompt + completion).

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      Breakdown of tokens used in a completion.

      - `accepted_prediction_tokens: optional number`

        When using Predicted Outputs, the number of tokens in the
        prediction that appeared in the completion.

      - `audio_tokens: optional number`

        Audio input tokens generated by the model.

      - `reasoning_tokens: optional number`

        Tokens generated by the model for reasoning.

      - `rejected_prediction_tokens: optional number`

        When using Predicted Outputs, the number of tokens in the
        prediction that did not appear in the completion. However, like
        reasoning tokens, these tokens are still counted in the total
        completion tokens for purposes of billing, output, and context window
        limits.

      - `text_tokens: optional number`

        Text output tokens generated by the model.

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      Breakdown of tokens used in the prompt.

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整的提示 token 数。

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

#### Response

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
        "refusal": "refusal",
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

#### Response

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
