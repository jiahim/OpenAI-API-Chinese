> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## 获取评估

**get** `/evals/{eval_id}`

通过 ID 获取评估。

### 路径参数

- `eval_id: string`

### 返回

- `id: string`

  评估的唯一标识符。

- `created_at: number`

  评估创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评估运行中使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` 以及可选的 `sample` 命名空间。
    响应架构定义了数据的形状，这些数据将用于：

    - 定义你的测试标准，以及
    - 创建运行所需的数据

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [参考此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定你的日志查询的元数据属性。
    这通常是像这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
    此数据源配置返回的架构用于定义评估中可用的变量。
    `item` 以及 `sample` 在使用此数据源配置时都会被定义。

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [参考此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
      格式，以及通过 接口 或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      最大长度为 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [参考此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
      格式，以及通过 接口 或仪表板查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串
      最大长度为 512 个字符。

- `metadata: Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  格式，以及通过 接口 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串
  最大长度为 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为评估中的每一项
    分配标签。

    - `input: array of object { content, role, type }`

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项的数组。

        - `TextInput = string`

          模型的文本输入。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会向上对齐到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          模型输出的文本。

          - `text: string`

            模型输出的文本。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          在 EvalItem 内容数组中使用的图片输入块。

          - `image_url: string`

            图片输入的 URL。

          - `type: "input_image"`

            图片输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图片的细节级别。可选值为 `high`, `low`、或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。目前支持的格式有 `mp3` 以及
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，其中每个输入可以是输入文本、输出文本、输入
          图片或输入音频对象。

          - `TextInput = string`

            模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            在 EvalItem 内容数组中使用的图片输入块。

            - `image_url: string`

              图片输入的 URL。

            - `type: "input_image"`

              图片输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图片的细节级别。可选值为 `high`, `low`、或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。可选值为 `user`, `assistant`, `system`、或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `labels: array of string`

      要分配给评估中每个项的标签。

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

    一个 StringCheckGrader 对象，使用指定的操作在输入与参考之间进行字符串比较。

    - `input: string`

      输入文本。该字段可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作，取值之一： `eq`, `ne`, `like`、或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本。该字段可以包含模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader = TextSimilarityGrader`

    一个 TextSimilarityGrader 对象，基于相似度指标对文本进行评分。

    - `pass_threshold: number`

      分数的阈值。

  - `PythonGrader = PythonGrader`

    一个 PythonGrader 对象，对输入运行 Python 脚本。

    - `pass_threshold: optional number`

      分数的阈值。

  - `ScoreModelGrader = ScoreModelGrader`

    一个 ScoreModelGrader 对象，使用模型为输入打分。

    - `pass_threshold: optional number`

      分数的阈值。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "data_source_config": {
    "schema": {
      "type": "object",
      "properties": {
        "item": {
          "type": "object",
          "properties": {
            "label": {
              "type": "string"
            }
          },
          "required": [
            "label"
          ]
        }
      },
      "required": [
        "item"
      ]
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
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval",
  "id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "data_source_config": {
    "type": "custom",
    "schema": {
      "type": "object",
      "properties": {
        "item": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string"
            },
            "ground_truth": {
              "type": "string"
            }
          },
          "required": [
            "input",
            "ground_truth"
          ]
        }
      },
      "required": [
        "item"
      ]
    }
  },
  "testing_criteria": [
    {
      "name": "String check",
      "id": "String check-2eaf2d8d-d649-4335-8148-9535a7ca73c2",
      "type": "string_check",
      "input": "{{item.input}}",
      "reference": "{{item.ground_truth}}",
      "operation": "eq"
    }
  ],
  "name": "External Data Eval",
  "created_at": 1739314509,
  "metadata": {}
}
```
