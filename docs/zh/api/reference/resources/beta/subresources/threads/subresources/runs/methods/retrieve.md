> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过附加 `.md` 到页面 URL 来获取。

## 检索运行

**get** `/threads/{thread_id}/runs/{run_id}`

检索一个运行。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [线程](/docs/api-reference/threads).

  - `id: string`

    上的执行运行。API端点中可引用的标识符。

  - `assistant_id: string`

    用于执行此运行的 [助手](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行创建时的 Unix 时间戳（秒）。

  - `expires_at: number or null`

    运行过期时的 Unix 时间戳（秒）。

  - `failed_at: number or null`

    运行失败时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    运行不完整的原因详情。若运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指明在运行过程中达到了哪个具体的令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。若无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

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

    一组16个可附加到对象的键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过API或仪表板查询对象。

    键是最大长度为64个字符的字符串。值是
    最大长度为512个字符的字符串。

  - `model: string`

    用于本次运行的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果无需操作，将为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      继续此运行所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。在通过以下方式提交工具输出时，必须引用此 ID [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          输出所需的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及所有 GPT-3.5 Turbo 模型，自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 模式。更多信息请参见 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还应通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到令牌限制，导致长时间运行且看似“卡住”的请求。另请注意，消息内容可能会被部分截断，如果 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

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
      对于支持它的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示时不生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须是 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象形式描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循精确定义的架构
          字段中 `schema` 定义的架构。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    运行开始时的 Unix 时间戳（秒）。

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

    此运行中执行的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪些工具（如果有）。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。
    指定特定工具，例如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ，强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。

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

    此运行中 [助手](/docs/api-reference/assistants) 使用的工具列表。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50（含）之间。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 个。有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用默认排序器和 `auto` score_threshold 为 0。

          有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用默认 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于决定何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 以了解该格式的文档。

          省略 `parameters` 定义了一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        所定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制运行前线程将被如何截断。使用此选项来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近 n 条消息。当设置为 `auto`，时，位于线程中间位置的消息将被丢弃，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      构建运行上下文时从线程中使用的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行未处于终止状态（即 `null` ， `in_progress`, `queued`，等），此值将为。）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行的采样温度。若未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。若未设置，默认为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID \
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
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699075072,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "completed",
  "started_at": 1699075072,
  "expires_at": null,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": 1699075073,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "incomplete_details": null,
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "metadata": {},
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  },
  "temperature": 1.0,
  "top_p": 1.0,
  "max_prompt_tokens": 1000,
  "max_completion_tokens": 1000,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
```
