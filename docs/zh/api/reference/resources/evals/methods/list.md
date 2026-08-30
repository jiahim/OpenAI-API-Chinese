> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## List evals

**get** `/evals`

列出项目的评估。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个 eval 的标识符。

- `limit: optional number`

  要检索的 eval 数量。

- `order: optional "asc" or "desc"`

  按时间戳对 eval 进行排序的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。

  - `"asc"`

  - `"desc"`

- `order_by: optional "created_at" or "updated_at"`

  eval 可以按创建时间或最后更新时间排序。使用
  `created_at` 表示创建时间，或 `updated_at` 表示最后更新时间。

  - `"created_at"`

  - `"updated_at"`

### Returns

- `data: array of object { id, created_at, data_source_config, 4 more }`

  eval 对象数组。

  - `id: string`

    评估的唯一标识符。

  - `created_at: number`

    评估创建时的 Unix 时间戳（单位：秒）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评估运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      用于指定数据模式的 CustomDataSourceConfig `item` ，以及可选的 `sample` 命名空间。
      响应模式定义了数据的形状，可用于：

      - 定义你的测试标准，以及
      - 创建运行（run）时所需的数据。

      - `schema: map[unknown]`

        运行数据源项的 JSON 模式。
        了解如何构建 JSON 模式， [请参见此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      用于指定日志查询元数据属性的 LogsDataSourceConfig。
      通常是类似 `usecase=chatbot` 或 `prompt-version=v2`，等元数据。
      此数据源配置返回的模式用于定义评估中可用的变量。
      `item` 以及 `sample` 在使用此数据源配置时两者均已定义。

      - `schema: map[unknown]`

        运行数据源项的 JSON 模式。
        了解如何构建 JSON 模式， [请参见此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        由 16 个键值对组成的集合，可以附加到对象上。这可用于
        以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
        以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源项的 JSON 模式。
        了解如何构建 JSON 模式， [请参见此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        由 16 个键值对组成的集合，可以附加到对象上。这可用于
        以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
        以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

  - `metadata: Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。这可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为评估中的每个项目分配标签
      。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项目的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            模型生成的文本输出。

            - `text: string`

              来自模型的文本输出。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            在 EvalItem content 数组中使用的图片输入块。

            - `image_url: string`

              图片输入的 URL。

            - `type: "input_image"`

              图片输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送到模型的图片细节级别。可选值为 `high`, `low`，之一，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。当前支持的格式包括 `mp3` 以及
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项目的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，其中每个元素可以是输入文本、输出文本、输入
            图片或输入音频对象。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型生成的文本输出。

              - `text: string`

                来自模型的文本输出。

              - `type: "output_text"`

                输出文本的类型。始终为 `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              在 EvalItem content 数组中使用的图片输入块。

              - `image_url: string`

                图片输入的 URL。

              - `type: "input_image"`

                图片输入的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional string`

                发送到模型的图片细节级别。可选值为 `high`, `low`，之一，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。可选值为 `user`, `assistant`, `system`，之一，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        要为评估中每个项分配的标签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是 labels 的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作在输入和参考之间执行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。取值之一： `eq`, `ne`, `like`，之一，或 `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        参考文本。可以包含模板字符串。

      - `type: "string_check"`

        对象类型，始终为 `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader = TextSimilarityGrader`

      一个 TextSimilarityGrader 对象，基于相似度指标对文本进行评分。

      - `pass_threshold: number`

        分数的阈值。

    - `PythonGrader = PythonGrader`

      一个 PythonGrader 对象，对输入运行 python 脚本。

      - `pass_threshold: optional number`

        分数的阈值。

    - `ScoreModelGrader = ScoreModelGrader`

      一个 ScoreModelGrader 对象，使用模型为输入打分。

      - `pass_threshold: optional number`

        分数的阈值。

- `first_id: string`

  数据数组中第一个 eval 的标识符。

- `has_more: boolean`

  指示是否还有更多 eval 可用。

- `last_id: string`

  数据数组中最后一个 eval 的标识符。

- `object: "list"`

  此对象的类型。始终设置为 "list"。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/evals \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "data_source_config": {
        "schema": {
          "foo": "bar"
        },
        "type": "custom"
      },
      "metadata": {
        "foo": "string"
      },
      "name": "Chatbot effectiveness Evaluation",
      "object": "eval",
      "testing_criteria": [
        {
          "input": [
            {
              "content": "string",
              "role": "user",
              "type": "message"
            }
          ],
          "labels": [
            "string"
          ],
          "model": "model",
          "name": "name",
          "passing_labels": [
            "string"
          ],
          "type": "label_model"
        }
      ]
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals?limit=1 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "eval_67abd54d9b0081909a86353f6fb9317a",
      "object": "eval",
      "data_source_config": {
        "type": "stored_completions",
        "metadata": {
          "usecase": "push_notifications_summarizer"
        },
        "schema": {
          "type": "object",
          "properties": {
            "item": {
              "type": "object"
            },
            "sample": {
              "type": "object"
            }
          },
          "required": [
            "item",
            "sample"
          ]
        }
      },
      "testing_criteria": [
        {
          "name": "Push Notification Summary Grader",
          "id": "Push Notification Summary Grader-9b876f24-4762-4be9-aff4-db7a9b31c673",
          "type": "label_model",
          "model": "o3-mini",
          "input": [
            {
              "type": "message",
              "role": "developer",
              "content": {
                "type": "input_text",
                "text": "\nLabel the following push notification summary as either correct or incorrect.\nThe push notification and the summary will be provided below.\nA good push notificiation summary is concise and snappy.\nIf it is good, then label it as correct, if not, then incorrect.\n"
              }
            },
            {
              "type": "message",
              "role": "user",
              "content": {
                "type": "input_text",
                "text": "\nPush notifications: {{item.input}}\nSummary: {{sample.output_text}}\n"
              }
            }
          ],
          "passing_labels": [
            "correct"
          ],
          "labels": [
            "correct",
            "incorrect"
          ],
          "sampling_params": null
        }
      ],
      "name": "Push Notification Summary Grader",
      "created_at": 1739314509,
      "metadata": {
        "description": "A stored completions eval for push notification summaries"
      }
    }
  ],
  "first_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "last_id": "eval_67aa884cf6688190b58f657d4441c8b7",
  "has_more": true
}
```
