> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## Create vector store file batch

**post** `/vector_stores/{vector_store_id}/file_batches`

创建向量存储文件批次。

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `attributes: optional map[string or number or boolean] or null`

  一组 16 个键值对，可附加到对象上。可用于
  以结构化格式存储对象的附加信息，并通过 接口
  API 或仪表板查询对象。键为字符串，长度
  上限为 64 个字符；值为字符串、布尔值或数字，长度
  上限为 512 个字符。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。该策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数。默认值为 `400`.

        请注意，重叠不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块的最大 token 数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `file_ids: optional array of string`

  一个 [文件](/api/reference/resources/files) ID 列表，向量存储应使用这些 ID。适用于 `file_search` 可以访问文件的工具。如果 `attributes` 或 `chunking_strategy` 已提供，它们将应用于该批次中的所有文件。最大批次大小为 2000 个文件。推荐将此接口用于多文件接入，有助于降低每个向量存储写入请求的压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  一个对象列表，每个对象都包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`。当你需要为特定文件覆盖元数据时使用此选项。全局的 `attributes` 或 `chunking_strategy` 将被忽略，必须为每个文件单独指定。最大批次大小为 2000 个文件。推荐将此接口用于多文件接入，有助于降低每个向量存储写入请求的压力。与 `file_ids`.

  - `file_id: string`

    一个 [文件](/api/reference/resources/files) 向量存储应使用的 ID。适用于像 `file_search` 这样可以访问文件的工具。对于多文件接入，我们推荐使用 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以最小化每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。可用于
    以结构化格式存储对象的附加信息，并通过 接口
    API 或仪表板查询对象。键为字符串，长度
    上限为 64 个字符；值为字符串、布尔值或数字，长度
    上限为 512 个字符。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional FileChunkingStrategyParam`

    用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

### Returns

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    标识符，可以在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳（以秒为单位）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已处理完成的文件数量。

    - `failed: number`

      处理失败的文件的数量。

    - `in_progress: number`

      当前正在处理的文件的数量。

    - `total: number`

      文件的总数。

  - `object: "vector_store.file_batch"`

    对象类型，恒为 `vector_store.file_batch`.

    - `"vector_store.file_batch"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件批次的状态，可以是 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    的 ID [向量存储](/api/reference/resources/vector_stores) 所属 [文件](/api/reference/resources/files) 所附加的。

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
  "object": "vector_store.file_batch",
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
    "total": 0
  }
}
```
