> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索向量存储文件

**获取** `/vector_stores/{vector_store_id}/files/{file_id}`

检索向量存储文件。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在API端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      其中一个为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    的 ID [向量存储](/docs/api-reference/vector-stores/object) ， [文件](/docs/api-reference/files) 附加到该存储。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对集合。这可以
    可用于以结构化格式存储对象的附加信息，并
    通过 API 或仪表板查询对象。键为字符串，
    最大长度为64个字符。值为字符串，最大
    长度为512个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          各分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件在 `chunking_strategy` 概念被引入 API 之前已被索引。

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "last_error": {
    "code": "server_error",
    "message": "message"
  },
  "object": "vector_store.file",
  "status": "in_progress",
  "usage_bytes": 0,
  "vector_store_id": "vector_store_id",
  "attributes": {
    "foo": "string"
  },
  "chunking_strategy": {
    "static": {
      "chunk_overlap_tokens": 0,
      "max_chunk_size_tokens": 100
    },
    "type": "static"
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "created_at": 1699061776,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null
}
```
