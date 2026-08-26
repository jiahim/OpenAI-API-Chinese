> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在 `.md` 后追加该字符串获得。

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

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（秒）。

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

    向量存储文件批次的状态，可为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    该 [向量存储](/docs/api-reference/vector-stores/object) 的 ID， [文件](/docs/api-reference/files) 附加于其中。

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
