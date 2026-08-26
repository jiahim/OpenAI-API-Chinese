> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## 创建助手

**post** `/assistants`

使用模型和指令创建智能体。

### 请求体参数

- `model: string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API查看你所有可用的模型，或查看我们的 [模型概览](/docs/models) 以获取它们的描述。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API查看你所有可用的模型，或查看我们的 [模型概览](/docs/models) 以获取它们的描述。

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

  助手的描述。最大长度为 512 个字符。

- `instructions: optional string or null`

  助手使用的系统指令。最大长度为 256,000 个字符。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 个键值对的集。这可以
  用于以结构化格式存储关于对象的额外信息，
  并可通过 API或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `name: optional string or null`

  助手的名称。最大长度为 256 个字符。

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入。目前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，且 `max`.
  降低推理努力可以加快响应速度并减少响应中用于推理的令牌数
  。并非所有推理模型都支持每一个
  值。参见
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  了解模型支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。了解更多请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要提示：** 使用 JSON 模式时，你 **必须** 还通过系统或用户消息指示模型自己生成 JSON。否则，模型可能生成无休止的空白字符，直到达到令牌限制，导致长时间运行且看似“卡住”的请求。另请注意，如果 `finish_reason="length"`，则消息内容可能被部分截断，这表示生成超过了 `max_tokens` 或对话超出了最大上下文长度。

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
    使用 `json_schema` 推荐用于支持它的模型。请注意，
    模型在没有系统或用户消息指示它的情况下不会生成 JSON
    这样做。

    - `type: "json_object"`

      所定义的响应格式类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短划线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型使用它来
        决定如何以该格式响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象描述。
        了解如何构建 JSON 架构 [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循定义的精确模式，
        如 `schema` 字段中所定义。当设置
        `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终 `json_schema`.

      - `"json_schema"`

- `temperature: optional number or null`

  使用什么采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加集中和确定。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组由助手的工具使用的资源。这些资源特定于工具的类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      文件 [文件](/docs/api-reference/files) ID 列表，可供 `code_interpreter` 工具使用。与该工具关联的文件最多可以有 20 个。

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此助手的向量存储。最多可有 1 个向量存储附加到该助手。

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      一个创建 [向量存储](/docs/api-reference/vector-stores/object) 并使用 file_ids 将其附加到此助手的辅助工具。最多可有 1 个向量存储附加到该助手。

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

              块之间重叠的 token 数量。默认值为 `400`.

              请注意，重叠部分不得超过 `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

          - `type: "static"`

            始终 `static`.

            - `"static"`

      - `file_ids: optional array of string`

        要添加到向量存储的 [文件](/docs/api-reference/files) ID 列表。对于 2025 年 11 月之前创建的向量存储，一个向量存储中最多可有 10,000 个文件。对于自 2025 年 11 月起创建的向量存储，上限为 100,000,000 个文件。

      - `metadata: optional Metadata or null`

        一组 16 个键值对，可附加到对象上。这样可以
        以结构化格式存储有关对象的额外信息，
        并通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串
        ，最大长度为 512 个字符。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

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

      针对 文件搜索 工具的覆盖设置。

      - `max_num_results: optional number`

        文件搜索 工具应输出的最大结果数。对于 `gpt-4*` 模型默认值为 20，对于 `gpt-3.5-turbo`。默认值为 5。此数字应在 1 到 50 之间（含 1 和 50）。

        请注意，文件搜索 工具输出的结果可能少于 `max_num_results` 个。请参阅 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器，且 score_threshold 为 0。

        请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          文件搜索使用的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须是 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，模型使用它来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

        省略 `parameters` 定义了一个具有空参数列表的函数。

      - `strict: optional boolean or null`

        生成函数调用时是否启用严格的模式遵循。如果设置为 true，模型将严格按照 `parameters` 字段中定义的模式执行。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。更多关于结构化输出的信息，请参见 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样，模型会考虑具有 top_p 概率质量的 token 的结果。因此，0.1 意味着仅考虑构成前 10% 概率质量的 token。

  我们通常建议修改此参数或温度，但不要同时修改两者。

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` 可以调用模型并使用工具。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建助手时的 Unix 时间戳（秒）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储有关对象的附加信息，
    以及通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [Model overview](/docs/models) 了解它们的描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手启用的工具列表。每个助手最多可有 128 个工具。工具类型可以是 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。默认值为20， `gpt-4*` 模型为5， `gpt-3.5-turbo`。此数字应在1到50之间（含边界）。

          请注意，文件搜索工具可能输出少于 `max_num_results` 结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，score_threshold为0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            文件搜索要使用的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为a-z、A-Z、0-9，或包含下划线和破折号，最大长度为64。

        - `description: optional string`

          函数功能的描述，模型用来选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

          省略 `parameters` 会定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式遵循模式。如果设为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来的所有 GPT-3.5 Turbo 模型兼容。启用 Structured Outputs 可确保模型匹配你提供的 JSON 模式。更多信息请参阅 [Structured Outputs 指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息指示模型自行生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到 token 限制，导致长时间运行且看似“卡住”的请求。另请注意，如果消息内容可能被部分截断 `finish_reason="length"`，这表明生成的 `max_tokens` 超出，或对话超出了最大上下文长度。

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
      模型在没有系统或用户消息指示时不会生成 JSON
      。

      - `type: "json_object"`

        所定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，供模型用于
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 Schema，以 JSON Schema 对象形式描述。
          了解如何构建 JSON Schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 Schema 遵循。
          若设为 true，模型将始终遵循定义的精确 Schema
          在 `schema` 字段中。仅支持 JSON Schema 的一个子集，当
          `strict` 为 `true`。时。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，介于 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使其更集中和确定性更强。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组由助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [文件](/docs/api-reference/files) ID 列表，可供 `code_interpreter`` 工具使用。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此智能体的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到智能体的向量存储最多可有 1 个。

  - `top_p: optional number or null`

    一种替代使用 temperature 采样的方法，称为核采样，模型会考虑具有 top_p 概率质量的标记结果。因此，0.1 表示仅考虑占据前 10% 概率质量的标记。

    我们通常建议修改此参数或 temperature，但不要同时修改两者。

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
