> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 创建向量存储文件批次

**post** `/vector_stores/{vector_store_id}/file_batches`

创建向量存储文件批次。

### 路径参数

- `vector_store_id: string`

### 正文参数

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储关于对象的附加信息，并通过
  格式存储关于对象的附加信息，并通过 API 或控制面板查询对象。键为字符串，
  最大长度为 64 个字符。值为字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 该策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      Always `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      Always `static`.

      - `"static"`

- `file_ids: optional array of string`

  一个 [File](/docs/api-reference/files) ID 列表，向量存储应使用这些 ID。适用于 `file_search` 可以访问文件。如果 `attributes` 或 `chunking_strategy` 已提供，它们将应用于该批中的所有文件。最大批大小为 2000 个文件。此端点推荐用于多文件导入，有助于减少每个向量存储的写入请求压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  一个对象列表，其中每个对象都包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`. 用于需要在特定文件上覆盖元数据时。全局 `attributes` 或 `chunking_strategy` 会被忽略，并且必须为每个文件单独指定。单批次最大文件数为 2000。建议在多文件接入场景中使用此端点，以降低每个向量存储写入请求的压力。与以下操作互斥： `file_ids`.

  - `file_id: string`

    一个 [File](/docs/api-reference/files) ，即向量存储应使用的 ID。可用于类似 `file_search` 之类的工具访问文件。对于多文件接入，我们推荐使用 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) ，以最大程度减少每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储关于对象的附加信息，并通过
    格式存储关于对象的附加信息，并通过 API 或控制面板查询对象。键为字符串，
    最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional FileChunkingStrategyParam`

    用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 该策略。

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

      处理失败的的文件数量。

    - `in_progress: number`

      当前正在处理的的文件数量。

    - `total: number`

      文件的总数。

  - `object: "vector_store.files_batch"`

    对象类型，始终为 `vector_store.file_batch`.

    - `"vector_store.files_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的，可以为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所附加到的 [向量存储](/docs/api-reference/vector-stores/object) 的 ID。 [File](/docs/api-reference/files) 。

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
