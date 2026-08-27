> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt). 各文档页面的 Markdown 版本可通过在网址末尾追加 `.md` 获得。

## 检索助手

**get** `/assistants/{assistant_id}`

检索一个助手。

### 路径参数

- `assistant_id: string`

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

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    要使用的模型 ID。你可以使用 [List models](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [Model overview](/docs/models) 了解模型的描述。

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

          文件搜索工具应输出的最大结果数。默认值为20，适用于 `gpt-4*` 模型和5，适用于 `gpt-3.5-turbo`。此数字应介于1和50之间（含边界值）。

          请注意，文件搜索工具可能输出少于 `max_num_results` 结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，并将score_threshold设置为0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

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

          函数功能的描述，模型将根据此描述决定何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取关于该格式的文档。

          省略 `parameters` 定义了一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵守。如果设置为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        要定义的工具类型： `function`

        - `"function"`

  - `response_format: optional AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及所有自 `gpt-3.5-turbo-1106`.

    以来 `{ "type": "json_schema", "json_schema": {...} }` 的 GPT-3.5 Turbo 模型。设置为 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空白字符，直到达到令牌限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，表示生成结果超出 `max_tokens` 或对话超出最大上下文长度，消息内容可能会被部分截断。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      对于支持该格式的模型，建议使用 `json_schema` 。请注意，没有指示其生成 JSON 的系统或用户消息时，
      模型将不会生成 JSON
      。

      - `type: "json_object"`

        所定义响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          关于响应格式用途的描述，模型会据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象形式描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格架构遵循。
          若设为 true，模型将始终遵循定义的精确架构，
          见 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `temperature: optional number or null`

    使用什么采样温度，范围在 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使输出更集中和确定。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组由助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [文件](/docs/api-reference/files) ID 列表，可供 `code_interpreter`` 工具使用。最多可有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，附加到此助手。最多可有 1 个向量存储附加到该助手。

  - `top_p: optional number or null`

    一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的令牌结果。因此，0.1 表示仅考虑组成前 10% 概率质量的令牌。

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
