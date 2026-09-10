# Evals

> 完整文档索引请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

## 创建评估

**post** `/evals`

创建可用于测试模型表现的评估结构。
评估是一组测试标准以及数据源配置，用于规定评估所用数据的模式。创建评估后，你可以在不同模型和模型参数上运行它。我们支持多种评分器和数据源类型。
有关更多信息，请参阅 [Evals 指南](/api/docs/guides/evals).

### 请求体参数

- `data_source_config: object { item_schema, type, include_sample_schema }  or object { type, metadata }  or object { type, metadata }`

  评估运行所用数据源的配置。用于指定评估数据所遵循的结构。

  - `CustomDataSourceConfig object { item_schema, type, include_sample_schema }`

    一个 CustomDataSourceConfig 对象，用于定义评估运行所用数据源的结构。
    此结构用于定义以下数据的形式：

    - 用于定义你的测试标准，以及
    - 创建运行需要哪些数据

    - `item_schema: map[unknown]`

      数据源中每一行的 JSON 结构。

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

    - `include_sample_schema: optional boolean`

      评估是否应要求你填充样本命名空间（即，根据你的数据源生成响应）

  - `LogsDataSourceConfig object { type, metadata }`

    一个数据源配置，用于指定日志查询的元数据属性。
    通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional map[unknown]`

      日志数据源的元数据筛选器。

  - `StoredCompletionsDataSourceConfig object { type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional map[unknown]`

      已存储补全数据源的元数据筛选器。

- `testing_criteria: array of object { input, labels, model, 3 more }  or StringCheckGrader or TextSimilarityGrader or 2 more`

  此组中所有评估运行的评分器列表。评分器可以使用双大括号表示法引用数据源中的变量，例如 `{{item.variable_name}}`。若要引用模型的输出，请使用 `sample` 命名空间（即， `{{sample.output_text}}`).

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个项目分配标签
    以进行评估。

    - `input: array of object { content, role }  or object { content, role, type }`

      构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

      - `SimpleInputMessage object { content, role }`

        - `content: string`

          消息的内容。

        - `role: string`

          消息的角色（例如 "system"、"assistant"、"user"）。

      - `EvalMessageObject object { content, role, type }`

        输入到模型的消息，其角色用于指示指令的
        优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
        角色给出的指令。使用 `user` 角色的消息假定为模型在之前
        `assistant` 交互中生成的内容。
        交互。

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

    - `labels: array of string`

      对评估中的每个项目进行分类的标签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本。可以包含模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarity = TextSimilarityGrader`

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

    - `pass_threshold: number`

      分数的阈值。

  - `Python = PythonGrader`

    一个 PythonGrader 对象，对输入运行 python 脚本。

    - `pass_threshold: optional number`

      分数的阈值。

  - `ScoreModel = ScoreModelGrader`

    一个 ScoreModelGrader 对象，使用模型为输入打分。

    - `pass_threshold: optional number`

      分数的阈值。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: optional string`

  评估的名称。

### Returns

- `id: string`

  评测的唯一标识符。

- `created_at: number`

  评测创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评测运行中使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
    响应模式定义的数据形状将用于：

    - 用于定义你的测试标准，以及
    - 创建运行需要哪些数据

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
    通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
    此数据源配置返回的模式用于定义评测中可用的变量。
    `item` 和 `sample` 在使用此数据源配置时均会被定义。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个项目分配标签
    以进行评估。

    - `input: array of object { content, role, type }`

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

        - `TextInput = string`

          输入到模型的文本。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          输入到模型的文本。

          - `text: string`

            输入到模型的文本。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

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

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `labels: array of string`

      分配给评测中每个条目标的签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

## 删除一个评估

**删除** `/evals/{eval_id}`

删除评估。

### 路径参数

- `eval_id: string`

### Returns

- `deleted: boolean`

- `eval_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "deleted": true,
  "eval_id": "eval_abc123",
  "object": "eval.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "eval.deleted",
  "deleted": true,
  "eval_id": "eval_abc123"
}
```

## 列出 evals

**get** `/evals`

列出项目的评估。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个 eval 的标识符。

- `limit: optional number`

  要检索的 eval 数量。

- `order: optional "asc" or "desc"`

  按时间戳排序 eval 的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。

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

    评测的唯一标识符。

  - `created_at: number`

    评测创建时的 Unix 时间戳（以秒为单位）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评测运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
      响应模式定义的数据形状将用于：

      - 用于定义你的测试标准，以及
      - 创建运行需要哪些数据

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
      通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
      此数据源配置返回的模式用于定义评测中可用的变量。
      `item` 和 `sample` 在使用此数据源配置时均会被定义。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      以进行评估。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        分配给评测中每个条目标的签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

  data 数组中第一个 eval 的标识符。

- `has_more: boolean`

  指示是否还有更多 eval 可用。

- `last_id: string`

  data 数组中最后一个 eval 的标识符。

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

## 获取评估

**get** `/evals/{eval_id}`

根据 ID 获取评估。

### 路径参数

- `eval_id: string`

### Returns

- `id: string`

  评测的唯一标识符。

- `created_at: number`

  评测创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评测运行中使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
    响应模式定义的数据形状将用于：

    - 用于定义你的测试标准，以及
    - 创建运行需要哪些数据

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
    通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
    此数据源配置返回的模式用于定义评测中可用的变量。
    `item` 和 `sample` 在使用此数据源配置时均会被定义。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个项目分配标签
    以进行评估。

    - `input: array of object { content, role, type }`

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

        - `TextInput = string`

          输入到模型的文本。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          输入到模型的文本。

          - `text: string`

            输入到模型的文本。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

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

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `labels: array of string`

      分配给评测中每个条目标的签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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
  "metadata": {},
}
```

## 更新评估

**post** `/evals/{eval_id}`

更新某个评估的特定属性。

### 路径参数

- `eval_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: optional string`

  重命名评估。

### Returns

- `id: string`

  评测的唯一标识符。

- `created_at: number`

  评测创建时的 Unix 时间戳（以秒为单位）。

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  评测运行中使用的数据源配置。

  - `EvalCustomDataSourceConfig object { schema, type }`

    一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
    响应模式定义的数据形状将用于：

    - 用于定义你的测试标准，以及
    - 创建运行需要哪些数据

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "custom"`

      数据源的类型。始终为 `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
    通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
    此数据源配置返回的模式用于定义评测中可用的变量。
    `item` 和 `sample` 在使用此数据源配置时均会被定义。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "logs"`

      数据源的类型。始终为 `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    已弃用，推荐使用 LogsDataSourceConfig。

    - `schema: map[unknown]`

      运行数据源条目的 json 模式。
      了解如何构建 JSON 模式 [此处](https://json-schema.org/).

    - `type: "stored_completions"`

      数据源的类型。始终为 `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      可附加到对象的 16 个键值对。这可以
      用于以结构化格式存储对象的附加信息，
      并通过 API 或控制台查询对象。

      键为字符串，最长 64 个字符。值为字符串，
      最长 512 个字符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: string`

  评估的名称。

- `object: "eval"`

  对象类型。

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  测试条件列表。

  - `LabelModelGrader object { input, labels, model, 3 more }`

    一个 LabelModelGrader 对象，使用模型为每个项目分配标签
    以进行评估。

    - `input: array of object { content, role, type }`

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

        - `TextInput = string`

          输入到模型的文本。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          输入到模型的文本。

          - `text: string`

            输入到模型的文本。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

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

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `labels: array of string`

      分配给评测中每个条目标的签。

    - `model: string`

      用于评估的模型。必须支持结构化输出。

    - `name: string`

      评分器的名称。

    - `passing_labels: array of string`

      表示通过结果的标签。必须是标签的子集。

    - `type: "label_model"`

      对象类型，始终为 `label_model`.

      - `"label_model"`

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

    - `input: string`

      输入文本。可以包含模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

    一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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
  "metadata": {"description": "Updated description"},
}
```

## Domain Types

### Eval Create Response

- `EvalCreateResponse object { id, created_at, data_source_config, 4 more }`

  一个包含数据源配置和测试标准的 Eval 对象。
  一个 Eval 代表了为你的 LLM 集成所执行的一项任务。
  例如：

  - 提升我的聊天机器人质量
  - 查看我的聊天机器人处理客户支持的表现
  - 检查 o4-mini 在我的用例上是否优于 gpt-6-astra

  - `id: string`

    评测的唯一标识符。

  - `created_at: number`

    评测创建时的 Unix 时间戳（以秒为单位）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评测运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
      响应模式定义的数据形状将用于：

      - 用于定义你的测试标准，以及
      - 创建运行需要哪些数据

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
      通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
      此数据源配置返回的模式用于定义评测中可用的变量。
      `item` 和 `sample` 在使用此数据源配置时均会被定义。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      以进行评估。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        分配给评测中每个条目标的签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

### Eval 自定义数据源配置

- `EvalCustomDataSourceConfig object { schema, type }`

  一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
  响应模式定义的数据形状将用于：

  - 用于定义你的测试标准，以及
  - 创建运行需要哪些数据

  - `schema: map[unknown]`

    运行数据源条目的 json 模式。
    了解如何构建 JSON 模式 [此处](https://json-schema.org/).

  - `type: "custom"`

    数据源的类型。始终为 `custom`.

    - `"custom"`

### Eval 删除响应

- `EvalDeleteResponse object { deleted, eval_id, object }`

  - `deleted: boolean`

  - `eval_id: string`

  - `object: string`

### Eval 列表响应

- `EvalListResponse object { id, created_at, data_source_config, 4 more }`

  一个包含数据源配置和测试标准的 Eval 对象。
  一个 Eval 代表了为你的 LLM 集成所执行的一项任务。
  例如：

  - 提升我的聊天机器人质量
  - 查看我的聊天机器人处理客户支持的表现
  - 检查 o4-mini 在我的用例上是否优于 gpt-6-astra

  - `id: string`

    评测的唯一标识符。

  - `created_at: number`

    评测创建时的 Unix 时间戳（以秒为单位）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评测运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
      响应模式定义的数据形状将用于：

      - 用于定义你的测试标准，以及
      - 创建运行需要哪些数据

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
      通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
      此数据源配置返回的模式用于定义评测中可用的变量。
      `item` 和 `sample` 在使用此数据源配置时均会被定义。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      以进行评估。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        分配给评测中每个条目标的签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

### Eval 检索响应

- `EvalRetrieveResponse object { id, created_at, data_source_config, 4 more }`

  一个包含数据源配置和测试标准的 Eval 对象。
  一个 Eval 代表了为你的 LLM 集成所执行的一项任务。
  例如：

  - 提升我的聊天机器人质量
  - 查看我的聊天机器人处理客户支持的表现
  - 检查 o4-mini 在我的用例上是否优于 gpt-6-astra

  - `id: string`

    评测的唯一标识符。

  - `created_at: number`

    评测创建时的 Unix 时间戳（以秒为单位）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评测运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
      响应模式定义的数据形状将用于：

      - 用于定义你的测试标准，以及
      - 创建运行需要哪些数据

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
      通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
      此数据源配置返回的模式用于定义评测中可用的变量。
      `item` 和 `sample` 在使用此数据源配置时均会被定义。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      以进行评估。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        分配给评测中每个条目标的签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

### Eval 已存储补全数据源配置

- `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

  已弃用，推荐使用 LogsDataSourceConfig。

  - `schema: map[unknown]`

    运行数据源条目的 json 模式。
    了解如何构建 JSON 模式 [此处](https://json-schema.org/).

  - `type: "stored_completions"`

    数据源的类型。始终为 `stored_completions`.

    - `"stored_completions"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

### Eval 更新响应

- `EvalUpdateResponse object { id, created_at, data_source_config, 4 more }`

  一个包含数据源配置和测试标准的 Eval 对象。
  一个 Eval 代表了为你的 LLM 集成所执行的一项任务。
  例如：

  - 提升我的聊天机器人质量
  - 查看我的聊天机器人处理客户支持的表现
  - 检查 o4-mini 在我的用例上是否优于 gpt-6-astra

  - `id: string`

    评测的唯一标识符。

  - `created_at: number`

    评测创建时的 Unix 时间戳（以秒为单位）。

  - `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

    评测运行中使用的数据源配置。

    - `EvalCustomDataSourceConfig object { schema, type }`

      一个 CustomDataSourceConfig，用于指定你的 `item` ，以及可选的 `sample` 命名空间。
      响应模式定义的数据形状将用于：

      - 用于定义你的测试标准，以及
      - 创建运行需要哪些数据

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "custom"`

        数据源的类型。始终为 `custom`.

        - `"custom"`

    - `LogsDataSourceConfig object { schema, type, metadata }`

      一个 LogsDataSourceConfig，用于指定日志查询的元数据属性。
      通常是这样的元数据： `usecase=chatbot` 或 `prompt-version=v2`，等等。
      此数据源配置返回的模式用于定义评测中可用的变量。
      `item` 和 `sample` 在使用此数据源配置时均会被定义。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "logs"`

        数据源的类型。始终为 `logs`.

        - `"logs"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

    - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

      已弃用，推荐使用 LogsDataSourceConfig。

      - `schema: map[unknown]`

        运行数据源条目的 json 模式。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    评估的名称。

  - `object: "eval"`

    对象类型。

    - `"eval"`

  - `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

    测试条件列表。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      以进行评估。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

          - `TextInput = string`

            输入到模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入到模型的文本。

            - `text: string`

              输入到模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        分配给评测中每个条目标的签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作对输入和参考文本进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

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

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

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

# 运行

## 取消 eval 运行

**post** `/evals/{eval_id}/runs/{run_id}`

取消正在进行的评估运行。

### 路径参数

- `eval_id: string`

- `run_id: string`

### Returns

- `id: string`

  评估运行记录的唯一标识符。

- `created_at: number`

  评估运行记录创建时的 Unix 时间戳（以秒为单位）。

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  有关该运行数据源的信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

    - `source: object { content, type }  or object { id, type }`

      确定如何填充 `item` 数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

    - `type: "jsonl"`

      数据源的类型。始终为 `jsonl`.

      - `"jsonl"`

  - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

    一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

        一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

        - `type: "stored_completions"`

          数据源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

        - `created_before: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

        - `limit: optional number or null`

          一个可选的最大返回条目数量。

        - `metadata: optional Metadata or null`

          可附加到对象的 16 个键值对。这可以
          用于以结构化格式存储对象的附加信息，
          并通过 API 或控制台查询对象。

          键为字符串，最长 64 个字符。值为字符串，
          最长 512 个字符。

        - `model: optional string or null`

          一个可选的模型筛选条件（例如 'gpt-6-astra'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputMessageContentList`

              发送给模型的文本、图像或音频输入，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                发送给模型的一个或多个输入项的列表，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                  - `text: string`

                    输入到模型的文本。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                  - `detail: ImageDetail`

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                    - `"low"`

                    - `"high"`

                    - `"auto"`

                    - `"original"`

                  - `type: "input_image"`

                    输入项的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `image_url: optional string or null`

                    要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  发送给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                    - `"auto"`

                    - `"low"`

                    - `"high"`

                  - `file_data: optional string`

                    要发送给模型的文件内容。

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `file_url: optional string`

                    要发送给模型的文件的 URL。

                  - `filename: optional string`

                    要发送给模型的文件名称。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `phase: optional "commentary" or "final_answer" or null`

              将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
              对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
              阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `ItemReferenceInputMessages object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

        指定模型必须输出的格式的对象。

        设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
        Structured Outputs 可确保模型匹配你提供的 JSON
        schema。了解更多请参阅 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
        可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
        的模型，建议优先使用该模式。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
          以执行此操作。
          这样做。

          - `type: "json_object"`

            正在定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

          - `description: optional string`

            对函数功能的描述，模型据此选择调用函数的时机与方式。

          - `parameters: optional FunctionParameters`

            函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

            省略 `parameters` 会定义一个空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

        一个 EvalResponsesSource 对象，用于描述运行数据源配置。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

        - `created_before: optional number or null`

          仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

        - `instructions_search: optional string or null`

          用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

        - `metadata: optional unknown or null`

          responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

        - `model: optional string or null`

          用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `temperature: optional number or null`

          采样温度。这是用于筛选 responses 的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是用于筛选 responses 的查询参数。

        - `top_p: optional number or null`

          核采样参数。这是用于筛选 responses 的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是用于筛选 responses 的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `InputMessagesItemReference object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [Text inputs and outputs](/api/docs/guides/text)
        - [Structured Outputs](/api/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
          从而确保模型匹配你提供的 JSON schema。详见
          [Structured Outputs 指南](/api/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，且不提供其他选项。

          **不建议用于 gpt-4o 及更新模型：**

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

      - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可以调用的工具数组。你可以
        通过设置 `tool_choice` 参数来指定要使用的工具。

        你可以提供给模型的两类工具是：

        - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
          能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
          或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
          [内置工具](/api/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。详细了解
          [function calling](/api/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。模型使用该描述来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

              - `key: string`

                要与该值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于等于
                - `lt`：小于
                - `lte`：小于等于
                - `in`：包含
                - `nin`：不包含

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示屏的高度。

          - `display_width: number`

            计算机显示屏的宽度。

          - `environment: "windows" or "mac" or "linux" or 2 more`

            要控制的计算机环境类型。

            - `"windows"`

            - `"mac"`

            - `"linux"`

            - `"ubuntu"`

            - `"browser"`

          - `type: "computer_use_preview"`

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。详细了解
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也一并允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示某个工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP server 的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP server 的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP server 的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              需要批准的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的批准策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
              时， `never`，所有工具都不需要批准。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，
            用于指定可供代码使用的已上传文件 ID，
            以及一个可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                总是 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                代码解释器容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                  - `type: "disabled"`

                    禁用出站网络访问。始终为 `disabled`.

                    - `"disabled"`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                  - `allowed_domains: array of string`

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的、限定域的、用于已加入白名单域的密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      要注入到该域的密钥的名称。

                    - `value: string`

                      要注入到该域的密钥值。

          - `type: "code_interpreter"`

            代码解释器工具的类型。始终为 `code_interpreter`.

            - `"code_interpreter"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

        - `ProgrammaticToolCalling object { type }`

          - `type: "programmatic_tool_calling"`

            工具的类型。始终为 `programmatic_tool_calling`.

            - `"programmatic_tool_calling"`

        - `ImageGeneration object { type, action, background, 9 more }`

          使用 GPT 图像模型生成图像的工具。

          - `type: "image_generation"`

            图像生成工具的类型。始终为 `image_generation`.

            - `"image_generation"`

          - `action: optional "generate" or "edit" or "auto"`

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。支持透明背景的 GPT Image
            模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
            preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

              - `"gpt-image-2.5-sunburst"`

              - `"gpt-image-2.5-sunburst-2026-09-08"`

              - `"gpt-image-2.5-flare"`

              - `"gpt-image-2.5-flare-2026-09-08"`

          - `moderation: optional "auto" or "low"`

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩级别。默认值：100。

          - `output_format: optional "png" or "webp" or "jpeg"`

            生成图像的输出格式。可选值为 `png`, `webp`，或
            `jpeg`。之一。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or 3 more`

            生成图像的质量。GPT 图像模型支持 `low`,
            `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
            ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `"1024x1024"`

              - `"1024x1536"`

              - `"1536x1024"`

              - `"auto"`

        - `LocalShell object { type }`

          允许模型在本地环境中执行 shell 命令的工具。

          - `type: "local_shell"`

            本地 shell 工具的类型。始终为 `local_shell`.

            - `"local_shell"`

        - `Shell object { type, allowed_callers, environment }`

          允许模型执行 shell 命令的工具。

          - `type: "shell"`

            shell 工具的类型。始终为 `shell`.

            - `"shell"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

            - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

              - `type: "container_auto"`

                自动为本次请求创建容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

              - `skills: optional array of SkillReference or InlineSkill`

                可选的技能列表，通过 id 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    被引用技能的 ID。

                  - `type: "skill_reference"`

                    引用通过 /v1/skills 端点创建的技能。

                    - `"skill_reference"`

                  - `version: optional string`

                    可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `source: InlineSkillSource`

                    内联技能载荷

                    - `data: string`

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能载荷的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型。必须为 `base64`.

                      - `"base64"`

                  - `type: "inline"`

                    为本次请求定义一个内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `path: string`

                  包含技能的目录路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法。其一为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 6 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此函数是否应被延迟，并通过工具搜索被发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

- `error: EvalAPIError`

  表示来自 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

- `eval_id: string`

  关联评估的标识符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `model: string`

  被评估的模型（如果适用）。

- `name: string`

  评估运行的名称。

- `object: "eval.run"`

  对象的类型。始终为 "eval.run"。

  - `"eval.run"`

- `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

  评估运行期间每个模型的使用情况统计。

  - `cached_tokens: number`

    从缓存中检索到的 token 数量。

  - `completion_tokens: number`

    生成的完成 token 数量。

  - `invocation_count: number`

    调用次数。

  - `model_name: string`

    模型的名称。

  - `prompt_tokens: number`

    使用的提示 token 数量。

  - `total_tokens: number`

    使用的 token 总数。

- `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

  评估运行期间应用的每个测试标准的结果。

  - `failed: number`

    此标准未通过的测试数量。

  - `passed: number`

    此标准通过的测试数量。

  - `testing_criteria: string`

    测试标准的描述。

- `report_url: string`

  UI 仪表盘上渲染的评估运行报告的 URL。

- `result_counts: object { errored, failed, passed, total }`

  汇总评估运行结果的计数器。

  - `errored: number`

    出现错误的输出项数量。

  - `failed: number`

    未通过评估的输出项数量。

  - `passed: number`

    通过评估的输出项数量。

  - `total: number`

    已执行的输出项总数。

- `status: string`

  评估运行的状态。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "data_source": {
    "source": {
      "content": [
        {
          "item": {
            "foo": "bar"
          },
          "sample": {
            "foo": "bar"
          }
        }
      ],
      "type": "file_content"
    },
    "type": "jsonl"
  },
  "error": {
    "code": "code",
    "message": "message"
  },
  "eval_id": "eval_id",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "eval.run",
  "per_model_usage": [
    {
      "cached_tokens": 0,
      "completion_tokens": 0,
      "invocation_count": 0,
      "model_name": "model_name",
      "prompt_tokens": 0,
      "total_tokens": 0
    }
  ],
  "per_testing_criteria_results": [
    {
      "failed": 0,
      "passed": 0,
      "testing_criteria": "testing_criteria"
    }
  ],
  "report_url": "https://example.com",
  "result_counts": {
    "errored": 0,
    "failed": 0,
    "passed": 0,
    "total": 0
  },
  "status": "status"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7/cancel \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval.run",
  "id": "evalrun_67abd54d60ec8190832b46859da808f7",
  "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "report_url": "https://platform.openai.com/evaluations/eval_67abd54d9b0081909a86353f6fb9317a?run_id=evalrun_67abd54d60ec8190832b46859da808f7",
  "status": "canceled",
  "model": "gpt-6-astra",
  "name": "gpt-6-astra",
  "created_at": 1743092069,
  "result_counts": {
    "total": 0,
    "errored": 0,
    "failed": 0,
    "passed": 0
  },
  "per_model_usage": null,
  "per_testing_criteria_results": null,
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Central Bank Increases Interest Rates Amid Inflation Concerns",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Summit Addresses Climate Change Strategies",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Major Retailer Reports Record-Breaking Holiday Sales",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "National Team Qualifies for World Championship Finals",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Stock Markets Rally After Positive Economic Data Released",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "Global Manufacturer Announces Merger with Competitor",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Breakthrough in Renewable Energy Technology Unveiled",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "World Leaders Sign Historic Climate Agreement",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Professional Athlete Sets New Record in Championship Event",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Financial Institutions Adapt to New Regulatory Requirements",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Tech Conference Showcases Advances in Artificial Intelligence",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Global Markets Respond to Oil Price Fluctuations",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Cooperation Strengthened Through New Treaty",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Sports League Announces Revised Schedule for Upcoming Season",
            "ground_truth": "Sports"
          }
        }
      ]
    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "{{item.input}}"
          }
        }
      ]
    },
    "model": "gpt-6-astra",
    "sampling_params": {
      "max_completions_tokens": 2048
    }
  },
  "error": null,
  "metadata": {}
}
```

## Create eval run

**post** `/evals/{eval_id}/runs`

为指定评估启动一次新的运行，指定数据源以及要使用的模型配置进行测试。数据源将根据评估配置中指定的 schema 进行校验。

### 路径参数

- `eval_id: string`

### 请求体参数

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  关于此次运行数据来源的详细信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

    - `source: object { content, type }  or object { id, type }`

      确定如何填充 `item` 数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

    - `type: "jsonl"`

      数据源的类型。始终为 `jsonl`.

      - `"jsonl"`

  - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

    一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

        一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

        - `type: "stored_completions"`

          数据源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

        - `created_before: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

        - `limit: optional number or null`

          一个可选的最大返回条目数量。

        - `metadata: optional Metadata or null`

          可附加到对象的 16 个键值对。这可以
          用于以结构化格式存储对象的附加信息，
          并通过 API 或控制台查询对象。

          键为字符串，最长 64 个字符。值为字符串，
          最长 512 个字符。

        - `model: optional string or null`

          一个可选的模型筛选条件（例如 'gpt-6-astra'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputMessageContentList`

              发送给模型的文本、图像或音频输入，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                发送给模型的一个或多个输入项的列表，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                  - `text: string`

                    输入到模型的文本。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                  - `detail: ImageDetail`

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                    - `"low"`

                    - `"high"`

                    - `"auto"`

                    - `"original"`

                  - `type: "input_image"`

                    输入项的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `image_url: optional string or null`

                    要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  发送给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                    - `"auto"`

                    - `"low"`

                    - `"high"`

                  - `file_data: optional string`

                    要发送给模型的文件内容。

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `file_url: optional string`

                    要发送给模型的文件的 URL。

                  - `filename: optional string`

                    要发送给模型的文件名称。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `phase: optional "commentary" or "final_answer" or null`

              将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
              对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
              阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `ItemReferenceInputMessages object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

        指定模型必须输出的格式的对象。

        设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
        Structured Outputs 可确保模型匹配你提供的 JSON
        schema。了解更多请参阅 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
        可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
        的模型，建议优先使用该模式。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
          以执行此操作。
          这样做。

          - `type: "json_object"`

            正在定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

          - `description: optional string`

            对函数功能的描述，模型据此选择调用函数的时机与方式。

          - `parameters: optional FunctionParameters`

            函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

            省略 `parameters` 会定义一个空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

        一个 EvalResponsesSource 对象，用于描述运行数据源配置。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

        - `created_before: optional number or null`

          仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

        - `instructions_search: optional string or null`

          用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

        - `metadata: optional unknown or null`

          responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

        - `model: optional string or null`

          用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `temperature: optional number or null`

          采样温度。这是用于筛选 responses 的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是用于筛选 responses 的查询参数。

        - `top_p: optional number or null`

          核采样参数。这是用于筛选 responses 的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是用于筛选 responses 的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `InputMessagesItemReference object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [Text inputs and outputs](/api/docs/guides/text)
        - [Structured Outputs](/api/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
          从而确保模型匹配你提供的 JSON schema。详见
          [Structured Outputs 指南](/api/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，且不提供其他选项。

          **不建议用于 gpt-4o 及更新模型：**

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

      - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可以调用的工具数组。你可以
        通过设置 `tool_choice` 参数来指定要使用的工具。

        你可以提供给模型的两类工具是：

        - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
          能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
          或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
          [内置工具](/api/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。详细了解
          [function calling](/api/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。模型使用该描述来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

              - `key: string`

                要与该值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于等于
                - `lt`：小于
                - `lte`：小于等于
                - `in`：包含
                - `nin`：不包含

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示屏的高度。

          - `display_width: number`

            计算机显示屏的宽度。

          - `environment: "windows" or "mac" or "linux" or 2 more`

            要控制的计算机环境类型。

            - `"windows"`

            - `"mac"`

            - `"linux"`

            - `"ubuntu"`

            - `"browser"`

          - `type: "computer_use_preview"`

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。详细了解
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也一并允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示某个工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP server 的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP server 的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP server 的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              需要批准的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的批准策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
              时， `never`，所有工具都不需要批准。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，
            用于指定可供代码使用的已上传文件 ID，
            以及一个可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                总是 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                代码解释器容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                  - `type: "disabled"`

                    禁用出站网络访问。始终为 `disabled`.

                    - `"disabled"`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                  - `allowed_domains: array of string`

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的、限定域的、用于已加入白名单域的密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      要注入到该域的密钥的名称。

                    - `value: string`

                      要注入到该域的密钥值。

          - `type: "code_interpreter"`

            代码解释器工具的类型。始终为 `code_interpreter`.

            - `"code_interpreter"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

        - `ProgrammaticToolCalling object { type }`

          - `type: "programmatic_tool_calling"`

            工具的类型。始终为 `programmatic_tool_calling`.

            - `"programmatic_tool_calling"`

        - `ImageGeneration object { type, action, background, 9 more }`

          使用 GPT 图像模型生成图像的工具。

          - `type: "image_generation"`

            图像生成工具的类型。始终为 `image_generation`.

            - `"image_generation"`

          - `action: optional "generate" or "edit" or "auto"`

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。支持透明背景的 GPT Image
            模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
            preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

              - `"gpt-image-2.5-sunburst"`

              - `"gpt-image-2.5-sunburst-2026-09-08"`

              - `"gpt-image-2.5-flare"`

              - `"gpt-image-2.5-flare-2026-09-08"`

          - `moderation: optional "auto" or "low"`

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩级别。默认值：100。

          - `output_format: optional "png" or "webp" or "jpeg"`

            生成图像的输出格式。可选值为 `png`, `webp`，或
            `jpeg`。之一。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or 3 more`

            生成图像的质量。GPT 图像模型支持 `low`,
            `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
            ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `"1024x1024"`

              - `"1024x1536"`

              - `"1536x1024"`

              - `"auto"`

        - `LocalShell object { type }`

          允许模型在本地环境中执行 shell 命令的工具。

          - `type: "local_shell"`

            本地 shell 工具的类型。始终为 `local_shell`.

            - `"local_shell"`

        - `Shell object { type, allowed_callers, environment }`

          允许模型执行 shell 命令的工具。

          - `type: "shell"`

            shell 工具的类型。始终为 `shell`.

            - `"shell"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

            - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

              - `type: "container_auto"`

                自动为本次请求创建容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

              - `skills: optional array of SkillReference or InlineSkill`

                可选的技能列表，通过 id 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    被引用技能的 ID。

                  - `type: "skill_reference"`

                    引用通过 /v1/skills 端点创建的技能。

                    - `"skill_reference"`

                  - `version: optional string`

                    可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `source: InlineSkillSource`

                    内联技能载荷

                    - `data: string`

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能载荷的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型。必须为 `base64`.

                      - `"base64"`

                  - `type: "inline"`

                    为本次请求定义一个内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `path: string`

                  包含技能的目录路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法。其一为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 6 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此函数是否应被延迟，并通过工具搜索被发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `name: optional string`

  运行的名称。

### Returns

- `id: string`

  评估运行记录的唯一标识符。

- `created_at: number`

  评估运行记录创建时的 Unix 时间戳（以秒为单位）。

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  有关该运行数据源的信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

    - `source: object { content, type }  or object { id, type }`

      确定如何填充 `item` 数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

    - `type: "jsonl"`

      数据源的类型。始终为 `jsonl`.

      - `"jsonl"`

  - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

    一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

        一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

        - `type: "stored_completions"`

          数据源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

        - `created_before: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

        - `limit: optional number or null`

          一个可选的最大返回条目数量。

        - `metadata: optional Metadata or null`

          可附加到对象的 16 个键值对。这可以
          用于以结构化格式存储对象的附加信息，
          并通过 API 或控制台查询对象。

          键为字符串，最长 64 个字符。值为字符串，
          最长 512 个字符。

        - `model: optional string or null`

          一个可选的模型筛选条件（例如 'gpt-6-astra'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputMessageContentList`

              发送给模型的文本、图像或音频输入，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                发送给模型的一个或多个输入项的列表，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                  - `text: string`

                    输入到模型的文本。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                  - `detail: ImageDetail`

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                    - `"low"`

                    - `"high"`

                    - `"auto"`

                    - `"original"`

                  - `type: "input_image"`

                    输入项的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `image_url: optional string or null`

                    要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  发送给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                    - `"auto"`

                    - `"low"`

                    - `"high"`

                  - `file_data: optional string`

                    要发送给模型的文件内容。

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `file_url: optional string`

                    要发送给模型的文件的 URL。

                  - `filename: optional string`

                    要发送给模型的文件名称。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `phase: optional "commentary" or "final_answer" or null`

              将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
              对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
              阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `ItemReferenceInputMessages object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

        指定模型必须输出的格式的对象。

        设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
        Structured Outputs 可确保模型匹配你提供的 JSON
        schema。了解更多请参阅 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
        可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
        的模型，建议优先使用该模式。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
          以执行此操作。
          这样做。

          - `type: "json_object"`

            正在定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

          - `description: optional string`

            对函数功能的描述，模型据此选择调用函数的时机与方式。

          - `parameters: optional FunctionParameters`

            函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

            省略 `parameters` 会定义一个空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

        一个 EvalResponsesSource 对象，用于描述运行数据源配置。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

        - `created_before: optional number or null`

          仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

        - `instructions_search: optional string or null`

          用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

        - `metadata: optional unknown or null`

          responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

        - `model: optional string or null`

          用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `temperature: optional number or null`

          采样温度。这是用于筛选 responses 的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是用于筛选 responses 的查询参数。

        - `top_p: optional number or null`

          核采样参数。这是用于筛选 responses 的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是用于筛选 responses 的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `InputMessagesItemReference object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [Text inputs and outputs](/api/docs/guides/text)
        - [Structured Outputs](/api/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
          从而确保模型匹配你提供的 JSON schema。详见
          [Structured Outputs 指南](/api/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，且不提供其他选项。

          **不建议用于 gpt-4o 及更新模型：**

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

      - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可以调用的工具数组。你可以
        通过设置 `tool_choice` 参数来指定要使用的工具。

        你可以提供给模型的两类工具是：

        - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
          能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
          或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
          [内置工具](/api/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。详细了解
          [function calling](/api/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。模型使用该描述来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

              - `key: string`

                要与该值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于等于
                - `lt`：小于
                - `lte`：小于等于
                - `in`：包含
                - `nin`：不包含

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示屏的高度。

          - `display_width: number`

            计算机显示屏的宽度。

          - `environment: "windows" or "mac" or "linux" or 2 more`

            要控制的计算机环境类型。

            - `"windows"`

            - `"mac"`

            - `"linux"`

            - `"ubuntu"`

            - `"browser"`

          - `type: "computer_use_preview"`

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。详细了解
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也一并允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示某个工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP server 的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP server 的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP server 的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              需要批准的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的批准策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
              时， `never`，所有工具都不需要批准。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，
            用于指定可供代码使用的已上传文件 ID，
            以及一个可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                总是 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                代码解释器容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                  - `type: "disabled"`

                    禁用出站网络访问。始终为 `disabled`.

                    - `"disabled"`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                  - `allowed_domains: array of string`

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的、限定域的、用于已加入白名单域的密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      要注入到该域的密钥的名称。

                    - `value: string`

                      要注入到该域的密钥值。

          - `type: "code_interpreter"`

            代码解释器工具的类型。始终为 `code_interpreter`.

            - `"code_interpreter"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

        - `ProgrammaticToolCalling object { type }`

          - `type: "programmatic_tool_calling"`

            工具的类型。始终为 `programmatic_tool_calling`.

            - `"programmatic_tool_calling"`

        - `ImageGeneration object { type, action, background, 9 more }`

          使用 GPT 图像模型生成图像的工具。

          - `type: "image_generation"`

            图像生成工具的类型。始终为 `image_generation`.

            - `"image_generation"`

          - `action: optional "generate" or "edit" or "auto"`

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。支持透明背景的 GPT Image
            模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
            preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

              - `"gpt-image-2.5-sunburst"`

              - `"gpt-image-2.5-sunburst-2026-09-08"`

              - `"gpt-image-2.5-flare"`

              - `"gpt-image-2.5-flare-2026-09-08"`

          - `moderation: optional "auto" or "low"`

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩级别。默认值：100。

          - `output_format: optional "png" or "webp" or "jpeg"`

            生成图像的输出格式。可选值为 `png`, `webp`，或
            `jpeg`。之一。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or 3 more`

            生成图像的质量。GPT 图像模型支持 `low`,
            `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
            ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `"1024x1024"`

              - `"1024x1536"`

              - `"1536x1024"`

              - `"auto"`

        - `LocalShell object { type }`

          允许模型在本地环境中执行 shell 命令的工具。

          - `type: "local_shell"`

            本地 shell 工具的类型。始终为 `local_shell`.

            - `"local_shell"`

        - `Shell object { type, allowed_callers, environment }`

          允许模型执行 shell 命令的工具。

          - `type: "shell"`

            shell 工具的类型。始终为 `shell`.

            - `"shell"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

            - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

              - `type: "container_auto"`

                自动为本次请求创建容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

              - `skills: optional array of SkillReference or InlineSkill`

                可选的技能列表，通过 id 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    被引用技能的 ID。

                  - `type: "skill_reference"`

                    引用通过 /v1/skills 端点创建的技能。

                    - `"skill_reference"`

                  - `version: optional string`

                    可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `source: InlineSkillSource`

                    内联技能载荷

                    - `data: string`

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能载荷的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型。必须为 `base64`.

                      - `"base64"`

                  - `type: "inline"`

                    为本次请求定义一个内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `path: string`

                  包含技能的目录路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法。其一为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 6 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此函数是否应被延迟，并通过工具搜索被发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

- `error: EvalAPIError`

  表示来自 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

- `eval_id: string`

  关联评估的标识符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `model: string`

  被评估的模型（如果适用）。

- `name: string`

  评估运行的名称。

- `object: "eval.run"`

  对象的类型。始终为 "eval.run"。

  - `"eval.run"`

- `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

  评估运行期间每个模型的使用情况统计。

  - `cached_tokens: number`

    从缓存中检索到的 token 数量。

  - `completion_tokens: number`

    生成的完成 token 数量。

  - `invocation_count: number`

    调用次数。

  - `model_name: string`

    模型的名称。

  - `prompt_tokens: number`

    使用的提示 token 数量。

  - `total_tokens: number`

    使用的 token 总数。

- `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

  评估运行期间应用的每个测试标准的结果。

  - `failed: number`

    此标准未通过的测试数量。

  - `passed: number`

    此标准通过的测试数量。

  - `testing_criteria: string`

    测试标准的描述。

- `report_url: string`

  UI 仪表盘上渲染的评估运行报告的 URL。

- `result_counts: object { errored, failed, passed, total }`

  汇总评估运行结果的计数器。

  - `errored: number`

    出现错误的输出项数量。

  - `failed: number`

    未通过评估的输出项数量。

  - `passed: number`

    通过评估的输出项数量。

  - `total: number`

    已执行的输出项总数。

- `status: string`

  评估运行的状态。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "data_source": {
            "source": {
              "content": [
                {
                  "item": {
                    "foo": "bar"
                  }
                }
              ],
              "type": "file_content"
            },
            "type": "jsonl"
          }
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "data_source": {
    "source": {
      "content": [
        {
          "item": {
            "foo": "bar"
          },
          "sample": {
            "foo": "bar"
          }
        }
      ],
      "type": "file_content"
    },
    "type": "jsonl"
  },
  "error": {
    "code": "code",
    "message": "message"
  },
  "eval_id": "eval_id",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "eval.run",
  "per_model_usage": [
    {
      "cached_tokens": 0,
      "completion_tokens": 0,
      "invocation_count": 0,
      "model_name": "model_name",
      "prompt_tokens": 0,
      "total_tokens": 0
    }
  ],
  "per_testing_criteria_results": [
    {
      "failed": 0,
      "passed": 0,
      "testing_criteria": "testing_criteria"
    }
  ],
  "report_url": "https://example.com",
  "result_counts": {
    "errored": 0,
    "failed": 0,
    "passed": 0,
    "total": 0
  },
  "status": "status"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67e579652b548190aaa83ada4b125f47/runs \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"gpt-6-astra","data_source":{"type":"completions","input_messages":{"type":"template","template":[{"role":"developer","content":"Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"} , {"role":"user","content":"{{item.input}}"}]} ,"sampling_params":{"max_completions_tokens":2048},"model":"gpt-6-astra","source":{"type":"file_content","content":[{"item":{"input":"Tech Company Launches Advanced Artificial Intelligence Platform","ground_truth":"Technology"}}]}}}'
```

#### 响应

```json
{
  "object": "eval.run",
  "id": "evalrun_67e57965b480819094274e3a32235e4c",
  "eval_id": "eval_67e579652b548190aaa83ada4b125f47",
  "report_url": "https://platform.openai.com/evaluations/eval_67e579652b548190aaa83ada4b125f47&run_id=evalrun_67e57965b480819094274e3a32235e4c",
  "status": "queued",
  "model": "gpt-6-astra",
  "name": "gpt-6-astra",
  "created_at": 1743092069,
  "result_counts": {
    "total": 0,
    "errored": 0,
    "failed": 0,
    "passed": 0
  },
  "per_model_usage": null,
  "per_testing_criteria_results": null,
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        }
      ]
    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "{{item.input}}"
          }
        }
      ]
    },
    "model": "gpt-6-astra",
    "sampling_params": {
      "max_completions_tokens": 2048
    }
  },
  "error": null,
  "metadata": {}
}
```

## 删除评估运行

**删除** `/evals/{eval_id}/runs/{run_id}`

删除一个评估运行。

### 路径参数

- `eval_id: string`

- `run_id: string`

### Returns

- `deleted: optional boolean`

- `object: optional string`

- `run_id: optional string`

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "deleted": true,
  "object": "eval.run.deleted",
  "run_id": "evalrun_677469f564d48190807532a852da3afb"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_123abc/runs/evalrun_abc456 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval.run.deleted",
  "deleted": true,
  "run_id": "evalrun_abc456"
}
```

## 获取评估运行

**get** `/evals/{eval_id}/runs`

获取某个评估的运行列表。

### 路径参数

- `eval_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条运行的标识符。

- `limit: optional number`

  要检索的运行数量。

- `order: optional "asc" or "desc"`

  按时间戳排序的运行顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

- `status: optional "queued" or "in_progress" or "completed" or 2 more`

  按状态筛选运行。可选值为 `queued` | `in_progress` | `failed` | `completed` | `canceled`.

  - `"queued"`

  - `"in_progress"`

  - `"completed"`

  - `"canceled"`

  - `"failed"`

### Returns

- `data: array of object { id, created_at, data_source, 11 more }`

  一个 eval 运行对象数组。

  - `id: string`

    评估运行记录的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

    有关该运行数据源的信息。

    - `CreateEvalJSONLRunDataSource object { source, type }`

      一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

      - `source: object { content, type }  or object { id, type }`

        确定如何填充 `item` 数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

      - `type: "jsonl"`

        数据源的类型。始终为 `jsonl`.

        - `"jsonl"`

    - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

      一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

          一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

          - `type: "stored_completions"`

            数据源的类型。始终为 `stored_completions`.

            - `"stored_completions"`

          - `created_after: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

          - `created_before: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

          - `limit: optional number or null`

            一个可选的最大返回条目数量。

          - `metadata: optional Metadata or null`

            可附加到对象的 16 个键值对。这可以
            用于以结构化格式存储对象的附加信息，
            并通过 API 或控制台查询对象。

            键为字符串，最长 64 个字符。值为字符串，
            最长 512 个字符。

          - `model: optional string or null`

            一个可选的模型筛选条件（例如 'gpt-6-astra'）。

      - `type: "completions"`

        运行数据源的类型。始终为 `completions`.

        - `"completions"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `TemplateInputMessages object { template, type }`

          - `template: array of EasyInputMessage or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `EasyInputMessage object { content, role, phase, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputMessageContentList`

                发送给模型的文本、图像或音频输入，用于生成响应。
                也可以包含之前的助手响应。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputMessageContentList = array of ResponseInputContent`

                  发送给模型的一个或多个输入项的列表，包含不同的内容
                  类型。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                    - `text: string`

                      输入到模型的文本。

                    - `type: "input_text"`

                      输入项的类型。始终为 `input_text`.

                      - `"input_text"`

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputImage object { detail, type, file_id, 2 more }`

                    发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                    - `detail: ImageDetail`

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                      - `"low"`

                      - `"high"`

                      - `"auto"`

                      - `"original"`

                    - `type: "input_image"`

                      输入项的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `image_url: optional string or null`

                      要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputFile object { type, detail, file_data, 4 more }`

                    发送给模型的文件输入。

                    - `type: "input_file"`

                      输入项的类型。始终为 `input_file`.

                      - `"input_file"`

                    - `detail: optional "auto" or "low" or "high"`

                      要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                      - `"auto"`

                      - `"low"`

                      - `"high"`

                    - `file_data: optional string`

                      要发送给模型的文件内容。

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `file_url: optional string`

                      要发送给模型的文件的 URL。

                    - `filename: optional string`

                      要发送给模型的文件名称。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `phase: optional "commentary" or "final_answer" or null`

                将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
                对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
                阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

                - `"commentary"`

                - `"final_answer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                    输入到模型的文本。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                  - `OutputText object { text, type }`

                    模型输出的文本。

                    - `text: string`

                      模型输出的文本。

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

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `ItemReferenceInputMessages object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

          指定模型必须输出的格式的对象。

          设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
          Structured Outputs 可确保模型匹配你提供的 JSON
          schema。了解更多请参阅 [Structured Outputs
          指南](/api/docs/guides/structured-outputs).

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

            - `type: "text"`

              正在定义的响应格式的类型。始终为 `text`.

              - `"text"`

          - `ResponseFormatJSONSchema object { json_schema, type }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `json_schema: object { name, description, schema, strict }`

              Structured Outputs 配置选项，包括 JSON Schema。

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `schema: optional map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

            - `type: "json_object"`

              正在定义的响应格式的类型。始终为 `json_object`.

              - `"json_object"`

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `tools: optional array of ChatCompletionFunctionTool`

          模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

            - `description: optional string`

              对函数功能的描述，模型据此选择调用函数的时机与方式。

            - `parameters: optional FunctionParameters`

              函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

              省略 `parameters` 会定义一个空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

    - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

      一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

          一个 EvalResponsesSource 对象，用于描述运行数据源配置。

          - `type: "responses"`

            运行数据源的类型。始终为 `responses`.

            - `"responses"`

          - `created_after: optional number or null`

            仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

          - `created_before: optional number or null`

            仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

          - `instructions_search: optional string or null`

            用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

          - `metadata: optional unknown or null`

            responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

          - `model: optional string or null`

            用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

          - `reasoning_effort: optional ReasoningEffort or null`

            约束推理模型在推理上的投入程度。当前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
            降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
            并非所有推理模型都支持每个
            值。请参阅
            [推理指南](/api/docs/guides/reasoning)
            了解模型特定的支持情况。

          - `temperature: optional number or null`

            采样温度。这是用于筛选 responses 的查询参数。

          - `tools: optional array of string or null`

            工具名称列表。这是用于筛选 responses 的查询参数。

          - `top_p: optional number or null`

            核采样参数。这是用于筛选 responses 的查询参数。

          - `users: optional array of string or null`

            用户标识符列表。这是用于筛选 responses 的查询参数。

      - `type: "responses"`

        运行数据源的类型。始终为 `responses`.

        - `"responses"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `InputMessagesTemplate object { template, type }`

          - `template: array of object { content, role }  or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `ChatMessage object { content, role }`

              - `content: string`

                消息的内容。

              - `role: string`

                消息的角色（例如 "system"、"assistant"、"user"）。

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，其中每个输入可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `InputMessagesItemReference object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `text: optional object { format }`

          模型文本响应的配置选项。可以是纯
          文本或结构化 JSON 数据。了解更多：

          - [Text inputs and outputs](/api/docs/guides/text)
          - [Structured Outputs](/api/docs/guides/structured-outputs)

          - `format: optional ResponseFormatTextConfig`

            指定模型必须输出的格式的对象。

            配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
            从而确保模型匹配你提供的 JSON schema。详见
            [Structured Outputs 指南](/api/docs/guides/structured-outputs).

            默认格式为 `{ "type": "text" }` ，且不提供其他选项。

            **不建议用于 gpt-4o 及更新模型：**

            设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
            可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
            的模型，建议优先使用该模式。

            - `ResponseFormatText object { type }`

              默认响应格式。用于生成文本响应。

            - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

              JSON Schema 响应格式。用于生成结构化的 JSON 响应。
              详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `schema: map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `type: "json_schema"`

                正在定义的响应格式的类型。始终为 `json_schema`.

                - `"json_schema"`

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `ResponseFormatJSONObject object { type }`

              JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
              建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
              以执行此操作。
              这样做。

        - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          模型在生成响应时可以调用的工具数组。你可以
          通过设置 `tool_choice` 参数来指定要使用的工具。

          你可以提供给模型的两类工具是：

          - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
            能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
            或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
            [内置工具](/api/docs/guides/tools).
          - **函数调用（自定义工具）**：由你定义的函数，
            使模型能够调用你自己的代码。详细了解
            [function calling](/api/docs/guides/function-calling).

          - `Function object { name, parameters, strict, 6 more }`

            在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              对该函数的描述。模型使用该描述来决定是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `key: string`

                  要与该值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
                  - `in`：包含
                  - `nin`：不包含

                  - `"eq"`

                  - `"ne"`

                  - `"gt"`

                  - `"gte"`

                  - `"lt"`

                  - `"lte"`

                  - `"in"`

                  - `"nin"`

                - `value: string or number or boolean or array of string or number`

                  用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示屏的高度。

            - `display_width: number`

              计算机显示屏的宽度。

            - `environment: "windows" or "mac" or "linux" or 2 more`

              要控制的计算机环境类型。

              - `"windows"`

              - `"mac"`

              - `"linux"`

              - `"ubuntu"`

              - `"browser"`

            - `type: "computer_use_preview"`

              计算机使用工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。详细了解
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名也一并允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否被延迟，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP server 的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP server 的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP server 的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                需要批准的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的批准策略。可选值之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
                时， `never`，所有工具都不需要批准。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，
              用于指定可供代码使用的已上传文件 ID，
              以及一个可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  总是 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  代码解释器容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                    - `type: "disabled"`

                      禁用出站网络访问。始终为 `disabled`.

                      - `"disabled"`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                    - `allowed_domains: array of string`

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      可选的、限定域的、用于已加入白名单域的密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        要注入到该域的密钥的名称。

                      - `value: string`

                        要注入到该域的密钥值。

            - `type: "code_interpreter"`

              代码解释器工具的类型。始终为 `code_interpreter`.

              - `"code_interpreter"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

          - `ProgrammaticToolCalling object { type }`

            - `type: "programmatic_tool_calling"`

              工具的类型。始终为 `programmatic_tool_calling`.

              - `"programmatic_tool_calling"`

          - `ImageGeneration object { type, action, background, 9 more }`

            使用 GPT 图像模型生成图像的工具。

            - `type: "image_generation"`

              图像生成工具的类型。始终为 `image_generation`.

              - `"image_generation"`

            - `action: optional "generate" or "edit" or "auto"`

              生成新图像还是编辑现有图像。默认值： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。支持透明背景的 GPT Image
              模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
              preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于修复的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的蒙版图像。

            - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

                要使用的图像生成模型。可选值为 `gpt-image-1`,
                `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
                `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
                `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
                `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
                `gpt-image-1`.

                - `"gpt-image-1"`

                - `"gpt-image-1-mini"`

                - `"gpt-image-1.5"`

                - `"gpt-image-2"`

                - `"gpt-image-2-2026-04-21"`

                - `"gpt-image-2.5-sunburst"`

                - `"gpt-image-2.5-sunburst-2026-09-08"`

                - `"gpt-image-2.5-flare"`

                - `"gpt-image-2.5-flare-2026-09-08"`

            - `moderation: optional "auto" or "low"`

              生成图像的内容审核等级。默认值： `auto`.

              - `"auto"`

              - `"low"`

            - `output_compression: optional number`

              输出图像的压缩级别。默认值：100。

            - `output_format: optional "png" or "webp" or "jpeg"`

              生成图像的输出格式。可选值为 `png`, `webp`，或
              `jpeg`。之一。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or 3 more`

              生成图像的质量。GPT 图像模型支持 `low`,
              `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
              ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
              默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

                - `"1024x1024"`

                - `"1024x1536"`

                - `"1536x1024"`

                - `"auto"`

          - `LocalShell object { type }`

            允许模型在本地环境中执行 shell 命令的工具。

            - `type: "local_shell"`

              本地 shell 工具的类型。始终为 `local_shell`.

              - `"local_shell"`

          - `Shell object { type, allowed_callers, environment }`

            允许模型执行 shell 命令的工具。

            - `type: "shell"`

              shell 工具的类型。始终为 `shell`.

              - `"shell"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

              - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

                - `type: "container_auto"`

                  自动为本次请求创建容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `skills: optional array of SkillReference or InlineSkill`

                  可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                  - `InlineSkill object { description, name, source, type }`

                    - `description: string`

                      技能的描述。

                    - `name: string`

                      技能的名称。

                    - `source: InlineSkillSource`

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型。必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能来源的类型。必须为 `base64`.

                        - `"base64"`

                    - `type: "inline"`

                      为本次请求定义一个内联技能。

                      - `"inline"`

              - `LocalEnvironment object { type, skills }`

                - `type: "local"`

                  使用本地计算机环境。

                  - `"local"`

                - `skills: optional array of LocalSkill`

                  可选的技能列表。

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `path: string`

                    包含技能的目录路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

              - `Text object { type }`

                无约束的自由格式文本。

                - `type: "text"`

                  无约束文本格式。始终为 `text`.

                  - `"text"`

              - `Grammar object { definition, syntax, type }`

                由用户定义的语法。

                - `definition: string`

                  语法定义。

                - `syntax: "lark" or "regex"`

                  语法定义的语法。其一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

            - `description: string`

              展示给模型的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

            - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

              此命名空间内可用的函数/自定义工具。

              - `Function object { name, type, allowed_callers, 6 more }`

                - `name: string`

                - `type: "function"`

                  - `"function"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此函数是否应被延迟，并通过工具搜索被发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中识别它。

                - `type: "custom"`

                  自定义工具的类型。始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行的工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户所在位置。

              - `type: "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

          - `ApplyPatch object { type, allowed_callers }`

            允许助手使用 unified diff 创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终为 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `eval_id: string`

    关联评估的标识符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    被评估的模型（如果适用）。

  - `name: string`

    评估运行的名称。

  - `object: "eval.run"`

    对象的类型。始终为 "eval.run"。

    - `"eval.run"`

  - `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

    评估运行期间每个模型的使用情况统计。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `invocation_count: number`

      调用次数。

    - `model_name: string`

      模型的名称。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

  - `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

    评估运行期间应用的每个测试标准的结果。

    - `failed: number`

      此标准未通过的测试数量。

    - `passed: number`

      此标准通过的测试数量。

    - `testing_criteria: string`

      测试标准的描述。

  - `report_url: string`

    UI 仪表盘上渲染的评估运行报告的 URL。

  - `result_counts: object { errored, failed, passed, total }`

    汇总评估运行结果的计数器。

    - `errored: number`

      出现错误的输出项数量。

    - `failed: number`

      未通过评估的输出项数量。

    - `passed: number`

      通过评估的输出项数量。

    - `total: number`

      已执行的输出项总数。

  - `status: string`

    评估运行的状态。

- `first_id: string`

  data 数组中第一个 eval 运行的标识符。

- `has_more: boolean`

  指示是否还有更多 eval 可用。

- `last_id: string`

  data 数组中最后一个 eval 运行的标识符。

- `object: "list"`

  此对象的类型。始终设置为 "list"。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "data_source": {
        "source": {
          "content": [
            {
              "item": {
                "foo": "bar"
              },
              "sample": {
                "foo": "bar"
              }
            }
          ],
          "type": "file_content"
        },
        "type": "jsonl"
      },
      "error": {
        "code": "code",
        "message": "message"
      },
      "eval_id": "eval_id",
      "metadata": {
        "foo": "string"
      },
      "model": "model",
      "name": "name",
      "object": "eval.run",
      "per_model_usage": [
        {
          "cached_tokens": 0,
          "completion_tokens": 0,
          "invocation_count": 0,
          "model_name": "model_name",
          "prompt_tokens": 0,
          "total_tokens": 0
        }
      ],
      "per_testing_criteria_results": [
        {
          "failed": 0,
          "passed": 0,
          "testing_criteria": "testing_criteria"
        }
      ],
      "report_url": "https://example.com",
      "result_counts": {
        "errored": 0,
        "failed": 0,
        "passed": 0,
        "total": 0
      },
      "status": "status"
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
curl https://api.openai.com/v1/evals/egroup_67abd54d9b0081909a86353f6fb9317a/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "eval.run",
      "id": "evalrun_67e0c7d31560819090d60c0780591042",
      "eval_id": "eval_67e0c726d560819083f19a957c4c640b",
      "report_url": "https://platform.openai.com/evaluations/eval_67e0c726d560819083f19a957c4c640b",
      "status": "completed",
      "model": "o3-mini",
      "name": "bulk_with_negative_examples_o3-mini",
      "created_at": 1742784467,
      "result_counts": {
        "total": 1,
        "errored": 0,
        "failed": 0,
        "passed": 1
      },
      "per_model_usage": [
        {
          "model_name": "o3-mini",
          "invocation_count": 1,
          "prompt_tokens": 563,
          "completion_tokens": 874,
          "total_tokens": 1437,
          "cached_tokens": 0
        }
      ],
      "per_testing_criteria_results": [
        {
          "testing_criteria": "Push Notification Summary Grader-1808cd0b-eeec-4e0b-a519-337e79f4f5d1",
          "passed": 1,
          "failed": 0
        }
      ],
      "data_source": {
        "type": "completions",
        "source": {
          "type": "file_content",
          "content": [
            {
              "item": {
                "notifications": "\n- New message from Sarah: \"Can you call me later?\"\n- Your package has been delivered!\n- Flash sale: 20% off electronics for the next 2 hours!\n"
              }
            }
          ]
        },
        "input_messages": {
          "type": "template",
          "template": [
            {
              "type": "message",
              "role": "developer",
              "content": {
                "type": "input_text",
                "text": "\n\n\n\nYou are a helpful assistant that takes in an array of push notifications and returns a collapsed summary of them.\nThe push notification will be provided as follows:\n<push_notifications>\n...notificationlist...\n</push_notifications>\n\nYou should return just the summary and nothing else.\n\n\nYou should return a summary that is concise and snappy.\n\n\nHere is an example of a good summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert, package expected by 5pm, suggestion for new friend (Emily).\n</summary>\n\n\nHere is an example of a bad summary:\n<push_notifications>\n- Traffic alert: Accident reported on Main Street.- Package out for delivery: Expected by 5 PM.- New friend suggestion: Connect with Emma.\n</push_notifications>\n<summary>\nTraffic alert reported on main street. You have a package that will arrive by 5pm, Emily is a new friend suggested for you.\n</summary>\n"
              }
            },
            {
              "type": "message",
              "role": "user",
              "content": {
                "type": "input_text",
                "text": "<push_notifications>{{item.notifications}}</push_notifications>"
              }
            }
          ]
        },
        "model": "o3-mini",
        "sampling_params": null
      },
      "error": null,
      "metadata": {}
    }
  ],
  "first_id": "evalrun_67e0c7d31560819090d60c0780591042",
  "last_id": "evalrun_67e0c7d31560819090d60c0780591042",
  "has_more": true
}
```

## 获取评估运行

**get** `/evals/{eval_id}/runs/{run_id}`

根据 ID 获取评估运行。

### 路径参数

- `eval_id: string`

- `run_id: string`

### Returns

- `id: string`

  评估运行记录的唯一标识符。

- `created_at: number`

  评估运行记录创建时的 Unix 时间戳（以秒为单位）。

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  有关该运行数据源的信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

    - `source: object { content, type }  or object { id, type }`

      确定如何填充 `item` 数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

    - `type: "jsonl"`

      数据源的类型。始终为 `jsonl`.

      - `"jsonl"`

  - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

    一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

        一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

        - `type: "stored_completions"`

          数据源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

        - `created_before: optional number or null`

          一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

        - `limit: optional number or null`

          一个可选的最大返回条目数量。

        - `metadata: optional Metadata or null`

          可附加到对象的 16 个键值对。这可以
          用于以结构化格式存储对象的附加信息，
          并通过 API 或控制台查询对象。

          键为字符串，最长 64 个字符。值为字符串，
          最长 512 个字符。

        - `model: optional string or null`

          一个可选的模型筛选条件（例如 'gpt-6-astra'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputMessageContentList`

              发送给模型的文本、图像或音频输入，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                发送给模型的一个或多个输入项的列表，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                  - `text: string`

                    输入到模型的文本。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                  - `detail: ImageDetail`

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                    - `"low"`

                    - `"high"`

                    - `"auto"`

                    - `"original"`

                  - `type: "input_image"`

                    输入项的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `image_url: optional string or null`

                    要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  发送给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                    - `"auto"`

                    - `"low"`

                    - `"high"`

                  - `file_data: optional string`

                    要发送给模型的文件内容。

                  - `file_id: optional string or null`

                    要发送给模型的文件 ID。

                  - `file_url: optional string`

                    要发送给模型的文件的 URL。

                  - `filename: optional string`

                    要发送给模型的文件名称。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `phase: optional "commentary" or "final_answer" or null`

              将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
              对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
              阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `ItemReferenceInputMessages object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

        指定模型必须输出的格式的对象。

        设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
        Structured Outputs 可确保模型匹配你提供的 JSON
        schema。了解更多请参阅 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
        可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
        的模型，建议优先使用该模式。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
          以执行此操作。
          这样做。

          - `type: "json_object"`

            正在定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

          - `description: optional string`

            对函数功能的描述，模型据此选择调用函数的时机与方式。

          - `parameters: optional FunctionParameters`

            函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

            省略 `parameters` 会定义一个空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      确定如何填充 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 数据源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 数据源的类型。始终为 `file_id`.

          - `"file_id"`

      - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

        一个 EvalResponsesSource 对象，用于描述运行数据源配置。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

        - `created_before: optional number or null`

          仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

        - `instructions_search: optional string or null`

          用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

        - `metadata: optional unknown or null`

          responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

        - `model: optional string or null`

          用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `temperature: optional number or null`

          采样温度。这是用于筛选 responses 的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是用于筛选 responses 的查询参数。

        - `top_p: optional number or null`

          核采样参数。这是用于筛选 responses 的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是用于筛选 responses 的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令的
            优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
            角色给出的指令。使用 `user` 角色的消息假定为模型在之前
            `assistant` 交互中生成的内容。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `InputMessagesItemReference object { item_reference, type }`

        - `item_reference: string`

          对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。当前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
        并非所有推理模型都支持每个
        值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型特定的支持情况。

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [Text inputs and outputs](/api/docs/guides/text)
        - [Structured Outputs](/api/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
          从而确保模型匹配你提供的 JSON schema。详见
          [Structured Outputs 指南](/api/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，且不提供其他选项。

          **不建议用于 gpt-4o 及更新模型：**

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和连字符，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON 模式 [此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，模型会据此
              决定如何按该格式进行响应。

            - `strict: optional boolean or null`

              生成输出时是否启用严格的 schema 遵循。
              如果设置为 true，模型将始终遵循
              中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
              `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

      - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可以调用的工具数组。你可以
        通过设置 `tool_choice` 参数来指定要使用的工具。

        你可以提供给模型的两类工具是：

        - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
          能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
          或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
          [内置工具](/api/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。详细了解
          [function calling](/api/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。模型使用该描述来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

              - `key: string`

                要与该值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于等于
                - `lt`：小于
                - `lte`：小于等于
                - `in`：包含
                - `nin`：不包含

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示屏的高度。

          - `display_width: number`

            计算机显示屏的宽度。

          - `environment: "windows" or "mac" or "linux" or 2 more`

            要控制的计算机环境类型。

            - `"windows"`

            - `"mac"`

            - `"linux"`

            - `"ubuntu"`

            - `"browser"`

          - `type: "computer_use_preview"`

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。详细了解
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也一并允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示某个工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google Calendar: `connector_googlecalendar`
            - Google Drive: `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook Calendar: `connector_outlookcalendar`
            - Outlook Email: `connector_outlookemail`
            - SharePoint: `connector_sharepoint`

            - `"connector_dropbox"`

            - `"connector_gmail"`

            - `"connector_googlecalendar"`

            - `"connector_googledrive"`

            - `"connector_microsoftteams"`

            - `"connector_outlookcalendar"`

            - `"connector_outlookemail"`

            - `"connector_sharepoint"`

          - `defer_loading: optional boolean`

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP server 的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP server 的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP server 的哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的过滤对象
              需要批准的工具。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的批准策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
              时， `never`，所有工具都不需要批准。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，
            用于指定可供代码使用的已上传文件 ID，
            以及一个可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                总是 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                代码解释器容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                  - `type: "disabled"`

                    禁用出站网络访问。始终为 `disabled`.

                    - `"disabled"`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                  - `allowed_domains: array of string`

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的、限定域的、用于已加入白名单域的密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      要注入到该域的密钥的名称。

                    - `value: string`

                      要注入到该域的密钥值。

          - `type: "code_interpreter"`

            代码解释器工具的类型。始终为 `code_interpreter`.

            - `"code_interpreter"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

        - `ProgrammaticToolCalling object { type }`

          - `type: "programmatic_tool_calling"`

            工具的类型。始终为 `programmatic_tool_calling`.

            - `"programmatic_tool_calling"`

        - `ImageGeneration object { type, action, background, 9 more }`

          使用 GPT 图像模型生成图像的工具。

          - `type: "image_generation"`

            图像生成工具的类型。始终为 `image_generation`.

            - `"image_generation"`

          - `action: optional "generate" or "edit" or "auto"`

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。支持透明背景的 GPT Image
            模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
            preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

              - `"gpt-image-2.5-sunburst"`

              - `"gpt-image-2.5-sunburst-2026-09-08"`

              - `"gpt-image-2.5-flare"`

              - `"gpt-image-2.5-flare-2026-09-08"`

          - `moderation: optional "auto" or "low"`

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩级别。默认值：100。

          - `output_format: optional "png" or "webp" or "jpeg"`

            生成图像的输出格式。可选值为 `png`, `webp`，或
            `jpeg`。之一。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or 3 more`

            生成图像的质量。GPT 图像模型支持 `low`,
            `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
            ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `"1024x1024"`

              - `"1024x1536"`

              - `"1536x1024"`

              - `"auto"`

        - `LocalShell object { type }`

          允许模型在本地环境中执行 shell 命令的工具。

          - `type: "local_shell"`

            本地 shell 工具的类型。始终为 `local_shell`.

            - `"local_shell"`

        - `Shell object { type, allowed_callers, environment }`

          允许模型执行 shell 命令的工具。

          - `type: "shell"`

            shell 工具的类型。始终为 `shell`.

            - `"shell"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

            - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

              - `type: "container_auto"`

                自动为本次请求创建容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件的可选列表。

              - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                容器的内存限制。

                - `"1g"`

                - `"4g"`

                - `"16g"`

                - `"64g"`

              - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                容器的网络访问策略。

                - `ContainerNetworkPolicyDisabled object { type }`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

              - `skills: optional array of SkillReference or InlineSkill`

                可选的技能列表，通过 id 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    被引用技能的 ID。

                  - `type: "skill_reference"`

                    引用通过 /v1/skills 端点创建的技能。

                    - `"skill_reference"`

                  - `version: optional string`

                    可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `source: InlineSkillSource`

                    内联技能载荷

                    - `data: string`

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能载荷的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型。必须为 `base64`.

                      - `"base64"`

                  - `type: "inline"`

                    为本次请求定义一个内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `path: string`

                  包含技能的目录路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法。其一为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 6 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此函数是否应被延迟，并通过工具搜索被发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

- `error: EvalAPIError`

  表示来自 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

- `eval_id: string`

  关联评估的标识符。

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对。这可以
  用于以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `model: string`

  被评估的模型（如果适用）。

- `name: string`

  评估运行的名称。

- `object: "eval.run"`

  对象的类型。始终为 "eval.run"。

  - `"eval.run"`

- `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

  评估运行期间每个模型的使用情况统计。

  - `cached_tokens: number`

    从缓存中检索到的 token 数量。

  - `completion_tokens: number`

    生成的完成 token 数量。

  - `invocation_count: number`

    调用次数。

  - `model_name: string`

    模型的名称。

  - `prompt_tokens: number`

    使用的提示 token 数量。

  - `total_tokens: number`

    使用的 token 总数。

- `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

  评估运行期间应用的每个测试标准的结果。

  - `failed: number`

    此标准未通过的测试数量。

  - `passed: number`

    此标准通过的测试数量。

  - `testing_criteria: string`

    测试标准的描述。

- `report_url: string`

  UI 仪表盘上渲染的评估运行报告的 URL。

- `result_counts: object { errored, failed, passed, total }`

  汇总评估运行结果的计数器。

  - `errored: number`

    出现错误的输出项数量。

  - `failed: number`

    未通过评估的输出项数量。

  - `passed: number`

    通过评估的输出项数量。

  - `total: number`

    已执行的输出项总数。

- `status: string`

  评估运行的状态。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "data_source": {
    "source": {
      "content": [
        {
          "item": {
            "foo": "bar"
          },
          "sample": {
            "foo": "bar"
          }
        }
      ],
      "type": "file_content"
    },
    "type": "jsonl"
  },
  "error": {
    "code": "code",
    "message": "message"
  },
  "eval_id": "eval_id",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "eval.run",
  "per_model_usage": [
    {
      "cached_tokens": 0,
      "completion_tokens": 0,
      "invocation_count": 0,
      "model_name": "model_name",
      "prompt_tokens": 0,
      "total_tokens": 0
    }
  ],
  "per_testing_criteria_results": [
    {
      "failed": 0,
      "passed": 0,
      "testing_criteria": "testing_criteria"
    }
  ],
  "report_url": "https://example.com",
  "result_counts": {
    "errored": 0,
    "failed": 0,
    "passed": 0,
    "total": 0
  },
  "status": "status"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval.run",
  "id": "evalrun_67abd54d60ec8190832b46859da808f7",
  "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "report_url": "https://platform.openai.com/evaluations/eval_67abd54d9b0081909a86353f6fb9317a?run_id=evalrun_67abd54d60ec8190832b46859da808f7",
  "status": "queued",
  "model": "gpt-6-astra",
  "name": "gpt-6-astra",
  "created_at": 1743092069,
  "result_counts": {
    "total": 0,
    "errored": 0,
    "failed": 0,
    "passed": 0
  },
  "per_model_usage": null,
  "per_testing_criteria_results": null,
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Central Bank Increases Interest Rates Amid Inflation Concerns",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Summit Addresses Climate Change Strategies",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Major Retailer Reports Record-Breaking Holiday Sales",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "National Team Qualifies for World Championship Finals",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Stock Markets Rally After Positive Economic Data Released",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "Global Manufacturer Announces Merger with Competitor",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Breakthrough in Renewable Energy Technology Unveiled",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "World Leaders Sign Historic Climate Agreement",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Professional Athlete Sets New Record in Championship Event",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Financial Institutions Adapt to New Regulatory Requirements",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Tech Conference Showcases Advances in Artificial Intelligence",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Global Markets Respond to Oil Price Fluctuations",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Cooperation Strengthened Through New Treaty",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Sports League Announces Revised Schedule for Upcoming Season",
            "ground_truth": "Sports"
          }
        }
      ]
    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "{{item.input}}"
          }
        }
      ]
    },
    "model": "gpt-6-astra",
    "sampling_params": {
      "max_completions_tokens": 2048
    }
  },
  "error": null,
  "metadata": {}
}
```

## Domain Types

### 创建评估补全运行数据源

- `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

  一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

  - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

    确定如何填充 `item` 该运行数据源中的命名空间。

    - `EvalJSONLFileContentSource object { content, type }`

      - `content: array of object { item, sample }`

        jsonl 文件的内容。

        - `item: map[unknown]`

        - `sample: optional map[unknown]`

      - `type: "file_content"`

        jsonl 数据源的类型。始终为 `file_content`.

        - `"file_content"`

    - `EvalJSONLFileIDSource object { id, type }`

      - `id: string`

        文件的标识符。

      - `type: "file_id"`

        jsonl 数据源的类型。始终为 `file_id`.

        - `"file_id"`

    - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

      一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

      - `type: "stored_completions"`

        数据源的类型。始终为 `stored_completions`.

        - `"stored_completions"`

      - `created_after: optional number or null`

        一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

      - `created_before: optional number or null`

        一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

      - `limit: optional number or null`

        一个可选的最大返回条目数量。

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对。这可以
        用于以结构化格式存储对象的附加信息，
        并通过 API 或控制台查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

      - `model: optional string or null`

        一个可选的模型筛选条件（例如 'gpt-6-astra'）。

  - `type: "completions"`

    运行数据源的类型。始终为 `completions`.

    - `"completions"`

  - `input_messages: optional object { template, type }  or object { item_reference, type }`

    在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

    - `TemplateInputMessages object { template, type }`

      - `template: array of EasyInputMessage or object { content, role, type }`

        构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

        - `EasyInputMessage object { content, role, phase, type }`

          输入到模型的消息，其角色用于指示指令的
          优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
          角色给出的指令。使用 `user` 角色的消息假定为模型在之前
          `assistant` 交互中生成的内容。
          交互。

          - `content: string or ResponseInputMessageContentList`

            发送给模型的文本、图像或音频输入，用于生成响应。
            也可以包含之前的助手响应。

            - `TextInput = string`

              输入到模型的文本。

            - `ResponseInputMessageContentList = array of ResponseInputContent`

              发送给模型的一个或多个输入项的列表，包含不同的内容
              类型。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

                - `text: string`

                  输入到模型的文本。

                - `type: "input_text"`

                  输入项的类型。始终为 `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `ResponseInputImage object { detail, type, file_id, 2 more }`

                发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                - `detail: ImageDetail`

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                  - `"low"`

                  - `"high"`

                  - `"auto"`

                  - `"original"`

                - `type: "input_image"`

                  输入项的类型。始终为 `input_image`.

                  - `"input_image"`

                - `file_id: optional string or null`

                  要发送给模型的文件 ID。

                - `image_url: optional string or null`

                  要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                - `prompt_cache_breakpoint: optional object { mode }`

                  标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `ResponseInputFile object { type, detail, file_data, 4 more }`

                发送给模型的文件输入。

                - `type: "input_file"`

                  输入项的类型。始终为 `input_file`.

                  - `"input_file"`

                - `detail: optional "auto" or "low" or "high"`

                  要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                  - `"auto"`

                  - `"low"`

                  - `"high"`

                - `file_data: optional string`

                  要发送给模型的文件内容。

                - `file_id: optional string or null`

                  要发送给模型的文件 ID。

                - `file_url: optional string`

                  要发送给模型的文件的 URL。

                - `filename: optional string`

                  要发送给模型的文件名称。

                - `prompt_cache_breakpoint: optional object { mode }`

                  标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `phase: optional "commentary" or "final_answer" or null`

            将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
            对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
            阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

            - `"commentary"`

            - `"final_answer"`

          - `type: optional "message"`

            消息输入的类型。始终为 `message`.

            - `"message"`

        - `EvalMessageObject object { content, role, type }`

          输入到模型的消息，其角色用于指示指令的
          优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
          角色给出的指令。使用 `user` 角色的消息假定为模型在之前
          `assistant` 交互中生成的内容。
          交互。

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

            - `TextInput = string`

              输入到模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入到模型的文本。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

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

                要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型输出的文本。

                - `text: string`

                  模型输出的文本。

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

                  要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `type: optional "message"`

            消息输入的类型。始终为 `message`.

            - `"message"`

      - `type: "template"`

        输入消息的类型。始终为 `template`.

        - `"template"`

    - `ItemReferenceInputMessages object { item_reference, type }`

      - `item_reference: string`

        对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

      - `type: "item_reference"`

        输入消息的类型。始终为 `item_reference`.

        - `"item_reference"`

  - `model: optional string`

    用于生成补全的模型名称（例如 "o3-mini"）。

  - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

    - `max_completion_tokens: optional number`

      生成输出中的最大 token 数。

    - `reasoning_effort: optional ReasoningEffort or null`

      约束推理模型在推理上的投入程度。当前支持的
      值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
      降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
      并非所有推理模型都支持每个
      值。请参阅
      [推理指南](/api/docs/guides/reasoning)
      了解模型特定的支持情况。

      - `"none"`

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

    - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

      指定模型必须输出的格式的对象。

      设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
      Structured Outputs 可确保模型匹配你提供的 JSON
      schema。了解更多请参阅 [Structured Outputs
      指南](/api/docs/guides/structured-outputs).

      设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
      可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
      的模型，建议优先使用该模式。

      - `ResponseFormatText object { type }`

        默认响应格式。用于生成文本响应。

        - `type: "text"`

          正在定义的响应格式的类型。始终为 `text`.

          - `"text"`

      - `ResponseFormatJSONSchema object { json_schema, type }`

        JSON Schema 响应格式。用于生成结构化的 JSON 响应。
        详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

        - `json_schema: object { name, description, schema, strict }`

          Structured Outputs 配置选项，包括 JSON Schema。

          - `name: string`

            响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
            下划线和连字符，最大长度为 64。

          - `description: optional string`

            对响应格式用途的描述，模型会据此
            决定如何按该格式进行响应。

          - `schema: optional map[unknown]`

            响应格式的 schema，以 JSON Schema 对象形式描述。
            了解如何构建 JSON 模式 [此处](https://json-schema.org/).

          - `strict: optional boolean or null`

            生成输出时是否启用严格的 schema 遵循。
            如果设置为 true，模型将始终遵循
            中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
            `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
            指南](/api/docs/guides/structured-outputs).

        - `type: "json_schema"`

          正在定义的响应格式的类型。始终为 `json_schema`.

          - `"json_schema"`

      - `ResponseFormatJSONObject object { type }`

        JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
        建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
        以执行此操作。
        这样做。

        - `type: "json_object"`

          正在定义的响应格式的类型。始终为 `json_object`.

          - `"json_object"`

    - `seed: optional number`

      用于在采样过程中初始化随机性的种子值。

    - `temperature: optional number`

      较高的 temperature 会增加输出的随机性。

    - `tools: optional array of ChatCompletionFunctionTool`

      模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          对函数功能的描述，模型据此选择调用函数的时机与方式。

        - `parameters: optional FunctionParameters`

          函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

          省略 `parameters` 会定义一个空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

      - `type: "function"`

        工具的类型。目前仅支持 `function` 。

        - `"function"`

    - `top_p: optional number`

      作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

### 创建评估 JSONL 运行数据源

- `CreateEvalJSONLRunDataSource object { source, type }`

  一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

  - `source: object { content, type }  or object { id, type }`

    确定如何填充 `item` 数据源中的命名空间。

    - `EvalJSONLFileContentSource object { content, type }`

      - `content: array of object { item, sample }`

        jsonl 文件的内容。

        - `item: map[unknown]`

        - `sample: optional map[unknown]`

      - `type: "file_content"`

        jsonl 数据源的类型。始终为 `file_content`.

        - `"file_content"`

    - `EvalJSONLFileIDSource object { id, type }`

      - `id: string`

        文件的标识符。

      - `type: "file_id"`

        jsonl 数据源的类型。始终为 `file_id`.

        - `"file_id"`

  - `type: "jsonl"`

    数据源的类型。始终为 `jsonl`.

    - `"jsonl"`

### 评估 API 错误

- `EvalAPIError object { code, message }`

  表示来自 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

### 运行取消响应

- `RunCancelResponse object { id, created_at, data_source, 11 more }`

  表示一次评估运行（evaluation run）的 schema。

  - `id: string`

    评估运行记录的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

    有关该运行数据源的信息。

    - `CreateEvalJSONLRunDataSource object { source, type }`

      一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

      - `source: object { content, type }  or object { id, type }`

        确定如何填充 `item` 数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

      - `type: "jsonl"`

        数据源的类型。始终为 `jsonl`.

        - `"jsonl"`

    - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

      一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

          一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

          - `type: "stored_completions"`

            数据源的类型。始终为 `stored_completions`.

            - `"stored_completions"`

          - `created_after: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

          - `created_before: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

          - `limit: optional number or null`

            一个可选的最大返回条目数量。

          - `metadata: optional Metadata or null`

            可附加到对象的 16 个键值对。这可以
            用于以结构化格式存储对象的附加信息，
            并通过 API 或控制台查询对象。

            键为字符串，最长 64 个字符。值为字符串，
            最长 512 个字符。

          - `model: optional string or null`

            一个可选的模型筛选条件（例如 'gpt-6-astra'）。

      - `type: "completions"`

        运行数据源的类型。始终为 `completions`.

        - `"completions"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `TemplateInputMessages object { template, type }`

          - `template: array of EasyInputMessage or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `EasyInputMessage object { content, role, phase, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputMessageContentList`

                发送给模型的文本、图像或音频输入，用于生成响应。
                也可以包含之前的助手响应。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputMessageContentList = array of ResponseInputContent`

                  发送给模型的一个或多个输入项的列表，包含不同的内容
                  类型。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                    - `text: string`

                      输入到模型的文本。

                    - `type: "input_text"`

                      输入项的类型。始终为 `input_text`.

                      - `"input_text"`

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputImage object { detail, type, file_id, 2 more }`

                    发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                    - `detail: ImageDetail`

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                      - `"low"`

                      - `"high"`

                      - `"auto"`

                      - `"original"`

                    - `type: "input_image"`

                      输入项的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `image_url: optional string or null`

                      要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputFile object { type, detail, file_data, 4 more }`

                    发送给模型的文件输入。

                    - `type: "input_file"`

                      输入项的类型。始终为 `input_file`.

                      - `"input_file"`

                    - `detail: optional "auto" or "low" or "high"`

                      要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                      - `"auto"`

                      - `"low"`

                      - `"high"`

                    - `file_data: optional string`

                      要发送给模型的文件内容。

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `file_url: optional string`

                      要发送给模型的文件的 URL。

                    - `filename: optional string`

                      要发送给模型的文件名称。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `phase: optional "commentary" or "final_answer" or null`

                将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
                对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
                阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

                - `"commentary"`

                - `"final_answer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                    输入到模型的文本。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                  - `OutputText object { text, type }`

                    模型输出的文本。

                    - `text: string`

                      模型输出的文本。

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

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `ItemReferenceInputMessages object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

          指定模型必须输出的格式的对象。

          设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
          Structured Outputs 可确保模型匹配你提供的 JSON
          schema。了解更多请参阅 [Structured Outputs
          指南](/api/docs/guides/structured-outputs).

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

            - `type: "text"`

              正在定义的响应格式的类型。始终为 `text`.

              - `"text"`

          - `ResponseFormatJSONSchema object { json_schema, type }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `json_schema: object { name, description, schema, strict }`

              Structured Outputs 配置选项，包括 JSON Schema。

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `schema: optional map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

            - `type: "json_object"`

              正在定义的响应格式的类型。始终为 `json_object`.

              - `"json_object"`

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `tools: optional array of ChatCompletionFunctionTool`

          模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

            - `description: optional string`

              对函数功能的描述，模型据此选择调用函数的时机与方式。

            - `parameters: optional FunctionParameters`

              函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

              省略 `parameters` 会定义一个空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

    - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

      一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

          一个 EvalResponsesSource 对象，用于描述运行数据源配置。

          - `type: "responses"`

            运行数据源的类型。始终为 `responses`.

            - `"responses"`

          - `created_after: optional number or null`

            仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

          - `created_before: optional number or null`

            仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

          - `instructions_search: optional string or null`

            用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

          - `metadata: optional unknown or null`

            responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

          - `model: optional string or null`

            用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

          - `reasoning_effort: optional ReasoningEffort or null`

            约束推理模型在推理上的投入程度。当前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
            降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
            并非所有推理模型都支持每个
            值。请参阅
            [推理指南](/api/docs/guides/reasoning)
            了解模型特定的支持情况。

          - `temperature: optional number or null`

            采样温度。这是用于筛选 responses 的查询参数。

          - `tools: optional array of string or null`

            工具名称列表。这是用于筛选 responses 的查询参数。

          - `top_p: optional number or null`

            核采样参数。这是用于筛选 responses 的查询参数。

          - `users: optional array of string or null`

            用户标识符列表。这是用于筛选 responses 的查询参数。

      - `type: "responses"`

        运行数据源的类型。始终为 `responses`.

        - `"responses"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `InputMessagesTemplate object { template, type }`

          - `template: array of object { content, role }  or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `ChatMessage object { content, role }`

              - `content: string`

                消息的内容。

              - `role: string`

                消息的角色（例如 "system"、"assistant"、"user"）。

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，其中每个输入可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `InputMessagesItemReference object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `text: optional object { format }`

          模型文本响应的配置选项。可以是纯
          文本或结构化 JSON 数据。了解更多：

          - [Text inputs and outputs](/api/docs/guides/text)
          - [Structured Outputs](/api/docs/guides/structured-outputs)

          - `format: optional ResponseFormatTextConfig`

            指定模型必须输出的格式的对象。

            配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
            从而确保模型匹配你提供的 JSON schema。详见
            [Structured Outputs 指南](/api/docs/guides/structured-outputs).

            默认格式为 `{ "type": "text" }` ，且不提供其他选项。

            **不建议用于 gpt-4o 及更新模型：**

            设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
            可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
            的模型，建议优先使用该模式。

            - `ResponseFormatText object { type }`

              默认响应格式。用于生成文本响应。

            - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

              JSON Schema 响应格式。用于生成结构化的 JSON 响应。
              详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `schema: map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `type: "json_schema"`

                正在定义的响应格式的类型。始终为 `json_schema`.

                - `"json_schema"`

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `ResponseFormatJSONObject object { type }`

              JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
              建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
              以执行此操作。
              这样做。

        - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          模型在生成响应时可以调用的工具数组。你可以
          通过设置 `tool_choice` 参数来指定要使用的工具。

          你可以提供给模型的两类工具是：

          - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
            能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
            或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
            [内置工具](/api/docs/guides/tools).
          - **函数调用（自定义工具）**：由你定义的函数，
            使模型能够调用你自己的代码。详细了解
            [function calling](/api/docs/guides/function-calling).

          - `Function object { name, parameters, strict, 6 more }`

            在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              对该函数的描述。模型使用该描述来决定是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `key: string`

                  要与该值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
                  - `in`：包含
                  - `nin`：不包含

                  - `"eq"`

                  - `"ne"`

                  - `"gt"`

                  - `"gte"`

                  - `"lt"`

                  - `"lte"`

                  - `"in"`

                  - `"nin"`

                - `value: string or number or boolean or array of string or number`

                  用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示屏的高度。

            - `display_width: number`

              计算机显示屏的宽度。

            - `environment: "windows" or "mac" or "linux" or 2 more`

              要控制的计算机环境类型。

              - `"windows"`

              - `"mac"`

              - `"linux"`

              - `"ubuntu"`

              - `"browser"`

            - `type: "computer_use_preview"`

              计算机使用工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。详细了解
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名也一并允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否被延迟，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP server 的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP server 的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP server 的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                需要批准的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的批准策略。可选值之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
                时， `never`，所有工具都不需要批准。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，
              用于指定可供代码使用的已上传文件 ID，
              以及一个可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  总是 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  代码解释器容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                    - `type: "disabled"`

                      禁用出站网络访问。始终为 `disabled`.

                      - `"disabled"`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                    - `allowed_domains: array of string`

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      可选的、限定域的、用于已加入白名单域的密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        要注入到该域的密钥的名称。

                      - `value: string`

                        要注入到该域的密钥值。

            - `type: "code_interpreter"`

              代码解释器工具的类型。始终为 `code_interpreter`.

              - `"code_interpreter"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

          - `ProgrammaticToolCalling object { type }`

            - `type: "programmatic_tool_calling"`

              工具的类型。始终为 `programmatic_tool_calling`.

              - `"programmatic_tool_calling"`

          - `ImageGeneration object { type, action, background, 9 more }`

            使用 GPT 图像模型生成图像的工具。

            - `type: "image_generation"`

              图像生成工具的类型。始终为 `image_generation`.

              - `"image_generation"`

            - `action: optional "generate" or "edit" or "auto"`

              生成新图像还是编辑现有图像。默认值： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。支持透明背景的 GPT Image
              模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
              preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于修复的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的蒙版图像。

            - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

                要使用的图像生成模型。可选值为 `gpt-image-1`,
                `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
                `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
                `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
                `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
                `gpt-image-1`.

                - `"gpt-image-1"`

                - `"gpt-image-1-mini"`

                - `"gpt-image-1.5"`

                - `"gpt-image-2"`

                - `"gpt-image-2-2026-04-21"`

                - `"gpt-image-2.5-sunburst"`

                - `"gpt-image-2.5-sunburst-2026-09-08"`

                - `"gpt-image-2.5-flare"`

                - `"gpt-image-2.5-flare-2026-09-08"`

            - `moderation: optional "auto" or "low"`

              生成图像的内容审核等级。默认值： `auto`.

              - `"auto"`

              - `"low"`

            - `output_compression: optional number`

              输出图像的压缩级别。默认值：100。

            - `output_format: optional "png" or "webp" or "jpeg"`

              生成图像的输出格式。可选值为 `png`, `webp`，或
              `jpeg`。之一。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or 3 more`

              生成图像的质量。GPT 图像模型支持 `low`,
              `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
              ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
              默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

                - `"1024x1024"`

                - `"1024x1536"`

                - `"1536x1024"`

                - `"auto"`

          - `LocalShell object { type }`

            允许模型在本地环境中执行 shell 命令的工具。

            - `type: "local_shell"`

              本地 shell 工具的类型。始终为 `local_shell`.

              - `"local_shell"`

          - `Shell object { type, allowed_callers, environment }`

            允许模型执行 shell 命令的工具。

            - `type: "shell"`

              shell 工具的类型。始终为 `shell`.

              - `"shell"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

              - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

                - `type: "container_auto"`

                  自动为本次请求创建容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `skills: optional array of SkillReference or InlineSkill`

                  可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                  - `InlineSkill object { description, name, source, type }`

                    - `description: string`

                      技能的描述。

                    - `name: string`

                      技能的名称。

                    - `source: InlineSkillSource`

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型。必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能来源的类型。必须为 `base64`.

                        - `"base64"`

                    - `type: "inline"`

                      为本次请求定义一个内联技能。

                      - `"inline"`

              - `LocalEnvironment object { type, skills }`

                - `type: "local"`

                  使用本地计算机环境。

                  - `"local"`

                - `skills: optional array of LocalSkill`

                  可选的技能列表。

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `path: string`

                    包含技能的目录路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

              - `Text object { type }`

                无约束的自由格式文本。

                - `type: "text"`

                  无约束文本格式。始终为 `text`.

                  - `"text"`

              - `Grammar object { definition, syntax, type }`

                由用户定义的语法。

                - `definition: string`

                  语法定义。

                - `syntax: "lark" or "regex"`

                  语法定义的语法。其一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

            - `description: string`

              展示给模型的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

            - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

              此命名空间内可用的函数/自定义工具。

              - `Function object { name, type, allowed_callers, 6 more }`

                - `name: string`

                - `type: "function"`

                  - `"function"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此函数是否应被延迟，并通过工具搜索被发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中识别它。

                - `type: "custom"`

                  自定义工具的类型。始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行的工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户所在位置。

              - `type: "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

          - `ApplyPatch object { type, allowed_callers }`

            允许助手使用 unified diff 创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终为 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `eval_id: string`

    关联评估的标识符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    被评估的模型（如果适用）。

  - `name: string`

    评估运行的名称。

  - `object: "eval.run"`

    对象的类型。始终为 "eval.run"。

    - `"eval.run"`

  - `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

    评估运行期间每个模型的使用情况统计。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `invocation_count: number`

      调用次数。

    - `model_name: string`

      模型的名称。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

  - `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

    评估运行期间应用的每个测试标准的结果。

    - `failed: number`

      此标准未通过的测试数量。

    - `passed: number`

      此标准通过的测试数量。

    - `testing_criteria: string`

      测试标准的描述。

  - `report_url: string`

    UI 仪表盘上渲染的评估运行报告的 URL。

  - `result_counts: object { errored, failed, passed, total }`

    汇总评估运行结果的计数器。

    - `errored: number`

      出现错误的输出项数量。

    - `failed: number`

      未通过评估的输出项数量。

    - `passed: number`

      通过评估的输出项数量。

    - `total: number`

      已执行的输出项总数。

  - `status: string`

    评估运行的状态。

### Run 创建响应

- `RunCreateResponse object { id, created_at, data_source, 11 more }`

  表示一次评估运行（evaluation run）的 schema。

  - `id: string`

    评估运行记录的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

    有关该运行数据源的信息。

    - `CreateEvalJSONLRunDataSource object { source, type }`

      一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

      - `source: object { content, type }  or object { id, type }`

        确定如何填充 `item` 数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

      - `type: "jsonl"`

        数据源的类型。始终为 `jsonl`.

        - `"jsonl"`

    - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

      一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

          一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

          - `type: "stored_completions"`

            数据源的类型。始终为 `stored_completions`.

            - `"stored_completions"`

          - `created_after: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

          - `created_before: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

          - `limit: optional number or null`

            一个可选的最大返回条目数量。

          - `metadata: optional Metadata or null`

            可附加到对象的 16 个键值对。这可以
            用于以结构化格式存储对象的附加信息，
            并通过 API 或控制台查询对象。

            键为字符串，最长 64 个字符。值为字符串，
            最长 512 个字符。

          - `model: optional string or null`

            一个可选的模型筛选条件（例如 'gpt-6-astra'）。

      - `type: "completions"`

        运行数据源的类型。始终为 `completions`.

        - `"completions"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `TemplateInputMessages object { template, type }`

          - `template: array of EasyInputMessage or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `EasyInputMessage object { content, role, phase, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputMessageContentList`

                发送给模型的文本、图像或音频输入，用于生成响应。
                也可以包含之前的助手响应。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputMessageContentList = array of ResponseInputContent`

                  发送给模型的一个或多个输入项的列表，包含不同的内容
                  类型。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                    - `text: string`

                      输入到模型的文本。

                    - `type: "input_text"`

                      输入项的类型。始终为 `input_text`.

                      - `"input_text"`

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputImage object { detail, type, file_id, 2 more }`

                    发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                    - `detail: ImageDetail`

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                      - `"low"`

                      - `"high"`

                      - `"auto"`

                      - `"original"`

                    - `type: "input_image"`

                      输入项的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `image_url: optional string or null`

                      要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputFile object { type, detail, file_data, 4 more }`

                    发送给模型的文件输入。

                    - `type: "input_file"`

                      输入项的类型。始终为 `input_file`.

                      - `"input_file"`

                    - `detail: optional "auto" or "low" or "high"`

                      要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                      - `"auto"`

                      - `"low"`

                      - `"high"`

                    - `file_data: optional string`

                      要发送给模型的文件内容。

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `file_url: optional string`

                      要发送给模型的文件的 URL。

                    - `filename: optional string`

                      要发送给模型的文件名称。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `phase: optional "commentary" or "final_answer" or null`

                将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
                对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
                阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

                - `"commentary"`

                - `"final_answer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                    输入到模型的文本。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                  - `OutputText object { text, type }`

                    模型输出的文本。

                    - `text: string`

                      模型输出的文本。

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

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `ItemReferenceInputMessages object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

          指定模型必须输出的格式的对象。

          设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
          Structured Outputs 可确保模型匹配你提供的 JSON
          schema。了解更多请参阅 [Structured Outputs
          指南](/api/docs/guides/structured-outputs).

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

            - `type: "text"`

              正在定义的响应格式的类型。始终为 `text`.

              - `"text"`

          - `ResponseFormatJSONSchema object { json_schema, type }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `json_schema: object { name, description, schema, strict }`

              Structured Outputs 配置选项，包括 JSON Schema。

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `schema: optional map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

            - `type: "json_object"`

              正在定义的响应格式的类型。始终为 `json_object`.

              - `"json_object"`

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `tools: optional array of ChatCompletionFunctionTool`

          模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

            - `description: optional string`

              对函数功能的描述，模型据此选择调用函数的时机与方式。

            - `parameters: optional FunctionParameters`

              函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

              省略 `parameters` 会定义一个空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

    - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

      一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

          一个 EvalResponsesSource 对象，用于描述运行数据源配置。

          - `type: "responses"`

            运行数据源的类型。始终为 `responses`.

            - `"responses"`

          - `created_after: optional number or null`

            仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

          - `created_before: optional number or null`

            仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

          - `instructions_search: optional string or null`

            用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

          - `metadata: optional unknown or null`

            responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

          - `model: optional string or null`

            用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

          - `reasoning_effort: optional ReasoningEffort or null`

            约束推理模型在推理上的投入程度。当前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
            降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
            并非所有推理模型都支持每个
            值。请参阅
            [推理指南](/api/docs/guides/reasoning)
            了解模型特定的支持情况。

          - `temperature: optional number or null`

            采样温度。这是用于筛选 responses 的查询参数。

          - `tools: optional array of string or null`

            工具名称列表。这是用于筛选 responses 的查询参数。

          - `top_p: optional number or null`

            核采样参数。这是用于筛选 responses 的查询参数。

          - `users: optional array of string or null`

            用户标识符列表。这是用于筛选 responses 的查询参数。

      - `type: "responses"`

        运行数据源的类型。始终为 `responses`.

        - `"responses"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `InputMessagesTemplate object { template, type }`

          - `template: array of object { content, role }  or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `ChatMessage object { content, role }`

              - `content: string`

                消息的内容。

              - `role: string`

                消息的角色（例如 "system"、"assistant"、"user"）。

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，其中每个输入可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `InputMessagesItemReference object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `text: optional object { format }`

          模型文本响应的配置选项。可以是纯
          文本或结构化 JSON 数据。了解更多：

          - [Text inputs and outputs](/api/docs/guides/text)
          - [Structured Outputs](/api/docs/guides/structured-outputs)

          - `format: optional ResponseFormatTextConfig`

            指定模型必须输出的格式的对象。

            配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
            从而确保模型匹配你提供的 JSON schema。详见
            [Structured Outputs 指南](/api/docs/guides/structured-outputs).

            默认格式为 `{ "type": "text" }` ，且不提供其他选项。

            **不建议用于 gpt-4o 及更新模型：**

            设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
            可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
            的模型，建议优先使用该模式。

            - `ResponseFormatText object { type }`

              默认响应格式。用于生成文本响应。

            - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

              JSON Schema 响应格式。用于生成结构化的 JSON 响应。
              详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `schema: map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `type: "json_schema"`

                正在定义的响应格式的类型。始终为 `json_schema`.

                - `"json_schema"`

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `ResponseFormatJSONObject object { type }`

              JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
              建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
              以执行此操作。
              这样做。

        - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          模型在生成响应时可以调用的工具数组。你可以
          通过设置 `tool_choice` 参数来指定要使用的工具。

          你可以提供给模型的两类工具是：

          - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
            能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
            或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
            [内置工具](/api/docs/guides/tools).
          - **函数调用（自定义工具）**：由你定义的函数，
            使模型能够调用你自己的代码。详细了解
            [function calling](/api/docs/guides/function-calling).

          - `Function object { name, parameters, strict, 6 more }`

            在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              对该函数的描述。模型使用该描述来决定是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `key: string`

                  要与该值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
                  - `in`：包含
                  - `nin`：不包含

                  - `"eq"`

                  - `"ne"`

                  - `"gt"`

                  - `"gte"`

                  - `"lt"`

                  - `"lte"`

                  - `"in"`

                  - `"nin"`

                - `value: string or number or boolean or array of string or number`

                  用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示屏的高度。

            - `display_width: number`

              计算机显示屏的宽度。

            - `environment: "windows" or "mac" or "linux" or 2 more`

              要控制的计算机环境类型。

              - `"windows"`

              - `"mac"`

              - `"linux"`

              - `"ubuntu"`

              - `"browser"`

            - `type: "computer_use_preview"`

              计算机使用工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。详细了解
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名也一并允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否被延迟，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP server 的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP server 的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP server 的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                需要批准的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的批准策略。可选值之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
                时， `never`，所有工具都不需要批准。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，
              用于指定可供代码使用的已上传文件 ID，
              以及一个可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  总是 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  代码解释器容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                    - `type: "disabled"`

                      禁用出站网络访问。始终为 `disabled`.

                      - `"disabled"`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                    - `allowed_domains: array of string`

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      可选的、限定域的、用于已加入白名单域的密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        要注入到该域的密钥的名称。

                      - `value: string`

                        要注入到该域的密钥值。

            - `type: "code_interpreter"`

              代码解释器工具的类型。始终为 `code_interpreter`.

              - `"code_interpreter"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

          - `ProgrammaticToolCalling object { type }`

            - `type: "programmatic_tool_calling"`

              工具的类型。始终为 `programmatic_tool_calling`.

              - `"programmatic_tool_calling"`

          - `ImageGeneration object { type, action, background, 9 more }`

            使用 GPT 图像模型生成图像的工具。

            - `type: "image_generation"`

              图像生成工具的类型。始终为 `image_generation`.

              - `"image_generation"`

            - `action: optional "generate" or "edit" or "auto"`

              生成新图像还是编辑现有图像。默认值： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。支持透明背景的 GPT Image
              模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
              preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于修复的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的蒙版图像。

            - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

                要使用的图像生成模型。可选值为 `gpt-image-1`,
                `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
                `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
                `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
                `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
                `gpt-image-1`.

                - `"gpt-image-1"`

                - `"gpt-image-1-mini"`

                - `"gpt-image-1.5"`

                - `"gpt-image-2"`

                - `"gpt-image-2-2026-04-21"`

                - `"gpt-image-2.5-sunburst"`

                - `"gpt-image-2.5-sunburst-2026-09-08"`

                - `"gpt-image-2.5-flare"`

                - `"gpt-image-2.5-flare-2026-09-08"`

            - `moderation: optional "auto" or "low"`

              生成图像的内容审核等级。默认值： `auto`.

              - `"auto"`

              - `"low"`

            - `output_compression: optional number`

              输出图像的压缩级别。默认值：100。

            - `output_format: optional "png" or "webp" or "jpeg"`

              生成图像的输出格式。可选值为 `png`, `webp`，或
              `jpeg`。之一。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or 3 more`

              生成图像的质量。GPT 图像模型支持 `low`,
              `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
              ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
              默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

                - `"1024x1024"`

                - `"1024x1536"`

                - `"1536x1024"`

                - `"auto"`

          - `LocalShell object { type }`

            允许模型在本地环境中执行 shell 命令的工具。

            - `type: "local_shell"`

              本地 shell 工具的类型。始终为 `local_shell`.

              - `"local_shell"`

          - `Shell object { type, allowed_callers, environment }`

            允许模型执行 shell 命令的工具。

            - `type: "shell"`

              shell 工具的类型。始终为 `shell`.

              - `"shell"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

              - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

                - `type: "container_auto"`

                  自动为本次请求创建容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `skills: optional array of SkillReference or InlineSkill`

                  可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                  - `InlineSkill object { description, name, source, type }`

                    - `description: string`

                      技能的描述。

                    - `name: string`

                      技能的名称。

                    - `source: InlineSkillSource`

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型。必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能来源的类型。必须为 `base64`.

                        - `"base64"`

                    - `type: "inline"`

                      为本次请求定义一个内联技能。

                      - `"inline"`

              - `LocalEnvironment object { type, skills }`

                - `type: "local"`

                  使用本地计算机环境。

                  - `"local"`

                - `skills: optional array of LocalSkill`

                  可选的技能列表。

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `path: string`

                    包含技能的目录路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

              - `Text object { type }`

                无约束的自由格式文本。

                - `type: "text"`

                  无约束文本格式。始终为 `text`.

                  - `"text"`

              - `Grammar object { definition, syntax, type }`

                由用户定义的语法。

                - `definition: string`

                  语法定义。

                - `syntax: "lark" or "regex"`

                  语法定义的语法。其一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

            - `description: string`

              展示给模型的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

            - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

              此命名空间内可用的函数/自定义工具。

              - `Function object { name, type, allowed_callers, 6 more }`

                - `name: string`

                - `type: "function"`

                  - `"function"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此函数是否应被延迟，并通过工具搜索被发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中识别它。

                - `type: "custom"`

                  自定义工具的类型。始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行的工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户所在位置。

              - `type: "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

          - `ApplyPatch object { type, allowed_callers }`

            允许助手使用 unified diff 创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终为 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `eval_id: string`

    关联评估的标识符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    被评估的模型（如果适用）。

  - `name: string`

    评估运行的名称。

  - `object: "eval.run"`

    对象的类型。始终为 "eval.run"。

    - `"eval.run"`

  - `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

    评估运行期间每个模型的使用情况统计。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `invocation_count: number`

      调用次数。

    - `model_name: string`

      模型的名称。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

  - `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

    评估运行期间应用的每个测试标准的结果。

    - `failed: number`

      此标准未通过的测试数量。

    - `passed: number`

      此标准通过的测试数量。

    - `testing_criteria: string`

      测试标准的描述。

  - `report_url: string`

    UI 仪表盘上渲染的评估运行报告的 URL。

  - `result_counts: object { errored, failed, passed, total }`

    汇总评估运行结果的计数器。

    - `errored: number`

      出现错误的输出项数量。

    - `failed: number`

      未通过评估的输出项数量。

    - `passed: number`

      通过评估的输出项数量。

    - `total: number`

      已执行的输出项总数。

  - `status: string`

    评估运行的状态。

### Run 删除响应

- `RunDeleteResponse object { deleted, object, run_id }`

  - `deleted: optional boolean`

  - `object: optional string`

  - `run_id: optional string`

### Run 列表响应

- `RunListResponse object { id, created_at, data_source, 11 more }`

  表示一次评估运行（evaluation run）的 schema。

  - `id: string`

    评估运行记录的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

    有关该运行数据源的信息。

    - `CreateEvalJSONLRunDataSource object { source, type }`

      一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

      - `source: object { content, type }  or object { id, type }`

        确定如何填充 `item` 数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

      - `type: "jsonl"`

        数据源的类型。始终为 `jsonl`.

        - `"jsonl"`

    - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

      一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

          一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

          - `type: "stored_completions"`

            数据源的类型。始终为 `stored_completions`.

            - `"stored_completions"`

          - `created_after: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

          - `created_before: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

          - `limit: optional number or null`

            一个可选的最大返回条目数量。

          - `metadata: optional Metadata or null`

            可附加到对象的 16 个键值对。这可以
            用于以结构化格式存储对象的附加信息，
            并通过 API 或控制台查询对象。

            键为字符串，最长 64 个字符。值为字符串，
            最长 512 个字符。

          - `model: optional string or null`

            一个可选的模型筛选条件（例如 'gpt-6-astra'）。

      - `type: "completions"`

        运行数据源的类型。始终为 `completions`.

        - `"completions"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `TemplateInputMessages object { template, type }`

          - `template: array of EasyInputMessage or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `EasyInputMessage object { content, role, phase, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputMessageContentList`

                发送给模型的文本、图像或音频输入，用于生成响应。
                也可以包含之前的助手响应。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputMessageContentList = array of ResponseInputContent`

                  发送给模型的一个或多个输入项的列表，包含不同的内容
                  类型。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                    - `text: string`

                      输入到模型的文本。

                    - `type: "input_text"`

                      输入项的类型。始终为 `input_text`.

                      - `"input_text"`

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputImage object { detail, type, file_id, 2 more }`

                    发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                    - `detail: ImageDetail`

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                      - `"low"`

                      - `"high"`

                      - `"auto"`

                      - `"original"`

                    - `type: "input_image"`

                      输入项的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `image_url: optional string or null`

                      要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputFile object { type, detail, file_data, 4 more }`

                    发送给模型的文件输入。

                    - `type: "input_file"`

                      输入项的类型。始终为 `input_file`.

                      - `"input_file"`

                    - `detail: optional "auto" or "low" or "high"`

                      要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                      - `"auto"`

                      - `"low"`

                      - `"high"`

                    - `file_data: optional string`

                      要发送给模型的文件内容。

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `file_url: optional string`

                      要发送给模型的文件的 URL。

                    - `filename: optional string`

                      要发送给模型的文件名称。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `phase: optional "commentary" or "final_answer" or null`

                将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
                对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
                阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

                - `"commentary"`

                - `"final_answer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                    输入到模型的文本。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                  - `OutputText object { text, type }`

                    模型输出的文本。

                    - `text: string`

                      模型输出的文本。

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

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `ItemReferenceInputMessages object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

          指定模型必须输出的格式的对象。

          设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
          Structured Outputs 可确保模型匹配你提供的 JSON
          schema。了解更多请参阅 [Structured Outputs
          指南](/api/docs/guides/structured-outputs).

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

            - `type: "text"`

              正在定义的响应格式的类型。始终为 `text`.

              - `"text"`

          - `ResponseFormatJSONSchema object { json_schema, type }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `json_schema: object { name, description, schema, strict }`

              Structured Outputs 配置选项，包括 JSON Schema。

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `schema: optional map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

            - `type: "json_object"`

              正在定义的响应格式的类型。始终为 `json_object`.

              - `"json_object"`

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `tools: optional array of ChatCompletionFunctionTool`

          模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

            - `description: optional string`

              对函数功能的描述，模型据此选择调用函数的时机与方式。

            - `parameters: optional FunctionParameters`

              函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

              省略 `parameters` 会定义一个空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

    - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

      一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

          一个 EvalResponsesSource 对象，用于描述运行数据源配置。

          - `type: "responses"`

            运行数据源的类型。始终为 `responses`.

            - `"responses"`

          - `created_after: optional number or null`

            仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

          - `created_before: optional number or null`

            仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

          - `instructions_search: optional string or null`

            用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

          - `metadata: optional unknown or null`

            responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

          - `model: optional string or null`

            用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

          - `reasoning_effort: optional ReasoningEffort or null`

            约束推理模型在推理上的投入程度。当前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
            降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
            并非所有推理模型都支持每个
            值。请参阅
            [推理指南](/api/docs/guides/reasoning)
            了解模型特定的支持情况。

          - `temperature: optional number or null`

            采样温度。这是用于筛选 responses 的查询参数。

          - `tools: optional array of string or null`

            工具名称列表。这是用于筛选 responses 的查询参数。

          - `top_p: optional number or null`

            核采样参数。这是用于筛选 responses 的查询参数。

          - `users: optional array of string or null`

            用户标识符列表。这是用于筛选 responses 的查询参数。

      - `type: "responses"`

        运行数据源的类型。始终为 `responses`.

        - `"responses"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `InputMessagesTemplate object { template, type }`

          - `template: array of object { content, role }  or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `ChatMessage object { content, role }`

              - `content: string`

                消息的内容。

              - `role: string`

                消息的角色（例如 "system"、"assistant"、"user"）。

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，其中每个输入可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `InputMessagesItemReference object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `text: optional object { format }`

          模型文本响应的配置选项。可以是纯
          文本或结构化 JSON 数据。了解更多：

          - [Text inputs and outputs](/api/docs/guides/text)
          - [Structured Outputs](/api/docs/guides/structured-outputs)

          - `format: optional ResponseFormatTextConfig`

            指定模型必须输出的格式的对象。

            配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
            从而确保模型匹配你提供的 JSON schema。详见
            [Structured Outputs 指南](/api/docs/guides/structured-outputs).

            默认格式为 `{ "type": "text" }` ，且不提供其他选项。

            **不建议用于 gpt-4o 及更新模型：**

            设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
            可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
            的模型，建议优先使用该模式。

            - `ResponseFormatText object { type }`

              默认响应格式。用于生成文本响应。

            - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

              JSON Schema 响应格式。用于生成结构化的 JSON 响应。
              详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `schema: map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `type: "json_schema"`

                正在定义的响应格式的类型。始终为 `json_schema`.

                - `"json_schema"`

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `ResponseFormatJSONObject object { type }`

              JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
              建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
              以执行此操作。
              这样做。

        - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          模型在生成响应时可以调用的工具数组。你可以
          通过设置 `tool_choice` 参数来指定要使用的工具。

          你可以提供给模型的两类工具是：

          - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
            能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
            或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
            [内置工具](/api/docs/guides/tools).
          - **函数调用（自定义工具）**：由你定义的函数，
            使模型能够调用你自己的代码。详细了解
            [function calling](/api/docs/guides/function-calling).

          - `Function object { name, parameters, strict, 6 more }`

            在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              对该函数的描述。模型使用该描述来决定是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `key: string`

                  要与该值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
                  - `in`：包含
                  - `nin`：不包含

                  - `"eq"`

                  - `"ne"`

                  - `"gt"`

                  - `"gte"`

                  - `"lt"`

                  - `"lte"`

                  - `"in"`

                  - `"nin"`

                - `value: string or number or boolean or array of string or number`

                  用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示屏的高度。

            - `display_width: number`

              计算机显示屏的宽度。

            - `environment: "windows" or "mac" or "linux" or 2 more`

              要控制的计算机环境类型。

              - `"windows"`

              - `"mac"`

              - `"linux"`

              - `"ubuntu"`

              - `"browser"`

            - `type: "computer_use_preview"`

              计算机使用工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。详细了解
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名也一并允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否被延迟，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP server 的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP server 的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP server 的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                需要批准的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的批准策略。可选值之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
                时， `never`，所有工具都不需要批准。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，
              用于指定可供代码使用的已上传文件 ID，
              以及一个可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  总是 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  代码解释器容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                    - `type: "disabled"`

                      禁用出站网络访问。始终为 `disabled`.

                      - `"disabled"`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                    - `allowed_domains: array of string`

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      可选的、限定域的、用于已加入白名单域的密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        要注入到该域的密钥的名称。

                      - `value: string`

                        要注入到该域的密钥值。

            - `type: "code_interpreter"`

              代码解释器工具的类型。始终为 `code_interpreter`.

              - `"code_interpreter"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

          - `ProgrammaticToolCalling object { type }`

            - `type: "programmatic_tool_calling"`

              工具的类型。始终为 `programmatic_tool_calling`.

              - `"programmatic_tool_calling"`

          - `ImageGeneration object { type, action, background, 9 more }`

            使用 GPT 图像模型生成图像的工具。

            - `type: "image_generation"`

              图像生成工具的类型。始终为 `image_generation`.

              - `"image_generation"`

            - `action: optional "generate" or "edit" or "auto"`

              生成新图像还是编辑现有图像。默认值： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。支持透明背景的 GPT Image
              模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
              preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于修复的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的蒙版图像。

            - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

                要使用的图像生成模型。可选值为 `gpt-image-1`,
                `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
                `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
                `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
                `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
                `gpt-image-1`.

                - `"gpt-image-1"`

                - `"gpt-image-1-mini"`

                - `"gpt-image-1.5"`

                - `"gpt-image-2"`

                - `"gpt-image-2-2026-04-21"`

                - `"gpt-image-2.5-sunburst"`

                - `"gpt-image-2.5-sunburst-2026-09-08"`

                - `"gpt-image-2.5-flare"`

                - `"gpt-image-2.5-flare-2026-09-08"`

            - `moderation: optional "auto" or "low"`

              生成图像的内容审核等级。默认值： `auto`.

              - `"auto"`

              - `"low"`

            - `output_compression: optional number`

              输出图像的压缩级别。默认值：100。

            - `output_format: optional "png" or "webp" or "jpeg"`

              生成图像的输出格式。可选值为 `png`, `webp`，或
              `jpeg`。之一。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or 3 more`

              生成图像的质量。GPT 图像模型支持 `low`,
              `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
              ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
              默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

                - `"1024x1024"`

                - `"1024x1536"`

                - `"1536x1024"`

                - `"auto"`

          - `LocalShell object { type }`

            允许模型在本地环境中执行 shell 命令的工具。

            - `type: "local_shell"`

              本地 shell 工具的类型。始终为 `local_shell`.

              - `"local_shell"`

          - `Shell object { type, allowed_callers, environment }`

            允许模型执行 shell 命令的工具。

            - `type: "shell"`

              shell 工具的类型。始终为 `shell`.

              - `"shell"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

              - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

                - `type: "container_auto"`

                  自动为本次请求创建容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `skills: optional array of SkillReference or InlineSkill`

                  可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                  - `InlineSkill object { description, name, source, type }`

                    - `description: string`

                      技能的描述。

                    - `name: string`

                      技能的名称。

                    - `source: InlineSkillSource`

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型。必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能来源的类型。必须为 `base64`.

                        - `"base64"`

                    - `type: "inline"`

                      为本次请求定义一个内联技能。

                      - `"inline"`

              - `LocalEnvironment object { type, skills }`

                - `type: "local"`

                  使用本地计算机环境。

                  - `"local"`

                - `skills: optional array of LocalSkill`

                  可选的技能列表。

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `path: string`

                    包含技能的目录路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

              - `Text object { type }`

                无约束的自由格式文本。

                - `type: "text"`

                  无约束文本格式。始终为 `text`.

                  - `"text"`

              - `Grammar object { definition, syntax, type }`

                由用户定义的语法。

                - `definition: string`

                  语法定义。

                - `syntax: "lark" or "regex"`

                  语法定义的语法。其一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

            - `description: string`

              展示给模型的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

            - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

              此命名空间内可用的函数/自定义工具。

              - `Function object { name, type, allowed_callers, 6 more }`

                - `name: string`

                - `type: "function"`

                  - `"function"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此函数是否应被延迟，并通过工具搜索被发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中识别它。

                - `type: "custom"`

                  自定义工具的类型。始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行的工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户所在位置。

              - `type: "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

          - `ApplyPatch object { type, allowed_callers }`

            允许助手使用 unified diff 创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终为 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `eval_id: string`

    关联评估的标识符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    被评估的模型（如果适用）。

  - `name: string`

    评估运行的名称。

  - `object: "eval.run"`

    对象的类型。始终为 "eval.run"。

    - `"eval.run"`

  - `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

    评估运行期间每个模型的使用情况统计。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `invocation_count: number`

      调用次数。

    - `model_name: string`

      模型的名称。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

  - `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

    评估运行期间应用的每个测试标准的结果。

    - `failed: number`

      此标准未通过的测试数量。

    - `passed: number`

      此标准通过的测试数量。

    - `testing_criteria: string`

      测试标准的描述。

  - `report_url: string`

    UI 仪表盘上渲染的评估运行报告的 URL。

  - `result_counts: object { errored, failed, passed, total }`

    汇总评估运行结果的计数器。

    - `errored: number`

      出现错误的输出项数量。

    - `failed: number`

      未通过评估的输出项数量。

    - `passed: number`

      通过评估的输出项数量。

    - `total: number`

      已执行的输出项总数。

  - `status: string`

    评估运行的状态。

### Run 检索响应

- `RunRetrieveResponse object { id, created_at, data_source, 11 more }`

  表示一次评估运行（evaluation run）的 schema。

  - `id: string`

    评估运行记录的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

    有关该运行数据源的信息。

    - `CreateEvalJSONLRunDataSource object { source, type }`

      一个 JsonlRunDataSource 对象，用于指定与该评估匹配的 JSONL 文件

      - `source: object { content, type }  or object { id, type }`

        确定如何填充 `item` 数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

      - `type: "jsonl"`

        数据源的类型。始终为 `jsonl`.

        - `"jsonl"`

    - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

      一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

          一个 StoredCompletionsRunDataSource 配置，描述一组过滤器

          - `type: "stored_completions"`

            数据源的类型。始终为 `stored_completions`.

            - `"stored_completions"`

          - `created_after: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之后创建的条目。

          - `created_before: optional number or null`

            一个可选的 Unix 时间戳，用于筛选在此时间之前创建的条目。

          - `limit: optional number or null`

            一个可选的最大返回条目数量。

          - `metadata: optional Metadata or null`

            可附加到对象的 16 个键值对。这可以
            用于以结构化格式存储对象的附加信息，
            并通过 API 或控制台查询对象。

            键为字符串，最长 64 个字符。值为字符串，
            最长 512 个字符。

          - `model: optional string or null`

            一个可选的模型筛选条件（例如 'gpt-6-astra'）。

      - `type: "completions"`

        运行数据源的类型。始终为 `completions`.

        - `"completions"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `TemplateInputMessages object { template, type }`

          - `template: array of EasyInputMessage or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `EasyInputMessage object { content, role, phase, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputMessageContentList`

                发送给模型的文本、图像或音频输入，用于生成响应。
                也可以包含之前的助手响应。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputMessageContentList = array of ResponseInputContent`

                  发送给模型的一个或多个输入项的列表，包含不同的内容
                  类型。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                    - `text: string`

                      输入到模型的文本。

                    - `type: "input_text"`

                      输入项的类型。始终为 `input_text`.

                      - `"input_text"`

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputImage object { detail, type, file_id, 2 more }`

                    发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

                    - `detail: ImageDetail`

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

                      - `"low"`

                      - `"high"`

                      - `"auto"`

                      - `"original"`

                    - `type: "input_image"`

                      输入项的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `image_url: optional string or null`

                      要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中经过 base64 编码的图像。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

                  - `ResponseInputFile object { type, detail, file_data, 4 more }`

                    发送给模型的文件输入。

                    - `type: "input_file"`

                      输入项的类型。始终为 `input_file`.

                      - `"input_file"`

                    - `detail: optional "auto" or "low" or "high"`

                      要发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 的用量。使用 `low` 可以较低成本渲染，或 `high` 以更高质量渲染该文件。默认为 `auto`.

                      - `"auto"`

                      - `"low"`

                      - `"high"`

                    - `file_data: optional string`

                      要发送给模型的文件内容。

                    - `file_id: optional string or null`

                      要发送给模型的文件 ID。

                    - `file_url: optional string`

                      要发送给模型的文件的 URL。

                    - `filename: optional string`

                      要发送给模型的文件名称。

                    - `prompt_cache_breakpoint: optional object { mode }`

                      标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                      - `mode: "explicit"`

                        断点模式。始终为 `explicit`.

                        - `"explicit"`

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `phase: optional "commentary" or "final_answer" or null`

                将某条 `assistant` 消息标记为中间注释（`commentary`) 或最终答案（`final_answer`).
                对于类似 `gpt-5.3-codex` 及更高版本模型，发送后续请求时，请保留并重新发送
                阶段于所有助手消息——删除它可能降低性能。不用于用户消息。

                - `"commentary"`

                - `"final_answer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

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

                    输入到模型的文本。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    输入到模型的文本。

                  - `OutputText object { text, type }`

                    模型输出的文本。

                    - `text: string`

                      模型输出的文本。

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

                      要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `ItemReferenceInputMessages object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间中变量的引用，例如 "item.input_trajectory"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

          指定模型必须输出的格式的对象。

          设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
          Structured Outputs 可确保模型匹配你提供的 JSON
          schema。了解更多请参阅 [Structured Outputs
          指南](/api/docs/guides/structured-outputs).

          设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
          可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
          的模型，建议优先使用该模式。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

            - `type: "text"`

              正在定义的响应格式的类型。始终为 `text`.

              - `"text"`

          - `ResponseFormatJSONSchema object { json_schema, type }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `json_schema: object { name, description, schema, strict }`

              Structured Outputs 配置选项，包括 JSON Schema。

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `schema: optional map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
            以执行此操作。
            这样做。

            - `type: "json_object"`

              正在定义的响应格式的类型。始终为 `json_object`.

              - `"json_object"`

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `tools: optional array of ChatCompletionFunctionTool`

          模型可调用的工具列表。目前，作为工具仅支持函数。使用此项可提供模型可为其生成 JSON 输入的函数列表，最多支持 128 个函数。

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

            - `description: optional string`

              对函数功能的描述，模型据此选择调用函数的时机与方式。

            - `parameters: optional FunctionParameters`

              函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的相关文档。

              省略 `parameters` 会定义一个空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持部分 JSON Schema， `strict` 为 `true`. 在以下链接中了解更多关于 Structured Outputs 的信息： [function calling guide](/api/docs/guides/function-calling).

          - `type: "function"`

            工具的类型。目前仅支持 `function` 。

            - `"function"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

    - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

      一个 ResponsesRunDataSource 对象，用于描述模型采样配置。

      - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

        确定如何填充 `item` 该运行数据源中的命名空间。

        - `EvalJSONLFileContentSource object { content, type }`

          - `content: array of object { item, sample }`

            jsonl 文件的内容。

            - `item: map[unknown]`

            - `sample: optional map[unknown]`

          - `type: "file_content"`

            jsonl 数据源的类型。始终为 `file_content`.

            - `"file_content"`

        - `EvalJSONLFileIDSource object { id, type }`

          - `id: string`

            文件的标识符。

          - `type: "file_id"`

            jsonl 数据源的类型。始终为 `file_id`.

            - `"file_id"`

        - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

          一个 EvalResponsesSource 对象，用于描述运行数据源配置。

          - `type: "responses"`

            运行数据源的类型。始终为 `responses`.

            - `"responses"`

          - `created_after: optional number or null`

            仅包含此时间戳之后（含）创建的项。这是用于筛选 responses 的查询参数。

          - `created_before: optional number or null`

            仅包含此时间戳之前（含）创建的项。这是用于筛选 responses 的查询参数。

          - `instructions_search: optional string or null`

            用于搜索 'instructions' 字段的可选字符串。这是用于筛选 responses 的查询参数。

          - `metadata: optional unknown or null`

            responses 的元数据过滤器。这是用于筛选 responses 的查询参数。

          - `model: optional string or null`

            用于查找 responses 的模型名称。这是用于筛选 responses 的查询参数。

          - `reasoning_effort: optional ReasoningEffort or null`

            约束推理模型在推理上的投入程度。当前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
            降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
            并非所有推理模型都支持每个
            值。请参阅
            [推理指南](/api/docs/guides/reasoning)
            了解模型特定的支持情况。

          - `temperature: optional number or null`

            采样温度。这是用于筛选 responses 的查询参数。

          - `tools: optional array of string or null`

            工具名称列表。这是用于筛选 responses 的查询参数。

          - `top_p: optional number or null`

            核采样参数。这是用于筛选 responses 的查询参数。

          - `users: optional array of string or null`

            用户标识符列表。这是用于筛选 responses 的查询参数。

      - `type: "responses"`

        运行数据源的类型。始终为 `responses`.

        - `"responses"`

      - `input_messages: optional object { template, type }  or object { item_reference, type }`

        在从模型采样时使用。决定传入模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` namespace.

        - `InputMessagesTemplate object { template, type }`

          - `template: array of object { content, role }  or object { content, role, type }`

            构成提示词或上下文的聊天消息列表。可以包含对命名空间的变量引用，例如 `item` {{item.name}}。

            - `ChatMessage object { content, role }`

              - `content: string`

                消息的内容。

              - `role: string`

                消息的角色（例如 "system"、"assistant"、"user"）。

            - `EvalMessageObject object { content, role, type }`

              输入到模型的消息，其角色用于指示指令的
              优先级。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
              角色给出的指令。使用 `user` 角色的消息假定为模型在之前
              `assistant` 交互中生成的内容。
              交互。

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 —— 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项数组。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型输出的文本。

                  - `text: string`

                    模型输出的文本。

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

                    要发送到模型的图像的详细程度级别。为以下值之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，其中每个输入可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。为以下值之一 `user`, `assistant`, `system`，或
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                消息输入的类型。始终为 `message`.

                - `"message"`

          - `type: "template"`

            输入消息的类型。始终为 `template`.

            - `"template"`

        - `InputMessagesItemReference object { item_reference, type }`

          - `item_reference: string`

            对命名空间中变量的引用。即“item.input_trajectory” `item` 命名空间。例如 "item.name"

          - `type: "item_reference"`

            输入消息的类型。始终为 `item_reference`.

            - `"item_reference"`

      - `model: optional string`

        用于生成补全的模型名称（例如 "o3-mini"）。

      - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

        - `max_completion_tokens: optional number`

          生成输出中的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。当前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token 用于推理。
          并非所有推理模型都支持每个
          值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型特定的支持情况。

        - `seed: optional number`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number`

          较高的 temperature 会增加输出的随机性。

        - `text: optional object { format }`

          模型文本响应的配置选项。可以是纯
          文本或结构化 JSON 数据。了解更多：

          - [Text inputs and outputs](/api/docs/guides/text)
          - [Structured Outputs](/api/docs/guides/structured-outputs)

          - `format: optional ResponseFormatTextConfig`

            指定模型必须输出的格式的对象。

            配置 `{ "type": "json_schema" }` 可启用 Structured Outputs，
            从而确保模型匹配你提供的 JSON schema。详见
            [Structured Outputs 指南](/api/docs/guides/structured-outputs).

            默认格式为 `{ "type": "text" }` ，且不提供其他选项。

            **不建议用于 gpt-4o 及更新模型：**

            设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
            可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
            的模型，建议优先使用该模式。

            - `ResponseFormatText object { type }`

              默认响应格式。用于生成文本响应。

            - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

              JSON Schema 响应格式。用于生成结构化的 JSON 响应。
              详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

              - `name: string`

                响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
                下划线和连字符，最大长度为 64。

              - `schema: map[unknown]`

                响应格式的 schema，以 JSON Schema 对象形式描述。
                了解如何构建 JSON 模式 [此处](https://json-schema.org/).

              - `type: "json_schema"`

                正在定义的响应格式的类型。始终为 `json_schema`.

                - `"json_schema"`

              - `description: optional string`

                对响应格式用途的描述，模型会据此
                决定如何按该格式进行响应。

              - `strict: optional boolean or null`

                生成输出时是否启用严格的 schema 遵循。
                如果设置为 true，模型将始终遵循
                中定义的精确 schema。 `schema` 字段。仅支持部分 JSON Schema，
                `strict` 为 `true`。若要了解更多信息，请阅读 [Structured Outputs
                指南](/api/docs/guides/structured-outputs).

            - `ResponseFormatJSONObject object { type }`

              JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
              建议对支持的模型使用 `json_schema` 。请注意，模型不会在没有系统或用户消息指示的情况下生成 JSON
              以执行此操作。
              这样做。

        - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          模型在生成响应时可以调用的工具数组。你可以
          通过设置 `tool_choice` 参数来指定要使用的工具。

          你可以提供给模型的两类工具是：

          - **内置工具**：由 OpenAI 提供的工具，用于扩展模型的
            能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
            或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
            [内置工具](/api/docs/guides/tools).
          - **函数调用（自定义工具）**：由你定义的函数，
            使模型能够调用你自己的代码。详细了解
            [function calling](/api/docs/guides/function-calling).

          - `Function object { name, parameters, strict, 6 more }`

            在你自己代码中定义一个模型可以选择调用的函数。详细了解 [function calling](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              对该函数的描述。模型使用该描述来决定是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                - `key: string`

                  要与该值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
                  - `in`：包含
                  - `nin`：不包含

                  - `"eq"`

                  - `"ne"`

                  - `"gt"`

                  - `"gte"`

                  - `"lt"`

                  - `"lte"`

                  - `"in"`

                  - `"nin"`

                - `value: string or number or boolean or array of string or number`

                  用于与属性键进行比较的值，支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选条件数组，元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值按定义的比较运算进行比较的筛选条件。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数，该数值应在 1 到 50 之间（含端点）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1 之间。越接近 1 越倾向于只返回最相关的结果，但返回的结果数可能更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。详细了解 [computer tool](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示屏的高度。

            - `display_width: number`

              计算机显示屏的宽度。

            - `environment: "windows" or "mac" or "linux" or 2 more`

              要控制的计算机环境类型。

              - `"windows"`

              - `"mac"`

              - `"linux"`

              - `"ubuntu"`

              - `"browser"`

            - `type: "computer_use_preview"`

              计算机使用工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。详细了解
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。取以下值之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。如果省略，默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名也一并允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            （MCP）服务器为模型提供对其他工具的访问。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识它。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许使用的工具名称列表或过滤对象。

              - `McpAllowedTools = array of string`

                允许使用的工具名称的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许使用哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示某个工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              需自行管理与此 MCP 服务器的 OAuth 握手及令牌交换。你的应用
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
              关于服务连接器 [此处](/api/docs/guides/tools-connectors-mcp#connectors).

              当前支持 `connector_id` 的值为：

              - Dropbox: `connector_dropbox`
              - Gmail: `connector_gmail`
              - Google Calendar: `connector_googlecalendar`
              - Google Drive: `connector_googledrive`
              - Microsoft Teams: `connector_microsoftteams`
              - Outlook Calendar: `connector_outlookcalendar`
              - Outlook Email: `connector_outlookemail`
              - SharePoint: `connector_sharepoint`

              - `"connector_dropbox"`

              - `"connector_gmail"`

              - `"connector_googlecalendar"`

              - `"connector_googledrive"`

              - `"connector_microsoftteams"`

              - `"connector_outlookcalendar"`

              - `"connector_outlookemail"`

              - `"connector_sharepoint"`

            - `defer_loading: optional boolean`

              此 MCP 工具是否被延迟，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP server 的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP server 的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP server 的哪些工具需要审批。可以是
                `always`, `never`，或与工具关联的过滤对象
                需要批准的工具。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许使用哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示某个工具是否会修改数据或是否为只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一的批准策略。可选值之一 `always` 或
                `never`。当设置为 `always`，时，所有工具都需要批准。当设置为
                时， `never`，所有工具都不需要批准。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。可选值之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，
              用于指定可供代码使用的已上传文件 ID，
              以及一个可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  总是 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  代码解释器容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                    - `type: "disabled"`

                      禁用出站网络访问。始终为 `disabled`.

                      - `"disabled"`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                    - `allowed_domains: array of string`

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      可选的、限定域的、用于已加入白名单域的密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        要注入到该域的密钥的名称。

                      - `value: string`

                        要注入到该域的密钥值。

            - `type: "code_interpreter"`

              代码解释器工具的类型。始终为 `code_interpreter`.

              - `"code_interpreter"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

          - `ProgrammaticToolCalling object { type }`

            - `type: "programmatic_tool_calling"`

              工具的类型。始终为 `programmatic_tool_calling`.

              - `"programmatic_tool_calling"`

          - `ImageGeneration object { type, action, background, 9 more }`

            使用 GPT 图像模型生成图像的工具。

            - `type: "image_generation"`

              图像生成工具的类型。始终为 `image_generation`.

              - `"image_generation"`

            - `action: optional "generate" or "edit" or "auto"`

              生成新图像还是编辑现有图像。默认值： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。支持透明背景的 GPT Image
              模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于
              preview。使用时 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。此参数仅适用于 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不适用于 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于修复的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的蒙版图像。

            - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
              `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
              `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

                要使用的图像生成模型。可选值为 `gpt-image-1`,
                `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
                `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
                `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
                `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。之一。默认值：
                `gpt-image-1`.

                - `"gpt-image-1"`

                - `"gpt-image-1-mini"`

                - `"gpt-image-1.5"`

                - `"gpt-image-2"`

                - `"gpt-image-2-2026-04-21"`

                - `"gpt-image-2.5-sunburst"`

                - `"gpt-image-2.5-sunburst-2026-09-08"`

                - `"gpt-image-2.5-flare"`

                - `"gpt-image-2.5-flare-2026-09-08"`

            - `moderation: optional "auto" or "low"`

              生成图像的内容审核等级。默认值： `auto`.

              - `"auto"`

              - `"low"`

            - `output_compression: optional number`

              输出图像的压缩级别。默认值：100。

            - `output_format: optional "png" or "webp" or "jpeg"`

              生成图像的输出格式。可选值为 `png`, `webp`，或
              `jpeg`。之一。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，取值范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or 3 more`

              生成图像的质量。GPT 图像模型支持 `low`,
              `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
              ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
              默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性功能，且最大支持的分辨率为 `3840x2160`。请求的尺寸也必须满足模型当前的像素和边数限制。GPT 图像模型支持的标准尺寸包括 `1024x1024`, `1536x1024`，以及 `1024x1536` ； `auto` 受允许自动尺寸的模型支持。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

                - `"1024x1024"`

                - `"1024x1536"`

                - `"1536x1024"`

                - `"auto"`

          - `LocalShell object { type }`

            允许模型在本地环境中执行 shell 命令的工具。

            - `type: "local_shell"`

              本地 shell 工具的类型。始终为 `local_shell`.

              - `"local_shell"`

          - `Shell object { type, allowed_callers, environment }`

            允许模型执行 shell 命令的工具。

            - `type: "shell"`

              shell 工具的类型。始终为 `shell`.

              - `"shell"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

              - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

                - `type: "container_auto"`

                  自动为本次请求创建容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件的可选列表。

                - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

                  容器的内存限制。

                  - `"1g"`

                  - `"4g"`

                  - `"16g"`

                  - `"64g"`

                - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

                  容器的网络访问策略。

                  - `ContainerNetworkPolicyDisabled object { type }`

                  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `skills: optional array of SkillReference or InlineSkill`

                  可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                  - `InlineSkill object { description, name, source, type }`

                    - `description: string`

                      技能的描述。

                    - `name: string`

                      技能的名称。

                    - `source: InlineSkillSource`

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型。必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能来源的类型。必须为 `base64`.

                        - `"base64"`

                    - `type: "inline"`

                      为本次请求定义一个内联技能。

                      - `"inline"`

              - `LocalEnvironment object { type, skills }`

                - `type: "local"`

                  使用本地计算机环境。

                  - `"local"`

                - `skills: optional array of LocalSkill`

                  可选的技能列表。

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `path: string`

                    包含技能的目录路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

              - `Text object { type }`

                无约束的自由格式文本。

                - `type: "text"`

                  无约束文本格式。始终为 `text`.

                  - `"text"`

              - `Grammar object { definition, syntax, type }`

                由用户定义的语法。

                - `definition: string`

                  语法定义。

                - `syntax: "lark" or "regex"`

                  语法定义的语法。其一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

            - `description: string`

              展示给模型的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

            - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

              此命名空间内可用的函数/自定义工具。

              - `Function object { name, type, allowed_callers, 6 more }`

                - `name: string`

                - `type: "function"`

                  - `"function"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此函数是否应被延迟，并通过工具搜索被发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中识别它。

                - `type: "custom"`

                  自定义工具的类型。始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，而不是在下次响应创建时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行的工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网络上搜索相关结果以在响应中使用。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。取以下值之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级指导。取以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户所在位置。

              - `type: "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在区域，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA timezone](https://timeapi.io/documentation/iana-timezones) 用户所在区域，例如。 `America/Los_Angeles`.

          - `ApplyPatch object { type, allowed_callers }`

            允许助手使用 unified diff 创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终为 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `top_p: optional number`

          作为 temperature 的替代方案用于核采样；1.0 包含所有 token。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `eval_id: string`

    关联评估的标识符。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。这可以
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    被评估的模型（如果适用）。

  - `name: string`

    评估运行的名称。

  - `object: "eval.run"`

    对象的类型。始终为 "eval.run"。

    - `"eval.run"`

  - `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

    评估运行期间每个模型的使用情况统计。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `invocation_count: number`

      调用次数。

    - `model_name: string`

      模型的名称。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

  - `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

    评估运行期间应用的每个测试标准的结果。

    - `failed: number`

      此标准未通过的测试数量。

    - `passed: number`

      此标准通过的测试数量。

    - `testing_criteria: string`

      测试标准的描述。

  - `report_url: string`

    UI 仪表盘上渲染的评估运行报告的 URL。

  - `result_counts: object { errored, failed, passed, total }`

    汇总评估运行结果的计数器。

    - `errored: number`

      出现错误的输出项数量。

    - `failed: number`

      未通过评估的输出项数量。

    - `passed: number`

      通过评估的输出项数量。

    - `total: number`

      已执行的输出项总数。

  - `status: string`

    评估运行的状态。

# 输出项

## 获取评估运行输出项

**get** `/evals/{eval_id}/runs/{run_id}/output_items`

获取某个评估运行的输出项列表。

### 路径参数

- `eval_id: string`

- `run_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条输出项的标识符。

- `limit: optional number`

  要检索的输出项数量。

- `order: optional "asc" or "desc"`

  按时间戳对输出项进行排序的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

- `status: optional "fail" or "pass"`

  按状态过滤输出项。使用 `failed` 可按失败的输出进行过滤
  项，或 `pass` 可按通过的输出项进行过滤。

  - `"fail"`

  - `"pass"`

### Returns

- `data: array of object { id, created_at, datasource_item, 7 more }`

  一个由评测运行输出项对象组成的数组。

  - `id: string`

    评测运行输出项的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `datasource_item: map[unknown]`

    输入数据源项的详细信息。

  - `datasource_item_id: number`

    数据源项的标识符。

  - `eval_id: string`

    评测组的标识符。

  - `object: "eval.run.output_item"`

    对象的类型。始终为 "eval.run.output_item"。

    - `"eval.run.output_item"`

  - `results: array of object { name, passed, score, 2 more }`

    此输出项的评分器结果列表。

    - `name: string`

      评分器的名称。

    - `passed: boolean`

      评分器是否将该输出视为通过。

    - `score: number`

      评分器生成的数值分数。

    - `sample: optional map[unknown] or null`

      评分器生成的可选样本或中间数据。

    - `type: optional string`

      评分器类型（例如 "string-check-grader"）。

  - `run_id: string`

    与此输出项关联的评测运行的标识符。

  - `sample: object { error, finish_reason, input, 7 more }`

    包含评测运行输入和输出的样本。

    - `error: EvalAPIError`

      表示来自 Eval API 错误响应的对象。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

    - `finish_reason: string`

      样本生成完成的原因。

    - `input: array of object { content, role }`

      输入消息数组。

      - `content: string`

        消息的内容。

      - `role: string`

        消息发送者的角色（例如 system、user、developer）。

    - `max_completion_tokens: number`

      允许用于 completion 的最大 token 数。

    - `model: string`

      用于生成样本的模型。

    - `output: array of object { content, role }`

      输出消息数组。

      - `content: optional string`

        消息的内容。

      - `role: optional string`

        消息的角色（例如 "system"、"assistant"、"user"）。

    - `seed: number`

      用于生成样本的种子。

    - `temperature: number`

      所使用的采样温度。

    - `top_p: number`

      用于采样的 top_p 值。

    - `usage: object { cached_tokens, completion_tokens, prompt_tokens, total_tokens }`

      该样本的 token 使用情况详情。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。

      - `completion_tokens: number`

        生成的完成 token 数量。

      - `prompt_tokens: number`

        使用的提示 token 数量。

      - `total_tokens: number`

        使用的 token 总数。

  - `status: string`

    评估运行的状态。

- `first_id: string`

  数据数组中第一个 eval 运行输出项的标识符。

- `has_more: boolean`

  指示是否还有更多可用的 eval 运行输出项。

- `last_id: string`

  数据数组中最后一个 eval 运行输出项的标识符。

- `object: "list"`

  此对象的类型。始终设置为 "list"。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID/output_items \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "datasource_item": {
        "foo": "bar"
      },
      "datasource_item_id": 0,
      "eval_id": "eval_id",
      "object": "eval.run.output_item",
      "results": [
        {
          "name": "name",
          "passed": true,
          "score": 0,
          "sample": {
            "foo": "bar"
          },
          "type": "type"
        }
      ],
      "run_id": "run_id",
      "sample": {
        "error": {
          "code": "code",
          "message": "message"
        },
        "finish_reason": "finish_reason",
        "input": [
          {
            "content": "content",
            "role": "role"
          }
        ],
        "max_completion_tokens": 0,
        "model": "model",
        "output": [
          {
            "content": "content",
            "role": "role"
          }
        ],
        "seed": 0,
        "temperature": 0,
        "top_p": 0,
        "usage": {
          "cached_tokens": 0,
          "completion_tokens": 0,
          "prompt_tokens": 0,
          "total_tokens": 0
        }
      },
      "status": "status"
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
curl https://api.openai.com/v1/evals/egroup_67abd54d9b0081909a86353f6fb9317a/runs/erun_67abd54d60ec8190832b46859da808f7/output_items \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "eval.run.output_item",
      "id": "outputitem_67e5796c28e081909917bf79f6e6214d",
      "created_at": 1743092076,
      "run_id": "evalrun_67abd54d60ec8190832b46859da808f7",
      "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
      "status": "pass",
      "datasource_item_id": 5,
      "datasource_item": {
        "input": "Stock Markets Rally After Positive Economic Data Released",
        "ground_truth": "Markets"
      },
      "results": [
        {
          "name": "String check-a2486074-d803-4445-b431-ad2262e85d47",
          "sample": null,
          "passed": true,
          "score": 1.0
        }
      ],
      "sample": {
        "input": [
          {
            "role": "developer",
            "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n",
            "tool_call_id": null,
            "tool_calls": null,
            "function_call": null
          },
          {
            "role": "user",
            "content": "Stock Markets Rally After Positive Economic Data Released",
            "tool_call_id": null,
            "tool_calls": null,
            "function_call": null
          }
        ],
        "output": [
          {
            "role": "assistant",
            "content": "Markets",
            "tool_call_id": null,
            "tool_calls": null,
            "function_call": null
          }
        ],
        "finish_reason": "stop",
        "model": "gpt-6-astra",
        "usage": {
          "total_tokens": 325,
          "completion_tokens": 2,
          "prompt_tokens": 323,
          "cached_tokens": 0
        },
        "error": null,
        "temperature": 1.0,
        "max_completion_tokens": 2048,
        "top_p": 1.0,
        "seed": 42
      }
    }
  ],
  "first_id": "outputitem_67e5796c28e081909917bf79f6e6214d",
  "last_id": "outputitem_67e5796c28e081909917bf79f6e6214d",
  "has_more": true
}
```

## 获取评估运行的输出项

**get** `/evals/{eval_id}/runs/{run_id}/output_items/{output_item_id}`

通过 ID 获取评估运行输出项。

### 路径参数

- `eval_id: string`

- `run_id: string`

- `output_item_id: string`

### Returns

- `id: string`

  评测运行输出项的唯一标识符。

- `created_at: number`

  评估运行记录创建时的 Unix 时间戳（以秒为单位）。

- `datasource_item: map[unknown]`

  输入数据源项的详细信息。

- `datasource_item_id: number`

  数据源项的标识符。

- `eval_id: string`

  评测组的标识符。

- `object: "eval.run.output_item"`

  对象的类型。始终为 "eval.run.output_item"。

  - `"eval.run.output_item"`

- `results: array of object { name, passed, score, 2 more }`

  此输出项的评分器结果列表。

  - `name: string`

    评分器的名称。

  - `passed: boolean`

    评分器是否将该输出视为通过。

  - `score: number`

    评分器生成的数值分数。

  - `sample: optional map[unknown] or null`

    评分器生成的可选样本或中间数据。

  - `type: optional string`

    评分器类型（例如 "string-check-grader"）。

- `run_id: string`

  与此输出项关联的评测运行的标识符。

- `sample: object { error, finish_reason, input, 7 more }`

  包含评测运行输入和输出的样本。

  - `error: EvalAPIError`

    表示来自 Eval API 错误响应的对象。

    - `code: string`

      错误代码。

    - `message: string`

      错误消息。

  - `finish_reason: string`

    样本生成完成的原因。

  - `input: array of object { content, role }`

    输入消息数组。

    - `content: string`

      消息的内容。

    - `role: string`

      消息发送者的角色（例如 system、user、developer）。

  - `max_completion_tokens: number`

    允许用于 completion 的最大 token 数。

  - `model: string`

    用于生成样本的模型。

  - `output: array of object { content, role }`

    输出消息数组。

    - `content: optional string`

      消息的内容。

    - `role: optional string`

      消息的角色（例如 "system"、"assistant"、"user"）。

  - `seed: number`

    用于生成样本的种子。

  - `temperature: number`

    所使用的采样温度。

  - `top_p: number`

    用于采样的 top_p 值。

  - `usage: object { cached_tokens, completion_tokens, prompt_tokens, total_tokens }`

    该样本的 token 使用情况详情。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。

    - `completion_tokens: number`

      生成的完成 token 数量。

    - `prompt_tokens: number`

      使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数。

- `status: string`

  评估运行的状态。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID/output_items/$OUTPUT_ITEM_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "datasource_item": {
    "foo": "bar"
  },
  "datasource_item_id": 0,
  "eval_id": "eval_id",
  "object": "eval.run.output_item",
  "results": [
    {
      "name": "name",
      "passed": true,
      "score": 0,
      "sample": {
        "foo": "bar"
      },
      "type": "type"
    }
  ],
  "run_id": "run_id",
  "sample": {
    "error": {
      "code": "code",
      "message": "message"
    },
    "finish_reason": "finish_reason",
    "input": [
      {
        "content": "content",
        "role": "role"
      }
    ],
    "max_completion_tokens": 0,
    "model": "model",
    "output": [
      {
        "content": "content",
        "role": "role"
      }
    ],
    "seed": 0,
    "temperature": 0,
    "top_p": 0,
    "usage": {
      "cached_tokens": 0,
      "completion_tokens": 0,
      "prompt_tokens": 0,
      "total_tokens": 0
    }
  },
  "status": "status"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7/output_items/outputitem_67abd55eb6548190bb580745d5644a33 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval.run.output_item",
  "id": "outputitem_67e5796c28e081909917bf79f6e6214d",
  "created_at": 1743092076,
  "run_id": "evalrun_67abd54d60ec8190832b46859da808f7",
  "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "status": "pass",
  "datasource_item_id": 5,
  "datasource_item": {
    "input": "Stock Markets Rally After Positive Economic Data Released",
    "ground_truth": "Markets"
  },
  "results": [
    {
      "name": "String check-a2486074-d803-4445-b431-ad2262e85d47",
      "sample": null,
      "passed": true,
      "score": 1.0
    }
  ],
  "sample": {
    "input": [
      {
        "role": "developer",
        "content": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n",
        "tool_call_id": null,
        "tool_calls": null,
        "function_call": null
      },
      {
        "role": "user",
        "content": "Stock Markets Rally After Positive Economic Data Released",
        "tool_call_id": null,
        "tool_calls": null,
        "function_call": null
      }
    ],
    "output": [
      {
        "role": "assistant",
        "content": "Markets",
        "tool_call_id": null,
        "tool_calls": null,
        "function_call": null
      }
    ],
    "finish_reason": "stop",
    "model": "gpt-6-astra",
    "usage": {
      "total_tokens": 325,
      "completion_tokens": 2,
      "prompt_tokens": 323,
      "cached_tokens": 0
    },
    "error": null,
    "temperature": 1.0,
    "max_completion_tokens": 2048,
    "top_p": 1.0,
    "seed": 42
  }
}
```

## Domain Types

### 输出项目列表响应

- `OutputItemListResponse object { id, created_at, datasource_item, 7 more }`

  表示评估运行输出项的 schema。

  - `id: string`

    评测运行输出项的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `datasource_item: map[unknown]`

    输入数据源项的详细信息。

  - `datasource_item_id: number`

    数据源项的标识符。

  - `eval_id: string`

    评测组的标识符。

  - `object: "eval.run.output_item"`

    对象的类型。始终为 "eval.run.output_item"。

    - `"eval.run.output_item"`

  - `results: array of object { name, passed, score, 2 more }`

    此输出项的评分器结果列表。

    - `name: string`

      评分器的名称。

    - `passed: boolean`

      评分器是否将该输出视为通过。

    - `score: number`

      评分器生成的数值分数。

    - `sample: optional map[unknown] or null`

      评分器生成的可选样本或中间数据。

    - `type: optional string`

      评分器类型（例如 "string-check-grader"）。

  - `run_id: string`

    与此输出项关联的评测运行的标识符。

  - `sample: object { error, finish_reason, input, 7 more }`

    包含评测运行输入和输出的样本。

    - `error: EvalAPIError`

      表示来自 Eval API 错误响应的对象。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

    - `finish_reason: string`

      样本生成完成的原因。

    - `input: array of object { content, role }`

      输入消息数组。

      - `content: string`

        消息的内容。

      - `role: string`

        消息发送者的角色（例如 system、user、developer）。

    - `max_completion_tokens: number`

      允许用于 completion 的最大 token 数。

    - `model: string`

      用于生成样本的模型。

    - `output: array of object { content, role }`

      输出消息数组。

      - `content: optional string`

        消息的内容。

      - `role: optional string`

        消息的角色（例如 "system"、"assistant"、"user"）。

    - `seed: number`

      用于生成样本的种子。

    - `temperature: number`

      所使用的采样温度。

    - `top_p: number`

      用于采样的 top_p 值。

    - `usage: object { cached_tokens, completion_tokens, prompt_tokens, total_tokens }`

      该样本的 token 使用情况详情。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。

      - `completion_tokens: number`

        生成的完成 token 数量。

      - `prompt_tokens: number`

        使用的提示 token 数量。

      - `total_tokens: number`

        使用的 token 总数。

  - `status: string`

    评估运行的状态。

### 输出 Item Retrieve 响应

- `OutputItemRetrieveResponse object { id, created_at, datasource_item, 7 more }`

  表示评估运行输出项的 schema。

  - `id: string`

    评测运行输出项的唯一标识符。

  - `created_at: number`

    评估运行记录创建时的 Unix 时间戳（以秒为单位）。

  - `datasource_item: map[unknown]`

    输入数据源项的详细信息。

  - `datasource_item_id: number`

    数据源项的标识符。

  - `eval_id: string`

    评测组的标识符。

  - `object: "eval.run.output_item"`

    对象的类型。始终为 "eval.run.output_item"。

    - `"eval.run.output_item"`

  - `results: array of object { name, passed, score, 2 more }`

    此输出项的评分器结果列表。

    - `name: string`

      评分器的名称。

    - `passed: boolean`

      评分器是否将该输出视为通过。

    - `score: number`

      评分器生成的数值分数。

    - `sample: optional map[unknown] or null`

      评分器生成的可选样本或中间数据。

    - `type: optional string`

      评分器类型（例如 "string-check-grader"）。

  - `run_id: string`

    与此输出项关联的评测运行的标识符。

  - `sample: object { error, finish_reason, input, 7 more }`

    包含评测运行输入和输出的样本。

    - `error: EvalAPIError`

      表示来自 Eval API 错误响应的对象。

      - `code: string`

        错误代码。

      - `message: string`

        错误消息。

    - `finish_reason: string`

      样本生成完成的原因。

    - `input: array of object { content, role }`

      输入消息数组。

      - `content: string`

        消息的内容。

      - `role: string`

        消息发送者的角色（例如 system、user、developer）。

    - `max_completion_tokens: number`

      允许用于 completion 的最大 token 数。

    - `model: string`

      用于生成样本的模型。

    - `output: array of object { content, role }`

      输出消息数组。

      - `content: optional string`

        消息的内容。

      - `role: optional string`

        消息的角色（例如 "system"、"assistant"、"user"）。

    - `seed: number`

      用于生成样本的种子。

    - `temperature: number`

      所使用的采样温度。

    - `top_p: number`

      用于采样的 top_p 值。

    - `usage: object { cached_tokens, completion_tokens, prompt_tokens, total_tokens }`

      该样本的 token 使用情况详情。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。

      - `completion_tokens: number`

        生成的完成 token 数量。

      - `prompt_tokens: number`

        使用的提示 token 数量。

      - `total_tokens: number`

        使用的 token 总数。

  - `status: string`

    评估运行的状态。
