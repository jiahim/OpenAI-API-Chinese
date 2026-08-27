> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

## 列出运行

**get** `/threads/{thread_id}/runs`

返回属于某个线程的运行列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，则你后续的调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，则你后续的调用可以包含 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  要返回的对象数量限制。限制范围可在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Run`

  - `id: string`

    该标识符，可在 API 端点中引用。

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

    关于运行不完整原因的详细信息。如果 `null` 运行并非不完整，则为。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这指出了在运行过程中达到了哪个具体的令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    该 [assistant](/docs/api-reference/assistants) 用于此运行的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的可读描述。

  - `max_completion_tokens: number or null`

    在整个运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在整个运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    一组16个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的附加信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串
    ，最大长度为512个字符。

  - `model: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。将 `null` 如果无需操作，则为空。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的ID。使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点。

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

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用了结构化输出，确保模型将匹配你提供的 JSON schema。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无尽的空白字符，直到生成达到 token 限制，导致长时间运行且看似“卡住”的请求。另外请注意，如果 `finish_reason="length"`，则表示生成超过了 `max_tokens` 或对话超出了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式的类型。始终 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      对于支持 `json_schema` 的模型，建议使用。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON，
      也不会这样做。

      - `type: "json_object"`

        所定义的响应格式的类型。始终 `json_object`.

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

          响应格式用途的描述，模型用它来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schemas [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的模式遵循。
          如果设为 true，模型将始终遵循
          字段中 `schema` 定义的精确模式。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终 `json_schema`.

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

    作为本次运行的一部分执行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型是否调用（以及调用哪些）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定像 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 这样的特定工具会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 意味着模型不会调用任何工具，而是生成一条消息。 `auto` 意味着模型可以选择生成消息或调用一个或多个工具。 `required` 意味着模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。用于强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型是 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    用于此运行的 [assistant](/docs/api-reference/assistants) 所用的工具列表。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        覆盖文件搜索工具的设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型默认值为 20，对于 `gpt-3.5-turbo`。模型默认值为 5。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` results. 请参阅 [文件搜索 tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索 的排序选项。如果未指定，文件搜索 工具将使用 `auto` 排序器，并且 score_threshold 为 0。

          请参阅 [文件搜索 tool documentation](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

          - `score_threshold: number`

            文件搜索 的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须是 a-z、A-Z、0-9 或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型使用它来选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，描述为 JSON Schema 对象。请参阅 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关格式的文档。

          省略 `parameters` 定义了一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格 schema 遵守。如果设为 true，模型将遵循中定义的精确 schema `parameters` 字段。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程运行前如何截断线程。使用此选项来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认为 `auto`。如果设为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设为 `auto`，时，线程中间的消息将被丢弃以适应该模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      构建运行上下文时，线程中最近消息的数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行未处于终止状态（即 `null` 此值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成 token 数量。

    - `prompt_tokens: number`

      运行过程中使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数（提示 + 完成）。

  - `temperature: optional number or null`

    此运行使用的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    此运行使用的核采样值。如果未设置，默认为 1。

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
