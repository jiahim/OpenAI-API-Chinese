> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获得 Markdown 版本的文档页面。

## 获取聊天补全

**get** `/chat/completions/{completion_id}`

获取已存储的聊天补全。只会返回使用 store
参数创建 `store` 设置为 true `true` 的 Chat Completions。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示根据提供的输入，由模型返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该字段为 `stop` ，如果模型遇到了自然停止点或提供了停止序列；
      `length` ，如果达到了请求中指定的最大令牌数；
      `content_filter` ，如果由于我们的内容过滤器的标记而省略了内容；
      `tool_calls` ，如果模型调用了工具；或者 `function_call` （已弃用），如果模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      在选项列表中的索引位置。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容令牌列表。

        - `token: string`

          令牌。

        - `bytes: array of number or null`

          表示该令牌 UTF-8 字节表示形式的整数列表。在某些字符由多个令牌表示，需要将其字节表示组合以生成正确文本表示的情况下非常有用。可以为 `null` ，如果该令牌没有字节表示形式。

        - `logprob: number`

          该令牌的对数概率，如果它位于最可能的前 20 个令牌之内。否则，值 `-9999.0` 表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置最可能出现的 token 及其对数概率列表。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            令牌。

          - `bytes: array of number or null`

            表示该令牌 UTF-8 字节表示形式的整数列表。在某些字符由多个令牌表示，需要将其字节表示组合以生成正确文本表示的情况下非常有用。可以为 `null` ，如果该令牌没有字节表示形式。

          - `logprob: number`

            该令牌的对数概率，如果它位于最可能的前 20 个令牌之内。否则，值 `-9999.0` 表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          令牌。

        - `bytes: array of number or null`

          表示该令牌 UTF-8 字节表示形式的整数列表。在某些字符由多个令牌表示，需要将其字节表示组合以生成正确文本表示的情况下非常有用。可以为 `null` ，如果该令牌没有字节表示形式。

        - `logprob: number`

          该令牌的对数概率，如果它位于最可能的前 20 个令牌之内。否则，值 `-9999.0` 表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置最可能出现的 token 及其对数概率列表。条目数量可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        适用时消息的注释，例如使用
        [网页搜索工具时](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            URL 引用最后一个字符在消息中的索引。

          - `start_index: number`

            URL 引用第一个字符在消息中的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据，
        具体如下。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，采用以下格式
          请求中指定的格式。

        - `expires_at: number`

          该音频响应的 Unix 时间戳（单位为秒），表示此音频响应将
          不再可在服务端上访问以用于多轮
          对话的时间。

        - `transcript: string`

          模型生成的音频转写文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，并被 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你函数架构中未定义的参数。在调用你的函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

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

              用于调用函数的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你函数架构中未定义的参数。在调用你的函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

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

              要调用的自定义工具名称。

          - `type: "custom"`

            工具的类型，始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    以结构化格式存储有关对象的额外信息，
    并可用于通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了输入和生成输出的审核，
    则为相应的审核结果。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成审核结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典；如果输入因该类别被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于审核成功的结果。

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

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成的输出进行审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成审核结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典；如果输入因该类别被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` 用于审核成功的结果。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在 [Fast mode](/api/docs/guides/fast-mode) 级别启用，请在请求中包含 Responses 或 Chat Completions 的 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在请求中。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数已设置时，响应体会包含根据实际用于处理该请求的处理模式所得到的值。该响应值可能与参数中设置的值不同。 `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    本次补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      本次请求使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        当使用 Predicted Outputs 时，
        prediction that appeared in the completion.

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        当使用 Predicted Outputs 时，
        prediction that did not appear in the completion. However, like
        reasoning tokens, these tokens are still counted in the total
        completion tokens for purposes of billing, output, and context window
        limits.

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未经调整的提示 token 数量。

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
