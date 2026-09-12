> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 创建向量存储文件

**post** `/vector_stores/{vector_store_id}/files`

通过将一个 [File](/api/reference/resources/files) 附加到 [vector store](/api/reference/resources/vector_stores).

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `file_id: string`

  一个 [File](/api/reference/resources/files) 向量存储应使用的 ID。可用于访问文件的工具，例如 `file_search` 。对于多文件导入，我们推荐 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以减少每个向量存储的写入请求次数。

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的 16 个键值对。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键为字符串，
  以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键为字符串
  ，最大长度为 64 个字符。值为字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。该策略目前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的 token 数。默认值为 `400`.

        注意，重叠不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个分块的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### Returns

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件的创建时间（Unix 时间戳，以秒为单位）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。如果无错误则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，恒为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可以使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 已附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键为字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键为字符串
    ，最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的 token 数。默认值为 `400`.

          注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个分块的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常是因为文件在 API 中引入该 `chunking_strategy` 概念之前已被索引。

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
