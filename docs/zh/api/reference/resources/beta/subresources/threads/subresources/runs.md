# 运行

> 完整文档索引见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 取消运行

**post** `/threads/{thread_id}/runs/{run_id}/cancel`

取消正在执行的运行 `in_progress`.

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

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

## 创建运行

**post** `/threads/{thread_id}/runs`

创建一次运行。

### 路径参数

- `thread_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要在响应中包含的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 请求体参数

- `assistant_id: string`

  用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

- `additional_instructions: optional string or null`

  在运行的指令末尾追加额外指令。这对于在每次运行的基础上修改行为而不覆盖其他指令很有用。

- `additional_messages: optional array of object { content, role, attachments, metadata }  or null`

  在创建运行之前向线程添加额外的消息。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      一个具有定义类型的内容部分数组，每个部分可以是 `text` 类型，或者图片可以通过 `image_url` 或 `image_file`。传递。图片类型仅在 [Vision 兼容模型](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        引用消息内容中的图片 [File](/docs/api-reference/files) 。

        - `image_file: ImageFile`

          - `file_id: string`

            该 [File](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 在上传文件时，如果之后需要显示文件内容。

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定，则指定图片的细节级别。 `low` 使用的 token 更少，你可以通过以下方式选择高分辨率 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        在消息内容中引用图像 URL。

        - `image_url: ImageURL`

          - `url: string`

            图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。 `low` 使用的 token 更少，你可以通过以下方式选择高分辨率 `high`。默认值为 `auto`

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

      - `TextContentBlockParam object { text, type }`

        作为消息一部分的文本内容。

        - `text: string`

          要发送给模型的文本内容

        - `type: "text"`

          始终 `text`.

          - `"text"`

  - `role: "user" or "assistant"`

    创建消息的实体的角色。允许的值包括：

    - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
    - `assistant`：表示消息由助手生成。使用此值可将助手的消息插入对话中。

    - `"user"`

    - `"assistant"`

  - `attachments: optional array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及应将其添加到哪些工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要添加此文件的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `metadata: optional Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

- `instructions: optional string or null`

  覆盖 [instructions](/docs/api-reference/assistants/createAssistant) 智能体的指令。这对于在每次运行中修改行为很有用。

- `max_completion_tokens: optional number or null`

  运行过程中可能使用的最大完成令牌数。运行将尽最大努力，在多次轮流中仅使用指定的完成令牌数。如果运行超过指定的完成令牌数，则运行将以状态 `incomplete`。结束。请参阅 `incomplete_details` 了解更多信息。

- `max_prompt_tokens: optional number or null`

  运行过程中可能使用的最大提示令牌数。运行将尽最大努力，在多次轮流中仅使用指定的提示令牌数。如果运行超过指定的提示令牌数，则运行将以状态 `incomplete`。结束。请参阅 `incomplete_details` 了解更多信息。

- `metadata: optional Metadata or null`

  可附加到对象上的16个键值对集合。这可以
  用于以结构化格式存储有关对象的额外信息，
  并通过API或仪表盘查询对象。

  键为字符串，最大长度为64个字符。值为字符串，
  最大长度为512个字符。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more or null`

  用于执行此运行的 [Model](/docs/api-reference/models) 将用于执行本次运行。如果在此提供了值，它将覆盖与助手关联的模型。如果未提供，则将使用与助手关联的模型。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    用于执行此运行的 [Model](/docs/api-reference/models) 将用于执行本次运行。如果在此提供了值，它将覆盖与助手关联的模型。如果未提供，则将使用与助手关联的模型。

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

- `parallel_tool_calls: optional boolean`

  是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

- `reasoning_effort: optional ReasoningEffort or null`

  约束推理模型在推理上的投入。当前支持的
  值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
  降低推理投入可能导致更快的响应和更少的 token
  用于响应中的推理。并非所有推理模型都支持每个
  值。请参阅
  [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
  以了解模型特定的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

  设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。生成 JSON 响应的较旧方法。
    对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
    模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
    。

    - `type: "json_object"`

      正在定义的响应格式类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    详细了解 [Structured Outputs](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短划线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型据此
        决定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的 schema 遵守。
        如果设为 true，模型将始终遵循定义的确切 schema
        中的 `schema` 字段。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式类型。始终为 `json_schema`.

      - `"json_schema"`

- `stream: optional boolean or null`

  如果 `true`，以服务器推送事件的形式返回运行过程中发生的事件流，并在运行进入终止状态并带有 `data: [DONE]` 消息时结束。

- `temperature: optional number or null`

  使用什么采样温度，介于 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使其更集中和确定。

- `tool_choice: optional AssistantToolChoiceOption or null`

  控制模型调用哪个（如果有）工具。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
  `required` 表示模型必须在响应用户之前调用一个或多个工具。
  指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  - `"none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `AssistantToolChoice object { type, function }`

    指定模型应使用的工具。使用它强制模型调用特定工具。

    - `type: "function" or "code_interpreter" or "file_search"`

      工具的类型。如果类型为 `function`，则必须设置函数名称

      - `"function"`

      - `"code_interpreter"`

      - `"file_search"`

    - `function: optional AssistantToolChoiceFunction`

      - `name: string`

        要调用的函数的名称。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool or null`

  覆盖助手在此次运行中可使用的工具。这对于按运行修改行为很有用。

  - `CodeInterpreterTool object { type }`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      正在定义的工具类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      文件搜索工具的覆盖设置。

      - `max_num_results: optional number`

        文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

        请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

        参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

        省略 `parameters` 定义了一个带有空参数列表的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代使用温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的 tokens 的结果。因此 0.1 意味着仅考虑构成前 10% 概率质量的 tokens。

  我们通常建议修改此参数或温度，但不要同时修改两者。

- `truncation_strategy: optional object { type, last_messages }  or null`

  控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

  - `type: "auto" or "last_messages"`

    用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

    - `"auto"`

    - `"last_messages"`

  - `last_messages: optional number or null`

    为运行构建上下文时，从线程中获取的最近消息数量。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "assistant_id": "assistant_id",
          "temperature": 1,
          "top_p": 1
        }'
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
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_abc123"
  }'
```

#### 响应

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699063290,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "queued",
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
  "metadata": {},
  "usage": null,
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

### 流式传输

```http
curl https://api.openai.com/v1/threads/thread_123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_123",
    "stream": true
  }'
```

#### 响应

```json
event: thread.run.created
data: {"id":"run_123","object":"thread.run","created_at":1710330640,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710331240,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.queued
data: {"id":"run_123","object":"thread.run","created_at":1710330640,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710331240,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.in_progress
data: {"id":"run_123","object":"thread.run","created_at":1710330640,"assistant_id":"asst_123","thread_id":"thread_123","status":"in_progress","started_at":1710330641,"expires_at":1710331240,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.step.created
data: {"id":"step_001","object":"thread.run.step","created_at":1710330641,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710331240,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.run.step.in_progress
data: {"id":"step_001","object":"thread.run.step","created_at":1710330641,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710331240,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.message.created
data: {"id":"msg_001","object":"thread.message","created_at":1710330641,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.in_progress
data: {"id":"msg_001","object":"thread.message","created_at":1710330641,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"Hello","annotations":[]}}]}}

...

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" today"}}]}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"?"}}]}}

event: thread.message.completed
data: {"id":"msg_001","object":"thread.message","created_at":1710330641,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"completed","incomplete_details":null,"incomplete_at":null,"completed_at":1710330642,"role":"assistant","content":[{"type":"text","text":{"value":"Hello! How can I assist you today?","annotations":[]}}],"metadata":{}}

event: thread.run.step.completed
data: {"id":"step_001","object":"thread.run.step","created_at":1710330641,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"completed","cancelled_at":null,"completed_at":1710330642,"expires_at":1710331240,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31}}

event: thread.run.completed
data: {"id":"run_123","object":"thread.run","created_at":1710330640,"assistant_id":"asst_123","thread_id":"thread_123","status":"completed","started_at":1710330641,"expires_at":null,"cancelled_at":null,"failed_at":null,"completed_at":1710330642,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31},"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: done
data: [DONE]
```

### 带函数的流式传输

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_abc123",
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_current_weather",
          "description": "Get the current weather in a given location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"]
              }
            },
            "required": ["location"]
          }
        }
      }
    ],
    "stream": true
  }'
```

#### 响应

```json
event: thread.run.created
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.queued
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.in_progress
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"in_progress","started_at":1710348075,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.step.created
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.run.step.in_progress
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.message.created
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.in_progress
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"Hello","annotations":[]}}]}}

...

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" today"}}]}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"?"}}]}}

event: thread.message.completed
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"completed","incomplete_details":null,"incomplete_at":null,"completed_at":1710348077,"role":"assistant","content":[{"type":"text","text":{"value":"Hello! How can I assist you today?","annotations":[]}}],"metadata":{}}

event: thread.run.step.completed
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"completed","cancelled_at":null,"completed_at":1710348077,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31}}

event: thread.run.completed
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"completed","started_at":1710348075,"expires_at":null,"cancelled_at":null,"failed_at":null,"completed_at":1710348077,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31},"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: done
data: [DONE]
```

## 列出运行

**get** `/threads/{thread_id}/runs`

返回属于某个线程的步骤列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你后续的调用可以包含 after=obj_foo，以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你后续的调用可以包含 before=obj_foo，以获取列表的上一页。

- `limit: optional number`

  对要返回的对象数量的限制。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Run`

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

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

## 检索运行

**get** `/threads/{thread_id}/runs/{run_id}`

检索一个运行。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

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

## 提交工具输出以运行

**post** `/threads/{thread_id}/runs/{run_id}/submit_tool_outputs`

当一次运行具有 `status: "requires_action"` 和 `required_action.type` 为 `submit_tool_outputs`，时，一旦所有工具调用全部完成，此端点可用于提交工具调用的输出。所有输出必须在单个请求中提交。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 请求体参数

- `tool_outputs: array of object { output, tool_call_id }`

  正在提交输出的工具列表。

  - `output: optional string`

    为延续运行而提交的工具调用输出。

  - `tool_call_id: optional string`

    中工具调用的 ID， `required_action` 即运行对象中正在提交输出的对象。

- `stream: optional boolean or null`

  如果 `true`，以服务器推送事件的形式返回运行过程中发生的事件流，并在运行进入终止状态并带有 `data: [DONE]` 消息时结束。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/submit_tool_outputs \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "tool_outputs": [
            {}
          ]
        }'
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
curl https://api.openai.com/v1/threads/thread_123/runs/run_123/submit_tool_outputs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "tool_outputs": [
      {
        "tool_call_id": "call_001",
        "output": "70 degrees and sunny."
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "run_123",
  "object": "thread.run",
  "created_at": 1699075592,
  "assistant_id": "asst_123",
  "thread_id": "thread_123",
  "status": "queued",
  "started_at": 1699075592,
  "expires_at": 1699076192,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": null,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "metadata": {},
  "usage": null,
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

### 流式传输

```http
curl https://api.openai.com/v1/threads/thread_123/runs/run_123/submit_tool_outputs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "tool_outputs": [
      {
        "tool_call_id": "call_001",
        "output": "70 degrees and sunny."
      }
    ],
    "stream": true
  }'
```

#### 响应

```json
event: thread.run.step.completed
data: {"id":"step_001","object":"thread.run.step","created_at":1710352449,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"tool_calls","status":"completed","cancelled_at":null,"completed_at":1710352475,"expires_at":1710353047,"failed_at":null,"last_error":null,"step_details":{"type":"tool_calls","tool_calls":[{"id":"call_iWr0kQ2EaYMaxNdl0v3KYkx7","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\":\"San Francisco, CA\",\"unit\":\"fahrenheit\"}","output":"70 degrees and sunny."}}]},"usage":{"prompt_tokens":291,"completion_tokens":24,"total_tokens":315}}

event: thread.run.queued
data: {"id":"run_123","object":"thread.run","created_at":1710352447,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":1710352448,"expires_at":1710353047,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.in_progress
data: {"id":"run_123","object":"thread.run","created_at":1710352447,"assistant_id":"asst_123","thread_id":"thread_123","status":"in_progress","started_at":1710352475,"expires_at":1710353047,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.step.created
data: {"id":"step_002","object":"thread.run.step","created_at":1710352476,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710353047,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_002"}},"usage":null}

event: thread.run.step.in_progress
data: {"id":"step_002","object":"thread.run.step","created_at":1710352476,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710353047,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_002"}},"usage":null}

event: thread.message.created
data: {"id":"msg_002","object":"thread.message","created_at":1710352476,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.in_progress
data: {"id":"msg_002","object":"thread.message","created_at":1710352476,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[],"metadata":{}}

event: thread.message.delta
data: {"id":"msg_002","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"The","annotations":[]}}]}}

event: thread.message.delta
data: {"id":"msg_002","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" current"}}]}}

event: thread.message.delta
data: {"id":"msg_002","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" weather"}}]}}

...

event: thread.message.delta
data: {"id":"msg_002","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" sunny"}}]}}

event: thread.message.delta
data: {"id":"msg_002","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"."}}]}}

event: thread.message.completed
data: {"id":"msg_002","object":"thread.message","created_at":1710352476,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"completed","incomplete_details":null,"incomplete_at":null,"completed_at":1710352477,"role":"assistant","content":[{"type":"text","text":{"value":"The current weather in San Francisco, CA is 70 degrees Fahrenheit and sunny.","annotations":[]}}],"metadata":{}}

event: thread.run.step.completed
data: {"id":"step_002","object":"thread.run.step","created_at":1710352476,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"completed","cancelled_at":null,"completed_at":1710352477,"expires_at":1710353047,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_002"}},"usage":{"prompt_tokens":329,"completion_tokens":18,"total_tokens":347}}

event: thread.run.completed
data: {"id":"run_123","object":"thread.run","created_at":1710352447,"assistant_id":"asst_123","thread_id":"thread_123","status":"completed","started_at":1710352475,"expires_at":null,"cancelled_at":null,"failed_at":null,"completed_at":1710352477,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31},"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: done
data: [DONE]
```

## 修改运行

**post** `/threads/{thread_id}/runs/{run_id}`

修改一个运行。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象上的16个键值对集合。这可以
  用于以结构化格式存储有关对象的额外信息，
  并通过API或仪表盘查询对象。

  键为字符串，最大长度为64个字符。值为字符串，
  最大长度为512个字符。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

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

## 域类型

### 必需操作函数工具调用

- `RequiredActionFunctionToolCall object { id, function, type }`

  工具调用对象

  - `id: string`

    工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

  - `function: object { arguments, name }`

    函数定义。

    - `arguments: string`

      模型期望你传递给函数的参数。

    - `name: string`

      函数的名称。

  - `type: "function"`

    需要输出的工具调用类型。目前，这始终是 `function`.

    - `"function"`

### 运行

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示对 [thread](/docs/api-reference/threads).

  - `id: string`

    的一次执行运行。标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

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

    运行不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。将指出在运行过程中达到了哪个具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `model: string`

    为此次运行所使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你通过 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 以来所有 GPT-3.5 Turbo 模型兼容。 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持这些方法的模型，建议使用 `json_schema` 。请注意，如果
      模型没有收到指示其生成 JSON 的系统或用户消息，它将不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          决定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵守。
          如果设为 true，模型将始终遵循定义的确切 schema
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终为 `json_schema`.

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

    用于执行此运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具的类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    此运行中助手使用的工具列表 [assistant](/docs/api-reference/assistants) 的指令。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。此数字应在 1 到 50 之间（含 1 和 50）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 该数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将遵循中定义的精确架构 `parameters` 字段。当 `strict` 为 `true`。时。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将 `null` 如果运行不处于终态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的补全令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，则默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，则默认为 1。

# 步骤

## 列出运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps`

返回属于某次运行的运行步骤列表。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你后续的调用可以包含 after=obj_foo，以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你后续的调用可以包含 before=obj_foo，以获取列表的上一页。

- `include: optional array of RunStepInclude`

  要在响应中包含的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

- `limit: optional number`

  对要返回的对象数量的限制。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of RunStep`

  - `id: string`

    运行步骤的标识符，可在API端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 与运行步骤相关联。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（以秒为单位）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。将 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      以下之一： `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    用于执行此运行的 [运行](/docs/api-reference/runs) 此运行步骤是其一部分的。

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    运行步骤的详细信息。

    - `MessageCreationStepDetails object { message_creation, type }`

      运行步骤创建消息的详细信息。

      - `message_creation: object { message_id }`

        - `message_id: string`

          此运行步骤创建的消息的 ID。

      - `type: "message_creation"`

        始终 `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      工具调用的详细信息。

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用的定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

                - `logs: string`

                  Code Interpreter 工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [file](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的得分。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            所调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    用于执行此运行的 [thread](/docs/api-reference/threads) 所运行的步骤。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps \
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
      "expired_at": 0,
      "failed_at": 0,
      "last_error": {
        "code": "server_error",
        "message": "message"
      },
      "metadata": {
        "foo": "string"
      },
      "object": "thread.run.step",
      "run_id": "run_id",
      "status": "in_progress",
      "step_details": {
        "message_creation": {
          "message_id": "message_id"
        },
        "type": "message_creation"
      },
      "thread_id": "thread_id",
      "type": "message_creation",
      "usage": {
        "completion_tokens": 0,
        "prompt_tokens": 0,
        "total_tokens": 0
      }
    }
  ],
  "first_id": "step_abc123",
  "has_more": false,
  "last_id": "step_abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps \
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
      "id": "step_abc123",
      "object": "thread.run.step",
      "created_at": 1699063291,
      "run_id": "run_abc123",
      "assistant_id": "asst_abc123",
      "thread_id": "thread_abc123",
      "type": "message_creation",
      "status": "completed",
      "cancelled_at": null,
      "completed_at": 1699063291,
      "expired_at": null,
      "failed_at": null,
      "last_error": null,
      "step_details": {
        "type": "message_creation",
        "message_creation": {
          "message_id": "msg_abc123"
        }
      },
      "usage": {
        "prompt_tokens": 123,
        "completion_tokens": 456,
        "total_tokens": 579
      }
    }
  ],
  "first_id": "step_abc123",
  "last_id": "step_abc456",
  "has_more": false
}
```

## 获取运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

检索一个运行步骤。

### 路径参数

- `thread_id: string`

- `run_id: string`

- `step_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要在响应中包含的其他字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 返回

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在API端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 与运行步骤相关联。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（以秒为单位）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。将 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      以下之一： `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    用于执行此运行的 [运行](/docs/api-reference/runs) 此运行步骤是其一部分的。

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    运行步骤的详细信息。

    - `MessageCreationStepDetails object { message_creation, type }`

      运行步骤创建消息的详细信息。

      - `message_creation: object { message_id }`

        - `message_id: string`

          此运行步骤创建的消息的 ID。

      - `type: "message_creation"`

        始终 `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      工具调用的详细信息。

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用的定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

                - `logs: string`

                  Code Interpreter 工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [file](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的得分。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            所调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    用于执行此运行的 [thread](/docs/api-reference/threads) 所运行的步骤。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/runs/$RUN_ID/steps/$STEP_ID \
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
  "expired_at": 0,
  "failed_at": 0,
  "last_error": {
    "code": "server_error",
    "message": "message"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.run.step",
  "run_id": "run_id",
  "status": "in_progress",
  "step_details": {
    "message_creation": {
      "message_id": "message_id"
    },
    "type": "message_creation"
  },
  "thread_id": "thread_id",
  "type": "message_creation",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/runs/run_abc123/steps/step_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "step_abc123",
  "object": "thread.run.step",
  "created_at": 1699063291,
  "run_id": "run_abc123",
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "type": "message_creation",
  "status": "completed",
  "cancelled_at": null,
  "completed_at": 1699063291,
  "expired_at": null,
  "failed_at": null,
  "last_error": null,
  "step_details": {
    "type": "message_creation",
    "message_creation": {
      "message_id": "msg_abc123"
    }
  },
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

## 域类型

### 代码解释器日志

- `CodeInterpreterLogs object { index, type, logs }`

  作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

  - `index: number`

    outputs 数组中输出的索引。

  - `type: "logs"`

    始终 `logs`.

    - `"logs"`

  - `logs: optional string`

    Code Interpreter 工具调用的文本输出。

### 代码解释器输出图像

- `CodeInterpreterOutputImage object { index, type, image }`

  - `index: number`

    outputs 数组中输出的索引。

  - `type: "image"`

    始终 `image`.

    - `"image"`

  - `image: optional object { file_id }`

    - `file_id: optional string`

      该 [file](/docs/api-reference/files) 图像的 ID。

### 代码解释器工具调用

- `CodeInterpreterToolCall object { id, code_interpreter, type }`

  运行步骤涉及的代码解释器工具调用的详细信息。

  - `id: string`

    工具调用的 ID。

  - `code_interpreter: object { input, outputs }`

    代码解释器工具调用的定义。

    - `input: string`

      代码解释器工具调用的输入。

    - `outputs: array of object { logs, type }  or object { image, type }`

      Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

      - `CodeInterpreterLogOutput object { logs, type }`

        作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

        - `logs: string`

          Code Interpreter 工具调用的文本输出。

        - `type: "logs"`

          始终 `logs`.

          - `"logs"`

      - `CodeInterpreterImageOutput object { image, type }`

        - `image: object { file_id }`

          - `file_id: string`

            该 [file](/docs/api-reference/files) 图像的 ID。

        - `type: "image"`

          始终 `image`.

          - `"image"`

  - `type: "code_interpreter"`

    工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

    - `"code_interpreter"`

### 代码解释器工具调用增量

- `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

  运行步骤涉及的代码解释器工具调用的详细信息。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "code_interpreter"`

    工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

    - `"code_interpreter"`

  - `id: optional string`

    工具调用的 ID。

  - `code_interpreter: optional object { input, outputs }`

    代码解释器工具调用的定义。

    - `input: optional string`

      代码解释器工具调用的输入。

    - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

      Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

      - `CodeInterpreterLogs object { index, type, logs }`

        作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

        - `index: number`

          outputs 数组中输出的索引。

        - `type: "logs"`

          始终 `logs`.

          - `"logs"`

        - `logs: optional string`

          Code Interpreter 工具调用的文本输出。

      - `CodeInterpreterOutputImage object { index, type, image }`

        - `index: number`

          outputs 数组中输出的索引。

        - `type: "image"`

          始终 `image`.

          - `"image"`

        - `image: optional object { file_id }`

          - `file_id: optional string`

            该 [file](/docs/api-reference/files) 图像的 ID。

### 文件搜索工具调用

- `FileSearchToolCall object { id, file_search, type }`

  - `id: string`

    工具调用对象的 ID。

  - `file_search: object { ranking_options, results }`

    目前，该值始终是一个空对象。

    - `ranking_options: optional object { ranker, score_threshold }`

      文件搜索的排序选项。

      - `ranker: "auto" or "default_2024_08_21"`

        用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

        - `"auto"`

        - `"default_2024_08_21"`

      - `score_threshold: number`

        文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

    - `results: optional array of object { file_id, file_name, score, content }`

      文件搜索的结果。

      - `file_id: string`

        找到结果的文件的 ID。

      - `file_name: string`

        找到结果的文件的名称。

      - `score: number`

        结果的得分。所有值必须是 0 到 1 之间的浮点数。

      - `content: optional array of object { text, type }`

        找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

        - `text: optional string`

          文件的文本内容。

        - `type: optional "text"`

          内容的类型。

          - `"text"`

  - `type: "file_search"`

    工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

    - `"file_search"`

### 文件搜索工具调用增量

- `FileSearchToolCallDelta object { file_search, index, type, id }`

  - `file_search: unknown`

    目前，该值始终是一个空对象。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "file_search"`

    工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

    - `"file_search"`

  - `id: optional string`

    工具调用对象的 ID。

### 函数工具调用

- `FunctionToolCall object { id, function, type }`

  - `id: string`

    工具调用对象的 ID。

  - `function: object { arguments, name, output }`

    所调用函数的定义。

    - `arguments: string`

      传递给函数的参数。

    - `name: string`

      函数的名称。

    - `output: string or null`

      函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

  - `type: "function"`

    工具调用的类型。对于此类工具调用，该值始终为 `function` 。

    - `"function"`

### 函数工具调用增量

- `FunctionToolCallDelta object { index, type, id, function }`

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "function"`

    工具调用的类型。对于此类工具调用，该值始终为 `function` 。

    - `"function"`

  - `id: optional string`

    工具调用对象的 ID。

  - `function: optional object { arguments, name, output }`

    所调用函数的定义。

    - `arguments: optional string`

      传递给函数的参数。

    - `name: optional string`

      函数的名称。

    - `output: optional string or null`

      函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

### 消息创建步骤详情

- `MessageCreationStepDetails object { message_creation, type }`

  运行步骤创建消息的详细信息。

  - `message_creation: object { message_id }`

    - `message_id: string`

      此运行步骤创建的消息的 ID。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

### 运行步骤

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在API端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [assistant](/docs/api-reference/assistants) 与运行步骤相关联。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（以秒为单位）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。将 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      以下之一： `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表盘查询对象。

    键为字符串，最大长度为64个字符。值为字符串，
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    用于执行此运行的 [运行](/docs/api-reference/runs) 此运行步骤是其一部分的。

  - `status: "in_progress" or "cancelled" or "failed" or 2 more`

    运行步骤的状态，可以是 `in_progress`, `cancelled`, `failed`, `completed`，或 `expired`.

    - `"in_progress"`

    - `"cancelled"`

    - `"failed"`

    - `"completed"`

    - `"expired"`

  - `step_details: MessageCreationStepDetails or ToolCallsStepDetails`

    运行步骤的详细信息。

    - `MessageCreationStepDetails object { message_creation, type }`

      运行步骤创建消息的详细信息。

      - `message_creation: object { message_id }`

        - `message_id: string`

          此运行步骤创建的消息的 ID。

      - `type: "message_creation"`

        始终 `message_creation`.

        - `"message_creation"`

    - `ToolCallsStepDetails object { tool_calls, type }`

      工具调用的详细信息。

      - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

        运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用的定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

                - `logs: string`

                  Code Interpreter 工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [file](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，该值始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果的文件的 ID。

              - `file_name: string`

                找到结果的文件的名称。

              - `score: number`

                结果的得分。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            所调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    用于执行此运行的 [thread](/docs/api-reference/threads) 所运行的步骤。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。当运行步骤的状态为 `null` 时，此值将为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 补全）。

### 运行步骤增量事件

- `RunStepDeltaEvent object { id, delta, object }`

  表示一个运行步骤增量，即流式传输期间运行步骤上任何已更改的字段。

  - `id: string`

    运行步骤的标识符，可在API端点中引用。

  - `delta: object { step_details }`

    包含运行步骤上已发生更改字段的增量。

    - `step_details: optional RunStepDeltaMessageDelta or ToolCallDeltaObject`

      运行步骤的详细信息。

      - `RunStepDeltaMessageDelta object { type, message_creation }`

        运行步骤创建消息的详细信息。

        - `type: "message_creation"`

          始终 `message_creation`.

          - `"message_creation"`

        - `message_creation: optional object { message_id }`

          - `message_id: optional string`

            此运行步骤创建的消息的 ID。

      - `ToolCallDeltaObject object { type, tool_calls }`

        工具调用的详细信息。

        - `type: "tool_calls"`

          始终 `tool_calls`.

          - `"tool_calls"`

        - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

          运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

          - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

            运行步骤涉及的代码解释器工具调用的详细信息。

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "code_interpreter"`

              工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

              - `"code_interpreter"`

            - `id: optional string`

              工具调用的 ID。

            - `code_interpreter: optional object { input, outputs }`

              代码解释器工具调用的定义。

              - `input: optional string`

                代码解释器工具调用的输入。

              - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

                - `CodeInterpreterLogs object { index, type, logs }`

                  作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

                  - `index: number`

                    outputs 数组中输出的索引。

                  - `type: "logs"`

                    始终 `logs`.

                    - `"logs"`

                  - `logs: optional string`

                    Code Interpreter 工具调用的文本输出。

                - `CodeInterpreterOutputImage object { index, type, image }`

                  - `index: number`

                    outputs 数组中输出的索引。

                  - `type: "image"`

                    始终 `image`.

                    - `"image"`

                  - `image: optional object { file_id }`

                    - `file_id: optional string`

                      该 [file](/docs/api-reference/files) 图像的 ID。

          - `FileSearchToolCallDelta object { file_search, index, type, id }`

            - `file_search: unknown`

              目前，该值始终是一个空对象。

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "file_search"`

              工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

              - `"file_search"`

            - `id: optional string`

              工具调用对象的 ID。

          - `FunctionToolCallDelta object { index, type, id, function }`

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "function"`

              工具调用的类型。对于此类工具调用，该值始终为 `function` 。

              - `"function"`

            - `id: optional string`

              工具调用对象的 ID。

            - `function: optional object { arguments, name, output }`

              所调用函数的定义。

              - `arguments: optional string`

                传递给函数的参数。

              - `name: optional string`

                函数的名称。

              - `output: optional string or null`

                函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

  - `object: "thread.run.step.delta"`

    对象类型，始终为 `thread.run.step.delta`.

    - `"thread.run.step.delta"`

### 运行步骤增量消息增量

- `RunStepDeltaMessageDelta object { type, message_creation }`

  运行步骤创建消息的详细信息。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

  - `message_creation: optional object { message_id }`

    - `message_id: optional string`

      此运行步骤创建的消息的 ID。

### 运行步骤包含

- `RunStepInclude = "step_details.tool_calls[*].file_search.results[*].content"`

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 工具调用增量对象

- `ToolCallDeltaObject object { type, tool_calls }`

  工具调用的详细信息。

  - `type: "tool_calls"`

    始终 `tool_calls`.

    - `"tool_calls"`

  - `tool_calls: optional array of CodeInterpreterToolCallDelta or FileSearchToolCallDelta or FunctionToolCallDelta`

    运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

      运行步骤涉及的代码解释器工具调用的详细信息。

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "code_interpreter"`

        工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

        - `"code_interpreter"`

      - `id: optional string`

        工具调用的 ID。

      - `code_interpreter: optional object { input, outputs }`

        代码解释器工具调用的定义。

        - `input: optional string`

          代码解释器工具调用的输入。

        - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

          Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

          - `CodeInterpreterLogs object { index, type, logs }`

            作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

            - `index: number`

              outputs 数组中输出的索引。

            - `type: "logs"`

              始终 `logs`.

              - `"logs"`

            - `logs: optional string`

              Code Interpreter 工具调用的文本输出。

          - `CodeInterpreterOutputImage object { index, type, image }`

            - `index: number`

              outputs 数组中输出的索引。

            - `type: "image"`

              始终 `image`.

              - `"image"`

            - `image: optional object { file_id }`

              - `file_id: optional string`

                该 [file](/docs/api-reference/files) 图像的 ID。

    - `FileSearchToolCallDelta object { file_search, index, type, id }`

      - `file_search: unknown`

        目前，该值始终是一个空对象。

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "file_search"`

        工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

        - `"file_search"`

      - `id: optional string`

        工具调用对象的 ID。

    - `FunctionToolCallDelta object { index, type, id, function }`

      - `index: number`

        工具调用数组中的工具调用索引。

      - `type: "function"`

        工具调用的类型。对于此类工具调用，该值始终为 `function` 。

        - `"function"`

      - `id: optional string`

        工具调用对象的 ID。

      - `function: optional object { arguments, name, output }`

        所调用函数的定义。

        - `arguments: optional string`

          传递给函数的参数。

        - `name: optional string`

          函数的名称。

        - `output: optional string or null`

          函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

### 工具调用步骤详细信息

- `ToolCallsStepDetails object { tool_calls, type }`

  工具调用的详细信息。

  - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

    运行步骤涉及的工具调用数组。这些可以关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCall object { id, code_interpreter, type }`

      运行步骤涉及的代码解释器工具调用的详细信息。

      - `id: string`

        工具调用的 ID。

      - `code_interpreter: object { input, outputs }`

        代码解释器工具调用的定义。

        - `input: string`

          代码解释器工具调用的输入。

        - `outputs: array of object { logs, type }  or object { image, type }`

          Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种输出都由不同的对象类型表示。

          - `CodeInterpreterLogOutput object { logs, type }`

            作为运行步骤一部分的 Code Interpreter 工具调用的文本输出。

            - `logs: string`

              Code Interpreter 工具调用的文本输出。

            - `type: "logs"`

              始终 `logs`.

              - `"logs"`

          - `CodeInterpreterImageOutput object { image, type }`

            - `image: object { file_id }`

              - `file_id: string`

                该 [file](/docs/api-reference/files) 图像的 ID。

            - `type: "image"`

              始终 `image`.

              - `"image"`

      - `type: "code_interpreter"`

        工具调用的类型。对于此类工具调用，该值始终为 `code_interpreter` 。

        - `"code_interpreter"`

    - `FileSearchToolCall object { id, file_search, type }`

      - `id: string`

        工具调用对象的 ID。

      - `file_search: object { ranking_options, results }`

        目前，该值始终是一个空对象。

        - `ranking_options: optional object { ranker, score_threshold }`

          文件搜索的排序选项。

          - `ranker: "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是 0 到 1 之间的浮点数。

        - `results: optional array of object { file_id, file_name, score, content }`

          文件搜索的结果。

          - `file_id: string`

            找到结果的文件的 ID。

          - `file_name: string`

            找到结果的文件的名称。

          - `score: number`

            结果的得分。所有值必须是 0 到 1 之间的浮点数。

          - `content: optional array of object { text, type }`

            找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

            - `text: optional string`

              文件的文本内容。

            - `type: optional "text"`

              内容的类型。

              - `"text"`

      - `type: "file_search"`

        工具调用的类型。对于此类工具调用，该值始终为 `file_search` 。

        - `"file_search"`

    - `FunctionToolCall object { id, function, type }`

      - `id: string`

        工具调用对象的 ID。

      - `function: object { arguments, name, output }`

        所调用函数的定义。

        - `arguments: string`

          传递给函数的参数。

        - `name: string`

          函数的名称。

        - `output: string or null`

          函数的输出。如果输出尚未 `null` 提交，此值将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

      - `type: "function"`

        工具调用的类型。对于此类工具调用，该值始终为 `function` 。

        - `"function"`

  - `type: "tool_calls"`

    始终 `tool_calls`.

    - `"tool_calls"`
