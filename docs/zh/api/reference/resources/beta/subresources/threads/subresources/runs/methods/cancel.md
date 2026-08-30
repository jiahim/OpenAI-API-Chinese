> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

## 取消运行

**post** `/threads/{thread_id}/runs/{run_id}/cancel`

取消正在进行的 run `in_progress`.

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回值

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在线程上的执行运行 [thread](/docs/api-reference/threads).

  - `id: string`

    该标识符可以在 API 端点中引用。

  - `assistant_id: string`

    用于执行本次运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    关于运行未完成的详细原因。如果运行未完成，将返回 `null` ；否则为 null。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行未完成的原因。这将指明在本次运行过程中达到了哪个具体的令牌上限。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    本次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与本次运行关联的最后一个错误。如果没有错误，将返回 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在本次运行过程中已使用的最大 completion token 数。

  - `max_prompt_tokens: number or null`

    在本次运行过程中已使用的最大 prompt token 数。

  - `metadata: Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板
    查询对象。

    键为字符串，最大长度为 64 个字符；值为字符串，
    最大长度为 512 个字符。

  - `model: string`

    所使用的模型。 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 功能以在工具使用过程中生效。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续本次运行所需执行操作的详细信息。如果无需操作，将为 `null` 空。

    - `submit_tool_outputs: object { tool_calls }`

      本次运行继续所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。在使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          输出所必需的工具调用类型。目前，该值始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，该值始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自该日起的所有 GPT-3.5 Turbo 模型 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型与你提供的 JSON schema 匹配。了解更多，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能持续生成空白字符直至达到 token 上限，导致请求长时间运行且看似“卡住”。另请注意，如果出现 `finish_reason="length"`，则表示生成已超出 `max_tokens` 或对话超出了最大上下文长度。

    - `"auto"`

      `auto` 为默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      使用 `json_schema` 建议用于支持它的模型。请注意
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      来执行此操作。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      详细了解 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9,或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          对响应格式用途的描述,由模型使用以
          确定如何按该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设置为 true，模型将始终遵循所定义的确切 schema
          在 `schema` 字段中。当使用
          `strict` 时 `true`。时，仅支持 JSON Schema 的一个子集。了解更多，请参阅 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    运行启动时的 Unix 时间戳（以秒为单位）。

  - `status: "queued" or "in_progress" or "requires_action" or 6 more`

    运行的状态，可能为 `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`，或 `expired`.

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

    用于执行本次运行的 [thread](/docs/api-reference/threads) 作为本次运行一部分所执行的。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪些工具（若有）。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以在生成消息或调用一个或多个工具之间选择。
    `required` 表示模型在回复用户之前必须调用一个或多个工具。
    指定某个特定工具，例如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间选择。 `required` 表示模型在回复用户之前必须调用一个或多个工具。

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

    工具的列表，这些工具是 [assistant](/docs/api-reference/assistants) 的指令。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具的类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具的类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索工具的覆盖项。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型默认为 20，对于 `gpt-3.5-turbo`。模型默认为 5。该数值应在 1 到 50 之间（含两端）。

          请注意，文件搜索工具实际输出的结果数可能少于 `max_num_results` 指定的结果数。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，并将 score_threshold 设为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            文件搜索使用的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数的名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短横线，最大长度为 64。

        - `description: optional string`

          对函数功能的描述，供模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，可查阅该格式的文档。

          省略 `parameters` 定义了一个空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将严格按照 `parameters` 字段中。当使用 `strict` 时 `true`。中定义的模式执行。详细了解结构化输出，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具的类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行开始前如何截断线程。使用此参数可控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于该线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为该线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在为运行构建上下文时，使用的线程中最近的消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与本次运行相关的使用统计信息。如果运行未处于终止状态（即 `null` ），该值将为。 `in_progress`, `queued`，等。

    - `completion_tokens: number`

      本次运行过程中使用的补全 token 数量。

    - `prompt_tokens: number`

      本次运行过程中使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行所使用的 nucleus 采样值。如果未设置，则默认为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/cancel \
    -X POST \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "cancelled_at": 0,
  "completed_at": 0,
  "created_at": 0,
  "expires_at": 0,
  "failed_at": 0,
  "incomplete_details": {
    "reason": "max_completion_tokens"
  },
  "instructions": "instructions",
  "last_error": {
    "code": "server_error",
    "message": "message"
  },
  "max_completion_tokens": 256,
  "max_prompt_tokens": 256,
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "object": "thread.run",
  "parallel_tool_calls": true,
  "required_action": {
    "submit_tool_outputs": {
      "tool_calls": [
        {
          "id": "id",
          "function": {
            "arguments": "arguments",
            "name": "name"
          },
          "type": "function"
        }
      ]
    },
    "type": "submit_tool_outputs"
  },
  "response_format": "auto",
  "started_at": 0,
  "status": "queued",
  "thread_id": "thread_id",
  "tool_choice": "none",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "truncation_strategy": {
    "type": "auto",
    "last_messages": 1
  },
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0
  },
  "temperature": 0,
  "top_p": 0
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST
```

#### 响应

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699076126,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "cancelling",
  "started_at": 1699076126,
  "expires_at": 1699076726,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": "You summarize books.",
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
  "usage": null,
  "temperature": 1.0,
  "top_p": 1.0,
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
```
