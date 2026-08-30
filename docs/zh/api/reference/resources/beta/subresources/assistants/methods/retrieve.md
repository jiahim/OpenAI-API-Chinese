> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

## 检索助手

**get** `/assistants/{assistant_id}`

检索一个助手。

### 路径参数

- `assistant_id: string`

### 返回

- `Assistant object { id, created_at, description, 10 more }`

  表示一个 `assistant` ，可以调用模型并使用工具。

  - `id: string`

    标识符，可以在 API 端点中引用。

  - `created_at: number`

    助理创建时的 Unix 时间戳（以秒为单位）。

  - `description: string or null`

    助理的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助理使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概述](/docs/models) 了解相关描述。

  - `name: string or null`

    助理的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助理上启用的工具列表。每个助理最多可以启用 128 个工具。工具可以是以下类型 `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索 工具的覆盖项。

        - `max_num_results: optional number`

          文件搜索 工具应输出的最大结果数。 `gpt-4*` 模型默认为 20， `gpt-3.5-turbo`。默认为 5。该数值应介于 1 到 50 之间（含端点）。

          请注意，文件搜索 工具可能输出的结果数少于 `max_num_results` 个结果。参见 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器，并将 score_threshold 设为 0。

          参见 [文件搜索 工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索 的分数阈值。所有取值必须是介于 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            文件搜索 使用的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和连字符，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 文档中关于格式的说明。

          省略 `parameters` 用于定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以遵循模式定义。如果设为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。 `strict` 为 `true`。时，可支持的 JSON Schema 子集详情请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置参数为 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型输出与你提供的 JSON schema 完全匹配。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置参数为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是合法 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 也可以通过系统或用户消息自行指示模型输出 JSON。否则，模型可能会生成无止境的空白字符，直到生成达到 token 限制，从而导致请求长时间运行并看似“卡住”。另请注意，如果 `finish_reason="length"`，则表示生成超出 `max_tokens` 或对话超出最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      使用 `json_schema` 推荐用于支持它的模型。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      来这样做。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      详细了解 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          对响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象形式描述。
          了解如何构建 JSON schema [请参阅此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设置为 true，模型将始终遵循所定义的确切 schema
          ，如需进一步了解，请阅读 `schema` 字段中定义的精确模式。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。
          `strict` 为 `true`。要了解更多信息，请参阅 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，取值范围为 0 到 2。较高的值（例如 0.8）会使输出更加随机，而较低的值（例如 0.2）会使输出更加集中和确定。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    助手工具所使用的一组资源。这些资源因工具类型而异。例如， `code_interpreter` 工具需要一个 file ID 列表，而 `file_search` 工具需要一个 vector store ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [file](/docs/api-reference/files) ID 列表，这些 ID 可供 `code_interpreter`` 工具使用。每个工具最多可以关联 20 个文件。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        与此助手关联的 [vector store](/docs/api-reference/vector-stores/object) 的 ID。每个助手最多可以关联 1 个 vector store。

  - `top_p: optional number or null`

    一种替代温度采样的方法，称为核采样（nucleus sampling），模型只考虑概率质量排名前 top_p 的 token。例如 0.1 表示仅考虑概率质量排名前 10% 的 token。

    我们通常建议调整此参数或 temperature，但不要同时调整两者。

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
