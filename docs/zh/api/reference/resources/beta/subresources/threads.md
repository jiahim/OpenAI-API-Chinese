# 线程

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建线程

**post** `/threads`

创建线程。

### 请求体参数

- `messages: optional array of object { content, role, attachments, metadata }`

  一个 [消息](/docs/api-reference/messages) 列表，用于启动线程。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      一个内容部件数组，每个部件具有已定义的类型，每个部件可以是 `text` 类型，或者可以通过 `image_url` 或 `image_file`。传递图像。图像类型仅在 [支持视觉的模型](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        引用消息内容中的 [文件](/docs/api-reference/files) 图像。

        - `image_file: ImageFile`

          - `file_id: string`

            该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。在 `purpose="vision"` 上传文件时设置，以便后续显示文件内容。

          - `detail: optional "auto" or "low" or "high"`

            指定用户指定的图像的细节级别。 `low` 使用较少 token，你可以通过 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        引用消息内容中的图像 URL。

        - `image_url: ImageURL`

          - `url: string`

            图像的对外 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。 `low` 使用的 token 较少，你可以选择使用高分辨率， `high`。默认值为 `auto`

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

      - `TextContentBlockParam object { text, type }`

        作为消息一部分的文本内容。

        - `text: string`

          发送给模型的文本内容

        - `type: "text"`

          始终 `text`.

          - `"text"`

  - `role: "user" or "assistant"`

    创建消息的实体所扮演的角色。允许的值包括：

    - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
    - `assistant`：表示消息由助手生成。使用此值可将助手的消息插入对话中。

    - `"user"`

    - `"assistant"`

  - `attachments: optional array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及应将这些文件添加到哪些工具。

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

    可附加到对象的 16 个键值对集合。这对于以结构化
    方式存储有关对象的附加信息很有用，
    并且可通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    最大长度为 512 个字符。

- `metadata: optional Metadata or null`

  一组最多 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  并可通过 API 或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  最大长度为 512 个字符。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组在此线程中提供给助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      一个列表 [文件](/docs/api-reference/files) 工具可用的 ID。 `code_interpreter` 与该工具关联的文件最多可有 20 个。

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此线程。线程最多可附加 1 个向量存储。

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      一个辅助创建 [向量存储](/docs/api-reference/vector-stores/object) ，包含 file_ids 并将其附加到此线程。线程最多可附加 1 个向量存储。

      - `chunking_strategy: optional object { type }  or object { static, type }`

        用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

        - `Auto object { type }`

          默认策略。该策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

          - `type: "auto"`

            始终 `auto`.

            - `"auto"`

        - `Static object { static, type }`

          - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

            - `chunk_overlap_tokens: number`

              块之间重叠的令牌数。默认值为 `400`.

              请注意，重叠部分不得超过 `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

          - `type: "static"`

            始终 `static`.

            - `"static"`

      - `file_ids: optional array of string`

        要添加到向量存储中的文件 [file](/docs/api-reference/files) ID 列表。对于 2025 年 11 月之前创建的向量存储，一个向量存储中最多可以有 10,000 个文件。对于 2025 年 11 月开始创建的向量存储，限制为 100,000,000 个文件。

      - `metadata: optional Metadata or null`

        可附加到对象上的 16 个键值对集合。这可以
        用于以结构化格式
        存储有关对象的附加信息，并通过 API 或仪表板查询对象。

        键是字符串，最大长度为 64 个字符。值是字符串
        最大长度为 512 个字符。

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示一个包含 [messages](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的额外
    信息，并可通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    一组资源，可供此线程中助手的工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [file](/docs/api-reference/files) 工具使用的 `code_interpreter` ID 列表。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。附加到线程的向量存储最多可有 1 个。

### 示例

```http
curl https://api.openai.com/v1/threads \
    -X POST \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "metadata": {
    "foo": "string"
  },
  "object": "thread",
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
  }
}
```

### 空

```http
curl https://api.openai.com/v1/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d ''
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699012949,
  "metadata": {},
  "tool_resources": {}
}
```

### 消息

```http
curl https://api.openai.com/v1/threads \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "OpenAI-Beta: assistants=v2" \
-d '{
    "messages": [{
      "role": "user",
      "content": "Hello, what is AI?"
    }, {
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }]
  }'
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {}
}
```

## 创建线程并运行

**post** `/threads/runs`

在一个请求中创建线程并运行它。

### 请求体参数

- `assistant_id: string`

  用于执行此运行的 [assistant](/docs/api-reference/assistants) 的 ID。

- `instructions: optional string or null`

  覆盖 assistant 的默认系统消息。这对于在每次运行的基础上修改行为非常有用。

- `max_completion_tokens: optional number or null`

  运行过程中可能使用的最大完成 token 数。运行将尽最大努力仅使用指定的完成 token 数量，涵盖运行的多个回合。如果运行超过指定的完成 token 数，运行将以状态 `incomplete`。结束。参见 `incomplete_details` 了解更多信息。

- `max_prompt_tokens: optional number or null`

  运行过程中可能使用的最大提示 token 数。运行将尽最大努力仅使用指定的提示 token 数量，涵盖运行的多个回合。如果运行超过指定的提示 token 数，运行将以状态 `incomplete`。结束。参见 `incomplete_details` 了解更多信息。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这对于
  以结构化的方式存储有关对象的额外信息，并通过 API 或
  仪表板查询对象非常有用。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 35 more or null`

  用于执行此运行的 [Model](/docs/api-reference/models) 的 ID。如果此处提供了值，它将覆盖与 assistant 关联的 model。如果没有，则将使用与 assistant 关联的 model。

  - `string`

  - `"gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 35 more`

    用于执行此运行的 [Model](/docs/api-reference/models) 用于执行本次运行。如果在此处提供了值，它将覆盖与助手关联的模型。如果未提供，则将使用与助手关联的模型。

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

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 模式。了解更多信息，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要提示：** 使用 JSON 模式时，你 **必须** 还通过系统或用户消息自行指示模型生成 JSON。否则，模型可能会生成无休止的空格，直到生成达到 token 限制，导致请求长时间运行并看似“卡住”。另请注意，如果 `finish_reason="length"`，表示生成超过了 `max_tokens` 或对话超过了最大上下文长度，消息内容可能会被部分截断。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种生成 JSON 响应的旧方法。
    建议对支持 `json_schema` 的模型使用该格式。请注意，该
    模型在没有系统或用户消息指示它
    这样做时不会生成 JSON。

    - `type: "json_object"`

      所定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    了解更多关于 [结构化输出](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      的配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和破折号，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型用它来
        确定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象形式描述。
        了解如何在此处 [构建 JSON schema](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格架构遵循。
        如果设置为 true，模型将始终遵循定义的确切架构
        中的 `schema` 字段。仅支持 JSON Schema 的子集，当
        `strict` 为 `true`。时。要了解更多信息，请阅读 [Structured Outputs
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式类型。始终为 `json_schema`.

      - `"json_schema"`

- `stream: optional boolean or null`

  如果 `true`，则返回运行期间发生的事件流作为服务器发送事件，当运行进入终端状态并带有 `data: [DONE]` 消息时终止。

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加集中和确定。

- `thread: optional object { messages, metadata, tool_resources }`

  创建新线程的选项。如果在运行
  请求时未提供线程，将创建一个空线程。

  - `messages: optional array of object { content, role, attachments, metadata }`

    用于启动线程的 [消息](/docs/api-reference/messages) 列表。

    - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      消息的文本内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

        一个具有已定义类型的内容部分数组，每个部分可以是 `text` 或图像可以通过 `image_url` 或 `image_file`。传递。图像类型仅在 [支持视觉的模型](/docs/models).

        - `ImageFileContentBlock object { image_file, type }`

          引用消息内容中的图像 [文件](/docs/api-reference/files) 。

          - `image_file: ImageFile`

            - `file_id: string`

              该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 在上传文件时使用，以便后续显示文件内容。

            - `detail: optional "auto" or "low" or "high"`

              指定用户指定的图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_file"`

            始终 `image_file`.

            - `"image_file"`

        - `ImageURLContentBlock object { image_url, type }`

          引用消息内容中的图像 URL。

          - `image_url: ImageURL`

            - `url: string`

              图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

        - `TextContentBlockParam object { text, type }`

          消息中包含的文本内容。

          - `text: string`

            要发送给模型的文本内容

          - `type: "text"`

            始终 `text`.

            - `"text"`

    - `role: "user" or "assistant"`

      创建消息的实体角色。允许的值包括：

      - `user`：表示消息由实际用户发送，在大多数情况下应用于代表用户生成的消息。
      - `assistant`：表示消息由助手生成。使用此值可将助手消息插入对话中。

      - `"user"`

      - `"assistant"`

    - `attachments: optional array of object { file_id, tools }  or null`

      附加到消息的文件列表，以及应将其添加到的工具。

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

      可附加到对象的一组 16 个键值对。这可以
      用于以结构化格式存储有关对象的额外信息，
      以及通过 API 或仪表盘查询对象。

      键为字符串，最大长度为 64 个字符。值为字符串，
      最大长度为 512 个字符。

  - `metadata: optional Metadata or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储有关对象的额外信息，
    以及通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    长度上限为 512 个字符。

  - `tool_resources: optional object { code_interpreter, file_search }  or null`

    一组在此线程中提供给助手工具使用的资源。这些资源因工具类型而异。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一组 [file](/docs/api-reference/files) ID，提供给 `code_interpreter` 工具。与该工具关联的文件最多可以有 20 个。

    - `file_search: optional object { vector_store_ids, vector_stores }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。附加到线程的向量存储最多可以有 1 个。

      - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

        一个辅助工具，用于创建一个 [vector store](/docs/api-reference/vector-stores/object) ，包含 file_ids 并附加到此线程。附加到线程的向量存储最多可以有 1 个。

        - `chunking_strategy: optional object { type }  or object { static, type }`

          用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

          - `Auto object { type }`

            默认策略。此策略当前使用 `max_chunk_size_tokens` ，大小为 `800` 和 `chunk_overlap_tokens` ，大小为 `400`.

            - `type: "auto"`

              始终 `auto`.

              - `"auto"`

          - `Static object { static, type }`

            - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

              - `chunk_overlap_tokens: number`

                块之间重叠的令牌数量。默认值为 `400`.

                请注意，重叠部分不得超过 `max_chunk_size_tokens`.

              - `max_chunk_size_tokens: number`

                每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

            - `type: "static"`

              始终 `static`.

              - `"static"`

        - `file_ids: optional array of string`

          一个 [file](/docs/api-reference/files) ID 列表，用于添加到向量存储中。对于 2025 年 11 月之前创建的向量存储，一个向量存储中最多可以有 10,000 个文件。对于 2025 年 11 月起创建的向量存储，限制为 100,000,000 个文件。

        - `metadata: optional Metadata or null`

          可附加到对象上的 16 个键值对集合。这可以
          用于以结构化格式存储有关对象的额外信息，并通过
          API 或仪表板查询对象。

          键为字符串，最大长度为 64 个字符。值为字符串，
          最大长度为 512 个字符。

- `tool_choice: optional AssistantToolChoiceOption or null`

  控制模型调用哪个（如果有）工具。
  `none` 意味着模型不会调用任何工具，而是生成一条消息。
  `auto` 是默认值，意味着模型可以选择生成消息或调用一个或多个工具。
  `required` 意味着模型在响应用户之前必须调用一个或多个工具。
  指定特定工具，例如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  - `"none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间选择。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

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

        要调用的函数的名称。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组由助理工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      文件 [文件](/docs/api-reference/files) ID 列表，供 `code_interpreter` 工具使用。与该工具关联的文件最多可有 20 个。

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      附加到此助理的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。附加到该助理的向量存储最多可有 1 个。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool or null`

  覆盖此运行中助理可以使用的工具。这对于按运行修改行为很有用。

  - `CodeInterpreterTool object { type }`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      正在定义的工具类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      文件搜索工具的覆盖设置。

      - `max_num_results: optional number`

        文件搜索工具应输出的最大结果数。默认值为20，适用于 `gpt-4*` 模型，以及5，适用于 `gpt-3.5-turbo`。此数字应在1到50之间（含1和50）。

        请注意，文件搜索工具可能输出少于 `max_num_results` 个结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且score_threshold为0。

        请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须由a-z、A-Z、0-9组成，或包含下划线和短划线，最大长度为64。

      - `description: optional string`

        函数功能的描述，模型使用它来选择何时以及如何调用函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以JSON Schema对象形式描述。请参阅 [指南](/docs/guides/function-calling) 查看示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解有关该格式的文档。

        省略 `parameters` 定义了一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格模式以符合架构。如果设为 true，模型将遵循 `parameters` 字段中定义的精确架构。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。有关结构化输出的更多信息，请参阅 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样，模型考虑具有 top_p 概率质量的 token 的结果。因此 0.1 表示仅考虑包含前 10% 概率质量的 token。

  我们通常建议仅调整此参数或温度，不要同时调整两者。

- `truncation_strategy: optional object { type, last_messages }  or null`

  控制在线程中运行之前如何截断线程。使用此参数控制运行的初始上下文窗口。

  - `type: "auto" or "last_messages"`

    用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适配模型的上下文长度， `max_prompt_tokens`.

    - `"auto"`

    - `"last_messages"`

  - `last_messages: optional number or null`

    构建运行上下文时，从线程中获取的最近消息数量。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [线程](/docs/api-reference/threads).

  - `id: string`

    上的执行运行。该标识符可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [助手](/docs/api-reference/assistants) 的ID。

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

    关于运行为何不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指向运行过程中达到的特定令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 所使用的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      其中之一是 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

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

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储关于对象的额外信息，
    并可通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。
    （接上行）

  - `model: string`

    本次运行所使用的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) ，在工具使用期间。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需采取的操作的详细信息。如果无需操作，则为 `null` null。

    - `submit_tool_outputs: object { tool_calls }`

      为继续本次运行所需的工具输出的详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你在使用 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          需要输出的工具调用类型。目前，此值始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，此值始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自此以来的所有 GPT-3.5 Turbo 模型 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 模式。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还应通过系统或用户消息指示模型自行生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到 token 限制，导致长时间运行且看似“卡住”的请求。另请注意，消息内容可能会被部分截断，如果 `finish_reason="length"`，表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

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
      对于支持该格式的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON
      。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循定义的精确架构
          在 `schema` 字段中。当启用
          `strict` 时，仅支持 JSON Schema 的子集。 `true`。要了解更多信息，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式类型。始终 `json_schema`.

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

    作为本次运行的一部分执行的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。
    指定特定工具如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

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

    用于此运行的工具列表， [智能体](/docs/api-reference/assistants) 用于此运行。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。此数字应介于 1 和 50 之间（含边界）。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 所请求的数量。有关详细信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

          有关更多信息，请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，由模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式的相关文档。

          省略 `parameters` 定义了一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循在 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        所定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行之前如何截断线程。使用此参数控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被删除，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在构建运行的上下文时，从线程中取最近的若干条消息。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行不处于终止状态（即 `null` ，该值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，默认值为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，默认值为 1。

### 示例

```http
curl https://api.openai.com/v1/threads/runs \
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
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "assistant_id": "asst_abc123",
      "thread": {
        "messages": [
          {"role": "user", "content": "Explain deep learning to a 5 year old."}
        ]
      }
    }'
```

#### 响应

```json
{
  "id": "run_abc123",
  "object": "thread.run",
  "created_at": 1699076792,
  "assistant_id": "asst_abc123",
  "thread_id": "thread_abc123",
  "status": "queued",
  "started_at": null,
  "expires_at": 1699077392,
  "cancelled_at": null,
  "failed_at": null,
  "completed_at": null,
  "required_action": null,
  "last_error": null,
  "model": "gpt-4o",
  "instructions": "You are a helpful assistant.",
  "tools": [],
  "tool_resources": {},
  "metadata": {},
  "temperature": 1.0,
  "top_p": 1.0,
  "max_completion_tokens": null,
  "max_prompt_tokens": null,
  "truncation_strategy": {
    "type": "auto",
    "last_messages": null
  },
  "incomplete_details": null,
  "usage": null,
  "response_format": "auto",
  "tool_choice": "auto",
  "parallel_tool_calls": true
}
```

### 流式输出

```http
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_123",
    "thread": {
      "messages": [
        {"role": "user", "content": "Hello"}
      ]
    },
    "stream": true
  }'
```

#### 响应

```json
event: thread.created
data: {"id":"thread_123","object":"thread","created_at":1710348075,"metadata":{}}

event: thread.run.created
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"tool_resources":{},"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}

event: thread.run.queued
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"tool_resources":{},"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}

event: thread.run.in_progress
data: {"id":"run_123","object":"thread.run","created_at":1710348075,"assistant_id":"asst_123","thread_id":"thread_123","status":"in_progress","started_at":null,"expires_at":1710348675,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"tool_resources":{},"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}

event: thread.run.step.created
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.run.step.in_progress
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":null}

event: thread.message.created
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[], "metadata":{}}

event: thread.message.in_progress
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"in_progress","incomplete_details":null,"incomplete_at":null,"completed_at":null,"role":"assistant","content":[], "metadata":{}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"Hello","annotations":[]}}]}}

...

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":" today"}}]}}

event: thread.message.delta
data: {"id":"msg_001","object":"thread.message.delta","delta":{"content":[{"index":0,"type":"text","text":{"value":"?"}}]}}

event: thread.message.completed
data: {"id":"msg_001","object":"thread.message","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","run_id":"run_123","status":"completed","incomplete_details":null,"incomplete_at":null,"completed_at":1710348077,"role":"assistant","content":[{"type":"text","text":{"value":"Hello! How can I assist you today?","annotations":[]}}], "metadata":{}}

event: thread.run.step.completed
data: {"id":"step_001","object":"thread.run.step","created_at":1710348076,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"message_creation","status":"completed","cancelled_at":null,"completed_at":1710348077,"expires_at":1710348675,"failed_at":null,"last_error":null,"step_details":{"type":"message_creation","message_creation":{"message_id":"msg_001"}},"usage":{"prompt_tokens":20,"completion_tokens":11,"total_tokens":31}}

event: thread.run.completed
{"id":"run_123","object":"thread.run","created_at":1710348076,"assistant_id":"asst_123","thread_id":"thread_123","status":"completed","started_at":1713226836,"expires_at":null,"cancelled_at":null,"failed_at":null,"completed_at":1713226837,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":{"prompt_tokens":345,"completion_tokens":11,"total_tokens":356},"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}

event: done
data: [DONE]
```

### 带函数的流式输出

```http
curl https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "assistant_id": "asst_abc123",
    "thread": {
      "messages": [
        {"role": "user", "content": "What is the weather like in San Francisco?"}
      ]
    },
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
event: thread.created
data: {"id":"thread_123","object":"thread","created_at":1710351818,"metadata":{}}

event: thread.run.created
data: {"id":"run_123","object":"thread.run","created_at":1710351818,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710352418,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.queued
data: {"id":"run_123","object":"thread.run","created_at":1710351818,"assistant_id":"asst_123","thread_id":"thread_123","status":"queued","started_at":null,"expires_at":1710352418,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.in_progress
data: {"id":"run_123","object":"thread.run","created_at":1710351818,"assistant_id":"asst_123","thread_id":"thread_123","status":"in_progress","started_at":1710351818,"expires_at":1710352418,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":null,"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":null,"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: thread.run.step.created
data: {"id":"step_001","object":"thread.run.step","created_at":1710351819,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"tool_calls","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710352418,"failed_at":null,"last_error":null,"step_details":{"type":"tool_calls","tool_calls":[]},"usage":null}

event: thread.run.step.in_progress
data: {"id":"step_001","object":"thread.run.step","created_at":1710351819,"run_id":"run_123","assistant_id":"asst_123","thread_id":"thread_123","type":"tool_calls","status":"in_progress","cancelled_at":null,"completed_at":null,"expires_at":1710352418,"failed_at":null,"last_error":null,"step_details":{"type":"tool_calls","tool_calls":[]},"usage":null}

event: thread.run.step.delta
data: {"id":"step_001","object":"thread.run.step.delta","delta":{"step_details":{"type":"tool_calls","tool_calls":[{"index":0,"id":"call_XXNp8YGaFrjrSjgqxtC8JJ1B","type":"function","function":{"name":"get_current_weather","arguments":"","output":null}}]}}}

event: thread.run.step.delta
data: {"id":"step_001","object":"thread.run.step.delta","delta":{"step_details":{"type":"tool_calls","tool_calls":[{"index":0,"type":"function","function":{"arguments":"{\""}}]}}}

event: thread.run.step.delta
data: {"id":"step_001","object":"thread.run.step.delta","delta":{"step_details":{"type":"tool_calls","tool_calls":[{"index":0,"type":"function","function":{"arguments":"location"}}]}}}

...

event: thread.run.step.delta
data: {"id":"step_001","object":"thread.run.step.delta","delta":{"step_details":{"type":"tool_calls","tool_calls":[{"index":0,"type":"function","function":{"arguments":"ahrenheit"}}]}}}

event: thread.run.step.delta
data: {"id":"step_001","object":"thread.run.step.delta","delta":{"step_details":{"type":"tool_calls","tool_calls":[{"index":0,"type":"function","function":{"arguments":"\"}"}}]}}}

event: thread.run.requires_action
data: {"id":"run_123","object":"thread.run","created_at":1710351818,"assistant_id":"asst_123","thread_id":"thread_123","status":"requires_action","started_at":1710351818,"expires_at":1710352418,"cancelled_at":null,"failed_at":null,"completed_at":null,"required_action":{"type":"submit_tool_outputs","submit_tool_outputs":{"tool_calls":[{"id":"call_XXNp8YGaFrjrSjgqxtC8JJ1B","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\":\"San Francisco, CA\",\"unit\":\"fahrenheit\"}"}}]}},"last_error":null,"model":"gpt-4o","instructions":null,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather in a given location","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and state, e.g. San Francisco, CA"},"unit":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location"]}}}],"metadata":{},"temperature":1.0,"top_p":1.0,"max_completion_tokens":null,"max_prompt_tokens":null,"truncation_strategy":{"type":"auto","last_messages":null},"incomplete_details":null,"usage":{"prompt_tokens":345,"completion_tokens":11,"total_tokens":356},"response_format":"auto","tool_choice":"auto","parallel_tool_calls":true}}

event: done
data: [DONE]
```

## 删除线程

**删除** `/threads/{thread_id}`

删除一个线程。

### 路径参数

- `thread_id: string`

### 返回

- `ThreadDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.deleted"`

    - `"thread.deleted"`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread.deleted",
  "deleted": true
}
```

## 检索线程

**get** `/threads/{thread_id}`

检索一个线程。

### 路径参数

- `thread_id: string`

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含 [messages](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建线程时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储有关对象的额外信息，并通过
    API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    一组资源，可供此线程中智能体的工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [file](/docs/api-reference/files) 工具使用的 `code_interpreter` ID 列表。与该工具关联的文件最多可达 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。附加到线程的向量存储最多可达 1 个。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "metadata": {
    "foo": "string"
  },
  "object": "thread",
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
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {
    "code_interpreter": {
      "file_ids": []
    }
  }
}
```

## 修改线程

**post** `/threads/{thread_id}`

修改一个线程。

### 路径参数

- `thread_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  一组最多 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储有关对象的附加信息，
  以及通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组资源，用于在此线程中提供给助手的工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      可供 [文件](/docs/api-reference/files) 工具使用的 ID 列表。最多可有 20 个文件与该工具关联。 `code_interpreter` 工具使用的 ID 列表。最多可有 20 个文件与该工具关联。

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此线程。最多可有 1 个向量存储附加到该线程。

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含 [messages](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建线程时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的一组 16 个键值对。这可
    用于以结构化格式存储有关对象的额外信息，
    以及通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    一组资源，可供智能体的工具在此线程中使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可用于 [file](/docs/api-reference/files) 工具的 `code_interpreter` ID 列表。最多可有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。最多可有 1 个向量存储附加到该线程。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "metadata": {
    "foo": "string"
  },
  "object": "thread",
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
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {
    "modified": "true",
    "user": "abc123"
  },
  "tool_resources": {}
}
```

## 领域类型

### 助手响应格式选项

- `AssistantResponseFormatOption = "auto" or ResponseFormatText or ResponseFormatJSONObject or ResponseFormatJSONSchema`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。详见 [结构化输出指南](/docs/guides/structured-outputs).

  设置 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息亲自指示模型生成 JSON。不这样做，模型可能会生成无休止的空格，直到生成达到令牌限制，导致长时间运行且看似“卡住”的请求。另请注意，如果 `finish_reason="length"`，消息内容可能会部分截断，这表明生成超出 `max_tokens` 或对话超出最大上下文长度。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义的响应格式的类型。始终 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。生成 JSON 响应的较旧方法。
    使用 `json_schema` 建议在支持该功能的模型上使用。请注意，
    如果没有系统或用户消息指示模型生成 JSON，模型将不会生成
    JSON。

    - `type: "json_object"`

      所定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短横线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型将使用该描述来
        确定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象形式描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的 schema 遵循。
        如果设置为 true，模型将始终遵循定义的确切 schema
        ，即在 `schema` 字段中。当
        `strict` 为 `true`。要了解更多，请阅读 [Structured Outputs
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式类型。始终 `json_schema`.

      - `"json_schema"`

### 助手工具选择

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

### 助手工具选择函数

- `AssistantToolChoiceFunction object { name }`

  - `name: string`

    要调用的函数名称。

### 助手工具选择选项

- `AssistantToolChoiceOption = "none" or "auto" or "required" or AssistantToolChoice`

  控制模型是否调用工具（如果有的话）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 是默认值，表示模型可以选择生成一条消息或调用一个或多个工具。
  `required` 表示模型必须在响应用户之前调用一个或多个工具。
  指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

  - `"none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成一条消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

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

        要调用的函数的名称。

### 线程

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含 [messages](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组可附加到对象的 16 个键值对。这可以
    用于以结构化方式存储有关对象的附加信息，
    并可通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    一组资源，可供此线程中助理的工具使用。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可供 [file](/docs/api-reference/files) 工具使用的 `code_interpreter` ID。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。附加到线程的向量存储最多可有 1 个。

### 线程已删除

- `ThreadDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.deleted"`

    - `"thread.deleted"`

# 消息

## 创建消息

**post** `/threads/{thread_id}/messages`

创建一条消息。

### 路径参数

- `thread_id: string`

### 请求体参数

- `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

  消息的文本内容。

  - `TextContent = string`

    消息的文本内容。

  - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    内容部件数组，每个部件具有定义的类型，类型可以是 `text` 或图像可通过 `image_url` 或 `image_file`。传递。图像类型仅在 [视觉兼容模型](/docs/models).

    - `ImageFileContentBlock object { image_file, type }`

      引用一张图像 [文件](/docs/api-reference/files) 在消息内容中。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 在上传文件时，以便之后显示文件内容。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      在消息内容中引用一个图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlockParam object { text, type }`

      消息中的文本内容。

      - `text: string`

        要发送给模型的文本内容

      - `type: "text"`

        始终 `text`.

        - `"text"`

- `role: "user" or "assistant"`

  创建消息的实体角色。允许的值包括：

  - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
  - `assistant`：表示消息由助手生成。使用此值可将助手消息插入对话中。

  - `"user"`

  - `"assistant"`

- `attachments: optional array of object { file_id, tools }  or null`

  附加到消息的文件列表，以及应添加这些文件的工具。

  - `file_id: optional string`

    要附加到消息的文件ID。

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

  可附加到对象的一组16个键值对。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过API或仪表板查询对象。

  键是字符串，最大长度为64个字符。值是字符串
  ，最大长度为512个字符。

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示某个 [线程](/docs/api-reference/threads).

  - `id: string`

    中的消息。该标识符可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，编写此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

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

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，由文本和/或图像组成的数组。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [文件](/docs/api-reference/files) 图像。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。上传文件时，如果之后需要显示文件内容，请设置 `purpose="vision"` 此值。

        - `detail: optional "auto" or "low" or "high"`

          如果由用户指定，则指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`.

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

          图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成的文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的附加信息，
    以及通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度为
    512 个字符的字符串。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    产生消息的实体。可能是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与此消息创建关联的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，该值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "content": "string",
          "role": "user"
        }'
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }'
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1713226573,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
```

## 删除消息

**删除** `/threads/{thread_id}/messages/{message_id}`

删除一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 返回

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.message.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message.deleted",
  "deleted": true
}
```

## 列出消息

**get** `/threads/{thread_id}/messages`

返回指定线程的消息列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，则后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  要返回的对象数量限制。限制范围可以在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

- `run_id: optional string`

  按生成消息的运行 ID 筛选消息。

### 返回

- `data: array of Message`

  - `id: string`

    可在 API 端点中引用的标识符。

  - `assistant_id: string or null`

    如适用， [assistant](/docs/api-reference/assistants) 的 ID，即创作此消息的助手。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及这些文件被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          所定义工具的类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          所定义工具的类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，以文本和/或图像的数组形式呈现。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [File](/docs/api-reference/files) 图像对象。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [File](/docs/api-reference/files) 消息内容中图像的 ID。上传 File 时设置 `purpose="vision"` ，以便后续需要显示文件内容时可以使用。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定了图像的详细级别，则指定该级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终为 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的令牌，你可以选择高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引用。当助手使用 "file_search" 工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_citation"`

              始终为 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                所生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要被替换的文本。

            - `type: "file_path"`

              始终为 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终为 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（秒）。

  - `incomplete_at: number or null`

    消息标记为不完整时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储有关该对象的额外信息，并通过以下方式查询对象
    API 或仪表板。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    产生该消息的实体。以下之一： `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与消息创建相关的 [run](/docs/api-reference/runs) 的 ID。值为 `null` 当使用创建消息或创建线程端点手动创建消息时。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`, 或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) 此消息所属的 ID。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages \
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
      "attachments": [
        {
          "file_id": "file_id",
          "tools": [
            {
              "type": "code_interpreter"
            }
          ]
        }
      ],
      "completed_at": 0,
      "content": [
        {
          "image_file": {
            "file_id": "file_id",
            "detail": "auto"
          },
          "type": "image_file"
        }
      ],
      "created_at": 0,
      "incomplete_at": 0,
      "incomplete_details": {
        "reason": "content_filter"
      },
      "metadata": {
        "foo": "string"
      },
      "object": "thread.message",
      "role": "user",
      "run_id": "run_id",
      "status": "in_progress",
      "thread_id": "thread_id"
    }
  ],
  "first_id": "msg_abc123",
  "has_more": false,
  "last_id": "msg_abc123",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages \
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
      "id": "msg_abc123",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "How does AI work? Explain it in simple terms.",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    },
    {
      "id": "msg_abc456",
      "object": "thread.message",
      "created_at": 1699016383,
      "assistant_id": null,
      "thread_id": "thread_abc123",
      "run_id": null,
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": {
            "value": "Hello, what is AI?",
            "annotations": []
          }
        }
      ],
      "attachments": [],
      "metadata": {}
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc456",
  "has_more": false
}
```

## 检索消息

**get** `/threads/{thread_id}/messages/{message_id}`

获取一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [线程](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，表示创建此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要将此文件添加到的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          要定义的工具类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          要定义的工具类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，以文本和/或图像的数组形式表示。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的图像 [文件](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。如果你需要稍后显示文件内容，请在上传文件时设置 `purpose="vision"` 。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定了图片，则指定图片的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率，通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      在消息内容中引用一个图片 URL。

      - `image_url: ImageURL`

        - `url: string`

          图片的外部 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图片的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      消息中作为一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引文，指向与助手或消息关联的特定文件中的特定引用。当助手使用"file_search"工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引文来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用了 `code_interpreter` 工具生成文件时，生成的文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                已生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，提供消息不完整原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化方式存储有关对象的附加信息，
    并可通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与之关联的 [run](/docs/api-reference/runs) 的 ID。值为 `null` 当消息通过创建消息或创建线程端点手动创建时。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) 此消息所属的 ID。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "assistant_id": "assistant_id",
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "attachments": [],
  "metadata": {}
}
```

## 修改消息

**post** `/threads/{thread_id}/messages/{message_id}`

修改一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  一组最多 16 个键值对，可附加到对象上。这在
  以结构化格式存储有关对象的额外信息，并通过
  API 或仪表板查询对象时非常有用。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

### 返回

- `Message object { id, assistant_id, attachments, 11 more }`

  表示一个 [线程](/docs/api-reference/threads).

  - `id: string`

    中的消息。标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如适用，创建此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

    - `file_id: optional string`

      要附加到消息的文件的 ID。

    - `tools: optional array of CodeInterpreterTool or object { type }`

      要添加此文件的工具。

      - `CodeInterpreterTool object { type }`

        - `type: "code_interpreter"`

          所定义工具的类型： `code_interpreter`

          - `"code_interpreter"`

      - `FileSearchTool object { type }`

        - `type: "file_search"`

          所定义工具的类型： `file_search`

          - `"file_search"`

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，以文本和/或图像的数组形式呈现。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的图像 [文件](/docs/api-reference/files) 。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。上传文件时设置 `purpose="vision"` ，以便稍后显示文件内容。

        - `detail: optional "auto" or "low" or "high"`

          若用户指定，则表示图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率，通过 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

    - `ImageURLContentBlock object { image_url, type }`

      引用消息内容中的图像 URL。

      - `image_url: ImageURL`

        - `url: string`

          图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息相关联的特定文件中的特定引文。当助手使用 "file_search" 工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成的文件 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成文件的 ID。

            - `start_index: number`

            - `text: string`

              消息内容中需要替换的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（以秒为单位）。

  - `incomplete_at: number or null`

    消息标记为不完整时的 Unix 时间戳（以秒为单位）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因详情。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与创建此消息相关的 [运行](/docs/api-reference/runs) 的 ID。当使用创建消息或创建线程端点手动创建消息时，该值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [线程](/docs/api-reference/threads) ID，此消息所属。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
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
  "attachments": [
    {
      "file_id": "file_id",
      "tools": [
        {
          "type": "code_interpreter"
        }
      ]
    }
  ],
  "completed_at": 0,
  "content": [
    {
      "image_file": {
        "file_id": "file_id",
        "detail": "auto"
      },
      "type": "image_file"
    }
  ],
  "created_at": 0,
  "incomplete_at": 0,
  "incomplete_details": {
    "reason": "content_filter"
  },
  "metadata": {
    "foo": "string"
  },
  "object": "thread.message",
  "role": "user",
  "run_id": "run_id",
  "status": "in_progress",
  "thread_id": "thread_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message",
  "created_at": 1699017614,
  "assistant_id": null,
  "thread_id": "thread_abc123",
  "run_id": null,
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": {
        "value": "How does AI work? Explain it in simple terms.",
        "annotations": []
      }
    }
  ],
  "file_ids": [],
  "metadata": {
    "modified": "true",
    "user": "abc123"
  }
}
```

## 领域类型

### 文件引用注释

- `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

  消息中的一条引用，指向与助手或消息关联的特定文件中的具体引文。当助手使用“文件搜索”工具搜索文件时生成。

  - `end_index: number`

  - `file_citation: object { file_id }`

    - `file_id: string`

      该引用来源的特定文件的 ID。

  - `start_index: number`

  - `text: string`

    消息内容中需要替换的文本。

  - `type: "file_citation"`

    始终 `file_citation`.

    - `"file_citation"`

### 文件引用增量注释

- `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

  消息中的一条引用，指向与助手或消息关联的特定文件中的具体引文。当助手使用“file_search”工具搜索文件时生成。

  - `index: number`

    注解在文本内容部分中的索引。

  - `type: "file_citation"`

    始终 `file_citation`.

    - `"file_citation"`

  - `end_index: optional number`

  - `file_citation: optional object { file_id, quote }`

    - `file_id: optional string`

      引用来源的特定文件的ID。

    - `quote: optional string`

      文件中的具体引用内容。

  - `start_index: optional number`

  - `text: optional string`

    消息内容中需要被替换的文本。

### 文件路径注释

- `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

  助手使用该工具生成文件时，生成文件的 URL。 `code_interpreter` 工具生成文件时，生成文件的 URL。

  - `end_index: number`

  - `file_path: object { file_id }`

    - `file_id: string`

      所生成文件的 ID。

  - `start_index: number`

  - `text: string`

    消息内容中需要替换的文本。

  - `type: "file_path"`

    始终 `file_path`.

    - `"file_path"`

### 文件路径增量注解

- `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

  当助手使用 `code_interpreter` 工具生成文件时生成的文件 URL。

  - `index: number`

    文本内容部分中注释的索引。

  - `type: "file_path"`

    始终 `file_path`.

    - `"file_path"`

  - `end_index: optional number`

  - `file_path: optional object { file_id }`

    - `file_id: optional string`

      生成的文件的 ID。

  - `start_index: optional number`

  - `text: optional string`

    消息内容中需要替换的文本。

### 图像文件

- `ImageFile object { file_id, detail }`

  - `file_id: string`

    该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。设置 `purpose="vision"` 上传文件时设置，以便后续显示文件内容。

  - `detail: optional "auto" or "low" or "high"`

    如果由用户指定，则指定图片的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

### 图像文件内容块

- `ImageFileContentBlock object { image_file, type }`

  引用一张图片 [文件](/docs/api-reference/files) 在消息内容中。

  - `image_file: ImageFile`

    - `file_id: string`

      该 [文件](/docs/api-reference/files) 消息内容中图片的 ID。在上传文件时设置 `purpose="vision"` ，以便日后需要显示文件内容时使用。

    - `detail: optional "auto" or "low" or "high"`

      指定用户要求时的图片细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_file"`

    始终 `image_file`.

    - `"image_file"`

### 图像文件增量

- `ImageFileDelta object { detail, file_id }`

  - `detail: optional "auto" or "low" or "high"`

    指定用户设置图像时所需的细节级别。 `low` 使用的令牌更少，你可以选择启用高分辨率 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

  - `file_id: optional string`

    该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 在需要稍后显示文件内容时，上传文件时进行设置。

### 图像文件增量块

- `ImageFileDeltaBlock object { index, type, image_file }`

  引用一张图片 [File](/docs/api-reference/files) 位于消息内容中。

  - `index: number`

    消息中内容部分的索引。

  - `type: "image_file"`

    总是 `image_file`.

    - `"image_file"`

  - `image_file: optional ImageFileDelta`

    - `detail: optional "auto" or "low" or "high"`

      如果用户指定，指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `file_id: optional string`

      该 [File](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 上传 File 时，如果之后需要显示文件内容。

### 图片 URL

- `ImageURL object { url, detail }`

  - `url: string`

    图片的外部 URL，必须为受支持的图片类型：jpeg、jpg、png、gif、webp。

  - `detail: optional "auto" or "low" or "high"`

    指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率，通过 `high`。默认值为 `auto`

    - `"auto"`

    - `"low"`

    - `"high"`

### 图片 URL 内容块

- `ImageURLContentBlock object { image_url, type }`

  在消息内容中引用一个图像 URL。

  - `image_url: ImageURL`

    - `url: string`

      图像的外部 URL，必须为受支持的图像类型：jpeg、jpg、png、gif、webp。

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。 `low` 使用较少的 token，你可以选择使用高分辨率 `high`。默认值为 `auto`

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    内容部分的类型。

    - `"image_url"`

### 图像 URL Delta

- `ImageURLDelta object { detail, url }`

  - `detail: optional "auto" or "low" or "high"`

    指定图像的细节级别。 `low` 使用的令牌更少，你可以选择使用高分辨率 `high`.

    - `"auto"`

    - `"low"`

    - `"high"`

  - `url: optional string`

    图像的 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

### 图像 URL 增量块

- `ImageURLDeltaBlock object { index, type, image_url }`

  在消息内容中引用图像 URL。

  - `index: number`

    消息中内容部分的索引。

  - `type: "image_url"`

    始终 `image_url`.

    - `"image_url"`

  - `image_url: optional ImageURLDelta`

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率 `high`.

      - `"auto"`

      - `"low"`

      - `"high"`

    - `url: optional string`

      图像的 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

### 消息

- `Message object { id, assistant_id, attachments, 11 more }`

  表示 [线程](/docs/api-reference/threads).

  - `id: string`

    中的一条消息。标识符，可在 API 端点中引用。

  - `assistant_id: string or null`

    如果适用，创建此消息的 [助手](/docs/api-reference/assistants) 的 ID。

  - `attachments: array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及它们被添加到的工具。

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

  - `completed_at: number or null`

    消息完成时的 Unix 时间戳（以秒为单位）。

  - `content: array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlock or RefusalContentBlock`

    消息的内容，以文本和/或图像的数组形式表示。

    - `ImageFileContentBlock object { image_file, type }`

      引用消息内容中的 [文件](/docs/api-reference/files) 图像。

      - `image_file: ImageFile`

        - `file_id: string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。上传文件时设置， `purpose="vision"` 以便日后需要显示文件内容时使用。

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，则指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`.

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

          图像的外部 URL，必须是受支持的图像类型：jpeg、jpg、png、gif、webp。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用高分辨率 `high`。默认值为 `auto`

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

    - `TextContentBlock object { text, type }`

      作为消息一部分的文本内容。

      - `text: Text`

        - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

          - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

            - `end_index: number`

            - `file_citation: object { file_id }`

              - `file_id: string`

                引用来源的特定文件的 ID。

            - `start_index: number`

            - `text: string`

              需要替换的消息内容中的文本。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

          - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

            当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

            - `end_index: number`

            - `file_path: object { file_id }`

              - `file_id: string`

                生成的文件的 ID。

            - `start_index: number`

            - `text: string`

              需要替换的消息内容中的文本。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

        - `value: string`

          构成文本的数据。

      - `type: "text"`

        始终 `text`.

        - `"text"`

    - `RefusalContentBlock object { refusal, type }`

      由助手生成的拒绝内容。

      - `refusal: string`

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

  - `created_at: number`

    消息创建时的 Unix 时间戳（秒）。

  - `incomplete_at: number or null`

    消息被标记为不完整时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    对于不完整的消息，说明消息不完整的原因的详细信息。

    - `reason: "content_filter" or "max_tokens" or "run_cancelled" or 2 more`

      消息不完整的原因。

      - `"content_filter"`

      - `"max_tokens"`

      - `"run_cancelled"`

      - `"run_expired"`

      - `"run_failed"`

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储关于对象的附加信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread.message"`

    对象类型，始终为 `thread.message`.

    - `"thread.message"`

  - `role: "user" or "assistant"`

    生成消息的实体。可以是 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

  - `run_id: string or null`

    与创建此消息相关的 [运行](/docs/api-reference/runs) 的 ID。当通过创建消息或创建线程端点手动创建消息时，值为 `null` 。

  - `status: "in_progress" or "incomplete" or "completed"`

    消息的状态，可以是 `in_progress`, `incomplete`，或 `completed`.

    - `"in_progress"`

    - `"incomplete"`

    - `"completed"`

  - `thread_id: string`

    该 [thread](/docs/api-reference/threads) 此消息所属的ID。

### 消息已删除

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### 消息增量

- `MessageDelta object { content, role }`

  包含消息上已更改字段的增量。

  - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

    消息内容为文本和/或图像的数组。

    - `ImageFileDeltaBlock object { index, type, image_file }`

      引用一个图像 [文件](/docs/api-reference/files) 在消息内容中。

      - `index: number`

        消息中内容部分的索引。

      - `type: "image_file"`

        始终 `image_file`.

        - `"image_file"`

      - `image_file: optional ImageFileDelta`

        - `detail: optional "auto" or "low" or "high"`

          如果用户指定，指定图像的细节级别。 `low` 使用更少的令牌，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_id: optional string`

          该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。设置 `purpose="vision"` 上传文件时，如果日后需要显示文件内容。

    - `TextDeltaBlock object { index, type, text }`

      属于消息一部分的文本内容。

      - `index: number`

        消息中内容部分的索引。

      - `type: "text"`

        始终 `text`.

        - `"text"`

      - `text: optional TextDelta`

        - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

          - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

            消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“文件搜索”工具搜索文件时生成。

            - `index: number`

              文本内容部分中批注的索引。

            - `type: "file_citation"`

              始终 `file_citation`.

              - `"file_citation"`

            - `end_index: optional number`

            - `file_citation: optional object { file_id, quote }`

              - `file_id: optional string`

                引用来源的特定文件的 ID。

              - `quote: optional string`

                文件中的具体引用。

            - `start_index: optional number`

            - `text: optional string`

              消息内容中需要替换的文本。

          - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

            当助手使用 `code_interpreter` 工具生成文件时，所生成文件的 URL。

            - `index: number`

              文本内容部分中注释的索引。

            - `type: "file_path"`

              始终 `file_path`.

              - `"file_path"`

            - `end_index: optional number`

            - `file_path: optional object { file_id }`

              - `file_id: optional string`

                生成的文件的 ID。

            - `start_index: optional number`

            - `text: optional string`

              消息内容中需要替换的文本。

        - `value: optional string`

          构成文本的数据。

    - `RefusalDeltaBlock object { index, type, refusal }`

      消息中包含的拒绝内容。

      - `index: number`

        消息中拒绝部分的索引。

      - `type: "refusal"`

        始终 `refusal`.

        - `"refusal"`

      - `refusal: optional string`

    - `ImageURLDeltaBlock object { index, type, image_url }`

      引用消息内容中的图像 URL。

      - `index: number`

        消息中内容部分的索引。

      - `type: "image_url"`

        始终 `image_url`.

        - `"image_url"`

      - `image_url: optional ImageURLDelta`

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `url: optional string`

          图像的 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

  - `role: optional "user" or "assistant"`

    产生消息的实体。其一为 `user` 或 `assistant`.

    - `"user"`

    - `"assistant"`

### 消息增量事件

- `MessageDeltaEvent object { id, delta, object }`

  表示消息增量，即流式传输期间消息上任何已更改的字段。

  - `id: string`

    消息的标识符，可在 API 端点中引用。

  - `delta: MessageDelta`

    包含消息上已更改字段的增量。

    - `content: optional array of ImageFileDeltaBlock or TextDeltaBlock or RefusalDeltaBlock or ImageURLDeltaBlock`

      消息的内容，以文本和/或图像的数组形式呈现。

      - `ImageFileDeltaBlock object { index, type, image_file }`

        引用消息内容中的 [File](/docs/api-reference/files) 图像。

        - `index: number`

          消息中内容部分的索引。

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

        - `image_file: optional ImageFileDelta`

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定，指定图像的细节级别。 `low` 使用较少的令牌，你可以选择使用 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_id: optional string`

            该 [File](/docs/api-reference/files) 消息内容中图像的 ID。 `purpose="vision"` 上传文件时设置，以便在之后显示文件内容。

      - `TextDeltaBlock object { index, type, text }`

        作为消息一部分的文本内容。

        - `index: number`

          消息中内容部分的索引。

        - `type: "text"`

          始终 `text`.

          - `"text"`

        - `text: optional TextDelta`

          - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

            - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

              消息中的引用，指向与助手或消息关联的特定文件中的特定引用。当助手使用 "file_search" 工具搜索文件时生成。

              - `index: number`

                文本内容部分中注释的索引。

              - `type: "file_citation"`

                始终 `file_citation`.

                - `"file_citation"`

              - `end_index: optional number`

              - `file_citation: optional object { file_id, quote }`

                - `file_id: optional string`

                  引用所来自的特定文件的 ID。

                - `quote: optional string`

                  文件中的具体引用内容。

              - `start_index: optional number`

              - `text: optional string`

                消息内容中需要替换的文本。

            - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

              当助手使用 `code_interpreter` 工具生成文件时，生成文件的 URL。

              - `index: number`

                注释在文本内容部分中的索引。

              - `type: "file_path"`

                始终 `file_path`.

                - `"file_path"`

              - `end_index: optional number`

              - `file_path: optional object { file_id }`

                - `file_id: optional string`

                  已生成文件的 ID。

              - `start_index: optional number`

              - `text: optional string`

                消息内容中需要替换的文本。

          - `value: optional string`

            构成文本的数据。

      - `RefusalDeltaBlock object { index, type, refusal }`

        作为消息一部分的拒绝内容。

        - `index: number`

          拒绝部分在消息中的索引。

        - `type: "refusal"`

          始终 `refusal`.

          - `"refusal"`

        - `refusal: optional string`

      - `ImageURLDeltaBlock object { index, type, image_url }`

        引用消息内容中的图片 URL。

        - `index: number`

          内容部分在消息中的索引。

        - `type: "image_url"`

          始终 `image_url`.

          - `"image_url"`

        - `image_url: optional ImageURLDelta`

          - `detail: optional "auto" or "low" or "high"`

            指定图片的细节级别。 `low` 使用更少的令牌，你可以选择使用 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `url: optional string`

            图片的 URL，必须是支持的图片类型：jpeg、jpg、png、gif、webp。

    - `role: optional "user" or "assistant"`

      产生此消息的实体。取值为 `user` 或 `assistant`.

      - `"user"`

      - `"assistant"`

  - `object: "thread.message.delta"`

    对象类型，始终为 `thread.message.delta`.

    - `"thread.message.delta"`

### 拒绝内容块

- `RefusalContentBlock object { refusal, type }`

  助手生成的拒答内容。

  - `refusal: string`

  - `type: "refusal"`

    始终 `refusal`.

    - `"refusal"`

### 拒绝增量块

- `RefusalDeltaBlock object { index, type, refusal }`

  作为消息一部分的拒绝内容。

  - `index: number`

    消息中拒绝部分在消息中的索引。

  - `type: "refusal"`

    始终 `refusal`.

    - `"refusal"`

  - `refusal: optional string`

### 文本

- `Text object { annotations, value }`

  - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

    - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

      消息中的一条引用，指向与助手或消息关联的特定文件中的具体引文。当助手使用 "file_search" 工具搜索文件时生成。

      - `end_index: number`

      - `file_citation: object { file_id }`

        - `file_id: string`

          引用来源的特定文件的 ID。

      - `start_index: number`

      - `text: string`

        消息内容中需要替换的文本。

      - `type: "file_citation"`

        始终 `file_citation`.

        - `"file_citation"`

    - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

      助手使用 `code_interpreter` 工具生成文件时生成的文件 URL。

      - `end_index: number`

      - `file_path: object { file_id }`

        - `file_id: string`

          生成的文件 ID。

      - `start_index: number`

      - `text: string`

        消息内容中需要替换的文本。

      - `type: "file_path"`

        始终 `file_path`.

        - `"file_path"`

  - `value: string`

    构成文本的数据。

### 文本内容块

- `TextContentBlock object { text, type }`

  消息的一部分文本内容。

  - `text: Text`

    - `annotations: array of FileCitationAnnotation or FilePathAnnotation`

      - `FileCitationAnnotation object { end_index, file_citation, start_index, 2 more }`

        消息中的引用，指向与助手或消息关联的特定文件中的具体引文。当助手使用"file_search"工具搜索文件时生成。

        - `end_index: number`

        - `file_citation: object { file_id }`

          - `file_id: string`

            引用来源的特定文件的ID。

        - `start_index: number`

        - `text: string`

          消息内容中需要替换的文本。

        - `type: "file_citation"`

          始终 `file_citation`.

          - `"file_citation"`

      - `FilePathAnnotation object { end_index, file_path, start_index, 2 more }`

        当助手使用 `code_interpreter` 工具生成文件时生成的文件的URL。

        - `end_index: number`

        - `file_path: object { file_id }`

          - `file_id: string`

            生成的文件ID。

        - `start_index: number`

        - `text: string`

          消息内容中需要替换的文本。

        - `type: "file_path"`

          始终 `file_path`.

          - `"file_path"`

    - `value: string`

      构成文本的数据。

  - `type: "text"`

    始终 `text`.

    - `"text"`

### 文本内容块参数

- `TextContentBlockParam object { text, type }`

  属于消息一部分的文本内容。

  - `text: string`

    要发送给模型的文本内容

  - `type: "text"`

    始终 `text`.

    - `"text"`

### 文本增量

- `TextDelta object { annotations, value }`

  - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

    - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

      消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“file_search”工具搜索文件时生成。

      - `index: number`

        文本内容部分中注释的索引。

      - `type: "file_citation"`

        始终 `file_citation`.

        - `"file_citation"`

      - `end_index: optional number`

      - `file_citation: optional object { file_id, quote }`

        - `file_id: optional string`

          引用来源的特定文件的 ID。

        - `quote: optional string`

          文件中的特定引文。

      - `start_index: optional number`

      - `text: optional string`

        消息内容中需要替换的文本。

    - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

      当助手使用 `code_interpreter` 工具生成文件时，生成的文件的 URL。

      - `index: number`

        文本内容部分中注释的索引。

      - `type: "file_path"`

        始终 `file_path`.

        - `"file_path"`

      - `end_index: optional number`

      - `file_path: optional object { file_id }`

        - `file_id: optional string`

          生成的文件的 ID。

      - `start_index: optional number`

      - `text: optional string`

        消息内容中需要替换的文本。

  - `value: optional string`

    构成文本的数据。

### 文本增量块

- `TextDeltaBlock object { index, type, text }`

  消息中作为组成部分的文本内容。

  - `index: number`

    消息中内容部分的索引。

  - `type: "text"`

    始终 `text`.

    - `"text"`

  - `text: optional TextDelta`

    - `annotations: optional array of FileCitationDeltaAnnotation or FilePathDeltaAnnotation`

      - `FileCitationDeltaAnnotation object { index, type, end_index, 3 more }`

        消息中的引用，指向与助手或消息关联的特定文件中的特定引文。当助手使用“文件搜索”工具搜索文件时生成。

        - `index: number`

          文本内容部分中注释的索引。

        - `type: "file_citation"`

          始终 `file_citation`.

          - `"file_citation"`

        - `end_index: optional number`

        - `file_citation: optional object { file_id, quote }`

          - `file_id: optional string`

            引用来源的特定文件的 ID。

          - `quote: optional string`

            文件中的具体引文。

        - `start_index: optional number`

        - `text: optional string`

          消息内容中需要替换的文本。

      - `FilePathDeltaAnnotation object { index, type, end_index, 3 more }`

        助手使用 `code_interpreter` 工具生成文件时生成的文件的 URL。

        - `index: number`

          文本内容部分中注释的索引。

        - `type: "file_path"`

          始终 `file_path`.

          - `"file_path"`

        - `end_index: optional number`

        - `file_path: optional object { file_id }`

          - `file_id: optional string`

            生成的文件的 ID。

        - `start_index: optional number`

        - `text: optional string`

          消息内容中需要替换的文本。

    - `value: optional string`

      构成文本的数据。

# 运行

## 取消运行

**post** `/threads/{thread_id}/runs/{run_id}/cancel`

取消正在进行的运行 `in_progress`.

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在 [线程](/docs/api-reference/threads).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `assistant_id: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的 ID。

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

    关于运行为何不完整的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指向运行过程中达到的具体 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大补全令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并可通过API或仪表盘查询对象。

    键是字符串，最大长度为64个字符。值是字符串，
    最大长度为512个字符。

  - `model: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详情。若无需操作，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      继续此运行所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你使用 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此 ID。

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

    指定模型必须输出的格式。与 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 起的所有 GPT-3.5 Turbo 模型兼容。启用结构化输出，确保模型匹配你提供的 JSON 模式。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还需通过系统或用户消息自行指示模型生成 JSON。若不如此，模型可能会生成无休止的空白字符，直至生成达到 token 限制，导致请求运行时间过长并看似“卡住”。另请注意，如果消息内容可能被部分截断 `finish_reason="length"`，这表明生成超出了 `max_tokens` 或对话超出了最大上下文长度。

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
      对于支持它的模型，建议使用 `json_schema` 。请注意，如果没有系统或用户消息指示
      模型生成 JSON，该模型将不会生成 JSON
      。

      - `type: "json_object"`

        所定义响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，供模型用于
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象形式描述。
          了解如何构建 JSON schema [请点击此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设为 true，模型将始终遵循
          字段中定义的精确 schema。 `schema` 当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

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

    在此运行中执行 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个工具（如果有）。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

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

    该 [助手](/docs/api-reference/assistants) 用于此运行的工具列表。

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

          请注意，文件搜索工具可能返回少于 `max_num_results` 结果。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须由 a-z、A-Z、0-9 组成，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型根据此描述决定何时以及如何调用函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，并参见 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

          省略 `parameters` 定义了一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段中定义的精确模式。只有 JSON Schema 的一个子集在 `strict` 为 `true`。时受支持。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在线程运行之前如何截断线程。使用此选项来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认是 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在为运行构建上下文时，从线程中获取的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计。如果运行不处于终止状态，此值将为 `null` （即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，默认为 1。

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

创建一个运行。

### 路径参数

- `thread_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要包含在响应中的附加字段列表。目前唯一支持的值为 `step_details.tool_calls[*].file_search.results[*].content` ，用于获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 请求体参数

- `assistant_id: string`

  用于执行此运行所使用的 [assistant](/docs/api-reference/assistants) 的 ID。

- `additional_instructions: optional string or null`

  在运行指令的末尾附加额外的指令。这有助于在不覆盖其他指令的情况下，针对每次运行修改行为。

- `additional_messages: optional array of object { content, role, attachments, metadata }  or null`

  在创建运行之前，向线程添加额外的消息。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      一个内容部分数组，每个部分具有已定义的类型，每个部分可以是 `text` 类型，或者可以通过 `image_url` 或 `image_file`。传递图像。图像类型仅在 [Vision 兼容模型](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        上受支持。引用消息内容中的图像 [文件](/docs/api-reference/files) 。

        - `image_file: ImageFile`

          - `file_id: string`

            该 [文件](/docs/api-reference/files) 消息内容中图像的 ID。在上传 `purpose="vision"` 文件时设置该 ID，以便之后需要显示文件内容时使用。

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定了图像，则指定图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        引用消息内容中的图像 URL。

        - `image_url: ImageURL`

          - `url: string`

            图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。 `low` 使用更少的 token，你可以选择使用高分辨率 `high`。默认值为 `auto`

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
    用于以结构化格式存储有关对象的附加信息，
    并可通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

- `instructions: optional string or null`

  覆盖 [instructions](/docs/api-reference/assistants/createAssistant) 助手的指令。这对于在每次运行的基础上修改行为很有用。

- `max_completion_tokens: optional number or null`

  运行过程中可能使用的最大完成令牌数。运行将尽最大努力仅使用指定的完成令牌数，跨运行的多次轮次。如果运行超过指定的完成令牌数，运行将以状态结束 `incomplete`。参见 `incomplete_details` 了解更多信息。

- `max_prompt_tokens: optional number or null`

  运行过程中可能使用的最大提示令牌数。运行将尽最大努力仅使用指定的提示令牌数，跨运行的多次轮次。如果运行超过指定的提示令牌数，运行将以状态结束 `incomplete`。参见 `incomplete_details` 了解更多信息。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这可以
  用于以结构化格式存储有关对象的附加信息，
  并可通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `model: optional string or "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more or null`

  的 ID [Model](/docs/api-reference/models) 用于执行此运行。如果在此处提供了值，它将覆盖与助手的模型相关联的模型。如果没有，则使用与助手关联的模型。

  - `string`

  - `AssistantSupportedModels = "gpt-5" or "gpt-5-mini" or "gpt-5-nano" or 39 more`

    要用于执行此运行的 [模型](/docs/api-reference/models) 的 ID。如果在此处提供了值，它将覆盖与助手的模型相关联的模型。如果没有，则使用与助手关联的模型。

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

  限制推理模型在推理上的努力程度。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  减少推理努力可以产生更快的响应和更少的令牌
  用于响应中的推理。并非所有推理模型都支持每个
  值。参见
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  以了解模型特定的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional AssistantResponseFormatOption or null`

  指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

  设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，可确保模型匹配你提供的 JSON schema。了解更多，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用 JSON 模式，该模式确保模型生成的消息是有效的 JSON。

  **重要：** 使用 JSON 模式时，你 **必须** 通过系统或用户消息指示模型自行生成 JSON。否则，模型可能会生成无尽的空白，直到生成达到 token 限制，导致长时间运行且看似“卡住”的请求。另请注意，如果 `finish_reason="length"`，表示生成超出了 `max_tokens` 或对话超出了最大上下文长度，消息内容可能会被部分截断。

  - `"auto"`

    `auto` 是默认值

    - `"auto"`

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      所定义的响应格式类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。生成 JSON 响应的旧方法。
    对于支持该格式的模型，建议使用 `json_schema` 。请注意，
    模型不会在没有系统或用户消息指示的情况下生成 JSON
    。

    - `type: "json_object"`

      所定义的响应格式类型。始终为 `json_object`.

      - `"json_object"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    详细了解 [结构化输出](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出配置选项，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
        下划线和短横线，最大长度为 64 个字符。

      - `description: optional string`

        对响应格式用途的描述，模型用它来
        确定如何按照该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象形式描述。
        了解如何构建 JSON Schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格模式以严格遵循架构。
        如果设为 true，模型将始终遵循定义的确切架构
        在 `schema` 字段中。设为
        `strict` 时 `true`。仅支持 JSON Schema 的子集。要了解更多信息，请阅读 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

- `stream: optional boolean or null`

  如果 `true`，返回在 Run 执行过程中发生的事件流，作为服务端发送的事件，当 Run 进入终态并附带 `data: [DONE]` 消息时终止。

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使其更集中和确定性。

- `tool_choice: optional AssistantToolChoiceOption or null`

  控制模型调用哪个（如果有）工具。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 是默认值，表示模型可以在生成消息或调用一个或多个工具之间进行选择。
  `required` 表示模型必须在响应用户之前调用一个或多个工具。
  指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  - `"none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

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

        要调用的函数的名称。

- `tools: optional array of CodeInterpreterTool or FileSearchTool or FunctionTool or null`

  覆盖助手在此运行中可使用的工具。这对于按运行修改行为非常有用。

  - `CodeInterpreterTool object { type }`

  - `FileSearchTool object { type, file_search }`

    - `type: "file_search"`

      正在定义的工具的类型： `file_search`

      - `"file_search"`

    - `file_search: optional object { max_num_results, ranking_options }`

      覆盖 文件搜索 工具的设置。

      - `max_num_results: optional number`

        文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`。模型，默认值为5。此数值应在1到50之间（含1和50）。

        请注意，文件搜索工具可能输出少于 `max_num_results` 指定数量的结果。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

      - `ranking_options: optional object { score_threshold, ranker }`

        文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，并将score_threshold设为0。

        参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `score_threshold: number`

          文件搜索的分数阈值。所有值必须是介于0到1之间的浮点数。

        - `ranker: optional "auto" or "default_2024_08_21"`

          用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

          - `"auto"`

          - `"default_2024_08_21"`

  - `FunctionTool object { function, type }`

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为a-z、A-Z、0-9，或包含下划线和连字符，最大长度为64。

      - `description: optional string`

        函数功能的描述，模型据此决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以JSON Schema对象形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，了解该格式的文档。

        省略 `parameters` 定义了一个具有空参数列表的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段中定义的确切模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      正在定义的工具类型： `function`

      - `"function"`

- `top_p: optional number or null`

  一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。因此，0.1 表示仅考虑包含前 10% 概率质量的标记。

  我们通常建议修改此参数或温度，但不要同时修改两者。

- `truncation_strategy: optional object { type, last_messages }  or null`

  控制在线程运行之前如何截断线程。使用此参数控制运行的初始上下文窗口。

  - `type: "auto" or "last_messages"`

    用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

    - `"auto"`

    - `"last_messages"`

  - `last_messages: optional number or null`

    构建运行上下文时，线程中最近消息的数量。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在 [线程](/docs/api-reference/threads).

  - `id: string`

    上的执行运行。可在 API 端点中引用的标识符。

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

    关于运行不完整原因的详细信息。如果 `null` 运行并非不完整，则为 null。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指向运行过程中达到的特定令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后一个错误。如果没有错误，则为 `null` null。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      其中之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    指定在此次运行过程中已使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    指定在此次运行过程中已使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象的一组16个键值对。这可
    用于以结构化格式存储关于对象的额外信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串，
    最大长度为512个字符。

  - `model: string`

    用于此运行的 [assistant](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [parallel function calling](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果无需操作，则为 `null` 。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你使用 [向运行提交工具输出](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数名称。

        - `type: "function"`

          需要输出的工具调用的类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型将匹配你提供的 JSON 模式。了解更多信息，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息亲自指示模型生成 JSON。否则，模型可能会生成无休止的空格流，直到生成达到令牌限制，导致长时间运行且看似“卡住”的请求。另请注意，如果消息内容可能会被部分截断 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种生成 JSON 响应的旧方法。
      对于支持该格式的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      。

      - `type: "json_object"`

        正在定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        的配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短横线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，由模型用来
          确定如何以此格式响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象形式描述。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格架构遵循。
          如果设置为 true，模型将始终遵循定义的确切架构
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式类型。始终 `json_schema`.

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

    作为此运行一部分执行的 [thread](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成消息。
    `auto` 为默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。用于强制模型调用特定工具。

      - `type: "function" or "code_interpreter" or "file_search"`

        工具类型。如果类型为 `function`，则必须设置函数名称

        - `"function"`

        - `"code_interpreter"`

        - `"file_search"`

      - `function: optional AssistantToolChoiceFunction`

        - `name: string`

          要调用的函数名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    用于此运行的 [assistant](/docs/api-reference/assistants) 所使用的工具列表。

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

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须为 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和破折号，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型用于选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 查看示例，并参阅 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 以了解格式的文档说明。

          省略 `parameters` 将定义一个参数列表为空函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设为 true，模型将遵循 `parameters` 字段定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        中所定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行前如何截断线程。使用此设置来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设为 `auto`，时，线程中间的消息将被丢弃，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在为运行构建上下文时，线程中最近消息的数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行不处于终止状态（例如 `null` ，该值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数量。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。若未设置，默认值为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。若未设置，默认值为 1。

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

### 使用函数的流式传输

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

返回属于某个线程的运行列表。

### 路径参数

- `thread_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，你的后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  限制返回的对象数量。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Run`

  - `id: string`

    可在 API 端点中引用的标识符。

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

    关于运行不完整原因的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指出在运行过程中达到了哪个具体的 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    此运行使用的 [assistant](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    指定在整个运行过程中已使用的最大补全令牌数。

  - `max_prompt_tokens: number or null`

    指定在整个运行过程中已使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象上的16组键值对集合。这可用于
    以结构化格式存储有关对象的附加信息，并可通过
    API或仪表板查询对象。

    键为字符串，最大长度为64个字符。值也为字符串，
    最大长度为512个字符。

  - `model: string`

    用于本次运行的 [助手](/docs/api-reference/assistants) 所采用的模型。

  - `object: "thread.run"`

    对象类型，其值始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在使用工具期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    运行继续所需的操作详情。如果无需操作，则为 `null` 空值。

    - `submit_tool_outputs: object { tool_calls }`

      运行继续所需的工具输出详情。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的ID。在提交工具输出时必须引用此ID。请参考 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          所需输出的工具调用类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。更多信息，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 同时通过系统或用户消息自行指示模型生成 JSON。如果不这样做，模型可能会生成无休止的空格流，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，如果 `finish_reason="length"`，消息内容可能会被部分截断，这表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式类型。始终 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      使用 `json_schema` 建议在支持它的模型上使用。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON
      是这样的。

      - `type: "json_object"`

        正在定义的响应格式类型。始终 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      详细了解 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型用它来
          确定如何按该格式响应。

        - `schema: optional map[unknown]`

          响应格式的模式，以 JSON Schema 对象形式描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的模式遵循。
          如果设置为 true，模型将始终遵循定义的确切模式
          在 `schema` 字段中定义。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多信息，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终为 `json_schema`.

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

    作为本次运行的一部分被执行的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型是否调用某个工具以及调用哪个工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以在生成消息或调用一个或多个工具之间进行选择。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定的工具（如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ）会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。

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

    在此运行中 [助手](/docs/api-reference/assistants) 使用的工具列表。

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

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。模型，默认值为 5。此数字应在 1 到 50 之间（含）。

          请注意，文件搜索工具输出的结果可能少于 `max_num_results` 结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。若未指定，文件搜索工具将使用 `auto` 排序器且score_threshold为0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是0到1之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。若未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须是a-z、A-Z、0-9，或包含下划线和短划线，最大长度为64。

        - `description: optional string`

          函数功能的描述，模型用它来决定何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以JSON Schema对象描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema参考](https://json-schema.org/understanding-json-schema/) 了解格式文档。

          省略 `parameters` 则定义一个空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式以符合 schema 要求。若设为 true，模型将严格遵循定义在 `parameters` 字段中的精确 schema。当 `strict` 为 `true`。时仅支持 JSON Schema 的子集。更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制运行前线程如何被截断。使用此选项来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。若设为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设为 `auto`，时，线程中间的消息将被丢弃，以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在构建运行上下文时，从线程中取用的最近消息条数。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计。若运行不处于终态（即 `null` ，此值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      在整个运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      在整个运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核心采样值。如果未设置，默认为 1。

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

**获取** `/threads/{thread_id}/runs/{run_id}`

检索一个运行。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [线程](/docs/api-reference/threads).

  - `id: string`

    上的一次执行运行。标识符，可在 API 端点中引用。

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

    关于运行不完整的详细信息。如果不完整 `null` ，则为空。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指明在运行过程中超出了哪个具体的令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果没有错误， `null` 则为空。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    指定在运行过程中已使用的最大补全令牌数。

  - `max_prompt_tokens: number or null`

    指定在运行过程中已使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可以附加到对象的一组 16 个键值对。这可以
    用于以结构化方式存储有关对象的附加信息，
    以及通过 API 或仪表盘查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度
    为 512 个字符的字符串。

  - `model: string`

    此运行中 [assistant](/docs/api-reference/assistants) 所使用的模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [parallel function calling](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果没有 `null` 需要操作，则此字段为。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出的详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。通过 [将工具输出提交到运行](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传给函数的参数。

          - `name: string`

            函数名称。

        - `type: "function"`

          需要输出的工具调用的类型。目前，这始终是 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，这始终是 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置后 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，确保模型匹配你提供的 JSON 模式。了解更多，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置后 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要提示：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息指示模型自行生成 JSON。若不这样做，模型可能会生成无休止的空白字符，直到生成达到令牌限制，导致请求长时间运行且看似“卡住”。另请注意，如果消息内容可能被部分截断 `finish_reason="length"`，表示生成超出了 `max_tokens` 或对话超出了最大上下文长度。

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
      对于支持它的模型，建议使用 `json_schema` 。请注意，
      模型在没有系统或用户消息指示其
      这样做的情况下，不会生成 JSON。

      - `type: "json_object"`

        所定义响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须是 a-z、A-Z、0-9 或包含
          下划线和破折号，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，供模型用来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的 schema，以 JSON Schema 对象形式描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的 schema 遵循。
          如果设置为 true，模型将始终遵循定义的精确 schema
          在 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [Structured Outputs
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终 `json_schema`.

        - `"json_schema"`

  - `started_at: number or null`

    运行开始时的 Unix 时间戳（秒）。

  - `status: "queued" or "in_progress" or "requires_action" or 6 more`

    运行的状态，可以是 `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, `incomplete`, 或 `expired`.

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

    作为本次运行一部分执行其上的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是直接生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须先调用一个或多个工具，然后才能响应用户。

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

    从此运行中使用的 [助手](/docs/api-reference/assistants) 的工具列表。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        所定义工具的类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        所定义工具的类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型默认为 20，对于 `gpt-3.5-turbo`。此数字应介于 1 到 50（含）之间。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器和 0 的 score_threshold。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以获取更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须为 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，模型据此选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 中关于格式的文档。

          省略 `parameters` 会定义一个带有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式遵循模式。如果设为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的某个子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制运行前线程将被截断的方式。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      为运行构建上下文时，线程中最近的会话消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行不处于终态，该值将为 `null` （即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，默认值为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，默认值为 1。

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

当一次运行处于 `status: "requires_action"` 和 `required_action.type` 状态时 `submit_tool_outputs`，此端点可用于在工具调用全部完成后提交其输出。所有输出必须在单个请求中提交。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 请求体参数

- `tool_outputs: array of object { output, tool_call_id }`

  正在提交输出的工具列表。

  - `output: optional string`

    为了继续运行而提交的工具调用输出。

  - `tool_call_id: optional string`

    工具调用在 `required_action` 对象中的 ID，该对象位于正在为其提交输出的运行对象内。

- `stream: optional boolean or null`

  如果 `true`，则以服务器发送事件的形式返回运行过程中发生的事件流，当运行进入终态并带有 `data: [DONE]` 消息时终止。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示一次在 [线程](/docs/api-reference/threads).

  - `id: string`

    上执行的运行。可在 API 端点中引用的标识符。

  - `assistant_id: string`

    用于执行此运行的 [助手](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行创建时的 Unix 时间戳（以秒为单位）。

  - `expires_at: number or null`

    运行到期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: number or null`

    运行失败时的 Unix 时间戳（秒）。

  - `incomplete_details: object { reason }  or null`

    关于运行不完整原因的详细信息。如果运行 `null` 未不完整，则为。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指向运行过程中达到的特定 token 限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    该 [assistant](/docs/api-reference/assistants) 用于此运行的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果 `null` 没有错误，则为。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      之一 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

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

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化方式存储有关对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度
    为 512 个字符的字符串。

  - `model: string`

    用于本次运行的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果 `null` 无需任何操作，则为空。

    - `submit_tool_outputs: object { tool_calls }`

      继续此运行所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数名称。

        - `type: "function"`

          需要输出所针对的工具调用类型。目前，此值始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前，此值始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 起的所有 GPT-3.5 Turbo 模型。启用 Structured Outputs，可确保模型匹配你提供的 JSON 架构。更多信息，请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 还要通过系统或用户消息指示模型自行生成 JSON。否则，模型可能会生成无休止的空白字符，直到生成达到 token 限制，导致请求长时间运行且看似“卡住”。另请注意，消息内容可能会在以下情况下被部分截断： `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超出了最大上下文长度。

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
      使用 `json_schema` 对于支持它的模型是推荐的。请注意，
      模型在没有系统或用户消息指示的情况下不会生成 JSON
      。

      - `type: "json_object"`

        所定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须是 a-z、A-Z、0-9，或包含
          下划线和短划线，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型会用它来
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，描述为 JSON Schema 对象。
          了解如何构建 JSON 架构 [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循定义的精确架构
          在 `schema` 字段中。当
          `strict` 时 `true`。仅支持 JSON Schema 的子集。要了解更多，请阅读 [结构化输出
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

    的 ID [线程](/docs/api-reference/threads) 作为此运行的一部分被执行。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成一条消息。
    `auto` 是默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

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

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        用于文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型默认为 20，对于 `gpt-3.5-turbo`。此数字应介于 1 到 50（含）之间。

          请注意，文件搜索工具输出的结果可能少于 `max_num_results` 。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排名选项。如果未指定，文件搜索工具将使用 `auto` 排序器，且 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用该函数。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 获取示例，并参阅 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解有关格式的文档。

          省略 `parameters` 定义了一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的架构遵循。如果设置为 true，模型将严格遵循 `parameters` 字段中定义的精确架构。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制运行前线程如何被截断的控制方式。使用此控制来管理运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在构建运行上下文时，从线程中使用的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计。此值将为 `null` 如果运行不处于终止状态（即。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。若未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。若未设置，默认为 1。

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

  一组最多 16 个键值对，可附加到对象上。可用于
  以结构化格式存储关于对象的额外信息，并可通过
  API 或仪表盘查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

### 返回

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某个 [线程](/docs/api-reference/threads).

  - `id: string`

    上的执行运行。该标识符可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [助手](/docs/api-reference/assistants) 的 ID。

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

    有关运行不完整原因的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指向运行过程中达到的特定令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    用于此运行的 [助手](/docs/api-reference/assistants) 的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      其中一个 `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大完成令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储有关对象的更多信息，
    并通过 API 或仪表板查询对象。

    键是最大长度为 64 个字符的字符串。值是最大
    长度为 512 个字符的字符串。

  - `model: string`

    运行所使用的 [助手](/docs/api-reference/assistants) 模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果无需任何操作， `null` 则为空。

    - `submit_tool_outputs: object { tool_calls }`

      继续此运行所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点时，必须引用此 ID。

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

    设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用结构化输出，确保模型匹配你提供的 JSON 模式。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置为 `{ "type": "json_object" }` 可启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 同时，你也可以通过系统或用户消息自行指示模型生成 JSON。如果不这样做，模型可能会生成无尽的白空格流，直到生成达到令牌限制，导致请求长时间运行且看似“卡住”。另请注意，消息内容可能会被部分截断，如果 `finish_reason="length"`，这表示生成超过了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        所定义的响应格式类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      使用 `json_schema` 是推荐用于支持它的模型。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON
      。

      - `type: "json_object"`

        所定义的响应格式类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        Structured Outputs 配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须是 a-z、A-Z、0-9，或包含
          下划线和破折号，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型用于
          确定如何以该格式进行响应。

        - `schema: optional map[unknown]`

          响应格式的架构，以 JSON Schema 对象的形式描述。
          了解如何构建 JSON Schema [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循定义的确切架构
          位于 `schema` 字段中。当
          `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多信息，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        所定义的响应格式类型。始终 `json_schema`.

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

    作为此运行一部分而执行的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 意味着模型不会调用任何工具，而是生成一条消息。
    `auto` 为默认值，表示模型可以在生成消息或调用一个或多个工具之间进行选择。
    `required` 表示模型在响应用户之前必须调用一个或多个工具。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型在响应用户之前必须调用一个或多个工具。

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

          要调用的函数的名称。

  - `tools: array of CodeInterpreterTool or FileSearchTool or FunctionTool`

    本次运行中 [助手](/docs/api-reference/assistants) 使用的工具列表。

    - `CodeInterpreterTool object { type }`

      - `type: "code_interpreter"`

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为20；对于 `gpt-3.5-turbo`. 此数字应介于 1 和 50 之间（含边界值）。

          请注意，文件搜索工具可能输出少于 `max_num_results` 个结果。请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用 `auto` 排序器且 score_threshold 为 0。

          请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用该函数时使用。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/docs/guides/function-calling) 获取示例，并参阅 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关格式的文档。

          省略 `parameters` 定义一个具有空参数列表的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格模式遵循。若设置为 true，模型将遵循 `parameters` 字段中定义的精确模式。当 `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。了解更多关于结构化输出的信息，请参阅 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制运行前线程的截断方式。使用此选项控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。若设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      构建运行上下文时，从线程中取用的最近消息数量。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行未处于终止状态（即 `null` 则该值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。若未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。若未设置，默认为 1。

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

## 领域类型

### Required Action Function Tool Call

- `RequiredActionFunctionToolCall object { id, function, type }`

  工具调用对象

  - `id: string`

    工具调用的 ID。当你通过 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

  - `function: object { arguments, name }`

    函数定义。

    - `arguments: string`

      模型期望你传递给函数的参数。

    - `name: string`

      函数的名称。

  - `type: "function"`

    输出所需的工具调用类型。目前，这始终是 `function`.

    - `"function"`

### 运行

- `Run object { id, assistant_id, cancelled_at, 24 more }`

  表示在某 [线程](/docs/api-reference/threads).

  - `id: string`

    上的执行运行。该标识符可在 API 端点中引用。

  - `assistant_id: string`

    用于执行此运行的 [助手](/docs/api-reference/assistants) 的 ID。

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

    关于运行不完整原因的详细信息。如果运行并非不完整，则为 `null` 。

    - `reason: optional "max_completion_tokens" or "max_prompt_tokens"`

      运行不完整的原因。这将指明在运行过程中达到了哪个特定的令牌限制。

      - `"max_completion_tokens"`

      - `"max_prompt_tokens"`

  - `instructions: string`

    该 [助手](/docs/api-reference/assistants) 用于此运行的指令。

  - `last_error: object { code, message }  or null`

    与此运行关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt"`

      以下之一： `server_error`, `rate_limit_exceeded`，或 `invalid_prompt`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

    - `message: string`

      错误的人类可读描述。

  - `max_completion_tokens: number or null`

    在运行过程中指定使用的最大补全令牌数。

  - `max_prompt_tokens: number or null`

    在运行过程中指定使用的最大提示令牌数。

  - `metadata: Metadata or null`

    附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: string`

    用于此运行 [助理](/docs/api-reference/assistants) 的模型。

  - `object: "thread.run"`

    对象类型，始终为 `thread.run`.

    - `"thread.run"`

  - `parallel_tool_calls: boolean`

    是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

  - `required_action: object { submit_tool_outputs, type }  or null`

    继续运行所需操作的详细信息。如果 `null` 不需要操作，则为 null。

    - `submit_tool_outputs: object { tool_calls }`

      此运行继续所需的工具输出详细信息。

      - `tool_calls: array of RequiredActionFunctionToolCall`

        相关工具调用的列表。

        - `id: string`

          工具调用的 ID。当你使用 [提交工具输出以运行](/docs/api-reference/runs/submitToolOutputs) 端点提交工具输出时，必须引用此 ID。

        - `function: object { arguments, name }`

          函数定义。

          - `arguments: string`

            模型期望你传递给函数的参数。

          - `name: string`

            函数的名称。

        - `type: "function"`

          输出所需的工具调用类型。目前始终为 `function`.

          - `"function"`

    - `type: "submit_tool_outputs"`

      目前始终为 `submit_tool_outputs`.

      - `"submit_tool_outputs"`

  - `response_format: AssistantResponseFormatOption or null`

    指定模型必须输出的格式。兼容 [GPT-4o](/docs/models#gpt-4o), [GPT-4 Turbo](/docs/models#gpt-4-turbo-and-gpt-4)，以及自 `gpt-3.5-turbo-1106`.

    设置 `{ "type": "json_schema", "json_schema": {...} }` 启用结构化输出，可确保模型匹配你提供的 JSON 架构。更多信息请参阅 [结构化输出指南](/docs/guides/structured-outputs).

    设置 `{ "type": "json_object" }` 启用 JSON 模式，确保模型生成的消息是有效的 JSON。

    **重要：** 使用 JSON 模式时，你 **必须** 另外，也要通过系统或用户消息指示模型自行生成 JSON。如果不这样做，模型可能会生成无尽的空白字符，直到生成达到 token 限制，导致长时间运行且看似“卡住”的请求。另请注意，消息内容可能会被部分截断，如果 `finish_reason="length"`，这表示生成超出了 `max_tokens` 或对话超过了最大上下文长度。

    - `"auto"`

      `auto` 是默认值

      - `"auto"`

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。生成 JSON 响应的旧方法。
      使用 `json_schema` 对于支持该格式的模型是推荐的。请注意，
      模型在没有系统或用户消息指示时不会生成 JSON，
      指示它这样做。

      - `type: "json_object"`

        正在定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

    - `ResponseFormatJSONSchema object { json_schema, type }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      了解更多关于 [结构化输出](/docs/guides/structured-outputs).

      - `json_schema: object { name, description, schema, strict }`

        结构化输出的配置选项，包括 JSON Schema。

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9，或包含
          下划线和破折号，最大长度为 64。

        - `description: optional string`

          响应格式用途的描述，模型使用它来决定如何以该格式响应。
          确定如何以该格式响应。

        - `schema: optional map[unknown]`

          响应格式的架构，描述为 JSON Schema 对象。
          了解如何构建 JSON schemas [此处](https://json-schema.org/).

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循
          中定义的精确架构。启用 `schema` 时仅支持 JSON Schema 的子集。若要了解更多，请阅读
          `strict` 为 `true`。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终为 `json_schema`.

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

    此运行中执行的 [线程](/docs/api-reference/threads) 的 ID。

  - `tool_choice: AssistantToolChoiceOption or null`

    控制模型调用哪个（如果有）工具。
    `none` 表示模型不会调用任何工具，而是生成消息。
    `auto` 为默认值，表示模型可以选择生成消息或调用一个或多个工具。
    `required` 表示模型必须在响应用户之前调用一个或多个工具。
    指定特定工具，如 `{"type": "file_search"}` 或 `{"type": "function", "function": {"name": "my_function"}}` ，会强制模型调用该工具。

    - `"none" or "auto" or "required"`

      `none` 表示模型不会调用任何工具，而是生成消息。 `auto` 表示模型可以选择生成消息或调用一个或多个工具。 `required` 表示模型必须在响应用户之前调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `AssistantToolChoice object { type, function }`

      指定模型应使用的工具。使用它来强制模型调用特定工具。

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

        正在定义的工具类型： `code_interpreter`

        - `"code_interpreter"`

    - `FileSearchTool object { type, file_search }`

      - `type: "file_search"`

        正在定义的工具类型： `file_search`

        - `"file_search"`

      - `file_search: optional object { max_num_results, ranking_options }`

        对文件搜索工具的覆盖设置。

        - `max_num_results: optional number`

          文件搜索工具应输出的最大结果数。对于 `gpt-4*` 模型，默认值为 20；对于 `gpt-3.5-turbo`。该数字应为 1 到 50（含）之间的整数。

          请注意，文件搜索工具可能输出的结果少于 `max_num_results` 请求数量。参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

        - `ranking_options: optional object { score_threshold, ranker }`

          文件搜索的排序选项。如果未指定，文件搜索工具将使用默认 `auto` 排序器，且 score_threshold 为 0。

          参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须为 0 到 1 之间的浮点数。

          - `ranker: optional "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用默认 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

    - `FunctionTool object { function, type }`

      - `function: FunctionDefinition`

        - `name: string`

          要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

        - `description: optional string`

          函数功能的描述，供模型选择何时以及如何调用该函数时使用。

        - `parameters: optional FunctionParameters`

          函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 获取示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关格式的文档。

          省略 `parameters` 定义一个参数列表为空的函数。

        - `strict: optional boolean or null`

          是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段中定义的确切模式。只有 JSON Schema 的一个子集在 `strict` 为 `true`。时受支持。在 [函数调用指南](/docs/guides/function-calling).

      - `type: "function"`

        正在定义的工具类型： `function`

        - `"function"`

  - `truncation_strategy: object { type, last_messages }  or null`

    控制在运行之前如何截断线程。使用此选项来控制运行的初始上下文窗口。

    - `type: "auto" or "last_messages"`

      用于线程的截断策略。默认值为 `auto`。如果设置为 `last_messages`，线程将被截断为线程中最近的 n 条消息。当设置为 `auto`，时，线程中间的消息将被丢弃以适应该模型的上下文长度， `max_prompt_tokens`.

      - `"auto"`

      - `"last_messages"`

    - `last_messages: optional number or null`

      在构建运行上下文时从线程中使用的最近消息数。

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行相关的使用统计信息。如果运行不处于终态（即 `null` ，此值将为。 `in_progress`, `queued`，等）。

    - `completion_tokens: number`

      运行期间使用的完成令牌数量。

    - `prompt_tokens: number`

      运行期间使用的提示令牌数量。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

  - `temperature: optional number or null`

    本次运行使用的采样温度。如果未设置，默认为 1。

  - `top_p: optional number or null`

    本次运行使用的核采样值。如果未设置，默认为 1。

# 步骤

## 列出运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps`

返回属于某个运行的一列运行步骤。

### 路径参数

- `thread_id: string`

- `run_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个定义你在列表中位置的对象 ID。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你后续的调用可以包含 after=obj_foo，以便获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个定义你在列表中位置的对象 ID。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你后续的调用可以包含 before=obj_foo，以便获取列表的上一页。

- `include: optional array of RunStepInclude`

  要在响应中包含的附加字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  请参阅 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

- `limit: optional number`

  要返回的对象数量限制。限制范围在 1 到 100 之间，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of RunStep`

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（以秒为单位）。如果父运行已过期，则该步骤视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后错误。将 `null` 如果不存在错误。

    - `code: "server_error" or "rate_limit_exceeded"`

      其中之一为 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的可读描述。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    其 ID 为 [运行](/docs/api-reference/runs) ，此运行步骤是该运行的一部分。

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

        运行步骤涉及的工具调用数组。这些工具调用可关联三种类型工具之一： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用的定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每一项都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤的一部分，代码解释器工具调用的文本输出。

                - `logs: string`

                  来自代码解释器工具调用的文本输出。

                - `type: "logs"`

                  总是 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [文件](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  总是 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于这种类型的工具调用，它总是 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，这总是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排名选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果所在的文件的 ID。

              - `file_name: string`

                找到结果所在的文件的名称。

              - `score: number`

                结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于这种类型的工具调用，这始终是 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            被调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，这将为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于这种类型的工具调用，这始终是 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    所运行 [thread](/docs/api-reference/threads) 的 ID。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。该值将为 `null` 当运行步骤的状态为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

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

## 检索运行步骤

**get** `/threads/{thread_id}/runs/{run_id}/steps/{step_id}`

检索一个运行步骤。

### 路径参数

- `thread_id: string`

- `run_id: string`

- `step_id: string`

### 查询参数

- `include: optional array of RunStepInclude`

  要包含在响应中的附加字段列表。目前唯一支持的值是 `step_details.tool_calls[*].file_search.results[*].content` 以获取文件搜索结果内容。

  参见 [文件搜索工具文档](/docs/assistants/tools/file-search#customizing-file-search-settings) 以了解更多信息。

  - `"step_details.tool_calls[*].file_search.results[*].content"`

### 返回

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示运行执行中的一个步骤。

  - `id: string`

    运行步骤的标识符，可在API端点中引用。

  - `assistant_id: string`

    与此运行步骤关联的 [assistant](/docs/api-reference/assistants) 的ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的Unix时间戳（以秒为单位）。

  - `completed_at: number or null`

    运行步骤完成时的Unix时间戳（以秒为单位）。

  - `created_at: number`

    运行步骤创建时的Unix时间戳（以秒为单位）。

  - `expired_at: number or null`

    运行步骤过期时的Unix时间戳（以秒为单位）。如果父运行已过期，则该步骤被视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的Unix时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此运行步骤关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      其中之一 `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关该对象的附加信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串，
    最大长度为512个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    此运行步骤所属的 [运行](/docs/api-reference/runs) 的 ID。

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

        运行步骤涉及的工具调用数组。这些可以与三种类型的工具之一关联： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项，包括文本（`logs`）或图像（`image`）。每一项都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤的一部分，代码解释器工具调用产生的文本输出。

                - `logs: string`

                  代码解释器工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [文件](/docs/api-reference/files) 图像的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，这始终是 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，这始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果所在文件的 ID。

              - `file_name: string`

                找到结果所在文件的名称。

              - `score: number`

                结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅当通过 include 查询参数请求时，才会包含该内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于这种类型的工具调用，它总是 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            被调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` 提交，则此值将为 [提交](/docs/api-reference/runs/submitToolOutputs) 。

          - `type: "function"`

            工具调用的类型。对于这种类型的工具调用，它总是 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    被运行的 [线程](/docs/api-reference/threads) 的 ID。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的使用统计信息。该值将 `null` 当运行步骤的状态为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

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

  来自代码解释器工具调用的文本输出，作为运行步骤的一部分。

  - `index: number`

    输出在 outputs 数组中的索引。

  - `type: "logs"`

    始终 `logs`.

    - `"logs"`

  - `logs: optional string`

    来自代码解释器工具调用的文本输出。

### 代码解释器输出图像

- `CodeInterpreterOutputImage object { index, type, image }`

  - `index: number`

    输出在 outputs 数组中的索引。

  - `type: "image"`

    始终 `image`.

    - `"image"`

  - `image: optional object { file_id }`

    - `file_id: optional string`

      该 [文件](/docs/api-reference/files) 图像的 ID。

### 代码解释器工具调用

- `CodeInterpreterToolCall object { id, code_interpreter, type }`

  运行步骤所涉及的 Code Interpreter 工具调用的详细信息。

  - `id: string`

    工具调用的 ID。

  - `code_interpreter: object { input, outputs }`

    Code Interpreter 工具调用定义。

    - `input: string`

      Code Interpreter 工具调用的输入。

    - `outputs: array of object { logs, type }  or object { image, type }`

      Code Interpreter 工具调用的输出。Code Interpreter 可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种都由不同的对象类型表示。

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

    工具调用的类型。对于这种类型的工具调用，这始终是 `code_interpreter` 。

    - `"code_interpreter"`

### 代码解释器工具调用增量

- `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

  运行步骤所涉及的代码解释器工具调用的详细信息。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "code_interpreter"`

    工具调用的类型。对于此类工具调用，它始终是 `code_interpreter` 。

    - `"code_interpreter"`

  - `id: optional string`

    工具调用的 ID。

  - `code_interpreter: optional object { input, outputs }`

    代码解释器工具调用的定义。

    - `input: optional string`

      代码解释器工具调用的输入。

    - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

      代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。这些各自由不同的对象类型表示。

      - `CodeInterpreterLogs object { index, type, logs }`

        作为运行步骤一部分的代码解释器工具调用的文本输出。

        - `index: number`

          输出数组中的输出索引。

        - `type: "logs"`

          始终 `logs`.

          - `"logs"`

        - `logs: optional string`

          代码解释器工具调用的文本输出。

      - `CodeInterpreterOutputImage object { index, type, image }`

        - `index: number`

          输出数组中的输出索引。

        - `type: "image"`

          始终 `image`.

          - `"image"`

        - `image: optional object { file_id }`

          - `file_id: optional string`

            该 [文件](/docs/api-reference/files) 图像的 ID。

### 文件搜索工具调用

- `FileSearchToolCall object { id, file_search, type }`

  - `id: string`

    工具调用对象的 ID。

  - `file_search: object { ranking_options, results }`

    目前，这始终是一个空对象。

    - `ranking_options: optional object { ranker, score_threshold }`

      文件搜索的排序选项。

      - `ranker: "auto" or "default_2024_08_21"`

        文件搜索要使用的排序器。如果未指定，将使用 `auto` 排序器。

        - `"auto"`

        - `"default_2024_08_21"`

      - `score_threshold: number`

        文件搜索的分数阈值。所有值必须是介于 0 和 1 之间的浮点数。

    - `results: optional array of object { file_id, file_name, score, content }`

      文件搜索的结果。

      - `file_id: string`

        结果所在文件的 ID。

      - `file_name: string`

        结果所在文件的名称。

      - `score: number`

        结果的分数。所有值必须是介于 0 和 1 之间的浮点数。

      - `content: optional array of object { text, type }`

        找到的结果的内容。内容仅在通过 include 查询参数请求时才会包含。

        - `text: optional string`

          文件的文本内容。

        - `type: optional "text"`

          内容的类型。

          - `"text"`

  - `type: "file_search"`

    工具调用的类型。对于这种类型的工具调用，它始终是 `file_search` 。

    - `"file_search"`

### 文件搜索工具调用增量

- `FileSearchToolCallDelta object { file_search, index, type, id }`

  - `file_search: unknown`

    目前，这始终是一个空对象。

  - `index: number`

    工具调用数组中的工具调用索引。

  - `type: "file_search"`

    工具调用的类型。对于此类工具调用，它始终是 `file_search` 。

    - `"file_search"`

  - `id: optional string`

    工具调用对象的 ID。

### 函数工具调用

- `FunctionToolCall object { id, function, type }`

  - `id: string`

    工具调用对象的 ID。

  - `function: object { arguments, name, output }`

    被调用函数的定义。

    - `arguments: string`

      传递给函数的参数。

    - `name: string`

      函数的名称。

    - `output: string or null`

      函数的输出。如果输出尚未 `null` 提交，则此值为 [submitted](/docs/api-reference/runs/submitToolOutputs) 。

  - `type: "function"`

    工具调用的类型。对于此类型的工具调用，其值始终为 `function` 。

    - `"function"`

### 函数工具调用增量

- `FunctionToolCallDelta object { index, type, id, function }`

  - `index: number`

    工具调用数组中工具调用的索引。

  - `type: "function"`

    工具调用的类型。此类型始终为 `function` 对于此类工具调用。

    - `"function"`

  - `id: optional string`

    工具调用对象的 ID。

  - `function: optional object { arguments, name, output }`

    被调用函数的定义。

    - `arguments: optional string`

      传递给函数的参数。

    - `name: optional string`

      函数的名称。

    - `output: optional string or null`

      函数的输出。如果输出尚未 `null` 提交，则此字段将为 [提交](/docs/api-reference/runs/submitToolOutputs) 。

### 消息创建步骤详情

- `MessageCreationStepDetails object { message_creation, type }`

  运行步骤创建消息的详细信息。

  - `message_creation: object { message_id }`

    - `message_id: string`

      该运行步骤创建的消息 ID。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

### 运行步骤

- `RunStep object { id, assistant_id, cancelled_at, 13 more }`

  表示一次运行执行过程中的一个步骤。

  - `id: string`

    该运行步骤的标识符，可在 API 端点中引用。

  - `assistant_id: string`

    与该运行步骤关联的 [assistant](/docs/api-reference/assistants) 的 ID。

  - `cancelled_at: number or null`

    运行步骤被取消时的 Unix 时间戳（秒）。

  - `completed_at: number or null`

    运行步骤完成时的 Unix 时间戳（秒）。

  - `created_at: number`

    运行步骤创建时的 Unix 时间戳（秒）。

  - `expired_at: number or null`

    运行步骤过期时的 Unix 时间戳（秒）。如果父运行已过期，则该步骤视为已过期。

  - `failed_at: number or null`

    运行步骤失败时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与该运行步骤关联的最后错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "rate_limit_exceeded"`

      以下之一： `server_error` 或 `rate_limit_exceeded`.

      - `"server_error"`

      - `"rate_limit_exceeded"`

    - `message: string`

      错误的人类可读描述。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对。这可用于以结构化
    格式存储有关对象的额外信息，并可通过 API 或仪表板查询对象。
    键是字符串，最大长度为 64 个字符。值是字符串。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `object: "thread.run.step"`

    对象类型，始终为 `thread.run.step`.

    - `"thread.run.step"`

  - `run_id: string`

    此运行步骤所属的 [run](/docs/api-reference/runs) 的 ID。

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

        运行步骤所涉及的工具调用数组。这些可能与三种工具类型之一相关联： `code_interpreter`, `file_search`，或 `function`.

        - `CodeInterpreterToolCall object { id, code_interpreter, type }`

          运行步骤所涉及的代码解释器工具调用的详细信息。

          - `id: string`

            工具调用的 ID。

          - `code_interpreter: object { input, outputs }`

            代码解释器工具调用定义。

            - `input: string`

              代码解释器工具调用的输入。

            - `outputs: array of object { logs, type }  or object { image, type }`

              代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图片（`image`）。每个都由不同的对象类型表示。

              - `CodeInterpreterLogOutput object { logs, type }`

                作为运行步骤的一部分，从 Code Interpreter 工具调用返回的文本输出。

                - `logs: string`

                  来自 Code Interpreter 工具调用的文本输出。

                - `type: "logs"`

                  始终 `logs`.

                  - `"logs"`

              - `CodeInterpreterImageOutput object { image, type }`

                - `image: object { file_id }`

                  - `file_id: string`

                    该 [file](/docs/api-reference/files) 图片的 ID。

                - `type: "image"`

                  始终 `image`.

                  - `"image"`

          - `type: "code_interpreter"`

            工具调用的类型。对于此类工具调用，始终为 `code_interpreter` 。

            - `"code_interpreter"`

        - `FileSearchToolCall object { id, file_search, type }`

          - `id: string`

            工具调用对象的 ID。

          - `file_search: object { ranking_options, results }`

            目前，这始终是一个空对象。

            - `ranking_options: optional object { ranker, score_threshold }`

              文件搜索的排序选项。

              - `ranker: "auto" or "default_2024_08_21"`

                用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

                - `"auto"`

                - `"default_2024_08_21"`

              - `score_threshold: number`

                文件搜索的得分阈值。所有值必须是 0 到 1 之间的浮点数。

            - `results: optional array of object { file_id, file_name, score, content }`

              文件搜索的结果。

              - `file_id: string`

                找到结果所在文件的 ID。

              - `file_name: string`

                找到结果所在文件的名称。

              - `score: number`

                结果的得分。所有值必须是 0 到 1 之间的浮点数。

              - `content: optional array of object { text, type }`

                找到的结果的内容。仅当通过 include 查询参数请求时，才会包含该内容。

                - `text: optional string`

                  文件的文本内容。

                - `type: optional "text"`

                  内容的类型。

                  - `"text"`

          - `type: "file_search"`

            工具调用的类型。对于此类工具调用，这始终是 `file_search` 。

            - `"file_search"`

        - `FunctionToolCall object { id, function, type }`

          - `id: string`

            工具调用对象的 ID。

          - `function: object { arguments, name, output }`

            被调用函数的定义。

            - `arguments: string`

              传递给函数的参数。

            - `name: string`

              函数的名称。

            - `output: string or null`

              函数的输出。如果输出尚未 `null` ，这将是 [已提交](/docs/api-reference/runs/submitToolOutputs) 尚未。

          - `type: "function"`

            工具调用的类型。对于此类工具调用，该值始终为 `function` 。

            - `"function"`

      - `type: "tool_calls"`

        始终 `tool_calls`.

        - `"tool_calls"`

  - `thread_id: string`

    被运行的 [thread](/docs/api-reference/threads) 的 ID。

  - `type: "message_creation" or "tool_calls"`

    运行步骤的类型，可以是 `message_creation` 或 `tool_calls`.

    - `"message_creation"`

    - `"tool_calls"`

  - `usage: object { completion_tokens, prompt_tokens, total_tokens }  or null`

    与运行步骤相关的用量统计信息。该值将 `null` 在运行步骤的状态为 `in_progress`.

    - `completion_tokens: number`

      运行步骤过程中使用的完成令牌数。

    - `prompt_tokens: number`

      运行步骤过程中使用的提示令牌数。

    - `total_tokens: number`

      使用的令牌总数（提示 + 完成）。

### 运行步骤增量事件

- `RunStepDeltaEvent object { id, delta, object }`

  表示运行步骤的增量，即流式传输期间运行步骤上任何已更改的字段。

  - `id: string`

    运行步骤的标识符，可在 API 端点中引用。

  - `delta: object { step_details }`

    包含运行步骤上已更改字段的增量。

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

          运行步骤所涉及的工具调用数组。这些工具调用可关联三种类型的工具之一： `code_interpreter`, `file_search`，或 `function`.

          - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

            运行步骤所涉及的代码解释器工具调用的详细信息。

            - `index: number`

              工具调用数组中的工具调用索引。

            - `type: "code_interpreter"`

              工具调用的类型。对于此类型的工具调用，它始终为 `code_interpreter` 。

              - `"code_interpreter"`

            - `id: optional string`

              工具调用的 ID。

            - `code_interpreter: optional object { input, outputs }`

              代码解释器工具调用定义。

              - `input: optional string`

                代码解释器工具调用的输入。

              - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

                代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每种类型都由不同的对象类型表示。

                - `CodeInterpreterLogs object { index, type, logs }`

                  运行步骤中 Code Interpreter 工具调用的文本输出。

                  - `index: number`

                    输出在 outputs 数组中的索引。

                  - `type: "logs"`

                    始终 `logs`.

                    - `"logs"`

                  - `logs: optional string`

                    Code Interpreter 工具调用的文本输出。

                - `CodeInterpreterOutputImage object { index, type, image }`

                  - `index: number`

                    输出在 outputs 数组中的索引。

                  - `type: "image"`

                    始终 `image`.

                    - `"image"`

                  - `image: optional object { file_id }`

                    - `file_id: optional string`

                      该 [file](/docs/api-reference/files) 图像的 ID。

          - `FileSearchToolCallDelta object { file_search, index, type, id }`

            - `file_search: unknown`

              目前，这始终是一个空对象。

            - `index: number`

              工具调用在 tool calls 数组中的索引。

            - `type: "file_search"`

              工具调用的类型。对于此类工具调用，这始终是 `file_search` 。

              - `"file_search"`

            - `id: optional string`

              工具调用对象的 ID。

          - `FunctionToolCallDelta object { index, type, id, function }`

            - `index: number`

              工具调用在 tool calls 数组中的索引。

            - `type: "function"`

              工具调用的类型。对于此类工具调用，这始终是 `function` 。

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

                函数的输出。如果输出尚未 `null` 提交，则此字段将为 [提交](/docs/api-reference/runs/submitToolOutputs) 。

  - `object: "thread.run.step.delta"`

    对象类型，始终为 `thread.run.step.delta`.

    - `"thread.run.step.delta"`

### 运行步骤增量消息增量

- `RunStepDeltaMessageDelta object { type, message_creation }`

  该运行步骤创建消息的详细信息。

  - `type: "message_creation"`

    始终 `message_creation`.

    - `"message_creation"`

  - `message_creation: optional object { message_id }`

    - `message_id: optional string`

      此运行步骤所创建消息的 ID。

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

    运行步骤涉及的工具调用数组。这些可与三种工具类型之一关联： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCallDelta object { index, type, id, code_interpreter }`

      运行步骤涉及的代码解释器工具调用的详细信息。

      - `index: number`

        工具调用在工具调用数组中的索引。

      - `type: "code_interpreter"`

        工具调用的类型。对于此类工具调用，这始终为 `code_interpreter` 。

        - `"code_interpreter"`

      - `id: optional string`

        工具调用的 ID。

      - `code_interpreter: optional object { input, outputs }`

        代码解释器工具调用定义。

        - `input: optional string`

          代码解释器工具调用的输入。

        - `outputs: optional array of CodeInterpreterLogs or CodeInterpreterOutputImage`

          代码解释器工具调用的输出。代码解释器可输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每个项目由不同的对象类型表示。

          - `CodeInterpreterLogs object { index, type, logs }`

            作为运行步骤一部分的代码解释器工具调用的文本输出。

            - `index: number`

              输出在输出数组中的索引。

            - `type: "logs"`

              始终 `logs`.

              - `"logs"`

            - `logs: optional string`

              代码解释器工具调用的文本输出。

          - `CodeInterpreterOutputImage object { index, type, image }`

            - `index: number`

              输出在输出数组中的索引。

            - `type: "image"`

              始终 `image`.

              - `"image"`

            - `image: optional object { file_id }`

              - `file_id: optional string`

                该 [文件](/docs/api-reference/files) 图像的 ID。

    - `FileSearchToolCallDelta object { file_search, index, type, id }`

      - `file_search: unknown`

        目前，这始终是一个空对象。

      - `index: number`

        工具调用在工具调用数组中的索引。

      - `type: "file_search"`

        工具调用的类型。对于这种类型的工具调用，这始终是 `file_search` 。

        - `"file_search"`

      - `id: optional string`

        工具调用对象的 ID。

    - `FunctionToolCallDelta object { index, type, id, function }`

      - `index: number`

        工具调用在工具调用数组中的索引。

      - `type: "function"`

        工具调用的类型。对于这种类型的工具调用，这始终是 `function` 。

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

          函数的输出。如果输出尚未 `null` ，这将为 [提交](/docs/api-reference/runs/submitToolOutputs) 。

### 工具调用步骤详情

- `ToolCallsStepDetails object { tool_calls, type }`

  工具调用的详细信息。

  - `tool_calls: array of CodeInterpreterToolCall or FileSearchToolCall or FunctionToolCall`

    运行步骤所涉及的工具调用数组。这些可以与三种类型的工具之一关联： `code_interpreter`, `file_search`，或 `function`.

    - `CodeInterpreterToolCall object { id, code_interpreter, type }`

      运行步骤所涉及的代码解释器工具调用的详细信息。

      - `id: string`

        工具调用的 ID。

      - `code_interpreter: object { input, outputs }`

        代码解释器工具调用定义。

        - `input: string`

          代码解释器工具调用的输入。

        - `outputs: array of object { logs, type }  or object { image, type }`

          代码解释器工具调用的输出。代码解释器可以输出一个或多个项目，包括文本（`logs`）或图像（`image`）。每个都由不同的对象类型表示。

          - `CodeInterpreterLogOutput object { logs, type }`

            运行步骤中代码解释器工具调用的文本输出。

            - `logs: string`

              代码解释器工具调用的文本输出。

            - `type: "logs"`

              始终 `logs`.

              - `"logs"`

          - `CodeInterpreterImageOutput object { image, type }`

            - `image: object { file_id }`

              - `file_id: string`

                该 [文件](/docs/api-reference/files) 图像的 ID。

            - `type: "image"`

              始终 `image`.

              - `"image"`

      - `type: "code_interpreter"`

        工具调用的类型。对于这种工具调用类型，始终是 `code_interpreter` 。

        - `"code_interpreter"`

    - `FileSearchToolCall object { id, file_search, type }`

      - `id: string`

        工具调用对象的 ID。

      - `file_search: object { ranking_options, results }`

        目前，这始终是一个空对象。

        - `ranking_options: optional object { ranker, score_threshold }`

          文件搜索的排名选项。

          - `ranker: "auto" or "default_2024_08_21"`

            用于文件搜索的排序器。如果未指定，将使用 `auto` 排序器。

            - `"auto"`

            - `"default_2024_08_21"`

          - `score_threshold: number`

            文件搜索的分数阈值。所有值必须是介于0和1之间的浮点数。

        - `results: optional array of object { file_id, file_name, score, content }`

          文件搜索的结果。

          - `file_id: string`

            找到结果的文件的 ID。

          - `file_name: string`

            找到结果的文件的名称。

          - `score: number`

            结果的分数。所有值必须是介于0和1之间的浮点数。

          - `content: optional array of object { text, type }`

            找到的结果的内容。仅当通过 include 查询参数请求时，才会包含内容。

            - `text: optional string`

              文件的文本内容。

            - `type: optional "text"`

              内容的类型。

              - `"text"`

      - `type: "file_search"`

        工具调用的类型。对于此类工具调用，这始终是 `file_search` 。

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

          函数的输出。如果输出尚未 `null` ，则将为此值。 [已提交](/docs/api-reference/runs/submitToolOutputs) 尚未。

      - `type: "function"`

        工具调用的类型。它将始终是 `function` 适用于这种工具调用。

        - `"function"`

  - `type: "tool_calls"`

    始终 `tool_calls`.

    - `"tool_calls"`
