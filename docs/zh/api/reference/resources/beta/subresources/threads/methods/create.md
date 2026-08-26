> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 获得。

## 创建线程

**post** `/threads`

创建一个线程。

### 请求体参数

- `messages: optional array of object { content, role, attachments, metadata }`

  一个 [消息](/docs/api-reference/messages) 列表，用于启动线程。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      一个包含定义类型的内容部分数组，每个部分可以是 `text` 类型，或者可以通过 `image_url` 或 `image_file`。传递图像。图像类型仅在 [视觉兼容模型](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        引用一张图像 [文件](/docs/api-reference/files) 在消息内容中。

        - `image_file: ImageFile`

          - `file_id: string`

            消息内容中图像的 [文件](/docs/api-reference/files) ID。如果需要在之后显示文件内容，请在 `purpose="vision"` 上传文件时设置。

          - `detail: optional "auto" or "low" or "high"`

            如果用户指定，指定图像的细节级别。 `low` 使用更少的令牌，你可以选择通过 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          始终 `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        在消息内容中引用图片 URL。

        - `image_url: ImageURL`

          - `url: string`

            图片的外部 URL，必须为受支持的图片类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图片的细节级别。 `low` 使用更少的令牌，你可以选择通过 `high`。开启高分辨率。默认值为 `auto`

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
    - `assistant`：表示消息由助手生成。使用此值可将助手消息插入对话中。

    - `"user"`

    - `"assistant"`

  - `attachments: optional array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及应将它们添加到的工具。

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

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过 API 或控制台查询对象。

    键是最大长度为 64 个字符的字符串。值是最大长度
    为 512 个字符的字符串。

- `metadata: optional Metadata or null`

  一组可附加到对象上的 16 个键值对。这可用于
  以结构化格式存储关于该对象的额外信息，并通过
  API 或仪表板查询对象。

  键是最大长度为 64 个字符的字符串。值是最大长度
  为 512 个字符的字符串。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  一组在此线程中可供助手工具使用的资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      提供给 [文件](/docs/api-reference/files) 工具的 `code_interpreter` ID 列表。最多可有 20 个文件与该工具关联。

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      附加到此线程的 [向量存储](/docs/api-reference/vector-stores/object) 。最多可有 1 个向量存储附加到该线程。

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      一个辅助工具，用于创建 [向量存储](/docs/api-reference/vector-stores/object) 并提供 file_ids，同时将其附加到此线程。最多可有 1 个向量存储附加到该线程。

      - `chunking_strategy: optional object { type }  or object { static, type }`

        用于对文件进行分块的分块策略。若未设置，将使用 `auto` 策略。

        - `Auto object { type }`

          默认策略。此策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

          - `type: "auto"`

            始终 `auto`.

            - `"auto"`

        - `Static object { static, type }`

          - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

            - `chunk_overlap_tokens: number`

              块之间重叠的令牌数。默认值为 `400`.

              请注意，重叠不得超过 `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              每个块中的最大令牌数。默认值为 `800`。最小值为 `100` 最大值为 `4096`.

          - `type: "static"`

            始终 `static`.

            - `"static"`

      - `file_ids: optional array of string`

        要添加到向量存储的 [文件](/docs/api-reference/files) ID 列表。对于 2025 年 11 月之前创建的向量存储，一个向量存储中最多可有 10,000 个文件。对于 2025 年 11 月起创建的向量存储，限制为 100,000,000 个文件。

      - `metadata: optional Metadata or null`

        可附加到对象的 16 个键值对集合。这可用于
        以结构化格式存储有关对象的额外信息，并通过
        API 或仪表板查询对象。

        键为字符串，最大长度为 64 个字符。值为字符串
        最大长度为 512 个字符。

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含 [消息](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。
    这可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    在此线程中提供给助手工具的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        提供给 [文件](/docs/api-reference/files) 工具的 ID 列表。 `code_interpreter` 最多可有 20 个文件与该工具关联。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此线程的 [向量存储](/docs/api-reference/vector-stores/object) 。线程最多可附加 1 个向量存储。

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
