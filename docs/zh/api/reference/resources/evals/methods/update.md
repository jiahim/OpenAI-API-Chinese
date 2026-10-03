> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 更新评估

**post** `/evals/{eval_id}`

更新某个评估的特定属性。

### 路径参数

- `eval_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，并通过
  API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值为字符串
  ，最大长度为 512 个字符。

- `name: optional string`

  重命名评估。

### 返回值

- `id: string`

  评估的唯一标识符。

- `created_at: number`

  评估创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评估运行中使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` 以及可选的 `sample` 命名空间。
    响应架构定义了数据将呈现的形态：

    - 用于定义你的测试标准，以及
    - 创建运行所需的数据。

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型，始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
    这通常是诸如 `usecase=chatbot` 或 `prompt-version=v2`，等元数据。
    此数据源配置返回的架构用于定义评估中可用的变量。
    `item` 和 `sample` 在使用此数据源配置时都会被定义。

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型，始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过
      API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源项的 JSON 架构。
      了解如何构建 JSON 架构 [此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型，始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 组键值对。可用于
      以结构化格式存储对象的附加信息，并通过
      API 或仪表板查询对象。

      键是字符串，最大长度为 64 个字符。值为字符串
      ，最大长度为 512 个字符。

- `metadata: Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，并通过
  API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值为字符串
  ，最大长度为 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个项目分配标签
    在评估中。

    - `input: array of object { content, role, type }`

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 — 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

        - `TextInput = string`

          模型的文本输入。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项目的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点会继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          在 EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图像细节级别。取值为 `high`, `low`，或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。当前支持的格式有 `mp3` 和
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项目的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，其中每一项可以是输入文本、输出文本、输入
          图像或输入音频对象。

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

            在 EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图像细节级别。取值为 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。可选值为 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型，固定为 `message`.

        - `"message"`

    - `labels: array of string`

      要分配给评估中每个项的标签。

    - `model: string`

      用于评估的模型，必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签，必须是 labels 的子集。

    - `type: "label_model"`

      对象类型，固定为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定操作对输入与参考字符串进行比较。

    - `input: string`

      输入文本，可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本，可以包含模板字符串。

    - `type: "string_check"`

      对象类型，固定为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader = TextSimilarityGrader`

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

    - `pass_threshold: number`

      评分的阈值。

  - `PythonGrader = PythonGrader`

    一个 PythonGrader 对象，用于在输入上运行 Python 脚本。

    - `pass_threshold: optional number`

      评分的阈值。

  - `ScoreModelGrader = ScoreModelGrader`

    一个 ScoreModelGrader 对象，使用模型为输入打分。

    - `pass_threshold: optional number`

      评分的阈值。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
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
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Eval", "metadata": {"description": "Updated description"}}'
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
  "name": "Updated Eval",
  "created_at": 1739314509,
  "metadata": {"description": "Updated description"}
}
```
