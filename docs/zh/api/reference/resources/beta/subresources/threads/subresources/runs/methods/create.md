> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建运行

**post** `/threads/{thread_id}/runs`

创建一次运行。

### 路径参数

- `thread_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  包含在响应中的附加字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 正文参数

- `assistant_id: string`

  要用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

- `additional_instructions: optional string or null`

  在运行指令的末尾追加附加指令。这对于在不覆盖其他指令的情况下按每次运行修改行为很有用。

- `additional_messages: optional array of object { content, role, attachments, metadata }  or null`

  在创建运行之前向线程添加附加消息。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      一个包含已定义类型的内容部件数组，每个部件可以是 `text` 类型，图片可以通过 `image_url` 或 `image_file`。传递。图片类型仅在 [Vision 兼容模型](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        上受支持。引用消息内容中的 [File](/docs/api-reference/files) 图片。

        - `image_file: ImageFile`

          - `file_id: string`

            该 [File](/docs/api-reference/files) 消息内容中图片的 ID。上传 File 时设置 `purpose="vision"` ，以便后续需要显示文件内容时使用。

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定，则指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          Always `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        在消息内容中引用图像 URL。

        - `image_url: ImageURL`

          - `url: string`

            图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用 `high`。默认值为 `auto`

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

          Always `text`.

          - `"text"`

  - `role: "user" or "assistant"`

    创建消息的实体的角色。允许的值包括：

    - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来代表用户生成的消息。
    - `assistant`：表示消息由助手生成。使用此值可将助手生成的消息插入对话中。

    - `"user"`

    - `"assistant"`

  - `attachments: optional array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及这些文件应添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          正在定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          正在定义的工具类型： `file_search`

          - `"file_search"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并可通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
    覆盖。

- `instructions: optional string or null`

  覆盖 [指令](/docs/api-reference/assistants/createAssistant) 。这对于在每次运行的基础上修改行为非常有用。

- `max_completion_tokens: optional number or null`

  运行过程中可能使用的最大完成令牌数。运行将尽最大努力仅使用指定数量的完成令牌，跨运行的多次对话轮次。如果运行超过指定的完成令牌数，运行将以状态结束 `incomplete`。请参阅 `incomplete_details` 以获取更多信息。

- `max_prompt_tokens: optional number or null`

  运行过程中可能使用的最大提示令牌数。运行将尽最大努力仅使用指定数量的提示令牌，跨运行的多次对话轮次。如果运行超过指定的提示令牌数，运行将以状态结束 `incomplete`。请参阅 `incomplete_details` 以获取更多信息。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这可以
  用于以结构化格式存储有关对象的额外信息，
  并可通过 API 或仪表盘查询对象。

  键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
  覆盖。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more or null`

  要用于执行此运行的 [模型](/docs/api-reference/models) 用于执行此运行。如果在此处提供了值，它将覆盖与助手关联的模型。如果没有，则将使用与助手关联的模型。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要用于执行此运行的 [模型](/docs/api-reference/models) 用于执行此运行。如果在此处提供了值，它将覆盖与助手关联的模型。如果没有，则将使用与助手关联的模型。

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

  是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的努力程度。目前支持的
  值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  减少推理努力可能导致更快的响应和更少的令牌
  在响应中用于推理。并非所有推理模型都支持每个
  值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  了解模型特定的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及所有 GPT-3.5 Turbo 模型自 `gpt-3.5-turbo-1106`.

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON schema。了解更多，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 上限，导致长时间运行且看似"卡住"的请求。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。生成 JSON 响应的较旧方法。
    对于支持该格式的模型，建议使用 `json_schema` 。请注意，
    模型在没有系统或用户消息指示时不会生成 JSON
    为此。

    - `type: "json_object"`

      所定义响应格式的类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化的 JSON 响应。
    了解更多关于 [结构化输出](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出配置选项，包括一个 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短横线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型据此
        确定如何以该格式响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象描述。
        了解如何构建 JSON Schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的架构遵守。
        如果设置为 true，模型将始终遵循定义的精确架构
        中的 `schema` 字段。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      所定义响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

- `stream: optional boolean or null`

  如果 `true`，会返回运行过程中发生的事件流（以服务器发送事件的形式），当运行进入终止状态并带有 `data: [DONE]` 消息时结束。

- `temperature: optional number or null`

  使用的采样温度，范围在 0 到 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使输出更集中且更具确定性。

- `tool_choice: optional AssistantToolChoiceOption or null`

  控制模型调用哪个（如果有）工具。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
  `required` 表示模型在响应用户之前必须调用一个或多个工具。
  指定特定工具（如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ）会强制模型调用该工具。

  - `"none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

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

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool or null`

  覆盖助手在此次运行中可使用的工具。这对于按每次运行修改行为很有用。

  - `CodeInterpreterTool object { type }`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      正在定义的工具类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      对 文件搜索 工具的覆盖。

      - `max_num_results: optional number`

        文件搜索 工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。模型，默认值为 5。此数字应在 1 到 50 之间（含边界值）。

        请注意，文件搜索 工具输出的结果可能少于 `max_num_results` 结果。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排名选项。如果未指定，文件搜索工具将使用 `auto` 排名器，且 score_threshold 为 0。

        参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `score_threshold: number`

          文件搜索的得分阈值。所有值必须是介于 0 和 1 之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排名器。如果未指定，将使用 `auto` 排名器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，模型用来选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

        省略 `parameters` 将定义一个具有空参数列表的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格模式，确保严格遵循 schema。如果设为 true，模型将遵循 `parameters` 字段。当 `strict` 为 `true`。中定义的精确 schema。在 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  温度采样的替代方案，称为核采样，其中模型考虑具有 top_p 概率质量的标记结果。因此 0.1 意味着仅考虑包含前 10% 概率质量的标记。

  我们通常建议修改此参数或温度，但不要同时修改两者。

- `truncation_strategy: optional object { type, last_messages }  or null`

  控制在线程在运行前如何被截断。使用此参数来控制运行的初始上下文窗口。

  - `type: "auto" or "last_messages"`

    用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适配模型的上下文长度， `max_prompt_tokens`.

    - `"auto"`

    - `"last_messages"`

  - `last_messages: optional number or null`

    构建运行上下文时使用的线程中最近消息的数量。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [thread](/docs/api-reference/threads).

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `assistant_id: string`

    要用于执行此运行的 [assistant](/docs/api-reference/assistants) 用于执行此运行。

  - `cancelled_at: number or null`

    运行被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行创建时的 Unix 时间戳（秒）。

  - `expires_at: number or null`

    运行将过期时的 Unix 时间戳（秒）。

  - `failed_at: number or null`

    运行失败时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    运行不完整的原因详情。若运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指明运行过程中达到了哪个具体的令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    该 [assistant](/docs/api-reference/assistants) 用于此运行的说明。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    指定在运行过程中使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    运行过程中指定已使用的最大提示词令牌数。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并可通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
    覆盖。

  - `model: string`

    运行该 [assistant](/docs/api-reference/assistants) 用于此运行的说明。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。若无操作要求，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      为继续运行所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用列表。

        - `id: string`

          工具调用的ID。使用 [提交工具输出到运行](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及所有 GPT-3.5 Turbo 模型自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON schema。了解更多，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 上限，导致长时间运行且看似"卡住"的请求。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的较旧方法。
      对于支持该格式的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON
      为此。

      - `type: "json_object"`

        所定义响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括一个 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型据此
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象描述。
          了解如何构建 JSON Schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵守。
          如果设置为 true，模型将始终遵循定义的精确架构
          中的 `schema` 字段。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    运行开始时的Unix时间戳（秒）。

  - `status: "queued" or "in_progress" or "requires_action" or 6 more`

    运行状态，可为 `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`，或 `expired`.

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

    要用于执行此运行的 [thread](/docs/api-reference/threads) 在此运行中作为一部分执行的。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定特定工具（如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ）会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

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

    该 [assistant](/docs/api-reference/assistants) 用于此运行的说明。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对 文件搜索 工具的覆盖。

        - `max_num_results: optional number`

          文件搜索 工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。模型，默认值为 5。此数字应在 1 到 50 之间（含边界值）。

          请注意，文件搜索 工具输出的结果可能少于 `max_num_results` 结果。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排名选项。如果未指定，文件搜索工具将使用 `auto` 排名器，且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的得分阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排名器。如果未指定，将使用 `auto` 排名器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用来选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的文档。

          省略 `parameters` 将定义一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式，确保严格遵循 schema。如果设为 true，模型将遵循 `parameters` 字段。当 `strict` 为 `true`。中定义的精确 schema。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程在运行前如何被截断。使用此参数来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适配模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      构建运行上下文时使用的线程中最近消息的数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。此值将为 `null` 如果运行不处于终止状态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，默认为 1。

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
