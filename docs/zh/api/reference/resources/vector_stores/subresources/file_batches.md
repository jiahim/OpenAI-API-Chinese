# 文件批次

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 取消向量存储文件批处理

**post** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

取消一个向量存储文件批次。这会尽快尝试取消该批次中文件的处理。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次的创建时间的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      正在处理中的文件数量。

    - `total: number`

      文件的总数。

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

    所附加到的 [vector store](/api/reference/resources/vector_stores) 的 ID，该 [File](/api/reference/resources/files) 为该向量存储文件批次所属的向量存储的 ID。

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

创建向量存储文件批次。

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `attributes: optional map[string or number or boolean] or null`

  由 16 个键值对组成的集合，可附加到对象上。这可用于
  以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。键是
  格式，并通过 接口 或仪表板查询对象。键是字符串，最多
  64 个字符；值是字符串（最多 512 个字符）、布尔值或数字。
  512 个字符的字符串、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。该策略目前使用 `max_chunk_size_tokens` ，分块大小为 `800` ，分块重叠为 `chunk_overlap_tokens` ，分块大小为 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的 token 数。默认值为 `400`.

        。请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        的每个分块所包含的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `file_ids: optional array of string`

  一个由 [File](/api/reference/resources/files) 组成的 ID 列表，供向量存储使用。适用于可以访问文件的 `file_search` 等工具。如果 `attributes` 或 `chunking_strategy` ，则会应用于批量中的所有文件。最大批量大小为 2000 个文件。建议将此端点用于多文件导入，有助于降低每个向量存储的写入请求压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  包含以下内容的对象列表：每个对象都包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`。当你需要为特定文件覆盖元数据时使用。全局 `attributes` 或 `chunking_strategy` 将被忽略，并且必须为每个文件指定。最大批量大小为 2000 个文件。建议将此端点用于多文件导入，有助于降低每个向量存储的写入请求压力。与 `file_ids`.

  - `file_id: string`

    一个 [File](/api/reference/resources/files) ，用于标识向量存储应使用的 ID。可供能够访问文件的工具（如 `file_search` ）使用。对于多文件导入，我们推荐使用 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以最小化每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    由 16 个键值对组成的集合，可附加到对象上。这可用于
    以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。键是
    格式，并通过 接口 或仪表板查询对象。键是字符串，最多
    64 个字符；值是字符串（最多 512 个字符）、布尔值或数字。
    512 个字符的字符串、布尔值或数字。

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

    向量存储文件批次的创建时间的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      正在处理中的文件数量。

    - `total: number`

      文件的总数。

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

    所附加到的 [vector store](/api/reference/resources/vector_stores) 的 ID，该 [File](/api/reference/resources/files) 为该向量存储文件批次所属的向量存储的 ID。

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

返回某批次中向量存储文件的列表。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于指示你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于指示你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态筛选。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象数量的上限。Limit 的取值范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。如果没有错误则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      可选值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      对错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。之一。该状态 `completed` 表示该向量存储文件已可以使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加到的 [vector store](/api/reference/resources/vector_stores) 的 ID，该 [File](/api/reference/resources/files) 为该向量存储文件批次所属的向量存储的 ID。

  - `attributes: optional map[string or number or boolean] or null`

    由 16 个键值对组成的集合，可附加到对象上。这可用于
    以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。键是
    格式，并通过 接口 或仪表板查询对象。键是字符串，最多
    64 个字符；值是字符串（最多 512 个字符）、布尔值或数字。
    512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块切分的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的 token 数。默认值为 `400`.

          。请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的每个分块所包含的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当 chunking 策略未知时会返回此错误。通常是因为文件是在 `chunking_strategy` 这一概念被引入 API 之前被索引的。

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

    向量存储文件批次的创建时间的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      正在处理中的文件数量。

    - `total: number`

      文件的总数。

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

    所附加到的 [vector store](/api/reference/resources/vector_stores) 的 ID，该 [File](/api/reference/resources/files) 为该向量存储文件批次所属的向量存储的 ID。

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

    向量存储文件批次的创建时间的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      正在处理中的文件数量。

    - `total: number`

      文件的总数。

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

    所附加到的 [vector store](/api/reference/resources/vector_stores) 的 ID，该 [File](/api/reference/resources/files) 为该向量存储文件批次所属的向量存储的 ID。
