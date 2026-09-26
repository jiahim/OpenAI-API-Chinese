# 向量存储

> 完整文档索引请参阅 [llms.txt](/llms.txt).可在页面 URL 后追加 `.md` 以获取文档页面的 Markdown 版本。

## 创建向量存储

**post** `/vector_stores`

创建向量存储。

### 正文参数

- `chunking_strategy: optional AutoFileChunkingStrategyParam or StaticFileChunkingStrategyObjectParam`

  用于对文件进行分块的分块策略。如果未设置，则使用 `auto` 策略。仅当 `file_ids` 非空时适用。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `description: optional string`

  向量存储的描述。可用于描述向量存储的用途。

- `expires_after: optional object { anchor, days }`

  向量存储的过期策略。

  - `anchor: "last_active_at"`

    过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

    - `"last_active_at"`

  - `days: number`

    在锚点时间之后向量存储将过期的天数。

- `file_ids: optional array of string`

  一个 [文件](/api/reference/resources/files) ID 的列表，供向量存储使用。可用于 `file_search` 可用于访问文件。

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。这可以
  用于以结构化格式存储有关对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `name: optional string`

  向量存储的名称。

### Returns

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可供以下工具使用 `file_search` 工具使用。

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

      文件总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示该向量存储可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中所有文件占用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      在锚点时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储到期时的 Unix 时间戳（以秒为单位）。

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

## 删除向量存储

**delete** `/vector_stores/{vector_store_id}`

删除向量存储。

### 路径参数

- `vector_store_id: string`

### Returns

- `VectorStoreDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.deleted"`

    - `"vector_store.deleted"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "vector_store.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "vs_abc123",
  "object": "vector_store.deleted",
  "deleted": true
}
```

## 列出向量存储

**get** `/vector_stores`

返回向量存储列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以便获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以便获取列表的上一页。

- `limit: optional number`

  返回对象的数量上限。范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

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

      文件总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示该向量存储可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中所有文件占用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      在锚点时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储到期时的 Unix 时间戳（以秒为单位）。

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
      "bytes": 139920,
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      }
    },
    {
      "id": "vs_abc456",
      "object": "vector_store",
      "created_at": 1699061776,
      "name": "Support FAQ v2",
      "description": null,
      "bytes": 139920,
      "file_counts": {
        "in_progress": 0,
        "completed": 3,
        "failed": 0,
        "cancelled": 0,
        "total": 3
      }
    }
  ],
  "first_id": "vs_abc123",
  "last_id": "vs_abc456",
  "has_more": false
}
```

## 检索向量存储

**get** `/vector_stores/{vector_store_id}`

检索一个向量存储。

### 路径参数

- `vector_store_id: string`

### Returns

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可供以下工具使用 `file_search` 工具使用。

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

      文件总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示该向量存储可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中所有文件占用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      在锚点时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储到期时的 Unix 时间戳（以秒为单位）。

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID \
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
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "vs_abc123",
  "object": "vector_store",
  "created_at": 1699061776
}
```

## 搜索向量存储

**post** `/vector_stores/{vector_store_id}/search`

基于查询和文件属性过滤器在向量存储中搜索相关分块。

### 路径参数

- `vector_store_id: string`

### 正文参数

- `query: string or array of string`

  搜索的查询字符串

  - `string`

  - `array of string`

- `filters: optional ComparisonFilter or CompoundFilter`

  基于文件属性应用的筛选条件。

  - `ComparisonFilter object { key, type, value }`

    用于使用定义的比较运算将指定的属性键与给定值进行比较的筛选条件。

    - `key: string`

      用于与值进行比较的键。

    - `type: "eq" or "ne" or "gt" or 5 more`

      指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

      - `eq`：等于
      - `ne`：不等于
      - `gt`：大于
      - `gte`：大于或等于
      - `lt`：小于
      - `lte`：小于或等于
      - `in`：属于
      - `nin`：不属于

      - `"eq"`

      - `"ne"`

      - `"gt"`

      - `"gte"`

      - `"lt"`

      - `"lte"`

      - `"in"`

      - `"nin"`

    - `value: string or number or boolean or array of string or number`

      用于与属性键进行比较的值；支持字符串、数字或布尔类型。

      - `string`

      - `number`

      - `boolean`

      - `array of string or number`

        - `string`

        - `number`

  - `CompoundFilter object { filters, type }`

    使用以下方式组合多个筛选条件 `and` 或 `or`.

    - `filters: array of ComparisonFilter or unknown`

      要组合的筛选条件数组。条目可以是 `ComparisonFilter` 或 `CompoundFilter`.

      - `ComparisonFilter object { key, type, value }`

        用于使用定义的比较运算将指定的属性键与给定值进行比较的筛选条件。

      - `unknown`

    - `type: "and" or "or"`

      操作类型： `and` 或 `or`.

      - `"and"`

      - `"or"`

- `max_num_results: optional number`

  返回的最大结果数。该数值应在 1 到 50 之间（含）。

- `ranking_options: optional object { ranker, score_threshold }`

  搜索的排序选项。

  - `ranker: optional "none" or "auto" or "default-2024-11-15"`

    启用重排序；设为 `none` 以禁用，这有助于降低延迟。

    - `"none"`

    - `"auto"`

    - `"default-2024-11-15"`

  - `score_threshold: optional number`

- `rewrite_query: optional boolean`

  是否重写用于向量搜索的自然语言查询。

### Returns

- `data: array of object { attributes, content, file_id, 2 more }`

  搜索结果项的列表。

  - `attributes: map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
    最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    文件中的内容分块。

    - `text: string`

      搜索返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的 ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似度分数。

- `has_more: boolean`

  指示是否还有更多结果可供获取。

- `next_page: string or null`

  下一页的令牌（如果有）。

- `object: "vector_store.search_results.page"`

  对象类型，始终为 `vector_store.search_results.page`

  - `"vector_store.search_results.page"`

- `search_query: array of string`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/search \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "query": "string"
        }'
```

#### 响应

```json
{
  "data": [
    {
      "attributes": {
        "foo": "string"
      },
      "content": [
        {
          "text": "text",
          "type": "text"
        }
      ],
      "file_id": "file_id",
      "filename": "filename",
      "score": 0
    }
  ],
  "has_more": true,
  "next_page": "next_page",
  "object": "vector_store.search_results.page",
  "search_query": [
    "string"
  ]
}
```

### 示例

```http
curl -X POST \
https://api.openai.com/v1/vector_stores/vs_abc123/search \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"query": "What is the return policy?", "filters": {...}}'
```

#### 响应

```json
{
  "object": "vector_store.search_results.page",
  "search_query": ["What is the return policy?"],
  "data": [
    {
      "file_id": "file_123",
      "filename": "document.pdf",
      "score": 0.95,
      "attributes": {
        "author": "John Doe",
        "date": "2023-01-01"
      },
      "content": [
        {
          "type": "text",
          "text": "Relevant chunk"
        }
      ]
    },
    {
      "file_id": "file_456",
      "filename": "notes.txt",
      "score": 0.89,
      "attributes": {
        "author": "Jane Smith",
        "date": "2023-01-02"
      },
      "content": [
        {
          "type": "text",
          "text": "Sample text content from the vector store."
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## 修改向量存储

**post** `/vector_stores/{vector_store_id}`

修改一个向量存储。

### 路径参数

- `vector_store_id: string`

### 正文参数

- `expires_after: optional object { anchor, days }  or null`

  向量存储的过期策略。

  - `anchor: "last_active_at"`

    过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

    - `"last_active_at"`

  - `days: number`

    在锚点时间之后向量存储将过期的天数。

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。这可以
  用于以结构化格式存储有关对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `name: optional string or null`

  向量存储的名称。

### Returns

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可供以下工具使用 `file_search` 工具使用。

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

      文件总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示该向量存储可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中所有文件占用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      在锚点时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储到期时的 Unix 时间戳（以秒为单位）。

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID \
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
curl https://api.openai.com/v1/vector_stores/vs_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
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

## 域名类型

### Auto 文件分块策略参数

- `AutoFileChunkingStrategyParam object { type }`

  默认策略。此策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

  - `type: "auto"`

    始终 `auto`.

    - `"auto"`

### 文件分块策略参数

- `FileChunkingStrategyParam = AutoFileChunkingStrategyParam or StaticFileChunkingStrategyObjectParam`

  用于对文件进行分块的分块策略。如果未设置，则使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 其他文件分块策略对象

- `OtherFileChunkingStrategyObject object { type }`

  当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

  - `type: "other"`

    始终 `other`.

    - `"other"`

### 静态文件分块策略

- `StaticFileChunkingStrategy object { chunk_overlap_tokens, max_chunk_size_tokens }`

  - `chunk_overlap_tokens: number`

    块之间重叠的 token 数量。默认值为 `400`.

    请注意，重叠不能超过 `max_chunk_size_tokens`.

  - `max_chunk_size_tokens: number`

    每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

### 静态文件分块策略对象

- `StaticFileChunkingStrategyObject object { static, type }`

  - `static: StaticFileChunkingStrategy`

    - `chunk_overlap_tokens: number`

      块之间重叠的 token 数量。默认值为 `400`.

      请注意，重叠不能超过 `max_chunk_size_tokens`.

    - `max_chunk_size_tokens: number`

      每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

  - `type: "static"`

    始终 `static`.

    - `"static"`

### 静态文件分块策略对象参数

- `StaticFileChunkingStrategyObjectParam object { static, type }`

  通过设置块大小和块重叠来自定义你自己的分块策略。

  - `static: StaticFileChunkingStrategy`

    - `chunk_overlap_tokens: number`

      块之间重叠的 token 数量。默认值为 `400`.

      请注意，重叠不能超过 `max_chunk_size_tokens`.

    - `max_chunk_size_tokens: number`

      每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

  - `type: "static"`

    始终 `static`.

    - `"static"`

### 向量存储

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可供以下工具使用 `file_search` 工具使用。

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

      文件总数。

  - `last_active_at: number or null`

    向量存储最近一次活跃时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `name: string`

    向量存储的名称。

  - `object: "vector_store"`

    对象类型，始终为 `vector_store`.

    - `"vector_store"`

  - `status: "expired" or "in_progress" or "completed"`

    向量存储的状态，可为 `expired`, `in_progress`，或 `completed`。状态为 `completed` 表示该向量存储可供使用。

    - `"expired"`

    - `"in_progress"`

    - `"completed"`

  - `usage_bytes: number`

    向量存储中所有文件占用的总字节数。

  - `expires_after: optional object { anchor, days }`

    向量存储的过期策略。

    - `anchor: "last_active_at"`

      过期策略生效的锚点时间戳。支持以下锚点： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      在锚点时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储到期时的 Unix 时间戳（以秒为单位）。

### 向量存储已删除

- `VectorStoreDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.deleted"`

    - `"vector_store.deleted"`

### 向量存储搜索响应

- `VectorStoreSearchResponse object { attributes, content, file_id, 2 more }`

  - `attributes: map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
    最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    文件中的内容分块。

    - `text: string`

      搜索返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的 ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似度分数。

# 文件批次

## 取消向量存储文件批次

**post** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

取消一个向量存储文件批次。此操作会尽快取消该批次中文件的处理。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### Returns

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳(以秒为单位)。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已被取消的文件数量。

    - `completed: number`

      已被处理的文件数量。

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

    向量存储文件批次的状态,可为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

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
    "total": 15
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

  可附加到对象的 16 组键值对。这可以
  用于以结构化格式存储有关对象的附加信息，
  格式，并通过 API 或控制面板查询对象。键为字符串，
  最大长度为 64 个字符。值为字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，则使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `file_ids: optional array of string`

  一个 [文件](/api/reference/resources/files) ID 的列表，供向量存储使用。可用于 `file_search` 可以访问文件。如果 `attributes` 或 `chunking_strategy` ，它们将应用于批次中的所有文件。最大批次大小为 2000 个文件。该接口推荐用于多文件导入，有助于降低每个向量存储写入请求的压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  一个对象列表，每个对象包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`。当你需要为特定文件覆盖元数据时使用。全局的 `attributes` 或 `chunking_strategy` 将被忽略，并且必须为每个文件指定。最大批次大小为 2000 个文件。该接口推荐用于多文件导入，有助于降低每个向量存储写入请求的压力。与 `file_ids`.

  - `file_id: string`

    一个 [文件](/api/reference/resources/files) ID，向量存储应使用该 ID。适用于像 `file_search` 这样可以访问文件的工具。对于多文件导入，我们推荐 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以最小化每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
    最大长度为 64 个字符。值为字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional FileChunkingStrategyParam`

    用于对文件进行分块的分块策略。如果未设置，则使用 `auto` 策略。

### Returns

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳(以秒为单位)。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已被取消的文件数量。

    - `completed: number`

      已被处理的文件数量。

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

    向量存储文件批次的状态,可为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

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
    "total": 0
  }
}
```

## 批量列出向量存储文件

**get** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/files`

返回批量中的向量存储文件列表。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以便获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以便获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态过滤。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象的数量上限。范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of VectorStoreFile`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

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

### Returns

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳(以秒为单位)。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已被取消的文件数量。

    - `completed: number`

      已被处理的文件数量。

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

    向量存储文件批次的状态,可为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

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
    "total": 0
  }
}
```

## 域名类型

### 向量存储文件批次

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  附加到向量存储的一批文件。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件批次创建时的 Unix 时间戳(以秒为单位)。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已被取消的文件数量。

    - `completed: number`

      已被处理的文件数量。

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

    向量存储文件批次的状态,可为 `in_progress`, `completed`, `cancelled` 或 `failed`.

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

# 文件

## 检索向量存储文件内容

**get** `/vector_stores/{vector_store_id}/files/{file_id}/content`

检索向量存储文件的解析后内容。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### Returns

- `data: array of object { text, type }`

  文件的已解析内容。

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅支持 `"text"`)

- `has_more: boolean`

  指示是否还有更多内容页需要获取。

- `next_page: string or null`

  下一页的令牌（如果有）。

- `object: "vector_store.file_content.page"`

  对象类型，始终为 `vector_store.file_content.page`

  - `"vector_store.file_content.page"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID/content \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "text": "text",
      "type": "type"
    }
  ],
  "has_more": true,
  "next_page": "next_page",
  "object": "vector_store.file_content.page"
}
```

### 示例

```http
curl \
https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123/content \
-H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "file_id": "file-abc123",
  "filename": "example.txt",
  "attributes": {"key": "value"},
  "content": [
    {"type": "text", "text": "..."},
    ...
  ]
}
```

## 创建向量存储文件

**post** `/vector_stores/{vector_store_id}/files`

通过将 [File](/api/reference/resources/files) 附加到 [vector store](/api/reference/resources/vector_stores).

### 路径参数

- `vector_store_id: string`

### 正文参数

- `file_id: string`

  一个 [文件](/api/reference/resources/files) ID，向量存储应使用该 ID。适用于像 `file_search` 这样可以访问文件的工具。对于多文件导入，我们推荐 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以最小化每个向量存储的写入请求。

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的 16 组键值对。这可以
  用于以结构化格式存储有关对象的附加信息，
  格式，并通过 API 或控制面板查询对象。键为字符串，
  最大长度为 64 个字符。值为字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，则使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 为 `800` 和 `chunk_overlap_tokens` 为 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### Returns

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

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

## 删除向量存储文件

**delete** `/vector_stores/{vector_store_id}/files/{file_id}`

删除一个向量存储文件。这将从向量存储中移除该文件，但文件本身不会被删除。如需删除文件，请使用 [delete file](/api/reference/resources/files/methods/delete) 接口。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### Returns

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "vector_store.file.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "vector_store.file.deleted",
  "deleted": true
}
```

## 列出向量存储文件

**get** `/vector_stores/{vector_store_id}/files`

返回向量存储文件的列表。

### 路径参数

- `vector_store_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以便获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个用于定义列表中位置的对象 ID。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以便获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态过滤。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象的数量上限。范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of VectorStoreFile`

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

      - `type: "other"`

        始终 `other`.

        - `"other"`

- `first_id: string`

- `has_more: boolean`

- `last_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files \
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
curl https://api.openai.com/v1/vector_stores/vs_abc123/files \
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

## 检索向量存储文件

**get** `/vector_stores/{vector_store_id}/files/{file_id}`

检索一个向量存储文件。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### Returns

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "created_at": 1699061776,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null
}
```

## 更新向量存储文件属性

**post** `/vector_stores/{vector_store_id}/files/{file_id}`

更新向量存储文件上的属性。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 正文参数

- `attributes: map[string or number or boolean] or null`

  可附加到对象的 16 组键值对。这可以
  用于以结构化格式存储有关对象的附加信息，
  格式，并通过 API 或控制面板查询对象。键为字符串，
  最大长度为 64 个字符。值为字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

### Returns

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 示例

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/files/$FILE_ID \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "attributes": {
            "foo": "string"
          }
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
curl https://api.openai.com/v1/vector_stores/{vector_store_id}/files/{file_id} \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"attributes": {"key1": "value1", "key2": 2}}'
```

#### 响应

```json
{
  "id": "file-abc123",
  "object": "vector_store.file",
  "usage_bytes": 1234,
  "created_at": 1699061776,
  "vector_store_id": "vs_abcd",
  "status": "completed",
  "last_error": null,
  "chunking_strategy": {...},
  "attributes": {"key1": "value1", "key2": 2}
}
```

## 域名类型

### 文件内容响应

- `FileContentResponse object { text, type }`

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅支持 `"text"`)

### 向量存储文件

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    该向量存储文件创建时的 Unix 时间戳（单位：秒）。

  - `last_error: object { code, message }  or null`

    与该向量存储文件关联的最后一个错误。若无错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      人类可读的错误描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可能为 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（单位：字节）。请注意，该值可能与原始文件大小不同。

  - `vector_store_id: string`

    所关联的 [向量存储](/api/reference/resources/vector_stores) 的 ID,以及该文件批次 [文件](/api/reference/resources/files) 所附加到的对象。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。这可以
    用于以结构化格式存储有关对象的附加信息，
    格式，并通过 API 或控制面板查询对象。键为字符串，
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

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此错误。通常是因为文件在引入该概念的 接口 版本之前已被索引。 `chunking_strategy` concept was introduced in the API.

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 向量存储文件已删除

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`
