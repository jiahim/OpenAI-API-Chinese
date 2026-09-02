> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本文档。

## 创建评估

**post** `/evals`

创建一个评估的结构，可用于测试模型的性能。
一个评估是一组测试标准以及数据源的配置，它决定了评估中所用数据的 schema。在创建评估之后，你可以在不同的模型和模型参数上运行它。我们支持多种类型的评分器和数据源。
有关更多信息，请参阅 [Evals guide](/docs/guides/evals).

### 正文参数

- `data_source_config: object { item_schema, type, include_sample_schema }  or object { type, metadata }  or object { type, metadata }`

  评估运行所用数据源的配置。用于规定评估中数据所遵循的架构。

  - `CustomDataSourceConfig object { item_schema, type, include_sample_schema }`

    一个 CustomDataSourceConfig 对象，用于定义评估运行所用数据源的架构。
    此架构用于定义以下数据的形态：

    - 用于定义你的测试条件，以及
    - 创建运行时需要哪些数据

    - `item_schema: map[unknown]`

      数据源中每一行的 json 架构。

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

    - `include_sample_schema: optional boolean`

      评估是否应要求你填充样本命名空间（即通过根据数据源生成响应）

  - `LogsDataSourceConfig object { type, metadata }`

    用于指定日志查询元数据属性的数据源配置。
    通常为如下元数据： `usecase=chatbot` 或 `prompt-version=v2`，等。

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional map[unknown]`

      日志数据源的元数据筛选条件。

  - `StoredCompletionsDataSourceConfig object { type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional map[unknown]`

      存储补全数据源的元数据筛选条件。

- `testing_criteria: array of object { input, labels, model, 3 more }  or StringCheckGrader or TextSimilarityGrader or 2 more`

  此组中所有评估运行的评分器列表。评分器可以使用双花括号表示法引用数据源中的变量，例如 `{{item.variable_name}}`。要引用模型的输出，请使用 `sample` 命名空间（即， `{{sample.output_text}}`).

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个评估项分配标签
    。

    - `input: array of object { content, role }  or object { content, role, type }`

      构成提示词或上下文的聊天消息列表。可以包含对 `item` 命名空间的变量引用，例如 {{item.name}}。

      - `SimpleInputMessage object { content, role }`

        - `content: string`

          消息的内容。

        - `role: string`

          消息的角色（例如 "system"、"assistant"、"user"）。

      - `EvalMessageObject object { content, role, type }`

        输入到模型的消息，其角色用于表示指令的
        层级关系。使用 `developer` 或 `system` 角色给出的指令
        优先于使用 `user` 角色给出的指令。使用
        `assistant` 角色的消息被视为模型在之前的
        交互中生成的内容。

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

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像详细程度级别。取值为 `high`, `low`、或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。目前支持的格式有 `mp3` 和
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，其中每个输入可以是输入文本、输出文本、输入
            图像或输入音频对象。

            - `TextInput = string`

              模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

              - `type: "output_text"`

                输出文本的类型。始终为 `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              EvalItem 内容数组中使用的图像输入块。

              - `image_url: string`

                图像输入的 URL。

              - `type: "input_image"`

                图像输入的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional string`

                要发送到模型的图像详细程度级别。取值为 `high`, `low`、或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。取值为 `user`, `assistant`, `system`、或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

    - `labels: array of string`

      要分类到评估中每个项目的标签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签集合的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考答案进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值之一 `eq`, `ne`, `like`、或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考答案文本。可以包含模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarity = TextSimilarityGrader`

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

    - `pass_threshold: number`

      分数阈值。

  - `Python = PythonGrader`

    一个 PythonGrader 对象，对输入运行 Python 脚本。

    - `pass_threshold: optional number`

      分数阈值。

  - `ScoreModel = ScoreModelGrader`

    一个 ScoreModelGrader 对象，使用模型为输入打分。

    - `pass_threshold: optional number`

      分数阈值。

- `metadata: optional Metadata or null`

  可以附加到对象的 16 个键值对。这可以
  用于以结构化格式存储关于对象的附加信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最长 64 个字符。值是字符串，
  最长 512 个字符。

- `name: optional string`

  评估的名称。

### Returns

- `id: string`

  该评估的唯一标识符。

- `created_at: number`

  评估创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评估运行中所使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` 以及可选的 `sample` 命名空间。
    响应模式定义了数据将呈现的以下形状：

    - 用于定义你的测试条件，以及
    - 创建运行时需要哪些数据

    - `schema: map[unknown]`

      运行数据源项的 json 模式。
      了解如何构建 JSON 模式 [请参考此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定你日志查询的元数据属性。
    通常为如下元数据： `usecase=chatbot` 或 `prompt-version=v2`，等。
    此数据源配置返回的模式用于定义评估中可用的变量。
    `item` 和 `sample` 在使用此数据源配置时都会被定义。

    - `schema: map[unknown]`

      运行数据源项的 json 模式。
      了解如何构建 JSON 模式 [请参考此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可以附加到对象的 16 个键值对。这可以
      用于以结构化格式存储关于对象的附加信息，
      并通过 API 或仪表板查询对象。

      键是字符串，最长 64 个字符。值是字符串，
      最长 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源项的 json 模式。
      了解如何构建 JSON 模式 [请参考此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可以附加到对象的 16 个键值对。这可以
      用于以结构化格式存储关于对象的附加信息，
      并通过 API 或仪表板查询对象。

      键是字符串，最长 64 个字符。值是字符串，
      最长 512 个字符。

- `metadata: Metadata or null`

  可以附加到对象的 16 个键值对。这可以
  用于以结构化格式存储关于对象的附加信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最长 64 个字符。值是字符串，
  最长 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个评估项分配标签
    。

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          模型的文本输出。

          - `text: string`

            模型的文本输出。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            要发送到模型的图像详细程度级别。取值为 `high`, `low`、或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。目前支持的格式有 `mp3` 和
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，其中每个输入可以是输入文本、输出文本、输入
          图像或输入音频对象。

          - `TextInput = string`

            模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像详细程度级别。取值为 `high`, `low`、或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。取值为 `user`, `assistant`, `system`、或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `labels: array of string`

      分配给评估中每个项的标签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签集合的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考答案进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值之一 `eq`, `ne`, `like`、或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考答案文本。可以包含模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader = TextSimilarityGrader`

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

    - `pass_threshold: number`

      分数阈值。

  - `PythonGrader = PythonGrader`

    一个 PythonGrader 对象，对输入运行 Python 脚本。

    - `pass_threshold: optional number`

      分数阈值。

  - `ScoreModelGrader = ScoreModelGrader`

    一个 ScoreModelGrader 对象，使用模型为输入打分。

    - `pass_threshold: optional number`

      分数阈值。

### 示例

```http
curl https://api.openai.com/v1/evals \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "data_source_config": {
            "item_schema": {
              "foo": "bar"
            },
            "type": "custom"
          },
          "testing_criteria": [
            {
              "input": [
                {
                  "content": "content",
                  "role": "role"
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
        }'
```

#### 响应

```json
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
```

### 示例

```http
curl https://api.openai.com/v1/evals \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Sentiment",
        "data_source_config": {
          "type": "stored_completions",
          "metadata": {
              "usecase": "chatbot"
          }
        },
        "testing_criteria": [
          {
            "type": "label_model",
            "model": "o3-mini",
            "input": [
              {
                "role": "developer",
                "content": "Classify the sentiment of the following statement as one of 'positive', 'neutral', or 'negative'"
              },
              {
                "role": "user",
                "content": "Statement: {{item.input}}"
              }
            ],
            "passing_labels": [
              "positive"
            ],
            "labels": [
              "positive",
              "neutral",
              "negative"
            ],
            "name": "Example label grader"
          }
        ]
      }'
```

#### 响应

```json
{
  "object": "eval",
  "id": "eval_67b7fa9a81a88190ab4aa417e397ea21",
  "data_source_config": {
    "type": "stored_completions",
    "metadata": {
      "usecase": "chatbot"
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
  },
  "testing_criteria": [
    {
      "name": "Example label grader",
      "type": "label_model",
      "model": "o3-mini",
      "input": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "Classify the sentiment of the following statement as one of positive, neutral, or negative"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "Statement: {{item.input}}"
          }
        }
      ],
      "passing_labels": [
        "positive"
      ],
      "labels": [
        "positive",
        "neutral",
        "negative"
      ]
    }
  ],
  "name": "Sentiment",
  "created_at": 1740110490,
  "metadata": {
    "description": "An eval for sentiment analysis"
  }
}
```
