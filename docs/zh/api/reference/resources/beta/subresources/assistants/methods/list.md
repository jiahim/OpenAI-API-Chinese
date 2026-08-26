> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出智能体

**get** `/assistants`

返回助手列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，那么你随后的调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，那么你随后的调用可以包含 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  返回对象数量的限制。限制范围可以在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Assistant`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    创建助手时的 Unix 时间戳（以秒为单位）。

  - `description: string or null`

    助手的描述。最大长度为 512 个字符。

  - `instructions: string or null`

    助手使用的系统指令。最大长度为 256,000 个字符。

  - `metadata: Metadata or null`

    可附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储有关对象的额外信息，
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

    助手启用的工具列表。每个助手最多可有 128 个工具。工具类型可为 `code_interpreter`, `file_search`，或 `function`.

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

          文件搜索工具应输出的最大结果数。默认值为20， `gpt-4*` 模型为5， `gpt-3.5-turbo`。此数字应在1到50之间（含）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且score_threshold为0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

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

          函数接受的参数，以JSON Schema对象形式描述。请参阅 [指南](/docs/guides/function-calling) 有关示例，请参阅 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的文档。

          省略 `parameters` 定义了一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以遵循 Schema。如果设为 true，模型将遵循 `parameters` 字段中定义的确切 Schema。仅支持 JSON Schema 的子集，当 `strict` 为 `true`。时。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    以来的所有 GPT-3.5 Turbo 模型。设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON Schema。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 Token 限制，导致请求长时间运行并看似“卡住”。另请注意，如果消息内容可能被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

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
      对于支持它的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON
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

          响应格式的名称。必须为 a-z、A-Z、0-9 或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，描述为 JSON Schema 对象。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格架构遵循。
          如果设为 true，模型将始终遵循
          字段中定义的 `schema` 精确架构。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。如需了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式类型。始终为 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加集中和确定性。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    助手工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [file](/docs/api-reference/files) 提供给 `code_interpreter`` 工具的 ID。最多可以有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此助手的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。最多可以有 1 个向量存储附加到该助手。

  - `top_p: optional number or null`

    温度采样的替代方法，称为核采样，模型考虑具有 top_p 概率质量的令牌结果。因此 0.1 意味着只考虑构成前 10% 概率质量的令牌。

    我们通常建议更改此参数或温度，但不要同时更改两者。

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
