> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## 修改运行

**post** `/threads/{thread_id}/runs/{run_id}`

修改一次运行。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  由 16 个键值对组成的集合，可以附加到某个对象上。可用于
  以结构化格式存储对象的附加信息，并通过
  API 或控制面板查询对象。

  键为字符串，最长 64 个字符；值为字符串，最长 512
  个字符。

### Returns

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [会话线程](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string`

    参与执行该运行的 [助手](/docs/api-reference/assistants) 的 ID。

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

    关于运行未完成的原因的详细信息。如果运行未完成，将为 `null` ；否则为 null。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行未完成的原因。这将指向在运行过程中达到了哪个具体的令牌上限。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    参与该运行的 [助手](/docs/api-reference/assistants) 所使用的指令。

  - `last_error: object { code, message }  or null`

    与该运行关联的最后一个错误。如果没有错误，将为 `null` null。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下值之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    本次运行过程中已使用的最大 completion token 数。

  - `max_prompt_tokens: number or null`

    本次运行过程中已使用的最大 prompt token 数。

  - `metadata: Metadata or null`

    由 16 个键值对组成的集合，可以附加到某个对象上。可用于
    以结构化格式存储对象的附加信息，并通过
    API 或控制面板查询对象。

    键为字符串，最长 64 个字符；值为字符串，最长 512
    个字符。

  - `model: string`

    所使用的模型 [助手](/docs/api-reference/assistants) 所使用的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果无需任何操作，将为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      本次运行继续所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用列表。

        - `id: string`

          工具调用的 ID。使用 [Submit tool outputs to run](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前该值始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前该值始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用 Structured Outputs，确保模型匹配你提供的 JSON schema。详见 [Structured Outputs 指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是合法 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统消息或用户消息自行指示模型生成 JSON。否则，模型可能持续生成空白字符直至达到 token 限制，导致请求长时间看似“卡住”。还需注意，如果 `finish_reason="length"`，表示生成内容超过了 `max_tokens` ，或对话超过了最大上下文长度。

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
      使用 `json_schema` 推荐用于支持它的模型。注意，
      model will not generate JSON without a system or user message instructing it
      to do so.

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema response format. Used to generate structured JSON responses.
      Learn more about [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs configuration options, including a JSON Schema.

        - `name: string`

          The name of the response format. Must be a-z, A-Z, 0-9, or contain
          underscores and dashes, with a maximum length of 64.

        - `description: optional string`

          A description of what the response format is for, used by the model to
          determine how to respond in the format.

        - `schema: optional map[unknown]`

          The schema for the response format, described as a JSON Schema object.
          Learn how to build JSON schemas [here](https://json-schema.org/).

        - `strict: optional boolean or null`

          Whether to enable strict schema adherence when generating the output.
          If set to true, the model will always follow the exact schema defined
          in the `schema` field. Only a subset of JSON Schema is supported when
          `strict` is `true`. To learn more, read the [Structured Outputs
          guide](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    参与执行该运行的 [会话线程](/docs/api-reference/threads) 作为本次运行的一部分执行时所使用的。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个工具（如果有）。
    `none` 表示模型将不调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以在生成消息或调用一个或多个工具之间进行选择。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具，例如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型将不调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。用于强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果 type 为 `function`，则必须设置 function name

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    所使用的工具列表。 [助手](/docs/api-reference/assistants) 所使用的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`. 该数值应在 1 到 50 之间（含）。

          注意，文件搜索工具可能输出少于 `max_num_results` 条结果。详见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          用于文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，并使用 0 作为 score_threshold。

          详见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            用于文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须仅包含 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

        - `description: optional string`

          对函数功能的描述，供模型用于判断何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，使用 JSON Schema 对象描述。详见 [guide](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式相关文档。

          省略 `parameters` 将定义一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          在生成函数调用时是否启用严格的 schema 遵循。如果设置为 true，模型将严格遵循 `parameters` field. Only a subset of JSON Schema is supported when `strict` is `true`. 在以下位置了解更多关于结构化输出的信息 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行开始前如何截断线程。使用此参数可以控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值是 `auto`。如果设置为 `last_messages`,线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时,线程中间的消息将被丢弃,以适应模型的上下文长度, `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在为运行构建上下文时使用的线程中最近的消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与本次运行相关的使用统计信息。如果运行未处于终止状态(即 `null` 等),该值将为。 `in_progress`, `queued`，等)。

    - `completion_tokens: number`

      在本次运行过程中使用的完成 token 数量。

    - `prompt_tokens: number`

      在本次运行过程中使用的提示 token 数量。

    - `total_tokens: number`

      使用的 token 总数(提示 + 完成)。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置,默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置,默认为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
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
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "metadata": {
      "user_id": "user_abc123"
    }
  }'
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
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "file-abc123",
        "file-abc456"
      ]
    }
  },
  "metadata": {
    "user_id": "user_abc123"
  },
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
