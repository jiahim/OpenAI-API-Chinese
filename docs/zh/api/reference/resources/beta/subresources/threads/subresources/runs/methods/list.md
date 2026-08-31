> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 列出运行

**get** `/threads/{thread_id}/runs`

返回属于该线程的运行列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页游标。 `after` 是一个对象 ID，用于标识你在列表中所处的位置。例如，如果你发起一次列表请求并收到 100 个对象，最后一个对象为 obj_foo，那么下一次调用可以传入 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页游标。 `before` 是一个对象 ID，用于标识你在列表中所处的位置。例如，如果你发起一次列表请求并收到 100 个对象，开头的对象为 obj_foo，那么下一次调用可以传入 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  返回对象的数量上限。Limit 范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Run`

  - `id: string`

    该标识符，可在API端点中引用。

  - `assistant_id: string`

    用于执行本次运行的 [助手](/docs/api-reference/assistants) 的 ID。

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

    运行未完成的原因的详细信息。如果运行未处于未完成状态，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行未完成的原因。这将指明在运行过程中达到了哪个特定的 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于本次运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与本次运行关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下值之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      易于理解的错误描述。

  - `max_completion_tokens: number or null`

    在本次运行过程中已使用的最大完成 token 数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定已使用的提示词 token 的最大数量。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `model: string`

    所使用的模型 [助手](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需执行操作的详细信息。如果无需 `null` 任何操作，则为 null。

    - `submit_tool_outputs: object { tool_calls }`

      继续此运行所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。在使用 [Submit tool outputs to run](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型希望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          输出所必需的工具调用类型。目前该值始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前该值始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自以下时间起的所有 GPT-3.5 Turbo 模型： `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用 Structured Outputs（结构化输出），确保模型与你提供的 JSON schema 一致。更多信息请参阅 [Structured Outputs 指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还应通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会持续生成空白字符，直到生成达到 token 上限，导致请求长时间看似“卡住”。还需注意，如果出现 `finish_reason="length"`，则表示生成超出了 `max_tokens` ，或对话超出了最大上下文长度。

    - `"auto"`

      `auto` 为默认值。

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
      来生成 JSON。

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
          下划线和连字符，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循中定义的
          确切架构。 `schema` 字段。仅支持 JSON Schema 的一个子集，当
          `strict` 是 `true`。如需了解更多信息，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    运行启动时的 Unix 时间戳（以秒为单位）。

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

    用于执行本次运行的 [thread](/docs/api-reference/threads) 作为本次运行的一部分所执行的。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个工具（如果有的话）。
    `none` 表示模型将不调用任何工具，而是直接生成消息。
    `auto` 是默认值，表示模型可以在生成消息和调用一个或多个工具之间进行选择。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定一个特定的工具，例如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型将不调用任何工具，而是直接生成消息。 `auto` 表示模型可以在生成消息和调用一个或多个工具之间进行选择。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。用于强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果 type 是 `function`，则必须设置 function name

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    由 [助手](/docs/api-reference/assistants) 的指令。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        文件搜索工具的覆盖参数。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于模型，默认值为 20， `gpt-4*` 为 5。 `gpt-3.5-turbo`。该数值应介于 1 到 50 之间（含两端）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 个结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器和 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            文件搜索要使用的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，使用 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 文档格式说明。

          省略 `parameters` 定义一个空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段。仅支持 JSON Schema 的一个子集，当 `strict` 是 `true`。中定义的精确模式。详细了解结构化输出，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行开始之前对线程进行截断的方式。可用它来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      线程所使用的截断策略。默认为 `auto`。如果设置为 `last_messages`,，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`, 时，位于线程中间的消息将被丢弃，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在为运行构建上下文时，来自线程的最新消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与该运行相关的使用统计信息。如果运行未处于终止状态（例如 `null` ），则此值为。 `in_progress`, `queued`，等。

    - `completion_tokens: number`

      运行过程中已使用的输出 token 数量。

    - `prompt_tokens: number`

      运行过程中已使用的输入 token 数量。

    - `total_tokens: number`

      已使用的 token 总数（输入 + 输出）。

  - `temperature: optional number or null`

    本次运行所使用的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行所使用的核采样值。如果未设置，默认为 1。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
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
  ],
  "first_id": "run_abc123",
  "has_more": false,
  "last_id": "run_abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "object": "list",
  "data": [
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
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "file-abc123",
            "file-abc456"
          ]
        }
      },
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
    },
    {
      "id": "run_abc456",
      "object": "thread.run",
      "created_at": 1699063290,
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "status": "completed",
      "started_at": 1699063290,
      "expires_at": null,
      "cancelled_at": null,
      "failed_at": null,
      "completed_at": 1699063291,
      "last_error": null,
      "model": "gpt-4o",
      "instructions": null,
      "incomplete_details": null,
      "tools": [
        {
          "type": "code_interpreter"
        }
      ],
      "tool_resources": {
        "code_interpreter": {
          "file_ids": [
            "file-abc123",
            "file-abc456"
          ]
        }
      },
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
  ],
  "first_id": "run_abc123",
  "last_id": "run_abc456",
  "has_more": false
}
```
