> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 列出 assistants

**get** `/assistants`

返回智能体列表。

### 查询参数

- `after: optional string`

  用于分页游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结束，那么你后续的调用可以包含 after=obj_foo，以便获取列表的下一页。

- `before: optional string`

  用于分页游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你后续的调用可以包含 before=obj_foo，以便获取列表的上一页。

- `limit: optional number`

  返回对象数量的上限。范围介于 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回值

- `data: array of Assistant`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    助手创建时的 Unix 时间戳（以秒为单位）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以调用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或参阅我们的 [模型概述](/docs/models) 了解相关描述。

  - `name: string or null`

    助手的名称。最大长度为 256 个字符。

  - `object: "assistant"`

    对象类型，始终为 `assistant`.

    - `"assistant"`

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    助手上启用的工具列表。每个助手最多可启用 128 个工具。工具可以是以下类型： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        所定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        所定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索 工具的覆盖项。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数量。对于 `gpt-4*` 模型，默认值为 20，对于 `gpt-3.5-turbo`。模型，默认值为 5。该值应介于 1 到 50 之间（含两端）。

          注意，文件搜索工具实际输出的结果数可能少于 `max_num_results` 个结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，并将 score_threshold 设为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短横线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型用于判断何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 中有关格式的文档。

          省略 `parameters` 定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的 schema 遵从。如果设置为 true，模型将遵循在 `parameters` 字段中定义的确切 schema。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。在 [function calling guide](/docs/guides/function-calling).

      - `type: "function"`

        所定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用 Structured Outputs，确保模型匹配你提供的 JSON schema。在 [Structured Outputs guide](/docs/guides/structured-outputs).

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_object" }` 启用 JSON 模式，这能确保模型生成的消息是合法的 JSON。

    **Important:** 使用 JSON 模式时，你 **必须** 还要自行通过系统消息或用户消息指示模型生成 JSON。否则，模型可能会生成无尽的空白流，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，如果 `finish_reason="length"`，则表明生成超过了 `max_tokens` 或者对话超出了最大上下文长度。

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
      使用 `json_schema` 推荐支持它的模型。请注意，该
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      这样做。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，由模型用于
          决定如何按该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象形式描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的模式遵循。
          如果设置为 true，模型将始终遵循所定义的确切模式
          中的 `schema` 字段中定义的确切 schema。当
          `strict` 为 `true`。要了解更多信息，请参阅 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使其更专注和确定性更强。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    由助手工具使用的一组资源。这些资源特定于工具的类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [文件](/docs/api-reference/files) 提供给 `code_interpreter`` 工具使用的 ID 列表。每个工具最多可以关联 20 个文件。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。每个助手最多可以附加 1 个向量存储。

  - `top_p: optional number or null`

    一种替代采样的温度采样方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。因此 0.1 表示仅考虑组成前 10% 概率质量的标记。

    我们通常建议更改此项或 temperature，但不要同时更改两者。

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

#### Response

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

#### Response

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
