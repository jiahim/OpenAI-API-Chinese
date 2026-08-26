> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建向量存储文件

**post** `/vector_stores/{vector_store_id}/files`

创建向量存储文件，通过将 [文件](/docs/api-reference/files) 附加到 [向量存储](/docs/api-reference/vector-stores/object).

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `file_id: string`

  一个 [文件](/docs/api-reference/files) 向量存储应使用的 ID。对诸如 `file_search` 等工具很有用，此类工具可访问文件。对于多文件摄取，我们建议 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) 以最小化每个向量存储的写入请求。

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象上的16组键值对。这可以
  用于以结构化方式存储关于该对象的额外信息，
  并通过 API 或仪表盘查询对象。键是字符串
  ，最大长度为64个字符。值是字符串，最大
  长度为512个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略目前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的令牌数。默认值为 `400`.

        请注意，重叠值不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      其中之一为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可用于使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    的 ID [向量存储](/docs/api-reference/vector-stores/object) ， [文件](/docs/api-reference/files) 附加到该存储。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对集合。这可以
    可用于以结构化格式存储关于对象的附加信息，
    并通过API或控制台查询对象。键是字符串，
    最大长度为 64 个字符。值是字符串（最大
    长度 512 个字符）、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠量不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` 该概念被引入 API 之前被索引的。

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "file_id": "file_id"
        }'
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
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "file_id": "file-abc123"
    }'
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "created_at": 1699061776,
  "usage_bytes": 1234,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null
}
```
