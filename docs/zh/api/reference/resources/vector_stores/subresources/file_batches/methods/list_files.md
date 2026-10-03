> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

## 在批处理中列出向量存储文件

**get** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/files`

返回批处理中的向量存储文件列表。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于指明你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的下一次调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于指明你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 开头，那么你的下一次调用可以包含 before=obj_foo 以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态筛选。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象的数量限制。范围为 1 到 100，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of VectorStoreFile`

  - `id: string`

    可在 API 端点中引用的标识符。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人工可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该 [文件](/api/reference/resources/files) 附加到的。

  - `attributes: optional map[string or number or boolean] or null`

    可以附加到对象的 16 组键值对。可用于
    以结构化格式存储有关对象的附加信息，并通过 API 或仪表板
    查询对象。键为字符串
    最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中包含的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终为 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常是因为文件在引入该概念的 `chunking_strategy` API 之前就已建立索引。

      - `type: "other"`

        始终为 `other`.

        - `"other"`

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/file_batches/$BATCH_ID/files \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
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
  ],
  "first_id": "file-abc123",
  "has_more": false,
  "last_id": "file-abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/files \
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
      "id": "file-abc123",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123",
      "usage_bytes": 1234,
      "status": "completed",
      "last_error": null
    },
    {
      "id": "file-abc456",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123",
      "usage_bytes": 1234,
      "status": "completed",
      "last_error": null
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}
```
