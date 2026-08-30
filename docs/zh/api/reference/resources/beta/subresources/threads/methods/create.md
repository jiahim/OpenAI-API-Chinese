> 完整文档索引请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加以下内容可获取文档页面的 Markdown 版本： `.md` 即可。

## Create thread

**post** `/threads`

创建会话线程。

### 正文参数

- `messages: optional array of object { content, role, attachments, metadata }`

  一个 [messages](/docs/api-reference/messages) 用于开启该会话。

  - `content: string or array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

    消息的文本内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ImageFileContentBlock or ImageURLContentBlock or TextContentBlockParam`

      由已定义类型组成的内容分块数组，每个分块的类型可以是 `text` ，或可通过 `image_url` 或 `image_file`。传入图像。图像类型仅 [Vision-compatible models](/docs/models).

      - `ImageFileContentBlock object { image_file, type }`

        引用消息内容中的一张图像。 [File](/docs/api-reference/files) 。

        - `image_file: ImageFile`

          - `file_id: string`

            该 [File](/docs/api-reference/files) 消息内容中图像的 ID。在上传 File 时设置 `purpose="vision"` ，以便稍后显示该文件内容。

          - `detail: optional "auto" or "low" or "high"`

            指定由用户设置的图像细节级别。 `low` 消耗的 tokens 更少，你也可以选择使用 `high`.

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_file"`

          Always `image_file`.

          - `"image_file"`

      - `ImageURLContentBlock object { image_url, type }`

        引用消息内容中的一个图像 URL。

        - `image_url: ImageURL`

          - `url: string`

            图像的外部 URL，必须是支持的图像类型：jpeg、jpg、png、gif、webp。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的详细程度。 `low` 消耗的 tokens 更少，你也可以选择使用 `high`。默认值为 `auto`

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

      - `TextContentBlockParam object { text, type }`

        属于消息的文本内容。

        - `text: string`

          要发送给模型的文本内容

        - `type: "text"`

          Always `text`.

          - `"text"`

  - `role: "user" or "assistant"`

    正在创建消息的实体的角色。允许的值包括：

    - `user`：表示消息由实际用户发送，在大多数情况下应使用此值来表示用户生成的消息。
    - `assistant`：表示消息由助手生成。使用此值可将助手的消息插入到对话中。

    - `"user"`

    - `"assistant"`

  - `attachments: optional array of object { file_id, tools }  or null`

    附加到消息的文件列表，以及应将这些文件添加到的工具。

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

    可以附加到对象的 16 组键值对。这可用于
    以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

- `metadata: optional Metadata or null`

  可以附加到对象的 16 组键值对。这可用于
  以结构化格式存储有关对象的附加信息，
  并通过 API 或仪表板查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  在此线程中可供助手工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      一个 [file](/docs/api-reference/files) 提供给 `code_interpreter` 工具的 ID。该工具最多可关联 20 个文件。

  - `file_search: optional object { vector_store_ids, vector_stores }`

    - `vector_store_ids: optional array of string`

      该 [vector store](/docs/api-reference/vector-stores/object) 附加到该会话的 vector store。每个会话最多可附加 1 个 vector store。

    - `vector_stores: optional array of object { chunking_strategy, file_ids, metadata }`

      用于创建的辅助方法 [vector store](/docs/api-reference/vector-stores/object) 并附带 file_ids，然后将其附加到该会话。每个会话最多可附加 1 个 vector store。

      - `chunking_strategy: optional object { type }  or object { static, type }`

        用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

        - `Auto object { type }`

          默认策略。该策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

          - `type: "auto"`

            Always `auto`.

            - `"auto"`

        - `Static object { static, type }`

          - `static: object { chunk_overlap_tokens, max_chunk_size_tokens }`

            - `chunk_overlap_tokens: number`

              各分块之间重叠的 token 数。默认值为 `400`.

              请注意，重叠部分不得超过 `max_chunk_size_tokens`.

            - `max_chunk_size_tokens: number`

              每个分块中的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

          - `type: "static"`

            Always `static`.

            - `"static"`

      - `file_ids: optional array of string`

        一个 [file](/docs/api-reference/files) 要添加到 vector store 的 ID。对于 2025 年 11 月之前创建的 vector store，单个 vector store 中最多可包含 10,000 个文件。对于自 2025 年 11 月起创建的 vector store，上限为 100,000,000 个文件。

      - `metadata: optional Metadata or null`

        可以附加到对象的 16 组键值对。这可用于
        以结构化格式存储有关对象的附加信息，
        并通过 API 或仪表板查询对象。

        键为字符串，最长 64 个字符。值为字符串，
        最长 512 个字符。

### Returns

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含的线程 [messages](/docs/api-reference/messages).

  - `id: string`

    可在 API 端点中引用的标识符。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可以附加到对象的 16 组键值对。这可用于
    以结构化格式存储有关对象的附加信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    在此线程中可供助手工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [file](/docs/api-reference/files) 提供给 `code_interpreter` 工具的 ID。该工具最多可关联 20 个文件。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到该会话的 vector store。每个会话最多可附加 1 个 vector store。

### 示例

```http
curl https://api.openai.com/v1/threads \
    -X POST \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

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

### Empty

```http
curl https://api.openai.com/v1/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d ''
```

#### Response

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

#### Response

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {}
}
```
