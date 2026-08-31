# 文件批次

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 取消向量存储文件批次

**post** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

取消一个向量存储文件批次。此操作会尽快尝试取消该批次中文件的处理。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理完成的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      当前正在处理的文件数量。

    - `total: number`

      文件总数。

  - `object: "vector_store.files_batch"`

    对象类型，始终为 `vector_store.file_batch`.

    - `"vector_store.files_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的状态，可以是 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，该 [文件](/docs/api-reference/files) 附加到该向量存储。

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/file_batches/$BATCH_ID/cancel \
    -X POST \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "file_counts": {
    "cancelled": 0,
    "completed": 0,
    "failed": 0,
    "in_progress": 0,
    "total": 0
  },
  "object": "vector_store.files_batch",
  "status": "in_progress",
  "vector_store_id": "vector_store_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/files_batches/vsfb_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X POST
```

#### 响应

```json
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "in_progress",
  "file_counts": {
    "in_progress": 12,
    "completed": 3,
    "failed": 0,
    "cancelled": 0,
    "total": 15,
  }
}
```

## 创建向量存储文件批次

**post** `/vector_stores/{vector_store_id}/file_batches`

创建一个向量存储文件批次。

### 路径参数

- `vector_store_id: string`

### 正文参数

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的 16 个键值对。这可以
  以结构化格式存储关于对象的额外信息非常有用，
  并可通过 API 或仪表板查询对象。键是字符串，
  最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
  长度为 512 个字符的字符串、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 个 `800` 和 `chunk_overlap_tokens` 个 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的令牌数。默认值为 `400`.

        请注意，重叠不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `file_ids: optional array of string`

  一个 [文件](/docs/api-reference/files) 向量存储应使用的 ID 列表。对于像 `file_search` 这类可访问文件的工具非常有用。  如果 `attributes` 或 `chunking_strategy` 会被应用于批中的所有文件。最大批量大小为 2000 个文件。建议在多文件接入时使用此端点，有助于降低每个向量存储的写入请求压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  每个对象均包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`。当你需要为特定文件覆盖元数据时使用。提供了全局 `attributes` 或 `chunking_strategy` 将被忽略，且必须为每个文件单独指定。最大批量大小为 2000 个文件。建议在多文件接入时使用此端点，有助于降低每个向量存储的写入请求压力。与 `file_ids`.

  - `file_id: string`

    一个 [文件](/docs/api-reference/files) 向量存储应使用的 ID。便于像 `file_search` 等可访问文件的工具使用。对于多文件接入，我们建议使用 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) 以最小化每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。这可以
    以结构化格式存储关于对象的额外信息非常有用，
    并可通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional FileChunkingStrategyParam`

    用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理完成的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      当前正在处理的文件数量。

    - `total: number`

      文件总数。

  - `object: "vector_store.files_batch"`

    对象类型，始终为 `vector_store.file_batch`.

    - `"vector_store.files_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的状态，可以是 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，该 [文件](/docs/api-reference/files) 附加到该向量存储。

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/file_batches \
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
  "file_counts": {
    "cancelled": 0,
    "completed": 0,
    "failed": 0,
    "in_progress": 0,
    "total": 0
  },
  "object": "vector_store.files_batch",
  "status": "in_progress",
  "vector_store_id": "vector_store_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/file_batches \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json \
    -H "OpenAI-Beta: assistants=v2" \
    -d '{
      "files": [
        {
          "file_id": "file-abc123",
          "attributes": {"category": "finance"}
        },
        {
          "file_id": "file-abc456",
          "chunking_strategy": {
            "type": "static",
            "max_chunk_size_tokens": 1200,
            "chunk_overlap_tokens": 200
          }
        }
      ]
    }'
```

#### 响应

```json
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "in_progress",
  "file_counts": {
    "in_progress": 1,
    "completed": 1,
    "failed": 0,
    "cancelled": 0,
    "total": 0,
  }
}
```

## 批量列出向量存储文件

**get** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/files`

返回某个批次中向量存储文件的列表。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 查询参数

- `after: optional string`

  用于分页游标。 `after` 是一个用于定义你在列表中所处位置的对象 ID。例如，如果你发起一次列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页游标。 `before` 是一个用于定义你在列表中所处位置的对象 ID。例如，如果你发起一次列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态进行过滤。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象的数量上限，范围为 1 到 100，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳进行排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最近一次错误。如果没有错误则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      可选值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      该错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。之一。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，该 [文件](/docs/api-reference/files) 附加到该向量存储。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。这可以
    以结构化格式存储关于对象的额外信息非常有用，
    并可通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块处理的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当 chunking 策略未知时返回此结果。通常，这是因为该文件在 `chunking_strategy` 概念引入到 API 之前已被索引。

      - `type: "other"`

        始终 `other`.

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
      "vector_store_id": "vs_abc123"
    },
    {
      "id": "file-abc456",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123"
    }
  ],
  "first_id": "file-abc123",
  "last_id": "file-abc456",
  "has_more": false
}
```

## 检索向量存储文件批次

**get** `/vector_stores/{vector_store_id}/file_batches/{batch_id}`

检索一个向量存储文件批次。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理完成的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      当前正在处理的文件数量。

    - `total: number`

      文件总数。

  - `object: "vector_store.files_batch"`

    对象类型，始终为 `vector_store.file_batch`.

    - `"vector_store.files_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的状态，可以是 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，该 [文件](/docs/api-reference/files) 附加到该向量存储。

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/file_batches/$BATCH_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "file_counts": {
    "cancelled": 0,
    "completed": 0,
    "failed": 0,
    "in_progress": 0,
    "total": 0
  },
  "object": "vector_store.files_batch",
  "status": "in_progress",
  "vector_store_id": "vector_store_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/file_batches/vsfb_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "vsfb_abc123",
  "object": "vector_store.file_batch",
  "created_at": 1699061776,
  "vector_store_id": "vs_abc123",
  "status": "in_progress",
  "file_counts": {
    "in_progress": 1,
    "completed": 1,
    "failed": 0,
    "cancelled": 0,
    "total": 0,
  }
}
```

## Domain Types

### Vector Store File Batch

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理完成的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      当前正在处理的文件数量。

    - `total: number`

      文件总数。

  - `object: "vector_store.files_batch"`

    对象类型，始终为 `vector_store.file_batch`.

    - `"vector_store.files_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的状态，可以是 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID，该 [文件](/docs/api-reference/files) 附加到该向量存储。
