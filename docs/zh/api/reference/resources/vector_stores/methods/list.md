> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 列出向量存储

**get** `/vector_stores`

返回向量存储列表。

### 查询参数

- `after: optional string`

  用于分页游标的对象。 `after` 是用于标识你在列表中所处位置的对象 ID。例如，如果你发起列表请求并收到 100 个对象，最后一个为 obj_foo，那么后续调用可以传入 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页游标的对象。 `before` 是用于标识你在列表中所处位置的对象 ID。例如，如果你发起列表请求并收到 100 个对象，第一个为 obj_foo，那么后续调用可以传入 before=obj_foo 以获取列表的上一页。

- `limit: optional number`

  返回对象的数量上限。范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回值

- `data: array of VectorStore`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储创建时的 Unix 时间戳（以秒为单位）。

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

      文件的总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储有关对象的附加信息，并通过 API 或控制面板查询对象。
    格式，并通过 接口 或控制面板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可能为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示向量存储已可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中文件使用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚定时间戳。支持以下锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      向量存储将在锚定时间之后过期的天数。

  - `expires_at: optional number or null`

    向量存储过期的 Unix 时间戳（以秒为单位）。

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/vector_stores \
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
  ],
  "first_id": "vs_abc123",
  "has_more": false,
  "last_id": "vs_abc456",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores \
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
      "id": "vs_abc123",
      "object": "vector_store",
      "created_at": 1699061776,
      "name": "Support FAQ",
      "description": "Contains commonly asked questions and answers, organized by topic.",
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      },
      "usage_bytes": 139920,
      "status": "completed",
      "last_active_at": null,
      "metadata": {}
    },
    {
      "id": "vs_abc456",
      "object": "vector_store",
      "created_at": 1699061776,
      "name": "Support FAQ v2",
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      },
      "usage_bytes": 139920,
      "status": "completed",
      "last_active_at": null,
      "metadata": {}
    }
  ],
  "first_id": "vs_abc123",
  "last_id": "vs_abc456",
  "has_more": false
}
```
