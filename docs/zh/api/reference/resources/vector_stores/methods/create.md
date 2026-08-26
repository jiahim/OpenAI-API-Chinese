> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建向量存储

**post** `/vector_stores`

创建向量存储。

### 请求体参数

- `chunking_strategy: optional AutoFileChunkingStrategyParam or StaticFileChunkingStrategyObjectParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。仅在 `file_ids` 非空时适用。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的令牌数。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大令牌数。默认值为 `800`。最小值为 `100` 且最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `description: optional string`

  向量存储的描述。可用于描述向量存储的用途。

- `expires_after: optional object { anchor, days }`

  向量存储的过期策略。

  - `anchor: "last_active_at"`

    过期策略生效的锚定时间戳。支持的锚点： `last_active_at`.

    - `"last_active_at"`

  - `days: number`

    锚定时间之后的天数，届时向量存储将过期。

- `file_ids: optional array of string`

  一份 [文件](/docs/api-reference/files) 向量存储应使用的 ID。适用于像 `file_search` 这样可访问文件的工具。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 组键值对。这可用于
  以结构化格式存储关于对象的附加信息，
  并通过 API 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `name: optional string`

  向量存储的名称。

### 返回

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可供 `file_search` 工具使用。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储创建时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数量。

    - `completed: number`

      已成功处理的文件数量。

    - `failed: number`

      处理失败的文件数量。

    - `in_progress: number`

      当前正在处理的文件数量。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储最后一次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    可附加到对象上的 16 个键值对集合。这可
    用于以结构化格式存储关于该对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可以是 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示向量存储已准备好使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中文件使用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略适用的锚定时间戳。支持的锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储过期的天数。

  - `expires_at: optional number or null`

    向量存储过期的 Unix 时间戳（秒）。

### 示例

```http
curl https://api.openai.com/v1/vector_stores \
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
  "last_active_at": 0,
  "metadata": {
    "foo": "string"
  },
  "name": "name",
  "object": "vector_store",
  "status": "expired",
  "usage_bytes": 0,
  "expires_after": {
    "anchor": "last_active_at",
    "days": 1
  },
  "expires_at": 0
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "name": "Support FAQ"
  }'
```

#### 响应

```json
{
  "id": "vs_abc123",
  "object": "vector_store",
  "created_at": 1699061776,
  "name": "Support FAQ",
  "description": "Contains commonly asked questions and answers, organized by topic.",
  "bytes": 139920,
  "file_counts": {
    "in_progress": 0,
    "completed": 3,
    "failed": 0,
    "cancelled": 0,
    "total": 3
  }
}
```
