# 助手

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建助手

**post** `/assistants`

使用模型和指令创建一个智能体。

### 请求体参数

- `model: string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [Model overview](/docs/models) 了解它们的描述。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [Model overview](/docs/models) 了解它们的描述。

    - `"gpt-5"`

    - `"gpt-5-mini"`

    - `"gpt-5-nano"`

    - `"gpt-5-2025-08-07"`

    - `"gpt-5-mini-2025-08-07"`

    - `"gpt-5-nano-2025-08-07"`

    - `"gpt-4.1"`

    - `"gpt-4.1-mini"`

    - `"gpt-4.1-nano"`

    - `"gpt-4.1-2025-04-14"`

    - `"gpt-4.1-mini-2025-04-14"`

    - `"gpt-4.1-nano-2025-04-14"`

    - `"o3-mini"`

    - `"o3-mini-2025-01-31"`

    - `"o1"`

    - `"o1-2024-12-17"`

    - `"gpt-4o"`

    - `"gpt-4o-2024-11-20"`

    - `"gpt-4o-2024-08-06"`

    - `"gpt-4o-2024-05-13"`

    - `"gpt-4o-mini"`

    - `"gpt-4o-mini-2024-07-18"`

    - `"gpt-4.5-preview"`

    - `"gpt-4.5-preview-2025-02-27"`

    - `"gpt-4-turbo"`

    - `"gpt-4-turbo-2024-04-09"`

    - `"gpt-4-0125-preview"`

    - `"gpt-4-turbo-preview"`

    - `"gpt-4-1106-preview"`

    - `"gpt-4-vision-preview"`

    - `"gpt-4"`

    - `"gpt-4-0314"`

    - `"gpt-4-0613"`

    - `"gpt-4-32k"`

    - `"gpt-4-32k-0314"`

    - `"gpt-4-32k-0613"`

    - `"gpt-3.5-turbo"`

    - `"gpt-3.5-turbo-16k"`

    - `"gpt-3.5-turbo-0613"`

    - `"gpt-3.5-turbo-1106"`

    - `"gpt-3.5-turbo-0125"`

    - `"gpt-3.5-turbo-16k-0613"`

- `description: optional string or null`

  智能体的描述。最大长度为 512 个字符。

- `instructions: optional string or null`

  智能体使用的系统指令。最大长度为 256,000 个字符。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 组键值对。这可以
  用于以结构化格式存储有关该对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `name: optional string or null`

  智能体的名称。最大长度为 256 个字符。

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的努力程度。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  降低推理投入可以带来更快的响应并减少
  响应中用于推理的令牌数量。并非所有推理模型都支持每种
  取值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  以了解特定模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自此以来的所有 GPT-3.5 Turbo 模型。 `gpt-3.5-turbo-1106`.

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON schema。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能生成无休止的空白字符，直到生成达到令牌限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表示生成超过了 `max_tokens` 或对话超出了最大上下文长度。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种生成 JSON 响应的旧方法。
    对于支持该格式的模型，建议使用 `json_schema` 。请注意，如果系统或用户消息中没有指示
    模型生成 JSON，那么该模型将不会生成 JSON
    。

    - `type: "json_object"`

      所定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    了解更多关于 [结构化输出](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短横线，且最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，供模型
        决定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象描述。
        了解如何构建 JSON 架构 [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循定义的精确模式，
        在 `schema` 字段中定义。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终 `json_schema`.

      - `"json_schema"`

- `temperature: optional number or null`

  要使用的采样温度，范围在 0 到 2 之间。像 0.8 这样的较高值会使输出更随机，而像 0.2 这样的较低值会使其更集中和确定性。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组由助手的工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      一组 [文件](/docs/api-reference/files) ID 可供 `code_interpreter` 工具使用。与该工具关联的文件最多可有 20 个。

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此助手。最多可有 1 个向量存储附加到该助手。

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      一个辅助工具，用于创建 [向量存储](/docs/api-reference/vector-stores/object) ，其中包含 file_ids，并将其附加到此助手。最多可有 1 个向量存储附加到该助手。

      - `chunking_strategy: optional object { type }  or object { static, type }`

        用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

        - `Auto object { type }`

          默认策略。此策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

          - `type: "auto"`

            始终 `auto`.

            - `"auto"`

        - `Static object { static, type }`

          - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

            - `chunk_overlap_tokens: number`

              块之间重叠的令牌数量。默认值为 `400`.

              请注意，重叠部分不得超过 `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

          - `type: "static"`

            始终 `static`.

            - `"static"`

      - `file_ids: optional array of string`

        要添加到向量存储的 [文件](/docs/api-reference/files) ID 列表。对于 2025 年 11 月之前创建的向量存储，一个向量存储中最多可有 10,000 个文件。对于 2025 年 11 月起创建的向量存储，限制为 100,000,000 个文件。

      - `metadata: optional Metadata or null`

        可附加到对象上的 16 个键值对集合。这可以
        用于以结构化格式存储关于对象的额外信息，
        并通过 API 或仪表盘查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

  助手启用的工具列表。每个助手最多可有 128 个工具。工具类型可为 `code_interpreter`, `file_search`、或 `function`.

  - `CodeInterpreterTool object { type }`

    - `type: "code_interpreter"`

      要定义的工具类型： `code_interpreter`

      - `"code_interpreter"`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      要定义的工具类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      对 文件搜索 工具的覆盖项。

      - `max_num_results: optional number`

        文件搜索 工具应输出的最大结果数。默认值为 20（针对 `gpt-4*` 模型）和 5（针对 `gpt-3.5-turbo`）。该数字应在 1 到 50 之间（含）。

        请注意，文件搜索 工具输出的结果可能少于 `max_num_results` 。参见 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器和 score_threshold 为 0。

        参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是介于0和1之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为a-z、A-Z、0-9，或包含下划线和短划线，最大长度为64。

      - `description: optional string`

        函数功能的描述，模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，描述为JSON Schema对象。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

        省略 `parameters` 定义了一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格模式遵循模式。如果设置为true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时仅支持JSON Schema的子集。在 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的标记结果。因此 0.1 表示仅考虑构成前 10% 概率质量的标记。

  我们通常建议修改此参数或温度，但不要同时修改两者。

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，可以调用模型并使用工具。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建助手时的 Unix 时间戳（秒）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储有关对象的额外信息，
    并可通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概览](/docs/models) 了解它们的描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手启用的工具列表。每个助手最多可以有 128 个工具。工具类型可以是 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对 文件搜索 工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索 工具应输出的最大结果数。默认值为 20，适用于 `gpt-4*` 模型，而值为 5 适用于 `gpt-3.5-turbo`。该数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索 工具可能输出少于 `max_num_results` 个结果。请参阅 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器，且 score_threshold 为 0。

          请参阅 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索 的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于 文件搜索 的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9 或包含下划线和破折号，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用函数时使用。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的文档。

          省略 `parameters` 会定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式遵循 schema。若设为 true，模型将遵循 `parameters` 字段中定义的精确 schema。仅支持 JSON Schema 的子集，当 `strict` 为 `true`。时。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 起的所有 GPT-3.5 Turbo 模型。设置为 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无尽的空白字符，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      对于支持 `json_schema` 的模型，建议使用
      。请注意，如果没有系统或用户消息指示，
      模型不会生成 JSON。

      - `type: "json_object"`

        所定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型用它来
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设为 true，模型将始终遵循
          中定义的 `schema` 确切 schema。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用何种采样温度，取值范围为 0 到 2。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使输出更聚焦和确定性。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组由助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [文件](/docs/api-reference/files) ID 列表提供给 `code_interpreter`` 工具。最多可有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。最多可有 1 个向量存储附加到该助手。

  - `top_p: optional number or null`

    一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的标记结果。因此 0.1 表示仅考虑构成前 10% 概率质量的标记。

    我们通常建议修改此参数或温度，但不要同时修改两者。

### 示例

```http
curl https://api.openai.com/v1/assistants \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-4o",
          "temperature": 1,
          "top_p": 1
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### 代码解释器

```http
curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o"
  }'
```

#### 响应

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

### 文件

```http
curl https://api.openai.com/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
    "tools": [{"type": "file_search"}],
    "tool_resources": {"file_search": {"vector_store_ids": ["vs_123"]}},
    "model": "gpt-4o"
  }'
```

#### 响应

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009403,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": ["vs_123"]
    }
  },
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## 删除助理

**删除** `/assistants/{assistant_id}`

删除智能体。

### 路径参数

- `assistant_id: string`

### 返回值

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### 示例

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "assistant.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "asst_abc123",
  "object": "assistant.deleted",
  "deleted": true
}
```

## 列出助手

**获取** `/assistants`

返回助手列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，你后续的调用可以包含 after=obj_foo 来获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，你后续的调用可以包含 before=obj_foo 来获取列表的上一页。

- `limit: optional number`

  返回对象数量的限制。限制范围介于 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Assistant`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    智能体创建时的 Unix 时间戳（以秒为单位）。

  - `description: string or null`

    智能体的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    智能体使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可
    用于以结构化格式存储有关对象的附加信息，并
    通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概述](/docs/models) 了解相关说明。

  - `name: string or null`

    智能体的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    智能体上启用的工具列表。每个智能体最多可有 128 个工具。工具类型可为 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        要定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        要定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索 工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索 工具应输出的最大结果数。默认值为 20（对于 `gpt-4*` 模型）和 5（对于 `gpt-3.5-turbo`）。此数值应在 1 到 50 之间（含边界）。

          请注意，文件搜索 工具可能输出的结果少于 `max_num_results` 。请参阅 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器，且 score_threshold 为 0。

          请参阅 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

          - `score_threshold: number`

            文件搜索 的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            文件搜索 要使用的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型根据此描述决定何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/docs/guides/function-calling) ，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 以获取有关该格式的文档。

          省略 `parameters` 则定义了一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以遵循架构。如果设置为 true，模型将遵循 `parameters` 字段中定义的精确架构。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来的所有 GPT-3.5 Turbo 模型兼容，启用结构化输出，确保模型匹配你提供的 JSON 架构。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 则启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空白序列，直到生成达到令牌限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，可能会被部分截断，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的旧方法。
      对于支持 `json_schema` 的模型，建议使用
      。请注意，如果没有系统或用户消息指示，
      模型将不会生成 JSON。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        的配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型用它来
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象描述。
          了解如何构建 JSON 架构 [在此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          生成输出时是否启用严格的架构遵循。
          如果设置为 true，模型将始终遵循定义的精确架构
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，范围在 0 到 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使输出更集中和确定性。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    助手工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个列表 [文件](/docs/api-reference/files) 提供给 `code_interpreter`` 工具的 ID。最多可有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此智能体的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。最多可有 1 个向量存储附加到该智能体。

  - `top_p: optional number or null`

    一种替代使用温度进行采样的方法，称为核采样，模型考虑具有 top_p 概率质量的标记结果。因此，0.1 表示仅考虑包含前 10% 概率质量的标记。

    我们通常建议修改此参数或 temperature，但不要同时修改两者。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/assistants \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "description": "description",
      "instructions": "instructions",
      "metadata": {
        "foo": "string"
      },
      "model": "model",
      "name": "name",
      "object": "assistant",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ],
      "response_format": "auto",
      "temperature": 1,
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "string"
          ]
        },
        "file_search": {
          "vector_store_ids": [
            "string"
          ]
        }
      },
      "top_p": 1
    }
  ],
  "first_id": "asst_abc123",
  "has_more": false,
  "last_id": "asst_abc456",
  "object": "list"
}
```

### 示例

```http
curl "https://api.openai.com/v1/assistants?order=desc&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "asst_abc123",
      "object": "assistant",
      "created_at": 1698982736,
      "name": "Coding Tutor",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc456",
      "object": "assistant",
      "created_at": 1698982718,
      "name": "My Assistant",
      "description": null,
      "model": "gpt-4o",
      "instructions": "You are a helpful assistant designed to make me better at coding!",
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    },
    {
      "id": "asst_abc789",
      "object": "assistant",
      "created_at": 1698982643,
      "name": null,
      "description": null,
      "model": "gpt-4o",
      "instructions": null,
      "tools": [],
      "tool_resources": {},
      "metadata": {},
      "top_p": 1.0,
      "temperature": 1.0,
      "response_format": "auto"
    }
  ],
  "first_id": "asst_abc123",
  "last_id": "asst_abc789",
  "has_more": false
}
```

## 检索智能体

**get** `/assistants/{assistant_id}`

检索一个智能体。

### 路径参数

- `assistant_id: string`

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，它可以调用模型并使用工具。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建助手时的 Unix 时间戳（秒）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [模型概述](/docs/models) 了解它们的描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手启用的工具列表。每个助手最多可以有 128 个工具。工具类型可以是 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。默认值对于 `gpt-4*` 模型为20，对于 `gpt-3.5-turbo`。为5。该数字应在1到50之间（含1和50）。

          请注意，文件搜索工具可能输出少于 `max_num_results` 个结果。有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且score_threshold为0。

          有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为a-z、A-Z、0-9，或包含下划线和连字符，最大长度为64。

        - `description: optional string`

          函数功能的描述，由模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 中关于格式的文档。省略。

          省略 `parameters` 定义一个空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式遵循模式。如果设置为 true，模型将严格遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        中了解更多关于结构化输出的信息。 `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    定义的工具类型：指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。在 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 会启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格流，直到生成超过 token 限制，导致长时间运行且看似“卡住”的请求。另请注意，如果 `finish_reason="length"`，这可能表示生成超过了 `max_tokens` 或对话超过最大上下文长度，消息内容可能被部分截断。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的旧方法。
      对于支持 `json_schema` 的模型，建议使用它。请注意，如果没有系统或用户消息指示，
      模型不会生成 JSON，除非有系统或用户消息指示它
      这样做。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9 或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，描述为 JSON Schema 对象。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循定义的精确架构
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    要使用的采样温度，介于 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使其更集中和确定。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组用于助手工具的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [文件](/docs/api-reference/files) ID 列表，供 `code_interpreter`` 工具使用。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到助手的向量存储最多可有 1 个。

  - `top_p: optional number or null`

    一种替代使用温度进行采样的方法，称为核采样，模型考虑具有 top_p 概率质量的标记的结果。因此，0.1 意味着仅考虑构成前 10% 概率质量的标记。

    我们通常建议修改此参数或温度，但不要同时修改两者。

### 示例

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### 示例

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## 修改智能体

**post** `/assistants/{assistant_id}`

修改一个智能体。

### 路径参数

- `assistant_id: string`

### 请求体参数

- `description: optional string or null`

  助手的描述。最大长度为 512 个字符。

- `instructions: optional string or null`

  助手使用的系统指令。最大长度为 256,000 个字符。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 个键值对集合。此功能可
  用于以结构化格式存储有关对象的附加信息，
  并通过 API 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [Model overview](/docs/models) 了解它们的描述。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [Model overview](/docs/models) 了解它们的描述。

    - `"gpt-5"`

    - `"gpt-5-mini"`

    - `"gpt-5-nano"`

    - `"gpt-5-2025-08-07"`

    - `"gpt-5-mini-2025-08-07"`

    - `"gpt-5-nano-2025-08-07"`

    - `"gpt-4.1"`

    - `"gpt-4.1-mini"`

    - `"gpt-4.1-nano"`

    - `"gpt-4.1-2025-04-14"`

    - `"gpt-4.1-mini-2025-04-14"`

    - `"gpt-4.1-nano-2025-04-14"`

    - `"o3-mini"`

    - `"o3-mini-2025-01-31"`

    - `"o1"`

    - `"o1-2024-12-17"`

    - `"gpt-4o"`

    - `"gpt-4o-2024-11-20"`

    - `"gpt-4o-2024-08-06"`

    - `"gpt-4o-2024-05-13"`

    - `"gpt-4o-mini"`

    - `"gpt-4o-mini-2024-07-18"`

    - `"gpt-4.5-preview"`

    - `"gpt-4.5-preview-2025-02-27"`

    - `"gpt-4-turbo"`

    - `"gpt-4-turbo-2024-04-09"`

    - `"gpt-4-0125-preview"`

    - `"gpt-4-turbo-preview"`

    - `"gpt-4-1106-preview"`

    - `"gpt-4-vision-preview"`

    - `"gpt-4"`

    - `"gpt-4-0314"`

    - `"gpt-4-0613"`

    - `"gpt-4-32k"`

    - `"gpt-4-32k-0314"`

    - `"gpt-4-32k-0613"`

    - `"gpt-3.5-turbo"`

    - `"gpt-3.5-turbo-16k"`

    - `"gpt-3.5-turbo-0613"`

    - `"gpt-3.5-turbo-1106"`

    - `"gpt-3.5-turbo-0125"`

    - `"gpt-3.5-turbo-16k-0613"`

- `name: optional string or null`

  助手的名称。最大长度为 256 个字符。

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  降低推理工作量可以加快响应速度并减少用于推理的 token 数量
  并非所有推理模型都支持所有
  值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  了解各模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 时启用结构化输出，可确保模型匹配你提供的 JSON 模式。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 时启用 JSON 模式，可确保模型生成的消息是有效的 JSON。

  **重要提示：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格流，直到达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果生成超过 `finish_reason="length"`，消息内容可能会被截断，这表示生成超过了 `max_tokens` 或对话超出了最大上下文长度。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
    对于支持它的模型，建议使用 `json_schema` 。请注意，如果没有系统或用户消息指示
    模型，该模型将不会生成 JSON，
    除非提示它这样做。

    - `type: "json_object"`

      所定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化的 JSON 响应。
    详细了解 [Structured Outputs](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 的配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短划线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型使用它来
        确定如何按该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象的形式描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循定义的精确模式
        ，见 `schema` 字段。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多信息，请阅读 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终 `json_schema`.

      - `"json_schema"`

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使其更集中和确定性。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组由助手的工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      覆盖可用于 [文件](/docs/api-reference/files) 工具的 `code_interpreter` ID 列表。与该工具关联的文件最多可有 20 个。

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      覆盖 [向量存储](/docs/api-reference/vector-stores/object) 附加到此智能体。每个智能体最多可附加 1 个向量存储。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

  智能体上启用的工具列表。每个智能体最多可有 128 个工具。工具类型可为 `code_interpreter`, `file_search`，或 `function`.

  - `CodeInterpreterTool object { type }`

    - `type: "code_interpreter"`

      正在定义的工具类型： `code_interpreter`

      - `"code_interpreter"`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      正在定义的工具类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      对文件搜索工具的覆盖设置。

      - `max_num_results: optional number`

        文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。模型，默认值为 5。此数字应在 1 到 50（含）之间。

        请注意，文件搜索工具可能输出的结果少于 `max_num_results` 个。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

        参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数作用的描述，模型用它来决定何时以及如何调用函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，描述为 JSON Schema 对象。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

        省略 `parameters` 会定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格 schema 遵循。如果设为 true，模型将严格遵循 `parameters` 字段中定义的精确 schema。仅支持 JSON Schema 的子集当 `strict` 为 `true`。在 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      所定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的 tokens 的结果。因此，0.1 意味着只考虑构成前 10% 概率质量的 tokens。

  我们通常建议只调整这个参数或温度，但不要同时调整两者。

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，它可以调用模型并使用工具。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    助手创建时的 Unix 时间戳（秒）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用的模型，或查看我们的 [Model overview](/docs/models) 了解它们的描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手启用的工具列表。每个助手最多可以有 128 个工具。工具的类型可以是 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。模型，默认值为 5。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具输出的结果可能少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排名选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用它来选择何时以及如何调用函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，描述为 JSON Schema 对象。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的文档。

          省略 `parameters` 将定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以遵循架构。如果设置为 true，模型将遵循 `parameters` 字段中定义的确切架构。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 架构。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 可启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 同时通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无尽的白空格，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能被部分截断，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      使用 `json_schema` 是推荐方式，适用于支持它的模型。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON，
      也不会这样做。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和破折号，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，描述为 JSON Schema 对象。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设置为 true，模型将始终遵循定义的确切 schema
          在 `schema` 字段中。仅支持 JSON Schema 的子集，当
          `strict` 为 `true`。时。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用什么采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使其更集中和确定。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    智能体工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 该工具需要一组向量存储 ID。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [文件](/docs/api-reference/files) 工具使用的 `code_interpreter`` ID 列表。与此工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到助手的向量存储最多可有 1 个。

  - `top_p: optional number or null`

    一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的标记结果。因此 0.1 表示仅考虑构成前 10% 概率质量的标记。

    我们通常建议修改此参数或温度，但不要同时修改两者。

### 示例

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "temperature": 1,
          "top_p": 1
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "description": "description",
  "instructions": "instructions",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "response_format": "auto",
  "temperature": 1,
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  },
  "top_p": 1
}
```

### 示例

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      "tools": [{"type": "file_search"}],
      "model": "gpt-4o"
    }'
```

#### 响应

```json
{
  "id": "asst_123",
  "object": "assistant",
  "created_at": 1699009709,
  "name": "HR Helper",
  "description": null,
  "model": "gpt-4o",
  "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
  "tools": [
    {
      "type": "file_search"
    }
  ],
  "tool_resources": {
    "file_search": {
      "vector_store_ids": []
    }
  },
  "metadata": {},
  "top_p": 1.0,
  "temperature": 1.0,
  "response_format": "auto"
}
```

## 领域类型

### Assistant

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，它可以调用模型并使用工具。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    助手创建时的 Unix 时间戳（秒）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [模型概览](/docs/models) 了解它们的描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手启用的工具列表。每个助手最多可以有 128 个工具。工具类型可以是 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。默认值为20， `gpt-4*` 模型为5， `gpt-3.5-turbo`。此数字应在1到50之间（含1和50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 。有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器和score_threshold为0。

          有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于0和1之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为a-z、A-Z、0-9，或包含下划线和短划线，最大长度为64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用函数时使用。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

          省略 `parameters` 将定义具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式模式遵循模式。如果设置为 true，模型将遵循中定义的精确模式 `parameters` 字段。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。在 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，表示生成超出了 `max_tokens` 或对话超过了最大上下文长度，消息内容可能会被部分截断。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      对于支持 `json_schema` 的模型，建议使用。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      。

      - `type: "json_object"`

        所定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出的配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设置为 true，模型将始终遵循所定义的确切 schema
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使输出更集中和确定性更强。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组由助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个由 [文件](/docs/api-reference/files) ID 组成的列表，可供 `code_interpreter`` 工具使用。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到助手的向量存储最多可有 1 个。

  - `top_p: optional number or null`

    一种替代使用温度进行采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。因此，0.1 表示仅考虑包含前 10% 概率质量的标记。

    我们通常建议修改此项或温度，但不要同时修改两者。

### 智能体已删除

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### 智能体流事件

- `AssistantStreamEvent = object { data, event, enabled }  or object { data, event }  or object { data, event }  or 22 more`

  表示流式传输 Run 时发出的事件。

  服务器发送事件流中的每个事件都有 `event` 和 `data` 属性：

  ```
  event: thread.created
  data: {"id": "thread_123", "object": "thread", ...}
  ```

  每当新对象被创建、转换到新状态或被
  分部分流式传输（增量）时，我们都会发出事件。例如，我们会发出 `thread.run.created` 当新的 run
  被创建时， `thread.run.completed` 当 run 完成时，等等。当助手选择
  在 run 期间创建消息时，我们会发出 `thread.message.created event`，一个
  `thread.message.in_progress` 事件，许多 `thread.message.delta` 事件，最后是一个
  `thread.message.completed` 事件。

  我们可能会随着时间推移添加更多事件，因此建议在你的代码中优雅地处理未知事件
  。请参阅 [Assistants API 快速入门](/docs/assistants/overview) 以了解如何
  将 Assistants API 与流式传输集成。

  - `ThreadCreated object { data, event, enabled }`

    当新的 [线程](/docs/api-reference/threads/object) 被创建。

    - `data: Thread`

      表示一个包含 [消息](/docs/api-reference/messages).

      - `id: string`

        的线程。标识符，可在 API 端点中引用。

      - `created_at: number`

        线程创建时的 Unix 时间戳（秒）。

      - `metadata: Metadata or null`

        可附加到对象的 16 个键值对集合。这可用于
        以结构化格式存储关于对象的额外信息，
        并通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串，
        最大长度为 512 个字符。

      - `object: "thread"`

        对象类型，始终为 `thread`.

        - `"thread"`

      - `tool_resources: object { code_interpreter, file_search }  or null`

        一组资源，供此线程中助理的工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

        - `code_interpreter: optional object { file_ids }`

          - `file_ids: optional array of string`

            可供 [文件](/docs/api-reference/files) 工具使用的 ID 列表。 `code_interpreter` 最多可有 20 个文件与该工具关联。

        - `file_search: optional object { vector_store_ids }`

          - `vector_store_ids: optional array of string`

            该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此线程。线程最多可附加 1 个向量存储。

    - `event: "thread.created"`

      - `"thread.created"`

    - `enabled: optional boolean`

      是否启用输入音频转录。

  - `ThreadRunCreated object { data, event }`

    当新的 [运行](/docs/api-reference/runs/object) 创建时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

      - `id: string`

        上执行的运行。标识符，可在 API 端点中引用。

      - `assistant_id: string`

        用于执行此运行的 [助手的](/docs/api-reference/assistants) ID。

      - `cancelled_at: number or null`

        运行被取消时的 Unix 时间戳（以秒为单位）。

      - `completed_at: number or null`

        运行完成时的 Unix 时间戳（以秒为单位）。

      - `created_at: number`

        运行创建时的 Unix 时间戳（以秒为单位）。

      - `expires_at: number or null`

        运行将过期时的 Unix 时间戳（以秒为单位）。

      - `failed_at: number or null`

        运行失败时的 Unix 时间戳（以秒为单位）。

      - `incomplete_details: object { reason }  or null`

        运行不完整的原因详情。如果运行并非不完整，则为 `null` 。

        - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

          运行不完整的原因。这将指向运行过程中达到的特定令牌限制。

          - `"max_completion_tokens"`

          - `"max_prompt_tokens"`

      - `instructions: string`

        本次运行所用 [助手](/docs/api-reference/assistants) 的指令。

      - `last_error: object { code, message }  or null`

        与此运行关联的最后一个错误。若 `null` 无错误，则为。

        - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

          以下之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

          - `"server_error"`

          - `"rate_limit_exceeded"`

          - `"invalid_prompt"`

        - `message: string`

          错误的可读描述。

      - `max_completion_tokens: number or null`

        指定在运行过程中已使用的最大完成令牌数。

      - `max_prompt_tokens: number or null`

        指定在运行过程中已使用的最大提示令牌数。

      - `metadata: Metadata or null`

        可附加到对象上的16个键值对集合。这可用于
        以结构化格式存储关于对象的附加信息，
        并可通过API或仪表盘查询对象。

        键为字符串，最大长度为64个字符。值为字符串，
        最大长度为512个字符。

      - `model: string`

        本次运行所用 [助手](/docs/api-reference/assistants) 的模型。

      - `object: "thread.run"`

        对象类型，始终为 `thread.run`.

        - `"thread.run"`

      - `parallel_tool_calls: boolean`

        是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

      - `required_action: object { submit_tool_outputs, type }  or null`

        继续运行所需采取操作的详细信息。将为 `null` （如果无需操作）。

        - `submit_tool_outputs: object { tool_calls }`

          继续此运行所需的工具输出详细信息。

          - `tool_calls: array of RequiredActionFunctionToolCall`

            相关工具调用列表。

            - `id: string`

              工具调用的 ID。使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此 ID。

            - `function: object { arguments, name }`

              函数定义。

              - `arguments: string`

                模型期望你传递给函数的参数。

              - `name: string`

                函数名称。

            - `type: "function"`

              输出所需的工具调用类型。目前，这始终是 `function`.

              - `"function"`

        - `type: "submit_tool_outputs"`

          目前，这始终是 `submit_tool_outputs`.

          - `"submit_tool_outputs"`

      - `response_format: AssistantResponseFormatOption or null`

        指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

        设置 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 架构。在 [结构化输出指南](/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 可启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

        **重要提示：** 使用 JSON 模式时，你 **必须** 在系统或用户消息中自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表明生成超出了 `max_tokens` 或对话超出了最大上下文长度。

        - `"auto"`

          `auto` 是默认值

          - `"auto"`

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            所定义的响应格式类型。始终 `text`.

            - `"text"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          对于支持该格式的模型，建议使用 `json_schema` 。请注意，
          模型在没有系统或用户消息指示其生成 JSON 的情况下，不会生成 JSON
          。

          - `type: "json_object"`

            所定义的响应格式类型。始终 `json_object`.

            - `"json_object"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          了解更多关于 [结构化输出](/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            结构化输出配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须为 a-z、A-Z、0-9，或包含
              下划线和短划线，最大长度为 64。

            - `description: optional string`

              响应格式用途的描述，模型据此
              确定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的架构，以 JSON Schema 对象描述。
              了解如何构建 JSON schema [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              是否在生成输出时启用严格架构遵循。
              如果设为 true，模型将始终遵循定义的精确架构
              于 `schema` 字段中。当
              `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [Structured Outputs
              指南](/docs/guides/structured-outputs).

          - `type: "json_schema"`

            所定义响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

      - `started_at: number or null`

        运行开始时的 Unix 时间戳（以秒为单位）。

      - `status: "queued" or "in_progress" or "requires_action" or 6 more`

        运行的状态，可以是 `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`，或 `expired`.

        - `"queued"`

        - `"in_progress"`

        - `"requires_action"`

        - `"cancelling"`

        - `"cancelled"`

        - `"failed"`

        - `"completed"`

        - `"incomplete"`

        - `"expired"`

      - `thread_id: string`

        该项目中执行于 [thread](/docs/api-reference/threads) 的 ID，作为本次运行的一部分。

      - `tool_choice: AssistantToolChoiceOption or null`

        控制模型调用哪个（如果有）工具。
        `none` 表示模型不会调用任何工具，而是生成一条消息。
        `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
        `required` 表示模型必须在响应用户之前调用一个或多个工具。
        指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

        - `"none" or "auto" or "required"`

          `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `AssistantToolChoice object { type, function }`

          指定模型应使用的工具。用于强制模型调用特定工具。

          - `type: "function" or "code_interpreter" or "file_search"`

            工具的类型。如果类型为 `function`，则必须设置函数名称

            - `"function"`

            - `"code_interpreter"`

            - `"file_search"`

          - `function: optional AssistantToolChoiceFunction`

            - `name: string`

              要调用的函数名称。

      - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

        该 [assistant](/docs/api-reference/assistants) 本次运行所用的。

        - `CodeInterpreterTool object { type }`

          - `type: "code_interpreter"`

            所定义工具的类型： `code_interpreter`

            - `"code_interpreter"`

        - `FileSearchTool object { type, file_search }`

          - `type: "file_search"`

            所定义工具的类型： `file_search`

            - `"file_search"`

          - `file_search: optional object { max_num_results, ranking_options }`

            文件搜索工具的覆盖设置。

            - `max_num_results: optional number`

              文件搜索工具应输出的最大结果数。默认值为20，适用于 `gpt-4*` 模型，5适用于 `gpt-3.5-turbo`。该数字应在1到50之间（含1和50）。

              请注意，文件搜索工具可能输出少于 `max_num_results` 的结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

            - `ranking_options: optional object { score_threshold, ranker }`

              文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排名器，且score_threshold为0。

              请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

              - `ranker: optional "auto" or "default_2024_08_21"`

                文件搜索使用的排名器。如果未指定，将使用 `auto` 排名器。

                - `"auto"`

                - `"default_2024_08_21"`

        - `FunctionTool object { function, type }`

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数名称。必须是a-z、A-Z、0-9，或包含下划线和短划线，最大长度为64。

            - `description: optional string`

              函数功能的描述，模型用它来决定何时以及如何调用该函数。

            - `parameters: optional FunctionParameters`

              函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

              省略 `parameters` 将定义具有空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将严格遵循 `parameters` 字段中定义的确切模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

          - `type: "function"`

            中了解更多关于结构化输出的信息。 `function`

            - `"function"`

      - `truncation_strategy: object { type, last_messages }  or null`

        控制运行前线程的截断方式。使用此选项控制运行的初始上下文窗口。

        - `type: "auto" or "last_messages"`

          线程使用的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

          - `"auto"`

          - `"last_messages"`

        - `last_messages: optional number or null`

          构建运行上下文时，线程中最近消息的数量。

      - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

        与运行相关的使用统计信息。该值将为 `null` 如果运行未处于终止状态（即。 `in_progress`, `queued`，等）。

        - `completion_tokens: number`

          运行过程中使用的完成令牌数。

        - `prompt_tokens: number`

          运行过程中使用的提示令牌数。

        - `total_tokens: number`

          使用的令牌总数（提示 + 完成）。

      - `temperature: optional number or null`

        此运行使用的采样温度。如果未设置，默认为 1。

      - `top_p: optional number or null`

        此运行使用的核采样值。如果未设置，默认为 1。

    - `event: "thread.run.created"`

      - `"thread.run.created"`

  - `ThreadRunQueued object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 移动到 `queued` 状态时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.queued"`

      - `"thread.run.queued"`

  - `ThreadRunInProgress object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 移动到 `in_progress` 状态时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.in_progress"`

      - `"thread.run.in_progress"`

  - `ThreadRunRequiresAction object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 转移到 `requires_action` 状态时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.requires_action"`

      - `"thread.run.requires_action"`

  - `ThreadRunCompleted object { data, event }`

    上的执行运行。当 [运行](/docs/api-reference/runs/object) 完成时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.completed"`

      - `"thread.run.completed"`

  - `ThreadRunIncomplete object { data, event }`

    上的执行运行。当 [运行](/docs/api-reference/runs/object) 以状态 `incomplete`.

    - `data: Run`

      结束时发生。表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.incomplete"`

      - `"thread.run.incomplete"`

  - `ThreadRunFailed object { data, event }`

    上的执行运行。当 [运行](/docs/api-reference/runs/object) 失败时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.failed"`

      - `"thread.run.failed"`

  - `ThreadRunCancelling object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 转变为 `cancelling` 状态时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.cancelling"`

      - `"thread.run.cancelling"`

  - `ThreadRunCancelled object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 被取消时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.cancelled"`

      - `"thread.run.cancelled"`

  - `ThreadRunExpired object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 过期时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.expired"`

      - `"thread.run.expired"`

  - `ThreadRunStepCreated object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 被创建时发生。

    - `data: RunStep`

      表示运行执行过程中的一个步骤。

      - `id: string`

        运行步骤的标识符，可在 API 端点中引用。

      - `assistant_id: string`

        与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

      - `cancelled_at: number or null`

        运行步骤被取消时的 Unix 时间戳（秒）。

      - `completed_at: number or null`

        运行步骤完成时的 Unix 时间戳（秒）。

      - `created_at: number`

        运行步骤创建时的 Unix 时间戳（秒）。

      - `expired_at: number or null`

        运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤被视为已过期。

      - `failed_at: number or null`

        运行步骤失败时的 Unix 时间戳（秒）。

      - `last_error: object { code, message }  or null`

        与此运行步骤关联的最后一个错误。如果没有错误，则为 `null` 。

        - `code: "server_error" or "rate_limit_exceeded"`

          以下之一： `server_error` 或 `rate_limit_exceeded`.

          - `"server_error"`

          - `"rate_limit_exceeded"`

        - `message: string`

          错误的人类可读描述。

      - `metadata: Metadata or null`

        可附加到对象上的 16 个键值对集合。这在以结构化
        格式存储有关对象的附加信息，并通过 API 或仪表板查询对象时
        非常有用。

        键是最大长度为 64 个字符的字符串。值是最大长度
        为 512 个字符的字符串。

      - `object: "thread.run.step"`

        对象类型，始终为 `thread.run.step`.

        - `"thread.run.step"`

      - `run_id: string`

        所属 [run](/docs/api-reference/runs) （此运行步骤所属的 run）的 ID。

      - `status: "in_progress" or "cancelled" or "failed" or 2 more`

        运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

        - `"in_progress"`

        - `"cancelled"`

        - `"failed"`

        - `"completed"`

        - `"expired"`

      - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

        运行步骤的详细信息。

        - `MessageCreationStepDetails object { message_creation, type }`

          运行步骤创建消息的详细信息。

          - `message_creation: object { message_id }`

            - `message_id: string`

              由该运行步骤创建的消息的 ID。

          - `type: "message_creation"`

            始终 `message_creation`.

            - `"message_creation"`

        - `ToolCallsStepDetails object { tool_calls, type }`

          工具调用的详细信息。

          - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

            运行步骤涉及的工具调用数组。这些调用可与三种类型的工具之一关联： `code_interpreter`, `file_search`，或 `function`.

            - `CodeInterpreterToolCall object { id, code_interpreter, type }`

              运行步骤涉及的代码解释器工具调用的详细信息。

              - `id: string`

                工具调用的 ID。

              - `code_interpreter: object { input, outputs }`

                代码解释器工具调用的定义。

                - `input: string`

                  代码解释器工具调用的输入。

                - `outputs: array of object { logs, type }  or object { image, type }`

                  代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图片（`image`）。每个项目由不同的对象类型表示。

                  - `CodeInterpreterLogOutput object { logs, type }`

                    作为运行步骤一部分的代码解释器工具调用的文本输出。

                    - `logs: string`

                      代码解释器工具调用的文本输出。

                    - `type: "logs"`

                      始终 `logs`.

                      - `"logs"`

                  - `CodeInterpreterImageOutput object { image, type }`

                    - `image: object { file_id }`

                      - `file_id: string`

                        该 [文件](/docs/api-reference/files) 图像的 ID。

                    - `type: "image"`

                      始终 `image`.

                      - `"image"`

              - `type: "code_interpreter"`

                工具调用的类型。对于此类工具调用，始终为 `code_interpreter` 。

                - `"code_interpreter"`

            - `FileSearchToolCall object { id, file_search, type }`

              - `id: string`

                工具调用对象的 ID。

              - `file_search: object { ranking_options, results }`

                目前，这始终是一个空对象。

                - `ranking_options: optional object { ranker, score_threshold }`

                  文件搜索的排序选项。

                  - `ranker: "auto" or "default_2024_08_21"`

                    用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                    - `"auto"`

                    - `"default_2024_08_21"`

                  - `score_threshold: number`

                    文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

                - `results: optional array of object { file_id, file_name, score, content }`

                  文件搜索的结果。

                  - `file_id: string`

                    找到结果所在的文件的 ID。

                  - `file_name: string`

                    找到结果所在的文件的名称。

                  - `score: number`

                    结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

                  - `content: optional array of object { text, type }`

                    找到的结果的内容。只有在通过 include 查询参数请求时，才会包含内容。

                    - `text: optional string`

                      文件的文本内容。

                    - `type: optional "text"`

                      内容的类型。

                      - `"text"`

              - `type: "file_search"`

                工具调用的类型。这始终会是 `file_search` 对于此类工具调用。

                - `"file_search"`

            - `FunctionToolCall object { id, function, type }`

              - `id: string`

                工具调用对象的 ID。

              - `function: object { arguments, name, output }`

                所调用函数的定义。

                - `arguments: string`

                  传递给函数的参数。

                - `name: string`

                  函数的名称。

                - `output: string or null`

                  函数的输出。如果输出尚未 `null` 生成，这将是 [已提交](/docs/api-reference/runs/submitToolOutputs) 。

              - `type: "function"`

                工具调用的类型。对于此类型的工具调用，其值始终为 `function` 。

                - `"function"`

          - `type: "tool_calls"`

            始终 `tool_calls`.

            - `"tool_calls"`

      - `thread_id: string`

        被运行的 [线程](/docs/api-reference/threads) 的 ID。

      - `type: "message_creation" or "tool_calls"`

        运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

        - `"message_creation"`

        - `"tool_calls"`

      - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

        与运行步骤相关的使用统计。该值将 `null` 当运行步骤的状态为 `in_progress`.

        - `completion_tokens: number`

          运行步骤过程中使用的完成令牌数。

        - `prompt_tokens: number`

          运行步骤过程中使用的提示令牌数。

        - `total_tokens: number`

          使用的令牌总数（提示 + 完成）。

    - `event: "thread.run.step.created"`

      - `"thread.run.step.created"`

  - `ThreadRunStepInProgress object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 移动到 `in_progress` 状态时发生。

    - `data: RunStep`

      表示运行执行中的一个步骤。

    - `event: "thread.run.step.in_progress"`

      - `"thread.run.step.in_progress"`

  - `ThreadRunStepDelta object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 的部分内容正在流式传输时发生。

    - `data: RunStepDeltaEvent`

      表示运行步骤增量，即流式传输过程中运行步骤上任何更改的字段。

      - `id: string`

        运行步骤的标识符，可在 API 端点中引用。

      - `delta: object { step_details }`

        包含运行步骤上已更改字段的增量。

        - `step_details: optional RunStepDeltaMessageDelta or ToolCallDeltaObject`

          运行步骤的详细信息。

          - `RunStepDeltaMessageDelta object { type, message_creation }`

            运行步骤创建消息的详细信息。

            - `type: "message_creation"`

              始终 `message_creation`.

              - `"message_creation"`

            - `message_creation: optional object { message_id }`

              - `message_id: optional string`

                由该运行步骤创建的消息的 ID。

          - `ToolCallDeltaObject object { type, tool_calls }`

            工具调用的详细信息。

            - `type: "tool_calls"`

              始终 `tool_calls`.

              - `"tool_calls"`

            - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

              运行步骤涉及的工具调用数组。这些可以与三种类型的工具之一相关联： `code_interpreter`, `file_search`、 `function`.

              - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

                运行步骤所涉及的代码解释器工具调用的详细信息。

                - `index: number`

                  工具调用数组中的工具调用索引。

                - `type: "code_interpreter"`

                  工具调用的类型。对于此类工具调用，它始终为 `code_interpreter` 。

                  - `"code_interpreter"`

                - `id: optional string`

                  工具调用的 ID。

                - `code_interpreter: optional object { input, outputs }`

                  代码解释器工具调用定义。

                  - `input: optional string`

                    代码解释器工具调用的输入。

                  - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                    代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图像（`image`)。每个都由不同的对象类型表示。

                    - `CodeInterpreterLogs object { index, type, logs }`

                      代码解释器工具调用在运行步骤中的文本输出。

                      - `index: number`

                        输出数组中的输出索引。

                      - `type: "logs"`

                        始终 `logs`.

                        - `"logs"`

                      - `logs: optional string`

                        代码解释器工具调用的文本输出。

                    - `CodeInterpreterOutputImage object { index, type, image }`

                      - `index: number`

                        输出数组中的输出索引。

                      - `type: "image"`

                        始终 `image`.

                        - `"image"`

                      - `image: optional object { file_id }`

                        - `file_id: optional string`

                          该 [file](/docs/api-reference/files) 图片的 ID。

              - `FileSearchToolCallDelta object { file_search, index, type, id }`

                - `file_search: unknown`

                  目前，这始终是一个空对象。

                - `index: number`

                  工具调用在工具调用数组中的索引。

                - `type: "file_search"`

                  工具调用的类型。对于此类型的工具调用，它始终是 `file_search` 。

                  - `"file_search"`

                - `id: optional string`

                  工具调用对象的 ID。

              - `FunctionToolCallDelta object { index, type, id, function }`

                - `index: number`

                  工具调用在工具调用数组中的索引。

                - `type: "function"`

                  工具调用的类型。对于此类型的工具调用，它始终是 `function` 。

                  - `"function"`

                - `id: optional string`

                  工具调用对象的 ID。

                - `function: optional object { arguments, name, output }`

                  被调用函数的定义。

                  - `arguments: optional string`

                    传递给函数的参数。

                  - `name: optional string`

                    函数的名称。

                  - `output: optional string or null`

                    函数的输出。如果输出尚未 `null` 提交，则此值为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

      - `object: "thread.run.step.delta"`

        对象类型，始终为 `thread.run.step.delta`.

        - `"thread.run.step.delta"`

    - `event: "thread.run.step.delta"`

      - `"thread.run.step.delta"`

  - `ThreadRunStepCompleted object { data, event }`

    当一个 [run step](/docs/api-reference/run-steps/step-object) 完成后触发。

    - `data: RunStep`

      表示一次运行中执行的一个步骤。

    - `event: "thread.run.step.completed"`

      - `"thread.run.step.completed"`

  - `ThreadRunStepFailed object { data, event }`

    当一个 [run step](/docs/api-reference/run-steps/step-object) 失败时触发。

    - `data: RunStep`

      表示一次运行中执行的一个步骤。

    - `event: "thread.run.step.failed"`

      - `"thread.run.step.failed"`

  - `ThreadRunStepCancelled object { data, event }`

    当一个 [run step](/docs/api-reference/run-steps/step-object) 被取消时触发。

    - `data: RunStep`

      表示一次运行中执行的一个步骤。

    - `event: "thread.run.step.cancelled"`

      - `"thread.run.step.cancelled"`

  - `ThreadRunStepExpired object { data, event }`

    当一个 [run step](/docs/api-reference/run-steps/step-object) 过期时触发。

    - `data: RunStep`

      表示一次运行中执行的一个步骤。

    - `event: "thread.run.step.expired"`

      - `"thread.run.step.expired"`

  - `ThreadMessageCreated object { data, event }`

    当一个 [message](/docs/api-reference/messages/object) 创建时触发。

    - `data: Message`

      表示一个 [线程](/docs/api-reference/threads).

      - `id: string`

        标识符，可在 API 端点中引用。

      - `assistant_id: string or null`

        如果适用，创建此消息的 [智能体](/docs/api-reference/assistants) 的 ID。

      - `attachments: array of object { file_id, tools }  or null`

        附加到消息的文件列表，以及它们所添加到的工具。

        - `file_id: optional string`

          要附加到消息的文件的 ID。

        - `tools: optional array of CodeInterpreterTool or object { type }`

          要将此文件添加到的工具。

          - `CodeInterpreterTool object { type }`

          - `FileSearchTool object { type }`

            - `type: "file_search"`

              所定义的工具类型： `file_search`

              - `"file_search"`

      - `completed_at: number or null`

        消息完成时的 Unix 时间戳（秒）。

      - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

        消息的内容，以文本和/或图像的数组形式表示。

        - `ImageFileContentBlock object { image_file, type }`

          引用消息内容中的 [文件](/docs/api-reference/files) 图像。

          - `image_file: ImageFile`

            - `file_id: string`

              该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。在 `purpose="vision"` 上传文件时设置，如果你稍后需要显示文件内容。

            - `detail: optional "auto" or "low" or "high"`

              如果用户指定，则指定图像的细节级别。 `low` 使用更少的 token，你可以通过以下方式选择高分辨率 `high`.

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_file"`

            始终 `image_file`.

            - `"image_file"`

        - `ImageURLContentBlock object { image_url, type }`

          引用消息内容中的图片 URL。

          - `image_url: ImageURL`

            - `url: string`

              图片的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

            - `detail: optional "auto" or "low" or "high"`

              指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

        - `TextContentBlock object { text, type }`

          作为消息一部分的文本内容。

          - `text: Text`

            - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

              - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

                消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

                - `end_index: number`

                - `file_citation: object { file_id }`

                  - `file_id: string`

                    引用来源的特定文件的 ID。

                - `start_index: number`

                - `text: string`

                  需要替换的消息内容中的文本。

                - `type: "file_citation"`

                  始终 `file_citation`.

                  - `"file_citation"`

              - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

                当助手使用 `code_interpreter` 工具生成文件时，生成的文件的 URL。

                - `end_index: number`

                - `file_path: object { file_id }`

                  - `file_id: string`

                    生成的文件的 ID。

                - `start_index: number`

                - `text: string`

                  需要替换的消息内容中的文本。

                - `type: "file_path"`

                  始终 `file_path`.

                  - `"file_path"`

            - `value: string`

              构成文本的数据。

          - `type: "text"`

            始终 `text`.

            - `"text"`

        - `RefusalContentBlock object { refusal, type }`

          助手生成的拒绝内容。

          - `refusal: string`

          - `type: "refusal"`

            始终 `refusal`.

            - `"refusal"`

      - `created_at: number`

        消息创建时的 Unix 时间戳（秒）。

      - `incomplete_at: number or null`

        消息被标记为不完整时的 Unix 时间戳（秒）。

      - `incomplete_details: object { reason }  or null`

        对于不完整的消息，说明消息不完整的原因的详细信息。

        - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

          消息不完整的原因。

          - `"content_filter"`

          - `"max_tokens"`

          - `"run_cancelled"`

          - `"run_expired"`

          - `"run_failed"`

      - `metadata: Metadata or null`

        可附加到对象上的 16 组键值对。这可以
        用于以结构化格式存储关于对象的附加信息，
        并通过 API 或仪表盘查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串，
        最大长度为 512 个字符。

      - `object: "thread.message"`

        对象类型，始终为 `thread.message`.

        - `"thread.message"`

      - `role: "user" or "assistant"`

        产生消息的实体。其值可为 `user` 或 `assistant`.

        - `"user"`

        - `"assistant"`

      - `run_id: string or null`

        与该消息创建相关联的 [run](/docs/api-reference/runs) 的 ID。当消息是通过创建消息或创建线程端点手动创建时，该值为 `null` 。

      - `status: "in_progress" or "incomplete" or "completed"`

        消息的状态，可为 `in_progress`, `incomplete`，或 `completed`.

        - `"in_progress"`

        - `"incomplete"`

        - `"completed"`

      - `thread_id: string`

        该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

    - `event: "thread.message.created"`

      - `"thread.message.created"`

  - `ThreadMessageInProgress object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 进入 `in_progress` 状态时发生。

    - `data: Message`

      表示 [线程](/docs/api-reference/threads).

    - `event: "thread.message.in_progress"`

      - `"thread.message.in_progress"`

  - `ThreadMessageDelta object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 部分内容正在流式传输时发生。

    - `data: MessageDeltaEvent`

      表示消息增量，即流式传输期间消息上发生变化的字段。

      - `id: string`

        消息的标识符，可在 API 端点中引用。

      - `delta: MessageDelta`

        包含消息上已变化字段的增量。

        - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

          消息内容，以文本和/或图片数组表示。

          - `ImageFileDeltaBlock object { index, type, image_file }`

            引用消息内容中的 [文件](/docs/api-reference/files) 图片。

            - `index: number`

              消息中内容部分的索引。

            - `type: "image_file"`

              始终 `image_file`.

              - `"image_file"`

            - `image_file: optional ImageFileDelta`

              - `detail: optional "auto" or "low" or "high"`

                如果用户指定了图片，则指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_id: optional string`

                该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 在稍后需要显示文件内容时，在上传文件时进行设置。

          - `TextDeltaBlock object { index, type, text }`

            消息中作为一部分的文本内容。

            - `index: number`

              消息中内容部分的索引。

            - `type: "text"`

              总是 `text`.

              - `"text"`

            - `text: optional TextDelta`

              - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

                - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

                  消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

                  - `index: number`

                    文本内容部分中注释的索引。

                  - `type: "file_citation"`

                    总是 `file_citation`.

                    - `"file_citation"`

                  - `end_index: optional number`

                  - `file_citation: optional object { file_id, quote }`

                    - `file_id: optional string`

                      引用来源的特定文件的 ID。

                    - `quote: optional string`

                      文件中的特定引文。

                  - `start_index: optional number`

                  - `text: optional string`

                    消息内容中需要替换的文本。

                - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

                  当助手使用 `code_interpreter` 工具生成文件时生成的文件的 URL。

                  - `index: number`

                    文本内容部分中注释的索引。

                  - `type: "file_path"`

                    总是 `file_path`.

                    - `"file_path"`

                  - `end_index: optional number`

                  - `file_path: optional object { file_id }`

                    - `file_id: optional string`

                      生成的文件的 ID。

                  - `start_index: optional number`

                  - `text: optional string`

                    需要替换的消息内容中的文本。

              - `value: optional string`

                构成文本的数据。

          - `RefusalDeltaBlock object { index, type, refusal }`

            作为消息一部分的拒绝内容。

            - `index: number`

              消息中拒绝部分的索引。

            - `type: "refusal"`

              始终 `refusal`.

              - `"refusal"`

            - `refusal: optional string`

          - `ImageURLDeltaBlock object { index, type, image_url }`

            引用消息内容中的图片 URL。

            - `index: number`

              消息中内容部分的索引。

            - `type: "image_url"`

              始终 `image_url`.

              - `"image_url"`

            - `image_url: optional ImageURLDelta`

              - `detail: optional "auto" or "low" or "high"`

                指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率，通过 `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `url: optional string`

                图片的 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

        - `role: optional "user" or "assistant"`

          生成消息的实体。可为 `user` 或 `assistant`.

          - `"user"`

          - `"assistant"`

      - `object: "thread.message.delta"`

        对象类型，始终为 `thread.message.delta`.

        - `"thread.message.delta"`

    - `event: "thread.message.delta"`

      - `"thread.message.delta"`

  - `ThreadMessageCompleted object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 完成时发生。

    - `data: Message`

      表示 [线程](/docs/api-reference/threads).

    - `event: "thread.message.completed"`

      - `"thread.message.completed"`

  - `ThreadMessageIncomplete object { data, event }`

    当 [message](/docs/api-reference/messages/object) 在完成之前结束。

    - `data: Message`

      表示 [thread](/docs/api-reference/threads).

    - `event: "thread.message.incomplete"`

      - `"thread.message.incomplete"`

  - `ErrorEvent object { data, event }`

    当发生 [error](/docs/guides/error-codes#api-errors) 时出现。这可能是由于内部服务器错误或超时导致的。

    - `data: ErrorObject`

      - `code: string or null`

      - `message: string`

      - `param: string or null`

      - `type: string`

    - `event: "error"`

      - `"error"`

  - `DoneEvent object { data, event }`

    当流结束时出现。

    - `data: "[DONE]"`

      - `"[DONE]"`

    - `event: "done"`

      - `"done"`

### 代码解释器工具

- `CodeInterpreterTool object { type }`

  - `type: "code_interpreter"`

    正在定义的工具有类型： `code_interpreter`

    - `"code_interpreter"`

### 文件搜索工具

- `FileSearchTool object { type, file_search }`

  - `type: "file_search"`

    正在定义的工具类型： `file_search`

    - `"file_search"`

  - `file_search: optional object { max_num_results, ranking_options }`

    对文件搜索工具的覆盖设置。

    - `max_num_results: optional number`

      文件搜索工具应输出的最大结果数。默认值为 20，适用于 `gpt-4*` 模型，以及 5，适用于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含边界）。

      请注意，文件搜索工具可能输出的结果少于 `max_num_results` 请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

    - `ranking_options: optional object { score_threshold, ranker }`

      文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

      请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

      - `score_threshold: number`

        文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

      - `ranker: optional "auto" or "default_2024_08_21"`

        用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

        - `"auto"`

        - `"default_2024_08_21"`

### Function Tool

- `FunctionTool object { function, type }`

  - `function: FunctionDefinition`

    - `name: string`

      要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

    - `description: optional string`

      函数功能的描述，模型用于决定何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

      省略 `parameters` 可定义一个参数列表为空的函数。

    - `strict: optional boolean or null`

      是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。true 时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

  - `type: "function"`

    中了解更多关于结构化输出的信息。正在定义的工具类型： `function`

    - `"function"`

### 消息流事件

- `MessageStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 2 more`

  当 [消息](/docs/api-reference/messages/object) 被创建时触发。

  - `ThreadMessageCreated object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 被创建时触发。

    - `data: Message`

      表示 [线程](/docs/api-reference/threads).

      - `id: string`

        中的一条消息。该标识符可在 API 端点中引用。

      - `assistant_id: string or null`

        如果适用，则为编写此消息的 [助手](/docs/api-reference/assistants) 的 ID。

      - `attachments: array of object { file_id, tools }  or null`

        附加到消息的文件列表，以及它们被添加到的工具。

        - `file_id: optional string`

          要附加到消息的文件的 ID。

        - `tools: optional array of CodeInterpreterTool or object { type }`

          要添加此文件的工具。

          - `CodeInterpreterTool object { type }`

            - `type: "code_interpreter"`

              正在定义的工具类型： `code_interpreter`

              - `"code_interpreter"`

          - `FileSearchTool object { type }`

            - `type: "file_search"`

              正在定义的工具类型： `file_search`

              - `"file_search"`

      - `completed_at: number or null`

        消息完成时的 Unix 时间戳（以秒为单位）。

      - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

        消息的内容，以文本和/或图像的数组形式呈现。

        - `ImageFileContentBlock object { image_file, type }`

          引用一张图像 [文件](/docs/api-reference/files) 消息内容中的。

          - `image_file: ImageFile`

            - `file_id: string`

              该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 上传文件时，如果之后需要显示文件内容。

            - `detail: optional "auto" or "low" or "high"`

              如果用户指定，则指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_file"`

            始终 `image_file`.

            - `"image_file"`

        - `ImageURLContentBlock object { image_url, type }`

          引用消息内容中的图像 URL。

          - `image_url: ImageURL`

            - `url: string`

              图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

        - `TextContentBlock object { text, type }`

          作为消息一部分的文本内容。

          - `text: Text`

            - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

              - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

                消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

                - `end_index: number`

                - `file_citation: object { file_id }`

                  - `file_id: string`

                    引文来源的特定文件的 ID。

                - `start_index: number`

                - `text: string`

                  消息内容中需要替换的文本。

                - `type: "file_citation"`

                  始终 `file_citation`.

                  - `"file_citation"`

              - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

                当助手使用 `code_interpreter` 工具生成文件时，所生成文件的 URL。

                - `end_index: number`

                - `file_path: object { file_id }`

                  - `file_id: string`

                    生成的文件的 ID。

                - `start_index: number`

                - `text: string`

                  需要替换的消息内容中的文本。

                - `type: "file_path"`

                  始终 `file_path`.

                  - `"file_path"`

            - `value: string`

              构成文本的数据。

          - `type: "text"`

            始终 `text`.

            - `"text"`

        - `RefusalContentBlock object { refusal, type }`

          助手生成的拒绝内容。

          - `refusal: string`

          - `type: "refusal"`

            始终 `refusal`.

            - `"refusal"`

      - `created_at: number`

        消息创建时的 Unix 时间戳（秒）。

      - `incomplete_at: number or null`

        消息被标记为不完整时的 Unix 时间戳（秒）。

      - `incomplete_details: object { reason }  or null`

        在不完整的消息中，说明消息不完整原因的详细信息。

        - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

          消息不完整的原因。

          - `"content_filter"`

          - `"max_tokens"`

          - `"run_cancelled"`

          - `"run_expired"`

          - `"run_failed"`

      - `metadata: Metadata or null`

        可附加到对象上的 16 个键值对集合。这可以
        用于以结构化格式存储有关对象的额外信息，
        并可通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串，
        最大长度为 512 个字符。

      - `object: "thread.message"`

        对象类型，始终为 `thread.message`.

        - `"thread.message"`

      - `role: "user" or "assistant"`

        生成消息的实体。取以下值之一： `user` 或 `assistant`.

        - `"user"`

        - `"assistant"`

      - `run_id: string or null`

        与此消息创建关联的 [run](/docs/api-reference/runs) 的 ID。值为 `null` 当消息通过创建消息或创建线程端点手动创建时。

      - `status: "in_progress" or "incomplete" or "completed"`

        消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

        - `"in_progress"`

        - `"incomplete"`

        - `"completed"`

      - `thread_id: string`

        该 [thread](/docs/api-reference/threads) 此消息所属的 ID。

    - `event: "thread.message.created"`

      - `"thread.message.created"`

  - `ThreadMessageInProgress object { data, event }`

    当 [message](/docs/api-reference/messages/object) 移动到 `in_progress` 状态时发生。

    - `data: Message`

      表示 [thread](/docs/api-reference/threads).

    - `event: "thread.message.in_progress"`

      - `"thread.message.in_progress"`

  - `ThreadMessageDelta object { data, event }`

    当 [Message](/docs/api-reference/messages/object) 的部分内容正在流式传输时发生。

    - `data: MessageDeltaEvent`

      表示消息增量，即流式传输期间消息上任何更改的字段。

      - `id: string`

        消息的标识符，可在 API 端点中引用。

      - `delta: MessageDelta`

        包含消息中已变更字段的增量。

        - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

          消息的内容为文本和/或图像的数组。

          - `ImageFileDeltaBlock object { index, type, image_file }`

            引用消息 [内容中的](/docs/api-reference/files) 文件。

            - `index: number`

              消息中内容部分的索引。

            - `type: "image_file"`

              始终 `image_file`.

              - `"image_file"`

            - `image_file: optional ImageFileDelta`

              - `detail: optional "auto" or "low" or "high"`

                如果用户指定，则指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用 `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_id: optional string`

                该 [高分辨率，通过](/docs/api-reference/files) 消息内容中图像的 ID。上传文件时设置 `purpose="vision"` ，以便日后需要显示文件内容时使用。

          - `TextDeltaBlock object { index, type, text }`

            作为消息一部分的文本内容。

            - `index: number`

              消息中内容部分的索引。

            - `type: "text"`

              始终 `text`.

              - `"text"`

            - `text: optional TextDelta`

              - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

                - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

                  消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用"file_search"工具搜索文件时生成。

                  - `index: number`

                    文本内容部分中注释的索引。

                  - `type: "file_citation"`

                    始终 `file_citation`.

                    - `"file_citation"`

                  - `end_index: optional number`

                  - `file_citation: optional object { file_id, quote }`

                    - `file_id: optional string`

                      引文来源的特定文件的 ID。

                    - `quote: optional string`

                      文件中的具体引用内容。

                  - `start_index: optional number`

                  - `text: optional string`

                    消息内容中需要替换的文本。

                - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

                  当助手使用 `code_interpreter` 工具生成文件时，生成的文件的 URL。

                  - `index: number`

                    文本内容部分中注释的索引。

                  - `type: "file_path"`

                    始终 `file_path`.

                    - `"file_path"`

                  - `end_index: optional number`

                  - `file_path: optional object { file_id }`

                    - `file_id: optional string`

                      生成的文件的 ID。

                  - `start_index: optional number`

                  - `text: optional string`

                    消息内容中需要替换的文本。

              - `value: optional string`

                构成文本的数据。

          - `RefusalDeltaBlock object { index, type, refusal }`

            作为消息一部分的拒绝内容。

            - `index: number`

              消息中拒绝部分的索引。

            - `type: "refusal"`

              始终 `refusal`.

              - `"refusal"`

            - `refusal: optional string`

          - `ImageURLDeltaBlock object { index, type, image_url }`

            引用消息内容中的图像 URL。

            - `index: number`

              消息中内容部分的索引。

            - `type: "image_url"`

              始终 `image_url`.

              - `"image_url"`

            - `image_url: optional ImageURLDelta`

              - `detail: optional "auto" or "low" or "high"`

                指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `url: optional string`

                图像的 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

        - `role: optional "user" or "assistant"`

          产生消息的实体。其中之一 `user` 或 `assistant`.

          - `"user"`

          - `"assistant"`

      - `object: "thread.message.delta"`

        对象类型，始终为 `thread.message.delta`.

        - `"thread.message.delta"`

    - `event: "thread.message.delta"`

      - `"thread.message.delta"`

  - `ThreadMessageCompleted object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 完成时发生。

    - `data: Message`

      表示 [线程](/docs/api-reference/threads).

    - `event: "thread.message.completed"`

      - `"thread.message.completed"`

  - `ThreadMessageIncomplete object { data, event }`

    当 [消息](/docs/api-reference/messages/object) 在完成前结束时发生。

    - `data: Message`

      表示 [线程](/docs/api-reference/threads).

    - `event: "thread.message.incomplete"`

      - `"thread.message.incomplete"`

### 运行步骤流式事件

- `RunStepStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 4 more`

  当 [运行步骤](/docs/api-reference/run-steps/step-object) 被创建时触发。

  - `ThreadRunStepCreated object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 被创建时触发。

    - `data: RunStep`

      表示运行中的一个执行步骤。

      - `id: string`

        运行步骤的标识符，可在 API 端点中引用。

      - `assistant_id: string`

        与该运行步骤关联的 [助手](/docs/api-reference/assistants) 的 ID。

      - `cancelled_at: number or null`

        运行步骤被取消时的 Unix 时间戳（秒）。

      - `completed_at: number or null`

        运行步骤完成时的 Unix 时间戳（秒）。

      - `created_at: number`

        运行步骤创建时的 Unix 时间戳（秒）。

      - `expired_at: number or null`

        运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤被视为已过期。

      - `failed_at: number or null`

        运行步骤失败时的 Unix 时间戳（秒）。

      - `last_error: object { code, message }  or null`

        与此运行步骤关联的最后一个错误。如果没有错误，则为 `null` 。

        - `code: "server_error" or "rate_limit_exceeded"`

          以下之一： `server_error` 或 `rate_limit_exceeded`.

          - `"server_error"`

          - `"rate_limit_exceeded"`

        - `message: string`

          错误的人类可读描述。

      - `metadata: Metadata or null`

        可附加到对象上的16组键值对。这可以
        用于以结构化格式存储关于对象的额外信息，
        以及通过 API 或仪表盘查询对象。

        键是字符串，最大长度为64个字符。值是字符串
        ，最大长度为512个字符。

      - `object: "thread.run.step"`

        对象类型，始终为 `thread.run.step`.

        - `"thread.run.step"`

      - `run_id: string`

        此运行步骤所属的 [run](/docs/api-reference/runs) 的ID。

      - `status: "in_progress" or "cancelled" or "failed" or 2 more`

        运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

        - `"in_progress"`

        - `"cancelled"`

        - `"failed"`

        - `"completed"`

        - `"expired"`

      - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

        运行步骤的详细信息。

        - `MessageCreationStepDetails object { message_creation, type }`

          运行步骤创建消息的详细信息。

          - `message_creation: object { message_id }`

            - `message_id: string`

              此运行步骤创建的消息的ID。

          - `type: "message_creation"`

            始终为 `message_creation`.

            - `"message_creation"`

        - `ToolCallsStepDetails object { tool_calls, type }`

          工具调用的详细信息。

          - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

            运行步骤涉及的工具调用数组。这些可以与三种工具类型之一关联： `code_interpreter`, `file_search`，或 `function`.

            - `CodeInterpreterToolCall object { id, code_interpreter, type }`

              运行步骤涉及的代码解释器工具调用的详细信息。

              - `id: string`

                工具调用的 ID。

              - `code_interpreter: object { input, outputs }`

                Code Interpreter 工具调用定义。

                - `input: string`

                  Code Interpreter 工具调用的输入。

                - `outputs: array of object { logs, type }  or object { image, type }`

                  Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。这些每种都由不同的对象类型表示。

                  - `CodeInterpreterLogOutput object { logs, type }`

                    作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

                    - `logs: string`

                      Code Interpreter 工具调用的文本输出。

                    - `type: "logs"`

                      始终 `logs`.

                      - `"logs"`

                  - `CodeInterpreterImageOutput object { image, type }`

                    - `image: object { file_id }`

                      - `file_id: string`

                        该 [文件](/docs/api-reference/files) 图像的 ID。

                    - `type: "image"`

                      始终 `image`.

                      - `"image"`

              - `type: "code_interpreter"`

                工具调用的类型。对于此类型的工具调用，始终为 `code_interpreter` 。

                - `"code_interpreter"`

            - `FileSearchToolCall object { id, file_search, type }`

              - `id: string`

                工具调用对象的 ID。

              - `file_search: object { ranking_options, results }`

                目前，这始终是一个空对象。

                - `ranking_options: optional object { ranker, score_threshold }`

                  文件搜索的排序选项。

                  - `ranker: "auto" or "default_2024_08_21"`

                    用于文件搜索的排序器。若未指定，将使用 `auto` 排序器。

                    - `"auto"`

                    - `"default_2024_08_21"`

                  - `score_threshold: number`

                    文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

                - `results: optional array of object { file_id, file_name, score, content }`

                  文件搜索的结果。

                  - `file_id: string`

                    找到结果的文件的 ID。

                  - `file_name: string`

                    找到结果的文件的名称。

                  - `score: number`

                    结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

                  - `content: optional array of object { text, type }`

                    找到的结果的内容。内容仅在通过 include 查询参数请求时包含。

                    - `text: optional string`

                      文件的文本内容。

                    - `type: optional "text"`

                      内容的类型。

                      - `"text"`

              - `type: "file_search"`

                工具调用的类型。对于此类工具调用，这始终是 `file_search` 。

                - `"file_search"`

            - `FunctionToolCall object { id, function, type }`

              - `id: string`

                工具调用对象的 ID。

              - `function: object { arguments, name, output }`

                被调用的函数的定义。

                - `arguments: string`

                  传递给函数的参数。

                - `name: string`

                  函数的名称。

                - `output: string or null`

                  函数的输出。如果输出尚未 `null` 提交，这将是 [提交](/docs/api-reference/runs/submitToolOutputs) 。

              - `type: "function"`

                工具调用的类型。对于此类工具调用，这始终是 `function` 。

                - `"function"`

          - `type: "tool_calls"`

            始终 `tool_calls`.

            - `"tool_calls"`

      - `thread_id: string`

        被运行的 [线程](/docs/api-reference/threads) 的 ID。

      - `type: "message_creation" or "tool_calls"`

        运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

        - `"message_creation"`

        - `"tool_calls"`

      - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

        与运行步骤相关的使用统计信息。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

        - `completion_tokens: number`

          运行步骤过程中使用的完成令牌数。

        - `prompt_tokens: number`

          运行步骤过程中使用的提示令牌数。

        - `total_tokens: number`

          使用的令牌总数（提示 + 完成）。

    - `event: "thread.run.step.created"`

      - `"thread.run.step.created"`

  - `ThreadRunStepInProgress object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 移动到 `in_progress` 状态时发生。

    - `data: RunStep`

      表示运行执行中的一个步骤。

    - `event: "thread.run.step.in_progress"`

      - `"thread.run.step.in_progress"`

  - `ThreadRunStepDelta object { data, event }`

    当 [运行步骤](/docs/api-reference/run-steps/step-object) 的部分内容正在流式传输时发生。

    - `data: RunStepDeltaEvent`

      表示运行步骤增量，即流式传输期间运行步骤上任何更改的字段。

      - `id: string`

        运行步骤的标识符，可在 API 端点中引用。

      - `delta: object { step_details }`

        包含运行步骤中已更改字段的增量。

        - `step_details: optional RunStepDeltaMessageDelta or ToolCallDeltaObject`

          运行步骤的详细信息。

          - `RunStepDeltaMessageDelta object { type, message_creation }`

            运行步骤创建消息的详细信息。

            - `type: "message_creation"`

              始终 `message_creation`.

              - `"message_creation"`

            - `message_creation: optional object { message_id }`

              - `message_id: optional string`

                由此运行步骤创建的消息的 ID。

          - `ToolCallDeltaObject object { type, tool_calls }`

            工具调用的详细信息。

            - `type: "tool_calls"`

              始终 `tool_calls`.

              - `"tool_calls"`

            - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

              运行步骤涉及的工具调用数组。这些调用可关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

              - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

                运行步骤涉及的代码解释器工具调用的详细信息。

                - `index: number`

                  工具调用在工具调用数组中的索引。

                - `type: "code_interpreter"`

                  工具调用的类型。对此类工具调用，此值始终为 `code_interpreter` 。

                  - `"code_interpreter"`

                - `id: optional string`

                  工具调用的 ID。

                - `code_interpreter: optional object { input, outputs }`

                  代码解释器工具调用定义。

                  - `input: optional string`

                    代码解释器工具调用的输入。

                  - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                    代码解释器工具调用的输出。代码解释器可输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每项由不同的对象类型表示。

                    - `CodeInterpreterLogs object { index, type, logs }`

                      作为运行步骤的一部分，来自代码解释器工具调用的文本输出。

                      - `index: number`

                        输出在 outputs 数组中的索引。

                      - `type: "logs"`

                        始终 `logs`.

                        - `"logs"`

                      - `logs: optional string`

                        来自代码解释器工具调用的文本输出。

                    - `CodeInterpreterOutputImage object { index, type, image }`

                      - `index: number`

                        输出在 outputs 数组中的索引。

                      - `type: "image"`

                        始终 `image`.

                        - `"image"`

                      - `image: optional object { file_id }`

                        - `file_id: optional string`

                          该 [file](/docs/api-reference/files) 图像的 ID。

              - `FileSearchToolCallDelta object { file_search, index, type, id }`

                - `file_search: unknown`

                  目前，这始终是一个空对象。

                - `index: number`

                  工具调用在工具调用数组中的索引。

                - `type: "file_search"`

                  工具调用的类型。对于此类工具调用，它始终是 `file_search` 。

                  - `"file_search"`

                - `id: optional string`

                  工具调用对象的 ID。

              - `FunctionToolCallDelta object { index, type, id, function }`

                - `index: number`

                  工具调用在工具调用数组中的索引。

                - `type: "function"`

                  工具调用的类型。对于此类工具调用，它始终是 `function` 。

                  - `"function"`

                - `id: optional string`

                  工具调用对象的 ID。

                - `function: optional object { arguments, name, output }`

                  被调用函数的定义。

                  - `arguments: optional string`

                    传递给函数的参数。

                  - `name: optional string`

                    函数的名称。

                  - `output: optional string or null`

                    函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

      - `object: "thread.run.step.delta"`

        对象类型，始终是 `thread.run.step.delta`.

        - `"thread.run.step.delta"`

    - `event: "thread.run.step.delta"`

      - `"thread.run.step.delta"`

  - `ThreadRunStepCompleted object { data, event }`

    当 [run step](/docs/api-reference/run-steps/step-object) 完成时发生。

    - `data: RunStep`

      表示运行执行中的一步。

    - `event: "thread.run.step.completed"`

      - `"thread.run.step.completed"`

  - `ThreadRunStepFailed object { data, event }`

    当 [run step](/docs/api-reference/run-steps/step-object) 失败时发生。

    - `data: RunStep`

      表示运行执行中的一步。

    - `event: "thread.run.step.failed"`

      - `"thread.run.step.failed"`

  - `ThreadRunStepCancelled object { data, event }`

    当 [run step](/docs/api-reference/run-steps/step-object) 被取消时发生。

    - `data: RunStep`

      表示运行执行中的一步。

    - `event: "thread.run.step.cancelled"`

      - `"thread.run.step.cancelled"`

  - `ThreadRunStepExpired object { data, event }`

    当 [run step](/docs/api-reference/run-steps/step-object) 过期。

    - `data: RunStep`

      表示一次运行执行中的一个步骤。

    - `event: "thread.run.step.expired"`

      - `"thread.run.step.expired"`

### 运行流事件

- `RunStreamEvent = object { data, event }  or object { data, event }  or object { data, event }  or 7 more`

  当创建新的 [run](/docs/api-reference/runs/object) 时发生。

  - `ThreadRunCreated object { data, event }`

    当创建新的 [run](/docs/api-reference/runs/object) 时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

      - `id: string`

        上的执行运行。该标识符可在 API 端点中引用。

      - `assistant_id: string`

        用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

      - `cancelled_at: number or null`

        运行被取消时的 Unix 时间戳（以秒为单位）。

      - `completed_at: number or null`

        运行完成时的 Unix 时间戳（以秒为单位）。

      - `created_at: number`

        运行创建时的 Unix 时间戳（以秒为单位）。

      - `expires_at: number or null`

        运行过期时的 Unix 时间戳（以秒为单位）。

      - `failed_at: number or null`

        运行失败时的 Unix 时间戳（以秒为单位）。

      - `incomplete_details: object { reason }  or null`

        运行不完整的原因详情。如果运行并非不完整，则为 `null` 。

        - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

          运行不完整的原因。这将指向运行过程中达到的特定令牌限制。

          - `"max_completion_tokens"`

          - `"max_prompt_tokens"`

      - `instructions: string`

        用于此运行的 [助手](/docs/api-reference/assistants) 指令。

      - `last_error: object { code, message }  or null`

        与此运行关联的最后一个错误。若无错误，则为 `null` 。

        - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

          以下之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

          - `"server_error"`

          - `"rate_limit_exceeded"`

          - `"invalid_prompt"`

        - `message: string`

          错误的人类可读描述。

      - `max_completion_tokens: number or null`

        指定在运行过程中已使用的最大完成令牌数。

      - `max_prompt_tokens: number or null`

        指定在运行过程中已使用的最大提示令牌数。

      - `metadata: Metadata or null`

        可附加到对象的16个键值对集合。这可
        用于以结构化格式存储有关对象的额外信息，
        并通过 API 或仪表板查询对象。

        键是最大长度为64个字符的字符串。值是最大长度
        为512个字符的字符串。

      - `model: string`

        用于此运行的 [助手](/docs/api-reference/assistants) 使用的模型。

      - `object: "thread.run"`

        对象类型，始终为 `thread.run`.

        - `"thread.run"`

      - `parallel_tool_calls: boolean`

        是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

      - `required_action: object { submit_tool_outputs, type }  or null`

        关于继续运行所需操作的详细信息。当 `null` 时则为空。

        - `submit_tool_outputs: object { tool_calls }`

          有关此运行继续所需的工具输出的详细信息。

          - `tool_calls: array of RequiredActionFunctionToolCall`

            相关工具调用的列表。

            - `id: string`

              工具调用的 ID。当你在使用 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此 ID。

            - `function: object { arguments, name }`

              函数定义。

              - `arguments: string`

                模型期望你传递给函数的参数。

              - `name: string`

                函数的名称。

            - `type: "function"`

              需要输出的工具调用类型。目前，这始终为 `function`.

              - `"function"`

        - `type: "submit_tool_outputs"`

          目前，这始终为 `submit_tool_outputs`.

          - `"submit_tool_outputs"`

      - `response_format: AssistantResponseFormatOption or null`

        指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

        以来的所有 GPT-3.5 Turbo 模型兼容。设置 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 架构。在 [结构化输出指南](/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

        **重要：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息指示模型自己生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到令牌限制，从而导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表明生成超过了 `max_tokens` 或对话超过了最大上下文长度。

        - `"auto"`

          `auto` 是默认值

          - `"auto"`

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            所定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。生成 JSON 响应的较旧方法。
          对于支持它的模型，建议使用 `json_schema` 。请注意，没有系统或用户消息指示
          模型不会生成 JSON
          。

          - `type: "json_object"`

            所定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化 JSON 响应。
          了解更多关于 [结构化输出](/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            结构化输出配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须为 a-z、A-Z、0-9，或包含
              下划线和短划线，最大长度为 64。

            - `description: optional string`

              响应格式用途的描述，模型使用它来
              决定如何以该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象形式描述。
              了解如何构建 JSON schema [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              是否在生成输出时启用严格 schema 遵循。
              如果设为 true，模型将始终遵循定义的精确 schema
              在 `schema` 字段中。当
              `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [结构化输出
              指南](/docs/guides/structured-outputs).

          - `type: "json_schema"`

            所定义的响应格式类型。始终 `json_schema`.

            - `"json_schema"`

      - `started_at: number or null`

        运行开始时的 Unix 时间戳（以秒为单位）。

      - `status: "queued" or "in_progress" or "requires_action" or 6 more`

        运行的状态，可以是 `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`，或 `expired`.

        - `"queued"`

        - `"in_progress"`

        - `"requires_action"`

        - `"cancelling"`

        - `"cancelled"`

        - `"failed"`

        - `"completed"`

        - `"incomplete"`

        - `"expired"`

      - `thread_id: string`

        作为此运行的一部分而执行的 [线程](/docs/api-reference/threads) 的 ID。

      - `tool_choice: AssistantToolChoiceOption or null`

        控制模型调用哪个（如果有）工具。
        `none` 表示模型不会调用任何工具，而是生成一条消息。
        `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
        `required` 表示模型必须在响应用户之前调用一个或多个工具。
        指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ，会强制模型调用该工具。

        - `"none" or "auto" or "required"`

          `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `AssistantToolChoice object { type, function }`

          指定模型应使用的工具。使用它来强制模型调用特定工具。

          - `type: "function" or "code_interpreter" or "file_search"`

            工具的类型。如果类型为 `function`，则必须设置函数名称

            - `"function"`

            - `"code_interpreter"`

            - `"file_search"`

          - `function: optional AssistantToolChoiceFunction`

            - `name: string`

              要调用的函数的名称。

      - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

        该 [助手](/docs/api-reference/assistants) 用于本次运行。

        - `CodeInterpreterTool object { type }`

          - `type: "code_interpreter"`

            正在定义的工具类型： `code_interpreter`

            - `"code_interpreter"`

        - `FileSearchTool object { type, file_search }`

          - `type: "file_search"`

            正在定义的工具类型： `file_search`

            - `"file_search"`

          - `file_search: optional object { max_num_results, ranking_options }`

            对文件搜索工具的覆盖设置。

            - `max_num_results: optional number`

              文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型默认值为20，对于 `gpt-3.5-turbo`。默认值为5。该数值应在1到50之间（含1和50）。

              请注意，文件搜索工具可能输出的结果少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

            - `ranking_options: optional object { score_threshold, ranker }`

              文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且score_threshold为0。

              请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

              - `ranker: optional "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

        - `FunctionTool object { function, type }`

          - `function: FunctionDefinition`

            - `name: string`

              要调用的函数名称。必须是a-z、A-Z、0-9，或包含下划线和短横线，最大长度为64。

            - `description: optional string`

              函数功能的描述，模型使用它来决定何时以及如何调用函数。

            - `parameters: optional FunctionParameters`

              函数接受的参数，描述为 JSON Schema 对象。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的相关文档。

              省略 `parameters` 定义了一个具有空参数列表的函数。

            - `strict: optional boolean or null`

              是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将严格遵循 `parameters` 字段中定义的确切模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

          - `type: "function"`

            正在定义的工具类型： `function`

            - `"function"`

      - `truncation_strategy: object { type, last_messages }  or null`

        控制在线程在运行前如何被截断。使用此参数来控制运行的初始上下文窗口。

        - `type: "auto" or "last_messages"`

          用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

          - `"auto"`

          - `"last_messages"`

        - `last_messages: optional number or null`

          在构建运行上下文时从线程中使用的最近消息数量。

      - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

        与此次运行相关的使用统计信息。如果运行未处于终止状态（例如 `null` ，此值将为。 `in_progress`, `queued`，等）。

        - `completion_tokens: number`

          运行过程中使用的完成 token 数量。

        - `prompt_tokens: number`

          运行过程中使用的提示 token 数量。

        - `total_tokens: number`

          使用的 token 总数（提示 + 完成）。

      - `temperature: optional number or null`

        此次运行使用的采样温度。如果未设置，默认为 1。

      - `top_p: optional number or null`

        此次运行使用的核采样值。如果未设置，默认为 1。

    - `event: "thread.run.created"`

      - `"thread.run.created"`

  - `ThreadRunQueued object { data, event }`

    当 [run](/docs/api-reference/runs/object) 移动到 `queued` 状态时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.queued"`

      - `"thread.run.queued"`

  - `ThreadRunInProgress object { data, event }`

    当 [run](/docs/api-reference/runs/object) 移动到 `in_progress` 状态时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.in_progress"`

      - `"thread.run.in_progress"`

  - `ThreadRunRequiresAction object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 转移到 `requires_action` 状态时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.requires_action"`

      - `"thread.run.requires_action"`

  - `ThreadRunCompleted object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 完成时发生。

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.completed"`

      - `"thread.run.completed"`

  - `ThreadRunIncomplete object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 以状态结束 `incomplete`.

    - `data: Run`

      表示在 [线程](/docs/api-reference/threads).

    - `event: "thread.run.incomplete"`

      - `"thread.run.incomplete"`

  - `ThreadRunFailed object { data, event }`

    当 [运行](/docs/api-reference/runs/object) 失败时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.failed"`

      - `"thread.run.failed"`

  - `ThreadRunCancelling object { data, event }`

    当 [run](/docs/api-reference/runs/object) 进入 `cancelling` 状态时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelling"`

      - `"thread.run.cancelling"`

  - `ThreadRunCancelled object { data, event }`

    当 [run](/docs/api-reference/runs/object) 被取消时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.cancelled"`

      - `"thread.run.cancelled"`

  - `ThreadRunExpired object { data, event }`

    当 [run](/docs/api-reference/runs/object) 过期时发生。

    - `data: Run`

      表示在 [thread](/docs/api-reference/threads).

    - `event: "thread.run.expired"`

      - `"thread.run.expired"`

### 线程流事件

- `ThreadStreamEvent object { data, event, enabled }`

  当新建 [线程](/docs/api-reference/threads/object) 时发生。

  - `data: Thread`

    表示包含 [消息](/docs/api-reference/messages).

    - `id: string`

      的线程标识符，可在API端点中引用。

    - `created_at: number`

      线程创建时的 Unix 时间戳（秒）。

    - `metadata: Metadata or null`

      可附加到对象的 16 个键值对集合。这可以
      用于以结构化格式存储有关对象的额外信息，
      并通过API或仪表盘查询对象。

      键是字符串，最大长度为 64 个字符。值是字符串，
      最大长度为 512 个字符。

    - `object: "thread"`

      对象类型，始终为 `thread`.

      - `"thread"`

    - `tool_resources: object { code_interpreter, file_search }  or null`

      一组资源，提供给该线程中助手工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

      - `code_interpreter: optional object { file_ids }`

        - `file_ids: optional array of string`

          提供给 [文件](/docs/api-reference/files) 工具的 ID 列表。 `code_interpreter` 工具最多可关联 20 个文件。

      - `file_search: optional object { vector_store_ids }`

        - `vector_store_ids: optional array of string`

          该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。一个线程最多可以附加 1 个 vector store。

  - `event: "thread.created"`

    - `"thread.created"`

  - `enabled: optional boolean`

    是否启用输入音频转录。
