> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 取消向量存储文件批处理

**post** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

取消向量存储文件批次。此操作将尽快尝试取消该批次中文件的处理。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一组文件。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理的文件数量。

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

    }}的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该 [文件](/docs/api-reference/files) 附加到该存储。

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
