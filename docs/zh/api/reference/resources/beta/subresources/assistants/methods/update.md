> 有关完整文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 修改助手

**post** `/assistants/{assistant_id}`

修改一个智能体。

### 路径参数

- `assistant_id: string`

### 请求体参数

- `description: optional string or null`

  智能体的描述。最大长度为 512 个字符。

- `instructions: optional string or null`

  智能体使用的系统指令。最大长度为 256,000 个字符。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 个键值对集合。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表盘查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用的模型，或查看我们的 [模型概述](/docs/models) 了解它们的描述。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用的模型，或查看我们的 [模型概述](/docs/models) 了解它们的描述。

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

  智能体的名称。最大长度为 256 个字符。

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入。目前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  降低推理力度可以带来更快的响应和更少的令牌
  用于响应中的推理。并非所有推理模型都支持每个
  值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  以了解特定于模型的支持。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 架构。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息自行指示模型生成 JSON。如果不这样做，模型可能会生成无休止的空格流，直到生成达到令牌限制，导致长时间运行且看似“卡住”的请求。还要注意，如果 `finish_reason="length"`，这表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

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
    使用 `json_schema` 建议用于支持它的模型。请注意，
    模型不会在没有系统或用户消息指示它的情况下生成 JSON
    。

    - `type: "json_object"`

      所定义的响应格式的类型。始终为 `json_object`.

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

        响应格式用途的描述，模型会用它来
        决定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象形式描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的 schema 遵循。
        如果设置为 true，模型将始终遵循定义的精确 schema
        位于 `schema` 字段中。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终 `json_schema`.

      - `"json_schema"`

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使其更集中和确定。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组由助手的工具使用的资源。这些资源特定于工具的类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      覆盖可用于 [文件的](/docs/api-reference/files) ID 列表 `code_interpreter` 工具。最多可有 20 个文件与该工具关联。

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      覆盖 [向量存储](/docs/api-reference/vector-stores/object) 附加到此助手。最多可有 1 个向量存储附加到助手。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool`

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

        文件搜索工具应输出的最大结果数。默认值为 20（针对 `gpt-4*` 模型）和 5（针对 `gpt-3.5-turbo`。此数字应在 1 到 50（含）之间。

        请注意，文件搜索工具可能输出少于 `max_num_results` 个结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

        请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          文件搜索使用的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数的用途描述，模型用它来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象的形式描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。省略。

        省略 `parameters` 定义了一个带空参数列表的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设为 true，模型将遵循 `parameters` 字段中定义的确切模式。当 `strict` 为 `true`. 时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      要定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  采样温度的一种替代方案，称为核采样，模型会考虑具有 top_p 概率质量的标记结果。因此 0.1 意味着只考虑构成前 10% 概率质量的标记。

  我们通常建议修改此参数或温度，但不要同时修改两者。

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，可以调用模型并使用工具。

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
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型的 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [Model overview](/docs/models) 以了解它们的描述。

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

          文件搜索工具应输出的最大结果数。默认值为 20，适用于 `gpt-4*` 模型，以及 5，适用于 `gpt-3.5-turbo`。此数值应在 1 到 50 之间（含边界）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 个。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器以及 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和破折号，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用该函数时使用。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 将定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以遵循模式。如果设为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工�具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。在 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。如果没有这样做，模型可能会生成无休止的空白字符，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，消息内容可能会被部分截断，如果 `finish_reason="length"`，这表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

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
      使用 `json_schema` 对于支持该格式的模型是推荐做法。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON，
      必须明确指示它这样做。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须是 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型用它来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象形式描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设为 true，模型将始终遵循明确定义的精确 schema
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    要使用的采样温度，介于 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使其更集中和确定。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    助手工具使用的一组资源。这些资源是特定于工具类型的。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` tool 需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [文件](/docs/api-reference/files) `code_interpreter`` 工具使用的 ID 列表。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此智能体的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到智能体的向量存储最多可有 1 个。

  - `top_p: optional number or null`

    一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的 token 结果。因此 0.1 意味着仅考虑构成前 10% 概率质量的 token。

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
